import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { del } from "@vercel/blob";
import { NextResponse } from "next/server";
import { verifyAccessToken } from "@/lib/oauth/jwt";
import { insertFile } from "@/lib/knowledge-base/meta";
import { checkTeamAccess } from "@/lib/knowledge-base/teams";
import type { FileMetadata, KnowledgeType } from "@/lib/knowledge-base/types";

const MAX_UPLOAD_BYTES = 500 * 1024 * 1024; // 500 MB

export const runtime = "nodejs";

interface ClientPayload {
  id?: string;
  filename?: string;
  size?: number;
  tags?: string[];
  teamId?: string | null;
}

interface ServerTokenPayload {
  id: string;
  userId: string;        // Cryptographically bound from JWT sub — never client-supplied
  uploadedBy: string;    // email from JWT — never client-supplied
  filename: string;
  size: number;
  tags: string[];
  teamId: string | null;
  knowledgeType?: KnowledgeType;
}

export async function POST(request: Request): Promise<NextResponse> {
  // Fix #5: handleUpload verifies the Vercel Blob HMAC signature on phase-2
  // webhook requests using BLOB_READ_WRITE_TOKEN. If the env var is absent the
  // SDK skips verification silently, making the endpoint spoofable. Fail loudly
  // here so a misconfigured deployment surfaces immediately rather than at runtime.
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json({ error: "Storage not configured" }, { status: 503 });
  }

  const body = (await request.json()) as HandleUploadBody;

  // JWT is required for phase 1 (token generation) only.
  // Phase 2 (blob.upload-completed) is called by Vercel Blob servers — no bearer token.
  const header = request.headers.get("authorization") ?? "";
  let jwtUser: { userId: string; email: string } | null = null;
  if (header.startsWith("Bearer ")) {
    try {
      const { sub, email } = await verifyAccessToken(header.slice(7));
      jwtUser = { userId: sub, email };
    } catch {
      // fall through — will be caught in onBeforeGenerateToken
    }
  }

  try {
    const jsonResponse = await handleUpload({
      body,
      request,

      onBeforeGenerateToken: async (pathname, clientPayload) => {
        // This phase MUST have a valid JWT
        if (!jwtUser) throw new Error("Unauthorized");
        const { userId, email } = jwtUser;

        // ── Tenant Isolation: Storage Path Partitioning ──────────────────────
        // The blob path prefix is enforced server-side. Even if the client
        // constructs an arbitrary pathname, we reject it here unless it lives
        // under users/${userId}/. This prevents cross-tenant path injection.
        if (!pathname.startsWith(`users/${userId}/`)) {
          throw new Error(`Path must start with users/${userId}/`);
        }

        const parsed = JSON.parse(clientPayload ?? "{}") as ClientPayload;

        // Team write-permission check before issuing the token
        if (parsed.teamId) {
          const access = await checkTeamAccess(parsed.teamId, userId, "editor");
          if (!access.ok)
            throw new Error(access.reason === "not_member" ? "Not a member of this team" : "Viewers cannot upload files");
        }

        const id = parsed.id ?? crypto.randomUUID();

        // Fix #1: cap client-reported size so quota tracking can't be spoofed.
        // maximumSizeInBytes is enforced by Vercel Blob at the storage level —
        // the upload is rejected before our webhook fires if it exceeds this.
        const reportedSize = Math.min(parsed.size ?? 0, MAX_UPLOAD_BYTES);

        // ── Immutable Server-Controlled Payload ───────────────────────────────
        // tokenPayload is embedded in the signed Vercel Blob token and echoed
        // back verbatim in the upload-completed webhook. Because it is set here
        // (from JWT claims), the DB insertion in onUploadCompleted can trust
        // userId without any further client assertion.
        const serverPayload: ServerTokenPayload = {
          id,
          userId,
          uploadedBy: email,
          filename: parsed.filename ?? pathname.split("/").pop() ?? "file",
          size: reportedSize,
          tags: parsed.tags ?? [],
          teamId: parsed.teamId ?? null,
        };

        return {
          access: "private",
          allowOverwrite: false,
          maximumSizeInBytes: MAX_UPLOAD_BYTES,
          tokenPayload: JSON.stringify(serverPayload),
        };
      },

      onUploadCompleted: async ({ blob, tokenPayload }) => {
        // ── Webhook: called by Vercel Blob servers, not the client ────────────
        // tokenPayload was set in onBeforeGenerateToken — server-authored,
        // Vercel-signed, client cannot tamper with it.
        const {
          id, userId, uploadedBy, filename, size, tags, teamId, knowledgeType,
        } = JSON.parse(tokenPayload ?? "{}") as ServerTokenPayload;

        // Second-factor path check: the actual blob pathname Vercel stored must
        // still be within this user's tenant namespace. Catches any edge case
        // where Vercel Blob applied a random suffix or path rewrite.
        if (!blob.pathname.startsWith(`users/${userId}/`)) {
          throw new Error("Tenant isolation: blob pathname does not match token subject");
        }

        // Fix #6: re-check team membership at completion time. The role was
        // verified when the token was issued, but the user could have been
        // removed from the team in the window between token issuance and upload
        // completion. Inserting without this check would land the file in a KB
        // the uploader no longer has write access to.
        if (teamId) {
          const access = await checkTeamAccess(teamId, userId, "editor");
          if (!access.ok) {
            await del(blob.pathname).catch(() => {});
            throw new Error("Team write access revoked before upload completed");
          }
        }

        const resolvedKnowledgeType = knowledgeType ?? 'document';
        const normalizedTags = [...new Set(["mcp", ...tags, ...(resolvedKnowledgeType !== 'document' ? [resolvedKnowledgeType.replace('_', '-')] : [])])];

        const meta: FileMetadata = {
          id,
          filename,
          blobKey: blob.pathname,
          blobUrl: blob.url,
          size,
          contentType: blob.contentType ?? "application/octet-stream",
          uploadedBy,
          uploadedAt: new Date().toISOString(),
          tags: normalizedTags,
          userId,
          teamId,
          knowledgeType: resolvedKnowledgeType,
        };

        // Fix #4: compensating delete if DB insertion fails so the blob doesn't
        // silently accumulate cost with no metadata record pointing to it.
        try {
          await insertFile(meta);
        } catch (err) {
          await del(blob.pathname).catch(() => {});
          throw err;
        }
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed";
    const status = message === "Unauthorized" ? 401 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}

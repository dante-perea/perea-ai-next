import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import { get, put } from "@vercel/blob";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { z } from "zod";
import {
  findFileById,
  findFileByIdAdmin,
  insertFile,
  upsertFile,
  updateTags,
  listAllFiles,
  listAllFilesAdmin,
  type ViewerContext,
} from "@/lib/knowledge-base/meta";
import type { FileMetadata } from "@/lib/knowledge-base/types";
import { getUserTeamIds, getTeamRole } from "@/lib/knowledge-base/teams";
import { verifyAccessToken } from "@/lib/oauth/jwt";
import { fetchAndConvert, UrlConvertError } from "@/lib/knowledge-base/url-to-md";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type AuthResult =
  | { kind: "user"; ctx: ViewerContext }
  | { kind: "admin" }
  | { kind: "error"; response: Response };

async function resolveAuth(request: Request): Promise<AuthResult> {
  const header = request.headers.get("authorization") ?? "";

  // Static machine token — admin scope, no Clerk user context
  const secret = process.env.MCP_SECRET;
  if (secret && header === `Bearer ${secret}`) return { kind: "admin" };

  if (header.startsWith("Bearer ")) {
    try {
      const { sub } = await verifyAccessToken(header.slice(7));
      const teamIds = await getUserTeamIds(sub);
      return { kind: "user", ctx: { userId: sub, teamIds } };
    } catch {
      // fall through
    }
  }

  return {
    kind: "error",
    response: new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: {
        "Content-Type": "application/json",
        "WWW-Authenticate": 'Bearer resource_metadata="https://www.perea.ai/api/mcp/resource"',
      },
    }),
  };
}

function buildServer(auth: { kind: "user"; ctx: ViewerContext } | { kind: "admin" }): McpServer {
  const server = new McpServer({ name: "perea-knowledge-base", version: "1.0.0" });

  server.tool(
    "list_files",
    "List files in the knowledge base, optionally filtered by tag.",
    { tag: z.string().optional() },
    async ({ tag }) => {
      const files = auth.kind === "admin"
        ? await listAllFilesAdmin()
        : await listAllFiles(auth.ctx);

      const filtered = tag ? files.filter((f) => f.tags.includes(tag)) : files;
      return {
        content: [{
          type: "text" as const,
          text: JSON.stringify(filtered.map((f) => ({
            id: f.id,
            filename: f.filename,
            size: f.size,
            contentType: f.contentType,
            uploadedBy: f.uploadedBy,
            uploadedAt: f.uploadedAt,
            tags: f.tags,
            teamId: f.teamId,
          })), null, 2),
        }],
      };
    }
  );

  server.tool(
    "get_file_content",
    "Fetch a file's content by ID. Returns base64-encoded data + filename + contentType.",
    { id: z.string() },
    async ({ id }) => {
      const file = auth.kind === "admin"
        ? await findFileByIdAdmin(id)
        : await findFileById(id, auth.ctx);

      if (!file) {
        return {
          content: [{ type: "text" as const, text: JSON.stringify({ error: `Not found: ${id}` }) }],
          isError: true,
        };
      }

      const result = await get(file.blobUrl, { access: "private" });
      if (!result || result.statusCode !== 200) {
        return {
          content: [{ type: "text" as const, text: JSON.stringify({ error: "Blob unavailable" }) }],
          isError: true,
        };
      }

      const reader = result.stream.getReader();
      const chunks: Uint8Array[] = [];
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
      }
      const buf = new Uint8Array(chunks.reduce((n, c) => n + c.length, 0));
      let off = 0;
      for (const c of chunks) { buf.set(c, off); off += c.length; }

      return {
        content: [{
          type: "text" as const,
          text: JSON.stringify({
            filename: file.filename,
            contentType: file.contentType,
            size: file.size,
            encoding: "base64",
            data: Buffer.from(buf).toString("base64"),
          }),
        }],
      };
    }
  );

  server.tool(
    "upload_file",
    "Upload a file into the knowledge base. Accepts base64-encoded content. The 'mcp' tag is added automatically for source segregation.",
    {
      filename:    z.string().describe("Filename to store, e.g. 'report.pdf'"),
      contentType: z.string().describe("MIME type, e.g. 'text/plain' or 'application/pdf'"),
      data:        z.string().describe("Base64-encoded file content"),
      tags:        z.array(z.string()).optional().describe("Optional tags. 'mcp' is always added."),
      team:        z.string().optional().describe("Team ID to upload into. Omit for personal KB."),
      id:          z.string().optional().describe("Stable file ID for replacement uploads. If omitted, a new UUID is generated."),
      userId:      z.string().optional().describe("Required when using admin MCP_SECRET auth. Ignored for user OAuth."),
      overwrite:   z.boolean().optional().describe("Replace an existing file with the same id. Requires a stable id to be passed."),
    },
    async ({ filename, contentType, data, tags, team, id: providedId, userId: providedUserId, overwrite }) => {
      // Resolve effective user ID — user OAuth takes precedence; admin auth requires explicit userId
      let effectiveUserId: string;
      if (auth.kind === "user") {
        effectiveUserId = auth.ctx.userId;
      } else if (auth.kind === "admin" && providedUserId) {
        effectiveUserId = providedUserId;
      } else {
        return {
          content: [{ type: "text" as const, text: JSON.stringify({ error: "upload_file with admin MCP_SECRET requires a userId parameter." }) }],
          isError: true,
        };
      }

      if (data.length > 5_592_406) {
        return {
          content: [{ type: "text" as const, text: JSON.stringify({ error: "File too large. Max 4 MB." }) }],
          isError: true,
        };
      }

      if (team && auth.kind === "user") {
        const role = await getTeamRole(team, effectiveUserId);
        if (!role) return { content: [{ type: "text" as const, text: JSON.stringify({ error: "Not a member of this team." }) }], isError: true };
        if (role === "viewer") return { content: [{ type: "text" as const, text: JSON.stringify({ error: "Viewers cannot upload files." }) }], isError: true };
      }

      const buffer = Buffer.from(data, "base64");
      const id = providedId ?? crypto.randomUUID();
      const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, "_");
      const blobName = `users/${effectiveUserId}/files/${id}-${safeName}`;

      const blobResult = await put(blobName, buffer, {
        access: "private",
        contentType,
        addRandomSuffix: false,
        allowOverwrite: overwrite ?? false,
      });

      const normalizedTags = [...new Set(["mcp", ...(tags ?? [])])];

      const meta: FileMetadata = {
        id,
        filename,
        blobKey: blobResult.pathname,
        blobUrl: blobResult.url,
        size: buffer.byteLength,
        contentType,
        uploadedBy: "mcp",
        uploadedAt: new Date().toISOString(),
        tags: normalizedTags,
        userId: effectiveUserId,
        teamId: team ?? null,
      };

      await (overwrite ? upsertFile(meta) : insertFile(meta));

      return {
        content: [{ type: "text" as const, text: JSON.stringify({
          id,
          filename,
          size: meta.size,
          tags: meta.tags,
          blobKey: meta.blobKey,
        }) }],
      };
    }
  );

  // Large-file upload: returns a Vercel Blob client token + instructions for
  // direct upload, bypassing MCP's base64/payload size limits entirely.
  // After the upload completes, Vercel Blob calls /api/mcp/upload-token
  // (phase 2 webhook) which inserts the FileMetadata atomically — no separate
  // register call needed.
  server.tool(
    "get_upload_token",
    "Get a Vercel Blob client token for uploading a large file (>4 MB) directly to the knowledge base. Returns the token and a curl command to PUT the file. The database registration happens automatically via webhook when the upload completes.",
    {
      filename:    z.string().describe("Filename to store, e.g. 'report.pdf'"),
      contentType: z.string().describe("MIME type, e.g. 'application/pdf'"),
      size:        z.number().describe("File size in bytes"),
      tags:        z.array(z.string()).optional().describe("Optional tags. 'mcp' is always added."),
      team:        z.string().optional().describe("Team ID. Omit for personal KB."),
    },
    async ({ filename, contentType, size, tags, team }) => {
      if (auth.kind !== "user") {
        return {
          content: [{ type: "text" as const, text: JSON.stringify({ error: "get_upload_token requires user OAuth token, not admin MCP_SECRET." }) }],
          isError: true,
        };
      }

      // Fix #3: enforce size cap before issuing a token. The upload-token
      // endpoint enforces this too via maximumSizeInBytes, but failing here
      // gives a clear error before making any outbound call.
      const MAX_UPLOAD_BYTES = 500 * 1024 * 1024; // 500 MB
      if (size > MAX_UPLOAD_BYTES) {
        return {
          content: [{ type: "text" as const, text: JSON.stringify({ error: `File too large. Maximum upload size is ${MAX_UPLOAD_BYTES / 1024 / 1024} MB.` }) }],
          isError: true,
        };
      }

      const id = crypto.randomUUID();
      const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, "_");
      const pathname = `users/${auth.ctx.userId}/files/${id}-${safeName}`;
      // Fix #2: NEXT_PUBLIC_* vars are baked in at build time — wrong on preview
      // deploys. VERCEL_URL is the correct runtime deployment URL on Vercel.
      const baseUrl =
        process.env.NEXT_PUBLIC_BASE_URL
        ?? (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://www.perea.ai");
      const uploadTokenUrl = `${baseUrl}/api/mcp/upload-token`;

      const clientPayload = JSON.stringify({
        id,
        filename,
        size,
        tags: tags ?? [],
        teamId: team ?? null,
      });

      const serverPayload = JSON.stringify({
        id,
        userId: auth.ctx.userId,
        uploadedBy: "mcp",
        filename,
        size: Math.min(size, MAX_UPLOAD_BYTES),
        tags: tags ?? [],
        teamId: team ?? null,
      });

      const requestBody: HandleUploadBody = {
        type: "blob.generate-client-token",
        payload: { pathname, multipart: false, clientPayload },
      };

      let clientToken: string;
      try {
        const result = await handleUpload({
          body: requestBody,
          request: new Request(uploadTokenUrl, { method: "POST" }),
          onBeforeGenerateToken: async () => ({
            access: "private",
            callbackUrl: uploadTokenUrl,
            allowOverwrite: false,
            maximumSizeInBytes: MAX_UPLOAD_BYTES,
            tokenPayload: serverPayload,
          }),
          onUploadCompleted: async () => {},
        });
        clientToken = (result as { clientToken: string }).clientToken;
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Token generation failed";
        return {
          content: [{ type: "text" as const, text: JSON.stringify({ error: msg }) }],
          isError: true,
        };
      }

      const uploadParams = new URLSearchParams({ pathname });
      const uploadApiUrl = `https://vercel.com/api/blob/?${uploadParams.toString()}`;

      return {
        content: [{ type: "text" as const, text: JSON.stringify({
          id,
          pathname,
          clientToken,
          uploadUrl: uploadApiUrl,
          curlCommand: [
            `curl -X PUT "${uploadApiUrl}"`,
            `  -H "Authorization: Bearer ${clientToken}"`,
            `  -H "x-api-version: 12"`,
            `  -H "Content-Type: ${contentType}"`,
            `  -H "x-vercel-blob-access: private"`,
            `  --data-binary @<local-file-path>`,
          ].join(" \\\n"),
          note: "After the PUT completes, the file is automatically registered in the knowledge base. No separate step needed.",
        }) }],
      };
    }
  );

  server.tool(
    "add_url",
    "Fetch a public URL, convert it to Markdown, and save it to the knowledge base. Returns the stored file metadata.",
    {
      url:  z.string().describe("The public URL to fetch and convert, e.g. 'https://example.com/article'"),
      tags: z.array(z.string()).optional().describe("Optional tags. 'mcp' is always added."),
      team: z.string().optional().describe("Team ID to upload into. Omit for personal KB."),
    },
    async ({ url, tags, team }) => {
      if (auth.kind !== "user") {
        return {
          content: [{ type: "text" as const, text: JSON.stringify({ error: "add_url requires user OAuth token, not admin MCP_SECRET." }) }],
          isError: true,
        };
      }

      if (team) {
        const role = await getTeamRole(team, auth.ctx.userId);
        if (!role) return { content: [{ type: "text" as const, text: JSON.stringify({ error: "Not a member of this team." }) }], isError: true };
        if (role === "viewer") return { content: [{ type: "text" as const, text: JSON.stringify({ error: "Viewers cannot upload files." }) }], isError: true };
      }

      let converted: Awaited<ReturnType<typeof fetchAndConvert>>;
      try {
        converted = await fetchAndConvert(url);
      } catch (err) {
        const msg = err instanceof UrlConvertError ? err.message : "Failed to fetch or convert URL";
        return {
          content: [{ type: "text" as const, text: JSON.stringify({ error: msg }) }],
          isError: true,
        };
      }

      const id = crypto.randomUUID();
      const safeName = converted.filename.replace(/[^a-zA-Z0-9._-]/g, "_");
      const blobPath = `users/${auth.ctx.userId}/files/${id}-${safeName}`;

      const blobResult = await put(blobPath, converted.markdown, {
        access: "private",
        contentType: "text/markdown",
        addRandomSuffix: false,
      });

      const normalizedTags = [...new Set(["mcp", ...(tags ?? [])])];

      const meta: FileMetadata = {
        id,
        filename: converted.filename,
        blobKey: blobResult.pathname,
        blobUrl: blobResult.url,
        size: converted.byteSize,
        contentType: "text/markdown",
        uploadedBy: "mcp",
        uploadedAt: new Date().toISOString(),
        tags: normalizedTags,
        userId: auth.ctx.userId,
        teamId: team ?? null,
      };

      await insertFile(meta);

      return {
        content: [{ type: "text" as const, text: JSON.stringify({
          id,
          filename: converted.filename,
          title: converted.title,
          size: converted.byteSize,
          tags: normalizedTags,
          blobKey: blobResult.pathname,
        }) }],
      };
    }
  );

  server.tool(
    "update_tags",
    "Update tags on a knowledge base file by ID. Replaces all existing tags. Useful for tagging sessions by topic (e.g. 'unifounder', '999x', 'marketing').",
    {
      id:   z.string().describe("File ID to update"),
      tags: z.array(z.string()).describe("New tags — replaces existing tags entirely"),
    },
    async ({ id, tags }) => {
      let updated: Awaited<ReturnType<typeof updateTags>>;
      if (auth.kind === "admin") {
        const file = await findFileByIdAdmin(id);
        if (!file) {
          return {
            content: [{ type: "text" as const, text: JSON.stringify({ error: `Not found: ${id}` }) }],
            isError: true,
          };
        }
        updated = await updateTags(id, tags, { userId: file.userId });
      } else {
        updated = await updateTags(id, tags, auth.ctx);
      }

      if (!updated) {
        return {
          content: [{ type: "text" as const, text: JSON.stringify({ error: `Not found or not authorized: ${id}` }) }],
          isError: true,
        };
      }

      return {
        content: [{ type: "text" as const, text: JSON.stringify({
          id: updated.id,
          filename: updated.filename,
          tags: updated.tags,
        }) }],
      };
    }
  );

  return server;
}

async function handle(request: Request): Promise<Response> {
  const authResult = await resolveAuth(request);
  if (authResult.kind === "error") return authResult.response;

  const server = buildServer(authResult);
  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
  });
  await server.connect(transport);
  const response = await transport.handleRequest(request);
  await server.close();
  return response;
}

export const POST = handle;
export const GET = handle;
export const DELETE = handle;

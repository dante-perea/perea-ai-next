import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { writeMeta } from "@/lib/data-lake/meta";
import type { FileMetadata } from "@/lib/data-lake/types";

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        const { userId, sessionClaims } = await auth();
        if (!userId) throw new Error("Unauthorized");

        const email = sessionClaims?.email as string | undefined ?? "";
        const id = crypto.randomUUID();
        const safeName = pathname.replace(/[^a-zA-Z0-9._-]/g, "_");
        const { size } = clientPayload ? (JSON.parse(clientPayload) as { size: number }) : { size: 0 };

        return {
          pathname: `raw/files/${id}-${safeName}`,
          allowedContentTypes: ["*"],
          tokenPayload: JSON.stringify({ uploadedBy: email, id, size }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        const { uploadedBy, id, size } = JSON.parse(tokenPayload ?? "{}") as {
          uploadedBy: string;
          id: string;
          size: number;
        };

        // Derive original filename from pathname: raw/files/{uuid}-{filename}
        const parts = blob.pathname.split("/");
        const nameWithId = parts[parts.length - 1];
        const filename = nameWithId.replace(/^[0-9a-f-]+-/, "").replace(/_/g, " ");

        const meta: FileMetadata = {
          id,
          filename,
          blobKey: blob.pathname,
          blobUrl: blob.url,
          size: size ?? 0,
          contentType: blob.contentType,
          uploadedBy,
          uploadedAt: new Date().toISOString(),
          tags: [],
        };

        await writeMeta(blob.pathname, meta);
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed";
    const status = message === "Unauthorized" || message.startsWith("Forbidden") ? 403 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}

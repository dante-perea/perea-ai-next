import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { writeMeta } from "@/lib/data-lake/meta";
import type { FileMetadata } from "@/lib/data-lake/types";

export async function POST(request: Request): Promise<NextResponse> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: "BLOB_READ_WRITE_TOKEN is not configured on this environment" },
      { status: 500 }
    );
  }

  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        const { userId, sessionClaims } = await auth();
        if (!userId) throw new Error("Unauthorized");

        const uploadedBy = (sessionClaims?.email as string | undefined) ?? "";
        const { size, id: clientId } = clientPayload
          ? (JSON.parse(clientPayload) as { size: number; id: string })
          : { size: 0, id: crypto.randomUUID() };
        const id = clientId ?? crypto.randomUUID();
        const safeName = pathname.replace(/[^a-zA-Z0-9._-]/g, "_");

        return {
          pathname: `raw/files/${id}-${safeName}`,
          allowOverwrite: true,
          tokenPayload: JSON.stringify({ uploadedBy, id, size }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        try {
          const { uploadedBy: by, id, size } = JSON.parse(tokenPayload ?? "{}") as {
            uploadedBy: string;
            id: string;
            size: number;
          };
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
            uploadedBy: by,
            uploadedAt: new Date().toISOString(),
            tags: [],
          };
          await writeMeta(blob.pathname, meta);
        } catch (err) {
          console.error("[onUploadCompleted] failed:", err);
        }
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

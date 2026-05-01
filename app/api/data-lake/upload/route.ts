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

  // Call auth() here — before handleUpload — so Clerk's AsyncLocalStorage
  // context is guaranteed to be available (it gets lost inside callbacks).
  const { userId, sessionClaims } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const uploadedBy = (sessionClaims?.email as string | undefined) ?? "";

  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        const id = crypto.randomUUID();
        const safeName = pathname.replace(/[^a-zA-Z0-9._-]/g, "_");
        const { size } = clientPayload
          ? (JSON.parse(clientPayload) as { size: number })
          : { size: 0 };

        return {
          pathname: `raw/files/${id}-${safeName}`,
          tokenPayload: JSON.stringify({ uploadedBy, id, size }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
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
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

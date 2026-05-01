import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request: Request): Promise<NextResponse> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: "BLOB_READ_WRITE_TOKEN is not configured on this environment" },
      { status: 500 }
    );
  }

  // Call auth() before handleUpload — Clerk's AsyncLocalStorage context is lost inside callbacks.
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        const { size, id } = clientPayload
          ? (JSON.parse(clientPayload) as { size: number; id: string })
          : { size: 0, id: crypto.randomUUID() };

        const safeName = pathname.replace(/[^a-zA-Z0-9._-]/g, "_");

        return {
          pathname: `raw/files/${id}-${safeName}`,
          allowOverwrite: true,
          tokenPayload: JSON.stringify({ id, size }),
        };
      },
      onUploadCompleted: async () => {
        // Registration is handled client-side via /api/data-lake/register
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request: Request): Promise<NextResponse> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: "BLOB_READ_WRITE_TOKEN is not configured" },
      { status: 500 }
    );
  }

  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        const { userId, sessionClaims } = await auth();
        if (!userId) throw new Error("Unauthorized");

        const id = crypto.randomUUID();
        const safeName = pathname.replace(/[^a-zA-Z0-9._-]/g, "_");

        return {
          pathname: `raw/files/${id}-${safeName}`,
          allowOverwrite: true,
          tokenPayload: JSON.stringify({
            id,
            uploadedBy: (sessionClaims?.email as string | undefined) ?? "",
          }),
        };
      },
      onUploadCompleted: async () => {},
    });

    return NextResponse.json(jsonResponse);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { insertFile } from "@/lib/knowledge-base/meta";
import type { FileMetadata } from "@/lib/knowledge-base/types";

export async function POST(request: Request): Promise<NextResponse> {
  const { userId, sessionClaims } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id, blobUrl, blobPathname, contentType, size, filename, teamId } =
      (await request.json()) as {
        id: string;
        blobUrl: string;
        blobPathname: string;
        contentType: string;
        size: number;
        filename: string;
        teamId?: string | null;
      };

    const meta: FileMetadata = {
      id,
      filename,
      blobKey: blobPathname,
      blobUrl,
      size,
      contentType,
      uploadedBy: (sessionClaims?.email as string | undefined) ?? "",
      uploadedAt: new Date().toISOString(),
      tags: [],
      userId,
      teamId: teamId ?? null,
      knowledgeType: 'document',
    };

    await insertFile(meta);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

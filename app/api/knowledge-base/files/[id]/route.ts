import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { findFileById, deleteFile } from "@/lib/knowledge-base/meta";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const ctx = { userId };

    const file = await findFileById(id, ctx);
    if (!file) return NextResponse.json({ error: "Not found" }, { status: 404 });

    await deleteFile(file.id, file.blobKey, ctx);
    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Delete failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { findFileById, deleteFile } from "@/lib/knowledge-base/meta";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { id } = await params;
    const file = await findFileById(id);
    if (!file) return NextResponse.json({ error: "Not found" }, { status: 404 });

    await deleteFile(file.id, file.blobKey);
    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Delete failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

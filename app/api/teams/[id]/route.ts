import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { deleteTeam } from "@/lib/knowledge-base/teams";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const deleted = await deleteTeam(id, userId);
    if (!deleted) return NextResponse.json({ error: "Not found or not owner" }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Failed" }, { status: 500 });
  }
}

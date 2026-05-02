import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { findFileById, deleteFile, deleteTeamFile } from "@/lib/knowledge-base/meta";
import { getTeamRole, getUserTeamIds } from "@/lib/knowledge-base/teams";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const teamIds = await getUserTeamIds(userId);
    const ctx = { userId, teamIds };

    const file = await findFileById(id, ctx);
    if (!file) return NextResponse.json({ error: "Not found" }, { status: 404 });

    if (file.teamId) {
      const role = await getTeamRole(file.teamId, userId);
      if (!role) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

      if (role === "viewer") return NextResponse.json({ error: "Viewers cannot delete files" }, { status: 403 });

      // Editors can only delete their own files; owners can delete any
      if (role === "editor" && file.userId !== userId) {
        return NextResponse.json({ error: "Editors can only delete their own files" }, { status: 403 });
      }

      await deleteTeamFile(file.id, file.blobKey, file.teamId);
    } else {
      await deleteFile(file.id, file.blobKey, ctx);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Delete failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

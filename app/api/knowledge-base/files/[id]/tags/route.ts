import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { updateTags } from "@/lib/knowledge-base/meta";
import { getUserTeamIds, getTeamRole } from "@/lib/knowledge-base/teams";
import { findFileById } from "@/lib/knowledge-base/meta";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const { tags } = (await request.json()) as { tags: string[] };

    if (!Array.isArray(tags)) {
      return NextResponse.json({ error: "tags must be an array" }, { status: 400 });
    }

    const teamIds = await getUserTeamIds(userId);
    const ctx = { userId, teamIds };

    // Verify access and role before updating
    const file = await findFileById(id, ctx);
    if (!file) return NextResponse.json({ error: "Not found" }, { status: 404 });

    if (file.teamId) {
      const role = await getTeamRole(file.teamId, userId);
      if (role === "viewer") return NextResponse.json({ error: "Viewers cannot edit tags" }, { status: 403 });
    }

    const updated = await updateTags(id, tags.map((t) => t.trim()).filter(Boolean), ctx);
    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json(updated);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Tag update failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

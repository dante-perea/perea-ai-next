import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getTeamRole, checkTeamAccess, updateMemberRole, removeMember } from "@/lib/knowledge-base/teams";
import type { TeamRole } from "@/lib/knowledge-base/teams";

type Params = { params: Promise<{ id: string; userId: string }> };

export async function PATCH(request: Request, { params }: Params): Promise<NextResponse> {
  const { userId: callerId } = await auth();
  if (!callerId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id: teamId, userId: targetId } = await params;
    const access = await checkTeamAccess(teamId, callerId, "owner");
    if (!access.ok) return NextResponse.json({ error: "Only owners can change roles" }, { status: 403 });
    if (targetId === callerId) return NextResponse.json({ error: "Cannot change your own role" }, { status: 400 });

    const { role } = (await request.json()) as { role?: string };
    if (!role || !["editor", "viewer"].includes(role)) {
      return NextResponse.json({ error: "role must be editor or viewer" }, { status: 400 });
    }

    const updated = await updateMemberRole(teamId, targetId, role as Exclude<TeamRole, "owner">);
    if (!updated) return NextResponse.json({ error: "Member not found" }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Failed" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: Params): Promise<NextResponse> {
  const { userId: callerId } = await auth();
  if (!callerId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id: teamId, userId: targetId } = await params;
    const callerRole = await getTeamRole(teamId, callerId);

    // Owner can remove anyone (except themselves); members can only remove themselves
    if (callerId !== targetId && callerRole !== "owner") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    if (callerId === targetId && callerRole === "owner") {
      return NextResponse.json({ error: "Owner cannot leave the team. Delete the team instead." }, { status: 400 });
    }

    const removed = await removeMember(teamId, targetId);
    if (!removed) return NextResponse.json({ error: "Member not found" }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Failed" }, { status: 500 });
  }
}

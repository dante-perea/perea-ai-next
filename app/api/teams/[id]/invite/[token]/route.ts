import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getTeamRole, revokeInvite } from "@/lib/knowledge-base/teams";

type Params = { params: Promise<{ id: string; token: string }> };

export async function DELETE(_request: Request, { params }: Params): Promise<NextResponse> {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id: teamId, token } = await params;
    const role = await getTeamRole(teamId, userId);
    if (role !== "owner") return NextResponse.json({ error: "Only owners can revoke invites" }, { status: 403 });

    const revoked = await revokeInvite(token, teamId);
    if (!revoked) return NextResponse.json({ error: "Invite not found or already used" }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Failed" }, { status: 500 });
  }
}

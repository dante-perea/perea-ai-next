import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { checkTeamAccess, listTeamMembers } from "@/lib/knowledge-base/teams";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id: teamId } = await params;
    const access = await checkTeamAccess(teamId, userId, "member");
    if (!access.ok) return NextResponse.json({ error: "Not a member" }, { status: 403 });

    const members = await listTeamMembers(teamId);
    return NextResponse.json(members);
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Failed" }, { status: 500 });
  }
}

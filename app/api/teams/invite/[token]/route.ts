import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getInvite, acceptInvite, getTeam } from "@/lib/knowledge-base/teams";

type Params = { params: Promise<{ token: string }> };

export async function GET(_request: Request, { params }: Params): Promise<NextResponse> {
  try {
    const { token } = await params;
    const invite = await getInvite(token);
    if (!invite) return NextResponse.json({ error: "Invite not found" }, { status: 404 });

    if (invite.acceptedAt) return NextResponse.json({ error: "Invite already used" }, { status: 410 });
    if (new Date(invite.expiresAt) < new Date()) return NextResponse.json({ error: "Invite expired" }, { status: 410 });

    const team = await getTeam(invite.teamId);
    return NextResponse.json({ invite, team });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Failed" }, { status: 500 });
  }
}

export async function POST(_request: Request, { params }: Params): Promise<NextResponse> {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { token } = await params;
    const result = await acceptInvite(token, userId);
    if (!result) return NextResponse.json({ error: "Invite invalid, expired, or already used" }, { status: 410 });
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Failed" }, { status: 500 });
  }
}

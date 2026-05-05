import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { checkTeamAccess, createInvite, listPendingInvites } from "@/lib/knowledge-base/teams";
import type { TeamRole } from "@/lib/knowledge-base/teams";

function getBaseUrl(request: Request): string {
  if (process.env.NEXT_PUBLIC_BASE_URL) return process.env.NEXT_PUBLIC_BASE_URL;
  // Use the request origin for preview deployments
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? "";
  const proto = request.headers.get("x-forwarded-proto") ?? "https";
  return host ? `${proto}://${host}` : "https://www.perea.ai";
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id: teamId } = await params;
    const access = await checkTeamAccess(teamId, userId, "owner");
    if (!access.ok) return NextResponse.json({ error: "Only owners can view invites" }, { status: 403 });

    const invites = await listPendingInvites(teamId);
    const base = getBaseUrl(request);
    return NextResponse.json(invites.map((inv) => ({ ...inv, url: `${base}/invite/${inv.token}` })));
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Failed" }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id: teamId } = await params;
    const access = await checkTeamAccess(teamId, userId, "owner");
    if (!access.ok) return NextResponse.json({ error: "Only owners can invite" }, { status: 403 });

    const body = (await request.json()) as { role?: string };
    const inviteRole = (body.role ?? "viewer") as Exclude<TeamRole, "owner">;
    if (!["editor", "viewer"].includes(inviteRole)) {
      return NextResponse.json({ error: "role must be editor or viewer" }, { status: 400 });
    }

    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const invite = await createInvite(token, teamId, inviteRole, userId, expiresAt);

    const base = getBaseUrl(request);
    return NextResponse.json({ ...invite, url: `${base}/invite/${invite.token}` }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Failed" }, { status: 500 });
  }
}

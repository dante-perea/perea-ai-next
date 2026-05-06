import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { copyTagFilesToTeam } from "@/lib/knowledge-base/meta";
import { checkTeamAccess } from "@/lib/knowledge-base/teams";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ tag: string }> },
) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);

  const body = await req.json().catch(() => ({}));
  const { teamId } = body as { teamId?: string };
  if (!teamId) return NextResponse.json({ error: "teamId required" }, { status: 400 });

  const access = await checkTeamAccess(teamId, userId, "editor");
  if (!access.ok) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const copied = await copyTagFilesToTeam(decodedTag, teamId, userId);
    return NextResponse.json({ copied });
  } catch (err) {
    console.error("[share-tag] copyTagFilesToTeam failed:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

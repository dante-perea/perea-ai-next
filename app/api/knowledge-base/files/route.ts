import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { listAllFiles } from "@/lib/knowledge-base/meta";
import { getUserTeamIds } from "@/lib/knowledge-base/teams";

export async function GET(): Promise<NextResponse> {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const teamIds = await getUserTeamIds(userId);
    const files = await listAllFiles({ userId, teamIds });
    return NextResponse.json(files);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to list files";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

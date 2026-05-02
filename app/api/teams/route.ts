import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createTeam, listTeamsForUser } from "@/lib/knowledge-base/teams";

export async function GET(): Promise<NextResponse> {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const teams = await listTeamsForUser(userId);
    return NextResponse.json(teams);
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Failed" }, { status: 500 });
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { name } = (await request.json()) as { name?: string };
    if (!name?.trim()) return NextResponse.json({ error: "name is required" }, { status: 400 });

    const id = crypto.randomUUID();
    const team = await createTeam(id, name.trim(), userId);
    return NextResponse.json(team, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Failed" }, { status: 500 });
  }
}

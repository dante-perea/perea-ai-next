import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { sql } from "@/lib/knowledge-base/db";

export const dynamic = "force-dynamic";

export async function GET(): Promise<NextResponse> {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await sql`ALTER TABLE kb_files ADD COLUMN IF NOT EXISTS user_id TEXT NOT NULL DEFAULT ''`;
    await sql`ALTER TABLE kb_files ADD COLUMN IF NOT EXISTS team_id TEXT`;
    await sql`CREATE INDEX IF NOT EXISTS kb_files_user_id_idx ON kb_files (user_id)`;
    await sql`CREATE INDEX IF NOT EXISTS kb_files_team_id_idx ON kb_files (team_id)`;

    const cols = await sql`
      SELECT column_name FROM information_schema.columns
      WHERE table_name = 'kb_files' ORDER BY ordinal_position
    ` as { column_name: string }[];

    return NextResponse.json({ ok: true, columns: cols.map((r) => r.column_name) });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

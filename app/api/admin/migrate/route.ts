import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { sql } from "@/lib/knowledge-base/db";

export const dynamic = "force-dynamic";

export async function GET(request: Request): Promise<NextResponse> {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Require either matching ADMIN_USER_ID env var or a valid MCP_SECRET header
  const secret = process.env.MCP_SECRET;
  const adminId = process.env.ADMIN_USER_ID;
  const authHeader = request.headers.get("authorization") ?? "";
  const hasAdminToken = secret && authHeader === `Bearer ${secret}`;
  const isAdminUser = adminId && userId === adminId;
  if (!hasAdminToken && !isAdminUser) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    await sql`ALTER TABLE kb_files ADD COLUMN IF NOT EXISTS user_id TEXT NOT NULL DEFAULT ''`;
    await sql`ALTER TABLE kb_files ADD COLUMN IF NOT EXISTS team_id TEXT`;
    await sql`CREATE INDEX IF NOT EXISTS kb_files_user_id_idx ON kb_files (user_id)`;
    await sql`CREATE INDEX IF NOT EXISTS kb_files_team_id_idx ON kb_files (team_id)`;

    await sql`
      CREATE TABLE IF NOT EXISTS teams (
        id          TEXT         PRIMARY KEY,
        name        TEXT         NOT NULL,
        owner_id    TEXT         NOT NULL,
        created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
      )
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS team_members (
        team_id     TEXT         NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
        user_id     TEXT         NOT NULL,
        role        TEXT         NOT NULL CHECK (role IN ('owner', 'editor', 'viewer')),
        joined_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
        PRIMARY KEY (team_id, user_id)
      )
    `;
    await sql`CREATE INDEX IF NOT EXISTS team_members_user_id_idx ON team_members (user_id)`;
    await sql`
      CREATE TABLE IF NOT EXISTS team_invites (
        token       TEXT         PRIMARY KEY,
        team_id     TEXT         NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
        role        TEXT         NOT NULL CHECK (role IN ('editor', 'viewer')),
        invited_by  TEXT         NOT NULL,
        expires_at  TIMESTAMPTZ  NOT NULL,
        accepted_by TEXT,
        accepted_at TIMESTAMPTZ,
        created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
      )
    `;
    await sql`CREATE INDEX IF NOT EXISTS team_invites_team_id_idx ON team_invites (team_id)`;

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

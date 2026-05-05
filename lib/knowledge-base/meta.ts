import { del } from "@vercel/blob";
import { sql } from "./db";
import type { FileMetadata, KnowledgeType } from "./types";

export type ViewerContext = {
  userId: string;
  teamIds?: string[];   // reserved for Teams feature
};

type DbRow = {
  id: string;
  filename: string;
  blob_key: string;
  blob_url: string;
  size: number;
  content_type: string;
  uploaded_by: string;
  uploaded_at: Date;
  tags: string[];
  user_id: string;
  team_id: string | null;
  knowledge_type: string;
};

function rowToMeta(row: DbRow): FileMetadata {
  return {
    id: row.id,
    filename: row.filename,
    blobKey: row.blob_key,
    blobUrl: row.blob_url,
    size: Number(row.size),
    contentType: row.content_type,
    uploadedBy: row.uploaded_by,
    uploadedAt: new Date(row.uploaded_at).toISOString(),
    tags: row.tags ?? [],
    userId: row.user_id,
    teamId: row.team_id ?? null,
    knowledgeType: (row.knowledge_type ?? 'document') as KnowledgeType,
  };
}

export async function listAllFiles(ctx: ViewerContext): Promise<FileMetadata[]> {
  const teamIds = ctx.teamIds ?? [];
  const rows = teamIds.length > 0
    ? await sql`
        SELECT * FROM kb_files
        WHERE user_id = ${ctx.userId} OR team_id = ANY(${teamIds})
        ORDER BY uploaded_at DESC
      ` as DbRow[]
    : await sql`
        SELECT * FROM kb_files
        WHERE user_id = ${ctx.userId}
        ORDER BY uploaded_at DESC
      ` as DbRow[];
  return rows.map(rowToMeta);
}

export async function listPersonalFiles(ctx: ViewerContext): Promise<FileMetadata[]> {
  const rows = await sql`
    SELECT * FROM kb_files
    WHERE user_id = ${ctx.userId} AND team_id IS NULL
    ORDER BY uploaded_at DESC
  ` as DbRow[];
  return rows.map(rowToMeta);
}

export async function listTeamFiles(teamId: string): Promise<FileMetadata[]> {
  const rows = await sql`
    SELECT * FROM kb_files WHERE team_id = ${teamId} ORDER BY uploaded_at DESC
  ` as DbRow[];
  return rows.map(rowToMeta);
}

export async function findFileById(id: string, ctx: ViewerContext): Promise<FileMetadata | null> {
  const teamIds = ctx.teamIds ?? [];
  const rows = teamIds.length > 0
    ? await sql`
        SELECT * FROM kb_files
        WHERE id = ${id} AND (user_id = ${ctx.userId} OR team_id = ANY(${teamIds}))
        LIMIT 1
      ` as DbRow[]
    : await sql`
        SELECT * FROM kb_files
        WHERE id = ${id} AND user_id = ${ctx.userId}
        LIMIT 1
      ` as DbRow[];
  return rows[0] ? rowToMeta(rows[0]) : null;
}

export async function insertFile(meta: FileMetadata): Promise<void> {
  await sql`
    INSERT INTO kb_files (id, filename, blob_key, blob_url, size, content_type, uploaded_by, uploaded_at, tags, user_id, team_id, knowledge_type)
    VALUES (
      ${meta.id}, ${meta.filename}, ${meta.blobKey}, ${meta.blobUrl},
      ${meta.size}, ${meta.contentType}, ${meta.uploadedBy},
      ${meta.uploadedAt}, ${meta.tags}, ${meta.userId}, ${meta.teamId},
      ${meta.knowledgeType}
    )
    ON CONFLICT DO NOTHING
  `;
}

// Upsert by id — replaces blob_url, blob_key, size, and uploaded_at if the record already exists.
export async function upsertFile(meta: FileMetadata): Promise<void> {
  await sql`
    INSERT INTO kb_files (id, filename, blob_key, blob_url, size, content_type, uploaded_by, uploaded_at, tags, user_id, team_id, knowledge_type)
    VALUES (
      ${meta.id}, ${meta.filename}, ${meta.blobKey}, ${meta.blobUrl},
      ${meta.size}, ${meta.contentType}, ${meta.uploadedBy},
      ${meta.uploadedAt}, ${meta.tags}, ${meta.userId}, ${meta.teamId},
      ${meta.knowledgeType}
    )
    ON CONFLICT (id) DO UPDATE
      SET blob_url       = EXCLUDED.blob_url,
          blob_key       = EXCLUDED.blob_key,
          size           = EXCLUDED.size,
          uploaded_at    = EXCLUDED.uploaded_at,
          knowledge_type = EXCLUDED.knowledge_type
  `;
}

export async function updateTags(id: string, tags: string[], ctx: ViewerContext): Promise<FileMetadata | null> {
  const teamIds = ctx.teamIds ?? [];
  const rows = teamIds.length > 0
    ? await sql`
        UPDATE kb_files SET tags = ${tags}
        WHERE id = ${id} AND (user_id = ${ctx.userId} OR team_id = ANY(${teamIds}))
        RETURNING *
      ` as DbRow[]
    : await sql`
        UPDATE kb_files SET tags = ${tags}
        WHERE id = ${id} AND user_id = ${ctx.userId}
        RETURNING *
      ` as DbRow[];
  return rows[0] ? rowToMeta(rows[0]) : null;
}

export async function deleteFile(id: string, blobKey: string, ctx: ViewerContext): Promise<boolean> {
  const rows = await sql`
    DELETE FROM kb_files WHERE id = ${id} AND user_id = ${ctx.userId} RETURNING id
  ` as { id: string }[];
  if (rows.length === 0) return false;
  await del(blobKey);
  return true;
}

export async function deleteTeamFile(id: string, blobKey: string, teamId: string): Promise<boolean> {
  const rows = await sql`
    DELETE FROM kb_files WHERE id = ${id} AND team_id = ${teamId} RETURNING id
  ` as { id: string }[];
  if (rows.length === 0) return false;
  await del(blobKey);
  return true;
}

export async function deleteTeamFiles(teamId: string): Promise<void> {
  const rows = await sql`
    DELETE FROM kb_files WHERE team_id = ${teamId} RETURNING blob_key
  ` as { blob_key: string }[];
  if (rows.length > 0) {
    await Promise.allSettled(rows.map((r) => del(r.blob_key)));
  }
}

// Admin-scope helpers — no user filter. Used by machine-level tokens (MCP_SECRET).
export async function listAllFilesAdmin(): Promise<FileMetadata[]> {
  const rows = await sql`
    SELECT * FROM kb_files ORDER BY uploaded_at DESC
  ` as DbRow[];
  return rows.map(rowToMeta);
}

export async function findFileByIdAdmin(id: string): Promise<FileMetadata | null> {
  const rows = await sql`
    SELECT * FROM kb_files WHERE id = ${id} LIMIT 1
  ` as DbRow[];
  return rows[0] ? rowToMeta(rows[0]) : null;
}

import { del } from "@vercel/blob";
import { sql } from "./db";
import type { FileMetadata } from "./types";

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
  };
}

export async function listAllFiles(ctx: ViewerContext): Promise<FileMetadata[]> {
  const rows = await sql`
    SELECT * FROM kb_files
    WHERE user_id = ${ctx.userId}
    ORDER BY uploaded_at DESC
  ` as DbRow[];
  return rows.map(rowToMeta);
}

export async function findFileById(id: string, ctx: ViewerContext): Promise<FileMetadata | null> {
  const rows = await sql`
    SELECT * FROM kb_files
    WHERE id = ${id} AND user_id = ${ctx.userId}
    LIMIT 1
  ` as DbRow[];
  return rows[0] ? rowToMeta(rows[0]) : null;
}

export async function insertFile(meta: FileMetadata): Promise<void> {
  await sql`
    INSERT INTO kb_files (id, filename, blob_key, blob_url, size, content_type, uploaded_by, uploaded_at, tags, user_id, team_id)
    VALUES (
      ${meta.id}, ${meta.filename}, ${meta.blobKey}, ${meta.blobUrl},
      ${meta.size}, ${meta.contentType}, ${meta.uploadedBy},
      ${meta.uploadedAt}, ${meta.tags}, ${meta.userId}, ${meta.teamId}
    )
    ON CONFLICT (id) DO NOTHING
  `;
}

export async function updateTags(id: string, tags: string[], ctx: ViewerContext): Promise<FileMetadata | null> {
  const rows = await sql`
    UPDATE kb_files SET tags = ${tags}
    WHERE id = ${id} AND user_id = ${ctx.userId}
    RETURNING *
  ` as DbRow[];
  return rows[0] ? rowToMeta(rows[0]) : null;
}

export async function deleteFile(id: string, blobKey: string, ctx: ViewerContext): Promise<boolean> {
  const rows = await sql`
    DELETE FROM kb_files
    WHERE id = ${id} AND user_id = ${ctx.userId}
    RETURNING id
  ` as { id: string }[];
  if (rows.length === 0) return false;
  await del(blobKey);
  return true;
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

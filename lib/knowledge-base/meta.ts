import { del } from "@vercel/blob";
import { sql } from "./db";
import type { FileMetadata } from "./types";

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
  };
}

export async function listAllFiles(): Promise<FileMetadata[]> {
  const rows = await sql`
    SELECT * FROM kb_files ORDER BY uploaded_at DESC
  ` as DbRow[];
  return rows.map(rowToMeta);
}

export async function findFileById(id: string): Promise<FileMetadata | null> {
  const rows = await sql`
    SELECT * FROM kb_files WHERE id = ${id} LIMIT 1
  ` as DbRow[];
  return rows[0] ? rowToMeta(rows[0]) : null;
}

export async function insertFile(meta: FileMetadata): Promise<void> {
  await sql`
    INSERT INTO kb_files (id, filename, blob_key, blob_url, size, content_type, uploaded_by, uploaded_at, tags)
    VALUES (
      ${meta.id}, ${meta.filename}, ${meta.blobKey}, ${meta.blobUrl},
      ${meta.size}, ${meta.contentType}, ${meta.uploadedBy},
      ${meta.uploadedAt}, ${meta.tags}
    )
    ON CONFLICT (id) DO NOTHING
  `;
}

export async function updateTags(id: string, tags: string[]): Promise<FileMetadata | null> {
  const rows = await sql`
    UPDATE kb_files SET tags = ${tags} WHERE id = ${id} RETURNING *
  ` as DbRow[];
  return rows[0] ? rowToMeta(rows[0]) : null;
}

export async function deleteFile(id: string, blobKey: string): Promise<void> {
  await Promise.all([
    sql`DELETE FROM kb_files WHERE id = ${id}`,
    del(blobKey),
  ]);
}

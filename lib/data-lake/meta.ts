import { del, list } from "@vercel/blob";
import type { FileMetadata } from "./types";

const UUID_RE = /^([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})-(.+)$/;

function parseBlobPathname(pathname: string): { id: string; filename: string } {
  const segment = pathname.split("/").pop() ?? pathname;
  const match = segment.match(UUID_RE);
  if (match) {
    return { id: match[1], filename: match[2].replace(/_/g, " ") };
  }
  return { id: segment, filename: segment };
}

export async function listAllFiles(): Promise<FileMetadata[]> {
  const files: FileMetadata[] = [];
  let cursor: string | undefined;

  do {
    const result = await list({ prefix: "raw/files/", cursor, limit: 1000 });
    for (const blob of result.blobs) {
      if (blob.pathname.endsWith(".meta.json")) continue;
      const { id, filename } = parseBlobPathname(blob.pathname);
      files.push({
        id,
        filename,
        blobKey: blob.pathname,
        blobUrl: blob.url,
        size: blob.size,
        contentType: blob.contentType,
        uploadedAt: blob.uploadedAt.toISOString(),
      });
    }
    cursor = result.cursor;
  } while (cursor);

  return files;
}

export async function findFileById(id: string): Promise<FileMetadata | null> {
  const files = await listAllFiles();
  return files.find((f) => f.id === id) ?? null;
}

export async function deleteFile(blobKey: string): Promise<void> {
  await del(blobKey);
}

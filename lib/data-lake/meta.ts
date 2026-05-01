import { put, del, list } from "@vercel/blob";
import type { FileMetadata } from "./types";

export function metaKey(blobKey: string): string {
  return `${blobKey}.meta.json`;
}

export async function writeMeta(blobKey: string, meta: FileMetadata): Promise<void> {
  await put(metaKey(blobKey), JSON.stringify(meta), {
    access: "public",
    allowOverwrite: true,
    addRandomSuffix: false,
    contentType: "application/json",
  });
}

export async function readMetaFromUrl(metaUrl: string): Promise<FileMetadata> {
  const res = await fetch(metaUrl, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to fetch meta: ${metaUrl}`);
  return res.json() as Promise<FileMetadata>;
}

export async function listAllFiles(): Promise<FileMetadata[]> {
  const allBlobs: string[] = [];
  let cursor: string | undefined;

  // Paginate through all blobs (handles >1000)
  do {
    const result = await list({ prefix: "raw/files/", cursor, limit: 1000 });
    for (const blob of result.blobs) {
      if (blob.pathname.endsWith(".meta.json")) {
        allBlobs.push(blob.url);
      }
    }
    cursor = result.cursor;
  } while (cursor);

  // Fetch all meta files in parallel
  const settled = await Promise.allSettled(allBlobs.map(readMetaFromUrl));
  return settled
    .filter((r): r is PromiseFulfilledResult<FileMetadata> => r.status === "fulfilled")
    .map((r) => r.value);
}

export async function findFileById(id: string): Promise<FileMetadata | null> {
  const files = await listAllFiles();
  return files.find((f) => f.id === id) ?? null;
}

export async function deleteFile(blobKey: string): Promise<void> {
  await del([blobKey, metaKey(blobKey)]);
}

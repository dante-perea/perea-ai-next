"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { UploadZone } from "./UploadZone";
import { FileTable } from "./FileTable";
import type { FileMetadata } from "@/lib/data-lake/types";

interface DataLakeClientProps {
  files: FileMetadata[];
  currentUser: string;
}

export function DataLakeClient({ files: initialFiles, currentUser }: DataLakeClientProps) {
  const router = useRouter();
  const [files, setFiles] = useState<FileMetadata[]>(initialFiles);

  const handleDelete = useCallback(async (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
    try {
      const res = await fetch(`/api/data-lake/files/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
    } catch {
      router.refresh();
    }
  }, [router]);

  const handleUploadComplete = useCallback(() => {
    router.refresh();
  }, [router]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-[var(--color-ink)]">Raw Data Lake</h1>
        <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
          {files.length} {files.length === 1 ? "file" : "files"} · signed in as{" "}
          <span className="font-mono text-xs">{currentUser}</span>
        </p>
      </div>

      <UploadZone onUploadComplete={handleUploadComplete} />

      <FileTable files={files} onDelete={handleDelete} />
    </div>
  );
}

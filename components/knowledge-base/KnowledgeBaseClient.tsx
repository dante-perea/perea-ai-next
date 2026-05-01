"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { TagSidebar } from "./TagSidebar";
import { UploadZone } from "./UploadZone";
import { FileTable } from "./FileTable";
import type { FileMetadata } from "@/lib/knowledge-base/types";

interface KnowledgeBaseClientProps {
  files: FileMetadata[];
  currentUser: string;
}

export function KnowledgeBaseClient({ files: initialFiles, currentUser }: KnowledgeBaseClientProps) {
  const router = useRouter();
  const [files, setFiles] = useState<FileMetadata[]>(initialFiles);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    setFiles(initialFiles);
  }, [initialFiles]);

  const allTags = [...new Set(files.flatMap((f) => f.tags))].sort();

  const visibleFiles =
    selectedTags.length === 0
      ? files
      : files.filter((f) => selectedTags.every((t) => f.tags.includes(t)));

  const handleTagsChange = useCallback(async (id: string, tags: string[]) => {
    setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, tags } : f)));
    try {
      const res = await fetch(`/api/knowledge-base/files/${id}/tags`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tags }),
      });
      if (!res.ok) throw new Error("Failed to update tags");
      const updated: FileMetadata = await res.json();
      setFiles((prev) => prev.map((f) => (f.id === id ? updated : f)));
    } catch {
      router.refresh();
    }
  }, [router]);

  const handleDelete = useCallback(async (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
    try {
      const res = await fetch(`/api/knowledge-base/files/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
    } catch {
      router.refresh();
    }
  }, [router]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-[var(--color-ink)]">Knowledge Base</h1>
        <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
          {files.length} {files.length === 1 ? "file" : "files"} · signed in as{" "}
          <span className="font-mono text-xs">{currentUser}</span>
        </p>
      </div>

      <UploadZone onUploadComplete={() => router.refresh()} />

      <div className="flex gap-8">
        <TagSidebar
          allTags={allTags}
          selectedTags={selectedTags}
          files={files}
          onChange={setSelectedTags}
        />
        <div className="min-w-0 flex-1">
          {selectedTags.length > 0 && (
            <p className="mb-3 text-sm text-[var(--color-ink-muted)]">
              Showing {visibleFiles.length} of {files.length} files tagged{" "}
              {selectedTags.map((t) => `"${t}"`).join(" + ")}
            </p>
          )}
          <FileTable
            files={visibleFiles}
            onTagsChange={handleTagsChange}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </div>
  );
}

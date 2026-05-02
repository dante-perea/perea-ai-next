"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FilterSidebar } from "./FilterSidebar";
import { UploadZone } from "./UploadZone";
import { FileList } from "./FileList";
import type { FileMetadata } from "@/lib/knowledge-base/types";

interface KnowledgeBaseClientProps {
  files: FileMetadata[];
  currentUser: string;
  userId: string;
}

export type SortKey = "newest" | "oldest" | "name" | "size";

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

function sortFiles(files: FileMetadata[], sortBy: SortKey): FileMetadata[] {
  return [...files].sort((a, b) => {
    if (sortBy === "newest") return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime();
    if (sortBy === "oldest") return new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime();
    if (sortBy === "name") return a.filename.localeCompare(b.filename);
    return b.size - a.size;
  });
}

function matchesType(contentType: string, filter: string): boolean {
  if (filter === "all") return true;
  if (filter === "PDF") return contentType.includes("pdf");
  if (filter === "Image") return contentType.startsWith("image/");
  if (filter === "Video") return contentType.startsWith("video/");
  if (filter === "Audio") return contentType.startsWith("audio/");
  if (filter === "Data") return contentType.includes("json") || contentType.includes("yaml") || contentType.includes("xml");
  if (filter === "Text") return contentType.startsWith("text/") && !contentType.includes("xml");
  if (filter === "Other") {
    const ct = contentType;
    return !ct.includes("pdf") && !ct.startsWith("image/") && !ct.startsWith("video/") &&
      !ct.startsWith("audio/") && !ct.includes("json") && !ct.includes("yaml") &&
      !ct.includes("xml") && !ct.startsWith("text/");
  }
  return true;
}

export function KnowledgeBaseClient({ files: initialFiles, currentUser }: KnowledgeBaseClientProps) {
  const router = useRouter();
  const [files, setFiles] = useState<FileMetadata[]>(initialFiles);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [typeFilter, setTypeFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortKey>("newest");
  const [triggerUpload, setTriggerUpload] = useState(false);

  useEffect(() => { setFiles(initialFiles); }, [initialFiles]);

  const allTags = [...new Set(files.flatMap((f) => f.tags))].sort();
  const totalSize = files.reduce((sum, f) => sum + f.size, 0);

  const visibleFiles = sortFiles(files, sortBy).filter((f) => {
    const q = search.trim().toLowerCase();
    if (q && !f.filename.toLowerCase().includes(q) && !f.tags.some((t) => t.toLowerCase().includes(q))) return false;
    if (selectedTags.length > 0 && !selectedTags.every((t) => f.tags.includes(t))) return false;
    if (!matchesType(f.contentType, typeFilter)) return false;
    return true;
  });

  const hasFilters = selectedTags.length > 0 || typeFilter !== "all" || search.trim().length > 0;

  const handleTagsChange = useCallback(async (id: string, tags: string[]) => {
    setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, tags } : f)));
    try {
      const res = await fetch(`/api/knowledge-base/files/${id}/tags`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tags }),
      });
      if (!res.ok) throw new Error();
      const updated: FileMetadata = await res.json();
      setFiles((prev) => prev.map((f) => (f.id === id ? updated : f)));
    } catch { router.refresh(); }
  }, [router]);

  const handleDelete = useCallback(async (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
    try {
      await fetch(`/api/knowledge-base/files/${id}`, { method: "DELETE" });
    } catch { router.refresh(); }
  }, [router]);

  return (
    <div>
      {/* Page header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--color-ink)]">Knowledge Base</h1>
          <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
            {files.length} {files.length === 1 ? "file" : "files"}
            {totalSize > 0 && <> · {formatBytes(totalSize)} stored</>}
            {currentUser && <> · <span className="font-mono text-xs">{currentUser}</span></>}
          </p>
        </div>
        <button
          onClick={() => setTriggerUpload(true)}
          className="flex items-center gap-2 rounded-lg bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--color-accent-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:ring-offset-2"
        >
          <UploadIcon />
          Upload Files
        </button>
      </div>

      {/* Stats bar */}
      <div className="mb-6 grid grid-cols-4 gap-3">
        <StatCard label="Files" value={String(files.length)} />
        <StatCard label="Storage" value={formatBytes(totalSize)} />
        <StatCard label="Tags" value={String(allTags.length)} />
        <Link
          href="/dashboard/mcp"
          className="flex flex-col gap-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-white)] px-4 py-3 transition-colors hover:border-[var(--color-accent)]"
        >
          <span className="text-xs font-medium uppercase tracking-wide text-[var(--color-ink-faint)]">MCP Status</span>
          <span className="flex items-center gap-1.5 text-sm font-semibold text-[var(--color-ink)]">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
            Ready
          </span>
        </Link>
      </div>

      {/* Toolbar */}
      <div className="mb-4 flex items-center gap-3">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-ink-faint)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search files and tags…"
            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-white)] py-2 pl-9 pr-4 text-sm text-[var(--color-ink)] placeholder:text-[var(--color-ink-faint)] focus:border-[var(--color-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
          />
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortKey)}
          className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-white)] px-3 py-2 text-sm text-[var(--color-ink)] focus:border-[var(--color-accent)] focus:outline-none"
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="name">Name A–Z</option>
          <option value="size">Largest first</option>
        </select>
      </div>

      {/* Content area */}
      <div className="flex gap-6">
        <FilterSidebar
          files={files}
          allTags={allTags}
          selectedTags={selectedTags}
          typeFilter={typeFilter}
          onTagsChange={setSelectedTags}
          onTypeChange={setTypeFilter}
        />

        <div className="min-w-0 flex-1">
          <UploadZone
            onUploadComplete={() => router.refresh()}
            triggerOpen={triggerUpload}
            onTriggerHandled={() => setTriggerUpload(false)}
          />

          {hasFilters && (
            <div className="mb-3 flex items-center gap-2 text-sm text-[var(--color-ink-muted)]">
              <span>Showing {visibleFiles.length} of {files.length} files</span>
              <button
                onClick={() => { setSelectedTags([]); setTypeFilter("all"); setSearch(""); }}
                className="text-xs text-[var(--color-accent)] hover:underline"
              >
                Clear filters
              </button>
            </div>
          )}

          <FileList
            files={visibleFiles}
            onTagsChange={handleTagsChange}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-white)] px-4 py-3">
      <span className="text-xs font-medium uppercase tracking-wide text-[var(--color-ink-faint)]">{label}</span>
      <span className="text-sm font-semibold text-[var(--color-ink)]">{value}</span>
    </div>
  );
}

function UploadIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
  );
}

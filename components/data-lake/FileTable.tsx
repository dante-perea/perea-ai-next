"use client";

import { useState } from "react";
import { TagChip } from "./TagChip";
import type { FileMetadata } from "@/lib/data-lake/types";

interface FileTableProps {
  files: FileMetadata[];
  onTagsChange: (id: string, tags: string[]) => void;
  onDelete: (id: string) => void;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function FileRow({
  file,
  onTagsChange,
  onDelete,
}: {
  file: FileMetadata;
  onTagsChange: (tags: string[]) => void;
  onDelete: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [deleting, setDeleting] = useState(false);

  function copyUrl() {
    navigator.clipboard.writeText(file.blobUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  function addTag() {
    const tag = tagInput.trim();
    if (!tag || file.tags.includes(tag)) return;
    onTagsChange([...file.tags, tag]);
    setTagInput("");
  }

  async function handleDelete() {
    if (!confirm(`Delete "${file.filename}"?`)) return;
    setDeleting(true);
    onDelete();
  }

  return (
    <tr className="border-b border-[var(--color-border)] hover:bg-[var(--color-bg-card)] transition-colors">
      {/* Filename */}
      <td className="py-3 pr-4 pl-4">
        <a
          href={file.blobUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 font-medium text-[var(--color-ink)] hover:text-[var(--color-accent)] transition-colors"
        >
          <FileIcon contentType={file.contentType} />
          <span className="truncate max-w-[200px]">{file.filename}</span>
        </a>
      </td>

      {/* Size */}
      <td className="py-3 pr-4 text-sm text-[var(--color-ink-muted)] whitespace-nowrap">
        {formatBytes(file.size)}
      </td>

      {/* Date */}
      <td className="py-3 pr-4 text-sm text-[var(--color-ink-muted)] whitespace-nowrap">
        {formatDate(file.uploadedAt)}
      </td>

      {/* Uploader */}
      <td className="py-3 pr-4 text-sm text-[var(--color-ink-muted)]">
        <span className="font-mono text-xs">{file.uploadedBy.split("@")[0]}</span>
      </td>

      {/* Tags */}
      <td className="py-3 pr-4">
        <div className="flex flex-wrap items-center gap-1">
          {file.tags.map((tag) => (
            <TagChip
              key={tag}
              label={tag}
              onRemove={() => onTagsChange(file.tags.filter((t) => t !== tag))}
            />
          ))}
          <input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") { e.preventDefault(); addTag(); }
            }}
            placeholder="+ tag"
            className="w-16 rounded border border-transparent bg-transparent px-1 py-0.5 text-xs text-[var(--color-ink-muted)] placeholder:text-[var(--color-ink-faint)] focus:border-[var(--color-border-strong)] focus:outline-none"
          />
        </div>
      </td>

      {/* Actions */}
      <td className="py-3 pr-4 text-right">
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={copyUrl}
            className="rounded px-2 py-1 text-xs text-[var(--color-ink-muted)] hover:bg-[var(--color-accent-bg)] hover:text-[var(--color-accent)] transition-colors"
          >
            {copied ? "Copied!" : "Copy URL"}
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="rounded px-2 py-1 text-xs text-[var(--color-ink-faint)] hover:text-red-500 transition-colors disabled:opacity-40"
          >
            {deleting ? "…" : "Delete"}
          </button>
        </div>
      </td>
    </tr>
  );
}

function FileIcon({ contentType }: { contentType: string }) {
  if (contentType.startsWith("image/")) return <span className="text-base">🖼</span>;
  if (contentType.includes("pdf")) return <span className="text-base">📄</span>;
  if (contentType.includes("json")) return <span className="text-base">📋</span>;
  if (contentType.startsWith("video/")) return <span className="text-base">🎬</span>;
  if (contentType.startsWith("audio/")) return <span className="text-base">🎵</span>;
  if (contentType.includes("zip") || contentType.includes("compressed"))
    return <span className="text-base">📦</span>;
  return <span className="text-base">📁</span>;
}

export function FileTable({ files, onTagsChange, onDelete }: FileTableProps) {
  if (files.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[var(--color-border-strong)] py-16 text-center">
        <p className="text-2xl">📂</p>
        <p className="mt-2 text-sm font-medium text-[var(--color-ink-soft)]">No files yet</p>
        <p className="text-xs text-[var(--color-ink-faint)]">Upload files above to get started</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-white)]">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[var(--color-border)] text-left">
            <th className="py-3 pl-4 pr-4 text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-faint)]">File</th>
            <th className="py-3 pr-4 text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-faint)]">Size</th>
            <th className="py-3 pr-4 text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-faint)]">Date</th>
            <th className="py-3 pr-4 text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-faint)]">By</th>
            <th className="py-3 pr-4 text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-faint)]">Tags</th>
            <th className="py-3 pr-4 text-right text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-faint)]">Actions</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file) => (
            <FileRow
              key={file.id}
              file={file}
              onTagsChange={(tags) => onTagsChange(file.id, tags)}
              onDelete={() => onDelete(file.id)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

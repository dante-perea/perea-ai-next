"use client";

import { useState } from "react";
import type { FileMetadata } from "@/lib/data-lake/types";

interface FileTableProps {
  files: FileMetadata[];
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

function FileRow({ file, onDelete }: { file: FileMetadata; onDelete: () => void }) {
  const [copied, setCopied] = useState(false);
  const [deleting, setDeleting] = useState(false);

  function copyUrl() {
    navigator.clipboard.writeText(`${window.location.origin}/api/data-lake/files/${file.id}/download`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  function handleDelete() {
    if (!confirm(`Delete "${file.filename}"?`)) return;
    setDeleting(true);
    onDelete();
  }

  return (
    <tr className="border-b border-[var(--color-border)] hover:bg-[var(--color-bg-card)] transition-colors">
      <td className="py-3 pr-4 pl-4">
        <a
          href={`/api/data-lake/files/${file.id}/download`}
          className="flex items-center gap-2 font-medium text-[var(--color-ink)] hover:text-[var(--color-accent)] transition-colors"
        >
          <FileIcon contentType={file.contentType} />
          <span className="truncate max-w-[260px]">{file.filename}</span>
        </a>
      </td>
      <td className="py-3 pr-4 text-sm text-[var(--color-ink-muted)] whitespace-nowrap">
        {formatBytes(file.size)}
      </td>
      <td className="py-3 pr-4 text-sm text-[var(--color-ink-muted)] whitespace-nowrap">
        {formatDate(file.uploadedAt)}
      </td>
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

export function FileTable({ files, onDelete }: FileTableProps) {
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
            <th className="py-3 pr-4 text-right text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-faint)]">Actions</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file) => (
            <FileRow key={file.id} file={file} onDelete={() => onDelete(file.id)} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

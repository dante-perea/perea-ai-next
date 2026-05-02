"use client";

import { useState } from "react";
import { TagChip } from "./TagChip";
import type { FileMetadata } from "@/lib/knowledge-base/types";

interface FileListProps {
  files: FileMetadata[];
  onTagsChange?: (id: string, tags: string[]) => void;
  onDelete: (id: string) => void;
  showUploadedBy?: boolean;
  currentUserId?: string;
  canDeleteAny?: boolean;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

interface TypeStyle {
  label: string;
  bg: string;
  text: string;
}

function getTypeStyle(contentType: string): TypeStyle {
  if (contentType.includes("pdf")) return { label: "PDF", bg: "bg-red-50", text: "text-red-600" };
  if (contentType.startsWith("image/")) return { label: "IMAGE", bg: "bg-blue-50", text: "text-blue-600" };
  if (contentType.startsWith("video/")) return { label: "VIDEO", bg: "bg-orange-50", text: "text-orange-600" };
  if (contentType.startsWith("audio/")) return { label: "AUDIO", bg: "bg-pink-50", text: "text-pink-600" };
  if (contentType.includes("json")) return { label: "JSON", bg: "bg-green-50", text: "text-green-700" };
  if (contentType.includes("yaml")) return { label: "YAML", bg: "bg-green-50", text: "text-green-700" };
  if (contentType.includes("xml")) return { label: "XML", bg: "bg-green-50", text: "text-green-700" };
  if (contentType.startsWith("text/markdown") || contentType.includes("markdown")) return { label: "MD", bg: "bg-slate-100", text: "text-slate-600" };
  if (contentType.startsWith("text/")) return { label: "TXT", bg: "bg-slate-100", text: "text-slate-600" };
  if (contentType.includes("zip") || contentType.includes("tar") || contentType.includes("gzip")) return { label: "ZIP", bg: "bg-amber-50", text: "text-amber-700" };
  return { label: "FILE", bg: "bg-gray-100", text: "text-gray-500" };
}

function FileTypeBadge({ contentType }: { contentType: string }) {
  const { label, bg, text } = getTypeStyle(contentType);
  return (
    <span className={`inline-block rounded px-1.5 py-0.5 text-[10px] font-bold tracking-wide ${bg} ${text}`}>
      {label}
    </span>
  );
}

function IdChip({ id }: { id: string }) {
  const [copied, setCopied] = useState(false);

  function copy(e: React.MouseEvent) {
    e.stopPropagation();
    navigator.clipboard.writeText(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <button
      onClick={copy}
      title={`Copy ID: ${id}`}
      className="flex items-center gap-1 rounded px-1.5 py-0.5 font-mono text-xs text-[var(--color-ink-faint)] transition-colors hover:bg-[var(--color-bg-card)] hover:text-[var(--color-ink-soft)]"
    >
      {copied
        ? <span className="text-emerald-500">✓</span>
        : <CopyIcon />
      }
      {id.slice(0, 8)}
    </button>
  );
}

// ── File row ──────────────────────────────────────────────────────────────────

function FileRow({
  file,
  onTagsChange,
  onDelete,
  showUploadedBy,
  canDelete,
}: {
  file: FileMetadata;
  onTagsChange?: (tags: string[]) => void;
  onDelete: () => void;
  showUploadedBy?: boolean;
  canDelete?: boolean;
}) {
  const [tagInput, setTagInput] = useState("");
  const [deleting, setDeleting] = useState(false);

  function addTag() {
    const tag = tagInput.trim().toLowerCase();
    if (!tag || file.tags.includes(tag) || !onTagsChange) return;
    onTagsChange([...file.tags, tag]);
    setTagInput("");
  }

  function handleDelete() {
    if (!confirm(`Delete "${file.filename}"?`)) return;
    setDeleting(true);
    onDelete();
  }

  return (
    <tr className="group border-b border-[var(--color-border)] hover:bg-[var(--color-bg-card)] transition-colors">
      {/* File name */}
      <td className="py-3 pl-4 pr-3">
        <a
          href={`/api/knowledge-base/files/${file.id}/download`}
          className="flex items-center gap-2 font-medium text-[var(--color-ink)] hover:text-[var(--color-accent)] transition-colors"
        >
          <FileIcon contentType={file.contentType} />
          <span className="max-w-[180px] truncate text-sm">{file.filename}</span>
        </a>
      </td>

      {/* Type badge */}
      <td className="py-3 pr-3">
        <FileTypeBadge contentType={file.contentType} />
      </td>

      {/* Size */}
      <td className="py-3 pr-3 text-sm text-[var(--color-ink-muted)] whitespace-nowrap">
        {formatBytes(file.size)}
      </td>

      {/* Date */}
      <td className="py-3 pr-3 text-sm text-[var(--color-ink-muted)] whitespace-nowrap">
        {formatDate(file.uploadedAt)}
      </td>

      {/* Uploaded by (team context) */}
      {showUploadedBy && (
        <td className="py-3 pr-3 text-xs text-[var(--color-ink-faint)] whitespace-nowrap max-w-[120px] truncate">
          {file.uploadedBy || file.userId.slice(0, 8)}
        </td>
      )}

      {/* Tags */}
      <td className="py-3 pr-3">
        <div className="flex flex-wrap items-center gap-1">
          {file.tags.map((tag) => (
            <TagChip
              key={tag}
              label={tag}
              onRemove={onTagsChange ? () => onTagsChange(file.tags.filter((t) => t !== tag)) : undefined}
            />
          ))}
          {onTagsChange && (
            <input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
              placeholder="+ tag"
              className="w-14 rounded border border-transparent bg-transparent px-1 py-0.5 text-xs text-[var(--color-ink-muted)] placeholder:text-[var(--color-ink-faint)] focus:border-[var(--color-border-strong)] focus:outline-none"
            />
          )}
        </div>
      </td>

      {/* ID chip */}
      <td className="py-3 pr-3">
        <IdChip id={file.id} />
      </td>

      {/* Actions — revealed on hover */}
      <td className="py-3 pr-4 text-right">
        <div className="flex items-center justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <a
            href={`/api/knowledge-base/files/${file.id}/download`}
            className="rounded px-2 py-1 text-xs text-[var(--color-ink-muted)] hover:bg-[var(--color-accent-bg)] hover:text-[var(--color-accent)] transition-colors"
          >
            Download
          </a>
          {canDelete !== false && (
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="rounded px-2 py-1 text-xs text-[var(--color-ink-faint)] hover:text-red-500 transition-colors disabled:opacity-40"
            >
              {deleting ? "…" : "Delete"}
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}

// ── Empty state ───────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[var(--color-border-strong)] py-20 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-bg-card)]">
        <svg className="h-6 w-6 text-[var(--color-ink-faint)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
        </svg>
      </div>
      <p className="mt-3 text-sm font-medium text-[var(--color-ink-soft)]">No files yet</p>
      <p className="mt-1 text-xs text-[var(--color-ink-faint)]">Drop files in the zone above or click Upload Files</p>
    </div>
  );
}

// ── File icon ──────────────────────────────────────────────────────────────────

function FileIcon({ contentType }: { contentType: string }) {
  if (contentType.startsWith("image/")) {
    return (
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-blue-50">
        <svg className="h-3.5 w-3.5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </span>
    );
  }
  if (contentType.includes("pdf")) {
    return (
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-red-50">
        <svg className="h-3.5 w-3.5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </span>
    );
  }
  if (contentType.includes("json") || contentType.includes("yaml") || contentType.includes("xml")) {
    return (
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-green-50">
        <svg className="h-3.5 w-3.5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      </span>
    );
  }
  return (
    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-[var(--color-bg-card)]">
      <svg className="h-3.5 w-3.5 text-[var(--color-ink-faint)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    </span>
  );
}

function CopyIcon() {
  return (
    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────

export function FileList({
  files,
  onTagsChange,
  onDelete,
  showUploadedBy,
  currentUserId,
  canDeleteAny,
}: FileListProps) {
  if (files.length === 0) return <EmptyState />;

  return (
    <div className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-white)]">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--color-border)] bg-[var(--color-bg-card)]">
              <th className="py-2.5 pl-4 pr-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-faint)]">File</th>
              <th className="py-2.5 pr-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-faint)]">Type</th>
              <th className="py-2.5 pr-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-faint)]">Size</th>
              <th className="py-2.5 pr-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-faint)]">Date</th>
              {showUploadedBy && (
                <th className="py-2.5 pr-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-faint)]">Uploaded by</th>
              )}
              <th className="py-2.5 pr-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-faint)]">Tags</th>
              <th className="py-2.5 pr-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-faint)]">ID</th>
              <th className="py-2.5 pr-4 text-right text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-faint)]"></th>
            </tr>
          </thead>
          <tbody>
            {files.map((file) => {
              const canDelete = canDeleteAny !== false
                ? true
                : file.userId === currentUserId; // editor: own files only
              return (
                <FileRow
                  key={file.id}
                  file={file}
                  onTagsChange={onTagsChange ? (tags) => onTagsChange(file.id, tags) : undefined}
                  onDelete={() => onDelete(file.id)}
                  showUploadedBy={showUploadedBy}
                  canDelete={canDelete}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

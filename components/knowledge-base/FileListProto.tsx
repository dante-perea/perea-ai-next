// PROTOTYPE — throwaway. Three variants of the file list.
// Question: Which layout fixes the tag overflow + column density issues?
// Variants: A = slim table | B = card grid | C = dense rows
// Delete losing variants and this file once winner is picked.

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { FileMetadata } from "@/lib/knowledge-base/types";

export interface FileListProtoProps {
  files: FileMetadata[];
  variant?: string;
  onTagsChange?: (id: string, tags: string[]) => void;
  onDelete: (id: string) => void;
  showUploadedBy?: boolean;
  currentUserId?: string;
  canDeleteAny?: boolean;
}

// ─── Shared helpers ───────────────────────────────────────────────────────────

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// Tags that never wrap — capped at `max`, overflow shown as "+N"
function TagPills({ tags, max = 3, onRemove, onAdd }: {
  tags: string[];
  max?: number;
  onRemove?: (t: string) => void;
  onAdd?: (t: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [input, setInput] = useState("");
  const visible = tags.slice(0, max);
  const overflow = tags.length - max;

  function submit() {
    const t = input.trim().toLowerCase();
    if (t && onAdd && !tags.includes(t)) onAdd(t);
    setInput("");
    setEditing(false);
  }

  return (
    <div className="flex flex-nowrap items-center gap-1">
      {visible.map((t) => (
        <span key={t} className="flex shrink-0 items-center gap-0.5 rounded-full bg-[var(--color-bg-card)] px-2 py-0.5 text-xs text-[var(--color-ink-soft)]">
          <span className="max-w-[72px] truncate">{t}</span>
          {onRemove && (
            <button
              onClick={(e) => { e.stopPropagation(); onRemove(t); }}
              className="leading-none text-[var(--color-ink-faint)] hover:text-red-400"
            >×</button>
          )}
        </span>
      ))}
      {overflow > 0 && (
        <span className="shrink-0 rounded-full bg-[var(--color-border)] px-2 py-0.5 text-xs text-[var(--color-ink-faint)]">
          +{overflow}
        </span>
      )}
      {onAdd && !editing && (
        <button
          onClick={() => setEditing(true)}
          className="shrink-0 rounded-full border border-dashed border-[var(--color-border-strong)] px-2 py-0.5 text-xs text-[var(--color-ink-faint)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors"
        >+ tag</button>
      )}
      {editing && (
        <input
          autoFocus
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") { e.preventDefault(); submit(); }
            if (e.key === "Escape") setEditing(false);
          }}
          onBlur={submit}
          placeholder="tag…"
          className="w-20 shrink-0 rounded border border-[var(--color-border-strong)] bg-[var(--color-bg-white)] px-1.5 py-0.5 text-xs outline-none focus:border-[var(--color-accent)]"
        />
      )}
    </div>
  );
}

function FileIcon({ contentType, lg }: { contentType: string; lg?: boolean }) {
  const sz = lg ? "h-9 w-9" : "h-7 w-7";
  const ic = lg ? "h-5 w-5" : "h-3.5 w-3.5";
  if (contentType.startsWith("image/"))
    return <span className={`flex ${sz} shrink-0 items-center justify-center rounded-lg bg-blue-50`}>
      <svg className={`${ic} text-blue-500`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
    </span>;
  if (contentType.includes("pdf"))
    return <span className={`flex ${sz} shrink-0 items-center justify-center rounded-lg bg-red-50`}>
      <svg className={`${ic} text-red-500`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
    </span>;
  if (contentType.includes("json") || contentType.includes("yaml"))
    return <span className={`flex ${sz} shrink-0 items-center justify-center rounded-lg bg-green-50`}>
      <svg className={`${ic} text-green-600`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
    </span>;
  return <span className={`flex ${sz} shrink-0 items-center justify-center rounded-lg bg-[var(--color-bg-card)]`}>
    <svg className={`${ic} text-[var(--color-ink-faint)]`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
  </span>;
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[var(--color-border-strong)] py-20 text-center">
      <p className="text-sm font-medium text-[var(--color-ink-soft)]">No files yet</p>
      <p className="mt-1 text-xs text-[var(--color-ink-faint)]">Drop files in the zone above or click Upload Files</p>
    </div>
  );
}

// ─── Variant A — Slim table ───────────────────────────────────────────────────
// Columns: File (name + size/date subtitle) | Tags (capped at 3) | Actions
// No Type, Date, or ID columns. Fixed row height.

function VariantA({ files, onTagsChange, onDelete, showUploadedBy, currentUserId, canDeleteAny }: FileListProtoProps) {
  if (files.length === 0) return <EmptyState />;
  return (
    <div className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-white)]">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[var(--color-border)] bg-[var(--color-bg-card)]">
            <th className="py-2.5 pl-4 pr-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-faint)]">File</th>
            {showUploadedBy && <th className="py-2.5 pr-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-faint)]">By</th>}
            <th className="py-2.5 pr-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-faint)]">Tags</th>
            <th className="py-2.5 pr-4" />
          </tr>
        </thead>
        <tbody>
          {files.map((file) => {
            const canDelete = canDeleteAny !== false || file.userId === currentUserId;
            return (
              <tr key={file.id} className="group border-b border-[var(--color-border)] transition-colors hover:bg-[var(--color-bg-card)]">
                <td className="py-3 pl-4 pr-3">
                  <a
                    href={`/api/knowledge-base/files/${file.id}/download`}
                    className="flex items-center gap-2.5 transition-colors hover:text-[var(--color-accent)]"
                  >
                    <FileIcon contentType={file.contentType} />
                    <span className="flex min-w-0 flex-col">
                      <span className="truncate text-sm font-medium text-[var(--color-ink)]">{file.filename}</span>
                      <span className="text-xs text-[var(--color-ink-faint)]">{formatBytes(file.size)} · {formatDate(file.uploadedAt)}</span>
                    </span>
                  </a>
                </td>
                {showUploadedBy && (
                  <td className="py-3 pr-3 text-xs text-[var(--color-ink-faint)] whitespace-nowrap">
                    {file.uploadedBy || file.userId.slice(0, 8)}
                  </td>
                )}
                <td className="py-3 pr-3">
                  <TagPills
                    tags={file.tags}
                    max={3}
                    onRemove={onTagsChange ? (t) => onTagsChange(file.id, file.tags.filter((x) => x !== t)) : undefined}
                    onAdd={onTagsChange ? (t) => onTagsChange(file.id, [...file.tags, t]) : undefined}
                  />
                </td>
                <td className="py-3 pr-4 text-right">
                  <div className="flex items-center justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <a
                      href={`/api/knowledge-base/files/${file.id}/download`}
                      className="rounded px-2 py-1 text-xs text-[var(--color-ink-muted)] transition-colors hover:bg-[var(--color-accent-bg)] hover:text-[var(--color-accent)]"
                    >Download</a>
                    {canDelete && (
                      <DelBtn label={file.filename} onDelete={() => onDelete(file.id)} />
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ─── Variant B — Card grid ────────────────────────────────────────────────────
// 2-col grid (3-col on xl). Each card: icon + filename + size/date + tags + hover actions.

function VariantB({ files, onTagsChange, onDelete, currentUserId, canDeleteAny }: FileListProtoProps) {
  if (files.length === 0) return <EmptyState />;
  return (
    <div className="grid grid-cols-2 gap-3 xl:grid-cols-3">
      {files.map((file) => {
        const canDelete = canDeleteAny !== false || file.userId === currentUserId;
        return (
          <div key={file.id} className="group relative flex flex-col gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-white)] p-4 transition-all hover:border-[var(--color-border-strong)] hover:shadow-sm">
            <div className="flex items-start gap-3">
              <FileIcon contentType={file.contentType} lg />
              <div className="min-w-0 flex-1">
                <a
                  href={`/api/knowledge-base/files/${file.id}/download`}
                  className="block truncate text-sm font-medium text-[var(--color-ink)] transition-colors hover:text-[var(--color-accent)]"
                >
                  {file.filename}
                </a>
                <p className="mt-0.5 text-xs text-[var(--color-ink-faint)]">{formatBytes(file.size)} · {formatDate(file.uploadedAt)}</p>
              </div>
            </div>

            <TagPills
              tags={file.tags}
              max={4}
              onRemove={onTagsChange ? (t) => onTagsChange(file.id, file.tags.filter((x) => x !== t)) : undefined}
              onAdd={onTagsChange ? (t) => onTagsChange(file.id, [...file.tags, t]) : undefined}
            />

            <div className="flex items-center gap-2 border-t border-[var(--color-border)] pt-2 opacity-0 transition-opacity group-hover:opacity-100">
              <a
                href={`/api/knowledge-base/files/${file.id}/download`}
                className="rounded-lg px-3 py-1 text-xs font-medium text-[var(--color-ink-muted)] transition-colors hover:bg-[var(--color-accent-bg)] hover:text-[var(--color-accent)]"
              >Download</a>
              {canDelete && <DelBtn label={file.filename} onDelete={() => onDelete(file.id)} />}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Variant C — Dense rows ───────────────────────────────────────────────────
// Single-line per file: icon · filename (flex-1) · tags (max 2) · size · actions

function VariantC({ files, onTagsChange, onDelete, currentUserId, canDeleteAny }: FileListProtoProps) {
  if (files.length === 0) return <EmptyState />;
  return (
    <div className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-white)] divide-y divide-[var(--color-border)]">
      {files.map((file) => {
        const canDelete = canDeleteAny !== false || file.userId === currentUserId;
        return (
          <div key={file.id} className="group flex items-center gap-3 px-4 py-2 transition-colors hover:bg-[var(--color-bg-card)]">
            {/* Icon */}
            <FileIcon contentType={file.contentType} />

            {/* Name */}
            <a
              href={`/api/knowledge-base/files/${file.id}/download`}
              className="min-w-0 flex-1 truncate text-sm text-[var(--color-ink)] transition-colors hover:text-[var(--color-accent)]"
            >
              {file.filename}
            </a>

            {/* Tags capped at 2 */}
            <div className="shrink-0">
              <TagPills
                tags={file.tags}
                max={2}
                onRemove={onTagsChange ? (t) => onTagsChange(file.id, file.tags.filter((x) => x !== t)) : undefined}
                onAdd={onTagsChange ? (t) => onTagsChange(file.id, [...file.tags, t]) : undefined}
              />
            </div>

            {/* Size */}
            <span className="w-14 shrink-0 text-right text-xs text-[var(--color-ink-faint)]">{formatBytes(file.size)}</span>

            {/* Actions */}
            <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
              <a
                href={`/api/knowledge-base/files/${file.id}/download`}
                title="Download"
                className="rounded p-1 text-[var(--color-ink-faint)] transition-colors hover:bg-[var(--color-accent-bg)] hover:text-[var(--color-accent)]"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              </a>
              {canDelete && <DelBtn label={file.filename} onDelete={() => onDelete(file.id)} icon />}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Shared sub-components ────────────────────────────────────────────────────

function DelBtn({ label, onDelete, icon }: { label: string; onDelete: () => void; icon?: boolean }) {
  const [busy, setBusy] = useState(false);
  function handle() {
    if (!confirm(`Delete "${label}"?`)) return;
    setBusy(true);
    onDelete();
  }
  if (icon) return (
    <button onClick={handle} disabled={busy} title="Delete" className="rounded p-1 text-[var(--color-ink-faint)] transition-colors hover:text-red-500 disabled:opacity-40">
      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
    </button>
  );
  return (
    <button onClick={handle} disabled={busy} className="rounded px-2 py-1 text-xs text-[var(--color-ink-faint)] transition-colors hover:text-red-500 disabled:opacity-40">
      {busy ? "…" : "Delete"}
    </button>
  );
}

// ─── Prototype switcher ───────────────────────────────────────────────────────

const VARIANTS = ["A", "B", "C"] as const;
const LABELS: Record<string, string> = {
  A: "A — Slim table",
  B: "B — Card grid",
  C: "C — Dense rows",
};

function PrototypeSwitcher({ variant }: { variant: string }) {
  const router = useRouter();
  if (process.env.NODE_ENV === "production") return null;

  const idx = VARIANTS.indexOf(variant as (typeof VARIANTS)[number]);
  const prev = VARIANTS[(idx - 1 + VARIANTS.length) % VARIANTS.length];
  const next = VARIANTS[(idx + 1) % VARIANTS.length];

  function go(v: string) {
    const url = new URL(window.location.href);
    url.searchParams.set("variant", v);
    router.replace(url.pathname + url.search);
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "ArrowLeft") go(prev);
      if (e.key === "ArrowRight") go(next);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <div className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-full bg-gray-900 px-5 py-2.5 text-white shadow-2xl">
      <button onClick={() => go(prev)} className="text-lg leading-none text-gray-400 hover:text-white transition-colors">←</button>
      <span className="text-sm font-medium tabular-nums">{LABELS[variant] ?? variant}</span>
      <button onClick={() => go(next)} className="text-lg leading-none text-gray-400 hover:text-white transition-colors">→</button>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function FileListProto({ variant = "A", ...props }: FileListProtoProps) {
  return (
    <>
      {variant === "A" && <VariantA {...props} />}
      {variant === "B" && <VariantB {...props} />}
      {variant === "C" && <VariantC {...props} />}
      <PrototypeSwitcher variant={variant} />
    </>
  );
}

// PROTOTYPE — Tag management UX (round 2, built on Variant A base)
// Question: What's the best UX for rename, merge, and visualizing many tags?
// Variants:
//   A = Command palette  — ⌘K overlay, keyboard-driven rename/merge/delete
//   B = Tag mosaic       — visual word-cloud sized by count, click-to-merge
//   C = Multi-select     — shift-click tags, see overlap stats, batch ops
// Delete losing variants once winner is picked.

"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { UploadZone, type UploadZoneHandle } from "./UploadZone";
import { UrlImport } from "./UrlImport";
import type { FileMetadata } from "@/lib/knowledge-base/types";
import type { TeamRole, Team } from "@/lib/knowledge-base/teams";

interface Props {
  files: FileMetadata[];
  currentUser: string;
  userId: string;
  teamId: string | null;
  teamName: string | null;
  userRole: TeamRole | null;
  teams: (Team & { role: TeamRole })[];
}

interface VariantProps {
  files: FileMetadata[];
  canWrite: boolean;
  userId: string;
  teamId: string | null;
  ops: ReturnType<typeof useTagOps>;
  uploadZoneRef: React.RefObject<UploadZoneHandle | null>;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatBytes(b: number) {
  if (b < 1024) return `${b} B`;
  if (b < 1048576) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / 1048576).toFixed(1)} MB`;
}

function tagHealth(count: number, total: number): "orphan" | "good" | "broad" {
  if (count === 1) return "orphan";
  if (count > Math.max(30, total * 0.08)) return "broad";
  return "good";
}

const HEALTH = {
  orphan: { dot: "bg-amber-400",   label: "Single file", badge: "bg-amber-50 text-amber-700"   },
  good:   { dot: "bg-emerald-400", label: "Healthy",     badge: "bg-emerald-50 text-emerald-700" },
  broad:  { dot: "bg-orange-400",  label: "Too broad?",  badge: "bg-orange-50 text-orange-700"   },
};

// ─── Tag ops hook ─────────────────────────────────────────────────────────────

function useTagOps(
  files: FileMetadata[],
  setFiles: React.Dispatch<React.SetStateAction<FileMetadata[]>>,
) {
  const router = useRouter();

  const updateFileTags = useCallback(async (id: string, tags: string[]) => {
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
  }, [setFiles, router]);

  const renameTag = useCallback((oldTag: string, newTag: string) => {
    const nt = newTag.trim().toLowerCase();
    if (!nt || nt === oldTag) return;
    files.filter((f) => f.tags.includes(oldTag))
         .forEach((f) => updateFileTags(f.id, f.tags.map((t) => (t === oldTag ? nt : t))));
  }, [files, updateFileTags]);

  const deleteTag = useCallback((tag: string) => {
    files.filter((f) => f.tags.includes(tag))
         .forEach((f) => updateFileTags(f.id, f.tags.filter((t) => t !== tag)));
  }, [files, updateFileTags]);

  const mergeTag = useCallback((from: string, into: string) => {
    files.filter((f) => f.tags.includes(from))
         .forEach((f) => {
           const next = f.tags.filter((t) => t !== from);
           if (!next.includes(into)) next.push(into);
           updateFileTags(f.id, next);
         });
  }, [files, updateFileTags]);

  const addTagToFiles = useCallback((ids: string[], tag: string) => {
    ids.forEach((id) => {
      const file = files.find((f) => f.id === id);
      if (file && !file.tags.includes(tag)) updateFileTags(id, [...file.tags, tag]);
    });
  }, [files, updateFileTags]);

  return { updateFileTags, renameTag, deleteTag, mergeTag, addTagToFiles };
}

// ─── Shared small components ──────────────────────────────────────────────────

function FileIcon({ ct }: { ct: string }) {
  const cls = "flex h-6 w-6 shrink-0 items-center justify-center rounded-md";
  const ic  = "h-3.5 w-3.5";
  if (ct.startsWith("image/")) return <span className={`${cls} bg-blue-50`}><svg className={`${ic} text-blue-500`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></span>;
  if (ct.includes("pdf")) return <span className={`${cls} bg-red-50`}><svg className={`${ic} text-red-500`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg></span>;
  return <span className={`${cls} bg-[var(--color-bg-card)]`}><svg className={`${ic} text-[var(--color-ink-faint)]`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg></span>;
}

function InlineRename({ value, onSave, onCancel }: { value: string; onSave: (v: string) => void; onCancel: () => void }) {
  const [v, setV] = useState(value);
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => { ref.current?.select(); }, []);
  return (
    <input
      ref={ref}
      value={v}
      onChange={(e) => setV(e.target.value)}
      onKeyDown={(e) => { if (e.key === "Enter") onSave(v); if (e.key === "Escape") onCancel(); }}
      onBlur={() => onSave(v)}
      className="w-full rounded border border-[var(--color-accent)] bg-[var(--color-bg-white)] px-2 py-0.5 text-sm outline-none"
    />
  );
}

function FileRow({ file, activeTag, onTagClick, onTagRemove, onTagAdd, onDelete, canDelete }: {
  file: FileMetadata;
  activeTag?: string;
  onTagClick?: (t: string) => void;
  onTagRemove?: (t: string) => void;
  onTagAdd?: (t: string) => void;
  onDelete?: () => void;
  canDelete?: boolean;
}) {
  const [addInput, setAddInput] = useState("");
  const [adding, setAdding] = useState(false);
  const otherTags = activeTag ? file.tags.filter((t) => t !== activeTag) : file.tags;

  function submitAdd() {
    const t = addInput.trim().toLowerCase();
    if (t && onTagAdd && !file.tags.includes(t)) onTagAdd(t);
    setAddInput(""); setAdding(false);
  }

  return (
    <div className="group flex items-start gap-3 border-b border-[var(--color-border)] px-4 py-3 transition-colors hover:bg-[var(--color-bg-card)]">
      <FileIcon ct={file.contentType} />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1">
          {otherTags.length > 0
            ? otherTags.map((t) => (
                <span
                  key={t}
                  onClick={onTagClick ? () => onTagClick(t) : undefined}
                  className={[
                    "flex shrink-0 items-center gap-0.5 rounded-full px-2 py-0.5 text-xs transition-colors",
                    "bg-[var(--color-bg-card)] text-[var(--color-ink-soft)] hover:bg-[var(--color-border)]",
                    onTagClick ? "cursor-pointer" : "",
                  ].join(" ")}
                >
                  {t}
                  {onTagRemove && (
                    <button onClick={(e) => { e.stopPropagation(); onTagRemove(t); }} className="ml-0.5 leading-none opacity-60 hover:opacity-100">×</button>
                  )}
                </span>
              ))
            : activeTag
              ? <span className="text-xs italic text-[var(--color-ink-faint)]">no other tags</span>
              : <span className="text-xs italic text-[var(--color-ink-faint)]">untagged</span>
          }
          {onTagAdd && !adding && (
            <button onClick={() => setAdding(true)} className="rounded-full border border-dashed border-[var(--color-border-strong)] px-2 py-0.5 text-xs text-[var(--color-ink-faint)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]">
              + tag
            </button>
          )}
          {adding && (
            <input
              autoFocus
              value={addInput}
              onChange={(e) => setAddInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); submitAdd(); } if (e.key === "Escape") setAdding(false); }}
              onBlur={submitAdd}
              placeholder="tag…"
              className="w-24 rounded border border-[var(--color-accent)] bg-[var(--color-bg-white)] px-1.5 py-0.5 text-xs outline-none"
            />
          )}
        </div>
        <p className="mt-0.5 truncate text-xs text-[var(--color-ink-faint)]">{file.filename}</p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <span className="text-xs text-[var(--color-ink-faint)]">{formatBytes(file.size)}</span>
        <div className="flex items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
          <a href={`/api/knowledge-base/files/${file.id}/download`} title="Download" className="rounded p-1 text-[var(--color-ink-faint)] transition-colors hover:bg-[var(--color-accent-bg)] hover:text-[var(--color-accent)]">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
          </a>
          {canDelete && onDelete && (
            <button onClick={onDelete} title="Delete" className="rounded p-1 text-[var(--color-ink-faint)] transition-colors hover:text-red-500">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Variant A — Command palette (⌘K) ────────────────────────────────────────
// Tag sidebar stays clean. ⌘K opens a modal for all tag ops.
// Modes: idle (search tags) → rename (type new name) → merge (pick target).

function CommandPalette({ files, ops, onNavigate, onClose }: {
  files: FileMetadata[];
  ops: ReturnType<typeof useTagOps>;
  onNavigate: (tag: string) => void;
  onClose: () => void;
}) {
  const [query, setQuery]           = useState("");
  const [mode, setMode]             = useState<"idle" | "rename" | "merge">("idle");
  const [actionTag, setActionTag]   = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const allTags  = [...new Set(files.flatMap((f) => f.tags))].sort();
  const tagCounts = Object.fromEntries(allTags.map((t) => [t, files.filter((f) => f.tags.includes(t)).length]));
  const filtered  = allTags.filter((t) => !query || t.toLowerCase().includes(query.toLowerCase()));

  useEffect(() => { inputRef.current?.focus(); }, [mode]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        if (mode !== "idle") { setMode("idle"); setActionTag(null); setQuery(""); }
        else onClose();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mode, onClose]);

  function startRename(tag: string) { setMode("rename"); setActionTag(tag); setRenameValue(tag); setQuery(""); }
  function startMerge(tag: string)  { setMode("merge");  setActionTag(tag); setQuery(""); }

  function confirmRename() {
    if (actionTag && renameValue.trim()) ops.renameTag(actionTag, renameValue.trim().toLowerCase());
    setMode("idle"); setActionTag(null); setQuery("");
  }

  function confirmMerge(target: string) {
    if (!actionTag) return;
    if (confirm(`Merge "${actionTag}" into "${target}"? All files with "${actionTag}" will get "${target}" instead.`))
      ops.mergeTag(actionTag, target);
    setMode("idle"); setActionTag(null); setQuery("");
  }

  function doDelete(tag: string) {
    if (confirm(`Remove tag "${tag}" from all ${tagCounts[tag]} files?`)) ops.deleteTag(tag);
  }

  const mergeTargets = mode === "merge" ? filtered.filter((t) => t !== actionTag) : [];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh]" onClick={onClose}>
      <div
        className="w-full max-w-lg rounded-2xl bg-[var(--color-bg-white)] shadow-2xl ring-1 ring-black/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Input row */}
        <div className="flex items-center gap-3 border-b border-[var(--color-border)] px-4 py-3">
          {mode === "idle" && (
            <>
              <svg className="h-4 w-4 shrink-0 text-[var(--color-ink-faint)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input ref={inputRef} value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search tags…" className="flex-1 bg-transparent text-sm text-[var(--color-ink)] outline-none placeholder:text-[var(--color-ink-faint)]" />
            </>
          )}
          {mode === "rename" && actionTag && (
            <>
              <span className="shrink-0 rounded-full bg-[var(--color-accent-bg)] px-2.5 py-0.5 text-xs font-semibold text-[var(--color-accent)]">{actionTag}</span>
              <span className="shrink-0 text-sm text-[var(--color-ink-muted)]">→</span>
              <input ref={inputRef} value={renameValue} onChange={(e) => setRenameValue(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") confirmRename(); }} className="flex-1 rounded-lg border border-[var(--color-accent)] bg-transparent px-2.5 py-1 text-sm text-[var(--color-ink)] outline-none" />
              <button onClick={confirmRename} className="shrink-0 rounded-lg bg-[var(--color-accent)] px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-[var(--color-accent-hover)]">Save</button>
            </>
          )}
          {mode === "merge" && actionTag && (
            <>
              <span className="shrink-0 rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-semibold text-orange-700">{actionTag}</span>
              <span className="shrink-0 text-sm text-[var(--color-ink-muted)]">merge into…</span>
              <input ref={inputRef} value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search target tag…" className="flex-1 bg-transparent text-sm text-[var(--color-ink)] outline-none placeholder:text-[var(--color-ink-faint)]" />
            </>
          )}
        </div>

        {/* Results */}
        <div className="max-h-[50vh] overflow-y-auto">
          {mode === "idle" && (
            filtered.length === 0
              ? <p className="px-4 py-8 text-center text-sm text-[var(--color-ink-faint)]">No tags match</p>
              : filtered.map((tag) => {
                  const count  = tagCounts[tag];
                  const health = tagHealth(count, files.length);
                  return (
                    <div key={tag} className="group flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-[var(--color-bg-card)]">
                      <span className={`h-2 w-2 shrink-0 rounded-full ${HEALTH[health].dot}`} />
                      <span className="flex-1 text-sm text-[var(--color-ink)]">{tag}</span>
                      <span className="text-xs font-mono text-[var(--color-ink-faint)]">{count}</span>
                      <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                        <button onClick={() => { onNavigate(tag); onClose(); }} className="rounded px-2 py-0.5 text-xs text-[var(--color-ink-soft)] transition-colors hover:bg-[var(--color-accent-bg)] hover:text-[var(--color-accent)]">Browse</button>
                        <button onClick={() => startRename(tag)} className="rounded px-2 py-0.5 text-xs text-[var(--color-ink-soft)] transition-colors hover:bg-[var(--color-accent-bg)] hover:text-[var(--color-accent)]">Rename</button>
                        <button onClick={() => startMerge(tag)} className="rounded px-2 py-0.5 text-xs text-[var(--color-ink-soft)] transition-colors hover:bg-orange-50 hover:text-orange-600">Merge</button>
                        <button onClick={() => doDelete(tag)} className="rounded px-2 py-0.5 text-xs text-[var(--color-ink-faint)] transition-colors hover:text-red-500">Delete</button>
                      </div>
                    </div>
                  );
                })
          )}

          {mode === "merge" && (
            mergeTargets.length === 0
              ? <p className="px-4 py-8 text-center text-sm text-[var(--color-ink-faint)]">No other tags</p>
              : mergeTargets.map((tag) => {
                  const count  = tagCounts[tag];
                  const health = tagHealth(count, files.length);
                  return (
                    <button key={tag} onClick={() => confirmMerge(tag)} className="flex w-full items-center gap-3 px-4 py-2.5 transition-colors hover:bg-orange-50">
                      <span className={`h-2 w-2 shrink-0 rounded-full ${HEALTH[health].dot}`} />
                      <span className="flex-1 text-left text-sm text-[var(--color-ink)]">{tag}</span>
                      <span className="text-xs font-mono text-[var(--color-ink-faint)]">{count}</span>
                      <span className="text-xs text-orange-500">Merge →</span>
                    </button>
                  );
                })
          )}
        </div>

        <div className="flex items-center border-t border-[var(--color-border)] px-4 py-2">
          <span className="text-xs text-[var(--color-ink-faint)]">ESC to {mode !== "idle" ? "go back" : "close"}</span>
          {mode !== "idle" && (
            <button onClick={() => { setMode("idle"); setActionTag(null); setQuery(""); }} className="ml-auto text-xs text-[var(--color-ink-faint)] underline transition-colors hover:text-[var(--color-ink)]">← Back</button>
          )}
        </div>
      </div>
    </div>
  );
}

function VariantA({ files, canWrite, userId, ops, uploadZoneRef, teamId }: VariantProps) {
  const [activeTag, setActiveTag]   = useState<string | null>(null);
  const [search, setSearch]         = useState("");
  const [paletteOpen, setPaletteOpen] = useState(false);

  const allTags      = [...new Set(files.flatMap((f) => f.tags))].sort();
  const untagged     = files.filter((f) => f.tags.length === 0);
  const tagCounts    = Object.fromEntries(allTags.map((t) => [t, files.filter((f) => f.tags.includes(t)).length]));
  const filteredTags = allTags.filter((t) => !search || t.toLowerCase().includes(search.toLowerCase()));

  const visibleFiles = activeTag === "__untagged__"
    ? untagged
    : activeTag ? files.filter((f) => f.tags.includes(activeTag)) : [];

  const panelTitle = activeTag === "__untagged__"
    ? `Untagged (${untagged.length})`
    : activeTag ? `${activeTag} (${tagCounts[activeTag] ?? 0})` : null;

  // ⌘K shortcut
  useEffect(() => {
    if (!canWrite) return;
    function onKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setPaletteOpen(true); }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [canWrite]);

  function handleDeleteTag(tag: string) {
    if (!confirm(`Remove tag "${tag}" from all ${tagCounts[tag]} files?`)) return;
    ops.deleteTag(tag);
    if (activeTag === tag) setActiveTag(null);
  }

  return (
    <>
      <div className="flex h-full gap-0 overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-white)]">
        <aside className="flex w-56 shrink-0 flex-col border-r border-[var(--color-border)]">
          {/* Search + ⌘K button */}
          <div className="flex items-center gap-1 border-b border-[var(--color-border)] p-3">
            <div className="relative flex-1">
              <svg className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--color-ink-faint)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Find tag…" className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-card)] py-1.5 pl-7 pr-2 text-xs outline-none focus:border-[var(--color-accent)]" />
            </div>
            {canWrite && (
              <button
                onClick={() => setPaletteOpen(true)}
                title="Manage tags (⌘K)"
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-[var(--color-border)] text-[var(--color-ink-faint)] transition-colors hover:bg-[var(--color-bg-card)] hover:text-[var(--color-ink)]"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><circle cx={12} cy={12} r={3} /></svg>
              </button>
            )}
          </div>

          {untagged.length > 0 && (
            <button
              onClick={() => setActiveTag("__untagged__")}
              className={["flex items-center gap-2 border-b border-[var(--color-border)] px-4 py-2.5 text-left text-sm transition-colors", activeTag === "__untagged__" ? "bg-amber-50 font-semibold text-amber-700" : "text-[var(--color-ink-soft)] hover:bg-[var(--color-bg-card)]"].join(" ")}
            >
              <span className="h-2 w-2 shrink-0 rounded-full bg-amber-400" />
              <span className="flex-1 truncate">Untagged</span>
              <span className="shrink-0 font-mono text-xs">{untagged.length}</span>
            </button>
          )}

          <div className="flex-1 overflow-y-auto">
            {filteredTags.map((tag) => {
              const count  = tagCounts[tag];
              const health = tagHealth(count, files.length);
              const isActive = activeTag === tag;
              return (
                <div key={tag} className={["group flex items-center gap-2 border-b border-[var(--color-border)] px-4 py-2.5 transition-colors", isActive ? "bg-[var(--color-accent-bg)]" : "hover:bg-[var(--color-bg-card)]"].join(" ")}>
                  <span className={`h-2 w-2 shrink-0 rounded-full ${HEALTH[health].dot}`} />
                  <button
                    onClick={() => setActiveTag(tag)}
                    className={["flex-1 truncate text-left text-sm", isActive ? "font-semibold text-[var(--color-accent)]" : "text-[var(--color-ink-soft)]"].join(" ")}
                  >
                    {tag}
                  </button>
                  <span className="shrink-0 font-mono text-xs text-[var(--color-ink-faint)]">{count}</span>
                  {canWrite && (
                    <button onClick={() => handleDeleteTag(tag)} className="hidden shrink-0 text-[var(--color-ink-faint)] transition-colors group-hover:block hover:text-red-500">
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  )}
                </div>
              );
            })}
            {filteredTags.length === 0 && <p className="px-4 py-6 text-center text-xs text-[var(--color-ink-faint)]">No tags match</p>}
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          {panelTitle ? (
            <>
              <div className="flex items-center justify-between border-b border-[var(--color-border)] px-5 py-3">
                <h2 className="text-sm font-semibold text-[var(--color-ink)]">{panelTitle}</h2>
                {canWrite && activeTag && activeTag !== "__untagged__" && (
                  <div className="flex items-center gap-3">
                    <button onClick={() => setPaletteOpen(true)} className="text-xs text-[var(--color-ink-faint)] underline transition-colors hover:text-[var(--color-ink)]">⌘K Manage</button>
                    <button onClick={() => handleDeleteTag(activeTag)} className="text-xs text-red-400 underline transition-colors hover:text-red-600">Delete tag</button>
                  </div>
                )}
              </div>
              <div className="flex-1 overflow-y-auto">
                {visibleFiles.length === 0
                  ? <p className="px-5 py-10 text-center text-sm text-[var(--color-ink-faint)]">No files</p>
                  : visibleFiles.map((file) => (
                      <FileRow
                        key={file.id}
                        file={file}
                        activeTag={activeTag === "__untagged__" ? undefined : activeTag ?? undefined}
                        onTagClick={(t) => setActiveTag(t)}
                        onTagRemove={canWrite ? (t) => ops.updateFileTags(file.id, file.tags.filter((x) => x !== t)) : undefined}
                        onTagAdd={canWrite ? (t) => ops.updateFileTags(file.id, [...file.tags, t]) : undefined}
                        onDelete={() => { if (confirm(`Delete "${file.filename}"?`)) ops.updateFileTags(file.id, []); }}
                        canDelete
                      />
                    ))
                }
              </div>
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center">
              <p className="text-sm font-medium text-[var(--color-ink-soft)]">Select a tag to browse its files</p>
              <p className="text-xs text-[var(--color-ink-faint)]">{allTags.length} tags · {files.length} files{untagged.length > 0 && ` · ${untagged.length} untagged`}</p>
              {canWrite && <button onClick={() => setPaletteOpen(true)} className="mt-2 flex items-center gap-1.5 rounded-lg border border-[var(--color-border)] px-3 py-1.5 text-xs text-[var(--color-ink-soft)] transition-colors hover:bg-[var(--color-bg-card)]"><kbd className="rounded bg-[var(--color-bg-card)] px-1 text-[10px]">⌘K</kbd> Manage tags</button>}
              {canWrite && (
                <div className="mt-4 space-y-2">
                  <UrlImport onSavedToKb={() => {}} />
                  <UploadZone ref={uploadZoneRef} userId={userId} teamId={teamId} onUploadComplete={() => {}} />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {paletteOpen && canWrite && (
        <CommandPalette files={files} ops={ops} onNavigate={setActiveTag} onClose={() => setPaletteOpen(false)} />
      )}
    </>
  );
}

// ─── Variant B — Tag mosaic ───────────────────────────────────────────────────
// All tags displayed as pills sized proportionally to their file count.
// Health border colors. Rename on hover (pencil button). Click-to-merge.
// Clicking a tag opens a file panel on the right.

function VariantB({ files, canWrite, userId, ops, uploadZoneRef, teamId }: VariantProps) {
  const [activeTag,   setActiveTag]   = useState<string | null>(null);
  const [mergeSource, setMergeSource] = useState<string | null>(null);
  const [renamingTag, setRenamingTag] = useState<string | null>(null);

  const allTags   = [...new Set(files.flatMap((f) => f.tags))].sort();
  const tagCounts = Object.fromEntries(allTags.map((t) => [t, files.filter((f) => f.tags.includes(t)).length]));
  const maxCount  = Math.max(...Object.values(tagCounts), 1);

  // 3-tier size based on fraction of the largest tag
  function sizeClass(count: number): string {
    const r = count / maxCount;
    if (r > 0.5) return "px-5 py-2.5 text-base font-semibold";
    if (r > 0.2) return "px-3.5 py-1.5 text-sm font-medium";
    return "px-2.5 py-1 text-xs";
  }

  const HEALTH_BORDER = {
    orphan: { idle: "border-amber-200  hover:border-amber-400",  active: "border-amber-400"   },
    good:   { idle: "border-emerald-100 hover:border-emerald-300", active: "border-emerald-400" },
    broad:  { idle: "border-orange-200  hover:border-orange-400",  active: "border-orange-400"  },
  };

  function handleClick(tag: string) {
    if (mergeSource) {
      if (mergeSource === tag) { setMergeSource(null); return; }
      if (confirm(`Merge "${mergeSource}" into "${tag}"?`)) {
        ops.mergeTag(mergeSource, tag);
        if (activeTag === mergeSource) setActiveTag(tag);
        setMergeSource(null);
      }
      return;
    }
    setActiveTag(activeTag === tag ? null : tag);
  }

  const visibleFiles = activeTag ? files.filter((f) => f.tags.includes(activeTag)) : [];
  const untagged     = files.filter((f) => f.tags.length === 0);

  return (
    <div className="space-y-4">
      {/* Controls bar */}
      <div className="flex items-center gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-white)] px-4 py-2.5">
        <span className="text-sm font-semibold text-[var(--color-ink)]">{allTags.length} tags</span>
        <div className="flex items-center gap-3 text-xs text-[var(--color-ink-faint)]">
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-400" />healthy</span>
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-orange-400" />broad</span>
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-400" />single-file</span>
        </div>
        {canWrite && (
          <button
            onClick={() => setMergeSource(mergeSource ? null : "")}
            className={["ml-auto flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs transition-colors", mergeSource !== null ? "border-orange-300 bg-orange-50 font-semibold text-orange-700" : "border-[var(--color-border)] text-[var(--color-ink-soft)] hover:bg-[var(--color-bg-card)]"].join(" ")}
          >
            {mergeSource ? "Pick merge target" : "Merge mode"}
          </button>
        )}
        {mergeSource !== null && mergeSource !== "" && (
          <span className="flex items-center gap-1.5 text-xs">
            <span className="rounded-full bg-orange-100 px-2 py-0.5 font-medium text-orange-700">{mergeSource}</span>
            <span className="text-[var(--color-ink-faint)]">→ click a tag to merge into</span>
            <button onClick={() => setMergeSource(null)} className="text-orange-400 underline hover:text-orange-600">cancel</button>
          </span>
        )}
      </div>

      <div className="flex gap-4">
        {/* Mosaic */}
        <div className={activeTag ? "w-1/2" : "w-full"}>
          <div className="flex flex-wrap gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-white)] p-5">
            {allTags.map((tag) => {
              const count    = tagCounts[tag];
              const health   = tagHealth(count, files.length);
              const borders  = HEALTH_BORDER[health];
              const isActive = activeTag === tag;
              const isSrc    = mergeSource === tag;
              const isTgt    = mergeSource !== null && mergeSource !== "" && mergeSource !== tag;

              return (
                <div key={tag} className="group relative">
                  {renamingTag === tag ? (
                    <div className="rounded-full border-2 border-[var(--color-accent)] bg-white p-1">
                      <InlineRename
                        value={tag}
                        onSave={(v) => { ops.renameTag(tag, v); setRenamingTag(null); if (activeTag === tag) setActiveTag(v.trim().toLowerCase()); }}
                        onCancel={() => setRenamingTag(null)}
                      />
                    </div>
                  ) : (
                    <button
                      onClick={() => handleClick(tag)}
                      className={[
                        `flex items-center gap-1.5 rounded-full border-2 transition-all ${sizeClass(count)}`,
                        isActive ? "border-[var(--color-accent)] bg-[var(--color-accent-bg)] text-[var(--color-accent)]" :
                        isSrc    ? "ring-2 ring-orange-300 border-orange-400 bg-orange-50 text-orange-700" :
                        isTgt    ? "border-green-300 bg-green-50 text-green-800 hover:border-green-500" :
                        `${borders.idle} bg-[var(--color-bg-white)] text-[var(--color-ink)]`,
                      ].join(" ")}
                    >
                      <span className={`shrink-0 rounded-full ${HEALTH[health].dot} ${count / maxCount > 0.5 ? "h-2 w-2" : "h-1.5 w-1.5"}`} />
                      {tag}
                      <span className="font-mono opacity-50">{count}</span>
                    </button>
                  )}
                  {/* Rename button on hover */}
                  {canWrite && !mergeSource && renamingTag !== tag && (
                    <button
                      onClick={(e) => { e.stopPropagation(); setRenamingTag(tag); }}
                      title="Rename"
                      className="absolute -right-1 -top-1 hidden h-4 w-4 items-center justify-center rounded-full bg-[var(--color-accent)] text-[10px] text-white group-hover:flex"
                    >
                      ✎
                    </button>
                  )}
                </div>
              );
            })}
            {allTags.length === 0 && <p className="text-sm text-[var(--color-ink-faint)]">No tags yet</p>}
          </div>
          {untagged.length > 0 && (
            <p className="mt-2 text-center text-xs text-[var(--color-ink-faint)]">{untagged.length} untagged files not shown above</p>
          )}
        </div>

        {/* File panel */}
        {activeTag && (
          <div className="flex-1 overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-white)]">
            <div className="flex items-center justify-between border-b border-[var(--color-border)] px-4 py-3">
              <h3 className="text-sm font-semibold text-[var(--color-ink)]">
                {activeTag} <span className="font-normal text-[var(--color-ink-faint)]">({visibleFiles.length})</span>
              </h3>
              <button onClick={() => setActiveTag(null)} className="text-xs text-[var(--color-ink-faint)] transition-colors hover:text-[var(--color-ink)]">✕</button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto">
              {visibleFiles.map((file) => (
                <FileRow
                  key={file.id}
                  file={file}
                  activeTag={activeTag}
                  onTagRemove={canWrite ? (t) => ops.updateFileTags(file.id, file.tags.filter((x) => x !== t)) : undefined}
                  onTagAdd={canWrite ? (t) => ops.updateFileTags(file.id, [...file.tags, t]) : undefined}
                  canDelete
                  onDelete={() => { if (confirm(`Delete "${file.filename}"?`)) ops.updateFileTags(file.id, []); }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {canWrite && (
        <div className="space-y-2">
          <UrlImport onSavedToKb={() => {}} />
          <UploadZone ref={uploadZoneRef} userId={userId} teamId={teamId} onUploadComplete={() => {}} />
        </div>
      )}
    </div>
  );
}

// ─── Variant C — Multi-select sidebar ────────────────────────────────────────
// Checkboxes in the sidebar. Select 2+ tags → see overlap stats + batch ops.
// "Any" / "All" toggle for union vs intersection file view.
// Merge all selected into the first one.

function VariantC({ files, canWrite, userId, ops, uploadZoneRef, teamId }: VariantProps) {
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [mode,         setMode]         = useState<"union" | "intersection">("union");
  const [search,       setSearch]       = useState("");
  const [renamingTag,  setRenamingTag]  = useState<string | null>(null);

  const allTags   = [...new Set(files.flatMap((f) => f.tags))].sort();
  const tagCounts = Object.fromEntries(allTags.map((t) => [t, files.filter((f) => f.tags.includes(t)).length]));
  const filtered  = allTags.filter((t) => !search || t.toLowerCase().includes(search.toLowerCase()));
  const tagList   = [...selectedTags];

  function toggle(tag: string, e: React.MouseEvent) {
    setSelectedTags((prev) => {
      const next = new Set(prev);
      if (e.shiftKey || e.ctrlKey || e.metaKey) {
        next.has(tag) ? next.delete(tag) : next.add(tag);
      } else {
        if (next.size === 1 && next.has(tag)) next.clear();
        else { next.clear(); next.add(tag); }
      }
      return next;
    });
  }

  const visibleFiles = tagList.length === 0
    ? []
    : mode === "union"
      ? files.filter((f) => tagList.some((t) => f.tags.includes(t)))
      : files.filter((f) => tagList.every((t) => f.tags.includes(t)));

  const overlapFiles = tagList.length >= 2
    ? files.filter((f) => tagList.every((t) => f.tags.includes(t)))
    : [];

  // Common prefix detection
  const commonPrefix = (() => {
    if (tagList.length < 2) return null;
    let prefix = tagList[0];
    for (const t of tagList.slice(1)) {
      while (prefix.length > 0 && !t.startsWith(prefix)) prefix = prefix.slice(0, -1);
    }
    return prefix.length >= 3 ? prefix : null;
  })();

  function mergeIntoFirst() {
    const [first, ...rest] = tagList;
    if (!first) return;
    if (!confirm(`Merge ${rest.map((t) => `"${t}"`).join(", ")} into "${first}"?`)) return;
    rest.forEach((tag) => ops.mergeTag(tag, first));
    setSelectedTags(new Set([first]));
  }

  return (
    <div className="flex h-full gap-0 overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-white)]">
      {/* Sidebar */}
      <aside className="flex w-60 shrink-0 flex-col border-r border-[var(--color-border)]">
        <div className="border-b border-[var(--color-border)] p-3">
          <div className="relative">
            <svg className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--color-ink-faint)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Find tag…" className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-card)] py-1.5 pl-7 pr-2 text-xs outline-none focus:border-[var(--color-accent)]" />
          </div>
          <p className="mt-1.5 text-[10px] text-[var(--color-ink-faint)]">Click to browse · ⇧/⌘+click to multi-select</p>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filtered.map((tag) => {
            const count    = tagCounts[tag];
            const health   = tagHealth(count, files.length);
            const isSelected = selectedTags.has(tag);
            return (
              <div
                key={tag}
                className={["group flex cursor-pointer select-none items-center gap-2 border-b border-[var(--color-border)] px-4 py-2.5 transition-colors", isSelected ? "bg-[var(--color-accent-bg)]" : "hover:bg-[var(--color-bg-card)]"].join(" ")}
                onClick={(e) => toggle(tag, e)}
              >
                {/* Checkbox */}
                <span className={["flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors", isSelected ? "border-[var(--color-accent)] bg-[var(--color-accent)]" : "border-[var(--color-border)] bg-white"].join(" ")}>
                  {isSelected && <svg className="h-2.5 w-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                </span>
                <span className={`h-2 w-2 shrink-0 rounded-full ${HEALTH[health].dot}`} />
                {renamingTag === tag ? (
                  <InlineRename
                    value={tag}
                    onSave={(v) => { ops.renameTag(tag, v); setRenamingTag(null); setSelectedTags((prev) => { const n = new Set(prev); n.delete(tag); n.add(v.trim().toLowerCase()); return n; }); }}
                    onCancel={() => setRenamingTag(null)}
                  />
                ) : (
                  <span className={["flex-1 truncate text-sm", isSelected ? "font-semibold text-[var(--color-accent)]" : "text-[var(--color-ink-soft)]"].join(" ")}>{tag}</span>
                )}
                <span className="shrink-0 font-mono text-xs text-[var(--color-ink-faint)]">{count}</span>
                {canWrite && renamingTag !== tag && (
                  <button
                    onClick={(e) => { e.stopPropagation(); setRenamingTag(tag); }}
                    title="Rename"
                    className="hidden shrink-0 text-[var(--color-ink-faint)] transition-colors group-hover:block hover:text-[var(--color-accent)]"
                  >
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {selectedTags.size > 0 && (
          <div className="border-t border-[var(--color-border)] px-4 py-2.5">
            <button onClick={() => setSelectedTags(new Set())} className="text-xs text-[var(--color-ink-faint)] underline transition-colors hover:text-[var(--color-ink)]">Clear {selectedTags.size} selected</button>
          </div>
        )}
      </aside>

      {/* Right panel */}
      <div className="flex min-w-0 flex-1 flex-col">
        {tagList.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center">
            <p className="text-sm font-medium text-[var(--color-ink-soft)]">Click a tag to browse its files</p>
            <p className="text-xs text-[var(--color-ink-faint)]">Hold ⇧ or ⌘ to select multiple tags and compare</p>
            {canWrite && (
              <div className="mt-4 space-y-2">
                <UrlImport onSavedToKb={() => {}} />
                <UploadZone ref={uploadZoneRef} userId={userId} teamId={teamId} onUploadComplete={() => {}} />
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Selected tags header */}
            <div className="flex flex-wrap items-center gap-2 border-b border-[var(--color-border)] px-5 py-3">
              {tagList.map((t) => (
                <span key={t} className="flex items-center gap-1 rounded-full bg-[var(--color-accent-bg)] px-2.5 py-0.5 text-xs font-semibold text-[var(--color-accent)]">
                  {t}
                  <button onClick={() => setSelectedTags((p) => { const n = new Set(p); n.delete(t); return n; })} className="leading-none opacity-60 hover:opacity-100">×</button>
                </span>
              ))}
              {tagList.length > 1 && (
                <div className="ml-auto flex overflow-hidden rounded border border-[var(--color-border)]">
                  {(["union", "intersection"] as const).map((m) => (
                    <button key={m} onClick={() => setMode(m)} className={["px-2.5 py-0.5 text-xs transition-colors", mode === m ? "bg-[var(--color-accent)] font-medium text-white" : "text-[var(--color-ink-faint)] hover:bg-[var(--color-bg-card)]"].join(" ")}>
                      {m === "union" ? "Any tag" : "All tags"}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Overlap analysis panel */}
            {tagList.length >= 2 && (
              <div className="border-b border-[var(--color-border)] bg-[var(--color-bg-card)] px-5 py-3">
                <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs">
                  <span className="text-[var(--color-ink-soft)]">
                    <strong className="text-[var(--color-ink)]">{visibleFiles.length}</strong> files with {mode === "union" ? "any" : "all"} selected tags
                  </span>
                  {overlapFiles.length > 0 ? (
                    <span className="text-emerald-700">
                      <strong>{overlapFiles.length}</strong> files share all {tagList.length} tags
                      <span className="ml-1 text-emerald-500">— consider merging</span>
                    </span>
                  ) : (
                    <span className="text-[var(--color-ink-faint)]">No overlap — tags used on different files</span>
                  )}
                  {commonPrefix && (
                    <span className="text-[var(--color-ink-muted)]">
                      Common prefix: <code className="rounded bg-white px-1 py-0.5">{commonPrefix}</code>
                    </span>
                  )}
                  {canWrite && (
                    <button
                      onClick={mergeIntoFirst}
                      className="ml-auto flex items-center gap-1 rounded-lg border border-orange-200 bg-orange-50 px-2.5 py-1 text-xs font-medium text-orange-700 transition-colors hover:border-orange-300"
                    >
                      Merge all → &ldquo;{tagList[0]}&rdquo;
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* File list */}
            <div className="flex-1 overflow-y-auto">
              {visibleFiles.length === 0 ? (
                <p className="px-5 py-10 text-center text-sm text-[var(--color-ink-faint)]">
                  {mode === "intersection" ? "No files have all selected tags" : "No files"}
                </p>
              ) : visibleFiles.map((file) => (
                <FileRow
                  key={file.id}
                  file={file}
                  onTagClick={(t) => setSelectedTags((p) => { const n = new Set(p); n.has(t) ? n.delete(t) : n.add(t); return n; })}
                  onTagRemove={canWrite ? (t) => ops.updateFileTags(file.id, file.tags.filter((x) => x !== t)) : undefined}
                  onTagAdd={canWrite ? (t) => ops.updateFileTags(file.id, [...file.tags, t]) : undefined}
                  canDelete
                  onDelete={() => { if (confirm(`Delete "${file.filename}"?`)) ops.updateFileTags(file.id, []); }}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Prototype switcher ───────────────────────────────────────────────────────

const VARIANTS  = ["A", "B", "C"] as const;
const V_LABELS: Record<string, string> = {
  A: "A — ⌘K palette",
  B: "B — Tag mosaic",
  C: "C — Multi-select",
};

function PrototypeSwitcher({ variant }: { variant: string }) {
  const router = useRouter();
  if (process.env.NODE_ENV === "production") return null;
  const idx  = VARIANTS.indexOf(variant as (typeof VARIANTS)[number]);
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
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (e.key === "ArrowLeft")  go(prev);
      if (e.key === "ArrowRight") go(next);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });
  return (
    <div className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-full bg-gray-900 px-5 py-2.5 text-white shadow-2xl">
      <button onClick={() => go(prev)} className="text-lg leading-none text-gray-400 hover:text-white">←</button>
      <span className="text-sm font-medium">{V_LABELS[variant] ?? variant}</span>
      <button onClick={() => go(next)} className="text-lg leading-none text-gray-400 hover:text-white">→</button>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function KnowledgeBaseTagMgmt({ files: initialFiles, currentUser, userId, teamId, teamName, userRole }: Props) {
  const searchParams  = useSearchParams();
  const variant       = searchParams.get("variant") ?? "A";
  const uploadZoneRef = useRef<UploadZoneHandle>(null);
  const [files, setFiles] = useState<FileMetadata[]>(initialFiles);
  useEffect(() => { setFiles(initialFiles); }, [initialFiles]);

  const isTeam   = !!teamId;
  const canWrite = !isTeam || userRole === "owner" || userRole === "editor";
  const ops      = useTagOps(files, setFiles);

  const vProps: VariantProps = { files, canWrite, userId, teamId, ops, uploadZoneRef };

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--color-ink)]">
            {isTeam ? teamName : "Knowledge Base"}
          </h1>
          <p className="mt-0.5 text-sm text-[var(--color-ink-muted)]">
            {files.length.toLocaleString()} files · {currentUser}
          </p>
        </div>
        <Link href="/dashboard/mcp" className="flex items-center gap-1.5 rounded-xl border border-[var(--color-border)] px-3 py-1.5 text-xs text-[var(--color-ink-soft)] transition-colors hover:border-[var(--color-border-strong)]">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          MCP Ready
        </Link>
      </div>

      {variant === "A" && <VariantA {...vProps} />}
      {variant === "B" && <VariantB {...vProps} />}
      {variant === "C" && <VariantC {...vProps} />}

      <PrototypeSwitcher variant={variant} />
    </>
  );
}

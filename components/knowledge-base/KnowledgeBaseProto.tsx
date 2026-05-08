// PROTOTYPE — Tag-first knowledge base UX
// Question: What's the right primary affordance when tags hold all the value?
// Variants:
//   A = Tag browser   — navigate by tag; files are content within a tag
//   B = Tag health grid — see & manage your whole taxonomy at a glance
//   C = Bulk tagger   — operational cleanup; untagged-first; multi-select
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
  orphan: { dot: "bg-amber-400",  label: "Single file", badge: "bg-amber-50 text-amber-700"  },
  good:   { dot: "bg-emerald-400",label: "Healthy",     badge: "bg-emerald-50 text-emerald-700" },
  broad:  { dot: "bg-orange-400", label: "Too broad?",  badge: "bg-orange-50 text-orange-700"  },
};

// ─── Shared tag operations ────────────────────────────────────────────────────
// These fan out per-file updates. Optimistic local state means the UI
// feels instant even though N fetch calls happen in the background.

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
    files
      .filter((f) => f.tags.includes(oldTag))
      .forEach((f) => updateFileTags(f.id, f.tags.map((t) => (t === oldTag ? nt : t))));
  }, [files, updateFileTags]);

  const deleteTag = useCallback((tag: string) => {
    files
      .filter((f) => f.tags.includes(tag))
      .forEach((f) => updateFileTags(f.id, f.tags.filter((t) => t !== tag)));
  }, [files, updateFileTags]);

  const mergeTag = useCallback((from: string, into: string) => {
    files
      .filter((f) => f.tags.includes(from))
      .forEach((f) => {
        const next = f.tags.filter((t) => t !== from);
        if (!next.includes(into)) next.push(into);
        updateFileTags(f.id, next);
      });
  }, [files, updateFileTags]);

  const addTagToFiles = useCallback((ids: string[], tag: string) => {
    ids.forEach((id) => {
      const file = files.find((f) => f.id === id);
      if (file && !file.tags.includes(tag))
        updateFileTags(id, [...file.tags, tag]);
    });
  }, [files, updateFileTags]);

  return { updateFileTags, renameTag, deleteTag, mergeTag, addTagToFiles };
}

// ─── Small shared components ──────────────────────────────────────────────────

function FileIcon({ ct }: { ct: string }) {
  const cls = "flex h-6 w-6 shrink-0 items-center justify-center rounded-md";
  const ic  = "h-3.5 w-3.5";
  if (ct.startsWith("image/")) return <span className={`${cls} bg-blue-50`}><svg className={`${ic} text-blue-500`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></span>;
  if (ct.includes("pdf")) return <span className={`${cls} bg-red-50`}><svg className={`${ic} text-red-500`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg></span>;
  return <span className={`${cls} bg-[var(--color-bg-card)]`}><svg className={`${ic} text-[var(--color-ink-faint)]`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg></span>;
}

function Tag({ label, active, onClick, onRemove }: { label: string; active?: boolean; onClick?: () => void; onRemove?: () => void }) {
  return (
    <span className={[
      "flex shrink-0 items-center gap-0.5 rounded-full px-2 py-0.5 text-xs transition-colors",
      active
        ? "bg-[var(--color-accent)] font-semibold text-white"
        : "bg-[var(--color-bg-card)] text-[var(--color-ink-soft)] hover:bg-[var(--color-border)]",
      onClick ? "cursor-pointer" : "",
    ].join(" ")} onClick={onClick}>
      {label}
      {onRemove && (
        <button onClick={(e) => { e.stopPropagation(); onRemove(); }} className="ml-0.5 leading-none opacity-60 hover:opacity-100">×</button>
      )}
    </span>
  );
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
      onKeyDown={(e) => {
        if (e.key === "Enter") onSave(v);
        if (e.key === "Escape") onCancel();
      }}
      onBlur={() => onSave(v)}
      className="w-full rounded border border-[var(--color-accent)] bg-[var(--color-bg-white)] px-2 py-0.5 text-sm outline-none"
    />
  );
}

// Tags-first file row: tags are the headline, filename is the footnote
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
    setAddInput("");
    setAdding(false);
  }

  return (
    <div className="group flex items-start gap-3 border-b border-[var(--color-border)] px-4 py-3 transition-colors hover:bg-[var(--color-bg-card)]">
      <FileIcon ct={file.contentType} />
      <div className="min-w-0 flex-1">
        {/* Tags as headline */}
        <div className="flex flex-wrap items-center gap-1">
          {otherTags.length > 0
            ? otherTags.map((t) => (
                <Tag
                  key={t}
                  label={t}
                  onClick={onTagClick ? () => onTagClick(t) : undefined}
                  onRemove={onTagRemove ? () => onTagRemove(t) : undefined}
                />
              ))
            : activeTag
              ? <span className="text-xs text-[var(--color-ink-faint)] italic">no other tags</span>
              : <span className="text-xs text-[var(--color-ink-faint)] italic">untagged</span>
          }
          {onTagAdd && !adding && (
            <button onClick={() => setAdding(true)} className="rounded-full border border-dashed border-[var(--color-border-strong)] px-2 py-0.5 text-xs text-[var(--color-ink-faint)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors">
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
              placeholder="tag name…"
              className="w-24 rounded border border-[var(--color-accent)] bg-[var(--color-bg-white)] px-1.5 py-0.5 text-xs outline-none"
            />
          )}
        </div>
        {/* Filename as footnote */}
        <p className="mt-0.5 truncate text-xs text-[var(--color-ink-faint)]">{file.filename}</p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <span className="text-xs text-[var(--color-ink-faint)]">{formatBytes(file.size)}</span>
        <div className="flex items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
          <a href={`/api/knowledge-base/files/${file.id}/download`} title="Download" className="rounded p-1 text-[var(--color-ink-faint)] hover:bg-[var(--color-accent-bg)] hover:text-[var(--color-accent)] transition-colors">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
          </a>
          {canDelete && onDelete && (
            <button onClick={onDelete} title="Delete" className="rounded p-1 text-[var(--color-ink-faint)] hover:text-red-500 transition-colors">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Variant A — Tag browser ──────────────────────────────────────────────────
// Primary UX: you browse tags, not files.
// Left sidebar = tag list. Right panel = files within selected tag.
// Files display their OTHER tags as navigation — clicking navigates to that tag.
// Double-click a tag name to rename it globally.

function VariantA({ files, canWrite, userId, ops, uploadZoneRef, teamId }: VariantProps) {
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [renamingTag, setRenamingTag] = useState<string | null>(null);
  const [newTagInput, setNewTagInput] = useState("");
  const [search, setSearch] = useState("");

  const allTags = [...new Set(files.flatMap((f) => f.tags))].sort();
  const untaggedFiles = files.filter((f) => f.tags.length === 0);

  const tagCounts = Object.fromEntries(allTags.map((t) => [t, files.filter((f) => f.tags.includes(t)).length]));

  const filteredTags = allTags.filter((t) =>
    !search || t.toLowerCase().includes(search.toLowerCase())
  );

  const visibleFiles = activeTag === "__untagged__"
    ? untaggedFiles
    : activeTag
      ? files.filter((f) => f.tags.includes(activeTag))
      : [];

  function handleRename(oldTag: string, newTag: string) {
    ops.renameTag(oldTag, newTag);
    if (activeTag === oldTag) setActiveTag(newTag.trim().toLowerCase() || null);
    setRenamingTag(null);
  }

  function handleDeleteTag(tag: string) {
    if (!confirm(`Remove tag "${tag}" from all ${tagCounts[tag]} files?`)) return;
    ops.deleteTag(tag);
    if (activeTag === tag) setActiveTag(null);
  }

  function handleAddNewTag() {
    const t = newTagInput.trim().toLowerCase();
    if (!t) return;
    setNewTagInput("");
    setActiveTag(t);
  }

  const panelTitle = activeTag === "__untagged__"
    ? `Untagged (${untaggedFiles.length})`
    : activeTag
      ? `${activeTag} (${tagCounts[activeTag] ?? 0})`
      : null;

  return (
    <div className="flex h-full gap-0 overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-white)]">
      {/* Tag sidebar */}
      <aside className="flex w-56 shrink-0 flex-col border-r border-[var(--color-border)]">
        {/* Search tags */}
        <div className="border-b border-[var(--color-border)] p-3">
          <div className="relative">
            <svg className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--color-ink-faint)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Find tag…"
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-card)] py-1.5 pl-7 pr-2 text-xs outline-none focus:border-[var(--color-accent)]"
            />
          </div>
        </div>

        {/* Untagged bucket */}
        {untaggedFiles.length > 0 && (
          <button
            onClick={() => setActiveTag("__untagged__")}
            className={[
              "flex items-center gap-2 border-b border-[var(--color-border)] px-4 py-2.5 text-left text-sm transition-colors",
              activeTag === "__untagged__"
                ? "bg-amber-50 font-semibold text-amber-700"
                : "text-[var(--color-ink-soft)] hover:bg-[var(--color-bg-card)]",
            ].join(" ")}
          >
            <span className="h-2 w-2 rounded-full bg-amber-400 shrink-0" />
            <span className="flex-1 truncate">Untagged</span>
            <span className="shrink-0 text-xs font-mono">{untaggedFiles.length}</span>
          </button>
        )}

        {/* Tag list */}
        <div className="flex-1 overflow-y-auto">
          {filteredTags.map((tag) => {
            const count = tagCounts[tag];
            const health = tagHealth(count, files.length);
            const isActive = activeTag === tag;
            return (
              <div
                key={tag}
                className={[
                  "group flex items-center gap-2 border-b border-[var(--color-border)] px-4 py-2.5 transition-colors",
                  isActive ? "bg-[var(--color-accent-bg)]" : "hover:bg-[var(--color-bg-card)]",
                ].join(" ")}
              >
                <span className={`h-2 w-2 shrink-0 rounded-full ${HEALTH[health].dot}`} />
                {renamingTag === tag
                  ? <InlineRename value={tag} onSave={(v) => handleRename(tag, v)} onCancel={() => setRenamingTag(null)} />
                  : (
                    <button
                      onDoubleClick={() => setRenamingTag(tag)}
                      onClick={() => setActiveTag(tag)}
                      className={[
                        "flex-1 truncate text-left text-sm",
                        isActive ? "font-semibold text-[var(--color-accent)]" : "text-[var(--color-ink-soft)]",
                      ].join(" ")}
                      title="Click to browse · Double-click to rename"
                    >
                      {tag}
                    </button>
                  )
                }
                <span className="shrink-0 text-xs font-mono text-[var(--color-ink-faint)]">{count}</span>
                <button
                  onClick={() => handleDeleteTag(tag)}
                  title="Remove tag from all files"
                  className="hidden shrink-0 text-[var(--color-ink-faint)] hover:text-red-500 group-hover:block"
                >
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            );
          })}
          {filteredTags.length === 0 && (
            <p className="px-4 py-6 text-center text-xs text-[var(--color-ink-faint)]">No tags match</p>
          )}
        </div>

        {/* New tag input */}
        {canWrite && (
          <div className="border-t border-[var(--color-border)] p-3">
            <div className="flex gap-1">
              <input
                value={newTagInput}
                onChange={(e) => setNewTagInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleAddNewTag(); }}
                placeholder="New tag…"
                className="flex-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-card)] px-2 py-1.5 text-xs outline-none focus:border-[var(--color-accent)]"
              />
              <button
                onClick={handleAddNewTag}
                className="rounded-lg bg-[var(--color-accent)] px-2.5 py-1.5 text-xs font-medium text-white hover:bg-[var(--color-accent-hover)]"
              >
                Add
              </button>
            </div>
          </div>
        )}
      </aside>

      {/* File panel */}
      <div className="flex flex-1 flex-col min-w-0">
        {panelTitle ? (
          <>
            <div className="flex items-center justify-between border-b border-[var(--color-border)] px-5 py-3">
              <h2 className="text-sm font-semibold text-[var(--color-ink)]">{panelTitle}</h2>
              {activeTag && activeTag !== "__untagged__" && canWrite && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setRenamingTag(activeTag)}
                    className="text-xs text-[var(--color-ink-faint)] hover:text-[var(--color-ink)] underline"
                  >Rename tag</button>
                  <button
                    onClick={() => handleDeleteTag(activeTag)}
                    className="text-xs text-red-400 hover:text-red-600 underline"
                  >Delete tag</button>
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
            <p className="text-xs text-[var(--color-ink-faint)]">
              {allTags.length} tags · {files.length} files
              {untaggedFiles.length > 0 && ` · ${untaggedFiles.length} untagged`}
            </p>
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
  );
}

// ─── Variant B — Tag health grid ──────────────────────────────────────────────
// Primary UX: see your whole tag taxonomy at a glance.
// Cards show file count + health signal (healthy / too broad / single-file orphan).
// Click a card to expand and browse files inline.
// Merge button: select two tags → merge into one.

function VariantB({ files, canWrite, userId, ops, uploadZoneRef, teamId }: VariantProps) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [mergeSource, setMergeSource] = useState<string | null>(null);
  const [renamingTag, setRenamingTag] = useState<string | null>(null);

  const allTags = [...new Set(files.flatMap((f) => f.tags))].sort();
  const untaggedFiles = files.filter((f) => f.tags.length === 0);

  const tagData = allTags.map((tag) => {
    const tagged = files.filter((f) => f.tags.includes(tag));
    return { tag, files: tagged, health: tagHealth(tagged.length, files.length) };
  }).sort((a, b) => b.files.length - a.files.length);

  const broadCount  = tagData.filter((t) => t.health === "broad").length;
  const orphanCount = tagData.filter((t) => t.health === "orphan").length;

  function handleMerge(into: string) {
    if (!mergeSource || mergeSource === into) { setMergeSource(null); return; }
    if (!confirm(`Merge "${mergeSource}" into "${into}"? Files with "${mergeSource}" will get "${into}" instead.`)) return;
    ops.mergeTag(mergeSource, into);
    setMergeSource(null);
    if (expanded === mergeSource) setExpanded(into);
  }

  function handleDeleteTag(tag: string, count: number) {
    if (!confirm(`Remove tag "${tag}" from all ${count} files?`)) return;
    ops.deleteTag(tag);
    if (expanded === tag) setExpanded(null);
  }

  return (
    <div className="space-y-5">
      {/* Health summary banner */}
      <div className="flex flex-wrap items-center gap-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-white)] px-5 py-3">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[var(--color-accent)]" />
          <span className="text-sm font-semibold text-[var(--color-ink)]">{allTags.length} tags</span>
        </div>
        {untaggedFiles.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-amber-400" />
            <span className="text-sm text-amber-700">{untaggedFiles.length} untagged files</span>
          </div>
        )}
        {broadCount > 0 && (
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-orange-400" />
            <span className="text-sm text-orange-700">{broadCount} broad tags</span>
          </div>
        )}
        {orphanCount > 0 && (
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-amber-300" />
            <span className="text-sm text-[var(--color-ink-muted)]">{orphanCount} single-file tags</span>
          </div>
        )}
        {mergeSource && (
          <div className="ml-auto flex items-center gap-2 rounded-full bg-[var(--color-accent-bg)] px-3 py-1">
            <span className="text-xs font-semibold text-[var(--color-accent)]">Merging: {mergeSource}</span>
            <button onClick={() => setMergeSource(null)} className="text-[var(--color-accent)] hover:opacity-70">×</button>
          </div>
        )}
      </div>

      {/* Untagged card */}
      {untaggedFiles.length > 0 && (
        <div
          className={[
            "rounded-xl border-2 border-dashed border-amber-200 bg-amber-50 p-4 cursor-pointer transition-colors hover:border-amber-300",
            expanded === "__untagged__" ? "border-solid border-amber-400" : "",
          ].join(" ")}
          onClick={() => setExpanded(expanded === "__untagged__" ? null : "__untagged__")}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
              <h3 className="text-sm font-bold text-amber-800">Untagged</h3>
            </div>
            <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-700">{untaggedFiles.length} files</span>
          </div>
          <p className="mt-1 text-xs text-amber-600">These files have no tags and won't surface in tag browsing.</p>
          {expanded === "__untagged__" && (
            <div className="mt-3 overflow-hidden rounded-lg border border-amber-200 bg-white">
              {untaggedFiles.map((file) => (
                <FileRow
                  key={file.id}
                  file={file}
                  onTagAdd={canWrite ? (t) => ops.updateFileTags(file.id, [...file.tags, t]) : undefined}
                  canDelete
                  onDelete={() => { if (confirm(`Delete "${file.filename}"?`)) ops.updateFileTags(file.id, []); }}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tag cards grid */}
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-3">
        {tagData.map(({ tag, files: tagFiles, health }) => {
          const { dot, label, badge } = HEALTH[health];
          const isExpanded = expanded === tag;
          const isMergeSource = mergeSource === tag;
          const isMergeTarget = mergeSource && mergeSource !== tag;

          return (
            <div
              key={tag}
              className={[
                "rounded-xl border bg-[var(--color-bg-white)] transition-all",
                isExpanded ? "col-span-full border-[var(--color-accent)]" : "border-[var(--color-border)]",
                isMergeSource ? "ring-2 ring-[var(--color-accent)]" : "",
              ].join(" ")}
            >
              {/* Card header */}
              <div
                className="flex cursor-pointer items-center gap-3 p-4"
                onClick={() => !mergeSource
                  ? setExpanded(isExpanded ? null : tag)
                  : isMergeTarget && handleMerge(tag)
                }
              >
                <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${dot}`} />
                <div className="min-w-0 flex-1">
                  {renamingTag === tag
                    ? <InlineRename value={tag} onSave={(v) => { ops.renameTag(tag, v); setRenamingTag(null); if (expanded === tag) setExpanded(v.trim().toLowerCase()); }} onCancel={() => setRenamingTag(null)} />
                    : <h3 className="truncate text-sm font-semibold text-[var(--color-ink)]">{tag}</h3>
                  }
                  <p className="text-xs text-[var(--color-ink-faint)]">{tagFiles.length} files</p>
                </div>
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${badge}`}>{label}</span>
              </div>

              {/* Sample filenames (collapsed) */}
              {!isExpanded && (
                <div className="space-y-1 border-t border-[var(--color-border)] px-4 pb-3 pt-2">
                  {tagFiles.slice(0, 3).map((f) => (
                    <p key={f.id} className="truncate text-xs text-[var(--color-ink-faint)]">{f.filename}</p>
                  ))}
                  {tagFiles.length > 3 && (
                    <p className="text-xs text-[var(--color-ink-faint)]">+{tagFiles.length - 3} more</p>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-2 border-t border-[var(--color-border)] px-4 py-2">
                {canWrite && (
                  <>
                    <button onClick={() => setRenamingTag(tag)} className="text-xs text-[var(--color-ink-faint)] hover:text-[var(--color-ink)] transition-colors">Rename</button>
                    <button onClick={() => setMergeSource(isMergeSource ? null : tag)} className={`text-xs transition-colors ${isMergeSource ? "font-semibold text-[var(--color-accent)]" : "text-[var(--color-ink-faint)] hover:text-[var(--color-ink)]"}`}>
                      {isMergeSource ? "Cancel merge" : "Merge into…"}
                    </button>
                    <button onClick={() => handleDeleteTag(tag, tagFiles.length)} className="ml-auto text-xs text-[var(--color-ink-faint)] hover:text-red-500 transition-colors">Delete tag</button>
                  </>
                )}
              </div>

              {/* Expanded file list */}
              {isExpanded && (
                <div className="border-t border-[var(--color-border)]">
                  {tagFiles.map((file) => (
                    <FileRow
                      key={file.id}
                      file={file}
                      activeTag={tag}
                      onTagRemove={canWrite ? (t) => ops.updateFileTags(file.id, file.tags.filter((x) => x !== t)) : undefined}
                      onTagAdd={canWrite ? (t) => ops.updateFileTags(file.id, [...file.tags, t]) : undefined}
                      canDelete
                      onDelete={() => { if (confirm(`Delete "${file.filename}"?`)) ops.updateFileTags(file.id, []); }}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Upload */}
      {canWrite && (
        <div className="space-y-2">
          <UrlImport onSavedToKb={() => {}} />
          <UploadZone ref={uploadZoneRef} userId={userId} teamId={teamId} onUploadComplete={() => {}} />
        </div>
      )}
    </div>
  );
}

// ─── Variant C — Bulk tagger ──────────────────────────────────────────────────
// Primary UX: operational cleanup of untagged files.
// Default sort: untagged files first, then by newest.
// Multi-select checkboxes → floating action bar → bulk add/remove tag.

function VariantC({ files, canWrite, userId, ops, uploadZoneRef, teamId }: VariantProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkTag, setBulkTag] = useState("");
  const [search, setSearch] = useState("");

  const allTags = [...new Set(files.flatMap((f) => f.tags))].sort();
  const untaggedCount = files.filter((f) => f.tags.length === 0).length;

  // Sort: untagged first, then newest
  const sorted = [...files].sort((a, b) => {
    const aTagged = a.tags.length > 0 ? 1 : 0;
    const bTagged = b.tags.length > 0 ? 1 : 0;
    if (aTagged !== bTagged) return aTagged - bTagged;
    return +new Date(b.uploadedAt) - +new Date(a.uploadedAt);
  });

  const visible = sorted.filter((f) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return f.filename.toLowerCase().includes(q) || f.tags.some((t) => t.toLowerCase().includes(q));
  });

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function selectAll() {
    setSelected(new Set(visible.map((f) => f.id)));
  }

  function clearSelection() { setSelected(new Set()); }

  function applyBulkTag() {
    const t = bulkTag.trim().toLowerCase();
    if (!t) return;
    ops.addTagToFiles([...selected], t);
    setBulkTag("");
    setSelected(new Set());
  }

  function removeBulkTag(tag: string) {
    [...selected].forEach((id) => {
      const file = files.find((f) => f.id === id);
      if (file) ops.updateFileTags(id, file.tags.filter((t) => t !== tag));
    });
    setSelected(new Set());
  }

  const selectedFiles = files.filter((f) => selected.has(f.id));
  const commonTags = allTags.filter((t) => selectedFiles.every((f) => f.tags.includes(t)));

  return (
    <div className="space-y-4">
      {/* Upload */}
      {canWrite && (
        <div className="space-y-2">
          <UrlImport onSavedToKb={() => {}} />
          <UploadZone ref={uploadZoneRef} userId={userId} teamId={teamId} onUploadComplete={() => {}} />
        </div>
      )}

      {/* Status + search bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-ink-faint)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search files or tags…" className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-white)] py-2.5 pl-9 pr-4 text-sm outline-none focus:border-[var(--color-accent)]" />
        </div>
        {untaggedCount > 0 && (
          <div className="flex shrink-0 items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5">
            <span className="h-2 w-2 rounded-full bg-amber-400" />
            <span className="text-sm font-semibold text-amber-700">{untaggedCount} untagged</span>
          </div>
        )}
      </div>

      {/* Bulk action bar */}
      {selected.size > 0 && (
        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-[var(--color-accent)] bg-[var(--color-accent-bg)] px-4 py-3">
          <span className="text-sm font-semibold text-[var(--color-accent)]">{selected.size} selected</span>

          {/* Add tag */}
          {canWrite && (
            <div className="flex items-center gap-1">
              <input
                value={bulkTag}
                onChange={(e) => setBulkTag(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") applyBulkTag(); }}
                list="tag-suggestions"
                placeholder="Add tag…"
                className="w-32 rounded-lg border border-[var(--color-accent)] bg-white px-2.5 py-1 text-xs outline-none"
              />
              <datalist id="tag-suggestions">
                {allTags.map((t) => <option key={t} value={t} />)}
              </datalist>
              <button onClick={applyBulkTag} className="rounded-lg bg-[var(--color-accent)] px-2.5 py-1 text-xs font-medium text-white hover:bg-[var(--color-accent-hover)]">
                Apply
              </button>
            </div>
          )}

          {/* Remove common tags */}
          {canWrite && commonTags.length > 0 && (
            <div className="flex flex-wrap items-center gap-1">
              <span className="text-xs text-[var(--color-ink-muted)]">Remove:</span>
              {commonTags.map((t) => (
                <button key={t} onClick={() => removeBulkTag(t)} className="flex items-center gap-0.5 rounded-full bg-white px-2 py-0.5 text-xs text-[var(--color-ink-soft)] hover:bg-red-50 hover:text-red-600 transition-colors">
                  {t} ×
                </button>
              ))}
            </div>
          )}

          <button onClick={clearSelection} className="ml-auto text-xs text-[var(--color-ink-faint)] hover:text-[var(--color-ink)] underline">
            Clear selection
          </button>
        </div>
      )}

      {/* Select all row */}
      <div className="flex items-center gap-3 px-1">
        <input
          type="checkbox"
          checked={selected.size === visible.length && visible.length > 0}
          onChange={() => selected.size === visible.length ? clearSelection() : selectAll()}
          className="h-3.5 w-3.5 rounded accent-[var(--color-accent)]"
        />
        <span className="text-xs text-[var(--color-ink-faint)]">
          {selected.size > 0
            ? `${selected.size} of ${visible.length} selected`
            : `${visible.length} files · untagged shown first`}
        </span>
      </div>

      {/* File list */}
      <div className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-white)]">
        {visible.map((file) => {
          const isSelected = selected.has(file.id);
          const isUntagged = file.tags.length === 0;
          return (
            <div
              key={file.id}
              className={[
                "group flex items-start gap-3 border-b border-[var(--color-border)] px-4 py-3 transition-colors",
                isSelected ? "bg-[var(--color-accent-bg)]" : isUntagged ? "bg-amber-50/40" : "hover:bg-[var(--color-bg-card)]",
              ].join(" ")}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => toggleSelect(file.id)}
                className="mt-0.5 h-3.5 w-3.5 shrink-0 rounded accent-[var(--color-accent)]"
              />
              <FileIcon ct={file.contentType} />
              <div className="min-w-0 flex-1">
                {/* Tags first */}
                <div className="flex flex-wrap items-center gap-1">
                  {file.tags.length > 0
                    ? file.tags.map((t) => (
                        <Tag
                          key={t}
                          label={t}
                          onRemove={canWrite ? () => ops.updateFileTags(file.id, file.tags.filter((x) => x !== t)) : undefined}
                        />
                      ))
                    : <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">untagged</span>
                  }
                  {canWrite && (
                    <QuickAddTag
                      onAdd={(t) => ops.updateFileTags(file.id, [...file.tags, t])}
                      existing={file.tags}
                      allTags={allTags}
                    />
                  )}
                </div>
                {/* Filename secondary */}
                <p className="mt-0.5 truncate text-xs text-[var(--color-ink-faint)]">{file.filename}</p>
              </div>
              <span className="shrink-0 text-xs text-[var(--color-ink-faint)]">{formatBytes(file.size)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function QuickAddTag({ onAdd, existing, allTags }: { onAdd: (t: string) => void; existing: string[]; allTags: string[] }) {
  const [v, setV] = useState("");
  const [open, setOpen] = useState(false);
  if (!open) return (
    <button onClick={() => setOpen(true)} className="rounded-full border border-dashed border-[var(--color-border-strong)] px-2 py-0.5 text-xs text-[var(--color-ink-faint)] opacity-0 transition-opacity group-hover:opacity-100 hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]">
      + tag
    </button>
  );
  function submit() {
    const t = v.trim().toLowerCase();
    if (t && !existing.includes(t)) onAdd(t);
    setV(""); setOpen(false);
  }
  return (
    <input
      autoFocus
      value={v}
      onChange={(e) => setV(e.target.value)}
      onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); submit(); } if (e.key === "Escape") setOpen(false); }}
      onBlur={submit}
      list="tag-suggestions"
      placeholder="tag…"
      className="w-20 rounded border border-[var(--color-accent)] bg-[var(--color-bg-white)] px-1.5 py-0.5 text-xs outline-none"
    />
  );
}

// ─── Prototype switcher ───────────────────────────────────────────────────────

const VARIANTS = ["A", "B", "C"] as const;
const V_LABELS: Record<string, string> = {
  A: "A — Tag browser",
  B: "B — Tag health grid",
  C: "C — Bulk tagger",
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
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (e.key === "ArrowLeft") go(prev);
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

// ─── Shared prop type ─────────────────────────────────────────────────────────

interface VariantProps {
  files: FileMetadata[];
  canWrite: boolean;
  userId: string;
  teamId: string | null;
  ops: ReturnType<typeof useTagOps>;
  uploadZoneRef: React.RefObject<UploadZoneHandle | null>;
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function KnowledgeBaseProto({ files: initialFiles, currentUser, userId, teamId, teamName, userRole }: Props) {
  const searchParams = useSearchParams();
  const variant = searchParams.get("variant") ?? "A";
  const uploadZoneRef = useRef<UploadZoneHandle>(null);
  const [files, setFiles] = useState<FileMetadata[]>(initialFiles);
  useEffect(() => { setFiles(initialFiles); }, [initialFiles]);

  const isTeam = !!teamId;
  const canWrite = !isTeam || userRole === "owner" || userRole === "editor";
  const ops = useTagOps(files, setFiles);

  const variantProps: VariantProps = { files, canWrite, userId, teamId, ops, uploadZoneRef };

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

      {variant === "A" && <VariantA {...variantProps} />}
      {variant === "B" && <VariantB {...variantProps} />}
      {variant === "C" && <VariantC {...variantProps} />}

      <PrototypeSwitcher variant={variant} />
    </>
  );
}

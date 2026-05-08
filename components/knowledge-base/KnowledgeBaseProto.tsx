// PROTOTYPE — Full page redesign. Focus: tags + type filtering.
// Question: Which layout makes types and tags actually usable?
// Variants: A = pill strip + tag popover | B = tag cloud header | C = searchable sidebar
// Keep dense file rows across all variants.

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

export type SortKey = "newest" | "oldest" | "name" | "size";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatBytes(b: number) {
  if (b < 1024) return `${b} B`;
  if (b < 1048576) return `${(b / 1024).toFixed(1)} KB`;
  if (b < 1073741824) return `${(b / 1048576).toFixed(1)} MB`;
  return `${(b / 1073741824).toFixed(2)} GB`;
}

function sortFiles(files: FileMetadata[], by: SortKey) {
  return [...files].sort((a, b) => {
    if (by === "newest") return +new Date(b.uploadedAt) - +new Date(a.uploadedAt);
    if (by === "oldest") return +new Date(a.uploadedAt) - +new Date(b.uploadedAt);
    if (by === "name") return a.filename.localeCompare(b.filename);
    return b.size - a.size;
  });
}

type TypeGroup = "PDF" | "Image" | "Video" | "Audio" | "Data" | "Text" | "Other";
const TYPE_GROUPS: TypeGroup[] = ["PDF", "Image", "Video", "Audio", "Data", "Text", "Other"];
const TYPE_COLORS: Record<TypeGroup, string> = {
  PDF: "bg-red-100 text-red-700",
  Image: "bg-blue-100 text-blue-700",
  Video: "bg-orange-100 text-orange-700",
  Audio: "bg-pink-100 text-pink-700",
  Data: "bg-green-100 text-green-700",
  Text: "bg-slate-100 text-slate-600",
  Other: "bg-gray-100 text-gray-500",
};
const TYPE_DOT: Record<TypeGroup, string> = {
  PDF: "bg-red-400", Image: "bg-blue-400", Video: "bg-orange-400",
  Audio: "bg-pink-400", Data: "bg-green-400", Text: "bg-slate-400", Other: "bg-gray-300",
};

function getTypeGroup(ct: string): TypeGroup {
  if (ct.includes("pdf")) return "PDF";
  if (ct.startsWith("image/")) return "Image";
  if (ct.startsWith("video/")) return "Video";
  if (ct.startsWith("audio/")) return "Audio";
  if (ct.includes("json") || ct.includes("yaml") || ct.includes("xml")) return "Data";
  if (ct.startsWith("text/")) return "Text";
  return "Other";
}

function matchesType(ct: string, f: string) {
  if (f === "all") return true;
  return getTypeGroup(ct) === f;
}

// ─── File icon ────────────────────────────────────────────────────────────────

function FileIcon({ ct }: { ct: string }) {
  const type = getTypeGroup(ct);
  const cls = "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg";
  const icls = "h-3.5 w-3.5";
  if (type === "Image") return <span className={`${cls} bg-blue-50`}><svg className={`${icls} text-blue-500`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></span>;
  if (type === "PDF") return <span className={`${cls} bg-red-50`}><svg className={`${icls} text-red-500`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg></span>;
  if (type === "Data") return <span className={`${cls} bg-green-50`}><svg className={`${icls} text-green-600`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg></span>;
  if (type === "Video") return <span className={`${cls} bg-orange-50`}><svg className={`${icls} text-orange-500`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg></span>;
  return <span className={`${cls} bg-[var(--color-bg-card)]`}><svg className={`${icls} text-[var(--color-ink-faint)]`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg></span>;
}

// ─── Tag popover (click count badge → manage all tags) ────────────────────────

function TagPopover({ tags, onRemove, onAdd, onFilter, activeFilters }: {
  tags: string[];
  onRemove?: (t: string) => void;
  onAdd?: (t: string) => void;
  onFilter?: (t: string) => void;
  activeFilters?: string[];
}) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function h(e: MouseEvent) { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); }
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open]);

  function addTag() {
    const t = input.trim().toLowerCase();
    if (t && onAdd && !tags.includes(t)) { onAdd(t); setInput(""); }
  }

  const label = tags.length === 0 ? "no tags" : `${tags.length} tag${tags.length === 1 ? "" : "s"}`;

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        onClick={() => setOpen(v => !v)}
        className={[
          "flex items-center gap-1 rounded-full px-2.5 py-1 text-xs transition-colors",
          tags.length === 0
            ? "text-[var(--color-ink-faint)] hover:bg-[var(--color-bg-card)]"
            : "bg-[var(--color-bg-card)] text-[var(--color-ink-soft)] hover:bg-[var(--color-border)]",
        ].join(" ")}
      >
        {tags.length > 0 && <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)] shrink-0" />}
        {label}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-1.5 w-52 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-white)] shadow-xl">
          {tags.length > 0 ? (
            <ul className="max-h-48 overflow-y-auto p-1">
              {tags.map((t) => (
                <li key={t} className="flex items-center gap-1 rounded-lg px-2 py-1.5 hover:bg-[var(--color-bg-card)]">
                  <button
                    onClick={() => { onFilter?.(t); setOpen(false); }}
                    className={[
                      "flex-1 truncate text-left text-xs",
                      activeFilters?.includes(t) ? "font-semibold text-[var(--color-accent)]" : "text-[var(--color-ink-soft)]",
                    ].join(" ")}
                    title={`Filter by "${t}"`}
                  >{t}</button>
                  {onRemove && (
                    <button onClick={() => onRemove(t)} className="shrink-0 text-[var(--color-ink-faint)] hover:text-red-400 text-sm leading-none">×</button>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-3 py-2.5 text-xs text-[var(--color-ink-faint)]">No tags yet</p>
          )}
          {onAdd && (
            <div className="border-t border-[var(--color-border)] p-2">
              <input
                autoFocus={tags.length === 0}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
                placeholder="Add tag…"
                className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-card)] px-2 py-1 text-xs outline-none focus:border-[var(--color-accent)]"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Dense file row (shared) ──────────────────────────────────────────────────

function DenseRow({ file, canDelete, onTagsChange, onDelete, onTagFilter, activeTagFilters }: {
  file: FileMetadata;
  canDelete: boolean;
  onTagsChange?: (tags: string[]) => void;
  onDelete: () => void;
  onTagFilter?: (t: string) => void;
  activeTagFilters?: string[];
}) {
  const [deleting, setDeleting] = useState(false);

  function handleDelete() {
    if (!confirm(`Delete "${file.filename}"?`)) return;
    setDeleting(true);
    onDelete();
  }

  return (
    <div className="group flex items-center gap-3 border-b border-[var(--color-border)] px-4 py-2.5 transition-colors hover:bg-[var(--color-bg-card)]">
      <FileIcon ct={file.contentType} />
      <a
        href={`/api/knowledge-base/files/${file.id}/download`}
        className="min-w-0 flex-1 truncate text-sm text-[var(--color-ink)] transition-colors hover:text-[var(--color-accent)]"
      >
        {file.filename}
      </a>

      <TagPopover
        tags={file.tags}
        onRemove={onTagsChange ? (t) => onTagsChange(file.tags.filter((x) => x !== t)) : undefined}
        onAdd={onTagsChange ? (t) => onTagsChange([...file.tags, t]) : undefined}
        onFilter={onTagFilter}
        activeFilters={activeTagFilters}
      />

      <span className="w-14 shrink-0 text-right text-xs text-[var(--color-ink-faint)]">{formatBytes(file.size)}</span>

      <div className="flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
        <a href={`/api/knowledge-base/files/${file.id}/download`} title="Download" className="rounded p-1.5 text-[var(--color-ink-faint)] transition-colors hover:bg-[var(--color-accent-bg)] hover:text-[var(--color-accent)]">
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
        </a>
        {canDelete && (
          <button onClick={handleDelete} disabled={deleting} title="Delete" className="rounded p-1.5 text-[var(--color-ink-faint)] transition-colors hover:text-red-500 disabled:opacity-40">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
          </button>
        )}
      </div>
    </div>
  );
}

function FileListEmpty() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <p className="text-sm font-medium text-[var(--color-ink-soft)]">No files match your filters</p>
      <p className="mt-1 text-xs text-[var(--color-ink-faint)]">Try clearing some filters</p>
    </div>
  );
}

// ─── Sort + search row ────────────────────────────────────────────────────────

function SearchBar({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="relative flex-1">
      <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-ink-faint)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search files and tags…"
        className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-white)] py-2.5 pl-9 pr-4 text-sm text-[var(--color-ink)] placeholder:text-[var(--color-ink-faint)] focus:border-[var(--color-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
      />
    </div>
  );
}

function SortSelect({ value, onChange }: { value: SortKey; onChange: (v: SortKey) => void }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as SortKey)}
      className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-white)] px-3 py-2.5 text-sm text-[var(--color-ink)] focus:border-[var(--color-accent)] focus:outline-none"
    >
      <option value="newest">Newest first</option>
      <option value="oldest">Oldest first</option>
      <option value="name">Name A–Z</option>
      <option value="size">Largest first</option>
    </select>
  );
}

// ─── Variant A — Pill strip + tag popover ─────────────────────────────────────
// No sidebar. Type pills across the top. Active tags as dismissible chips.
// Per-row tag count badge opens a full tag management popover.

function VariantA({ state, handlers, uploadZoneRef, canWrite, isTeam, userId, teamId }: SharedProps) {
  const { files, visibleFiles, search, sortBy, typeFilter, selectedTags, allTags } = state;
  const { setSearch, setSortBy, setTypeFilter, toggleTag, clearFilters, handleTagsChange, handleDelete } = handlers;

  const typeCounts = TYPE_GROUPS.reduce<Record<string, number>>((acc, t) => {
    acc[t] = files.filter((f) => getTypeGroup(f.contentType) === t).length;
    return acc;
  }, {});
  const activeTypes = TYPE_GROUPS.filter((t) => typeCounts[t] > 0);

  return (
    <div className="space-y-4">
      {/* Search + sort */}
      <div className="flex gap-3">
        <SearchBar value={search} onChange={setSearch} />
        <SortSelect value={sortBy} onChange={setSortBy} />
        {canWrite && <UploadBtn uploadZoneRef={uploadZoneRef} />}
      </div>

      {/* Type pill strip */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setTypeFilter("all")}
          className={pill(typeFilter === "all")}
        >
          All files
          <span className="ml-1 text-[10px] opacity-60">{files.length}</span>
        </button>
        {activeTypes.map((t) => (
          <button
            key={t}
            onClick={() => setTypeFilter(typeFilter === t ? "all" : t)}
            className={[
              "flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors",
              typeFilter === t
                ? `${TYPE_COLORS[t as TypeGroup]} border-transparent`
                : "border-[var(--color-border)] bg-[var(--color-bg-white)] text-[var(--color-ink-soft)] hover:border-[var(--color-border-strong)]",
            ].join(" ")}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${TYPE_DOT[t as TypeGroup]}`} />
            {t}
            <span className="opacity-50">{typeCounts[t]}</span>
          </button>
        ))}
      </div>

      {/* Active tag filter chips */}
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-[var(--color-ink-faint)]">Filtered by:</span>
          {selectedTags.map((t) => (
            <button
              key={t}
              onClick={() => toggleTag(t)}
              className="flex items-center gap-1 rounded-full bg-[var(--color-accent-bg)] px-3 py-1 text-xs font-semibold text-[var(--color-accent)]"
            >
              {t} <span className="ml-0.5 opacity-60">×</span>
            </button>
          ))}
          <button onClick={clearFilters} className="text-xs text-[var(--color-ink-faint)] hover:text-[var(--color-ink)] underline">
            Clear all
          </button>
        </div>
      )}

      {/* Upload zone + URL import */}
      {canWrite && (
        <div className="space-y-2">
          <UrlImport onSavedToKb={() => {}} />
          <UploadZone ref={uploadZoneRef} userId={userId} teamId={teamId} onUploadComplete={() => {}} />
        </div>
      )}

      {/* File list */}
      <div className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-white)]">
        {visibleFiles.length === 0 ? <FileListEmpty /> : visibleFiles.map((file) => (
          <DenseRow
            key={file.id}
            file={file}
            canDelete={isTeam ? file.userId === userId : true}
            onTagsChange={canWrite ? (tags) => handleTagsChange(file.id, tags) : undefined}
            onDelete={() => handleDelete(file.id)}
            onTagFilter={toggleTag}
            activeTagFilters={selectedTags}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Variant B — Tag cloud header ─────────────────────────────────────────────
// Tags displayed as a sortable cloud at the top (most-used first).
// Clicking a tag filters. Types as a compact toggle strip.

function VariantB({ state, handlers, uploadZoneRef, canWrite, isTeam, userId, teamId }: SharedProps) {
  const { files, visibleFiles, search, sortBy, typeFilter, selectedTags, allTags } = state;
  const { setSearch, setSortBy, setTypeFilter, toggleTag, clearFilters, handleTagsChange, handleDelete } = handlers;
  const [showAllTags, setShowAllTags] = useState(false);

  const tagFreq = allTags
    .map((t) => ({ tag: t, count: files.filter((f) => f.tags.includes(t)).length }))
    .sort((a, b) => b.count - a.count);

  const VISIBLE_TAGS = 24;
  const displayedTags = showAllTags ? tagFreq : tagFreq.slice(0, VISIBLE_TAGS);
  const hiddenCount = tagFreq.length - VISIBLE_TAGS;

  const typeCounts = TYPE_GROUPS.reduce<Record<string, number>>((acc, t) => {
    acc[t] = files.filter((f) => getTypeGroup(f.contentType) === t).length;
    return acc;
  }, {});
  const activeTypes = TYPE_GROUPS.filter((t) => typeCounts[t] > 0);

  return (
    <div className="space-y-5">
      {/* Header row */}
      <div className="flex gap-3">
        <SearchBar value={search} onChange={setSearch} />
        <SortSelect value={sortBy} onChange={setSortBy} />
        {canWrite && <UploadBtn uploadZoneRef={uploadZoneRef} />}
      </div>

      {/* Tag cloud */}
      {allTags.length > 0 && (
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-white)] p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-faint)]">Tags</p>
            {selectedTags.length > 0 && (
              <button onClick={clearFilters} className="text-xs text-[var(--color-accent)] hover:underline">Clear</button>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {displayedTags.map(({ tag, count }) => {
              const active = selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={[
                    "flex items-center gap-1 rounded-full px-2.5 py-1 text-xs transition-colors",
                    active
                      ? "bg-[var(--color-accent)] font-semibold text-white"
                      : "bg-[var(--color-bg-card)] text-[var(--color-ink-soft)] hover:bg-[var(--color-border)]",
                  ].join(" ")}
                >
                  {tag}
                  <span className={`text-[10px] ${active ? "opacity-80" : "opacity-50"}`}>{count}</span>
                </button>
              );
            })}
            {!showAllTags && hiddenCount > 0 && (
              <button
                onClick={() => setShowAllTags(true)}
                className="rounded-full border border-dashed border-[var(--color-border-strong)] px-2.5 py-1 text-xs text-[var(--color-ink-faint)] hover:text-[var(--color-ink)]"
              >
                +{hiddenCount} more
              </button>
            )}
          </div>
        </div>
      )}

      {/* Type toggle strip */}
      {activeTypes.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
          <button onClick={() => setTypeFilter("all")} className={pill(typeFilter === "all")}>All</button>
          {activeTypes.map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(typeFilter === t ? "all" : t)}
              className={[
                "flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                typeFilter === t
                  ? `${TYPE_COLORS[t as TypeGroup]} border-transparent`
                  : "border-[var(--color-border)] bg-[var(--color-bg-white)] text-[var(--color-ink-soft)] hover:border-[var(--color-border-strong)]",
              ].join(" ")}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${TYPE_DOT[t as TypeGroup]}`} />
              {t} <span className="opacity-50">{typeCounts[t]}</span>
            </button>
          ))}
        </div>
      )}

      {/* Upload */}
      {canWrite && (
        <div className="space-y-2">
          <UrlImport onSavedToKb={() => {}} />
          <UploadZone ref={uploadZoneRef} userId={userId} teamId={teamId} onUploadComplete={() => {}} />
        </div>
      )}

      {/* File list */}
      <div className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-white)]">
        {visibleFiles.length === 0 ? <FileListEmpty /> : visibleFiles.map((file) => (
          <DenseRow
            key={file.id}
            file={file}
            canDelete={isTeam ? file.userId === userId : true}
            onTagsChange={canWrite ? (tags) => handleTagsChange(file.id, tags) : undefined}
            onDelete={() => handleDelete(file.id)}
            onTagFilter={toggleTag}
            activeTagFilters={selectedTags}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Variant C — Searchable sidebar ──────────────────────────────────────────
// Wider sidebar. Tags as a searchable scrollable list with counts.
// Types stay in sidebar too. File list takes remaining width.

function VariantC({ state, handlers, uploadZoneRef, canWrite, isTeam, userId, teamId }: SharedProps) {
  const { files, visibleFiles, search, sortBy, typeFilter, selectedTags, allTags } = state;
  const { setSearch, setSortBy, setTypeFilter, toggleTag, clearFilters, handleTagsChange, handleDelete } = handlers;
  const [tagSearch, setTagSearch] = useState("");

  const typeCounts = TYPE_GROUPS.reduce<Record<string, number>>((acc, t) => {
    acc[t] = files.filter((f) => getTypeGroup(f.contentType) === t).length;
    return acc;
  }, {});
  const activeTypes = TYPE_GROUPS.filter((t) => typeCounts[t] > 0);

  const filteredTags = allTags
    .filter((t) => !tagSearch || t.toLowerCase().includes(tagSearch.toLowerCase()))
    .map((t) => ({ tag: t, count: files.filter((f) => f.tags.includes(t)).length }))
    .sort((a, b) => b.count - a.count);

  const hasFilters = selectedTags.length > 0 || typeFilter !== "all";

  return (
    <div className="flex gap-5">
      {/* Sidebar */}
      <aside className="w-56 shrink-0">
        <div className="sticky top-6 space-y-5">
          {/* All */}
          <button
            onClick={() => { clearFilters(); }}
            className={sideBtn(typeFilter === "all" && selectedTags.length === 0)}
          >
            <span>All files</span>
            <span className="text-xs text-[var(--color-ink-faint)]">{files.length}</span>
          </button>

          {/* Types */}
          {activeTypes.length > 0 && (
            <div className="space-y-1">
              <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-[var(--color-ink-faint)]">Type</p>
              {activeTypes.map((t) => (
                <button key={t} onClick={() => setTypeFilter(typeFilter === t ? "all" : t)} className={sideBtn(typeFilter === t)}>
                  <span className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${TYPE_DOT[t as TypeGroup]}`} />
                    <span>{t}</span>
                  </span>
                  <span className="text-xs text-[var(--color-ink-faint)]">{typeCounts[t]}</span>
                </button>
              ))}
            </div>
          )}

          {/* Tags */}
          {allTags.length > 0 && (
            <div className="space-y-2">
              <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-[var(--color-ink-faint)]">Tags</p>
              <div className="relative">
                <svg className="absolute left-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-[var(--color-ink-faint)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                <input
                  value={tagSearch}
                  onChange={(e) => setTagSearch(e.target.value)}
                  placeholder="Filter tags…"
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-white)] py-1.5 pl-7 pr-3 text-xs text-[var(--color-ink)] placeholder:text-[var(--color-ink-faint)] focus:border-[var(--color-accent)] focus:outline-none"
                />
              </div>
              <div className="max-h-72 overflow-y-auto space-y-0.5 pr-1">
                {filteredTags.map(({ tag, count }) => {
                  const active = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={[
                        "flex w-full items-center justify-between rounded-lg px-3 py-1.5 text-xs transition-colors",
                        active
                          ? "bg-[var(--color-accent-bg)] font-semibold text-[var(--color-accent)]"
                          : "text-[var(--color-ink-soft)] hover:bg-[var(--color-bg-card)]",
                      ].join(" ")}
                    >
                      <span className="truncate">{tag}</span>
                      <span className="ml-2 shrink-0 text-[10px] text-[var(--color-ink-faint)]">{count}</span>
                    </button>
                  );
                })}
                {filteredTags.length === 0 && (
                  <p className="px-3 py-2 text-xs text-[var(--color-ink-faint)]">No matching tags</p>
                )}
              </div>
              {hasFilters && (
                <button onClick={clearFilters} className="w-full text-left px-3 text-xs text-[var(--color-accent)] hover:underline">
                  Clear all filters
                </button>
              )}
            </div>
          )}
        </div>
      </aside>

      {/* Main content */}
      <div className="min-w-0 flex-1 space-y-3">
        <div className="flex gap-3">
          <SearchBar value={search} onChange={setSearch} />
          <SortSelect value={sortBy} onChange={setSortBy} />
          {canWrite && <UploadBtn uploadZoneRef={uploadZoneRef} />}
        </div>

        {canWrite && (
          <div className="space-y-2">
            <UrlImport onSavedToKb={() => {}} />
            <UploadZone ref={uploadZoneRef} userId={userId} teamId={teamId} onUploadComplete={() => {}} />
          </div>
        )}

        {hasFilters && (
          <p className="text-xs text-[var(--color-ink-muted)]">
            Showing {visibleFiles.length} of {files.length} files
          </p>
        )}

        <div className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-white)]">
          {visibleFiles.length === 0 ? <FileListEmpty /> : visibleFiles.map((file) => (
            <DenseRow
              key={file.id}
              file={file}
              canDelete={isTeam ? file.userId === userId : true}
              onTagsChange={canWrite ? (tags) => handleTagsChange(file.id, tags) : undefined}
              onDelete={() => handleDelete(file.id)}
              onTagFilter={toggleTag}
              activeTagFilters={selectedTags}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Shared style helpers ─────────────────────────────────────────────────────

function pill(active: boolean) {
  return [
    "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
    active
      ? "border-[var(--color-accent)] bg-[var(--color-accent-bg)] text-[var(--color-accent)]"
      : "border-[var(--color-border)] bg-[var(--color-bg-white)] text-[var(--color-ink-soft)] hover:border-[var(--color-border-strong)]",
  ].join(" ");
}

function sideBtn(active: boolean) {
  return [
    "flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm transition-colors",
    active
      ? "bg-[var(--color-accent-bg)] font-semibold text-[var(--color-accent)]"
      : "text-[var(--color-ink-soft)] hover:bg-[var(--color-bg-card)]",
  ].join(" ");
}

function UploadBtn({ uploadZoneRef }: { uploadZoneRef: React.RefObject<UploadZoneHandle | null> }) {
  return (
    <button
      onClick={() => uploadZoneRef.current?.open()}
      className="flex shrink-0 items-center gap-2 rounded-xl bg-[var(--color-accent)] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[var(--color-accent-hover)]"
    >
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
      Upload
    </button>
  );
}

// ─── Shared state type ────────────────────────────────────────────────────────

interface SharedState {
  files: FileMetadata[];
  visibleFiles: FileMetadata[];
  search: string;
  sortBy: SortKey;
  typeFilter: string;
  selectedTags: string[];
  allTags: string[];
}

interface SharedHandlers {
  setSearch: (v: string) => void;
  setSortBy: (v: SortKey) => void;
  setTypeFilter: (v: string) => void;
  toggleTag: (t: string) => void;
  clearFilters: () => void;
  handleTagsChange: (id: string, tags: string[]) => void;
  handleDelete: (id: string) => void;
}

interface SharedProps {
  state: SharedState;
  handlers: SharedHandlers;
  uploadZoneRef: React.RefObject<UploadZoneHandle | null>;
  canWrite: boolean;
  isTeam: boolean;
  userId: string;
  teamId: string | null;
}

// ─── Prototype switcher ───────────────────────────────────────────────────────

const VARIANTS = ["A", "B", "C"] as const;
const V_LABELS: Record<string, string> = {
  A: "A — Pill strip",
  B: "B — Tag cloud",
  C: "C — Searchable sidebar",
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
      <button onClick={() => go(prev)} className="text-lg leading-none text-gray-400 hover:text-white transition-colors">←</button>
      <span className="text-sm font-medium">{V_LABELS[variant] ?? variant}</span>
      <button onClick={() => go(next)} className="text-lg leading-none text-gray-400 hover:text-white transition-colors">→</button>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function KnowledgeBaseProto({
  files: initialFiles,
  currentUser,
  userId,
  teamId,
  teamName,
  userRole,
  teams,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const variant = searchParams.get("variant") ?? "A";
  const uploadZoneRef = useRef<UploadZoneHandle>(null);

  const [files, setFiles] = useState<FileMetadata[]>(initialFiles);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortKey>("newest");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => { setFiles(initialFiles); }, [initialFiles]);

  const isTeam = !!teamId;
  const canWrite = !isTeam || userRole === "owner" || userRole === "editor";

  const allTags = [...new Set(files.flatMap((f) => f.tags))].sort();

  const visibleFiles = sortFiles(files, sortBy).filter((f) => {
    const q = search.trim().toLowerCase();
    if (q && !f.filename.toLowerCase().includes(q) && !f.tags.some((t) => t.toLowerCase().includes(q))) return false;
    if (selectedTags.length > 0 && !selectedTags.every((t) => f.tags.includes(t))) return false;
    if (!matchesType(f.contentType, typeFilter)) return false;
    return true;
  });

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
    try { await fetch(`/api/knowledge-base/files/${id}`, { method: "DELETE" }); }
    catch { router.refresh(); }
  }, [router]);

  function toggleTag(t: string) {
    setSelectedTags((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]);
  }

  function clearFilters() {
    setSelectedTags([]);
    setTypeFilter("all");
    setSearch("");
  }

  const sharedState: SharedState = { files, visibleFiles, search, sortBy, typeFilter, selectedTags, allTags };
  const sharedHandlers: SharedHandlers = { setSearch, setSortBy, setTypeFilter, toggleTag, clearFilters, handleTagsChange, handleDelete };
  const sharedProps: SharedProps = { state: sharedState, handlers: sharedHandlers, uploadZoneRef, canWrite, isTeam, userId, teamId };

  return (
    <>
      {/* Page header */}
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

      {variant === "A" && <VariantA {...sharedProps} />}
      {variant === "B" && <VariantB {...sharedProps} />}
      {variant === "C" && <VariantC {...sharedProps} />}

      <PrototypeSwitcher variant={variant} />
    </>
  );
}

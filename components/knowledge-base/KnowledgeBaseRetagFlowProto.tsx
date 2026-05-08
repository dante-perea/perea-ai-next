// PROTOTYPE — Re-tag collection flow
// Flow: select tags in sidebar → files collected → pick which tags to keep →
//       AI re-tags each file → review diffs
// Variants:
//   A = Inline steps   — right panel walks through configure → run → review
//   B = Slide drawer   — config drawer slides in, file list stays visible
//   C = Split column   — lock panel always alongside file list, no extra clicks

"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
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

type FlowStep = "files" | "configure" | "running" | "review";
type FileStatus = "pending" | "running" | "done" | "error";

// ─── Shared logic ─────────────────────────────────────────────────────────────

function useTagOps(
  files: FileMetadata[],
  setFiles: React.Dispatch<React.SetStateAction<FileMetadata[]>>,
) {
  const router = useRouter();
  const updateFileTags = useCallback(async (id: string, tags: string[]) => {
    setFiles((p) => p.map((f) => (f.id === id ? { ...f, tags } : f)));
    try {
      const res = await fetch(`/api/knowledge-base/files/${id}/tags`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tags }),
      });
      if (!res.ok) throw new Error();
      const updated: FileMetadata = await res.json();
      setFiles((p) => p.map((f) => (f.id === id ? updated : f)));
    } catch { router.refresh(); }
  }, [setFiles, router]);
  return { updateFileTags };
}

// Calls retag API (gets AI tags) then merges with locked tags and saves
async function retagWithLocks(
  fileId: string,
  lockedTags: string[],
  updateFileTags: (id: string, tags: string[]) => Promise<void>,
): Promise<{ aiTags: string[]; merged: string[] } | null> {
  try {
    const res = await fetch(`/api/knowledge-base/files/${fileId}/retag`, { method: "POST" });
    if (!res.ok) return null;
    const updated: FileMetadata = await res.json();
    const aiTags = updated.tags;
    const merged = [...lockedTags, ...aiTags.filter((t) => !lockedTags.includes(t))];
    await updateFileTags(fileId, merged);
    return { aiTags, merged };
  } catch { return null; }
}

// ─── Shared small components ──────────────────────────────────────────────────

function TagLockGrid({
  allTags,
  lockedTags,
  sidebarTags,
  onToggle,
}: {
  allTags: string[];
  lockedTags: Set<string>;
  sidebarTags: string[];
  onToggle: (tag: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {allTags.map((tag) => {
        const locked   = lockedTags.has(tag);
        const isSidebar = sidebarTags.includes(tag);
        return (
          <button
            key={tag}
            onClick={() => onToggle(tag)}
            className={[
              "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all",
              locked
                ? "border-[var(--color-accent)] bg-[var(--color-accent-bg)] text-[var(--color-accent)]"
                : "border-[var(--color-border)] bg-[var(--color-bg-card)] text-[var(--color-ink-faint)] line-through",
            ].join(" ")}
            title={locked ? "Will be kept" : "Will be replaced by AI"}
          >
            {locked ? (
              <svg className="h-3 w-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            ) : (
              <svg className="h-3 w-3 shrink-0 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            )}
            {tag}
            {isSidebar && locked && <span className="opacity-50 text-[10px]">selected</span>}
          </button>
        );
      })}
    </div>
  );
}

function TagDiff({ before, after }: { before: string[]; after: string[] }) {
  const removed = before.filter((t) => !after.includes(t));
  const added   = after.filter((t) => !before.includes(t));
  const kept    = before.filter((t) => after.includes(t));
  return (
    <div className="flex flex-wrap gap-1">
      {kept.map((t) => (
        <span key={t} className="rounded-full bg-[var(--color-bg-card)] px-2 py-0.5 text-xs text-[var(--color-ink-faint)]">{t}</span>
      ))}
      {removed.map((t) => (
        <span key={t} className="rounded-full bg-red-50 px-2 py-0.5 text-xs text-red-400 line-through">{t}</span>
      ))}
      {added.map((t) => (
        <span key={t} className="flex items-center gap-0.5 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">+{t}</span>
      ))}
    </div>
  );
}

function FileStatusRow({ file, status, before, after }: {
  file: FileMetadata;
  status: FileStatus;
  before: string[];
  after?: string[];
}) {
  return (
    <div className={[
      "border-b border-[var(--color-border)] px-4 py-3",
      status === "done" ? "bg-emerald-50/30" : status === "error" ? "bg-red-50/30" : "",
    ].join(" ")}>
      <div className="flex items-center gap-2 mb-1">
        {status === "pending" && <span className="h-2 w-2 rounded-full bg-[var(--color-border-strong)] shrink-0" />}
        {status === "running" && <svg className="h-3.5 w-3.5 animate-spin shrink-0 text-[var(--color-accent)]" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx={12} cy={12} r={10} stroke="currentColor" strokeWidth={4} /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>}
        {status === "done"    && <span className="h-2 w-2 rounded-full bg-emerald-400 shrink-0" />}
        {status === "error"   && <span className="h-2 w-2 rounded-full bg-red-400 shrink-0" />}
        <p className="truncate text-xs text-[var(--color-ink-faint)]">{file.filename}</p>
      </div>
      {status === "done" && after && <TagDiff before={before} after={after} />}
      {status === "error" && <p className="text-xs text-red-500">Re-tag failed</p>}
    </div>
  );
}

// ─── Shared sidebar (multi-select) ────────────────────────────────────────────

function TagSidebar({
  files,
  selectedTags,
  onToggle,
  search,
  onSearch,
}: {
  files: FileMetadata[];
  selectedTags: Set<string>;
  onToggle: (tag: string, e: React.MouseEvent) => void;
  search: string;
  onSearch: (v: string) => void;
}) {
  const allTags   = [...new Set(files.flatMap((f) => f.tags))].sort();
  const tagCounts = Object.fromEntries(allTags.map((t) => [t, files.filter((f) => f.tags.includes(t)).length]));
  const filtered  = allTags.filter((t) => !search || t.toLowerCase().includes(search.toLowerCase()));

  function health(count: number): string {
    if (count === 1) return "bg-amber-400";
    if (count > Math.max(30, files.length * 0.08)) return "bg-orange-400";
    return "bg-emerald-400";
  }

  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-[var(--color-border)]">
      <div className="border-b border-[var(--color-border)] p-3">
        <div className="relative">
          <svg className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--color-ink-faint)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input value={search} onChange={(e) => onSearch(e.target.value)} placeholder="Find tag…" className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-card)] py-1.5 pl-7 pr-2 text-xs outline-none focus:border-[var(--color-accent)]" />
        </div>
        <p className="mt-1.5 text-[10px] text-[var(--color-ink-faint)]">⇧/⌘+click to multi-select</p>
      </div>
      <div className="flex-1 overflow-y-auto">
        {filtered.map((tag) => {
          const count = tagCounts[tag];
          const isSelected = selectedTags.has(tag);
          return (
            <div
              key={tag}
              className={["group flex cursor-pointer select-none items-center gap-2 border-b border-[var(--color-border)] px-4 py-2.5 transition-colors", isSelected ? "bg-[var(--color-accent-bg)]" : "hover:bg-[var(--color-bg-card)]"].join(" ")}
              onClick={(e) => onToggle(tag, e)}
            >
              <span className={["flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors", isSelected ? "border-[var(--color-accent)] bg-[var(--color-accent)]" : "border-[var(--color-border)] bg-white"].join(" ")}>
                {isSelected && <svg className="h-2.5 w-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
              </span>
              <span className={`h-2 w-2 shrink-0 rounded-full ${health(count)}`} />
              <span className={["flex-1 truncate text-sm", isSelected ? "font-semibold text-[var(--color-accent)]" : "text-[var(--color-ink-soft)]"].join(" ")}>{tag}</span>
              <span className="shrink-0 font-mono text-xs text-[var(--color-ink-faint)]">{count}</span>
            </div>
          );
        })}
      </div>
    </aside>
  );
}

// ─── Variant A — Inline step panel ───────────────────────────────────────────
// Right panel walks through: file list → configure (lock tags) → running → review

function VariantA({ files, selectedTags, canWrite, ops }: VariantProps) {
  const [step,          setStep]          = useState<FlowStep>("files");
  const [lockedTags,    setLockedTags]    = useState<Set<string>>(new Set());
  const [fileStatuses,  setFileStatuses]  = useState<Record<string, FileStatus>>({});
  const [fileResults,   setFileResults]   = useState<Record<string, { before: string[]; after: string[] }>>({});

  const tagList      = [...selectedTags];
  const collectedFiles = files.filter((f) => tagList.some((t) => f.tags.includes(t)));
  const allTagsInCollection = [...new Set(collectedFiles.flatMap((f) => f.tags))].sort();

  // When selection changes, reset flow and pre-lock selected tags
  useEffect(() => {
    setStep("files");
    setLockedTags(new Set(tagList));
    setFileStatuses({});
    setFileResults({});
  }, [selectedTags]);

  function toggleLock(tag: string) {
    setLockedTags((p) => { const n = new Set(p); n.has(tag) ? n.delete(tag) : n.add(tag); return n; });
  }

  async function run() {
    setStep("running");
    const initStatuses = Object.fromEntries(collectedFiles.map((f) => [f.id, "pending" as FileStatus]));
    setFileStatuses(initStatuses);

    for (const file of collectedFiles) {
      setFileStatuses((p) => ({ ...p, [file.id]: "running" }));
      const result = await retagWithLocks(file.id, [...lockedTags], ops.updateFileTags);
      if (result) {
        setFileResults((p) => ({ ...p, [file.id]: { before: file.tags, after: result.merged } }));
        setFileStatuses((p) => ({ ...p, [file.id]: "done" }));
      } else {
        setFileStatuses((p) => ({ ...p, [file.id]: "error" }));
      }
    }
    setStep("review");
  }

  const doneCount = Object.values(fileStatuses).filter((s) => s === "done").length;

  if (!tagList.length) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center">
        <p className="text-sm font-medium text-[var(--color-ink-soft)]">Select tags from the sidebar to collect files</p>
        <p className="text-xs text-[var(--color-ink-faint)]">⇧/⌘+click to select multiple</p>
      </div>
    );
  }

  return (
    <div className="flex min-w-0 flex-1 flex-col">
      {/* Step header */}
      <div className="flex items-center gap-3 border-b border-[var(--color-border)] px-5 py-3">
        <div className="flex items-center gap-2">
          {(["files", "configure", "running", "review"] as FlowStep[]).map((s, i) => (
            <div key={s} className="flex items-center gap-1.5">
              {i > 0 && <span className="text-[var(--color-border-strong)]">›</span>}
              <span className={["text-xs font-medium", step === s ? "text-[var(--color-accent)]" : (["files", "configure", "running", "review"].indexOf(step) > i ? "text-[var(--color-ink-faint)]" : "text-[var(--color-border-strong)]")].join(" ")}>
                {s === "files" ? "Collection" : s === "configure" ? "Lock tags" : s === "running" ? "Re-tagging" : "Review"}
              </span>
            </div>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2">
          {step === "files" && (
            <button onClick={() => setStep("configure")} className="flex items-center gap-1.5 rounded-xl bg-[var(--color-accent)] px-4 py-1.5 text-xs font-medium text-white transition-colors hover:bg-[var(--color-accent-hover)]">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              Re-tag {collectedFiles.length} files
            </button>
          )}
          {step === "configure" && (
            <>
              <button onClick={() => setStep("files")} className="text-xs text-[var(--color-ink-faint)] underline">← Back</button>
              <button onClick={run} disabled={!canWrite} className="flex items-center gap-1.5 rounded-xl bg-[var(--color-accent)] px-4 py-1.5 text-xs font-medium text-white transition-colors hover:bg-[var(--color-accent-hover)] disabled:opacity-40">
                Run — keep {lockedTags.size} tags
              </button>
            </>
          )}
          {step === "review" && (
            <button onClick={() => setStep("files")} className="text-xs text-[var(--color-ink-faint)] underline">← Done</button>
          )}
        </div>
      </div>

      {/* Step content */}
      {step === "files" && (
        <div className="flex-1 overflow-y-auto">
          <div className="border-b border-[var(--color-border)] bg-[var(--color-bg-card)] px-5 py-2.5">
            <div className="flex flex-wrap gap-1">
              {tagList.map((t) => (
                <span key={t} className="rounded-full bg-[var(--color-accent-bg)] px-2.5 py-0.5 text-xs font-semibold text-[var(--color-accent)]">{t}</span>
              ))}
              <span className="text-xs text-[var(--color-ink-faint)] self-center ml-1">→ {collectedFiles.length} files</span>
            </div>
          </div>
          {collectedFiles.map((file) => (
            <div key={file.id} className="flex items-start gap-3 border-b border-[var(--color-border)] px-5 py-3">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap gap-1">
                  {file.tags.map((t) => (
                    <span key={t} className={["rounded-full px-2 py-0.5 text-xs", tagList.includes(t) ? "bg-[var(--color-accent-bg)] font-medium text-[var(--color-accent)]" : "bg-[var(--color-bg-card)] text-[var(--color-ink-faint)]"].join(" ")}>{t}</span>
                  ))}
                </div>
                <p className="mt-0.5 truncate text-xs text-[var(--color-ink-faint)]">{file.filename}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {step === "configure" && (
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
          <div>
            <p className="mb-1 text-sm font-semibold text-[var(--color-ink)]">Which tags should we keep?</p>
            <p className="mb-4 text-xs text-[var(--color-ink-faint)]">
              Locked tags are always preserved. Everything else will be replaced by AI analysis of each document.
            </p>
            <TagLockGrid
              allTags={allTagsInCollection}
              lockedTags={lockedTags}
              sidebarTags={tagList}
              onToggle={toggleLock}
            />
          </div>
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] px-4 py-3 text-xs text-[var(--color-ink-soft)]">
            <strong className="text-[var(--color-ink)]">Keeping {lockedTags.size} tags</strong>
            {" "}across {collectedFiles.length} files · AI will generate new tags for each document and merge with locked ones
          </div>
        </div>
      )}

      {(step === "running" || step === "review") && (
        <div className="flex-1 overflow-y-auto">
          {step === "running" && (
            <div className="border-b border-[var(--color-border)] px-5 py-3">
              <div className="flex items-center gap-3">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--color-border)]">
                  <div className="h-full rounded-full bg-[var(--color-accent)] transition-all duration-500" style={{ width: `${collectedFiles.length > 0 ? (doneCount / collectedFiles.length) * 100 : 0}%` }} />
                </div>
                <span className="shrink-0 text-xs text-[var(--color-ink-faint)]">{doneCount} / {collectedFiles.length}</span>
              </div>
            </div>
          )}
          {step === "review" && (
            <div className="border-b border-[var(--color-border)] bg-emerald-50 px-5 py-2.5">
              <p className="text-xs font-medium text-emerald-700">{doneCount} of {collectedFiles.length} files re-tagged</p>
            </div>
          )}
          {collectedFiles.map((file) => (
            <FileStatusRow
              key={file.id}
              file={file}
              status={fileStatuses[file.id] ?? "pending"}
              before={fileResults[file.id]?.before ?? file.tags}
              after={fileResults[file.id]?.after}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Variant B — Slide-over drawer ───────────────────────────────────────────
// File list stays visible. "Re-tag collection" opens a drawer from the right.
// Drawer walks through: configure → running → review.

function VariantB({ files, selectedTags, canWrite, ops }: VariantProps) {
  const [drawerOpen,   setDrawerOpen]   = useState(false);
  const [step,         setStep]         = useState<"configure" | "running" | "review">("configure");
  const [lockedTags,   setLockedTags]   = useState<Set<string>>(new Set());
  const [fileStatuses, setFileStatuses] = useState<Record<string, FileStatus>>({});
  const [fileResults,  setFileResults]  = useState<Record<string, { before: string[]; after: string[] }>>({});

  const tagList        = [...selectedTags];
  const collectedFiles = files.filter((f) => tagList.some((t) => f.tags.includes(t)));
  const allTagsInCollection = [...new Set(collectedFiles.flatMap((f) => f.tags))].sort();

  function openDrawer() {
    setLockedTags(new Set(tagList));
    setStep("configure");
    setFileStatuses({});
    setFileResults({});
    setDrawerOpen(true);
  }

  function toggleLock(tag: string) {
    setLockedTags((p) => { const n = new Set(p); n.has(tag) ? n.delete(tag) : n.add(tag); return n; });
  }

  async function run() {
    setStep("running");
    setFileStatuses(Object.fromEntries(collectedFiles.map((f) => [f.id, "pending" as FileStatus])));
    for (const file of collectedFiles) {
      setFileStatuses((p) => ({ ...p, [file.id]: "running" }));
      const result = await retagWithLocks(file.id, [...lockedTags], ops.updateFileTags);
      if (result) {
        setFileResults((p) => ({ ...p, [file.id]: { before: file.tags, after: result.merged } }));
        setFileStatuses((p) => ({ ...p, [file.id]: "done" }));
      } else {
        setFileStatuses((p) => ({ ...p, [file.id]: "error" }));
      }
    }
    setStep("review");
  }

  const doneCount = Object.values(fileStatuses).filter((s) => s === "done").length;

  return (
    <div className="relative flex min-w-0 flex-1 overflow-hidden">
      {/* File list */}
      <div className={["flex flex-col overflow-hidden transition-all duration-300", drawerOpen ? "w-1/2" : "w-full"].join(" ")}>
        {tagList.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center">
            <p className="text-sm font-medium text-[var(--color-ink-soft)]">Select tags to collect files</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between border-b border-[var(--color-border)] px-5 py-3">
              <div className="flex flex-wrap items-center gap-1">
                {tagList.map((t) => <span key={t} className="rounded-full bg-[var(--color-accent-bg)] px-2.5 py-0.5 text-xs font-semibold text-[var(--color-accent)]">{t}</span>)}
                <span className="text-xs text-[var(--color-ink-faint)]">· {collectedFiles.length} files</span>
              </div>
              {!drawerOpen && (
                <button onClick={openDrawer} className="ml-2 flex shrink-0 items-center gap-1.5 rounded-xl bg-[var(--color-accent)] px-4 py-1.5 text-xs font-medium text-white transition-colors hover:bg-[var(--color-accent-hover)]">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                  Re-tag {collectedFiles.length} files
                </button>
              )}
            </div>
            <div className="flex-1 overflow-y-auto">
              {collectedFiles.map((file) => (
                <div key={file.id} className={["flex items-start gap-3 border-b border-[var(--color-border)] px-5 py-3 transition-colors", fileStatuses[file.id] === "done" ? "bg-emerald-50/30" : ""].join(" ")}>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap gap-1">
                      {(fileResults[file.id]?.after ?? file.tags).map((t) => (
                        <span key={t} className={["rounded-full px-2 py-0.5 text-xs", tagList.includes(t) ? "bg-[var(--color-accent-bg)] font-medium text-[var(--color-accent)]" : "bg-[var(--color-bg-card)] text-[var(--color-ink-faint)]"].join(" ")}>{t}</span>
                      ))}
                    </div>
                    <p className="mt-0.5 truncate text-xs text-[var(--color-ink-faint)]">{file.filename}</p>
                  </div>
                  {fileStatuses[file.id] === "running" && <svg className="mt-1 h-3.5 w-3.5 animate-spin shrink-0 text-[var(--color-accent)]" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx={12} cy={12} r={10} stroke="currentColor" strokeWidth={4} /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>}
                  {fileStatuses[file.id] === "done"    && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-emerald-400" />}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Slide drawer */}
      {drawerOpen && (
        <div className="flex w-1/2 shrink-0 flex-col border-l-2 border-[var(--color-accent)] bg-[var(--color-bg-white)]">
          <div className="flex items-center justify-between border-b border-[var(--color-border)] px-4 py-3">
            <span className="text-sm font-semibold text-[var(--color-ink)]">
              {step === "configure" ? "Lock tags to keep" : step === "running" ? "Re-tagging…" : "Done"}
            </span>
            <button onClick={() => setDrawerOpen(false)} className="text-xs text-[var(--color-ink-faint)] hover:text-[var(--color-ink)]">✕</button>
          </div>

          {step === "configure" && (
            <div className="flex flex-1 flex-col overflow-y-auto px-4 py-4 space-y-4">
              <p className="text-xs text-[var(--color-ink-faint)]">
                Locked tags are always preserved. Everything else replaced by AI.
              </p>
              <TagLockGrid allTags={allTagsInCollection} lockedTags={lockedTags} sidebarTags={tagList} onToggle={toggleLock} />
              <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] px-3 py-2 text-xs text-[var(--color-ink-soft)]">
                Keeping <strong className="text-[var(--color-ink)]">{lockedTags.size}</strong> tags · AI regenerates the rest for {collectedFiles.length} files
              </div>
              <button onClick={run} disabled={!canWrite} className="w-full rounded-xl bg-[var(--color-accent)] py-2.5 text-sm font-medium text-white transition-colors hover:bg-[var(--color-accent-hover)] disabled:opacity-40">
                Run re-tag
              </button>
            </div>
          )}

          {step === "running" && (
            <div className="flex-1 overflow-y-auto">
              <div className="border-b border-[var(--color-border)] px-4 py-2.5">
                <div className="flex items-center gap-2">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--color-border)]">
                    <div className="h-full rounded-full bg-[var(--color-accent)] transition-all duration-500" style={{ width: `${collectedFiles.length > 0 ? (doneCount / collectedFiles.length) * 100 : 0}%` }} />
                  </div>
                  <span className="shrink-0 text-xs text-[var(--color-ink-faint)]">{doneCount}/{collectedFiles.length}</span>
                </div>
              </div>
              {collectedFiles.map((f) => (
                <FileStatusRow key={f.id} file={f} status={fileStatuses[f.id] ?? "pending"} before={fileResults[f.id]?.before ?? f.tags} after={fileResults[f.id]?.after} />
              ))}
            </div>
          )}

          {step === "review" && (
            <div className="flex-1 overflow-y-auto">
              <div className="border-b border-[var(--color-border)] bg-emerald-50 px-4 py-2.5">
                <p className="text-xs font-medium text-emerald-700">{doneCount}/{collectedFiles.length} files updated</p>
              </div>
              {collectedFiles.map((f) => (
                <FileStatusRow key={f.id} file={f} status={fileStatuses[f.id] ?? "pending"} before={fileResults[f.id]?.before ?? f.tags} after={fileResults[f.id]?.after} />
              ))}
              <div className="border-t border-[var(--color-border)] p-4">
                <button onClick={() => setDrawerOpen(false)} className="w-full rounded-xl border border-[var(--color-border)] py-2 text-sm text-[var(--color-ink-soft)] transition-colors hover:bg-[var(--color-bg-card)]">
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Variant C — Split column (always-on config panel) ────────────────────────
// When tags are selected, the right side splits: files (left) + config (right).
// No extra click to open — the lock panel is immediately visible.

function VariantC({ files, selectedTags, canWrite, ops }: VariantProps) {
  const [lockedTags,   setLockedTags]   = useState<Set<string>>(new Set());
  const [step,         setStep]         = useState<"configure" | "running" | "review">("configure");
  const [fileStatuses, setFileStatuses] = useState<Record<string, FileStatus>>({});
  const [fileResults,  setFileResults]  = useState<Record<string, { before: string[]; after: string[] }>>({});

  const tagList        = [...selectedTags];
  const collectedFiles = files.filter((f) => tagList.some((t) => f.tags.includes(t)));
  const allTagsInCollection = [...new Set(collectedFiles.flatMap((f) => f.tags))].sort();

  useEffect(() => {
    setLockedTags(new Set(tagList));
    setStep("configure");
    setFileStatuses({});
    setFileResults({});
  }, [selectedTags]);

  function toggleLock(tag: string) {
    setLockedTags((p) => { const n = new Set(p); n.has(tag) ? n.delete(tag) : n.add(tag); return n; });
  }

  async function run() {
    setStep("running");
    setFileStatuses(Object.fromEntries(collectedFiles.map((f) => [f.id, "pending" as FileStatus])));
    for (const file of collectedFiles) {
      setFileStatuses((p) => ({ ...p, [file.id]: "running" }));
      const result = await retagWithLocks(file.id, [...lockedTags], ops.updateFileTags);
      if (result) {
        setFileResults((p) => ({ ...p, [file.id]: { before: file.tags, after: result.merged } }));
        setFileStatuses((p) => ({ ...p, [file.id]: "done" }));
      } else {
        setFileStatuses((p) => ({ ...p, [file.id]: "error" }));
      }
    }
    setStep("review");
  }

  const doneCount = Object.values(fileStatuses).filter((s) => s === "done").length;

  if (!tagList.length) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center">
        <p className="text-sm font-medium text-[var(--color-ink-soft)]">Select tags to collect files for re-tagging</p>
        <p className="text-xs text-[var(--color-ink-faint)]">⇧/⌘+click for multiple</p>
      </div>
    );
  }

  return (
    <div className="flex min-w-0 flex-1 overflow-hidden">
      {/* File list column */}
      <div className="flex w-3/5 flex-col overflow-hidden border-r border-[var(--color-border)]">
        <div className="flex flex-wrap items-center gap-1 border-b border-[var(--color-border)] px-4 py-3">
          {tagList.map((t) => <span key={t} className="rounded-full bg-[var(--color-accent-bg)] px-2.5 py-0.5 text-xs font-semibold text-[var(--color-accent)]">{t}</span>)}
          <span className="text-xs text-[var(--color-ink-faint)]">· {collectedFiles.length} files</span>
        </div>
        <div className="flex-1 overflow-y-auto">
          {collectedFiles.map((file) => (
            <div key={file.id} className={["flex items-start gap-3 border-b border-[var(--color-border)] px-4 py-3 transition-colors", fileStatuses[file.id] === "done" ? "bg-emerald-50/30" : ""].join(" ")}>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap gap-1 mb-0.5">
                  {(fileResults[file.id]?.after ?? file.tags).map((t) => (
                    <span key={t} className={["rounded-full px-2 py-0.5 text-xs", lockedTags.has(t) ? "bg-[var(--color-accent-bg)] font-medium text-[var(--color-accent)]" : "bg-[var(--color-bg-card)] text-[var(--color-ink-faint)]"].join(" ")}>{t}</span>
                  ))}
                </div>
                {fileResults[file.id] && (
                  <TagDiff before={fileResults[file.id].before} after={fileResults[file.id].after} />
                )}
                <p className="mt-0.5 truncate text-xs text-[var(--color-ink-faint)]">{file.filename}</p>
              </div>
              <div className="shrink-0">
                {fileStatuses[file.id] === "running" && <svg className="h-3.5 w-3.5 animate-spin text-[var(--color-accent)]" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx={12} cy={12} r={10} stroke="currentColor" strokeWidth={4} /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>}
                {fileStatuses[file.id] === "done"    && <span className="h-2 w-2 rounded-full bg-emerald-400 block" />}
                {fileStatuses[file.id] === "error"   && <span className="h-2 w-2 rounded-full bg-red-400 block" />}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Config / run / results column */}
      <div className="flex w-2/5 shrink-0 flex-col bg-[var(--color-bg-card)]">
        <div className="border-b border-[var(--color-border)] px-4 py-3">
          <p className="text-sm font-semibold text-[var(--color-ink)]">
            {step === "configure" ? "Lock tags to keep" : step === "running" ? "Re-tagging…" : `Done · ${doneCount}/${collectedFiles.length} updated`}
          </p>
        </div>

        {step === "configure" && (
          <div className="flex flex-1 flex-col overflow-y-auto p-4 space-y-4">
            <p className="text-xs text-[var(--color-ink-faint)]">
              <strong className="text-[var(--color-ink)]">Locked</strong> = always preserved.<br />
              <strong className="text-[var(--color-ink)]">Unlocked</strong> = replaced by AI.
            </p>
            <TagLockGrid allTags={allTagsInCollection} lockedTags={lockedTags} sidebarTags={tagList} onToggle={toggleLock} />
            <div className="mt-auto pt-2">
              <button
                onClick={run}
                disabled={!canWrite}
                className="w-full rounded-xl bg-[var(--color-accent)] py-3 text-sm font-medium text-white transition-colors hover:bg-[var(--color-accent-hover)] disabled:opacity-40"
              >
                Re-tag {collectedFiles.length} files · keep {lockedTags.size} tags
              </button>
            </div>
          </div>
        )}

        {step === "running" && (
          <div className="flex flex-1 flex-col p-4 gap-3">
            <div className="h-2 overflow-hidden rounded-full bg-[var(--color-border)]">
              <div className="h-full rounded-full bg-[var(--color-accent)] transition-all duration-500" style={{ width: `${collectedFiles.length > 0 ? (doneCount / collectedFiles.length) * 100 : 0}%` }} />
            </div>
            <p className="text-xs text-[var(--color-ink-faint)]">{doneCount} of {collectedFiles.length} files analyzed</p>
            <div className="flex-1 overflow-y-auto space-y-1">
              {collectedFiles.map((f) => {
                const s = fileStatuses[f.id] ?? "pending";
                return (
                  <div key={f.id} className="flex items-center gap-2 rounded-lg px-2 py-1.5">
                    {s === "pending" && <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-border-strong)]" />}
                    {s === "running" && <svg className="h-3 w-3 animate-spin text-[var(--color-accent)]" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx={12} cy={12} r={10} stroke="currentColor" strokeWidth={4} /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>}
                    {s === "done"    && <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />}
                    {s === "error"   && <span className="h-1.5 w-1.5 rounded-full bg-red-400" />}
                    <span className="truncate text-xs text-[var(--color-ink-faint)]">{f.filename}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {step === "review" && (
          <div className="flex flex-1 flex-col p-4 gap-3">
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
              <strong>{doneCount}</strong> files re-tagged · tags locked during re-tag are highlighted in the file list
            </div>
            <button
              onClick={() => { setStep("configure"); setFileStatuses({}); setFileResults({}); }}
              className="w-full rounded-xl border border-[var(--color-border)] py-2 text-sm text-[var(--color-ink-soft)] transition-colors hover:bg-[var(--color-bg-white)]"
            >
              Re-configure and run again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Shared variant props ─────────────────────────────────────────────────────

interface VariantProps {
  files: FileMetadata[];
  selectedTags: Set<string>;
  canWrite: boolean;
  ops: ReturnType<typeof useTagOps>;
}

// ─── Prototype switcher ───────────────────────────────────────────────────────

const VARIANTS  = ["A", "B", "C"] as const;
const V_LABELS: Record<string, string> = {
  A: "A — Inline steps",
  B: "B — Slide drawer",
  C: "C — Split column",
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
      if (tag === "INPUT" || tag === "TEXTAREA") return;
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

export function KnowledgeBaseRetagFlowProto({ files: initialFiles, currentUser, userId, teamId, teamName, userRole }: Props) {
  const searchParams   = useSearchParams();
  const variant        = searchParams.get("variant") ?? "A";
  const [files, setFiles]           = useState<FileMetadata[]>(initialFiles);
  const [selectedTags, setSelected] = useState<Set<string>>(new Set());
  const [search, setSearch]         = useState("");
  useEffect(() => { setFiles(initialFiles); }, [initialFiles]);

  const isTeam   = !!teamId;
  const canWrite = !isTeam || userRole === "owner" || userRole === "editor";
  const ops      = useTagOps(files, setFiles);

  function toggleTag(tag: string, e: React.MouseEvent) {
    setSelected((prev) => {
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

  const vProps: VariantProps = { files, selectedTags, canWrite, ops };

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--color-ink)]">
            {isTeam ? teamName : "Knowledge Base"}
          </h1>
          <p className="mt-0.5 text-sm text-[var(--color-ink-muted)]">{files.length.toLocaleString()} files · {currentUser}</p>
        </div>
        <Link href="/dashboard/mcp" className="flex items-center gap-1.5 rounded-xl border border-[var(--color-border)] px-3 py-1.5 text-xs text-[var(--color-ink-soft)] transition-colors hover:border-[var(--color-border-strong)]">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />MCP Ready
        </Link>
      </div>

      <div className="flex h-[calc(100vh-12rem)] overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-white)]">
        <TagSidebar
          files={files}
          selectedTags={selectedTags}
          onToggle={toggleTag}
          search={search}
          onSearch={setSearch}
        />
        {variant === "A" && <VariantA {...vProps} />}
        {variant === "B" && <VariantB {...vProps} />}
        {variant === "C" && <VariantC {...vProps} />}
      </div>

      <PrototypeSwitcher variant={variant} />
    </>
  );
}

// PROTOTYPE — Re-tag UX
// Question: What's the best UX for re-running the tag engine on files with generic tags?
// Variants:
//   A = Triage queue  — one file at a time, flashcard-style accept/skip
//   B = Batch table   — multi-select broad files, run all, review diff table
//   C = Tag-centric   — pick a broad tag, refine all its files, apply in bulk
//
// API contract assumed:
//   POST /api/knowledge-base/files/:id/retag
//   Response: string[]   (suggested replacement tags)
// If endpoint returns non-200, component falls back to demo mode (clearly labeled).

"use client";

import { useState, useEffect, useCallback } from "react";
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

interface VariantProps {
  files: FileMetadata[];
  ops: ReturnType<typeof useTagOps>;
  tagCounts: Record<string, number>;
  canWrite: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function tagHealth(count: number, total: number): "orphan" | "good" | "broad" {
  if (count === 1) return "orphan";
  if (count > Math.max(30, total * 0.08)) return "broad";
  return "good";
}

const HEALTH = {
  orphan: { dot: "bg-amber-400" },
  good:   { dot: "bg-emerald-400" },
  broad:  { dot: "bg-orange-400" },
};

// ─── Re-tag API + demo fallback ───────────────────────────────────────────────

async function callRetag(fileId: string): Promise<string[] | null> {
  try {
    const res = await fetch(`/api/knowledge-base/files/${fileId}/retag`, { method: "POST" });
    if (res.ok) {
      const data = await res.json();
      return Array.isArray(data) ? data : (data.tags ?? null);
    }
  } catch { /* fall through */ }
  await new Promise((r) => setTimeout(r, 600 + Math.random() * 900));
  return null; // null = demo mode
}

function demoSuggest(
  file: FileMetadata,
  tagCounts: Record<string, number>,
  total: number,
): string[] {
  const allTags    = Object.keys(tagCounts);
  const keepTags   = file.tags.filter((t) => tagHealth(tagCounts[t] ?? 1, total) !== "broad");
  const pool       = allTags.filter(
    (t) => !file.tags.includes(t) && tagHealth(tagCounts[t] ?? 1, total) === "good",
  );
  const additions  = pool.sort(() => 0.5 - Math.random()).slice(0, Math.max(1, 3 - keepTags.length));
  return [...keepTags, ...additions];
}

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

  return { updateFileTags };
}

// ─── Shared diff pill components ──────────────────────────────────────────────

function TagDiff({ current, suggested }: { current: string[]; suggested: string[] }) {
  const toRemove = current.filter((t) => !suggested.includes(t));
  const toAdd    = suggested.filter((t) => !current.includes(t));
  const toKeep   = current.filter((t) => suggested.includes(t));

  if (toRemove.length === 0 && toAdd.length === 0) {
    return <span className="text-xs text-[var(--color-ink-faint)]">No changes</span>;
  }

  return (
    <div className="flex flex-wrap items-center gap-1">
      {toKeep.map((t) => (
        <span key={t} className="rounded-full bg-[var(--color-bg-card)] px-2 py-0.5 text-xs text-[var(--color-ink-faint)]">{t}</span>
      ))}
      {toRemove.map((t) => (
        <span key={t} className="rounded-full bg-red-50 px-2 py-0.5 text-xs text-red-400 line-through ring-1 ring-red-100">{t}</span>
      ))}
      {toAdd.map((t) => (
        <span key={t} className="flex items-center gap-0.5 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200">
          <span className="opacity-70">+</span>{t}
        </span>
      ))}
    </div>
  );
}

function DemoWarning() {
  return (
    <span className="rounded bg-amber-50 px-2 py-0.5 text-[10px] text-amber-600 ring-1 ring-amber-200">
      DEMO — API not yet available
    </span>
  );
}

// ─── Variant A — Triage queue ─────────────────────────────────────────────────
// Files with broad tags presented one by one.
// Re-run → loading → diff appears → Accept / Re-run / Skip.

function VariantA({ files, ops, tagCounts, canWrite }: VariantProps) {
  const total = files.length;
  const queue = files
    .filter((f) => f.tags.some((t) => tagHealth(tagCounts[t] ?? 1, total) === "broad"))
    .sort((a, b) => {
      const broad = (f: FileMetadata) => f.tags.filter((t) => tagHealth(tagCounts[t] ?? 1, total) === "broad").length;
      return broad(b) - broad(a);
    });

  const [idx,         setIdx]         = useState(0);
  const [status,      setStatus]      = useState<"idle" | "loading" | "suggested">("idle");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isDemo,      setIsDemo]      = useState(false);
  const [accepted,    setAccepted]    = useState(0);
  const [skipped,     setSkipped]     = useState(0);

  const isDone = idx >= queue.length;
  const file   = queue[idx] ?? null;

  async function runRetag() {
    if (!file) return;
    setStatus("loading");
    const result = await callRetag(file.id);
    if (result) {
      setSuggestions(result);
      setIsDemo(false);
    } else {
      setSuggestions(demoSuggest(file, tagCounts, total));
      setIsDemo(true);
    }
    setStatus("suggested");
  }

  function advance() { setIdx((i) => i + 1); setStatus("idle"); setSuggestions([]); }

  function accept() {
    if (!file) return;
    ops.updateFileTags(file.id, suggestions);
    setAccepted((n) => n + 1);
    advance();
  }

  function skip() { setSkipped((n) => n + 1); advance(); }

  if (queue.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-16 text-center">
        <span className="text-3xl">✓</span>
        <p className="font-semibold text-emerald-800">No broad tags detected</p>
        <p className="text-sm text-emerald-600">All your tags look healthy.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl space-y-5">
      {/* Progress bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-[var(--color-ink-faint)]">
          <span>{isDone ? "Done" : `${idx + 1} of ${queue.length} files`}</span>
          <span>{accepted} accepted · {skipped} skipped</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-[var(--color-border)]">
          <div
            className="h-full rounded-full bg-[var(--color-accent)] transition-all duration-300"
            style={{ width: `${(idx / queue.length) * 100}%` }}
          />
        </div>
      </div>

      {isDone ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-12 text-center">
          <span className="text-3xl">✓</span>
          <p className="font-semibold text-emerald-800">All files reviewed</p>
          <p className="text-sm text-emerald-600">{accepted} accepted · {skipped} skipped</p>
          <button onClick={() => { setIdx(0); setAccepted(0); setSkipped(0); setStatus("idle"); }} className="mt-2 text-xs text-emerald-700 underline">Start over</button>
        </div>
      ) : file && (
        <div className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-white)]">
          {/* File name */}
          <div className="border-b border-[var(--color-border)] bg-[var(--color-bg-card)] px-5 py-4">
            <p className="truncate text-sm font-medium text-[var(--color-ink)]">{file.filename}</p>
          </div>

          {/* Current tags with health signal */}
          <div className="border-b border-[var(--color-border)] px-5 py-4">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-ink-faint)]">Current tags</p>
            <div className="flex flex-wrap gap-1.5">
              {file.tags.length === 0
                ? <span className="text-xs italic text-[var(--color-ink-faint)]">untagged</span>
                : file.tags.map((t) => {
                    const health = tagHealth(tagCounts[t] ?? 1, total);
                    return (
                      <span
                        key={t}
                        className={[
                          "flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs",
                          health === "broad"
                            ? "bg-orange-50 font-medium text-orange-700 ring-1 ring-orange-200"
                            : "bg-[var(--color-bg-card)] text-[var(--color-ink-soft)]",
                        ].join(" ")}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${HEALTH[health].dot}`} />
                        {t}
                        {health === "broad" && <span className="opacity-50 text-[10px]">broad</span>}
                      </span>
                    );
                  })
              }
            </div>
          </div>

          {/* Action area */}
          <div className="px-5 py-4">
            {status === "idle" && (
              <button
                onClick={runRetag}
                disabled={!canWrite}
                className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[var(--color-border-strong)] py-5 text-sm text-[var(--color-ink-soft)] transition-colors hover:border-[var(--color-accent)] hover:bg-[var(--color-accent-bg)] hover:text-[var(--color-accent)] disabled:opacity-40"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                Re-run tag engine
              </button>
            )}

            {status === "loading" && (
              <div className="flex items-center justify-center gap-3 py-5">
                <svg className="h-5 w-5 animate-spin text-[var(--color-accent)]" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx={12} cy={12} r={10} stroke="currentColor" strokeWidth={4} />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span className="text-sm text-[var(--color-ink-muted)]">Analyzing…</span>
              </div>
            )}

            {status === "suggested" && (
              <div className="space-y-3">
                {isDemo && <DemoWarning />}
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-ink-faint)]">Suggested tags</p>
                <TagDiff current={file.tags} suggested={suggestions} />
                <div className="flex gap-2 pt-1">
                  <button onClick={accept} className="flex-1 rounded-xl bg-[var(--color-accent)] py-2.5 text-sm font-medium text-white transition-colors hover:bg-[var(--color-accent-hover)]">
                    Accept
                  </button>
                  <button onClick={() => setStatus("idle")} className="rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-sm text-[var(--color-ink-soft)] transition-colors hover:bg-[var(--color-bg-card)]">
                    Re-run
                  </button>
                  <button onClick={skip} className="rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-sm text-[var(--color-ink-soft)] transition-colors hover:bg-[var(--color-bg-card)]">
                    Skip
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quick-skip remaining */}
      {!isDone && (
        <div className="flex justify-end">
          <button onClick={() => setIdx(queue.length)} className="text-xs text-[var(--color-ink-faint)] underline transition-colors hover:text-[var(--color-ink)]">
            Skip remaining {queue.length - idx}
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Variant B — Batch table ──────────────────────────────────────────────────
// All files with broad tags in a table. Multi-select → "Re-tag X files".
// Results expand inline as a diff. Per-row Accept/Skip. "Accept all ready" button.

type RowStatus = "pending" | "loading" | "suggested" | "accepted" | "skipped" | "error";

function VariantB({ files, ops, tagCounts, canWrite }: VariantProps) {
  const total = files.length;
  const broadFiles = files
    .filter((f) => f.tags.some((t) => tagHealth(tagCounts[t] ?? 1, total) === "broad"))
    .sort((a, b) => {
      const score = (f: FileMetadata) => f.tags.filter((t) => tagHealth(tagCounts[t] ?? 1, total) === "broad").length;
      return score(b) - score(a);
    });

  const [selected,    setSelected]    = useState<Set<string>>(new Set());
  const [rowStatus,   setRowStatus]   = useState<Record<string, RowStatus>>({});
  const [suggestions, setSuggestions] = useState<Record<string, string[]>>({});
  const [isDemo,      setIsDemo]      = useState<Record<string, boolean>>({});
  const [expanded,    setExpanded]    = useState<Set<string>>(new Set());

  function toggle(id: string) {
    setSelected((p) => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }

  function toggleAll() {
    const pendingIds = broadFiles.filter((f) => !rowStatus[f.id] || rowStatus[f.id] === "pending").map((f) => f.id);
    setSelected((p) => p.size === pendingIds.length ? new Set() : new Set(pendingIds));
  }

  async function retagSelected() {
    const ids = [...selected];
    setSelected(new Set());
    setRowStatus((p) => { const n = { ...p }; ids.forEach((id) => { n[id] = "loading"; }); return n; });
    setExpanded((p) => { const n = new Set(p); ids.forEach((id) => n.add(id)); return n; });

    await Promise.all(ids.map(async (id) => {
      const file = broadFiles.find((f) => f.id === id);
      if (!file) return;
      const result = await callRetag(id);
      const suggs  = result ?? demoSuggest(file, tagCounts, total);
      setSuggestions((p) => ({ ...p, [id]: suggs }));
      setIsDemo((p) => ({ ...p, [id]: !result }));
      setRowStatus((p) => ({ ...p, [id]: "suggested" }));
    }));
  }

  function acceptRow(id: string) {
    const suggs = suggestions[id];
    if (suggs) ops.updateFileTags(id, suggs);
    setRowStatus((p) => ({ ...p, [id]: "accepted" }));
  }

  function skipRow(id: string) {
    setRowStatus((p) => ({ ...p, [id]: "skipped" }));
  }

  function acceptAllReady() {
    broadFiles.forEach((f) => {
      if (rowStatus[f.id] === "suggested") acceptRow(f.id);
    });
  }

  const readyCount    = broadFiles.filter((f) => rowStatus[f.id] === "suggested").length;
  const acceptedCount = broadFiles.filter((f) => rowStatus[f.id] === "accepted").length;
  const pendingIds    = broadFiles.filter((f) => !rowStatus[f.id] || rowStatus[f.id] === "pending").map((f) => f.id);

  const STATUS_BADGE: Record<RowStatus, string> = {
    pending:   "bg-[var(--color-bg-card)] text-[var(--color-ink-faint)]",
    loading:   "bg-blue-50 text-blue-600",
    suggested: "bg-amber-50 text-amber-700",
    accepted:  "bg-emerald-50 text-emerald-700",
    skipped:   "bg-[var(--color-bg-card)] text-[var(--color-ink-faint)] line-through",
    error:     "bg-red-50 text-red-600",
  };

  if (broadFiles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-16 text-center">
        <span className="text-3xl">✓</span>
        <p className="font-semibold text-emerald-800">No broad-tagged files</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary + Accept all */}
      <div className="flex items-center gap-4">
        <span className="text-sm text-[var(--color-ink-soft)]">
          <strong className="text-[var(--color-ink)]">{broadFiles.length}</strong> files with broad tags
          {acceptedCount > 0 && <> · <strong className="text-emerald-600">{acceptedCount}</strong> accepted</>}
        </span>
        {readyCount > 0 && (
          <button
            onClick={acceptAllReady}
            className="ml-auto flex items-center gap-1.5 rounded-xl bg-[var(--color-accent)] px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-[var(--color-accent-hover)]"
          >
            Accept all ready ({readyCount})
          </button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-white)]">
        {broadFiles.map((file) => {
          const status   = rowStatus[file.id] ?? "pending";
          const suggs    = suggestions[file.id];
          const isExped  = expanded.has(file.id);
          const broadTags = file.tags.filter((t) => tagHealth(tagCounts[t] ?? 1, total) === "broad");

          return (
            <div key={file.id} className="border-b border-[var(--color-border)] last:border-0">
              {/* Row */}
              <div className={["flex items-start gap-3 px-4 py-3 transition-colors", status === "accepted" ? "bg-emerald-50/40" : status === "skipped" ? "opacity-50" : ""].join(" ")}>
                {/* Checkbox — only for pending rows */}
                <input
                  type="checkbox"
                  checked={selected.has(file.id)}
                  disabled={status !== "pending"}
                  onChange={() => toggle(file.id)}
                  className="mt-0.5 h-3.5 w-3.5 shrink-0 rounded accent-[var(--color-accent)] disabled:opacity-30"
                />

                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs text-[var(--color-ink-faint)]">{file.filename}</p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {file.tags.map((t) => {
                      const health = tagHealth(tagCounts[t] ?? 1, total);
                      return (
                        <span key={t} className={["rounded-full px-2 py-0.5 text-xs", health === "broad" ? "bg-orange-50 text-orange-600 ring-1 ring-orange-200" : "bg-[var(--color-bg-card)] text-[var(--color-ink-faint)]"].join(" ")}>
                          {t}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Status + actions */}
                <div className="flex shrink-0 items-center gap-2">
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${STATUS_BADGE[status]}`}>
                    {status === "loading" ? (
                      <span className="flex items-center gap-1">
                        <svg className="h-2.5 w-2.5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx={12} cy={12} r={10} stroke="currentColor" strokeWidth={4} /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                        running
                      </span>
                    ) : status}
                  </span>
                  {status === "suggested" && (
                    <>
                      <button onClick={() => acceptRow(file.id)} className="text-xs font-medium text-emerald-600 hover:text-emerald-800 transition-colors">Accept</button>
                      <button onClick={() => skipRow(file.id)} className="text-xs text-[var(--color-ink-faint)] hover:text-[var(--color-ink)] transition-colors">Skip</button>
                    </>
                  )}
                  {(status === "suggested" || status === "loading") && (
                    <button onClick={() => setExpanded((p) => { const n = new Set(p); isExped ? n.delete(file.id) : n.add(file.id); return n; })} className="text-xs text-[var(--color-ink-faint)] hover:text-[var(--color-ink)]">
                      {isExped ? "▲" : "▼"}
                    </button>
                  )}
                </div>
              </div>

              {/* Diff (expanded) */}
              {isExped && suggs && (
                <div className="border-t border-[var(--color-border)] bg-[var(--color-bg-card)] px-4 py-3">
                  {isDemo[file.id] && <div className="mb-2"><DemoWarning /></div>}
                  <TagDiff current={file.tags} suggested={suggs} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Floating action bar */}
      {selected.size > 0 && (
        <div className="fixed bottom-20 left-1/2 z-40 flex -translate-x-1/2 items-center gap-4 rounded-full bg-gray-900 px-6 py-3 text-white shadow-2xl">
          <span className="text-sm font-medium">{selected.size} selected</span>
          <button
            onClick={retagSelected}
            disabled={!canWrite}
            className="flex items-center gap-1.5 rounded-full bg-[var(--color-accent)] px-4 py-1.5 text-sm font-medium transition-colors hover:bg-[var(--color-accent-hover)] disabled:opacity-40"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            Re-tag {selected.size} files
          </button>
          <button onClick={() => setSelected(new Set())} className="text-sm text-gray-400 hover:text-white">Cancel</button>
        </div>
      )}

      {/* Select all pending */}
      {pendingIds.length > 0 && selected.size === 0 && (
        <div className="flex justify-center">
          <button onClick={toggleAll} className="text-xs text-[var(--color-ink-faint)] underline hover:text-[var(--color-ink)]">
            Select all {pendingIds.length} pending files
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Variant C — Tag-centric refinement ──────────────────────────────────────
// Left sidebar: all tags, broad ones flagged with a "Refine" button.
// Right panel: when a tag is selected for refinement, shows per-file progress
// as files are processed one by one. "Apply all" when done.

type FileRefineStatus = "pending" | "loading" | "suggested" | "accepted" | "skipped";

function VariantC({ files, ops, tagCounts, canWrite }: VariantProps) {
  const total = files.length;

  const allTags = [...new Set(files.flatMap((f) => f.tags))].sort();
  const broadTags = allTags.filter((t) => tagHealth(tagCounts[t] ?? 1, total) === "broad");

  const [activeTag,   setActiveTag]   = useState<string | null>(null);
  const [search,      setSearch]      = useState("");
  const [running,     setRunning]     = useState(false);
  const [rowStatus,   setRowStatus]   = useState<Record<string, FileRefineStatus>>({});
  const [suggestions, setSuggestions] = useState<Record<string, string[]>>({});
  const [isDemo,      setIsDemo]      = useState<Record<string, boolean>>({});

  const filteredTags = allTags.filter((t) => !search || t.toLowerCase().includes(search.toLowerCase()));

  const tagFiles   = activeTag ? files.filter((f) => f.tags.includes(activeTag)) : [];
  const doneCount  = tagFiles.filter((f) => ["accepted", "skipped"].includes(rowStatus[f.id] ?? "")).length;
  const readyCount = tagFiles.filter((f) => rowStatus[f.id] === "suggested").length;

  // Reset state when tag changes
  function selectTag(tag: string) {
    setActiveTag(tag);
    setRunning(false);
    setRowStatus({});
    setSuggestions({});
    setIsDemo({});
  }

  async function runRefinement() {
    if (!activeTag || !tagFiles.length) return;
    setRunning(true);

    for (const file of tagFiles) {
      setRowStatus((p) => ({ ...p, [file.id]: "loading" }));
      const result = await callRetag(file.id);
      const suggs  = result ?? demoSuggest(file, tagCounts, total);
      setSuggestions((p) => ({ ...p, [file.id]: suggs }));
      setIsDemo((p) => ({ ...p, [file.id]: !result }));
      setRowStatus((p) => ({ ...p, [file.id]: "suggested" }));
    }

    setRunning(false);
  }

  function acceptRow(fileId: string) {
    const suggs = suggestions[fileId];
    if (suggs) ops.updateFileTags(fileId, suggs);
    setRowStatus((p) => ({ ...p, [fileId]: "accepted" }));
  }

  function skipRow(fileId: string) {
    setRowStatus((p) => ({ ...p, [fileId]: "skipped" }));
  }

  function applyAll() {
    tagFiles.forEach((f) => { if (rowStatus[f.id] === "suggested") acceptRow(f.id); });
  }

  const STATUS_ICON: Record<FileRefineStatus, React.ReactNode> = {
    pending:   <span className="h-2 w-2 rounded-full bg-[var(--color-border-strong)]" />,
    loading:   <svg className="h-3.5 w-3.5 animate-spin text-blue-500" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx={12} cy={12} r={10} stroke="currentColor" strokeWidth={4} /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>,
    suggested: <span className="h-2 w-2 rounded-full bg-amber-400" />,
    accepted:  <span className="h-2 w-2 rounded-full bg-emerald-400" />,
    skipped:   <span className="h-2 w-2 rounded-full bg-[var(--color-border-strong)]" />,
  };

  return (
    <div className="flex h-full gap-0 overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-white)]">
      {/* Tag sidebar */}
      <aside className="flex w-56 shrink-0 flex-col border-r border-[var(--color-border)]">
        <div className="border-b border-[var(--color-border)] p-3">
          <div className="relative">
            <svg className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--color-ink-faint)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Find tag…" className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-card)] py-1.5 pl-7 pr-2 text-xs outline-none focus:border-[var(--color-accent)]" />
          </div>
          {broadTags.length > 0 && (
            <p className="mt-2 flex items-center gap-1 text-[10px] text-orange-600">
              <span className="h-1.5 w-1.5 rounded-full bg-orange-400 shrink-0" />
              {broadTags.length} broad {broadTags.length === 1 ? "tag" : "tags"} — click to refine
            </p>
          )}
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredTags.map((tag) => {
            const count  = tagCounts[tag] ?? 0;
            const health = tagHealth(count, total);
            const isBroad  = health === "broad";
            const isActive = activeTag === tag;

            return (
              <div
                key={tag}
                className={["group flex items-center gap-2 border-b border-[var(--color-border)] px-4 py-2.5 transition-colors", isActive ? "bg-[var(--color-accent-bg)]" : "hover:bg-[var(--color-bg-card)]"].join(" ")}
              >
                <span className={`h-2 w-2 shrink-0 rounded-full ${HEALTH[health].dot}`} />
                <button
                  onClick={() => selectTag(tag)}
                  className={["flex-1 truncate text-left text-sm", isActive ? "font-semibold text-[var(--color-accent)]" : "text-[var(--color-ink-soft)]"].join(" ")}
                >
                  {tag}
                </button>
                <span className="shrink-0 font-mono text-xs text-[var(--color-ink-faint)]">{count}</span>
                {isBroad && canWrite && (
                  <button
                    onClick={() => selectTag(tag)}
                    title="Refine this tag"
                    className={["shrink-0 rounded px-1 py-0.5 text-[10px] font-medium transition-colors", isActive ? "bg-orange-100 text-orange-700" : "opacity-0 bg-orange-50 text-orange-600 group-hover:opacity-100 hover:bg-orange-100"].join(" ")}
                  >
                    Refine
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </aside>

      {/* Right panel */}
      <div className="flex min-w-0 flex-1 flex-col">
        {!activeTag ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center">
            <p className="text-sm font-medium text-[var(--color-ink-soft)]">Select a tag to refine</p>
            <p className="text-xs text-[var(--color-ink-faint)]">
              {broadTags.length > 0
                ? `${broadTags.length} broad tags detected — click "Refine" next to one`
                : "No broad tags found"}
            </p>
          </div>
        ) : (
          <>
            {/* Panel header */}
            <div className="flex items-center justify-between border-b border-[var(--color-border)] px-5 py-3">
              <div className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${HEALTH[tagHealth(tagCounts[activeTag] ?? 0, total)].dot}`} />
                <h2 className="text-sm font-semibold text-[var(--color-ink)]">
                  {activeTag}
                  <span className="ml-2 font-normal text-[var(--color-ink-faint)]">({tagFiles.length} files)</span>
                </h2>
              </div>

              <div className="flex items-center gap-2">
                {readyCount > 0 && (
                  <button onClick={applyAll} className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-emerald-700">
                    Apply all ({readyCount})
                  </button>
                )}
                {!running && doneCount < tagFiles.length && canWrite && (
                  <button
                    onClick={runRefinement}
                    className="flex items-center gap-1.5 rounded-lg border border-[var(--color-accent)] px-3 py-1.5 text-xs font-medium text-[var(--color-accent)] transition-colors hover:bg-[var(--color-accent-bg)]"
                  >
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                    {doneCount === 0 ? "Refine all files" : "Re-run remaining"}
                  </button>
                )}
              </div>
            </div>

            {/* Progress bar */}
            {(running || doneCount > 0) && (
              <div className="border-b border-[var(--color-border)] px-5 py-2">
                <div className="flex items-center gap-3">
                  <div className="flex-1 overflow-hidden rounded-full bg-[var(--color-border)] h-1">
                    <div
                      className="h-full rounded-full bg-[var(--color-accent)] transition-all duration-500"
                      style={{ width: `${tagFiles.length > 0 ? (doneCount / tagFiles.length) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="shrink-0 text-xs text-[var(--color-ink-faint)]">{doneCount} / {tagFiles.length}</span>
                </div>
              </div>
            )}

            {/* File rows */}
            <div className="flex-1 overflow-y-auto">
              {tagFiles.map((file) => {
                const status = rowStatus[file.id] ?? "pending";
                const suggs  = suggestions[file.id];

                return (
                  <div key={file.id} className={["border-b border-[var(--color-border)] px-5 py-3 transition-colors", status === "accepted" ? "bg-emerald-50/50" : status === "skipped" ? "opacity-40" : ""].join(" ")}>
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 shrink-0">{STATUS_ICON[status]}</div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs text-[var(--color-ink-faint)]">{file.filename}</p>
                        {suggs ? (
                          <div className="mt-1">
                            {isDemo[file.id] && <div className="mb-1"><DemoWarning /></div>}
                            <TagDiff current={file.tags} suggested={suggs} />
                          </div>
                        ) : status === "pending" ? (
                          <div className="mt-1 flex flex-wrap gap-1">
                            {file.tags.map((t) => (
                              <span key={t} className={["rounded-full px-2 py-0.5 text-xs", tagHealth(tagCounts[t] ?? 1, total) === "broad" ? "bg-orange-50 text-orange-600" : "bg-[var(--color-bg-card)] text-[var(--color-ink-faint)]"].join(" ")}>{t}</span>
                            ))}
                          </div>
                        ) : null}
                      </div>
                      {status === "suggested" && (
                        <div className="flex shrink-0 items-center gap-1.5">
                          <button onClick={() => acceptRow(file.id)} className="rounded px-2 py-0.5 text-xs font-medium text-emerald-600 transition-colors hover:bg-emerald-50">Accept</button>
                          <button onClick={() => skipRow(file.id)} className="rounded px-2 py-0.5 text-xs text-[var(--color-ink-faint)] transition-colors hover:bg-[var(--color-bg-card)]">Skip</button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
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
  A: "A — Triage queue",
  B: "B — Batch table",
  C: "C — Tag-centric",
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

export function KnowledgeBaseRetagProto({ files: initialFiles, currentUser, userId, teamId, teamName, userRole }: Props) {
  const searchParams = useSearchParams();
  const variant      = searchParams.get("variant") ?? "A";
  const [files, setFiles] = useState<FileMetadata[]>(initialFiles);
  useEffect(() => { setFiles(initialFiles); }, [initialFiles]);

  const isTeam   = !!teamId;
  const canWrite = !isTeam || userRole === "owner" || userRole === "editor";
  const ops      = useTagOps(files, setFiles);
  const tagCounts = Object.fromEntries(
    [...new Set(files.flatMap((f) => f.tags))].map((t) => [t, files.filter((f) => f.tags.includes(t)).length])
  );

  const vProps: VariantProps = { files, ops, tagCounts, canWrite };

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--color-ink)]">
            Re-tag — {isTeam ? teamName : "Knowledge Base"}
          </h1>
          <p className="mt-0.5 text-sm text-[var(--color-ink-muted)]">
            {files.length.toLocaleString()} files · {currentUser}
          </p>
        </div>
        <Link href="/dashboard" className="flex items-center gap-1.5 rounded-xl border border-[var(--color-border)] px-3 py-1.5 text-xs text-[var(--color-ink-soft)] transition-colors hover:border-[var(--color-border-strong)]">
          ← Back to KB
        </Link>
      </div>

      {variant === "A" && <VariantA {...vProps} />}
      {variant === "B" && <VariantB {...vProps} />}
      {variant === "C" && <VariantC {...vProps} />}

      <PrototypeSwitcher variant={variant} />
    </>
  );
}

// PROTOTYPE — Experiments dashboard · ROUND 3
// Combining the winning ideas from round 2:
//   A = Daily Standup (managing new experiments) + C = Lab Journal (visualization/aggregation).
// Three layouts for combining them:
//   A — Stacked          · DecideNow on top, Journal scrolls below. One column.
//   B — Split            · DecideNow left (60%), Journal right (40%). Two parallel streams.
//   C — Journal-as-spine · The whole page is the Journal; today's entry IS the DecideNow card.
// Switchable via ?variant=A|B|C. Click any experiment → modal with full action panel.

"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Experiment, Signal } from "@/lib/learning/ghost-db";
import { ExperimentCard } from "./ExperimentsClient";

interface Props {
  variant: "A" | "B" | "C";
  active: Experiment[];
  closed: Experiment[];
  drafts: Experiment[];
  all: Experiment[];
  signalsMap: Record<string, Signal[]>;
  velocityToday: number;
  velocityWeek: number;
  avgCycleHours: number | null;
  validationRate: number | null;
}

const DAY = 24 * 60 * 60 * 1000;
function daysSince(d: Date | string | null): number {
  if (!d) return Infinity;
  return (Date.now() - new Date(d).getTime()) / DAY;
}
function fmtDays(n: number): string {
  if (!isFinite(n)) return "—";
  if (n < 1) return `${Math.round(n * 24)}h`;
  if (n < 7) return `${Math.round(n)}d`;
  return `${Math.round(n / 7)}w`;
}

interface SectionHandlers {
  onSelect: (e: Experiment) => void;
  onShip: (id: string) => void;
  onPromote: (id: string) => void;
  onRefresh: () => void;
}

// ────────────────────────────────────────────────────────────────────────────
// DECIDE NOW SECTION (extracted from round-2 Variant A)
// One large auto-selected experiment + inline action buttons + up-next breadcrumb + drafts.
// ────────────────────────────────────────────────────────────────────────────

function DecideNowSection({
  active, drafts, signalsMap, velocityToday, velocityWeek, avgCycleHours, validationRate,
  onSelect, onPromote, onRefresh, compact = false,
}: Props & SectionHandlers & { compact?: boolean }) {
  const live = active.filter((e) => e.loop_class !== "L0");
  const ranked = useMemo(() => live
    .map((e) => ({
      exp: e,
      ageDays: daysSince(e.started_at),
      sigCount: (signalsMap[e.id] ?? []).length,
    }))
    .sort((a, b) => {
      if (Math.abs(b.ageDays - a.ageDays) > 0.5) return b.ageDays - a.ageDays;
      return b.sigCount - a.sigCount;
    }), [live, signalsMap]);
  const now = ranked[0];
  const upNext = ranked.slice(1, compact ? 4 : 7);

  return (
    <div className="space-y-6">
      {drafts.length > 0 && (
        <section className="rounded-xl border-2 border-emerald-200 bg-emerald-50 p-4">
          <p className="text-xs font-semibold text-emerald-900 uppercase tracking-wide mb-2">
            First — {drafts.length} pending next-bet{drafts.length > 1 ? "s" : ""}
          </p>
          <p className="text-xs text-emerald-700 mb-3">Drafts auto-spawned from your last closes. Promote or discard before adding new bets.</p>
          <div className="space-y-2">
            {drafts.slice(0, 3).map((d) => (
              <div key={d.id} className="flex items-start gap-2 bg-white rounded-lg p-3">
                <p className="flex-1 text-sm text-gray-800">{d.hypothesis}</p>
                <div className="flex gap-1 shrink-0">
                  <button onClick={() => onPromote(d.id)} className="text-xs px-3 py-1 rounded bg-emerald-700 text-white">Promote</button>
                  <button onClick={() => onSelect(d)} className="text-xs px-3 py-1 rounded border border-gray-200 text-gray-600">Edit</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {now && (
        <section className="space-y-2">
          <div className="flex items-baseline justify-between px-1">
            <p className="text-xs uppercase tracking-widest font-semibold text-gray-900">Decide now</p>
            <p className="text-xs text-gray-500">running {fmtDays(now.ageDays)} · {now.sigCount} signal{now.sigCount === 1 ? "" : "s"}</p>
          </div>
          {/* ExperimentCard provides the inline action surface:
              WIN/KILL → expand 6-field structured close wizard inline (no modal).
              Need More Data → expand inline note prompt (no modal).
              Mark Shipped → fires PATCH directly. Signal trail visible below. */}
          <div className="rounded-2xl border-2 border-gray-900 bg-white shadow-lg p-2">
            <ExperimentCard
              exp={now.exp}
              initialSignals={signalsMap[now.exp.id] ?? []}
              onAction={onRefresh}
            />
          </div>
        </section>
      )}

      {upNext.length > 0 && (
        <section>
          <p className="text-xs uppercase tracking-wide text-gray-500 mb-2">Up next · {upNext.length} after this one</p>
          <div className="space-y-1">
            {upNext.map((x, i) => (
              <button
                key={x.exp.id}
                onClick={() => onSelect(x.exp)}
                className="w-full flex items-center gap-3 text-left text-xs p-2 rounded hover:bg-white border border-transparent hover:border-gray-200"
              >
                <span className="font-mono text-gray-400 shrink-0 w-4 text-right">{i + 2}</span>
                <span className="flex-1 truncate text-gray-700">{x.exp.hypothesis}</span>
                <span className="text-gray-400 shrink-0 font-mono">{fmtDays(x.ageDays)}</span>
              </button>
            ))}
          </div>
        </section>
      )}

      {!compact && (
        <section className="border-t border-gray-200 pt-4 grid grid-cols-4 gap-2 text-xs">
          <Stat label="Today" value={`${velocityToday} started`} />
          <Stat label="7d velocity" value={String(velocityWeek)} />
          <Stat label="Avg cycle" value={avgCycleHours != null ? `${avgCycleHours}h` : "—"} alarm={avgCycleHours != null && avgCycleHours > 48} />
          <Stat label="Validation rate" value={validationRate != null ? `${(validationRate * 100).toFixed(0)}%` : "—"} />
        </section>
      )}
    </div>
  );
}

function Stat({ label, value, alarm }: { label: string; value: string; alarm?: boolean }) {
  return (
    <div>
      <div className="text-gray-400 uppercase tracking-wide text-[10px]">{label}</div>
      <div className={`text-lg font-semibold ${alarm ? "text-red-600" : "text-gray-900"}`}>{value}</div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// JOURNAL SECTION (extracted from round-2 Variant C)
// Reverse-chronological notebook. Each day = entry with started/closed/signaled.
// Click day to expand. Click experiment to act. Optional date offset to skip
// "today" (for Variant C where today is the DecideNow card already).
// ────────────────────────────────────────────────────────────────────────────

function JournalSection({
  all, signalsMap, onSelect, skipToday = false, todayOpen = false,
}: { all: Experiment[]; signalsMap: Record<string, Signal[]>; onSelect: (e: Experiment) => void; skipToday?: boolean; todayOpen?: boolean }) {
  const [openDay, setOpenDay] = useState<string | null>(null);

  const byDay = useMemo(() => {
    type DayActivity = {
      started: Experiment[];
      closed: Experiment[];
      signaled: { exp: Experiment; signal: Signal }[];
    };
    const map: Record<string, DayActivity> = {};
    function key(d: Date | string): string { return new Date(d).toISOString().slice(0, 10); }
    function bucket(k: string): DayActivity { return (map[k] ||= { started: [], closed: [], signaled: [] }); }
    for (const e of all) {
      bucket(key(e.started_at)).started.push(e);
      if (e.shipped_at && e.outcome !== "in_progress") bucket(key(e.shipped_at)).closed.push(e);
    }
    for (const [expId, sigs] of Object.entries(signalsMap)) {
      const exp = all.find((e) => e.id === expId);
      if (!exp) continue;
      for (const s of sigs) bucket(key(s.created_at)).signaled.push({ exp, signal: s });
    }
    let entries = Object.entries(map).sort((a, b) => b[0].localeCompare(a[0]));
    if (skipToday) {
      const today = new Date().toISOString().slice(0, 10);
      entries = entries.filter(([d]) => d !== today);
    }
    return entries;
  }, [all, signalsMap, skipToday]);

  return (
    <div className="relative">
      <div className="absolute left-[12px] top-2 bottom-2 w-0.5 bg-gray-300" />
      <div className="space-y-6">
        {byDay.map(([day, activity]) => {
          const isOpen = (todayOpen && day === new Date().toISOString().slice(0, 10)) || day === openDay;
          const total = activity.started.length + activity.closed.length + activity.signaled.length;
          return (
            <article key={day} className="relative pl-10">
              <div className="absolute left-[6px] top-2 w-4 h-4 rounded-full bg-gray-900 border-4 border-amber-50" />
              <button onClick={() => setOpenDay(isOpen ? null : day)} className="text-left w-full">
                <h2 className="text-lg font-serif text-gray-900">
                  {new Date(day).toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  {activity.started.length > 0 && <span>{activity.started.length} started · </span>}
                  {activity.closed.length > 0 && <span className="text-emerald-700">{activity.closed.length} closed · </span>}
                  {activity.signaled.length > 0 && <span className="text-blue-700">{activity.signaled.length} signal{activity.signaled.length === 1 ? "" : "s"}</span>}
                  {total === 0 && <span className="italic">no activity</span>}
                </p>
              </button>
              {isOpen && (
                <div className="mt-4 space-y-4 text-sm font-serif">
                  {activity.closed.length > 0 && (
                    <div>
                      <p className="text-[11px] uppercase tracking-wide text-emerald-700 font-sans font-semibold mb-1">Closed</p>
                      <ul className="space-y-1">
                        {activity.closed.map((e) => (
                          <li key={e.id} onClick={() => onSelect(e)} className="cursor-pointer hover:bg-amber-100/60 -mx-2 px-2 py-1 rounded">
                            <span className={e.outcome === "validated" ? "text-emerald-700" : "text-red-600"}>
                              {e.outcome === "validated" ? "✓ Validated" : e.outcome === "refuted" ? "✗ Refuted" : "? Inconclusive"}
                            </span>{" "}
                            — <span className="text-gray-800">{e.hypothesis.slice(0, 200)}</span>
                            {e.learning && <p className="text-xs text-gray-600 italic mt-0.5">&ldquo;{e.learning}&rdquo;</p>}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {activity.started.length > 0 && (
                    <div>
                      <p className="text-[11px] uppercase tracking-wide text-gray-700 font-sans font-semibold mb-1">Started</p>
                      <ul className="space-y-1">
                        {activity.started.slice(0, 8).map((e) => (
                          <li key={e.id} onClick={() => onSelect(e)} className="cursor-pointer hover:bg-amber-100/60 -mx-2 px-2 py-1 rounded text-gray-700">
                            {e.hypothesis.slice(0, 200)}
                          </li>
                        ))}
                        {activity.started.length > 8 && (
                          <li className="text-xs text-gray-500 italic pl-2">+ {activity.started.length - 8} more</li>
                        )}
                      </ul>
                    </div>
                  )}
                  {activity.signaled.length > 0 && (
                    <div>
                      <p className="text-[11px] uppercase tracking-wide text-blue-700 font-sans font-semibold mb-1">Signals logged</p>
                      <ul className="space-y-1.5">
                        {activity.signaled.slice(0, 10).map(({ exp, signal }) => (
                          <li key={signal.id} onClick={() => onSelect(exp)} className="cursor-pointer hover:bg-amber-100/60 -mx-2 px-2 py-1 rounded">
                            <span className="text-blue-700 text-xs font-sans uppercase tracking-wide">{signal.source}</span>{" "}
                            — <span className="text-gray-700">{signal.content}</span>
                            <p className="text-[11px] text-gray-500 mt-0.5">on: {exp.hypothesis.slice(0, 120)}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Variant A — Stacked
// One scrollable column. DecideNow card on top, drafts above. Below: a clear
// "What's been happening" section that fades into the journal feed. Single
// reading direction. Best for someone who scrolls top-to-bottom each session.
// ────────────────────────────────────────────────────────────────────────────

function VariantA(props: Props & SectionHandlers) {
  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-3xl mx-auto px-6 py-10 space-y-10">
        <header>
          <p className="text-xs uppercase tracking-widest text-gray-400">Stacked · {new Date().toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" })}</p>
          <h1 className="text-3xl font-semibold text-gray-900 mt-1">Decide first. Reflect after.</h1>
          <p className="text-sm text-gray-500 mt-2 max-w-xl">
            Today&apos;s decision sits on top. Scroll down to see the journal of what reality has been saying.
          </p>
        </header>

        <DecideNowSection {...props} />

        <div className="border-t-2 border-amber-300 pt-8">
          <h2 className="text-xs uppercase tracking-widest text-amber-800 mb-1">Lab journal</h2>
          <p className="text-sm text-gray-600 italic font-serif mb-6">Reverse-chronological. What was started, closed, signaled.</p>
          <JournalSection all={props.all} signalsMap={props.signalsMap} onSelect={props.onSelect} skipToday />
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Variant B — Split
// Two-pane email-client layout. Left 60% = DecideNow (sticky). Right 40% =
// Journal feed. The active and the historical live side by side, no scroll
// switching. Best for wide screens / power users.
// ────────────────────────────────────────────────────────────────────────────

function VariantB(props: Props & SectionHandlers) {
  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <header className="mb-6 flex items-baseline justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-gray-400">Split view · {new Date().toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" })}</p>
            <h1 className="text-2xl font-semibold text-gray-900 mt-0.5">Decide on the left. History on the right.</h1>
          </div>
        </header>

        <div className="grid grid-cols-12 gap-6 items-start">
          {/* Left: DecideNow — sticky, doesn't scroll */}
          <aside className="col-span-7 sticky top-6 self-start max-h-[calc(100vh-3rem)] overflow-y-auto pr-2">
            <DecideNowSection {...props} compact />
          </aside>

          {/* Right: Journal feed */}
          <main className="col-span-5 bg-amber-50/40 rounded-2xl p-5 border border-amber-200/60">
            <h2 className="text-xs uppercase tracking-widest text-amber-800 mb-1">Lab journal</h2>
            <p className="text-xs text-gray-600 italic font-serif mb-5">What reality has said.</p>
            <JournalSection all={props.all} signalsMap={props.signalsMap} onSelect={props.onSelect} skipToday />
          </main>
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Variant C — Journal-as-Spine
// The journal IS the page. Today's entry is special: instead of a normal
// summary, it expands into the full DecideNow interface. Older days are read-
// only journal entries. Treats the dashboard as one continuous lab notebook
// where today happens to be interactive.
// ────────────────────────────────────────────────────────────────────────────

function VariantC(props: Props & SectionHandlers) {
  return (
    <div className="min-h-screen bg-amber-50/30">
      <div className="max-w-4xl mx-auto px-8 py-10">
        <header className="mb-8 pb-4 border-b-2 border-gray-900">
          <p className="text-xs uppercase tracking-widest text-gray-500">Lab Journal</p>
          <h1 className="text-4xl font-serif text-gray-900 mt-1">Field notes from running experiments</h1>
          <p className="text-sm text-gray-600 mt-2 italic">Today&apos;s entry is interactive — decide. Older entries are the record of what reality said.</p>
        </header>

        {/* Today's entry, embedded inline as the first journal entry, with DecideNow inside it */}
        <article className="relative pl-10 pb-10 border-b border-amber-200">
          <div className="absolute left-[6px] top-2 w-4 h-4 rounded-full bg-emerald-600 border-4 border-amber-50 ring-2 ring-emerald-300" />
          <h2 className="text-lg font-serif text-gray-900">
            {new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" })} · today
          </h2>
          <p className="text-xs text-emerald-700 mt-0.5 font-sans uppercase tracking-wide">Active entry · decide and observe</p>
          <div className="mt-4">
            <DecideNowSection {...props} compact />
          </div>
        </article>

        {/* Older entries — read-only journal */}
        <div className="pt-8">
          <JournalSection all={props.all} signalsMap={props.signalsMap} onSelect={props.onSelect} skipToday />
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Switcher
// ────────────────────────────────────────────────────────────────────────────

const VARIANTS = ["A", "B", "C"] as const;
const LABELS: Record<string, string> = {
  A: "A — Stacked",
  B: "B — Split (left/right)",
  C: "C — Journal-as-spine",
};

function PrototypeSwitcher({ variant }: { variant: string }) {
  const router = useRouter();
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
      if (tag === "INPUT" || tag === "TEXTAREA" || (e.target as HTMLElement)?.isContentEditable) return;
      if (e.key === "ArrowLeft") go(prev);
      if (e.key === "ArrowRight") go(next);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <div className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-full bg-gray-900 px-5 py-2.5 text-white shadow-2xl">
      <button onClick={() => go(prev)} className="text-lg leading-none text-gray-400 hover:text-white">←</button>
      <span className="text-sm font-medium">{LABELS[variant] ?? variant}</span>
      <button onClick={() => go(next)} className="text-lg leading-none text-gray-400 hover:text-white">→</button>
      <span className="text-gray-500">·</span>
      <a href="/dashboard/experiments" className="text-xs text-gray-400 hover:text-white">exit prototype</a>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Entry point
// ────────────────────────────────────────────────────────────────────────────

export function ExperimentsProto(props: Props) {
  const router = useRouter();
  const [selected, setSelected] = useState<Experiment | null>(null);

  const refresh = () => router.refresh();

  async function handleShip(id: string) {
    await fetch(`/api/experiments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "ship" }),
    });
    refresh();
  }

  async function handlePromote(id: string) {
    await fetch(`/api/experiments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "promote" }),
    });
    refresh();
  }

  const sectionProps = { ...props, onSelect: setSelected, onShip: handleShip, onPromote: handlePromote, onRefresh: refresh };

  return (
    <>
      {props.variant === "A" && <VariantA {...sectionProps} />}
      {props.variant === "B" && <VariantB {...sectionProps} />}
      {props.variant === "C" && <VariantC {...sectionProps} />}

      {selected && (
        <div
          className="fixed inset-0 z-40 bg-black/50 flex items-start justify-center p-6 overflow-y-auto"
          onClick={() => setSelected(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-5 mt-12"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs uppercase tracking-wide text-gray-500">Experiment actions · click outside to close</p>
              <button
                onClick={() => setSelected(null)}
                className="text-gray-400 hover:text-gray-700 text-lg leading-none"
              >✕</button>
            </div>
            <ExperimentCard
              exp={selected}
              initialSignals={props.signalsMap[selected.id] ?? []}
              onAction={refresh}
            />
          </div>
        </div>
      )}

      <PrototypeSwitcher variant={props.variant} />
    </>
  );
}

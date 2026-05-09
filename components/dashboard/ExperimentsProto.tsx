// PROTOTYPE — Experiments dashboard redesign · ROUND 2
// Three new mental models replacing the rejected round-1 variants.
// All three lean toward DECISION RHYTHM, not data presentation.
//   A — Daily Standup     · "What ONE thing am I deciding right now?" (one decision at a time, max focus)
//   B — Swipe Stack       · "Burn through the corpus, decide each one." (Tinder-style sequential)
//   C — Lab Journal       · "What did reality say each day?" (temporal narrative, like a research notebook)
// Switchable via ?variant=A|B|C. Floating bottom switcher. Click any experiment → modal with full action panel.

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
function fmtDate(d: Date | string): string {
  return new Date(d).toLocaleDateString(undefined, { month: "short", day: "numeric", weekday: "short" });
}

// ────────────────────────────────────────────────────────────────────────────
// Variant A — Daily Standup
// One large "decide right now" card up top. Below it: a tiny breadcrumb of
// "next up" experiments. Below that: drafts pending promotion. Right rail:
// today's metrics. The page screams: "make ONE decision, then come back."
// ────────────────────────────────────────────────────────────────────────────

function VariantA(props: Props & { onSelect: (e: Experiment) => void; onShip: (id: string) => void; onPromote: (id: string) => void }) {
  const { active, drafts, signalsMap, velocityToday, velocityWeek, avgCycleHours, validationRate, onSelect, onShip, onPromote } = props;

  // The "now" experiment: oldest active L1/L2, prefer ones with signals (so user has context to decide)
  const live = active.filter((e) => e.loop_class !== "L0");
  const ranked = useMemo(() => {
    return live
      .map((e) => ({
        exp: e,
        ageDays: daysSince(e.started_at),
        sigCount: (signalsMap[e.id] ?? []).length,
        lastSignalDays: (signalsMap[e.id] ?? [])[0]?.created_at ? daysSince(signalsMap[e.id][0].created_at) : Infinity,
      }))
      .sort((a, b) => {
        // Primary: ageDays desc (stalest first)
        // Secondary: sigCount desc (more signal = easier decision)
        if (Math.abs(b.ageDays - a.ageDays) > 0.5) return b.ageDays - a.ageDays;
        return b.sigCount - a.sigCount;
      });
  }, [live, signalsMap]);

  const now = ranked[0];
  const upNext = ranked.slice(1, 7);

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-3xl mx-auto px-6 py-10 space-y-8">
        <header>
          <p className="text-xs uppercase tracking-widest text-gray-400">Daily Standup · {fmtDate(new Date())}</p>
          <h1 className="text-3xl font-semibold text-gray-900 mt-1">One decision at a time.</h1>
          <p className="text-sm text-gray-500 mt-2 max-w-xl">
            Pick this experiment up, decide, and come back. Don&apos;t scroll the list. Don&apos;t open three tabs.
            The Pinnacle Gecko Protocol&apos;s 48-hour rule: <em>twice as many decisions at half the precision is better than half as many at full</em>.
          </p>
        </header>

        {drafts.length > 0 && (
          <section className="rounded-xl border-2 border-emerald-200 bg-emerald-50 p-4">
            <p className="text-xs font-semibold text-emerald-900 uppercase tracking-wide mb-2">First — {drafts.length} pending next-bet{drafts.length > 1 ? "s" : ""}</p>
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
          <section className="rounded-2xl border-2 border-gray-900 bg-white p-8 space-y-5 shadow-lg">
            <div className="flex items-baseline justify-between">
              <p className="text-xs uppercase tracking-widest font-semibold text-gray-900">Decide now</p>
              <p className="text-xs text-gray-500">running for {fmtDays(now.ageDays)} · {now.sigCount} signal{now.sigCount === 1 ? "" : "s"}</p>
            </div>
            <p className="text-lg leading-snug text-gray-900">{now.exp.hypothesis}</p>

            <div className="grid grid-cols-3 gap-3 pt-2 border-t border-gray-100 text-sm">
              <div>
                <p className="text-[10px] uppercase tracking-wide text-gray-400">Win when</p>
                <p className="text-gray-700">{now.exp.metric ?? "—"} ≥ {now.exp.threshold ?? "—"}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wide text-gray-400">Within</p>
                <p className="text-gray-700">{now.exp.timeframe ?? "—"}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wide text-gray-400">Kill if</p>
                <p className="text-red-600">&lt; {now.exp.kill_threshold ?? "—"}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-100">
              <button onClick={() => onSelect(now.exp)} className="flex-1 text-sm font-medium px-4 py-3 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700">WIN</button>
              <button onClick={() => onSelect(now.exp)} className="flex-1 text-sm font-medium px-4 py-3 rounded-xl bg-red-600 text-white hover:bg-red-700">KILL</button>
              <button onClick={() => onSelect(now.exp)} className="flex-1 text-sm font-medium px-4 py-3 rounded-xl bg-amber-500 text-white hover:bg-amber-600">Need data</button>
              {!now.exp.shipped_at && (
                <button onClick={() => onShip(now.exp.id)} className="flex-1 text-sm font-medium px-4 py-3 rounded-xl border-2 border-gray-300 text-gray-700 hover:bg-gray-50">Ship it</button>
              )}
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

        <section className="border-t border-gray-200 pt-6 grid grid-cols-4 gap-2 text-xs">
          <div><div className="text-gray-400 uppercase tracking-wide text-[10px]">Today</div><div className="text-lg font-semibold text-gray-900">{velocityToday} started</div></div>
          <div><div className="text-gray-400 uppercase tracking-wide text-[10px]">7d velocity</div><div className="text-lg font-semibold text-gray-900">{velocityWeek}</div></div>
          <div><div className="text-gray-400 uppercase tracking-wide text-[10px]">Avg cycle</div><div className={`text-lg font-semibold ${avgCycleHours != null && avgCycleHours > 48 ? "text-red-600" : "text-gray-900"}`}>{avgCycleHours != null ? `${avgCycleHours}h` : "—"}</div></div>
          <div><div className="text-gray-400 uppercase tracking-wide text-[10px]">Validation rate</div><div className="text-lg font-semibold text-gray-900">{validationRate != null ? `${(validationRate * 100).toFixed(0)}%` : "—"}</div></div>
        </section>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Variant B — Swipe Stack
// Tinder-style. One full-screen experiment at a time. Big action buttons.
// Keyboard: ←=KILL, →=WIN, ↑=Need More, ↓=Skip. Progress bar at top.
// Goal: drive 30 closes in 30 minutes. Maximum signal-to-noise per minute.
// ────────────────────────────────────────────────────────────────────────────

function VariantB(props: Props & { onSelect: (e: Experiment) => void; onShip: (id: string) => void }) {
  const { active, signalsMap, onSelect } = props;
  const live = useMemo(() => active.filter((e) => e.loop_class !== "L0").sort((a, b) => new Date(a.started_at).getTime() - new Date(b.started_at).getTime()), [active]);
  const [idx, setIdx] = useState(0);
  const exp = live[idx];

  function next() { setIdx((i) => Math.min(i + 1, live.length - 1)); }
  function prev() { setIdx((i) => Math.max(0, i - 1)); }
  function openWith() { if (exp) onSelect(exp); }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "ArrowDown" || e.key === " ") { e.preventDefault(); next(); }
      if (e.key === "ArrowUp") { e.preventDefault(); prev(); }
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") return; // reserved for variant switcher
      if (e.key === "Enter") openWith();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const sigs = exp ? (signalsMap[exp.id] ?? []) : [];

  if (!exp) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p className="text-lg">No active experiments.</p>
      </div>
    );
  }

  const ageDays = daysSince(exp.started_at);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Progress */}
      <div className="px-8 pt-8 pb-4">
        <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
          <span>Reviewing {idx + 1} of {live.length}</span>
          <div className="flex items-center gap-2">
            <button onClick={prev} disabled={idx === 0} className="px-2 py-1 rounded border border-gray-700 disabled:opacity-30">↑ prev</button>
            <button onClick={next} disabled={idx === live.length - 1} className="px-2 py-1 rounded border border-gray-700 disabled:opacity-30">↓ skip</button>
          </div>
        </div>
        <div className="h-1 bg-gray-800 rounded overflow-hidden">
          <div className="h-full bg-emerald-400 transition-all" style={{ width: `${((idx + 1) / live.length) * 100}%` }} />
        </div>
      </div>

      {/* Card */}
      <div className="flex-1 flex items-center justify-center px-8 pb-8">
        <div className="w-full max-w-2xl bg-gray-800 rounded-3xl p-10 space-y-6 shadow-2xl">
          <div className="flex items-baseline gap-3 text-xs">
            <code className="font-mono text-gray-500">{exp.id}</code>
            <span className="text-gray-500">running {fmtDays(ageDays)}</span>
            {exp.risk_dimension && <span className="px-2 py-0.5 rounded bg-gray-700 text-gray-200">{exp.risk_dimension}</span>}
            {exp.aarrr_stage && <span className="px-2 py-0.5 rounded bg-gray-700 text-gray-200">{exp.aarrr_stage}</span>}
            {exp.evidence_method && <span className={`px-2 py-0.5 rounded ${exp.evidence_method === "PAY" ? "bg-emerald-500/30 text-emerald-200" : "bg-gray-700 text-gray-200"}`}>{exp.evidence_method}</span>}
            {exp.is_implied && <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-200">IMPLIED</span>}
          </div>

          <p className="text-2xl leading-snug text-white">{exp.hypothesis}</p>

          {(exp.metric || exp.threshold) && (
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-700 text-sm">
              <div><p className="text-[10px] uppercase tracking-wide text-gray-500">Win when</p><p className="text-emerald-300">{exp.metric ?? "—"} ≥ {exp.threshold ?? "—"}</p></div>
              <div><p className="text-[10px] uppercase tracking-wide text-gray-500">Within</p><p className="text-gray-200">{exp.timeframe ?? "—"}</p></div>
              <div><p className="text-[10px] uppercase tracking-wide text-gray-500">Kill if</p><p className="text-red-300">&lt; {exp.kill_threshold ?? "—"}</p></div>
            </div>
          )}

          {sigs.length > 0 && (
            <div className="rounded-lg bg-gray-900/50 p-3 space-y-1 max-h-40 overflow-y-auto">
              <p className="text-[10px] uppercase tracking-wide text-gray-500">Signal trail · {sigs.length}</p>
              {sigs.slice(0, 5).map((s) => (
                <div key={s.id} className="flex items-start gap-2 text-xs text-gray-300">
                  <span className="text-gray-500 shrink-0 font-mono">{new Date(s.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</span>
                  <span className="flex-1">{s.content}</span>
                </div>
              ))}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button onClick={openWith} className="px-6 py-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white text-lg font-semibold">KILL</button>
            <button onClick={openWith} className="px-6 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-lg font-semibold">WIN</button>
            <button onClick={openWith} className="px-6 py-4 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white text-base font-medium">Need More Data</button>
            <button onClick={next} className="px-6 py-4 rounded-2xl border-2 border-gray-700 hover:bg-gray-700 text-gray-300 text-base font-medium">Skip ↓</button>
          </div>

          <p className="text-[10px] text-gray-500 text-center">↑ prev · ↓ skip · Enter = open action panel</p>
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Variant C — Lab Journal
// Reverse-chronological notebook. Each day = one entry. Shows what was
// started, what was closed, what was signaled. Click a day to expand.
// Treats experiments as a research log, not a backlog.
// ────────────────────────────────────────────────────────────────────────────

function VariantC(props: Props & { onSelect: (e: Experiment) => void }) {
  const { all, signalsMap, onSelect } = props;
  const [openDay, setOpenDay] = useState<string | null>(null);

  // Group experiments + signals by date (using started_at, shipped_at as close date)
  const byDay = useMemo(() => {
    type DayActivity = {
      started: Experiment[];
      closed: Experiment[];
      signaled: { exp: Experiment; signal: Signal }[];
    };
    const map: Record<string, DayActivity> = {};
    function key(d: Date | string): string {
      return new Date(d).toISOString().slice(0, 10);
    }
    function bucket(k: string): DayActivity {
      return (map[k] ||= { started: [], closed: [], signaled: [] });
    }
    for (const e of all) {
      bucket(key(e.started_at)).started.push(e);
      if (e.shipped_at && e.outcome !== "in_progress") {
        bucket(key(e.shipped_at)).closed.push(e);
      }
    }
    for (const [expId, sigs] of Object.entries(signalsMap)) {
      const exp = all.find((e) => e.id === expId);
      if (!exp) continue;
      for (const s of sigs) bucket(key(s.created_at)).signaled.push({ exp, signal: s });
    }
    return Object.entries(map).sort((a, b) => b[0].localeCompare(a[0]));
  }, [all, signalsMap]);

  return (
    <div className="min-h-screen bg-amber-50/30">
      <div className="max-w-4xl mx-auto px-8 py-10">
        <header className="mb-8 pb-4 border-b-2 border-gray-900">
          <p className="text-xs uppercase tracking-widest text-gray-500">Lab Journal</p>
          <h1 className="text-4xl font-serif text-gray-900 mt-1">Field notes from running experiments</h1>
          <p className="text-sm text-gray-600 mt-2 italic">Each day is one entry. What was started. What reality said. What you decided.</p>
        </header>

        <div className="relative">
          {/* Vertical timeline line */}
          <div className="absolute left-[12px] top-2 bottom-2 w-0.5 bg-gray-300" />

          <div className="space-y-6">
            {byDay.map(([day, activity]) => {
              const isOpen = day === openDay;
              const total = activity.started.length + activity.closed.length + activity.signaled.length;
              return (
                <article key={day} className="relative pl-10">
                  <div className="absolute left-[6px] top-2 w-4 h-4 rounded-full bg-gray-900 border-4 border-amber-50" />

                  <button
                    onClick={() => setOpenDay(isOpen ? null : day)}
                    className="text-left w-full"
                  >
                    <h2 className="text-lg font-serif text-gray-900">
                      {new Date(day).toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
                    </h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {activity.started.length > 0 && <span>{activity.started.length} started · </span>}
                      {activity.closed.length > 0 && <span className="text-emerald-700">{activity.closed.length} closed · </span>}
                      {activity.signaled.length > 0 && <span className="text-blue-700">{activity.signaled.length} signal{activity.signaled.length === 1 ? "" : "s"} logged</span>}
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
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Switcher
// ────────────────────────────────────────────────────────────────────────────

const VARIANTS = ["A", "B", "C"] as const;
const LABELS: Record<string, string> = {
  A: "A — Daily Standup",
  B: "B — Swipe Stack",
  C: "C — Lab Journal",
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

  return (
    <>
      {props.variant === "A" && <VariantA {...props} onSelect={setSelected} onShip={handleShip} onPromote={handlePromote} />}
      {props.variant === "B" && <VariantB {...props} onSelect={setSelected} onShip={handleShip} />}
      {props.variant === "C" && <VariantC {...props} onSelect={setSelected} />}

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

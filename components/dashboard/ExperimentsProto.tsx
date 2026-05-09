// PROTOTYPE — Experiments dashboard redesign
// Three radically different UI variants on the same data:
//   A — Velocity Cockpit — "What needs my attention today?" (triage / urgency)
//   B — Health Audit     — "What's broken about my discipline?" (diagnostics)
//   C — Learning Map     — "What's the shape of my learning?" (corpus visualization)
// Switchable via ?variant=A|B|C with a floating bottom bar (←/→ keys cycle).
// Throwaway — once a winner is picked, fold it into ExperimentsClient and delete the rest.

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

// ────────────────────────────────────────────────────────────────────────────
// Variant A — Velocity Cockpit
// Mental model: triage inbox. Sorted by urgency. Each experiment has ONE
// next-action button. No section toggles. No tabs. One stream of decisions.
// ────────────────────────────────────────────────────────────────────────────

function VariantA(props: Props & { onSelect: (e: Experiment) => void; onShip: (id: string) => void; onPromote: (id: string) => void }) {
  const { active, drafts, signalsMap, velocityToday, velocityWeek, avgCycleHours, validationRate, onSelect, onShip, onPromote } = props;

  const live = active.filter((e) => e.loop_class !== "L0");
  const enriched = live.map((e) => {
    const sigs = signalsMap[e.id] ?? [];
    const lastSignalDays = sigs.length > 0 ? daysSince(sigs[0].created_at) : Infinity;
    const ageDays = daysSince(e.started_at);
    const shippedDays = e.shipped_at ? daysSince(e.shipped_at) : null;
    return { exp: e, ageDays, lastSignalDays, shippedDays, sigCount: sigs.length };
  });

  const overdue = enriched.filter((x) => x.ageDays > 7).sort((a, b) => b.ageDays - a.ageDays);
  const aging   = enriched.filter((x) => x.ageDays >= 3 && x.ageDays <= 7).sort((a, b) => b.ageDays - a.ageDays);
  const fresh   = enriched.filter((x) => x.ageDays < 3).sort((a, b) => b.ageDays - a.ageDays);
  const silent  = enriched.filter((x) => x.sigCount === 0 && x.ageDays > 2).slice(0, 8);

  function nextAction(x: typeof enriched[0]): { label: string; tone: "red" | "amber" | "blue" | "gray"; kind: "decide" | "ship" | "signal" | "observe" } {
    if (x.ageDays > 7) return { label: "Decide — overdue", tone: "red", kind: "decide" };
    if (!x.exp.shipped_at && x.ageDays > 2) return { label: "Ship it", tone: "amber", kind: "ship" };
    if (x.sigCount === 0 && x.ageDays > 2) return { label: "Log signal", tone: "amber", kind: "signal" };
    if (x.ageDays > 3) return { label: "Decide / log signal", tone: "blue", kind: "decide" };
    return { label: "Observe", tone: "gray", kind: "observe" };
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
        <header className="flex items-baseline justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Velocity Cockpit</h1>
            <p className="text-sm text-gray-500">Sorted by what needs your attention today</p>
          </div>
          <div className="flex gap-3 text-xs">
            <Stat label="started today" value={String(velocityToday)} />
            <Stat label="started 7d" value={String(velocityWeek)} />
            <Stat label="avg cycle" value={avgCycleHours != null ? `${avgCycleHours}h` : "—"} highlight={avgCycleHours != null && avgCycleHours > 48 ? "red" : "gray"} />
            <Stat label="validation rate" value={validationRate != null ? `${(validationRate * 100).toFixed(0)}%` : "—"} />
          </div>
        </header>

        {drafts.length > 0 && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 space-y-2">
            <p className="text-sm font-semibold text-emerald-900">{drafts.length} pending next-bet{drafts.length > 1 ? "s" : ""} need a decision</p>
            {drafts.slice(0, 3).map((d) => (
              <div key={d.id} className="flex items-center gap-2 text-xs">
                <code className="font-mono text-[10px] text-emerald-700 shrink-0 w-20 truncate">{d.id}</code>
                <p className="flex-1 truncate text-gray-800">{d.hypothesis}</p>
                <button onClick={() => onPromote(d.id)} className="px-2 py-0.5 rounded bg-emerald-700 text-white shrink-0">Promote</button>
                <button onClick={() => onSelect(d)} className="px-2 py-0.5 rounded border border-emerald-300 text-emerald-700 shrink-0">Edit</button>
              </div>
            ))}
          </div>
        )}

        <UrgencyBand
          tone="red"
          icon="🔴"
          title={`Decisions overdue · ${overdue.length}`}
          subtitle="Started >7 days ago, no verdict. Per Pinnacle Gecko: 48h decision rule. Kill or close."
          items={overdue.slice(0, 10)}
          nextAction={nextAction}
          onSelect={onSelect}
          onShip={onShip}
        />
        <UrgencyBand
          tone="amber"
          icon="🟡"
          title={`Aging · ${aging.length}`}
          subtitle="3–7 days running. Push toward a verdict before they overdue."
          items={aging.slice(0, 8)}
          nextAction={nextAction}
          onSelect={onSelect}
          onShip={onShip}
        />
        <UrgencyBand
          tone="green"
          icon="🟢"
          title={`Fresh · ${fresh.length}`}
          subtitle="Started in the last 72 hours. Observe; signal speaks soon."
          items={fresh.slice(0, 5)}
          nextAction={nextAction}
          onSelect={onSelect}
          onShip={onShip}
        />

        {silent.length > 0 && (
          <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-700">⚠ Silent · zero signals after 48h ({silent.length})</p>
            <p className="text-xs text-gray-500">No observations logged. Either the test is mis-designed (no measurable signal possible), or you forgot. Decide.</p>
            <ul className="space-y-1 mt-2">
              {silent.map((x) => (
                <li
                  key={x.exp.id}
                  onClick={() => onSelect(x.exp)}
                  className="flex items-center justify-between text-xs cursor-pointer hover:bg-gray-50 -mx-2 px-2 py-1 rounded"
                >
                  <span className="truncate flex-1 text-gray-700">{x.exp.hypothesis.slice(0, 90)}…</span>
                  <span className="text-gray-400 ml-3 shrink-0 font-mono">{fmtDays(x.ageDays)} old</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

interface BandItem { exp: Experiment; ageDays: number; lastSignalDays: number; shippedDays: number | null; sigCount: number; }

function UrgencyBand({ tone, icon, title, subtitle, items, nextAction, onSelect, onShip }: {
  tone: "red" | "amber" | "green";
  icon: string;
  title: string;
  subtitle: string;
  items: BandItem[];
  nextAction: (x: BandItem) => { label: string; tone: "red" | "amber" | "blue" | "gray"; kind: "decide" | "ship" | "signal" | "observe" };
  onSelect: (e: Experiment) => void;
  onShip: (id: string) => void;
}) {
  const bg = tone === "red" ? "bg-red-50 border-red-200" : tone === "amber" ? "bg-amber-50 border-amber-200" : "bg-emerald-50 border-emerald-200";
  return (
    <section className={`rounded-xl border ${bg} p-4`}>
      <div className="flex items-baseline gap-2 mb-3">
        <span>{icon}</span>
        <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
        <p className="text-xs text-gray-500">{subtitle}</p>
      </div>
      {items.length === 0 ? (
        <p className="text-xs text-gray-400 italic">Nothing here.</p>
      ) : (
        <div className="space-y-1.5">
          {items.map((x) => {
            const action = nextAction(x);
            function handleAction(e: React.MouseEvent) {
              e.stopPropagation();
              if (action.kind === "ship") onShip(x.exp.id);
              else onSelect(x.exp); // decide / signal / observe → open modal with full action panel
            }
            return (
              <div
                key={x.exp.id}
                onClick={() => onSelect(x.exp)}
                className="flex items-center gap-3 rounded-lg bg-white px-3 py-2 border border-white cursor-pointer hover:border-gray-300"
              >
                <code className="font-mono text-[10px] text-gray-400 shrink-0 w-20 truncate">{x.exp.id}</code>
                <p className="flex-1 truncate text-xs text-gray-800">{x.exp.hypothesis}</p>
                <div className="flex items-center gap-2 shrink-0 text-[10px] text-gray-500">
                  {x.exp.risk_dimension && <span>{x.exp.risk_dimension}</span>}
                  {x.exp.aarrr_stage && <span>{x.exp.aarrr_stage}</span>}
                  {x.exp.evidence_method && <span className={x.exp.evidence_method === "PAY" ? "text-emerald-700 font-bold" : ""}>{x.exp.evidence_method}</span>}
                </div>
                <span className="text-[10px] font-mono text-gray-400 shrink-0 w-12 text-right">{fmtDays(x.ageDays)}</span>
                <button onClick={handleAction} className={`text-[10px] px-2.5 py-1 rounded font-medium shrink-0 ${
                  action.tone === "red"   ? "bg-red-600 text-white hover:bg-red-700"
                  : action.tone === "amber" ? "bg-amber-500 text-white hover:bg-amber-600"
                  : action.tone === "blue"  ? "bg-blue-600 text-white hover:bg-blue-700"
                                            : "bg-gray-100 text-gray-500"
                }`}>{action.label}</button>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

function Stat({ label, value, highlight }: { label: string; value: string; highlight?: "red" | "gray" }) {
  return (
    <div className="text-right">
      <div className={`font-mono text-base ${highlight === "red" ? "text-red-600" : "text-gray-900"}`}>{value}</div>
      <div className="text-[10px] text-gray-500 uppercase tracking-wide">{label}</div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Variant B — Health Audit
// Mental model: system status page. Big health score. Anti-pattern alerts.
// Distribution charts. Diagnostic, not action-oriented. Use for weekly review.
// ────────────────────────────────────────────────────────────────────────────

function VariantB(props: Props & { onSelect: (e: Experiment) => void }) {
  const { all, signalsMap, onSelect } = props;
  const [filter, setFilter] = useState<{ kind: "all" | "evidence" | "aarrr" | "risk"; value: string } | null>(null);

  const audit = useMemo(() => {
    const live = all.filter((e) => e.loop_class === "L1" || e.loop_class === "L2");
    const closed = live.filter((e) => e.outcome !== "in_progress");
    const total = live.length;

    // Risk dimension distribution
    const riskDist = countBy(live, (e) => e.risk_dimension ?? "—");
    // AARRR distribution
    const aarrrDist = countBy(live, (e) => e.aarrr_stage ?? "—");
    // Evidence method distribution
    const evidenceDist = countBy(live, (e) => e.evidence_method ?? "—");
    // Loop class distribution
    const loopDist = countBy(all, (e) => e.loop_class ?? "—");

    // Anti-pattern checks
    const payCount = (evidenceDist["PAY"] ?? 0);
    const payPct = total > 0 ? (payCount / total) * 100 : 0;
    const retCount = (aarrrDist["RET"] ?? 0);
    const retPct = total > 0 ? (retCount / total) * 100 : 0;
    const refCount = (aarrrDist["REF"] ?? 0);
    const revCount = (aarrrDist["REV"] ?? 0);

    const cycleDays = closed.map((e) =>
      e.shipped_at ? (new Date(e.shipped_at).getTime() - new Date(e.started_at).getTime()) / DAY : null
    ).filter((d): d is number => d != null);
    const avgCycleDays = cycleDays.length > 0 ? cycleDays.reduce((a, b) => a + b, 0) / cycleDays.length : null;

    // Signal-quality check: how many signals are tagged with polarity?
    const allSignals = Object.values(signalsMap).flat();
    const polarityTagged = allSignals.filter((s) => s.polarity).length;
    const polarityPct = allSignals.length > 0 ? (polarityTagged / allSignals.length) * 100 : 0;

    const validated = closed.filter((e) => e.outcome === "validated").length;
    const validationRate = closed.length > 0 ? validated / closed.length : null;

    const alerts: { tone: "red" | "orange" | "yellow"; title: string; detail: string; pinnacleRule: string }[] = [];
    if (payPct < 5 && total > 50) {
      alerts.push({
        tone: "red", title: "Free-first violation",
        detail: `Only ${payCount} of ${total} experiments use PAY (${payPct.toFixed(1)}%) as evidence method.`,
        pinnacleRule: "Marc Lou: 'Sell first. If you can't get one person to commit money in 24h, the problem isn't real.'",
      });
    }
    if (retPct < 3 && total > 50) {
      alerts.push({
        tone: "orange", title: "Funnel hole — retention",
        detail: `Only ${retCount} retention experiments out of ${total} (${retPct.toFixed(1)}%).`,
        pinnacleRule: "AARRR: you're acquiring/activating but not testing whether anyone stays.",
      });
    }
    if (refCount + revCount < 10 && total > 100) {
      alerts.push({
        tone: "orange", title: "No referral or revenue tests",
        detail: `${refCount} REF + ${revCount} REV across ${total} experiments.`,
        pinnacleRule: "Sequoia 'terrifying questions': do users refer? does it monetize?",
      });
    }
    if (avgCycleDays != null && avgCycleDays > 7) {
      alerts.push({
        tone: "yellow", title: "Cycle bloat",
        detail: `Average cycle ${avgCycleDays.toFixed(1)} days. Target <2 days per the protocol.`,
        pinnacleRule: "Sam Altman: 'Iteration cycle every 4 hours, not 4 weeks.'",
      });
    }
    if (allSignals.length > 20 && polarityPct < 20) {
      alerts.push({
        tone: "orange", title: "Confirmation bias risk",
        detail: `${polarityTagged} of ${allSignals.length} signals tagged with polarity (${polarityPct.toFixed(0)}%).`,
        pinnacleRule: "Without disconfirming signals tagged, the corpus drifts toward what you wanted to hear.",
      });
    }

    // Health score: subtract from 100 based on alerts
    const score = Math.max(0, 100 - alerts.reduce((s, a) => s + (a.tone === "red" ? 25 : a.tone === "orange" ? 15 : 8), 0));

    return { riskDist, aarrrDist, evidenceDist, loopDist, alerts, score, total, validationRate };
  }, [all, signalsMap]);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        <header>
          <h1 className="text-2xl font-semibold text-gray-900">Corpus Health Audit</h1>
          <p className="text-sm text-gray-500">Diagnostic view. Built for weekly review, not daily ops.</p>
        </header>

        {/* Health Score */}
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-1 rounded-2xl border border-gray-200 p-6 flex flex-col items-center justify-center">
            <div className={`font-mono text-6xl font-bold ${audit.score < 40 ? "text-red-600" : audit.score < 70 ? "text-amber-600" : "text-emerald-600"}`}>
              {audit.score}
            </div>
            <div className="text-xs uppercase tracking-wider text-gray-500 mt-2">Health score</div>
            <div className="text-[10px] text-gray-400 mt-1">100 − Σ(anti-pattern penalties)</div>
          </div>
          <div className="col-span-2 grid grid-cols-2 gap-3">
            <BigStat label="L1/L2 corpus" value={String(audit.total)} />
            <BigStat label="Validation rate" value={audit.validationRate != null ? `${(audit.validationRate * 100).toFixed(0)}%` : "—"} />
            <BigStat label="PAY evidence %" value={audit.total > 0 ? `${(((audit.evidenceDist["PAY"] ?? 0) / audit.total) * 100).toFixed(1)}%` : "—"} highlight={(((audit.evidenceDist["PAY"] ?? 0) / audit.total) * 100) < 5 ? "red" : "gray"} />
            <BigStat label="RET coverage %" value={audit.total > 0 ? `${(((audit.aarrrDist["RET"] ?? 0) / audit.total) * 100).toFixed(1)}%` : "—"} highlight={(((audit.aarrrDist["RET"] ?? 0) / audit.total) * 100) < 3 ? "orange" : "gray"} />
          </div>
        </div>

        {/* Anti-pattern alerts */}
        {audit.alerts.length > 0 && (
          <section className="space-y-2">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Anti-pattern alerts</h2>
            {audit.alerts.map((a, i) => (
              <div key={i} className={`rounded-lg border p-4 ${
                a.tone === "red"    ? "border-red-300 bg-red-50"
                : a.tone === "orange" ? "border-orange-300 bg-orange-50"
                                      : "border-yellow-300 bg-yellow-50"
              }`}>
                <div className="flex items-baseline justify-between">
                  <h3 className={`text-sm font-semibold ${
                    a.tone === "red" ? "text-red-800" : a.tone === "orange" ? "text-orange-800" : "text-yellow-800"
                  }`}>{a.title}</h3>
                  <span className="text-[10px] uppercase tracking-wide text-gray-500">{a.tone}</span>
                </div>
                <p className="text-sm text-gray-800 mt-1">{a.detail}</p>
                <p className="text-xs text-gray-500 mt-2 italic">{a.pinnacleRule}</p>
              </div>
            ))}
          </section>
        )}

        {/* Distribution charts (click a row → filter the drill-down list below) */}
        <section className="grid grid-cols-2 gap-6">
          <DistributionChart title="Risk dimension" subtitle="Cagan's Four Big Risks · click to filter below" dist={audit.riskDist} colorMap={{ VAL: "emerald", USA: "blue", FEA: "purple", VIA: "amber" }} onClick={(v) => setFilter({ kind: "risk", value: v })} />
          <DistributionChart title="AARRR funnel coverage" subtitle="McClure pirate metrics · click to filter" dist={audit.aarrrDist} colorMap={{ ACQ: "blue", ACT: "emerald", RET: "amber", REF: "purple", REV: "rose" }} onClick={(v) => setFilter({ kind: "aarrr", value: v })} />
          <DistributionChart title="Evidence method" subtitle="Strength: PAY > AB > WOZ > CON > FAK > OBS > INT · click to filter" dist={audit.evidenceDist} colorMap={{ PAY: "emerald", AB: "blue", WOZ: "blue", CON: "amber", FAK: "amber", OBS: "gray", INT: "gray" }} onClick={(v) => setFilter({ kind: "evidence", value: v })} />
          <DistributionChart title="Loop class" subtitle="L1/L2 = falsifiable; L0 = ops" dist={audit.loopDist} colorMap={{ L1: "emerald", L2: "blue", L0: "gray" }} />
        </section>

        {/* Drill-down list — appears when a chart segment is clicked */}
        {filter && (
          <section className="rounded-xl border border-gray-200 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-700">
                {filter.kind} = {filter.value}
                {" · "}
                {all.filter((e) => {
                  if (filter.kind === "risk") return e.risk_dimension === filter.value;
                  if (filter.kind === "aarrr") return e.aarrr_stage === filter.value;
                  if (filter.kind === "evidence") return e.evidence_method === filter.value;
                  return true;
                }).length} experiments
              </h3>
              <button onClick={() => setFilter(null)} className="text-xs text-gray-400">clear filter ✕</button>
            </div>
            <div className="space-y-1 max-h-80 overflow-y-auto">
              {all
                .filter((e) => {
                  if (e.loop_class === "L0") return false;
                  if (filter.kind === "risk") return e.risk_dimension === filter.value;
                  if (filter.kind === "aarrr") return e.aarrr_stage === filter.value;
                  if (filter.kind === "evidence") return e.evidence_method === filter.value;
                  return true;
                })
                .slice(0, 30)
                .map((e) => (
                  <div
                    key={e.id}
                    onClick={() => onSelect(e)}
                    className="flex items-center gap-3 px-2 py-1.5 rounded hover:bg-gray-50 cursor-pointer text-xs"
                  >
                    <code className="font-mono text-[10px] text-gray-400 shrink-0 w-20 truncate">{e.id}</code>
                    <p className="flex-1 truncate text-gray-800">{e.hypothesis}</p>
                    <span className="text-gray-400 shrink-0">{e.outcome}</span>
                  </div>
                ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function BigStat({ label, value, highlight }: { label: string; value: string; highlight?: "red" | "orange" | "gray" }) {
  return (
    <div className="rounded-xl border border-gray-200 p-4">
      <div className={`font-mono text-2xl ${
        highlight === "red" ? "text-red-600" : highlight === "orange" ? "text-orange-600" : "text-gray-900"
      }`}>{value}</div>
      <div className="text-[10px] uppercase tracking-wide text-gray-500 mt-1">{label}</div>
    </div>
  );
}

function DistributionChart({ title, subtitle, dist, colorMap, onClick }: {
  title: string; subtitle: string;
  dist: Record<string, number>;
  colorMap: Record<string, string>;
  onClick?: (key: string) => void;
}) {
  const entries = Object.entries(dist).sort((a, b) => b[1] - a[1]);
  const max = Math.max(1, ...entries.map(([, n]) => n));
  return (
    <div className="rounded-xl border border-gray-200 p-4">
      <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">{title}</h3>
      <p className="text-[10px] text-gray-500 mb-3">{subtitle}</p>
      <div className="space-y-1.5">
        {entries.map(([k, n]) => {
          const pct = (n / max) * 100;
          const color = colorMap[k] ?? "gray";
          return (
            <div
              key={k}
              onClick={onClick ? () => onClick(k) : undefined}
              className={`flex items-center gap-2 text-xs ${onClick ? "cursor-pointer hover:bg-gray-50 -mx-2 px-2 py-0.5 rounded" : ""}`}
            >
              <span className="w-12 font-mono text-gray-700">{k}</span>
              <div className="flex-1 h-4 bg-gray-100 rounded overflow-hidden">
                <div className={`h-full bg-${color}-400`} style={{ width: `${pct}%` }} />
              </div>
              <span className="w-10 text-right font-mono text-gray-500">{n}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function countBy<T>(arr: T[], key: (x: T) => string): Record<string, number> {
  const out: Record<string, number> = {};
  for (const x of arr) out[key(x)] = (out[key(x)] ?? 0) + 1;
  return out;
}

// ────────────────────────────────────────────────────────────────────────────
// Variant C — Learning Map
// Mental model: a metro map of your hypotheses. Cluster by project. Within
// each cluster, color by AARRR, size by confidence. next_bet_id chains as
// bold lines between nodes. Reveals "what compounds" vs "where you're stuck".
// ────────────────────────────────────────────────────────────────────────────

function VariantC(props: Props & { onSelect: (e: Experiment) => void }) {
  const { all, onSelect } = props;
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  const byProject = useMemo(() => {
    const live = all.filter((e) => e.loop_class === "L1" || e.loop_class === "L2");
    const groups: Record<string, Experiment[]> = {};
    for (const e of live) {
      const p = e.project_tag ?? "(untagged)";
      (groups[p] ||= []).push(e);
    }
    return Object.entries(groups).sort((a, b) => b[1].length - a[1].length);
  }, [all]);

  const chains = useMemo(() => {
    const nextById = new Map<string, string>();
    const parentsById = new Map<string, string>();
    for (const e of all) {
      if (e.next_bet_id) nextById.set(e.id, e.next_bet_id);
      if (e.parent_experiment_id) parentsById.set(e.id, e.parent_experiment_id);
    }
    // Find chain starts (no parent) and walk forward
    const chains: string[][] = [];
    const visited = new Set<string>();
    for (const e of all) {
      if (e.parent_experiment_id) continue; // not a head
      if (visited.has(e.id)) continue;
      const chain = [e.id];
      visited.add(e.id);
      let cur = e.id;
      while (nextById.has(cur)) {
        const next = nextById.get(cur)!;
        if (visited.has(next)) break;
        chain.push(next);
        visited.add(next);
        cur = next;
      }
      if (chain.length > 1) chains.push(chain);
    }
    return chains.sort((a, b) => b.length - a.length);
  }, [all]);

  const orphanCount = byProject.reduce((s, [, exps]) => s + exps.length, 0) - chains.flat().length;

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        <header className="flex items-baseline justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Learning Map</h1>
            <p className="text-sm text-gray-500">Cluster by project · color by AARRR stage · chains show what compounds</p>
          </div>
          <div className="flex gap-4 text-xs text-gray-600">
            <span><strong className="text-gray-900">{byProject.length}</strong> projects</span>
            <span><strong className="text-gray-900">{chains.length}</strong> chains</span>
            <span><strong className="text-gray-900">{orphanCount}</strong> orphans</span>
          </div>
        </header>

        {/* Compounding chains — the most valuable view */}
        {chains.length > 0 ? (
          <section className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-5">
            <h2 className="text-sm font-semibold text-emerald-900 mb-3">Compounding chains — click any node to act on it</h2>
            <div className="space-y-3">
              {chains.slice(0, 8).map((ids, idx) => (
                <ChainView key={idx} ids={ids} all={all} onSelect={onSelect} />
              ))}
            </div>
          </section>
        ) : (
          <section className="rounded-2xl border-2 border-dashed border-gray-200 p-8 text-center">
            <p className="text-sm font-medium text-gray-700">No chains yet</p>
            <p className="text-xs text-gray-500 mt-1">Chains form when you close an experiment via the Axis 7 wizard with implication PERSEVERE / PIVOT / DOUBLE-DOWN. The auto-spawned next-bet draft becomes the chain's next link.</p>
          </section>
        )}

        {/* Project clusters — orphans + their AARRR coverage */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Project clusters · click to drill into experiments</h2>
          <div className="grid grid-cols-2 gap-4">
            {byProject.map(([project, exps]) => (
              <ProjectCluster
                key={project}
                project={project}
                experiments={exps}
                onClick={() => setSelectedProject(project === selectedProject ? null : project)}
                selected={project === selectedProject}
              />
            ))}
          </div>
        </section>

        {selectedProject && (
          <section className="rounded-xl border border-gray-200 bg-white p-4 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-700">{selectedProject} · click an experiment to act on it</h3>
              <button onClick={() => setSelectedProject(null)} className="text-xs text-gray-400">close</button>
            </div>
            <div className="space-y-1 max-h-96 overflow-y-auto">
              {(byProject.find(([p]) => p === selectedProject)?.[1] ?? []).slice(0, 50).map((e) => (
                <div
                  key={e.id}
                  onClick={() => onSelect(e)}
                  className="flex items-center gap-3 px-2 py-1.5 rounded hover:bg-gray-50 cursor-pointer text-xs"
                >
                  <code className="font-mono text-[10px] text-gray-400 shrink-0 w-20 truncate">{e.id}</code>
                  <p className="flex-1 truncate text-gray-800">{e.hypothesis}</p>
                  <span className="text-gray-400 shrink-0">{e.outcome}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function ChainView({ ids, all, onSelect }: { ids: string[]; all: Experiment[]; onSelect: (e: Experiment) => void }) {
  const byId = new Map(all.map((e) => [e.id, e]));
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2">
      {ids.map((id, i) => {
        const e = byId.get(id);
        if (!e) return null;
        const tone =
          e.outcome === "validated" ? "border-emerald-400 bg-emerald-100"
          : e.outcome === "refuted"  ? "border-red-300 bg-red-50"
          : e.outcome === "inconclusive" ? "border-amber-300 bg-amber-50"
          :                                "border-blue-200 bg-blue-50";
        return (
          <div key={id} className="flex items-center gap-2 shrink-0">
            <div
              onClick={() => onSelect(e)}
              className={`shrink-0 rounded-lg border-2 ${tone} p-2 min-w-[200px] max-w-[260px] cursor-pointer hover:shadow-md`}
            >
              <code className="text-[10px] font-mono text-gray-500">{e.id}</code>
              <p className="text-[11px] text-gray-800 mt-1 line-clamp-3">{e.hypothesis.slice(0, 140)}…</p>
              <div className="flex gap-1 mt-1.5 text-[9px]">
                {e.implication && <span className="px-1 py-0.5 rounded bg-white text-gray-700 border border-gray-200">{e.implication}</span>}
                {e.confidence && <span className="px-1 py-0.5 rounded bg-white text-gray-600 border border-gray-200">conf: {e.confidence}</span>}
                {e.pivot_type && <span className="px-1 py-0.5 rounded bg-purple-100 text-purple-800">pivot: {e.pivot_type}</span>}
              </div>
            </div>
            {i < ids.length - 1 && <span className="text-2xl text-gray-400 shrink-0">→</span>}
          </div>
        );
      })}
    </div>
  );
}

function ProjectCluster({ project, experiments, onClick, selected }: { project: string; experiments: Experiment[]; onClick: () => void; selected: boolean }) {
  const aarrrByStage: Record<string, number> = {};
  const validated = experiments.filter((e) => e.outcome === "validated").length;
  const refuted = experiments.filter((e) => e.outcome === "refuted").length;
  const inProgress = experiments.filter((e) => e.outcome === "in_progress").length;
  for (const e of experiments) {
    const k = e.aarrr_stage ?? "—";
    aarrrByStage[k] = (aarrrByStage[k] ?? 0) + 1;
  }
  const stages = ["ACQ", "ACT", "RET", "REF", "REV"];
  return (
    <div
      onClick={onClick}
      className={`rounded-xl border bg-white p-4 space-y-3 cursor-pointer transition-shadow hover:shadow-md ${selected ? "border-emerald-500 ring-2 ring-emerald-200" : "border-gray-200"}`}
    >
      <div className="flex items-baseline justify-between">
        <h3 className="text-sm font-semibold text-gray-900 truncate">{project}</h3>
        <span className="text-xs text-gray-500 shrink-0 ml-2">{experiments.length}</span>
      </div>
      <div className="flex items-end gap-1 h-12">
        {stages.map((s) => {
          const n = aarrrByStage[s] ?? 0;
          const pct = experiments.length > 0 ? (n / experiments.length) * 100 : 0;
          const hue = s === "ACQ" ? "blue" : s === "ACT" ? "emerald" : s === "RET" ? "amber" : s === "REF" ? "purple" : "rose";
          return (
            <div key={s} className="flex-1 flex flex-col items-center gap-1">
              <div className={`w-full bg-${hue}-200 rounded-t`} style={{ height: `${Math.max(pct, n > 0 ? 8 : 0)}%` }} title={`${s}: ${n}`} />
              <span className="text-[9px] text-gray-500 font-mono">{s}</span>
              <span className="text-[10px] text-gray-700 font-semibold">{n}</span>
            </div>
          );
        })}
      </div>
      <div className="flex items-center gap-3 text-[11px]">
        <span className="text-emerald-700">✓ {validated}</span>
        <span className="text-red-600">✗ {refuted}</span>
        <span className="text-blue-600">↻ {inProgress}</span>
        {experiments.length > 0 && (
          <span className="ml-auto text-gray-500">
            validation rate {validated + refuted > 0 ? `${Math.round((validated / (validated + refuted)) * 100)}%` : "—"}
          </span>
        )}
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Switcher
// ────────────────────────────────────────────────────────────────────────────

const VARIANTS = ["A", "B", "C"] as const;
const LABELS: Record<string, string> = {
  A: "A — Velocity Cockpit",
  B: "B — Health Audit",
  C: "C — Learning Map",
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

  // Switcher visible in prod too — this dashboard is owner-only, no leak risk.
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

  // When user takes an action inside the modal, close it and re-fetch the page data
  function onModalAction() {
    refresh();
    // Don't auto-close — wizard flows like WIN/KILL involve sub-steps; user closes manually
  }

  return (
    <>
      {props.variant === "A" && <VariantA {...props} onSelect={setSelected} onShip={handleShip} onPromote={handlePromote} />}
      {props.variant === "B" && <VariantB {...props} onSelect={setSelected} />}
      {props.variant === "C" && <VariantC {...props} onSelect={setSelected} />}

      {selected && (
        <div
          className="fixed inset-0 z-40 bg-black/40 flex items-start justify-center p-6 overflow-y-auto"
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
              onAction={onModalAction}
            />
          </div>
        </div>
      )}

      <PrototypeSwitcher variant={props.variant} />
    </>
  );
}

"use client";

import { useState, useTransition } from "react";
import type { Experiment } from "@/lib/learning/ghost-db";


// Validated Learning Taxonomy options
const RISK_DIMENSIONS = [
  { v: "VAL", label: "Value — will customers buy/use it?" },
  { v: "USA", label: "Usability — can users figure it out?" },
  { v: "FEA", label: "Feasibility — can we build/operate it?" },
  { v: "VIA", label: "Viability — does it work for the business?" },
] as const;

const HYPOTHESIS_CLASSES = [
  { v: "VAL-H", label: "Value hypothesis (does the product deliver value?)" },
  { v: "GRO-H", label: "Growth hypothesis (how do new users discover it?)" },
] as const;

const AARRR_STAGES_V2 = [
  { v: "ACQ", label: "Acquisition" },
  { v: "ACT", label: "Activation" },
  { v: "RET", label: "Retention" },
  { v: "REF", label: "Referral" },
  { v: "REV", label: "Revenue" },
] as const;

const EVIDENCE_METHODS = [
  { v: "INT", label: "INT — Customer interview" },
  { v: "OBS", label: "OBS — Observation / session replay" },
  { v: "FAK", label: "FAK — Fake door / smoke test" },
  { v: "CON", label: "CON — Concierge MVP" },
  { v: "WOZ", label: "WOZ — Wizard of Oz" },
  { v: "AB",  label: "AB  — A/B test" },
  { v: "PAY", label: "PAY — Real payment / pre-order (strongest)" },
] as const;

interface BacklogItem { title: string; project: string; type: string; priority: string; }
interface ScrumReport { yesterday: string[]; today: string[]; blockers: string[]; backlog: BacklogItem[]; }

function verdictColor(verdict: string | null, outcome: string): string {
  const v = verdict ?? outcome;
  if (v === "win" || v === "validated") return "text-green-600";
  if (v === "kill" || v === "refuted") return "text-red-500";
  if (v === "need_more_data" || v === "inconclusive") return "text-yellow-500";
  return "text-blue-500";
}

function verdictLabel(verdict: string | null, outcome: string, shippedAt: Date | null): string {
  const v = verdict ?? outcome;
  if (v === "win") return "WIN";
  if (v === "kill") return "KILL";
  if (v === "need_more_data") return "need more data";
  if (v === "validated") return "WIN";
  if (v === "refuted") return "KILL";
  if (v === "inconclusive") return "need more data";
  if (shippedAt) return "shipped";
  return "in progress";
}

function ExperimentCard({ exp, onAction }: { exp: Experiment; onAction: () => void }) {
  const [isPending, startTransition] = useTransition();
  const [showWin, setShowWin] = useState(false);
  const [showKill, setShowKill] = useState(false);
  const [learning, setLearning] = useState("");

  const isActive = exp.outcome === "in_progress";

  async function patch(action: string, learning?: string) {
    await fetch(`/api/experiments/${exp.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, learning }),
    });
    onAction();
  }

  function handle(action: string, learning?: string) {
    startTransition(() => { patch(action, learning); });
  }

  return (
    <div className={`rounded-xl border p-4 space-y-2 ${isPending ? "opacity-60" : ""} ${!isActive ? "border-gray-100 bg-gray-50" : "border-gray-200"}`}>
      {exp.parent_experiment_id && (
        <p className="text-xs text-gray-400">↑ continues <code className="font-mono">{exp.parent_experiment_id}</code></p>
      )}

      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900">{exp.hypothesis}</p>
          <p className="text-xs text-gray-400 mt-1 flex flex-wrap items-center gap-x-1 gap-y-0">
            <code className="font-mono">{exp.id}</code>
            {exp.loop_class && (
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                exp.loop_class === "L1" ? "bg-emerald-100 text-emerald-700"
                : exp.loop_class === "L2" ? "bg-blue-100 text-blue-700"
                : "bg-gray-100 text-gray-500"
              }`}>{exp.loop_class}</span>
            )}
            {exp.risk_dimension && <span>· {exp.risk_dimension}</span>}
            {exp.hypothesis_class && <span>· {exp.hypothesis_class}</span>}
            {exp.aarrr_stage && exp.aarrr_stage !== "none" && exp.aarrr_stage !== "NON" && <span>· {exp.aarrr_stage}</span>}
            {exp.evidence_method && <span>· {exp.evidence_method}</span>}
            {exp.project_tag && <span>· {exp.project_tag}</span>}
            <span>· {new Date(exp.started_at).toLocaleDateString()}</span>
          </p>
          {exp.loop_class && exp.loop_class !== "L0" && exp.threshold && (
            <p className="text-[11px] text-gray-500 mt-1">
              <span className="font-medium">Win:</span> {exp.metric} ≥ {exp.threshold} within {exp.timeframe}
              {exp.kill_threshold && <span className="text-red-500"> · Kill if &lt; {exp.kill_threshold}</span>}
            </p>
          )}
          {exp.success_criteria && (
            <p className="text-xs text-gray-500 mt-1 italic">Win when: {exp.success_criteria}</p>
          )}
          {exp.learning && (
            <p className="text-xs text-gray-600 mt-1">"{exp.learning}"</p>
          )}
        </div>
        <span className={`text-xs font-semibold shrink-0 ${verdictColor(exp.verdict, exp.outcome)}`}>
          {verdictLabel(exp.verdict, exp.outcome, exp.shipped_at)}
        </span>
      </div>

      {isActive && (
        <div className="flex flex-wrap gap-2 pt-1">
          {!exp.shipped_at && (
            <button
              onClick={() => handle("ship")}
              className="text-xs px-2 py-1 rounded border border-gray-200 text-gray-600 hover:bg-gray-50"
            >
              Mark Shipped
            </button>
          )}
          <button
            onClick={() => { setShowWin(true); setShowKill(false); }}
            className="text-xs px-2 py-1 rounded border border-green-200 text-green-700 hover:bg-green-50"
          >
            WIN
          </button>
          <button
            onClick={() => { setShowKill(true); setShowWin(false); }}
            className="text-xs px-2 py-1 rounded border border-red-200 text-red-600 hover:bg-red-50"
          >
            KILL
          </button>
          <button
            onClick={() => handle("more")}
            className="text-xs px-2 py-1 rounded border border-yellow-200 text-yellow-700 hover:bg-yellow-50"
          >
            Need More Data
          </button>
        </div>
      )}

      {(showWin || showKill) && (
        <div className="pt-1 space-y-2">
          <textarea
            value={learning}
            onChange={(e) => setLearning(e.target.value)}
            placeholder="What did you learn? (required)"
            rows={2}
            className="w-full text-xs border border-gray-200 rounded px-2 py-1.5 resize-none focus:outline-none focus:ring-1 focus:ring-gray-300"
          />
          <div className="flex gap-2">
            <button
              disabled={!learning.trim()}
              onClick={() => { handle(showWin ? "win" : "kill", learning); setShowWin(false); setShowKill(false); }}
              className="text-xs px-3 py-1 rounded bg-gray-900 text-white disabled:opacity-40"
            >
              Confirm {showWin ? "WIN" : "KILL"}
            </button>
            <button
              onClick={() => { setShowWin(false); setShowKill(false); setLearning(""); }}
              className="text-xs px-3 py-1 rounded border border-gray-200 text-gray-500"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

interface RecentLearning {
  date: string;
  territory: string | null;
  raw_synthesis: string | null;
  velocity_week: number | null;
  avg_cycle_hours: number | null;
  validation_rate: number | null;
  next_implied_hypothesis: string | null;
}

function formatHours(h: number | null): string {
  if (h == null) return "—";
  if (h < 1) return `${Math.round(h * 60)}m`;
  return `${h}h`;
}

function formatRate(r: number | null): string {
  if (r == null) return "—";
  return `${(r * 100).toFixed(0)}%`;
}

export function ExperimentsClient({
  initialActive,
  initialClosed,
  learnings,
  velocityToday,
  velocityWeek,
  avgCycleHours,
  validationRate,
}: {
  initialActive: Experiment[];
  initialClosed: Experiment[];
  learnings: RecentLearning[];
  velocityToday: number;
  velocityWeek: number;
  avgCycleHours: number | null;
  validationRate: number | null;
}) {
  const [active, setActive] = useState(initialActive);
  const [isStarting, startTransition] = useTransition();
  const [startupFilter, setStartupFilter] = useState<string | null>(null);
  const [report, setReport] = useState<ScrumReport | null>(null);
  const [reportOpen, setReportOpen] = useState(false);
  const [isGenerating, startReportTransition] = useTransition();

  const allExperiments = [...active, ...initialClosed];
  const startups = Array.from(new Set(allExperiments.map((e) => e.project_tag).filter(Boolean))) as string[];

  const filteredActive = startupFilter ? active.filter((e) => e.project_tag === startupFilter) : active;
  const filteredClosed = startupFilter ? initialClosed.filter((e) => e.project_tag === startupFilter) : initialClosed;

  // Validated Learning Taxonomy form state
  const [loopClass, setLoopClass] = useState<"L0" | "L1" | "L2">("L1");
  const [riskDim, setRiskDim] = useState<string>("");
  const [hypClass, setHypClass] = useState<string>("");
  const [aarrrV2, setAarrrV2] = useState<string>("");
  const [evidenceMethod, setEvidenceMethod] = useState<string>("");
  const [segment, setSegment] = useState("");
  const [behavior, setBehavior] = useState("");
  const [metric, setMetric] = useState("");
  const [threshold, setThreshold] = useState("");
  const [timeframe, setTimeframe] = useState("");
  const [killThreshold, setKillThreshold] = useState("");
  const [l0Description, setL0Description] = useState("");
  const [formError, setFormError] = useState("");

  function resetForm() {
    setLoopClass("L1");
    setRiskDim(""); setHypClass(""); setAarrrV2(""); setEvidenceMethod("");
    setSegment(""); setBehavior(""); setMetric(""); setThreshold("");
    setTimeframe(""); setKillThreshold(""); setL0Description("");
    setFormError("");
  }

  // Falsifiability gate: Run button enabled only when all required slots are filled
  const l0Ready = loopClass === "L0" && l0Description.trim().length > 0;
  const l1l2Ready =
    (loopClass === "L1" || loopClass === "L2") &&
    riskDim && aarrrV2 && evidenceMethod &&
    segment.trim() && behavior.trim() && metric.trim() &&
    threshold.trim() && timeframe.trim() && killThreshold.trim() &&
    (loopClass === "L2" || hypClass !== "");
  const canRun = l0Ready || l1l2Ready;

  function buildHypothesisStatement(): string {
    if (loopClass === "L0") return l0Description.trim();
    return `We believe that ${behavior.trim()} for ${segment.trim()} measured by ${metric.trim()} hitting ${threshold.trim()} within ${timeframe.trim()}. Kill if below ${killThreshold.trim()}.`;
  }

  async function startExperiment(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    if (!canRun) { setFormError("Fill every required slot to run an experiment."); return; }

    startTransition(async () => {
      const payload = loopClass === "L0"
        ? { loop_class: "L0", hypothesis: l0Description.trim() }
        : {
            loop_class: loopClass,
            hypothesis: buildHypothesisStatement(),
            risk_dimension: riskDim,
            hypothesis_class: loopClass === "L1" ? hypClass : undefined,
            aarrr_stage: aarrrV2,
            evidence_method: evidenceMethod,
            segment: segment.trim(),
            behavior: behavior.trim(),
            metric: metric.trim(),
            threshold: threshold.trim(),
            timeframe: timeframe.trim(),
            kill_threshold: killThreshold.trim(),
          };
      const res = await fetch("/api/experiments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        resetForm();
        await refreshActive();
      } else {
        const err = await res.json();
        setFormError(err.error ?? "Failed to create experiment.");
      }
    });
  }

  function generateReport() {
    startReportTransition(async () => {
      const res = await fetch("/api/experiments/daily-report", { method: "POST" });
      if (res.ok) {
        setReport(await res.json());
        setReportOpen(true);
      }
    });
  }

  async function refreshActive() {
    const res = await fetch("/api/experiments");
    if (res.ok) {
      const data = await res.json();
      setActive(data);
    }
  }

  return (
    <div className="space-y-10">
      {/* Daily Report button */}
      <div className="flex justify-end">
        <button
          onClick={generateReport}
          disabled={isGenerating}
          className="text-sm px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          {isGenerating ? "Generating…" : "Daily Report"}
        </button>
      </div>

      {/* Velocity */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Today", value: velocityToday },
          { label: "This week", value: velocityWeek },
          { label: "Avg cycle", value: formatHours(avgCycleHours) },
          { label: "Validation rate", value: formatRate(validationRate) },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-xl border border-gray-200 p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">{value}</div>
            <div className="text-xs text-gray-500 mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* Daily Report panel */}
      {reportOpen && report && (
        <div className="rounded-xl border border-blue-100 bg-blue-50 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-blue-900">
              Daily Scrum &mdash; {new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
            </h2>
            <button
              onClick={() => setReportOpen(false)}
              className="text-xs text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          <section>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Yesterday</h3>
            <ul className="space-y-1">
              {report.yesterday.map((item, i) => (
                <li key={i} className="text-sm text-gray-700">• {item}</li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Today</h3>
            <ul className="space-y-1">
              {report.today.map((item, i) => (
                <li key={i} className="text-sm text-gray-700">• {item}</li>
              ))}
            </ul>
          </section>

          {report.blockers.length > 0 && (
            <section>
              <h3 className="text-xs font-semibold text-red-500 uppercase tracking-wide mb-1">Blockers</h3>
              <ul className="space-y-1">
                {report.blockers.map((item, i) => (
                  <li key={i} className="text-sm text-red-700">• {item}</li>
                ))}
              </ul>
            </section>
          )}

          <section>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Backlog</h3>
            <div className="space-y-2">
              {report.backlog.map((item, i) => (
                <div key={i} className="flex items-start gap-2 text-sm">
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded font-medium shrink-0 ${
                      item.priority === "high"
                        ? "bg-red-100 text-red-700"
                        : item.priority === "medium"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {item.priority}
                  </span>
                  <span className="text-gray-700 flex-1">{item.title}</span>
                  <span className="text-xs text-gray-400 shrink-0">{item.project} · {item.type}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* Start experiment form — Validated Learning Taxonomy gate */}
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-3">Start an experiment</h2>
        <form onSubmit={startExperiment} className="space-y-4 rounded-xl border border-gray-200 p-5">
          {/* Loop class selector */}
          <div>
            <label className="text-xs text-gray-500 block mb-2">Loop class</label>
            <div className="grid grid-cols-3 gap-2">
              {(["L0", "L1", "L2"] as const).map((lc) => (
                <button
                  key={lc}
                  type="button"
                  onClick={() => setLoopClass(lc)}
                  className={`text-xs px-3 py-2 rounded border text-left ${
                    loopClass === lc
                      ? "border-gray-900 bg-gray-900 text-white"
                      : "border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <div className="font-semibold">{lc}</div>
                  <div className="text-[10px] mt-0.5 opacity-80">
                    {lc === "L0" && "Ops fix · no falsifiability"}
                    {lc === "L1" && "Discovery · tests a belief"}
                    {lc === "L2" && "Optimization · A/B test"}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {loopClass === "L0" ? (
            <div>
              <label className="text-xs text-gray-500 block mb-1">What was fixed/built? (no falsifiability gate)</label>
              <textarea
                value={l0Description}
                onChange={(e) => setL0Description(e.target.value)}
                placeholder="Reinstalled @vercel/blob and confirmed handleUpload returns valid JSON"
                rows={2}
                className="w-full text-sm border border-gray-200 rounded px-3 py-2 resize-none focus:outline-none focus:ring-1 focus:ring-gray-300"
              />
              <p className="text-[10px] text-gray-400 mt-1">
                L0 entries are tracked but excluded from the validated-learning corpus.
              </p>
            </div>
          ) : (
            <>
              {/* Classification */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Risk dimension <span className="text-red-400">*</span></label>
                  <select
                    value={riskDim}
                    onChange={(e) => setRiskDim(e.target.value)}
                    className="w-full text-sm border border-gray-200 rounded px-2 py-1.5 focus:outline-none"
                  >
                    <option value="">— select —</option>
                    {RISK_DIMENSIONS.map((r) => <option key={r.v} value={r.v}>{r.label}</option>)}
                  </select>
                </div>
                {loopClass === "L1" && (
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">Hypothesis class <span className="text-red-400">*</span></label>
                    <select
                      value={hypClass}
                      onChange={(e) => setHypClass(e.target.value)}
                      className="w-full text-sm border border-gray-200 rounded px-2 py-1.5 focus:outline-none"
                    >
                      <option value="">— select —</option>
                      {HYPOTHESIS_CLASSES.map((h) => <option key={h.v} value={h.v}>{h.label}</option>)}
                    </select>
                  </div>
                )}
                <div>
                  <label className="text-xs text-gray-500 block mb-1">AARRR stage <span className="text-red-400">*</span></label>
                  <select
                    value={aarrrV2}
                    onChange={(e) => setAarrrV2(e.target.value)}
                    className="w-full text-sm border border-gray-200 rounded px-2 py-1.5 focus:outline-none"
                  >
                    <option value="">— select —</option>
                    {AARRR_STAGES_V2.map((a) => <option key={a.v} value={a.v}>{a.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Evidence method <span className="text-red-400">*</span></label>
                  <select
                    value={evidenceMethod}
                    onChange={(e) => setEvidenceMethod(e.target.value)}
                    className="w-full text-sm border border-gray-200 rounded px-2 py-1.5 focus:outline-none"
                  >
                    <option value="">— select —</option>
                    {EVIDENCE_METHODS.map((m) => <option key={m.v} value={m.v}>{m.label}</option>)}
                  </select>
                </div>
              </div>

              {/* 6-slot falsifiability gate */}
              <div className="rounded-lg bg-gray-50 border border-gray-200 p-3 space-y-2">
                <p className="text-[11px] font-semibold text-gray-700 uppercase tracking-wide">
                  Falsifiable hypothesis · all slots required
                </p>
                <div className="grid grid-cols-1 gap-2 text-sm">
                  <div className="flex items-baseline gap-2">
                    <span className="text-gray-500 text-xs w-32 shrink-0">We believe that</span>
                    <input
                      value={behavior}
                      onChange={(e) => setBehavior(e.target.value)}
                      placeholder="users will pay for a Stripe checkout link"
                      className="flex-1 text-sm border border-gray-200 rounded px-2 py-1 bg-white"
                    />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-gray-500 text-xs w-32 shrink-0">for</span>
                    <input
                      value={segment}
                      onChange={(e) => setSegment(e.target.value)}
                      placeholder="early-stage AI founders in unifounder ICP"
                      className="flex-1 text-sm border border-gray-200 rounded px-2 py-1 bg-white"
                    />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-gray-500 text-xs w-32 shrink-0">measured by</span>
                    <input
                      value={metric}
                      onChange={(e) => setMetric(e.target.value)}
                      placeholder="paid Stripe checkouts completed"
                      className="flex-1 text-sm border border-gray-200 rounded px-2 py-1 bg-white"
                    />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-gray-500 text-xs w-32 shrink-0">hitting</span>
                    <input
                      value={threshold}
                      onChange={(e) => setThreshold(e.target.value)}
                      placeholder="≥ 3"
                      className="flex-1 text-sm border border-gray-200 rounded px-2 py-1 bg-white"
                    />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-gray-500 text-xs w-32 shrink-0">within</span>
                    <input
                      value={timeframe}
                      onChange={(e) => setTimeframe(e.target.value)}
                      placeholder="48 hours"
                      className="flex-1 text-sm border border-gray-200 rounded px-2 py-1 bg-white"
                    />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-red-500 text-xs w-32 shrink-0">Kill if below</span>
                    <input
                      value={killThreshold}
                      onChange={(e) => setKillThreshold(e.target.value)}
                      placeholder="1 (by hour 24)"
                      className="flex-1 text-sm border border-red-200 rounded px-2 py-1 bg-white"
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {formError && <p className="text-xs text-red-500">{formError}</p>}

          <div className="flex items-center justify-between pt-1">
            <p className="text-[10px] text-gray-400">
              {loopClass === "L0"
                ? "L0 = ops fix. Ships fast, no learning extraction."
                : `${loopClass} = falsifiability gate enforced. ${canRun ? "All slots filled — ready to run." : "Run button enabled when every slot is filled."}`}
            </p>
            <button
              type="submit"
              disabled={!canRun || isStarting}
              className="text-sm px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {isStarting ? "Starting…" : "Run experiment"}
            </button>
          </div>
        </form>
      </div>

      {/* Startup filter tabs */}
      {startups.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setStartupFilter(null)}
            className={`text-xs px-3 py-1 rounded-full border ${!startupFilter ? "bg-gray-900 text-white border-gray-900" : "border-gray-200 text-gray-500 hover:bg-gray-50"}`}
          >
            All
          </button>
          {startups.map((s) => (
            <button
              key={s}
              onClick={() => setStartupFilter(startupFilter === s ? null : s)}
              className={`text-xs px-3 py-1 rounded-full border ${startupFilter === s ? "bg-gray-900 text-white border-gray-900" : "border-gray-200 text-gray-500 hover:bg-gray-50"}`}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Active experiments */}
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-3">
          Active experiments ({filteredActive.filter((e) => e.outcome === "in_progress").length})
        </h2>
        {filteredActive.length === 0 ? (
          <p className="text-sm text-gray-400 italic">No active experiments yet.</p>
        ) : (
          <div className="space-y-3">
            {filteredActive.map((exp) => (
              <ExperimentCard key={exp.id} exp={exp} onAction={refreshActive} />
            ))}
          </div>
        )}
      </div>

      {/* Historical experiments */}
      {filteredClosed.length > 0 && (
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-3">
            Historical ({filteredClosed.length})
          </h2>
          <div className="space-y-3">
            {filteredClosed.map((exp) => (
              <ExperimentCard key={exp.id} exp={exp} onAction={() => {}} />
            ))}
          </div>
        </div>
      )}

      {/* Recent synthesis */}
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-3">Recent synthesis</h2>
        {learnings.length === 0 ? (
          <p className="text-sm text-gray-400 italic">No synthesis yet. The cron runs daily at 7am UTC.</p>
        ) : (
          <div className="space-y-4">
            {learnings.map((dl) => (
              <div key={String(dl.date)} className="rounded-xl border border-gray-200 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">
                    {new Date(String(dl.date)).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                  </span>
                  {dl.territory && <span className="text-xs text-gray-500 italic">{dl.territory}</span>}
                </div>
                {dl.raw_synthesis && <p className="text-sm text-gray-700">{dl.raw_synthesis}</p>}
                {dl.next_implied_hypothesis && (
                  <p className="text-xs text-blue-600">
                    <span className="font-medium">Next: </span>{dl.next_implied_hypothesis}
                  </p>
                )}
                <div className="flex gap-4 text-xs text-gray-400 pt-1">
                  {dl.velocity_week != null && <span>{dl.velocity_week} experiments (7d)</span>}
                  {dl.avg_cycle_hours != null && <span>{formatHours(dl.avg_cycle_hours)} avg cycle</span>}
                  {dl.validation_rate != null && <span>{formatRate(dl.validation_rate)} validated</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

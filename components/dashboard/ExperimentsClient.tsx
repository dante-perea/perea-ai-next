"use client";

import { useState, useTransition, useCallback } from "react";
import type { Experiment, Signal } from "@/lib/learning/ghost-db";


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

interface CloseWizardState {
  open: boolean;
  verdict: "win" | "kill";
}

const IMPLICATIONS = ["PERSEVERE", "PIVOT", "KILL", "DOUBLE-DOWN"] as const;
const CONFIDENCES = ["HIGH", "MEDIUM", "LOW"] as const;
const GENERALIZES = ["THIS-ONLY", "SEGMENT", "MARKET", "UNIVERSAL"] as const;
const PIVOT_TYPES = [
  "Customer-Segment", "Customer-Need", "Channel", "Pricing", "Value-Prop",
  "Zoom-In", "Zoom-Out", "Tech", "Platform", "Business-Model",
] as const;

export function ExperimentCard({ exp, initialSignals = [], onAction }: { exp: Experiment; initialSignals?: Signal[]; onAction: () => void }) {
  const [isPending, startTransition] = useTransition();
  const [wizard, setWizard] = useState<CloseWizardState>({ open: false, verdict: "win" });
  const [implication, setImplication] = useState<typeof IMPLICATIONS[number]>("PERSEVERE");
  const [confidence, setConfidence] = useState<typeof CONFIDENCES[number] | "">("");
  const [generalizes, setGeneralizes] = useState<typeof GENERALIZES[number] | "">("");
  const [pivotType, setPivotType] = useState<typeof PIVOT_TYPES[number] | "">("");
  const [learning, setLearning] = useState("");
  const [closeError, setCloseError] = useState("");

  const isActive = exp.outcome === "in_progress";

  async function patch(action: string, body: Record<string, unknown> = {}): Promise<Response> {
    const res = await fetch(`/api/experiments/${exp.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, ...body }),
    });
    onAction();
    return res;
  }

  function openWizard(verdict: "win" | "kill") {
    setWizard({ open: true, verdict });
    setImplication(verdict === "win" ? "PERSEVERE" : "KILL");
    setConfidence("");
    setGeneralizes("");
    setPivotType("");
    setLearning("");
    setCloseError("");
  }

  const closeReady =
    learning.trim() && confidence && generalizes &&
    (implication !== "PIVOT" || pivotType);

  function submitClose() {
    if (!closeReady) return;
    startTransition(async () => {
      const res = await patch("close", {
        verdict: wizard.verdict,
        implication,
        learning: learning.trim(),
        confidence,
        generalizes_to: generalizes,
        pivot_type: implication === "PIVOT" ? pivotType : undefined,
      });
      if (res.ok) {
        setWizard({ open: false, verdict: "win" });
      } else {
        const err = await res.json().catch(() => ({}));
        setCloseError(err.error ?? "Close failed");
      }
    });
  }

  function handleShip() { startTransition(async () => { await patch("ship"); }); }

  // Need More Data — inline note prompt + visible signal trail
  const [showMoreInput, setShowMoreInput] = useState(false);
  const [moreContent, setMoreContent] = useState("");
  const [revisitDays, setRevisitDays] = useState("");
  const [signals, setSignals] = useState<Signal[]>(initialSignals);

  const loadSignals = useCallback(async () => {
    try {
      const res = await fetch(`/api/experiments/${exp.id}/signals`);
      if (res.ok) setSignals(await res.json());
    } catch { /* ignore */ }
  }, [exp.id]);

  function openMoreInput() {
    setShowMoreInput(true);
    setMoreContent("");
    setRevisitDays("");
  }

  async function submitMore() {
    if (!moreContent.trim()) return;
    const days = revisitDays ? Number(revisitDays) : null;
    const revisitTag = days && Number.isFinite(days) && days > 0
      ? ` [revisit-in:${days}d]`
      : "";
    startTransition(async () => {
      await patch("more", { signal_content: `${moreContent.trim()}${revisitTag}` });
      setShowMoreInput(false);
      setMoreContent("");
      setRevisitDays("");
      await loadSignals();
    });
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
            {exp.is_implied && (
              <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-700" title="Hypothesis was inferred from the implementation, not explicitly stated by the founder">IMPLIED</span>
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

      {isActive && !wizard.open && (
        <div className="flex flex-wrap gap-2 pt-1">
          {!exp.shipped_at && (
            <button
              onClick={handleShip}
              className="text-xs px-2 py-1 rounded border border-gray-200 text-gray-600 hover:bg-gray-50"
            >
              Mark Shipped
            </button>
          )}
          <button
            onClick={() => openWizard("win")}
            className="text-xs px-2 py-1 rounded border border-green-200 text-green-700 hover:bg-green-50"
          >
            WIN
          </button>
          <button
            onClick={() => openWizard("kill")}
            className="text-xs px-2 py-1 rounded border border-red-200 text-red-600 hover:bg-red-50"
          >
            KILL
          </button>
          <button
            onClick={openMoreInput}
            className="text-xs px-2 py-1 rounded border border-yellow-200 text-yellow-700 hover:bg-yellow-50"
            title="Log what signal you're waiting for — keeps the experiment active"
          >
            Need More Data
          </button>
        </div>
      )}

      {showMoreInput && (
        <div className="pt-2 space-y-2 rounded-lg border border-yellow-200 bg-yellow-50/40 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-yellow-800">
            What signal are you waiting for?
          </p>
          <textarea
            value={moreContent}
            onChange={(e) => setMoreContent(e.target.value)}
            placeholder="e.g., need more replies on the Telegram CTA tweet, only 3 visits so far"
            rows={2}
            className="w-full text-xs border border-yellow-200 rounded px-2 py-1.5 resize-none bg-white focus:outline-none focus:ring-1 focus:ring-yellow-300"
            autoFocus
          />
          <div className="flex items-center gap-2">
            <label className="text-[10px] text-gray-500 uppercase tracking-wide">Revisit in</label>
            <input
              type="number"
              min={1}
              value={revisitDays}
              onChange={(e) => setRevisitDays(e.target.value)}
              placeholder="N"
              className="w-16 text-xs border border-gray-200 rounded px-2 py-1 bg-white"
            />
            <span className="text-[10px] text-gray-500">days (optional)</span>
            <div className="ml-auto flex gap-2">
              <button
                onClick={() => { setShowMoreInput(false); setMoreContent(""); setRevisitDays(""); }}
                className="text-xs px-3 py-1 rounded border border-gray-200 text-gray-500"
              >
                Cancel
              </button>
              <button
                disabled={!moreContent.trim() || isPending}
                onClick={submitMore}
                className="text-xs px-3 py-1 rounded bg-yellow-700 text-white disabled:opacity-40"
              >
                {isPending ? "Logging…" : "Log signal"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Signal trail — surfaces every observation logged for this experiment */}
      {isActive && signals.length > 0 && (
        <div className="pt-2 space-y-1.5">
          <p className="text-[10px] uppercase tracking-wide text-gray-400">Signal trail · {signals.length}</p>
          <div className="space-y-1">
            {signals.slice(0, 8).map((s) => (
              <div key={s.id} className="flex items-start gap-2 text-[11px] text-gray-600 border-l-2 border-gray-200 pl-2">
                <span className="text-gray-400 shrink-0 font-mono">
                  {new Date(s.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                </span>
                <span className="text-gray-400 uppercase text-[9px] shrink-0">{s.source}</span>
                <span className="flex-1">{s.content}</span>
              </div>
            ))}
            {signals.length > 8 && (
              <p className="text-[10px] text-gray-400 italic pl-3">+ {signals.length - 8} older signals</p>
            )}
          </div>
        </div>
      )}

      {wizard.open && (
        <div className="pt-2 space-y-3 rounded-lg border border-gray-300 bg-white p-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-700">
              Close as <span className={wizard.verdict === "win" ? "text-green-700" : "text-red-600"}>{wizard.verdict.toUpperCase()}</span> · Axis 7 structured close
            </p>
            <button onClick={() => setWizard({ open: false, verdict: "win" })} className="text-gray-400 text-xs hover:text-gray-700">✕</button>
          </div>

          <div>
            <label className="text-[10px] text-gray-500 uppercase tracking-wide">We learned that …</label>
            <textarea
              value={learning}
              onChange={(e) => setLearning(e.target.value)}
              placeholder="One sentence summarizing what reality showed."
              rows={2}
              className="w-full text-xs border border-gray-200 rounded px-2 py-1.5 resize-none focus:outline-none focus:ring-1 focus:ring-gray-300"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-gray-500 uppercase tracking-wide">Implication</label>
              <select
                value={implication}
                onChange={(e) => setImplication(e.target.value as typeof IMPLICATIONS[number])}
                className="w-full text-xs border border-gray-200 rounded px-2 py-1"
              >
                {IMPLICATIONS.map((i) => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] text-gray-500 uppercase tracking-wide">Confidence</label>
              <select
                value={confidence}
                onChange={(e) => setConfidence(e.target.value as typeof CONFIDENCES[number])}
                className="w-full text-xs border border-gray-200 rounded px-2 py-1"
              >
                <option value="">— select —</option>
                {CONFIDENCES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] text-gray-500 uppercase tracking-wide">Generalizes to</label>
              <select
                value={generalizes}
                onChange={(e) => setGeneralizes(e.target.value as typeof GENERALIZES[number])}
                className="w-full text-xs border border-gray-200 rounded px-2 py-1"
              >
                <option value="">— select —</option>
                {GENERALIZES.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            {implication === "PIVOT" && (
              <div>
                <label className="text-[10px] text-gray-500 uppercase tracking-wide">Pivot type</label>
                <select
                  value={pivotType}
                  onChange={(e) => setPivotType(e.target.value as typeof PIVOT_TYPES[number])}
                  className="w-full text-xs border border-gray-200 rounded px-2 py-1"
                >
                  <option value="">— select —</option>
                  {PIVOT_TYPES.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            )}
          </div>

          {closeError && <p className="text-xs text-red-500">{closeError}</p>}

          <div className="flex items-center justify-between pt-1">
            <p className="text-[10px] text-gray-400">
              {implication === "KILL"
                ? "No next-bet draft (KILL = exploration closed)."
                : "AI will draft a next-bet experiment when you confirm."}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setWizard({ open: false, verdict: "win" })}
                className="text-xs px-3 py-1 rounded border border-gray-200 text-gray-500"
              >
                Cancel
              </button>
              <button
                disabled={!closeReady || isPending}
                onClick={submitClose}
                className="text-xs px-3 py-1 rounded bg-gray-900 text-white disabled:opacity-40"
              >
                {isPending ? "Closing…" : `Confirm ${wizard.verdict.toUpperCase()}`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Surface the structured close fields on already-closed experiments */}
      {!isActive && (exp.implication || exp.confidence) && (
        <div className="pt-1 flex flex-wrap gap-1.5 text-[10px]">
          {exp.implication && <span className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">{exp.implication}</span>}
          {exp.confidence && <span className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">conf: {exp.confidence}</span>}
          {exp.generalizes_to && <span className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">scope: {exp.generalizes_to}</span>}
          {exp.pivot_type && <span className="px-1.5 py-0.5 rounded bg-purple-100 text-purple-700">pivot: {exp.pivot_type}</span>}
          {exp.next_bet_id && <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700">→ next: <code className="font-mono">{exp.next_bet_id}</code></span>}
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
  initialDrafts,
  signalsMap,
  learnings,
  velocityToday,
  velocityWeek,
  avgCycleHours,
  validationRate,
}: {
  initialActive: Experiment[];
  initialClosed: Experiment[];
  initialDrafts: Experiment[];
  signalsMap: Record<string, Signal[]>;
  learnings: RecentLearning[];
  velocityToday: number;
  velocityWeek: number;
  avgCycleHours: number | null;
  validationRate: number | null;
}) {
  const [active, setActive] = useState(initialActive);
  const [drafts, setDrafts] = useState(initialDrafts);
  const [isStarting, startTransition] = useTransition();
  const [startupFilter, setStartupFilter] = useState<string | null>(null);
  const [report, setReport] = useState<ScrumReport | null>(null);
  const [reportOpen, setReportOpen] = useState(false);
  const [isGenerating, startReportTransition] = useTransition();
  const [showOps, setShowOps] = useState(false);

  const allExperiments = [...active, ...initialClosed];
  const startups = Array.from(new Set(allExperiments.map((e) => e.project_tag).filter(Boolean))) as string[];

  const byProject = (e: Experiment) => !startupFilter || e.project_tag === startupFilter;
  // Main learning corpus: L1/L2 only (the falsifiable hypothesis tests)
  const filteredActive = active.filter((e) => byProject(e) && e.loop_class !== "L0");
  // Ops log: L0 entries, hidden by default
  const opsActive    = active.filter((e) => byProject(e) && e.loop_class === "L0");
  const filteredClosed = initialClosed.filter(byProject);
  const filteredDrafts = drafts.filter(byProject);

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
    const [actRes, draftRes] = await Promise.all([
      fetch("/api/experiments"),
      fetch("/api/experiments?drafts=1"),
    ]);
    if (actRes.ok) setActive(await actRes.json());
    if (draftRes.ok) setDrafts(await draftRes.json());
  }

  async function promoteDraft(id: string) {
    const res = await fetch(`/api/experiments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "promote" }),
    });
    if (res.ok) await refreshActive();
  }

  async function discardDraft(id: string) {
    const res = await fetch(`/api/experiments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete" }),
    });
    if (res.ok) await refreshActive();
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

      {/* Drafts — auto-spawned next bets pending review */}
      {filteredDrafts.length > 0 && (
        <div>
          <h2 className="text-lg font-medium text-emerald-700 mb-2">
            Pending next-bets ({filteredDrafts.length})
          </h2>
          <p className="text-xs text-gray-500 mb-3">
            AI-drafted hypotheses spawned from closed experiments. Review and promote to start running, or discard.
          </p>
          <div className="space-y-3">
            {filteredDrafts.map((d) => (
              <div key={d.id} className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{d.hypothesis}</p>
                    <p className="text-xs text-gray-500 mt-1 flex flex-wrap items-center gap-x-1.5">
                      <code className="font-mono text-gray-400">{d.id}</code>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-700">DRAFT</span>
                      {d.parent_experiment_id && <span>↑ from <code className="font-mono">{d.parent_experiment_id}</code></span>}
                      {d.risk_dimension && <span>· {d.risk_dimension}</span>}
                      {d.aarrr_stage && <span>· {d.aarrr_stage}</span>}
                      {d.evidence_method && <span>· {d.evidence_method}</span>}
                    </p>
                    {d.threshold && (
                      <p className="text-[11px] text-gray-500 mt-1">
                        <span className="font-medium">Win:</span> {d.metric} ≥ {d.threshold} within {d.timeframe}
                        {d.kill_threshold && <span className="text-red-500"> · Kill if &lt; {d.kill_threshold}</span>}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => promoteDraft(d.id)}
                    className="text-xs px-3 py-1 rounded bg-emerald-700 text-white hover:bg-emerald-800"
                  >
                    Promote to Active
                  </button>
                  <button
                    onClick={() => discardDraft(d.id)}
                    className="text-xs px-3 py-1 rounded border border-gray-200 text-gray-500 hover:bg-gray-50"
                  >
                    Discard
                  </button>
                </div>
              </div>
            ))}
          </div>
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
              <ExperimentCard key={exp.id} exp={exp} initialSignals={signalsMap[exp.id]} onAction={refreshActive} />
            ))}
          </div>
        )}
      </div>

      {/* Operations log (L0) — hidden by default */}
      {opsActive.length > 0 && (
        <div>
          <button
            onClick={() => setShowOps(!showOps)}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
          >
            <span className={`transition-transform inline-block ${showOps ? "rotate-90" : ""}`}>›</span>
            Operations log ({opsActive.length} L0 sessions — engineering work without explicit hypothesis)
          </button>
          {showOps && (
            <div className="space-y-2 mt-3">
              {opsActive.map((exp) => (
                <div key={exp.id} className="rounded-lg border border-gray-100 bg-gray-50 p-3 text-xs text-gray-500">
                  <div className="flex items-center gap-2">
                    <code className="font-mono text-gray-400">{exp.id}</code>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-gray-200 text-gray-500">L0</span>
                    {exp.project_tag && <span>· {exp.project_tag}</span>}
                  </div>
                  <p className="mt-1 truncate">{exp.hypothesis}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

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

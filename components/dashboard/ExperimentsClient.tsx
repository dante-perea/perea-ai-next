"use client";

import { useState, useTransition, useCallback, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Experiment, Signal, SynthesisRecommendation } from "@/lib/learning/ghost-db";


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

  // Apply AI synthesis to pre-fill the close wizard. Maps the recommendation's
  // implication onto the win/kill verdict so the user can review + confirm with
  // one click instead of filling 5 fields by hand.
  function applySynthesis(rec: SynthesisRecommendation) {
    const verdict: "win" | "kill" = rec.implication === "KILL" || rec.implication === "PIVOT" ? "kill" : "win";
    setWizard({ open: true, verdict });
    setImplication(rec.implication);
    setLearning(rec.learning);
    setConfidence(rec.confidence);
    setGeneralizes(rec.generalizes_to as typeof GENERALIZES[number]);
    setPivotType((rec.pivot_type ?? "") as typeof PIVOT_TYPES[number] | "");
    setCloseError("");
  }

  function waitLonger(days: number) {
    startTransition(async () => { await patch("snooze", { revisit_days: days }); });
  }

  function reclassifyAsL0() {
    if (!confirm(
      `Reclassify "${exp.id}" as L0 (ops fix)?\n\n` +
      `Use this when the hypothesis isn't really a falsifiable user-behavior test (e.g. the extractor force-generated it from a code-refactor session).\n\n` +
      `The L1 fields will be preserved silently — you can promote back later from the Operations log.`
    )) return;
    startTransition(async () => { await patch("demote"); });
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
            {exp.is_implied && exp.loop_class !== "L0" && (
              <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-700" title="Hypothesis was inferred from the implementation, not explicitly stated by the founder">IMPLIED</span>
            )}
            {/* L1/L2-specific taxonomy tags — hidden on L0s (including demoted ones) so the
                Ops log doesn't show stale validated-learning chrome on a record that no longer
                lives in that corpus. The data is still in the row, just not surfaced. */}
            {exp.loop_class !== "L0" && exp.risk_dimension && <span>· {exp.risk_dimension}</span>}
            {exp.loop_class !== "L0" && exp.hypothesis_class && <span>· {exp.hypothesis_class}</span>}
            {exp.loop_class !== "L0" && exp.aarrr_stage && exp.aarrr_stage !== "none" && exp.aarrr_stage !== "NON" && <span>· {exp.aarrr_stage}</span>}
            {exp.loop_class !== "L0" && exp.evidence_method && <span>· {exp.evidence_method}</span>}
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

      {/* AI synthesis banner — shown when the snooze window has expired and Grok
          has read the accumulated notes. Pre-fills the close wizard on Apply. */}
      {isActive && !wizard.open && exp.synthesis_text && exp.synthesis_recommendation && (
        <div className="rounded-lg border border-purple-200 bg-purple-50/60 p-3 space-y-2">
          <div className="flex items-baseline justify-between gap-2">
            <p className="text-[10px] uppercase tracking-wide text-purple-700 font-semibold">
              🤖 Re-decide recommendation
              {exp.synthesis_generated_at && (
                <span className="ml-2 font-normal text-purple-500/80 text-[10px]">
                  · {new Date(exp.synthesis_generated_at).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                </span>
              )}
            </p>
            <p className="text-[10px] text-purple-700">
              <span className="font-semibold">{exp.synthesis_recommendation.implication}</span>
              {exp.synthesis_recommendation.pivot_type && <span> ({exp.synthesis_recommendation.pivot_type})</span>}
              <span className="text-purple-500/80"> · {exp.synthesis_recommendation.confidence} confidence</span>
            </p>
          </div>
          <p className="text-xs text-gray-700 italic">{exp.synthesis_text}</p>
          <p className="text-[11px] text-gray-600">
            <span className="font-medium text-gray-700">Suggested learning:</span> &ldquo;{exp.synthesis_recommendation.learning}&rdquo;
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            <button
              onClick={() => applySynthesis(exp.synthesis_recommendation!)}
              className="text-xs px-3 py-1 rounded bg-purple-700 text-white hover:bg-purple-800"
            >
              Apply &amp; review
            </button>
            <button
              onClick={() => waitLonger(2)}
              className="text-xs px-2 py-1 rounded border border-purple-200 text-purple-700 hover:bg-purple-100"
              title="Re-snooze for another 2 days; clears this synthesis so a fresh one is generated next time"
            >
              Wait longer (+2d)
            </button>
            <button
              onClick={openMoreInput}
              className="text-xs px-2 py-1 rounded border border-yellow-200 text-yellow-700 hover:bg-yellow-50"
              title="Log a fresh observation; re-snoozes and clears the recommendation"
            >
              Add note
            </button>
          </div>
        </div>
      )}

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
          {exp.loop_class && exp.loop_class !== "L0" && (
            <button
              onClick={reclassifyAsL0}
              className="text-xs px-2 py-1 rounded border border-gray-200 text-gray-400 hover:bg-gray-50 hover:text-gray-600 ml-auto"
              title="Reclassify as L0 (ops fix) — use when this isn't really a falsifiable user-behavior hypothesis"
            >
              ⤓ Reclassify as L0
            </button>
          )}
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

      {wizard.open && (() => {
        // The wizard heading + button label follow the IMPLICATION, not just
        // the win/kill verdict. PIVOT is technically a "kill" verdict (the
        // original hypothesis was refuted) but reads as "Close & pivot" so
        // the user isn't confused into thinking they're killing the line.
        const headingTone =
          implication === "KILL" ? "text-red-600"
          : implication === "PIVOT" ? "text-purple-700"
          : implication === "DOUBLE-DOWN" ? "text-emerald-700"
          : "text-green-700";
        const headingLabel =
          implication === "KILL" ? "KILL"
          : implication === "PIVOT" ? "PIVOT"
          : implication === "DOUBLE-DOWN" ? "DOUBLE-DOWN"
          : "WIN";
        const headingPrefix = implication === "PIVOT" ? "Close & pivot —" : "Close as";
        const confirmLabel =
          implication === "KILL" ? "Confirm KILL"
          : implication === "PIVOT" ? "Confirm pivot"
          : implication === "DOUBLE-DOWN" ? "Confirm DOUBLE-DOWN"
          : "Confirm WIN";
        return (
        <div className="pt-2 space-y-3 rounded-lg border border-gray-300 bg-white p-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-700">
              {headingPrefix} <span className={headingTone}>{headingLabel}</span> · Axis 7 structured close
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
                {isPending ? "Closing…" : confirmLabel}
              </button>
            </div>
          </div>
        </div>
        );
      })()}

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

// 48h re-decide window helpers (Pinnacle Gecko decision rule)
const DAY = 24 * 60 * 60 * 1000;
const DEFAULT_REVISIT_DAYS = 2;

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
function getReviewDueAt(signals: Signal[]): Date | null {
  const nmd = signals.filter((s) => s.content.startsWith("[need-more-data]"));
  if (nmd.length === 0) return null;
  const latest = nmd[0];
  const match = latest.content.match(/\[revisit-in:(\d+)d\]/);
  const days = match ? parseInt(match[1], 10) : DEFAULT_REVISIT_DAYS;
  return new Date(new Date(latest.created_at).getTime() + days * DAY);
}
function fmtDueDelta(due: Date): string {
  const ms = Date.now() - due.getTime();
  if (ms < 0) {
    const hoursUntil = Math.round(-ms / 3.6e6);
    if (hoursUntil < 24) return `due in ${hoursUntil}h`;
    return `due in ${Math.round(hoursUntil / 24)}d`;
  }
  const hoursAgo = Math.round(ms / 3.6e6);
  if (hoursAgo < 24) return `due ${hoursAgo}h ago`;
  return `due ${Math.round(hoursAgo / 24)}d ago`;
}

function Stat({ label, value, alarm }: { label: string; value: string; alarm?: boolean }) {
  return (
    <div>
      <div className="text-gray-400 uppercase tracking-wide text-[10px]">{label}</div>
      <div className={`text-lg font-semibold ${alarm ? "text-red-600" : "text-gray-900"}`}>{value}</div>
    </div>
  );
}

export function ExperimentsClient({
  initialActive,
  initialClosed,
  initialDrafts,
  all,
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
  all: Experiment[];
  signalsMap: Record<string, Signal[]>;
  learnings: RecentLearning[];
  velocityToday: number;
  velocityWeek: number;
  avgCycleHours: number | null;
  validationRate: number | null;
}) {
  const router = useRouter();
  const [active, setActive] = useState(initialActive);
  const [drafts, setDrafts] = useState(initialDrafts);
  const [isStarting, startTransition] = useTransition();
  const [startupFilter, setStartupFilter] = useState<string | null>(null);
  const [report, setReport] = useState<ScrumReport | null>(null);
  const [reportOpen, setReportOpen] = useState(false);
  const [isGenerating, startReportTransition] = useTransition();
  const [showOps, setShowOps] = useState(false);
  const [showNewForm, setShowNewForm] = useState(false);
  const [selected, setSelected] = useState<Experiment | null>(null);
  const [openDay, setOpenDay] = useState<string | null>(null);

  const startups = Array.from(new Set(all.map((e) => e.project_tag).filter(Boolean))) as string[];
  const byProject = (e: Experiment) => !startupFilter || e.project_tag === startupFilter;
  const filteredActive = active.filter((e) => byProject(e) && e.loop_class !== "L0");
  const opsActive = active.filter((e) => byProject(e) && e.loop_class === "L0");
  const filteredDrafts = drafts.filter(byProject);
  const filteredAll = all.filter(byProject);

  // Ranked active list — due experiments first, then stalest, signal count tiebreak.
  // Snoozed experiments are FULLY HIDDEN until their window expires (then they
  // resurface as 🔔 Re-decide, jumping to the top of the queue).
  const ranked = useMemo(() => {
    const nowMs = Date.now();
    return filteredActive
      .filter((e) => e.outcome === "in_progress")
      .filter((e) => {
        // Prefer the DB column when set; fall back to deriving from the signal trail
        // for any rows that predate the snoozed_until column.
        if (e.snoozed_until) return new Date(e.snoozed_until).getTime() < nowMs;
        const sigs = signalsMap[e.id] ?? [];
        const derivedDue = getReviewDueAt(sigs);
        return !derivedDue || derivedDue.getTime() < nowMs;
      })
      .map((e) => {
        const sigs = signalsMap[e.id] ?? [];
        const due = e.snoozed_until ? new Date(e.snoozed_until) : getReviewDueAt(sigs);
        const isDue = due != null && due.getTime() < nowMs;
        return { exp: e, ageDays: daysSince(e.started_at), sigCount: sigs.length, due, isDue };
      })
      .sort((a, b) => {
        if (a.isDue !== b.isDue) return a.isDue ? -1 : 1;
        if (a.isDue && b.isDue && a.due && b.due) return a.due.getTime() - b.due.getTime();
        if (Math.abs(b.ageDays - a.ageDays) > 0.5) return b.ageDays - a.ageDays;
        return b.sigCount - a.sigCount;
      });
  }, [filteredActive, signalsMap]);

  // Snoozed experiments — surfaced as a separate count, not visible in Decide Now/Up Next.
  const snoozedCount = filteredActive
    .filter((e) => e.outcome === "in_progress" && e.snoozed_until && new Date(e.snoozed_until).getTime() >= Date.now())
    .length;

  const now = ranked[0];
  const upNext = ranked.slice(1, 7);
  const dueCount = ranked.filter((x) => x.isDue).length;

  // Journal — group all activity by day, reverse chronological, skip today
  const today = new Date().toISOString().slice(0, 10);
  const byDay = useMemo(() => {
    type DayActivity = {
      started: Experiment[];
      closed: Experiment[];
      signaled: { exp: Experiment; signal: Signal }[];
    };
    const map: Record<string, DayActivity> = {};
    function key(d: Date | string): string { return new Date(d).toISOString().slice(0, 10); }
    function bucket(k: string): DayActivity { return (map[k] ||= { started: [], closed: [], signaled: [] }); }
    for (const e of filteredAll) {
      bucket(key(e.started_at)).started.push(e);
      if (e.shipped_at && e.outcome !== "in_progress") bucket(key(e.shipped_at)).closed.push(e);
    }
    for (const [expId, sigs] of Object.entries(signalsMap)) {
      const exp = filteredAll.find((e) => e.id === expId);
      if (!exp) continue;
      for (const s of sigs) bucket(key(s.created_at)).signaled.push({ exp, signal: s });
    }
    return Object.entries(map)
      .filter(([d]) => d !== today)
      .sort((a, b) => b[0].localeCompare(a[0]));
  }, [filteredAll, signalsMap, today]);

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
        setShowNewForm(false);
        await refreshActive();
        router.refresh();
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

  const refreshActive = useCallback(async () => {
    const [actRes, draftRes] = await Promise.all([
      fetch("/api/experiments"),
      fetch("/api/experiments?drafts=1"),
    ]);
    if (actRes.ok) setActive(await actRes.json());
    if (draftRes.ok) setDrafts(await draftRes.json());
    router.refresh();
  }, [router]);

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

  async function promoteL0(id: string) {
    const res = await fetch(`/api/experiments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "promote_l1" }),
    });
    if (res.ok) await refreshActive();
  }

  // Close modal on Escape
  useEffect(() => {
    if (!selected) return;
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") setSelected(null); }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected]);

  return (
    <div className="min-h-screen bg-amber-50/30 -mx-4 -my-10 px-0 py-0">
      <div className="max-w-4xl mx-auto px-8 py-10">
        {/* Header — Lab Journal */}
        <header className="mb-6 pb-4 border-b-2 border-gray-900 flex items-start justify-between gap-4">
          <div className="flex-1">
            <p className="text-xs uppercase tracking-widest text-gray-500">Lab Journal</p>
            <h1 className="text-3xl font-serif text-gray-900 mt-1">Field notes from running experiments</h1>
            <p className="text-sm text-gray-600 mt-2 italic">Today&apos;s entry is interactive — decide. Older entries are the record of what reality said.</p>
          </div>
          <div className="flex flex-col items-end gap-2 shrink-0">
            <button
              onClick={generateReport}
              disabled={isGenerating}
              className="text-xs px-3 py-1.5 rounded-full border border-gray-300 text-gray-600 hover:bg-white disabled:opacity-50"
            >
              {isGenerating ? "Generating…" : "Daily Scrum"}
            </button>
            <button
              onClick={() => setShowNewForm((v) => !v)}
              className="text-xs px-3 py-1.5 rounded-full bg-gray-900 text-white hover:bg-gray-700"
            >
              {showNewForm ? "Cancel" : "+ Start new experiment"}
            </button>
          </div>
        </header>

        {/* Daily Scrum panel */}
        {reportOpen && report && (
          <div className="mb-6 rounded-xl border border-blue-100 bg-blue-50 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-blue-900">
                Daily Scrum &mdash; {new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
              </h2>
              <button onClick={() => setReportOpen(false)} className="text-xs text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <section>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Yesterday</h3>
              <ul className="space-y-1">
                {report.yesterday.map((item, i) => <li key={i} className="text-sm text-gray-700">• {item}</li>)}
              </ul>
            </section>
            <section>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Today</h3>
              <ul className="space-y-1">
                {report.today.map((item, i) => <li key={i} className="text-sm text-gray-700">• {item}</li>)}
              </ul>
            </section>
            {report.blockers.length > 0 && (
              <section>
                <h3 className="text-xs font-semibold text-red-500 uppercase tracking-wide mb-1">Blockers</h3>
                <ul className="space-y-1">
                  {report.blockers.map((item, i) => <li key={i} className="text-sm text-red-700">• {item}</li>)}
                </ul>
              </section>
            )}
            <section>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Backlog</h3>
              <div className="space-y-2">
                {report.backlog.map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <span className={`text-xs px-1.5 py-0.5 rounded font-medium shrink-0 ${
                      item.priority === "high" ? "bg-red-100 text-red-700"
                      : item.priority === "medium" ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-100 text-gray-500"
                    }`}>{item.priority}</span>
                    <span className="text-gray-700 flex-1">{item.title}</span>
                    <span className="text-xs text-gray-400 shrink-0">{item.project} · {item.type}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* New experiment form — collapsible */}
        {showNewForm && (
          <form onSubmit={startExperiment} className="mb-8 space-y-4 rounded-xl border-2 border-gray-900 bg-white p-5 shadow-md">
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
                <p className="text-[10px] text-gray-400 mt-1">L0 entries are tracked but excluded from the validated-learning corpus.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">Risk dimension <span className="text-red-400">*</span></label>
                    <select value={riskDim} onChange={(e) => setRiskDim(e.target.value)} className="w-full text-sm border border-gray-200 rounded px-2 py-1.5 focus:outline-none">
                      <option value="">— select —</option>
                      {RISK_DIMENSIONS.map((r) => <option key={r.v} value={r.v}>{r.label}</option>)}
                    </select>
                  </div>
                  {loopClass === "L1" && (
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">Hypothesis class <span className="text-red-400">*</span></label>
                      <select value={hypClass} onChange={(e) => setHypClass(e.target.value)} className="w-full text-sm border border-gray-200 rounded px-2 py-1.5 focus:outline-none">
                        <option value="">— select —</option>
                        {HYPOTHESIS_CLASSES.map((h) => <option key={h.v} value={h.v}>{h.label}</option>)}
                      </select>
                    </div>
                  )}
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">AARRR stage <span className="text-red-400">*</span></label>
                    <select value={aarrrV2} onChange={(e) => setAarrrV2(e.target.value)} className="w-full text-sm border border-gray-200 rounded px-2 py-1.5 focus:outline-none">
                      <option value="">— select —</option>
                      {AARRR_STAGES_V2.map((a) => <option key={a.v} value={a.v}>{a.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">Evidence method <span className="text-red-400">*</span></label>
                    <select value={evidenceMethod} onChange={(e) => setEvidenceMethod(e.target.value)} className="w-full text-sm border border-gray-200 rounded px-2 py-1.5 focus:outline-none">
                      <option value="">— select —</option>
                      {EVIDENCE_METHODS.map((m) => <option key={m.v} value={m.v}>{m.label}</option>)}
                    </select>
                  </div>
                </div>

                <div className="rounded-lg bg-gray-50 border border-gray-200 p-3 space-y-2">
                  <p className="text-[11px] font-semibold text-gray-700 uppercase tracking-wide">Falsifiable hypothesis · all slots required</p>
                  <div className="grid grid-cols-1 gap-2 text-sm">
                    {[
                      { label: "We believe that", value: behavior, set: setBehavior, ph: "users will pay for a Stripe checkout link" },
                      { label: "for", value: segment, set: setSegment, ph: "early-stage AI founders in unifounder ICP" },
                      { label: "measured by", value: metric, set: setMetric, ph: "paid Stripe checkouts completed" },
                      { label: "hitting", value: threshold, set: setThreshold, ph: "≥ 3" },
                      { label: "within", value: timeframe, set: setTimeframe, ph: "48 hours" },
                    ].map((s) => (
                      <div key={s.label} className="flex items-baseline gap-2">
                        <span className="text-gray-500 text-xs w-32 shrink-0">{s.label}</span>
                        <input value={s.value} onChange={(e) => s.set(e.target.value)} placeholder={s.ph} className="flex-1 text-sm border border-gray-200 rounded px-2 py-1 bg-white" />
                      </div>
                    ))}
                    <div className="flex items-baseline gap-2">
                      <span className="text-red-500 text-xs w-32 shrink-0">Kill if below</span>
                      <input value={killThreshold} onChange={(e) => setKillThreshold(e.target.value)} placeholder="1 (by hour 24)" className="flex-1 text-sm border border-red-200 rounded px-2 py-1 bg-white" />
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
              <button type="submit" disabled={!canRun || isStarting} className="text-sm px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed">
                {isStarting ? "Starting…" : "Run experiment"}
              </button>
            </div>
          </form>
        )}

        {/* Startup filter tabs */}
        {startups.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            <button
              onClick={() => setStartupFilter(null)}
              className={`text-xs px-3 py-1 rounded-full border ${!startupFilter ? "bg-gray-900 text-white border-gray-900" : "border-gray-200 text-gray-500 hover:bg-white"}`}
            >All</button>
            {startups.map((s) => (
              <button
                key={s}
                onClick={() => setStartupFilter(startupFilter === s ? null : s)}
                className={`text-xs px-3 py-1 rounded-full border ${startupFilter === s ? "bg-gray-900 text-white border-gray-900" : "border-gray-200 text-gray-500 hover:bg-white"}`}
              >{s}</button>
            ))}
          </div>
        )}

        {/* Today's entry — interactive */}
        <article className="relative pl-10 pb-10 border-b border-amber-200">
          <div className="absolute left-[6px] top-2 w-4 h-4 rounded-full bg-emerald-600 border-4 border-amber-50 ring-2 ring-emerald-300" />
          <h2 className="text-lg font-serif text-gray-900">
            {new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" })} · today
          </h2>
          <p className="text-xs text-emerald-700 mt-0.5 uppercase tracking-wide">Active entry · decide and observe</p>

          <div className="mt-4 space-y-6">
            {dueCount > 0 && (
              <section className="rounded-xl border-2 border-amber-300 bg-amber-50 px-4 py-3">
                <p className="text-sm font-semibold text-amber-900">
                  🔔 {dueCount} experiment{dueCount === 1 ? "" : "s"} past their re-decide window
                </p>
                <p className="text-xs text-amber-700 mt-0.5">
                  You logged Need More Data on these. {DEFAULT_REVISIT_DAYS * 24}h is up. Revisit and decide — or log a new note if reality still hasn&apos;t spoken.
                </p>
              </section>
            )}

            {filteredDrafts.length > 0 && (
              <section className="rounded-xl border-2 border-emerald-200 bg-emerald-50 p-4">
                <p className="text-xs font-semibold text-emerald-900 uppercase tracking-wide mb-2">
                  First — {filteredDrafts.length} pending next-bet{filteredDrafts.length > 1 ? "s" : ""}
                </p>
                <p className="text-xs text-emerald-700 mb-3">Drafts auto-spawned from your last closes. Promote or discard before adding new bets.</p>
                <div className="space-y-2">
                  {filteredDrafts.slice(0, 3).map((d) => (
                    <div key={d.id} className="flex items-start gap-2 bg-white rounded-lg p-3">
                      <p className="flex-1 text-sm text-gray-800">{d.hypothesis}</p>
                      <div className="flex gap-1 shrink-0">
                        <button onClick={() => promoteDraft(d.id)} className="text-xs px-3 py-1 rounded bg-emerald-700 text-white">Promote</button>
                        <button onClick={() => discardDraft(d.id)} className="text-xs px-3 py-1 rounded border border-gray-200 text-gray-500">Discard</button>
                      </div>
                    </div>
                  ))}
                  {filteredDrafts.length > 3 && (
                    <p className="text-[11px] text-emerald-700 italic pl-2">+ {filteredDrafts.length - 3} more drafts</p>
                  )}
                </div>
              </section>
            )}

            {now ? (
              <section className="space-y-2">
                <div className="flex items-baseline justify-between px-1">
                  <p className={`text-xs uppercase tracking-widest font-semibold ${now.isDue ? "text-amber-700" : "text-gray-900"}`}>
                    {now.isDue ? "🔔 Re-decide" : "Decide now"}
                  </p>
                  <p className="text-xs text-gray-500">
                    running {fmtDays(now.ageDays)} · {now.sigCount} signal{now.sigCount === 1 ? "" : "s"}
                    {now.due && <span className={now.isDue ? "text-amber-700 ml-2 font-medium" : "ml-2"}>· {fmtDueDelta(now.due)}</span>}
                  </p>
                </div>
                <div className="rounded-2xl border-2 border-gray-900 bg-white shadow-lg p-2">
                  <ExperimentCard
                    exp={now.exp}
                    initialSignals={signalsMap[now.exp.id] ?? []}
                    onAction={refreshActive}
                  />
                </div>
              </section>
            ) : (
              <section className="rounded-xl border border-dashed border-gray-300 p-6 text-center">
                {snoozedCount > 0 ? (
                  <p className="text-sm text-gray-500">
                    All {snoozedCount} active experiment{snoozedCount === 1 ? "" : "s"} are waiting for signal. They&apos;ll surface here as <span className="text-amber-700 font-medium">🔔 Re-decide</span> once their snooze window expires.
                  </p>
                ) : (
                  <p className="text-sm text-gray-500">No active experiments. Hit <span className="font-medium text-gray-900">+ Start new experiment</span> to begin.</p>
                )}
              </section>
            )}

            {upNext.length > 0 && (
              <section>
                <p className="text-xs uppercase tracking-wide text-gray-500 mb-2">Up next · {upNext.length} after this one</p>
                <div className="space-y-1">
                  {upNext.map((x, i) => (
                    <button
                      key={x.exp.id}
                      onClick={() => setSelected(x.exp)}
                      className={`w-full flex items-center gap-3 text-left text-xs p-2 rounded border ${x.isDue ? "border-amber-200 bg-amber-50/40 hover:bg-amber-50" : "border-transparent hover:bg-white hover:border-gray-200"}`}
                    >
                      <span className="font-mono text-gray-400 shrink-0 w-4 text-right">{i + 2}</span>
                      {x.isDue && <span className="shrink-0 text-amber-700">🔔</span>}
                      <span className="flex-1 truncate text-gray-700">{x.exp.hypothesis}</span>
                      <span className={`shrink-0 font-mono text-[10px] ${x.isDue ? "text-amber-700" : "text-gray-400"}`}>
                        {x.due ? fmtDueDelta(x.due) : fmtDays(x.ageDays)}
                      </span>
                    </button>
                  ))}
                </div>
              </section>
            )}

            {snoozedCount > 0 && (
              <p className="text-[11px] text-gray-400 italic px-1">
                💤 {snoozedCount} experiment{snoozedCount === 1 ? "" : "s"} snoozed — hidden until their re-decide window opens
              </p>
            )}

            <section className="border-t border-gray-200 pt-4 grid grid-cols-4 gap-2 text-xs">
              <Stat label="Today" value={`${velocityToday} started`} />
              <Stat label="7d velocity" value={String(velocityWeek)} />
              <Stat label="Avg cycle" value={formatHours(avgCycleHours)} alarm={avgCycleHours != null && avgCycleHours > 48} />
              <Stat label="Validation rate" value={formatRate(validationRate)} />
            </section>
          </div>
        </article>

        {/* Older entries — read-only journal */}
        <div className="pt-8 relative">
          <div className="absolute left-[12px] top-2 bottom-2 w-0.5 bg-gray-300" />
          <div className="space-y-6">
            {byDay.length === 0 && (
              <p className="text-sm text-gray-400 italic pl-10">No older entries yet.</p>
            )}
            {byDay.map(([day, activity]) => {
              const isOpen = day === openDay;
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
                              <li key={e.id} onClick={() => setSelected(e)} className="cursor-pointer hover:bg-amber-100/60 -mx-2 px-2 py-1 rounded">
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
                              <li key={e.id} onClick={() => setSelected(e)} className="cursor-pointer hover:bg-amber-100/60 -mx-2 px-2 py-1 rounded text-gray-700">
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
                              <li key={signal.id} onClick={() => setSelected(exp)} className="cursor-pointer hover:bg-amber-100/60 -mx-2 px-2 py-1 rounded">
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

        {/* Operations log (L0) — collapsible at bottom */}
        {opsActive.length > 0 && (
          <div className="mt-10 pt-6 border-t border-amber-200">
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
                      {/* Promote-back button — only meaningful for L0s that were demoted from L1
                          (i.e. they still have the L1 fields populated underneath). For genuine
                          L0s these fields are null, so we hide the button to avoid suggesting
                          promotion would do anything useful. */}
                      {(exp.segment || exp.behavior || exp.metric) && (
                        <button
                          onClick={() => promoteL0(exp.id)}
                          className="ml-auto text-[10px] px-2 py-0.5 rounded border border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                          title="Restore as L1 — original taxonomy fields are still in the row"
                        >
                          ↥ Promote to L1
                        </button>
                      )}
                    </div>
                    <p className="mt-1 truncate">{exp.hypothesis}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Recent synthesis */}
        {learnings.length > 0 && (
          <div className="mt-10 pt-6 border-t border-amber-200">
            <h2 className="text-xs uppercase tracking-widest text-gray-500 mb-3">Recent synthesis</h2>
            <div className="space-y-4">
              {learnings.map((dl) => (
                <div key={String(dl.date)} className="rounded-xl border border-gray-200 bg-white p-4 space-y-2">
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
          </div>
        )}
      </div>

      {/* Modal — clicking older experiments opens the full action surface */}
      {selected && (
        <div
          className="fixed inset-0 z-40 bg-black/50 flex items-start justify-center p-6 overflow-y-auto"
          onClick={() => setSelected(null)}
        >
          <div onClick={(e) => e.stopPropagation()} className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-5 mt-12">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs uppercase tracking-wide text-gray-500">Experiment actions · click outside to close</p>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-700 text-lg leading-none">✕</button>
            </div>
            <ExperimentCard
              exp={selected}
              initialSignals={signalsMap[selected.id] ?? []}
              onAction={refreshActive}
            />
          </div>
        </div>
      )}

      {/* Suppress unused import warning for closed list which still informs the journal */}
      {initialClosed.length === 0 && null}
    </div>
  );
}

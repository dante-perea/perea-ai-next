"use client";

import { useState, useTransition } from "react";
import type { Experiment } from "@/lib/learning/ghost-db";


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
          <p className="text-xs text-gray-400 mt-1">
            <code className="font-mono">{exp.id}</code>
            {exp.project_tag && <span> · {exp.project_tag}</span>}
            {exp.experiment_type && <span> · {exp.experiment_type}</span>}
            {exp.feature_tag && <span> · {exp.feature_tag}</span>}
            {exp.aarrr_stage && exp.aarrr_stage !== "none" && <span> · {exp.aarrr_stage}</span>}
            <span> · {new Date(exp.started_at).toLocaleDateString()}</span>
          </p>
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

  const [hypothesis, setHypothesis] = useState("");
  const [successCriteria, setSuccessCriteria] = useState("");
  const [expType, setExpType] = useState<string>("other");
  const [aarrr, setAarrr] = useState<string>("none");
  const [formError, setFormError] = useState("");

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

      {/* Start experiment form */}
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-3">Start an experiment</h2>
        <form onSubmit={startExperiment} className="space-y-3 rounded-xl border border-gray-200 p-4">
          <div>
            <label className="text-xs text-gray-500 block mb-1">
              Hypothesis <span className="text-gray-400">(If I do X, then Y happens, because Z)</span>
            </label>
            <textarea
              value={hypothesis}
              onChange={(e) => setHypothesis(e.target.value)}
              placeholder="If I send cold DMs to ICP founders, then I get 3 discovery calls per week, because personal outreach converts higher than cold email"
              rows={3}
              className="w-full text-sm border border-gray-200 rounded px-3 py-2 resize-none focus:outline-none focus:ring-1 focus:ring-gray-300"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1">
              I&apos;ll call this validated when <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={successCriteria}
              onChange={(e) => setSuccessCriteria(e.target.value)}
              placeholder="3 qualified discovery calls booked in 7 days"
              className="w-full text-sm border border-gray-200 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-300"
            />
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-xs text-gray-500 block mb-1">Type</label>
              <select
                value={expType}
                onChange={(e) => setExpType(e.target.value)}
                className="w-full text-sm border border-gray-200 rounded px-2 py-1.5 focus:outline-none"
              >
                {EXPERIMENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="flex-1">
              <label className="text-xs text-gray-500 block mb-1">AARRR Stage</label>
              <select
                value={aarrr}
                onChange={(e) => setAarrr(e.target.value)}
                className="w-full text-sm border border-gray-200 rounded px-2 py-1.5 focus:outline-none"
              >
                {AARRR_STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          {formError && <p className="text-xs text-red-500">{formError}</p>}
          <button
            type="submit"
            disabled={isStarting}
            className="text-sm px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-700 disabled:opacity-50"
          >
            {isStarting ? "Starting…" : "Start Experiment"}
          </button>
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

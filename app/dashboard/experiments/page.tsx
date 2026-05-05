import { getActiveExperiments, getVelocityStats, getRecentLearnings } from "@/lib/learning/ghost-db";

export const dynamic = "force-dynamic";

function formatHours(h: number | null): string {
  if (h == null) return "—";
  if (h < 1) return `${Math.round(h * 60)}m`;
  return `${h}h`;
}

function formatRate(r: number | null): string {
  if (r == null) return "—";
  return `${(r * 100).toFixed(0)}%`;
}

function outcomeColor(outcome: string): string {
  if (outcome === "validated") return "text-green-600";
  if (outcome === "refuted") return "text-red-500";
  if (outcome === "inconclusive") return "text-yellow-500";
  return "text-blue-500";
}

export default async function ExperimentsPage() {
  const [active, stats, learnings] = await Promise.all([
    getActiveExperiments().catch(() => []),
    getVelocityStats().catch(() => ({ velocity_today: 0, velocity_week: 0, avg_cycle_hours: null, validation_rate: null })),
    getRecentLearnings(7).catch(() => []),
  ]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-10">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Innovation Loop</h1>
        <p className="text-sm text-gray-500 mt-1">idea → ship → signal → iterate</p>
      </div>

      {/* Velocity */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Today", value: stats.velocity_today },
          { label: "This week", value: stats.velocity_week },
          { label: "Avg cycle", value: formatHours(stats.avg_cycle_hours) },
          { label: "Validation rate", value: formatRate(stats.validation_rate) },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-xl border border-gray-200 p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">{value}</div>
            <div className="text-xs text-gray-500 mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* Active experiments */}
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-3">
          Active experiments ({active.length})
        </h2>
        {active.length === 0 ? (
          <p className="text-sm text-gray-400 italic">No active experiments. Start one via perea-mcp: start_experiment</p>
        ) : (
          <div className="space-y-3">
            {active.map((exp) => (
              <div key={exp.id} className="rounded-xl border border-gray-200 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{exp.hypothesis}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {exp.id}
                      {exp.project_tag && ` · ${exp.project_tag}`}
                      {" · started "}
                      {new Date(exp.started_at).toLocaleDateString()}
                      {exp.shipped_at && ` · shipped ${new Date(exp.shipped_at).toLocaleDateString()}`}
                    </p>
                  </div>
                  <span className={`text-xs font-medium shrink-0 ${outcomeColor(exp.outcome)}`}>
                    {exp.outcome === "in_progress" ? (exp.shipped_at ? "shipped" : "in progress") : exp.outcome}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent daily learnings */}
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
                  {dl.territory && (
                    <span className="text-xs text-gray-500 italic">{dl.territory}</span>
                  )}
                </div>
                {dl.raw_synthesis && (
                  <p className="text-sm text-gray-700">{dl.raw_synthesis}</p>
                )}
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

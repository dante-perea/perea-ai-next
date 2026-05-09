import { getActiveExperiments, getAllExperiments, getClosedExperiments, getDraftExperiments, getSignalsByExperimentMap, getVelocityStats, getRecentLearnings } from "@/lib/learning/ghost-db";
import { ExperimentsClient } from "@/components/dashboard/ExperimentsClient";
import { ExperimentsProto } from "@/components/dashboard/ExperimentsProto";

export const dynamic = "force-dynamic";

export default async function ExperimentsPage({
  searchParams,
}: {
  searchParams: Promise<{ variant?: string }>;
}) {
  const { variant } = await searchParams;
  const isProto = variant === "A" || variant === "B" || variant === "C";

  const [active, closed, drafts, signalsMap, stats, learnings, allForProto] = await Promise.all([
    getActiveExperiments().catch(() => []),
    getClosedExperiments(50).catch(() => []),
    getDraftExperiments().catch(() => []),
    getSignalsByExperimentMap().catch(() => ({})),
    getVelocityStats().catch(() => ({ velocity_today: 0, velocity_week: 0, avg_cycle_hours: null, validation_rate: null })),
    getRecentLearnings(7).catch(() => []),
    isProto ? getAllExperiments().catch(() => []) : Promise.resolve([]),
  ]);

  if (isProto) {
    return (
      <ExperimentsProto
        variant={variant as "A" | "B" | "C"}
        active={active}
        closed={closed}
        drafts={drafts}
        all={allForProto}
        signalsMap={signalsMap}
        velocityToday={stats.velocity_today}
        velocityWeek={stats.velocity_week}
        avgCycleHours={stats.avg_cycle_hours}
        validationRate={stats.validation_rate}
      />
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Innovation Loop</h1>
          <p className="text-sm text-gray-500 mt-1">idea → ship → signal → iterate</p>
        </div>
        <a
          href="?variant=A"
          className="text-xs px-3 py-1.5 rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50"
        >
          Try prototype UIs →
        </a>
      </div>

      <ExperimentsClient
        initialActive={active}
        initialClosed={closed}
        initialDrafts={drafts}
        signalsMap={signalsMap}
        learnings={learnings.map((dl) => ({
          date: String(dl.date),
          territory: dl.territory ?? null,
          raw_synthesis: dl.raw_synthesis ?? null,
          velocity_week: dl.velocity_week ?? null,
          avg_cycle_hours: dl.avg_cycle_hours ?? null,
          validation_rate: dl.validation_rate ?? null,
          next_implied_hypothesis: dl.next_implied_hypothesis ?? null,
        }))}
        velocityToday={stats.velocity_today}
        velocityWeek={stats.velocity_week}
        avgCycleHours={stats.avg_cycle_hours}
        validationRate={stats.validation_rate}
      />
    </div>
  );
}

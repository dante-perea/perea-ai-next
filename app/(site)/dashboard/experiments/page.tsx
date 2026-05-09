import { getActiveExperiments, getAllExperiments, getClosedExperiments, getDraftExperiments, getSignalsByExperimentMap, getVelocityStats, getRecentLearnings } from "@/lib/learning/ghost-db";
import { ExperimentsClient } from "@/components/dashboard/ExperimentsClient";

export const dynamic = "force-dynamic";

export default async function ExperimentsPage() {
  const [active, closed, drafts, all, signalsMap, stats, learnings] = await Promise.all([
    getActiveExperiments().catch(() => []),
    getClosedExperiments(50).catch(() => []),
    getDraftExperiments().catch(() => []),
    getAllExperiments().catch(() => []),
    getSignalsByExperimentMap().catch(() => ({})),
    getVelocityStats().catch(() => ({ velocity_today: 0, velocity_week: 0, avg_cycle_hours: null, strong_validation_rate: null, learning_rate: null })),
    getRecentLearnings(7).catch(() => []),
  ]);

  return (
    <ExperimentsClient
      initialActive={active}
      initialClosed={closed}
      initialDrafts={drafts}
      all={all}
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
      strongValidationRate={stats.strong_validation_rate}
      learningRate={stats.learning_rate}
    />
  );
}

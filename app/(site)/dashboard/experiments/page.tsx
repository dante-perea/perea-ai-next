import { getActiveExperiments, getClosedExperiments, getVelocityStats, getRecentLearnings } from "@/lib/learning/ghost-db";
import { ExperimentsClient } from "@/components/dashboard/ExperimentsClient";

export const dynamic = "force-dynamic";

export default async function ExperimentsPage() {
  const [active, closed, stats, learnings] = await Promise.all([
    getActiveExperiments().catch(() => []),
    getClosedExperiments(50).catch(() => []),
    getVelocityStats().catch(() => ({ velocity_today: 0, velocity_week: 0, avg_cycle_hours: null, validation_rate: null })),
    getRecentLearnings(7).catch(() => []),
  ]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Innovation Loop</h1>
        <p className="text-sm text-gray-500 mt-1">idea → ship → signal → iterate</p>
      </div>

      <ExperimentsClient
        initialActive={active}
        initialClosed={closed}
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

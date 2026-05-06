import { getRecentSignals, getOpportunities, getSignalCounts } from "@/lib/learning/market-signals-db";
import { SignalsClient } from "@/components/dashboard/SignalsClient";

export const dynamic = "force-dynamic";

export default async function SignalsPage() {
  const [signals, opportunities, counts] = await Promise.all([
    getRecentSignals(150).catch(() => []),
    getOpportunities().catch(() => []),
    getSignalCounts().catch(() => ({ github: 0, reddit: 0, trends: 0 })),
  ]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Opportunity Radar</h1>
        <p className="text-sm text-gray-500 mt-1">GitHub trending · Reddit pain · Google Trends → market gaps</p>
      </div>
      <SignalsClient
        initialSignals={signals.map((s) => ({
          ...s,
          fetched_at: s.fetched_at.toISOString(),
          raw: s.raw as Record<string, unknown>,
        }))}
        initialOpportunities={opportunities.map((o) => ({
          ...o,
          clustered_at: o.clustered_at.toISOString(),
        }))}
        counts={counts}
      />
    </div>
  );
}

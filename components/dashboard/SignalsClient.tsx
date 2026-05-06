"use client";

import { useState, useTransition } from "react";

type SignalSource = "github" | "reddit" | "trends";

interface Signal {
  id: string;
  source: SignalSource;
  title: string;
  url: string | null;
  score: number | null;
  tags: string[];
  raw: Record<string, unknown>;
  fetched_at: string;
}

interface OpportunityEvidence {
  title: string;
  source: string;
  url?: string;
}

interface Opportunity {
  id: string;
  theme: string;
  summary: string;
  evidence: OpportunityEvidence[];
  signal_count: number;
  confidence: "low" | "medium" | "high";
  clustered_at: string;
}

interface Props {
  initialSignals: Signal[];
  initialOpportunities: Opportunity[];
  counts: Record<SignalSource, number>;
}

const SOURCE_LABEL: Record<SignalSource, string> = {
  github: "GitHub",
  reddit: "Reddit",
  trends: "Trends",
};

const SOURCE_COLOR: Record<SignalSource, string> = {
  github: "bg-gray-900 text-white",
  reddit: "bg-orange-100 text-orange-700",
  trends: "bg-blue-100 text-blue-700",
};

const CONFIDENCE_COLOR: Record<string, string> = {
  high: "bg-green-100 text-green-700",
  medium: "bg-yellow-100 text-yellow-700",
  low: "bg-gray-100 text-gray-500",
};

export function SignalsClient({ initialSignals, initialOpportunities, counts }: Props) {
  const [signals, setSignals] = useState(initialSignals);
  const [opportunities, setOpportunities] = useState(initialOpportunities);
  const [sourceFilter, setSourceFilter] = useState<SignalSource | "all">("all");
  const [tab, setTab] = useState<"signals" | "opportunities">("opportunities");
  const [isIngesting, startIngest] = useTransition();
  const [isClustering, startCluster] = useTransition();
  const [status, setStatus] = useState<string | null>(null);

  const filtered = sourceFilter === "all" ? signals : signals.filter((s) => s.source === sourceFilter);

  function refreshAll() {
    startIngest(async () => {
      setStatus("Fetching signals…");
      const results = await Promise.allSettled([
        fetch("/api/signals/ingest/github", { method: "POST" }),
        fetch("/api/signals/ingest/reddit", { method: "POST" }),
        fetch("/api/signals/ingest/trends", { method: "POST" }),
      ]);
      const inserted = (
        await Promise.all(
          results.map(async (r) => {
            if (r.status === "fulfilled" && r.value.ok) {
              const d = await r.value.json();
              return d.inserted ?? 0;
            }
            return 0;
          })
        )
      ).reduce((a, b) => a + b, 0);
      setStatus(`Fetched ${inserted} new signals — reloading…`);
      const res = await fetch("/api/signals/list");
      if (res.ok) setSignals(await res.json());
      setStatus(null);
    });
  }

  function clusterOpportunities() {
    startCluster(async () => {
      setStatus("Clustering signals with AI…");
      const res = await fetch("/api/signals/cluster", { method: "POST" });
      if (res.ok) {
        const d = await res.json();
        setStatus(`Found ${d.opportunities} opportunities — reloading…`);
        const res2 = await fetch("/api/signals/opportunities");
        if (res2.ok) setOpportunities(await res2.json());
      } else {
        setStatus("Clustering failed");
      }
      setTimeout(() => setStatus(null), 3000);
    });
  }

  const totalSignals = counts.github + counts.reddit + counts.trends;

  return (
    <div className="space-y-4">
      {/* header controls */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex gap-1 text-xs text-gray-400">
          <span>{counts.github} GitHub</span>
          <span>·</span>
          <span>{counts.reddit} Reddit</span>
          <span>·</span>
          <span>{counts.trends} Trends</span>
          <span>·</span>
          <span className="font-medium text-gray-600">{totalSignals} total</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={clusterOpportunities}
            disabled={isClustering || totalSignals === 0}
            className="text-sm px-3 py-1.5 rounded-lg border border-blue-200 text-blue-700 hover:bg-blue-50 disabled:opacity-50"
          >
            {isClustering ? "Clustering…" : "Find Opportunities"}
          </button>
          <button
            onClick={refreshAll}
            disabled={isIngesting}
            className="text-sm px-3 py-1.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            {isIngesting ? "Fetching…" : "Refresh Signals"}
          </button>
        </div>
      </div>

      {status && (
        <div className="text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2">{status}</div>
      )}

      {/* tab switcher */}
      <div className="flex gap-1 border-b border-gray-100">
        {(["opportunities", "signals"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`pb-2 px-3 text-sm font-medium capitalize border-b-2 -mb-px transition-colors ${
              tab === t ? "border-gray-900 text-gray-900" : "border-transparent text-gray-400 hover:text-gray-600"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* opportunities tab */}
      {tab === "opportunities" && (
        <div className="space-y-3">
          {opportunities.length === 0 ? (
            <div className="text-sm text-gray-400 py-8 text-center">
              No opportunities yet — refresh signals then click "Find Opportunities"
            </div>
          ) : (
            opportunities.map((opp) => (
              <div key={opp.id} className="rounded-xl border border-gray-100 bg-white p-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-semibold text-gray-900">{opp.theme}</h3>
                  <span className={`text-xs px-1.5 py-0.5 rounded font-medium shrink-0 ${CONFIDENCE_COLOR[opp.confidence]}`}>
                    {opp.confidence}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{opp.summary}</p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {opp.evidence.map((e, i) => (
                    <span key={i} className="text-xs text-gray-400 bg-gray-50 rounded px-2 py-0.5">
                      {e.source}: {e.title.slice(0, 60)}{e.title.length > 60 ? "…" : ""}
                    </span>
                  ))}
                </div>
                <div className="text-xs text-gray-300 pt-0.5">{opp.signal_count} signals · clustered {new Date(opp.clustered_at).toLocaleDateString()}</div>
              </div>
            ))
          )}
        </div>
      )}

      {/* signals tab */}
      {tab === "signals" && (
        <div className="space-y-3">
          {/* source filter */}
          <div className="flex gap-1">
            {(["all", "github", "reddit", "trends"] as const).map((src) => (
              <button
                key={src}
                onClick={() => setSourceFilter(src)}
                className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                  sourceFilter === src
                    ? "bg-gray-900 text-white border-gray-900"
                    : "border-gray-200 text-gray-500 hover:border-gray-400"
                }`}
              >
                {src === "all" ? `All (${signals.length})` : `${SOURCE_LABEL[src]} (${counts[src]})`}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="text-sm text-gray-400 py-8 text-center">
              No signals yet — click "Refresh Signals" to fetch
            </div>
          ) : (
            filtered.map((s) => (
              <div key={s.id} className="rounded-xl border border-gray-100 bg-white p-4 space-y-1.5">
                <div className="flex items-start gap-2">
                  <span className={`text-xs px-1.5 py-0.5 rounded font-medium shrink-0 mt-0.5 ${SOURCE_COLOR[s.source]}`}>
                    {SOURCE_LABEL[s.source]}
                  </span>
                  {s.url ? (
                    <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-800 hover:underline leading-snug">
                      {s.title}
                    </a>
                  ) : (
                    <span className="text-sm text-gray-800 leading-snug">{s.title}</span>
                  )}
                </div>
                <div className="flex items-center gap-2 pl-8">
                  {s.score != null && (
                    <span className="text-xs text-gray-400">
                      {s.source === "github" ? `★ ${s.score.toLocaleString()}` : s.source === "reddit" ? `↑ ${s.score.toLocaleString()}` : `~${s.score.toLocaleString()} searches`}
                    </span>
                  )}
                  {s.tags.slice(0, 4).map((t) => (
                    <span key={t} className="text-xs text-gray-300 bg-gray-50 rounded px-1.5 py-0.5">{t}</span>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

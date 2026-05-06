import postgres from "postgres";

export type SignalSource = "github" | "reddit" | "trends";

export interface MarketSignal {
  id: string;
  source: SignalSource;
  title: string;
  url: string | null;
  score: number | null;
  tags: string[];
  raw: Record<string, unknown>;
  fetched_at: Date;
}

export interface Opportunity {
  id: string;
  theme: string;
  summary: string;
  evidence: { title: string; source: string; url?: string }[];
  signal_count: number;
  confidence: "low" | "medium" | "high";
  clustered_at: Date;
}

function db() {
  const url = process.env.GHOST_DATABASE_URL;
  if (!url) throw new Error("GHOST_DATABASE_URL not set");
  return postgres(url, { ssl: "require", max: 3 });
}

export async function insertSignals(signals: Omit<MarketSignal, "fetched_at">[]): Promise<void> {
  if (signals.length === 0) return;
  const sql = db();
  try {
    for (const s of signals) {
      await sql`
        INSERT INTO market_signals (id, source, title, url, score, tags, raw)
        VALUES (${s.id}, ${s.source}, ${s.title}, ${s.url ?? null}, ${s.score ?? null}, ${s.tags}, ${JSON.stringify(s.raw)})
        ON CONFLICT (id) DO NOTHING
      `;
    }
  } finally {
    await sql.end();
  }
}

export async function getRecentSignals(limit = 150): Promise<MarketSignal[]> {
  const sql = db();
  try {
    return await sql<MarketSignal[]>`
      SELECT * FROM market_signals ORDER BY fetched_at DESC LIMIT ${limit}
    `;
  } finally {
    await sql.end();
  }
}

export async function getSignalsSince(since: Date): Promise<MarketSignal[]> {
  const sql = db();
  try {
    return await sql<MarketSignal[]>`
      SELECT * FROM market_signals WHERE fetched_at >= ${since} ORDER BY score DESC NULLS LAST
    `;
  } finally {
    await sql.end();
  }
}

export async function upsertOpportunities(opps: Omit<Opportunity, "clustered_at">[]): Promise<void> {
  if (opps.length === 0) return;
  const sql = db();
  try {
    for (const o of opps) {
      await sql`
        INSERT INTO opportunities (id, theme, summary, evidence, signal_count, confidence)
        VALUES (${o.id}, ${o.theme}, ${o.summary}, ${JSON.stringify(o.evidence)}, ${o.signal_count}, ${o.confidence})
        ON CONFLICT (id) DO UPDATE
          SET theme        = EXCLUDED.theme,
              summary      = EXCLUDED.summary,
              evidence     = EXCLUDED.evidence,
              signal_count = EXCLUDED.signal_count,
              confidence   = EXCLUDED.confidence,
              clustered_at = NOW()
      `;
    }
  } finally {
    await sql.end();
  }
}

export async function getOpportunities(): Promise<Opportunity[]> {
  const sql = db();
  try {
    return await sql<Opportunity[]>`
      SELECT * FROM opportunities ORDER BY signal_count DESC, clustered_at DESC
    `;
  } finally {
    await sql.end();
  }
}

export async function clearOpportunities(): Promise<void> {
  const sql = db();
  try {
    await sql`DELETE FROM opportunities`;
  } finally {
    await sql.end();
  }
}

export async function getSignalCounts(): Promise<Record<SignalSource, number>> {
  const sql = db();
  try {
    const rows = await sql<{ source: SignalSource; n: string }[]>`
      SELECT source, COUNT(*) AS n FROM market_signals GROUP BY source
    `;
    const counts: Record<SignalSource, number> = { github: 0, reddit: 0, trends: 0 };
    for (const r of rows) counts[r.source] = Number(r.n);
    return counts;
  } finally {
    await sql.end();
  }
}

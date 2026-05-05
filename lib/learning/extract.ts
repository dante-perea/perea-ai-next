import { generateText } from "ai";
import { neon } from "@neondatabase/serverless";
import { get } from "@vercel/blob";
import { gateway } from "../ai";
import {
  getActiveExperiments,
  getVelocityStats,
  insertSignalsBulk,
  ghostDb,
  type Experiment,
} from "./ghost-db";

export type { Experiment };

export interface DailyLearning {
  date: string;
  territory: string;
  validated: Record<string, string>[];
  refuted: Record<string, string>[];
  inconclusive: Record<string, string>[];
  velocity_today: number;
  velocity_week: number;
  avg_cycle_hours: number | null;
  validation_rate: number | null;
  next_implied_hypothesis: string;
  raw_synthesis: string;
}

export { getActiveExperiments, getVelocityStats };

async function readBlob(blobUrl: string): Promise<string> {
  const result = await get(blobUrl, { access: "private" });
  if (!result || result.statusCode !== 200) return "";
  const reader = result.stream.getReader();
  const chunks: Uint8Array[] = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) chunks.push(value);
  }
  return Buffer.concat(chunks.map((c) => Buffer.from(c))).toString("utf-8");
}

export async function getYesterdaySessions(
  linkedSessionIds?: string[]
): Promise<{ id: string; content: string }[]> {
  const sql = neon(process.env.DATABASE_URL!);

  // If we have linked session IDs from active experiments, prefer exact matches.
  // Fall back to all recent sessions if none are linked.
  const rows = linkedSessionIds && linkedSessionIds.length > 0
    ? await sql`
        SELECT id, blob_url FROM kb_files
        WHERE 'session' = ANY(tags)
          AND id = ANY(${linkedSessionIds})
        LIMIT 20
      `
    : await sql`
        SELECT id, blob_url FROM kb_files
        WHERE 'session' = ANY(tags)
          AND uploaded_at >= NOW() - INTERVAL '2 days'
        ORDER BY uploaded_at DESC
        LIMIT 10
      `;

  const sessions = await Promise.all(
    rows.map(async (row) => ({
      id: row.id as string,
      content: await readBlob(row.blob_url as string),
    }))
  );
  return sessions.filter((s) => s.content.length > 100);
}

export async function extractAndSynthesize(
  sessions: { id: string; content: string }[],
  experiments: Experiment[]
): Promise<{
  synthesis: string;
  validated: Record<string, string>[];
  refuted: Record<string, string>[];
  inconclusive: Record<string, string>[];
  territory: string;
  next_hypothesis: string;
}> {
  const experimentSummary = experiments.length > 0
    ? experiments.map((e) => `- [${e.id}] ${e.hypothesis} (project: ${e.project_tag ?? "untagged"})`).join("\n")
    : "No active experiments.";

  const sessionDigest = sessions
    .slice(0, 5)
    .map((s) => `--- SESSION ${s.id} ---\n${s.content.slice(0, 3000)}`)
    .join("\n\n");

  const prompt = `You are a validated learning extractor for a startup founder. You read working sessions and extract what hypotheses were tested, what reality showed, and what to try next.

Sessions cover ALL startup work — not just code:
- Pricing: testing a price point, packaging, or payment structure
- Messaging: testing a headline, CTA, email subject, or value proposition
- Distribution: testing a channel (DMs, cold email, content, ads, partnerships)
- Business model: testing a revenue model, ICP definition, or positioning
- GTM: testing launch strategy, timing, or go-to-market approach
- Product: testing a feature, flow, onboarding step, or UX decision
- Code: testing a technical architecture or implementation decision

ACTIVE EXPERIMENTS (ideas being tracked):
${experimentSummary}

YESTERDAY'S SESSIONS (raw content):
${sessionDigest}

Extract a daily learning synthesis. Respond ONLY with valid JSON matching this schema:
{
  "territory": "one-line summary of what domain/project was worked on today",
  "validated": [{ "experiment_id": "matching experiment ID or null", "learning": "what was confirmed true", "experiment_type": "product|pricing|messaging|distribution|business_model|gtm|other", "aarrr_stage": "acquisition|activation|retention|referral|revenue|none" }],
  "refuted": [{ "experiment_id": "matching experiment ID or null", "learning": "what was shown false", "experiment_type": "...", "aarrr_stage": "..." }],
  "inconclusive": [{ "experiment_id": "matching experiment ID or null", "learning": "what is still unclear", "experiment_type": "...", "aarrr_stage": "..." }],
  "next_implied_hypothesis": "the single most important hypothesis to test next, given today's evidence",
  "synthesis": "3-5 sentence narrative of today's validated learning — what did reality say?"
}

Rules:
- Cover ALL domains: pricing, messaging, distribution, GTM, product, code. Not just technical work.
- The most valuable learnings are: (1) what was rejected and WHY, (2) what surprised the founder.
- Only include learnings grounded in the session content. No hallucination.
- Match learnings to experiment IDs where explicitly relevant. Use null if no match.
- If no hypothesis was tested today, say so honestly in synthesis.
- next_implied_hypothesis must be specific and falsifiable.`;

  let text: string;
  try {
    const result = await generateText({
      model: gateway("xai/grok-4.3"),
      messages: [{ role: "user", content: prompt }],
      maxTokens: 1024,
    });
    text = result.text;
  } catch (err) {
    console.warn("[extract] AI gateway error:", err);
    return { synthesis: "Extraction failed.", validated: [], refuted: [], inconclusive: [], territory: "unknown", next_hypothesis: "" };
  }

  try {
    const parsed = JSON.parse(text.replace(/```json\n?|\n?```/g, "").trim());
    return {
      synthesis: parsed.synthesis ?? "No synthesis available.",
      validated: parsed.validated ?? [],
      refuted: parsed.refuted ?? [],
      inconclusive: parsed.inconclusive ?? [],
      territory: parsed.territory ?? "unknown",
      next_hypothesis: parsed.next_implied_hypothesis ?? "",
    };
  } catch {
    return {
      synthesis: text,
      validated: [],
      refuted: [],
      inconclusive: [],
      territory: "unknown",
      next_hypothesis: "",
    };
  }
}

export async function writeSignalsFromLearnings(
  validated: Record<string, string>[],
  refuted: Record<string, string>[],
  inconclusive: Record<string, string>[]
): Promise<void> {
  const signals = [
    ...validated.map((v) => ({ experiment_id: v.experiment_id ?? null, source: "cron-extract", content: `[validated] ${v.learning}` })),
    ...refuted.map((v) => ({ experiment_id: v.experiment_id ?? null, source: "cron-extract", content: `[refuted] ${v.learning}` })),
    ...inconclusive.map((v) => ({ experiment_id: v.experiment_id ?? null, source: "cron-extract", content: `[inconclusive] ${v.learning}` })),
  ].filter((s) => s.content.length > 15);
  await insertSignalsBulk(signals);
}

export async function writeDailyLearning(learning: DailyLearning): Promise<void> {
  const db = ghostDb();
  try {
    await db`
      INSERT INTO daily_learnings (
        date, territory, validated, refuted, inconclusive,
        velocity_today, velocity_week, avg_cycle_hours, validation_rate,
        next_implied_hypothesis, raw_synthesis
      ) VALUES (
        ${learning.date}, ${learning.territory},
        ${JSON.stringify(learning.validated)},
        ${JSON.stringify(learning.refuted)},
        ${JSON.stringify(learning.inconclusive)},
        ${learning.velocity_today}, ${learning.velocity_week},
        ${learning.avg_cycle_hours}, ${learning.validation_rate},
        ${learning.next_implied_hypothesis}, ${learning.raw_synthesis}
      )
      ON CONFLICT (date) DO UPDATE SET
        territory               = EXCLUDED.territory,
        validated               = EXCLUDED.validated,
        refuted                 = EXCLUDED.refuted,
        inconclusive            = EXCLUDED.inconclusive,
        velocity_today          = EXCLUDED.velocity_today,
        velocity_week           = EXCLUDED.velocity_week,
        avg_cycle_hours         = EXCLUDED.avg_cycle_hours,
        validation_rate         = EXCLUDED.validation_rate,
        next_implied_hypothesis = EXCLUDED.next_implied_hypothesis,
        raw_synthesis           = EXCLUDED.raw_synthesis
    `;
  } finally {
    await db.end();
  }
}

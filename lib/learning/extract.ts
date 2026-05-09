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

export interface ProposedExperiment {
  hypothesis: string;
  outcome: "validated" | "refuted" | "inconclusive";
  learning: string;
  experiment_type: string;
  aarrr_stage: string;
}

// Validated Learning Taxonomy (extractor v2)
export interface ProposedExperimentV2 {
  loop_class: "L0" | "L1" | "L2";
  hypothesis: string;
  is_implied: boolean; // true if the hypothesis was inferred by LLM, not stated in session
  // For L1/L2 only:
  risk_dimension?: "VAL" | "USA" | "FEA" | "VIA";
  hypothesis_class?: "VAL-H" | "GRO-H";
  aarrr_stage?: "ACQ" | "ACT" | "RET" | "REF" | "REV";
  evidence_method?: "INT" | "OBS" | "FAK" | "CON" | "WOZ" | "AB" | "PAY";
  segment?: string;
  behavior?: string;
  metric?: string;
  threshold?: string;
  timeframe?: string;
  kill_threshold?: string;
  // Outcome (if extractable from session content):
  outcome?: "validated" | "refuted" | "inconclusive";
  learning?: string;
}

const TAXONOMY_PROMPT = `You are extracting structured experiments from a startup founder's working session.

EVERY session represents a bet about how to make the startup better. Even pure
engineering work ("I implemented X") implies a hypothesis: that shipping X will
change some user behavior. Your job is to surface that implied hypothesis in
falsifiable form, even when the founder didn't state it explicitly.

CLASSIFICATION:
- L0 — Only used for genuinely empty sessions, broken transcripts, or content with no user-facing change at all.
- L1 — Discovery experiment. Tests a belief about user behavior, market, willingness to pay, growth, or business model. Use this for the vast majority of sessions, including engineering work.
- L2 — Optimization A/B test on an existing live flow.

is_implied (boolean):
- false → the founder explicitly stated the hypothesis (e.g., "I'm testing whether…", "let's see if users…")
- true  → you derived the hypothesis from the implementation (engineering session, no explicit hypothesis stated). This is the COMMON case. Be transparent — mark as implied.

For L1/L2 you MUST fill every slot, even when implied. Make the inference precise:
- segment: who specifically is impacted by this change (a real user type, e.g., "early-stage AI founders in unifounder ICP", not "users")
- behavior: the specific user behavior the change is expected to produce
- metric: the specific metric capturing that behavior
- threshold: a numeric threshold the metric must hit (your best inference of what would make this change "successful")
- timeframe: time window (≤ 7 days)
- kill_threshold: numeric threshold below which to kill

Plus:
- risk_dimension: VAL (Value — will customers buy/use it), USA (Usability — can users figure it out), FEA (Feasibility — can we build/ship it), VIA (Viability — does it work for the business)
- hypothesis_class (L1 only): VAL-H (does product deliver value to user) or GRO-H (how do users discover/adopt it)
- aarrr_stage: ACQ | ACT | RET | REF | REV
- evidence_method: INT | OBS | FAK | CON | WOZ | AB | PAY

CRITICAL:
- Default to L1 with is_implied=true for engineering sessions. Generate the hypothesis from the implementation — what user behavior does this code change predict?
- DO NOT make up a fake user segment. Use the founder's known ICP context if obvious from filenames/projects (unifounder, perea-ai, 999x, ralph, aria, etc.). Otherwise use a precise segment description like "founders using ralph TUI", "users of the Aria companion", "viewers of perea.ai/research".
- Make thresholds concrete numbers. If you have to guess, guess plausibly (e.g., "≥ 30%", "≥ 5 users", "first-post within 24h").
- Output exactly ONE entry per session — one row per session for idempotency.
- L0 ONLY for empty/broken/junk sessions, NEVER for engineering work.

Return ONLY valid JSON:

{
  "loop_class": "L0" | "L1" | "L2",
  "is_implied": true | false,
  "hypothesis": "We believe that [behavior] for [segment] measured by [metric] hitting [threshold] within [timeframe]. Kill if below [kill_threshold].",

  "risk_dimension": "VAL|USA|FEA|VIA",
  "hypothesis_class": "VAL-H|GRO-H or null for L2",
  "aarrr_stage": "ACQ|ACT|RET|REF|REV",
  "evidence_method": "INT|OBS|FAK|CON|WOZ|AB|PAY",

  "segment": "specific user segment",
  "behavior": "specific user behavior expected",
  "metric": "specific measurable metric",
  "threshold": "numeric success threshold",
  "timeframe": "time window",
  "kill_threshold": "numeric kill threshold",

  "outcome": "validated|refuted|inconclusive if the session shows the result, else null",
  "learning": "one sentence on what reality showed (only if outcome is set)"
}`;

export async function extractFromSingleSession(
  sessionContent: string
): Promise<ProposedExperimentV2 | null> {
  if (sessionContent.length < 200) return null;

  const prompt = `${TAXONOMY_PROMPT}\n\nSESSION CONTENT:\n${sessionContent.slice(0, 12000)}`;

  let text: string;
  try {
    const result = await generateText({
      model: gateway("xai/grok-4.3"),
      messages: [{ role: "user", content: prompt }],
      maxOutputTokens: 800,
    });
    text = result.text;
  } catch (err) {
    console.warn("[extract.v2] AI gateway error:", err);
    return null;
  }

  const cleaned = text.replace(/```json\n?|\n?```/g, "").trim();
  try {
    const parsed = JSON.parse(cleaned);
    if (!parsed.loop_class || !["L0", "L1", "L2"].includes(parsed.loop_class)) {
      return null;
    }
    if (!parsed.hypothesis || typeof parsed.hypothesis !== "string") {
      return null;
    }
    return {
      loop_class: parsed.loop_class,
      is_implied: Boolean(parsed.is_implied),
      hypothesis: parsed.hypothesis.trim(),
      risk_dimension: parsed.risk_dimension ?? undefined,
      hypothesis_class: parsed.hypothesis_class ?? undefined,
      aarrr_stage: parsed.aarrr_stage ?? undefined,
      evidence_method: parsed.evidence_method ?? undefined,
      segment: parsed.segment ?? undefined,
      behavior: parsed.behavior ?? undefined,
      metric: parsed.metric ?? undefined,
      threshold: parsed.threshold ?? undefined,
      timeframe: parsed.timeframe ?? undefined,
      kill_threshold: parsed.kill_threshold ?? undefined,
      outcome: parsed.outcome ?? undefined,
      learning: parsed.learning ?? undefined,
    };
  } catch {
    return null;
  }
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
  proposed_experiments: ProposedExperiment[];
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
  "synthesis": "3-5 sentence narrative of today's validated learning — what did reality say?",
  "proposed_experiments": [
    {
      "hypothesis": "If I [action], then [outcome], because [reason] — one per distinct thing built/tried/shipped",
      "outcome": "validated | refuted | inconclusive",
      "learning": "one sentence: what reality showed about this hypothesis",
      "experiment_type": "product|pricing|messaging|distribution|business_model|gtm|other",
      "aarrr_stage": "acquisition|activation|retention|referral|revenue|none"
    }
  ]
}

Rules:
- Cover ALL domains: pricing, messaging, distribution, GTM, product, code. Not just technical work.
- The most valuable learnings are: (1) what was rejected and WHY, (2) what surprised the founder.
- Only include learnings grounded in the session content. No hallucination.
- Match learnings to experiment IDs where explicitly relevant. Use null if no match.
- If no hypothesis was tested today, say so honestly in synthesis.
- next_implied_hypothesis must be specific and falsifiable.
- proposed_experiments: extract every implicit hypothesis being tested — one per distinct feature, decision, or thing shipped. Must be falsifiable. Outcome based on whether the session shows it worked.`;

  let text: string;
  try {
    const result = await generateText({
      model: gateway("xai/grok-4.3"),
      messages: [{ role: "user", content: prompt }],
      maxOutputTokens: 1024,
    });
    text = result.text;
  } catch (err) {
    console.warn("[extract] AI gateway error:", err);
    return { synthesis: "Extraction failed.", validated: [], refuted: [], inconclusive: [], territory: "unknown", next_hypothesis: "", proposed_experiments: [] };
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
      proposed_experiments: parsed.proposed_experiments ?? [],
    };
  } catch {
    return {
      synthesis: text,
      validated: [],
      refuted: [],
      inconclusive: [],
      territory: "unknown",
      next_hypothesis: "",
      proposed_experiments: [],
    };
  }
}

export async function writeSignalsFromLearnings(
  validated: Record<string, string>[],
  refuted: Record<string, string>[],
  inconclusive: Record<string, string>[]
): Promise<void> {
  const validId = (id: string | undefined) =>
    id && /^exp-\d{4}-\d{2}-\d{2}-[a-z0-9]+$/.test(id) ? id : null;

  const signals = [
    ...validated.map((v) => ({ experiment_id: validId(v.experiment_id), source: "cron-extract", content: `[validated] ${v.learning}` })),
    ...refuted.map((v) => ({ experiment_id: validId(v.experiment_id), source: "cron-extract", content: `[refuted] ${v.learning}` })),
    ...inconclusive.map((v) => ({ experiment_id: validId(v.experiment_id), source: "cron-extract", content: `[inconclusive] ${v.learning}` })),
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

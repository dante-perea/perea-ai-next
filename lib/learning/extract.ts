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

The Validated Learning Taxonomy classifies every entry as one of three loop classes:

L0 — OPERATIONAL FIX: bug fix, infrastructure repair, refactor, deps upgrade, ops task. NOT a hypothesis test. The session describes "I fixed X," "I deployed Y," "I debugged Z." No user behavior tested. Most engineering work is L0.

L1 — DISCOVERY EXPERIMENT: tests a belief about user behavior, market demand, willingness to pay, growth mechanics, or business model. The session shows the founder testing a HYPOTHESIS against REALITY (users, market, payments).

L2 — OPTIMIZATION A/B: tests an incremental change on a live product flow with statistical comparison.

For L1 and L2, the hypothesis MUST follow the falsifiable structure with all six slots filled:
- segment: specific user segment (not "users" or "everyone")
- behavior: specific user behavior expected
- metric: specific metric capturing the behavior
- threshold: numeric threshold the metric must hit
- timeframe: time window for the test (must be ≤ 7 days)
- kill_threshold: numeric threshold below which the experiment is killed

Also classify L1/L2 by:
- risk_dimension: VAL (Value — will customers buy/use it), USA (Usability — can users figure it out), FEA (Feasibility — can we build it), VIA (Viability — does it work for the business)
- hypothesis_class (L1 only): VAL-H (Value hypothesis — does product deliver value to user), GRO-H (Growth hypothesis — how do users discover and adopt)
- aarrr_stage: ACQ, ACT, RET, REF, REV
- evidence_method: INT (interview), OBS (observation/replay), FAK (fake door / smoke test landing page), CON (concierge MVP), WOZ (Wizard of Oz), AB (A/B test), PAY (payment / pre-order)

CRITICAL RULES:
- DEFAULT TO L0. The vast majority of working sessions are operational. If you cannot extract a clear segment + measurable behavior + numeric threshold + kill criterion from the session, it is L0.
- DO NOT invent slots. If the session does not contain a real user segment, do not make one up. Classify as L0.
- Each session may produce 0 or 1 experiment row. If the session is purely L0 work, return one L0 entry summarizing what was fixed.
- Output exactly ONE entry per session. The whole point is to have one row per session for idempotency.

Return ONLY valid JSON matching this schema:

{
  "loop_class": "L0" | "L1" | "L2",
  "hypothesis": "for L1/L2: 'We believe that [change] for [segment] will result in [behavior]'. For L0: brief description of what was done in the session.",

  "risk_dimension": "VAL|USA|FEA|VIA or null for L0",
  "hypothesis_class": "VAL-H|GRO-H or null (L1 only, null for L2/L0)",
  "aarrr_stage": "ACQ|ACT|RET|REF|REV or null for L0",
  "evidence_method": "INT|OBS|FAK|CON|WOZ|AB|PAY or null for L0",

  "segment": "for L1/L2: specific user segment. null for L0.",
  "behavior": "for L1/L2: specific user behavior expected. null for L0.",
  "metric": "for L1/L2: specific measurable metric. null for L0.",
  "threshold": "for L1/L2: numeric success threshold. null for L0.",
  "timeframe": "for L1/L2: time window (e.g. '48 hours', '7 days'). null for L0.",
  "kill_threshold": "for L1/L2: numeric threshold below which to kill. null for L0.",

  "outcome": "validated|refuted|inconclusive if the session shows the result. null if test is not yet concluded.",
  "learning": "if outcome is set: one sentence summarizing what reality showed. null otherwise."
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

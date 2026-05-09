import postgres from "postgres";

export type LoopClass = "L0" | "L1" | "L2";
export type RiskDimension = "VAL" | "USA" | "FEA" | "VIA";
export type HypothesisClass = "VAL-H" | "GRO-H";
export type AarrrStage = "ACQ" | "ACT" | "RET" | "REF" | "REV";
export type EvidenceMethod = "INT" | "OBS" | "FAK" | "CON" | "WOZ" | "AB" | "PAY";
export type Confidence = "HIGH" | "MEDIUM" | "LOW";
export type Implication = "PERSEVERE" | "PIVOT" | "KILL" | "DOUBLE-DOWN";
export type GeneralizesTo = "THIS-ONLY" | "SEGMENT" | "MARKET" | "UNIVERSAL";
export type PivotType =
  | "Customer-Segment" | "Customer-Need" | "Channel" | "Pricing" | "Value-Prop"
  | "Zoom-In" | "Zoom-Out" | "Tech" | "Platform" | "Business-Model";

export interface SynthesisRecommendation {
  implication: Implication;
  learning: string;
  confidence: Confidence;
  generalizes_to: GeneralizesTo;
  pivot_type?: PivotType;
}

export interface Experiment {
  id: string;
  hypothesis: string;
  project_tag: string | null;
  session_id: string | null;
  started_at: Date;
  shipped_at: Date | null;
  outcome: string;
  learning: string | null;
  next_hypothesis: string | null;
  success_criteria: string | null;
  experiment_type: string | null;
  aarrr_stage: string | null;
  parent_experiment_id: string | null;
  verdict: string | null;
  feature_tag: string | null;
  // Validated Learning Taxonomy (extractor v2)
  loop_class: LoopClass | null;
  risk_dimension: RiskDimension | null;
  hypothesis_class: HypothesisClass | null;
  evidence_method: EvidenceMethod | null;
  segment: string | null;
  behavior: string | null;
  metric: string | null;
  threshold: string | null;
  timeframe: string | null;
  kill_threshold: string | null;
  confidence: Confidence | null;
  generalizes_to: string | null;
  pivot_type: string | null;
  next_bet_id: string | null;
  extractor_version: number;
  is_implied: boolean;
  is_draft: boolean;
  implication: Implication | null;
  // Snooze + AI synthesis (added 2026-05-09)
  snoozed_until: Date | null;
  synthesis_text: string | null;
  synthesis_recommendation: SynthesisRecommendation | null;
  synthesis_generated_at: Date | null;
}

export interface NewExperimentInput {
  id: string;
  hypothesis: string;
  loop_class: LoopClass;
  session_id?: string | null;
  project_tag?: string | null;
  // Required when loop_class is L1 or L2
  risk_dimension?: RiskDimension;
  hypothesis_class?: HypothesisClass;
  aarrr_stage?: AarrrStage;
  evidence_method?: EvidenceMethod;
  segment?: string;
  behavior?: string;
  metric?: string;
  threshold?: string;
  timeframe?: string;
  kill_threshold?: string;
  is_implied?: boolean;
}

export interface VelocityStats {
  velocity_today: number;
  velocity_week: number;
  avg_cycle_hours: number | null;
  validation_rate: number | null;
}

export function ghostDb() {
  const url = process.env.GHOST_DATABASE_URL;
  if (!url) throw new Error("GHOST_DATABASE_URL not set");
  return postgres(url, { ssl: "require", max: 3 });
}

export class TaxonomyValidationError extends Error {}

export function validateExperimentInput(input: NewExperimentInput): void {
  if (!input.loop_class) throw new TaxonomyValidationError("loop_class is required");
  if (input.loop_class === "L0") return;
  const required: (keyof NewExperimentInput)[] = [
    "risk_dimension", "aarrr_stage", "evidence_method",
    "segment", "behavior", "metric", "threshold", "timeframe", "kill_threshold",
  ];
  if (input.loop_class === "L1") required.push("hypothesis_class");
  for (const k of required) {
    if (!input[k] || String(input[k]).trim() === "") {
      throw new TaxonomyValidationError(`${k} is required for ${input.loop_class}`);
    }
  }
}

export async function createExperiment(input: NewExperimentInput): Promise<Experiment> {
  validateExperimentInput(input);
  const db = ghostDb();
  try {
    const rows = await db<Experiment[]>`
      INSERT INTO experiments (
        id, hypothesis, project_tag, session_id, loop_class,
        risk_dimension, hypothesis_class, aarrr_stage, evidence_method,
        segment, behavior, metric, threshold, timeframe, kill_threshold,
        extractor_version, is_implied
      )
      VALUES (
        ${input.id}, ${input.hypothesis}, ${input.project_tag ?? null},
        ${input.session_id ?? null}, ${input.loop_class},
        ${input.risk_dimension ?? null}, ${input.hypothesis_class ?? null},
        ${input.aarrr_stage ?? null}, ${input.evidence_method ?? null},
        ${input.segment ?? null}, ${input.behavior ?? null}, ${input.metric ?? null},
        ${input.threshold ?? null}, ${input.timeframe ?? null}, ${input.kill_threshold ?? null},
        2, ${input.is_implied ?? false}
      )
      RETURNING *
    `;
    return rows[0];
  } finally {
    await db.end();
  }
}

export async function sessionAlreadyProcessed(session_id: string, version = 2): Promise<boolean> {
  const db = ghostDb();
  try {
    const rows = await db<{ n: string }[]>`
      SELECT COUNT(*) AS n FROM experiments
      WHERE session_id = ${session_id} AND extractor_version >= ${version}
    `;
    return Number(rows[0]?.n ?? 0) > 0;
  } finally {
    await db.end();
  }
}

export async function getProcessedSessionIds(version = 2): Promise<Set<string>> {
  const db = ghostDb();
  try {
    const rows = await db<{ session_id: string }[]>`
      SELECT DISTINCT session_id FROM experiments
      WHERE session_id IS NOT NULL AND extractor_version >= ${version}
    `;
    return new Set(rows.map((r) => r.session_id));
  } finally {
    await db.end();
  }
}

export async function markShipped(id: string): Promise<Experiment | null> {
  const db = ghostDb();
  try {
    const rows = await db<Experiment[]>`
      UPDATE experiments SET shipped_at = NOW()
      WHERE id = ${id} AND shipped_at IS NULL
      RETURNING *
    `;
    return rows[0] ?? null;
  } finally {
    await db.end();
  }
}

export async function closeExperiment(
  id: string,
  outcome: "validated" | "refuted" | "inconclusive",
  learning: string,
  next_hypothesis?: string
): Promise<Experiment | null> {
  const db = ghostDb();
  try {
    const rows = await db<Experiment[]>`
      UPDATE experiments
      SET outcome = ${outcome},
          learning = ${learning},
          next_hypothesis = ${next_hypothesis ?? null},
          shipped_at = COALESCE(shipped_at, NOW())
      WHERE id = ${id}
      RETURNING *
    `;
    return rows[0] ?? null;
  } finally {
    await db.end();
  }
}

export interface Signal {
  id: number;
  experiment_id: string | null;
  source: string;
  content: string;
  created_at: Date;
  signal_type: string | null;
  evidence_weight: string | null;
  polarity: string | null;
}

export async function getSignalsForExperiment(experiment_id: string): Promise<Signal[]> {
  const db = ghostDb();
  try {
    return await db<Signal[]>`
      SELECT id, experiment_id, source, content, received_at AS created_at,
             signal_type, evidence_weight, polarity
      FROM signals
      WHERE experiment_id = ${experiment_id}
      ORDER BY received_at DESC
    `;
  } finally {
    await db.end();
  }
}

export async function getSignalsByExperimentMap(): Promise<Record<string, Signal[]>> {
  const db = ghostDb();
  try {
    const rows = await db<Signal[]>`
      SELECT id, experiment_id, source, content, received_at AS created_at,
             signal_type, evidence_weight, polarity
      FROM signals
      WHERE experiment_id IS NOT NULL
      ORDER BY received_at DESC
    `;
    const map: Record<string, Signal[]> = {};
    for (const r of rows) {
      if (!r.experiment_id) continue;
      (map[r.experiment_id] ||= []).push(r);
    }
    return map;
  } finally {
    await db.end();
  }
}

export async function snoozeExperiment(id: string, days: number): Promise<Experiment | null> {
  const db = ghostDb();
  try {
    const rows = await db<Experiment[]>`
      UPDATE experiments
      SET snoozed_until = NOW() + (${days} || ' days')::interval,
          synthesis_text = NULL,
          synthesis_recommendation = NULL,
          synthesis_generated_at = NULL
      WHERE id = ${id}
      RETURNING *
    `;
    return rows[0] ?? null;
  } finally {
    await db.end();
  }
}

export async function setSynthesis(
  id: string,
  text: string,
  recommendation: SynthesisRecommendation
): Promise<void> {
  const db = ghostDb();
  try {
    await db`
      UPDATE experiments
      SET synthesis_text = ${text},
          synthesis_recommendation = ${JSON.stringify(recommendation)}::jsonb,
          synthesis_generated_at = NOW()
      WHERE id = ${id}
    `;
  } finally {
    await db.end();
  }
}

// Experiments that have passed their snooze window AND don't yet have synthesis.
// Used by the resurface cron to know which ones need fresh AI synthesis.
export async function getDueWithoutSynthesis(): Promise<Experiment[]> {
  const db = ghostDb();
  try {
    return await db<Experiment[]>`
      SELECT * FROM experiments
      WHERE outcome = 'in_progress'
        AND is_draft = false
        AND snoozed_until IS NOT NULL
        AND snoozed_until < NOW()
        AND (synthesis_generated_at IS NULL OR synthesis_generated_at < snoozed_until)
      ORDER BY snoozed_until ASC
    `;
  } finally {
    await db.end();
  }
}

export async function insertSignal(
  experiment_id: string,
  source: string,
  content: string
): Promise<{ id: number }> {
  const db = ghostDb();
  try {
    const rows = await db<{ id: number }[]>`
      INSERT INTO signals (experiment_id, source, content)
      VALUES (${experiment_id}, ${source}, ${content})
      RETURNING id
    `;
    return rows[0];
  } finally {
    await db.end();
  }
}

export async function insertSignalsBulk(
  signals: { experiment_id: string | null; source: string; content: string }[]
): Promise<void> {
  if (signals.length === 0) return;
  const db = ghostDb();
  try {
    for (const s of signals) {
      await db`
        INSERT INTO signals (experiment_id, source, content)
        VALUES (${s.experiment_id ?? null}, ${s.source}, ${s.content})
      `;
    }
  } finally {
    await db.end();
  }
}

export async function getActiveExperiments(): Promise<Experiment[]> {
  const db = ghostDb();
  try {
    return await db<Experiment[]>`
      SELECT * FROM experiments
      WHERE outcome = 'in_progress' AND is_draft = false
      ORDER BY started_at DESC
    `;
  } finally {
    await db.end();
  }
}

export async function getDraftExperiments(): Promise<Experiment[]> {
  const db = ghostDb();
  try {
    return await db<Experiment[]>`
      SELECT * FROM experiments
      WHERE is_draft = true
      ORDER BY started_at DESC
    `;
  } finally {
    await db.end();
  }
}

export async function promoteDraft(id: string): Promise<Experiment | null> {
  const db = ghostDb();
  try {
    const rows = await db<Experiment[]>`
      UPDATE experiments
      SET is_draft = false, started_at = NOW()
      WHERE id = ${id} AND is_draft = true
      RETURNING *
    `;
    return rows[0] ?? null;
  } finally {
    await db.end();
  }
}

export interface StructuredCloseInput {
  id: string;
  verdict: "win" | "kill";
  implication: Implication;
  learning: string;          // one-sentence "we learned …"
  confidence: Confidence;
  generalizes_to: GeneralizesTo;
  pivot_type?: PivotType;    // required when implication = PIVOT
  next_bet_id?: string;      // set after the draft is created
}

export async function closeWithStructure(input: StructuredCloseInput): Promise<Experiment | null> {
  const outcome = input.verdict === "win" ? "validated" : "refuted";
  const db = ghostDb();
  try {
    const rows = await db<Experiment[]>`
      UPDATE experiments SET
        verdict        = ${input.verdict},
        outcome        = ${outcome},
        implication    = ${input.implication},
        learning       = ${input.learning},
        confidence     = ${input.confidence},
        generalizes_to = ${input.generalizes_to},
        pivot_type     = ${input.pivot_type ?? null},
        next_bet_id    = ${input.next_bet_id ?? null},
        shipped_at     = COALESCE(shipped_at, NOW())
      WHERE id = ${input.id}
      RETURNING *
    `;
    return rows[0] ?? null;
  } finally {
    await db.end();
  }
}

export async function setNextBetId(id: string, next_bet_id: string): Promise<void> {
  const db = ghostDb();
  try {
    await db`UPDATE experiments SET next_bet_id = ${next_bet_id} WHERE id = ${id}`;
  } finally {
    await db.end();
  }
}

export async function createDraftExperiment(input: NewExperimentInput & { parent_experiment_id?: string }): Promise<Experiment> {
  validateExperimentInput(input);
  const db = ghostDb();
  try {
    const rows = await db<Experiment[]>`
      INSERT INTO experiments (
        id, hypothesis, project_tag, session_id, loop_class,
        risk_dimension, hypothesis_class, aarrr_stage, evidence_method,
        segment, behavior, metric, threshold, timeframe, kill_threshold,
        extractor_version, is_implied, is_draft, parent_experiment_id
      )
      VALUES (
        ${input.id}, ${input.hypothesis}, ${input.project_tag ?? null},
        ${input.session_id ?? null}, ${input.loop_class},
        ${input.risk_dimension ?? null}, ${input.hypothesis_class ?? null},
        ${input.aarrr_stage ?? null}, ${input.evidence_method ?? null},
        ${input.segment ?? null}, ${input.behavior ?? null}, ${input.metric ?? null},
        ${input.threshold ?? null}, ${input.timeframe ?? null}, ${input.kill_threshold ?? null},
        2, true, true, ${input.parent_experiment_id ?? null}
      )
      RETURNING *
    `;
    return rows[0];
  } finally {
    await db.end();
  }
}

export async function getClosedExperiments(limit = 50): Promise<Experiment[]> {
  const db = ghostDb();
  try {
    return await db<Experiment[]>`
      SELECT * FROM experiments
      WHERE outcome != 'in_progress'
      ORDER BY started_at DESC
      LIMIT ${limit}
    `;
  } finally {
    await db.end();
  }
}

export async function updateExperimentTags(
  id: string,
  tags: { project_tag?: string | null; experiment_type?: string | null; feature_tag?: string | null }
): Promise<void> {
  const db = ghostDb();
  try {
    await db`
      UPDATE experiments SET
        project_tag    = COALESCE(${tags.project_tag ?? null}, project_tag),
        experiment_type = COALESCE(${tags.experiment_type ?? null}, experiment_type),
        feature_tag    = COALESCE(${tags.feature_tag ?? null}, feature_tag)
      WHERE id = ${id}
    `;
  } finally {
    await db.end();
  }
}

export async function getAllExperiments(): Promise<Experiment[]> {
  const db = ghostDb();
  try {
    return await db<Experiment[]>`SELECT * FROM experiments ORDER BY started_at DESC`;
  } finally {
    await db.end();
  }
}

export async function getVelocityStats(): Promise<VelocityStats> {
  const db = ghostDb();
  try {
    const [todayRow] = await db<{ n: string }[]>`
      SELECT COUNT(*) AS n FROM experiments
      WHERE started_at >= CURRENT_DATE
    `;
    const [weekRow] = await db<{
      hypotheses: string;
      avg_hours: string | null;
      val_rate: string | null;
    }[]>`
      SELECT
        COUNT(*) AS hypotheses,
        ROUND(AVG(EXTRACT(EPOCH FROM (shipped_at - started_at))/3600)::numeric, 1) AS avg_hours,
        ROUND((COUNT(CASE WHEN outcome = 'validated' THEN 1 END)::float
               / NULLIF(COUNT(CASE WHEN outcome != 'in_progress' THEN 1 END), 0))::numeric, 2) AS val_rate
      FROM experiments
      WHERE started_at >= NOW() - INTERVAL '7 days'
    `;
    return {
      velocity_today: Number(todayRow?.n ?? 0),
      velocity_week: Number(weekRow?.hypotheses ?? 0),
      avg_cycle_hours: weekRow?.avg_hours != null ? Number(weekRow.avg_hours) : null,
      validation_rate: weekRow?.val_rate != null ? Number(weekRow.val_rate) : null,
    };
  } finally {
    await db.end();
  }
}

export async function getRecentLearnings(limit = 7): Promise<{
  date: string;
  territory: string | null;
  raw_synthesis: string | null;
  validated: unknown;
  refuted: unknown;
  inconclusive: unknown;
  velocity_week: number | null;
  avg_cycle_hours: number | null;
  validation_rate: number | null;
  next_implied_hypothesis: string | null;
}[]> {
  const db = ghostDb();
  try {
    return await db`
      SELECT date, territory, raw_synthesis, validated, refuted, inconclusive,
             velocity_week, avg_cycle_hours, validation_rate, next_implied_hypothesis
      FROM daily_learnings
      ORDER BY date DESC
      LIMIT ${limit}
    `;
  } finally {
    await db.end();
  }
}

export async function setSuccessCriteria(id: string, criteria: string): Promise<void> {
  const db = ghostDb();
  try {
    await db`UPDATE experiments SET success_criteria = ${criteria} WHERE id = ${id}`;
  } finally {
    await db.end();
  }
}

export async function closeWithVerdict(
  id: string,
  verdict: "win" | "kill" | "need_more_data",
  learning: string
): Promise<Experiment | null> {
  const outcomeMap = { win: "validated", kill: "refuted", need_more_data: "inconclusive" } as const;
  const db = ghostDb();
  try {
    const rows = await db<Experiment[]>`
      UPDATE experiments
      SET verdict = ${verdict},
          outcome = ${outcomeMap[verdict]},
          learning = ${learning || null},
          shipped_at = COALESCE(shipped_at, NOW())
      WHERE id = ${id}
      RETURNING *
    `;
    return rows[0] ?? null;
  } finally {
    await db.end();
  }
}

export async function deleteExperiment(id: string): Promise<void> {
  const db = ghostDb();
  try {
    await db`DELETE FROM experiments WHERE id = ${id}`;
  } finally {
    await db.end();
  }
}

export function generateExperimentId(): string {
  const date = new Date().toISOString().split("T")[0];
  const suffix = Math.random().toString(36).slice(2, 5);
  return `exp-${date}-${suffix}`;
}

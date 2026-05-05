import postgres from "postgres";

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

export async function createExperiment(
  id: string,
  hypothesis: string,
  project_tag?: string,
  session_id?: string,
  opts?: {
    success_criteria?: string;
    experiment_type?: string;
    aarrr_stage?: string;
    parent_experiment_id?: string;
  }
): Promise<Experiment> {
  const db = ghostDb();
  try {
    const rows = await db<Experiment[]>`
      INSERT INTO experiments (
        id, hypothesis, project_tag, session_id,
        success_criteria, experiment_type, aarrr_stage, parent_experiment_id
      )
      VALUES (
        ${id}, ${hypothesis}, ${project_tag ?? null}, ${session_id ?? null},
        ${opts?.success_criteria ?? null}, ${opts?.experiment_type ?? null},
        ${opts?.aarrr_stage ?? null}, ${opts?.parent_experiment_id ?? null}
      )
      RETURNING *
    `;
    return rows[0];
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
    await db`
      INSERT INTO signals (experiment_id, source, content)
      SELECT * FROM ${db(signals.map((s) => ({
        experiment_id: s.experiment_id ?? null,
        source: s.source,
        content: s.content,
      })))}
    `;
  } finally {
    await db.end();
  }
}

export async function getActiveExperiments(): Promise<Experiment[]> {
  const db = ghostDb();
  try {
    return await db<Experiment[]>`
      SELECT * FROM experiments
      WHERE outcome = 'in_progress'
      ORDER BY started_at DESC
    `;
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

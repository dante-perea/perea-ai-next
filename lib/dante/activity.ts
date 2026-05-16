import postgres from "postgres";

// Reads day-grouped activity counts from the Ghost (Neon) experiments+signals
// schema. Used on the /dante route's "Updates" timeline. Counts only — no
// hypothesis or learning text crosses the trust boundary into the public page.

export interface DayActivity {
  date: string; // YYYY-MM-DD
  experiments_started: number;
  experiments_closed: number;
  signals: number;
}

function ghostDb() {
  const url = process.env.GHOST_DATABASE_URL;
  if (!url) throw new Error("GHOST_DATABASE_URL not set");
  return postgres(url, { ssl: "require", max: 3 });
}

export async function getDailyActivity(daysBack = 30): Promise<DayActivity[]> {
  const db = ghostDb();
  try {
    const rows = await db<DayActivity[]>`
      WITH days AS (
        SELECT generate_series(
          (CURRENT_DATE - (${daysBack}::int - 1))::date,
          CURRENT_DATE::date,
          '1 day'::interval
        )::date AS d
      ),
      started AS (
        SELECT started_at::date AS d, COUNT(*)::int AS n
        FROM experiments
        WHERE started_at >= CURRENT_DATE - (${daysBack}::int - 1)
        GROUP BY 1
      ),
      closed AS (
        SELECT shipped_at::date AS d, COUNT(*)::int AS n
        FROM experiments
        WHERE shipped_at IS NOT NULL
          AND outcome != 'in_progress'
          AND shipped_at >= CURRENT_DATE - (${daysBack}::int - 1)
        GROUP BY 1
      ),
      sigs AS (
        SELECT received_at::date AS d, COUNT(*)::int AS n
        FROM signals
        WHERE received_at >= CURRENT_DATE - (${daysBack}::int - 1)
        GROUP BY 1
      )
      SELECT
        to_char(days.d, 'YYYY-MM-DD') AS date,
        COALESCE(started.n, 0) AS experiments_started,
        COALESCE(closed.n, 0)  AS experiments_closed,
        COALESCE(sigs.n, 0)    AS signals
      FROM days
      LEFT JOIN started ON started.d = days.d
      LEFT JOIN closed  ON closed.d  = days.d
      LEFT JOIN sigs    ON sigs.d    = days.d
      WHERE COALESCE(started.n, 0) + COALESCE(closed.n, 0) + COALESCE(sigs.n, 0) > 0
      ORDER BY days.d DESC
    `;
    return rows;
  } finally {
    await db.end();
  }
}

import { neon } from "@neondatabase/serverless";
import { get } from "@vercel/blob";
import {
  getAllExperiments,
  getVelocityStats,
  createExperiment,
  closeExperiment,
  generateExperimentId,
} from "../lib/learning/ghost-db";
import {
  extractAndSynthesize,
  writeDailyLearning,
  writeSignalsFromLearnings,
} from "../lib/learning/extract";

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

async function getSessionsForDate(date: string): Promise<{ id: string; content: string }[]> {
  const sql = neon(process.env.DATABASE_URL!);
  const rows = await sql`
    SELECT id, blob_url FROM kb_files
    WHERE 'session' = ANY(tags)
      AND uploaded_at >= ${date}::timestamptz
      AND uploaded_at < (${date}::date + INTERVAL '1 day')::timestamptz
    ORDER BY uploaded_at ASC
  `;
  const sessions = await Promise.all(
    rows.map(async (r) => ({
      id: r.id as string,
      content: await readBlob(r.blob_url as string),
    }))
  );
  return sessions.filter((s) => s.content.length > 100);
}

async function main() {
  const sql = neon(process.env.DATABASE_URL!);

  const dateRows = await sql`
    SELECT DISTINCT TO_CHAR(uploaded_at AT TIME ZONE 'UTC', 'YYYY-MM-DD') AS date FROM kb_files
    WHERE 'session' = ANY(tags)
    ORDER BY date ASC
  `;

  const dates = dateRows.map((r) => String(r.date));
  if (dates.length === 0) {
    console.log("No sessions found.");
    return;
  }
  console.log(`Found ${dates.length} days to backfill: ${dates[0]} → ${dates[dates.length - 1]}`);

  const [experiments, stats] = await Promise.all([getAllExperiments(), getVelocityStats()]);
  console.log(`Loaded ${experiments.length} experiments.\n`);

  for (const date of dates) {
    process.stdout.write(`${date}... `);
    const sessions = await getSessionsForDate(date);
    if (sessions.length === 0) {
      console.log("no readable sessions, skipping.");
      continue;
    }

    const { synthesis, validated, refuted, inconclusive, territory, next_hypothesis, proposed_experiments } =
      await extractAndSynthesize(sessions, experiments);

    await writeDailyLearning({
      date,
      territory,
      validated,
      refuted,
      inconclusive,
      velocity_today: stats.velocity_today,
      velocity_week: stats.velocity_week,
      avg_cycle_hours: stats.avg_cycle_hours,
      validation_rate: stats.validation_rate,
      next_implied_hypothesis: next_hypothesis,
      raw_synthesis: synthesis,
    });

    await writeSignalsFromLearnings(validated, refuted, inconclusive);

    // Create retroactive experiment records from AI-inferred hypotheses
    for (const pe of proposed_experiments) {
      if (!pe.hypothesis?.trim() || !pe.learning?.trim()) continue;
      const id = generateExperimentId();
      await createExperiment(id, pe.hypothesis.trim(), undefined, undefined, {
        experiment_type: pe.experiment_type,
        aarrr_stage: pe.aarrr_stage,
      });
      const outcome = ["validated", "refuted", "inconclusive"].includes(pe.outcome)
        ? pe.outcome as "validated" | "refuted" | "inconclusive"
        : "inconclusive";
      await closeExperiment(id, outcome, pe.learning.trim());
    }

    console.log(`done — ${sessions.length} sessions · ${validated.length}✓ ${refuted.length}✗ ${inconclusive.length}? · ${proposed_experiments.length} experiments created`);

    await new Promise((r) => setTimeout(r, 1500));
  }

  console.log("\nBackfill complete.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

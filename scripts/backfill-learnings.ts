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
  type ProposedExperiment,
} from "../lib/learning/extract";

const BATCH_SIZE = 20;

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
    console.log(`\n${date}`);
    const sessions = await getSessionsForDate(date);
    if (sessions.length === 0) {
      console.log("  no readable sessions, skipping.");
      continue;
    }

    // Split into batches
    const batches: typeof sessions[] = [];
    for (let i = 0; i < sessions.length; i += BATCH_SIZE) {
      batches.push(sessions.slice(i, i + BATCH_SIZE));
    }
    console.log(`  ${sessions.length} sessions → ${batches.length} batches of ${BATCH_SIZE}`);

    let primarySynthesis = "";
    let primaryTerritory = "unknown";
    let primaryNextHypothesis = "";
    let allValidated: Record<string, string>[] = [];
    let allRefuted: Record<string, string>[] = [];
    let allInconclusive: Record<string, string>[] = [];
    const allProposed: ProposedExperiment[] = [];

    for (let b = 0; b < batches.length; b++) {
      process.stdout.write(`  batch ${b + 1}/${batches.length}... `);
      const result = await extractAndSynthesize(batches[b], experiments);

      if (b === 0) {
        primarySynthesis = result.synthesis;
        primaryTerritory = result.territory;
        primaryNextHypothesis = result.next_hypothesis;
      }
      allValidated = allValidated.concat(result.validated);
      allRefuted = allRefuted.concat(result.refuted);
      allInconclusive = allInconclusive.concat(result.inconclusive);
      allProposed.push(...result.proposed_experiments);

      console.log(`${result.proposed_experiments.length} experiments extracted`);
      await new Promise((r) => setTimeout(r, 1200));
    }

    await writeDailyLearning({
      date,
      territory: primaryTerritory,
      validated: allValidated,
      refuted: allRefuted,
      inconclusive: allInconclusive,
      velocity_today: stats.velocity_today,
      velocity_week: stats.velocity_week,
      avg_cycle_hours: stats.avg_cycle_hours,
      validation_rate: stats.validation_rate,
      next_implied_hypothesis: primaryNextHypothesis,
      raw_synthesis: primarySynthesis,
    });

    await writeSignalsFromLearnings(allValidated, allRefuted, allInconclusive);

    // DEPRECATED: this script predates the Validated Learning Taxonomy (extractor v2).
    // New backfill is scripts/backfill-experiments-v2.ts. Entries here are written as L0
    // so they don't pollute the L1/L2 learning corpus.
    let created = 0;
    for (const pe of allProposed) {
      if (!pe.hypothesis?.trim() || !pe.learning?.trim()) continue;
      try {
        const id = generateExperimentId();
        await createExperiment({ id, hypothesis: pe.hypothesis.trim(), loop_class: "L0" });
        const outcome = ["validated", "refuted", "inconclusive"].includes(pe.outcome)
          ? pe.outcome as "validated" | "refuted" | "inconclusive"
          : "inconclusive";
        await closeExperiment(id, outcome, pe.learning.trim());
        created++;
      } catch (err) {
        console.warn(`  skipped experiment: ${err instanceof Error ? err.message : err}`);
      }
    }

    console.log(`  → ${created} experiments created · ${allValidated.length}✓ ${allRefuted.length}✗ ${allInconclusive.length}?`);
  }

  console.log("\nBackfill complete.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

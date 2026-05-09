// Per-session backfill using the Validated Learning Taxonomy (extractor v2).
// Iterates every kb_files row tagged 'session', skips sessions already
// processed at version >= 2, calls Grok 4.3 with the new taxonomy prompt,
// writes one experiment row per session (L0 placeholder for ops sessions).
//
// Usage:
//   pnpm tsx scripts/backfill-experiments-v2.ts [--limit N] [--wipe] [--dry-run]

import { config as loadEnv } from "dotenv";
import path from "node:path";
loadEnv({ path: path.resolve(process.cwd(), ".env.local") });
loadEnv(); // also pull from .env if present
import { neon } from "@neondatabase/serverless";
import { get } from "@vercel/blob";
import {
  createExperiment,
  closeExperiment,
  generateExperimentId,
  sessionAlreadyProcessed,
  ghostDb,
  type NewExperimentInput,
} from "../lib/learning/ghost-db";
import { extractFromSingleSession } from "../lib/learning/extract";

interface SessionRow {
  id: string;
  blob_url: string;
  filename: string;
}

const args = new Set(process.argv.slice(2));
const LIMIT = (() => {
  const i = process.argv.indexOf("--limit");
  return i > -1 ? Number(process.argv[i + 1]) : Infinity;
})();
const WIPE = args.has("--wipe");
const DRY = args.has("--dry-run");

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

async function listSessions(): Promise<SessionRow[]> {
  const sql = neon(process.env.DATABASE_URL_UNPOOLED!);
  const rows = await sql`
    SELECT id, blob_url, filename FROM kb_files
    WHERE 'session' = ANY(tags)
    ORDER BY uploaded_at ASC
  `;
  return rows as SessionRow[];
}

async function wipe(): Promise<void> {
  const db = ghostDb();
  try {
    await db`DELETE FROM signals`;
    await db`DELETE FROM daily_learnings`;
    await db`DELETE FROM experiments`;
    console.log("✓ wiped experiments / signals / daily_learnings");
  } finally {
    await db.end();
  }
}

async function main(): Promise<void> {
  if (WIPE) {
    if (DRY) {
      console.log("[dry-run] would wipe experiments + signals + daily_learnings");
    } else {
      await wipe();
    }
  }

  const sessions = await listSessions();
  console.log(`Found ${sessions.length} session files. Limit: ${LIMIT}`);

  let processed = 0;
  let skipped = 0;
  let errors = 0;
  const counts = { L0: 0, L1: 0, L2: 0 };

  for (const session of sessions) {
    if (processed >= LIMIT) break;

    const already = await sessionAlreadyProcessed(session.id, 2);
    if (already) {
      skipped++;
      continue;
    }

    const content = await readBlob(session.blob_url).catch(() => "");
    if (content.length < 200) {
      skipped++;
      continue;
    }

    const result = await extractFromSingleSession(content);
    if (!result) {
      // Write an L0 placeholder so we don't reprocess this session next run
      if (!DRY) {
        await createExperiment({
          id: generateExperimentId(),
          hypothesis: `[no extractable hypothesis] ${session.filename}`,
          loop_class: "L0",
          session_id: session.id,
        }).catch((e) => console.warn(`  placeholder failed for ${session.id}:`, e));
      }
      counts.L0++;
      processed++;
      console.log(`[${processed}/${sessions.length}] ${session.filename} → L0 (placeholder)`);
      continue;
    }

    counts[result.loop_class]++;

    if (DRY) {
      console.log(`[${processed + 1}] ${session.filename} → ${result.loop_class}`);
      console.log(`  hypothesis: ${result.hypothesis.slice(0, 100)}…`);
      processed++;
      continue;
    }

    const id = generateExperimentId();
    const input: NewExperimentInput = {
      id,
      hypothesis: result.hypothesis,
      loop_class: result.loop_class,
      session_id: session.id,
      risk_dimension: result.risk_dimension,
      hypothesis_class: result.hypothesis_class,
      aarrr_stage: result.aarrr_stage,
      evidence_method: result.evidence_method,
      segment: result.segment,
      behavior: result.behavior,
      metric: result.metric,
      threshold: result.threshold,
      timeframe: result.timeframe,
      kill_threshold: result.kill_threshold,
    };

    try {
      await createExperiment(input);
      // If the session shows a conclusive outcome, close the experiment now
      if (result.outcome && result.learning) {
        await closeExperiment(id, result.outcome, result.learning);
      }
      processed++;
      const tail = result.loop_class === "L0" ? "" : ` (${result.risk_dimension}·${result.aarrr_stage})`;
      console.log(`[${processed}/${sessions.length}] ${session.filename} → ${result.loop_class}${tail}`);
    } catch (err) {
      errors++;
      console.warn(`  ✗ ${session.filename}:`, err instanceof Error ? err.message : err);
      // Fall back to L0 placeholder so this session is not retried each run
      try {
        await createExperiment({
          id: generateExperimentId(),
          hypothesis: `[validation failed] ${session.filename}`,
          loop_class: "L0",
          session_id: session.id,
        });
      } catch {}
    }
  }

  console.log("\n────── Summary ──────");
  console.log(`Processed: ${processed}`);
  console.log(`Skipped (already processed):  ${skipped}`);
  console.log(`Errors:    ${errors}`);
  console.log(`L0:        ${counts.L0}`);
  console.log(`L1:        ${counts.L1}`);
  console.log(`L2:        ${counts.L2}`);
}

main().then(() => process.exit(0)).catch((err) => {
  console.error(err);
  process.exit(1);
});

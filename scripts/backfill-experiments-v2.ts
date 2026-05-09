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
  getProcessedSessionIds,
  ghostDb,
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
const CONCURRENCY = (() => {
  const i = process.argv.indexOf("--concurrency");
  return i > -1 ? Number(process.argv[i + 1]) : 8;
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
  console.log(`Found ${sessions.length} session files. Limit: ${LIMIT} · Concurrency: ${CONCURRENCY}`);

  // One query, not 596 — pull all already-processed session ids in bulk
  const already = await getProcessedSessionIds(2);
  const work: SessionRow[] = [];
  let skipped = 0;
  for (const s of sessions) {
    if (work.length >= LIMIT) break;
    if (already.has(s.id)) { skipped++; continue; }
    work.push(s);
  }
  console.log(`To process: ${work.length} (skipping ${skipped} already at v2)`);

  let processed = 0;
  let errors = 0;
  const counts = { L0: 0, L1: 0, L2: 0 };
  const total = work.length;

  async function processOne(session: SessionRow): Promise<void> {
    const content = await readBlob(session.blob_url).catch(() => "");
    if (content.length < 200) {
      // Still write a placeholder so we don't keep retrying empty sessions
      if (!DRY) {
        await createExperiment({
          id: generateExperimentId(),
          hypothesis: `[empty session] ${session.filename}`,
          loop_class: "L0",
          session_id: session.id,
        }).catch(() => {});
      }
      counts.L0++;
      const idx = ++processed;
      console.log(`[${idx}/${total}] ${session.filename} → L0 (empty)`);
      return;
    }

    const result = await extractFromSingleSession(content);

    if (!result) {
      if (!DRY) {
        await createExperiment({
          id: generateExperimentId(),
          hypothesis: `[no extractable hypothesis] ${session.filename}`,
          loop_class: "L0",
          session_id: session.id,
        }).catch(() => {});
      }
      counts.L0++;
      const idx = ++processed;
      console.log(`[${idx}/${total}] ${session.filename} → L0 (placeholder)`);
      return;
    }

    counts[result.loop_class]++;

    if (DRY) {
      const idx = ++processed;
      console.log(`[${idx}/${total}] ${session.filename} → ${result.loop_class}`);
      return;
    }

    const id = generateExperimentId();
    try {
      await createExperiment({
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
        is_implied: result.is_implied,
      });
      if (result.outcome && result.learning) {
        await closeExperiment(id, result.outcome, result.learning);
      }
      const idx = ++processed;
      const tail = result.loop_class === "L0" ? "" : ` (${result.risk_dimension}·${result.aarrr_stage})`;
      console.log(`[${idx}/${total}] ${session.filename} → ${result.loop_class}${tail}`);
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

  // Worker-pool concurrency: each worker pulls the next item until queue is empty.
  let cursor = 0;
  async function worker(): Promise<void> {
    while (true) {
      const i = cursor++;
      if (i >= work.length) return;
      await processOne(work[i]);
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, () => worker()));

  const elapsed = Math.round((Date.now() - startTime) / 1000);
  console.log("\n────── Summary ──────");
  console.log(`Processed: ${processed} in ${elapsed}s (${(processed / Math.max(1, elapsed)).toFixed(2)}/s)`);
  console.log(`Skipped (already processed): ${skipped}`);
  console.log(`Errors:    ${errors}`);
  console.log(`L0:        ${counts.L0}`);
  console.log(`L1:        ${counts.L1}`);
  console.log(`L2:        ${counts.L2}`);
}

const startTime = Date.now();

main().then(() => process.exit(0)).catch((err) => {
  console.error(err);
  process.exit(1);
});

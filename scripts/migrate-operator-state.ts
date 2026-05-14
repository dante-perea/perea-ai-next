/**
 * migrate-operator-state.ts
 *
 * One-off migration for the operator-console tables (roadmap_entries,
 * x_queue_entries, seeds, removal_requests). Run via:
 *
 *   npx tsx --env-file=.env.local scripts/migrate-operator-state.ts
 *
 * Idempotent — all DDL uses CREATE TABLE IF NOT EXISTS / CREATE INDEX IF NOT
 * EXISTS. Safe to re-run.
 */
import { neon } from "@neondatabase/serverless";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const sql = neon((process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL ?? process.env.POSTGRES_URL)!);

async function migrate() {
  const schema = readFileSync(
    join(__dirname, "..", "lib", "operator-state-schema.sql"),
    "utf-8"
  );
  await sql.query(schema);
  console.log("Migration complete — operator-state tables ready.");
}

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});

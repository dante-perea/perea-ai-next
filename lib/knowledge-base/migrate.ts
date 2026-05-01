import { neon } from "@neondatabase/serverless";
import { readFileSync } from "fs";
import { join } from "path";

const sql = neon(process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL!);

async function migrate() {
  const schema = readFileSync(join(__dirname, "schema.sql"), "utf-8");
  await sql.query(schema);
  console.log("Migration complete — kb_files table ready.");
}

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});

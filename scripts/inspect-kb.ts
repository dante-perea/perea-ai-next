import { neon } from "@neondatabase/serverless";

async function main() {
  const sql = neon(process.env.DATABASE_URL!);

  const [total] = await sql`SELECT COUNT(*) as total FROM kb_files`;
  console.log("total rows:", total.total);

  const tags = await sql`
    SELECT unnest(tags) as tag, COUNT(*) as count
    FROM kb_files
    GROUP BY tag
    ORDER BY count DESC
    LIMIT 20
  `;
  console.log("\ntag distribution:");
  tags.forEach((r) => console.log(` ${r.tag}: ${r.count}`));

  const [sessionCount] = await sql`SELECT COUNT(*) as n FROM kb_files WHERE 'session' = ANY(tags)`;
  console.log("\nsession-tagged rows:", sessionCount.n);

  const sample = await sql`
    SELECT id, tags, uploaded_at, blob_url
    FROM kb_files
    WHERE 'session' = ANY(tags)
    ORDER BY uploaded_at DESC
    LIMIT 3
  `;
  console.log("\nlatest 3 sessions:", JSON.stringify(sample, null, 2));
}

main().catch((e) => { console.error(e); process.exit(1); });

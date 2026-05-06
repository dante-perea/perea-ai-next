import { neon } from "@neondatabase/serverless";

function sql() {
  return neon((process.env.POSTGRES_URL ?? process.env.DATABASE_URL)!);
}

export async function getTranslation(slug: string, locale: string): Promise<string | null> {
  const db = sql();
  const rows = await db`
    SELECT markdown FROM research_translations
    WHERE slug = ${slug} AND locale = ${locale}
    LIMIT 1
  ` as { markdown: string }[];
  return rows[0]?.markdown ?? null;
}

export async function upsertTranslation(slug: string, locale: string, markdown: string): Promise<void> {
  const db = sql();
  await db`
    INSERT INTO research_translations (slug, locale, markdown)
    VALUES (${slug}, ${locale}, ${markdown})
    ON CONFLICT (slug, locale) DO UPDATE
      SET markdown = EXCLUDED.markdown,
          created_at = NOW()
  `;
}

export async function listTranslatedSlugs(locale: string): Promise<string[]> {
  const db = sql();
  const rows = await db`
    SELECT slug FROM research_translations WHERE locale = ${locale} ORDER BY created_at DESC
  ` as { slug: string }[];
  return rows.map((r) => r.slug);
}

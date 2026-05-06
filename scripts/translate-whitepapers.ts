/**
 * Translates all EN whitepapers to Spanish using Grok 4.3.
 * Writes output to content/whitepapers/es/[slug].md.
 * Skips files that already exist — safe to re-run.
 *
 * Usage:
 *   pnpm translate
 *   pnpm translate -- --slug agent-payment-stack-2026   (single paper)
 *   pnpm translate -- --force                           (regenerate existing)
 */

import fs from "node:fs";
import path from "node:path";
import Anthropic from "@anthropic-ai/sdk";
import { neon } from "@neondatabase/serverless";

const WHITEPAPERS_DIR = path.join(process.cwd(), "content", "whitepapers");
const ES_DIR = path.join(WHITEPAPERS_DIR, "es");

const args = process.argv.slice(2);
const targetSlug = args.includes("--slug") ? args[args.indexOf("--slug") + 1] : null;
const force = args.includes("--force");

const TRANSLATION_PROMPT = (slug: string, enContent: string) => `You are a professional technical translator specializing in AI infrastructure, fintech, and startup content. Translate the following research whitepaper from English to Latin American Spanish (es-419).

STRICT RULES:
- Preserve ALL markdown formatting exactly: headings (#, ##, etc.), bold (**), italic (*), tables, code blocks, lists, footnotes ([^1]), horizontal rules (---), blockquotes (>)
- Preserve ALL YAML frontmatter fields. Translate only the VALUES of: title, subtitle, description, audience. Keep all other fields (publication, authors, version, status, date, length, license) exactly as-is.
- Add two new frontmatter fields at the end of the frontmatter block: lang: es  and  translationOf: ${slug}
- Keep English technical terms that are universally used in Spanish tech contexts: "agent", "API", "token", "payload", "middleware", "SDK", "stack", "blockchain", "mainnet", "stablecoin", "whitepaper", "settlement", "checkout", "wallet", "protocol" — do NOT translate these.
- Translate all prose, headings, and non-code content naturally for a Latin American professional audience.
- Preserve ALL footnote references ([^1], [^2], etc.) and their definitions exactly.
- Preserve ALL URLs, code snippets, and variable names exactly.
- Return ONLY the translated markdown. No preamble, no explanation, no markdown code fence around the output.

WHITEPAPER TO TRANSLATE:
---
${enContent}`;

async function translatePaper(slug: string, enContent: string): Promise<string> {
  // Use Anthropic SDK directly — works locally without gateway
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const message = await client.messages.create({
    model: "claude-opus-4-7",
    max_tokens: 16000,
    messages: [{ role: "user", content: TRANSLATION_PROMPT(slug, enContent) }],
  });
  const block = message.content[0];
  if (block.type !== "text") throw new Error("Unexpected response type");
  return block.text.trim();
}

async function upsertTranslation(slug: string, locale: string, markdown: string): Promise<void> {
  const db = neon((process.env.POSTGRES_URL ?? process.env.DATABASE_URL)!);
  await db`
    INSERT INTO research_translations (slug, locale, markdown)
    VALUES (${slug}, ${locale}, ${markdown})
    ON CONFLICT (slug, locale) DO UPDATE
      SET markdown = EXCLUDED.markdown, created_at = NOW()
  `;
}

async function translationExists(slug: string): Promise<boolean> {
  const db = neon((process.env.POSTGRES_URL ?? process.env.DATABASE_URL)!);
  const rows = await db`SELECT 1 FROM research_translations WHERE slug = ${slug} AND locale = 'es' LIMIT 1`;
  return (rows as unknown[]).length > 0;
}

async function main() {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("❌ ANTHROPIC_API_KEY not set. Add it to .env.local or your environment.");
    process.exit(1);
  }
  if (!(process.env.POSTGRES_URL ?? process.env.DATABASE_URL)) {
    console.error("❌ POSTGRES_URL not set.");
    process.exit(1);
  }

  const files = fs
    .readdirSync(WHITEPAPERS_DIR)
    .filter((f) => f.endsWith(".md") && !f.startsWith("."));

  const toProcess = targetSlug
    ? files.filter((f) => f === `${targetSlug}.md`)
    : files;

  if (toProcess.length === 0) {
    console.log(targetSlug ? `No file found for slug: ${targetSlug}` : "No whitepapers found.");
    process.exit(0);
  }

  for (const file of toProcess) {
    const slug = file.replace(/\.md$/, "");

    if (!force && await translationExists(slug)) {
      console.log(`⏭  ${slug} — already in DB, skipping (use --force to regenerate)`);
      continue;
    }

    const enContent = fs.readFileSync(path.join(WHITEPAPERS_DIR, file), "utf8");
    console.log(`🌐 Translating ${slug} (${Math.round(enContent.length / 1000)}k chars)…`);

    try {
      const esContent = await translatePaper(slug, enContent);
      await upsertTranslation(slug, "es", esContent);
      // Also write to filesystem as backup
      if (!fs.existsSync(ES_DIR)) fs.mkdirSync(ES_DIR, { recursive: true });
      fs.writeFileSync(path.join(ES_DIR, file), esContent, "utf8");
      console.log(`✅ ${slug} → Neon DB + content/whitepapers/es/${file}`);
    } catch (err) {
      console.error(`❌ ${slug} failed:`, err instanceof Error ? err.message : err);
    }

    if (toProcess.indexOf(file) < toProcess.length - 1) {
      await new Promise((r) => setTimeout(r, 1500));
    }
  }

  console.log("\nDone.");
}

main();

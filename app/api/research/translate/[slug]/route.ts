import { NextResponse } from "next/server";
import { generateText } from "ai";
import { gateway } from "@/lib/ai";
import { listResearch } from "@/lib/research";
import { getTranslation, upsertTranslation } from "@/lib/research-translations";
import fs from "node:fs";
import path from "node:path";

const WHITEPAPERS_DIR = path.join(process.cwd(), "content", "whitepapers");

function buildPrompt(slug: string, enContent: string): string {
  return `You are a professional technical translator specializing in AI infrastructure, fintech, and startup content. Translate the following research whitepaper from English to Latin American Spanish (es-419).

STRICT RULES:
- Preserve ALL markdown formatting exactly: headings (#, ##, etc.), bold (**), italic (*), tables, code blocks, lists, footnotes ([^1]), horizontal rules (---), blockquotes (>)
- Preserve ALL YAML frontmatter fields. Translate only the VALUES of: title, subtitle, description, audience. Keep all other fields (publication, authors, version, status, date, length, license) exactly as-is.
- Add two new frontmatter fields at the end of the frontmatter block: lang: es  and  translationOf: ${slug}
- Keep English technical terms in their original form: "agent", "API", "token", "payload", "middleware", "SDK", "stack", "blockchain", "mainnet", "stablecoin", "whitepaper", "settlement", "checkout", "wallet", "protocol"
- Translate all prose, headings, and non-code content naturally for a Latin American professional audience.
- Preserve ALL footnote references ([^1], [^2], etc.) and their definitions exactly.
- Preserve ALL URLs, code snippets, and variable names exactly.
- Return ONLY the translated markdown. No preamble, no explanation, no markdown code fence.

WHITEPAPER:
---
${enContent}`;
}

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const locale = "es";

  // Check if translation already exists
  const existing = await getTranslation(slug, locale);
  if (existing) {
    return NextResponse.json({ slug, locale, status: "exists", chars: existing.length });
  }

  // Read EN source
  const enPath = path.join(WHITEPAPERS_DIR, `${slug}.md`);
  if (!fs.existsSync(enPath)) {
    return NextResponse.json({ error: "Source paper not found" }, { status: 404 });
  }
  const enContent = fs.readFileSync(enPath, "utf8");

  // Translate with Grok 4.3 via gateway (runs on Vercel where gateway token is injected)
  const { text } = await generateText({
    model: gateway("xai/grok-4"),
    messages: [{ role: "user", content: buildPrompt(slug, enContent) }],
    maxOutputTokens: 16000,
  });

  const translated = text.trim();
  await upsertTranslation(slug, locale, translated);

  return NextResponse.json({ slug, locale, status: "translated", chars: translated.length });
}

// Translate all papers in one call
export async function GET() {
  const papers = listResearch("en");
  const results: { slug: string; status: string }[] = [];

  for (const { slug } of papers) {
    const existing = await getTranslation(slug, "es");
    if (existing) {
      results.push({ slug, status: "exists" });
      continue;
    }

    const enPath = path.join(WHITEPAPERS_DIR, `${slug}.md`);
    if (!fs.existsSync(enPath)) {
      results.push({ slug, status: "source_missing" });
      continue;
    }

    try {
      const enContent = fs.readFileSync(enPath, "utf8");
      const { text } = await generateText({
        model: gateway("xai/grok-4"),
        messages: [{ role: "user", content: buildPrompt(slug, enContent) }],
        maxOutputTokens: 16000,
      });
      await upsertTranslation(slug, "es", text.trim());
      results.push({ slug, status: "translated" });
    } catch (err) {
      results.push({ slug, status: `error: ${err instanceof Error ? err.message : String(err)}` });
    }
  }

  return NextResponse.json({ results });
}

import { NextResponse } from "next/server";
import { generateText } from "ai";
import { gateway } from "@/lib/ai";
import { listResearch } from "@/lib/research";
import { getTranslation, upsertTranslation } from "@/lib/research-translations";
import fs from "node:fs";
import path from "node:path";

export const maxDuration = 300;

const WHITEPAPERS_DIR = path.join(process.cwd(), "content", "whitepapers");

const SYSTEM_PROMPT = `You are a professional technical translator specializing in AI infrastructure, fintech, and startup content.
Translate from English to Latin American Spanish (es-419).

RULES:
- Preserve ALL markdown formatting exactly (headings, bold, italic, tables, code blocks, lists, footnotes, blockquotes, horizontal rules)
- Keep English technical terms as-is: agent, API, token, payload, middleware, SDK, stack, blockchain, mainnet, stablecoin, whitepaper, settlement, checkout, wallet, protocol
- Translate all prose, headings, and non-code content naturally for a Latin American professional audience
- Preserve ALL URLs, code snippets, footnote references ([^1] etc.), and variable names exactly
- Return ONLY the translated markdown, no preamble, no code fences`;

const FRONTMATTER_PROMPT = (slug: string) =>
  `Translate this YAML frontmatter block from English to Latin American Spanish.
Translate ONLY the values of: title, subtitle, description, audience.
Keep all other fields (publication, authors, version, status, date, length, license) exactly as-is.
Add these two fields at the very end of the frontmatter: lang: es\ntranslationOf: ${slug}
Return ONLY the translated frontmatter block including the --- delimiters, nothing else.`;

/** Split markdown into frontmatter + sections at each top-level heading */
function splitSections(content: string): { frontmatter: string; sections: string[] } {
  const fmMatch = content.match(/^---\n([\s\S]*?)\n---\n/);
  const frontmatter = fmMatch ? fmMatch[0] : "";
  const body = fmMatch ? content.slice(frontmatter.length) : content;

  // Split on top-level headings (# at line start), keeping the heading with its content
  const raw = body.split(/(?=^# )/m).filter(Boolean);
  return { frontmatter, sections: raw };
}

async function translateSection(text: string): Promise<string> {
  const { text: out } = await generateText({
    model: gateway("xai/grok-4.3"),
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: text }],
    maxOutputTokens: 8192,
  });
  return out.trim();
}

async function translatePaper(slug: string, enContent: string): Promise<string> {
  const { frontmatter, sections } = splitSections(enContent);

  // Translate frontmatter + all sections in parallel
  const [translatedFm, ...translatedSections] = await Promise.all([
    generateText({
      model: gateway("xai/grok-4.3"),
      messages: [{ role: "user", content: `${FRONTMATTER_PROMPT(slug)}\n\n${frontmatter}` }],
      maxOutputTokens: 1024,
    }).then((r) => {
      const t = r.text.trim();
      // Strip any LLM preamble before the --- delimiter
      const idx = t.indexOf("---");
      return idx > 0 ? t.slice(idx) : t;
    }),
    ...sections.map((section) => translateSection(section)),
  ]);

  return [translatedFm, ...translatedSections].join("\n\n");
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const locale = "es";
  const force = new URL(req.url).searchParams.get("force") === "true";

  const existing = await getTranslation(slug, locale);
  if (existing && !force) {
    return NextResponse.json({ slug, locale, status: "exists", chars: existing.length });
  }

  const enPath = path.join(WHITEPAPERS_DIR, `${slug}.md`);
  if (!fs.existsSync(enPath)) {
    return NextResponse.json({ error: "Source paper not found" }, { status: 404 });
  }

  const enContent = fs.readFileSync(enPath, "utf8");
  const { frontmatter, sections } = splitSections(enContent);
  const sectionCount = sections.length;

  const translated = await translatePaper(slug, enContent);
  await upsertTranslation(slug, locale, translated);

  return NextResponse.json({
    slug,
    locale,
    status: "translated",
    chars: translated.length,
    sections: sectionCount,
  });
}

// Translate all papers — call GET /api/research/translate/all
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  // Special slug "all" → translate everything missing
  const papers = slug === "all" ? listResearch("en") : [{ slug }];
  const results: { slug: string; status: string }[] = [];

  for (const { slug: s } of papers) {
    const existing = await getTranslation(s, "es");
    if (existing) {
      results.push({ slug: s, status: "exists" });
      continue;
    }

    const enPath = path.join(WHITEPAPERS_DIR, `${s}.md`);
    if (!fs.existsSync(enPath)) {
      results.push({ slug: s, status: "source_missing" });
      continue;
    }

    try {
      const enContent = fs.readFileSync(enPath, "utf8");
      const translated = await translatePaper(s, enContent);
      await upsertTranslation(s, "es", translated);
      results.push({ slug: s, status: "translated", chars: translated.length } as never);
    } catch (err) {
      results.push({ slug: s, status: `error: ${err instanceof Error ? err.message : String(err)}` });
    }
  }

  return NextResponse.json({ results });
}

/**
 * citation-magnetism-score.ts
 *
 * Per-paper measurement of AI-citation-magnetism drivers, run before/after
 * any content change to enforce the "never penalize citation magnetism"
 * constraint. Six metrics distilled from `content/whitepapers/geo-2026.md`:
 *
 *   - answer_first       — fraction of H2 sections opening with a 40-120
 *                          word standalone answer paragraph (no inline refs,
 *                          no forward-pointing prose).
 *   - schema_density     — count of distinct Schema.org @type values the
 *                          paper earns via frontmatter + body structure.
 *   - quotable_presence  — 1 if a `## Quotable` (or "Quotable Findings")
 *                          section exists with ≥5 standalone facts, else 0.
 *   - stats_density      — numeric statistics (numbers, %, currency, ×, M, B)
 *                          per 1000 body words.
 *   - entity_surface     — count of capitalized proper-noun mentions
 *                          appearing ≥3 times in body (named-entity proxy).
 *   - freshness_days     — days since `date:` in frontmatter. Excluded from
 *                          regression gate (decreases naturally over time).
 *
 * Scores are written to `content/whitepapers/.scores/<slug>.json`. With the
 * --regression-check flag, the script reads the existing sidecar, computes a
 * fresh score, and exits non-zero if any metric (other than freshness_days)
 * regressed.
 *
 * Usage:
 *   npx tsx scripts/citation-magnetism-score.ts                       # baseline-write all
 *   npx tsx scripts/citation-magnetism-score.ts <slug> [<slug2> ...]  # specific papers
 *   npx tsx scripts/citation-magnetism-score.ts --all                 # alias for empty
 *   npx tsx scripts/citation-magnetism-score.ts <slug> --regression-check
 *   npx tsx scripts/citation-magnetism-score.ts --print-only          # don't write sidecars
 */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { listResearch } from "../lib/research";

const REPO = process.cwd();
const CONTENT_DIR = path.join(REPO, "content", "whitepapers");
const SCORES_DIR = path.join(CONTENT_DIR, ".scores");

export interface CitationMagnetismScore {
  answer_first: number;        // 0.0–1.0
  schema_density: number;      // integer ≥ 0
  quotable_presence: 0 | 1;
  stats_density: number;       // float ≥ 0 (per 1000 body words)
  entity_surface: number;      // integer ≥ 0
  freshness_days: number;      // integer ≥ 0
  word_count: number;          // body word count, used for stats_density normalization
}

const REGRESSION_GATED_KEYS: Array<keyof CitationMagnetismScore> = [
  "answer_first",
  "schema_density",
  "quotable_presence",
  "stats_density",
  "entity_surface",
];

function findRefsSectionStart(lines: string[]): number {
  for (let i = lines.length - 1; i >= 0; i--) {
    if (/^#{1,3}\s+(References|Sources|Citations|Footnotes|Notes)\s*$/i.test(lines[i])) {
      return i;
    }
  }
  return -1;
}

function getBodyLines(content: string): string[] {
  const lines = content.split("\n");
  const refStart = findRefsSectionStart(lines);
  return refStart >= 0 ? lines.slice(0, refStart) : lines;
}

function bodyText(lines: string[]): string {
  return lines.join("\n");
}

function countWords(text: string): number {
  return text
    .replace(/`{1,3}[^`]*`{1,3}/g, " ")  // strip code spans/blocks
    .replace(/\[\^?\d+\]:?/g, " ")
    .split(/\s+/)
    .filter((w) => /\w/.test(w))
    .length;
}

// --- answer_first ----------------------------------------------------------
// For each H2 in body (excluding TOC, References, Quotable Findings), look at
// the first non-blank line group after the heading and check whether it's a
// 40-120-word standalone answer paragraph: no `[^N]` markers, no
// forward-pointing prose ("below", "next section", "as we'll see"), at least
// one sentence-ending period.
function scoreAnswerFirst(bodyLines: string[]): number {
  const SKIP_HEADINGS = /^(TOC|Table of Contents|References|Sources|Citations|Footnotes|Notes|Quotable( Findings)?|Glossary|Foreword|Acknowledg)/i;
  const FORWARD_RE = /\b(below|next section|as we[’']ll see|see Section|see § ?\d|see Part|in the following|later in this paper)\b/i;

  let scored = 0;
  let passing = 0;
  for (let i = 0; i < bodyLines.length; i++) {
    const m = /^##\s+(.+)$/.exec(bodyLines[i]);
    if (!m) continue;
    if (bodyLines[i].startsWith("###")) continue;
    const heading = m[1].trim().replace(/^[\d.]+\s*/, "");
    if (SKIP_HEADINGS.test(heading)) continue;

    // Find first non-blank, non-heading paragraph after the H2.
    let j = i + 1;
    while (j < bodyLines.length && bodyLines[j].trim() === "") j++;
    if (j >= bodyLines.length) continue;
    if (bodyLines[j].startsWith("#")) continue;  // adjacent heading — no answer paragraph
    // Skip lists and tables — answer-first is prose.
    if (/^\s*([-*+]|\d+\.)\s+/.test(bodyLines[j]) || /^\s*\|/.test(bodyLines[j])) {
      scored++;
      continue;
    }

    // Gather first paragraph.
    const buf: string[] = [];
    while (j < bodyLines.length && bodyLines[j].trim() !== "" && !bodyLines[j].startsWith("#")) {
      buf.push(bodyLines[j]);
      j++;
    }
    const para = buf.join(" ");
    const wc = countWords(para);
    const hasMarker = /\[\^\d+\]/.test(para);
    const isForward = FORWARD_RE.test(para);
    const hasSentence = /[.!?]/.test(para);

    scored++;
    if (wc >= 40 && wc <= 120 && !hasMarker && !isForward && hasSentence) {
      passing++;
    }
  }
  if (scored === 0) return 0;
  return Math.round((passing / scored) * 1000) / 1000;
}

// --- schema_density --------------------------------------------------------
// Count distinct Schema.org @type values the paper earns. Page-rendered base
// types (ScholarlyArticle, Person, Organization, BreadcrumbList) are constant
// across the corpus, so we count them once. Optional types depend on
// frontmatter + body structure.
function scoreSchemaDensity(fm: Record<string, unknown>, bodyLines: string[]): number {
  let count = 4;  // baseline: ScholarlyArticle + Person + Organization + BreadcrumbList
  if (fm.audience) count++;
  if (Array.isArray(fm.topical_entities) && fm.topical_entities.length > 0) count++;
  if (Array.isArray(fm.keywords) && fm.keywords.length > 0) count++;
  // CreativeWork (citation) — papers with refs get this; verifier handles it.
  // We approximate by checking for a `## References` heading or `[^N]:` defs.
  const hasRefs = bodyLines.some((l) => /^\[\^\d+\]:/.test(l)) ||
                  bodyLines.some((l) => /^#{1,3}\s+(References|Sources|Citations)/i.test(l));
  if (hasRefs) count++;
  // FAQPage — body has an FAQ-style heading.
  if (bodyLines.some((l) => /^##\s+(FAQ|Frequently Asked|Questions and Answers|Q&A)/i.test(l))) count++;
  // HowTo — body has a "Steps" / "How To" heading followed by numbered list.
  for (let i = 0; i < bodyLines.length; i++) {
    if (/^##\s+(Steps|How (?:To|to)|Procedure|Walkthrough|Recipe)/i.test(bodyLines[i])) {
      // Look ahead for a numbered list within next 5 non-blank lines.
      let saw = 0;
      for (let j = i + 1; j < Math.min(i + 12, bodyLines.length); j++) {
        if (/^\s*\d+\.\s+/.test(bodyLines[j])) saw++;
        if (saw >= 3) break;
      }
      if (saw >= 3) {
        count++;
        break;
      }
    }
  }
  // Quotation — body has a Quotable section (the same one quotable_presence checks).
  if (bodyLines.some((l) => /^##\s+Quotable( Findings)?\b/i.test(l))) count++;
  return count;
}

// --- quotable_presence -----------------------------------------------------
function scoreQuotablePresence(bodyLines: string[]): 0 | 1 {
  let inQuotable = false;
  let factCount = 0;
  for (const line of bodyLines) {
    const h2 = /^##\s+(.+)$/.exec(line);
    if (h2 && !line.startsWith("###")) {
      const wasIn = inQuotable;
      inQuotable = /^Quotable( Findings)?\b/i.test(h2[1].trim());
      if (wasIn && !inQuotable && factCount >= 5) return 1;
      continue;
    }
    if (!inQuotable) continue;
    if (/^\s*([-*+]|\d+\.)\s+/.test(line)) factCount++;
  }
  return factCount >= 5 ? 1 : 0;
}

// --- stats_density ---------------------------------------------------------
// Count numeric statistics per 1000 body words. Patterns: percentages,
// currency, multipliers (×, x), magnitude suffixes (M, B, K), bare numbers
// with at least 3 digits or decimal points.
function scoreStatsDensity(bodyLines: string[], wordCount: number): number {
  const text = bodyText(bodyLines);
  const patterns = [
    /\b\d+(?:\.\d+)?%/g,                // 47%, 3.4%
    /\$\d+(?:[.,]\d+)?(?:[KMBkmb])?\b/g, // $32B, $1.5M, $250
    /\b\d+(?:\.\d+)?\s*[xX×]\b/g,        // 970×, 5x
    /\b\d{2,}(?:,\d{3})*(?:\.\d+)?\b/g,  // 9,400, 1,000,000
    /\b\d+(?:\.\d+)?\s*(?:million|billion|trillion|thousand|percent)\b/gi,
  ];
  let count = 0;
  for (const re of patterns) {
    const matches = text.match(re);
    if (matches) count += matches.length;
  }
  if (wordCount === 0) return 0;
  return Math.round((count / wordCount) * 10000) / 10;  // per 1000 words, 1 decimal
}

// --- entity_surface --------------------------------------------------------
// Count distinct capitalized 1-3-word phrases that appear ≥3 times in body
// and look like proper nouns (not heading lines, not list markers, not
// sentence-initial common words).
function scoreEntitySurface(bodyLines: string[]): number {
  // Strip headings, lists, code, tables, ref defs.
  const cleanLines = bodyLines.filter((l) => {
    if (l.startsWith("#")) return false;
    if (/^\[\^\d+\]:/.test(l)) return false;
    if (/^\s*\|/.test(l)) return false;
    if (/^\s*```/.test(l)) return false;
    return true;
  });
  const text = cleanLines.join(" ");
  // Match capitalized 1-3 word phrases, but reject sentence-start single
  // capitalized words by requiring either (a) ≥2 capitalized words in a row,
  // or (b) a single word that's clearly a proper noun (like an acronym,
  // mixed-case, or a known proper-noun shape like FooBar / Foo.AI).
  const phraseRe = /\b([A-Z][a-zA-Z]*(?:[\.\-][A-Z][a-zA-Z]*)*(?:\s+[A-Z][a-zA-Z]+){0,2}|\b[A-Z]{2,}\b)/g;
  const counts = new Map<string, number>();
  let m: RegExpExecArray | null;
  while ((m = phraseRe.exec(text)) !== null) {
    const phrase = m[1];
    // Reject pure sentence-starters: single word that's a common dictionary word.
    if (/^(The|A|An|This|That|These|Those|Our|Their|Its|It|We|You|They|Per|For|And|But|Or|If|When|Where|While|Although|However|Therefore|Thus|So|Some|Most|All|Many|Few|Each|Every|Both|Either|Neither|First|Second|Third|Last|Next|Then|Now|Today|Yesterday|Tomorrow)$/.test(phrase)) {
      continue;
    }
    counts.set(phrase, (counts.get(phrase) ?? 0) + 1);
  }
  let surface = 0;
  for (const [, c] of counts) if (c >= 3) surface++;
  return surface;
}

// --- freshness_days --------------------------------------------------------
function scoreFreshnessDays(fm: Record<string, unknown>): number {
  const dateRaw = fm.date;
  if (!dateRaw) return 999;
  const d = new Date(String(dateRaw));
  if (isNaN(d.getTime())) return 999;
  const ms = Date.now() - d.getTime();
  return Math.max(0, Math.round(ms / (1000 * 60 * 60 * 24)));
}

// --- main entrypoints ------------------------------------------------------
export function scorePaper(slug: string): CitationMagnetismScore {
  const file = path.join(CONTENT_DIR, `${slug}.md`);
  const raw = fs.readFileSync(file, "utf8");
  const { content, data: fm } = matter(raw);
  const bodyLines = getBodyLines(content);
  const text = bodyText(bodyLines);
  const wordCount = countWords(text);
  return {
    answer_first: scoreAnswerFirst(bodyLines),
    schema_density: scoreSchemaDensity(fm as Record<string, unknown>, bodyLines),
    quotable_presence: scoreQuotablePresence(bodyLines),
    stats_density: scoreStatsDensity(bodyLines, wordCount),
    entity_surface: scoreEntitySurface(bodyLines),
    freshness_days: scoreFreshnessDays(fm as Record<string, unknown>),
    word_count: wordCount,
  };
}

function sidecarPath(slug: string): string {
  return path.join(SCORES_DIR, `${slug}.json`);
}

function readSidecar(slug: string): CitationMagnetismScore | null {
  const p = sidecarPath(slug);
  if (!fs.existsSync(p)) return null;
  try {
    return JSON.parse(fs.readFileSync(p, "utf8")) as CitationMagnetismScore;
  } catch {
    return null;
  }
}

function writeSidecar(slug: string, score: CitationMagnetismScore): void {
  if (!fs.existsSync(SCORES_DIR)) fs.mkdirSync(SCORES_DIR, { recursive: true });
  fs.writeFileSync(sidecarPath(slug), JSON.stringify(score, null, 2) + "\n");
}

interface RegressionResult {
  slug: string;
  pass: boolean;
  regressions: string[];
  before: CitationMagnetismScore | null;
  after: CitationMagnetismScore;
}

export function checkRegression(slug: string): RegressionResult {
  const before = readSidecar(slug);
  const after = scorePaper(slug);
  if (!before) {
    return { slug, pass: true, regressions: [], before: null, after };
  }
  const regressions: string[] = [];
  for (const key of REGRESSION_GATED_KEYS) {
    if (after[key] < before[key]) {
      regressions.push(`${key}: ${before[key]} → ${after[key]}`);
    }
  }
  return { slug, pass: regressions.length === 0, regressions, before, after };
}

function formatScore(s: CitationMagnetismScore): string {
  return [
    `answer_first ${s.answer_first.toFixed(2)}`,
    `schema ${s.schema_density}`,
    `quotable ${s.quotable_presence}`,
    `stats/1k ${s.stats_density.toFixed(1)}`,
    `entities ${s.entity_surface}`,
    `fresh ${s.freshness_days}d`,
    `words ${s.word_count}`,
  ].join("  ");
}

function main() {
  const args = process.argv.slice(2);
  const printOnly = args.includes("--print-only");
  const regressionCheck = args.includes("--regression-check");
  const explicitSlugs = args.filter((a) => !a.startsWith("--"));
  const slugs =
    explicitSlugs.length > 0 && explicitSlugs[0] !== "--all"
      ? explicitSlugs
      : listResearch().map((p) => p.slug);

  let anyRegression = false;
  for (const slug of slugs) {
    if (regressionCheck) {
      const r = checkRegression(slug);
      if (r.pass) {
        console.log(`PASS ${slug}  ${formatScore(r.after)}`);
        if (!printOnly) writeSidecar(slug, r.after);
      } else {
        anyRegression = true;
        console.log(`FAIL ${slug}  ${formatScore(r.after)}`);
        for (const reg of r.regressions) console.log(`     regression: ${reg}`);
      }
    } else {
      const score = scorePaper(slug);
      console.log(`${slug.padEnd(60)}  ${formatScore(score)}`);
      if (!printOnly) writeSidecar(slug, score);
    }
  }
  process.exit(anyRegression ? 1 : 0);
}

if (require.main === module) main();

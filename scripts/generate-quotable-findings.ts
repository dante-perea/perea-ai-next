/**
 * generate-quotable-findings.ts
 *
 * Two-phase Quotable Findings section generator. Uses Claude Sonnet 4.6
 * (via the Vercel AI SDK + AI Gateway with the `anthropic/claude-sonnet-4-6`
 * provider/model string) to *select* — never generate — between 5 and 10
 * standalone facts from each paper's body. Each fact is verified to be a
 * literal substring of the body (with normalized whitespace + smart-quote
 * folding) before being accepted. The model picks; the script enforces.
 *
 * Phase 1 (default): writes a candidate JSON to
 *   `content/whitepapers/.candidate-quotables/<slug>.json`
 * Phase 2 (--apply): reads the candidate, inserts the Quotable Findings
 * section into the paper at the chosen placement.
 *
 * Placement priority:
 *   1. After `## Executive Summary` block (next H2 boundary).
 *   2. Else after `# Foreword` / `## Foreword` block.
 *   3. Else immediately after the first H1.
 *
 * Idempotency: skips papers that already have a `## Quotable Findings`
 * section with ≥5 numbered items. Regenerates if existing has <5.
 *
 * Faithfulness: every emitted `quote` must equal a literal substring of the
 * paper body after both sides are normalized (NFC, smart→straight quotes,
 * whitespace runs collapsed, hyphen variants folded).
 *
 * Usage:
 *   npx tsx scripts/generate-quotable-findings.ts <slug>             # dry-run, write candidate
 *   npx tsx scripts/generate-quotable-findings.ts <slug> --apply     # read candidate, insert section
 *   npx tsx scripts/generate-quotable-findings.ts --all              # dry-run all eligible papers
 *   npx tsx scripts/generate-quotable-findings.ts --all --apply      # apply all approved candidates
 *
 * Environment:
 *   AI_GATEWAY_API_KEY   — Vercel AI Gateway key (preferred)
 *   ANTHROPIC_API_KEY    — direct Anthropic key (fallback)
 */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import "dotenv/config";
import { config as dotenvConfig } from "dotenv";
import { generateObject } from "ai";
import { z } from "zod";
import { listResearch } from "../lib/research";

// Load .env.local explicitly (dotenv/config only loads .env by default).
dotenvConfig({ path: ".env.local" });

// The Vercel AI Gateway SDK looks for AI_GATEWAY_API_KEY by default. The
// perea-ai-next Vercel project stores the same secret as AI_GATEWAY_TOKEN
// (legacy name). Alias it so the SDK picks it up without any provider
// reconfiguration.
if (!process.env.AI_GATEWAY_API_KEY && process.env.AI_GATEWAY_TOKEN) {
  process.env.AI_GATEWAY_API_KEY = process.env.AI_GATEWAY_TOKEN;
}

const REPO = process.cwd();
const CONTENT_DIR = path.join(REPO, "content", "whitepapers");
const CANDIDATE_DIR = path.join(CONTENT_DIR, ".candidate-quotables");
const FAILED_DIR = path.join(CONTENT_DIR, ".failed-quotables");

const MODEL_ID = "anthropic/claude-sonnet-4-6";
const TARGET_FINDINGS = 8;
const MIN_FINDINGS = 5;
const MAX_FINDINGS = 10;
const MIN_WORDS = 15;
const MAX_WORDS = 40;

// ---------------------------------------------------------------------------
// Faithfulness — normalized literal-substring check
// ---------------------------------------------------------------------------
function normalize(s: string): string {
  return s
    .normalize("NFC")
    .replace(/[“”„‟″‶]/g, '"')
    .replace(/[‘’‚‛′‵]/g, "'")
    .replace(/[‐‑‒–—―]/g, "-")
    .replace(/ /g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const FORWARD_POINTING_RE =
  /\b(below|above|next section|next chapter|as we[’']ll see|see Section|see § ?\d|see Part|in the following|later in this paper|earlier in this paper|in the next|the section that follows)\b/i;

interface Finding {
  quote: string;
  source_refs: string[];      // e.g., ["[^1]", "[^66]"]
  h2_section: string;
  reason: string;
}

interface CandidateFile {
  slug: string;
  generated_at: string;
  ready: boolean;             // ≥5 valid findings
  partial: boolean;           // 1–4 valid findings
  findings: Finding[];
  rejected: Array<{ finding: Finding; reason: string }>;
  placement: {
    strategy: "after-executive-summary" | "after-foreword" | "after-h1" | "before-first-h2" | "ambiguous";
    insert_after_line: number;
  };
}

// ---------------------------------------------------------------------------
// Schema + LLM call
// ---------------------------------------------------------------------------
const FindingsSchema = z.object({
  findings: z.array(z.object({
    quote: z.string().describe(
      "A LITERAL SUBSTRING of the paper body — copy verbatim, do not paraphrase or shorten. Must contain at least one [^N] footnote marker. Must read as a complete sentence. Must be 15–40 words.",
    ),
    source_refs: z.array(z.string()).describe(
      "The footnote markers present in the quote, e.g., [\"[^1]\", \"[^66]\"]. Must match exactly what appears in the quote.",
    ),
    h2_section: z.string().describe(
      "The H2 heading text the quote is drawn from (e.g., 'The vendor landscape is fully populated').",
    ),
    reason: z.string().describe(
      "One short sentence on why this fact is quotable — what makes it a hook (the number, the contrast, the specificity).",
    ),
  })).min(MIN_FINDINGS).max(MAX_FINDINGS),
});

const SYSTEM_PROMPT = `You are an editorial researcher selecting "Quotable Findings" for a research paper.

Your job is to SELECT 5–10 sentences from the paper body that meet a strict quality bar. You must NOT generate, paraphrase, summarize, or shorten — every quote must be a verbatim, literal substring of the paper body. The downstream pipeline validates this and rejects any quote that doesn't match.

A "Quotable Finding" must satisfy ALL of:
1. Contains a quantifiable claim — number, percentage, currency, multiplier, or named regulation/protocol/company.
2. Cites at least one source via a [^N] footnote marker (must appear inside the quote string).
3. Reads as a complete, standalone sentence.
4. Has no forward-pointing prose ("below", "next section", "as we'll see", "see Section X", "later in this paper").
5. Is between 15 and 40 words.
6. Makes a claim about the world, not about the paper's structure.

Aim for 8 findings. Span the paper — pick at least one fact per major H2 section if the paper supports it. Avoid clustering 3+ findings from the same section.

When the paper does not contain enough quotable sentences to reach 5, return only as many as you find (the schema requires at least 5 — if the paper genuinely lacks them, return 5 of the strongest sentences you can find).

Return findings in JSON matching the provided schema. The "quote" field MUST be a literal copy from the body; if you change a single character, the quote will be rejected.`;

function buildUserPrompt(title: string, body: string): string {
  return `Paper title: ${title}

Paper body (extract Quotable Findings from this text):

${body}

Return between ${MIN_FINDINGS} and ${MAX_FINDINGS} findings, target ${TARGET_FINDINGS}. Each "quote" must be a verbatim substring of the body above.`;
}

// ---------------------------------------------------------------------------
// Body extraction
// ---------------------------------------------------------------------------
function findRefsSectionStart(lines: string[]): number {
  for (let i = lines.length - 1; i >= 0; i--) {
    if (/^#{1,3}\s+(References|Sources|Citations|Footnotes|Notes)\s*$/i.test(lines[i])) {
      return i;
    }
  }
  return -1;
}

function getBodyText(content: string): string {
  const lines = content.split("\n");
  const refStart = findRefsSectionStart(lines);
  return refStart >= 0 ? lines.slice(0, refStart).join("\n") : content;
}

// ---------------------------------------------------------------------------
// Idempotency: detect existing Quotable section and count its items
// ---------------------------------------------------------------------------
function existingQuotableItemCount(content: string): number {
  const lines = content.split("\n");
  let inQuotable = false;
  let count = 0;
  for (const line of lines) {
    const h2 = /^##\s+(.+)$/.exec(line);
    if (h2 && !line.startsWith("###")) {
      const wasIn = inQuotable;
      inQuotable = /^Quotable( Findings)?\b/i.test(h2[1].trim());
      if (wasIn && !inQuotable) return count;
    } else if (inQuotable && /^\s*([-*+]|\d+\.)\s+/.test(line)) {
      count++;
    }
  }
  return count;
}

// ---------------------------------------------------------------------------
// Placement logic
// ---------------------------------------------------------------------------
function findInsertionPoint(content: string): {
  strategy: CandidateFile["placement"]["strategy"];
  lineIndex: number;
} {
  const lines = content.split("\n");
  // Scan for `# Executive Summary` or `## Executive Summary` first.
  for (let i = 0; i < lines.length; i++) {
    const isH1Exec = /^#\s+(Executive\s+Summary|TL;DR)\b/i.test(lines[i]) && !lines[i].startsWith("##");
    const isH2Exec = /^##\s+(Executive\s+Summary|TL;DR)\b/i.test(lines[i]) && !lines[i].startsWith("###");
    if (isH1Exec || isH2Exec) {
      const next = nextH2Boundary(lines, i + 1);
      return { strategy: "after-executive-summary", lineIndex: next };
    }
  }
  // Foreword fallback (H1 or H2).
  for (let i = 0; i < lines.length; i++) {
    if (/^#{1,2}\s+Foreword\b/i.test(lines[i])) {
      const next = nextH2OrEndOfBlock(lines, i + 1);
      return { strategy: "after-foreword", lineIndex: next };
    }
  }
  // First H1 fallback.
  for (let i = 0; i < lines.length; i++) {
    if (/^#\s+\S/.test(lines[i]) && !lines[i].startsWith("##")) {
      // Walk forward to first blank line after the H1 block.
      let j = i + 1;
      while (j < lines.length && lines[j].trim() !== "") j++;
      return { strategy: "after-h1", lineIndex: j };
    }
  }
  // No H1, no Foreword, no Executive Summary — many papers (e.g.,
  // trust-layer-deep-dive) go directly from frontmatter into numbered H2
  // sections. Insert before the first H2 in that case.
  for (let i = 0; i < lines.length; i++) {
    if (/^##\s+/.test(lines[i]) && !lines[i].startsWith("###")) {
      return { strategy: "before-first-h2", lineIndex: i };
    }
  }
  return { strategy: "ambiguous", lineIndex: -1 };
}

function nextH2Boundary(lines: string[], from: number): number {
  for (let i = from; i < lines.length; i++) {
    if (/^##\s+/.test(lines[i]) && !lines[i].startsWith("###")) return i;
    if (/^#\s+/.test(lines[i]) && !lines[i].startsWith("##")) return i;
  }
  return lines.length;
}

function nextH2OrEndOfBlock(lines: string[], from: number): number {
  // Same as nextH2Boundary; alias kept for clarity.
  return nextH2Boundary(lines, from);
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------
interface ValidationResult {
  valid: Finding[];
  rejected: Array<{ finding: Finding; reason: string }>;
}

function validateFindings(findings: Finding[], body: string): ValidationResult {
  const valid: Finding[] = [];
  const rejected: ValidationResult["rejected"] = [];
  const normalizedBody = normalize(body);
  const seenQuotes = new Set<string>();

  for (const f of findings) {
    const reasons: string[] = [];
    const normQuote = normalize(f.quote);
    if (!normalizedBody.includes(normQuote)) {
      reasons.push("quote not a literal substring of body (after normalization)");
    }
    if (!/\[\^\d+\]/.test(f.quote)) {
      reasons.push("quote contains no [^N] footnote marker");
    }
    if (FORWARD_POINTING_RE.test(f.quote)) {
      reasons.push("forward-pointing prose detected");
    }
    const wordCount = f.quote.split(/\s+/).filter((w) => /\w/.test(w)).length;
    if (wordCount < MIN_WORDS) reasons.push(`too short (${wordCount} words, min ${MIN_WORDS})`);
    if (wordCount > MAX_WORDS) reasons.push(`too long (${wordCount} words, max ${MAX_WORDS})`);
    if (seenQuotes.has(normQuote)) reasons.push("duplicate of an earlier finding");

    if (reasons.length === 0) {
      valid.push(f);
      seenQuotes.add(normQuote);
    } else {
      rejected.push({ finding: f, reason: reasons.join("; ") });
    }
  }
  return { valid, rejected };
}

// ---------------------------------------------------------------------------
// Section formatting
// ---------------------------------------------------------------------------
function formatQuotableSection(findings: Finding[]): string {
  const lines: string[] = ["## Quotable Findings", ""];
  findings.forEach((f, i) => {
    lines.push(`${i + 1}. ${f.quote}`);
    lines.push("");
  });
  return lines.join("\n");
}

// ---------------------------------------------------------------------------
// Candidate I/O
// ---------------------------------------------------------------------------
function candidatePath(slug: string): string {
  return path.join(CANDIDATE_DIR, `${slug}.json`);
}
function failedPath(slug: string): string {
  return path.join(FAILED_DIR, `${slug}.json`);
}
function ensureDir(dir: string): void {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}
function writeCandidate(slug: string, candidate: CandidateFile): void {
  ensureDir(CANDIDATE_DIR);
  fs.writeFileSync(candidatePath(slug), JSON.stringify(candidate, null, 2) + "\n");
}
function readCandidate(slug: string): CandidateFile | null {
  const p = candidatePath(slug);
  if (!fs.existsSync(p)) return null;
  return JSON.parse(fs.readFileSync(p, "utf8")) as CandidateFile;
}
function writeFailed(slug: string, payload: unknown): void {
  ensureDir(FAILED_DIR);
  fs.writeFileSync(failedPath(slug), JSON.stringify(payload, null, 2) + "\n");
}

// ---------------------------------------------------------------------------
// Generate (phase 1)
// ---------------------------------------------------------------------------
async function generateCandidate(slug: string): Promise<CandidateFile | null> {
  const file = path.join(CONTENT_DIR, `${slug}.md`);
  const raw = fs.readFileSync(file, "utf8");
  const { content, data: fm } = matter(raw);

  const existing = existingQuotableItemCount(content);
  if (existing >= MIN_FINDINGS) {
    console.log(`SKIP ${slug}  — has ${existing} existing Quotable items`);
    return null;
  }

  const body = getBodyText(content);
  const placement = findInsertionPoint(content);
  if (placement.strategy === "ambiguous") {
    console.log(`SKIP ${slug}  — ambiguous insertion point`);
    return null;
  }

  const title = (fm.title as string) || slug;

  let llmResult: { findings: Finding[] } | null = null;
  try {
    const out = await generateObject({
      model: MODEL_ID,
      schema: FindingsSchema,
      system: SYSTEM_PROMPT,
      prompt: buildUserPrompt(title, body),
    });
    llmResult = out.object as { findings: Finding[] };
  } catch (err) {
    console.error(`FAIL ${slug}  — LLM error: ${(err as Error).message}`);
    writeFailed(slug, { stage: "generateObject", error: String(err) });
    return null;
  }

  const { valid, rejected } = validateFindings(llmResult.findings, body);
  const ready = valid.length >= MIN_FINDINGS;
  const partial = !ready && valid.length >= 1;

  const candidate: CandidateFile = {
    slug,
    generated_at: new Date().toISOString(),
    ready,
    partial,
    findings: valid,
    rejected,
    placement: {
      strategy: placement.strategy,
      insert_after_line: placement.lineIndex,
    },
  };
  writeCandidate(slug, candidate);
  if (!ready) writeFailed(slug, { stage: "validation", llm_findings: llmResult.findings, rejected });

  const status = ready ? "READY" : partial ? "PARTIAL" : "FAIL";
  console.log(
    `${status.padEnd(7)} ${slug.padEnd(60)} valid=${valid.length} rejected=${rejected.length} placement=${placement.strategy}`,
  );
  return candidate;
}

// ---------------------------------------------------------------------------
// Apply (phase 2)
// ---------------------------------------------------------------------------
async function applyCandidate(slug: string): Promise<boolean> {
  const candidate = readCandidate(slug);
  if (!candidate) {
    console.log(`SKIP ${slug}  — no candidate file`);
    return false;
  }
  if (!candidate.ready) {
    console.log(`SKIP ${slug}  — candidate not ready (${candidate.findings.length} findings)`);
    return false;
  }
  const file = path.join(CONTENT_DIR, `${slug}.md`);
  const raw = fs.readFileSync(file, "utf8");
  const lines = raw.split("\n");

  // Re-validate placement against the *current* paper state in case the file
  // moved since candidate generation.
  const { content } = matter(raw);
  const existing = existingQuotableItemCount(content);
  if (existing >= MIN_FINDINGS) {
    console.log(`SKIP ${slug}  — paper already has ${existing} Quotable items`);
    return false;
  }
  const placement = findInsertionPoint(content);
  if (placement.strategy === "ambiguous") {
    console.log(`SKIP ${slug}  — placement ambiguous at apply time`);
    return false;
  }

  // We compute the file-line offset (frontmatter prepends N lines before body).
  const fmEnd = raw.indexOf("\n---\n", 4);
  const headerLines = fmEnd > 0 ? raw.slice(0, fmEnd + 5).split("\n").length - 1 : 0;
  const insertAt = headerLines + placement.lineIndex;

  const sectionLines = formatQuotableSection(candidate.findings).split("\n");
  // Insert with surrounding blank lines to keep markdown clean.
  const before = lines.slice(0, insertAt);
  const after = lines.slice(insertAt);
  const out = [...before, "", ...sectionLines, ...after].join("\n");
  fs.writeFileSync(file, out);
  console.log(`APPLY ${slug}  — inserted ${candidate.findings.length} findings via ${placement.strategy}`);
  return true;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  const args = process.argv.slice(2);
  const apply = args.includes("--apply");
  const all = args.includes("--all");
  const explicit = args.filter((a) => !a.startsWith("--"));
  const slugs = all
    ? listResearch().map((p) => p.slug)
    : explicit;
  if (slugs.length === 0) {
    console.error(
      "Usage: npx tsx scripts/generate-quotable-findings.ts <slug> [<slug> ...] [--apply]\n" +
      "       npx tsx scripts/generate-quotable-findings.ts --all [--apply]",
    );
    process.exit(2);
  }

  for (const slug of slugs) {
    if (apply) await applyCandidate(slug);
    else await generateCandidate(slug);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

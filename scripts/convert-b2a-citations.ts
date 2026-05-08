/**
 * convert-b2a-citations.ts (now slug-parameterized)
 *
 * Read-only candidate generator: parse a paper's numbered bibliography,
 * build a publisher-name → ref-index map, then walk the body and emit a
 * candidate file showing every parenthetical attribution and its proposed
 * `[^N]` replacement. Human reviews the candidate, then runs with --apply
 * to write the conversion back into the source file.
 *
 * Usage:
 *   npx tsx scripts/convert-b2a-citations.ts <slug>          # print candidates
 *   npx tsx scripts/convert-b2a-citations.ts <slug> --apply  # write conversions
 *   npx tsx scripts/convert-b2a-citations.ts                 # default: b2a-2026
 *
 * Heuristic: a parenthetical like `(Forrester)` or `(Stripe Documentation,
 * ACP GitHub)` matches each comma-separated label against the bibliography
 * publisher tokens; matched labels are emitted as `[^N1][^N2]…` and
 * unmatched labels are kept as parenthetical fallback so we never lose
 * information.
 */
import fs from "node:fs";
import path from "node:path";

const REPO = process.cwd();
const args = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const slug = args[0] || "b2a-2026";
const SRC = path.join(REPO, "content", "whitepapers", `${slug}.md`);

interface Ref {
  index: number;
  publisher: string;
  searchTokens: string[];
}

function parseBibliography(body: string): Ref[] {
  const lines = body.split("\n");
  const refs: Ref[] = [];
  for (const line of lines) {
    // Match `<N>. <something>` — extract the leading text before the first
    // period-followed-by-quote OR the first em-dash OR the first " — ".
    const m = /^(\d+)\.\s+(.+)$/.exec(line);
    if (!m) continue;
    const index = parseInt(m[1], 10);
    let body = m[2];
    // Cut at first delimiter: `. "` (quoted-title), ` — ` (em-dash), or `. http`.
    const cutIdx = (() => {
      const dq = body.search(/\.\s+["“]/);
      const em = body.search(/\s+—\s+/);
      const dot = body.search(/\.\s+http/);
      const candidates = [dq, em, dot].filter((i) => i > 0);
      return candidates.length > 0 ? Math.min(...candidates) : -1;
    })();
    const publisher = (cutIdx > 0 ? body.slice(0, cutIdx) : body)
      .trim()
      .replace(/\s+/g, " ")
      .replace(/[.,;]+$/, "");
    if (!publisher || publisher.length > 80) continue;
    const tokens = publisher
      .split(/[,.\s/]+/)
      .map((t) => t.trim())
      .filter((t) => t.length >= 2 && !/^(Inc|Ltd|LLC|Co|Corp|com|io|ai)$/i.test(t));
    refs.push({ index, publisher, searchTokens: tokens });
  }
  return refs;
}

interface Match {
  label: string;
  refs: number[];
}

function normalize(s: string): string {
  return s.toLowerCase().replace(/[\s\-_]+/g, "");
}

function matchLabel(label: string, refs: Ref[]): number[] {
  const cleaned = label.trim();
  if (!cleaned || cleaned.length < 3) return [];
  // Citation labels generally start with an uppercase letter (publisher names).
  // Reject lowercase-only labels like "req", "env", "ctx" that slip through
  // because they appear inside variable-name parentheticals.
  if (!/^[A-Z]/.test(cleaned)) return [];
  const matches: number[] = [];
  const lw = cleaned.toLowerCase();
  const lwNorm = normalize(cleaned);
  // Strip a leading colon-prefixed clarifier ("Wikipedia: foo" → "Wikipedia").
  const lwHead = cleaned.split(":")[0].trim().toLowerCase();
  const lwHeadNorm = normalize(lwHead);
  for (const r of refs) {
    const pub = r.publisher.toLowerCase();
    const pubNorm = normalize(r.publisher);
    if (
      pub === lw ||
      pub.startsWith(lw + " ") ||
      pub.startsWith(lw + ".") ||
      lw.startsWith(pub + " ") ||
      pub.includes(" " + lw + " ") ||
      pubNorm === lwNorm ||
      pubNorm.startsWith(lwNorm) ||
      pubNorm === lwHeadNorm ||
      pubNorm.startsWith(lwHeadNorm) ||
      r.searchTokens.some((t) => t.toLowerCase() === lw || normalize(t) === lwNorm)
    ) {
      matches.push(r.index);
    }
  }
  return matches.slice(0, 2);
}

function isAttributionParenthetical(content: string): boolean {
  // Reject if it contains lowercase prose words not consistent with a citation.
  // Heuristic: most citation parentheticals are ≤ 80 chars and mostly Title-Case.
  if (content.length > 100) return false;
  // Skip technical/glossary parentheticals like (MCP), (B2A), (UCP), (TAP) — pure acronyms.
  if (/^[A-Z0-9]{1,5}$/.test(content.trim())) return false;
  // Skip parentheticals that are clearly explanatory prose, not citations.
  if (/\b(see|e\.g\.|i\.e\.|note|including|such as|aka|formerly)\b/i.test(content)) return false;
  if (/\bthe\b.*\bis\b/i.test(content)) return false;
  return true;
}

function processBody(body: string, refs: Ref[]): {
  newBody: string;
  candidates: Array<{ original: string; replacement: string; matched: Match[] }>;
} {
  const candidates: Array<{ original: string; replacement: string; matched: Match[] }> = [];

  // Walk paragraphs above the bibliography only.
  const refSectionLine = body.split("\n").findIndex((l) => /^# References\s*$/.test(l));
  const upper = refSectionLine >= 0 ? body.split("\n").slice(0, refSectionLine).join("\n") : body;
  const lower = refSectionLine >= 0 ? body.split("\n").slice(refSectionLine).join("\n") : "";

  const newUpper = upper.replace(/\(([^()]{2,160})\)/g, (full, content: string) => {
    if (!isAttributionParenthetical(content)) return full;
    const labels = content
      .split(/[;,]/)
      .map((s) => s.trim())
      .filter(Boolean);
    const matched: Match[] = [];
    const fallbackLabels: string[] = [];
    for (const label of labels) {
      const m = matchLabel(label, refs);
      if (m.length > 0) {
        matched.push({ label, refs: m });
      } else {
        fallbackLabels.push(label);
      }
    }
    if (matched.length === 0) return full;
    const markerStr = matched.flatMap((mm) => mm.refs).map((n) => `[^${n}]`).join("");
    const replacement =
      fallbackLabels.length > 0
        ? `${markerStr} (${fallbackLabels.join(", ")})`
        : markerStr;
    candidates.push({ original: full, replacement, matched });
    return replacement;
  });

  return { newBody: newUpper + lower, candidates };
}

function main() {
  const apply = process.argv.includes("--apply");
  const raw = fs.readFileSync(SRC, "utf8");
  const refs = parseBibliography(raw);
  console.log(`Parsed ${refs.length} bibliography refs`);
  const { newBody, candidates } = processBody(raw, refs);

  console.log(`\nProposed conversions: ${candidates.length}\n`);
  for (const c of candidates.slice(0, 40)) {
    console.log(`  ${c.original}  →  ${c.replacement}`);
  }
  if (candidates.length > 40) {
    console.log(`  …and ${candidates.length - 40} more`);
  }

  if (apply) {
    fs.writeFileSync(SRC, newBody);
    console.log(`\nApplied ${candidates.length} conversions to ${slug}.md`);
  } else {
    console.log(`\n(dry run — pass --apply to write changes)`);
  }
}

main();

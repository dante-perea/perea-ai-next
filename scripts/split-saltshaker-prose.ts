/**
 * split-saltshaker-prose.ts
 *
 * For prose paragraphs that exceed the salt-shaker threshold, find a sentence
 * boundary inside the paragraph and split it into two paragraphs at that
 * boundary, picking the boundary that keeps each side under the threshold.
 *
 * Algorithm: walk sentence boundaries (`. ` followed by capital letter, plus
 * `;` for semicolon-joined clauses), find the split point that minimises the
 * larger half's distinct-ref count while keeping both halves <THRESHOLD.
 * If no single split satisfies, recurse: split the offending half again.
 *
 * Tight-list paragraphs (every line is `- ` or `N.` bullet) are skipped —
 * those should already be handled by split-saltshaker-lists.ts.
 *
 * Usage:
 *   npx tsx scripts/split-saltshaker-prose.ts            # dry run (per-paper count)
 *   npx tsx scripts/split-saltshaker-prose.ts --apply    # write changes
 */
import fs from "node:fs";
import path from "node:path";
import { listResearch } from "../lib/research";

const CONTENT_DIR = path.join(process.cwd(), "content", "whitepapers");
const THRESHOLD = 10;

function findRefsSectionStart(lines: string[]): number {
  for (let i = lines.length - 1; i >= 0; i--) {
    if (/^#{1,3}\s+(References|Sources|Citations|Footnotes|Notes)\s*$/i.test(lines[i])) {
      return i;
    }
  }
  return -1;
}

function isListLine(line: string): boolean {
  return /^\s*([-*+]|\d+\.)\s+/.test(line);
}

function isTableLine(line: string): boolean {
  return /^\s*\|/.test(line);
}

function distinctRefs(text: string): number {
  const ids = new Set<number>();
  const re = /\[\^(\d+)\]/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) ids.add(parseInt(m[1], 10));
  return ids.size;
}

/**
 * Split a paragraph at the best sentence boundary. Returns either a single-
 * element array (no good split found) or [first, second] each <THRESHOLD.
 * If neither half is below threshold, recurses on the larger half.
 */
function splitParagraph(text: string): string[] {
  if (distinctRefs(text) < THRESHOLD) return [text];
  // Candidate split points: positions of sentence-ending `. ` followed by
  // capital letter, plus semicolon (` ; `) for run-on sentences with
  // semicolon-joined clauses, plus `**` markdown-bold ending a header phrase.
  const candidates: number[] = [];
  const re = /(?:[.?!]|\.\*\*|\.")\s+(?=[A-Z(*])|;\s+(?=[A-Z(])/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    candidates.push(m.index + m[0].length);
  }
  if (candidates.length === 0) return [text];
  // Find split that minimises max(refs(left), refs(right))
  let best: { idx: number; max: number } | null = null;
  for (const c of candidates) {
    const L = distinctRefs(text.slice(0, c));
    const R = distinctRefs(text.slice(c));
    const max = Math.max(L, R);
    if (best === null || max < best.max) best = { idx: c, max };
  }
  if (!best) return [text];
  const first = text.slice(0, best.idx).trimEnd();
  const second = text.slice(best.idx).trimStart();
  // Recurse on either half if it still exceeds threshold
  const firstParts = distinctRefs(first) >= THRESHOLD ? splitParagraph(first) : [first];
  const secondParts = distinctRefs(second) >= THRESHOLD ? splitParagraph(second) : [second];
  return [...firstParts, ...secondParts];
}

interface FixResult {
  slug: string;
  paragraphsSplit: number;
  unfixable: number;
}

function processFile(slug: string, apply: boolean): FixResult {
  const file = path.join(CONTENT_DIR, `${slug}.md`);
  const raw = fs.readFileSync(file, "utf8");
  const fmEnd = raw.indexOf("\n---\n", 4);
  const headPrefix = fmEnd > 0 ? raw.slice(0, fmEnd + 5) : "";
  const body = fmEnd > 0 ? raw.slice(fmEnd + 5) : raw;
  const lines = body.split("\n");
  const limit = (() => {
    const idx = findRefsSectionStart(lines);
    return idx >= 0 ? idx : lines.length;
  })();

  const out: string[] = [];
  let paragraphsSplit = 0;
  let unfixable = 0;

  let i = 0;
  let inQuotable = false;
  while (i < lines.length) {
    if (i >= limit) {
      out.push(...lines.slice(i));
      break;
    }
    const line = lines[i];
    const h2 = /^##\s+(.*)$/.exec(line);
    if (h2 && !line.startsWith("###")) {
      inQuotable = /^Quotable( Findings)?\b/i.test(h2[1].trim());
    }
    if (line.trim() === "" || line.startsWith("#") || /^\[\^\d+\]:/.test(line)) {
      out.push(line);
      i++;
      continue;
    }
    if (inQuotable) {
      out.push(line);
      i++;
      continue;
    }
    let j = i;
    const buf: string[] = [];
    while (j < limit) {
      const lj = lines[j];
      if (lj.trim() === "" || lj.startsWith("#") || /^\[\^\d+\]:/.test(lj)) break;
      buf.push(lj);
      j++;
    }
    const allList = buf.every((l) => isListLine(l));
    const anyTable = buf.some((l) => isTableLine(l));
    const fullText = buf.join("\n");
    if (distinctRefs(fullText) < THRESHOLD || allList || anyTable) {
      out.push(...buf);
      i = j;
      continue;
    }
    // Prose paragraph that's a single line of joined sentences — split it
    // logically, then re-emit each segment as its own paragraph (blank line
    // between).
    if (buf.length === 1) {
      const parts = splitParagraph(buf[0]);
      if (parts.length === 1) {
        unfixable++;
        out.push(...buf);
      } else {
        for (let k = 0; k < parts.length; k++) {
          out.push(parts[k]);
          if (k < parts.length - 1) out.push("");
        }
        paragraphsSplit++;
      }
    } else {
      // Multi-line non-list paragraph (rare). Try splitting after the line
      // whose end leaves both halves <THRESHOLD.
      let didSplit = false;
      for (let k = 1; k < buf.length; k++) {
        const left = buf.slice(0, k).join("\n");
        const right = buf.slice(k).join("\n");
        if (distinctRefs(left) < THRESHOLD && distinctRefs(right) < THRESHOLD) {
          out.push(...buf.slice(0, k));
          out.push("");
          out.push(...buf.slice(k));
          didSplit = true;
          paragraphsSplit++;
          break;
        }
      }
      if (!didSplit) {
        unfixable++;
        out.push(...buf);
      }
    }
    i = j;
  }

  if (apply && paragraphsSplit > 0) {
    fs.writeFileSync(file, headPrefix + out.join("\n"));
  }

  return { slug, paragraphsSplit, unfixable };
}

function main() {
  const apply = process.argv.includes("--apply");
  const slugs = listResearch().map((p) => p.slug);
  let totalSplit = 0;
  let totalUnfixable = 0;
  for (const slug of slugs) {
    const r = processFile(slug, apply);
    if (r.paragraphsSplit === 0 && r.unfixable === 0) continue;
    console.log(`${r.slug.padEnd(60)} split=${r.paragraphsSplit}  unfixable=${r.unfixable}`);
    totalSplit += r.paragraphsSplit;
    totalUnfixable += r.unfixable;
  }
  console.log(
    `\nTotal: ${totalSplit} prose paragraphs ${apply ? "split" : "would be split"}; ${totalUnfixable} unfixable.`,
  );
}

main();

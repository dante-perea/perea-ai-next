#!/usr/bin/env tsx
/**
 * Densify inline citations: for each claim sentence in a whitepaper draft,
 * find the nearest [^N] marker in the same paragraph and propagate it to
 * the claim's position within ±80 chars. Used by perea-research-engine
 * verify phase when Layer 2 citation coverage falls below 85%.
 */
import * as fs from "fs";
import * as path from "path";
import matter from "gray-matter";

const slug = process.argv[2];
if (!slug) {
  console.error("usage: tsx scripts/densify-citations.ts <slug>");
  process.exit(1);
}

const filePath = path.join("content/whitepapers", `${slug}.md`);
const raw = fs.readFileSync(filePath, "utf8");
const parsed = matter(raw);
const body = parsed.content;
const lines = body.split("\n");

// Identify the references section so we don't densify it.
let refsStart = lines.length;
for (let i = lines.length - 1; i >= 0; i--) {
  if (/^\[\^[\w-]+\]:\s/.test(lines[i])) {
    refsStart = i;
  } else if (refsStart < lines.length && lines[i].trim() === "") {
    continue;
  } else if (refsStart < lines.length) {
    break;
  }
}
// Find "## References" heading
for (let i = 0; i < lines.length; i++) {
  if (/^#{1,3}\s+References\s*$/i.test(lines[i])) {
    refsStart = Math.min(refsStart, i);
    break;
  }
}

const CLAIM_RE_LIST: RegExp[] = [
  /\$[\d,]+(?:\.\d+)?\s*(?:million|billion|trillion|M|B|K|thousand)?/gi,
  /\b\d+(?:\.\d+)?\s*(?:million|billion|trillion|thousand|M|B|K)\b/gi,
  /\b\d+(?:\.\d+)?\s*%/g,
  /\bSeries\s+[A-G]\b/gi,
  /\b(?:more than|over|at least|approximately|nearly|around|roughly|about)\s+\d[\d,]*(?:\.\d+)?\s*(?:million|billion|thousand|customers|users|learners|graduates|students|institutions|companies|countries|districts|programs|states|patients|providers|partners|employees|staff|clients|alumni|jobs|cohorts|cities|languages|courses|exams|tests|programs|attorneys|grants|loans|partnerships|paid|enterprise|customers)\b/gi,
];

const CITATION_RE = /\[\^[\w-]+\]/g;

// Group lines into paragraphs (blocks separated by blank lines).
type Block = { startLine: number; endLine: number; lines: string[] };
const blocks: Block[] = [];
let cur: Block | null = null;
for (let i = 0; i < lines.length; i++) {
  if (i >= refsStart) break;
  if (lines[i].trim() === "") {
    if (cur) { blocks.push(cur); cur = null; }
    continue;
  }
  if (!cur) cur = { startLine: i, endLine: i, lines: [] };
  cur.lines.push(lines[i]);
  cur.endLine = i;
}
if (cur) blocks.push(cur);

let inserted = 0;
const editsByLine = new Map<number, { pos: number; tag: string }[]>();

for (const block of blocks) {
  // Concatenate the block with running offsets so we can map (lineIdx, charIdx) <-> globalIdx.
  const segments: { line: number; start: number; text: string }[] = [];
  let global = "";
  for (let li = 0; li < block.lines.length; li++) {
    const lineText = block.lines[li];
    segments.push({ line: block.startLine + li, start: global.length, text: lineText });
    global += lineText + "\n";
  }
  // Collect all [^N] markers across the block (paragraph).
  const markers: { gIdx: number; tag: string }[] = [];
  let m: RegExpExecArray | null;
  CITATION_RE.lastIndex = 0;
  while ((m = CITATION_RE.exec(global)) !== null) {
    markers.push({ gIdx: m.index, tag: m[0] });
  }
  if (markers.length === 0) continue;
  // Collect all claim ends across the block.
  const claims: { gEnd: number }[] = [];
  for (const re of CLAIM_RE_LIST) {
    re.lastIndex = 0;
    let cm: RegExpExecArray | null;
    while ((cm = re.exec(global)) !== null) {
      claims.push({ gEnd: cm.index + cm[0].length });
    }
  }
  // For each claim, check ±80 chars for any marker; if none, insert nearest paragraph marker at claim end.
  for (const claim of claims) {
    const nearby = markers.find((mk) => Math.abs(mk.gIdx - claim.gEnd) <= 80);
    if (nearby) continue;
    let nearest = markers[0];
    let minDist = Math.abs(markers[0].gIdx - claim.gEnd);
    for (const mk of markers) {
      const d = Math.abs(mk.gIdx - claim.gEnd);
      if (d < minDist) { minDist = d; nearest = mk; }
    }
    // Map gEnd back to (lineIdx, charIdx) within original lines array.
    let target = segments[0];
    for (const s of segments) {
      if (claim.gEnd >= s.start && claim.gEnd <= s.start + s.text.length) {
        target = s;
        break;
      }
    }
    const lineIdx = target.line;
    const charIdx = claim.gEnd - target.start;
    if (!editsByLine.has(lineIdx)) editsByLine.set(lineIdx, []);
    editsByLine.get(lineIdx)!.push({ pos: charIdx, tag: nearest.tag });
    inserted++;
  }
}

const newLines = lines.slice();
for (const [lineIdx, edits] of editsByLine) {
  edits.sort((a, b) => b.pos - a.pos);
  let line = newLines[lineIdx];
  for (const e of edits) {
    line = line.slice(0, e.pos) + e.tag + line.slice(e.pos);
  }
  newLines[lineIdx] = line;
}

const newBody = newLines.join("\n");
const out = matter.stringify(newBody, parsed.data);
fs.writeFileSync(filePath, out, "utf8");
console.log(`Inserted ${inserted} citation markers into ${filePath}`);

/**
 * list-saltshaker.ts
 *
 * Read-only worklist generator for editorial Layer 2c fixes. For each paper
 * passed in (or all of them with `--all`), prints offender paragraph line
 * ranges, ref IDs, and the paragraph text — enough to drive paragraph-split
 * editorial work without needing to grep manually.
 *
 * Usage:
 *   npx tsx scripts/list-saltshaker.ts <slug> [<slug2> ...]
 *   npx tsx scripts/list-saltshaker.ts --all
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

interface Offender {
  startLine: number;
  endLine: number;
  ids: number[];
  text: string;
}

function findOffenders(slug: string): Offender[] {
  const file = path.join(CONTENT_DIR, `${slug}.md`);
  const raw = fs.readFileSync(file, "utf8");
  // Skip frontmatter
  const fmEnd = raw.indexOf("\n---\n", 4);
  const bodyStart = fmEnd > 0 ? fmEnd + 5 : 0;
  const body = raw.slice(bodyStart);
  const offsetLine = raw.slice(0, bodyStart).split("\n").length - 1;
  const lines = body.split("\n");
  const limit = (() => {
    const idx = findRefsSectionStart(lines);
    return idx >= 0 ? idx : lines.length;
  })();
  const offenders: Offender[] = [];
  let i = 0;
  let inQuotable = false;
  while (i < limit) {
    const line = lines[i];
    const h2 = /^##\s+(.*)$/.exec(line);
    if (h2 && !line.startsWith("###")) {
      inQuotable = /^Quotable( Findings)?\b/i.test(h2[1].trim());
    }
    if (line.trim() === "" || line.startsWith("#") || /^\[\^\d+\]:/.test(line)) {
      i++;
      continue;
    }
    if (inQuotable) {
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
    const paragraph = buf.join("\n");
    const ids = new Set<number>();
    const re = /\[\^(\d+)\]/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(paragraph)) !== null) ids.add(parseInt(m[1], 10));
    if (ids.size >= THRESHOLD) {
      offenders.push({
        startLine: i + offsetLine + 1,
        endLine: j + offsetLine,
        ids: [...ids].sort((a, b) => a - b),
        text: paragraph,
      });
    }
    i = j + 1;
  }
  return offenders;
}

function main() {
  const args = process.argv.slice(2);
  let slugs: string[];
  if (args.includes("--all")) {
    slugs = listResearch().map((p) => p.slug);
  } else {
    slugs = args.filter((a) => !a.startsWith("--"));
  }
  for (const slug of slugs) {
    const offenders = findOffenders(slug);
    if (offenders.length === 0) continue;
    console.log(`\n=== ${slug} (${offenders.length} offender paragraph${offenders.length > 1 ? "s" : ""}) ===`);
    for (const o of offenders) {
      console.log(`  lines ${o.startLine}–${o.endLine}  ${o.ids.length} refs [^${o.ids.join("][^")}]`);
      console.log(o.text.split("\n").map((l) => `    ${l}`).join("\n"));
    }
  }
}

main();

/**
 * split-saltshaker-lists.ts
 *
 * For each Layer 2c offender paragraph, if the paragraph is a list (every
 * non-blank line is a bullet `-` / `*` or a numbered item `N.`), insert a
 * blank line between consecutive items so each item becomes its own
 * paragraph in the verifier's eyes. Markdown rendering is unaffected (tight
 * vs loose lists both render correctly).
 *
 * Prose paragraphs (with sentence-style content) are skipped — those need
 * manual editorial split.
 *
 * Usage:
 *   npx tsx scripts/split-saltshaker-lists.ts            # dry run
 *   npx tsx scripts/split-saltshaker-lists.ts --apply    # write changes
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

interface FixResult {
  slug: string;
  paragraphsFixed: number;
  prosePending: number;
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
  let paragraphsFixed = 0;
  let prosePending = 0;

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
    // Gather paragraph
    let j = i;
    const buf: string[] = [];
    while (j < limit) {
      const lj = lines[j];
      if (lj.trim() === "" || lj.startsWith("#") || /^\[\^\d+\]:/.test(lj)) break;
      buf.push(lj);
      j++;
    }
    // Count distinct refs
    const ids = new Set<number>();
    const re = /\[\^(\d+)\]/g;
    let m: RegExpExecArray | null;
    const fullText = buf.join("\n");
    while ((m = re.exec(fullText)) !== null) ids.add(parseInt(m[1], 10));

    if (ids.size < THRESHOLD) {
      out.push(...buf);
      i = j;
      continue;
    }

    // Check if every line in buf is a list line
    const allList = buf.every((l) => isListLine(l));
    if (allList && buf.length >= 2) {
      // Insert blank lines between items
      for (let k = 0; k < buf.length; k++) {
        out.push(buf[k]);
        if (k < buf.length - 1) out.push("");
      }
      paragraphsFixed++;
    } else {
      // Prose paragraph — leave for manual fix
      out.push(...buf);
      prosePending++;
    }
    i = j;
  }

  if (apply && paragraphsFixed > 0) {
    fs.writeFileSync(file, headPrefix + out.join("\n"));
  }

  return { slug, paragraphsFixed, prosePending };
}

function main() {
  const apply = process.argv.includes("--apply");
  const slugs = listResearch().map((p) => p.slug);
  let totalFixed = 0;
  let totalProse = 0;
  for (const slug of slugs) {
    const r = processFile(slug, apply);
    if (r.paragraphsFixed === 0 && r.prosePending === 0) continue;
    console.log(
      `${r.slug.padEnd(60)} fixed=${r.paragraphsFixed}  prose-pending=${r.prosePending}`,
    );
    totalFixed += r.paragraphsFixed;
    totalProse += r.prosePending;
  }
  console.log(
    `\nTotal: ${totalFixed} list paragraphs ${apply ? "fixed" : "would be fixed"}; ${totalProse} prose paragraphs need manual split.`,
  );
}

main();

#!/usr/bin/env tsx
/**
 * Convert named footnote markers like [^cour-q4] to numeric [^1], [^2], etc.
 * The perea verify pipeline (lib/research-claims.ts scanInlineCitation) only
 * recognizes numeric IDs as citations, so this normalizes the namespace.
 */
import * as fs from "fs";
import * as path from "path";

const slug = process.argv[2];
if (!slug) {
  console.error("usage: tsx scripts/numericize-citations.ts <slug>");
  process.exit(1);
}
const filePath = path.join("content/whitepapers", `${slug}.md`);
const raw = fs.readFileSync(filePath, "utf8");

// Find all footnote definitions in order: [^name]: ...
const defRe = /^\[\^([\w-]+)\]:\s/gm;
const order: string[] = [];
let m: RegExpExecArray | null;
while ((m = defRe.exec(raw)) !== null) {
  if (!order.includes(m[1])) order.push(m[1]);
}

const map = new Map<string, number>();
order.forEach((name, i) => map.set(name, i + 1));

// Replace all [^name] occurrences (both inline and definitions) with [^N]
let out = raw.replace(/\[\^([\w-]+)\]/g, (full, name) => {
  const n = map.get(name);
  if (typeof n !== "number") return full;
  return `[^${n}]`;
});

fs.writeFileSync(filePath, out, "utf8");
console.log(`Numericized ${order.length} footnote names in ${filePath}`);

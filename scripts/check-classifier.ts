import { extractReferences } from "../lib/research-claims";
import fs from "node:fs";
const slug = process.argv[2] || "trust-layer-deep-dive";
const content = fs.readFileSync(`./content/whitepapers/${slug}.md`, "utf8");
const { refs } = extractReferences(content);
for (const r of refs) {
  console.log(`[^${r.index}] ${r.tier.padEnd(10)} ${(r.domain ?? "(none)").padEnd(40)} | ${r.classifyReason}`);
}

import * as fs from "fs";
import * as path from "path";
import matter from "gray-matter";
import { extractClaims, extractReferences } from "../lib/research-claims";

const slug = process.argv[2];
if (!slug) { console.error("usage: tsx scripts/list-fwd-uncited.ts <slug>"); process.exit(1); }
const filePath = path.join("content/whitepapers", `${slug}.md`);
const raw = fs.readFileSync(filePath, "utf8");
const parsed = matter(raw);
const body = parsed.content;
const lines = body.split("\n");
let refsStart = lines.length;
for (let i = lines.length - 1; i >= 0; i--) {
  if (/^\[\^[\w-]+\]:\s/.test(lines[i])) refsStart = i;
}
const { refs } = extractReferences(body);
const claims = extractClaims(body, refsStart);
const fwd = claims.filter((c: any) => {
  if (!c.forwardDated) return false;
  if (c.citationIds.length === 0) return true;
  const cited = c.citationIds.map((id: number) => refs.find((r: any) => r.index === id)).filter(Boolean);
  if (cited.length === 0) return true;
  if (cited.every((r: any) => r!.tier === "tertiary" || r!.tier === "unknown")) return true;
  return false;
});
console.log(`Forward-dated uncited or tertiary-only: ${fwd.length}`);
for (const c of fwd) {
  console.log("---");
  console.log(`citationIds: ${(c as any).citationIds.join(",")}`);
  console.log((c as any).surroundingContext?.slice(0, 280) ?? JSON.stringify(c).slice(0, 200));
}

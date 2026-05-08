import * as fs from "fs";
import * as path from "path";
import matter from "gray-matter";
import { extractClaims } from "../lib/research-claims";

const slug = process.argv[2];
if (!slug) {
  console.error("usage: tsx scripts/list-fwd-uncited.ts <slug>");
  process.exit(1);
}
const filePath = path.join("content/whitepapers", `${slug}.md`);
const raw = fs.readFileSync(filePath, "utf8");
const parsed = matter(raw);
const body = parsed.content;
const claims = extractClaims(body);
const fwd = claims.filter((c: any) => c.forwardDated && c.citationIds.length === 0);
console.log(`Forward-dated uncited: ${fwd.length}`);
for (const c of fwd) {
  console.log("---");
  console.log((c as any).surroundingContext?.slice(0, 240) ?? JSON.stringify(c).slice(0, 200));
}

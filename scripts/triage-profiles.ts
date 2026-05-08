/**
 * triage-profiles.ts
 *
 * Read-only script: scans content/whitepapers for papers without an explicit
 * `profile:` frontmatter field and emits a recommended profile per slug based
 * on title heuristics. The recommendations are mechanical — editorial review
 * is required before applying any change.
 *
 * Heuristic mapping:
 *   - title contains "field manual" or "field-manual" → field-manual
 *   - title contains "playbook"                       → technical-playbook
 *   - title contains "autopsy" / "failure" / "incident" / "post-mortem" → failure-mode
 *   - title contains "forecast" / "outlook" / "horizon" → hedged
 *   - everything else                                  → field-manual (safer default)
 *
 * Usage:
 *   npx tsx scripts/triage-profiles.ts            # print recommendations
 *   npx tsx scripts/triage-profiles.ts --apply    # write profile field into each frontmatter
 */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const CONTENT_DIR = path.join(process.cwd(), "content", "whitepapers");

type Profile =
  | "authority-survey"
  | "field-manual"
  | "technical-playbook"
  | "failure-mode"
  | "hedged";

function suggestProfile(title: string): Profile {
  const t = title.toLowerCase();
  if (/\b(field manual|field-manual)\b/.test(t)) return "field-manual";
  if (/\bplaybook\b/.test(t)) return "technical-playbook";
  if (/\b(autops|failure|incident|post-mortem|postmortem)\b/.test(t)) return "failure-mode";
  if (/\b(forecast|outlook|horizon)\b/.test(t)) return "hedged";
  return "field-manual";
}

function main() {
  const apply = process.argv.includes("--apply");
  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".md"));
  const recs: Array<{ slug: string; profile: Profile }> = [];

  for (const file of files) {
    const slug = file.replace(/\.md$/, "");
    const filePath = path.join(CONTENT_DIR, file);
    const raw = fs.readFileSync(filePath, "utf8");
    const { data: fm, content } = matter(raw);
    if (fm.profile) continue; // already declared
    const title = (fm.title as string) || slug;
    const profile = suggestProfile(title);
    recs.push({ slug, profile });

    if (apply) {
      // In-place edit to preserve exact frontmatter formatting: insert
      // `profile: "<value>"` line just before the closing `---`. We split on
      // the first two `---` lines (the frontmatter delimiters) and inject the
      // new line; matter.stringify would re-emit the whole block and could
      // shuffle key order or quote style.
      const lines = raw.split("\n");
      if (lines[0] !== "---") {
        console.warn(`skip ${slug}: frontmatter does not start with ---`);
        continue;
      }
      let closing = -1;
      for (let i = 1; i < lines.length; i++) {
        if (lines[i] === "---") {
          closing = i;
          break;
        }
      }
      if (closing < 0) {
        console.warn(`skip ${slug}: no closing --- found`);
        continue;
      }
      const updatedLines = [
        ...lines.slice(0, closing),
        `profile: "${profile}"`,
        ...lines.slice(closing),
      ];
      fs.writeFileSync(filePath, updatedLines.join("\n"));
    }
  }

  for (const { slug, profile } of recs) {
    console.log(`${profile.padEnd(20)} ${slug}`);
  }
  console.log(`\nTotal: ${recs.length} papers ${apply ? "updated" : "would be updated"}`);
}

main();

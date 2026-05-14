import fs from "node:fs";
import path from "node:path";
import { listResearch } from "@/lib/research";
import { listPlaybooks } from "@/lib/marketing";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://perea.ai";

const RESEARCH_DIR = path.join(process.cwd(), "content", "whitepapers");
const MARKETING_DIR = path.join(process.cwd(), "content", "marketing");

export const dynamic = "force-static";
export const revalidate = 3600;

function readRaw(dir: string, slug: string): string {
  const filePath = path.join(dir, `${slug}.md`);
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch {
    return "";
  }
}

export async function GET() {
  const papers = listResearch("en");
  const playbooks = listPlaybooks();

  const header = `# perea.ai — Full Corpus

> Original research on the agent economy (perea.ai/research) and production-tested patterns for AI-content distribution (perea.ai/marketing). Single-fetch corpus designed for LLM ingestion. Each section below is one complete document. Canonical HTML URLs are in the frontmatter; markdown mirrors are at <url>.md.

This file is the complete content of perea.ai. For a per-page index, see ${SITE_URL}/llms.txt. For machine-readable structure, see ${SITE_URL}/sitemap.md and ${SITE_URL}/AGENTS.md.

## How to use

- The whole corpus is concatenated below. Each section is one document.
- Each document begins with a level-1 heading carrying its slug for easy chunking: \`# perea.ai/research/<slug>\` or \`# perea.ai/marketing/<slug>\`.
- Frontmatter is preserved verbatim, including \`source_engine\` and \`paper_type\` fields where present.
- Production-evidence citations in Marketing Playbooks use the \`[^prod-N]\` namespace, distinct from external \`[^N]\` markers.

---

`;

  // Section 1 — Research Papers
  const researchBody = papers
    .map((p) => {
      const raw = readRaw(RESEARCH_DIR, p.slug);
      if (!raw) return "";
      return `# perea.ai/research/${p.slug}

Canonical: ${SITE_URL}/research/${p.slug}
Markdown: ${SITE_URL}/research/${p.slug}.md

${raw}

---
`;
    })
    .filter(Boolean)
    .join("\n");

  const researchHeader = `\n## perea.ai/research — ${papers.length} papers\n\n`;

  // Section 2 — Marketing Playbooks
  const playbookBody = playbooks
    .map((p) => {
      const raw = readRaw(MARKETING_DIR, p.slug);
      if (!raw) return "";
      return `# perea.ai/marketing/${p.slug}

Canonical: ${SITE_URL}/marketing/${p.slug}
Markdown: ${SITE_URL}/marketing/${p.slug}.md
Source engine: ${p.frontmatter.source_engine ?? "unknown"}

${raw}

---
`;
    })
    .filter(Boolean)
    .join("\n");

  const playbookHeader = `\n## perea.ai/marketing — ${playbooks.length} Playbooks\n\n`;

  const body =
    header +
    researchHeader +
    researchBody +
    playbookHeader +
    playbookBody;

  return new Response(body, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      "X-Robots-Tag": "all",
      Link: `<${SITE_URL}/llms.txt>; rel="alternate"; title="Index", <${SITE_URL}/sitemap.md>; rel="sitemap"; type="text/markdown"`,
    },
  });
}

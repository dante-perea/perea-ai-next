import { listResearch } from "@/lib/research";
import { listPlaybooks, listEvidenceFiles } from "@/lib/marketing";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://perea.ai";

export const dynamic = "force-static";
export const revalidate = 3600;

// Mirror the section rules from /llms.txt so /sitemap.md groups research
// papers the same way an agent would group them after reading the index.
const SECTION_RULES: [RegExp, string][] = [
  [/^(b2a-|mcp-|a2a-|webmcp-|ap2-|agent-payment-|ai-agent-wallet-|agent-ready-|browser-vs-protocol)/, "B2A Infrastructure & Protocols"],
  [/^(prompt-injection|trust-layer|capability-based|browser-agent-security|llamafirewall|verifiable-bot|ai-bom-|maestro-|mcp-oauth)/, "Security"],
  [/^(hipaa-soc2|soc2-|gdpr-|eu-ai-act|article-27-|aaif-|unified-ai-governance|three-state-test|policy-decision|construction-compliance|42-cfr)/, "Compliance & Regulatory"],
  [/^(hipaa-|ai-scribe-|measurement-based|therapist-|polaris-|practitioner-|healthcare-|five-framework)/, "Healthcare"],
  [/^(agent-observability|agent-memory|agent-fleet|agent-failure|agent-idempotency|agent-inbox|agent-cryptographic|agent-inference|geo-|claude-managed|edge-ai-)/, "Agent Infrastructure"],
  [/^(1099-|solo-401k|fractional-cfo|vertical-captive|trump-eo|federal-portable|portable-benefits|castellanos|sectoral-bargaining)/, "Financial & Tax"],
  [/^(eval-driven|multi-judge|rewardbench|specialized-llm-judge|beam-light|knowledge-distillation|lora-|gui-grounding|accessibility-tree|validated-learning)/, "Evaluation & Benchmarks"],
  [/^state-of-vertical-agents-/, "Vertical Market Analysis"],
  [/^(reinsurer|dual-incumbent|acquired-|prestige-led|implementation-gap|vertical-ai-pricing|ai-freelancer|subscription-paradox|b2b-trial|hyperscaler|vertical-corpus-moat|llms-txt-and)/, "Market & GTM"],
];

const SECTION_ORDER = [
  "B2A Infrastructure & Protocols",
  "Agent Infrastructure",
  "Security",
  "Compliance & Regulatory",
  "Healthcare",
  "Financial & Tax",
  "Evaluation & Benchmarks",
  "Market & GTM",
  "Vertical Market Analysis",
  "Operations & Tooling",
];

function classify(slug: string): string {
  for (const [pattern, section] of SECTION_RULES) {
    if (pattern.test(slug)) return section;
  }
  return "Operations & Tooling";
}

export async function GET() {
  const papers = listResearch("en");
  const playbooks = listPlaybooks();

  const sections = new Map<string, typeof papers>();
  for (const paper of papers) {
    const section = classify(paper.slug);
    if (!sections.has(section)) sections.set(section, []);
    sections.get(section)!.push(paper);
  }

  const header = `# perea.ai — Sitemap (markdown)

> Semantic sitemap for AI agents. Mirrors sitemap.xml but with section grouping and descriptions. For traditional crawlers, see [sitemap.xml](${SITE_URL}/sitemap.xml). For the full corpus in one request, see [llms-full.txt](${SITE_URL}/llms-full.txt). For per-page index, see [llms.txt](${SITE_URL}/llms.txt).

## Top-level routes

- [/](${SITE_URL}/) — homepage
- [/research](${SITE_URL}/research) — research papers index
- [/marketing](${SITE_URL}/marketing) — Marketing Playbooks index
- [/llms.txt](${SITE_URL}/llms.txt) — agent index, short
- [/llms-full.txt](${SITE_URL}/llms-full.txt) — full corpus, single fetch
- [/AGENTS.md](${SITE_URL}/AGENTS.md) — public router for calling agents
- [/feed.xml](${SITE_URL}/feed.xml) — RSS feed (research + marketing merged)
- [/sitemap.xml](${SITE_URL}/sitemap.xml) — XML sitemap for traditional crawlers

`;

  // Research section, organized by topical rule.
  const researchBody = SECTION_ORDER
    .filter((section) => sections.has(section))
    .map((section) => {
      const sectionPapers = sections.get(section)!;
      const lines = sectionPapers
        .map((p) => {
          const desc = p.frontmatter.subtitle || p.frontmatter.description || "";
          return `- [${p.frontmatter.title}](${SITE_URL}/research/${p.slug}) — ${desc}\n  Markdown: ${SITE_URL}/research/${p.slug}.md`;
        })
        .join("\n");
      return `### ${section}\n\n${lines}`;
    })
    .join("\n\n");

  const researchHeader = `\n## /research — ${papers.length} papers\n\n`;

  // Marketing section.
  const playbookBody = playbooks
    .map((p) => {
      const desc = p.frontmatter.subtitle || p.frontmatter.description || "";
      const engine = p.frontmatter.source_engine ?? "unknown";
      const evidence = listEvidenceFiles(p.slug);
      const evidenceLines = evidence.length === 0
        ? ""
        : `\n  Evidence:\n${evidence
            .map((f) => `    - ${SITE_URL}/marketing/${p.slug}/evidence/${f.replace(/\.md$/, "")}`)
            .join("\n")}`;
      return `- [${p.frontmatter.title}](${SITE_URL}/marketing/${p.slug}) — ${desc}\n  Markdown: ${SITE_URL}/marketing/${p.slug}.md\n  source_engine: \`${engine}\`${evidenceLines}`;
    })
    .join("\n\n");

  const playbookHeader = `\n## /marketing — ${playbooks.length} Playbooks\n\n`;

  const body =
    header +
    researchHeader +
    researchBody +
    playbookHeader +
    playbookBody +
    "\n";

  return new Response(body, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      "X-Robots-Tag": "all",
    },
  });
}

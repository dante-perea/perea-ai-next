import { listResearch } from "@/lib/research";
import { listTranslatedSlugs } from "@/lib/research-translations";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://perea.ai";

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

export const dynamic = "force-dynamic";

export async function GET() {
  const papers = listResearch("en");
  const esSlugSet = new Set(
    await listTranslatedSlugs("es").catch(() => [] as string[])
  );

  const sections = new Map<string, typeof papers>();
  for (const paper of papers) {
    const section = classify(paper.slug);
    if (!sections.has(section)) sections.set(section, []);
    sections.get(section)!.push(paper);
  }

  const header = `# perea.ai Research

> Original research on the agent economy: B2A infrastructure, protocol adoption, vertical playbooks, and benchmarks from real audits. Published by Dante Perea.

## About

perea.ai Research publishes long-form technical papers (6,000–12,000 words) aimed at SaaS founders, payments engineers, AI architects, and infrastructure leads building in the agent economy. Each paper is grounded in primary sources — protocol specifications, company announcements, production benchmarks, and regulatory filings.

## Research Papers

All papers are freely accessible. Canonical URL format: ${SITE_URL}/research/{slug}

`;

  const body = SECTION_ORDER
    .filter((section) => sections.has(section))
    .map((section) => {
      const sectionPapers = sections.get(section)!;
      const lines = sectionPapers
        .map((p) => {
          const desc = p.frontmatter.subtitle || p.frontmatter.description || "";
          let entry = `- [${p.frontmatter.title}](/research/${p.slug})\n  ${desc}`;
          if (esSlugSet.has(p.slug)) {
            entry += `\n  Spanish: /es/research/${p.slug}`;
          }
          return entry;
        })
        .join("\n\n");
      return `### ${section}\n\n${lines}`;
    })
    .join("\n\n");

  const footer = `

## MCP Server

perea.ai exposes a Model Context Protocol server for agent-native access to research content.
Endpoint: ${SITE_URL}/api/mcp/server
Authentication: Bearer token (contact dante@perea.ai)
Capabilities: list_papers, get_paper, search_papers

## Contact

Author: Dante Perea
Email: dante@perea.ai
Site: ${SITE_URL}
Research index: ${SITE_URL}/research
`;

  return new Response(header + body + footer, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}

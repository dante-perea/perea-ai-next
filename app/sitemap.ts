import type { MetadataRoute } from "next";
import { listTranslatedSlugs } from "@/lib/research-translations";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://perea.ai";

// Slugs are known at deploy time — new papers require a redeploy anyway
const EN_SLUGS = [
  "acquired-by-platform-exit-playbook",
  "agent-incident-postmortem-anthology",
  "agent-inference-unit-economics",
  "agent-memory-production",
  "agent-observability-stack",
  "agent-payment-stack-2026",
  "agent-ready-api-design",
  "agentic-procurement-field-manual",
  "b2a-2026",
  "banking-agentic-ai-risk-manual",
  "computer-use-deployment-overhang",
  "dual-incumbent-dynamic-playbook",
  "eu-ai-act-2026-procurement-compliance",
  "five-framework-compliance-methodology-healthcare",
  "founder-velocity-field-studies",
  "geo-2026",
  "healthcare-agent-incidents-and-compliance",
  "implementation-gap-conversion-playbook-cross-vertical",
  "mcp-server-playbook",
  "multi-judge-calibration-playbook",
  "pinnacle-gecko-protocol",
  "polaris-clinical-validation-panel-methodology",
  "prestige-led-distribution-playbook",
  "prompt-injection-defense-2026",
  "reinsurer-as-ai-pioneer-field-manual",
  "rpa-to-ai-agent-migration",
  "small-language-model-procurement",
  "state-of-vertical-agents-2026-agriculture-agtech",
  "state-of-vertical-agents-2026-cybersecurity",
  "state-of-vertical-agents-2026-defense-aerospace",
  "state-of-vertical-agents-2026-education-edtech",
  "state-of-vertical-agents-2026-energy-utilities",
  "state-of-vertical-agents-2026-government",
  "state-of-vertical-agents-2026-hr-recruiting",
  "state-of-vertical-agents-2026-investment-banking",
  "state-of-vertical-agents-2026-logistics-freight",
  "state-of-vertical-agents-2026-manufacturing-industrial",
  "state-of-vertical-agents-2026-media-entertainment",
  "state-of-vertical-agents-2026-pharma-drug-discovery",
  "state-of-vertical-agents-2026-residential-real-estate",
  "state-of-vertical-agents-2026-retail-cpg",
  "state-of-vertical-agents-2026-telecom",
  "state-of-vertical-agents-2026-travel-hospitality",
  "state-of-vertical-agents-2026-wealth-management",
  "state-of-vertical-agents-2027-field-service-trades",
  "state-of-vertical-agents-2027-mental-health-therapy-ops",
  "state-of-vertical-agents-2027-property-management-operations",
  "state-of-vertical-agents-2027-sales-revops",
  "state-of-vertical-agents-q1-2027-healthcare",
  "state-of-vertical-agents-q2-2027-accounting",
  "state-of-vertical-agents-q3-2026-legal",
  "state-of-vertical-agents-q3-2027-cre",
  "state-of-vertical-agents-q4-2026-insurance",
  "state-of-vertical-agents-q4-2027-construction",
  "three-state-test-compliance-methodology",
  "vertical-corpus-moat-field-manual",
];

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const esSlugs = await listTranslatedSlugs("es").catch(() => [] as string[]);
  const esSlugSet = new Set(esSlugs);

  const entries: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "monthly", priority: 1.0 },
    { url: `${SITE_URL}/research`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/es/research`, changeFrequency: "weekly", priority: 0.8 },
  ];

  for (const slug of EN_SLUGS) {
    const hasEs = esSlugSet.has(slug);
    const enUrl = `${SITE_URL}/research/${slug}`;
    const esUrl = `${SITE_URL}/es/research/${slug}`;

    entries.push({
      url: enUrl,
      changeFrequency: "monthly",
      priority: 0.8,
      ...(hasEs ? { alternates: { languages: { en: enUrl, es: esUrl } } } : {}),
    });

    if (hasEs) {
      entries.push({
        url: esUrl,
        changeFrequency: "monthly",
        priority: 0.7,
        alternates: { languages: { en: enUrl, es: esUrl } },
      });
    }
  }

  return entries;
}

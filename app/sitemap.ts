import type { MetadataRoute } from "next";
import { listTranslatedSlugs } from "@/lib/research-translations";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://perea.ai";

// Slugs are known at deploy time — new papers require a redeploy anyway
const EN_SLUGS = [
  "agent-incident-postmortem-anthology",
  "agent-memory-production",
  "agent-observability-stack",
  "agent-payment-stack-2026",
  "agent-ready-api-design",
  "agentic-procurement-field-manual",
  "b2a-2026",
  "computer-use-deployment-overhang",
  "eu-ai-act-2026-procurement-compliance",
  "geo-2026",
  "mcp-server-playbook",
  "multi-judge-calibration-playbook",
  "pinnacle-gecko-protocol",
  "prompt-injection-defense-2026",
  "small-language-model-procurement",
  "state-of-vertical-agents-q3-2026-legal",
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

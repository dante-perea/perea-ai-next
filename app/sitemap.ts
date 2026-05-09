import type { MetadataRoute } from "next";
import { listResearchSlugs } from "@/lib/research";
import { listTranslatedSlugs } from "@/lib/research-translations";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://perea.ai";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [enSlugs, esSlugs] = await Promise.all([
    Promise.resolve(listResearchSlugs("en")),
    listTranslatedSlugs("es").catch(() => [] as string[]),
  ]);
  const esSlugSet = new Set(esSlugs);

  const entries: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "monthly", priority: 1.0 },
    { url: `${SITE_URL}/research`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/es/research`, changeFrequency: "weekly", priority: 0.8 },
  ];

  for (const slug of enSlugs) {
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

import type { Metadata } from "next";
import { headers, cookies } from "next/headers";
import { notFound } from "next/navigation";

import { getLPConfig, getVariantContent } from "@/lib/lp-registry";
import { getGeoFromHeaders, getRegion, getLocalCTA, getLocalTrustLine } from "@/lib/geo";
import { parseVariant, trackImpression, abCookieName } from "@/lib/ab";
import { LPPage } from "@/components/lp/LPPage";

interface Props {
  params: Promise<{ slug: string }>;
}

// ─── SSR Metadata (per-LP SEO) ───────────────────────────────────────────────
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const config = getLPConfig(slug);
  if (!config) return {};

  return {
    title: config.title,
    description: config.description,
    openGraph: {
      title: config.title,
      description: config.description,
      url: `https://perea-ai.vercel.app/lp/${slug}`,
      images: config.ogImage
        ? [{ url: config.ogImage }]
        : [{ url: "/og-default.png", width: 1200, height: 630 }],
    },
    alternates: {
      canonical: `https://perea-ai.vercel.app/lp/${slug}`,
    },
  };
}

// ─── Static params for ISR pre-rendering ─────────────────────────────────────
export async function generateStaticParams() {
  return [
    { slug: "consultancy" },
    { slug: "sales" },
    { slug: "support" },
  ];
}

// ─── Page Component (RSC — Server-Side Rendered) ──────────────────────────────
export default async function LPRoute({ params }: Props) {
  const { slug } = await params;

  const config = getLPConfig(slug);
  if (!config) notFound();

  const cookieStore = await cookies();
  const variantCookie = cookieStore.get(abCookieName(slug))?.value;
  const variant = parseVariant(variantCookie);

  const headerStore = await headers();
  const headerMap = new Map<string, string>();
  headerStore.forEach((val, key) => headerMap.set(key, val));

  const geo = getGeoFromHeaders(headerMap);
  const region = getRegion(geo.country);
  const localCTA = getLocalCTA(region);
  const trustLine = getLocalTrustLine(region);

  const content = getVariantContent(config, variant);

  await trackImpression({ slug, variant, country: geo.country, city: geo.city });

  return (
    <LPPage
      config={config}
      content={content}
      variant={variant}
      geo={geo}
      localCTA={localCTA}
      trustLine={trustLine}
    />
  );
}

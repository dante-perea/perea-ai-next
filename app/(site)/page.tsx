import type { Metadata } from "next";
import { headers } from "next/headers";
import { getLPConfig, getVariantContent } from "@/lib/lp-registry";
import { getGeoFromHeaders, getRegion, getLocalCTA, getLocalTrustLine } from "@/lib/geo";
import { LPPage } from "@/components/lp/LPPage";

export const metadata: Metadata = {
  title: "Perea.AI — AI Consultancy Done Right",
  description:
    "We help startups and growing businesses cut through the AI hype with clear strategy, hands-on implementation, and measurable results. Fixed-price engagements, senior consultants.",
  openGraph: {
    title: "Perea.AI — AI Consultancy Done Right",
    description:
      "We help startups and growing businesses deploy practical AI that delivers. Fixed-price, senior consultants, measurable outcomes.",
    url: "https://perea-ai-next.vercel.app",
    images: [{ url: "/og-default.svg", width: 1200, height: 630 }],
  },
};

export default async function HomePage() {
  // Read geo headers (Vercel injects x-vercel-ip-country at edge)
  const headerStore = await headers();
  const headerMap = new Map<string, string>();
  headerStore.forEach((val, key) => headerMap.set(key, val));

  const geo = getGeoFromHeaders(headerMap);
  const region = getRegion(geo.country);
  const localCTA = getLocalCTA(region);
  const trustLine = getLocalTrustLine(region);

  // Homepage always uses default (variant A) — no A/B on the root
  const config = getLPConfig("consultancy")!;
  const content = getVariantContent(config, "a");

  return (
    <LPPage
      content={content}
      localCTA={localCTA}
      trustLine={trustLine}
    />
  );
}

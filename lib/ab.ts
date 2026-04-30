/**
 * A/B testing utilities.
 *
 * Strategy:
 * - Edge Middleware assigns a sticky variant cookie on first visit.
 * - The cookie name is `perea_ab_{slug}` so each LP has independent splits.
 * - RSC pages read the cookie via next/headers to pick variant content server-side.
 * - Zero client-side flicker — variant is resolved before HTML is streamed.
 *
 * Analytics:
 * - Each page render fires a server-side analytics event (stub here).
 * - Replace with your PostHog/Mixpanel server SDK call.
 */

import type { LPVariant } from "./lp-registry";

export const AB_COOKIE_PREFIX = "perea_ab_";
export const AB_SPLIT = 0.5; // 50/50 split

/** Returns cookie name for a given slug */
export function abCookieName(slug: string): string {
  return `${AB_COOKIE_PREFIX}${slug}`;
}

/** Randomly assigns a variant — used in middleware */
export function assignVariant(): LPVariant {
  return Math.random() < AB_SPLIT ? "a" : "b";
}

/** Parse variant from cookie string — falls back to "a" */
export function parseVariant(cookieValue: string | undefined): LPVariant {
  if (cookieValue === "b") return "b";
  return "a";
}

/**
 * Server-side analytics stub.
 * Replace the console.log with your PostHog/Segment server SDK.
 */
export async function trackImpression(params: {
  slug: string;
  variant: LPVariant;
  country: string;
  city?: string;
}): Promise<void> {
  // TODO: Replace with PostHog server SDK
  // await posthog.capture({ event: "lp_impression", ...params });
  if (process.env.NODE_ENV === "development") {
    console.log("[A/B Impression]", params);
  }
}

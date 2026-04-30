/**
 * A/B testing utilities.
 */

import type { LPVariant } from "./lp-registry";

export const AB_COOKIE_PREFIX = "perea_ab_";
export const AB_SPLIT = 0.5;

export function abCookieName(slug: string): string {
  return `${AB_COOKIE_PREFIX}${slug}`;
}

export function assignVariant(): LPVariant {
  return Math.random() < AB_SPLIT ? "a" : "b";
}

export function parseVariant(cookieValue: string | undefined): LPVariant {
  if (cookieValue === "b") return "b";
  return "a";
}

export async function trackImpression(params: {
  slug: string;
  variant: LPVariant;
  country: string;
  city?: string;
}): Promise<void> {
  if (process.env.NODE_ENV === "development") {
    console.log("[A/B Impression]", params);
  }
}

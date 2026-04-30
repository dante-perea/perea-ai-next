/**
 * Edge Middleware — runs on Vercel's edge network before any page render.
 *
 * Responsibilities:
 * 1. A/B variant assignment — assigns a sticky cookie per LP slug on first visit.
 * 2. Geo header pass-through — forwards Vercel's geo headers to RSC pages.
 *    (Vercel already injects x-vercel-ip-country etc., but we re-forward them
 *     as custom headers so they're accessible inside generateMetadata too.)
 */

import { NextResponse, type NextRequest } from "next/server";
import { abCookieName, assignVariant, AB_SPLIT } from "./lib/ab";

export const config = {
  matcher: ["/lp/:slug*"],
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Extract slug from /lp/{slug}
  const slugMatch = pathname.match(/^\/lp\/([^/]+)/);
  const slug = slugMatch?.[1];

  const response = NextResponse.next();

  // ── 1. A/B Variant Assignment ──────────────────────────────────────────────
  if (slug) {
    const cookieName = abCookieName(slug);
    const existingVariant = request.cookies.get(cookieName)?.value;

    if (!existingVariant) {
      const variant = assignVariant();
      response.cookies.set(cookieName, variant, {
        maxAge: 60 * 60 * 24 * 30, // 30 days — sticky
        sameSite: "lax",
        httpOnly: false,            // readable client-side for analytics
        secure: process.env.NODE_ENV === "production",
        path: `/lp/${slug}`,
      });
      // Forward as a request header so RSC can read it synchronously
      response.headers.set("x-ab-variant", variant);
    } else {
      response.headers.set("x-ab-variant", existingVariant);
    }
  }

  // ── 2. Geo Header Pass-through ────────────────────────────────────────────
  const country = request.headers.get("x-vercel-ip-country") ?? "US";
  const city    = request.headers.get("x-vercel-ip-city") ?? "";
  const region  = request.headers.get("x-vercel-ip-country-region") ?? "";

  response.headers.set("x-geo-country", country);
  response.headers.set("x-geo-city",    city);
  response.headers.set("x-geo-region",  region);

  return response;
}

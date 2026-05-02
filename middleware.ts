import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { abCookieName, assignVariant } from "./lib/ab";

const isProtected = createRouteMatcher([
  "/dashboard(.*)",
  "/api/knowledge-base/files(.*)",
  "/api/teams(.*)",
]);

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};

export default clerkMiddleware(async (auth, request) => {
  if (isProtected(request)) {
    await auth.protect();
  }

  const { pathname } = request.nextUrl;
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
        maxAge: 60 * 60 * 24 * 30,
        sameSite: "lax",
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        path: `/lp/${slug}`,
      });
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
});

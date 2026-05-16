import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest } from "next/server";
import { abCookieName, assignVariant } from "./lib/ab";
import { captureServerEvent, detectAICrawler } from "./lib/posthog-server";

const isProtected = createRouteMatcher([
  "/dashboard(.*)",
  "/api/knowledge-base/files(.*)",
  "/api/teams(.*)",
]);

// Constant-time string compare, Edge-runtime safe (no Node crypto).
function timingSafeEqualStr(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

function checkDanteAuth(request: NextRequest): boolean {
  const expected = process.env.DANTE_PASSWORD;
  if (!expected) return false; // fail closed if env var missing
  const header = request.headers.get("authorization") ?? "";
  if (!header.toLowerCase().startsWith("basic ")) return false;
  let decoded: string;
  try {
    decoded = atob(header.slice(6).trim());
  } catch {
    return false;
  }
  const idx = decoded.indexOf(":");
  if (idx < 0) return false;
  const password = decoded.slice(idx + 1);
  return timingSafeEqualStr(password, expected);
}

function denyDante(): NextResponse {
  return new NextResponse("Authentication required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="dante", charset="UTF-8"' },
  });
}

export const config = {
  matcher: [
    // /research/* and /marketing/* are now included so we can route .md
    // mirrors and apply Accept-based content negotiation. Clerk only protects
    // the routes named in isProtected; everything else passes through.
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};

// Routes that mirror their HTML page as markdown when:
//   - the URL ends in `.md`, OR
//   - the `Accept` header prefers `text/markdown` over `text/html`.
const MD_MIRROR_PREFIXES = ["/research/", "/marketing/"] as const;

function wantsMarkdown(acceptHeader: string | null): boolean {
  if (!acceptHeader) return false;
  const lc = acceptHeader.toLowerCase();
  if (!lc.includes("text/markdown")) return false;
  // If text/html appears earlier than text/markdown, assume html-first (browser).
  // Agents that want markdown either send just `text/markdown` or list it first.
  const mdIdx = lc.indexOf("text/markdown");
  const htmlIdx = lc.indexOf("text/html");
  if (htmlIdx >= 0 && htmlIdx < mdIdx) return false;
  return true;
}

function isMdMirrorPath(
  pathname: string,
): { kind: "research" | "marketing"; slug: string } | null {
  for (const prefix of MD_MIRROR_PREFIXES) {
    if (!pathname.startsWith(prefix)) continue;
    const tail = pathname.slice(prefix.length);
    if (tail.includes("/")) return null; // sub-route like /marketing/<slug>/evidence/...
    const kind = prefix === "/research/" ? "research" : "marketing";
    const slug = tail.endsWith(".md") ? tail.slice(0, -3) : tail;
    if (!slug) return null;
    return { kind, slug };
  }
  return null;
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://perea.ai";

function buildSiteLinkHeader(): string {
  return [
    `<${SITE_URL}/llms.txt>; rel="llms-txt"; type="text/plain"`,
    `<${SITE_URL}/llms-full.txt>; rel="llms-full-txt"; type="text/markdown"`,
    `<${SITE_URL}/sitemap.md>; rel="sitemap"; type="text/markdown"`,
    `<${SITE_URL}/sitemap.xml>; rel="sitemap"; type="application/xml"`,
    `<${SITE_URL}/AGENTS.md>; rel="agents"; type="text/markdown"`,
  ].join(", ");
}

export default clerkMiddleware(async (auth, request) => {
  // ── 0. Detect /dante surface (either subdomain or direct path) ────────────
  const host = request.headers.get("host") ?? "";
  const isDanteSubdomain = /^dante\.(perea\.ai|localhost(:\d+)?)$/i.test(host);
  const isDantePath = request.nextUrl.pathname.startsWith("/dante");
  const isDanteRequest = isDanteSubdomain || isDantePath;

  // ── 0a. Basic Auth gate for /dante ────────────────────────────────────────
  // The /dante page is semi-public — gated behind a backend password so
  // sensitive [protected] context isn't exposed to random crawlers.
  // Set DANTE_PASSWORD env var (locally and in Vercel project settings).
  if (isDanteRequest && !checkDanteAuth(request)) {
    return denyDante();
  }

  // ── 0b. Subdomain rewrite ─────────────────────────────────────────────────
  // dante.perea.ai (and dante.localhost:* for local dev) serves the /dante route.
  // Rewrite after auth so the downstream page only renders for authed callers.
  if (isDanteSubdomain && !request.nextUrl.pathname.startsWith("/dante")) {
    const url = request.nextUrl.clone();
    url.pathname = "/dante" + (request.nextUrl.pathname === "/" ? "" : request.nextUrl.pathname);
    return NextResponse.rewrite(url);
  }

  if (isProtected(request)) {
    await auth.protect();
  }

  const { pathname } = request.nextUrl;

  // ── Markdown mirror routing ────────────────────────────────────────────────
  // Either explicit `.md` URL OR canonical URL with Accept: text/markdown
  // rewrites to the route handler that returns the raw markdown.
  const mdMatch = isMdMirrorPath(pathname);
  if (mdMatch) {
    const explicitMd = pathname.endsWith(".md");
    const negotiatedMd =
      !explicitMd && wantsMarkdown(request.headers.get("accept"));
    if (explicitMd || negotiatedMd) {
      const target = request.nextUrl.clone();
      target.pathname = `/api/md/${mdMatch.kind}/${mdMatch.slug}`;
      const rewritten = NextResponse.rewrite(target);
      rewritten.headers.set("Vary", "Accept");
      rewritten.headers.set("Link", buildSiteLinkHeader());
      return rewritten;
    }
  }
  // ─────────────────────────────────────────────────────────────────────────

  // ── Agent / crawler signal ─────────────────────────────────────────────────
  const ua = request.headers.get("user-agent") || "";
  const crawler = detectAICrawler(ua);

  if (pathname === "/llms.txt") {
    captureServerEvent(`bot:${crawler ?? "unknown"}`, "llms_txt_fetch", {
      crawler,
      ua,
      is_known_ai_crawler: crawler !== null,
    });
  }
  // ─────────────────────────────────────────────────────────────────────────
  const slugMatch = pathname.match(/^\/lp\/([^/]+)/);
  const slug = slugMatch?.[1];

  const response = NextResponse.next();

  // ── Advertise agent-facing resources via Link header ──────────────────────
  response.headers.set("Link", buildSiteLinkHeader());

  // Per-page markdown variant: add `alternate` link on the canonical HTML URL.
  if (mdMatch && !pathname.endsWith(".md")) {
    const existing = response.headers.get("Link") ?? "";
    const mdLink = `<${SITE_URL}/${mdMatch.kind}/${mdMatch.slug}.md>; rel="alternate"; type="text/markdown"`;
    response.headers.set("Link", existing ? `${existing}, ${mdLink}` : mdLink);
    response.headers.set("Vary", "Accept");
  }

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

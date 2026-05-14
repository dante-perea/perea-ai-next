import fs from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";

const RESEARCH_DIR = path.join(process.cwd(), "content", "whitepapers");
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://perea.ai";

export const dynamic = "force-static";
export const revalidate = 3600;

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ slug: string }> }
) {
  const { slug } = await ctx.params;

  // Defense in depth — slug should already be sanitized by Next.js routing,
  // but reject path-traversal attempts explicitly.
  if (slug.includes("/") || slug.includes("..")) {
    return new NextResponse("Bad slug", { status: 400 });
  }

  const filePath = path.join(RESEARCH_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) {
    return new NextResponse("Research paper not found", { status: 404 });
  }

  const raw = fs.readFileSync(filePath, "utf8");
  const canonical = `${SITE_URL}/research/${slug}`;
  return new NextResponse(raw, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      "X-Robots-Tag": "all",
      Link: `<${canonical}>; rel="canonical", <${SITE_URL}/llms.txt>; rel="index"`,
      "Vary": "Accept",
    },
  });
}

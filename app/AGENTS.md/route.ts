import fs from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://perea.ai";

export const dynamic = "force-static";
export const revalidate = 3600;

export async function GET() {
  const filePath = path.join(process.cwd(), "AGENTS.md");
  let body: string;
  try {
    body = fs.readFileSync(filePath, "utf8");
  } catch {
    return new NextResponse("AGENTS.md not found", { status: 404 });
  }

  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      "X-Robots-Tag": "all",
      Link: `<${SITE_URL}/llms.txt>; rel="llms-txt", <${SITE_URL}/llms-full.txt>; rel="llms-full-txt", <${SITE_URL}/sitemap.md>; rel="sitemap"; type="text/markdown"`,
    },
  });
}

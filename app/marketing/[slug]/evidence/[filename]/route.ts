import { NextResponse } from "next/server";
import { readEvidenceFile } from "@/lib/marketing";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ slug: string; filename: string }> }
) {
  const { slug, filename } = await ctx.params;

  // Strip optional .md extension for agent-friendly URLs
  const bare = filename.endsWith(".md") ? filename : `${filename}.md`;

  const content = readEvidenceFile(slug, bare);
  if (content === null) {
    return new NextResponse("Evidence file not found", { status: 404 });
  }

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      "X-Robots-Tag": "all",
    },
  });
}

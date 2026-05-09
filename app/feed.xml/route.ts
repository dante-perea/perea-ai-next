import { listResearch } from "@/lib/research";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://perea.ai";

export const dynamic = "force-dynamic";

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function toRfc822(iso?: string): string {
  if (!iso) return new Date().toUTCString();
  return new Date(iso).toUTCString();
}

export async function GET() {
  const papers = listResearch("en").slice(0, 50);

  const items = papers
    .map((p) => {
      const url = `${SITE_URL}/research/${p.slug}`;
      const title = escapeXml(p.frontmatter.title || p.slug);
      const desc = escapeXml(
        p.frontmatter.subtitle || p.frontmatter.description || ""
      );
      const pubDate = toRfc822(p.frontmatter.date);
      return `    <item>
      <title>${title}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${desc}</description>
      <pubDate>${pubDate}</pubDate>
      <author>dante@perea.ai (Dante Perea)</author>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>perea.ai Research</title>
    <link>${SITE_URL}/research</link>
    <description>Original research on the agent economy: B2A infrastructure, protocol adoption, vertical playbooks, and benchmarks.</description>
    <language>en-us</language>
    <managingEditor>dante@perea.ai (Dante Perea)</managingEditor>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}

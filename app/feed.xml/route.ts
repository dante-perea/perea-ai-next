import { listResearch } from "@/lib/research";
import { listPlaybooks } from "@/lib/marketing";

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
  const playbooks = listPlaybooks();

  const researchItems = papers.map((p) => ({
    url: `${SITE_URL}/research/${p.slug}`,
    title: p.frontmatter.title || p.slug,
    desc: p.frontmatter.subtitle || p.frontmatter.description || "",
    date: p.frontmatter.date,
    category: "Research",
  }));

  const playbookItems = playbooks.map((p) => ({
    url: `${SITE_URL}/marketing/${p.slug}`,
    title: p.frontmatter.title || p.slug,
    desc: p.frontmatter.subtitle || p.frontmatter.description || "",
    date: p.frontmatter.date,
    category: "Marketing Playbook",
  }));

  // Merge, sort by date desc, cap at 50 total.
  const merged = [...researchItems, ...playbookItems]
    .sort((a, b) => (b.date || "").localeCompare(a.date || ""))
    .slice(0, 50);

  const items = merged
    .map((it) => {
      const title = escapeXml(it.title);
      const desc = escapeXml(it.desc);
      const pubDate = toRfc822(it.date);
      return `    <item>
      <title>${title}</title>
      <link>${it.url}</link>
      <guid isPermaLink="true">${it.url}</guid>
      <description>${desc}</description>
      <category>${escapeXml(it.category)}</category>
      <pubDate>${pubDate}</pubDate>
      <author>dante@perea.ai (Dante Perea)</author>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>perea.ai</title>
    <link>${SITE_URL}</link>
    <description>Original research on the agent economy and production playbooks for AI-content distribution. /research papers (external evidence) and /marketing Playbooks (perea production patterns).</description>
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

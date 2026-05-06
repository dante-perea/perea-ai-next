import { NextResponse } from "next/server";
import { insertSignals } from "@/lib/learning/market-signals-db";

// Google Trends public RSS — trending searches in the US, no API key needed
const TRENDS_RSS_URL = "https://trends.google.com/trending/rss?geo=US";

export async function POST() {
  try {
    const res = await fetch(TRENDS_RSS_URL, {
      headers: { "User-Agent": "perea-ai-opportunity-scanner/1.0" },
    });
    if (!res.ok) return NextResponse.json({ error: "trends fetch failed", status: res.status }, { status: 502 });

    const xml = await res.text();
    const signals: Parameters<typeof insertSignals>[0] = [];

    // parse <item> blocks from RSS without adding an XML dep
    const items = xml.match(/<item>([\s\S]*?)<\/item>/g) ?? [];
    for (const item of items) {
      const title = (item.match(/<title><!\[CDATA\[([^\]]+)\]\]><\/title>/) ?? item.match(/<title>([^<]+)<\/title>/))?.[1]?.trim();
      const link  = item.match(/<link>([^<]+)<\/link>/)?.[1]?.trim();
      const traffic = item.match(/<ht:approx_traffic>([^<]+)<\/ht:approx_traffic>/)?.[1]?.trim();

      if (!title) continue;
      const id = `trends-${Buffer.from(title).toString("base64url").slice(0, 32)}`;
      signals.push({
        id,
        source: "trends",
        title,
        url: link ?? null,
        score: traffic ? Number(traffic.replace(/[^0-9]/g, "")) : null,
        tags: ["google-trends"],
        raw: { traffic, link },
      });
    }

    await insertSignals(signals);
    return NextResponse.json({ inserted: signals.length });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

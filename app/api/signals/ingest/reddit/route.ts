import { NextResponse } from "next/server";
import { insertSignals } from "@/lib/learning/market-signals-db";

const PAIN_QUERIES = [
  "why doesn't exist",
  "wish there was a tool",
  "no good solution for",
  "looking for software that",
  "anyone built a tool",
];

const SUBREDDITS = ["SaaS", "startups", "entrepreneur", "webdev", "MachineLearning", "artificial", "programming"];

export async function POST() {
  const seen = new Set<string>();
  const signals: Parameters<typeof insertSignals>[0] = [];

  for (const sub of SUBREDDITS) {
    for (const q of PAIN_QUERIES) {
      try {
        const res = await fetch(
          `https://www.reddit.com/r/${sub}/search.json?q=${encodeURIComponent(q)}&sort=top&t=month&limit=5`,
          { headers: { "User-Agent": "perea-ai-opportunity-scanner/1.0" } }
        );
        if (!res.ok) continue;
        const data = await res.json();
        for (const post of data?.data?.children ?? []) {
          const p = post.data;
          const id = `reddit-${p.id}`;
          if (seen.has(id)) continue;
          seen.add(id);
          signals.push({
            id,
            source: "reddit",
            title: p.title,
            url: `https://reddit.com${p.permalink}`,
            score: p.score,
            tags: [sub.toLowerCase()],
            raw: {
              subreddit: p.subreddit,
              score: p.score,
              num_comments: p.num_comments,
              selftext: (p.selftext ?? "").slice(0, 600),
              query: q,
            },
          });
        }
      } catch {
        // skip failed subreddit/query combos
      }
    }
  }

  await insertSignals(signals);
  return NextResponse.json({ inserted: signals.length });
}

import { NextResponse } from "next/server";
import { generateText } from "ai";
import { gateway } from "@/lib/ai";
import { insertSignals } from "@/lib/learning/market-signals-db";
import { getActiveExperiments, getClosedExperiments } from "@/lib/learning/ghost-db";

const PAIN_QUERIES = [
  "why doesn't exist",
  "wish there was a tool",
  "no good solution for",
  "looking for software that",
  "anyone built a tool",
];

const FALLBACK_SUBREDDITS = ["SaaS", "startups", "entrepreneur", "webdev", "MachineLearning"];

async function deriveSubreddits(): Promise<string[]> {
  const [active, closed] = await Promise.all([
    getActiveExperiments().catch(() => []),
    getClosedExperiments(20).catch(() => []),
  ]);

  const experiments = [...active, ...closed].slice(0, 40);
  if (experiments.length === 0) return FALLBACK_SUBREDDITS;

  const context = experiments
    .map((e) =>
      `[${e.project_tag ?? "?"}] ${e.hypothesis} | type: ${e.experiment_type ?? "?"} | feature: ${e.feature_tag ?? "?"}`
    )
    .join("\n");

  const { text } = await generateText({
    model: gateway("xai/grok-4"),
    messages: [
      {
        role: "user",
        content: `You are helping find Reddit subreddits where the target users of these startup experiments are likely to discuss pain points and unmet needs.

Experiments:
${context}

Return ONLY a JSON array of 8-12 subreddit names (no r/ prefix, no markdown, no explanation).
Example: ["SaaS", "webdev", "productivity"]`,
      },
    ],
    maxOutputTokens: 128,
  });

  try {
    const parsed = JSON.parse(text.replace(/```json\n?|\n?```/g, "").trim());
    return Array.isArray(parsed) && parsed.length > 0 ? parsed.slice(0, 12) : FALLBACK_SUBREDDITS;
  } catch {
    return FALLBACK_SUBREDDITS;
  }
}

export async function POST() {
  const subreddits = await deriveSubreddits();
  const seen = new Set<string>();
  const signals: Parameters<typeof insertSignals>[0] = [];

  for (const sub of subreddits) {
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
  return NextResponse.json({ inserted: signals.length, subreddits });
}

import { NextResponse } from "next/server";
import { generateText } from "ai";
import { gateway } from "@/lib/ai";
import { getSignalsSince, upsertOpportunities, clearOpportunities } from "@/lib/learning/market-signals-db";

export async function POST() {
  const since = new Date(Date.now() - 7 * 86400000);
  const signals = await getSignalsSince(since);

  if (signals.length === 0) return NextResponse.json({ opportunities: 0, message: "no signals" });

  const digest = signals
    .slice(0, 120)
    .map((s) => `[${s.source}] ${s.title}${s.score != null ? ` (score: ${s.score})` : ""}`)
    .join("\n");

  const prompt = `You are an opportunity analyst. Below are ${signals.length} signals from GitHub trending repos, Reddit pain posts, and Google Trends from the last 7 days.

Group them into 5-8 opportunity themes where multiple signals point to the same unmet need or emerging market. Focus on opportunities relevant to indie hackers, AI founders, and developer tool builders.

SIGNALS:
${digest}

Return ONLY valid JSON — an array of opportunity objects:
[
  {
    "id": "opp-<slug>",
    "theme": "short theme name",
    "summary": "1-2 sentence opportunity description including why it's compelling now",
    "evidence": [{ "title": "signal title", "source": "github|reddit|trends" }],
    "signal_count": 3,
    "confidence": "low|medium|high"
  }
]

Rules:
- id must be unique, slug format (opp-ai-code-review, opp-local-llm-tools, etc.)
- Only include themes backed by 2+ signals from different sources when possible
- confidence = high if 3+ signals from 2+ sources, medium if 2 signals, low if 1 strong signal
- evidence: pick the 2-4 most representative signals for each theme`;

  const { text } = await generateText({
    model: gateway("xai/grok-4"),
    messages: [{ role: "user", content: prompt }],
    maxOutputTokens: 2048,
  });

  const raw = text.replace(/```json\n?|\n?```/g, "").trim();
  const opps = JSON.parse(raw);

  await clearOpportunities();
  await upsertOpportunities(opps);

  return NextResponse.json({ opportunities: opps.length });
}

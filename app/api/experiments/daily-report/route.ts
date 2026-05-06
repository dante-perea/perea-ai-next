import { NextResponse } from "next/server";
import { generateText } from "ai";
import { gateway } from "@/lib/ai";
import { getActiveExperiments, getClosedExperiments, getVelocityStats } from "@/lib/learning/ghost-db";

export async function POST() {
  const [active, closed, stats] = await Promise.all([
    getActiveExperiments(),
    getClosedExperiments(20),
    getVelocityStats(),
  ]);

  const recentlyClosed = closed.filter(
    (e) => e.shipped_at && new Date(e.shipped_at) >= new Date(Date.now() - 86400000)
  );

  const today = new Date().toISOString().split("T")[0];

  const prompt = `You are a startup coach generating a daily scrum standup for a founder.

Today: ${today}

## Active Experiments
${
  active
    .map(
      (e) =>
        `- [${e.id}] ${e.hypothesis} | startup: ${e.project_tag ?? "?"} | type: ${e.experiment_type ?? "?"} | feature: ${e.feature_tag ?? "?"} | started: ${new Date(e.started_at).toISOString().split("T")[0]} | success_criteria: ${e.success_criteria ?? "none"}`
    )
    .join("\n") || "none"
}

## Closed in last 24h
${
  recentlyClosed
    .map(
      (e) =>
        `- [${e.verdict?.toUpperCase() ?? e.outcome}] ${e.hypothesis} | learning: ${e.learning ?? "none"}`
    )
    .join("\n") || "none"
}

## Velocity (7d): ${stats.velocity_week} experiments | avg cycle: ${stats.avg_cycle_hours != null ? stats.avg_cycle_hours + "h" : "?"} | validation rate: ${stats.validation_rate != null ? (stats.validation_rate * 100).toFixed(0) + "%" : "?"}

Return ONLY valid JSON (no markdown):
{
  "yesterday": ["..."],
  "today": ["..."],
  "blockers": ["..."],
  "backlog": [{ "title": "hypothesis text", "project": "startup", "type": "product|marketing|growth|ops|gtm|distribution|other", "priority": "high|medium|low" }]
}

Rules:
- yesterday: what was accomplished in last 24h — specific, reference hypothesis text. If nothing closed, say so.
- today: 3-5 concrete actions to take today, prioritized by impact across active experiments.
- blockers: experiments stuck without signal, unclear success criteria, or missing data. Empty array if none.
- backlog: 3-5 next hypotheses to test, inferred from learnings and gaps in active experiments. Full "If I do X, then Y, because Z" format.`;

  const { text } = await generateText({
    model: gateway("xai/grok-4.3"),
    messages: [{ role: "user", content: prompt }],
    maxOutputTokens: 1024,
  });

  const report = JSON.parse(text.replace(/```json\n?|\n?```/g, "").trim());
  return NextResponse.json(report);
}

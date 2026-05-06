import { NextResponse } from "next/server";
import { insertSignals } from "@/lib/learning/market-signals-db";

const TOPICS = [
  "ai-agent", "mcp-server", "llm", "rag", "developer-tools",
  "saas", "open-source", "typescript", "nextjs", "ai",
];

export async function POST() {
  const since = new Date(Date.now() - 7 * 86400000).toISOString().split("T")[0];
  const signals: Parameters<typeof insertSignals>[0] = [];
  const seen = new Set<string>();

  for (const topic of TOPICS) {
    try {
      const res = await fetch(
        `https://api.github.com/search/repositories?q=topic:${topic}+created:>${since}&sort=stars&order=desc&per_page=8`,
        {
          headers: {
            Accept: "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
            ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
          },
        }
      );
      if (!res.ok) continue;
      const data = await res.json();
      for (const repo of data.items ?? []) {
        const id = `github-${repo.id}`;
        if (seen.has(id)) continue;
        seen.add(id);
        signals.push({
          id,
          source: "github",
          title: `${repo.full_name}${repo.description ? ` — ${repo.description}` : ""}`,
          url: repo.html_url,
          score: repo.stargazers_count,
          tags: [topic, ...(repo.topics ?? [])].slice(0, 8),
          raw: {
            stars: repo.stargazers_count,
            language: repo.language,
            description: repo.description,
            forks: repo.forks_count,
          },
        });
      }
    } catch {
      // skip failed topics
    }
  }

  await insertSignals(signals);
  return NextResponse.json({ inserted: signals.length });
}

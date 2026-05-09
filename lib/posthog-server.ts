const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.i.posthog.com";

// UA substring patterns → engine name
const AI_CRAWLER_PATTERNS: [RegExp, string][] = [
  [/GPTBot/i, "openai"],
  [/ChatGPT-User/i, "openai"],
  [/OAI-SearchBot/i, "openai"],
  [/anthropic-ai/i, "anthropic"],
  [/ClaudeBot/i, "anthropic"],
  [/Claude-Web/i, "anthropic"],
  [/PerplexityBot/i, "perplexity"],
  [/Google-Extended/i, "google"],
  [/GoogleOther/i, "google"],
  [/cohere-ai/i, "cohere"],
  [/AI2Bot/i, "ai2"],
  [/Bytespider/i, "bytedance"],
  [/DuckAssistBot/i, "duckduckgo"],
  [/Amazonbot/i, "amazon"],
  [/Applebot-Extended/i, "apple"],
  [/Meta-ExternalFetcher/i, "meta"],
  [/YouBot/i, "you"],
];

export function detectAICrawler(ua: string): string | null {
  for (const [pattern, name] of AI_CRAWLER_PATTERNS) {
    if (pattern.test(ua)) return name;
  }
  return null;
}

// Fire-and-forget — never throws, works in Edge Runtime and Node.js
export function captureServerEvent(
  distinctId: string,
  event: string,
  properties: Record<string, unknown> = {}
): void {
  if (!POSTHOG_KEY) return;
  fetch(`${POSTHOG_HOST}/capture/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_key: POSTHOG_KEY,
      event,
      distinct_id: distinctId,
      properties: { $lib: "posthog-server", ...properties },
      timestamp: new Date().toISOString(),
    }),
  }).catch(() => {});
}

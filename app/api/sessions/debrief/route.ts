import { NextResponse } from "next/server";
import {
  createExperiment,
  generateExperimentId,
  ghostDb,
} from "@/lib/learning/ghost-db";

async function sendTelegram(text: string): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;
  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
  });
}

export async function POST(req: Request) {
  let body: { session_id?: string; content_snippet?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { session_id, content_snippet } = body;
  if (!session_id || !content_snippet) {
    return NextResponse.json({ error: "Missing session_id or content_snippet" }, { status: 400 });
  }

  // One experiment per session — skip if already processed
  const db = ghostDb();
  try {
    const existing = await db`
      SELECT id FROM experiments
      WHERE session_id = ${session_id}
      LIMIT 1
    `;
    if (existing.length > 0) {
      return NextResponse.json({ skipped: true, reason: "already_processed" });
    }
  } finally {
    await db.end();
  }

  const snippet = content_snippet.slice(0, 3000);

  const prompt = `You are extracting the hypothesis tested in a founder's work session.
Sessions cover ALL startup work: pricing, copywriting, distribution, GTM, product decisions, code, customer research.

From this session content, extract:
- hypothesis: the core assumption or idea being tested (null if this was pure maintenance with no clear test)
- reasoning: WHY this approach was chosen over alternatives (1 sentence, focus on the WHY not the WHAT)
- rejected: what approach was explicitly NOT chosen and why (null if not discussed)
- experiment_type: one of product | pricing | messaging | distribution | business_model | gtm | other
- aarrr_stage: one of acquisition | activation | retention | referral | revenue | none

Return only valid JSON. No preamble or explanation.

SESSION CONTENT:
${snippet}`;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-5.4-2026-03-05",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 512,
      response_format: { type: "json_object" },
    }),
  });

  if (!res.ok) {
    console.warn("[debrief] OpenAI error:", res.status);
    return NextResponse.json({ hypothesis: null, sent_telegram: false });
  }

  const json = await res.json();
  const text: string = json.choices?.[0]?.message?.content ?? "{}";

  let parsed: {
    hypothesis?: string | null;
    reasoning?: string | null;
    rejected?: string | null;
    experiment_type?: string;
    aarrr_stage?: string;
  };
  try {
    parsed = JSON.parse(text);
  } catch {
    return NextResponse.json({ hypothesis: null, sent_telegram: false });
  }

  if (!parsed.hypothesis) {
    return NextResponse.json({ hypothesis: null, sent_telegram: false });
  }

  const id = generateExperimentId();
  try {
    await createExperiment(id, parsed.hypothesis, undefined, session_id, {
      experiment_type: parsed.experiment_type,
      aarrr_stage: parsed.aarrr_stage,
    });
  } catch (err) {
    console.error("[debrief] createExperiment failed:", err);
    return NextResponse.json({ hypothesis: parsed.hypothesis, sent_telegram: false });
  }

  const typeLabel = parsed.experiment_type ?? "other";
  const stageLabel = parsed.aarrr_stage ?? "none";

  const lines = [
    `<b>Session ended. You tested:</b>`,
    `"${parsed.hypothesis}"`,
    `<i>${typeLabel} · ${stageLabel}</i>`,
  ];
  if (parsed.reasoning) lines.push(`<i>Why: ${parsed.reasoning}</i>`);
  if (parsed.rejected) lines.push(`<i>Rejected: ${parsed.rejected}</i>`);
  lines.push(``, `ID: <code>${id}</code>`, `/skip ${id} to discard`);

  await sendTelegram(lines.join("\n"));

  return NextResponse.json({ hypothesis: parsed.hypothesis, experiment_id: id, sent_telegram: true });
}

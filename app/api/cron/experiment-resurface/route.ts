// Hourly cron that processes experiments past their snooze window.
//
// For each due experiment:
//   1. Run AI synthesis if not already generated (Grok 4.3 reads notes + recommends close)
//   2. Send Telegram digest including the synthesis summary + recommendation
//   3. Mark with [telegram-nudged] signal so the next run skips it
//
// Idempotent: synthesis is stored in the experiment row and skipped on re-runs.

import { NextResponse } from "next/server";
import {
  getDueWithoutSynthesis,
  getActiveExperiments,
  getSignalsByExperimentMap,
  getSignalsForExperiment,
  insertSignal,
  setSynthesis,
  type Experiment,
  type Signal,
  type SynthesisRecommendation,
} from "@/lib/learning/ghost-db";
import { synthesizeExperiment } from "@/lib/learning/synthesize";

const DAY = 24 * 60 * 60 * 1000;
const DEFAULT_REVISIT_DAYS = 2;
const DASHBOARD_URL = "https://www.perea.ai/dashboard/experiments";

// Cap synthesis per tick so 10+ simultaneously-due experiments can't
// blow Vercel's 300s function ceiling (each Grok call runs ~5–10s).
// Remaining experiments get picked up on the next hourly tick.
const MAX_SYNTHESIS_PER_TICK = 5;

// Telegram message hard limit. We slice the per-experiment digest list
// to stay safely under this, and append a "+N more" footer if needed.
const TELEGRAM_MAX_CHARS = 4000;

async function sendTelegram(text: string): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;
  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: "HTML",
      disable_web_page_preview: true,
    }),
  });
}

interface DueExperiment {
  exp: Experiment;
  due: Date;
  hoursOverdue: number;
  synthesis?: { summary: string; recommendation: SynthesisRecommendation };
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Legacy path: experiments with [need-more-data] signals but no snoozed_until
// (e.g., from before the column existed). Compute due-ness from the signal trail.
function findDueLegacy(active: Experiment[], signalsMap: Record<string, Signal[]>): DueExperiment[] {
  const now = Date.now();
  const due: DueExperiment[] = [];
  for (const exp of active) {
    if (exp.loop_class === "L0") continue;
    if (exp.snoozed_until) continue; // already covered by getDueWithoutSynthesis
    const sigs = signalsMap[exp.id] ?? [];
    const nmd = sigs.find((s) => s.content.startsWith("[need-more-data]"));
    if (!nmd) continue;
    const nudged = sigs.find(
      (s) =>
        s.content.startsWith("[telegram-nudged]") &&
        new Date(s.created_at).getTime() > new Date(nmd.created_at).getTime(),
    );
    if (nudged) continue;
    const match = nmd.content.match(/\[revisit-in:(\d+)d\]/);
    const days = match ? parseInt(match[1], 10) : DEFAULT_REVISIT_DAYS;
    const dueAt = new Date(new Date(nmd.created_at).getTime() + days * DAY);
    if (dueAt.getTime() >= now) continue;
    due.push({ exp, due: dueAt, hoursOverdue: Math.round((now - dueAt.getTime()) / 3.6e6) });
  }
  return due;
}

function formatExperiment(d: DueExperiment): string {
  const lines: string[] = [];
  const trunc = d.exp.hypothesis.length > 140 ? d.exp.hypothesis.slice(0, 137) + "…" : d.exp.hypothesis;
  lines.push(`<b>${escapeHtml(d.exp.id)}</b> — due ${d.hoursOverdue}h ago`);
  lines.push(escapeHtml(trunc));
  if (d.synthesis) {
    lines.push("");
    lines.push(`<i>${escapeHtml(d.synthesis.summary)}</i>`);
    const rec = d.synthesis.recommendation;
    const pivotSuffix = rec.pivot_type ? ` (${rec.pivot_type})` : "";
    lines.push(`→ <b>${rec.implication}${pivotSuffix}</b> · ${rec.confidence} confidence`);
  }
  return lines.join("\n");
}

function buildMessage(due: DueExperiment[]): string {
  const header: string[] = [];
  const synthesized = due.filter((d) => d.synthesis).length;
  const noun = due.length === 1 ? "experiment is" : "experiments are";
  header.push(`🔔 <b>${due.length} ${noun} past their re-decide window</b>`);
  if (synthesized > 0) header.push(`<i>${synthesized} synthesized — recommendations ready</i>`);
  header.push("");

  const footer = `<a href="${DASHBOARD_URL}">Open dashboard</a>`;
  // Reserve room for the footer + "+N more" line so we never overshoot.
  const reserve = footer.length + 60;
  let budget = TELEGRAM_MAX_CHARS - header.join("\n").length - reserve;

  const body: string[] = [];
  let included = 0;
  for (const d of due) {
    const block = formatExperiment(d) + "\n\n";
    if (block.length > budget) break;
    body.push(block);
    budget -= block.length;
    included += 1;
  }

  const remaining = due.length - included;
  return [
    ...header,
    ...body,
    ...(remaining > 0 ? [`<i>+ ${remaining} more (digest truncated)</i>`] : []),
    footer,
  ].join("\n");
}

async function markNudged(due: DueExperiment[]): Promise<void> {
  await Promise.all(
    due.map((d) =>
      insertSignal(d.exp.id, "observation", `[telegram-nudged] resurface @ ${d.hoursOverdue}h overdue`).catch(() => undefined),
    ),
  );
}

async function runSynthesisFor(exp: Experiment): Promise<DueExperiment["synthesis"] | undefined> {
  const signals = await getSignalsForExperiment(exp.id);
  const out = await synthesizeExperiment(exp, signals);
  if (!out) return undefined;
  await setSynthesis(exp.id, out.summary, out.recommendation);
  return out;
}

export async function GET(req: Request) {
  const secret = req.headers.get("authorization")?.replace("Bearer ", "");
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [needsSynth, active, signalsMap] = await Promise.all([
      getDueWithoutSynthesis(),
      getActiveExperiments(),
      getSignalsByExperimentMap(),
    ]);

    // Synthesize one at a time to keep cost predictable and respect rate limits.
    // Cap at MAX_SYNTHESIS_PER_TICK to stay under the 300s function timeout.
    const synthesizedRows: DueExperiment[] = [];
    const now = Date.now();
    const eligible = needsSynth.filter((e) => e.loop_class !== "L0");
    const synthesisBudget = eligible.slice(0, MAX_SYNTHESIS_PER_TICK);
    const synthesisDeferred = Math.max(0, eligible.length - synthesisBudget.length);
    for (const exp of synthesisBudget) {
      const dueAt = exp.snoozed_until ? new Date(exp.snoozed_until) : new Date();
      const synthesis = await runSynthesisFor(exp);
      synthesizedRows.push({
        exp,
        due: dueAt,
        hoursOverdue: Math.round((now - dueAt.getTime()) / 3.6e6),
        synthesis,
      });
    }

    // Also pick up any lingering legacy experiments without snoozed_until.
    // (One-time concern; should be empty after the back-fill but kept as a safety net.)
    const legacy = findDueLegacy(active, signalsMap)
      .filter((d) => !synthesizedRows.some((s) => s.exp.id === d.exp.id));

    // Already-synthesized but not-yet-nudged due experiments need a digest too.
    const alreadySynthIds = new Set(synthesizedRows.map((d) => d.exp.id));
    const alreadySynth: DueExperiment[] = [];
    for (const exp of active) {
      if (exp.loop_class === "L0") continue;
      if (alreadySynthIds.has(exp.id)) continue;
      if (!exp.snoozed_until) continue;
      const dueAt = new Date(exp.snoozed_until);
      if (dueAt.getTime() >= now) continue;
      if (!exp.synthesis_text || !exp.synthesis_recommendation) continue;
      const sigs = signalsMap[exp.id] ?? [];
      const nudged = sigs.find(
        (s) =>
          s.content.startsWith("[telegram-nudged]") &&
          exp.synthesis_generated_at != null &&
          new Date(s.created_at).getTime() > new Date(exp.synthesis_generated_at).getTime(),
      );
      if (nudged) continue;
      alreadySynth.push({
        exp,
        due: dueAt,
        hoursOverdue: Math.round((now - dueAt.getTime()) / 3.6e6),
        synthesis: {
          summary: exp.synthesis_text,
          recommendation: exp.synthesis_recommendation,
        },
      });
    }

    const due = [...synthesizedRows, ...alreadySynth, ...legacy]
      .sort((a, b) => b.hoursOverdue - a.hoursOverdue);

    if (due.length === 0) {
      return NextResponse.json({ ok: true, due: 0, synthesized: 0, nudged: 0 });
    }

    const message = buildMessage(due);
    await sendTelegram(message);
    await markNudged(due);

    return NextResponse.json({
      ok: true,
      due: due.length,
      synthesized: synthesizedRows.length,
      synthesis_deferred: synthesisDeferred,
      nudged: due.length,
      ids: due.map((d) => d.exp.id),
    });
  } catch (err) {
    console.error("[experiment-resurface]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }
}

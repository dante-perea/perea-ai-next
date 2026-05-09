// Hourly cron that nudges via Telegram when experiments pass their
// "need more data" 48h re-decide window (Option C from the grill).
// Idempotent: inserts a [telegram-nudged] signal after sending so the
// next run skips experiments already nudged.

import { NextResponse } from "next/server";
import { getActiveExperiments, getSignalsByExperimentMap, insertSignal, type Experiment, type Signal } from "@/lib/learning/ghost-db";

const DAY = 24 * 60 * 60 * 1000;
const DEFAULT_REVISIT_DAYS = 2;
const DASHBOARD_URL = "https://www.perea.ai/dashboard/experiments?variant=C";

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
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function findDueExperiments(active: Experiment[], signalsMap: Record<string, Signal[]>): DueExperiment[] {
  const now = Date.now();
  const due: DueExperiment[] = [];
  for (const exp of active) {
    if (exp.loop_class === "L0") continue;
    const sigs = signalsMap[exp.id] ?? []; // sorted DESC by created_at
    // Latest [need-more-data] signal
    const nmd = sigs.find((s) => s.content.startsWith("[need-more-data]"));
    if (!nmd) continue;
    // Skip if already nudged AFTER this need-more-data was logged
    const nudged = sigs.find(
      (s) =>
        s.content.startsWith("[telegram-nudged]") &&
        new Date(s.created_at).getTime() > new Date(nmd.created_at).getTime(),
    );
    if (nudged) continue;
    // Parse revisit window
    const match = nmd.content.match(/\[revisit-in:(\d+)d\]/);
    const days = match ? parseInt(match[1], 10) : DEFAULT_REVISIT_DAYS;
    const dueAt = new Date(new Date(nmd.created_at).getTime() + days * DAY);
    if (dueAt.getTime() >= now) continue; // not yet due
    due.push({ exp, due: dueAt, hoursOverdue: Math.round((now - dueAt.getTime()) / 3.6e6) });
  }
  // Most-overdue first
  due.sort((a, b) => b.hoursOverdue - a.hoursOverdue);
  return due;
}

function buildMessage(due: DueExperiment[]): string {
  const lines: string[] = [];
  const noun = due.length === 1 ? "experiment is" : "experiments are";
  lines.push(`🔔 <b>${due.length} ${noun} past their re-decide window</b>`);
  lines.push("");
  for (const d of due.slice(0, 8)) {
    const trunc = d.exp.hypothesis.length > 140 ? d.exp.hypothesis.slice(0, 137) + "…" : d.exp.hypothesis;
    lines.push(`<b>${escapeHtml(d.exp.id)}</b> — due ${d.hoursOverdue}h ago`);
    lines.push(escapeHtml(trunc));
    lines.push("");
  }
  if (due.length > 8) lines.push(`<i>+ ${due.length - 8} more</i>`);
  lines.push(`<a href="${DASHBOARD_URL}">Open dashboard</a>`);
  return lines.join("\n");
}

async function markNudged(due: DueExperiment[]): Promise<void> {
  // One signal per experiment — minimal content, identifies the nudge state
  await Promise.all(
    due.map((d) =>
      insertSignal(d.exp.id, "observation", `[telegram-nudged] resurface @ ${d.hoursOverdue}h overdue`).catch(() => undefined),
    ),
  );
}

export async function GET(req: Request) {
  const secret = req.headers.get("authorization")?.replace("Bearer ", "");
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [active, signalsMap] = await Promise.all([
      getActiveExperiments(),
      getSignalsByExperimentMap(),
    ]);

    const due = findDueExperiments(active, signalsMap);
    if (due.length === 0) {
      return NextResponse.json({ ok: true, due: 0, nudged: 0 });
    }

    const message = buildMessage(due);
    await sendTelegram(message);
    await markNudged(due);

    return NextResponse.json({
      ok: true,
      due: due.length,
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

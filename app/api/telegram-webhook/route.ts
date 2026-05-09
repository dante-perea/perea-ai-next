import { NextResponse } from "next/server";
import {
  insertSignal,
  getVelocityStats,
  createExperiment,
  generateExperimentId,
  setSuccessCriteria,
  closeWithVerdict,
  deleteExperiment,
  getActiveExperiments,
} from "@/lib/learning/ghost-db";

async function sendTelegram(chatId: number | string, text: string): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return;
  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
  });
}

interface TelegramUpdate {
  message?: {
    chat: { id: number };
    text?: string;
    message_id: number;
  };
}

function parseCommand(text: string): { cmd: string; args: string[] } | null {
  const trimmed = text.trim();
  if (!trimmed.startsWith("/")) return null;
  const parts = trimmed.slice(1).split(/\s+/);
  return { cmd: parts[0].toLowerCase().replace(/@\S+$/, ""), args: parts.slice(1) };
}

// Telegram quick-capture creates L0 entries (no falsifiability gate).
// Promote to L1/L2 from the dashboard once you have segment/metric/threshold.

export async function POST(req: Request) {
  const secretToken = req.headers.get("x-telegram-bot-api-secret-token");
  if (secretToken !== process.env.TELEGRAM_WEBHOOK_SECRET) {
    return NextResponse.json({ ok: false }, { status: 403 });
  }

  let update: TelegramUpdate;
  try {
    update = await req.json();
  } catch {
    return NextResponse.json({ ok: true });
  }

  const message = update.message;
  if (!message?.text) return NextResponse.json({ ok: true });

  const chatId = message.chat.id;
  const parsed = parseCommand(message.text);
  if (!parsed) return NextResponse.json({ ok: true });

  // /signal <experiment_id> <source> <content...>
  if (parsed.cmd === "signal") {
    const [experimentId, source, ...rest] = parsed.args;
    if (!experimentId || !source || rest.length === 0) {
      await sendTelegram(chatId, "Usage: /signal <experiment_id> <source> <content>\nSources: dm, usage, observation, call, review, analytics");
      return NextResponse.json({ ok: true });
    }
    const content = rest.join(" ");
    try {
      const row = await insertSignal(experimentId, source, content);
      await sendTelegram(chatId, `✓ Signal logged (#${row.id})\n<code>${experimentId}</code> ← ${source}\n"${content}"`);
    } catch (err) {
      await sendTelegram(chatId, `⚠️ Failed: ${err instanceof Error ? err.message : String(err)}`);
    }
    return NextResponse.json({ ok: true });
  }

  // /velocity
  if (parsed.cmd === "velocity") {
    try {
      const stats = await getVelocityStats();
      const valRate = stats.strong_validation_rate != null ? `${(stats.strong_validation_rate * 100).toFixed(0)}%` : "—";
      const avgHours = stats.avg_cycle_hours != null ? `${stats.avg_cycle_hours}h` : "—";
      await sendTelegram(
        chatId,
        `<b>Innovation Velocity (7d)</b>\n\nExperiments: ${stats.velocity_week}\nAvg cycle: ${avgHours}\nValidation rate: ${valRate}\nToday: ${stats.velocity_today} started`
      );
    } catch (err) {
      await sendTelegram(chatId, `⚠️ Failed: ${err instanceof Error ? err.message : String(err)}`);
    }
    return NextResponse.json({ ok: true });
  }

  // /start <hypothesis...>
  if (parsed.cmd === "start") {
    if (parsed.args.length === 0) {
      await sendTelegram(chatId, "Usage: /start <hypothesis>\nExample: /start if I DM 10 founders per day, then I get 3 discovery calls, because personal outreach converts higher");
      return NextResponse.json({ ok: true });
    }
    const hypothesis = parsed.args.join(" ");
    try {
      const id = generateExperimentId();
      await createExperiment({ id, hypothesis, loop_class: "L0" });
      await sendTelegram(
        chatId,
        `✓ Logged as L0 (quick capture)\n<code>${id}</code>\n\nPromote to L1/L2 in the dashboard with segment + metric + threshold + kill criteria to make it falsifiable.`
      );
    } catch (err) {
      await sendTelegram(chatId, `⚠️ Failed: ${err instanceof Error ? err.message : String(err)}`);
    }
    return NextResponse.json({ ok: true });
  }

  // /criteria <id> <text...>
  if (parsed.cmd === "criteria") {
    const [id, ...rest] = parsed.args;
    if (!id || rest.length === 0) {
      await sendTelegram(chatId, "Usage: /criteria <experiment_id> <success criteria>");
      return NextResponse.json({ ok: true });
    }
    const criteria = rest.join(" ");
    try {
      await setSuccessCriteria(id, criteria);
      await sendTelegram(chatId, `✓ Success criteria set for <code>${id}</code>\n"${criteria}"`);
    } catch (err) {
      await sendTelegram(chatId, `⚠️ Failed: ${err instanceof Error ? err.message : String(err)}`);
    }
    return NextResponse.json({ ok: true });
  }

  // /skip <id> — discard a debrief-created experiment
  if (parsed.cmd === "skip") {
    const [id] = parsed.args;
    if (!id) {
      await sendTelegram(chatId, "Usage: /skip <experiment_id>");
      return NextResponse.json({ ok: true });
    }
    try {
      await deleteExperiment(id);
      await sendTelegram(chatId, `✓ Discarded <code>${id}</code>`);
    } catch (err) {
      await sendTelegram(chatId, `⚠️ Failed: ${err instanceof Error ? err.message : String(err)}`);
    }
    return NextResponse.json({ ok: true });
  }

  // /win <id> <learning...>
  if (parsed.cmd === "win") {
    const [id, ...rest] = parsed.args;
    if (!id || rest.length === 0) {
      await sendTelegram(chatId, "Usage: /win <experiment_id> <what you learned>");
      return NextResponse.json({ ok: true });
    }
    const learning = rest.join(" ");
    try {
      const exp = await closeWithVerdict(id, "win", learning);
      if (!exp) {
        await sendTelegram(chatId, `⚠️ Experiment <code>${id}</code> not found`);
      } else {
        await sendTelegram(chatId, `✓ WIN — <code>${id}</code>\n"${learning}"`);
      }
    } catch (err) {
      await sendTelegram(chatId, `⚠️ Failed: ${err instanceof Error ? err.message : String(err)}`);
    }
    return NextResponse.json({ ok: true });
  }

  // /kill <id> <learning...>
  if (parsed.cmd === "kill") {
    const [id, ...rest] = parsed.args;
    if (!id || rest.length === 0) {
      await sendTelegram(chatId, "Usage: /kill <experiment_id> <what you learned>");
      return NextResponse.json({ ok: true });
    }
    const learning = rest.join(" ");
    try {
      const exp = await closeWithVerdict(id, "kill", learning);
      if (!exp) {
        await sendTelegram(chatId, `⚠️ Experiment <code>${id}</code> not found`);
      } else {
        await sendTelegram(chatId, `✓ KILL — <code>${id}</code>\n"${learning}"`);
      }
    } catch (err) {
      await sendTelegram(chatId, `⚠️ Failed: ${err instanceof Error ? err.message : String(err)}`);
    }
    return NextResponse.json({ ok: true });
  }

  // /more <id>
  if (parsed.cmd === "more") {
    const [id] = parsed.args;
    if (!id) {
      await sendTelegram(chatId, "Usage: /more <experiment_id>");
      return NextResponse.json({ ok: true });
    }
    try {
      const exp = await closeWithVerdict(id, "need_more_data", "");
      if (!exp) {
        await sendTelegram(chatId, `⚠️ Experiment <code>${id}</code> not found`);
      } else {
        await sendTelegram(chatId, `✓ Need more data — <code>${id}</code> stays open`);
      }
    } catch (err) {
      await sendTelegram(chatId, `⚠️ Failed: ${err instanceof Error ? err.message : String(err)}`);
    }
    return NextResponse.json({ ok: true });
  }

  // /list
  if (parsed.cmd === "list") {
    try {
      const experiments = await getActiveExperiments();
      if (experiments.length === 0) {
        await sendTelegram(chatId, "No active experiments. Use /start <hypothesis> to begin.");
      } else {
        const lines = ["<b>Active experiments</b>"];
        experiments.slice(0, 5).forEach((exp) => {
          const days = Math.floor((Date.now() - new Date(exp.started_at).getTime()) / 86400000);
          const typeLabel = exp.experiment_type ? ` · ${exp.experiment_type}` : "";
          lines.push(`\n<code>${exp.id}</code>${typeLabel} (${days}d)\n${exp.hypothesis.slice(0, 80)}${exp.hypothesis.length > 80 ? "…" : ""}`);
        });
        await sendTelegram(chatId, lines.join("\n"));
      }
    } catch (err) {
      await sendTelegram(chatId, `⚠️ Failed: ${err instanceof Error ? err.message : String(err)}`);
    }
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ ok: true });
}

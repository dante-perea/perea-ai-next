import { NextResponse } from "next/server";
import { insertSignal, getVelocityStats } from "@/lib/learning/ghost-db";

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

// /signal <experiment_id> <source> <content...>
// /velocity
function parseCommand(text: string): { cmd: string; args: string[] } | null {
  const trimmed = text.trim();
  if (!trimmed.startsWith("/")) return null;
  const parts = trimmed.slice(1).split(/\s+/);
  return { cmd: parts[0].toLowerCase(), args: parts.slice(1) };
}

export async function POST(req: Request) {
  // Verify the request comes from Telegram via secret token header
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

  if (parsed.cmd === "signal") {
    // /signal <experiment_id> <source> <content...>
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

  if (parsed.cmd === "velocity") {
    try {
      const stats = await getVelocityStats();
      const valRate = stats.validation_rate != null ? `${(stats.validation_rate * 100).toFixed(0)}%` : "—";
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

  return NextResponse.json({ ok: true });
}

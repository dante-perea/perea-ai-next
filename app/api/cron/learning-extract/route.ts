import { NextResponse } from "next/server";
import {
  getYesterdaySessions,
  getActiveExperiments,
  getVelocityStats,
  extractAndSynthesize,
  writeDailyLearning,
  writeSignalsFromLearnings,
} from "@/lib/learning/extract";

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

export async function GET(req: Request) {
  const secret = req.headers.get("authorization")?.replace("Bearer ", "");
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const experiments = await getActiveExperiments();

    // Use linked session IDs for accurate matching; fall back to recent sessions
    const linkedSessionIds = experiments
      .map((e) => e.session_id)
      .filter((id): id is string => id != null);

    const [sessions, stats] = await Promise.all([
      getYesterdaySessions(linkedSessionIds),
      getVelocityStats(),
    ]);

    const { synthesis, validated, refuted, inconclusive, territory, next_hypothesis } =
      await extractAndSynthesize(sessions, experiments);

    const today = new Date().toISOString().split("T")[0];

    await Promise.all([
      writeDailyLearning({
        date: today,
        territory,
        validated,
        refuted,
        inconclusive,
        velocity_today: stats.velocity_today,
        velocity_week: stats.velocity_week,
        avg_cycle_hours: stats.avg_cycle_hours,
        validation_rate: stats.validation_rate,
        next_implied_hypothesis: next_hypothesis,
        raw_synthesis: synthesis,
      }),
      writeSignalsFromLearnings(validated, refuted, inconclusive),
    ]);

    const valRate = stats.validation_rate != null ? `${(stats.validation_rate * 100).toFixed(0)}%` : "—";
    const avgHours = stats.avg_cycle_hours != null ? `${stats.avg_cycle_hours}h` : "—";

    const lines: string[] = [
      `<b>Daily Learning — ${today}</b>`,
      `<i>${territory}</i>`,
      ``,
      synthesis,
    ];

    if (validated.length > 0) {
      lines.push(``, `<b>✓ Validated (${validated.length})</b>`);
      validated.forEach((v) => lines.push(`• ${v.learning}`));
    }
    if (refuted.length > 0) {
      lines.push(``, `<b>✗ Refuted (${refuted.length})</b>`);
      refuted.forEach((v) => lines.push(`• ${v.learning}`));
    }
    if (inconclusive.length > 0) {
      lines.push(``, `<b>? Inconclusive (${inconclusive.length})</b>`);
      inconclusive.forEach((v) => lines.push(`• ${v.learning}`));
    }

    lines.push(
      ``,
      `<b>Next:</b> ${next_hypothesis}`,
      ``,
      `<b>Velocity (7d):</b> ${stats.velocity_week} experiments · ${avgHours} avg cycle · ${valRate} validated`
    );

    // Telegram max is 4096 chars
    const msg = lines.join("\n").slice(0, 4000);
    await sendTelegram(msg);

    return NextResponse.json({
      date: today,
      sessions_read: sessions.length,
      active_experiments: experiments.length,
      linked_sessions: linkedSessionIds.length,
      validated: validated.length,
      refuted: refuted.length,
      inconclusive: inconclusive.length,
      velocity_week: stats.velocity_week,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[learning-extract]", message);
    await sendTelegram(`⚠️ Learning extract failed: ${message}`).catch(() => {});
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

import { NextResponse } from "next/server";

// One-time setup: registers the Telegram webhook with perea.ai as the callback URL.
// Call once after deploy: GET /api/telegram-webhook/setup?secret=<CRON_SECRET>
export async function GET(req: Request) {
  const url = new URL(req.url);
  if (url.searchParams.get("secret") !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const webhookSecret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (!token || !webhookSecret) {
    return NextResponse.json({ error: "TELEGRAM_BOT_TOKEN or TELEGRAM_WEBHOOK_SECRET not set" }, { status: 500 });
  }

  const webhookUrl = "https://www.perea.ai/api/telegram-webhook";

  const res = await fetch(`https://api.telegram.org/bot${token}/setWebhook`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      url: webhookUrl,
      secret_token: webhookSecret,
      allowed_updates: ["message"],
    }),
  });

  const data = await res.json();
  return NextResponse.json(data);
}

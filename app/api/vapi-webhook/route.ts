import { NextRequest, NextResponse } from "next/server";

/**
 * VAPI Webhook receiver.
 *
 * VAPI sends POST events to this URL configured on the Aria assistant.
 * We listen for `end-of-call-report` to capture qualification transcripts.
 *
 * Configure VAPI_WEBHOOK_SECRET env var for signature verification (optional).
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message } = body;

    if (!message?.type) {
      return NextResponse.json({ received: true });
    }

    console.log("[vapi-webhook] Event:", message.type);

    if (message.type === "end-of-call-report") {
      const {
        call,
        transcript,
        summary,
        recordingUrl,
      } = message as {
        call?: { id: string; endedAt?: string; customer?: { number: string; name?: string } };
        transcript?: string;
        summary?: string;
        recordingUrl?: string;
      };

      const lead = {
        callId:      call?.id,
        phone:       call?.customer?.number,
        name:        call?.customer?.name,
        endedAt:     call?.endedAt,
        summary:     summary,
        transcript:  transcript,
        recordingUrl,
      };

      console.log("[vapi-webhook] Call ended:", JSON.stringify(lead, null, 2));

      // ── Slack notification (if SLACK_WEBHOOK_URL is set) ──────────────────
      const slackUrl = process.env.SLACK_WEBHOOK_URL;
      if (slackUrl) {
        await fetch(slackUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: `*New Perea.AI Qualification Call*\n*Name:* ${lead.name || "Unknown"}\n*Phone:* ${lead.phone}\n*Summary:* ${lead.summary || "No summary"}\n<${lead.recordingUrl || "#"}|Listen to recording>`,
          }),
        }).catch(console.error);
      }

      // ── CRM / database hook placeholder ──────────────────────────────────
      // TODO: await upsertLead({ ...lead });
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("[vapi-webhook] Error:", err);
    // Always return 200 to VAPI so it doesn't retry
    return NextResponse.json({ received: true, error: String(err) });
  }
}

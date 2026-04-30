import { NextRequest, NextResponse } from "next/server";

/**
 * Retell AI Webhook receiver.
 *
 * Retell sends POST events to this URL (configured on the Aria agent).
 * We listen for `call_ended` to capture qualification transcripts and summaries.
 *
 * Retell webhook events: call_started, call_ended, call_analyzed
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { event, call } = body as {
      event?: string;
      call?: {
        call_id?: string;
        call_status?: string;
        from_number?: string;
        to_number?: string;
        transcript?: string;
        metadata?: { name?: string; email?: string };
        call_analysis?: {
          call_summary?: string;
          user_sentiment?: string;
          call_successful?: boolean;
        };
        recording_url?: string;
        end_timestamp?: number;
      };
    };

    console.log("[retell-webhook] Event:", event, "| Status:", call?.call_status);

    if (event === "call_ended" || event === "call_analyzed") {
      const lead = {
        callId:      call?.call_id,
        phone:       call?.to_number,
        name:        call?.metadata?.name,
        email:       call?.metadata?.email,
        status:      call?.call_status,
        summary:     call?.call_analysis?.call_summary,
        sentiment:   call?.call_analysis?.user_sentiment,
        successful:  call?.call_analysis?.call_successful,
        transcript:  call?.transcript,
        recordingUrl: call?.recording_url,
      };

      console.log("[retell-webhook] Call data:", JSON.stringify(lead, null, 2));

      // ── Slack notification ────────────────────────────────────────────────
      const slackUrl = process.env.SLACK_WEBHOOK_URL;
      if (slackUrl && lead.summary) {
        const emoji = lead.successful ? "✅" : "📋";
        await fetch(slackUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: `${emoji} *New Perea.AI Qualification Call*\n*Name:* ${lead.name || "Unknown"}\n*Email:* ${lead.email || "—"}\n*Phone:* ${lead.phone}\n*Summary:* ${lead.summary}\n*Sentiment:* ${lead.sentiment || "—"}\n${lead.recordingUrl ? `<${lead.recordingUrl}|🎙 Listen to recording>` : ""}`,
          }),
        }).catch(console.error);
      }

      // ── CRM hook placeholder ──────────────────────────────────────────────
      // TODO: await upsertLead({ ...lead });
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("[retell-webhook] Error:", err);
    // Always return 200 so Retell doesn't retry infinitely
    return NextResponse.json({ received: true, error: String(err) });
  }
}

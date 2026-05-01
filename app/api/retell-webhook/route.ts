import { NextRequest, NextResponse } from "next/server";
import { analyzeLead }     from "@/lib/analyze-lead";
import { sendPreCallBrief } from "@/lib/send-brief";

/**
 * Retell AI Webhook receiver.
 *
 * ⚠️  IMPORTANT: We AWAIT all async work before returning.
 * Vercel serverless functions terminate on response — fire-and-forget
 * promises are killed before they complete.
 *
 * Retell webhook timeout: ~30s — our pipeline runs in 3–6s, well within limit.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { event, call } = body as {
      event?: string;
      call?: {
        call_id?:      string;
        call_status?:  string;
        call_type?:    string;
        transcript?:   string;
        metadata?: {
          name?:   string;
          email?:  string;
          source?: string;
        };
        call_analysis?: {
          call_summary?:    string;
          user_sentiment?:  string;
          call_successful?: boolean;
        };
        recording_multi_channel_url?: string;
        duration_ms?: number;
        disconnection_reason?: string;
      };
    };

    console.log("[retell-webhook] Event:", event, "| Status:", call?.call_status, "| ID:", call?.call_id);

    if (event === "call_ended" && call) {
      const name  = call.metadata?.name  ?? "Unknown Lead";
      const email = call.metadata?.email ?? "";

      console.log("[retell-webhook] Generating brief for:", name, email);

      // Run OpenAI analysis (transcript + Retell's own summary)
      // No Apollo enrichment — free plan doesn't support people/match API
      const analysis = await analyzeLead(
        call.transcript ?? "",
        null,
        call.call_analysis?.call_summary,
      );

      // ✅ AWAIT the brief — Vercel kills the function on response,
      //    fire-and-forget promises never complete
      await sendPreCallBrief({
        name,
        email,
        callId:        call.call_id,
        transcript:    call.transcript,
        retellSummary: call.call_analysis?.call_summary,
        enrichment:    null,
        analysis,
      });

      console.log("[retell-webhook] Brief sent ✓ | ICP:", analysis?.icpScore ?? "N/A", "| Lead:", name);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("[retell-webhook] Error:", err);
    return NextResponse.json({ received: true, error: String(err) });
  }
}

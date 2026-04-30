import { NextRequest, NextResponse } from "next/server";
import { enrichLead }      from "@/lib/enrich-lead";
import { analyzeLead }     from "@/lib/analyze-lead";
import { sendPreCallBrief } from "@/lib/send-brief";

/**
 * Retell AI Webhook receiver.
 *
 * Events: call_started | call_ended | call_analyzed
 *
 * On call_ended:
 *   1. Extract lead info (name, email, transcript, summary)
 *   2. Enrich via Apollo.io
 *   3. Analyze via OpenAI (ICP score + talking points)
 *   4. Send brief via Telegram + Email
 *
 * Always returns 200 to prevent Retell retries.
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
        metadata?: {
          name?:  string;
          email?: string;
          ip?:    string;
        };
        call_analysis?: {
          call_summary?:     string;
          user_sentiment?:   string;
          call_successful?:  boolean;
        };
        recording_url?: string;
        start_timestamp?: number;
        end_timestamp?:   number;
      };
    };

    console.log("[retell-webhook] Event:", event, "| Status:", call?.call_status, "| Call ID:", call?.call_id);

    // We process on call_ended — transcript + analysis available
    if (event === "call_ended" && call) {
      const name  = call.metadata?.name  ?? "Unknown Lead";
      const email = call.metadata?.email ?? "";

      console.log("[retell-webhook] Processing brief for:", name, email);

      // Run enrichment + analysis in parallel for speed
      const [enrichment, analysis] = await Promise.all([
        email ? enrichLead(email) : Promise.resolve(null),
        analyzeLead(
          call.transcript ?? "",
          null,                           // enrichment not ready yet — do it in two passes below
          call.call_analysis?.call_summary,
        ),
      ]);

      // If we got enrichment, re-run analysis with the extra context
      // (second pass is fast since enrichment provides crucial company signals)
      let finalAnalysis = analysis;
      if (enrichment && call.transcript) {
        finalAnalysis = await analyzeLead(
          call.transcript,
          enrichment,
          call.call_analysis?.call_summary,
        ) ?? analysis;
      }

      // Send the brief (Telegram + Email) — fire and forget, don't block webhook response
      sendPreCallBrief({
        name,
        email,
        callId:        call.call_id,
        transcript:    call.transcript,
        retellSummary: call.call_analysis?.call_summary,
        enrichment,
        analysis:      finalAnalysis,
      }).catch(err => console.error("[retell-webhook] Brief send error:", err));

      console.log("[retell-webhook] Brief dispatched for:", name, "| ICP:", finalAnalysis?.icpScore ?? "N/A");
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("[retell-webhook] Error:", err);
    // Always 200 so Retell doesn't retry
    return NextResponse.json({ received: true, error: String(err) });
  }
}

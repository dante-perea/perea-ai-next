import { NextRequest, NextResponse } from "next/server";
import { enrichLead }      from "@/lib/enrich-lead";
import { analyzeLead }     from "@/lib/analyze-lead";
import { sendPreCallBrief } from "@/lib/send-brief";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { event, call } = body as {
      event?: string;
      call?: {
        call_id?:    string;
        call_status?: string;
        transcript?:  string;
        metadata?: { name?: string; email?: string; source?: string };
        call_analysis?: {
          call_summary?:    string;
          user_sentiment?:  string;
          call_successful?: boolean;
        };
        recording_multi_channel_url?: string;
        duration_ms?: number;
      };
    };

    console.log("[retell-webhook] Event:", event, "| Call:", call?.call_id);

    if (event === "call_ended" && call) {
      const name  = call.metadata?.name  ?? "Unknown Lead";
      const email = call.metadata?.email ?? "";

      console.log("[retell-webhook] Processing:", name, email);

      // Enrichment + first-pass analysis in parallel
      const [enrichment, firstAnalysis] = await Promise.all([
        email ? enrichLead(email) : Promise.resolve(null),
        analyzeLead(call.transcript ?? "", null, call.call_analysis?.call_summary),
      ]);

      // Second-pass analysis with company context for better ICP scoring
      let finalAnalysis = firstAnalysis;
      if (enrichment && call.transcript) {
        const enrichedAnalysis = await analyzeLead(
          call.transcript, enrichment, call.call_analysis?.call_summary,
        );
        if (enrichedAnalysis) finalAnalysis = enrichedAnalysis;
      }

      // AWAIT — Vercel kills fire-and-forget on response
      await sendPreCallBrief({
        name, email,
        callId:        call.call_id,
        transcript:    call.transcript,
        retellSummary: call.call_analysis?.call_summary,
        enrichment,
        analysis:      finalAnalysis,
      });

      console.log(
        "[retell-webhook] Brief sent \u2713 | ICP:", finalAnalysis?.icpScore ?? "N/A",
        "| Company:", enrichment?.companyName ?? "not found",
      );
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("[retell-webhook] Error:", err);
    return NextResponse.json({ received: true, error: String(err) });
  }
}

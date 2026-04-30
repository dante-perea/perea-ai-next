import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";

const RETELL_AGENT_ID = "agent_9c5cf6f9b8f0fa2797dda09c09";

export async function POST(req: NextRequest) {
  try {
    const { name, email } = await req.json();

    if (!name?.trim() || !email?.trim()) {
      return NextResponse.json({ error: "name and email are required" }, { status: 400 });
    }

    // ── Rate limiting ────────────────────────────────────────────────────────
    const ip        = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
                   ?? req.headers.get("x-real-ip")
                   ?? "unknown";
    const userAgent = req.headers.get("user-agent") ?? "";

    const limit = checkRateLimit(ip, email.trim(), userAgent);

    if (!limit.allowed) {
      console.warn("[web-call-token] Rate limited:", { ip, email: email.trim(), reason: limit.reason });
      return NextResponse.json(
        {
          error: limit.reason,
          code: "rate_limited",
          retryAfterMs: limit.retryAfterMs,
        },
        {
          status: 429,
          headers: limit.retryAfterMs
            ? { "Retry-After": String(Math.ceil(limit.retryAfterMs / 1000)) }
            : {},
        }
      );
    }

    // ── Create Retell web call ───────────────────────────────────────────────
    const apiKey = process.env.RETELL_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Calling service not configured.", code: "missing_api_key" },
        { status: 503 }
      );
    }

    const res = await fetch("https://api.retellai.com/v2/create-web-call", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        agent_id: RETELL_AGENT_ID,
        retell_llm_dynamic_variables: {
          name: name.trim(),
          email: email.trim(),
        },
        metadata: {
          name: name.trim(),
          email: email.trim(),
          ip,
          source: "perea-ai-website",
        },
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.error("[web-call-token] Retell error:", res.status, err);
      return NextResponse.json(
        { error: "Could not start the call. Please book a slot below.", code: "retell_error" },
        { status: 502 }
      );
    }

    const data = await res.json();
    console.log("[web-call-token] Web call created:", data.call_id, "| ip:", ip);

    return NextResponse.json({ callId: data.call_id, accessToken: data.access_token, success: true });
  } catch (err) {
    console.error("[web-call-token] Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
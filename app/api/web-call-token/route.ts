import { NextRequest, NextResponse } from "next/server";

const RETELL_AGENT_ID = "agent_9c5cf6f9b8f0fa2797dda09c09";

export async function POST(req: NextRequest) {
  try {
    const { name, email } = await req.json();

    if (!name?.trim() || !email?.trim()) {
      return NextResponse.json({ error: "name and email are required" }, { status: 400 });
    }

    const apiKey = process.env.RETELL_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Calling service not configured.", code: "missing_api_key" }, { status: 503 });
    }

    // Create a Retell web call — returns an access token for the browser SDK
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
    console.log("[web-call-token] Web call created:", data.call_id);

    return NextResponse.json({
      callId: data.call_id,
      accessToken: data.access_token,
      success: true,
    });
  } catch (err) {
    console.error("[web-call-token] Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

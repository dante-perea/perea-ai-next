import { NextRequest, NextResponse } from "next/server";

// Retell AI config — IDs are not secrets, only RETELL_API_KEY is
const RETELL_AGENT_ID   = "agent_9c5cf6f9b8f0fa2797dda09c09";
const RETELL_API_URL    = "https://api.retellai.com/v2/create-phone-call";

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone } = await req.json();

    // Basic validation
    if (!name?.trim() || !email?.trim() || !phone?.trim()) {
      return NextResponse.json(
        { error: "name, email, and phone are required" },
        { status: 400 }
      );
    }

    const apiKey    = process.env.RETELL_API_KEY;
    const fromNumber = process.env.RETELL_FROM_NUMBER;

    if (!apiKey) {
      console.error("[trigger-call] RETELL_API_KEY not set");
      return NextResponse.json(
        { error: "Calling service not configured.", code: "missing_api_key" },
        { status: 503 }
      );
    }

    if (!fromNumber) {
      console.error("[trigger-call] RETELL_FROM_NUMBER not set");
      return NextResponse.json(
        { error: "No outbound phone number configured. Please book a slot directly below.", code: "missing_from_number" },
        { status: 503 }
      );
    }

    // Trigger Retell AI outbound call
    const retellRes = await fetch(RETELL_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from_number: fromNumber,
        to_number: phone.trim(),
        override_agent_id: RETELL_AGENT_ID,
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

    if (!retellRes.ok) {
      let errBody: { error_message?: string; message?: string } = {};
      try { errBody = await retellRes.json(); } catch { /* ignore */ }

      const rawMsg = errBody.error_message || errBody.message || "";
      console.error("[trigger-call] Retell error:", retellRes.status, rawMsg);

      // Translate known Retell errors into user-friendly messages
      let userMsg = "Couldn't start the call. Please book a time slot directly below.";
      let code = "retell_error";

      if (rawMsg.toLowerCase().includes("international") || rawMsg.toLowerCase().includes("country")) {
        userMsg = "International calls require a local number. Please book a time slot directly below.";
        code = "international_not_supported";
      } else if (rawMsg.toLowerCase().includes("invalid") && rawMsg.toLowerCase().includes("number")) {
        userMsg = "Invalid phone number format. Please use international format e.g. +971 50 000 0000.";
        code = "invalid_number";
      } else if (retellRes.status === 401 || retellRes.status === 403) {
        userMsg = "Calling service authentication failed. Please contact support.";
        code = "auth_error";
      }

      return NextResponse.json({ error: userMsg, code, detail: rawMsg }, { status: 502 });
    }

    const data = await retellRes.json();
    console.log("[trigger-call] Retell call initiated:", data.call_id);

    return NextResponse.json({ callId: data.call_id, success: true });
  } catch (err) {
    console.error("[trigger-call] Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

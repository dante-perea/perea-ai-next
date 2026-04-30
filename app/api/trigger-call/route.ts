import { NextRequest, NextResponse } from "next/server";

// VAPI config — IDs are not secrets, only VAPI_PRIVATE_KEY is
const VAPI_PHONE_NUMBER_ID = "80540670-a502-4ab9-b928-0520688e39ed";
const VAPI_ASSISTANT_ID    = "fb21e626-6e15-4326-b303-d0629b7e9b6c";

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

    const apiKey = process.env.VAPI_PRIVATE_KEY;
    if (!apiKey) {
      console.error("[trigger-call] VAPI_PRIVATE_KEY env var is not set");
      return NextResponse.json(
        { error: "Calling service not configured. Please add VAPI_PRIVATE_KEY to Vercel environment variables.", code: "missing_api_key" },
        { status: 503 }
      );
    }

    // Trigger VAPI outbound call
    const vapiRes = await fetch("https://api.vapi.ai/call", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "outboundPhoneCall",
        phoneNumberId: VAPI_PHONE_NUMBER_ID,
        customer: {
          number: phone.trim(),
          name: name.trim(),
        },
        assistantId: VAPI_ASSISTANT_ID,
        assistantOverrides: {
          variableValues: {
            name: name.trim(),
            email: email.trim(),
          },
        },
      }),
    });

    if (!vapiRes.ok) {
      const errText = await vapiRes.text();
      console.error("[trigger-call] VAPI error:", vapiRes.status, errText);
      return NextResponse.json(
        { error: "Failed to initiate call", detail: errText },
        { status: 502 }
      );
    }

    const data = await vapiRes.json();
    console.log("[trigger-call] Call initiated:", data.id);

    return NextResponse.json({ callId: data.id, success: true });
  } catch (err) {
    console.error("[trigger-call] Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { insertClient } from "@/lib/oauth/db";

export async function POST(request: Request): Promise<NextResponse> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_request", error_description: "Body must be JSON" }, { status: 400 });
  }

  const { redirect_uris, client_name } = body as Record<string, unknown>;

  if (!Array.isArray(redirect_uris) || redirect_uris.length === 0) {
    return NextResponse.json({ error: "invalid_client_metadata", error_description: "redirect_uris is required" }, { status: 400 });
  }

  for (const uri of redirect_uris) {
    if (typeof uri !== "string") {
      return NextResponse.json({ error: "invalid_redirect_uri", error_description: "All redirect_uris must be strings" }, { status: 400 });
    }
    let parsed: URL;
    try { parsed = new URL(uri); } catch {
      return NextResponse.json({ error: "invalid_redirect_uri", error_description: `Invalid URI: ${uri}` }, { status: 400 });
    }
    const isLocalhost = parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1";
    if (!isLocalhost) {
      return NextResponse.json({ error: "invalid_redirect_uri", error_description: "Only localhost redirect URIs are allowed" }, { status: 400 });
    }
  }

  const client_id = crypto.randomUUID();
  const now = Math.floor(Date.now() / 1000);

  const client = await insertClient({
    client_id,
    redirect_uris: redirect_uris as string[],
    client_name: typeof client_name === "string" ? client_name : undefined,
  });

  return NextResponse.json(
    {
      client_id: client.client_id,
      client_id_issued_at: now,
      redirect_uris: client.redirect_uris,
      client_name: client.client_name,
      grant_types: ["authorization_code"],
      response_types: ["code"],
      token_endpoint_auth_method: "none",
    },
    { status: 201 }
  );
}

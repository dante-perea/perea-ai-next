import { NextResponse } from "next/server";
import { findClient, findAndConsumeCode, deleteExpiredCodes } from "@/lib/oauth/db";
import { signAccessToken } from "@/lib/oauth/jwt";

const ERR_HEADERS = { "Cache-Control": "no-store", "Pragma": "no-cache" };
const OK_HEADERS  = { "Cache-Control": "no-store", "Pragma": "no-cache" };

function oauthError(error: string, description: string, status: number) {
  return NextResponse.json({ error, error_description: description }, { status, headers: ERR_HEADERS });
}

export async function POST(request: Request): Promise<NextResponse> {
  const params = new URLSearchParams(await request.text());

  const grant_type    = params.get("grant_type");
  const code          = params.get("code");
  const redirect_uri  = params.get("redirect_uri");
  const client_id     = params.get("client_id");
  const code_verifier = params.get("code_verifier");

  if (grant_type !== "authorization_code") {
    return oauthError("unsupported_grant_type", "Only authorization_code is supported", 400);
  }
  if (!code || !redirect_uri || !client_id || !code_verifier) {
    return oauthError("invalid_request", "Missing required parameters", 400);
  }

  const client = await findClient(client_id);
  if (!client) {
    return oauthError("invalid_client", "Unknown client", 401);
  }

  const consumed = await findAndConsumeCode(code);
  if (!consumed) {
    return oauthError("invalid_grant", "Code not found, expired, or already used", 400);
  }
  if (consumed.client_id !== client_id) {
    return oauthError("invalid_grant", "Client mismatch", 400);
  }
  if (consumed.redirect_uri !== redirect_uri) {
    return oauthError("invalid_grant", "Redirect URI mismatch", 400);
  }

  // PKCE S256 verification: BASE64URL(SHA256(ASCII(code_verifier))) must equal stored challenge
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(code_verifier));
  const computed = btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
  if (computed !== consumed.code_challenge) {
    return oauthError("invalid_grant", "PKCE verification failed", 400);
  }

  const access_token = await signAccessToken(consumed.user_id, consumed.user_email);

  // Fire-and-forget expired code cleanup
  deleteExpiredCodes().catch(() => {});

  return NextResponse.json(
    { access_token, token_type: "Bearer", expires_in: 3600, scope: "mcp" },
    { headers: OK_HEADERS }
  );
}

import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const ORIGIN = "https://www.perea.ai";

export async function GET(): Promise<NextResponse> {
  return Response.json(
    {
      issuer: ORIGIN,
      authorization_endpoint: `${ORIGIN}/oauth/authorize`,
      token_endpoint: `${ORIGIN}/api/oauth/token`,
      registration_endpoint: `${ORIGIN}/api/oauth/register`,
      response_types_supported: ["code"],
      grant_types_supported: ["authorization_code"],
      code_challenge_methods_supported: ["S256"],
      token_endpoint_auth_methods_supported: ["none"],
      scopes_supported: ["mcp"],
    },
    { headers: { "Cache-Control": "no-store" } }
  ) as NextResponse;
}

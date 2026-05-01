export const dynamic = "force-static";

export function GET() {
  return Response.json(
    {
      issuer: "https://perea.ai",
      authorization_endpoint: "https://perea.ai/oauth/authorize",
      token_endpoint: "https://perea.ai/api/oauth/token",
      registration_endpoint: "https://perea.ai/api/oauth/register",
      response_types_supported: ["code"],
      grant_types_supported: ["authorization_code"],
      code_challenge_methods_supported: ["S256"],
      token_endpoint_auth_methods_supported: ["none"],
      scopes_supported: ["mcp"],
    },
    { headers: { "Cache-Control": "public, max-age=3600" } }
  );
}

export const dynamic = "force-dynamic";

export function GET(request: Request) {
  const host = request.headers.get("x-forwarded-host") ?? new URL(request.url).host;
  const proto = request.headers.get("x-forwarded-proto") ?? "https";
  const origin = `${proto}://${host}`;
  return Response.json(
    {
      resource: `${origin}/api/mcp/server`,
      authorization_servers: [origin],
      bearer_methods_supported: ["header"],
      resource_name: "Perea Knowledge Base MCP Server",
    },
    { headers: { "Cache-Control": "public, max-age=300" } }
  );
}

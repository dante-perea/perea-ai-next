export const dynamic = "force-dynamic";

export function GET(request: Request) {
  const origin = new URL(request.url).origin;
  return Response.json(
    {
      resource: `${origin}/api/mcp/server`,
      authorization_servers: [origin],
      bearer_methods_supported: ["header"],
      resource_name: "Perea Knowledge Base MCP Server",
    },
    { headers: { "Cache-Control": "public, max-age=3600" } }
  );
}

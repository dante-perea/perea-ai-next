export const dynamic = "force-static";

const ORIGIN = "https://www.perea.ai";

export function GET() {
  return Response.json(
    {
      resource: `${ORIGIN}/api/mcp/server`,
      authorization_servers: [ORIGIN],
      bearer_methods_supported: ["header"],
      resource_name: "Perea Knowledge Base MCP Server",
    },
    { headers: { "Cache-Control": "public, max-age=3600" } }
  );
}

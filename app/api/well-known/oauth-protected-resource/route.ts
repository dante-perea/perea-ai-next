export const dynamic = "force-static";

export function GET() {
  return Response.json(
    {
      resource: "https://perea.ai/api/mcp/server",
      authorization_servers: ["https://perea.ai"],
      bearer_methods_supported: ["header"],
      resource_name: "Perea Knowledge Base MCP Server",
    },
    { headers: { "Cache-Control": "public, max-age=3600" } }
  );
}

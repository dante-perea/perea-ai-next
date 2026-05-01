import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(): Promise<NextResponse> {
  return NextResponse.json(
    {
      resource: "https://www.perea.ai/api/mcp/server",
      authorization_servers: ["https://www.perea.ai"],
      bearer_methods_supported: ["header"],
      resource_name: "Perea Knowledge Base MCP Server",
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}

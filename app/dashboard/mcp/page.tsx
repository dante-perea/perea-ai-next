import { McpDocs } from "@/components/dashboard/McpDocs";

export const dynamic = "force-dynamic";

export default function McpPage() {
  const serverUrl = "https://perea.ai/api/mcp/server";
  const secret = process.env.MCP_SECRET ?? "";

  return <McpDocs serverUrl={serverUrl} secret={secret} />;
}

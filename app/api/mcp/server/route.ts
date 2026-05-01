import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import { get } from "@vercel/blob";
import { z } from "zod";
import { findFileById, listAllFiles } from "@/lib/knowledge-base/meta";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function checkAuth(request: Request): Response | null {
  const secret = process.env.MCP_SECRET;
  if (!secret) return null;
  const auth = request.headers.get("authorization") ?? "";
  if (auth !== `Bearer ${secret}`) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
  return null;
}

function buildServer(): McpServer {
  const server = new McpServer({ name: "perea-knowledge-base", version: "1.0.0" });

  server.tool(
    "list_files",
    "List files in the knowledge base, optionally filtered by tag.",
    { tag: z.string().optional() },
    async ({ tag }) => {
      let files = await listAllFiles();
      if (tag) files = files.filter((f) => f.tags.includes(tag));
      return {
        content: [{
          type: "text" as const,
          text: JSON.stringify(files.map((f) => ({
            id: f.id,
            filename: f.filename,
            size: f.size,
            contentType: f.contentType,
            uploadedBy: f.uploadedBy,
            uploadedAt: f.uploadedAt,
            tags: f.tags,
          })), null, 2),
        }],
      };
    }
  );

  server.tool(
    "get_file_content",
    "Fetch a file's content by ID. Returns base64-encoded data + filename + contentType.",
    { id: z.string() },
    async ({ id }) => {
      const file = await findFileById(id);
      if (!file) {
        return {
          content: [{ type: "text" as const, text: JSON.stringify({ error: `Not found: ${id}` }) }],
          isError: true,
        };
      }

      const result = await get(file.blobUrl, { access: "private" });
      if (!result || result.statusCode !== 200) {
        return {
          content: [{ type: "text" as const, text: JSON.stringify({ error: "Blob unavailable" }) }],
          isError: true,
        };
      }

      const reader = result.stream.getReader();
      const chunks: Uint8Array[] = [];
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
      }
      const buf = new Uint8Array(chunks.reduce((n, c) => n + c.length, 0));
      let off = 0;
      for (const c of chunks) { buf.set(c, off); off += c.length; }

      return {
        content: [{
          type: "text" as const,
          text: JSON.stringify({
            filename: file.filename,
            contentType: file.contentType,
            size: file.size,
            encoding: "base64",
            data: Buffer.from(buf).toString("base64"),
          }),
        }],
      };
    }
  );

  return server;
}

async function handle(request: Request): Promise<Response> {
  const authError = checkAuth(request);
  if (authError) return authError;

  const server = buildServer();
  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
  });
  await server.connect(transport);
  const response = await transport.handleRequest(request);
  await server.close();
  return response;
}

export const POST = handle;
export const GET = handle;
export const DELETE = handle;

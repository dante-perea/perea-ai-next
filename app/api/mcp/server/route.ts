import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import { get } from "@vercel/blob";
import { z } from "zod";
import {
  findFileById,
  findFileByIdAdmin,
  listAllFiles,
  listAllFilesAdmin,
  type ViewerContext,
} from "@/lib/knowledge-base/meta";
import { verifyAccessToken } from "@/lib/oauth/jwt";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type AuthResult =
  | { kind: "user"; ctx: ViewerContext }
  | { kind: "admin" }
  | { kind: "error"; response: Response };

async function resolveAuth(request: Request): Promise<AuthResult> {
  const header = request.headers.get("authorization") ?? "";

  // Static machine token — admin scope, no Clerk user context
  const secret = process.env.MCP_SECRET;
  if (secret && header === `Bearer ${secret}`) return { kind: "admin" };

  if (header.startsWith("Bearer ")) {
    try {
      const { sub } = await verifyAccessToken(header.slice(7));
      return { kind: "user", ctx: { userId: sub } };
    } catch {
      // fall through
    }
  }

  return {
    kind: "error",
    response: new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: {
        "Content-Type": "application/json",
        "WWW-Authenticate": 'Bearer resource_metadata="https://perea.ai/.well-known/oauth-protected-resource"',
      },
    }),
  };
}

function buildServer(auth: { kind: "user"; ctx: ViewerContext } | { kind: "admin" }): McpServer {
  const server = new McpServer({ name: "perea-knowledge-base", version: "1.0.0" });

  server.tool(
    "list_files",
    "List files in the knowledge base, optionally filtered by tag.",
    { tag: z.string().optional() },
    async ({ tag }) => {
      const files = auth.kind === "admin"
        ? await listAllFilesAdmin()
        : await listAllFiles(auth.ctx);

      const filtered = tag ? files.filter((f) => f.tags.includes(tag)) : files;
      return {
        content: [{
          type: "text" as const,
          text: JSON.stringify(filtered.map((f) => ({
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
      const file = auth.kind === "admin"
        ? await findFileByIdAdmin(id)
        : await findFileById(id, auth.ctx);

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
  const authResult = await resolveAuth(request);
  if (authResult.kind === "error") return authResult.response;

  const server = buildServer(authResult);
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

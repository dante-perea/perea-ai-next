import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import { captureServerEvent } from "@/lib/posthog-server";
import { get, put } from "@vercel/blob";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { z } from "zod";
import {
  findFileById,
  findFileByIdAdmin,
  insertFile,
  upsertFile,
  updateTags,
  listAllFiles,
  listAllFilesAdmin,
  type ViewerContext,
} from "@/lib/knowledge-base/meta";
import type { FileMetadata } from "@/lib/knowledge-base/types";
import { detectKnowledgeType, detectKnowledgeTypeFromFilename } from "@/lib/knowledge-base/detect-knowledge-type";
import { getUserTeamIds, checkTeamAccess } from "@/lib/knowledge-base/teams";
import { verifyAccessToken } from "@/lib/oauth/jwt";
import { fetchAndConvert, UrlConvertError } from "@/lib/knowledge-base/url-to-md";
import {
  createExperiment,
  markShipped,
  closeWithStructure,
  setNextBetId,
  createDraftExperiment,
  insertSignal,
  getVelocityStats,
  generateExperimentId,
  ghostDb,
  type Experiment,
} from "@/lib/learning/ghost-db";
import { generateNextBetDraft } from "@/lib/learning/next-bet";

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
      const teamIds = await getUserTeamIds(sub);
      return { kind: "user", ctx: { userId: sub, teamIds } };
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
        "WWW-Authenticate": 'Bearer resource_metadata="https://www.perea.ai/api/mcp/resource"',
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
            teamId: f.teamId,
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

  server.tool(
    "upload_file",
    "Upload a file into the knowledge base. Accepts base64-encoded content. The 'mcp' tag is added automatically for source segregation.",
    {
      filename:    z.string().describe("Filename to store, e.g. 'report.pdf'"),
      contentType: z.string().describe("MIME type, e.g. 'text/plain' or 'application/pdf'"),
      data:        z.string().describe("Base64-encoded file content"),
      tags:        z.array(z.string()).optional().describe("Optional tags. 'mcp' is always added."),
      team:        z.string().optional().describe("Team ID to upload into. Omit for personal KB."),
      id:          z.string().optional().describe("Stable file ID for replacement uploads. If omitted, a new UUID is generated."),
      userId:      z.string().optional().describe("Required when using admin MCP_SECRET auth. Ignored for user OAuth."),
      overwrite:   z.boolean().optional().describe("Replace an existing file with the same id. Requires a stable id to be passed."),
    },
    async ({ filename, contentType, data, tags, team, id: providedId, userId: providedUserId, overwrite }) => {
      // Resolve effective user ID — user OAuth takes precedence; admin auth requires explicit userId
      let effectiveUserId: string;
      if (auth.kind === "user") {
        effectiveUserId = auth.ctx.userId;
      } else if (auth.kind === "admin" && providedUserId) {
        effectiveUserId = providedUserId;
      } else {
        return {
          content: [{ type: "text" as const, text: JSON.stringify({ error: "upload_file with admin MCP_SECRET requires a userId parameter." }) }],
          isError: true,
        };
      }

      if (data.length > 5_592_406) {
        return {
          content: [{ type: "text" as const, text: JSON.stringify({ error: "File too large. Max 4 MB." }) }],
          isError: true,
        };
      }

      if (team && auth.kind === "user") {
        const access = await checkTeamAccess(team, effectiveUserId, "editor");
        if (!access.ok) {
          const error = access.reason === "not_member" ? "Not a member of this team." : "Viewers cannot upload files.";
          return { content: [{ type: "text" as const, text: JSON.stringify({ error }) }], isError: true };
        }
      }

      const buffer = Buffer.from(data, "base64");
      const id = providedId ?? crypto.randomUUID();
      const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, "_");
      const blobName = `users/${effectiveUserId}/files/${id}-${safeName}`;

      const blobResult = await put(blobName, buffer, {
        access: "private",
        contentType,
        addRandomSuffix: false,
        allowOverwrite: overwrite ?? false,
      });

      const knowledgeType = detectKnowledgeType(filename, buffer);
      const normalizedTags = [...new Set(["mcp", ...(tags ?? []), ...(knowledgeType !== 'document' ? [knowledgeType.replace('_', '-')] : [])])];

      const meta: FileMetadata = {
        id,
        filename,
        blobKey: blobResult.pathname,
        blobUrl: blobResult.url,
        size: buffer.byteLength,
        contentType,
        uploadedBy: "mcp",
        uploadedAt: new Date().toISOString(),
        tags: normalizedTags,
        userId: effectiveUserId,
        teamId: team ?? null,
        knowledgeType,
      };

      await (overwrite ? upsertFile(meta) : insertFile(meta));

      return {
        content: [{ type: "text" as const, text: JSON.stringify({
          id,
          filename,
          size: meta.size,
          tags: meta.tags,
          knowledgeType: meta.knowledgeType,
          blobKey: meta.blobKey,
        }) }],
      };
    }
  );

  server.tool(
    "list_knowledge_graphs",
    "List all knowledge graph files in the knowledge base (JSON files with nodes + edges structure).",
    {},
    async () => {
      const files = auth.kind === "admin"
        ? await listAllFilesAdmin()
        : await listAllFiles(auth.ctx);
      const graphs = files.filter(f => f.knowledgeType === 'knowledge_graph');
      return {
        content: [{ type: "text" as const, text: JSON.stringify(graphs.map(f => ({
          id: f.id,
          filename: f.filename,
          size: f.size,
          tags: f.tags,
          uploadedAt: f.uploadedAt,
        }))) }],
      };
    }
  );

  // Large-file upload: returns a Vercel Blob client token + instructions for
  // direct upload, bypassing MCP's base64/payload size limits entirely.
  // After the upload completes, Vercel Blob calls /api/mcp/upload-token
  // (phase 2 webhook) which inserts the FileMetadata atomically — no separate
  // register call needed.
  server.tool(
    "get_upload_token",
    "Get a Vercel Blob client token for uploading a large file (>4 MB) directly to the knowledge base. Returns the token and a curl command to PUT the file. The database registration happens automatically via webhook when the upload completes.",
    {
      filename:      z.string().describe("Filename to store, e.g. 'report.pdf'"),
      contentType:   z.string().describe("MIME type, e.g. 'application/pdf'"),
      size:          z.number().describe("File size in bytes"),
      tags:          z.array(z.string()).optional().describe("Optional tags. 'mcp' is always added."),
      team:          z.string().optional().describe("Team ID. Omit for personal KB."),
      knowledgeType: z.enum(['knowledge_graph', 'session', 'idea_list', 'document']).optional().describe("Semantic type of the file. Auto-detected from filename if omitted."),
    },
    async ({ filename, contentType, size, tags, team, knowledgeType: hintKnowledgeType }) => {
      if (auth.kind !== "user") {
        return {
          content: [{ type: "text" as const, text: JSON.stringify({ error: "get_upload_token requires user OAuth token, not admin MCP_SECRET." }) }],
          isError: true,
        };
      }

      // Fix #3: enforce size cap before issuing a token. The upload-token
      // endpoint enforces this too via maximumSizeInBytes, but failing here
      // gives a clear error before making any outbound call.
      const MAX_UPLOAD_BYTES = 500 * 1024 * 1024; // 500 MB
      if (size > MAX_UPLOAD_BYTES) {
        return {
          content: [{ type: "text" as const, text: JSON.stringify({ error: `File too large. Maximum upload size is ${MAX_UPLOAD_BYTES / 1024 / 1024} MB.` }) }],
          isError: true,
        };
      }

      const id = crypto.randomUUID();
      const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, "_");
      const pathname = `users/${auth.ctx.userId}/files/${id}-${safeName}`;
      // Fix #2: NEXT_PUBLIC_* vars are baked in at build time — wrong on preview
      // deploys. VERCEL_URL is the correct runtime deployment URL on Vercel.
      const baseUrl =
        process.env.NEXT_PUBLIC_BASE_URL
        ?? (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://www.perea.ai");
      const uploadTokenUrl = `${baseUrl}/api/mcp/upload-token`;

      const clientPayload = JSON.stringify({
        id,
        filename,
        size,
        tags: tags ?? [],
        teamId: team ?? null,
      });

      const resolvedKnowledgeType = hintKnowledgeType ?? detectKnowledgeTypeFromFilename(filename);
      const serverPayload = JSON.stringify({
        id,
        userId: auth.ctx.userId,
        uploadedBy: "mcp",
        filename,
        size: Math.min(size, MAX_UPLOAD_BYTES),
        tags: tags ?? [],
        teamId: team ?? null,
        knowledgeType: resolvedKnowledgeType,
      });

      const requestBody: HandleUploadBody = {
        type: "blob.generate-client-token",
        payload: { pathname, multipart: false, clientPayload },
      };

      let clientToken: string;
      try {
        const result = await handleUpload({
          body: requestBody,
          request: new Request(uploadTokenUrl, { method: "POST" }),
          onBeforeGenerateToken: async () => ({
            access: "private",
            callbackUrl: uploadTokenUrl,
            allowOverwrite: false,
            maximumSizeInBytes: MAX_UPLOAD_BYTES,
            tokenPayload: serverPayload,
          }),
          onUploadCompleted: async () => {},
        });
        clientToken = (result as { clientToken: string }).clientToken;
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Token generation failed";
        return {
          content: [{ type: "text" as const, text: JSON.stringify({ error: msg }) }],
          isError: true,
        };
      }

      const uploadParams = new URLSearchParams({ pathname });
      const uploadApiUrl = `https://vercel.com/api/blob/?${uploadParams.toString()}`;

      return {
        content: [{ type: "text" as const, text: JSON.stringify({
          id,
          pathname,
          clientToken,
          uploadUrl: uploadApiUrl,
          curlCommand: [
            `curl -X PUT "${uploadApiUrl}"`,
            `  -H "Authorization: Bearer ${clientToken}"`,
            `  -H "x-api-version: 12"`,
            `  -H "Content-Type: ${contentType}"`,
            `  -H "x-vercel-blob-access: private"`,
            `  --data-binary @<local-file-path>`,
          ].join(" \\\n"),
          note: "After the PUT completes, the file is automatically registered in the knowledge base. No separate step needed.",
        }) }],
      };
    }
  );

  server.tool(
    "add_url",
    "Fetch a public URL, convert it to Markdown, and save it to the knowledge base. Returns the stored file metadata.",
    {
      url:  z.string().describe("The public URL to fetch and convert, e.g. 'https://example.com/article'"),
      tags: z.array(z.string()).optional().describe("Optional tags. 'mcp' is always added."),
      team: z.string().optional().describe("Team ID to upload into. Omit for personal KB."),
    },
    async ({ url, tags, team }) => {
      if (auth.kind !== "user") {
        return {
          content: [{ type: "text" as const, text: JSON.stringify({ error: "add_url requires user OAuth token, not admin MCP_SECRET." }) }],
          isError: true,
        };
      }

      if (team) {
        const access = await checkTeamAccess(team, auth.ctx.userId, "editor");
        if (!access.ok) {
          const error = access.reason === "not_member" ? "Not a member of this team." : "Viewers cannot upload files.";
          return { content: [{ type: "text" as const, text: JSON.stringify({ error }) }], isError: true };
        }
      }

      let converted: Awaited<ReturnType<typeof fetchAndConvert>>;
      try {
        converted = await fetchAndConvert(url);
      } catch (err) {
        const msg = err instanceof UrlConvertError ? err.message : "Failed to fetch or convert URL";
        return {
          content: [{ type: "text" as const, text: JSON.stringify({ error: msg }) }],
          isError: true,
        };
      }

      const id = crypto.randomUUID();
      const safeName = converted.filename.replace(/[^a-zA-Z0-9._-]/g, "_");
      const blobPath = `users/${auth.ctx.userId}/files/${id}-${safeName}`;

      const blobResult = await put(blobPath, converted.markdown, {
        access: "private",
        contentType: "text/markdown",
        addRandomSuffix: false,
      });

      const normalizedTags = [...new Set(["mcp", ...(tags ?? [])])];

      const meta: FileMetadata = {
        id,
        filename: converted.filename,
        blobKey: blobResult.pathname,
        blobUrl: blobResult.url,
        size: converted.byteSize,
        contentType: "text/markdown",
        uploadedBy: "mcp",
        uploadedAt: new Date().toISOString(),
        tags: normalizedTags,
        userId: auth.ctx.userId,
        teamId: team ?? null,
        knowledgeType: 'document',
      };

      await insertFile(meta);

      return {
        content: [{ type: "text" as const, text: JSON.stringify({
          id,
          filename: converted.filename,
          title: converted.title,
          size: converted.byteSize,
          tags: normalizedTags,
          blobKey: blobResult.pathname,
        }) }],
      };
    }
  );

  server.tool(
    "update_tags",
    "Update tags on a knowledge base file by ID. Replaces all existing tags. Useful for tagging sessions by topic (e.g. 'unifounder', '999x', 'marketing').",
    {
      id:   z.string().describe("File ID to update"),
      tags: z.array(z.string()).describe("New tags — replaces existing tags entirely"),
    },
    async ({ id, tags }) => {
      let updated: Awaited<ReturnType<typeof updateTags>>;
      if (auth.kind === "admin") {
        const file = await findFileByIdAdmin(id);
        if (!file) {
          return {
            content: [{ type: "text" as const, text: JSON.stringify({ error: `Not found: ${id}` }) }],
            isError: true,
          };
        }
        updated = await updateTags(id, tags, { userId: file.userId });
      } else {
        updated = await updateTags(id, tags, auth.ctx);
      }

      if (!updated) {
        return {
          content: [{ type: "text" as const, text: JSON.stringify({ error: `Not found or not authorized: ${id}` }) }],
          isError: true,
        };
      }

      return {
        content: [{ type: "text" as const, text: JSON.stringify({
          id: updated.id,
          filename: updated.filename,
          tags: updated.tags,
        }) }],
      };
    }
  );

  // ── Innovation Loop tools ──────────────────────────────────────────────────

  server.tool(
    "start_experiment",
    `Log an entry to the experiment tracker. The tracker enforces the Validated Learning Taxonomy:
- L0 = operational fix / bug fix / refactor (NOT a hypothesis test). Only 'description' is required.
- L1 = discovery experiment (tests a belief about user behavior, market, demand). Requires the full 6-slot falsifiable hypothesis.
- L2 = optimization A/B test on live product. Same 6-slot statement, hypothesis_class is optional.

For L1/L2, the hypothesis must be a specific change tested against a specific user segment, producing a specific behavior, measurable by a specific metric reaching a specific threshold within a specific timeframe, with a kill criterion. If you cannot fill all six slots, route as L0 instead.`,
    {
      loop_class:       z.enum(["L0", "L1", "L2"]).describe("L0 = ops fix (no learning); L1 = discovery test; L2 = optimization A/B"),
      hypothesis:       z.string().describe("For L1/L2: 'We believe that [change] for [segment] will result in [behavior]'. For L0: brief description of what was fixed."),
      project_tag:      z.string().optional().describe("Project context, e.g. 'perea-ai', 'unifounder', '999x'"),
      session_id:       z.string().optional().describe("CLAUDE_SESSION_ID linking this entry to the current Claude Code session"),
      // Required for L1/L2:
      risk_dimension:   z.enum(["VAL", "USA", "FEA", "VIA"]).optional().describe("Cagan's Four Risks: Value/Usability/Feasibility/Viability"),
      hypothesis_class: z.enum(["VAL-H", "GRO-H"]).optional().describe("L1 only: Value hypothesis (does product deliver value?) or Growth hypothesis (how do users discover?)"),
      aarrr_stage:      z.enum(["ACQ", "ACT", "RET", "REF", "REV"]).optional().describe("McClure's funnel stage"),
      evidence_method:  z.enum(["INT", "OBS", "FAK", "CON", "WOZ", "AB", "PAY"]).optional().describe("Interview/Observation/FakeDoor/Concierge/WizardOfOz/A-B/Payment"),
      segment:          z.string().optional().describe("Specific user segment being tested (not 'everyone')"),
      behavior:         z.string().optional().describe("Specific user behavior expected"),
      metric:           z.string().optional().describe("Specific metric that captures the behavior"),
      threshold:        z.string().optional().describe("Numeric threshold the metric must hit"),
      timeframe:        z.string().optional().describe("Time window for the test (≤ 7 days)"),
      kill_threshold:   z.string().optional().describe("Numeric threshold below which the experiment is killed"),
    },
    async (args) => {
      try {
        const id = generateExperimentId();
        const exp = await createExperiment({
          id,
          hypothesis: args.hypothesis,
          loop_class: args.loop_class,
          project_tag: args.project_tag,
          session_id: args.session_id,
          risk_dimension: args.risk_dimension,
          hypothesis_class: args.hypothesis_class,
          aarrr_stage: args.aarrr_stage,
          evidence_method: args.evidence_method,
          segment: args.segment,
          behavior: args.behavior,
          metric: args.metric,
          threshold: args.threshold,
          timeframe: args.timeframe,
          kill_threshold: args.kill_threshold,
        });
        return {
          content: [{ type: "text" as const, text: JSON.stringify({
            id: exp.id,
            loop_class: exp.loop_class,
            hypothesis: exp.hypothesis,
            project_tag: exp.project_tag,
            started_at: exp.started_at,
            message: exp.loop_class === "L0"
              ? `Logged as L0 (ops fix, not a hypothesis test). id=${exp.id}`
              : `Experiment started. Use id '${exp.id}' to ship, log signals, or close the loop.`,
          }) }],
        };
      } catch (err) {
        return { content: [{ type: "text" as const, text: JSON.stringify({
          error: err instanceof Error ? err.message : String(err),
          hint: "If you cannot provide segment/metric/threshold/timeframe/kill_threshold, route as loop_class='L0' instead — that means it's an ops fix, not a hypothesis test.",
        }) }], isError: true };
      }
    }
  );

  server.tool(
    "ship_experiment",
    "Mark an experiment as shipped — something is now in front of real users. Records the timestamp for cycle time calculation.",
    {
      id: z.string().describe("Experiment ID returned by start_experiment"),
    },
    async ({ id }) => {
      try {
        const exp = await markShipped(id);
        if (!exp) return { content: [{ type: "text" as const, text: JSON.stringify({ error: `Experiment not found or already shipped: ${id}` }) }], isError: true };
        return {
          content: [{ type: "text" as const, text: JSON.stringify({
            id: exp.id,
            shipped_at: exp.shipped_at,
            message: "Shipped. Now wait for signals from reality before closing the loop.",
          }) }],
        };
      } catch (err) {
        return { content: [{ type: "text" as const, text: JSON.stringify({ error: String(err) }) }], isError: true };
      }
    }
  );

  server.tool(
    "log_signal",
    "Log a real-world signal (user feedback, usage observation, DM, call insight) for an experiment. Use this whenever reality speaks.",
    {
      experiment_id: z.string().describe("Experiment ID the signal relates to"),
      source:        z.string().describe("Signal source: 'dm', 'usage', 'observation', 'call', 'review', 'analytics'"),
      content:       z.string().describe("What was observed or said — verbatim or paraphrased"),
    },
    async ({ experiment_id, source, content }) => {
      try {
        const row = await insertSignal(experiment_id, source, content);
        return {
          content: [{ type: "text" as const, text: JSON.stringify({
            signal_id: row.id,
            experiment_id,
            source,
            message: "Signal logged.",
          }) }],
        };
      } catch (err) {
        return { content: [{ type: "text" as const, text: JSON.stringify({ error: String(err) }) }], isError: true };
      }
    }
  );

  server.tool(
    "close_experiment",
    `Close an experiment with the structured Validated Learning Taxonomy (Axis 7).

Required:
- verdict: 'win' (hypothesis validated) | 'kill' (hypothesis refuted)
- implication: PERSEVERE | PIVOT | KILL | DOUBLE-DOWN — what does this result imply for the next move?
- learning: ONE sentence "we learned that …"
- confidence: HIGH (≥10 paying users / triangulated / statistical) | MEDIUM (3-9 users) | LOW (1-2 users / single weak method)
- generalizes_to: THIS-ONLY | SEGMENT | MARKET | UNIVERSAL — how widely does this learning apply?
- pivot_type (only if implication=PIVOT): Customer-Segment | Customer-Need | Channel | Pricing | Value-Prop | Zoom-In | Zoom-Out | Tech | Platform | Business-Model

Unless implication=KILL, the system auto-spawns a draft "next bet" L1 experiment generated by LLM from the closed experiment + learning + implication. The draft is_implied=true and is_draft=true; promote in the dashboard before it counts.`,
    {
      id:              z.string().describe("Experiment ID to close"),
      verdict:         z.enum(["win", "kill"]).describe("win = validated, kill = refuted"),
      implication:     z.enum(["PERSEVERE", "PIVOT", "KILL", "DOUBLE-DOWN"]).describe("What this result implies for the next move"),
      learning:        z.string().describe("One sentence: we learned that …"),
      confidence:      z.enum(["HIGH", "MEDIUM", "LOW"]).describe("Confidence in the learning based on sample size and evidence method"),
      generalizes_to:  z.enum(["THIS-ONLY", "SEGMENT", "MARKET", "UNIVERSAL"]).describe("How widely the learning applies"),
      pivot_type:      z.enum(["Customer-Segment", "Customer-Need", "Channel", "Pricing", "Value-Prop", "Zoom-In", "Zoom-Out", "Tech", "Platform", "Business-Model"]).optional().describe("Required when implication=PIVOT"),
      generate_next_bet: z.boolean().optional().describe("Default true unless implication=KILL"),
    },
    async ({ id, verdict, implication, learning, confidence, generalizes_to, pivot_type, generate_next_bet }) => {
      try {
        if (implication === "PIVOT" && !pivot_type) {
          return { content: [{ type: "text" as const, text: JSON.stringify({ error: "pivot_type is required when implication=PIVOT" }) }], isError: true };
        }
        const closed = await closeWithStructure({ id, verdict, implication, learning, confidence, generalizes_to, pivot_type });
        if (!closed) return { content: [{ type: "text" as const, text: JSON.stringify({ error: `Experiment not found: ${id}` }) }], isError: true };

        let draft_id: string | null = null;
        const wantDraft = (generate_next_bet ?? true) && implication !== "KILL";
        if (wantDraft) {
          const seed = await generateNextBetDraft({ closed, implication, learning, pivot_type }).catch(() => null);
          if (seed) {
            draft_id = generateExperimentId();
            await createDraftExperiment({ id: draft_id, ...seed, parent_experiment_id: closed.id });
            await setNextBetId(closed.id, draft_id);
          }
        }
        return {
          content: [{ type: "text" as const, text: JSON.stringify({
            id: closed.id,
            outcome: closed.outcome,
            implication: closed.implication,
            confidence: closed.confidence,
            generalizes_to: closed.generalizes_to,
            pivot_type: closed.pivot_type,
            cycle_hours: closed.shipped_at
              ? Math.round((new Date(closed.shipped_at).getTime() - new Date(closed.started_at).getTime()) / 36e5 * 10) / 10
              : null,
            next_bet_draft_id: draft_id,
            message: draft_id
              ? `Loop closed. Draft next bet '${draft_id}' generated — promote it from the dashboard.`
              : "Loop closed. No next-bet draft (implication=KILL or skipped).",
          }) }],
        };
      } catch (err) {
        return { content: [{ type: "text" as const, text: JSON.stringify({ error: String(err) }) }], isError: true };
      }
    }
  );

  server.tool(
    "get_velocity",
    "Get innovation velocity stats: experiments started today, this week, average idea-to-shipped cycle time, and validation rate.",
    {},
    async () => {
      try {
        const stats = await getVelocityStats();
        const valRate = stats.strong_validation_rate != null ? `${(stats.strong_validation_rate * 100).toFixed(0)}%` : "—";
        const avgHours = stats.avg_cycle_hours != null ? `${stats.avg_cycle_hours}h` : "—";
        return {
          content: [{ type: "text" as const, text: JSON.stringify({
            velocity_today: stats.velocity_today,
            velocity_week: stats.velocity_week,
            avg_cycle_hours: stats.avg_cycle_hours,
            validation_rate: stats.strong_validation_rate,
            summary: `This week: ${stats.velocity_week} experiments · ${avgHours} avg cycle · ${valRate} validated`,
          }) }],
        };
      } catch (err) {
        return { content: [{ type: "text" as const, text: JSON.stringify({ error: String(err) }) }], isError: true };
      }
    }
  );

  return server;
}

async function trackMcpCall(reqClone: Request, auth: Exclude<AuthResult, { kind: "error" }>): Promise<void> {
  try {
    const body = await reqClone.json();
    if (body?.method === "tools/call") {
      const toolName = body.params?.name ?? "unknown";
      const distinctId = auth.kind === "user" ? auth.ctx.userId : "mcp-admin";
      captureServerEvent(distinctId, "mcp_tool_call", {
        tool_name: toolName,
        auth_kind: auth.kind,
      });
    }
  } catch {
    // non-JSON or listing request — not a tool call
  }
}

async function handle(request: Request): Promise<Response> {
  const authResult = await resolveAuth(request);
  if (authResult.kind === "error") return authResult.response;

  const reqClone = request.clone();

  const server = buildServer(authResult);
  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
  });
  await server.connect(transport);
  const response = await transport.handleRequest(request);
  await server.close();

  void trackMcpCall(reqClone, authResult);

  return response;
}

export const POST = handle;
export const GET = handle;
export const DELETE = handle;

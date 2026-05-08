---
title: "The MCP Server Playbook for SaaS Founders"
subtitle: "Engineering, distribution, security, and monetization for the protocol that 30% of enterprise app vendors will ship in 2026 — synthesized from 100+ primary sources, production case studies, and the OWASP MCP Top 10."
publication: "perea.ai Research"
authors: ["Dante Perea"]
version: "1.0"
status: "Public draft"
date: "2026-05-06T21:41"
audience: "SaaS founders, engineering leaders, and product owners shipping an MCP server in 2026"
length: "~9,200 words"
license: "CC BY 4.0"
description: "The canonical playbook for shipping a high-quality MCP server as a SaaS distribution channel: architecture, tool design, OAuth 2.1, security, governance, observability, distribution, and monetization."
profile: "technical-playbook"
---

# Foreword

In November 2024, Anthropic open-sourced a small protocol with a modest framing: a clean, JSON-RPC-based way to connect AI assistants to the systems where data and work actually live. Within seventeen months, the Model Context Protocol crossed the threshold from emerging standard to industry default. Every frontier lab ships client support. The public registry passed 9,400 servers. SDK downloads crossed 97 million per month. Forrester predicts that 30% of enterprise application vendors will ship their own MCP servers in 2026.

This is the second time in twenty years a single protocol has rewired how software gets distributed. The first was the REST API, after the iPhone made client-side JavaScript an acceptable runtime. The second is MCP, after large language models made structured tool-use the default consumption pattern for software services.

For a SaaS founder in 2026, this rewiring is both the largest single distribution opportunity available and the largest single pricing-model risk. Every product decision you've made — per-seat pricing, dashboard-first UX, sales-led onboarding, integration partnerships — was optimized for human buyers reading screens. Agent buyers are different. They don't read screens. They don't accept friction. They evaluate every transaction. They preferentially choose products with the cleanest protocol surface, the most transparent pricing, and the lowest cognitive cost per call.

Building an MCP server is not a feature release. It is a distribution-channel decision with the same gravity as a mobile app launch in 2009 or a public API release in 2012. The teams that treat it as such — staffing it, governing it, instrumenting it, monetizing it — will own their categories in the agent economy. The teams that treat it as a sprint deliverable will ship a server that nobody uses, blame the protocol, and watch a competitor with sharper execution take their seat.

This paper is the playbook for treating it correctly. It covers the eight decisions that matter most: architecture, tool design, authentication, security, governance, observability, distribution, and monetization. It is grounded in the production deployments at Block, Stripe, GitHub, Cloudflare, Atlassian, Microsoft, and the dozens of post-mortems and security disclosures that the ecosystem has generated since launch. It is opinionated where the data is clear, agnostic where it is not, and honest about both.

— *perea.ai Research*

---

# Executive Summary

**The thesis.** Shipping an MCP server is a distribution-channel decision, not a feature decision. SaaS teams that ship a high-quality MCP server in 2026 capture the early-mover share of a category that is forming once and for the next decade. Teams that ship a low-quality MCP server — auto-generated tools, leaky auth, no observability, no monetization — actively damage their position because agents downrank unreliable servers and rarely re-evaluate them.

**The evidence.**

- **Adoption velocity.** MCP grew from ~100K monthly SDK downloads in November 2024 to 97M in March 2026 — a 970× increase in 18 months. Every major AI provider — Anthropic, OpenAI, Google, Microsoft, Amazon, Block — supports MCP as a client. (DigitalApplied; Optijara; Metosys.)
- **Enterprise readiness.** 78% of enterprise AI teams report at least one MCP-backed agent in production by Q1 2026, up from 31% twelve months earlier. 89% adoption among teams with 250+ AI engineers. (DigitalApplied.)
- **Vendor commitment.** Forrester predicts 30% of enterprise application vendors will launch their own MCP servers in 2026. Stripe, Block, GitHub, Cloudflare, Atlassian, Microsoft (Dynamics 365 Finance & Operations, Business Central, Fabric), Sentry, Linear, Asana, PayPal, Webflow, Intercom — all in production. (Forrester; Cloudflare MCP Demo Day.)
- **Distribution gap.** Of ~19,000 MCP servers in the public ecosystem, fewer than 5% are monetized. The gap between "exists" and "earns" is the opportunity. (Godberry Studios; MCP Hive.)
- **Cross-provider standardization.** Tool definitions written for MCP work across Claude, ChatGPT, Gemini, Cursor, Copilot, and any other compliant client. The integration tax that made multi-provider AI deployments expensive collapses at the MCP layer. (DigitalApplied.)

**The eight decisions every SaaS founder must make, in order.**

1. **Architecture.** Stateful (Durable Objects, McpAgent) vs. stateless (createMcpHandler, mcp-handler). Local stdio vs. remote Streamable HTTP. The right answer depends on whether your tools require per-session state and whether you're a desktop app augmentation or a SaaS extension.
2. **Tool design.** The single highest-leverage decision. Tool descriptions are agent-facing UX. Bad descriptions cause 3-4× higher failure rates than well-structured ones. Anthropic's testing shows 1-5 realistic examples per tool raise accuracy from 72% to 90%.
3. **Authentication.** OAuth 2.1 with mandatory PKCE (S256), Protected Resource Metadata at `/.well-known/oauth-protected-resource`, Dynamic Client Registration, and RFC 8707 resource indicators. API keys are a non-starter for production.
4. **Security.** The OWASP MCP Top 10 — tool poisoning, prompt injection, rug-pulls, command injection, scope creep, supply chain — are real, not theoretical. Stripe's CVE-2025-5277 (command injection in aws-mcp-server) and the Invariant Labs disclosure against the official GitHub MCP server are inflection points.
5. **Governance.** Multi-tenant isolation (process-per-tenant or shared with namespace), comprehensive audit logging, zero-data-retention pass-through architecture for SOC 2 / GDPR / HIPAA compliance, and policy-as-code enforcement.
6. **Observability.** mcp-eval, MCPJam, mcpchecker for evaluation. OpenTelemetry traces. Per-tool metrics on TPR, FPR, precision, token usage, success rate. CI gates. Without these, you cannot iterate the tool design loop that determines whether agents actually choose your server.
7. **Distribution.** Official MCP Registry first, then PulseMCP / Smithery / Glama / MCP.so / awesome-mcp-servers. Each has a different audience and submission flow. Auto-publish via CI/CD because manual maintenance does not scale.
8. **Monetization.** Per-call (FluxA, AgentPay, ATXP, AgenticMarket), subscription, freemium, outcome-based. x402 stablecoin or Stripe Machine Payments Protocol for agent-native settlement. Marketplaces typically take 10-20% revenue share; self-hosted billing yields ~95% but requires real engineering.

**The operator math.** A first version of a high-quality SaaS MCP server, executed by a single engineer with the playbook below, is a 2-week build to first production tool, a 60-day path to commercial-grade authentication and observability, and a 90-day path to monetization. The infrastructure cost is negligible (Cloudflare Workers free tier, Vercel free tier). The compounding asset is real: every tool call generates structured agent-intent data nobody else can capture.

---

# Part I: Why MCP, Why Now

## Adoption velocity is unprecedented

The Model Context Protocol's adoption curve is the steepest seen for an integration protocol since the public REST API. Anthropic's open-sourcing in November 2024 began with roughly 100,000 monthly SDK downloads. By March 2026, that figure had crossed 97 million — a 970× expansion in 16 months. The closest comparable curve is npm in 2014–2016. (DigitalApplied; Metosys.)

The growth is not driven by hobbyist activity. The public MCP server registry reached 9,400+ entries in mid-April 2026, up from 6,800 at year-end 2025 and 1,200 at the end of Q1 2025 — a 7.8× year-over-year expansion against the Q1 2025 baseline, with month-over-month growth in Q1 2026 holding steady at +18%. Among enterprise AI teams (50+ AI/ML practitioners), 78% report at least one MCP-backed agent in production as of Q1 2026, up from 31% a year earlier. The figure for teams with 250+ AI engineers is 89%. (DigitalApplied; Optijara.)

The cross-provider standardization is the load-bearing factor. Every major lab — Anthropic, OpenAI, Google DeepMind, Microsoft, Amazon Web Services, Block — has committed to or implemented MCP support. This is historically rare. Each prior generation of integration protocols (OAuth 2.0 in 2010s, REST in early 2010s) took several years to reach the level of cross-vendor commitment MCP achieved in twelve months. (DigitalApplied; ModelContextProtocol.io.)

For a SaaS team, this means one integration. The MCP server you ship is callable from Claude Desktop, Claude Code, ChatGPT, Cursor, Windsurf, VS Code Copilot, GitHub Copilot, Gemini, custom agents built on the OpenAI Agents SDK, custom agents built on Anthropic's SDK, and any new client that ships in the next 24 months. The integration tax that previously required a separate adapter for each AI vendor — or, more commonly, no integration at all — collapses to a single `tools/list` JSON-RPC contract. (DigitalApplied A2A guide; OpenAI Agents JS docs.)

## The vendor landscape is fully populated

The major SaaS platforms have already shipped MCP servers and treat them as production infrastructure, not experiments:

- **Stripe** ships an Agent Toolkit and an Agentic Commerce Suite; the Stripe Minions internal coding system runs through a 400-tool MCP server called Toolshed and merges 1,000+ pull requests per week with no human-written code (Engineering.fyi Stripe; Medium Valdez Ladd; rywalker Stripe Minions).
- **Block** runs Goose — the open-source coding agent forked by Stripe — and built 100+ internal MCP servers; 12,000 employees across 15 job functions use Goose, and 75% of engineers report saving 8-10 hours/week (All Things Open; engineering blog).
- **GitHub** ships an official MCP server and is one of the four named maintainers of the official MCP Registry (alongside Anthropic, PulseMCP, and Microsoft) (modelcontextprotocol.io Registry).
- **Cloudflare** ships a fleet of 14+ domain-specific MCP servers — Documentation, Workers Bindings, Workers Builds, Observability, Radar, Browser Rendering, AI Gateway, Audit Logs, DNS Analytics, CASB, GraphQL — plus the McpAgent SDK for building MCP servers on Workers (cloudflare/mcp-server-cloudflare; Cloudflare Agents docs).
- **Microsoft** ships Dynamics 365 ERP MCP, Business Central MCP, Fabric Local MCP (GA), Fabric Remote MCP (preview), Microsoft Learn MCP, and the Microsoft MCP Server for Enterprise (preview, Entra/Graph) (Microsoft Learn; Microsoft Fabric Blog).
- **Atlassian** ships an Atlassian Remote MCP Server for Jira and Confluence Cloud, hosted on Cloudflare (Cloudflare MCP Demo Day).
- **PayPal, Sentry, Linear, Asana, Intercom, Webflow** all shipped remote MCP servers as part of the May 2025 MCP Demo Day cohort (Cloudflare MCP Demo Day).

For a SaaS founder, the implication is not that the field is closed — it's that the standard has crystallized. Building an MCP server in 2026 is no longer a bet on whether the protocol will matter. It's a tactical choice about implementation quality.

## The window for a high-quality first version

Forrester predicts 30% of enterprise application vendors will launch their own MCP servers in 2026. Today the figure is roughly 5% by most counts. The 25-percentage-point gap between today and end-of-year is the window.

The window is not "be first to ship something." Many vendors will ship low-quality MCP servers (auto-generated from Swagger, no auth, vague tool descriptions, no observability) and immediately discover that agents don't preferentially recommend them. The window is "be first to ship a *high-quality* MCP server in your category" — one that handles edge cases, has clear tool descriptions, ships with OAuth 2.1, exposes evaluation metrics, lists in registries, and integrates with one of the agent-native billing rails.

The teams that close this gap correctly capture compounding advantages: agent-mediated traffic generates structured agent-intent data nobody else has; tool-call success rates compound into preferential ranking; documentation that gets indexed into AI training corpora compounds into citation rates that are hard to displace.

---

# Part II: Architecture Decisions

The first technical decision is the deployment shape. The MCP specification (current version: 2025-11-25, with prior stable versions 2025-06-18 and 2025-03-26) defines two transports: **stdio** for local subprocess communication, and **Streamable HTTP** for remote servers. The HTTP+SSE transport from the November 2024 spec is deprecated. (modelcontextprotocol.io transports; Microsoft mcp-for-beginners.)

## stdio vs. Streamable HTTP

| Dimension | stdio | Streamable HTTP |
|---|---|---|
| Deployment | Local subprocess launched by the host | Independent HTTP server, multi-client |
| Use case | Desktop apps (Claude Desktop, Cursor), CLI tools | SaaS extensions, multi-tenant deployments |
| Auth | Trusts host process | OAuth 2.1 + PKCE required for production |
| Observability | stderr logging | Standard HTTP/OpenTelemetry stack |
| Performance | No network overhead | Sub-100ms with proper deployment |
| Sessions | Single-client | Optional multi-session via Mcp-Session-Id header |
| Distribution | npm/Docker/PyPI binary; client config file | Public URL clients connect to |

For SaaS, the answer is almost always Streamable HTTP. stdio is appropriate when your "server" is a CLI tool already distributed to developers (Filesystem, Git, GitHub CLI), or when the user-controlled execution context requires it (Claude Desktop's local-first model). Anything that wraps your hosted SaaS API should be Streamable HTTP, hosted at a public URL. (modelcontextprotocol.io transports; OpenAI Agents JS docs.)

A small but important detail: the Streamable HTTP server *must* expose a single endpoint that supports both POST (for client-to-server messages) and GET (for SSE streams) at the same path. Servers MUST validate the `Origin` header to prevent DNS rebinding attacks. When running locally, servers SHOULD bind only to 127.0.0.1, not 0.0.0.0. (modelcontextprotocol.io transports; Toolradar deploy.)

## Stateful vs. stateless

For Streamable HTTP, the second architecture decision is whether your server holds per-session state.

**Stateless** (recommended starting point for most SaaS).
- Use `createMcpHandler` (Cloudflare Agents SDK) or `mcp-handler` (Vercel) on Cloudflare Workers, Vercel Functions, AWS Lambda, or any standard serverless runtime.
- A new MCP server instance is created per request.
- All authentication and authorization comes from the bearer token; tools call your existing REST API for state.
- Simplest to operate. No session-management bugs. Scales horizontally without coordination.

**Stateful** (use when tools genuinely require per-session context).
- Use `McpAgent` (Cloudflare, backed by Durable Objects) for built-in state, SQL, elicitation, and WebSocket hibernation, or roll your own session management with Redis-backed sessions.
- Each user session gets its own SQL-backed instance with persistent state.
- Tools can call `setState`, react to `onStateChanged`, run SQL on an embedded database, and request elicited input from the user mid-call.
- Enables conversational tools (multi-turn forms, in-progress wizard state, context that survives across calls).
- Operationally heavier — Durable Objects pricing applies, and session lifecycle requires explicit cleanup logic.

The Cloudflare Agents SDK ships both patterns side-by-side and is the cleanest reference implementation for either. The McpAgent class extends Agent, exposes `state`, `setState`, `onStateChanged`, `sql`, `props` (for OAuth identity), and `elicitInput` for human-in-the-loop, and ships with `McpAgent.serve(path)` for one-line deployment with both Streamable HTTP and legacy SSE transports. (Cloudflare McpAgent docs; Cloudflare skills mcp.md; PropelAuth Cloudflare guide.)

For Vercel deployments, the equivalent stack is `mcp-handler` (formerly `@vercel/mcp-adapter`) with Vercel Functions on Fluid Compute. Customers report 90%+ savings versus traditional serverless on Vercel for MCP workloads because Fluid handles the long-idle-then-burst pattern characteristic of MCP traffic. (Vercel MCP server support; Vercel deploy MCP docs.)

## The 14-line skeleton

The architecture decisions above collapse to a small amount of code. A complete stateless Streamable HTTP MCP server on Cloudflare Workers, with a real tool, is roughly 14 lines:

```ts
import { createMcpHandler } from "agents/mcp";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

const server = new McpServer({ name: "my-server", version: "1.0.0" });
server.registerTool("get_status", {
  description: "Check the status of a service. Returns uptime, version, and last-incident timestamp.",
  inputSchema: { service: z.string() },
}, async ({ service }) => {
  const data = await fetch(`https://api.example.com/status/${service}`).then(r => r.json());
  return { content: [{ type: "text", text: JSON.stringify(data) }] };
});

export default { fetch: (req, env, ctx) => createMcpHandler(server)(req, env, ctx) };
```

The equivalent on Vercel as a Next.js App Router file is similar in length. The skeleton is not the hard part; the hard part is what comes next.

---

# Part III: The Tool Design Playbook

The tool design layer is where most MCP servers fail. Authentication is mostly solved by libraries. Distribution is mostly solved by registries. But tool design — the words you use, the schemas you ship, the failure modes you handle — is where the model decides whether to call your tool, and whether to keep calling it.

Anthropic's guidance is the canonical source: a single tool's description has the largest impact on tool-call accuracy of any variable in the system. Their internal testing shows 1-5 realistic examples per tool raise accuracy from 72% to 90%. (modelcontextprotocol.info Effective Tools; AgentPatterns Tool Schema Standards.)

## The eight tool-design rules

**Rule 1: One tool per distinct action. Avoid mode parameters.** A single tool that accepts a `mode` parameter (`"read"`, `"write"`, `"list"`, `"search"`) forces the model to navigate a complex decision tree inside a single tool. Separate tools with clear names are better. Apigene, ChatForest, Axiom Studio, AgentPatterns, and Anthropic's own guide all converge on this. (Apigene; ChatForest; AgentPatterns server design; Axiom Studio.)

**Rule 2: Action-oriented, snake_case names.** `search_logs`, `book_consultation`, `submit_quote_request`. Not `email`, `data`, `api`, or `helper`. Pick a verb-noun pattern and apply it consistently. (Leanmcp; Inovaflow; Workato.)

**Rule 3: Treat the description as agent-facing UX.** Three parts:
1. What it does — one sentence with a specific verb.
2. Required context and constraints — what the tool needs, what limits it has.
3. When to use it vs. alternatives — explicit disambiguation from sibling tools.

Concrete example (from Axiom Studio's playbook, lightly adapted):

> Search file contents using regex patterns. Returns up to 100 matches. For larger result sets, use a more specific pattern or target a subdirectory with the path parameter. Searches are case-sensitive by default; use `(?i)` prefix for case-insensitive matching. For finding files by name rather than content, use `find_files` instead.

This description does five things: states the action, specifies the limit, gives a guidance hint, surfaces a constraint, and steers to an alternative tool when appropriate. Bad descriptions cause 3-4× higher failure rates than this kind of structure. (Axiom Studio; Apigene.)

**Rule 4: Every parameter needs a description.** The model reads parameter descriptions to populate arguments. A bare `user` parameter is ambiguous; `user_id` with description `"Unique identifier for the user — must be a valid UUID v4"` is unambiguous. Use enums where applicable. State formats explicitly (ISO 8601 timestamps, RFC 5322 emails, GTIN-13 product codes). (AgentPatterns server design; Inovaflow; Anthropic.)

**Rule 5: Keep schemas flat. Avoid `$ref` and `oneOf`.** Optional fields, `$ref` combinations, and complex enum handling vary across Claude Desktop, Cursor, ChatGPT, Gemini, and other MCP clients. Tools that pass strict-mode validation in Anthropic's SDK can hard-fail in OpenAI's. The safest pattern: flat objects with explicit types, no `$ref`, no `oneOf`, 3-4 parameters maximum. Test across at least two clients before shipping. (Apigene; AgentPatterns Schema Standards.)

**Rule 6: Surface constraints explicitly.** If your tool returns up to 100 matches, say so in the description. If a parameter must be under 1MB, say so. If a tool is rate-limited at 10 calls per minute per user, say so. An agent that doesn't know about a limit will interpret a truncated result as completion and make incorrect downstream decisions. (Axiom Studio.)

**Rule 7: Errors include recovery hints.** Tool-level errors (`isError: true`) are information the agent can reason about and recover from. JSON-RPC errors should be reserved for server-side failures (invalid JSON, unknown tool, internal crash). The error message itself matters: "File not found" with `"try search_files instead"` produces better agent behavior than "ENOENT: no such file or directory". (Axiom Studio; AgentPatterns.)

**Rule 8: Add batch variants when agents loop.** If you observe agents calling the same tool N times in sequence, add a batch tool. `read_files(paths: string[])` instead of N calls of `read_file(path: string)`. Each non-batch call is a full LLM response cycle (generate call, execute, inject result, generate next call); batching cuts latency and token cost roughly linearly. (Axiom Studio; Datadog/Block/Cloudflare layered query patterns analysis on Medium.)

## Output schemas

The 2025-06-18 spec introduced `outputSchema` — tools can now declare a JSON Schema describing their return type, alongside the existing `inputSchema`. Tools with output schemas return both `structuredContent` (typed, schema-compliant) and the traditional `content` array for backward compatibility. (ChatForest; AgentPatterns.)

Use output schemas when downstream code or other tools will consume the data programmatically. Skip them for tools returning primarily human-readable content (summaries, generated text, explanations) where the structure is the prose itself. The cost: every additional schema increases per-tool token overhead in the agent's context window.

## Tool-list size

Empirical guidance from the production MCP servers (Stripe Toolshed, Block, Cloudflare, Datadog) all converges on the same rule: **keep the tool list under 15 per server**. Single-responsibility per server; non-overlapping toolsets. Stripe Toolshed has 400+ tools but pre-selects 15 per agent run via deterministic prefetching against the prompt. (Engineering.fyi Stripe; AgentPatterns server design.)

The reason is direct: the agent's context window includes every tool definition. Schemas dominate per-tool token cost. A server exposing 50 tools to a 200K-context model leaves much less room for actual reasoning, retrieval, and dialogue.

The Datadog/Block/Cloudflare comparison (Tanmay Deshpande, March 2026) measured this directly on the HackerNews API: a 10-tool "traditional" pattern consumed 6,624 tokens and 3.6 seconds across five benchmark scenarios; a "code mode" alternative cut tokens by 65%; a "layered query" pattern cut tokens 65-98% and finished in 2.0 seconds. The implication: shipping 10 narrow tools is the *worst* of three patterns when the API has any meaningful surface area.

## What to expose first

The single highest-impact tool to ship first is the one that solves a complete end-to-end user task. Not a list endpoint. Not a get-by-id endpoint. The thing that returns the answer the user actually wants.

Anthropic's Effective Tools guide makes this concrete: instead of `list_users`, `list_events`, `create_event`, ship `schedule_event` that finds availability and schedules in a single tool call. Instead of `read_logs`, ship `search_logs` that returns relevant lines with surrounding context. Instead of `get_customer_by_id` + `list_transactions` + `list_notes`, ship `get_customer_context` that compiles all of a customer's recent and relevant information at once.

For a SaaS founder, this means: identify the 3-5 most common multi-step workflows your users perform manually, and ship one tool per workflow. Skip the long tail until production data shows agents asking for it.

---

# Part IV: Authentication and Authorization

The MCP specification (2025-11-25 update) mandates OAuth 2.1 with PKCE for all HTTP-based transports. API keys in environment variables still work on day one, but the official MCP Registry, Claude Desktop, Cursor, VS Code Copilot, and Windsurf all preferentially recommend OAuth-backed servers when users browse for integrations. If your server still asks for a long-lived bearer in a config file, you're leaving distribution share on the table. (Botoi PKCE guide; WorkOS auth guide; Ekamoira OAuth 2.1.)

## The wire protocol

The MCP authorization composition is five small specs that compose:
- **OAuth 2.1** (RFC 9700) — the authorization framework itself
- **PKCE** (RFC 7636) — Proof Key for Code Exchange, with mandatory S256 code challenge method
- **Dynamic Client Registration** (RFC 7591) — clients self-register without per-client provisioning
- **Resource Indicators** (RFC 8707) — pin tokens to specific resources to prevent cross-resource replay
- **Protected Resource Metadata** (RFC 9728) — discoverable at `/.well-known/oauth-protected-resource`

The end-to-end client experience: an MCP client like Claude Desktop hits a 401 on first connection, reads `WWW-Authenticate: Bearer realm="..."` pointing at `/.well-known/oauth-protected-resource`, parses the metadata, registers itself dynamically (or uses an existing registration), runs a PKCE-protected authorization code flow with the resource indicator pinning the token audience to your MCP server, exchanges the code for an access token + refresh token, and starts calling tools with the bearer in the Authorization header. (Prefect MCP OAuth; STOA OAuth+PKCE flow.)

## What you actually have to ship

For a SaaS founder, the implementation work decomposes as follows:

**1. Protected Resource Metadata endpoint at `/.well-known/oauth-protected-resource`.** The path is not configurable — the RFC fixes it. Returns JSON declaring your authorization server, supported scopes, and resource URI. (Microsoft Azure AD MCP guide; Vercel deploy MCP.)

```json
{
  "resource": "https://api.yourservice.com/mcp",
  "authorization_servers": ["https://auth.yourservice.com"],
  "jwks_uri": "https://auth.yourservice.com/.well-known/jwks.json",
  "scopes_supported": ["mcp:read", "mcp:invoke:safe", "mcp:invoke:destructive"],
  "response_types_supported": ["code"],
  "grant_types_supported": ["authorization_code", "refresh_token"]
}
```

**2. Authorization Server.** Build it yourself only if you must. For most teams, delegate. WorkOS, Auth0, Okta, AWS Cognito, Azure AD/Entra ID, Keycloak, and Clerk all support the relevant RFCs out of the box. WorkOS specifically markets MCP-ready AuthKit; PropelAuth has a Cloudflare Worker MCP guide. The pragmatic recommendation, repeated across every auth-vendor blog: **delegate authentication to an established identity provider; focus your engineering effort on access control and business logic.** (Ekamoira; WorkOS; Prefect; STOA.)

**3. JWT validation in your tool handlers.** Cache JWKS for 1 hour (Microsoft Azure AD MCP recommends this exact value as the balance between performance and key-rotation latency). Validate `iss` (issuer), `aud` (audience — must match your resource URI), `exp` (expiration), `nbf` (not-before), and required scopes. Signature alone is not sufficient — cross-resource replay requires the audience check. (Prefect MCP OAuth; MCP Framework OAuth.)

**4. Scope design.** Split destructive and read-only scopes. The pattern that survives:
- `tools:read` — list-only access, no side effects
- `tools:invoke:safe` — non-destructive actions (search, lookup, status)
- `tools:invoke:destructive` — actions that mutate state (purchase, send_email, delete)

A user who granted `tools:read` to run a weekly report should not be able to run `send_email` from the same token. Claude Desktop and Cursor surface requested scopes in the consent screen, so the split makes the UX honest about what the client can do. (Botoi; OWASP MCP Security; Ekamoira.)

**5. RBAC at the tool level, not just authentication.** Authentication answers "who is calling?" Authorization answers "what can they do?" Both are required. Authentication without authorization is one of the top five mistakes Ekamoira documents in their analysis of common MCP security failures. Implement role-based access control — at minimum read-only/write/admin separation — at the tool execution layer. (Ekamoira.)

## What to avoid

- **Tokens in query strings.** Logs and proxies capture URLs routinely. The MCP Framework's OAuth provider rejects them automatically. Never embed bearer tokens in the URL. (MCP Framework OAuth.)
- **Long-lived static tokens.** OAuth 2.1 mandates short-lived (5-60 minute) access tokens with refresh token rotation. Long-lived tokens are the single biggest credential risk in MCP — if leaked into logs, they're abusable for the lifetime of the token. (Botoi; OWASP MCP Top 10.)
- **Symmetric JWT signing (HS256).** Use asymmetric (RS256 or ES256) signing keys fetched from a JWKS endpoint. Symmetric keys must be shared with every validating server, expanding the compromise surface. (MCP Framework OAuth.)
- **Token storage in localStorage.** On the client side, tokens belong in OS-native secure storage (Keychain on macOS, Credential Manager on Windows, libsecret on Linux). Web-style localStorage storage is a known anti-pattern. (MCP Framework; Prefect.)

---

# Part V: Security and Trust

The OWASP Foundation now maintains a dedicated **OWASP MCP Top 10** (2025 beta, with the 2026 revision expanding several categories). It is required reading and the canonical reference for threat modeling MCP deployments. The categories:

| | Category | Risk |
|---|---|---|
| MCP01 | Token Mismanagement & Secret Exposure | Hard-coded credentials, long-lived tokens, secrets in protocol logs |
| MCP02 | Privilege Escalation via Scope Creep | Tools that exceed declared scopes; over-permissioned access |
| MCP03 | Tool Poisoning | Malicious tool descriptions, rug-pulls, schema poisoning, tool shadowing |
| MCP04 | Software Supply Chain Attacks | Dependency tampering, untrusted server packages |
| MCP05 | Command Injection & Execution | Untrusted input flowing into shell, SQL, or code execution |
| MCP06 | Prompt Injection via Contextual Payloads | Hidden instructions in retrieved documents, file content, metadata |
| MCP07 | Insufficient Authentication & Authorization | Weak auth, missing RBAC, audience confusion |
| MCP08 | Lack of Audit and Telemetry | Insufficient logging for detection or investigation |
| MCP09 | Shadow MCP Servers | Unauthorized internal MCP deployments |
| MCP10 | Context Injection & Over-Sharing | Cross-tenant context leakage; shared session state |

(OWASP MCP Top 10; OWASP MCP06; OWASP MCP Tool Poisoning page.)

## The three categories most SaaS teams underestimate

**Tool Poisoning (MCP03).** Demonstrated in production against the official GitHub MCP server (~14,000 GitHub stars at time of disclosure, one of the most widely deployed servers). A malicious issue in a public repository contained instructions; an agent triaging public issues read the issue, followed the hidden instructions, pulled data from private repositories, and wrote it into a public pull request. Private repo names and personal information were exfiltrated. This is not theoretical. CyberArk's "Poison Everywhere" research extended the model to demonstrate every text field in a tool schema is an injection surface — descriptions, parameter descriptions, defaults, enum options, examples, title fields. (Pipelab tool poisoning; OWASP issue 806; Mindgard.)

**Command Injection (MCP05).** CVE-2025-5277 documented a command injection vulnerability in the popular `aws-mcp-server`: validation only ensured the command started with `aws`, but `aws -h;whoami` bypassed the check. CVE-2025-5276 (SSRF) and CVE-2025-5273 (arbitrary file read) followed in the same disclosure cycle for `markdownify-mcp`. The pattern: tools that take user-controllable strings and pipe them into subprocess execution, file paths, or HTTP calls without sanitization. (Snyk Labs; Tenable.)

**Indirect Prompt Injection (MCP06).** Even if your MCP server uses stdio and isn't network-exposed, indirect prompt injection can weaponize the LLM into issuing a command that hits your server. The Snyk Labs disclosure showed how a poisoned web page, fetched by a different MCP server, can instruct the LLM to call your tools with attacker-controlled arguments. The mitigation is not on the LLM side — it's at the tool execution boundary, with backend access controls that injected instructions cannot override. (Snyk Labs; OWASP MCP06.)

## Defenses every production server needs

1. **Validate every input.** Path traversal (`../`), null bytes, command-character escaping, regex bombs, oversized payloads. Even with a strict JSON Schema, the input is untrusted by default. The STDIO execution model in some early MCP SDKs runs commands even when the local process fails to start, exposing servers to command injection unless the author sanitizes inputs. Argument sanitization is the mitigation, not richer schemas. (AgentPatterns server design; OX Security; SecurityWeek.)
2. **Treat tool responses as untrusted before they enter the LLM context.** The MCP specification advises clients to consider trust boundaries but does not mandate response validation. Production servers should sanitize their own outputs — strip embedded instructions, mask secrets, truncate oversized payloads — before returning. (OWASP MCP Tool Poisoning page.)
3. **Backend access controls cannot rely on system prompt instructions.** "Do not read files outside /tmp" enforced via system prompt is bypassable. The same restriction enforced at the tool layer (the tool refuses paths outside /tmp) is not. Always enforce restrictions server-side. (OWASP MCP Tool Poisoning; OWASP issue 806.)
4. **Trust-on-First-Use (TOFU) for tool definitions.** Cache tool schemas at first connection; alert when they change unexpectedly. Rug-pull attacks (silent modification of approved tool descriptions) rely on the absence of this check. (OWASP Stuttgart slides; SAFE-MCP framework.)
5. **Origin header validation on all incoming connections.** Required by the MCP spec to prevent DNS rebinding attacks on local servers; required in practice for remote servers to prevent CSRF-style attacks against authenticated sessions. (modelcontextprotocol.io transports.)
6. **Per-user, per-client consent for all tools and data access.** Prevents confused-deputy attacks where a trusted client is tricked into acting on behalf of an untrusted one. (Mindgard; OWASP MCP Top 10.)
7. **Continuous adversarial testing.** Red teaming with platforms like Mindgard Offensive Security, plus pre-deploy scanning with Cisco mcp-scanner, Snyk agent-scan (formerly Invariant), Pipelock MCP proxy, or SAFE-MCP-aware tooling. Static review catches description-level injection; runtime proxies catch session-level rug-pulls. (Mindgard; Pipelab.)

---

# Part VI: Enterprise Governance

For SaaS teams selling to mid-market and enterprise buyers, the governance layer is the difference between a 30-day procurement cycle and a 9-month one. Procurement, security review, and compliance teams will ask specific questions: how is multi-tenancy enforced, what does the audit trail look like, what's the data residency story, what regulations does the deployment support.

## Multi-tenancy patterns

The MCP `initialize` handshake includes `clientInfo` (name, version) but no tenant identifier. Multi-tenancy is your responsibility at the infrastructure layer. Two patterns dominate, with a clear tradeoff. (MCP Find multi-tenant; Tetrate enterprise.)

**Process-per-tenant.** Each tenant gets their own MCP server process. Complete isolation — one tenant's crash doesn't affect others, one tenant's data cannot leak. Operationally heavier (process management, resource accounting per tenant, cold-start latency). Right for high-security tenants, regulated industries, and small tenant counts (<100). One financial-services case study deployed 50 dedicated tenant processes; the operational lesson was "automate process management early; manual onboarding becomes a bottleneck." (MCP Find.)

**Shared-process with tenant namespace.** One MCP server handles all tenants, with tool names and operations scoped by tenant ID extracted from the authentication context. Lower operational cost. Higher engineering burden — every operation must check tenant context, every database query must include the tenant filter, every cache key must include the tenant ID. One SaaS-product case study deployed 200+ tenants in shared-process and reported that error handling was the differentiator — "one tenant's bad tool code crashed the shared server three times in the first month; added circuit breakers after that." (MCP Find.)

The default for SaaS unless you know you need otherwise: shared-process with tenant namespace, and per-tenant rate limits at the MCP layer. The hardest scaling challenge is usually upstream API rate limits, not the MCP server itself — your shared server will hit the same third-party-API rate limit on behalf of all tenants, requiring per-tenant queueing and backoff at the MCP boundary.

## Audit logging

SOC 2 Type II, ISO 27001, HIPAA, GDPR, SOX, and PCI-DSS all impose specific audit requirements that MCP servers must satisfy when they touch regulated data. The minimum viable audit log for an MCP server in 2026:

- **One event per tool call** — including failed and denied calls
- **User identity** — verified from the OAuth token, not self-asserted by the client
- **Tenant ID** — for multi-tenant deployments
- **Tool name and parameters** — with PII hashed or redacted; raw params in audit logs is a GDPR violation waiting to happen
- **Timestamp** — UTC, ISO 8601, sub-second precision
- **Client IP** — for incident response and rate-limiting context
- **Outcome** — success/error, response status, duration
- **Audit ID** — UUID for correlating across log streams

Per the Greenplum MCP Server reference implementation and the Ithena MCP governance SDK, audit logs should:
- Be a separate stream from server operational logs (compliance requires a clean stream)
- Be NDJSON for direct ingestion into SIEM (Splunk, Datadog, ELK, Vector)
- Be tamper-evident (cryptographic chaining or immutable storage like AWS S3 Object Lock)
- Have a retention policy aligned to the strictest regulation that applies (7 years for SOX, 6 years for HIPAA, "as long as relevant" for GDPR)
- Capture permission denials separately from authentication failures

(Broadcom Tanzu Greenplum docs; Ithena governance SDK; Tetrate audit logging.)

## Zero data retention as a procurement accelerator

The Truto analysis (April 2026) is the cleanest articulation of why zero-data-retention pass-through architecture matters for SaaS MCP servers selling to enterprise. Every database that holds customer records becomes part of your SOC 2 audit scope. Every cache layer that persists API responses needs encryption controls, retention policies, access logging, and disposal procedures. Caching third-party data expands your compliance scope exponentially.

The zero-data-retention pattern: operate as a stateless pass-through proxy that processes API payloads entirely in memory, maps schemas on the fly, and returns results directly to the LLM without writing customer data to disk. The benefits compound:

- SOC 2 audit scope shrinks dramatically (no data-at-rest in your perimeter)
- GDPR data minimization compliance is structural, not procedural
- Right-to-erasure becomes trivially compliant (you have nothing to erase)
- Procurement cycles shorten from quarters to days because the security questionnaire becomes much shorter

The tradeoff: some features are harder. Per-call caching is constrained. Cross-call analytics require external storage with explicit consent. The pattern fits MCP servers well precisely because most MCP tool calls are stateless lookups against an external system of record. (Truto zero-data-retention; Tetrate MCP audit logging.)

## Policy-as-code

For multi-team enterprise deployments, expressing access policies in machine-readable form (Rego, OPA, Cedar) is the only sustainable path. Policies define which tools each role can invoke, which data residency rules apply, what logging is mandatory, what scopes are required. GitOps workflows produce comprehensive audit trails for free — every policy change is a Git commit with author, reviewer, and approval timestamps. (Tetrate enterprise deployment.)

---

# Part VII: Observability and Evaluation

You cannot iterate the tool design loop without measurement. The dominant tools in the ecosystem as of mid-2026:

- **mcp-eval** — comprehensive evaluation framework. Connects an mcp-agent to your server, runs scripted scenarios, captures OpenTelemetry traces, asserts tool usage / content / efficiency / quality. JSON, Markdown, HTML reports. GitHub Actions integration. (mcp-eval.ai; mcp-eval Mintlify.)
- **MCPJam Inspector** — runs your MCP server against simulated agents across multiple LLMs (Claude, GPT, Gemini), reports Accuracy, TPR, FPR, Precision, token usage, cross-model performance. Auto-generates test cases from your tool definitions. Integrates OpenAI Apps SDK and MCP-UI. (MCPJam blog.)
- **mcpchecker** — integration tests for MCP servers using real AI agents to complete real tasks. Uses an MCP recording proxy to capture every tool call. (mcpchecker GitHub.)
- **Inspectr** — local-first proxy capturing every MCP request/response with MCP-aware classification (tools, prompts, resources). Pairs with MCPLab for evaluation runs. (Inspectr docs.)
- **Ithena** — open-source `ithena-cli` plus hosted Ithena Platform for enterprise observability and audit trails. (Ithena governance SDK.)

## What to measure

The four metrics from MCPJam map directly to the tool design rules:

- **Accuracy** — overall percentage of runs where the agent invoked the expected tool correctly. The headline health metric.
- **True Positive Rate (TPR / Recall)** — of the runs where this tool *should* have been called, how often was it? High TPR means the description is clear and the agent knows when to use it.
- **False Positive Rate (FPR)** — of the runs where this tool should *not* have been called, how often was it called anyway? High FPR means the tool is too generic; tighten the scope or sharpen the description.
- **Precision** — of all the times the tool was used, what fraction was correct? High precision means the tool isn't being overused.

Two operational metrics complete the picture:

- **Token usage per call** — schemas dominate per-tool token cost; track this to detect schema drift that bloats context.
- **Latency P50/P95/P99** — agents downrank slow APIs. Anything over 500ms for a read or 2s for a write is a problem.

(MCPJam; mcp-eval; Inspectr.)

## CI gates

The mcp-eval and mcpchecker workflows both ship GitHub Actions integrations. The minimum CI gate every SaaS MCP server should run on every pull request:

1. **Schema validation** — every tool definition is valid JSON Schema with `additionalProperties: false`
2. **Description quality** — heuristic check that every tool has a description ≥40 characters and every parameter has a description ≥10 characters
3. **Cross-client compatibility** — run the schema through OpenAI's strict-mode validator and Claude's strict-mode validator; fail if either rejects
4. **Behavioral test suite** — at least 10 representative scenarios per tool, asserted with `Expect.tools.was_called`, `Expect.content.contains`, and `Expect.performance.response_time_under`
5. **Security scan** — run Cisco mcp-scanner or Snyk agent-scan against the tool definitions for known injection patterns

Empirically, teams that ship without CI gates regress accuracy 5-10% per quarter as engineers add tools or modify descriptions without testing. Teams with CI gates hold accuracy steady or improve it.

---

# Part VIII: Distribution

Building the server is half the work. Distribution is the other half. The MCP ecosystem has consolidated around a small number of registries and directories, each with a different audience and submission flow.

## The registry stack

| Layer | Name | Server count | Submission |
|---|---|---|---|
| Official | registry.modelcontextprotocol.io | Canonical metadata source | OAuth-authenticated `mcp-reg publish` CLI; namespace verified via DNS or GitHub ownership |
| Curated directory | PulseMCP | 11,840+ (April 2026) | Editorial, hand-reviewed daily; auto-ingests from Official Registry |
| App-store style | Smithery | 7,000+ | Web form or `smithery mcp publish`; supports hosted (URL) and stdio (mcpb bundle) |
| Maximum coverage | Glama | 21,000+ | Auto-pulls from GitHub + community submissions; security-scored |
| Maximum coverage | MCP.so | 19,700+ | Web form, GitHub login, community-submitted |
| Awesome-list | github.com/modelcontextprotocol/servers | Reference implementations | PR to repo |
| Awesome-list | awesome-mcp-servers | 83,000+ stars | PR; now requires Glama listing first |
| Auto-publish | mcp-get | n/a | CLI publish |

(MCPBlog registry guide; AutomationSwitch directory comparison; DYNO Mapper; Skillful comparison; Glama explained; modelcontextprotocol.io Registry.)

## The submission sequence

For a brand-new MCP server, the submission order that maximizes distribution at minimum effort:

1. **Official MCP Registry first.** Use `mcp-reg publish` (or the GitHub Action equivalent) on every release. PulseMCP auto-ingests within 7 days. ~10 minutes one-time setup; a few minutes per release after CI.
2. **Smithery second.** Use `smithery mcp publish "https://your-server.com/mcp" -n yourorg/your-server`. Smithery handles dynamic client registration via Client ID Metadata Documents — no per-client setup required. Bonus: Smithery scans your server for tools/prompts/resources to populate your listing; if scanning fails, serve a static `/.well-known/mcp/server-card.json`.
3. **Glama third.** Submit via web form. Glama runs build checks; servers that fail are rejected. Listing on Glama is now a prerequisite for the awesome-mcp-servers PR.
4. **MCP.so fourth.** Web form; broadest coverage by raw count.
5. **Awesome list last.** PR to `github.com/modelcontextprotocol/servers` for reference-grade servers; PR to `punkpeye/awesome-mcp-servers` for community visibility (Glama listing required).

Auto-publish from CI with `continue-on-error: true` on the registry job — the Official Registry is still in preview, and you don't want a registry outage to block your release.

## Beyond the registries

The registries cover discovery for developers actively browsing for MCP servers. Three secondary distribution channels matter for SaaS:

1. **Documentation that AI training corpora ingest.** llms.txt, schema.org, indexed blog posts. Agents preferentially recommend brands they've seen mentioned authoritatively. Generative engine optimization (GEO) is a real discipline now and affects whether your server gets recommended versus a competitor's. (Yext; Seenos; AgentWiki.)
2. **Direct partner integrations.** Cloudflare's MCP Demo Day (May 2025) showcased PayPal, Sentry, Linear, Asana, Atlassian, Block, Intercom, Webflow, Stripe — each landed in Claude as a native integration the day they shipped. Anthropic and OpenAI both run partner programs. The first 100 servers are easy; the next 1,000 are gated by these partner relationships.
3. **The IDE/editor ecosystem.** Cursor, Windsurf, VS Code Copilot, Claude Code, GitHub Copilot. Each has its own configuration mechanism for MCP servers; getting installed by default in any of them is worth more than years of registry presence.

---

# Part IX: Monetization

Of the 19,000+ public MCP servers, fewer than 5% are monetized. The gap is the opportunity. Every monetization pattern in the SaaS playbook adapts to MCP — but the agent-as-buyer dynamic makes some patterns dramatically better than others.

## The four pricing models

| Model | Price range | Best for |
|---|---|---|
| Per-call | $0.001–$0.25 per tool invocation | High-volume utilities (search, translate, lookup, status); commodity actions |
| Subscription | $19–$99/month | Servers requiring ongoing maintenance; feature-rich integrations |
| One-time | $9–$99 | Simple wrappers; single-API integrations; weekend-project quality |
| Outcome-based | % of recovered revenue / verified outcome | Premium consultative tools where value is measurable |

(Godberry Studios; TutuoAI; AgentPay docs.)

The single non-obvious finding from the 2026 monetization research: **subscription pricing dies fastest in MCP**. Agents are infinitely patient and perfectly rational; they will not pay for unused features or unused seats. A SaaS that previously sold $99/seat/month subscriptions and ships an MCP server discovers that agent-originated trial conversion is 1-2% — the agent is evaluating "is the marginal value of *this single action* greater than the marginal cost?" not "is this worth $99/month for a year?". (FluxA; ATXP.)

The pragmatic recommendation for a first MCP server release: ship a per-call price tier alongside any existing subscription model. Track agent conversion against the new tier specifically. Many operators report agent-mediated revenue under per-call pricing exceeding seat-based subscription revenue within 90 days.

## The four billing rails

**1. Marketplace / proxy billing.** AgenticMarket, MCPize, Apify MCP, Smithery (paid tier). Add a single header check to your existing HTTPS endpoint, list your server, set a price, keep 80-90% of revenue. AgenticMarket and MCPize both publish 80% revenue share at the floor; Apify Pay-Per-Event is 80% of charged events. Setup: ~10 minutes. Best for: existing HTTPS servers, fastest path to first revenue. (AgenticMarket; Godberry Studios; Apify.)

**2. Agent-native billing platforms.** ATXP (`withBilling()` wrapper at the tool boundary), AgentPay (per-tool pricing with freemium credits), FluxA (USDC settlement via x402), P402 (wallet-backed agent payments with policy controls). All target the same primitive: pricing decisions at the tool boundary, machine-readable upfront, agent self-onboards. Setup: minutes to hours. Best for: greenfield servers, agent-native workflows. (ATXP; AgentPay; FluxA; P402.)

**3. Stripe Machine Payments Protocol (MPP) and Cloudflare paid MCP servers.** Stripe's MPP launched March 2026 — agents authorize a session spending limit upfront and stream micropayments. Pairs with Stripe's existing PSP infrastructure. Cloudflare ships a `experimental_PaidMcpAgent` class that integrates Stripe checkout sessions into MCP tool gating. Setup: hours to days. Best for: enterprise-grade fiat compliance, large-volume sessions. (Stripe MPP; Cloudflare paid MCP guide.)

**4. Self-hosted with metered billing.** Moesif, Stripe metered, AWS API Gateway, mcp-billing-gateway. Maximum control, maximum revenue retention (~95% after fees), but real engineering work — instrumentation, plan management, customer provisioning, invoice generation. Best for: high-volume servers, custom enterprise contracts, regulated buyers requiring fiat invoicing. (Moesif; mcp-billing-gateway.)

## Pricing strategy

The empirically grounded floor for general-purpose utility MCP servers is **$0.03–$0.08 per call**. Domain-specific or premium servers (financial data, legal research, medical lookup) sit at $0.15–$0.50 per call. The ceiling above which agents start to balk on a per-call basis is roughly $1.00; beyond that, session-based pricing or subscription becomes more efficient. (AgenticMarket; Godberry Studios.)

Three operating heuristics:

- **Price per-call events at 50–150% of the buyer's next-best alternative.** Agents do comparison shopping silently; the price elasticity is real.
- **Set free-tier limits that scale with a credit unit, not a flat call count.** $1 in free credit is a more honest signal than "100 free calls" because the latter tempts gaming.
- **Publish pricing in your manifest.** Agents that can read pricing programmatically will preferentially route to servers with transparent, machine-readable pricing over those requiring out-of-band negotiation. (AgentPay.)

---

# Part X: Common Failure Modes

A representative sample of patterns where SaaS MCP server initiatives stall or underperform, drawn from public post-mortems, vendor analyses, and recurring patterns in the consultancy ecosystem.

## Failure 1: Auto-generating tools from Swagger

The pattern. A team writes a 30-line script that converts every endpoint in their OpenAPI spec into an MCP tool. Ships in a sprint. The MCP server has 80 tools, vague descriptions inherited from API summaries, no narrative about when to use which tool. Agents try the first three, fail to disambiguate, and stop calling the server. (AgentPatterns server design; Apigene; Datadog/Block/Cloudflare layered query analysis.)

The fix. Hand-write tool descriptions for the 5-15 highest-value workflows. Treat MCP as a distribution channel with a roadmap, owners, and quarterly capability expansion. Auto-generation is fine for the *implementation* (call your existing API internally); it's never fine for the *interface*.

## Failure 2: Manifest theater

A business publishes `llms.txt`, an A2A Agent Card, and an MCP server. Each is hand-written. Each drifts from actual capabilities within 60 days. Agents fetch them, find stale information, downrank the business. (B2X Software; Strategic Inference.)

The fix. Generate manifests from the source-of-truth system (PIM, capability registry, API gateway). CI/CD validates manifest freshness. Scheduled jobs confirm every URL referenced is alive.

## Failure 3: Skipping the trust layer until it bites

A merchant launches ACP-compatible checkout, agent-originated traffic spikes, the WAF flags it as fraud, transactions fail silently. Team adds an exemption rule. Two months later, the exemption is exploited by an actual fraudster pretending to be an agent. (HireNinja merchant readiness; HyperTrends.)

The fix. Implement TAP-style agent identity verification *before* ramping agent traffic. Trust layer is not optional; it's the constraint that makes scaling safe.

## Failure 4: Wrong pricing model

A SaaS that previously sold $99/seat/month subscriptions ships an MCP server. Agent-originated trials skyrocket. Conversion to paid is 2%. Team concludes "agents don't buy." Actual cause: the subscription pricing model is incompatible with how agents evaluate value. (FluxA; ATXP.)

The fix. Add a per-action pricing tier alongside the subscription. Track agent conversion against the new tier specifically.

## Failure 5: Premature broad rollout

A team commits to "MCP across the entire product portfolio." Six months later, none of it ships, because every product team is mid-implementation and none has reached production-quality.

The fix. Pick one product line. Ship its MCP surface to production-quality. Use it as the reference implementation. Roll out to the second product only after the first is generating measurable agent-mediated revenue.

## Failure 6: No observability, no iteration

Team builds a server with great tools. Doesn't instrument. Six months later, can't tell which tools are used, which are failing, or whether any agent has ever successfully completed a user task. (mcp-eval; MCPJam.)

The fix. Ship the eval harness and the OpenTelemetry instrumentation in the same PR as the first production tool. Agent-conversion metrics become a first-class business KPI.

## Failure 7: Treating MCP as a feature, not a channel

A SaaS team launches an MCP server in a single sprint, ships a press release, moves on. Adoption stagnates because the server has 8 tools, none solve a real workflow end-to-end, schemas are auto-generated from Swagger and unreadable to LLMs, and no one is monitoring agent traffic.

The fix. Treat MCP as a distribution channel with a roadmap, owners, metrics, and quarterly capability expansion. The first MCP release is a beachhead, not a milestone.

## Failure 8: Building it all in-house

Engineering decides to build a custom MCP server, custom A2A integration, custom payment infrastructure, custom manifest generation, custom agent-traffic analytics, custom trust layer. Eighteen months later, the system is operational but consuming 60% of engineering capacity.

The fix. Use the productized layer where it exists. Apideck, StackOne, Truto, Albato Embedded, Cyclr, NimbleBrain, Ampersand all sell MCP-server-as-a-service for SaaS integrations. Stripe sells ACP-as-a-service for commerce. The differentiated work is your business logic and your vertical-specific data, not the protocol plumbing.

---

# Part XI: The 90-Day Implementation Plan

## Days 0–30: Foundation

**Goal: ship a minimum viable MCP server in production, exposing 3-5 high-value tools, with OAuth 2.1 and basic observability.**

**Week 1: Architecture and decisions**
- Pick transport: Streamable HTTP for SaaS extension (default); stdio only if your "server" is already a CLI distributed to developers.
- Pick framework: Cloudflare Agents (`createMcpHandler` for stateless, `McpAgent` for stateful) or Vercel `mcp-handler` on Functions/Fluid Compute. Use what you already deploy on.
- Pick auth provider: WorkOS, Auth0, Okta, AWS Cognito, Azure AD, Keycloak, or Clerk. Do not roll your own.
- Inventory existing API: which 3-5 endpoints solve complete user workflows that agents would invoke?
- Establish baseline observability: OpenTelemetry traces, per-tool metrics, audit log stream.

**Week 2: First tools and OAuth**
- Implement 3-5 tools following the eight tool-design rules (one tool per distinct action, clear descriptions, flat schemas, parameter descriptions, surfaced constraints, helpful error messages).
- Wire OAuth 2.1 via your auth provider. Implement `/.well-known/oauth-protected-resource`. Validate JWTs (iss, aud, exp, scopes) on every tool call.
- Implement RBAC: at minimum split `tools:read` from `tools:invoke:safe` from `tools:invoke:destructive`.
- Audit logging stream emitting NDJSON with user, tenant, tool, params hash, timestamp, outcome.

**Week 3: Security hardening**
- Run Cisco mcp-scanner or Snyk agent-scan against your tool definitions; fix any findings.
- Add input validation: path traversal, command injection, oversized payload, regex bombs.
- Sanitize outputs before returning to LLM context; mask any embedded secrets.
- Origin header validation. Rate limiting (per-user, per-tenant, plus upstream API budget).
- Document the deployment in a SECURITY.md.

**Week 4: First evaluation harness and CI gates**
- Set up mcp-eval or MCPJam against your server with at least 10 scenarios per tool.
- Add CI gates: schema validation, description quality, cross-client compatibility (Anthropic strict + OpenAI strict), behavioral test suite, security scan.
- Capture day-30 baseline metrics: TPR, FPR, Precision, token usage, P95 latency.

**Day 30 deliverables checklist**
- [ ] Server in production at a stable URL
- [ ] OAuth 2.1 with PKCE; PRM endpoint live
- [ ] 3-5 production tools with complete descriptions
- [ ] CI eval gate active on every PR
- [ ] Audit log stream wired
- [ ] Baseline metrics captured

## Days 30–60: Distribution and Compliance

**Goal: get the server discoverable, capture agent traffic, ship the second batch of tools, and pass first procurement-grade security review.**

**Week 5–6: Distribution**
- Submit to Official MCP Registry; auto-publish from CI/CD with `continue-on-error: true`.
- Submit to Smithery (`smithery mcp publish`).
- Submit to Glama (web form, after build checks pass).
- Submit to MCP.so.
- Add `llms.txt`, `llms-full.txt`, schema.org JSON-LD on your marketing pages so AI training corpora pick up your server.
- Reach out to the Cloudflare MCP Demo Day cohort for partner-program intros (Anthropic, OpenAI, Google).

**Week 7: Tool expansion**
- Ship the next 5–7 tools based on baseline data — which workflows did agents try and fail at? Which tools were called most? Where are the missing batch variants?
- Update CI gates for new tools.

**Week 8: Compliance and governance**
- Implement zero-data-retention pass-through architecture or document why you can't.
- Multi-tenancy: shared-process with tenant namespace; per-tenant rate limits.
- Audit logs hardened: tamper-evident, NDJSON, retention policy aligned to strictest applicable regulation.
- Draft SOC 2 / GDPR / HIPAA narrative — not the certification itself, but the procurement-questionnaire answer for buyers.

**Day 60 deliverables checklist**
- [ ] Listed in 4+ registries
- [ ] 8–12 production tools
- [ ] Agent traffic visible in dashboards (track agent visits/week, agent-mediated tool calls, agent-mediated revenue placeholder)
- [ ] First buyer security questionnaire answered without follow-up
- [ ] Zero-data-retention or documented exception

## Days 60–90: Monetization and Compounding

**Goal: ship a billable tier, capture first agent-originated revenue, and prove the data flywheel.**

**Week 9: Billing rail decision**
- Pick one of: marketplace proxy (AgenticMarket / MCPize), agent-native (ATXP / AgentPay / FluxA), Stripe MPP / Cloudflare paid MCP, or self-hosted metered.
- Implement per-call pricing on 1–2 tools; keep the rest free as the freemium funnel.
- Publish pricing in your manifest (machine-readable).

**Week 10: Outcome instrumentation**
- Build the first dashboard tracking: agent visits/week, agent-mediated tool calls/week, agent-mediated revenue/week, top tools called, top agents calling, agent-conversion funnel (discovery → capability query → tool call → success).
- Compare agent-mediated metrics to human-mediated metrics. The first time agent-mediated AOV exceeds human-mediated AOV is the strategic inflection: it's evidence the channel deserves dedicated investment.

**Week 11: Funnel optimization**
- Identify and fix top 3 funnel drop-off points. Common patterns: ambiguous tool descriptions (rewrite for natural-language match), missing required attributes (populate optional fields), webhook unreliability (idempotent retry).
- Test outcome-based pricing on one tool. Track agent-conversion uplift.

**Week 12: Compounding asset and storytelling**
- Capture day-90 metrics. Improvement of 30%+ on TPR and 2× on agent-mediated revenue from baseline is realistic.
- Publish first public case study (anonymized if necessary). Feeds the publication flywheel; AI training corpora ingest the post; future agents preferentially recommend your server.

**Day 90 deliverables checklist**
- [ ] Billable tier live with measurable agent-originated revenue
- [ ] Agent-metrics dashboard reviewed weekly by leadership
- [ ] Top 3 funnel leaks fixed
- [ ] Public case study or benchmark published
- [ ] Day-90 metrics captured; quarterly review cadence established

---

# Conclusion: The 12-Month Window

The Model Context Protocol is the rare protocol that won on portability without losing meaningfully on performance. 97 million monthly SDK downloads. 9,400+ public servers. Production deployments at every major SaaS platform. Cross-provider standardization complete in 12 months — historically rare for an integration protocol.

For SaaS founders in 2026, the question is not whether to ship an MCP server. The question is whether to ship a high-quality one in your category before a competitor does. The 25-percentage-point gap between "5% of vendors have shipped" and "30% will have shipped by year-end" is the operating window. The infrastructure to do this — Cloudflare Agents SDK, Vercel `mcp-handler`, WorkOS / Auth0 / Clerk for auth, mcp-eval / MCPJam for testing, AgenticMarket / ATXP / FluxA for monetization — is already in production. Nothing about the plumbing is novel.

What's left is execution discipline. Eight decisions, ranked by impact:

1. Tool design (the single highest-leverage area)
2. OAuth 2.1 with PKCE (table stakes for distribution)
3. Security posture (OWASP MCP Top 10 is non-negotiable)
4. Multi-tenancy and audit (the procurement gate)
5. Observability (the iteration loop that compounds quality)
6. Distribution (the registry stack and partner relationships)
7. Monetization (per-call pricing wins; subscription dies)
8. Architecture (Streamable HTTP + stateless is the default)

A team executing this playbook ships a production-quality MCP server in 90 days. A team that waits ships in 270 days, against three competitors who already own the registry slots and the agent-side trust signals.

This is the question every SaaS founder must answer in 2026:

**When the agents that will buy from your category in 2027 are doing their training-data ingestion right now — what are they reading about your MCP server?**

If the answer is "nothing," you have approximately 12 months to change that. The work is technical, disciplined, and tractable. The cost of skipping it is invisibility from the most influential buyers of the next decade.

— *perea.ai Research, May 2026*

---

# Appendix A: Decision Tree for SaaS Founders

```
Does your SaaS already have a public REST API?
├── No → Build the API first. MCP wraps an API; it doesn't replace one.
└── Yes →
    Are you trying to expose your product to AI agents specifically?
    ├── No → You don't need MCP yet. Revisit when AI-mediated traffic exceeds 5% of API calls.
    └── Yes →
        Are your customer workflows complete in 1-3 sequential API calls today?
        ├── No → Redesign the user workflow first. MCP magnifies workflow design quality; it doesn't fix bad workflows.
        └── Yes →
            Pick deployment:
            ├── SaaS extension (most cases) → Streamable HTTP, hosted on Cloudflare Workers / Vercel Functions / your existing infra
            └── CLI augmentation → stdio, distribute via npm/PyPI/Homebrew
            ↓
            Pick auth:
            ├── B2C / individual users → OAuth 2.1 via Auth0 / Clerk / WorkOS
            ├── B2B / enterprise → OAuth 2.1 via WorkOS / Okta / Azure AD
            └── Internal-only → Static API keys + mTLS (acceptable; document the exception)
            ↓
            Pick monetization:
            ├── Existing seat-based subscription → Add per-call tier; track conversion separately
            ├── Existing per-API-call pricing → Mirror existing prices, add 5–15% MCP convenience premium
            └── Greenfield → Per-call via AgenticMarket (fast) or ATXP (full control)
            ↓
            Ship. Eval. Iterate. Compound.
```

# Appendix B: 90-Day Implementation Checklist (printable)

### Days 0–30 — Foundation
- [ ] Streamable HTTP server in production at stable URL
- [ ] OAuth 2.1 with mandatory PKCE (S256)
- [ ] `/.well-known/oauth-protected-resource` endpoint
- [ ] JWT validation: iss, aud, exp, scopes
- [ ] RBAC: tools:read / tools:invoke:safe / tools:invoke:destructive split
- [ ] 3–5 production tools, hand-written descriptions, flat schemas
- [ ] mcp-eval or MCPJam test suite, ≥10 scenarios per tool
- [ ] CI gate: schema validation + cross-client compatibility + behavioral tests
- [ ] OpenTelemetry traces and audit log NDJSON stream
- [ ] Baseline metrics captured: TPR, FPR, Precision, token usage, P95 latency

### Days 30–60 — Distribution and Compliance
- [ ] Listed in Official MCP Registry (auto-publish from CI/CD)
- [ ] Listed in Smithery, Glama, MCP.so
- [ ] llms.txt, llms-full.txt, schema.org JSON-LD on marketing pages
- [ ] 8–12 production tools (added based on day-30 data)
- [ ] Multi-tenant isolation pattern documented
- [ ] Audit logs tamper-evident with retention policy
- [ ] Zero-data-retention architecture or documented exception
- [ ] First buyer security questionnaire answered

### Days 60–90 — Monetization and Compounding
- [ ] Billable tier live (per-call recommended)
- [ ] Pricing published in manifest (machine-readable)
- [ ] Agent-metrics dashboard live and reviewed weekly
- [ ] Top 3 funnel drop-off points identified and fixed
- [ ] Day-90 metrics captured (target: 30%+ improvement on TPR, 2×+ on agent-mediated revenue)
- [ ] Public case study or benchmark published

# Appendix C: Tooling Reference

| Category | Recommended | Alternatives |
|---|---|---|
| **Framework — Cloudflare** | `agents/mcp` SDK (createMcpHandler / McpAgent) | `@modelcontextprotocol/sdk` directly |
| **Framework — Vercel** | `mcp-handler` (Next.js / Functions) | xmcp |
| **Framework — Express/Bun** | `@modelcontextprotocol/express` + `@modelcontextprotocol/node` | mcpresso |
| **Auth provider** | WorkOS / Clerk / Auth0 | Okta, AWS Cognito, Azure AD/Entra ID, Keycloak (self-hosted) |
| **Evaluation** | mcp-eval / MCPJam | mcpchecker, MCPLab |
| **Observability** | OpenTelemetry + Inspectr | Ithena, Grafana, Honeycomb, Datadog, Pydantic Logfire |
| **Security scanning** | Cisco mcp-scanner / Snyk agent-scan | Pipelock, SAFE-MCP-aware tooling |
| **Registries** | registry.modelcontextprotocol.io, PulseMCP, Smithery, Glama, MCP.so | mcp-get, mcpservers.org |
| **Marketplace billing** | AgenticMarket, MCPize | Apify Pay-Per-Event |
| **Agent-native billing** | ATXP, AgentPay | FluxA (USDC), P402 |
| **Stripe billing** | Stripe Machine Payments Protocol + Stripe Agent Toolkit | Cloudflare experimental_PaidMcpAgent |
| **Self-hosted billing** | Moesif + Stripe metered | mcp-billing-gateway, AWS API Gateway |
| **MCP-as-a-service for SaaS** | Apideck, StackOne, Truto | Albato Embedded, Cyclr, NimbleBrain, Ampersand |

---

# References

### MCP Specification and Architecture

1. Model Context Protocol — Transports specification (2025-06-18). https://modelcontextprotocol.io/specification/latest/basic/transports
2. Microsoft mcp-for-beginners — stdio Transport Guide. https://github.com/microsoft/mcp-for-beginners/blob/main/03-GettingStarted/05-stdio-server/README.md
3. Model Context Protocol — Architecture (2025-06-18). https://modelcontextprotocol.io/specification/2025-06-18/architecture
4. Model Context Protocol — Architecture overview. https://modelcontextprotocol.org/docs/learn/architecture
5. MCP TypeScript SDK V2 — Server Guide. https://ts.sdk.modelcontextprotocol.io/v2/documents/Documents.Server_Guide.html
6. modelcontextprotocol/example-remote-server — GitHub. https://github.com/modelcontextprotocol/example-remote-server
7. OpenAI Agents SDK — Model Context Protocol. https://openai.github.io/openai-agents-js/guides/mcp
8. modelcontextprotocol/go-sdk — Protocol documentation. https://github.com/modelcontextprotocol/go-sdk/blob/main/docs/protocol.md
9. MCP Specification 2025-03-26 — Transports. https://spec.modelcontextprotocol.io/specification/2025-03-26/basic/transports/
10. typescript-sdk — Server documentation. https://github.com/modelcontextprotocol/typescript-sdk/blob/main/docs/server.md

### OAuth 2.1, Authentication, Authorization

11. Ekamoira — MCP Server Security: 7 OAuth 2.1 Best Practices. January 2026. https://www.ekamoira.com/blog/secure-mcp-server-oauth-2-1-best-practices
12. WorkOS — A developer's guide to MCP auth. October 2025. https://workos.com/blog/mcp-auth-developer-guide
13. MCP Framework — OAuth 2.1 Documentation. https://www.mcp-framework.com/docs/authentication/oauth
14. ISE Developer Blog (Microsoft) — Building a Secure MCP Server with OAuth 2.1 and Azure AD. February 2026. https://devblogs.microsoft.com/ise/aca-secure-mcp-server-oauth21-azure-ad/
15. Botoi — MCP OAuth 2.1 with PKCE: secure your agent server in 7 steps. April 2026. https://botoi.com/blog/mcp-oauth-2-1-pkce-authorization-guide/
16. STOA — OAuth 2.1 + PKCE for MCP Gateways: The Complete Flow. February 2026. https://docs.gostoa.dev/blog/oauth-pkce-mcp-gateway
17. MCP Framework — Authentication Overview. https://www.mcp-framework.com/docs/authentication/overview
18. Prefect — MCP OAuth: How OAuth 2.1 Works in the Model Context Protocol. April 2026. https://www.prefect.io/resources/mcp-oauth
19. Collabnix — Building Secure and Scalable Remote MCP Servers. July 2025. https://collabnix.com/building-secure-and-scalable-remote-mcp-servers-a-complete-production-guide
20. Model Context Protocol Security — OAuth Security Patterns. https://modelcontextprotocol-security.io/build/oauth-security/

### Tool Design

21. Anthropic / Model Context Protocol — Writing Effective Tools for Agents. September 2024. https://modelcontextprotocol.info/docs/tutorials/writing-effective-tools
22. AgentPatterns — Tool Calling Schema Standards for AI Agent Development. http://agentpatterns.ai/standards/tool-calling-schema-standards/
23. Workato — MCP server tool design. https://docs.workato.com/mcp/mcp-server-tool-design
24. Axiom Studio — Writing Efficient MCP Implementations. April 2026. https://axiomstudio.ai/blog/writing-efficient-mcp-implementations-design-considerations
25. Inovaflow — How to Design MCP Tools Your AI Agent Won't Misuse. March 2026. https://www.inovaflow.io/insights/how-to-design-mcp-tools
26. ChatForest — MCP Tool Design Patterns: Building Agent-Friendly, Composable Tools. March 2026. https://chatforest.com/guides/mcp-tool-design-patterns/
27. Apigene — MCP Tools: What They Are and How to Build Them Right (2026). April 2026. https://apigene.ai/blog/mcp-tools
28. Redpanda Cloud — MCP Tool Design. March 2026. https://docs.redpanda.com/redpanda-cloud/ai-agents/mcp/remote/best-practices/
29. AgentPatterns — MCP Server Design: Building Agent-Friendly Servers. http://agentpatterns.ai/tool-engineering/mcp-server-design/
30. Leanmcp — MCP Best Practices. https://docs.leanmcp.com/building/best-practices

### Security and OWASP MCP Top 10

31. OWASP — MCP Tool Poisoning. https://owasp.org/www-community/attacks/MCP_Tool_Poisoning
32. OWASP — MCP Top 10. https://owasp.org/www-project-mcp-top-10/
33. OWASP Gen AI — LLM01:2025 Prompt Injection. April 2024. https://genai.owasp.org/llmrisk/llm01-prompt-injection/
34. OWASP Top 10 LLM — Issue 806: MCP attack mechanics missing from LLM01 and LLM06. March 2026. https://github.com/OWASP/www-project-top-10-for-large-language-model-applications/issues/806
35. PipeLab — MCP Tool Poisoning Defense. https://pipelab.org/learn/mcp-tool-poisoning/
36. Snyk Labs — Prompt Injection Meets MCP: A New Exploitation Vector Emerging? July 2025. https://labs.snyk.io/resources/prompt-injection-mcp/
37. Tenable — MCP Server Prompt Injection. April 2026. https://www.tenable.com/plugins/was/114928
38. OWASP Stuttgart — All about MCP Security (slides). September 2025. https://owasp.org/www-chapter-stuttgart/assets/slides/2025-09-25_All_About_MCP_Security.pdf
39. OWASP MCP06:2025 — Prompt Injection via Contextual Payloads. https://owasp.org/www-project-mcp-top-10/2025/MCP06-2025%E2%80%93Prompt-InjectionviaContextual-Payloads
40. Mindgard — Prompt Injection in MCP Servers: Risks, Examples, and Prevention. February 2026. https://mindgard.ai/blog/how-to-secure-mcp-servers-against-prompt-injection-attacks

### Registries and Distribution

41. Model Context Protocol — The MCP Registry. https://modelcontextprotocol.io/registry
42. Smithery — Publish documentation. https://smithery.ai/docs/build/publish
43. Smithery — Registry Search Servers. https://smithery.ai/docs/concepts/registry_search_servers
44. MCPBlog.dev — The MCP Registry Landscape. March 2026. https://mcpblog.dev/blog/2026-03-17-mcp-registry-guide
45. Automation Switch — 12,000+ MCP Servers: Every Directory Compared. April 2026. https://automationswitch.com/ai-workflows/where-to-find-mcp-servers-2026
46. Smithery — Connect agents to MCPs. https://smithery.ai/
47. xmcp Documentation — Smithery integration. https://xmcp.dev/docs/discoverability/smithery
48. DYNO Mapper — MCP Server Directories: The Complete List. April 2026. https://dynomapper.com/blog/ai/mcp-server-directories/
49. Skillful.sh — MCP Server Registries Compared. March 2026. https://skillful.sh/blog/mcp-server-registries-compared-smithery-glama-mcp-get-and-the-awesome-lists
50. Glama — MCP Registry Explained: Standardizing Server Discovery. July 2025. https://glama.ai/blog/2025-07-05-mcp-registry-standardizing-server-discovery

### Monetization

51. AgenticMarket — How to Monetize MCP Servers in 2026. March 2026. https://agenticmarket.dev/blog/how-to-monetize-your-mcp-server
52. TutuoAI — How to Sell MCP Servers — Packaging, Pricing & Distribution. March 2026. https://www.tutuoai.com/solutions/mcp-marketplace
53. AgentPay — Defining Your Pricing. https://docs.agentpay.me/mcp-server-developers/platform/pricing
54. Apify — Pricing · Exa MCP Server. October 2025. https://apify.com/agentify/exa-mcp-server/pricing
55. MCP Hive — MCP Monetization White Paper. https://mcp-hive.com/docs/mcp-monetization-whitepaper
56. FluxA — How to Monetize an MCP Server: 3 Billing Methods. April 2026. https://fluxapay.xyz/learning/how-to-monetize-an-mcp-server-3-billing-methods
57. Godberry Studios — How to Monetize MCP Servers in 2026. April 2026. https://godberrystudios.com/posts/how-to-monetize-mcp-servers-2026/
58. P402 Router — MCP Server Integration. https://www.p402.io/docs/mcp
59. AgentPay — Introduction. https://docs.agentpay.me/
60. ATXP — How to Monetize Your MCP Server. February 2026. https://atxp.ai/blog/how-to-monetize-your-mcp-server/

### Frameworks, SDKs, and Deployment

61. Cloudflare Agents — Build a Remote MCP server. https://developers.cloudflare.com/agents/guides/build-mcp-server/
62. Vercel — MCP with Vercel Functions template. https://vercel.com/new/builds/templates/template/model-context-protocol-mcp-with-vercel-functions
63. Cloudflare Agents — McpAgent docs. https://developers.cloudflare.com/agents/model-context-protocol/mcp-agent-api/
64. Vercel — Deploy MCP servers to Vercel. February 2026. https://vercel.com/docs/mcp/deploy-mcp-servers-to-vercel
65. Vercel — MCP server support changelog. https://vercel.com/changelog/mcp-server-support-on-vercel
66. Cloudflare Agents SDK — Build MCP servers (changelog). April 2025. https://developers.cloudflare.com/changelog/2025-04-07-mcp-servers-agents-sdk-updates
67. PropelAuth — Production-ready MCP server using Cloudflare Workers. February 2026. https://www.propelauth.com/post/cloudflare-worker-mcp-server
68. cloudflare/skills — MCP Server Integration reference. https://github.com/cloudflare/skills/blob/main/skills/agents-sdk/references/mcp.md
69. Toolradar — How to Deploy a Remote MCP Server. March 2026. https://toolradar.com/blog/deploy-remote-mcp-server
70. Cloudflare Agents — Build a Remote MCP server (live docs). April 2026. https://developers.cloudflare.com/agents/guides/remote-mcp-server/

### Enterprise Governance, Multi-Tenancy, Compliance

71. MCP Find — MCP for Enterprise: Multi-Tenant Architecture and Security Patterns. April 2026. https://mcp-find.org/blog/mcp-enterprise-multi-tenant
72. Tetrate — MCP for Enterprise: Multi-Team Deployment and Governance. January 2026. https://tetrate.io/learn/ai/mcp/mcp-enterprise-deployment
73. Tetrate — MCP Audit Logging: Tracing AI Agent Actions for Compliance. January 2026. https://tetrate.io/learn/ai/mcp/mcp-audit-logging
74. Broadcom — Tanzu Greenplum MCP Server: Observability and Audit Compliance. April 2026. https://techdocs.broadcom.com/us/en/vmware-tanzu/data-solutions/tanzu-greenplum-mcp-server/1-0/tnz-gp-mcp-server/logging.html
75. MCP Engine — Audit Logs (Enterprise). https://www.mcpengine.dev/wiki/tools/manage_audit
76. Truto — Zero Data Retention MCP Servers: Building SOC 2 & GDPR Compliant AI Agents. April 2026. https://truto.one/blog/zero-data-retention-mcp-servers-building-soc-2-gdpr-compliant-ai-agents
77. Ithena — MCP Audit Trails: Meeting Enterprise Compliance When AI Agents Access Your Data. https://www.ithena.one/blog/mcp-audit-trails
78. ithena-one/mcp-governance-sdk — Auditing & Logging documentation. https://github.com/ithena-one/mcp-governance-sdk/blob/master/docs/auditing-logging.md
79. Microsoft MCP Server for Enterprise — registry. November 2025. https://github.com/mcp/microsoft/EnterpriseMCP
80. IBM/mcp-context-forge — Issue 1223: Resource access audit trail. October 2025. https://github.com/IBM/mcp-context-forge/issues/1223

### Observability and Evaluation

81. mcp-eval — MCP Server Evaluation. https://mcp-eval.ai/server-evaluation
82. mcp-agent — MCP Server Evaluation. https://docs.mcp-agent.com/test-evaluate/server-evaluation
83. Inspectr — Observability for MCP Servers. https://inspectr.dev/docs/guides/mcp-observability
84. mcp-agent — mcp-eval framework. https://docs.mcp-agent.com/test-evaluate/mcp-eval
85. Inspectr — MCP Server Evals with MCPLab. https://inspectr.dev/docs/guides/mcp-server-eval-with-mcplab/
86. mcp-agent — Agent Evaluation. https://docs.mcp-agent.com/test-evaluate/agent-evaluation
87. mcp-agent — Observability documentation. https://docs.mcp-agent.com/cloud/observability
88. mcpchecker — GitHub repository. September 2025. https://github.com/mcpchecker/mcpchecker
89. mcp-eval Documentation — Mintlify. https://mcp-eval.mintlify.app/
90. MCPJam — Evaluating MCP servers — a quick guide. November 2025. https://www.mcpjam.com/blog/mcp-evals

### Production Case Studies

91. All Things Open — How Block scaled MCP across 12,000 employees in two months. December 2025. https://allthingsopen.org/articles/block-scaled-mcp-12000-employees-15-job-functions
92. Ry Walker Research — Stripe Minions. February 2026. https://rywalker.com/research/stripe-minions
93. Engineering.fyi — Minions: Stripe's one-shot, end-to-end coding agents. February 2026. https://www.engineering.fyi/article/minions-stripe-s-one-shot-end-to-end-coding-agents
94. Stripe — Atlassian case study. https://stripe.com/customers/atlassian
95. Cloudflare — mcp-server-cloudflare repository. November 2024. https://github.com/cloudflare/mcp-server-cloudflare
96. Stripe — Github case study. http://stripe.com/customers/github
97. dev.to — Building a Paid MCP Server with Cloudflare Workers and Stripe. May 2025. https://dev.to/hideokamoto/building-a-paid-mcp-server-with-cloudflare-workers-and-stripe-1m96
98. Medium — How Stripe Built Secure Unattended AI Agents Merging 1,000 Pull Requests Weekly. February 2026. https://medium.com/@oracle_43885/how-stripe-built-secure-unattended-ai-agents-merging-1-000-pull-requests-weekly-1ff42f3fe550
99. Cloudflare — MCP Demo Day: How 10 leading AI companies built MCP servers. May 2025. https://blog.cloudflare.com/mcp-demo-day/
100. Better Programming — Datadog, Block, and Cloudflare All Abandoned the Default MCP Pattern. March 2026. https://betterprogramming.pub/i-built-3-mcp-servers-for-the-same-api-one-used-98-fewer-tokens-4b70c6eae6b8

---

*This white paper is a public draft published by perea.ai Research under CC BY 4.0. Comments, corrections, and case studies are welcome at research@perea.ai. The framework, scoring rubric, and implementation playbook are released for free use. Attribution is appreciated but not required.*

*Version 1.0 — May 2026*

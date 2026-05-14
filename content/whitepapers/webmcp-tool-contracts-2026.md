---
title: "WebMCP: The Site-Side Playbook for Agent-Ready Web Applications"
subtitle: "How `navigator.modelContext`, the W3C Community Group spec, and Chrome 146's early preview turn every page into a callable tool surface for AI agents — and what to ship in your first 30 days"
publication: "perea.ai Research"
authors: ["Dante Perea"]
version: "1.0"
status: "Scheduled"
date: "2026-05"
audience: "Founders and engineers shipping web applications who want their site to be the one AI agents can actually call — not the one they have to scrape, screenshot, and guess at."
length: "~6,800 words"
license: "CC BY 4.0"
description: "WebMCP is the site-side half of the agent-ready web. Where backend MCP servers expose data and global services, WebMCP exposes the verbs your live site already implements — booking flows, search, cart, support tickets — as structured tools an AI agent can invoke directly through the browser. This paper synthesizes 82 primary and tier-1-secondary sources into one place: the W3C Draft Community Group Report (April 2026), the Chrome 146 Early Preview Program (Feb 2026), the MCP-B reference implementations, the agent-identity and prompt-injection design debates, and the conversion-rate evidence (1,890-call arXiv benchmark, Conductor 2026, Visibility Labs 94-store study, Shopify Redmond case) that justify shipping today."
profile: "technical-playbook"
dateModified: "2026-05-09"
version_history:
  - { version: "1.0", date: "2026-05-09", note: "initial publication" }
topical_entities:
  - "WebMCP"
  - "navigator.modelContext"
  - "W3C Web Machine Learning Community Group"
  - "Chrome 146 Early Preview Program"
  - "Model Context Protocol"
  - "MCP-B"
  - "AI agent browser interaction"
  - "Tool contracts"
  - "Agentic commerce"
keywords:
  - "WebMCP 2026"
  - "navigator.modelContext implementation"
  - "Chrome 146 WebMCP DevTrial"
  - "agent-ready website"
  - "WebMCP declarative API"
  - "WebMCP imperative API"
  - "WebMCP polyfill"
  - "MCP-B vs WebMCP"
  - ".well-known webmcp manifest"
  - "agent identity ModelContextClient"
  - "tool surface optimization"
  - "site-side agent playbook"
---

# Foreword

Web pages have been built for two readers for thirty years. Humans, who scan the visual layout. Search crawlers, which parse the markup for content. The third reader — AI agents that need verb-level access, not just content — has arrived in production and is now a measurable share of incoming traffic on most consumer-facing sites.[^65][^66][^67]

The site-side half of that interface is WebMCP. Backend MCP servers, popularized by Anthropic in November 2024 and now backed by Google, OpenAI, Microsoft, and Amazon, expose data and persistent services to agents anywhere on any platform.[^21] WebMCP, the proposed W3C Community Group Draft co-authored by Microsoft and Google through the Web Machine Learning Community Group, exposes the *verbs* your live page already implements — search, filter, add-to-cart, book, submit ticket — as structured tools an in-browser agent can invoke directly.[^1][^5][^59]

This paper synthesizes 82 sources into one playbook. The primary record includes the W3C Draft Community Group Report,[^1] the Chrome Developer Blog announcement,[^5] the MCP-B reference documentation,[^13][^14] the canonical GitHub issue threads where the spec is being shaped,[^11][^12] the 1,890-call arXiv preprint benchmarking token efficiency,[^16] the Microsoft Edge engineer's update post,[^59] and the Shopify Redmond case study.[^76]

The secondary record includes the tier-1 publications: VentureBeat,[^51] Search Engine Land,[^52] The Verge,[^54] TechCrunch,[^58] plus analyst and benchmark data from Forrester,[^55] Gartner,[^56] Digital Bloom,[^65] WebFX,[^66] and Visibility Labs.[^67] No other public source consolidates the IDL surface, the Chrome implementation status, the open design debates, the conversion-rate evidence, and the per-vertical 30-day playbook in one place as of May 2026.

# Executive Summary

**The thesis.** WebMCP is the verb layer of the agent-ready web. Every site that already serves humans now needs a parallel, declarative, callable interface for agents — not because agents are a future scenario, but because agent-routed traffic already converts at three to ten times the rate of organic search and is growing 3× year over year.[^65][^66][^67][^69]

**Where it stands as of May 2026.** WebMCP shipped as a Chrome 146 DevTrial on February 10, 2026, behind the `chrome://flags/#enable-webmcp-testing` flag.[^5] The W3C Draft Community Group Report was published February 12, 2026 and updated April 23, 2026.[^1] The implementation is in stable Chrome builds but still flag-gated pending full rollout.[^5] Microsoft Edge support is expected next given the shared Chromium engine and Microsoft's co-authorship of the spec; Microsoft's Copilot Studio 2026 Wave 1 (April–September 2026) explicitly plans connecting agents to external data via custom MCP servers.[^47][^60] Firefox and Safari participate in the working group but have not announced shipping timelines.[^21]

**The two APIs.** The Declarative API turns any HTML form into an agent-callable tool with two attributes — `toolname` and `tooldescription` — and an optional `toolautosubmit`. The browser auto-translates form fields into a JSON schema and dispatches a `SubmitEvent` carrying an `agentInvoked` flag so the page can distinguish agent submissions from human ones.[^5][^31] The Imperative API, `navigator.modelContext.registerTool({name, description, inputSchema, execute, annotations})`, handles complex flows where the available actions change based on application state — register a `searchProducts` tool on the catalog page and a `placeOrder` tool only when items are in the cart.[^1][^5][^29]

**The polyfill stack.** Three live polyfills cover the production gap before native browser support is universal: `@mcp-b/global` (the full MCP-B runtime, 285KB, includes prompts/resources/sampling/elicitation and a desktop-MCP bridge), `@mcp-b/webmcp-polyfill` (strict-core, SSR-safe, no MCP extensions), and the 2.94KB `webmcp-polyfill` challenger (97× smaller, 70 tests, 0 dependencies).[^8][^36] React, Vanilla JS, Rails, Angular, and Phoenix LiveView reference implementations exist; the WebMCP-org maintains six-tool task and bookmark CRUD examples for each.[^7][^14]

**The token economics.** The arXiv benchmark of 1,890 live API calls across e-commerce, authentication, and dynamic-content scenarios — tested on GPT-3.5-turbo, GPT-4o-mini, GPT-4o, and Claude — shows a mean 67.6%[^16] token reduction (range 53.5–78.6%[^16]), 34–63% lower API cost,[^16] and quality essentially unchanged at 97.9% versus 98.8% baseline (p < .001, Cohen's d = 12.3–23.3).[^16] Channel.tel and Hacker News benchmarks show up to 89–90%[^17] token reduction and ~98% task accuracy versus 85%[^25] on screenshot-based agents.[^17][^25]

**The conversion premium.** Per Digital Bloom's 446,405-visit cross-platform benchmark, agent-routed traffic converts at 16.8%[^65] from Claude, 14.2-15.9%[^65] from ChatGPT, 10.5%[^65] from Perplexity, and 3.0% from Gemini, against a Google organic baseline of 1.76-2.8%.[^65] Visibility Labs' twelve-month study of 94 e-commerce stores[^67] puts ChatGPT at 1.81%[^67] conversion versus 1.39%[^67] for non-branded organic — a 31%[^67] premium with ChatGPT visits growing 1,079%[^67] year over year.[^67] ECDB and Similarweb data show ChatGPT referrals at 11.4%[^69] conversion outperforming direct (10.2%[^69]), paid search (9.3%[^69]), and email (4.6%[^69]) across 94 e-commerce sites.[^69]

**The open gaps.** The v1 spec defers three things production deployments will need to handle: agent identity (`ModelContextClient` exposes only `requestUserInteraction()`, no `agentId`, no `grantedScopes`, no `correlationId` per Issue #96),[^11][^23] tool discovery (no `.well-known/webmcp.json` standardized yet, though `webmcpregistry.org` and Colin Knapp's `/.well-known/mcp.json` proposal exist),[^32] and prompt-injection mitigation (Issue #11's "clipboard" proposal would store tool outputs by reference, with the agent never seeing raw values).[^12]

**The competitive position.** Forrester predicts 30% of enterprise application vendors will launch their own MCP servers in 2026.[^55] Cloudflare and Shopify have both shipped agent-friendly infrastructure (Markdown for Agents at the network edge,[^72][^73] Storefront MCP since Summer '25 across all Shopify stores).[^77] Per Eric Gerl: the sites with well-defined tool surfaces will be immediately discoverable when manifest-based discovery arrives; the ones without will be invisible to agents the way sites without sitemaps were invisible to early search engines.[^79]

# 1. The W3C spec, decoded — what `navigator.modelContext` actually exposes

The Draft Community Group Report defines a single new attribute on the `Navigator` interface: `[SecureContext, SameObject] readonly attribute ModelContext modelContext`.[^1] The `SecureContext` decorator means WebMCP only exists on HTTPS pages — the API will not appear on plain HTTP, which prevents eavesdropping on tool calls and enforces the same security floor the rest of the modern web platform inherits.[^1] `SameObject` guarantees that every access to `navigator.modelContext` returns the same instance per Navigator object, so all tool registrations end up in the same registry.[^1]

The `ModelContext` interface itself exposes one canonical method in the formal spec: `registerTool(ModelContextTool tool, optional ModelContextRegisterToolOptions options = {})`.[^1] Earlier proposal text and the Chromium implementation also expose `provideContext(options)` (atomically replacing the entire toolset), `unregisterTool(name)` (removing a single tool by name), and `clearContext()` (wiping all registered tools).[^2][^62] Across these four primitives, the registration model is straightforward: the page declares what it can do at any point in its lifecycle, and the browser exposes that declaration to whichever agent the user is interacting with — Chrome's built-in Copilot, a third-party browser extension, an in-page assistant, or via the Chrome DevTools MCP bridge to a desktop client.[^9][^17]

The `ModelContextTool` dictionary is the unit of declaration. Its required fields are `name` (a `DOMString` that must be unique per page — registering a duplicate throws `InvalidStateError`), `description` (a `DOMString` describing what the tool does in natural language for the agent's reasoning), and `execute` (a `ToolExecuteCallback` returning `Promise<object>`).[^1] Optional fields are `title` (a `USVString` for display in possibly-native UIs, distinct from `name` because UI strings live in the user-visible Unicode range), `inputSchema` (a JSON Schema object that the browser MUST validate against before invoking `execute`), and `annotations` (a `ToolAnnotations` dictionary including `readOnly = false` and `untrustedContentHint`).[^1][^4]

`untrustedContentHint` is the single most important annotation for production safety. It is a boolean signal to the client that the tool's response payload requires heightened security handling — sanitization, spotlighting, or selective hiding from the agent's prompt context.[^4] No reliable sanitization mechanism for natural-language prompt injection exists, which is why the W3C security/privacy considerations document flags prompt injection in three categories (tool-metadata injection, output injection, tool-as-target) without proposing an in-spec sanitizer; the annotation puts the responsibility on the agent client where it belongs.[^4][^41]

The `ModelContextClient` interface — passed as the second argument to every `execute` callback — represents the agent invoking the tool. As shipped in the Draft Community Group Report, it exposes exactly one method: `requestUserInteraction(callback)`.[^1] This is the human-in-the-loop primitive: a tool can pause execution, request user confirmation through the browser's UI, and either continue or cancel based on the response. A purchase tool calls `await client.requestUserInteraction(() => confirm('Buy product X for $49.99?'))` before placing the order, regardless of how confident the agent was that the user wanted to buy it.[^15][^22]

What `ModelContextClient` does *not* expose is the gap that will matter most in production. There is no `agentId` to identify which caller invoked the tool — Chrome's Copilot, a research extension, and a malicious third-party script all look identical to the page once they reach the `execute` callback.[^11][^23] There is no `grantedScopes` field for the tool to verify that the user authorized this category of action ("read accounts" versus "transfer funds"). There is no `correlationId` linking the call to a broader agent session for audit reconstruction. David Crowe's open Issue #96 (February 2026), building on Khushal Sagar's earlier identity discussion in #54, proposes adding all three primitives in v1 rather than deferring to a later draft.[^11] Until the spec adopts identity, every WebMCP tool should treat its own `execute` callback the same way it treats a public unauthenticated API endpoint: validate at the boundary, never trust the description, and never assume the caller has the user's permission to do what they're asking.[^41]

The Declarative API is the second registration path, defined alongside the imperative API rather than as a fallback.[^5][^45] On any HTML form, the attributes `toolname` and `tooldescription` cause the browser to auto-translate the form's input fields into a JSON Schema; the agent sees a structured tool whose parameters mirror the form fields, including their types, validation rules, and required attributes.[^22] The optional `toolautosubmit` attribute decides whether the agent can submit autonomously or whether the browser pre-fills fields, focuses the submit button, and waits for human click — a coarse but effective consent gate.[^15] When a form is submitted as a result of agent invocation, the browser fires a `SubmitEvent` with `agentInvoked = true`, letting the page route the request differently if it wants to (e.g., return structured JSON to the agent via `respondWith()` rather than re-render an HTML thank-you page).[^31] Per-input attributes `toolparamtitle` and `toolparamdescription` annotate individual fields for the schema; CSS pseudo-classes `:tool-form-active` and `:tool-submit-active` let the page style the visual indicator the user sees during agent invocation.[^15][^31]

The spec's posture on the relationship between WebMCP and MCP took a year to crystallize. The original explainer described the page as being "the MCP server"; Patrick Brosset (Microsoft Edge engineer working on the spec) corrected this in his February 2026 update post: "It's an API for exposing tools from a webpage. The browser then translates those tools into MCP format when talking to agents. Under the hood, the browser is doing the protocol work for you."[^59] The page is a *Model context provider*; the browser is the protocol translator between the page and the agent. This matters because it explains why WebMCP omits MCP's server-side concepts (resources, prompts, sampling at the protocol layer): the browser handles translation, and the page's job is just to declare its verbs cleanly.[^6][^59]

Two structural decisions reduce the v1 surface area in ways production deployments should plan around. First, cross-origin tool registration is scoped out — Issue #52 resolved in November 2025 that only the website's own origin can register tools on the page; cross-origin iframes cannot inject tools into the parent's WebMCP context.[^3][^20] This eliminates the most obvious attack surface (a malicious ad iframe registering a `transferFunds` tool on a banking site's domain) but also means cross-origin agent flows have to be designed at the protocol layer — typically by routing through a backend MCP server, the way Microsoft's Copilot Studio 2026 Wave 1 plan describes.[^60] Second, the Chromium prototype currently puts the consumer-side API (`listTools()`, `executeTool()`) on a separate `navigator.modelContextTesting` interface; the spec has not finalized whether this separation is permanent or whether the consumer surface eventually merges back into `navigator.modelContext`.[^13] Issues #51 and #74 track this discussion. For sites publishing tools, the practical implication is that bridges and inspectors (the Model Context Tool Inspector extension, the MCP-B `BrowserMcpServer.callTool()` method) abstract the consumer instability, but you can't rely on a stable consumer-side standard surface today.[^7][^46]

## Quotable Findings — Section 1: The spec decoded

1. The W3C Draft Community Group Report exposes `[SecureContext, SameObject] readonly attribute ModelContext modelContext` on the Navigator interface — HTTPS-only, single instance per Navigator object.[^1]
2. `ModelContextClient` in v1 exposes exactly one method, `requestUserInteraction(callback)` — no agent identity, no granted scopes, no correlation ID, per the open Issue #96 design debate.[^1][^11]
3. Cross-origin tool registration was scoped out of v1 in November 2025 (Issue #52); only the site's own origin can register tools on the page.[^3][^20]
4. The `ToolAnnotations.untrustedContentHint = true` boolean is the WebMCP spec's primary defense primitive against output prompt injection — signaling that the payload requires sanitization, spotlighting, or selective hiding from the agent.[^4]
5. Per Microsoft Edge engineer Patrick Brosset, "It's an API for exposing tools from a webpage. The browser then translates those tools into MCP format when talking to agents."[^59]

# 2. The two APIs in production code — declarative + imperative + framework integrations

Most sites should ship the Declarative API first because the work is two HTML attributes. On any existing form — a contact form, a product search, a newsletter signup, a support ticket submitter — adding `toolname="search_products"` and `tooldescription="Search the product catalog by keyword and category"` is enough for a WebMCP-aware browser to surface the form as an agent-callable tool.[^5][^22][^45] The browser auto-generates the input schema from the form's existing input fields, including their `type`, `required`, `pattern`, and `min`/`max` validation rules; the agent receives a structured tool description without the page author writing any JSON Schema by hand.[^29][^45]

The crucial detail is consent. By default — when `toolautosubmit` is absent — the browser fills the form fields visibly, focuses the submit button, and waits for the human to click it.[^15][^49] This is the right default for any form that mutates state: account changes, purchases, data deletion. For idempotent, read-only flows (a product search, a store locator), adding `toolautosubmit="true"` lets the agent submit autonomously and stream results back. Per-input attributes `toolparamtitle` and `toolparamdescription` annotate individual fields for the schema; CSS pseudo-classes `:tool-form-active` and `:tool-submit-active` let designers style the visual indicator the user sees while an agent is interacting with the form.[^15][^31] Form-level events — `toolactivated` (fields pre-filled), `toolcancel` (user cancels) — give the page a hook to log telemetry or revert state.[^31]

The Imperative API handles everything beyond plain forms: stateful flows, multi-step interactions, dynamic toolsets that change based on application state. The canonical signature is `navigator.modelContext.registerTool({name, description, inputSchema, execute, annotations})` where `inputSchema` is a JSON Schema object validated by the browser before invoking `execute`.[^1][^5] The `execute` callback is plain JavaScript: it can call your existing API endpoints, read DOM state, mutate the cart, render UI, and call the analytics tracker the page already uses.[^24][^28] When the callback receives a `client` parameter exposing `requestUserInteraction()`, the tool can pause execution and ask for human confirmation — the standard pattern for "purchase $49.99 of stamps?" before placing the order.[^15][^22]

A short example captures the imperative shape. A flight-search site registers `searchFlights` with a JSON Schema describing origin, destination, and date as required fields, an `execute` body that calls the existing `/api/flights/search` endpoint, and `annotations: { readOnlyHint: true }` to tell the agent the call has no side effects:[^5][^22]

```javascript
if ("modelContext" in navigator) {
  navigator.modelContext.registerTool({
    name: "search_flights",
    description: "Search available flights by origin and destination",
    inputSchema: {
      type: "object",
      properties: {
        origin: { type: "string", pattern: "^[A-Z]{3}$" },
        destination: { type: "string", pattern: "^[A-Z]{3}$" },
        date: { type: "string", pattern: "^\\d{4}-\\d{2}-\\d{2}$" }
      },
      required: ["origin", "destination", "date"]
    },
    annotations: { readOnlyHint: true },
    async execute({ origin, destination, date }, client) {
      const results = await flightAPI.search({ origin, destination, date });
      trackEvent("search", { interaction_source: "agent" });
      return { content: [{ type: "text", text: JSON.stringify(results) }] };
    }
  });
}
```

The conditional `if ("modelContext" in navigator)` is the standard feature-detection guard for shipping today before native support is universal.[^5][^45] The `interaction_source: "agent"` analytics field is the cheapest, most valuable instrumentation to add: same `trackEvent` schema, same GA4/Segment/Amplitude pipeline, one new dimension that segments agent traffic from human traffic in every existing report.[^24]

For React applications, two npm packages cover the deployment path. `@mcp-b/react-webmcp` exposes the full MCP-B runtime — Zod schema validation, prompts, resources, sampling, elicitation, and the `McpClientProvider` + `useMcpClient` hooks for consuming MCP servers from the browser.[^9][^14] `usewebmcp` is the strict-core variant for teams that only want `navigator.modelContext` registration without MCP extensions. Both handle the StrictMode trap automatically: in development, React double-mounts components, which would cause a naïve `registerTool` call inside a custom hook to throw `InvalidStateError "Duplicate tool name"` on the second mount.[^40] The official hooks guard the registration path; if you're rolling your own, use `useEffect` with a `useRef(false)` guard and clean up in the unmount handler.[^40]

A typical React tool registration looks like:[^9]

```tsx
import { useWebMCP } from '@mcp-b/react-webmcp';
import { z } from 'zod';

export function LikeTool() {
  useWebMCP({
    name: 'posts_like',
    description: 'Like a post by ID. Increments the like count.',
    inputSchema: { postId: z.string().uuid().describe('The post ID to like') },
    annotations: { readOnlyHint: false, idempotentHint: true },
    handler: async ({ postId }) => {
      await api.posts.like(postId);
      return { success: true, postId };
    }
  });
  return null;
}
```

Rails takes the Stimulus-controller path. After `bin/importmap pin @mcp-b/global` (Rails 7+ with importmap) or `npm install @mcp-b/global` (with esbuild/Vite), a Stimulus controller wires registration to the framework's `connect()`/`disconnect()` lifecycle:[^14]

```javascript
import { Controller } from "@hotwired/stimulus";
import "@mcp-b/global";

export default class extends Controller {
  static values = { name: String, description: String };
  #registration = null;

  connect() {
    if (!('modelContext' in navigator)) return;
    this.#registration = navigator.modelContext.registerTool({
      name: this.nameValue,
      description: this.descriptionValue,
      inputSchema: { type: 'object', properties: {} },
      execute: async () => ({ content: [{ type: 'text', text: 'Done' }] })
    });
  }

  disconnect() { this.#registration?.unregister(); }
}
```

Place the controller on `<body>` to persist tools across Turbo navigations:[^14] `<body data-controller="global-tools">`. For the long tail of WordPress sites — still 40% of the public web — the `wmcp.dev` plugin adds WebMCP declarative attributes to Contact Form 7, Gravity Forms, WPForms, and WooCommerce in a five-minute install with no code changes.[^41]

The polyfill choice is the one engineering decision worth thinking about. `@mcp-b/global` is the full runtime: 285KB minified+gzipped, includes the polyfill, the MCP bridge with prompts/resources/sampling/elicitation, transports for cross-context communication, and the desktop-MCP relay that lets browser tools be consumed by Claude Desktop or Cursor via WebSocket+stdio.[^8] `@mcp-b/webmcp-polyfill` is the strict-core variant: only `navigator.modelContext.registerTool`/`unregisterTool`, SSR-safe out of the box, no MCP extensions.[^8] The 2.94KB challenger `webmcp-polyfill` (97× smaller than `@mcp-b/global`) is a drop-in for teams that already have a different MCP bridge and only need the polyfill — 70 tests passing, 0 dependencies, and feature-detects native Chrome support so it steps aside on Chrome 146+.[^36] The companion `webmcp-payments` package adds x402 payment middleware per tool call.[^36] Pick by bundle-size budget and by whether you need the MCP bridge: most production deployments using Stripe, Anthropic, or OpenAI directly do not need the bridge and can save 282KB by choosing the strict polyfill.

Testing in development uses Chrome's Model Context Tool Inspector extension, the official Chrome-team inspection tool: it lists every tool registered on the active page, lets developers invoke tools manually with custom parameters, validates schemas, and integrates with the Gemini API for live agent invocation.[^46] Setup is `chrome://flags/#enable-webmcp-testing` set to Enabled, relaunch Chrome, install the extension from the Chrome Web Store; verification with `"modelContext" in navigator` returning `true` on any HTTPS page confirms the flag took effect.[^46]

## Quotable Findings — Section 2: Production code

1. The Declarative API turns any HTML form into an agent-callable tool with two attributes — `toolname` and `tooldescription` — plus an optional `toolautosubmit`; the browser auto-generates the JSON Schema from the form's existing input fields.[^5][^22]
2. React StrictMode trap: a custom hook wrapping `registerTool` throws `InvalidStateError "Duplicate tool name"` on the second mount; use `@mcp-b/react-webmcp`'s `useWebMCP` or guard with `useRef(false)`.[^40]
3. Rails Stimulus pattern: `data-controller="webmcp"` with lifecycle in `connect()`/`disconnect()`; place controllers on `<body>` for Turbo navigation persistence.[^14]
4. The 2.94KB `webmcp-polyfill` challenger is 97× smaller than `@mcp-b/global` (285KB), with 70 tests, 0 dependencies, and feature-detects native Chrome support.[^36]
5. The `interaction_source: "agent"` field on existing analytics events is the cheapest WebMCP instrumentation — same `trackEvent` schema, one new dimension on the existing GA4/Segment/Amplitude pipeline.[^24]

# 3. The token economics and the agent-conversion premium

The first economic case for WebMCP is the token bill. The arXiv preprint reports a mean 67.6%[^16] token reduction with quality essentially unchanged at 97.9%[^16] versus 98.8% baseline.[^16] The per-scenario breakdown matters: e-commerce flows hit 78.6%[^16] reduction (3,228 → 692 tokens), dynamic content 70.9%[^16] (2,318 → 676), and authentication 53.5%[^16] (1,390 → 646). API cost reduction was 34–63%[^16] across scenarios.[^16] All improvements were statistically significant at p < .001 with Cohen's d between 12.3 and 23.3.[^16] The independent 270-call validation on a stock WordPress 6.5 + WooCommerce stack confirmed portability: 57%[^16] token reduction, 45%[^16] cost saving, 25–37%[^16] latency improvement.[^16]

The Channel.tel and Hacker News benchmarks pushed those numbers higher in narrower scenarios. A WebMCP-org maintainer forked the Chrome DevTools MCP server and reported approximately 90%[^17] decrease in token usage on agent-driven web testing flows.[^17] Channel.tel's single-agent A/B comparison reframed the same delta: browser agents burn 1,500-2,000 tokens per screenshot at 300ms[^25] vision-model processing latency and roughly 85%[^25] best-case task accuracy; WebMCP-equivalent flows use ~150-200 tokens at <50ms[^25] latency and ~98%[^25] accuracy.[^25] At 1,000 interactions per day, the token bill drops from ~1.8M tokens to ~180K[^25] — a 10× reduction in API spend.

The economic case is no longer just cost reduction. The conversion-rate premium on agent-routed traffic is what reframes WebMCP from "infrastructure efficiency" to "revenue surface."

Cross-platform conversion benchmarks have converged in late 2025 and early 2026. Digital Bloom's 446,405-visit dataset measured Claude at 16.8%[^65] conversion, ChatGPT at 14.2-15.9%,[^65] Perplexity at 10.5%,[^65] and Gemini at 3.0%[^65] — against a Google organic baseline of 1.76-2.8%.[^65] WebFX's 2.3-billion-session dataset[^66] found 2025 session-conversion rates of 54.15%[^66] for generative AI traffic versus 45.23%[^66] for organic search, 34.15%[^66] for paid search, and 22.57%[^66] for direct.[^66] Visibility Labs' twelve-month study[^67] put ChatGPT at 1.81%[^67] conversion versus 1.39%[^67] for non-branded organic — a 31%[^67] premium with ChatGPT visits growing 1,079%[^67] (1,544 → 18,202 visits Jan–Dec 2025).[^67] ECDB and Similarweb data[^69] show ChatGPT referrals at 11.4%[^69] conversion, beating direct (10.2%[^69]), paid search (9.3%[^69]), email (4.6%[^69]), and social (3.8%[^69]).

What unifies the studies is the explanation. Per Searchless.ai's cross-source synthesis (Ahrefs first-party data plus Digital Bloom, Demand Local, and Position Digital), AI referral traffic is small in volume but disproportionate in value — Ahrefs reported AI traffic at 0.5% of total visitors but driving 12.1% more signups than expected from that share alone.[^68] Per Visibility Labs: "By the time the customer clicks on a product recommendation from ChatGPT, they're already past the awareness and consideration stages. They arrive ready to evaluate and purchase, not to browse."[^67] The agent-routed visitor is mid-funnel, not top-of-funnel; the conversion rate reflects intent compression, not better targeting.

The dark-traffic problem is the trap most analytics setups still fall into. Per Digital Bloom and Loamly, 70.6% of AI traffic arrives without referrer headers and gets misclassified as "Direct" in GA4.[^64][^65] That dark AI traffic converts at 10.21% versus 2.46% for non-AI direct traffic — a 4.1× premium hidden in the same bucket.[^65] If the site's "Direct" channel is growing faster than brand awareness should explain, some of that growth is AI referral. The fix is server-side logging or specialized AI-traffic detection (Panxo's product, Matomo's AI Assistant tracking) that classifies by behavioral signal rather than just referrer.[^65][^69] Until the classification layer is in place, the site is leaving its highest-converting channel uncountable.

The agentic-commerce conversion rates reported by UCPHub from Q1 2026 Shopify Agentic Storefront pilots push the upper bound further: Social 1.2%,[^71] Organic Search 2.8%,[^71] Direct 3.5%,[^71] Agentic Discovery (UCP) 19.8%[^71] average / 29.5%[^71] high-intent.[^71] Cart abandonment moves with it — humans abandon ~70% of carts; agents abandon under 5% because the comparison happened upstream. The agent's "visit" is the final handshake, not the funnel.[^71] Presta's early-Shopify benchmark cohort observed 28% higher conversion from AI-driven traffic versus traditional search; merchants implementing dual UCP/MCP coverage captured 40% more agentic traffic than single-protocol stores.[^74] Izwiq reports an aggregate "11× rate" for AI-driven order growth over standard organic.[^75]

Cintra's synthesis layered the Salesforce Q3 2025 finding on top: AI assistant traffic grew 119% year-over-year in the first half of 2025, with AI-channel conversion rates 700% higher than social media.[^73] Conductor's 2026 benchmark via Emarketed: AI referral traffic at 1.08% of all website traffic but 4.4× organic conversion, 68% more time on site; ChatGPT alone drives 87.4% of all AI referral volume.[^70] The Forbes Agency Council, citing Conductor, frames AI-driven traffic growth at 165× faster than organic search.[^70]

The Shopify Redmond case study is the most instructive single deployment record on the public web. A two-person team built a production AI commerce agent on Shopify's Storefront MCP in ten weeks, launched it in February 2026, and now handles thousands of customer conversations monthly with high accuracy — using Anthropic prompt caching to reduce token costs by up to 10× on cache hits and overall AI spend by roughly half.[^76] The MCP infrastructure paid for itself a second time when Redmond used the same Shopify MCP + Claude pairing to migrate historical customer and order data across three legacy stores, eliminating a paid third-party migration app. "The Shopify MCP has definitely given us... ability to do faster and cheaper than... we were able to do before," per the case study.[^76]

The number that should anchor the decision is on the cost side and the revenue side simultaneously. WebMCP cuts the agent's per-action token bill by roughly two-thirds; the agent-routed visitor converts roughly three to ten times better than the organic search visitor. Combined, the unit economics on agent traffic are not in the same league as classical SEO — they are categorically different. Sites optimizing for agent-readability today are buying a position the agent platforms will defend (because cheaper-to-call sites are cheaper for the agent platform to operate), not just a marketing channel.

## Quotable Findings — Section 3: Token economics and conversion

1. The arXiv 1,890-call benchmark across GPT-3.5/4o-mini/4o and Claude shows mean 67.6% token reduction (range 53.5–78.6%), 34–63% cost reduction, with quality 97.9% vs 98.8% baseline — all p < .001, Cohen's d 12.3–23.3.[^16]
2. Per Digital Bloom's 446,405-visit dataset, agent-routed traffic converts at Claude 16.8%, ChatGPT 14.2-15.9%, Perplexity 10.5%, Gemini 3.0% — versus Google organic 1.76-2.8%.[^65]
3. Visibility Labs' 94-store study (12 months, 9.46M organic + 135K ChatGPT sessions) measured ChatGPT at 1.81% conversion vs 1.39% non-branded organic — 31% premium with 1,079% YoY traffic growth.[^67]
4. Per UCPHub's Q1 2026 Shopify Agentic Storefront pilots, agentic discovery converts at 19.8% average and 29.5% high-intent versus organic search at 2.8% and direct at 3.5%.[^71]
5. Per Shopify's Redmond case study, a two-person team built a production AI commerce agent on Storefront MCP in 10 weeks; Anthropic prompt caching reduced token costs by up to 10× on cache hits and overall AI spend by roughly half.[^76]

# 4. Discovery, identity, and the open-spec gaps that production needs to know

Three gaps in the v1 spec deserve named attention because they shape what production deployments must work around. The first is discovery. The W3C proposal explicitly lists "no built-in mechanism for client applications to discover which sites provide callable tools without visiting or querying them directly" as a known limitation.[^2] An agent today has to navigate to a page and inspect `navigator.modelContext` post-load to know what verbs are available — analogous to discovering `<form>` elements only after fetching the document.[^43] The proposal acknowledges this gap and points to two future-work directions: search engines and directories that index tool-bearing sites, and manifest-based declarative tool definitions placed at well-known URLs.[^2]

Three independent proposals are competing for the manifest slot. Web MCP Registry crawls and validates `/.well-known/webmcp.json` manifests, verifying spec conformance and assigning trust badges so agents can search for tools by name or tag.[^32] Colin Knapp's draft specification proposes `/.well-known/mcp.json` for endpoint metadata plus `/.well-known/skills.md` for lightweight agent instructions, building on RFC 8615 (OAuth Authorization Server Metadata, WebFinger, Security.txt, OpenID Connect Discovery).[^32] The modelcontextprotocol Universal MCP Manifest discussion #2505 proposes `mcp-manifest.json` declaring install methods, config parameters with `obtain_url` for API keys, transport spec, when-to-use heuristics, and pricing — including `x402` for autonomous agents with wallets.[^18] The hyperpolymath SEP #1960 proposed a structured `/.well-known/mcp` with `mcp_version`, endpoints, capabilities, authentication, security, rate_limits, registration, and `jwks_uri` fields, eventually closed in favor of SEP-1649 under the new PR-based SEP workflow.[^19] None of these are yet the authoritative WebMCP discovery format. For sites publishing tools today, the practical move is to ship something compliant with the most likely future shape — JSON metadata at `/.well-known/webmcp.json` with `spec`, `site.name`, `pages[]`, `flows[]` per the Halmob Next.js pattern.[^40]

The second gap is agent identity. The `ModelContextClient` interface, as shipped in the Draft Community Group Report, exposes only `requestUserInteraction()`.[^1] When an agent calls `getBalance` on a banking site, the page cannot tell whether the caller is Chrome's built-in Copilot, a third-party browser extension that has passed a security review, or an unknown research prototype. The tool's `execute` callback fires the same way for all three.[^11][^23] David Crowe's Issue #96 (February 18, 2026) builds on Khushal Sagar's earlier Issue #54 identity discussion to propose three primitives for v1, not v2: a browser-verified `agentId`, enforceable `requiredScopes` (not advisory hints), and a `correlationId` linking each invocation to the broader agent session.[^11][^23] "Identity deferred is identity absent" is the operational summary; until the spec ships these primitives, every WebMCP tool should be designed assuming any agent on the planet can invoke it.[^23][^41]

`SubmitEvent.agentInvoked` is the closest thing the spec has today to a per-call distinguishing signal — and it only tells the page that *some* agent acted on the form, not *which* one.[^23][^31] For the declarative API path, the page can branch behavior based on this flag: a consumer-recommendation form might allow autosubmit on agent calls but require human click on direct posts; a financial transaction might do the opposite. For the imperative API path, the `execute` callback has no equivalent flag — the tool author cannot distinguish agent-driven calls from same-tab JavaScript that might happen to call `navigator.modelContextTesting.executeTool` directly.[^13] Until identity primitives ship, production WebMCP tools should validate every parameter, scope every action to the user's already-authenticated session, and surface `requestUserInteraction` for any operation that mutates state or moves money.

The third gap is prompt-injection mitigation. The W3C security/privacy considerations document categorizes WebMCP threats into three buckets: tool-metadata injection (malicious instructions in `description` or `inputSchema` field annotations), output injection (malicious instructions in tool return values that influence subsequent agent decisions), and tool-as-target attacks (high-value functionality exposed via WebMCP becoming a vector for malicious agents).[^4][^41] The single mitigation primitive in the v1 spec is the `ToolAnnotations.untrustedContentHint = true` boolean, which signals to the agent client that the payload requires sanitization, spotlighting, or selective hiding from the model's prompt context.[^4] No reliable sanitization mechanism for natural-language prompt injection exists, which is why the spec explicitly defers the sanitization design to agent clients rather than attempting it at the protocol layer.[^4]

Brandon Walderman (Microsoft Edge) opened Issue #11 in August 2025 to track the broader prompt-injection design space, and a key proposal that emerged is per-origin "clipboard" handling: tool outputs go to a per-origin clipboard with a unique reference ID; the agent uses the ID rather than ever seeing the raw value.[^12] If sensitive PII (a Social Security Number on one site) needs to flow to another tool call, the user must explicitly authorize the cross-origin "paste" — the agent never sees the data itself. This proposal is being formalized as a SEP for the broader MCP spec; the WebMCP design space mirrors the same threat model.[^12] For sites today, the protective patterns are operational rather than protocol-level: never return raw PII in tool responses, validate inputs as untrusted data in the `execute` body (the schema validation alone is not enough), set `readOnlyHint: true` on truly read-only tools, and wire `requestUserInteraction()` for every action that mutates state, moves money, or shares data with another origin.[^15][^41]

Same-origin enforcement is the one structural protection the v1 spec does carry. Per Issue #52 resolved in November 2025, cross-origin tool registration is scoped out of v1: only the website's own origin can register tools on the page, and cross-origin iframes cannot inject tools into the parent's WebMCP context.[^3][^20] This eliminates the most obvious cross-origin tool poisoning attack — a malicious ad iframe registering a `transferFunds` tool on a banking site's domain — but production deployments still need to audit their own first-party scripts, since any same-origin script gains the same registration privileges. WebMCP Issue #121 (Habirua, March 2026) proposes adding an optional per-tool `securityPolicy` field that lets tool authors declare access requirements, plus origin-scoped middleware that lets site operators run pre/post-call hooks for prompt-injection scanning, PII redaction, and audit logging — analogous to CSP for tool calls.[^10] None of this has shipped yet; production teams that need it today implement equivalent middleware by wrapping their own `execute` handlers.

The compound implication is that WebMCP today is operationally safe only for sites that already think about their UI as a public unauthenticated API endpoint. Anything beyond that — explicit per-agent trust decisions, scoped permissions, audit-grade logging — has to be implemented above the spec, in the application layer, until the identity, scope, and middleware primitives in #96, #121, and #11 land in normative spec text.

## Quotable Findings — Section 4: Discovery, identity, security gaps

1. The W3C proposal explicitly lists "no built-in mechanism for client applications to discover which sites provide callable tools without visiting or querying them directly" as a known limitation deferred to future work.[^2]
2. Per David Crowe's Issue #96 (Feb 2026), `ModelContextClient` exposes only `requestUserInteraction()` — no `agentId`, no `grantedScopes`, no `correlationId` — and "identity deferred is identity absent."[^11][^23]
3. Cross-origin tool registration is scoped out of WebMCP v1 (Issue #52, Nov 2025) — only the website's own origin can register tools on the page.[^3][^20]
4. The W3C security/privacy doc categorizes WebMCP threats as tool-metadata injection, output injection, and tool-as-target attacks — with `ToolAnnotations.untrustedContentHint = true` as the only spec-level mitigation primitive.[^4]
5. Per modelcontextprotocol Issue #11 (Walderman, Microsoft), a per-origin "clipboard" proposal would store tool outputs by reference so agents use IDs rather than seeing raw sensitive values directly.[^12]

# 5. The 30-day site-side playbook by vertical

The right WebMCP rollout depends on what the site is for. Five vertical playbooks cover the top of the deployment-shape distribution: e-commerce, SaaS dashboards, B2B marketing/lead capture, publishing/long-tail content, and the WordPress long tail. Each has a Day 1, Day 7, Day 14, and Day 30 ship target.

**E-commerce (Shopify, WooCommerce, custom storefronts).** Day 1: confirm the Storefront MCP endpoint is live (Shopify enabled this across all stores in Summer '25; for custom storefronts, deploy a backend MCP server first).[^77] Day 7: declarative `toolname` and `tooldescription` on contact-us, search, newsletter signup, and store-locator forms — no JavaScript required, no dev sprint needed, "two attributes" is literally the work.[^22][^45] Day 14: imperative tools for `searchProducts`, `addToCart`, `checkInventory`, plus `placeOrder` with `requestUserInteraction()` mandatory before checkout.[^29][^81] Day 30: ship the `.well-known/webmcp.json` manifest with `intents` (`search_product`, `add_to_cart`, `complete_purchase`) and `flows` mapping intents to pages; if you're on Shopify or Walmart, also publish UCP coverage. The Shopify Redmond case study is the reference: a two-person team, ten weeks to production, Anthropic prompt caching cut token costs in half, and the same MCP infrastructure paid back a second time on a customer-data migration that would have required a paid third-party app.[^76] Per Presta and Izwiq, dual UCP/MCP coverage captures 40% more agentic traffic than single-protocol coverage; the 28% conversion lift is real and measurable.[^74][^75]

**SaaS dashboard (analytics, CRM, project management, billing consoles, support tooling).** Day 1: `useWebMCP` (or `usewebmcp`) hooks on read tools — `getMetrics`, `listAccounts`, `searchUsers`, `getCustomerDetails` — with `readOnlyHint: true` so the agent treats them as safe-to-call without confirmation.[^9][^28] Day 7: imperative tools for the cross-cutting verbs that span dashboard sections — `setDateRange`, `applyFilter`, `exportReport`. Day 14: write tools — `assignTask`, `updateStatus`, `bulkExport`, `archiveAccount` — each wired to `requestUserInteraction()` because every one of these can erase someone's afternoon if invoked wrong. Day 30: instrument `interaction_source: "agent"` on every existing analytics event so the agent path appears as a distinct dimension in the same GA4/Segment/Amplitude reports the team already uses.[^24] The Scalekit framing captures the design target: "Show me all accounts that renewed in Q1 and flag any with usage below 50%" — that query-and-action loop is exactly what WebMCP enables.[^28]

**B2B marketing / lead-capture site.** Day 1: declarative `toolname="request_demo"` and `book_meeting` on the top-of-funnel forms; the Bandarra-hosted demo confirms `searchFlights`-style tool registration is the canonical reference shape.[^45][^49] Day 7: ship the entity schema and structured-data layer (Schema.org `Organization`, `Product`, `OfferCatalog`) that gives the agent both content-level and verb-level access — the CITABLE framework is one named approach.[^31][^80] Day 14: UTM tracking with `interaction_source=agent` flowing into Salesforce or HubSpot so MQLs from agents are counted as a distinct channel, not blended into Direct.[^31] Day 30: monitor AI-traffic share against the Conductor 2026 baseline (1.08%[^70] of total traffic, 4.4×[^70] organic conversion premium, 68%[^70] more time on site, ChatGPT driving 87.4%[^70] of AI volume).[^70] Forrester's John Buten makes the B2B-specific point: more than half of B2B buyers have access to a private instance of AI behind their firewall, doing tasks like RFP-response evaluation and reference-network search — those internal agents are also potential WebMCP consumers, not just public chat surfaces.[^72]

**Publishing / long-tail content (independent media, knowledge bases, research archives, documentation sites).** Day 1: enable Cloudflare Markdown for Agents on the proxy layer — automatic on-the-fly HTML→Markdown conversion when agents send `text/markdown`, claimed 80% token reduction at the network edge with zero application code changes.[^72][^73] Day 7: declarative `toolname="subscribe"`, `submit_tip`, `report_correction` on the existing newsletter and contact forms. Day 14: imperative `searchArticles`, `getArticleByID`, `listTopics`, `getCategoryArchive` mapped to the existing CMS/REST API. The Universal Commerce Protocol case study deployed seven tools across three phases (declarative forms, imperative tools, live Gemini agent test) and reported every tool returned HTTP 200 on the first call with zero retries.[^81] Day 30: classification layer that distinguishes agent traffic from human traffic (Panxo's product, Matomo's AI Assistant tracking, or homegrown server-side logging) — necessary because 70.6% of agent traffic shows up as "Direct" in GA4 without it.[^65][^69]

**WordPress long tail.** WordPress still powers ~40% of the public web. The wmcp.dev plugin adds WebMCP declarative attributes to Contact Form 7, Gravity Forms, WPForms, and WooCommerce in a five-minute install with zero code changes. For sites where the team has no engineering bandwidth at all, this is the ship-it-now path.[^41]

A cross-cutting Day-30 obligation across all five verticals: instrument the agent channel as its own KPI. Agent conversion rates do not behave like human conversion rates — agents transact in milliseconds, abandon under 5% of carts (versus ~70% for humans), and don't get distracted by ad creative or push notifications mid-checkout.[^71] Treating "agent conversion rate" and "human conversion rate" as the same metric averages a high-converting micro-channel into a low-converting macro one and produces dashboards that lie about the unit economics of agent traffic. Per UCPHub's recommendation, many analytics platforms are now separating Human Traffic and Agentic Traffic into completely different dashboards.[^71]

The competitive position the playbook buys is the asymmetric one. Sub-2% of traffic today, growing 3× per year, converting at 4–10× organic rates: the sites that build the verb surface in 2026 own a discovery position the sites that wait until 2027 will pay retail integration costs to enter.[^68][^70][^79] Per Eric Gerl: "The sites with well-defined tool surfaces will be immediately discoverable. The ones without will be invisible to agents in the same way sites without sitemaps were invisible to early search engines."[^79]

## Quotable Findings — Section 5: 30-day playbook

1. Shopify Redmond case study: a two-person team shipped a production AI commerce agent on Storefront MCP in 10 weeks; the same MCP infrastructure paid for itself a second time by enabling a customer-data migration without a paid third-party app.[^76]
2. Presta and Izwiq report dual UCP/MCP coverage captures 40% more agentic traffic than single-protocol stores, with 28% higher conversion from AI-driven traffic versus traditional search.[^74][^75]
3. The wmcp.dev plugin adds WebMCP declarative attributes to Contact Form 7, Gravity Forms, WPForms, and WooCommerce in a five-minute install — the path of least resistance for the WordPress 40% of the web.[^41]
4. Per UCPHub's Q1 2026 Shopify pilots, agentic traffic abandons fewer than 5% of carts versus ~70% for humans — the comparison happened upstream, the visit is the final handshake.[^71]
5. Per Eric Gerl: "The sites with well-defined tool surfaces will be immediately discoverable. The ones without will be invisible to agents in the same way sites without sitemaps were invisible to early search engines."[^79]

# 6. Honest limits — what to wait on, and what to ship now

WebMCP is in early preview. Treating it as production-ready today is the wrong move; treating it as something to wait on is also wrong. The sane posture is to ship the cheap, reversible parts now and design the expensive, hard-to-reverse parts assuming the spec will change.

The browser support reality. As of May 2026, WebMCP is available behind `chrome://flags/#enable-webmcp-testing` in Chrome 146 Canary and Beta channels.[^46] CVE-2026-3918 confirms the implementation is in stable Chrome builds, still flag-gated pending full stable rollout.[^44] Microsoft Edge support is widely expected next given the shared Chromium engine, Microsoft's co-authorship of the spec, and the Microsoft Copilot Studio 2026 Wave 1 (April–September 2026) plan that explicitly schedules connecting agents to external data via custom MCP servers.[^47][^60] Firefox and Safari participate in the W3C Web Machine Learning Working Group but have not announced shipping timelines.[^21] DEV Community coverage notes that Chrome and Edge together cover over 85% of the browser market, so the practical "WebMCP-supported" share will likely cross 80% in late 2026.[^82]

The DevTrial caveat. Patrick Brosset (Microsoft Edge), Sam Witteveen (VentureBeat), Vinicius Stanula (Search Engine Land), and Ivan Turkovic all explicitly warn the same thing: do not ship critical workflows on the unstable API surface today.[^21][^22][^51][^53][^59] Method names, parameter shapes, the entire `navigator.modelContext` interface could shift between Chrome versions until the spec stabilizes. The Vinicius Stanula framing is the practical posture: "Start experimenting with WebMCP, but don't bet your roadmap on it yet. The standard is evolving, and early adopters will have an advantage, but only if they stay flexible as the standard matures."[^53]

The ephemeral-tool-surface constraint. WebMCP tools exist only when the page is open in a visible browser tab. There is no headless mode; there is no service-worker / background tool execution; if the user closes the tab, the agent loses the ability to invoke any tool registered on that page.[^6] This is by design — WebMCP is a complement to backend MCP, not a replacement. Per Chrome: "WebMCP is the final step, a connection for agents directly to your website. It's designed for contextual, in-browser interactions… while the user has your website open."[^6] If the workflow requires persistent or autonomous agent operation (background data sync, scheduled batch operations), the tool needs to live in a backend MCP server, not in WebMCP.

The discovery gap that production deployments need to plan around. Until `.well-known/webmcp.json` (or one of the competing manifest proposals) is standardized, agents must navigate to a page to discover the tools registered there.[^2] The compounding effect of this gap: the sites with well-defined tool surfaces and well-known manifests when the spec settles will be immediately discoverable; the ones without will require agents to scrape, screenshot, and guess — exactly the failure mode WebMCP was designed to eliminate.[^79]

The identity gap that production deployments cannot solve at the application layer. The spec ships v1 without `agentId`, without enforceable `requiredScopes`, without a `correlationId` linking each invocation to a session. A banking site exposing a `getBalance` tool today cannot tell which agent is calling — Chrome's Copilot, a third-party extension, or an unknown research script all look identical.[^11][^23] A healthcare portal cannot make per-agent trust decisions. An audit system cannot reconstruct the chain of which user authorized which agent to call which tool. Until #96, #54, and the related audit primitives ship in normative spec text, every WebMCP tool should be designed treating its own `execute` callback the way it would treat a public unauthenticated API endpoint: validate every parameter, scope every action to the user's already-authenticated session, surface `requestUserInteraction` for any operation that mutates state.

The spec maturity timeline. Industry observers expect Q2 2026 beta releases with more stable APIs and broader browser testing; mid-to-late 2026 formal browser announcements at Google Cloud Next, Google I/O, and Microsoft Build; and 2026–2027 path toward W3C Working Group adoption, with full Recommendation status historically taking years.[^43][^51][^78] Per Patrick Brosset's framing: "It's still in draft form as of early 2026, but the core API design is taking shape."[^59] Per VentureBeat: WebMCP "has cleared the most difficult hurdle any web standard faces: getting from proposal to working software."[^51]

What to ship now. Three categories of work clear the bar of "low-cost, reversible, captures the agent-conversion premium": declarative `toolname`/`tooldescription` attributes on existing forms; the `interaction_source: "agent"` analytics dimension on existing trackEvent calls;[^24] and a `.well-known/webmcp.json` manifest in the most-likely-future shape.[^40] These three deliver Day-30 value, do not depend on identity primitives, and do not lock the team into any particular agent platform — even if WebMCP is iterated into a different name or shape, the underlying instrumentation stays useful.

What to wait on. Anything that requires per-agent trust decisions, audit-grade logging, scoped permissions, or autonomous (non-tab-resident) execution should wait until the identity primitives in #96 land in normative text or until the team is ready to enforce equivalent constraints in the application layer above the spec. The right framing isn't "should we adopt WebMCP." The right framing is "which verbs is the site comfortable exposing today, given that any agent that reaches the page can call them, and which verbs need the identity layer first."

## Quotable Findings — Section 6: Honest limits

1. WebMCP code has reached stable Chrome builds, still flag-gated; Microsoft Copilot Studio 2026 Wave 1 (April-September 2026) explicitly plans connecting agents to external data via custom MCP servers.[^60]
2. Per Vinicius Stanula at Search Engine Land: "Start experimenting with WebMCP, but don't bet your roadmap on it yet. The standard is evolving, and early adopters will have an advantage, but only if they stay flexible as the standard matures."[^53]
3. WebMCP tools are ephemeral: "Once the user navigates away from your site or closes the tab, the agent can no longer access your site or take actions" (Chrome).[^6]
4. Until WebMCP identity primitives ship, every tool should be designed as if any agent on the planet can invoke it — validate at the boundary, never trust the description.[^11][^23][^41]
5. Per VentureBeat: "WebMCP has cleared the most difficult hurdle any web standard faces: getting from proposal to working software."[^51]

## Glossary

**WebMCP (Web Model Context Protocol):** A proposed W3C Community Group browser standard, co-authored by Google and Microsoft through the Web Machine Learning Community Group, that enables websites to expose structured, callable "tools" to AI agents through the `navigator.modelContext` JavaScript interface. Currently in early preview behind a feature flag in Chrome 146.

**MCP (Model Context Protocol):** Anthropic's open protocol introduced November 2024 connecting AI agents with external systems (data sources, tools, workflows) via JSON-RPC, with language-specific SDKs. Donated to the Linux Foundation's Agentic AI Foundation in December 2025. Distinct from but complementary to WebMCP — MCP is for backend services, WebMCP is for in-browser site interaction.

**MCP-B (Model Context Protocol for Browsers):** The community-implemented predecessor of WebMCP, originally developed by Alex Nahas (formerly at Amazon). Now provides the canonical polyfills (`@mcp-b/global`, `@mcp-b/webmcp-polyfill`, `@mcp-b/react-webmcp`, `usewebmcp`) and reference implementations across React, Vanilla JS, Rails, Angular, and Phoenix LiveView.

**`navigator.modelContext`:** The JavaScript API surface WebMCP defines on the `Navigator` interface. `[SecureContext, SameObject] readonly attribute ModelContext modelContext`. HTTPS-only, single instance per Navigator object.

**`ModelContextTool`:** The dictionary describing a tool registered with WebMCP. Required fields: `name`, `description`, `execute`. Optional: `title`, `inputSchema`, `annotations`.

**`ModelContextClient`:** The interface representing the agent invoking a tool. Currently exposes only `requestUserInteraction(callback)`. Open Issue #96 proposes adding `agentId`, `grantedScopes`, and `correlationId` for v1.

**Declarative API:** The HTML-form-attribute path to WebMCP. Add `toolname` and `tooldescription` to any `<form>`; the browser auto-generates a JSON Schema from the form's input fields. Optional `toolautosubmit` lets agents submit autonomously.

**Imperative API:** The JavaScript path to WebMCP. Call `navigator.modelContext.registerTool({name, description, inputSchema, execute, annotations})` to register a tool whose `execute` callback runs your existing application logic.

**`requestUserInteraction()`:** The primary in-flow consent primitive. Tools call `await client.requestUserInteraction(callback)` to pause execution and request user confirmation, typically before mutating state, moving money, or sharing data.

**`toolautosubmit`:** A boolean HTML form attribute that, when present, allows the browser to auto-submit the form on agent invocation; when absent (the default), the browser pre-fills fields and waits for human submit click.

**`SubmitEvent.agentInvoked`:** A boolean flag on `SubmitEvent` that distinguishes form submissions resulting from agent invocation from human submissions. The form's submit handler can branch behavior based on this flag.

**`ToolAnnotations`:** An optional dictionary on a registered tool. Includes `readOnly = false` (advisory: tool has no side effects) and `untrustedContentHint` (signals payload requires sanitization, spotlighting, or hiding from the agent's prompt).

**Agent identity (open):** The unsolved problem of the `ModelContextClient` not carrying a verified identifier of which agent is invoking a tool. Tracked in Issues #96 (Crowe) and #54 (Sagar). Production tools should treat their `execute` callback as a public unauthenticated endpoint until identity primitives ship.

**`.well-known/webmcp.json`:** A proposed (not yet standardized) site manifest format that would enable agents to discover tool-bearing sites without navigating to them. Competing proposals: Web MCP Registry, Colin Knapp's `/.well-known/mcp.json`, modelcontextprotocol Universal MCP Manifest #2505.

**Prompt-injection clipboard:** The Issue #11 (Walderman) proposal to store tool outputs by reference (per-origin clipboard with unique IDs) so agents use IDs rather than seeing raw sensitive values directly. Mitigates the "lethal trifecta" data-exfiltration pattern.

## Related Research

- [The B2A Imperative](https://www.perea.ai/research/b2a-2026) — origin frame for "Business-to-Agent" as a distinct selling motion; WebMCP is the site-side surface where B2A actually happens at the verb level.
- [GEO/AEO 2026: The Citation Economy](https://www.perea.ai/research/geo-2026) — the discovery layer that sits *above* the verb layer. Sites need both: GEO/AEO for "is the agent recommending us at all" and WebMCP for "can the agent complete the action it just recommended."
- [The Agent Payment Stack 2026](https://www.perea.ai/research/agent-payment-stack-2026) — the settlement, identity, and commerce protocols (x402, ACP, AP2, MPP, TAP) that compose with WebMCP at the verb layer. WebMCP exposes the verb; AP2/ACP/x402 settle the transaction.
- [Trust Layer Deep Dive](https://www.perea.ai/research/trust-layer-deep-dive) — the failure-mode adjacency. Every gap WebMCP defers (agent identity, audit, scoped permissions) is a gap that the broader trust layer will eventually have to close.
- [The MCP Server Playbook for SaaS Founders](https://www.perea.ai/research/mcp-server-playbook) — the backend half of the agent-ready stack. WebMCP and MCP are partners, not opponents: backend MCP for persistent global services, WebMCP for live-tab-bound contextual interactions.

## References

[^1]: W3C Web Machine Learning Community Group (2026-04-23), *WebMCP — Draft Community Group Report*. https://webmachinelearning.github.io/webmcp
[^2]: webmachinelearning project (2026), *WebMCP API Proposal explainer*. https://webmachinelearning.github.io/webmcp/docs/proposal.html
[^3]: webmachinelearning org (2026), *WebMCP source repository — proposal, security docs, examples*. https://github.com/webmachinelearning/webmcp
[^4]: webmachinelearning maintainers (2026), *WebMCP security and privacy considerations*. https://github.com/webmachinelearning/webmcp/blob/main/docs/security-privacy-considerations.md
[^5]: André Cipriani Bandarra, Google Chrome team (2026-02-10), *WebMCP is available for early preview*. https://developer.chrome.com/blog/webmcp-epp
[^6]: Google Chrome team (2026-03-11), *When to use WebMCP and MCP*. https://developer.chrome.com/blog/webmcp-mcp-usage
[^7]: WebMCP-org (2026), *WebMCP-org reference example repository (vanilla / React / Rails / Angular / Phoenix LiveView)*. https://github.com/WebMCP-org/examples
[^8]: WebMCP-org / MCP-B (2026), *@mcp-b npm-packages repository (canonical polyfill + bridge)*. https://github.com/webmcp-org/npm-packages
[^9]: WebMCP-org (2026), *@mcp-b/react-webmcp npm package*. https://www.npmjs.com/package/@mcp-b/react-webmcp
[^10]: Habirua (2026-03-02), *WebMCP Issue #121 — Security Considerations*. https://github.com/webmachinelearning/webmcp/issues/121
[^11]: David Crowe, Agentic Control Plane (2026-02-18), *WebMCP Issue #96 — Address agent-to-tool trust: identity, scoped permissions, delegation*. https://github.com/webmachinelearning/webmcp/issues/96
[^12]: Brandon Walderman, Microsoft Edge (2025-08-18), *WebMCP Issue #11 — Prompt injection (tracking)*. https://github.com/webmachinelearning/webmcp/issues/11
[^13]: WebMCP-org / MCP-B (2026), *@mcp-b documentation — Spec status and limitations*. https://docs.mcp-b.ai/explanation/design/spec-status-and-limitations
[^14]: WebMCP-org / MCP-B (2026), *@mcp-b documentation — Frameworks integration*. https://docs.mcp-b.ai/how-to/frameworks
[^15]: WebMCP-org / MCP-B (2026), *@mcp-b documentation — Security and human-in-the-loop*. https://docs.mcp-b.ai/explanation/design/security-and-human-in-the-loop
[^16]: webMCP project (2025-08), *webMCP token-efficiency benchmarks (1,890 live API calls)*. https://www.arxiv.org/pdf/2508.09171
[^17]: WebMCP-org maintainer (2026), *Show HN: WebMCP brings 90% token reduction to CDP MCP server*. https://news.ycombinator.com/item?id=46223714
[^18]: modelcontextprotocol community (2026), *Universal MCP Manifest discussion #2505*. https://github.com/modelcontextprotocol/modelcontextprotocol/discussions/2505
[^19]: hyperpolymath (2025-12-11), *modelcontextprotocol .well-known/mcp Discovery Endpoint SEP #1960*. https://github.com/modelcontextprotocol/modelcontextprotocol/issues/1960
[^20]: webmcpnet community (2026-02-13), *Awesome WebMCP curated list*. https://github.com/webmcpnet/awesome-webmcp/
[^21]: Ivan Turkovic (2026-02-15), *WebMCP Is Coming: How AI Agents Will Reshape the Web*. https://www.ivanturkovic.com/2026/02/15/webmcp-is-coming-how-ai-agents-will-reshape-the-web/
[^22]: Ivan Turkovic (2026-02-23), *How to Make Your Website Agent-Ready With WebMCP*. https://www.ivanturkovic.com/2026/02/23/webmcp-tutorial-make-website-agent-ready/
[^23]: David Crowe, Agentic Control Plane (2026-03-19), *WebMCP Ships Without Agent Identity. Here's Why That Matters*. https://agenticcontrolplane.com/blog/webmcp-ships-without-agent-identity-heres-why-that-matters
[^24]: Nicolas (2026-02-26), *I Hooked My Analytics to WebMCP. Here Is Why You Should Too*. https://medium.com/@dataenthusiast.io/i-hooked-my-analytics-to-webmcp-here-is-why-you-should-too-6a02aad28202
[^25]: Channel.tel (2026-03-20), *Why Browser Agents Waste 89% of Their Tokens*. https://www.channel.tel/blog/webmcp-every-website-tool-ai-agents
[^28]: Scalekit (2026-03-12), *WebMCP explained: How browser agents can call web tools without scraping the DOM*. https://www.scalekit.com/blog/webmcp-the-missing-bridge-between-ai-agents-and-the-web
[^29]: Anuradha Weeraman (2026-02-22), *WebMCP: The Agentic Web Gets a Front Door*. https://weeraman.com/webmcp-the-agentic-web-gets-a-front-door/
[^31]: Prahlad Menon, themenonlab (2026-02-18), *WebMCP: Chrome's New Standard for Agent-Ready Websites*. https://themenonlab.blog/blog/webmcp-agentic-web-standard
[^32]: Colin Knapp (2026-04-12), *MCP Discovery via Well-Known URI specification*. https://colinknapp.com/specs/mcp-discovery.html
[^36]: ai-agent-economy / Dev.to (2026-03-04), *We Built a 3KB WebMCP Polyfill (97x Smaller Than @mcp-b/global)*. https://dev.to/ai-agent-economy/we-built-a-3kb-webmcp-polyfill-97x-smaller-than-mcp-bglobal-3kg4
[^40]: Halmob (2026-02-15), *How to Implement WebMCP in Next.js with Best Practices*. https://halmob.com/blog/implementing-webmcp-chrome-146
[^41]: WebMCP Expert (2026-02-20), *WebMCP Security: Threat Models, Attack Surfaces, and Defenses*. https://webmcpexpert.com/blog/webmcp-security-deep-dive/
[^43]: zylos.ai research (2026-02-22), *WebMCP: Browser-Native AI Agent Integration Standard*. https://zylos.ai/research/2026-02-22-webmcp-browser-native-ai-agent-integration
[^45]: theaiworld.org (2026-03-10), *WebMCP & Chrome 146: Build an AI-Agent Ready Site*. https://theaiworld.org/news/webmcp-chrome-146-build-an-ai-agent-ready-site
[^46]: Salam Experts (2026-03-14), *Enable WebMCP in Chrome 146: Step-by-Step Guide 2026*. https://www.salamexperts.com/blog/ai/enable-webmcp-chrome/
[^47]: DevPik (2026-04-05), *Chrome WebMCP Developer Guide — Declarative & Imperative APIs*. https://www.devpik.com/blog/chrome-webmcp-developer-guide
[^49]: axrisi, Dev.to (2026-02-10), *Chrome's WebMCP Early Preview: the end of "AI agents clicking buttons"*. https://www.forem.com/axrisi/chromes-webmcp-early-preview-the-end-of-ai-agents-clicking-buttons-b6e
[^51]: Sam Witteveen, VentureBeat (2026-02-12), *Google Chrome ships WebMCP in early preview, turning every website into a structured tool for AI agents*. https://venturebeat.com/infrastructure/google-chrome-ships-webmcp-in-early-preview-turning-every-website-into-a
[^52]: Barry Schwartz, Search Engine Land (2026-02-11), *Google previews WebMCP, a new protocol for AI agent interactions*. https://searchengineland.com/google-releases-preview-of-webmcp-how-ai-agents-interact-with-websites-469024
[^53]: Vinicius Stanula, Search Engine Land (2026-03-04), *WebMCP explained: Inside Chrome 146's agent-ready web preview*. https://searchengineland.com/webmcp-explained-inside-chrome-146s-agent-ready-web-preview-470630
[^54]: Nilay Patel, The Verge (2025-05-19), *Microsoft CTO Kevin Scott on the birth of the agentic web*. https://www.theverge.com/decoder-podcast-with-nilay-patel/669409/microsoft-cto-kevin-scott-interview-ai-natural-language-search-openai
[^55]: Linda Ivy-Rosser, Forrester (2025-11-05), *Predictions 2026: AI Agents And New Business Models Impact Enterprise Software*. https://www.forrester.com/blogs/predictions-2026-ai-agents-changing-business-models-and-workplace-culture-impact-enterprise-software/
[^56]: Gartner Research (2025-11-19), *Predicts 2026: AI Agents, MCP and Governance Are Transforming Analytics*. https://www.gartner.com/en/documents/7197230
[^58]: Kyle Wiggers, TechCrunch (2025-05-07), *Microsoft adopts Google's standard for linking up AI agents*. https://techcrunch.com/2025/05/07/microsoft-adopts-googles-standard-for-linking-up-ai-agents/
[^59]: Patrick Brosset, Microsoft Edge (2026-02-23), *WebMCP updates, clarifications, and next steps*. https://patrickbrosset.com/articles/2026-02-23-webmcp-updates-clarifications-and-next-steps/
[^60]: Microsoft Learn (2026-04-02), *Microsoft Copilot Studio 2026 release wave 1: connect agent external data via custom MCP servers*. https://learn.microsoft.com/en-us/power-platform/release-plan/2026wave1/microsoft-copilot-studio/connect-agent-external-data-custom-mcp-servers
[^62]: Michal Sutter, MarkTechPost (2026-02-15), *Google AI Introduces the WebMCP to Enable Direct and Structured Website Interactions for New AI Agents*. https://www.marktechpost.com/2026/02/14/google-ai-introduces-the-webmcp-to-enable-direct-and-structured-website-interactions-for-new-ai-agents/
[^64]: Marco Di Cesare, Loamly (2025-12-14), *State of AI Traffic 2026: Industry Benchmark Report*. https://www.loamly.ai/blog/state-of-ai-traffic-2026-benchmark-report
[^65]: Vlad Kuryatnik, The Digital Bloom (2026-03-13), *Gen AI Website Traffic Share Report — Feb 2026*. https://thedigitalbloom.com/learn/gen-ai-website-traffic-share-february-2026/
[^66]: Maria Carpena, WebFX (2026-03-18), *Study: AI Traffic Grew 796% & Out-Converts Organic Search*. https://www.webfx.com/blog/seo/gen-ai-search-trends/
[^67]: Jeff Oxford, Visibility Labs (2026-02-23), *ChatGPT Traffic Converts 31% Better than Non-Branded Organic Search (94 eCommerce Sites Analyzed)*. https://visibilitylabs.ai/chatgpt-vs-organic-search-conversion-rates/
[^68]: Searchless.ai (2026-05-01), *AI Referral Traffic Converts 3-5x Better Than Organic*. https://searchless.ai/articles/2026-05-01-ai-referral-traffic-conversion-rates-benchmark-2026/
[^69]: Panxo (2026), *Agentic Commerce Is Here: ChatGPT's 11.4% Conversion Rate Outperforms Every Traditional Channel*. https://www.panxo.com/blog/agentic-commerce-chatgpt-conversion-rates-outperform-every-channel
[^70]: Emarketed (2026), *AI Referral Traffic Converts 4.4x Higher Than Organic — Conductor 2026 benchmarks*. https://emarketed.com/aeo/ai-referral-traffic-conversion-value-2026
[^71]: UCPHub (2026-01-26), *Agentic Commerce Conversion Rates: 2026 UCP Benchmarks*. https://ucphub.ai/agentic-commerce-conversion-rate-ucp/
[^72]: John Ebbert, Tipsheet.ai (2026-02-17), *Agentic opportunity: WebMCP & Markdown for Agents*. https://tipsheet.ai/news/webmcp-google-cloudflare/
[^73]: Tanush Yadav, Cintra (2026-04-06), *Agentic Commerce Optimization: The Ecommerce Brand's Guide*. https://cintra.run/blog/agentic-commerce-optimization
[^74]: Vladeta Radovanovic, Presta (2026-02-18), *Agentic-First Shopify: Design Product Pages for AI Agents 2026*. https://wearepresta.com/agentic-first-shopify-designing-product-pages-for-ai-agents/
[^75]: Muhammed W, Izwiq (2026-03-21), *WebMCP, Agentic Commerce Infrastructure Explained for 2026*. https://izwiq.com/blogs/webmcp-readiness/webmcp-agentic-commerce-guide/
[^76]: Shopify (2026), *Redmond built a production AI commerce agent in 10 weeks using Shopify's Storefront MCP*. https://www.shopify.com/case-studies/redmond
[^77]: Folio3 (2025-10-03), *Top Features of Shopify MCP Storefront to Boost Sales & SEO*. https://ecommerce.folio3.com/blog/shopify-storefront-mcp-how-ai-shopping-assistants-convert-more-customers/
[^79]: Eric Gerl (2026-02-24), *Your Website Needs a Tool Surface — WebMCP and the Browser-Native Web*. https://gerl.dev/blog/webmcp-your-website-needs-a-tool-surface
[^80]: SEOLeverage (2026-02-20), *From Being Found to Being Bought: What WebMCP Means for Search Everywhere Optimization*. https://seoleverage.com/blog/from-being-found-to-being-bought-what-webmcp-means-for-search-everywhere-optimization/
[^81]: Pinto, Universal Commerce Protocol (2026-03-29), *I Implemented WebMCP on My Website and Watched an AI Agent Use It*. https://theuniversalcommerceprotocol.com/i-implemented-webmcp-on-my-website-and-watched-an-ai-agent-use-it-heres-what-happened/
[^82]: Studio Meyer, DEV Community (2026-03-16), *WebMCP: The Emerging Web Protocol for AI Agents*. https://dev.to/studiomeyer-io/webmcp-the-emerging-web-protocol-for-ai-agents-4c23

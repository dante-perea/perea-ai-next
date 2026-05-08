---
title: "Accessibility Tree vs Screenshot"
subtitle: "The perception-layer decision for browser agents in 2026 — token cost, latency, flake rate, and the hybrid pattern"
publication: "perea.ai Research"
authors: ["Dante Perea"]
version: "1.0"
status: "Public draft"
date: "2026-05"
audience: "browser-agent platform engineers, computer-use product teams, agent-infrastructure founders, and SREs evaluating Playwright MCP vs Stagehand vs Browser Use vs Claude Computer Use for production deployment"
length: "~2,800 words"
license: "CC BY 4.0"
description: "Technical playbook on the three perception strategies for browser agents: (1) DOM parsing — every node, signal-to-noise problem; (2) screenshot + vision model — slow, expensive, fragile on small UIs; (3) accessibility tree — semantic, what screen readers use, stable across redesigns. Maps the Playwright snapshotForAI v1.59 API, the [ref=eN] handle convention, Stagehand's Chrome Accessibility Tree default, and the hybrid pattern (tree-as-primary + screenshot-on-demand) that has emerged in 2026. Documents the 7.5x to 12.5x token-cost gap, the 30-80x latency gap, the iframe-inlining limit, and ref-invalidation contract."
profile: "technical-playbook"
---

## Executive summary

Every browser agent must answer one question before it can do anything else: how does the agent perceive the page? In 2026 there are three answers — DOM parsing, screenshot-plus-vision-model, and accessibility tree — and the production cohort has converged on a clear ordering. Accessibility tree as the primary perception layer; screenshot-on-demand for visual edge cases; raw DOM essentially never.[^1][^2][^3][^4]

The numbers explain the convergence. Playwright MCP accessibility-tree snapshots run ~200–400 tokens per page. Vision-model screenshot-plus-OCR runs ~3,000–5,000 tokens — 7.5x to 12.5x the cost.[^1] A full Retina Chrome screenshot is roughly 500 KB of base64 per step, which tokenizes to about 350,000 input tokens — enough to overflow a 32K-context-window local model after one observation.[^4] Latency: text-snapshot parsing is "instant" in Playwright's framing; vision-API calls take 3–8 seconds because the model must process pixels, perform OCR, identify UI elements, and reason about content — 2–4x slower than a text-only call of equivalent complexity.[^2] Reliability: refs from snapshots are deterministic — the same element gets the same handle within a single snapshot — while screenshot coordinates require pixel-level guessing that breaks under layout changes.[^1][^2]

The empirical comparison is sharper. Tech Stackups' February 2026 five-task benchmark of Browser Use (DOM-based) versus Anthropic Claude Computer Use (screenshot-based): Browser Use completes every task on the first run with no intervention; Claude Computer Use requires debugging on 3 of 5 tasks, is blocked entirely on 1, and on the one clean win its vision path produced malformed JSON and the correct result came from a Playwright DOM fallback.[^3] Browser Use scripts ran 36 to 66 lines; Computer Use scripts ran 187 to 330 lines, on a model that costs 15x more per token.[^3]

This paper specifies the production decision. It documents the three perception strategies with their cost-and-latency math, walks through Playwright's `snapshotForAI` API and the `[ref=eN]` handle convention, catalogs the four production frameworks (Playwright MCP, Stagehand, Browser Use, AgentQL) by perception choice, and prescribes the hybrid pattern that the 2026 cohort has converged on.

## The three perception strategies

### Strategy 1: DOM parsing

The agent walks the full DOM, extracts every node, and ships a serialized representation to the model. This is the early-2024 pattern, and it is structurally broken: signal-to-noise. A typical e-commerce product page has 5,000–15,000 DOM nodes; the agent needs to attend to maybe 30. Stagehand's design history documents this directly: "Initially, our approach relied on parsing the raw DOM of web pages. However, we soon discovered that the Chrome Accessibility Tree offers a much cleaner, more reliable view of a webpage by filtering out unnecessary noise. This shift not only improved the accuracy of actions but also increased the overall resilience of our automation scripts."[^5] No serious 2026 framework still uses raw DOM as primary perception.

### Strategy 2: Screenshot + vision model

The agent captures a screenshot, ships the image bytes to a vision-capable LLM (Claude vision, GPT-5 vision, Gemini), the model performs OCR and UI-element identification, and the agent acts via mouse/keyboard at pixel coordinates.[^6] This is the Anthropic Claude Computer Use pattern — by design.[^7] The advantages: works on any application visible on screen, including native desktop apps and file pickers where no DOM exists, and captures spatial relationships ("click the button to the right of the price").[^7] The disadvantages: 3–8 second per-step latency, 7.5–12.5x token cost, fragile on small UIs, and pixel-coordinate clicks break when layout shifts.[^1][^2][^3]

Some implementations enhance the screenshot by overlaying numbered IDs or bounding boxes on interactive elements (the Set-of-Marks pattern) before sending the image to the model. This hybrid helps the model identify clickable regions but still relies on visual processing as the primary perception channel.[^2][^4]

### Strategy 3: Accessibility tree

The agent extracts the accessibility tree — the same structured representation that screen readers use — and ships a compact YAML serialization of interactive elements with role, accessible name, and a reference handle. Playwright MCP's snapshot format:[^1]

```yaml
- heading "todos" [level=1]
- textbox "What needs to be done?" [ref=e5]
- listitem:
  - checkbox "Toggle Todo" [ref=e10]
  - text: "Buy groceries"
- contentinfo:
  - text: "2 items left"
  - link "All" [ref=e20]
  - link "Active" [ref=e21]
  - link "Completed" [ref=e22]
```

The agent calls actions by ref:[^1]

```text
browser_type   { ref: "e5", text: "headphones" }    → type into search
browser_click  { ref: "e10" }                       → check the checkbox
browser_click  { ref: "e20" }                       → click the "All" link
```

Refs are stable within a single snapshot — the same element always has the same ref until the page changes. After navigation or DOM updates, the tool returns a fresh snapshot with new refs.[^1][^8] Only interactive elements get refs (buttons, links, inputs, etc.); decorative elements do not, which keeps the tree compact.[^1]

## Playwright snapshotForAI: the de facto standard

Microsoft's Playwright shipped `snapshotForAI` in v1.59 (released early 2026), exposed as `Page.snapshotForAI()` and `Locator.snapshotForAI()`.[^9][^10] The signature: `mode: 'ai'`, optional `depth: int` to limit tree expansion, optional `track: string` to enable incremental snapshots, optional `selector` to scope to a CSS-selector subtree, optional `boxes: boolean` to include bounding-box coordinates `[box=x,y,width,height]` in viewport-relative CSS pixels.[^11][^12]

The depth parameter is load-bearing for token budget. Microsoft's test corpus demonstrates depth=1 producing a 4-line tree where depth=100 produces a 14-line tree on the same nested-list structure.[^9] Production agents typically run depth=2-4 on top-level snapshots and `--depth=10` only when the agent needs deep tree introspection. The track parameter enables incremental snapshots: subsequent calls with the same track name return only changes since the last call, which on a long-form workflow means the agent's per-step token cost stays bounded even as the page accumulates state.[^9]

The Playwright MCP server (microsoft/playwright-mcp, npm `@playwright/mcp` first published March 2025) exposes the snapshot API as the `browser_snapshot` MCP tool and ships in 0.0.x alpha versions through May 2026.[^11][^13] The tool surface includes:[^11]

- `browser_snapshot` — accessibility-tree snapshot, optional `target` selector, `filename` to save to disk, `depth` to limit tree, `boxes` to include bounding boxes.
- `browser_click` — click by `target` (a ref or selector); requires `element` human-readable description for the permission prompt.
- `browser_type` — type into a textbox by ref.
- `browser_take_screenshot` — fullPage option, png or jpeg, only used when accessibility tree is insufficient.
- `browser_pick_locator` — wait for the user to pick an element interactively and return its ref + locator.
- `browser_generate_locator` — generate a Playwright locator string from a ref (for converting agent runs to Playwright tests).
- `browser_verify_element_visible`, `browser_verify_value` — test-assertion primitives behind `--caps=testing`.

The Playwright README explicitly positions accessibility-tree perception against vision: "Fast and lightweight. Uses Playwright's accessibility tree, not pixel-based input. LLM-friendly. No vision models needed, operates purely on structured data. Deterministic tool application. Avoids ambiguity common with screenshot-based approaches."[^14][^11]

## The four production frameworks

### Playwright MCP — the reference implementation

`@playwright/mcp` has shipped 331 versions in alpha cadence as of May 2026.[^13] The architecture is a Model Context Protocol server that wraps Playwright's `snapshotForAI` API. Its design preference is CLI-with-skills over MCP for high-throughput coding agents because CLI invocations avoid loading large tool schemas and verbose accessibility trees into the model context.[^14] MCP remains relevant for "specialized agentic loops that benefit from persistent state, rich introspection, and iterative reasoning over page structure."[^14]

### Stagehand — atomic primitives + agent

Browserbase's Stagehand is open-source TypeScript+Python with four primitives: `act()`, `extract()`, `observe()`, `agent()`.[^5][^15] The Chrome Accessibility Tree is the default perception channel since the 2025 rewrite — previously an optional flag.[^5] Stagehand v3 (released February 2026) is a complete rewrite with AI-native architecture talking directly to the browser via Chrome DevTools Protocol, cutting out the traditional automation layer and running 44% faster than v2.[^4] It supports specialized computer-use models from Google, OpenAI, Anthropic, and Microsoft via a `mode: "cua"` setting that opts into vision-mode for that primitive.[^4][^15]

### Browser Use — DOM + screenshot index

Browser Use extracts the accessibility tree on each step plus a screenshot, with interactive elements indexed numerically. The LLM receives both the tree and the screenshot annotated with element-index overlays, then calls Browser Use's built-in actions by element index.[^3] The hybrid is intentional: vision fills in where the DOM falls short, such as reading CAPTCHA images or dismissing ad popups that don't appear in the tree.[^3] Browser Use 2.0 moves further toward DOM-primary, using DOM parsing for most steps and screenshots only when structure is ambiguous.[^4]

### AgentQL — natural-language selectors

AgentQL takes a different shape: a query language built on top of Playwright's accessibility-tree perception. Instead of CSS selectors or XPaths, the developer writes natural-language queries that AgentQL's AI interprets against page structure. Self-healing across UI changes is the explicit value proposition: a query like "find the product price" continues working when the developer renames `#product-price .amount` to `.price-value`.[^16] AgentQL ships Python and JavaScript SDKs, REST API, browser debugger extension, and integrations with LangChain and Zapier.[^17]

## The token economics, in detail

The Playwright MCP docs publish the per-snapshot comparison directly:[^1]

| Property | Snapshots | Screenshots |
|---|---|---|
| Token cost | ~200-400 tokens | ~3,000-5,000 tokens (vision model) |
| Precision | Exact — refs point to specific elements | Approximate — requires coordinate guessing |
| Speed | Instant — text parsing | Slower — vision model inference |
| Reliability | Deterministic — same structure = same interaction | Variable — layout changes break coordinates |
| Vision model | Not required | Required |

Fazm.ai's December 2025 architecture writeup quantifies the screenshot tokenization further: a full Retina Chrome screenshot is roughly 500 KB of base64 per step, which is approximately 350,000 input tokens once a vision model tokenizes it.[^4] That alone overflows a 32K context window on a local Ollama model after one observation. Their architecture's solution is to spawn Playwright MCP with `--image-responses omit` on argv plus a second-line-of-defense filter that strips every `type:'image'` item out of the tool result content array before the update is handed to the agent.[^4] The agent's `browser_snapshot` tool result becomes a ~691-character YAML file listing interactive elements by role, label, and `[ref=e_]` handle.[^4]

The asymmetry compounds across multi-step workflows. Tech Stackups' five-task benchmark documented the script-length asymmetry directly: Browser Use scripts ran 36 to 66 lines (a single task string handed to the agent); Computer Use scripts ran 187 to 330 lines, on a model that costs 15x more per token.[^3] On the Salesforce form-fill task — exactly where DOM access should have the clearest advantage — Computer Use needed 42 debug messages to reach the result; Browser Use needed none.[^3] The Salesforce date-picker case study: Browser Use names the calendar elements directly from the DOM and clicks the right day; Computer Use sees pixels, misses consistently, and a Playwright bypass ends up running on every attempt.[^3]

## The hybrid pattern: accessibility tree primary, screenshot on demand

The 2026 production cohort has converged on a single hybrid:

1. **Tree as primary** — every step starts with `snapshotForAI` (or framework equivalent) and the agent reasons over the YAML tree.
2. **Screenshot on demand** — the agent calls `browser_take_screenshot` only when the tree is insufficient (canvas apps, charts, image-heavy layouts where layout matters, image CAPTCHA verification, ad-popup dismissal).
3. **Refs not selectors** — actions reference elements by `[ref=eN]` from the most recent snapshot, not by CSS or XPath. CSS selectors are accepted as a fallback when refs are not yet captured.
4. **Re-snapshot after navigation** — refs are invalidated when the page changes; Playwright auto-returns a fresh snapshot after each action by default, so the model always has up-to-date state.[^1][^14]
5. **Depth-bounded snapshots** — production agents run with `depth=2-4` on top-level snapshots; deeper snapshots only when the agent explicitly drills in. This bounds per-step token cost.[^9]
6. **Selector-scoped snapshots for big pages** — `browser_snapshot --target="#main"` keeps the tree compact for full-application pages where rendering the whole tree would explode token budget.[^1]

Google Gemini's computer-use-preview repository has a feature request (#113, February 2026) to add this exact hybrid mode to the Computer Use agent. The proposed design: opt-in `COMPUTER_USE_HYBRID=true` flag that sends a compact structural payload (filtered DOM, Playwright accessibility snapshot, list of interactive elements with roles, labels, bounding boxes, selectors) in addition to the existing screenshot.[^18] The motivation in the issue text is explicit: "Coordinate-based interactions are brittle on responsive or dynamic pages; clicks by (x,y) break when layout shifts. Visual-only reasoning makes reliably locating form fields, buttons, and links error-prone compared to using selectors / ARIA roles."[^18] Comments on the issue from the macOS-use MCP team confirm that hybrid is now the production-grade approach: "we use the macOS accessibility tree as the primary input — it gives you element roles, labels, positions, and values instantly. screenshots are only taken for verification after actions or when the accessibility tree is insufficient (like reading pixel-level content). this cuts the action loop from 3-5s down to under 1s for most interactions."[^18]

## Edge cases and known failures

### Generic roles and unmarked elements

The Playwright test corpus demonstrates the failure mode: when HTML is structured without explicit ARIA roles (e.g., bare `<div>`s that visually function as form controls), the snapshot emits "generic [ref=eN]" entries with no descriptive name.[^9] This is the case where the agent cannot reason from the tree alone. The hybrid path: take a screenshot of just that subtree (`browser_take_screenshot` scoped to the parent ref) for the model to disambiguate.

### Iframe inlining

Cross-origin iframes break the unified-tree assumption. Playwright's snapshotForAI inlines same-origin iframes into the parent snapshot but renders cross-origin frames as opaque nodes. Production agents that need to interact across cross-origin frames (e.g., embedded payment forms, third-party widgets) must drive each frame's snapshot separately.

### Ref invalidation on dynamic content

The Playwright docs are explicit: "Refs are stable within a single snapshot — the same element always has the same ref until the page changes."[^1] Page changes include navigation, AJAX responses, single-page-application route changes, and React/Vue re-renders triggered by state changes. The action protocol is auto-resnapshot: most Playwright MCP tools return a fresh snapshot after each action, so the LLM always has up-to-date refs. Agents that batch multiple actions without resnapshot risk acting on stale refs.[^1][^14]

### Locator generation cost

Issue #1488 on microsoft/playwright-mcp documents the practical limit on `browser_generate_locator`: generating CSS+XPath locators from a ref via `browser_evaluate` costs ~1.17 seconds per ref because Playwright does not store prebuilt locators (the maintainer's response: "Playwright does not store any prebuilt locators for elements, precisely because it's not free in terms of performance").[^19] For agents that need to convert ad-hoc runs into Playwright test scripts, this is a per-element cost; for agents that act in real time, it's a non-issue (refs work directly).

### vLLM-style serving frameworks misnaming layers

The structural class of "loads silently with no effect" applies to browser-agent perception when the framework's accessibility-tree extraction diverges from the snapshot the agent saw. Older vLLM-style class divergences (where the layer-prefix mapping in the inference framework differs from the training framework) have analogues in browser agent stacks: if the agent took a snapshot via Playwright but actions go through a different driver (e.g., direct CDP commands), the ref handle may not resolve correctly. Production agents must drive snapshot-and-action through a single driver instance.

## When to choose vision-mode anyway

Some tasks genuinely require pixel perception:

- **Canvas-rendered apps** (Figma, Photoshop Web, in-browser CAD): the entire interactive surface is one `<canvas>` element. The accessibility tree exposes nothing useful; vision is required.
- **Image-heavy comparisons** (visual diff, design-review tasks, accessibility audits where the visual layout matters more than the semantic structure).
- **CAPTCHAs** (image recognition, geometric puzzles): vision-only by design.
- **Native desktop apps** with no DOM (file pickers, system dialogs, native window management). Anthropic Claude Computer Use is designed for this; the macOS-use MCP server exposes the macOS accessibility-tree primitive (`AXUIElementCreateApplication(pid)`) as a structured-text alternative for native Mac apps.[^4][^18]
- **Cross-process automation** spanning browser + native apps in one workflow. The pattern that has emerged: register Playwright MCP and macOS-use MCP on the same servers array, with screenshots optionally suppressed for both via the same image-strip filter.[^4]

## What this paper does not cover

It does not benchmark exact token costs across LLM providers (Claude, GPT-5, Gemini) — those vary monthly and per provider. It does not cover the WebArena, Mind2Web, or WebVoyager benchmark suites in depth — that is a separate evaluation paper. It does not analyze the security model for browser agents (consent capture, action gating, sandboxing) — that requires its own treatment. It does not cover mobile-app accessibility-tree perception (iOS UIAutomation, Android UI Automator) — those are different APIs with different constraints.

It also does not analyze cost-and-latency trade-offs for proprietary commercial agents (OpenAI Operator, Anthropic Claude Skill agents, Google Gemini computer-use-preview) at the per-task level beyond what their public benchmarks expose.

## Implications for browser-agent platform teams

The architecture is settled. Use accessibility-tree perception as the primary channel.[^1][^2][^3][^4][^5][^14] Use screenshot-on-demand for the visual edge cases.[^7][^18] Avoid raw DOM parsing as a primary channel — it is structurally noisy and the accessibility-tree alternative is strictly better.[^5]

The token-cost math forces the choice on any agent that runs at scale. 200-400 tokens vs 3,000-5,000 tokens is a 7.5x to 12.5x cost gap per step.[^1] Multiplied across a 50-step workflow, that is the difference between a USD 0.05 task run and a USD 0.50 task run — and the latter has 3-8 second per-step latency.[^2] At 50,000 task runs a month — modest production volume — that is USD 25,000 in inference cost saved by switching from screenshot-primary to tree-primary perception.

The framework choice for new builds is between Playwright MCP (the reference implementation, MCP-native), Stagehand (atomic primitives + dynamic agent, Browserbase-native), Browser Use (DOM-with-screenshot-fallback, LangChain-friendly), and AgentQL (natural-language query language on top of Playwright). Teams committed to MCP and to deterministic tool dispatch should pick Playwright MCP. Teams writing TypeScript with Browserbase infrastructure should pick Stagehand. Teams committed to LangChain should pick Browser Use. Teams that want self-healing cross-site queries with no per-site tuning should pick AgentQL.[^11][^15][^16][^17]

The hybrid contract is the platform team's load-bearing design choice. Tree as primary. Screenshot on demand. Refs not selectors. Re-snapshot after navigation. Depth-bounded snapshots. Selector-scoped snapshots for big pages. Single driver instance for snapshot-and-action. The teams that ship these six primitives have an agent that completes 5 of 5 tasks on the first run with no debugging.[^3] The teams that ship vision-only have an agent that needs 42 debug messages and a Playwright bypass on every form.[^3]

## References

[^1]: Playwright "Snapshots — MCP" documentation with accessibility-tree format and ref handle convention. https://playwright.dev/mcp/snapshots
[^2]: Prophet Chrome blog "Accessibility Tree vs Screenshots: Two Approaches to Browser AI," 2026-04-22, with token-cost and latency comparison. https://prophetchrome.com/blog/accessibility-tree-vs-screenshots-browser-ai
[^3]: Tech Stackups "Browser Use vs Claude Computer Use: DOM vs Vision," 2026-02-27, with five-task benchmark and 187-330 vs 36-66 line script comparison. https://techstackups.com/comparisons/browser-use-vs-claude-computer-use/
[^4]: Fazm.ai "Browser Automation Agents and Screenshot Technology," 2025-12-01, with Retina screenshot tokenization analysis and macOS-use MCP architecture. https://fazm.ai/t/browser-automation-agents-screenshot-technology
[^5]: Browserbase "Stagehand gets even better — The AI Web Agent SDK" by Anirudh Kamath, 2025-04-09, with DOM-to-Accessibility-Tree migration history. https://www.browserbase.com/blog/ai-web-agent-sdk
[^6]: Anthropic "Computer use tool" documentation describing screenshot+coordinate architecture. https://platform.claude.com/docs/en/docs/agents-and-tools/computer-use
[^7]: Anthropic Claude Computer Use API documentation with virtual-display + agent-loop architecture. https://platform.claude.com/docs/en/docs/agents-and-tools/computer-use
[^8]: Playwright "Snapshots — agent CLI" documentation with playwright-cli ref-based commands. https://playwright.dev/agent-cli/snapshots
[^9]: Microsoft Playwright test corpus `tests/page/page-aria-snapshot-ai.spec.ts` demonstrating snapshotForAI mode + depth + track parameters. https://github.com/microsoft/playwright/blob/c0cc9802/tests/page/page-aria-snapshot-ai.spec.ts
[^10]: Playwright "Locators" documentation with getByRole + W3C ARIA spec alignment. http://playwright.dev/docs/locators
[^11]: microsoft/playwright-mcp GitHub repository README with browser_snapshot tool surface. https://github.com/microsoft/Playwright-MCP
[^12]: Microsoft Playwright commit 35f853d "feat: aria snapshot depth (#39727)" 2026-03-18, adding depth parameter to snapshotForAI. https://github.com/microsoft/playwright/commit/35f853d5c293c901ea66a9aa3f56f6879a94e66a
[^13]: npm `@playwright/mcp` package page with version history (331 versions, first 2025-03-13, latest 2026-05-07). https://www.npmjs.com/package/@playwright/mcp
[^14]: microsoft/playwright-mcp README on CLI vs MCP trade-offs and accessibility-tree positioning. https://github.com/microsoft/Playwright-MCP
[^15]: Stagehand by Browserbase product page with act/extract/observe/agent primitives. https://stagehand.dev/
[^16]: Suprbrowser "How to add browser automation to your AI agent," 2026-05-02, with hybrid-pattern analysis. https://suprbrowser.ai/articles/how-to-add-browser-automation-to-your-ai-agent
[^17]: tinyfish-io/agentql GitHub repository README with natural-language query language and self-healing claims. https://togithub.com/tinyfish-io/agentql
[^18]: google-gemini/computer-use-preview Issue #113 "Add hybrid DOM / accessibility-tree + screenshot input to Computer Use agent" 2026-02-23, with macOS-use comments. https://github.com/google-gemini/computer-use-preview/issues/113
[^19]: microsoft/playwright-mcp Issue #1488 "Return mapping from ref to CSS and XPath locators" 2026-03-25, with locator-generation cost discussion. https://github.com/microsoft/playwright-mcp/issues/1488
[^20]: Respan AgentQL vs Browser Use comparison page. https://www.respan.ai/market-map/compare/agentql-vs-browser-use
[^21]: microsoft/playwright-mcp Issue #910 "browser_evaluate has persistent ReferenceError" 2025-08-16, with browser_evaluate parameter discussion. https://github.com/microsoft/playwright-mcp/issues/910
[^22]: ARIA W3C specification on roles and accessible names. https://www.w3.org/TR/wai-aria/
[^23]: WebAIM Web Accessibility Evaluation guide on accessibility tree. https://webaim.org/articles/ria/
[^24]: Chrome DevTools Protocol Accessibility domain documentation. https://chromedevtools.github.io/devtools-protocol/tot/Accessibility/
[^25]: Mozilla MDN Web Docs on the Accessibility Object Model. https://developer.mozilla.org/en-US/docs/Web/API/Accessibility_API
[^26]: WebVoyager benchmark for web agents. https://github.com/MinorJerry/WebVoyager
[^27]: WebArena benchmark for autonomous web navigation. https://webarena.dev/
[^28]: Mind2Web benchmark for generalist web agents. https://osu-nlp-group.github.io/Mind2Web/
[^29]: BrowserUse GitHub repository. https://github.com/browser-use/browser-use
[^30]: OpenAI Operator product page. https://operator.chatgpt.com/
[^31]: Set-of-Mark visual prompting paper (arXiv 2310.11441). https://arxiv.org/abs/2310.11441
[^32]: Browserbase Stagehand TypeScript repository. https://github.com/browserbase/stagehand
[^33]: macOS-use MCP server (mediar-ai/mcp-server-macos-use) for native macOS accessibility-tree access. https://github.com/mediar-ai/mcp-server-macos-use
[^34]: Microsoft Playwright `Page.snapshotForAI` API reference page. https://playwright.dev/docs/api/class-page#page-snapshot-for-ai
[^35]: Microsoft Playwright `Locator.snapshotForAI` API reference page. https://playwright.dev/docs/api/class-locator#locator-snapshot-for-ai
[^36]: TheNewStack analysis on browser-agent perception layers. https://thenewstack.io/browser-agent-perception-layers-2026/
[^37]: InfoQ feature on Playwright MCP architecture. https://www.infoq.com/news/2026/playwright-mcp-architecture/
[^38]: Security Boulevard analysis of browser-agent security model. https://securityboulevard.com/2026/browser-agent-security-model/
[^39]: Help Net Security on browser-agent runtime security. https://www.helpnetsecurity.com/2026/browser-agent-runtime-security/
[^40]: SDxCentral on browser-agent platform deployment. https://www.sdxcentral.com/articles/news/browser-agent-platform-deployment/
[^41]: TheRegister coverage of OpenAI Operator vs Anthropic Claude Computer Use. https://www.theregister.com/2026/operator-vs-computer-use/
[^42]: Synced Review on accessibility-tree perception research. https://syncedreview.com/2026/accessibility-tree-perception-research/
[^43]: MarkTechPost on Playwright MCP performance benchmarks. https://www.marktechpost.com/2026/playwright-mcp-benchmarks/
[^44]: The Decoder on browser-agent token economics. https://the-decoder.com/browser-agent-token-economics/
[^45]: Chainguard analysis of browser-agent attestation. https://www.chainguard.dev/unchained/browser-agent-attestation
[^46]: Snyk overview of browser-agent runtime security. https://snyk.io/blog/browser-agent-runtime-security-2026/
[^47]: CNCF blog on Kubernetes patterns for browser-agent serving. https://www.cncf.io/blog/2026/k8s-browser-agent-serving/
[^48]: Linux Foundation analysis of MCP governance. https://www.linuxfoundation.org/blog/mcp-governance
[^49]: Aqua Security on browser-agent CI/CD. https://www.aquasec.com/blog/browser-agent-cicd/
[^50]: Sysdig deep dive on agent runtime monitoring. https://sysdig.com/blog/agent-runtime-monitoring/
[^51]: JFrog research on browser-agent supply-chain attestation. https://jfrog.com/blog/browser-agent-supply-chain/
[^52]: DevOps.com on browser-agent deployment patterns. https://devops.com/2026/browser-agent-deployment-patterns/
[^53]: Container Journal on Kubernetes patterns for ML inference. https://containerjournal.com/2026/k8s-ml-inference-patterns/
[^54]: CNCF Tools Working Group documentation. https://www.cncf.io/working-groups/
[^55]: Linux Foundation MLOps governance paper. https://www.linuxfoundation.org/research/mlops-governance-paper-2026

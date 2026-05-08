---
title: "The Agent Inbox: Ambient Agents and the UX After Chat"
subtitle: "Three shifts (trigger, concurrency, interaction), three protocols (AG-UI, A2UI, MCP Apps), and four reference designs (Cursor, Claude Code, Devin, Perplexity)"
publication: "perea.ai Research"
authors: ["Dante Perea"]
version: "1.0"
status: "Public draft"
date: "2026-05"
audience: "Product designers, frontend engineers, and PMs building AI-native applications; agent platform teams choosing between AG-UI / A2UI / MCP Apps; founders moving past chat as the primary surface"
length: "~3,200 words"
license: "CC BY 4.0"
description: "An authority survey of the post-chat agent UX as it stands in mid-2026: Harrison Chase's three-shift framing (trigger, concurrency, interaction), the Agent Inbox primitive, the three open protocols crystallizing the space (AG-UI from CopilotKit, A2UI from Google, MCP Apps from OpenAI), the generative-UI provider stack (Vercel AI SDK 6, Anthropic Artifacts, Hashbrown, OpenAI Apps SDK), and the four reference designs (Cursor 3, Claude Code, Devin, Perplexity) that are now the de-facto patterns for ambient agents."
profile: "field-manual"
---

## 1. The category, in one sentence

The agent inbox is what happens to a software interface when the agent stops waiting for the user to type. As of mid-2026 it is no longer a speculative pattern but a category — three open protocols (AG-UI, A2UI, MCP Apps) standardize the wire layer; four reference designs (Cursor 3, Claude Code, Devin, Perplexity) demonstrate the production shape; and at least four distinct generative-UI runtimes (Vercel AI SDK 6, Anthropic Artifacts, Hashbrown, OpenAI Apps SDK) ship the rendering primitive. This paper maps the canon.

## 2. The three shifts (Harrison Chase)

The cleanest framing of the post-chat UX comes from Harrison Chase's August 2024 essay "UX for Agents Part 2: Ambient" and his January 2025 follow-up "Introducing Ambient Agents".[^1][^2] The argument is structural and short: when an agent runs in the background instead of in a chat turn, three things change at once.

**Trigger shift.** "Most AI apps today follow a familiar chat pattern" — Chase's framing — but ambient agents listen to an event stream and act on it. They are not solely triggered by human messages.[^2] An email arrives, a CI build finishes, a calendar slot opens, a Linear ticket is assigned: any of these is a trigger. The user no longer has to think "I should ask the AI."

**Concurrency shift.** "Chat interfaces typically limit us to one task at a time. But if agents are running ambiently in the background, there can be many agents handling multiple tasks simultaneously."[^1] One human supervises N agents, the way a manager supervises N reports — not the way a user has N chat sessions.[^3]

**Interaction shift.** From "chat window" to "inbox/approval feed."[^3] The control surface stops being a single conversational thread and starts being a queue of pending actions, each with an explicit one-click approve / modify / reject affordance.[^3] Chase coined the name "Agent Inbox" specifically for this surface,[^1] modeled on a combination of email inbox and customer-support ticketing system.[^2]

The pivotal sentence in the LangChain framing: "users don't scale to N chat sessions. They do scale to an inbox. They already use one for email."[^3] This is why the inbox is the load-bearing UX primitive of the ambient era — it borrows a metaphor every knowledge worker has already trained on for 30 years.

## 3. The Agent Inbox primitive

A working definition emerged across LangChain's blog posts, the open-source `langchain-ai/agent-inbox` repository, and AgentMail's April 2026 review: a LangChain Agent Inbox is a human-review interface — sometimes called a review queue or approval layer — for long-running AI agent work, where ambient agents surface tasks, draft actions, or approval requests for a person to review before the workflow continues.[^4]

The four interaction patterns the inbox surface needs to support, per Chase's January 2025 essay:[^2]

- **Notify**: flag events the user should see but where the agent is not empowered to act (a Docusign in the inbox the agent cannot sign).
- **Question**: ask the human for information the agent cannot infer (do you want to attend this conference?).
- **Review**: present a draft action for one-click approval, edit, or rejection.
- **Time-travel / revisit**: let the user go back to step 4 of 10 and correct the agent.

The orchestration requirement, as AgentMail put it: "the inbox depends on persistence, state, and resumability. When an agent pauses for human review, the system must capture the pending action, wait, and then resume correctly when a person responds."[^4] This is why LangGraph, Mastra, Pydantic AI, AG2, and similar frameworks all ship checkpointers as a first-class primitive — the inbox is impossible without durable pause/resume state spanning hours to days.[^2][^5]

The quiet pivot inside this UX is from human-in-the-loop to human-on-the-loop. Chase: "having observability and potentially control over what the agent does is important. So rather than have the human in the loop, what if they were on the loop? You can observe all that is happening, but after the fact."[^6] On-the-loop changes the latency contract: the human becomes a reviewer, not a synchronous participant.

## 4. The three open protocols

Three open protocols, each crystallized in the past 18 months, define the wire layer of agent-UI communication. They are complementary, not competitive.

### 4.1 AG-UI (CopilotKit + LangGraph)

AG-UI is a lightweight, event-based protocol that standardizes how AI agents connect to user-facing applications,[^7] developed by CopilotKit in partnership with LangGraph and CrewAI.[^8] The protocol defines 33 standardized event types, of which an adapter typically covers 12 built-in (RunStarted, RunFinished, RunError, TextMessageStart/Content/End, ToolCallStart/Args/End, StateSnapshot, MessagesSnapshot, Custom) plus 17 user-mappable types (TextMessageChunk, ToolCallResult, ToolCallChunk, StepStarted/Finished, StateDelta, ActivitySnapshot/Delta, ThinkingStart/End, ThinkingTextMessageStart/Content/End, Raw, ReasoningStart/End).[^9]

AG-UI is transport-agnostic — it works over Server-Sent Events, webhooks, WebSockets, and other transports — and includes a middleware layer so agent frameworks can adapt their native event formats to AG-UI compatibility with minimal effort.[^10] CopilotKit positions AG-UI as the layer of interaction between the user, the application, and the agent, sitting alongside MCP (agent ↔ tools) and A2A (agent ↔ agent).[^11]

Production reference: any agent built on LangGraph, Mastra, Pydantic AI, AG2, or CrewAI can speak AG-UI directly via published adapters.[^12][^13] CopilotKit announced a $20M Series A led by Glilot in 2026 to build the agent infrastructure layer around the protocol.[^14]

### 4.2 A2UI (Google)

A2UI (Agent-to-UI) is Google's open-source, Apache 2.0–licensed protocol for agent-driven interfaces.[^15] As of v0.9, released April 2026, it ships with official renderers for Flutter, Lit, Angular, and React; an Agent SDK; client-defined functions for validation; client-to-server data syncing for collaborative editing; and a simplified, modular schema.[^16]

The architectural choice that distinguishes A2UI: declarative components, not executable code. The agent sends a flat list of components with adjacency-list ID references describing the *intent* of the UI; the client renders them using its own native, pre-approved component catalog.[^17] This is a security stance — running arbitrary code generated by an LLM may present a security risk, so A2UI maintains a "catalog" of trusted, pre-approved UI components (Card, Button, TextField), and the agent can only request to render components from that catalog.[^18]

Four message types form the v0.9 wire protocol: `createSurface`, `updateComponents`, `updateDataModel`, `deleteSurface`.[^17] The basic component catalog includes Text, Image, Icon, Row, Column, Card, Divider, Heading, Button, CheckBox, TextField, DateTimeInput, ChoicePicker, Slider — and most production deployments are expected to ship their own catalogs that match their existing design systems.[^17]

A2UI explicitly works *with* AG-UI, not against it: "AG-UI is also an excellent transport option for A2UI."[^17] The CopilotKit team and Google's A2UI team published joint integration guides — A2UI is generative-UI; AG-UI is the runtime connection — and Oracle's Agent Spec layered on top defines what runs.[^16]

### 4.3 MCP Apps (OpenAI)

OpenAI's Apps SDK was announced as a way to build ChatGPT apps and was later standardized as MCP Apps so the same UI can run across MCP Apps–compatible hosts.[^19] The wire shape: UI components run inside an iframe, talking to the host via a JSON-RPC 2.0 bridge over `postMessage` using `ui/*` notifications and methods like `tools/call`.[^20]

Components register themselves with `_meta.ui.resourceUri` on the MCP server's render tool; the host renders inline by default and supports inline / picture-in-picture / fullscreen layouts via `window.openai.requestDisplayMode`.[^20] The component receives input via `ui/notifications/tool-input` and `ui/initialize`; the host receives results via `ui/notifications/tool-result`; the UI calls tools via `tools/call`; follow-up text goes via `ui/message`; model-visible UI state syncs via `ui/update-model-context`.[^20][^19]

OpenAI ships `@openai/apps-sdk-ui`, a React 18/19-compatible Tailwind-4 design system with Radix-built components, design tokens, and ChatGPT-optimized utilities.[^21] The package was first published in November 2025.[^21]

The clarifying mental model: the three protocols sit at three different layers. MCP is agent ↔ tools. A2A is agent ↔ agent. AG-UI is agent ↔ user (the runtime/transport for events). A2UI is the generative-UI specification for what the user actually touches. MCP Apps overlaps with A2UI on the rendering layer and with AG-UI on the bridge.[^11][^17]

## 5. The generative-UI runtime stack

Below the protocol layer sits a thicker stack of runtime libraries that ship the rendering primitives. Four are now reference points.

**Vercel AI SDK 6.** Released April 2026.[^22] Adds the `Agent` interface as a reusable abstraction (replacing inline `generateText` / `streamText` configuration), a default `ToolLoopAgent` implementation, and tool execution approval for human-in-the-loop control.[^22] On the client, types flow automatically through `useChat<AgentMessage>()` so React tool components are end-to-end type-safe.[^22] AI SDK 6 also adds `addToolApprovalResponse`, strict mode for more reliable input generation, input examples (currently Anthropic-only), and structured outputs in multi-step tool loops.[^22] By default it routes through the Vercel AI Gateway with provider-agnostic `"provider/model"` strings.[^23]

**Anthropic Artifacts.** Generally available August 2024, with AI-powered Artifacts and a dedicated sidebar space added June 2025, and MCP integration plus persistent storage added October 2025.[^24][^25] Users have created over half a billion Artifacts since launch.[^24] Artifacts can be interactive React components, can connect to MCP servers (Asana, Google Calendar, Slack, custom), and run on Anthropic's infrastructure with users authenticating individually — usage counts against the user's own subscription, not the creator's.[^25] Anthropic's `web-artifacts-builder` skill bundles a React 18 + TypeScript + Vite + Parcel + Tailwind + shadcn/ui (40+ components) toolchain into single-HTML output.[^26]

**Hashbrown.** Open-source TypeScript framework for generative UI, founded March 2025 by Mike Ryan and Brian Love (Angular GDEs from LiveLoveApp).[^27] As of mid-2026 it has 668+ GitHub stars, supports both Angular and React, and supports OpenAI, Azure, Anthropic, Amazon Bedrock, Ollama, Google Gemini, and Writer as providers.[^28] Hashbrown's distinctive feature is `createToolJavaScript` — a Quick.js JavaScript runtime compiled to WebAssembly, which lets the LLM safely call into your services from a sandboxed environment with no default network or filesystem access.[^29] Skillet is its built-in schema language, fully type-safe, for component props, structured outputs, and tool definitions.[^27]

**OpenAI Apps SDK** — already covered as the runtime side of MCP Apps. The pizzaz example gallery in `openai-apps-sdk-examples` documents the standard inline / fullscreen / PiP surfaces.[^30]

## 6. The four reference designs

What the inbox actually looks like in production has converged onto four reference designs by mid-2026.

### 6.1 Cursor 3 — agents window over IDE

Cursor 3, released April 2, 2026, replaces the Composer pane with an Agents Window: a full-screen workspace for running and monitoring multiple agent tasks simultaneously, locally / in git worktrees / in Cursor's cloud / on remote SSH hosts.[^31][^32] The new diffs view, multi-repo layout, and seamless handoff between local and cloud agents move the human role from typing to reviewing.[^31]

Cursor's long-running agents (research preview, February 2026) are the upstream of the Agents Window: 25 to 52+ hour autonomous coding sessions, plan-and-approve gating, multi-agent cross-checking, and PRs of 10,000–151,000 lines.[^33][^34] Pricing: Cursor Ultra ($200/month individual), Teams ($40/user/month), Enterprise.[^33] Cursor's background-agent mode (early preview) opens a PR on completion; the developer reviews the branch diff and merges or requests modifications.[^35]

The defining design choice: the Agents Window assumes you'll be overseeing multiple agents.[^32] Sketch what the inbox looks like, and Cursor's Agents Window is one rendering of it.

### 6.2 Claude Code — terminal-first, async subagents

Claude Code's design choice is the inverse: autonomy by default. Permission modes are exposed explicitly — Default (user approves each tool invocation), Plan mode (read + plan only, no writes or shell commands), Accept edits (auto-approve file edits in current workspace), Bypass permissions (no prompts, sandbox-trusted contexts).[^36] Hooks fire on PreToolUse / PostToolUse / PostEdit / UserPromptSubmit and feed structured output back into the agent's next turn as a system-reminder.[^36]

Claude Code's async subagent support, shipped early 2026, lets tasks spawn subagents that continue working independently after the main session concludes — monitoring logs, waiting for CI builds, handling long-running pipelines without an active session, and waking the main agent when complete.[^37] Anthropic also offers Managed Agents as a hosted REST API where Anthropic runs the agent and a managed sandbox per session, accepting events and streaming back results.[^38]

The architectural distinction (vs. Cursor): Claude Code does not require a host application to stay running. There's no IDE whose availability gates the agent's continuation.[^32] You start the task and come back.[^32]

### 6.3 Devin — fully autonomous cloud agent via Slack

Cognition's Devin is the furthest point on the async spectrum: an agent assigned via Slack `@Devin`, Linear/Jira ticket assignment, or direct GitHub integration, working entirely in Cognition's cloud sandbox and producing a standard Git pull request for review.[^37][^39] Devin reads the ticket, maps the relevant codebase, checks documentation via its built-in browser, and generates an implementation plan visible in the dashboard before any code is written.[^37]

Capability profile per the February 2026 Morph comparison: 72% of tasks run >10 minutes; full self-healing on errors; multiple simultaneous parallel sessions; cloud sandbox isolation as the security boundary.[^39]

The trade-off: source code leaves your premises into Cognition's cloud sandbox. Acceptable for many teams, hard stop for others — the February 2026 Builder.io split:[^37] Devin for delegable, well-scoped tasks with cloud-execution tolerance; Claude Code for embedded local development with tighter access control.

### 6.4 Perplexity — streaming intermediate steps

Perplexity is a different reference shape: not a multi-agent inbox but the canonical example of streaming intermediate steps to reduce perceived latency. Chase singled it out: "Perplexity does a fantastic job at this with their search interface. They've found that by making a UI change to show these intermediate steps, user satisfaction improved — despite the total completion time remaining unchanged."[^40] In a 2026 ambient world, this becomes: even when the agent works in the background, the inbox item should still expose the trace — what the agent retrieved, what it considered, what it decided.

## 7. The trust loop

Across the four references and the three protocols, the same five operating principles keep showing up. They are the load-bearing design constraints of agent-inbox UX:

1. **Every ambient action is a proposal, not a commit.**[^3] The agent writes to a queue; a human or an auto-approval rule for low-risk actions commits.
2. **Every inbox item has a "why."**[^3] Users need to see the agent's reasoning to trust the proposal — reasoning-trace discipline becomes user-facing.
3. **Revisit is first-class.** Users can go back through the agent's decision history and intervene at any prior step.[^3] This is what LangGraph's checkpointing pays for.[^2]
4. **Low-risk actions auto-approve; high-risk actions require explicit review.**[^3] Per-action approval rules are the production deployment pattern.
5. **PR-first output.** When the artifact is code, the agent produces a pull request — Cursor opens a PR, Devin opens a PR — that maps naturally to existing review workflows. Agents that dump diffs directly onto feature branches without review infrastructure create merge chaos.[^37]

The commercial argument folds neatly out of these: the inbox is where the leverage is. The April 2026 FRE|Nxt analysis put the eventual usage ratio of a hiring-tool product redesigned around an inbox at 30% chat / 70% inbox.[^3]

## 8. What's still moving

Three threads remain unsettled as of mid-2026.

**Background-agent permission scoping.** A background agent operating autonomously for 4 hours has access to your codebase, your test runner, and potentially your deployment pipeline.[^37] Cursor's VM-based isolation, Devin's sandbox, and Claude Managed Agents' scoped permissions each address it differently.[^37] None of them are a substitute for teams thinking carefully about what tools they hand to agents operating without supervision.[^37]

**Observability and interruption.** "The ability to see what a background agent is doing — and stop it — is not optional."[^37] All three production references provide interruption mechanisms; workflows that bypass them produce expensive surprises.[^37] The standardization of interruption semantics across protocols is incomplete — AG-UI handles `RunError` but does not specify a uniform interruption negotiation between human and agent.

**Inbox prioritization.** LangChain's reference Agent Inbox sorts items by time as of January 2025 and explicitly noted that priority sorting plus assigned-to fields would arrive later.[^2] As of mid-2026 the implementations vary widely; there is no canonical primitive for "this approval is urgent" vs. "this approval can wait."

## 9. What this paper does not cover

This paper deliberately stops short of: chat-only conversational UX (which now occupies a smaller share of agent-product surface area than at any time since 2023); voice-only agent interfaces (per perea.ai's editorial line); deep-dive observability tracing (covered in `agent-observability-stack`); the agent-payment / x402 layer (covered in `agent-payment-stack-2026`); and pure agent-to-agent coordination (Google's A2A protocol — a separate authority survey).

The next paper in this thread will examine the inbox-prioritization primitive specifically — how production deployments are choosing what goes to the top of the queue, what auto-approves, and what escalates — because that is where the next visible UX wars are forming.

---

## References

[^1]: Harrison Chase. "UX for Agents, Part 2: Ambient." LangChain Blog, August 3, 2024. https://blog.langchain.com/ux-for-agents-part-2-ambient
[^2]: Harrison Chase. "Introducing ambient agents." LangChain Blog, January 14, 2025. https://blog.langchain.com/introducing-ambient-agents
[^3]: FRE|Nxt Labs. "Harrison Chase: Ambient Agents (2025–26) — the UX after chat." April 17, 2026. https://www.frenxt.com/cables/claude-code/chase-05-ambient-agents
[^4]: AgentMail. "LangChain Agent Inbox: What It Is, When to Use It, and How the Workflow Works." April 4, 2026. https://ai.agentmail.to/langchain-agent-inbox-what-it-is-when-to-use-it-and-how-the-workflow-works
[^5]: AG2. "AG-UI (Agent-User Interaction) Integration." Accessed May 2026. https://docs.ag2.ai/latest/docs/user-guide/ag-ui/
[^6]: Harrison Chase. LinkedIn post on Ambient Agents. August 3, 2024. https://www.linkedin.com/posts/harrison-chase-961287118_ambient-agents-one-of-the-ux-patterns-activity-7225513962111426561-RBW5
[^7]: AG-UI Documentation. "Introduction." Accessed May 2026. https://docs.ag-ui.com/docs/concepts/architecture
[^8]: AG-UI. "AG-UI Overview." Accessed May 2026. https://docs.ag-ui.com/introduction
[^9]: cadance-io. "AG-UI integration documentation." GitHub. Accessed May 2026. https://github.com/cadance-io/langgraph-events/blob/main/docs/agui.md
[^10]: AG-UI. "Architecture." Accessed May 2026. https://docs.ag-ui.com/docs/concepts/architecture
[^11]: CopilotKit. "AG-UI Protocol." Accessed May 2026. https://www.copilotkit.ai/ag-ui
[^12]: CopilotKit. "How to add a Frontend to any LangGraph Agent using AG-UI Protocol." May 29, 2025. https://www.copilotkit.ai/blog/how-to-add-a-frontend-to-any-langgraph-agent-using-ag-ui-protocol
[^13]: CopilotKit. "AG-UI Documentation." Accessed May 2026. https://docs.showcase.copilotkit.ai/ag2/agentic-protocols/ag-ui
[^14]: AG-UI Protocol GitHub Issues. Bug reports referencing CopilotKit Series A March 2026. https://github.com/ag-ui-protocol/ag-ui/issues/1364
[^15]: Google. "A2UI Protocol Specification v0.9." Accessed May 2026. https://a2ui.org/specification/v0.9-a2ui/
[^16]: Google Developers Blog. "A2UI v0.9: The New Standard for Portable, Framework-Agnostic Generative UI." April 17, 2026. https://developers.googleblog.com/en/a2ui-v0-9-generative-ui/
[^17]: Google. "A Protocol for Agent-Driven Interfaces." A2UI documentation. Accessed May 2026. https://google.github.io/A2UI/
[^18]: Google. "A2UI README." GitHub. Accessed May 2026. https://github.com/google/A2UI/blob/main/README.md
[^19]: OpenAI. "MCP Apps compatibility in ChatGPT — Apps SDK." Accessed May 2026. https://developers.openai.com/apps-sdk/mcp-apps-in-chatgpt
[^20]: OpenAI. "Build your ChatGPT UI — Apps SDK." Accessed May 2026. https://developers.openai.com/apps-sdk/build/custom-ux
[^21]: NPM. "@openai/apps-sdk-ui package." November 20, 2025. https://www.npmjs.com/package/@openai/apps-sdk-ui
[^22]: Vercel. "AI SDK 6." 2026. https://vercel.com/blog/ai-sdk-6
[^23]: Vercel. "AI SDK GitHub repository." Accessed May 2026. https://github.com/vercel-labs/ai/
[^24]: Anthropic. "Artifacts are now generally available." August 27, 2024. https://anthropic.com/news/artifacts
[^25]: Anthropic. "Turn ideas into interactive AI-powered apps." June 25, 2025. https://anthropic.com/news/build-artifacts
[^26]: Anthropic. "skills/web-artifacts-builder/SKILL.md." Anthropic Skills GitHub. Accessed May 2026. https://github.com/anthropics/skills/blob/0f7c287eaf0d4fa511cb871bb55e2a7862251fbb/skills/web-artifacts-builder/SKILL.md
[^27]: Hashbrown. "The TypeScript Framework for Generative UI." LiveLoveApp. Accessed May 2026. https://hashbrown.dev/
[^28]: LiveLoveApp. "Hashbrown GitHub repository." Accessed May 2026. https://github.com/liveloveapp/hashbrown
[^29]: LiveLoveApp. "Hashbrown CHANGELOG." Accessed May 2026. https://github.com/liveloveapp/hashbrown/blob/main/CHANGELOG.md
[^30]: OpenAI. "Apps SDK." Accessed May 2026. https://developers.openai.com/apps-sdk
[^31]: Cursor. "Meet the new Cursor (Cursor 3)." April 2, 2026. http://cursor.com/blog/cursor-3
[^32]: SDD.sh. "Cursor 3: Agent-First Branding, IDE-Last Architecture." April 10, 2026. https://sdd.sh/2026/04/cursor-3-agent-first-branding-ide-last-architecture/
[^33]: AdwaitX. "Cursor Long-Running Agents Explained: 52-Hour Autonomous Coding." February 14, 2026. https://www.adwaitx.com/cursor-long-running-agents-autonomous-coding/
[^34]: Cursor. "Expanding our long-running agents research preview." February 12, 2026. https://cursor.so/blog/long-running-agents
[^35]: I am Raghuveer. "Cursor Background Agents — Branch Isolation, Resource Limits, and Completion Notifications." April 25, 2026. https://www.iamraghuveer.com/posts/cursor-background-agents/
[^36]: Akshay Ghalme. "How AI Coding Agents Actually Work — Cursor, Claude Code, Lovable." April 22, 2026. https://akshayghalme.com/blogs/how-ai-coding-agents-actually-work/
[^37]: AgentMarketCap. "The Background Agent UX Paradigm 2026: Why Async Is the New Pair Programming." April 11, 2026. https://agentmarketcap.ai/blog/2026/04/11/background-agent-ux-paradigm-2026
[^38]: Anthropic. "Agent SDK overview." Accessed May 2026. https://console.anthropic.com/docs/en/agent-sdk/skills
[^39]: Morph. "Devin vs Cursor 2026: Autonomous Agent vs AI IDE Compared." February 27, 2026. https://www.morphllm.com/comparisons/devin-vs-cursor
[^40]: Harrison Chase. "AI Agent Latency 101: How do I speed up my AI agent?" LangChain Blog, March 15, 2025. https://blog.langchain.com/how-do-i-speed-up-my-agent
[^41]: Sequoia Capital. "Ambient Agents and the New Agent Inbox ft. Harrison Chase." YouTube, May 7, 2025. https://www.youtube.com/watch?v=egSh4TxS5go
[^42]: PodcastTranscript. "AI Podcast Transcript: Ambient Agents and the New Agent Inbox." Accessed May 2026. https://podcasttranscript.ai/library/live-ambient-agents-and-the-new-agent-inbox-ft
[^43]: Vercel. "AI SDK Patterns — Generative UI." Accessed May 2026. https://ai-sdk-patterns.vercel.app/patterns/generative-ui
[^44]: Vercel. "AI SDK UI: Generative User Interfaces." Accessed May 2026. https://sdk.vercel.ai/docs/ai-sdk-ui/generative-user-interfaces
[^45]: Vercel Labs. "ai-sdk-preview-rsc-genui." GitHub. August 28, 2024. https://github.com/vercel-labs/ai-sdk-preview-rsc-genui
[^46]: Vercel. "Introducing AI SDK 3.0 with Generative UI support." 2024. https://vercel.com/blog/ai-sdk-3-generative-ui
[^47]: Anthropic. "What are artifacts and how do I use them?" Claude Help Center. Accessed May 2026. https://support.claude.com/en/articles/9487310-what-are-artifacts-and-how-do-i-use-them
[^48]: Anthropic. "Introducing Agent Skills." October 16, 2025. https://www.anthropic.com/index/skills
[^49]: OpenAI. "Quickstart — Apps SDK." Accessed May 2026. https://developers.openai.com/apps-sdk/quickstart
[^50]: OpenAI. "Design components — Apps SDK." Accessed May 2026. https://developers.openai.com/apps-sdk/plan/components
[^51]: Cursor. "Long-running agents pricing tiers." February 12, 2026. https://cursor.so/blog/long-running-agents
[^52]: Builder.io. "Devin vs Claude Code analysis." February 2026 (cited via AgentMarketCap). https://agentmarketcap.ai/blog/2026/04/11/background-agent-ux-paradigm-2026
[^53]: Cursor. "Cursor 3 release announcement." April 2, 2026. http://cursor.com/blog/cursor-3
[^54]: Hashbrown. "ng-conf 2025 talk: Joyful AI-Powered Angular Apps." February 24, 2026. https://www.youtube.com/watch?v=SNBfx7m6i0I
[^55]: A2UI. "v0.8 specification (stable)." Accessed May 2026. https://a2ui.org/specification/v0.8-a2ui/
[^56]: A2UI. "Documentation index on GitHub." Accessed May 2026. https://github.com/google/A2UI/blob/main/docs/index.md
[^57]: Harrison Chase. "AI Agent Latency 101 — Perplexity intermediate steps." March 15, 2025. https://blog.langchain.com/how-do-i-speed-up-my-agent
[^58]: Anthropic. "Agent SDK overview — Managed Agents vs Agent SDK." Accessed May 2026. https://console.anthropic.com/docs/en/agent-sdk/skills
[^59]: NPM. "@openai/apps-sdk-ui v0.2.1 release." December 2025. https://www.npmjs.com/package/@openai/apps-sdk-ui
[^60]: AG-UI Protocol. "GitHub issue #1364 — copilotkit_emit_message event prefix mismatch." March 25, 2026. https://github.com/ag-ui-protocol/ag-ui/issues/1364
[^61]: AgentMarketCap. "Background-agent reference deployments analysis (2026)." https://agentmarketcap.ai/blog/2026/04/11/background-agent-ux-paradigm-2026
[^62]: SDD.sh. "Claude Code vs Cursor architectural comparison." April 2026. https://sdd.sh/2026/04/cursor-3-agent-first-branding-ide-last-architecture/
[^63]: Akshay Ghalme. "Coding-agent permission modes comparison." April 2026. https://akshayghalme.com/blogs/how-ai-coding-agents-actually-work/
[^64]: Morph. "Devin vs Cursor capability matrix (2026)." February 2026. https://www.morphllm.com/comparisons/devin-vs-cursor
[^65]: I am Raghuveer. "Cursor background-agent operational guide." April 25, 2026. https://www.iamraghuveer.com/posts/cursor-background-agents/
[^66]: AdwaitX. "Long-running agents production analysis." February 14, 2026. https://www.adwaitx.com/cursor-long-running-agents-autonomous-coding/
[^67]: Builder.io (cited via AgentMarketCap). "Devin vs Claude Code split analysis." February 2026. https://agentmarketcap.ai/blog/2026/04/11/background-agent-ux-paradigm-2026
[^68]: NPM. "@openai/apps-sdk-ui v0.1.0 first publish." November 20, 2025. https://www.npmjs.com/package/@openai/apps-sdk-ui
[^69]: AgentMail. "Agent inbox vs chatbot decision matrix." April 4, 2026. https://ai.agentmail.to/langchain-agent-inbox-what-it-is-when-to-use-it-and-how-the-workflow-works
[^70]: FRE|Nxt Labs. "Inbox usage ratio (30/70 chat/inbox)." April 2026. https://www.frenxt.com/cables/claude-code/chase-05-ambient-agents
[^71]: PodcastTranscript. "Ambient agents podcast summary." Accessed May 2026. https://podcasttranscript.ai/library/live-ambient-agents-and-the-new-agent-inbox-ft
[^72]: CallSphere. "Vercel AI SDK 5 agent loop deep dive." 2026. https://callsphere.ai/blog/td30-fw-vercel-ai-sdk-5-agent-loop-mcp-generative-ui-v2.md

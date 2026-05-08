---
title: "The A2A Field Manual"
subtitle: "Agent2Agent v1.0, Linux Foundation Governance, and the Horizontal Layer of the Agent Stack"
publication: "perea.ai Research"
authors: ["Dante Perea"]
version: "1.0"
status: "Public draft"
date: "2026-05"
audience: "Founders and architects building multi-agent systems, integrators evaluating cross-vendor agent collaboration, and operators of enterprise AI platforms deciding where A2A fits relative to MCP."
length: "~3,200 words"
license: "CC BY 4.0"
description: "Reference manual for the Agent2Agent (A2A) protocol — the v1.0 spec ratified March 2026 under Linux Foundation governance. Maps how Agent Cards, JSON-RPC bindings, SSE streaming, and stateful task lifecycles compose with MCP into the canonical multi-agent reference architecture, and what an integration should actually look like in 2026."
profile: "field-manual"
---

# The A2A Field Manual

## What this paper is, in one sentence

Agent2Agent (A2A) is the open protocol that lets AI agents from different vendors discover each other, delegate stateful long-running tasks across organizational boundaries, and stream results back — and v1.0, ratified March 12, 2026 under Linux Foundation governance with a technical steering committee from AWS, Cisco, Google, IBM Research, Microsoft, Salesforce, SAP, and ServiceNow, is now the production-ready horizontal complement to MCP's vertical tool-access layer in the canonical reference architecture for enterprise multi-agent systems.[^1][^2][^3]

## Why A2A exists at all

Anthropic shipped the Model Context Protocol (MCP) in November 2024 as a standard way for an agent to read files, query a database, or call any external API through a single client interface — solving what its designers called the "N×M integration problem."[^4][^5] By March 2026 that single-agent tool-access problem was effectively solved: 97 million monthly SDK downloads and adoption by every major AI provider had made MCP "the USB-C of AI."[^5][^6]

But MCP says nothing about how one agent talks to another agent. Inside a single application — a Claude Code session reading files through MCP, a custom Cursor agent invoking Postgres through MCP — that omission did not matter. Inside an enterprise — where an HR agent built on Salesforce Agentforce needed to coordinate with an IT-procurement agent built on ServiceNow, which needed to invoke a finance-approval agent built on SAP Joule — it became the bottleneck.[^7][^8] The integration cost of point-to-point custom glue between vendor agent frameworks scaled exactly the way MCP had eliminated for tool access: N×M and rising.[^4]

Google's response, announced April 9, 2025 with 50+ launch partners including Atlassian, Box, Cohere, Intuit, LangChain, MongoDB, PayPal, Salesforce, SAP, ServiceNow, UKG, and Workday plus 13 system integrators (Accenture, BCG, Capgemini, Cognizant, Deloitte, HCLTech, Infosys, KPMG, McKinsey, PwC, TCS, Wipro), was the Agent2Agent (A2A) protocol — a single shared language for agent-to-agent communication explicitly positioned as complementary to MCP, not a replacement.[^7][^9] Google donated A2A to the Linux Foundation on June 23, 2025 at the Open Source Summit North America, with AWS and Cisco joining as founding contributors and the protocol now backed by more than 100 supporting organizations.[^10][^11]

The horizontal-versus-vertical framing dominates 2026 commentary because it is operationally correct: MCP is "agent → tool" (vertical integration), A2A is "agent → agent" (horizontal coordination), and the canonical 2026 multi-agent system uses both at non-overlapping layers — A2A for delegation, MCP inside each delegated agent for tool access.[^12][^13][^14][^15]

## What v1.0 actually shipped

A2A v1.0.0 was released March 12, 2026 from the `a2aproject/A2A` repository, where the spec already had over 23,000 GitHub stars at release.[^1][^2] The version represents maturation rather than reinvention — the v0.3 core ideas remain intact, but rough edges were removed and enterprise deployment requirements addressed more directly.[^3][^16]

**Core data model.** A2A defines six top-level concepts in its Layer 1 data model: Task, Message, AgentCard, Part, Artifact, and Extension.[^17][^18] A Task is the fundamental stateful unit of work, with a unique ID and an explicit lifecycle (`submitted → working → input-required → completed | failed | canceled | rejected`).[^19][^20] A Message carries content between client and server. An AgentCard is the JSON metadata document that advertises an agent's identity, endpoint, capabilities, skills, authentication requirements, and supported interfaces. A Part is a typed content unit (text, file, structured JSON) that composes Messages and Artifacts. An Artifact is a tangible deliverable produced by a remote agent, with a unique `artifactId` and one or more Parts that can stream incrementally.[^17][^21]

**Operations.** Layer 2 standardizes six operations: SendMessage, StreamMessage, GetTask, ListTasks, CancelTask, GetAgentCard.[^17][^18] Each operation maps to the protocol bindings in Layer 3.

**Protocol bindings.** v1.0 ships three normative protocol bindings — JSON-RPC 2.0 over HTTPS, gRPC, and HTTP+JSON/REST — with formal equivalence guarantees between them.[^22][^17] The simplest A2A interaction can begin with a single HTTP request, which keeps the barrier to entry low and aligns the protocol with web-scale infrastructure (load balancers, gateways, observability).[^3][^16]

**Discovery.** AgentCards are served at the well-known URI `/.well-known/agent-card.json`, following RFC 8615.[^21][^23] A client agent that knows or discovers a target domain performs an HTTP GET against that path and receives the AgentCard as JSON. Three discovery patterns are recognized: well-known URI (default), curated registry (registries are out of scope of the protocol itself, an active area for community standardization), and direct configuration (for tightly-coupled systems).[^23]

**Streaming and async.** A2A is async-first by design. Three interaction styles are supported: request/response with polling (the client calls `tasks/get` periodically until terminal state); Server-Sent Events streaming (the client calls `SendStreamingMessage` and the server holds an HTTP connection open with `Content-Type: text/event-stream`, pushing `TaskStatusUpdateEvent` and `TaskArtifactUpdateEvent` frames as the task progresses); and push notifications (for very long-running tasks lasting minutes, hours, or days, where the server posts to a client-provided HTTPS webhook on significant updates).[^19][^24] The streaming and pushNotifications capabilities are declared per-agent in the AgentCard's `capabilities` field.[^21]

**v1.0 hard changes from v0.3.** The v1.0 release introduces breaking changes to the interaction protocol — including consolidation of `additionalInterfaces` into a single `supportedInterfaces[]` array where each entry has its own `protocolVersion`, replacement of RFC 9457 problem-details for HTTP errors with `google.rpc.Status` ProtoJSON representation, addition of mandatory `google.rpc.ErrorInfo` with `domain: "a2a-protocol.org"` and UPPER_SNAKE_CASE error reasons, mutual TLS support, modern OAuth 2.0 flows including Device Code (RFC 8628) with deprecated implicit/password flows removed, optional PKCE on Authorization Code flow, JSON Web Signature (RFC 7515) signing of AgentCards using JSON Canonicalization (RFC 8785), cursor-based pagination, simplified UUID-based IDs without compound `tasks/{id}` form, and native multi-tenancy via a `tenant` field in `AgentInterface`.[^16][^17] AgentCards evolved in a backward-compatible direction so that an agent can advertise both v0.3 and v1.0 simultaneously while clients migrate progressively.[^3]

**Authentication.** Auth credentials are passed in HTTP headers, declared in the AgentCard, and never embedded in the A2A protocol payload. The supported security schemes follow the OpenAPI auth structure — Bearer, OAuth 2.0/PKCE, API key, mutual TLS, OpenID Connect.[^17][^21]

## Governance: how A2A became open

A2A is not Google's protocol any more. The donation to the Linux Foundation in June 2025 transferred the spec, SDKs, and developer tooling to an independent foundation governed by an eight-company technical steering committee: AWS, Cisco, Google, IBM Research, Microsoft, Salesforce, SAP, and ServiceNow.[^11][^25] In December 2025 the Linux Foundation launched the Agentic AI Foundation (AAIF) — co-founded by OpenAI, Anthropic, Google, Microsoft, AWS, and Block — as a permanent home for both A2A and MCP, ending the open question of which foundation would steward each.[^15] In August 2025, IBM's Agent Communication Protocol (ACP) was merged into A2A under the LF AI & Data umbrella, ending what could have become a two-protocol fracture in the agent-coordination layer.[^15][^26]

The licensing is Apache 2.0; contributions follow standard Linux Foundation governance.[^2]

## How A2A composes with MCP: the canonical 2026 architecture

The frequently-asked question — "MCP or A2A?" — is the wrong question. Production multi-agent systems in 2026 use both, at different layers of the same stack.[^14][^15][^27] The dimension table that has crystallized across the literature:[^12][^13][^14][^28]

| Dimension              | MCP                                                | A2A                                              |
| ---------------------- | -------------------------------------------------- | ------------------------------------------------ |
| Layer                  | Model ↔ Tool                                       | Agent ↔ Agent                                    |
| Direction              | Vertical (agent reaches down to capability)        | Horizontal (agent reaches across to peer)        |
| Relationship           | Hierarchical (host controls tool)                  | Peer-to-peer (agents as equals)                  |
| State management       | Stateless per call                                 | Stateful task lifecycle                          |
| Task duration          | Short-lived synchronous calls                      | Minutes to days, async                           |
| Discovery              | Application-configured server list                 | AgentCards at `.well-known/agent-card.json`       |
| Transport              | stdio (local), Streamable HTTP (remote)            | JSON-RPC/HTTP, SSE, push notifications           |
| Multi-modal            | Text, binary                                       | Text, audio, video, iframes, forms               |
| Auth                   | Server-defined, scoped resource access             | OAuth 2.0/PKCE, Bearer, API keys, mTLS            |
| Origin                 | Anthropic (Nov 2024)                               | Google (Apr 2025)                                |
| Governance             | Linux Foundation / AAIF                            | Linux Foundation / AAIF                          |
| Adoption (Mar 2026)    | 97M+ monthly SDK downloads                         | 50+ launch partners, 100+ supporting orgs         |

The reference architecture that emerged across LangChain, Salesforce, Google ADK, and the Airbyte/AgentRank/AgentMarketCap analyses is hub-and-spoke or layered orchestrator:[^14][^28][^29][^15]

1. An orchestrator agent receives a high-level user request.
2. It uses A2A to discover and delegate subtasks to specialist agents (research agent, code agent, data agent, vendor agents) — possibly across organizational boundaries.
3. Each specialist agent uses MCP internally to access tools — databases, file systems, web search, vendor APIs.
4. Results flow back as A2A Artifacts; the orchestrator assembles the final response.

The clean separation matters operationally: updating a specialist's MCP tool connections does not affect its A2A interface; switching the orchestrator's A2A client does not break tool integrations. This is the exact pattern Google's Agent Development Kit implements; LangGraph and CrewAI converged on the same layering.[^15][^29]

The one genuine tension worth understanding is the temptation to expose an agent through MCP as if it were a tool. When you do that, the called agent collapses into a function call: no task lifecycle, no negotiation, no async coordination, no human-in-the-loop checkpoint state. An MCP-exposed agent is a tool; an A2A-connected agent is a peer.[^28] For simple delegation this collapse may not matter. For complex multi-agent workflows involving long-running work, approval gates, or error recovery, it eliminates exactly the affordances A2A was designed to preserve.

## Five orchestration patterns that compose on A2A

The patterns below are documented across the A2A community canon (a2a-protocol.org tutorials, the AAIF reference architectures, the launch-partner integration guides):[^17][^21][^29]

**Supervisor.** A central orchestrator decomposes user goals into A2A tasks, delegates each to a specialist agent through `SendMessage` or `SendStreamingMessage`, tracks lifecycle state, and assembles artifacts. This is the most observable pattern — every delegation is visible at the orchestrator — and the most recoverable, because the orchestrator can retry failed agents with the same task definition. Salesforce's Agentforce, Microsoft Copilot Studio, and Google ADK examples all default to supervisor.[^7][^30]

**Pipeline.** A directed acyclic graph of A2A agents, where the artifact of one agent becomes the input to the next. Useful when the workflow has known stages (research → outline → draft → verify) and the per-stage cost of context handoff is low.

**Swarm (federation).** Decentralized peer-to-peer A2A coordination without a central orchestrator. Each agent advertises capabilities through its AgentCard; tasks route by capability matching against the registry. This is the pattern multi-vendor agent marketplaces emerge into. The trade-off is observability: there is no central log of who delegated what to whom, and reconstructing a workflow requires correlation across agents.[^28][^31]

**Router.** A lightweight orchestrator that does only capability-matching: it parses an incoming task, queries AgentCards (or a registry), and forwards the task to the best-matched agent without further coordination. Useful as a thin federation layer in front of vendor-specific agents.

**Hierarchical.** Nested supervisors. A top-level orchestrator delegates to mid-level supervisors, each of which has its own pool of specialist agents. The pattern matches enterprise org charts where, say, an IT-procurement supervisor manages requisition agents, vendor-evaluation agents, and approval agents — each itself an A2A endpoint.[^32]

All five patterns compose on the same v1.0 primitives: AgentCard discovery, Task lifecycle, JSON-RPC transport, optional streaming, optional push. The protocol is intentionally agnostic to which pattern you adopt.

## What integration looks like in practice

A v1.0 A2A server implementation has three required pieces:[^21][^17]

**Serve an AgentCard.** Publish `/.well-known/agent-card.json` with at minimum: `name`, `description`, `version`, `supportedInterfaces[]` (each with `url`, `protocolBinding`, `protocolVersion`), `capabilities` (`streaming`, `pushNotifications`), `defaultInputModes`, `defaultOutputModes`, `skills[]` (each with `id`, `name`, `description`, `tags`, `examples`), and a security scheme declaration. If you want signed AgentCards, also publish a JWS signature over the JCS-canonicalized card.

**Implement the Layer 2 operations** for at least one binding. JSON-RPC 2.0 is the lowest-friction path: a single POST endpoint that handles `message/send`, `message/stream`, `tasks/get`, `tasks/list`, `tasks/cancel`, and `agent/getCard`. The official Python SDK at `a2aproject/A2A` provides reference implementations.[^2][^21]

**Manage Task state.** Persist tasks across requests. Honor lifecycle states. Emit `TaskStatusUpdateEvent` for state transitions and `TaskArtifactUpdateEvent` for new artifacts on the streaming endpoint. For push notification subscribers, POST to the registered webhook on transitions.[^19][^24]

A v1.0 A2A client needs only the inverse: an HTTP client that can fetch AgentCards, marshal JSON-RPC requests, and either poll, subscribe to SSE, or expose a webhook handler.

For most enterprise integrations in 2026, the practical shape is: pick a framework that already implements A2A — LangChain, Google ADK, CrewAI, AutoGen, Microsoft Azure AI Foundry, or the vendor-specific SDK from Salesforce/SAP/ServiceNow — and let it handle the protocol details.[^7][^30][^33] Hand-rolled A2A implementations are appropriate for the orchestrator role or for exposing a custom agent to external partners; for everything else, framework support is now table-stakes.

## What this means for founders building in 2026

A2A's existence rewires three founder decisions.

**The "build or buy your agent platform" question.** When the agent communication layer is a public open standard, the case for building a proprietary multi-agent orchestration framework collapses to almost nothing. The differentiation moves up the stack — to the specialist agents themselves, to the domain knowledge, to the workflow design. Picking an A2A-native framework (Google ADK, LangGraph, CrewAI, AutoGen) is the new default; picking a proprietary multi-agent runtime is now a deliberate decision that requires justification.[^29][^15]

**The "expose your service as an agent" decision.** Every B2B SaaS company in 2026 has an obvious migration path: ship an AgentCard at `/.well-known/agent-card.json`, expose your existing API actions as A2A skills, and become callable by any other agent in the ecosystem. The cost is low; the option value is significant. Salesforce, SAP, ServiceNow, and the launch-partner cohort have already done this — the open question is which mid-market vendors follow.[^7][^9]

**The "agent marketplace" question.** A2A provides the protocol substrate for cross-vendor agent discovery and delegation, but does not provide a registry. The Linux Foundation has flagged registry standardization as an open community-driven thread, and we expect 2026–2027 to produce both vendor-specific registries (Google's, Salesforce's, Anthropic's) and at least one open horizontal registry. Founders building in this space have a real opening: the protocol is settled, the registry is not.[^23][^15]

## What this paper does not cover

This paper does not cover: A2A SDK-by-language implementation details (Python, Java, JavaScript, Go are all in active development under the LF), specific OAuth flow configurations beyond the v1.0 surface, the legal and contractual structure for cross-organizational agent delegation (an emerging governance layer that is not protocol), the AgentCard signing and trust model in detail (a useful subject for a future deep-dive), or pricing and metering mechanics for agent-to-agent calls (treated separately in the Agent Payment Stack paper). It also does not relitigate the MCP vs A2A "war" framing, which the protocol authors and the LF have repeatedly clarified is a false choice.[^14][^15]

## References

[^1]: A2A Protocol v1.0.0 release tag. https://github.com/a2aproject/A2A/tree/v1.0.0 (Mar 12, 2026)
[^2]: A2A Protocol GitHub repository, a2aproject/A2A, Apache 2.0 license. https://github.com/a2aproject/A2A
[^3]: Announcing Version 1.0, A2A Protocol. https://a2aproject.github.io/A2A/dev/announcing-1.0/
[^4]: Anthropic, Introducing the Model Context Protocol. https://www.anthropic.com/news/model-context-protocol (Nov 2024)
[^5]: APIScout, MCP vs A2A: Which Agent Protocol Wins in 2026? https://apiscout.dev/blog/mcp-vs-a2a-agent-protocols-2026 (Mar 2026)
[^6]: Machine Brief, The Protocol Wars: MCP vs A2A vs Responses API. https://www.machinebrief.com/article/protocol-wars-mcp-vs-a2a-vs-responses-api (Feb 2026)
[^7]: Google Developers Blog, Announcing the Agent2Agent Protocol (A2A). https://developers.googleblog.com/en/a2a-a-new-era-of-agent-interoperability/ (Apr 9, 2025)
[^8]: Salesforce, Agent2Agent Protocol: The Standard for AI Agent Interoperability. https://www.salesforce.com/ap/agentforce/ai-agents/agent2agent-protocol/
[^9]: SiliconANGLE, Google announces open protocol so AI agents can talk to each other. https://siliconangle.com/2025/04/09/agent2agent-google-announces-open-protocol-ai-agents-can-talk/ (Apr 9, 2025)
[^10]: Linux Foundation, Linux Foundation Launches the Agent2Agent Protocol Project. https://www.linuxfoundation.org/press/linux-foundation-launches-agent2agent-protocol-project (Jun 23, 2025)
[^11]: Google Developers Blog, Google Cloud donates A2A to Linux Foundation. http://googledevelopers.blogspot.com/google-cloud-donates-a2a-to-linux-foundation/ (Jun 23, 2025)
[^12]: Airbyte, A2A vs MCP: A Comparison Guide to Communication Protocols. https://airbyte.com/agentic-data/a2a-vs-mcp
[^13]: Chaitanya Prabuddha, A2A vs MCP: A Technical Comparison. https://www.chaitanyaprabuddha.com/blog/a2a-vs-mcp-protocol-comparison (Mar 2026)
[^14]: ChatForest, MCP vs A2A: Understanding the Two Protocols Shaping AI Agent Infrastructure. https://chatforest.com/guides/mcp-vs-a2a-protocol-comparison/ (Mar 2026)
[^15]: AgentMarketCap, A2A vs MCP: The Two-Protocol Stack Defining Agentic AI in 2026. https://agentmarketcap.ai/blog/2026/04/11/a2a-vs-mcp-agent-protocol-war-2026 (Apr 2026)
[^16]: A2A Protocol, What's New in v1.0. https://a2a-protocol.org/latest/whats-new-v1/
[^17]: A2A Protocol, Specification Overview. https://a2a-protocol.org/latest/specification (v1.0)
[^18]: A2A Protocol, Protocol Definition. https://a2a-protocol.org/latest/definitions/
[^19]: A2A Protocol, Streaming & Asynchronous Operations. https://a2a-protocol.org/latest/topics/streaming-and-async/
[^20]: A2A Protocol, Key Concepts (v0.2.3). https://a2a-protocol.org/v0.2.3/topics/key-concepts/
[^21]: A2A Protocol, Agent Skills & Agent Card tutorial. https://a2a-protocol.org/latest/tutorials/python/3-agent-skills-and-card/
[^22]: A2A Protocol, JSON Schema and protocol buffer definitions. https://a2a-protocol.org/latest/definitions/
[^23]: A2A Protocol, Agent Discovery (v0.2.5). https://a2a-protocol.org/v0.2.5/topics/agent-discovery/
[^24]: Agent2Agent Protocol Community, Key Concepts and Components. https://agent2agent.info/docs/topics/key-concepts/
[^25]: A2A docs, announcing-1.0.md (TSC composition). https://github.com/a2aproject/A2A/blob/main/docs/announcing-1.0.md
[^26]: APIScout, IBM ACP merged into A2A — August 2025. https://apiscout.dev/blog/mcp-vs-a2a-agent-protocols-2026
[^27]: AI Agent & Copilot, Google Advances A2A Protocol, Gains Microsoft and SAP Backing. https://agentandcopilot.com/cloud/google-advances-agent2agent-a2a-protocol-gains-microsoft-and-sap-backing/ (May 2025)
[^28]: AgentRank, A2A vs MCP: The Definitive Agent Protocol Comparison (2026). https://agentrank-ai.com/blog/a2a-vs-mcp-agent-protocol-comparison/ (Mar 2026)
[^29]: HackerNoon, MCP vs A2A — A Complete Deep Dive. https://hackernoon.com/lite/mcp-vs-a2a-a-complete-deep-dive (Aug 2025)
[^30]: Microsoft, Azure AI Foundry support for A2A and Copilot Studio invocation of A2A agents. https://news.microsoft.com/source/features/ai/azure-ai-foundry-a2a/ (May 2025)
[^31]: Salesforce, Agentforce A2A interoperability. https://www.salesforce.com/news/stories/agentforce-a2a-interoperability/
[^32]: ServiceNow, AI Agent Control Tower and the A2A protocol. https://www.servicenow.com/community/now-platform-articles/ai-agent-control-tower-and-the-a2a-protocol/
[^33]: SAP, Joule and the Agent2Agent protocol. https://news.sap.com/2025/04/joule-agent2agent-protocol/
[^34]: A2A Protocol, AgentCard JSON schema (well-known agent-card.json). https://a2a-protocol.org/latest/definitions/
[^35]: A2A Protocol, Specification (v0.2.5). https://a2a-protocol.org/v0.2.5/specification
[^36]: A2A Protocol, AgentCard concept page (Chinese mirror). https://a2acn.com/en/docs/concepts/agentcard/
[^37]: IBM, What is A2A protocol (Agent2Agent)? https://www.ibm.com/think/topics/agent2agent-protocol
[^38]: Linux Foundation, A2A project page. https://lfaidata.foundation/projects/a2a/
[^39]: AWS, AWS as founding contributor to the LF Agent2Agent project. https://aws.amazon.com/blogs/machine-learning/aws-a2a-linux-foundation/ (Jun 2025)
[^40]: Cisco, Cisco joins the Agent2Agent project. https://blogs.cisco.com/news/cisco-joins-a2a-project (Jun 2025)
[^41]: IBM, IBM Research and the A2A Technical Steering Committee. https://research.ibm.com/blog/ibm-a2a-tsc (Jun 2025)
[^42]: Google Cloud, Agent Development Kit (ADK) and A2A. https://cloud.google.com/agent-development-kit
[^43]: LangChain, A2A integration in LangChain. https://blog.langchain.dev/a2a-integration/
[^44]: MongoDB, MongoDB and the A2A protocol. https://www.mongodb.com/blog/post/mongodb-agent2agent-protocol
[^45]: Workday, Workday joins A2A launch partners. https://blog.workday.com/en-us/2025/workday-a2a-launch.html (Apr 2025)
[^46]: Atlassian, Atlassian and the Agent2Agent protocol. https://www.atlassian.com/blog/a2a-protocol
[^47]: Salesforce, Architectural overview of A2A on Agentforce. https://www.salesforce.com/news/stories/agentforce-a2a-architecture/
[^48]: A2A Protocol, JSON Web Signature for Agent Cards (RFC 7515 / RFC 8785). https://a2a-protocol.org/latest/whats-new-v1/
[^49]: ZDNet, Linux Foundation takes ownership of A2A. https://www.zdnet.com/article/linux-foundation-a2a (Jun 2025)
[^50]: TechCrunch, Google donates Agent2Agent protocol to Linux Foundation. https://techcrunch.com/2025/06/23/google-a2a-linux-foundation/
[^51]: VentureBeat, A2A v1.0 marks production readiness for cross-vendor agents. https://venturebeat.com/a2a-v1-production/ (Mar 2026)
[^52]: The Register, Agent2Agent v1.0 ships, eight-company TSC formed. https://www.theregister.com/2026/03/13/a2a_v1/
[^53]: InfoWorld, Multi-agent orchestration patterns on A2A. https://www.infoworld.com/article/a2a-orchestration-patterns/
[^54]: The New Stack, AAIF launch and the dual stewardship of MCP and A2A. https://thenewstack.io/aaif-mcp-a2a-launch (Dec 2025)
[^55]: AgentRank, GitHub repository indexing for A2A and MCP — March 2026. https://agentrank-ai.com/blog/a2a-vs-mcp-agent-protocol-comparison/
[^56]: HackerNoon, A2A decentralized peer-to-peer architecture analysis. https://hackernoon.com/lite/mcp-vs-a2a-a-complete-deep-dive
[^57]: Machine Brief, A2A enterprise orchestration use cases — eight-company TSC analysis. https://www.machinebrief.com/article/protocol-wars-mcp-vs-a2a-vs-responses-api
[^58]: AgentMarketCap, hub-and-spoke vs swarm patterns on A2A. https://agentmarketcap.ai/blog/2026/04/11/a2a-vs-mcp-agent-protocol-war-2026
[^59]: ChatForest, evaluation rubric for adopting A2A on top of MCP. https://chatforest.com/guides/mcp-vs-a2a-protocol-comparison/
[^60]: Airbyte, layered architecture pattern: MCP for tool access, A2A for delegation. https://airbyte.com/agentic-data/a2a-vs-mcp

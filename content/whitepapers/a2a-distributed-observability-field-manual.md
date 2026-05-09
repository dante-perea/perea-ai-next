---
title: "Distributed Agent Observability for A2A: The Field Manual"
subtitle: "OpenTelemetry across agent boundaries, end-to-end latency attribution, and the platform-vs-protocol layer split that production teams actually ship"
publication: "perea.ai Research"
authors: ["Dante Perea"]
version: "1.0"
status: "Public draft"
date: "2026-05"
audience: "Engineering leaders, platform architects, and observability practitioners shipping multi-agent A2A systems on OpenTelemetry"
length: "~7,200 words"
profile: "technical-playbook"
license: "CC BY 4.0"
description: "How to instrument distributed agent systems on the A2A protocol with OpenTelemetry GenAI semantic conventions: the agent-spans spec, W3C trace context propagation across agent boundaries, the JSONL-vs-SIEM storage rule, and how the platform layer (ServiceNow AI Control Tower, Salesforce Agent Fabric, Datadog LLM Observability) composes with the protocol layer (OTel + Phoenix/Langfuse + Cloudflare AI Gateway) in production."
---

## Foreword

The agent observability category consolidated faster than any infrastructure category in recent memory. On December 11, 2025, ServiceNow shipped AI Gateway as a governance-and-observability layer atop AI Control Tower.[^8] On December 1, 2025, Datadog announced native OpenTelemetry GenAI Semantic Conventions support in LLM Observability.[^26] On January 11, 2026, Google announced Universal Commerce Protocol at NRF 2026 alongside the broader push into agent-native infrastructure. On April 16, 2026, Cloudflare repositioned AI Gateway as a unified inference layer for 700+ models.[^42] On May 5, 2026, ServiceNow expanded AI Control Tower at Knowledge 2026 with the recently completed Traceloop acquisition for runtime AI observability.[^13] On May 7, 2026, Salesforce shipped Agent Platform Tracing — capturing every Agentforce action execution as an OpenTelemetry trace tree stored in Data 360.[^14]

Five months. Six platform launches. One emerging consensus: agents are observable through OpenTelemetry GenAI Semantic Conventions, with W3C TraceContext propagation across agent boundaries and OTLP-based export to a backend of choice. The Linux Foundation's A2A protocol — at v1.0.0 since March 12, 2026 — is explicit about the foundation it reuses (HTTP, JSON-RPC 2.0, Server-Sent Events) and explicit about the gap it leaves to implementers: there is no observability spec inside A2A itself.[^35]

The thesis of this paper is that distributed agent observability is now a layered architecture with a clean platform-vs-protocol split. The protocol layer is OpenTelemetry GenAI Semantic Conventions plus W3C TraceContext for cross-boundary propagation, with backend choices spanning Datadog LLM Observability, Arize Phoenix, Langfuse, Helicone, and others. The platform layer is ServiceNow AI Control Tower or Salesforce Agent Fabric — providing cross-platform inventory, governance, and roll-up reporting on top of whatever protocol layer the deployment chooses. AI Gateways (Cloudflare, Portkey, Kong, LiteLLM) sit between agent and model and emit their own observability stream, often consumed by both layers above. This paper is the field manual for shipping all three layers without rebuilding when any single component evolves.

## Part I — The Observability Gap A2A v1.0 Names

### §I.1 — What A2A v1.0 leaves to implementers

A2A's design principles are explicit: simple (reuse HTTP, JSON-RPC 2.0, Server-Sent Events), enterprise-ready (authentication, authorization, security, privacy, tracing, monitoring aligned with established practices), async-first (built for long-running tasks and human-in-the-loop), agnostic (support diverse modalities), and opaque execution (agents interact based on declared capabilities without needing internal access).[^31] The official Linux Foundation v0.3.0 specification documents the AgentCard structure, the Operations layer (SendMessage, SendStreamingMessage, GetTask, ListTasks, CancelTask, GetAgentCard), and the Protocol Bindings (JSON-RPC, gRPC, HTTP/REST).[^30] What it does not document — by design — is how agents should be observed. The "tracing, monitoring aligned with established enterprise practices" line in the design principles is the protocol's invitation to implementers: bring your own observability layer.

That invitation closes a gap rather than opening one. The Agent2Agent main repository — at 23,557 GitHub stars and 140 contributors — explicitly names "tracing reliability and push notification mechanisms" as future-roadmap work.[^35] The streaming-and-async topic page documents Server-Sent Events and push notifications as transport patterns for long-running tasks, but defers semantic-attribute conventions to companion specs.[^33] The Extensions framework gives implementers a clean way to layer observability semantics: an extension URI like `https://opentelemetry.io/otel/genai/v1` would let an A2A agent declare OTel GenAI compliance via the AgentCard's capabilities.extensions block.[^32] As of May 2026, no such formal observability extension has been published — but the protocol structure for one is in place.

### §I.2 — Why classical APM fails on agents

The wall every team building LLM applications hits is the gap between deterministic-code observability and semantic observability. The April 19, 2026 Awesome Agents survey states it bluntly: "Classical APM tools — Datadog, New Relic, Prometheus — were built for deterministic code. They capture latency and error rates just fine. What they don't capture is the semantic layer: which prompt fired, what the retrieval step returned, why the model chose that tool call, and whether the output quality has degraded from last Tuesday."[^37] The Cloud Security Alliance's April 3, 2026 governance-gap research note runs the same diagnosis from a different angle: "AI RMF 1.0 was designed for systems whose behavior can, in principle, be characterized at deployment time… autonomous tool-calling agents routinely violate these conditions by operating at machine speed."[^47]

The semantic layer exposes failure modes classical APM can't reach. Stuck tool loops where an agent calls the same tool repeatedly with slight variations until the context window fills up. Runaway token costs where a single user query triggers a multi-agent fanout that collectively burns 100K tokens. Context-propagation failures in multi-agent pipelines where the orchestrator's intent never reaches the worker. Quality drift where an agent's outputs degrade silently over weeks because the upstream retrieval index changed shape. None of these surface in latency-and-error-rate dashboards alone. The Zylos Research February 28 2026 technical guide makes the architectural recommendation directly: "OpenTelemetry handles distributed-trace correlation via the W3C TraceContext header. With this propagation in place, a Jaeger/Tempo trace view shows the entire work item — from the orchestrator agent through the worker agents and back — as a single connected graph, even if those agents run in different processes or on different hosts."[^38]

### §I.3 — The data points

The category metrics tell a sharp story. As of March 2026, the average Fortune 500 enterprise runs 45+ AI agents across 4+ platforms with zero cross-platform visibility.[^17] Only 47.1% of enterprise AI agents are monitored by any governance system.[^17] The average cost of an AI-related breach is $4.63 million.[^17] Shadow AI incidents per enterprise per month doubled year-over-year to 223.[^17] Forty-five-point-six percent of enterprises use shared API keys for agents — meaning more than half of agent-fleet identity is structurally untraceable.[^17]

The countervailing data point from the same source: organizations with governance frameworks deploy 12x more AI agents to production.[^17] This is the inversion of the usual governance-as-tax framing. Observability is a multiplier, not a brake. Teams that invest in instrumentation early ship more agents, faster, with better attribution. Gartner's projection from the AppXLab April 10 2026 piece is consistent: LLM observability investments will cover 50%[^20] of GenAI deployments by 2028, up from just 15%[^20] currently — meaning teams building this layer now are building toward the converged-state.

### §I.4 — The funding category

Capital has confirmed the category. iEnable's March 25 2026 industry analysis documented over $275 million[^17] flowing into AI agent governance funding in a single week of March 2026, every dollar funded into single-platform solutions: ServiceNow, Microsoft, UiPath, and Salesforce each built control planes that stop at their own walls. Braintrust raised $80M[^37] in February 2026, anchoring the evaluation-platform category. Datadog's June 10, 2025 DASH announcement made AI Agent Monitoring GA.[^27] By May 2026, ServiceNow had completed the Traceloop acquisition to bring runtime AI observability into AI Control Tower as a first-class capability.[^13]

The market structure that emerged is bimodal: incumbent APM vendors (Datadog, New Relic, Honeycomb) extending into LLM observability, and dedicated platforms (Phoenix, Langfuse, LangSmith, Helicone, Braintrust) providing depth on the AI-specific layer.[^39] Most production teams pick a primary observability platform and pair it with the broader infrastructure-observability layer for whole-stack coverage.[^39] The pair pattern — LLM-native plus whole-stack APM — is the architectural default in mid-2026 production deployments.[^39]

> ### Quotable Findings I
> - **A2A v1.0** explicitly leaves observability to implementers: the Linux Foundation spec lists "tracing, monitoring aligned with established enterprise practices" as the design principle and defers semantic-attribute conventions to companion specs.[^31][^35]
>
> - **As of March 2026**, the average Fortune 500 runs **45+ AI agents across 4+ platforms** with zero cross-platform visibility; only **47.1%** of enterprise AI agents are monitored by any governance system.[^17]
>
> - The countervailing signal: organizations with governance frameworks deploy **12x more AI agents to production** — observability is a multiplier, not a brake.[^17]
>
> - **Gartner projects LLM observability investments will cover 50% of GenAI deployments by 2028**, up from 15% — teams building this layer now are building toward the converged state.[^20]
>
> - **$275M+[^17] flowed into AI agent governance funding in a single week** of March 2026; **Braintrust raised $80M[^37] February 2026**; **ServiceNow completed Traceloop acquisition** May 2026[^13] — the category is funded.

## Part II — The OpenTelemetry GenAI Semantic Conventions

### §II.1 — The GenAI SIG and what it covers

The OpenTelemetry GenAI Special Interest Group, chartered in April 2024, is the standards-track body that has produced the canonical semantic conventions for AI workloads.[^7] As of v1.36.0 (the version shipped before Datadog's December 2025 v1.37 native-support announcement), the conventions cover five primary surface areas: Events (for inputs/outputs), Exceptions, Metrics, Model spans, and Agent spans.[^2] Tech-specific conventions exist for Anthropic, Azure AI Inference, AWS Bedrock, and OpenAI as separate but compatible profiles.[^2] Model Context Protocol (MCP) has its own semantic-conventions profile reflecting its place in the agent stack.[^2]

The transition plan is concrete: instrumentations using v1.36.0 or prior should not change emission defaults; teams adopting v1.37+ opt in via the `OTEL_SEMCONV_STABILITY_OPT_IN=gen_ai_latest_experimental` environment variable.[^3] This dual-emission pattern is what allowed Datadog's December 2025 native-OTel announcement to compose cleanly with existing instrumentations: a single application can emit v1.36.0 spans by default while the OTLP collector pipeline applies v1.37+ schema mapping for the LLM Observability backend.[^26]

### §II.2 — Agent span types

The canonical agent-span specification documents three primary span types.[^1] **`create_agent`** is emitted when an agent is constructed; span name is `create_agent {gen_ai.agent.name}`. **`invoke_agent`** is emitted when an agent is called; span kind is CLIENT for cross-process invocations and INTERNAL for same-process calls. Span name is `invoke_agent {gen_ai.agent.name}` when the name is known, or just `invoke_agent` otherwise. **`invoke_workflow`** is emitted when a span groups multiple agent invocations into a higher-level workflow; span kind is INTERNAL.[^1]

The span kind distinction matters operationally. `CLIENT` spans signal that an agent invocation crosses a process or network boundary — the orchestrator agent calling a worker agent over HTTP, for instance. `INTERNAL` spans signal in-process work — a planner agent invoking a sub-agent within the same Python or Node.js process. Distributed-tracing tools like Jaeger, Tempo, Phoenix, and Datadog use this kind to render trace trees correctly: CLIENT spans become the canonical points where one trace handoffs to another via `traceparent` propagation, while INTERNAL spans nest within their parent without crossing any wire.[^38]

### §II.3 — The attribute taxonomy

The attribute registry documents the canonical `gen_ai.*` namespace.[^6] **`gen_ai.operation.name`** identifies the operation being performed; well-known values include `chat`, `generate_content`, `text_completion`, `embeddings`, `retrieval`, `execute_tool`, `invoke_agent`, `invoke_workflow`, `create_agent`. **`gen_ai.provider.name`** identifies the provider (`openai`, `gcp.gen_ai`, `gcp.vertex_ai`, `aws.bedrock`, `anthropic`, `azure.ai_inference`); it acts as a discriminator for provider-specific attributes (Bedrock spans should carry `aws.bedrock.*` and not `openai.*`).[^6] **`gen_ai.tool.definitions`** carries the list of tool definitions available to the agent. **`gen_ai.input.messages`** and **`gen_ai.output.messages`** carry the conversation content (opt-in capture only).[^3] **`gen_ai.system_instructions`** carries the system message separately from chat history.[^6] **`gen_ai.data_source.id`** identifies the grounding-data source (vector DB, document collection, etc.).[^6]

The capture-instructions discipline is sharp. Per the canonical spec, "OpenTelemetry instrumentations SHOULD NOT capture inputs or outputs by default, but SHOULD provide an option for users to opt in."[^3] Three modes are explicitly named: (1) default — don't record; (2) record on the GenAI spans using the corresponding attributes; (3) store content externally and record references on the spans.[^3] The third mode is the production-default for any system handling sensitive data. References point to a content-addressed external store (S3, blob, content-addressed Merkle DAG) keyed by hash; the span carries only the hash. This is the same architectural pattern the Policy Decision Record paper (#10 in this canon) recommends for evidence pointers.

### §II.4 — Agent attribution: the gen_ai.agent.name proposal

Multi-agent orchestrated applications emit many inference, embeddings, retrieval, and execute_tool spans that share the same `gen_ai.request.model` or `gen_ai.tool.name`. Those attributes alone do not identify which logical agent (planner vs retriever vs specialist) initiated the operation — making per-agent latency, cost, and error attribution structurally hard.[^4]

GitHub Issue #3602 — opened April 7, 2026 — proposes the explicit fix: standardize **`gen_ai.agent.name`** as a low-cardinality, logical-agent label on inference / embeddings / retrieval / execute_tool client spans whenever the operation is performed on behalf of a named agent.[^4] The proposed implementation rules: same name as the corresponding `invoke_agent` span when one exists; low-cardinality (product/agent role, not per-run identifier); Recommended (not Required) when instrumentation knows the agent name. Population strategies under discussion include framework-provided context (LangGraph's `run_id`/`parent_id`), W3C Baggage propagation across process boundaries, ContextVar stack-based tracking, and context-scoped attributes via spec PR #4931.[^4] Production benefit: agent-attributed token usage, agent-attributed latency SLOs, and agent-attributed error breakdowns become first-class queryable dimensions instead of derived projections.

### §II.5 — Beyond the agent-span spec: the traceloop RFC #3460

The traceloop/openllmetry RFC #3460 — opened November 23, 2025 — extends the GenAI agent semantics with an opinionated taxonomy of 20 primary span types organized into 8 categories.[^5] **Lifecycle (4)**: session, agent.create, agent.invoke, agent.terminate. **Orchestration (6)**: team.create, team.execute, team.coordinate, workflow.execute, workflow.transition, workflow.branch. **Task Execution (4)**: task.create, task.execute, task.delegate, agent.handoff. **Memory (5)**: memory.store, memory.retrieve, memory.search, memory.update, memory.delete. **Tools & Integration (3)**: tool.execute, mcp.connect, mcp.execute. **Context & State (2)**: context.checkpoint, context.compress. **Quality & Control (3)**: guardrail.check, eval.execute, human.review.[^5]

The frameworks the RFC explicitly targets — LangGraph, CrewAI, Autogen, Google ADK, LlamaIndex, OpenAI Agents SDK, Agno, MastraAI, Smolagents, Haystack, AWS Bedrock AgentCore — define the production frame.[^5] The new attribute namespaces it introduces (`gen_ai.team.*`, `gen_ai.task.*`, `gen_ai.memory.*`, `gen_ai.workflow.*`, `gen_ai.session.*`) compose with the existing `gen_ai.*` registry rather than replacing it.[^5] The RFC has not yet been formally adopted into the canonical OTel semconv, but it represents the strongest community-driven proposal for filling the space between the canonical-but-narrow agent-span spec and the production reality of multi-agent orchestration. Implementers shipping today are emitting some subset of these conventions and converting them in OTel Collector pipelines as the canonical spec catches up.

> ### Quotable Findings II
> - The **OpenTelemetry GenAI SIG** (chartered April 2024) is the standards-track body covering Events, Exceptions, Metrics, Model spans, Agent spans, plus tech-specific profiles for Anthropic, Azure AI Inference, AWS Bedrock, OpenAI, and MCP.[^7]
>
> - **Three primary agent span types**: `create_agent`, `invoke_agent` (CLIENT cross-process / INTERNAL same-process), `invoke_workflow`. Span kind is the canonical signal for distributed-trace handoff points.[^1]
>
> - **`gen_ai.operation.name`** is the operation discriminator (chat / generate_content / embeddings / retrieval / execute_tool / invoke_agent); **`gen_ai.provider.name`** identifies the provider and gates provider-specific attributes (Bedrock → `aws.bedrock.*`).[^6]
>
> - **Capture-instructions discipline**: by default, don't record inputs/outputs; opt-in modes are record-on-spans or record-references-to-external-store. The third mode is the production default for sensitive data.[^3]
>
> - **GitHub Issue #3602 (April 7, 2026)** proposes standardizing `gen_ai.agent.name` on child spans to make multi-agent attribution a first-class queryable dimension instead of a derived projection.[^4]
>
> - **traceloop RFC #3460 (Nov 23, 2025)** extends the agent-span spec with **20 primary span types across 8 categories**, targeting LangGraph, CrewAI, Autogen, Google ADK, LlamaIndex, OpenAI Agents SDK, AWS Bedrock AgentCore.[^5]

## Part III — Cross-Boundary Distributed Tracing

### §III.1 — W3C TraceContext: traceparent and tracestate

The propagation primitive that ties cross-process agent calls into a single distributed trace is W3C TraceContext — the same standard that powers every modern distributed-tracing system. Two HTTP headers do the work: `traceparent` carries the trace-ID, parent-span-ID, and sampling decision; `tracestate` carries vendor-specific metadata.[^38] When an orchestrator agent calls a worker agent over HTTP, the orchestrator's instrumentation injects `traceparent` into the outgoing HTTP headers; the worker's instrumentation extracts the headers, reconstructs the trace context, and emits its own spans as children of the orchestrator span.[^38] The result: a Jaeger/Tempo/Phoenix/Datadog trace view shows the entire work item — orchestrator → worker → tool calls → response — as a single connected graph, even when those agents run in different processes or on different hosts.[^38]

For HTTP-based inter-agent calls, OpenTelemetry SDKs propagate `traceparent` automatically through standard middleware. For queue-based or other non-HTTP transports, the SDK does not propagate context automatically; implementers must serialize the trace context into the message envelope.[^38] In an A2A deployment using gRPC for transport, the gRPC instrumentation handles propagation natively. In one using HTTP/REST or JSON-RPC over HTTP, the OTel HTTP instrumentation handles it. In one using a bring-your-own-transport (custom WebSocket protocol, message broker, etc.), implementers serialize `traceparent` into the message and parse it on the receiving side. The Cloudflare AI Gateway streaming-resilience pattern — where a disconnected agent reconnects and resumes mid-inference — surfaces the trace-context propagation requirement clearly: the resumed connection must carry the original `traceparent` for the downstream model call to land in the right trace.[^42][^47]

### §III.2 — Tail-based sampling for high-cardinality traces

Production agent deployments emit high-cardinality traces: a single user request can produce dozens to hundreds of spans across the orchestrator, workers, tool calls, retrievals, and downstream model calls. Storing every span at scale is expensive; storing none defeats the purpose. The architectural answer is tail-based sampling: collect every span for a given trace, then make the keep/drop decision after the trace completes based on signal (errors, latency outliers, specific attributes).[^38] OpenTelemetry Collector ships a `tail_sampling_processor` that implements this pattern; downstream backends (Phoenix, Datadog, Honeycomb, Tempo) consume the sampled subset.[^38]

Tail-based sampling is the practical compromise between full-fidelity tracing and cost-controlled storage. The Datadog OTel-native announcement explicitly references the Collector-side sampling policy: "OpenTelemetry Collector applies processors for redaction, sampling, enrichment, and routing so your data policies are enforced before telemetry data leaves your network."[^26] The same pattern applies for sensitive-data redaction (the same processor pipeline that decides what to sample also decides what to redact before export). For agent deployments specifically, useful sampling rules include: keep all traces with `gen_ai.error.type` set; keep all traces with latency > P99 across the agent fleet; keep a 1% statistical sample of successful traces; drop the rest.[^38]

### §III.3 — Capturing inputs and outputs: opt-in modes

The default OTel discipline — don't capture prompts, completions, or tool-call payloads on spans — is the right default for compliance reasons. Production agent deployments handling PII, PHI, financial data, or trade secrets cannot afford to scatter raw model inputs across every observability backend the spans get exported to. The OpenTelemetry capture-content discipline names the three modes explicitly: don't record / record on the span / store externally and reference.[^3]

The third mode — store-externally-and-reference — is the production-default architecture. The pattern: at the moment of capture, the agent computes a content-addressed hash of the prompt + completion + tool-call payload; emits the hash on the span as `gen_ai.input.messages.ref` / `gen_ai.output.messages.ref`; writes the actual content to a content-addressed store (S3 with object-lock, Merkle DAG, or a SIEM-grade JSONL system-of-record).[^55][^3] For debugging, an engineer authorized to view content dereferences from the span back to the store. For compliance audits, the AgDR-style cryptographic chain documented in paper #10 binds the hash to a tamper-evident envelope — the same architectural pattern.

### §III.4 — Phoenix: translating across semantic-convention dialects

Production deployments rarely have the luxury of single-source instrumentation. A typical agent stack mixes auto-instrumented LLM client libraries (OpenLLMetry, OpenLIT), framework-provided instrumentation (LangGraph, CrewAI), and custom instrumentation for orchestration logic. Each emits spans in its native semantic-convention dialect. Phoenix solves the dialect-mismatch problem with explicit translation layers documented at `arize.com/docs/phoenix/tracing/concepts-tracing/translating-conventions`.[^34]

The pattern is OpenTelemetry SpanProcessor-based: an `OpenInferenceSpanProcessor` from `openinference-instrumentation-openlit` converts OpenLIT-emitted spans to OpenInference format inline; `openinference-instrumentation-openllmetry` does the same for OpenLLMetry; `@arizeai/openinference-genai` (TypeScript) does the same for OpenTelemetry GenAI conventions.[^34][^32][^33] The processor sits between the SDK and the OTLP exporter; spans pass through it, get translated, and arrive at the Phoenix collector in the canonical OpenInference dialect — viewable consistently in the Phoenix UI regardless of which framework or library originally emitted them.[^34] The same span-processor pattern composes with non-Phoenix backends: a deployment exporting to Datadog can apply the same translation step before sending to Datadog's OTLP intake.[^26]

### §III.5 — Operational pattern: the OTel Collector as governance edge

The production-recommended deployment pattern is to terminate every observability stream at an OTel Collector that the deployment operates, then route from there to the backends of choice. The Datadog native-OTel announcement states the rule cleanly: "Collector-side processors apply redaction, sampling, enrichment, and routing so your data policies are enforced before telemetry data leaves your network."[^26] The same architecture lets a deployment use multiple backends in parallel without duplicating instrumentation: the Collector exports to Datadog for APM correlation, to Phoenix for AI-specific debugging, to ServiceNow AI Control Tower for governance, and to a long-term storage (S3 + Athena, ClickHouse) for compliance archival.[^41]

The OTel Collector also handles the cardinality-explosion risk that high-volume agent traces create. Collector-side aggregation can roll up high-cardinality attributes (per-user IDs, per-session IDs) into low-cardinality breakdowns (per-tier, per-region) before export. This is necessary because most observability backends bill on metric-cardinality and span-count; a deployment that doesn't shape its data at the Collector edge can rack up multi-million-dollar observability bills before the first quarterly review.[^39]

> ### Quotable Findings III
> - **W3C TraceContext** (`traceparent` + `tracestate` HTTP headers) is the canonical primitive for cross-boundary distributed tracing. OpenTelemetry SDKs propagate automatically over HTTP; implementers serialize manually for queue-based transports.[^38]
>
> - **Tail-based sampling** is the practical compromise between full-fidelity tracing and cost-controlled storage. The OTel Collector `tail_sampling_processor` is the canonical implementation.[^38][^26]
>
> - **Capture-content discipline**: default = don't record; production-default = **store externally and reference**, with content-addressed hashes on spans and actual content in S3/Merkle/JSONL store.[^3]
>
> - **Phoenix translates semantic-convention dialects** via `OpenInferenceSpanProcessor`: OpenLIT → OpenInference, OpenLLMetry → OpenInference, OTel GenAI → OpenInference. Same pattern composes with non-Phoenix backends.[^34]
>
> - **The OTel Collector** is the production governance edge: redaction, sampling, enrichment, and routing applied before telemetry leaves the network. Single Collector → multiple backends (Datadog, Phoenix, ServiceNow, archival) without duplicate instrumentation.[^26][^41]

## Part IV — The Platform Layer

### §IV.1 — ServiceNow AI Control Tower + AI Gateway

ServiceNow's AI Control Tower is the canonical example of the platform-layer pattern: cross-platform inventory, governance, and roll-up reporting on top of whatever protocol-layer instrumentation each individual agent brings. AI Control Tower defines five capabilities: **Discover** (find AI assets across the enterprise, including systems beyond ServiceNow); **Observe** (continuous monitoring with live metrics and alerts); **Govern** (AI-driven risk assessments aligned with NIST AI RMF and EU AI Act); **Secure** (map and analyze who has access to what across humans and AI agents); **Measure** (track AI usage at token and workflow level, link to business outcomes).[^12][^18] The May 5 2026 Knowledge 2026 announcement expanded coverage with 30 new enterprise integrations spanning AWS, Google Cloud, Microsoft Azure, SAP, Oracle, and Workday — pulling AI agents from those systems into the same governance model as ServiceNow-native agents.[^13]

AI Gateway sits inside AI Control Tower as the runtime control point for MCP-based agent connections. Every MCP server gets a centralized registry entry; every agent connects through a Gateway URL rather than directly to the server; OAuth 2.1 is enforced on every connection.[^9][^11] The March 2026 release added CIMD (Client Identity Metadata Document) for automated client registration across 10+ platforms (Microsoft Copilot Studio, AWS Bedrock, Google Vertex AI), and PII Vault Service integration for sensitive-data filtering at the gateway layer.[^9] Per-server KPIs include total requests, success rates, and latency at P50/P90/P95 — exactly the golden-signal triad for the observability layer.[^9] The Traceloop acquisition (announced at K2026 May 5 2026) brings runtime AI observability into AI Control Tower as a first-party capability rather than an integration layer.[^13]

### §IV.2 — Salesforce Agent Platform Tracing → Data 360

Salesforce shipped Agent Platform Tracing on May 7, 2026 — the cleanest single-vendor implementation of the OpenTelemetry-into-platform pattern.[^14] The architecture: every Agentforce action execution emits an OpenTelemetry trace tree. The trace tree gets stored in Data 360, Salesforce's data lake. Two Data Model Objects (DMOs) hold the structure: `ssot__TelemetryTrace__c` (the trace metadata) and `ssot__TelemetryTraceSpan__dlm` (individual spans). The span DMO is self-referential by design: `ssot__TelemetryParentSpanId__c` maps back to `ssot__Id__c`, enabling tree traversal from any node.[^14]

The integration with Agentforce Session Tracing — the planner-level conversation flow — is the load-bearing architectural choice. Both DMOs share the same underlying Trace ID via `ssot__TelemetryTraceId__c`. Joining `ssot__AiAgentInteraction__dlm` (Session Tracing) with `ssot__TelemetryTraceSpan__dlm` (Platform Tracing) produces a complete trace tree from user utterance through planner decision through back-end execution and back.[^14] The data lives in Data 360 alongside the rest of the org's data, queryable with standard Salesforce tooling. The Salesforce Developers blog post explicitly demonstrates this with a Slackbot integration that joins Session Tracing + Platform Tracing data to debug a single agent failure in minutes.[^14] The Agentforce Observability product page documents the higher-level UI: session-level tracing, intent + sentiment tags, session clustering, quality scores, per-agent deep dives.[^15]

### §IV.3 — Salesforce Agent Fabric: cross-platform agent control plane

Agent Fabric is Salesforce's answer to the cross-platform agent-management problem — the same gap iEnable's March 2026 analysis identifies as "the control tower nobody built."[^17] The April 22 2026 expansion added a new centralized control plane allowing enterprises to discover, govern, and orchestrate AI agents from any vendor in one place.[^16] The expansion features: automatic agent discovery; Visual Authoring Canvas for cross-vendor agent composition; rules-based guardrails for autonomous agents; Trusted Agent Identity for cross-platform attribution.[^16] Diabsolut, a Salesforce implementation partner, was already running the platform across a network of agents at the time of the announcement.[^16]

### §IV.4 — Control tower vs control plane: the architectural distinction

The iEnable framing draws the architectural line cleanly: every major platform vendor built a control plane (governs the agents inside its own platform); the control tower (governs every agent regardless of vendor) is the layer above.[^17] ServiceNow positions AI Control Tower as the tower; Salesforce positions Agent Fabric as the same; UiPath Maestro and Microsoft Agent 365 are competing claims.[^17] The distinction matters for deployments: a Fortune 500 running 45+ agents across 4+ platforms cannot get cross-platform spending visibility, identity unification, or universal-policy enforcement from a single platform's control plane. The tower layer requires open instrumentation primitives — which is exactly what OpenTelemetry GenAI Semantic Conventions provide.[^17][^7]

The control tower / control plane / protocol-layer split is the architectural breakdown this paper recommends as the production default. Protocol layer = OpenTelemetry GenAI SemConv + W3C TraceContext + OTLP transport. Platform layer = vendor-specific control plane (AI Control Tower, Agent Fabric, Maestro). Cross-platform layer = the tower, which today is mostly missing — but increasingly approximated by deployments that push their OTel data into multi-backend Collector pipelines where the cross-platform roll-up happens in a custom analytics tier.[^17][^41]

> ### Quotable Findings IV
> - **ServiceNow AI Control Tower** defines five capabilities: **Discover, Observe, Govern, Secure, Measure**. Aligned with NIST AI RMF and EU AI Act. Traceloop acquisition (May 2026) brings runtime AI observability as a first-party capability.[^12][^13]
>
> - **AI Gateway sits inside AI Control Tower**: every MCP server registered, every agent connects through a Gateway URL with OAuth 2.1, per-server KPIs at **P50/P90/P95 latency** + total requests + success rates.[^9][^11]
>
> - **Salesforce Agent Platform Tracing** (May 7 2026) stores OpenTelemetry trace trees in Data 360 with two DMOs: `ssot__TelemetryTrace__c` + `ssot__TelemetryTraceSpan__dlm`, self-referential via `ssot__TelemetryParentSpanId__c`.[^14]
>
> - **Joining Session Tracing with Platform Tracing**: shared `ssot__TelemetryTraceId__c` lets queries span planner-level conversation through back-end execution in a single tree.[^14]
>
> - **Salesforce Agent Fabric** (April 22 2026 expansion): centralized cross-platform control plane with automatic agent discovery, Visual Authoring Canvas, rules-based guardrails, Trusted Agent Identity.[^16]
>
> - **Architectural distinction**: every platform built a **control plane** (its own agents); the **control tower** (every agent across every platform) requires open instrumentation primitives — i.e., OpenTelemetry GenAI SemConv.[^17]

## Part V — The Protocol Layer

### §V.1 — Datadog LLM Observability: native OTel GenAI SemConv

Datadog's December 1, 2025 engineering announcement made the protocol-layer commitment explicit: native support for OpenTelemetry GenAI Semantic Conventions v1.37+ in LLM Observability.[^26] The integration auto-maps the canonical attribute set into Datadog's LLM Obs schema: `gen_ai.request.model`, `gen_ai.usage.input_tokens`, `gen_ai.usage.output_tokens`, `gen_ai.provider.name`, and `gen_ai.operation.name` flow into the same correlation graph as Datadog APM traces, infrastructure metrics, and logs.[^26] Three OTLP routing options are supported: direct OTLP exporter from the application; Datadog Agent OTLP intake mode; and Datadog OTel Collector Distribution — each with the same destination schema.

The product surface that consumes those traces is the Operational Insights dashboard: trace-level and span-level metrics, error rates, latency breakdowns, token consumption by model and provider.[^29] The June 10, 2025 DASH announcement made AI Agent Monitoring generally available, alongside LLM Experiments and AI Agents Console (preview): the Console maps each agent's decision path, drills into latency spikes and infinite-loop conditions, and correlates with quality, security, and cost metrics.[^27] The pricing surface Digital Applied documented in April 2026 is APM-base ($31+/host/month) plus an LLM-specific volume add-on — meaningful for high-volume deployments but typical for the whole-stack-APM-plus-LLM-add-on pattern.[^39]

### §V.2 — Arize Phoenix: ELv2 open-source, OpenInference, native OTel

Phoenix is the open-source AI observability anchor for the protocol layer: 9,565 GitHub stars, 851 forks, 170 contributors, ELv2 license, native OpenTelemetry, with v15.4.0 shipped May 5, 2026 across 690 total releases.[^30] Phoenix supports OpenAI Agents SDK, Claude Agent SDK, LangGraph, Vercel AI SDK, Mastra, CrewAI, LlamaIndex, and DSPy through first-party instrumentations.[^30][^36] The architecture is OTLP-based: any application emitting OpenTelemetry GenAI spans can export to Phoenix as a backend without adopting Phoenix's SDK directly.

The OpenInference layer is the dialect translation surface introduced in Part III. `@arizeai/openinference-genai` (TypeScript) translates OpenTelemetry GenAI spans to Phoenix's OpenInference format inline, preserving the canonical attribute set.[^34] An Arize-ai/openinference RFC opened December 27, 2025 extends the same translation pattern to Salesforce Agentforce and Azure AI Foundry — broadening the platform-layer-to-protocol-layer bridge that Phoenix occupies.[^23] The practical implication for production deployments: a team standardizing on OTel GenAI SemConv in code can ship to Phoenix today, swap to a different OTLP-compatible backend later (Datadog, Honeycomb, Grafana Tempo, Jaeger), and keep the instrumentation surface unchanged. The cost of vendor switch is the export-config change, not a re-instrumentation campaign.

### §V.3 — Langfuse: OpenTelemetry-native, broader engineering surface

Langfuse — 24,382 GitHub stars, 23.1 million monthly SDK installs, customers including Samsara, Twilio, and Khan Academy — is the open-source platform with the broadest LLM-engineering surface area beyond pure tracing.[^21] OpenTelemetry-native ingest pairs with prompt management, evaluation runs, dataset management, and the LLM-as-judge pipeline. The April 10, 2026 AppXLab production guide demonstrates the canonical Langfuse + OTel deployment: framework instrumentation emits OTel GenAI spans; OTLP exporter ships to Langfuse Cloud or self-hosted; evaluation runs query the same trace data for trajectory-based and step-level scoring.[^20]

The architectural choice between Phoenix and Langfuse in mid-2026 production deployments tracks team profile rather than capability gap. Teams optimizing for AI-engineer ergonomics — prompt iteration, dataset experimentation, eval-driven development — often choose Langfuse for the depth of the experimentation surface.[^40] Teams optimizing for OTel-native debugging and tight RAG-tracing alignment often choose Phoenix.[^40] Both export and ingest the same OpenTelemetry GenAI semantic conventions; the cost of running both in parallel is one additional Collector exporter.

### §V.4 — Helicone: gateway-first observability

Helicone takes the gateway-first architectural posture: the application changes its OpenAI base URL to Helicone's endpoint; all model calls flow through the gateway; observability happens automatically on the proxied traffic.[^40] The trade-off is explicit. Gain: zero code changes to instrument an existing OpenAI-compatible application; OpenAI-compatible API surface across 100+ providers; rate-limit, caching, and key-management primitives at the gateway layer. Cost: gateway becomes a critical-path runtime dependency; instrumentation depth is bounded by what the gateway can observe (no in-process tool-call detail unless additionally instrumented).

The gateway-first posture composes cleanly with the OTel-native posture rather than replacing it. A typical mid-2026 production stack runs Helicone (or a similar gateway) for the gateway-layer observability and rate-limit primitives, plus an OTel SDK for in-process agent and tool-call detail, exporting both streams to a unified backend (Phoenix, Langfuse, Datadog) where they get joined on `traceparent` for end-to-end visibility.[^40]

### §V.5 — The broader category: Honeycomb, New Relic, LangSmith, Braintrust

The category map in mid-2026 includes: Langfuse (open-source self-host), LangSmith (LangChain/LangGraph), Arize Phoenix (RAG debugging + OSS), Braintrust ($80M[^37] Series February 2026, evaluation-platform anchor), Datadog LLM Obs (infra-native), Honeycomb LLM Obs (event-based deep tracing), New Relic AI Monitor (APM-native), TruLens (Apache-2.0, Snowflake-backed), and WhyLabs LangKit (guardrails-focused).[^37] The pattern across the category is convergence on OpenTelemetry GenAI semantic conventions as the canonical wire format, with platform differentiation moving up to the analysis-and-evaluation surface above the trace-ingest layer.[^37][^39]

Salesforce Agentforce occupies a hybrid position: protocol-layer compatibility through OpenTelemetry trace-tree storage in Data 360, plus an analysis surface (intent clustering, sentiment, quality scoring) that targets the same engineering-ergonomics niche as Langfuse and LangSmith but inside the Salesforce platform graph.[^19][^15] AgentExchange — Salesforce's marketplace surface, with 150,000+ businesses and 200+ partners including Google Cloud, DocuSign, and Box — extends the platform-layer reach into a packaged-agent ecosystem on top of the same observability substrate.[^22]

> ### Quotable Findings V
> - **Datadog LLM Observability** ships native OpenTelemetry GenAI SemConv v1.37+ support (Dec 1 2025), with three OTLP routing options: direct exporter, Datadog Agent OTLP, Datadog OTel Collector Distribution.[^26]
>
> - **Arize Phoenix**: 9,565 stars, 851 forks, 170 contributors, ELv2 license, native OpenTelemetry, 690 releases, v15.4.0 (May 5 2026). First-party instrumentations: OpenAI Agents SDK, Claude Agent SDK, LangGraph, Vercel AI SDK, Mastra, CrewAI, LlamaIndex, DSPy.[^30]
>
> - **Langfuse**: 24,382 GitHub stars, 23.1M monthly SDK installs, customers Samsara/Twilio/Khan Academy. OpenTelemetry-native plus prompt management, eval runs, dataset management.[^21]
>
> - **Helicone**: gateway-first observability via OpenAI-compatible API across 100+ providers. Composes with OTel-native instrumentation rather than replacing it.[^40]
>
> - **Category convergence**: OpenTelemetry GenAI SemConv as canonical wire format; differentiation in the analysis surface above the trace-ingest layer. Braintrust ($80M[^37] Feb 2026), LangSmith, Phoenix evaluations, Langfuse evals.
>
> - **Pair-pattern default**: production teams pair an LLM-native observability platform with a whole-stack APM. Datadog $31+/host/mo + LLM volume add-on is the canonical price-point reference.[^39]

## Part VI — AI Gateways as Observability Sources

### §VI.1 — Cloudflare AI Gateway: unified inference layer

Cloudflare's April 16, 2026 AI Platform announcement repositioned AI Gateway from a per-provider proxy to a unified inference layer: 700+ models accessible through one API spanning Cloudflare Workers AI plus third-party providers, with streaming resumption and automatic failover across providers.[^42] The data point that anchors the architectural pitch: Cloudflare's own customer base calls an average of 3.5 models per request across multiple providers — meaning the unified-inference layer is solving a problem that already exists in production.[^42] Replicate joining the Cloudflare AI Platform team (announced in the same post) brings model-hosting depth into the same gateway surface.

The streaming-resilience capability is the load-bearing observability primitive: AI Gateway buffers streaming responses, and a disconnected agent can reconnect without paying twice for output tokens.[^47] For long-running agent sessions — minutes-to-hours rather than seconds — streaming resilience plus trace-context propagation across reconnects is the difference between observable agents and black-box agents on flaky network paths. Project Think (April 15, 2026) layers per-agent isolation via Durable Objects, DO SQLite, and DO Hibernation (zero cost when idle), with persistent context blocks for memory across sessions.[^43] The combined surface — Workers AI + AI Gateway + Agents SDK + Durable Objects — is one of the cleanest end-to-end agent-platform stacks shipping in mid-2026.

### §VI.2 — Portkey: 1,600+ LLMs, Gartner Cool Vendor 2025

Portkey is the canonical reference architecture document in the AI Gateway category: a seven-layer observability stack spanning client, AI gateway, model provider, tools/MCP, observability data store, and visualization, with explicit trace-ID propagation rules.[^41] The propagation specification: `trace_id` shared across reasoning cycle; `span_name` with values `plan`/`execute`/`evaluate`; `iteration` for step order within a cycle; `latency_ms`, `cost_usd`, `status` as the canonical metric triple.[^41] Portkey supports 1,600+ LLMs, 40+ metrics per agent run, custom output rules, and powers 3,000+ GenAI teams.[^44] Palo Alto Networks announced intent to acquire Portkey, signaling the security-platform-incumbent arrival in the AI Gateway category.[^44]

The integration surface Portkey publishes — explicit interoperability with Arize Phoenix, FutureAGI, and Pydantic Logfire as observability backends, plus a built-in MCP server registry with tool/capability discovery and governance over tool execution — defines the gateway-layer-to-observability-backend handoff cleanly.[^45] A deployment using Portkey for the gateway layer can pair with any of the protocol-layer platforms covered in Part V without architectural rework.

### §VI.3 — Kong AI Gateway: production benchmark

Kong's June 2025 production benchmark — Kong AI Gateway 3.10 vs Portkey OSS 1.9.19 vs LiteLLM 1.63.7 on AWS EKS, 12 CPUs each, 400 virtual users, 1,000 prompt tokens — provides the rare apples-to-apples performance data point in the category.[^46] Kong: 200%+ faster than Portkey, 800%+ faster than LiteLLM. 65% lower latency vs Portkey; 86% lower latency vs LiteLLM.[^46] The benchmark code is reproducible: K6 plus WireMock plus EKS, published as `Kong/kong_ai_gateway-portkey-litellm-benchmark`.[^48]

The benchmark numbers should be read as a directional production-engineering signal rather than a category verdict. Single-version, single-workload benchmarks compress real-world operational variance — different prompt distributions, different model latencies, different rate-limit patterns produce different rankings. The genuinely informative pattern in the data is the order-of-magnitude separation between Kong, Portkey OSS, and LiteLLM at the high end: AI Gateway throughput is a real engineering surface where architectural choices matter, not a commodity layer where every provider performs equivalently.[^46]

### §VI.4 — Reference architecture: the seven-layer stack

The Portkey reference architecture document (November 4, 2025) defines a seven-layer observability stack that has become the de-facto category reference.[^41] Layer 1: client (the application or user-facing surface). Layer 2: AI gateway (Cloudflare, Portkey, Kong, LiteLLM). Layer 3: model provider (OpenAI, Anthropic, Google, AWS Bedrock, Workers AI). Layer 4: tools/MCP (the integration surface). Layer 5: observability data store (the trace and metric persistence layer). Layer 6: visualization (Datadog, Phoenix, Langfuse UIs). Layer 7: governance and alerting (the enforcement surface).[^41] Trace-ID propagation across all seven layers is the wire-level invariant; semantic-convention compliance is the schema-level invariant; OTLP transport is the protocol invariant.

> ### Quotable Findings VI
> - **Cloudflare AI Gateway** (April 16 2026): unified inference layer for 700+ models with streaming resumption and automatic failover. Customers call avg 3.5 models per request across multiple providers.[^42]
>
> - **Streaming resilience**: AI Gateway buffers responses; disconnected agents reconnect without paying twice for output tokens — the load-bearing primitive for long-running agent sessions.[^47]
>
> - **Portkey**: seven-layer reference architecture; trace-ID + `span_name` (plan/execute/evaluate) + `iteration` + `latency_ms` + `cost_usd` + `status` as canonical metric set. 1,600+ LLMs, 3,000+ GenAI teams. Gartner Cool Vendor 2025. Palo Alto Networks intent-to-acquire.[^41][^44]
>
> - **Kong AI Gateway 3.10**: 200%+ faster than Portkey OSS,[^46] 800%+ faster than LiteLLM[^46] in published benchmark; 65%[^46] / 86%[^46] lower latency. Reproducible on `Kong/kong_ai_gateway-portkey-litellm-benchmark`.[^48]
>
> - **Seven-layer stack**: client → AI gateway → model provider → tools/MCP → observability store → visualization → governance/alerting. Trace-ID propagation is the wire invariant; OTel GenAI SemConv is the schema invariant; OTLP is the transport invariant.[^41]

## Part VII — Threat Model, Open Questions, Out of Scope

### §VII.1 — Threats observability creates and the controls that mitigate them

Adding observability to an agent system creates four threat surfaces that did not previously exist. **Sensitive data in spans**: prompts, completions, retrieval results, and tool-call arguments routinely contain PII, PHI, financial data, or trade secrets, and a span exported to a downstream backend leaks that data along the export path.[^3] The mitigation is the capture-content discipline from Part III: default to don't-record, opt in to record-references-to-external-store, restrict raw-content access to a separately authorized debugging surface. **Sampling bias hiding rare failure modes**: head-based sampling at the SDK can drop the 1-in-10,000 trace that contains the only example of a failure mode currently active. Tail-based sampling at the OTel Collector with rules keyed on `gen_ai.error.type` and latency-percentile thresholds is the canonical mitigation.[^38]

**Vendor lock-in via proprietary span schemas**: a deployment that adopts a vendor-specific schema (Datadog LLM Obs proprietary, AWS Bedrock-only attributes) instead of OpenTelemetry GenAI SemConv pays a re-instrumentation cost on every backend swap.[^7] The mitigation is canonical-first instrumentation: emit OTel GenAI spans as the source of truth; let the downstream Collector translate to vendor-specific schemas at the export edge. **Instrumentation gaps masquerading as healthy systems**: a partially instrumented agent reports clean metrics for the spans it emits while missing entire failure paths. The mitigation is instrumentation coverage as a first-class engineering surface, with explicit gates in CI that fail builds when new code paths ship without corresponding span coverage.[^7][^37]

### §VII.2 — Open questions the category has not yet resolved

Three questions remain genuinely open in mid-2026. **Cross-protocol budget tracking**: a single agent transaction can fan out across A2A, MCP, AP2, x402, and Visa TAP boundaries, each with its own observability semantics. No platform today provides a unified budget-and-spend rollup across all five protocol surfaces; the closest approximations are the platform-layer control planes that capture spending inside their own perimeters.[^17] **Agent-to-agent baggage propagation across security boundaries**: W3C Baggage carries application-defined context across services, but propagating it across an organizational trust boundary (orchestrator agent at Company A calling worker agent at Company B) requires a security review most deployments have not yet built. **Cost attribution for nondeterministic LLM calls**: token-level cost attribution at the agent-action level is straightforward; cost attribution at the user-intent level — when a single user request fans out across 30 LLM calls and 5 retrieval steps — requires the agent-name attribution proposal in GitHub Issue #3602 to land in the canonical spec, which it has not as of May 2026.[^4]

### §VII.3 — Out of scope and why

This paper does not cover voice-first agent acoustic-evidence considerations (separate problem domain, separate compliance regime), framework-specific deep-dives (LangGraph internals, CrewAI internals, AWS Bedrock AgentCore internals — each is a paper of its own), or domain-specific compliance thresholds (healthcare HIPAA observability, financial-services compliance auditing, EU AI Act high-risk system documentation). The architectural primitives are general; the specific deployment pattern in a regulated vertical depends on the vertical's compliance regime, which a generic observability paper cannot cover well.[^7]

### §VII.4 — Where the field is going

Three trajectories are visible in the public artifacts of mid-2026. First, OpenTelemetry GenAI Semantic Conventions stabilization: the SIG is moving toward canonical-stable status across model spans, agent spans, events, metrics, and tech-specific profiles, with the `gen_ai.agent.name` attribution proposal the most-watched open issue.[^4][^7] Second, OpenInference convergence with the canonical OTel GenAI semconv: Phoenix's translation layer is the bridging mechanism in production, but the long-arc trajectory is unification rather than parallel dialects.[^34] Third, the platform layer expanding cross-platform: the iEnable framing predicts that the cross-platform control tower is the next category to fund-and-ship; the May 2026 ServiceNow Knowledge announcement and the April 2026 Salesforce Agent Fabric expansion are the first wave of vendor responses.[^17][^13][^16]

## Closing

The shift this paper documents is the move from classical APM — built for deterministic code, latency, and error rates — to semantic observability for agents: the prompt that fired, the retrieval that returned, the tool the model chose, and the quality of the output trace-by-trace. The substrate is OpenTelemetry GenAI Semantic Conventions, with W3C TraceContext as the propagation layer and OTLP as the transport. The deployment architecture is a clean platform-vs-protocol split: protocol layer for the open-instrumentation foundation (OTel + Phoenix/Langfuse/Datadog), platform layer for the vendor-specific control plane (ServiceNow AI Control Tower, Salesforce Agent Fabric), AI Gateway for the runtime control point and unified-inference surface (Cloudflare, Portkey, Kong).

The teams that will ship the next generation of multi-agent A2A systems are the ones treating instrumentation as a first-class engineering surface — not as an afterthought, not as a compliance checkbox. They will debug faster, attribute cost faster, and ship features faster than teams that treat observability as a downstream concern. The five months of platform launches between December 2025 and May 2026 collapsed the "what should we build" decision into a "how should we deploy what's already built" decision. The field manual is now legible. The work is the deployment.

## Glossary

**A2A** · Agent-to-Agent protocol, LF, v1.0.0 March 12 2026. **OTel** · OpenTelemetry. **GenAI SemConv** · OTel attribute/span schema for LLM + agent observability. **OpenInference** · Arize OTel-compatible dialect. **`gen_ai.operation.name`** · operation discriminator. **`gen_ai.agent.name`** · proposed (PR #3602) logical-agent label. **`invoke_agent`** · CLIENT cross-process / INTERNAL same-process. **`create_agent`** · lifecycle creation event. **`execute_tool`** · tool-call execution. **W3C TraceContext** · `traceparent` + `tracestate` HTTP headers. **Tail-based sampling** · post-trace decision keyed on signal. **OTLP** · canonical wire format. **ServiceNow AI Control Tower** · Discover/Observe/Govern/Secure/Measure. **AI Gateway** · runtime control point (multiple vendor products). **CIMD** · ServiceNow Client Identity Metadata Document. **Agent Platform Tracing** · Salesforce May 7 2026 GA, OTel into Data 360. **Agentforce Observability** · session-level UI. **Data 360** · Salesforce data lake. **`ssot__TelemetryTrace__c`** · trace metadata DMO. **Datadog LLM Observability** · native OTel GenAI SemConv v1.37+. **Phoenix** · Arize ELv2 OSS. **Langfuse** · OSS LLM-engineering. **Helicone** · gateway-first. **OpenLIT / OpenLLMetry** · auto-instrumentation libs. **Cloudflare AI Gateway** · 700+ models. **Portkey / Kong / LiteLLM** · gateway category.

## References

[^1]: OpenTelemetry. "Semantic conventions for GenAI agent and framework spans." opentelemetry.io. https://opentelemetry.io/docs/specs/semconv/gen-ai/gen-ai-agent-spans/

[^2]: OpenTelemetry. "Semantic conventions for generative AI systems." opentelemetry.io. https://opentelemetry.io/docs/specs/semconv/gen-ai/

[^3]: OpenTelemetry. "Semantic conventions for generative client AI spans." opentelemetry.io. https://opentelemetry.io/docs/specs/semconv/gen-ai/gen-ai-spans

[^4]: open-telemetry/semantic-conventions Issue #3602. "`gen_ai.agent.name` proposal." github.com. April 7, 2026. https://github.com/open-telemetry/semantic-conventions/issues/3602

[^5]: traceloop/openllmetry RFC #3460. "Semantic Conventions for AI Agent Observability." github.com. November 23, 2025. https://github.com/traceloop/openllmetry/issues/3460

[^6]: OpenTelemetry. "GenAI attributes registry." opentelemetry.io. https://opentelemetry.io/docs/specs/semconv/registry/attributes/gen-ai/

[^7]: OpenTelemetry Blog. "AI Agent Observability: Evolving Standards." opentelemetry.io. March 2025. https://opentelemetry.io/blog/2025/ai-agent-observability/

[^8]: ServiceNow. "Introducing AI Gateway." servicenow.com. December 11, 2025. https://www.servicenow.com/community/grc-blog/servicenow-ai-gateway-securing-the-next-phase-of-enterprise-ai/ba-p/3472541

[^9]: ServiceNow. "AI Gateway What's New: March 2026 release." servicenow.com. https://www.servicenow.com/community/now-assist-articles/ai-gateway-what-s-new-in-the-march-2026-release/ta-p/3501670

[^11]: ServiceNow. "AI Gateway FAQ." servicenow.com. March 12, 2026. https://www.servicenow.com/community/now-assist-articles/ai-gateway-faq/ta-p/3501650

[^12]: ServiceNow. "AI Control Tower product page." servicenow.com. https://www.servicenow.com/products/ai-control-tower.html

[^13]: BusinessWire. "ServiceNow expands AI Control Tower." businesswire.com. May 5, 2026. https://www.businesswire.com/news/home/20260505712561/en/ServiceNow-expands-AI-Control-Tower

[^14]: Salesforce Developers Blog. "Agent Platform Tracing: Debug Agentforce with trace trees, SOQL, and Slack." developer.salesforce.com. May 7, 2026. https://developer.salesforce.com/blogs/2026/05/agent-platform-tracing-debug-agentforce-with-trace-trees-soql-and-slack

[^15]: Salesforce. "Agentforce Observability." salesforce.com. https://www.salesforce.com/agentforce/observability/

[^16]: UC Today. "Salesforce expands Agent Fabric." uctoday.com. April 22, 2026. https://www.uctoday.com/productivity-automation/salesforce-agent-fabric-expansion/

[^17]: iEnable. "Control Tower vs Control Plane." ienable.ai. March 25, 2026. https://ienable.ai/blog/control-tower-vs-control-plane-ai-governance.html

[^18]: CXFoundation. "ServiceNow Knowledge 2026 Top 10." cxfoundation.com. https://cxfoundation.com/news/servicenow-knowledge-2026-announcements

[^19]: Times of Salesforce. "Salesforce introduces Agent Observability." timesofsalesforce.com. January 8, 2026. https://www.timesofsalesforce.com/2026/01/salesforce-introduces-agent_7.html

[^20]: AppXLab Blog (Frank). "AI Agent Observability with Langfuse + OTEL." blog.appxlab.io. April 10, 2026. https://blog.appxlab.io/2026/04/10/ai-agent-observability-langfuse/

[^21]: AgentsIndex. "Langfuse vs Salesforce Agentforce." agentsindex.ai. https://agentsindex.ai/compare/langfuse-vs-salesforce-agentforce

[^22]: AgentsIndex. "Langfuse vs Salesforce AgentExchange." agentsindex.ai. https://agentsindex.ai/compare/langfuse-vs-salesforce-agentexchange

[^23]: Arize-ai/openinference Issue #2569. "Salesforce Agentforce + Azure AI Foundry instrumentation RFC." github.com. December 27, 2025. https://github.com/Arize-ai/openinference/issues/2569

[^26]: Datadog Blog. "Native OpenTelemetry GenAI Semantic Conventions support." datadoghq.com. December 1, 2025. https://www.datadoghq.com/blog/llm-otel-semantic-convention

[^27]: Datadog Investor News. "DASH 2025 LLM Observability expansion." datadoghq.com. June 10, 2025. https://investors.datadoghq.com/news-releases/news-release-details/datadog-expands-llm-observability-new-capabilities-monitor

[^29]: Datadog Docs. "LLM Observability Monitoring." docs.datadoghq.com. https://docs.datadoghq.com/llm_observability/monitoring

[^30]: Arize-ai/phoenix. "GitHub repository." github.com. https://github.com/Arize-ai/phoenix

[^31]: A2A Project. "A2A v1.0.0 specification — design principles." a2a-protocol.org. https://a2a-protocol.org/latest/specification/

[^32]: A2A Project. "A2A Extensions framework." a2a-protocol.org. https://a2a-protocol.org/latest/topics/extensions/

[^33]: A2A Project. "A2A Streaming and Async patterns." a2a-protocol.org. https://a2a-protocol.org/latest/topics/streaming-and-async/

[^34]: Phoenix Docs. "Translating Semantic Conventions." arize.com/docs/phoenix. https://arize.com/docs/phoenix/tracing/concepts-tracing/translating-conventions

[^35]: a2aproject/A2A. "GitHub repository." github.com. https://github.com/a2aproject/A2A

[^36]: Phoenix Docs. "What is Arize Phoenix." docs.arize.com/phoenix. https://docs.arize.com/phoenix/

[^37]: Awesome Agents (Kowalski). "Best AI Observability Tools 2026." awesomeagents.ai. April 19, 2026. https://awesomeagents.ai/tools/best-ai-observability-tools-2026/

[^38]: Zylos Research. "OpenTelemetry for AI Agents." zylos.ai. February 28, 2026. https://zylos.ai/research/2026-02-28-opentelemetry-ai-agent-observability

[^39]: Digital Applied. "LangSmith vs Langfuse vs Arize 2026." digitalapplied.com. April 27, 2026. https://www.digitalapplied.com/blog/agent-observability-platforms-langsmith-langfuse-arize-2026

[^40]: Open Techstack (De La Cueva). "Langfuse vs Phoenix vs Helicone 2026." open-techstack.com. April 2, 2026. https://open-techstack.com/blog/langfuse-vs-phoenix-vs-helicone-llm-observability-2026/

[^41]: Portkey. "The Complete Guide to LLM Observability." portkey.ai. November 4, 2025. https://portkey.ai/blog/the-complete-guide-to-llm-observability

[^42]: Cloudflare Blog. "AI Platform: an inference layer for agents." blog.cloudflare.com. April 16, 2026. https://blog.cloudflare.com/ai-platform/

[^43]: Cloudflare Blog. "Project Think: next-gen AI agents on Cloudflare." blog.cloudflare.com. April 15, 2026. https://blog.cloudflare.com/project-think/

[^44]: Portkey. "Agents production page." portkey.ai. https://portkey.ai/features/agents

[^45]: Portkey. "Cloudflare AI Gateway alternatives." portkey.ai. https://portkey.ai/alternatives/cloudflare-ai-gateway-alternatives

[^46]: Kong (Acquaviva). "AI Gateway Benchmark vs Portkey + LiteLLM." konghq.com. https://konghq.com/blog/engineering/ai-gateway-benchmark-kong-ai-gateway-portkey-litellm

[^47]: Cloudflare YouTube. "AI Gateway's Next Evolution: Inference Layer for Agents." youtube.com. April 20, 2026. https://www.youtube.com/watch?v=4u77o3tiSNM

[^48]: Kong/kong_ai_gateway-portkey-litellm-benchmark. "Reproducible benchmark code." github.com. https://github.com/Kong/kong_ai_gateway-portkey-litellm-benchmark

[^55]: Perea Research. "Policy Decision Record Implementation 2026." perea.ai. May 2026. https://www.perea.ai/research/policy-decision-record-implementation-2026


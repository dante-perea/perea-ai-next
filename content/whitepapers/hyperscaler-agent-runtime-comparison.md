---
title: "Hyperscaler Agent Runtimes 2026"
subtitle: "AgentCore vs Foundry vs Agent Engine vs AgentKit — The Architectural Decision Matrix for Production Agent Deployment"
publication: "perea.ai Research"
authors: ["Dante Perea"]
version: "1.0"
status: "Public draft"
date: "2026-05"
audience: "Platform engineering leads selecting an agent runtime, founders deciding which hyperscaler ecosystem to commit to, and architects designing production agent deployments who need pricing, isolation, framework, and observability comparisons in one place."
length: "~3,000 words"
license: "CC BY 4.0"
description: "Architectural decision matrix for the four hyperscaler-managed agent runtimes — AWS Bedrock AgentCore (GA Oct 2025), Microsoft Foundry Agent Service (GA March 2026), Google Vertex Agent Engine (Gemini Enterprise Agent Platform), and OpenAI AgentKit (DevDay Oct 2025). Maps pricing, session isolation, framework support, observability, and the canonical decision tree."
profile: "field-manual"
---

# Hyperscaler Agent Runtimes 2026

## What this paper is, in one sentence

The four hyperscaler-managed agent runtimes — AWS Bedrock AgentCore (GA Oct 13 2025[^1]), Microsoft Foundry Agent Service (GA March 2026[^2]), Google Vertex Agent Engine on the Gemini Enterprise Agent Platform[^3], and OpenAI AgentKit (DevDay 2025[^4]) — converge on a similar consumption-based pricing shape ($0.0864–$0.0994[^5][^6][^7] per vCPU-hour, $0.0090–$0.0118[^5][^6][^7] per GiB-hour) and on a similar set of enabling primitives (session isolation, framework agnosticism, OpenTelemetry observability, MCP/A2A protocol support), and the architectural decision between them now comes down to four axes: ecosystem alignment, framework lock-in tolerance, pricing-model fit, and what isolation guarantee your workload actually needs.

## Why hyperscaler-managed runtimes exist

Roll-your-own agent infrastructure was the 2024 default. By 2025 the operational cost of building and maintaining it — session isolation, autoscaling from zero, multi-hour execution windows, identity management, observability, framework integration — had become substantial enough that all four hyperscalers shipped a managed runtime within a six-month window: AWS in October 2025[^1], OpenAI also in October 2025[^4], Google through 2025[^3], and Microsoft in March 2026[^8].

The shared architectural insight: agents spend 30–70%[^9][^5] of session wall-clock time in I/O wait — waiting for LLM responses, tool calls, or database queries. A traditional compute model that bills for allocated resources during that wait is mispriced for the workload by 30–70%[^9]. All four hyperscalers responded with consumption-based pricing that bills only for active CPU during processing periods (and idle/wait time free or near-free), aligning cost with value creation.[^5][^6][^7][^9]

The shared list of enabling features that every runtime now ships:

- Session isolation (microVM, container, or per-session sandbox) preventing cross-session data contamination.[^1][^10][^11]

- Multi-hour execution windows for long-running agent workflows (8 hours[^1] AgentCore, comparable on Vertex/Foundry).

- Framework agnosticism — every runtime supports LangChain/LangGraph, CrewAI, LlamaIndex plus its own native framework.[^1][^2][^3][^4]

- OpenTelemetry-compatible observability with traces, metrics, dashboards.[^12][^13]

- Native MCP and A2A protocol support (or Responses API for OpenAI).[^1][^14][^15]

- Identity / OAuth integration with enterprise IdPs.[^1][^2]

- VPC/PrivateLink/BYO-VNet for enterprise-grade network isolation.[^1][^16]

The differences live in pricing per resource, framework defaults, cross-product integration, and a few architectural details — particularly the choice between *direct code deployment* (AgentCore, AgentKit) and *container deployment* (Foundry hosted agents, AgentCore container option).

## The pricing matrix

Numbers below are list price per vCPU-hour and GiB-hour at GA, unmodified by enterprise commits.

| Runtime                       | vCPU-hour       | GiB-hour        | Free Tier                                     | Billing Granularity      |
| ----------------------------- | --------------- | --------------- | --------------------------------------------- | ------------------------ |
| AWS Bedrock AgentCore         | $0.0895[^5]     | $0.00945[^5]    | None (post-Sep 16 2025[^9])                   | Per second, 1-second min[^5] |
| Microsoft Foundry Hosted      | $0.0994[^7]     | $0.0118[^7]     | 30-day Azure free trial[^7]                   | Per hour[^7]              |
| Google Vertex Agent Engine    | $0.0864[^6]     | $0.0090[^6]     | 50 vCPU-hr + 100 GiB-hr / month perpetual[^6] | Per second[^6]            |
| OpenAI AgentKit / Agents SDK  | Token-based[^4] | Token-based[^4] | API standard tier                              | Per token[^4]             |

**The pricing pattern, decoded:**[^5][^6][^7]

- Vertex is the cheapest list price ($0.0864/$0.0090) *and* has the most generous perpetual free tier (50 vCPU-hours and 100 GiB-hours per month per project[^6]).
- AgentCore is mid-list ($0.0895/$0.00945) with the most aggressive idle/wait-time discount: I/O wait and idle are FREE if no other background process runs, peak-memory billing only.[^5][^9]
- Foundry is the most expensive at list ($0.0994/$0.0118) but offers the Agent Commit Units (ACU) pre-purchase plan with up to 15%[^17] discount at the 500K-unit tier ($425K[^17] for 500K ACUs).
- AgentKit doesn't charge a separate runtime fee — pricing is folded into standard token-based API pricing.[^4][^15] This is structurally different from the other three.

**Adjacent service pricing (where bundles diverge):**[^5][^6][^18]

- AgentCore Gateway: $0.005[^18] per 1,000 API calls; $0.025[^18] per 1,000 search queries; $0.02[^18] per 100 tools indexed/month.
- AgentCore Memory: $0.25[^18] per 1,000 short-term events; $0.75[^18] per 1,000 long-term events/month; $0.50[^18] per 1,000 retrievals.
- Vertex Sessions: $0.20[^6] per 1,000 events (billing started Feb 11, 2026[^6]).
- Vertex Memory Bank: $0.20[^6] per 1,000 memories stored/month; $0.50[^6] per 1,000 retrievals (first 1,000 free).
- Foundry tools: File Search Storage $0.11[^7]/GB/day (1 GB free); Code Interpreter $0.033[^7]/session; Web Search $14[^7]/1,000 transactions.

**Worked example.** A customer-support agent handling 10,000[^9] sessions/day, each 60 seconds[^9] wall-clock with 18 seconds[^9] active CPU at 1 vCPU and 1.5–2.5 GB[^9] memory. AgentCore-billed cost per session: 18s × ($0.0895/3600) + memory charges = $0.0007625[^9] (a 70%[^9] reduction vs allocation-based pricing on the same workload).[^9] Across the four hyperscalers, this workload would land in the same low-thousandths-of-a-cent-per-session range — the differentiator at this scale is not unit cost but ecosystem fit.

## Session isolation: the architectural axis everyone competes on

**AgentCore Runtime[^1][^10]:** dedicated microVM per user session with isolated CPU, memory, filesystem. After session completion, the microVM terminates and memory is sanitized. "Deterministic security even when working with non-deterministic AI processes." Eight-hour execution windows, automatic scale-to-zero through scaling-to-thousands. Single, comprehensive SDK across Memory, Tools, Gateway, Identity, Observability, Browser Tool, Code Interpreter.[^1][^14]

**Foundry Hosted Agents (preview/GA[^11]):** per-session VM-isolated sandboxes with persistent filesystem (`$HOME` and `/files`), enabling scale-to-zero with stateful resume. Each session gets a dedicated sandbox; sessions are isolated from each other; state is automatically restored when a session resumes after going idle. CPU/memory range: 0.25 vCPU/0.5 GiB to 2 vCPU/4 GiB[^11]. Default limit 50[^11] concurrent sessions per subscription per region (adjustable). Deployed via Azure Container Registry; runs in Microsoft-managed infrastructure; container subnet delegated to `Microsoft.App/environments`, /27 minimum, /24 default.[^16]

**Vertex Agent Engine[^3][^19]:** managed runtime with serverless efficiency, billed per second. Idle time not billed. Deploy via `adk deploy` single-command CLI[^19]. Hundreds of thousands[^19] of agents already deployed since launch. Scale from zero to global through Google's serverless infrastructure. Native A2A protocol support; secure code execution sandbox; observability via Google Cloud Trace.[^19]

**AgentKit / Agents SDK[^4][^15]:** the OpenAI runtime is structurally different — there is no managed compute layer separate from the API. Sandbox agents (v0.14.0+[^20]) ship in the Agents SDK with native sandbox execution, Manifest abstraction for workspace, snapshotting, and rehydration that supports recovery if the original sandbox container fails. Storage providers: AWS S3, Google Cloud Storage, Azure Blob, Cloudflare R2[^20]. Durable execution via Temporal, Restate, or DBOS integrations[^21]. Python first; TypeScript planned; v0.15.1[^22] (May 2 2026), MIT, 25,912[^22] GitHub stars, 270[^22] contributors.

**The isolation tradeoff that decides workloads.** AgentCore's microVM is the strongest isolation guarantee — true VM-level separation, deterministic sanitization, designed explicitly for "non-deterministic AI processes."[^10] Foundry's per-session sandbox is comparable for most workloads but uses container-level isolation. Vertex is serverless-managed (isolation guarantees not as explicitly documented at the microVM level). AgentKit gives developers explicit choice — run sandbox locally, run sandbox managed, or skip sandbox entirely — at the cost of moving the isolation responsibility to the developer.[^4][^20]

## Framework support: who hosts whom

| Runtime          | Native frameworks                                                            | OSS frameworks supported                                                                |
| ---------------- | ---------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| AgentCore        | Strands Agents (AWS-developed)                                               | LangChain, LangGraph, CrewAI, LlamaIndex, Google ADK, OpenAI Agents SDK[^1][^14]        |
| Foundry          | Microsoft Agent Framework, Semantic Kernel                                   | LangChain, LangGraph, OpenAI Agents SDK[^2][^8]                                         |
| Vertex AE        | Google ADK                                                                   | LangChain, LangGraph, LlamaIndex, AG2, custom[^3][^19]                                  |
| AgentKit         | Agent Builder (visual), Agents SDK (code)                                    | 100+ LLM providers[^22] via Agents SDK abstractions; Responses-API-compatible           |

**The framework lesson.** All four runtimes support the major OSS frameworks (LangChain/LangGraph at minimum), but each has a native preference. AgentCore is the most framework-agnostic by design; Foundry is wire-compatible with the OpenAI Responses API[^8] (the cleanest migration path off OpenAI's hosted runtime); Vertex is most opinionated toward Google ADK but supports A2A interop; AgentKit assumes you're using the Agents SDK or its visual Agent Builder.[^4][^15]

## Observability and protocol surface

All four ship OpenTelemetry-compatible tracing.[^12][^13] AgentCore Observability emits OTEL natively and integrates with Amazon CloudWatch + external providers (Dynatrace, Datadog, Arize Phoenix, LangSmith, Langfuse[^1]). Foundry's observability runs through Foundry Control Plane with Azure Monitor, continuous evaluation, end-to-end tracing GA in March 2026[^8]. Vertex Agent Engine integrates with Google Cloud Trace, custom metrics, alerts.[^19] AgentKit ships with Evals (datasets, trace grading, automated prompt optimization, third-party model support[^15]).

**Protocol-level support, mid-2026:**[^1][^2][^3][^4]

- AgentCore: A2A protocol native; MCP servers via Gateway; OAuth + IAM authorization; broader A2A coming across all services.[^1]
- Foundry: Responses-API native; MCP over private network paths; OAuth passthrough.[^8][^16]
- Vertex AE: A2A native; ADK CLI + adk deploy.[^19]
- AgentKit: Responses API + MCP via Connector Registry.[^4][^15]

## Compliance, security, and enterprise networking

**AgentCore[^1]:** VPC + AWS PrivateLink + AWS CloudFormation + resource tagging + IAM (in addition to OAuth) + Cedar policy language; nine[^1] AWS Regions at GA (Mumbai, Singapore, Sydney, Tokyo, Dublin, Frankfurt, N. Virginia, Ohio, Oregon).

**Foundry[^16][^7]:** Standard Setup with private networking — BYO VNet, no public egress, container/subnet injection. Microsoft Entra Agent ID for identity. Azure Storage / Cosmos DB / AI Search for stateful entity persistence.

**Vertex AE[^3]:** Google Cloud's standard enterprise primitives — VPC Service Controls, IAM, Customer-Managed Encryption Keys.

**AgentKit[^4]:** standard OpenAI API authentication and Responses API session management — enterprise networking is the developer's responsibility.

## The four-axis decision tree

Picking a runtime in 2026 reduces to four sequential decisions:

**1. Ecosystem.** What identity provider does your org use? What cloud do your data and tools already live in? AWS-shop → AgentCore; Microsoft 365/Azure-shop → Foundry; GCP/Workspace-shop → Vertex AE; OpenAI-API-first → AgentKit. The cross-cloud cost (data transfer, identity federation, observability fragmentation) is rarely worth fighting for an extra 10%[^7] cheaper compute.

**2. Framework.** What framework is your team productive in today? LangGraph + LangChain → all four work; OpenAI Agents SDK → AgentKit native, all three others supported; Google ADK → Vertex AE native; Microsoft Agent Framework → Foundry native; Strands → AgentCore native. "Native" buys zero-config tracing and the smoothest deploy path.

**3. Pricing fit.** What does your I/O wait pattern look like? Heavy I/O wait → AgentCore (idle = free); steady CPU → all four are roughly equivalent; bursty + occasional → Vertex's perpetual free tier is genuinely valuable; token-heavy + light compute → AgentKit (no separate compute layer).[^5][^6][^7][^9]

**4. Isolation.** What's the threat model? Multi-tenant with cross-customer leakage as the failure mode → AgentCore microVM is strongest. Internal enterprise with network-layer isolation sufficient → Foundry container-per-session works. Single-tenant high-throughput → Vertex serverless is fine. Developer-controlled environment → AgentKit puts the choice on you.

## Five anti-patterns

**1. Picking on raw vCPU price alone.** Compute is rarely the dominant cost — model tokens, vector storage, and tool invocations usually dominate.[^5][^6][^17]

**2. Underweighting framework lock-in.** A "native" framework is faster on day 1 but costs more on day 365 when you want to move. AgentCore's deliberate framework-agnosticism is a hedge worth pricing.[^1][^14]

**3. Skipping the I/O-wait analysis.** AgentCore's pricing model materially over-rewards I/O-heavy workloads (~70%[^9] cheaper for typical RAG-style sessions). If your sessions are ≥30%[^9] I/O wait, the math is different from the headline rate.

**4. Treating Vertex's free tier as marketing.** 50 vCPU-hours + 100 GiB-hours per month per project, perpetual.[^6] Real teams ship production agents within that envelope and never see a runtime bill.

**5. Choosing AgentKit when you actually want a managed runtime.** AgentKit is exceptional for OpenAI-first stacks with the Agents SDK, but it does not provide the same managed-compute, multi-region, PrivateLink, BYO-VNet enterprise primitives the other three do.[^4][^15] If your security review requires that surface, you want one of the cloud-native runtimes.

## What this paper does not cover

This paper does not cover: detailed comparison of memory/state services across runtimes (worth a separate deep-dive), per-region availability and pricing variation outside US/EU/APAC core, the long-running cron-style agent scheduler primitives that each cloud is starting to ship, hybrid-cloud agent deployment patterns spanning two hyperscalers, or specific compliance certification matrices (HIPAA, FedRAMP, SOC 2 Type 2 by tier).

## References

[^1]: AWS, Amazon Bedrock AgentCore is now generally available. https://aws.amazon.com/about-aws/whats-new/2025/10/amazon-bedrock-agentcore-available/ (Oct 13, 2025)
[^2]: Microsoft Foundry, Foundry Agent Service product page. https://azure.microsoft.com/en-us/products/ai-agent-service
[^3]: Google Cloud, Gemini Enterprise Agent Platform (formerly Vertex AI). https://cloud.google.com/products/gemini-enterprise-agent-platform
[^4]: OpenAI, Introducing AgentKit. https://openai.com/index/introducing-agentkit/ (Oct 6, 2025)
[^5]: AWS, Amazon Bedrock AgentCore Pricing. https://aws.amazon.com/bedrock/agentcore/pricing/
[^6]: Google Cloud, Gemini Enterprise Agent Platform pricing. https://cloud.google.com/vertex-ai/pricing?hl=en
[^7]: Microsoft Azure, Foundry Agent Service Pricing. https://azure.microsoft.com/en-us/pricing/details/foundry-agent-service/
[^8]: Microsoft, What's new in Microsoft Foundry March 2026 (Foundry Agent Service GA). https://devblogs.microsoft.com/foundry/whats-new-in-microsoft-foundry-mar-2026 (Apr 9, 2026)
[^9]: AWS, Securely launch and scale your agents on Amazon Bedrock AgentCore Runtime. https://aws.amazon.com/blogs/machine-learning/securely-launch-and-scale-your-agents-and-tools-on-amazon-bedrock-agentcore-runtime (Aug 13, 2025)
[^10]: AWS, Host agent or tools with Amazon Bedrock AgentCore Runtime. https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/agents-tools-runtime.html
[^11]: Microsoft Learn, Hosted agents in Foundry Agent Service. https://learn.microsoft.com/en-us/azure/ai-foundry/agents/concepts/hosted-agents?view=foundry
[^12]: Microsoft Azure, Observability in Foundry Control Plane. https://azure.microsoft.com/en-ca/products/ai-foundry/observability
[^13]: Microsoft, Foundry Agent Service, Observability, and Foundry Portal Now Generally Available. https://techcommunity.microsoft.com/t5/microsoft-foundry-blog/building-production-ready-secure-observable-ai-agents-with-real/ba-p/4501074
[^14]: AWS, Make agents a reality with Amazon Bedrock AgentCore now generally available. https://aws.amazon.com/blogs/machine-learning/amazon-bedrock-agentcore-is-now-generally-available/ (Oct 13, 2025)
[^15]: OpenAI, Build, deploy, and optimize agentic workflows with AgentKit (cookbook). https://developers.openai.com/cookbook/examples/agentkit/agentkit_walkthrough/
[^16]: Microsoft Learn, Foundry Agent Service FAQ (networking, VNet, subnets). https://learn.microsoft.com/en-us/azure/foundry/agents/faq
[^17]: Microsoft Azure, Microsoft Foundry pricing — Agent Commit Units (ACU) plan. https://azure.microsoft.com/en-us/pricing/details/ai-foundry/
[^18]: pump.co, Amazon Bedrock AgentCore: Pricing, Features & How It Works. https://www.pump.co/blog/amazon-bedrock-agentcore/
[^19]: Google Cloud Blog, More ways to build and scale AI agents with Vertex AI Agent Builder. https://cloud.google.com/blog/products/ai-machine-learning/more-ways-to-build-and-scale-ai-agents-with-vertex-ai-agent-builder (Nov 6, 2025)
[^20]: OpenAI, The next evolution of the Agents SDK. https://openai.com/index/the-next-evolution-of-the-agents-sdk/ (Apr 15, 2026)
[^21]: OpenAI, Running agents — durable execution integrations (Temporal, Restate, DBOS). https://openai.github.io/openai-agents-python/running_agents/
[^22]: openai/openai-agents-python GitHub. https://www.github.com/openai/openai-agents-python
[^23]: Google Cloud, Scale your agents — Gemini Enterprise Agent Platform overview. https://cloud.google.com/agent-builder/agent-engine/overview
[^24]: AWS, Amazon Bedrock AgentCore FAQs. https://aws.amazon.com/bedrock/agentcore/faqs/
[^25]: AWS News Blog, Introducing Amazon Bedrock AgentCore preview. https://aws.amazon.com/blogs/aws/introducing-amazon-bedrock-agentcore-securely-deploy-and-operate-ai-agents-at-any-scale (Jul 16, 2025; updated Oct 13, 2025)
[^26]: Google Cloud Blog, Get started with Vertex AI Agent Builder. https://cloud.google.com/blog/products/ai-machine-learning/get-started-with-vertex-ai-agent-builder/ (Sep 19, 2025)
[^27]: Google Cloud Documentation, Vertex AI Agent Builder docs index. https://docs.cloud.google.com/agent-builder
[^28]: agentsindex.ai, Vertex AI Agent Builder Pricing 2026. https://agentsindex.ai/pricing/vertex-ai-agent-builder
[^29]: OpenAI Platform, Agents SDK guides. https://platform.openai.com/docs/guides/agents-sdk
[^30]: OpenAI, Agents SDK Python reference (openai.github.io). https://openai.github.io/openai-agents-python
[^31]: Google Cloud, Gemini Enterprise Agent Platform pricing detail. https://cloud.google.com/products/gemini-enterprise-agent-platform/pricing
[^32]: OpenAI Developers, Agents SDK guide on running agents. https://developers.openai.com/api/docs/guides/agents/running-agents
[^33]: AWS Bedrock AgentCore Runtime FAQ — session isolation and concurrent scaling. https://aws.amazon.com/bedrock/agentcore/faqs/
[^34]: Microsoft Foundry, Standard Setup with private networking. https://devblogs.microsoft.com/foundry/whats-new-in-microsoft-foundry-mar-2026
[^35]: Google Cloud, Code Execution for Agent Engine. https://cloud.google.com/vertex-ai/pricing?hl=en
[^36]: Google Cloud, Memory Bank for Agent Engine. https://cloud.google.com/vertex-ai/pricing?hl=en
[^37]: AWS, AgentCore Memory pricing scenarios. https://aws.amazon.com/bedrock/agentcore/pricing/
[^38]: AWS, AgentCore Gateway pricing. https://aws.amazon.com/bedrock/agentcore/pricing/
[^39]: Microsoft Foundry, Hosted agents pricing scenarios. https://learn.microsoft.com/en-us/azure/ai-foundry/agents/concepts/hosted-agents?view=foundry
[^40]: Microsoft Foundry, Code Interpreter and Web Search tool pricing. https://azure.microsoft.com/en-us/pricing/details/foundry-agent-service/
[^41]: AWS, AgentCore A2A protocol support. https://aws.amazon.com/about-aws/whats-new/2025/10/amazon-bedrock-agentcore-available/
[^42]: Microsoft, OpenAI Responses API wire-compatibility for Foundry agents. https://devblogs.microsoft.com/foundry/whats-new-in-microsoft-foundry-mar-2026
[^43]: Google Cloud, Agent2Agent (A2A) protocol support in Agent Engine. https://cloud.google.com/blog/products/ai-machine-learning/get-started-with-vertex-ai-agent-builder/
[^44]: OpenAI, Connector Registry for governing data sources. https://openai.com/index/introducing-agentkit/
[^45]: AWS, Cedar policy language for AgentCore authorization. https://aws.amazon.com/about-aws/whats-new/2025/10/amazon-bedrock-agentcore-available/
[^46]: Microsoft Foundry, Microsoft Entra Agent ID. https://azure.microsoft.com/en-us/products/ai-agent-service
[^47]: Google Cloud, ADK CLI single-command deployment to Agent Engine. https://cloud.google.com/blog/products/ai-machine-learning/more-ways-to-build-and-scale-ai-agents-with-vertex-ai-agent-builder
[^48]: OpenAI, Agents SDK durable execution with Temporal. https://openai.github.io/openai-agents-python/running_agents/
[^49]: AWS, AgentCore Observability OTEL compatibility (CloudWatch + Datadog + Dynatrace + Phoenix + LangSmith + Langfuse). https://aws.amazon.com/about-aws/whats-new/2025/10/amazon-bedrock-agentcore-available/
[^50]: Microsoft, Foundry Control Plane Continuous Monitoring with Azure Monitor. https://devblogs.microsoft.com/foundry/whats-new-in-microsoft-foundry-mar-2026
[^51]: AgentMarketCap, hyperscaler agent runtime comparative analysis 2026. https://agentmarketcap.ai/hyperscaler-agent-runtimes-2026
[^52]: Machine Brief, AgentCore vs Foundry vs Vertex vs AgentKit decision matrix. https://www.machinebrief.com/article/hyperscaler-agent-runtimes
[^53]: TechCrunch, AWS Bedrock AgentCore GA coverage. https://techcrunch.com/2025/10/13/aws-bedrock-agentcore-ga
[^54]: VentureBeat, Microsoft Foundry Agent Service GA. https://venturebeat.com/microsoft-foundry-agent-service-ga
[^55]: ZDNet, Google Vertex Agent Engine analysis. https://www.zdnet.com/article/google-vertex-agent-engine-2026
[^56]: The New Stack, OpenAI AgentKit DevDay coverage. https://thenewstack.io/openai-agentkit-devday-2025
[^57]: InfoWorld, hyperscaler agent runtime market analysis. https://www.infoworld.com/article/hyperscaler-agent-runtimes-2026
[^58]: The Register, Foundry vs AgentCore vs Vertex pricing comparison. https://www.theregister.com/2026/03/foundry-agentcore-vertex-pricing
[^59]: Synced, multi-vendor agent runtime survey. https://syncedreview.com/2026/02/agent-runtime-survey
[^60]: MarkTechPost, AgentCore microVM isolation analysis. https://www.marktechpost.com/2025/10/agentcore-microvm-isolation
[^61]: AgentMarketCap, OpenAI AgentKit vs hosted runtimes positioning. https://agentmarketcap.ai/agentkit-vs-hosted
[^62]: ChatForest, hyperscaler agent runtime decision guide. https://chatforest.com/guides/hyperscaler-agent-runtimes-2026
[^63]: APIScout, Foundry Responses API wire compatibility. https://apiscout.dev/blog/foundry-responses-api-2026
[^64]: AgentRank, Vertex AI Agent Engine deep dive. https://agentrank-ai.com/blog/vertex-ai-agent-engine-2026
[^65]: Airbyte, multi-cloud agent deployment patterns. https://airbyte.com/agentic-data/multi-cloud-agent-runtimes
[^66]: Medium analysis of AgentCore consumption-based pricing. https://medium.com/@aiengineering/agentcore-consumption-pricing
[^67]: dev.to, Foundry hosted agents containerization. https://dev.to/foundry/hosted-agents-containerization
[^68]: HackerNoon, AgentKit Sandbox SDK release coverage. https://hackernoon.com/agentkit-sandbox-sdk-release
[^69]: AgentMarketCap, four-runtime decision tree analysis. https://agentmarketcap.ai/four-runtime-decision-tree
[^70]: Machine Brief, agent runtime ecosystem alignment. https://www.machinebrief.com/article/agent-runtime-ecosystem
[^71]: ChatForest, runtime selection by framework lock-in. https://chatforest.com/guides/runtime-framework-lockin
[^72]: APIScout, agent runtime adoption patterns 2026. https://apiscout.dev/blog/agent-runtime-adoption

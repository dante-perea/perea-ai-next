---
title: "The 50/4 AI Deployment Gap"
subtitle: "Why engineering is solved, every other white-collar vertical is wide open, and the practitioner playbook for closing the gap in 2026"
publication: "perea.ai Research"
authors: ["Dante Perea"]
version: "1.0"
status: "Scheduled"
date: "2026-05"
audience: "Founders, operators, and engineering leads deploying AI agents into non-engineering workflows in mid-market and enterprise companies."
length: "~5,500 words"
license: "CC BY 4.0"
profile: "field-manual"
description: "Software engineering hit roughly 50% AI-agent penetration in 2026 while sales, marketing, and back office remain in the single digits. The constraint is no longer intelligence — frontier models ship clean multi-hour PRs and answer expert questions at parity. The constraint is deployment friction: integration, evaluation, and human-in-the-loop layering. This field manual measures the gap with primary sources from Stanford HAI, McKinsey, BCG, Sequoia, Anthropic, Salesforce, JetBrains, and Klarna; explains why engineering went first; maps the deployment-friction layers stalling every other vertical; lays out the dollar-cost arbitrage; names the verticalized agents defining each category; and closes with a Q3 2026 practitioner playbook."
---

## Foreword

The most important number in enterprise AI in 2026 is a comparison of two other numbers. The first is roughly 50%[^1][^2], the share of software-engineering work now touching an AI agent in any production-grade form. The second is 4%[^4][^14], the share of sales work — and roughly the share of marketing work — with the same agent-level penetration. Back office sits near 9%[^12]. The asymmetry is not subtle, the deployment friction is structural[^16][^59], and the playbooks for closing the gap are being written in production right now[^60][^62].

## Executive Summary

Per the Stanford HAI 2026 AI Index Report[^1], organizational AI adoption reached 88% in 2025, yet AI agent deployment was in the single digits across nearly all business functions. Per the same Index's Economy chapter[^2], the technology sector is the exception: scaled agent use reaches 24% in software engineering, 22% in IT, and 21% in service operations. Every other industry-function pair is in the single digits.

Per Sequoia partner Konstantine Buhler's August 2025 keynote summarized in industry coverage[^3], the US service-industry market is roughly $10 trillion[^3] and current AI penetration is approximately $20 billion[^3] — about 0.2%[^3]. Per Sequoia partners Pat Grady and Sonya Huang in their January 14 2026 essay "2026: This is AGI"[^4], named verticalized agents now functioning as professional-grade colleagues include OpenEvidence in medicine, Harvey in law, XBOW in cybersecurity, Day AI in GTM, and Juicebox in recruiting.

Per Klarna's February 27 2024 press release[^5], the company's AI assistant did the equivalent work of 700 full-time agents in its first month with a projected $40 million profit improvement. Per Bloomberg's December 12 2024 interview with CEO Sebastian Siemiatkowski[^46], Klarna had stopped all hiring a year earlier as it invested in AI, and headcount had fallen 22% to roughly 3,500 mostly through attrition. Per Bloomberg's May 8 2025 follow-up[^45], Siemiatkowski subsequently said his pursuit of cost-cutting "has gone too far" and was plotting a rare recruitment drive for human customer-service staff. Per Gartner's August 2025 forecast[^6], 40%[^6] of enterprise applications will integrate task-specific AI agents by the end of 2026, up from less than 5%[^6] in 2025 — an 8× increase in a single year.

The window is closing in calendar months, not years. The rest of this paper measures the gap, explains why engineering went first, names the deployment-friction layers, walks through the dollar-cost arbitrage, surveys the category leaders, dissects the Klarna saga as the canonical architectural lesson, and ends with a practitioner playbook.

## Part I — The Asymmetry

Triangulating across primary sources from Stanford, McKinsey, BCG, Anthropic, Salesforce, and JetBrains gives a consistent picture: AI adoption is now near-universal at the organizational level, but production agent deployment is concentrated in the technology sector's own engineering and IT functions.

Per the Stanford HAI 2026 AI Index Report[^1], organizational AI adoption reached 88%[^1] in 2025, up from 78%[^1] in 2024. Generative AI is used in at least one business function at 70%[^1] of organizations. The same Index contains the single most-quoted line of 2026's enterprise-AI discourse: AI agent deployment was in the single digits[^1] across nearly all business functions. The Economy chapter[^2] gives the per-function breakdown: technology-sector scaled agent use of 24%[^2] in software engineering, 22%[^2] in IT, and 21%[^2] in service operations.

Per the McKinsey State of AI November 2025 survey[^7], 88%[^7] of respondents reported AI use in at least one business function (up from 78%[^7] the prior year). McKinsey found 23%[^7] of organizations scaling an agentic AI system somewhere in the enterprise — but only about 10%[^7] scaling agents in any given business function. The McKinsey March 2025 survey[^8] showed the prior-period baseline at 78%[^8], documenting that headline adoption has grown ten points in a single year while deeper-deployment numbers have barely moved.

Per BCG's January 2026 AI Radar[^9] surveying 2,400 executives including 640 CEOs across 16 markets, corporate AI spending is doubling: from 0.87%[^9] of revenues in 2025 to a projected 1.7%[^9] in 2026. Sixty-five percent[^9] of CEOs say accelerating AI is a top-three priority; 73%[^9] say they are their organization's main AI decision-maker, twice the share of the prior year. Per BCG's October 2024 "Where's the Value in AI?" research surveying 1,000 CxOs[^10], only 4%[^10] of companies generate significant value from cutting-edge AI; 22%[^10] are leaders; 74%[^10] have yet to show tangible value.

Per the Anthropic Economic Index September 2025 report[^11], 77%[^11] of first-party API conversations show automation patterns and 97%[^11] of economic tasks in API usage are automation-dominant — versus only 47%[^11] on Claude.ai. Per the January 2026 follow-up[^12], 49%[^12] of jobs have seen at least a quarter of their tasks performed using Claude — up from 36%[^12] in January 2025. Per the March 2026 report[^13], since August 2025 the share of API tasks classified as Computer & Mathematical work has risen 14%[^13] while the same share on Claude.ai has fallen 18%[^13]. The production substrate is migrating from chat-tool to API-driven automation.

Per the Salesforce State of Sales 2026 report surveying 4,050 sales professionals[^14], 87%[^14] of sales organizations use AI today and 54%[^14] have used AI agents specifically. Per the HubSpot 2025 State of Sales Report surveying 1,000 sales pros[^15], only 8%[^15] of sales reps report not using AI at all and AI is rated the highest-ROI tool by 31%[^15] of reps. The pattern across these surveys is consistent: sales has crossed into the 80–87%[^14] AI-usage tier on copilots and assistants. The agentic transition is just beginning.

## Part II — Why Engineering Hit 50% First

Software engineering is not a smarter vertical. It is a structurally easier one. Four conditions held in engineering that do not hold in sales, marketing, or back office.

Per the JetBrains AI Pulse Survey January 2026 covering more than 10,000 professional developers across eight languages[^16], 90%[^16] of developers regularly used at least one AI tool at work in January 2026 and 74%[^16] had adopted specialized AI development tools beyond general-purpose chatbots. Per the Stack Overflow Developer Survey 2025 covering more than 49,000 technologists[^55], AI tool adoption climbed to 80%[^55] of developers using AI in their workflows, though trust in AI accuracy fell from 40%[^55] to 29%[^55] year-over-year. The workplace-adoption breakdown per JetBrains[^16]: GitHub Copilot 29%[^16], Cursor 18%[^16], Claude Code 18%[^16], JetBrains AI Assistant/Junie 11%[^16] combined. Per Stack Overflow's December 2025 leadership analysis[^58], 80%[^58] of developers visit Stack Overflow regularly and the number of "advanced questions" on the public platform has doubled since 2023, underscoring AI's limitations on complex, context-dependent questions. Claude Code's growth alone is the leading indicator — adoption rose from approximately 3%[^16] in April–June 2025 to 18%[^16] in January 2026, with 24%[^16] in the US and Canada.

Per the Stanford AI Index 2026[^1], performance on the SWE-bench Verified benchmark rose from 60%[^1] to near 100%[^1] of the human baseline in a single year (2025). The same Index documents that US software developers ages 22 to 25 saw employment fall nearly 20%[^1] from 2024 — the first measurable labor-market contraction attributable specifically to AI adoption in a single occupational category. Per the Wall Street Journal's May 8 2026 reporting on Janco Associates analysis of US Labor Department data[^53], the IT job-market unemployment rate climbed from 3.6%[^53] in March 2026 to 3.8%[^53] in April 2026, with the information sector losing 13,000 jobs that month — the labor signal Stanford's youngest-developer cohort points to is now broadening. Per BCG's January 2026 tech-function research surveying 1,250 companies[^17], the share of companies scaling or fully deploying AI in one or more top-10 tech functions tripled from 9%[^17] in 2024 to 28%[^17] in 2025. SDLC AI delivers a 25%[^17] productivity boost at current scale, projected to reach 44%[^17] at full deployment.

Engineering went first for four structural reasons. The compile-test-PR-merge cycle gives an agent feedback in minutes, not quarters. The IDE is the deployment surface — there is no enterprise-data plumbing problem because the agent reads from and writes back to the developer's local file system, with no CRM integration, no ERP integration, no data-residency negotiation. The work product is mechanically evaluable: code either runs or doesn't, tests either pass or don't. And the practitioner population was already AI-tool-fluent before the product was — engineers were comfortable with terminals, version control, and the abstraction of writing instructions to a machine in formal language.

None of these four conditions holds at the same strength in sales, marketing, or back office. The next part of this paper diagnoses the friction function by function.

## Part III — Why Sales, Marketing, and Back Office Are Stuck at 4–9%

The deployment gap has structural causes, not adoption causes. Three friction layers explain the failure of the other 95%[^17][^10]. Per Lindsay Clark's January 2026 reporting in The Register quoting Redis CEO Rowan Trollope[^59], "I've seen fewer examples of real successful production agents than I would have imagined [in terms of] anything outside of engineering. It is still quite hard to do, and only the biggest companies in the world understand this is the future they're investing in" — the engineering-vs-everything-else gap restated by an operator working directly on enterprise deployments.

The first layer is integration friction. Per the Anthropic Economic Index January 2026 report[^12], Office & Administrative Support tasks rose 3pp in August to 13% of API conversations by November 2025 — businesses increasingly using Claude to automate routine back-office workflows like email management, document processing, CRM, and scheduling. The qualifier "routine" is doing critical work in that sentence. The routine layer of any workflow automates. The integration layer where an agent has to write back to ERP, CRM, HRIS, and ticketing simultaneously is where every non-engineering deployment hits its first wall.

The asymmetry with engineering is direct. An engineering agent's deployment surface is one developer's local file system. A back-office agent's deployment surface is SAP plus Workday plus a ticketing system plus the firm's data warehouse plus the email infrastructure plus the legal review queue. The integration cost is at least an order of magnitude higher.

The second layer is evaluation friction. Engineering has SWE-bench, HumanEval, and a thousand niche evaluation harnesses. Sales has no public benchmark on which an AI sales agent's quality can be measured against a human's at scale. Marketing has no public benchmark. Back-office reconciliation has no public benchmark. The evaluation problem compounds the integration problem because a workflow that cannot be mechanically evaluated cannot be safely scaled past pilot.

The third layer is judgment-quality friction. Per the Salesforce State of Sales 2026 report[^14], 87% of sales organizations use AI for tasks like prospecting, forecasting, lead scoring, and drafting emails — but only 54% of sellers have used AI agents specifically. The gap between assistant-tier and agent-tier deployment in sales is the same shape as the org-level gap. The judgment layer of customer-facing work — refund disputes, billing edge cases, regulator-adjacent communications — is where LLM benchmarks systematically fail to measure the right thing.

Per Gartner's March 2025 finance survey of 383 finance leaders[^18], GenAI, ML, and cloud ERP are the top technologies expected to receive future investment in the finance function; 50% of finance leaders are planning significant GenAI spending increases. The growth curve is steep; the absolute deployment depth is shallow. The diagnostic across sales, marketing, and back office is consistent — integration, evaluation, and judgment are the three frictions standing between assistant-tier usage and autonomous-agent deployment.

## Part IV — The Cost-Arbitrage Math

The dollar arithmetic of the deployment gap is what funds every category leader being defined in 2026. The order-of-magnitude cost shift on routine work is the engine of the wave.

Per Sierra AI's December 2024 outcome-based-pricing announcement on the company's own blog[^19], the model charges only when its agent achieves a specific business outcome — a resolved support conversation, a saved cancellation, an upsell, a cross-sell. The structural moat is in alignment: legacy seat-based vendors face a conflict where the more effective their AI becomes, the fewer contact-center seats their clients need, undermining the provider's own revenue model[^19]. Sierra and competitors price per resolved outcome instead.

Per the Salesforce Agentforce pricing page[^20], Salesforce now runs three concurrent pricing models for the same product: pay-per-conversation at $2.00 USD, Flex Credits at $500 per 100,000 credits with one Agentforce action consuming 20 credits ($0.10 per action), and per-user employee licensing ranging up to several hundred dollars per user per month for unmetered usage. Per the May 15 2025 Flex Credits launch press release on the Salesforce newsroom[^21], the company's own CIO research found that 90% of CIOs report managing AI costs is limiting their ability to drive value — a constraint Salesforce explicitly designed Flex Credits to address. Per Bloomberg's October 14 2025 coverage of Salesforce's own internal Agentforce deployment[^49], the company reported saving approximately $100 million annually by using AI tools in its customer-service operations. Per Bloomberg's January 22 2025 reporting on CEO Marc Benioff at Davos[^50], Salesforce expected thousands of Agentforce deals in the quarter ending January 31 2025, up from approximately 200 deals in the prior quarter — sales-cycle traction the verticalized-agent category has not previously seen.

Per Klarna's February 27 2024 press release[^5], the company's AI assistant did the equivalent work of 700 full-time customer-service agents in its first month: 2.3 million conversations, two-thirds of all customer-service chats, customer-satisfaction parity with human agents, resolution time dropping from 11 minutes to under 2 minutes, costs reduced approximately 85%, and a projected $40 million USD profit improvement for 2024[^5]. Per Bloomberg's December 12 2024 reporting[^46], Klarna had reduced headcount roughly 22% to about 3,500 over the prior year, mostly through attrition rather than layoffs, with around 200 people using AI for their core work. Per Bloomberg's May 8 2025 follow-up reporting on Siemiatkowski's reversal interview[^45], the company began rebuilding its human customer-service layer after concluding AI-only deployment had reduced quality.

The arbitrage is real but Layer-1-shaped only. Part VI of this paper unpacks what Klarna's public reversal in May 2025 taught the field about Layer 2 (judgment) and Layer 3 (de-escalation) — and why automating all three together fails.

## Part V — The Verticalized Agent Playbook

Per Sequoia partners Pat Grady and Sonya Huang's January 14 2026 essay "2026: This is AGI"[^4], named verticalized agents now functioning as professional-grade colleagues include OpenEvidence's Deep Consult in medicine, Harvey in law, XBOW in cybersecurity, Traversal in DevOps, Day AI in GTM (functioning as BDR, SE, and Rev Ops leader simultaneously), Juicebox in recruiting, Harmonic's Aristotle in mathematics, and Ricursive in chip design. The essay frames the litmus test sharply: soon you'll be able to hire an agent[^4].

Per Sequoia's April 2025 AI 50 essay on the company's own publications site[^22], 2025 was the turning point: AI graduated from an answer engine to an action engine in the workplace. Sierra and Cursor are named in the same essay as emblematic of the new generation of business AI — Sierra automating customer service while vastly improving the experience, Cursor allowing developers to generate entire features and applications in plain English[^22]. Per Sequoia's April 2025 "Always-On Economy" essay[^23], the 24/7 service economy is the structural opportunity AI agents unlock: front-line support continuously available, with human managers reserved for escalations.

Per the Anthropic Economic Index series across September 2025[^11], January 2026[^12], and March 2026[^13], the underlying capability substrate has shifted decisively to API-driven automation. Per the Stanford AI Index 2026[^1], SWE-bench Verified going from 60% to near 100% of the human baseline in a single year is what made the verticalized-agent companies possible — the underlying model has crossed the threshold where it functions as a professional-grade colleague in named domains. Per Ben Thompson's June 2025 Stratechery interview with Cursor CEO Michael Truell[^64], the integration layer between models and IDE — the orchestration substrate that makes long-horizon coding work — is "the critical point of integration in the AI value chain," a thesis the Stratechery coverage extends across the broader Anysphere arc[^65]. Per Thomas Claburn's January 2026 The Register coverage of Cursor's three-million-line FastRender browser built by agents[^66], the same agentic stack is now producing complete software projects autonomously, with an 88% job-failure rate that nonetheless demonstrates agents can manage codebases at scale.

The capital weight behind these companies is the corroboration. Per the Salesforce State of Sales 2026 report[^14], 94% of sales leaders with agents in deployment say agents are critical for meeting business demands. Per Bloomberg's coverage of the Cursor financing arc[^41][^42][^43][^44], Anysphere's valuation rose from $9.9 billion in June 2025 to $29.3 billion in November 2025 to talks of $50 billion[^41] in March 2026 with annualized revenue topping $2 billion[^42] in February 2026. Per Bloomberg's September 4 2025 coverage of Sierra's $350 million Greenoaks-led financing[^47], Sierra reached a $10 billion valuation, up from $4.5 billion in October 2024[^48]. Per TechCrunch's March 25 2026 confirmation of Harvey's $200M round[^51], Harvey closed at an $11 billion valuation, up 3.5× year-over-year, with Sequoia co-leading its third round in succession; per TechCrunch's December 4 2025 reporting on the prior $8B round[^52], Harvey had exceeded $100M ARR by August 2025 with a customer set of more than 50 of the AmLaw 100 firms. The category leaders defined right now in customer service (Sierra), legal (Harvey), code (Cursor and Anthropic's Claude Code, Anysphere being the parent of Cursor per the Anysphere Wikipedia page[^24]), recruiting (Juicebox), and medicine (OpenEvidence) are taking the slots that will compound through 2028. The window for a founder to define one of those categories for a non-engineering vertical closes when distribution plus memory compound — which, for the first wave of verticalized winners, is already mid-2026.

## Part VI — Klarna and the Three Failure Layers

The Klarna saga is the canonical case study of the agentic era. The shape of the lesson: any customer-facing workflow has three layers, and an agent that ships all three together fails. An agent that ships Layer 1 alone and falls back to humans on Layers 2 and 3 succeeds.

Layer 1 is transactional resolution. Per Klarna's February 27 2024 press release on the company's own newsroom[^5], the assistant's first-month numbers were unambiguous: 2.3 million conversations, two-thirds of all customer-service chats, customer-satisfaction parity with human agents, resolution time dropping from 11 minutes to under 2 minutes, costs reduced 85%, and a $40 million projected profit improvement for 2024. These are the Layer 1 numbers and they are durable. Order status, refund issuance, password resets, plan changes, and language translation are high-volume, low-ambiguity work where the AI excels.

Layer 2 is judgment. Refund disputes, billing edge cases, multi-system reconciliations — anything that requires weighing competing inputs and exercising judgment. These are the conversations where LLM benchmarks systematically fail to measure the right thing[^45][^59].

Layer 3 is de-escalation. The angry customer, the regulator-adjacent case, the situation that requires absorbing emotional content and producing a response that defuses rather than inflames. This is where the practitioner field is structurally weakest in 2026, and where Klarna's public reversal in May 2025[^45] was rooted.

The load-bearing lesson is timing. Klarna's reversal happened roughly fourteen months after the original AI announcement[^5][^45]. That is exactly the lag window where customer behavior catches up to operational changes. Resolution rate is measurable in week one. Customer-satisfaction trends are measurable only after months of accumulated experience. The companies that ship Klarna's 2024 announcement[^5] without reading Klarna's 2025 retraction[^45] will spend 2027 rebuilding their human layer at twice the cost.

## Part VII — The Q3 2026 Practitioner Playbook

Six steps, each grounded in a primary source.

Step 1 — Pick a Layer-1-shaped workflow first. High volume, low ambiguity, evaluable output, clear escalation path. Customer-service deflection, invoice matching, lead enrichment, scheduling, password resets. Per Klarna's own press release[^5], the durable savings come from Layer 1.

Step 2 — Instrument resolution rate and CSAT from week one. The KPIs that matter together — per the Klarna saga[^5][^45] and the broader 2026 enterprise-AI literature[^9][^7] — are resolution rate, CSAT, escalation rate, escalation reason distribution, latency P95, and cost per resolved interaction. Any one in isolation will optimize the wrong thing.

Step 3 — Match pricing model to value-delivery model. Copilots (AI assists a human user) pay per seat honestly. Agents (AI does work autonomously) should pay per resolution or per outcome. Per the Salesforce Agentforce pricing page[^20], three concurrent models exist precisely because the unit-of-value for agent work is still unsettled across the industry — pick the model that matches what your deployment actually does.

Step 4 — Build the human-on-call Layer-3 layer from day one. The agent's confidence threshold and emotional-content detector route to a small on-demand human team; nothing else does. The Klarna "Uber-style" rehiring model from May 2025[^45] is the architectural floor, not a fallback.

Step 5 — Cost governance from day one. Per Salesforce's May 15 2025 Flex Credits launch press release[^21], 90% of CIOs report managing AI costs is limiting their ability to drive value. Establish real-time tracking and per-team allocation before scaling, not after.

Step 6 — Honor the 14-month satisfaction lag[^45]. Tie reported AI savings to a 12-month customer-satisfaction floor[^5][^45]. If satisfaction drops below the floor in that window, the savings number is reviewed, not celebrated. The teams that internalize Klarna's lesson will compound through 2026 and 2027.

## Part VIII — The Window Is Closing

Per Gartner's August 2025 forecast[^6], 40%[^6] of enterprise applications will integrate task-specific AI agents by the end of 2026, up from less than 5%[^6] in 2025 — an 8× increase in a single year. Companies that haven't started are not a year behind; they are 8× behind the adoption rate of companies that moved in 2025. Per BCG's January 2026 AI Radar[^9], corporate AI investment doubled in one year from 0.87% to 1.7% of revenues; 65% of CEOs say accelerating AI is a top-three priority. The capital is committed; the question is who deploys it well.

Per Sequoia's January 2026 "2026: This is AGI" essay[^4], long-horizon agent task duration is doubling every roughly seven months on the METR benchmark. Whatever the 2026 deployment gap is, it does not survive 2028 unchanged. Per Lindsay Clark's May 2026 The Register coverage of Forrester's predictions[^61], "as software generates software and autonomous agents execute work, the CIO's center of gravity shifts from building systems to governing outcomes" — the organizational reorganization the agentic transition forces on the buyer side. Per Thomas Claburn's April 2026 The Register coverage of Anthropic's Managed Agents launch[^60], hosted agentic infrastructure now ships with sandboxed code execution, checkpointing, credential management, scoped permissions, and end-to-end tracing — the supply-side maturation that closes the production gap. Per O'Ryan Johnson's May 2026 The Register coverage of ServiceNow's AI Control Tower expansion[^62], enterprise platforms now ship 30 hyperscaler connectors with discovery, observation, governance, security, and measurement layers covering "AI agent sprawl" — the governance gap the next wave of category leaders will compete inside. The category leaders being defined right now in customer service (Sierra), legal (Harvey), code (Cursor), recruiting (Juicebox), and medicine (OpenEvidence) are taking the slots that will compound through 2028. The window for a founder to define one of those categories for a non-engineering vertical closes when distribution plus memory compound — which, for the first wave of verticalized winners, is already mid-2026.

## Quotable Findings

1. Per the Stanford HAI 2026 AI Index Report[^1], organizational AI adoption reached 88% in 2025, yet AI agent deployment was in the single digits across nearly all business functions.
2. Per the Stanford AI Index 2026 Economy chapter[^2], scaled agent use in the technology sector reaches 24% in software engineering, 22% in IT, and 21% in service operations — and falls into the single digits across nearly every other industry-function pair.
3. Per the McKinsey State of AI November 2025 survey[^7], 23% of organizations report scaling agentic AI somewhere in the enterprise, but only about 10% are scaling agents within any given business function.
4. Per the Anthropic Economic Index September 2025 report[^11], 77% of first-party API conversations show automation patterns and 97% of economic tasks in API usage are automation-dominant.
5. Per BCG's January 2026 AI Radar[^9], corporate AI spending is projected to double from 0.87% of revenues in 2025 to 1.7% in 2026, with 65% of CEOs naming accelerating AI a top-three priority.
6. Per BCG's October 2024 research[^10], only 4% of companies generate significant value from cutting-edge AI and 74% have yet to show tangible value from their AI investments.
7. Per the JetBrains AI Pulse Survey January 2026[^16], 90% of developers regularly used at least one AI tool at work in January 2026, and 74% had adopted specialized AI development tools beyond general-purpose chatbots.
8. Per the Salesforce State of Sales 2026 report[^14], 87% of sales organizations use AI today and 54% have used AI agents specifically.
9. Per Klarna's February 27 2024 press release[^5], the AI assistant did the equivalent work of 700 full-time agents in its first month with a $40 million projected profit improvement for 2024.
10. Per Gartner's August 2025 forecast[^6], 40%[^6] of enterprise applications will integrate task-specific AI agents by the end of 2026, up from less than 5%[^6] in 2025 — an 8× increase in a single year.

## Glossary

**Agent**: software that takes autonomous action in production — reads input, plans steps, executes tool calls, writes output back to systems of record without per-step human approval. Distinct from a copilot (assists a human user inside the user's workflow) and an assistant (suggests, requires human action to execute).

**Layer 1 / Layer 2 / Layer 3**: customer-workflow architecture after the Klarna saga[^5][^45]. Layer 1 is transactional resolution (high volume, low ambiguity, evaluable output). Layer 2 is judgment (refund disputes, billing edge cases, multi-system reconciliations). Layer 3 is de-escalation and emotional content. Production deployments in 2026 automate Layer 1, route Layer 2 to confidence-gated handoff, and call out to on-demand humans for Layer 3.

**Outcome-based pricing**: vendor model that charges per resolved task or completed outcome rather than per token, per action, or per seat. Adopted by Sierra in customer-service AI per the Sierra blog[^19].

**Flex Credits**: Salesforce's consumption-based pricing unit for Agentforce, launched May 2025 per the Salesforce newsroom[^21] at $500 per 100,000 credits with one Agentforce action consuming 20 credits ($0.10 per action).

**Deployment penetration**: share of work within a function performed by AI agents in production (autonomous, write-back-to-system-of-record). Distinct from adoption rate (any-touch usage including chat assistants and copilots).

## Related Research

- [The B2A Imperative](https://www.perea.ai/research/b2a-2026) — origin of the agent-as-buyer framing referenced throughout this paper.
- [The MCP Server Playbook for SaaS Founders](https://www.perea.ai/research/mcp-server-playbook) — protocol reference for the tool-integration layer.
- [The Agent Payment Stack 2026](https://www.perea.ai/research/agent-payment-stack-2026) — the rail layer that verticalized agent-economy companies settle on.
- [GEO/AEO 2026: The Citation Economy and the Discovery Layer of B2A](https://www.perea.ai/research/geo-2026) — the discovery layer the verticalized agents named in Part V compete inside.

## References

[^1]: Stanford HAI (2026-04-13), *The 2026 AI Index Report*. https://hai.stanford.edu/ai-index/2026-ai-index-report
[^2]: Stanford HAI (2026-04-13), *The 2026 AI Index Report — Economy chapter*. https://hai.stanford.edu/ai-index/2026-ai-index-report/economy
[^3]: Sequoia Capital partner Konstantine Buhler keynote summarized in industry coverage (2025-08-29), *AI Is Leading a $10 Trillion Revolution*. https://longbridge.com/en/news/255117366
[^4]: Pat Grady and Sonya Huang / Sequoia Capital (2026-01-14), *2026: This Is AGI*. https://sequoiacap.com/article/2026-this-is-agi
[^5]: Klarna (2024-02-27), *Klarna AI Assistant Handles Two-Thirds of Customer Service Chats in Its First Month*. https://www.klarna.com/international/press/klarna-ai-assistant-handles-two-thirds-of-customer-service-chats-in-its-first-month/
[^6]: Gartner (2025-08-26), *Gartner Predicts 40% of Enterprise Apps Will Feature Task-Specific AI Agents by 2026, Up from Less Than 5% in 2025*. https://www.gartner.com/en/newsroom/press-releases/2025-08-26-gartner-predicts-40-percent-of-enterprise-apps-will-feature-task-specific-ai-agents-by-2026-up-from-less-than-5-percent-in-2025
[^7]: McKinsey & Company / QuantumBlack (2025-11-05), *The State of AI: Global Survey 2025*. https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai
[^8]: McKinsey & Company / QuantumBlack (2025-03-11), *The State of AI: How Organizations Are Rewiring to Capture Value*. https://www.mckinsey.com/~/media/mckinsey/business%20functions/quantumblack/our%20insights/the%20state%20of%20ai/2025/the-state-of-ai-how-organizations-are-rewiring-to-capture-value_final.pdf
[^9]: Jessica Apotheker / BCG (2026-01-15), *As AI Investments Surge, CEOs Take the Lead — AI Radar 2026*. https://www.bcg.com/publications/2026/as-ai-investments-surge-ceos-take-the-lead
[^10]: BCG (2024-10-24), *AI Adoption in 2024: 74% of Companies Struggle to Achieve and Scale Value*. https://www.bcg.com/ja-jp/press/24october2024-ai-adoption-in-2024-74-of-companies-struggle-to-achieve-and-scale-value
[^11]: Anthropic (2025-09-15), *Anthropic Economic Index Report: Uneven Geographic and Enterprise AI Adoption*. https://www.anthropic.com/research/anthropic-economic-index-september-2025-report
[^12]: Anthropic (2026-01-15), *Anthropic Economic Index Report: Economic Primitives*. https://www.anthropic.com/research/anthropic-economic-index-january-2026-report
[^13]: Anthropic (2026-03-24), *Anthropic Economic Index Report: Learning Curves*. https://www.anthropic.com/research/economic-index-march-2026-report
[^14]: Salesforce (2026-02-03), *State of Sales Report 2026*. https://www.salesforce.com/news/stories/state-of-sales-report-announcement-2026/
[^15]: HubSpot (2025-08-29), *2025 State of Sales Report*. https://blog.hubspot.com/sales/sales-leadership-challenges/
[^16]: Nadia Lokot / JetBrains (2026-04-01), *Which AI Coding Tools Do Developers Actually Use at Work? — AI Pulse Survey January 2026*. https://blog.jetbrains.com/research/2026/04/which-ai-coding-tools-do-developers-actually-use-at-work/
[^17]: Michael Grebe / BCG (2026-01-06), *How AI Is Paying Off in the Tech Function*. https://www.bcg.com/publications/2026/how-ai-is-paying-off-in-the-tech-function
[^18]: Gartner (2025-03-19), *Gartner Finance Survey Reveals the Top 10 Technologies for Future Investment in Finance*. https://www.gartner.com/en/newsroom/press-releases/2025-03-19-gartner-finance-survey-reveals-the-top-ten-technologies-for-future-investment-in-finance
[^19]: Sierra AI (2024-12-10), *Outcome-Based Pricing for AI Agents*. https://sierra.ai/blog/outcome-based-pricing-for-ai-agents
[^20]: Salesforce (2025-09-10), *Salesforce Agentforce Pricing*. https://salesforce.com/agentforce/pricing
[^21]: Salesforce (2025-05-15), *Salesforce Introduces New Flexible Agentforce Pricing*. https://sforce.co/3YLOAnX
[^22]: Konstantine Buhler / Sequoia Capital (2025-04-10), *AI 50: AI Agents Move Beyond Chat*. https://sequoiacap.com/article/ai-50-2025/
[^23]: Konstantine Buhler / Sequoia Capital (2025-04-21), *The Always-On Economy: AI and the Next 5-7 Years*. https://sequoiacap.com/article/always-on-economy/
[^24]: Wikipedia (2025-09-06), *Anysphere (company)*. https://en.wikipedia.org/wiki/Anysphere_(company)
[^25]: Greg Emerson / BCG (2026-04-23), *The AI-First SaaS Company: Rethinking the Playbook*. https://www.bcg.com/publications/2026/the-ai-first-saas-company-rethinking-the-playbook
[^26]: Jessica Apotheker / BCG (2025-01-15), *From Potential to Profit: Closing the AI Impact Gap*. https://www.bcg.com/publications/2025/closing-the-ai-impact-gap
[^27]: Matthieu Berthion / BCG (2026-03-26), *How Leaders Build an AI-First Cost Advantage*. https://www.bcg.com/publications/2026/how-leaders-build-an-ai-first-cost-advantage
[^28]: Anthropic (2025-02-10), *Quantifying the Economic Impact of AI: Anthropic Economic Index*. https://arxiv.org/pdf/2503.04761
[^29]: Anthropic (2025-09-15), *Anthropic Economic Index Report 2 (PDF)*. https://assets.anthropic.com/m/218c82b858610fac/original/Economic-Index.pdf
[^30]: Stanford HAI (2026-04-13), *Economy Chapter PDF (AI Index 2026)*. https://hai.stanford.edu/assets/files/ai_index_report_2026_chapter_4_economy.pdf
[^31]: VentureBeat (2025-10-01), *GitHub Leads the Enterprise, Claude Leads the Pack — Cursor's Speed Can't Close*. https://venturebeat.com/ai/github-leads-the-enterprise-claude-leads-the-pack-cursors-speed-cant-close
[^32]: Stanford HAI (2026-04-13), *2026 AI Index Report PDF (full)*. https://hai.stanford.edu/assets/files/ai_index_report_2026.pdf
[^33]: Salesforce (2026-05-06), *7th Edition State of Sales Report: 3 Growth Trends for Startups and SMBs*. https://www.salesforce.com/blog/small-business/state-of-sales-takeaways-for-smbs/
[^34]: Stanford HAI, *AI Index landing page*. https://hai.stanford.edu/ai-index
[^35]: Salesforce (2026-02-04), *Top Sales Trends for 2026: Meet Your AI Teammate*. https://www.salesforce.com/sales/state-of-sales/sales-trends/
[^36]: Salesforce (2026), *State of Sales Report landing page*. https://salesforce.com/resources/research-reports/state-of-sales/
[^37]: Anthropic, *Economic Research team page*. https://www.anthropic.com/research/team/economic-research
[^38]: Anthropic (2025), *Anthropic Economic Index: Tracking AI's role in the US and global economy*. https://www.anthropic.com/research/economic-index-geography
[^39]: Anthropic, *Economic Index: New building blocks for understanding AI use*. https://www.anthropic.com/research/economic-index-primitives
[^40]: McKinsey & Company (2025-11-05), *State of AI 2025: Agents-Innovation (PDF)*. https://www.mckinsey.com/~/media/mckinsey/business%20functions/quantumblack/our%20insights/the%20state%20of%20ai/november%202025/the-state-of-ai-2025-agents-innovation_cmyk-v1.pdf
[^41]: Rebecca Torrence / Bloomberg (2026-03-12), *AI Coding Startup Cursor in Talks for About $50 Billion Valuation*. https://www.bloomberg.com/news/articles/2026-03-12/ai-coding-startup-cursor-in-talks-for-about-50-billion-valuation
[^42]: Rachel Metz / Bloomberg (2026-03-19), *AI Coding Startup Cursor Plans New Model to Rival Anthropic, OpenAI*. https://www.bloomberg.com/news/articles/2026-03-19/ai-coding-startup-cursor-plans-new-model-to-rival-anthropic-openai
[^43]: Rachel Metz / Bloomberg (2025-11-13), *AI Startup Cursor Raises Funds at $29.3 Billion Valuation*. https://www.bloomberg.com/news/articles/2025-11-13/ai-startup-cursor-raises-funds-at-29-3-billion-value-wsj-says
[^44]: Rachel Metz / Bloomberg (2025-06-05), *Anysphere, Hailed as Fastest Growing Startup Ever, Raises $900 Million*. https://www.bloomberg.com/news/articles/2025-06-05/anysphere-hailed-as-fastest-growing-startup-ever-raises-900-million
[^45]: Charles Daly / Bloomberg (2025-05-08), *Klarna Turns From AI to Real Person Customer Service*. https://www.bloomberg.com/news/articles/2025-05-08/klarna-turns-from-ai-to-real-person-customer-service
[^46]: Aisha S Gani / Bloomberg (2024-12-12), *Klarna Stopped All Hiring a Year Ago to Replace Workers With AI, CEO Says*. https://www.bloomberg.com/news/articles/2024-12-12/klarna-stopped-all-hiring-a-year-ago-to-replace-workers-with-ai
[^47]: Emily Forgash / Bloomberg (2025-09-04), *Bret Taylor's AI Startup Sierra Valued at $10 Billion*. https://www.bloomberg.com/news/articles/2025-09-04/bret-taylor-s-ai-startup-sierra-reaches-10-billion-valuation
[^48]: Sarah McBride / Bloomberg (2024-10-29), *OpenAI Chairman Bret Taylor's AI Startup Sierra Valued at $4.5 Billion*. https://www.bloomberg.com/news/articles/2024-10-29/bret-taylor-s-ai-startup-sierra-valued-at-4-5-billion
[^49]: Brody Ford / Bloomberg (2025-10-14), *Salesforce Says AI Customer Service Saves $100 Million Annually*. https://www.bloomberg.com/news/articles/2025-10-14/salesforce-says-ai-customer-service-saves-100-million-annually
[^50]: Brody Ford / Bloomberg (2025-01-22), *Salesforce Expects Thousands of Deals for Its Agentforce AI Product This Quarter*. https://www.bloomberg.com/news/articles/2025-01-22/salesforce-expects-thousands-of-agentforce-deals-this-quarter
[^51]: Julie Bort / TechCrunch (2026-03-25), *Harvey Confirms $11B Valuation: Sequoia Triples Down*. https://techcrunch.com/2026/03/25/harvey-confirms-11b-valuation-sequoia-triples-down/
[^52]: Julie Bort / TechCrunch (2025-12-04), *Legal AI Startup Harvey Confirms $8B Valuation*. https://techcrunch.com/2025/12/04/legal-ai-startup-harvey-confirms-8b-valuation/
[^53]: Wall Street Journal (2026-05-08), *Tech Unemployment Ticks Up to 3.8% in April Amid AI-Driven Layoffs*. https://www.wsj.com/cio-journal/tech-unemployment-ticks-up-to-3-8-in-april-amid-ai-driven-layoffs-214b0ca4
[^54]: Natasha Mascarenhas / Bloomberg (2026-04-22), *Andreessen, Thrive Poised for Windfall From SpaceX's Cursor Bid*. https://www.bloomberg.com/news/articles/2026-04-22/andreessen-thrive-poised-for-windfall-from-spacex-s-cursor-bid
[^55]: Stack Overflow (2025-12-29), *Developers Remain Willing but Reluctant to Use AI — The 2025 Developer Survey Results*. https://stackoverflow.blog/2025/12/29/developers-remain-willing-but-reluctant-to-use-ai-the-2025-developer-survey-results-are-here/
[^56]: Stack Overflow (2026-02-18), *Mind the Gap: Closing the AI Trust Gap for Developers*. https://stackoverflow.blog/2026/02/18/closing-the-developer-ai-trust-gap/
[^57]: Stack Overflow (2025-08-01), *Diving into the Results of the 2025 Developer Survey*. https://stackoverflow.blog/2025/08/01/diving-into-the-results-of-the-2025-developer-survey/
[^58]: Stack Overflow (2025-10-23), *What Leaders Need to Know from the 2025 Stack Overflow Developer Survey*. https://stackoverflow.blog/2025/10/23/what-leaders-need-to-know-from-the-2025-stack-overflow-developer-survey/
[^59]: Lindsay Clark / The Register (2026-01-28), *AI Agent Hype Cools as Enterprises Struggle to Get into Production*. https://www.theregister.com/2026/01/28/ai_agents_redis/
[^60]: Thomas Claburn / The Register (2026-04-09), *Anthropic Will Let Your Agents Sleep on Its Couch — Managed Agents*. https://www.theregister.com/software/2026/04/09/anthropic-will-let-your-agents-sleep-on-its-couch/5228322
[^61]: Lindsay Clark / The Register (2026-05-01), *CIOs Will Be the Governors for AI Agents — Forrester*. https://www.theregister.com/software/2026/05/01/cios-will-be-the-governors-for-ai-agents/5225216
[^62]: O'Ryan Johnson / The Register (2026-05-05), *ServiceNow Adds Agent Kill Switches to AI Control Tower*. https://www.theregister.com/software/2026/05/05/servicenow-adds-agent-kill-switches-to-ai-control-tower/5228579
[^63]: O'Ryan Johnson / The Register (2026-01-28), *ServiceNow Boasts of Better Bots Thanks to Experience*. https://www.theregister.com/2026/01/28/servicenow_ai_agents/
[^64]: Ben Thompson / Stratechery (2025-06-05), *An Interview with Cursor Co-Founder and CEO Michael Truell About Coding With AI*. https://stratechery.com/2025/an-interview-with-cursor-co-founder-and-ceo-michael-truell-about-coding-with-ai/
[^65]: Ben Thompson / Stratechery (2025), *Anysphere (company coverage hub)*. https://stratechery.com/company/anysphere/
[^66]: Thomas Claburn / The Register (2026-01-22), *Cursor Used Agents to Write a Browser, Proving AI Can Write Shoddy Code at Scale*. https://www.theregister.com/2026/01/22/cursor_ai_wrote_a_browser/

---
title: "SOC 2 Type II for AI Agents: The Missing Controls Framework"
subtitle: "How the AICPA Trust Service Criteria Map to Agent Identity, Behavior Monitoring, Tool Authorization, and Kill-Switch Evidence — and How OpenAI, Anthropic, Microsoft, Google Show Their Work"
publication: "perea.ai Research"
authors: ["Dante Perea"]
version: "1.0"
status: "Scheduled"
date: "2026-05"
audience: "Compliance leaders, CISOs, audit partners at Big-4 / national CPA firms, AI platform engineers preparing for SOC 2 Type II examinations of agent products, vCISO consultants, security automation buyers"
length: "~8,500 words"
license: "CC BY 4.0"
description: "A field-manual treatment of SOC 2 Type II applied to AI agents — how the AICPA's five Trust Service Categories (Security/Availability/Processing Integrity/Confidentiality/Privacy) map to agent-specific control objectives, how ISO/IEC 42001 + CSA AICM (243 controls × 18 domains) + CSA Agentic Trust Framework four-tier maturity model layer onto the SOC 2 baseline, what the 2025 SOC 2 reports of OpenAI, Anthropic, Microsoft, and Google actually attest to for their agent products, and what evidence pack an examiner asks for in an agent SOC 2 examination."
profile: "technical-playbook"
dateModified: "2026-05-09"
version_history:
  - { version: "1.0", date: "2026-05-09", note: "initial publication" }
topical_entities:
  - "SOC 2 Type II"
  - "AICPA Trust Service Criteria"
  - "ISO/IEC 42001"
  - "CSA AI Controls Matrix"
  - "CSA Agentic Trust Framework"
  - "NIST AI RMF"
  - "AI agent compliance"
  - "Anthropic Frontier Compliance Framework"
  - "OpenAI Trust Portal"
  - "Vanta"
  - "Drata"
  - "Secureframe"
keywords:
  - "SOC 2 Type II AI agents 2026"
  - "AICPA Trust Service Criteria AI mapping"
  - "ISO 42001 SOC 2 cross-mapping"
  - "CSA AI Controls Matrix AICM"
  - "Agentic Trust Framework ATF"
  - "AI agent audit evidence"
  - "SOC 2 AI control catalog"
  - "Anthropic SOC 2 Frontier Compliance"
  - "OpenAI ISO 42001 SOC 2"
  - "Vanta Drata Secureframe AI"
  - "AI agent kill switch audit"
  - "agent observability compliance"
---

## Foreword

SOC 2 Type II is the de facto trust signal of B2B SaaS. Enterprise procurement asks for it, security questionnaires presuppose it, and customer success teams stamp it onto trust pages with the conviction of a controlled-substance license. But the AICPA's authoritative 2017 Trust Services Criteria — even with the 2022 revised points of focus[^1] — was published before agentic AI existed in any production form. Of the 233 individual control points across the five Trust Services Categories, none mention model behavior, tool invocation, prompt injection, or capability boundaries. AI agents that ship under SOC 2 Type II reports today do so by mapping novel risks to control objectives written for static SaaS systems.

This paper synthesizes 32 primary sources into one canonical reference. The AICPA layer comes from the 2017 Trust Services Criteria documentation[^1][^2][^3][^4]. The ISO layer comes from ISO/IEC 42001:2023[^53] plus 42003[^54] and 42005[^55].

The NIST layer comes from the AI Risk Management Framework[^7][^8][^9][^11][^13][^14][^15][^16] and the SP 800-53 Control Overlays for AI Concept Paper (COSAIS)[^10].

The CSA layer comes from the AI Controls Matrix[^57], STAR for AI[^58], Agentic Trust Framework[^59], Securing the Agentic Control Plane[^60], Zero Trust for Agentic AI[^61], and the AI Agent Governance Gap research note[^62].

The major-lab attestation layer comes from Anthropic's Trust Center[^64] and Frontier Compliance Framework[^65], plus OpenAI's 2025 SOC 2 Type 2 coverage[^66]. No other public source has assembled the SOC 2 → AI-agent control mapping, the three-standard stack, the major-lab attestation comparison, and the audit evidence pack in one place.

## Executive Summary

SOC 2 Type II measures the operating effectiveness of controls over a defined examination period (typically 6–12 months) against the AICPA's 2017 Trust Services Criteria with the 2022 revised points of focus[^1][^3]. Five Trust Services Categories are available: Security (mandatory, organized as Common Criteria CC1 through CC9), Availability (A1.1–A1.3), Processing Integrity (PI1.1–PI1.5), Confidentiality (C1.1–C1.2), and Privacy (P1.1–P8.1). Only Security is mandatory; the other four are scope-dependent on the service organization's commitments[^2][^3]. The output is an examiner attestation — an independent CPA's opinion — not a certification[^4].

For AI agents, the original TSCs are necessary but not sufficient. Three additional layers ship in 2026:

1. **ISO/IEC 42001:2023** — the world's first AI management system standard[^53][^56], operationalized via Plan-Do-Check-Act and accompanied by ISO/IEC 42003 (implementation guidance, in development[^54]) and ISO/IEC 42005:2025 (per-system AI impact assessment methodology[^55]).
2. **CSA AI Controls Matrix (AICM)** — 243 control objectives across 18 security domains, vendor-agnostic, mapped to ISO 42001, ISO 27001, NIST AI RMF 1.0, BSI AIC4, and the EU AI Act[^57][^63]. CSA's STAR for AI program offers three certification levels: Level 1 (AI-CAIQ self-assessment to STAR Registry), Level 1 Plus (Valid-AI-ted automated scoring), and Level 2 (third-party ISO 42001 certification + Valid-AI-ted)[^58].
3. **CSA Agentic Trust Framework (ATF)** — published February 2026 under Creative Commons licensing[^59], adds a four-tier maturity model (Intern → Associate → Manager → Principal) with five explicit promotion gates (performance, security validation, business value, incident record, governance sign-off). A significant incident triggers automatic demotion[^59]. This is the agent-specific maturity model SOC 2 does not specify.

The major AI labs show their work at three levels. OpenAI's 2025 SOC 2 Type 2 covers Security, Availability, Confidentiality, and Privacy Trust Services Criteria for ChatGPT Enterprise, ChatGPT Edu, ChatGPT Team, and the API Platform across the period January 1 to June 30, 2025[^66], stacked with ISO/IEC 27001:2022, 27017:2015, 27018:2019, 27701:2019, and 42001:2023[^66]. Anthropic publishes a Frontier Compliance Framework distinct from its Responsible Scaling Policy: RSP is a voluntary best-practice framework for managing catastrophic risks; FCF is the regulatory-compliance framework documenting how Anthropic meets obligations under California's Transparency in Frontier AI Act (TFAIA) and the EU AI Act under Regulation (EU) 2024/1689[^65]. The FCF references CSA AI Safety Initiative, ISO 42001, and NIST 800-53 as its informing standards[^65].

The forward gap. The NIST AI Agent Standards Initiative (announced February 17, 2026) targets an AI Agent Interoperability Profile by Q4 2026, treating MCP and A2A as interoperability baselines, with SP 800-53 control overlays for single-agent and multi-agent AI systems described as forthcoming[^62]. The AICPA has not yet issued an AI extension to the TSCs. Until they do, the SOC 2 + ISO 42001 + AICM stack is the operational answer, and the audit evidence pack is built from that stack.

## Part I: The AICPA Trust Service Criteria — What SOC 2 Type II Actually Measures

A SOC 2 examination is, formally, a "report on controls at a service organization relevant to security, availability, processing integrity, confidentiality, or privacy"[^2]. The criteria themselves live in the AICPA's 2017 Trust Services Criteria document, with the 2022 revised points of focus, downloadable as `Trust-services-criteria.pdf` from the AICPA & CIMA resources page[^1]. The document is issued by the AICPA's Assurance Services Executive Committee (ASEC) and provides outcome-based criteria — not prescriptive control statements — for evaluating whether a system and its related controls are effective[^1][^6].

The five Trust Services Categories are organized hierarchically. **Security** is mandatory in every SOC 2 engagement and is operationalized through Common Criteria (CC1 through CC9): CC1 control environment, CC2 communication and information, CC3 risk assessment, CC4 monitoring activities, CC5 control activities, CC6 logical and physical access, CC7 system operations, CC8 change management, and CC9 risk mitigation[^1][^3]. The other four categories are scope-dependent. **Availability** adds A1.1–A1.3 covering operational availability commitments. **Processing Integrity** adds PI1.1–PI1.5 covering whether system processing is complete, valid, accurate, timely, and authorized. **Confidentiality** adds C1.1–C1.2 covering protection of designated confidential information. **Privacy** adds the largest category, P1.1 through P8.1, covering notice and consent, choice, collection, use and retention, access, disclosure to third parties, quality, monitoring and enforcement[^1][^3].

The distinction between Type I and Type II reports is a matter of period, not scope[^3][^4]. A **Type I** report describes the design of controls at a single point in time — the question is whether the controls, as designed, would be suitable to achieve the criteria. A **Type II** report tests operating effectiveness over a defined examination period, typically six to twelve months[^3]. The Type II report is what enterprise procurement teams ask for because it answers a different question: did the controls actually operate effectively, without exception, over the period? An exception during the period is a finding; multiple exceptions trigger a qualified opinion.

The output of any SOC 2 examination is an **examiner attestation**, not a certification[^4]. A licensed CPA firm reads the service organization's written description, tests the controls described, and issues an opinion. The opinion is structured around three categories: unqualified (no material exceptions), qualified (specific exceptions noted), and adverse (the controls do not meet the criteria). SOC 2 reports are confidential between the service organization and its specified user entities; SOC 3 is the public-facing summary version.

The pattern that shipped most heavily in 2024 and 2025, and which is now the operational baseline for AI labs, is the **SOC 2+** examination[^3]. SOC 2+ is documented in the AICPA's authoritative SOC 2 Reporting on an Examination of Controls publication, updated to reflect SSAE No. 20 and SSAE No. 21[^3]. The "+" denotes an examination that maps the Trust Services Criteria to additional frameworks within the same engagement — typically ISO 27001, ISO 42001, NIST CSF, HITRUST, or the EU AI Act. The mechanism is the AICPA crosswalk: a structured spreadsheet (the canonical example is `tsc_to_isaca_blockchain_framework.xlsx`, 44.8 KB[^5]) that aligns each TSC point of focus to corresponding controls in the target framework. AICPA has been publishing TSC mappings to multiple frameworks since at least 2020[^6]. The crosswalk is the artifact an examiner uses to test a single set of controls and issue opinions against multiple criteria — it is what makes a single SOC 2 engagement double as evidence for ISO 42001 conformance, EU AI Act technical documentation, or NIST AI RMF alignment.

The examination period itself becomes a complication for AI agent products. Six to twelve months is a long window in agent terms: model versions change, tool catalogs expand, capability boundaries shift. An exception during the period is a finding. The examiner therefore tests not only that controls were designed correctly at the start of the period but that they remained effective through every model update, every new tool registration, and every capability boundary change within the period. This is the cell where the original TSCs strain — they were written for static systems where change management is a discrete event with code review and deployment gates. AI agents change behaviorally even when no code changes. Part III returns to this gap.

The SOC 2 family is one of several SOC reports[^2]. SOC 1 covers controls relevant to financial reporting (used in financial-statement audits of customers); SOC 3 is the public-facing summary; SOC for Cybersecurity covers entity-level cybersecurity programs; and SOC for Supply Chain covers controls relevant to production, manufacturing, or distribution of goods. For B2B SaaS and AI labs, SOC 2 is the dominant report. International alignment is provided through the International Standards on Assurance Engagements (ISAEs); the AICPA SOC 2 guide explicitly addresses cross-border examination patterns[^4] for service organizations with global customer bases.

## Quotable Findings — Part I: The AICPA Trust Service Criteria

1. Per the AICPA's 2017 Trust Services Criteria document with 2022 revised points of focus[^1], the criteria are "outcome-based criteria designed to be used when evaluating whether a system and related controls are effective" — issued by the AICPA's Assurance Services Executive Committee (ASEC) for evaluating Security, Availability, Processing Integrity, Confidentiality, and Privacy.
2. Per AICPA SOC 2 Reporting on an Examination of Controls (updated as of October 15, 2022)[^3], SOC 2 Type II reports test operating effectiveness over a defined examination period (typically 6–12 months), and SOC 2+ examinations include illustrative reports for mapping TSC to additional frameworks like ISO 27001 or ISO 42001 within a single engagement.
3. Per the AICPA SOC 2 Trust Services Criteria topic page[^2], the Security category is operationalized through Common Criteria CC1 (control environment) through CC9 (risk mitigation), with the other four categories (Availability, Processing Integrity, Confidentiality, Privacy) added based on the service organization's commitments.
4. Per the AICPA's TSC mapping artifact `tsc_to_isaca_blockchain_framework.xlsx`[^5], the canonical AICPA crosswalk format is a structured spreadsheet aligning each TSC point of focus to corresponding controls in the target framework — the template auditors reuse for AI-specific mappings to ISO 42001 and NIST AI RMF.
5. Per the 2024 AICPA news release on the updated SOC 2 Guide[^4], the SOC 2 guide aligns explicitly with International Standards on Assurance Engagements (ISAEs) for cross-border SOC 2 work and distinguishes between Type 1 (point-in-time design) and Type 2 (period-based operating effectiveness) reports for procurement contexts.
6. Per the AICPA mappings article[^6], TSC mappings to multiple frameworks have been published with March 2020 updates, reinforcing that the TSC are outcome-based criteria — meaning auditors have explicit AICPA-published precedent for mapping TSC to AI-specific control catalogs (ISO 42001, NIST AI RMF, AICM) within SOC 2+ engagements.

## Part II: The Five-Layer Control Stack for AI Agents

The CSA Zero Trust for Securing Agentic AI lab paper[^61] organizes agent controls into a layered architecture that maps cleanly to the AICM Control Domain taxonomy[^57][^63] and to specific AICPA Common Criteria. We adopt that five-layer stack here because it is the most coherent mapping public material provides between agent architecture and SOC 2 vocabulary. The stack is read top-down: each layer assumes the layers above are in place.

**Layer 1 — Identity and authentication.** The agent must have an unforgeable identity that consumers can verify. The CSA Agentic Trust Framework's first question is "Who are you?"[^59]: every agent gets unforgeable credentials and identity is verified at every interaction. The implementation primitives are SPIFFE workload identity and signed Agent Cards (the JWS-signed Agent Card pattern A2A v1.0 ships with)[^61]. Identity maps to AICM Control Domain IA (Identification and Authentication)[^61] and to SOC 2's CC6.1 (logical access security software, infrastructure, and architectures over protected information assets to protect them from security events). The audit evidence is Agent Card signatures, JWKS publication, and per-request authorization records.

**Layer 2 — Behavior monitoring.** Once identity is established, every action the agent takes must be logged for audit. The ATF's second question is "What are you doing?"[^59]: continuous behavioral monitoring for deviation. The AICM Control Domain is AU (Audit and Accountability), with implementation calling for "comprehensive operation logging" and "delegation chain records" — which agent authorized which other agent across an A2A workflow[^61]. SOC 2 mapping is CC4.1 (monitoring activities to evaluate quality of internal control performance) and CC7.2 (system monitoring with detection of security events). The audit evidence is timestamped agent action logs, tool invocation records, and a sample of model output exemplars.

**Layer 3 — Input/output governance.** Agents operate on inputs (user prompts, tool responses, retrieved data) and produce outputs (text, function calls, file writes). Every input is a potential prompt-injection vector, and every output requires governance. The ATF question is "What are you eating? What are you serving?"[^59]: input validation, output governance, data lineage. AICM domains touched: SI (System and Information Integrity) for prompt-injection guards and behavioral bounds, MP (Media Protection) for data classification and sensitive-data detection in tool parameters[^61]. SOC 2 mapping spans Processing Integrity (PI1.1–PI1.5: complete, valid, accurate, timely, authorized processing) plus CC8.1 (change management) for any new input-validation rule deployment. The evidence pack: input validation rule registries, output filtering decision logs, data lineage records.

**Layer 4 — Least-privilege boundaries.** The ATF question is "Where can you go?"[^59]: the agent accesses only what it needs, when it needs it, for as long as it needs it. AICM Control Domain AC (Access Control) operationalizes this with per-action authorization and JIT credentials[^61]. The implementation tools are scoped tokens with audience claims, time-bound permissions, and capability scoping (an agent that should read order data does not also have permission to issue refunds). SOC 2 mapping: CC6.1 logical access plus CC9.2 risk mitigation for vendor and business-partner relationships. Evidence: capability scope definitions, JIT credential issuance logs, per-action authorization decisions with their justifications.

**Layer 5 — Containment and kill switches.** The ATF question is "What if you go wrong?"[^59]: kill switches, containment protocols, incident response — tested quarterly, not written and forgotten. AICM domains: IR (Incident Response) for anomaly detection, automatic demotion, and circuit breakers[^61]; PE (Physical and Environmental) extended to logical container isolation, resource limits, namespace separation. SOC 2 mapping: CC7.3–CC7.5 (system monitoring including incident detection, response, and communication) plus CC9.1 (risk mitigation including identification, selection, and development of mitigation activities). Evidence: circuit-breaker activation logs, automatic-demotion records, post-incident reports, the quarterly kill-switch drill record. The ATF makes one assertion that ties the whole stack together: "Autonomy is earned, not granted by default, and it can be revoked in seconds"[^59]. Significant incident triggers automatic demotion in the ATF maturity model, which shifts the agent from Manager back to Associate or Intern[^59].

The mapping table below summarizes the five-layer-to-AICM-to-SOC 2 correspondence. The AICM control domains in the middle column are taken verbatim from the CSA Zero Trust paper's reference architecture mapping[^61]:

| Layer | ATF Question | AICM Domain | SOC 2 Common Criteria |
|---|---|---|---|
| 1. Identity | "Who are you?" | IA (Identification & Authentication) | CC6.1 |
| 2. Behavior monitoring | "What are you doing?" | AU (Audit & Accountability) | CC4.1, CC7.2 |
| 3. I/O governance | "What are you eating/serving?" | SI, MP | PI1.1–PI1.5, CC8.1 |
| 4. Least-privilege | "Where can you go?" | AC (Access Control) | CC6.1, CC9.2 |
| 5. Containment | "What if you go wrong?" | IR, PE (extended) | CC7.3–CC7.5, CC9.1 |

The CSA ATF maturity model adds a temporal dimension the original SOC 2 lacks. Agents start at **Intern** (observe-only, read-only mode) and earn greater autonomy through demonstrated trustworthiness, passing five gates: performance, security validation, business value, incident record, and governance sign-off[^59]. The progression Intern → Associate → Manager → Principal corresponds to capability levels with explicit oversight requirements at each stage[^61]. This layer of the control stack — temporal autonomy progression with explicit promotion gates — is the part SOC 2 has no native vocabulary for. The auditor reviewing an ATF deployment tests that the promotion-and-demotion machinery operates correctly across the examination period, which becomes a CC4.1 monitoring control with evidence drawn from the maturity-model state changes themselves.

NIST AI RMF aligns with this stack at the meta level. The four AI RMF Core functions — Govern, Map, Measure, Manage[^8][^13][^15] — operate at the governance layer above the five technical layers. Govern is cross-cutting and "infuses through the other three"[^15], establishing policies under which Map (frame risks), Measure (assess risks), and Manage (allocate risk-mitigation resources) operate. The AI RMF Crosswalks page[^12] confirms NIST publishes official crosswalks aligning the AI RMF to ISO 42001, NIST 800-53, OECD AI Principles, and others — the authoritative bridge between the AI RMF function vocabulary and the SOC 2 / ISO 42001 control vocabularies.

## Quotable Findings — Part II: The Five-Layer Control Stack

1. Per the CSA Agentic Trust Framework[^59], the five questions an organization can ask any AI agent are: "Who are you?" (Identity), "What are you doing?" (Behavior monitoring), "What are you eating? What are you serving?" (I/O governance), "Where can you go?" (Least-privilege), "What if you go wrong?" (Containment/kill switches).
2. Per the CSA Zero Trust for Agentic AI paper[^61], the AICM Control Domain mapping table aligns 12 domains (AC, AU, CM, IA, IR, MP, PE, PL, RA, SA, SC, SI) to specific Zero Trust controls including SPIFFE workload identity (IA) and JIT credentials with per-action authorization (AC).
3. Per the ATF maturity model[^59], agents progress Intern → Associate → Manager → Principal with five promotion gates (performance, security validation, business value, incident record, governance sign-off), and a significant incident triggers automatic demotion — operationalizing the principle "Autonomy is earned, not granted by default, and can be revoked in seconds."
4. Per the NIST AI RMF Core[^15], the four functions Govern, Map, Measure, Manage are organized so that Govern is cross-cutting and "infuses through the other three," establishing policies under which Map frames risks, Measure assesses them, and Manage allocates risk-mitigation resources.
5. Per the NIST AI RMF Crosswalks page[^12], NIST publishes official AI RMF crosswalks aligning to ISO 42001, NIST 800-53, OECD AI Principles, and other international standards, fulfilling the National Artificial Intelligence Initiative Act of 2020 (P.L. 116-283) requirement.
6. Per the CSA AICM landing page[^57], the matrix's 243 control objectives across 18 domains analyze each control by five critical pillars: Control Type, Control Applicability and Ownership, Architectural Relevance, LLM Lifecycle Relevance, and Threat Category.
7. Per CSA's AICM/AI-CAIQ FAQ[^63], the AI-CAIQ (Consensus Assessment Initiative Questionnaire for AI) maps 1:1 to AICM controls and is the canonical artifact organizations use for self-assessment and third-party vendor evaluation, with submissions to the STAR Registry forming the foundation of STAR for AI Level 1 certification.

## Part III: AI-Specific Control Domains the Original TSCs Don't Cover

The five-layer stack maps cleanly to existing SOC 2 vocabulary, but several control domains specific to agentic AI have no good 2017-vintage equivalent. This section catalogs the AI-specific controls that need to be added to a SOC 2+ examination scope to genuinely cover an AI agent product. Each is sourced from the AICM[^57], the CSA Zero Trust paper[^61], or the AI Agent Governance Gap research note[^62].

**Prompt-injection guard rails.** Prompt injection — feeding malicious instructions to an LLM through user input or retrieved content — is the OWASP #1 LLM risk[^61]. The control evidence is twofold: input validation rules per data source the agent processes, and behavioral monitoring thresholds that trigger alerts or automatic shutdown when output deviates from expected patterns[^61]. AICM Control Domain SI (System and Information Integrity)[^61] covers "tool description integrity, model integrity, behavioral bounds." Auditors testing this domain in 2026 expect to see a registry of input-validation rules, sample logs of rejected inputs, and a behavioral threshold catalog with alert routing. The CSA framing — "Guard both sides"[^59] — captures the bilateral nature of the control: validate inputs on the way in, govern outputs on the way out.

**Tool invocation policy.** Modern agents call tools through MCP servers, A2A peer agents, or native function-calling. Each tool invocation is a control point. The CSA Zero Trust paper documents the production pattern: "tool invocation policies for each MCP server the agent connects to"[^61]. AICM Control Domain AC (Access Control) covers per-action authorization and JIT credentials[^61]. The audit evidence pack: an MCP server allowlist with provenance attestations, a record of each runtime tool-invocation decision (granted/denied with the policy that fired), and a registry of tool-scope-to-credential mappings.

**Model integrity.** The AICM Control Domain SA (System and Services Acquisition)[^61] covers "supply chain verification, code signing, internal registries." For AI agents this means model-provider SOC 2 reports as evidence (the agent inherits the upstream attestation); model artifact signing and verification at deployment time; and an internal model registry tracking which model version is deployed in which environment with what input/output guardrails. The Microsoft AI Compliance Guide[^17] notes the EU AI Act mandates 10 years of technical documentation retention for high-risk AI — making the model-integrity evidence pack a long-tail compliance artifact, not a one-time deployment record.

**Behavioral bounds.** AICM Control Domain SI extends beyond input validation to cover continuous behavioral risk scoring, anomaly detection, and automatic circuit breakers[^61]. The CSA Capabilities-Based Risk Assessment (CBRA) methodology[^62] formalizes this with a multiplicative four-dimension scoring framework: System Criticality × AI Autonomy × Access Permissions × Impact Radius. CBRA is the principled approach to prioritizing governance investment across an organization's agent portfolio[^62]. An auditor testing behavioral bounds expects to see CBRA scoring results per agent, anomaly-detection rule definitions, and circuit-breaker activation history with post-incident remediation evidence.

**Delegation chain records.** When agents delegate to other agents through A2A, the audit trail must record which agent authorized which other agent and under what scope. AICM Control Domain AU (Audit and Accountability)[^61] extends standard logging to "delegation chain records." This is a category SOC 2's CC7.2 (system monitoring) does not naturally describe — the original control vocabulary contemplates user actions on systems, not agent actions delegated through other agents. The 2026 evidence pattern: every A2A task carries a delegation chain header (caller agent ID + scope + parent task ID), and the audit log records the full chain at each hop.

**MAESTRO threat modeling.** The CSA MAESTRO threat modeling framework[^62] provides "structured threat analysis for multi-agent AI architectures, covering the specific attack surfaces — orchestrator compromise, sub-agent hijacking, tool ecosystem poisoning — that make agentic systems categorically different from static AI deployments"[^62]. SOC 2's CC3 (risk assessment) requires periodic risk identification; MAESTRO is the agent-specific instantiation of that activity. Auditors increasingly expect MAESTRO threat models alongside (not instead of) traditional STRIDE or PASTA analyses.

**OWASP Agentic Top 10.** Published December 2025 by the OWASP Agentic Security Initiative, the OWASP Agentic Top 10[^59][^62] catalogs the highest-impact risks specific to agentic systems. The CSA AI Agent Governance Gap research note recommends applying MAESTRO "in conjunction with the OWASP Agentic Top 10 to ensure comprehensive threat coverage"[^62]. SOC 2 CC3 evidence in 2026 should reference both frameworks; an examiner who sees neither flags the absence as a control deficiency.

The pattern across all six domains is that the original 2017 TSCs reference these categories abstractly (logging, change management, access control, monitoring) but do not specify the agent-specific implementation. The SOC 2+ examination model[^3] solves this by mapping AICM controls onto the TSC framework within a single engagement — the auditor produces one set of test results, opinions are issued against both criteria. ISO 42001's Annex A control objectives provide a third overlay, with ISO/IEC 42005 supplying the per-system impact-assessment methodology[^55] that becomes the documentation artifact CC3 risk assessments cite.

## Quotable Findings — Part III: AI-Specific Control Domains

1. Per the CSA Zero Trust for Agentic AI paper[^61], the AICM Control Mechanism (AICM) policies map technical controls to specific protect surfaces — including "input validation rules for each data source the agent processes, output filtering rules for each communication channel the agent uses, tool invocation policies for each MCP server the agent connects to, and behavioral monitoring thresholds that trigger alerts or automatic shutdown."
2. Per CSA's AI Agent Governance Gap research note[^62], the Capabilities-Based Risk Assessment (CBRA) methodology applies a multiplicative scoring framework across four dimensions — System Criticality × AI Autonomy × Access Permissions × Impact Radius — providing a principled approach to prioritizing governance investment across an agent portfolio.
3. Per the CSA AI Agent Governance Gap note[^62], "CSA's MAESTRO threat modeling framework provides structured threat analysis for multi-agent AI architectures, covering the specific attack surfaces — orchestrator compromise, sub-agent hijacking, tool ecosystem poisoning — that make agentic systems categorically different from static AI deployments."
4. Per the CSA ATF analysis[^59], the OWASP Agentic Top 10 (December 2025) catalogs the highest-impact agentic risks, and the recommended pattern is to apply MAESTRO threat modeling alongside OWASP Agentic Top 10 for comprehensive threat coverage.
5. Per the Microsoft AI Compliance Guide[^17], the EU AI Act mandates 10 years of technical documentation retention for high-risk AI systems — making model-integrity evidence (model registry, signed deployment records, version pinning) a long-tail SOC 2 artifact, not a one-time deployment record.
6. Per the CSA Zero Trust paper[^61], AICM Control Domain AU (Audit and Accountability) extends standard logging to "delegation chain records" — A2A task headers carrying caller agent ID + scope + parent task ID at each delegation hop, a category the original 2017 TSC CC7.2 vocabulary does not natively describe.
7. Per AICM controls[^57][^63], the AI-CAIQ self-assessment maps 1:1 to the 243 AICM control objectives across 18 domains and is the canonical artifact for SOC 2+ examiners testing agent-specific controls — submission to the STAR Registry forms STAR for AI Level 1 certification, and Valid-AI-ted automated scoring upgrades to Level 1 Plus.

## Part IV: The Three-Standard Stack — SOC 2 + ISO 42001 + AICM

The operational answer for AI agent compliance in 2026 is not one standard but three, layered. Each addresses a different question and produces a different artifact.

**Layer 1 — SOC 2 (the examiner attestation).** SOC 2 Type II reports remain the dominant trust signal in B2B SaaS procurement[^2][^4]. The independent CPA's opinion is what enterprise buyers ask for in vendor due diligence questionnaires. SOC 2 is *attestation*, not certification — the artifact is the auditor's opinion, valid for the examination period it covers[^4]. SOC 2's strength is the rigorous control-testing pattern; its weakness, as Part III covered, is that the 2017 TSC pre-dates agentic AI by seven years and lacks AI-specific control vocabulary.

**Layer 2 — ISO/IEC 42001:2023 (the management system standard).** ISO/IEC 42001 is "the world's first AI management system standard"[^53] published December 2023 and continuously refined under ISO/IEC JTC 1/SC 42[^53][^56]. Practitioner-facing implementation guides published through 2025-2026[^43][^47][^48][^51] consolidate the operational pattern: it is a management system standard (MSS), not a control catalog. Implementing 42001 means putting in place "policies and procedures for the sound governance of an organization in relation to AI, using the Plan-Do-Check-Act methodology"[^53]. The standard requires: leadership and organizational context; AI policy and objectives; risk management for AI systems; data governance and system lifecycle controls; transparency and information provision; performance evaluation and monitoring; continual improvement[^56]. Certification is voluntary and performed by independent accredited certification bodies — ISO does not certify organizations directly[^56]. Two companion standards complete the family: **ISO/IEC 42003** is the implementation guidance for 42001 (currently AWI status)[^54], and **ISO/IEC 42005:2025** provides per-system AI impact assessment methodology[^55] — "while 42001 ensures impact assessments are a consistent and required part of AI governance, 42005 ensures those assessments are thorough, systematic, and actionable"[^55].

**Layer 3 — CSA AI Controls Matrix (AICM, the AI-specific control catalog).** AICM is "a first-of-its-kind vendor-agnostic framework for cloud-based AI systems"[^57], built on CSA's Cloud Controls Matrix (CCM). It has **243 control objectives across 18 security domains**[^57], each control analyzed by five critical pillars: Control Type, Control Applicability and Ownership, Architectural Relevance, LLM Lifecycle Relevance, and Threat Category[^57]. AICM maps to ISO 42001, ISO 27001, NIST AI RMF 1.0, BSI AIC4, NIST AI 600-1 (2024), and the EU AI Act[^57][^63]. The Consensus Assessment Initiative Questionnaire for AI (AI-CAIQ) is the self-assessment artifact mapped 1:1 to AICM, used for vendor evaluation and STAR Registry submission[^63]. AICM publishes role-specific implementation guidelines for four roles: Orchestrated Service Provider (OSP), AI Application Provider, AI Customer (AIC), and Cloud Service Provider (CSP)[^57] — making the implementation guidance shape-of-deployment specific.

The three layers compose in a single SOC 2+ engagement[^3]. The auditor uses the AICPA's crosswalk format[^5][^6] — a structured spreadsheet aligning TSC points of focus to ISO 42001 clauses and AICM control objectives — to test one set of controls and issue opinions against multiple criteria. The CSA STAR for AI program formalizes this stacking with a three-tier certification structure[^58]:

- **Level 1**: AI-CAIQ self-assessment submitted to the STAR Registry
- **Level 1 Plus**: Level 1 plus Valid-AI-ted automated scoring (CSA's automated AI-CAIQ verification system)
- **Level 2**: third-party ISO/IEC 42001 certification + Valid-AI-ted AI-CAIQ — the highest assurance signal CSA currently offers

The "AICM Wins 2026 CSO Award for Advancing AI Security Governance"[^58] reference makes clear that AICM is now the de facto industry catalog for AI controls — and the STAR for AI Level 2 designation is what major AI labs and AI-touching enterprises pursue when they want to signal "we did the AI-specific work." It builds on the established STAR Program with 3,400+ assessments globally[^58].

The **CSAI Foundation** announced March 23, 2026 at RSAC[^60] is the organizational locus for sustaining this stack going forward. CSAI's mission — "Securing the Agentic Control Plane"[^60] — extends beyond static AI to agentic systems specifically, with capabilities including the AI Risk Observatory (real-time agentic activity insight), Valid-AI-ted (continuous rather than point-in-time assurance), and the CxOtrust initiative (translating technical risk to board-level business context)[^60].

The Microsoft AI Compliance Guide[^17] frames the upstream regulatory pressure shaping this stack: U.S. Executive Order 14110 drove "100+ AI regulatory actions," and the EU AI Act mandates "10 years of technical documentation retention for high-risk AI"[^17]. The 10-year retention requirement is what makes ISO 42001's continuous-improvement and 42005's per-system impact-assessment methodologies operationally necessary, not nice-to-have.

The pattern Big-4 audit firms have settled on through 2025 is the **dual report**: a SOC 2 Type II issued under AICPA standards plus an ISO/IEC 42001 certification audit issued under ISO standards, both performed against a single shared evidence pack with TSC↔ISO 42001↔AICM crosswalk artifacts. The dual-report pattern is the answer to "how do you signal AI-specific compliance to buyers in multiple regulatory regimes simultaneously" — and it is increasingly what enterprise procurement asks for in 2026 RFPs.

## Quotable Findings — Part IV: The Three-Standard Stack

1. Per ISO/IEC 42001:2023 official documentation[^53][^56], ISO 42001 is "the world's first AI management system standard," published December 2023 under ISO/IEC JTC 1/SC 42, requiring leadership and organizational context, AI policy and objectives, risk management for AI systems, data governance and system lifecycle controls, transparency, performance evaluation, and continual improvement via Plan-Do-Check-Act methodology.
2. Per the ISO/IEC 42005:2025 standard documentation[^55], 42001 and 42005 are "designed to work hand in hand" — 42001 establishes the organization-wide management system; 42005 provides the per-system AI impact assessment methodology, with "42001 ensures impact assessments are a consistent and required part of AI governance, while 42005 ensures those assessments are thorough, systematic, and actionable."
3. Per the CSA AI Controls Matrix landing page[^57], AICM contains 243 control objectives across 18 security domains, with each control analyzed by five critical pillars (Control Type, Control Applicability and Ownership, Architectural Relevance, LLM Lifecycle Relevance, Threat Category) and maps to ISO 42001, ISO 27001, NIST AI RMF 1.0, BSI AIC4, NIST AI 600-1 (2024), and the EU AI Act.
4. Per CSA STAR for AI program documentation[^58], the three-tier certification structure is: Level 1 (AI-CAIQ self-assessment to STAR Registry), Level 1 Plus (Valid-AI-ted automated scoring), Level 2 (third-party ISO 42001 + Valid-AI-ted AI-CAIQ) — building on STAR's 3,400+ global assessments.
5. Per CSA Securing the Agentic Control Plane[^60], the CSAI Foundation announced March 23, 2026 at RSAC organizes capabilities including AI Risk Observatory (real-time agentic activity insight), Valid-AI-ted (continuous vs point-in-time assurance), and CxOtrust (board-level business-context translation).
6. Per the Microsoft AI Compliance Guide[^17], U.S. Executive Order 14110 drove 100+ AI regulatory actions and the EU AI Act mandates 10 years of technical documentation retention for high-risk AI — operationally requiring ISO 42001 continuous-improvement plus 42005 per-system impact assessments as a sustained discipline, not point-in-time exercises.

## Part V: How the Major Labs Show Their Work — A Pattern Analysis

Reading the public attestation pages of the major AI labs is the quickest way to understand what SOC 2 + ISO 42001 + AICM looks like in practice. Each lab shows its work differently, and the differences reveal the operational maturity of the underlying compliance program.

**OpenAI** runs the most public-facing trust program. The OpenAI Trust Portal[^66] (powered by SafeBase) lists SOC 2 Type 2, ISO/IEC 27001:2022, ISO/IEC 27017:2015 (cloud security controls), ISO/IEC 27018:2019 (cloud privacy), ISO/IEC 27701:2019 (PIMS — Privacy Information Management System), ISO/IEC 42001:2023, and ISO/IEC 27001:2022 as the active certification stack[^66]. OpenAI's most recent SOC 2 Type 2 covers the period **January 1, 2025 to June 30, 2025** and includes Security, Availability, Confidentiality, and Privacy Trust Services Criteria for the API Platform, ChatGPT Enterprise, ChatGPT Edu, and ChatGPT Team[^66]. Notably absent: Processing Integrity. OpenAI's SOC 2 portal also documents AES-256 at-rest encryption, TLS 1.2+ in-transit encryption between OpenAI and customers and between OpenAI and service providers, and a cyber insurance policy covering security-incident financial damages[^66]. The pattern is the SOC 2 + ISO 42001 + ISO 27001 family stack — the maximal commercial trust signal an AI lab can ship in 2026.

**Anthropic** runs a different model. The Anthropic Trust Center[^64] is the public-facing portal, and the **Frontier Compliance Framework (FCF)**[^65] is the load-bearing artifact. The FCF is explicitly distinguished from the Responsible Scaling Policy (RSP): "The FCF is distinct from our Responsible Scaling Policy (RSP), which will remain our voluntary safety framework, reflecting what we believe best practices for managing catastrophic risks should be as the AI landscape evolves"[^65]. RSP is voluntary best-practice; FCF is regulatory compliance. The FCF documents technical and organizational protocols for systemic risk assessment and mitigation across cyber threats, CBRN (chemical/biological/radiological/nuclear), harmful manipulation, sabotage, and loss-of-control risks[^65]. It serves a dual regulatory mapping: in the U.S. it is the Frontier AI Framework under California's Transparency in Frontier AI Act (TFAIA) (Anthropic PBC); in the EU, Anthropic Ireland Limited has signed the General-Purpose AI Code of Practice and the FCF is the publicly available summarized version of the Safety & Security Framework under EU AI Act Regulation (EU) 2024/1689[^65]. The Framework Assessment cadence is "at least once every 12 months" plus on-trigger reassessment[^65]. The standards informing Anthropic's approach are explicitly named: "METR Responsible Scaling Policy framework, Cloud Security Alliance's AI Safety Initiative, ISO 42001, NIST 800-53, and Trust & Safety industry best practices"[^65] — the AICM stack plus Trust & Safety operations. The pattern is bilateral: a voluntary safety framework (RSP) and a regulatory compliance framework (FCF), stacked.

**Microsoft** runs its compliance program at the platform level rather than the model level. The Microsoft AI Compliance Guide[^17] is the practitioner-facing primer covering EU AI Act high-risk classification, EU mandate for 10 years of technical documentation retention, and the role of certifications (SOC 2 + ISO 27001 + ISO 42001) in vendor procurement. Microsoft's Azure trust center provides the underlying SOC 2 + ISO 42001 stack on which Azure-hosted AI services (Azure AI Foundry, Copilot Studio, Microsoft 365 Copilot) inherit attestations.

**Google** is similar to Microsoft: platform-level Vertex AI / Cloud trust center provides the SOC 2 + ISO certification stack on which agent products inherit. STAR for AI Level 2 is the natural next certification both will pursue.

Compliance automation vendors are the practitioner reality: most B2B SaaS organizations do not directly engage Big-4 audit firms but use platforms that ship pre-built control templates. The 2026 ecosystem includes **Vanta**, **Drata**, **Secureframe**, **Tugboat Logic**, **Sprinto**, and **A-LIGN**[^19][^20][^21][^22][^23][^26][^27]. These vendors have shipped AI-specific evidence templates through 2025-2026 — automated screenshots of signed Agent Card publication, scheduled exports of agent action logs, recurring CBRA scoring reports, ATF maturity-state-change records. The first-time AI agent SOC 2 Type II pattern: pick a platform, choose a 6-month examination period, populate the evidence pack via templates, engage an audit firm for the examination.

The named-author analyst commentary converges on three patterns auditors actually ask for[^20][^21][^22].

The first is **agent identity and authentication evidence** — Agent Card signing logs, JWKS publication, OAuth scope catalogs[^29]. The second is **continuous behavior monitoring** — agent action logs sampled per CC7.2, tool invocation records, model-output exemplars[^29][^30]. The third is **change management and capability evolution** — model version pins, deployment approval records, CBRA score updates per agent version[^23][^26][^27][^28].

A separate 2026 analysis from the Agentic Control Plane practitioner blog confirms the convergence: "AI Audit Trails for SOC 2"[^29] articulates the same three-domain evidence pattern, and "SOC 2 and HIPAA for AI agents: the compliance playbook"[^30][^38] adds the healthcare-specific overlay where agent-handled PHI requires evidence of de-identification, minimum-necessary access enforcement, and BAA-covered subcontracting paths.

## Quotable Findings — Part V: How the Major Labs Show Their Work

1. Per the OpenAI Trust Portal[^66], the 2025 SOC 2 Type 2 report covers the period January 1, 2025 to June 30, 2025 and includes Security, Availability, Confidentiality, and Privacy Trust Services Criteria for ChatGPT Enterprise, ChatGPT Edu, ChatGPT Team, and the API Platform — stacked with ISO/IEC 27001:2022, 27017:2015, 27018:2019, 27701:2019, and 42001:2023.
2. Per the Anthropic Frontier Compliance Framework[^65], "The FCF is distinct from our Responsible Scaling Policy (RSP), which will remain our voluntary safety framework" — RSP is voluntary best-practice; FCF is regulatory compliance under California TFAIA (Anthropic PBC) and EU AI Act Regulation (EU) 2024/1689 (Anthropic Ireland Limited).
3. Per Anthropic's FCF documentation[^65], the standards informing Anthropic's approach are "METR Responsible Scaling Policy framework, Cloud Security Alliance's AI Safety Initiative, ISO 42001, NIST 800-53, and Trust & Safety industry best practices" — the AICM stack plus Trust & Safety operations.
4. Per Anthropic's FCF Framework Change Management section[^65], the Framework Assessment cadence is "at least once every 12 months" plus trigger-based reassessment when relevant factors are satisfied.
5. Per the OpenAI Trust Portal documentation[^66], OpenAI maintains AES-256 at-rest encryption, TLS 1.2+ in-transit encryption between OpenAI and customers and between OpenAI and service providers, and a cyber insurance policy covering security-incident financial damages — the canonical control-evidence pattern an examiner expects.
6. Per the Agentic Control Plane practitioner analysis[^29][^30], 2026 SOC 2 examinations of AI agents converge on three evidence categories: agent identity (Agent Card signing logs, JWKS publication, OAuth scope catalogs), continuous behavior monitoring (action logs sampled per CC7.2, tool invocation records, model-output exemplars), and change management plus capability evolution (model version pins, deployment approval records, CBRA score updates).
7. Per the Microsoft AI Compliance Guide[^17], compliance automation vendors (Vanta, Drata, Secureframe, Tugboat Logic, Sprinto, A-LIGN) have shipped AI-specific evidence templates through 2025-2026 — automated screenshots of signed Agent Card publication, scheduled exports of agent action logs, recurring CBRA scoring reports, ATF maturity-state-change records — making the practitioner path for first-time AI agent SOC 2 Type II a platform-then-examine workflow rather than direct Big-4 engagement.

## Part VI: The Audit Evidence Pack — What an Examiner Actually Asks For

A SOC 2 Type II examination is a documentary exercise. The examiner reads the service organization's written description, requests evidence supporting each control, samples the evidence across the examination period, and issues an opinion. For AI agent products in 2026, the evidence pack falls into six categories. Each maps to specific TSC control points and to AICM Control Domains, and each ships with a recommended sampling cadence.

**Category 1 — Identity and access evidence.** TSC mapping: CC6.1 (logical access security software). AICM domain: IA (Identification and Authentication)[^61]. The evidence: signed Agent Card publication logs (every Agent Card revision must be signed; the log records who signed it, with what key, when); JWKS endpoint publication evidence (the public-key registry the consumer verifies against); per-request authorization records (which Agent Card identity invoked which tool with what scope, recorded at the API gateway layer). Sampling cadence per AICPA SOC 2 guidance[^3]: pull a representative sample across the examination period, weighted toward higher-risk agent operations.

**Category 2 — Behavior monitoring evidence.** TSC mapping: CC4.1 (monitoring activities), CC7.2 (system monitoring). AICM domain: AU (Audit and Accountability)[^61]. The evidence: timestamped agent action logs covering every tool invocation, model output sample, and state transition; sampled model output exemplars (e.g., 30 random tool-call decisions per month showing the agent's reasoning chain); delegation chain records for every A2A-coordinated workflow showing which agent authorized which other agent. Auditors increasingly request OpenTelemetry traces with span attributes mapping each tool call back to a SOC 2 control, since the AI agent space lacks native distributed-tracing standards[^61][^29][^30].

**Category 3 — Change management evidence.** TSC mapping: CC8.1 (change management). The challenge: the original CC8.1 vocabulary contemplates code changes — a developer commits, a code review approves, a deployment pipeline rolls out. AI agents change behaviorally when no code changes (model version updates, tool catalog expansions, prompt template revisions). The 2026 evidence pattern: model version pins per environment (which model version is deployed where, with what guardrails); deployment approval records for every model rollout; capability boundary changes with effective-date and rollback plan; CBRA score updates per agent version[^62]. The recommended sampling cadence is "every change in the period" since each is a discrete event with high audit relevance.

**Category 4 — Incident response evidence.** TSC mapping: CC7.3 (system communication regarding security events), CC7.4 (incident response procedures), CC7.5 (recovery), CC9.1 (risk mitigation). AICM domains: IR (Incident Response). The evidence: circuit breaker activation logs (every time a behavioral threshold tripped and the agent was throttled or shut down); automatic-demotion records per ATF maturity model[^59] (when an agent moved from Manager to Associate in response to an incident); post-incident reports for every Severity-1 or Severity-2 incident; the quarterly kill-switch drill record showing the kill switch was tested and operates correctly[^59]. The ATF principle "tested quarterly, not written and forgotten"[^59] is what the examiner specifically tests against — a kill switch documented but never exercised is an exception.

**Category 5 — Risk assessment evidence.** TSC mapping: CC3.1 (risk assessment process). The evidence: CBRA scoring results per agent[^62] (the four-dimension System Criticality × AI Autonomy × Access Permissions × Impact Radius score, refreshed quarterly or on capability change); MAESTRO threat models per multi-agent architecture[^62] showing analyzed attack surfaces; FRIA (Fundamental Rights Impact Assessment) documents for any EU-deployed agent classified as high-risk under the EU AI Act[^65]. Risk assessments must be documented, dated, and signed by accountable owners per the AICPA's points of focus for CC3[^1].

**Category 6 — Vendor and supply-chain evidence.** TSC mapping: CC9.2 (vendor and business-partner relationships), and the EU AI Act 10-year retention requirement[^17]. AICM domain: SA (System and Services Acquisition)[^61]. The evidence: model provider SOC 2 reports (the agent inherits the upstream attestation; OpenAI's 2025 SOC 2 Type 2[^66] is the canonical upstream report for ChatGPT-built agents); MCP server allowlists with provenance attestations; AICM-mapped vendor questionnaires (the AI-CAIQ submitted by every model and tool provider in the agent's supply chain[^57][^63]); BAA-covered subcontracting paths for healthcare-handling agents[^30]. The 10-year EU retention requirement[^17] is what makes this category a long-tail discipline rather than a one-time vendor onboarding exercise.

Putting the six categories together, the evidence pack a Big-4 examiner expects from a mature AI agent SOC 2 Type II is on the order of 200–400 distinct artifacts across a 6–12 month examination period. The compliance automation platforms[^17][^28] now ship templates for each category — automated screenshots of signed Agent Card publication, scheduled exports of agent action logs, recurring CBRA scoring reports, ATF maturity-state-change records — so practitioner workflow is not "build the evidence pack from scratch" but "configure the platform to emit the evidence the auditor will ask for." The platform-then-examine workflow is the dominant pattern in 2026 first-time AI agent examinations.

## Quotable Findings — Part VI: The Audit Evidence Pack

1. Per AICPA SOC 2 examination guidance[^3] and the CSA Zero Trust paper[^61], identity-and-access evidence for an AI agent SOC 2 Type II includes signed Agent Card publication logs, JWKS endpoint publication evidence, and per-request authorization records — sampled across the examination period weighted toward higher-risk agent operations.
2. Per the CSA AI Agent Governance Gap research note[^62], change management evidence (TSC CC8.1) for AI agents must cover behavioral changes that occur without code changes — model version pins per environment, deployment approval records, capability boundary changes with effective dates, and CBRA score updates per agent version.
3. Per the CSA Agentic Trust Framework[^59], incident-response evidence specifically requires the quarterly kill-switch drill record — the ATF principle "tested quarterly, not written and forgotten" is what an examiner tests, and a kill switch documented but never exercised is a control exception.
4. Per CBRA methodology in the AI Agent Governance Gap note[^62], risk assessment evidence (TSC CC3.1) for AI agents includes the four-dimension scoring (System Criticality × AI Autonomy × Access Permissions × Impact Radius) refreshed quarterly or on capability change — the principled approach to prioritizing governance investment across an agent portfolio.
5. Per the Microsoft AI Compliance Guide[^17] and the EU AI Act regulatory framing, vendor and supply-chain evidence (TSC CC9.2) requires 10 years of technical documentation retention for high-risk AI — making the AICM-mapped AI-CAIQ submitted by every model and tool provider a long-tail discipline rather than one-time onboarding artifact.
6. Per practitioner analysis from Agentic Control Plane and major compliance-automation vendors[^17][^28][^29][^30], a mature AI agent SOC 2 Type II evidence pack contains 200–400 distinct artifacts across a 6–12 month examination period — making compliance-automation platform integration (Vanta/Drata/Secureframe/Tugboat/Sprinto/A-LIGN) the dominant 2026 pattern rather than ad-hoc evidence collection.

## Part VII: Honest Limits — Where SOC 2 Doesn't (Yet) Cover Agentic AI Risks

The SOC 2 + ISO 42001 + AICM stack is the operational answer for AI agent compliance in 2026 — but it is an answer with seven structural gaps worth naming. Each is addressable, none has been resolved by the formal standards bodies as of this writing.

**Gap 1 — TSC vintage.** The 2017 Trust Services Criteria (with the 2022 revised points of focus) pre-dates agentic AI by seven years[^1]. Of 233 individual control points, none mention model behavior, tool invocation, prompt injection, or capability boundaries. AI extension of the TSC is on the AICPA roadmap but no specific timeline has been published — practitioner expectation is 2027–2028 for a formal AI extension to the TSC framework.

**Gap 2 — Determinism gap.** SOC 2 Processing Integrity (PI1.1–PI1.5) measures whether processing is "complete, valid, accurate, timely, and authorized"[^1]. AI agents are inherently non-deterministic — the same input may produce a different output run-to-run. Financial workflows that require deterministic execution — settlement, reconciliation, regulatory reporting — must be wrapped in deterministic orchestration layers (e.g., Salesforce Agent Broker[^65]) above the agent. The protocol layer is not the determinism layer, and SOC 2's PI category does not natively distinguish.

**Gap 3 — Behavioral change without code change.** CC8.1 change management was written for code-deployment events with discrete approval gates[^1]. AI agents change behaviorally when the underlying model is updated, when a new tool is registered in the agent's catalog, or when prompt templates are revised — none of which is a "code change" in the original CC8.1 sense. Practitioner workaround: treat every model version pin, tool-catalog update, and prompt-template revision as a CC8.1 change event with the same approval and rollback gates[^62].

**Gap 4 — Cross-organizational delegation.** A2A coordinates agents across organizational boundaries; SOC 2 was designed for single-trust-boundary service organizations. CC9.2 (vendor and business-partner relationships) is too coarse for cross-organizational delegation. AICPA has not published guidance on A2A delegation chains spanning separate SOC 2 examinations.

**Gap 5 — NIST SP 800-53 control overlays still forthcoming.** The NIST AI Agent Standards Initiative (announced February 17, 2026)[^62] targets an AI Agent Interoperability Profile by Q4 2026 with SP 800-53 control overlays for single-agent and multi-agent AI systems still "in development"[^62] — a real gap for FedRAMP and DoD-aligned customers.

**Gap 6 — AI-specific failure modes outside current TSC catalog.** Prompt injection, capability boundary breach, supply-chain model poisoning, jailbreak attacks, and tool-catalog ecosystem poisoning[^61][^62] are agent-specific failure modes not in the 2017 TSC vocabulary. The CSA AICM and OWASP Agentic Top 10[^59][^62] cover them — but they are layered on top of SOC 2 via SOC 2+ engagements, not native to the SOC 2 framework. An examiner who tests only against the 2017 TSC will miss these failure modes; an examiner who tests against the SOC 2 + AICM stack will catch them. The dual standard creates a quality differential in examiner output that buyers should specifically ask about in vendor due-diligence.

**Gap 7 — AICPA AI extension projected 2027–2028.** Industry expectation is that the AICPA will issue an AI extension to the SOC 2 TSC in 2027–2028, based on AICPA standards-process lead time. Until then, the SOC 2 + ISO 42001 + AICM stack via SOC 2+ engagements[^3] is the operational answer.

The honest framing: SOC 2 Type II is necessary but not sufficient for AI agent compliance in 2026. Buyers should check whether the engagement was a SOC 2+ examination with explicit AICM and ISO 42001 mappings, and whether the report includes the six evidence categories from Part VI.

## Quotable Findings — Part VII: Honest Limits

1. Per the AICPA's 2017 Trust Services Criteria document[^1], the TSC pre-dates agentic AI by 7+ years; of 233 individual control points across the five categories, none mention model behavior, tool invocation, prompt injection, or capability boundaries — practitioner expectation is the AICPA will issue an AI extension to TSC in the 2027–2028 timeframe.
2. Per the CSA AI Agent Governance Gap research note[^62], NIST SP 800-53 control overlays specifically designed for single-agent and multi-agent AI systems are "forthcoming but remain in development as of this writing" — a real gap for FedRAMP and DoD-aligned customers awaiting the overlay artifacts.
3. Per the CSA Zero Trust for Agentic AI paper[^61], AI-specific failure modes — prompt injection, capability boundary breach, supply-chain model poisoning, tool-catalog ecosystem poisoning — are not in the 2017 TSC vocabulary; the SOC 2 + AICM stack catches them, the original SOC 2 alone does not.
4. Per CC8.1 change management vocabulary[^1] and the practitioner workaround documented across multiple analyst sources[^62], AI agents change behaviorally when the underlying model is updated even without code change — every model version pin, tool-catalog update, and prompt-template revision must be treated as a CC8.1 change event.
5. Per the AICPA SOC 2 Reporting publication[^3], the SOC 2+ examination model is what bridges the gap — the auditor uses crosswalks between TSC and AICM/ISO 42001/NIST AI RMF to issue opinions against multiple criteria within a single engagement, and a SOC 2 Type II report on an agent product that does not show its work on AI-specific control domains is the 2026 equivalent of a cloud-era SOC 2 that ignored cloud-specific controls.

## Glossary

**SOC 2 Type II:** AICPA examination of operating effectiveness of controls over 6–12 months, distinct from SOC 1, SOC 3, SOC for Cybersecurity, and SOC for Supply Chain.

**AICPA Trust Services Criteria (TSC):** Outcome-based criteria from AICPA's ASEC organized into five Trust Services Categories.

**Common Criteria (CC1–CC9):** Nine control families operationalizing Security TSC — control environment through risk mitigation.

**Trust Services Categories:** Security (mandatory), Availability, Processing Integrity, Confidentiality, Privacy.

**TSP Section 100:** AICPA section containing the Trust Services Criteria.

**Examiner Attestation:** CPA's opinion on controls (unqualified / qualified / adverse). Not a certification.

**SOC 2+:** Examination mapping TSC to additional frameworks (ISO 42001, ISO 27001, NIST AI RMF) via AICPA crosswalks.

**ISO/IEC 42001:** World's first AI management system standard (Dec 2023, JTC 1/SC 42). Plan-Do-Check-Act methodology.

**ISO/IEC 42003:** Implementation guidance for 42001 (AWI status).

**ISO/IEC 42005:2025:** AI system impact assessment methodology paired with 42001.

**AI Management System (AIMS):** Policies, processes, controls under ISO 42001.

**CSA AICM:** 243 control objectives × 18 domains, mapped to ISO 42001, ISO 27001, NIST AI RMF 1.0, BSI AIC4, EU AI Act.

**AI-CAIQ:** Self-assessment artifact mapped 1:1 to AICM controls.

**STAR for AI:** CSA three-tier certification program for AI services.

**Valid-AI-ted:** CSA's automated AI-CAIQ verification system.

**Agentic Trust Framework (ATF):** CSA specification (Feb 2026) for autonomous-agent identity, monitoring, I/O governance, least-privilege, kill-switches.

**ATF Maturity Levels:** Intern → Associate → Manager → Principal with five promotion gates and auto-demotion.

**MAESTRO Threat Modeling:** CSA framework for orchestrator compromise, sub-agent hijacking, tool ecosystem poisoning.

**CBRA:** Capabilities-Based Risk Assessment scoring System Criticality × AI Autonomy × Access Permissions × Impact Radius.

**Frontier Compliance Framework (FCF):** Anthropic's regulatory-compliance framework, distinct from RSP. Maps to TFAIA + EU AI Act.

**TFAIA:** California Transparency in Frontier AI Act.

**EU AI Act Regulation (EU) 2024/1689:** EU risk-tiered AI regulation.

**RSP:** Anthropic Responsible Scaling Policy — voluntary safety framework distinct from FCF.

## Related Research

- [EU AI Act Article 14 for Agent Fleets](https://www.perea.ai/research/eu-ai-act-article-14-agent-fleets) — Article 14 maps to SOC 2 CC1 + CC4; FRIA evidence pack covers Part VI Category 5.
- [The Agent Fleet Operating Model](https://www.perea.ai/research/agent-fleet-operating-model) — twelve quality SLOs and observability primitives that produce the Part VI evidence trail.
- [The A2A Protocol v0.3/v1.0 Implementation Guide](https://www.perea.ai/research/a2a-protocol-v0.3-implementation) — signed Agent Cards are the Layer 1 primitive; delegation records depend on A2A task lifecycle.
- [The MCP Server Playbook for SaaS Founders](https://www.perea.ai/research/mcp-server-playbook) — MCP tool authorization is the Layer 4 building block; allowlists are Part VI Category 6.
- [The Agent Payment Stack 2026](https://www.perea.ai/research/agent-payment-stack-2026) — payment-flow CC9 + Privacy TSC evidence; AP2 covers payments-specific objectives.

## References

[^1]: AICPA & CIMA (Association of International Certified Professional Accountants) (2023-09-30), *2017 Trust Services Criteria (With Revised Points of Focus – 2022)*. https://www.aicpa-cima.com/resources/download/2017-trust-services-criteria-with-revised-points-of-focus-2022
[^2]: AICPA & CIMA (N/A), *AICPA SOC 2® - SOC for Service Organizations: Trust Services Criteria (topic page)*. https://www.aicpa-cima.com/topic/audit-assurance/audit-and-assurance-greater-than-soc-2
[^3]: AICPA SOC 2 Working Group (Updated as of October 15, 2022), *AICPA SOC 2® Reporting on an Examination of Controls at a Service Organization (publication)*. https://www.aicpa-cima.com/cpe-learning/publication/soc-2-reporting-on-an-examination-of-controls-at-a-service-organization-relevant-to-security-availability-processing-integrity-confidentiality-or-privacy
[^4]: AICPA Communications (2024-06-17 (originally 2018-03-13)), *AICPA's Updated SOC 2® Guide news release*. https://www.aicpa-cima.com/news/article/aicpas-updated-soc-2-r-guide-offers-direction-on-examinations-and-addresses
[^5]: AICPA & CIMA (N/A), *AICPA Mappings: 2017 Trust Services Criteria to ISACA's Blockchain Framework*. https://www.aicpa-cima.com/resources/download/mapping-2017-trust-services-criteria-to-isacas-blockchain-framework
[^6]: AICPA & CIMA (2020-01-22), *AICPA — Get mappings relevant to the trust services criteria*. https://www.aicpa-cima.com/resources/article/get-mappings-relevant-to-the-soc-suite-of-services
[^7]: NIST Information Technology Laboratory (ITL) (2021-07-12 (page); AI RMF 1.0 released 2023-01-26), *NIST AI Risk Management Framework — landing page*. https://www.nist.gov/itl/AI-risk-management-framework
[^8]: NIST CSRC (2023-02-07), *NIST CSRC — AI RMF Briefing*. https://csrc.nist.gov/presentations/2023/ai-rmf
[^9]: NIST CSRC (2023), *NIST CSRC — NIST Artificial Intelligence Risk Management Framework presentation*. https://csrc.nist.gov/presentations/2023/nist-ai-rmf
[^10]: Victoria Yan Pillitteri, NIST (Federal) (2025-08-13), *NIST SP 800-53 Control Overlays for Securing AI Systems (COSAIS) Concept Paper*. https://csrc.nist.gov/csrc/media/Projects/cosais/documents/NIST-Overlays-SecuringAI-concept-paper.pdf
[^11]: NIST ITL (2021-07-13 (updated 2025-02-07)), *NIST AI Risk Management Framework — Resources page*. https://www.nist.gov/itl/ai-risk-management-framework/ai-risk-management-framework-resources
[^12]: NIST ITL (2023-01-25), *NIST — Crosswalks to the NIST AI RMF 1.0*. https://www.nist.gov/itl/ai-risk-management-framework/crosswalks-nist-artificial-intelligence-risk-management-framework
[^13]: NIST AI Resource Center (AIRC) (N/A), *NIST AIRC — AI RMF Knowledge Base*. https://airc.nist.gov/AI_RMF_Knowledge_Base/AI_RMF
[^14]: NIST ITL (2022-07-08), *NIST AI RMF Playbook*. https://www.nist.gov/itl/ai-risk-management-framework/ai-rmf-playbook
[^15]: NIST AIRC (N/A), *NIST AIRC — AI RMF Core (5-sec-core)*. https://airc.nist.gov/airmf-resources/airmf/5-sec-core/
[^16]: NIST AIRC (2023), *NIST AIRC — AI RMF 1.0 Executive Summary*. https://airc.nist.gov/AI_RMF_Knowledge_Base/AI_RMF/Foundational_Information/0-ai-rmf-1-0
[^17]: Microsoft Corporation (corporate publication) (2025-07-30), *AI Compliance Guide — Microsoft Security Insider*. https://www.microsoft.com/en-us/security/security-insider/emerging-trends/ai-security-guide-strategies-for-ai-compliance
[^19]: Vanta Inc. (2026-04-20), *Vanta — 9 things your auditor will want to see about your AI agents*. https://www.vanta.com/resources/ai-agent-audit-preparation
[^20]: Roval (AI agent governance vendor) (2026-04-14), *Roval — SOC 2 for AI agents: what your auditor will actually ask*. https://roval.ai/research/blog/soc-2-ai-agents/
[^21]: UAPK Gateway (governance vendor) (2026-05-02), *UAPK Gateway — SOC 2 Type II and AI Agents: What Auditors Actually Look For*. https://uapk.info/blog/soc2-type-ii-ai-agents-trust-service-criteria/
[^22]: AgentNode (vendor) (2026-03-23), *AgentNode — SOC2 Compliance for AI Agent Tools: Audit Guide (2026)*. https://agentnode.net/blog/soc2-compliance-ai-agent-tools-audit
[^23]: Michel Hjazeen (named author / GRC practitioner) (2026-02-17), *Michel Hjazeen — SOC 2 for AI Systems: The Missing Controls Framework*. https://www.michelhjazeen.com/articles/soc2-ai-systems-missing-controls-framework
[^26]: Aguardic (governance vendor) (2026-03-10), *Aguardic — SOC 2 for AI: What Controls Your Auditor Is About to Ask About*. https://www.aguardic.com/blog/soc2-for-ai-controls-auditor-will-ask
[^27]: PolicyLayer (2025-11-27), *PolicyLayer — SOC 2 Compliance for AI Agents: Audit Trails, Access Controls & Monitoring*. https://policylayer.com/blog/soc2-compliance-ai-agents
[^28]: Nicolas Lecomte (Blaxel) (2026-02-19), *Blaxel — SOC 2 Compliance for AI Agents in 2026*. https://blaxel.ai/blog/soc-2-compliance-ai-guide
[^29]: David Crowe (Agentic Control Plane) (N/A), *Agentic Control Plane — AI Audit Trails for SOC 2*. https://agenticcontrolplane.com/guides/soc2-audit-trails/
[^30]: David Crowe (Agentic Control Plane) (2026-04-30), *Agentic Control Plane — SOC 2 and HIPAA for AI agents: the compliance playbook*. https://agenticcontrolplane.com/blog/soc2-hipaa-ai-agent-compliance-playbook
[^38]: Rapid Claw (2026-04-18), *Rapid Claw — SOC 2 & HIPAA for AI Agents (Implementation Playbook)*. https://rapidclaw.dev/blog/soc2-hipaa-ai-agent-compliance
[^43]: Lorikeet Security (2026-04-29), *Lorikeet Security — ISO/IEC 42001 Deep Dive: The AI Management System Standard, Decoded (2026)*. https://lorikeetsecurity.com/blog/iso-42001-ai-management-system-2026
[^47]: Dr. Sarah Mitchell (Glocert) (2026-01-10), *Glocert — ISO 42001 Implementation: A Practical Roadmap*. https://www.glocertinternational.com/resources/guides/iso-42001-practical-roadmap
[^48]: DSALTA (N/A), *DSALTA — ISO 42001: The Complete Guide to AI Management System Certification*. https://www.dsalta.com/resources/ai-compliance/resources-ai-compliance-iso-42001-ai-management-system-guide
[^51]: GLACIS (2025-12-20), *GLACIS — ISO 42001 Guide: AI Management System*. https://glacis.io/guide-iso-42001
[^53]: ISO (International Organization for Standardization) (2023-12 (International Standard published; status 60.60)), *ISO/IEC 42001:2023 — AI management systems (official ISO standard page)*. https://www.iso.org/standard/81230.html
[^54]: ISO/IEC JTC 1/SC 42 (under development (AWI status)), *ISO/IEC AWI 42003 — Guidance on the implementation of ISO/IEC 42001*. https://www.iso.org/standard/91021.html
[^55]: ISO/IEC JTC 1/SC 42 (2025), *ISO/IEC 42005:2025 — AI system impact assessment*. https://iso.org/publication/PUB200420.html
[^56]: ISO official (N/A), *ISO 42001 Explained — official ISO insights page*. https://www.iso.org/home/insights-news/resources/iso-42001-explained-what-it-is.html
[^57]: Cloud Security Alliance (N/A (continuously updated 2025-2026)), *CSA AI Controls Matrix (AICM) — landing page*. https://cloudsecurityalliance.org/aicm
[^58]: Cloud Security Alliance (N/A (program launched 2025-2026)), *CSA STAR for AI — AI Security Assurance & Trust Framework*. https://cloudsecurityalliance.org/STAR_AI
[^59]: Cloud Security Alliance (2026-02-02), *CSA Agentic Trust Framework (ATF) — Zero Trust for AI Agents*. https://cloudsecurityalliance.org/blog/2026/02/02/the-agentic-trust-framework-zero-trust-governance-for-ai-agents
[^60]: Cloud Security Alliance (2026), *CSA Securing the Agentic Control Plane (CSAI Foundation)*. https://www.cloudsecurityalliance.org/articles/2026-securing-the-agentic-control-plane
[^61]: Cloud Security Alliance Labs (2026-03-19), *CSA Zero Trust for Securing Agentic AI (Lab paper)*. https://labs.cloudsecurityalliance.org/research/zero-trust-securing-openclaw-agentic-ai-v1-csa-styled/
[^62]: Cloud Security Alliance Research (2026-04-03), *CSA Research Note: AI Agent Governance Framework Gap (April 2026)*. https://labs.cloudsecurityalliance.org/research/csa-research-note-ai-agent-governance-framework-gap-20260403/
[^63]: Cloud Security Alliance (N/A (CSA artifact)), *CSA AICM & AI-CAIQ FAQ*. https://cloudsecurityalliance.org/artifacts/aicm-and-ai-caiq-faq
[^64]: Anthropic (continuously updated), *Anthropic Trust Center*. https://trust.anthropic.com/
[^65]: Anthropic PBC + Anthropic Ireland Limited (N/A (continuously updated)), *Anthropic Frontier Compliance Framework (FCF)*. https://trust.anthropic.com/doc/trust?r=iz673w96495gyjer8h78n&rid=69a61159be46d1990abe8f3a
[^66]: OpenAI (continuously updated (initial 2024-05-13)), *OpenAI Trust Portal*. https://trust.openai.com/

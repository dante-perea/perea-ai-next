---
title: "HIPAA + SOC 2 for Health-AI Agents: The Dual-Examination Field Manual"
subtitle: "PHI handling, BAA-covered subcontracting paths, de-identification evidence, and the cross-framework crosswalk auditors stack on top of SOC 2 + ISO 42001 + HITRUST + FDA PCCP + state-law disclosures"
publication: "perea.ai Research"
authors: ["Dante Perea"]
version: "1.0"
status: "Public draft"
date: "2026-05"
audience: "Compliance leads, security architects, AI governance officers, and procurement teams at covered entities and business associates deploying AI agents in 2026."
length: "~7,500 words"
license: "CC BY 4.0"
description: "A 2026 field manual for compliance and procurement teams running AI agents inside covered entities and business associates. Covers the six-framework stack auditors actually examine (HIPAA + SOC 2 + ISO 42001 + HITRUST AI + FDA PCCP + state-law disclosures), the four-vendor BAA landscape, Safe Harbor versus Expert Determination for AI training, the 17-field unified audit log, and the OCR enforcement pattern of 2025-2026."
profile: technical-playbook
dateModified: "2026-05-09"
version_history:
  - { version: "1.0", date: "2026-05-09", note: "initial publication" }
topical_entities:
  - "HIPAA"
  - "SOC 2"
  - "ISO 42001"
  - "HITRUST AI Assurance"
  - "FDA PCCP"
  - "Business Associate Agreement"
  - "Protected Health Information"
  - "OCR Risk Analysis Initiative"
  - "AI agents in healthcare"
  - "California AB 3030"
  - "Texas Responsible AI in Healthcare Act"
keywords:
  - "HIPAA SOC 2 dual examination 2026"
  - "AI agent BAA healthcare"
  - "HITRUST AI Security Assessment"
  - "ISO 42001 healthcare"
  - "FDA PCCP AI medical device"
  - "OCR Risk Analysis Initiative ransomware settlement"
  - "Safe Harbor 18 identifiers AI training"
  - "Expert Determination de-identification"
  - "AT-C 205 SOC 2+ HIPAA"
  - "Anthropic OpenAI Microsoft Google BAA"
  - "CA AB 3030 disclaimer"
  - "Texas Responsible AI in Healthcare Act"
---

## Foreword

This is a field manual for compliance, security, and procurement teams that run AI agents inside covered entities and business associates in 2026. It is not an explainer of HIPAA, of SOC 2, or of how AI agents work. It assumes the reader has already deployed at least one AI agent against PHI — or is about to — and now needs to answer the auditor's, the regulator's, and the customer's questions in one room without contradicting themselves.

The motivating observation: every team we talk to in 2026 starts the conversation as if the compliance stack is two-deep — HIPAA on the regulatory side, SOC 2 on the customer-assurance side. By the time procurement closes, the stack is six-deep: HIPAA Privacy/Security/Breach Notification, SOC 2 Trust Services Criteria, ISO 42001, HITRUST AI Assurance, FDA PCCP for software-as-a-medical-device, and a fragmented set of state-law disclosure regimes (CA AB 3030, Texas Responsible AI in Healthcare Act, Texas TRAIGA, Colorado AI Act). Auditors examine all six. Customers ask about all six. Regulators enforce three of them.

This paper synthesizes 70 primary and secondary sources — HHS OCR press releases, AICPA standards, ISO and HITRUST control documents, FDA final guidance, federal and state bill text, and 2025-2026 enforcement actions — into one place. Where prior perea.ai canon defined the protocol stack (MCP, AP2, ERC-4337) and the procurement-side architecture (B2A, agent payment), this paper defines the regulatory-side architecture: what evidence to keep, what BAA to sign, what audit log to ship, and which state's disclaimer to render at which interaction surface.

## Executive Summary

**Claim 1 — HIPAA + SOC 2 dual examination is the floor, not the ceiling. The actual stack is six frameworks deep.** AICPA's AT-C 205 SOC 2+ HIPAA examination, the AT-C engagement most teams target, produces one report covering Trust Services Criteria CC1-CC9 plus the HIPAA Security Rule control set[^53][^54][^13].

For AI agents specifically, three additional frameworks attach in 2026: ISO 42001 (the first international AI Management System standard, published December 2023, candidate harmonized standard under the EU AI Act)[^25][^23]; HITRUST AI Assurance (51 controls in the AI Risk Management Assessment plus 44 controls in the AI Security Assessment & Certification, with ai1/ai2 tiers underlying e1/i1/r2)[^35][^38]; and FDA PCCP for any AI-enabled medical device asserting algorithmic-change authority across 510(k), De Novo, or PMA pathways[^59][^60].

State-law disclosure (CA AB 3030 effective January 1 2025; Texas Responsible AI in Healthcare Act effective January 1 2026) is the sixth[^47][^48][^50].

**Claim 2 — The vendor BAA landscape is the binding architectural constraint.** As of April 2026, four AI vendors offer Business Associate Agreements at scale: Anthropic across three clouds (AWS Bedrock, Google Vertex AI, Microsoft Azure)[^2][^3][^5]; Microsoft (Azure for both M365 Copilot and Azure AI)[^18]; Google (Google Cloud and Vertex AI)[^18]; and OpenAI, but only via Azure OpenAI Service[^1][^18]. ChatGPT Business is explicitly excluded from BAA coverage[^1]. The OpenAI Realtime API audio modality, used for ambient AI scribes, is not covered under most BAAs in 2026[^68]. Beta Anthropic features (Claude in Office, Claude Design, Files API, Skills API, Code Execution, Computer Use) are not covered[^2]. The architecture follows the BAA, not the other way around.

**Claim 3 — OCR enforcement is now AI-aware, and the gating violation is risk analysis.** On April 23 2026, OCR settled four ransomware investigations totaling $1,165,000 affecting 427,000 patients — the 19th ransomware investigation OCR had completed and the 13th Risk Analysis Initiative action[^7][^10]. Across 2018-2026, OCR has documented a 264% increase in large ransomware breaches, and 2026 year-to-date HIPAA fines exceed $15 million[^10]. Separately, OCR data shows a 340% year-over-year rise in AI-related discrimination complaints in 2025[^18][^66]. The single most cited violation across 2025-2026 settlements is 45 CFR §164.308(a)(1)(ii)(A) — failure to conduct an accurate and thorough risk analysis[^7][^9][^10]. Two-year corrective action plans plus OCR monitoring is now the standard regulatory-probation outcome[^7][^11].

**Claim 4 — The unified audit log is the single artifact that survives all six frameworks.** A 17-field schema combining HIPAA §164.312(b) audit controls (5 fields), EU AI Act Article 12 logging requirements (12 additional fields covering input, model version, decision, confidence, and human review), and a healthcare-specific Field 17 capturing PHI minimum-necessary justification per §164.502(b), satisfies the audit-trail demands of HIPAA, SOC 2 CC7, ISO 42001 Annex A, HITRUST audit-logging domain, and FDA PCCP post-market surveillance simultaneously[^18][^29]. Immutability is enforced via CloudTrail S3 Object Lock, Azure Monitor immutable storage, or GCP Audit Logs compliance mode. The HIPAA six-year retention rule sets the floor[^68]. One log; six frameworks satisfied.

## Part I — Why this paper exists

The compliance environment that AI agents face in 2026 is not a single regulator with a single playbook. It is a stack of overlapping, simultaneously-enforcing regimes whose timelines collide in the same calendar quarter. OCR's Risk Analysis Initiative — now in its 13th completed action as of April 2026[^7] — is enforcing the HIPAA Security Rule against ransomware breaches with $103,000 to $600,000 settlements per incident[^7][^8][^11]. The Texas Responsible AI in Healthcare Act took effect January 1 2026, requiring clear and conspicuous AI disclosure pre-interaction with an emergency exception[^50]. Texas TRAIGA HB 149 imposes $10,000 to $200,000 per-violation penalties with affirmative defenses for NIST AI RMF compliance[^51]. The Colorado AI Act enforces June 30 2026[^51]. The EU AI Act's main high-risk obligations originally activate August 2 2026, with a proposed delay to December 2 2027 via the Digital Omnibus[^64]. The GENIUS Act framework adjacent to all of this activates January 1 2027. Five enforcement windows, four jurisdictions, one compliance team.

What "dual examination" actually means in this environment is narrower than it sounds. The AICPA's AT-C 205 SOC 2+ HIPAA engagement is the canonical dual-examination form: a service auditor opines on the operating effectiveness of controls mapped to both the SOC 2 Trust Services Criteria and the HIPAA Security Rule, producing a single report consumed by both customer-procurement and regulatory-readiness audiences[^53][^54][^56]. Censinet's 2026 overlap study quantified the redundancy: 30-40% of controls collapse cleanly across SOC 2 and HIPAA, and approximately 65 of the 134 ISO 27002 controls align with HIPAA Security Rule requirements[^16]. A common control framework — running one evidence collection cycle for both audiences — is the operating model[^14][^15].

A SOC 2 report alone is insufficient for healthcare deployments. SOC 2 controls are discretionary criteria selected by the service organization and are not government-enforced; HIPAA Journal's 2025 SOC 2 compliance guidance is explicit that SOC 2 is voluntary and that the AICPA Privacy Management Framework's points of focus must be adapted, not adopted, for HIPAA Privacy Rule oversight[^55]. SOC 2 reports the operating effectiveness of selected controls; HIPAA enforces a non-discretionary baseline. SOC 2 Type 2 (six to twelve months of operating-effectiveness evidence) is the de facto gold standard for healthcare procurement[^57], but it is the floor of a customer-assurance conversation, not the ceiling of a regulatory one.

HIPAA alone is insufficient for vendor-procurement. The customer-assurance market — which is what determines whether a covered entity will sign a contract with a business associate — expects independent third-party attestation, and the form that attestation takes is overwhelmingly SOC 2 (with HITRUST AI Assurance increasingly required for AI-bearing workloads on top of SOC 2)[^57][^58]. A clean HIPAA risk analysis on its own does not surface in a procurement security questionnaire; a SOC 2 Type 2 report does. The dual examination is the form in which both audiences are satisfied with one evidence set[^58].

This paper does not cover three adjacent topics. **Voice-first telephony** — the IVR / outbound-calling vertical — is out of scope; the audio-modality compliance question for ambient AI scribes is treated only as a constraint on architecture (the OpenAI Realtime API not-yet-covered question[^68]), not as a vertical analysis. **The EU AI Act's specific high-risk classification logic** for healthcare AI under Annex III is treated as a forcing function on the audit log and PCCP scope, but the full Article 27 FRIA methodology is its own canon[^64]. **Payer-side risk-adjustment audit** — the algorithmic-fairness audit regime for Medicare Advantage and Marketplace plans — is referenced only where it intersects with §164.312(b) audit-control requirements; the actuarial detail belongs to a separate paper.

What this paper does cover, in order: the six frameworks auditors actually stack (Part II); the vendor BAA landscape and what the four BAAs do and do not include (Part III); de-identification evidence under Safe Harbor versus Expert Determination, including the genomic and longitudinal-pattern caveats Safe Harbor's 1996-vintage 18-identifier list does not cover (Part IV); the 17-field unified audit log schema that satisfies HIPAA §164.312(b), EU AI Act Article 12, and §164.502(b) minimum-necessary justification simultaneously (Part V); the OCR enforcement pattern of 2025-2026 read as signal rather than headlines (Part VI); three production archetypes — ambient AI scribe, patient-facing agent, ML training pipeline — and the architectural decisions each forces (Part VII); and what 2027 looks like under the cumulative effect of all five active enforcement windows (Part VIII).

## Quotable Findings — Part I: Why dual examination is the floor

1. Per HHS OCR's April 23 2026 announcement[^7], the four-settlement enforcement action totaled $1,165,000 across 427,000 affected patients and was OCR's 19th ransomware investigation and 13th Risk Analysis Initiative action.
2. Per Censinet's February 13 2026 overlap study[^16], 30-40% of SOC 2 and HIPAA controls collapse cleanly across the two frameworks, and approximately 65 of the 134 ISO 27002 controls align with HIPAA Security Rule requirements.
3. Per AccountableHQ's April 29 2025 SOC 2-to-HIPAA mapping[^13], SOC 2 Common Criteria CC3 (risk assessment), CC6 (logical/physical access), CC7 (system operations), CC8 (change management), and CC9 (risk mitigation) carry the heaviest weight in the HIPAA crosswalk.
4. Per the AgentmodeAI April 26 2026 playbook[^18], OCR documented a 340% year-over-year rise in AI-related discrimination complaints in 2025 — the metric the EU AI Act's high-risk Annex III obligations were drafted against.
5. Per HIPAA Journal's April 25 2025 SOC 2 compliance guidance[^55], SOC 2 controls are voluntary and discretionary; the AICPA Privacy Management Framework's points of focus must be adapted, not adopted, for HIPAA Privacy Rule oversight.
6. Per Mosaic Life Tech's March 31 2026 state-law synthesis[^50], the Texas Responsible AI in Healthcare Act took effect January 1 2026 and requires clear and conspicuous AI disclosure pre-interaction with an emergency exception.

---

## Part II — The Six-Framework Stack

The six frameworks below are the ones an AI-deploying covered entity or business associate is examined against in 2026. They are not equivalent in legal force, in audit form, or in scope. They are equivalent only in the sense that all six show up in a single procurement-and-regulatory cycle, and a controls program that ignores any one of them is incomplete.

### 1. HIPAA Privacy / Security / Breach Notification Rules

The non-discretionary baseline. The Privacy Rule defines what counts as Protected Health Information, who may use and disclose it, and the §164.502(b) minimum-necessary standard that governs every disclosure including disclosures to AI agents. The Security Rule (§164.302-318) is the technical-and-administrative-safeguards layer: §164.308 administrative safeguards including the §164.308(a)(1)(ii)(A) risk-analysis requirement that drives most OCR enforcement actions[^7][^10]; §164.312(a) access controls; §164.312(b) audit controls — the field that anchors the unified audit log treated in Part V; §164.312(c) integrity controls; §164.312(d) authentication; §164.312(e) transmission security[^29]. The Breach Notification Rule (§164.402) defines the 60-day notification window whose missed deadline drove the May 15 2025 Vision Upright MRI settlement[^9]. The Privacy Rule's §164.514 de-identification provisions — Safe Harbor's prescriptive 18-identifier list (§164.514(b)(2)) and Expert Determination's risk-based standard (§164.514(b)(1)) — govern what data can leave the regulated boundary at all and are treated in detail in Part IV[^6][^32]. HIPAA is the only one of the six frameworks in this list that is government-enforced with civil monetary penalties; the others are voluntary, contractual, or sectoral.

### 2. SOC 2 Trust Services Criteria

The customer-assurance attestation. The AICPA's SOC 2 framework is governed by SSAE No. 23 (the June 2025 attestation-engagement standard) and runs against the 2017 Trust Services Criteria with their 2022 revised points of focus[^53][^54]. The Security trust category is mandatory and decomposes into nine Common Criteria categories: CC1 Control Environment, CC2 Communication and Information, CC3 Risk Assessment, CC4 Monitoring Activities, CC5 Control Activities, CC6 Logical and Physical Access Controls, CC7 System Operations, CC8 Change Management, and CC9 Risk Mitigation[^13]. The four optional categories are Availability, Processing Integrity, Confidentiality, and Privacy. For HIPAA crosswalk purposes, CC3, CC6, CC7, CC8, and CC9 carry the heaviest weight — CC3's risk-assessment requirement maps directly to §164.308(a)(1)(ii)(A); CC6's logical-access controls to §164.312(a); CC7's system-operations and monitoring to §164.312(b); CC8's change management to the SaMD-adjacent change-control disciplines required by FDA PCCP[^13][^29]. The audit form most commonly targeted for the dual examination is AT-C 205 SOC 2+ HIPAA — a service-auditor opinion on the operating effectiveness of mapped controls covering both regimes in a single report, with bridging letters for the period between the audit close and the report-distribution date[^56]. SOC 2 Type 2 (six to twelve months of operating-effectiveness evidence) is the procurement-default form[^57].

### 3. ISO/IEC 42001:2023 — AI Management System

The first international AI-management-system standard, published December 18 2023[^25]. It defines an AI Management System (AIMS) — the governance engine for AI development, deployment, and operation — built on a Plan-Do-Check-Act cycle and documented through an Annex A control set of 39 controls organized across domains spanning AI policies, internal organization, AI lifecycle management, third-party relationships, and AI-impact assessment[^25][^28]. The Statement of Applicability is the practical artifact teams produce: a controlled document that identifies which Annex A controls are applicable, why, and what supporting evidence is maintained[^28]. ISO 42001 is voluntary today but is the EU AI Act's leading candidate for a harmonized standard, which means certification will increasingly become the operative compliance evidence for high-risk AI systems entering the EU market[^25]. Accredited certification bodies as of 2026 include BSI (the first triple-accredited body across UKAS, RvA, and ANAB), Bureau Veritas, DNV, TÜV, and SGS[^27][^25]. Certification timelines run six to twelve months for greenfield programs and faster for organizations already certified to ISO 27001[^28]. The August 2 2026 EU AI Act high-risk activation date and the June 30 2026 Colorado AI Act effective date are the two near-term forcing functions[^51][^64].

### 4. HITRUST AI Assurance

Two pathways. The **AI Risk Management Assessment** is a 51-control set mapped to ISO/IEC 23894:2023 and NIST AI RMF v1.0 plus OWASP Top 10 for LLMs; it is non-certified, intended as a self-assessment to surface gaps before a third-party assessment[^35][^36]. The **AI Security Assessment & Certification** is a 44-control set, third-party validated, with quarterly threat-adaptive updates and a structure that allows AI-specific controls to be inherited from cloud providers (AWS, Azure, GCP)[^35][^37]. The certification structure is two-tier: **ai1** is valid one year and is added on top of an underlying e1 or i1 HITRUST CSF certification; **ai2** is valid two years (with an interim assessment by the one-year anniversary) and is added on top of an underlying r2 certification, which is the comprehensive HITRUST CSF tier[^38]. ai1 requires a score of 83 or higher; ai2 requires 62 or higher because the underlying r2 carries more of the load[^38]. Required AI security controls span twelve domains: 01 Information Protection, 06 Configuration Management, 07 Vulnerability Management, 09 Transmission Protection, 11 Access Control, 12 Audit Logging, 13 Education, 14 Third Party Assurance, 15 Incident Management, 16 BCP/DR, 17 Risk Management, and 19 Data Protection[^39]. The "Security for AI Systems" compliance factor is required in CSF v11.4.0 and later[^38]. The HITRUST r2 program reports a breach rate of less than 1% over 2022-2023 against industry double-digit baselines[^40].

### 5. FDA PCCP for Software-as-a-Medical-Device

For any AI agent that meets the SaMD definition — and FDA's published list[^61] shows approximately 62%[^61] of authorized AI devices are SaMD and approximately 63%[^61] are diagnostic — a Predetermined Change Control Plan is the mechanism by which the manufacturer reserves the right to ship algorithmic changes without re-clearance. Section 515C of the Federal Food, Drug, and Cosmetic Act, added by the Food and Drug Omnibus Reform Act in December 2022, authorized the PCCP framework. FDA's final guidance was issued December 3 2024 with implementation guidance August 18 2025 (docket FDA-2022-D-2628)[^59][^62]. A PCCP submission has three sections: a Description of Modifications enumerating the bounded changes the manufacturer expects to make; a Modification Protocol describing the data, methods, and acceptance criteria for each change type; and an Impact Assessment evaluating risk for each modification including bias-mitigation considerations[^59][^63]. The five Good Machine Learning Practice guiding principles — issued jointly by FDA, Health Canada, and the UK MHRA — are Focused and Bounded, Risk-Based, Evidence-Based, Transparent, and Total Product Lifecycle Perspective[^60]. As of May 2025, 26 devices had received authorized PCCPs[^64]. PCCPs are pathway-agnostic and apply to 510(k), De Novo, and PMA submissions[^59].

### 6. State-law AI disclosure

The fragmented sixth framework. **California AB 3030**, codified at Health and Safety Code §1339.75, took effect January 1 2025 and requires that any communication to a patient generated by generative AI containing patient clinical information bear a disclaimer plus clear instructions for contacting a human licensed provider; the obligation is exempted only when a licensed provider reads and reviews the communication before transmission[^47][^48][^52]. Enforcement runs through the relevant state agency by entity type — the California Department of Public Health for licensed health facilities, the Medical Board of California for physicians, the Osteopathic Medical Board for osteopaths[^48]. Each communication requires a fresh disclaimer regardless of whether the patient has previously received one; appointment scheduling, billing, and clerical communications are excluded from the definition of "patient clinical information"[^48][^52]. **Texas Responsible AI in Healthcare Act**, effective January 1 2026, requires clear and conspicuous pre-interaction disclosure that the patient is interacting with AI, with an emergency-care exception[^50]. **Texas TRAIGA HB 149** runs in parallel with $10,000 to $200,000 per-violation penalties and provides affirmative defenses for entities that can demonstrate NIST AI RMF compliance[^51]. **Colorado AI Act** enforces June 30 2026 against high-risk AI systems including those operating in healthcare[^51]. **California SB 53** governs frontier AI developers — defined by training-compute thresholds at or above 10^26 FLOPS — with reporting penalties up to $1 million per violation[^51]; **CA AB 489** specifically prohibits healthcare AI false-licensing claims; **CA AB 2013** mandates training-data transparency; **SB 243** governs companion chatbots[^51]. The compliance posture for a multi-state deployment is consequently a fragmented disclosure logic at the interaction surface plus a centralized governance program at the controls layer.

## Quotable Findings — Part II: Six frameworks; one program

1. Per Regulome's ISO 42001 compliance guide[^25], ISO/IEC 42001:2023 was published December 18 2023 as the first international AI Management System standard and is the leading candidate for harmonized status under the EU AI Act.
2. Per BeyondScale's March 21 2026 certification guide[^28], ISO 42001's Annex A control set comprises 39 controls organized across AI policies, internal organization, AI lifecycle management, third-party relationships, and AI-impact assessment.
3. Per HITRUST's HAA 2024-008 launch advisory[^38], ai1 certification is valid one year and runs on top of an e1 or i1 underlying CSF certification; ai2 is valid two years on top of an r2.
4. Per HITRUST's AI Security Assessment FAQ[^39], the AI security control set spans twelve CSF domains including audit logging (12), third-party assurance (14), incident management (15), and data protection (19).
5. Per FDA's December 3 2024 PCCP final guidance and August 18 2025 implementation update[^59][^64], 26 AI-enabled medical devices had received authorized PCCPs as of May 2025 across 510(k), De Novo, and PMA pathways.
6. Per the FDA-Health Canada-MHRA joint principles document[^60], the five Good Machine Learning Practice guiding principles are Focused and Bounded, Risk-Based, Evidence-Based, Transparent, and Total Product Lifecycle Perspective.
7. Per California AFL-25-07[^47] and the AB 3030 bill text[^48], every patient-facing AI communication containing clinical information requires a fresh disclaimer regardless of prior contact, except when a licensed provider has read and reviewed the communication.
8. Per the Baker Botts US AI law update[^51], Texas TRAIGA HB 149 carries $10,000 to $200,000 per-violation penalties and provides affirmative defenses for NIST AI RMF compliance.

---

## Part III — The Vendor BAA Landscape

The most consequential architectural decision in a 2026 health-AI deployment is which vendor's BAA the workload runs under, because the BAA defines what data can flow through the model, what features can be used, and what the upstream subprocessor flow-down obligations look like. Four vendors offer BAAs at scale; the four offers are not equivalent.

### Anthropic — three-cloud BAA, click-to-accept Enterprise

Anthropic's structurally distinct position is that its BAA covers Claude API usage across three clouds — AWS Bedrock, Google Cloud Vertex AI, and Microsoft Azure — under a single enterprise contract[^2][^4]. Inside the Claude Enterprise admin surface, the Primary Owner can click-to-accept a BAA via Data and Privacy settings; no separate paper document is required[^3]. Before December 2 2025 a separately-signed API BAA and Enterprise BAA were both required; after December 2 2025 a single agreement covers both surfaces[^3]. Messages API features explicitly inside BAA scope include prompt caching, structured outputs, the memory feature, web search, the bash tool, and the text-editor tool[^2]. Features explicitly outside BAA scope include Workbench/Console, Claude Free/Pro/Max/Team plans, Cowork, and the beta surface (Claude in Office, Claude Design, Files API, Skills API, Code Execution, and Computer Use)[^2]. Self-serve Enterprise, Team, and individual plans cannot enable HIPAA-ready mode[^3]. Zero Data Retention is the API default for HIPAA-ready accounts; the API enforces feature restrictions at the request layer by returning a 400 error when a HIPAA-enabled organization sends a request invoking a non-eligible feature[^5]. Claude Code CLI is ZDR-eligible only for qualified accounts[^2].

### Microsoft — Azure for both M365 Copilot and Azure AI

Microsoft's BAA covers Azure-hosted services across both M365 Copilot (the productivity-suite surface) and Azure AI (the developer-platform surface)[^18]. Azure OpenAI Service is the BAA-covered path for OpenAI model usage; the same models accessed through OpenAI's direct API platform are governed by the OpenAI BAA pathway, not Microsoft's. Azure-native logging and immutability primitives — Azure Monitor immutable storage, Azure Sentinel for SIEM, Microsoft Purview for data-classification — are the substrate most M365-Copilot-bearing healthcare deployments use to satisfy §164.312(b) audit-control evidence[^18][^68].

### Google — Google Cloud and Vertex AI

Google's BAA covers Google Cloud and Vertex AI under the Google Cloud Platform terms[^18]. Vertex AI Model Garden hosts Anthropic Claude (also covered under Anthropic's three-cloud BAA), Google's own Gemini, and select third-party models. The flow-down structure makes Google Cloud the BAA-signing party with Anthropic as the model provider for Claude-on-Vertex deployments — the Anthropic BAA does not need to be separately signed for Claude usage on Vertex by an entity that has signed Google's Cloud BAA[^2][^18]. GCP Audit Logs in compliance mode is the Google substrate for §164.312(b) audit controls[^68].

### OpenAI — Azure OpenAI Service only, plus narrow direct-API path

OpenAI's BAA is signed via baa@openai.com on a case-by-case basis, typically completed within a few business days[^1]. The API platform offers BAA coverage without an enterprise agreement requirement; ChatGPT Enterprise and Edu offer BAA only via sales-managed enterprise accounts[^1]. **ChatGPT Business is explicitly excluded from BAA coverage** — it is the consumer-grade product surface and may not be used with PHI[^1]. ChatGPT for Clinicians has its own in-product BAA flow[^1]. The most-cited 2026 carve-out in deployment-architecture decisions is that the OpenAI Realtime API audio modality — used for ambient AI scribes and voice-bearing patient interactions — is not covered under most BAAs in 2026, including the standard OpenAI BAA[^68][^18]. Architecturally, this forces ambient-scribe deployments toward BAA-covered audio paths: AssemblyAI, Deepgram, AWS HealthScribe, or Anthropic Claude on Bedrock with a separate ASR layer[^68].

### Subprocessor flow-down

Under 45 CFR §164.504(e) — the BAA-content requirement — every subcontractor of a business associate that creates, receives, maintains, or transmits PHI on behalf of that business associate must itself sign a BAA[^21]. Cloud providers (AWS, Azure, GCP) sign BAAs as subprocessors when AI vendors host their model infrastructure on those clouds[^21][^22]. Beyond the cloud layer, observability and analytics tools that capture PHI in telemetry — Sentry for error tracking, Datadog for metrics, Segment for event routing, Mixpanel for product analytics — require BAAs when their telemetry payloads include patient context[^22]. The structural failure mode here is logging PHI into a tool that does not have a BAA, which converts a routine production-operations action into a Privacy Rule disclosure violation. The architectural answer is to either route PHI-containing telemetry only to BAA-covered tools, or to scrub PHI from telemetry before egress.

### What the BAA does not protect

A BAA establishes the contractual basis for PHI flow between covered entity and business associate; it does not substitute for the underlying compliance obligations[^20]. The §164.308(a)(1)(ii)(A) risk analysis must still be conducted; minimum-necessary discipline must still be enforced at every disclosure boundary; encryption-at-rest and -in-transit must still be implemented; audit trails must still be retained for six years; access policies, training programs, and incident-response plans must still be in place[^20]. "BAA is permission, not protection" is the operative framing[^20]. The vendor's BAA permits the PHI flow; the deploying entity's controls program protects it.

## Quotable Findings — Part III: BAA scope is the architecture constraint

1. Per Anthropic's privacy-center BAA documentation[^2], Messages API features inside BAA scope as of 2026 include prompt caching, structured outputs, memory, web search, the bash tool, and the text-editor tool; the beta surface (Claude in Office, Claude Design, Files API, Skills API, Code Execution, Computer Use) is explicitly excluded.
2. Per the Claude Help Center HIPAA-ready Enterprise documentation[^3], a single agreement signed after December 2 2025 covers both API and Enterprise plans where two separate BAAs were previously required.
3. Per OpenAI's BAA help article[^1], ChatGPT Business is explicitly excluded from BAA coverage; API platform usage and sales-managed ChatGPT Enterprise / Edu accounts are eligible.
4. Per the AgentmodeAI 2026 vendor-landscape playbook[^18] and the ForaSoft AI scribe architecture analysis[^68], the OpenAI Realtime API audio modality is not covered under most BAAs in 2026, forcing ambient-scribe deployments toward AssemblyAI, Deepgram, AWS HealthScribe, or Anthropic on Bedrock.
5. Per the BAA Generator vendor table[^22] and the PolicyGuard 45 CFR analysis[^21], observability tools (Sentry, Datadog, Segment, Mixpanel) require BAAs when their telemetry payloads include PHI; routing PHI-bearing telemetry to non-BAA tools is itself a Privacy Rule disclosure.
6. Per the TopflightApps 2026 OpenAI compliance guide[^20], "BAA is permission, not protection" — the vendor BAA permits the PHI flow but does not substitute for the deploying entity's risk analysis, minimum-necessary controls, encryption, audit retention, or training program.

---

## Part IV — De-identification: Safe Harbor vs Expert Determination for AI Training

The HIPAA Privacy Rule offers two methods by which a covered entity may convert PHI into non-PHI: Safe Harbor (§164.514(b)(2)) and Expert Determination (§164.514(b)(1))[^6]. Both methods are old — the Privacy Rule's de-identification provisions date to the 2003 effective date of the rule and were last substantively updated by HHS guidance in 2012 — and neither was designed for modern AI training pipelines. The two methods produce very different evidence requirements and very different downstream constraints on what data flows can occur.

### Safe Harbor: the prescriptive 18-identifier checklist

Safe Harbor (§164.514(b)(2)) is a prescriptive checklist. A dataset is de-identified under Safe Harbor when 18 specific categories of identifiers are removed both from the data subject and from the data subject's relatives, employers, and household members[^6][^32]. The 18 identifiers are: names; geographic subdivisions smaller than a state (with the ZIP-code exception below); all date elements (except year) directly related to an individual; telephone numbers; vehicle identifiers including license-plate numbers; fax numbers; device identifiers and serial numbers; email addresses; URLs; social security numbers; IP addresses; medical record numbers; biometric identifiers; health plan beneficiary numbers; full-face photographs and any comparable images; account numbers; any other unique identifying number, characteristic, or code; and certificate or license numbers[^32][^34]. The ZIP-code rule has a narrow exception: the first three digits of a ZIP code may be retained if the geographic unit formed by combining all ZIP codes with those initial three digits contains more than 20,000 people; otherwise the first three digits must be set to 000[^30]. Per 2020 census data, 17 three-digit ZIP areas in the US fall below the 20,000-population threshold and must be zeroed[^30]. Dates collapse to year only; ages 90 and over collapse to a single age category[^30]. The covered entity must additionally have no actual knowledge that the de-identified data could be used alone or in combination with other information to identify an individual[^32][^34].

### Expert Determination: the risk-based standard

Expert Determination (§164.514(b)(1)) is a risk-based standard. A statistician or other qualified expert applies generally-accepted statistical and scientific principles and methods to determine that the risk is "very small" that the information could be used, alone or in combination with other reasonably available information, to identify the individual[^6][^32]. The expert documents the methods, the analysis, and the supporting data[^32]. The canonical six-step process is: (1) define the data context including the receiving environment and the data-recipient population; (2) threat-model the relevant re-identification adversaries; (3) measure the risk by enumerating quasi-identifiers and computing distinguishability metrics; (4) apply treatments such as generalization, perturbation, suppression, or synthetic-data substitution; (5) validate by simulating linkage attacks; (6) conclude with a written determination retained for OCR audit[^32]. Expert Determination is the route most modern AI-training de-identification pipelines take because Safe Harbor's 1996-vintage list does not cover the identifying signals an AI training corpus actually carries.

### What Safe Harbor does not cover in 2026

Three categories of identifying signal sit outside Safe Harbor's 18-identifier list and force the conversation toward Expert Determination plus supplementary controls. **Genomic sequences** are not on the Safe Harbor list, but a whole-genome or even a whole-exome sequence is a unique identifier; rare-disease cohorts are particularly exposed — there are approximately 7,000 Huntington's disease patients in the US, and a longitudinal genomic record can be re-identified against publicly-known patient registries with high probability[^33]. **Longitudinal diagnosis patterns** are not on the list, but the sequence of ICD codes, procedure codes, and prescription fills across a multi-year record can serve as a near-unique identifier when matched against public datasets like the SSA Death Master File or state hospital-discharge data[^33]. **Free-text clinical notes** require both rules-based scrubbing for the 18 identifier categories and named-entity-recognition (NER) for the categories of identifying language those rules miss — provider names embedded in dictation, employer names mentioned in social history, geographic references in clinical narrative[^31][^33]. The technical pattern that has emerged is a multi-pass pipeline: rules-based regex pass for structured identifier categories (SSNs, dates, phone numbers, ZIPs), NER pass for unstructured-text identifiers, context-aware verification for confidence scoring, and rule-based fallback for low-confidence spans[^31].

### Supplementary controls beyond de-identification

For genomic and longitudinal AI-training pipelines, three supplementary control patterns appear in 2026 deployments. **Synthetic data generation** replaces real records with statistically-similar synthetic records that preserve aggregate distributions; for genomic data, synthetic generation is increasingly the default training-data path because de-identification of real genomic sequences is structurally fraught[^30][^31]. **Differential privacy** adds calibrated noise to the training process such that the trained model cannot leak individual training records above a defined privacy budget; this is a model-level rather than data-level control. **Federated learning** keeps training data inside the covered-entity boundary and ships model updates rather than raw data to a central aggregator; the de-identification problem does not arise because PHI never leaves the regulated boundary[^30].

### Inference-time PHI re-introduction

The structural failure mode that Safe Harbor and Expert Determination together do not address is what happens at inference time. A model trained entirely on de-identified data is itself non-PHI, and the trained-model artifact inherits the non-PHI status of its training data[^33]. But a user-supplied prompt at inference time can re-introduce PHI into the system — a clinician typing a patient's name and history into a model interface re-attaches identifying signal to the inference. The downstream consequence is that prompt logs, response caches, and feedback-loop datasets capturing those prompts are themselves PHI and fall back inside the regulated boundary[^33]. The architectural answer is that prompt-handling, log retention, and training-feedback pipelines all run under BAA-covered infrastructure and against §164.312(b) audit-control evidence, even when the underlying base model was trained on de-identified data only.

## Quotable Findings — Part IV: Safe Harbor's 18 identifiers turn 25 in 2028

1. Per HHS OCR's de-identification guidance[^6] and AccountableHQ's Safe Harbor versus Expert Determination explainer[^32], Safe Harbor (§164.514(b)(2)) is a prescriptive 18-identifier removal checklist while Expert Determination (§164.514(b)(1)) is a risk-based "very small" standard validated by a qualified expert.
2. Per Nirmitee's 2026 de-identification engineering guide[^30], the Safe Harbor ZIP-code rule retains only the first three digits and zeroes them entirely when the resulting geographic area falls below 20,000 people — 17 three-digit ZIP areas in the US fall below the threshold per 2020 census data.
3. Per AccountableHQ's Expert Determination guidance[^32], the canonical six-step process is define context → threat-model adversaries → measure quasi-identifier risk → apply treatments → validate via simulated linkage → conclude with retained written determination.
4. Per Netguardia's April 25 2026 ML-training analysis[^33], genomic sequences, longitudinal diagnosis patterns, and free-text clinical notes are not on the Safe Harbor list and require Expert Determination plus supplementary controls; the rare-disease re-identification floor is approximately 7,000 Huntington's patients in the US.
5. Per Roving Health's March 2 2026 AI-training analysis[^31], modern NER-plus-rules pipelines combine confidence scoring with rule-based verification and sampling to detect identifier categories that Safe Harbor's list does not capture.
6. Per HIPAA Journal's December 19 2025 de-identification update[^34], the OCR-audit retention requirement applies to Expert Determination methods and parameters; aliases, Medicare Beneficiary Numbers, gender, LGBTQ+ statuses, and emotional support animal references appear as additional identifying signals to address.

---

## Part V — The 17-Field Unified Audit Log

A single audit log can satisfy HIPAA §164.312(b), EU AI Act Article 12, SOC 2 Common Criteria CC7, ISO 42001 Annex A audit-and-monitoring controls, HITRUST CSF audit-logging domain 12, and FDA PCCP post-market surveillance simultaneously — if it is designed for that purpose from the start[^18][^29]. The 17-field schema below is the consolidation that has emerged across 2025-2026 deployment patterns. The first 14 fields satisfy the EU AI Act's automatic-recording requirement for high-risk AI systems under Article 12; fields 15 and 16 satisfy the §164.312(b) audit-control requirements specific to PHI access; field 17 captures the §164.502(b) minimum-necessary justification[^18].

### Fields 1-14: EU AI Act Article 12 substrate

The EU AI Act's Article 12 logging requirement, which activates with the high-risk-system obligations (originally August 2 2026, with a proposed delay to December 2 2027 via the Digital Omnibus)[^64], requires automatic recording of events for the duration of the system's lifetime. The 14-field substrate that has consolidated across implementations covers: (1) event timestamp in UTC with ISO 8601 precision; (2) event type identifier (inference, training-job, model-update, configuration-change); (3) input identifier or hash; (4) input modality (text, image, audio, structured data); (5) model identifier and version string; (6) model-card URI; (7) inference output or output hash; (8) confidence or probability score where applicable; (9) routing decision (which downstream tool, retrieval source, or human reviewer was invoked); (10) policy enforcement decisions (which guardrails fired, which did not); (11) latency measurements end-to-end and per-component; (12) error codes and exception traces; (13) data-source provenance (training-data slice, retrieval-corpus version, RAG document IDs); (14) human-in-the-loop event identifiers when present[^29][^18].

### Fields 15-16: HIPAA §164.312(b) audit-control supplements

For PHI-bearing inferences, two additional fields are required. Field 15 is the structured user identifier — the identity of the person or service principal whose PHI is being accessed and the identity of the principal accessing it, both in a structure that supports later access reviews and the breach-notification reconstruction process[^18][^29]. Field 16 is the structured event identifier with a stable schema that allows §164.308(a)(1)(ii)(D) information-system-activity-review queries to run efficiently across years of logs[^18]. Together these two fields satisfy §164.312(b)'s requirement to implement hardware, software, and procedural mechanisms that record and examine activity in information systems containing or using ePHI.

### Field 17: PHI minimum-necessary justification

The healthcare-specific field. Field 17 captures, per inference event involving PHI, the structured reason that this specific PHI was disclosed to this specific agent at this specific moment — encoded as either a treatment-payment-operations purpose code, a documented patient authorization reference, or an Expert Determination policy reference for de-identified-data flows[^18]. This is the field that satisfies §164.502(b)'s minimum-necessary standard at audit time. Without field 17, an OCR Risk Analysis Initiative review can flag the audit log as failing to demonstrate minimum-necessary discipline at the PHI-disclosure boundary.

### Three architectural layers

The unified audit log sits at the intersection of three control layers. **Layer A — access boundaries — IAM identity** is the upstream authentication-and-authorization substrate: who is the caller, what role do they hold, what scope-restriction policies apply, and what tools are they authorized to invoke[^18]. Layer A populates field 15. **Layer B — PHI flow map — per-agent workflow** is the middle substrate: for the specific agent in question, what PHI categories enter, what transformations occur, what categories exit, what subprocessors see what slices[^18]. Layer B populates fields 7, 9, 13, and 17. **Layer C — tool-config technical implementation** is the downstream substrate: the actual cloud-native logging primitives that capture and persist the events[^18]. Layer C populates fields 1, 11, 12, and 14.

### Immutability and retention

The HIPAA six-year retention rule is the floor[^68]. Immutability primitives across the three major clouds: **AWS** uses CloudTrail with S3 Object Lock in compliance mode for write-once-read-many enforcement[^68]. **Azure** uses Azure Monitor with immutable storage policies plus Microsoft Sentinel for SIEM correlation[^68]. **GCP** uses Cloud Audit Logs in compliance mode plus Cloud Storage Bucket Lock for retention enforcement[^68]. The HITRUST AI Security Assessment requires all three immutability properties (write-protection, retention enforcement, and tamper-evidence) for Domain 12 audit-logging controls[^39]. SOC 2 CC7 maps to the same immutability requirement at the Trust Services Criteria layer[^13]. ISO 42001 Annex A's monitoring and audit-trail controls require comparable evidence at the AIMS layer[^25][^28]. One log; six frameworks; six years.

### What the log does not capture

Two categories of event remain outside the 17-field schema. **Prompt-template versions** — for retrieval-augmented agents whose prompts are dynamically composed from templates plus retrieved context — require separate template-version tracking that joins to the inference event via field 5 (model identifier). **Privacy-preserving differential-privacy noise events** — for AI training pipelines that apply differential privacy — require a parallel privacy-budget log that tracks the cumulative epsilon spent across training rounds; this is a Field-13-adjacent log but with its own retention semantics. Both extensions are deployment-specific and are documented in the Statement of Applicability for the AIMS rather than the unified log itself.

## Quotable Findings — Part V: One audit log; three frameworks satisfied

1. Per the AgentmodeAI April 26 2026 playbook[^18] and the COMPEL Framework multi-framework mapping[^29], a 17-field unified audit log combining HIPAA §164.312(b), EU AI Act Article 12, and PHI minimum-necessary justification under §164.502(b) satisfies HIPAA, SOC 2 CC7, ISO 42001 Annex A, HITRUST domain 12, and FDA PCCP post-market surveillance simultaneously.
2. Per the AgentmodeAI playbook[^18], Field 17 of the unified log captures the §164.502(b) minimum-necessary justification per inference — a treatment-payment-operations purpose code, a patient-authorization reference, or an Expert Determination policy reference for de-identified-data flows.
3. Per the ForaSoft AI scribe architecture analysis[^68], immutability primitives are CloudTrail with S3 Object Lock for AWS, Azure Monitor immutable storage for Azure, and Cloud Audit Logs in compliance mode for GCP — all three required to satisfy HITRUST Domain 12 audit-logging controls.
4. Per the HITRUST AI Security FAQ[^39], audit-logging domain 12 sits inside the twelve required AI security domains alongside transmission protection, access control, third-party assurance, and incident management.
5. Per AccountableHQ's TSC-to-HIPAA mapping[^13], SOC 2 Common Criteria CC7 (System Operations) is the trust-services-criteria mapping for the HIPAA §164.312(b) audit-control requirements satisfied by the unified log.
6. Per Reg-Intel's 2026 FDA + EU AI Act crosswalk[^64], the EU AI Act high-risk obligations originally activate August 2 2026, with a proposed delay to December 2 2027 via the Digital Omnibus — the activation date that drives the timing of Article 12 logging deployment.

---

## Part VI — OCR Enforcement Patterns 2025-2026

OCR enforcement in 2025-2026 is best read as a single pattern across roughly a dozen settlements rather than as a series of independent incidents. The pattern: a covered entity or business associate experiences a breach (typically ransomware or phishing); OCR opens an investigation; the investigation finds that the entity never conducted an accurate and thorough §164.308(a)(1)(ii)(A) risk analysis, or conducted one that did not reflect the actual environment; OCR settles for an amount calibrated to the entity's size and the affected-individual count; a two-year corrective action plan plus OCR monitoring follows. The 13th Risk Analysis Initiative action — the four-settlement bundle of April 23 2026 — is the canonical recent example[^7][^10].

### April 23 2026 — four ransomware settlements

The headline action of 2026 to date. OCR settled four ransomware investigations totaling $1,165,000 across approximately 427,000 affected patients — its 19th completed ransomware investigation and 13th Risk Analysis Initiative action[^7]. Two of the four settlements published in detail: Roanoke-area entity RWHG paid $320,000 across three individuals' compromised data following a December 2020 breach where OCR's investigation found the entity had failed to conduct a risk analysis; Assured Imaging paid $500,000 across 24,813 affected individuals following a May 2020 PYSA-ransomware attack that exposed Social Security numbers, driver's license numbers, diagnoses, lab results, and medication records[^7]. Both settlements imposed two-year corrective action plans with quarterly compliance reporting to OCR[^7].

### February 19 2026 — TWRTC Settlement

The 11th Risk Analysis Initiative action. Top of the World Ranch Treatment Center, an Illinois substance-use-disorder provider, paid $103,000 following a March 2023 phishing attack that compromised the ePHI of 1,980 patients[^8]. The settlement explicitly cited the entity's failure to conduct an accurate and thorough risk analysis as the gating violation[^8].

### May 15 2025 — Vision Upright MRI

The settlement that demonstrated OCR's willingness to enforce against small entities. Vision Upright MRI paid $5,000 — a small absolute number — following an unsecured PACS server that exposed the medical images of 21,778 patients[^9]. The investigation found that the entity had never conducted a risk analysis at any point in its operating history and had failed to provide timely 60-day breach notification[^9]. The signal: small entity size does not exempt from enforcement, and the absence of any risk-analysis documentation is dispositive.

### April 23 2025 — PIH Health phishing settlement

The largest single-entity 2025 settlement on this pattern. PIH Health paid $600,000 following a phishing breach that compromised 45 employee accounts and exposed the ePHI of 189,763 individuals[^11]. The settlement cited three distinct violations: failure to use or disclose PHI per the Privacy Rule, failure to conduct a risk analysis, and failure to provide timely breach notification[^11]. The two-year corrective action plan layered three workstreams: training program, risk-analysis remediation, and breach-notification process redesign[^11].

### The AI-augmented phishing settlement

OCR's "First Ever Phishing Cyber-Attack Investigation," settled for $480,000 against a Louisiana urgent-care entity following an AI-augmented phishing campaign[^12]. The HHS HC3 white paper from October 2023 is the policy substrate for this enforcement category — it documents the FraudGPT subscription model at $200 per month and the operational pattern by which generative-AI tools are used to craft contextually-tailored phishing emails at scale[^12]. The settlement amount was calibrated to the entity's size; the corrective action plan emphasized AI-aware phishing-resistance training as a distinct workstream from generic security-awareness training[^12].

### The aggregate signal

Three numbers compress the 2025-2026 enforcement environment. **264%[^10] increase in large ransomware breaches since 2018** — the trend metric OCR cites in nearly every Risk Analysis Initiative press release[^10]. **$15 million-plus in HIPAA fines year-to-date 2026** as of the April 23 announcement[^10]. **340% year-over-year rise in AI-related discrimination complaints in 2025** — the metric driving OCR's increased AI scrutiny across both the Privacy Rule (minimum-necessary disclosures) and Section 1557 of the ACA (algorithmic discrimination)[^18][^66]. The single most cited specific violation across all 2025-2026 settlements is 45 CFR §164.308(a)(1)(ii)(A) — failure to conduct an accurate and thorough risk analysis[^7][^9][^10][^11]. The standard outcome is a two-year corrective action plan with OCR monitoring — what the trade press has begun calling "regulatory probation"[^10][^11].

### What enforcement is signaling for AI specifically

Two signals beyond the headline numbers. First, OCR's framing increasingly treats AI agents as a Privacy Rule disclosure boundary: every PHI flow into an AI agent must be traceable to a treatment-payment-operations purpose, a patient authorization, or an Expert Determination policy reference, and the §164.502(b) minimum-necessary justification must be documentable per inference[^18]. This is what Field 17 of the unified audit log addresses. Second, the AI-augmented phishing settlement category is structurally different from the ransomware category: it enforces against the defender for failing to anticipate AI-augmented social-engineering attacks, not against an attacker who used AI[^12]. The compliance-program implication is that phishing-resistance training, email-authentication hardening (DMARC, BIMI), and identity-verification at provider-onboarding must all be reframed against an attacker model that includes generative-AI capability.

---

## Part VII — Production Archetypes

Three deployment patterns capture most 2026 health-AI agent production. Each forces a distinct architectural choice.

### Archetype A — Ambient AI scribe

The dominant 2026 deployment. Microsoft Nuance DAX Copilot was embedded in Epic and reached general availability January 2024[^65], and crossed 200,000 clinician users in 2026[^69]. Epic released its own native Epic AI Charting in February 2026, powered by Microsoft DAX, with Group Health Cooperative of South Central Wisconsin reporting 60 minutes per clinician per day saved as the first deployment[^67][^70]. Abridge raised a $300 million Series D in 2024 as the leading independent ambient-scribe vendor[^68]. Pricing across the category runs $200-$600 per clinician per month for the integrated suites and $0.10-$0.30 per minute on AWS HealthScribe for build-your-own deployments[^68][^69].

The HIPAA failure mode that defines the architecture: the OpenAI Realtime API audio modality is not covered under most BAAs in 2026[^68][^18]. Any ambient-scribe deployment that routes raw clinical audio through OpenAI Realtime is therefore outside BAA scope and constitutes a Privacy Rule disclosure violation. The architectural answer for BAA-covered audio paths is one of: AssemblyAI (signed BAA, healthcare-tuned ASR), Deepgram (signed BAA, low-latency streaming), AWS HealthScribe (HIPAA-eligible AWS service with built-in clinical-summary generation), or Anthropic Claude on Bedrock paired with a separately-BAA-covered ASR layer[^68]. The Microsoft path — Nuance DAX inside Azure — handles the audio modality natively under Microsoft's BAA[^65][^70].

The audit-log requirement for ambient scribes is particularly strict because every clinical encounter is a §164.502(b) minimum-necessary disclosure boundary: the field-17 justification must encode that the recording is occurring under treatment-payment-operations purpose for the specific patient encounter, and the immutability primitive must satisfy the HIPAA six-year retention rule plus any state-specific medical-record retention requirements[^18][^68].

### Archetype B — Patient-facing AI agent

The highest-risk 2026 deployment. Under the EU AI Act's Annex III high-risk classification, any AI system that interacts directly with patients about clinical content qualifies as a high-risk system subject to the full compliance regime — risk-management system, data governance, technical documentation, record-keeping (Article 12), transparency obligations, human oversight, accuracy/robustness/cybersecurity, conformity assessment, and post-market monitoring[^64]. The four AgentmodeAI conditions for safe deployment — BAA scope, dual-purpose audit substrate, PHI flow map, access boundary IAM — must all hold in their strongest form[^18].

State-law disclosure obligations stack on top of EU AI Act compliance for any deployment touching California or Texas patients. California AB 3030 requires the disclaimer plus human-contact instructions on every patient communication containing clinical information[^47][^48]. The Texas Responsible AI in Healthcare Act requires clear and conspicuous pre-interaction disclosure[^50]. Colorado AI Act enforces June 30 2026 against high-risk systems including healthcare AI[^51]. The disclosure substrate must be implemented at the interaction surface (web chat, mobile app, IVR, SMS) per state, with state-detection logic upstream of the interaction.

The governance prerequisite: a C-level role-holder with documented authority over AI procurement, deployment, and incident response — typically titled Head of AI Governance or Chief AI Officer — with direct sign-off on every patient-facing AI deployment and on the procurement of every model-provider contract[^18]. Without this role-holder, the compliance-program documentation chain breaks at the first OCR or state-board inquiry.

### Archetype C — ML training data pipeline

The deepest-pipe deployment. ML training pipelines that consume PHI face the de-identification fork from Part IV: Safe Harbor's 18-identifier removal for tabular and structured data, Expert Determination for genomic, longitudinal-pattern-bearing, and free-text-clinical-note data, and synthetic-data generation as the supplementary control for genomic and rare-disease cohorts[^30][^31][^32]. The unstructured-text branch requires NER plus rules-based scrubbing as a multi-pass pipeline with confidence scoring[^31][^33].

BAAs are required at every model-provider hop in the pipeline. If the training stack uses OpenAI for embedding generation, Anthropic for synthetic-data generation, and AWS Bedrock for fine-tuning — three BAAs (or a single BAA covering the cloud sub-processor pattern) is the contractual baseline[^21][^22]. Observability tools (Sentry, Datadog, Segment, Mixpanel) capturing telemetry that includes PHI need BAAs as well[^22].

The structural failure mode that this archetype addresses: inference-time prompt logging is in-scope as PHI when prompts include patient context[^33]. A model trained on de-identified data is non-PHI; the inference-time prompt log is PHI when a clinician's prompt includes patient identifiers. Prompt-log retention, prompt-cache eviction policy, and feedback-loop dataset construction must all run under BAA-covered infrastructure with §164.312(b) audit-control evidence[^33][^18].

## Quotable Findings — Part VI/VII: Three archetypes; one stack

1. Per HHS OCR's April 23 2026 announcement[^7], the four-settlement enforcement bundle totaled $1,165,000 across approximately 427,000 affected patients and was OCR's 19th completed ransomware investigation and 13th Risk Analysis Initiative action.
2. Per the CyberSignal April 24 2026 enforcement-trend analysis[^10], OCR documented a 264% increase in large ransomware breaches since 2018 and 2026 year-to-date HIPAA fines exceeded $15 million by April 24.
3. Per the AgentmodeAI 2026 playbook[^18] and AgentmodeAI's enforcement analysis[^66], OCR documented a 340% year-over-year rise in AI-related discrimination complaints in 2025.
4. Per the Nuance DAX Copilot Epic-embedded GA announcement[^65] and the CallSphere DAX 2026 update[^69], DAX Copilot reached general availability inside Epic January 2024 and crossed 200,000 clinician users in 2026.
5. Per Becker's Hospital Review's February 24 2026 Epic AI Charting analysis[^67] and Folio3's March 11 2026 feature breakdown[^70], Epic AI Charting launched February 2026 powered by Microsoft DAX, with first-deployment Group Health Cooperative of South Central Wisconsin reporting 60-minute-per-clinician-per-day documentation savings.
6. Per the ForaSoft AI scribe architecture analysis[^68], Abridge raised a $300 million Series D in 2024; AWS HealthScribe runs $0.10-$0.30 per minute; the OpenAI Realtime API audio modality is not covered under most BAAs in 2026.

---

## Part VIII — What 2027 Looks Like

The cumulative effect of the five active enforcement windows compounds across 2026 into 2027 in ways that will reshape the procurement floor. Five forcing functions overlap inside an eighteen-month window: the August 2 2026 EU AI Act high-risk activation (with a proposed delay to December 2 2027 via the Digital Omnibus)[^64]; the June 30 2026 Colorado AI Act enforcement date[^51]; the January 1 2026 Texas Responsible AI in Healthcare Act (already active)[^50]; the GENIUS Act framework activation in early 2027 for the broader AI-governance regime; and the ongoing OCR Risk Analysis Initiative which has now produced 13 settlements with no slowdown signal[^7][^10].

The procurement floor that emerges from this stack will be HITRUST ai2 plus ISO 42001 certification plus an AT-C 205 SOC 2+ HIPAA report — three independent third-party attestations on top of a HIPAA risk-analysis baseline. Vendors that cannot present all three in a procurement security questionnaire will be priced out of mid- and large-system deployments. The "common control framework" approach of running one evidence collection cycle to satisfy multiple audit audiences becomes the only economically viable structure[^14][^15][^58].

ONC HTI-5, proposed December 22 2025, reshapes information-blocking compliance with a deregulatory tilt — estimated $1.53 billion[^43] in industry savings, $650 million[^43] over five years, and 1.4 million compliance hours saved by removing more than 50% of current Health IT Certification Program criteria[^42][^43]. HTI-1 (finalized December 13 2023) defined the Predictive Decision Support Intervention category and the Intervention Risk Management practices that sit alongside HIPAA risk analysis as a parallel AI-specific risk-and-mitigation discipline; HTI-5 streamlines the certification overhead while preserving the core AI-transparency obligations[^41][^44]. The net effect is a slightly lighter ONC compliance lift offset by a heavier OCR + EU AI Act + state-law lift across the same period[^41][^42].

The artifact that compresses this stack into one operational substrate is the unified 17-field audit log plus a documented AI Bill of Materials that traces every model, training-data slice, embedding source, and tool-invocation chain back to a BAA-covered subprocessor or an Expert Determination policy reference. Auditors examine the log; regulators reconstruct from it; customers ask for it in procurement diligence; the EU AI Act's Article 12 requires it. The single artifact survives all five enforcement windows simultaneously.

---

## Closing

The dual-examination field manual is six frameworks deep, not two. HIPAA Privacy/Security/Breach Notification anchors the regulatory side. SOC 2 Trust Services Criteria anchors the customer-assurance side. ISO 42001 anchors the AI Management System discipline. HITRUST AI Assurance anchors the third-party-validated AI security control set. FDA PCCP anchors the SaMD-bearing change-control discipline. State-law AI disclosure (CA AB 3030, Texas Responsible AI in Healthcare Act, Texas TRAIGA, Colorado AI Act) anchors the patient-facing interaction surface. A 2026 compliance program that addresses fewer than all six will fail at least one audit audience, and the failures compound — a SOC 2-clean program with no HITRUST AI certification will lose enterprise procurement; a HITRUST-certified program with no PCCP-aligned change control will fail SaMD release; a PCCP-aligned program with no AB 3030 disclosure will fail Medical Board enforcement.

The vendor BAA landscape is the binding architectural constraint. Anthropic's three-cloud BAA, Microsoft's Azure-anchored BAA, Google's Cloud-and-Vertex BAA, and OpenAI's Azure-only-plus-narrow-API BAA are the four lanes. The architecture follows the BAA, not the other way around — and the carve-outs (ChatGPT Business, OpenAI Realtime audio, Anthropic beta features) are the failure modes that wreck deployments designed without reading the BAA scope first.

The unified 17-field audit log is the artifact that survives all of them. HIPAA §164.312(b) audit controls plus EU AI Act Article 12 logging plus §164.502(b) minimum-necessary justification plus three-cloud immutability primitives plus six-year retention is a single substrate that satisfies HIPAA, SOC 2 CC7, ISO 42001 Annex A, HITRUST domain 12, and FDA PCCP post-market surveillance simultaneously. Build it once; report from it forever.

---

## Glossary

**PHI (Protected Health Information):** Individually identifiable health information held or transmitted by a covered entity or business associate, in any form. Defined at 45 CFR §160.103.

**ePHI (electronic PHI):** PHI maintained or transmitted in electronic form. Subject to the HIPAA Security Rule's technical, administrative, and physical safeguards (§164.302-318).

**BAA (Business Associate Agreement):** Contract required under §164.502(e) and §164.504(e) that establishes the permitted PHI flows between a covered entity and its business associates, including subcontractor flow-down obligations.

**OCR:** HHS Office for Civil Rights — the federal regulator with civil-monetary-penalty authority for HIPAA Privacy, Security, and Breach Notification violations.

**Risk Analysis Initiative:** OCR's enforcement initiative targeting the §164.308(a)(1)(ii)(A) risk-analysis requirement; 13 settlements as of April 23 2026[^7].

**Safe Harbor:** §164.514(b)(2) prescriptive de-identification method requiring removal of 18 specified identifier categories.

**Expert Determination:** §164.514(b)(1) risk-based de-identification method validated by a qualified expert applying generally-accepted statistical and scientific principles to demonstrate "very small" re-identification risk.

**Trust Services Criteria (TSC):** AICPA-published criteria framework underlying SOC 2 examinations. Mandatory Security category plus four optional categories (Availability, Processing Integrity, Confidentiality, Privacy).

**CC1-CC9:** The nine SOC 2 Common Criteria (Control Environment, Communication, Risk Assessment, Monitoring, Control Activities, Logical/Physical Access, System Operations, Change Management, Risk Mitigation).

**AT-C 205:** AICPA attestation engagement type for service-organization examinations; the 205 designation covers SOC 2+ HIPAA dual reports.

**SSAE 23:** AICPA Statement on Standards for Attestation Engagements No. 23 (June 2025), the underlying standard for SOC 2 examinations.

**ISO 42001:** ISO/IEC 42001:2023, the first international AI Management System standard. Published December 18 2023; candidate harmonized standard under the EU AI Act.

**AIMS (AI Management System):** The governance system defined by ISO 42001 Annex A controls.

**HITRUST CSF:** HITRUST Common Security Framework — the harmonized control framework that underlies HITRUST e1, i1, and r2 certifications.

**ai1 / ai2:** HITRUST AI Security Certification tiers. ai1 is one-year, layered on e1 or i1; ai2 is two-year, layered on r2.

**ONC HTI-1 / HTI-5:** HHS Office of the National Coordinator final rules on Health IT Certification. HTI-1 finalized December 13 2023; HTI-5 proposed December 22 2025.

**Predictive DSI:** Predictive Decision Support Intervention. Defined in HTI-1 as technology that produces prediction, classification, recommendation, evaluation, or analysis from algorithmic outputs.

**IRM (Intervention Risk Management):** HTI-1 required practice combining risk analysis, risk mitigation, and governance for Predictive DSIs.

**USCDI:** United States Core Data for Interoperability. v3 baseline took effect January 1 2026[^41].

**FDA PCCP:** Predetermined Change Control Plan. Section 515C of the FD&C Act; FDA Final Guidance December 3 2024 with August 18 2025 implementation update.

**SaMD:** Software as a Medical Device. IMDRF-harmonized definition for software intended for medical purposes that performs without being part of a hardware medical device.

**GMLP:** Good Machine Learning Practice. The five FDA-Health Canada-MHRA joint guiding principles: Focused & Bounded, Risk-Based, Evidence-Based, Transparent, Total Product Lifecycle Perspective.

**510(k) / De Novo / PMA:** FDA medical-device clearance pathways. PCCP applies to all three.

**CA AB 3030:** California Health and Safety Code §1339.75. Effective January 1 2025. GenAI disclaimer requirement for patient communications containing clinical information.

**Texas TRAIGA:** Texas HB 149, the Texas Responsible AI Governance Act. $10K-$200K per-violation penalties; affirmative defenses for NIST AI RMF compliance[^51].

**CA SB 53:** California frontier AI developer law. Reporting obligations for systems trained at ≥10^26 FLOPS; up to $1 million per-violation penalties[^51].

**ZDR (Zero Data Retention):** Vendor data-handling option in which prompts and responses are not retained at rest after the API response. Default for Anthropic HIPAA-ready API.

**DAX Copilot:** Microsoft Nuance Dragon Ambient eXperience Copilot. Embedded in Epic[^65]; 200,000+ clinician users in 2026[^69].

---

## Related Research

- [The B2A Imperative](https://www.perea.ai/research/b2a-2026) — origin of the B2A framing this paper assumes throughout the procurement-side analysis.
- [GEO/AEO 2026: The Citation Economy and the Discovery Layer of B2A](https://www.perea.ai/research/geo-2026) — the discovery substrate that determines which compliance-program documentation gets cited by AI retrievers and which does not.
- [The MCP Server Playbook for SaaS Founders](https://www.perea.ai/research/mcp-server-playbook) — protocol reference for the agentic stack that this paper's audit-log architecture sits on top of.
- [The Agent Payment Stack 2026](https://www.perea.ai/research/agent-payment-stack-2026) — the authorization and trust-layer canon that informs the IAM portion of this paper's three-layer audit-log architecture.

---

## References

[^1]: OpenAI (2024), *Business Associate Agreements at OpenAI*. https://help.openai.com/en/articles/8660679
[^2]: Anthropic (2024), *Business Associate Agreements (BAA) for commercial customers*. https://privacy.anthropic.com/en/articles/8114513-business-associate-agreements-baa-for-commercial-customers
[^3]: Anthropic (2025), *HIPAA-ready Enterprise plans*. https://support.claude.com/en/articles/13296973-hipaa-ready-enterprise-plans
[^4]: Anthropic (2025), *Claude Enterprise*. https://www.anthropic.com/product/enterprise
[^5]: Anthropic (2025), *API and data retention*. https://platform.claude.com/docs/en/manage-claude/api-and-data-retention
[^6]: HHS Office for Civil Rights (2012), *Guidance Regarding Methods for De-identification of Protected Health Information*. https://www.hhs.gov/hipaa/for-professionals/special-topics/de-identification/index.html
[^7]: HHS Office for Civil Rights (April 23, 2026), *OCR Settles Four Ransomware Investigations*. https://www.hhs.gov/press-room/ocr-settles-four-ransomware-investigations.html
[^8]: HHS Office for Civil Rights (February 19, 2026), *OCR Settles HIPAA Security Rule Investigation with TWRTC*. https://www.hhs.gov/press-room/ocr-settles-hipaa-security-rule-investigation-twrtc.html
[^9]: HHS Office for Civil Rights (May 15, 2025), *HHS HIPAA Investigation: Vision Upright MRI*. https://www.hhs.gov/press-room/hhs-hipaa-investigate-vum.html
[^10]: CyberSignal (April 24, 2026), *OCR Fines $1.17M for HIPAA Failures Enabling 427K Patient Ransomware Breaches*. https://www.thecybersignal.com/ocr-fines-1-17m-hipaa-failures-enabled-427k-patient-ransomware-breaches/
[^11]: National Law Review (April 23, 2025), *OCR Reaches Settlement with Healthcare Network over HIPAA Violations*. https://natlawreview.com/article/ocr-reaches-settlement-health-care-network-health-over-hipaa-violations-stemming
[^12]: National Law Review (2024), *AI Phishing Attacks in Healthcare and the $480,000 OCR Settlement under HIPAA*. https://natlawreview.com/article/ai-phishing-attacks-healthcare-and-480000-ocr-settlement-under-hipaa
[^13]: AccountableHQ (April 29, 2025), *SOC 2 to HIPAA Mapping Crosswalk: Trust Services Criteria to HIPAA Security Rule Requirements*. https://www.accountablehq.com/post/soc-2-to-hipaa-mapping-crosswalk-trust-services-criteria-to-hipaa-security-rule-requirements
[^14]: AccountableHQ (June 7, 2025), *SOC 2 vs HIPAA: Key Differences, Overlap, and How to Comply with Both*. https://www.accountablehq.com/post/soc-2-vs-hipaa-key-differences-overlap-and-how-to-comply-with-both
[^15]: AccountableHQ (October 3, 2025), *HIPAA vs SOC 2: Key Differences, Overlap, and How to Achieve Dual Compliance*. https://www.accountablehq.com/post/hipaa-vs-soc-2-key-differences-overlap-and-how-to-achieve-dual-compliance
[^16]: Censinet (February 13, 2026), *SOC 2 + HIPAA Compliance Overlap Study*. https://censinet.com/perspectives/soc-2-hipaa-compliance-overlap-study
[^18]: AgentmodeAI (April 26, 2026), *HIPAA-Compliant Agentic AI: 2026 Healthcare Playbook*. https://agentmodeai.com/hipaa-compliant-agentic-ai-healthcare/
[^20]: TopflightApps (February 6, 2026), *Is OpenAI HIPAA Compliant? A 2026 Guide*. https://topflightapps.com/ideas/is-openai-hipaa-compliant/
[^21]: PolicyGuard AI (March 25, 2026), *AI HIPAA Compliance 2026*. https://getpolicyguard.com/blog/ai-hipaa-compliance
[^22]: BAA Generator (April 20, 2026), *HIPAA BAAs for AI Vendors*. https://baagenerator.com/blog/hipaa-baa-for-ai-vendors
[^23]: AIHealthcareCompliance (August 14, 2025), *ISO 42001 for Healthcare AI*. https://aihealthcarecompliance.com/resources/applicable-laws/iso-42001/
[^25]: Regulome (December 18, 2023), *ISO/IEC 42001 Compliance Guide 2026*. https://regulome.io/regulations/iso-42001
[^27]: BSI Group, *ISO 42001 AI Management System Certification*. https://www.bsigroup.com/en-NZ/products-and-services/standards/iso-42001-ai-management-system/
[^28]: BeyondScale (March 21, 2026), *ISO 42001 Certification Guide*. https://beyondscale.tech/blog/iso-42001-certification-guide
[^29]: COMPEL Framework (January 1, 2026), *Compliance Mappings: SOC 2, ISO 27001, and HIPAA for AI Workloads*. https://www.compelframework.org/articles/compliance-mappings-soc-2-iso-27001-and-hipaa-for-ai-workloads
[^30]: Nirmitee (March 22, 2026), *De-Identifying Healthcare Data for AI Training: Safe Harbor and Expert Determination*. https://nirmitee.io/blog/healthcare-data-deidentification-ai-safe-harbor-expert-determination/
[^31]: Roving Health (March 2, 2026), *De-Identification for AI Training: Healthcare Models and Patient Data*. https://www.rovinghealth.com/articles/de-identification-ai-training-healthcare-models-patient-data
[^32]: AccountableHQ (January 23, 2024), *HIPAA De-Identification: Safe Harbor vs Expert Determination Explained*. https://www.accountablehq.com/post/hipaa-de-identification-safe-harbor-vs-expert-determination-explained
[^33]: Netguardia (April 25, 2026), *HIPAA in the AI Era: What PHI Means for ML Training*. https://netguardia.com/governance-risk/compliance/hipaa-in-the-ai-era-what-protected-health-information-means-for-ml-training/
[^34]: HIPAA Journal (December 19, 2025), *De-identification of Protected Health Information: 2026 Update*. https://www.hipaajournal.com/de-identification-protected-health-information/
[^35]: HITRUST (January 29, 2025), *HITRUST AI Risk Management and AI Security Certification: What's the Difference*. https://hitrustalliance.net/blog/hitrust-ai-risk-management-and-ai-security-certification-whats-the-difference
[^36]: HITRUST, *AI Risk Management Assessment*. https://hitrustalliance.net/assessments-and-certifications/airiskmanagementassessment
[^37]: HITRUST, *AI Security Assessment and Certification*. https://hitrustalliance.net/assessments-and-certifications/aisecurityassessment
[^38]: HITRUST (December 6, 2024), *HAA 2024-008: AI Security Assessment Launch Advisory*. https://hitrustalliance.net/advisories/haa-2024-008
[^39]: HITRUST (December 2, 2024), *AI Security FAQs*. https://hitrustalliance.net/hubfs/AI%20Security%20Assessment/AI%20Security%20FAQs.pdf
[^40]: HITRUST, *r2 Data Sheet*. https://hitrustalliance.net/hubfs/Website/Data%20Sheets/r2%20-%20Data%20Sheet.pdf
[^41]: ONC, *HTI-1 Final Rule*. https://healthit.gov/regulations/hti-rules/hti-1-final-rule/
[^42]: ONC (December 22, 2025), *HTI-5 Proposed Rule*. https://www.healthit.gov/proposedrule
[^43]: HHS (December 22, 2025), *HHS Proposes HTI-5 Rule*. https://www.hhs.gov/press-room/hhs-proposes-hti-5-rule.html
[^44]: Crowell & Moring (January 3, 2024), *ONC Releases Final Rule on Information Blocking and Health IT Certification Program Updates Including Requirements Related to AI*. https://www.crowell.com/en/insights/client-alerts/onc-releases-final-rule-on-information-blocking-and-health-it-certification-program-updates-including-requirements-related-to-ai
[^47]: California Department of Public Health, *AFL-25-07: AB 3030 Health Care AI*. https://www.cdph.ca.gov/Programs/CHCQ/LCP/Pages/AFL-25-07.aspx
[^48]: California Legislature (September 28, 2024), *AB 3030 Bill Text*. https://leginfo.legislature.ca.gov/faces/billCompareClient.xhtml?bill_id=202320240AB3030&showamends=false
[^50]: Mosaic Life Tech (March 31, 2026), *AI Disclosure and Consent Requirements*. https://www.mosaiclifetech.com/governance/what-ai-disclosure-and-consent-requirements-do-we-need-to-comply-with
[^51]: Baker Botts via JDSupra, *U.S. Artificial Intelligence Law Update*. https://www.jdsupra.com/legalnews/u-s-artificial-intelligence-law-update-5806709
[^52]: Morgan Lewis (December 9, 2024), *California Law Requiring Disclaimers by Healthcare Providers Using GenAI*. https://www.morganlewis.com/pubs/2024/12/california-law-requiring-disclaimers-by-healthcare-providers-using-genai-will-affect-providers-and-genai-developers
[^53]: AICPA (June 5, 2025), *Statement on Standards for Attestation Engagements No. 23*. https://www.aicpa-cima.com/resources/download/aicpa-statement-on-standards-for-attestation-engagements-no-23
[^54]: AICPA (October 15, 2022), *SOC 2 Reporting on an Examination of Controls at a Service Organization*. https://future.aicpa.org/cpe-learning/publication/soc-2-reporting-on-an-examination-of-controls-at-a-service-organization-relevant-to-security-availability-processing-integrity-confidentiality-or-privacy
[^55]: HIPAA Journal (April 25, 2025), *SOC 2 Compliance Checklist*. https://www.hipaajournal.com/soc-2-compliance-checklist/
[^56]: TechnologyOne, *AT-C 205 SOC 2 + HIPAA Examination Implementation*. https://www.technology1.com/?external-uuid=9a674278-3b41-4fe0-8a30-20d1bd7a7d87
[^57]: AzaleaHealth (February 12, 2026), *SOC 1 vs SOC 2, Type 1 vs Type 2: Healthcare Guide*. https://azaleahealth.com/blog/soc-1-vs-soc-2-type-1-vs-type-2-healthcare-guide
[^58]: Securisea, *SOC2 + HIPAA Compliance: Combining Controls for Maximum Security*. https://www.securisea.com/resources/soc2-hipaa-compliance-combining-controls-for-maximum-security
[^59]: FDA (August 18, 2025), *Marketing Submission Recommendations for a Predetermined Change Control Plan for Artificial Intelligence-Enabled Medical Devices*. https://www.fda.gov/regulatory-information/search-fda-guidance-documents/marketing-submission-recommendations-predetermined-change-control-plan-artificial-intelligence
[^60]: FDA / Health Canada / UK MHRA, *Predetermined Change Control Plans for Machine Learning-Enabled Medical Devices: Guiding Principles*. https://www.fda.gov/medical-devices/software-medical-device-samd/predetermined-change-control-plans-machine-learning-enabled-medical-devices-guiding-principles
[^61]: FDA, *Artificial Intelligence-Enabled Medical Devices*. https://www.fda.gov/medical-devices/software-medical-device-samd/artificial-intelligence-enabled-medical-devices
[^62]: FDA (January 14, 2025), *PCCP Final Guidance Webinar Transcript*. https://www.fda.gov/media/187905/download
[^63]: McDermott Will & Emery (December 20, 2024), *FDA Issues Final Guidance on Predetermined Change Control Plans for AI-Enabled Devices*. https://www.mcdermottlaw.com/insights/fda-issues-final-guidance-on-predetermined-change-control-plans-for-ai-enabled-devices/
[^64]: Reg-Intel (April 27, 2026), *FDA AI Medical Devices 2026 Guidance: PCCP and EU AI Act Comparison*. https://reg-intel.com/fda-ai-medical-devices-2026-guidance-pccp-and-eu-ai-act-comparison/
[^65]: Nuance (January 18, 2024), *Nuance Announces General Availability of DAX Copilot Embedded in Epic*. https://news.nuance.com/2024-01-18-Nuance-Announces-General-Availability-of-DAX-Copilot-Embedded-in-Epic-Transforming-Healthcare-Experiences-with-Automated-Clinical-Documentation
[^66]: AgentmodeAI (April 26, 2026), *HIPAA-Compliant Agentic AI: 2026 Healthcare Playbook (enforcement section)*. https://agentmodeai.com/hipaa-compliant-agentic-ai-healthcare/
[^67]: Becker's Hospital Review (February 24, 2026), *Health Systems Explore Epic's AI Scribe*. https://www.beckershospitalreview.com/healthcare-information-technology/ehrs/health-systems-explore-epics-ai-scribe/
[^68]: ForaSoft (2026), *AI Scribe Architecture: Ambient Documentation 2026*. https://www.forasoft.com/blog/article/ai-scribe-architecture-ambient-documentation-2026
[^69]: CallSphere (April 21, 2026), *Nuance DAX Copilot Microsoft 2026 Update*. https://callsphere.ai/blog/td30-vrt-nuance-dax-copilot-microsoft-2026-update
[^70]: Folio3 (March 11, 2026), *What is Epic AI Scribe? Features and Benefits*. https://digitalhealth.folio3.com/blog/what-is-epic-ai-scribe-features-benefits/

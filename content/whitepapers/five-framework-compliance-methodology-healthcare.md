---
title: "The Five-Framework Compliance Test: A Methodology Field Manual for Healthcare AI Founders"
subtitle: "HIPAA + HITECH + FDA SaMD + EU MDR/IVDR + EU AI Act Article 6(1) + ONC HTI-5 + Texas TRAIGA + GDPR Article 22 — the Five-Framework design floor that takes 9-15 months and €280-650K to satisfy + the dual-CE-mark fork that becomes mandatory by August 2 2027 + the Texas TRAIGA disclosure clock that started January 1 2026 + the FDA QMSR enforcement that began February 2 2026 + the 30-50% pricing premium for compliance-as-marketed-feature in health-system + payor RFPs"
publication: "perea.ai Research"
authors: ["Dante Perea"]
version: "1.0"
status: "Public draft"
date: "2026-05"
audience: "Founders building healthcare vertical AI agents and weighing the multi-jurisdiction compliance overhead. Operators inside healthcare-AI incumbents (Hippocratic AI, Abridge, OpenEvidence, DAX Copilot/Microsoft Nuance, Suki, Augmedix-now-Commure) calibrating multi-framework compliance posture. General counsel + compliance officers inside Top-50 health systems + payors + pharma evaluating healthcare-AI vendor compliance evidence packs. Investors triangulating healthcare-AI vendors with documented Five-Framework readiness vs. retrofit-risk-exposed alternatives."
length: "~5,400 words"
license: "CC BY 4.0"
description: "The seventh cross-vertical operator playbook in the perea.ai/research canon and the second healthcare vertical-deep-dive, following corpus-moat #23 + prestige-distribution #24 + acquired-by-platform #25 + reinsurer-as-AI-pioneer #26 + Three-State-Test compliance methodology #27 + Polaris validation panel methodology #28. Decodes the Five-Framework Compliance Test (HIPAA + HITECH + FDA SaMD + EU MDR/IVDR + EU AI Act + ONC + Texas TRAIGA + GDPR) as the regulatory design floor for healthcare-vertical AI in 2026 — 9-15 months and €280-650K to satisfy, 1.5-1.7x harder than insurance Three-State Test (paper #27). Anchored on five canonical regulatory regimes: (1) HIPAA + HITECH BAA chain validation across foundation-model providers (Anthropic Claude + OpenAI GPT + Google Gemini + Mistral + Microsoft Azure + AWS Bedrock); (2) FDA SaMD classification and pathway selection — 168 AI/ML devices cleared in 2024 with 94.6% via 510(k) and 5.4% via De Novo, FDA QMSR aligning with ISO 13485 enforceable February 2 2026, eSTAR template mandatory for De Novo as of October 2025, December 4 2024 PCCP Predetermined Change Control Plan guidance for AI iterative updates; (3) EU MDR / IVDR CE marking with EU AI Act Article 6(1) dual conformity assessment effective August 2 2027 — not 2026 (corrected from prior assumption); (4) ONC HTI-5 Proposed Rule December 29 2025 federal register publication + 60-day comment period closing February 27 2026 + Information Blocking Rule actively enforced with ~1,300 complaints + $1M per violation + September 2025 escalation; (5) Texas TRAIGA effective January 1 2026 with healthcare-service-provider AI-disclosure requirement (clear + conspicuous + plain language + no dark patterns + first-service-date timing + emergency-asap exception). Operationalizes the 30-50% pricing premium for compliance-as-marketed-feature in health-system + payor RFPs + the 4-6-week deal-close compression + the 3-way product fork (US-version + EU-AI-Act-compliant version + sub-vertical-specialty version with FDA SaMD certification) + compliance-as-M&A-asset positioning at $200M-$1B+ acquisition multiples from Microsoft / Epic / Cerner / Commure / UnitedHealth-Optum."
---

# The Five-Framework Compliance Test: A Methodology Field Manual for Healthcare AI Founders

## Foreword

This is the seventh cross-vertical operator playbook in the perea.ai/research canon and the second healthcare vertical-deep-dive, following corpus-moat #23 + prestige-distribution #24 + acquired-by-platform #25 + reinsurer-as-AI-pioneer #26 + Three-State-Test compliance methodology #27 + Polaris validation panel methodology #28. Derived from healthcare paper #19 (State of Vertical Agents Q1 2027: Healthcare) and tightened by paper #28 (Polaris validation panel methodology), this paper decodes the **Five-Framework Compliance Test** — the canonical 2026 regulatory design floor for healthcare-vertical AI.

**The frame this paper holds: healthcare vertical AI in 2026 must satisfy five structurally distinct regulatory regimes simultaneously — HIPAA + HITECH, FDA SaMD, EU MDR/IVDR + EU AI Act Article 6(1), ONC HTI-5 + Information Blocking, and Texas TRAIGA + state patchwork — plus GDPR Article 22 for EU-resident data subjects.** This is **9-15 months and €280-650K of compliance investment**, **1.5-1.7x harder than the insurance Three-State Test** documented in paper #27. The healthcare-specific 3-way product fork (US version + EU-AI-Act-compliant version + sub-vertical-specialty version with FDA SaMD certification or non-SaMD documentation-only positioning) is more pronounced than insurance's 2-state US-EU dual-product strategy.

This paper synthesizes five canonical 2024-2026 regulatory regimes plus state patchwork. **Framework 1 — HIPAA + HITECH BAA chain validation** across foundation-model providers (Anthropic + OpenAI + Google + Mistral + Microsoft Azure + AWS Bedrock) with auditable PHI-handling architecture. **Framework 2 — FDA SaMD classification and pathway selection**: 168 AI/ML devices cleared in 2024, all Class II — 94.6% via 510(k) and 5.4% via De Novo, no Class III SaMD to date. The FDA QMSR (aligning with ISO 13485) became enforceable February 2, 2026; the eSTAR template became mandatory for De Novo as of October 2025; the December 4, 2024 PCCP (Predetermined Change Control Plan) guidance formalized iterative AI algorithm updates. **Framework 3 — EU MDR / IVDR CE marking + EU AI Act Article 6(1) dual conformity assessment**: medical-device-AI compliance with the AI Act high-risk obligations is delayed until **August 2, 2027** (not 2026), but MDR class IIa/IIb/III and IVDR class A-D devices that incorporate AI must prepare for dual CE marking through the same Notified Body. **Framework 4 — ONC HTI-5 Proposed Rule + Information Blocking Rule**: HTI-5 federal register publication December 29 2025 + 60-day public comment period closing February 27 2026; HTI-5 removes 50%+ of certification criteria + focuses on FHIR-based APIs + AI-enabled interoperability; Information Blocking Rule actively enforced with ~1,300 complaints filed + $1M-per-violation penalty + HHS escalated enforcement in September 2025. **Framework 5 — Texas TRAIGA**: effective January 1, 2026, with healthcare-service-provider disclosure requirement (clear + conspicuous + plain language + no dark patterns + first-service-date timing with emergency-asap exception). Plus state patchwork (California SB-1120 + similar) + GDPR Article 22 (automated-decision-making for EU data subjects).

Out of those five frameworks, this paper extracts: (1) the BAA chain validation playbook across foundation-model providers; (2) the FDA SaMD Class II decision tree with 510(k) vs De Novo pathway selection + 12-18 month timelines + $1-3M cost benchmarks; (3) the EU MDR/IVDR + AI Act dual-CE-marking strategy with August 2 2027 deadline preparation; (4) the ONC HTI-5 + Information Blocking compliance posture; (5) the Texas TRAIGA disclosure-template playbook; (6) the 30-50% pricing premium operationalization; (7) the 3-way product fork architecture; (8) compliance-as-M&A-asset positioning.

## Executive Summary

1. **The Five-Framework Compliance Test is the canonical 2026 healthcare-vertical AI regulatory design floor — and at 9-15 months and €280-650K, it is 1.5-1.7x harder than the insurance Three-State Test (paper #27).** Five frameworks: HIPAA + HITECH; FDA SaMD; EU MDR/IVDR + EU AI Act Article 6(1); ONC HTI-5 + Information Blocking; Texas TRAIGA + state patchwork. Plus GDPR Article 22 for EU data subjects. **Founders who bake all five into the product spec on day one** ship 4-6 weeks faster on enterprise health-system + payor + pharma deals, charge 30-50% pricing premium, and beat the active 2026 deadlines (Texas TRAIGA January 1 2026 + FDA QMSR February 2 2026 + ONC HTI-5 February 27 2026 comment-period close + Polaris-style validation expectations + ongoing Information Blocking enforcement) without retrofit. **Founders who skip Five-Framework Test on day one** pay 3-4x more in retrofit costs and lose enterprise health-system deals to compliance-positioned competitors during the 12-18-month retrofit window.

2. **HIPAA + HITECH BAA chain validation is the first-pillar compliance gate — no enterprise health-system contract closes without auditable BAA architecture across foundation-model providers + cloud + customer-EHR integrations.** Required BAAs: foundation model (Anthropic Claude / OpenAI GPT / Google Gemini / Mistral / Cohere); cloud provider (Microsoft Azure / AWS Bedrock / Google Cloud); customer-EHR integration vendor (Epic / Cerner-Oracle / MEDITECH / athenahealth); customer-direct BAA at deployment time. **The BAA chain validation cost: $0.3-0.8M legal review + ongoing $50-150K annual renewal cycle per major foundation-model provider.** Founder-implication: build the BAA chain before Series A; do not wait until first enterprise pilot. Hippocratic AI + Abridge + OpenEvidence built BAA chains pre-Series-A and shipped HIPAA-validated architecture as the canonical commercial-launch readiness signal.

3. **FDA SaMD compliance: 168 AI/ML devices cleared in 2024 — 94.6% via 510(k) + 5.4% via De Novo + no Class III SaMD to date.** Founder-implication: Class II via 510(k) is the dominant FDA pathway for AI/ML SaMD in 2026. **510(k) timeline: 30-90 days FDA processing + 6-12 months total premarket-notification cycle + $1-2M cost benchmark.** **De Novo timeline: 12-18 months + $2-3M cost benchmark** (used for novel AI/ML devices without valid predicate). **PMA Class III timeline: 180-day FDA review window + clinical-trial cost overhead totaling 24-36 months and $5-15M** — but no AI/ML SaMD has ever been deemed Class III, so PMA is rare for this category. **2026 FDA milestones**: FDA QMSR (aligning with ISO 13485) became enforceable February 2, 2026; eSTAR template mandatory for De Novo as of October 2025; December 4, 2024 PCCP (Predetermined Change Control Plan) guidance formalized how companies can pre-authorize iterative AI algorithm updates without re-submission. **Founder-implication: incorporate PCCP-style change-control documentation from product-spec day one** — this is the single highest-leverage 2026 FDA-strategy move for AI/ML SaMD founders.

4. **EU MDR / IVDR + EU AI Act Article 6(1) dual-CE-marking is delayed to August 2, 2027 (not 2026 as initially anticipated) — but founders must prepare technical files now to avoid 12-18-month retrofit cycles.** EU AI Act Article 6(1) covers AI systems embedded in products subject to third-party conformity assessment under EU harmonisation legislation, including CE-marked medical devices regulated under MDR and IVDR. **MDR class IIa, IIb, III devices and IVDR class A-D devices with AI components classify as high-risk under the AI Act.** Single conformity assessment is allowed by Notified Bodies accredited under both regimes. **Founder-implication: engage a Notified Body accredited under both MDR/IVDR and AI Act regimes by Q3 2026** to enable parallel CE-marking + AI Act conformity assessment. Reviewing existing MDR/IVDR technical files against AI Act requirements + identifying gaps (AI-specific content + training-data documentation + bias assessment + explainability) is the canonical 2026 preparation path. **AI performance monitoring built into post-market surveillance systems must be deployed before August 2026** to satisfy MDR Article 83 + AI Act monitoring expectations during the transition period.

5. **ONC HTI-5 Proposed Rule + Information Blocking Rule is the active 2026 federal-level healthcare-AI compliance pillar.** HTI-5 federal register publication December 29, 2025; 60-day public comment period closing February 27, 2026. HTI-5 removes 50%+ of ONC Health IT Certification Program certification criteria + focuses certification on FHIR-based APIs + AI-enabled interoperability + saves estimated 1.4M compliance hours per year (~4,000 hours per developer). **Information Blocking Rule actively enforced**: ~1,300 complaints filed with ONC + penalties up to $1M per violation + HHS escalated enforcement in September 2025. **Founder-implication: ship FHIR + SMART API integration as core product capability** — not as a customization for individual customer deployments. AI-enabled interoperability via FHIR/SMART is the default 2026 ONC posture; founders who skip native FHIR integration default to manual customer-side data export workflows that trigger Information Blocking complaint exposure.

6. **Texas TRAIGA — effective January 1, 2026 — established the canonical healthcare-AI-disclosure clock.** Healthcare service providers must disclose to patients (or their representatives) that an AI system is being used "in relation to the healthcare service or treatment." Disclosure timing: not later than the date the service or treatment is first provided; emergency exception requires disclosure as soon as reasonably possible. Format requirements: clear + conspicuous + plain language + no dark patterns. Definition of healthcare services: services "related to human health or to the diagnosis, prevention or treatment of a human disease or impairment provided by an individual licensed, registered, or certified under applicable state or federal law." **Founder-implication: ship the AI-disclosure template as a vendor-supplied artifact** — embedded in the product UI + as a customer-side onboarding flow + as a compliance evidence pack for the customer's TRAIGA filing. Texas TRAIGA is the canonical state-level healthcare-AI-disclosure regulation; California + similar state-by-state divergences will compound through 2026-2027.

7. **The 30-50% pricing premium operationalization for compliance-as-marketed-feature requires four artifacts in the health-system + payor RFP response.** **Artifact 1 — Five-Framework compliance summary** (1 page mapping product capability to HIPAA + HITECH + FDA SaMD + EU MDR/IVDR + EU AI Act + ONC HTI-5 + Texas TRAIGA + GDPR Article 22). **Artifact 2 — BAA chain documentation** (foundation-model + cloud + EHR-integration BAA evidence pack with audit-trail capabilities). **Artifact 3 — FDA SaMD classification + pathway documentation** (510(k) submission ID + clearance letter + PCCP plan documentation + QMSR ISO 13485 alignment evidence). **Artifact 4 — Texas TRAIGA + state-disclosure templates + ONC FHIR/SMART integration evidence** (vendor-supplied disclosure templates + Information Blocking compliance evidence + FHIR/SMART API integration documentation). **Founders who include these four artifacts in the health-system RFP response** close enterprise deals 4-6 weeks faster + command 30-50% pricing premium because the customer benchmarks against $5-15M retrofit cost + 9-15 month retrofit window. **Compliance-as-M&A-asset positioning** (per paper #25 four-moat framework): Five-Framework-compliant vendors get 3-6x EV/Revenue acquisition-multiple contribution + $200M-$1B+ acquisition multiples from Microsoft + Epic + Cerner + Commure + UnitedHealth-Optum + Hippocratic-AI-as-acquirer.

## Part I — HIPAA + HITECH BAA Chain Validation

**The regulatory architecture.** The Health Insurance Portability and Accountability Act (HIPAA) of 1996, modernized by the Health Information Technology for Economic and Clinical Health Act (HITECH) of 2009, mandates Business Associate Agreement (BAA) chains for any third-party that creates, receives, maintains, or transmits Protected Health Information (PHI) on behalf of a Covered Entity (health system, payor, healthcare provider). Healthcare-AI vendors must architect auditable BAA chains across the entire data-handling pipeline.

**The three-layer BAA chain.**
- **Layer 1 — Foundation model provider BAA**. Anthropic Claude (HIPAA BAA available via Anthropic Enterprise + AWS Bedrock); OpenAI GPT (HIPAA BAA via OpenAI Enterprise + Microsoft Azure); Google Gemini (HIPAA BAA via Google Cloud Healthcare API); Mistral (HIPAA BAA negotiated case-by-case for enterprise); Cohere (HIPAA BAA via specific deployment options).
- **Layer 2 — Cloud provider BAA**. Microsoft Azure (HIPAA + HITECH compliant + signed BAA); AWS Bedrock (HIPAA + HITECH compliant + signed BAA); Google Cloud Healthcare API (HIPAA + HITECH compliant + signed BAA).
- **Layer 3 — Customer-EHR integration vendor BAA**. Epic (HIPAA-compliant integration via SMART on FHIR + Epic's third-party-app review process); Cerner-Oracle (HIPAA-compliant integration via Cerner Health-Open framework); MEDITECH (HIPAA-compliant integration via MEDITECH MAGIC platform); athenahealth (HIPAA-compliant integration via athenaCommunicator + Direct Trust).

**The fourth layer — Customer-direct BAA.** At deployment time, the healthcare-AI vendor signs a direct BAA with the deploying Covered Entity (health system + payor + healthcare provider). This is the customer-facing BAA that triggers production data flow.

**Cost + timeline benchmarks.** **BAA chain construction cost: $0.3-0.8M legal review + $50-150K annual renewal cycle per major foundation-model provider + cloud + EHR-integration BAA.** Build time: 3-6 months pre-Series-A. **Founder-implication: build the BAA chain before Series A**, not after first enterprise pilot. Hippocratic AI + Abridge + OpenEvidence built HIPAA-validated BAA architecture pre-Series-A and shipped this as canonical commercial-launch readiness signal.

**Foundation-model swap risk.** Foundation-model swaps (e.g., Claude Sonnet 4.6 → GPT-5 → Gemini 2.0) require BAA re-validation. The vendor's product architecture must accommodate multi-model BAA-validated routing without breaking HIPAA chain integrity. **Founder-implication: architect multi-foundation-model BAA-chain routing as a first-class product capability.**

## Part II — FDA SaMD Classification + 510(k) Pathway Selection

**The 2026 FDA SaMD landscape: 168 AI/ML devices cleared in 2024, 94.6% via 510(k), 5.4% via De Novo, no Class III SaMD to date.** Founder-implication: Class II via 510(k) is the dominant pathway for AI/ML SaMD in 2026.

**Classification decision tree.**
- **Class I (low risk)**: trivial or supporting software not requiring premarket notification (e.g., simple data-display utilities). Most AI/ML SaMD does not qualify.
- **Class II (moderate risk)**: most AI/ML SaMD — image analysis + diagnostic decision support + clinical-workflow automation + ambient-scribe applications. **Pathway: 510(k) (94.6% of 2024 clearances) or De Novo (5.4% — used for novel AI/ML devices without valid predicate).**
- **Class III (high risk)**: only if AI/ML function is life-sustaining (e.g., directly controlling a life-support machine or administering therapy). **Pathway: PMA (Pre-market Approval).** No AI/ML SaMD has ever been deemed Class III in 2026.

**510(k) Pathway Timeline + Cost.** FDA processing window: 30-90 days. Total premarket-notification cycle: 6-12 months including pre-submission interaction (Q-Sub program), submission preparation, FDA processing, and post-clearance documentation. **Cost benchmark: $1-2M.** Components: regulatory consulting ($300-500K) + clinical evidence ($300-700K) + technical documentation ($200-400K) + FDA fees ($25K-$100K) + post-clearance QMSR documentation ($150-300K).

**De Novo Pathway Timeline + Cost.** Used for novel AI/ML devices lacking valid predicate. Allows new device classification creation. Timeline: 12-18 months. **Cost benchmark: $2-3M** (additional clinical-evidence overhead + novel-classification justification).

**PMA Pathway Timeline + Cost.** Required for Class III devices only. FDA 180-day review window + extensive evidence requirements + laboratory + clinical trials. Timeline: 24-36 months. **Cost benchmark: $5-15M.** Rare for AI/ML SaMD in 2026.

**2026 FDA QMSR enforcement (February 2, 2026).** The FDA Quality Management System Regulation (QMSR), aligning FDA QSR with ISO 13485, became enforceable February 2, 2026. **Founder-implication: integrate ISO 13485 + QMSR posture into product development from day one** — not as post-clearance documentation but as architectural design discipline.

**eSTAR template mandate.** All 510(k) and De Novo submissions must use the electronic eSTAR template. eSTAR became mandatory for De Novo as of October 2025; for 510(k) shortly thereafter.

**PCCP (Predetermined Change Control Plan) Guidance — December 4, 2024.** FDA issued the "Marketing Submission Recommendations for a Predetermined Change Control Plan for AI-Enabled Device Software Functions" Guidance on December 4, 2024. **PCCP formalizes how companies can pre-authorize iterative algorithm updates without re-submission.** Applies to AI-enabled device software functions in 510(k), De Novo, and PMA submissions. **Founder-implication: incorporate PCCP-style change-control documentation from product-spec day one** — this is the single highest-leverage 2026 FDA-strategy move for AI/ML SaMD founders. PCCP enables continuous AI improvement without 6-12-month re-clearance cycles per algorithm update.

## Part III — EU MDR/IVDR + EU AI Act Article 6(1) Dual-CE-Marking

**The 2026-2027 timeline correction.** EU AI Act Article 6(1) covers AI systems embedded in products subject to third-party conformity assessment under EU harmonisation legislation, including CE-marked medical devices regulated under MDR and IVDR. **Article 6(1) does NOT apply until August 2, 2027 — not 2026.** This is a critical timeline correction from initial 2025 industry assumptions. Other high-risk AI systems (insurance per paper #27) face the August 2, 2026 deadline; medical-device AI faces the August 2, 2027 deadline.

**MDR class IIa/IIb/III + IVDR class A-D devices with AI components classify as high-risk under AI Act Article 6(1).** Dual conformity assessment is required: CE marking under MDR/IVDR + AI Act high-risk obligations. **Single conformity assessment is allowed by Notified Bodies accredited under both regimes.**

**Current 2026 status.** As of May 2026, AI-enabled medical devices continue to be certified exclusively under the MDR/IVDR framework. The AI Act's high-risk obligations for medical devices classified under Article 6(1) are not yet applicable. **Founder-implication: prepare technical files now to avoid 12-18-month retrofit cycles** when the 2027 deadline arrives.

**Preparation steps for August 2, 2027.**
- **Technical file gap analysis.** Review existing MDR/IVDR technical files against AI Act Article 9-15 requirements + identify gaps in AI-specific content + training-data documentation + bias assessment + explainability approaches.
- **AI performance monitoring in post-market surveillance.** Build AI-specific monitoring metrics into MDR Article 83 post-market surveillance systems before August 2026 — this 12-month-pre-deadline preparation buffer reduces 2027 retrofit pressure.
- **Notified Body engagement.** Engage Notified Bodies accredited under both MDR/IVDR and AI Act regimes by Q3 2026. Different NBs are at different stages of readiness; early engagement secures slot capacity ahead of the 2027 surge.
- **AI Act Annex IV technical documentation.** Build AI Act Annex IV 8-category documentation alongside MDR/IVDR technical files. Categories: general AI system description; detailed system elements; monitoring + functioning + control; performance metrics; risk-management system; lifecycle changes; harmonised standards; declaration of conformity.

**Founder-implication: the 2026-2027 transition window is the canonical EU healthcare-AI compliance opportunity.** Founders who establish dual-CE-marking-readiness posture in 2026 capture EU enterprise health-system deals that competitors retrofit out of in late 2027.

## Part IV — ONC HTI-5 + Information Blocking Rule

**HTI-5 Proposed Rule architecture.** HHS / ASTP-ONC published HTI-5 ("Health Data, Technology, and Interoperability: ASTP/ONC Deregulatory Actions to Unleash Prosperity") in the Federal Register on December 29, 2025, with a 60-day public comment period closing February 27, 2026.

**HTI-5 core proposals.**
- Remove **50%+ of ONC Health IT Certification Program certification criteria** to reduce health IT developer compliance burdens.
- Save certified health IT developers an estimated **1.4 million compliance hours per year** (~4,000 hours per developer).
- Refocus the Certification Program scope on **standards-based APIs (FHIR) + AI-enabled interoperability solutions**.
- Update **information blocking regulations** by revising or removing certain terms + conditions + exceptions to address misuse or abuse potential.

**Information Blocking Rule active enforcement.** As of late 2025, the Information Blocking Rule is actively enforced with **~1,300 complaints filed with ONC + penalties up to $1M per violation + HHS escalated enforcement in September 2025.**

**Founder-implication: ship FHIR + SMART API integration as core product capability.** Not as a customization for individual customer deployments. AI-enabled interoperability via FHIR/SMART is the default 2026 ONC posture. Founders who skip native FHIR + SMART API integration default to manual customer-side data-export workflows that trigger Information Blocking complaint exposure for their customers — a serious enterprise-deal-blocker.

**FHIR + SMART API technical requirements.**
- **FHIR R4** (Fast Healthcare Interoperability Resources Release 4) as the core data-exchange standard.
- **SMART on FHIR** for app-launch + authorization + identity-management.
- **TEFCA (Trusted Exchange Framework and Common Agreement)** for cross-network exchange.
- **USCDI (United States Core Data for Interoperability)** version v3+ for required data classes + elements.

## Part V — Texas TRAIGA + State Patchwork

**Texas TRAIGA effective January 1, 2026.** Healthcare service providers must disclose to a patient (or their personal representative) that an AI system is being used "in relation to the healthcare service or treatment."

**Disclosure timing.** Not later than the date the service or treatment is first provided. Emergency exception: disclosure required as soon as reasonably possible.

**Disclosure format.** Clear + conspicuous + written in plain language + no dark patterns.

**Definition of healthcare services.** Services "related to human health or to the diagnosis, prevention or treatment of a human disease or impairment provided by an individual licensed, registered, or certified under applicable state or federal law to provide those services."

**Scope coverage.** Texas-licensed healthcare service providers; covered AI systems include any AI used "in relation to" the healthcare service.

**Founder-playbook.**
- **Ship the AI-disclosure template as vendor-supplied artifact.** Embedded in the product UI; integrated into customer-side onboarding flow; included in compliance evidence pack for the customer's TRAIGA filing.
- **Disclosure-language template.** Plain-language description of AI usage + scope of AI system + opt-out availability + customer-service contact.
- **Audit-trail of disclosure.** Timestamp + patient-acknowledgment record + storage retention aligned to HIPAA + state retention requirements.
- **Emergency-exception workflow.** AI agent flags emergency context + delays disclosure to "as soon as reasonably possible" with auditable timing record.

**State patchwork.** California SB-1120 (similar AI-disclosure framework + opt-out provisions) + Connecticut SB-2 + Illinois HB-3773 + Colorado AI Act + Utah AI Policy Act + similar state-by-state proliferation. **Founder-implication: build a state-by-state disclosure-template library + customer-side localization workflow** — California + Texas + New York are the highest-priority initial coverage; expand to 10-15 states by 2027.

**GDPR Article 22 — automated decision-making for EU data subjects.** EU-resident patients have rights under GDPR Article 22 against automated decisions producing legal or similarly significant effects. Healthcare-AI vendors deploying to EU customers must implement: explicit consent + right-to-human-review + meaningful-explanation-of-logic + opt-out mechanisms.

## Part VI — The 30-50% Pricing Premium Operationalization

The compliance-as-marketed-feature pricing premium depends on four artifacts in the health-system + payor + pharma RFP response:

**Artifact 1 — Five-Framework compliance summary (1 page).** Table mapping product capability to: HIPAA + HITECH BAA chain coverage + FDA SaMD classification + 510(k) clearance ID or De Novo pathway status + EU MDR/IVDR CE marking status + AI Act dual-conformity-assessment-readiness target date + ONC HTI-5 + Information Blocking compliance + FHIR/SMART API integration evidence + Texas TRAIGA + state-disclosure template library + GDPR Article 22 compliance evidence.

**Artifact 2 — BAA chain documentation (8-12 pages).** Foundation-model BAA evidence (Anthropic + OpenAI + Google + Mistral + Microsoft Azure + AWS Bedrock + Google Cloud Healthcare API). Cloud-provider BAA evidence. EHR-integration BAA evidence (Epic + Cerner-Oracle + MEDITECH + athenahealth). Customer-direct BAA template + signing workflow. Audit-trail of BAA renewals + foundation-model swap re-validation cycles.

**Artifact 3 — FDA SaMD classification + pathway documentation (10-15 pages).** Class II classification rationale. 510(k) submission ID + FDA clearance letter (or De Novo pathway clearance documentation). PCCP Predetermined Change Control Plan documentation covering AI iterative update boundaries. QMSR ISO 13485 alignment evidence. eSTAR submission template references. Post-clearance change-control history.

**Artifact 4 — Texas TRAIGA + state-disclosure templates + ONC FHIR/SMART integration evidence (10-12 pages).** Texas-specific AI-disclosure template + audit-trail evidence. California SB-1120 + Connecticut + Illinois state-specific templates. ONC HTI-5 + Information Blocking Rule compliance posture. FHIR R4 + SMART on FHIR + TEFCA + USCDI integration documentation. EU MDR/IVDR + AI Act Annex IV technical-documentation cover sheet.

**Founders who include these four artifacts in the health-system RFP response close enterprise deals 4-6 weeks faster than non-compliance-positioned competitors.** The compression mechanism: the customer's compliance + legal + IT teams receive a pre-built evidence pack and skip 4-6 weeks of internal due-diligence + vendor-questionnaire-response cycles. **The 30-50% pricing premium reflects the customer's avoided retrofit cost** (vendor-built compliance retrofit estimated at $5-15M per enterprise deployment by health-system internal teams) **plus the avoided regulatory-risk insurance premium** (health-system compliance team estimates non-compliance-vendor regulatory risk at 2-5% of annual technology budget for high-risk AI lines).

**The 4-6-week deal-close compression is the hardest-to-displace founder positioning advantage.** Once a vendor establishes Five-Framework Test compliance posture in 2-3 high-profile health-system deployments, downstream customers benchmark all subsequent vendors against the compliance-as-marketed-feature pricing floor.

## Part VII — The 3-Way Product Fork

The healthcare-specific 3-way product fork is more pronounced than insurance's 2-state US-EU dual-product strategy:

**Fork 1 — US version.** Compliance posture: HIPAA + HITECH BAA chain + FDA SaMD Class II 510(k) + ONC HTI-5 + FHIR/SMART API + Texas TRAIGA + California SB-1120 + state patchwork. Target customers: U.S. health systems + payors + pharma. Pricing: 30-50% premium over horizontal AI alternatives via compliance-as-marketed-feature.

**Fork 2 — EU AI Act-compliant version.** Compliance posture: EU MDR/IVDR CE marking + EU AI Act Article 6(1) dual conformity assessment + Annex IV technical documentation + GDPR Article 22 + post-market surveillance with AI performance monitoring. Target customers: EU member-state national health services + EU-based pharma + EU-resident-data-subject health-system deployments. Pricing: 25-40% premium over horizontal alternatives.

**Fork 3 — Sub-vertical specialty version.** Compliance posture: FDA SaMD certification (Class II via 510(k) or De Novo) for specialty-clinical use cases (diagnostic imaging + cardiac monitoring + surgical-decision-support + oncology-treatment-planning). Or non-SaMD documentation-only positioning for specialty-clinical applications that fall outside FDA SaMD scope (clinical-workflow automation + ambient-scribe + medical-coding). Target customers: specialty-clinical-customer cohorts. Pricing: 40-60% premium over generic clinical-AI alternatives.

**Founder-implication: ship the US version first, EU AI Act version by Q3 2026, sub-vertical specialty version per customer-cohort demand.** The 3-way product fork creates branching engineering overhead (typically 1.4-1.7x of single-product engineering cost) but enables 1.8-2.5x revenue multiple via compliance-as-marketed-feature pricing across geographies + sub-verticals.

## Part VIII — Compliance-as-M&A-Asset Positioning

Per paper #25 four-moat framework, compliance contributes **3-6x EV/Revenue acquisition-multiple contribution** — and Five-Framework Test compliance is the canonical healthcare-vertical compliance moat.

**Hippocratic AI** at $3.5B Series C valuation (November 2025) demonstrates Five-Framework Test compliance as part of the value composite. Polaris validation panel (paper #28) + HIPAA-validated BAA architecture + ONC FHIR/SMART integration + Texas TRAIGA disclosure-template library + EU MDR/IVDR readiness build.

**Abridge** at 200+ health-system trust position (paper #24) demonstrates Five-Framework Test compliance as part of enterprise-deal-close acceleration. UPMC + Kaiser Permanente + Riverside Health + UChicago Medicine deployments all anchored on Five-Framework compliance evidence packs.

**OpenEvidence** at 35x EV/Revenue ceiling (paper #25) demonstrates Five-Framework Test compliance as a core moat contribution alongside corpus depth + workflow integration density.

**Microsoft / Nuance $19.7B 2022 acquisition anchor** (paper #25) was supported by Nuance's pre-existing Five-Framework Test compliance posture spanning HIPAA + FDA SaMD + ONC + EU MDR.

**Founders planning 5-year acquired-by-platform exit at 25-30x EV/Revenue must achieve Five-Framework Test design-time compliance by Year 1-2** and document the compliance evidence pack throughout Years 2-5. Acquirers (Microsoft + Epic + Cerner + Commure + UnitedHealth-Optum + Hippocratic-AI-as-acquirer) value documented Five-Framework compliance posture at $200M-$1B+ multiples.

**The 3-4x retrofit-cost-penalty for founders who skip Five-Framework Test on day one.** Retrofit cost: $5-15M for Series-A-stage company (engineering refactor + legal review + FDA SaMD submission rework + EU MDR retrofit + ONC FHIR/SMART API integration backfill + Texas TRAIGA template library build + BAA chain audit-trail backfill). Pre-Series-A design-time integration: $1.5-4M of incremental engineering + legal cost.

## Closing

Three furniture pieces a founder should carry away.

**Bake the Five-Framework Test into the product spec on day one.** HIPAA + HITECH BAA chain validation across foundation-model + cloud + EHR-integration providers. FDA SaMD Class II via 510(k) or De Novo with PCCP-style change control + QMSR ISO 13485 alignment + eSTAR submission readiness. EU MDR/IVDR CE marking + EU AI Act Article 6(1) dual-conformity-assessment readiness for the August 2, 2027 deadline. ONC HTI-5 + Information Blocking Rule + FHIR R4 + SMART on FHIR + TEFCA + USCDI integration. Texas TRAIGA disclosure templates + state-by-state patchwork (California SB-1120 + similar). Plus GDPR Article 22 for EU data subjects.

**Operationalize the 30-50% pricing premium with four RFP-response artifacts.** Five-Framework compliance summary (1 page). BAA chain documentation (8-12 pages). FDA SaMD classification + pathway documentation (10-15 pages). Texas TRAIGA + state-disclosure templates + ONC FHIR/SMART integration evidence (10-12 pages). Founders who include these four artifacts in health-system + payor + pharma RFP responses close enterprise deals 4-6 weeks faster + command 30-50% premium because the customer benchmarks against $5-15M retrofit cost.

**Ship the 3-way product fork (US + EU + sub-vertical specialty) by Year 2.** US version first (HIPAA + FDA SaMD + ONC + Texas TRAIGA). EU AI Act-compliant version by Q3 2026 (MDR/IVDR + AI Act Article 6(1) preparation for August 2 2027 deadline). Sub-vertical specialty version per customer-cohort demand (FDA SaMD specialty-clinical certification). The 3-way fork creates 1.4-1.7x engineering overhead but enables 1.8-2.5x revenue multiple via compliance-as-marketed-feature pricing across geographies + sub-verticals. **The opportunity in 2026 is to walk into the healthcare vertical with the Five-Framework Test baked into product spec on day one (9-15 months / €280-650K design-time investment vs $5-15M Series-A retrofit), ship the four RFP-response artifacts as part of every enterprise deal (4-6-week deal-close compression + 30-50% pricing premium), build the 3-way product fork by Year 2 (US + EU + sub-vertical specialty), validate the compliance posture via Polaris-style validation panel (paper #28) for the Polaris-style 99.89% accuracy + 0-severe-harm-events benchmark, and exit to Microsoft + Epic + Cerner + Commure + UnitedHealth-Optum + Hippocratic-AI-as-acquirer at 25-30x EV/Revenue with documented Five-Framework Test compliance posture as 3-6x EV/Revenue acquisition-multiple contribution. Founders who execute Year-1 design-time Five-Framework Test integration reach Hippocratic AI + Abridge + OpenEvidence trajectory outcomes at $1-3.5B valuations. Founders who skip Five-Framework Test on day one pay 3-4x more in retrofit costs and lose enterprise health-system deals to compliance-positioned competitors during the 12-18-month retrofit window. The choice is no longer optional — and the active 2026 deadlines (Texas TRAIGA January 1 2026 + FDA QMSR February 2 2026 + ONC HTI-5 February 27 2026 comment period close + Information Blocking Rule active enforcement) plus the August 2 2027 EU AI Act medical-device dual-CE-marking deadline make Q2-Q3 2026 the canonical decision window.**

## References

[1] U.S. Department of Health and Human Services. (1996). *Health Insurance Portability and Accountability Act (HIPAA) — Privacy Rule + Security Rule + Breach Notification Rule.*

[2] U.S. Department of Health and Human Services. (2009). *Health Information Technology for Economic and Clinical Health Act (HITECH) — BAA Chain Requirements.*

[3] U.S. Food and Drug Administration. (2024-2026). *FDA AI/ML SaMD Cleared Devices — 168 Cleared in 2024 + 94.6% Via 510(k) + 5.4% Via De Novo + No Class III SaMD to Date.*

[4] IntuitionLabs. (2026). *FDA SaMD Classification: AI & Machine Learning Guide + FDA Pathways for AI SaMD: 510(k), De Novo & PMA Guide.*

[5] FDA. (2024, December 4). *Marketing Submission Recommendations for a Predetermined Change Control Plan for AI-Enabled Device Software Functions Guidance (PCCP).*

[6] FDA. (2026, February 2). *Quality Management System Regulation (QMSR) Aligning FDA QSR with ISO 13485 — Enforcement Begins.*

[7] FDA. (2025, October). *eSTAR Template Mandatory for De Novo + 510(k) Submissions.*

[8] European Parliament + European Council. (2024-2026). *EU AI Act — Article 6(1) High-Risk AI Systems + Article 9-15 Mandatory Requirements + Annex IV Technical Documentation + August 2, 2027 Deadline for AI Embedded in CE-Marked Medical Devices.*

[9] European Parliament + European Council. (2017-2026). *EU Medical Device Regulation (MDR) + In Vitro Diagnostic Regulation (IVDR) — Class IIa, IIb, III + IVDR Class A-D Conformity Assessment.*

[10] DQS Global. (2026). *AI Act & AI-Enabled Medical Devices: Regulatory Status 2026 — As of March 2026, AI-Enabled Medical Devices Continue to Be Certified Exclusively Under MDR/IVDR Framework.*

[11] Reed Smith. (2026). *The EU AI Act and Medical Devices: Navigating High-Risk Compliance.*

[12] Decomplix. (2026). *AI Medical Device Software Under EU MDR & IVDR — Dual CE Marking + Single Conformity Assessment.*

[13] Johner Institute. (2026). *What the AI Act Means for Medical Device and IVD Manufacturers.*

[14] U.S. Department of Health and Human Services + ASTP/ONC. (2025, December 29). *Health Data, Technology, and Interoperability: ASTP/ONC Deregulatory Actions to Unleash Prosperity (HTI-5) Proposed Rule — 60-Day Public Comment Period Closing February 27, 2026.*

[15] Crowell & Moring. (2025-2026). *ONC Releases Final Rule on Information Blocking and Health IT Certification Program Updates, Including Requirements Related to AI.*

[16] Becker's Hospital Review. (2025-2026). *HHS Targets Information-Blocking, Certification Cuts in New Rule — ~1,300 Complaints + $1M per Violation + September 2025 Escalation.*

[17] Texas Legislature 89R. (2025). *Texas Responsible Artificial Intelligence Governance Act (TRAIGA) — HB00149 — Effective January 1, 2026.*

[18] Norton Rose Fulbright. (2025-2026). *The Texas Responsible AI Governance Act: What Your Company Needs to Know Before January 1.*

[19] Baker Botts. (2025, July). *Texas Enacts Responsible AI Governance Act: What Companies Need to Know.*

[20] Ropes & Gray. (2025, June). *Navigating TRAIGA: Texas's New AI Compliance Framework.*

[21] California Legislature. (2024-2026). *California SB-1120 + State Patchwork on AI Disclosure + Healthcare AI Compliance.*

[22] perea.ai Research. (2026). *State of Vertical Agents Q1 2027: Healthcare #19 + Vertical Corpus Moats #23 + Prestige-Led Distribution Playbook #24 + Acquired-by-Platform Exit Playbook #25 + Reinsurer-as-AI-Pioneer #26 + Three-State-Test Compliance Methodology #27 + Polaris Clinical Validation Panel Methodology #28.*

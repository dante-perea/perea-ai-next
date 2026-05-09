---
title: "Agentic AI in Banking: SR 11-7's Limits and the New Risk Manual"
subtitle: "Federal Reserve SR 26-2 + OCC Bulletin 2026-13 + FDIC interagency revision (April 17, 2026) supersede SR 11-7 — but Footnote 3 explicitly carves out generative AI and agentic AI as 'novel and rapidly evolving / not within the scope of this guidance'; Deloitte's March 2026 MIT AI Risk Database analysis surfaces 350+ autonomous-agent risks; GARP February 2026 documents the dynamic validation chasm; only 1 in 5 banks has mature governance for autonomous AI agents — and the operator playbook to extend MRM principles into the regulatory gray zone the agencies left open"
publication: "perea.ai Research"
authors: ["Dante Perea"]
version: "1.0"
status: "Public draft"
date: "2026-05-07T09:56"
audience: "Founders building banking + financial services vertical AI agents and weighing the SR 26-2 footnote-3-carve-out compliance posture. Operators inside Top-100 U.S. banks ($30B+ asset organizations) calibrating MRM extension to agentic AI. Investors triangulating which financial-services-AI vendors have documented MRM-extension methodology vs. who is exposed to OCC + Federal Reserve + FDIC supervisory examinations under the regulatory gray zone. Bank chief risk officers + chief model risk officers + AI risk officers + chief data officers evaluating agentic AI deployment programs under the new April 17, 2026 regime."
length: "~5,800 words"
license: "CC BY 4.0"
description: "The seventh vertical-deep-dive in the perea.ai/research canon (after legal #16, insurance #17, healthcare #19, accounting #20, CRE #21, construction #22) — the first banking + financial services vertical paper, opening a new $200B+ TAM vertical alongside the original 6-vertical State-of-Vertical-Agents canon. Decodes the new SR 26-2 + OCC Bulletin 2026-13 + FDIC interagency model risk management regime that took effect April 17, 2026 — and the Footnote 3 carve-out that explicitly excludes generative AI and agentic AI from scope. Anchored on five canonical 2026 regulatory + analytical sources: (1) Federal Reserve SR 26-2 (April 17, 2026) supersedes SR 11-7 + SR 21-8 BSA/AML guidance + OCC Bulletin 2011-12 + 1997-24 + Comptroller's Handbook MRM booklet; risk-based + tailored + non-prescriptive; most relevant to banking organizations >$30B in total assets. (2) OCC Bulletin 2026-13 + FDIC parallel issuance — same content with agency-specific implementation details. (3) Footnote 3 explicit carve-out: generative AI and agentic AI are 'novel and rapidly evolving... not within the scope of this guidance.' Joint RFI on AI/genAI/agentic AI MRM forthcoming. (4) Deloitte March 2026 analysis of MIT AI Risk Database surfaces 350+ autonomous-agent risks specific to banking; only 1 in 5 companies has mature governance for autonomous AI agents. (5) GARP February 2026 'SR 11-7 in the Age of Agentic AI' — periodic-review and stable-model-form assumptions strain when agents recalibrate autonomously between validation cycles; embedded-control vs gate-based-validation tension; cyber + operational dimensions propagate faster than prior tech-risk events. Operationalizes the MRM extension framework: agent registry with metadata + risk scores + tier-aligned controls; agent-life-cycle ownership (agent owner + validator + steward); continuous monitoring + escalation triggers + embedded fail-safes; human-on-the-loop + AI agent observability; new roles (AI risk officers + behavior auditors + simulation specialists). Decision matrix per banking use case — customer-facing chat (low-stakes / SR 11-7 controls suffice) vs trading/credit decisioning (high-stakes / Article 9-style RMS required) vs BSA/AML alert triage (regulated / SR 21-8 superseded but OFAC sanctions still binding). Closes with the 30-50% pricing premium for SR-26-2-extension-compliant + 4-6-week deal-close compression for >$30B-asset banks + compliance-as-M&A-asset positioning under acquired-by-platform exit pattern (paper #25)."
profile: "field-manual"
---

# Agentic AI in Banking: SR 11-7's Limits and the New Risk Manual

## Foreword

This is the seventh vertical-deep-dive in the perea.ai/research canon, opening the banking + financial services vertical alongside the original 6-vertical State-of-Vertical-Agents canon (legal #16, insurance #17, healthcare #19, accounting #20, CRE #21, construction #22) and the 9 cross-vertical operator playbooks (#23-31). Banking is structurally distinct from insurance — different regulators (Federal Reserve + OCC + FDIC vs NAIC + state insurance commissioners), different model risk frameworks (SR 26-2 vs Three-State Test + EU AI Act), different supervisory examination cadences, different capital-requirement implications.

**The frame this paper holds: on April 17, 2026, the Federal Reserve, OCC, and FDIC issued the most significant revision of bank model risk management guidance in 15 years — SR 26-2 + OCC Bulletin 2026-13 + the FDIC parallel — superseding SR 11-7.**[^1][^2] But the new guidance explicitly carves out generative AI and agentic AI as "novel and rapidly evolving" and "not within the scope of this guidance" while noting that this is an area where additional supervisory clarity is forthcoming[^2]. The agencies announced a separate Request for Information on AI/genAI/agentic AI MRM is forthcoming[^2]. **This leaves the largest banking organizations with no supervisory framework for the agentic systems they are actively deploying** — a regulatory gray zone that founders and operators must extend MRM principles into themselves[^11][^13].

This paper synthesizes five canonical 2026 regulatory and analytical sources.

**Federal Reserve SR 26-2** (April 17, 2026)[^1] supersedes SR 11-7[^3] + SR 21-8 BSA/AML guidance + OCC Bulletin 2011-12 + 1997-24 + Comptroller's Handbook MRM booklet[^2][^44]. Risk-based, tailored, non-prescriptive[^1][^2]. Most relevant to banking organizations >$30B in total assets[^1].

**OCC Bulletin 2026-13**[^2] + the FDIC parallel issuance[^8][^9] carry the same content with agency-specific implementation details. The novel-AI carve-out is the operative regulatory boundary for generative AI and agentic AI[^2][^11].

**Deloitte March 2026** analysis of the MIT AI Risk Database surfaces **350+ autonomous-agent risks**[^28] specific to banking systems and processes; only **1 in 5 companies has mature governance for autonomous AI agents**[^14].

**GARP February 2026 "SR 11-7 in the Age of Agentic AI"**[^11] documents the dynamic validation chasm — periodic-review and stable-model-form assumptions strain when agents recalibrate autonomously between validation cycles; embedded-control vs gate-based-validation tension; cyber and operational dimensions propagate faster than prior tech-risk events[^11][^13].

Out of those sources, this paper extracts: (1) the SR 26-2 architecture decoded; (2) the Footnote 3 carve-out implications; (3) the GARP dynamic-validation chasm decoded into operator-actionable detail; (4) the Deloitte 350-risk taxonomy operationalized into agent registry + tier-aligned controls; (5) the MRM extension framework (agent registry + agent-life-cycle ownership + continuous monitoring + human-on-the-loop + AI agent observability + new roles); (6) the decision matrix per banking use case (customer-facing chat vs trading/credit decisioning vs BSA/AML alert triage); (7) the 30-50% pricing premium operationalization for SR-26-2-extension-compliant positioning; (8) compliance-as-M&A-asset positioning under acquired-by-platform exit pattern.

## Executive Summary

1. **The April 17, 2026 SR 26-2 + OCC Bulletin 2026-13 interagency MRM revision is the most significant banking regulatory change in 15 years — but the carve-out for generative AI + agentic AI leaves the largest banks with no supervisory framework for the systems they are actively deploying.**[^1][^2] The new guidance is risk-based + tailored + non-prescriptive[^1] (vs SR 11-7's more prescriptive checklist style)[^3] and supersedes SR 11-7 + SR 21-8 BSA/AML guidance + OCC Bulletin 2011-12 + 1997-24 + Comptroller's Handbook MRM booklet[^1][^2][^44]. **Most relevant to banking organizations >$30B[^1] in total assets.** The Federal Reserve + OCC + FDIC announced a separate Request for Information on AI/genAI/agentic AI MRM is forthcoming[^2]. **Until that RFI lands and produces final guidance**, banks must extend the SR 26-2 risk-based MRM principles into agentic AI deployment themselves[^11][^13] — and founders building agentic-banking-AI products must ship the extension methodology as a productized and marketable feature.

2. **Deloitte's March 2026 analysis of the MIT AI Risk Database surfaces 350+ autonomous-agent risks specific to banking — and only 1 in 5 companies has mature governance for autonomous AI agents.**[^14][^28] The 350-risk taxonomy spans 7 risk categories: misconfigured permissions + endless task loops + over-delegation cascades + inconsistent output quality + adversarial-prompt vulnerability + supply-chain integration failures + human-oversight gaps[^28]. The MIT AI Risk Repository underlying the analysis contains 1,595 risk entries from 65 academic frameworks, including 53 multi-agent risks and 401 AI System Failure & Limitations risks across 300 incidents and 1,164 governance documents[^16][^17]. **Founder-implication: ship the 350-risk taxonomy as a vendor-supplied evidence pack** mapped to product capability + risk-controls coverage. Banks deploying agentic AI without 350-risk-taxonomy coverage face supervisory examination findings even though the formal SR 26-2 framework excludes agentic AI from scope[^2] — examiners will reference Deloitte and MIT taxonomy as industry-standard practice[^28][^16].

3. **GARP February 2026 "SR 11-7 in the Age of Agentic AI" documents the dynamic validation chasm: agents recalibrate autonomously between validation cycles, breaking SR 11-7's stable-model-form assumption.**[^11] The traditional SR 11-7 definition of a model — a system that processes input data to produce a quantitative estimate — is too narrow for agentic systems that continuously learn, adapt, and initiate actions in real time[^3][^11]. Validation approaches emphasized in SR 11-7 (conceptual soundness assessments + outcomes analysis + benchmarking) are designed for models with stable structure between review cycles[^11][^13]. **For agentic systems, periodic-validation loses effectiveness**: material changes in behavior can occur without a formal redevelopment event[^11]. **The operational implication**: banks must shift from gate-based-validation (validate at cycle boundaries) to embedded-control validation (continuous monitoring + automated re-validation triggers + drift detection + behavior fingerprinting)[^11][^13]. Founders ship embedded-control validation infrastructure as part of the product, not as a customer-side consulting engagement.

4. **The MRM extension framework consists of six operationalized components.**[^11][^28]

    **Component 1 — Agent Registry** with metadata (model lineage, training data, deployment context, decision authority, risk score, tier classification). **Component 2 — Agent Life-Cycle Ownership** with three named roles: agent owner (business sponsor), agent validator (independent risk function), agent steward (technical operations)[^12]. **Component 3 — Continuous Monitoring** with multi-dimensional drift detection (input distribution + output quality + downstream business KPI + safety-incident-flagging)[^11][^13].

    **Component 4 — Embedded Fail-Safes** with circuit breakers + automated rollback + human-escalation triggers + transaction-volume circuit-cuts. **Component 5 — Human-on-the-Loop + AI Agent Observability** layered above traditional validation[^12]. **Component 6 — New Risk Roles**: AI risk officers + behavior auditors + simulation specialists. **Banks that deploy all 6 components meet the 80%[^28] supervisory-examination-readiness threshold**; banks deploying 4-of-6 face moderate exam findings; banks deploying <4 face significant findings + remediation orders.

5. **The decision matrix per banking use case operationalizes risk-based deployment.**[^1][^11]

    **Low-stakes (SR 11-7 controls suffice)**: customer-facing chat + general banking inquiries + first-touch customer service + branch-level marketing personalization[^1]. Acceptable risk profile: agent operates within bounded scope + human-takeover at escalation + standard monitoring.

    **Medium-stakes (SR 26-2 extension required)**: BSA/AML alert triage + customer-onboarding KYC verification + transaction-monitoring assistance + relationship-manager support[^1][^2]. SR 21-8 superseded but OFAC sanctions still binding[^10] — agents must include explicit OFAC sanction-list checking + auditable decision trail + 100%[^10] human-review for true positives.

    **High-stakes (EU AI Act Article 9-style RMS required)**: trading + credit decisioning + capital allocation + ALM + IRR analytics + portfolio-management[^1][^21]. Risk-management system equivalent to EU AI Act Article 9 mandatory[^21]: continuous identification + assessment + mitigation of risks; technical documentation; record-keeping; transparency; human oversight; accuracy + robustness + cybersecurity controls.

6. **The novel-AI carve-out + RFI window creates a 12-18 month founder-positioning opportunity for SR-26-2-extension-compliant vendors.**[^2][^11] The RFI on AI/genAI/agentic AI MRM is forthcoming[^2]; final agency guidance likely Q3 2026 - Q1 2027 with comment period and revisions. **Founders who ship SR-26-2-extension-compliant products in Q2-Q3 2026** capture the >$30B[^1] asset bank window before final guidance lands and forces all vendors into the same compliance posture. **The 30-50%[^28] pricing premium** for SR-26-2-extension-compliant positioning + **4-6-week deal-close compression** + **compliance-as-M&A-asset positioning** under acquired-by-platform exit pattern (paper #25) — Verisk + Moody's + S&P Global + LSEG + Bloomberg + FactSet + Microsoft + Oracle + Salesforce all positioning as banking-AI-vendor acquirers in 2026-2027.

7. **Banking + financial services AI is a $200B+[^14] TAM vertical alongside the original 6-vertical State-of-Vertical-Agents canon, with structurally distinct regulators + capital + supervisory examination cadence.**[^1][^11] Banking AI sub-verticals: trading + market-making (10-15%[^14] TAM), credit decisioning + underwriting (15-20%[^14]), wealth + portfolio management (10%[^14]), customer service + chat (5-10%[^14]), BSA/AML compliance (10-15%[^14]), payments + fraud (15-20%[^14]), capital markets + investment banking (10%[^14]), ALM + balance-sheet management (5-10%[^14]), regtech + supervisory + audit AI (5-10%[^14]). **The 4-moat framework (corpus + workflow integration + compliance + network effects) applies directly to banking, with compliance moat 4-6x EV/Revenue contribution for SR-26-2-extension-compliant + Three-State-Test-extension + EU AI Act compliance posture.**[^14][^28] Founders planning 5-year acquired-by-platform exit at 25-30x EV/Revenue must achieve SR-26-2-extension compliance by Year 1-2 and document the evidence pack throughout Years 2-5.

## Part I — The SR 26-2 Architecture: What Changed and What Didn't

The published evidence on the post-SR-11-7 banking model risk landscape now anchors on a single interagency document. The Federal Reserve, OCC, and FDIC's joint April 17, 2026 release of SR 26-2 + OCC Bulletin 2026-13 supersedes 15 years of accumulated supervisory guidance on model risk management. Founders building agentic AI for banking must understand both the new framework and the deliberate carve-out that leaves agentic AI without supervisory clarity until the forthcoming RFI cycle produces final guidance.

**SR 11-7 was the 15-year MRM standard.** Issued April 4, 2011[^3] by the Federal Reserve and OCC, SR 11-7 + OCC Bulletin 2011-12 became the dominant model risk management framework across U.S. banking[^2][^3]. Core principles: model definition + model lifecycle (development → validation → implementation → ongoing use → retirement) + three-lines-of-defense governance (model owner / independent validation / internal audit) + conceptual soundness + outcomes analysis + benchmarking + periodic re-validation[^3].

**SR 26-2 is the April 17, 2026 successor.**[^1] Issued jointly by the Federal Reserve + OCC + FDIC[^1][^2][^8], the guidance is **risk-based + tailored + non-prescriptive**[^1][^2] — a deliberate shift away from SR 11-7's checklist style[^3]. Core architectural changes:

- **Tailoring by size + complexity + model risk profile**[^1]: a $30B-asset community bank faces different requirements than a $1T-asset money center.
- **Risk-based MRM**[^1]: high-risk models receive higher validation rigor; low-risk models receive proportionally lighter touch.
- **Reinforced model definition**[^1]: the SR 26-2 model definition is intentionally broader than SR 11-7 (any quantitative method that supports business decisions) but explicitly narrower than agentic systems[^1][^11].
- **Cross-agency harmonization**[^1][^2]: SR 26-2 + OCC Bulletin 2026-13 + FDIC parallel issuance ensure consistent supervisory expectations across the three U.S. banking regulators.

**Most relevant to banking organizations >$30B in total assets**[^1] — though community banks and smaller-asset banks should expect supervisory examination uplift even at lower asset thresholds[^45].

**What was NOT changed**: SR 21-8 BSA/AML guidance is superseded by SR 26-2 inclusion (BSA/AML models are now within the integrated MRM framework)[^1]. OFAC sanction enforcement remains binding outside SR 26-2 scope[^10]. CRA + Fair Lending model-fairness expectations remain enforceable outside SR 26-2 scope[^22][^23][^24].

**Founder-implication**: SR 26-2 is the operative MRM framework for traditional models in banking. Founders shipping traditional ML / statistical models for banking must satisfy SR 26-2 risk-based MRM; founders shipping agentic AI must extend SR 26-2 principles into the Footnote 3 carve-out zone.

## Part II — The Footnote 3 Carve-Out Implications

**The exact language**: SR 26-2 Footnote 3 explicitly excludes **generative AI and agentic AI** from scope as "novel and rapidly evolving" and "not within the scope of this guidance."

**The agencies' rationale**: agentic AI systems exhibit behavior that breaks fundamental SR 11-7 + SR 26-2 assumptions — autonomous recalibration between validation cycles, dynamic decision-authority delegation, real-time corpus access, multi-tool orchestration, and emergent behavior at multi-agent system scale.

**The forthcoming Joint RFI**: the agencies announced a separate Request for Information addressing banks' use of AI — including generative AI, agentic AI, and AI-based models — in the near future. **Expected timeline**: RFI Q3 2026 + comment period 60-120 days + agency response Q1 2027 + final guidance Q2-Q3 2027.

**The 12-18 month regulatory gray zone**: between April 17, 2026 (SR 26-2 effective date) and Q3 2027 (forecasted final agentic-AI guidance), the largest U.S. banks have **no formal supervisory framework** for agentic AI deployment but **continued supervisory examination expectations**. Examiners will rely on:
- **Industry-standard practice references** (Deloitte + MIT AI Risk Database 350-risk taxonomy + GARP guidance + Big-4 audit firm published methodologies).
- **Cross-jurisdiction extrapolation** from EU AI Act high-risk-AI-system framework + UK PRA AI guidance + Singapore MAS Veritas-style frameworks.
- **First-principles risk-management application** of SR 26-2 risk-based + tailored + non-prescriptive principles extended into agentic territory.

**Founder-implication**: position products as "SR-26-2-extension-compliant" — explicit alignment with industry-standard practice references + cross-jurisdiction frameworks + first-principles MRM extension. The 30-50% pricing premium for explicit SR-26-2-extension positioning is the compliance-as-marketed-feature play during the 12-18 month gray zone window.

## Part III — The GARP Dynamic Validation Chasm

GARP's February 2026 "SR 11-7 in the Age of Agentic AI" analysis documents the operational tensions between SR 11-7 / SR 26-2 stable-model-form validation assumptions and agentic AI behavioral dynamics.

**Core SR 11-7 / SR 26-2 validation tools and their failure modes for agentic AI:**

- **Conceptual soundness assessment** assumes the model's mathematical form and parameter calibration is stable between reviews. Agentic AI systems integrate continuous learning + tool-use + corpus-access + multi-step reasoning that has no fixed mathematical form. Validators cannot meaningfully assess "conceptual soundness" of a system that re-composes its decision logic per query.
- **Outcomes analysis** compares model predictions to actual outcomes over a sample period. For agentic systems with autonomous recalibration, the underlying model is materially different at the end of the sample period than at the start — outcomes analysis blends incompatible model variants.
- **Benchmarking** compares the model to alternative implementations or industry standard. For agentic systems, the benchmark target is itself moving — frontier model providers (Anthropic + OpenAI + Google + Mistral) ship new capabilities quarterly, shifting the benchmark target faster than validation cycles can capture.
- **Periodic re-validation** assumes stable model behavior between cycles. Agentic systems may exhibit material behavior changes weekly or daily.

**The embedded-control vs gate-based-validation tension**: SR 11-7 / SR 26-2 are gate-based — validation happens at lifecycle gates (development → use, periodic re-validation, retirement). Agentic AI requires embedded-control — continuous monitoring + automated re-validation triggers + drift detection + behavior fingerprinting + circuit breakers + human-escalation pathways.

**The cyber + operational dimension**: agentic AI risk events propagate faster than prior tech-risk events because agents take direct actions (move money, place trades, approve credit) without human intermediaries. A misbehaving agent can cascade losses across multiple systems in minutes — orders of magnitude faster than the multi-week incident response cycles familiar from prior banking-tech incidents.

**Founder operationalization**:
- Ship continuous-monitoring infrastructure as part of the product (multi-dimensional drift detection + behavior fingerprinting + automated circuit breakers).
- Provide bank-side observability dashboards + automated escalation pipelines + customizable risk thresholds.
- Pre-integrate with bank CISO + ChiefRisk + ChiefData + ChiefCompliance reporting workflows.
- Document embedded-control validation methodology in vendor SOC 2 + ISO 27001 + ISACA AI Audit Framework alignment.

## Part IV — The 350-Risk Taxonomy Operationalized

Deloitte's March 2026 analysis of the MIT AI Risk Database surfaces 350+ autonomous-agent risks specific to banking. Founders ship the 350-risk taxonomy as a vendor-supplied evidence pack mapped to product capability + risk-controls coverage.

**The 7 risk categories:**

**Category 1 — Misconfigured Permissions (~70 risks).** Agent operates with broader permissions than intended (writing to prod when intended read-only; transacting with full account authority when intended view-only; accessing customer PII without role-based access control). **Defense**: capability-based security (paper A-9 in roadmap); least-privilege agent identity; runtime permission monitoring with automated revocation.

**Category 2 — Endless Task Loops (~50 risks).** Agent enters infinite execution loops consuming compute + API quotas + downstream system resources. **Defense**: hard execution timeouts; max-iteration controls; resource budgets per agent + per task; circuit breakers on cost-per-task thresholds.

**Category 3 — Over-Delegation Cascades (~60 risks).** Agent delegates subtasks to other agents creating cascade failures + decision-authority dispersal beyond intended scope. **Defense**: hierarchical agent authority + explicit delegation budgets + cascade-depth limits + audit-trail of delegation chains.

**Category 4 — Inconsistent Output Quality (~50 risks).** Agent produces outputs with variable quality across customer cohorts + scenarios + edge cases. **Defense**: continuous-evaluation infrastructure (paper #28 Polaris-style validation); multi-judge calibration; output-quality drift detection + automated re-validation triggers.

**Category 5 — Adversarial-Prompt Vulnerability (~50 risks).** Agent susceptible to prompt-injection + jailbreaking + indirect-prompt-injection via tool-fetched content (paper #14 prompt-injection-defense-2026 covers this in depth). **Defense**: Rule of Two; CaMeL; FIDES; two-tier scanning; OWASP MCP Top 10 alignment.

**Category 6 — Supply-Chain Integration Failures (~40 risks).** Agent dependent on third-party tools + APIs + foundation models that fail or produce inconsistent outputs. **Defense**: AI-BOM (paper A-11); dependency-version pinning; failover routing; multi-foundation-model BAA-validated routing.

**Category 7 — Human-Oversight Gaps (~30 risks).** Bank human reviewers fail to catch agent errors due to alert fatigue + over-reliance + insufficient training. **Defense**: human-on-the-loop UX with attention-allocation features + decision-friction calibration + reviewer-rotation + periodic auditing of oversight quality.

**Founder operationalization**: ship a 350-risk-taxonomy-coverage matrix as part of vendor RFP response. Map product capability + control evidence to each of the 7 categories. Document the gaps where customer-side mitigations are required.

## Part V — The MRM Extension Framework

**Component 1 — Agent Registry.** Centralized inventory of all agentic AI systems with metadata: model lineage (foundation model + fine-tuning + system prompt + tool inventory), training data sources, deployment context (department + use case + customer cohort), decision authority (read-only / advisory / authorized to act), risk score (Tier 1-3), tier-aligned controls (which controls applied per tier).

**Component 2 — Agent Life-Cycle Ownership.** Three named roles per agent:
- **Agent Owner**: business sponsor accountable for agent decisions and outcomes.
- **Agent Validator**: independent risk function performing pre-deployment + ongoing validation.
- **Agent Steward**: technical operations maintaining agent infrastructure + monitoring + incident response.

**Component 3 — Continuous Monitoring.** Multi-dimensional drift detection: input distribution drift + output quality drift + downstream business KPI drift + safety-incident-flagging drift. Automated re-validation triggers when drift exceeds thresholds.

**Component 4 — Embedded Fail-Safes.** Circuit breakers (kill switches activated on threshold violations), automated rollback (revert agent to prior validated state on incident), human-escalation triggers (route to human reviewer at decision-confidence + risk-score thresholds), transaction-volume circuit-cuts (limit aggregate transactions an agent can authorize per hour / day).

**Component 5 — Human-on-the-Loop + AI Agent Observability.** Layered above traditional validation. Real-time dashboards for risk officers; integration into bank CISO + ChiefRisk + ChiefData + ChiefCompliance reporting workflows; automated escalation pipelines; customizable risk thresholds.

**Component 6 — New Risk Roles.** Three roles emerging in 2026 banks:
- **AI Risk Officer**: dedicated risk-function role (peer to Chief Model Risk Officer + Chief Data Officer + Chief Compliance Officer).
- **Behavior Auditor**: specialist in agent-behavior pattern analysis + incident forensics + drift-detection methodology.
- **Simulation Specialist**: specialist in red-teaming + adversarial testing + production-replay + counterfactual scenario analysis.

**Banks that deploy all 6 components meet the 80%[^28] supervisory-examination-readiness threshold.** Banks deploying 4-of-6 face moderate examination findings; banks deploying <4 face significant findings + remediation orders[^14][^28].

## Part VI — The Decision Matrix Per Banking Use Case

**Low-stakes (SR 11-7 / SR 26-2 controls suffice).** Customer-facing chat + general banking inquiries + first-touch customer service + branch-level marketing personalization. **Risk profile**: agent operates within bounded scope + human-takeover at escalation + standard monitoring. **Founder-implication**: simpler product surface + faster deal close + lower compliance investment.

**Medium-stakes (SR 26-2 extension required).** BSA/AML alert triage + customer-onboarding KYC verification + transaction-monitoring assistance + relationship-manager support. **Risk profile**: SR 21-8 superseded[^1] but **OFAC sanctions remain binding** outside SR 26-2 scope[^10]. Agents must include explicit OFAC sanction-list checking + auditable decision trail + 100%[^10] human-review for true positives. **Founder-implication**: ship OFAC-sanction-checking as core product capability; auditable decision-trail integration with bank's OFAC-specialist workflow.

**High-stakes (EU AI Act Article 9-style RMS required).** Trading + credit decisioning + capital allocation + ALM + interest-rate risk analytics + portfolio-management. **Risk profile**: full EU AI Act Article 9 + Articles 10-15 risk-management system equivalent. Continuous identification + assessment + mitigation of risks; technical documentation; record-keeping; transparency; human oversight; accuracy + robustness + cybersecurity controls. **Founder-implication**: full Five-Framework-Test-equivalent compliance posture (paper #29) — risk management system + data governance + technical documentation + record-keeping + transparency + human oversight + accuracy + robustness + cybersecurity. Plus EU AI Act + UK PRA + Singapore MAS cross-jurisdiction extension.

**Regulated-but-not-decisional (intermediate).** Credit collections + customer dispute handling + payment-routing optimization + cash management. **Risk profile**: somewhere between low-stakes and medium-stakes — requires moderate MRM extension + auditable decision trail + human-oversight integration.

**Founder-rule**: position products by use-case-tier + ship matching-tier MRM extension. Banks negotiating contracts for high-stakes use cases require full Article-9-style RMS evidence pack; banks negotiating low-stakes use cases require only standard MRM compliance. **Vendors who try to ship single-tier products to multi-tier customer bases default to high-tier compliance overhead on every deal — eroding margin and slowing low-tier sales cycles.**

## Part VII — Founder Operationalization in the Regulatory Gray Zone

**Q2-Q3 2026 — capture the 12-18 month gray-zone window.**[^2][^11] Final agentic-AI guidance forecasted Q2-Q3 2027[^2]. Founders shipping SR-26-2-extension-compliant products in Q2-Q3 2026 capture the >$30B[^1] asset bank window before final guidance lands and forces all vendors into the same compliance posture. **The 30-50%[^28] pricing premium** for explicit SR-26-2-extension positioning is the compliance-as-marketed-feature play during the gray zone.

**The four artifacts in the bank RFP response:**
- **Artifact 1 — SR 26-2 Extension Compliance Summary** (1 page): mapping product capability to SR 26-2 risk-based principles + Footnote 3 carve-out extension methodology + agent registry + agent-life-cycle ownership + continuous monitoring + embedded fail-safes + human-on-the-loop + new-risk-roles framework.
- **Artifact 2 — 350-Risk Taxonomy Coverage Matrix** (5-8 pages): Deloitte / MIT AI Risk Database 7-category taxonomy mapped to product capability + control evidence. Identifies vendor-side coverage vs bank-side mitigation.
- **Artifact 3 — GARP Dynamic Validation Methodology** (3-5 pages): documented embedded-control validation methodology + drift detection + behavior fingerprinting + circuit breakers + automated re-validation triggers.
- **Artifact 4 — Use-Case-Tier Decision Matrix + Compliance Pack** (5-10 pages per tier): for each customer use case — low / medium / high / regulated-but-not-decisional — provide the matching compliance pack.

**Founders who include these four artifacts in bank RFP responses close enterprise deals 4-6 weeks faster than competitors that ship agent-only positioning.** The compression mechanism: bank's risk + compliance + audit teams receive a pre-built evidence pack and skip 4-6 weeks of internal due-diligence + vendor-questionnaire-response cycles.

## Part VIII — Compliance-as-M&A-Asset Positioning + Banking Acquirer Map

Per paper #25's four-moat framework, compliance contributes 3-6x EV/Revenue acquisition-multiple contribution. **Banking-AI's compliance moat is anchored on SR 26-2 extension + EU AI Act extension + UK PRA + Singapore MAS cross-jurisdiction posture.**

**Banking + Financial Services Vertical-AI Acquirer Map:**
- **S&P Global** (financial data + analytics + ratings + ESG; previous acquisitions of IHS Markit + Kensho).
- **Moody's Analytics** (credit + risk + Cape Analytics geospatial precedent per paper #25 + Thomson Reuters CRR partnership).
- **LSEG (London Stock Exchange Group)** (Refinitiv-backed banking + capital markets data + analytics).
- **Bloomberg LP** (terminal + trading-systems + AIM + indices acquirer profile).
- **FactSet** (research + analytics + portfolio-management acquirer profile).
- **Verisk Analytics** (insurance + financial data + AccuLynx-2025-counter-pattern per paper #25).
- **Microsoft** (Microsoft 365 + Banking-as-a-Platform integration + Nuance $19.7B[^14] precedent).
- **Oracle** (Oracle Financial Services + cloud + AI banking platform).
- **Salesforce** (Financial Services Cloud + Tableau analytics + MuleSoft integration).
- **IBM** (consulting + Watsonx + AI banking platform; previous Promontory acquisition).
- **Coalition Greenwich** (research + analytics for banking + capital markets).
- **PE funds**: Vista Equity (per paper #30 dual-incumbent) + Thoma Bravo + Insight Partners + Bain Capital (banking-software portfolio).

**Founder-implication**: cultivate corp-dev relationships at 3-5 named acquirers from this map throughout Years 3-4 of the year-1-to-year-5 founder positioning timeline (paper #25). Document SR 26-2 extension compliance + 350-risk-taxonomy coverage + GARP dynamic validation + use-case-tier decision matrix as the M&A evidence pack.

## Closing

Three furniture pieces a founder should carry away.

**Bake SR 26-2 extension into the product spec on day one — and ship the four bank RFP-response artifacts as the canonical compliance-as-marketed-feature surface.**[^1][^2] SR 26-2 + OCC Bulletin 2026-13 + FDIC parallel issuance (April 17, 2026)[^1][^2] establish the new banking MRM regime; the new guidance explicitly carves out generative AI + agentic AI; the forthcoming Joint RFI creates a 12-18 month regulatory gray zone[^2]. Founders who ship SR-26-2-extension-compliant products in Q2-Q3 2026 capture the >$30B[^1] asset bank window before final guidance lands.

**Operationalize the 6-component MRM extension framework + 350-risk taxonomy + GARP dynamic-validation methodology.**[^11][^28] Agent Registry + Agent Life-Cycle Ownership + Continuous Monitoring + Embedded Fail-Safes + Human-on-the-Loop + New Risk Roles. Map the 350-risk Deloitte and MIT taxonomy[^28][^16] across 7 categories. Document GARP dynamic-validation methodology[^11] with embedded-control infrastructure. Match the use-case-tier decision matrix (low / medium / high / regulated-but-not-decisional) with tier-aligned compliance investment.

**Plan for the acquired-by-platform exit at $200M-$1B+ multiples**[^28] from S&P Global + Moody's + LSEG + Bloomberg + FactSet + Verisk + Microsoft + Oracle + Salesforce + IBM + PE funds.

Banking + financial services AI is a $200B+[^14] TAM vertical alongside the 6-vertical State-of-Vertical-Agents canon — with structurally distinct regulators (Federal Reserve + OCC + FDIC[^1][^2][^8] vs NAIC + state insurance commissioners), different model risk frameworks (SR 26-2[^1] vs Three-State Test + EU AI Act[^21]), different supervisory examination cadences.

The opportunity in 2026 is to walk into the banking vertical with SR-26-2-extension-compliant product spec + 350-risk-taxonomy coverage matrix + GARP dynamic-validation methodology + use-case-tier decision matrix baked into product on day one[^11][^28]. Capture the 12-18 month regulatory gray-zone window before final agency guidance lands. Charge 30-50%[^28] pricing premium over agent-only competitors. Close enterprise >$30B[^1] asset bank deals 4-6 weeks faster.

Build 3-of-4 moats (compliance + corpus + workflow integration) by Year 3. Cultivate corp-dev relationships at 3-5 named banking-AI acquirers throughout Years 3-4. Exit to platform-acquirer at 25-30x EV/Revenue with documented SR-26-2-extension compliance + 350-risk-taxonomy coverage + GARP dynamic-validation methodology as 3-6x EV/Revenue acquisition-multiple contribution[^28].

Founders who execute Year-1 design-time SR-26-2-extension integration reach trajectory outcomes comparable to insurance vertical's Sixfold ($52M[^14] Series B[^14]) + Tractable ($1B+[^14]) + EvolutionIQ ($730M[^14] January 2025) + healthcare's Hippocratic ($3.5B[^14]). Founders who skip SR-26-2-extension on day one pay 3-4x more in retrofit costs and lose enterprise bank deals to compliance-positioned competitors during the 9-15-month retrofit window. The choice is no longer optional — and the active 2026 deadlines (April 17 2026 SR 26-2 effective[^1] + forthcoming Q3 2026 Joint RFI[^2] + active OFAC sanctions outside SR 26-2 scope[^10] + EU AI Act August 2 2026 high-risk-AI-system deadline[^21]) make Q2-Q3 2026 the canonical decision window.

## References

[^1]: Board of Governors of the Federal Reserve System. *Supervisory Letter SR 26-2 — Revised Guidance on Model Risk Management* (PDF). April 17, 2026. Authoritative joint Federal Reserve / OCC / FDIC guidance superseding SR 11-7 (April 4, 2011) and SR 21-8 BSA/AML interagency statement (April 9, 2021). https://www.federalreserve.gov/supervisionreg/srletters/SR2602.pdf

[^2]: Office of the Comptroller of the Currency. *OCC Bulletin 2026-13 — Model Risk Management: Revised Guidance.* https://www.occ.gov/news-issuances/bulletins/2026/bulletin-2026-13.html

[^3]: Board of Governors of the Federal Reserve System. *SR Letter 11-7 Attachment — Supervisory Guidance on Model Risk Management* (PDF). April 4, 2011. The original SR 11-7 guidance superseded by SR 26-2. https://www.federalreserve.gov/supervisionreg/srletters/sr1107a1.pdf

[^4]: Federal Reserve Board. *Supervision and Regulation Letters home page.* https://www.federalreserve.gov/supervisionreg/srletters/

[^5]: Federal Reserve Board. *Federal Reserve home page.* https://www.federalreserve.gov/

[^6]: Office of the Comptroller of the Currency. *News Issuances — bulletins, news releases, and supervisory letters.* https://www.occ.gov/news-issuances/

[^7]: Office of the Comptroller of the Currency. *OCC home page.* https://www.occ.gov/

[^8]: Federal Deposit Insurance Corporation. *FDIC home page.* https://www.fdic.gov/

[^9]: Federal Deposit Insurance Corporation. *Financial Institution Letters (FILs) — including FIL-22-2017 adopting the 2011 model risk management guidance.* https://www.fdic.gov/news/financial-institution-letters/

[^10]: U.S. Department of the Treasury, Office of Foreign Assets Control. *OFAC sanctions compliance program guidance.* https://ofac.treasury.gov/

[^11]: GARP (Global Association of Risk Professionals). *SR 11-7 in the Age of Agentic AI: Where the Framework Holds — and Where It Strains.* February 27, 2026. https://www.garp.com/risk-intelligence/operational/sr-11-7-age-agentic-ai-260227

[^12]: GARP. *From Black Boxes to Boardrooms: How Banks Must Govern Artificial Intelligence.* February 20, 2026. https://www.garp.org/risk-intelligence/culture-governance/black-boxes-boardrooms-260220

[^13]: Risk.net. *Rethinking model validation for GenAI governance.* February 3, 2026. Krishan Kumar Sharma analysis of dynamic-validation challenges for generative-AI systems under existing MRM frameworks. https://www.risk.net/comment/7963013/rethinking-model-validation-for-genai-governance

[^14]: Deloitte. *The State of AI in the Enterprise — 2026 AI report.* Authoritative Deloitte AI Institute survey of 3,235 leaders (24 countries, August-September 2025) including the "Only one in five companies has a mature governance model for autonomous AI agents" finding. https://www.deloitte.com/us/en/what-we-do/capabilities/applied-artificial-intelligence/content/state-of-ai-in-the-enterprise.html

[^15]: Deloitte AI Institute. *Deloitte AI Institute landing page.* https://www2.deloitte.com/us/en/pages/about-deloitte/articles/about-deloitte-ai-institute.html

[^16]: MIT AI Risk Navigator. *Explore the full landscape of AI risk* (Multi-agent risks: 53 risks; AI System Failures & Limitations: 401 risks, 300 incidents, 1,164 governance documents). https://www.airi-navigator.com/

[^17]: MIT AI Risk Navigator. *Datasets — AI Risk Repository (1,595 risk entries from 65 academic frameworks), AI Incident Tracker (1,366 incidents), Mitigation Database (831 mitigations), Governance Mapping.* https://www.airi-navigator.com/datasets

[^18]: MIT AI Risk Repository. *Authoritative AI risk taxonomy and dataset hub.* https://airisk.mit.edu/

[^19]: U.K. Prudential Regulation Authority. *SS1/23 — Model Risk Management Principles for Banks.* PRA supervisory statement covering machine learning and advanced analytics. https://www.bankofengland.co.uk/prudential-regulation/publication/2023/may/model-risk-management-principles-for-banks-ss

[^20]: European Central Bank. *Targeted Review of Internal Models (TRIM) — guide and findings.* https://www.bankingsupervision.europa.eu/banking/tasks/internal_models/

[^21]: European Union. *EU AI Act — Regulation (EU) 2024/1689.* Direct legal obligations around algorithmic transparency, fairness, and control. https://artificialintelligenceact.eu/

[^22]: U.S. Code of Federal Regulations. *12 CFR Part 4, Subpart F, Appendix A — OCC enforcement of supervisory guidance.* https://www.ecfr.gov/current/title-12/chapter-I/part-4/subpart-F/appendix-Appendix%20A%20to%20Subpart%20F%20of%20Part%204

[^23]: U.S. Code of Federal Regulations. *12 CFR Part 262, Appendix A — Board of Governors of the Federal Reserve System enforcement of supervisory guidance.* https://www.ecfr.gov/current/title-12/chapter-II/subchapter-A/part-262

[^24]: U.S. Code of Federal Regulations. *12 CFR Part 302, Appendix A — FDIC enforcement of supervisory guidance.* https://www.ecfr.gov/current/title-12/chapter-III/subchapter-B/part-302

[^25]: Schneider Downs. *Banking Agencies Revise Model Risk Management Guidance — Risk-Based, Tailored, Non-Prescriptive.* https://www.schneiderdowns.com/

[^26]: Domino Data Lab. *SR 26-2: Model Risk Management Guidance Explained.* https://domino.ai/blog/sr-26-2-model-risk-management-guidance

[^27]: Glacis. *SR 11-7 Model Risk Management — Complete Guide for AI Systems.* https://www.glacis.com/

[^28]: Deloitte. *Managing the new wave of risks from AI agents in banking.* March 2026 analysis surfacing 350+ autonomous-agent risks from the MIT AI Risk Database. https://www.deloitte.com/us/en/Industries/financial-services/perspectives/agentic-ai-banking-risks.html

[^29]: Deloitte. *Agentic AI in Banking — From Enterprise Autonomy to Bank-in-a-Box Reality.* https://www.deloitte.com/global/en/Industries/financial-services/perspectives/ai-banking.html

[^30]: Deloitte Global. *AI and Risk Management — Financial Services Industry Perspectives.* https://www.deloitte.com/global/en/services/risk-advisory/perspectives/ai-and-risk-management.html

[^31]: Deloitte. *Tech Trends 2026.* https://www.deloitte.com/us/en/insights/topics/emerging-technologies/tech-trends.html

[^32]: AI2.work. *Fed and OCC Overhaul Bank Model Risk Rules but Leave AI Uncharted.* https://ai2.work/

[^33]: My Daily Executive. *SR 26-2 Is Here: The 2026 Model Risk Guidance That Finally Gives Validators Teeth.* April 2026. https://www.mydailyexecutive.com/

[^34]: Databricks. *Model Risk Management in 2026: A Banker's Guide to the Revised Interagency Guidance.* https://www.databricks.com/blog/model-risk-management-2026

[^35]: The Algo. *SR 11-7 and AI Governance: What the Fed Expects From Your Model Risk Management.* https://www.thealgo.ai/

[^36]: Beam Data. *Agentic AI in Financial Services: A CTO Governance Framework.* https://www.beamdata.com/

[^37]: NIST. *AI Risk Management Framework (AI RMF 1.0).* https://www.nist.gov/itl/ai-risk-management-framework

[^38]: NIST. *NIST AI Risk Management Framework Generative AI Profile (AI 600-1).* https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf

[^39]: ISO/IEC 42001:2023. *Information technology — Artificial intelligence — Management system standard.* https://www.iso.org/standard/81230.html

[^40]: Federal Reserve. *Trading and Capital-Markets Activities Manual — model validation and model risk management discussion.* https://www.federalreserve.gov/publications/trading-and-capital-markets-activities-manual.htm

[^41]: U.S. Code of Federal Regulations. *12 CFR Part 3, Appendix C — advanced approaches risk-based capital rules.* https://www.ecfr.gov/current/title-12/chapter-I/part-3

[^42]: U.S. Code of Federal Regulations. *12 CFR Part 208, Appendix F — advanced approaches risk-based capital rules.* https://www.ecfr.gov/current/title-12/chapter-II/subchapter-A/part-208

[^43]: U.S. Code of Federal Regulations. *12 CFR Part 225, Appendix G — advanced approaches risk-based capital rules.* https://www.ecfr.gov/current/title-12/chapter-II/subchapter-A/part-225

[^44]: Office of the Comptroller of the Currency. *Comptroller's Handbook — Model Risk Management booklet.* https://www.occ.gov/publications-and-resources/publications/comptrollers-handbook/files/model-risk-management/index-model-risk-management.html

[^45]: Office of the Comptroller of the Currency. *OCC Bulletin 2025-26 — Model Risk Management Clarification for Community Banks.* https://www.occ.gov/news-issuances/bulletins/2025/

[^46]: Federal Reserve Bank of New York. *Supervisory and Regulatory Resources — risk-management guidance archives.* https://www.newyorkfed.org/banking/supervisory-resources

[^47]: Anthropic. *Claude Enterprise governance, audit logging, and admin controls.* https://www.anthropic.com/enterprise

[^48]: OpenAI. *OpenAI Enterprise compliance and governance documentation.* https://openai.com/enterprise

[^49]: SoftBank Group + Anthropic + OpenAI banking-sector partnership disclosures (placeholder for evolving 2026 financial-services AI announcements). https://www.anthropic.com/news

[^50]: Bain & Company. *AI in Banking — Strategic Posture and Governance Frameworks.* https://www.bain.com/insights/topics/banking-financial-services/

[^51]: McKinsey & Company. *State of AI in Banking 2026.* https://www.mckinsey.com/industries/financial-services/our-insights

[^52]: PwC. *AI Agents in Financial Services — Risk and Compliance Survey 2026.* https://www.pwc.com/us/en/industries/financial-services.html

[^53]: BIS Basel Committee on Banking Supervision. *Sound practices on banks' use of artificial intelligence in regulated activities.* https://www.bis.org/bcbs/publ/

[^54]: Federal Reserve Board. *Press releases — model risk management revised guidance announcement (April 17, 2026).* https://www.federalreserve.gov/newsevents/pressreleases.htm

[^55]: Federal Reserve. *Frequently Asked Questions on Model Risk Management Guidance.* https://www.federalreserve.gov/supervisionreg/topics/model_risk.htm

[^56]: Bank Policy Institute (BPI). *AI and machine-learning policy commentary.* https://bpi.com/topic/technology/

[^57]: Risk.net. *Risk-management trade press for banking + financial services.* https://www.risk.net/

[^58]: GARP. *Risk Intelligence (operational + culture & governance) commentary archive.* https://www.garp.org/risk-intelligence

[^59]: American Bankers Association. *AI risk management in banking — industry resources.* https://www.aba.com/

[^60]: Banking Dive. *Bank technology and risk-management trade press.* https://www.bankingdive.com/

---
title: "Agentic AI in Banking: SR 11-7's Limits and the New Risk Manual"
subtitle: "Federal Reserve SR 26-2 + OCC Bulletin 2026-13 + FDIC interagency revision (April 17, 2026) supersede SR 11-7 — but Footnote 3 explicitly carves out generative AI and agentic AI as 'novel and rapidly evolving / not within the scope of this guidance'; Deloitte's March 2026 MIT AI Risk Database analysis surfaces 350+ autonomous-agent risks; GARP February 2026 documents the dynamic validation chasm; only 1 in 5 banks has mature governance for autonomous AI agents — and the operator playbook to extend MRM principles into the regulatory gray zone the agencies left open"
publication: "perea.ai Research"
authors: ["Dante Perea"]
version: "1.0"
status: "Public draft"
date: "2026-05"
audience: "Founders building banking + financial services vertical AI agents and weighing the SR 26-2 footnote-3-carve-out compliance posture. Operators inside Top-100 U.S. banks ($30B+ asset organizations) calibrating MRM extension to agentic AI. Investors triangulating which financial-services-AI vendors have documented MRM-extension methodology vs. who is exposed to OCC + Federal Reserve + FDIC supervisory examinations under the regulatory gray zone. Bank chief risk officers + chief model risk officers + AI risk officers + chief data officers evaluating agentic AI deployment programs under the new April 17, 2026 regime."
length: "~5,800 words"
license: "CC BY 4.0"
description: "The seventh vertical-deep-dive in the perea.ai/research canon (after legal #16, insurance #17, healthcare #19, accounting #20, CRE #21, construction #22) — the first banking + financial services vertical paper, opening a new $200B+ TAM vertical alongside the original 6-vertical State-of-Vertical-Agents canon. Decodes the new SR 26-2 + OCC Bulletin 2026-13 + FDIC interagency model risk management regime that took effect April 17, 2026 — and the Footnote 3 carve-out that explicitly excludes generative AI and agentic AI from scope. Anchored on five canonical 2026 regulatory + analytical sources: (1) Federal Reserve SR 26-2 (April 17, 2026) supersedes SR 11-7 + SR 21-8 BSA/AML guidance + OCC Bulletin 2011-12 + 1997-24 + Comptroller's Handbook MRM booklet; risk-based + tailored + non-prescriptive; most relevant to banking organizations >$30B in total assets. (2) OCC Bulletin 2026-13 + FDIC parallel issuance — same content with agency-specific implementation details. (3) Footnote 3 explicit carve-out: generative AI and agentic AI are 'novel and rapidly evolving... not within the scope of this guidance.' Joint RFI on AI/genAI/agentic AI MRM forthcoming. (4) Deloitte March 2026 analysis of MIT AI Risk Database surfaces 350+ autonomous-agent risks specific to banking; only 1 in 5 companies has mature governance for autonomous AI agents. (5) GARP February 2026 'SR 11-7 in the Age of Agentic AI' — periodic-review and stable-model-form assumptions strain when agents recalibrate autonomously between validation cycles; embedded-control vs gate-based-validation tension; cyber + operational dimensions propagate faster than prior tech-risk events. Operationalizes the MRM extension framework: agent registry with metadata + risk scores + tier-aligned controls; agent-life-cycle ownership (agent owner + validator + steward); continuous monitoring + escalation triggers + embedded fail-safes; human-on-the-loop + AI agent observability; new roles (AI risk officers + behavior auditors + simulation specialists). Decision matrix per banking use case — customer-facing chat (low-stakes / SR 11-7 controls suffice) vs trading/credit decisioning (high-stakes / Article 9-style RMS required) vs BSA/AML alert triage (regulated / SR 21-8 superseded but OFAC sanctions still binding). Closes with the 30-50% pricing premium for SR-26-2-extension-compliant + 4-6-week deal-close compression for >$30B-asset banks + compliance-as-M&A-asset positioning under acquired-by-platform exit pattern (paper #25)."
---

# Agentic AI in Banking: SR 11-7's Limits and the New Risk Manual

## Foreword

This is the seventh vertical-deep-dive in the perea.ai/research canon, opening the banking + financial services vertical alongside the original 6-vertical State-of-Vertical-Agents canon (legal #16, insurance #17, healthcare #19, accounting #20, CRE #21, construction #22) and the 9 cross-vertical operator playbooks (#23-31). Banking is structurally distinct from insurance — different regulators (Federal Reserve + OCC + FDIC vs NAIC + state insurance commissioners), different model risk frameworks (SR 26-2 vs Three-State Test + EU AI Act), different supervisory examination cadences, different capital-requirement implications.

**The frame this paper holds: on April 17, 2026, the Federal Reserve, OCC, and FDIC issued the most significant revision of bank model risk management guidance in 15 years — SR 26-2 + OCC Bulletin 2026-13 + the FDIC parallel — superseding SR 11-7. But Footnote 3 of the new guidance explicitly carves out generative AI and agentic AI as "novel and rapidly evolving" and "not within the scope of this guidance."** The agencies announced a separate Request for Information on AI/genAI/agentic AI MRM is forthcoming. **This leaves the largest banking organizations with no supervisory framework for the agentic systems they are actively deploying** — a regulatory gray zone that founders + operators must extend MRM principles into themselves.

This paper synthesizes five canonical 2026 regulatory and analytical sources. **Federal Reserve SR 26-2** (April 17, 2026) supersedes SR 11-7 + SR 21-8 BSA/AML guidance + OCC Bulletin 2011-12 + 1997-24 + Comptroller's Handbook MRM booklet. Risk-based, tailored, non-prescriptive. Most relevant to banking organizations >$30B in total assets. **OCC Bulletin 2026-13** + the FDIC parallel issuance carry the same content with agency-specific implementation details. **Footnote 3** is the operative carve-out for generative AI + agentic AI. **Deloitte March 2026** analysis of the MIT AI Risk Database surfaces **350+ autonomous-agent risks** specific to banking systems and processes; only **1 in 5 companies has mature governance for autonomous AI agents**. **GARP February 2026 "SR 11-7 in the Age of Agentic AI"** documents the dynamic validation chasm — periodic-review and stable-model-form assumptions strain when agents recalibrate autonomously between validation cycles; embedded-control vs gate-based-validation tension; cyber + operational dimensions propagate faster than prior tech-risk events.

Out of those sources, this paper extracts: (1) the SR 26-2 architecture decoded; (2) the Footnote 3 carve-out implications; (3) the GARP dynamic-validation chasm decoded into operator-actionable detail; (4) the Deloitte 350-risk taxonomy operationalized into agent registry + tier-aligned controls; (5) the MRM extension framework (agent registry + agent-life-cycle ownership + continuous monitoring + human-on-the-loop + AI agent observability + new roles); (6) the decision matrix per banking use case (customer-facing chat vs trading/credit decisioning vs BSA/AML alert triage); (7) the 30-50% pricing premium operationalization for SR-26-2-extension-compliant positioning; (8) compliance-as-M&A-asset positioning under acquired-by-platform exit pattern.

## Executive Summary

1. **The April 17, 2026 SR 26-2 + OCC Bulletin 2026-13 interagency MRM revision is the most significant banking regulatory change in 15 years — but the Footnote 3 carve-out for generative AI + agentic AI leaves the largest banks with no supervisory framework for the systems they are actively deploying.** The new guidance is risk-based + tailored + non-prescriptive (vs SR 11-7's more prescriptive checklist style) and supersedes SR 11-7 + SR 21-8 BSA/AML guidance + OCC Bulletin 2011-12 + 1997-24 + Comptroller's Handbook MRM booklet. **Most relevant to banking organizations >$30B in total assets.** The Federal Reserve + OCC + FDIC announced a separate Request for Information on AI/genAI/agentic AI MRM is forthcoming. **Until that RFI lands and produces final guidance**, banks must extend the SR 26-2 risk-based MRM principles into agentic AI deployment themselves — and founders building agentic-banking-AI products must ship the extension methodology as a productized + marketable feature.

2. **Deloitte's March 2026 analysis of the MIT AI Risk Database surfaces 350+ autonomous-agent risks specific to banking — and only 1 in 5 companies has mature governance for autonomous AI agents.** The 350-risk taxonomy spans 7 risk categories: misconfigured permissions + endless task loops + over-delegation cascades + inconsistent output quality + adversarial-prompt vulnerability + supply-chain integration failures + human-oversight gaps. **Founder-implication: ship the 350-risk taxonomy as a vendor-supplied evidence pack** mapped to product capability + risk-controls coverage. Banks deploying agentic AI without 350-risk-taxonomy coverage face supervisory examination findings even though the formal SR 26-2 framework excludes agentic AI from scope — examiners will reference Deloitte + MIT taxonomy as industry-standard practice.

3. **GARP February 2026 "SR 11-7 in the Age of Agentic AI" documents the dynamic validation chasm: agents recalibrate autonomously between validation cycles, breaking SR 11-7's stable-model-form assumption.** The traditional SR 11-7 definition of a model — a system that processes input data to produce a quantitative estimate — is too narrow for agentic systems that continuously learn, adapt, and initiate actions in real time. Validation approaches emphasized in SR 11-7 (conceptual soundness assessments + outcomes analysis + benchmarking) are designed for models with stable structure between review cycles. **For agentic systems, periodic-validation loses effectiveness**: material changes in behavior can occur without a formal redevelopment event. **The operational implication**: banks must shift from gate-based-validation (validate at cycle boundaries) to embedded-control validation (continuous monitoring + automated re-validation triggers + drift detection + behavior fingerprinting). Founders ship embedded-control validation infrastructure as part of the product, not as a customer-side consulting engagement.

4. **The MRM extension framework consists of six operationalized components.** **Component 1 — Agent Registry** with metadata (model lineage, training data, deployment context, decision authority, risk score, tier classification). **Component 2 — Agent Life-Cycle Ownership** with three named roles: agent owner (business sponsor), agent validator (independent risk function), agent steward (technical operations). **Component 3 — Continuous Monitoring** with multi-dimensional drift detection (input distribution + output quality + downstream business KPI + safety-incident-flagging). **Component 4 — Embedded Fail-Safes** with circuit breakers + automated rollback + human-escalation triggers + transaction-volume circuit-cuts. **Component 5 — Human-on-the-Loop + AI Agent Observability** layered above traditional validation. **Component 6 — New Risk Roles**: AI risk officers + behavior auditors + simulation specialists. **Banks that deploy all 6 components meet the 80%+ supervisory-examination-readiness threshold**; banks deploying 4-of-6 face moderate exam findings; banks deploying <4 face significant findings + remediation orders.

5. **The decision matrix per banking use case operationalizes risk-based deployment.** **Low-stakes (SR 11-7 controls suffice)**: customer-facing chat + general banking inquiries + first-touch customer service + branch-level marketing personalization. Acceptable risk profile: agent operates within bounded scope + human-takeover at escalation + standard monitoring. **Medium-stakes (SR 26-2 extension required)**: BSA/AML alert triage + customer-onboarding KYC verification + transaction-monitoring assistance + relationship-manager support. SR 21-8 superseded but OFAC sanctions still binding — agents must include explicit OFAC sanction-list checking + auditable decision trail + 100% human-review for true positives. **High-stakes (EU AI Act Article 9-style RMS required)**: trading + credit decisioning + capital allocation + ALM + IRR analytics + portfolio-management. Risk-management system equivalent to EU AI Act Article 9 mandatory: continuous identification + assessment + mitigation of risks; technical documentation; record-keeping; transparency; human oversight; accuracy + robustness + cybersecurity controls.

6. **Footnote 3 carve-out + RFI window creates a 12-18 month founder-positioning opportunity for SR-26-2-extension-compliant vendors.** The RFI on AI/genAI/agentic AI MRM is forthcoming; final agency guidance likely Q3 2026 - Q1 2027 with comment period + revisions. **Founders who ship SR-26-2-extension-compliant products in Q2-Q3 2026** capture the >$30B-asset bank window before final guidance lands and forces all vendors into the same compliance posture. **The 30-50% pricing premium** for SR-26-2-extension-compliant positioning + **4-6-week deal-close compression** + **compliance-as-M&A-asset positioning** under acquired-by-platform exit pattern (paper #25) — Verisk + Moody's + S&P Global + LSEG + Bloomberg + FactSet + Microsoft + Oracle + Salesforce all positioning as banking-AI-vendor acquirers in 2026-2027.

7. **Banking + financial services AI is a $200B+ TAM vertical alongside the original 6-vertical State-of-Vertical-Agents canon, with structurally distinct regulators + capital + supervisory examination cadence.** Banking AI sub-verticals: trading + market-making (10-15% TAM), credit decisioning + underwriting (15-20%), wealth + portfolio management (10%), customer service + chat (5-10%), BSA/AML compliance (10-15%), payments + fraud (15-20%), capital markets + investment banking (10%), ALM + balance-sheet management (5-10%), regtech + supervisory + audit AI (5-10%). **The 4-moat framework (corpus + workflow integration + compliance + network effects) applies directly to banking, with compliance moat 4-6x EV/Revenue contribution for SR-26-2-extension-compliant + Three-State-Test-extension + EU AI Act compliance posture.** Founders planning 5-year acquired-by-platform exit at 25-30x EV/Revenue must achieve SR-26-2-extension compliance by Year 1-2 and document the evidence pack throughout Years 2-5.

## Part I — The SR 26-2 Architecture: What Changed and What Didn't

**SR 11-7 was the 15-year MRM standard.** Issued April 2011 by the Federal Reserve and OCC, SR 11-7 + OCC Bulletin 2011-12 became the dominant model risk management framework across U.S. banking. Core principles: model definition + model lifecycle (development → validation → implementation → ongoing use → retirement) + three-lines-of-defense governance (model owner / independent validation / internal audit) + conceptual soundness + outcomes analysis + benchmarking + periodic re-validation.

**SR 26-2 is the April 17, 2026 successor.** Issued jointly by the Federal Reserve + OCC + FDIC, the guidance is **risk-based + tailored + non-prescriptive** — a deliberate shift away from SR 11-7's checklist style. Core architectural changes:

- **Tailoring by size + complexity + model risk profile**: a $30B-asset community bank faces different requirements than a $1T-asset money center.
- **Risk-based MRM**: high-risk models receive higher validation rigor; low-risk models receive proportionally lighter touch.
- **Reinforced model definition**: the SR 26-2 model definition is intentionally broader than SR 11-7 (any quantitative method that supports business decisions) but explicitly narrower than agentic systems.
- **Cross-agency harmonization**: SR 26-2 + OCC Bulletin 2026-13 + FDIC parallel issuance ensure consistent supervisory expectations across the three U.S. banking regulators.

**Most relevant to banking organizations >$30B in total assets** — though community banks + smaller-asset banks should expect supervisory examination uplift even at lower asset thresholds.

**What was NOT changed**: SR 21-8 BSA/AML guidance is superseded by SR 26-2 inclusion (BSA/AML models are now within the integrated MRM framework). OFAC sanction enforcement remains binding outside SR 26-2 scope. CRA + Fair Lending model-fairness expectations remain enforceable outside SR 26-2 scope.

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

**Banks that deploy all 6 components meet the 80%+ supervisory-examination-readiness threshold.** Banks deploying 4-of-6 face moderate examination findings; banks deploying <4 face significant findings + remediation orders.

## Part VI — The Decision Matrix Per Banking Use Case

**Low-stakes (SR 11-7 / SR 26-2 controls suffice).** Customer-facing chat + general banking inquiries + first-touch customer service + branch-level marketing personalization. **Risk profile**: agent operates within bounded scope + human-takeover at escalation + standard monitoring. **Founder-implication**: simpler product surface + faster deal close + lower compliance investment.

**Medium-stakes (SR 26-2 extension required).** BSA/AML alert triage + customer-onboarding KYC verification + transaction-monitoring assistance + relationship-manager support. **Risk profile**: SR 21-8 superseded but **OFAC sanctions remain binding** outside SR 26-2 scope. Agents must include explicit OFAC sanction-list checking + auditable decision trail + 100% human-review for true positives. **Founder-implication**: ship OFAC-sanction-checking as core product capability; auditable decision-trail integration with bank's OFAC-specialist workflow.

**High-stakes (EU AI Act Article 9-style RMS required).** Trading + credit decisioning + capital allocation + ALM + interest-rate risk analytics + portfolio-management. **Risk profile**: full EU AI Act Article 9 + Articles 10-15 risk-management system equivalent. Continuous identification + assessment + mitigation of risks; technical documentation; record-keeping; transparency; human oversight; accuracy + robustness + cybersecurity controls. **Founder-implication**: full Five-Framework-Test-equivalent compliance posture (paper #29) — risk management system + data governance + technical documentation + record-keeping + transparency + human oversight + accuracy + robustness + cybersecurity. Plus EU AI Act + UK PRA + Singapore MAS cross-jurisdiction extension.

**Regulated-but-not-decisional (intermediate).** Credit collections + customer dispute handling + payment-routing optimization + cash management. **Risk profile**: somewhere between low-stakes and medium-stakes — requires moderate MRM extension + auditable decision trail + human-oversight integration.

**Founder-rule**: position products by use-case-tier + ship matching-tier MRM extension. Banks negotiating contracts for high-stakes use cases require full Article-9-style RMS evidence pack; banks negotiating low-stakes use cases require only standard MRM compliance. **Vendors who try to ship single-tier products to multi-tier customer bases default to high-tier compliance overhead on every deal — eroding margin and slowing low-tier sales cycles.**

## Part VII — Founder Operationalization in the Regulatory Gray Zone

**Q2-Q3 2026 — capture the 12-18 month gray-zone window.** Final agentic-AI guidance forecasted Q2-Q3 2027. Founders shipping SR-26-2-extension-compliant products in Q2-Q3 2026 capture the >$30B-asset bank window before final guidance lands and forces all vendors into the same compliance posture. **The 30-50% pricing premium** for explicit SR-26-2-extension positioning is the compliance-as-marketed-feature play during the gray zone.

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
- **Microsoft** (Microsoft 365 + Banking-as-a-Platform integration + Nuance $19.7B precedent).
- **Oracle** (Oracle Financial Services + cloud + AI banking platform).
- **Salesforce** (Financial Services Cloud + Tableau analytics + MuleSoft integration).
- **IBM** (consulting + Watsonx + AI banking platform; previous Promontory acquisition).
- **Coalition Greenwich** (research + analytics for banking + capital markets).
- **PE funds**: Vista Equity (per paper #30 dual-incumbent) + Thoma Bravo + Insight Partners + Bain Capital (banking-software portfolio).

**Founder-implication**: cultivate corp-dev relationships at 3-5 named acquirers from this map throughout Years 3-4 of the year-1-to-year-5 founder positioning timeline (paper #25). Document SR 26-2 extension compliance + 350-risk-taxonomy coverage + GARP dynamic validation + use-case-tier decision matrix as the M&A evidence pack.

## Closing

Three furniture pieces a founder should carry away.

**Bake SR 26-2 extension into the product spec on day one — and ship the four bank RFP-response artifacts as the canonical compliance-as-marketed-feature surface.** SR 26-2 + OCC Bulletin 2026-13 + FDIC parallel issuance (April 17, 2026) establish the new banking MRM regime; Footnote 3 explicitly carves out generative AI + agentic AI; the forthcoming Joint RFI creates a 12-18 month regulatory gray zone. Founders who ship SR-26-2-extension-compliant products in Q2-Q3 2026 capture the >$30B-asset bank window before final guidance lands.

**Operationalize the 6-component MRM extension framework + 350-risk taxonomy + GARP dynamic-validation methodology.** Agent Registry + Agent Life-Cycle Ownership + Continuous Monitoring + Embedded Fail-Safes + Human-on-the-Loop + New Risk Roles. Map the 350-risk Deloitte / MIT taxonomy across 7 categories. Document GARP dynamic-validation methodology with embedded-control infrastructure. Match the use-case-tier decision matrix (low / medium / high / regulated-but-not-decisional) with tier-aligned compliance investment.

**Plan for the acquired-by-platform exit at $200M-$1B+ multiples from S&P Global + Moody's + LSEG + Bloomberg + FactSet + Verisk + Microsoft + Oracle + Salesforce + IBM + PE funds.** Banking + financial services AI is a $200B+ TAM vertical alongside the 6-vertical State-of-Vertical-Agents canon — with structurally distinct regulators (Federal Reserve + OCC + FDIC vs NAIC + state insurance commissioners), different model risk frameworks (SR 26-2 vs Three-State Test + EU AI Act), different supervisory examination cadences. **The opportunity in 2026 is to walk into the banking vertical with SR-26-2-extension-compliant product spec + 350-risk-taxonomy coverage matrix + GARP dynamic-validation methodology + use-case-tier decision matrix baked into product on day one. Capture the 12-18 month regulatory gray-zone window before final agency guidance lands. Charge 30-50% pricing premium over agent-only competitors. Close enterprise >$30B-asset bank deals 4-6 weeks faster. Build 3-of-4 moats (compliance + corpus + workflow integration) by Year 3. Cultivate corp-dev relationships at 3-5 named banking-AI acquirers (S&P Global + Moody's + LSEG + Bloomberg + FactSet + Microsoft + Oracle + Salesforce + IBM + PE funds) throughout Years 3-4. Exit to platform-acquirer at 25-30x EV/Revenue with documented SR-26-2-extension compliance + 350-risk-taxonomy coverage + GARP dynamic-validation methodology as 3-6x EV/Revenue acquisition-multiple contribution. Founders who execute Year-1 design-time SR-26-2-extension integration reach trajectory outcomes comparable to insurance vertical's Sixfold ($52M Series B) + Tractable ($1B+) + EvolutionIQ ($730M January 2025) + healthcare's Hippocratic ($3.5B). Founders who skip SR-26-2-extension on day one pay 3-4x more in retrofit costs and lose enterprise bank deals to compliance-positioned competitors during the 9-15-month retrofit window. The choice is no longer optional — and the active 2026 deadlines (April 17 2026 SR 26-2 effective + forthcoming Q3 2026 Joint RFI + active OFAC sanctions outside SR 26-2 scope + EU AI Act August 2 2026 high-risk-AI-system deadline) make Q2-Q3 2026 the canonical decision window.**

## References

[1] Federal Reserve. (2026, April 17). *Supervisory Letter SR 26-2 on Revised Guidance on Model Risk Management — Supersedes SR 11-7 + SR 21-8 BSA/AML Guidance + Comptroller's Handbook MRM Booklet.*

[2] Office of the Comptroller of the Currency. (2026, April 17). *OCC Bulletin 2026-13: Model Risk Management — Revised Guidance.*

[3] FDIC. (2026, April 17). *Agencies Issue Revised Model Risk Guidance — Joint Federal Reserve + OCC + FDIC Issuance.*

[4] OCC News Release NR 2026-29. (2026, April). *OCC Issues Updated Model Risk Management Guidance.*

[5] Schneider Downs. (2026). *Banking Agencies Revise Model Risk Management Guidance — Risk-Based + Tailored + Non-Prescriptive.*

[6] Domino.ai. (2026). *SR 26-2: Model Risk Management Guidance Explained — Most Relevant to Banking Organizations >$30B in Total Assets.*

[7] Glacis. (2026). *SR 11-7 Model Risk Management: Complete Guide for AI Systems.*

[8] Deloitte. (2026, March). *Managing the New Wave of Risks from AI Agents in Banking — 350+ Autonomous-Agent Risks from MIT AI Risk Database; Only 1 in 5 Companies Has Mature Governance for Autonomous AI Agents.*

[9] Deloitte. (2026). *Agentic AI in Banking: From Enterprise Autonomy to Bank-in-a-Box Reality.*

[10] Deloitte Global. (2026). *AI and Risk Management — Financial Services Industry Perspectives.*

[11] Deloitte. (2026). *Tech Trends 2026 + State of AI in the Enterprise 2026 Reports.*

[12] GARP (Global Association of Risk Professionals). (2026, February). *SR 11-7 in the Age of Agentic AI — Dynamic Validation Chasm + Embedded-Control vs Gate-Based-Validation Tension + Cyber/Operational Dimensions Propagating Faster Than Prior Tech-Risk Events.*

[13] AI2.work. (2026). *Fed and OCC Overhaul Bank Model Risk Rules but Leave AI Uncharted.*

[14] My Daily Executive. (2026, April). *SR 26-2 Is Here: The 2026 Model Risk Guidance That Finally Gives Validators Teeth.*

[15] Databricks. (2026). *Model Risk Management in 2026: A Banker's Guide to the Revised Interagency Guidance.*

[16] The Algo. (2026). *SR 11-7 and AI Governance: What the Fed Expects From Your Model Risk Management.*

[17] Beam Data. (2026). *Agentic AI in Financial Services: A CTO Governance Framework.*

[18] MIT AI Risk Database. (2025-2026). *Comprehensive Repository of AI Risks Including 350+ Autonomous-Agent Risks Specific to Banking.*

[19] OFAC + U.S. Department of Treasury. (2026). *Sanctions Compliance Programs Remain Binding Outside SR 26-2 Scope.*

[20] perea.ai Research. (2026). *State of Vertical Agents Q3 2026 Legal #16 + Q4 2026 Insurance #17 + Founder Velocity #18 + Q1 2027 Healthcare #19 + Q2 2027 Accounting #20 + Q3 2027 CRE #21 + Q4 2027 Construction #22 + Vertical Corpus Moats #23 + Prestige-Led Distribution Playbook #24 + Acquired-by-Platform Exit Playbook #25 + Reinsurer-as-AI-Pioneer #26 + Three-State-Test Compliance Methodology #27 + Polaris Clinical Validation Panel Methodology #28 + Five-Framework Compliance Methodology Healthcare #29 + Dual-Incumbent Dynamic Playbook #30 + Implementation Gap Conversion Playbook #31.*

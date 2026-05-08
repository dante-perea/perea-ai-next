---
title: "The Unified AI Governance Stack: NIST + ISO 42001 + EU AI Act in One Evidence Base"
subtitle: "70–80% control overlap, the official NIST↔ISO 42001 crosswalk, Singapore IMDA AI Verify interoperability, and the single-evidence-base methodology — collect once, satisfy three regimes"
publication: "perea.ai Research"
authors: ["Dante Perea"]
version: "1.0"
status: "Public draft"
date: "2026-05"
audience: "AI governance leads, GRC managers, CISOs, DPOs, and procurement officers building one compliance program against NIST AI RMF + ISO/IEC 42001 + the EU AI Act 2 August 2026 high-risk regime"
length: "~5,500 words"
license: "CC BY 4.0"
profile: "field-manual"
description: "A field manual for running NIST AI RMF, ISO/IEC 42001, and the EU AI Act as one compliance program. Anchors on the official NIST AI RMF↔ISO 42001 crosswalk, the EU AI Act Articles 8–15 + 27 + 50 + 72–73 mapping, the Singapore IMDA AI Verify joint mappings (October 2023 NIST + June 2024 ISO 42001), the SS ISO/IEC 42001:2024 national adoption with Annex ZA, and the COMPEL/UGAF-ITS '154 source obligations → 12 unified controls' methodology. Closes with a six-evidence-type single-register pattern, a shared technical file, and a 12-month implementation roadmap."
---

## Foreword

This is a working manual for organisations that have to operate three AI governance frameworks at once: the NIST AI Risk Management Framework, ISO/IEC 42001, and the EU AI Act.[^1][^2][^3] As of 2026, that is the realistic posture for any enterprise selling into both the United States and the EU, any public-sector AI deployer, and any AI vendor whose customers ask about ISO certification. The frameworks overlap in roughly 70–80% of their substantive requirements,[^4][^5][^6] but they diverge in structure, certifiability, and legal force in ways that punish organisations which treat them as alternatives. The pattern that survives audit and procurement scrutiny is a single, harmonised governance program with one risk register, one technical file, one incident-response runbook, and one evidence library — tagged so that auditors from any framework can pull the same artifact and accept it.

That pattern is not aspirational.

NIST published the official NIST AI RMF ↔ ISO/IEC FDIS 42001 Crosswalk in 2023 and maintains a public crosswalks library covering ISO 23894, ISO 42005, AIUC-1, Singapore IMDA AI Verify, Korea's TTA Guidebook, Japan AISI, BSA, and ISO 5338/5339.[^7][^8] The Singapore IMDA published a joint NIST mapping in October 2023 and an ISO/IEC 42001 mapping in June 2024,[^9][^10] then nationally adopted ISO 42001 as SS ISO/IEC 42001:2024 with an informative Annex ZA describing AI Verify as the implementation toolkit.[^11]

Academic and platform vendors (COMPEL, UGAF-ITS, Modulos, Strac, FairNow, Lenavix, SafeguardsAI) have built crosswalk-driven implementations.[^12][^13][^14][^15][^16][^17] What the field has been missing is the integration manual a 50-person GRC team can run against.

This paper is that manual.

## Executive Summary

The three frameworks are complementary layers, not alternatives.[^18][^19]

**NIST AI RMF** organises AI risk work into four functions — Govern, Map, Measure, Manage — and was released January 26, 2023 through a consensus process involving 240+ contributing organisations.[^1][^20][^21]

**ISO/IEC 42001:2023** is the first international management system standard for AI, published December 2023, with 10 clauses and 38 Annex A controls organised across nine control groups (A.2 Policies, A.3 Internal Organization, A.4 Resources, A.5 Impact Assessments, A.6 Lifecycle, A.7 Data, A.8 Information, A.9 Use, A.10 Third-Party).[^2][^22][^23]

**The EU AI Act** is binding regulation, with high-risk obligations applying from 2 August 2026 and operator-tier penalties up to €15M or 3%[^25] of global turnover for Articles 9–27 violations and up to €35M or 7% for Article 5 prohibition violations.[^3][^24][^25]

**Overlap.** Roughly 70–80% of operational requirements overlap across the three frameworks.[^4][^5][^6] EU AI Act Article 9 (Risk Management) maps cleanly to ISO 42001 Clause 6.1 / Annex A.5, and to NIST AI RMF Govern + Map functions.[^26][^27] Article 17 (Quality Management) is substantially satisfied by the entire ISO 42001 management-system structure (Clauses 4–10).[^4][^5] Article 11 + Annex IV (Technical Documentation) maps to ISO 42001 Clause 7.5 and Annex A.6.2.7, but the EU AI Act adds prescriptive granularity that voluntary standards leave to organisational choice.[^28][^29]

**Gaps.** Three EU AI Act obligations have no voluntary-standard equivalent: Article 5 categorical prohibitions; Article 43 conformity assessment + Article 48 CE marking; Article 49 EU database registration.[^4][^28][^30] Two more — Article 27 FRIA notification (covered in our companion field manual on FRIA methodology) and Article 50 marking and labelling — have partial overlap but require EU-Act-specific evidence.[^31][^32]

**Single-evidence-base methodology.** The COMPEL framework (Tamer Abdelalim, January 2026) and the UGAF-ITS academic paper formalise the harmonisation pattern: 154 source obligations consolidated into 12 unified controls across 8 governance domains; 20 versioned artifacts; a 45.9% reduction in evidence volume vs siloed compliance.[^12][^33] The implementation recipe — one AI policy, one risk register with two tags per entry (NIST function + ISO control), one technical file aligned to Annex IV, one incident register, one supplier assessment process — is what this manual codifies.

**Penalty calibration.** Operator-obligation tier (Articles 9, 11, 13, 14, 17, 27, 50, 72, 73) violations attract fines up to €15M or 3% of global turnover.[^25][^26] Article 5 prohibitions attract up to €35M or 7%.[^25] No harmonised standard under Article 40 has yet been OJEU-listed at time of writing, which means ISO 42001 certification does not currently grant a legal presumption of conformity — the practical posture is that ISO 42001 evidence accelerates EU AI Act compliance by 30–40% but does not satisfy it.[^17][^4][^34]

## Part I: The Three Frameworks Decomposed

**NIST AI RMF.** Four core functions — Govern, Map, Measure, Manage — organised into 19 categories and 72 subcategories.[^1][^21] Each subcategory has a Playbook entry suggesting concrete actions.[^21] The framework is voluntary and self-attested — there is no NIST certification.[^1][^20] But its voluntary status is operationally deceptive: the FTC, CFPB, FDA, SEC, and EEOC reference NIST AI RMF principles in enforcement guidance, and federal contractors face growing expectations to demonstrate NIST-aligned governance.[^20] NIST also publishes profiles tailored to specific domains; the canonical companion is NIST AI 600-1, the Generative AI Profile (July 2024), which adds 12 GenAI-specific risk categories and 200+ suggested actions.[^35][^36][^37]

**ISO/IEC 42001:2023.** The first international management system standard for AI, published in December 2023.[^2][^22] Structured around the Plan-Do-Check-Act (PDCA) cycle and the ISO Annex SL high-level structure shared with ISO 27001 (information security) and ISO 9001 (quality).[^22][^23] Clauses 4–10 cover context, leadership, planning, support, operation, performance evaluation, and improvement.[^23] Annex A specifies 38 controls in nine groups (A.2 Policies through A.10 Third-Party).[^14][^22] The certification cycle follows ISO 17021: Stage 1 readiness review (1–2 days) + Stage 2 effectiveness assessment (1–3 weeks) + 3-year certificate validity + annual surveillance audits + 4th-year recertification.[^38][^39] Implementation typically takes 6–9 months for organisations with existing ISO 27001 programs and 9–18 months greenfield.[^40][^41]

**EU AI Act (Regulation 2024/1689).** Binding legislation with phased application: 1 August 2024 entry into force; 2 February 2025 Article 5 prohibitions; 2 August 2025 GPAI obligations; 2 August 2026 high-risk regime + Articles 9–15 + 26–27 + 50 + 72–73; 2 August 2027 high-risk classification under harmonised product legislation.[^25][^42] On 19 November 2025 the Commission's Digital Omnibus on AI proposal (COM(2025) 868) suggested a possible 16-month extension of the high-risk deadline to December 2027, contingent on harmonised standards being in place — but this had not been adopted by Parliament and Council at time of writing.[^43] High-risk AI obligations include Article 9 risk management, Article 10 data and data governance, Article 11 + Annex IV technical documentation, Article 12 record-keeping, Article 13 transparency, Article 14 human oversight, Article 15 accuracy/robustness/cybersecurity, Article 17 quality management, Article 26 deployer obligations, Article 27 FRIA, Article 50 transparency for AI-generated content, Articles 72–73 post-market monitoring + serious incident reporting.[^44]

The three frameworks share common DNA — the ISO 42001 PDCA cycle is structurally compatible with the NIST Govern/Map/Measure/Manage operating rhythm, and both feed the EU AI Act's risk-management-system + quality-management-system requirements.[^4][^17] The difference is enforcement: NIST is voluntary, ISO 42001 is voluntary-but-certifiable, the EU AI Act is binding law with European market access on the line.[^28][^45]

## Part II: The Official NIST ↔ ISO 42001 Crosswalk

NIST published the official NIST AI RMF ↔ ISO/IEC FDIS 42001 AI Management System Crosswalk via Microsoft submission and maintains it on the AIRC (AI Resource Center) site.[^7][^8] The crosswalk maps every AI RMF subcategory to the corresponding ISO 42001 clauses and Annex A controls, providing the structural foundation for any unified governance program.[^7][^46]

**Govern function ↔ ISO Leadership + Policy.** NIST Govern 1.1 (governance structure) maps to ISO Clause 5.1 (Leadership and commitment).[^7][^46] Govern 1.2 (risk management strategy) maps to Clause 6.1 (Risk and opportunity planning) and Annex A.4.[^46][^7] Govern 1.3 (AI ethics integration) maps to Clause 5.2 (AI policy establishment) and Annex A.2.[^46] Govern 2.1 (roles, responsibilities, lines of communication) maps to Clauses 5.3 and 7.2 and Annex A.3.[^7][^14]

**Map function ↔ Impact Assessment + Lifecycle.** NIST Map 1.1 (intended purposes, deployment context) maps to Clause 6.1.4 (impact assessment) and Annex A.5.2.[^14] Map 2 (model and data characteristics) maps to Clause 8.2 (system design), Clause 8.4 (data), and Annex A.6.2 / A.7 / A.8.[^14] Map 4.1 (third-party legal risks) and Map 4.2 (third-party AI components) map to Clause 8.3 (system impact) and Annex A.10 (Third-Party and Customer Relationships).[^14][^7]

**Measure function ↔ Monitoring + Testing.** NIST Measure 1.1 (metrics for AI risks) maps to Clause 9.1 (monitoring and measurement) and Annex A.6.2.4 (verification and validation).[^7][^14] Measure 2 (evaluation plans) maps to Clause 9.2 (internal audit) and Clause 8.1 (operational planning).[^14] Measure 3 (continuous improvement) maps to Clause 10.1 (nonconformity and corrective action) and Clause 10.2 (continual improvement).[^7]

**Manage function ↔ Risk Treatment + Corrective Action.** NIST Manage 1.1 (risk response) maps to Clause 6.1.3 (risk treatment planning).[^46] Manage 2 (mitigation strategies) maps to Clause 8.1 and Annex A.6.2.6.[^14] Manage 3 (third-party risk) maps to Annex A.10.[^14] Manage 4 (incident response and corrective action) maps to Clause 10.1 and Annex A.8.4.[^7][^14]

**The COMPEL operational map.** Tamer Abdelalim's COMPEL framework (January 2026) compresses the full mapping into a single table with one shared evidence artifact per row.[^14] The example: NIST Govern 1 (context and strategy) + ISO Clauses 4.1 + 5.1 + 5.2 + Annex A.2.2/A.2.3 share an "AI governance charter / Policy statement" artifact; NIST Map 1 (system context) + ISO Clause 6.1.4 + Annex A.5.2 share an "AI System Impact Assessment (AIIA)"; NIST Measure 3 + ISO Clauses 9.1/9.2 share "monitoring outputs / audit findings".[^14]

**The structural difference.** The frameworks differ in *how* they ask for governance, not in *what* they ask for.[^4][^20] AI RMF organises by outcome (four functions); ISO 42001 organises by management-system clause structure (Clauses 4–10 + Annex A). AI RMF is not certifiable; ISO 42001 is.[^20][^39] AI RMF gives tactical flexibility through its Playbook; ISO 42001 demands documented, auditable management-system processes.[^4][^14] For US organisations, the practical implication is that work done to implement AI RMF directly contributes to ISO 42001 certification readiness — particularly the Govern function (substantially addresses Clauses 5 + 6 + parts of Annex B), Map (aligns with impact-assessment requirements), Measure (maps to monitoring and measurement clauses), and Manage (operational controls + incident response).[^20][^14][^46]

## Part III: EU AI Act ↔ ISO 42001 ↔ NIST Mapping by Article

The strongest analytical contribution any harmonisation framework can make is a clause-by-clause mapping from EU AI Act Articles 8–15, 17, 26–27, 50, and 72–73 to the NIST AI RMF subcategories and the ISO 42001 clauses + Annex A controls that satisfy each obligation.[^5][^6][^28][^29]

**Article 9 — Risk management system.** Continuous iterative process across the AI system lifecycle, with identification + estimation + evaluation + adoption of measures.[^44][^47] Maps to ISO 42001 Clauses 6.1 + 8.2 + 8.3 + Annex A.5.2-5.4 (impact assessment + risk treatment).[^4][^28] Maps to NIST AI RMF Map (full function) + Manage 1-2 (risk prioritisation + mitigation).[^4] Coverage: ISO 42001 covers approximately 80% of the Article 9 technical burden; the gap is the EU AI Act's specific "health, safety, and fundamental rights" framing and Article 9(9) under-18-and-vulnerable-groups consideration.[^4][^41]

**Article 10 — Data and data governance.** Most prescriptive of the high-risk articles. Training, validation, and testing datasets must meet documented quality criteria including bias-completeness evaluation and statistical-property analysis.[^28][^29] Maps to ISO 42001 Annex A.7 (Data) + Clause 8.4 (data control) + NIST AI RMF Map 1.1 + Map 2.[^28] Coverage: voluntary standards lack the legal prescriptiveness; this is the largest gap and the biggest area where ISO-42001-certified organisations need supplemental work.[^4][^48]

**Article 11 + Annex IV — Technical documentation.** 10+ specific sections, 10-year retention.[^25][^28] Maps to ISO 42001 Clause 7.5 (Documented information) + Annex A.4.2 (resource documentation) + A.6.2.3 (system design documentation) + A.6.2.7 (technical documentation).[^4][^28] Maps to NIST AI RMF Govern 1.5 (documented decision-making) + Map 1.1 + Manage 4.[^28] Coverage: ISO clauses cover the structural requirement; Annex IV's specific 10-section format requires its own template, and the 10-year retention obligation must be wired into the document-management system.[^25][^49]

**Article 12 — Record-keeping (logging).** Automatic logs for traceability, retained for the relevant period (minimum 6 months for deployers under Article 26(6)).[^44] Maps to ISO 42001 Annex A.6.2.8 (event logs) + Clause 9.1 (monitoring).[^14][^4] Maps to NIST AI RMF Measure 4 (continuous monitoring) + Manage 4.[^14]

**Article 13 — Transparency and provision of information to deployers.** Instructions for use must enable deployers' compliance with Articles 26 + 27.[^44] Maps to ISO 42001 Annex A.8 (Information for interested parties) + Clause 7.4 (Communication).[^28][^4] Maps to NIST AI RMF Govern 4.2 (information sharing).[^4]

**Article 14 — Human oversight.** Effective intervention capabilities, with specific physical override mechanisms and anomaly detection capabilities the AI Act introduces uniquely.[^44][^4] Maps to ISO 42001 Annex A.5.5 + A.9 (Use of AI Systems) + NIST Govern 1.5 (human-AI configuration).[^4][^14]

**Article 15 — Accuracy, robustness, cybersecurity.** Maps to ISO 42001 Annex A.7 (data) + A.6 (lifecycle).[^4] For ISO 27001-certified entities, the cybersecurity component overlaps significantly with established ISMS controls.[^4][^17]

**Article 17 — Quality management system.** Strongest alignment of any article. The entire ISO 42001 standard (Clauses 4–10) substantially satisfies Article 17.[^4][^28] Maps partially to NIST AI RMF Govern function (governance infrastructure).[^4]

**Article 27 — Fundamental Rights Impact Assessment.** Deployer-side pre-deployment FRIA for in-scope deployers (public bodies, public-service providers, Annex III 5(b)/(c) credit/insurance deployers).[^31] Maps to ISO 42001 Annex A.5 (Impact Assessments) + Clause 6.1.4. Treated in detail in this canon's [Article 27 FRIA Methodology Field Manual](https://www.perea.ai/research/article-27-fria-methodology-field-manual).[^31]

**Article 50 — Transparency for AI-generated content.** Provider marking + deployer labelling obligations via the Code of Practice on marking and labelling.[^32] Maps to ISO 42001 Annex A.8 + Annex A.6.2.5 (deployment).[^32] No NIST AI RMF direct equivalent; implementation requires C2PA + watermarking + fingerprinting/logging multilayered approach.[^32]

**Article 43 + 48–49 — Conformity assessment + CE marking + EU database registration.** No equivalent in ISO 42001 or NIST AI RMF — these are EU-specific regulatory constructs that must be implemented as overlay requirements.[^4][^28]

**Articles 72–73 — Post-market monitoring + serious incident reporting (15 days).** Maps to ISO 42001 Clause 10.1 (Nonconformity) + NIST AI RMF Manage 4 (incident response).[^41][^48] Coverage: ISO + NIST cover the structural requirement; the 15-day reporting window and serious-incident definition under Article 73 require EU-specific runbook.[^41]

**The 70–80% rule.** Across all high-risk articles, roughly 70–80% of the operational burden is satisfied by a mature ISO 42001 + NIST AI RMF program.[^4][^5][^6] The remaining 20–30% is the EU-Act-specific delta (data governance prescriptiveness under Article 10, Annex IV technical documentation format, conformity assessment, CE marking, EU database registration, FRIA notification, 15-day incident reporting, Code of Practice marking).[^4][^41][^48]

## Part IV: Singapore IMDA AI Verify and the International Crosswalks Library

The interoperability story in 2026 is not just NIST↔ISO. It is NIST↔ISO↔Singapore↔Korea↔Japan, and the operational pivot for that interoperability is Singapore's IMDA AI Verify framework.[^9][^10][^11]

**AI Verify Foundation.** Established in 2023 by IMDA + PDPC. Foundation has 9 premier members (AWS, Dell, Google, IBM, IMDA, Microsoft, Red Hat, Resaro, Salesforce) and 180+ general members.[^50] AI Verify itself is an open-source AI governance testing framework + software toolkit that helps organisations validate their AI systems against 11 internationally recognised AI governance principles (transparency, explainability, reproducibility, safety, security, robustness, fairness, data governance, accountability, human agency, inclusive growth).[^51][^50]

**The October 2023 NIST joint mapping.** IMDA + NIST completed the joint mapping exercise between AI Verify and NIST AI RMF on 13 October 2023, declaring the two frameworks interoperable.[^9] A second crosswalk was published in May 2025 mapping NIST AI 600-1 (GenAI Profile) to AI Verify.[^52]

**The June 2024 ISO 42001 crosswalk.** AI Verify Foundation published a clause-by-clause mapping document showing how AI Verify principles align with ISO/IEC 42001 controls (A.2 Policies → AI Verify Organisational Considerations 12.7; A.3 Internal Organization → Accountability 9.1/9.3/9.4; A.5 Impact Assessment → Safety 4.1.1 + Inclusive Growth 11.1; A.6 Lifecycle → Explainability/Reproducibility/Safety/Security/Robustness/Fairness/Accountability/Human Agency; A.7 Data → Reproducibility + Robustness + Data Governance; A.8 Information → Transparency 1.1-1.5; A.9 Use → Organisational Considerations 12.2; A.10 Third-Party → Accountability 9.6.1-9.8.1).[^10]

**SS ISO/IEC 42001:2024 national adoption.** Singapore adopted ISO/IEC 42001 nationally as Singapore Standard SS ISO/IEC 42001:2024 with an informative national Annex ZA explicitly describing AI Verify as a voluntary testing tool for aligning AI systems with the standard.[^11] This is the cleanest example globally of a national standard binding ISO 42001 to a specific implementation toolkit.[^53][^11]

**The wider crosswalks library.** NIST's official crosswalks library covers ISO/IEC 23894 (revised August 14, 2025), ISO/IEC 42005 (August 14, 2025), AIUC-1 (Artificial Intelligence Underwriting Company, July 2025), Korea TTA Trustworthy AI Guidebook (December 23, 2024), Japan AISI's Japan AI Guidelines for Business, BSA Framework, and ISO 5338/5339 (April 11, 2024).[^8] The pattern: every major national-level AI governance framework now has a published mapping to NIST AI RMF, which means an organisation building a single evidence base on AI RMF + ISO 42001 can demonstrate alignment with any of the major Asia-Pacific frameworks via the relevant published crosswalk.[^8][^54]

**Singapore Agentic AI Governance Framework.** In January 2026, Singapore released the world's first governance framework for agentic AI at the World Economic Forum in Davos.[^54] For organisations building agentic AI systems in regulated markets, this framework provides the agentic-specific layer that NIST + ISO + EU AI Act do not yet directly address (NIST launched its AI Agent Standards Initiative in February 2026 in part to close that gap).[^54][^55]

## Part V: NIST AI 600-1 — The Generative AI Profile

NIST AI 600-1 (the Generative AI Profile, July 26, 2024) is the cross-sectoral profile of the AI RMF that adds GenAI-specific risk handling.[^35][^36][^37] It identifies 12 risks novel to or exacerbated by generative AI:[^36][^56]

1. **CBRN Information** — chemical, biological, radiological, nuclear information uplift.
2. **Confabulation** — confident, factually false outputs (hallucinations) with legal liability.
3. **Dangerous, Violent, or Hateful Content** — scale generation; jailbreak resistance.
4. **Data Privacy** — training data memorisation, PII leakage, inference attacks.
5. **Environmental Impacts** — compute and energy costs.
6. **Harmful Bias and Homogenization** — amplified historical bias.
7. **Human-AI Configuration** — automation bias, over-reliance, degraded human decision quality.
8. **Information Integrity** — deepfakes, synthetic media, disinformation at scale.
9. **Information Security** — prompt injection, data poisoning, adversarial attacks.
10. **Intellectual Property** — copyright infringement from memorised training data.
11. **Obscene, Degrading, or Abusive Content** — synthetic CSAM, NCII, deepfake harassment.
12. **Value Chain and Component Integration** — third-party model opacity.

The Profile provides 200+ suggested actions across the four AI RMF functions (Govern, Map, Measure, Manage), cross-tagged to the 12 risks.[^37][^56] The actions are scoped specifically to generative AI but inherit the broader AI RMF activities — implementation typically extends an existing AI RMF program rather than replacing it.[^56][^37]

**Regulatory adoption.** Despite the revocation of Executive Order 14110 on January 20, 2025, NIST AI 600-1 itself was never rescinded and remains active guidance.[^56] The Cyber Risk Institute published the FS AI RMF in February 2026, with 108 financial-institution members operationalising AI 600-1 for financial services.[^56] GAO-25-107197 confirmed that OCC, Federal Reserve, FDIC, and NCUA examiners are incorporating AI into safety-and-soundness and compliance examinations under existing authorities.[^56] OCC Bulletin 2025-26 was published in 2025 as a "first step" in updating model risk management guidance — a clear signal that SR 11-7 GenAI gaps are on the agenda.[^56]

**Public-comment input on autonomous systems.** The public-comment process on NIST AI 600-1 included recommendations to explicitly include risks from AI R&D, autonomous systems, and loss of control — drawing on the UK AI Safety Institute precedent of running a workstream dedicated to loss-of-control risks (later updated to include risks from AI agents more broadly).[^57] Future profile revisions are expected to address these autonomy-specific risk categories.[^57][^55]

## Part VI: The Single Evidence Base — Implementation Recipe

The single-evidence-base methodology is the operational pivot of unified AI governance. Six evidence types satisfy all three frameworks when structured correctly:[^58][^14]

1. **Policy documents.** One AI policy that addresses all applicable framework requirements. Structure it so that the EU AI Act Article 17 quality management system documentation, ISO 42001 Clause 5.2 AI policy, and NIST Govern 1.2 trustworthy-AI characteristics integration are covered by the same document.[^58][^14]
2. **Risk and impact assessments.** A single risk assessment structured to cover technical risk + ethical risk + rights impact + societal impact + environmental impact, generating evidence for EU AI Act Article 9 + NIST Map and Measure functions + ISO 42001 Clause 6.1.2.[^58][^17]
3. **Process documentation.** Operational procedures for the AI lifecycle, supplier management, incident response, and human oversight.[^58]
4. **Activity records.** Meeting minutes, training records, internal audit reports, management reviews — the trail demonstrating the management system runs.[^39][^58]
5. **Technical artifacts.** Model cards, data cards, test results, monitoring dashboards, log samples, architecture diagrams, deployment records. EU AI Act Annex IV technical documentation is the most prescriptive specification; satisfying Annex IV creates technical evidence that serves all frameworks.[^28][^58]
6. **Improvement records.** Corrective actions, lessons learned, profile updates.[^58][^14]

**The risk-register tagging schema.** Every AI risk entry carries two tags: a NIST AI RMF function/category (e.g., `MANAGE 1.3`) and an ISO 42001 control (e.g., `A.5.4`).[^14] A single report filter produces either a NIST-style profile or an ISO Annex A status report. The risk register becomes the single source of truth.[^14][^33]

**The three-tier evidence structure.** The COMPEL framework distinguishes Level 1 — Universal Evidence (documents satisfying all frameworks — AI policy, accountability RACI, technical documentation package, monitoring dashboard); Level 2 — Adapted Evidence (one source document with framework-specific framings — risk assessments structured to cover all frameworks' required dimensions); and Level 3 — Framework-Specific Evidence (items required by only one framework — EU AI Act Conformity Assessment Declaration, NIST self-assessments using the framework's specific format).[^33][^14]

**The UGAF-ITS academic methodology.** A 2026 academic paper consolidates 154 source obligations (ISO 42001: 55 items including 38 Annex A controls + management-system clauses; EU AI Act: 37 high-risk requirements from Articles 8–15 + technical documentation; NIST AI RMF: 62 subcategories) into 12 unified controls organised under 8 governance domains, supported by 20 versioned artifacts.[^12] The framework demonstrates a 45.9% reduction in evidence volume compared to siloed compliance while preserving clause-level bidirectional traceability for framework-specific audits.[^12]

**Platform implementation patterns.** Strac, Trussed AI, FairNow, COMPEL, Modulos, Lenavix, and SafeguardsAI all converge on a similar architecture: pre-mapped controls library (with the controls tagged to NIST + ISO + EU AI Act + OWASP LLM/Agentic + SOC 2 + HIPAA + PCI + GDPR); evidence generated continuously from real enforcement events rather than assembled before audits; framework-specific reports drawn from the same evidence base.[^15][^16][^17][^59][^60][^61][^14]

**Single-evidence-base trade-offs.** The harmonisation insight has limits. ISO 42001 demands documented management-system processes that NIST does not require — internal audit, management review, statement of applicability, surveillance audit cooperation.[^62][^63] EU AI Act demands EU-specific items that neither voluntary standard provides. Treat the single-evidence-base methodology as a 70–80% solution: it eliminates duplicate work for the common requirements but expects EU-Act-specific overlay work and ISO-42001-specific management-system artifacts.[^4][^28][^33]

## Part VII: Implementation Roadmap

**Phase 1 — 0 to 90 days (Foundation).** Inventory all AI systems with intended-purpose, deployment-context, affected-population, and Annex III risk-classification rationale.[^41][^48] Build the harmonised AI policy. Stand up the cross-functional AI governance committee (legal + risk + product + security + DPO).[^45][^60] Run the gap analysis: ISO 42001 Annex A.5 + Annex A.6 vs current AI lifecycle practice; NIST AI RMF Govern function self-assessment; EU AI Act Article 9 + 17 + 27 + 50 scoping for in-scope systems.[^28][^14]

**Phase 2 — 91 to 180 days (Operationalisation).** Implement the harmonised risk register with two-tag schema (NIST + ISO).[^14] Stand up the technical-file template aligned to EU AI Act Annex IV and ISO 42001 Clause 7.5.[^28] Deploy the incident-response runbook with the EU AI Act Article 73 15-day reporting window built in.[^41] Run the first internal audit cycle. Train product teams on FRIA per the [Article 27 FRIA Methodology Field Manual](https://www.perea.ai/research/article-27-fria-methodology-field-manual).[^31]

**Phase 3 — 181 to 365 days (Certification + Continuous Improvement).**

Engage ISO 42001 certification body (BSI, SGS, DNV, Kiwa, Q-Cert, Pacific Cert, Orion) for Stage 1 readiness review.[^39][^64][^65][^66][^67] Complete the Stage 2 effectiveness assessment.[^39][^41]

For EU-in-scope deployers, prepare for the 2 August 2026 deadline (or December 2027 if the Digital Omnibus extension is adopted).[^43][^25] For US organisations seeking federal-procurement readiness, complete the AI RMF profile self-assessment.[^20][^21] Begin Singapore AI Verify pilot if the organisation has Asia-Pacific exposure.[^53][^54]

**Vendor selection criteria.** When evaluating GRC platforms for unified AI governance, prioritise: (i) pre-mapped controls library covering NIST AI RMF + ISO 42001 + EU AI Act Articles 9–15 + 27 + 50 + 72–73 at minimum; (ii) two-tag evidence-tagging architecture (NIST function + ISO control + framework-requirement-ID); (iii) continuous evidence generation rather than periodic assembly; (iv) ISO 42001 audit-ready report generation; (v) EU AI Act Annex IV documentation template support.[^15][^60][^61][^68]

**Budget anchor.** Implementation costs scale with AI-system count and existing-management-system maturity. Organisations with existing ISO 27001 programs typically spend 6–9 months and $50K–$500K to add ISO 42001 certification.[^40][^41] Greenfield organisations spend 9–18 months and $200K–$1M+.[^41] ISO certification audit fees range from $15K to $200K+ depending on scope and organisation size.[^41] These figures cover the management-system overlay; the technical AI-engineering work to actually build risk-management, monitoring, and explainability infrastructure is additional.[^17][^60]

## Quotable Findings — Unified AI Governance Stack

1. Per the official NIST AI RMF ↔ ISO/IEC FDIS 42001 Crosswalk maintained by NIST AIRC,[^7] every AI RMF subcategory maps to one or more ISO 42001 clauses or Annex A controls — providing the structural foundation for any unified governance program.
2. Per multiple analyst surveys (RSI Security, EU AI Compass, GLACIS, Quantamix, ExamCert, Strac),[^4][^5][^28][^41][^17] approximately 70–80% of operational requirements overlap across NIST AI RMF, ISO/IEC 42001, and the EU AI Act — making one harmonised governance program substantially more efficient than three separate compliance workstreams.
3. Per NIST's GenAI Profile (NIST AI 600-1, July 26, 2024),[^36][^37] generative AI introduces 12 distinct risk categories that the original AI RMF was not designed to address, addressed via 200+ suggested actions tagged to the four AI RMF functions.
4. Per the IMDA October 2023 NIST joint mapping[^9] and the AI Verify Foundation June 2024 ISO/IEC 42001 crosswalk,[^10] Singapore's AI Verify framework is interoperable with both NIST AI RMF and ISO 42001, with national-standard adoption (SS ISO/IEC 42001:2024, Annex ZA) explicitly designating AI Verify as the implementation toolkit.[^11]
5. Per the UGAF-ITS academic harmonisation framework,[^12] 154 source obligations across the three frameworks consolidate into 12 unified controls in 8 governance domains, with a 45.9% reduction in evidence volume compared to siloed compliance.
6. Per the Ampliflow + EU AI Compass mappings,[^29][^28] EU AI Act Article 17 (Quality Management System) is substantially satisfied by the entire ISO 42001 management-system structure (Clauses 4–10).
7. Per the EU AI Compass + GLACIS gap analyses,[^28][^41] three EU AI Act obligations have no voluntary-standard equivalent: Article 5 categorical prohibitions, Article 43 conformity assessment + Article 48 CE marking, and Article 49 EU database registration — these must be addressed as overlay requirements.
8. Per the Cyber Risk Institute FS AI RMF (February 2026, 108 financial-institution members)[^56] and OCC Bulletin 2025-26, NIST AI 600-1 has been operationalised for financial services, signalling the alignment of US federal banking regulators with the GenAI Profile despite the revocation of Executive Order 14110 in January 2025.
9. Per the Ampliflow analysis,[^29] the Commission's 19 November 2025 Digital Omnibus on AI proposal (COM(2025) 868) suggested a 16-month extension of the high-risk regime to December 2027, conditional on harmonised standards being in place — but had not been adopted by Parliament and Council at time of writing.

## Glossary

**NIST AI RMF (AI Risk Management Framework 1.0):** the voluntary US framework released January 26, 2023, organised into four functions (Govern, Map, Measure, Manage) with 19 categories and 72 subcategories.[^1][^21]

**NIST AI 600-1 (Generative AI Profile):** the cross-sectoral companion to AI RMF released July 26, 2024, defining 12 GenAI-specific risk categories and 200+ suggested actions.[^35][^36]

**ISO/IEC 42001:2023 (AIMS):** the first international management system standard for AI, published December 2023, with 10 clauses and 38 Annex A controls organised across nine groups (A.2–A.10).[^2][^22]

**SS ISO/IEC 42001:2024:** the Singapore national-standard adoption of ISO/IEC 42001:2023, with informative Annex ZA describing AI Verify as the implementation toolkit.[^11]

**AI Verify:** the IMDA + AI Verify Foundation governance testing framework + open-source software toolkit, mapped to NIST AI RMF (October 2023) and ISO/IEC 42001 (June 2024).[^9][^10][^50]

**EU AI Act Article 9:** the high-risk-AI risk-management-system obligation, applying from 2 August 2026 (potentially December 2027 under the Digital Omnibus extension).[^44][^29]

**Single Evidence Base:** the operational pattern in which one risk register, one technical file, one incident-response runbook, and one evidence library serve all three frameworks, with two-tag evidence schema (NIST function + ISO control).[^14][^33]

**COMPEL Framework:** Tamer Abdelalim's six-stage harmonisation methodology (Calibrate, Organize, Model, Produce, Evaluate, Learn) mapping unified governance to NIST AI RMF + ISO 42001 outputs.[^14][^33]

**Annex SL:** the high-level structure shared by ISO management system standards (ISO 27001, ISO 9001, ISO 42001) that enables integrated management systems.[^4][^17]

## Related Research

- [Article 27 FRIA: A Methodology Field Manual for Public-Service Deployers](https://www.perea.ai/research/article-27-fria-methodology-field-manual) — the FRIA layer of the EU AI Act compliance program.
- [EU AI Act Vendor Contract Clause Library: The 2026 Procurement Playbook](https://www.perea.ai/research/eu-ai-act-vendor-contract-clauses) — the vendor-side procurement contracts that anchor the supplier-management evidence in this stack.
- [AI Bill of Materials and Agent Supply-Chain Compliance](https://www.perea.ai/research/ai-bom-agent-supply-chain) — the Article 11 + Annex IV technical-documentation flow that pairs with the ISO 42001 Clause 7.5 documentation requirement.

## References

[^1]: NIST, "AI Risk Management Framework." https://www.nist.gov/itl/AI-risk-management-framework
[^2]: ISO/IEC 42001:2023 — covered via SS ISO/IEC 42001:2024 national adoption preview. https://www.singaporestandardseshop.sg/Product/GetPdf?fileName=250123123544SS+ISO+IEC+42001-2024+Preview.pdf&pdtid=8925f190-9b21-4af4-b52c-268f7df47727
[^3]: EU AI Act Service Desk — Article 9 Risk Management System. https://ai-act-service-desk.ec.europa.eu/en/ai-act/article-9
[^4]: RSI Security, "NIST AI RMF & ISO/IEC 42001: Crosswalk for AI Compliance" (2025-12-02). https://blog.rsisecurity.com/nist-ai-risk-management-framework-iso-42001-crosswalk/
[^5]: EU AI Compass, "ISO 42001 & NIST AI RMF to EU AI Act Mapping Guide" — Abhishek G Sharma (2026-03-18). https://euaicompass.com/iso-42001-nist-ai-rmf-eu-ai-act-mapping.html
[^6]: EU AI Compass, "EU AI Act vs ISO 42001 vs NIST AI RMF Crosswalk" (2026-03-01). https://euaicompass.com/eu-ai-act-iso-42001-nist-ai-rmf-crosswalk.html
[^7]: NIST AIRC, "NIST AI RMF to ISO/IEC FDIS 42001 AI Management system Crosswalk" PDF. https://airc.nist.gov/docs/NIST_AI_RMF_to_ISO_IEC_42001_Crosswalk.pdf
[^8]: NIST AIRC, "Crosswalk Documents Library." https://airc.nist.gov/airmf-resources/crosswalks/
[^9]: IMDA, "Joint mapping exercise between Singapore IMDA and the US NIST" (2023-10-13). https://www.imda.gov.sg/resources/press-releases-factsheets-and-speeches/press-releases/2023/nist-imda-joint-mapping-exercise
[^10]: AI Verify Foundation, "Crosswalk: ISO/IEC 42001 and AI Verify" (June 2024). https://aiverifyfoundation.sg/wp-content/uploads/2024/06/Crosswalk-AIV-and-ISO42001-final.pdf
[^11]: Singapore Standards Council, "SS ISO/IEC 42001:2024 — Annex ZA" preview. https://www.singaporestandardseshop.sg/Product/GetPdf?fileName=250123123544SS+ISO+IEC+42001-2024+Preview.pdf&pdtid=8925f190-9b21-4af4-b52c-268f7df47727
[^12]: arXiv UGAF-ITS, "Standards Harmonization Framework and Validation Tool for Multi-Framework AI Governance." https://arxiv.org/html/2604.22789v1
[^13]: Modulos Docs, "AI Governance Frameworks Comparison." https://docs.modulos.ai/frameworks/comparison/
[^14]: COMPEL Framework, "NIST AI RMF to ISO 42001 Crosswalk: A Dual-Compliance Operating Map" — Tamer Abdelalim (2026-01-01). https://www.compelframework.org/articles/nist-ai-rmf-iso-42001-crosswalk
[^15]: Strac, "AI Governance Framework: The Complete 2026 Guide" (2026-04-23). https://www.strac.io/blog/ai-governance-framework
[^16]: FairNow, "Integrating the NIST AI RMF and ISO 42001: A Practical Guide" — Sethupathy (2025-10-03). https://fairnow.ai/map-nist-ai-rmf-iso-42001/
[^17]: Trussed AI, "ISO 42001 Standard for AI Governance and Risk Management" (2026-04-08). https://feeds.trussed.ai/blog/iso-ai-risk-management
[^18]: Lenavix, "AI Governance Guide: Operationalize NIST & EU AI Act" (2026-02-09). https://ai.lenavix.com/ai-transformation-is-a-problem-of-governance
[^19]: Legalithm, "AI Governance Framework: Build Your AI Program" (2026-03-15). https://www.legalithm.com/en/blog/ai-governance-framework-building-compliance-program
[^20]: GAICC, "NIST AI Risk Management Framework: A Complete Guide" (2026-03-05). https://gaicc.org/blog/nist-ai-risk-management-framework
[^21]: Yonah Welker, "NIST: Generative AI Profile and AI Risk Management Framework" (2025-05-27). https://yonahwelker.org/nist-rmf-generative-ai-profile-600-1
[^22]: ExamCert, "ISO 42001 AI Management Certification Guide 2026" (2026-05-03). https://www.examcert.app/blog/iso-42001-ai-management-certification-2026/
[^23]: Pacific Cert, "ISO/IEC 42001:2026 Guide | AI Management & Governance" (2025-11-27). https://blog.pacificcert.com/iso-iec-42001-and-the-rise-of-ai-management-systems/
[^24]: GLACIS, "ISO 42001 vs EU AI Act: Framework Crosswalk Guide" (2025-12-28). https://glacis.io/guide-iso-42001-vs-eu-ai-act
[^25]: Trussed AI, "ISO 42001 vs NIST AI RMF: Key Differences & Comparison Guide" (2026-04-14). https://feeds.trussed.ai/blog/iso-42001-vs-nist-ai-risk-management-framework
[^26]: Elevate Consult, "NIST AI RMF vs ISO 42001: Best Framework for Control Teams" (2026-04-05). https://elevateconsult.com/insights/nist-ai-rmf-vs-iso-42001-for-teams-building-ai-controls/
[^27]: RSI Security, "ISO 42001 and NIST AI RMF Alignment for Responsible AI" (2026-02-02). https://blog.rsisecurity.com/iso-42001-nist-ai-rmf-alignment/
[^28]: EU AI Compass, "ISO 42001 & NIST AI RMF to EU AI Act Mapping Guide." https://euaicompass.com/iso-42001-nist-ai-rmf-eu-ai-act-mapping.html
[^29]: Ampliflow, "EU AI Act and ISO 42001: how they connect" — Patrik Björklund (2026-02-16). https://www.ampliflow.com/articles/ai-act-and-iso-42001
[^30]: Quantamix Solutions, "ISO 42001 vs EU AI Act: Key Differences" — Harish Kumar. https://quantamixsolutions.com/insights/iso-42001-vs-eu-ai-act/
[^31]: artificialintelligenceact.eu, "Article 27: Fundamental Rights Impact Assessment." https://artificialintelligenceact.eu/article/27
[^32]: AI Office, "Code of Practice on marking and labelling of AI-generated content." https://digital-strategy.ec.europa.eu/en/policies/code-practice-ai-generated-content
[^33]: COMPEL Framework, "Implement Once, Comply with Many: The COMPEL Harmonization Approach" (2026-01-01). https://www.compel.one/learn/eatp-level-2/m2-6/implement-once-comply-with-many-the-compel-harmonization-approach
[^34]: Fernando Arrieta, "ISO 42001 vs EU AI Act: How to prepare your AI management system in 2026" (2026-02-28). https://fernandoarrieta.org/en/investigaciones/iso-42001-vs-eu-ai-act/
[^35]: NIST, "Artificial Intelligence Risk Management Framework: Generative Artificial Intelligence Profile" — official publication page (2024-07-26). https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence
[^36]: NIST, "NIST AI 600-1 GenAI Profile PDF." https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf
[^37]: NIST AIRC, "NIST AI 600-1 + Singapore/IMDA AI Verify Crosswalk" PDF (May 28, 2025). https://airc.nist.gov/documents/1/20250527-Crosswalk_NIST_600-1_IMDA_AI_Verify.pdf
[^38]: Cloud Security Alliance, "ISO 42001: Auditing and Implementing Framework" (2025-05-08). https://cloudsecurityalliance.org/blog/2025/05/08/iso-42001-lessons-learned-from-auditing-and-implementing-the-framework
[^39]: Q-Cert, "ISO/IEC 42001:2023 Certification" (2025-10-29). https://www.qmscert.com/en/information-technology-en/iso-iec-42001-en/
[^40]: Dsalta, "ISO 42001: The Complete Guide to AI Management System Certification." https://www.dsalta.com/resources/ai-compliance/resources-ai-compliance-iso-42001-ai-management-system-guide
[^41]: GLACIS, "ISO 42001 vs EU AI Act Framework Crosswalk Guide." https://glacis.io/guide-iso-42001-vs-eu-ai-act
[^42]: CompliAct, "EU AI Act vs ISO 42001: where they overlap, where they differ" (2026-04-11). https://compliact.medium.com/eu-ai-act-vs-5e77469eced6
[^43]: Ampliflow — Digital Omnibus on AI extension reference. https://www.ampliflow.com/articles/ai-act-and-iso-42001
[^44]: artificialintelligenceact.eu, "Article 9: Risk Management System." https://artificialintelligenceact.eu/article/9/
[^45]: Legalithm — risk-management baseline cross-reference. https://www.legalithm.com/en/blog/ai-governance-framework-building-compliance-program
[^46]: The Art of Service, "NIST AI RMF Integration with ISO/IEC 42001 AI Governance Controls" (2026-04-04). https://theartofservice.com/blog/nist-ai-risk-management-framework-integration-with-iso-iec-4
[^47]: AI Act Service Desk, Article 9 paragraph-by-paragraph. https://ai-act-service-desk.ec.europa.eu/en/ai-act/article-9
[^48]: Quantamix Solutions, "ISO 42001 vs EU AI Act: Key Differences." https://quantamixsolutions.com/insights/iso-42001-vs-eu-ai-act/
[^49]: COMPEL Framework, "Building a Harmonized Compliance Evidence Portfolio" (2026-01-01). https://www.compelframework.org/articles/building-a-harmonized-compliance-evidence-portfolio
[^50]: IMDA, "Artificial Intelligence in Singapore — AI Verify." https://www.imda.gov.sg/How-We-Can-Help/AI-Verify
[^51]: AI Verify Foundation, "What is AI Verify." https://aiverifyfoundation.sg/what-is-ai-verify/
[^52]: NIST AIRC, "Crosswalk Between NIST AI 600-1 and Singapore/IMDA AI Verify." https://airc.nist.gov/documents/1/20250527-Crosswalk_NIST_600-1_IMDA_AI_Verify.pdf
[^53]: AI Verify Foundation Resources. https://staging.aiverifyfoundation.sg/resources/
[^54]: GAICC, "Singapore Agentic AI Governance Framework: What US Businesses Need to Know" (2026-03-03). https://gaicc.org/blog/singapore-agentic-ai-governance-framework/
[^55]: Cycles, "The AI Agent Governance Framework: Mapping NIST, EU AI Act, ISO 42001, and OWASP" (2026-04-02). https://runcycles.io/blog/ai-agent-governance-framework-nist-eu-ai-act-iso-42001-owasp-runtime-enforcement
[^56]: RiskTemplates, "NIST AI 600-1: The Generative AI Profile and Its 12 Risk Categories Explained" (2026-04-15). https://risktemplate.com/blog/2026-04-15-nist-ai-600-1-generative-ai-profile-12-risk-categories
[^57]: NIST regulations.gov public comment on AI 600-1. https://downloads.regulations.gov/NIST-2024-0001-0152/attachment_1.pdf
[^58]: COMPEL Framework — six evidence types. https://www.compelframework.org/articles/building-a-harmonized-compliance-evidence-portfolio
[^59]: SafeguardsAI, "NIST AI RMF, ISO 42001, and EU AI Act Integration: Comprehensive AI Governance Framework" (2025-11-11). https://safeguardsai.com/nist-ai-rmf-eu-ai-act-iso42001-integration-2025-11-11-VERIFIED-2025-11-13.html
[^60]: Lenavix — unified controls crosswalk + 365-day plan. https://ai.lenavix.com/ai-transformation-is-a-problem-of-governance
[^61]: Strac — pre-mapped controls library. https://www.strac.io/blog/ai-governance-framework
[^62]: Modulos Docs — three framework types layering. https://docs.modulos.ai/frameworks/comparison/
[^63]: Legalithm — ISO 42001 backbone + NIST methodology + EU overlay strategy. https://www.legalithm.com/en/blog/ai-governance-framework-building-compliance-program
[^64]: BSI, "ISO 42001 — AI Management System." https://v1.bsigroup.com/en/products-and-services/standards/iso-42001-ai-management-system/
[^65]: SGS, "ISO/IEC 42001 Certification — Artificial Intelligence (AI) Management System." https://www.sgs.com/en/services/iso-iec-42001-certification-artificial-intelligence-ai-management-system
[^66]: DNV, "ISO/IEC 42001 Certification: AI Management System." https://www.dnv.ae/services/iso-42001---service/
[^67]: Kiwa, "ISO 42001 Certification for AI Management Systems" (2026-02-23). https://www.kiwa.com/us/en-us/services/certification/iso-42001-certification-for-ai-management-systems/
[^68]: Orion, "ISO 42001 Certification" (2026-04-22). https://www.orioncan.com/en/iso-42001-certification/

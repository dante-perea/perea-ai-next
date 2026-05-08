---
title: "Article 27 FRIA: A Methodology Field Manual for Public-Service Deployers"
subtitle: "ECNL+DIHR five-phase methodology, six statutory elements, Charter rights mapping, market-surveillance-authority notification — what a defensible FRIA actually looks like before 2 August 2026"
publication: "perea.ai Research"
authors: ["Dante Perea"]
version: "1.0"
status: "Public draft"
date: "2026-05"
audience: "AI governance leads, DPOs, in-house counsel, and procurement officers at public authorities, private operators of public services, banks, and insurers preparing for the 2 August 2026 Article 27 deadline"
length: "~5,500 words"
license: "CC BY 4.0"
profile: "field-manual"
description: "A working manual for the EU AI Act's Fundamental Rights Impact Assessment under Article 27. Codifies the ECNL+DIHR five-phase methodology (Dec 2025), the six statutory elements of Art 27(1), Charter rights mapping, severity-likelihood scoring drawn from Catalan APDCAT and FRIAct, FRIA×DPIA integration under Art 27(4), and the Article 27(3) market-surveillance-authority notification path — all with absolute citations to EUR-Lex Regulation 2024/1689, EDPB and EDPS opinions, FRA guidance, AI Act Service Desk publications, and primary academic sources."
---

## Foreword

This is a working field manual for the EU AI Act's Fundamental Rights Impact Assessment (FRIA) under Article 27.[^1] The Article enters its operational regime on 2 August 2026 — the date the high-risk obligations under Article 6(2) become applicable.[^2][^3] The European AI Office's Article 27(5) questionnaire template, mandated by the Regulation itself, has not been published as of April 2026,[^4][^5] which means deployers in scope must build their own structured assessment that maps to all six statutory elements without the official scaffolding.[^6][^7] Civil society and academic groups have moved into the gap.

The Danish Institute for Human Rights (DIHR) and the European Center for Not-for-Profit Law (ECNL) published the canonical five-phase methodology in December 2025, with an Excel template piloted across Berlin, Copenhagen, and Brussels workshops.[^8][^9][^10]

The Catalan Data Protection Authority's three-phase model, the Netherlands FRAIA instrument, the Council of Europe HUDERIA Methodology, the FRIAct framework, the EU Fundamental Rights Agency's December 2025 high-risk-AI report, and Mantelero's *Computer Law & Security Review* paper now form a working canon a deployer can defend against.[^11][^12][^13][^14][^15][^16][^17][^18] This manual organises that canon into the recipes a procurement office can paste into a runbook on Monday morning.

## Executive Summary

Article 27 obligates three categories of deployers to perform a FRIA before they put a high-risk AI system into use:[^1][^19][^20] (i) bodies governed by public law; (ii) private entities providing public services; (iii) deployers of high-risk AI systems referred to in Annex III points 5(b) (creditworthiness/credit scoring, except fraud detection) and 5(c) (risk assessment and pricing for life and health insurance).[^21] Annex III point 2 — critical-infrastructure safety components — is explicitly excluded.[^22][^23]

The FRIA itself consists of six statutory elements (Article 27(1)(a)–(f)): a description of the deployer's processes; the period and frequency of intended use; the categories of natural persons and groups likely to be affected; the specific risks of harm in light of the provider's Article 13 information; a description of the human-oversight implementation; and the measures to take if those risks materialise — including internal governance arrangements and a complaint mechanism.[^1][^6] Article 27(2) treats the FRIA as a living document that must be updated when any element changes.[^1][^24] Article 27(3) requires the deployer to notify the market-surveillance authority designated under Article 70 of the results, submitting the filled-out template once the AI Office publishes it.[^1][^25] Article 27(4) makes the FRIA complement — not replace — any GDPR Article 35 DPIA.[^1][^26] Article 46(1) carves out a narrow public-security/life-and-health derogation.[^1][^27]

The ECNL+DIHR five-phase methodology — Planning and Scoping; Assessing and Mitigating Negative Impacts; Deployment Decision and Public Reporting; Monitoring and Review; Cross-cutting Stakeholder Consultation — is the implementation pattern that has emerged as canonical in the absence of the AI Office template.[^8][^9][^28] The Catalan APDCAT three-phase model and Roberto Pusceddu's FRIAct framework provide the quantitative scoring layer (severity × probability matrices producing per-right impact scores).[^11][^15][^16] The FRA's December 2025 report finds mitigation practices to be "fragmented" and warns that self-assessment by deployers is often insufficient — a constraint this manual is designed to compensate for.[^17][^29]

Penalties for Article 27 non-compliance fall under the operator-obligations tier of Article 99: up to €15 million or 3% of global annual turnover, whichever is higher, with the inverted-cap rule for SMEs.[^30][^31] The cost of getting the FRIA wrong is therefore on the same order as the cost of doing it well — and substantially less than the cost of a public-sector FRIA failure that surfaces only after deployment.[^29][^32]

## Part I: Who Must Run a FRIA — Scope and Triggers

The single biggest implementation question for Article 27 is "does it apply to us?" The answer is precise and narrow.[^19][^20][^33]

**Category 1 — Bodies governed by public law.** National ministries, agencies, regional and local authorities, public establishments such as public hospitals, public universities, employment agencies, social-security bodies, judicial authorities, law enforcement, and border-control agencies all sit in this category.[^33][^34] The classification of "body governed by public law" follows national-law definitions, which vary by Member State; when the status is ambiguous, running the FRIA is the lower-risk path.[^20]

**Category 2 — Private entities providing public services.** Recital 96 frames this category around tasks in the public interest: education, healthcare, social services, housing, and the administration of justice.[^1][^34] A privately operated school receiving public funding, a social-housing association, an NHS contractor running a triage system, a utility delivering an essential service — all are in scope. The category reaches further than government contractors in name; SaaS vendors whose product is used by a public-sector customer to deliver a citizen-facing service are within reach when their tool drives the deployer's decisions.[^20]

**Category 3 — Deployers of Annex III points 5(b)/(c) systems.** Banks, lenders, mortgage providers, life insurers, and health insurers deploying AI for creditworthiness assessment, credit scoring, or risk assessment and pricing for natural persons fall in scope regardless of whether they are public or private.[^21][^35] AI used purely for fraud detection is exempt.[^21] This is the category that catches private financial institutions that would otherwise sit outside Article 27.

**Annex III point 2 (critical-infrastructure safety components) is explicitly excluded** from Article 27.[^1][^22][^23] An AI system that is a safety component for the management or operation of critical digital infrastructure, road traffic, or the supply of water, gas, heating, or electricity is not in the FRIA scope, even where the deployer would otherwise be in Category 1 or 2.[^36] This is a deliberate carve-out so safety-critical systems are governed by sector regimes rather than Article 27.

**Voluntary FRIA for out-of-scope deployers.** A private commercial entity using a high-risk AI system in HR or recruitment is not strictly in Article 27's scope unless it is providing a public service.[^33][^37] But because Article 26 deployer obligations and Article 86 right-of-explanation duties still apply, many in-house counsel teams are running voluntary FRIAs as the cleanest way to evidence Article 26 compliance and to be ready if the deployer's status reclassifies under future Member State guidance.[^33][^38]

**Contract for Part I.** Build a one-page Article 27 scope decision: name the deployer, classify against the three categories, name the high-risk AI systems in scope, mark Annex III point 2 exclusions, mark Article 46(1) derogations, and timestamp the decision. This document is the predicate for everything that follows. The AI Act Service Desk's Single Information Platform offers a Compliance Checker tool that can pre-populate this decision; treat its output as advisory and have counsel sign the final classification.[^25][^39]

## Part II: The Six Statutory Elements of Article 27(1)

The six elements are not a checklist; they are six operational questions a deployer must answer in writing before first use.[^1][^6][^33]

**(a) The deployer's processes in which the high-risk AI system will be used, in line with its intended purpose.** The system's *intended purpose* is the provider's input from the Article 13 instructions for use; the FRIA must describe the deployer's specific *workflow integration*.[^33][^40] A welfare-eligibility scoring system has the same intended purpose across municipalities, but each municipality's process — caseworker review, escalation procedure, override authority — is different, and Article 27(1)(a) targets the latter, not the former.[^33]

**(b) Period and frequency of intended use.** Pilot, phased rollout, or full deployment; per-transaction, per-application, periodic, or continuous; geographic scope. The frequency dimension determines the volume of affected persons over a quarter and is what makes "minor risk per decision × millions of decisions" visible.[^6][^33]

**(c) Categories of natural persons and groups likely to be affected by use in the specific context.** Direct subjects (applicants, students, patients, residents) and indirect stakeholders (relatives, associated households, downstream service users) both count. Vulnerable groups deserve named attention — minors, the elderly, persons with disabilities, those with low educational attainment, migrants, people in welfare or debt-support trajectories.[^6][^33] Recital 27 of Regulation 2024/1689 anchors the children's rights consideration in Article 24 of the EU Charter and the UNCRC General Comment No 25 on the digital environment.[^4][^41]

**(d) Specific risks of harm likely to impact those persons or groups, taking into account the information given by the provider pursuant to Article 13.** This is the analytical core. The provider's Article 13 documentation is *input*, not a substitute. The deployer must add context-specific risk analysis — what does this welfare model do under our particular caseload distribution? What does this credit model do for the demographic profile we lend into?[^33][^40] Cross-reference must be explicit: every risk in this section names which Article 13 source it draws from and where the deployer added independent analysis.[^33]

**(e) Description of the implementation of human-oversight measures, in line with the instructions for use.** Article 14 of Regulation 2024/1689 governs the design-side oversight requirements; Article 27(1)(e) governs the deployer-side implementation.[^4][^42] Naming the role, the override authority, the escalation chain, the time available to review each output, and the training requirement is what makes the human-oversight description defensible. Generic language ("a human is in the loop") fails this element.[^33]

**(f) Measures to take if risks materialise — internal governance and complaint mechanisms.** Three operational artifacts: an internal-governance document naming the system owner, the deployment-change-approval authority, and the incident response chain (cross-referenced to Article 73 reporting); a complaint mechanism with intake channels, response SLAs, and the Article 86 right-of-explanation pathway; and a FRIA review cadence that fires on system-version changes, new affected-person categories, post-incident, and at least annually.[^6][^33][^38]

**Contract for Part II.** Each of the six elements gets its own document section with a unique heading and a named owner. The verify path during a market-surveillance audit will trace each element to specific evidence — meeting minutes, model cards, Article 13 documentation references, training records, incident logs.

## Part III: The Five-Phase Methodology

The ECNL+DIHR five-phase methodology, published December 2025, is the canonical operational pattern.[^8][^9][^10] It is grounded in the UN Guiding Principles on Business and Human Rights and integrates the Netherlands FRAIA, the Catalan APDCAT FRIA model, the Council of Europe HUDERIA, and the FRIAct pre-deployment questionnaire.[^9][^11][^12][^13][^14] AlgorithmWatch and Michele Loi contributed the questionnaire template specifically.[^9][^28]

**Phase 1 — Planning and Scoping.** The earliest the FRIA can begin is at the procurement decision; the latest defensibly is the start of system configuration.[^28][^32] The aigl.blog February 2026 review notes that "ideally pre-procurement" timing is what separates a real FRIA from a retrospective justification.[^32] The team must be multidisciplinary: legal counsel, a data scientist who understands the model, a policy advisor who knows the deployment context, and meaningful engagement with affected groups (or their representatives) — not vendor sales engineers.[^33] Three team-model trade-offs surface in the literature: in-house (highest institutional learning, lowest external credibility), externalised (highest credibility, lowest learning), and hybrid (the dominant choice).[^32] Phase 1 includes the context analysis: a clustered questionnaire pulling on the Article 13 documentation, the deployer's process map, and known historical incidents.[^9][^28]

**Phase 2 — Assessing and Mitigating Negative Impacts on Fundamental Rights.** This is the analytical engine. The Catalan APDCAT three-phase model formalises it as planning/scoping/risk-identification → risk analysis → risk mitigation/management, with intrinsic risks (system-internal) distinguished from extrinsic risks (system-environment interaction).[^11] Pusceddu's FRIAct framework adds the quantitative layer: a Questionnaire Risk Indicator (QRI) on a 1–10 ordinal scale and a Severity × Probability matrix producing Impact Significance scores per Charter right.[^15] The ECNL+DIHR severity parameters track scope (number of affected persons), gravity (irreversibility, consequence severity), reach (population proportion), and vulnerability of affected groups.[^9][^28] Mitigation measures fall into four taxonomic families — technical (bias testing, accuracy monitoring, threshold calibration), organisational (oversight roles, training), procedural (complaint mechanisms, appeal processes), and communication (informing affected persons, explanation pathways) — drawn from the Legalithm step-by-step decomposition.[^43]

**Phase 3 — Deployment Decision and Public Reporting.** The output of Phase 2 must inform the deployment decision in writing.[^9][^28] Where absolute Charter rights are implicated (dignity, prohibition of torture or degrading treatment, slavery prohibition), the framework calls for explicit non-deployment thresholds rather than mitigation.[^32] For public-sector deployers, the FRIA results summary must be published in the EU database under Annex VIII Section C; private banks and insurers required to FRIA are exempt from publication, which the ECNL Learning Center notes makes public scrutiny harder for those deployments.[^28][^44]

**Phase 4 — Monitoring and Review.** Article 27(2) makes the FRIA a living document. The Utrecht University evaluation of fifteen FRAIA trajectories recommends storing the document at a centralised location, treating it as a knowledge-transfer artifact, and forming an inter-organisation FRIA community.[^45] Triggers for review include system version changes, new training data, new affected-person categories, post-market-monitoring findings, and reported incidents.[^43][^38] Annual review cadence is the practical floor.[^38]

**Phase 5 — Cross-cutting Stakeholder Consultation.** Not a sequential phase but an obligation that runs through Phases 1–4. Methods range from written submissions and surveys at low engagement intensity up to structured workshops, focus groups, and ongoing advisory panels at high intensity.[^28] The Catalan APDCAT model anchors this in lived-case research — voice-assistant-for-elderly assessments incorporated direct caregiver and family interviews.[^11]

**Time budget.** Haffa.ai's March 2026 guide gives concrete time estimates: 1–2 days context analysis, 2–3 days rights mapping, 2–3 days risk evaluation, 3–5 days mitigation design, 1–2 days documentation and notification — a 9–15 working-day total for a single high-risk system.[^46] This is a useful planning anchor for any procurement office assigning resources to the FRIA before the 2 August 2026 deadline.[^46][^47]

## Part IV: Charter Rights Mapping and Severity × Likelihood Scoring

The FRIA's analytical layer is where most internally-developed assessments fail.[^17][^33] The FRA's December 2025 report on high-risk AI found mitigation practices to be "fragmented" and noted that organisations frequently lack structured methods to assess fundamental-rights risks beyond data protection and non-discrimination.[^17][^29] This Part is the corrective.

**Charter rights mapping.** Recital 27 of Regulation 2024/1689 enumerates the rights anchored by the Charter when classifying high-risk AI: human dignity, respect for private and family life, protection of personal data, freedom of expression and information, freedom of assembly and association, the right to non-discrimination, the right to education, consumer protection, workers' rights, the rights of persons with disabilities, gender equality, intellectual property rights, the right to an effective remedy and to a fair trial, the right of defence and the presumption of innocence, and the right to good administration.[^4][^41][^48] Children's rights under Article 24 of the Charter and the UNCRC General Comment No 25 are called out separately and require their own assessment column where the system touches minors.[^4]

The CNIL's published guidance for individual rights extends the operational checklist: Article 22 GDPR and Article 47 of the French Data Protection Act on solely-automated decisions, freedom of thought, conscience, and religion, freedom of movement, and group impacts (gender, origin, political or religious opinions, broader societal/democratic effects).[^49][^50] The aiactblog.nl operational mapping converts each of those into a per-right risk-assessment row: applicability flag, nature of potential impact, severity rating, source-of-evidence pointer.[^33][^51]

**Severity dimensions.** The ECNL+DIHR severity framework breaks severity into:[^9][^28]

- **Scope** — how many people are affected per period of operation.
- **Gravity** — whether the harm is reversible, the magnitude of the consequence (a denied benefit decision can mean homelessness; a denied credit decision can mean denied housing two months later).
- **Reach** — what proportion of the affected population is at the right tail of the harm distribution.
- **Vulnerability** — whether affected groups are protected characteristics, minors, or in dependent relationships with the deployer (e.g., welfare claimants, debt-support cases, asylum seekers).

The FRIAct framework operationalises severity with a Probability of Occurrence dimension to produce per-right Impact Significance scores using a semi-quantitative matrix.[^15] Where numerical inputs are unavailable, an ordinal scale (low/medium/high) is the documented fallback.[^15]

**Likelihood dimensions.** Likelihood draws on three inputs: known system limitations from the provider's Article 13 documentation, the deployment context (e.g., caseload distribution, operator experience, time pressure), and historical evidence of similar harms (e.g., the Dutch SyRI judgment, the childcare-benefit scandal, the DUO discriminatory-fraud-detection case the Utrecht University paper centres).[^45][^43]

**Risk scoring.** The Catalan APDCAT model and the ECNL+DIHR template both use a 5×5 likelihood-by-severity heat map producing residual-risk colour codes. Mitigation must reduce the colour code to a defined target before deployment can proceed; where the residual remains red after mitigation, the framework calls for a non-deployment decision.[^11][^32] The aiactblog.nl boardroom-sector guide notes that visual heat-map dashboards (rather than 40-page PDFs) are what board members and elected officials actually engage with.[^52]

**The FRA structural critique.** The FRA December 2025 report cautions that broad interpretations of the high-risk classification "filters" can allow systems with substantial rights impacts to circumvent stricter safeguards — a loophole risk especially in law enforcement.[^17][^29] The deployer's defence is a written, documented FRIA that explicitly maps each filter exclusion claim to its evidentiary basis.

## Part V: FRIA × DPIA Integration (Article 27(4))

A surprisingly large fraction of in-scope FRIAs sit on top of an existing DPIA. Article 27(4) was drafted to manage the overlap.[^1][^53] It does not let a DPIA replace a FRIA; it requires the FRIA to *complement* an existing DPIA where that DPIA already covers some of the FRIA's required elements.[^1][^33] In practice the two share roughly 60–70% of their inputs (deployment description, affected persons, risks, mitigations) and can be conducted as a combined assessment with two distinct sections — one for personal-data protection (DPIA) and one for fundamental rights beyond data (FRIA).[^54][^46]

**What the DPIA does not cover.** A DPIA cannot answer non-discrimination questions about the AI system itself, access-to-justice questions, due-process questions, freedom-of-expression questions, or right-to-good-administration questions.[^54][^55] Those map onto the Charter rights named in Recital 27 and require independent FRIA analysis.[^4][^41]

**Submission paths are different.** The FRIA goes to the Article 70 market-surveillance authority; the DPIA, where consultation is needed under GDPR Article 36, goes to the data-protection supervisory authority.[^33][^54] Some Member States may designate the same authority for both. The EDPB's July 2024 statement recommends that DPAs be designated as MSAs for the high-risk systems listed in Annex III point 1 (biometrics) and points 6–8 (law enforcement, migration, justice, democracy) to keep fundamental-rights expertise consolidated.[^56] The EDPB-EDPS Joint Opinion 1/2026 on the Digital Omnibus on AI reiterates that DPAs need direct involvement in the supervision of regulatory sandboxes and that their independence and powers must remain unaffected by the cooperation framework with MSAs.[^57][^58]

**The CNIL methodology.** France's DPA has published the most operationally specific national guidance on the AI-DPIA: a DPIA "in principle necessary" for high-risk AI systems involving personal data, with a defined risk taxonomy (data misuse, breach, discrimination), and a mitigation toolkit naming homomorphic encryption, secure execution environments, differential privacy, federated learning, and machine-unlearning techniques.[^50][^59] These map cleanly into the FRIA's Phase 2 mitigation taxonomy and are the easiest mitigation measures to attach to a defensible FRIA.[^50]

**The Article 86 right of explanation.** A FRIA does not have to be published in full, but Article 86 grants affected persons a right to explanation of individual decision-making that may require the deployer to disclose the relevant FRIA sections on request.[^38][^60] Build the FRIA with that disclosure in mind: separate the structural analysis (publishable) from the named-system-vendor and competitive-detail content (redactable on request).[^38]

## Part VI: Notification, EU Database, and Audit Trail

Article 27(3) is the operational obligation that catches deployers most often. It is not enough to complete the FRIA — the results must be notified to the market-surveillance authority designated under Article 70.[^1][^33][^61]

**Submission timing.** The Regulation does not specify an advance notice period. Practical guidance from early Member State implementations suggests a 30-calendar-day window before first use to allow the authority to raise concerns; some commentary cites a Legalithm reading that authorities may comment within three months.[^38][^62] In the absence of an official AI Office template, the working pattern is a structured six-section report mapping 1:1 to Article 27(1)(a)–(f), which makes later transposition into the official template mechanical.[^25][^33]

**EU database registration.** The AI Act establishes an EU database of high-risk AI systems under Annex VIII. Public-sector deployers must publish a summary of FRIA results linked to the system's database entry alongside deployer identity and contact details.[^28][^63] Private banks and insurers required to FRIA are exempt from publication.[^28] The database is intended as a public registry that civil-society watchdogs can use to identify deployments and request fuller FRIA information; the ECNL Learning Center notes that confidentiality limits under Article 78 of the Regulation do constrain that follow-on access.[^28]

**The audit trail.** The eight artifacts that make up a defensible FRIA package:[^33][^38][^46]

1. The scoping decision (Part I above).
2. The six-element structured assessment (Part II above).
3. The five-phase work record with team identities and dates (Part III above).
4. The Charter rights mapping with severity × likelihood scores (Part IV above).
5. The DPIA cross-reference and integration log (Part V above).
6. The market-surveillance-authority notification submission and acknowledgment.
7. The internal-governance document (system owner, change-approval authority, complaint-mechanism description, incident response).
8. The review schedule and post-deployment monitoring log.

**The audit trigger.** Market surveillance authorities can request the FRIA at any time after first use. The euaiactchecklist.com 2026 template guide cites at least 30 calendar days advance notification practice and recommends storing the eight artifacts in a versioned document repository keyed by deployer + AI-system identifier so the audit response is a single retrieval rather than a forensic reconstruction.[^38][^64]

**Penalties.** Article 99 sets the operator-obligation tier at up to €15 million or 3% of global annual turnover, whichever is higher, with the inverted-cap rule for SMEs.[^31][^65] The Service Desk-FAQ-published guidance on penalty calibration is still evolving as of April 2026; the practical posture is to assume regulators will calibrate against the deployer's audit-trail completeness, not against the FRIA's analytical sophistication, in the first wave of enforcement.[^46][^61]

## Part VII: Sector-Specific Patterns

**Public authorities.** Welfare eligibility, social-housing allocation, education admission, predictive-policing deployment, and migration triage are the high-volume Annex III categories that public-sector deployers will FRIA most often.[^17][^33][^66] The FRA Asylum and Immigration AI research project (publication 2027) is the next anchor publication for that subset.[^66] For municipalities the aiactblog.nl operational guide centres on six questions matched to Article 27(1)(a)–(f) and warns specifically against the "vendor paperwork" mistake, the "retrospective FRIA" mistake, and the "privacy-only reduction" mistake.[^33][^51]

**Banks and insurers.** Annex III 5(b) (creditworthiness, credit scoring, except fraud detection) and 5(c) (life and health insurance risk assessment and pricing) deployers are the private-sector cohort most exposed.[^21][^67] The Hogan Lovells / Lexology analysis flags the synergy with existing model-risk-management frameworks (SR 11-7 in the US, ECB TRIM in the EU): the FRIA should bolt on to existing SR 11-7-equivalent governance without duplicating effort, with separate sections for fundamental-rights risks that SR 11-7 does not cover (non-discrimination, access-to-services, dignity).[^68] Spain's AI Supervisory Agency has been operational since 2024, and similar national-level designations are expected during 2026.[^68][^25]

**Education.** Schools and universities deploying student-assessment, dropout-prediction, or admissions-screening systems fall in scope under Recital 96's public-services category.[^1][^34] The Catalan APDCAT educational-dropout case study is the published anchor.[^11] Children's-rights considerations under Article 24 of the Charter and UNCRC General Comment No 25 require explicit assessment columns, not a generic vulnerability footnote.[^4][^41]

**SaaS vendors providing AI tools to in-scope deployers.** Indirectly in scope: providers have parallel obligations under Article 9 (risk management) and Article 13 (instructions for use) to supply the information deployers need for their FRIA.[^38] The contractual obligation is the relevant lever — public-sector procurement contracts are increasingly requiring vendors to commit to Article 13 documentation completeness as a procurement precondition.[^32][^38]

## Quotable Findings — Article 27 FRIA Manual

1. Per Article 27 of Regulation 2024/1689,[^1] FRIA obligations apply to (i) bodies governed by public law, (ii) private entities providing public services, and (iii) deployers of Annex III points 5(b) credit-scoring and 5(c) life/health-insurance pricing systems — with Annex III point 2 critical-infrastructure systems explicitly excluded.[^21][^22]
2. Per the canonical EUR-Lex text of Regulation (EU) 2024/1689,[^4] the high-risk AI obligations under Article 6(2) — and therefore Article 27 — apply from 2 August 2026.[^2][^3]
3. Per the ECNL and Danish Institute for Human Rights five-phase Guide (December 2025),[^8][^9] a meaningful FRIA structures itself in five phases: Planning and Scoping, Assessing and Mitigating Impacts, Deployment Decision and Public Reporting, Monitoring and Review, and cross-cutting Stakeholder Consultation.
4. Per the Catalan APDCAT FRIA model (Mantelero, 2025),[^11] a three-phase implementation sequence (planning/scoping/risk-identification → risk analysis → risk mitigation/management) was applied to four real cases — education-dropout prediction, HR decision-support, oncology imaging, and an eldercare voice assistant.
5. Per Pusceddu's FRIAct framework (March 2025),[^15] per-right Impact Significance scores can be produced via a semi-quantitative Severity × Probability matrix combined with a 1–10 Questionnaire Risk Indicator, providing a defensible quantitative layer to the ECNL+DIHR methodology.
6. Per the EU Fundamental Rights Agency December 2025 report,[^17] mitigation practices in deployer-conducted FRIAs are "fragmented" and self-assessment is often insufficient — requiring practical guidance, oversight, and stakeholder collaboration to address rights risks credibly.
7. Per Article 27(4),[^1] the FRIA must complement — not replace — any GDPR Article 35 DPIA, with the two assessments sharing roughly 60–70% of their inputs but addressing distinct rights-categories (full Charter vs personal-data only).[^54]
8. Per Haffa.ai's March 2026 timing model,[^46] a single high-risk-system FRIA takes approximately 9–15 working days end-to-end (1–2 days context, 2–3 days rights mapping, 2–3 days risk evaluation, 3–5 days mitigation, 1–2 days documentation and notification).
9. Per Article 99 of Regulation 2024/1689,[^31] non-compliance with Article 27 obligations is subject to fines up to €15 million or 3% of global annual turnover, whichever is higher, with the inverted-cap rule for SMEs and start-ups.

## Glossary

**FRIA (Fundamental Rights Impact Assessment):** the deployer-side pre-deployment assessment required by Article 27 of the EU AI Act for in-scope deployers of high-risk AI systems.[^1]

**Annex III:** the list of high-risk AI systems under Article 6(2) — biometrics, critical infrastructure, education, employment, essential services (creditworthiness, insurance, public benefits), law enforcement, migration, justice, democratic processes.[^21][^22]

**Article 13 information:** the instructions-for-use and documentation that the AI system *provider* must supply to *deployers* — the input substrate for FRIA risk analysis under Article 27(1)(d).[^33]

**Article 27(1) elements:** the six statutory FRIA components — (a) processes, (b) period and frequency, (c) affected persons, (d) specific risks, (e) human oversight, (f) materialisation measures.[^1][^6]

**Article 46(1) derogation:** a narrow public-security/life-and-health emergency derogation that may temporarily exempt deployers from the Article 27(3) notification obligation.[^1][^27]

**Article 70 market-surveillance authority:** the national authority designated by each Member State to receive FRIA notifications; in many states this will be the national DPA or a dedicated AI authority.[^33][^54]

**Article 86 right of explanation:** the right of an affected person to a meaningful explanation of an individual AI-influenced decision, which may require the deployer to disclose relevant FRIA sections.[^38][^60]

**ECNL+DIHR methodology:** the canonical December 2025 five-phase FRIA implementation methodology published by the European Center for Not-for-Profit Law and the Danish Institute for Human Rights.[^8][^9]

**FRAIA:** the Fundamental Rights and Algorithms Impact Assessment instrument developed by Utrecht University Data School for the Dutch Ministry of the Interior in 2021, evolved through 15 piloted trajectories in 2023–2024.[^12][^13][^45]

**HUDERIA:** the Council of Europe's Methodology for risk and impact assessment of AI systems on human rights, democracy, and the rule of law, adopted by the CAI on 28 November 2024.[^14][^69]

**FRIAct:** Pusceddu's quantitative FRIA framework, generating per-Charter-right Impact Significance scores via Severity × Probability matrices.[^15]

**Recital 27:** the AI HLEG seven ethical principles framing of Regulation 2024/1689 — human agency, technical robustness, privacy/data governance, transparency, diversity/non-discrimination, social/environmental well-being, accountability.[^4][^70]

## Related Research

- [Right to Be Forgotten in Agent Memory: GDPR + CCPA Architectures for 2026](https://www.perea.ai/research/gdpr-ccpa-agent-memory-compliance) — companion regulatory paper covering deletion rights and DPIA-adjacent vector-store architecture.
- [AI Bill of Materials and Agent Supply-Chain Compliance](https://www.perea.ai/research/ai-bom-agent-supply-chain) — Article 11 + Annex IV technical-documentation duties that paired with Article 27 form the high-risk deployer compliance package.
- [MCP OAuth 2.1 and the Enterprise SSO Reality Check](https://www.perea.ai/research/mcp-oauth-2-1-enterprise-sso) — adjacent enterprise procurement compliance work where authentication and authorisation interlock with the human-oversight requirements of Article 27(1)(e).

## References

[^1]: Regulation (EU) 2024/1689 — Article 27 (canonical text via artificialintelligenceact.eu mirror). https://artificialintelligenceact.eu/article/27
[^2]: aiactblog.nl, "What is FRIA? Fundamental rights impact assessment explained (EU AI Act)" (2026-02-28). https://www.aiactblog.nl/en/posts/fria-complete-guide-article-27-ai-act
[^3]: euai.app, "Article 27 Deep Dive: FRIA Requirements Explained" — Paul McCormack (2026-02-20). https://euai.app/blog/article-27-fria-requirements-explained
[^4]: EUR-Lex, Regulation (EU) 2024/1689 — official text. https://eur-lex.europa.eu/legal-content/EN/TXT/?qid=1731073825866&uri=CELEX%3A32024R1689
[^5]: euaiactchecklist.com, "FRIA Template — Article 27 Fundamental Rights Impact Assessment (2026)." https://euaiactchecklist.com/eu-ai-act-fria-template.html
[^6]: AIActStack, "Article 27 EU AI Act: FRIA Explained" (2026-04-20). https://aiactstack.com/article/art-27
[^7]: Reg-Intel, "EU AI Act FRIA Template: Step-by-Step Guide" (2026-03-24). https://reg-intel.com/fria-template-guide/
[^8]: Danish Institute for Human Rights, "A guide to Fundamental Rights Impact Assessments under the EU Artificial Intelligence (AI) Act" (2025-12-15). https://www.humanrights.dk/publications/guide-fundamental-rights-impact-assessments-under-eu-artificial-intelligence-ai-act
[^9]: ECNL + DIHR, "ECNL DIHR Guide to FRIA" (December 2025) — Ioana Tuta, Vanja Skoric. https://www.humanrights.dk/files/media/document/ECNL%20DIHR%20Guide%20to%20FRIA%20Dec%202025.pdf
[^10]: ECNL, "A Guide to Fundamental Rights Impact Assessments (FRIA)" (2025-12-12). https://ecnl.org/publications/guide-fundamental-rights-impact-assessments-fria
[^11]: APDCAT (Catalan Data Protection Authority), "Catalonia presents a pioneering model in Europe for developing AI solutions that respect fundamental rights" (Mantelero). https://www.apdcat.cat/en/actualitat/noticies/2025/catalunya-presentaunmodelpioneraeuropaperadesenvoluparsolucionsd
[^12]: Government of the Netherlands, "Fundamental Rights and Algorithms Impact Assessment (FRAIA)" (2021). https://www.government.nl/binaries/government/documenten/reports/2021/07/31/impact-assessment-fundamental-rights-and-algorithms/fundamental-rights-and-algorithms-impact-assessment-fraia.pdf
[^13]: Government of the Netherlands, "FRAIA in action" (2024-06-20). https://www.government.nl/documents/reports/2024/06/20/fraia-in-action
[^14]: Council of Europe Committee on Artificial Intelligence (CAI), "HUDERIA Methodology and Model — adopted (provisional version 2026)." https://rm.coe.int/huderia-methodology-and-model-adopted-provisional-version-2026/48802ac001
[^15]: Roberto Pusceddu (Pollicino AI Advisory), "Assessing the Impact of Artificial Intelligence Systems on Fundamental Rights — FRIAct" (2025-03-14). https://pollicinoaidvisory.eu/wp-content/uploads/2025/03/Assessing-the-Impact-of-Artificial-Intelligence-Systems-on-Fundamental-Rights.pdf
[^16]: Alessandro Mantelero, "The Fundamental Rights Impact Assessment (FRIA) in the AI Act: Roots, legal obligations and key elements for a model template" — Computer Law & Security Review Vol. 54 (Sept 2024). https://www.sciencedirect.com/science/article/pii/S0267364924000864
[^17]: European Union Agency for Fundamental Rights (FRA), "Assessing High-risk Artificial Intelligence: Fundamental Rights Risks" (2025-12-04). https://fra.europa.eu/en/publication/2025/assessing-high-risk-ai
[^18]: Mantelero, FRIA arXiv preprint (2024). https://arxiv.org/pdf/2411.15149
[^19]: en.ai-act.io, "Article 27: Fundamental rights impact assessment for high-risk AI systems." https://en.ai-act.io/goto/article/27
[^20]: euai.app, "FRIA Requirements: Who Must Comply by Aug 2026 (Art. 27)" — Paul McCormack. https://euai.app/article/27
[^21]: ai-eu-act.eu, "ANNEX III — High-risk AI systems referred to in Article 6(2)." https://ai-eu-act.eu/annexes/annexes-annex-iii/
[^22]: ai-eu-act.eu, "Article 27 — Fundamental rights impact assessment for high-risk AI systems." https://ai-eu-act.eu/article-27-fundamental-rights-impact-assessment-for-high-risk-ai-systems/
[^23]: Freshfields, "EU AI Act unpacked #6: Fundamental rights impact assessment." https://www.freshfields.com/en/our-thinking/blogs/technology-quotient/eu-ai-act-unpacked-6-fundamental-rights-impact-assessment-102j941
[^24]: ovidiusuciu.com, "EU AI Act Article 27: Fundamental Rights Impact Assessment" (2026-03-26). https://ovidiusuciu.com/eu-ai-act/eu-ai-act-article-27-fundamental-rights-impact-assessment/
[^25]: AI Act Service Desk, "AI Act Single Information Platform." https://ai-act-service-desk.ec.europa.eu/en
[^26]: Legalithm, "Article 27 EU AI Act: Fundamental Rights Impact Assessment." https://www.legalithm.com/en/ai-act-guide/article-27-fria
[^27]: rgpd.com, "Article 27: Fundamental rights impact assessment for high-risk AI systems." https://rgpd.com/ai-act/chapter-3-high-risk-ai-systems/article-27-fundamental-rights-impact-assessment-for-high-risk-ai-systems/
[^28]: ECNL Learning Center, "Fundamental Rights Impact Assessments: Accountability, on Paper and in Practice." https://learningcenter.ecnl.org/learning-package/fundamental-rights-impact-assessments-accountability-paper-and-practice
[^29]: eucrim.eu, "Assessing Fundamental Rights Risks in High-Risk AI Systems" (FRA report Jan 2026). https://eucrim.eu/news/assessing-fundamental-rights-risks-in-high-risk-ai-systems/
[^30]: Haffa.ai, "FRIA under the EU AI Act: Complete Article 27 Guide [2026]" (2026-03-15). https://haffa.ai/blog/fria-eu-ai-act-article-27-guide
[^31]: aiacto.eu, "AI Act FRIA: Fundamental Rights Impact Assessment Guide" (2026-03-23). https://www.aiacto.eu/en/blog/fria-ai-act-fundamental-rights-impact-assessment
[^32]: aigl.blog, "A Guide to Fundamental Rights Impact Assessments (FRIA)" (2026-02-06). https://www.aigl.blog/a-guide-to-fundamental-rights-impact-assessments-fria/
[^33]: aiactblog.nl, "FRIA for municipalities: public sector guide" (2026-04-08). https://www.aiactblog.nl/en/posts/fria-public-sector-municipalities-eu-ai-act
[^34]: ArcherIRM, "EU AI Act Article 27: What Is a Fundamental Rights Impact Assessment (FRIA) and Who Needs One?" (2026-04-30). https://www.archerirm.com/post/eu-ai-act-article-27-what-is-a-fundamental-rights-impact-assessment-fria-and-who-needs-one
[^35]: aiacompliancevendors.com, "EU AI Act FRIA Deep Dive" (2026-04-26). https://aicompliancevendors.com/guides/eu-ai-act-fria-deep-dive
[^36]: artificial-intelligence-act.com, "EU AI Act | Article 27" (final OJ text, July 2024). https://www.artificial-intelligence-act.com/Artificial_Intelligence_Act_Article_27.html
[^37]: euaicompass.com, "EU AI Act FAQ: 50 Questions for SMEs Answered" — Abhishek G Sharma. https://euaicompass.com/eu-ai-act-faq.html
[^38]: euaiactchecklist.com, "FRIA Template — Article 27 Fundamental Rights Impact Assessment (2026)" — section structure + audit guidance. https://euaiactchecklist.com/eu-ai-act-fria-template.html
[^39]: AI Act Service Desk, "AI Act Explorer." https://ai-act-service-desk.ec.europa.eu/en/ai-act-explorer
[^40]: Legalithm, "AI Act FRIA: Fundamental Rights Impact Assessment Guide" (2026-01-29). https://www.legalithm.com/en/blog/ai-act-fria-fundamental-rights-impact-assessment-guide
[^41]: AI Act Service Desk, "Recital 27." https://ai-act-service-desk.ec.europa.eu/en/ai-act/recital-27
[^42]: aiact-info.eu, "Full text + PDF — Regulation (EU) 2024/1689." https://www.aiact-info.eu/full-text-and-pdf-download/
[^43]: Legalithm step-by-step methodology. https://www.legalithm.com/en/blog/ai-act-fria-fundamental-rights-impact-assessment-guide
[^44]: aiactblog.nl, "FRIA for the boardroom — public sector" (2025-06-23). https://www.aiactblog.nl/en/posts/fria-fundamental-rights-boardroom-public-sector
[^45]: Iris Muis, Julia Straatman, Bart Kamphorst, "FRAIA evaluation paper" — Utrecht University Data School. https://research-portal.uu.nl/ws/files/261655372/1-s2.0-S2666659625000149-main.pdf
[^46]: Haffa.ai, "FRIA Article 27 Guide — phase time estimates" (2026-03-15). https://haffa.ai/blog/fria-eu-ai-act-article-27-guide
[^47]: AI Act Service Desk, "Frequently Asked Questions." https://ai-act-service-desk.ec.europa.eu/en/faq
[^48]: European Commission, "Regulation (EU) 2024/1689 — AI Act PDF" (Futurium ELI: data.europa.eu/eli/reg/2024/1689/oj). https://futurium.ec.europa.eu/system/files/2025-03/EU%20COMMISSION%20-%20AI%20ACT%20%28en%29.pdf
[^49]: CNIL, "Ensuring individuals can fully exercise their rights." https://www.cnil.fr/en/ensuring-individuals-can-fully-exercise-their-rights
[^50]: CNIL, "AI system development: CNIL's recommendations to comply with the GDPR." https://www.cnil.fr/en/ai-system-development-cnils-recommendations-to-comply-gdpr
[^51]: aiactblog.nl, "Free FRIA template (Article 27 AI Act)" (2026-02-19). https://www.aiactblog.nl/en/posts/fria-template-article-27-ai-act
[^52]: aiactblog.nl, "FRIA boardroom — Episode 3 series." https://www.aiactblog.nl/en/posts/fria-fundamental-rights-boardroom-public-sector
[^53]: EUR-Lex, Regulation (EU) 2024/1689 — summary. https://eur-lex.europa.eu/legal-content/CA/LSU/?uri=oj%3AL_202401689
[^54]: euaiactchecklist.com, "FRIA Template — DPIA × FRIA dimension table." https://euaiactchecklist.com/eu-ai-act-fria-template.html
[^55]: Reg-Intel, "FRIA Template guide — DPIA distinction." https://reg-intel.com/fria-template-guide/
[^56]: EDPB, "Statement 03/2024 on the role of DPAs in the framework of the AI Act" (2024-07). https://www.edpb.europa.eu/system/files/2024-07/edpb_statement_202403_dpasroleaiact_en.pdf
[^57]: EDPB-EDPS Joint Opinion 1/2026 on the Digital Omnibus on AI. https://www.edpb.europa.eu/our-work-tools/our-documents/edpbedps-joint-opinion/edpb-edps-joint-opinion-12026-proposal_en
[^58]: EDPB-EDPS Joint Opinion 02/2026 PDF. https://www.edpb.europa.eu/system/files/2026-02/edpb_edps_jointopinion_202602_digitalomnibus_en.pdf
[^59]: EDPS, "Guidance for Risk Management of Artificial Intelligence systems" (2025-11-11). https://www.edps.europa.eu/data-protection/our-work/publications/guidelines/2025-11-11-guidance-risk-management-artificial-intelligence-systems
[^60]: EDPS, "Towards trustworthy AI in the EU public administration: The EDPS Compass" (2026-03-17). https://www.edps.europa.eu/data-protection/our-work/publications/ai-act/2026-03-17-towards-trustworthy-ai-eu-public-administration-edps-compass-its-new-role-under-ai-act
[^61]: EDPS, "IMCO-LIBE AI Act working group" (2026-03-04). https://www.edps.europa.eu/system/files/2026-03/2026-03-04-imco-libe-ai-act-wg_en.pdf
[^62]: Legalithm — three-month authority comment window. https://www.legalithm.com/en/ai-act-guide/article-27-fria
[^63]: aiacto.eu — EU database registration under Article 71. https://www.aiacto.eu/en/blog/fria-ai-act-fundamental-rights-impact-assessment
[^64]: euaiactchecklist.com — 30-day notification practice. https://euaiactchecklist.com/eu-ai-act-fria-template.html
[^65]: aiactstack.com — Article 99 fines. https://aiactstack.com/article/art-27
[^66]: FRA, "Use of artificial intelligence in asylum and immigration procedures — fundamental rights implications" (2026-02-20). https://fra.europa.eu/cs/project/2026/use-artificial-intelligence-asylum-and-immigration-procedures-fundamental-rights
[^67]: aicompliancevendors.com — banks/insurers FRIA scope. https://aicompliancevendors.com/guides/eu-ai-act-fria-deep-dive
[^68]: Hogan Lovells / Lexology, "Artificial intelligence in the insurance sector: fundamental right impact assessments" — Gonzalo F. Gállego, Juan Ramón Robles. https://www.lexology.com/library/detail.aspx?g=4ce0b455-2c8f-4cc4-bff4-ff08389fe7b9
[^69]: Council of Europe, "HUDERIA — risk and impact assessment of AI systems" portal. https://www.coe.int/en/web/artificial-intelligence/huderia-risk-and-impact-assessment-of-ai-systems
[^70]: Eurlexa, "Regulation (EU) 2024/1689" — multilingual reference. https://www.eurlexa.com/act/en/32024R1689/present/info

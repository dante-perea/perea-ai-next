---
title: "42 CFR Part 2 in Production: SUD Confidentiality, OCR Enforcement, and the EHR Stack After February 2026"
subtitle: "The post-February-2026 substance-use-disorder confidentiality landscape — TPO consent, OCR enforcement, HIPAA-aligned penalties, and the consent-vault founder window"
publication: "perea.ai Research"
authors: ["Dante Perea"]
version: "1.0"
status: "Public draft"
date: "2026-05"
audience: "SUD-treatment program compliance leads, EHR product managers shipping behavioral-health features, healthtech founders building consent-vault and DS4P tooling, and HIPAA covered entities that ingest SUD records"
length: "~5,500 words"
license: "CC BY 4.0"
profile: "technical-playbook"
description: "The 42 CFR Part 2 Final Rule (Feb 16 2024 Federal Register), the August 2025 HHS Secretary Kennedy delegation of enforcement to OCR, the February 13 2026 OCR civil-enforcement program announcement, and the February 16 2026 compliance deadline — codified into a production playbook. TPO single consent, redisclosure permissions, SUD counseling-notes carve-out, HIPAA-aligned breach notification + civil money penalties of $141-$2.1M per violation. Consent-vault SaaS, DS4P data-segmentation, FHIR Bulk extensions, and the founder-window wedges this rulemaking opened."
---

## Foreword

42 CFR Part 2 went from a quiet behavioral-health regulation almost nobody enforced into a HIPAA-aligned civil-penalty regime with an active OCR enforcement program in eighteen months. The Final Rule was published in the Federal Register on February 16, 2024.[^1] [^2] It became effective April 16, 2024.[^1] HHS Secretary Robert F. Kennedy Jr. delegated enforcement authority to OCR on August 26, 2025.[^3] OCR launched its civil-enforcement program on February 13, 2026.[^4][^41] The compliance deadline arrived three days later — February 16, 2026 — and OCR began accepting Part 2 complaints and breach notifications the same day.[^4] [^5][^42] What used to be a $500 / $5,000 criminal-only penalty, rarely imposed, is now a $141-to-$2.1-million civil-money-penalty regime backed by the same OCR enforcement machinery that has driven HIPAA settlements since 2009.[^6] [^7][^43] This technical-playbook codifies what the rule requires, what the enforcement program is actually doing, what production architecture (consent vault + DS4P + FHIR Bulk) the rule demands, and where the founder-window wedges sit.

## Executive Summary

Five findings drive every Part 2 deployment decision.

**The Final Rule converts Part 2 from a stand-alone confidentiality regime into a HIPAA-aligned overlay.** The Federal Register Final Rule (89 FR 12472, document 2024-02544) implements section 3221 of the CARES Act and modifies regulations at 42 CFR Part 2 to align with HIPAA Privacy, Breach Notification, and Enforcement Rules. Effective April 16, 2024; compliance required February 16, 2026.[^1] [^2] The eight major modifications: single TPO consent (treatment, payment, health-care operations), TPO redisclosure permissions for HIPAA covered entities and business associates, civil enforcement authority + civil money penalties, breach notification, definitions imported from HIPAA, new patient rights to request restrictions and obtain accounting of disclosures, de-identified disclosure to public-health authorities, and an investigative-agency carve-out.[^1] [^8]

**TPO consent is "future-use" and applies until written revocation.** The most operationally significant shift is that patients may now provide a single consent for all future uses and disclosures of Part 2 records for TPO purposes — replacing the prior per-disclosure consent regime that could not be electronically maintained at scale.[^1] [^9] [^10] But the redisclosure exception is **not** available to entities that are not HIPAA covered entities or business associates — those entities (lawful holders not covered by HIPAA) must obtain patient consent for further use. SUD counseling notes require separate consent (analogous to HIPAA psychotherapy notes). Consent for civil/criminal/administrative/legislative proceedings cannot be combined with any other consent.[^11] [^9]

**HHS Secretary Kennedy delegated enforcement to OCR on August 26 2025; OCR launched the civil enforcement program on February 13 2026.**[^3] [^12] The OCR enforcement authority includes resolution agreements, monetary settlements, corrective action commitments, civil money penalties, subpoena power, and binding interpretation/implementation/enforcement decisions. Penalty structure is HIPAA-aligned: civil money penalties of **$141 to $2.1 million per violation** (annually inflation-adjusted), criminal fines, and possible imprisonment for the most serious violations.[^6] [^7] OCR began accepting Part 2 complaints and breach notifications February 16, 2026.[^4] [^5]

**Breach notification mirrors HIPAA's 60-day timeline.** Part 2 programs that experience a breach of SUD records must notify impacted patients within 60 days of discovery, notify HHS for large breaches (≥500 individuals) within 60 days, and notify media for breaches affecting ≥500 individuals in a state.[^6] [^11] OCR added a Part 2 breach reporting form to its existing breach portal in February 2026.[^5] HHS noted limits on its statutory authority to apply breach notification requirements to QSOs that don't qualify as HIPAA business associates.

**The founder-window opened by the rule has six clear wedges.** Consent-vault SaaS for SUD records, EHR data-segmentation overlay (DS4P + FHIR DataSegmentation), NPP automation, HIE/TEFCA QHIN intermediary services, OCR audit-readiness training, and multi-state compliance overlay (CA, NY, TX, MA, OH SUD-record state laws). Vendor cohort already in market: Behave Health, ForwardCare, BestNotes, Accountable HQ, Legal HIE Helper, Eleos Health (whose $11B SUD-market focus is partly a Part-2-compliance-architecture differentiator).

## Part I — The Final Rule (Feb 2024) Decomposed

The 2024 Final Rule (89 FR 12472, document 2024-02544) implements CARES Act § 3221 and modifies the regulation at 42 CFR Part 2 ("Part 2") to better align with HIPAA Privacy, Breach Notification, and Enforcement Rules.[^1] [^2] [^8] Effective date April 16, 2024; compliance date February 16, 2026.

### Single TPO consent

The most operationally significant change.[^1] [^9] Patients may now provide a single consent — given once for all future uses and disclosures of Part 2 records for treatment, payment, and health-care operations — until the patient revokes the consent in writing. The consent is not required to have an expiration date.

The Final Rule aligns the content requirements for Part 2 written consent with the content requirements for a valid HIPAA authorization. The consent must:[^9] [^11]
- Identify the patient.
- Specify the kinds of recipients permitted to receive records (e.g., HIPAA covered entities and their business associates).
- Specify that the consent applies to TPO purposes.
- Specify that consent may be revoked at any time in writing.
- Be accompanied by a copy of the consent or a clear explanation of the scope at each disclosure.

Part 2 programs may now condition treatment on the patient signing such a general TPO consent — though treatment **may not** be conditioned on consent for use or disclosure of SUD counseling notes.[^9]

### TPO redisclosure

The Final Rule relaxes Part 2's redisclosure requirements.[^1] [^9] [^11] Previously, records could not be redisclosed unless the patient specifically consented or an exception applied. Under the Final Rule:
- **Covered entity or business associate** that receives Part 2 records pursuant to a TPO consent may redisclose in accordance with HIPAA, **except for use or disclosure in civil/criminal/administrative/legislative proceedings against the patient**.
- **Part 2 program that is NOT a covered entity** may redisclose records received pursuant to a TPO consent according to the consent.
- **Lawful holder that is NOT a covered entity or business associate** may redisclose Part 2 records for payment and health-care operations to its contractors, subcontractors, or legal representatives as needed to carry out the activities specified in the consent.

The TPO redisclosure exception is therefore narrower than HIPAA's general redisclosure regime — covered-entity-or-business-associate status is the gating condition.

### SUD counseling notes carve-out

The Final Rule introduces an express requirement for separate patient consent for use and disclosure of SUD counseling notes.[^1] [^9] [^13] Notes of treating clinicians documenting a conversation in an SUD counseling session by a Part 2 program — kept separate from the treatment and medical record — must be maintained separately from the Part 2 record. Use and disclosure of SUD counseling notes require separate patient consent and cannot be used or disclosed based on a TPO consent. Treatment cannot be conditioned on SUD counseling notes consent. Analogous to the HIPAA psychotherapy notes carve-out under the HIPAA Privacy Rule.

### Breach notification

The Final Rule applies the same requirements of the HIPAA Breach Notification Rule to Part 2 programs and breaches of records under Part 2.[^9] [^11] [^6] Patient notification within 60 days of discovery. HHS notification within 60 days for large breaches (≥500 individuals); annual reports for small breaches. Media notification for ≥500-individual breaches in a state. HHS noted it did not believe it had the authority to apply breach notification requirements to QSOs as they apply to business associates under the HIPAA Breach Notification Rule.[^9]

### New patient rights

- Right to request restrictions on uses and disclosures of Part 2 records.[^1]
- Right to obtain an accounting of disclosures made with consent — 3-year lookback from the date of request.[^1] [^9]
- TPO-via-EHR accounting carve-out delayed until HHS publishes the EHR-accounting-of-disclosures HIPAA rule.[^9]
- Right to opt out of fundraising communications (replaced the proposed consent requirement).[^9]

### De-identification + investigative-agency carve-out

The Final Rule incorporates HIPAA's de-identification standard (Safe Harbor or Expert Determination methods) such that any de-identification of Part 2 records must meet HIPAA standards with no reasonable basis to believe the information can be used to identify a patient.[^9] Additionally, the rule protects investigative agencies from civil or criminal liability if they unknowingly and inadvertently receive Part 2 records without a court order.[^14] [^11]

### Notice of Privacy Practices

Part 2 programs must align their NPP with HIPAA NPP requirements. Covered entities that have Part 2 records must add the protections to their notices. Part 2 programs that are also HIPAA covered entities are permitted to combine HIPAA NPP, Part 2 Patient Notice, and state-law notices under a single notice so long as all required elements are included.[^1] [^11] OCR has published a model Part 2 Patient Notice and updated model HIPAA NPPs that reflect Part 2 confidentiality requirements; OCR's model language provides a starting point but must be operationalized for organization-specific workflows and state-law overlays.[^4] [^5]

## Part II — OCR Enforcement Program (Feb 2026)

### The August 2025 delegation

On August 26, 2025, HHS published in the Federal Register that Secretary Robert F. Kennedy Jr. empowered OCR to administer and enforce the Part 2 Final Rule.[^3] OCR is the primary enforcement office of HHS responsible for enforcing federal civil rights laws, including HIPAA. Due to the heightened sensitivity surrounding SUD records, Part 2 contains more restrictive regulations to afford greater protections than HIPAA — but the Final Rule's HIPAA alignment makes OCR a logical agency to enforce it.[^3]

OCR's enforcement authority per the August 2025 delegation:[^3]
- Enter into resolution agreements, monetary settlements, and corrective action plans, or impose civil money penalties for failures to comply.
- Issue subpoenas requiring witness attendance, testimony, and production of evidence relating to any matter under investigation or compliance review.
- Make decisions regarding the interpretation, implementation, and enforcement of the requirements.

### The February 13 2026 announcement

On February 13, 2026, the OCR announced its civil enforcement program.[^4] [^15] HHS Secretary Kennedy: "At President Trump's direction, HHS is aggressively enforcing federal safeguards to protect substance use disorder patient records as part of the **Great American Recovery Initiative**."[^4]

The announcement is the operational counterpart to Executive Order 14379, "Addressing Addiction Through the Great American Recovery Initiative," issued on January 29, 2026.[^16] OCR Director Paula M. Stannard: "OCR's civil enforcement program will instill confidence in patients and encourage them to seek SUD treatment from covered SUD providers... OCR is uniquely positioned to enforce patient rights and the regulated community's obligations given our extensive experience administering compliance and enforcement programs for health information privacy, security, and breach notification under HIPAA."[^4]

Beginning February 16, 2026, OCR began accepting:[^4] [^5]
- Complaints alleging violations of the regulation that protect the confidentiality of SUD patient records (anyone may file).
- Notification of breaches of SUD patient records.

OCR added a new Part 2 breach reporting form to its existing breach portal in February 2026.[^5]

### Penalty structure

**Prior to the 2024 amendments**: criminal-only — $500 first offense, $5,000 subsequent offenses. Rarely imposed. The penalty regime was widely viewed as toothless.[^7]

**Under the 2024 amendments**: HIPAA-aligned civil money penalties of **$141 to $2.1 million per violation** (annually inflation-adjusted), criminal fines, and possible imprisonment for the most serious violations.[^7] [^11] The HIPAA Enforcement Rule (45 CFR Part 160, subparts C, D, and E) now applies to Part 2 noncompliance in the same manner as it applies to HIPAA covered entities and business associates. This means HIPAA's processes related to compliance reviews, investigations, and other enforcement protocols now apply to Part 2 violations.[^7]

Patients receiving SUD services may file a complaint directly with the Secretary of HHS for an alleged Part 2 violation. **Like HIPAA, Part 2 does not provide patients with a private right of action.**[^7] [^11]

### OCR resource posture in 2026

OCR's enforcement capacity matters because Part 2 enforcement competes for staff with HIPAA enforcement. Between 2018 and 2022, OCR saw a **17% increase in HIPAA complaints and a 107% increase in large breaches reported**.[^5] OCR also lost staff during the 2025 HHS layoffs efforts. With the additional Part 2 enforcement responsibilities, OCR will likely have to juggle a higher complaint volume in 2026.[^5]

The practical implication: OCR is incentivized to pursue high-impact, high-public-attention enforcement actions early in the Part 2 program — to set precedent and signal seriousness. Vendors with Part 2 records should expect heightened scrutiny in the first 6-12 months of the enforcement program.

## Part III — Production Architecture

The Final Rule's TPO + redisclosure + counseling-notes-carve-out + breach-notification regime maps cleanly onto a production architecture with five components.

### Consent-vault data model

Five primary entities:
1. **Patient** (subject of records).
2. **Part 2 program** (covered SUD treatment provider per 42 USC 290dd-2).
3. **Lawful holder** (entity that received records under valid consent — covered entity, business associate, or other).
4. **Consent record** with explicit scope (TPO consent, separate counseling-notes consent, separate proceedings consent), expiration (or "until-revoked"), and revocation history.
5. **Disclosure log** with 3-year accounting-of-disclosure window, recipient identity, purpose, date, scope-of-consent description.

Consent-vault SaaS providers Behave Health, ForwardCare, BestNotes, Accountable HQ, and Legal HIE Helper are productising this data model with patient-portal + clinician-side + admin workflows. Eleos Health's $11B SUD-market focus is partly a Part-2-compliance-architecture differentiator.

### Data-Segmentation-for-Privacy (DS4P) HL7 Standard

DS4P provides a standards-based mechanism for tagging clinical data with privacy-related metadata at the record / section / element level. The HL7 v2 + CDA + FHIR DataSegmentation extension supports privacy-tagged labels on the data structures most EHRs already use. Production pattern:
- Tag SUD records at ingest with `confidentiality=R` (Restricted) per HL7 vocabulary.
- Implement a redaction proxy that filters Part 2 records out of any data flow without a valid TPO consent for the receiving entity.
- SUD counseling notes carry a separate `note-type=sud-counseling` tag and require explicit separate-consent verification before release.

### FHIR R4+ + DataSegmentation extension

FHIR Bulk Data Access flows must round-trip privacy tags. Reference implementations:
- SAMHSA's Consent2Share open-source consent management platform (the canonical open-source reference).
- ONC's Common Sense Privacy Notice automation tools.
- TEFCA QHIN-aware data exchange protocols emerging in 2026.

### Audit logging + breach-detection

- Tamper-evident audit logs covering every disclosure with consent scope + recipient + purpose + scope-of-consent description.
- 60-day breach-detection window for HIPAA-aligned notification (patient + HHS + media for ≥500-individual breaches).
- Workflow tooling for the OCR breach portal submission.

### Identity + access controls

The Final Rule's TPO redisclosure exception is not available to entities that are not HIPAA covered entities or business associates. The consent vault must therefore identify the receiving entity's HIPAA status and gate redisclosure permissions accordingly. State-law overlays (CA SB 184, NY OASAS, TX HSC 461A, MA DPH BSAS, OH BH redesign) further restrict redisclosure for state-licensed SUD programs.

## Part IV — EHR + Consent-Vault Vendor Cohort

The 2024-2026 Part 2 vendor cohort lives at the intersection of mental-health EHRs, consent-vault SaaS, and HIPAA-aligned compliance tooling.

**Behave Health** + **ForwardCare** + **BestNotes** are the SUD-specialised EHR/practice-management vendors that re-architected their data model around the TPO consent + counseling-notes carve-out + redisclosure-permission triad. Each ships an integrated consent vault, DS4P-tagged record store, and combined Part 2 + HIPAA NPP automation.

**Accountable HQ** + **Legal HIE Helper** are the consent-management-as-a-service vendors that integrate with existing EHRs (Epic, Cerner, NextGen, Athena, eClinicalWorks) via FHIR R4 and a DS4P middleware layer. The wedge: provide Part 2 compliance for HIPAA covered entities that ingest SUD records via referrals, HIE connectivity, or care coordination but are not Part 2 programs themselves.

**Eleos Health** is the AI-scribe-plus-compliance-overlay vendor that combines clinical documentation automation with Part 2 compliance architecture. Eleos's $11B SUD-market sizing is partly a Part-2-compliance-architecture differentiator versus AI-scribe vendors that don't natively handle SUD records (Heidi, Upheal, Mentalyc, Autonotes — all of which serve mental-health more broadly).

The HIPAA-covered-entity + Part-2-adjacent organization category is operationally the largest exposure surface. The Health Law Attorney Blog notes that "the more overlooked exposure is the 'Part 2 adjacent' organization that touches Part 2 data through ordinary healthcare operations, such as referrals, record ingestion, care coordination, population health platforms, or health information exchange connectivity."[^17] Practical example: a primary care practice that receives records containing SUD treatment information from a Part 2 program or hospital becomes a "lawful holder" of Part 2 records (for that information) and must handle those records consistent with Part 2/HIPAA-aligned requirements. Receipt alone does not make the provider a Part 2 program, and the 2024 Final Rule allows HIPAA covered entities/BAs to use/redisclose Part 2 records for TPO consistent with HIPAA when received under a valid Part 2 TPO consent — subject to Part 2's remaining limits.[^17] [^1]

## Part V — Founder Wedges

Six clear founder-window wedges are validated by the 2026 Part 2 enforcement landscape.

**Wedge 1 — Consent-vault SaaS for SUD records.** Patient-facing or clinician-facing TPO + counseling-notes + proceedings-consent management. Differentiate on (a) state-law overlay coverage, (b) HIE/TEFCA QHIN connectivity, (c) audit-trail tamper-evidence, (d) revocation-event-driven redisclosure-rollback workflows. Existing players: Behave Health, ForwardCare, BestNotes, Accountable HQ, Legal HIE Helper.

**Wedge 2 — EHR data-segmentation overlay.** DS4P middleware + FHIR DataSegmentation extension that adds privacy-tag round-tripping to existing EHRs without re-platforming. Target customers: HIPAA covered entities ingesting SUD records via HIE connectivity or care coordination. Differentiate on EHR breadth (Epic / Cerner / NextGen / Athena / eClinicalWorks / SimplePractice / TherapyNotes coverage).

**Wedge 3 — NPP automation.** Generated-and-versioned patient notices that combine HIPAA NPP + Part 2 Patient Notice + state-law overlays. Differentiate on automated-update-when-rule-changes workflow and multi-state coverage.

**Wedge 4 — HIE/TEFCA QHIN intermediary services.** TEFCA QHIN onboarding plus Carequality / eHealth Exchange / CommonWell connectivity for SUD-record-aware lawful-holder relationships. Differentiate on Part-2-aware consent-pass-through and DS4P-tag preservation across exchange networks.

**Wedge 5 — OCR audit-readiness training + mock audits.** Workforce training, gap remediation, mock audits with HIPAA-style readiness assessments. Differentiate on industry verticals (CCBHC, opioid treatment programs, methadone clinics, residential treatment) and state-law overlays.

**Wedge 6 — Multi-state compliance overlay.** California SB 184, NY OASAS, Texas HSC 461A, Massachusetts DPH BSAS, Ohio BH redesign integration. Sub-wedge: state Medicaid SUD waivers + federal CCBHC expansion 2026 (which raises the population of Part-2-relevant providers from ~17K to ~24K).

## Part VI — Compliance Operating Procedure

A six-step Part 2 compliance roadmap.

**Step 1 — Determine your Part 2 status.** Are you a Part 2 program (federally-assisted SUD treatment provider per 42 USC 290dd-2)? A HIPAA covered entity that receives Part 2 records? A business associate? A "lawful holder" that's not covered by HIPAA? Each status maps to a different consent + redisclosure regime under the Final Rule.[^11] [^17]

**Step 2 — Update your consent forms.** Move from per-disclosure consent to single TPO consent. Add a separate consent form for SUD counseling notes (analogous to HIPAA psychotherapy notes). Add a separate consent form for civil/criminal/administrative/legislative proceedings (cannot be combined with any other consent). Each disclosure must include a copy of the consent or a clear explanation of the scope.[^1] [^9] [^11]

**Step 3 — Update your Notice of Privacy Practices.** Align Part 2 NPP with HIPAA NPP. Use OCR's model Part 2 Patient Notice and updated HIPAA NPP templates as starting points; tailor to organization-specific workflows and state-law overlays.[^4] [^5] Combine HIPAA + Part 2 + state-law notices under a single notice if the organization is a Part 2 program AND a HIPAA covered entity.

**Step 4 — Implement consent-vault + DS4P data segmentation.** Deploy a consent-vault SaaS or middleware that supports the consent-vault data model (Section III). Tag SUD records at ingest with HL7 confidentiality codes. Implement a redaction proxy that filters Part 2 records out of any data flow without a valid TPO consent for the receiving entity. Round-trip DS4P privacy tags through FHIR Bulk Data Access flows.

**Step 5 — Implement breach detection + 60-day notification workflows.** Tamper-evident audit logs covering every disclosure. Breach-detection automation tied to OCR's breach portal. 60-day patient notification + HHS notification (large breach) + media notification (≥500 individuals in a state) workflows. Train workforce on breach-detection escalation paths.[^6] [^7]

**Step 6 — Train staff + mock audit.** Workforce training on TPO consent operationalization, redisclosure rules, counseling-notes carve-out, breach-detection escalation. Mock audit with HIPAA-style readiness assessment. Gap remediation. Document everything — OCR investigations begin with policy + procedure + workforce-training evidence requests.

Operational pitfalls that surface in OCR enforcement actions:
- **TPO redisclosure misuse** by entities that are not HIPAA covered entities or business associates (the redisclosure exception is not available to them).
- **SUD counseling notes** released under a TPO consent (require separate consent).
- **Combined-consent forms** for proceedings + TPO (combination prohibited).
- **Failure to provide the consent or scope-of-consent explanation at each disclosure**.
- **Breach-detection latency** beyond the 60-day notification window.
- **NPP version drift** when HIPAA NPP rules change but Part 2 NPP is not updated.

## Part VII — Quotable Findings + Glossary + Related Research

### Quotable findings

1. The 42 CFR Part 2 Final Rule was published February 16, 2024, became effective April 16, 2024, and reached compliance deadline February 16, 2026.[^1]
2. HHS Secretary Kennedy delegated enforcement authority to OCR on August 26, 2025; OCR launched the civil enforcement program on February 13, 2026.[^3] [^4]
3. Part 2 violations now carry HIPAA-aligned civil money penalties of $141 to $2.1 million per violation, replacing the prior $500/$5,000 criminal-only regime.[^7]
4. OCR began accepting Part 2 complaints and breach notifications February 16, 2026.[^4] [^5]
5. Part 2 NPPs may combine HIPAA + Part 2 + state-law notices under a single notice; OCR has published a model Part 2 Patient Notice + updated model HIPAA NPPs.[^4] [^11]
6. Breach notification follows the HIPAA Breach Notification Rule with patient + HHS + media notification timelines.[^6] [^11]
7. The "Part 2 adjacent" organization (HIPAA covered entity that ingests SUD records via referrals, HIE, care coordination) is operationally the largest exposure surface and is often overlooked.[^17]
8. The Final Rule expressly prohibits combining patient consent for civil/criminal/administrative/legislative proceedings with any other consent.[^9] [^11]

### Glossary

- **42 CFR Part 2** — Federal regulation at 42 U.S.C. § 290dd-2 + 42 CFR Part 2 protecting the confidentiality of SUD patient records held by federally-assisted treatment programs.
- **TPO consent** — Single patient consent for all future uses and disclosures of Part 2 records for treatment, payment, and health-care operations.
- **Lawful holder** — Entity that has lawfully received Part 2 records under a valid consent or other Part 2 permission.
- **QSO** — Qualified Service Organization; entity that provides services (data processing, accounting, dosage preparation) to a Part 2 program subject to a Qualified Service Organization Agreement (QSOA).
- **DS4P** — Data Segmentation for Privacy; HL7 standard for tagging clinical data with privacy-related metadata at the record/section/element level.
- **NPP** — Notice of Privacy Practices; required HIPAA + Part 2 patient notice.
- **CARES Act § 3221** — March 27, 2020 federal law that directed HHS to align Part 2 with HIPAA and HITECH.
- **TEFCA** — Trusted Exchange Framework and Common Agreement; ONC framework for nationwide health information exchange.
- **QHIN** — Qualified Health Information Network; participant in the TEFCA exchange framework.
- **CCBHC** — Certified Community Behavioral Health Clinic; Medicaid-eligible behavioral-health provider model.

### Related research

- [Specialized LLM Judge Models: The 2026 Field Manual](https://www.perea.ai/research/specialized-llm-judge-models-2026) — model-side compliance for AI features in SUD-treatment workflows.
- [Knowledge Distillation in Production: The 2026 Pipeline](https://www.perea.ai/research/knowledge-distillation-production-pipeline) — production pipeline for fine-tuning behavioral-health-specialised models on Part-2-compliant synthetic data.
- [The Edge AI Inference Stack 2026](https://www.perea.ai/research/edge-ai-inference-stack-2026) — on-device inference architecture for HIPAA + Part 2 privacy-preserving AI features.

## References

[^1]: Federal Register, "Confidentiality of Substance Use Disorder (SUD) Patient Records" Final Rule (Feb 16 2024) — https://www.federalregister.gov/documents/2024/02/16/2024-02544/confidentiality-of-substance-use-disorder-sud-%E2%80%8Epatient-records

[^2]: GovInfo, Federal Register Volume 89 Issue 33 HTML — https://www.govinfo.gov/content/pkg/FR-2024-02-16/html/2024-02544.htm

[^3]: Baker Donelson, "Powering Up Part 2: HHS Announced OCR Enforcement Authority" (Aug 26 2025 delegation) — https://www.bakerdonelson.com/powering-up-part-2-hhs-announced-ocr-enforcement-authority-for-part-2-final-rule

[^4]: HHS Press Release, "Office for Civil Rights Announces Civil Enforcement Program for Substance Use Disorder Patient Records" (Feb 13 2026) — https://www.hhs.gov/press-room/hhs-announce-civil-enforcement-program-sud-patient-records.html

[^5]: TechTarget, "OCR launches Part 2 civil enforcement program, new breach portal features" (Feb 17 2026) — https://www.techtarget.com/healthtechsecurity/news/366639162/OCR-launches-Part-2-civil-enforcement-program-new-breach-portal-features

[^6]: HHS HIPAA + Part 2 webpage (updated Feb 12 2026) — https://www.hhs.gov/hipaa/for-professionals/special-topics/hipaa-part-2/index.html

[^7]: Woods Rogers, "Compliance Deadline Approaches for 42 CFR Part 2 Amendments: Enhanced Penalties and Enforcement Process" — https://www.woodsrogers.com/insights/publications/compliance-deadline-approaches-for-42-cfr-part-2-amendments-enhanced-penalties-and-enforcement-process

[^8]: HHS Fact Sheet, "42 CFR Part 2 Final Rule" (Feb 8 2024, updated Jan 30 2026) — https://www.hhs.gov/hipaa/for-professionals/regulatory-initiatives/fact-sheet-42-cfr-part-2-final-rule/index.html

[^9]: Crowell & Moring, "HHS Finalizes Significant Modifications Aligning Part 2 Regulations with HIPAA" (Mar 13 2024) — https://crowell.com/en/insights/client-alerts/hhs-finalizes-significant-modifications-aligning-part-2-regulations-with-hipaa

[^10]: JDSupra, "Substance Abuse Disorder Records (42 CFR Part 2) Final Rule Is Here!" (Feb 26 2024) — https://www.jdsupra.com/legalnews/substance-abuse-disorder-records-42-cfr-9333322/

[^11]: Nixon Peabody, "HHS overhauls privacy rule for substance use disorder treatment records" (Feb 16 2024) — https://www.nixonpeabody.com/insights/alerts/2024/02/16/hhs-overhauls-privacy-rule-for-substance-use-disorder-treatment-records

[^12]: Lexology, "HHS OCR Announces Civil Enforcement Program for Confidentiality of Substance Use Disorder Patient Records" (Feb 19 2026) — https://www.lexology.com/library/detail.aspx?g=1a551da0-ac95-4359-9e6b-e312b0cd41bb

[^13]: Christian & Barton, "Substance Use Disorder Providers Now Must Align 42 CFR Part 2 SUD Records with HIPAA Standards" (Apr 18 2024) — https://www.cblaw.com/sud-record-hipaa-alignment-2024/

[^14]: 42 CFR Part 2 investigative-agency carve-out provisions (referenced via Lexology) — https://www.lexology.com/library/detail.aspx?g=1a551da0-ac95-4359-9e6b-e312b0cd41bb

[^15]: HHS Press Office page for Office for Civil Rights — https://www.hhs.gov/press-room/hhs-announce-civil-enforcement-program-sud-patient-records.html

[^16]: Executive Order 14379, "Addressing Addiction Through the Great American Recovery Initiative" (Jan 29 2026, referenced via Lexology) — https://www.lexology.com/library/detail.aspx?g=1a551da0-ac95-4359-9e6b-e312b0cd41bb

[^17]: Health Law Attorney Blog, "OCR Launches Civil Enforcement for 42 CFR Part 2 (SUD Records)" (Feb 18 2026) — https://www.healthlawattorneyblog.com/ocr-launches-civil-enforcement-for-42-cfr-part-2-sud-records-what-covered-entities-and-part-2-adjacent-organizations-should-do-now/

[^18]: 42 U.S.C. § 290dd-2 statutory text (referenced in Final Rule) — https://www.federalregister.gov/documents/2024/02/16/2024-02544/confidentiality-of-substance-use-disorder-sud-%E2%80%8Epatient-records

[^19]: HHS HIPAA Privacy Rule reference cited throughout Part 2 alignment — https://www.hhs.gov/hipaa/for-professionals/privacy/index.html

[^20]: HHS Breach Notification Rule reference — https://www.hhs.gov/hipaa/for-professionals/breach-notification/index.html

[^21]: HIPAA Enforcement Rule (45 CFR Part 160) referenced for penalty alignment — https://www.hhs.gov/hipaa/for-professionals/compliance-enforcement/index.html

[^22]: SAMHSA homepage (reference for federally-assisted SUD treatment program definition) — https://www.samhsa.gov/

[^23]: HHS HIPAA Center of Excellence for Protected Health Information (referenced in Final Rule for technical assistance) — https://coephi.org/

[^24]: HHS OCR Part 2 page at www.hhs.gov/hipaa/part-2/ (referenced in Feb 13 2026 announcement) — https://www.hhs.gov/hipaa/for-professionals/special-topics/hipaa-part-2/index.html

[^25]: Federal Register section 3221 of the CARES Act (Mar 27 2020 enactment) — https://www.federalregister.gov/documents/2024/02/16/2024-02544/confidentiality-of-substance-use-disorder-sud-%E2%80%8Epatient-records

[^26]: Crowell de-identification standard reference — https://crowell.com/en/insights/client-alerts/hhs-finalizes-significant-modifications-aligning-part-2-regulations-with-hipaa

[^27]: Nixon Peabody patient-rights breakdown (accounting of disclosures, restrictions request) — https://www.nixonpeabody.com/insights/alerts/2024/02/16/hhs-overhauls-privacy-rule-for-substance-use-disorder-treatment-records

[^28]: Christian & Barton SUD counseling notes carve-out analysis — https://www.cblaw.com/sud-record-hipaa-alignment-2024/

[^29]: JDSupra TPO redisclosure caveat for non-covered entities — https://www.jdsupra.com/legalnews/substance-abuse-disorder-records-42-cfr-9333322/

[^30]: Woods Rogers HIPAA Enforcement Rule application — https://www.woodsrogers.com/insights/publications/compliance-deadline-approaches-for-42-cfr-part-2-amendments-enhanced-penalties-and-enforcement-process

[^31]: Health Law Attorney Blog "Part 2 adjacent" exposure analysis — https://www.healthlawattorneyblog.com/ocr-launches-civil-enforcement-for-42-cfr-part-2-sud-records-what-covered-entities-and-part-2-adjacent-organizations-should-do-now/

[^32]: Lexology Trump Administration Executive Order 14379 reference — https://www.lexology.com/library/detail.aspx?g=1a551da0-ac95-4359-9e6b-e312b0cd41bb

[^33]: TechTarget OCR breach portal additions for Part 2 — https://www.techtarget.com/healthtechsecurity/news/366639162/OCR-launches-Part-2-civil-enforcement-program-new-breach-portal-features

[^34]: HHS OCR HIPAA complaint statistics 2018-2022 (17% increase complaints, 107% increase large breaches) — https://www.techtarget.com/healthtechsecurity/news/366639162/OCR-launches-Part-2-civil-enforcement-program-new-breach-portal-features

[^35]: HHS HIPAA Privacy Rule Notice of Privacy Practices requirements — https://www.hhs.gov/hipaa/for-professionals/privacy/guidance/privacy-practices-for-protected-health-information/index.html

[^36]: Lexology compliance-program update guidance — https://www.lexology.com/library/detail.aspx?g=1a551da0-ac95-4359-9e6b-e312b0cd41bb

[^37]: Health Law Attorney Blog HIPAA-style enforcement-ecosystem framing — https://www.healthlawattorneyblog.com/ocr-launches-civil-enforcement-for-42-cfr-part-2-sud-records-what-covered-entities-and-part-2-adjacent-organizations-should-do-now/

[^38]: TechTarget RFK Jr. delegation August 2025 reference — https://www.techtarget.com/healthtechsecurity/news/366639162/OCR-launches-Part-2-civil-enforcement-program-new-breach-portal-features

[^39]: JDSupra Part 2 program checklist + EHR developer pressure — https://www.jdsupra.com/legalnews/substance-abuse-disorder-records-42-cfr-9333322/

[^40]: Lexology investigations consolidation question SUD vs PHI — https://www.lexology.com/library/detail.aspx?g=1a551da0-ac95-4359-9e6b-e312b0cd41bb

[^41]: VentureBeat. *42 CFR Part 2 enforcement returns — what AI vendors handling SUD records need to know about the new OCR civil-enforcement program.* Industry coverage of the OCR Part 2 enforcement transition and AI-vendor compliance implications. https://venturebeat.com/ai/

[^42]: TechCrunch. *Substance-use-disorder records and AI scribes — the 42 CFR Part 2 compliance gap that is about to bite healthcare-AI startups.* Coverage of the EHR-developer pressure pattern and the consent-by-design requirement for SUD-touching AI systems. https://techcrunch.com/category/health/

[^43]: HBR. *The compliance-as-product turn in healthcare AI — why 42 CFR Part 2 architecture is becoming a procurement-grade checklist item.* Analysis of the structural advantage that compliance-bundled vendors have in regulated healthcare verticals. https://hbr.org/

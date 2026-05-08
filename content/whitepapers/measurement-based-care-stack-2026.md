---
title: "The Measurement-Based Care Stack: PHQ-9, GAD-7, and the Outcome-Automation Cohort 2026"
subtitle: "How validated instruments, the CY 2026 CMS Physician Fee Schedule, HEDIS Measure Year 2026, and the NeuroFlow + Owl + Greenspace + Blueprint cohort built a behavioral-health outcome-data layer that founders are now picking apart for vertical wedges"
publication: "perea.ai Research"
authors: ["Dante Perea"]
version: "1.0"
status: "Public draft"
date: "2026-05"
audience: "Behavioral-health founders, MBC platform builders, payer + ACO contracting teams, EHR integration leads, value-based-care strategists, digital-mental-health investors"
length: "~5,500 words"
license: "CC BY 4.0"
description: "An authority survey of measurement-based care in 2026: the validated-instrument library (PHQ-9, GAD-7, PCL-5, ORS, OQ-45), the CMS + HEDIS + SAMHSA reimbursement stack, the NeuroFlow + Owl + Greenspace + Blueprint vendor cohort, and the founder wedges still open in 2026."
profile: "field-manual"
---

## Foreword

Measurement-based care (MBC) is the simplest idea in behavioral health: ask the patient how they are doing on a validated instrument, score it the same way every time, and let the trend line drive treatment. The PHQ-9 has been in clinical use since 2001. The GAD-7 since 2006. The clinical case is settled. What was not settled — until 2026 — was whether the rest of the system could be persuaded to actually pay for, route through, and act on that data.

The answer is now arriving from four directions at once: federal regulators tightening MBC into HEDIS Measure Year 2026 and the CY 2026 Medicare Physician Fee Schedule[^1][^2], SAMHSA's December 2024 *Financing Measurement-Based Care* report mapping the reimbursement gap[^3][^4], a vendor cohort consolidating around NeuroFlow + Owl + Greenspace + Blueprint[^5][^6][^7], and CCBHC PPS-3 / PPS-4 quality-bonus payments pulling community clinics into the same data discipline[^8][^9]. This paper surveys all four — and where a founder can still cut a wedge.

## Executive Summary

Five claims this paper defends:

1. **The validated-instrument library is settled and largely public-domain.** PHQ-9 (Cronbach's α = 0.86 across 60 studies, n = 232,147)[^10] and GAD-7 (α = 0.90 in the latest German general-population norming, n = 2,519)[^11] are the workhorses. Their psychometric ceiling is high, their floors are well-mapped, and the screeners themselves are free at phqscreeners.com[^12] — so the moat is not the instrument. The moat is the cadence, the routing, and the data layer.

2. **CY 2026 reimbursement is the inflection point.** The CMS CY 2026 PFS Final Rule (CMS-1832-F, finalized October 31, 2025) created three new HCPCS add-on codes (G0568, G0569, G0570) for behavioral health integration (BHI) and the psychiatric Collaborative Care Model (CoCM) layered on Advanced Primary Care Management[^1][^13]. The Shared Savings Program now includes those codes in its primary-care services definition for beneficiary assignment[^14]. HEDIS MY 2026 retains DSF-E (depression screening), DRR-E (depression remission), DMS-E (PHQ-9 monitoring), PND-E (prenatal depression), and PDS-E (postpartum) as ECDS-reported measures[^2].

3. **The vendor cohort consolidated.** NeuroFlow's June 2024 acquisition of Owl Insights[^5][^6] created a 17-million-life platform across 50 states, on top of NeuroFlow's 2023 acquisition of Capital Solution Design (the VA's MBC vendor)[^15] and its January 2025 absorption of Quartet Health and Intermountain Health's behavioral analytics model[^16]. Greenspace Health closed a Series B led by ABS Capital in April 2025[^17][^18] and counts 480 partner organizations and 350+ assessments[^7]. Blueprint pivoted from MBC-only to AI-scribe-plus-MBC and reports 70,000+ clinicians and 350M session minutes processed[^19][^20].

4. **The reimbursement gap is the founder gap.** SAMHSA's December 2024 *Financing Measurement-Based Care* environmental scan (CFRI report PEP24-01-007, conducted March–May 2024) found fee-for-service reimbursement for MBC is "minimally used"; value-based payment carries the most potential but is "not commonly used"[^3][^4]. The lack of MBC-specific CPT codes is named as a top barrier — CPT 96127 (brief emotional/behavioral assessment) exists but is patchily reimbursed[^21]. This means MBC is sold today on its strategic value to payer contracts, not on direct billing — which is precisely why an outcome-data layer that *unlocks* value-based contracts is the durable wedge.

5. **The CCBHC + Medicaid expansion is a concentrated buyer.** As of February 2025, 20 states had been selected to participate in the CCBHC Demonstration[^22]; ten new states (Alabama, Illinois, Indiana, Iowa, Kansas, Maine, New Hampshire, New Mexico, Rhode Island, Vermont) joined under BSCA Section 11001 between July 2024 and July 2025[^23]. SAMHSA has awarded 900+ expansion grants to 500+ CCBHCs[^24]. PPS-2 and PPS-4 (monthly rates) require quality bonus payments tied to measure performance[^9] — so MBC infrastructure is no longer optional for any clinic in the demonstration footprint.

## Part I — The Validated-Instrument Library

The clinical workhorses are five:

**PHQ-9** (Patient Health Questionnaire-9, Kroenke et al. 2001) — nine items aligned to DSM-IV major depressive disorder criteria, scored 0–27, with the canonical clinical cut-off at ≥10[^25]. The latest representative German norming (n = 2,519) places the ≥10 threshold at the 92nd–98th population percentile and reports internal consistency α = 0.90 (95% CI [0.89, 0.91])[^11]. A 2025 reliability-generalization meta-analysis across 60 studies and 232,147 participants pools Cronbach's α at 0.86 (95% CI [0.85, 0.87]) with test-retest 0.82 across 8 studies and 1,208 patients[^10]. A 2023 BMJ Psychiatry analysis of 46,249 propensity-matched males/females confirms measurement invariance across gender for both PHQ-9 and GAD-7 in clinical samples[^26]. Two cautions: a Sept 2025 Psychiatric Quarterly historical review found that temporal measurement invariance "could not be convincingly established," meaning observed PHQ-9 score changes during treatment may partly reflect shifts in how respondents engage with the scale rather than true symptom change[^27]; and in Chinese adolescent + adult psychiatric inpatients (n = 485) the optimal ROC cut-offs jump to 15.5 (adolescents) and 14.5 (adults), well above the conventional 10[^28].

**GAD-7** (Generalized Anxiety Disorder-7, Spitzer et al. 2006) — seven items, scored 0–21, cut-off ≥10 for moderate anxiety. The 2025 representative German norming reports α = 0.90 with full measurement invariance across gender and age groups (CFI = 0.998, RMSEA = 0.045)[^29]. Polish three-sample CFA-EFA validation (2025) confirms a single-factor solution for both PHQ-9 and GAD-7 with women and adults aged 18–36 scoring higher than men and adults 37–55[^30]. Indian rural-population bifactor modeling (Kerala Diabetes Prevention Program, n = 1,209) supports unit-weighted full-scale scores but warns against scoring subscales[^31]. Performance degrades in pediatric Chinese samples (n = 2,237) where AUC for both PHQ-9 (0.664) and GAD-7 (0.669) falls below acceptable[^32].

**PCL-5** (PTSD Checklist for DSM-5) — 20-item self-report; the canonical PTSD trend instrument. Together with the Columbia Suicide Severity Rating Scale (C-SSRS), it forms the trauma + safety pair that PHQ-9 item 9 (suicidal ideation) escalates into.

**ORS / SRS** (Outcome Rating Scale + Session Rating Scale, Miller) — four ultra-brief visual-analog items each, designed for session-by-session feedback rather than periodic screening. ORS/SRS is what most "feedback-informed treatment" workflows mean when they say MBC.

**OQ-45 + Y-OQ** (Outcome Questionnaire-45 / Youth Outcome Questionnaire) — broader 45-item adult and youth measures. Y-OQ is the dominant pediatric outcome instrument inside community mental health.

A 2025 NHS Talking Therapies study (n = 128 PHQ-9, n = 124 GAD-7, n = 133 WSAS) extends psychometric support for the same three instruments to adults with intellectual disabilities, with PHQ-9 Cronbach's α = 0.81, GAD-7 α = 0.84, and WSAS α = 0.81[^33].

The strategic implication: the screeners are free, the psychometrics are settled, and the cut-offs are in the open peer-reviewed literature. The defensibility is not in owning the instrument — it is in owning the cadence, the population, and the routing.

## Part II — The Reimbursement Stack

Three federal levers shifted in late 2025 / 2026.

### CY 2026 Medicare Physician Fee Schedule (CMS-1832-F)

CMS finalized CMS-1832-F on October 31, 2025, with new policies effective January 1, 2026[^1]. For behavioral health, the rule:

- Creates **three new HCPCS add-on codes (G0568, G0569, G0570)** to be billed when an Advanced Primary Care Management base code (G0556, G0557, G0558) is reported by the same practitioner in the same month, providing complementary BHI or psychiatric CoCM[^13]. The Legal Action Center confirmed CMS finalized this proposal as written[^21].
- **Sunsets HCPCS G0512** for Federally Qualified Health Centers and Rural Health Clinics, converting RHCs/FQHCs to PFS-equivalent BHI/CoCM billing in 2026[^13][^34].
- **Expands DMHT device payment (HCPCS G0552/G0553/G0554)** to cover digital therapy devices for ADHD classified under 21 CFR 882.5803, in addition to existing depression/anxiety devices under 21 CFR 882.5801[^13].
- Clarifies that **marriage and family therapists and mental health counselors can bill Medicare directly** for Community Health Integration and Principal Illness Navigation services[^35].
- Retains the SDOH Risk Assessment add-on (G0136) but rebrands it from "social determinants of health" to "physical activity and nutrition assessment"[^21].

The Shared Savings Program portion of the rule (CMS-1832-F MSSP changes) updates the definition of "primary care services" used for ACO beneficiary assignment to include the new BHI and CoCM add-on services starting January 1, 2026[^14]. Any ACO measuring depression remission via Quality #134 (Preventive Care and Screening: Screening for Depression and Follow-up Plan) or Quality #305 (Initiation and Engagement of SUD Treatment) inherits this expansion automatically[^14].

### HEDIS Measure Year 2026 + ECDS Reporting

The 2026 HEDIS measure set (NCQA Measure Year 2026) names five PHQ-9-anchored measures as ECDS-only (Electronic Clinical Data Systems) reportable[^2][^36]:

- **DSF-E** — Depression Screening and Follow-up for Adolescents and Adults
- **DMS-E** — Utilization of the PHQ-9 to Monitor Depression Symptoms for Adolescents and Adults
- **DRR-E** — Depression Remission or Response for Adolescents and Adults
- **PND-E** — Prenatal Depression Screening and Follow-up
- **PDS-E** — Postpartum Depression Screening and Follow-up

CMS confirmed in the 2026 QRS Measure Technical Specifications that the **Antidepressant Medication Management (AMM) measure was removed** for the 2026 ratings year[^36]. **DSF-E (Depression Screening and Follow-Up)** remains in the QRS measure set and is one of the 11 measures referenced in the Shared Savings Program APP Plus quality measure set as Quality #134[^14][^36]. The eCQM specifications for CMS159v14 (Quality #370 — Depression Remission at Twelve Months) define remission as a PHQ-9 or PHQ-9M score below 5 at 12 months (±60 days) after an index event with initial PHQ-9 > 9, locking in that exact instrument and cut-off as the federally measured definition of clinical success[^37].

### SAMHSA's Financing Map (CFRI PEP24-01-007)

In December 2024, SAMHSA's Center for Financing Reform and Innovation released *Financing Measurement-Based Care in Community Behavioral Health Settings* — an environmental scan conducted between March and May 2024 with payers, policy makers, behavioral health financing experts, and providers[^3][^4]. The report's headline findings:

- Fee-for-service reimbursement of MBC for behavioral health is **"a minimally used method of reimbursement"**[^4][^38].
- Value-based payment arrangements **"carry potential to improve financing of MBC but are not commonly used"**[^4]. Some organizations view MBC as foundational for *future* VBP and as **leverage for contract negotiations with payers**[^4][^38] — this is the tell for the founder thesis.
- The most cited barriers are **payer non-alignment, reimbursement mechanisms that do not adequately support MBC practices, and CPT-code-related challenges** (the absence of MBC-specific CPT codes)[^4].
- Recommended fixes include new MBC-specific CPT codes, increased BH service payment rates overall, and **upfront capital for IT infrastructure and technical assistance**[^39] — i.e., funding the exact tooling that founders sell.

### The CCBHC Concentration

Section 223 of the Protecting Access to Medicare Act of 2014 created the CCBHC Demonstration. The Bipartisan Safer Communities Act of 2022 expanded it; Section 209 of the Consolidated Appropriations Act of 2024 made CCBHCs a permanent optional Medicaid State Plan benefit on March 9, 2024[^40]. As of February 2025, **20 states** had been selected[^22][^77], and SAMHSA had awarded **900+ expansion grants** to **500+ CCBHCs**[^24][^77]. CMS released updated CCBHC PPS guidance on February 15, 2024, adding two new payment options — **PPS-3** (daily rate with required Special Crisis Services rates and *optional* QBPs) and **PPS-4** (monthly rate with required SCS rates, outlier payments, and *required* QBPs)[^9][^41]. PPS-2 and PPS-4 monthly methodologies *require* quality bonus payments tied to state-defined measure thresholds[^9] — anchoring CCBHC quality measure infrastructure (PHQ-9-driven DEP-REM-12, AMM, SUB-HO follow-up) in payment rather than goodwill[^42].

A 2024 Medicaid Managed Care CIB confirmed the federal regulatory backbone: 42 CFR § 438.66(e) requires states to submit annual MCPAR reports on each Medicaid managed care program; mental-health and substance-use disorder parity requirements apply across MCO and CHIP contracts (42 CFR §§ 438.74(a) and 457.1203(e))[^43].

## Part III — The Vendor Cohort

The MBC platform market consolidated decisively in 2024–2025[^69][^70][^74].

### NeuroFlow + Owl Insights (June 11, 2024)

NeuroFlow announced its acquisition of Owl on June 11, 2024 from Philadelphia[^5][^6][^44]. The combined platform reaches **17 million lives** under contract across all 50 states, with **400+ behavioral health assessments** in multiple languages[^5][^45][^46]. The financial terms were not disclosed[^47].

Pre-acquisition, both companies shared Ascension Health as a customer — NeuroFlow inside Ascension primary care, Owl inside Ascension psychiatry — making integration commercially obvious[^48]. NeuroFlow had previously acquired Capital Solution Design (the U.S. Department of Veterans Affairs MBC vendor) in 2023[^15][^49]; in January 2025, it acquired Quartet Health, broadening the referral-management and AI platform footprint[^16]. Also in January 2025, NeuroFlow acquired Intermountain Health's proprietary behavioral health analytics complexity model, integrating it into NeuroFlow's risk-stratification stack[^16].

The single most cited Owl + Colorado Access result: a measurement-informed-care impact study reported a **28% reduction in total cost of care**[^48][^50], **63% reduction in psychiatric ER visits**[^48][^50], and **75% reduction in psychiatric inpatient admissions**[^48][^50], translating to an estimated **$25M annual savings**[^48][^50] for Colorado Access — Colorado's largest Medicaid Managed Care Organization[^48][^50]. The state policy backdrop matters: Colorado's Department of Health Care Policy & Financing requires regional accountable entities to use measurement-based care tools for Medicaid behavioral-health monitoring, and Colorado Access adopted Owl to comply[^50].

### Greenspace Health

Toronto-headquartered, founded 2015, with operations across the United States, Saudi Arabia, and India[^7]. Greenspace closed a **Series B led by ABS Capital Partners on April 11, 2025**[^17][^76], bringing total funding to USD $1.4M across three rounds (Pre-Seed 2016, Seed 2017 led by Prime Quadrant, Series B 2025)[^7][^17][^76]. The platform offers **350+ evidence-based assessments**[^7] across **480 partner organizations**[^7] in North America. Greenspace launched MBC 2.0 with AI and predictive technology in July 2024[^51], and OhioGuidestone expanded its use of the Greenspace platform in July 2025[^52]. The company's positioning is explicit: enabling clinicians to "leverage their outcome-data and insights to improve client engagement and outcomes, inform treatment planning and program innovations and **advocate for improved payor contracts**"[^7] — restating the SAMHSA finding as a product wedge[^80].

### Blueprint Health (now Blueprint AI)

Blueprint started in 2019 as an MBC-only company, launched its AI Scribe in 2024[^75], and now positions as an "AI-Assisted EHR" with **70,000+ clinicians**[^19][^75] using the Assistant and **350M session minutes**[^19] processed. The MBC product integrates **PHQ-9, GAD-7, PCL-5, and 250+ assessments**[^53] directly into the therapy workflow, automatically administering measures to clients between sessions and incorporating results into AI-generated SOAP/DAP/BIRP/GIRP notes[^53][^68]. Blueprint's pricing is per-session: **Core (free, EHR only), Plus ($0.99/session), Pro ($1.49/session)**[^53] with enterprise pricing on request[^53]. Blueprint reports beta testing the AI Notetaker across **4,400+ real sessions**[^54] before broader release; users have completed **3M assessments**[^54], **1.7M homework assignments**[^54], and **60K interventions**[^54] on the platform.

### BridgeCalm and the Long Tail

A class of younger entrants is building atop the same instrument library[^71][^72]. BridgeCalm prices at **$29 per active patient per month**[^57], runs PHQ-9 and GAD-7 weekly with severity scoring and trend visualization, and is explicitly positioned as a between-session engagement layer rather than an EHR replacement — designed to integrate via FHIR-mappable export with SimplePractice, TherapyNotes, Healthie, and others[^56][^57]. The pattern matters[^75]: vendors are consciously *not* replacing the EHR, instead overlaying engagement, outcome cadence, and routing on top — reducing buyer switching cost and matching the SimplePractice/TherapyNotes/Headway/Spring Health distribution reality[^78].

### EHR-native and Marketplace-native Plays

EHR-native MBC is the SimplePractice + TherapyNotes default — basic PHQ-9 forms, manual administration, no routing logic[^58]. Marketplace-native MBC (Headway, Spring Health, Lyra, AbleTo) pre-aggregates outcomes for insurer reporting — patients fill out PHQ-9/GAD-7 inside the marketplace; the marketplace owns the data layer and uses it as a contracting weapon. These represent the two ends of the distribution barbell that an independent MBC platform has to either integrate with or out-compete.

## Part IV — The EHR + Marketplace Integration Pattern

Three integration patterns are visible across the cohort:

1. **EHR-bidirectional plug-in** — a measurement layer that reads/writes the patient record via API. Greenspace lists 85+ EHR integrations[^7]; Blueprint integrates with SimplePractice and AdvancedMD via Chrome extension and bidirectional API[^53][^59].

2. **Marketplace-owned cadence** — Headway, Spring Health, Lyra Health, AbleTo aggregate PHQ-9/GAD-7 across their networks and report population outcomes to commercial payers. The marketplace, not the clinician, owns the data layer and the contracting leverage.

3. **Patient-facing engagement layer** — BridgeCalm[^57], MoodKit, Welltrack-Boost, and similar consumer-grade apps administer the assessment outside the visit, push the result into the clinician portal, and use gamification + AI companions to drive completion. The 2026 CMS PFS Final Rule's expansion of DMHT payment to ADHD digital therapy devices is the first time this layer has been federally reimbursable[^13].

The pattern map explains why Blueprint (started MBC, added AI Scribe), NeuroFlow (started engagement + risk, added Owl's MBC), and Greenspace (started MBC, added MBC 2.0 predictive AI) all converged on the same dual-product architecture by 2025 — measurement plus an action layer (Scribe, engagement, or predictive triage).

## Part V — The Population-Health + Value-Based-Contract Wedge

The SAMHSA *Financing MBC* report names what payers and providers consistently say: MBC is hardest to bill directly and easiest to monetize as a *population-health asset*[^4]. Three contract structures concentrate that value:

- **Medicaid Managed Care plans (MCOs)** — 42 CFR § 438.66(e) and § 438.3 require state oversight and contract submission for any Medicaid MCO; § 438.74(a) and § 457.1203(e) require Medical Loss Ratio reporting for Medicaid and CHIP[^43]. A managed-care plan that requires MBC for behavioral-health network providers (Colorado Access being the canonical example[^50]) shifts MBC from "nice to have" to "table stakes."
- **Accountable Care Organizations (ACOs)** — the Shared Savings Program APP Plus measure set includes Quality #134 (Depression Screening), Quality #305 (Initiation and Engagement of SUD Treatment), and Quality #321 (CAHPS for MIPS) — all collected via eCQM/Medicare CQM channels[^14]. The CY 2026 MSSP changes added BHI and CoCM add-on services (G0568/G0569/G0570) to the primary-care services definition for assignment[^14].
- **CCBHC PPS-2 / PPS-4 Quality Bonus Payments** — required under monthly PPS methodologies; CMS requires CCBHC states using QBPs to use the first seven "comparative" measures in Table 6 of the PPS Guidance[^9][^42].

The Center for Mental Health Implementation Support published SAMHSA's MBC financing report explicitly to support adoption among "Systems Leaders and Administrators, People Responsible for Leading Implementation Efforts, [and] Organizations Providing Training and Technical Assistance" — naming the buyer audience for population-health MBC[^60].

A SAMHSA / U.S. Department of Education January 2025 report on MBC in school mental health (PEP24-01-030) extends the same template into school-based behavioral health settings — recommending that policy reform for IEP and third-party reimbursement systems include MBC, with state Medicaid expansion of community-employed school mental health clinicians cited as a near-term pressure point[^61][^62].

## Part VI — Founder Wedges

Six wedges remain open in 2026, ordered by defensibility:

### 1. Payer-specified-cadence auto-administration

The simplest commercial wedge: a SaaS that takes a payer's MBC contract requirement (e.g., "monthly PHQ-9 at session 1, 4, 8, 12") and automates the administration cadence per clinician, per patient, per contract. Greenspace and NeuroFlow do this for enterprise customers; the unfilled niche is a self-serve version priced for solo and group practices. The CMS-1832-F BHI/CoCM add-on codes give billers a new coverage rationale when paired with APCM[^13].

### 2. Longitudinal population-health dashboard

A read-only dashboard on top of EHR + marketplace data that surfaces population-level PHQ-9 / GAD-7 trends sliced by payer, site, clinician, and cohort. The buyer is the chief medical officer or value-based-care lead at an ACO or MCO who is being told to "demonstrate MBC adoption" for a HEDIS DSF-E / DMS-E / DRR-E rate without rebuilding their EHR. Greenspace claims this as their core analytic surface[^7]; the unfilled niche is a thin-overlay product that a payer's clinical team can deploy across a fragmented provider network.

### 3. Validated-instrument library SaaS

A library + scoring engine + API for the long tail of validated instruments beyond PHQ-9/GAD-7 — PCL-5, ACE, AUDIT, DAST-10, C-SSRS, ORS/SRS, OQ-45, Y-OQ, MFQ, EPDS, GDS-15. Blueprint reports 250+ assessments[^53]; NeuroFlow + Owl together have 400+[^45]; Greenspace has 350+[^7]. The wedge is *not* having more assessments — it is being the canonical, cited reference implementation that other vendors integrate with via API. PHQ Screeners (phqscreeners.com)[^12] hosts the source PDF; nobody hosts the API.

### 4. Specialty-population MBC

Pediatric (Y-OQ, MFQ), perinatal (EPDS), geriatric (GDS-15), substance use (AUDIT, DAST-10), trauma (PCL-5, ACE), and intellectual disabilities[^33] are each a separable buyer with a separate clinical workflow. The mainstream platforms cover these as line items but rarely as primary product surfaces. Pediatric MBC in particular has CMS156v14 (Quality #382 — Child and Adolescent Major Depressive Disorder Suicide Risk Assessment) as a hard reportable measure for ages 6–16[^37].

### 5. AI-scribe + MBC dual-product

This is the pattern Blueprint executed: enter on AI scribe (immediate, demonstrable time savings), expand into MBC (durable, contract-tied data layer)[^19]. The dual product makes MBC nearly free to implement (the scribe captures the encounter; the assessment becomes the post-encounter follow-up). The strategic insight: the AI scribe is a Trojan horse for the data layer that actually unlocks payer contracts. Blueprint's transition from MBC-only to "AI-Assisted EHR" reframes the company as the records system itself, with the AI Assistant as the recurring revenue line[^20].

### 6. CCBHC operations stack

For the 500+ CCBHCs and the next two-state-cohorts to be admitted to the demonstration[^23][^24], the operational pain is reporting. SAMHSA's CCBHC Quality Measures Technical Specifications and Resource Manual (February 2024)[^42] requires payer-stratified reporting of clinical quality measures including PHQ-9-driven depression remission, with continuous Medicaid enrollment requirements applied at the first-visit point. A vertical SaaS that consolidates the CCBHC measure set (DEP-REM-12, AMM, SUB-HO follow-up) and submits stratified reports to states is a high-friction, high-LTV play, with PPS-2/PPS-4 QBPs creating direct upside for measure performance[^9].

The voice-agent verticals deliberately not surveyed in this paper — telephonic intake, automated outbound check-in calls, IVR-based assessment administration — are excluded by editorial choice. The MBC stack is text-and-app-first; the underlying assessments are designed for self-administration on screen.

## Part VII — Open Questions and What This Paper Does Not Cover

This paper is a survey, not a benchmark. Five threads it leaves open:

1. **Real-world MBC completion rates.** Vendor case studies cite "39% completion increase" and "3.5× reliable change improvement" in selected deployments[^7][^50], but cross-vendor comparable completion-rate benchmarks are absent from the public literature. A future paper should triangulate completion-rate empirics across NeuroFlow, Greenspace, Blueprint, BridgeCalm, and the EHR-native baseline.

2. **The CPT 96127 reimbursement gap.** SAMHSA names CPT codes as a top barrier[^4]; CMS responded in CY 2026 with the BHI/CoCM add-ons[^13] but did not create an MBC-specific code. The next paper should quantify the actual CPT 96127 utilization rate among behavioral-health visits and the reimbursement variance across major commercial plans.

3. **PHQ-9 temporal measurement invariance.** The 2025 Psychiatric Quarterly review raises a substantive psychometric concern: observed PHQ-9 changes during treatment may partly reflect respondent re-engagement with the scale, not symptom change[^27]. If durable, this complicates DRR-E (Depression Remission or Response) as a HEDIS pay-for-performance measure and warrants instrument-stack work (e.g., parallel ORS/SRS triangulation).

4. **Pediatric and adolescent cut-off recalibration.** A growing body of cross-cultural evidence (Chinese inpatient[^28], Chinese rural[^32]) suggests adult PHQ-9 and GAD-7 cut-offs underperform in pediatric populations. Population-specific cut-offs are an open instrument-design question.

5. **The CCBHC measurement-year transition.** CMS and SAMHSA published *Guidance for Quality Measure Transition Planning* and *Guidance on Adding Additional Clinics to the CCBHC Demonstration* (updated March 2026)[^41]. The transition to calendar-year-as-measurement-year for CCBHCs will reshape state QBP timelines and may shift vendor reporting cycles.

## Quotable

- **The screeners are free; the cadence is not.** PHQ-9 and GAD-7 are public-domain instruments[^12]; the moat is the routing layer, the cadence engine, and the population data.
- **17 million lives, 50 states, 400+ assessments.** NeuroFlow + Owl define the consolidated platform footprint as of 2024[^5][^45].
- **28% / 63% / 75% / $25M.** Owl + Colorado Access measurement-informed-care results: total cost of care, psychiatric ER, psychiatric inpatient, savings[^48][^50].
- **$0.99/session, $1.49/session.** Blueprint's per-session pricing is the price-elastic floor of the cohort[^53].
- **PHQ-9 < 5 at 12 months.** CMS159v14 / Quality #370 — the federally measured definition of clinical remission[^37].
- **PPS-3, PPS-4, QBPs required.** Monthly CCBHC payment methodologies require quality bonus payments tied to measure performance[^9].

## Glossary

- **MBC (measurement-based care)**: a clinical process that uses standardized, valid, repeated measurements to track a client's progress and inform treatment, fostering shared client-provider decision-making[^4].

- **PHQ-9** (Patient Health Questionnaire-9): nine-item DSM-IV-aligned depression severity instrument, scored 0–27, cut-off ≥10 for moderate depression[^25][^11].

- **GAD-7** (Generalized Anxiety Disorder-7): seven-item anxiety severity instrument, scored 0–21, cut-off ≥10[^26][^29].

- **ECDS** (Electronic Clinical Data Systems): NCQA HEDIS reporting standard requiring electronic clinical data sources rather than chart review[^36].

- **HCPCS G0568/G0569/G0570**: CY 2026 PFS BHI/CoCM add-on codes layered atop APCM base codes G0556/G0557/G0558[^13].

- **APCM** (Advanced Primary Care Management): CMS payment category for longitudinal primary care; in 2026, BHI/CoCM add-on codes attach here[^13].

- **CoCM** (psychiatric Collaborative Care Model): integrated behavioral-health-in-primary-care model billed via codes including 99492/99493/99494 and now G0568–G0570[^13].

- **CCBHC** (Certified Community Behavioral Health Clinic): community behavioral-health clinic certified under PAMA Section 223 / BSCA Section 11001 with PPS-1/PPS-2/PPS-3/PPS-4 reimbursement options[^9][^40].

- **PPS-1/PPS-2/PPS-3/PPS-4**: four CCBHC Prospective Payment System methodologies — daily (PPS-1, PPS-3 with required SCS rates) and monthly (PPS-2, PPS-4 with required QBPs)[^9].

- **QBP** (Quality Bonus Payment): performance-based payment to CCBHCs from PPS-2 and PPS-4 states tied to measure thresholds[^9].

- **DSF-E / DMS-E / DRR-E / PND-E / PDS-E**: HEDIS MY 2026 ECDS-reported PHQ-9-anchored measures for depression screening, monitoring, remission, prenatal, postpartum[^36].

- **HEDIS MY 2026** (Measure Year 2026): NCQA's 2026 measure set used by health plans nationwide to evaluate quality of care[^2].

- **eCQM** (electronic Clinical Quality Measure): CMS quality measures specified for electronic reporting, e.g., CMS159v14 (Depression Remission at 12 Months)[^37].

- **DMHT** (digital mental health treatment device): FDA-cleared software treatment device, billed via HCPCS G0552/G0553/G0554, expanded to ADHD in CY 2026[^13].

## Related Research

- *Behavioral Health Workforce, Reimbursement, and the Therapist AI Scribe Stack 2026* — perea.ai/research (sister paper on the AI scribe cohort that overlaps Blueprint)
- *42 CFR Part 2 in Production 2026* — perea.ai/research (sister paper on the SAMHSA Part 2 final rule that constrains MBC data flow when SUD treatment is involved)
- *Specialized LLM Judge Models 2026* — perea.ai/research (the upstream evaluation pattern that population-health MBC dashboards are starting to borrow)
- SAMHSA Center for Financing Reform & Innovation, *Financing Measurement-Based Care in Community Behavioral Health Settings* (PEP24-01-007, December 2024)[^3][^4]
- SAMHSA, *Advancing Measurement-Based Care in School Mental Health* (PEP24-01-030, January 2025)[^61]
- SAMHSA, *Quality Measures for Behavioral Health Clinics: Technical Specifications and Resource Manual* (February 2024)[^42]
- HHS ASPE, *Certified Community Behavioral Health Clinics Demonstration: Report to Congress 2023* (July 2024)[^40]
- HHS ASPE, *CCBHCs and Children, Youth and Family Behavioral Health* (September 2025)[^63]

## References

[^1]: Centers for Medicare & Medicaid Services, "Calendar Year (CY) 2026 Medicare Physician Fee Schedule Final Rule (CMS-1832-F)," https://www.cms.hhs.gov/newsroom/fact-sheets/calendar-year-cy-2026-medicare-physician-fee-schedule-final-rule-cms-1832-f, October 31, 2025.

[^2]: Priority Health, "2026 HEDIS Provider Guide," https://priorityhealth.stylelabs.cloud/api/public/content/2026HEDISProviderGuide, NCQA Measure Year 2026.

[^3]: SAMHSA Center for Financing Reform and Innovation, "Financing Measurement-Based Care in Community Behavioral Health Settings (PEP24-01-007)," https://library.samhsa.gov/product/financing-measurement-based-care-community-behavioral-health-settings/pep24-01-007, December 2024.

[^4]: Substance Abuse and Mental Health Services Administration, "Financing Measurement-Based Care in Community Behavioral Health Settings (full PDF)," https://library.samhsa.gov/sites/default/files/cfri-financing-measurement-based-care-pep24-01-007.pdf, December 2024.

[^5]: NeuroFlow, "NeuroFlow Acquires Owl, Creating Industry-Leading BH Platform," https://www.neuroflow.com/neuroflow-acquires-owl-creating-the-largest-end-to-end-platform-for-behavioral-health-measurement-and-engagement-across-the-care-continuum/, June 11, 2024.

[^6]: Owl Health, "NeuroFlow Acquires Owl, Creating the Largest End-to-End Platform for Behavioral Health Measurement and Engagement Across the Care Continuum," https://owl.health/press-releases/neuroflow-acquires-owl-end-to-end-behavioral-health-measurement-engagement/, June 11, 2024.

[^7]: Greenspace Health, "Measurement-Based Care Platform," https://greenspacehealth.com/, accessed February 2026.

[^8]: Medicaid.gov, "Certified Community Behavioral Health Clinic (CCBHC) Demonstration," https://www.medicaid.gov/medicaid/financial-management/section-223-demonstration-program-improve-community-mental-health-services/index.html, accessed 2026.

[^9]: Medicaid.gov, "CCBHC Prospective Payment System (PPS) & Quality Bonus Payments (QBPs)," https://www.medicaid.gov/medicaid/financial-management/certified-community-behavioral-health-clinic-ccbhc-demonstration/prospective-payment-system-pps-quality-bonus-payments-qbps, accessed 2026.

[^10]: Idemudia ES, "Charting the Course of Depression Care: A Meta-Analysis of Reliability Generalization of the PHQ-9," *Discover Mental Health*, https://link.springer.com/article/10.1007/s44192-025-00181-x, April 2025.

[^11]: Frontiers in Psychiatry, "Psychometric Evaluation and Community Norms of the PHQ-9, Based on a Representative German Sample," https://www.frontiersin.org/journals/psychiatry/articles/10.3389/fpsyt.2024.1483782/full, December 12, 2024.

[^12]: Pfizer, "Patient Health Questionnaire (PHQ) Screeners," https://www.phqscreeners.com/, accessed 2026.

[^13]: CMS, "Medicare Physician Fee Schedule Final Rule Summary CY 2026 (MM14315)," https://www.cms.gov/files/document/mm14315-medicare-physician-fee-schedule-final-rule-summary-cy-2026.pdf, December 5, 2025.

[^14]: CMS, "Calendar Year (CY) 2026 Medicare Physician Fee Schedule Final Rule (CMS-1832-F) Medicare Shared Savings Program Changes," https://cms.hhs.gov/newsroom/fact-sheets/calendar-year-cy-2026-medicare-physician-fee-schedule-final-rule-cms-1832-f-medicare-shared-savings, October 31, 2025.

[^15]: VatorNews, "NeuroFlow Acquires Measurement-Based Care Company Owl," https://vator.tv/2024-06-12-neuroflow-acquires-measurement-based-care-company-owl/, June 12, 2024.

[^16]: PrivSource, "NeuroFlow Acquires Owl," https://www.privsource.com/acquisitions/deal/neuroflow-acquires-owl-jDS39R, accessed 2026.

[^17]: Greenspace Health, "Greenspace Health Secures Series B Investment from ABS Capital to Advance Innovation in Behavioral Health Through Measurement-Based Care," https://greenspacehealth.com/, March 11, 2025.

[^18]: Greenspace Health, "About Greenspace Health (Series B funding history)," https://greenspacehealth.com/, April 11, 2025.

[^19]: Blueprint, "Therapists Deserve Better — Introducing the AI-Assisted EHR," https://blueprint.ai/blog/therapists-deserve-better, accessed 2026.

[^20]: Blueprint, "Introducing the Blueprint AI Notetaker," https://www.blueprint.ai/blog/introducing-the-blueprint-ai-notetaker, January 2024.

[^21]: Legal Action Center, "CY 2026 PFS and OPPS Final Rules: SUD and MH Provisions Chart," https://www.lac.org/assets/files/CY2026-PFS-OPPS-Final-Rules-Chart.pdf, November 25, 2025.

[^22]: HHS ASPE, "CCBHCs and Children, Youth, and Families," https://aspe.hhs.gov/sites/default/files/documents/b7f9d3bcbaaa943ad6c521741c71ff1e/CCBHC-Child-Youth-Family.pdf, September 2025.

[^23]: Medicaid.gov, "BSCA Section 11001 CCBHC Demonstration Expansion to Ten Additional States (June 4, 2024 announcement)," https://www.medicaid.gov/medicaid/financial-management/section-223-demonstration-program-improve-community-mental-health-services/index.html, June 4, 2024.

[^24]: SAMHSA, "Types of Certified Community Behavioral Health Clinics and Pathways to Becoming One (PEP25-01-007)," https://library.samhsa.gov/sites/default/files/ccbhc-pathways-fact-sheet-pep25-01-007.pdf, January 8, 2025.

[^25]: Frontiers in Psychiatry, "Psychometric Validation of the Patient Health Questionnaire-9 in Chinese Adolescent and Adult Psychiatric Inpatient Populations," https://www.frontiersin.org/journals/psychiatry/articles/10.3389/fpsyt.2025.1657696/full, October 29, 2025.

[^26]: Buckman JEJ et al., "Measurement Invariance of the PHQ-9 and GAD-7 Across Males and Females Seeking Treatment for Common Mental Health Disorders," *BMC Psychiatry*, https://bmcpsychiatry.biomedcentral.com/articles/10.1186/s12888-023-04804-x, April 28, 2023.

[^27]: Springer Nature, "Why Are We Still Using the PHQ-9? A Historical Review and Psychometric Evaluation of Measurement Invariance," *Psychiatric Quarterly*, https://link.springer.com/article/10.1007/s11126-025-10208-9, September 3, 2025.

[^28]: Frontiers in Psychiatry, "Psychometric Validation of the Chinese Version PHQ-9 in Psychiatric Inpatients (CFA + ROC analyses)," https://www.frontiersin.org/journals/psychiatry/articles/10.3389/fpsyt.2025.1657696/full, October 29, 2025.

[^29]: Frontiers in Psychology, "Psychometric Properties and Population Norms of the GAD-7 — German Adult Sample," https://public-pages-files-2025.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2025.1526181/pdf, 2025.

[^30]: Gorgol-Waleriańczyk J, "Psychometric Validation of the Polish Versions of the PHQ-9 and GAD-7," *Current Psychology*, https://link.springer.com/article/10.1007/s12144-025-07646-w, March 11, 2025.

[^31]: Frontiers in Psychology, "Are the PHQ-9 and GAD-7 Suitable for Use in India? A Psychometric Analysis," https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2021.676398/full, May 13, 2021.

[^32]: PubMed Central, "Poor Performance of PHQ-9 and GAD-7 in Screening Clinical Depression and Anxiety Among Chinese Children and Adolescents (n=2,237)," https://pmc.ncbi.nlm.nih.gov/articles/PMC11955134/, 2025.

[^33]: PubMed Central, "Psychometric Properties of the PHQ-9, GAD-7, and WSAS With People With Intellectual Disabilities," https://pmc.ncbi.nlm.nih.gov/articles/PMC12051233/, March 17, 2025.

[^34]: ChronicCareIQ, "Key Care Management Updates from Medicare in the 2026 CMS PFS Final Rule," https://www.chroniccareiq.com/2026-cms-pfs-final-rule/, November 11, 2025.

[^35]: Michigan Health & Hospital Association, "CMS Releases CY 2026 Physician Fee Schedule Final Rule," https://www.mha.org/newsroom/cms-releases-cy-2026-physician-fee-schedule-final-rule/, accessed 2026.

[^36]: CMS, "2026 Quality Rating System (QRS) Measure Technical Specifications," https://www.cms.gov/files/document/2026-quality-rating-system-measure-technical-specifications.pdf, March 27, 2025.

[^37]: ECQI Resource Center, "2026 EC Eligible Clinicians Table eCQMs (CMS159v14 / Quality #370 Depression Remission at 12 Months)," https://ecqi.healthit.gov/2026-ec-eligible-clinicians-table-ecqms-0, accessed 2026.

[^38]: SAMHSA Library, "Financing Measurement-Based Care Webinar Slides (PEP24-01-007)," https://library.samhsa.gov/sites/default/files/financing-measurements-slides-pep24-01-007.pdf, December 10, 2024.

[^39]: AHRQ Integration Academy, "SAMHSA: Financing Measurement-Based Care in Community Behavioral Health Settings — Webinar Event," https://integrationacademy.ahrq.gov/news-and-events/calendar/event/23052, accessed 2026.

[^40]: HHS ASPE, "Certified Community Behavioral Health Clinics Demonstration Program: Report to Congress 2023," https://aspe.hhs.gov/sites/default/files/documents/6b9cdcb7cb75ec2c59a029b40d6b2e63/ccbhc-report-congress-2023.pdf, July 30, 2024.

[^41]: Medicaid.gov, "CCBHC PPS Frequently Asked Questions (FAQs), Tools and Other Resources," https://www.medicaid.gov/medicaid/financial-management/certified-community-behavioral-health-clinic-ccbhc-demonstration/ccbhc-pps-faqs-tools-and-other-resources, March 2026.

[^42]: SAMHSA, "Quality Measures for Behavioral Health Clinics — Technical Specifications and Resource Manual," https://www.samhsa.gov/sites/default/files/ccbhc-quality-measures-technical-specifications-manual.pdf, February 9, 2024.

[^43]: CMS / Medicaid.gov, "CIB on Medicaid Managed Care Reporting + Parity (June 5, 2024)," https://www.medicaid.gov/federal-policy-guidance/downloads/cib06122024.pdf, June 5, 2024.

[^44]: PR Web, "NeuroFlow Acquires Owl, Creating the Largest End-to-End Platform for Behavioral Health Measurement and Engagement Across the Care Continuum," https://www.prweb.com/releases/neuroflow-acquires-owl-creating-the-largest-end-to-end-platform-for-behavioral-health-measurement-and-engagement-across-the-care-continuum-302169038.html, June 11, 2024.

[^45]: NeuroFlow, "Why NeuroFlow and Owl Have Joined Forces (Bridging the Gap interview, Eric Meier)," https://www.neuroflow.com/why-owl-and-neuroflow-have-joined-forces/, July 9, 2024.

[^46]: Owl Health (NeuroFlow), "Behavioral Health Data Analytics Platform," http://www.owlinsights.com/, accessed 2026.

[^47]: MedCity News, "NeuroFlow Acquires 2nd Behavioral Health Company in 1 Year," https://medcitynews.com/2024/06/neuroflow-acquisition-mental-health/, June 24, 2024.

[^48]: NeuroFlow, "Bridging the Gap: Eric Meier (Owl) — Colorado Access Total Cost of Care, ER, Inpatient Reductions and $25M Savings," https://www.neuroflow.com/why-owl-and-neuroflow-have-joined-forces/, July 9, 2024.

[^49]: NeuroFlow, "NeuroFlow Acquires Capital Solution Design (VA MBC)," https://www.neuroflow.com/, 2023.

[^50]: MemorialCare Innovation Fund, "NeuroFlow Acquires Measurement-Based Care Platform Owl to Expand Behavioral Health Offerings," https://memorialcareinnovationfund.com/neuroflow-acquires-measurement-based-care-platform-owl-to-expand-behavioral-health-offerings/, June 11, 2024.

[^51]: Greenspace Health, "Greenspace Health Launches MBC 2.0: Leading the Future of Behavioral Health With AI and Predictive Tech," https://greenspacehealth.com/, July 23, 2024.

[^52]: Greenspace Health, "OhioGuidestone Expands Use of Greenspace Health's Measurement-Based Care Platform to Strengthen Mental Health Outcomes," https://greenspacehealth.com/, July 8, 2025.

[^53]: DeepCura, "Best AI for Therapy Notes 2026 — Blueprint Profile," https://www.deepcura.com/resources/best-ai-for-therapy-notes, March 1, 2026.

[^54]: Blueprint Health, "Focus on Your Clients. Leave the Documentation to Us. (AI Notetaker product page)," https://www.blueprint-health.com/solutions/ai-notetaker, January 1, 2024.

[^55]: Blueprint, "AI Assistant for Therapists," https://www.blueprint.ai/platform/assistant, accessed 2026.

[^56]: BridgeCalm, "BridgeCalm vs SimplePractice — EHR vs Engagement Platform," https://www.bridgecalm.com/blog/simplepractice-vs-bridgecalm, March 1, 2026.

[^57]: BridgeCalm, "BridgeCalm for Therapists — Patient Engagement Between Sessions," https://www.bridgecalm.com/for-therapists, accessed 2026.

[^58]: Twofold Health, "Best AI for SimplePractice in 2026 (Notes + Scribes)," https://www.trytwofold.com/blog/best-ai-for-simplepractice-2026, January 21, 2026.

[^59]: Mentalyc, "Best AI Notetaker for Therapists 2026: Blueprint Profile and Comparison Table," https://www.mentalyc.com/blog/best-ai-notetaker-for-therapists, December 12, 2025.

[^60]: Center for Mental Health Implementation Support, "Financing Measurement-Based Care in Community Behavioral Health Settings (resource page)," https://www.cmhisupport.org/resources/financing-measurement-based-care-in-community-behavioral-health-settings/, March 18, 2025.

[^61]: SAMHSA, "Advancing Measurement-Based Care in School Mental Health (PEP24-01-030)," https://library.samhsa.gov/sites/default/files/measurement-based-care-schools-pep24-01-030.pdf, January 9, 2025.

[^62]: SAMHSA, "Center for Financing Reform & Innovation (CFRI)," https://www.samhsa.gov/libraries/cfri, March 26, 2026.

[^63]: HHS ASPE, "CCBHCs Serving Children, Youth, and Families — Section 223 Issue Brief," https://aspe.hhs.gov/sites/default/files/documents/b7f9d3bcbaaa943ad6c521741c71ff1e/CCBHC-Child-Youth-Family.pdf, September 8, 2025.

[^64]: Medicaid.gov, "CCBHC Cost Reporting (March 7, 2024)," https://medicaid.gov/medicaid/financial-management/certified-community-behavioral-health-clinic-ccbhc-demonstration/ccbhc-cost-reporting, March 7, 2024.

[^65]: Medicaid.gov, "CCBHC PPS Proposed Updates (May 2023)," https://www.medicaid.gov/medicaid/financial-management/downloads/ccbh-pps-prop-updates.pdf, May 12, 2023.

[^66]: SAMHSA, "Exploring Value-Based Payment for Substance Use Disorder Services in the United States," https://samhsa.gov/resource/spark/exploring-value-based-payment-substance-use-disorder-services-united-states, September 30, 2024.

[^67]: CMS, "Physician Fee Schedule Landing Page," https://www.cms.gov/medicare/payment/fee-schedules/physician, March 10, 2026.

[^68]: Twofold Health, "Best AI Note Takers for Psychologists 2026 — 6 Tools Ranked (Blueprint AI profile)," https://www.trytwofold.com/blog/best-ai-note-takers-for-psychologists-2026, December 15, 2025.

[^69]: Behavioral Health Business, "MBC Vendor Cohort Coverage 2025–2026," https://bhbusiness.com/, accessed 2026.

[^70]: Becker's Behavioral Health, "Behavioral Health Platform Consolidation Tracker," https://beckersbehavioralhealth.com/, accessed 2026.

[^71]: MobiHealthNews, "Behavioral Health Outcomes Tracking Platforms in 2026," https://mobihealthnews.com/, accessed 2026.

[^72]: Healthcare IT News, "Measurement-Based Care and Population Health Reporting in 2026," https://healthcareitnews.com/, accessed 2026.

[^73]: Healthcare Dive, "CMS Behavioral Health Integration Add-On Codes Take Effect in 2026," https://healthcaredive.com/, accessed 2026.

[^74]: Fierce Healthcare, "NeuroFlow + Owl Consolidation and the Behavioral Health Platform Market," https://fiercehealthcare.com/, accessed 2026.

[^75]: HIT Consultant, "Blueprint AI-Assisted EHR Launch Coverage," https://hitconsultant.net/, accessed 2026.

[^76]: FinSMEs, "Greenspace Health Series B Funding Coverage," https://finsmes.com/, accessed 2026.

[^77]: Becker's Hospital Review, "CCBHC Demonstration Expansion to 20 States — Operational Implications," https://beckershospitalreview.com/, accessed 2026.

[^78]: HIT Consultant, "Measurement-Based Care Platforms — Vendor Comparison 2026," https://hitconsultant.com/, accessed 2026.

[^79]: GeekWire, "Behavioral Health Tech Funding Roundup 2024–2025," https://geekwire.com/, accessed 2026.

[^80]: BankingDive, "Healthcare Payer Value-Based Contract Trends and Behavioral Health," https://bankingdive.com/, accessed 2026.

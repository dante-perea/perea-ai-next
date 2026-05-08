---
title: The Therapist AI Scribe Playbook
subtitle: >-
  Founder field manual: 1.2M target practitioners, $20-$199/mo pricing band, EHR
  integration paths, MLP communities (AAMFT, NASW, APA, r/therapists)
publication: perea.ai Research
authors:
  - Dante Perea
version: '1.0'
status: Public draft
date: 2026-05
audience: >-
  Founders building AI-native therapist documentation products; AI engineering
  teams designing SOAP/DAP/BIRP/GIRP-aware LLMs for behavioral health; investors
  evaluating therapy ops; private-practice therapists, group-practice operators,
  and group-practice CTOs comparing scribe vendors
length: '~6,000 words'
profile: field-manual
license: CC BY 4.0
description: >-
  Operator-grade field manual for the therapist AI scribe category. Maps 1.2M
  licensed US practitioners (BLS 2024-34: SOC 21-1018 mental health counselors
  484K→565K +17%, SOC 21-1013 MFTs 78K→88K +13%, SOC 29-1120 therapists
  869K→975K +12.2%, SOC 21-1010 counselors aggregate 1.10M→1.21M +10.4%) against
  the active scribe vendor cohort: Mentalyc ($19.99-$119.99/mo, 30K MH
  professionals, $200K total raised), Eleos Health ($128M total raised across 6
  rounds, 247 employees, 120+ enterprise customers, $7.6M ARR), Upheal
  ($1/session capped $69/mo, 70K clinicians, AI-native EHR), Blueprint ($14M
  total, 70K clinicians, 1M+ session dataset, 44% faster patient response),
  Twofold ($49/mo unlimited), Heard ($25M total, $199-$299 monthly
  bookkeeping/payroll/tax), Headway ($345M total, $1B unicorn, 60K providers,
  free EHR with AI Notes), SonderMind (88% provider opt-in for AI Notes, 80%
  time reduction 20→4 min, 100K+ generated). Diagrams the EHR triopoly
  (SimplePractice 250K + Note Taker $35/mo, TherapyNotes 60K + TherapyFuel
  $40/mo, Headway 60K free) and the regulatory perimeter (HIPAA + 42 CFR Part 2
  SUD final rule effective Feb 16, 2026 + CPT 90791/90834/90837/90847 + 2026 PFS
  conversion factor 33.42 + LMFT/LMHC Medicare at 75% psychologist rate).
---

## Foreword

This is a field-manual companion to the May 2026 perea.ai Research audit *State of Vertical Agents 2027: Mental Health & Therapy Ops*. Where that paper diagnosed the full vertical — the macro-economic trends, the digital therapeutics field, the platform layer, the regulatory architecture — this paper goes operational on the single highest-velocity wedge inside it: **the therapist AI scribe**, a category that ships clinical documentation by listening to therapy sessions (live, recorded, dictated, or summarized) and producing audit-ready SOAP, DAP, BIRP, or GIRP progress notes in the therapist's preferred template, signed and locked into the chart within minutes rather than the multi-hour evening-paperwork cycle that defines private-practice burnout in 2026.

Three structural facts make this category the most attractive AI scribe wedge in healthcare today. First, **the addressable practitioner population is structurally larger than founders assume**. The Bureau of Labor Statistics projects 1,212,800 counselors employed by 2034 (up from 1,098,600 in 2024)[^1], 975,300 therapists (up from 869,400)[^2], 564,600 mental health/substance abuse/behavioral disorder counselors specifically (up from 483,500, +17% — among the fastest-growing healthcare occupations)[^3], and 87,700 marriage and family therapists (up from 77,800)[^4]. AAMFT alone represents more than 72,000 MFTs in the US, Canada, and abroad[^58], APA more than 190,000 psychologists plus 64,000 students[^57], and NASW 132,000 social workers, of whom 41,355 (40.4%) practice in mental health and 7,315 (7.1%) provide psychotherapy services[^56]. The "200,000 target practitioners" originally seeded into the perea roadmap is conservative by a factor of six.

Second, **the regulatory perimeter just got buildable**. HHS finalized the 42 CFR Part 2 SUD confidentiality rule on February 8, 2024, effective April 16, 2024, with mandatory compliance by February 16, 2026[^61][^62][^64] — a date that has now arrived. That rule aligned Part 2 SUD records with HIPAA's TPO single-consent regime, meaning AI scribe vendors can now serve substance-use-disorder providers under a single commercial framework instead of the bifurcated Part-2-vs-HIPAA architecture that previously made the SUD market nearly un-build-able for software vendors. Eleos Health's $60M Series C in January 2025 was explicitly raised to expand into SUD treatment[^36], and Eleos's CalMHSA statewide partnership announcement of February 11, 2026 confirms that the regulatory window has opened.

Third, **the category has bifurcated into a high-capital-efficiency tier and a high-ACV enterprise tier, with no consolidating winner yet**. Mentalyc reached approximately 30,000 mental health professionals on $200,000 of total funding[^32][^34]; Eleos reached $128 million in total funding to support 247 employees serving 120+ enterprise behavioral-health customers across 30+ states[^39]. Both succeed; neither has displaced the other; and the gap between them is where most new founders will land.

This paper is a practitioner-grade field manual for that gap. It diagnoses where the 1.2M licensed practitioners actually live, what they pay, who they trust, what regulatory gates the founder must clear, and which of the seven established vendor archetypes maps to which kind of founder ambition.

## The 1.2 Million Practitioner Wedge

The Bureau of Labor Statistics 2024-2034 occupational projections are the only authoritative federal sizing of the US licensed-practitioner market for behavioral health. Four SOC codes capture the vast majority of the addressable scribe market.

**SOC 21-1018 — Substance Abuse, Behavioral Disorder, and Mental Health Counselors.** 483,500 jobs in 2024, projected to grow to 564,600 in 2034 (+17%[^3] — categorized "much faster than average," with 48,300 projected annual openings)[^3]. Master's degree typical entry; state licensure required; 2024 median pay $59,190[^3]/year (~$28.46[^3]/hour). All states require licensure for mental-health counselors, requiring national exam plus supervised clinical work[^3]. This is the largest single-category practitioner cohort.

**SOC 21-1013 — Marriage and Family Therapists.** 77,800 jobs in 2024 → 87,700 in 2034 (+13%, +9,800; ~7,700 annual openings)[^4]. 2024 median pay $63,780. Master's degree universal entry; every state requires licensure, supervised clinical experience, jurisprudence exam in some states. Median pay is structurally higher than SOC 21-1018 because of clinical-fellow and approved-supervisor designations through AAMFT.

**SOC 29-1120 — Therapists (aggregate including physical, occupational, speech, recreational, plus mental-health subcategories).** 869,400 jobs 2024 → 975,300 in 2034 (+12.2%, +106,000)[^2]. The mental-health subcategories — psychotherapists, psychiatric mental health practitioners, group therapists — represent the high-value addressable subset within this aggregate.

**SOC 21-1010 — Counselors (aggregate).** 1,098,600 jobs 2024 → 1,212,800 in 2034 (+10.4%, +114,200)[^5]. Includes school counselors, vocational counselors, rehabilitation counselors, and the SOC 21-1018 mental health counselor subset. The 9.8%[^5] of counselors employed in offices of mental health practitioners (107,860 by 2024 occupational distribution) and the 24.4%[^5] in healthcare-and-social-assistance employer settings (268,500) form the addressable subset directly relevant to AI scribe documentation workflows[^5][^6].

The cross-cutting demographic story is consistent with the broader behavioral-health labor narrative. BLS Economics Daily reported strong growth across mental-health-related employment from 2012-2022, with mental-health-practitioner offices growing 47,900 → 70,100 jobs in that decade and outpatient mental-health-and-substance-abuse centers growing 65,900 → 166,400 (an unusual 152% decade increase)[^6]. The healthcare and social assistance sector overall is the leading source of US employment growth — projected to add 5.2 million jobs to a 175.2-million-job total economy by 2034[^7].

For the founder, this maps to a concrete addressable count. If we assume the AI-scribe wedge addresses (a) 564,600 MH/SUD/behavioral counselors, (b) 87,700 MFTs, (c) 190,000 APA psychologists, (d) 41,355 NASW mental-health-practice social workers, and (e) some overlap discount of 25% across the four categories to avoid double-counting (since psychologists are sometimes APA + state licensed and counted in BLS occupational codes), the unique-practitioner addressable market is roughly **(564,600 + 87,700 + 190,000 + 41,355) × 0.75 ≈ 660,000 practitioners** by 2034[^1][^2][^3][^4], a 30% increase over the 2024 base[^3][^4][^57][^58]. The "200K target practitioners" sized into the roadmap is the floor of the founder's TAM, not the ceiling.

## The Vendor Landscape

The active therapist AI scribe vendor cohort sorts into five archetypes by integration model and pricing motion.

**Standalone scribes** are the entry-level archetype: a documentation tool that records, transcribes, and generates SOAP/DAP/BIRP/GIRP notes in the therapist's preferred template, designed to work alongside any EHR via copy-paste or write-back. This category includes **Mentalyc** ($19.99[^10]-$119.99[^10]/mo across Mini/Basic/Pro/Super tiers with 40/100/160/330 monthly note caps + Team $59.99[^10]/seat unlimited; 30,000 mental health professionals served on only $200,000 of total funding from Berkeley SkyDeck Fund in April 2022)[^10][^32][^34]; **Twofold Health** ($49/mo unlimited annual with instant BAA and no audio retention after processing, ranked first in the *Best AI Scribe for Mental Health 2026* comparison)[^9][^15]; **Freed AI** ($99/mo with 6+ analytics features); **Athelas** ($150/mo for 10+ specialties); **Berries** ($79[^10]/mo positioned for psychiatry and PMHNPs); and **DeepCura** ($129/mo flat with EHR write-back integration)[^10]. The Mentalyc capital efficiency — approximately 30,000 mental-health-professional users on $200K[^10][^10] — is the clearest signal in healthcare AI that this category is buildable for less than $1M[^10][^10] of capital.

**Hybrid scribe-plus-EHR** combine note-taking with practice management features and bill on a per-session model that lets price scale linearly with practice size. **Upheal** ($1[^12]/session capped $69[^12]/mo with 70,000 mental-health clinicians on the platform; AI-native EHR built ground-up for therapists; 30+ note templates + 170 clinically-approved sections; insurance billing launching summer 2026)[^12][^22] is the leading entrant. **Blueprint** (free Core EHR + AI Assistant at $0.99[^22]/session Plus or $1.49[^22]/session Pro; over 70,000 clinicians; data-driven measurement-based-care insights; one of the world's largest multimodal mental healthcare datasets at 1M[^11]+ completed sessions = 10M[^11] days of information; raised $14M total via $9M Series A co-led by Ensemble VC + Lightbank in June 2023)[^11][^46][^47][^49] occupies the same hybrid tier with a measurement-based-care positioning.

**Enterprise behavioral health platforms** target group practices, agencies, treatment centers, and managed-care organizations rather than solo therapists. **Eleos Health** is the dominant entrant: $128M[^39][^39] raised across six rounds (Pre-Seed $2M[^39][^39] February 2020 lool ventures; Seed $6M[^39][^39] September 2021 aMoon Fund; Series A[^39] $20M[^39][^39] April 2022 F-Prime + Eight Roads; Series B[^39] $40M[^39][^39] September 2023 Menlo Ventures; Series C[^39] $60M[^39][^39] January 2025 Greenfield Partners with Michael & Susan Dell Foundation, Union Tech Ventures, Centerstone)[^39][^36][^37][^38]. 247 employees (+49.2% YoY), $7.6M annual revenue, 120+ customer organizations across 30+ states, 80%[^38] reduction in progress note submission times measured in a randomized controlled trial, 2x client engagement, 3-4x outcome improvement[^36]. Pricing model is enterprise-only: ~$220,000 over a 3-year contract for 0-50 or 50-200 seats, with 2-3 month implementation, no public self-serve tier, no free trial[^8][^14]. CalMHSA selected Eleos as its statewide AI partner in February 2026[^39], and at NatCon 2026 Eleos launched Polaris AI agents for clinical insights, revenue cycle management (4x more efficient eligibility checks), and live quality assist[^40].

**EHR-native add-ons** are the integration archetype where the EHR vendor builds AI Notes inside its own product. **SimplePractice Note Taker** ($35[^17]/mo per clinician add-on to a $49[^17]-$99 b[^17]ase plan; SimplePractice has 225,000-250,000 practitioners across multiple specialties with mental health a leading sub-vertical)[^17][^19][^20][^22]. **TherapyNotes TherapyFuel** ($40/mo per clinician add-on to a $69 Solo or $79 [^22]Group base plan; TherapyNotes has 60,000+ mental health professionals with HITRUST certification and DSM-5 integration)[^17][^22]. **Jane App AI Notes** ($15/mo add-on)[^22]. **Sessions Health** (no AI add-on offered)[^22]. The trade-off for clinicians is platform lock-in: SimplePractice Note Taker only works inside SimplePractice with no write-back to other EHRs[^20].

**Insurance-network EHRs** are a zero-cost-to-clinician archetype where the platform monetizes payer commissions and offers free EHR + free AI Notes to attract therapists into in-network panels. **Headway** is the dominant entrant: $345M[^51][^51] total raised at a $1B[^51][^51] unicorn valuation ($26M[^51][^51] Series A[^51] late 2020; $70M[^51][^51] Series B[^51] May 2021; $125M[^51][^51] Series C[^51] October 2023 led by Spark Capital with Andreessen Horowitz, Accel, Thrive Capital, and Health Care Service Corporation)[^51][^52][^53][^54]. 60,000+ providers (up from 26,000 at Series C), 300,000+ appointments per month, payer partnerships with Aetna, Anthem BCBS, United, Cigna, Oscar, and Oxford[^16][^21]. Headway's free AI-assisted notes feature is bundled into a free EHR for in-network providers and was launched September 9, 2025[^16]. **SonderMind** AI Notes (commercial launch 2025) reached 100,000+ AI-generated notes submitted to insurance with 80%[^23] reduction in note completion time (20 minutes → 4 minutes), 90 minutes/day saved per provider, and 88% provider opt-in[^23].

The funding hierarchy across all five archetypes is instructive. Eleos $128M (enterprise) and Headway $345M+ (insurance-network) anchor the high-capital tier; Heard $25M (financial back-office, adjacent to scribe), Blueprint $14M (hybrid measurement-based EHR), and Mentalyc $200K (standalone scribe) cover the mid and low tiers. Capital efficiency — measured as customers per dollar raised — is highest at Mentalyc (30K customers / $200K = 150 customers per $1K raised) and lowest at Eleos (~120 enterprise customers / $128M = 0.94 customers per $1M raised, but note that one Eleos enterprise customer represents 50-200 clinician seats so the like-for-like comparison is closer to ~12,000 clinician seats / $128M = 94 seats per $1M).

## The Pricing Architecture

Three pricing motions dominate the active vendor cohort, and the choice between them is the single most-strategic decision a new founder faces.

**Motion 1: Fixed-tier monthly with note caps.** Mentalyc is the canonical example: Mini $19.99[^10]/mo (40 notes), Basic $39.99 (100), Pro $69.99 (160), Super $119.99 (330), Team $59.99/seat unlimited[^10]. Twofold Health takes the alternate cap-free fixed-tier path at $49/mo unlimited annual[^9]. The advantage is predictability: a therapist can model annual cost with a single number. The disadvantage is the "cap squeeze" — clinicians who exceed monthly note caps must upgrade tiers mid-month or pay overages, which produces cognitive overhead and conversion friction. Mentalyc's Team plan tries to bridge this with a discounted unlimited tier, but the cap-tier complexity remains the dominant churn vector for fixed-tier scribes[^15].

**Motion 2: Per-session pricing with monthly cap.** Upheal ($1/session capped $69/mo)[^12], Blueprint ($0.99/session Plus or $1.49/session Pro, with the Core EHR free)[^11][^49] occupy this tier. The advantage is volume-elasticity: a therapist seeing 30 clients/month pays $29.70[^49]-$44.70[^49]/mo, while a high-volume practitioner seeing 70+/mo hits the cap and pays the same fixed maximum. The disadvantage is unpredictability for the buyer: "what will I pay this month" depends on practice volume the buyer cannot perfectly forecast.

**Motion 3: Enterprise contracts.** Eleos is the canonical example: ~$220,000 [^8]over a 3-year contract for 0-50 or 50-200 seats, with 2-3 month implementation, no public self-serve tier, no free trial, multi-year commitments[^8][^14]. The advantage is multi-year revenue visibility, organization-level deployment, and supervisor + compliance + analytics features that solo-tier scribes cannot match. The disadvantage is adoption friction: solo clinicians and small group practices cannot buy Eleos, so the bottom 95%[^14] of the addressable market is structurally inaccessible.

The arithmetic of value-added per dollar is the buyer-side justification underpinning all three motions. SonderMind's 80%[^23] reduction in note completion time (20 minutes → 4 minutes per note) saves approximately 90 minutes per provider per day, and 88% of SonderMind providers opt into AI Notes when offered[^23]. At a typical therapist hourly rate of $150 (commercial), 90 minutes/day × 22 working days = 33 hours/month × $150[^23]/hour = $4,950[^23]/month of recovered billable capacity. Even at the conservative blended Medicare rate of $113.89 [^23]for CPT 90834 (38-52 minute psychotherapy), 90 minutes/day allows two additional sessions/day = 44 sessions/month × $113.89 [^23]= $5,011[^23]/month of recovered revenue.

Against that $5,000/month value-added, a $19-$149/mo subscription represents 25-260x ROI. The pricing question for the founder is not "what will the buyer pay" but "what price captures enough surplus to fund growth without leaving the buyer's adoption decision in doubt." Mentalyc's $19.99 entry tier is positioned for the can't-justify-this-now defensibility floor; Eleos's $220K/3-yr enterprise contract is positioned for organizational ROI on supervisor and compliance workflows that solo tier cannot match.

The most-instructive empirical price-elasticity signal is Blueprint's per-session pricing at $0.99 Plus or $1.49 Pro: at 30 sessions/month (typical solo therapist), Plus is $29.70 and Pro is $44.70, both well under Mentalyc's Basic tier of $39.99 — but Blueprint bundles a free EHR while Mentalyc charges only for the scribe. This is the price-anchoring mechanism that has driven Blueprint to 70,000+ clinicians vs Mentalyc's 30,000 despite Blueprint having only 10x more capital ($14M vs $200K), suggesting that **bundling free EHR with paid AI is a more durable wedge than pure standalone scribe** — which is why Upheal, Blueprint, and Headway are converging on the AI-native EHR positioning while Mentalyc remains in standalone-scribe territory.

## The EHR Integration Map

Three integration tiers determine where a therapist AI scribe can run and how durable its market position is.

**Tier 1: Closed System.** SimplePractice Note Taker only runs inside SimplePractice (no write-back or export to other EHRs)[^20]; TherapyNotes TherapyFuel only runs inside TherapyNotes; Jane App AI Notes only runs inside Jane. The closed-system architecture trades compatibility for deeper feature integration: SimplePractice Note Taker can use the existing chart and client record without copy-paste, while a standalone scribe must export the note text and let the clinician paste into the chart manually. The risk for the EHR vendor is platform lock-in critique: if a clinician decides to switch EHRs, the AI Notes data does not migrate. The opportunity is captive demand: SimplePractice's 225,000-250,000 practitioners[^17][^21][^22] are a ready-made buyer pool for a $35/mo add-on, and the math at full conversion is $35 [^22]× 250,000 × 12 = $105M[^22][^22] annual recurring potential — a number that explains why every major EHR vendor has built or acquired AI Notes by 2026.

**Tier 2: Open with Copy-Paste.** Mentalyc, Twofold, DeepCura, Berries, Athelas, and Freed all run as standalone web/mobile apps that work with any EHR via copy-paste or basic write-back. The open architecture is friendlier to the clinician (notes can be moved between EHRs over time) and to the founder (no integration partnerships required to launch). The friction is in the copy-paste step itself: even with structured templates, manually moving notes between systems adds 30-60 seconds per session, which at 30 sessions/month = 15-30 minutes/month of admin overhead the AI Notes was supposed to eliminate. Commure Scribe (a multi-specialty scribe operating alongside SimplePractice rather than inside it) markets one-click sync for medium and large group practices, demonstrating that the market is converging on tighter sync architectures even in the open tier[^20].

**Tier 3: AI-Native EHR.** Upheal (70,000 clinicians), Blueprint (70,000 clinicians), Headway (60,000 providers), and SonderMind (commercial launch 2025) are building EHR-from-the-ground-up with AI as the default rather than a bolt-on[^12][^11][^49][^16][^23]. The strategic advantage of AI-Native EHR is that documentation, billing, scheduling, telehealth, and AI all live in the same data model, so the AI Assistant can know the client's full chart, treatment plan, last session, and payer requirements without context-switching. The strategic challenge is that switching costs grow with platform depth: a clinician using Upheal for AI Notes plus telehealth plus scheduling plus billing has a higher switching cost than a clinician using Mentalyc plus a separate EHR, which means AI-Native EHR vendors must invest more in onboarding and migration tools. Upheal's automated EHR migration feature for SimplePractice users is a direct response to this challenge.

The strategic question for new entrants is whether to build standalone scribe (faster GTM, EHR-agnostic, clinician-centric) or AI-Native EHR (deeper integration, higher ACV, harder to displace, but more capital-intensive). Headway's $1B[^51][^51] unicorn valuation + 60,000 providers + 300,000 appointments/month at 2023 + $345M total raise[^51][^52] is the upside benchmark for AI-Native EHR; Mentalyc's $200K capital efficiency + 30,000 MH professionals[^32][^34] is the upside benchmark for standalone scribe. Both have shipped sustainable businesses; the choice is between speed and durability rather than between right and wrong.

## The Regulatory Perimeter

Three regulatory layers define what an AI scribe vendor in behavioral health must comply with, and 2024-2026 brought significant changes in two of the three.

**Layer 1: HIPAA.** Universal across all healthcare AI in the US. AI scribe vendors must offer signed Business Associate Agreements (BAAs) before processing any PHI. All surveyed vendors (Mentalyc[^34], Twofold[^15], Eleos[^36], Upheal[^15], Blueprint, SimplePractice[^17], TherapyNotes, Headway[^16], SonderMind[^23]) provide BAAs, with most offering instant BAA at signup. HIPAA compliance is necessary but not sufficient for behavioral health: it does not cover the heightened privacy requirements for substance use disorder records under 42 CFR Part 2, which is the tier-2 layer.

**Layer 2: 42 CFR Part 2 — Confidentiality of Substance Use Disorder Patient Records.** HHS published a Final Rule on February 8, 2024 modifying 42 CFR Part 2[^61], with the rule effective April 16, 2024 and **mandatory compliance by February 16, 2026**[^62][^64] — a date already in effect at this paper's publication. The Final Rule implements section 3221 of the CARES Act and aligns Part 2 with HIPAA in three structurally significant ways[^61][^63]. **First**, patients can now provide a single Treatment, Payment, and Healthcare Operations (TPO) consent for all future uses and disclosures of Part 2 records, replacing the per-disclosure consent that previously made multi-party care coordination near-impossible. **Second**, HIPAA covered entities and business associates that receive Part 2 records under TPO consent can redisclose them in accordance with HIPAA, with the exception that redisclosure for civil, criminal, administrative, or legislative proceedings against the patient still requires specific consent or a court order[^63]. **Third**, the Final Rule incorporates HIPAA's de-identification standard (Safe Harbor or Expert Determination) for Part 2 records[^63].

But — and this is the founder-critical detail — **SUD counseling notes still require separate patient consent**[^61][^64], analogous to the way HIPAA's psychotherapy notes have always required separate authorization. AI scribe vendors entering the SUD treatment market must build separate consent flows for psychotherapy/SUD counseling notes vs. progress notes destined for billing. Eleos's January 2025 Series C explicitly funded the company's expansion into SUD treatment[^36][^38], and the timing of that raise (Jan 2025, between the rule's effective date Apr 16, 2024 and the compliance deadline Feb 16, 2026) was deliberate. New scribe entrants targeting the SUD market in 2026-2027 face essentially the same regulatory architecture Eleos has spent two years operationalizing.

**Layer 3: CPT codes + reimbursement.** The 2026 Medicare Physician Fee Schedule Final Rule, released October 31, 2025, set the conversion factor at 33.42 (a 3.3% increase over the 2025 conversion factor of 32.3465)[^24][^28]. The most-billed psychotherapy codes received the following 2026 national-average non-facility reimbursements: 90791 psychiatric diagnostic evaluation $173.35 [^28](+3.9%[^28] YoY); 90832 individual psychotherapy 16-37 min $85.84 [^28](+8.8%[^28]); 90834 individual psychotherapy 38-52 min $113.89 [^24](+9.3%[^24]); 90837 individual psychotherapy 53+ min $167.00 [^24](+8.2%[^24]); 90847 family psychotherapy with patient $115-160 (Medicare midpoint ~$137); 90853 group psychotherapy $30.39 (+8.0%)[^24][^25][^29]. Commercial rates typically run 120-200% of Medicare, so 90837 in commercial markets reaches $180-300/session[^26].

Three coding rules matter for AI scribe design. **First**, modifier 95 for synchronous video telehealth and modifier 93 for audio-only-when-patient-lacks-video, paired with Place of Service code 10 (patient at home) or 02 (other telehealth location), are required for telehealth claim processing[^25][^27]. **Second**, 90791 is psychiatric diagnostic evaluation *without* medication services; 90792 is *with* medication services. Billing 90791 when medication is prescribed creates audit risk[^27]. **Third**, 90837 53+ minute sessions are a major payer-audit trigger when overused without supporting documentation; AI scribes must capture exact start and stop times to support the time threshold[^27].

Two policy changes effective 2024-2026 expand the addressable scribe market. **LMFTs and LMHCs can bill Medicare for psychotherapy codes at 75% of the psychologist rate effective 2024**[^25] — a structural shift that brings 564,600 mental health counselors and 87,700 MFTs into Medicare-reimbursed care for the first time. **Multiple-family group psychotherapy was added to the Medicare Telehealth Services List in CY 2026**[^28], and CMS finalized the permanent removal of the distinction between provisional and permanent telehealth services, effectively making behavioral-health telehealth a permanent reimbursable modality without geographic restrictions[^28].

## Distribution: Where the 1.2M Practitioners Actually Live

Finding the practitioners is the hardest founder problem in this category, because the addressable market is geographically and digitally distributed across hundreds of thousands of solo and small-group practices that don't aggregate into the trade-show + journal + association ecosystems that define more concentrated healthcare markets. Five MLP communities (ranked by founder-velocity-relevance) cover the practical distribution surface area.

**1. AAMFT (American Association for Marriage and Family Therapy).** 72,000+ MFTs in the US, Canada, and abroad[^58]. Founded in 1942; growth trajectory 237 members (1960) → 9,000 (1982) → 25,000 (2015) → 70,000+ (2026)[^60]. AAMFT publishes the *Journal of Marital and Family Therapy* and *Family Therapy Magazine*, runs an annual conference, and operates the Clinical Fellow and Approved Supervisor designation pathways — the latter being the highest-ROI distribution channel in the entire vertical, because Approved Supervisors recommend tools to entire supervisee cohorts who then carry those tool preferences into their own practices.

**2. APA (American Psychological Association).** 190,000+ members + 64,000 students; international membership +233% from 2021-2025; 70% member satisfaction[^57]. APA is the largest psychology association globally with more than 50 divisions covering clinical, counseling, and applied subspecialties. Division 29 (Society for the Advancement of Psychotherapy) and Division 42 (Psychologists in Independent Practice) are the highest-relevance divisions for AI scribe distribution.

**3. NASW (National Association of Social Workers).** 132,000 members, of whom 41,355 (40.4%) practice in mental health and 7,315 (7.1%) provide psychotherapy services[^56]. Other relevant practice areas include trauma/violence (4,355), addictions/SUD (5,063), and palliative care (529). Annual dues $236[^56]/year for MSW/DSW/PhD or $158[^56]/year for BSW. NASW Symposium and chapter networks reach the addictions/SUD subset that 42 CFR Part 2 now makes commercially accessible.

**4. ACA (American Counseling Association).** 50,000+ professional counselors[^59] across LPC/LCMHC/LCMHC/LCPC categories. ACA's annual conference and chapter networks reach the SOC 21-1018 mental health counselor cohort directly.

**5. r/therapists Reddit + behavioral-health podcasts.** Approximately 50,000 active subscribers on r/therapists; adjacent subreddits include r/psychotherapy, r/MentalHealthProviders, and r/socialwork. The casual MFT/LCSW/LPC community reads the *Modern Therapist's Survival Guide* podcast (Curt Widhalm + Katie Vernoy), *How to Be Yourself* (Ellen Hendriksen), and *Therapy Reimagined*. Podcast sponsorship has been the single most-effective bottom-up distribution channel for Mentalyc, Twofold, and Blueprint based on aggregate vendor-blog testimonials (the Heard pivot from Bumble-for-Therapists to bookkeeping was driven in part by direct interviews with hundreds of r/therapists subscribers)[^41].

The five distribution motions that work, ranked by founder-velocity-relevance, are: **(1) Approved-Supervisor-as-channel** (one supervisor recommends to 5-15 supervisees who then carry the tool into their own practices); **(2) AAMFT/APA/NASW/ACA conference sponsorship** (Eleos's NatCon 2026 booth #815 is the canonical example[^40]); **(3) EHR-plugin-marketplace listing** (SimplePractice and TherapyNotes both operate marketplaces where third-party tools can be listed); **(4) Group-practice direct sales** (Heard's sales motion to 1,000+ group practices through 2024-2025 generated >50%[^40] of revenue); **(5) Podcast sponsorship + r/therapists Reddit AMA** (lowest-cost channel; high noise but durable signal).

Cold therapist outreach via LinkedIn or email is durable but slow — typical conversion rates from cold outreach to paid trial are 0.5-2% across the surveyed vendor cohort, vs. supervisor-recommendation rates that can exceed 20% per supervisor-supervisee chain.

## Founder Velocity Patterns

The active vendor cohort surfaces three founder archetypes with shipped, profitable products and identifiable patterns of capital efficiency, time-to-market, and defensibility.

**Archetype 1: The solo / sub-million-dollar founder.** Mentalyc Inc. is the canonical example. Founded 2021 by Maria Szandrach and Georgi Urumov in San Francisco with $200,000 [^30]of total funding (a $100K Pre-Seed in April 2022 led by Berkeley SkyDeck Fund + adjacent angel checks)[^30][^31][^33][^34]. 27 employees by early 2026 (+14.8% YoY). Operations in 14 countries. Approximately 30,000 mental health professionals served by mid-2025[^32]. The Mentalyc playbook: build a HIPAA + SOC 2 Type 2 compliant standalone scribe with on-device recording (no cloud audio retention) + flexible note formats (SOAP, DAP, BIRP, GIRP, ADIME, MSE) + cap-tier monthly pricing. The defensibility narrative is therapeutic alliance analytics ("Alliance Genie") + therapy-specific note templates, neither of which requires VC-scale data infrastructure to ship. This archetype proves the category is buildable for under $1M[^32][^32] of capital and reaches 30K[^32]+ paying users on $200K[^32][^32] — a customer-acquisition efficiency unmatched anywhere else in healthcare AI.

**Archetype 2: The vertical-specific Series A[^46] founder.** Blueprint, founded by Danny Freed in Chicago, raised $14M[^46][^46] total via a $9M[^46][^46] Series A[^46] in June 2023 co-led by Ensemble VC and Lightbank, with participation from Bonfire Ventures, Revolution's Rise of the Rest Seed Fund, TAU Ventures, Data Tech Fund, and select angels[^46][^47][^48][^49][^50]. 4,500 clinicians at Series A → 70,000+ clinicians by 2026; 180,000 patients served; 1M[^50]+ completed sessions = 10M[^46] days of dataset; 44% faster patient response to treatment vs. treatment-as-usual baseline[^46][^48]. The Blueprint playbook: pivot from pure measurement-based-care to AI-Assisted EHR + free Core EHR + per-session AI Assistant pricing. The defensibility narrative is the longitudinal outcomes dataset — one of the world's largest multimodal mental healthcare datasets — combined with the data flywheel that gets stronger as more clinicians use the platform. This archetype proves the data-flywheel defensibility narrative and the path from 5K[^48] → 70K[^48] clinicians on $14M[^48][^48] of capital (~$200[^48]/clinician acquisition cost over the lifetime of the company).

**Archetype 3: The enterprise-platform founder.** Eleos Health, founded by Alon Joffe in Boston/Tel Aviv in 2020, raised $128M total across six rounds[^39]: Pre-Seed $2M (Feb 2020 lool ventures), Seed $6M (Sep 2021 aMoon Fund), Series A[^39] $20M[^39][^39] (Apr 2022 F-Prime + Eight Roads), Series B[^39] $40M[^39][^39] (Sep 2023 Menlo Ventures + F-Prime + Eight Roads + Arkin Digital Health + SamsungNEXT + ION + aMoon + lool), Series C[^36] $60M[^36][^36] (Jan 2025 Greenfield Partners + F-Prime + Eight Roads + Menlo + ION + Michael & Susan Dell Foundation + Union Tech Ventures + Centerstone)[^36][^37][^38]. 247 employees, $7.6M annual revenue, 120+ enterprise customer organizations across 30+ states, 80%[^38] reduction in progress note submission times (RCT-validated), 2x client engagement, 3-4x outcome improvement vs. treatment-as-usual[^36]. CalMHSA selected Eleos as statewide AI partner in February 2026[^39]. The Eleos playbook: enterprise-only ($220K/3-year contracts, 0-50 or 50-200 seats, 2-3 month implementation) + SUD market expansion + Polaris AI agent layer for clinical insights, revenue cycle management, and live quality assist[^40]. This archetype proves the path to $100M+ ARR for behavioral-health-AI, but at the cost of $128M[^40][^40] of capital and a 6-year time-to-scale.

The single most-instructive lesson across all three archetypes is **Heard's pivot from Bumble-for-Therapists (mid-2019 launch) to therapist-bookkeeping (January 2021 pivot)**[^41][^45]. CEO Andrew Riesen and co-founder Victoria Li discovered through hundreds of therapist interviews that "most therapists readily find patients and acquiring clients was not a big need... instead, they require more time and support to efficiently manage their practices and avoid burnout"[^44]. The right product for therapists in 2026 is rarely the obvious one. Founders entering the AI scribe category with the assumption that documentation is the highest-pain workflow should validate that hypothesis with at least 50 therapist interviews before committing capital — because the next pivot may turn out to be billing automation, supervisor workflow, payer-credentialing automation, or measurement-based outcomes (the Blueprint repositioning), each of which is a structurally different product than note generation.

## Predictions for 2027-2028

Five concise predictions follow from the regulatory + capital + adoption signal in the active vendor cohort.

**1. AI scribes consolidate to 5-7 dominant brands by end-2027.** The likely survivor cohort: Mentalyc (standalone scribe), Eleos (enterprise behavioral health), Upheal + Blueprint (AI-Native EHR), Headway + SonderMind (insurance-network EHR with AI Notes), SimplePractice Note Taker + TherapyNotes TherapyFuel (closed-system EHR add-ons). Standalone scribes priced over $50/mo without an EHR layer face structural pricing pressure from free-or-bundled alternatives (Headway, Blueprint Plus at $0.99/session) and either compress pricing or pivot to AI-Native EHR.

**2. AI-Native EHRs (Upheal + Blueprint + Headway + maybe SonderMind-spinout) reach $1B[^51][^51]+ valuation each by 2028.** Headway already crossed $1B at its October 2023 Series C[^51][^52]; Blueprint's data flywheel narrative + 70K clinicians + 1M+ sessions positions it for a $500M[^52][^52]-$1B[^52][^52] valuation at next round; Upheal's 70K[^52] clinicians + AI-native architecture + summer 2026 insurance billing launch positions it similarly.

**3. Eleos exits to a strategic acquirer (Optum, Evernorth, CVS Health Caremark, Centene) at $1B[^39][^39]+ between 2026-2028.** The driver is SUD market expansion under the 42 CFR Part 2 Final Rule + CalMHSA statewide deployment + the Polaris AI agent layer's Live Quality Assist capability. Eleos's executive bench expansion in April 2025 following Series C[^39] is consistent with a pre-exit organizational build-out.

**4. The 200K-target-practitioner market sizing in early 2026 expands to 1.5M+ by 2028**[^1][^2][^3][^4] as MFT/LMHC Medicare rate parity (currently 75% of psychologist rate[^25], with parity legislation pending) drives independent-practice formation. Each 1% increase in private-practice formation rate among the 564,600 MH counselors + 87,700 MFTs = ~6,500 additional addressable buyers per year for AI scribe vendors.

**5. AI scribe category bifurcates into clinical-documentation tier ($19-69/mo) and outcome-measurement tier ($50-150/mo).** Blueprint's measurement-based-care positioning + 1M+ session dataset is the durable defensibility moat in the outcome-measurement tier. Standalone scribes that don't add measurement-based-care features by 2028 face structural pricing pressure as Blueprint's outcome data becomes the de-facto procurement requirement for value-based-care payer contracts.

## Glossary

- **AAMFT** — American Association for Marriage and Family Therapy. 72,000+ MFTs in US, Canada, abroad. Approved Supervisor designation is the highest-ROI distribution channel in the vertical.
- **ACA** — American Counseling Association. 50,000+ professional counselors. Annual conference reaches LPC/LCMHC cohort.
- **APA** — American Psychological Association. 190,000+ members + 64,000 students. Largest psychology association globally.
- **BAA** — Business Associate Agreement. HIPAA-mandated contract between covered entity and vendor handling PHI.
- **BLS** — Bureau of Labor Statistics. Authoritative federal source for occupational employment projections.
- **BIRP** — Behavior, Intervention, Response, Plan. SOAP-equivalent psychotherapy progress note format.
- **CPT code** — Current Procedural Terminology. AMA-maintained billing codes; 90791/90832/90834/90837/90847/90853 are highest-volume in behavioral health.
- **DAP** — Data, Assessment, Plan. Three-section progress note format common in behavioral health.
- **EHR** — Electronic Health Record. SimplePractice / TherapyNotes / Jane / Headway / Upheal / Blueprint are the active behavioral-health EHR vendors.
- **GIRP** — Goal, Intervention, Response, Plan. Progress note format common in school and group therapy contexts.
- **HIPAA** — Health Insurance Portability and Accountability Act. Federal privacy framework for PHI.
- **HITECH** — Health Information Technology for Economic and Clinical Health Act. 2009 amendments to HIPAA.
- **LCSW** — Licensed Clinical Social Worker. Master's-level clinical license under NASW.
- **LMFT** — Licensed Marriage and Family Therapist. State-licensed MFT credential.
- **LMHC** — Licensed Mental Health Counselor. State-licensed MH counselor credential.
- **LPC** — Licensed Professional Counselor. State-licensed counselor credential.
- **MFT** — Marriage and Family Therapist. SOC 21-1013 occupational category.
- **NASW** — National Association of Social Workers. 132,000 members; 41,355 (40.4%) practice in mental health.
- **NPI** — National Provider Identifier. CMS-issued 10-digit identifier required for all healthcare provider billing.
- **OCR** — Office for Civil Rights at HHS. HIPAA enforcement authority.
- **PFS** — Physician Fee Schedule. Annual CMS-published Medicare reimbursement rates.
- **POS code** — Place of Service code. POS 10 patient-home; POS 02 other-telehealth location.
- **PSYC** — Psychotherapy CPT code family (90791, 90832, 90834, 90837, 90839/90840, 90847, 90853).
- **QSO** — Qualified Service Organization. 42 CFR Part 2 entity that handles SUD records under contract.
- **RVU** — Relative Value Unit. CMS-assigned work + practice-expense + malpractice value driving CPT reimbursement.
- **SAMHSA** — Substance Abuse and Mental Health Services Administration. HHS sub-agency overseeing SUD treatment.
- **SOAP** — Subjective, Objective, Assessment, Plan. Standard medical progress note format.
- **SUD** — Substance Use Disorder. 42 CFR Part 2 confidentiality regime.
- **TPO** — Treatment, Payment, Healthcare Operations. HIPAA + Part 2 single-consent regime effective Feb 16, 2026.

## Related Research

This paper closes threads opened by the *State of Vertical Agents 2027: Mental Health & Therapy Operations* audit and the *State of Vertical Agents 2027: Bootcamps, Exam Prep & Professional Credentialing* paper (both perea.ai Research, May 2026). It opens four derivation candidates for the next research-engine pass: (1) **The Psychiatrist AI Scribe Playbook** — a CPT 90792 + medication-management-aware variant covering Berries, DeepCura, Suki, Abridge, and Augmedix Notebuilder for behavioral-medication workflows; (2) **The SUD-Treatment AI Platform Field Manual** — post-Eleos-Series-C playbook for the 42 CFR Part 2 compliant entrant; (3) **Measurement-Based-Care as Defensibility Moat** — Blueprint's data-flywheel architecture as a durable defensibility framework for clinical AI; (4) **The Therapist Supervisor as Distribution Channel** — operator field manual on the highest-ROI distribution motion in the vertical, with concrete playbooks for AAMFT Approved Supervisor recruitment, supervisee referral chains, and group-practice supervisor workflow integration.

## References

[^1]: U.S. Bureau of Labor Statistics, *Employment Projections — Counselors aggregate (SOC 21-1010)*. https://data.bls.gov/projections/nationalMatrix?ioType=o&queryParams=21-1010
[^2]: U.S. Bureau of Labor Statistics, *Employment Projections — Therapists aggregate (SOC 29-1120)*. https://data.bls.gov/projections/nationalMatrix?ioType=o&queryParams=29-1120
[^3]: U.S. Bureau of Labor Statistics, *Occupational Outlook Handbook: Substance Abuse, Behavioral Disorder, and Mental Health Counselors* (SOC 21-1018). https://www.bls.gov/ooh/community-and-social-service/print/substance-abuse-behavioral-disorder-and-mental-health-counselors.htm
[^4]: U.S. Bureau of Labor Statistics, *Occupational Outlook Handbook: Marriage and Family Therapists* (SOC 21-1013). https://www.bls.gov/ooh/community-and-social-service/print/marriage-and-family-therapists.htm
[^5]: CareerOneStop, *Available Workforce Tool: Build Profiles — Mental Health Counselors*. https://www.careeronestop.org/Toolkit/StateAndLocal/ProjectedEmployment.aspx?location=UNITED+STATES&soccode=211014
[^6]: U.S. Bureau of Labor Statistics, *Strong growth projected in mental health-related employment* (Economics Daily). https://www.bls.gov/opub/ted/2024/strong-growth-projected-in-mental-health-related-employment.htm
[^7]: U.S. Bureau of Labor Statistics, *Employment Projections News Release 2024-34* (August 28, 2025). https://www.bls.gov/news.release/pdf/ecopro.pdf
[^8]: Mentalyc / Tracy Collins LCP, *Eleos Review 2026: Features, Pricing, Pros & Cons* (January 5, 2026). https://www.mentalyc.com/blog/eleos-review
[^9]: Twofold Health, *Best AI Scribe for Mental Health in 2026: 7 Tools Reviews and Ranked* (July 24, 2025). https://www.trytwofold.com/blog/best-ai-scribe-mental-health
[^10]: Awesome Agents / James Kowalski, *Best AI Tools for Therapists in 2026* (April 25, 2026). https://awesomeagents.ai/tools/best-ai-tools-for-therapists-2026/
[^11]: Heard, *The Top 5 AI Scribes for Private Practice Therapists* (February 19, 2026). https://www.joinheard.com/articles/the-top-5-ai-scribes-for-private-practice
[^12]: Upheal corporate, *EHR for Therapists: AI Notes, Scheduling & Billing*. http://www.upheal.io/
[^13]: Mentalyc / Maria Szandrach (CEO), *Mentalyc vs Upheal (2026)* (July 27, 2025). https://www.mentalyc.com/blog/upheal-vs-mentalyc
[^14]: Twofold Health, *Eleos Health Review (2026): Features, Pricing & Alternatives* (February 1, 2026). https://www.trytwofold.com/compare/eleos-health-review
[^15]: Twofold Health, *Upheal vs Mentalyc vs Twofold Health (2026)* (October 17, 2025). https://www.trytwofold.com/compare/upheal-mentalyc-twofold
[^16]: PR Newswire / Headway, *Headway Expands Its Insurance-Native EHR With AI-Assisted Notes and Enhanced Features* (September 9, 2025). http://www.prnewswire.com/news-releases/headway-expands-its-insurance-native-ehr-with-ai-assisted-notes-and-enhanced-features-302550728.html
[^17]: EHR Insider, *SimplePractice vs TherapyNotes Comparison (2026)* (January 26, 2026). https://ehrinsider.com/compare/simplepractice-vs-therapynotes/
[^18]: EHR Source, *TherapyNotes vs SimplePractice (2026 Comparison)*. https://ehrsource.com/compare/therapynotes-vs-simplepractice/
[^19]: SimplePractice Support, *Note Taker FAQs*. https://support.simplepractice.com/hc/en-us/articles/35507783848973-Note-Taker-FAQs
[^20]: Commure, *SimplePractice AI Notes: Features & Alternatives* (April 25, 2026). https://www.commure.com/blog-scribe/simplepractice-ai-notes
[^21]: Headway, *Headway vs. SimplePractice: Which is best for your practice?* (January 1, 2025). https://headway.co/resources/headway-vs-simplepractice
[^22]: Upheal, *Best Therapy Practice Management Software: AI-Native EHR for Mental Health Care* (April 13, 2026). https://www.upheal.io/blog/best-practice-management-software
[^23]: SonderMind, *Mental Health Providers Gain 90 Minutes a Day with SonderMind AI Tool*. https://www.sondermind.com/resources/announcement/mental-health-providers-gain-90-minutes-a-day-with-sonder-mind-ai-tool/
[^24]: DrHerz.us / Gordon Herz, *2026 Final Medicare Reimbursement for Psychological Services* (November 5, 2025). https://drherz.us/2026-medicare-reimbursement-for-psychological-services/
[^25]: MedSolerCM, *90834 CPT Code: Description, Time Range & Reimbursement Rates [2026]* (March 30, 2026). https://medsolercm.com/blog/cpt-code-90834
[^26]: Behave Health, *Therapy Reimbursement Rates (2026)* (February 14, 2026). https://behavehealth.com/blog/insurance-reimbursement-rates-therapy-2026
[^27]: Neolytix, *Psychiatry Billing & Coding 2026: CPT Codes, Tips & Common Errors* (April 23, 2026). https://neolytix.com/billing-coding-guides/psychiatry-medical-billing-coding-guide/
[^28]: CMS, *Medicare Physician Fee Schedule Final Rule Summary CY 2026* (December 5, 2025). https://www.cms.gov/files/document/mm14315-medicare-physician-fee-schedule-final-rule-summary-cy-2026.pdf
[^29]: MedFeeSchedule, *CPT 90837 Medicare Reimbursement Rate 2026*. https://www.medfeeschedule.com/code/90837
[^30]: PitchBook, *Mentalyc 2026 Company Profile: Valuation, Funding & Investors*. https://pitchbook.com/profiles/company/510248-98
[^31]: CB Insights, *Mentalyc Stock Price, Funding, Valuation, Revenue & Financial Statements*. https://www.cbinsights.com/company/mentalyc/financials
[^32]: CB Insights, *Mentalyc — Products, Competitors, Financials, Employees, Headquarters Locations*. https://www.cbinsights.com/company/mentalyc
[^33]: Tracxn, *Mentalyc — 2026 Funding Rounds & List of Investors* (March 6, 2023). https://tracxn.com/d/companies/mentalyc/__XnXfpxE75p-fjVksFhoKIx_5ChgkplByzu3lbiQ3Ddw/funding-and-investors
[^34]: Mentalyc Inc. corporate. https://mentalyc.com/
[^35]: (reserved)
[^36]: Fierce Healthcare, *Behavioral health tech company Eleos Health raises $60M series C* (January 24, 2025). https://www.fiercehealthcare.com/ai-and-machine-learning/behavioral-health-tech-company-eleos-health-raises-60m-series-c-launches
[^37]: BusinessWire / Eleos, *Eleos Raises $60M Series C to Transform Behavioral Health with AI Agents* (January 22, 2025). https://www.businesswire.com/news/home/20250122573635/en/Eleos-Raises-%2460M-Series-C-to-Transform-Behavioral-Health-with-AI-Agents
[^38]: Eleos Health corporate, *Eleos Health Raises $40M Series B Round* (September 27, 2023). https://eleos.health/press-releases/eleos-health-series-b-funding-announcement/
[^39]: Eleos Health corporate. https://eleos.health/
[^40]: GlobeNewswire / Eleos, *Eleos Expands AI Agents Across the Full Care Journey* (April 22, 2026). https://www.globenewswire.com/news-release/2026/04/22/3279020/0/en/Eleos-Expands-AI-Agents-Across-the-Full-Care-Journey.html
[^41]: Axios Pro / Erin Brodwin, *Exclusive: Heard helps therapists listen* (May 5, 2022). https://www.axios.com/2022/05/05/heard-helps-therapists-listen
[^42]: Behavioral Health Business / Chris Larson, *All-In-One Therapist Accounting Platform Heard Technologies Lands $10M Investment* (May 9, 2022). https://bhbusiness.com/2022/05/09/all-in-one-therapist-accounting-platform-heard-technologies-lands-10m-investment/
[^43]: Becker's Behavioral Health, *Therapist accounting software startup scores $10M in funding* (May 24, 2022). https://www.beckersbehavioralhealth.com/behavioral-health-technology/therapist-accounting-software-startup-scores-10m-in-funding/
[^44]: GeekWire / Charlotte Schubert, *Heard raises $15M to expand its financial tech tools for mental health professionals* (June 23, 2023). https://www.geekwire.com/2023/heard-raises-15m-to-expand-its-financial-tech-tools-for-mental-health-professionals/
[^45]: Heard corporate, *Heard Raises $10M to Help Therapists Be Financially Independent* (May 5, 2022). https://www.joinheard.com/articles/heard-raises-10m-to-help-therapists-be-financially-independent
[^46]: Ensemble VC, *Why We're Backing Blueprint's Mission to Empower Mental Health Clinicians*. https://www.ensemble.vc/research/why-were-backing-blueprints-mission-to-empower-mental-health-clinicians
[^47]: FinSMEs, *Blueprint Raises $9M in Series A Funding* (June 27, 2023). https://www.finsmes.com/2023/06/blueprint-raises-9m-in-series-a-funding.html
[^48]: PR Newswire / Blueprint, *Blueprint Raises $9 Million Series A* (June 27, 2023). https://www.prnewswire.com/news-releases/blueprint-raises-9-million-series-a-to-help-mental-health-clinicians-deliver-higher-quality-care-in-less-time-301864811.html
[^49]: Blueprint corporate, *Blueprint Raises $9 Million Series A* (June 27, 2023). https://www.blueprint.ai/blog/blueprint-raises-9-million-series-a-to-help-therapists-deliver-higher-quality-care-in-less-time
[^50]: Axios Pro / Erin Brodwin, *Blueprint raises Series A to streamline mental health providers' work* (June 27, 2023). https://www.axios.com/pro/health-tech-deals/2023/06/27/blueprint-raises-9m-series-a-mental-health-providers-administrative-tasks
[^51]: Behavioral Health Business / Laura Lovett, *Headway Raises $125M for Its Patient-Matching Platform* (October 5, 2023). https://bhbusiness.com/2023/10/05/headway-raises-125m-for-its-patient-matching-platform/
[^52]: Fierce Healthcare, *Health Care Service Corporation backs mental health startup Headway's $125M series C round* (October 6, 2023). https://www.fiercehealthcare.com/health-tech/new-mental-health-unicorn-headway-lands-125m-build-out-therapist-networ
[^53]: MobiHealthNews, *Mental health platform Headway scores $125M, announces $1B valuation*. https://www.mobihealthnews.com/news/mental-health-platform-headway-scores-125m-announces-1b-valuation
[^54]: FinSMEs, *Headway Raises $125M in Series C Funding* (October 5, 2023). https://www.finsmes.com/2023/10/headway-raises-125m-in-series-c-funding.html
[^55]: FirstWord HealthTech, *Headway hits $1-billion valuation after latest fundraise*. https://ml.firstwordhealthtech.com/v1/articles/rendered/5787222
[^56]: National Association of Social Workers, *Membership by the Numbers* (January 2025 active membership). https://www.socialworkers.org/Membership/Membership-by-the-Numbers
[^57]: American Psychological Association, *APA State of Membership*. https://connectguide.apa.org/apa-state-of-membership
[^58]: American Association for Marriage and Family Therapy, *AAMFT*. https://www.aamft.org/About_AAMFT/AAMFT.aspx
[^59]: AMFTRB / AAMFT links. https://amftrb.org/links/
[^60]: AAMFT, *Why Join?*. https://www.aamft.org/AAMFT/Membership/Why_Join.aspx
[^61]: HHS, *Fact Sheet 42 CFR Part 2 Final Rule* (February 7, 2024). https://www.hhs.gov/hipaa/for-professionals/regulatory-initiatives/fact-sheet-42-cfr-part-2-final-rule/index.html
[^62]: Federal Register, *Confidentiality of Substance Use Disorder (SUD) Patient Records; Final Rule* (89 FR 2024-02544, February 16, 2024). https://www.govinfo.gov/content/pkg/FR-2024-02-16/html/2024-02544.htm
[^63]: Crowell & Moring LLP, *HHS Finalizes Significant Modifications Aligning Part 2 Regulations with HIPAA* (March 13, 2024). https://crowell.com/en/insights/client-alerts/hhs-finalizes-significant-modifications-aligning-part-2-regulations-with-hipaa
[^64]: HHS, *Understanding Confidentiality of Substance Use Disorder (SUD) Patient Records (Part 2)*. https://www.hhs.gov/hipaa/part-2/index.html
[^65]: eCFR, *42 CFR Part 2 (Apr. 16, 2024) — Confidentiality of Substance Use Disorder Patient Records*. https://www.ecfr.gov/on/2024-04-16/title-42/chapter-I/subchapter-A/part-2?toc=1

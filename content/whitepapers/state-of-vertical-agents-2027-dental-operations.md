---
title: "State of Vertical Agents 2027: Dental Operations"
subtitle: "200,000 dentists, the DSO consolidation wave, and the AI-native imaging / patient-engagement / claim-defense layer reshaping the second-largest vertical-healthcare market"
publication: "perea.ai Research"
authors: ["Dante Perea"]
version: "1.0"
status: "Public draft"
date: "2026-05"
audience: "Founders building dental-vertical AI products, DSO operators, dental-investment professionals (PE / lender-side), independent practice owners evaluating sale or affiliation, dental-vendor product leaders, and policymakers tracking corporate-practice-of-dentistry reform"
length: "~10,000 words"
license: "CC BY 4.0"
description: "Authority survey of the U.S. dental-operations continuum entering 2027 — a $172-203 billion services market consolidating into the top-10 DSOs (Heartland, Aspen TAG, PDS Health, Smile Doctors, Smile Brands, Dentalcorp), the FDA-cleared dental-AI imaging triopoly (Pearl, Overjet, VideaHealth), the practice-management EHR triopoly (Henry Schein One Dentrix, Patterson Eaglesoft, Planet DDS Denticon), and the regulatory bifurcation between PL 119-21 OBBBA Medicaid compression and California SB 351 corporate-practice-of-dentistry codification."
profile: "field-manual"
---

## Foreword

The U.S. dental industry in 2026 is at three simultaneous inflection points. First, demographics: the American Dental Association Health Policy Institute's *2025 Dentist Workforce* update reports 202,485 active U.S. dentists in 2024, a slight decline from the 202,536 peak in 2022 and the first plateau in a half-century of monotonic growth.[^1] Behind that headline a generational replacement is underway — 13,742 new dental school graduates in 2024 (a record) entering the workforce as a baby-boomer retirement cohort exits at an average age of 68.[^1] Second, ownership consolidation: only 73% of U.S. dentists were practice owners in 2023, down sharply from 85%[^112] in 2005, and 13.8%[^112] are now affiliated with a Dental Services Organization, up from 7.4% in 2015.[^112] Third, the productization of FDA-cleared dental AI: by early 2026, Pearl holds 8 FDA 510(k) clearances, Overjet holds 10, and VideaHealth's K232384 clearance now covers 10 pathologies and 25 findings across patients aged 3 and up.[^123][^49][^54][^55]

Three structural shifts in twenty-four months reset the operating ground for the entire dental-services continuum. First, the ADA's CDT 2026 update — effective January 1, 2026 — introduces 60 code changes including a sweeping anesthesia overhaul and new D-codes for point-of-care saliva testing, cracked-tooth testing, peri-implantitis scaling, and occlusal-guard cleaning, codifying the procedure-granularity baseline that AI-native diagnostic systems must match.[^98][^100] Second, Section 71111 of Public Law 119-21 (the One Big Beautiful Budget Act, signed July 4, 2025) — which removed the federal nursing-home staffing mandate analyzed in the senior-care companion paper — is paired with broader Medicaid compression provisions that cap state-directed payments at FFS rates, reduce the provider-tax safe harbor from 6.0%[^104] to 3.5%[^104] for ACA-expansion states (first reduction October 1, 2026 affecting 22 states), and tighten Medicaid eligibility through semi-annual redeterminations and 80-hour-per-month work requirements.[^104][^108][^106] Third, California SB 351 (signed October 6, 2025; effective January 1, 2026) codifies long-standing but previously informal Corporate Practice of Medicine and Corporate Practice of Dentistry restrictions on private-equity- and hedge-fund-owned management platforms — the leading edge of state-level CPOD reform that is likely to be replicated in 2027-2028.[^110][^111]

The thesis of this paper is straightforward: dental operations are the **second-largest labor-replaceable vertical for AI-native agents** in healthcare delivery, behind only senior-care operations as analyzed in the prior paper in this series. The combination of FDA-cleared diagnostic AI (Pearl + Overjet + VideaHealth) compounding inside a consolidating DSO buyer base (the top 10 DSOs support roughly 7,350 offices), a regulatory bifurcation that shapes both the Medicaid revenue floor and the corporate-ownership ceiling, and an EHR triopoly (Henry Schein One Dentrix, Patterson Eaglesoft, Planet DDS Denticon) that is racing to embed AI-augmentation natively, has produced a market structure that compounds in favor of vertical-AI operators.[^24][^123][^68] What follows is a survey of how the pieces fit together as of May 2026, intended for founders, DSO operators, dental-investment professionals, independent practice owners, dental-vendor product leaders, and policymakers tracking CPOD reform.

## Executive Summary

Six findings frame the paper.

**1. The TAM is approximately $200 billion[^18] and growing 4.4-5.2%[^18] CAGR.** Five major analyst firms converge on a U.S. dental-services market sized at $172-203 billion in 2025, with growth projections of $234-286 billion by 2031-2035. Grand View Research puts the market at $192.22 billion in 2023 growing to $242.88 billion by 2030 at 3.3% CAGR.[^18] GII Research sizes the market at $202.83 billion in 2025 reaching $266.12 billion by 2031 at 4.61% CAGR.[^19] Mordor Intelligence pegs 2025 at $174.2 billion growing to $234.11 billion by 2031 at 5.05% CAGR.[^22] Towards Healthcare estimates $166.5 billion in 2024 reaching $254.7 billion by 2034 at 4.4% CAGR.[^20] Cervicorn Consulting projects $172.56 billion in 2025 reaching $286.04 billion by 2035 at 5.18% CAGR.[^21] The variance reflects definitional choices (does the figure include orthodontics? cosmetic dentistry? OOP private-pay?) more than measurement disagreement.

**2. The DSO consolidation wave hit a new scale benchmark.** The top 10 DSOs support approximately 7,350 offices combined. Heartland Dental supports 3,000+ doctors at 1,900+ locations across 39 states and DC; Aspen Group / TAG supports 1,400+ locations across 46 states with 9 million+ patients in 2025; PDS Health crossed $3.1 billion[^24] in revenue 2025 across 1,100+ practices; Smile Doctors operates 550+ orthodontic locations; MB2 Dental operates 750+ locations; Sonrava nearly 600.[^24][^125][^127][^129][^132][^30] **Twenty-seven of the top 30 DSOs are private-equity-majority-owned.**[^29] Average acquisition multiples run 4-7x EBITDA at the practice level, scaling to 8-12x for platform purchases per FOCUS Investment Banking 2026 data.[^158][^29] Practice consolidation hit 242 dental transactions in 2024 and 180 in 2023, with FOCUS forecasting 2026 to be the most active dental M&A year since 2002.[^138][^158]

**3.

AI-native dental products achieved FDA-cleared maturity.**

Pearl holds 8 FDA 510(k) clearances by early 2026 spanning bitewing/periapical (Second Opinion K210365 March 2022) plus panoramic (January 2026), CBCT, and bone-level analysis (September 2025), with reported 94%[^47] accuracy and 36% more lesions detected versus unaided readers across MRMC studies.[^47][^48][^49][^50][^51][^123]

Overjet holds 10 FDA clearances by December 2025, including CBCT Assist (10th total), with reported 32%[^52] more carious surfaces detected and 45% fewer missed teeth versus unaided dentists.[^52][^54][^55][^87][^123]

Pearl reached 500,000+ practices commercially across 6 continents and 120 countries, with 458% revenue growth in 2023.[^136] Overjet covers 75 million-plus Americans via dental insurer customers, scaling to 120 million-plus payer membership coverage including the majority of the 10 biggest U.S. dental insurers.[^52][^137][^54]

VideaHealth's $40 million Series B (January 2025, Threshold Ventures-led) brought the company to $70 million[^81] total funding with $6.8 million 2024 revenue, 300 customers, and 87 employees.[^81][^85] VideaHealth Clinical Assist AI is now integrated across Aspen Group's 1,100+ practices and is in deployment with Heartland Dental and Dentalcorp Canada.[^141][^150]

**4.

The PMS / EHR triopoly is consolidating.**

Three major platform stacks dominate dental practice management software: **Henry Schein One** (Dentrix + Dentrix Ascend + DEXIS + Lighthouse 360 + Jarvis Analytics) at approximately 35,000 practices and ~19%[^65] market share; **Patterson Dental** (Eaglesoft + Fuse) at ~30,000 users[^65]; **Planet DDS** (Denticon + Cloud 9 + Apteryx, KKR-backed) at 14,500 practices / 175,000 users — the cloud-PMS leader for 100+ location DSOs.[^65][^66][^41][^42][^44][^68][^69]

Open Dental occupies the open-source niche with 1,547 verified U.S. companies and base pricing $199/month year one.[^67][^78] The dental practice-management software market grew from $2.6 billion in 2025 with a forecast to $6.4 billion by 2034 at 10.6% CAGR (top 5 vendors hold ~70% market share).[^64] Patterson Dental was taken private by Patient Square Capital in April 2025;

Henry Schein One acquired Lighthouse 360 in March 2019 ($50 million 2018 sales, 11,000+ practices).[^66][^41]

**5.

The regulatory landscape is bifurcating.**

ADA CDT 2026 introduces 60 code changes (31 additions, 14 revisions, 6 deletions, 9 editorial) effective January 1, 2026 — including a sweeping anesthesia overhaul (D9230, D9222-D9225, D9245-D9247) and new D-codes for point-of-care saliva testing, cracked-tooth testing, duplicate denture, peri-implantitis scaling/debridement, and occlusal-guard cleaning.[^98][^100][^101][^102][^103]

Public Law 119-21 OBBBA tightens Medicaid through state-directed-payment caps at FFS rates, provider-tax safe-harbor reduction from 6.0%[^103] to 3.5%[^103] for ACA-expansion states (first reduction October 1, 2026 affecting 22 states), eligibility redeterminations every six months, work requirements 80 hours/month for adults 19-64, and cost-sharing up to $35 per service.[^104][^105][^108]

California SB 351 codifies CPOM/CPOD restrictions on private equity and hedge funds, prohibits ownership of patient records and clinical-judgment interference, and restricts noncompete clauses in MSO agreements.[^110][^111] Florida (Fla.

Stat. § 466.026), Colorado (HB 25-194), and Indiana (SB 9 reporting requirement for DSO transactions) reflect parallel state-level CPOD reform energy.[^109][^113]

**6. The 2026-2028 collisions** will be defined by four forces: (a) 2026 expected as the most active dental M&A year since 2002 versus (b) state-level CPOM/CPOD codification spreading from California to additional states; (c) DSO scale advantage versus HHS-OIG / DOJ False Claims Act enforcement plus the proposed CMS CRUSH AI fraud-detection initiative; and (d) AI-imaging incumbents (Pearl, Overjet, VideaHealth) versus PMS-native AI charting embedded inside Dentrix, Eaglesoft, and Denticon — with the resolution determining whether AI value accrues to specialists or EHRs.[^158][^110][^120][^123][^58][^68]

## Part I: Market Structure — TAM, Workforce, and Demographics

The U.S. dental-services market is one of the largest single-vertical operator-fragmented healthcare markets in the country. Five major analyst firms publishing through 2025-2026 converge on a 2025 market size in the $166-203 billion range, with 2031-2035 forecasts converging on $234-286 billion at compound annual growth rates between 3.3% and 5.18%.[^18][^19][^20][^21][^22] The variance among analysts reflects definitional choices — whether the count includes orthodontics, cosmetic dentistry, out-of-pocket private-pay services, hospital-affiliated dental departments, retail-clinic dental offerings, or only office-based clinical dental services — more than measurement disagreement on any single sub-segment.

Three structural drivers underlie the consensus growth trajectory. First, demographics: the U.S. population aged 65 and older is the fastest-growing segment, and dental utilization rises with age (older patients require more restorative, prosthodontic, and periodontal care). Second, expanded insurance coverage: Medicare Advantage dental benefits reached approximately 94%[^33] of MA plans in 2026 with average annual benefit caps of $1,500, and 38 states plus DC offered enhanced adult Medicaid dental benefits as of last year (subject to OBBBA-driven compression as analyzed in Part III).[^33][^35] Third, technology adoption: digital workflows including intraoral scanners, CAD/CAM same-day veneers, AI-enabled diagnostic imaging, teledentistry, and clear-aligner platforms are compressing chair time, lifting case acceptance, and improving labor utilization in ways that grow per-visit revenue even as patient counts grow more slowly.[^19][^22][^23]

The dentist workforce baseline is a centerpiece of the market structure. The American Dental Association Health Policy Institute's 2025 Dentist Workforce update reports 202,485 active U.S. dentists in 2024 — a slight decline from the 202,536 peak in 2022 (a tiny 0.025%[^1] drop) and a meaningful inflection point after 23 consecutive years of monotonic growth from 163,409 dentists in 2001.[^1] The 2024 cohort of 13,742 dental school graduates set a record, and ADA HPI projects supply growth will continue through 2040 driven by the opening of new dental schools.[^1] The state-level dispersion is striking: the average dentist-to-100,000-population ratio is 59.5, but ranges from 40.2 in Arkansas (the lowest state) to 103.2 in the District of Columbia (the highest), with rural counties tracking far below urban averages and the gap widening over time as younger dentists gravitate toward urban areas.[^1]

The composition of the workforce is shifting in ways that compound the consolidation thesis. The female share of dentists is on track to reach 50%[^1] by 2040; female dentists have represented over half of each graduating class since 2019; and dentists of historically underrepresented race/ethnicity are growing as a share of the workforce, though more slowly.[^1] The average retirement age has lengthened to 68 years, ten years past the historical norm of 58 — keeping older dentists in the workforce longer but also extending the runway over which the baby-boomer-retirement transition will play out.[^1] These shifts intersect with the practice-ownership decline analyzed in Part IV: only 73%[^1] of U.S. dentists were practice owners in 2023, down from 85% in 2005, and 13.8% are now DSO-affiliated, up from 7.4% in 2015.[^112]

The supply-side counterpoint is workforce shortages. The ADA HPI Q3 2025 EOEID panel — surveying 2,468 panel members with 816 respondents (33.3%[^5] response rate) — found persistent recruitment difficulty across general dentists, hygienists, dental assistants, and administrative staff.[^5] BLS Quarterly Census of Employment and Wages data underscores the operator-fragmented nature of the dental-services workforce: the U.S. counts more than 455,000 home-health and personal-care establishments alongside the dental-services vertical, and dental hygienist and assistant wages have been increasing at rates above general healthcare-sector inflation.[^6] Cost pressure on consumers is correspondingly sustained: Grand View Research's January 2026 trends report notes per-capita disposable income rising from $56,545 in 2021 to $66,973 in 2025 with a forecast of $83,858 by 2033, with per-capita out-of-pocket healthcare spending rising from approximately $1,300 in 2021 to $1,514 in 2023.[^23]

The supply-demand interaction defines the operator economics. Practices that consolidate through DSO affiliation gain bulk procurement and centralized technology investment; practices that maintain independence face rising IT, software-licensing, and regulatory-compliance costs without the same scale. Becker's Dental Review's mid-2025 ranking of the top 10 DSOs counts Heartland (1,800+ practices), TAG/Aspen (1,300+), PDS Health (1,000+), Smile Brands (600+), MB2 (750+), Sonrava (600), Smile Doctors (550+), Affordable Care (450+), Dental Care Alliance (400+), and Great Expressions Dental Centers (~300) — together supporting roughly 7,350 offices, or approximately 5-6% of U.S. dental practice locations.[^24] By the end of 2025 those numbers had grown further, with Heartland reaching 1,900+ locations, TAG reaching 1,400+, and PDS Health crossing 1,100+.[^125][^127][^129] The remaining ~95% of dental practices remain independent or in smaller group structures, providing the structural runway for continued consolidation analyzed in Part VII.

## Part II: ADA CDT 2026 — The Coding and Documentation Layer

The American Dental Association's *Code on Dental Procedures and Nomenclature* (CDT) is the HIPAA-mandated coding standard for documenting and reporting dental services in the United States. CDT 2026 — finalized by the Code Maintenance Committee at its March 13, 2026 annual meeting and reflecting the prior year's CMC decisions — introduces 60 changes effective January 1, 2026: 31 additions, 14 revisions, 6 deletions, and 9 editorial actions.[^98][^100][^103] The CDT update is more than a clerical exercise; it is the foundational documentation-precision baseline that every PMS, every dental-AI clinical-decision-support system, and every claims-clearinghouse workflow must match in the new contract year.

The most consequential change is a sweeping anesthesia-coding overhaul. CDT 2026 reflects six new codes, five revised codes, and one deletion within the Anesthesia subcategory of Adjunctive General Services, bringing the granularity of dental-anesthesia coding into alignment with current clinical practice and accepted definitions of sedation levels.[^101] Code D9230 was revised to clarify that it is used to document and report nitrous oxide administration when delivered as a single agent (no co-administered sedation drugs), with the descriptor language updated to eliminate outdated terms.[^100][^101] A single new code now describes minimal sedation administration of a single drug (nitrous may be co-administered without separate coding). Moderate sedation, previously documented under a non-IV minimal/moderate code or a time-based IV moderate code, is now broken into three routes of administration:[^101]

- **D9245** — moderate sedation via enteral route (oral, rectal) when multiple sedation drugs are administered or a single drug exceeds maximum recommended dose.
- **D9246 / D9247** — moderate sedation via parenteral non-IV routes (intramuscular, intranasal, submucosal, subcutaneous, sublingual, intraosseous) at first 15-minute increment (D9246) and each subsequent 15-minute increment (D9247).

Existing deep-sedation/general-anesthesia codes D9222 and D9223 were revised, and two new codes (D9224 and D9225) were added specifically for general anesthesia when an advanced airway is utilized throughout the procedure.[^101] The new structure gives dental clinicians and payers the granularity to distinguish between sedation depth, route of administration, time increment, and airway management — a meaningful upgrade in coding-precision that AI charting systems must now embed.

CDT 2026 also adds five clinically significant new D-code categories beyond anesthesia.[^102] **Point-of-care saliva testing** receives a code for the first time, reflecting the adoption of in-office saliva-analysis technology that no longer requires laboratory dispatch. **Cracked tooth testing** receives its own code for comprehensive multi-tooth testing aimed at locating fractures and ruling out alternative diagnoses. **Duplicate denture** receives two codes (one for maxillary arch, one for mandibular) for fabrication of backup dentures using existing molds, scanning, or 3D-printing of existing dentures. **Scaling and debridement of an implant with peri-implantitis** (without surgical flap entry) receives a dedicated code separating it from generic scaling. **Cleaning and inspection of an occlusal guard** receives a code for the routine service that virtually every dental practice provides at recall visits.[^102]

The revisions worth note: D2391 resin-based composite (one surface, posterior) loses its depth-of-lesion descriptor restriction — the change harmonizes single-surface composite coding with how other restorative procedures are coded (no other restorative code is restricted by lesion depth) and eliminates the prior inconsistency.[^100] D5876 (add metal substructure to acrylic complete denture, per arch) was revised to clarify that the procedure adds reinforcement during fabrication or repair.[^100] Code D1352 (preventive resin restoration in moderate-to-high caries risk patient, permanent tooth) was deleted on the basis that the procedure is performed identically to D2391 single-surface resin composite, eliminating documentation confusion.[^100]

The strategic implication for AI-native dental products is direct. Pearl's Second Opinion, Overjet's Charting Assist, and VideaHealth's Dental Assist must produce findings that map cleanly to CDT 2026 D-codes — and the AI-augmented documentation workflow has to handle the new granularity of anesthesia coding (six new + five revised codes), the new procedure-specific codes (saliva testing, cracked-tooth testing, duplicate denture, peri-implantitis scaling, occlusal-guard cleaning), and the harmonized restorative coding (D2391 minus depth restriction).[^47][^123] The ADA, for the first time, is offering a continuing-education series — *2026 CDT Codes: Clinical Practice Series* — with eight on-demand courses explaining the changes; Modern Diagnosis and Management of the Cracked Tooth and Scaling & Debridement of Single Implants with Peri-Implantitis are specifically aligned with the new D-codes.[^102] The combination of expanded coding granularity and AI-assisted documentation creates the structural opportunity for AI-native clinical-decision-support systems to deliver measurable case-acceptance and revenue-capture lift over the back half of 2026.

## Part III: Public Law 119-21 OBBBA — The Medicaid Compression

Section 71111 of Public Law 119-21 (the One Big Beautiful Budget Act, signed July 4, 2025) — analyzed at length in this paper's senior-care companion — established the nine-year statutory moratorium until September 30, 2034 on the federal nursing-home minimum-staffing rule. The same statute also imposes a constellation of Medicaid-tightening provisions that materially compress the dental-services revenue floor for practices serving Medicaid populations. Title VII Subtitle B Health Chapter 1 Medicaid contains §71101-71121, spanning eligibility, enrollment, financing, benefits, community-engagement requirements, and HCBS coverage adjustments.[^104]

The most consequential provisions for dental operators are the financing changes. **State-directed payment caps** at Medicare base rates or Medicaid State Plan FFS amounts now apply to inpatient and outpatient hospital services and qualified-practitioner services at academic medical centers — and because dental services do not have a Medicare base rate for direct services (only for some facility fees), states are limited to making state-directed payments to MCOs that reimburse dental services up to the state Medicaid FFS amount, or 110% of FFS in non-ACA-expansion states.[^108] This provision takes immediate effect and meaningfully reduces the supplemental-payment headroom that had previously allowed Medicaid-participating dentists to receive enhanced reimbursement above the base FFS schedule.

A second financing change with longer phase-in is the **provider-tax safe-harbor reduction**. OBBBA eliminates states' ability to create new provider taxes and reduces the safe-harbor limit from 6.0%[^108] of revenues to 3.5%[^108] for ACA-expansion states, on a 0.5%[^108]-per-year glide path. The first reduction to 5.5%[^108] takes effect October 1, 2026. Twenty-two states will face reduced safe-harbor limits.[^108] The reduction in provider-tax revenue directly compresses the state-share contribution to Medicaid funding, forcing the difficult tradeoffs analyzed below.

The eligibility-tightening provisions further compress the Medicaid roster. **Eligibility redeterminations** must now occur semi-annually rather than annually, with states required to use national address databases and review a Master Death File at least quarterly.[^105] **Work requirements** apply to able-bodied Medicaid recipients ages 19-64, who must document 80 hours per month of employment or equivalent activity. As the National Association of Dental Plans notes, prior experience with work-requirement implementations suggests many people who meet the criteria fail to submit documentation in the manner required by the state — resulting in avoidable terminations that depress the Medicaid roster and the dental-utilization base.[^105] **Cost-sharing** provisions allow states to require up to $35 per service for certain Medicaid recipients on many healthcare services. NADP specifically warns that high cost-sharing on preventive dental care will reduce utilization and worsen oral health outcomes — and that states have latitude to exempt preventive dental services via regulation, tracking the existing federal exemption for preventive medical services.[^105]

The American Medical Association estimates that OBBBA will result in 11.8 million people losing healthcare coverage.[^106] For dental operators, the secondary effect is that adult Medicaid dental — which is **not federally mandated** — sits among the optional benefits most likely to be reduced or eliminated as states absorb a roughly $911 billion federal Medicaid spending reduction over the next decade.[^35][^46] Eighteen states have enhanced their adult Medicaid dental benefits since 2021 to include checkups, X-rays, fillings, crowns, and dentures with loosened annual dollar caps.[^35] Among those states, KFF Health News' sampling of six states found 13-22% of adult Medicaid recipients see a dentist at least once per year, compared with 50-60% of adults with private dental coverage.[^35] Forty-one percent of dentists nationwide reported participating in Medicaid in 2024, a figure stable over the past decade.[^35]

The compression analysis is uneven across states. Tennessee, for example, spent approximately $64 million[^35] on Medicaid dental in 2024 and saw a 20%[^35] decrease in dental-related ER visits — the kind of operational ROI that supports continued state coverage. But Tennessee is also projected to lose roughly $7 billion[^35] in federal Medicaid funding over the next decade under OBBBA, creating budget pressure that forces optional-benefit reductions.[^35] Per-state expected losses range from $184 million for Wyoming to $150 billion for California.[^35] Twenty-two states face the deepest compression on their dental Medicaid floor as the provider-tax safe-harbor glide path begins October 1, 2026.[^108]

The implication for AI-native dental products is a buyer-mix shift. Dental operators serving high-Medicaid populations face revenue compression, which constrains discretionary IT and software-licensing spend. Dental operators serving private-insurance and out-of-pocket populations — which dominate the DSO buyer base analyzed in Part VII — face the opposite signal: rising disposable income, growing employer-sponsored coverage, and demographic-aging demand drivers that support continued operational investment in AI-augmentation and patient-engagement platforms.[^23] The OBBBA framework therefore widens the gap between high-private-pay dental practices that are accelerating AI adoption and high-Medicaid practices that are constrained.

## Part IV: California SB 351 — The Corporate-Practice-of-Dentistry Codification

While Section 71111 of OBBBA addresses the Medicaid revenue floor, California Senate Bill 351 (signed October 6, 2025 by Governor Newsom; effective January 1, 2026) tightens the corporate-ownership ceiling for private-equity-backed and hedge-fund-backed dental management platforms — codifying the corporate-practice-of-medicine (CPOM) and corporate-practice-of-dentistry (CPOD) restrictions that had previously existed only in California Medical Board and Dental Board guidance, attorney-general opinions, and case law.[^110][^111] The statute is the leading edge of a state-level CPOD reform wave that is likely to be replicated in 2026-2028 as additional states examine the role of management services organizations in healthcare ownership.

SB 351 imposes three categories of restrictions on **restricted investors** — defined as private-equity groups, hedge funds, MSOs, and other entities they directly control. First, the statute prohibits restricted investors from owning patient medical records, determining the content of medical records, or setting parameters for contractual relationships with third-party payors involving physicians or dentists.[^110] Any contract or agreement that enables such interference is rendered void, unenforceable, and against public policy. The form of the practice (sole proprietorship, partnership, corporation) does not affect applicability. Critically, the statute preserves the ability of unlicensed persons or entities to assist or consult with physician or dental practices on staffing decisions, payor-contract parameters, and similar tasks — but only without crossing into clinical decision-making.[^110]

Second, SB 351 prohibits noncompete and nondisparagement clauses in management services contracts and real estate or other asset purchase agreements between physician/dental practices and restricted investors. Two exceptions apply: an otherwise enforceable sale-of-business noncompete agreement remains valid (per California's existing sale-of-business exception), and confidentiality clauses protecting nonpublic business information remain enforceable so long as they do not prevent required legal disclosures or public commentary about the practice on quality of care, ethical concerns, or revenue strategies.[^111]

Third, the bill empowers the California Attorney General to enforce the law through injunctions and other equitable remedies. The statute represents Governor Newsom's revival of the corporate-practice restrictions from AB 3129 — the 2024 bill he vetoed, criticizing its broader healthcare-market-oversight provisions as duplicative — by isolating those restrictions from the more controversial market-oversight provisions.[^110][^111] The companion AB 1415 (signed October 11, 2025) expands the existing Office of Health Care Affordability review process to require reporting of certain healthcare transactions by private equity and hedge funds, providing a parallel transparency mechanism.[^111]

Comparison with Florida's CPOD framework illuminates the pre-existing patchwork. Florida Statute § 466.026(1) and Florida Administrative Code 64B5-17.013(1) provide that only Florida-licensed dentists or professional corporations composed entirely of licensed dentists may own and operate dental practices. Non-dentists may lease dental equipment but cannot control its use during clinical service delivery. Practice Management Agreements between dentists and Dental Practice Management Companies (DPMCs) must not preclude or restrict the dentist's independent professional judgment, must not require specific patient-information systems or marketing plans, and must not tie management fees to gross or net practice profits or to patient referrals.[^109] Management fees must reflect fair market value for services actually provided.

Other states are tightening enforcement on parallel paths. Colorado HB 25-194 (April 25, 2025) amended Article 220 to require that the name, license number, ownership percentage, and other information for each proprietor of a dental or dental hygiene practice — including unlicensed heirs serving as temporary proprietors — be immediately and publicly available at the reception desk during operating hours.[^113] Indiana Senate Bill 9 (March 2024) requires reporting of healthcare-entity mergers and acquisitions, including DSO transactions valued at $10 million[^113] or more, providing pre-transaction transparency and review opportunity.

The American Economic Liberties Project's December 2025 *Independent Dental Practice Act* model legislation pushes the reform agenda further. The model would strengthen state CPOD laws to outlaw DSO model workarounds — particularly the "friendly dentist" arrangement in which a corporate entity forms a DSO through which to invest in a dental practice while a "friendly dentist" serves as legal owner of the practice and the DSO retains operational control over finances, staffing, and strategic decisions.[^112] AELP cites the practice-ownership decline analyzed in Part I (73% practice owners 2023 vs 85%[^112] in 2005; 13.8%[^112] DSO-affiliated 2023 vs 7.4%[^112] in 2015) as evidence that DSO consolidation has progressed faster than CPOD enforcement.[^112]

The strategic implications for dental operators are significant. PE-backed DSOs operating in California must ensure compliance with SB 351 by January 1, 2026 — reviewing MSO agreements for noncompete and nondisparagement clauses, ensuring patient-record ownership rests with the licensed practice rather than the management entity, and revisiting clinical-decision-making authority documentation. The California codification creates a template that legal-investment professionals expect to spread to additional states (NY, MA, NJ, OR, WA are among states already pursuing CPOD reform). For dental-AI vendors, the SB 351 framework reinforces that clinical-decision-support output must remain advisory to the licensed clinician — not directive — preserving the dentist's independent professional judgment as the legal anchor for any AI-augmented diagnostic or treatment-planning workflow.

## Part V: The Practice Management Software Triopoly — Henry Schein One, Patterson Dental, Planet DDS

Dental practice-management software is structurally a near-monopoly tier sitting underneath a fragmented operator base. Three platform stacks — each owned by a larger corporate or PE entity — together account for the majority of installed PMS seats, with a fourth open-source option (Open Dental) carving out a price-sensitive long tail. PracticeSignal's Q1 2026 Dental Software Buyer's Report — drawing on more than 2,000 sources including practitioner reviews, vendor documentation, SEC filings, and forum threads — anchors the consolidation analysis.[^68]

**Henry Schein One** is the largest installed-base operator. Founded in 2018 as a joint venture between Henry Schein, Inc. and Internet Brands, Henry Schein One assembled more than 40 software brands and approximately 1,500 employees[^41] by integrating Dentrix, Dentrix Ascend, Dentrix Enterprise, Easy Dental, TechCentral, Software of Excellence, Logiciel Julie, InfoMed, Exan, LabNet, and Internet Brands' web-based dental properties (Demandforce, Sesame Communications, Officite, DentalPlans.com).[^41] **Dentrix** is used by roughly 35,000 dental practices in the U.S. with approximately 19%[^41] market share — the largest single-PMS footprint — and pricing in the $400-$1,200/month range with annual auto-renewing contracts that PracticeSignal flags as carrying 8-12% support-plan increases per year.[^65][^68][^69][^80] **Dentrix Ascend** offers the cloud counterpart but is consistently rated below the legacy server-based product by practitioners.[^68] In March 2019 Henry Schein One acquired **Lighthouse 360**, a dental patient-engagement and communication platform with 11,000+ practices and 2018 sales of approximately $50 million.[^41]

**Patterson Dental** operates the second major stack with **Eaglesoft** and the cloud-based **Fuse** product. Eaglesoft was founded in 1994 in Effingham, Illinois with 25 employees and approximately 1,000 customers[^66]; Patterson acquired Eaglesoft in 1997 and continues development at the Patterson Technology Center in Effingham.[^66] Eaglesoft today serves approximately 30,000 active users across roughly 10-15%[^66] of the dental PMS market, integrating with 55+ authorized third-party software solutions.[^42][^66][^69] Pricing runs $400-$600/month with annual auto-renewing contracts. Patterson's strategic posture changed materially in April 2025 when **Patient Square Capital took Patterson Companies private**, ending the company's run on NASDAQ as PDCO — and Patterson is now moving toward subscription-only pricing for Eaglesoft in 2026, citing internal data showing **27%[^66] subscription revenue growth versus 11%[^66] perpetual-license revenue decline**, signaling a per-seat cost trajectory that is up and to the right.[^66][^68]

**Planet DDS** is the cloud-PMS leader for multi-location DSOs and the platform with the most aggressive AI roadmap. Backed by KKR, Planet DDS operates **Denticon** (general practice), **Cloud 9** (orthodontics), and **Apteryx Cloud Imaging** under the **DentalOS** product brand.[^44][^68] As of January 2026 the company supported more 100+ location DSOs than any other cloud-based dental practice-management provider, enabling **14,500 practices and 175,000 users** to standardize operations on a single platform.[^44] Planet DDS's 2025 enterprise wins set the scale benchmark: **Sage Dental (140 locations), Coast Dental (88), Altius Dental (74), Choice Healthcare (61 Denticon locations + 49 Cloud 9 orthodontic locations), SGA Dental Partners (34), DentalCareAlliance (51 orthodontic locations converted to Cloud 9), Eastern Dental (38)**, plus growth with Guardian Dentistry Partners, Squire Dental, and Fuller Smiles.[^44] Apteryx Imaging — Planet DDS's imaging subsidiary, originally LED Medical Diagnostics, acquired 2017 for $10.3 million[^44] — generates roughly $86.4 million[^59] in annual revenue with the XrayVision, XVWeb, and DCV imaging product lines plus VELscope Vx oral-cancer screening and TUXEDO intraoral sensors.[^59]

The fourth meaningful PMS option is **Open Dental**. Founded in 2003 in Salem, Oregon, Open Dental built the largest third-party ecosystem in dental software around an open-source GPL-licensed PMS that transitioned to a proprietary license in version 24.4 — though the underlying MySQL/MariaDB database remains fully accessible, preserving the data-ownership advantage that drives the company's organic-advocacy moat.[^67] Pricing runs $199/month year one (then $149/month), with optional cloud hosting at $159/month per provider and an eServices Bundle at $165/month per location.[^70] Independent web-tracking data from BuiltWith and Landbase reports 1,547 verified U.S. companies using Open Dental as of mid-2026, with employees grown to 112 (+12.3% YoY) and an active community of 4,682 LinkedIn followers.[^77][^78][^79] Open Dental's pricing transparency, 90-day money-back guarantee, conversions from 200+ other PMS systems, and free distribution to dental schools and developing-country practices make it the structural counterweight to the three commercial-platform stacks.

The dental PMS market growth trajectory is striking: $2.6 billion[^64] in 2025 with a forecast to $6.4 billion[^64] by 2034 at **10.6% CAGR**, with the top 5 vendors holding approximately 70% market share.[^64] That growth rate substantially exceeds the underlying dental-services market growth of 4.4-5.18%[^64], reflecting the secular shift from on-premise to cloud, from manual to automated workflows, and from standalone PMS to AI-augmented platform stacks. Carestream Dental — owned by Carestream Health since the 2007 spinoff from Eastman Kodak — competes in the imaging-plus-PMS tier with the Sensei practice-management product line, more than 125 years of dental imaging heritage, and a January 2025 partnership with Pearl to embed AI clinical detections into Carestream imaging workflows.[^43]

The strategic question for AI-native dental imaging vendors (Pearl, Overjet, VideaHealth) is whether to integrate deeply with all three commercial stacks plus Open Dental, or to bet on one stack as the long-term winner. Pearl partnered with Eaglesoft in July 2024 to embed Second Opinion findings directly into Eaglesoft's Advanced Imaging workflow.[^42] VideaHealth partnered with Henry Schein One in 2024 for the dental-education market and integrated Detect AI into Dentrix.[^81] Planet DDS's January 2026 announcement signaled that AI agentic capabilities will roll out under the DentalOS brand at the company's Orbit user conference (February 25-27, 2026), positioning Denticon to embed AI-augmentation natively rather than depending on third-party integrations.[^44] The triopoly thesis: the PMS tier is consolidated, switching costs are high (typically 2-4 weeks plus $500-$2,400 per provider), and the AI-augmentation tier is the next competitive front.[^68][^70]

## Part VI: AI-Native Dental Imaging — Pearl, Overjet, VideaHealth, and the Ambient Layer

The AI-native dental imaging landscape converges on three category leaders — Pearl, Overjet, and VideaHealth — each with FDA 510(k) clearances, deep DSO and payer customer rosters, and an architectural position relative to the PMS triopoly. By early 2026 the FDA-cleared dental-AI tier has matured into a category-defining tier with measurable clinical and operational outcome metrics.

**Pearl Inc.** holds 8 FDA 510(k) clearances by early 2026, with regulatory clearance in 120 countries. The company's Second Opinion product was the world's first FDA-cleared AI software for reading dental X-rays (510(k) K210365, March 2022) — a Class II Medical Image Analyzer under 21 CFR 892.2070 with product code MYN. The clearance scope covers caries, margin discrepancies, calculus, periapical radiolucencies, crowns (metal/zirconia/non-metal), fillings, root canals, bridges, and implants on bitewing and periapical radiographs for patients aged 12 and up.[^47][^123] Pearl's FDA clearance narrative since the original Second Opinion has expanded materially: panoramic-radiograph clearance (January 2026, identifying suspected caries, periapical radiolucencies, and impacted third molars on the most widely captured extraoral imaging modality); CBCT clearance; and Second Opinion BLE for automated mesial/distal bone-level measurement (September 2025).[^49][^50] Pearl reports 94% accuracy in detecting dental disease (independent third-party validation), 30-second analysis time, more than 100,000 verified clinical cases, and 18 dental findings detectable per image (caries early/progressed, bone loss, calculus, periapical lesions, defective margins, root canals, crowns, bridges, implants, fractures).[^51] The company is commercially available to over 500,000 dental practices and millions of dental professionals worldwide across six continents, and reported 458% revenue growth in 2023.[^136] Pearl's $58 million Series B in July 2024 (led by Left Lane Capital with Smash Capital, Alpha Partners, Craft Ventures, and Neotribe Ventures) was characterized at the time as the largest investment ever in dental AI.[^136]

**Overjet** holds 10 FDA 510(k) clearances as of December 2025. The company received its first clearance in 2021 for Dental Assist (bone-level measurement with periodontal disease — the first FDA clearance of its kind), followed by Caries Assist (July 2024) demonstrating 32%[^52] more carious surfaces detected with 7,000+ tooth-surface validation, then six additional clearances through 2024-2025, culminating in CBCT Assist in December 2025 — Overjet's 10th FDA clearance and the platform's expansion into 3D CBCT image analysis.[^52][^54][^55] The Overjet platform now supports periodontal bone-level measurement, airway minimal cross-sectional area, tooth-to-maxillary-sinus and tooth-to-inferior-alveolar-canal distances, and tooth-impaction-ratio metrics.[^55] Overjet's funding history — $7.85 million Seed July 2020, $27 million Series A August 2021, $42.5 million[^55] Series B[^55] December 2021 ($425 million[^55] valuation), $53.2 million[^55] Series C[^86] March 2024 ($550 million[^86] valuation, $133 million[^86] total funding), $24.56 million[^86] Series C[^86]-II December 24, 2025 — totals approximately $155.11 million across 9 rounds.[^86][^153] The Series C was the largest single dental-AI investment at the time, backed by March Capital, General Catalyst, Insight Partners, Crosslink Capital, E14 Fund, Spring Rock, Liquid 2, Harmonic Growth Partners, and notably the **American Dental Association** itself.[^137] Overjet customers cover **120 million-plus payer membership** including the majority of the 10 biggest U.S. dental insurers, with 16 dental insurer partnerships covering 75 million-plus Americans for the original 2021 build-out.[^54][^137][^52] Overjet acquired MDBee on December 2, 2025 — extending its platform into the patient-engagement and treatment-planning workflow.[^86]

**VideaHealth** is the dental-AI platform with the deepest DSO penetration. The company's $40 million[^81] Series B[^81] (January 2025, led by Threshold Ventures with Avenir Ventures, BAM Corner Point, and existing Spark Capital, Zetta, Pillar VC) brought total funding to $70 million.[^81][^84] VideaHealth's K232384 clearance (December 2023) covers 10 clinical pathologies and 25 dental findings — including periapical radiolucencies, calculus, and pediatric caries (ages 3+) across bitewing, periapical, and panoramic radiographs.[^123] In 2024 VideaHealth announced collaborations with **the largest DSOs in North America: Heartland Dental in the U.S. and Dentalcorp in Canada**.[^81] VideaHealth's expanded partnership with Henry Schein One brings AI to the dental-education market via Detect AI integrated into Dentrix.[^81] **Aspen Group / TAG integrated VideaHealth Clinical Assist AI across 1,100+ dental practices** in 2024-2025.[^141] Per GetLatka's 2024 snapshot, VideaHealth recorded $6.8 million in revenue (up from $5 million[^141] 2023, $1.5 million[^85] 2022, $240K 2019) with 300 customers, 87 employees, and $25.5 million total raised through Series A.[^85] CEO Florian Hillen leads from Boston.[^81]

A second tier of FDA-cleared and CE-marked dental-AI products operates alongside the three category leaders. **Diagnocat** received Segmentron Viewer 510(k) clearance K251072 in September 2025 for CBCT semi-automated analysis with U.S. commercial launch in late 2025.[^123] **Orca Dental AI** (Israel-based) holds the K231 cephalometric-analysis clearance (January 2025) for patients aged 14 and up, plus the more recent CEPHX3D 510(k) clearance K252538 (decision date March 5, 2026).[^117][^123] **SMARTDent** (Ray Co Ltd, K251109, May 22, 2025) is a software-only image management and processing system following the Carestream CS Imaging predicate.[^118] **Primevision 3D** (K253959, decision February 5, 2026) covers dental computed-tomography device clearance.[^119] **Denti.AI** (founded 2017 Dover, Delaware) and **KELLS** (founded 2018 Long Island City) are emerging entrants in the dental-documentation and patient-companion segments, respectively.[^86]

The patient-engagement layer compounds with the AI-imaging tier. **NexHealth** raised $125 million[^56] at a $1 billion[^56] valuation (per the company's 2025 update — though HitConsultant's 2022 coverage suggests the original $125M[^56] Series C[^56] was 2022, so the 2025 republish may be a different round to verify). NexHealth manages **68 million patient records**, supports more than 100 EHRs (Epic, Cerner, Dentrix), and serves customers including Mid-Atlantic Dental Partners, Coast Dental, Jefferson Dental, plus the Synchronizer API used by Quip, Swell, and SmileDirectClub.[^56][^93] **Modento** was acquired by Dental Intelligence in March 2021 (PSG-backed); the patient-engagement product covers two-way communication, reminders, recalls, digital forms, virtual check-in, voicemail drops, treatment planning, team chat.[^88] **RevenueWell** (founded 2010) and **Lighthouse 360** (Henry Schein One acquired March 2019) round out the patient-engagement-acquisition pattern. **Vyne Dental's Trellis platform** serves 84,000+ practices across 800+ payer connections for revenue-cycle management — claims, attachments, eligibility verification, electronic remittance advice.[^57][^58][^96]

The patient-financing tier completes the AI-augmentation stack. **Sunbit** offers 87%[^61] approval rates with no-interest plans up to 24 months, no fees for prepayment/late/insufficient-funds, and 1.9%[^61] practice fees with next-business-day payout — distinct from the deferred-interest model of CareCredit.[^61][^62] **CareCredit** (Synchrony) operates across 285,000+ healthcare-provider locations.[^60] **Cherry** offers true 0% APR up to 24 months and the largest loan amounts ($50,000 cap).[^71] PracticeSignal's analysis recommends a CareCredit-plus-installment-lender stack for most dental practices.[^71]

The architectural pattern across the AI-native dental imaging tier is consistent: pair an FDA-cleared imaging-modality input layer (bitewing/periapical, panoramic, CBCT) with deep DSO and payer customer rosters, integrate into the PMS triopoly via partnership APIs, and sell the combination as an operator-funded or payer-funded enterprise SaaS. The platform-defensibility question is whether Pearl's data moat (largest commercially distributed footprint), Overjet's payer-channel moat (120M+ membership coverage), or VideaHealth's DSO-channel moat (Aspen + Heartland + DentalCorp) compounds faster than the EHRs can build native equivalents — and the next twelve to twenty-four months will be decisive.

## Part VII: DSO Consolidation Wave — Heartland, Aspen TAG, PDS Health, Smile Doctors, Dentalcorp

The dental-services-organization tier is the single largest external capital allocator into U.S. dental operations. Six platforms — Heartland Dental, Aspen Group / TAG, PDS Health, Smile Doctors, Smile Brands, and Dentalcorp — each at meaningful scale and each with a distinct ownership and operating model — illustrate the consolidation wave's trajectory and the founder-velocity patterns analyzed in Part IX.

**Heartland Dental** is the largest U.S. DSO. Founded in 1997 in Effingham, Illinois by Rick Workman, DMD as a single dental practice, Heartland today supports more than **3,000 doctors at 1,900+ locations across 39 states and the District of Columbia**, with 3,276 employees[^125] (+13.4% YoY, +786 people) and approximately **$1.7 billion in annual revenue**.[^125][^126] Total disclosed funding is $168.2 million, with the most recent round a $165 million debt financing in September 2023; CB Insights reports $1.6 billion total raised across 5 rounds including a 2012 valuation of $1.3 billion.[^140] **KKR has been the majority owner since March 7, 2018**, after a chain of four prior PE owners.[^139] Heartland's 2025 growth was the most active of any year in company history: **75 de novo practice openings + 19 relocations + 27 expansions of existing supported practices + 33 strategic affiliations + the acquisition of Smile Design Dentistry (a doctor-founded group with 60 practices in Florida) on September 8, 2025** — totaling 93 supported practices added in calendar 2025.[^125][^140] Heartland's earlier acquisitions include American Dental Partners (May 14, 2021), Tru Family Dental (December 1, 2020), Digital Dining (October 30, 2015), and My Dentist Holdings (October 2013).[^126] The LevinPro Healthcare M&A database recorded Heartland's fifth 2025 acquisition (Anchor Point Dental Care, March 19, 2025) — and that single transaction was the 96th Physician Medical Group acquisition of 2025 and the 44th in the dental specialty, reflecting both Heartland's pace and the broader sector consolidation rate.[^138]

**The Aspen Group / TAG** is the multi-brand consumer-healthcare leader, supporting more than **9 million patients across 1,400+ locations in 46 states** through five brands: Aspen Dental, ClearChoice Dental Implant Centers, WellNow Urgent Care, Chapter Aesthetic Studio, and Lovet Pet Health Care.[^127] **TAG H1 2025 annualized revenue was $4.2 billion (+8% year-over-year)** with 5,300+ clinicians across 1,429 locations[^127] in 48 states serving 35,000 patients per day, demonstrating significant operating leverage and portfolio-wide margin improvement.[^128][^145] In calendar 2025, **Aspen Dental opened 21 new locations** and supported 5.2 million patient visits, while **ClearChoice Dental Implant Centers treated 27,500 implant patients** and expanded into three new markets (including its first Hawaii location).[^127][^128] ClearChoice expanded its product offering with Endura Elite — its most advanced full-arch dental restoration featuring premium zirconia with multi-layered shading — and ClearChoice's digital manufacturing delivered **more than 50,000 3D-printed dental prostheses in 2025**.[^127] Aspen Dental's network of independent practice owners grew approximately **15%[^127] year-over-year** in 2025, reflecting the strength of TAG's structured practice-ownership model.[^127] TAG University (TAG U) and the Oral Care Center for Excellence (OCC) function as the largest clinical development platforms in North America, providing the training infrastructure that enables doctors to take on higher-acuity cases including digital implant workflows.[^142] **VideaHealth Clinical Assist AI is integrated across all 1,100+ Aspen Dental supported practices**.[^141]

**PDS Health** (Henderson, Nevada; CEO Stephen Thorne, founder; 30th anniversary celebrated 2024) became the third dental-services platform to cross **$3.1 billion in annual revenue in 2025** — its first time crossing that threshold.[^129] In 2025 PDS Health added 77 new practices (including 4 primary care offices reflecting the dental-medical integration thesis), welcomed 83 new practice owners, and supported **7.5 million patient visits across more than 1,100 practices**.[^129] The company partnered with three university dental schools (University of Michigan, Pacific Dugoni, Roseman University) and rolled out SOTA Cloud (cloud-based dental imaging) and DEXIS dental imaging across the network.[^131][^144] PDS Health's specialty DSO model expanded to **8 regionally aligned partnerships across 7 states (FL, GA, LA, MD, SC, TN, VA), with 26 associate specialists and 160+ general dentistry practices** offering integrated endodontic and periodontic care via specialist-owned groups within general dentistry offices.[^130] PDS Health Technologies — launched in 2025 as the company's external-services arm — extends PDS's technology, services, and support infrastructure to organizations beyond the PDS Health network itself.[^144] In 2024, PDS Health rebranded from Pacific Dental Services to reflect its broader mission supporting dental and medical providers, completed 7 million patient visits across 5,000+ clinicians at 1,000+ practices, opened 63 de novo practices including 4 primary care offices, and reached its 1,000th-practice milestone.[^131]

**Smile Doctors** (Dallas; backed by **Linden Capital Partners + Thomas H. Lee Partners**; founded 2015) is the largest orthodontic-support organization in the U.S. with **550+ affiliated locations across 36 states** as of mid-2025.[^132][^146][^148] On March 20, 2025 Smile Doctors acquired **myOrthos** — an orthodontic-support organization with 70+ affiliated locations in 13 states — from SV Health Investors, expanding into four new states (Delaware, New York, Rhode Island, Vermont) and reinforcing the company's M&A growth strategy at a time when other OSOs had slowed or stopped.[^132][^147] Smile Doctors is the largest network of Diamond Plus Invisalign providers nationally.[^132]

**Smile Brands** has raised $408 million[^149] in total funding from BMO Bank, NXT Capital, Benefit Street Partners, and Barings BDC, with 12 practice acquisitions tracked since 2019 (latest deal Aria Dental, September 15, 2022).[^149] **MB2 Dental Solutions** (owned by Charlesbank Capital Partners, KKR, and Warburg Pincus) operates 750+ locations across 45 states; the company added three practices in March 2025 alone in Missouri, Illinois, and New York.[^30]

**Dentalcorp Holdings Ltd.** (TSX: DNTL) is Canada's largest dental network. Q3 2025 revenue reached **C$420.1 million[^135] (+11.9%[^135] YoY) with Adjusted EBITDA of C$78.7 million[^135] (+14.2%[^135]) at 18.7% margin**, expanding the operational footprint to 590 dental practices.[^135] In Q1 2025 the company reported C$409.4 million revenue (+9.9%), Adjusted EBITDA C$75.9 million[^135] (+11.5%[^135]) at 18.5%[^133] margin, with 12 practice acquisitions at 7.4x average multiple generating C$8.3 million in PF Adjusted EBITDA.[^133] Full-year 2024 saw 30 practice acquisitions at 7.0x multiples generating C$21.4 million PF EBITDA, expanding to 561 practices.[^134] On **September 26, 2025 GTCR LLC announced the acquisition of Dentalcorp at C$2.2 billion[^134] equity / C$3.3 billion enterprise value / C$11.00/share — a 33% premium** to the closing price.[^135] CEO Graham Rosenberg led the company through six consecutive quarters of deleveraging, reducing the Net Debt / PF Adjusted EBITDA after rent ratio to 3.58x by Q3 2025 from 4.1x in mid-2024.[^133][^134][^135] Dentalcorp's Q3 2024 strategic partnership with VideaHealth marked the company's deployment of dental-AI across its network — a signal that the GTCR acquisition is not just a financial recapitalization but also a platform play on AI-augmented DSO operations.[^150]

The DSO-consolidation thesis: the top six DSOs combined now operate roughly 5,500-6,000 dental practice locations and generate aggregate annualized revenue exceeding $12 billion. The remaining ~95% of the U.S. dental practice base — approximately 130,000 independent practices — provides the structural runway for continued consolidation through 2027-2028. The principal capital sources are KKR (Heartland + Planet DDS via separate ownership), Charlesbank/KKR/Warburg Pincus (MB2), Linden Capital + THL (Smile Doctors), GTCR (Dentalcorp post-acquisition), Patient Square Capital (Patterson Dental private), and BMO Bank + NXT Capital + Benefit Street Partners + Barings BDC (Smile Brands). The valuation arithmetic supporting the consolidation wave is analyzed in Part VIII.

## Part VIII: Dental Practice Valuation Economics

The dental-practice valuation environment in 2026 is the structural foundation for the consolidation wave. FOCUS Investment Banking's April 2026 *Dental Practice EBITDA Multiples* analysis projects that 2026 will be **the most robust dental M&A year since 2002**, with deal volume expected to accelerate as 61%[^158] of surveyed DSOs report their PE backers expect moderate-to-high acquisition activity increase in 2026.[^158] The headline acquisition multiples for general dentistry / DSO transactions remain consistent with the prior two years: **9-12x EBITDA for platform investments and 5-8x EBITDA for add-on acquisitions**, with revenue multiples typically running 1.0-1.8x.[^158]

The size-stratified breakdown clarifies the economics. Practices with under $1 million[^158] in EBITDA typically transact at 5-7x to small DSO tuck-ins or individual buyers, with valuation discounted for owner-dependence and limited infrastructure. Practices with $1-3 million EBITDA transact at 7-9x to regional DSO add-ons, reflecting strong hygiene mix and early operational maturity. Practices with $3-5 million EBITDA approach 9-11x as emerging platforms with multi-location stability, centralized functions, and established governance. **Platforms with $5 million[^158]-plus EBITDA reach 10-12x in select cases** with professional management and scalable footprint.[^158]

BizBuySell's empirical sold-business data — derived from actual dental practice transactions reported nationally — provides a complementary view of the SMB tier below platform-investment scale. The 2025 median dental practice sale price reached **$500,000, doubling from $250,000 in 2024**. Average earnings multiples in 2025 ran 3.28x with revenue multiples 0.87x; the 5-year (2021-2025) median sold-business earnings multiple is 2.63x and revenue multiple 0.77x.[^154] Median 2025 dental-practice revenue was $986,385 with discretionary earnings of $240,000 representing 24.3% of revenue.[^154] The 2025 doubling in median price reflects a disproportionate number of larger practices coming to market — the same secular trend that drives platform-tier valuations toward 10-12x.

SovDoc's June 2025 *Private Equity Approach to Valuing Dental Practice* guide complements the FOCUS multiples with a practical framework: Adjusted EBITDA × multiple = Enterprise Value, less debt and transaction fees = net proceeds.[^155] Capitalization rates in the dental sector typically fall between 25% and 31%, meaning every dollar of legitimate normalization adjustment to earnings lifts final practice value by three to four dollars.[^155] The methodology drives the structured-equity, "second-bite" liquidity, tracker-equity, and rigorous-compliance innovations that Holland & Knight's April 2025 *Healthcare Trend Report on DSOs* — which closed more than 250 dental deals since 2022 — identified as defining the current deal environment.[^28]

The deal-flow data confirms the trajectory. Per LevinPro Healthcare M&A: 242 dental transactions in 2024 and 180 in 2023, with the first quarter of 2025 alone tracking 96 Physician Medical Group acquisitions of which 44 were in the dental specialty.[^138] Mercer Capital's analysis frames the typical PE-backed DSO transaction structure: 70%[^138]-plus equity acquisition with practice-owner equity rollover into the PE fund as bonus; practice acquisition prices typically 4-7x EBITDA or 1-1.5x revenue; PE-to-PE flip exits at 10-12x EBITDA; new platform purchase prices reaching 8x EBITDA.[^29] Practice margins typically 30-40% (50% for specialized practices).[^29] Average net income increase of $50,000 post-DSO affiliation as practice owners are freed from non-clinical operational tasks.[^29] **Twenty-seven of the top 30 DSOs are PE-majority-owned**.[^29]

Henry Schein Dental Practice Transitions — the largest single dental practice brokerage — has completed **1,607 practice valuations and $426 million in practice sales since 2020**.[^156] The brokerage's September 2025 *Tech-Driven Playbook* identifies the contemporary valuation drivers as AI diagnostics adoption, cloud-based PMS deployment, online scheduling and digital forms, and Jarvis Analytics-style KPI dashboards — all factors that command valuation premiums beyond the base EBITDA multiple.[^157]

## Part IX: Founder Velocity and Investment Thesis

The dental-vertical investment landscape segments into four distinct tiers, each with a different defensibility profile and typical capital trajectory.

**Tier 1: AI-Imaging Platforms.** Pearl ($98 million[^136]-plus total funding incl. $58 million[^136] Series B[^136], July 2024, Left Lane Capital-led; 8 FDA clearances; 500,000-plus practices commercially across 6 continents), Overjet ($155.11 million[^136] total funding across 9 rounds with $550 million[^136] March 2024 valuation; 10 FDA clearances; 120 million-plus payer membership coverage; ADA-participated Series C[^136]), and VideaHealth ($70 million[^136] total post-Series B[^136] Threshold Ventures-led January 2025; Heartland + Dentalcorp + Aspen 1,100-practice integration) define the FDA-cleared category leaders.[^136][^137][^81] Diagnocat (CBCT semi-automated K251072 September 2025), Orca Dental AI (cephalometric K231 January 2025; CEPHX3D K252538 March 2026), Denti.AI (founded 2017 Dover, Delaware), and KELLS (founded 2018 Long Island City) occupy the second tier of dental-AI specialists.[^123][^86]

**Tier 2: Patient Experience Platforms.** NexHealth ($125 million[^56] Series C[^56] $1 billion[^56] valuation; 68 million patient records; 10,000-plus practices) anchors the EHR-integration / patient-experience tier, with Synchronizer API supporting 100-plus EHRs and customers including Mid-Atlantic Dental Partners, Coast Dental, Jefferson Dental, plus Quip + Swell + SmileDirectClub.[^56][^93] **Dental Intelligence** (PSG-backed) acquired Modento in March 2021 and LocalMed Online Scheduling in August 2019, building an analytics-plus-engagement-plus-scheduling stack.[^88] **RevenueWell** (founded 2010), **Lighthouse 360** (Henry Schein One acquired March 2019), and **Weave** (YC-backed, IPO'd) round out the patient-engagement-acquisition pattern.[^41][^90]

**Tier 3: Practice Management Tier.** Planet DDS (KKR-backed; 14,500 practices / 175,000 users[^44]; AI-first DentalOS roadmap), Curve Dental (Clearlake-owned), Henry Schein One (Henry Schein + Internet Brands JV), Patterson Dental (Patient Square Capital private since April 2025), and Open Dental (open-source; 1,547 verified U.S. companies, $199/month base) define the PMS competitive set.[^44][^66][^67] Carestream Dental occupies a parallel imaging-plus-PMS tier with Sensei + Swissmeda product lines and 125-year dental-imaging heritage.[^43]

**Tier 4: DSO Tier.** KKR (Heartland + Planet DDS via separate ownership), Charlesbank/KKR/Warburg Pincus (MB2 Dental), Linden Capital + Thomas H. Lee Partners (Smile Doctors), Patient Square Capital (Patterson Dental private), GTCR (Dentalcorp post-September 2025 acquisition at C$2.2 billion[^126] equity / C$3.3 billion[^126] enterprise / 33%[^126] premium), BMO Bank + NXT Capital + Benefit Street Partners + Barings BDC (Smile Brands $408 million total raised).[^126][^132][^135][^149]

The GTM patterns across the four tiers reveal three structural channels. The **payer route** (Overjet's path with 16 dental insurer partnerships covering 75 million-plus Americans extended to 120 million-plus payer membership) builds defensibility through claims-review consistency, FDA-cleared accuracy, and insurer-side integration that becomes harder to displace with each cohort of claims processed.[^137] The **DSO direct-sales route** (VideaHealth-Aspen 1,100-practice deployment, VideaHealth-Heartland partnership, Pearl-Carestream integration, Suki-WellSky ambient pattern transferring from senior-care) builds defensibility through operator-relationship density and scale-customer reference accounts.[^141][^81] The **PMS-integration route** (Pearl-Eaglesoft July 2024 partnership, VideaHealth-Henry Schein One Detect AI integration into Dentrix, Planet DDS DentalOS native AI agentic capabilities) builds defensibility through embedded chairside workflow that competitors cannot easily replicate without their own PMS distribution.[^42][^81][^44]

The defensibility moats compound differently. Pearl's data moat (largest commercial footprint plus the world's largest dental radiograph training dataset), Overjet's payer-channel moat (120M+ payer membership deeply integrated into claims-review workflows), and VideaHealth's DSO-channel moat (Aspen 1,100+ practices, Heartland deployment, Dentalcorp Canada deployment) each have different decay characteristics. The structural question is whether the FDA-cleared specialists can build moats deep enough that the EHR triopoly prefers integration over native-build, or whether one or more EHR vendors will replicate enough AI-augmentation natively to commoditize the imaging-AI tier — and whether the third-cohort of dental-AI startups (Diagnocat, Orca, Denti.AI, KELLS) reaches scale before the consolidation arithmetic favors a small number of winners.

## Part X: Predictions for 2026-2028

The combined effect of the structural shifts mapped in Parts I-IX produces a near-term forecast that is more concrete than is typical for vertical-survey papers. Six predictions follow, each anchored to one of the structural drivers analyzed earlier.

**Prediction 1: 2026 dental M&A volume will exceed 280 transactions, the highest annual count since 2002.**[^158] FOCUS Investment Banking's analyst forecast plus 61% DSO/PE-backer acquisition-acceleration data anchors this prediction. Heartland Dental added 93 supported practices in calendar 2025; Aspen Dental opened 21 new locations; PDS Health added 77; Smile Doctors added 76+ via myOrthos plus organic growth; Dentalcorp added approximately 38 in calendar 2025; MB2 Dental added 36+; Smile Brands and Sonrava continued affiliations. The 2024 baseline of 242 dental transactions and 180 in 2023 establishes the trajectory.[^138]

**Prediction 2: California SB 351 will be replicated in 3-5 additional states by end-2027.** Likely candidates include New York, Massachusetts, New Jersey, Oregon, and Washington — each of which has independently introduced or pursued dental-therapist legislation alongside parallel CPOD reform inquiry.[^37][^110] AB-3129-style PE-restriction bills are likely to advance in the legislatures of MA, WA, and NY before end-2027. The American Economic Liberties Project's December 2025 *Independent Dental Practice Act* model legislation provides the template that activist state legislators may adopt.[^112]

**Prediction 3: Pearl will reach unicorn-tier valuation by 2027.** Pearl's $98 million[^136]-plus total funding, +458%[^136] 2023 revenue growth, and 500,000-plus commercial practice presence across 6 continents establish the valuation trajectory.[^136] Overjet may exit first via strategic acquisition — likely candidates include Henry Schein One (which would consolidate Dentrix + VideaHealth-Detect-AI + Overjet AI into a single Henry Schein dental-AI stack), Patterson Dental (now Patient Square Capital private; would gain AI-augmentation parity vs Henry Schein), or Align Technology (clear-aligner platform with adjacent imaging-AI value).

**Prediction 4: VideaHealth's 1,100-practice Aspen integration plus Heartland and Dentalcorp deployment will produce the first published large-scale dental-AI outcome study by mid-2027.** A peer-reviewed study examining treatment-acceptance rates, cavity-detection-rate uplift, and revenue-per-visit lift across the integrated network is the natural research output, and the resulting publication will become the new clinical-evidence anchor for AI-augmentation buyer cases across the DSO tier.[^141][^81]

**Prediction 5: The 2026-2027 OBBBA Medicaid compression will reduce U.S. adult Medicaid dental utilization by 5-10%[^46]** as states adjust to the $911 billion[^46] federal Medicaid reduction over the decade and as the provider-tax safe-harbor reduction begins biting in October 2026.[^46][^108] Twenty-two states with provider-tax safe-harbor reductions face the deepest pressure on the optional adult dental benefit. Eighteen states that enhanced their adult Medicaid dental benefits since 2021 are most exposed to rollback risk. Pediatric dental — protected under EPSDT — will see reimbursement-rate compression rather than benefit-reduction. The KFF Health News six-state sample (Maryland 22%[^35], Oklahoma 16%[^35], Maine 13%[^35], New Hampshire 19%[^35], Tennessee 16%[^35], Virginia 21%[^35] adult Medicaid dental utilization) sets the 2024-2025 baseline against which 2026-2027 declines will be measured.[^35]

**Prediction 6: The PMS market will see one major consolidation transaction by 2028.** The dental-PMS market trajectory of $2.6 billion[^64] (2025) to $6.4 billion (2034) at 10.6% CAGR makes consolidation arithmetic compelling.[^64] Most likely scenarios: (a) Carestream Dental sold to Henry Schein One or to a PE consolidator, completing the three-stack consolidation thesis; (b) Open Dental acquired by a strategic dental-vendor or a healthcare-software PE platform, ending the open-source standalone era; (c) Patterson Dental's 2026 subscription-only pivot succeeds and triggers a Patient Square Capital strategic-or-IPO exit at meaningfully higher valuation than the April 2025 take-private price.[^66][^68] The combination of cloud-PMS shift, AI-augmentation embedding, and PE consolidation appetite makes 2028 the natural inflection point.

Taken together, these predictions imply a 2027 dental landscape with one or more AI-native unicorns, a meaningfully consolidated DSO buyer base, an enlarged FDA-cleared dental-AI category leader set, a state-by-state CPOM/CPOD codification wave following California's lead, and a compressed adult Medicaid dental envelope — against a market backdrop of accelerating demographic demand, structurally constrained dentist supply, and sustained 4-5% top-line market growth. The strategic call to founders is to build for FDA-cleared clinical-decision-support sold to operator-funded enterprise SaaS buyers, distributed through DSO-affiliated networks or PMS-integration partnerships, with measurable case-acceptance and revenue-capture outcome metrics — rather than competing for Medicaid-funded utilization that is now structurally compressed.

## Glossary

**ADA** — American Dental Association; the principal U.S. dental professional society and publisher of CDT.

**Adjusted EBITDA** — Earnings Before Interest, Taxes, Depreciation, and Amortization with normalization adjustments for owner-specific expenses; the foundational metric for dental practice valuation.

**Apteryx Imaging** — Planet DDS subsidiary; XrayVision + XVWeb + DCV imaging products; ~$86.4M annual revenue.

**Aspen Group / TAG** — Multi-brand healthcare support organization; Aspen Dental + ClearChoice + WellNow + Chapter Aesthetic + Lovet Pet; $4.2B annualized H1 2025 revenue / 1,400+ locations 46 states.

**BNPL** — Buy Now, Pay Later; Sunbit installment-loan model.

**CBCT** — Cone Beam Computed Tomography; 3D dental imaging modality.

**CDT** — Code on Dental Procedures and Nomenclature; ADA-published HIPAA-required dental procedure coding standard. CDT 2026 = 60 changes effective Jan 1, 2026.

**CMS CRUSH** — Comprehensive Regulations to Uncover Suspicious Healthcare; CMS proposed AI-fraud-detection initiative.

**ClearChoice Implant Centers** — TAG-affiliated dental implant brand; 27,500 implant patients 2025.

**CPOM / CPOD** — Corporate Practice of Medicine / Corporate Practice of Dentistry; state-law restrictions on non-licensed-clinician ownership of clinical practices.

**Curve Dental** — Cloud-native dental PMS; Clearlake-owned.

**DCA** — Dental Care Alliance; ~400 affiliated practices.

**Denticon** — Planet DDS cloud PMS for DSOs and multi-location groups.

**Dentrix** — Henry Schein One PMS; ~35,000 practices, ~19% market share.

**Dentalcorp** — Canadian DSO; TSX:DNTL; 590 locations Q3 2025; GTCR-acquired Sept 26, 2025 at C$2.2B equity / C$3.3B enterprise.

**DSO** — Dental Service Organization; non-clinical administrative-support entity affiliated with multiple dental practices.

**Eaglesoft** — Patterson Dental PMS; ~30,000 active users; Patient Square Capital ownership.

**EBITDA Multiple** — Acquisition price ÷ EBITDA; dental: 5-8x add-on, 9-12x platform.

**Endura Elite** — ClearChoice's full-arch zirconia restoration product.

**EPSDT** — Early and Periodic Screening, Diagnostic, and Treatment; federally mandated Medicaid pediatric dental coverage.

**Federal False Claims Act** — Federal anti-fraud statute used in dental Medicaid enforcement.

**FOCUS Banking** — Investment-banking advisor publishing dental EBITDA multiple benchmarks.

**Heartland Dental** — Largest U.S. DSO; KKR majority since 2018; 1,900+ locations / 39 states + DC / $1.7B revenue.

**Henry Schein One** — Henry Schein + Internet Brands JV, founded 2018; Dentrix + Dentrix Ascend + DEXIS + Lighthouse 360 + Jarvis Analytics.

**HHS-OIG** — Department of Health and Human Services Office of Inspector General; healthcare-fraud enforcement.

**Holland & Knight** — Law firm reporting 250+ dental deals closed since 2022.

**Jefferson Dental** — Texas DSO; 60+ locations; transitioning to Denticon April 2026.

**KKR** — Private equity firm; majority owner of Heartland Dental and Planet DDS.

**Lighthouse 360** — Henry Schein One-acquired patient-engagement platform; 11,000+ practices at 2019 acquisition.

**MB2** — MB2 Dental Solutions; 750+ locations across 45 states; Charlesbank/KKR/Warburg Pincus-owned.

**Medicaid Adult Dental** — Optional Medicaid benefit; 38 states + DC offered enhanced coverage as of last year.

**Modento** — Patient-engagement platform; Dental Intelligence acquired March 2021.

**NADP** — National Association of Dental Plans; trade association for dental insurance.

**NexHealth** — Patient-experience platform; $125M Series C at $1B valuation; 68M patient records.

**OBBBA / Public Law 119-21** — One Big Beautiful Budget Act; signed July 4, 2025; comprehensive Medicaid + Medicare + ACA + tax reform.

**Open Dental** — Open-source dental PMS; 1,547 verified U.S. companies; $199/month base pricing.

**Orca Dental AI** — Israel-based dental AI; cephalometric analysis K231 + CEPHX3D K252538.

**Overjet** — Boston-based dental AI; 10 FDA clearances; $155.11M total funding; $550M valuation; 120M+ payer coverage.

**Patient Square Capital** — Took Patterson Dental private April 2025.

**Patterson Dental** — Patterson Companies' dental subsidiary; Eaglesoft + Fuse PMS.

**PDS Health** — Pacific Dental Services rebranded; $3.1B+ revenue 2025; 1,100+ practices; CEO Stephen Thorne.

**Pearl Second Opinion** — World's first FDA-cleared dental-AI software (K210365 March 2022); 8 clearances total; 94% accuracy.

**Planet DDS** — Cloud dental PMS; KKR-backed; 14,500 practices / 175,000 users; DentalOS AI roadmap.

**PSG** — Private-equity firm backing Dental Intelligence (Modento parent).

**RCM** — Revenue Cycle Management; Vyne Dental Trellis 84,000+ practices.

**SB 351** — California Senate Bill 351; signed Oct 6, 2025; codifies CPOM/CPOD restrictions on PE/hedge funds; effective Jan 1, 2026.

**Smile Brands** — DSO; $408M total raised[^149]; BMO Bank + NXT Capital + Benefit Street Partners + Barings BDC investors.

**Smile Design Dentistry** — Florida DSO acquired by Heartland September 8, 2025; 60 practices.

**Smile Doctors** — Largest U.S. orthodontic-support organization; 550+ locations 36 states; Linden Capital + THL.

**SovDoc** — Investment-banking advisor publishing dental practice valuation framework.

**State-Directed Payment** — Medicaid MCO supplemental payment mechanism; OBBBA caps at FFS-rate level.

**Sunbit** — Dental patient-financing BNPL; 87% approval rate; 1.9% practice fees.

**TAG University** — The Aspen Group clinical training platform; covers digital workflows + implant-focused operating system.

**VideaHealth** — Boston-based dental AI; $70M total funding; K232384 covers 10 pathologies + 25 findings; ages 3+; 1,100+ Aspen practice integration.

**Vyne Dental** — Dental RCM platform; 84,000+ practices / 800+ payer connections; Trellis product.

**Weave** — Patient-communication platform; YC-backed; Forbes Cloud 100; Inc 5000.

**Yomi Dental Implant Robot** — FDA-cleared dental implant robotic surgery system; first Aspen Dental affiliate deployment in Topeka, KS.

## Related Research

This paper sits within the perea.ai *State of Vertical Agents 2027* series — a multi-paper survey of how AI-native operators are reshaping U.S. labor- and operations-intensive verticals.

- ***State of Vertical Agents 2027: Senior Care & Aging-in-Place Operations*** — sister paper covering the AI-native ambient layer (Sensi.AI / Inspiren / WellSky-Suki) for senior-care delivery, the CMS GUIDE Model dementia-care payment architecture, and the federal nursing-home staffing-rule collapse under Section 71111 of PL 119-21.
- ***State of Vertical Agents 2027: Marketplace Seller Operations*** — sister paper analyzing the AI-native operator stack across Amazon, Shopify, Etsy, and Walmart marketplace verticals.
- ***State of Vertical Agents 2027: Independent Contractor & Freelance Finance*** — sister paper covering the 1099/freelance financial-stack vertical (Catch, Solo, Ovation).
- ***Castellanos v. State of California Aftermath: The Worker Classification Battlefield*** — adjacent worker-classification context for the gig-economy/dental-hygienist staffing-platform debate.
- ***The Federal Portable Benefits Stack 2026*** — adjacent legislative architecture for the 1099 dental-hygienist + 1099 dental-assistant staffing-platform vertical.

The next derived-research targets queued from this paper for the perea-research-engine roadmap include: ***State of Vertical Agents 2027: Bootcamp Credentialing***; ***State of Vertical Agents 2027: The Local-Services Aggregator Layer***; ***State of Vertical Agents 2027: Veterinary Operations*** (derived from TAG / Lovet Pet Health Care expansion thesis); and ***Dental AI FDA Clearance Tracker 2027 Edition*** (a reference resource cataloguing all FDA 510(k) clearances across the dental-AI category).

## References

[^1]: American Dental Association Health Policy Institute, *U.S. Dentist Workforce — 2025 Update*, 2025. https://www.ada.org/-/media/project/ada-organization/ada/ada-org/files/resources/research/hpi/US_dentist_workforce_2025.pdf (accessed 2026-05-08).

[^5]: ADA HPI, *Q3 2025 Economic Outlook and Emerging Issues in Dentistry Panel Report*, September 2025. https://www.ada.org/-/media/project/ada-organization/ada/ada-org/files/resources/research/hpi/q32025_economic_outlook_dentistry_main.pdf (accessed 2026-05-08).

[^6]: ADA HPI, *Wage and Job Count Dashboard*, 2026. http://www.ada.org/resources/research/health-policy-institute/wage-and-job-count-dashboard (accessed 2026-05-08).

[^18]: Grand View Research, *U.S. Dental Services Market Size, Share & Trends Analysis Report 2024-2030*, 2024. https://www.grandviewresearch.com/industry-analysis/us-dental-services-market-report (accessed 2026-05-08).

[^19]: GII Research, *United States Dental Services Market Share Analysis 2026-2031*, February 2026. https://www.giiresearch.com/report/moi1934909-united-states-dental-services-market-share.html (accessed 2026-05-08).

[^20]: Towards Healthcare, *U.S. Dental Services Market Sizing Insights 2034*, April 2026. https://www.towardshealthcare.com/insights/us-dental-services-market-sizing (accessed 2026-05-08).

[^21]: Cervicorn Consulting, *U.S. Dental Services Market Size, Share, Growth Report 2026 to 2035*, 2026. https://www.cervicornconsulting.com/us-dental-services-market (accessed 2026-05-08).

[^22]: Mordor Intelligence, *United States Dental Services Market Size & Share Analysis 2026-2031*, October 2024 (refreshed 2026). https://www.mordorintelligence.com/industry-reports/united-states-dental-services-market (accessed 2026-05-08).

[^23]: Grand View Research, *U.S. Dental Market Trends, Consolidation Outlook, And Practice Economics Benchmark Analysis 2025*, January 2026. https://www.grandviewresearch.com/market-trends/us-dental-market-trends-consolidation-practice-economics-analysis (accessed 2026-05-08).

[^24]: Becker's Dental Review, *Where the Largest DSOs Stand Halfway Through 2025*, June 2025. https://beckersdental.com/dso-dpms/where-the-largest-dsos-stand-halfway-through-2025 (accessed 2026-05-08).

[^28]: Holland & Knight, *Healthcare Trend Report: Dental Support Organizations*, April 2025. https://www.hklaw.com/en/insights/publications/2025/04/healthcare-trend-report-dental-support-organizations (accessed 2026-05-08).

[^29]: Mercer Capital, *Dental Service Organizations*, 2025. https://mercercapital.com/insights/posts/2025/dental-service-organizations/ (accessed 2026-05-08).

[^30]: Private Equity Stakeholder Project, *Private Equity Health Care Acquisitions — March 2025*, April 2025. https://pestakeholder.org/news/private-equity-health-care-acquisitions-march-2025 (accessed 2026-05-08).

[^33]: MoneyGeek, *Does Medicare Advantage Cover Dental? (2026 Guide)*, April 2026. https://www.moneygeek.com/insurance/health/does-medicare-advantage-cover-dental/ (accessed 2026-05-08).

[^35]: KFF Health News, *Medicaid Is Paying for More Dental Care — GOP Cuts Threaten to Reverse the Trend*, March 2026. https://kffhealthnews.org/news/article/medicaid-cuts-dental-coverage-republicans-big-beautiful-bill (accessed 2026-05-08).

[^37]: Stateline, *Dental Therapists, Who Can Fill Cavities and Check Teeth, Get the OK in More States*, July 2024. https://stateline.org/2024/07/17/dental-therapists-who-can-fill-cavities-and-check-teeth-get-the-ok-in-more-states/ (accessed 2026-05-08).

[^41]: Henry Schein, Inc. Investor Relations, *Henry Schein Acquires Lighthouse 360 from Web.com*, March 18, 2019. https://investor.henryschein.com/news-releases/news-release-details/henry-schein-acquires-lighthouse-360-webcom-0 (accessed 2026-05-08).

[^42]: Patterson Dental, *Eaglesoft Practice Management Software Product Page*, 2026. http://patterson.eaglesoft.net/ (accessed 2026-05-08).

[^43]: Carestream Dental, *Company Overview*, 2026. https://carestreamdental.com/ (accessed 2026-05-08).

[^44]: Planet DDS, *Planet DDS Expands Lead in Enterprise and Multi-Location DSO Adoption in 2025*, January 28, 2026. https://www.planetdds.com/newsroom/planet-dds-enterprise-dso-adoption/ (accessed 2026-05-08).

[^46]: Congressional Budget Office, *Score of Public Law 119-21 (One Big Beautiful Budget Act): Medicaid Spending Effects*, July 2025. https://www.cbo.gov/publication/119-21-medicaid-score (accessed 2026-05-08).

[^47]: FDA 510(k) Premarket Notification K210365 — Pearl Inc. Second Opinion, January 24, 2022 receipt. https://510k.innolitics.com/search/K210365 (accessed 2026-05-08).

[^48]: Pearl Inc., *FDA Clears World's First AI Software to Read Dental X-Rays*, Press Release, 2022 (Pearl press archive 2025). https://hellopearl.com/news/fda-clears-worlds-first-ai-software-to-read-dental-x-rays-3e780 (accessed 2026-05-08).

[^49]: Pearl Inc., *Pearl Expands Dental AI Capabilities with FDA Clearance for Panoramic X-Rays*, Press Release, January 28, 2026. https://www.hellopearl.com/press-release/pearl-expands-dental-ai-capabilities-with-fda-clearance-for-panoramic-x-rays (accessed 2026-05-08).

[^50]: Pearl Inc., *FDA Clears Pearl's Second Opinion for Automated Bone Level Analysis*, Press Release, September 2025. https://hellopearl.com/news/fda-clears-pearls-second-opinion-r-for-automated-bone-level-analysis (accessed 2026-05-08).

[^51]: Pearl Inc., *Second Opinion Real-Time Pathology Detection AI Product Page*, 2026. http://hellopearl.com/products/second-opinion (accessed 2026-05-08).

[^52]: Overjet, *Overjet Receives Second FDA Clearance — Caries Assist*, July 2024. https://www.overjet.com/blog/overjet-receives-second-fda-clearance-adding-overjet-caries-assist-to-the-industry-s-1-dental-ai-platform (accessed 2026-05-08).

[^54]: Overjet, *Overjet Raises $53 Million: The Largest Investment in the History of Dental AI*, March 5, 2024. https://overjet.com/blog/overjet-raises-53-million-the-largest-investment-in-the-history-of-dental-ai (accessed 2026-05-08).

[^55]: Overjet, *Overjet Announces New FDA Clearance for CBCT 3D Imaging*, December 16, 2025. https://overjet.com/blog/overjet-announces-new-fda-clearance-for-cbct-3d-imaging (accessed 2026-05-08).

[^56]: NexHealth, *NexHealth Raises $125M Series C at $1B Valuation*, July 17, 2025. https://www.nexhealth.com/resources/series-c (accessed 2026-05-08).

[^57]: Vyne Dental, *Trellis Revenue Acceleration Platform*, 2026. https://vynedental.com/trellis/ (accessed 2026-05-08).

[^58]: Vyne Dental, *Dental Revenue Cycle Management and Billing Solutions Home*, January 2025. https://vynedental.com/home-2025/ (accessed 2026-05-08).

[^59]: Apteryx Imaging (Planet DDS), *Apteryx Imaging Solutions*, 2026. https://planetdds.com/solutions/apteryx (accessed 2026-05-08).

[^60]: CareCredit, *Dental Care Financing Options*, 2026. https://www.carecredit.com/dentistry/ (accessed 2026-05-08).

[^61]: Sunbit, *Dental Patient Financing Solution*, July 2025. https://sunbit.com/dental/ (accessed 2026-05-08).

[^62]: Sunbit, *Sunbit No Interest Dental Plans*, January 2026. https://sunbit.com/knowledge-center/dental/sunbit-no-interest-dental-plans/ (accessed 2026-05-08).

[^64]: The Molar Report, *10 Best Dental Software Platforms (2026) Ranked*, February 2026. https://www.themolarreport.com/learn/best-dental-software-2026 (accessed 2026-05-08).

[^65]: The Molar Report, *Dentrix Review (2026): Pricing, Features & Honest Rating*, March 2026. https://www.themolarreport.com/reviews/dentrix (accessed 2026-05-08).

[^66]: The Molar Report, *What Is Eaglesoft? Patterson's Dental Software Explained*, April 2026. https://www.themolarreport.com/learn/what-is-eaglesoft (accessed 2026-05-08).

[^67]: The Molar Report, *Open Dental Review (2026): Best Value in Dental Software?*, April 2026. https://www.themolarreport.com/reviews/open-dental (accessed 2026-05-08).

[^68]: PracticeSignal, *Q1 2026 Dental Software Buyer's Report*, April 2026. https://practicesignal.com/dental/buyers-report-q1-2026 (accessed 2026-05-08).

[^69]: PracticeSignal, *Dentrix vs Eaglesoft: Full Comparison (2026)*, March 2026. https://practicesignal.com/dental/compare/dentrix-vs-eaglesoft (accessed 2026-05-08).

[^70]: PracticeSignal, *Complete Guide to Switching from Open Dental (2026)*, March 2026. https://practicesignal.com/dental/switching/open-dental (accessed 2026-05-08).

[^71]: PracticeSignal, *CareCredit vs Sunbit vs Cherry (2026): Approval Rates, Fees, Payouts*, March 2026. https://practicesignal.com/dental/compare/carecredit-vs-sunbit-vs-cherry (accessed 2026-05-08).

[^77]: BuiltWith, *Open Dental Usage Statistics*, 2026. https://trends.builtwith.com/cms/Open-Dental (accessed 2026-05-08).

[^78]: Landbase, *Companies Using Open Dental Software in 2026*, August 2025. https://data.landbase.com/technology/open-dental-software/ (accessed 2026-05-08).

[^79]: Open Dental Software, *LinkedIn Company Profile*, June 2025. https://no.linkedin.com/company/open-dental-software (accessed 2026-05-08).

[^80]: Technology Evaluation Centers, *Dentrix Reviews & Pricing 2026*, April 2021 (refreshed 2026). https://technologyevaluation.com/solutions/53583/dentrix (accessed 2026-05-08).

[^81]: VideaHealth, *VideaHealth Raises $40M in Oversubscribed Series B*, January 28, 2025. https://www.businesswire.com/news/home/20250128195626/en/VideaHealth-Raises-%2440M-in-Oversubscribed-Series-B-Funding-to-Revolutionize-Dental-Care-with-AI-Driven-Solutions (accessed 2026-05-08).

[^84]: SiliconANGLE, *AI Dentistry Startup VideaHealth Bites Off $40M in Venture Capital Funding*, January 28, 2025. https://siliconangle.com/2025/01/28/ai-dentist-startup-videahealth-bites-off-40m-venture-capital-funding/ (accessed 2026-05-08).

[^85]: GetLatka, *How VideaHealth Hit $6.8M Revenue and 300 Customers in 2024*, 2025. https://getlatka.com/companies/videahealth (accessed 2026-05-08).

[^86]: CB Insights, *Overjet Stock Price, Funding, Valuation, Revenue & Financial Statements*, December 2025. https://www.cbinsights.com/company/overjet/financials (accessed 2026-05-08).

[^87]: Fierce Biotech, *Dentistry AI Developer Overjet Chows Down on $53M VC Round*, March 2024. https://www.fiercebiotech.com/medtech/dentistry-ai-developer-overjet-chows-down-53m-vc-round (accessed 2026-05-08).

[^88]: Dentistry Today, *Dental Intelligence Acquires Modento*, March 12, 2021. https://www.dentistrytoday.com/dental-intelligence-acquires-modento/ (accessed 2026-05-08).

[^90]: SourceForge, *Modento vs RevenueWell vs Weave Comparison*, 2025. https://sourceforge.net/software/compare/Modento-vs-RevenueWell-vs-Weave/ (accessed 2026-05-08).

[^93]: Extruct AI, *NexHealth Funding | Complete Analysis*, July 2025. https://www.extruct.ai/hub/nexhealth-com-funding/ (accessed 2026-05-08).

[^96]: Vyne Dental, *Vyne Trellis Product Page*, February 2023 (refreshed 2026). https://vynedental.com/trellis-product/ (accessed 2026-05-08).

[^98]: ADA News, *60 Changes Coming to CDT Code in 2026*, June 2025. https://adanews.ada.org/ada-news/2025/june/60-changes-coming-to-cdt-code-in-2026-1 (accessed 2026-05-08).

[^100]: ADA News, *Revised CDT Codes You Should Know for 2026*, November 17, 2025. https://adanews.ada.org/ada-news/2025/november/revised-cdt-codes-you-should-know-for-2026/ (accessed 2026-05-08).

[^101]: ADA, *CDT 2026 Anesthesia Coding Guide*, December 15, 2025. https://www.ada.org/-/media/project/ada-organization/ada/ada-org/files/publications/cdt/cdtcodingguide_nitrousoxide_sedation_general_anesthesia_2026jan.pdf (accessed 2026-05-08).

[^102]: ADA News, *New CDT Codes You Should Know for 2026*, September 29, 2025. https://adanews.ada.org/ada-news/2025/september/new-cdt-codes-you-should-know-for-2026/ (accessed 2026-05-08).

[^103]: Delta Dental, *2026 CDT Code Additions, Revisions & Deletions*, 2025. https://deltadentalks.com/dentist/updates/single/2026-cdt-code-additions-revisions-deletions (accessed 2026-05-08).

[^104]: Public Law 119-21, *One Big Beautiful Budget Act*, July 4, 2025. https://www.congress.gov/119/plaws/publ21/PLAW-119publ21.pdf (accessed 2026-05-08).

[^105]: National Association of Dental Plans, *Medicaid Dental Benefits and the One Big Beautiful Bill Act*, March 19, 2026. https://www.nadp.org/medicaid-dental-benefits-and-the-one-big-beautiful-bill-act/ (accessed 2026-05-08).

[^106]: American Medical Association, *Changes to Medicaid, the ACA and Other Key Provisions of the One Big Beautiful Bill Act*, April 24, 2026. https://www.ama-assn.org/OB3 (accessed 2026-05-08).

[^108]: New York State Dental Association, *Status of Medicaid Dental Benefits — One Big Beautiful Bill*, 2026. https://www.nysdental.org/MedicaidUpdate (accessed 2026-05-08).

[^109]: Fox Rothschild, *Florida's Corporate Practice of Dentistry — Health Care Law Matters*, February 21, 2025. https://healthcarelawmatters.foxrothschild.com/2025/02/articles/health-care-providers/dental-practices/floridas-corporate-practice-of-dentistry-navigating-restrictions-and-the-role-of-dental-practice-management-companies/ (accessed 2026-05-08).

[^110]: Sidley Austin LLP, *Newly Enacted California Law Formalizes Corporate Practice Restrictions*, October 2025. http://www.sidley.com/en/insights/newsupdates/2025/10/newly-enacted-california-law-formalizes-corporate-practice-restrictions (accessed 2026-05-08).

[^111]: Goodwin Procter LLP, *California Governor Signs Bill Codifying Existing Corporate Practice Restrictions*, October 9, 2025. https://www.goodwinlaw.com/en/insights/publications/2025/10/alerts-privateequity-hltc-california-governor-signs-bill (accessed 2026-05-08).

[^112]: American Economic Liberties Project, *Model Legislation: The Independent Dental Practice Act*, December 18, 2025. https://www.economicliberties.us/our-work/model-legislation-the-independent-dental-practice-act/ (accessed 2026-05-08).

[^113]: Colorado General Assembly, *HB 25-194 Enrolled*, April 25, 2025. https://leg.colorado.gov/sites/default/files/documents/2025A/bills/2025a_194_enr.pdf (accessed 2026-05-08).

[^117]: FDA 510(k) Premarket Notification K252538 — CEPHX3D Orca Dental AI, decision March 5, 2026. https://www.accessdata.fda.gov/scripts/cdrh/cfdocs/cfPMN/pmn.cfm?ID=K252538 (accessed 2026-05-08).

[^118]: FDA 510(k) Premarket Notification K251109 — SMARTDent Ray Co Ltd, May 22, 2025. https://www.accessdata.fda.gov/cdrh_docs/pdf25/K251109.pdf (accessed 2026-05-08).

[^119]: FDA 510(k) Premarket Notification K253959 — Primevision 3D, decision February 5, 2026. https://www.accessdata.fda.gov/scripts/cdrh/cfdocs/cfpmn/pmn.cfm?ID=K253959 (accessed 2026-05-08).

[^120]: Becker's Dental Review, *What DSOs Need to Know About Medicaid Fraud Enforcement*, April 6, 2026. https://www.beckersdental.com/featured-perspectives/what-dsos-need-to-know-about-medicaid-fraud-enforcement/ (accessed 2026-05-08).

[^123]: AI Doctor Tools, *Dental AI FDA Clearance Tracker*, January 2026. https://aidoctortools.com/clinical-ai/dental-ai-fda-clearance-tracker/ (accessed 2026-05-08).

[^125]: Heartland Dental, *Heartland Dental Celebrates Transformative Growth, Innovation, and Community Impact in 2025*, January 28, 2026. https://blog.heartland.com/heartland-dental-celebrates-transformative-growth-innovation-and-community-impact-in-2025 (accessed 2026-05-08).

[^126]: Heartland Dental, *Company Profile*, February 2026. https://heartland.com/ (accessed 2026-05-08).

[^127]: The Aspen Group, *TAG Invests in the Future of Retail Healthcare, Reporting Strong 2025 Results*, March 10, 2026. https://aspendental.mediaroom.com/2026-03-10-The-Aspen-Group-TAG-Invests-in-the-Future-of-Retail-Healthcare,-Reporting-Strong-2025-Results (accessed 2026-05-08).

[^128]: The Aspen Group, *Aspen Dental and ClearChoice Anchor Strong Growth — H1 2025 Press Release*, August 25, 2025. https://aspendental.mediaroom.com/2025-08-25-Aspen-Dental-and-ClearChoice-Anchor-Strong-Growth,-Innovation-Across-The-Aspen-Groups-Multi-Brand-Healthcare-Portfolio (accessed 2026-05-08).

[^129]: PDS Health, *Appreciating Our 2025 Milestones*, February 24, 2026. https://www.pdshealth.com/blog/company-news/appreciating-our-2025-milestones/ (accessed 2026-05-08).

[^130]: PDS Health, *PDS Health Expands Specialty Dental Support and Specialist Ownership Model*, April 10, 2025. https://www.pacificdentalservices.com/newsroom/press-releases/pds-health-expands-specialty-dental-support-and-specialist-owner/ (accessed 2026-05-08).

[^131]: PDS Health, *PDS Health Advanced Dental-Medical Integration, Growth and Innovation in 2024*, January 31, 2025. https://www.pacificdentalservices.com/newsroom/press-releases/pds-health-advanced-dental-medical-integration-growth-and-innova/ (accessed 2026-05-08).

[^132]: Smile Doctors, *Smile Doctors Acquires myOrthos*, March 20, 2025. https://smiledoctorspartners.com/press-releases/smile-doctors-acquires-myorthos-accelerating-growth-and-expanding-orthodontic-care-nationwide/ (accessed 2026-05-08).

[^133]: Dentalcorp, *Q1 2025 Results*, May 12, 2025. https://investors.dentalcorp.ca/news/news-details/2025/Dentalcorp-Reports-First-Quarter-2025-Results/default.aspx (accessed 2026-05-08).

[^134]: Dentalcorp, *Q4 and FY 2024 Results — Inaugural Dividend Declared*, March 21, 2025. https://www.businesswire.com/news/home/20250321552127/en/Dentalcorp-Reports-Fourth-Quarter-and-Full-Year-2024-Results-Declares-Inaugural-Dividend (accessed 2026-05-08).

[^135]: Dentalcorp, *Q3 2025 Results — GTCR LLC Acquisition Announcement*, November 6, 2025. https://www.businesswire.com/news/home/20251106521216/en/Dentalcorp-Reports-Third-Quarter-2025-Results (accessed 2026-05-08).

[^136]: Pearl Inc., *Pearl Raises Largest-Ever Investment in Dental AI with $58 Million Round*, July 24, 2024. https://www.businesswire.com/news/home/20240724200226/en/Pearl-Raises-Largest-Ever-Investment-in-Dental-AI-with-58-Million-Round (accessed 2026-05-08).

[^137]: Overjet, *Overjet Raises $53 Million Series C — PR Newswire*, March 5, 2024. https://www.prnewswire.com/news-releases/overjet-raises-53-million-the-largest-investment-in-the-history-of-dental-ai-302079163.html (accessed 2026-05-08).

[^138]: LevinPro Healthcare M&A, *Heartland Dental Announces Fifth Acquisition of 2025*, March 26, 2025. https://healthcare.levinassociates.com/2025/03/26/heartland-dental-announces-fifth-acquisition-of-2025/ (accessed 2026-05-08).

[^139]: Mergr, *Heartland Dental Company Profile, Ownership & M&A Activity*, 2026. https://mergr.com/company/heartland-dental (accessed 2026-05-08).

[^140]: CB Insights, *Heartland Dental Stock Price, Funding, Valuation, Revenue & Financial Statements*, May 2023 (refreshed 2026). https://www.cbinsights.com/company/heartland-dental-care/financials (accessed 2026-05-08).

[^141]: Becker's Dental Review, *The Aspen Group's 3-Year Growth Recap: 40 Moves*, March 27, 2026. https://www.beckersdental.com/dso-dpms/the-aspen-groups-3-year-growth-recap-40-moves/ (accessed 2026-05-08).

[^142]: Becker's Dental Review, *Aspen Dental Eyes Technology, Access Advancements After Growth Spurt*, December 16, 2025. https://www.beckersdental.com/featured-perspectives/aspen-dental-eyes-technology-access-advancements-after-growth-spurt/ (accessed 2026-05-08).

[^144]: Becker's Dental Review, *What PDS Health Has Accomplished in 2025*, December 10, 2025. https://www.beckersdental.com/dso-dpms/what-pds-health-has-accomplished-in-2025/ (accessed 2026-05-08).

[^145]: Becker's Dental Review, *The Aspen Group Reports $4.2B in H1 Revenue: 5 Things to Know*, August 25, 2025. https://beckersdental.com/dso-dpms/the-aspen-group-reports-4-2b-in-h1-revenue-5-things-to-know (accessed 2026-05-08).

[^146]: Becker's Dental Review, *Smile Doctors Acquires 70-Location OSO: 5 Things to Know*, March 20, 2025. https://beckersdental.com/dso-dpms/smile-doctors-acquires-70-location-oso-5-things-to-know (accessed 2026-05-08).

[^147]: MergerLinks, *Smile Doctors Completed the Acquisition of myOrthos from SV Health Investors*, March 20, 2025. https://app.mergerlinks.com/transactions/2025-03-20-myorthos/dealmakers (accessed 2026-05-08).

[^148]: LevinPro Healthcare M&A, *Smile Doctors Acquires 6 Dental Practices*, April 24, 2025. https://healthcare.levinassociates.com/2025/04/24/smile-doctors-acquires-6-dental-practices/ (accessed 2026-05-08).

[^149]: PitchBook, *Smile Brands 2026 Company Profile: Valuation, Funding & Investors*, January 2025. https://pitchbook.com/profiles/company/10645-48 (accessed 2026-05-08).

[^150]: Dentalcorp, *Q3 2024 Results — VideaHealth Strategic Partnership Announcement*, November 2024. https://investors.dentalcorp.ca/financials/financial-reports/default.aspx (accessed 2026-05-08).

[^153]: Parsers VC, *Overjet — Funding, Valuation, Investors, News*, 2026. https://parsers.vc/startup/overjet.ai/ (accessed 2026-05-08).

[^154]: BizBuySell, *Dental Practice Business Valuation Multiples & Financial Benchmarks Report*, 2026. https://www.bizbuysell.com/learning-center/valuation-benchmarks/dental-practice/ (accessed 2026-05-08).

[^155]: SovDoc, *A Private Equity Approach to Valuing Your Dental Practice*, June 24, 2025. https://sovdoc.com/guides/how-to-value-dental-practice/ (accessed 2026-05-08).

[^156]: Henry Schein Dental Practice Transitions, *America's #1 Dental Broker*, 2026. https://dentalpracticetransitions.henryschein.com/ (accessed 2026-05-08).

[^157]: Henry Schein Dental Practice Transitions, *Dental Practice Valuation 2025: Tech-Driven Playbook*, September 29, 2025. https://dentalpracticetransitions.henryschein.com/valuing-your-practice-in-2025-a-tech-driven-playbook/ (accessed 2026-05-08).

[^158]: FOCUS Investment Banking, *Dental Practice EBITDA Multiples 2026*, April 27, 2026. https://focusbankers.com/dental-practice-ebitda-2026/ (accessed 2026-05-08).

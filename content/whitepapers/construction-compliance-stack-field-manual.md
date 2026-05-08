---
title: The Construction Compliance Stack Field Manual
subtitle: >-
  GC + subcontractor compliance: prequalification, change-order, OSHA,
  lien-rights, AIA documents — the operating playbook for builders shipping
  AI-native construction tools
publication: perea.ai Research
authors:
  - Dante Perea
version: '1.0'
status: Public draft
date: 2026-05
audience: >-
  Founders building AI-native construction-compliance products; AI engineering
  teams designing AIA-document/OSHA/lien-rights-aware LLMs; investors evaluating
  construction tech; GC + subcontractor operators comparing software stacks;
  risk + safety + finance leaders at $5M-$500M revenue construction firms
length: '~6,000 words'
profile: field-manual
license: CC BY 4.0
description: >-
  Operator-grade field manual for the construction compliance software category.
  Maps the $2.19T US construction-spending market (Census Jan 2026 SAAR) and the
  regulatory + workflow stack inside it: AIA Contract Documents (A201-2017 +
  G702/G703 + G701-2017 + G732-2019 CMa + G742-2024 Design-Build + G901-G903
  waivers), OSHA 29 CFR 1926 (Subpart M Fall Protection + Subpart L Scaffolds +
  Subpart P Excavations + Subpart R Steel Erection), CSLB California licensing
  (44 specialty C-class + Class A/B/B-2 + $25K bond + asbestos open-book exam
  under BPC §7058.5 + Cal/OSHA Class I-IV asbestos abatement + DOSH registration
  + SB 1455 universal workers' comp Jan 1, 2028), Davis-Bacon Act prevailing
  wage (40 USC 3142 + $2,000 federal contract threshold + IIJA §41101 + 29 CFR
  5.5 contract clauses + LCPtracker + WH-1321 poster), 50-state mechanics' lien
  rights (CA 20-day preliminary + 90-day filing; Texas 15th day 2nd/3rd month;
  Florida 45-day Notice to Owner strict-compliance), and vendor prequalification
  (ISNetworld 90K+ subscribers + 900 Hiring Clients + RAVS reviews; Avetta 125K
  contractors + 450+ hiring clients; Veriforce). Profiles incumbent SaaS
  (Procore $1.15B FY24 revenue + $1,285-1,290M FY25 outlook; Buildertrend 1M+
  users + Bain Capital + 4x EBITDA projected by 2026; Autodesk Construction
  Cloud now part of Forma + Autodesk Assistant 15+ AI capabilities) and
  AI-native entrants (Trunk Tools $70M total + Suffolk/Gilbane/DPR; Buildots
  $166M total + 230+ employees + 360° hardhat cameras; Document Crunch $37.1M
  total + Construction-specific LLMs OpenAI+Anthropic; OpenSpace $200.4M total +
  95K+ projects + acquired Disperse.io; Higharc $78.7M total + 40K homes
  annually = $19B home sales).
---

## Foreword

This is a field-manual companion to the May 2026 perea.ai Research audit *State of Vertical Agents 2027: Field-Service Trades*.

Where that paper diagnosed the trades-services vertical broadly, this paper goes operational on the construction-compliance software wedge. The scope:

- **Who buys it.** General contractors and subcontractors operating in the $2.19 trillion US construction-spending economy[^1][^4].

- **What regulatory artifacts they must produce (payment + safety).** AIA G702/G703 progress payment certifications[^19][^21][^22], OSHA 300/300A/301 incident reports[^48][^50], and Davis-Bacon weekly certified payrolls[^51][^53].

- **What regulatory artifacts they must produce (licensing + lien).** State contractor license maintenance[^39][^41] and mechanics' lien preliminary notices and filings[^57][^58][^59].

- **Where the AI-native disruption is concentrating.** Document review, site monitoring, scheduling, safety, and prequalification — and which of the seven established vendor archetypes maps to which kind of founder ambition.

Three structural facts make this category an attractive AI-vertical wedge in 2026. First, **the underlying market is the largest of any vertical the perea canon has surveyed**. US Census Construction Spending reached a seasonally adjusted annual rate of $2,190.4 billion in January 2026[^1] — more than 7% of US GDP and roughly four times the size of the home-services aggregator market that ServiceTitan anchors[^4]. Second, **the regulatory perimeter is dense, multi-layered, and structurally favorable to AI-native vendors**. AIA contract documents, OSHA 29 CFR Part 1926 standards[^49], state contractor licensing regimes (California CSLB at ~285,000 licensees alone[^44]), Davis-Bacon prevailing wage compliance for the $1.2 trillion+ IIJA-funded project pipeline[^51][^52], and 50-state mechanics' lien rights[^57][^60] all generate document corpora that LLMs trained on construction text can navigate at 10-100x the speed of human review.

Third, **the public-comp validation is mature**. Procore Technologies (NYSE: PCOR) reached $1,151.7 million in FY24 revenue at 21% YoY growth and $128 million free cash flow[^7][^9]; Autodesk has consolidated its construction software into Forma with the Autodesk Assistant out of beta as of March 2026[^69]. The category is no longer a "will it work" question — it's a "where do new entrants fit" question.

This paper is the practitioner-grade field manual for that question.

## The $2.19 Trillion Construction Market

The US Census Bureau's Value of Construction Put in Place Survey is the only authoritative federal sizing of the US construction market. The January 2026 release placed total construction spending at a seasonally adjusted annual rate of **$2,190.4 billion**[^1][^4][^5], composed of $1,661.2 billion in private construction (residential $933.0 billion[^5][^5] + nonresidential $728.2 billion[^5][^5]) and $529.2 billion[^1][^1] in public construction (educational $114.1 billion + highway $148.5 billion + other public infrastructure)[^1][^4]. The 2024 baseline reached $2,176.6 billion in December[^4], meaning year-over-year construction spending growth was approximately 1% nominal in early 2026 against an inflationary backdrop that had compressed real growth.

The macroeconomic backdrop matters because construction software is sold against expected project pipeline rather than current spending. The Infrastructure Investment and Jobs Act (IIJA), signed by President Biden on November 15, 2021, will continue flowing federal construction funds through 2028 — and the vast majority of IIJA-funded construction is subject to Davis-Bacon prevailing wage requirements[^51][^52][^53], which means the IIJA pipeline directly drives demand for compliance software. The DOE Loan Programs Office's free LCPtracker certified-payroll software[^51][^56] and the WH-1321 Davis-Bacon Worker Rights poster requirement[^53] are the two most-cited compliance artifacts that AI-native vendors are racing to automate.

**Procore Technologies (NYSE: PCOR)** is the public-comp anchor for the construction software category. The company reached $1,151.7 million[^7][^7] in FY24 revenue (+21% year-over-year, against $950.0 million in 2023 and $720.2 million in 2022)[^7][^8][^9][^11], with GAAP gross margin 82% / non-GAAP gross margin 86%, GAAP operating margin -12%[^7] / non-GAAP +10%, $196 million operating cash inflow, and $128 million free cash flow[^7][^9]. Procore's FY25 outlook of $1,285-1,290 million in revenue (+12% growth)[^9] establishes the public-market trajectory that every Series B+ construction-AI startup is being priced against. The company's January 2025 launch of the Helix Intelligence Layer with purpose-built AI agents (RFI Creation Agent + Daily Log Agent + Procore Assist conversational chatbot)[^32] is the canonical example of a public incumbent absorbing AI-native capabilities into its core product.

**Buildertrend** anchors the residential-builder benchmark. Bain Capital Tech Opportunities and HGGC made a December 2020 investment in the company[^14][^15], and as of early 2026 Buildertrend had reached approximately $100 million in annual recurring revenue with 610 employees, nearly 1 million[^15][^15] users across 100+ countries, 45%[^13] average year-over-year revenue growth since 2015, and projections from Bain analysis of 4x EBITDA growth by 2026 with ARR more than doubling[^13][^15][^17]. Buildertrend's CoConstruct acquisition (Feb 2021) and CBUSA acquisition extended the platform into materials and purchasing adjacencies[^13][^17][^18]. The Buildertrend playbook — start with workflow software for small homebuilders, expand into payments/data analytics/contractor services — is the canonical residential-builder scaling motion.

**Higharc**, the homebuilding cloud platform, anchors the AI-native vertical-builder benchmark. The company raised $78.7 million[^63][^63] total since 2018 — including a $53 million[^63][^63] Series B[^63] in February 2024 led by Spark Capital and Pillar VC, with strategic investors including SE Ventures (Schneider Electric), Home Depot, Fifth Wall, Ferguson, Suffolk Technologies, Starwood Capital, Standard Investments, Simpson Strong-Tie, and Carl Bass (former Autodesk CEO)[^63][^64][^65][^66]. Higharc's customers build over 40,000 homes annually representing $19 billion in new home sales volume[^63][^66], and the company's generative-AI-driven design technology has eliminated 90 days from the design cycle for new communities (a 75% reduction) while decreasing soft cycle time by 33%[^63][^66]. Higharc's Fast Company Most Innovative 2026 recognition[^64] anchors the proposition that vertical-AI-cloud beats horizontal SaaS for the construction industry's pen-and-paper baseline.

## The AIA Document Stack

The American Institute of Architects (AIA) Contract Documents are the single most important compliance artifact category in US construction. Approximately 95%[^20] of US design-bid-build construction contracts reference AIA Document A201, General Conditions of the Contract for Construction[^20][^22], which establishes the rights, responsibilities, and relationships of the owner, contractor, and architect. The current version (A201-2017) is the umbrella document that all other AIA contract documents reference[^20].

The progress-payment workflow is canonically governed by **AIA Document G702-1992, Application and Certificate for Payment**[^19][^21], which the contractor uses to apply for payment, and **AIA Document G703-1992, Continuation Sheet**[^19][^21], which breaks the contract sum into portions of work in accordance with a schedule of values prepared by the contractor. The flow: contractor signs and notarizes G702/G703 → architect reviews and certifies → owner pays based on architect's certification[^19][^24]. The architect may certify a different amount than that applied for, pursuant to Sections 9.5 and 9.6 of A201[^19], which means G702/G703 review is a quasi-regulatory artifact embedded in the contract — not a law, but a de-facto enforcement mechanism for owner-contractor payment disputes.

The G-Series family is broader than just G702/G703. AIA maintains the following progress-payment variants[^22][^23]: G702CW-2021 / G703CW-2021 (cost-plus projects without a Guaranteed Maximum Price); G702GMP-2021 (cost-plus with GMP); G702S-2017 / G703S-2017 (subcontractor-to-contractor variation); G732-2019 (Construction Manager as Adviser CMa edition); G742-2024 (Design-Build edition); G901-2022 / G902-2022 / G903-2022 (conditional/unconditional waiver and release on progress/final payment); G701-2017 (canonical Change Order). Together these forms encode the complete progress-payment-and-change-order workflow that any AI-native compliance vendor must support.

**Document Crunch** is the canonical AI-native document/contract entrant. Founded 2019 in Atlanta GA, the company has raised $37.1 million[^29][^29] total funding across four rounds — Seed $4.6 million[^29][^29] (April 2022, Zacua Ventures lead), Seed $2 million[^29][^29] (October 2022, Ironspring Ventures lead), Series A[^29] $9 million[^29][^29] (February 2024, Navitas Capital lead), and Series B[^29] $21.5 million[^29][^29] (October 9, 2024, Titanium Ventures lead with Nemetschek + Andres Construction + Satterfield & Pontikes + Fifth Wall + Navitas + Zacua + Ironspring participating)[^29][^30]. Document Crunch employs 91 people across 6 countries with $2.7 million ARR, and the company's defining technical bet is building **Construction-specific LLMs using OpenAI and Anthropic foundation models**[^29][^30]. The construction industry loses an estimated $11 billion+ annually to contract risks[^30], and Document Crunch's positioning is to be the "construction Lexis" for contract review — competing with general-purpose contract-review tools (LawGeex, ThoughtRiver) by going construction-deep.

**Trunk Tools** is the canonical AI-native document/agent entrant from the autonomous-workflows side. Founded 2021 in NYC by Dr. Sarah Buchner, the company has raised $70 million[^25][^25] total — including a $40 million[^25][^25] Series B[^25] in July 2025 led by Insight Partners with Redpoint Ventures, Innovation Endeavors, Stepstone, Liberty Mutual Strategic Ventures, and Prudence participating, and a $20 million Series A in 2024[^25][^26]. Customers include Suffolk Construction, Gilbane, and DPR Construction[^26], and the company has scaled revenue 5x in 6 months[^25] on a 60-person team. Trunk Tools' positioning is "fully autonomous agents that handle entire workflows that once required human input"[^25] — a more-aggressive product positioning than Document Crunch's analyst-augmentation framing.

## The Vendor Landscape: Five Archetypes

The active construction-compliance software vendor cohort sorts into five archetypes by GTM motion and integration depth.

**Archetype 1: Public-comp incumbents.** Procore Technologies ($1.15B FY24 revenue, $7B+ market cap)[^7][^9], Autodesk Construction Cloud now part of Autodesk Forma with Autodesk Assistant out of beta as of March 2026[^67][^69], Buildertrend ($100M ARR, 1M+ users)[^17], Trimble + Tekla Structures, CMiC, Sage 300 Construction & Real Estate, Foundation Software, ComputerEase, eCMS, Acumatica Construction Edition. This is the SaaS infrastructure layer that AI-native entrants either integrate with or compete against. The strategic risk for new entrants is that incumbents are absorbing AI capabilities at speed — Autodesk Forma now embeds 15+ AI-powered capabilities[^69] and Procore's Helix Intelligence Layer ships purpose-built RFI/Daily Log/Assistant agents[^32].

**Archetype 2: AI-native site-monitoring.** OpenSpace ($200.4M[^31][^31] total funding, founded 2017 SF, 219 employees, $15M ARR, 95,000+ projects deployed, recently acquired Disperse.io)[^31]; Buildots ($166M total funding, founded 2018 by Roy Danon + Aviv Leibovici + Yakir Sudry — IDF graduates — Chicago HQ, 230+ employees, $45M Series D May 2025 led by Qumra Capital)[^27][^28]; Doxel (autonomous robots and drones with lidar to track as-built conditions against models and schedules)[^32]. This is the visual intelligence layer — 360° hardhat-mounted cameras + computer-vision progress tracking + predictive delay analysis. Buildots cited a $1.3 trillion US construction TAM in its Series C announcement[^28], and 2021 venture investment in construction startups reached a record $4.5 billion (3x the 2020 figure)[^28].

**Archetype 3: AI-native document/contract.** Document Crunch ($37.1M total)[^29] and Trunk Tools ($70M total)[^25][^26], both covered in detail above. This is the document intelligence layer where Construction-specific LLMs build moats against general-purpose contract review.

**Archetype 4: AI-native estimation/scheduling/safety.** Togal.AI for cost estimation (5x faster than baseline + 98% accuracy)[^32]; ALICE Technologies for AI scheduling (17% project duration reduction)[^32]; Smartvid.io / Newmetrix for AI safety (20-75% incident reduction)[^32]. This is the workflow optimization layer — narrow-AI tools that target a single high-leverage workflow rather than building horizontal platforms.

**Archetype 5: Vertical homebuilding cloud.** Higharc ($78.7M total)[^63][^64][^65][^66] is the canonical entrant. Customers build 40,000 homes annually = $19 billion in new home sales[^63][^66], with 90 days eliminated from the design cycle (75% reduction). The strategic bet is that homebuilding is structurally different enough from commercial construction to warrant its own vertical-AI-cloud, with generative design and integrated BOM/estimating/sales/build workflows in one platform. Higharc's 18+ strategic investor cohort (Schneider Electric SE Ventures, Home Depot, Fifth Wall, Ferguson, Suffolk Technologies, Starwood Capital, Carl Bass former Autodesk CEO)[^63][^64] signals that the homebuilding tech adjacencies (materials supply, building products manufacturing, distribution) view this archetype as a durable category.

The capital efficiency leaderboard is instructive. Procore at $1.15B FY revenue against ~$7B market cap is the public-market valuation anchor. Higharc at 40,000 homes annually on $78.7M total raised is the most-capital-efficient vertical-AI cloud entrant. OpenSpace at 95,000 projects deployed on $200.4M total raised is the most-capital-efficient site-monitoring entrant. Trunk Tools at 5x revenue growth in 6 months on $70M total raised is the most-capital-efficient document/agent entrant. The gap between the incumbent SaaS layer (where deals are won by integration depth and customer base size) and the AI-native disruptor layer (where deals are won by category-leading model performance and per-workflow ROI) is the wedge for new founders.

## The Vendor Prequalification Triopoly

Three platforms dominate the construction vendor prequalification market: ISNetworld, Avetta, and Veriforce. Together they manage compliance documentation for over 290,000 contractors and suppliers serving more than 2,000 Hiring Clients across oil & gas, construction, manufacturing, utilities, retail, and facilities management[^33][^36][^38].

**ISNetworld** (founded 2001, Dallas TX)[^38] is the largest by Hiring Client count, with 90,000+ contractor and supplier subscribers, 680+ Hiring Clients, and 75,000+ active contractors as of 2025[^34][^36][^37][^38]. ISN's core product is the RAVS (Review and Verification Services) program, where the ISN team reviews insurance certificates, written safety programs, and training documentation against regulatory and Hiring Client requirements[^34][^37]. ISN charges contractors approximately $875 per year for baseline subscriptions, with larger contractors paying $1,500 [^36]to $3,000+ for enterprise tiers and Hiring Clients paying separate enterprise fees[^36]. ISN's strongest verticals are oil & gas, chemicals, refining, mining, utilities, and heavy manufacturing[^36][^38] — markets with strict OSHA-VPP-style safety programs and high contractor-incident liability.

**Avetta** (founded 2004 as PICS Auditing)[^38] is the largest by contractor count, with 125,000 contractors and 450+ hiring clients[^38]. Avetta charges contractors $450-900 per year for basic subscriptions with higher tiers above $1,200 [^38]for safety analytics and training, and Hiring Clients pay separate enterprise subscriptions plus setup fees[^36]. Avetta's strongest verticals are commercial construction, retail, telecommunications, food and beverage, and property management[^33][^36][^38]. **Avetta One**, the company's upgraded platform, combines safety + sustainability + ESG + workforce + cybersecurity + financial health + supplier diversity into a single compliance system[^33] — a strategic positioning that anticipates the broader trend toward unified ESG/risk-management compliance.

**Veriforce** is the third major platform, with strongest penetration in oil & gas, construction, and pipeline sectors, often used by upstream and midstream operators[^33]. Veriforce focuses on aligning field practices with compliance documentation and conducts site audits based on Veriforce submissions[^33].

The structural insight for new founders: the prequalification triopoly is durable due to network effects on the Hiring-Client side. New entrants cannot displace ISN/Avetta/Veriforce for two-sided-marketplace economics reasons (contractors register where Hiring Clients require them; Hiring Clients adopt platforms with the most contractor coverage). The opportunity is *not* to build another prequalification platform — it's to build AI-native compliance-document automation that *feeds* the existing platforms. Document Crunch's positioning at $37.1M total funding pursues exactly this wedge[^29][^30], using Construction-specific LLMs to automate the generation, review, and submission of the safety programs, insurance certificates, OSHA logs, and training documentation that ISN/Avetta/Veriforce require.

## The Regulatory Perimeter: Six Layers

Six regulatory layers govern construction work in the US, and any AI-native compliance vendor must navigate each.

**Layer 1: State contractor licensing.** California's Contractors State License Board (CSLB) is the largest single state licensing authority, regulating approximately 285,000 licensed contractors across 44 specialty C-class classifications plus three general license types — Class A General Engineering (BPC §7056), Class B General Building (BPC §7057), and Class B-2 Residential Remodeling[^39][^41][^44]. Licensure requires passing the CSLB Law and Business exam plus a trade-specific exam, completing the asbestos open-book examination under BPC §7058.5, and filing a $25,000 contractor's bond[^39][^40][^42]. The bond was raised from $15,000 effective January 1, 2023[^44]. Workers' compensation insurance is mandatory regardless of employee count for high-risk classifications C-8 (Concrete), C-20 (HVAC), C-22 (Asbestos Abatement), C-39 (Roofing), and C-61/D-49 (Tree Service)[^40][^44]; California SB 1455 mandates universal workers' comp for all classifications by January 1, 2028[^44]. Texas, Florida, New York, and other states each maintain parallel-but-divergent licensing regimes.

**Layer 2: OSHA construction safety standards.** 29 CFR Part 1926 governs construction-industry safety, with five subparts most-cited by AI-native compliance vendors. Subpart K Electrical (§§1926.400-449); Subpart L Scaffolds (§§1926.450-454, including §1926.454 mandatory training requirements for both employees on scaffolds and employees erecting/dismantling them)[^46][^47]; Subpart M Fall Protection (§§1926.500-503, with §1926.501 establishing the 6-foot rule for excavations and §1926.503 mandating training requirements)[^45][^48][^50]; Subpart P Excavations (§§1926.650-652)[^49]; Subpart R Steel Erection (§§1926.750-761, including §1926.752 site layout and §1926.760 fall protection)[^49]. Personal Fall Arrest Systems (PFAS) under §1926.500 require an anchorage, connectors, and a full-body harness — and may include a shock-absorbing lanyard, retractable lifeline, or deceleration device[^50]. The AI-native opportunity here is real-time PFAS validation through computer vision, an extension of OpenSpace and Buildots' existing visual intelligence platforms.

**Layer 3: Asbestos abatement.** Cal/OSHA classifies asbestos abatement work into Class I-IV, and any work involving 100 square feet or more surface area of asbestos-containing construction material requires a contractor with asbestos certification or a C-22 Asbestos Abatement license, plus registration with the Asbestos Contractors' Registration Unit (ACRU) of Cal/OSHA's Division of Occupational Safety and Health (DOSH)[^42]. DOSH registration requires written asbestos removal operating policies, verification of equipment, training certification for all employees, health insurance coverage (or $500 trust account per employee), and workers' compensation insurance[^42]. The federal-level overlay is OSHA 29 CFR 1926.1101 Asbestos in Construction.

**Layer 4: Davis-Bacon Act prevailing wage.** 40 USC 3142 applies to contractors and subcontractors performing on federally funded or assisted contracts in excess of $2,000 [^54]for construction, alteration, or repair (including painting and decorating) of public buildings or public works[^54][^55]. Contractors must pay laborers and mechanics no less than the locally prevailing wages and fringe benefits for corresponding work in the area[^54][^55][^56], with weekly payment mandatory[^55][^56]. The IIJA (Bipartisan Infrastructure Law) §41101 extends Davis-Bacon to all IIJA-funded construction projects[^51][^52], which represents a $1.2 trillion+ project pipeline through 2028. The DOL Wage and Hour Division administers Davis-Bacon[^54], the contract clauses are codified at 29 CFR 5.5[^52][^53], and wage determinations are hosted at sam.gov[^52]. The DOE Loan Programs Office provides LCPtracker as free certified-payroll software for IIJA recipients[^51][^56], and the WH-1321 Davis-Bacon Worker Rights poster is required at all construction sites[^53]. For prime contracts in excess of $100,000, the Contract Work Hours and Safety Standards Act adds overtime requirements (1.5x regular rate for hours over 40 per workweek)[^54].

**Layer 5: 50-state mechanics' lien rights.** All 50 states maintain mechanics' lien laws, but the deadlines and notice requirements vary dramatically[^57][^58][^59][^60][^61]. **California** requires a 20-day preliminary notice from subcontractors and suppliers, a 90-day filing deadline after completion, and 90-day enforcement deadline after filing[^61][^62]. **Arizona** requires a 20-day preliminary notice with similar strict-loss-of-rights rules[^61][^62]. **Florida** is a strict-compliance state requiring a 45-day Notice to Owner served by certified mail, with specific statutory language required in the lien itself[^61][^62]. **Texas** has the most-complex notice regime: subcontractors and suppliers must send monthly notices by the 15th day of the 2nd month following each month work was performed and unpaid (residential) or by the 15th day of the 3rd month (non-residential)[^57][^58][^61]. **Hawaii** has the shortest filing deadline at 45 days after project completion[^59]. **New York** allows up to 8 months for most parties to file. **Massachusetts** requires enforcement within 90 days of filing[^59]. The AI-native opportunity here is automated 50-state lien-rights tracking — LienShield, Levelset, and Siteline already operate in this space, and Construction-specific LLMs are emerging as the next-generation alternative.

**Layer 6: AIA contract document compliance.** Architect-certified G702/G703 progress payments are a quasi-regulatory artifact embedded in roughly 95% of US design-bid-build contracts via the A201 General Conditions reference[^20][^22]. The 23-document AIA G-Series taxonomy (covered above) governs the complete progress-payment-and-change-order workflow.

## Founder Velocity: Three Archetypes

Three founder archetypes are shipping at scale in the construction-compliance category, with identifiable patterns of capital efficiency, time-to-market, and defensibility.

**Archetype 1: The vertical-AI Series A[^25]/B founder.** Trunk Tools, founded by Dr. Sarah Buchner in NYC in 2021, raised $70 million[^25][^25] total via $20 million[^25][^25] Series A[^25] in 2024 and $40 million[^25][^25] Series B[^25] in July 2025 led by Insight Partners with Redpoint Ventures, Innovation Endeavors, Stepstone, Liberty Mutual Strategic Ventures, and Prudence participating[^25][^26]. Customers include Suffolk Construction, Gilbane, and DPR Construction[^26]. The company has scaled revenue 5x over six months on a 60-person team[^25], with autonomous AI agents that handle entire workflows including scheduling and project tracking. The defensibility narrative is "construction-industry-specific data + autonomous agents = workflow lock-in," and the capital trajectory ($70M[^25][^25] total → 5x revenue growth in 6 months) suggests Series C[^25] in 2026-2027.

Document Crunch follows the same archetype with a different end-product. Founded 2019 in Atlanta GA, the company raised $37.1 million[^29][^29] total via $4.6 million[^29][^29] Seed (April 2022, Zacua Ventures lead) + $2 million[^29][^29] Seed (October 2022, Ironspring Ventures lead) + $9 million[^29][^29] Series A[^29] (February 2024, Navitas Capital lead) + $21.5 million[^29][^29] Series B (October 9, 2024, Titanium Ventures lead with Nemetschek strategic investor)[^29][^30]. The defensibility narrative is **Construction-specific LLMs using OpenAI and Anthropic foundation models**[^30] — a vertical-AI moat against general-purpose contract-review tools.

**Archetype 2: The data-flywheel Series C[^31]/D founder.** OpenSpace, founded 2017 in San Francisco, raised $200.4 million[^31][^31] total across eight funding rounds — including $14 million[^31][^31] Series A[^31] in August 2019 (Lux Capital lead), $16 million[^31][^31] Series B[^31] in July 2020 (Menlo Ventures lead), and $9 million Series D extension in August 2022 (Taronga Ventures + GreenPoint Partners lead)[^31]. The company employs 219 people across 20 countries with $15 million ARR, has deployed across 95,000+ projects, and recently acquired Disperse.io to consolidate the visual intelligence platform[^31]. The defensibility narrative is "the largest as-built dataset in construction" — a data flywheel that gets stronger as more sites are scanned and more projects are tracked.

Buildots follows the same archetype with a different geographic and capital base. Founded 2018 in Israel by Roy Danon, Aviv Leibovici, and Yakir Sudry (IDF graduates), the company raised $166 million[^27][^27] total — including a $60 million[^27][^27] Series C[^27] ($106 million[^27][^27] prior to Series D[^27]) and a $45 million[^27][^27] Series D[^27] in May 2025 led by Qumra Capital with O.G. Tech (Eyal Ofer), TLV Partners, Lightspeed Venture Partners, Future Energy Ventures, and Maor Investments participating[^27][^28]. The Buildots platform processes images from 360-degree cameras mounted on construction managers' hardhats, comparing site features against BIM data and forecasting potential delay risks[^27][^28]. Buildots' 230+ employees compete with Avvir, Doxel, Disperse, and Versatile in the visual intelligence space[^27][^28].

**Archetype 3: The vertical-cloud-platform founder.** Higharc, founded by Marc Minor and Michael Bergin in Durham NC in 2018, raised $78.7 million[^63][^63] total via Series A[^63] $21 million[^63][^63] April 2021 (Spark Capital lead) and Series B[^63] $53 million[^63][^63] February 2024 (Spark Capital + Pillar VC co-lead with SE Ventures, Home Depot, Fifth Wall, Ferguson, Suffolk Technologies, Starwood Capital, Standard Investments, Simpson Strong-Tie, Mulhern+Kulp Engineering, RXR Realty, PSP Growth, Metaprop, SC Masterfund, Carl Bass former Autodesk CEO, plus existing Javelin Venture Partners + Lux Capital + Vertex Ventures)[^63][^64][^65][^66]. The 70+ employee remote-first company serves customers who build over 40,000 homes annually representing $19 billion in new home sales volume[^63][^64][^66]. The defensibility narrative is "the connected homebuilding cloud" — generative-design + sales + estimating + construction documents + ERP-integrated procurement in a single workflow that replaces the 40-year-old pen-and-paper baseline.

The single most-instructive lesson across all three archetypes is **Higharc's strategic-investor cohort**. Schneider Electric (electrical infrastructure), Home Depot (building products distribution), Ferguson (plumbing distribution), Suffolk Technologies (general contractor venture arm), Starwood Capital (real estate), and Simpson Strong-Tie (structural products) collectively signal that the homebuilding tech adjacencies view AI-native vertical-cloud as a strategic category — not just a software bet. Founders entering this space should evaluate strategic investor partnerships as a core part of fundraising strategy, not an afterthought.

## Distribution: Where the GCs and Subcontractors Live

Five MLP communities cover the practical distribution surface area for construction-compliance founders.

**1. AGC + ABC + NAHB conferences and chapter networks.** The Associated General Contractors of America (AGC) annual conference and chapter networks reach the largest concentration of GC operators. Associated Builders and Contractors (ABC) covers the merit-shop construction segment. National Association of Home Builders (NAHB) reaches the residential-builder cohort. Chapter executives at all three associations have outsized influence on which vendors their membership cohorts adopt — a parallel to the supervisor-as-channel motion in the therapist AI scribe vertical.

**2. Procore App Marketplace + Autodesk App Store.** Procore's App Marketplace and Autodesk's Forma App Store are the closed-system distribution channels where third-party tools that integrate with the platforms reach the platforms' customer bases. Autodesk Construction Cloud now hosts 400+ pre-built integrations[^67], and the Datagrid for Autodesk Construction Cloud demonstration shows the integration-depth bar for AI agents that pull data from TakeOff, Build, Cost Management, BuildingConnected, and PlanGrid[^68]. The Procore marketplace plays the same role.

**3. Engineering News-Record (ENR) + ENR FutureTech + Built Worlds + AEC Hackathon + BIMForum + Construction Innovation Forum.** ENR's Top 400 General Contractors list is the canonical practitioner audience for vertical trade press, and ENR FutureTech + Built Worlds + AEC Hackathon + BIMForum + Construction Innovation Forum collectively reach the technology-adopter cohort within the Top 400. Document Crunch's BuiltWorlds AI/ML Conference sponsorship in February 2026[^29] is the canonical example of using this channel.

**4. The owner-as-channel motion.** Large GC operators with their own venture arms — Suffolk Technologies (which invested in Higharc[^63]), Webcor Builders Ventures, Skanska Innovation Ventures, DPR Ventures (where Trunk Tools' DPR customer relationship sits), Gilbane Ventures — both invest in and recommend AI-native vendors to their subcontractor base. This is the highest-ROI distribution channel for founders building AI-native tools that need GC validation.

**5. ABC chapter networks + ABC apprenticeship program + ABC Construction Innovation forum.** ABC's Construction Innovation forum and chapter networks reach the merit-shop cohort that often differs in vendor preferences from the union-shop cohort that AGC dominates. Founders selling into right-to-work states should weight ABC chapter relationships heavily.

## Predictions for 2027-2028

**1. AI-native site-monitoring consolidates to 3-4 dominant brands by 2028.** OpenSpace + Buildots + Doxel + Procore-Helix as the survivor cohort. Smaller entrants (Avvir, Versatile, BeamUp, Send Reality, EarthCam) face structural pricing pressure as the data-flywheel advantages of the leaders compound.

**2. Procore acquires at least one AI-native document/contract company by 2028** to integrate Construction-specific LLMs into the Helix Intelligence Layer. Document Crunch and Trunk Tools are the two most-likely targets; the strategic logic mirrors Autodesk's consolidation of Assemble + BuildingConnected + BIM 360 + PlanGrid into Autodesk Construction Cloud / Forma in 2019[^70].

**3. Higharc reaches $1 billion[^63][^63] valuation by 2028.** The path: continue scaling among the 40,000-home-annual customer cohort, expand into commercial/multi-family construction, and complete a Series C[^63] in 2026-2027 at $400[^63]-600M[^63] valuation followed by Series D[^63] or strategic acquisition by Home Depot / Ferguson / Schneider Electric at $1B+ in 2028. The strategic-investor cohort already in the cap table[^63][^64] makes the strategic-acquisition path structurally likely.

**4. Vendor-prequalification triopoly faces structural disruption from AI-native compliance-document automation by 2027.** ISN + Avetta + Veriforce remain dominant on the two-sided-marketplace side, but at least one new entrant (likely Document Crunch or a derivative) raises $50M+ Series B specifically for construction-compliance-document automation that *feeds* the prequalification platforms. The structural insight: prequalification platforms charge $450-3,000/sub/year for compliance-documentation submission and review; an AI-native automation layer that compresses that workflow from days to minutes captures the surplus.

**5. Davis-Bacon enforcement and IIJA-funded project compliance becomes the single largest near-term commercial opportunity.** The $1.2 trillion+ IIJA project pipeline through 2028[^51][^52] creates persistent demand for AI-native automation of WH-1321 poster compliance, weekly certified payroll generation, sam.gov wage-determination application, and 29 CFR 5.5 contract-clause auditing. Founders entering this space in 2026-2027 will face less competition than in commercial-construction-AI and have a clearer path to $50[^52]-100M[^52] ARR by 2030.

## Glossary

- **A201** — AIA Document A201-2017, General Conditions of the Contract for Construction. Umbrella document that all design-bid-build agreements reference.
- **ABC** — Associated Builders and Contractors. Merit-shop construction trade association.
- **ACC** — Autodesk Construction Cloud. Now part of Autodesk Forma.
- **AEC** — Architecture, Engineering, and Construction.
- **AGC** — Associated General Contractors of America.
- **AIA** — American Institute of Architects. Author of standard contract documents (A201, G702, G703, G701, etc.).
- **ANSI** — American National Standards Institute.
- **BABA** — Build America, Buy America Act. IIJA Title IX provisions on domestic-content requirements.
- **BIM** — Building Information Modeling. Digital representation of building's physical and functional characteristics.
- **BIM 360** — Autodesk's pre-Forma BIM platform; now part of Forma.
- **BIL** — Bipartisan Infrastructure Law. Common name for IIJA.
- **BLS** — Bureau of Labor Statistics. Source for occupational employment projections.
- **CILB** — Construction Industry Licensing Board (Florida DBPR).
- **CMa** — Construction Manager as Adviser. AIA G732-2019 covers CMa edition pay applications.
- **COI** — Certificate of Insurance.
- **CSLB** — Contractors State License Board (California). Regulates ~285,000 licensed contractors.
- **DBA** — Davis-Bacon Act. 40 USC 3142, federal prevailing-wage law.
- **DBPR** — Department of Business and Professional Regulation (Florida).
- **DOSH** — Division of Occupational Safety and Health (California Cal/OSHA).
- **EMR** — Experience Modification Rate. Workers' comp insurance rating.
- **ENR** — Engineering News-Record. Construction trade publication with Top 400 GC list.
- **ERP** — Enterprise Resource Planning.
- **G702/G703** — AIA Application and Certificate for Payment + Continuation Sheet.
- **GC** — General Contractor.
- **IIJA** — Infrastructure Investment and Jobs Act. Nov 15, 2021. $1.2T+ infrastructure pipeline.
- **NAHB** — National Association of Home Builders.
- **NLRB** — National Labor Relations Board.
- **OSHA** — Occupational Safety and Health Administration. 29 CFR Part 1926 = construction standards.
- **PFAS** — Personal Fall Arrest System (anchorage + connectors + full-body harness).
- **RAVS** — Review and Verification Services (ISN program).
- **RFI** — Request for Information.
- **SAM.gov** — System for Award Management. Hosts Davis-Bacon wage determinations.
- **SOC** — Standard Occupational Classification.
- **VPP** — Voluntary Protection Programs (OSHA).
- **WH-1321** — Davis-Bacon Worker Rights poster, required at all federally funded construction sites.

## Related Research

This paper closes threads opened by the *State of Vertical Agents 2027: Field-Service Trades*, *Local-Services Aggregator Layer*, and *Marketplace Seller Operations* audits (perea.ai Research, May 2026). It opens four derivation candidates for the next research-engine pass: (1) **The OSHA Compliance Stack Field Manual** — deeper coverage of 29 CFR 1926 Subparts K-R (electrical, scaffolds, fall protection, excavations, concrete, steel erection) plus EMR and OSHA Form 300/300A/301 reporting plus Cal/OSHA divergences; (2) **The IIJA-Funded Project Founder Field Manual** — Davis-Bacon prevailing wage automation, BABA Buy America domestic-content compliance, sam.gov wage determinations, LCPtracker certified-payroll workflows for the $1.2 trillion+ IIJA pipeline; (3) **The Mechanics' Lien Automation Playbook** — 50-state preliminary notice automation, state-by-state filing deadlines, LienShield + Levelset + Siteline competitive analysis, and Construction-specific LLM training data for lien-document generation; (4) **The AIA-Document AI Field Manual** — A201/G702/G703/G701/G732/G742/G901-G903 LLM training corpus, Construction-specific LLM benchmarks, and Document Crunch + Trunk Tools competitive landscape for the document-automation tier.

## References

[^1]: US Census Bureau, *Monthly Construction Spending, January 2026* (CB26-51, March 23, 2026). https://www.census.gov/construction/c30/current/index.html
[^2]: US Census Bureau, *Monthly Construction Spending — Release Schedule 2025-2026*. https://www.census.gov/construction/c30/release.html
[^3]: US Census Bureau, *Construction Spending Data*. https://www.census.gov/construction/c30/data/index.html
[^4]: US Census Bureau, *MONTHLY CONSTRUCTION SPENDING, MARCH 2026* (PDF release). https://www.census.gov/construction/c30/pdf/release.pdf
[^5]: US Census Bureau, *Construction Spending Home Page*. http://www.census.gov/constructionspending
[^6]: US Census Bureau, *Monthly Construction Spending, May 2025*. https://www.census.gov/construction/c30/pdf/pr202505.pdf
[^7]: Procore Technologies, *2024 Annual Report*. https://s21.q4cdn.com/306803720/files/doc_financials/2025/ar/Procore-2025-Annual-Report.pdf
[^8]: Procore Technologies, *Form 10-K Annual Report* (SEC filing). https://s21.q4cdn.com/306803720/files/doc_financials/2024/q4/c408d7da-d259-456e-b2ea-1210f8730eed.pdf
[^9]: Procore press, *Procore Announces Fourth Quarter and Full Year 2024 Financial Results* (Feb 13, 2025). https://procore.com/press/fourth-quarter-full-year-2024-financial-results
[^10]: Procore Technologies, *2023 Annual Report*. https://s21.q4cdn.com/306803720/files/doc_financials/2024/ar/2024-annual-report.pdf
[^11]: Last10K.com, *Procore Technologies, Inc. (PCOR) 10-K Annual Report February 2025*. https://last10k.com/sec-filings/pcor/0001628280-25-008121.htm
[^12]: Procore Investor Relations, *Annual Reports*. https://investors.procore.com/financials/annual-reports/default.aspx
[^13]: Bain Capital Tech Opportunities, *Buildertrend Portfolio Page*. https://www.baincapitaltechopportunities.com/portfolio/buildertrend
[^14]: Buildertrend press, *Buildertrend Secures Significant Investment* (December 24, 2020). https://buildertrend.com/press-releases/bain-capital-tech-opportunities/
[^15]: Bain Capital corporate, *Buildertrend Investment Led by Bain Capital Tech Opportunities*. https://www.baincapital.com/news/buildertrend-leader-construction-management-software-secures-significant-investment-led-bain
[^16]: Buildertrend corporate, *Construction Software for Business Owners*. https://www.buildertrend.com/owners/
[^17]: Buildertrend corporate. https://buildertrend.com/
[^18]: CB Insights, *Buildertrend — Products, Competitors, Financials*. https://www.cbinsights.com/company/buildertrend-solutions-inc
[^19]: AIA Contract Documents, *Instructions: G702-1992, Application and Certificate for Payment*. https://help.aiacontracts.com/hc/en-us/articles/1500009308242-Instructions-G702-1992-Application-and-Certificate-for-Payment
[^20]: AIA Contract Documents, *A201-2017 General Conditions of the Contract for Construction*. http://www.aiacontracts.com/documents/a201-2017
[^21]: AIA Contract Documents, *How To Complete AIA G702 & G703 Payment Application Forms*. https://learn.aiacontracts.com/articles/completing-g702-and-g703-forms/
[^22]: AIA Contract Documents, *List Of Current AIA Contract Documents (All Series)*. https://learn.aiacontracts.com/articles/6150803-list-of-all-current-aia-contract-documents/
[^23]: AIA Contract Documents, *FAQs: Application and Certificate for Payment forms*. https://help.aiacontracts.com/hc/en-us/articles/1500009294861-FAQs-Application-and-Certificate-for-Payment-forms-used-also-for-final-payment
[^24]: ConstructionBids.ai, *Construction Pay Applications: AIA G702/G703 Complete Guide [2026]* (February 14, 2026). https://constructionbids.ai/blog/construction-pay-application-guide
[^25]: Trunk Tools press, *Trunk Tools Closes $40M Series B to Lead Construction's AI Transformation* (July 24, 2025). https://trunktools.com/resources/news/trunk-tools-closes-40m-series-b-construction-ai-transformation/
[^26]: Business Insider / Robert Scammell, *Trunk Tools Raised $40M for Its Construction AI With This Pitch Deck* (July 24, 2025). https://www.businessinsider.com/trunk-tools-funding-construction-ai-series-b-pitch-deck-2025-7
[^27]: TechCrunch / Kyle Wiggers, *Buildots raises $45M to help companies track construction progress* (May 29, 2025). https://techcrunch.com/2025/05/29/buildots-raises-45m-to-help-companies-track-construction-progress/
[^28]: Yahoo Finance via TechCrunch, *AI-powered construction management platform Buildots lands $60M*. https://www.yahoo.com/news/ai-powered-construction-management-platform-130006057.html
[^29]: Document Crunch corporate. https://documentcrunch.com/
[^30]: SalesTools AI, *Document Crunch Raises $21.5 Million in Series B - October 9, 2024*. https://salestools.io/en/report/document-crunch-raises-21-5-million-series-b-october-2024
[^31]: OpenSpace corporate. https://openspace.ai/
[^32]: Dan Cumberland Labs, *Construction AI Tools: What Is Real, What Is Hype, What Is Next* (March 28, 2026). https://dancumberlandlabs.com/blog/construction-ai-tools/
[^33]: Industrial Compliance & Safety / Tarra Boggs, *Veriforce vs. Avetta vs. ISNetworld* (March 20, 2026). https://www.industrialcompliancesafety.com/safety-compliance/veriforce-vs-avetta-vs-isnetworld/
[^34]: ISNetworld corporate, *Simplifying the Qualification Process for Contractors and Suppliers*. https://www.isnetworld.com/contractors
[^35]: Industrial Compliance & Safety, *What Is Vendor Prequalification and Why Do Clients Require It?* (April 21, 2026). https://www.industrialcompliancesafety.com/compliance-for-contractors/what-is-vendor-prequalification-and-why-do-clients-require-it/
[^36]: ExpiryEdge, *Avetta vs ISNetworld 2026: Pricing & Alternatives* (May 4, 2026). https://expiryedge.com/articles/avetta-vs-isnetworld-comparison/
[^37]: ISNetworld, *Contractor Prequalification and Ongoing Monitoring*. https://www.isnetworld.com/en/contractor-prequalification-and-ongoing-monitoring
[^38]: Delta Wye Electric, *ISNetworld vs Avetta: Pricing, Features & ROI* (June 7, 2025). https://deltawye.com/isnetworld-vs-avetta/
[^39]: California Contractors State License Board, *Before Applying For Exam*. https://cslb.ca.gov/Contractors/Applicants/Contractors_License/Exam_Application/Before_Applying_For_License.aspx
[^40]: California Contractors State License Board, *Issuing My License* (April 30, 2024). https://cslb.ca.gov/contractors/applicants/contractors_license/exam_application/Issuing_My_License.aspx
[^41]: California Contractors State License Board, *Description of CSLB License Classifications* (Nov 18, 2024). https://www2.cslb.ca.gov/Resources/GuidesAndPublications/DescriptionOfClassifications.pdf
[^42]: California Contractors State License Board, *Asbestos Open Book Exam*. https://www.cslb.ca.gov/OnlineServices/WebApplication/InteractivePDFs/AbsOpenBookExam.aspx
[^43]: California Contractors State License Board, *Licensing Classifications*. https://www.cslb.ca.gov/about_us/library/licensing_classifications/
[^44]: Adapt Digital Solutions, *California Contractor License Requirements: Complete 2026 Guide* (April 8, 2026). https://adaptdigitalsolutions.com/articles/california-contractor-license-requirements/
[^45]: eCFR, *29 CFR Part 1926 Subpart M — Fall Protection*. https://www.ecfr.gov/current/title-29/part-1926/subpart-M
[^46]: eCFR, *29 CFR Part 1926 Subpart L — Scaffolds*. https://www.ecfr.gov/current/title-29/subtitle-B/chapter-XVII/part-1926/subpart-L?toc=1
[^47]: OSHA, *1926.454 Training requirements*. https://www.osha.gov/pls/oshaweb/owadisp.show_document?p_id=10755&p_table=STANDARDS
[^48]: OSHA, *1926 Subpart M — Fall Protection*. https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926subpartm
[^49]: eCFR, *29 CFR Part 1926 — Safety and Health Regulations for Construction*. https://www.ecfr.gov/current/title-29/chapter-I/part-1926
[^50]: OSHA, *OSHA Technical Manual (OTM) Section V Chapter 4 — Fall Protection*. https://www.osha.gov/otm/section-5-construction-operations/chapter-4
[^51]: DOE, *Davis-Bacon Act Requirements for Recipients of Infrastructure Investment and Jobs Act Funding*. https://www.energy.gov/infrastructure/davis-bacon-act
[^52]: DOL Wage and Hour Division, *Fact Sheet #66A: Bipartisan Infrastructure Law* (November 15, 2021). https://dol.gov/agencies/whd/fact-sheets/66a
[^53]: DOL, *Frequently Asked Questions: Protections for Workers in Construction under the Bipartisan Infrastructure Law*. https://dol.gov/agencies/whd/government-contracts/protections-for-workers-in-construction/frequently-asked-questions
[^54]: DOL, *Davis-Bacon and Related Acts*. https://www.dol.gov/agencies/whd/government-contracts/construction
[^55]: DOL, *The Davis-Bacon Act, as Amended* (40 USC 3142). https://dol.gov/agencies/whd/laws-and-regulations/laws/dbra
[^56]: DOE Loan Programs Office, *Ensuring Prevailing Wages: A Closer Look at the Davis-Bacon Act*. https://www.energy.gov/lpo/articles/ensuring-prevailing-wages-closer-look-davis-bacon-act
[^57]: Levelset / Olivia Huppman, *Deadlines For Construction Notices & Mechanics Liens in All 50 States*. https://www.levelset.com/blog/lien-and-notice-deadlines-in-all-50-states/
[^58]: SubShield, *Mechanics Lien Deadlines by State: Complete 2026 Guide* (January 1, 2026). https://trysubshield.com/blog/mechanics-lien-deadlines-by-state
[^59]: Siteline, *Mechanic's Lien Rights Requirements for All 50 States* (March 6, 2026). https://www.siteline.com/blog/mechanics-lien-rights-requirements-for-all-50-states
[^60]: Seyfarth Shaw LLP, *Seyfarth's 2025 50-State Lien Law Notice Requirements Guide* (May 21, 2025). https://www.seyfarth.com/news-insights/seyfarths-2025-50-state-lien-law-notice-requirements-guide.html
[^61]: Projul, *Construction Lien Laws: State-by-State Guide for Contractors (2025)* (April 25, 2025). https://projul.com/blog/construction-lien-laws-guide/
[^62]: LienShield, *Preliminary Notice Requirements by State* (March 5, 2026). https://lienshield.app/blog/preliminary-notice-requirements-by-state
[^63]: PR Newswire / Higharc, *Higharc Announces $53M Series B for its Connected Homebuilding Cloud* (February 15, 2024). https://www.prnewswire.com/news-releases/higharc-announces-53m-series-b-for-its-connected-homebuilding-cloud-302062557.html
[^64]: Higharc corporate, *Higharc announces $53M Series B*. https://www.higharc.com/newsroom/higharc-announces-53m-series-b-investment
[^65]: FinSMEs, *Higharc Raises $53M in Series B Funding* (February 15, 2024). https://www.finsmes.com/2024/02/higharc-raises-53m-in-series-b-funding.html
[^66]: HousingWire / John McManus, *What Higharc's New $53 Million Series B Round Will Power In 2024* (February 15, 2024). https://www.housingwire.com/articles/what-higharcs-new-53-million-series-b-round-will-power-in-2024/
[^67]: Autodesk, *Autodesk Construction Cloud: Construction Management Software*. https://construction.autodesk.com/
[^68]: Autodesk App Store, *Datagrid for Autodesk Construction Cloud*. https://apps.autodesk.com/BIM360/en/Detail/HelpDoc?appId=62477104485545753&appLang=en&os=Web
[^69]: Autodesk Blogs / Tomer Rosenthal, *Meet Autodesk Assistant: AI-native intelligence in Forma* (March 25, 2026). https://www.autodesk.com/blogs/construction/meet-autodesk-assistant-ai-native-intelligence-in-forma/
[^70]: Autodesk Investor Relations, *Autodesk Ushers in New Era of Connected Construction* (November 18, 2019). https://investors.autodesk.com/news-releases/news-release-details/autodesk-ushers-new-era-connected-construction-autodesk

---
title: The Multi-Location Property Operator Stack
subtitle: >-
  Field manual for the 50–5,000-door operator: software triopoly, AI insurgents,
  RealPage antitrust, rent-control patchwork
publication: perea.ai Research
authors:
  - Dante Perea
version: '1.0'
status: Public draft
date: 2026-05
audience: >-
  Multifamily and SFR property operators (50–5,000 doors), proptech founders,
  multifamily-focused VCs, real-estate compliance counsel, and regulators
  tracking the post-RealPage rent-pricing settlement.
length: '~6,000 words'
license: CC BY 4.0
description: >-
  A field manual for the multi-location property operator. Maps the 50M-unit US
  rental market, the AppFolio–Yardi–RealPage software triopoly, the AI
  insurgents (EliseAI, Snappt, Colleen, Knock), the RealPage antitrust
  settlement, and the 50-state rent-control + HOTMA + Fair Housing Act
  compliance perimeter — with founder archetypes, GTM patterns, and 2026–2030
  predictions.
profile: field-manual
---

# Foreword — Why a Field Manual for Multi-Location Operators Now

The United States has roughly fifty million rental units distributed across fifty million-something landlords, and almost none of the popular discussion about "property tech" maps onto how those units are actually owned and run.[^4] The headlines are dominated by the institutional cohort — Greystar managing more than a million apartments, Invitation Homes operating 85,970 single-family rentals, the NMHC Top 50 collectively controlling 11% of US apartment stock.[^33][^5][^34] The reality is the other 89%: the family office with 800 doors across three metros, the regional operator with 4,200 garden-style units in one MSA, the SFR fund running 1,500 homes through a third-party manager. These are operators too big to run on spreadsheets and too small to build a proprietary stack — and 2026 is the year their tooling decisions stopped being optional.

This manual is a working operator's view of the multi-location property stack as of May 2026.

It covers the software triopoly (AppFolio, Yardi, RealPage) that runs the back office; the AI-native insurgents (EliseAI, Snappt, Colleen, Knock) that have moved from pilot to production; the RealPage antitrust settlement that has rewritten the rules of algorithmic rent-pricing; the fifty-state patchwork of rent-control and just-cause statutes layered onto the federal Fair Housing Act and HOTMA; the smart-home hardware cohort that survived the 2021 SPAC class; and five founder archetypes that explain how capital, distribution, and outcomes connect in this market.[^21][^23][^27][^39][^66]

Sources are NMHC, the US Census Bureau Rental Housing Finance Survey, SEC filings from public operators and software vendors, DOJ pleadings, the Federal Register, and vendor pricing pages.[^33][^1][^9][^22][^21][^45]

# Executive Summary — Top-Line Facts + Verdict

The total addressable market is fifty million rental units, of which 46.4M[^4] are renter-occupied and 3.6M[^4] are vacant for rent — a Q1 2026 vacancy rate of 7.3% as published by the Census Bureau.[^4][^6] Twenty-eight million of those units are multifamily, sixteen million single-family rentals, and two million "other".[^3][^4]

AppFolio (NASDAQ: APPF) — the only large pure-play public property-management software vendor — closed FY24 at $794.2M[^9][^9] revenue, +28%[^9] year over year, and reported Q1 2026 revenue of $262.2M[^9][^9] (+20%[^9] YoY) with 9.5M[^9] units under management across 20,784 customers; FY26 guidance is $1.110-$1.125B.[^9][^12]

EliseAI is the multifamily AI category leader. It has raised $141.9M[^15][^15] to date, with a $75M[^15][^15] Series D[^15] in August 2024 led by Sapphire Ventures at a valuation in excess of $1B[^15][^15]; it serves roughly 70%[^15] of the NMHC Top 50 multifamily owners and reaches one in every twelve multifamily units in the United States.[^15][^17][^20]

RealPage — acquired by Thoma Bravo for $10.2B[^21][^21] in 2021 — controls more than 80%[^21] of the commercial revenue-management software market and settled the DOJ antitrust suit on November 24, 2025, agreeing that nonpublic data must be at least one year old before training pricing algorithms and that aligned pricing features cannot be offered to landlords; the Federal Register published the proposed final judgment on January 21, 2026.[^21][^23][^25]

Greystar is the largest property manager in the United States by every measure — 119,160 units owned, 1,014,091 managed, equivalent to 3.5%[^33] of the US apartment stock — and has been #1 manager for fifteen consecutive years.[^33][^35][^38] Snappt, the multifamily fraud-detection vendor, has raised $150M total, protects 2.2M[^38] units, has analyzed 13M[^51]+ documents at 99.8% accuracy, and operates with 18 of the top 25 NMHC property managers.[^51][^52] SmartRent (NYSE: SMRT) reports 911,244 units deployed at the close of Q1 2026 with a market cap near $260M[^52][^52] — down 86%[^39] from its 2021 SPAC peak — while Latch (NASDAQ: LTCH) went bankrupt and was distress-sold to Door.com.[^39][^42][^43]

The verdict: AI is no longer at the gate of the multi-location property operator — it is on the inside. The operator stack is consolidating around horizontal CRM/PMS plus vertical AI for fraud, pricing, and leasing. The five-year window between today and the next regulatory inflection (2030, when California AB 1482 sunsets) is when category leaders are made.[^27]

# Part I — The Property Operator Universe: 50M Rentals, Three Cohorts

The US housing stock as measured by the Census Bureau is 147.9M[^4] total units: 86.2M[^4] owner-occupied, 46.4M[^4] renter-occupied, 3.6M vacant for rent, and the balance held in seasonal or "other" status.[^4] Of the 50M rental units total, 28M are multifamily, 16M are single-family rentals, and 2M are mobile homes or "other".[^3] These ratios have been stable since the 2008 housing crisis but mask underlying churn: the most recent Rental Housing Finance Survey (RHFS) data published by the Census Bureau in February 2026 shows individual investors at 59.6%[^1] of one-unit rental properties — down from 70.9%[^1] in 2021 — with LLP/LP/LLC ownership rising to 20.6% (from 15.2% three years earlier).[^1][^8] REITs and real-estate corps remain a tiny share, under 2% of one-unit rentals.[^8]

The single-family rental REIT cohort is small, public, and well-capitalized. Invitation Homes (NYSE: INVH) reported 85,970 wholly-owned homes at the end of Q1 2026, 96.3%[^5] same-store occupancy, $2,474 [^5]average monthly rent, and $578.996M[^5][^5] in same-store core revenues for the quarter; American Homes 4 Rent (now AMH) holds 60,596 SFRs.[^5][^4] AMH is also the 39th largest homebuilder in the United States and delivered its 10,000th home in 2024 with a planned 1,800-2,000 BTR (build-to-rent) homes per year.[^4][^7] The multifamily REITs are larger: AvalonBay 86,990 units, Equity Residential 85,190, MAA 103,083 — each in the top six of the NMHC owners list.[^33]

The operator universe segments cleanly into four cohorts. Solo and small landlords (1–50 doors) sit at the long-tail end and are mostly served by Avail, TurboTenant, Innago, Stessa, RentRedi, or no software at all. Small operators (50–500 doors) are the historical AppFolio sweet spot. Mid-market operators (500–5,000 doors) are where Yardi Breeze and DoorLoop have grown. Institutional operators (5,000+) are dominated by Yardi Voyager, RealPage Onesite, Entrata, and MRI. Greystar straddles all of these — it owns 119,160 units, manages 1,014,091, and is the #1 manager, #1 owner, #1 developer, and #2 builder in the 2026 NMHC rankings.[^33][^35][^38]

The fragmentation thesis matters. As industry analyst Jay Parsons documented in April 2026, in 2015 there were eight US apartment owners with more than 100,000 units; in 2026 there are only three.[^38] Greystar's 119,160 owned units represent less than half a percent of US ownership; its 1,014,091 managed units represent 3.5%[^38] of total US apartment stock; its construction starts represent 2% of the market.[^38] The NMHC Top 50 owners collectively own 11% of US apartment stock; the Top 50 managers oversee 24%.[^34] Build-to-rent units were included in the NMHC rankings for the first time in 2026, reflecting the structural shift from build-to-sell to build-to-rent in single-family.[^34]

Vacancy is the operator's main revenue lever. Q1 2026 rental vacancy of 7.3%[^6] — the highest since 2014 — sits against a structural US housing shortage of one to four million units depending on which methodology one uses.[^6][^2] NCREIF reported Q2 2025 SFR market value among privately-held funds at $7.5B, +39% year over year from $5.4B in Q2 2024.[^7] Housing completions hit 1.627M units in 2024 (+12% YoY), with 1.019M single-family — well above the 2000-2024 average of 1.276M units per year.[^7]

The operator decision tree is therefore not "should we use software" but "which combination of horizontal PMS + vertical AI best fits our cohort and our regulatory perimeter". The answer in 2026 is materially different from the answer in 2022.

# Part II — The Software Triopoly: AppFolio + Yardi + RealPage (+ the Long Tail)

Three vendors dominate the back office of multi-location property operators. **Yardi** (private, founded 1984 in Santa Barbara, estimated revenue above $2B[^46][^46]) runs Voyager for enterprise and Breeze for SMB. Voyager pricing for 1,000–5,000 unit operators runs $50K[^46][^46]–$150K[^46][^46]/year; for 10,000+ unit operators it runs $200K[^46][^46]–$500K[^46][^46]+/year, with implementation fees that range from 40%[^46] to 80% of the first-year subscription, settling at $10–$30 per unit per year at scale.[^46] Breeze runs $1/unit/month for residential and $2/unit/month for Breeze Premier, with free implementation; Voyager itself starts around $1,200/month.[^47] Multi-year (3–5 year) commitments unlock 10–15% lower annual pricing.[^46] Yardi serves 5M+ units globally and is one of the few in the category whose private valuation, if listed, would command tens of billions.[^42]

**AppFolio** (NASDAQ: APPF) IPO'd in 2015 and is the largest pure-play public PMS vendor in the United States. FY24 revenue was $794.2M[^9][^9] (+28%[^9] YoY) with GAAP operating income of $135.6M (17.1% margin); it served 8.7M units across 20,784 customers at year-end 2024.[^9] Q1 2026 revenue was $262.2M (+20% YoY), GAAP operating income $50.7M (19.4% margin, +50%[^9] YoY), with 9.5M[^9] units now under management; FY26 guidance was raised to $1.110-$1.125B revenue with 26.0%–28.0% non-GAAP operating margin.[^12] AppFolio's product suite is tiered Core/Plus/Max, and it has shipped its own AI products: Smart Bid (AI-driven revenue management), Realm-X (its agentic AI assistant), and an embedded fraud detection tier.[^10][^12]

**RealPage** sits at the institutional end of the market and was acquired by Thoma Bravo for $10.2B in 2021.[^25] It controls more than 80% of the commercial revenue-management software market and runs Onesite (the PMS), YieldStar and AIRM (revenue management), LRO (rent optimization), Buildium (the SMB PMS subsidiary acquired in 2019), and Knock CRM (acquired September 2022).[^21][^25][^59] YieldStar and LRO both sunset at the end of 2024; AIRM continues to use the YieldStar codebase.[^21] We discuss the antitrust consequences in Part IV.

The long tail is busy. **Buildium**, the RealPage subsidiary, runs $62/month flat for SMB.[^47] **DoorLoop** prices its Starter tier at $69/month for the first 20 units, Pro at $149[^47]/month, and Premium at $209[^45]/month (annual billing), with free Premium ACH payments and tiered tenant screening at $25–$45.[^45] DoorLoop has been deployed in 100+ countries and manages tens of thousands of units.[^49] **Entrata** (private, Lehi UT, 5M+ units) starts at $500/month and integrates PMS + CRM + ResidentPay vertically.[^47] **Rent Manager** runs around $80/month and is strong in mid-market plus commercial mixed-use.[^47] **MRI Software** (private equity GI Partners) starts at $55/month and is commercial-heavy.[^47] **ResMan** sits in SMB-mid-market under the Inhabit IQ portfolio.[^48][^50]

A key signal in the GTM choice is pricing transparency. SMB-focused vendors (DoorLoop, Buildium, Rent Manager, MRI starter tier) publish per-month or per-unit pricing publicly. Enterprise-focused vendors (Yardi Voyager, Entrata, RealPage Onesite) require a sales conversation and quote per-unit at scale.[^48][^46] If we use AppFolio's FY26 outlook of $1.110-$1.125B revenue and 9.5M units as the public-comp benchmark, the implied per-unit ARR is approximately $117[^46]/year — roughly $9.75[^46]/unit/month. Yardi's enterprise per-unit pricing of $10[^46]–$30[^46]/unit/year for 10,000+ portfolios is materially below that, reflecting the bundled volume discount that defines the institutional segment.[^46]

# Part III — The AI-Native Insurgents: EliseAI, Snappt, Colleen, Knock

Four AI-native vendors illustrate the four shapes that vertical AI in property management is taking.

**EliseAI** is the horizontal AI front-of-house. Founded in 2017 in NYC and originally branded MeetElise, EliseAI raised a $75M[^15][^15] Series D[^15] in August 2024 led by Sapphire Ventures — with Point72, DivcoWest, Navitas Capital, Koch Real Estate, JLL Spark, and Golden Seeds participating — at a valuation above $1B; total funding to date is $141.9M.[^15][^17][^18][^20] EliseAI serves 70-75% of the NMHC Top 50 rental housing operators, 1 in every 12 multifamily units in the United States, and 350+ enterprise customers including Bozzuto, Equity Residential, AvalonBay, Invitation Homes, and Asset Living.[^15][^17][^19] Its product suite is LeasingAI (with EliseAI's published numbers showing 125%[^19]+ greater lease conversion and 90%[^19]+ of work automated), ResidentAI (40%[^19]+ greater engagement, 50%[^19]+ delinquency reduction, and a 15-day acceleration in renewal notices), the EliseCRM (offered free), and a true VoiceAI module — the only one of its kind in the multifamily space according to the company.[^18] ARR has risen more than 2.5× since the Series C; the company reports 150+ employees in NYC and an expansion into healthcare under HealthAI.[^17][^18] The Series C in June 2023 ($35M, Point72-led) closed when EliseAI served 200 customers and 1.5M units; the trajectory from there is one of the fastest in proptech history.[^16]

**Snappt** is the trust layer. Founded in 2017 in Los Angeles, Snappt raised a $100M[^51][^51] Series A[^51] in March 2022 led by Insight Partners, then a $50M[^51][^51] growth financing facility from Hercules Capital in August 2025 — with the Trigo (Verification of Rent) acquisition closing simultaneously.[^51][^52] Total raised is $150M.[^52] Snappt has analyzed more than 13M documents at 99.8% accuracy, protects 2.2M[^52]+ units, prevents an estimated $1.9B[^51][^51] in bad debt, and is trusted by 18 of the top 25 NMHC property managers and 8 of the top 10.[^51] Its applicant fraud detection engine identifies that 12.2% of all rental applicants commit some form of application fraud.[^51] The Snappt platform is now an "Applicant Trust Platform": Document Forensics + Income Verification (payroll APIs and PDF parsing) + Verification of Rent (the Trigo acquisition gives it 25× the credit-report coverage of the prior product) + Verification of Assets + identity verification powered by CLEAR's 4,600+ ID-type database with selfie match and liveness detection.[^53][^54][^55] Cushman & Wakefield deployed Snappt across its multifamily asset services business in September 2021.[^51]

**Colleen AI** illustrates the acqui-target archetype. Founded in 2020 in Daytona Beach, Colleen raised a $3.5M[^57][^57] Seed round in July 2023 led by Wilshire Lane Capital — a VC backed by Morgan Properties, the NMHC #3 owner — and was acquired by Entrata on June 20, 2024.[^57][^58] At the time of acquisition Colleen had 12 employees and approximately $5M in annual revenue, with a 2.5M[^58]+ unit pipeline and a stated 30%[^58]+ reduction in unpaid rent for its customers; the product saved property staff 80% of the time previously spent on collections.[^58] Colleen integrated with Yardi, RealPage, Entrata, RentManager, and ResMan before its acquisition.[^58] The eight-month window between Seed and acquisition is a clean illustration of the acqui-target playbook: build a wedge product, sell it to one of the incumbents.

**Knock CRM** illustrates the same pattern at a larger scale. Founded in Seattle, Knock raised $46.7M[^59][^59] total — including a $10M[^59][^59] Series A[^59] from Madrona in March 2019 and a $20M[^59][^59] round led by Fifth Wall in February 2021 — before being acquired by RealPage in September 2022 with 38 employees and approximately $3.6M ARR.[^59] **LeaseHawk**, the early conversational-AI player in multifamily, has rebranded as Fenix and continues to operate its ACE Virtual Leasing Assistant, integrated with both Yardi and RealPage stacks.[^56][^60]

The shape is now clear. EliseAI is the horizontal AI front-of-house — capturing leads, scheduling tours, triaging maintenance, and handling renewals across the entire resident lifecycle. Snappt is a vertical AI for fraud detection. Colleen was a vertical AI for collections (now part of Entrata). Knock was a traditional CRM (now part of RealPage). Future operators choosing a stack must decide whether they want a horizontal AI bundle from EliseAI/AppFolio Realm-X/Yardi RentCafe AI, or a best-of-breed vertical stack glued together with API plumbing.

# Part IV — The RealPage Antitrust Earthquake

The RealPage antitrust case is the single most consequential regulatory event in multifamily software since the 1995 Costa-Hawkins Act.[^32] The ProPublica expose in October 2022 documented that RealPage's YieldStar product allowed competing landlords to share competitively sensitive nonpublic pricing data, which the company's algorithm used to optimize rent recommendations across the portfolio.[^25] The DOJ Antitrust Division filed its complaint on August 23, 2024 (Civil Action No. 1:24-cv-00710), alleging Section 1 Sherman Act violations and documenting RealPage's 80%+ market share in commercial revenue management software.[^21][^24] The complaint was amended in January 2025 to add six landlord co-defendants: Blackstone, Greystar, Cortland (PE-owned), Camden Property Trust, Cushman & Wakefield, and Willow Bridge.[^25] Ten state attorneys general joined the suit: California, Colorado, Connecticut, Illinois, Massachusetts, Minnesota, North Carolina, Oregon, Tennessee, and Washington.[^23]

The settlement landed on November 24, 2025. RealPage agreed to two principal remedies: nonpublic competitively sensitive data must be at least one year old before being used to train pricing algorithms, and the company will stop offering features that align pricing between landlords.[^23][^22] No damages were awarded and RealPage admitted no wrongdoing.[^23] The Federal Register published the Proposed Final Judgment and Competitive Impact Statement on January 21, 2026.[^21][^22] Greystar separately settled a $50M class action with renters and a $7M deal with nine state AGs; Cortland was the subject of an FBI raid in 2024.[^23]

The state and city level has moved as well. California and New York governors signed laws restricting algorithmic rent-pricing software in October 2025; Philadelphia and Seattle passed municipal ordinances of their own.[^23] As background to the political pressure, more than thirty US public employee pension funds have invested over $6B[^23][^23] in Thoma Bravo Funds XIII and XIV — the funds that hold the RealPage equity — which made the settlement politically negotiable rather than a forced divestiture.[^25]

The operator implication is direct: revenue management software is now a regulated utility. Operators must vet vendor data inputs, audit pricing recommendations against the consent-decree terms, and maintain a documented record showing that any "market" pricing data feeding into rent decisions is at least one year old and is not being shared horizontally with other landlord users of the same vendor. This matters because the consent decree applies to RealPage but the precedent applies to anyone in the category — Yardi RentMaximizer, AppFolio Smart Bid, and any future entrants must structure their data inputs to the same standard or risk being the next defendant.[^21][^22]

The field-manual takeaway is therefore concrete. When evaluating any rent-pricing vendor in 2026 and after, three questions must be in the RFP: (1) What is the freshness threshold of the input data, and how is it certified? (2) Does the vendor offer features that align prices across landlord users, and if so, are those features still available in the post-settlement product? (3) What audit trail does the vendor provide for each rent recommendation that an operator can produce in litigation? Vendors that cannot answer these are unbuyable for any operator with a fiduciary responsibility to a public-employee pension fund LP.

# Part V — Rent Control + Just-Cause: CA AB 1482, OR SB 608, NY HSTPA, and HOTMA

The federal floor on rental compliance is the Fair Housing Act of 1968 (Title VIII of the Civil Rights Act). The FHA's Affirmatively Furthering Fair Housing (AFFH) obligation, codified at §808(d), requires HUD program participants — including any landlord accepting Section 8 Housing Choice Vouchers — to take meaningful actions to overcome historic patterns of segregation.[^66] Section 504 of the Rehabilitation Act of 1973 and Title II/III of the Americans with Disabilities Act add reasonable-accommodation obligations on top.[^66]

The state level adds three statutes that operators with California, Oregon, or New York exposure must internalize.

**California AB 1482**, the Tenant Protection Act of 2019, took effect January 1, 2020 and sunsets January 1, 2030.[^27][^32] It caps annual rent increases at the lower of 5% plus local CPI or 10%, requires just-cause eviction at 12 months of continuous tenancy, exempts buildings less than fifteen years old, and preserves vacancy decontrol upon a tenant's voluntary departure.[^27][^30][^32] Properties more than fifteen years old, with two or more units, and not owner-occupied must comply.[^30] No more than two rent increases are permitted in any 12-month period.[^30] In the City of Los Angeles, AB 1482 layers on top of the older Rent Stabilization Ordinance (RSO), which still binds buildings constructed before October 1, 1978.[^31] AB 1482 was the most significant California rental policy change since Costa-Hawkins.[^32]

**Oregon SB 608**, signed in 2019, was the first statewide rent stabilization law in the United States. It caps annual rent increases at 7% plus CPI, with a 10% absolute ceiling.[^28]

**New York HSTPA** (Housing Stability and Tenant Protection Act of 2019) strengthened protections in stabilized buildings, removed vacancy decontrol, and tightened Major Capital Improvement (MCI) and Individual Apartment Improvement (IAI) rules.[^28] The District of Columbia operates under the Rental Housing Act §42-3501, a separate framework outside the state-level set.[^28]

The federal program-side rules tightened in 2024. The Housing Opportunity Through Modernization Act of 2016 (HOTMA, Pub. L. 114-201) implemented its long-awaited Voucher Final Rule at 89 FR 38224, published May 7, 2024 and effective June 6, 2024.[^67][^69][^70] Compliance with the 24 CFR Part 982 amendments was staggered: the 90-day window (September 4, 2024) covered 24 CFR 982.301, 982.503, 982.625-641, and Part 985 SEMAP; the 180-day window (December 3, 2024) covered 24 CFR 982.505; the 1-year window (June 6, 2025) covered 983.57, 983.155(b), 983.251(e), and 983.262.[^67] The final rule allows exception payment standards up to 120% of fair market rent, formalizes a Homeownership Option (24 CFR 982.625-641), and creates a single housing assistance payment to family option for manufactured-home space rentals.[^71] Two specific provisions — the PHA-owned certification at 24 CFR 982.451(c) and the Project-Based Voucher HAP contract rider at 24 CFR 983.154(g) and 983.157 — were delayed indefinitely.[^70]

The Section 8 HCV program itself is governed by 24 CFR Part 982, which sets the structure for tenant-based vouchers and project-based vouchers (PBV), the rental assistance contract framework with owners, civil rights certification at the PHA level, the AFFH obligation as it applies to participating PHAs and owners, and state-and-local-law deference on source-of-income discrimination.[^68]

The field-manual takeaway: a fifty-state rent-control and just-cause patchwork, layered onto federal HOTMA + Fair Housing Act + ADA + Section 504 obligations, creates a compliance surface area that horizontal property-management software cannot natively handle. This is fertile ground for vertical AI compliance vendors — and it explains why fraud detection (Snappt), collections (Colleen, now Entrata), and leasing automation (EliseAI) have raised more capital between 2022 and 2026 than any prior generation of multifamily software.[^51][^58][^15]

# Part VI — Smart-Home Tech: SmartRent + the Latch Cautionary Tale

The 2021 SPAC class produced two public smart-home property tech companies, and 2026 has rendered judgment on both.

**SmartRent** (NYSE: SMRT, founded 2017 in Scottsdale AZ) reported Q1 2026 revenue of $38.7M[^39][^39] (-6%[^39] YoY), Core Revenue of $36.6M[^39][^39] (flat YoY), ARR of $60M (+9% YoY), and 911,244 Units Deployed at quarter-end (+10% YoY, +83,633 net).[^39][^40] New deployments in Q1 alone totaled 20,662 units (+14% YoY).[^40] Net loss improved by $35.8M to $4.4M.[^39] Inside the revenue mix, SaaS hit $15.2M (+9%), hardware $15.4M (-18%), and professional services $6.0M (+55%); Adjusted EBITDA was $0.4M (+106%).[^40] Customer concentration is institutional: 15 of the top 20 multifamily operators run on SmartRent.[^39] In 2025 the company posted $152.33M revenue (-12.9% YoY) and a $60.56M net loss; its market cap as of May 2026 sits at $257.63M.[^41] SmartRent acquired SightPlan, a resident-experience and maintenance-management platform, to add SaaS-only revenue lines and reduce its dependence on hardware margins.[^42][^44]

The market-cap collapse tells the rest of the story. SmartRent's market cap history: 2021 SPAC peak at $1.87B[^43][^43], 2022 $0.48B[^43][^43], 2023 $0.64B[^43][^43], 2024 $0.31B, 2025 $0.38B, and 2026 $0.26B — a -86% drawdown from the 2021 peak.[^43] Latch (NASDAQ: LTCH) — once the higher-profile of the two — reported a $300M[^43][^43]+ net loss on $60M[^43][^43] of revenue in its last full year as an independent public company, went bankrupt, and was distress-sold to Door.com in 2025.[^42] Across the same period, the SPAC structure that brought both companies public has been thoroughly discredited; Latch's competitor in access control, ButterflyMX (private), now reports more than 2M doors served.[^42]

The cautionary thesis is that hardware-heavy SPAC-era valuations were never going to clear. SmartRent's pivot toward SaaS revenue mix (the SightPlan acquisition adds resident experience and maintenance management as software-only ARR lines) is the only sustainable path; the stock market has already priced this in at a steep discount.[^42][^44]

The operator implication is concrete. Smart-home technology — keyless access, leak detection, parking management, package lockers, smart thermostats — is now table stakes at any property targeting a 4-star or higher class. But vendor longevity is questionable; favor SaaS-ARR business models with hardware-light footprints over hardware-heavy bundled solutions. ButterflyMX, Resident IQ, and SightPlan-as-part-of-SmartRent represent the survivor cohort. Latch is the cautionary tale.

# Part VII — The Founder's Path: Five Archetypes

Five archetypes describe how capital and outcomes connect in multifamily operator software in 2026.

**Archetype 1 — The Vertical AI Frontline.** EliseAI is the canonical example: founded 2017 in NYC, seven-year build to unicorn status, $141.9M[^15][^15] total raised across Seed → Series A[^15] → Series B[^15] → Series C[^15] ($35M[^15][^15], June 2023, Point72-led) → Series D ($75M, August 2024, Sapphire Ventures-led at $1B+).[^15][^16][^18] The product wedge is conversational AI for leasing, expanded into resident services and CRM with the LeasingAI / ResidentAI / VoiceAI / EliseCRM (free) bundle. The thesis is to give away the CRM to make the bundle the default; this is the reason EliseAI's ARR has risen >2.5× since the Series C.[^17]

**Archetype 2 — The Trust Layer.** Snappt is the canonical example: founded 2017 in LA, seven-year build, $150M[^51][^51] total raised across Series A[^51] ($100M[^51][^51], March 2022, Insight Partners-led) and a $50M growth financing facility from Hercules Capital in August 2025.[^51][^52] The wedge is fraud detection on rental applications; the expansion is to "Applicant Trust Platform" through document forensics, identity verification, income verification, and the Verification of Rent / Verification of Assets product lines from the Trigo acquisition.[^53] The thesis is that vertical AI for one specific operator pain point can scale into a horizontal trust platform if the underlying data set is large enough — Snappt has analyzed 13M+ documents at 99.8% accuracy.[^51]

**Archetype 3 — The Acqui-Target.** Colleen AI is the canonical example: founded 2020 in Daytona Beach, $3.5M[^57][^57] Seed in July 2023 led by Wilshire Lane Capital (Morgan Properties-backed VC), sold to Entrata in June 2024 — eight months after the Seed round.[^57][^58] At the time of acquisition: 12 employees, ~$5M ARR, 2.5M+ unit pipeline, 30%+ unpaid-rent reduction for customers.[^58] The thesis is to build a high-leverage wedge product in a specific operator vertical (collections, leasing chat, maintenance dispatch) and sell it to one of the four-or-five incumbents (RealPage, Entrata, Yardi, AppFolio, or MRI).

**Archetype 4 — The Roll-Up.** RealPage is the canonical example: acquired by Thoma Bravo for $10.2B[^25][^25] in 2021, with subsequent acquisitions including Buildium (2019, pre-Thoma Bravo) and Knock CRM (September 30, 2022, $46.7M total raised by Knock).[^25][^59] The thesis is to use private-equity capital to consolidate the category, recover acquisition multiples through cross-sell, and exit via secondary or strategic. The post-DOJ-settlement environment has made this archetype materially harder to execute in the next decade — the consent decree binds RealPage but the precedent binds the playbook.[^21][^23]

**Archetype 5 — The Owner-Operator-Tech-Builder.** Greystar is the canonical example: managing 1,014,091 units, the largest property manager in the country, building proprietary tech in-house while also being a co-defendant in the RealPage suit.[^33][^25] The thesis is vertical integration — when you operate at 3.5% of US apartment stock you can amortize software development internally. After the RealPage settlement, this archetype is the safe harbor for the institutional cohort: build it yourself rather than buy from a vendor whose data inputs may be subject to consent-decree challenges.[^21][^25]

The funding ladder for Archetypes 1–3 is reasonably standard: Seed $1[^15]–3M[^15] → Series A[^15] $10[^15]–25M[^15] → Series B[^15] $25[^15]–50M[^15] → Series C[^15] $50[^15]–75M[^15] (often the unicorn round) → Series D[^15] $75M[^15][^15]+. The investor cohort that recurs across multiple winners includes Sapphire Ventures, Insight Partners, Point72, DivcoWest, Navitas Capital, Koch Real Estate, JLL Spark, Golden Seeds, Wilshire Lane Capital (Morgan Properties-backed), Madrona, Fifth Wall, and Hercules Capital.[^15][^51][^58][^59] Distribution is through NMHC Annual Meeting, IREM, AAGLA, NAA, Multifamily Executive, Globe St, Multi-Housing News, Multifamily Dive, Inman Connect, and the ZAK PropTech Conference.[^37][^38] The GTM thesis that has worked best is winning the NMHC Top 50 multifamily owners as a beachhead — when you are running on 70%[^38] of the top 50, you reach 1-in-12 multifamily units in the United States at zero customer-acquisition cost, which is exactly what EliseAI has done.[^15][^17]

# Part VIII — Seven Predictions, 2026–2030

The end of this decade looks different from the beginning. Seven predictions for 2026–2030, each grounded in evidence already on the table.

**Prediction 1.** AppFolio crosses $1.5B[^9][^9] revenue and 12M[^9] units under management by FY27. The FY26 outlook of $1.110[^9]-$1.125B[^9][^9] implies +35%[^9] growth from the FY24 baseline; another year of +25%[^9] to +30%[^9] gets the company past $1.4B[^9][^9]. The unit count grew from 8.7M[^9] to 9.5M[^9] during FY24-Q1 2026; another two years at the same +0.4M/quarter cadence reaches 12M.[^9][^12]

**Prediction 2.** EliseAI files an S-1 by 2027 at a $3[^15]-$5B[^15][^15] valuation. The company already has a $1B[^15][^15]+ private valuation, ARR has risen >2.5× since the Series C[^15], and 70%[^15] of the NMHC Top 50 are customers; the next funding milestone is plausibly a strategic investor or a direct listing.[^15][^17][^18]

**Prediction 3.** RealPage is divested or broken up by 2028. The combined pressure from the DOJ consent decree, ten state AGs, the Greystar $50M[^21][^21] class action settlement, the Cortland FBI raid, and Thoma Bravo's natural fund-life exit pressure on Funds XIII and XIV makes a structural separation more likely than a status-quo continuation.[^21][^23][^25]

**Prediction 4.** Five or more vertical AI fraud detection vendors raise growth rounds at $1B[^51][^51]+ valuations by 2027. Snappt has already proven the unit economics; Authenticate, Inscribe, Sift, and at least two new entrants (likely with Trigo-style document-or-identity wedges) will follow.[^51][^52]

**Prediction 5.** HOTMA + state rent-control compliance becomes a $500M[^27][^27]+ vertical SaaS category by 2028. The compliance perimeter has tripled in surface area between 2019 (CA AB 1482, NY HSTPA, OR SB 608) and 2025 (HOTMA Final Rule effective dates), and there is no horizontal PMS that handles all of it natively — the same gap that gave Snappt its lane.[^27][^28][^67][^68]

**Prediction 6.** Smart-home hardware vendors consolidate to two or three. SmartRent absorbs distressed competitors; ButterflyMX and Resident IQ compete on resident experience; the Latch bankruptcy is the warning shot for the rest.[^39][^42]

**Prediction 7.** PE-backed property operators (Blackstone, Greystar, Cortland, Camden, Cushman & Wakefield, Willow Bridge) build proprietary AI rent-pricing models post-RealPage settlement, migrating algorithmic pricing from third-party SaaS to in-house engineering teams. This opens a new "compliance audit-as-a-service" category for any vendor who can certify the data freshness and non-coordination requirements of the DOJ consent decree.[^21][^25]

# Glossary + Related Research

**Glossary**

- **AB 1482** — California Tenant Protection Act of 2019 (5%+CPI cap, just-cause eviction).[^27]

- **AFFH** — Affirmatively Furthering Fair Housing (Fair Housing Act §808(d)).[^66]

- **AIRM** — RealPage AI Revenue Management (uses YieldStar codebase).[^21]

- **ARR** — Annual Recurring Revenue.

- **BTR** — Build-to-Rent.[^7]

- **CFR** — Code of Federal Regulations.

- **HCV** — Housing Choice Voucher (Section 8).[^68]

- **HOTMA** — Housing Opportunity Through Modernization Act of 2016 (Pub. L. 114-201).[^69]

- **HSTPA** — New York Housing Stability and Tenant Protection Act of 2019.[^28]

- **LRO** — Lease Rent Options (RealPage product, sunset end 2024).[^21]

- **MAA** — Mid-America Apartment Communities (NYSE: MAA).[^33]

- **MCI** — Major Capital Improvement (NY rent-stabilized capital pass-through).[^28]

- **NCREIF** — National Council of Real Estate Investment Fiduciaries.[^7]

- **NMHC** — National Multifamily Housing Council.[^33]

- **PBV** — Project-Based Voucher (24 CFR Part 983).[^68]

- **PHA** — Public Housing Authority.[^67]

- **PMS** — Property Management Software.

- **RHFS** — Rental Housing Finance Survey (US Census Bureau).[^1]

- **SEMAP** — Section 8 Management Assessment Program (24 CFR Part 985).[^67]

- **SFR** — Single-Family Rental.[^4]

- **VOR** — Verification of Rent.[^53]

- **YieldStar** — RealPage revenue management product (sunset end 2024).[^21]

**Related Research**

This paper does not cover four threads worth their own treatment: (1) the **Section 8 Operator Stack** — how mid-market HCV-accepting operators handle 24 CFR 982 compliance, AFFH, and tenant screening at the affordable-housing intersection; (2) the **Algorithmic Pricing Audit Stack** — post-RealPage settlement compliance vendors and how PE operators rebuild in-house revenue management models that satisfy the DOJ consent decree; (3) the **PropTech IPO Window** — SmartRent and Latch SPAC class of 2021 versus the next class (EliseAI, Snappt, ButterflyMX) in 2026-2028; and (4) the **Vertical AI Acqui-Roll-Up Playbook** — Entrata→Colleen, RealPage→Knock, Yardi→multiple, with pricing benchmarks for $3-$50M ARR vertical AI exits.

# References

[^1]: US Census Bureau, "2024 Rental Housing Finance Survey Data Released" (February 19, 2026). https://www.census.gov/newsroom/press-releases/2026/2024-rhfs-data.html
[^2]: Capright / Kris Oxtal, "Single-Family Rental REIT Update – May 2026". https://www.capright.com/single-family-rental-reit-update-may-2026/
[^3]: Invitation Homes, "Our Share of the U.S. Housing Market". https://www.invitationhomes.com/blog/our-share-of-the-u-s-housing-market
[^4]: Wolf Street, "The Biggest Single-Family Rental Landlords and Multifamily Landlords in the US" (September 15, 2025). https://wolfstreet.com/2025/09/15/the-biggest-single-family-rental-landlords-and-multifamily-landlords-in-the-us-big-shifts-underway/
[^5]: Invitation Homes / SEC, Q1 2026 Supplemental. https://www.sec.gov/Archives/edgar/data/1687229/000168722926000030/q12026supplemental.htm
[^6]: US Census Bureau, "Quarterly Residential Vacancies and Homeownership, First Quarter 2026" (April 28, 2026, CB26-62). https://www.census.gov/housing/hvs/current/index.html
[^7]: Houlihan Lokey, "August 2025 SFR Market Update". https://cdn.hl.com/pdf/2025/august-2025-sfr-market-update.pdf
[^8]: Chandan, "Census Data Show Individual Investors Still Dominate Single-Family Rental Ownership" (February 19, 2026). https://www.chandan.com/post/census-data-show-individual-investors-still-dominate-single-family-rental-ownership
[^9]: AppFolio, "AppFolio, Inc. Announces Fourth Quarter and Fiscal Year 2024 Financial Results" (January 30, 2025). https://ir.appfolioinc.com/news-releases/news-release-details/appfolio-inc-announces-fourth-quarter-and-fiscal-year-2024
[^10]: AppFolio, Form 10-K Annual Report for FY2024. https://ir.appfolioinc.com/static-files/0b7fd5a1-1019-40c8-a6df-6be8539058ed
[^11]: AppFolio, Form 10-K SEC Filing 0001433195-24-000023. https://ir.appfolioinc.com/sec-filings/sec-filing/10-k/0001433195-24-000023
[^12]: AppFolio, "AppFolio, Inc. Announces First Quarter 2026 Financial Results" (April 23, 2026). https://ir.appfolioinc.com/news-releases/news-release-details/appfolio-inc-announces-first-quarter-2026-financial-results/
[^13]: AppFolio, Annual Reports. https://ir.appfolioinc.com/financial-information/annual-reports/
[^14]: AppFolio, Q4 2024 Press Release Form 8-K (SEC). https://www.sec.gov/Archives/edgar/data/1433195/000143319525000005/appfq42024exhibit991.htm
[^15]: TechCrunch / Kyle Wiggers, "EliseAI lands $75M for chatbots that help property managers" (August 14, 2024). https://techcrunch.com/2024/08/14/eliseais-chatbots-for-property-owners-nets-it-75m-in-funding/
[^16]: EliseAI, "EliseAI Raises $35M Series C" (June 6, 2023). https://www.eliseai.com/blog/%20eliseai-raises-35-million-in-series-c-funding
[^17]: Multifamily Executive, "EliseAI Achieves Unicorn Status With $75M Series D Round" (August 15, 2024). https://www.multifamilyexecutive.com/technology/eliseai-achieves-unicorn-status-with-75m-series-d-round_o
[^18]: EliseAI, "EliseAI Raises $75 Million Series D". https://eliseai.com/blog/eliseai-world-leader-in-ai-enabled-solutions-for-housing-raises-75-million-series-d-round-valuing-company-in-excess-of-1-billion
[^19]: Commercial Observer / Philip Russo, "Proptech Startup EliseAI Raises $75M Series D Round" (August 14, 2024). https://commercialobserver.com/2024/08/eliseai-proptech-multifamily/
[^20]: Citybiz / William Harris, "Real Estate-focused EliseAI Closes $75M Series D" (August 16, 2024). https://www.citybiz.co/article/590237/real-estate-focused-eliseai-closes-75m-series-d-led-by-sapphire-ventures/
[^21]: Federal Register, "United States of America et al. v. RealPage, Inc. et al. Proposed Final Judgment" (January 21, 2026). https://www.federalregister.gov/documents/2026/01/21/2026-01009/united-states-of-america-et-al-v-realpage-inc-et-al-proposed-final-judgment-and-competitive-impact
[^22]: DOJ Antitrust Division, "Competitive Impact Statement RealPage". https://www.justice.gov/atr/media/1419471/dl
[^23]: AP News, "Rent-setting software faces new limits in RealPage antitrust case" (November 25, 2025). https://uat.apnews.com/article/realpage-doj-lawsuit-settlement-rent-data-4d8985a50c28b6322b8f82a2fbb5c79e
[^24]: DOJ Antitrust Division Complaint (August 23, 2024). https://www.justice.gov/d9/2024-08/424422.pdf
[^25]: PESP Stakeholder Project / K Agbebiyi, "DOJ updates case against Thoma Bravo's RealPage to include six of largest landlords" (January 30, 2025). https://pestakeholder.org/news/doj-updates-case-against-thoma-bravos-realpage-to-include-six-of-largest-landlords
[^26]: Bloomberg / Josh Sisco + Leah Nylen, "Thoma Bravo's Realpage Settles DOJ Antitrust Case With Data Deal" (November 24, 2025). https://www.bloomberg.com/news/articles/2025-11-24/thoma-bravo-s-realpage-settles-doj-antitrust-case-with-data-deal
[^27]: California Legislature, "AB-1482 Tenant Protection Act of 2019". https://leginfo.legislature.ca.gov/faces/billTextClient.xhtml?bill_id=201920200AB1482
[^28]: National Tenant Authority, "Rent Control and Rent Stabilization Laws in the US" (March 12, 2026). https://nationaltenantauthority.com/rent-control-laws.html
[^29]: California Legislature, "AB-1482 Bill Text Navigator". https://leginfo.legislature.ca.gov/faces/billNavClient.xhtml?bill_id=201920200AB1482
[^30]: Fair Housing Foundation, "Assembly Bill 1482 FAQ". https://fhfca.org/assembly-bill-faq/
[^31]: LAHD, "AB1482 / State Rent Control". https://housing.lacity.gov/residents/ab-1482
[^32]: CAA / Mike Nemeth, "Governor Signs AB 1482, Enacts Statewide Rent Cap" (October 7, 2019). https://caanet.org/newsom-signs-ab1482
[^33]: NMHC, "2026 Top Owners". https://www.nmhc.org/research-insight/the-nmhc-50/top-50-lists/2026-top-owners/
[^34]: NMHC, "2026 NMHC 50". https://www.nmhc.org/research-insight/the-nmhc-50/
[^35]: Greystar, "Greystar Named in 2026 NMHC Top 50" (April 9, 2026). https://www.greystar.com/business/about-greystar/newsroom/greystar-named-in-2026-nmhc-top-50
[^36]: Commercial Real Estate Direct / Dan Moynihan, "Greystar Retains Top Spot" (April 10, 2026). https://crenews.com/2026/04/10/greystar-retains-top-spot-in-apartment-owner-manager-rankings/
[^37]: Multifamily Dive / Leslie Shaver, "Greystar approaches 1M apartments under management". https://www.multifamilydive.com/news/apartment-management-multifamily-ownership-nmhc-50/744837/
[^38]: Jay Parsons, "NMHC Top 50 Revealed: It's Still an Incredibly Fragmented Industry" (April 10, 2026). https://jayparsons.com/2026/04/10/nmhc-top-50-revealed-its-still-an-incredibly-fragmented-industry/
[^39]: SmartRent, "Q1 2026 Press Release SEC Filing" (May 6, 2026). https://www.sec.gov/Archives/edgar/data/1837014/000119312526207626/smrt-ex99_1.htm
[^40]: BusinessWire / SmartRent, "SmartRent Reports First Quarter 2026 Financial Results" (May 6, 2026). https://www.businesswire.com/news/home/20260506738232/en/SmartRent-Reports-First-Quarter-2026-Financial-Results
[^41]: Stock Analysis, "SmartRent (SMRT) Stock Price & Overview". https://stockanalysis.com/stocks/smrt/
[^42]: KoalaGains, "SmartRent (SMRT) Competitive Analysis & Comparison (2026)" (October 29, 2025). https://koalagains.com/stocks/NYSE/SMRT/competition
[^43]: CompaniesMarketCap, "SmartRent (SMRT) Market Capitalization". https://companiesmarketcap.com/smartrent/marketcap/
[^44]: Weiss Ratings, "SmartRent Company Overview". https://weissratings.com/en/stock/smrt-nyse/company-overview
[^45]: DoorLoop, "Pricing | Property Management Software". https://www.doorloop.com/pricing
[^46]: Vendr, "Yardi Software Pricing & Plans 2026". https://www.vendr.com/marketplace/yardi
[^47]: BC Solutions, "Yardi Pricing Guide: What Voyager, Breeze & Elevate Cost (2026)" (March 26, 2026). https://www.bcsolut.com/resources/yardi-pricing-guide
[^48]: SoftwareSuggest, "Compare Entrata vs Yardi Voyager in May 2026". https://www.softwaresuggest.com/compare/entrata-vs-yardi-voyager
[^49]: DoorLoop, "Compare Yardi Voyager to DoorLoop Property Management Software". https://www.doorloop.com/lp/yardi-voyager
[^50]: SpotSaaS, "Compare Yardi Voyager vs Entrata". https://www.spotsaas.com/compare/yardi-voyager-vs-entrata
[^51]: Tech Company News, "Snappt Acquires Trigo And Secures $50 Million Growth Financing" (August 7, 2025). https://www.techcompanynews.com/snappt-acquires-trigo-and-secures-50-million-growth-financing/
[^52]: Parsers.vc, "Snappt – Funding, Valuation, Investors, News". https://parsers.vc/startup/snappt.com/
[^53]: Snappt corporate, "Beyond Documents: How Snappt Became Multifamily's Applicant Trust Platform" (September 23, 2025). https://snappt.com/blog/applicant-trust-platform/
[^54]: Snappt corporate, "Fraud Detection & Income Verification Software". https://snappt.com/
[^55]: Snappt corporate, "2026 Multifamily Fraud Report" (January 30, 2026). https://snappt.com/blog/2026-fraud-report/
[^56]: LeaseHawk corporate, "LeaseHawk | Close Leases Faster". https://www.leasehawk.com/
[^57]: Colleen AI corporate. https://colleen.ai/
[^58]: Pulse 2.0 / Noah Long, "Colleen AI: $3.5 Million Raised To Optimize Rent And Debt Collections" (August 3, 2023). https://pulse2.com/colleen-ai-3-5-million-funding/
[^59]: Knock CRM corporate. https://knockcrm.com/
[^60]: Knock CRM, "LeaseHawk Integration". https://www.knockcrm.com/leasehawk/
[^61]: Cushman & Wakefield, "Residential Property Management". https://www.cushwakeliving.com/services
[^62]: FirstService Residential, "Multifamily Property Management". https://www.fsresidential.com/corporate/what-we-do/property-management/multifamily-property-management/
[^63]: Cushman & Wakefield, "Residential Property Management US". https://www.cushmanwakefield.com/en/united-states/services/asset-services-multifamily
[^64]: FirstService Residential, "About FirstService Residential". https://fsresidential.com/corporate/about-us-1
[^65]: FirstService Residential corporate. https://fsresidential.com/
[^66]: HUD, "HCV Guidebook Fair Housing Chapter" (December 9, 2024 / January 6, 2025). https://www.hud.gov/sites/default/files/PIH/documents/HCV_Guidebook_Fair_Housing_Chapter_12.9.24.pdf
[^67]: HUD Notice PIH 2024-19, "HOTMA Voucher Final Rule Initial Guidance" (June 5, 2024). https://www.hud.gov/sites/dfiles/OCHCO/documents/2024-19pihn.pdf
[^68]: eCFR, "24 CFR Part 982 — Section 8 Tenant-Based Assistance: Housing Choice Voucher Program" (Feb 26, 2026). https://www.ecfr.gov/on/2026-02-26/title-24/subtitle-B/chapter-IX/part-982
[^69]: Federal Register, "Housing Opportunity Through Modernization Act of 2016 — Housing Choice Voucher Implementation Final Rule" (89 FR 38224, May 7, 2024). https://www.federalregister.gov/documents/2024/05/07/2024-08601/housing-opportunity-through-modernization-act-of-2016-housing-choice-voucher-hcv-and-project-based
[^70]: HUD, "HOTMA Voucher Final Rule Briefing" (May 20, 2024). https://www.hud.gov/sites/dfiles/PIH/images/HOTMA%20Voucher%20Final%20Rule%2005202024%20Rev%201%20(1).pdf
[^71]: HUD, "HOTMA HCV General Provisions Webinar" (August 28, 2024). https://www.hud.gov/sites/dfiles/PIH/documents/HOTMA%20Voucher%20General%20HCV%20Provisions%20Webinar%2008.28.2024.pdf

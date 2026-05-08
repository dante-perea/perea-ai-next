---
title: The Amazon Seller Compliance Field Manual
subtitle: >-
  Suspension prevention, ASIN audit, IP defense, FBA fee architecture — the
  operating playbook for the 1.65M-seller post-Compression marketplace
publication: perea.ai Research
authors:
  - Dante Perea
version: '1.0'
status: Public draft
date: 2026-05
audience: >-
  Amazon third-party sellers (private label + brand owner + reseller cohorts),
  Amazon-focused compliance-SaaS founders, software aggregators
  (Pacvue/Assembly, Carbon6/SPS Commerce, Threecolts), 3PL operators (AMZ Prep,
  Goat Consulting), IP attorneys handling Brand Registry and Section 3 cases,
  and PE/VC investors covering the post-2024 Amazon ecosystem.
length: '~5,800 words'
license: CC BY 4.0
description: >-
  A founder field manual for Amazon seller compliance and suspension prevention
  in the post-Great-Compression marketplace. Maps the 1.65M-seller universe
  (down from 2.4M in 2021), the Section 3 BSA enforcement framework + Plan of
  Action (POA) architecture, the 2026 FBA fee cycle (3 price bands + 3.5%
  fuel/logistics surcharge + LILF + aged inventory 456+ tier + commingling end +
  payout DD+7), the Brand Registry 2.0 + IP Accelerator + Project Zero +
  Transparency stack, the software aggregator consolidation (Helium 10→Assembly,
  Carbon6→SPS Commerce, Threecolts), five founder archetypes, and 2026-2030
  predictions.
profile: field-manual
---

# Foreword — Why a Compliance Field Manual Now

Amazon ended 2025 with 1.65 million[^6] active sellers on Amazon.com — down from 2.4 million in 2021, a 31% contraction in four years.[^6][^7] Just 165,000 new sellers launched their first product on Amazon.com in 2025: the lowest annual figure since Marketplace Pulse began tracking in 2015 and a 44% drop from 2024.[^6] This contraction happened *while* third-party gross merchandise value continued to grow — to an estimated $305 billion[^6][^6] in the United States and $575 billion[^6][^6] globally — and *while* the cohort of $1M+ sellers grew from roughly 60,000 in 2021 to more than 100,000 in 2025.[^6] Marketplace Pulse calls this combination of seller exit and revenue concentration the "Great Compression": tariffs, AI, advertising costs, platform fees, and Chinese-seller competition compressed margins simultaneously, and Amazon transformed from "an accessible entry point for entrepreneurial experimentation into infrastructure for established, well-capitalized operators."[^6]

For the operators who remain, 2026 is the year compliance stopped being optional. Amazon's enforcement is more aggressive than ever — policy violations that once produced warnings now trigger immediate suspensions.[^37] Five fee changes hit in the first quarter of 2026 alone: a $0.08-per-unit average fulfillment fee increase on January 15, a 3.5%[^37] fuel and logistics surcharge starting April 17, FBA Prep Services discontinuation on January 1, end of FBA commingling on March 31, and a new seller-payout schedule (DD+7) on March 12.[^16][^21][^19] The Section 3 enforcement framework — Amazon's "Term and Termination" clause in the Business Solutions Agreement — has tightened, with rejection rates highest for self-prepared appeals.[^9] Brand Registry 2.0 introduced content verification, catalog edit restrictions, rights owner verification, and randomized A+ content audits in 2025-2026.[^26]

This manual is the operator's view of Amazon seller compliance as of May 2026. It covers the 1.65M[^5]-seller universe and three operator cohorts; the Section 3 BSA framework and Plan of Action architecture; the 2026 FBA fee cycle in detail; the Brand Registry + IP Accelerator + Project Zero + Transparency stack; the software aggregator consolidation that has redrawn the compliance-SaaS landscape; five founder archetypes; and seven 2026-2030 predictions. Sources are Amazon Seller Central documentation, the Amazon Small Business Empowerment Report, Marketplace Pulse and Jungle Scout annual surveys, Amazon Sellers Lawyer / AppealCraft / Ave7Lift / Traverse Legal POA guidance, and the funding histories of Helium 10, Carbon6, Pacvue, and Threecolts.[^5][^6][^1][^15][^22][^23]

# Executive Summary — Top-Line Facts + Verdict

The TAM has compressed. Active Amazon.com sellers fell from 2.4M[^6] (2021) to 1.65M[^6] (end of 2025), a 31%[^6] drop, while third-party GMV grew to $305B in the United States and $575B globally.[^6][^7] Independent sellers account for more than 60% of Amazon store sales; 55,000+ US-based independent sellers generated more than $1M in 2024, averaging $290K+ in annual sales per US independent seller.[^5][^7] Globally, more than 100,000 sellers now generate $1M+ (up from ~60,000 in 2021), and 235 generate $100M+ (up from 50 in 2021).[^6] Chinese sellers crossed 50% of Amazon's global active seller base; American sellers represented just 16.3% of new launches in 2025, down from 70.8% in 2016.[^6]

**Account Health Rating (AHR).** The three primary metrics that trigger suspension within 24-72 hours of violation are: Order Defect Rate (ODR) below 1%[^38] on a 60-day rolling window; Pre-Fulfillment Cancel Rate (OCR) below 2.5%[^38] on a 7-day rolling window; and Late Shipment Rate (LSR) below 4% on a 10-30 day rolling window.[^38][^39] Secondary metrics: Valid Tracking Rate (VTR) > 95%; Customer Response Time within 24 hours; On-Time Delivery Rate (OTDR) > 97%[^38] over 90 days; Customer Service Dissatisfaction Rate (CSDR) < 25%; Return Dissatisfaction Rate (RDR) < 10%.[^38] As of February 28, 2026, OTDR enforcement applies per-listing rather than account-wide.[^40]

**Section 3 BSA enforcement.** Amazon's Section 3 ("Term and Termination") clause permits immediate suspension for material breach not cured within 7 days, deceptive/fraudulent/illegal activity, AHR below the deactivation threshold, or legal mandate.[^9] Section 3 is the catch-all for full account-level enforcement; Plan of Action (POA) appeals follow a four-part structure — Root Cause → Corrective Actions → Preventive Measures → Evidence — and Section 3 cases require video verification calls with government-issued ID and bank statements <90 days old.[^9][^11]

**2026 FBA fee architecture.** Average fulfillment fee increase $0.08[^16]/unit on January 15, 2026, with three new price bands (under $10, $10-$50, over $50).[^16][^21] A 3.5% fuel and logistics surcharge layers on top of every FBA fulfillment fee starting April 17, 2026.[^21] Inbound placement service fee continues from 2024 with three options (minimal/partial/Amazon-optimized splits); the 4+-location, 5+-identical-cartons "Amazon-optimized" option waives the fee entirely.[^20] Low-Inventory-Level Fee (LILF) retained for products below 28 days of historical supply.[^21] Aged inventory surcharge added a new 456-days-or-more tier January 16, 2026.[^21] FBA commingling ended March 31, 2026; payout schedule shifted to DD+7 on March 12, 2026.[^19]

**Brand Registry + IP enforcement.** Amazon's IP Accelerator program has 33,000+ brands enrolled across 22 trademark offices in 18 languages.[^22] Project Zero requires 99%+ accuracy on takedown requests for ongoing access; entry requires 90% acceptance rate on Report a Violation reports.[^23][^24] Brand Catalog Lock (2025) prevents unauthorized edits; the RAV tool received a dashboard upgrade with bulk ASIN reporting and faster ticket resolution in 2025.[^25][^26]

**Verdict.** The Great Compression has produced a marketplace where the 1.65M survivors must operate as compliance shops first and retailers second. The operators who treat AHR monitoring + POA preparation + FBA fee engineering + Brand Registry enforcement as core competencies will capture the consolidating revenue. Those who don't will join the 750,000 sellers who exited between 2021 and 2025.

# Part I — The 1.65M-Seller Universe

The Amazon seller universe has bifurcated. The active seller count is contracting while revenue per seller is concentrating, and the demographic composition of the seller base has shifted decisively toward Chinese operators.

**Headline numbers.** Marketplace Pulse estimates 1.65 million[^6] active sellers on Amazon.com at the end of 2025, down from 2.4 million in 2021 — a 31% decline.[^6][^7] Just 165,000 new sellers launched their first product listing on Amazon.com in 2025: the lowest annual total since Marketplace Pulse began tracking active new sellers in 2015, and 44% lower than 2024.[^6] Amazon's own Small Business Empowerment Report puts independent-seller share of Amazon store sales at more than 60%[^6]; in 2024, US-based independent sellers averaged more than $290,000 in annual sales, with 55,000+ generating more than $1 million.[^5][^7] Independent sellers in Amazon's store employed more than 2 million people in the United States in 2024.[^5]

**Revenue concentration.** Even as seller counts contracted, total third-party gross merchandise value grew. Amazon's third-party GMV reached an estimated $305 billion in the United States and $575 billion globally in 2025.[^6] Traffic per active seller increased 31% since 2021.[^6] More than 100,000 sellers now generate $1 million or more annually globally — up from approximately 60,000 in 2021 — and 235 sellers generate $100 million or more, up from just 50.[^6] Revenue is concentrating among survivors who can navigate Amazon's increasingly complex environment.

**Geographic composition shift.** Chinese sellers crossed 50% of Amazon's global active seller base in 2025.[^6] In new launches, Chinese sellers represented 59.9% in 2025 (down from 62.3% in 2024 — the first decline in four years, potentially reflecting Chinese tax reporting requirements), while American sellers accounted for just 16.3% of new launches in 2025, down from 26.8% in 2024 and 70.8% in 2016.[^6] The 2.4 percentage-point Chinese decline marks the first inflection in years; the long-run American decline shows no sign of reversing.[^6]

**The Selling Partner Appstore.** More than 1 million[^5][^5] independent sellers use at least one of the 3,000+ apps in the Selling Partner Appstore.[^5] This data + technology infrastructure has supported a third-party software industry covering listing optimization, inventory management, advertising automation, profitability analytics, multi-channel catalog management, cross-channel advertising, and more.[^5] Customer Service by Amazon — Amazon's outsourced customer service offering — was used by 365,000+ independent sellers in 2024.[^5]

**Three operator cohorts.** First, the **side-hustle / arbitrage seller** — solo operator, often using retail or online arbitrage tools (Tactical Arbitrage, Scoutify, ScoutIQ — now owned by Threecolts), running on FBA Small Light or Standard, sub-$100K/year revenue.[^28] Second, the **private label seller** — building branded SKUs sourced from Alibaba, Helium 10 / Jungle Scout for product research, Brand Registry-enrolled, $100K-$5M revenue.[^29][^32] Third, the **brand owner / institutional seller** — own factory or co-manufacturer, full Brand Registry stack with Project Zero + Transparency, $5M+ revenue, sometimes a multi-million-dollar advertising budget.[^25] The 100,000-plus $1M+ club globally is mostly the second and third cohorts; the 165,000 new launches in 2025 are mostly the first cohort, which is also the cohort exiting fastest under the Great Compression.[^6]

**Seller sentiment.** Marketplace Pulse's 2026 Seller Index — a survey of 181 marketplace businesses representing $2 billion[^3][^3] in annual revenue — found 38%[^3] of sellers distressed and 23% genuinely thriving, with the remaining 39% in a middle cohort.[^3] Jungle Scout's 2025 State of the Amazon Seller report (nearly 1,500 respondents) found that for the first time, the United States surpassed China as the leading supplier country for survey respondents — driven by rising overseas shipping and manufacturing costs.[^1]

# Part II — The Suspension Framework: Account Health and Section 3

Amazon's enforcement system has two distinct layers. The first is the metric-based Account Health Rating (AHR) system that monitors seller performance against published thresholds. The second is Section 3 of the Business Solutions Agreement (BSA), which gives Amazon broad authority to suspend or terminate accounts immediately for risks beyond the published metrics.

**Account Health Rating (AHR).** Amazon's Account Health Rating program policy publishes the metric thresholds that determine suspension risk.[^35][^36] Three primary metrics carry suspension risk: Order Defect Rate (ODR) below 1%[^36] on a 60-day rolling window; Pre-Fulfillment Cancel Rate (OCR) below 2.5%[^38] on a 7-day rolling window; and Late Shipment Rate (LSR) below 4% on a 10-30 day rolling window.[^38][^39] ODR is calculated as (orders with negative feedback + A-to-Z guarantee claims + service credit-card chargebacks) ÷ total orders in period.[^39] OCR is orders cancelled by the seller pre-ship-confirmation ÷ total orders.[^39] LSR is orders with ship confirmation completed after the expected ship date ÷ total orders.[^39] Violation of any primary metric triggers a Performance Notification and potential account suspension within 24-72 hours.[^38]

**Secondary metrics.** Valid Tracking Rate (VTR) must exceed 95%[^37] across 30 days for merchant-fulfilled shipments; "valid" requires the tracking number to work, show delivery confirmation, and match the carrier specified.[^37][^39] Customer Response Time within 24 hours per individual message.[^38] On-Time Delivery Rate (OTDR) above 97% over 90 days — though as of February 28, 2026, OTDR enforcement applies per-listing rather than account-wide for seller-fulfilled inventory: only listings with the most impact on the OTDR drop are deactivated.[^40] Customer Service Dissatisfaction Rate (CSDR) below 25% over 60 days.[^38] Return Dissatisfaction Rate (RDR) below 10% over 60 days.[^38]

**Internal target buffers.** Industry guidance is to set internal targets materially below Amazon's enforcement thresholds: ODR target 0.5%[^38] (vs. 1%[^38] threshold); OCR target 1.5% (vs. 2.5%); LSR target 2% (vs. 4%); customer response within 12 hours (vs. 24).[^38] An ODR rising from 0.3% to 0.5% over two weeks is an operational signal that requires investigation, even though the seller remains well below the violation threshold.[^38]

**Daily monitoring discipline.** Sellers Umbrella's 2026 Account Health survival guide explicitly recommends daily monitoring of the Account Health Dashboard, with alerts on any metric trending toward a threshold.[^37] Inventory health management — maintaining 60-90 days of inventory with reorder triggers at 30 days of remaining stock — is the indirect lever for stopping defect-rate spikes that come from stockouts and cancellations.[^37]

**Section 3 of the BSA.** Section 3 is titled "Term and Termination" in the Amazon Business Solutions Agreement; it gives Amazon the right to suspend or terminate accounts immediately if the seller materially breached the agreement and didn't fix it within 7 days, the account has been or may be used for deceptive/fraudulent/illegal activity, the account harmed or might harm other sellers/customers/Amazon, the AHR dropped below the deactivation threshold, or Amazon is legally required to act.[^9] The phrasing "may be used" and "might harm" matters — Amazon doesn't need to prove wrongdoing, only believe there's a risk, and notice before action is not required.[^9]

**Common Section 3 triggers.** AppealCraft AI's 2025-2026 analysis cites the most common underlying issues: failed supplier or authenticity verifications (inability to provide valid invoices when requested following customer complaints, FBA inventory reviews, or random checks); selling counterfeit goods; related accounts (operating multiple accounts without approval, or being linked to a banned seller); review manipulation; restricted products without adequate documentation; identity verification failures; and dropshipping violations.[^9][^12] Section 3 is also Amazon's catch-all for any escalated enforcement; almost any other policy violation can escalate to Section 3 if it goes unresolved.[^9]

**The video verification call.** Section 3 suspensions increasingly require a video verification call, especially for cases involving identity concerns, supply chain questions, or document authenticity. The seller is asked to hold documents up to the camera (front and back), respond to questions verifying identity and business, present a valid government-issued photo ID, present a bank or credit-card statement less than 90 days old, and answer questions about supply chain with invoices on demand.[^9] Failing to schedule the verification call within 14 days of Amazon's request keeps the account down.[^9]

# Part III — Plan of Action Architecture

A Plan of Action (POA) is Amazon's required mechanism for reinstatement after metric-based or Section 3 suspension. It is the single most important compliance artifact a seller produces, and the rejection rate for self-prepared Section 3 POAs is the highest of any appeal type.[^9] The structure has settled into a four-part canonical form across legal-firm and AI-assisted compliance vendors: Root Cause → Corrective Actions → Preventive Measures → Evidence.[^8][^10][^11][^14]

**Root Cause Analysis (RCA).** A root cause is the systemic process failure that allowed the violation to happen, not a description of the symptom.[^14] "Our shipping times slipped because the post office was slow" is a symptom; "Our internal lead-time settings did not account for the federal holiday's impact on carrier pickup" is a root cause.[^14] Amazon investigators — who read thousands of POAs per week — are trained to detect generic template language; vague root causes ("we will do better") are auto-rejected.[^8][^11] The root cause must (a) acknowledge the policy area Amazon cited, (b) identify the specific internal-process failure, and (c) align factually to the language Amazon used in the suspension notice.[^11]

**Corrective Actions.** Corrective actions describe what the seller has *already* done to stop the harm and stabilize the account — past tense, specific, dated, verifiable.[^11][^14] Examples that match the enforcement category: removed affected ASINs; quarantined inventory; ended high-risk supplier; conducted invoice audit; refunded affected customers; upgraded delayed orders to overnight shipping at the seller's expense; disabled commingling where applicable.[^8][^14] Each bullet should reference (a) what was done, (b) when it was completed, and (c) what was removed or changed.[^8]

**Preventive Measures.** Preventive measures are the controls that demonstrate the violation cannot recur — the most weighted section of the POA because it speaks to future risk.[^11] Each preventive measure must name the control, describe how it works, identify who owns it, and specify what records are retained.[^11] Examples: weekly invoice audits with named owner; pre-shipment QC photos retained for 90 days; gated listing approvals routed through a specific reviewer; SOP training logs with cadence and acknowledgment; escalation rules for specific exception types; daily metrics dashboard with threshold alerts; carrier scorecards refreshed weekly.[^8] AI monitoring systems that alert before a metric triggers a bot are the strongest preventive control because they explicitly close the causal chain.[^14]

**Evidence.** Supporting documentation is attached as PDFs/images: invoices for authenticity cases; authorization letters for IP cases; test reports for safety/restricted-product cases; SOPs and QC logs for performance cases; tracking proof for late-shipment cases; supplier contracts for supply-chain cases.[^8] Only the documents matching the violation should be attached; over-attachment dilutes the appeal.[^11]

**Section 3 POA specifics.** Section 3 cases follow the same four-part structure but with stricter standards. The POA should be 1-2 pages — Amazon investigators don't read long essays; the document should read like a focused, professional memo from someone who understands the problem, has fixed it, and has put systems in place to prevent recurrence.[^9] After 2-3 failed attempts, Amazon may stop responding entirely.[^9] Self-appeals are appropriate for clear-cut cases (false fraudulent activity allegations); attorney involvement is recommended for cases involving intricate IP analysis, identity issues, or repeated failed appeals.[^9][^12]

**Issue-specific POA patterns.**[^8][^12] Authenticity / inauthenticity issues: root cause = supplier vetting failure or commingled inventory risk or SKU mapping error; corrective actions = remove ASINs + quarantine inventory + end supplier + invoice audit + disable commingling; prevention = supplier onboarding checklist + invoice/PO reconciliation + QC photo log + serial/lot tracking + monthly authenticity audits. IP / intellectual property infringement: root cause = inadequate IP clearance workflow; corrective actions = remove listings + correct attributes + collect documentation + change supplier + update packaging/labels; prevention = IP clearance workflow + restricted product screening + compliance doc vault + pre-launch checklist + quarterly compliance review. Performance metric issues: root cause = carrier performance + warehouse cutoff errors + poor packaging + overselling; corrective actions = refund/appease impacted orders + remove late SKUs + change carrier + tighten handling time; prevention = daily metrics dashboard + carrier scorecards + packaging SOP + customer response SLA + automated order holds for risk signals.

# Part IV — The 2026 FBA Fee Architecture

Amazon's 2026 fee cycle introduced the most structural changes to FBA economics since the inbound placement service fee debuted in March 2024. Five changes directly affect operator unit economics and inventory planning.

**Fulfillment fee increase.** Effective January 15, 2026, FBA fulfillment fees increased by an average of $0.08 [^16]per unit — less than 0.5%[^16] of an average item's selling price, and significantly less than the 3.9-5.9% annual cost increases from major US carriers.[^16] No new fee types were introduced.[^16] The 2026 rate card introduced three new price bands on fulfillment fees: under $10, $10-$50, and over $50.[^21] The Low Price FBA program expanded with an average $0.86-per-unit discount for products priced under $10, partially offsetting the cost increase for low-margin SKUs.[^21]

**Fuel and logistics surcharge.** Starting April 17, 2026, a 3.5%[^21] fuel and logistics-related surcharge layers on top of every FBA fulfillment fee across the United States, Canada, and Remote Fulfillment with FBA.[^21] This is a structural cost addition that Amazon-optimized inventory placement cannot eliminate; it affects all FBA shipments uniformly.

**Inbound placement service fee.** The fee structure introduced in March 2024 continued in 2026 with rate adjustments and increased granularity.[^20][^21] Three options remain: minimal shipment splits (single inbound location, highest fee — Amazon redistributes inventory across the network); partial shipment splits (2-3 locations, mid fee); and Amazon-optimized shipment splits (4+ locations, no fee for sellers using 5+ identical cartons per item).[^18][^20] Small standard fees range from $0.21-$0.30 single location; large standard from $0.23-$0.34; large bulky from $2.16-$6.00 depending on weight.[^20] Extra-large products are not subject to the inbound placement service fee.[^21] Amazon waives the fee for 100 inbounded units per new parent ASIN under the FBA New Selection Program for 90 days from a seller's first shipment to a fulfillment center.[^20]

**Low-Inventory-Level Fee (LILF).** Introduced April 2024, the LILF continued into 2026 with structural changes.[^21] The fee applies to standard-size and bulky products that fall below 28 days of historical supply. For sellers running lean inventory (a common JIT pattern), the LILF can compound rapidly during velocity surges.[^21]

**Aged inventory surcharge.** A new 456-days-or-more tier was added January 16, 2026, on top of the existing aged inventory surcharge cycle.[^21] Sellers with slow-moving inventory now face an explicit 15-month penalty tier in addition to the existing 6-month / 9-month / 12-month tiers.

**Disposal and removal fees.** Effective March 1, 2026, disposal and removal fees moved from a one-time charge at order creation to a per-unit charge at the time the unit is actually disposed or removed.[^21] This creates a working-capital headwind for sellers planning end-of-life inventory disposition.

**FBA Prep Services discontinuation.** Effective January 1, 2026, Amazon's FBA Prep Services were discontinued; sellers must now handle prep themselves or use 3PL partners (AMZ Prep, Goat Consulting, others).[^20] Sellers who relied on FBA Prep are now bearing the prep cost directly through internal labor or third-party prep markup.

**End of FBA commingling.** Effective March 31, 2026, brand owners in Brand Registry with the Brand Representative role no longer need to apply Amazon barcode stickers for products that already have manufacturer barcodes (UPC or ISBN). Resellers not in Brand Registry must use Amazon barcode labeling (FNSKU) even when a manufacturer barcode exists. Inbound prep accuracy becomes more valuable; warehouse SOPs must distinguish brand-owner inventory from reseller inventory; mislabeling risk and reimbursement-receiving exception handling become more sensitive.[^19]

**Seller payout schedule and Prime Day fee structure.** Effective March 12, 2026, Amazon shifted the seller payout schedule to DD+7, affecting cash flow and working capital planning for thinly-capitalized operators.[^19] Prime Day 2026 introduced a "Fixed + Variable" fee structure for Lightning Deals, Best Deals, and Prime Exclusive Discounts — replacing the previous free-submission model — with a $50 [^19]early-bird waiver on the US fixed fee for submissions by April 30, 2026; deals must be at least 5% lower than the lowest 30-day price.[^19] Prime Day moved to June 2026, changing seasonal planning and demand timing.[^19]

**The BSA and Agent Policy update.** Effective March 4, 2026, Amazon expanded BSA oversight of automated tools and AI systems used by sellers — directly affecting operators using AI for repricing, listing generation, customer-service automation, and review aggregation.[^19] This is the rule that brings Amazon-side scrutiny into the AI-native compliance vendor cohort discussed in Part VI.

# Part V — Brand Registry + IP Defense

For brand owners, Brand Registry is the single most important enrollment in the Amazon ecosystem. As of 2026, Amazon has built a layered IP defense system spanning four tools: IP Accelerator, Brand Catalog Lock, Project Zero, and the Transparency program — coordinated through the Report a Violation (RAV) tool.

**Brand Registry baseline.** Enrollment is free but requires a registered trademark in the country of sale (USPTO word mark or logo for the United States; equivalent foreign registration for international marketplaces).[^25] Enrolling unlocks: prevent counterfeit listings; prevent unauthorized edits to product detail pages; prevent unauthorized sellers from attaching to ASINs; report IP violations (trademark, copyright, patent); A+ Content and Brand Story modules; Brand Analytics with conversion + search data; Sponsored Brands campaigns with branded search placement.[^25]

**IP Accelerator.** Amazon's IP Accelerator program connects sellers with vetted legal service providers offering pre-negotiated trademark, copyright, patent, brand-name research, and IP-dispute services. As of 2026, more than 33,000 brands have enrolled in Brand Registry through IP Accelerator.[^22] IP Accelerator supports trademark filings across 22 trademark offices worldwide with assistance available in 18 languages.[^22] Critically, IP Accelerator participants can access a broader range of brand protection benefits *before* their trademark registration is granted — including pending-trademark Brand Registry enrollment, which materially compresses the time-to-protection from typical 12-18 month USPTO turnaround down to weeks.[^22]

**Brand Catalog Lock (2025).** Amazon introduced Brand Catalog Lock in 2025, allowing brand owners to lock ASINs from unauthorized content changes.[^25][^26] Only approved contributors can modify titles, images, bullet points, and descriptions on locked ASINs.[^25] Combined with locked key attributes and faster takedowns for inaccurate contributions, Catalog Lock is the single most powerful tool for high-traffic brand-owner SKUs — and it is now table stakes for any brand operating above $1M annual revenue on Amazon.[^26]

**Report a Violation (RAV).** The RAV tool received a major dashboard upgrade in 2025, with bulk ASIN reporting, faster ticket resolution times, and clearer complaint status tracking (under review / accepted / rejected with reasons).[^25][^27] Brand owners can now track takedown status in real time rather than waiting weeks for unclear updates.[^24] Rights owner verification (2025) requires trademark proof tied to the exact ASIN, documented brand ownership, and evidence per policy claim — vague takedowns are now ignored, which limits competitor abuse but raises the documentation bar.[^26]

**Project Zero.** Project Zero is Amazon's self-service counterfeit removal tool, available to brands enrolled in Brand Registry.[^23] Eligibility requires (a) at least a 90% acceptance rate on RAV reports submitted previously, plus (b) demonstrated responsibility on additional criteria.[^23] Once enrolled, brands can search Amazon listings and remove infringing ASINs immediately without going through Amazon's review process.[^24] To maintain access, brands must keep takedown accuracy above 99%; misuse triggers suspension from the program.[^23][^24] Required 10-minute training on enrollment.[^23] Test buys are recommended to confirm violations before takedown.[^23]

**Transparency program.** Transparency is Amazon's serialization solution: scannable codes applied to each unit prevent counterfeit units from being listed or sold to customers.[^23] Brands pay only for serialization codes, with volume discounts available; enrollment + automated protections + the self-service tool are free.[^23] Transparency works best for products with high counterfeit risk — combining it with Project Zero gives brands the strongest available IP defense on Amazon.[^24]

**Brand Registry 2.0 enforcement standards (2025-2026).** Amazon raised the documentation bar across the board.[^26] Content verification: image and text claims must be substantiated with documented evidence. Catalog edit restrictions: faster takedowns for inaccurate contributions; locked titles and key attributes. Rights owner verification: trademark proof tied to specific ASINs; documented brand ownership; evidence for each policy claim. Aggressive listing integrity enforcement: randomized audits focused on A+ content compliance and risky health/performance wording.[^26] Brands without a federally registered trademark, IP Accelerator enrollment, Brand Catalog Lock activated, and Project Zero/Transparency enrollment for high-risk SKUs are now operating without the standard 2026 IP defense stack.

# Part VI — The Amazon Software Aggregator Cohort

The Amazon-software ecosystem has consolidated dramatically since 2019. Three private-equity-backed roll-ups — Pacvue/Assembly, Carbon6, and Threecolts — have absorbed dozens of point solutions, while standalone players like Helium 10 and Jungle Scout serve as the gateway research tools for new sellers.

**Helium 10** (founded 2015 in Irvine, California, by Guillermo Puyol and Manny Coats) was acquired by Assembly on September 13, 2019.[^30] Helium 10 itself acquired Prestozon on September 30, 2020 and MetaMuse Labs in September 2020.[^29] As of 2026, Helium 10 operates with 108 employees in 13 countries, $5M in annual recurring revenue per Owler estimates, and a product suite covering product research, keyword analysis, listing optimization, inventory management, analytics, and operational tools (refunds, alerts, automation).[^29][^31][^33] Helium 10 launched Helium 10 Ads on February 25, 2025.[^29] The legal entity is Pixel Labs, LLC.[^30]

**Pacvue / Assembly.** Pacvue acquired Helium 10 and Prestozon, and Pacvue itself was acquired by Assembly — a private-equity-backed operator that now anchors the Helium 10 portfolio.[^28] Assembly's strategic logic mirrors the broader aggregator thesis: PE consolidation captures the multi-tool seller who otherwise juggles 6-12 separate logins, with cross-sell economics that single-product point solutions cannot match.[^28]

**Carbon6.** Founded 2021 in New York City by Justin Cobb, Carbon6 raised $66M[^34][^34] total across two rounds, including a Series A on October 4, 2022 led by White Star Capital with five additional participants.[^34] Carbon6 was the most aggressive acquirer in the Amazon software aggregator space, rolling up: ZonTools, Seller Investigators, Chargeguard, WallySmarter, PPC Entourage, Zenarbitrage, PrettyMerch, PixelMe, DSP Prime, ManageByStats, SoStocked, Scan Unlimited, AMZAlert, D8aDriven, and Junglytics.[^28][^34] Carbon6 was acquired by SPS Commerce on January 2, 2025 — the biggest acquisition deal in the Amazon software aggregator space to date.[^34] Post-SPS-Commerce acquisition, Carbon6 pivoted away from promoting most of its tool portfolio, focusing on 1P recovery (Amazon Vendor + Walmart), DSP, and Sponsored Ads retargeting.[^28]

**Threecolts.** Threecolts has snapped up: Scoutify, ScoutIQ, ScoutX, Tactical Arbitrage, InventoryLab (Accounting + Profits), SmartRepricer, FeedbackWhiz (Emails + Alerts + Analytics), ChannelReply, DataSpark, Bindwise, ExportYourStore, DimeTyd (Amazon + Walmart), MarginPro, Multichannel Pro, Hemi, PrinceletSQL, SellerRunning, and Marketplace Pulse.[^28] Threecolts' bundling under one login at a low price point makes it a serious threat to standalone SaaS players.[^28]

**Jungle Scout.** Founded 2015, Jungle Scout supports more than $50 billion in annual Amazon revenue and was the first Amazon product research tool.[^1] Jungle Scout's annual State of the Amazon Seller surveys (nearly 1,500 respondents in 2025; nearly 2,000 in 2024) are the leading public dataset on seller sentiment, profitability, advertising investment, and growth plans.[^1][^2] Jungle Scout Cobalt serves enterprise brands; Jungle Scout Data Cloud provides Amazon data points to retailers and investors.[^1]

**SmartScout** (founded 2020 in Logan, Utah) provides Amazon FBA product research for wholesalers, arbitrageurs, and private-label sellers.[^31] SmartScout focuses on brand and product discovery, traffic and sales analysis, and listing optimization.[^31]

**AI-native compliance vendors.** AppealCraft AI, Ave7Lift AI, Amazonsellers Attorney, and Goat Consulting represent the AI-assisted POA / suspension-defense / fee-engineering cohort.[^9][^13][^14][^21] These vendors monetize the compliance burden by productizing the POA workflow, monitoring AHR metrics in real-time, and providing template-driven Brand Registry enforcement. AppealCraft AI specifically markets POA generation as a service governed by IRS Circular 230-style standards (E&O insurance and structured workflow).[^9] The aggregator-bundle thesis (Pacvue/Assembly, Carbon6, Threecolts) compresses the price point for these vendors over time, pushing standalone players toward acquisition or specialization in higher-touch services.[^28]

# Part VII — Five Founder Archetypes

Five archetypes describe how capital and outcomes connect in the Amazon-seller compliance ecosystem as of 2026.

**Archetype 1 — The Compliance SaaS.** AppealCraft AI, Ave7Lift AI, Sellers Umbrella — offer POA-as-a-service plus Account Health Rating monitoring as a subscription.[^9][^13][^14][^37] Pricing is per-seller-account or per-appeal, often with audit insurance bundled. The thesis: 2026 enforcement creates a recurring need for compliance monitoring + appeal preparation that legacy legal firms cannot serve at scale.[^9]

**Archetype 2 — The PE Aggregator.** Pacvue → Assembly; Carbon6 → SPS Commerce ($66M[^28][^28] raised before acquisition January 2025); Threecolts (acquired Marketplace Pulse + 17 other tools).[^28][^34] The thesis: high-earning multi-tool sellers want a single-login bundle, and PE consolidation captures the multi-product cross-sell economics. SPS Commerce's Carbon6 acquisition in January 2025 was the biggest aggregator deal in the space and signals more consolidation ahead.[^34]

**Archetype 3 — The Research Tool.** Helium 10 ($5M[^1][^1] ARR / 108 employees / acquired by Assembly Sept 13 2019); Jungle Scout (founded 2015 / supports $50B[^1][^1]+ in annual Amazon revenue / nearly 1,500-seller annual surveys); SmartScout (founded 2020 Logan UT).[^1][^29][^31] These are the gateway tools that new sellers adopt during product research and listing optimization — and the entry point that aggregators target for acquisition. The thesis: product research is the wedge that surfaces every other compliance need.[^29]

**Archetype 4 — The Legal Firm.** Amazon Sellers Lawyer (CJ Rosenbaum), Amazonsellers Attorney, Traverse Legal, DAM Law — full-service legal firms specializing in Amazon Section 3 appeals, IP enforcement, and Brand Registry strategy.[^10][^11][^12][^26] Pricing is hourly or per-case; high-touch services include video-verification preparation, litigation-grade documentation, and Project Zero accuracy maintenance. The thesis: high-stakes Section 3 cases (especially those involving counterfeits, related accounts, or repeat failed appeals) require attorney involvement that AI tools cannot replicate.[^9]

**Archetype 5 — The 3PL / Prep Service.** AMZ Prep, Goat Consulting — third-party logistics and FBA prep services that absorb the operational complexity of Amazon's inbound placement service fee + commingling end + Prep Services discontinuation.[^19][^20][^21] The thesis: operators want flat-rate per-unit pricing that covers labeling, bagging, shipment creation, carton labeling, inbound freight, and zero-placement-fee inbound optimization. These vendors capture the per-unit margin compression that the 2026 fee architecture creates for sellers without internal warehouse capacity.[^19]

**Distribution channels.** Conferences (NMHC-equivalent for marketplace: White Label Expo, Prosper Show, Internet Retailer / Vibe.co, eTail, ShopTalk, Sellers Summit); creator and YouTube education channels (Helium 10 podcast, Jungle Scout YouTube, AMZ Prep blog); private mastermind groups (TWF/Wholesale Formula, Just One Dime, ASM/Amazon Selling Machine alumni); referral partnerships with attorneys and 3PLs.[^28][^29] The Helium 10 + Jungle Scout content marketing flywheel is the most valuable distribution asset in the ecosystem.[^29]

# Part VIII — Seven Predictions, 2026-2030

**Prediction 1.** **Active US Amazon.com seller count drops below 1.5M[^6] by 2027.** The Great Compression continues — tariffs, advertising costs, AI-driven competition, and platform fees are not easing. The 1.65M[^6] floor at end of 2025 was already a 31%[^6] drop from 2021; another 10% contraction over the next 18-24 months puts the count below 1.5M.[^6]

**Prediction 2.** **Chinese sellers cross 70%[^6] of new Amazon launches by 2027.** The 2025 Chinese share of new launches was 59.9%[^6] (down 2.4 pts from 62.3%[^6] in 2024 — the first decline in four years). But the structural advantages remain intact: lower COGS, faster supplier turnaround, increasingly sophisticated branded-private-label operations.[^6] American sellers' long-run decline from 70.8% (2016) to 16.3% (2025) shows no sign of reversal.[^6]

**Prediction 3.** **Amazon ships an AI-assisted POA tool by 2027.** The BSA + Agent Policy update on March 4, 2026 expanded oversight of automated tools — Amazon's natural follow-on is to provide its own in-platform tooling that auto-generates compliance memos from Performance Notifications, eating the AppealCraft / Ave7Lift / Amazon Sellers Lawyer market segment.[^19][^9]

**Prediction 4.** **A third software aggregator acquisition happens by 2027.** Pacvue → Assembly, Carbon6 → SPS Commerce. Threecolts is the most likely next target: PE-backed roll-up at $50M[^28][^28]-$100M[^28][^28] ARR, with bundled Marketplace Pulse data flywheel, attractive to a strategic acquirer like Salesforce, Adobe Commerce, or Shopify.[^28][^34]

**Prediction 5.** **ODR threshold tightens to 0.5%[^38] by 2028.** Amazon's customer-experience push, combined with reduced seller-count tolerance for marginal performers, will push the ODR threshold from 1%[^38] to 0.5%[^38] — matching the internal-target buffer that compliance vendors already recommend.[^38][^39]

**Prediction 6.** **Brand Registry 3.0 with mandatory Transparency-style serialization for top categories by 2028.** Following the 2025 Brand Catalog Lock + content verification rules, Amazon will mandate serialization for high-counterfeit-risk categories (electronics, beauty, supplements, consumables) — making Transparency table stakes rather than optional.[^23][^24]

**Prediction 7.** **A $100M[^9][^9]+ ARR Amazon-compliance SaaS by 2027.** Either an aggregator-bundled platform (Pacvue/Assembly, Threecolts) or a vertical specialist (AppealCraft, Sellers Umbrella, Carbon6 successor) will cross $100M[^9][^9] ARR by 2027. The compliance burden created by Section 3 enforcement + 2026 fee changes + Brand Registry 2.0 is severe enough to support a category leader at meaningful scale.[^9][^28]

# Glossary + Related Research

**Glossary**

- **AHR** — Account Health Rating program; Amazon's metric-based seller performance system.[^35]

- **ASIN** — Amazon Standard Identification Number; unique identifier for each product on Amazon.

- **BSA** — Business Solutions Agreement; Amazon's seller contract.[^9]

- **CSDR** — Customer Service Dissatisfaction Rate; secondary AHR metric (<25%).[^38]

- **FBA** — Fulfillment by Amazon; Amazon's logistics service.[^16]

- **FNSKU** — Fulfillment Network SKU; Amazon's barcode for FBA inventory.[^19]

- **IP Accelerator** — Amazon's program connecting sellers with vetted IP legal service providers.[^22]

- **LILF** — Low-Inventory-Level Fee; charged on standard/bulky products below 28 days historical supply.[^21]

- **LSR** — Late Shipment Rate; primary AHR metric (<4%).[^38]

- **OCR** — Pre-Fulfillment Cancel Rate; primary AHR metric (<2.5%).[^38]

- **ODR** — Order Defect Rate; primary AHR metric (<1%, 60-day rolling).[^38]

- **OTDR** — On-Time Delivery Rate; secondary AHR metric (>97% over 90 days).[^40]

- **POA** — Plan of Action; required reinstatement document.[^11]

- **Project Zero** — Amazon's self-service counterfeit removal tool requiring 99% accuracy.[^23]

- **RAV** — Report a Violation; Brand Registry's IP-violation-reporting tool.[^25]

- **RDR** — Return Dissatisfaction Rate; secondary AHR metric (<10%).[^38]

- **Section 3** — Term and Termination clause of the BSA; Amazon's broad authority to suspend/terminate.[^9]

- **Transparency** — Amazon's serialization program for unit-level counterfeit prevention.[^23]

- **VTR** — Valid Tracking Rate; secondary AHR metric (>95%).[^38]

**Related Research**

This paper does not cover four threads worth their own treatment: (1) the **Algorithmic POA Stack** — post-Amazon-AI compliance vendors (AppealCraft, Ave7Lift, Sellers Umbrella) and how they productize the appeal workflow at scale; (2) the **3P Marketplace Compliance Comparison** — Amazon vs. Walmart vs. eBay vs. TikTok Shop vs. Shopify enforcement frameworks side-by-side; (3) the **FBA Cost Engineering Stack** — prep + 3PL + inbound placement optimization for sub-$10 SKU profitability under the 2026 fee architecture; (4) the **Chinese Seller Pivot** — tax reporting + tariff compliance + brand registration as 50%+ of new Amazon launches come from China and the regulatory response on both sides of the Pacific.

# References

[^1]: Jungle Scout, "State of the Amazon Seller 2025" (February 7, 2025). https://www.junglescout.com/resources/reports/amazon-seller-report-2025/
[^2]: Jungle Scout, "2024 State of the Amazon Seller Report" (March 25, 2024). https://www.junglescout.com/resources/reports/amazon-seller-report-2024/
[^3]: Marketplace Pulse, "The Marketplace Pulse Seller Index 2026" (April 28, 2026). https://www.marketplacepulse.com/reports/seller-index
[^4]: Marketplace Pulse, "The Amazon Marketplace Trends Report 2026" (March 31, 2026). https://www.marketplacepulse.com/reports/amazon-marketplaces
[^5]: Amazon, "Small Business Empowerment Report 2024" (May 16, 2025). https://cdn-sellingpartners.aboutamazon.com/7f/a0/7c0de2dc48c1b769d9a8eddf7396/small-business-empowerment-report-2024.pdf
[^6]: Marketplace Pulse, "Amazon New Seller Numbers Hit Decade Low in 2025" (January 15, 2026 / Updated April 24, 2026). https://www.marketplacepulse.com/articles/amazon-seller-registrations-hit-decade-low-in-2025
[^7]: Link My Books / Simonida Jovanovic, "How Many sellers are on Amazon 2026" (February 1, 2026). https://linkmybooks.com/blog/how-many-sellers-are-on-amazon
[^8]: AMZ Sellers Attorney / CJ Rosenbaum, "Amazon Plan of Action POA 2026" (January 15, 2025). https://www.amazonsellers.attorney/blog/amazon-plan-of-action-poa-2026
[^9]: AppealCraft AI, "Amazon Section 3 and Code of Conduct Violations" (December 22, 2025). https://appealcraft.ai/blog/amazon-section-3-code-of-conduct-violation
[^10]: Amazon Sellers Lawyer, "Amazon Plan of Action 2025: Step-by-Step Seller Guide" (January 1, 2025). https://amazonsellerslawyer.com/blog/seller-tips/amazon-plan-of-action-2025/
[^11]: Traverse Legal / Enrico Schaefer, "How to Write a Winning Amazon Plan of Action" (February 2, 2026). https://www.traverselegal.com/blog/amazon-plan-of-action/
[^12]: AMZ Sellers Attorney, "Decoding Amazon Section 3 Violations" (January 15, 2025). https://www.amazonsellers.attorney/blog/decoding-amazon-section-3-violations-appeal-guide-2025
[^13]: Ave7Lift AI, "Amazon Section 3 Suspension: Meaning, Reasons, and How to Recover" (February 18, 2026). https://blogs.ave7lift.ai/blog/amazon-section-3
[^14]: Ave7Lift AI, "Amazon POA Sample" (April 7, 2026). https://blogs.ave7lift.ai/blog/amazon-poa-sample
[^15]: Amazon Seller Central, "2026 US FBA fulfillment fee changes". https://sellercentral.amazon.com/help/hub/reference/external/GABBX6GZPA8MSZGW
[^16]: Amazon Selling Partners, "Update to U.S. Referral and Fulfillment by Amazon fees for 2026" (October 15, 2025). https://sellingpartners.aboutamazon.com/update-to-u-s-referral-and-fulfillment-by-amazon-fees-for-2026
[^17]: Amazon Seller Central, "2026 US Referral and FBA fee changes summary". https://sellercentral.amazon.com/help/hub/reference/external/G201411300
[^18]: Amazon Seller Central, "FBA inbound placement service fee". https://sellercentral.amazon.com/help/hub/reference/external/GC3Q44PBK8BXQW3Z?locale=en-US
[^19]: AMZ Prep / Arishekar N, "Amazon March 2026 Updates: FBA, Prime Day, Payouts, AI, AWS" (April 24, 2026). https://amzprep.com/2026/amazon-march-updates/
[^20]: AMZ Prep / Blair Forrest, "Amazon Inbound Placement FBA Fees Explained in 2026" (January 16, 2026). https://amzprep.com/amazon-inbound-placement-fees/
[^21]: Goat Consulting / Eric Sutton, "2026 Amazon FBA Fee Changes: Full Rate Card" (October 16, 2025). https://www.goatconsulting.com/amazon-fulfillment/amazon-fba-fee-changes-for-2026
[^22]: Amazon Brand Services, "IP Accelerator FAQ". https://brandservices.amazon.com/ipaccelerator/faq
[^23]: Amazon Sell, "Project Zero". https://sell.amazon.com/brand-registry/project-zero
[^24]: Dickinson Wright IP Blog / Andrea Arndt, "Amazon Strengthens Brand Protection for Trademark Owners" (August 14, 2025). https://intellectualproperty.dickinson-wright.com/2025/08/14/amazon-strengthens-brand-protection-for-trademark-owners-key-updates-in-2025/
[^25]: Amazon Sellers Lawyer / CJ Rosenbaum, "Amazon Brand Registry 2025: Protecting Your Brand" (May 1, 2025). https://amazonsellerslawyer.com/amazon-brand-registry-2025/
[^26]: DAM Law Firm / Mark Toledo, "Amazon Brand Registry Changes 2025 Guide" (December 9, 2025). https://damlawfirm.com/blog/amazon-brand-registry-changes-2025-guide/
[^27]: Amazon Seller Central, "New Step-by-Step Guide to Reporting Violations in Brand Registry" (October 16, 2025). https://sellercentral.amazon.com/seller-forums/discussions/t/9c611434-1c74-4a41-bc8b-89620da3c7e7
[^28]: Jordi Ordonez, "Amazon software aggregators: who's buying whom and what's next" (August 28, 2025). https://jordiob.com/amazon-tools/guides/amazon-software-aggregators/
[^29]: Helium 10 corporate site (February 19, 2026). https://helium10.com/
[^30]: Crunchbase, "Helium 10" (November 10, 2024). https://www.crunchbase.com/organization/helium-10
[^31]: CB Insights, "Helium 10 Stock Price, Funding, Valuation" (May 19, 2020). https://www.cbinsights.com/company/helium-10/financials
[^32]: CB Insights, "Helium 10 Products, Competitors, Financials" (May 19, 2020). https://www.cbinsights.com/company/helium-10
[^33]: Owler, "Helium 10 Competitors, Revenue, Number of Employees, Funding". https://www.owler.com/company/helium10
[^34]: Tracxn, "Carbon6 - 2026 Company Profile" (August 12, 2022). https://tracxn.com/d/companies/carbon6/__jJd-9Kb4hGB2m_D6CtJ1KUXTQ1UsUSFbPzlEnScSobE
[^35]: Amazon Seller Central, "Account Health Rating program policy". https://sellercentral.amazon.com/gp/help/external/G200205250
[^36]: Amazon Seller Central, "Account health rating". https://sellercentral.amazon.com/gp/help/external/GR786P4BPEVKTBAG
[^37]: Sellers Umbrella, "Amazon Account Health Survival Guide 2026". https://sellersumbrella.com/resources/amazon-account-health-guide-2026
[^38]: Sequence Commerce / Shahbaz Khawaja, "Amazon Seller Performance Metrics 2026" (January 31, 2026). https://sequencecommerce.com/amazon-seller-performance-metrics/
[^39]: Amazon Seller Services, "Working on Your Seller Performance Metrics". https://go.amazonsellerservices.com/account-health
[^40]: Amazon Seller Central, "Update to OTDR listing deactivation process as of February 28, 2026" (February 12, 2026). https://sellercentral.amazon.com/seller-forums/discussions/t/bb76566a-c8a4-468d-bb94-d49402c83023
[^41]: Amazon, "2024 Brand Protection Report" (March 26, 2025) — 99%+ infringing listings blocked proactively; 15M+ counterfeit products seized in 2024; 35% decrease in valid notices of infringement since 2020; Project Zero empowers 35,000+ brands; Transparency API launched 2024 with 2.5B+ product units verified across 88,000 brands; Counterfeit Crimes Unit pursued 24,000+ bad actors since 2020. https://trustworthyshopping.aboutamazon.com/2024-brand-protection-report
[^42]: Amazon News / Dharmesh Mehta, "How Amazon uses AI innovations to stop fraud and counterfeits" (March 26, 2025) — Amazon invested $1B+ on counterfeit/fraud protection in 2024. Transparency API launched 2024. 700,000 bad actor account creation attempts blocked in 2023 (down from 6M in 2020). https://www.aboutamazon.com/news/policy-new-views/amazon-brand-protection-report-2024-counterfeit-products
[^43]: Amazon, "2023 Brand Protection Report" (March 2024) — Amazon invested $1.2B+ and employed 15,000+ people on brand protection in 2023. 7M+ counterfeit products seized; 21,000+ bad actors pursued by Counterfeit Crimes Unit since 2020. https://assets.aboutamazon.com/22/3b/a9c54c7940f683f90022a3d1aaec/amazon-bpr-2024-3-21-2024-final.pdf

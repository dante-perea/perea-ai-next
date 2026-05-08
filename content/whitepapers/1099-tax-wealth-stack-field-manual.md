---
title: The 1099 Tax & Wealth Stack Field Manual
subtitle: >-
  Pay-yourself-first wedge, quarterly-tax automation, retirement aggregation,
  and bank-integration GTM for the 72.9M-Independent market
publication: perea.ai Research
authors:
  - Dante Perea
version: '1.0'
status: Public draft
date: 2026-05
audience: >-
  Founders building 1099-focused fintech, solopreneurs earning $100K+,
  multi-product fintech operators (Mercury, Brex, Found, Lili, Novo) eyeing the
  solo cohort, retirement-platform builders, AI tax-prep founders, and PE/VC
  investors covering the solopreneur category.
length: '~6,000 words'
license: CC BY 4.0
description: >-
  A founder field manual for the 1099 tax + wealth stack. Maps the 72.9M US
  Independents market (5.6M earning $100K+, +19% YoY), the banking incumbents
  (Found, Lili, Novo, Mercury), the AI tax automation cohort (Keeper, Hurdlr,
  FlyFin, Bench), the retirement aggregation layer (Carry, Fidelity,
  Wealthfront), the operating-system roll-up (Lettuce + Besolo + Carry), and the
  2026 tax-code floor (OBBBA 1099-K $20K/200 reinstatement, 199A QBI sunset,
  SECURE 2.0 Roth catch-up, 2026 Solo 401(k) limits). Founder archetypes +
  2026-2030 predictions + glossary + four derivation candidates.
profile: field-manual
---

# Foreword — Why a 1099 Field Manual Now

The United States has 72.9 million[^5] Independents in 2025 — workers who file their own taxes, set their own rates, and operate without a W-2 employer.[^5] More to the point of this manual, 5.6 million of them earn more than $100,000 [^5]annually — a number that has grown 19% year over year and nearly doubled since 2020.[^5] This is the cohort the entire "1099 tax and wealth stack" exists to serve, and 2026 is the year their tooling decisions matter most.

Three regulatory inflections have collided in the last twelve months. The One Big Beautiful Bill (OBBB), signed in July 2025, retroactively reinstated the 1099-K reporting threshold to $20,000 [^34]in gross payments AND more than 200 transactions — reversing the American Rescue Plan Act of 2021 (ARPA) threshold of $600 with no transaction minimum that the IRS had been delaying for four years.[^34][^35][^39] SECURE 2.0 Act provisions started fully phasing in: starting January 1, 2026, certain age-50+ earners must make catch-up contributions as Roth, which Fidelity Solo 401(k) plans are explicitly required to enforce.[^23] And the 20% Section 199A Qualified Business Income (QBI) deduction was scheduled to expire on December 31, 2025 — though OBBBA legislative action has shifted the calculus on extension.[^33][^37]

This manual is the operator's view of the 1099 tax + wealth stack as of May 2026. It covers the four cohorts of independent workers (solo gig, skilled freelancer, solopreneur, institutional partner), the banking incumbents (Found, Lili, Novo, Mercury), the AI tax automation layer (Keeper, Hurdlr, FlyFin, Bench, Lettuce), the retirement aggregation layer (Carry, Fidelity, Wealthfront, Schwab — and the Vanguard exit), the regulatory floor (Schedule SE, 199A, 1099-K, HOTMA-equivalent retirement rules), and five founder archetypes with concrete 2026-2030 predictions. Sources are IRS Statistics of Income research papers, Census Bureau Nonemployer Statistics, MBO Partners' annual State of Independence report, vendor SEC filings, vendor pricing pages, and the funding announcements that shape who buys whom next.[^1][^4][^5][^7]

# Executive Summary — Top-Line Facts + Verdict

The TAM is 72.9 million[^5] US Independents in 2025, of whom 5.6 million earn $100K+ — up 19% year over year and nearly doubled since 2020.[^5] One-third of all 2024 jobs went to short-term W-2 or 1099 workers per ADP's 24-million-worker dataset, with independent contractors median pay $25/hr versus $23/hr for all US workers.[^2] The IRS Statistics of Income shows 30 million-plus 1099 recipients as of 2016, with the IC share of the workforce up 1.5 percentage points (+22%) since 2001 — growth that *predates* the gig economy.[^7]

**Banking incumbents.** Found has 750,000-plus small business customers as of 2026 with a free Core tier plus paid tiers earning 1.50% (Plus, $35/mo) and 2.50% APY (Pro, $80/mo); banking via Lead Bank.[^13][^9] Lili has $80M total raised across two rounds and 200,000-plus active accounts with banking via Choice Financial Group.[^12][^15] Novo has $135M total raised and 150,000 customers at a $700M valuation as of its January 2022 Series B led by Stripes.[^10] Mercury Personal launched generally available December 11, 2025 at $240/year — extending Mercury's 200,000-plus business-banking customer base into the solo cohort.[^16]

**AI tax automation.** Keeper Tax (founded 2019, San Francisco, 23 employees) prices three tiers $199[^27]/$399[^27]/$1,199 [^27]with patented AI scanning 18 months of bank/CC transactions and 300+ deduction types.[^27][^28] Hurdlr reports $8B+ in finances tracked and $300M+ in taxes saved.[^26] FlyFin (founded 2020, San Jose) raised $8M from Accel + Alpha Wave Global in December 2021 and serves 250,000-plus users with a "Man + Machine" model that combines AI deduction scanning with dedicated CPA filing.[^52][^56]

**Retirement.** Carry (founded 2022 as Ocho, NYC) raised $14.5M[^41][^41] total — Seed $4.5M[^41][^41] December 2022 led by Y Combinator + Vibe VC, and Series A[^41] $10M[^41][^41] July 17, 2024 led by Accomplice VC at a $65M[^41][^41] pre-money valuation — with Mega Backdoor Roth + alternative investments + crypto IRA.[^41][^42][^45] On April 15, 2026, Lettuce Financial announced its acquisition of Carry's retirement and investing platform, bringing $225M+ in AUM and thousands of members under Lettuce's solo OS umbrella.[^44]

**The OS roll-up.** Lettuce Financial (founded 2023 in San Francisco by Ran Harpaz) raised $39M[^46][^46] total — including a $15M[^46][^46] Series A[^46] in August 2024 and a $28M[^46][^46] round in November 2025, both led by Zeev Ventures — and acquired Besolo (healthcare benefits) in November 2025 plus Carry (retirement) in April 2026.[^46][^48][^51] The thesis is that solopreneurs earning $100K+ overpay taxes by $15K/year on average, and a single-vendor "soloOS" can capture banking + tax + retirement + healthcare under one subscription.[^48][^51]

**Verdict.** The 1099 wealth stack has shifted from a "banking + tax tool" wedge to an "automated S-Corp + tax + retirement + healthcare" operating system. The next $1B exit will not be a checking account — it will be the consolidation of all five.

# Part I — The 1099 Cohort: 72.9M Independents, Three Working Segments

The most useful way to think about the 1099 cohort is through three segments defined not by industry but by income-earning capacity, because that is what determines which tier of the wealth stack the worker can actually consume.

The total US labor force engaged with 1099 income runs into the tens of millions and depends on which definition you choose. ADP Research's 24-million-worker dataset reports that short-term W-2 workers held 8%[^2] of all filled jobs in 2024 and 1099 contractors held 1.8%[^2], for a combined gig-economy footprint of nearly 10%[^2] in any given month — but that 1 in 4 workers held some gig role at some point during 2024.[^2] The independent-contractor share of total US employment rose from 1.4% in 2019 to 1.8% in 2024 — a 50% increase in monthly sample over five years.[^2] The IRS Statistics of Income's longer-horizon paper found 30 million-plus 1099 recipients (across MISC and K) in 2016, with the share of workers receiving any IC income up 22% since 2001 — growth that pre-dates the platform/gig economy by a decade.[^7] MBO Partners' fifteenth annual State of Independence report puts the total Independent population at 72.9 million[^5] in 2025, with 5.6 million[^5] earning $100K-plus — almost double the 3 million who crossed that threshold in 2020.[^5]

The IRS's research papers also document the threshold gap: 770,000 platform workers (about one-third of the platform workforce in 2018) were missing from federal 1099 data because of the high $20,000[^1]/200-transaction 1099-K threshold, while in Massachusetts and Vermont — which have $600 thresholds — those workers do appear in the data.[^1] When ARPA passed in 2021, the federal threshold was set to drop to $600 with no transaction minimum, but the IRS delayed implementation multiple times before OBBB retroactively reinstated the original threshold in July 2025.[^34][^39]

**Census 2023 Nonemployer Statistics.** The five largest nonemployer industries with substantial gig activity by individual proprietorship are Couriers and Messengers (1,430,708 sole proprietorships), Taxi and Limousine Services (1,355,360), Janitorial Services (1,072,010), Independent Artists/Writers/Performers (1,043,306), and Child Care Services (529,554), with combined receipts of $152.6B.[^6] Sole proprietorships are 86.4% of nonemployers and 67.8% of all US establishments.[^6] By receipts, Taxi and Limousine led at $39.9B, followed by Independent Artists at $25.4B and Janitorial at $20.0B.[^6]

**Three operator cohorts.** The first is the **solo gig worker** — driver, courier, sub-$30K[^9][^9] Schedule C income. They get a consumer banking app and Cash App-style tax filing through TurboTax; they are unlikely to need an S-Corp or a Solo 401(k). The second is the **skilled freelancer** earning $30K[^9][^9]-$100K[^9][^9] — the developer, designer, fractional marketer; this is Found's, Lili's, and Novo's core market, where a free or low-cost business checking account with automatic tax bucket and 1099-NEC issuance is the wedge.[^9][^15] The third is the **solopreneur earning $100K+** — 5.6 million people in 2025, growing 19%[^15] per year. This cohort needs S-Corp election (paying themselves a salary plus distributions), Solo 401(k) with Mega Backdoor Roth, dedicated CPA review, and increasingly group health benefits.[^48][^51] The wealth-stack vendors that capture this third cohort capture the lifetime value.

Demographics matter for product design. ADP found 71%[^2] of independent contractors are male, with 7.2%[^2] over age 70 (versus 3.8%[^2] in the workforce overall) — semi-retired professionals who supplement income through consulting and advisory work.[^2] The top of the income distribution skews toward primary-W-2 + supplementary-IC patterns, while the bottom skews toward primary-IC income.[^7] A field-manual-tier wealth product must therefore handle both the side-hustle pattern (W-2 income + 1099 supplementation requiring quarterly estimated tax) and the full-time independent pattern (Schedule C primary income with potential S-Corp upside).

# Part II — The Banking Incumbents: Found, Lili, Novo, Mercury

The 1099 banking layer has consolidated around four players, each with a different theory of GTM.

**Found** (San Francisco / California; over 750,000 small business customers as of 2026) is the deductions + tax-bucket leader. The product is a business checking account with debit card via Lead Bank (Member FDIC) and a Mastercard, automatic expense categorization, real-time tax calculations, unlimited invoicing, contractor management with free W-9 collection plus automatic 1099-NEC generation and filing, and integrated bookkeeping.[^9][^13] Pricing: Core (free), Plus ($35/mo or $315/yr, earning 1.50% APY on balances up to $20K), and Pro ($80/mo or $720/yr, earning 2.50% APY no cap).[^9][^13] Series B was $60M led by Founders Fund in February 2022, with Sequoia Capital participating; the company grew customer base 20× year-over-year at the time of the round.[^8][^11]

**Lili** (founded late 2019 in NYC by CEO Lilac Bar David and CTO Liran Zelkha — former Pepper Israel founders, Israel's first/largest challenger bank) raised $80M[^12][^12] total: a $15M[^12][^12] Series A[^12] in October 2020 led by Group 11 with Foundation Capital + AltaIR + Primary Venture Partners + Torch + Zeev Ventures, then a $55M Series B in May 2021 led by Group 11 with Target Global + AltaIR.[^12][^14][^17] Banking via Choice Financial Group (Member FDIC) with a Visa business debit card.[^12][^15] Customer base doubled to 200K+ active accounts during the COVID period.[^15] Average monthly deposit was $1,500.[^15] Product features include Personalized Tax Buckets (auto-allocate % of deposits based on projected income/expenses), Emergency Bucket, expense management with auto-categorization, real-time net income/work income reports, Schedule C-oriented exports, and 2-day early access to direct-deposit funds.[^12][^18] Lili's October 2021 partnership with Catch added portable benefits + ACA marketplace plans to the bundle, leveraging American Rescue Plan Act premium tax credits that put plans at $10/month or less for 4 in 5 enrollees per CMS estimates.[^40]

**Novo** (Miami; 150,000 business customers as of January 2022) raised $135M[^10][^10]-plus total — including a $90M[^10][^10] Series B[^10] at a $700M[^10][^10] valuation in January 2022 led by Stripes, with Valar Ventures + Crosslink Capital + Rainfall Ventures + BoxGroup participating.[^10] Distinctively, Novo built its central banking functions in-house rather than using banking-as-a-service platforms, with Middlesex Federal Savings handling the banking license + FDIC + payment rails.[^10] The company's positioning is broader than Found and Lili — it serves SMBs more broadly rather than focusing specifically on solopreneurs.[^10]

**Mercury** rounds out the cohort with Mercury Personal — generally available December 11, 2025 at $240[^16]/year — extending its 200,000-plus business banking customer base into consumer territory.[^16] Mercury Personal customers average $80K balances (one-third higher than the US national average of approximately $60K), and half also use Mercury for business banking.[^16] The subscription includes shared access for up to 4 people with customizable permissions, high-yield savings (5× the national average), Mercury Invest with low-cost ETFs (including SGOV 100%[^16] Treasury ETF currently yielding ~3.82% net of fees), no-fee domestic wires/ACH, and global ATM fee reimbursements.[^16] Banking is via Choice Financial Group + Column N.A.[^16]

The pattern across all four: each started with a checking account + automatic tax bucket as the wedge, then layered in invoicing, expense categorization, contractor management, and (most recently for Mercury) brokerage. The next layer — retirement, healthcare, full payroll — is where the consolidation is happening, and Lettuce's two acquisitions (Besolo for healthcare in November 2025, Carry for retirement in April 2026) are the bellwether.[^46][^44]

# Part III — The AI Tax Automation Cohort: Keeper, Hurdlr, FlyFin, Bench, Lettuce

The "AI + CPA" wedge has settled into five distinct shapes, each charging different prices for different solopreneur income brackets.

**Keeper Tax** (founded 2019 in San Francisco; 23 employees as of 2026) prices three tiers: Standard $199[^27]/yr (federal + state e-filing + deductions tracking + 10 financial accounts), Premium $399[^27]/yr (+ 1:1 dedicated accountant + Form 1040-ES quarterly support + amend prior return + audit resolution), and Pro $1,199/yr (+ Form 941 + S-Corp + Partnership filings + year-end book review).[^27][^28] The product's core is patented AI scanning up to 18 months of bank and credit-card transactions to find deductions across 300+ categories.[^27][^32] Every return is reviewed and signed by a tax pro at no additional cost; 300+ automated checks; 100% accuracy and maximum refund guarantees.[^27][^32]

**Hurdlr** is the mileage + expense + tax tracker, with $8B[^26][^26]-plus in finances tracked, $300M-plus in taxes saved, and a 4.7 average app store rating.[^26][^29] Hurdlr's published average is $5,600+ in tax deductions found per user.[^26] Two tiers: Premium (expenses + mileage + tax estimates and reminders) and Pro (adds invoicing, accounting, financial reports — designed for owners + bookkeepers without accounting jargon).[^26][^29]

**FlyFin** (founded 2020 in San Jose by Jaideep Singh; $8M[^52][^52] Seed in December 2021 led by Accel Partners with Falcon Edge / Alpha Wave Global participating) operates the "Man + Machine" model: AI scans expense accounts daily and suggests deduction categories, then a dedicated CPA reviews and files the return.[^52][^53][^57] FlyFin reports 250K+ users and a 4.8/5 rating.[^56] CPAs are governed by IRS Circular 230 and carry professional liability (E&O) insurance, providing a level of assurance that DIY software cannot match.[^55] The platform is SOC 2 Type II certified.[^55] Pricing: Basic, Standard, and Premium plans starting at $7/month, with Standard and Premium including a Comprehensive Tax Report ($499 typical value), Full Audit Insurance ($150 typical value), and full CPA filing.[^57] Competitively, FlyFin's closest peer is Keeper Tax — both use AI to find deductions — though FlyFin's CPA-as-default differentiator is what shifts pricing power.[^55]

**Bench Accounting** (resurrected after a 2024 shutdown) sells subscription bookkeeping with monthly financial statements + expense overviews + a year-end package that flows into a Bookkeeping & Tax plan with expert tax prep, filing, and year-round advisory.[^31] Bench's pitch is the dedicated human bookkeeper backed by software — different from Keeper or FlyFin's AI-first approach.[^31]

**Lettuce Financial** (founded 2023 in San Francisco by Ran Harpaz; $39M[^46][^46] total raised; subscription tiers from $49[^46]/mo basic) targets the $100K+ solopreneur cohort directly and is the most aggressive operating-system play.[^46][^48][^51] Lettuce's stated thesis: solopreneurs earning $100K+ overpay taxes by $15K/year on average because the existing tools are built for bigger businesses or for individual consumers, and accountants rarely have expertise on independent-worker tax strategy.[^51] The soloOS product handles automated tax categorization + savings strategies, simplified owner payroll, S-Corp compliance, banking, invoicing, accounting, and (post-Besolo) healthcare benefits.[^46][^48] LettuceHead AI is an AI knowledge base + tax hub with a voice interface for conversational management.[^46] Funding: $15M Series A August 21, 2024 led by Zeev Ventures; $3M Venture Round September 2025; $28M[^48][^48] round November 4, 2025 led again by Zeev Ventures with the Besolo acquisition closing concurrently.[^48][^51] Then in April 2026, Lettuce acquired Carry's retirement + investing platform — bringing $225M[^51][^51]+ in assets under management and thousands of members + Carry's compliance infrastructure under the Lettuce umbrella.[^44]

The collective AI-tax-automation thesis: solopreneurs at the high end can afford and will pay for an AI engine that finds 95%[^44] of deductions plus a CPA who signs the return — the question is who captures the bundle. As of May 2026, Lettuce is the only player in this set offering banking + tax + retirement + healthcare under one subscription, and the Carry acquisition is the move that puts the rest of the field on notice.[^44][^48]

# Part IV — The Retirement Aggregation Layer: Carry, Fidelity, Wealthfront, Schwab

For the high-earning solopreneur, the retirement layer is where the largest tax-saving opportunity sits — and 2026 is when the consolidation crystallized.

**2026 Solo 401(k) limits.** The combined contribution cap is $72,000 ($80,000 if age 50+), up from $70,000 ($77,500 for 50+) in 2025.[^19][^20] The employee deferral limit is $24,500 (Roth + Traditional combined), up from $23,500 in 2025.[^20] Standard age-50+ catch-up is $8,000; the special age-60-63 super-catch-up is $11,250 in 2026.[^20][^25] Profit-sharing and SEP IRA contributions are limited to roughly 20% of adjusted net earnings (equivalent to 25% of W-2 compensation).[^20][^25] Form 5500-EZ becomes required when Solo 401(k) assets reach $250,000.[^25]

**SECURE 2.0** (signed late 2022, fully phasing in through 2024-2026) introduces the biggest single change for the high-earner cohort: starting January 1, 2026, certain age-50+ earners must make catch-up contributions as Roth.[^23] Fidelity Solo 401(k) plans have explicitly noted this requirement; combined with Fidelity's existing inability to support Roth in-plan conversions or Mega Backdoor Roth, the SECURE 2.0 catch-up rule pushes high-earner customers toward providers like Carry that explicitly support Roth contribution flows.[^23] SECURE 2.0 also allows sole proprietors with no employees to adopt a new plan after year-end and make retroactive deferrals by the individual tax filing deadline (without extensions) in the first year.[^25]

**Carry** (founded 2022 as Ocho by Ankur Nagpal, with co-founders Alejandro Roman + Jessica Catorc + Nick Rasch; rebranded Carry; HQ Brooklyn NYC) raised $14.5M[^41][^41] total: a Seed round of $4.5M[^41][^41]-$5M[^41][^41] on December 1-8, 2022 led by Vibe VC / Y Combinator with participation from Andreessen Horowitz, Founders Fund, Greylock, Solana Ventures, and 50+ angels including Arash Ferdowsi (Dropbox), Aston Motes, Augusto Marietti, Dylan Field (Figma), Howie Liu (Airtable), Immad Akhund (Mercury), Jack Smith, Matt Bellamy, Paul McKellar, and Sumon Sadhu.[^41][^42][^43][^45] Series A was $10M on July 17, 2024 led by Accomplice VC at a $65M pre-money valuation, with 50+ additional angels including Balaji Srinivasan, Sam Parr, Matt Brezina, Codie Sanchez, Kamal Ravikant, Sophia Amoruso, Brianne Kimmel, and Sahil Lavingia — and a $1M community allocation via AngelList Reg D 506(c) at the same terms.[^41][^58] Carry has 28-34 employees as of 2026.[^45] The product: Solo 401(k) + IRAs + Taxable Brokerage + Smart Yield + Roboadvisor under Core ($299[^45]/yr); add Crypto IRA + alternative investments (real estate, startups, private funds) under Plus ($499/yr).[^19] Mega Backdoor Roth is the headline strategy — up to $72,000 in after-tax dollars converted to Roth; loans up to 50%[^19] of balance or $50,000 [^19](whichever less) without early-withdrawal penalty; EACA tax credit eligibility up to $1,500.[^19]

**Vanguard's Solo 401(k) shutdown** (2024-2025) is the inflection that triggered customer migration. Vanguard exited the Solo 401(k) market and transferred existing plans to Ascensus, where the experience was reported as "clunky and harder than it needed to be" — driving high-net-worth Solo 401(k) holders to evaluate Carry, Fidelity, and the brokerage alternatives.[^21][^22] Fidelity Solo 401(k) remains free with no setup or annual fees and offers a wide range of investments (mutual funds, stocks, bonds, ETFs, CDs), but no Roth in-plan conversions and no Mega Backdoor Roth.[^23] Wealthfront accepts rollovers from former-employer 401(k), 403(b), 457, and TSP plans into IRAs, with online IRA setup taking 15-20 minutes and direct rollovers processing in 3-5 business days.[^22][^24]

**The Lettuce-Carry acquisition** (announced April 15, 2026) is the consolidation move. Lettuce acquires Carry's retirement and investing platform, gaining $225M[^44][^44]+ in AUM and thousands of members plus Carry's established compliance infrastructure.[^44] Carry continues as a standalone brand managed by the incoming Carry team — fees, investment strategy, and custody arrangements unchanged for existing customers.[^44] Ankur Nagpal becomes a strategic advisor to both Lettuce and Carry; Nick Rasch joins Lettuce alongside key members of Carry's operations, product, engineering, and legal/compliance teams.[^44] The strategic logic: high-earning solopreneurs are the most valuable customers, and the bundle of tax automation + S-Corp + retirement + healthcare is more defensible than any single layer.

# Part V — The Tax Code Floor: Schedule SE, 199A, 1099-K, OBBBA

The compliance floor that the 1099 wealth stack must absorb has been reshaped four times in the last twelve months. Operators who don't keep up with this surface area cannot serve $100K+ solopreneurs.

**Self-Employment Tax (Schedule SE, Form 1040).** The 2026 SE tax rate remains 15.3% (12.4% Social Security + 2.9% Medicare) on net SE earnings × 92.35%.[^37] A freelancer with $80,000 in net profit pays approximately $11,304 in SE tax: $80,000 × 92.35% = $73,880 net SE earnings; $73,880 × 15.3% = $11,303.64.[^37] Half of SE tax is deductible on Schedule 1 of Form 1040 ($5,651.82 in this example), reducing AGI.[^37]

**Section 199A Qualified Business Income (QBI) Deduction.** The 20%[^33] pass-through deduction was created in the 2017 Tax Cuts and Jobs Act for tax years beginning after December 31, 2017 and ending on or before December 31, 2025.[^33] It applies to sole proprietorships, partnerships, S-corps, and certain trusts; it is reported on Form 8995 (simple) or 8995-A (complex with W-2 wage limits and UBIA-of-qualified-property tests).[^33][^37] The deduction is the lesser of the QBI component plus the REIT/PTP component, or 20% of taxable income minus net capital gain.[^33] Specified Service Trades or Businesses (SSTBs — law, finance, consulting, health) face phase-outs above income thresholds.[^37] As of writing, OBBBA legislative discussion has focused on whether to extend 199A through 2028 or 2030 — a politically necessary move given the small-business pass-through lobby's staying power, though the precise extension mechanics remain in flux.[^33]

**Form 1099-K Reporting Threshold.** The threshold has been a moving target. ARPA 2021 set it to $600 [^34]with no transaction minimum, intending to flood the IRS with payment-platform information returns; the IRS delayed implementation multiple times.[^34] OBBB (signed July 2025) retroactively reinstated the pre-ARPA threshold: TPSOs not required to file 1099-K unless gross payments exceed $20,000 AND transactions exceed 200.[^34][^35] IRS Fact Sheet 2025-08 (October 23, 2025) is the latest IRS guidance, codifying the OBBB threshold.[^39] State-level thresholds remain lower in Vermont, Massachusetts, Maryland, and Virginia.[^38] Practical examples: a freelancer receiving $15K through Stripe will not get a 1099-K; an Etsy seller with 150 transactions at $25K[^38][^38] will not (under 200 transactions); but an eBay seller with 250 transactions at $22K will receive one.[^38]

**Form 1099-NEC** replaced Box 7 of 1099-MISC starting in 2020 for nonemployee compensation, with the $600 [^1]reporting threshold preserved at the issuer level (the OBBB threshold change applies only to 1099-K, not 1099-NEC).[^1][^7] Found's free 1099-NEC generation and filing for contractors is a meaningful operational savings versus paying a separate contractor-payroll tool.[^9]

**Quarterly Estimated Tax 2026.** Due dates are April 15, June 15, September 15, and January 15, 2027.[^37] Failure to pay enough triggers the underpayment penalty even if the full balance is paid by April 15.[^37] This is the single biggest pain point that the banking-incumbent tax-bucket products address — Found's automatic tax withholding, Lili's Personalized Tax Buckets, and Lettuce's automated tax savings strategies are all aimed at solving this.[^9][^12][^48]

**OBBBA 2026 Deductions (new).** OBBBA added 2026 deductions for vehicle loan interest, overtime pay, and tips — meaningful for Schedule C filers with vehicle-heavy operations or tipped income.[^37] The 2026 standard deduction is $16,100 for single filers and $32,200 for married filing jointly.[^37]

**HOTMA-equivalent retirement rules.** SECURE 2.0's January 2026 Roth catch-up requirement for age-50+ earners earning above the relevant threshold is the operational equivalent of HOTMA's affordable-housing rule changes in property management — an externally imposed compliance shift that shifts vendor selection.[^23] Carry's explicit Roth + Mega Backdoor Roth support gives it the high ground; Fidelity's free-but-feature-limited offering is now more constrained.[^19][^23]

The compliance perimeter is the moat. Vendors that absorb this complexity (Lettuce LettuceHead AI's training on US tax + S-Corp; Keeper's 300+ automated checks; FlyFin's CPA review under Circular 230; Carry's certified retirement custody) capture the high-earning cohort. Vendors that don't will be displaced by the consolidation.

# Part VI — Five Founder Archetypes

Five archetypes describe how capital and outcomes connect in the 1099 wealth stack as of 2026.

**Archetype 1 — The Banking Wedge.** Found, Lili, and Novo started with a checking account + automatic tax bucket as the wedge, then layered in invoicing, expense categorization, contractor management. Found Series B $60M from Founders Fund in February 2022.[^8] Lili Series B $55M from Group 11 in May 2021, total $80M.[^12][^14] Novo Series B $90M from Stripes in January 2022 at a $700M valuation, total $135M+.[^10] Mercury Personal launched GA December 11, 2025 at $240/year, extending Mercury's 200K+ business-banking customers into consumer.[^16] The thesis: own the cash flow, then sell every adjacent product.

**Archetype 2 — The AI-CPA Hybrid.** Keeper Tax (founded 2019 SF, 23 employees, $199[^27]-$1,199[^27]/yr) and FlyFin (founded 2020 San Jose, $8M[^27][^27] Accel seed Dec 2021, 250K+ users) compete on AI-first deduction scanning + dedicated CPA review.[^27][^28][^52] FlyFin's CPA review under IRS Circular 230 with E&O insurance is a key differentiator versus Keeper's AI-only-with-assigned-Keeper model.[^55] The thesis: high-earning solopreneurs are willing to pay $1,000-$5,000/yr for assured filing + audit insurance.

**Archetype 3 — The Retirement Vertical.** Carry (founded 2022 by Ankur Nagpal — Teachable founder with a $250M[^41][^41]+ exit; co-founders Alejandro Roman, Jessica Catorc, Nick Rasch) raised $14.5M total and reached $225M+ in AUM by April 2026.[^41][^42][^45] The wedge: Solo 401(k) + Mega Backdoor Roth + alternative investments. Investor cohort: Y Combinator + Andreessen Horowitz + Founders Fund + Greylock + Solana Ventures + Vibe VC (Seed); Accomplice VC (Series A at $65M pre-money).[^41][^42][^43] Critical lesson: Vanguard's Solo 401(k) shutdown in 2024-2025 was Carry's tailwind — incumbents exit, and the modern alternative captures the migration.[^21]

**Archetype 4 — The Operating System Roll-Up.** Lettuce Financial (founded 2023 SF by Ran Harpaz, $39M total funding from Zeev Ventures) is the consolidation play.[^46][^51] Lettuce acquired Besolo in November 2025 for healthcare benefits and Carry in April 2026 for retirement + investing — the bundle that the rest of the field will need to either build or buy.[^46][^44] Targets the $100K+ solopreneur explicitly; soloOS subscription tiers from $49/month basic.[^48] LettuceHead AI provides voice-interface tax/accounting Q&A.[^46] The thesis: single-vendor consolidation is more defensible than any single layer.

**Archetype 5 — The Bookkeeping Subscription.** Bench Accounting (resurrected after a 2024 shutdown) offers a dedicated bookkeeper backed by software, with monthly financials and a year-end Bookkeeping & Tax plan adding tax prep + filing + advisory.[^31] The thesis: human-first relationships still beat AI-first for SMBs that don't want to learn the software.

**Investor cohort that recurs across multiple winners.** Founders Fund + Sequoia Capital (Found Series B[^8]); Group 11 + Foundation Capital + Target Global + AltaIR + Primary Venture Partners + Torch Capital + Zeev Ventures (Lili Series A[^8] and B; Lettuce Series A[^8] and follow-on); Stripes + Valar Ventures + Crosslink + Rainfall Ventures + BoxGroup (Novo Series A[^8] and B); Accel Partners + Alpha Wave Global / Falcon Edge (FlyFin Seed); Y Combinator + Andreessen Horowitz + Founders Fund + Greylock + Solana Ventures + Vibe VC + Accomplice VC (Carry).[^8][^12][^10][^52][^41]

**Distribution channels.** App Store rankings (Hurdlr 4.7, FlyFin 4.8/5, Keeper consistently top-10 in finance category); tax-season SEM and content marketing; podcast sponsorships targeting creator economy + freelancer audiences; NerdWallet and Forbes Advisor "Best Of" lists (Found is named NerdWallet's Best Business Checking for Paying Contractors and Saving for Taxes); creator partnerships and affiliate programs; Carry's AngelList Reg D 506(c) community-round innovation that turned customers into Series A investors.[^13][^41]

# Part VII — Seven Predictions, 2026-2030

Seven predictions for the 2026-2030 window of the 1099 tax + wealth stack, each grounded in evidence already on the table.

**Prediction 1.** **One vendor crosses $500M[^44][^44] in ARR by 2028.** Lettuce's bundle thesis (banking + tax + retirement + healthcare) is the most likely path — once Carry's $225M[^44][^44] AUM rolls up and the Besolo healthcare offering scales, Lettuce can plausibly reach 200K paid subscribers at $200/mo average ARPU, putting it at $480M ARR.[^44][^48]

**Prediction 2.** **Three or more acqui-roll-ups follow the Lettuce-Carry pattern by 2027.** Mercury or Brex acquires a 1099-tax-focused fintech; Found acquires an AI tax-prep vendor; Wealthfront or Fidelity acquires a Solo 401(k) Mega Backdoor Roth specialist. The consolidation logic is too strong to ignore: high-earning solopreneurs are the most valuable customers and the operating-system bundle is more defensible than any single layer.[^16][^44]

**Prediction 3.** **Mercury or Brex acquires a 1099-focused fintech by 2027.** Mercury Personal launched GA December 11, 2025 — the move signals consumer-tier expansion, and the natural follow-on is acquiring a solopreneur-focused tax/retirement layer rather than building it from scratch.[^16]

**Prediction 4.** **Section 199A QBI extended through 2030 or made permanent in OBBBA-2.** The political costs of letting 20%[^33] of pass-through income become taxable for 30M[^33]+ small businesses outweigh the revenue raise — extension is the low-friction outcome for Congress.[^33][^37]

**Prediction 5.** **The 1099-K reporting threshold is revisited again before 2028.** The OBBB $20K[^34][^34]/200-transaction floor is a political compromise, not a stable equilibrium. As IRS modernization (IRS DRT, Direct File expansion) catches up, expect another attempt to lower the threshold — perhaps to $5,000 [^34]— partially to capture creator-economy income that currently flies under the radar.[^34][^35]

**Prediction 6.** **Solo 401(k) consolidation continues — Schwab and Fidelity face Carry/Wealthfront/Lettuce pressure on Mega Backdoor Roth and alternative investments.** Vanguard already exited; the "free with no Roth/MBR" model at Fidelity faces SECURE 2.0 January 2026 Roth catch-up enforcement that pushes high-earners toward modern providers.[^21][^23]

**Prediction 7.** **The AI-CPA hybrid (Keeper + FlyFin pattern) hits $100M[^27][^27] ARR for at least one player by 2027.** At $399 [^27]Premium tier × 250K[^27] users, FlyFin alone is at $100M[^27][^27] ARR if conversion holds; Keeper's $1,199 Pro tier suggests upper-bracket willingness to pay even higher.[^27][^56] The bottleneck is CPA capacity — the players that solve assignment, training, and quality control at scale capture the cohort.

# Glossary + Related Research

**Glossary**

- **1099-K** — Information return for payment-card and TPSO transactions; threshold $20,000 + 200 transactions reinstated by OBBB July 2025.[^34]
- **1099-NEC** — Nonemployee compensation form (replaced 1099-MISC Box 7 in 2020); $600 issuer threshold.[^1]
- **199A QBI Deduction** — Section 199A 20% deduction on qualified business income; expires Dec 31 2025 unless extended.[^33]
- **AGI** — Adjusted Gross Income.
- **CPA** — Certified Public Accountant.
- **EACA** — Eligible Automatic Contribution Arrangement; tax credit up to $1,500 for new retirement plans.[^19]
- **Form 5500-EZ** — Annual return required when Solo 401(k) assets ≥ $250K.[^25]
- **Form 8995 / 8995-A** — Forms used to claim Section 199A QBI deduction.[^33][^37]
- **Mega Backdoor Roth** — Strategy to contribute up to the full Solo 401(k) annual limit ($72K in 2026) entirely into a Roth account.[^19][^20]
- **OBBB / OBBBA** — One Big Beautiful Bill Act (2025); reinstated 1099-K threshold + added 2026 vehicle/OT/tips deductions.[^34][^37]
- **QBI** — Qualified Business Income (Section 199A).[^33]
- **Schedule C** — Form 1040 schedule for sole proprietorship profit/loss.[^38]
- **Schedule SE** — Form 1040 schedule for self-employment tax calculation.[^37]
- **SECURE 2.0** — 2022 retirement act with provisions phasing in through 2026 (Roth catch-up requirement).[^23]
- **SEP IRA** — Simplified Employee Pension IRA; alternative to Solo 401(k) with simpler admin and lower limits.[^25]
- **SIMPLE IRA** — Savings Incentive Match Plan for Employees; payroll-based, lower limits than Solo 401(k).[^25]
- **Solo 401(k)** — Owner-only 401(k) plan for self-employed; 2026 limit $72,000 ($80,000 if 50+).[^19][^20]
- **S-Corp Election** — Tax election for pass-through entity treatment; enables salary + distributions split for SE tax savings.[^48]
- **TPSO** — Third-Party Settlement Organization (payment apps, online marketplaces); subject to 1099-K reporting threshold.[^39]

**Related Research**

This paper does not cover four threads worth their own treatment: (1) the **Solo 401(k) Custody Stack** — post-Vanguard-shutdown landscape, Carry vs. Fidelity vs. Wealthfront vs. Schwab Mega Backdoor Roth comparison; (2) the **S-Corp Election Decision Tree** — when to switch from Schedule C to S-Corp, payroll mechanics, reasonable salary thresholds for IRS audit-defense; (3) the **OBBBA 2026 Deduction Stack** — vehicle loan interest + overtime + tips + 199A extension scenarios; (4) the **Solopreneur Healthcare Stack** — post-Besolo-acquisition landscape, ACA marketplace + group plans + HRA strategies for $100K+ independents.

# References

[^1]: IRS Statistics of Income, "The Evolution of Platform Gig Work, 2012-2021" (December 20, 2024). https://www.irs.gov/pub/irs-soi/23rpevolutionofplatformgigwork.pdf
[^2]: ADP Research / Ben Hanowell, "The gig economy: A tale of two labor markets" (November 20, 2025). https://www.adpresearch.com/the-gig-economy-a-tale-of-two-labor-markets/
[^3]: IRS Statistics of Income, "The Distribution of Independent Contractor Activity in the United States: Evidence from Tax Filings" (August 30, 2021). https://www.irs.gov/pub/irs-soi/21-rp-independent-contractor-activity.pdf
[^4]: US Census Bureau, "2023 Nonemployer Statistics Measures Growing Gig Economy Activity" (July 16, 2025). https://www.census.gov/library/visualizations/2025/econ/2023-nes-gig-economy.html
[^5]: MBO Partners, "2025 State of Independence in America Report". https://www.mbopartners.com/blog/independent-workforce-trends/five-contingent-workforce-market-trends/
[^6]: US Census Bureau, "Nonemployer Statistics Show Continued Growth in 'Gig Economy' Activities" (July 1, 2025). https://www.census.gov/library/stories/2025/07/nes-gig-economy.html
[^7]: IRS Statistics of Income / Lim, Miller, Risch, Wilking, "Independent Contractors in the U.S.: New Trends from 15 years of Administrative Tax Data" (July 19, 2019). https://www.irs.gov/pub/irs-soi/19rpindcontractorinus.pdf
[^8]: Axios / Ryan Lawler, "Exclusive: Found raises $60 million for self-employed business banking" (February 17, 2022). https://www.axios.com/2022/02/17/exclusive-found-raises-60-million-for-self-employed-business-banking
[^9]: Found, "Found vs. Lili: Which Offers Better Banking for Small Business?" (March 17, 2026). https://found.com/resources/business-banking/found-vs-lili
[^10]: TechCrunch / Ingrid Lunden, "Novo, the SMB neobank, nabs $90M at a $700M valuation" (January 11, 2022). https://techcrunch.com/2022/01/11/novo-the-smb-neobank-nabs-90m-at-a-700m-valuation/
[^11]: CB Insights, "Freelancer digital bank Found raises $60M from Founders Fund" (February 23, 2022). https://www.cbinsights.com/research/found-competitors-novo-mercury-joust-lili-oxygen-shine/
[^12]: Lili / Business Wire, "Lili Raises $55M Series B" (May 11, 2021). https://www.businesswire.com/news/home/20210511005384/en/Lili-Raises-$55M-Series-B-To-Support-Growing-Number-of-Freelancers-in-the-$1.2T-U.S.-Freelance-Economy-Doubles-its-Account-Base-in-Less-than-6-Months-During-the-COVID-19-Pandemic
[^13]: Found corporate site. https://found.com/
[^14]: Lili / Business Wire, "Lili Raises $15 Million in Funding" (October 22, 2020). https://www.businesswire.com/news/home/20201022005739/en/Lili-the-All-in-One-Banking-App-Designed-for-Freelance-Workers-Raises-$15-Million-in-Funding-to-Accelerate-Growth-and-Support-Expansive-Customer-Adoption
[^15]: Banking Dive / Vaidik Trivedi, "Neobank Lili raises $55M as customer base expands" (May 11, 2021). https://www.bankingdive.com/news/lili-raises-55-million-series-b-heels-growing-customer-base/599978/
[^16]: Mercury / Financial Content (Business Wire), "Mercury Launches Premium Consumer Banking for Builders and Founders" (December 11, 2025). https://markets.financialcontent.com/stocks/article/bizwire-2025-12-11-mercury-launches-premium-consumer-banking-for-builders-and-founders
[^17]: TechCrunch / Anthony Ha, "Freelancer banking startup Lili raises $15M" (October 22, 2020). https://techcrunch.com/2020/10/22/lili-series-a/
[^18]: Banklist, "Lili: Digital Business Banking for Freelancers & SMBs". https://banklist.co/lili
[^19]: Carry, "Open a Solo 401k - Carry". https://carry.com/solo401k
[^20]: Carry, "What Is A Solo 401k? Rules, Eligibility, and FAQ for 2026" (January 6, 2025). https://carry.com/learn/what-is-a-solo-401k
[^21]: Wealthy Internet, "Carry Solo 401(k): What It's Like After Switching" (January 21, 2026). https://wealthyinternet.com/carry-401k-review/
[^22]: Carry, "How to Transfer a 401k from Fidelity to Wealthfront" (May 6, 2025 / updated November 27, 2025). https://carry.com/learn/transfer-a-401k-from-fidelity-to-wealthfront
[^23]: Carry, "Carry vs. Fidelity Solo 401k: Which is Right For You?" (December 19, 2025). https://carry.com/learn/carry-vs-fidelity-solo-401k
[^24]: Wealthfront Support, "Rollover: Can I roll over a 401k, 403b or TSP into an IRA?" (Updated January 16, 2024 / August 20, 2024). https://support.wealthfront.com/hc/en-us/articles/209348446-Rollover-Can-I-roll-over-a-401k-403b-or-TSP-into-an-IRA
[^25]: Carry, "Retirement Plan Options for 1099 Employees" (January 14, 2026). https://carry.com/learn/retirement-plan-options-1099
[^26]: Hurdlr corporate, "Automatic Business Expense & Mileage Tracker". https://www.hurdlr.com/
[^27]: Keeper Tax, "Taxes for Self-employed". https://www.keepertax.com/covered-scenarios/self-employed
[^28]: LinkedIn / Keeper Tax. https://www.linkedin.com/company/keeper-tax
[^29]: Hurdlr corporate, "Automatic Business Expense & Mileage Tracker for Freelancers". https://www.hurdlr.com/
[^30]: Keeper Tax, "Tax filing designed for the modern life". https://www.keepertax.com/tax-file
[^31]: Bench Accounting, "Online Bookkeeping Services for Small Businesses". https://www.bench.co/
[^32]: Keeper Tax, "File Self-Employment Taxes". https://www.keepertax.com/lp/g/tax-filing-se
[^33]: IRS, "Qualified business income deduction". https://www.irs.gov/newsroom/qualified-business-income-deduction
[^34]: IRS, "Form 1099-K FAQs: Common situations" (October 20, 2022). https://irs.gov/newsroom/form-1099-k-faqs-common-situations
[^35]: IRS, "Form 1099-K FAQs" (Updated January 22, 2026). https://www.irs.gov/newsroom/form-1099-k-faqs
[^36]: IRS, "Understanding your Form 1099-K" (November 18, 2025). https://www.irs.gov/businesses/understanding-your-form-1099-k
[^37]: Uncle Kam / Kenny Dennis, "2026 Freelancer Year End Taxes: Complete Guide" (April 9, 2026). https://unclekam.com/tax-strategy-blog/2026-freelancer-year-end-taxes-complete-guide/
[^38]: Beancount.io, "Form 1099-K: Complete Guide for Freelancers, Sellers, and Small Business Owners" (April 16, 2026). https://beancount.io/blog/2026/04/16/form-1099-k-complete-guide
[^39]: IRS Fact Sheet 2025-08, "Updates to Form 1099-K FAQs" (October 23, 2025). https://www.irs.gov/pub/taxpros/fs-2025-08.pdf
[^40]: Catch / PR Newswire, "Catch and Lili Banking Announce Partnership" (October 13, 2021). https://www.prnewswire.com/news-releases/catch-and-lili-banking-announce-partnership-to-empower-workers-with-benefits-and-tools-to-thrive-in-independent-work-301399304.html
[^41]: Carry, "Carry's Series A Funding Announcement" (July 17, 2024). https://carry.com/learn/series-a-funding-announcement
[^42]: Exa.ai websets, "How Much Did Carry Raise? Funding & Key Investors" (September 28, 2025). https://exa.ai/websets/directory/carry-funding
[^43]: Startup Intros, "Carry: Funding, Team & Investors". https://startupintros.com/orgs/carry
[^44]: PR Newswire / Lettuce Financial, "Lettuce Financial Acquires Carry's Retirement and Investing Platform" (April 15, 2026). https://www.prnewswire.com/news-releases/lettuce-financial-acquires-carrys-retirement-and-investing-platform-moving-one-step-closer-to-a-complete-financial-solution-for-solopreneurs-302742530.html
[^45]: Carry corporate site (carry.com) (February 17, 2026). https://carry.com/
[^46]: PR Newswire / Lettuce Financial, "Lettuce Financial Secures $28M and Acquires Healthcare Benefits Startup Besolo" (November 4, 2025). https://www.prnewswire.com/news-releases/lettuce-financial-secures-28m-and-acquires-healthcare-benefits-startup-besolo-to-expand-its-ai-powered-operating-system-for-solopreneurs-302604442.html
[^47]: Lettuce blog, "Lettuce Secures $28 Million in Funding" (October 30, 2025). https://lettuce.co/resources/lettuce-secures-28-million-in-funding
[^48]: Tech Company News, "Lettuce Financial Raises $28M In Funding Led By Zeev Ventures" (November 3, 2025). https://www.techcompanynews.com/lettuce-financial-raises-28m-in-funding-led-by-zeev-ventures/
[^49]: Fintech.am, "Lettuce Financial Raises $28M, Acquires Benefits Start-up Besolo" (November 17, 2025). https://www.fintech.am/lettuce-financial-besolo/?lang=en
[^50]: FinTech Global, "FinTech platform Lettuce raises $28m to empower solo workers" (November 4, 2025). https://fintech.global/2025/11/04/fintech-platform-lettuce-raises-28m-to-empower-solo-workers/
[^51]: Lettuce corporate site (lettuce.co) (February 25, 2026). https://lettuce.co/
[^52]: PR Newswire / FlyFin, "FlyFin Raises $8 Million in Funding" (December 9, 2021). https://www.prnewswire.com/news-releases/flyfin-raises-8-million-in-funding-to-scale-first-ai-tax-engine-for-freelancers-and-self-employed-301440168.html
[^53]: Tracxn, "FlyFin funding & investors" (Updated February 10, 2025). https://tracxn.com/d/companies/flyfin/__xFuDoP-QNXkstFf_3nLhlXG8dK5805K5fChd5U_aG9g/funding-and-investors
[^54]: CB Insights, "FlyFin" (May 1, 2024). https://www.cbinsights.com/company/flyfin
[^55]: Best AI Tools for Finance, "FlyFin Review 2025: AI Tax Automation Meets Expert CPA Oversight for Freelancers" (July 25, 2025). https://bestaitoolsforfinance.com/taxes/flyfin-review-ai-cpa-oversight
[^56]: FlyFin corporate site (flyfin.tax). https://flyfin.tax/
[^57]: PR Newswire / FlyFin, "FlyFin Launches Out of Beta" (November 11, 2021). https://www.prnewswire.com/news-releases/flyfin-launches-out-of-beta-to-announce-first-ai-based-engine-tailored-for-gen-z-and-millennial-freelancers-and-self-employed-individuals-301421790.html
[^58]: Carry / Ankur Nagpal Instagram. https://www.instagram.com/ankurna/p/C9kToqrgAJz/

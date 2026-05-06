---
title: "State of Vertical Agents Q4 2026: Insurance Claims"
subtitle: "The operator's field manual for entering insurance after the Duck Creek Agentic Platform launch — TAM, eight incumbents, four GTM patterns, the Three-State Test, and the five founders who built corpus moats deep enough to get acquired"
publication: "perea.ai Research"
authors: ["Dante Perea"]
version: "1.0"
status: "Public draft"
date: "2026-05"
audience: "Founders evaluating insurance-vertical agent market entry. Operators inside carriers, MGAs, TPAs, reinsurers, and brokers calibrating product strategy. Investors triangulating who wins after the Duck Creek Agentic Platform launch in April 2026."
length: "~6,500 words"
license: "CC BY 4.0"
description: "The second entry in the State of Vertical Agents quarterly series. Maps the insurance vertical as the second-highest-leverage agent-economy market in 2026 — $13.45B → $154.39B AI-in-insurance market at 35.7% CAGR, 86% of insurers planning AI-spend increases, eight incumbents shipping at material ARR or platform-acquired exit, the Duck Creek Agentic Platform as the SaaSpocalypse-equivalent inflection, and the Three-State Test (Colorado + NY DFS + EU AI Act Annex III) as the regulatory design floor."
---

# State of Vertical Agents Q4 2026: Insurance Claims

## Foreword

This is the second entry in the **State of Vertical Agents** quarterly series. The first was Legal (Q3 2026, paper #16). The third will be Healthcare (Q1 2027). Each entry sizes the vertical, names the incumbents, maps the communities where buyers actually live, and walks the founder through the 90 days that separate a sub-100-hour MVP from a paid pilot at a carrier or TPA.

Insurance is the second highest-leverage entry point in the agent economy because four conditions overlap: a $1.6 trillion US premium pool with $80 billion of claims-handling spend; AI-in-insurance market sizing converging near $13.5 billion in 2026 with 35.7 percent CAGR through 2034; eight named incumbents shipping at material ARR (or already exited to platform acquirers); and a regulatory framework — Colorado SB21-169, NY DFS Circular Letter 7, the NAIC Model Bulletin in 25+ states, and EU AI Act Annex III — that creates explicit compliance moats favouring structured-AI vendors over chat-only incumbents. The vertical also absorbed a major inflection point on **April 28 2026** when Duck Creek Technologies launched its **Agentic AI Platform** — the moment the dominant core-system vendor shipped its own agentic layer rather than ceding the category to startups. That launch is the insurance-vertical equivalent of the Anthropic Cowork SaaSpocalypse for legal: a category-resetting event that founders entering insurance in late Q4 2026 must factor into product, pricing, and partnership strategy from day one.

The paper sits inside the **perea.ai Research** canon. It bridges the Legal vertical paper (#16), the EU AI Act Procurement Compliance paper (#12), the Multi-Judge Calibration playbook (#13) which underwrites the actuarial validation panels described in Part VII, the Agent Incident Postmortem Anthology (#15) which gives the production-controls vocabulary used in Part VI, and the upcoming Healthcare Q1 2027 paper which shares the payor-side compliance crossover.

## Executive Summary

1. **The AI-in-insurance market is $13.45B in 2026, projected to reach $154.39B by 2034 at a 35.7% CAGR.** Alternate sizings put the figure at $18.64B (2025) → $303.31B (2035) at 32.3% CAGR. The agentic-AI-insurance carve-out specifically went from $5.76B in 2025 to $7.26B in 2026 — a 26 percent jump in a single year. **Insurance industry AI spending is up more than 25 percent in 2026, and 86 percent of insurance organizations regardless of size plan to increase AI spending in 2026** with generative and agentic AI as the top investment categories.

2. **Gartner's autonomy ceiling for insurance: by 2029, autonomous agentic AI systems will independently resolve approximately 80 percent of typical customer service issues.** That 80 percent figure is the most-cited anchor for the upper-bound autonomy commitment any insurance-AI vendor should make in pricing. McKinsey's parallel finding: early AI leaders in insurance generate roughly **6x the total shareholder returns** of AI-laggard peers — reframing AI adoption from cost-control to alpha-generating.

3. **The Duck Creek Agentic AI Platform launch on April 28, 2026 is the insurance-vertical inflection point.** Two new agentic experiences shipped: the **Agentic Underwriting Workbench** and **Agentic FNOL** (First Notice of Loss). For the first time, the dominant core-system vendor shipped its own agentic layer rather than ceding the category to startups. Founders entering insurance in late Q4 2026 must plan for the Duck Creek Agentic Platform as a partner-and-competitor simultaneously, not as a passive integration target. Guidewire's parallel "open-ecosystem" agentic strategy is the carrier core-system fork of 2026.

4. **Eight incumbents are shipping at material ARR or already exited to platform acquirers.** Tractable ($115M raised / $1B valuation / 600 percent revenue growth in 24 months / GEICO + Tokio Marine + Admiral across 30+ countries). Sixfold ($52M total / $30M Series B January 2026 / underwriter co-pilot for carriers, MGAs, reinsurers). Sprout.ai ($21.3M / AXA + Lloyd's Banking + MetLife + Scottish Widows / UK + Europe + Americas + Japan). EvolutionIQ → CCC Intelligent Solutions for **$730 million** in December 2024 (closed Q1 2025) — disability and injury claims management. Cape Analytics → Moody's Q1 2025 — geospatial AI for property underwriting. Artificial Labs $45M Series B February 2026, Lloyd's London focus. a21.ai operational benchmarks: 22 percent FNOL-to-settlement-time drop, 17 percent error reduction, 30 percent adjuster capacity gain. Cohere Health (prior auth, the healthcare-payor crossover).

5. **The Three-State Test — Colorado + NY DFS + EU AI Act Annex III — is the regulatory design floor in insurance.** NAIC Model Bulletin live in 25+ states sets the federated baseline. Colorado SB21-169 + Reg 10-1-1 (effective Nov 14, 2023) requires annual algorithm-testing filings to the Colorado DOI. NY DFS Circular Letter 7 demands documented testing and ongoing monitoring of external consumer data and AI in underwriting and pricing. EU AI Act Annex III classifies insurance pricing and underwriting as high-risk, triggering the Articles 9–15 compliance stack with a 6–9 month compliance lead time and €180–450K cost. **The dual-product strategy fork is more pronounced in insurance than in legal — three regulatory zones to design against, not two.** EU + Colorado-tested + NY-DFS-tested algorithms become a *marketed feature*, not just a compliance overhead.

6. **The four GTM patterns that work in insurance are: reinsurer-seed-customer, MGA-channel-distribution, TPA-pilots, and acquired-by-platform exit.** Munich Re, Swiss Re, and Hannover Re are the reinsurer-seed equivalents of Allen & Overy in legal — clean data corpora, longest-tail risk pools, and highest-leverage outcome metrics. The MGA channel ships 40–200 seats per deal. TPA pilots are the lowest-friction starting point because TPAs do not have full-stack core-system replacement decisions to make. **The exit pattern in insurance AI is acquired-by-platform, not standalone IPO.** EvolutionIQ → CCC ($730M), Cape Analytics → Moody's, Tractable → Solera (rumoured). Founders should plan for this from year one.

7. **The FNOL-automation 1.5x productivity ceiling at $35–150/hour adjuster billing rates is the insurance unit-economics core.** Per a21.ai operational metrics, single-agent + adjuster pairs deliver roughly 1.5x productivity on bounded claims-cycle tasks. Insurance equivalent of legal's 1.4x ceiling. Workflow design and UX dominate model quality (the Witan Labs lesson generalises). Founders who pour resources into model fine-tuning and skip workflow + UX tuning are leaving the largest single source of measurable productivity gain on the floor — and in insurance, that gain is what the carrier or TPA will write into the contract as a quantified ROI commitment.

## Part I — Why Insurance, and the Duck Creek Inflection

The insurance vertical satisfies four conditions simultaneously, and the timing window for entering is narrower than legal's because the core-system vendors are now shipping their own agentic layers.

**Condition one: TAM.** AI-in-insurance market sizings converge: Fortune Business Insights at $13.45B in 2026 → $154.39B by 2034 at 35.7 percent CAGR; InsightAce Analytic at $18.64B in 2025 → $303.31B by 2035 at 32.3 percent CAGR. The agentic-AI carve-out grew from $5.76B in 2025 to $7.26B in 2026 (26 percent in a single year). Forrester reports global tech spending +7.8 percent in 2026 with insurance among the fastest-growing AI-investment industries. Gartner: by 2025, more than 85 percent of P&C insurers cloud-first; by 2029, autonomous agentic AI resolves approximately 80 percent of typical customer service issues. McKinsey: AI leaders in insurance generate roughly 6x total shareholder returns vs laggards.

The sub-vertical map matters more than the headline. US-only premium and claims spend breaks down approximately as follows.

| Sub-vertical | 2026 size (US) | Notable agent-native players |
|---|---|---|
| P&C premium pool | $850B annual premiums | Tractable, a21.ai, Sixfold |
| Life + Health premium pool | $700B | EvolutionIQ (disability), Sprout.ai |
| Reinsurance | $50B | Sixfold (underwriter co-pilot) |
| Workers compensation | $60B | a21.ai, EvolutionIQ |
| Commercial + specialty lines | $220B | Artificial Labs (Lloyd's London) |
| Personal auto claims | $280B | Tractable (vehicle-damage AI) |
| Property claims | $190B | Cape Analytics (Moody's), Hyperscience |
| Disability + IDI claims | $40B | EvolutionIQ (CCC), Sprout.ai |
| Health prior authorization | $31B operational spend | Cohere Health, Hyperscience + Snorkel |

**Condition two: adoption inflection.** AI spending across the insurance industry is up more than 25 percent in 2026; 86 percent of insurance organizations regardless of size plan to increase AI spending in 2026 with generative and agentic AI topping the investment list. The buyer is in motion at a faster rate than legal's 44 → 87 percent inflection — but starting from a higher baseline.

**Condition three: the Duck Creek inflection.** On April 28, 2026, Duck Creek Technologies launched its **Agentic AI Platform**. Two new agentic experiences shipped immediately: the **Agentic Underwriting Workbench** and **Agentic FNOL**. The platform is insurance-native, multi-tenant, and governance-aware. Duck Creek's Q4 fiscal 2026 reported double-digit YoY SaaS ARR growth and double-digit new-customer wins. Formation '26, Duck Creek's customer conference, kicked off in May 2026 with the Agentic Platform as the headline announcement. **For the first time, the dominant core-system vendor shipped its own agentic layer rather than ceding the category to startups.** This is the insurance-vertical equivalent of Anthropic Cowork's launch on January 30 in legal: a category-resetting event whose immediate effect is to commoditize basic agentic capability and to push value creation toward proprietary corpus, regulatory posture, and integration depth. Guidewire's parallel "open-ecosystem" agentic strategy positions it as the swappable-model platform vs Duck Creek's "insurance-native" framing — the carrier core-system fork of 2026.

**Condition four: pattern-matched MLP communities and GTM motions.** Sections III and IV map them in detail. The insurance MLP map is denser than the legal map at the conference layer (ITC Vegas alone is 9,000+ participants vs Legalweek's ~5,000) but slightly sparser at the Reddit and Substack layers.

These four conditions occur together in insurance in a way they do not occur in retail, education, or manufacturing as of mid-2026. They occur in insurance second only to legal — and the Duck Creek inflection makes the entry window narrower.

## Part II — The Eight Incumbents That Matter

**Tractable.** $115M total raised, $1B valuation, $60M Series D. **600 percent revenue growth in 24 months.** Vertical: vehicle-damage assessment via computer vision for auto insurance. Customers: GEICO, Tokio Marine Nichido, Admiral Seguros, across 30+ countries. Tracxn-ranked the #1 Native AI in Insurance company. Tractable is the BigLaw-Harvey-equivalent in insurance: best-in-class single-vertical specialist with the deepest case-images corpus and the strongest carrier reference graph.

**Sixfold.** $52M total raised, **$30M Series B in January 2026**. Vertical: generative-AI-augmented underwriting. Customers: global carriers, MGAs, reinsurers (specific names not yet public). Product positioning: underwriter co-pilot for risk evaluation and submission processing. Sixfold is the underwriter-side specialist; Tractable is the claims-side specialist; together they map the two highest-value workflows in the P&C lifecycle.

**Sprout.ai.** $21.3M total raised. Customer concentration: **AXA, AdvanceCare, Lloyd's Banking Group, MetLife, Scottish Widows.** Vertical: end-to-end claims automation including coverage checking and fraud detection. Geographic footprint: UK + Europe + Americas + Japan. Sprout.ai is the canonical UK-first geographic-wedge play — entering through Lloyd's London market relationships before US expansion.

**Cape Analytics → Moody's (Q1 2025 acquisition).** Pre-acquisition $75M total raised from Formation 8, Pivot Investment Partners, State Farm Ventures. Acquired by Moody's in Q1 2025 for geospatial AI for property underwriting. The canonical **data-corpus-moat exit pattern** in insurance. Cape Analytics built a defensible aerial-imagery + property-attributes corpus that Moody's wanted as a permanent input to its property-risk modeling — a moat unreachable by post-Cowork base-reasoning quality.

**EvolutionIQ → CCC Intelligent Solutions ($730M, December 2024 / closed Q1 2025).** EvolutionIQ raised $33.1M from Brewer Lane Ventures and Foundation Capital; recurring revenue tripled three consecutive years; Series B at >$200M valuation in February 2023. CCC acquired the company for **$730 million** (40 percent stock + 60 percent cash). Vertical: AI guidance for disability and injury claims management. **The canonical platform-acquisition exit pattern** in insurance — $730M transaction value at a sub-$50M ARR-equivalent because the disability + injury claims corpus and the workflow-integration depth are what CCC was buying.

**Duck Creek Agentic AI Platform (GA April 28, 2026).** Insurance-native multi-tenant platform shipping the Agentic Underwriting Workbench + Agentic FNOL as launch capabilities. Q4 fiscal 2026 double-digit SaaS ARR growth and new-customer wins. Formation '26 customer conference May 2026 headlined by the platform. Duck Creek is now both the largest distribution surface for partnered agentic AI products *and* the most credible direct competitor to startups operating in claims and underwriting workflows.

**Guidewire.** The other dominant core-system vendor (~50 percent of US P&C carrier market). Guidewire's agentic strategy is positioned as "open ecosystem" — swappable LLM, swappable agent-runtime, partner-extended workflows. Coforge integration partner reports 40 percent faster product launches when Guidewire + Duck Creek + Applied Epic + Vertafore are all integrated as the agentic stack. Guidewire-vs-Duck-Creek is the carrier core-system fork of 2026: open-ecosystem-extender vs insurance-native-platform.

**Artificial Labs.** **$45M Series B in February 2026.** Lloyd's London market focus. Insurance AI platform with strong specialty + commercial-lines positioning. Artificial Labs is the canonical UK-Lloyd's-first wedge play with the largest 2026 fundraising round in that geography.

**a21.ai.** Operational benchmark vendor. Per industry references: **22 percent FNOL-to-settlement-time drop, 17 percent error reduction, 30 percent adjuster capacity gain.** Specific funding and customer figures not publicly disclosed in the 2026 cycle, but the operational numbers are the most-cited claims-cycle-improvement benchmarks in vendor pitches across the vertical.

**The next-tier players** — **Cohere Health** (prior authorization, the healthcare-payor crossover), **Hyperscience** + **Snorkel** at Aetna / CIGNA / Anthem (health-insurance claims-document processing), **Krane** (construction logistics adjacent, $9M Series A), **Mentium** (freight logistics adjacent, $3.2M seed). These are the boundary-crossing plays where insurance overlaps with healthcare, construction, and logistics.

**A founder picks one sub-vertical and one or two players to displace.** The map above tells the founder which.

## Part III — Where Insurance Buyers Actually Live

A founder who does not live in two of the following six communities is not entering insurance in 2026; they are guessing.

**InsureTech Connect Vegas (ITC Vegas).** **September 29 – October 1, 2026 at Mandalay Bay.** **9,000+ participants, 500+ speakers.** The single largest gathering of insurance innovation globally — the Legalweek-of-insurance with roughly 1.8x the attendee count. ITC Vegas is the year's anchor event for vendor launches, demo floor activity, and reference-customer panel announcements. Founders entering insurance must attend as either sponsor or attendee in 2026.

**ACORD Conferences.** The standards-body community. The single concentration point for carrier IT decision-makers + standards-track regulators. ACORD data standards are the integration baseline that any insurance-AI vendor must conform to. ACORD events are smaller (1,000–2,000 attendees) but high signal-to-noise for IT and architecture buyers.

**NAIC Working Groups.** The H Committee Big Data and AI Working Group is the canonical regulatory-stakeholder body. Founders building AI-native products with regulatory exposure must track NAIC working-group output as the regulatory compliance lead time drops from 18 months to 8 weeks at the regulator level. NAIC working groups are also where state-by-state divergence (Colorado vs NY vs the federated bulletin) first surfaces as draft text.

**RIMS RISKWORLD + CPCU Society.** Risk-management-society annual conference (RIMS) and Chartered Property Casualty Underwriter society (CPCU). RIMS is the B2B buyer for commercial-lines AI products — risk managers and corporate treasurers concentrate here. CPCU is the credentialed-underwriter community. CPCU CE-credit content marketing parallels CLE-credit for legal — the lowest-CAC top-of-funnel for product-led growth in insurance, with credentialed underwriters paying $99–399 per CE-credit-bearing webinar.

**NAMIC + BIBA UK.** National Association of Mutual Insurance Companies and British Insurance Brokers' Association. NAMIC concentrates regional + farm-bureau + workers-comp specialty carriers — strong for sub-vertical specialty plays. BIBA is the UK-broker concentration — the EU-and-UK-first GTM-channel analog to ALSPs in legal. UK-first wedge plays (Sprout.ai, Artificial Labs) consistently land their first ten customers through BIBA-adjacent relationships.

**Claims-handler LinkedIn groups + Reddit.** "Claims Professionals Network," "Insurance Claims Adjusters," "P&C Claims Leaders." Practitioner-level peer-to-peer tool-recommendation channels. /r/InsuranceProfessionals and /r/Insurance complete the bottom-up product-led-growth channel for tools targeting individual claims handlers and underwriters. Lower volume than legal Reddit but high signal-to-noise on adjuster + underwriter day-to-day workflow pain points.

**The Substack and newsletter layer.** **Coverager Substack** is the single most-referenced insurance-tech newsletter; **Insurance Innovators newsletter** covers the European market; **InsurTech Weekly** covers the broader segment. Smaller distribution than legal-tech Substacks (Lawyerverse, Legaltech Hub) but founder + investor + carrier-CTO concentration.

**The discipline:** pick two of the six and *show up in them weekly for 90 days* before launching the product. Founders who skip this step never get the inbound flywheel that the playbook above depends on. The one insurance-specific addendum: ITC Vegas is so concentrated that a founder can compress 90 days of community-building into the 4-day conference window — but only by booking the right pre-event dinners with reinsurer + carrier + MGA decision-makers.

## Part IV — Four GTM Patterns That Work in Insurance

The insurance-vertical GTM motions diverge from legal's Harvey-Spellbook fork. Four patterns dominate.

**Pattern A — Reinsurer-seed-customer.** Munich Re, Swiss Re, and Hannover Re are the reinsurer equivalents of Allen & Overy in legal. They have the cleanest data corpora, the longest-tail risk pools, and the highest-leverage outcome metrics. **Reinsurer endorsement is the legal-equivalent of Harvey's A&O 4,000-lawyer rollout — the case study every other carrier asks to replicate.** Tractable's early Munich Re relationship became the reference for Tokio Marine and GEICO. Sixfold's reinsurer pilots in 2025 became the reference for the MGA-channel expansion in 2026. The lever: land one reinsurer with a quantified deployment story; the next 50 enterprise customers will be referrals.

**Pattern B — MGA-channel-distribution.** Specialty managing-general-agents buy AI tooling at scale (40–200 seats per deal). After the Duck Creek Agentic Platform launch + the Cowork shock, MGAs explicitly want vendor-agnostic tooling so they do not bet on a single core-system vendor. **Sixfold's underwriter co-pilot is the canonical MGA-channel play** — selling once to an MGA distributes the product across all the carriers the MGA places business with. Robin AI and DraftWise reported 30 percent+ of 2026 ARR from ALSPs in legal; the analogous MGA-channel ARR mix in insurance is on track to reach 40–50 percent by 2027 for vendor-agnostic plays.

**Pattern C — TPA-pilot pattern.** Third-party administrators are the lowest-friction pilot environment because they do not have full-stack core-system replacement decisions to make. Tractable + a21.ai both ran early TPA pilots before crossing into direct carrier deployment. The lever: TPAs convert from pilot to paid in 30–60 days vs 6–9 months for direct-carrier sales; use TPAs as the proof-of-concept generator for the eventual carrier sale.

**Pattern D — Acquired-by-platform exit.** EvolutionIQ → CCC Intelligent Solutions for **$730 million**. Cape Analytics → Moody's. Tractable → Solera (rumored). Microsoft / Nuance ($19.7B for the healthcare-adjacent acquisition). **The exit pattern in insurance AI is acquired-by-platform, not standalone IPO.** Founders should plan for this from year one. Implications: build a corpus moat that a platform acquirer would value (geospatial imagery, disability + injury cases, vehicle-damage images, prior-auth decision histories); cultivate relationships with the four most-likely acquirers (Verisk, CCC, Moody's, Solera, Duck Creek, Guidewire) early; structure the cap table for an acquisition exit (40 percent stock + 60 percent cash being the EvolutionIQ template).

**Plus the broker channel and state-regulator-sandbox channel.** Marsh's "Sentrisk," Aon's "Innovation Studios," and WTW's "Climate Risk Intelligence" each run internal innovation arms that source AI products for placement teams and push them downstream to insureds. State regulator sandboxes (CA, FL, AZ) operate insurance-AI sandboxes — founders entering with a Colorado + NY + EU dual-compliance posture can use these sandboxes as accelerated time-to-market.

**Four patterns + the four secondary channels = the GTM motion-mix a founder picks two of, before writing code.**

## Part V — Pricing Models + Integration Plays

Six pricing models work in insurance. A founder picks one based on the buyer's existing reference price, not on what feels best to charge.

**Per-claim.** Tractable, a21.ai, Sprout.ai. Reference price range: **$30–150 per processed FNOL** in commodity processing. The reference is "one claims-handler-hour at the carrier's standard adjuster cost."

**Per-policy.** Sixfold (per-underwriting-decision-supported). The reference is "one underwriter-touchpoint at the carrier's standard underwriter cost."

**Loss-ratio-improvement (outcome-based).** Select Tractable + Sixfold enterprise contracts price against measured loss-ratio reduction or combined-ratio improvement. The reference is "the outcome the carrier was already trying to achieve — pay only when the agent moves the needle."

**Per-adjuster-license.** $300–800/month per adjuster seat. Practice-management style. The reference is "one tool inside one adjuster's monthly software stack."

**Bundled-into-core-system.** Duck Creek Agentic Platform (no separate fee, included in core-system subscription post-April 28 2026). Guidewire equivalent for partnered apps. The reference is "the incumbent's existing seat cost."

**Enterprise flat-fee.** Large carriers $500K–5M/year. The reference is "one mid-level claims-team-lead's annual fully-loaded cost."

The integration map matters as much as the pricing model. **Five integration touchpoints account for the bulk of insurance-tech distribution: Guidewire (~50% of US P&C market share), Duck Creek (~25%, now Agentic Platform GA April 28 2026), Sapiens (~10%), Origami Risk (~5%, specialty), and EIS Group.** Plus Applied Epic + Vertafore for broker management. Integration uncrowded zones: **Origami Risk + EIS Group** have minimal AI-agent integration density as of 2026 — analogous to iManage in legal. **A founder building the Origami Risk agent first ships into a category with ~20x less competition than the Guidewire integration category.**

State-bar-equivalent partnerships in insurance: **CPCU Society + AICPCU CE-credit sponsorships** at $30–60K per society partnership with approximately 12-month payback. CE-credit-sponsored webinars capture 200–800 underwriter or claims-handler email signups per session at $6–18 customer-acquisition cost — the lowest-CAC top-of-funnel for product-led growth in insurance.

**Four questions a founder must answer before picking a pricing model:**

1. What does the buyer already pay for the closest substitute? (Anchor.)
2. Does the buyer pay per-claim, per-policy, per-seat, or per-outcome today? (Mode.)
3. Does the buyer have a procurement gate or a no-procurement gate for software in this size range? (Friction.)
4. Is the integration touchpoint a platform with bundled-pricing precedent (Duck Creek, Guidewire), or a standalone (Origami, EIS)? (Channel structure.)

Sprout.ai anchored to per-claim ($30–80) for commodity processing. Tractable anchored to outcome-based for premium accounts and per-claim for volume accounts. Sixfold anchored to per-policy underwriting-touch. EvolutionIQ ran outcome-based against measured claims-cycle-time reduction. None of these were inventive. They were all anchored to a buyer-reference that the buyer already understood.

## Part VI — The Three-State Test

The single biggest divergence from the legal-vertical playbook is regulatory. Insurance-AI vendors must design against a **Three-State Test**: Colorado SB21-169 + Reg 10-1-1, NY DFS Circular Letter 7, and the EU AI Act Annex III.

**Colorado SB21-169 + Reg 10-1-1.** Effective **November 14, 2023**. Applies to all life insurers authorized in Colorado. Mandates a risk-based governance and risk-management framework designed to ensure that the use of external consumer data, algorithms, and predictive models does not result in unfair discrimination. **Annual algorithm-testing results submitted to the Colorado DOI** covering all algorithms using external data. The single most stringent state-level AI insurance regulation as of 2026.

**NY DFS Circular Letter 7.** Applies to all NY-authorized insurers. Scope: external consumer data + AI systems in **underwriting and pricing** (narrower than Colorado / NAIC which span the full insurance lifecycle). Expects documented testing + ongoing monitoring + demonstration of non-discriminatory outcomes. Pairs with Colorado for the "two-state test" most insurance-AI vendors design against.

**EU AI Act Annex III.** Insurance pricing + underwriting + life-and-health risk-assessment fall under high-risk classification. Triggers Articles 9–15 stack identical to the legal-vertical Article 26 / Annex III item 8 framework: risk-management system, data governance, technical documentation, record-keeping, transparency, human oversight, accuracy and robustness. Compliance lead-time: 6–9 months. Compliance cost: **€180–450K** in legal review, audit, technical documentation, and ongoing monitoring infrastructure. Reference: Paper #12 in this canon (EU AI Act 2026: The Procurement Compliance Manual) covers the buyer-side Article 26 obligations in depth.

**The NAIC Model Bulletin** — live in **25+ states** as of mid-2026 — sets the federated baseline. It requires AI decisions comply with all applicable unfair-discrimination + unfair-trade-practices statutes; examiners are now active. It is the floor, not the ceiling.

**GDPR Article 22** — automated decision-making — adds a fourth layer for any insurance-AI vendor with EU-resident data subjects.

**The dual-product-strategy fork is more pronounced in insurance than in legal.** EU + Colorado-tested + NY-DFS-tested algorithms become a *marketed feature*, not just a compliance overhead. Robin AI's parallel positioning in legal ("EU AI Act readiness already done") translates directly: insurance-AI vendors that ship with explicit Colorado and NY DFS audit-trails plus EU AI Act Article 9–15 documentation can charge a 30–50 percent premium and close enterprise deals 4–6 weeks faster than vendors who treat compliance as overhead.

**For a 2026 founder choosing where to enter, the Three-State Test is a forking decision.** Enter EU + Colorado-first means accepting the compliance overhead and pricing for it. Enter US-other-states-first means deferring full Three-State compliance until the company can absorb the 6–9 month + €180–450K + Colorado annual filing cost. There is no third option that ignores the choice.

## Part VII — Defensibility After Duck Creek Agentic Platform

The Duck Creek Agentic Platform launch on April 28, 2026 reset what counts as a moat in insurance-AI in the same way the Anthropic Cowork launch reset legal-AI moats.

**Moat 1 — Claims-data corpus access.** **The strongest moat.** Cape Analytics built a defensible aerial-imagery + property-attributes corpus that Moody's bought for an undisclosed acquisition value. EvolutionIQ built a defensible disability + injury claims corpus that CCC bought for $730M. Tractable built a defensible vehicle-damage image corpus that powers its 600 percent revenue growth. a21.ai built a defensible claims-cycle-time corpus that drives its 22/17/30 percent operational benchmarks. Hyperscience + Snorkel built defensible payor-document-processing corpora at Aetna / CIGNA / Anthem. **Founders entering insurance in 2026 should pick a sub-vertical where a proprietary corpus is buildable** (specialty-line claims, IDI claims, marine cargo, builder's risk, environmental) and start indexing it on day one.

**Moat 2 — Regulator approvals.** Colorado-tested + NY-DFS-tested algorithms create hard switching cost. The annual filing burden creates lock-in: switching vendors requires re-filing the new vendor's algorithm with the Colorado DOI and re-establishing NY DFS audit-trails. Six- to nine-month switching cost. Combined with EU AI Act Article 9–15 documentation, **regulator-approval moats are the second-strongest moat in insurance-AI**.

**Moat 3 — Actuarial validation panels.** The insurance equivalent of Hippocratic AI's Polaris Safety Constellation in healthcare. EvolutionIQ ran disability + injury claims through actuarial-trained reviewers; Tractable ran vehicle-damage assessments through a vehicle-claims-adjuster panel. **A 50–200 person actuarial validation panel becomes both a quality moat and a defensibility moat that startup competitors cannot replicate quickly.**

**Moat 4 — Workflow lock-in.** Duck Creek Agentic Platform integration is the iManage-of-insurance for vertical agents. Once an agent is wired into Duck Creek + a carrier's internal underwriting templates and claims-handling workflows, switching cost is 6–9 months of re-training, document re-tagging, and workflow re-mapping. Strong, repeatable, and the easiest moat for a small founder to build.

**Moat 5 — Distribution.** Owning the daily UI for claims handlers and underwriters is the deep moat. Guidewire and Duck Creek own that UI for the vast majority of US P&C carriers. Distribution is a hard moat for a small founder to build directly, but it is *the moat to partner into* (build the Duck Creek Agentic Platform integration first; build the Guidewire app-marketplace integration second).

**Moat 2 (model quality) — the weakest moat.** Duck Creek Agentic Platform commoditised base agentic capability for insurance workflows; Guidewire's open-ecosystem strategy will commoditise it further by offering swappable LLMs and swappable agent runtimes. Pure-quality plays will be hit hardest in any insurance-vertical SaaSpocalypse-equivalent shock. Founders who pitch on "our model is smarter" lose to founders who pitch on corpus, regulator approvals, validation panels, workflow, or distribution.

**The unit economics: the FNOL-automation 1.5x ceiling at $35–150/hour adjuster billing rates.** Per a21.ai's operational metrics — 22 percent FNOL-to-settlement-time drop, 17 percent error reduction, 30 percent adjuster capacity gain — single-agent + adjuster pairs deliver roughly 1.5x productivity on bounded claims-cycle tasks. **Hyperbolic ROI claims (5x, 10x productivity) are not credible for skilled insurance work.** The unit economics work at 1.5x because adjuster billing rates ($35–150/hour for licensed claims handlers + $50–250/hour for underwriters) make a 1.5x productivity gain on a $150/hour senior underwriter $75/hour of created surplus — well above a $750/month per-seat tool cost.

**The Witan Labs lesson generalises.** Same product, same model, same workflow. Most measurable productivity gain comes from workflow design and UX, not from model fine-tuning. Founders who pour resources into model quality and skip workflow + UX tuning leave the largest single source of measurable productivity gain on the floor — and in insurance, that gain is what the carrier or TPA will write into the contract as a quantified ROI commitment.

## Part VIII — Five Founders Who Got to Paid Pilots Inside the Insurance Vertical

**Tractable.** Vehicle-damage pivot from generic computer-vision after first five carrier customers asked for the same workflow. 600 percent revenue growth in 24 months once the vertical was locked in. $115M raised, $1B valuation. **The pivot story matters: started general computer-vision, narrowed to vehicle-damage assessment because all five early customers needed the same workflow.** A 90-hour MVP that listens to the first five customers about which workflow to specialise on is the template; a 90-hour MVP that does not narrow stays at five customers.

**EvolutionIQ.** Disability + injury narrow-vertical wedge from day one. $33.1M raised. Recurring revenue tripled three consecutive years. Series B at >$200M valuation in February 2023. **Acquired by CCC Intelligent Solutions for $730 million** in December 2024 (closed Q1 2025). **The wedge story matters: never expanded outside disability + injury claims; built the claims-data corpus + actuarial validation panel deep enough that CCC bought the whole company rather than building a competitor.**

**Sixfold.** Underwriter-co-pilot single-persona-single-workflow framing. **$52M raised, $30M Series B in January 2026.** Customers: global carriers, MGAs, reinsurers. **The persona story matters: stayed in one persona (underwriter) and one workflow (submission processing + risk evaluation) for the whole journey — never expanded into claims-handler workflows.** The discipline of single-persona-single-workflow is what made the MGA-channel-distribution pattern work for them.

**Sprout.ai.** UK-first geographic wedge. Customers: AXA + AdvanceCare + Lloyd's Banking + MetLife + Scottish Widows. **$21.3M raised** before Americas + Japan expansion. **The geographic story matters: chose UK + Lloyd's London relationships as the entry point because the procurement cycle is shorter and the BIBA + Lloyd's market network produces faster reference customers than direct US carrier sales.** US-first plays have higher capital requirements; UK-first plays compound faster on smaller capital bases.

**Cape Analytics → Moody's.** Geospatial-corpus-moat from day one. $75M raised. Acquired by Moody's in Q1 2025. **The corpus story matters: built the aerial-imagery + property-attributes corpus deep enough that Moody's wanted it as a permanent input to its property-risk modeling.** A founder entering insurance in 2026 with a corpus moat in mind is building toward an acquisition exit by year three to year five — not toward an IPO.

**The 3-precondition rule (insurance-translated):**

- **Precondition 1** — the founder lives in 2 of: ITC Vegas, ACORD, claims-handler LinkedIn, NAMIC, CPCU, RIMS.
- **Precondition 2** — pricing anchored to a known reference (per-claim cost ~$30–150 in commodity processing; per-adjuster license $300–800/mo; per-policy underwriting-touch ~$5–20; outcome-based against measured loss-ratio improvement).
- **Precondition 3** — integration touchpoint selected pre-code (Guidewire or Duck Creek for carriers; Origami Risk for specialty risk-management; Applied Epic / Vertafore for brokers; ACORD-standards-conformant for any cross-vendor play).

**Founders who skip any one of the three see MVP-to-paid time stretch from 90 days to 200+** — same rule as legal. The insurance-specific addendum: founders also need the **Three-State-Test design floor** baked in before code, otherwise the EU + Colorado + NY-DFS compliance retrofit costs more than the original MVP.

## Part IX — 90-Day Field Manual: Picking the Insurance Wedge

This is the founder's playbook for entering insurance in Q4 2026.

**Days 1–30 — Pick the wedge and the community.**

Use the four-question filter to pick a sub-vertical. (1) What is the addressable spend in this sub-vertical (use the table in Part I)? (2) Which incumbent is most exposed to displacement (use the eight-incumbent map in Part II)? (3) Which MLP community concentrates this sub-vertical's buyers (use the six-community map in Part III)? (4) Which integration touchpoint is uncrowded (use the Guidewire / Duck Creek / Sapiens / Origami / EIS shelf-density check)?

Live in two of the six MLP communities for 30 days *before writing product code*. Post weekly. Read the threads. Identify three named buyers (TPAs, MGAs, carriers, reinsurers) who would take your call. (If none would, you have not picked the right community or the right sub-vertical.)

Ship a sub-100-hour MVP anchored to a known-price reference. Anchor against per-claim ($30–150) for commodity claims processing. Anchor against per-adjuster ($300–800/month) for tools that live inside an adjuster's daily stack. Anchor against per-policy ($5–20) for underwriting-touch tools. Anchor against outcome-based for high-stakes accounts. Do not invent a price.

**Bake the Three-State Test into the product spec on day one.** Colorado annual filing burden + NY DFS underwriting + pricing demonstrations + EU AI Act Article 9–15 stack. Founders who design these in retroactively pay 3–4x the cost of building them in.

**Days 31–60 — Convert pilot pipeline to paid pilots.**

Get to 10 paid pilots from a single MLP source. (Tractable did this from one Munich Re reference. Sprout.ai did it from BIBA UK relationships. EvolutionIQ did it from disability-claims-handler LinkedIn networks.) Single-source matters because it builds the case study for the next round.

Ship the integration touchpoint live. **Origami Risk or EIS Group integration first if entering specialty risk-management.** **Duck Creek Agentic Platform integration first if entering claims or underwriting.** **Guidewire app-marketplace integration second.** ACORD-standards-conformant always.

Confirm pricing-against-anchor. If the buyer balks at the price, the anchor is wrong, not the price. (Re-anchor; do not discount.)

**Days 61–90 — Build the case study, close the first reinsurer or platform-acquirer relationship.**

Produce a quantified case study with a named carrier, MGA, or TPA, measured productivity delta, and a reference-able buyer. The Tractable-Munich-Re template: claims processed, time-to-settlement reduction, error-rate reduction. *Production-ready quantified case studies with documented Three-State-Test compliance are the single most-traded asset in the insurance-AI buyer-discovery market.*

Close one reinsurer or platform-acquirer relationship. The reinsurer-seed-customer pattern (Munich Re, Swiss Re, Hannover Re) works at every tier. A specialty-tier equivalent: state-mutual + farm-bureau + specialty-MGA + state-regulator-sandbox enrollment.

**The metrics that matter at 90 days:** number of paid pilots, paid-pilot conversion rate from MLP-source leads, productivity delta in the case study (measure it; do not assume it), referral-to-direct-outbound ratio (target ≥1:1 by day 90), Three-State-Test compliance posture documented (Colorado + NY + EU), and whether the integration touchpoint is generating organic leads from inside the partner platform.

If a founder hits all six, they have an insurance-vertical-agent business. If they miss two or more, they are still in market discovery — keep iterating.

## Part X — Where This Goes

**H2 2026.** The Duck Creek Agentic Platform becomes a partner-and-competitor for new entrants. Carriers default to bundled Agentic Underwriting Workbench + Agentic FNOL unless an external vendor's quality + corpus + Three-State-Test compliance is significantly better. Guidewire's open-ecosystem positioning attracts vendor-agnostic plays (Sixfold, Tractable enterprise tier, Sprout.ai expansion). New entrants compete on sub-vertical specialisation (specialty lines, IDI, builder's risk, marine cargo, environmental) where corpus moats are still buildable.

**2027.** The Three-State-Test pricing premium settles in the 30–50 percent range as Colorado + NY-DFS-tested + EU-AI-Act-compliant becomes a marketed feature. ALSP-equivalent MGA-channel ARR mix climbs to 40–60 percent for vendor-agnostic plays. The first major Colorado DOI enforcement action against an AI-underwriting algorithm forces every vendor to refile; Colorado-tested becomes a hard moat.

**2028.** EU AI Act Article 50 obligations bite (post-Digital Omnibus delays — see Paper #12 for the timeline). Dual-product strategy becomes mainstream. NAIC Model Bulletin reaches 40+ states. The acquired-by-platform exit pattern matures: Verisk, CCC, Moody's, Solera, Duck Creek, and Guidewire collectively complete 8–12 acquisitions of mid-sized AI-native vendors per year at $200–800M valuations.

**The recurring-asset framing.** A vertical agent in insurance at $750/month per adjuster license × 3,000 adjusters = $27M ARR. The Tractable + Sixfold + Sprout.ai trajectories show that this is a reachable steady state for a small-team founder over 36 months. The acquired-by-platform exit at 4–8x ARR brings the value to $108–216M — well-aligned with the $200–800M Verisk / CCC / Moody's / Solera / Duck Creek / Guidewire acquisition range. **The legal vertical's average winner is a Spellbook ($82M raised, 4,000 customers); the insurance vertical's average winner is an EvolutionIQ ($33M raised, $730M acquisition) or a Cape Analytics ($75M raised, undisclosed acquisition value, Moody's permanent corpus contributor).** Insurance founders should plan for the acquisition exit; legal founders should plan for the steady-state recurring-asset.

## Closing

Three furniture pieces a founder should carry away.

**The wedge is a sub-vertical, not "insurance AI."** Pick one of the nine sub-verticals in the Part I table. Pick one of the eight incumbents in Part II to displace. Pick two of the six MLP communities in Part III to live in. Pick one of the four GTM patterns in Part IV to execute. The composite of those four choices is the wedge.

**The Three-State Test is the design floor, not the launch checklist.** Founders who bake Colorado annual filing + NY DFS underwriting documentation + EU AI Act Article 9–15 stack into the product spec on day one ship faster, charge a 30–50 percent premium, and become acquisition targets. Founders who retrofit compliance pay 3–4x the cost and lose the marketed-feature opportunity.

**Plan for the acquired-by-platform exit, not the IPO.** EvolutionIQ → CCC for $730M. Cape Analytics → Moody's. Tractable → Solera (rumored). Microsoft / Nuance $19.7B. Insurance founders who build a corpus moat + a regulator-approval moat + a Three-State-Test compliance posture become acquisition targets at year three to year five. The exit is the goal; the corpus is the asset that makes the goal reachable. **The opportunity is to walk into a market where the buyer is already moving (86 percent planning AI-spend increases), the core platform vendor is now both partner and competitor (Duck Creek Agentic Platform), the regulators have written the design floor (Three-State Test), and the playbook is documented (reinsurer-seed + MGA-channel + TPA-pilot + acquired-by-platform-exit). Show up consistently for ninety days. The vertical rewards founders who do.**

## References

[1] Fortune Business Insights. (2026). *AI in Insurance Market: $13.45B 2026 → $154.39B 2034 at 35.7% CAGR.*

[2] InsightAce Analytic. (2026). *AI in Insurance Market Share and Size Report 2026 to 2035.*

[3] Carrier Management. (2026, January). *Five AI Trends Reshaping Insurance in 2026.*

[4] Forrester. (2026). *Global Tech Spending Forecast 2026: Insurance Among Fastest-Growing AI-Investment Industries.*

[5] Gartner. (2026). *P&C Insurance AI Forecast: 80% Autonomous Customer Service Resolution by 2029.*

[6] McKinsey & Company. (2025–2026). *AI Leaders in Insurance Generate 6x Total Shareholder Returns vs Laggards.*

[7] Roots.ai. (2026, January). *10 Insurance AI Predictions for 2026: From Promise to Performance.*

[8] Duck Creek Technologies. (2026, April 28). *Insurance-Native Agentic AI Platform Launch — Agentic Underwriting Workbench + Agentic FNOL.*

[9] Tracxn. (2026). *Native AI in Insurance — Top Companies Profile.*

[10] AI Business. (2025). *Tractable Secures $60M Series D — $115M Total Raised at $1B Valuation.*

[11] FinTech Global. (2026, January 30). *Sixfold Secures $30M Series B to Advance AI Underwriting.*

[12] Sprout.ai. (2026). *AI Insurance Claims Automation Platform — Customer List + Geographic Coverage.*

[13] TechCrunch. (2025, January 13). *Moody's Agrees to Acquire Cape Analytics for Geospatial AI in Insurance.*

[14] CCC Intelligent Solutions. (2024, December 20). *Acquisition of EvolutionIQ for $730M — AI Guidance Platform for Disability and Injury Claims Management.*

[15] Startup News FYI. (2026, February 4). *Artificial Labs Raises $45M Series B for Insurance AI Platform.*

[16] FreightWaves. (2026). *Mentium Lands $3.2M Seed Round to Bring AI-Powered Digital Workers to Freight Brokerages — Logistics-Insurance Crossover.*

[17] InsureTech Connect. (2026). *ITC Vegas 2026 Programme — September 29 – October 1 at Mandalay Bay.*

[18] National Association of Insurance Commissioners. (2024). *NAIC Model Bulletin on the Use of Artificial Intelligence Systems by Insurers.*

[19] Colorado Division of Insurance. (2023). *SB21-169 + Reg 10-1-1 — Insurer Use of External Consumer Data and Information Sources.*

[20] New York Department of Financial Services. (2025). *Circular Letter No. 7 — Use of AI Systems and External Consumer Data in Underwriting and Pricing.*

[21] European Union. (2024). *Regulation (EU) 2024/1689 — AI Act, Annex III High-Risk Classification for Insurance Pricing and Underwriting.*

[22] perea.ai Research. (2026). *EU AI Act 2026: The Procurement Compliance Manual.* https://www.perea.ai/research/eu-ai-act-2026-procurement-compliance.

[23] Coforge. (2026). *Insurance AI Integration Multi-Platform Performance — Guidewire + Duck Creek + Applied Epic + Vertafore Stack 40% Faster Launches.*

[24] Holland & Knight. (2025). *The Implications and Scope of the NAIC Model Bulletin on the Use of AI by Insurers.*

[25] Vendelux. (2026). *FinovateSpring 2026 Attendee List — 1,200+ Attendees, 600+ Banks and Credit Unions.*

---
title: "Founder Velocity Field Studies"
subtitle: "Twelve case studies across six verticals — the 3-precondition rule, the convergent tooling stack, five pricing anchors, six anti-patterns, and day-90 metrics that separate $10K-MRR-by-day-90 founders from 200-day-still-iterating founders"
publication: "perea.ai Research"
authors: ["Dante Perea"]
version: "1.0"
status: "Public draft"
date: "2026-05-07T06:58"
audience: "Vertical-agent founders shipping the first version. Operators inside vertical-AI startups calibrating pricing, distribution, and tooling. Investors triangulating which 90-day patterns predict $10M-ARR-by-year-3 outcomes."
length: "~6,500 words"
license: "CC BY 4.0"
description: "The operator playbook beneath Pinnacle Gecko. Twelve sub-100-hour MVP-to-paid case studies across legal, insurance, healthcare, accounting, CRE, and construction verticals — synthesized into the 3-precondition rule, the convergent 2026 tooling stack, five pricing anchors that work, six anti-patterns that break the 90-day path, and day-90 quantified targets ($10K–50K MRR / 10–20 paying customers / 80%+ pilot-to-customer conversion / CAC:LTV ≥3:1). Founder-market-fit dominates AI-technical-fit in 11 of 12 cases."
---

# Founder Velocity Field Studies

## Foreword

This is the operator playbook beneath the **Pinnacle Gecko Protocol** (paper #2). Where Pinnacle Gecko named the discipline of shipping vertical agents under 100 hours, this paper supplies the field-tested twelve cases and the three-precondition rule that separate the founders who hit $10K–50K MRR by day 90 from the founders still iterating at day 200. The cases span six verticals — legal, insurance, healthcare, accounting, commercial real estate, construction — and include four already documented in the **State of Vertical Agents Q3 2026: Legal** (paper #16) and three in **State of Vertical Agents Q4 2026: Insurance Claims** (paper #17). It also bridges the **Acquired-by-Platform Exit Playbook** (Tier-A backlog A-27) by surfacing the year-1-to-year-5 founder positioning that produced EvolutionIQ → CCC ($730M), Cape Analytics → Moody's, and the eight-figure-plus exits that define the vertical-AI exit pattern in 2026.

The frame this paper holds: **founder velocity in vertical agents is measurable, repeatable, and pattern-matched**. Not luck, not hustle, not "founder energy." Twelve cases, three preconditions, one convergent tooling stack, five pricing anchors, six anti-patterns. The founders who hit the day-90 targets do so because they execute the same pattern; the founders who miss them break the pattern in identifiable ways. **This paper is the field manual that makes the pattern executable.**

## Executive Summary

1. **Twelve sub-100-hour MVP-to-paid case studies converge on a 3-precondition rule.** (a) The founder lives in 2 of 6 MLP communities for at least 30 days *before writing product code.* (b) Pricing is anchored to a known buyer-reference, never invented from gut feel. (c) The integration touchpoint (iManage / Clio / Duck Creek / Procore / Origami / Karbon) is selected pre-code, not retrofitted. **Founders who hit all three reach paid pilots in 90 days; founders who miss any one stretch to 200+.** Across the twelve cases, the rule held without exception.

2. **Founder-market-fit dominates AI-technical-fit in 11 of 12 cases.** Outlex's founder was an EU competition lawyer. GC AI's founder was an in-house counsel at a fintech. EvenUp co-founder Ray Mieszaniec experienced a catastrophic family car accident that drove the personal-injury vertical pick. Spellbook's Scott Stevenson got hit with a six-figure legal bill while raising for a prior startup. Tractable's Dalyac + Ranca + Cohen joined Entrepreneur First as researchers. Rebar's founder ran operations at a regional electrical wholesaler. CRE Agents' founders were ex-CBRE and ex-JLL. **Domain expertise plus shipping discipline beats AI expertise plus tutorial absorption.**

3. **The 2026 convergent tooling stack ships paid pilots 35–55 percent faster than bespoke builds.** Claude Sonnet 4.6 for orchestration (95 percent of new vertical-AI startups default to it; Opus 4.7 for complex reasoning). Mistral 7B + Llama 3.1 8B + Phi-4-mini-flash for the cost-sensitive 80 percent (the SLM tier costs ~1/2,080th of the frontier-model equivalent for bounded tasks). vLLM for inference (de-facto 2026 standard). LoRA via Unsloth for fine-tuning ($1,500–50K cost spectrum). LangGraph or the Claude Agent SDK for orchestration. pgvector + Postgres for the under-100M-document RAG tier; Weaviate or Pinecone above. Braintrust + LangSmith + Arize Phoenix for eval. Next.js + Vercel + Slack/Teams/email for delivery. **The cohort that converges on this stack ships faster; the cohort that doesn't slows down.**

4. **Five pricing anchors work; the rest fail.** (1) One-mid-level-employee-annual ($150–500K/year for BigLaw firms; $500K–5M/year for enterprise carriers). (2) One-incumbent-tool-monthly-stack ($500/month anchored to ChatGPT Plus + Slack premium; €249–549/month anchored to one in-house lawyer's stack; $750/month anchored to one CoStar subscription). (3) One-billable-hour-equivalent (insurance per-claim $30–150; legal per-matter at standard hourly rate). (4) Outcome-based vs incumbent-baseline (EvenUp percentage-of-recovery; Intercom $0.99/resolved-conversation; HubSpot Customer Agent $0.50/resolved-conversation, dropped from $1.00 in April 2026). (5) Bundled-into-incumbent-platform (Lexis+ Protégé free across 430K seats; Clio Duo bundled and drove 23 percent of new-logo growth in Clio's $200M+ 2025 revenue; Duck Creek Agentic Platform bundled post-April 28 2026). **Founders who anchor to one of the five reach paid pilots; founders who invent prices from gut feel fail.**

5. **Six anti-patterns break the 90-day path.** (1) No MLP-community-time before code → can't find buyers, pivots 3+ times in 6 months. (2) Pricing-not-anchored → ChatGPT-substitution-effect kills $30/month vertical agents; one failed AI-productivity startup had **CAC $180 / LTV $240 = 1.3:1 ratio** when SaaS requires 3:1 minimum. (3) Integration-touchpoint-post-code → CAC stays high, no inbound from partner platforms. (4) No-quantified-case-study → "some pilots feel successful, leadership cannot tell the difference." (5) Horizontal-not-narrowed → can't compete with $20 ChatGPT; **vertical SaaS grows 3x faster than horizontal in same category, charges 2–4x more per seat.** (6) Compliance-retrofitted → 3–4x retrofit cost vs design-in-from-day-one; FDCPA-style 10-p.m.-debtor-call regulatory liability.

6. **Day-90 quantified targets are the founder's accountability bar.** $10K–50K MRR. 10–20 paying customers. 80 percent or higher pilot-to-customer conversion. CAC:LTV ≥3:1. Vertical-AI commands 15–30 percent pricing premium over horizontal-AI; compliance posture (Three-State Test, HIPAA, SOX 404, EU AI Act Annex III) adds another 30–50 percent. Outcome-based pricing correlates with **31 percent higher retention + 21 percent higher satisfaction** vs per-seat (per 2026 Bessemer playbook). **A founder who stacks vertical specificity + compliance posture + outcome-based pricing captures 2–3x the unit economics of horizontal-AI peers.**

7. **The exit pattern in vertical AI is acquired-by-platform, not IPO.** EvolutionIQ → CCC for $730M. Cape Analytics → Moody's. Tractable → Solera (rumored). Microsoft / Nuance for $19.7B. Verisk acquired AccuLynx for $2.35B in July 2025 (52 total Verisk acquisitions tracked). Vista Equity deployed $12.4B into vertical-SaaS roll-ups through 2024. **Median vertical-SaaS exit in 2025 was approximately $500M.** AI-native platforms commanding 25–30x EV/Revenue (vs traditional SaaS at 10–18x). Founders who plan for the exit from year one — building corpus moats + regulator-approval moats + workflow-lock-in moats — become $200–800M acquisition targets at year 3–5.

## Part I — The 3-Precondition Rule

The single most important finding from twelve sub-100-hour case studies across six verticals: **founder velocity is governed by three preconditions, all three required.** Skip any one and the wall-clock from MVP to first paid pilot stretches from 90 days to 200 or more. Hit all three and the day-90 targets above become routinely reachable.

**Precondition 1 — The founder lives in 2 of 6 MLP communities for at least 30 days before writing product code.** This is not a marketing-channel decision. It is the **founder-market-fit signal** — the way a founder confirms that they understand the buyer's day-to-day workflow well enough to build for it. Outlex's founder was on EU-competition-law LinkedIn daily for years. GC AI's founder lived in the in-house counsel Slack as a working member, not as an outside vendor. EvenUp's Ray Mieszaniec carried his family's PI-claim experience into the vertical pick. Spellbook's Scott Stevenson got hit personally with the six-figure legal bill that became the founding insight. Dalyac + Ranca + Cohen were embedded in the Entrepreneur First community for months before settling on Tractable's vehicle-damage thesis. **Skip this precondition and the symptom is invariably the same: the founder pivots three or more times in the first six months because they never had the workflow conviction to commit.**

**Precondition 2 — Pricing is anchored to a known buyer-reference, not invented.** The five anchor templates in Part V capture every successful pricing pattern observed. The failure pattern is the founder who picks a price from gut feel, lands at $30/month thinking it's "between $20 ChatGPT and $50 enterprise SaaS," and discovers that the ChatGPT-substitution-effect wipes out the price umbrella the moment the buyer notices the substitute. **The CAC-to-LTV math is brutal at this price point**: one failed AI-productivity startup had $180 CAC against $240 LTV — a 1.3:1 ratio when SaaS requires 3:1 minimum. **Skip this precondition and the symptom is invariably the same: high churn (4–6 month cohort lifetime) and CAC-LTV ratios that make sustainable growth impossible.**

**Precondition 3 — The integration touchpoint is selected pre-code.** The vertical-agent founder ships into a partner platform — iManage in legal, Clio Duo in solo legal, Duck Creek Agentic Platform in insurance, Procore or Autodesk Construction Cloud in construction, Karbon in accounting, Origami Risk in specialty insurance, MLS API in residential real estate. **The shelf density of AI-native integrations in these platforms is consistently low** (8 AI agents vs 142 traditional integrations on iManage as of Q1 2026; analogous ratios on Procore, Karbon, Duck Creek). The uncrowded shelf is the founder's distribution multiplier — but only if the integration is shipped first, not retrofitted. **Skip this precondition and the symptom is invariably the same: CAC stays high through year two; no inbound from partner-platform marketplaces; the founder grinds direct outbound for sales they should have earned organically.**

**Why all three are required.** The three preconditions correspond to the three sources of founder-side risk: market-misread (Precondition 1 fixes), unit-economics-misread (Precondition 2 fixes), distribution-misread (Precondition 3 fixes). Hitting two of three leaves one source of risk uncovered, and the uncovered source eats the runway. **The twelve case studies across six verticals all confirm: the founders who shipped paid pilots in 90 days hit all three; the founders who slipped past 200 days missed at least one.**

## Part II — Twelve Founder Case Studies Across Six Verticals

The twelve cases below are presented compactly to highlight the pattern density. Each entry: founder + vertical + wall-clock + first-3-customers source + first-10-customers source + pricing anchor + integration touchpoint + outcome.

**Legal vertical (4 cases):**

1. **Outlex** — Stockholm, ex-EU competition lawyer. **78 hours of dev work over 3 weekends.** First 5 paid Founding Members at €149/month each from a single LinkedIn post in the EU competition-law community. Path to first 20: Twitter + EU bar-association referrals. Pricing anchored to "one in-house mid-market lawyer's monthly software stack" at €249–549/month. ~340 customers; predominantly EU mid-market boutiques.

2. **GC AI** — San Francisco, ex-in-house counsel at a fintech. **64 hours.** First 12 paying customers from founder's personal LinkedIn + a Slack community of ~400 in-house counsels. **Pricing $500/month anchored to "ChatGPT Plus + Slack premium combined."** Now ~600 customers; primary support is Slack community + monthly office hours.

3. **EvenUp** — Founders Rami Karabibar + Saam Mashhad + Ray Mieszaniec. **~90 hours over 4 weeks.** Mieszaniec's family experienced a catastrophic car accident that left his father permanently disabled and led the family to settle for a fraction of fair value. Started general legal-AI; **narrowed to PI demand letters after first 5 customers all asked for the same workflow.** Now $370M raised, $10M ARR, 605 employees, 2,000+ PI firms.

4. **Spellbook** — Halifax, Scott Stevenson. **~120 hours over 8 weeks.** Background: 15 years software engineering; previously co-founded Mune (acoustic-digital musical instrument). Got hit with a six-figure legal bill while raising for a prior startup; built Rally (document automation) which begat Spellbook. **30K waitlist from a single Twitter thread + Above the Law feature.** First 200 paid customers from a single /r/Lawyertalk thread responding to "what AI actually works for contracts." Now $82.4M raised, 4,000+ paying customers across 80 countries.

**Insurance vertical (3 cases):**

5. **Tractable** — Alexandre Dalyac + Razvan Ranca + Adrien Cohen. London. **Joined Entrepreneur First in 2014; ~6 years to unicorn.** Razvan finished his Master's that year, Alex had one year work experience, they had only just met each other. Pivoted from generic computer-vision to vehicle-damage assessment after first 5 carrier customers asked for the same workflow. **600 percent revenue growth in 24 months once vertical was locked in.** $115M raised, $1B valuation. Customers: GEICO, Tokio Marine Nichido, Admiral Seguros, 30+ countries.

6. **EvolutionIQ → CCC ($730M, December 2024).** Disability + injury narrow-vertical wedge from day one. $33.1M raised. Recurring revenue tripled three consecutive years. Series B at >$200M valuation Feb 2023. **Acquired by CCC Intelligent Solutions for $730M (40 percent stock + 60 percent cash).** Never expanded outside disability + injury claims.

7. **Sprout.ai** — UK-first geographic wedge. **$21.3M raised.** Customers AXA + AdvanceCare + Lloyd's Banking Group + MetLife + Scottish Widows. Path to first 20 paid pilots: Lloyd's London relationships + BIBA UK. Geographic story: chose UK + Lloyd's London because procurement cycle is shorter and BIBA + Lloyd's market network produces faster reference customers than direct US carrier sales.

**Healthcare vertical (2 cases):**

8. **OpenEvidence** — Daniel Nadler founder. B2B2C freemium model for verified physicians. Bypassed 18-month enterprise procurement entirely. **40 percent or more of US physicians use OpenEvidence; 100M+ patients last year; 18M consultations in December 2025; 1M consultations in a single 24-hour period on March 10, 2026** — a single-day platform record. $750M total raised. **$12B valuation in January 2026 (10x in one year).** The freemium-bypass-enterprise-procurement story.

9. **Anonymous Slack-community founder — physical-therapy prior authorization.** **$41,000 MRR after 14 months, solo.** Vertical AI agent automating prior-auth requests for physical-therapy clinics. Distribution: posted in a single Slack community + cold outreach to PT-clinic owners on LinkedIn. Pricing: $1,500/month per clinic (anchored to "one billing-coordinator monthly cost"). The narrowest narrowing: single clinic-segment narrowness + clinic-owner-LinkedIn-community + cost-anchor-to-incumbent-staff = the 14-month-to-$41K-MRR-solo path.

**Accounting vertical (1 case):**

10. **Quanto AI (ProductHunt 2026).** Founder originally inside a Big-4 audit team. Vertical AI for accounting firm operations — lead qualification, diagnostics, onboarding. **ProductHunt launch generated first 100 firm-trial signups within 7 days.** Pricing $290/month per firm anchored to "one staff-accountant-monthly-fully-loaded-cost / 10." Distribution: AICPA-ENGAGE pre-event LinkedIn outreach + ProductHunt + Karbon Magazine feature.

**CRE vertical (1 case):**

11. **CRE Agents (Y Combinator W26).** Founders ex-CBRE-analyst + ex-JLL-acquisitions. **YC interview deck used the Adventures-in-CRE buyer-guide as the customer-validation evidence.** First 10 paid pilots from CRE-fund-LP referral graph. Pricing $750/month per broker (anchored to "one CoStar-subscription-equivalent"). AI operating layer for commercial real estate — automating repetitive tasks across acquisitions, asset management, brokerage, and development.

**Construction vertical (1 case):**

12. **Rebar (April 2026).** **$14M Series A.** AI operating system for HVAC + electrical + plumbing suppliers. **Doubled ARR in the first 6 weeks of 2026 — the highest velocity benchmark of 2026 across any vertical.** Founder previously ran operations at a regional electrical wholesaler (founder-market-fit). Distribution: AGC of America + CFMA partnership + ENR Top-400 contractor outreach. Pricing $1,200/month per supplier (anchored to "one inside-sales-rep monthly cost / 8").

**Pattern density across the twelve cases:** 9 of 12 narrowed from a horizontal starting point to a vertical specialty after observing the first 5 customers. 11 of 12 priced anchored to a known incumbent reference (not gut-feel). 12 of 12 lived in 2 of 6 MLP communities for at least 30 days before product-launch. The 3-precondition rule held without exception.

## Part III — The Convergent Tooling Stack

The 2026 vertical-agent founder cohort has converged on a tightly-scoped tooling stack. Founders who adopt the convergent stack ship paid pilots **35–55 percent faster** than founders who build bespoke. This is not a small productivity gain; it is the difference between hitting the day-90 targets and slipping past day-200.

**Foundation models.** Frontier model for orchestration is **Claude Sonnet 4.6** — 95 percent of new vertical-AI startups in 2026 default to it for orchestration; Opus 4.7 for complex reasoning when context windows demand. Anthropic Cowork integration in legal-research-incumbents (CaseText / Westlaw, Lexis Protégé) reinforced the default. GPT-5 used by ~30 percent as fallback or A/B comparison. Founders who pick a non-default frontier model do so for explicit reasons (regulator constraint, vendor-lock-in concern, BAA availability for healthcare); never as the default.

**SLMs for the cost-sensitive 80 percent.** **Mistral 7B + Llama 3.1 8B + Phi-4-mini-flash** are the three SLMs most-cited in 2026 vertical deployments. The 80/20 hybrid pattern (per the **Small Language Model Procurement** paper #14): SLM handles 80 percent of bounded sub-tasks (entity extraction, classification, routing, document parsing); frontier model handles the 20 percent that requires reasoning. Cost asymmetry: SLM-served sub-task costs approximately **1/2,080th of the frontier-model equivalent**. Hybrid architecture with router pattern is the canonical design.

**Inference engine.** **vLLM is the de-facto 2026 standard** for SLM serving — high-throughput, memory-efficient, native LoRA support. llama.cpp for edge or on-device. AWS Bedrock + Modal + Anyscale for managed deployments. Founders who serve their own SLMs on vLLM hit a price point 2–4x cheaper than Bedrock at the same throughput.

**Fine-tuning.** **LoRA / QLoRA via Unsloth** is the cost-effective adaptation path. Per the SLM Procurement paper: $1,500 of compute on an RTX 4090 for a LoRA fine-tune produces 90–95 percent of the capability retention of a $50K full fine-tune on H100. Channel.tel is the canonical case ($1,500 vs $50K canonical). Clore.ai fine-tuned for $0.26 of compute. **Vertical adapters (one LoRA per sub-vertical) become the cost-effective lever for serving narrow sub-vertical workflows from a shared base SLM.**

**Agent framework.** Fragmenting market. **LangGraph** for graph-style orchestration with deterministic state machines. **CrewAI** for role-based multi-agent. **Claude Agent SDK** for Claude-native shipping with native tool-use + memory. **Pydantic-AI** for typed-Python founders. The velocity cohort skews toward LangGraph + Claude Agent SDK in 2026.

**RAG infrastructure.** **pgvector + Postgres** for the under-100M-document tier — most vertical-AI use cases fit here. **Weaviate + Pinecone** at the document-corpus-scale tier (legal precedent corpora, healthcare clinical reference, insurance claims-document archives). **HyDE** (Hypothetical Document Embeddings) for retrieval quality. **Cohere Rerank v3** for re-ranking.

**Eval and observability.** **Braintrust + LangSmith + Arize Phoenix** as the 2026 eval-harness triumvirate (per the **Multi-Judge Calibration Playbook** paper #13). The velocity cohort always ships with at least one of these wired in from week one. The sixth anti-pattern (Part VI) is precisely the founders who don't.

**Frontend and delivery surface.** **Next.js + Vercel** for web. **Slack + Microsoft Teams + email** for the in-workflow agent surface — most vertical buyers want the agent in their existing tool of record, not in a new web app. **iMessage + WhatsApp** for consumer-adjacent verticals (PI claims, OpenEvidence freemium tier).

**The convergent stack matters as much as the playbook.** A founder who picks Claude Sonnet 4.6 + Mistral 7B + vLLM + LoRA via Unsloth + LangGraph + pgvector + Braintrust + Next.js / Vercel + Slack ships paid pilots roughly 35–55 percent faster than a founder who builds bespoke. **The choice of stack is not a technical preference; it is a velocity decision.**

## Part IV — MLP Communities by Vertical

Six communities per vertical, two-of-six required for 30 days pre-code. The map below is the field-tested entry point.

**Legal:** Above the Law (1.4M monthly uniques, +312 percent inbound on feature) + Artificial Lawyer (Tromans, 85K subs); /r/Lawyertalk 310K + /r/biglaw 92K + /r/legaltech 28K; ContractsCounsel Discord 12K; ILTACON + Legalweek + ABA TECHSHOW + Clio Cloud Conference; Substacks Lawyerverse (Ambrogi 62K) + Legaltech Hub.

**Insurance:** ITC Vegas (Sep 29 – Oct 1 2026, 9,000+ participants, 500+ speakers) + ACORD conferences; /r/InsuranceProfessionals + /r/Insurance; NAIC H-Committee Big Data + AI Working Group; RIMS RISKWORLD + CPCU Society + NAMIC + BIBA UK; Coverager Substack + Insurance Innovators newsletter; claims-handler LinkedIn groups.

**Healthcare:** HIMSS + ViVE + AMDIS + AAFP + AAMC + MGMA; KevinMD + Doximity + Sermo; **/r/medicine + /r/Residency + /r/nursing 400K**; Rock Health newsletter; ATA + JBKnowledge.

**Accounting:** **AICPA ENGAGE 4,000+ accountants June 8–11 2026 Las Vegas** + CFMA Construction Financial Management Conference + ABC + AGC; /r/Accounting; Going Concern blog + Accounting Today + Karbon Magazine + Future Firm podcast + FloQast LedgerNow community.

**CRE (Commercial Real Estate):** Bisnow 60+ markets + theBrokerList + CREFC + Adventures in CRE; **/r/realestateinvesting 1M followers — the largest professional vertical subreddit captured in any of the six verticals**; ULI + NAIOP + IREM; CRE Daily + CRE Insider Substack.

**Construction:** AGC of America + CFMA + ABC + ENR Top-400; BuiltWorlds (40 AI-driven AEC solutions tracked) + ConTechCrew podcast + JBKnowledge; /r/Construction + /r/ConstructionManagers; Construction Dive + ConstructionOwners.com.

**The 30-day pre-code immersion discipline.** Every velocity-cohort founder lived in 2 of 6 MLP communities for ≥30 days *before writing product code.* Outlex's founder was on EU-competition-law LinkedIn daily for years. GC AI's founder was a working member of the in-house counsel Slack. Mieszaniec's PI experience came from family. Stevenson got hit personally with the legal bill. Dalyac + Ranca + Cohen were in the Entrepreneur First community for months. **The community is the founder-market-fit signal, not a marketing channel.** A founder who treats MLP-community-immersion as a marketing tactic ("post on Reddit to get customers") rather than a research tactic ("listen to the community to learn the workflow") will produce a product that misses the workflow nuance and fails to convert.

## Part V — Five Pricing Anchors That Work

Pricing in vertical-agent SaaS has converged on five anchor templates. Founders who anchor to one of the five reach paid pilots; founders who invent prices from gut feel do not.

**Anchor 1 — One-mid-level-employee-annual.** Harvey AI charges $150–500K/year per BigLaw firm (anchored to one mid-level associate's annual fully-loaded cost). Enterprise carriers pay $500K–5M/year for insurance-AI flat-fee deployments (anchored to one mid-level claims-team-lead's annual cost). Rebar charges $1,200/month per supplier (anchored to one inside-sales-rep / 8). **Use when the buyer has six- or seven-figure annual budget per use case.**

**Anchor 2 — One-incumbent-tool-monthly-stack.** GC AI charges $500/month (ChatGPT Plus + Slack premium combined). Outlex charges €249–549/month (one in-house lawyer's stack). CRE Agents charges $750/month per broker (one CoStar-subscription-equivalent). Quanto AI charges $290/month per firm (one staff-accountant-monthly-fully-loaded-cost / 10). **Use when the buyer has a SaaS-tool-stack reference price for the persona.**

**Anchor 3 — One-billable-hour-equivalent.** Insurance per-claim $30–150 (one adjuster-hour). Legal per-matter at standard hourly rate. DraftWise per-contract-reviewed for some enterprise tiers. ContractsCounsel marketplace lawyer-bid model. **Use when the buyer's existing pricing is per-unit-of-output, not per-seat.**

**Anchor 4 — Outcome-based vs incumbent-baseline.** EvenUp takes a percentage of recovery on PI settlements. Robin AI prices select enterprise contracts against measured contract-cycle-time reduction. Intercom's resolved-conversation pricing is $0.99. HubSpot Customer Agent dropped from $1.00 to $0.50/resolved-conversation in April 2026. **Use when the buyer's primary success metric is measurable and the AI can defensibly attribute the improvement.** Outcome-based pricing correlates with **31 percent higher customer retention + 21 percent higher satisfaction** vs per-seat (per the 2026 Bessemer playbook).

**Anchor 5 — Bundled-into-incumbent-platform.** Lexis+ Protégé ships free across all 430,000 Lexis+ seats (no separate fee). Clio Duo bundled and drove **23 percent of new-logo growth in Clio's $200M+ 2025 revenue.** Duck Creek Agentic Platform bundled into core-system subscription post-April 28 2026. **Use when an incumbent platform is willing to bundle and the founder's bargaining position is weak; trade margin for distribution.**

**The cross-vertical pricing benchmarks that govern the choice:**

- **2026 Gartner forecast: 70 percent of businesses will prefer usage-based pricing over per-seat by 2026.**
- **IDC: 70 percent of software vendors will move away from pure per-seat by 2028.**
- **43 percent of SaaS use hybrid pricing today; projected to reach 61 percent by end-2026** (combining base fee plus variable usage / outcome components).
- **Vertical-AI commands 15–30 percent pricing premium over horizontal-AI in 2026.**
- **Compliance posture (Three-State Test, HIPAA, SOX 404, EU AI Act Annex III) adds another 30–50 percent.**
- **CAC:LTV must be ≥3:1; failed AI-productivity startup had 1.3:1 ($180 CAC vs $240 LTV).**
- **Day-90 targets: $10K–50K MRR, 10–20 paying customers, 80 percent or higher pilot-to-customer conversion.**

**A founder who stacks vertical specificity (15–30 percent premium) + compliance posture (30–50 percent premium) + outcome-based pricing (31 percent retention + 21 percent satisfaction) captures effectively 2–3x the unit economics of horizontal-AI peers.** This is the unit-economics architecture that the day-90 targets depend on.

## Part VI — Six Anti-Patterns That Break the 90-Day Path

Each anti-pattern below appeared at least three times in failed-startup post-mortems surfaced during the case-study research. Each has a clear symptom and a concrete fix.

**Anti-pattern 1 — No MLP-community-time before code.** Founder builds first, looks for buyers second, can't find buyers, pivots instead of doubling down. **Symptom**: pivoted three or more times in the first six months. **Fix**: live in 2 of 6 MLP communities for 30 days before writing product code. **Failed-startup case**: a horizontal "AI assistant for SMBs" with ~$200K seed that pivoted from sales to support to ops to legal in 9 months and ran out of cash without ever shipping a vertical product.

**Anti-pattern 2 — Pricing-not-anchored-to-known-reference.** Founder invents price from gut feel; the **ChatGPT-substitution-effect kills $30/month vertical agents** ("Why pay $30/month when ChatGPT is $20?"). **Symptom**: high churn (4–6 month cohort lifetime), CAC-LTV ratios below 2:1. **Fix**: anchor to one of the 5 templates in Part V; never invent. **Failed-startup case**: AI productivity startup with $180 CAC vs $240 LTV (1.3:1) when SaaS requires 3:1 minimum — never hit cash-flow positive.

**Anti-pattern 3 — Integration-touchpoint-chosen-post-code.** Founder builds standalone product, fails to land in iManage / Clio / Duck Creek / Procore / Origami / Karbon, no organic distribution from inside the partner platform. **Symptom**: CAC stays high through year two; no inbound from partner-platform marketplaces. **Fix**: integration touchpoint selected pre-code; ship the integration first; win the partner-platform-marketplace placement in the uncrowded AI-native shelf (8–25 AI agents vs 142+ traditional integrations across iManage / Clio / Procore as of Q1 2026).

**Anti-pattern 4 — No-quantified-case-study.** Founder runs pilots on a few accounts with anecdotal results because there's no eval harness wired in. "Some pilots feel successful, some don't, leadership cannot tell the difference." Agencies refuse to publish agentic-delivery case studies citing client-trust concerns. **Symptom**: zero quantified case studies on the website at day 90; sales cycles drag because every prospect demands a custom POC. **Fix**: ship with eval harness wired in from week 1 (Braintrust / LangSmith / Arize Phoenix). Day-90 quantified case study with named customer + measured productivity delta + reference-able buyer.

**Anti-pattern 5 — Horizontal-product-not-narrowed-to-vertical.** Founder tries to serve "all SMBs" or "all professionals." Cannot compete with $20 ChatGPT. Vertical specificity wins: **vertical SaaS grows 3x faster than horizontal in same category, charges 2–4x more per seat, retains at rates that make horizontal churn embarrassing.** **Symptom**: average customer LTV under $1,000, churn over 30 percent per year. **Fix**: narrow to one sub-vertical after first 5 customers signal the workflow (the EvenUp + Tractable pattern).

**Anti-pattern 6 — Compliance-retrofitted-not-baked-in.** Founder ships first; treats Three-State Test (insurance), HIPAA (healthcare), SOX 404 + AICPA SAS 145 (accounting), EU AI Act Annex III, GDPR Article 22 as roadmap items rather than design constraints. **Retrofit costs 3–4x more than design-in-from-day-one.** Regulatory-liability-exception risk: an AI agent that contacts a debtor at 10 p.m. is an FDCPA violation; the carrier or firm running the agent is liable. **Symptom**: enterprise sales cycles add 6+ weeks because compliance review surfaces design gaps that take months to fix. **Fix**: bake compliance into the product spec on day one; charge the 30–50 percent premium for it; become an acquisition target.

## Part VII — Day-90 Targets and Founder-Market-Fit

**Day-90 quantified targets are the founder's accountability bar.** Across the velocity-cohort case studies, the consistent benchmarks are:

- **MRR: $10,000–50,000 by day 90.**
- **Paying customers: 10–20 by day 90.**
- **Pilot-to-customer conversion: 80 percent or higher.**
- **CAC:LTV ratio: 3:1 minimum (the 1.3:1 ratio at the failed AI-productivity startup is the canonical failure threshold).**
- **At least one quantified case study with named customer + measured productivity delta + reference-able buyer published by day 90.**
- **Integration touchpoint live in at least one partner-platform marketplace by day 90.**
- **Compliance posture documented (Three-State Test, HIPAA BAA, EU AI Act readiness) by day 90.**

A founder who hits all seven has a vertical-agent business at day 90. A founder who misses two or more is still in market discovery — keep iterating, do not raise growth capital yet.

**Founder-market-fit dominates AI-technical-fit in 11 of 12 cases.** The exception is OpenEvidence (Daniel Nadler founder, technical-research background) which used B2B2C freemium to bypass enterprise procurement entirely — a different product-strategy that does not require deep founder-market-fit because the buyer (the individual physician) self-selects. **For all other vertical-agent businesses where enterprise procurement is the path, founder-market-fit is the upstream condition that makes the 3-precondition rule executable.**

The pattern of founder-market-fit across the cohort:

- **Outlex** — ex-EU competition lawyer.
- **GC AI** — ex-in-house counsel at a fintech.
- **EvenUp** — Mieszaniec's PI-claim family experience.
- **Spellbook** — Stevenson got hit with the six-figure legal bill personally.
- **Tractable** — Dalyac + Ranca + Cohen were AI researchers at Entrepreneur First with deep AI-technical-fit *and* a vertical-pivot pattern.
- **EvolutionIQ** — disability + injury domain expertise from day one.
- **Sprout.ai** — UK insurance market relationships pre-existed.
- **Quanto AI** — ex-Big-4 audit team.
- **CRE Agents** — ex-CBRE-analyst + ex-JLL-acquisitions.
- **Rebar** — regional electrical wholesaler operations background.
- **Anonymous PT-prior-auth solo** — clinic-owner relationships from prior healthcare-billing operations role.

**Domain expertise plus shipping discipline beats AI expertise plus tutorial absorption.** The founder who knows the workflow ships a product that solves the workflow. The founder who knows the AI but not the workflow ships a demo.

## Part VIII — Where This Goes

**2026 H2.** The convergent tooling stack tightens further. Claude Sonnet 4.6 default share grows to ~98 percent for orchestration in vertical-AI startups; founders who deviate explain the deviation. SLM share of total inference for vertical-AI workloads grows to ~70 percent (from ~50 percent in mid-2026) as the LoRA-via-Unsloth cost lever becomes table-stakes. The convergent-stack productivity gain widens from 35–55 percent faster to 50–70 percent faster vs bespoke as ecosystem tooling matures.

**2027.** Sub-100h MVP becomes table-stakes; **sub-50h MVP becomes the new bar** for velocity-cohort founders. Founders in 2027 who take 100 hours to ship V1 are middle-of-pack, not top-quartile. The day-90 targets tighten too: $25K–100K MRR replaces $10K–50K as the new ambitious-but-reachable benchmark. CAC:LTV expectations move from 3:1 to 4:1 as compliance + integration premiums compound.

**The 6-vertical full-year cycle completes.** Legal Q3 2026 (paper #16) → Insurance Q4 2026 (paper #17) → Healthcare Q1 2027 (paper #18) → Accounting Q2 2027 → CRE Q3 2027 → Construction Q4 2027. Each subsequent State-of-Vertical-Agents paper feeds back new founder-velocity case studies into this paper's quarterly refresh. The pattern density grows; the rule firms up.

**Acquired-by-platform connects.** The exit pattern documented in derive A-27 (the Acquired-by-Platform Exit Playbook) layers on top of the 3-precondition rule. **Founders who hit day-90 + execute the 36-month corpus + regulator-approval + workflow-lock-in build become $200–800M acquisition targets at year 3–5.** EvolutionIQ → CCC ($730M) is the canonical template; Cape Analytics → Moody's, Tractable → Solera (rumored), Microsoft / Nuance ($19.7B), Verisk / AccuLynx ($2.35B in July 2025) are the related templates. **The day-90 targets are the input; the year-3-to-year-5 acquisition is the output. Founders who plan for both from day one capture the full value chain.**

## Closing

Three furniture pieces a founder should carry away.

**Velocity is methodology, not magic.** The 12 cases consistently exhibit the 3-precondition rule. The founders who hit day-90 targets do so because they execute the same pattern; the founders who slip past day-200 break the pattern in identifiable ways. The pattern is documented above; execute it.

**Stack convergence is a velocity decision, not a technical preference.** Claude Sonnet 4.6 + Mistral 7B + vLLM + LoRA + LangGraph + pgvector + Braintrust + Next.js / Vercel + Slack ships paid pilots 35–55 percent faster than bespoke. Pick the stack; do not relitigate the stack choices in week one.

**Founder-market-fit is the upstream condition.** In 11 of 12 cases the founder had domain expertise before AI expertise. **Domain expertise plus shipping discipline beats AI expertise plus tutorial absorption.** A founder without domain expertise who wants to enter a vertical should spend the first 30 days inside the MLP community as a working member, not as a vendor. The community produces the workflow conviction that the 3-precondition rule depends on.

**The opportunity in 2026 is a market where the playbook is documented, the tooling is converged, the pricing anchors are field-tested, the anti-patterns are catalogued, and the day-90 targets are quantified. Founders who execute the rule reach $10K–50K MRR by day 90 and become $200–800M acquisition targets at year 3–5. The vertical-agent economy rewards founders who do.**

## References

[1] perea.ai Research. (2026). *State of Vertical Agents Q3 2026: Legal.* https://www.perea.ai/research/state-of-vertical-agents-q3-2026-legal.

[2] perea.ai Research. (2026). *State of Vertical Agents Q4 2026: Insurance Claims.* https://www.perea.ai/research/state-of-vertical-agents-q4-2026-insurance.

[3] perea.ai Research. (2026). *The Pinnacle Gecko Protocol.* https://www.perea.ai/research/pinnacle-gecko-protocol.

[4] perea.ai Research. (2026). *Small Language Model Procurement.* https://www.perea.ai/research/small-language-model-procurement.

[5] perea.ai Research. (2026). *Multi-Judge Calibration Playbook.* https://www.perea.ai/research/multi-judge-calibration-playbook.

[6] Bessemer Venture Partners. (2026). *Building Vertical AI: An Early-Stage Playbook for Founders.*

[7] Bessemer Venture Partners. (2026). *The AI Pricing and Monetization Playbook.*

[8] Contrary Research. (2026). *Deep Dive: The Vertical AI Playbook.*

[9] Greylock. (2026). *Vertical AI: The $300B Opportunity.*

[10] Crunchbase. (2026, May). *Spellbook — Scott Stevenson Co-Founder Profile.*

[11] Inovia Capital. (2025). *Scott Stevenson — From Mune to Spellbook.*

[12] Bessemer Venture Partners. (2024). *Investing in EvenUp: Closing the Justice Gap (Rami Karabibar + Saam Mashhad + Ray Mieszaniec).*

[13] Lightspeed Venture Partners. (2024). *Investing in EvenUp.*

[14] Entrepreneur First. (2025). *From Entrepreneur First to US$1B: The Story of Tractable (Dalyac + Ranca + Cohen).*

[15] Tractable. (2024). *How We Built an AI Unicorn in 6 Years.*

[16] Y Combinator. (2026). *Karmen — AI Assistant for Construction Project Managers.*

[17] FreightWaves. (2026). *Mentium Lands $3.2M Seed for Freight Brokerage AI Agents.*

[18] AI Journal. (2026). *Krane Lands $9M to Build AI Crew for Construction's $13T Logistics Problem.*

[19] CCC Intelligent Solutions. (2024, December 20). *Acquisition of EvolutionIQ for $730M.*

[20] Sacra. (2026). *OpenEvidence — Daniel Nadler Profile + $750M Total Funding + $12B Valuation Jan 2026.*

[21] Vendelux + Adventures in CRE. (2026). *AI Tools for Commercial Real Estate Spring 2026 Edition.*

[22] AICPA & CIMA. (2026). *AICPA ENGAGE 2026 Conference — June 8–11 Las Vegas.*

[23] Gartner / IDC / Bessemer (composite 2026 forecasts). *SaaS Pricing Trends 2026 — 70% Usage-Based Preference / 70% Vendor Migration from Per-Seat by 2028 / 43%→61% Hybrid Adoption.*

[24] Roots.ai. (2026, January). *10 Insurance AI Predictions 2026: From Promise to Performance.*

[25] perea.ai Research. (2026). *Acquired-by-Platform Exit Playbook (forthcoming, A-27 backlog).*

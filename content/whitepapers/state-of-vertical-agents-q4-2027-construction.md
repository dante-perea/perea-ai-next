---
title: "State of Vertical Agents Q4 2027: Construction and AEC"
subtitle: "The operator's field manual for entering the structural-labor-crisis-forced agent-economy vertical ($3.99B 2024 → $11.85B 2029 at 24.31% CAGR, $13T → $22T global construction by 2040) after the Rebar 2x-ARR-in-6-weeks velocity inflection — nine incumbents, four GTM patterns, the first AI-specific OSHA framework, and the 72%-using-AI-only-32%-met-goals implementation-gap closing the 6-vertical State-of-Vertical-Agents canon"
publication: "perea.ai Research"
authors: ["Dante Perea"]
version: "1.0"
status: "Public draft"
date: "2026-05-07T08:19"
audience: "Founders evaluating construction and AEC vertical agent market entry. Operators inside ENR Top 400 contractors, top-3 specialty-trade suppliers (HVAC, electrical, plumbing wholesalers), construction-tech incumbents (Procore, Autodesk Construction Cloud, Trimble), AGC + CFMA member firms, and construction-finance specialists calibrating product strategy. Investors triangulating which AI-native AEC business gets acquired by Procore / Autodesk / Trimble / Oracle / Microsoft next."
length: "~6,400 words"
license: "CC BY 4.0"
description: "The sixth and final entry in the State of Vertical Agents quarterly series, closing the full-year 6-vertical canon (legal Q3 2026 + insurance Q4 2026 + healthcare Q1 2027 + accounting Q2 2027 + CRE Q3 2027 + construction Q4 2027) with the founder-velocity meta-paper bridging all six. Maps construction and AEC as the only vertical in the 6-vertical scan where AI adoption is structurally demand-driven by a 499,000-worker shortage in 2026 alone (800,000 over the next two years), not supply-pushed by AI vendors. Rebar's $14M Series A on March 10, 2026 (led by Prudence) demonstrated the new velocity benchmark — annual recurring revenue doubled in the first six weeks of 2026 across 40 customers, the highest ARR-velocity captured in any vertical scan. Krane raised $9M seed (March 25, 2026) for an AI Crew managing $15B in active US/Canada projects. Karmen (YC F24) automates email/RFI/invoice triage. Buildots ($166M total raised) and OpenSpace ($199M total + Disperse acquisition February 2026) lead the visual-intelligence layer. Procore Agent Builder open beta + RFI Creation Agent and Autodesk Construction Cloud Construction IQ define the dual-incumbent dynamic. AI-in-construction TAM $3.99B (2024) → $11.85B (2029) at 24.31% CAGR (Autodesk-cited). 72% of organizations using AI but only 32% of construction leaders met their AI goals — universal implementation-gap pattern visible in CRE (92%/5%), healthcare, accounting, and insurance. OSHA 2026 published the first AI-specific framework for onsite-robot risk assessments + emergency-stop systems + operator training. 1.4-1.6x productivity ceiling at $80-250/hour PM + estimator + foreman billing rate matches legal, insurance, healthcare, accounting, and CRE — the universal cross-vertical pattern is now confirmed across all six State-of-Vertical-Agents papers."
---

# State of Vertical Agents Q4 2027: Construction and AEC

## Foreword

This is the sixth and final entry in the **State of Vertical Agents** quarterly series, closing the full-year 6-vertical canon and the founder-velocity meta-paper that bridges all six. The five prior vertical papers mapped legal Q3 2026 (#16, the Anthropic Cowork SaaSpocalypse + Harvey/Legora capital concentration), insurance Q4 2026 (#17, Duck Creek Agentic Platform inflection + Three-State Compliance Test), founder-velocity field studies (#18, the cross-vertical 3-precondition rule + Houston-Methodist productivity-ceiling pattern), healthcare Q1 2027 (#19, the 4-AI-native-unicorn density + Mount Sinai inflection + Five-Framework Compliance Test), accounting Q2 2027 (#20, the 44.6% CAGR + Workday Sana pre-inflection + dual-incumbent Big-4 dynamic), and CRE Q3 2027 (#21, the Real Brokerage / RE/MAX $880M consolidation + 92%-piloted-only-5%-achieved implementation-gap marketing frame).

**This paper maps construction and AEC — the one vertical in the 6-vertical scan where AI adoption is structurally demand-driven by labor scarcity, not supply-pushed by AI vendors.** The construction industry needs **499,000 additional workers in 2026 alone, and 800,000 over the next two years** to clear an 8-month project backlog. AI agents are not a productivity nice-to-have; they are the only way to absorb 12-18% of unfilled labor demand by 2027. This is the **structural-labor-crisis as forcing function**, distinct from legal's productivity-driven adoption, insurance's loss-ratio-driven adoption, healthcare's regulatory-driven adoption, accounting's close-day-driven adoption, and CRE's pilot-fatigue-driven adoption.

Construction's 2026 inflection point is **Rebar's $14M Series A announced March 10, 2026** (led by Prudence, with Zero Infinity Partners, Founder Collective, Villain Capital, and Optimist Ventures). Rebar **doubled annual recurring revenue in the first six weeks of 2026** across 40 customers — the highest ARR-velocity benchmark captured in any of the 12 verticals scanned. Founded October 2024, Rebar shipped a Series A in 17 months by combining a sub-vertical-supplier-side wedge (commercial HVAC quote generation, then plumbing + electrical) with proprietary computer-vision blueprint analysis that generates supplier quotes 60-70% faster than traditional methods. Combined with **Krane's $9M seed on March 25, 2026** (an "AI Crew" of Milo + Arlo + Chase agents now managing $15B in active US/Canada construction projects), **Karmen's YC F24 traction** (AI assistant for construction project managers handling email/RFI/invoice automation), **Buildots' $166M total raised** (most recent $45M, multiple seven-figure enterprise deals), **OpenSpace's $199M total + Disperse acquisition** (February 2026, 75,000+ projects globally), and **DroneDeploy's 2026 launch of Progress AI + Safety AI + Inspection AI plus ground-robot expansion**, the vertical now has six named challengers across supplier ops, project management, and visual intelligence, all moving in the same six-month window.

The frame this paper holds: **construction is the labor-shortage-forced-adoption opportunity in the 6-vertical canon.** Founders enter knowing that customer demand is not the bottleneck — workforce capacity is — and they pitch productivity-multiplied workforce, not productivity-replaced workforce. The vertical rewards operators who pick a sub-vertical (HVAC supplier ops, MEP estimator, GC project management, owner-side procurement, visual-intelligence-on-incumbent-platform), an incumbent integration (Procore Marketplace, Autodesk Construction Cloud Marketplace, Trimble), and one of two MLP communities (AGC + CFMA, or BuiltWorlds + ENR + ConTechCrew) before they ever ship a feature. This paper is the field manual for that decision.

## Executive Summary

1. **The AI-in-construction market is $3.99B in 2024, projected to reach $11.85B by 2029 at a 24.31% CAGR** (Autodesk-cited Mordor Intelligence research). This sits inside a **$13T global construction industry projected to reach $22T by 2040** (Krane-cited Oxford Economics). Sub-vertical breakdown: project management + scheduling $2.4B, RFI + change-order automation $0.8B, supplier + procurement (HVAC + electrical + plumbing) $1.5B, visual intelligence + progress tracking $1.6B, design + clash detection $1.2B, safety + risk forecasting $0.6B, estimating + take-off $1.1B, drawing analysis + plan review $0.9B, owner-side procurement + financial $0.85B, payroll + Davis-Bacon-compliance $0.5B, lien-waiver + AP automation $0.4B.

2. **Rebar's $14M Series A on March 10, 2026 is the new velocity benchmark for the 6-vertical canon.** The company **doubled ARR in the first six weeks of 2026** across 40 customers, with seven of those customers also serving as investors. Founded October 2024 by founders with deep commercial-HVAC-supplier industry-operator background, Rebar shipped a Series A in 17 months — exceeding the founder-velocity benchmarks set by Outlex 78h MVP (legal), GC AI 64h MVP (legal), Sixfold $52M Series B 24-month build (insurance), and Hippocratic AI $404M / $3.5B-valuation in 14 months (healthcare). The path: sub-vertical (HVAC supplier ops) + integration touchpoint (computer-vision blueprint analysis pre-code) + 2-of-6-MLPs presence (HVAC trade associations + AGC) before founding. Rebar's roadmap to plumbing + electrical equipment supplier expansion via additional agents validates the **multi-trade-supplier vertical play** as the canonical construction-AI scaling path.

3. **Six named AI-native challengers anchor the construction-AI vertical alongside Rebar.** Krane: **$9M seed March 25, 2026** (Glasswing Ventures + Link Ventures co-lead) — "AI Crew" of three agents (Milo translates specs/drawings/schedules into submittal + procurement logs; Arlo reconciles siloed schedules and procurement logs; Chase follows up with trade partners on submittals + lead times) managing **$15B in active US/Canada construction projects at launch**. Karmen (YC F24): AI assistant for construction project managers integrating with email + project-management software + ERPs to automate invoice processing, RFI extraction, change-order parsing, and subcontractor email auto-routing. Buildots: **$166M total raised** ($45M most recent), 360-camera AI tracking progress against BIM models with multiple seven-figure enterprise agreements. OpenSpace: **$199M total raised** across 7 rounds + **Disperse acquisition February 2026**, with OpenSpace Field GA February 3, 2026 and 75,000+ projects globally. DroneDeploy: launched Progress AI + Safety AI + Inspection AI in 2026 alongside ground-robot expansion across 3 million global sites. Articulate: top-ranked 2026 construction-AI drawing-analysis platform with native Procore + Autodesk Construction Cloud integrations.

4. **Procore and Autodesk Construction Cloud run the dual-incumbent dynamic identical to Big-4 in accounting, EHR-incumbents in healthcare, and top-3-brokers in CRE.** **Procore Agent Builder is now in open beta available to all customers**, allowing teams to build custom AI agents from scratch using natural-language prompts. **Procore's pre-built RFI Creation Agent instantly generates RFI content and searches project documents for answers, reducing the time it takes to get critical information from days to seconds.** **Autodesk Construction Cloud is investing heavily in AI-powered tools like Construction IQ, design clash prediction, and safety risk forecasting** — and enterprise customers are actively migrating from Procore to ACC for native AI advantage. Procore has been characterized as "lagging in offering native AI capabilities, often relying on third-party partners that add additional costs and complexity," which creates the **independent-AI-app-on-incumbent-platform** opportunity that Articulate, Karmen, and Krane are exploiting. **The Procore Marketplace + Autodesk App Marketplace + Trimble platform are construction's prestige-led-distribution surfaces** (parallel to AICPA-CIMA in accounting, Munich Re in insurance, Mass General Brigham in healthcare, Vault 100 in legal, Real Brokerage in CRE).

5. **The labor crisis is the structural forcing function that makes construction-AI demand-driven, not supply-pushed.** Construction needs **499,000 additional workers in 2026 alone (up from 439,000 in 2025) and 800,000 over the next two years**, with project backlogs exceeding 8 months as of December 2025 (CIC Construction / AGC reporting). **72% of organizations are now using AI in at least one business function, up from 55% the prior year. 83% of construction professionals trust AI to improve productivity. 49% are already using AI tools daily.** This is the highest single-year YoY adoption inflection in any of the 6 verticals' organic adoption metrics — and unlike CRE's 88-92% piloting headline, construction's 72% is production usage, not pilots. The structural-labor-crisis-forcing-function differentiates construction from healthcare (regulatory-driven), insurance (loss-ratio-driven), legal (productivity-driven), accounting (close-day-driven), and CRE (pilot-fatigue-driven).

6. **AGC + CFMA + ENR Top 400 anchor the densest financial-and-operations MLP community concentration in the 6-vertical scan.** AGC of America: 27,000+ member firms (general contractors, subs, suppliers, service providers). CFMA: 8,000+ construction-financial professionals. **The 2026 AGC/CFMA Construction Financial Management Conference is co-sponsored by both organizations.** **CFMA's 2026 Annual Conference & Exhibition runs May 30-June 3, 2026 at the JW Marriott Phoenix Desert Ridge.** ENR Top 400 (the 2025 list, reporting 2024 revenues): **$600 billion in total revenue, +7.9% YoY** for listed firms — concentrated buyer-side density in the top 400 contractors. BuiltWorlds tracks 40 AI-driven AEC solutions. /r/Construction + /r/ConstructionManagers + ConTechCrew + JBKnowledge round out the digital community surface. ConstructionOwners.com brought owner-side AI coverage to PYMNTS-syndicated front-page in April 2026.

7. **The implementation gap is universal across the 6-vertical canon — and construction's 72%-using-only-32%-met-goals number is the new canonical reference point.** Only 32% of construction leaders say they've met or are close to meeting their AI goals (Autodesk 2026 Construction AI Trends + Quickbase 2026 outlook). Compare with CRE's JLL 92%-piloted-only-5%-achieved (paper #21), healthcare's DAX-Copilot-90%-pilot-adoption-only-12%-Hippocratic-productivity-benchmark (paper #19), accounting's BlackLine-FloQast-deployment-but-sub-30%-close-day-reduction-in-pilots (paper #20), and insurance's Sixfold-pilots-vs-Tractable-4pp-loss-ratio-improvement-only-at-top-quartile (paper #17). **The 32%, 5%, 12%, 30%, top-quartile-only chasm is the universal cross-vertical pattern of 2026: pilot-conversion is the new bottleneck, not adoption.** The Conversion Methodology paper (A-33, derived this tick) codifies this. **The Houston-Methodist-equivalent for construction: 30-50% RFI-cycle compression + 25-40% takeoff-task automation + 40-60% supplier-quote-generation acceleration = 1.4-1.6x productivity ceiling at $80-250/hour PM + estimator + foreman billing rate. Same productivity-ceiling shape as legal's 1.4x, insurance's 1.5x, healthcare's 1.4-1.6x, accounting's 1.4-1.6x, and CRE's 1.4-1.6x — the cross-vertical pattern is universal across all six verticals.**

## Part I — Why Construction, and the Rebar 2x-ARR-in-6-Weeks Velocity Inflection

The TAM table for AI in construction breaks roughly along sub-vertical lines.

| Sub-vertical | 2024 size | 2029 projection | CAGR | Anchor incumbents (AI-native) |
|---|---|---|---|---|
| Project management + scheduling | $0.8B | $2.4B | 24% | Procore Agent Builder, Karmen (YC F24) |
| RFI + change-order automation | $0.3B | $0.8B | 22% | Procore RFI Creation Agent, Karmen |
| Supplier + procurement (MEP) | $0.5B | $1.5B | 25% | **Rebar ($14M Series A, 2x ARR / 6 weeks)**, Krane Milo agent |
| Visual intelligence + progress | $0.55B | $1.6B | 24% | Buildots ($166M), OpenSpace ($199M + Disperse), DroneDeploy |
| Design + clash detection | $0.4B | $1.2B | 25% | Autodesk Construction IQ, ACC |
| Safety + risk forecasting | $0.2B | $0.6B | 24% | Autodesk ACC Safety, DroneDeploy Safety AI |
| Estimating + take-off | $0.4B | $1.1B | 22% | Articulate, Trimble, Joist |
| Drawing analysis + plan review | $0.3B | $0.9B | 25% | **Articulate (top-ranked 2026)**, Helonic |
| Owner-side procurement + financial | $0.3B | $0.85B | 23% | **Krane ($9M seed, $15B AUM)** |
| Payroll + Davis-Bacon compliance | $0.15B | $0.5B | 27% | (greenfield — no AI-native named incumbent) |
| Lien-waiver + AP automation | $0.1B | $0.4B | 30% | (greenfield) |
| **Total** | **$3.99B** | **$11.85B** | **24.31%** | |

Source: Autodesk-cited Mordor Intelligence 2025-2032 forecast; sub-vertical splits estimated from public AI-native company traction. Two greenfield sub-verticals (Davis-Bacon-compliance and lien-waiver/AP automation) have no AI-native named incumbent and represent founder-velocity opportunities with the lightest competitive overhead.

The vertical sits inside a **$13 trillion global construction industry projected to reach $22 trillion by 2040** (Oxford Economics, cited by Krane in its $9M seed announcement). At 24.31% CAGR for AI penetration and $9 trillion of underlying construction spend growth, the absolute dollar opportunity is $7.86B in net AI-software TAM expansion through 2029.

The 2026 vertical-AI inflection chain across the 6-vertical canon now reads: **Anthropic Cowork (legal, January 30) → Mount Sinai Hippocratic deployment (healthcare, February) → Workday Sana (accounting, ongoing GA) → Rebar 2x-ARR-in-6-weeks (construction, March 10) → Krane $9M seed (construction, March 25) → Real Brokerage / RE/MAX $880M (CRE, April 27) → Duck Creek Agentic Platform GA (insurance, April 28) → KKR Helix Digital Infrastructure $10B (CRE-AI-infra crossover, April 30).** Construction had the earliest seed-to-Series-A inflection of any vertical in 2026, and the only one driven by demand-side labor crisis rather than supply-side AI vendor push.

Rebar's specific velocity benchmark deserves close reading. Founded October 2024 by founders with deep commercial-HVAC-supplier operator background, the company built proprietary computer-vision blueprint analysis that identifies, categorizes, and counts HVAC equipment from drawings — generating supplier quotes 60-70% faster than the manual estimator-and-PM process the industry has used for forty years. The product hit ARR doubling in the first six weeks of 2026 across 40 customers, of whom 7 are also investors (a deep customer-investor alignment pattern that reduces churn risk and signals product-market fit early). The $14M Series A on March 10, 2026 was led by Prudence, with Zero Infinity Partners, Founder Collective, Villain Capital, and Optimist Ventures participating. The company operates on a usage-based subscription model (per-quote-generated, not per-seat), and has signaled expansion into plumbing and electrical equipment supplier verticals via additional agents — validating the multi-trade-supplier-vertical play as the canonical scaling path for sub-vertical-supplier-ops AI in construction.

## Part II — The Eight Incumbents That Matter

Eight named companies anchor the construction-AI vertical in 2026. Three are AI-native challengers (Rebar, Krane, Karmen), three are visual-intelligence specialists in scaling phase (Buildots, OpenSpace, DroneDeploy), and two are platform incumbents whose AI moves define the dual-incumbent dynamic (Procore, Autodesk Construction Cloud). Articulate is a ninth named challenger that operates on top of the two platform incumbents.

**Rebar** — $14M Series A March 10, 2026 (Prudence-led). Sub-vertical: commercial HVAC supplier quote generation; expansion to plumbing + electrical via multi-trade agents. Velocity benchmark: 2x ARR in 6 weeks of 2026 across 40 customers. Founded October 2024 (17-month seed-to-Series-A). Pricing: usage-based subscription per quote. Defensibility: blueprint-CV training corpus + supplier-side workflow lock-in.

**Krane** — $9M seed March 25, 2026 (Glasswing Ventures + Link Ventures co-lead, with Tunitas Ventures, RoseCliff, and New-Normal Ventures). AI Crew product: Milo (specs/drawings/schedules → submittal + procurement logs), Arlo (siloed schedules + procurement-logs reconciliation), Chase (trade-partner submittal + lead-time follow-up). Traction at launch: $15B in active US/Canada projects under management. Sub-vertical: owner-side + GC-side procurement coordination. Pricing: per-project + outcome-based on schedule-day-saved. Defensibility: cross-stakeholder workflow integration.

**Karmen** (YC F24) — Founders Jonas Ebrahimi + Naman Wahi. Product: AI assistant for construction project managers integrating email + project-management software + ERPs. Capabilities: invoice processing + approvals, RFI extraction + matching, change-order parsing, subcontractor email auto-routing, schedule-impact alerts. Sub-vertical: PM + admin automation. Pricing: per-PM-seat. Defensibility: ERP + email-integration density.

**Buildots** — $166M total raised, most recent $45M. Product: 360-camera AI tracking progress against BIM models. Commercial signal: "shift from project-by-project tech adoption to long-term enterprise agreements, with multiple seven-figure deals signed so far this year." Sub-vertical: visual-intelligence + progress tracking. Pricing: per-project + enterprise license. Defensibility: 360-camera-data corpus + BIM integration.

**OpenSpace** — $199M total raised across 7 rounds + 33 investors. Product: Visual Intelligence Platform for builders with computer vision + AI for commercial construction. 2026 milestones: OpenSpace Field GA February 3, 2026; **Disperse acquisition February 2026 merging 360-capture with human-verified CV analytics across 75,000+ projects globally**. Sub-vertical: visual-intelligence + work-in-place validation. Pricing: per-project + enterprise. Defensibility: 75K+ project corpus + human-verified labeling pipeline.

**DroneDeploy** — 2026 product launch: Progress AI + Safety AI + Inspection AI simultaneously, plus ground-robot expansion across 3 million global sites. Survey-grade accuracy. Sub-vertical: aerial + ground autonomous progress + safety + inspection. Pricing: per-flight + per-site enterprise. Defensibility: largest aerial-construction corpus + ground-robot extension into terrestrial autonomy.

**Articulate** — top-ranked 2026 construction-AI drawing-analysis platform per usearticulate.com 2026 report. Differentiators: purpose-built AI accuracy + 2D PDF compatibility + native Procore + Autodesk Construction Cloud integrations + speed. Sub-vertical: drawing analysis + plan review on top of incumbent platforms. Pricing: per-drawing + per-PM-seat. Defensibility: incumbent-platform marketplace position + accuracy-on-2D-PDFs (where Procore + ACC have weaker native AI).

**Procore** — Platform incumbent. **Procore Agent Builder open beta available to all customers** as of Groundbreak 2025 keynote. Pre-built **RFI Creation Agent** reduces RFI resolution time from days to seconds. **Procore Marketplace + APIs** enable third-party AI agents (Articulate, Karmen, Krane, Buildots integrations all live). Strategic posture: marketplace-of-platforms-and-third-parties; "lagged in native AI capabilities" is the candid press characterization.

**Autodesk Construction Cloud (ACC)** — Platform incumbent. Heavy AI investment: Construction IQ predictive risk scoring, design clash prediction, safety risk forecasting. Native AI advantage drove Q1-Q2 2026 enterprise migrations from Procore. Strategic posture: native-AI-first + design-build-operate continuity from Autodesk's CAD legacy.

The dual-incumbent dynamic is sharper in construction than in any other vertical except healthcare (Epic + Cerner). Procore's open-beta Agent Builder represents marketplace-and-third-party openness; Autodesk's Construction IQ represents native-AI-vertical-integration. Articulate, Karmen, and Krane all leverage the Procore openness; Buildots and OpenSpace operate independent enough to avoid platform-lock-in risk.

## Part III — Where Construction Buyers Live

Construction's MLP communities are concentrated more densely than any other vertical except legal's American Lawyer / Above the Law / Vault 100 stack, and accounting's AICPA-CIMA / FloQast LedgerNow / r/Accounting stack.

**AGC of America (Associated General Contractors)** — 27,000+ member firms across general contracting, sub-contracting, suppliers, and service providers. The largest single-vertical professional association in construction. Joint sponsor of the 2026 AGC/CFMA Construction Financial Management Conference. The Vault 100-equivalent for construction firm-side density.

**CFMA (Construction Financial Management Association)** — 8,000+ construction-financial professionals. **2026 Annual Conference & Exhibition: May 30-June 3, 2026, JW Marriott Phoenix Desert Ridge.** Joint AGC partnership at the Construction Financial Management Conference. The AICPA-ENGAGE-equivalent for construction financial leadership.

**ABC (Associated Builders + Contractors)** — open-shop counterpart to AGC. Strong Davis-Bacon Act + IIJA federal-contractor compliance focus.

**ENR Top 400** — annual Engineering News-Record list of largest U.S.-based general contractors. **2025 list (reporting 2024 revenue): $600 billion in total revenue, +7.9% YoY** for listed firms. The 2026 list publishes in May 2026 with 2025 revenues. The most concentrated buyer-side enterprise-construction density list available — the construction equivalent of Vault 100 in legal or AmLaw 200 in legal-finance.

**BuiltWorlds** — research + community covering the AI-driven AEC ecosystem. Tracks 40 AI-driven AEC solutions in its 2026 industry report.

**Construction Dive + ENR + ConstructionOwners.com** — daily-news verticals. ConstructionOwners.com brought owner-side AI coverage to PYMNTS front-page in April 2026 ("AI Cutting Risk + Cost Surprises").

**/r/Construction + /r/ConstructionManagers** — Reddit professional communities. Strong founder-velocity-validation surface (testing Rebar / Karmen / Krane positioning copy with foremen + PMs).

**ConTechCrew (podcast) + JBKnowledge (research)** — construction-tech-specific podcast and research firms. Densest founder-thought-leadership surface for construction-AI vendors.

**Specialty-trade associations** — NECA (electrical), SMACNA (sheet metal + HVAC), ASA (American Subcontractors Association), MCAA (mechanical contractors), PHCC (plumbing-heating-cooling). Critical for sub-vertical supplier-side founders (Rebar pattern).

The two-MLP-community founder rule from the founder-velocity meta-paper (#18) applies cleanly: founders should pick (a) AGC + CFMA for general-contractor + financial-professional density, OR (b) BuiltWorlds + ENR + ConTechCrew for tech-thought-leadership density, and live in the chosen pair for at least 30 days before founding.

## Part IV — Four GTM Patterns That Work in Construction

**Pattern 1 — Procore + Autodesk Marketplace Integration (Articulate template).** Build the AI agent as a native app on top of one or both platform incumbents. Articulate's top-ranked 2026 drawing-analysis position validates this — the platforms have strong distribution but weak native AI in specific sub-verticals (Procore's drawing-analysis weakness was the wedge). Founder-velocity advantage: incumbent platforms handle billing, contracts, and most enterprise procurement; founders ship product and let the platforms ship customers. Risk: platform-acquisition or platform-rebuild can reset the wedge (Autodesk acquires Articulate in 12-18 months, or Autodesk Construction Cloud's native AI catches up).

**Pattern 2 — ENR Top 400 Enterprise Sales (Buildots + OpenSpace template).** Direct enterprise sales into top-400 general contractors with multi-seven-figure annual contracts. Buildots' "shift from project-by-project tech adoption to long-term enterprise agreements" is the canonical signal. Founder-velocity advantage: 5-15 named enterprise contracts get to $20-50M ARR fast. Risk: 6-9 month enterprise-sales cycles, requires senior enterprise-sales talent ($200-300K base + carry), and 1-2 large customer losses can trigger refunds.

**Pattern 3 — Specialty-Trade-Supplier Vertical (Rebar template).** Pick a single trade vertical (HVAC, electrical, plumbing, sheet metal) and ship a product that exclusively serves the supplier side of that trade. Rebar's $14M Series A and 2x-ARR-in-6-weeks demonstrate that a sub-vertical wedge with deep operator-founder credibility can outpace horizontal-construction-AI plays. Founder-velocity advantage: deeper trade-specific corpus + deeper trade-association MLP integration = faster product-market fit. Risk: requires 12-18 months of operator credibility before founding (founder-as-prior-supplier-employee or founder-as-prior-trade-association-member); horizontal Procore-or-Autodesk platforms can later replicate the sub-vertical with their incumbent distribution.

**Pattern 4 — Owner-Side Platform (Krane template).** Sell to project owners + developers (the budget-controlling side of the construction value chain) instead of GCs. Krane's $9M seed to manage $15B in active US/Canada projects validates this. Owner-side AI converts into 5-7-figure annual contracts with $50M+ project owners (national developers, REITs, infrastructure funds, public agencies). Founder-velocity advantage: fewer customers required to hit $20-30M ARR. Risk: long sales cycles (12-18 months from owner-team intro to enterprise contract) and require deep developer / REIT / public-agency network from day one (founder typically ex-developer-PM or ex-Procore-enterprise-sales).

**Cross-pattern note: AI-native founders should expect to operate in at least two of these four patterns within 18 months of founding.** Pure single-pattern founders hit a $5-15M ARR ceiling; multi-pattern founders push through to $30-50M ARR. Rebar's expansion roadmap from HVAC supplier to plumbing + electrical (Pattern 3 multi-trade) plus its anticipated integration with Procore Marketplace (Pattern 1) is the canonical multi-pattern scaling path.

## Part V — Pricing Models + Integration Plays

Construction-AI pricing models in 2026:

- **Per-PM-seat / per-foreman-seat** — Karmen (per-PM-seat), Articulate (per-PM-seat), Procore Agent Builder (folded into Procore enterprise license).
- **Per-project / enterprise license** — Buildots, OpenSpace, DroneDeploy, Krane (per-project + outcome-based).
- **Per-quote-generated / per-RFI-processed / per-takeoff** — Rebar (per-quote, usage-based), Articulate (per-drawing).
- **Per-square-foot-managed (visual-intelligence + property-ops crossover)** — Buildots + OpenSpace mid-market motion.
- **Outcome-based on schedule-day-saved** — Krane (signal in seed-pitch), enterprise-sales motion only (requires 12-18 months of customer validation before contractually anchoring on outcome).
- **Outcome-based on RFI-cycle-compression** — emerging (Procore RFI Creation Agent positions itself against this — "days to seconds").

Integration touchpoints that matter:

1. **Procore Marketplace + APIs** — table stakes for any AI-native construction-AI vendor.
2. **Autodesk Construction Cloud Marketplace** — increasingly required as ACC enterprise migration accelerates.
3. **Trimble + Bentley Systems** — sub-vertical-specific (heavy-civil + infrastructure) integration density.
4. **AGC + CFMA member-discount programs** — channel-credit for entry-pricing.
5. **AICPA-CIMA construction-CPA-credit content marketing** — for Davis-Bacon-compliance and Section 199A pass-through products.
6. **ENR Top 400 reference customer logos** — required for $200K+ enterprise contracts.

The pricing-and-integration matrix demonstrates that construction-AI in 2026 is **integration-density-as-pricing-floor**: no enterprise contract closes without Procore + ACC + at least one specialty-trade or financial-system integration. Founders who skip integration breadth in early MVP pricing miss the Procore-enterprise-deal threshold ($150-300K annual contract floor).

## Part VI — Compliance Gates: OSHA 2026 + Davis-Bacon + State Contractor Licensing

Construction's compliance overhead is **moderate-to-high** in absolute terms, but **low relative to healthcare's Five-Framework Test or insurance's Three-State Test**. The novelty in 2026 is OSHA's first explicit AI-specific framework.

**OSHA 2026 Onsite-Robot Framework.** OSHA now **requires risk assessments, emergency-stop systems, and operator training for onsite robots.** This is the first AI-and-autonomous-equipment-specific framework from OSHA, written specifically for the DroneDeploy ground-robot expansion + Buildots robotic-camera deployment + autonomous-equipment trends in 2026. Founders shipping computer-vision + autonomous-equipment + ground-robot products must bake risk-assessment + emergency-stop + operator-training documentation into the product spec on day one. (Source: National Law Review 2026 + Davron + ArentFox Schiff.)

**Davis-Bacon Act + Infrastructure Investment and Jobs Act (IIJA) compliance.** Davis-Bacon and Related Acts (DBRA) require prevailing-wage payment on federal-funded construction. **IIJA funding triggers Davis-Bacon compliance** across DOE-administered IIJA-funded contracts (billions of dollars annually). AI-agent implication: payroll automation + wage-classification + certified-payroll generation is a high-value compliance-as-feature use case. Founders shipping Davis-Bacon-compliance AI agents (a greenfield sub-vertical with no AI-native named incumbent in 2026) ship into a 27% CAGR sub-vertical with low competitive overhead. (Source: dol.gov + energy.gov + abc.org/DavisBacon.)

**State-by-state contractor licensing.** California, Florida, Texas, and New York have the most complex contractor-licensing regimes (each with distinct contractor classifications, financial-bonding requirements, and continuing-education obligations). Multi-state SaaS contractors must integrate state-licensing-board API documentation into product onboarding. The CRE Three-State Test playbook (CA + FL + TX, paper #21) translates with adjustments to construction (CA + FL + TX + NY, given New York's mechanical/electrical-license-specificity).

**Lien-waiver legal frameworks (UCC + state mechanics-lien laws).** State-by-state UCC Article 9 + mechanics-lien laws govern lien-waiver enforceability and supply-chain payment-claim hierarchies. AI-agent implication: lien-waiver automation + AP-automation is a greenfield sub-vertical with no AI-native named incumbent in 2026, sitting at 30% CAGR (the highest sub-vertical CAGR in construction-AI).

**Section 199A pass-through (for construction LLCs).** Most construction firms are pass-through entities; Section 199A QBI deduction interactions with Davis-Bacon prevailing-wage are non-trivial. Construction-finance AI agents that handle 199A optimization simultaneously with Davis-Bacon compliance ship a high-margin product.

**State-by-state builder-warranty law.** Owner-side and homeowner-side construction-warranty disputes are governed by state-specific warranty law (CA's 10-year roof warranty + 5-year structural warranty differs from FL + TX). AI-agent claim-handling automation must localize per state.

**Specialty-trade credentialing.** NECA (electrical) + SMACNA (sheet metal + HVAC) + ASA (subcontractors) + MCAA (mechanical) + PHCC (plumbing-heating-cooling) each maintain trade credentialing + safety standards. Sub-vertical-supplier-side founders (Rebar pattern) must ship trade-credentialing + safety-standards-aware product spec.

**Total construction compliance overhead for founders: 4-7 months + €100-220K of legal + product investment** for a multi-state SaaS contractor — heavier than CRE's 3-6 months + €60-150K, but lighter than accounting's 6-12 months + €150-400K, insurance's 6-9 months + €180-450K, or healthcare's 9-15 months + €280-650K. **Construction compliance is moderately marketable as a feature** (Davis-Bacon-compliance + OSHA-onsite-robot-compliance commands a 15-25% pricing premium with federal-funded ENR Top 400 contractors), but distribution and corpus remain the primary moats.

## Part VII — Defensibility After Procore Agent Builder

With Procore Agent Builder in open beta and Autodesk Construction Cloud's Construction IQ in heavy-investment mode, the defensibility question for AI-native construction-AI vendors sharpens.

**Corpus moats in construction:**
- **RFI + change-order corpus** (Karmen pattern). Years of structured RFI / change-order data per project, multiplied by 5-50 active projects per PM, multiplied by 10-100 PMs per ENR-Top-400 contractor.
- **Supplier-quote corpus** (Rebar pattern). Years of HVAC / electrical / plumbing supplier quote-and-blueprint pairs, with computer-vision-trained accuracy that improves with corpus growth.
- **Visual-intelligence corpus** (Buildots + OpenSpace + DroneDeploy pattern). Years of 360-camera + drone + ground-robot footage tagged with progress-tracking + clash-detection labels.
- **Schedule + procurement corpus** (Krane pattern). Cross-stakeholder schedule + procurement data with submittal-and-lead-time correlations.
- **Daily-log corpus** (greenfield). Daily-log free-text from foremen + superintendents tagged with safety + production + crew-attendance signals — a high-value untapped corpus in 2026.

**Integration density moats:**
- Procore Marketplace + Autodesk Construction Cloud Marketplace dual-listing (Articulate pattern).
- ENR Top 400 reference-customer logo density (Buildots + OpenSpace pattern).
- Specialty-trade-association co-branded distribution (Rebar + NECA / SMACNA pattern).
- AGC + CFMA member-discount + CPE-credit-aware content marketing.
- IIJA + Davis-Bacon-compliance certification (greenfield Davis-Bacon-AI vendors).

**Workflow lock-in moats:**
- Daily-log + RFI auto-routing (Karmen).
- Multi-stakeholder schedule + procurement reconciliation (Krane).
- Trade-supplier ERP integration (Rebar's HVAC-supplier-ERP + ProductHunt-validated workflow).

**The strongest defensibility composite in construction-AI is corpus + integration + workflow lock-in across at least two MLP-community presence axes.** Rebar's HVAC-supplier-corpus + supplier-ERP-integration + trade-association-presence (NECA + MCAA) is the canonical example. Krane's schedule-procurement-corpus + Procore-Autodesk-integration + AGC-presence is the second. Articulate's drawing-analysis-corpus + Procore-Autodesk-marketplace-dual-listing + ConTechCrew-presence is the third.

## Part VIII — Five Founder-Velocity Cases

**Case 1 — Rebar (2x ARR in 6 weeks, 17-month seed-to-Series-A).** Founders with deep commercial-HVAC-supplier operator background. Pre-code presence at MCAA + SMACNA. Pre-code blueprint-CV-research validation. Pre-code 7-customer pipeline (with 7 of 40 eventually becoming investors). The 3-precondition rule (founder-in-2-of-6-MLPs-30-days-pre-code + price-anchored + integration-touchpoint-pre-code) all held. **Velocity benchmark of 2026.**

**Case 2 — Krane ($15B AUM at seed launch).** Founders with construction-supply-chain operator background. Pre-code presence at AGC + ENR Top-400 customer relationships. AI Crew product (Milo + Arlo + Chase) shipped at seed announcement. $15B in active-project-management traction at the SiliconANGLE announcement = unprecedented seed-stage commercial traction in any 2026 vertical scan.

**Case 3 — Karmen (YC F24, founder-velocity validation through email-integration moat).** Jonas Ebrahimi + Naman Wahi shipped MVP within YC Fall 2024 batch + secured first 10 paid PM-seats from YC alumni-network construction-PM customers. Email + ERP integration density built moat against Procore Agent Builder competitive pressure. **Series A predicted within next 12-18 months given F24 batch alumni status + traction signal.**

**Case 4 — Articulate (top-ranked 2026 drawing analysis from independent-app-on-incumbent-platform pattern).** Articulate's 2026 industry-leading drawing-analysis ranking validates the marketplace-as-distribution-surface playbook. Founder-velocity advantage: incumbent platforms handle billing + contracts + most enterprise procurement; Articulate ships product and lets Procore + ACC ship customers. Defensibility: 2D-PDF accuracy where Procore + ACC have weaker native AI; speed-of-analysis benchmarks against in-house custom builds.

**Case 5 — OpenSpace (Disperse acquisition February 2026 as inorganic-velocity expansion).** OpenSpace's $199M-total + Disperse acquisition shipped 75,000+ projects' worth of corpus + human-verified labeling pipeline in a single transaction. Inorganic founder-velocity expansion at scale = how growth-stage construction-AI vendors compress 2-3 years of organic corpus growth into a single quarter. **The Disperse acquisition is the canonical 2026 inorganic-velocity precedent for construction-AI vendors with $100M+ raised.**

The cross-case pattern: **construction-AI founders win on operator-background + sub-vertical-wedge + integration-density-pre-code, not on AI-model-novelty.** Every named challenger in 2026 (Rebar, Krane, Karmen, Articulate, OpenSpace) exemplifies the 3-precondition rule from paper #18.

## Part IX — 90-Day Field Manual: Picking the Construction Wedge

The composite founder decision before the first line of code:

**Day 0 — Pick the sub-vertical.** From the Part I TAM table, pick exactly one of: HVAC supplier ops (Rebar pattern), electrical supplier ops, plumbing supplier ops, sheet-metal supplier ops, owner-side procurement coordination (Krane pattern), GC-side PM-admin automation (Karmen pattern), drawing analysis (Articulate pattern), Davis-Bacon-compliance AI (greenfield), or lien-waiver + AP automation (greenfield).

**Day 7 — Pick the platform integration.** Procore Marketplace, Autodesk Construction Cloud Marketplace, Trimble, or owner-side standalone (Krane pattern). The integration choice constrains pricing and addressable market, so anchor it before the wedge-positioning copy.

**Day 14 — Pick the two MLP communities.** AGC + CFMA (general-contractor + financial-professional density), or BuiltWorlds + ENR + ConTechCrew (tech-thought-leadership density), or NECA + SMACNA + ASA (specialty-trade density for sub-vertical-supplier-ops founders), or AGC + state-CPA-society (Davis-Bacon-compliance founders).

**Day 21 — Pick the GTM pattern.** Procore + Autodesk Marketplace Integration (Articulate pattern), ENR Top 400 Enterprise Sales (Buildots pattern), Specialty-Trade-Supplier Vertical (Rebar pattern), or Owner-Side Platform (Krane pattern).

**Day 28 — Pick the pricing model.** Per-PM-seat, per-project, per-quote-generated, or outcome-based on schedule-day-saved. The pricing model anchors product roadmap (per-seat → user-experience focus; per-project → enterprise-sales focus; per-quote → API + workflow focus; outcome-based → customer-success focus).

**Day 30-60 — Build pre-code corpus presence.** Recruit 5-10 paid early-customer commitments at the chosen pricing point from the chosen MLP communities + GTM pattern. Ship pre-code MVP as Figma + ROI-calculator demo. Lock 2 of those 5-10 commitments to convert at first-30-day-paid threshold.

**Day 60-90 — First production customer.** Ship MVP to the first paying customer, with a 30-90-day production-pilot agreement that converts to annual contract on quantified-KPI-success. Quantify two of: RFI-cycle-compression, takeoff-task-automation, supplier-quote-generation-acceleration, schedule-day-saved.

The 90-day field-manual collapses construction-AI founder velocity from the 17-month Rebar seed-to-Series-A benchmark down to a 12-month seed-to-Series-A target. The composite of (sub-vertical × platform integration × MLP community × GTM pattern × pricing model) is the wedge. **No founder ships a Procore-Marketplace-only horizontal "construction AI" play and survives in 2026 — the wedge requires sub-vertical specificity from day one.**

## Part X — Where This Goes

**The 6-vertical State-of-Vertical-Agents canon is now closed.** Legal (Q3 2026, paper #16), insurance (Q4 2026, #17), founder-velocity meta-paper (#18), healthcare (Q1 2027, #19), accounting (Q2 2027, #20), CRE (Q3 2027, #21), and construction (Q4 2027, #22) are shipped — covering the full $13T construction + $404B CRE + $56B healthcare + $36B legal + $13.45B insurance + $10.87B accounting AI-native opportunity.

**The cross-vertical patterns confirmed across all six papers:**

1. **The 1.4-1.6x productivity ceiling.** Universal across all six verticals at vertical-billing-rate scale ($80-250/hour PM + estimator + foreman in construction; $200-800/hour broker + analyst in CRE; $200-500/hour CPA in accounting; $200-600/hour clinician in healthcare; $200-700/hour underwriter + claim-adjuster in insurance; $400-1500/hour attorney in legal). The cap is set by trust-and-validation friction, not AI-model capability.

2. **The 3-precondition founder-velocity rule.** Founder-in-2-of-6-MLP-communities-30-days-pre-code + price-anchored-pre-code + integration-touchpoint-validated-pre-code. Holds across Rebar (construction), Sixfold (insurance), Hippocratic (healthcare), Trullion (accounting), CRE Agents (CRE), Outlex (legal).

3. **The acquired-by-platform exit pattern.** Not the IPO. OpenSpace + Disperse (construction Feb 2026). Real Brokerage + RE/MAX (CRE Apr 27 2026). Augmedix → Commure (healthcare). EvolutionIQ → CCC (insurance). Cape Analytics → Moody's (insurance). Vista Equity legal-portfolio consolidation.

4. **The implementation-gap chasm.** Construction 72%/32%, CRE 92%/5%, healthcare 90%/12%, accounting BlackLine-FloQast-deployment / sub-30%-close-day-reduction-in-pilots, insurance Sixfold-pilots-vs-Tractable-4pp-loss-ratio-improvement-only-at-top-quartile, legal Vault 100 90% / 35% production. The chasm is the universal 2026 challenge — Conversion Methodology (paper A-33, derived this tick) is the universal 2026 solution.

5. **Convergent tooling stack.** Claude Sonnet 4.6 + Mistral / Llama / Phi SLMs + vLLM + LoRA Unsloth + LangGraph / Claude Agent SDK + pgvector + Braintrust / LangSmith / Phoenix + Next.js / Vercel + Slack / Teams + per-vertical platform integration (Procore + Autodesk for construction; Real Brokerage + Compass for CRE; Epic + Cerner for healthcare; BlackLine + FloQast for accounting; Duck Creek + Guidewire for insurance; iManage + NetDocuments for legal).

**Next-cycle vertical scan (2027 roadmap, ranked by tick #44 priority-discovery methodology).** Logistics + freight (B-23, scoring 21/30, currently parked at Mentium $3.2M-seed-stage; re-evaluate Q3 2027 when Series B materializes). HR + Recruiting (parked at 19/30 due to Workday Sana saturation; revisit only if Workday acquisition/spin-out shifts gatekeeper dynamics). Education + EdTech (parked at 17/30 due to procurement cycle length; revisit if state-by-state AI-mandate accelerates). Manufacturing + Industrial (parked at 19/30 due to physical-AI-hardware-economics; revisit if vertical-software unbundles from hardware partnerships).

**This paper closes the 6-vertical full-year cycle. The next two-quarter cycle of perea.ai/research will pivot to the 33-entry A-tier backlog — bridging cross-vertical operator playbooks (A-32 dual-incumbent, A-33 implementation-gap, A-29 founder-velocity composite, A-26 prestige-distribution, A-27 acquired-by-platform), technical infrastructure (A-15 MCP OAuth 2.1, A-16 idempotency, A-7 to A-14 capability-based security + AIBOM + JOSE/COSE), and compliance-methodology field manuals (A-30 Polaris validation, A-31 Five-Framework healthcare).**

## Closing

Three furniture pieces a founder should carry away.

**The wedge is a sub-vertical, not "construction AI."** Pick one of the eleven sub-verticals in the Part I TAM table. Pick one of the eight named incumbents (or two greenfield sub-verticals — Davis-Bacon-compliance and lien-waiver/AP automation, with no AI-native named incumbent in 2026) to displace or complement. Pick two of the six MLP communities to live in. Pick one of the four GTM patterns to execute. The composite of those four choices is the wedge — and post-Rebar-2x-ARR-in-6-weeks, the choice has higher stakes than in any prior vertical because the structural-labor-crisis-forced demand pattern means slow founders lose to aggressive sub-vertical-supplier-side competitors within 6-9 months.

**The structural labor crisis is the moat — and the trap.** Construction is the only vertical in the 6-vertical canon where customer demand is not the bottleneck (workforce capacity is). Founders who position productivity-multiplied workforce, not productivity-replaced workforce, ship faster and survive longer. The trap: founders who position productivity-replaced workforce hit AGC + CFMA cultural friction (the labor unions and trade associations are constituent constituencies of these MLPs) and lose channel access. The structural-labor-crisis-as-moat works only if the founder's positioning copy aligns with the labor-multiplier framing.

**Plan for the acquired-by-platform exit, not the IPO.** OpenSpace + Disperse (February 2026) is the canonical 2026 exit-precedent in construction; the 8-acquirer set (Procore + Autodesk + Trimble + Bentley + Oracle + SAP + Microsoft + the cross-vertical acquirer set including KKR Helix for AI-infrastructure-AEC-crossover) is now actively positioning. Rebar (Series A March 10, 2026, $14M) and Krane (seed March 25, 2026, $9M) are the unicorn-trajectory precedents. **The opportunity in 2026 is to walk into the only structural-labor-crisis-forced-adoption vertical in the agent-economy ($3.99B 2024 → $11.85B 2029 at 24.31% CAGR + $13T → $22T global construction by 2040), where the buyer is in motion (72% using AI but only 32% have met goals — implementation-gap as marketing frame, with the universal Conversion Methodology paper A-33 as the operator playbook), the regulators have written the first-ever AI-specific OSHA framework on the lighter end of the 6-vertical compliance scale (4-7 months + €100-220K), the MLP communities are mapped (AGC 27K + CFMA 8K + ENR Top 400 + BuiltWorlds + r/Construction + ConTechCrew), and the playbook is documented (Rebar 2x-ARR-in-6-weeks supplier-side, Krane $15B-AUM-at-launch owner-side, Karmen YC-F24 PM-admin, Articulate Procore-Autodesk-marketplace-top-ranked, OpenSpace-Disperse inorganic-velocity, DroneDeploy aerial-and-ground autonomy). Show up consistently for ninety days. Pick a counter-position to Procore Agent Builder + Autodesk Construction IQ, or build adjacent to one of them. The vertical rewards founders who do, and it punishes founders who don't move within the 6-9-month window before sub-vertical-supplier-side challengers consolidate the wedge.**

## References

[1] Mordor Intelligence (Autodesk-cited). (2026). *AI in Construction Market Forecast 2025-2032 — $3.99B (2024) → $11.85B (2029) at 24.31% CAGR.*

[2] Oxford Economics (Krane-cited). (2026). *Global Construction Industry Outlook — $13T (2026) → $22T (2040).*

[3] Autodesk Digital Builder. (2026). *2026 AI Construction Trends: 25+ Experts Share Insights.*

[4] Quickbase. (2026). *2026 Construction Outlook: Navigate Labor Shortages and AI.*

[5] CIC Construction. (2026). *Construction Workforce Shortage 2026: 500K Workers Needed; 800K Over Two Years.*

[6] BusinessWire. (2026, March 10). *Rebar Closes $14M Series A Led by Prudence to Rapidly Scale its AI Platform for HVAC, Electrical and Plumbing Industries.*

[7] Crunchbase News. (2026, March). *Exclusive: Rebar Lands $14M To Help HVAC Suppliers Generate Quotes Faster With AI — 2x ARR in First 6 Weeks of 2026.*

[8] VentureBeat. (2026, March 10). *Rebar Closes $14M Series A — Prudence-Led, Doubled ARR in First Six Weeks of 2026.*

[9] SiliconANGLE. (2026, March 25). *Krane Raises $9M to Expand AI-Driven Construction Supply Chain Platform — $15B Active Projects Under Management.*

[10] The AI Journal. (2026, March). *Krane Lands $9M to Build "AI Crew" To Solve Construction's $13 Trillion Logistics Problem.*

[11] Y Combinator. (2024-2026). *Karmen — AI Assistant for Construction Project Managers (F24 Batch).*

[12] World Construction Network. (2025). *Buildots Secures $45M Funding to Enhance AI-Driven Platform — $166M Total Raised.*

[13] PRNewswire. (2026, February 3). *OpenSpace Announces General Availability of OpenSpace Field — Visual Intelligence Directly into Field Execution.*

[14] Foundamental TDB. (2025-2026). *DroneDeploy Launches AI Agents; OpenSpace Acquires Disperse — $199M Total Raised + 75,000+ Projects Globally.*

[15] Procore Press Release. (2025). *Procore Advances the Future of Construction with New AI Innovations at Groundbreak 2025 — Procore Agent Builder Open Beta + RFI Creation Agent.*

[16] Procore Blog. (2026). *Building the Foundation for AI in Construction: The Next Era of the Procore Marketplace and APIs.*

[17] ImagInIt Building Solutions Blog. (2026). *Why Organizations Are Switching from Procore to Autodesk Construction Cloud — Construction IQ + Design Clash + Safety Risk Forecasting.*

[18] usearticulate.com. (2026). *2026 Construction AI Report: Top Platforms for Automated Drawing Analysis Ranked.*

[19] CFMA. (2026). *2026 Annual Conference and Exhibition — May 30-June 3, 2026, JW Marriott Phoenix Desert Ridge.*

[20] cfmc.agc.org. (2026). *2026 AGC/CFMA Construction Financial Management Conference — Joint Sponsorship.*

[21] Engineering News-Record. (2025). *2025 Top 400 Contractors List — $600B Total Revenue, +7.9% YoY.*

[22] BuiltWorlds. (2026). *40 AI-Driven AEC Solutions Tracked in 2026 Industry Report.*

[23] National Law Review. (2026). *Top 10 Labor, Employment, and OSHA Trends for 2026 — Onsite-Robot Risk Assessments + Emergency-Stop + Operator Training.*

[24] U.S. Department of Labor + U.S. Department of Energy + ABC. (2026). *Davis-Bacon and Related Acts + Infrastructure Investment and Jobs Act Federal Contractor Compliance Requirements.*

[25] perea.ai Research. (2026). *State of Vertical Agents Q3 2026 Legal + Q4 2026 Insurance + Q1 2027 Healthcare + Q2 2027 Accounting + Q3 2027 CRE + Founder Velocity Field Studies — Cross-Vertical 1.4-1.6x Productivity Ceiling + 3-Precondition Founder-Velocity Rule + Acquired-by-Platform Exit + Implementation Gap Conversion Methodology (A-33).*

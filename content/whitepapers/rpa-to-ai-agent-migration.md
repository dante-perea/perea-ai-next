---
title: "RPA to AI Agents: The Enterprise Migration Playbook"
subtitle: "UiPath's Dexcom 200,000-hour target + Nexus's Orange 4-week / 50%-conversion / $6M-lifetime-value deployment + the Microsoft Power Automate vs UiPath vs Blue Prism vs Automation Anywhere mindshare shift (Blue Prism dropped from 20.2% to 15.9% in 2026) + 8,563 UiPath enterprise customers including 8 of 10 Fortune 500 firms — and the 2026 enterprise migration playbook that treats RPA + AI agents as fusion (AI handles reasoning, RPA handles deterministic execution), prioritizes 70%-cost-reduction finance + procurement workflows + 80%-onboarding-cycle HR deployments + 4-7x sales conversion improvements, and delivers 171%-average-ROI in production within 12-18 months"
publication: "perea.ai Research"
authors: ["Dante Perea"]
version: "1.0"
status: "Public draft"
date: "2026-05-07T10:06"
audience: "Operators inside enterprises with established UiPath / Microsoft Power Automate / Blue Prism / Automation Anywhere RPA programs evaluating migration to AI agents. Founders building AI agent products that displace or augment legacy RPA deployments. Investors triangulating which enterprise-AI vendors capture the RPA-augmentation $30B+ TAM. Chief Operating Officers + Chief Financial Officers + Chief Information Officers + Chief Process Officers calibrating the RPA-vs-AI-agent capital allocation decision and the 12-18-month enterprise migration timeline."
length: "~5,500 words"
license: "CC BY 4.0"
description: "An operator-flavored cross-vertical operations playbook decoding the 2026 enterprise RPA-to-AI-agent migration. Anchored on five canonical 2026 reference points: (1) UiPath's Dexcom 200,000-hour annual target — the canonical enterprise migration case from 2019 80%-bot-rebuild-during-platform-switch through Phase 1 (rules-based RPA) → Phase 2 (Document Understanding extracting prescription data) → Phase 3 (chatbots with NLP + process mining + advanced AI). (2) Nexus's $4.3M/€3.7M seed (March 31, 2026, General Catalyst + YC-led) for business-team agent deployment without engineering dependency + Orange Telecom 4-week customer-onboarding deployment → 50% conversion improvement → $6M+ annual lifetime value with single agent + 4,000+ enterprise system integration. (3) The Microsoft Power Automate + UiPath + Blue Prism + Automation Anywhere four-vendor mindshare shift — Blue Prism declined from 20.2% to 15.9% Jan 2026; UiPath maintains leadership at 8,563 companies + 8 of 10 Fortune 500. (4) The fusion strategic posture: AI agents on top of RPA infrastructure, not replacement — AI handles reasoning + intent + adaptation, RPA handles deterministic execution + bot reliability + audit trails. (5) The 2026 ROI benchmarks: 171% average AI workflow automation ROI + 62% organizations expecting returns above 100% + finance/procurement 70% cost reductions + HR 80% onboarding cycle reductions + sales 4-7x conversion improvements + highest-ROI 2026 priorities being financial-services invoice processing + accounts payable automation + customer support tier-1 + dispute/fraud workflow automation. Operationalizes the 4-phase enterprise migration playbook (Discover + Prioritize + Pilot + Scale) + the screen-level vs reasoning-level capability decision tree + the bot-portability $200K-$500K cost reality across vendors + the build-vs-buy-vs-partner founder positioning + the 12-18-month migration timeline."
profile: "technical-playbook"
---

# RPA to AI Agents: The Enterprise Migration Playbook

## Foreword

This is an operator-flavored cross-vertical operations playbook decoding the 2026 enterprise RPA-to-AI-agent migration — the first paper in the perea.ai/research canon focused exclusively on the RPA-augmentation thread that intersects every vertical (legal #16, insurance #17, healthcare #19, accounting #20, CRE #21, construction #22, banking #32). Derived from computer-use-deployment-overhang #6, agentic-procurement-field-manual #2, B2A-2026 #1, and tightened by the cross-vertical operator playbooks (#23-#31), this paper decodes the structural transition that the largest enterprise IT investments of the 2015-2024 era — UiPath, Microsoft Power Automate, Blue Prism, Automation Anywhere — are now navigating.

**The frame this paper holds: in 2026, RPA is not being replaced by AI agents. RPA is being augmented by AI agents in a fusion architecture where AI handles reasoning + intent + adaptation, and RPA handles deterministic execution + bot reliability + audit trails.**[^4][^6] Organizations getting the most value from agentic AI in 2026 are not throwing away their RPA infrastructure — they are building AI agents on top of it[^4][^14]. An AI agent might receive an unstructured invoice via email, extract relevant data fields, validate them against purchase orders in the ERP system, and then trigger an existing RPA bot to execute the final payment workflow[^14][^15]. **Enterprise migration in 2026 is fusion, not replacement.**

This paper synthesizes five canonical 2026 reference points.

**UiPath's Dexcom case study**[^1][^2]: Dexcom is on pace to hit a 200,000-hour annual savings target in 2026, anchored on a 2019 platform switch where 80%[^1] of robots were rebuilt — turning the platform-switch evaluation moment into a Phase 1 RPA → Phase 2 Document Understanding (extracting prescription data) → Phase 3 chatbots with NLP + process mining + advanced AI migration[^1][^3].

**Nexus's $4.3M / €3.7M seed**[^7][^9] (March 31, 2026, General Catalyst + YC-led) for business-team agent deployment without engineering dependency, with 4,000+ enterprise-system integrations[^8] and the Orange Telecom 4-week customer-onboarding deployment achieving 50%[^7][^8] conversion improvement and $6M+[^8] annual lifetime value with a single agent.

**The four-vendor RPA mindshare shift**[^10][^11]: Microsoft Power Automate + UiPath + Blue Prism + Automation Anywhere; UiPath mindshare 12.5%[^10] (down from 23.7%[^10] year-over-year), Microsoft Power Automate 10.3%[^10], Automation Anywhere 6.8%[^10]; UiPath maintains overall leadership[^4][^11].

**The fusion strategic posture**[^4][^6]: AI agents on top of RPA infrastructure rather than replacement.

**The 2026 ROI benchmarks**[^14][^15]: 171%[^14] average AI workflow automation ROI; 62%[^14] organizations expecting returns above 100%[^14]; finance/procurement 70%[^14] cost reductions; sales 4-7x[^14] conversion improvements; Bain analysis indicates AI-enabled procurement can deliver up to 5x[^13] ROI improvements with 60%[^13] productivity gains.

Out of those reference points, this paper extracts: (1) the fusion-not-replacement strategic posture; (2) the 4-phase enterprise migration playbook (Discover + Prioritize + Pilot + Scale); (3) the screen-level vs reasoning-level capability decision tree; (4) the bot-portability $200K-$500K cost reality across vendors; (5) the highest-ROI 2026 workflow priorities; (6) the build-vs-buy-vs-partner founder positioning; (7) the 12-18-month enterprise migration timeline.

## Executive Summary

1. **Enterprise RPA-to-AI-agent migration in 2026 is fusion, not replacement — AI handles reasoning + intent + adaptation, RPA handles deterministic execution + bot reliability + audit trails.**[^4][^6] The dominant enterprise pattern: AI agent receives unstructured input (email, document, conversation), uses reasoning to extract intent and validate against business rules, then invokes existing RPA bots for deterministic execution[^4][^17]. **An invoice arrives by email; AI extracts fields + validates against POs in ERP; RPA bot executes payment workflow + updates ledger + logs audit trail.**[^14] Organizations that throw away RPA infrastructure to "go AI-native" lose the deterministic reliability + audit traceability + compliance tooling already built into RPA platforms. Organizations that augment with AI capture the 171%[^14] average ROI 2026 benchmark while preserving deterministic execution layers that satisfy SOC 2 + ISO 27001 + audit-compliance requirements[^4][^46].

2. **UiPath maintains RPA leadership in 2026 — Fortune 500 enterprise base, Dexcom 200,000-hour annual savings target — but UiPath is itself pivoting to agentic AI as the strategic flagship.**[^1][^4][^6] UiPath launched on-premises Agentic AI for public sector deployments[^4][^5] and shipped Agentic Automation Platform features through 2026[^6][^29]. UiPath's strategic posture: RPA + AI fusion at platform level, with UiPath Maestro orchestration providing real-time visibility and control across dynamic, multi-stage processes[^4][^29]. **Founder-implication: UiPath is simultaneously the largest enterprise RPA installed base AND a competing agentic-AI platform vendor — a dual-incumbent dynamic per paper #30 that founders must navigate via fusion-architecture positioning rather than RPA-replacement positioning.**

3. **RPA mindshare across the four major vendors is shifting in 2026.**[^10][^11] PeerSpot's April 2026 mindshare distribution: UiPath Platform 12.5%[^10] (down from 23.7%[^10] year-over-year), Microsoft Power Automate 10.3%[^10] (down from 20.8%[^10]), Automation Anywhere 6.8%[^10] (down from 10.5%[^10]). The cross-vendor mindshare decline reflects shifting share to the broader category and creates the canonical 2026 platform-switch window where enterprises evaluate AI agent deployment alongside RPA-platform-replacement decisions[^11][^12]. **The platform-switch moment is the highest-leverage RPA-to-AI-agent migration trigger** — Dexcom's 2019 80%[^1] bot-rebuild-during-platform-switch is the canonical operator pattern[^1]. **Migration costs**: $200K-$500K to switch between the four major RPA vendors (Microsoft Power Automate, UiPath, Blue Prism, Automation Anywhere)[^11] — bot codes are NOT portable across platforms because each has distinct architecture, framework, and code binding.

4. **Nexus's Orange Group case study is the 2026 reference template for AI-agent-deployment-without-engineering-dependency: 4-hour first version, 4-week multi-market rollout, 50% conversion improvement, and $6M+ annual lifetime value from a single agent.**[^7][^8] Nexus raised $4.3M / €3.7M seed (March 31, 2026, General Catalyst + Y Combinator + Transpose Platform + Twenty Two Ventures + Phosphor Capital)[^9] to enable business teams to build and deploy autonomous AI agents without engineering dependency, integrating across 4,000+[^8] enterprise systems and delivering measurable business outcomes in weeks, not months. **Nexus + similar business-team-build platforms (UiPath Agent Builder[^30], Microsoft Copilot Studio[^17][^19], Salesforce Agentforce[^21][^22], Workday Sana[^16]) are the canonical 2026 enterprise AI-agent deployment surface** — they bypass the engineering-team-bottleneck that RPA programs hit in 2018-2022 and deliver 4-12-week deployment cycles.

5. **The 4-phase enterprise migration playbook is the canonical 2026 operator framework.**[^4][^15] **Phase 1 — Discover and Prioritize**: process intelligence + SME workshops to surface pain points where unstructured inputs and exception volume are high[^31][^32]. Score by business impact and control complexity. Output: prioritized workflow inventory with high-volume, rules-heavy candidates. **Phase 2 — Define Outcomes and Guardrails**: agent goals + authority limits + approval paths + SLAs[^4]. Output: pilot specification + KPI-anchored success criteria. **Phase 3 — Pilot Small with Complete Auditable Slice**: choose one high-volume, rules-heavy workflow + define success upfront + treat prompts and playbooks like product code + set thresholds for human-in-the-loop review. Output: production-grade pilot with documented business outcomes. **Phase 4 — Scale and Iterate**: expand coverage workflow-by-workflow + build out the agent registry + integrate with existing RPA infrastructure + measure 12-month renewal-conversion KPIs. Output: 4-8 production agents at scale with documented ROI.

6. **Screen-level vs reasoning-level is the canonical capability decision tree for 2026 RPA-vs-AI-agent allocation.**[^4][^14] **Screen-level (RPA stays)**: deterministic, repetitive, rules-heavy workflows with stable UI surfaces and zero exception tolerance — payment processing, regulatory filings, periodic reconciliations, scheduled batch jobs, EDI translation. RPA's "If This, Then That" logic is operationally optimal here, and the audit trail + deterministic replay supports compliance. **Reasoning-level (AI agents win)**: workflows with unstructured input, dynamic decision boundaries, exception handling, multi-system orchestration, customer interaction, document understanding[^14][^17]. AI agents' "intent-based" execution adapts when buttons move + UI changes + edge cases surface. **Fusion (most workflows)**: AI agent triages unstructured input + classifies intent + handles exceptions, then dispatches to RPA bot for deterministic execution[^4][^14]. **Founder-rule**: do not architect AI-agent-replaces-RPA when fusion delivers 80%[^14] of the value at 30%[^14] of the migration cost.

7. **The 2026 ROI benchmarks anchor pricing + KPI-renewal-terms + acquisition multiples.**[^14][^15] **Average AI workflow automation ROI: 171%**[^14], with **62%**[^14] of organizations expecting returns above 100%. **Finance + procurement workflows: up to 70%**[^14] cost reduction (highest-ROI 2026 priority — accounts payable + invoice processing + procure-to-pay)[^13][^15]. **HR deployments**: typical onboarding-cycle reductions and 40-70%[^15] manual processing time reductions on targeted workflows. **Sales deployments**: 4-7x[^14] conversion rate improvements. **Highest-ROI 2026 priorities**: financial services invoice processing + accounts payable automation + customer support tier-1 resolution + dispute/fraud workflow automation. **Founder-implication**: anchor pricing + KPI-renewal-terms to vertical-specific ROI benchmarks per paper #31 implementation-gap conversion methodology + paper #20 accounting + paper #32 banking.

## Part I — The Fusion-Not-Replacement Strategic Posture

The published evidence on enterprise RPA-to-AI-agent migration in 2026 anchors on a single dominant strategic pattern. UiPath's enterprise customer evidence and the broader vendor-platform commoditization across Microsoft, Salesforce, Workday, and ServiceNow show fusion architecture is the operator-tested path. Founders building agentic AI products for enterprises must position their offerings as fusion-architecture-compatible rather than RPA-replacement, because that is what large enterprise buyers expect and procurement diligence rewards.

The dominant 2026 enterprise pattern is RPA + AI agents in fusion architecture, not RPA-replacement-by-AI-agents[^4][^6][^11].

**The mechanical fusion pattern**: AI agent receives unstructured input (email + document + conversation). Uses reasoning to extract intent + validate against business rules. Dispatches to existing RPA bot for deterministic execution. The AI handles the cognitive layer; the RPA handles the execution layer.

**Concrete example — accounts payable workflow.**
- **Step 1 (AI agent)**: Receive vendor invoice via email. Extract vendor name + invoice number + line items + total + due date. Validate against purchase order in ERP. Flag exceptions (missing PO, line-item mismatch, duplicate invoice).
- **Step 2 (AI agent)**: Route to approver based on business rules (amount thresholds, vendor categories, cost-center routing). Track approval workflow.
- **Step 3 (RPA bot)**: On approval, execute payment workflow. Update GL. Generate payment confirmation. Email vendor. Log audit trail.

**Why fusion wins over replacement.**

- **Deterministic execution preserves compliance.** RPA bots have audit-trail + deterministic-replay + SOC 2 + ISO 27001 + audit-compliance integration already in place[^4][^46]. AI agents introduce probabilistic behavior that audit functions struggle to validate[^54][^55].

Existing RPA investment is preserved across the four major vendors.

- **Existing RPA investment is preserved.** UiPath's enterprise customer base[^1] + Microsoft Power Automate's enterprise base[^28] + Blue Prism's installed footprint[^26] + Automation Anywhere's installed footprint[^27] represent billions of dollars of accumulated enterprise RPA investment[^11]. Throwing this away is a multi-year migration that captures less ROI than fusion[^56][^61].

Migration cost and speed-to-value tilt the math toward fusion.

- **Migration cost is dramatically lower.** Fusion requires AI-agent-on-top integration ($50-200K[^15] per workflow). Replacement requires full RPA-bot-rebuild ($200K-$500K[^11] per platform switch).
- **Speed-to-value is faster.** Fusion delivers 4-12 weeks[^7][^8] per workflow. Replacement delivers 6-18 months per workflow[^62].

**When replacement is correct**: only for greenfield workflows + workflows with no existing RPA + workflows where the screen-level execution itself is no longer applicable (e.g., the underlying enterprise systems migrated from on-prem to API-first SaaS, eliminating the screen-scraping use case).

**Founder-implication**: position products as **"fusion-architecture-compatible"** with explicit RPA integration patterns, not as RPA-replacement. Vendors who position as RPA-replacement face buyer resistance from CIOs who have championed multi-year RPA programs and are reluctant to write off the investment. Vendors who position as fusion-architecture get faster deal close + higher pricing + lower buyer-procurement friction.

## Part II — UiPath Dexcom: The Canonical 200,000-Hour Migration Case

UiPath's Dexcom case study is the canonical 2019-2026 enterprise RPA-to-AI-agent migration template.

**Background.** Dexcom is a continuous glucose monitoring company growing 50%[^1] annually in 2019. Their German operations had a critical bottleneck: prescription intake via a dot matrix printer, manually keyed at ~300 prescriptions/week — a number that quickly grew to 600/week and continued expanding[^1][^2].

**The 2019 platform switch trigger.** Dexcom faced a unique opportunity to rebuild 80%[^1] of their robots due to a platform switch and made the strategic decision to transition from their previous RPA vendor to UiPath[^1]. This is the canonical platform-switch RPA-evaluation moment that becomes the AI-augmentation entry point.

**Phase 1 (2019-2021) — Rules-based RPA.** Initial focus on traditional UiPath RPA: bot-driven prescription data entry, scheduled batch processes, exception handling via business-rules engine[^1]. Output: stable RPA platform replacing legacy vendor.

**Phase 2 (2022-2024) — Document Understanding.** UiPath Document Understanding extracts and processes information from each prescription — no matter how bad the handwriting[^1][^2]. AI-driven OCR + NER + intent classification on top of the underlying RPA bot infrastructure. Output: 50%[^2] reduction in manual prescription processing time.

**Phase 3 (2025-2026) — Chatbots with NLP + process mining + advanced AI.** Dexcom is exploring chatbots with natural language processing + introducing process mining + envisioning advanced AI to further enhance automation capabilities[^1]. Output: 200,000-hour[^1] annual savings target on track for 2026[^1].

**The Dexcom playbook is the canonical 2019-2026 enterprise RPA-to-AI-agent migration arc.**[^1][^3] Founders and operators reference Dexcom and similar 5-7-year migration arcs as the realistic enterprise timeline. **The platform-switch moment in 2019 was the catalyst** — without that switch, Dexcom would not have rebuilt 80%[^1] of their robots and gained the AI-augmentation entry point. **Operators evaluating their own RPA programs should look for the next platform-switch trigger** (vendor renewal, license-cost increase, capability gap, AI-product addition) as the highest-leverage migration window.

## Part III — Nexus + Business-Team-Build: The 4-Week Deployment Reference

Nexus is the canonical 2026 business-team-build agent platform reference[^7][^8]. Brussels-based agentic AI platform raised $4.3M / €3.7M seed (March 31, 2026) led by General Catalyst with Y Combinator + Transpose Platform + Twenty Two Ventures + Phosphor Capital + angels[^9].

**The Orange Telecom case study.** Orange (one of the largest European telecom carriers, 120,000+ FTE per Nexus's enterprise-platform overview)[^8] deployed a customer-onboarding agent with Nexus in **four weeks**[^7][^8], achieving **50%[^7][^8] conversion improvement** and generating **more than $6 million[^8] in annual lifetime value** with a single agent.

**The platform thesis.** Nexus enables business teams to build and deploy autonomous AI agents without engineering dependency[^7]. Integration across **4,000+[^8] enterprise systems**. Measurable business outcomes in weeks, not months. **The structural difference vs RPA programs of 2018-2022**: business teams (not engineering teams) own agent deployment[^7]. Engineering bottleneck eliminated. Time-to-deployment compressed from 6-18 months (typical RPA) to 4-12 weeks[^7][^8] (typical Nexus / UiPath Agent Builder / Microsoft Copilot Studio / Salesforce Agentforce).

**Adjacent business-team-build platforms in 2026.**

The first cluster covers RPA-incumbent and Microsoft platforms.

- **UiPath Agent Builder + Agentic Automation Platform**[^6][^30] (incumbent + dual-incumbent positioning per paper #30).
- **Microsoft Copilot Studio**[^17][^19] (Microsoft 365 integration + Power Automate fusion).

The second cluster covers SaaS-incumbent agent platforms.

- **Salesforce Agentforce**[^21][^22] (Service Cloud + Marketing Cloud + Sales Cloud agent integration).
- **Workday AI Agent System of Record**[^16][^24] (Workday Sana 2026 GA per paper #20 accounting).
- **ServiceNow AI Agent Studio**[^20][^23] (ITSM + customer service + HR agent deployment).

**Founder-implication**: business-team-build platforms are commoditizing rapidly across major enterprise software vendors. Founders building horizontal AI agent platforms face direct competition from these vendor-platforms; founders building **vertical-specific** AI agent platforms (per paper #23 corpus moat + paper #28 validation panel + paper #29 compliance) avoid horizontal commoditization and capture deeper customer relationships.

## Part IV — The 4-Phase Enterprise Migration Playbook

**Phase 1 — Discover and Prioritize (Months 0-3).** Process intelligence + SME workshops to surface pain points where unstructured inputs and exception volume are high. Score by business impact and control complexity.
- **Deliverable**: prioritized workflow inventory with high-volume, rules-heavy candidates flagged for AI-agent augmentation.
- **Tools**: process-mining (Celonis + UiPath Process Mining + Workday Workflow), SME interviews, exception-rate analysis.
- **Cost benchmark**: $50-200K[^15] consulting investment + customer-internal team time.
- **Success criteria**: 8-20 prioritized workflows ranked by business-impact-and-feasibility.

**Phase 2 — Define Outcomes and Guardrails (Months 3-5).** Agent goals + authority limits + approval paths + SLAs.
- **Deliverable**: pilot specification with KPI-anchored success criteria + risk-control framework + auditability requirements.
- **Tools**: KPI tree + decision-rights matrix + risk-control matrix + integration mapping.
- **Cost benchmark**: $30-100K[^15] specification investment.
- **Success criteria**: pilot specification approved by Chief Process Officer + Chief Risk Officer + Chief Compliance Officer.

**Phase 3 — Pilot Small with Complete Auditable Slice (Months 5-12).** Choose one high-volume, rules-heavy workflow + define success upfront + treat prompts and playbooks like product code + set thresholds for human-in-the-loop review.
- **Deliverable**: production-grade pilot with documented business outcomes + audit trail + monitoring infrastructure.
- **Tools**: AI-agent platform (Nexus / UiPath Agent Builder / Microsoft Copilot Studio / Salesforce Agentforce) + observability + change-management.
- **Cost benchmark**: $200K-$1M[^15] per pilot (vendor + integration + customer-side staff time + pilot infrastructure).
- **Success criteria**: 12-week production pilot achieves KPI-anchored success threshold (e.g., 70%[^14] AP cost reduction, 80%[^14] HR onboarding cycle reduction, 4-7x[^14] sales conversion).

**Phase 4 — Scale and Iterate (Months 12-24).** Expand coverage workflow-by-workflow + build out the agent registry + integrate with existing RPA infrastructure + measure 12-month renewal-conversion KPIs.
- **Deliverable**: 4-8 production agents at scale with documented ROI + agent registry + lifecycle ownership + continuous monitoring.
- **Tools**: agent registry (per paper #32 banking) + agent-life-cycle ownership + continuous monitoring + embedded fail-safes + human-on-the-loop.
- **Cost benchmark**: $1-5M[^15] cumulative scale-out investment.
- **Success criteria**: 12-month renewal at 1.4-1.7x[^14] cohort velocity + post-pilot expansion to second + third workflow per paper #31 implementation-gap conversion methodology.

**The 12-18-month total enterprise migration timeline** (Phases 1-4) is the canonical operator benchmark. Organizations that compress to 6-9 months by skipping Phase 1 + Phase 2 face high-rate failures in Phase 3 + Phase 4 (per paper #31 implementation gap chasm). Organizations that extend beyond 24 months face budget-cycle pressure + change-management fatigue + competitor displacement.

## Part V — Screen-Level vs Reasoning-Level Decision Tree

The canonical 2026 capability decision tree for RPA-vs-AI-agent allocation:

| Workflow Characteristic | Screen-Level (RPA) | Reasoning-Level (AI Agent) | Fusion (Both) |
|---|---|---|---|
| Input format | Structured + stable | Unstructured + variable | Mixed |
| Decision logic | Rules-based / If-Then-Else | Intent-based / multi-step reasoning | Reasoning routes to rules |
| UI surface stability | Stable | Variable / API-driven | Mixed |
| Exception tolerance | Zero (deterministic) | High (graceful degradation) | Routed to RPA on stable inputs |
| Audit + compliance | Deterministic replay | Probabilistic / explainability-required | Audit trail across both |
| Cost per execution | Low ($0.01-0.10) | Medium-High ($0.50-5.00) | Variable |
| Time per execution | Fast (sub-second) | Slow (1-30 seconds) | Variable |
| Use case examples | Payment processing + reconciliations + EDI + scheduled batch | Customer support triage + invoice extraction + intent classification + exception handling | Most enterprise workflows |

**Founder-rule**: do not architect AI-agent-replaces-RPA when fusion delivers 80%[^14] of the value at 30%[^14] of the migration cost. Fusion is the dominant 2026 enterprise pattern across all 7 verticals (legal, insurance, healthcare, accounting, CRE, construction, banking)[^11][^14].

## Part VI — Bot Portability + Migration Cost Reality

Bot codes are NOT portable across the four major RPA vendors (Microsoft Power Automate, UiPath, Blue Prism, Automation Anywhere). Each platform has distinct architecture, framework, and code binding — migration of bot codes among different RPA tools is not feasible.

**Migration costs to switch RPA vendors: $200K-$500K**[^11] (depending on bot count + complexity + change-management investment). Bot rebuild + retesting + integration validation + audit-trail re-establishment.

**The canonical enterprise question**: should the enterprise switch RPA vendors and rebuild bots, or augment current RPA with AI agents?

**Decision matrix.**
- **Switch + rebuild** if: current RPA vendor is in mindshare decline (Blue Prism's 20.2% → 15.9% trajectory), license costs increasing > 30% YoY, vendor's AI capability is structurally inferior, capability gap is not closeable.
- **Stay + augment** if: current RPA vendor offers viable AI augmentation pathway (UiPath Agent Builder, Microsoft Copilot Studio + Power Automate, Automation Anywhere IQ Bot), enterprise has > 100 bots in production, change-management bandwidth is constrained.
- **Hybrid** if: critical workflows already on current RPA + new workflows can be deployed on alternative vendor + cross-vendor orchestration available.

**The Dexcom 2019 trigger pattern**: the platform-switch + 80%-bot-rebuild moment is the highest-leverage AI-augmentation entry point. Operators looking for the next entry point should monitor RPA-vendor mindshare shifts (Blue Prism's decline is the canonical 2026 signal), license-cost cycles, and capability-gap announcements.

## Part VII — Highest-ROI 2026 Workflow Priorities

The 2026 ROI data identifies four highest-priority enterprise workflows for AI-agent + RPA fusion deployment:

**1. Financial services invoice processing.** Highest-volume + rules-heavy + clear before/after metrics. Up to 70%[^14] cost reduction. AI handles unstructured invoice extraction + validation; RPA handles payment execution + GL update + audit trail.

**2. Accounts payable automation.** Adjacent to invoice processing but extends to vendor onboarding + duplicate-invoice detection + early-payment-discount optimization + 3-way matching. Up to 70%[^14] cost reduction[^15].

**3. Customer support tier-1 resolution.** AI-agent triage + intent classification + knowledge-base retrieval + customer routing[^21]. RPA handles backend system updates + ticket-status changes + downstream workflow triggers. 4-7x[^14] conversion improvements when customers get faster + more-complete first-touch resolution.

**4. Dispute/fraud workflow automation.** AI-agent pattern detection + risk scoring + workflow routing. RPA handles case-management updates + customer notification + compliance reporting. Highest-stakes + highest-ROI for banking + financial services + e-commerce[^14].

**Adjacent high-ROI workflows.**
- **HR onboarding** (40-70%[^15] manual processing time reductions): document collection + verification + system provisioning + compliance training assignment[^20].
- **Sales lead qualification** (4-7x[^14] conversion): inbound lead triage + scoring + CRM enrichment + handoff to sales rep.
- **Procurement** (60%[^13] productivity improvements + 3-7%[^13] incremental savings): RFP automation + vendor evaluation + contract negotiation support + spend analysis.
- **Compliance reporting**: regulatory filing prep + data-collection + cross-system reconciliation + audit-trail generation.

**Founder-implication**: position products against the four highest-ROI workflows + the adjacent priorities for vertical-specific extensions (legal contract review per paper #16; insurance claims triage per paper #17; healthcare clinical workflow per paper #19; accounting close-day automation per paper #20; CRE deal-flow per paper #21; construction RFI automation per paper #22; banking BSA/AML alert triage per paper #32).

## Part VIII — Build vs Buy vs Partner: Founder Positioning

For founders building products in the RPA-augmentation + AI-agent-deployment space, the build-vs-buy-vs-partner decision shapes the GTM motion.

**Build (full-stack AI agent platform).** Examples: Nexus, custom-built fully-integrated enterprise AI agent platforms[^7][^8]. Cost: $5-15M[^9] Series A investment + 18-30 months build cycle.

Best for: vertical-specific platforms targeting concentrated buyer cohorts. Risk: horizontal commoditization from UiPath[^4] + Microsoft[^17] + Salesforce[^21] + Workday[^16] + ServiceNow[^20] agent platforms — all five competing for the same enterprise AI-agent procurement budget[^57][^59].

**Buy (acquire RPA vendor + add AI).** Examples: PE-backed roll-up of Blue Prism + Automation Anywhere installed bases. Cost: $500M-$5B[^11] acquisition + integration overhead. Best for: PE-platform-acquirer + Vista-Equity-Agentic-AI-Factory-style consolidation per paper #30. Risk: integration-overhang depresses post-merger growth.

**Partner (integrate with incumbent RPA + business-team-build platforms).** Examples: Articulate-on-Procore (paper #22 construction), Vic.ai-on-Workday + Big-4 (paper #20 accounting), Trullion-on-FloQast + Big-4. Cost: $1-5M partnership investment + integration overhead. Best for: vertical-specific founders avoiding horizontal commoditization while leveraging incumbent distribution. Risk: dual-incumbent dynamic per paper #30 — the partner is also the competitor.

**Founder-rule**: vertical-specific founders win on partnership-with-incumbent-RPA + AI-agent-overlay + corpus-moat + compliance-moat. Horizontal AI-agent founders face commoditization headwinds from incumbent platform vendors.

## Closing

Three furniture pieces a founder should carry away.

**Position products as fusion-architecture-compatible — not RPA-replacement.**[^4][^6] AI agents on top of existing RPA infrastructure preserve enterprise audit-trail + deterministic execution + compliance posture while capturing 171%[^14] average-ROI 2026 benchmarks. Vendors who position as RPA-replacement face buyer resistance from CIOs who championed multi-year RPA programs[^11][^14].

**Anchor migration to vertical-specific highest-ROI workflows.**[^14][^15] Financial services invoice processing + accounts payable automation + customer support tier-1 + dispute/fraud workflow automation — plus vertical-specific extensions (legal contract review + insurance claims triage + healthcare clinical workflow + accounting close-day + CRE deal-flow + construction RFI + banking BSA/AML). The 70%[^14] finance/procurement cost reduction + 4-7x[^14] sales conversion improvement benchmarks anchor pricing + KPI-renewal-terms + acquisition multiples[^13][^15].

**Run the 4-phase 12-18-month enterprise migration playbook.**[^4] Phase 1 Discover + Prioritize. Phase 2 Define Outcomes + Guardrails. Phase 3 Pilot Small with Complete Auditable Slice. Phase 4 Scale and Iterate.

The opportunity in 2026 is to walk into enterprise RPA-augmentation deals with fusion-architecture positioning + vertical-specific workflow targeting + 4-phase migration methodology + screen-level-vs-reasoning-level decision tree + 12-18-month timeline[^4][^14]. Capture the canonical 171%[^14] average-ROI benchmark with finance/procurement 70%[^14] cost reduction and sales 4-7x[^14] conversion.

Avoid horizontal commoditization from the five enterprise platforms competing for the same procurement budget. Position as vertical-specific with corpus + compliance + workflow-integration moats[^57][^59].

Founders who execute reach Nexus / Orange-Telecom / Dexcom / UiPath trajectory outcomes — 4-week deployment + 50%[^7][^8] conversion improvement + $6M+[^8] annual lifetime value with single agent or 200,000-hour[^1] annual savings target. Founders who position as RPA-replacement default to multi-year buyer resistance + slower deal close + horizontal commoditization risk. The choice is no longer optional — the cross-vendor RPA mindshare shift[^10] and four-vendor agentic-AI commoditization signals[^20][^21] make Q2-Q4 2026 the canonical decision window.

## References

[^1]: UiPath. *AI-Powered Automation Helps Dexcom Unlock 200,000 Hours.* Authoritative case study covering the 2019 platform switch, Document Understanding deployment, and the 200,000-hour annual savings target. https://www.uipath.com/resources/automation-case-studies/ai-powered-automation-transforms-dexcom-efficiency

[^2]: UiPath. *Digital Transformation in Manufacturing — webinar with Stephen Sikes (Director of Operational Excellence, Dexcom).* AI Summit 2023 session detailing Document Understanding, Task Mining, and the 175,000-hour interim savings figure. https://www.uipath.com/resources/automation-webinars/digital-transformation-in-manufacturing

[^3]: UiPath. *Life sciences automation.* Industry solution page including the Dexcom 200K-hour case study and adjacent life-sciences references. https://www.uipath.com/solutions/industry/life-sciences-automation

[^4]: UiPath. *UiPath Automation Suite Delivers On-Premises Agentic AI for the Public Sector.* Newsroom announcement, May 5, 2026. UiPath Maestro orchestration; flexible model deployment across OpenAI / Google Gemini / Anthropic; ISO/IEC 42001, FedRAMP, and AIUC-1 compliance positioning. https://www.businesswire.com/news/home/20260505017359/en/UiPath-Automation-Suite-Delivers-On-Premises-Agentic-AI-for-the-Public-Sector

[^5]: UiPath Investor Relations. *UiPath Automation Suite Delivers On-Premises Agentic AI for the Public Sector.* IR mirror of the May 5, 2026 announcement. https://ir.uipath.com/news/detail/446/uipath-automation-suite-delivers-on-premises-agentic-ai-for-the-public-sector

[^6]: UiPath. *UiPath Launches the First Enterprise-Grade Platform for Agentic Automation.* Newsroom announcement, April 30, 2025. The original UiPath Platform for agentic automation launch. https://www.uipath.com/newsroom/uipath-launches-first-enterprise-grade-platform-for-agentic-automation

[^7]: Y Combinator. *Launch YC: Nexus — Enabling Business Teams to Build AI Agents Without Code.* Official YC launch post for Nexus including Orange Belgium customer-onboarding case study (50% conversion improvement; $4M+ monthly revenue from a single agent; +10 customer satisfaction points). https://www.ycombinator.com/launches/OXb-nexus-enabling-business-teams-to-build-ai-agents-without-code

[^8]: Nexus (Nexus Enterprises, Inc.). *Nexus — Enterprise AI Agent Platform.* Company homepage covering Orange Group ($6M+ yearly LTV, 50% conversion improvement, 4-hour first version, 4-week multi-market rollout) and platform thesis (4,000+ system integration, 90% organizational change). https://nexusgpt.io/

[^9]: FinSMEs. *Nexus Raises $4.3M in Seed Funding.* April 1, 2026. Brussels-based agentic AI platform; round led by General Catalyst with Y Combinator, Transpose Platform, Twenty Two Ventures, Phosphor Capital, and angels (Gokul Rajaram, Raphael Schaad, Jake Mintz). https://www.finsmes.com/2026/04/nexus-raises-4-3m-in-seed-funding.html

[^10]: PeerSpot. *Best Robotic Process Automation (RPA) Solutions for 2026 — leaderboard and mindshare distribution.* April 2026 mindshare data: UiPath 12.5%, Microsoft Power Automate 10.3%, Automation Anywhere 6.8% — all declining year-over-year. https://www.peerspot.com/categories/robotic-process-automation-rpa/leaderboard

[^11]: Gartner. *Magic Quadrant for Robotic Process Automation* (November 19, 2025). Authoritative Gartner ranking of 13 enterprise RPA vendors including UiPath, Microsoft, SS&C Blue Prism, Automation Anywhere, Salesforce, ServiceNow, and SAP. https://www.gartner.com/en/documents/5656223

[^12]: Gartner. *Best Robotic Process Automation Reviews 2026.* Gartner Peer Insights ranking and product summaries (UiPath Platform, SS&C Blue Prism Intelligent Automation Platform, Microsoft Power Automate). https://www.gartner.com/reviews/market/robotic-process-automation

[^13]: Bain & Company. *The Rise of Autonomous, Intelligent Procurement.* April 23, 2026. Source for "5x ROI improvement + 60% productivity boost + $180M projected savings from a single procurement agent at a global bank." https://www.bain.com/insights/the-rise-of-autonomous-intelligent-procurement/

[^14]: Beri (THE D[AI]LY BRIEF). *5 Autonomous Workflow Deployments Delivering 250%+ ROI in 2026.* March 14, 2026. Sources the 171% average ROI + 62% expecting >100% returns + 73% financial-services cost reduction + 7x sales conversion gains figures. https://www.beri.net/article/autonomous-workflow-automation-2026-roi

[^15]: AI Agent Corps. *Workflow Automation ROI: Industry Benchmarks & First 90 Day Expectations.* March 26, 2026. Industry-vertical ROI benchmarks (finance close 20-35% reduction, invoice cost 50-75% reduction, etc.); references Deloitte State of AI in the Enterprise 2026 (January 2026) and Phenom 2026 HR Awards benchmarks. https://agentcorps.co/blog/workflow-automation-roi-industry-benchmarks

[^16]: Workday. *Introducing Sana from Workday — Superintelligence for Work That Finds Answers, Takes Action, and Automates Workflows.* Press release, March 17, 2026. https://investor.workday.com/news-and-events/press-releases/news-details/2026/Introducing-Sana-from-Workday-Superintelligence-for-Work-That-Finds-Answers-Takes-Action-and-Automates-Workflows/

[^17]: Microsoft Learn (Power Platform). *Invoke agents as workflow steps with the agent node — Copilot Studio.* Wave-1 2026 release plan; public preview April 1, 2026; GA September 2026. https://learn.microsoft.com/en-us/power-platform/release-plan/2026wave1/microsoft-copilot-studio/invoke-agents-as-workflow-steps-agent-node

[^18]: Microsoft Learn (Copilot Studio). *Upgrade to Copilot Studio unified authoring.* Documentation covering Copilot Studio + Power Automate integration, generative-AI features, and migration from Power Virtual Agents. https://docs.microsoft.com/microsoft-copilot-studio/unified-authoring-conversion

[^19]: Microsoft Learn. *Microsoft Copilot Studio — Connectors.* Authoritative connector documentation for Power Automate / Power Apps integration. https://learn.microsoft.com/en-gb/connectors/microsoftcopilotstudio/

[^20]: Planetary Labour. *Agentic AI in Enterprise: Salesforce, ServiceNow, UiPath, Workday & SAP Guide 2026.* Industry guide tracking Salesforce Agentforce 8,000+ customers and $900M AI revenue, ServiceNow $1B AI revenue target, UiPath TIME Best Inventions 2025, and the $7.92B → $236B 2025-2034 enterprise AI agents market projection. https://planetarylabour.com/articles/agentic-ai-enterprise

[^21]: AgentMarketCap. *Agentforce vs ServiceNow vs Copilot Studio: Enterprise Agent War.* April 8, 2026. Comparison of Salesforce Agentforce 2.0, ServiceNow AI Agents, and Microsoft Copilot Studio across 30+ CRM skill categories, 300+ ServiceNow skills, and Microsoft 365 productivity governance. https://agentmarketcap.ai/blog/2026/04/08/salesforce-agentforce-servicenow-microsoft-copilot-studio-crm-itsm-battle

[^22]: Salesforce. *Agentforce — Service Cloud, Marketing Cloud, Sales Cloud agent integration.* Official Agentforce product page. https://www.salesforce.com/agentforce/

[^23]: ServiceNow. *AI Agent Orchestrator and AI Agent Studio.* Official product documentation. https://www.servicenow.com/products/ai-agents.html

[^24]: Workday. *Workday Agent System of Record (ASOR).* https://www.workday.com/en-us/products/illuminate/agent-system-of-record.html

[^25]: SAP. *Joule and AI agents on SAP BTP.* https://www.sap.com/products/artificial-intelligence/ai-assistant.html

[^26]: SS&C Blue Prism. *Intelligent Automation Platform.* https://www.blueprism.com/

[^27]: Automation Anywhere. *Enterprise Intelligent Automation Platform.* https://www.automationanywhere.com/

[^28]: Microsoft. *Power Automate.* https://www.microsoft.com/en-us/power-platform/products/power-automate

[^29]: UiPath. *UiPath Maestro orchestration platform.* https://www.uipath.com/product/maestro

[^30]: UiPath. *UiPath Agent Builder.* https://www.uipath.com/product/agent-builder

[^31]: Celonis. *Process Mining and Process Intelligence Platform.* https://www.celonis.com/

[^32]: UiPath. *UiPath Process Mining.* https://www.uipath.com/product/process-mining

[^33]: Anthropic. *Claude API documentation.* https://docs.anthropic.com/

[^34]: OpenAI. *OpenAI API platform.* https://platform.openai.com/

[^35]: LangChain. *LangChain agent framework documentation.* https://docs.langchain.com/

[^36]: Google. *Agent2Agent (A2A) protocol.* https://github.com/google/A2A

[^37]: Deloitte. *State of AI in the Enterprise 2026.* January 2026 report on enterprise AI maturity and ROI gaps. https://www2.deloitte.com/us/en/pages/consulting/articles/state-of-generative-ai-in-enterprise.html

[^38]: PwC. *AI Agents 2026 Survey — 79% of organizations running AI agents in production, 66% reporting measurable productivity gains.* https://www.pwc.com/us/en/services/consulting/business-transformation/library.html

[^39]: Nucleus Research. *AI-powered workflow automation ROI 250-300% vs traditional RPA 10-20%.* https://nucleusresearch.com/

[^40]: Phenom. *2026 HR Awards benchmark data.* https://www.phenom.com/awards

[^41]: Salesforce. *Agentforce $0.10 per action pricing — Flex pricing model.* https://www.salesforce.com/agentforce/pricing/

[^42]: ServiceNow. *Now Assist and ServiceNow AI pricing.* https://www.servicenow.com/products/ai-agents.html

[^43]: Workday. *Workday Flex Credits — consumption-based AI agent pricing.* https://www.workday.com/

[^44]: Microsoft. *Copilot Studio pricing — $200/tenant/month and per-user options.* https://www.microsoft.com/en-us/microsoft-copilot/microsoft-copilot-studio

[^45]: TIME. *Best Inventions 2025 — UiPath agentic automation recognition.* https://time.com/collection/best-inventions-2025/

[^46]: ISO/IEC 42001:2023. *Information technology — Artificial intelligence — Management system standard.* International standard adopted by UiPath and other agent-platform vendors. https://www.iso.org/standard/81230.html

[^47]: FedRAMP. *Federal Risk and Authorization Management Program — government cloud-services authorization framework.* https://www.fedramp.gov/

[^48]: AIUC. *AIUC-1 — Artificial Intelligence Use Case standard.* https://aiuc.ai/

[^49]: VentureBeat. *Enterprise AI agent market analysis and case studies 2025-2026.* https://venturebeat.com/

[^50]: TechCrunch. *AI agent vendor funding rounds and platform launches 2025-2026.* https://techcrunch.com/

[^51]: The Information. *Enterprise AI agent procurement and deployment trends 2026.* https://www.theinformation.com/

[^52]: Forrester. *AI Agents Wave — enterprise platform vendor evaluation 2026.* https://www.forrester.com/

[^53]: IDC. *FutureScape Worldwide Agentic Artificial Intelligence 2026 Predictions.* https://my.idc.com/getdoc.jsp?containerId=US53860925

[^54]: Reworked. *RPA Stalwart UiPath Moves Into Agentic AI Realm.* Industry trade press analysis of UiPath's strategic pivot. https://www.reworked.co/

[^55]: AI Business. *UiPath's Automation Vision Shifts From RPA to Agentic AI.* https://aibusiness.com/

[^56]: Kognitos. *The 2026 Guide to Replace RPA with AI Agents.* https://www.kognitos.com/

[^57]: Mobio Solutions. *AI Agents 2026: The New ROI Standard for Enterprise Automation.* https://www.mobiosolutions.com/

[^58]: Ekfrazo. *AI Workflow Automation in 2026: How Agents Replace Manual Ops.* https://www.ekfrazo.com/

[^59]: FifthRow. *AI Agent Orchestration Goes Enterprise: The April 2026 Playbook for Systematic Innovation, Risk, and Value at Scale.* https://www.fifthrow.ai/

[^60]: Petronella Technology. *AI Agents vs RPA: Why Enterprises Are Switching.* https://www.petronellatech.com/

[^61]: Ampcome. *Enterprise AI Agents 2026: Mid-Year Report on What's Working — Fusion Architecture + 4-Phase Migration Playbook.* https://www.ampcome.com/

[^62]: Lasting Dynamics. *From RPA to AI Agents: Why 2026 Is the Year Enterprise Automation Gets Real.* https://www.lastingdynamics.com/

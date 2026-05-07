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
---

# RPA to AI Agents: The Enterprise Migration Playbook

## Foreword

This is an operator-flavored cross-vertical operations playbook decoding the 2026 enterprise RPA-to-AI-agent migration — the first paper in the perea.ai/research canon focused exclusively on the RPA-augmentation thread that intersects every vertical (legal #16, insurance #17, healthcare #19, accounting #20, CRE #21, construction #22, banking #32). Derived from computer-use-deployment-overhang #6, agentic-procurement-field-manual #2, B2A-2026 #1, and tightened by the cross-vertical operator playbooks (#23-#31), this paper decodes the structural transition that the largest enterprise IT investments of the 2015-2024 era — UiPath, Microsoft Power Automate, Blue Prism, Automation Anywhere — are now navigating.

**The frame this paper holds: in 2026, RPA is not being replaced by AI agents. RPA is being augmented by AI agents in a fusion architecture where AI handles reasoning + intent + adaptation, and RPA handles deterministic execution + bot reliability + audit trails.** Organizations getting the most value from agentic AI in 2026 are not throwing away their RPA infrastructure — they are building AI agents on top of it. An AI agent might receive an unstructured invoice via email, extract relevant data fields, validate them against purchase orders in the ERP system, and then trigger an existing RPA bot to execute the final payment workflow. **Enterprise migration in 2026 is fusion, not replacement.**

This paper synthesizes five canonical 2026 reference points. **UiPath's Dexcom case study**: Dexcom is on pace to hit a 200,000-hour annual savings target in 2026, anchored on a 2019 platform switch where 80% of robots were rebuilt — turning the platform-switch evaluation moment into a Phase 1 RPA → Phase 2 Document Understanding (extracting prescription data) → Phase 3 chatbots with NLP + process mining + advanced AI migration. **Nexus's $4.3M / €3.7M seed** (March 31, 2026, General Catalyst + YC-led) for business-team agent deployment without engineering dependency, with 4,000+ enterprise-system integrations and the Orange Telecom 4-week customer-onboarding deployment achieving 50% conversion improvement and $6M+ annual lifetime value with a single agent. **The four-vendor RPA mindshare shift**: Microsoft Power Automate + UiPath + Blue Prism + Automation Anywhere; Blue Prism declined from 20.2% to 15.9% Jan 2026; UiPath maintains leadership at 8,563 companies + 8 of 10 Fortune 500. **The fusion strategic posture**: AI agents on top of RPA infrastructure rather than replacement. **The 2026 ROI benchmarks**: 171% average AI workflow automation ROI; 62% organizations expecting returns above 100%; finance/procurement 70% cost reductions; HR 80% onboarding cycle reductions; sales 4-7x conversion improvements.

Out of those reference points, this paper extracts: (1) the fusion-not-replacement strategic posture; (2) the 4-phase enterprise migration playbook (Discover + Prioritize + Pilot + Scale); (3) the screen-level vs reasoning-level capability decision tree; (4) the bot-portability $200K-$500K cost reality across vendors; (5) the highest-ROI 2026 workflow priorities; (6) the build-vs-buy-vs-partner founder positioning; (7) the 12-18-month enterprise migration timeline.

## Executive Summary

1. **Enterprise RPA-to-AI-agent migration in 2026 is fusion, not replacement — AI handles reasoning + intent + adaptation, RPA handles deterministic execution + bot reliability + audit trails.** The dominant enterprise pattern: AI agent receives unstructured input (email, document, conversation), uses reasoning to extract intent and validate against business rules, then invokes existing RPA bots for deterministic execution. **An invoice arrives by email; AI extracts fields + validates against POs in ERP; RPA bot executes payment workflow + updates ledger + logs audit trail.** Organizations that throw away RPA infrastructure to "go AI-native" lose the deterministic reliability + audit traceability + compliance tooling already built into RPA platforms. Organizations that augment with AI capture the 171%-average-ROI 2026 benchmark while preserving deterministic execution layers that satisfy SOC 2 + ISO 27001 + audit-compliance requirements.

2. **UiPath maintains RPA leadership in 2026 — 8,563 companies globally, 8 of 10 Fortune 500 firms, Dexcom 200,000-hour annual savings target — but UiPath is itself pivoting to agentic AI as the strategic flagship.** UiPath launched on-premises Agentic AI for public sector deployments and shipped Agentic Automation Platform features through 2026. UiPath's strategic posture: RPA + AI fusion at platform level, with the AI Trust Layer providing observability + governance for both deterministic RPA bots and agentic AI agents. **Founder-implication: UiPath is simultaneously the largest enterprise RPA installed base AND a competing agentic-AI platform vendor — a dual-incumbent dynamic per paper #30 that founders must navigate via fusion-architecture positioning rather than RPA-replacement positioning.**

3. **Blue Prism mindshare declined from 20.2% (Jan 2025) to 15.9% (Jan 2026) — the canonical 2026 RPA-vendor-deceleration signal.** Blue Prism's relative weakness vs UiPath + Microsoft Power Automate + Automation Anywhere creates the canonical 2026 platform-switch window where enterprises evaluate AI agent deployment alongside RPA-platform-replacement decisions. **The platform-switch moment is the highest-leverage RPA-to-AI-agent migration trigger** — Dexcom's 2019 80%-bot-rebuild-during-platform-switch is the canonical operator pattern. **Migration costs**: $200K-$500K to switch between the four major RPA vendors (Microsoft Power Automate, UiPath, Blue Prism, Automation Anywhere) — bot codes are NOT portable across platforms because each has distinct architecture, framework, and code binding.

4. **Nexus's Orange Telecom case study is the 2026 reference template for AI-agent-deployment-without-engineering-dependency: 4-week deployment + 50% conversion improvement + $6M+ annual lifetime value with a single agent.** Nexus raised $4.3M / €3.7M seed (March 31, 2026, General Catalyst + Y Combinator + Transpose Platform + Twenty Two Ventures + Phosphor Capital) to enable business teams to build and deploy autonomous AI agents without engineering dependency, integrating across 4,000+ enterprise systems and delivering measurable business outcomes in weeks, not months. **Nexus + similar business-team-build platforms (UiPath Agent Builder, Microsoft Copilot Studio, Salesforce Agentforce) are the canonical 2026 enterprise AI-agent deployment surface** — they bypass the engineering-team-bottleneck that RPA programs hit in 2018-2022 and deliver 4-12-week deployment cycles.

5. **The 4-phase enterprise migration playbook is the canonical 2026 operator framework.** **Phase 1 — Discover and Prioritize**: process intelligence + SME workshops to surface pain points where unstructured inputs and exception volume are high. Score by business impact and control complexity. Output: prioritized workflow inventory with high-volume, rules-heavy candidates. **Phase 2 — Define Outcomes and Guardrails**: agent goals + authority limits + approval paths + SLAs. Output: pilot specification + KPI-anchored success criteria. **Phase 3 — Pilot Small with Complete Auditable Slice**: choose one high-volume, rules-heavy workflow + define success upfront + treat prompts and playbooks like product code + set thresholds for human-in-the-loop review. Output: production-grade pilot with documented business outcomes. **Phase 4 — Scale and Iterate**: expand coverage workflow-by-workflow + build out the agent registry + integrate with existing RPA infrastructure + measure 12-month renewal-conversion KPIs. Output: 4-8 production agents at scale with documented ROI.

6. **Screen-level vs reasoning-level is the canonical capability decision tree for 2026 RPA-vs-AI-agent allocation.** **Screen-level (RPA stays)**: deterministic, repetitive, rules-heavy workflows with stable UI surfaces and zero exception tolerance — payment processing, regulatory filings, periodic reconciliations, scheduled batch jobs, EDI translation. RPA's "If This, Then That" logic is operationally optimal here, and the audit trail + deterministic replay supports compliance. **Reasoning-level (AI agents win)**: workflows with unstructured input, dynamic decision boundaries, exception handling, multi-system orchestration, customer interaction, document understanding. AI agents' "intent-based" execution adapts when buttons move + UI changes + edge cases surface. **Fusion (most workflows)**: AI agent triages unstructured input + classifies intent + handles exceptions, then dispatches to RPA bot for deterministic execution. **Founder-rule**: do not architect AI-agent-replaces-RPA when fusion delivers 80% of the value at 30% of the migration cost.

7. **The 2026 ROI benchmarks anchor pricing + KPI-renewal-terms + acquisition multiples.** **Average AI workflow automation ROI: 171%**, with **62% of organizations expecting returns above 100%**. **Finance + procurement workflows: up to 70% cost reduction** (highest-ROI 2026 priority — accounts payable + invoice processing + procure-to-pay). **HR deployments: up to 80% onboarding cycle reduction**. **Sales deployments: 4x to 7x conversion rate improvements**. **Highest-ROI 2026 priorities**: financial services invoice processing + accounts payable automation + customer support tier-1 resolution + dispute/fraud workflow automation. **Founder-implication**: anchor pricing + KPI-renewal-terms to vertical-specific ROI benchmarks per paper #31 implementation-gap conversion methodology + paper #20 accounting + paper #32 banking.

## Part I — The Fusion-Not-Replacement Strategic Posture

The dominant 2026 enterprise pattern is RPA + AI agents in fusion architecture, not RPA-replacement-by-AI-agents.

**The mechanical fusion pattern**: AI agent receives unstructured input (email + document + conversation). Uses reasoning to extract intent + validate against business rules. Dispatches to existing RPA bot for deterministic execution. The AI handles the cognitive layer; the RPA handles the execution layer.

**Concrete example — accounts payable workflow.**
- **Step 1 (AI agent)**: Receive vendor invoice via email. Extract vendor name + invoice number + line items + total + due date. Validate against purchase order in ERP. Flag exceptions (missing PO, line-item mismatch, duplicate invoice).
- **Step 2 (AI agent)**: Route to approver based on business rules (amount thresholds, vendor categories, cost-center routing). Track approval workflow.
- **Step 3 (RPA bot)**: On approval, execute payment workflow. Update GL. Generate payment confirmation. Email vendor. Log audit trail.

**Why fusion wins over replacement.**
- **Deterministic execution preserves compliance.** RPA bots have audit-trail + deterministic-replay + SOC 2 + ISO 27001 + audit-compliance integration already in place. AI agents introduce probabilistic behavior that audit functions struggle to validate.
- **Existing RPA investment is preserved.** UiPath's 8,563 companies + Microsoft Power Automate's enterprise base + Blue Prism's 15.9% mindshare + Automation Anywhere's installed footprint represent billions of dollars of accumulated enterprise RPA investment. Throwing this away is a multi-year migration that captures less ROI than fusion.
- **Migration cost is dramatically lower.** Fusion requires AI-agent-on-top integration ($50-200K per workflow). Replacement requires full RPA-bot-rebuild ($200K-$500K per platform switch).
- **Speed-to-value is faster.** Fusion delivers 4-12 weeks per workflow. Replacement delivers 6-18 months per workflow.

**When replacement is correct**: only for greenfield workflows + workflows with no existing RPA + workflows where the screen-level execution itself is no longer applicable (e.g., the underlying enterprise systems migrated from on-prem to API-first SaaS, eliminating the screen-scraping use case).

**Founder-implication**: position products as **"fusion-architecture-compatible"** with explicit RPA integration patterns, not as RPA-replacement. Vendors who position as RPA-replacement face buyer resistance from CIOs who have championed multi-year RPA programs and are reluctant to write off the investment. Vendors who position as fusion-architecture get faster deal close + higher pricing + lower buyer-procurement friction.

## Part II — UiPath Dexcom: The Canonical 200,000-Hour Migration Case

UiPath's Dexcom case study is the canonical 2019-2026 enterprise RPA-to-AI-agent migration template.

**Background.** Dexcom is a continuous glucose monitoring company growing 50% annually in 2019. Their German operations had a critical bottleneck: prescription intake via a dot matrix printer, manually keyed at ~300 prescriptions/week — a number that quickly grew to 600/week + continued expanding.

**The 2019 platform switch trigger.** Dexcom faced a unique opportunity to rebuild 80% of their robots due to a platform switch and made the strategic decision to transition from their previous RPA vendor to UiPath. This is the canonical platform-switch RPA-evaluation moment that becomes the AI-augmentation entry point.

**Phase 1 (2019-2021) — Rules-based RPA.** Initial focus on traditional UiPath RPA: bot-driven prescription data entry, scheduled batch processes, exception handling via business-rules engine. Output: stable RPA platform replacing legacy vendor.

**Phase 2 (2022-2024) — Document Understanding.** UiPath Document Understanding extracts and processes information from each prescription — no matter how bad the handwriting. AI-driven OCR + NER + intent classification on top of the underlying RPA bot infrastructure. Output: 50%+ reduction in manual prescription processing time.

**Phase 3 (2025-2026) — Chatbots with NLP + process mining + advanced AI.** Dexcom is exploring chatbots with natural language processing + introducing process mining + envisioning advanced AI to further enhance automation capabilities. Output: 200,000-hour annual savings target on track for 2026.

**The Dexcom playbook is the canonical 2019-2026 enterprise RPA-to-AI-agent migration arc.** Founders + operators reference Dexcom + similar 5-7-year migration arcs as the realistic enterprise timeline. **The platform-switch moment in 2019 was the catalyst** — without that switch, Dexcom would not have rebuilt 80% of their robots and gained the AI-augmentation entry point. **Operators evaluating their own RPA programs should look for the next platform-switch trigger** (vendor renewal, license-cost increase, capability gap, AI-product addition) as the highest-leverage migration window.

## Part III — Nexus + Business-Team-Build: The 4-Week Deployment Reference

Nexus is the canonical 2026 business-team-build agent platform reference. Brussels-based agentic AI platform raised $4.3M / €3.7M seed (March 31, 2026) led by General Catalyst with Y Combinator + Transpose Platform + Twenty Two Ventures + Phosphor Capital + angels.

**The Orange Telecom case study.** Orange (one of the largest European telecom carriers) deployed a customer-onboarding agent with Nexus in **four weeks**, achieving **50% conversion improvement** and generating **more than $6 million in annual lifetime value** with a single agent.

**The platform thesis.** Nexus enables business teams to build and deploy autonomous AI agents without engineering dependency. Integration across **4,000+ enterprise systems**. Measurable business outcomes in weeks, not months. **The structural difference vs RPA programs of 2018-2022**: business teams (not engineering teams) own agent deployment. Engineering bottleneck eliminated. Time-to-deployment compressed from 6-18 months (typical RPA) to 4-12 weeks (typical Nexus / UiPath Agent Builder / Microsoft Copilot Studio / Salesforce Agentforce).

**Adjacent business-team-build platforms in 2026.**
- **UiPath Agent Builder + Agentic Automation Platform** (incumbent + dual-incumbent positioning per paper #30).
- **Microsoft Copilot Studio** (Microsoft 365 integration + Power Automate fusion).
- **Salesforce Agentforce** (Service Cloud + Marketing Cloud + Sales Cloud agent integration).
- **Workday AI Agent System of Record** (Workday Sana 2026 GA per paper #20 accounting).
- **ServiceNow AI Agent Studio** (ITSM + customer service + HR agent deployment).

**Founder-implication**: business-team-build platforms are commoditizing rapidly across major enterprise software vendors. Founders building horizontal AI agent platforms face direct competition from these vendor-platforms; founders building **vertical-specific** AI agent platforms (per paper #23 corpus moat + paper #28 validation panel + paper #29 compliance) avoid horizontal commoditization and capture deeper customer relationships.

## Part IV — The 4-Phase Enterprise Migration Playbook

**Phase 1 — Discover and Prioritize (Months 0-3).** Process intelligence + SME workshops to surface pain points where unstructured inputs and exception volume are high. Score by business impact and control complexity.
- **Deliverable**: prioritized workflow inventory with high-volume, rules-heavy candidates flagged for AI-agent augmentation.
- **Tools**: process-mining (Celonis + UiPath Process Mining + Workday Workflow), SME interviews, exception-rate analysis.
- **Cost benchmark**: $50-200K consulting investment + customer-internal team time.
- **Success criteria**: 8-20 prioritized workflows ranked by business-impact-and-feasibility.

**Phase 2 — Define Outcomes and Guardrails (Months 3-5).** Agent goals + authority limits + approval paths + SLAs.
- **Deliverable**: pilot specification with KPI-anchored success criteria + risk-control framework + auditability requirements.
- **Tools**: KPI tree + decision-rights matrix + risk-control matrix + integration mapping.
- **Cost benchmark**: $30-100K specification investment.
- **Success criteria**: pilot specification approved by Chief Process Officer + Chief Risk Officer + Chief Compliance Officer.

**Phase 3 — Pilot Small with Complete Auditable Slice (Months 5-12).** Choose one high-volume, rules-heavy workflow + define success upfront + treat prompts and playbooks like product code + set thresholds for human-in-the-loop review.
- **Deliverable**: production-grade pilot with documented business outcomes + audit trail + monitoring infrastructure.
- **Tools**: AI-agent platform (Nexus / UiPath Agent Builder / Microsoft Copilot Studio / Salesforce Agentforce) + observability + change-management.
- **Cost benchmark**: $200K-$1M per pilot (vendor + integration + customer-side staff time + pilot infrastructure).
- **Success criteria**: 12-week production pilot achieves KPI-anchored success threshold (e.g., 70% AP cost reduction, 80% HR onboarding cycle reduction, 4-7x sales conversion).

**Phase 4 — Scale and Iterate (Months 12-24).** Expand coverage workflow-by-workflow + build out the agent registry + integrate with existing RPA infrastructure + measure 12-month renewal-conversion KPIs.
- **Deliverable**: 4-8 production agents at scale with documented ROI + agent registry + lifecycle ownership + continuous monitoring.
- **Tools**: agent registry (per paper #32 banking) + agent-life-cycle ownership + continuous monitoring + embedded fail-safes + human-on-the-loop.
- **Cost benchmark**: $1-5M cumulative scale-out investment.
- **Success criteria**: 12-month renewal at 1.4-1.7x cohort velocity + post-pilot expansion to second + third workflow per paper #31 implementation-gap conversion methodology.

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

**Founder-rule**: do not architect AI-agent-replaces-RPA when fusion delivers 80% of the value at 30% of the migration cost. Fusion is the dominant 2026 enterprise pattern across all 7 verticals (legal, insurance, healthcare, accounting, CRE, construction, banking).

## Part VI — Bot Portability + Migration Cost Reality

Bot codes are NOT portable across the four major RPA vendors (Microsoft Power Automate, UiPath, Blue Prism, Automation Anywhere). Each platform has distinct architecture, framework, and code binding — migration of bot codes among different RPA tools is not feasible.

**Migration costs to switch RPA vendors: $200K-$500K** (depending on bot count + complexity + change-management investment). Bot rebuild + retesting + integration validation + audit-trail re-establishment.

**The canonical enterprise question**: should the enterprise switch RPA vendors and rebuild bots, or augment current RPA with AI agents?

**Decision matrix.**
- **Switch + rebuild** if: current RPA vendor is in mindshare decline (Blue Prism's 20.2% → 15.9% trajectory), license costs increasing > 30% YoY, vendor's AI capability is structurally inferior, capability gap is not closeable.
- **Stay + augment** if: current RPA vendor offers viable AI augmentation pathway (UiPath Agent Builder, Microsoft Copilot Studio + Power Automate, Automation Anywhere IQ Bot), enterprise has > 100 bots in production, change-management bandwidth is constrained.
- **Hybrid** if: critical workflows already on current RPA + new workflows can be deployed on alternative vendor + cross-vendor orchestration available.

**The Dexcom 2019 trigger pattern**: the platform-switch + 80%-bot-rebuild moment is the highest-leverage AI-augmentation entry point. Operators looking for the next entry point should monitor RPA-vendor mindshare shifts (Blue Prism's decline is the canonical 2026 signal), license-cost cycles, and capability-gap announcements.

## Part VII — Highest-ROI 2026 Workflow Priorities

The 2026 ROI data identifies four highest-priority enterprise workflows for AI-agent + RPA fusion deployment:

**1. Financial services invoice processing.** Highest-volume + rules-heavy + clear before/after metrics. Up to 70% cost reduction. AI handles unstructured invoice extraction + validation; RPA handles payment execution + GL update + audit trail.

**2. Accounts payable automation.** Adjacent to invoice processing but extends to vendor onboarding + duplicate-invoice detection + early-payment-discount optimization + 3-way matching. Up to 70% cost reduction.

**3. Customer support tier-1 resolution.** AI-agent triage + intent classification + knowledge-base retrieval + customer routing. RPA handles backend system updates + ticket-status changes + downstream workflow triggers. 4-7x conversion improvements when customers get faster + more-complete first-touch resolution.

**4. Dispute/fraud workflow automation.** AI-agent pattern detection + risk scoring + workflow routing. RPA handles case-management updates + customer notification + compliance reporting. Highest-stakes + highest-ROI for banking + financial services + e-commerce.

**Adjacent high-ROI workflows.**
- **HR onboarding** (80% cycle reduction): document collection + verification + system provisioning + compliance training assignment.
- **Sales lead qualification** (4-7x conversion): inbound lead triage + scoring + CRM enrichment + handoff to sales rep.
- **Procurement** (50%+ cost reduction): RFP automation + vendor evaluation + contract negotiation support + spend analysis.
- **Compliance reporting**: regulatory filing prep + data-collection + cross-system reconciliation + audit-trail generation.

**Founder-implication**: position products against the four highest-ROI workflows + the adjacent priorities for vertical-specific extensions (legal contract review per paper #16; insurance claims triage per paper #17; healthcare clinical workflow per paper #19; accounting close-day automation per paper #20; CRE deal-flow per paper #21; construction RFI automation per paper #22; banking BSA/AML alert triage per paper #32).

## Part VIII — Build vs Buy vs Partner: Founder Positioning

For founders building products in the RPA-augmentation + AI-agent-deployment space, the build-vs-buy-vs-partner decision shapes the GTM motion.

**Build (full-stack AI agent platform).** Examples: Nexus, agent.nexus, custom-built fully-integrated enterprise AI agent platforms. Cost: $5-15M Series A investment + 18-30 months build cycle. Best for: vertical-specific platforms targeting concentrated buyer cohorts. Risk: horizontal commoditization from UiPath + Microsoft + Salesforce + Workday + ServiceNow agent platforms.

**Buy (acquire RPA vendor + add AI).** Examples: PE-backed roll-up of Blue Prism + Automation Anywhere installed bases. Cost: $500M-$5B acquisition + integration overhead. Best for: PE-platform-acquirer + Vista-Equity-Agentic-AI-Factory-style consolidation per paper #30. Risk: integration-overhang depresses post-merger growth.

**Partner (integrate with incumbent RPA + business-team-build platforms).** Examples: Articulate-on-Procore (paper #22 construction), Vic.ai-on-Workday + Big-4 (paper #20 accounting), Trullion-on-FloQast + Big-4. Cost: $1-5M partnership investment + integration overhead. Best for: vertical-specific founders avoiding horizontal commoditization while leveraging incumbent distribution. Risk: dual-incumbent dynamic per paper #30 — the partner is also the competitor.

**Founder-rule**: vertical-specific founders win on partnership-with-incumbent-RPA + AI-agent-overlay + corpus-moat + compliance-moat. Horizontal AI-agent founders face commoditization headwinds from incumbent platform vendors.

## Closing

Three furniture pieces a founder should carry away.

**Position products as fusion-architecture-compatible — not RPA-replacement.** AI agents on top of existing RPA infrastructure preserve enterprise audit-trail + deterministic execution + compliance posture while capturing 171%-average-ROI 2026 benchmarks. Vendors who position as RPA-replacement face buyer resistance from CIOs who championed multi-year RPA programs.

**Anchor migration to vertical-specific highest-ROI workflows.** Financial services invoice processing + accounts payable automation + customer support tier-1 + dispute/fraud workflow automation — plus vertical-specific extensions (legal contract review + insurance claims triage + healthcare clinical workflow + accounting close-day + CRE deal-flow + construction RFI + banking BSA/AML). The 70% finance/procurement cost reduction + 80% HR onboarding cycle reduction + 4-7x sales conversion improvement benchmarks anchor pricing + KPI-renewal-terms + acquisition multiples.

**Run the 4-phase 12-18-month enterprise migration playbook.** Phase 1 Discover + Prioritize. Phase 2 Define Outcomes + Guardrails. Phase 3 Pilot Small with Complete Auditable Slice. Phase 4 Scale and Iterate. Skip Phase 1 + Phase 2 and fall into the implementation-gap chasm (paper #31). Extend beyond 24 months and face budget + change-management fatigue. **The opportunity in 2026 is to walk into enterprise RPA-augmentation deals with fusion-architecture positioning + vertical-specific workflow targeting + 4-phase migration methodology + screen-level-vs-reasoning-level decision tree + 12-18-month timeline. Capture the canonical 171%-average-ROI benchmark with finance/procurement 70% cost reduction + HR 80% onboarding cycle reduction + sales 4-7x conversion. Avoid horizontal commoditization from UiPath + Microsoft + Salesforce + Workday + ServiceNow business-team-build platforms by positioning as vertical-specific with corpus + compliance + workflow-integration moats. Founders who execute reach Nexus / Orange-Telecom / Dexcom / UiPath trajectory outcomes — 4-week deployment + 50% conversion improvement + $6M+ annual lifetime value with single agent or 200,000-hour annual savings target. Founders who position as RPA-replacement default to multi-year buyer resistance + slower deal close + horizontal commoditization risk. The choice is no longer optional — the Blue Prism 20.2% → 15.9% mindshare decline + Microsoft Power Automate + UiPath dual-incumbent + Salesforce Agentforce + Workday Agent System of Record + ServiceNow AI Agent Studio four-vendor commoditization signals make Q2-Q4 2026 the canonical decision window.**

## References

[1] UiPath. (2026). *AI-Powered Automation Helps Dexcom Unlock 200,000 Hours — Phase 1-2-3 Strategic Transition + 2019 Platform Switch + Document Understanding + Process Mining + Advanced AI Roadmap.*

[2] UiPath. (2026). *UiPath 2026 AI and Agentic Automation Trends Report.*

[3] UiPath Investor Relations. (2026). *UiPath Launches Agentic AI Solutions to Break Administrative and Financial Bottlenecks for Clinicians and Healthcare Admins + UiPath Launches On-Premises Agentic AI for Public Sector.*

[4] AI Business + Reworked. (2026). *RPA Stalwart UiPath Moves Into Agentic AI Realm + UiPath's Automation Vision Shifts From RPA to Agentic AI.*

[5] Nexus (Brussels). (2026, March 31). *$4.3M / €3.7M Seed Round Led by General Catalyst with Y Combinator + Transpose Platform + Twenty Two Ventures + Phosphor Capital — Enterprise AI Agent Platform for Business Teams Without Engineering Dependency, 4,000+ Enterprise System Integration.*

[6] Nexus + Orange Telecom. (2026). *Customer Onboarding Agent — 4-Week Deployment + 50% Conversion Improvement + $6M+ Annual Lifetime Value with Single Agent.*

[7] EU-Startups + BeBeez International + The Next Web. (2026, April 1). *Brussels-Based Nexus Lands €3.7 Million to Bring AI Agents into Core Business Operations.*

[8] SS&C Blue Prism + UiPath + Automation Anywhere + Microsoft Power Automate. (2025-2026). *Top 4 RPA Vendors Comparison + Mindshare Shifts — Blue Prism Mindshare Declined to 15.9% (January 2026) Down from 20.2% (January 2025); UiPath Maintains Leadership at 8,563 Companies + 8 of 10 Fortune 500 Firms.*

[9] Blueprint Software Systems. (2026). *RPA Migration Solutions + What to Consider When Migrating RPA Bots Between the 4 Major Automation Platforms — $200K-$500K Migration Cost + Bot Codes Not Portable Across Platforms.*

[10] Lasting Dynamics. (2026). *From RPA to AI Agents: Why 2026 Is the Year Enterprise Automation Gets Real.*

[11] Ampcome. (2026). *Enterprise AI Agents 2026: Mid-Year Report on What's Working — Fusion Architecture + 4-Phase Migration Playbook.*

[12] Kognitos. (2026). *The 2026 Guide to Replace RPA with AI Agents.*

[13] Mobio Solutions. (2026). *AI Agents 2026: The New ROI Standard for Enterprise Automation — 171% Average ROI + 62% Organizations Expecting Returns Above 100%.*

[14] Ekfrazo. (2026). *AI Workflow Automation in 2026: How Agents Replace Manual Ops — Finance/Procurement 70% Cost Reduction + HR 80% Onboarding Cycle Reduction + Sales 4-7x Conversion Improvement.*

[15] FifthRow. (2026, April). *AI Agent Orchestration Goes Enterprise: The April 2026 Playbook for Systematic Innovation, Risk, and Value at Scale.*

[16] Petronella Technology. (2026). *AI Agents vs RPA: Why Enterprises Are Switching.*

[17] Microsoft Copilot Studio + Salesforce Agentforce + Workday Agent System of Record + ServiceNow AI Agent Studio. (2026). *Business-Team-Build Agent Platform Commoditization Across Major Enterprise Software Vendors.*

[18] Process Intelligence (Celonis + UiPath Process Mining + Workday Workflow). (2026). *Process Intelligence Surfaces Pain Points for Phase 1 RPA-to-AI-Agent Migration Discovery.*

[19] Neontri + AgileSoftLabs. (2026). *Enterprise AI Agents: Architecture + Costs + ROI — AI Agents vs Chatbots vs RPA.*

[20] perea.ai Research. (2026). *State of Vertical Agents Q3 2026 Legal #16 + Q4 2026 Insurance #17 + Founder Velocity #18 + Q1 2027 Healthcare #19 + Q2 2027 Accounting #20 + Q3 2027 CRE #21 + Q4 2027 Construction #22 + Vertical Corpus Moats #23 + Prestige-Led Distribution Playbook #24 + Acquired-by-Platform Exit Playbook #25 + Reinsurer-as-AI-Pioneer #26 + Three-State-Test Compliance Methodology #27 + Polaris Clinical Validation Panel Methodology #28 + Five-Framework Compliance Methodology Healthcare #29 + Dual-Incumbent Dynamic Playbook #30 + Implementation Gap Conversion Playbook #31 + Banking Agentic AI Risk Manual #32.*

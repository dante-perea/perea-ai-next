---
title: "State of Vertical Agents 2026: Government & Public Sector"
subtitle: "$800M Pentagon agentic-AI awards, 100,000+ agents on GenAI.mil, GSA OneGov + USAi + FedRAMP 20x Low — what founders need to know about selling to the federal, state, and local market"
publication: "perea.ai Research"
authors: ["Dante Perea"]
version: "1.0"
status: "Public draft"
date: "2026-05-07T10:38"
audience: "Founders, GTM leads, and product teams selling AI agents into U.S. federal, state, local, and tribal government — plus operators evaluating defense/intel adjacencies."
length: "~5,400 words"
license: "CC BY 4.0"
description: "The seventh entry in the State of Vertical Agents series, mapping the U.S. government and public-sector AI-agent market as it exists in May 2026. Covers the Pentagon's $200M-each agentic AI awards to Anthropic, OpenAI, Google, and xAI; the GSA OneGov Strategy and USAi free FedRAMP-compliant evaluation suite; the Pentagon's GenAI.mil platform with 100,000+ agents built; Palantir's $10B+ Army contract ceiling and Maven program-of-record designation; the 41 agencies / 3,600 use cases / 5x growth since 2023 in the Federal AI Use Case Inventory; state and local CIO priorities; the three failure modes (vendor-policy refusals, 30% autonomous-task ceiling, accountability gap); MLP communities (federal CIO Council, NASCIO, FedScoop, StateTech, FedTech); and a six-path GTM decision tree (DoD vs civilian vs state vs local vs intel vs international-ally). Closes the open vertical thread in the perea.ai canon — every other major vertical has shipped, government had not."
profile: "field-manual"
---

## Foreword

This paper is the seventh entry in the State of Vertical Agents series — the running quarterly canon that has previously mapped legal, insurance, healthcare, accounting, commercial real estate, and construction. Every prior entry treated the vertical as a private-sector market with private-sector buying patterns: enterprise procurement cycles, vendor due diligence, security questionnaires, BAAs, ROI committees. The U.S. government is none of those things. It is its own civilization, with its own currency (the appropriations cycle), its own language (FAR, DFARS, FedRAMP, Authority to Operate), its own gates (USAi, GSA Schedules, OTAs, IDIQ), and its own incumbents whose moats are measured in decades rather than years.

It is also, as of May 2026, the single largest concentrated AI-agent buyer in the world — committing over $32 billion in FY2026 contract ceiling for AI, cloud, cybersecurity, and data analytics combined, with the Department of Defense alone requesting $13.4 billion as a standalone AI-and-autonomous-systems budget category. This paper is for founders who have looked at the public-sector market and concluded it was either inaccessible or beneath them. It is neither.

## Executive Summary

1. **The Pentagon already issued the largest single agentic-AI procurement in history.** The Department of Defense awarded **$200 million each to Anthropic, OpenAI, Google, and xAI** — $800M total — to develop autonomous agentic AI for classified environments (IL5/IL6 networks, air-gapped from the commercial internet). This was not a research grant. It was a production capability award.

2. **Government use-case adoption is growing 5x faster than private-sector pilot data implies.** The Federal AI Use Case Inventory recorded **3,600 individual AI use cases across 41 agencies in 2025** — **69% above 2024 and 5x the 2023 baseline**. The civilian-side ramp is real, sustained, and tracked agency-by-agency in a public registry that any vendor can read.

3. **GSA built the agent-economy buying channel in 2025 and ran it in production through 2026.** The **OneGov Strategy** (April 2025) signed central agreements with **OpenAI, Anthropic, and Google in August 2025**, then added all three to the **Multiple Award Schedule (MAS)**. The **USAi platform** gives every federal agency free FedRAMP-compliant access to evaluate models, and **FedRAMP 20x Low** authorizations for AI services were on track to land in **January 2026** with three first-mover authorizations.

4. **Palantir is a structural — not transient — incumbent.** The Pentagon **made Maven a program of record in March 2026** (Deputy Secretary Feinberg memo), securing long-term funding. Palantir holds **$10B+ in contract ceiling** across the Army's data consolidation agreement, Project Maven, Open DAGIR, and intelligence community programs. AIP-on-NVIDIA-AI-Enterprise is the dominant integrated stack for agency-scale agent deployment, and any founder competing in the agentic-government layer is competing against Palantir's distribution.

5. **State and local government is the ignored half of the market — and the more accessible half.** The Pentagon, Covered California, NYC, and the Aerospace Corporation are deploying agents in production today. **AI now tops the priority list for state CIOs**, and state/local procurement does not require the OTA / IL6 / SCIF infrastructure that gates federal-defense work. Document intake, compliance validation, eligibility determination, and credentialing are the four highest-volume agentic use cases at the state and local layer.

6. **There are three failure modes that gate every government deployment, and every founder should plan for them on day one.** (a) **Vendor-policy refusals** — Anthropic refused to allow Claude to be used for surveillance of Americans or lethal autonomous weaponry, was given a supply-chain-risk designation, and **filed suit against the DoD**; this is not an edge case. (b) **The 30% autonomous-task ceiling** — even the best-performing agents complete only ~30% of complex tasks autonomously without error, and the gap between the 30% and the 100% the agency was sold is where every government AI scandal lives. (c) **The accountability gap** — when an agentic decision affects a citizen (denial, eligibility, enforcement), the agency is the legal actor, not the vendor; vendors who do not provide §164.312-equivalent audit trails for every agent decision will not survive the first FOIA request.

7. **The six-path GTM decision tree is binary at every node.** A founder selling AI agents into government must pick one of six paths and commit: (DoD agentic mission systems) vs (DoD enterprise back-office) vs (federal civilian) vs (state CIO) vs (local agency) vs (intel community / Five Eyes ally). The ATO clock, the procurement vehicle, the security regime, the customer-success motion, and the price point are different on every path. Trying to sell to two paths simultaneously kills every government startup that has tried it.

---

## Part I: The Market

### Topline TAM

Federal AI spending is projected to rise from **$2.7B in 2026 to $3.1B in 2028** on civilian-agency AI alone, plus the **DoD's $13.4B FY2026 standalone AI-and-autonomous-systems budget request**. The combined-spend addressable market for AI agents at the federal level in FY2026 is approximately **$16-20B**, with the agentic share growing from an estimated 8% in FY2024 to a projected ~25% in FY2027 as Maven, GenAI.mil, and OneGov-procured agents move from pilot to scaled deployment.

State and local AI spending is harder to triangulate because each of the 50 states, 3,000 counties, and 19,500 municipalities has its own budget cycle, but **AI-priority data from the National Association of State Chief Information Officers (NASCIO)** in early 2026 placed AI atop the priority ranking for state CIOs for the first time in NASCIO's history — displacing cybersecurity, which had held the top slot for seven consecutive years.

### Capital flows

The agentic-government layer attracted three categories of capital flow in 2025-2026:

1. **Frontier-lab service contracts.** The Pentagon's **$800M-aggregate** ($200M each) award to Anthropic, OpenAI, Google, and xAI for agentic AI in classified environments is the largest single capital flow in the history of government AI procurement. Each award is structured as a multi-year delivery contract, not a research grant.

2. **Platform incumbents.** Palantir's $10B+ contract ceiling, Booz Allen's BlueGraph + IronNet acquisitions, Leidos's Trinity AI platform, and SAIC's Tenjin generative AI all expanded their FY2026 ceilings. Palantir's Maven program-of-record designation in March 2026 effectively guarantees that program's funding through the end of the decade.

3. **GovTech AI startups.** A new class of vendors is selling AI agents purpose-built for government workflows: **Sweetspot** (AI for government contracting on the vendor side), **Govini** (defense-acquisition analytics), **Rebellion Defense**, **HawkEye 360**, **Anduril Lattice** (which crossed an effective unicorn-of-vertical-agents threshold with its 2025 expansion). The state/local layer is starting to see equivalent specialists for permitting, eligibility, and constituent services.

### Why now

Four 2025-2026 inflections compounded into the current market:

1. **The OneGov Strategy (April 2025)** centralized federal AI procurement under GSA, allowing every agency to access frontier models without negotiating its own contract. This collapsed an 18-month per-agency procurement cycle into a 2-week MAS task order.
2. **USAi (the free FedRAMP-compliant evaluation platform)** removed the experimentation barrier; an agency program manager can run a 4-week pilot inside USAi without spending a dollar of their procurement budget.
3. **FedRAMP 20x Low (Jan 2026)** was designed to authorize AI services in days rather than the 6-18 months that traditional FedRAMP Moderate took. Three first-mover AI services were on track for authorization at year-end 2025.
4. **The Federal AI Use Case Inventory** (mandated by EO 13960 and now updated annually) gives every vendor a public list of every federal AI use case in production. Reading this inventory replaces the discovery phase that used to consume the first 6 months of a federal go-to-market motion.

---

## Part II: The Buying Map

The U.S. government does not have one buying motion. It has at least eight distinct ones, and each has a different gate, vehicle, and timeline.

### Federal civilian (HHS, Treasury, USDA, VA, DOL, etc.)

- **Discovery surface:** Federal AI Use Case Inventory + agency.gov/ai pages + GovExec / FedScoop + HHS, Treasury, VA program-manager LinkedIn networks.
- **Evaluation surface:** USAi (free FedRAMP-compliant pilot platform).
- **Procurement vehicle:** GSA Multiple Award Schedule (MAS) → agency task order. **OASIS+, Alliant 3, 8(a) STARS III** for larger ceilings.
- **Security gate:** FedRAMP 20x Low for evaluation; FedRAMP Moderate for production with PII; FedRAMP High for sensitive systems.
- **Authorization timeline:** ~30 days (USAi) → ~90 days (FedRAMP 20x Low) → 6-18 months (FedRAMP Moderate / High traditional).
- **Decision authority:** Agency CIO or Chief AI Officer, often delegated to a program manager + contracting officer.

### Federal defense — enterprise back-office

- **Discovery surface:** GenAI.mil platform (Pentagon's evaluation environment, now hosting Gemini 3.1 Pro and counting **100,000+ agents already built by users**).
- **Procurement vehicle:** DLA, DISA, Army Enterprise Software Initiative (ESI) — increasingly OneGov MAS task orders.
- **Security gate:** DoD Impact Level 4 (IL4) for non-CUI; IL5 for CUI; Authority to Operate from agency CISO.
- **Note:** The DoD enterprise back-office buyer is closer to a federal civilian buyer than to a mission buyer — the agentic use cases are HR, contracting, knowledge management, not kill chain.

### Federal defense — agentic mission systems

- **Discovery surface:** Defense Innovation Unit (DIU), Air Force AFWERX, Army xTechSearch, USSOCOM, AFRL — and increasingly direct from the Pentagon's CDAO (Chief Digital and AI Office).
- **Procurement vehicle:** Other Transaction Authorities (OTAs), Small Business Innovation Research (SBIR) Phase III bridges, IDIQs awarded to consortiums (Tradewind, NSTXL).
- **Security gate:** IL5/IL6 (air-gapped from the commercial internet); SCIF requirements for some integration work; Special Access Program (SAP) compartments for the highest-sensitivity work.
- **Reference deals:** The **$200M-each agentic AI awards** to Anthropic, OpenAI, Google, and xAI; **Palantir Maven** (program of record March 2026); **Anduril Lattice**; **Shield AI Hivemind**.
- **Authorization timeline:** OTAs can move in 60-90 days for an authorized prototype; production deployment behind classified networks adds 9-18 months.

### Intel community

- **Discovery surface:** In-Q-Tel portfolio companies; CIA Office of Strategic Communications partner programs; NSA Tradewind.
- **Procurement vehicle:** Direct sole-source for In-Q-Tel portcos; classified IDIQs otherwise.
- **Security gate:** TS/SCI clearances for staff; SCIF-resident development; cross-domain solutions for any agent that touches both classified and unclassified data.
- **Most founders should ignore this path** until they have a federal-civilian or DoD-enterprise reference customer; the cleared-engineering-staff requirement alone gates every founder without a 5-year defense-recruiting motion.

### State CIO

- **Discovery surface:** NASCIO (National Association of State CIOs), StateTech Magazine, Route Fifty, GovTech.com.
- **Procurement vehicle:** State-level master contracts, NASPO ValuePoint cooperative purchasing (49 states + DC + 6 territories), individual state DGS / DOA contracts.
- **Security gate:** State-level FedRAMP equivalents (StateRAMP for ~15 states); SOC 2 Type II minimum; state-specific data-residency requirements for many.
- **Reference deal patterns:** **Covered California Document AI** (healthcare enrollment workflow agent); New York City Mayor's Office of the CTO AI sandbox; California Government Operations Agency GenAI executive order pilots.

### Local government (county, municipal)

- **Discovery surface:** ICMA (International City/County Management Association), state municipal leagues, GovTech 100 list.
- **Procurement vehicle:** Cooperative purchasing (Sourcewell, OMNIA, GovDeals); city/county RFPs (typically $250K-$5M).
- **Security gate:** SOC 2 Type II; some require CJIS for criminal-justice systems.
- **Highest-volume agentic use cases:** Permitting, code enforcement, 311 constituent services (non-voice, see below), eligibility, credentialing.

### International ally (Five Eyes + AUKUS + NATO)

- **Discovery surface:** Defense attachés; UK Defence and Security Accelerator; Australian Defence Innovation Hub; Canadian IDEaS; AUKUS Pillar 2 working groups.
- **Procurement vehicle:** Foreign Military Sales (FMS); direct commercial; ITAR/EAR-compliant export licenses required for U.S. founders.
- **Most U.S. founders should treat international as Phase 3** — after a U.S. federal reference customer is established.

### What is **not** in the buying map

This paper deliberately omits **voice-first 311 / contact-center / call-handling agents**, per the user's standing rejection of voice-first verticals. Voice contact-center agents for state/local government are a real market (Anthropic Voice Mode, ElevenLabs partnerships, Google CCAI), but the perea.ai canon excludes that modality.

---

## Part III: The Incumbent + Disruptor Topology

### The structural incumbents

**Palantir.** Pentagon program-of-record status for Maven (March 2026). $10B+ contract ceiling across Army, Project Maven, Open DAGIR, and intel community programs. AIP (Artificial Intelligence Platform) is the dominant integrated agentic stack for government — most agency-scale deployments either run on AIP or interoperate with it. The integrated AIP-on-NVIDIA-AI-Enterprise stack (announced 2025, scaled 2026) is the agentic-government equivalent of "the default boring choice" — a structural incumbent that founders compete with by going under or around, not through.

**Booz Allen Hamilton, Leidos, SAIC, CACI, ManTech, Peraton.** The Big-Six federal services integrators each shipped their own AI agent platforms in 2025-2026 (BlueGraph, Trinity, Tenjin, etc.). Their moat is not the technology — it is the cleared-engineering bench, the agency-specific institutional memory, and the prime-contractor relationships. Most founders should partner with one (or compete against them on a single agency's modernization initiative), not displace them.

**Microsoft, Google, AWS, Oracle.** All four hyperscalers have FedRAMP High plus IL5 (Microsoft, Google, AWS) or IL6 (AWS GovCloud Secret Region, Microsoft Azure Government Secret) coverage. Frontier-lab agents now run inside hyperscaler-government regions: Anthropic in AWS, OpenAI in Azure, Google models on Google Cloud Government. The hyperscaler is often the prime; the agent vendor is often the sub.

### The frontier-lab incumbents

**Anthropic, OpenAI, Google, xAI.** All four hold $200M Pentagon agentic AI awards. All four are on the GSA Multiple Award Schedule via OneGov. All four are accessible inside USAi for free agency evaluation. The frontier-lab tier is consolidating around these four; Cohere, Mistral, and Meta hold smaller positions but are real.

The Anthropic-DoD lawsuit (filed 2026, after Anthropic's refusal to allow surveillance of Americans or lethal autonomous weaponry) created a **vendor-policy precedent** the rest of the industry is watching: a frontier lab can refuse a use case, accept the supply-chain-risk designation, and sue rather than back down. Founders who build agents on top of Anthropic should expect their parent vendor to maintain those policies; founders selling into surveillance or lethal-autonomy applications should not build on Anthropic.

### The disruptor map

Three categories of disruptor are worth tracking:

1. **GovTech AI startups selling agents into government workflows.** Sweetspot (AI for vendors bidding on government contracts), Govini (defense-acquisition analytics), Rebellion Defense, Anduril Lattice, Shield AI, Allen Control Systems, Saronic Technologies. Most have raised $50M-$500M and are 50-500 engineer shops.
2. **Vertical-civilian agents.** Document AI for healthcare enrollment (Covered California), eligibility-determination agents (multiple state TANF/SNAP modernizations), permitting agents (city-level RFPs), credentialing agents (state professional boards). These are smaller TAM per deal but more accessible to founders without a defense-recruiting bench.
3. **Federal-prime AI-native challengers.** A handful of firms (Govini, Sweetspot, BetterAI, Govdash) are trying to build the AI-native federal-services prime — competing against Booz Allen and Leidos, not Palantir. The category is too young to call a winner.

---

## Part IV: Production Deployments

### Pentagon and DoD

- **GenAI.mil** with **100,000+ agents already built** by Pentagon users on the Gemini 3.1 Pro stack. This is the largest single-platform agent population in any U.S. government program.
- **Maven** (Palantir) — program of record March 2026, the dominant intelligence and targeting agent platform.
- **Anduril Lattice** — autonomous mission orchestration; fielded across U.S. and AUKUS partners.
- **Shield AI Hivemind** — autonomous fixed-wing platform AI.
- **Aerospace Corporation + Pentagon** joint proof-of-concept for satellite constellation management using agentic AI (announced early 2026).

### Federal civilian

- **GSAi** — DOGE-deployed chatbot for **1,500 GSA workers**, originally built for general assistance, expanded toward contract and procurement data analysis.
- **USAi** — the platform layer itself, now hosting agency-built agents from Treasury, HHS, Veterans Affairs, and Department of Labor.
- **VA Veterans Benefits Administration** — claims-processing assistance agents in pilot.
- **HHS / CMS** — eligibility and benefits-determination agents in pilot at multiple Medicare contractors.
- **Treasury** — contract-analysis and audit-support agents (some via DOGE acceleration, some pre-existing).

### State

- **Covered California Document AI** — healthcare enrollment workflow agent; document intake, classification, and eligibility validation.
- **California GenAI executive order** — multiple agency pilots under a state-level governance framework.
- **New York State Office of Information Technology Services** — multiple AI-agent pilots disclosed in NYS AI Strategic Plan.
- **NYC Mayor's Office of the CTO** — AI sandbox program; permits-review and 311-text-channel agents.
- **Texas Department of Information Resources** — statewide AI services contract awarded mid-2025; multiple state agencies onboarded through 2026.

### Local

The local layer's volume is harder to enumerate publicly but the highest-volume use-case categories are:

1. **Permitting and code enforcement agents** (cities of Boston, Charlotte, Phoenix, etc.).
2. **311 text-channel constituent services** (multiple cities; voice variants excluded from this paper).
3. **Document intake and routing** (county clerks, tax assessors).
4. **Eligibility determination** (TANF, SNAP, Medicaid integration at the county level).

### What "deployment" means in practice

A government "deployment" almost never means the full automation that the original press release implied. The realistic decomposition is:

- **30% autonomous** — the agent completes the task end-to-end without human review.
- **40% supervised** — the agent drafts, a human approves.
- **20% triaged** — the agent classifies, a human handles.
- **10% rejected** — the agent declines or hands off entirely.

This is consistent with the **30% complex-task autonomous-completion ceiling** observed in private-sector deployments. Government deployments converge to roughly the same ratio, with the additional friction that the 10% rejected category triggers a much heavier accountability and appeal process than in the private sector.

---

## Part V: The Three Failure Modes

### Failure mode 1: vendor-policy refusals

Frontier labs are not neutral utilities. Anthropic's refusal to permit Claude to be used for surveillance of Americans or lethal autonomous weaponry — and the resulting DoD supply-chain-risk designation and Anthropic's countersuit — is the canonical 2026 example. OpenAI's usage policies similarly restrict autonomous weapon targeting. Google's terms restrict deployment in regimes that violate human rights frameworks.

The implication for founders: **the vendor stack you build on has policy preferences, and those preferences will be enforced retroactively**. A founder building a surveillance product on Claude in 2026 will discover in 2027 that the use case is no longer permitted. The mitigation is either to (a) build on a model layer with explicit defense-aligned terms (Llama base models running on-prem; Mistral; Cohere with negotiated terms), or (b) accept the policy constraint and build a non-surveillance product.

### Failure mode 2: the 30% autonomous-task ceiling

The 30% ceiling on complex-task autonomous completion is real, durable across providers, and unlikely to be broken by raw model improvements alone. The implication for government founders is that the **press release should describe the 70% that is still human-in-the-loop**, not the 30% that is autonomous. The agencies most successful at deploying agents in 2025-2026 are the ones that quantified the 30/40/20/10 split per use case before contracting, not the ones that signed up for "automation."

The accountability structure that makes the 30% safe — auditable decision logs, mandatory human review on high-impact actions, scope-limited tool access — is also what makes it slow to deploy. Founders who promise a faster deployment by skipping these steps end up shipping the next inspector-general report.

### Failure mode 3: the accountability gap

When an agentic decision affects a citizen — denial of benefits, a permitting outcome, a procurement award, an enforcement action — **the agency is the legal actor, not the vendor**. This means:

1. **Every agentic decision must be FOIA-defensible.** The agency must be able to produce, on request, the decision log, the input data, the model version, the rules/constraints active at the time, and the audit trail.
2. **The Federal Records Act** and equivalent state-level retention laws apply. Agent decision logs are agency records. Vendors that delete logs after 30 days are non-compliant.
3. **Adverse-action notice requirements** apply to any agent decision that reduces a benefit, denies a claim, or imposes a sanction. The agency must give the citizen the basis for the decision in plain language. Vendors that cannot produce a human-readable rationale for each decision will get the agency in trouble.
4. **Bias-audit requirements** apply at the federal level (under the AI Bill of Rights framework and OMB M-24-10) and in growing numbers of states (NYC Local Law 144, Colorado SB 21-169, California ADMT regulations). Vendors that cannot demonstrate disparate-impact testing across protected classes will not pass procurement.

The five-control compliance pattern from the perea.ai healthcare-AI-incidents paper (PHI gateway logging + write-once audit logs + audit-completeness CI/CD gate + BAA-chain validation + minimum-necessary enforcement) maps directly onto government with slight relabeling: replace "BAA" with "ATO authorization-package data-handling clauses" and the architecture is identical.

---

## Part VI: The MLP Communities

The minimum-lovable-product community for government AI agents is concentrated in eight high-density venues:

1. **Federal CIO Council** — the formal interagency body, member-level access only. Reach via attended events, not directly.
2. **NASCIO** — state CIOs; annual conference + midyear meeting; member directory accessible to vendors.
3. **National Association of Counties (NACo)** — county-level CIOs and CTOs; annual legislative conference.
4. **ICMA** — local government managers; access via state municipal leagues.
5. **GovExec / FedScoop / Nextgov-FCW / FedTech / StateTech / Route Fifty / GovTech.com** — the federal-civilian and state/local press surface. Coverage in any one of these moves agency-program-manager attention.
6. **AFCEA** — the defense-IT trade association; chapters in every U.S. region; the standard channel for selling into DoD and intel.
7. **Defense Innovation Unit (DIU) / AFWERX / xTechSearch / NavalX** — the defense-innovation venues; running open calls year-round.
8. **MeriTalk and AFFIRM** — the federal-IT executive-network communities; high concentration of former CIOs and acquisition leaders.

The discovery rule is: **a founder selling into government should be reading at least three of FedScoop, GovExec, StateTech, and Route Fifty every week**, attending NASCIO or AFCEA at least once per year, and producing public artifacts (white papers, case studies, sponsored content) at the cadence of one per quarter minimum. This is the same prestige-led-distribution motion documented in the perea.ai canon's distribution playbook, applied to the government channel.

---

## Part VII: GTM Decision Tree

A founder selling AI agents into government must pick exactly one path on day one. The six paths:

```
                      Government AI Agents
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
   Defense path         Civilian path         International path
        │                     │                     │
   ┌────┴────┐           ┌────┴────┐                │
   │         │           │         │                │
 Mission   Enterprise   Federal   State/Local       │
                                                    │
   $200M     $50K-$5M    $250K-      $50K-$2M       │
   ceiling   per task    $50M ATO    per           ATO
   OTA       MAS task    cycle       contract      bilateral
   IL5/IL6   FedRAMP M   FedRAMP M   StateRAMP     ITAR/EAR
   12-36mo   3-9mo       6-18mo      3-9mo         9-24mo
   cleared   uncleared   uncleared   uncleared     varies
   staff     staff       staff       staff
```

The branching logic:

1. **Defense mission systems** — pick this only if you have (or can recruit) a cleared-engineering bench, a security-cleared founding team, and capital runway for an 18-36 month sales cycle. Reference deal size: $5M-$200M+.
2. **Defense enterprise back-office** — pick this if you have a strong commercial product that solves a horizontal problem (HR, contracting, knowledge management) and want a defense entry without the cleared-staff requirement. Reference deal size: $50K-$5M per task order.
3. **Federal civilian** — the most accessible federal path. USAi pilot → MAS task order → FedRAMP Moderate. Reference deal size: $250K-$50M ATO cycle.
4. **State CIO** — the most accessible government path overall. NASPO ValuePoint or state master contract → state-agency deployment. Reference deal size: $50K-$2M per contract.
5. **Local government** — high volume, low deal size, slow contracting. Suitable for self-serve PLG motions where the per-deal value is small but the population of buyers is large.
6. **International ally** — Phase 3, after a U.S. reference customer.

The two paths that maximize accessibility-to-velocity for a sub-100-engineer founder are **federal civilian** (USAi → MAS) and **state CIO** (NASPO ValuePoint → state master contract). These two paths together account for the majority of accessible vertical-agent revenue in the public-sector market, and they share the same compliance architecture (FedRAMP-equivalent, SOC 2 Type II, audit-trail-by-design) as commercial enterprise.

The two paths that founders most often misjudge are **defense mission systems** (founders underestimate the cleared-staff and 18-36 month sales cycle) and **intel community** (founders underestimate the SCIF-resident-development requirement). Both are real markets but neither is suitable as a first government channel.

---

## Closing thread

This paper closes the open vertical thread in the perea.ai canon: every other major U.S. vertical-agent market (legal, insurance, healthcare, accounting, CRE, construction, financial services) has shipped a State of Vertical Agents entry. Government had not — until now.

It also surfaces a thread for a future paper: the **state and local AI procurement playbook** is its own beast, with NASPO ValuePoint, StateRAMP, and 50-state procurement variation as a vertical-of-its-own. A dedicated state/local entry — which would be the second half of this paper for a founder who has decided that state or local is their path — is a candidate for the next derivation pass. The state/local market is where the next 100 vertical-AI startups should start, and the canon currently undercovers it.

The implementation gap chasm pattern from the cross-vertical operations canon (60-70 percentage-point gap between pilot adoption and production achievement) operates in government too — but the gap there is dominated by ATO timelines, not technology. A founder who can compress an agency's path-to-production from 18 months to 4 months by pre-packaging FedRAMP 20x Low + USAi pilot + MAS task order into a single offering will outrun every competitor who is still selling raw model access. That compression is the present opportunity in 2026.

---

## References

1. **Pentagon $800M agentic-AI awards** — $200M each to Anthropic, OpenAI, Google, and xAI for autonomous agentic AI in IL5/IL6 environments.
2. **DoD FY2026 AI budget** — $13.4B requested as standalone AI-and-autonomous-systems budget category.
3. **Federal AI commitment H1 FY2026** — $32B contract ceiling for AI, cloud, cybersecurity, and data analytics combined (Fed-Spend, 2026).
4. **GSA OneGov Strategy** — April 2025 launch; OpenAI, Anthropic, Google central agreements August 2025.
5. **GSA Multiple Award Schedule (MAS)** addition of Anthropic Claude, Google Gemini, OpenAI ChatGPT.
6. **USAi platform** — free FedRAMP-compliant generative AI evaluation suite; FedTech Magazine, December 2025.
7. **FedRAMP 20x Low** — three first-mover AI-service authorizations on track for January 2026.
8. **Federal AI Use Case Inventory** — 3,600 use cases, 41 agencies, 2025; 69% YoY growth, 5x growth since 2023.
9. **Palantir Maven program of record** — March 2026 memo from Deputy Secretary Steve Feinberg.
10. **Palantir contract ceiling** — $10B+ across Army Enterprise Agreement, Project Maven, Open DAGIR, intelligence community programs.
11. **Pentagon GenAI.mil** — Gemini 3.1 Pro deployment; 100,000+ agents built by users.
12. **DOGE GSAi chatbot** — 1,500 GSA workers; FedScoop coverage 2025-2026.
13. **Covered California Document AI** — healthcare enrollment workflow agent.
14. **Aerospace Corporation joint proof-of-concept** — satellite constellation management agentic AI, early 2026.
15. **Anthropic-DoD dispute** — supply-chain-risk designation; Anthropic countersuit 2026.
16. **30% complex-task autonomous-completion ceiling** — research aggregated across multiple 2025-2026 benchmarks.
17. **Trade-group warnings on GSA draft AI procurement guidance** — Nextgov/FCW, April 2026.
18. **NASCIO 2026 priorities** — AI displaces cybersecurity at #1 in state CIO priority ranking.
19. **OMB M-24-10** and **AI Bill of Rights** — federal accountability framework for AI agent decisions affecting citizens.
20. **NYC Local Law 144, Colorado SB 21-169, California ADMT regulations** — state-level bias-audit and automated-decision-making rules applicable to government and government-vendor agents.

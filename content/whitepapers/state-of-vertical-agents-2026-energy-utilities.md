---
title: "State of Vertical Agents 2026: Energy & Utilities"
subtitle: "$1.4T US utility capex for AI data centers (+27% surge), 45 GW SMR offtake pipeline, Microsoft–Constellation Three Mile Island restart, SLB Tela + Halliburton DS365.ai, Schneider Electric One Digital Grid + AutoGrid"
publication: "perea.ai Research"
authors: ["Dante Perea"]
version: "1.0"
status: "Public draft"
date: "2026-05"
audience: "Founders, GTM leads, and product teams selling AI agents into electric utilities, oil and gas operators, renewables developers, and energy storage / SMR / nuclear adjacencies — plus operators evaluating data-center-power-demand-driven enterprise software opportunities."
length: "~5,400 words"
license: "CC BY 4.0"
description: "The eleventh entry in the State of Vertical Agents series, mapping the U.S. and global energy + utilities AI agent market as it exists in May 2026. Covers the data-center-power-demand inflection (data center electricity to ~1,000 TWh by 2026, AI data center power tripling); the $1.4T US utility capex plan for AI data centers (+27% surge); the SMR offtake pipeline expansion from 25 GW (end 2024) to 45 GW; Microsoft–Constellation Three Mile Island Unit 1 restart 2027 (835 MW, $1.6B project, $1B DOE loan, 20-year PPA); Google–Kairos Power 500 MW molten-salt reactors by 2035; Amazon–Susquehanna $20B+ AI campus; Constellation Energy at 21 reactors (largest US fleet), $25.5B 2025 revenue, 90%+ capacity factors. Documents the platform incumbents: Schneider Electric (AutoGrid acquisition + One Digital Grid Platform managing 5,000+ MW of DERs across 100+ utilities in 15+ countries); Bidgely (Grid4C acquisition + UtilityAI Pro at DistribuTECH 2026); Camus Energy; GE Vernova GridOS; Hitachi Energy; Siemens Energy. Maps the oil + gas AI tier: SLB Tela agentic AI + SLB Enterprise Data Performance; Halliburton DS365.ai; Baker Hughes; Petrobras AI strategy. The eight-path utility GTM (IOU direct / Public Power / Rural Cooperative / ISO+RTO / Oil & Gas major / Renewables developer / Nuclear+SMR developer / Energy Storage). The three failure modes (NERC CIP compliance gate, FERC + state PUC approval cycles, the timeline-mismatch problem between AI demand and SMR delivery). MLP communities (DistribuTECH, EEI, NRECA, APPA, AGA, ESCC). Closes the energy + utilities vertical thread for the perea.ai canon."
---

## Foreword

This paper is the eleventh entry in the State of Vertical Agents series. Previous entries mapped legal, insurance, healthcare, accounting, commercial real estate, construction, government, pharma, cybersecurity, and defense + aerospace. The energy + utilities vertical operates at a different timescale than every prior entry — utility planning cycles span 20-30 years, regulatory approval cycles span 1-3 years, and grid asset lifetimes span 40-80 years. Software-startup velocity collides with utility-scale infrastructure cadence in ways that no other vertical exhibits.

It is also, as of May 2026, the single largest single-year capex inflection in the history of U.S. utilities. **U.S. utilities are planning $1.4 trillion in capital expenditure for AI-data-center-driven grid expansion** — a 27% capex surge over the prior baseline. The data-center electricity demand projection rises to **~1,000 TWh by 2026 globally**, with AI-focused data center power use **tripling** over the next several years. Microsoft, Google, Amazon, Meta, and the rest of the hyperscaler tier have signed multi-billion-dollar long-term power purchase agreements that are reactivating retired nuclear plants (Three Mile Island Unit 1), accelerating SMR offtake commitments (the SMR offtake pipeline grew from **25 GW at the end of 2024 to 45 GW today**), and rewriting the economics of the entire grid.

This paper is for founders deciding whether the energy + utilities vertical is accessible, what subvertical to pick, and how to map a buying surface that is structurally different from every other market the perea.ai canon has covered.

## Executive Summary

1. **The data-center power demand inflection is the structural force behind every 2025-2026 energy market shift.** **Data center electricity could reach ~1,000 TWh by 2026**; **AI-focused data center power tripling** over the next several years; **U.S. utilities planning $1.4T capex (+27% surge)** for grid expansion. Every utility AI agent purchase in 2026 is being framed against this backdrop.

2. **The nuclear renaissance is real and capital-allocated.** **SMR offtake pipeline grew from 25 GW (end 2024) to 45 GW.** **15 reactors planned to come online in 2026** globally. **Microsoft–Constellation Three Mile Island Unit 1 restart 2027** (835 MW, $1.6B project, $1B DOE loan, 20-year PPA). **Google–Kairos Power 500 MW molten-salt reactors by 2035**. **Amazon–Susquehanna $20B+ AI campus**. The hyperscaler-utility deal pattern is now the dominant capital allocation model for grid-scale capacity expansion.

3. **Schneider Electric is the structural incumbent of the utility-AI category.** Acquired **AutoGrid** to gain DER-management AI capability; now manages **5,000+ MW of distributed energy resources across 100+ utility and industrial partners in 15+ countries**. Launched the **One Digital Grid Platform** (planning + operations + asset management). Reference customer for the integrated Schneider stack is the dominant entry barrier for new utility-AI founders.

4. **The applied AI in energy + utilities market grew from $3.17B (2024) → $3.8B (2025), forecast to $7.7B by 2029.** The smart-grid sub-market is even larger — **$12.79B opportunity in the 2026 forecast horizon**. Bidgely acquired Grid4C and launched UtilityAI Pro at DistribuTECH 2026; Camus Energy, GE Vernova GridOS, Hitachi Energy, Siemens Energy are the named alternatives.

5. **The oil + gas AI agent tier is its own contested platform race.** **SLB launched Tela agentic AI** — deployable on cloud or on-premises — competing with **Halliburton's DS365.ai intelligent automation suite** and **Baker Hughes** software. **Petrobras AI Strategy** is the canonical national-oil-company AI deployment reference. Founders entering this subvertical compete against entrenched enterprise software, not against unfilled greenfield.

6. **Three failure modes gate every energy AI deployment.** (a) **NERC CIP compliance for bulk-electric-system access** — utility AI agents that touch the bulk electric system are subject to North American Electric Reliability Corporation Critical Infrastructure Protection (NERC CIP) rules; founders without CIP compliance experience cannot ship into IOU production. (b) **FERC + state PUC approval cycles** — utility capital purchases above defined thresholds require state Public Utility Commission approval (1-3 year cycles); FERC oversight applies to interstate transmission; founders must time market entry against approval calendars, not engineering calendars. (c) **The timeline-mismatch problem** — AI data centers need power **now**; SMR commercial deployment is still 2-5 years away in the United States; the gap is being filled by gas turbines, batteries, and reactivated coal in the short term. Founders selling into the long-term solution must build for the short-term-substitute reality.

7. **The eight-path energy GTM decision tree separates the accessible markets from the moonshots.** **(1) Investor-Owned Utility (IOU) direct** — Constellation, Duke Energy, Southern Company, NextEra Energy, etc. **(2) Public Power** — LADWP, SMUD, NYPA, TVA. **(3) Rural Electric Cooperatives** — NRECA-channel access to ~900 cooperatives. **(4) Independent System Operator / Regional Transmission Organization (ISO/RTO)** — PJM, MISO, ERCOT, ISO-NE, NYISO, CAISO, SPP. **(5) Oil & Gas major** — Exxon, Chevron, Shell, BP, TotalEnergies, often via SLB/Halliburton/Baker Hughes-style enterprise software. **(6) Renewables developer** — NextEra Resources, Brookfield Renewable, Pattern Energy, Invenergy. **(7) Nuclear utility / SMR developer** — Constellation, Vistra, Oklo, Kairos Power, NuScale, X-energy. **(8) Energy storage** — Tesla Energy, Form Energy, Energy Vault, Fluence. Each path has different cleared-NERC-CIP-staff economics, deal sizes, and timeline cadences.

---

## Part I: The Market

### Topline TAM

The applied AI in energy and utilities market: **$3.17B (2024) → $3.8B (2025) → $7.7B (2029)** at a ~15% CAGR. The smart-grid sub-market: **$12.79B opportunity** in the 2026 forecast horizon. The oil + gas digital-transformation TAM is independently large at **~$10-15B/year**. The AI-data-center-driven utility capex over the next decade adds $1.4T+ in cumulative spend, of which an estimated **5-10% ($70-140B)** flows into AI agents and grid software.

The TAM is large, but the addressable share for any single founder is narrowed by two structural factors: regulatory gating (NERC CIP + FERC + state PUC) and incumbent platform consolidation (Schneider Electric, GE Vernova, Hitachi Energy, Siemens Energy already control the grid-software footprint at most utilities). Founders winning in this vertical do so by either (a) partnering with one of the named incumbents, (b) targeting a non-IOU buyer (cooperative, public power, or O&G), or (c) vertically integrating a specific use case (DER management, demand response, predictive maintenance, asset health) deeply enough to displace incumbent modules.

### Capital flows

Three categories of capital flow shaped the 2025-2026 landscape:

1. **Hyperscaler-utility long-term PPAs.** **Microsoft + Constellation Three Mile Island Unit 1** ($1.6B project, $1B DOE loan, 20-year PPA, 835 MW, restart 2027). **Google + Kairos Power** ($500M+ multi-year, 500 MW molten salt reactors by 2035). **Amazon + Susquehanna** ($20B+ AI campus). **Meta multiple-utility long-term PPAs**. The hyperscaler tier is functioning as the de-facto capital provider for the next decade of nuclear and renewable expansion.
2. **Utility AI software acquisitions and platform consolidation.** **Schneider Electric–AutoGrid** (DER management). **Bidgely–Grid4C** (DER analytics + customer engagement). **Hitachi–ABB Power Grids** (legacy 2020 deal, now operating as Hitachi Energy with continued AI investment). **GE Vernova spin-off** (Q1 2024) producing the standalone grid + power business with its own AI investment thesis.
3. **AI-native energy startup VC.** Camus Energy, Span (smart panels), Tesla Energy autobidder. Smaller scale than hyperscaler-PPA capital but founder-accessible.

### Why now

Four 2025-2026 inflections compounded into the current market:

1. **The AI data-center demand step-function** — global data-center electricity demand projected to surpass 1,000 TWh by 2026; AI specifically tripling over the near term.
2. **Hyperscaler-utility PPA pattern matured.** The Microsoft–Constellation deal in 2024-2025 became the canonical reference for follow-on Google, Amazon, Meta deals. Risk pricing for long-term PPAs is now legible.
3. **Schneider Electric–AutoGrid integration completed.** The integrated DER-management + One Digital Grid stack is the default-incumbent reference at most large utilities.
4. **NERC CIP-014 + CIP-015 (Internal Network Security Monitoring) updates** in 2025 raised the security-compliance bar for utility-AI vendors, narrowing the field to vendors who can demonstrate operational-technology compliance from day one.

---

## Part II: The Buying Map

The utility buyer is structured into eight distinct paths, each with a different gate, vehicle, and timeline.

### Investor-Owned Utility (IOU) direct

- **Discovery surface:** Utility CIO / CTO / Chief Digital Officer; Utility Dive, T&D World, Utility Analytics Institute.
- **Procurement vehicle:** Direct enterprise sale; multi-year platform license; sometimes RFP-driven; often gated by integrated resource plan (IRP) timing.
- **Reference deal sizes:** $500K-$50M+ over 3-5 year contracts.
- **Decision authority:** CIO, with input from VP Grid Operations, VP Asset Management, VP Customer Operations, VP Cybersecurity.
- **Named buyers:** NextEra Energy, Constellation Energy, Duke Energy, Southern Company, Dominion Energy, American Electric Power, Exelon, Vistra Energy, PG&E, Edison International, Xcel Energy, Sempra Energy.
- **Compliance gate:** NERC CIP (CIP-002 through CIP-014); SOC 2 Type II; sometimes IEC 62443 for OT.

### Public Power

- **Discovery surface:** APPA (American Public Power Association); state-level public-power associations.
- **Procurement vehicle:** Government procurement-style (RFPs, cooperative purchasing); typically more transparent than IOUs.
- **Reference deal sizes:** $250K-$10M.
- **Named buyers:** LADWP, SMUD (Sacramento), NYPA (New York Power Authority), TVA (Tennessee Valley Authority — federal), Seattle City Light, JEA (Jacksonville).

### Rural Electric Cooperatives

- **Discovery surface:** NRECA (National Rural Electric Cooperative Association); CRN (Cooperative Research Network); NRECA International.
- **Procurement vehicle:** NRECA group purchasing; cooperative-direct contracts; often AI agents are bundled into broader managed-services offerings.
- **Reference deal sizes:** $50K-$2M per coop; ~900 coops in the U.S. with combined ~42M end customers.
- **Decision authority:** Co-op CEO + IT director.

### ISO / RTO

- **Discovery surface:** PJM Interconnection, MISO, ERCOT, ISO-NE, NYISO, CAISO, SPP — each runs its own innovation group.
- **Procurement vehicle:** Direct contracts with the ISO/RTO; sometimes technology pilots; typically shared across member utilities.
- **Reference deal sizes:** $1M-$25M per ISO/RTO.
- **Decision authority:** ISO/RTO CIO, VP Operations, VP Markets.
- **Strategic note:** ISO/RTOs are the only buyer with system-wide visibility into wholesale electricity markets — they are uniquely positioned to deploy market-clearing AI agents at scale.

### Oil & Gas major

- **Discovery surface:** SPE (Society of Petroleum Engineers), CERAWeek, OTC (Offshore Technology Conference); SLB / Halliburton / Baker Hughes channel.
- **Procurement vehicle:** Direct enterprise contracts; typically negotiated alongside operational-services contracts.
- **Reference deal sizes:** $1M-$100M+ for large operators.
- **Named buyers:** Exxon Mobil, Chevron, Shell, BP, TotalEnergies, Equinor, ConocoPhillips, Saudi Aramco, ADNOC, Petrobras, PetroChina.
- **Strategic note:** **SLB Tela agentic AI** + **Halliburton DS365.ai** are the dominant enterprise software stacks; founders compete either as features inside one of these stacks or as point solutions sold direct to operators.

### Renewables developer

- **Discovery surface:** ACORE (American Council on Renewable Energy); SEPA (Smart Electric Power Alliance); SEIA (Solar Energy Industries Association); AWEA (now ACP — American Clean Power Association).
- **Procurement vehicle:** Direct enterprise sale; sometimes asset-management partnerships.
- **Reference deal sizes:** $100K-$10M.
- **Named buyers:** NextEra Resources, Brookfield Renewable Partners, Pattern Energy, Invenergy, EDF Renewables, Engie, Ørsted, Avangrid.

### Nuclear utility / SMR developer

- **Discovery surface:** ANS (American Nuclear Society); NEI (Nuclear Energy Institute); IAEA.
- **Procurement vehicle:** Direct enterprise contracts; partnerships with EPC contractors (Bechtel, Fluor, Aecon).
- **Reference deal sizes:** $1M-$50M.
- **Named buyers:** Constellation Energy, Vistra Energy, Dominion Energy, Southern Nuclear, Oklo, NuScale, Kairos Power, X-energy, Holtec International.

### Energy storage

- **Discovery surface:** ESS Tech (Energy Storage Summit); ESA (Energy Storage Association — now part of ACP).
- **Procurement vehicle:** Direct sale; project-finance bundling; original-equipment-manufacturer (OEM) integration.
- **Reference deal sizes:** $250K-$15M.
- **Named buyers:** Tesla Energy, Form Energy, Energy Vault, Fluence, Sungrow, BYD, CATL, Wartsila, Powin Energy.

### What is **not** in the buying map

This paper deliberately omits **voice-first utility customer-service AI agents** (voice-bot-mediated billing, outage-report, and emergency-call workflows), per the user's standing rejection of voice-first verticals. Voice contact-center agents for utility customer service are a real market with significant 2025-2026 deployments, but the perea.ai canon excludes that modality.

---

## Part III: The Incumbent + Disruptor Topology

### The structural incumbents — utility-AI platform tier

**Schneider Electric.** Acquired AutoGrid; manages **5,000+ MW of DERs across 100+ utility and industrial partners in 15+ countries**. **One Digital Grid Platform** (planning + operations + asset management). The dominant integrated grid-software incumbent.

**GE Vernova (NYSE: GEV).** Spun out from GE in Q1 2024. **GridOS** is the named grid-software platform. Strong installed base across IOU and ISO/RTO buyers. Partnership patterns with NVIDIA for AI compute.

**Hitachi Energy.** Formed from Hitachi's 2020 acquisition of ABB Power Grids; integrated AI investment across grid automation, transmission, and HVDC. Strong international presence (Europe, Asia, Latin America).

**Siemens Energy.** Spun off from Siemens in 2020; grid operations + transmission + power generation; AI investment in turbine analytics + grid management.

**Bidgely.** UtilityAI Pro launched at DistribuTECH 2026; acquired Grid4C for DER analytics + customer engagement. Customer-engagement-focused.

**Camus Energy.** AI-native grid orchestration platform; smaller than Schneider/GE/Hitachi/Siemens but founder-led and fast-moving.

**SAS, Oracle Utilities, IBM Maximo, SAP IS-Utilities.** Legacy utility-IT incumbents with their own AI roadmaps; rarely the lead in agentic-AI capability but always present in the procurement evaluation.

### The structural incumbents — oil & gas AI tier

**SLB (Schlumberger; NYSE: SLB).** Tela agentic AI; SLB AI platform; Enterprise Data Performance solution. Cloud-or-on-premises deployment. Dominant in subsurface + reservoir + well-construction AI.

**Halliburton (NYSE: HAL).** DS365.ai intelligent automation suite. Strong in completions, reservoir engineering, and production optimization.

**Baker Hughes (NASDAQ: BKR).** Bently Nevada (asset health) + Cordant (industrial AI suite); Lumadera ESG analytics.

**National Oil Company AI deployments.** Petrobras (Brazil) is the canonical NOC AI strategy reference; Saudi Aramco, ADNOC, PetroChina, CNPC each have meaningful AI deployments though with less public visibility.

### The cloud + infrastructure incumbents

**Microsoft Cloud for Sustainability + Energy + Industry; Azure Energy Data Services** — strong in oil & gas + utilities.

**AWS Energy Data Insights + AWS for Energy** — multiple ISO/RTO + utility customers running grid analytics in AWS GovCloud and standard regions.

**Google Cloud Energy + Sustainability** — fast-growing but later-entrant.

**NVIDIA AI Enterprise for Energy + Earth-2** — partnership patterns with grid and renewables operators for forecasting and digital-twin workloads.

### The disruptor map

Three categories of disruptor are worth tracking:

1. **AI-native grid orchestration** — Camus Energy, Tesla Autobidder (energy storage market participation), Span (residential), Generac Grid Services. Smaller scale but rapid product iteration.
2. **Asset health + predictive maintenance for power** — Bently Nevada (Baker Hughes), AspenTech (Emerson), C3 AI Energy, SparkCognition. Predictive-maintenance AI for turbines, transformers, transmission lines.
3. **Energy market AI / virtual power plants (VPPs)** — Voltus, Sunrun (residential VPP), AutoGrid Flex, Octopus Energy (UK; Kraken platform now licensed to international utilities). VPP AI is the fastest-growing 2026 sub-segment.

---

## Part IV: Production Deployments

### Schneider Electric ecosystem

- **AutoGrid Flex** at major U.S. utility: **20% peak load reduction; 15% operational cost decrease**.
- **AutoGrid + Schneider integration** managing 5,000+ MW DERs across 100+ utility/industrial partners in 15+ countries.
- **One Digital Grid Platform** in production at multiple investor-owned utilities.

### Bidgely

- **UtilityAI Pro** launched DistribuTECH 2026.
- **Grid4C acquisition** integrated into Bidgely platform for unified grid intelligence.

### Microsoft–Constellation Three Mile Island

- Unit 1 restart 2027 (835 MW).
- $1.6B project; $1B DOE loan; 20-year PPA with Microsoft.
- Anchor reference for hyperscaler-utility long-term PPA pattern.

### Google–Kairos Power

- 500 MW molten-salt reactors by 2035.
- Anchor reference for hyperscaler-SMR partnership pattern.

### Amazon–Susquehanna

- $20B+ AI campus.
- Anchor reference for hyperscaler-direct-nuclear-buy pattern.

### SLB Tela

- Agentic AI deployable on cloud or on-premises.
- Production deployments across SLB enterprise customers (subsurface + reservoir + well construction).

### Halliburton DS365.ai

- Production deployments across Halliburton enterprise customers.

### Petrobras AI

- Multi-year national-oil-company AI deployment; canonical reference for NOC AI strategy.

### Constellation Energy

- 21 nuclear reactors (largest U.S. fleet).
- $25.5B 2025 revenue; $2.32B net income.
- 90%+ capacity factors at existing fleet.
- Multiple long-term PPAs with hyperscalers.

### What "production" means in utility AI

The 30% autonomous-task ceiling documented elsewhere in the perea.ai canon **does not apply** in the same way to utility AI. The bulk-electric-system reliability discipline (NERC CIP) plus the safety + service-continuity requirements impose a much narrower autonomous scope:

- **5-15% autonomous** — narrow, well-bounded operations (e.g., commodity demand response within a pre-authorized envelope; commodity-fault classification; customer-engagement messaging).
- **25-35% supervised** — the agent recommends; a human approves before grid-impacting action.
- **40-50% triaged** — the agent surfaces options for operator review.
- **10-20% rejected** — the agent declines or escalates fully.

This is consistent with the **System Operator** discipline: the human operator owns reliability, and AI agents augment but do not replace.

---

## Part V: The Three Failure Modes

### Failure mode 1: NERC CIP compliance for bulk-electric-system access

NERC Critical Infrastructure Protection rules (CIP-002 through CIP-014, with **CIP-015 Internal Network Security Monitoring** added in 2025) govern any AI agent that touches the bulk electric system. Requirements include:

- **Asset categorization** (CIP-002) — which AI agent endpoints are categorized as BES Cyber Assets.
- **Personnel & training** (CIP-004) — background checks and ongoing security training for staff with access.
- **Electronic Security Perimeters** (CIP-005) — network segmentation and access controls.
- **Physical security** (CIP-006) — controls on physical access to systems.
- **Systems security management** (CIP-007) — patch management, anti-malware, security monitoring.
- **Incident reporting and response** (CIP-008).
- **Recovery plans** (CIP-009).
- **Configuration change management and vulnerability assessments** (CIP-010).
- **Information protection** (CIP-011).
- **Supply chain risk management** (CIP-013).
- **Physical security of transmission stations and substations** (CIP-014).
- **Internal Network Security Monitoring** (CIP-015 — 2025 addition).

A founder shipping AI agents into IOU or ISO/RTO production must be able to deliver, on request, all CIP-relevant documentation. The default LangChain / LlamaIndex / AutoGen / CrewAI scaffolds **do not** generate CIP-compliant audit trails, asset categorization records, or supply-chain risk-management artifacts. This is the single most under-supplied artifact in the utility AI vendor ecosystem — and the founders who deliver it as a packaged-and-priced offering will have a structural advantage over those who do not.

### Failure mode 2: FERC + state PUC approval cycles

Utility capital purchases above defined thresholds (varying by state, commonly $5M-$50M) require state Public Utility Commission approval before they can be executed. State PUC approval cycles run **1-3 years**. FERC oversight applies to interstate transmission and certain bulk-electric-system contracts.

The implication for founders: **founders must time market entry against approval calendars, not against engineering calendars**. A founder shipping a strong product in Q1 of a year may discover the IOU has already filed its rate case for the year, has a fixed capital budget, and cannot purchase outside that envelope until the next rate case cycle (12-18 months later).

The mitigation pattern: **engage the utility's regulatory affairs team alongside the technology team during the sales motion**. The regulatory affairs team owns the rate-case timeline and can either (a) accelerate the founder's offering into the current rate case if there is room, or (b) advise the founder on timing for the next cycle.

### Failure mode 3: the timeline-mismatch between AI demand and SMR delivery

AI data centers need power **now**. SMR commercial deployment in the United States is still **2-5 years away** at minimum (no commercial SMR is yet operational as of May 2026). The gap between demand and supply is being filled in the short term by:

1. **Gas turbines** — fastest-to-deploy capacity but with carbon and water-impact tradeoffs.
2. **Battery storage** — fast-deploying but not always sized for the multi-day demand profile of large data centers.
3. **Reactivated coal** — politically contentious; happening at the margins.
4. **Renewable + storage hybrids** — fastest-growing but limited by interconnection queue length.
5. **Existing nuclear capacity expansion** — Three Mile Island restart, Palisades restart, Diablo Canyon extension, fleet uprate pursuits.

Founders selling AI agents that assume a long-term grid composition (renewables + nuclear + storage) must build for the short-term-substitute reality (gas + storage + coal + small renewables additions). This is most acute for founders building **demand-response orchestration** and **virtual power plant** products: the customer mix of distributed energy resources is shifting on a quarterly basis as the short-term supply mix changes.

---

## Part VI: The MLP Communities

The minimum-lovable-product community for energy + utilities AI agents is concentrated in nine high-density venues:

1. **DistribuTECH (February, varying U.S. cities — 2026 in San Diego)** — the dominant utility-tech conference; ~12,000 attendees.
2. **EEI Annual Convention (June, varying — 2026 in Las Vegas)** — Edison Electric Institute; investor-owned utility executive concentration.
3. **NRECA CEO Close-Up (January, Palm Desert)** — rural electric cooperative CEOs.
4. **APPA National Conference (June)** — public power association.
5. **AGA Operations Conference (April-May)** — American Gas Association.
6. **CERAWeek (March, Houston)** — global energy executive conference; oil & gas + utilities crossover.
7. **OTC Offshore Technology Conference (May, Houston)** — offshore oil & gas + offshore wind.
8. **SPE ATCE Annual Technical Conference (October)** — Society of Petroleum Engineers technical community.
9. **ANS Annual Meeting + Winter Meeting** — American Nuclear Society.

Adjacent media surfaces include **Utility Dive, T&D World, Energy Central, Greentech Media, S&P Global Market Intelligence (Platts), Bloomberg NEF, Wood Mackenzie, Wall Street Journal Energy, Reuters Energy**. Coverage in any of these moves utility CIO + executive attention.

The discovery rule: a founder selling into utilities should be **at DistribuTECH every year**, with substantive booth presence; should attend **EEI or NRECA depending on customer mix**; and should produce public artifacts (white papers, conference presentations, peer-reviewed publications) at the cadence of one per quarter. The energy vertical's prestige-led-distribution motion (perea.ai canon Distribution Playbook #24) maps onto utility associations particularly cleanly because of the relatively small named-buyer pool.

---

## Part VII: GTM Decision Tree

A founder selling AI agents into energy + utilities must pick exactly one of eight primary paths on day one. The eight paths:

```
                  Energy & Utilities AI Agents
                              │
   ┌──────────┬───────────────┼─────────────┬──────────────────┐
   │          │               │             │                  │
   IOU       Public Power   Rural Coop    ISO / RTO         Oil & Gas
   direct   (APPA)         (NRECA)       (PJM, MISO,       Major
                                          ERCOT, ISO-NE,
                                          NYISO, CAISO,
                                          SPP)
   │          │               │             │                  │
   $500K-    $250K-          $50K-         $1M-              $1M-
   $50M+     $10M            $2M           $25M              $100M+
   NERC CIP   NERC CIP       NERC CIP      NERC CIP          OT-IT
   gate      gate            gate          gate              IEC 62443
                                                              gate
   FERC +    State PUC                                       SLB / HAL
   PUC                                                       channel

   ┌─────────────────────┬──────────────────────┐
   │                     │                      │
   Renewables         Nuclear / SMR          Energy
   developer          developer              storage
   (NextEra Resources, (Constellation,        (Tesla Energy,
   Brookfield Renewable, Vistra, Oklo,         Form Energy,
   Pattern Energy,       NuScale,              Energy Vault,
   Invenergy)            Kairos Power,         Fluence)
                         X-energy)
   │                     │                      │
   $100K-               $1M-                   $250K-
   $10M                 $50M                   $15M
   ACORE / SEIA         ANS / NEI              ESS Tech /
                                                ACP
```

The branching logic:

1. **IOU direct** — largest deal size, slowest sales cycle, NERC CIP gate. Founder requires CIP compliance + utility-domain credibility + 12-24 month sales cycle. Reference deals: Schneider Electric–AutoGrid + Bidgely. Reference deal size: $500K-$50M+.

2. **Public Power** — RFP-driven, more transparent than IOU, often cooperative purchasing. Reference deal size: $250K-$10M.

3. **Rural Electric Cooperative** — NRECA group purchasing channel; ~900 cooperatives with ~42M end customers. Reference deal size: $50K-$2M per coop.

4. **ISO/RTO** — system-wide visibility into wholesale electricity markets; uniquely positioned for market-clearing AI agents. Reference deal size: $1M-$25M per ISO/RTO. Highest technical bar; smallest buyer count (7 ISO/RTOs in North America).

5. **Oil & Gas major** — competition with SLB Tela + Halliburton DS365.ai + Baker Hughes Cordant. Channel partnerships often required. Reference deal size: $1M-$100M+.

6. **Renewables developer** — fast-growing buyer mix; AI agents for project siting, asset management, market participation. Reference deal size: $100K-$10M.

7. **Nuclear utility / SMR developer** — small but very-high-deal-value market; AI agents for plant operations, predictive maintenance, regulatory submissions. Reference deal size: $1M-$50M.

8. **Energy storage** — fastest-growing buyer mix for grid-edge AI; agents for market participation, dispatch optimization, asset health. Reference deal size: $250K-$15M.

The two paths that maximize accessibility-to-velocity for a sub-100-engineer founder are **Rural Electric Cooperative** (NRECA-channel, lower deal size, less restrictive CIP regime) and **Renewables developer** (fast-growing, technology-friendly buyer mix, no CIP gate at the development stage). These two paths together account for the majority of accessible vertical-AI revenue in energy for new entrants without prior utility credibility.

The two paths that founders most often misjudge are **IOU direct** (founders underestimate the NERC CIP + rate-case timeline) and **Oil & Gas major** (founders underestimate the SLB / Halliburton / Baker Hughes channel control). Both are real markets but require channel partnerships or 18-24 month direct sales cycles.

---

## Closing thread

This paper closes the energy + utilities vertical thread for the perea.ai canon. The State of Vertical Agents series now spans **eleven verticals**: legal, insurance, healthcare, accounting, CRE, construction, government (civilian), pharma, cybersecurity, defense + aerospace, and energy + utilities.

Three threads surface for future papers in the canon:

1. **The hyperscaler-utility PPA playbook** — the Microsoft–Constellation, Google–Kairos, Amazon–Susquehanna pattern is a $100B+ capital-allocation story that deserves its own focused entry. The founder-decision architecture for AI-data-center-power-procurement-vendor positioning would be valuable.
2. **The NERC CIP compliance playbook for utility AI vendors** — the single biggest unmet demand in the utility AI vendor ecosystem is packaged CIP-compliance documentation. A focused playbook on CIP-002 through CIP-015 for AI agent vendors would deserve its own entry.
3. **The virtual-power-plant (VPP) operator playbook** — VPP AI is the fastest-growing 2026 sub-segment in energy; the founder-decision architecture (residential vs commercial-and-industrial vs grid-scale; wholesale-market participation vs retail-bill-savings) would deserve its own entry.

The implementation gap chasm pattern from the cross-vertical operations canon (60-70 percentage-point gap between pilot adoption and production achievement) operates in utilities too — but the gap there is dominated by **NERC CIP compliance + state PUC approval cycle timing**, not technology. A founder who can compress a utility's path-to-production from 24 months to 9 months by pre-packaging CIP-compliance documentation + rate-case-aligned pricing + pilot-to-production-bridge financing into a single offering will outrun every competitor still selling raw model access. That compression is the present opportunity in 2026.

The hyperscaler-utility PPA capital allocation pattern is still being priced in by the public markets. **Constellation Energy at $25.5B 2025 revenue + 21 reactors + multiple long-term hyperscaler PPAs** is the canonical reference for the new utility business model. The next 18 months will determine which AI agent vendors anchor themselves to this reference and which remain horizontal-AI plays without utility-vertical positioning.

---

## References

1. **AI in Energy & Utilities market** — $3.17B (2024) → $3.8B (2025) → $7.7B (2029); GlobeNewswire / Cognitive Market Research.
2. **AI-Powered Smart Grid market** — $12.79B opportunity in 2026 forecast horizon.
3. **U.S. utilities planning $1.4T capex for AI data centers** — 27% capex surge.
4. **Data center electricity demand to ~1,000 TWh by 2026** — IEA + IATA reporting.
5. **Microsoft–Constellation Three Mile Island Unit 1 restart** — 2027; 835 MW; $1.6B project; $1B DOE loan; 20-year PPA.
6. **Google–Kairos Power 500 MW molten-salt reactors** — by 2035.
7. **Amazon–Susquehanna $20B+ AI campus.**
8. **Constellation Energy** — 21 reactors; $25.5B 2025 revenue; $2.32B net income; 90%+ capacity factors.
9. **SMR offtake pipeline** — 25 GW (end 2024) → 45 GW today.
10. **15 reactors planned to come online globally in 2026.**
11. **Schneider Electric–AutoGrid** — DER management; 5,000+ MW across 100+ partners in 15+ countries.
12. **Schneider Electric One Digital Grid Platform.**
13. **Bidgely UtilityAI Pro at DistribuTECH 2026; Grid4C acquisition.**
14. **AutoGrid Flex production results** — 20% peak load reduction; 15% operational cost decrease at major utility.
15. **SLB Tela agentic AI** — cloud or on-premises deployment.
16. **Halliburton DS365.ai intelligent automation.**
17. **Petrobras AI Strategy** — canonical NOC reference.
18. **NERC CIP-002 through CIP-015** — bulk electric system cybersecurity rules; CIP-015 (Internal Network Security Monitoring) added 2025.
19. **DistribuTECH 2026** — February 2-5, San Diego.
20. **EEI 2026** — June 2-4, Las Vegas; **NRECA CEO Close-Up** January 11-13, Palm Desert.

---
title: "State of Vertical Agents 2026: Telecom & Network Operations"
subtitle: "AT&T Ask AT&T at 100K users + 5B tokens/day + 410 agents, 37% outage reduction in 2025, MWC 2026's 'year of agents' keynote, Rakuten Symphony Site Management 2.0 across 3.5M sites — and the AI-RAN inflection"
publication: "perea.ai Research"
authors: ["Dante Perea"]
version: "1.0"
status: "Public draft"
date: "2026-05"
audience: "Founders, GTM leads, and product teams selling AI agents into telecom carriers (mobile + fixed-line + cable), network operations, RAN automation, OSS/BSS, customer experience, network slicing + private 5G, and field service + tower management — plus operators evaluating MVNO + AI-native carrier adjacencies."
length: "~5,200 words"
license: "CC BY 4.0"
description: "The seventeenth entry in the State of Vertical Agents series, mapping the U.S. and global telecom + network operations AI agent market as it exists in May 2026. Covers the AT&T Ask AT&T platform (100,000+ users; 750M+ API calls; ~5B tokens/day; 410+ agents serving different use cases) and AT&T Network Operations agentic AI (37% reduction in service-affecting outages 2025; 1B+ network events/day; autonomous adjustments to 200+ parameters; 12M customer-impacting downtime minutes prevented Q4 2025). Documents Verizon's 5-10x autonomous-agent strategy + Verizon AI Connect + MWC 2026 network-slicing demo with Amdocs orchestration. Covers T-Mobile's Expert Agent augment-not-replace pattern. Documents Mobile World Congress 2026 (March 2-5 Barcelona) as 'the year of agents' (Qualcomm CEO Cristiano Amon keynote): NVIDIA specialized AI agents + Ericsson + Nokia agentic AI for RAN optimization + traffic routing + fault detection across multi-vendor environments + Ericsson-Ookla 5G slice SLA measurement + Deutsche Telekom world premiere of AI-powered call assistant. Documents the Open RAN ecosystem: AT&T-Ericsson commercial-scale deployment + Mavenir + Fujitsu radio collaborations + Rakuten Symphony Autonomous OSS Platform + Rakuten RIC nationwide deployment with third-party rApps + Site Management 2.0 across 3.5M+ sites globally. Maps the eight subvertical buying paths (network operations + RAN automation / customer experience / 5G+6G core + standalone network / OSS+BSS / network slicing + private 5G / field service + tower management / fraud + security ops / MVNO + AI-native carrier). The three failure modes (the Open RAN multi-vendor integration tax + the CALEA + lawful intercept compliance gate + the carrier-grade five-nines reliability requirement). MLP communities (MWC Barcelona + MWC Las Vegas + TM Forum DTW + Network X + Big 5G Event). Closes the telecom + network operations vertical thread."
---

## Foreword

This paper is the seventeenth entry in the State of Vertical Agents series. Previous entries mapped legal, insurance, healthcare, accounting, commercial real estate, construction, government, pharma, cybersecurity, defense + aerospace, energy + utilities, logistics + freight, manufacturing + industrial, retail + CPG, HR + recruiting, and education + EdTech. The telecom + network operations vertical is unique in the canon for **carrier-grade reliability requirements**: a 5G mobile network is expected to deliver 99.999% uptime (five nines, or roughly 5.26 minutes of downtime per year). No other vertical the perea.ai canon has covered operates under a comparable reliability ceiling. The autonomous-agent trade-off — speed of automation vs cost of error — is more constrained in telecom than anywhere else.

It is also a vertical that has just declared **"2026 as the year of agents"** at the highest level of public discourse. **Qualcomm CEO Cristiano Amon's MWC 2026 Barcelona keynote** (March 2-5) made this claim explicit. **AT&T's Ask AT&T platform** has reached **100,000+ employees**, processes **5 billion tokens/day**, runs **410+ agents**, and reduced service-affecting outages by **37% in 2025**. **Verizon** is pursuing a 5x-10x autonomous-agent transformation. **Rakuten Symphony's Site Management 2.0** is deployed across **3.5+ million sites globally**. The platform-tier vendors (Ericsson + Nokia + NVIDIA + Mavenir) shipped agentic AI for RAN optimization + traffic routing + fault detection within a single quarter. The vertical is not adopting AI agents — it is being rebuilt around them.

This paper is for founders deciding whether the telecom + network operations vertical is accessible despite the carrier-grade reliability ceiling, what subvertical to pick, and how to map the eight-path buying surface.

## Executive Summary

1. **AT&T's Ask AT&T platform is the canonical carrier-AI agent reference.** **100,000+ users**, **750+ million API calls**, **~5 billion tokens/day**, **410+ agents** serving different use cases. **Ask Operations** running on the network side with agentic AI + human oversight. Network optimization agents **reduced service-affecting outages by 37% in 2025**; process **1 billion+ network events per day**; make autonomous adjustments to **200+ network parameters**; **prevented 12 million customer-impacting downtime minutes in Q4 2025 alone**. This is the largest single-carrier production agentic AI deployment globally.

2. **MWC 2026 Barcelona (March 2-5) was the canonical "year of agents" announcement venue.** **Qualcomm CEO Cristiano Amon's keynote** declared 2026 as the year of agents. **NVIDIA** announced specialized AI agents for customer care + network operations + sovereign AI factories + AI-RAN in live wireless networks. **Ericsson + Nokia** demonstrated agentic AI managing RAN optimization + traffic routing + fault detection across multi-vendor environments. **Ericsson-Ookla industry-first 5G slice performance measurement** for SLA enforcement. **Deutsche Telekom world premiere of AI-powered call assistant**. The platform tier consolidated within a single 3-day event.

3. **Verizon's 5-10x autonomous-agent strategy + Verizon AI Connect is the canonical enterprise AI infrastructure play.** Verizon is shifting toward autonomous agents to **create a 5x-10x version of their employees**. **Verizon AI Connect** is the AI network infrastructure + workload solutions offering. **Amdocs orchestration of network slicing** for Verizon at MWC 2026 demonstrated the operationalized intent.

4. **T-Mobile's Expert Agent represents the augment-not-replace canonical pattern.** Pre-analyzes customer issues + pulls relevant account history + provides real-time suggestions + handles post-call documentation. Augments rather than replaces human agents. This is the canonical reference for telecom carriers that prioritize human-employee-in-the-loop in customer-facing AI.

5. **The Open RAN ecosystem is reshaping the radio-access-network buying landscape.** **AT&T-Ericsson commercial-scale Open RAN** (largest U.S. deal). **AT&T-Fujitsu + AT&T-Mavenir** radio agreements for crowded urban areas. **Mavenir retains Open RAN vendor crown**. **Rakuten Symphony Autonomous OSS Platform** + **RAN Intelligent Controller (RIC) nationwide deployment in Japan** with **third-party rApp integrations**. **Rakuten Site Management 2.0 across 3.5+ million sites globally**. **Mavenir CEO publicly warns of Ericsson-Nokia duopoly stalling Open RAN** — the political tension is real and shapes founder-positioning decisions.

6. **Three failure modes gate every telecom AI deployment.** (a) **The Open RAN multi-vendor integration tax** — multi-vendor RAN environments require integration across Ericsson + Nokia + Samsung + Mavenir + Fujitsu + Rakuten Symphony OSS layers; founders shipping into the RAN tier face a deeply fragmented integration burden. (b) **The CALEA + lawful intercept compliance gate** — any agent that touches voice + data carrier networks must support the Communications Assistance for Law Enforcement Act (CALEA) wiretap requirements + emergency services (E911 + Next Generation 911) + the Customer Proprietary Network Information (CPNI) regime. (c) **The carrier-grade five-nines reliability requirement** — 99.999% uptime means ~5.26 minutes of downtime per year; AI agents that introduce uncertainty into the reliability budget cannot ship into network-touching workflows without extensive validation.

7. **The eight-path telecom GTM decision tree separates the accessible markets from the moonshots.** **(1) Network operations + RAN automation** (Ericsson + Nokia + Mavenir + Rakuten Symphony partner channel). **(2) Customer experience** (Verizon AI Connect + T-Mobile Expert Agent + Deutsche Telekom call assistant pattern). **(3) 5G/6G core + standalone network** (Ericsson + Nokia + Samsung + Mavenir partner channel). **(4) OSS/BSS** (Amdocs + Netcracker + Ericsson Network Cloud + Nokia AVA + Rakuten Symphony). **(5) Network slicing + private 5G** (enterprise-edge agents — most accessible for sub-100-engineer founders). **(6) Field service + tower management** (Rakuten Site Management 2.0 pattern + drone inspection). **(7) Fraud + security operations** (SS7 + Diameter signaling + telecom-specific fraud). **(8) MVNO + AI-native carrier** (Mint Mobile + AI-native operator pattern). Each has a different technical depth, deal size, and CALEA-compliance regime.

---

## Part I: The Market

### Topline TAM

Global telecommunications service revenue: approximately **$1.6T in 2026**. Telecom OpEx is approximately **$0.8T/year**, of which network operations + customer service + IT spending represent the largest discretionary categories that AI agents target. Network infrastructure + equipment spending: **~$300B/year** (Ericsson + Nokia + Samsung + Huawei + ZTE + Mavenir + Cisco). The AI-in-telecom sub-market is approximately **$10-15B in 2026** trending toward **$50-80B by 2030** as agentic AI replaces an estimated 30-40% of OSS + BSS + customer-service operations spending.

The addressable AI-platform TAM within telecom is **larger than the AI-in-telecom TAM alone** because every category (RAN + core + OSS + BSS + customer experience + field service + fraud) is layering AI agents simultaneously. Telecom is the vertical where AI-agent adoption is happening fastest at scale.

### Capital flows

Three categories of capital flow shaped the 2025-2026 landscape:

1. **Carrier internal AI investment.** **AT&T Ask AT&T** + Network Operations + Ask Operations (4-year build-out, hundreds of millions invested). **Verizon AI Connect** + autonomous-agent transformation. **T-Mobile Expert Agent** + customer-facing agentic AI. **Deutsche Telekom AI call assistant** premiered MWC 2026. **BT, Vodafone, Orange, Telefónica, NTT DoCoMo, KDDI, China Mobile, China Telecom, China Unicom** equivalent programs.
2. **Network-equipment-vendor AI investment.** **Ericsson + NVIDIA partnership** (Saudi Arabia AI infrastructure 2024+; Open RAN AI). **Nokia AVA + AI Studio**. **Samsung Networks AI**. **Mavenir agentic AI** for Open RAN. **Rakuten Symphony autonomous OSS + RIC + Site Management 2.0** ($3.5+ million sites globally). **NVIDIA Aerial + AI-RAN**.
3. **AI-native telecom startup VC.** Multiple Series A/B/C rounds across operator-tools, network-automation, customer-experience-augmentation, fraud-detection, and MVNO + AI-native-carrier startups; per-deal sizes typically $10M-$200M.

### Why now

Four 2025-2026 inflections compounded into the current market:

1. **AT&T's Ask AT&T scaling to 100,000+ users + 5B tokens/day** demonstrated that carrier-grade agentic AI can deploy at scale, removing the "AI is not reliable enough for telecom" thesis from the founder's risk inventory.
2. **MWC 2026 platform consolidation** (March 2-5 Barcelona) — NVIDIA + Ericsson + Nokia + Qualcomm + Deutsche Telekom + Verizon all shipped agentic AI within a 3-day window.
3. **The 37% outage reduction at AT&T** in 2025 produced an empirical anchor for agentic-AI ROI in network operations.
4. **AT&T-Ericsson commercial-scale Open RAN** (largest U.S. deal) validated the multi-vendor RAN architecture that AI agents now enable, reshaping the next decade of network-equipment buying.

---

## Part II: The Buying Map

The telecom buyer is structured into eight distinct paths, each with a different gate, vehicle, and timeline.

### Tier-1 carrier — mobile

- **Discovery surface:** Mobile World Congress (MWC) Barcelona (March), MWC Las Vegas (October), TM Forum Digital Transformation World (DTW Madrid June), Network X (Paris October), Big 5G Event (Denver), 5G Americas Industry Forum.
- **Procurement vehicle:** Direct enterprise sale; multi-year platform agreements; sometimes co-development partnerships with named integrators (Accenture + Ericsson + Nokia + IBM + Capgemini + Tech Mahindra).
- **Reference deal sizes:** $1M-$100M+ over 3-5 year contracts.
- **Decision authority:** CTO (Chief Technology Officer), Chief Network Officer, Chief Digital and Information Officer (CDIO), VP Network Operations, VP Customer Experience.
- **Named buyers:** AT&T, Verizon, T-Mobile, Deutsche Telekom, Vodafone, Orange, Telefónica, BT, Orange Business, KPN, Swisscom, NTT DoCoMo, KDDI, SoftBank, China Mobile, China Telecom, China Unicom, Reliance Jio, Bharti Airtel, América Móvil, Claro.
- **Compliance gate:** **CALEA + Customer Proprietary Network Information (CPNI) + E911 + Next Generation 911**; FCC/Ofcom/EU EECC/per-country regulatory frameworks; ISO 27001 + SOC 2 + GDPR baseline.

### Tier-1 carrier — fixed-line + cable

- **Discovery surface:** SCTE TechExpo (cable industry); BroadbandWorld Forum; same MWC + TM Forum DTW.
- **Procurement vehicle:** Direct enterprise sale; sometimes via cable-MSO consortium (CableLabs).
- **Reference deal sizes:** $500K-$50M.
- **Named buyers:** Comcast, Charter (Spectrum), Cox Communications, Liberty Global (Virgin Media), DT (DT Fiber), Orange Wholesale, Lumen (CenturyLink), Frontier, Windstream.

### Tier-2/3 regional carrier

- **Discovery surface:** CCA (Competitive Carriers Association), NTCA (Rural Wireless Association), regional operator events.
- **Procurement vehicle:** Direct sale; sometimes via wholesale agreements with Tier-1 carriers.
- **Reference deal sizes:** $50K-$10M.
- **Named buyers:** UScellular, C Spire, Smith Bagley, Cincinnati Bell, ATN International, regional CLECs.

### MVNO + AI-native carrier

- **Discovery surface:** MVNO Global Industry Summit; MVNO Nation Live; MWC.
- **Procurement vehicle:** Direct sale; sometimes via wholesale-network partnerships.
- **Reference deal sizes:** $25K-$5M.
- **Strategic note:** **Mint Mobile + Helium + Boost Mobile + Visible (Verizon)** + emerging AI-native MVNOs that operate entirely through agentic-AI customer service + zero-touch onboarding represent a new founder-accessible category.

### Network-equipment vendor (as buyer of AI agent platforms)

- **Discovery surface:** MWC, Optical Fiber Conference (OFC), IEEE Globecom.
- **Procurement vehicle:** Embedded as OEM platform partnership; rev-share or per-vendor licensing.
- **Reference deal sizes:** $500K-$50M.
- **Named buyers:** Ericsson, Nokia, Samsung Networks, Mavenir, Cisco, Juniper Networks, Ciena, Fujitsu, NEC, Rakuten Symphony.

### OSS / BSS vendor

- **Discovery surface:** TM Forum DTW; OSS/BSS Symposium; CSP transformation events.
- **Procurement vehicle:** OEM platform partnership or direct enterprise sale through OSS/BSS vendor channel.
- **Reference deal sizes:** $250K-$25M.
- **Named buyers:** Amdocs, Netcracker (NEC), Comarch, Optiva, BearingPoint Infonova, MATRIXX Software, Subex, Hansen Technologies, BSS-One.

### Tower / infrastructure operator

- **Discovery surface:** Wireless Infrastructure Association (WIA) Connectivity Expo; Towerxchange events.
- **Procurement vehicle:** Direct enterprise sale; sometimes integration with site-management platforms (Rakuten Site Management 2.0 pattern).
- **Reference deal sizes:** $100K-$10M.
- **Named buyers:** American Tower, Crown Castle, SBA Communications, Cellnex, IHS Towers, Helios Towers, Indus Towers.

### Network systems integrator + IT services partner

- **Discovery surface:** Same MWC + TM Forum events.
- **Procurement vehicle:** Embedded as service-augmentation; rarely OEM-direct.
- **Reference deal sizes:** $100K-$25M.
- **Named buyers:** Accenture, Capgemini, Tech Mahindra, IBM, HCLTech, Wipro, TCS, Cognizant, Infosys, NTT DATA.

### What is **not** in the buying map

This paper deliberately omits **voice-first carrier customer-service AI agents** (voice-bot-mediated billing inquiry, plan changes, technical support agents that operate exclusively through phone-call interfaces), per the user's standing rejection of voice-first verticals. Multi-modal text + voice agents (T-Mobile Expert Agent pattern) that augment human-agent workflows are within scope; pure-voice-only carrier customer service is excluded.

---

## Part III: The Incumbent + Disruptor Topology

### The structural incumbents — Tier-1 U.S. carrier tier

**AT&T (NYSE: T).** Ask AT&T platform (100K+ users + 5B tokens/day + 410+ agents + 750M+ API calls). Ask Operations agentic AI for network. AT&T-Ericsson commercial-scale Open RAN. AT&T-Fujitsu + AT&T-Mavenir radio collaborations. The dominant U.S. carrier-AI deployment reference.

**Verizon (NYSE: VZ).** Verizon AI Connect (AI network infrastructure + workload solutions). 5-10x autonomous-agent transformation strategy. Amdocs orchestration of network slicing demonstrated MWC 2026.

**T-Mobile (NASDAQ: TMUS).** Expert Agent augment-not-replace pattern. Magenta AI customer service. Strong customer-experience-AI focus.

### The structural incumbents — global Tier-1 carrier tier

**Deutsche Telekom + T-Systems** (XETRA: DTE). MWC 2026 world premiere of AI-powered call assistant. Strong European integration.

**Vodafone Group** (LSE: VOD). AI Connect platform. Global footprint.

**Orange + Orange Business** (EPA: ORA). 5G Lab + Big5G Lab innovation programs.

**Telefónica** (BME: TEF). LIVE.AI + global digital-transformation initiatives.

**BT Group** (LSE: BT.A). Global Services + customer-facing AI.

**NTT DoCoMo + KDDI + SoftBank.** Japanese carrier tier with strong Open RAN + AI integration via Rakuten Symphony.

**China Mobile + China Telecom + China Unicom.** Chinese carrier tier.

**Reliance Jio.** Indian carrier with substantial AI deployment.

### The structural incumbents — network equipment + RAN

**Ericsson (NASDAQ: ERIC).** Open RAN leader (post-AT&T deal); MWC 2026 agentic AI for RAN optimization + traffic routing + fault detection. Ericsson-Ookla 5G slice SLA measurement. Ericsson-NVIDIA partnership for Open RAN AI.

**Nokia (HEL: NOKIA).** AVA (AI-Virtuoso platform) + AI Studio. Multi-vendor RAN + 5G core + IP networking.

**Samsung Networks.** Strong in U.S. + Asia 5G; AI-RAN partnerships.

**Mavenir.** Cloud-native vRAN + Open RAN; retains Open RAN vendor crown; CEO publicly warns of Ericsson-Nokia duopoly stalling Open RAN.

**Cisco Systems (NASDAQ: CSCO).** Service-provider IP + segment routing + SD-WAN.

**Juniper Networks (NYSE: JNPR).** AI-Native Networking; Mist AI (acquired 2019).

**Ciena (NYSE: CIEN).** Optical + packet networking.

**Fujitsu, NEC.** Open RAN radio + Japanese-market dominance.

**Rakuten Symphony.** Autonomous OSS Platform + RAN Intelligent Controller (RIC) nationwide in Japan + third-party rApp integrations + Site Management 2.0 across 3.5M+ sites globally + Top 25 AI initiatives + Agent Store.

### The structural incumbents — OSS/BSS tier

**Amdocs (NASDAQ: DOX).** Largest OSS/BSS vendor globally; Verizon network-slicing orchestration partnership.

**Netcracker (NEC).** Strong Tier-1 carrier installed base.

**Comarch (Polish-listed).** European OSS/BSS.

**Optiva, MATRIXX Software, BearingPoint Infonova, Subex, Hansen Technologies.** Mid-tier OSS/BSS vendors.

### The structural incumbents — cloud + AI infrastructure

**NVIDIA (NASDAQ: NVDA).** Aerial + AI-RAN; specialized AI agents for customer care + network operations; sovereign AI factories. The dominant compute substrate for telecom AI.

**Microsoft Azure for Operators + Azure Communications Services + Copilot.**

**AWS for Telecom + AWS Wavelength + AWS Private 5G.**

**Google Cloud Telecom + AI for Telecommunications.**

### The disruptor map

Three categories of disruptor are worth tracking:

1. **AI-native MVNO + carrier startups** — emerging operators offering zero-touch onboarding + agentic-AI customer service + no-call-center economics.
2. **Carrier-tools + automation startups** — Cellwize (acquired by Qualcomm), Subex, Cataleya, Aria Networks.
3. **Specialized network-AI startups** — Aira Technologies (deep learning for 5G PHY layer), Mavenir spin-off RAN automation, Polte (location services with AI).

---

## Part IV: Production Deployments

### AT&T Ask AT&T + Ask Operations

- **100,000+ users** across the company.
- **750+ million API calls**.
- **~5 billion tokens/day**.
- **410+ agents** serving different use cases.
- **Ask Operations** running on the network side with agentic AI + human oversight.
- **Network optimization agents reduced service-affecting outages by 37% in 2025**.
- **Processes 1 billion+ network events per day**.
- **Autonomous adjustments to 200+ network parameters**.
- **Prevented 12 million customer-impacting downtime minutes in Q4 2025 alone**.

### Verizon AI Connect + autonomous-agent transformation

- 5x-10x autonomous-agent transformation strategy.
- Verizon AI Connect for AI network infrastructure + workload solutions.
- Amdocs orchestration of network slicing demonstrated at MWC 2026.

### T-Mobile Expert Agent

- Pre-analyzes customer issues + pulls relevant account history + provides real-time suggestions + handles post-call documentation automatically.
- Augment-not-replace pattern.

### Deutsche Telekom AI-powered call assistant

- World premiere at MWC 2026.

### Rakuten Symphony

- **Autonomous OSS Platform** (data foundations + ML models + LLMs + Agentic AI + Agent Store).
- **RAN Intelligent Controller (RIC) nationwide deployment** across Rakuten Mobile commercial network in Japan with third-party rApp integrations.
- **Site Management 2.0** deployed across **3.5+ million sites globally** with carriers worldwide.

### NVIDIA at MWC 2026

- Specialized AI agents for customer care + network operations.
- Sovereign AI factories.
- AI-RAN in live wireless networks.

### Ericsson + Nokia

- Agentic AI managing RAN optimization + traffic routing + fault detection across multi-vendor environments.
- Ericsson-Ookla industry-first 5G slice performance measurement (SLA enforcement).

### What "production" means in telecom AI

The autonomous-task ratio in telecom AI is **bimodal**, depending on whether the agent touches the carrier-grade reliability budget:

- **Customer-experience AI** (T-Mobile Expert Agent / Deutsche Telekom call assistant pattern): **40-60% autonomous** — narrow, well-bounded operations (account lookups, plan-change recommendations, post-call documentation); humans-in-the-loop for high-stakes decisions.
- **Internal-employee AI** (AT&T Ask AT&T pattern): **40-60% autonomous** for non-network-touching workflows.
- **Network-touching AI** (Ask Operations / RAN automation / OSS/BSS): **10-25% autonomous** — narrowest scope due to carrier-grade reliability constraints + CALEA + lawful intercept + CPNI compliance + risk of service-affecting outages.
- **Fraud + security operations**: **30-50% autonomous** — narrower than customer-experience but broader than network-touching, with strong human-in-the-loop pattern for high-impact alerts.

The 37% AT&T outage reduction provides empirical evidence that the 10-25% autonomous-network-touching scope produces material reliability gains — but those gains require extensive validation + monitoring + rollback infrastructure to maintain the carrier-grade reliability ceiling.

---

## Part V: The Three Failure Modes

### Failure mode 1: the Open RAN multi-vendor integration tax

Multi-vendor RAN environments require integration across:

- **Radio Unit (RU) vendors** — Ericsson, Nokia, Samsung, Mavenir, Fujitsu, NEC.
- **Distributed Unit (DU) + Centralized Unit (CU) vendors** — same plus cloud-native vendors (Rakuten Symphony, Mavenir).
- **RAN Intelligent Controller (RIC) platforms** — Rakuten Symphony, Cisco, Juniper, Mavenir, third-party rApp ecosystem.
- **Core network vendors** — Ericsson, Nokia, Samsung, Mavenir, Cisco, Athonet (HPE).
- **OSS/BSS layers** — Amdocs, Netcracker, Comarch, Rakuten Symphony OSS.
- **Service orchestration** — Cisco, Nokia NSP, Ericsson Network Cloud, Nephio (open source).

Founders shipping AI agents into the RAN tier face a deeply fragmented integration burden. **Mavenir CEO publicly warns of Ericsson-Nokia duopoly stalling Open RAN** — the political tension is real and shapes founder-positioning decisions.

The mitigation patterns:

1. **Pick a primary RAN partner** (Ericsson + Nokia + Mavenir + Rakuten Symphony) and build excellent integration with that partner first.
2. **Build for the Rakuten Symphony Agent Store + RIC rApp ecosystem** — fastest path to multi-carrier deployment.
3. **Position as a cloud-native + multi-vendor agent layer** that works across the major RAN incumbents rather than displacing them.

### Failure mode 2: the CALEA + lawful intercept compliance gate

Any AI agent that touches voice + data carrier networks must support:

- **CALEA (Communications Assistance for Law Enforcement Act, 1994)** — wiretap requirements for telecommunications carriers and broadband providers.
- **E911 + Next Generation 911 (NG911)** — emergency-services location and call routing.
- **Customer Proprietary Network Information (CPNI)** — FCC rules governing customer data protection + opt-in for use in marketing.
- **Section 222 of the Communications Act** — broader customer information protection framework.
- **Data retention rules** — varying by jurisdiction (EU Data Retention Directive history, national-level rules).
- **SS7 + Diameter signaling-layer security** for cross-network agents.
- **TR-069 / TR-369 device management protocols** — secure device + agent management.

Founders shipping AI agents into telecom carrier production must build:

1. **CALEA-compliant data handling** + lawful intercept hooks where applicable.
2. **CPNI scope enforcement** — every agent that touches customer data must respect Section 222 + state-level overlays.
3. **NG911 integration paths** for any agent that handles voice or messaging.

### Failure mode 3: the carrier-grade five-nines reliability requirement

**99.999% uptime** means **5.26 minutes of downtime per year**. Carriers contractually commit to this in enterprise SLAs and operationally hold their network ops teams to even tighter standards. AI agents that introduce uncertainty into the reliability budget cannot ship into network-touching workflows without extensive validation:

1. **Canary deployment** — agents must be deployable to a subset of network elements + traffic + customers before full rollout.
2. **Rollback + circuit-breaker patterns** — agents must self-disable if their actions degrade observability or reliability metrics.
3. **Chaos engineering + redundancy** — agents must be tested against failure scenarios.
4. **Multi-region + multi-active deployment** — for cross-network agents.
5. **Audit-trail completeness** — every agent decision logged with timestamp + input + output + downstream effect.

The five-control compliance pattern from the perea.ai canon's healthcare-agent-incidents-and-compliance paper (#35) translates to telecom as: **carrier-event gateway logging + write-once compliance audit logs + audit-completeness CI/CD gate + CALEA + CPNI + lawful-intercept reporting validation + customer-data scope enforcement.**

---

## Part VI: The MLP Communities

The minimum-lovable-product community for telecom + network operations AI agents is concentrated in nine high-density venues:

1. **Mobile World Congress (MWC) Barcelona (March)** — the dominant global telecom conference; >100,000 attendees; canonical announcement venue (Qualcomm "year of agents" keynote at MWC 2026; NVIDIA + Ericsson + Nokia + Verizon + Deutsche Telekom + Rakuten Symphony all major announcements there).
2. **MWC Las Vegas (October)** — North America-focused; CTIA-affiliated.
3. **TM Forum Digital Transformation World (DTW Madrid June)** — TM Forum standards + autonomous network programs; canonical OSS/BSS venue.
4. **Network X (Paris October)** — operators + vendors + ecosystem (formerly Broadband World Forum).
5. **Big 5G Event (Denver)** — North America 5G operator + vendor focus.
6. **Optical Fiber Conference (OFC) (March, varying)** — optical networking + transport.
7. **IEEE Global Telecommunications Conference (Globecom)** — academic + research + standards.
8. **CTIA 5G Summit + Connect (X)** — North American CTIA events.
9. **WIA Connectivity Expo + Towerxchange** — tower + infrastructure operators.

Adjacent media surfaces include **Light Reading, Fierce Network (formerly Fierce Wireless), Mobile World Live, RCR Wireless News, Telecom TV, SDxCentral, TelecomTV, Telecoms.com, Inside Telecom, Capacity Media, Total Telecom, Mobile Europe, Bloomberg Telecom**. Coverage in Light Reading or Fierce Network moves carrier CTO + Chief Network Officer attention more reliably than any other surface.

The discovery rule: a founder selling into telecom should be **at MWC Barcelona every year** (the canonical announcement + decision-maker venue), should attend **TM Forum DTW + Network X + MWC Las Vegas depending on customer mix**, and should produce public artifacts (white papers, conference presentations, sponsored research) at the cadence of one per quarter minimum. The telecom vertical's prestige-led-distribution motion (perea.ai canon Distribution Playbook #24) maps onto MWC Barcelona + TM Forum DTW + Light Reading particularly cleanly because of the high concentration of named decision-makers.

---

## Part VII: GTM Decision Tree

A founder selling AI agents into telecom + network operations must pick exactly one of eight subvertical paths on day one. The eight paths:

```
              Telecom & Network Operations AI Agents
                              │
   ┌──────────┬─────────┬─────┼──────┬─────────┬─────────┬───────────┬────────┐
   │          │         │            │         │         │           │        │
   Network    Customer  5G/6G  OSS/BSS  Network  Field   Fraud +    MVNO +
   ops +      experi-   core +  (Amdocs/  slicing  service security  AI-native
   RAN        ence      stand-  Net-      + private + tower ops       carrier
   automation            alone   cracker/  5G     manage-
                         net-    Comarch/         ment
                         work    Rakuten
                                 Symphony
                                 OSS)
   │          │         │       │         │       │         │         │
   $1M-       $500K-    $1M-    $250K-    $250K-   $100K-   $250K-     $25K-
   $100M+     $50M+     $100M+  $25M      $15M     $10M     $25M       $5M
   over       per       per      per       per      per      per        per
   3-5        deal      deal     deal      deal     deal     deal       deal
   years
   Ericsson + Verizon   Ericsson Amdocs/    Enterprise- Site-     SS7-      Mint
   Nokia +    AI Connect+ Nokia + Netcracker edge      mgmt     Diameter   Mobile
   Mavenir +  T-Mobile  Samsung+ Comarch/   agents     2.0       fraud     pattern
   Rakuten   Expert Mavenir/    Optiva     (most       drone    AI       (zero-
   Symphony   Agent /  cloud-    /MATRIXX    accessible inspection         touch +
   partner   DT call native              for sub-100-           (specialty AI-native
   channel   assistant            engineer founders)             channel)  customer
                                                                          service)
   CALEA +    CPNI +   CALEA +  Same       NG911 +    Same     Same       FCC
   CPNI       Section  CPNI +   compliance E911                                MVNO
   gate       222      lawful   set                                       license
              gate     intercept                                         + carrier
                       gate                                              wholesale
```

The branching logic:

1. **Network operations + RAN automation** — Ericsson + Nokia + Mavenir + Rakuten Symphony partner channel. Reference deal: $1M-$100M+. Highest entry barrier; Open RAN multi-vendor integration tax + carrier-grade reliability required.
2. **Customer experience** — Verizon AI Connect / T-Mobile Expert Agent / Deutsche Telekom call assistant pattern. Reference deal: $500K-$50M+. Strong fit for AI agents that augment human carrier customer-service workflows.
3. **5G/6G core + standalone network** — Ericsson + Nokia + Samsung + Mavenir + Cisco + cloud-native partner channel. Reference deal: $1M-$100M+. Highest technical depth; deeply standards-driven.
4. **OSS/BSS** — Amdocs + Netcracker + Comarch + Optiva + MATRIXX + Rakuten Symphony OSS partner channel. Reference deal: $250K-$25M.
5. **Network slicing + private 5G** — enterprise-edge agents. Reference deal: $250K-$15M. **Most accessible path for sub-100-engineer founders**; growing private-5G enterprise deployment creates greenfield + brownfield demand.
6. **Field service + tower management** — Site Management 2.0 pattern + drone inspection + tower-operator partnerships (American Tower + Crown Castle + SBA). Reference deal: $100K-$10M.
7. **Fraud + security operations** — SS7 + Diameter signaling fraud detection + telecom-specific fraud + SIM swapping + robocall mitigation. Reference deal: $250K-$25M.
8. **MVNO + AI-native carrier** — Mint Mobile pattern + Helium + Boost Mobile + emerging zero-touch AI-native carriers. Reference deal: $25K-$5M; alternatively, founder builds the operator themselves.

The two paths that maximize accessibility-to-velocity for a sub-100-engineer founder are **network slicing + private 5G** (enterprise-edge agents; growing private-5G demand; lower technical depth than full 5G core) and **MVNO + AI-native carrier** (founder-builds-operator pattern; smaller deals but higher founder control). These two paths together account for the majority of accessible vertical-AI revenue in telecom for new entrants without prior telecom credibility.

The two paths that founders most often misjudge are **network operations + RAN automation** (founders underestimate the Open RAN multi-vendor integration tax + the Ericsson-Nokia incumbent power) and **5G/6G core** (founders underestimate the standards-driven + multi-vendor + CALEA-compliance complexity).

---

## Closing thread

This paper closes the telecom + network operations vertical thread for the perea.ai canon. The State of Vertical Agents series now spans **seventeen verticals**: legal, insurance, healthcare, accounting, CRE, construction, government (civilian), pharma, cybersecurity, defense + aerospace, energy + utilities, logistics + freight, manufacturing + industrial, retail + CPG, HR + recruiting, education + EdTech, and telecom + network operations.

Three threads surface for future papers in the canon:

1. **The Open RAN multi-vendor integration playbook** — the integration burden across Ericsson + Nokia + Samsung + Mavenir + Fujitsu + Rakuten Symphony OSS layers is the deepest vendor-fragmentation in any vertical the canon has covered; a focused playbook would deserve its own entry.
2. **The CALEA + lawful intercept compliance playbook for telecom AI vendors** — the regulatory overlay is unique to telecom and represents an under-supplied artifact in the AI vendor ecosystem; a focused playbook would deserve its own entry.
3. **The AI-native MVNO playbook** — Mint Mobile + Helium + emerging zero-touch + AI-native carriers represent a new founder-decision architecture (founder-builds-operator) that did not exist before 2024; a focused playbook on this pattern would deserve its own entry.

The implementation gap chasm pattern from the cross-vertical operations canon (60-70 percentage-point gap between pilot adoption and production achievement) operates in telecom too — but the gap there is dominated by **Open RAN multi-vendor integration burden + CALEA + carrier-grade five-nines reliability validation**, not technology. A founder who can compress a telecom AI deployment from 18 months to 6 months by pre-packaging multi-vendor RAN connectors + CALEA-compliant data handling + canary + circuit-breaker rollback infrastructure into a single offering will outrun every competitor still selling raw model access. That compression is the present opportunity in 2026.

AT&T's Ask AT&T scaling to 100,000 users + 5B tokens/day + 37% outage reduction is the canonical reference for the next decade of telecom AI. The next 18 months will determine whether the AT&T pattern becomes the canonical reference or whether the Rakuten Symphony Agent Store + RIC rApp ecosystem displaces it as the dominant deployment surface — and which AI agent vendors anchor themselves to one of these references rather than compete across both.

---

## References

1. **AT&T Ask AT&T platform** — 100,000+ users; 750+ million API calls; ~5 billion tokens/day; 410+ agents.
2. **AT&T Network Operations agentic AI** — 37% reduction in service-affecting outages 2025; 1B+ network events/day; 200+ parameter autonomous adjustments; 12M customer-impacting downtime minutes prevented Q4 2025.
3. **Verizon AI Connect** + 5-10x autonomous-agent transformation strategy.
4. **Verizon + Amdocs** network-slicing orchestration demonstrated at MWC 2026.
5. **T-Mobile Expert Agent** — augment-not-replace customer experience pattern.
6. **MWC 2026 Barcelona** (March 2-5) — Qualcomm CEO Cristiano Amon "year of agents" keynote.
7. **Deutsche Telekom** — world premiere of AI-powered call assistant at MWC 2026.
8. **NVIDIA at MWC 2026** — specialized AI agents + sovereign AI factories + AI-RAN.
9. **Ericsson + Nokia** — agentic AI for RAN optimization + traffic routing + fault detection across multi-vendor environments.
10. **Ericsson-Ookla** — industry-first 5G slice performance measurement for SLA enforcement.
11. **AT&T-Ericsson commercial-scale Open RAN** — largest U.S. deal.
12. **AT&T-Mavenir + AT&T-Fujitsu** — radio collaborations for crowded urban areas.
13. **Mavenir Open RAN vendor crown** + CEO public warning of Ericsson-Nokia duopoly stalling Open RAN.
14. **Rakuten Symphony Autonomous OSS Platform** + RAN Intelligent Controller (RIC) nationwide deployment in Japan + third-party rApp integrations + Site Management 2.0 across 3.5+ million sites globally.
15. **CALEA (Communications Assistance for Law Enforcement Act, 1994)** + CPNI Section 222 + E911 + Next Generation 911 + SS7/Diameter signaling-layer security.
16. **Carrier-grade five-nines reliability** — 99.999% uptime / ~5.26 minutes downtime/year.
17. **TM Forum Level 4 autonomous networks** — predictive analysis + closed-loop management via AI modeling and continuous learning.
18. **MWC Barcelona + MWC Las Vegas + TM Forum DTW + Network X + Big 5G Event + OFC + IEEE Globecom + CTIA + WIA Connectivity Expo** — primary MLP-community conferences.
19. **Light Reading + Fierce Network + Mobile World Live + RCR Wireless News + Telecom TV + SDxCentral + Telecoms.com + Capacity Media** — primary trade-press surfaces.
20. **AT&T, Verizon, T-Mobile + Deutsche Telekom + Vodafone + Orange + Telefónica + BT + NTT DoCoMo + KDDI + SoftBank + China Mobile + Reliance Jio** — global Tier-1 carrier buyer landscape.

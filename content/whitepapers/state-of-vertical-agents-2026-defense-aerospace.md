---
title: "State of Vertical Agents 2026: Defense & Aerospace"
subtitle: "Anduril targeting $60B valuation, Shield AI $12.7B, Saronic $9.25B + Marauder built in 9 months, $20B Army Lattice contract, Project Maven becomes program of record September 2026 — and the DoD Agent Network initiative"
publication: "perea.ai Research"
authors: ["Dante Perea"]
version: "1.0"
status: "Public draft"
date: "2026-05-07T11:07"
audience: "Founders, GTM leads, and product teams selling AI agents into U.S. defense, intelligence, and aerospace mission systems — plus operators evaluating dual-use commercial-defense adjacencies."
length: "~5,400 words"
license: "CC BY 4.0"
description: "The tenth entry in the State of Vertical Agents series, mapping the U.S. defense and aerospace AI agent market as it exists in May 2026 — distinct from the federal civilian + state/local market covered in the prior Government & Public Sector entry. Covers Anduril targeting a $60B valuation (doubling $30B in 9 months) plus the $20B US Army Lattice command-and-control contract; Shield AI at $12.7B valuation (140% jump in 12 months) with $267M ARR growing 64% YoY and Hivemind autonomous flight powering the Fury fighter; Saronic Technologies' $1.75B raise at $9.25B valuation, the Franklin LA shipyard acquisition, and the Marauder built in 9 months (fastest American ship construction since World War II); Castelion (hypersonic missiles); a16z American Dynamism $1.176B + $1.2B aerospace and defense allocation in the $15B January 2026 fund; the DoD AI Strategy (January 2026) including the Agent Network initiative for AI-enabled battle management; Project Maven becoming a program of record September 2026 with NGA-to-CDAO transfer + Army Combined Arms Command integration; the Replicator initiative ($1B FY2024-FY2025, thousands of autonomous systems air/land/sea, 2.0 counter-drone pivot); AUKUS Pillar II AI + autonomous systems; the DIU + DAWG + Navy $100M prize challenge for Autonomous Vehicle Orchestrator; the Thunderforge project for commercial AI decision-making integration. Maps the seven defense buying paths (DIU OTAs / AFWERX / xTechSearch / NavalX / USSOCOM / CDAO direct / consortiums Tradewind+NSTXL); the three failure modes (cleared-engineering recruiting time, dual-use vs sole-defense positioning, autonomy ROE policy negotiations); MLP communities (AFCEA, AUSA, AFA, Sea-Air-Space, AUVSI, Defense News); and a six-path GTM decision tree. Closes the defense vertical thread."
profile: "field-manual"
---

## Foreword

This paper is the tenth entry in the State of Vertical Agents series. Previous entries mapped legal, insurance, healthcare, accounting, commercial real estate, construction, government, pharma, and cybersecurity. The U.S. **defense + aerospace** market deserves its own dedicated entry because — despite sharing the federal procurement infrastructure with civilian government — it operates as a fundamentally different vertical. The buyer is a DoD program manager, often with a tour-of-duty rotation cycle. The procurement vehicle is an OTA, an SBIR Phase III bridge, or a CDAO sole-source rather than a GSA Multiple Award Schedule. The security regime is IL5/IL6/SAP, not FedRAMP Moderate. The success metric is mission outcome, not service-level agreement. And the price points are $200M each (the Pentagon agentic AI awards), $20B each (the Anduril Army Lattice contract), or $1B+ programs (Replicator) — not the $250K-$50M task orders that typify the federal civilian motion.

It is also the single most active defense-tech venture capital market in U.S. history. The **a16z American Dynamism practice closed $1.176B specifically for defense and security startups in January 2026**, with $1.2B more allocated to aerospace and defense across the firm's $15B January 2026 raise. **Anduril is targeting a $60B valuation, doubling from $30B in 9 months. Shield AI hit $12.7B at a 140% jump in 12 months. Saronic Technologies raised $1.75B at $9.25B and built the first Marauder in 9 months — the fastest American ship construction since World War II.** This is not a market in a slow burn. It is a market in an inflection.

This paper is for founders deciding whether to enter the defense vertical, what subvertical to pick, and how to map the buying surface and capital landscape they will encounter.

## Executive Summary

1. **Anduril is the structural incumbent of the AI-native defense category.** Pursuing a **$60B valuation** in 2026 (doubling from $30B in 9 months); won a **$20B US Army Lattice command-and-control contract in March 2026** — the largest single AI-software contract in DoD history. The Lattice platform is now the canonical reference architecture for defense AI agents at the operational and tactical edge.

2. **Shield AI proved the autonomous-aircraft thesis at scale.** **$12.7B valuation, 140% jump in 12 months. $267M ARR growing 64% YoY.** Hivemind autonomous-flight system powers Anduril's Fury fighter jet for the U.S. Air Force — a first-of-kind autonomous-air-platform validation. The two companies' partnership formalized the agentic-air-systems stack that competitors must now respond to.

3. **Saronic Technologies executed the fastest American shipbuilding cycle since World War II.** **$1.75B raise at $9.25B valuation; Franklin LA shipyard acquisition; first Marauder autonomous warship built in 9 months.** This is the canonical proof that a defense-tech startup can vertically integrate manufacturing on commercial-startup timelines — and the model for the next decade of autonomous-maritime founders.

4. **The Pentagon's "Agent Network" initiative makes agentic AI a department-wide doctrine.** The DoD AI Strategy released January 2026 formalizes AI-enabled battle management and decision support from campaign planning to kill chain operations. **Project Maven becomes a program of record by September 2026** (transferring from NGA to CDAO; Army Combined Arms Command integration March 2026). Replicator 1.0 fielded thousands of autonomous systems across air/land/sea; **Replicator 2.0 pivots to counter-drone**. The doctrine is now officially "agents on every operational mission."

5. **a16z American Dynamism + Founders Fund + Lux Capital + Shield Capital + Razor's Edge are now the dominant defense-tech VC syndicate.** a16z American Dynamism raised **$1.176B specifically for defense and security in January 2026** plus $1.2B for aerospace and defense. The capital stack is willing to write $100M+ checks at $1B+ valuations for any founder with a credible mission-systems thesis and a cleared-engineering team.

6. **Three failure modes gate every defense AI deployment.** (a) **The cleared-engineering recruiting gap** — TS/SCI clearance is a 9-18 month process and most founders underestimate it; this is the single biggest accelerator for whoever solves it first. (b) **The dual-use vs sole-defense positioning trap** — founders who position purely-defense lose access to commercial revenue and burn faster; founders who position purely-commercial cannot land flagship DoD deals. The bridge case is structurally rare. (c) **The autonomy rules-of-engagement (ROE) policy negotiation** — every autonomous mission system must navigate a multi-stakeholder approval process spanning service ROE, Combatant Command policy, OSD policy, and Congressional notification thresholds. Founders who don't budget 6-9 months of policy engagement before fielding lose the deployment window.

7. **The six-path defense GTM decision tree separates accessible markets from moonshots.** **(1) DIU OTA prototype-to-production** — fastest entry path for software-only founders (60-90 day prototype awards, Phase III SBIR bridges to production). **(2) Service-lab partnerships** — AFRL (Air Force Research Lab), ARL, NavalX, AFWERX, xTechSearch (Army). **(3) CDAO sole-source** — for top-of-stack agentic AI with named contract performance. **(4) Prime-contractor subprime** — sub to Lockheed, RTX, Northrop Grumman, Boeing, GD, L3Harris, Leidos, Booz Allen. **(5) Direct-to-Combatant-Command** — USSOCOM, USINDOPACOM, USEUCOM as named buyers. **(6) International ally** — AUKUS Pillar II (UK + Australia + AUKUS-adjacent NATO + Five Eyes); ITAR/EAR-export-license gated. Each path has different cleared-staff, deal-size, and timeline economics.

---

## Part I: The Market

### Topline TAM

DoD's **FY2026 standalone AI-and-autonomous-systems budget request is $13.4 billion**. Combined with classified-program funding and overhead allocations, the addressable AI-agent TAM at the DoD is in the **$20-25B/year range**, with the agentic share growing rapidly from an estimated 10% in FY2024 to a projected 30%+ in FY2027 as the Agent Network initiative, Maven program-of-record status, and Replicator 2.0 scale into operational use.

The aerospace + space-systems AI agent TAM is a separate stack. NASA, Space Force, NRO, NGA each spend on AI-augmented decision support; commercial-space players (SpaceX, Rocket Lab, Maxar, Planet, BlackSky) deploy AI agents for mission planning and ground-station automation. Combined defense + space AI agent TAM in 2026 is approximately **$25-30B/year** as a near-term floor.

### Capital flows

Three categories of capital flow shaped the 2025-2026 landscape:

1. **Mega-rounds at named platform incumbents.** **Anduril targeting $60B (2x in 9 months)**. **Shield AI $12.7B (1.4x in 12 months)**. **Saronic $9.25B post $1.75B raise**. **Castelion** at hypersonic-velocity scale.
2. **Mega-contracts at named buyers.** Anduril **$20B Army Lattice** (March 2026). Pentagon **$200M each agentic AI awards** to Anthropic, OpenAI, Google, xAI ($800M aggregate). **Replicator** $1B aggregated across FY2024-FY2025. **Project Maven program of record** September 2026. **DIU + DAWG + Navy $100M Autonomous Vehicle Orchestrator** prize challenge.
3. **VC syndicate consolidation.** a16z American Dynamism **$1.176B specifically + $1.2B aerospace/defense** in the January 2026 $15B fund. Founders Fund (active investor in Anduril, Palantir, Saronic, others). Lux Capital. Shield Capital (founded by H.R. McMaster). Razor's Edge. RTX Ventures, Lockheed Martin Ventures (corporate).

### Why now

Four 2025-2026 inflections compounded into the current market:

1. **The Replicator initiative** ($1B FY2024-FY2025) demonstrated that DoD can execute on operational autonomous-systems fielding at speed — overturning the "DoD is too slow" thesis that constrained founders for a decade.
2. **The DoD AI Strategy + Agent Network initiative** (January 2026) made agentic AI a department-wide doctrine, with explicit budget lines and named program-of-record pathways.
3. **The Anduril + Shield AI partnership** for the Fury fighter jet validated the agentic-air-systems stack at production scale.
4. **a16z's $1.176B American Dynamism allocation + Founders Fund's continued conviction + new defense-tech VCs (Shield Capital, Razor's Edge, RTX Ventures, Lockheed Ventures)** created a capital stack willing to write $100M+ checks at $1B+ valuations — collapsing the founder-to-Series-D timeline that historically constrained defense-tech capital intensity.

---

## Part II: The Buying Map

The DoD has at least seven distinct buying motions, and each has a different gate, vehicle, and timeline. (This paper deepens on the defense-mission portion of the eight-path map covered at higher level in the prior Government entry.)

### DIU — Defense Innovation Unit

- **Discovery surface:** DIU.mil open calls; named Commercial Solutions Opening (CSO) categories.
- **Procurement vehicle:** Other Transaction Authorities (OTAs); Phase III SBIR bridges; CSO direct prototype awards.
- **Reference deal sizes:** $1M-$50M per prototype; $50M-$500M production scale.
- **Authorization timeline:** 60-90 days for an authorized prototype OTA; 9-18 months to production scale.
- **Note:** **The DIU + DAWG + Navy $100M Autonomous Vehicle Orchestrator prize challenge** is an example of the modern DIU motion — public open challenge, fast prototype awards, production-ready commercial-grade solutions.

### Service labs and innovation organizations

- **AFRL (Air Force Research Laboratory)** + **AFWERX** — Air Force.
- **ARL (Army Research Laboratory)** + **xTechSearch** — Army.
- **NavalX** + **NUWC + NAWCAD + ONR** — Navy.
- **MARFORSPACE + MARSOC** — Marine Corps.
- **USSOCOM SOFWERX** — Special Operations Command.
- **DARPA** — research-grade programs; rarely production-fielding.
- **Procurement vehicles:** SBIR/STTR Phase I-III; OTAs; consortium deals (Tradewind, NSTXL, AVIATOR).
- **Reference deal sizes:** $50K-$2M Phase I; $1M-$5M Phase II; $5M-$50M Phase III bridges to production.

### CDAO — Chief Digital and AI Office

- **Discovery surface:** CDAO.mil; Project Maven (now CDAO-resident); Thunderforge for commercial AI integration.
- **Procurement vehicle:** Direct-from-CDAO sole-source for top-of-stack agentic AI; OTAs through partner consortiums.
- **Reference deal sizes:** $50M-$500M+ for named platforms.

### Combatant Commands

- **USSOCOM (Special Operations)** — most agile; SOFWERX innovation arm; named OTAs.
- **USINDOPACOM (Indo-Pacific)** — focus on Pacific theater; AUKUS-adjacent partnerships.
- **USEUCOM (Europe)** — focus on Ukraine support and NATO interoperability.
- **USCYBERCOM** — cyber operations; partners with NSA.
- **USSPACECOM** — space domain; partners with Space Force.
- **Procurement vehicle:** OTAs through service partners; classified IDIQs.

### Prime-contractor subprime

- **Discovery surface:** Lockheed Martin Ventures, RTX Ventures, Northrop Grumman portfolio, Boeing Phantom Works, General Dynamics, L3Harris, Leidos, Booz Allen, SAIC, Mantech, CACI, Peraton.
- **Procurement vehicle:** Subcontractor under prime; rarely direct.
- **Reference deal sizes:** $1M-$100M+; the prime takes the integration premium.
- **Strategic note:** **Most founders should partner with a prime as one path while pursuing direct DIU / CDAO / service deals on other paths** — neither approach alone produces enough deal flow to fund a $1B+ valuation trajectory.

### Intelligence Community

- **CIA, NSA, NRO, NGA, DIA, DHS I&A.**
- **Discovery surface:** In-Q-Tel for portcos; agency-direct via cleared-engineering relationships.
- **Procurement vehicle:** Sole-source for In-Q-Tel portcos; classified IDIQs otherwise.
- **Most founders should treat IC as Phase 3** — requires TS/SCI cleared engineering bench.

### International ally — AUKUS Pillar II + Five Eyes + NATO

- **AUKUS Pillar II** prioritizes quantum, autonomous systems, and defense AI. **A Replicator-equivalent for AUKUS** is being proposed — interoperable, autonomous, attritable capabilities with initial focus on advanced swarming techniques.
- **Procurement vehicle:** Foreign Military Sales (FMS); direct commercial; ITAR/EAR-compliant export licenses required.
- **Note:** The "Washington Built the AI Infrastructure AUKUS Needs — Then Locked Allies Out" issue (War on the Rocks, March 2026) flags a real gap: U.S. AI compute infrastructure is not yet accessible to AUKUS partners under existing classification + export-control regimes. Founders building dual-use AUKUS-aligned capability must navigate this restriction.

### What is **not** in the buying map

This paper deliberately omits **voice-first command-and-control agents** (voice-bot-mediated interactions in tactical environments), per the user's standing rejection of voice-first verticals. These are an active research category but excluded from the perea.ai canon. Pure-OT/ICS defense agents are also excluded (a separate vertical paper deserves Dragos/Claroty for the industrial-control-system specifics).

---

## Part III: The Incumbent + Disruptor Topology

### The structural incumbents — defense-AI-native platform tier

**Anduril Industries.** Lattice platform (command-and-control, ISR, EW, autonomous mission systems). **Targeting $60B valuation 2026** (doubling from $30B in 9 months). **$20B US Army Lattice command-and-control contract March 2026** — largest single AI-software contract in DoD history. Partnership with Shield AI on the Fury fighter jet. Founders Fund + a16z + General Catalyst portfolio company. Anduril is the structural incumbent of the AI-native defense category and the company every defense AI founder is now competing with or under.

**Shield AI.** Hivemind autonomous-flight stack; **$12.7B valuation, 140% jump in 12 months**. **$267M ARR growing 64% YoY**. Powers the Anduril Fury fighter jet for U.S. Air Force. Hivemind enables autonomous flight without GPS, communications, or human pilots. The dominant agentic-air-systems player.

**Saronic Technologies.** Autonomous maritime systems. **$1.75B raise, $9.25B valuation 2026**; bought a 60-year-old Franklin Louisiana shipyard; **first Marauder autonomous warship built in 9 months — fastest American ship construction since World War II**. The dominant agentic-maritime-systems player.

**Castelion.** Hypersonic missiles + autonomous targeting. Mega-round-funded; the dominant hypersonics-AI player.

**Palantir Technologies.** Maven Smart System. **Project Maven becomes a program of record September 2026.** $10B+ Army contract ceiling. The structural incumbent for ISR + targeting AI specifically; partners with Anthropic + Google for foundation models on top of the Palantir ontology.

**Helsing AI.** European defense AI; targeting agents for Ukraine support and NATO interoperability.

**Rebellion Defense.** Software for kill-chain decision support; multiple service-lab contracts.

**HawkEye 360.** RF intelligence + space-domain AI agents.

**Allen Control Systems.** Ground-vehicle autonomy.

### The frontier-lab agentic AI tier

**Anthropic, OpenAI, Google, xAI** all hold **$200M Pentagon agentic AI awards** for autonomous AI in IL5/IL6 environments. Microsoft (via Azure Government Secret) and AWS (via GovCloud Secret Region) are the underlying compute hosts.

The Anthropic-DoD lawsuit precedent (covered in the Government & Public Sector paper #36) shapes vendor selection at the foundation-model layer: founders building agents on Anthropic should expect those agents to be unable to run lethal-autonomy or surveillance-of-Americans use cases.

### The structural prime contractors

**Lockheed Martin, RTX (Raytheon Technologies), Northrop Grumman, Boeing, General Dynamics, L3Harris, Leidos, Booz Allen Hamilton, SAIC, ManTech, CACI, Peraton.** Each runs an AI/digital-systems organization and partners with at least one named AI startup.

The primes' moat is the cleared-engineering-bench depth, the institutional contracting relationships, and the systems-integration capability to deliver mission-systems-of-systems that no startup can independently produce. Founders who position purely-startup against the primes lose; founders who position as mission-component-vendor-to-primes can reach $100M ARR without owning the prime relationship.

### The disruptor map

Three categories of disruptor are worth tracking beyond the platform incumbents above:

1. **Drone + counter-drone startups** — Skydio, Red Cat (Teal Drones), Performance Drone Works, Quantum-Systems, Edge Autonomy, NovaPort. Counter-drone: Anduril Sentry/Pulsar, Epirus, D-Fend, DroneShield.
2. **Space + dual-use startups** — Voyager Space, True Anomaly, Maxar, Planet Labs, BlackSky, Capella Space. Software-AI for space-domain awareness: Slingshot Aerospace, LeoLabs.
3. **Autonomy software + middleware startups** — Applied Intuition (autonomy simulation; expanded into defense 2025), Wandelbots, Forterra (formerly Robotic Research; ATV-S contractor).

---

## Part IV: Production Deployments

### Anduril Lattice ecosystem

- **$20B US Army Lattice contract March 2026** — Lattice integration across the Army's command-and-control infrastructure.
- Lattice as the canonical defense-AI agent platform across air, ground, and integrated air defense.
- Partnership with Shield AI on Fury fighter jet (Hivemind-powered).

### Project Maven

- **Becomes program of record September 2026** (NGA → CDAO transfer).
- US Army Combined Arms Command integration March 2026.
- Pentagon-wide deployment as the dominant ISR + targeting AI system.

### Replicator 1.0 → 2.0

- **Replicator 1.0**: $1B FY2024-FY2025; thousands of autonomous systems air/land/sea fielded.
- **Replicator 2.0**: pivots to counter-drone capabilities.

### DIU + DAWG + Navy autonomous systems

- **$100M prize challenge for Autonomous Vehicle Orchestrator** capability.
- Carnegie Robotics + Forterra prototyping ATV-S (selection winter 2026).

### Pentagon agentic AI awards

- **$200M each** to Anthropic, OpenAI, Google, xAI ($800M aggregate) for agentic AI in IL5/IL6 environments.

### Thunderforge

- DIU project to integrate commercial AI-powered decision-making into mission-system pipelines.

### Saronic Marauder

- First Marauder autonomous warship completed in 9 months at the Franklin LA shipyard.
- Reference for the next-generation autonomous-maritime program of record.

### What "production" means in defense

Production-fielded defense AI agents operate under tighter human-in-the-loop constraints than commercial or even healthcare/government civilian deployments. The realistic decomposition is:

- **5-15% autonomous** — narrow, well-bounded operations (e.g., commodity-IOC-blocking inside a permitted zone; pre-authorized auto-target cuing in defensive air-domain operations).
- **30-45% supervised** — the agent recommends; the human approves before execution.
- **30-45% triaged** — the agent surfaces options for analyst review.
- **5-15% rejected** — the agent declines or escalates fully.

This is consistent with the **Combatant Command rules-of-engagement (ROE) discipline** that gates every fielding decision and the DoD's published commitment to keeping humans in the loop on lethal decisions.

---

## Part V: The Three Failure Modes

### Failure mode 1: the cleared-engineering recruiting gap

A TS/SCI clearance takes 9-18 months from sponsorship submission to investigation completion. Founders who do not start the cleared-engineering recruiting process at company formation discover, two years later, that they cannot bid on the deals they want because they cannot staff the engagement.

The mitigation patterns:

1. **Sponsor early.** Begin sponsoring cleared candidates from the first 5-engineer hire.
2. **Acquire cleared talent.** Acqui-hire cleared engineering teams from acqui-target contractors; pay the premium.
3. **Partner with a cleared prime.** For initial deals, position the prime as the cleared-staff pipeline; the founder owns the IP and the prime executes the integration.
4. **Open a cleared facility.** SCIF setup is 6-12 months and $1-5M but enables on-site cleared work that an unclassified office cannot.

### Failure mode 2: the dual-use vs sole-defense positioning trap

The defense market is large but it is not large enough — at the early-stage level — to fund a unicorn-trajectory company on its own. Defense revenue is structurally lumpy, with single-program 5-year contracts that can shift dramatically across budget cycles. A founder positioning purely-defense without a commercial revenue channel discovers, in year 4, that the program cycle has shifted and the runway has not lasted.

A founder positioning purely-commercial without defense intent discovers, when the flagship DoD deal becomes available, that they cannot land it without commitments to ITAR/EAR compliance, supply-chain integrity, and cleared-staff scaling that they did not build into the company structure.

The bridge case — true dual-use, with both commercial and defense channels and a product architecture that satisfies both — is structurally rare and requires founder-level conviction from day one. **Anduril, Shield AI, and Saronic positioned defense-first and accepted the lumpy revenue as the cost. Applied Intuition positioned commercial-first (autonomy simulation for automotive) and added defense as an adjacent expansion.** Both patterns work; the failed pattern is the founder who tries to maintain both equally without a structural commitment to one.

### Failure mode 3: the autonomy ROE policy negotiation

Every autonomous mission system must navigate a multi-stakeholder approval process spanning service ROE, Combatant Command policy, OSD policy, and Congressional notification thresholds. A drone-swarm system that can target autonomously requires:

1. **Service ROE update** — Air Force, Navy, Army, or Marine Corps doctrinal change.
2. **Combatant Command policy** — USINDOPACOM, USEUCOM, USCENTCOM, etc., depending on theater.
3. **OSD policy** — Pentagon-level guidance on autonomous-weapon employment.
4. **Congressional notification** — for systems crossing certain capability thresholds, notification to the House and Senate Armed Services Committees.

Founders who do not budget **6-9 months of policy engagement before fielding** lose the deployment window. The mitigation pattern is to **begin policy engagement at company formation** — engage former defense officials, retired flag officers, and policy-fluent advisors as part of the founding team or initial advisory board.

The five-control compliance pattern documented elsewhere in the perea.ai canon (PHI gateway logging + write-once audit logs + audit-completeness CI/CD gate + BAA chain validation + minimum-necessary enforcement) translates to defense as: **mission-record gateway logging + write-once mission audit logs + audit-completeness CI/CD gate + ITAR/EAR-export-compliance validation + ROE-scope enforcement.**

---

## Part VI: The MLP Communities

The minimum-lovable-product community for defense + aerospace AI agents is concentrated in eight high-density venues:

1. **AFCEA TechNet (multiple events per year, varying locations)** — the dominant defense-IT trade association; chapters in every U.S. region.
2. **AUSA Annual Meeting (October, Washington DC)** — Army's flagship; concentrated Army program-manager and senior-officer attendance.
3. **AFA Air, Space & Cyber Conference (September, National Harbor)** — Air Force + Space Force flagship.
4. **Sea-Air-Space (April, National Harbor)** — Navy + Marine Corps flagship.
5. **AUVSI Xponential (May)** — autonomous + unmanned systems community; the dominant venue for drone and counter-drone vendors.
6. **DSEI (London, biennial)** — UK + European defense industry; AUKUS-adjacent partnerships concentrate here.
7. **Reagan National Defense Forum (December, Simi Valley)** — annual high-level policy + industry gathering; dominant for executive-level relationship building.
8. **RAND, CSBA, CSIS, Atlantic Council, Hudson Institute** — defense-policy think-tank circuit; intellectual ground-truthing for defense-AI strategy.

Adjacent media surfaces include **Defense News, Breaking Defense, Janes, War on the Rocks, The Drive's The War Zone, Politico Pro Defense, Inside Defense, Aviation Week**. Coverage in any of these moves DoD program-manager attention.

The discovery rule: a founder selling into defense should be **at AFCEA TechNet at least once per year, at AUSA / AFA / Sea-Air-Space depending on service focus, and producing public artifacts (white papers, congressional testimony, public-media commentary) at the cadence of one substantive contribution per quarter**. This is the **prestige-led-distribution motion** documented in the perea.ai canon's Distribution Playbook (#24), applied to the defense channel.

---

## Part VII: GTM Decision Tree

A founder selling AI agents into defense must pick exactly one of six paths on day one. The six paths:

```
                         Defense AI Agents
                                │
       ┌────────────┬───────────┼───────────┬────────────┬───────────┐
       │            │           │           │            │           │
   DIU OTA      Service       CDAO       Prime-      Combatant    AUKUS /
   prototype-   labs          sole-      contractor  Command      Five Eyes
   to-          (AFWERX +     source     subprime    direct       international
   production   xTechSearch +
                NavalX +
                AFRL +
                ARL +
                ONR +
                SOFWERX +
                DARPA)
       │            │           │           │            │           │
   60-90 day    SBIR I-III   $50M-      Sub to       Direct       FMS /
   prototype   Phase III    $500M+      Lockheed,    OTA          ITAR /
   OTA;         bridges;     for         RTX,         to a         EAR
   software-   $50K-$50M    named       Northrop,    Combatant   ITAR-
   only         per phase    platforms   Boeing,      Command     export-
   founder                              GD,          (USSOCOM,    license-
                                        L3Harris,    USINDOPACOM, gated
                                        Leidos       USEUCOM,
                                                    USCYBERCOM)
   $1M-$50M    $50K-$50M    $50M-$500M+ $1M-$100M+   $5M-$200M+   $5M-$200M+
   prototype;
   $50M-$500M
   production
```

The branching logic:

1. **DIU OTA prototype-to-production** — fastest entry path for software-only founders. 60-90 days from CSO award to authorized prototype; 9-18 months to production scale. Reference deal size: $1M-$50M prototype, $50M-$500M production. **Most accessible path for sub-100-engineer software founders without prior defense experience.**

2. **Service labs (AFWERX, xTechSearch, NavalX, AFRL, ARL, ONR, SOFWERX, DARPA)** — SBIR/STTR-driven; multi-year capability progression from research through production. Reference deal size: $50K Phase I, $1-5M Phase II, $5-50M Phase III bridges.

3. **CDAO sole-source** — the path Anduril, Palantir, Anthropic, OpenAI, Google, xAI walked. Reference deal size: $50M-$500M+. Requires existing track record + strategic alignment with CDAO leadership; not accessible without a prior reference deal.

4. **Prime-contractor subprime** — fastest path to $10M+ revenue without owning the contracting relationship. Reference deal size: $1M-$100M+. The prime takes the integration premium; the founder owns the IP and the cleared engineering capability.

5. **Combatant Command direct** — USSOCOM (most agile, best initial path), USINDOPACOM, USEUCOM, USCYBERCOM. Reference deal size: $5M-$200M+ per program. Requires 6-12 months of relationship-building before a meaningful OTA opportunity.

6. **AUKUS / Five Eyes / NATO international** — Phase 3 only; ITAR/EAR-export-license-gated; bilateral structure varies by country. Reference deal size: $5M-$200M+ per program.

The two paths that maximize accessibility-to-velocity for a sub-100-engineer founder are **DIU OTA** and **prime-contractor subprime**. The DIU OTA path is direct and fast; the prime-contractor path scales revenue without requiring direct cleared-staff scaling. These two paths together account for the majority of accessible defense-AI revenue for new entrants.

The two paths that founders most often misjudge are **CDAO sole-source** (founders underestimate the prior-track-record requirement) and **AUKUS / Five Eyes** (founders underestimate the ITAR/EAR + export-license + cleared-staff barrier).

---

## Closing thread

This paper closes the defense + aerospace vertical thread for the perea.ai canon. The State of Vertical Agents series now spans ten verticals: legal, insurance, healthcare, accounting, CRE, construction, government (civilian), pharma, cybersecurity, and defense + aerospace.

Three threads surface for future papers in the canon:

1. **The cleared-engineering hiring playbook** — the single biggest accelerator for defense-tech founders is solving cleared-staff recruiting. A focused paper on TS/SCI sponsorship, SCIF setup, acqui-hire patterns, and prime-partnership models would deserve its own entry.
2. **The AUKUS Pillar II expansion playbook** — as AUKUS Pillar II infrastructure matures and U.S. infrastructure becomes accessible to allies, a focused paper on bilateral AI procurement (UK MoD + Australia DoD + AUKUS-adjacent NATO) would deserve its own entry.
3. **The dual-use product architecture playbook** — Anduril and Saronic positioned defense-first; Applied Intuition positioned commercial-first; the bridge case is structurally rare. A focused paper on the founder-decision architecture for this positioning would deserve its own entry.

The implementation gap chasm pattern from the cross-vertical operations canon (60-70 percentage-point gap between pilot adoption and production achievement) operates in defense too — but the gap there is dominated by **policy-engagement timeline and cleared-staff recruiting**, not technology. A founder who can compress a DoD deployment timeline from 18 months to 9 months by pre-staffing the cleared-engineering bench, pre-engaging the policy stakeholders, and pre-building the prime-contractor subprime path will outrun every competitor still chasing the deal in series rather than in parallel. That compression is the present opportunity in 2026.

The Anduril $60B target and Shield AI $12.7B and Saronic $9.25B valuations redefine what "vertical AI defense company" can be worth. The next generation of founders is being capitalized at a pace and scale unprecedented in the history of U.S. defense technology, and the next 18 months will determine which subvertical produces the second $30B+ outcome.

---

## References

1. **Anduril targeting $60B valuation 2026** — doubling from $30B in 9 months.
2. **Anduril $20B US Army Lattice contract** — March 2026; largest single AI-software contract in DoD history.
3. **Shield AI $12.7B valuation** — 140% jump in 12 months; $267M ARR growing 64% YoY.
4. **Shield AI Hivemind powers Anduril Fury fighter jet** — autonomous flight without GPS/comms/human pilots.
5. **Saronic Technologies $1.75B raise at $9.25B valuation** — Franklin LA shipyard acquisition; first Marauder built in 9 months.
6. **a16z American Dynamism $1.176B for defense and security** — January 2026; $1.2B more for aerospace and defense in $15B fund.
7. **a16z January 2026 $15B raise** — largest fundraising haul to date; 18% of US VC market.
8. **DoD AI Strategy + Agent Network initiative** — January 2026; AI-enabled battle management and decision support.
9. **Project Maven becomes program of record** — September 2026; NGA → CDAO transfer; Army Combined Arms Command integration March 2026.
10. **Pentagon $800M agentic AI awards** — $200M each to Anthropic, OpenAI, Google, xAI for IL5/IL6 environments.
11. **Replicator 1.0 + 2.0** — $1B FY2024-FY2025; thousands of autonomous systems; 2.0 pivots to counter-drone.
12. **DIU + DAWG + Navy $100M Autonomous Vehicle Orchestrator prize challenge.**
13. **DIU Carnegie Robotics + Forterra ATV-S** — selection winter 2026.
14. **DIU Thunderforge** — commercial AI for decision-making integration.
15. **AUKUS Pillar II AI + autonomous systems** — Replicator-equivalent proposed; advanced swarming techniques.
16. **War on the Rocks "Washington Built the AI Infrastructure AUKUS Needs"** — March 2026; AUKUS access gap.
17. **DoD FY2026 AI standalone budget** — $13.4B requested.
18. **Castelion (hypersonic missiles)** — a16z American Dynamism portfolio.
19. **AFCEA, AUSA, AFA, Sea-Air-Space, AUVSI Xponential** — primary MLP-community conferences.
20. **Defense News, Breaking Defense, Janes, War on the Rocks, Aviation Week** — primary trade-press surfaces.

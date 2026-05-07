---
title: "State of Vertical Agents 2026: Residential Real Estate"
subtitle: "Zillow Preview + Realtor.com pact vs Compass-Redfin-Rocket alliance, eXp Mira AI agent launch, 87% brokerage AI adoption, NAR $52.25M April 2026 settlement — and the MLS-bypass war reshaping how listings reach buyers"
publication: "perea.ai Research"
authors: ["Dante Perea"]
version: "1.0"
status: "Public draft"
date: "2026-05-07T12:28"
audience: "Founders, GTM leads, and product teams selling AI agents into residential real estate brokerages, listing portals, MLS + data infrastructure, transaction coordination, mortgage origination, and iBuyer + alternative-transaction platforms — plus operators evaluating agent-assist + listing-creation + CRM-and-lead-management adjacencies."
length: "~5,200 words"
license: "CC BY 4.0"
description: "The eighteenth entry in the State of Vertical Agents series, mapping the U.S. and global residential real estate AI agent market as it exists in May 2026 (distinct from the Commercial Real Estate entry, paper #21). Covers the platform-fragmentation war: Zillow Preview launched March 2026 (displays homes before MLS; partners Keller Williams + RE/MAX + HomeServices of America + Side + United Real Estate; 24 additional firms in first week); Zillow + Realtor.com pre-market pact (Zillow Preview listings on Realtor.com from summer 2026); Compass-Redfin partnership February 2026 (Compass Coming Soon + Private Exclusive listings on Redfin; potential 500,000 homes added); Compass + Rocket Companies (Rocket owns Redfin) MLS-bypass alliance described as 'war' against organized real estate. Documents agentic AI deployments inside ChatGPT (Zillow + Redfin + Realtor.com all have ChatGPT apps with plain-language listing search). Covers eXp Realty Mira AI business assistant launch + Compass AI for agents + agent-side AI tooling at Anywhere Real Estate (post-Compass combination: Coldwell Banker + Sotheby's + Century 21 + ERA + Better Homes & Gardens + Corcoran). Documents 87% of brokerages + agents actively using real estate AI tools daily in 2026. Covers the NAR $52.25M April 2026 settlement (Tuccori vs At World Properties buy-side commission case), commission stickiness (buyer agent commission rebounded from 2.36% Q3 2024 to 2.42% Q3 2025), MLS policy modernization (January 2026), and platform alternatives (American Real Estate Association + MyStateMLS bypass). Maps the eight subvertical buying paths (listing portal / brokerage agent-assist / CRM + lead management / listing creation + marketing / transaction coordination / MLS + data infrastructure / iBuyer + alt-transaction / mortgage origination + AI). The three failure modes (the HUD Fair Housing AI guidance gate, the NAR settlement-compliance + buy-side commission disclosure regime, the TCPA + state-by-state license-law gauntlet). MLP communities (Inman Connect + T3 Sixty + RIS Media + NAR NXT + Triple Play). Closes the residential real estate vertical thread — paired with the Commercial Real Estate entry (#21) for comprehensive real estate vertical coverage."
---

## Foreword

This paper is the eighteenth entry in the State of Vertical Agents series. Previous entries mapped legal, insurance, healthcare, accounting, commercial real estate (paper #21, focused on CRE), construction, government, pharma, cybersecurity, defense + aerospace, energy + utilities, logistics + freight, manufacturing + industrial, retail + CPG, HR + recruiting, education + EdTech, and telecom + network operations. Residential real estate is treated as a distinct vertical from CRE because the buyers (brokerage CEO + listing portal CTO + independent agent) and the regulatory perimeter (HUD Fair Housing + NAR settlement + state-by-state license law + TCPA) operate independently from the CRE buyer + regulatory stack.

It is also a vertical that is undergoing **the most visible platform-fragmentation war of any 2026 vertical**. Compass + Redfin (now owned by Rocket Companies) struck a partnership in February 2026 to bypass the Multiple Listing Service (MLS). **Zillow + Realtor.com responded with a pre-market pact** within days. **Zillow Preview launched March 2026** with Keller Williams + RE/MAX + HomeServices of America + Side + United Real Estate as launch partners. Inman described this as **"war"** against organized real estate. The MLS — the cooperative listing infrastructure that has dominated U.S. residential real estate for 100+ years — is being challenged simultaneously from two directions, and AI agents are being deployed inside both camps.

This paper is for founders deciding whether the residential real estate vertical is accessible during this platform-war, what subvertical to pick, and how to map the eight-path buying surface.

## Executive Summary

1. **Zillow Preview is the canonical pre-market listing-portal play.** Launched **March 2026**; displays homes on Zillow + Trulia **before MLS listing**; partners include **Keller Williams + RE/MAX + HomeServices of America + Side + United Real Estate**; **24 additional firms** signed on within the first week. Zillow has 20 years of brand equity + 200M+ monthly users + the largest residential search inventory in the U.S.

2. **The Compass-Redfin-Rocket axis is the canonical MLS-bypass alliance.** Compass struck a deal with **Redfin (now owned by Rocket Companies, post-acquisition)** in February 2026 to display Compass's **"Coming Soon" and "Private Exclusive" listings** on Redfin's platform. Compass estimated **Redfin could gain 500,000 homes** through the partnership. **Compass + Anywhere Real Estate combination** (Coldwell Banker + Sotheby's International Realty + Century 21 + ERA + Better Homes & Gardens + Corcoran) creates the largest distribution layer for tool rollouts. Inman described this as **"war"** with organized real estate.

3. **All three major listing portals deployed agentic AI inside ChatGPT in 2026.** **Zillow + Redfin + Realtor.com all have ChatGPT apps** that let buyers describe what they're looking for in plain language and receive live listings with photos + pricing + maps. The agentic-shopping pattern from the retail + CPG paper (#43) translates directly to residential real estate, with the same merchant-side checkout-redirection concerns (the listing portal owns the consumer relationship; the merchant brokerage owns the transaction).

4. **eXp Realty Mira is the canonical brokerage-agent-assist reference.** Mira is an **exclusive AI business assistant built to transform agent productivity** at eXp's cloud-based national brokerage (the first truly cloud-based national brokerage, replacing brick-and-mortar with 3D virtual office). Compass deploys parallel AI tools for agent-side workflows. Real Brokerage operates the same pattern across its 180,000-agent platform. The brokerage-agent-assist sub-vertical is the largest accessible market for sub-100-engineer founders.

5. **87% of brokerages + agents are actively using real estate AI tools daily in 2026.** Adoption has saturated; the question for founders is no longer "will agents adopt AI" but "which AI workflow + integration + vendor-stack will they consolidate around." This is the highest cross-segment AI adoption rate documented in any vertical the perea.ai canon has covered.

6. **Three failure modes gate every residential real estate AI deployment.** (a) **The HUD Fair Housing AI guidance gate** — HUD's June 2024 guidance on algorithmic discrimination in housing applies to any AI agent that touches buyer matching, listing recommendations, advertising targeting, or tenant screening; vendors must ensure their agents do not produce disparate-impact outcomes by protected class. (b) **The NAR settlement-compliance + buy-side commission disclosure regime** — the **$52.25M April 2026 NAR settlement** (Tuccori vs At World Properties) and the **$418M March 2024 Sitzer homeseller settlement** require buy-side commission disclosure + buyer-agent agreements + practice-change compliance; vendors must build these workflows in. (c) **The TCPA + state-by-state license-law gauntlet** — the Telephone Consumer Protection Act + state-specific real estate license laws + state-specific advertising rules + RESPA (Real Estate Settlement Procedures Act) form a fragmented compliance regime that founders must navigate from product inception.

7. **The eight-path residential real estate GTM decision tree separates the accessible markets from the moonshots.** **(1) Listing portal** (Zillow + Redfin + Realtor.com + Homes.com + Trulia channel; highest entry barrier). **(2) Brokerage agent-assist** (Compass + eXp Mira + Anywhere Real Estate + Real Brokerage + Side + Keller Williams + RE/MAX channel; **most accessible** for sub-100-engineer founders). **(3) CRM + lead management** (kvCORE + Follow Up Boss + LionDesk + Top Producer). **(4) Listing creation + marketing** (listing copy AI + photo enhancement + virtual staging + Matterport + BoxBrownie). **(5) Transaction coordination** (DocuSign + dotloop + SkySlope + Brokermint). **(6) MLS + data infrastructure** (CoreLogic Matrix + Black Knight Paragon + FBS Flexmls + RPR). **(7) iBuyer + alt-transaction** (Opendoor + Offerpad + post-Zillow-Offers shutdown lessons). **(8) Mortgage origination + AI** (Rocket + Better.com + Tomo + Compass-Rocket integration). Each has a different technical depth, deal size, and HUD + NAR + state-license compliance regime.

---

## Part I: The Market

### Topline TAM

U.S. residential real estate transaction volume: approximately **$2T+ in 2026** (4.5M+ existing-home sales × ~$420K median + ~700K new-home sales). Total commission pool: approximately **$80-100B/year** at 4-5% blended commission rate. Listing-portal advertising market: approximately **$15B/year** (Zillow + Realtor.com + Homes.com + Trulia + Redfin). Brokerage technology + back-office spend: approximately **$5-8B/year**.

The addressable AI-platform TAM within residential real estate is approximately **$3-5B in 2026** trending toward **$15-25B by 2030** as agentic AI replaces an estimated 25-35% of CRM + lead-management + transaction-coordination + listing-creation operations spending.

### Capital flows

Three categories of capital flow shaped the 2025-2026 landscape:

1. **Mega-platform consolidation + alliances.** **Compass + Anywhere Real Estate combination** (Coldwell Banker + Sotheby's + Century 21 + ERA + Better Homes & Gardens + Corcoran). **Compass-Redfin partnership** February 2026 (500,000 homes added to Redfin). **Zillow Preview** March 2026 (Keller Williams + RE/MAX + HomeServices + Side + United + 24+ additional firms). **Rocket Companies acquired Redfin** (recent, integrating mortgage origination with listing distribution).
2. **Brokerage AI investment.** **eXp Realty Mira launch**. **Compass AI for agents** (smart algorithms for buyer-matching). **Real Brokerage 180,000-agent platform AI rollouts**. **RE/MAX + Keller Williams AI initiatives**. **HomeServices of America (Berkshire Hathaway) AI**.
3. **Real estate AI startup VC.** Multiple Series A/B/C rounds across CRM (Follow Up Boss + kvCORE), listing creation (BoxBrownie + Listing AI Pro), agent assist (multiple), iBuyer + alt-transaction (Opendoor public; Offerpad public); per-deal sizes typically $10M-$200M.

### Why now

Four 2025-2026 inflections compounded into the current market:

1. **The MLS-bypass war** — Compass-Redfin-Rocket alliance vs Zillow-Realtor.com pact restructured pre-market listing distribution within a single quarter (Q1 2026).
2. **All three major listing portals deployed ChatGPT apps** in early 2026, normalizing agentic-AI-for-buyer-search at scale.
3. **The 87% adoption statistic** removed the "will agents adopt" question and surfaced the "which stack will they consolidate around" question.
4. **NAR commission-reform aftermath** — the $52.25M April 2026 settlement + commission stickiness data removed the existential uncertainty that paralyzed brokerage decisions through 2024-2025.

---

## Part II: The Buying Map

The residential real estate buyer is structured into eight distinct paths, each with a different gate, vehicle, and timeline.

### National brokerage

- **Discovery surface:** Inman Connect (multiple events per year), T3 Sixty Real Estate Strategy Summit, RIS Media Real Estate CEO Exchange, NAR NXT (Realtor Experience), Triple Play Realtor Convention (NJ).
- **Procurement vehicle:** Direct enterprise sale; multi-year platform agreements; sometimes via brokerage CTO direct.
- **Reference deal sizes:** $500K-$25M+ over 3-5 year contracts.
- **Decision authority:** Brokerage CEO/President, Chief Technology Officer, Chief Innovation Officer, VP Agent Services, VP Marketing.
- **Named buyers:** Compass, Anywhere Real Estate (post-Compass combination — Coldwell Banker + Sotheby's + Century 21 + ERA + Better Homes & Gardens + Corcoran), Keller Williams, RE/MAX, HomeServices of America (Berkshire Hathaway), eXp Realty, Real Brokerage, Side, United Real Estate, @properties Christie's International Real Estate, Howard Hanna, Douglas Elliman.

### Listing portal

- **Discovery surface:** Inman Connect + ICR investor events + ICR portal-specific.
- **Procurement vehicle:** Direct enterprise sale or partnership; sometimes via API/data licensing.
- **Reference deal sizes:** $1M-$50M+.
- **Named buyers:** Zillow Group (Zillow + Trulia + Out East + StreetEasy + HotPads + ShowingTime), Realtor.com (Move/News Corp), Redfin (Rocket Companies), Homes.com (CoStar Group — also CRE), Apartments.com (CoStar), Compass.com.

### Independent brokerage + team

- **Discovery surface:** Real Geeks + Boomtown user conferences, BombBomb, Tom Ferry events.
- **Procurement vehicle:** Subscription; sometimes per-agent pricing.
- **Reference deal sizes:** $5K-$500K annual.
- **Decision authority:** Owner/Broker, Team Leader.

### Independent realtor (PLG channel)

- **Discovery surface:** Inman + Tom Ferry + ICSC (NAR) + state realtor associations.
- **Procurement vehicle:** Direct individual subscription; freemium common.
- **Reference deal sizes:** $25-$500/realtor/month individual.
- **Strategic note:** **1.5M+ U.S. realtors** (NAR membership); strong PLG bottom-up motion possible.

### MLS (Multiple Listing Service)

- **Discovery surface:** Council of MLS (CMLS) Annual Conference, NAR NXT, MLS-specific user groups.
- **Procurement vehicle:** Direct enterprise sale; sometimes via MLS technology vendor (Black Knight Paragon + CoreLogic Matrix + FBS Flexmls).
- **Reference deal sizes:** $100K-$10M.
- **Named buyers:** ~600 MLSs in U.S. (varying scale); largest include CRMLS (California), MRED (Chicago), CRMA (Mid-Atlantic), Bright MLS (Mid-Atlantic), Stellar MLS (Florida), HAR MLS (Houston).

### Mortgage originator (post-Rocket-Compass alliance)

- **Discovery surface:** MBA (Mortgage Bankers Association) Annual Conference, MORE (Mortgage Office events), Tom Ferry mortgage events.
- **Procurement vehicle:** Direct enterprise sale; sometimes via Compass-Rocket integration channel.
- **Reference deal sizes:** $250K-$25M.
- **Named buyers:** Rocket Companies (Rocket Mortgage + Redfin), United Wholesale Mortgage (UWM), CrossCountry Mortgage, Movement Mortgage, loanDepot, Better.com, Tomo, Wells Fargo Home Mortgage, JPMorgan Chase Home Lending.

### iBuyer + alt-transaction

- **Discovery surface:** Inman + ICR investor events.
- **Procurement vehicle:** Direct enterprise; sometimes via brokerage partner channel.
- **Reference deal sizes:** $100K-$10M.
- **Named buyers:** Opendoor, Offerpad, HomeLight, Knock, Flyhomes; post-shutdown lessons from Zillow Offers + RedfinNow.

### Real estate technology integrator + service provider

- **Discovery surface:** Inman + brokerage events.
- **Procurement vehicle:** Embedded as service-augmentation; rarely direct.
- **Reference deal sizes:** $50K-$5M.
- **Named buyers:** Constellation Real Estate (acquired Inside Real Estate kvCORE + Boomtown), Lone Wolf Technologies (transactions), MoxiWorks, BoldTrail, Onward Mortgage, BombBomb video CRM.

### What is **not** in the buying map

This paper deliberately omits **voice-first virtual property-tour AI agents** + **voice-only realtor-bot platforms** per the user's standing rejection of voice-first verticals. Multi-modal text + video + image agents (virtual staging, listing copy generation, agent-assist) are within scope; pure-voice realtor agents are excluded.

---

## Part III: The Incumbent + Disruptor Topology

### The structural incumbents — listing portal tier

**Zillow Group (NASDAQ: Z + ZG).** Zillow Preview launched March 2026; ChatGPT app deployed; 20-year brand equity; 200M+ monthly users; partnerships with Keller Williams + RE/MAX + HomeServices + Side + United Real Estate + 24+ additional firms.

**Realtor.com (Move / News Corp).** Pre-market pact with Zillow Preview; ChatGPT app; second-largest listing portal in U.S.

**Redfin (Rocket Companies).** Compass partnership February 2026 (500,000 homes); brokerage + portal + agent network hybrid; integrating with Rocket Mortgage post-acquisition.

**Homes.com (CoStar Group).** CoStar's residential play; aggressive marketing investment in 2024-2026.

**StreetEasy + HotPads + Out East (Zillow).** Region-specific listing portals (NYC + rentals + Hamptons).

### The structural incumbents — national brokerage tier

**Compass (NYSE: COMP).** Largest U.S. brokerage by transaction volume; AI for agents (smart algorithms for buyer-matching); Redfin partnership; Anywhere Real Estate combination.

**Anywhere Real Estate (NYSE: HOUS, post-combination with Compass).** Coldwell Banker + Sotheby's International Realty + Century 21 + ERA + Better Homes & Gardens + Corcoran.

**Keller Williams.** Largest by agent count; KW Command technology platform.

**RE/MAX (NYSE: RMAX).** Global franchise model; AI agent partnerships.

**HomeServices of America (Berkshire Hathaway).** Aggregator of regional brokerages.

**eXp Realty (NASDAQ: EXPI / EXP World Holdings).** First truly cloud-based national brokerage; 3D virtual office; **Mira AI business assistant** launched 2026; agent-count growth driven by attractive splits + stock incentive.

**Real Brokerage (NASDAQ: REAX).** AI-platform-driven 180,000-agent expansion; founded 2014; growing fast.

**Side.** Boutique-brand-supporting brokerage; agent-direct relationship.

**Douglas Elliman, @properties Christie's International Real Estate, Howard Hanna, Long & Foster, Berkshire Hathaway HomeServices** — additional regional + national brokerages.

### The structural incumbents — CRM + lead management

**kvCORE (Inside Real Estate, owned by Constellation Real Estate).** Largest CRM + lead-management platform for residential brokerages.

**Follow Up Boss.** High-end CRM popular with productive agents.

**Boomtown! (Inside Real Estate).** Lead-generation + CRM.

**LionDesk, Top Producer (Constellation), Wise Agent, Chime, Real Geeks, Brokermint, ZURPLE.** Mid-tier CRMs.

### The structural incumbents — MLS + data infrastructure

**CoreLogic Matrix + Trestle + RPR (REALTORS Property Resource).** Largest MLS technology + data services.

**Black Knight Paragon (now ICE Mortgage Technology / Intercontinental Exchange).** Major MLS platform.

**FBS Flexmls.** Mid-tier MLS platform.

**Constellation MLS (rapattoni.com).** Smaller MLS platforms.

**ATTOM Data Solutions, Onboard Informatics, MLS Aligned, REcolorado.** Aggregators + alternatives.

### The disruptor map — agentic AI for residential

**eXp Mira** + **Compass AI for agents** + **Real Brokerage AI agent assist** — incumbent-led agent-assist tier.

**ChatGPT apps inside Zillow + Redfin + Realtor.com** — frontier-lab buyer-search tier.

**Listing-creation startups** — BoxBrownie + Roomvo + Sina AI + Realo + Listing AI Pro for listing copy + photo enhancement + virtual staging.

**Agent-coaching startups** — Tom Ferry tools + Workman Success Systems + Real Estate Coaches Mastermind + WiseAgent integrations.

**Transaction-AI startups** — DocuSign Insight + Dotloop AI + SkySlope AI + Endpoint Closing + Brokermint AI.

**iBuyer + alt-transaction** — Opendoor + Offerpad + Flyhomes + Knock + HomeLight (after Zillow Offers + RedfinNow shutdowns).

---

## Part IV: Production Deployments

### Zillow Preview ecosystem

- Launched March 2026.
- Displays homes on Zillow + Trulia before MLS listing.
- Launch partners: **Keller Williams + RE/MAX + HomeServices of America + Side + United Real Estate**.
- 24 additional firms signed on within first week.

### Compass-Redfin partnership

- Announced February 2026.
- Compass Coming Soon + Private Exclusive listings on Redfin.
- Estimated 500,000 homes added to Redfin platform.
- Bypasses MLS for these listings.

### Zillow + Realtor.com pre-market pact

- Counter to Compass-Redfin alliance.
- Zillow Preview listings on Realtor.com from summer 2026 (branded as "Realtor.com Preview").

### ChatGPT apps inside Zillow + Redfin + Realtor.com

- All three major listing portals deployed agentic AI inside ChatGPT in early 2026.
- Plain-language listing search with photos + pricing + maps.

### eXp Realty Mira

- Exclusive AI business assistant for eXp agents.
- Built to transform agent productivity.
- Cloud-based national brokerage with 3D virtual office.

### Compass AI for agents

- Smart algorithms for figuring out which homes clients might actually want to buy.
- Integrated with Compass's CRM + agent workflow tools.

### Real Brokerage AI

- 180,000-agent platform AI deployment.
- Operating across the U.S. + Canada.

### What "production" means in residential real estate AI

The autonomous-task ratio in residential real estate AI is **bimodal**:

- **Buyer-search AI** (ChatGPT apps inside Zillow / Redfin / Realtor.com): **40-60% autonomous** — buyer states preferences, agent surfaces matching listings; the human consumer is the human-in-the-loop.
- **Listing-creation AI** (copy + photo enhancement + virtual staging): **40-60% autonomous** — agent reviews + edits + adopts.
- **Agent-assist AI** (eXp Mira / Compass AI / kvCORE AI / Follow Up Boss AI): **30-50% autonomous** — agent reviews + sends; CRM workflow continues.
- **Transaction-coordination AI** (DocuSign / dotloop / SkySlope / Brokermint): **20-40% autonomous** — narrower scope due to transaction-document compliance + state-license-law requirements.
- **iBuyer pricing AI**: **5-15% autonomous** — narrow due to iBuyer-pricing risk (Zillow Offers shutdown was a $880M+ writedown attributed to model error).

The Zillow Offers shutdown lesson informs the iBuyer-pricing-AI sub-vertical: pricing models that operate on autonomous decisions in volatile markets accumulate losses fast, and founders building in this category must architect for human-validated price gating.

---

## Part V: The Three Failure Modes

### Failure mode 1: the HUD Fair Housing AI guidance gate

HUD's June 2024 guidance on **algorithmic discrimination in housing** applies to any AI agent that touches:

- **Buyer matching** (recommending listings to a buyer).
- **Listing recommendations** (deciding which listings appear in search).
- **Advertising targeting** (deciding which buyers see which ads).
- **Tenant screening** (deciding which applicants are approved).
- **Credit decisioning** (mortgage AI integration).

The Fair Housing Act prohibits discrimination on the basis of race + color + national origin + religion + sex + familial status + disability. Algorithmic systems that produce disparate-impact outcomes (e.g., matching certain demographics with lower-priced listings; suppressing certain neighborhoods from recommended results) are subject to enforcement.

Founders shipping AI agents into residential real estate must build:

1. **Disparate-impact testing** as a standard part of model development.
2. **Continuous monitoring** of recommendation outcomes by protected class proxy.
3. **Documentation of validation studies** demonstrating non-discrimination.
4. **Human-review + escalation pathways** for edge cases.
5. **Red-lining + steering detection** specifically for property-recommendation systems.

The default LangChain / AutoGen / CrewAI scaffolds **do not** generate Fair Housing-compliant audit trails by default; vendors who do not deliver this cannot ship into brokerage + listing-portal production.

### Failure mode 2: the NAR settlement-compliance + buy-side commission disclosure regime

The **March 2024 Sitzer homeseller settlement** ($418M) + the **April 2026 Tuccori vs At World Properties settlement** ($52.25M) require:

1. **Buy-side commission disclosure** at the listing + offer stage.
2. **Buyer-agent representation agreements** signed before the agent shows properties (effective August 2024).
3. **Compensation disclosure outside the MLS** in many jurisdictions.
4. **MLS policy modernization** (effective January 2026; varies by MLS).
5. **Ongoing compliance monitoring**.

Founders shipping AI agents into transaction-coordination + agent-assist + listing-portal workflows must build these disclosure flows in. Agents and brokerages must demonstrate compliance to the NAR + state licensing boards + courts.

### Failure mode 3: the TCPA + state-by-state license-law gauntlet

Real estate is regulated at the state level. Each U.S. state has:

- **Real estate licensing law** specifying what licensed agents can do.
- **Advertising rules** specifying disclosure + content requirements.
- **TCPA (Telephone Consumer Protection Act)** federal law applying to outreach.
- **CAN-SPAM Act** for email outreach.
- **State-specific data privacy** (CCPA + state equivalents).
- **RESPA (Real Estate Settlement Procedures Act)** governing settlement service kickbacks + referral fees.

AI agents that automate outreach + lead-generation + listing-marketing must respect:

1. **DNC (Do Not Call) lists** at federal + state levels.
2. **Time-of-day calling restrictions** (TCPA).
3. **Express consent requirements** for SMS + automated calls.
4. **State-specific advertising disclosure rules**.
5. **License jurisdiction restrictions** (an agent licensed in one state cannot represent in another without proper licensing or referral arrangements).

The five-control compliance pattern from the perea.ai canon's healthcare-agent-incidents-and-compliance paper (#35) translates to residential real estate as: **buyer + listing-data gateway logging + write-once Fair Housing audit logs + audit-completeness CI/CD gate + HUD Fair Housing + NAR settlement + TCPA + RESPA reporting validation + protected-class + state-license scope enforcement.**

---

## Part VI: The MLP Communities

The minimum-lovable-product community for residential real estate AI agents is concentrated in nine high-density venues:

1. **Inman Connect (multiple events per year — January NYC + August Las Vegas)** — the dominant residential real estate trade conference; brokerage CEOs + tech innovators + journalists; canonical announcement venue.
2. **NAR NXT, The REALTOR® Experience (November)** — National Association of Realtors flagship; >20,000 attendees; canonical realtor + association venue.
3. **T3 Sixty Real Estate Strategy Summit (May)** — strategic CEO + executive forum.
4. **RIS Media Real Estate CEO Exchange (September)** — CEO-level executive networking.
5. **Triple Play Realtor Convention (December, Atlantic City NJ)** — large NJ + PA + NY realtor event.
6. **CMLS Annual Conference (October)** — Council of Multiple Listing Services; canonical MLS venue.
7. **MIBOR (Indianapolis), HARI (Houston), regional realtor conventions** — state-level realtor + broker events.
8. **Tom Ferry Success Summit (varying)** — agent-coaching focus; high-engagement realtor audience.
9. **MBA (Mortgage Bankers Association) Annual Conference (October)** — for mortgage-AI overlap.

Adjacent media surfaces include **Inman News, RealEstateNews.com (formerly RIS Media), HousingWire, RIS Media, Real Estate News (Inman alternative), Realtor Magazine, T3 Sixty Trends Report, Inman Tech Connect, Real Trends 500, ICR investor coverage, Realtor.com Industry News, CoStar News (residential)**. Coverage in Inman News moves brokerage CEO + listing portal CTO + investor attention more reliably than any other surface.

The discovery rule: a founder selling into residential real estate should be **at Inman Connect every year** (the canonical announcement + decision-maker venue), should attend **NAR NXT + T3 Sixty + RIS Media depending on customer mix**, and should produce public artifacts (white papers, conference presentations, sponsored research) at the cadence of one per quarter minimum. The residential real estate vertical's prestige-led-distribution motion (perea.ai canon Distribution Playbook #24) maps onto Inman + NAR NXT + Tom Ferry particularly cleanly.

---

## Part VII: GTM Decision Tree

A founder selling AI agents into residential real estate must pick exactly one of eight subvertical paths on day one. The eight paths:

```
                Residential Real Estate AI Agents
                              │
   ┌─────────┬───────┬───────┼─────────┬─────────┬─────────┬──────────┬─────────┐
   │         │       │       │         │         │         │          │         │
   Listing   Brokerage CRM +  Listing  Trans-   MLS +    iBuyer +    Mortgage
   portal    agent-   lead    creation action   data     alt-        origination
            assist   manage-  + market- coord-   infra-   transaction + AI
                     ment     ing       ination structure
   │         │       │       │         │         │         │          │
   $1M-      $500K-   $5K-    $25K-     $50K-    $100K-   $100K-      $250K-
   $50M+     $25M+    $500K   $1M       $5M      $10M     $10M        $25M
   per       per      per     per       per      per      per         per
   deal      deal     deal    deal      deal     deal     deal        deal
   Zillow/   Compass/ kvCORE/ BoxBrownie/ DocuSign/ CoreLogic Opendoor/  Rocket/
   Redfin/   eXp Mira/ Follow  Roomvo/    dotloop/  Matrix/   Offerpad/  UWM/
   Realtor   Real     Up Boss/ Sina AI/   SkySlope/ Black     HomeLight/ Better.com/
   .com/     Brokerage/ LionDesk/ Realo/    Brokermint Knight   Knock/    Tomo
   Homes     Anywhere  Top Pro-  Listing            Paragon/   Flyhomes
   .com /    /KW/     ducer    AI Pro              FBS
   Trulia    RE/MAX                                Flexmls
            /Side
   HUD Fair  HUD Fair NAR     NAR       NAR       NAR        Zillow     RESPA +
   Housing   Housing  settlement settlement settlement settlement Offers     fair lending
   gate      gate     compliance compliance  state    state      shutdown   + HMDA
                                              license  license    lessons    + ECOA +
                                              law      law                   FHA + VA
                                                                              + DSCR
                                                                              underwriting
                                                                              fair credit
```

The branching logic:

1. **Listing portal** — Zillow + Redfin + Realtor.com + Homes.com + Trulia partnership channel. Reference deal: $1M-$50M+. Highest entry barrier; founders compete for portal-platform partnership rather than displacement.
2. **Brokerage agent-assist** — Compass + eXp Mira + Anywhere Real Estate + Real Brokerage + Side + Keller Williams + RE/MAX channel. Reference deal: $500K-$25M+. **Most accessible path overall** for sub-100-engineer founders due to broad named-buyer pool + clear value proposition.
3. **CRM + lead management** — kvCORE + Follow Up Boss + LionDesk + Top Producer ecosystem channel. Reference deal: $5K-$500K. Strong PLG-friendly mid-market with consolidation toward Constellation Real Estate.
4. **Listing creation + marketing** — BoxBrownie + Roomvo + Sina AI + listing-copy AI + virtual-staging AI. Reference deal: $25K-$1M.
5. **Transaction coordination** — DocuSign + dotloop + SkySlope + Brokermint partner channel. Reference deal: $50K-$5M.
6. **MLS + data infrastructure** — CoreLogic + Black Knight + FBS partner channel. Reference deal: $100K-$10M.
7. **iBuyer + alt-transaction** — Opendoor + Offerpad + HomeLight + Knock + Flyhomes pattern. Reference deal: $100K-$10M; Zillow Offers shutdown lessons inform pricing-AI risk.
8. **Mortgage origination + AI** — Rocket + UWM + Better.com + Tomo. Reference deal: $250K-$25M.

The two paths that maximize accessibility-to-velocity for a sub-100-engineer founder are **brokerage agent-assist** (broadest named-buyer pool; Mira pattern; clear ROI) and **CRM + lead management** (PLG-friendly; mid-market; lower deal-size variance). These two paths together account for the majority of accessible vertical-AI revenue in residential real estate for new entrants without prior real estate credibility.

The two paths that founders most often misjudge are **listing portal** (founders attempt to compete with Zillow + Redfin + Realtor.com — this rarely works without a strategic-asset acquisition path) and **iBuyer + alt-transaction** (the Zillow Offers shutdown demonstrates the pricing-AI risk; founders underestimate how much capital is required to absorb model error in volatile markets).

---

## Closing thread

This paper closes the residential real estate vertical thread for the perea.ai canon, paired with the Commercial Real Estate entry (#21). The State of Vertical Agents series now spans **eighteen verticals**: legal, insurance, healthcare, accounting, CRE, construction, government (civilian), pharma, cybersecurity, defense + aerospace, energy + utilities, logistics + freight, manufacturing + industrial, retail + CPG, HR + recruiting, education + EdTech, telecom + network operations, and residential real estate.

Three threads surface for future papers in the canon:

1. **The MLS-bypass war playbook** — Compass-Redfin-Rocket vs Zillow-Realtor.com-Keller Williams-RE/MAX-HomeServices-Side-United is the most visible platform-fragmentation event of any 2026 vertical; a focused playbook on which side founders should align with would deserve its own entry.
2. **The Fair Housing AI compliance playbook** — HUD's June 2024 guidance + state-level rules form a compliance regime that real estate AI vendors are under-supplied on; a focused playbook would deserve its own entry.
3. **The agent-direct PLG playbook for residential real estate** — 1.5M+ U.S. realtors + 87% AI adoption + relatively low individual subscription deal sizes create a PLG opportunity unique to this vertical; a focused playbook on the agent-direct PLG motion would deserve its own entry.

The implementation gap chasm pattern from the cross-vertical operations canon (60-70 percentage-point gap between pilot adoption and production achievement) operates in residential real estate too — but the gap there is **narrower** than in most verticals (87% AI adoption is the highest documented anywhere) and instead the implementation challenge shifts to **vendor consolidation** (which AI workflow + integration + vendor-stack will brokerages standardize on). A founder who can become the canonical reference for a single subvertical (Mira pattern for agent-assist, Follow Up Boss pattern for CRM) will outrun every horizontal competitor. That positioning is the present opportunity in 2026.

The Zillow Preview vs Compass-Redfin platform war is the structural reference for the next decade of residential real estate. The next 18 months will determine whether the MLS-cooperative model survives as the primary listing distribution channel or whether the Zillow + Realtor.com + Compass + Redfin + Rocket axis displaces it — and which AI agent vendors anchor themselves to one side rather than try to serve both.

---

## References

1. **Zillow Preview** — launched March 2026; partners Keller Williams + RE/MAX + HomeServices of America + Side + United Real Estate; 24+ additional firms in first week.
2. **Compass-Redfin partnership** — February 2026; Coming Soon + Private Exclusive listings on Redfin; potential 500,000 homes added.
3. **Zillow + Realtor.com pre-market pact** — Zillow Preview listings on Realtor.com from summer 2026.
4. **Rocket Companies acquired Redfin** — combining mortgage origination with listing distribution.
5. **Compass + Anywhere Real Estate combination** — Coldwell Banker + Sotheby's + Century 21 + ERA + Better Homes & Gardens + Corcoran.
6. **ChatGPT apps inside Zillow + Redfin + Realtor.com** — agentic-AI buyer search at scale.
7. **eXp Realty Mira** — exclusive AI business assistant for eXp agents.
8. **Compass AI for agents** — smart algorithms for buyer-matching.
9. **Real Brokerage 180,000-agent platform** — AI-driven expansion.
10. **87% of brokerages + agents using AI tools daily in 2026** — highest documented adoption of any vertical.
11. **NAR April 2026 settlement ($52.25M)** — Tuccori vs At World Properties buy-side commission case.
12. **NAR March 2024 Sitzer settlement ($418M)** — homeseller commission case.
13. **Buyer-agent commission stickiness** — 2.36% Q3 2024 → 2.42% Q3 2025 (rebound after settlement).
14. **NAR MLS policy modernization** — effective January 2026.
15. **MyStateMLS + American Real Estate Association (ARA)** — non-NAR alternatives.
16. **HUD Fair Housing AI guidance** — June 2024; algorithmic discrimination in housing.
17. **TCPA + RESPA + CAN-SPAM + state-by-state real estate license law** — compliance regime.
18. **Inman Connect + NAR NXT + T3 Sixty + RIS Media + Triple Play + CMLS Annual Conference + Tom Ferry Success Summit + MBA Annual Conference** — primary MLP-community conferences.
19. **Inman News + HousingWire + Real Estate News + RIS Media + Realtor Magazine + T3 Sixty Trends + Inman Tech Connect + Real Trends 500 + ICR + Realtor.com Industry News** — primary trade-press surfaces.
20. **Constellation Real Estate (kvCORE + Boomtown!) + CoreLogic + Black Knight + FBS Flexmls + DocuSign + dotloop + SkySlope** — back-office + technology incumbents.

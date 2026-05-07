---
title: "State of Vertical Agents 2026: Capital Markets & Investment Banking"
subtitle: "Rogo $160M Series D April 2026 (Kleiner Perkins-led, $300M+ total, 35,000 users at 250+ firms including Rothschild + Jefferies + Lazard + Moelis + Nomura), Hebbia $130M Series B (a16z + Index + GV + Thiel, processing 1B+ pages, 30% of asset managers) — and the AI agent that does the analyst's pitchbook in twelve minutes"
publication: "perea.ai Research"
authors: ["Dante Perea"]
version: "1.0"
status: "Public draft"
date: "2026-05-07T13:16"
audience: "Capital-markets technology founders, investment banking heads of innovation, sell-side equity research leaders, buy-side asset manager technology officers, and investors evaluating the AI-banking thesis"
length: "~4,800 words"
license: "CC BY 4.0"
description: "A field map of vertical AI agents in capital markets and investment banking: Rogo's $160M Series D and Felix agent, Hebbia's billion-page processing footprint at Centerview/KKR/MetLife/Oak Hill, the M&A-diligence-AI inflection (16% to projected 80% in three years), and the GTM playbook that wins through bulge-bracket pilots, elite-boutique partnerships, asset-manager beachheads, and the SOC 2 / SEC / FINRA audit gates that determine which AI agents reach production at financial institutions."
---

## Foreword

Investment banking is the rare professional-services vertical in which the labor model has barely changed in fifty years and the AI-disruption thesis has barely taken eighteen months to validate. The buyer is still a managing director at Goldman, Morgan Stanley, JPMorgan, Lazard, Evercore, Centerview, Moelis, Houlihan Lokey, Rothschild, or Jefferies — overseeing a team of analysts and associates who spend 80-100 hours a week assembling pitchbooks, building Excel models, formatting CIMs (Confidential Information Memorandums), running diligence trackers, and generating the document deluge that surrounds every M&A, IPO, debt issuance, or restructuring deal. The technology that managing director is being asked to deploy in 2026 is an AI agent that does pitchbook construction, deal screening, CIM drafting, buyer outreach, and data-room diligence in the time it takes the human team to fetch coffee.

The signal is concrete. **Rogo raised $160M Series D in April 2026 led by Kleiner Perkins**, with participation from Sequoia, Thrive Capital, Khosla, JPMorgan Growth Equity Partners, BoxGroup, Mantis, Jack Altman, Evantic, and Positive Sum — bringing total funding to **$300M+**. **Rogo serves 35,000+ financial professionals at 250+ institutions including Rothschild & Co, Jefferies, Lazard, Moelis, and Nomura.** Rogo's flagship agent **Felix** handles deal screening, CIM generation, buyer outreach, data-room diligence, presentation construction, and financial modeling autonomously. **Hebbia raised $130M Series B at a $700M valuation on $13M of profitable revenue** (Andreessen Horowitz-led with Index Ventures, Google Ventures, Peter Thiel) and processes **over one billion pages** for clients including Centerview Partners, KKR, MetLife, and Oak Hill Advisors — **roughly 30% of all asset managers** use Hebbia. Generative AI adoption in M&A workflows is projected to jump from **21% in 2025 to 80% within three years**, in what will likely be the steepest professional-services adoption curve in this canon.

This paper is the twenty-third entry in the State of Vertical Agents series. Capital markets is structurally distinct from prior verticals: the buyer is a small, dense network (the top 50 investment banks plus the top 100 asset managers and PE firms collectively represent ~$3T in fee revenue and ~$30T in deployable capital); the procurement cycle is short and decisive (a $5M annual contract gets signed in four months when a managing director's analyst team validates the product); and the regulatory layer is light at the user-tier (SEC + FINRA + MiFID II + SOX) but punishing at the data-tier (MNPI / material nonpublic information, Chinese walls, deal confidentiality). The result is the highest revenue-per-customer of any vertical in this canon — and the most concentrated AI-native winner-takes-most dynamic.

## Executive Summary

1. **Capital flow:** **Rogo raised $160M Series D in April 2026** at the top of the M&A-AI cohort, joining $75M Series C and $50M earlier rounds for **$300M+ total**. **Hebbia raised $130M Series B at $700M valuation** (a16z-led) on $13M profitable revenue. The category is ~$5-7B addressable in 2026 with 35-45% CAGR.
2. **Incumbent topology:** **Goldman Sachs, JPMorgan, Morgan Stanley, Bank of America Securities, Citi, Barclays, Deutsche Bank, UBS** anchor the bulge-bracket tier. **Lazard, Evercore, Centerview, Moelis, Houlihan Lokey, Rothschild, Perella Weinberg, Greenhill, PJT Partners, Guggenheim Securities, Jefferies, Piper Sandler, Raymond James, William Blair, Stifel** anchor the elite-boutique-and-mid-market tier. **Bloomberg, Refinitiv (LSEG), FactSet, S&P Capital IQ, Visible Alpha, Tegus** anchor the data-and-research-platform tier.
3. **Disruptor topology:** **Rogo (35,000+ users at 250+ firms)** owns the AI-banker / agentic-platform-for-finance category. **Hebbia (1B+ pages processed, 30% of asset managers)** owns the deep-research and document-Q&A category. **Tegus (Tegus AI by AlphaSense)** owns the expert-call-transcript-search category. **Visible Alpha (Sandbox)** owns the consensus-estimates category. **Bloomberg GPT** and **OpenAI for Capital Markets** are the platform-tier challengers. **AlphaSense, Daloopa, Mosaic AI, Linq, Capitalize.ai, V7 Labs, Causal, AlphaPy, Kanjo, Lex** round out the long tail.
4. **Adoption inflection:** **16-21% of M&A professionals using generative AI in 2025 → projected 80% within three years.** This is the steepest professional-services adoption curve in any vertical in this canon. The driver is unit-economics: a senior banker's pitchbook that took 40 analyst-hours now takes 1-2 hours of supervised AI output, compressing deal-team-cost-per-pitch by 90%+.
5. **Failure modes:** Three structural failure modes: **MNPI / Chinese-wall data leakage** (an AI agent that crosses a deal team's information barrier creates instant SEC + FINRA exposure and gets banned firm-wide); **hallucinated financials in a board-deck or fairness opinion** (a single fabricated revenue figure in an M&A pitchbook destroys reputation and creates litigation exposure); **bulge-bracket procurement gravity** (a six-month POC that becomes a 24-month internal-build because the bulge bracket decided to build rather than buy after seeing the architecture).
6. **MLP communities:** Founder-velocity in capital markets concentrates in **the conference-and-association layer (ACG InterGrowth + ACG Capital Connection + Mergermarket M&A Forum + Reuters Global Investor + ICR Conference + Citi Global Wealth + Goldman Sachs Industrials Conference + Morgan Stanley TMT)**, **the trade press (Bloomberg / Reuters / WSJ Pro M&A / Mergermarket / PE Hub / Pitchbook / Axios Pro Rata)**, and **the LinkedIn-driven banker-creator economy** (a small but extremely high-density network of MD-and-above thought leaders).
7. **GTM playbook (winning pattern):** Capital markets rewards a **bulge-bracket-pilot-or-elite-boutique-design-partner GTM, not direct cold acquisition**. Winning pattern in 2026 is to land a single MD or department-head sponsor at one of Lazard / Evercore / Centerview / Moelis / Houlihan Lokey / Jefferies / Rothschild, run a 90-day analyst-team pilot, document the time-saved benchmark (Rogo's reference: 40-hour pitchbook in 1-2 hours of supervised AI output), and parlay the case study into bulge-bracket-procurement entry. **The Rogo playbook of 35,000 users at 250 firms within 36 months is the canonical reference.**

## Part I — The Market

### TAM and segment sizing

Global investment banking and capital markets is a $300-400B annual fee economy. Within that, the addressable layer for vertical AI agents — through analyst-productivity tooling, deal-execution platforms, research automation, diligence workflows, and trading-desk augmentation — is roughly $20-30B in annual technology spend across (1) bulge-bracket banks (~$8B), (2) elite boutique and mid-market banks (~$4B), (3) buy-side asset managers and hedge funds (~$8B), (4) private equity and growth equity (~$3B), and (5) sell-side equity research and credit research (~$3B). The AI-software wedge is $5-7B in 2026 with 35-45% CAGR through 2030.

Within the addressable wedge, AI-native value is concentrated in seven buyable buckets:

- **AI banker / agentic deal-execution platform** (~$2B addressable): Rogo (Felix), Hebbia (deep research), Capitalize.ai, Linq, Mosaic AI. Rogo dominates the deal-team-productivity sub-category.
- **AI document Q&A + diligence workflow** (~$1.5B addressable): Hebbia, AlphaSense, Tegus AI, V7 Labs, Kanjo, Lex. Hebbia is the breakout document-platform play.
- **AI equity research + analyst augmentation** (~$1.2B addressable): Visible Alpha + Sandbox, Bloomberg GPT, Daloopa, AlphaSense, FactSet AI. Heavy incumbent presence; AI-native challengers must integrate via Bloomberg + Refinitiv terminals.
- **AI trading-floor + execution-management** (~$1B addressable): Internal builds at major banks; minimal AI-native vendor presence due to MNPI sensitivity.
- **AI risk + compliance + supervision** (~$0.5B addressable in capital-markets-specific): Smarsh (capital-markets-specific deployments), Behavox, Eventus, NICE Actimize.
- **AI deal sourcing + buyer-seller matching** (~$0.5B addressable): Sourcescrub, SEC.IO, Grata, Sourcescrub-adjacent platforms shipping AI features.
- **AI back-office + middle-office automation** (~$0.5B addressable): UiPath + Automation Anywhere capital-markets verticalizations; Plat platform plays.

### Capital flow

Three signals define the 2025-2026 capital landscape. First, **Rogo's $160M Series D in April 2026** at presumably a $1B+ valuation, joining the prior $75M Series C and $50M earlier rounds for **$300M+ cumulative funding** — the largest single dollars-deployed bet on the AI-banker thesis. Second, **Hebbia's $130M Series B at $700M valuation on $13M of profitable revenue** in July 2024 — a 50x revenue multiple validated by Andreessen Horowitz + Index + Google Ventures + Peter Thiel. Third, **JPMorgan Growth Equity Partners' participation in Rogo's Series D** — a strategic-corporate-VC signal that JPMorgan is willing to fund the disruptor rather than build internally.

### Adoption inflection

The 2026 inflection has four drivers:

- **The 16-21% to 80% adoption curve** documented across multiple M&A research surveys. M&A professionals using generative AI in 2025 was 16-21% (Mergermarket, Skadden, Bain surveys); projected 80% within three years. This is the steepest professional-services adoption curve in any vertical in the canon.
- **Rogo's 35,000-user, 250-institution footprint** in 36 months. The reference architecture for an AI-native banker product has been validated.
- **Hebbia's 1B+ pages processed footprint.** The reference architecture for AI document-Q&A in capital markets has been validated.
- **Bulge-bracket internal-AI deployments** (JPMorgan's LLM Suite, Goldman's GS AI Platform, Morgan Stanley's AI @ Morgan Stanley Assistant via OpenAI for IB, Citi's GS-style internal LLM rollout). The bulge brackets are simultaneously building and buying — and the buy-side participation (JPMorgan Growth Equity in Rogo) signals that even the build-it-yourself shops are hedging.

## Part II — The Buying Map

The capital-markets buying map is uniquely concentrated. The "buyer" populations are small (hundreds, not millions), high-spend, and dominated by a narrow set of distribution channels.

**Bulge-bracket investment bank.** Goldman Sachs, JPMorgan, Morgan Stanley, Bank of America Securities, Citi, Barclays, Deutsche Bank, UBS. ~$200B+ collective annual fee revenue. Procurement is gated on (a) MNPI handling and Chinese-wall compliance, (b) SOC 2 + ISO 27001 + FedRAMP-equivalent security posture, (c) integration with the bank's internal LLM platform (JPM's LLM Suite, GS AI Platform), and (d) a multi-year MSA / framework agreement that survives multiple managing directors. Sales cycles are 12-24 months for bulge-bracket-firm-wide deployment but 4-6 months for department-level pilots.

**Elite boutique investment bank.** Lazard, Evercore, Centerview, Moelis, Houlihan Lokey, Rothschild, Perella Weinberg, Greenhill, PJT Partners, Guggenheim Securities. **The canonical AI-banker beachhead — the buyer is the head of M&A, the procurement decision is made by a partner committee, and a 90-day pilot can convert to a multi-year contract within 6 months.** This is where Rogo and Hebbia have built their reference customer rosters.

**Mid-market and middle-market investment bank.** Jefferies, Piper Sandler, Raymond James, William Blair, Stifel, Lincoln International, Harris Williams, Robert W. Baird, Cowen (now part of TD), KeyBanc Capital Markets, Truist Securities, BMO Capital Markets. ~3,000+ mid-market dealmakers in the US alone. Buyer is the head of investment banking or the COO; procurement cycles are 6-9 months; price points are typically $50K-$200K per analyst-team license.

**Buy-side asset manager.** BlackRock, Vanguard, Fidelity, State Street, T. Rowe Price, Capital Group, Wellington, MFS Investment Management, Franklin Templeton, Invesco, AllianceBernstein. **AI tooling for the buy-side is the largest single sub-segment by deal size — Hebbia's 30%-of-asset-managers footprint validates this.** The buyer is the head of research or the CIO; procurement decisions involve fund-management technology committees.

**Private equity and growth equity.** KKR, Blackstone, Carlyle, Apollo, TPG, Bain Capital, CVC, Warburg Pincus, Vista Equity Partners, Thoma Bravo, Silver Lake, Hellman & Friedman, Advent International, EQT, Permira, BC Partners. ~$8T+ in collective AUM; AI deployment focuses on deal sourcing, portfolio company diligence, and PortCo operational analytics. **KKR is a documented Hebbia client.**

**Sell-side equity research and credit research.** ~3,000+ analysts at the major banks plus independent research shops (Bernstein, Morningstar, ISS, MSCI, Edward Jones Research). Procurement is typically through bank-tier infrastructure (Bloomberg + Refinitiv terminals) rather than direct AI-native vendor relationships; AI penetration here is gated by terminal-vendor integration.

**Hedge funds.** Citadel, Millennium, Point72, D.E. Shaw, Two Sigma, Renaissance, Bridgewater, Balyasny, Schonfeld, ExodusPoint, Hudson Bay. ~$5T+ in collective AUM. AI deployment is mostly internal (signal generation, alpha capture); minimal AI-native vendor presence due to information-edge protection.

**Hebbia and Rogo's specific footprints documented in published sources:**
- **Hebbia clients:** Centerview Partners, KKR, MetLife, Oak Hill Advisors. ~30% of all asset managers.
- **Rogo clients:** Rothschild & Co, Jefferies, Lazard, Moelis, Nomura. 35,000+ users at 250+ institutions.

## Part III — Incumbent + Disruptor Topology

### Bulge-bracket internal-AI builds

**Goldman Sachs.** "GS AI Platform" deployed firm-wide; reportedly 50K+ users; Goldman has explicitly stated it is building rather than buying for core deal-team workflows.

**JPMorgan Chase.** **JPMorgan LLM Suite** deployed across investment banking, asset management, and corporate functions; reported 200K+ users firm-wide. Notably, **JPMorgan Growth Equity Partners participated in Rogo's $160M Series D** — a strategic hedge against the build-vs-buy decision.

**Morgan Stanley.** **AI @ Morgan Stanley Assistant via OpenAI** rolled out to advisor + IB teams; the wirehouse reference deployment in this canon (also referenced in the wealth-management paper).

**Bank of America Securities, Citi, Barclays, Deutsche Bank, UBS.** Each has shipped or announced an internal AI platform; deployment depth varies.

### Elite boutique reference customers

**Lazard.** Published the **2025 M&A Review and 2026 Outlook** in January 2026 plus dedicated "AI Impact on Technology M&A" research from Lazard Technology Advisory. Lazard is a Rogo client.

**Evercore, Centerview, Moelis, Houlihan Lokey, Rothschild, Jefferies.** All cited as Rogo customers (or Hebbia in the case of Centerview). The boutique tier is the proven AI-banker beachhead.

### AI-native disruptors

**Rogo (Series D $160M April 2026, $300M+ total funding).** AI agent platform for finance. Flagship product **Felix** — a specialized tool for high finance that manages complex, long-term workflows; automatically creates presentations, models, and documents; handles deal screening, CIM generation, buyer outreach, and data-room diligence. **35,000+ financial professionals at 250+ institutions; Rothschild + Jefferies + Lazard + Moelis + Nomura cited.** Backed by Kleiner Perkins, Sequoia, Thrive Capital, Khosla, **JPMorgan Growth Equity Partners**, BoxGroup, Mantis, Jack Altman, Evantic, Positive Sum.

**Hebbia ($130M Series B at $700M valuation, $13M profitable revenue at time of raise).** Document Q&A + deep-research platform. **Processes 1B+ pages.** **30% of all asset managers use Hebbia.** Centerview Partners + KKR + MetLife + Oak Hill Advisors cited. Backed by Andreessen Horowitz (lead), Index Ventures, Google Ventures, Peter Thiel.

**AlphaSense.** Mature incumbent of the document-search + expert-call-transcript category; acquired Tegus to consolidate the expert-network adjacency. AlphaSense's enterprise revenue and customer count exceed $300M+ ARR.

**Tegus (now AlphaSense subsidiary).** Expert-call transcript library with AI search; absorbed into AlphaSense.

**Visible Alpha (Sandbox).** Consensus-estimates platform with AI features; the canonical play for sell-side estimate aggregation.

**Bloomberg GPT.** Bloomberg's internal LLM for the Bloomberg Terminal; not externally licensable but a competitive threat to AI-native vendors that depend on Bloomberg-data integrations.

**Daloopa.** AI-driven financial-data extraction from earnings releases and SEC filings; alternative to manual analyst data entry.

**Capitalize.ai, Linq, Mosaic AI, V7 Labs, Causal, AlphaPy, Kanjo, Lex.** Long tail of AI-native capital-markets startups, mostly at <$10M ARR.

### Data + research-platform incumbents

**Bloomberg.** ~$13B revenue; ~325,000 terminal subscribers. Bloomberg GPT + AI-augmented terminal features.

**Refinitiv / LSEG.** Bloomberg's primary competitor at ~$5B+ revenue. Refinitiv Workspace + AI features.

**FactSet.** ~$2.3B revenue. Workstation AI features.

**S&P Capital IQ.** ~$3B+ revenue (S&P Global Market Intelligence segment). Capital IQ AI features.

## Part IV — Production Deployments

Five reference deployments structure the production reality of capital-markets vertical agents in 2026:

**(1) Rogo Felix at Rothschild + Jefferies + Lazard + Moelis + Nomura.** AI agent that handles deal screening, CIM generation, buyer outreach, data-room diligence, presentation construction, and financial modeling autonomously. **35,000+ financial professionals at 250+ institutions.** Rogo's reference architecture: agentic-platform-for-finance, with Felix as the user-facing agent layer over the underlying AI banker stack. Reference benchmark: pitchbook construction compressed from 40+ analyst-hours to 1-2 hours of supervised AI output.

**(2) Hebbia at Centerview Partners + KKR + MetLife + Oak Hill Advisors.** Document Q&A + deep-research platform processing 1B+ pages. Buy-side analysts upload data rooms, public filings, expert-call transcripts, and internal IC memos; Hebbia builds searchable indexes and answers complex multi-step research questions across the corpus. The reference architecture for AI-native deep research in finance.

**(3) JPMorgan LLM Suite (firm-wide deployment, 200K+ users).** Internal-AI platform across investment banking + asset management + corporate functions. The reference architecture for bulge-bracket internal-AI builds. JPMorgan's simultaneous Rogo Series D investment is the canonical hedge: build internally for table-stakes use cases, invest externally in best-of-breed for specialized agentic workflows.

**(4) Goldman Sachs GS AI Platform.** Firm-wide internal-AI platform reportedly serving 50K+ users. The bulge-bracket build-not-buy reference architecture for the most aggressive in-house technology shop in capital markets.

**(5) Morgan Stanley AI @ Morgan Stanley Assistant (OpenAI).** Internal-AI advisor + IB tooling powered by OpenAI; rolled out across the wealth + IB divisions. The wirehouse-tier reference architecture.

## Part V — Three Failure Modes

### Failure Mode 1: MNPI / Chinese-wall data leakage

Investment banks operate under strict information-barrier requirements. An AI agent that allows information about Deal A (in M&A) to leak into a research analyst's response on Company A (in equity research) creates instant SEC + FINRA exposure and gets banned firm-wide. **Several AI-native vendors in 2024-2025 had bulge-bracket POCs killed when compliance teams identified information-flow paths that crossed deal-team / research / sales-and-trading walls.** **Lesson: AI-native capital-markets vendors must architect tenant-isolation, deal-team-isolation, and information-barrier-aware retrieval from day one. SOC 2 + ISO 27001 are necessary but not sufficient — compliance teams require demonstrable data-flow audits aligned with FINRA Rule 5280, SEC Reg AC, and the firm's internal Chinese-wall policies.**

### Failure Mode 2: Hallucinated financials in board-decks or fairness opinions

A single fabricated revenue figure in an M&A pitchbook destroys reputation and creates litigation exposure. AI agents that generate financial outputs without source-traceable citations and human-in-the-loop verification are unusable in deal contexts. **The Rogo and Hebbia products both ship with mandatory citation surfacing — every financial output is tagged with a source document and page reference. AI vendors that lack this capability cannot reach production at any tier-one investment bank.** **Lesson: AI-native capital-markets vendors must ship source-traceable citation-and-verification UX from day one. The output is not the model's answer — it is the model's answer plus the audit trail proving the answer.**

### Failure Mode 3: Bulge-bracket procurement gravity (build-vs-buy)

Bulge-bracket banks have ~$1B+ annual technology budgets and large internal engineering teams; many will run a six-month POC, learn the architecture, and then build internally rather than commit to a multi-year vendor contract. **Multiple AI-native vendors in 2023-2024 reported that bulge-bracket POCs converted to internal-build decisions roughly 40-50% of the time.** **Lesson: AI-native capital-markets vendors should not over-index on bulge-bracket pilots as the primary GTM. The canonical Rogo and Hebbia playbook started with elite-boutique-and-mid-market customers (Rothschild + Jefferies + Lazard + Moelis + Centerview + KKR), built reference architectures and case studies, and then expanded into bulge-bracket through department-level pilots once the proof points were in market.**

## Part VI — MLP Communities

The minimum-lovable-product community for capital-markets vertical agents is structurally different from every other vertical in this series — it is small (hundreds of buyer-decision-makers), highly networked, and dominated by a handful of conferences and trade-press surfaces.

**ACG InterGrowth (annual, May, the canonical M&A community event).** ~3,000 dealmakers; the Association for Corporate Growth's flagship event. The canonical mid-market-and-elite-boutique networking surface.

**ACG Capital Connection (regional, multiple events per year).** ACG's regional networking events for dealmakers + sponsors + service providers.

**Mergermarket M&A Forum (annual).** Mergermarket's editorial-driven dealmaker convention.

**Reuters Global Investor (annual).** Cross-asset-class investor + dealmaker convention.

**ICR Conference (annual, January, Florida).** ~3,000+ public-company executives, sell-side analysts, buy-side investors. The canonical sell-side / buy-side cross-pollination event.

**Goldman Sachs Industrials Conference, Morgan Stanley TMT, JPMorgan Healthcare Conference (J.P. Morgan Healthcare in San Francisco — ~9,000 attendees).** Bank-hosted sector conferences are the canonical surface for sector-specific dealmaker access.

**Citi Global Wealth, BAML Healthcare, UBS Industrials, Barclays Healthcare.** Bank-hosted conferences proliferate; founders should target the conference matching their sector specialization.

**Trade press: Bloomberg, Reuters, WSJ Pro M&A, Financial Times M&A, Mergermarket, PE Hub, PitchBook News, Axios Pro Rata, Term Sheet (Fortune), The Information.** The capital-markets-specific trade press is concentrated and influential. **Term Sheet (Lucinda Shen / Allie Garfinkle) and Axios Pro Rata are the canonical newsletters for AI-banking deal flow.**

**LinkedIn-driven banker-creator economy.** A small but high-density network of MD-and-above thought leaders — Ben Thompson (Stratechery), Matt Levine (Money Stuff at Bloomberg), Byrne Hobart (The Diff), Marc Rubinstein (Net Interest), Doug O'Laughlin (Fabricated Knowledge), Packy McCormick (Not Boring) — drive narrative and signal-amplification across the AI-banking thesis.

**Industry research subscriptions.** **Pitchbook + Preqin + Mergermarket + Refinitiv-Deals-Intelligence + S&P CapIQ Pro** define the deal-flow data infrastructure. Founders raising institutional capital cite Pitchbook benchmarks.

## Part VII — GTM Decision Tree

The capital-markets vertical does not reward generic GTM playbooks. The decision tree below codifies the strategy by buyer type.

**1. If your product is an AI banker / agentic deal-execution platform:** Replicate the Rogo playbook. Land 1-3 elite-boutique design partners (Lazard / Evercore / Centerview / Moelis / Houlihan Lokey / Jefferies / Rothschild). Build deeply tailored Felix-style agents for deal screening + CIM generation + buyer outreach + data-room diligence. Convert design-partner case studies into elite-boutique-tier deployments at 5-15 firms. Use the boutique-tier proof points to enter bulge-bracket procurement through department-level pilots.

**2. If your product is AI document Q&A + diligence workflow:** Replicate the Hebbia playbook. Land buy-side asset managers (Centerview-style PE/HF + KKR-style PE + MetLife-style insurance asset managers + Oak Hill-style credit funds) as the design-partner cohort. Build the document-corpus indexing + multi-step retrieval + citation-surfacing UX as the core defensible product. Expand into investment banks as a horizontal companion to dedicated AI-banker platforms.

**3. If your product is AI equity research + analyst augmentation:** Compete with or augment the Bloomberg + Refinitiv + FactSet + Capital IQ + Visible Alpha + AlphaSense + Daloopa stack. Direct-to-analyst SaaS bypassing the terminal vendors has a structural disadvantage; partner through Bloomberg App Portal, Refinitiv Workspace, or FactSet OpenFactSet.

**4. If your product is AI trading-floor + execution-management:** Recognize that bulge brackets build internally for trading-floor AI due to MNPI sensitivity; pursue mid-market broker-dealers, retail-broker desks (Schwab + Fidelity), and asset-manager execution desks instead.

**5. If your product is AI risk + compliance + supervision:** Compete with or partner alongside Smarsh, Behavox, Eventus, NICE Actimize. Capital-markets-specific compliance is a sub-vertical of the broader compliance market documented in earlier canon entries.

**6. If your product is AI deal sourcing + buyer-seller matching:** Compete with Sourcescrub + Grata + SourceScrub-adjacent platforms; differentiate on private-company-data depth and AI-driven match scoring.

**7. If your product is AI back-office + middle-office automation:** Capital-markets back-office is dominated by UiPath + Automation Anywhere verticalizations; AI-native plays here should focus on workflow categories (post-trade reconciliation, corporate actions processing, KYC/AML for institutional onboarding) where vertical-AI gives a clear unit-economics edge over RPA-incumbent retrofits.

**8. If your product targets multiple segments simultaneously:** Pick one segment and one tier (boutique or asset manager) for the first 18 months. Capital markets punishes horizontal generalists; the AI-native winners (Rogo in agentic-banker, Hebbia in document Q&A, AlphaSense in research-and-expert-calls) all started in a single buyer-tier-and-workflow niche and expanded only after dominating that niche.

---

## References

1. PRNewswire — Rogo Raises $160M Series D to Scale the Agentic Platform for Finance, April 29 2026. https://www.prnewswire.com/news-releases/rogo-raises-160m-series-d-to-scale-the-agentic-platform-for-finance-302756546.html
2. Rogo News — Our $160M Series D and the Road Ahead. https://rogo.ai/news/series-d
3. TechFundingNews — Kleiner Perkins leads Rogo's $160M raise to build the AI operating system for investment banking. https://techfundingnews.com/rogo-160m-series-d-kleiner-perkins-investment-banking-ai/
4. SiliconANGLE — Rogo raises $160M to speed up financial analysis with AI agents, April 2026. https://siliconangle.com/2026/04/29/rogo-raises-160m-speed-financial-analysis-ai-agents/
5. FinTech Global — Rogo raises $160m Series D to scale finance AI platform. https://fintech.global/2026/04/29/rogo-raises-160m-series-d-to-scale-finance-ai-platform/
6. Rogo News — Scaling Rogo to Build the Future of Finance: Our $75M Series C and European Expansion. https://rogo.ai/news/scaling-rogo-to-build-the-future-of-investment-banking-our-75m-series-c-and-european-expansion
7. PYMNTS — Rogo Raises $50 Million to Develop AI-Powered Investment Banker, 2025. https://www.pymnts.com/news/investment-tracker/2025/rogo-raises-50-million-dollars-develop-ai-powered-investment-banker/
8. AI Automation Global — Rogo Hits $160M: AI Agents Take Over Investment Banking. https://aiautomationglobal.com/blog/rogo-ai-160m-series-d-felix-investment-banking-agents-2026
9. TechCrunch — AI startup Hebbia raised $130M at a $700M valuation on $13 million of profitable revenue. https://techcrunch.com/2024/07/09/ai-startup-hebbia-rased-130m-at-a-700m-valuation-on-13-million-of-profitable-revenue/
10. Hebbia Blog — Hebbia Raises Series B Led by Andreessen Horowitz. https://www.hebbia.com/blog/hebbia-raises-usd130m-series-b
11. Index Ventures — Hebbia Raises $130M in Series B Funding. https://www.indexventures.com/perspectives/hebbia-raises-130m-in-series-b-funding-to-transform-how-businesses-put-data-to-work-with-ai/
12. Global Banking and Finance — Hebbia Processes One Billion Pages as Financial Institutions Deploy AI Infrastructure at Unprecedented Scale. https://www.globalbankingandfinance.com/hebbia-processes-one-billion-pages-as-financial-institutions-deploy-ai-infrastructure-at-unprecedented-scale/
13. Hebbia Resources — Top 10 Rogo Competitors for Finance Teams 2026. https://www.hebbia.com/resources/rogo-competitors
14. Lazard Research Insights — 2025 M&A Review and 2026 Outlook. https://www.lazard.com/research-insights/lazard-2025-ma-review-and-2026-outlook/
15. Lazard Technology Advisory — AI Impact on Technology M&A. https://www.lazard.com/research-insights/lazard-technology-advisory-ai-impact-on-technology-ma/
16. PwC — Global M&A industry trends: 2026 outlook. https://www.pwc.com/gx/en/services/deals/trends.html
17. Baker McKenzie — M&A Reawakens to a More Complex 2026, January 2026. https://www.bakermckenzie.com/en/insight/publications/2026/01/ma-reawakes-more-complex-2026
18. Skadden Arps — M&A in the AI Era: What Buyers Can Do to Confirm and Protect Value, 2026 Insights. https://www.skadden.com/insights/publications/2026/2026-insights/sector-spotlights/ma-in-the-ai-era
19. ChatFin — AI Tools for Deal Sourcing & M&A in Investment Banking 2026. https://chatfin.ai/blog/ai-tools-for-deal-sourcing-ma-in-investment-banking-2026/
20. Chambers and Partners — Technology M&A 2026 Practice Guide. https://practiceguides.chambers.com/practice-guides/technology-ma-2026

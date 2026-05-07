---
title: "State of Vertical Agents 2026: Wealth Management"
subtitle: "How Jump, Zocks, Holistiplan, FP Alpha — and Schwab, Vanguard, Citi Wealth — are restructuring the $135T global advisor channel through generative-AI meeting prep, tax planning, and portfolio analysis"
publication: "perea.ai Research"
authors: ["Dante Perea"]
version: "1.0"
status: "Public draft"
date: "2026-05"
audience: "Wealth-tech founders, RIA principals, broker-dealer technology leaders, custodian product teams, and investors evaluating advisor-productivity AI"
length: "~5,000 words"
license: "CC BY 4.0"
description: "A field map of vertical AI agents in wealth management: where Schwab, Fidelity, Vanguard, BlackRock, and Citi Wealth are deploying client-facing and advisor-productivity AI, the Jump/Zocks/Holistiplan/FP Alpha integration mesh that has emerged as the canonical AI-native advisor stack, the Hubly-Docupace acquisition pattern, and the GTM playbook that wins through RIA-custodian channels (Schwab + Fidelity + Pershing) and broker-dealer + wirehouse partnerships."
---

## Foreword

Wealth management is the inverse of every other vertical in this series. In legal, healthcare, insurance, and accounting, AI is mostly being used to automate work the buyer wishes was already automated — discovery, intake, claims processing, reconciliation. In wealth management, AI is being used to *expand the relationship* — to give a $1M-AUM advisor the leverage to serve a $5M client, to compress meeting prep from three hours to twelve minutes, to turn a 1040 PDF into a tax-planning conversation, to take a thirty-minute discovery call and surface every estate, insurance, and gifting issue the advisor would otherwise have missed.

The vertical is also unusual in that its AI inflection is being driven not by the AI-native challengers alone but by an extraordinary alignment of incumbents. Schwab Advisor Services in February 2026 announced the launch of **client-facing AI agents** rolling out in June 2026 across its $4T+ RIA-custodian platform. Vanguard in April 2026 announced **Expert Insights**, an AI-enabled portfolio-analysis tool offered free to any advisor with a Vanguard account. Citi Wealth deployed AI-powered client-experience technology. BlackRock and Vanguard published joint commentary on AI-and-clean-data foundations. The pattern in wealth management is unique in this series: incumbents are leading the AI deployment, and AI-native startups are integrating *into* incumbents rather than disrupting around them.

This paper is the twenty-second entry in the State of Vertical Agents series. The buyer is the financial advisor — at an RIA, a broker-dealer, a wirehouse, or a multi-family office — and the vertical's distinctive feature is that the AI tooling is becoming a single integrated *mesh* (Jump + Zocks + Holistiplan + FP Alpha + eMoney + Wealthbox + Wealth.com) rather than a winner-takes-all platform. AI-native founders who understand this mesh structure can ship into wealth management today; founders who try to replace the mesh with a single all-in-one platform will lose.

## Executive Summary

1. **Capital flow:** The wealth-management AI category is comparatively early-stage in headline VC dollars but extraordinarily concentrated by integration. **Jump** is the AI-powered operating system for advisors and has anchored the workflow integration mesh. **Zocks** has shipped strategic partnerships with eMoney, PreciseFP, Holistiplan, and FP Alpha within a single six-month window. **Holistiplan** is the dominant tax-planning AI and announced both a Zocks strategic partnership (September 2025) and a Jump integration. **FP Alpha** raised early-stage rounds and shipped a direct integration with eMoney Advisor. **Hubly was acquired by Docupace** in late 2024-2025, signaling that workflow tooling is already in the consolidation phase.
2. **Incumbent topology:** The custodian-and-platform tier is unusually consolidated. **Charles Schwab Advisor Services (~$4T+ RIA custody assets, post-TD Ameritrade merger)** is the dominant RIA-custodian channel; **Fidelity Institutional Wealth Services** is the close second; **Pershing (BNY Mellon)** is the third major. **LPL Financial, Raymond James, Edward Jones, Ameriprise, Cetera** anchor the independent broker-dealer channel; **Morgan Stanley, Merrill Lynch, UBS, Wells Fargo Advisors** anchor the wirehouse channel. **Vanguard, BlackRock, and Citi Wealth** have shipped advisor-AI tools in 2026 directly to the channel.
3. **Disruptor topology:** The AI-native advisor stack has consolidated into a **mesh of tightly integrated point tools**, not a single winner-takes-all platform. **Jump** owns the operating-system layer; **Zocks** owns the meeting-prep + notetaker; **Holistiplan** owns the tax-planning workflow; **FP Alpha** owns AI-driven tax + estate + insurance planning; **eMoney + RightCapital + MoneyGuide** anchor the underlying financial-planning software; **Wealthbox + Redtail (now Orion) + Salesforce Financial Services Cloud** anchor the CRM layer. The mesh integrates through APIs, not through acquisition into a single platform.
4. **Adoption inflection:** **Schwab's 2026 RIA AI Adoption Study** documents the sharpest adoption curve in the vertical's history — **63% of independent RIAs now use AI tools (up from 30% in 2023, more than doubled in three years), and 82% of AI-using RIAs are using generative AI**. Productivity gains are concrete: in 2022 firms with one support hire serviced 86 clients and generated $517,500 in revenue; by 2024, similar firms managed 111 clients and earned $591,000 with the same team — a **29% client-capacity increase per support FTE in two years**.
5. **Failure modes:** Three structural failure modes: **all-in-one advisor platform that competes with the mesh** (graveyard going back fifteen years — eMoney pre-Fidelity acquisition, FinaMetrica, AdvisorEngine, dozens of attempts that lost to specialist tools); **direct-to-advisor SaaS that bypasses the custodian channel** (custodians gate technology adoption through their advisor-tech "approved vendor" programs); **AI tooling that ignores SEC + FINRA + DOL fiduciary regulatory layer** (advisor recommendations are regulated speech; AI must be auditable, supervised, and fit within Reg BI and the DOL's evolving fiduciary framework).
6. **MLP communities:** Founder-velocity in wealth management concentrates in **T3 Conference (Joel Bruckenstein, canonical advisor-tech event), Wealth Management EDGE (Boca Raton, ~3,000 attendees), Schwab IMPACT (largest RIA conference, 5,000+ attendees), LINC (Schwab Advisor Services partner conference), Future Proof Festival (Huntington Beach, AUM-rich attendee profile), Barron's Top Advisor Summit, Bob Veres Insider's Forum, MarketCounsel Summit**. Editorial layer: **Kitces.com (Michael Kitces, the canonical advisor-trust brand), Financial Planning Magazine, InvestmentNews, ThinkAdvisor, Citywire RIA, WealthManagement.com**.
7. **GTM playbook (winning pattern):** Wealth management rewards **mesh-integration GTM, not standalone platform GTM**. Winning pattern in 2026 is to ship a single high-conviction point tool, integrate aggressively into the existing mesh (Jump + Zocks + Holistiplan + FP Alpha + eMoney + Wealthbox), get on a custodian's "approved vendor" list (Schwab + Fidelity + Pershing), and earn distribution through Kitces.com editorial coverage and a T3 / Wealth Management EDGE / Schwab IMPACT speaking slot. **Direct-to-advisor cold acquisition without integration partnerships and custodian-approved-vendor status has a brutal 18-24 month sales cycle and a 70-90% churn rate.**

## Part I — The Market

### TAM and segment sizing

Global wealth management is a **$135T AUM economy**. Within that, the addressable layer for vertical AI agents — through advisor-productivity tools, client-experience platforms, planning software, portfolio-analysis tools, and back-office automation — is roughly $45-55B in annual technology spend across (1) RIA-channel (~$15B), (2) independent broker-dealer (~$10B), (3) wirehouse and bank-wealth (~$15B), (4) multi-family-office and trust (~$5B), and (5) direct-to-consumer robo-advisor (~$3B). The AI-software wedge across these is in the $5-8B range in 2026, with a 35-40% CAGR through 2030 driven by the documented advisor-productivity inflection.

Within the addressable wedge, AI-native value is concentrated in seven buyable buckets:

- **AI meeting prep and notetaker** (~$1.5B addressable): Zocks, Jump (overlap), Wealthbox AI, Pulse360, Knudge, Sybil. Highest-velocity category, lowest CAC, mesh-integration central.
- **AI tax planning** (~$1B addressable): Holistiplan, FP Alpha, Corvee. Holistiplan is dominant; FP Alpha extends into estate + insurance.
- **AI financial planning + scenario modeling** (~$2B addressable): eMoney Advisor (Fidelity), MoneyGuidePro (Envestnet), RightCapital, NaviPlan (InvestCloud), Asset-Map. Incumbents being augmented with AI; few greenfield startups.
- **AI portfolio analysis + investment research** (~$1B addressable): Vanguard Expert Insights, Schwab AI Research, BlackRock Aladdin Copilot, JPMorgan IndexGPT, Bloomberg GPT for advisor desktop, Morningstar Direct AI extensions.
- **AI client communication + content** (~$0.5B addressable): Knudge, Hamachi.ai, Marketing AI tools layered into Wealthbox + Salesforce Financial Services Cloud.
- **AI workflow + practice management** (~$1.5B addressable): Hubly (now Docupace), Skience, Salesforce Financial Services Cloud, Practifi (now Ategrity), Equisoft.
- **AI compliance + supervision + archival** (~$1B addressable): Smarsh, Global Relay, MyComplianceOffice, ComplyLog. Mature category being re-architected as agentic.

### Capital flow

Three signals define the capital landscape. First, **Hubly's acquisition by Docupace** in late 2024-2025 signaled that the workflow-and-practice-management layer is consolidating into custodian-aligned platforms. Second, the **Jump/Zocks/Holistiplan/FP Alpha integration cycle of 2025-2026** — multiple bilateral partnerships and integrations announced within a six-month window — established that the mesh, not the platform, is the architecture. Third, **incumbent capital deployment** is the dominant signal: Schwab Advisor Services launched its Advisor AI in Action program with monthly webcasts, in-person AI Summits in Newport Beach + NYC + Chicago, and multi-day executive education for RIA leaders; Vanguard launched Expert Insights for free; Citi Wealth deployed firm-wide; BlackRock and Vanguard jointly published on AI-and-clean-data foundations.

### Adoption inflection

The 2026 inflection has four drivers:

- **Schwab 2026 RIA AI Adoption Study** documenting 63% RIA AI adoption (more than doubled since 2023) with 82% of users on generative AI. **Schwab's 533-RIA survey is the canonical benchmark** for the industry.
- **Schwab client-facing AI agents** rolling out in June 2026 — the first major custodian to ship client-facing AI agents at scale.
- **Vanguard Expert Insights** released in April 2026, free to any advisor with a Vanguard account, embedded in the Portfolio Analytics Tool. Reduces the friction of AI portfolio analysis to zero.
- **Productivity benchmark documented**: 2022 firms with one support hire serviced 86 clients and generated $517,500 in revenue; by 2024, similar firms managed 111 clients and earned $591,000. **29% client-capacity increase per support FTE** is the concrete benchmark advisors now use to underwrite AI investment.

## Part II — The Buying Map

The wealth-management buying map is structured by channel — there are five distinct distribution channels, each with its own custodian or platform layer, and the AI procurement decision flows through each channel differently.

**Independent RIA (Registered Investment Advisor).** The fastest-growing channel — ~15,000 RIAs in the US managing ~$8T+ in assets. The buyer is the RIA principal or COO, and the procurement decision is gated on (a) the custodian's approved-vendor list, (b) integration with the firm's existing CRM and planning stack, and (c) advisor-staff adoption velocity. **Schwab Advisor Services + Fidelity Institutional Wealth Services + Pershing collectively serve roughly 90%+ of the independent RIA market.**

**Independent broker-dealer (IBD).** ~700 broker-dealers in the US with **LPL Financial (~$1.6T AUM platform), Raymond James (~$1.5T), Cetera, Ameriprise, Edward Jones, Securities America, Cambridge Investment Research, Lincoln Financial Network** anchoring the channel. The buyer is the broker-dealer's home-office technology team, and approved-platform integrations dictate which AI tools are deployable to the broker-dealer's affiliated advisors.

**Wirehouse.** Morgan Stanley (~$5T+ AUM), Merrill Lynch (~$3T), UBS (~$2T), Wells Fargo Advisors (~$2T), and the major bank wealth divisions. The buyer is corporate technology + compliance + supervision; AI deployment is gated on supervision and recordkeeping requirements that exceed the RIA channel.

**Bank wealth and trust.** JPMorgan Private Bank, Citi Wealth, Bank of America Private Bank, Goldman Sachs Personal Wealth Management, Morgan Stanley Private Wealth Management, Northern Trust, Bessemer Trust, US Bank Wealth, BNY Mellon Wealth. **Citi Wealth has been a notable early-AI adopter at the bank-wealth tier.**

**Multi-family office and high-net-worth platforms.** CI Financial / Corient (~$140B AUM), Hightower (~$170B), Mariner Wealth Advisors, Captrust, Creative Planning, Edelman Financial Engines, Mercer Advisors. These are aggregators rolling up RIAs and have outsized procurement power.

**Direct-to-consumer robo and digital-advice.** Betterment, Wealthfront, Schwab Intelligent Portfolios, Fidelity Go, Vanguard Personal Advisor, M1 Finance, SigFig, Personal Capital (now Empower). A separate sub-vertical — AI is mostly being used internally rather than as a customer-facing differentiator.

## Part III — Incumbent + Disruptor Topology

### Custodian incumbents

**Charles Schwab Advisor Services (~$4T+ RIA custody assets, post-TD Ameritrade merger).** The dominant RIA-custodian channel. Schwab's Advisor AI in Action program, the 533-RIA AI Adoption Study, monthly AI webcasts, AI Summits in Newport Beach + NYC + Chicago, multi-day executive education, AI-driven investment research tool (beta with employees, rolling out 2026), and **client-facing AI agents launching June 2026** make Schwab the most aggressive custodian-tier AI deployer in the industry.

**Fidelity Institutional Wealth Services.** Owns eMoney Advisor, the dominant financial-planning software. Has rolled out AI-augmented planning and integration partnerships with FP Alpha, Zocks, Holistiplan.

**Pershing (BNY Mellon).** Third-major custodian; AI deployments lag Schwab and Fidelity but include AI-augmented advisor desktop tools through the BNY Mellon Wove platform.

### Asset-manager incumbents

**Vanguard.** Launched **Expert Insights AI portfolio analysis** in April 2026 — embedded in the Portfolio Analytics Tool, free to any advisor with a Vanguard account. Vanguard's distribution through indexed retail and advisor channels makes free AI tools an extraordinarily aggressive go-to-market.

**BlackRock.** Built **Aladdin Copilot** for institutional and advisor clients on the Aladdin platform — generative AI overlaid on the dominant institutional risk-and-portfolio-analysis system. BlackRock + Vanguard joint commentary on "AI edge starts with clean data" defines the data-foundations narrative for the industry.

**JPMorgan Asset Management.** Internal AI deployments + IndexGPT trademark + advisor-channel positioning.

**Citi Wealth.** Deployed AI-powered client-experience technology firm-wide in 2026 — the first major bank-wealth division to ship integrated AI across the wealth platform.

### IBD + wirehouse incumbents

**LPL Financial (~$1.6T AUM platform).** Largest US independent broker-dealer; rolled out AI-augmented advisor tools for affiliated advisors.

**Raymond James (~$1.5T).** AI deployments concentrated in compliance + supervision + advisor-desktop augmentation.

**Morgan Stanley.** Has deployed **AI @ Morgan Stanley Assistant** powered by OpenAI internally to wealth advisors — the most cited internal-AI deployment in the wirehouse channel.

**Merrill Lynch + Bank of America Private Bank.** Internal AI deployments through Bank of America's broader AI infrastructure.

### AI-native disruptors

**Jump.** The AI-powered operating system for financial advisors. Anchors the integration mesh through partnerships with Holistiplan, eMoney, Wealthbox, and others. Frequently cited as advisors' favorite AI tool in InvestmentNews and Kitces surveys.

**Zocks.** AI meeting-prep + notetaker. Six-month integration sprint in 2025-2026: announced strategic partnerships with **eMoney, PreciseFP, Holistiplan**, and integration with **FP Alpha**. Zocks is the canonical example of the mesh-integration playbook.

**Holistiplan.** Dominant AI tax-planning software for advisors. Reads 1040 PDFs and surfaces planning opportunities; integrates with Jump, Zocks, FP Alpha, eMoney, and major CRMs. Strategic partnership with Zocks announced September 2025.

**FP Alpha.** AI-driven tax + estate + insurance planning. Direct integration with eMoney Advisor allowing automatic client-data sync. Extends the Holistiplan "read tax doc and surface opportunities" pattern to estate-planning documents and insurance policies.

**Hubly (acquired by Docupace).** Workflow + practice-management automation. Acquisition signaled the workflow layer is consolidating into custodian-aligned platforms.

**Wealthbox AI.** AI features layered into the Wealthbox CRM — meeting note tool, email drafting, contact enrichment.

**Hamachi.ai.** New entrant in the advisor-efficiency category; positioned alongside Holistiplan in InvestmentNews coverage.

**Pulse360, Knudge, Sybil, Marketing.ai.** Long tail of AI-native advisor-productivity startups.

**Wealth.com.** Estate-planning-focused AI/digital platform serving the advisor channel.

### Robo-advisor + direct-to-consumer disruptors

**Betterment, Wealthfront, M1 Finance, Empower (formerly Personal Capital), SigFig.** The 2010s-era robo-advisor cohort. AI deployments are mostly internal (portfolio construction, tax-loss harvesting, client behavioral nudges) rather than externally differentiated.

## Part IV — Production Deployments

Five reference deployments structure the production reality of wealth-management vertical agents in 2026:

**(1) Schwab Advisor AI in Action + client-facing AI agents (June 2026).** Schwab's enterprise-scale program: monthly webcasts on AI trends and use cases for RIA clients, in-person AI Summits in Newport Beach + NYC + Chicago, multi-day executive education for RIA leaders, AI-driven research tool for markets and investments (beta with employees, rolling out 2026), and **client-facing AI agents launching June 2026**. The reference architecture for custodian-tier AI: program-led education + native-platform AI + advisor-tier integrations + client-facing rollout.

**(2) Vanguard Expert Insights (April 2026).** AI-enabled portfolio-analysis tool offered free to any advisor with a Vanguard account; embedded in the Vanguard Portfolio Analytics Tool. The reference architecture for asset-manager-tier AI: free, frictionless, embedded into existing tools, distributed through the asset-manager's advisor relationship.

**(3) Jump + Zocks + Holistiplan + FP Alpha integration mesh.** Six-month integration sprint in 2025-2026 in which Jump, Zocks, Holistiplan, FP Alpha, eMoney, PreciseFP, and Wealthbox AI announced bilateral partnerships and integrations. The advisor logs into Jump as the AI operating system; Zocks captures the client meeting; Holistiplan reads the client's 1040 PDF; FP Alpha extends to estate and insurance documents; eMoney is the underlying financial-planning system; data flows bidirectionally across all six tools through APIs. The reference architecture for AI-native advisor stacks: mesh, not platform.

**(4) Citi Wealth firm-wide AI-powered client experience (2026).** Citi Wealth deployed AI-powered technology to enhance the client experience across the wealth-management division. The reference architecture for bank-wealth-tier AI: top-down, firm-wide rollout coordinated with compliance + supervision + technology teams.

**(5) Morgan Stanley AI @ Morgan Stanley Assistant (OpenAI partnership).** Internal-AI deployment to wealth advisors providing instant access to research, market commentary, and client-relevant content. The reference architecture for wirehouse-tier AI: tightly supervised, internally deployed, OpenAI-powered, advisor-desktop integrated.

## Part V — Three Failure Modes

### Failure Mode 1: All-in-one advisor platform that competes with the mesh

The wealth-management software graveyard going back fifteen years is filled with all-in-one platforms that tried to replace the specialist tools and lost. **eMoney pre-Fidelity (acquired 2015), FinaMetrica, AdvisorEngine (acquired Junxure), TrueLink Financial, dozens of attempts** — each tried to be "the platform" for advisors and ran into the structural reality that advisors prefer best-of-breed point tools that integrate, not a single bundled platform. **Lesson: AI-native advisor startups should ship a single high-conviction point tool, integrate aggressively into the existing mesh (Jump + Zocks + Holistiplan + FP Alpha + eMoney + Wealthbox), and let the mesh do the customer-acquisition work — do not try to be the platform.**

### Failure Mode 2: Direct-to-advisor SaaS that bypasses the custodian channel

Custodians (Schwab + Fidelity + Pershing) gate technology adoption through their advisor-tech "approved vendor" programs (Schwab Advisor Center, Fidelity Integration Xchange, Pershing's NetX360). Software not on the approved-vendor list faces a structurally harder sale because the custodian's data, single-sign-on, and client-onboarding workflows are off-limits. **Several AI-native startups in 2023-2024 attempted direct-to-advisor cold acquisition without custodian approval and reported sales cycles of 18-24 months and 70-90% churn rates inside the first year.** **Lesson: AI-native advisor startups should prioritize Schwab + Fidelity + Pershing approved-vendor status before scaling marketing — distribution through the custodian channel is structurally cheaper than direct-to-advisor cold acquisition.**

### Failure Mode 3: AI tooling that ignores SEC + FINRA + DOL fiduciary regulatory layer

Advisor recommendations are regulated speech. The SEC Marketing Rule, FINRA Rule 2210 (communications with the public), the SEC's Reg BI (Best Interest), and the DOL's evolving fiduciary framework (currently in litigation) all impose recordkeeping, supervision, and disclosure requirements that AI tools must accommodate. **AI startups that ship advisor-facing tools without auditable supervision logs, recordkeeping retention, or Reg BI fit-checks face deal-breaker compliance objections from broker-dealer home offices and wirehouse technology teams.** **Lesson: AI-native advisor startups must ship auditable supervision + recordkeeping + Reg-BI-fit-check capability from day one. Compliance archive vendors (Smarsh, Global Relay, MyComplianceOffice) should be integration partners, not afterthoughts.**

## Part VI — MLP Communities

The minimum-lovable-product community for wealth-management vertical agents is among the densest professional-services communities in this series — driven by the industry's strong editorial layer (Kitces.com), conference-driven networking, and custodian-organized events.

**T3 Conference (Joel Bruckenstein, annual, January).** **The canonical advisor-tech event** — Bruckenstein's T3 Conference is the canonical "what is the latest in advisor technology" gathering. Founders shipping new AI tools must speak at T3 to be taken seriously by the advisor-tech ecosystem.

**Wealth Management EDGE (annual, May, Boca Raton FL).** ~3,000 attendees from the RIA + IBD + wirehouse channels. The major industry-press-driven event with editorial agenda set by WealthManagement.com.

**Schwab IMPACT (annual, October).** **Largest RIA conference in the world, 5,000+ attendees.** Custodian-driven, RIA-focused, the dominant single-event surface in the channel.

**LINC (Schwab Advisor Services partner conference, annual, January Phoenix).** Smaller, partner-tech-focused; the canonical surface for AI-native vendors to present integration roadmaps to Schwab's partner-tech team.

**Future Proof Festival (annual, September, Huntington Beach CA).** Modern AUM-rich attendee profile — mix of breakaway-RIA principals + asset managers + asset-manager wholesalers.

**Barron's Top Advisor Summit (annual).** Top-of-channel; advisor-of-the-year-tier audience.

**Bob Veres Insider's Forum (annual).** Editorial brand-driven; small but high-density advisor-principal attendee profile.

**MarketCounsel Summit (annual).** Brian Hamburger / MarketCounsel's RIA-compliance-focused conference with adjacent technology track.

**Editorial layer.** **Kitces.com (Michael Kitces) is the canonical advisor-trust brand — coverage in Kitces.com is the editorial unlock for AI-native startups in this vertical.** **The Latest in Financial AdvisorTech monthly column on Kitces.com is the canonical industry-tracker. **InvestmentNews + ThinkAdvisor + Financial Planning Magazine + Citywire RIA + WealthManagement.com** round out the daily-news layer.

**Industry research subscriptions.** **Cerulli Associates (the canonical industry research provider — RIA channel, asset manager, retirement)**, **Aite-Novarica Group (now Datos Insights)**, **Forrester WealthTech**. AI-native startups raising institutional capital cite Cerulli benchmarks.

## Part VII — GTM Decision Tree

The wealth-management vertical does not reward generic GTM playbooks. The decision tree below codifies the strategy by buyer type.

**1. If your product is an AI meeting-prep + notetaker:** Replicate Zocks' 2025-2026 playbook — ship the core product, then run a six-month integration sprint with the canonical mesh partners (eMoney + Holistiplan + FP Alpha + Wealthbox + Salesforce Financial Services Cloud). Get on Schwab Advisor Center + Fidelity Integration Xchange + Pershing NetX360 approved-vendor lists. Speak at T3 and IMPACT.

**2. If your product is AI tax + estate + insurance planning:** Compete with Holistiplan and FP Alpha through differentiation (deeper estate-planning, deeper insurance-policy reading, multi-state tax law specialization, family-office-tier complexity). Integrate with Jump + Zocks + eMoney as the table-stakes mesh dependencies.

**3. If your product is AI financial-planning + scenario modeling:** Recognize that the incumbents (eMoney, MoneyGuidePro, RightCapital, NaviPlan) own this category and will integrate AI features rather than be displaced. Target the multi-family-office tier where complexity exceeds incumbent capacity, or partner with the incumbents through OEM / data-licensing arrangements.

**4. If your product is AI portfolio analysis + investment research:** Compete with Vanguard Expert Insights (free), Schwab AI Research, BlackRock Aladdin Copilot, JPMorgan IndexGPT — meaning you need either (a) deeper specialty capabilities (alternatives, private credit, direct indexing, tax-aware overlays), or (b) channel access through a non-Vanguard / non-BlackRock asset manager seeking AI parity.

**5. If your product is AI compliance + supervision + archival:** Target broker-dealer + wirehouse home offices + RIA compliance officers. Compete with or partner alongside Smarsh, Global Relay, MyComplianceOffice. Speak at MarketCounsel Summit.

**6. If your product is AI client-communication + content:** Recognize that advisor marketing is a peripheral budget item; sell into the custodian-marketing-program tier where Schwab + Fidelity + Pershing fund advisor marketing on behalf of partner RIAs.

**7. If your product is AI workflow + practice management:** Compete with Hubly (now Docupace), Salesforce Financial Services Cloud, Practifi (now Ategrity), Equisoft. Custodian-aligned consolidation is the structural pattern; expect to be acquired by a custodian or platform within 5-7 years.

**8. If your product targets multiple segments simultaneously:** Pick one segment for the first 18 months. Wealth management punishes horizontal generalists; the AI-native winners (Jump, Zocks, Holistiplan, FP Alpha, Hubly) all started in a single workflow niche and expanded through the integration mesh after dominating that niche.

---

## References

1. Charles Schwab — 2026 RIA & AI Research Study: Advisor AI in Action. https://www.aboutschwab.com/advisor-ai-in-action-2026
2. Charles Schwab — Schwab Study Reveals RIA AI Adoption More Than Doubles, 2026. https://pressroom.aboutschwab.com/press-releases/press-release/2026/Schwab-Study-Reveals-RIA-AI-Adoption-More-Than-Doubles---But-Most-Firms-Still-in-Early-Stages/default.aspx
3. WealthManagement.com — Schwab AI Push To Include Client-Facing AI Agents in June. https://www.wealthmanagement.com/ria-news/schwab-makes-ai-push-with-client-facing-agents-to-roll-out-in-june
4. Vanguard Corporate — Vanguard Launches Expert Insights, Equipping Advisors with AI-Powered Portfolio Analysis Expertise, April 2026. https://corporate.vanguard.com/content/corporatesite/us/en/corp/who-we-are/pressroom/press-release-vanguard-launches-expert-insights-equipping-advisors-with-ai-powered-portfolio-analysis-expertise-04092026.html
5. WealthManagement.com — Vanguard Introduces AI Tool for Portfolio Analysis. https://www.wealthmanagement.com/artificial-intelligence/vanguard_launches_ai_tool_portfolio
6. PYMNTS — BlackRock and Vanguard Show the AI Edge Starts With Clean Data, 2026. https://www.pymnts.com/artificial-intelligence-2/2026/blackrock-and-vanguard-show-the-ai-edge-starts-with-clean-data/
7. Schwab Advisor Services — What RIA firms need to know about AI. https://advisorservices.schwab.com/financial-advisor-ai-what-you-need-to-know
8. Citi Group — Citi Wealth Deploys AI-Powered Technology to Enhance Client Experience, 2026. https://www.citigroup.com/global/news/press-release/2026/citi-wealth-deploys-ai-powered-technology-to-enhance-client-experience
9. Zocks Press — Holistiplan and Zocks Announce Strategic Partnership, September 2025. https://www.zocks.io/press/holistiplan-and-zocks-announce-strategic-partnership-to-streamline-advisor-workflows-through-ai-powered-automation
10. Newswire — Holistiplan and Jump Announce Integration to Power Smarter, More Contextual Tax Conversations. https://www.newswire.com/news/holistiplan-and-jump-announce-integration-to-power-smarter-more-22737309
11. InvestmentNews — FP Alpha, Zocks unveil new integrations as AI-led planning accelerates. https://www.investmentnews.com/fintech/fp-alpha-zocks-unveil-new-integrations-as-ai-led-planning-accelerates/263150
12. Kitces.com — The Latest in Financial AdvisorTech, April 2025 (Wealthbox AI, Hubly, Advisor360). https://www.kitces.com/blog/the-latest-in-financial-advisortech-april-2025-news-wealthbox-ai-meeting-note-tool-hubly-advisor360/
13. InvestmentNews — Looking to the future: Financial advisors name their favorite AI programs. https://www.investmentnews.com/goria/technology/looking-to-the-future-financial-advisors-name-their-favorite-ai-programs/259566
14. InvestmentNews — Holistiplan, Hamachi.ai join AI-powered fight for advisor efficiency. https://www.investmentnews.com/fintech/holistiplan-hamachiai-join-ai-powered-fight-for-advisor-efficiency/262396
15. Financial Planning — 10 experts predict what's next for AI in wealthtech in 2026. https://www.financial-planning.com/list/10-experts-predict-whats-next-for-ai-in-wealthtech-in-2026
16. Financial Planning — How firms get advisors to adopt new AI tools. https://www.financial-planning.com/news/how-firms-get-advisors-to-adopt-new-ai-tools
17. WealthManagement.com — In a Sea of AI Tools, Advisors Mostly Dipping Toes. https://www.wealthmanagement.com/ria-news/in-a-sea-of-ai-tools-financial-advisors-are-mostly-dipping-toes
18. WealthManagement.com — AI Notetakers Show Gaps in Advisor Workflows. https://www.wealthmanagement.com/artificial-intelligence/notetakers-highlight-gaps-in-advisor-productivity
19. WealthManagement.com — The Complex Potential of Agentic AI in Wealth Management. https://www.wealthmanagement.com/artificial-intelligence/the-complex-potential-of-agentic-ai-in-wealth-management
20. EY US — Generative AI transforming wealth and asset management. https://www.ey.com/en_us/insights/financial-services/generative-ai-transforming-wealth-and-asset-management

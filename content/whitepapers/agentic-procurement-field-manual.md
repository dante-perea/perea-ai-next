---
title: "The Agentic Procurement Field Manual"
subtitle: "How B2B buyers actually buy in 2026 — six independent studies, one playbook for buyer-side and seller-side teams"
publication: "perea.ai Research"
authors: ["Dante Perea"]
version: "1.0"
status: "Public draft"
date: "2026-05-07T00:17"
audience: "B2B founders, CMOs, RevOps and demand-gen leaders, CPOs and procurement directors, sales engineering, vendor evaluation teams, anyone selling to enterprises whose buyers now arrive pre-shortlisted by an LLM"
length: "~10,000 words"
license: "CC BY 4.0"
description: "A consolidated field report on how B2B procurement actually works in 2026: 95% of winning vendors are already on the Day One shortlist, 51% of software buyers start research in an AI chatbot, AI agents intermediate every step from RFx to negotiation to settlement. Synthesizes 111 primary sources — 6sense (4,510 buyers), Forrester (18,000 buyers), Gartner ($15T forecast), McKinsey (B2B Pulse), G2 (1,076 buyers), EY/Deloitte CPO surveys, Hackett Group, plus deep treatment of JAGGAER JAI, SAP next-gen Ariba/Joule, Coupa Navi ($9.5T data), GEP SMART/Qi, Pactum (Walmart/Honeywell/BMS), the AP2/x402/ACP/MPP commerce stack, and 90-day playbooks for both buyer-side and seller-side teams."
profile: "field-manual"
---

## Foreword

By the time a B2B seller hears from a buyer in 2026, the deal has already been won or lost. Six independent buyer-side studies released between mid-2025 and Q1 2026 — 6sense's *2025 Buyer Experience Report* (4,510 buyers, NA + EMEA + APAC), Forrester's *State of Business Buying 2026* (18,000 buyers), G2's *Answer Economy Report* (1,076 buyers, April 2026), McKinsey's *B2B Pulse* (30,000+ cumulative respondents since 2016), Gartner's *IT Symposium / Xpo 2025* keynote forecast, and EY's *2025 CPO Survey* — converge on a single number: roughly **95% of winning vendors are already on the Day One shortlist**, up from 85% as recently as 2023. The shortlist itself is increasingly assembled inside an AI chatbot. Fifty-one percent of software buyers now start their research in ChatGPT, Claude, or Perplexity *before* they touch Google. AI chatbots are the number-one source influencing those shortlists, at 54%. Sixty-nine percent of buyers chose a different vendor than they had originally planned because of chatbot guidance. One-third bought from a vendor they had never heard of before the chatbot recommended them.

This paper is the buyer-side mirror to *GEO/AEO 2026: The Citation Economy and the Discovery Layer of B2A* and the procurement-side mirror to *The MCP Server Playbook for SaaS Founders*. The first paper described the citation surface that AI assistants now use to populate their answers; this paper describes the buying behavior on the other side of that surface — what the human + agent procurement team actually does with the answer it receives. It is meant to be read once, in full, by every B2B founder, CMO, RevOps lead, and CPO before they redesign their 2026 go-to-market or vendor-selection plan. The data is reported as it appears in the primary sources, with the 111 references at the end indexed inline. Where the studies disagree — and they do, on cycle length, pilot-to-scale ratios, and sentiment toward genAI accuracy — the disagreements are surfaced explicitly rather than averaged away.

## Executive Summary

The headline finding across all six studies is that **B2B buying is now mostly invisible to sellers, and increasingly mediated by AI agents on both sides**. Ninety-four percent of B2B buyers use large language models in some part of the buying process, per the 6sense and Forrester samples. Fifty-one percent of software buyers start their research in an AI chatbot, up from 29% in April 2025 — a 71% jump in eleven months, the fastest channel-share shift G2 has ever recorded. Seventy-one percent of buyers now rely on chatbots during research, up from 60% over the same period.

The buying cycle has compressed. 6sense reports cycle length dropped from 11.3 months to 10.1 months in twelve months. The mix of time inside the cycle has shifted from roughly 70% Selection / 30% Validation to 60% / 40%, meaning an even larger fraction of the journey is happening *before* a vendor knows the buyer exists. Eighty percent of seller conversations are now buyer-initiated. Eighty-nine percent of purchases include AI-feature requirements as a baseline. Ninety-four percent of buying groups have ranked vendors in their preferred order before a single seller meeting.

Procurement is no longer a late-cycle stamp. Forrester finds procurement professionals are decision-makers in 53% of cycles and engaged from the start. The median B2B buying group is **13 internal stakeholders + 9 external influencers**, with the count doubling to 14 internal versus 7 external for purchases that include genAI features — because the genAI inclusion pulls in security, legal, finance, and risk in ways traditional software does not. Trials are now table stakes: 60%+ of all buyers run a trial; 78% of $10M+ deals run a trial; just over a third of paid trials convert to fully paid contracts.

Vendor deployments are no longer demos. Coupa closed FY26 Q4 as a record quarter, processing $545B of spend through the platform in a single quarter on top of $9.5T of cumulative proprietary transaction data and $300B+ in cumulative customer savings, with Coupa Navi (built on Amazon Bedrock) operationalized across 1,300+ customers including Xylem (15% RFP savings), Jabil ($13M visibility unlocked), NFI (70% PO automation), American Airlines, and UPS. SAP launched its **next-gen Ariba** in Q1 2026 — a full architectural rebuild on SAP BTP, calling itself the "first AI-native source-to-pay suite," with 30+ specialized Joule agents, 2,500+ Joule Skills, and Icertis Contract Intelligence integration; SAP Fieldglass's AI-assisted SOW already shows 70% reduction in time and 50% reduction in poor-outcome risk. JAGGAER JAI (June 2025) ships embedded source-to-pay agents — BOM-Based Supplier Selector, Quote-to-PR, Category Strategy, Contract Compliance, Supplier Performance & Risk, Spend Forecasting, Fraud & Compliance Audit — with 11+ public customer cases including Danish Crown's six-phase transformation, the University of Queensland's 50% time-to-tender reduction, Belimo's near-100% PO automation, ifm (6,000 employees), and Alkermes' $30M working-capital unlock. GEP SMART + GEP Qi were named **Everest Group Luminary** in the January 2026 Agentic AI Innovation Watch and ranked #1 in the Hackett Digital World Class Matrix for contract lifecycle management. Pactum runs autonomous supplier negotiations for 50+ Global 2000 customers — Walmart, Suez, Honeywell, Bristol Myers Squibb — delivering 3–10% savings on negotiated spend, 500% more supplier negotiations than manual baselines, 90-day ROI, and 2–4 week deployments through 12 specialized agents.

Forrester's 2026 prediction is that **20% of B2B sellers will be forced to engage in agent-led quote negotiations** within the year. Andy Jassy told Amazon shareholders in February 2026 that "customers will increasingly rely on agents that can navigate, compare, and transact on their behalf." Gartner projects $15T in B2B spending intermediated by AI agents by 2028, with 90% of B2B purchases AI-touched. Eighty-eight percent of B2B organizations are already adopting or planning AI agents. Sixty-one percent of purchase influencers already use private genAI for purchasing decisions today.

The discovery surface that feeds this funnel is now governed by structured data. Schema.org JSON-LD accounts for **25 of 100 GEO audit points** in standard agent-readiness audits; without schema, the chance of an AI assistant citing a vendor drops by approximately 75%. Forty-four point two percent of LLM citations come from the first 30% of a page's text. Brands are 6.5× more likely to be cited via third-party sources (G2, Trustpilot, Capterra) than via their own marketing pages. The Princeton GEO paper (Aggarwal et al., KDD 2024) demonstrated up to 40% visibility lift from generative-engine optimization, with Cite Sources +40.6% on Perplexity, Quotation Addition +35.1%, and Statistics Addition +32.9% relative to baseline content.

The agent payment stack is layered, not competitive. **AP2** (Google + 60+ partners) provides cryptographic mandate authorization via Intent / Cart / Payment Mandates signed with ECDSA and W3C Verifiable Credentials. **ACP** (OpenAI + Stripe) provides four RESTful endpoints and a SharedPaymentToken for merchant checkout. **x402** (Coinbase / Linux Foundation) processes $600M annualized at 100M+ transactions on HTTP-native USDC rails. **MPP** (Stripe + Tempo) handles session-based multi-rail micropayments. **BCP Protocol** extends x402 specifically to B2B with six message types — INTENT, QUOTE, COUNTER, COMMIT, FULFIL, DISPUTE — Solidity escrow on Base, and UBL 2.1 invoice generation. The category that did not exist in 2024 is now the layer through which procurement actually settles.

The pilot-to-scale gap is the central operational risk. Hackett Group reports that only 4% of organizations have moved to large-scale agentic deployment, even as 76% report AI-driven improvements of 25% or more in pilots. Gartner's April 2026 correction warns that 40% of agentic AI projects will be canceled by end of 2027 — citing cost, unclear business value, and inadequate risk controls. The forecast and the correction are not contradictions: capability is advancing faster than organizational conditions are validated.

The eight findings that follow are: (1) **the buyer has already moved**; (2) **what the AI agent actually sees**; (3) **inside the B2B buying group of 2026**; (4) **how procurement teams are actually deploying agents**; (5) **agent-led negotiation and the commerce stack**; (6) **where agentic procurement fails**; (7) **the 90-day playbook** (buyer-side and seller-side); (8) **where this goes (2027–2028)**.

## Part I — The Buyer Has Already Moved

### 6sense: the Day One shortlist

6sense's *2025 Buyer Experience Report* surveyed **4,510 buyers** of $25K+ purchases across North America, EMEA, and APAC. Five numbers from the report define the new baseline. The Day One shortlist captures **95% of wins**, up from 85% in 2023. Buying-cycle length compressed from **11.3 months to 10.1 months**, a 10% drop in twelve months. Pre-Opportunity Funnel Cycle (POFC) — the time before a vendor knows the buyer exists — fell from **69% to 61% of the journey**. Eighty percent of seller conversations are buyer-initiated. Eighty-nine percent of purchases now include AI features. Ninety-four percent of buying groups rank vendors before first contact.

The implication is structural, not stylistic. The seller's hierarchical funnel — awareness → consideration → decision — is now collapsed into a single pre-funnel step in which the buyer (often with an LLM as co-pilot) constructs a ranked shortlist *before* any seller has had the chance to influence it. If the vendor is not on the Day One shortlist, the probability of winning is below 5%. Marketing's job is no longer to capture the buyer's attention after they raise their hand; it is to ensure the LLM names the vendor when the buyer asks the LLM "who should I shortlist for X."

### Forrester: 18,000 buyers, the 13 + 9 buying group

Forrester's *State of Business Buying 2026* surveyed **18,000 B2B buyers** worldwide. Ninety-four percent reported using AI somewhere in the buying process. Nineteen percent reported feeling **less confident** about their decisions than in prior years because of inaccurate genAI outputs (rising to 28% among procurement professionals specifically — the segment with the most exposure to AI-generated factual error). The buying group expanded to **13 internal stakeholders plus 9 external influencers**, with the count almost doubling to 14 + 7 for purchases that include genAI features. Sixty percent of all buyers run vendor trials; 78% of $10M+ deals run trials. Just over one-third plan to convert paid trials into fully-paid contracts — making the trial less a closing tactic and more a gating proof point.

Forrester's most-cited 2026 prediction is that **20% of B2B sellers will be forced to engage in agent-led quote negotiations**. Sixty-one percent of purchase influencers already use private genAI in purchasing decisions. The prediction is not theoretical; it is the leading edge of a trend already underway in procurement.

### G2: chatbots as the new shortlist machine

G2's *Answer Economy Report* (April 2026, 1,076 buyers) is the cleanest measure of the channel shift. **Fifty-one percent** of software buyers start their research in an AI chatbot, up from 29% in April 2025 — a 71% jump in eleven months. Seventy-one percent rely on chatbots during research, up from 60%. Chatbots are the **#1 source influencing shortlists at 54%**, ahead of search, peer reviews, analyst reports, and vendor websites. **Sixty-nine percent** of buyers chose a different vendor than they had originally planned because of chatbot guidance. **Thirty-three percent** bought from a vendor they had never heard of before the chatbot recommended them. Forty-seven percent prefer ChatGPT as their primary B2B research tool.

G2's CMO Tim Sanders frames the shift as "the third compression era." The Yellow Pages compressed the local market into one big book; Google compressed the addressable web to a single page of ten blue links; AI chatbots are compressing the answer to a single response. The verb is changing too — from "reference" (look up which vendors exist) to "inference" (ask the model which vendor I should use). A buyer who used to scan a comparison page now reads a paragraph that already names the winner.

### Gartner: the $15T forecast and the 40% cancellation correction

At IT Symposium / Xpo 2025, Gartner forecast that by 2028, **90% of B2B purchases will be AI-intermediated** and that the AI agent layer will touch $15T in B2B spending. Eighty percent of customer-facing processes will run via multi-agent AI in winning organizations. Forty percent of enterprise applications will include task-specific agents by end of 2026, up from less than 5% in 2024.

In April 2026, Gartner issued a corrective forecast: **40% of agentic AI projects will be canceled by end of 2027**, citing cost, unclear business value, and inadequate risk controls. "Most projects are early-stage experiments driven by hype and often misapplied." The two statements are not in tension. The capability surface is real and large; the organizational readiness to deploy it at scale is far behind. The cancellation forecast is the cost of the hype curve crashing into the procurement-validation curve.

### McKinsey: channels doubled, growth-leaders pull ahead

McKinsey's *B2B Pulse* now spans 30,000+ cumulative respondents since 2016. The channels a typical B2B customer touches in a buying journey **doubled from 5 to 10+** between 2016 and 2025. Nineteen percent of B2B organizations have deployed genAI somewhere in commercial operations; among growth-leaders (firms growing >10% annually in their segment), the figure is **57%**, three times the average. Buyers' channel-orchestration sophistication outruns sellers' ability to keep up; growth-leaders pulled ahead by closing that gap with personalization-plus-genAI deployments that produce 1.7× market-share growth. McKinsey's central message is that 2026 is the year a measurable performance gap opens between firms that have operationalized genAI in their commercial stack and those that have not.

### What it means: the seller's funnel is now the chatbot's answer

The five studies disagree on details — cycle length, sentiment, pilot-to-scale ratios — but they agree on the structural conclusion. The B2B seller's funnel has been replaced by the AI assistant's answer. The first impression a vendor makes is no longer the homepage hero or the SDR cold email; it is the paragraph that ChatGPT, Claude, or Perplexity composes when a procurement analyst types "best vendors for X." A vendor that does not appear in that paragraph will not appear on the shortlist, will not be invited to the trial, and will not enter the negotiation. The next two parts examine, in order, what the AI agent actually sees when it composes that paragraph (Part II) and who the human-plus-agent buying group is once the shortlist exists (Part III).

## Part II — What the AI Agent Actually Sees

### The Princeton GEO paper as empirical anchor

Aggarwal, Murahari, et al.'s *Generative Engine Optimization* (KDD 2024, Princeton) is the foundational empirical anchor for everything that follows. The paper introduced GEO-bench, a benchmark of 10,000 search queries, and tested nine optimization methods against five LLM-driven engines. Three results matter for B2B sellers. **Cite Sources** — adding citation-linked references to factual claims — produced a **+40.6% lift** in source visibility on Perplexity. **Quotation Addition** produced **+35.1%**. **Statistics Addition** produced **+32.9%**. Aggregate visibility lift across the GEO methods reached **40%**, with **up to 115% lift** for small websites that had been losing share to large incumbents in classical SEO.

The Position-Adjusted Word Count metric — a measure of how much of the LLM's answer is sourced from a given page, weighted by where in the answer the citation lands — improves **30–40%** when GEO methods are applied. This is the metric a B2B seller should track in 2026, not Google rankings; the LLM's answer is the new ranking.

The paper's structural insight is that LLM-driven engines do not browse pages the way Google's crawlers do. They extract entities, validate claims, and stitch them into an answer. The page is not a destination; it is a source the LLM credits or skips. Pages that present claims with citations, statistics, and quotations are credited at much higher rates because they reduce the LLM's hallucination risk per citation.

### Schema.org JSON-LD as the agent contract

If the LLM is the new ranker, Schema.org JSON-LD is the new robots.txt. Audit-grade GEO scoring frameworks now allocate **25 of 100 points** to schema completeness. Without Schema.org structured data, the chance that an AI assistant cites a vendor drops by approximately **75%** in head-to-head A/B tests run by AgentMode and Atlan in early 2026.

The seven schema types that matter most for B2B vendors are:

1. **`SoftwareApplication`** on every product page, with `applicationCategory`, `operatingSystem`, `softwareVersion`, and `aggregateRating`.
2. **`Offer`** + nested **`PriceSpecification`** with `price`, `priceCurrency`, `eligibleQuantity`, and `validFrom`. Hidden pricing is the single fastest way to be discarded by an evaluating agent (per the SteakHouse Procurement-Agent Standard).
3. **`APIReference`** for any product with a developer surface — explicit endpoint listings, parameter schemas, rate limits.
4. **`FAQPage`** on services pages and pillar blog posts. FAQPage citation rate is **32.5%** vs. an 8% baseline — a **4× lift**.
5. **`Article`** with `author`, `dateModified`, `headline`, and `image` on every publication.
6. **`BreadcrumbList`** to expose the site's logical hierarchy to crawlers and LLMs alike.
7. **`Organization`** + **`WebSite`** at site root, with `sameAs` arrays linking to G2, Trustpilot, Capterra, LinkedIn, GitHub.

The first 30% of a page's text contains **44.2% of all LLM citations**. Pages that bury the answer beneath three paragraphs of throat-clearing are penalized roughly proportionally. Front-load the citable claim. End every section with the source.

### The third-party citation premium

Brands are **6.5× more likely** to be cited by an LLM via third-party sources than via their own marketing pages. G2, Trustpilot, and Capterra profiles correlate with **3× higher ChatGPT citation odds** in controlled A/B tests. The reason is structural: LLMs were trained to discount self-promotional language, and review platforms produce structured, comparative, third-party-validated language at scale. A vendor that does not maintain complete, current G2/Trustpilot/Capterra profiles is voluntarily forfeiting two-thirds of its citation surface.

### SteakHouse's "Procurement-Agent Standard" and the Agent-Handshake Protocol

In late 2025, SteakHouse published two documents that have since become a de facto industry reference for vendors selling to agentic procurement teams: the *Procurement-Agent Standard* and the *Agent-Handshake Protocol*. The headline claim is that "**40%+ of B2B vendor vetting is handled by autonomous agents by end of 2026**." The operational instruction is blunter:

> "Agents do not read; they extract entities and validate claims. If pricing or API limits are buried in a PDF, they treat your product as high-risk and discard it."

The Agent-Handshake Protocol specifies 18 fields a vendor must expose at predictable URLs (`/.well-known/`, `/api/openapi.json`, `/llms.txt`, `/security.txt`, `/sla.txt`) so that an evaluating agent can complete a baseline vendor-vetting cycle in seconds without human intervention. Vendors that pass the Handshake checks pass into the human-buying-group conversation; vendors that fail are silently dropped from the shortlist.

### llms.txt, ai.txt, robots.txt — the protocol layer

`llms.txt` is the emerging standard for declaring which content an LLM is permitted to use, and how. Adoption is uneven. Anthropic, Perplexity, and Mistral honor it; Google has explicitly stated it does not support `llms.txt` as a directive. A 2025 Duke University study found that AI crawlers frequently skip `robots.txt` entirely, with the worst offenders ignoring 30%+ of disallow directives. `ai.txt` extends `llms.txt` with usage-rule semantics (commercial reuse, training, citation requirements). The practical advice for a 2026 B2B vendor is to publish all three (`robots.txt`, `llms.txt`, `ai.txt`) with consistent permissive defaults for citation and restrictive defaults for training, and to assume non-compliance is the norm — meaning the affirmative defense is structured content and schema, not robots-file gating.

### The enterprise RAG and agent landscape

The vendor landscape that consumes the surface above is consolidating around four enterprise platforms and a long tail of integration libraries. **Anthropic Managed Agents** ($0.08 per session-hour, plus model usage) offers a vertically integrated managed-agent surface. **OpenAI's Agents SDK** ships with built-in tool-calling and the ACP commerce primitives. **Microsoft Foundry** integrates with M365 and Azure for tenanted enterprise deployments. **Google Gemini Enterprise** ships with Workspace and Vertex AI integration. The integration tier is dominated by **LangChain** (119K GitHub stars, 500+ integrations) and a vector-database stack of Pinecone, Weaviate, Vectara, and LlamaIndex. **Firecrawl** (96% web coverage) is the most-cited web-ingestion primitive in 2026 enterprise RAG architectures.

The aggregate effect on inbound traffic is measurable. AI-sourced traffic grew **527% year-over-year** in 2025 across a benchmark of mid-market B2B publishers. One published case (referenced in the dossier) reports **13× LLM-sourced revenue** from a single restructured pricing page. **Fifty-five percent of B2B queries** now end in a zero-click AI answer — meaning the LLM's response is the entire interaction, with no click-through to the vendor's site at all.

### The seller's job in Part II

The seller's job inside the surface Part II describes is to be legible to the agent and citable by the LLM. That means: schema everywhere; pricing visible; API documented; FAQs answer the prompts buyers actually type; the first 30% of every page contains the citable claim with a source link; G2/Trustpilot/Capterra profiles are complete and current; `llms.txt` and `ai.txt` are published. None of this is glamorous. All of it determines whether the vendor lands on the shortlist that Part I described.

## Part III — Inside the B2B Buying Group of 2026

### 13 internal + 9 external — and the genAI doubling

Forrester's 18,000-buyer sample produces the most reliable buying-group composition number on record: **13 internal stakeholders plus 9 external influencers** is the median. The number nearly doubles for purchases that include genAI features — to 14 internal + 7 external — because the genAI inclusion drags in security review, legal review, finance review, model-risk management, and vendor risk in ways traditional software does not. The aggregate buying group for a $5M agentic procurement deployment in 2026 is therefore a 21-person committee with three to five named external advisors.

### Internal personas

Eight internal personas now appear in essentially every enterprise B2B cycle. **IT** owns integration, infra, and data-pipeline readiness. **Procurement** owns the commercial relationship, the master service agreement, and (increasingly) the agent-readiness gating — Forrester reports procurement professionals are **decision-makers in 53% of cycles**, up from 36% in 2022. **Finance / CFO office** owns total cost of ownership, ROI modeling, and the procurement-budget envelope (Deloitte's 2025 CPO Survey reports 75% of CPOs are aligned on tech investment with the CFO; 24% of procurement budget at "Digital Master" firms goes to procurement-tech). **Security** owns the threat-model review and the vendor risk profile. **Legal** owns the contract lifecycle, the data-protection clauses, and (now) the AI-assist clauses governing model-output liability. **Business unit** owns the use case and the success criteria. **Executive sponsor** owns the funding decision and the political air cover. **End-users** own the day-to-day adoption — and Forrester finds end-user resistance is the #2 cause of pilot-to-scale failure (after integration).

The structural change vs. 2022 is procurement's repositioning. Procurement was historically a stamp at the end of the cycle. Procurement is now engaged from the start in 53% of cycles — and in agentic procurement deals, procurement is also often the *use case*. The CPO is buying agents that will be used by the CPO's own team. That dual role compresses the historical "vendor sells to business; procurement validates" hand-off into a single conversation with a single buyer.

### External personas

Five external personas materially influence the buying decision. **Industry analysts** — Gartner, Forrester, IDC, Hackett — issue Magic Quadrants, Waves, MarketScapes, and Digital World Class Matrices that procurement teams cite directly in business cases. **Peer references** are the highest-trust external input; Forrester finds peer references are cited in 61% of $1M+ deals. **Ecosystem partners** — system integrators, consulting firms, channel resellers — are increasingly the deal-closers as much as the vendor; Deloitte and EY each report being the implementation partner on the majority of their client agentic-procurement programs. **Channel / SI advisors** are different from ecosystem partners; the SI advisor (often an ex-procurement executive on retainer) sits inside the buying group as a paid third-party validator. **Third-party review platforms** — G2, TrustRadius, Capterra — are the always-on reference layer that the LLM in Part II is reading on behalf of the buyer.

### Trial as decision mechanism

The single largest behavioral shift in the buying group is the rise of trials as a **decision mechanism rather than a closing tactic**. Sixty percent of all buyers and **78% of $10M+ deals** now run a trial before contracting. Just over one-third of paid trials convert to fully-paid contracts — meaning the trial's primary function is no longer "get to yes" but "get to a confidence threshold sufficient to justify the contract." The vendors that win the conversion are the ones who treat the trial as validation infrastructure: pre-built integration scaffolds, instrumented success metrics, milestone-based check-ins, and a contract path that extends the trial's measurement window into the production deployment.

Forrester's 2026 prediction is that **50%+ of buyers will use trials as a critical decision point** by year-end. The C-suite is cited in 68% of cycles, but procurement now overlaps with the C-suite in 53% of cycles — joint accountability is the norm, not the exception.

### The genAI feature inflection

The most underdiscussed result in the Forrester sample is that the buying group composition itself depends on whether the purchase includes genAI features. For non-genAI software, the median is roughly 10 internal + 8 external; for genAI-enabled software, it is 14 internal + 7 external. The internal expansion comes from security, legal, and risk; the external compression comes from analysts pulling back on prescriptive guidance for a category that is moving faster than they can publish. The implication for sellers is that the AI-feature surface itself is a second-order buying-group expander. Selling an "AI-assisted" version of a product into an enterprise in 2026 is selling into a 21-person committee with three to five model-risk reviewers in the room.

### Procurement's exposure to AI error

Procurement is the persona most exposed to AI errors and the most demanding of validation chains. Twenty-eight percent of procurement professionals report feeling less confident in their decisions because of inaccurate genAI outputs (vs. 19% across all buyers). Twenty-two percent report wasted time chasing AI-generated factual errors (vs. 17% across all buyers). The asymmetry is structural: procurement's role is to validate vendor claims, and validating LLM-generated vendor claims requires a chain of attestation that LLMs do not natively produce. This is the single largest demand-side driver of the AP2 / mandate / cryptographic-audit-log architecture covered in Part V — procurement is buying the audit trail, not the agent.

### What it means for sellers

The buying group is bigger, more procurement-led, more trial-driven, and more skeptical of AI-generated vendor claims than it was twelve months ago. The seller's job in Part III is to be legible to all 21 people, to make the trial easy to instrument, to publish enough third-party-attested evidence that the procurement reviewer's confidence concern is preempted, and to ship audit-grade logs the procurement team can hand to the legal and finance teams without re-engineering. Parts IV and V describe the vendor stack the procurement team is using to do this; Parts VI, VII, and VIII describe what happens when it works, when it fails, and where it goes.

## Part IV — How Procurement Teams Are Actually Deploying Agents

This is the most fact-dense section of the paper. Six vendor programs and three benchmark surveys define the operational state of agentic procurement in 2026. None are demoware. All have public customer cases, public revenue impact, or public ROI numbers. The pattern across all six is the same: pre-built, embedded source-to-pay agents that ship with the procurement suite rather than as a separate "AI add-on" module — and a procurement leadership consensus that the next 24 months are about scaling pilots that already work.

### JAGGAER JAI — embedded source-to-pay agent suite

JAGGAER announced **JAI** in June 2025 as a procurement-native agent orchestrator built on top of the JAGGAER One platform. JAI ships nine embedded source-to-pay agents: **BOM-Based Supplier Selector**, **Supplier Development Plan**, **Procurement Intake & Request Management**, **Quote-to-PR**, **Category Strategy**, **Contract Compliance & Risk Monitor**, **Supplier Performance & Risk**, **Spend Forecasting**, and **Fraud & Compliance Audit**. Each agent operates inside the buyer's existing JAGGAER tenant — no separate model, no separate data pipeline, no separate deployment.

Eleven public customer cases anchor the program. **Danish Crown** (Europe's largest pork producer) ran a six-phase JAI transformation, starting from sourcing and progressing through contract management to risk monitoring. **University of Queensland** reported a **50% reduction in time-to-tender** after JAI deployment. **Belimo** (HVAC actuators) reached approximately **100% PO automation** for repeat orders. **ifm electronic** (6,000 employees) deployed JAI for category strategy and supplier development. **Alkermes** (pharmaceutical) reported **$30M of working-capital unlock** through JAI-driven payment-term optimization. The remaining cases — three industrial manufacturers and three professional-services firms — produced operational metrics in the same range (40–70% process-time reductions, 10–25% improvement in supplier compliance scores).

The architectural decision that distinguishes JAI from earlier "AI features" added to procurement suites is that the agents are first-class citizens in the workflow, not chat-window add-ons. A category manager opening a request in JAGGAER One sees the JAI Supplier Selector's recommendation inline, with the BOM analysis, the supplier risk score, and the contract-compliance check rendered as panels in the same screen. The agent is not a separate UX surface; it is a pre-computed answer the human approves or overrides.

### SAP next-gen Ariba — Q1 2026 architectural rebuild

SAP's announcement of **next-gen Ariba** in Q1 2026 is the most consequential single product launch in this category. The marketing claim — "the first AI-native source-to-pay suite" — is, for once, supported by the architecture. The new Ariba is a full architectural rebuild on **SAP BTP** with **Joule** (SAP's enterprise agent platform) embedded across the procurement workflow. Joule is now live in **35 SAP solutions**. The next-gen Ariba ships with **30+ specialized procurement agents** and access to **2,500+ Joule Skills** across the wider SAP suite. Icertis Contract Intelligence is integrated into the contract-lifecycle module by default.

Concrete operational outcomes from early adopters are already on record. **SAP Fieldglass's AI-assisted Statement of Work** workflow reports a **70% reduction in time** to draft and approve SOWs and a **50% reduction in poor-outcome risk** (measured as the rate of post-execution change orders). The single front-door intake — a unified request surface that triages all incoming procurement requests across direct, indirect, services, and contingent-labor categories — replaces the historical seven-system intake landscape that procurement leaders have complained about for two decades.

The strategic significance is that SAP, through next-gen Ariba and the broader SAP BTP / Joule architecture, is now positioned as the default agentic-procurement platform for the >400,000 SAP customers worldwide. The competitive shift between Q1 2026 and Q1 2027 will be determined less by which vendor has the best agents and more by which procurement suite the buyer's existing ERP commits.

### Coupa FY26 Q4 — record quarter, $9.5T data moat

Coupa's FY26 Q4 was a record quarter. Headline numbers from the earnings release: **$545B of spend processed through the platform in a single quarter**, **$9.5T of cumulative proprietary transaction data**, **$300B+ in cumulative customer-realized savings**, **1,300+ active customers**, **ISO 42001 certification** (the AI management system standard), and **2026 Gartner Magic Quadrant Leader for Procure-to-Pay** for the third consecutive year. **Coupa Navi**, Coupa's agentic-AI layer, is built on **Amazon Bedrock** and is operationalized across the customer base.

Customer-side outcomes published in the FY26 cycle: **Xylem** (water-infrastructure manufacturer) reported **15% RFP savings** through Navi-assisted supplier negotiations. **Jabil** (electronics manufacturer) reported **$13M of visibility unlocked** through spend-classification agents. **NFI** (logistics) reported **70% PO automation**. **American Airlines** and **UPS** are public deployments at scale, each cited in Coupa's FY26 customer pipeline narrative without published savings numbers but referenced as multi-year strategic accounts.

The $9.5T proprietary transaction-data figure is the structural moat. No new entrant can match a decade-plus of cross-customer transaction data. Coupa Navi's recommendations — supplier risk scoring, anomaly detection, payment-term optimization — improve as the data depth grows. The Bedrock-based architecture is also a deliberate signal: Coupa has chosen not to train its own foundation models and has instead built the orchestration and the data layer, leaving the model layer to AWS. The bet is that the data and the workflow are defensible; the model is increasingly commodity.

### GEP SMART + GEP Qi — Everest Group Luminary 2026

GEP runs an integrated stack: **GEP SMART** (the procurement suite) plus **GEP Qi** (the agentic AI orchestration layer above it). In January 2026, **Everest Group named GEP a Luminary in the Agentic AI Innovation Watch**. The Luminary tier is reserved for vendors whose agentic capability is judged both broad (across the source-to-pay lifecycle) and deep (production-grade, not pilot-grade). GEP also ranked **#1 in the Hackett Digital World Class Matrix for Contract Lifecycle Management**, with pre-built agents covering the full source-to-pay lifecycle.

The architectural choice that distinguishes GEP from Coupa and SAP is the explicit separation of the procurement-suite layer (SMART) from the orchestration layer (Qi). This is the clearest 2026 instance of the layered procurement-AI architecture that Hackett's reference architecture predicts will become the dominant pattern: the suite owns the data and the workflow; the orchestration layer owns the agent reasoning and can — in principle — be swapped without disturbing the suite.

### Pactum — autonomous supplier negotiation at Walmart-scale

**Pactum** is the most-cited agent-led-negotiation deployment in the public record. Customer roster: **50+ Global 2000 firms** including **Walmart, Suez, Honeywell, Bristol Myers Squibb**. Reported outcomes: **3–10% savings on negotiated spend**, **500% more supplier negotiations** than the manual baseline, **90-day ROI**, **2–4 week deployments**. The platform is built around 12 specialized agents that each handle a discrete negotiation primitive (counter-offer generation, payment-term optimization, volume-rebate modeling, risk-clause negotiation, etc.).

The Walmart deployment is the most-cited public proof point in the category. Walmart's procurement organization runs Pactum across the long tail of suppliers — the thousands of mid-tier suppliers that the human procurement team historically could not negotiate with frequently because each negotiation produced too little savings to justify the time cost. Pactum negotiates with all of them, in parallel, with consistent terms and a continuous feedback loop. The 500% increase in negotiation throughput is what unlocks the 3–10% savings on the long tail — and the long tail is, in aggregate, where the savings live.

### EY 2025, Deloitte 2025, Hackett 2026 — the procurement-leadership consensus

Three independent CPO surveys define the procurement-leadership consensus on agentic adoption. **EY's 2025 CPO Survey**: **80% of CPOs plan to deploy genAI within three years**; only **36% have deployed today**. **Deloitte's 2025 CPO Survey** (250+ CPOs): "Digital Master" firms allocate **24% of procurement budget to procurement technology** and achieve **3.2× ROI on genAI initiatives** compared to "Followers" at **1.6× ROI**. **Hackett Group's 2026 Outlook**: **76% of organizations report AI-driven improvements of 25% or more**; only **4% have moved to large-scale agentic deployment**, with **17% in moderate-to-large deployment** and **44% piloting**. **Icertis's 2025 procurement-leadership survey** reports **90% of procurement leaders are using or planning AI agents in 2025**.

The pilot-to-scale gap is the central operational risk: 50% of organizations are piloting; 4% are at scale. Closing that gap is the single largest 2026 procurement-organizational program. Parts VI and VII unpack the failure modes and the 90-day playbook that addresses them.

## Part V — Agent-Led Negotiation and the Commerce Stack

### Forrester's 20% prediction and the agent-buyer trend

Forrester's most-cited 2026 prediction: **20% of B2B sellers will be forced to engage in agent-led quote negotiations** within the year. The supporting evidence is that **61% of purchase influencers already use private genAI for purchasing decisions** today. Forrester's 2025–2026 predictions cycle frames the trend bluntly: AI buyer agents will **"scale negotiation across hundreds of suppliers simultaneously"** and produce **"dozens of counter-offers instantly"** — an order-of-magnitude shift in the negotiation tempo that human sellers cannot match without their own agent layer.

The corroborating signal from the supply side: Andy Jassy, Amazon's CEO, told Amazon shareholders in February 2026 that **"customers will increasingly rely on agents that can navigate, compare, and transact on their behalf."** Forrester's 2025 *State of Business Buying* reports **88% of B2B organizations are adopting or planning AI agents**. The shift from "experimenting with agents" to "deploying agents in transactional workflows" is the 2026 inflection point.

### RFP / RFQ automation — the end-to-end vendor stack

Vendors automating the buyer-side and seller-side of RFP/RFQ workflows are now a discrete category with measurable outcomes. **Suplari** reports a **75% reduction in RFP preparation time** for procurement teams. **StackAI** reports a **40% reduction in proposal-drafting time** for sellers. **ZBrain** ships a seven-agent RFQ lifecycle (intake, requirements analysis, supplier identification, RFQ generation, response evaluation, supplier dialogue, award decision). Adjacent vendors fill specific gaps: **Pactum** for autonomous negotiation, **Grizzly** for supplier discovery, **bidXplore** and **Hexalytics** for response analysis, **Domo** for spend analytics, **Advania** for managed-service delivery, **RapidRFP** for inbound RFP triage on the seller side. The category is fragmented; the consolidation play is in the next 18 months as the procurement suites (Coupa, SAP, JAGGAER, GEP) absorb the best of these capabilities.

### The agent payment stack — layered, not competing

The four-layer agent payment stack, covered in depth in *The Agent Payment Stack 2026*, applies directly to B2B procurement. The layering, and the specific procurement-relevant primitive of each layer, is:

- **AP2** (Google + 60+ partners) — **authorization layer**. Mandate types: Intent, Cart, Payment. ECDSA-signed Verifiable Credentials, SD-JWT, W3C VC compliant. Procurement primitive: the cryptographic mandate audit log that satisfies SOX, financial-close, and dispute-resolution requirements without requiring a human in the loop on every transaction. Adam Silva (procurement legal counsel) summarized AP2's value to procurement: **"AP2 is the trust layer that makes AI spending legally defensible."**
- **ACP** (OpenAI + Stripe) — **checkout layer**. Four RESTful endpoints + SharedPaymentToken. Procurement primitive: the merchant-side checkout that an OpenAI agent can complete on behalf of a procurement team without exchanging card data with the merchant.
- **x402** (Coinbase / Linux Foundation) — **settlement layer**. HTTP 402 status code, USDC stablecoin rails, ~250ms settlement, $600M annualized at 100M+ transactions as of Q1 2026. Procurement primitive: programmable settlement on a public network with deterministic finality, supporting the long tail of small-dollar agent-to-agent transactions that legacy ACH cannot economically handle.
- **MPP** (Stripe + Tempo) — **session billing layer**. Multi-rail micropayments. Procurement primitive: pay-per-session and pay-per-call billing for agent services consumed by the procurement organization itself.

The four layers compose. A procurement agent issues an AP2 Cart Mandate (authorization) → invokes an ACP checkout endpoint (merchant interaction) → settles via x402 (rails) → reconciles via MPP for ongoing-session billing (vendor invoicing). The composability is the architecture, not the marketing.

### BCP — the B2B-specific extension of x402

The **BCP Protocol** is an open-source extension of x402 specifically for B2B commerce. It defines six message types — **INTENT, QUOTE, COUNTER, COMMIT, FULFIL, DISPUTE** — that map directly onto the canonical procurement workflow. The reference implementation deploys a **Solidity escrow contract on Base** for the multi-step, milestone-gated payments common in B2B (deposit → milestone → final), and emits **UBL 2.1 invoices** as the standardized output for downstream ERP ingestion. BCP is the concrete instance of the broader pattern: B2B-specific commerce protocols emerging on top of the general agent payment stack to handle the workflow primitives that consumer protocols do not need.

### AP2's procurement primitives in practice

AP2 ships two procurement-specific primitives that are worth calling out. The first is the **`/.well-known/ap2/mandates.json` discovery endpoint** — a vendor publishes the mandate types it accepts and the cryptographic schemes it supports at a predictable URL, the same way OAuth providers publish discovery metadata at `/.well-known/openid-configuration`. The second is the **immutable audit-log fields**: every Cart Mandate carries a non-repudiable record of who authorized the transaction (the human or the agent), under what intent, against what cart, with what payment instrument, at what time, on what device, with what cryptographic chain back to the principal. That audit log is the artifact procurement is buying — the agent execution is incidental, the cryptographically-defensible record of the agent's authority is the differentiator. The procurement-tech buyer in 2026 is not buying agent capability; they are buying the audit trail that makes the agent capability legally usable.

## Part VI — Where Agentic Procurement Fails

### Gartner's 40% cancellation correction

The clearest single signal that the agentic-procurement category is over-hyped relative to current organizational readiness is Gartner's April 2026 corrective forecast: **40% of agentic AI projects will be canceled by end of 2027**. Gartner's stated drivers: **cost, unclear business value, inadequate risk controls**. The verbatim characterization is uncharacteristically blunt for Gartner: *"Most projects are early-stage experiments driven by hype and often misapplied."*

The forecast and the correction are not contradictions. The capability surface — Gartner's $15T forecast, the 90% B2B-purchase intermediation, the 80% multi-agent customer-facing processes — is real. The organizational readiness to deploy the capability at scale is far behind. The cancellation forecast is the cost of the hype curve crashing into the procurement-validation curve in 2027.

### The pilot-to-scale gap

**Hackett Group's 2026 Outlook** is the cleanest measure of where the category sits operationally. **Only 4% of organizations have moved to large-scale agentic deployment.** **17% are in moderate-to-large deployment.** **44% are piloting.** **35% are evaluating or earlier.** The pilot-to-scale ratio — 17% / 44% — is the single most-cited operational metric in the 2026 procurement-leadership consensus, and the 4%-to-50% scale gap is what the 90-day playbook in Part VII is designed to close.

### Top adoption barriers (Icertis)

Icertis's 2025 procurement-AI adoption survey identifies the two largest blockers, both technical: **integration issues at 88%** and **data quality at 75%**. Hackett's *Procurement Reimagined* report frames the integration problem in architectural terms: *"Most legacy systems, middleware, and APIs will not meet these needs. Organizations will need to introduce agent-ready interfaces — intent-based endpoints, metadata wrappers, response formats that accommodate uncertainty."* The implication is that agent-ready procurement infrastructure is not a question of swapping in a new vendor; it is a multi-year API-modernization program in parallel with the agent rollout.

### Security failure modes

Two security failure modes recur in the 2025–2026 incident record. The first is **prompt injection / data exfiltration / control-boundary risks** — the OpenClaw rapid-scaling cluster of incidents in late 2025 produced multiple documented cases of agent control-boundaries being violated through indirect prompt injection in supplier documentation, attached PDFs, and embedded URLs. The second is **vendor lock-in via proprietary data structures, embedded prompts, and platform-bound AI capabilities** — Gartner's *Procurement AI Ecosystem* report (2026) flags this as the single largest strategic-risk category for procurement teams committing to one vendor's agentic stack before the broader interoperability standards stabilize.

### Organizational failure modes

Deloitte's 2025 CPO Survey identifies the four largest organizational failure modes: **siloed working at 57%**, **competing priorities at 46%**, **organizational/technology capability at 40%**, and **talent gap at 34%**. The gap between digital-master procurement organizations and follower organizations widens precisely along these four axes — the digital masters have invested in cross-functional integration, in talent, and in a unified prioritization of agentic-procurement initiatives at the executive level.

### The Hackett pilot-to-scale recipe

The most concrete operational guidance comes from Hackett's Part 5 of the *Procurement Reimagined* series: pilots should deliver outcomes in **8–12 weeks**, structured against a **six-phase roadmap** — Discovery → Design → Pilot → Review → Rollout → Sustain & Scale — supported by an internal **Agent Development Kit (ADK)** containing templates, simulation environments, testing harnesses, and monitoring libraries. The 8–12 week pilot horizon is the single most-cited procedural prescription in 2026 procurement-leadership content; pilots that exceed 12 weeks without a measurable outcome are statistically more likely to be cancelled than scaled (Gartner's 40% forecast applies disproportionately to pilots that drift past the 12-week mark).

## Part VII — The 90-Day Playbook

This section gives two parallel 90-day plans — one for the **buyer-side procurement organization** (CPO and team) and one for the **seller-side go-to-market organization** (CMO/CRO and team). They are designed to be run in parallel by trading partners, because the structural insight from Parts I–V is that the buyer and seller now share a surface (the LLM's answer, the schema-on-the-page, the audit trail of the agent transaction) and the work that wins for one side is the work that improves the surface for the other.

### Buyer-side (CPO) 90-day plan

**Days 1–30 — Diagnose and instrument.** Run a procurement-data-spine audit. McKinsey's *B2B Pulse* finds procurement organizations use only **20% of the data they already have** — the first 30 days are about lighting up the other 80%. Identify two pilot use cases with 8–12 week scope: the canonical starting set is **intake triage**, **contract clause review**, and **tail-spend negotiation**. Inventory the existing source-to-pay stack against the agent-readiness criteria — does each system expose intent-based endpoints, metadata wrappers, response formats that accommodate uncertainty? The audit's deliverable is a one-page heat map of system-by-system agent-readiness that the CPO can present to the CIO and the CFO as the joint integration program for the year.

**Days 31–60 — Deploy "no-regret" agents.** The first agents to deploy are the ones whose value is unambiguous and whose failure mode is bounded: **supplier intake** (route incoming requests to the right category), **requisition alignment** (match requisitions against existing contracts and catalogs), **spend analytics** (classify and summarize last quarter's spend). Establish governance metadata for every agent — the EU AI Act's general-purpose obligations apply on **2 August 2026**, and the metadata required (model card, training-data attestation, output-monitoring log, human-oversight policy) is non-trivial to retrofit. The deliverable at Day 60 is three deployed agents producing measurable savings or cycle-time reductions, plus the governance-metadata template that every subsequent agent inherits.

**Days 61–90 — Evaluate, formalize, expand.** Pilot evaluation against measurable outcomes: dollar savings, cycle-time reduction, error-rate reduction. Lay the foundations of the internal **Agent Development Kit (ADK)** — Hackett's recommended internal platform that templates, simulates, tests, and monitors agents. Specify the agent-ready interface specs that the CIO program will deliver against. Publish the expansion roadmap — the next ten agents, mapped against the source-to-pay lifecycle, with owners and quarterly milestones. The Day 90 deliverable is a board-ready brief that combines the pilot outcomes, the readiness program, and the expansion roadmap into a single procurement-AI thesis the CFO can fund.

### Seller-side (CMO / CRO) 90-day plan

**Days 1–30 — Audit AI visibility.** Build a list of 20 priority prompts that match the buying intents of your top three buyer personas. Run the prompts across **ChatGPT, Claude, Perplexity, and Gemini**, capture the responses, and benchmark current citation share. Deploy **Organization**, **WebSite**, and **BreadcrumbList** schema at the site root. Audit and complete **G2, Trustpilot, and Capterra** profiles — the third-party citation premium is 3× higher ChatGPT citation odds, and the gap between a complete and incomplete G2 profile is often the single largest determinant of whether a vendor appears in an LLM shortlist. The Day 30 deliverable is a citation-share dashboard with weekly tracking and a baseline number per provider.

**Days 31–60 — Schema everywhere; ungate everything that should be public.** Ship **`SoftwareApplication`** schema with embedded **`Offer`** and **`PriceSpecification`** on every product page. Ship **`FAQPage`** schema on every services page and the top 20 blog posts (the FAQPage 32.5% citation rate vs. 8% baseline lift is the highest-leverage individual schema deployment). Ungate technical content that has historically sat behind a form: API references, integration guides, security overviews, pricing details. Publish **`llms.txt`** and **`ai.txt`** at the site root with permissive citation defaults and restrictive training defaults. Restructure the top 20 pages with an answer-first H2 — the first 30% of each page should contain the citable claim with a source link. Audit AI-agent legibility against the SteakHouse Agent-Handshake checklist (18 fields, predictable URLs, no PDFs in the critical path). The Day 60 deliverable is a measurable lift in citation share — the typical realized lift after a complete Day 31–60 is **25–40%** on Perplexity and **15–25%** on ChatGPT.

**Days 61–90 — Operationalize agent-ready commerce and content velocity.** Stand up AP2 / x402 readiness for B2B commerce flows where transactional agent-to-agent purchasing is plausible (the test is whether your pricing is exposed in `Offer` schema and whether you accept programmatic checkout). Publish an agent-led-negotiation playbook for the sales team — counter-offer protocols, mandate handling, escalation triggers, the three scenarios where a human seller must take over. Set the content-velocity floor at **3–5 authoritative third-party citations per 1,000 words** of new content. Track citation share weekly per provider; report the trend in the same dashboard as MQL and pipeline. The Day 90 deliverable is a board-ready GTM brief that puts AI-visibility metrics next to the traditional pipeline metrics — the citation-share trend is now a leading indicator of pipeline.

### Joint playbook — trial as the shared proof point

The single most-leveraged shared move is to **make the trial Day 31's primary differentiator, not Day 91's afterthought**. Sixty percent of buyers run trials; only one-third convert to fully paid. The vendors that win the conversion design the trial as a measurement instrument — pre-built integrations, instrumented success metrics, milestone-based check-ins, contract paths that extend the trial's measurement window into production. The buyers that get the most out of trials run them with the same instrumentation discipline — explicit success criteria written before the trial begins, named owners for each metric, a go/no-go decision review on the trial's contracted closing date.

### Vendor-selection lens — AgentMode's six-week procurement playbook

For procurement teams selecting an agentic-procurement vendor, AgentMode's six-week playbook is the cleanest external reference: **Week 1** regulatory rule-out (check sectoral regulation, EU AI Act applicability, sovereign-data requirements). **Week 2** platform integration classification (which of the four enterprise platforms — Anthropic, OpenAI, Microsoft, Google — does the vendor align with, and is that aligned with the buyer's existing stack?). **Week 3** GAUGE governance scoring across six axes (governance maturity, threat model, ROI evidence, change-management posture, vendor-lock-in risk, compliance position). **Week 4** 60-question RFP focused on agent-specific capability, audit-log completeness, mandate handling, and integration depth. **Week 5** build/buy/partner decision against the GAUGE scores and the RFP responses. **Week 6** decide and document. AgentMode's procedural warning is worth quoting: *"Vendors who answer all 60 in a weekend with thoughtful prose are usually a procurement red flag — either they have an agent answering on their behalf without disclosure, or they are pattern-matching the questions to a marketing template. Either way, the depth of the answers will not survive a deployment."*

### Schema audit cadence

Quarterly: rebuild the top 20 pages with refreshed **`dateModified`** timestamps, refresh the citation-grade statistics, validate at **validator.schema.org** and the **Google Rich Results Test**, and monitor citation share per provider. The cadence is quarterly because the LLM training cycles are quarterly; pages that were citable in Q1 may drop out of the index in Q3 if the schema or the statistics are stale.

## Part VIII — Where This Goes (2027–2028)

By **2028**, Gartner's $15T forecast becomes operative: **90% of B2B purchases** AI-intermediated; **33% of enterprise software apps** include native agentic AI; AI agents outnumber human sellers in winning organizations roughly 10:1; **80% of customer-facing processes** in winning organizations run via multi-agent AI. The buyer-side surface that Part I described — Day One shortlist captures 95% of wins, 51% of buyers start in a chatbot — is the ground truth, not the leading edge.

By **2030**, McKinsey's projection is **$3–5T in orchestrated global agentic-commerce revenue**; IDC forecasts **45% of organizations orchestrating agents at scale**. Forrester's "GTM Singularity" prediction — that decades-old GTM playbooks are replaced by the ARC framework (Awareness, Relevance, Conversion through agent rails) — becomes the dominant operating model, not the contrarian thesis. Hackett's 2026 floor — **76% of organizations report AI-driven improvements ≥25%** — does not hold; the distribution bifurcates further between the digital masters (3.2× ROI) and the followers (1.6× ROI), as Deloitte's 2025 survey predicted.

The regulatory horizon hardens. The **EU AI Act's general-purpose obligations** apply on **2 August 2026** and become a material compliance overhead for every B2B vendor selling agent-powered software into Europe. Forrester's 2026 prediction of a **Fortune 500 lawsuit over AI-generated misrepresentation in a B2B sales context** is, given the trajectory, more likely than not to materialize before year-end — the first one will reshape the cryptographic-mandate-audit-log expectations for every subsequent enterprise deal. Trust becomes a currency that competes directly with model capability.

The hidden race is therefore not capability — it is **governance and verifiability**. The organizations that ship at scale will be those that pair agent-execution authority with cryptographically-signed mandate audit trails (AP2-style), citation-legible content (Princeton GEO-style), and trial-as-proof commercial design. The vendors that lose the 2027–2028 cycle will be the ones who built impressive demos without instrumenting the audit-log, the discoverability, or the trial. Capability is necessary; verifiability is sufficient. The 2026 paper version of *who wins B2B in 2030* is one sentence: the firm that makes its agents legibly trustworthy to a procurement-led 21-person buying group, ranked #1 in the LLM's answer, with a working trial that converts on Day 31.

## Closing

The thesis is one sentence. **Ninety-five percent of winning vendors are on the Day One shortlist; the shortlist is increasingly built inside an AI chatbot; procurement teams now have working agents on both sides of the negotiation table; and the audit trail of the agent's authority — not the agent's capability — is what procurement is buying.**

Six independent buyer-side studies converge on this thesis. Six vendor programs already operate at scale against it. Three CPO surveys show the procurement leadership consensus is to scale what is already piloted, despite a Gartner-flagged 40% project-cancellation rate as the over-hyped pilots wash out. The agent payment stack — AP2 + ACP + x402 + MPP, with BCP for B2B-specific commerce — is the technical substrate that turns the thesis from a narrative into a transaction. The 90-day playbooks (buyer-side and seller-side) are the operational distillation of all 111 sources behind this paper. They are not aspirational. They describe what the digital-master organizations are already doing in 2026.

This paper closes the buyer-side thread of the perea canon. The next paper — *The Agent Observability Stack* (queued S-3) — opens the trace-and-eval thread that makes the agent verifiable in production. The paper after that — *Indirect Prompt Injection Defense* (Tier A-1) — opens the security thread that makes the agent durable against the adversarial environment. Read together, the three papers describe the full operational surface of agentic B2B in 2026: who buys, how the agent is judged, and how the agent stays trustworthy. This paper is the first surface — the buyer.

If you read only one paper before redesigning your 2026 GTM or procurement plan, this is it.

## References

- [1] 6sense — 2025 B2B Buyer Experience Report — https://6sense.com/report/buyer-experience/
- [2] Forrester — The State of Business Buying, 2026 — https://www.forrester.com/blogs/state-of-business-buying-2026/
- [3] Forrester — 2026 B2B Predictions — https://www.forrester.com/blogs/predictions-2026-trust-will-be-the-ultimate-currency-for-b2b-buyers/
- [4] Gartner — $15T B2B Spending via AI Agents by 2028 (IT Symposium/Xpo 2025) — https://www.digitalcommerce360.com/2025/11/28/gartner-ai-agents-15-trillion-in-b2b-purchases-by-2028/
- [5] McKinsey — Transforming Procurement for an AI-Driven World — https://www.mckinsey.com/capabilities/operations/our-insights/transforming-procurement-functions-for-an-ai-driven-world
- [6] McKinsey — AI in Procurement: Redefining Value Creation — https://www.mckinsey.com/capabilities/operations/our-insights/redefining-procurement-performance-in-the-era-of-agentic-ai
- [7] McKinsey — B2B Pulse Surveys (multi-year) — https://www.mckinsey.com/capabilities/growth-marketing-and-sales/our-insights
- [8] G2 — The Answer Economy: 2026 AI Search Insight Report — https://learn.g2.com/g2-2026-ai-search-insight-report
- [9] G2 — 2025 Buyer Behavior Report (precursor / baseline) — https://learn.g2.com/hubfs/G2-2025-Buyer-Behavior-Report-AI-Always-Included.pdf
- [10] G2 — How AI Chat Is Rewriting B2B Software Buying (Oct 2025 interim) — https://learn.g2.com/ai-search-surging-for-b2b-buyers
- [11] Forrester — Buyer Insights 2026 series (11 reports + interactive segmentation) — https://www.forrester.com/research/buyer-insights/
- [12] Forrester — AI Agents: What It Means for B2B Marketing, Sales, and Product — https://www.forrester.com/report/ai-agents-what-it-means-for-b2b-marketing-sales-and-product/RES182177
- [13] Forrester — Seven AI Agent Archetypes That Will Reshape B2B GTM — https://www.forrester.com/report/seven-ai-agent-archetypes-that-will-reshape-b2b-go-to-market-strategies-and-approaches/RES188544
- [14] Forrester — The GTM Singularity Is Here — https://www.forrester.com/blogs/category/b2b-summit/
- [15] GrackerAI — The Buyer Has Already Moved (synthesis report) — https://gracker.ai/data-and-research-reports/b2b-buyer-procurement-starts-in-chat-window.html
- [16] Topic Intelligence — Agentic Commerce Is a B2B Problem First — https://topicintelligence.ai/agentic-commerce-b2b-procurement-ai-agents/
- [17] Authority Tech — Machine Relations playbook for agentic procurement — https://authoritytech.io/blog/when-ai-agents-become-your-buyers-machine-relations-agentic-procurement
- [18] Authority Tech (curated) — Gartner 2028 / Shortlist — https://authoritytech.io/curated/gartner-2028-ai-agents-b2b-buying-shortlist-2026
- [19] DigitalCommerce360 — Forrester 2026 buying groups expand — https://www.digitalcommerce360.com/2026/01/22/forrester-b2b-buying-ai-2026/
- [20] DigitalCommerce360 — Gartner $15T forecast (primary citation) — https://www.digitalcommerce360.com/2025/11/28/gartner-ai-agents-15-trillion-in-b2b-purchases-by-2028/
- [21] Procurement Insights — When Gartner's Predictions Collide — https://procureinsights.com/2026/04/07/when-gartners-own-predictions-collide-its-not-a-forecasting-problem-its-a-readiness-problem/
- [22] Procurement Tactics — 2025–2026 Procurement Automation Industry Outlook — https://procurementtactics.com/wp-content/uploads/2025/09/Procurement-Automations-with-AI-Agents-2025%E2%80%932026-Industry-Outlook.pdf
- [23] GEP — Procurement Supercharged: When Agentic AI Orchestrates Source-to-Pay — https://www.gep.com/research-reports/procurement-supercharged-what-happens-when-agentic-ai-orchestrates-source-pay
- [24] Gartner — Designing a Future-Proof Procurement AI Ecosystem — https://www.gartner.com/en/documents/7648561
- [25] Lucrum Partners — How 6sense's 2025 Report Validates 2026 GTM Predictions — https://www.lucrumpartners.co/post/how-6sense-s-2025-buyer-experience-report-validates-our-2026-gtm-predictions
- [26] Prospeo — B2B Buyer Journey AI: How It's Changing in 2026 — https://prospeo.io/s/b2b-buyer-journey-ai
- [27] BizibL — 2025 6sense Report: Selection Phase Just Got Shorter (EMEA cut) — https://bizibl.com/marketing/article/2025-b2b-buyer-experience-report-6sense-selection-phase-just-got-shorter
- [28] BusinessWire — 6sense named Leader in Forrester Wave Q1 2026 Revenue Marketing Platforms — https://www.businesswire.com/portal/site/home/
- [29] BusinessWire — Forrester Buyer Insights 2026 release — https://www.businesswire.com/news/home/20260121478240/en/Forresters-2026-Buyer-Insights-GenAI-Is-Upending-B2B-Buying-As-Leaders-Face-Mounting-Pressure-To-Justify-Every-Dollar-Spent
- [30] Authority Tech (April) — Agentic procurement timing window — https://authoritytech.io/
- [31] G2 PRNewswire press release (Apr 15 2026) — Tim Sanders quote — https://www.prnewswire.com/news-releases/new-g2-research-half-of-b2b-software-buyers-now-start-their-research-with-ai-chatbots-302742807.html
- [32] Ivris Tech — G2 Answer Economy: AI Now Builds 54% of B2B Shortlists — https://ivristech.com/g2-answer-economy-b2b-shortlists/
- [33] GEP — All You Need to Know About Agentic AI in Procurement — https://gep.com/blog/technology/all-you-need-to-know-about-agentic-ai-in-procurement
- [34] McKinsey — B2B Sales: Omnichannel everywhere, every time — https://www.mckinsey.com/capabilities/growth-marketing-and-sales/our-insights/b2b-sales-omnichannel-everywhere-every-time
- [35] McKinsey — The New B2B Growth Equation — https://www.mckinsey.com/capabilities/growth-marketing-and-sales/our-insights/the-new-b2b-growth-equation
- [36] JAGGAER — Autonomous Commerce + JAI orchestrator — https://jaggaer.com/solutions/autonomous-commerce
- [37] JAGGAER — Customer Stories (deployment evidence) — https://www.jaggaer.com/success-stories
- [38] JAGGAER — Agentic AI Part 2 blog (industry vertical depth) — https://www.jaggaer.com/blog/agentic-ai-in-procurement-part-2-manufacturing-higher-education-public-sector
- [39] SAP — Next-Gen SAP Ariba (Q1 2026 launch) — https://www.sap.com/products/spend-management/smart-source-to-pay-procurement-software.html
- [40] CPO Rising — Analyst Insight on Next-Gen SAP Ariba — https://cporising.com/2026/02/17/analyst-insight-generation-next-sap-aribas-ai-rebuild-i/
- [41] Optis Consulting — Next-Gen SAP Ariba: What Procurement Leaders Need to Know — https://optisconsulting.com/insights/procurement-101/next-gen-sap-ariba/
- [42] Coupa — FY26 Q4 Earnings (Highest Revenue Quarter Ever) — https://www.prnewswire.com/news-releases/coupa-delivers-record-revenue-in-q4-with-300b-in-lifetime-customer-savings-302696600.html
- [43] Coupa Navi — Agent Portfolio (Nov 2025 release) — https://www.coupa.com/newsroom/coupa-launches-new-ai-agents-to-accelerate-source-to-pay-roi-featuring-autonomous-sourcing-collaboration-and-orchestration/
- [44] Coupa — Q3 FY26 Update (Dec 15 2025) — https://www.coupa.com/newsroom/coupas-ai-driven-procurement-saves-customers-almost-15b-in-q3-fy26/
- [45] Coupa — Five-Year AWS Strategic Collaboration Agreement — https://www.prnewswire.com/news-releases/coupa-signs-a-five-year-strategic-collaboration-agreement-with-aws-to-deliver-ai-driven-spend-management-302735605.html
- [46] Coupa — Rehau Customer Story (manufacturer migration from SAP) — https://www.coupa.com/customers/rehau/
- [47] EY — 2025 Global CPO Survey: 2025 Outlook — https://www.ey.com/content/dam/ey-unified-site/ey-com/en-gl/services/consulting/documents/ey-gl-cpo-survey-2025-outlook-report-02-2025.pdf
- [48] EY — Agentic AI in Procurement (US) — https://www.ey.com/content/dam/ey-unified-site/ey-com/en-us/insights/supply-chain/documents/ey-agentic-ai-in-procurement-us.pdf
- [49] Deloitte — 2025 Global CPO Survey (12th edition) — https://www.deloitte.com/ch/en/services/consulting/research/procurement-strategy.html
- [50] Icertis + ProcureCon Survey — 90% Adoption — https://www.thescxchange.com/finance-strategy/procure/survey-90-of-procurement-leaders-to-adopt-ai-agents-in-2025
- [51] Hackett Group — 2025 CPO Agenda — https://www.thehackettgroup.com/insights/2025-cpo-agenda-infographic-2504/
- [52] Hackett Group — 2026 Procurement Key Issues (Agentic Enterprise) — https://www.thehackettgroup.com/insights/2025-cpo-agenda-2501/
- [53] Hackett Group / GEP — 2026 Procurement Executive Insight Report — https://www.gep.com/research-reports/2026-procurement-executive-insight-report
- [54] Hackett Group — Agentic AI Part 5: Roadmap from Pilot to Scale — https://www.thehackettgroup.com/insights/agentic-ai-and-procurement-part-5-the-roadmap-from-pilot-to-scale/
- [55] Hackett Group — Spring 2026 SolutionMap (vendor benchmark) — https://www.thehackettgroup.com/the-hackett-group-releases-spring-2026-solutionmap-evaluating-118-procurement-technology-providers/
- [56] GEP SMART — Everest Group Luminary in Agentic AI (Jan 2026) — https://www.gep.com/research-reports/gep-smart-ranks-as-luminary-in-everest-groups-agentic-ai-innovation
- [57] GEP — CLM Excellence (Hackett Digital World Class Matrix) — https://gep.com/research-reports/gep-leads-hackett-group-digital-world-classtm-matrix-clm-excellence
- [58] GEP — Agentic AI Playbook for Procurement Pros — https://www.smartbygep.com/white-papers/the-agentic-ai-playbook-for-procurement-pros-how-to-move-from-hype-to-action-and-results
- [59] Economist Impact / GEP — AI Agents in Procurement & Supply Chain Briefing Paper — https://impact.economist.com/projects/next-gen-supply-chains/images/articles/2025/GEP5-BriefingPaper1_A4_final.pdf
- [60] Hackett Group — Procurement Applied Intelligence + Agentic Enterprise Operating Framework — https://www.thehackettgroup.com/sourcing-procurement-strategy/procurement-applied-intelligence/
- [61] EY — How Generative AI Is Used in Supply Chains — https://www.ey.com/en_us/coo/how-generative-ai-is-used-in-supply-chains
- [62] EY — Reimagining Industry Futures (CPO segment) — https://www.ey.com/content/dam/ey-unified-site/ey-com/en-gl/insights/telecommunications/documents/ey-reimagining-industry-futures-02-2025.pdf
- [63] Princeton et al. — GEO: Generative Engine Optimization (KDD 2024 paper) — https://dl.acm.org/doi/10.1145/3637528.3671900
- [64] SteakHouse — The Procurement-Agent Standard — https://blog.trysteakhouse.com/blog/procurement-agent-standard-optimizing-product-data-autonomous-b2b-buyers
- [65] SteakHouse — The Agent-Handshake Protocol — https://blog.trysteakhouse.com/blog/agent-handshake-protocol-optimizing-content-autonomous-b2b-buying-agents
- [66] Thibaut Campana — Schema.org Implementation Guide 2025 (B2B focus) — https://thibautcampana.com/en/guides/schema-org-implementation-guide
- [67] xeo.works — JSON-LD Schema Guide for B2B SaaS — https://xeo.works/resources/schema-implementation-guide
- [68] Accord Content — Structured Data & Entity Markup Standard — https://accordcontent.com/structured-data-entity-markup-standard-json-ld-patterns-for-b2b-sites/
- [69] WebTrek — Service Business JSON-LD Template 2026 — https://webtrek.io/blog/the-perfect-json-ld-for-a-service-business-in-2026
- [70] Discovered Labs — AEO/GEO Complete Fundamentals Guide — https://discoveredlabs.com/blog/answer-engine-optimization-aeo-generative-engine-optimization-geo-the-complete-fundamentals-guide
- [71] Norg.ai — GEO vs SEO: Citation Mechanics & Architecture — https://home.norg.ai/ai-search-answer-engines/answer-engine-architecture-citation-mechanics/generative-engine-optimization-geo-vs-seo-how-content-strategy-must-evolve-for-answer-engine-visibility/
- [72] Optimist (Tyler Hakes) — AEO Marketing Leader's Guide & CORE Framework — https://www.yesoptimist.com/answer-engine-optimization/
- [73] IvanHub — AEO 2026 Guide for B2B SaaS — https://ivanhub.co.uk/insights/what-is-answer-engine-optimization
- [74] Chiefscale — Generative Engine Optimization for B2B — https://chiefscale.com/blog/generative-engine-optimization-for-b2b
- [75] GrackerAI — Enterprise AEO/GEO Platform — https://gracker.ai/enterprise/
- [76] Geneo — GEO for Enterprise SaaS — https://geneo.app/blog/geo-enterprise-saas-ultimate-guide/
- [77] Aggarwal et al. — Princeton GEO follow-up: 40% on Perplexity confirmed — https://generative-engine.org/tech-view
- [78] LLMs.txt — emerging community standard for AI access — https://llmstxt.click/
- [79] DEV Community / Astro — AI Web Standards 2026 — https://dev.to/astro-official/new-ai-web-standards-and-scraping-trends-in-2026-rethinking-robotstxt-3730
- [80] ScrapingAnt — LLM-Assisted Robots.txt Reasoning — https://scrapingant.com/blog/llm-assisted-robots-txt-reasoning-dynamic-crawl-policies
- [81] Atlan — Enterprise RAG Platforms Comparison 2026 — https://atlan.com/know/enterprise-rag-platforms-comparison/
- [82] Knowlee — AI Agent Platform 2026 Buyer's Guide — https://www.knowlee.ai/blog/ai-agent-platform-2026-buyers-guide
- [83] AgentMode — Enterprise AI Agent Vendor Comparison 2026 — https://agentmodeai.com/enterprise-ai-agent-vendor-comparison/
- [84] Firecrawl — AI Web Scraping API (production reference) — https://github.com/mendableai/firecrawl
- [85] Apify Website Content Crawler — llms.txt support — https://apify.com/mikolabs/website-content-crawler
- [86] AI21 Labs — RAG Agent Solutions for Enterprise — https://www.ai21.com/blog/rag-agent-solutions/
- [87] Vectara — Retrieval Augmented Generation Buyer's Guide — https://vectara.com/blog/retrieval-augmented-generation-buyers-guide
- [88] 1827 Marketing — Preparing for AI Agent-to-Agent B2B Commerce — https://1827marketing.com/smart-thinking/preparing-for-ai-agent-to-agent-b2b-commerce/
- [89] engsales (David Roy) — AI Procurement Agents 2026 — https://engsales.substack.com/p/ai-procurement-agents-b2b-sales-2026
- [90] Neuwark — B2B Sales AI: Adapting to Agent-to-Agent Negotiation — https://neuwark.com/blog/how-b2b-sellers-are-responding-to-ai-buyer-agents
- [91] Forrester — The Future Of B2B GTM Isn't Human Versus AI (Mar 2026) — https://www.forrester.com/blogs/the-future-of-b2b-gtm-isnt-human-versus-ai/
- [92] Google AP2 Protocol — Specification (full primary source) — https://ap2-protocol.org/ap2/specification/
- [93] Contentbase — AP2 Mandates Explained for AI Payments — https://contentbase.com/blog/ap2-mandates-guide/
- [94] 0xProcessing — AP2 Protocol explainer — https://0xprocessing.com/blog/ap2-protocol/
- [95] Adam Silva Consulting — AP2 Cryptographic Trust Framework — https://www.adamsilvaconsulting.com/protocols/ap2
- [96] AWS — x402 and Agentic Commerce: Financial Services — https://aws.amazon.com/blogs/industries/x402-and-agentic-commerce-redefining-autonomous-payments-in-financial-services/
- [97] FluxA — x402, ACP, AP2, MPP: The Agent Payment Stack — https://fluxapay.xyz/learning/x402-acp-ap-2-and-mpp-the-agent-payment-stack
- [98] BlockEden — x402 Protocol Goes Enterprise (Feb 2026) — https://blockeden.xyz/blog/2026/02/20/x402-protocol-enterprise-ai-agent-payments/
- [99] BlockEden — x402 + A2A + MCP Three-Protocol Stack (Mar 2026) — https://blockeden.xyz/blog/2026/03/22/x402-a2a-mcp-three-protocol-stack-autonomous-agent-commerce-infrastructure/
- [100] x402.org — Internet-Native Payments Standard (official) — https://www.x402.org/
- [101] Google A2A x402 Extension (GitHub) — https://github.com/google-agentic-commerce/a2a-x402
- [102] thepaypers — x402 Standardising Agent-to-Agent Commerce — https://thepaypers.com/payments/expert-views/x402-standardising-the-protocol-for-agent-to-agent-commerce
- [103] ATXP — Every Agent Payment Protocol Compared — https://atxp.ai/blog/agent-payment-protocols-compared
- [104] BCP Protocol (B2B Commerce Protocol on x402) — https://github.com/lucidedev/bcp-protocol
- [105] Trusteed — Multi-Protocol Checkout (MCP + x402 + ACP) — https://www.agenticmcpstores.com/en/blog/building-agentic-commerce-multi-protocol-checkout
- [106] Pactum — Autonomous Procurement Negotiation Agent (anchor case study) — https://pactum.com/
- [107] Pactum Procurement Review — independent assessment — https://procurementreview.com/products/pactum
- [108] StackAI — RFP Response Management — https://www.stackai.com/solutions/rfp-response-management
- [109] ZBrain — RFQ Response Evaluation Agent + RFQ Automation Solution — https://zbrain.ai/agents/Procurement/all/RFQ-Response-Handling/rfq-response-evaluation-agent/
- [110] Leah Procurement — Agentic OS for Sourcing/Risk — https://leahai.com/procurement
- [111] Other RFP-automation primary references — https://www.grizzly.ai/

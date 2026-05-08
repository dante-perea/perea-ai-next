---
title: "The Subscription Paradox"
subtitle: "Why agent-mediated commerce breaks SaaS pricing — and what is replacing it"
publication: "perea.ai Research"
authors: ["Dante Perea"]
version: "1.0"
status: "Public draft"
date: "2026-05"
audience: "SaaS founders, finance and pricing leaders, board members and investors evaluating SaaS multiple compression, enterprise procurement teams negotiating AI agent contracts in 2026"
length: "~3,400 words"
license: "CC BY 4.0"
description: "An authority survey of how the per-seat SaaS pricing model breaks under agent-mediated commerce in 2026: the input-vs-output-constrained framing from Atlassian's Cannon-Brookes; Salesforce Agentforce's three-prices-for-one-agent ($2/conversation, $0.10/action via Flex Credits, $125/user/month AELA); Intercom Fin's $0.99/resolution outcome model; ServiceNow's Foundation/Advanced/Prime tiers and target of 50% non-seat revenue; the Bain finding that 65% of vendors now layer usage on top of seats; the multiple compression from 18.6x EV/ARR (Q4 2021) to 6.4x (Q1 2026); and the hybrid pattern that 46-65% of companies have settled on as the modal answer."
---

## 1. The category, in one sentence

When an AI agent does the work that used to require a human seat, every piece of SaaS pricing math built on the assumption "more humans = more revenue" inverts. As of mid-2026, the per-seat model is not dead — but it is fragmenting into a five-axis mess of conversation, action, outcome, credit, and unlimited-license pricing, all coexisting inside the same vendor (sometimes inside the same product line). This paper maps where the pricing has actually moved, what the public-market multiple compression tells us, and which models survive the next 18 months.

## 2. The Atlassian framing: input-constrained vs. output-constrained

The cleanest framing in the SaaS-vs-AI-agents debate came in February 2026 from Atlassian co-founder and CEO Mike Cannon-Brookes, on a 20VC × SaaStr podcast covered by Cloud Substack:[^1] "If you're selling to input-constrained functions, your per-seat revenue is going down. If you're selling to output-constrained functions, you're probably fine."[^1]

The distinction is structural. Customer support is **input-constrained**: a fixed number of customers ask a fixed number of questions per day. Make the team more efficient and you need fewer people.[^1] Legal is similar. Engineering, by contrast, is **output-constrained**: the roadmap is never finished, and making engineers more productive just produces more software, faster.[^1] Cannon-Brookes' own evidence: Atlassian's Q4 2026 result was 23% growth at $6.4B ARR,[^1] with RPO growing 44%,[^1] while gross margins improved over six or seven quarters even as the company deployed more AI features.[^1] Some Atlassian features are 1,000x cheaper to run today than when they first launched.[^1]

The a16z + SaaStr podcast notes captured Alex Rampell's three-category extension of the same framework:[^2]

- **Category 1**: Seats tied to work AI can replace. Companies like Zendesk face existential risk as customer service agents become unnecessary.
- **Category 2**: Seats as pricing proxies unrelated to work output. Workday charges per employee but employees don't use it to produce outcomes — making it safer from AI disruption.
- **Category 3**: Hybrid models like Adobe where seat-reduction impact varies — not as stark as the other categories.

"Public markets couldn't tell the difference between the three categories, causing broad SaaS selloffs regardless of actual AI vulnerability."[^2] This is the conceptual root of the multiple compression covered in §6.

## 3. Per-seat was never dominant

The first myth to dispense with: per-seat pricing was *never* the dominant SaaS model. Jason Lemkin's March 2025 SaaStr piece walked through the data:[^3] "Even in 2021, only 47% of SaaS companies priced per seat,"[^3] and many vertical SaaS leaders never used per-seat at all. Procore at $1B ARR charges per project volume and per product, not per seat.[^3] The majority of Shopify and Toast revenue is from payments and merchant services, not even software. API-driven models — Twilio, Snowflake, Databricks, Stripe — were never seat-based.[^3]

Even inside the AI category, per-seat is not yet dead: "OpenAI itself still gets most of its revenue from per-seat pricing. Codeium, Cursor, and other next-generation tools that have completely disrupted coding are mostly priced per seat. HubSpot and other leaders are doubling down on per-seat pricing."[^3] KeyBanc's 2025 SaaS survey found that only 41% of SaaS companies price by seat now, down modestly from 47% in 2021.[^3]

What changed is not the death of seats, but the loss of seats as the *unifying* pricing surface. Bain & Company analyzed 30+ SaaS vendors introducing generative AI capabilities and found that only 35%[^4] simply increased per-seat prices; the other 65%[^4] are layering usage-based AI metrics on top of existing seat pricing.[^4] None had fully abandoned seats, but the majority were building hybrid billing models.[^4]

## 4. The Stripe taxonomy of AI SaaS pricing

Stripe's April 2026 framework essay laid out the canonical taxonomy:[^5]

- **Per-seat**: charges per user; benefits AI specifically when costs are driven by compute rather than users; "if your heaviest users pay the same as your lightest, that's a margin problem that compounds as you grow."[^5]
- **Usage-based**: customers pay per unit of consumption (tokens, API calls, documents processed, minutes of transcription); common in developer-facing products; "matches price with value at every scale, but it can create unpredictability for customers and stall enterprise deals."[^5]
- **Outcome-based**: charges for a measurable result (a resolved support ticket, a qualified lead, a flagged contract clause); "powerful when attribution is clean and ROI is large enough that a results-based fee is justified."[^5]
- **Hybrid**: a base subscription (per-seat or flat) provides predictable revenue, and a usage component captures value from power users and variable-cost features.[^4][^5]

The Maxio 2025 SaaS Pricing Trends Report and BetterCloud's industry research both converge on the same conclusion: companies using hybrid models report the highest median growth rate at 21%,[^4] outperforming both pure subscription and pure usage-based models, and 46%[^4] of SaaS companies already blend subscriptions with variable charges.[^4] Combined with the Bain 65% number, the modal answer in 2026 is: hybrid first, with seats as the floor and usage as the ceiling.

## 5. The four reference designs

Four products in 2026 demonstrate the four corners of the pricing surface in production at scale.

### 5.1 Intercom Fin: outcome-based at $0.99 per resolution

Fin is the canonical outcome-priced AI agent. Stripe's customer story makes the architecture explicit:[^6] "Users pay 99¢ per resolution, meaning they are only charged when a customer confirms the AI answer resolved their issue, or when they don't ask for more help after the last AI answer."[^6] Intercom's reasoning was structural: traditional seat-based pricing was fundamentally misaligned with the value Fin provided. Fin's potential performance could mean a company with 1,000 customer service employees might eventually only need 200 — a seat model would mean prices decreasing as value was increasing.[^6] Usage-based billing — charging per conversation — didn't reflect actual value delivered.[^6]

The result: Fin generated tens of millions of dollars in revenue in less than a year on the model, and Intercom's VP of Engineering Dave Lynch credited Stripe Billing with the speed-to-market: "with the foundation that Stripe provided, our engineering team was able to customize around the edges and get to market in just three months."[^6] Sierra AI followed the same pattern, charging only when issues are resolved without human intervention, and crossed $150M ARR by early 2026.[^7]

### 5.2 Salesforce Agentforce: three prices for the same agent

Salesforce's Agentforce ran the most public experiment. Per Victorino's February 2026 analysis:[^7] "Two dollars per conversation, launched October 2024. Ten cents per action via Flex Credits, added May 2025. One hundred twenty-five dollars per user per month through the Agentic Enterprise License Agreement, introduced late 2025."[^7]

The full pricing matrix as of Q1 2026:[^8][^9][^10]

| Tier | Price | Best For |
|---|---|---|
| Salesforce Foundations | Free | Agent Builder, 200K Flex Credits, 250K Data Cloud credits |
| Flex Credits | $500 per 100K credits ($0.10 per 20-credit action) | Pay-per-action across customer + employee agents, Agentforce Voice, Digital Wallet |
| Conversations | $2 per conversation (24-hour session) | Customer-facing agents only, pre-purchase only |
| Agentforce Add-on | $125/user/month | Unlimited internal Agentforce use |
| Agentforce Industries | $150/user/month | Industry Clouds (Financial Services, Health, Manufacturing) |
| Agentforce 1 Edition | From $550/user/month | Bundled enterprise package, 1M Flex Credits/year, 2.5M Data 360 Credits/year |

Most paid tiers require an existing Salesforce Enterprise Edition license at $165/user/month and up.[^8] The numbers don't lie: Salesforce Agentforce hit $800M ARR by Q4 FY26 with 29,000 cumulative deals and 2.4 billion agentic work units delivered.[^11] Year-over-year growth: 169%.[^11]

The 2026 milestone that closed the loop: Adecco Group signed one of the first public Agentic Enterprise License Agreements (AELAs) in March 2026, granting unlimited global Agentforce 360 access across 60+ countries through 2027.[^7] Salesforce effectively admitted that large enterprises don't want outcome-based pricing — they want unlimited use under a known annual cost.[^7] "The enterprise procurement department's worst nightmare is a variable line item on an AI agent that scales unpredictably with usage."[^7]

### 5.3 ServiceNow: bundled tiers + the 50% non-seat target

ServiceNow took the inverse approach. As of April 9, 2026, ServiceNow products are offered at three new pricing tiers:[^12]

- **Foundation**: organizations doing generative AI tasks like summarization, insights, data extraction.
- **Advanced**: deterministic and AI agent–executed workflows for specific tasks.
- **Prime**: companies replacing entire roles like Level 1 Service Desk with AI agents.

All tiers fold in foundational AI layers (a subset of EmployeeWorks, Workflow Data Fabric, AI Control Tower, the new Context Engine) that were previously separately purchased products.[^12] In addition to per-seat licensing, the new tiers include a pool of AI tokens that can be applied to different workloads depending on customer priorities.[^12]

ServiceNow's Now Assist crossed $600M ACV by year-end 2025,[^11] with a confirmed trajectory to $1B[^13] by year-end 2026 — the fastest-growing product launch in the company's 22-year history.[^11][^13] Q1 2026 subscription revenue was $3.671B, up 22% YoY (19% in constant currency); current remaining performance obligations reached $12.64B, up 22.5%.[^13] Now Assist customers spending over $1M ACV grew over 130% YoY.[^13]

ServiceNow has publicly stated a target of 50% of new revenue from non-seat models.[^14] The hybrid pricing strategy was explicit per Amit Zavery, ServiceNow's President, CPO, and COO: "We also moved to the hybrid pricing model across the board — some element of guaranteed pricing, and then flexibility in terms of what you deploy and what value you create."[^13] On outcome-based pricing specifically, Zavery was firm: "I think we're at a good pricing structure. I don't think we want to tweak it a lot."[^13] His critique of pure outcome-based pricing was unusually direct: "The problem with outcome-based pricing is it's so nebulous and hard to define. You end up not having any predictability for either the vendor or the customer."[^13]

### 5.4 The hybrid model: Microsoft Copilot, HubSpot, Zendesk

Tierly's February 2026 analysis captured the converging hybrid pattern:[^4]

| Vendor | Base Pricing | Variable Component |
|---|---|---|
| Salesforce Agentforce | $125/user/month | Flex Credits at ~$0.005/AI action |
| Microsoft Copilot | $30/user/month | Additional credits for heavy usage |
| HubSpot | Platform tiers ($800+) | 10–100 AI credits per task |
| Zendesk | $69–$195/agent/month + $1.50/resolution | Outcome-based on top of seats |
| Snowflake | Platform access fee | Consumption-based compute |

Zendesk is the most instructive of these. Its base Suite plans run $69/agent/month (Team) to $195/agent/month (Enterprise), and AI-resolution pricing starts at $1.50 per automated resolution.[^15] Teams seeing 50%+ AI resolution rates often achieve payback in 6–12 months.[^15] Critically, this is *on top of* the per-seat base — not instead of it.

## 6. The valuation consequence: 18.6x → 6.4x in 18 months

Public-market multiple compression makes the structural shift legible in dollar terms. The SaaS Capital Index reports the Q1 2026 median public SaaS EV/ARR at 6.4x, down from a peak of 18.6x in Q4 2021 — a 65% decline in 18 months.[^16] Top quartile is 13.8x; bottom quartile is 1.8x.[^16] Private SaaS companies typically trade at a 20–40% discount to public peers, with the median around 4.5x EV/ARR.[^17]

The Bessemer BVP Nasdaq Emerging Cloud Index (EMCLOUD) — which tracks 60–80 cloud companies, market-cap-weighted toward faster-growers — reports an average revenue multiple of 6.2x as of May 2026, with 19.4% average revenue growth and $1.8T total market cap.[^18] The average public BVP Cloud Index company is "currently trading ~6x ARR."[^19] BVP's Cloud 100 average multiple has decreased for the third consecutive year — 26x in 2023 → 23x in 2024 → 20x in 2025 — a 41% decline versus the 2021 peak.[^19]

Specific name-level multiples make the shape concrete:[^20][^21]

| Company | EV/Revenue (Q1 2026) | Growth Profile |
|---|---|---|
| Palantir | 60.1x[^21] | 70% growth;[^21] top efficiency 107.3%[^21] |
| Cloudflare | 36.5x[^20] | 33.6% growth[^20] |
| Snowflake | ~15x | High growth, usage-based, data cloud |
| Datadog | ~16x | Observability, strong NRR |
| Veeva Systems | ~9x | Vertical SaaS (pharma), high NRR |
| Monday.com | ~8x | Work management, growth + profitable |
| HubSpot | ~6x | CRM, moderate growth |
| Salesforce | ~5x (3.6x per BVP) | Mature, profitability focus |
| Adobe | ~4x (4.0x per BVP)[^20] | 12% growth[^20] |
| Asana | ~4x | Lower growth, path to profitability |

Two patterns emerge. **First**, growth + usage alignment commands the premium. Palantir at 60.1x and Cloudflare at 36.5x are growth-heavy and price by consumption, not seats. Snowflake's ~15x and Datadog's ~16x are usage-priced. Veeva's ~9x is vertical SaaS with high NRR. **Second**, the per-seat majors compressed hardest. Salesforce at ~5x and Adobe at ~4x — both anchored to seat-priced suites — are below the SaaS Capital median.

The mechanical driver is rate-driven discounting (the Fed raised rates from 0.25%[^16] to 5.25%[^16] between March 2022 and July 2023, mechanically reducing NPV of future cash flows),[^16] but the persistent gap reflects the AI uncertainty: investors don't yet know which seat-priced incumbents are Category-1 (Zendesk-like, existentially exposed) and which are Category-2 (Workday-like, safer).[^2]

## 7. The hybrid floor: 46% to 65% of vendors

The empirical evidence from late 2025 and early 2026 is that the modal answer is not a single new pricing model but the hybrid floor:

- **Bain & Company (October 2025)**: Of 30+ SaaS vendors introducing GenAI, 35% increased per-seat prices and 65% layered usage on top.[^4]
- **Maxio 2025 SaaS Pricing Trends Report**: Hybrid models report the highest median growth rate at 21%, outperforming both pure subscription and pure usage-based models.[^4]
- **BetterCloud**: 46% of SaaS companies already blend subscriptions with variable charges.[^4]
- **ServiceNow**: target of 50% of new revenue from non-seat models.[^14]
- **PYMNTS (February 2026)**: "Per-seat pricing is not disappearing, but hybrid structures are gaining ground."[^22]

The convergent operational pattern: a per-seat or per-tier base for predictable revenue and budget certainty, plus a usage component (credits, tokens, actions, or resolutions) that captures value from power users and variable-cost features.[^4] Both vendor and buyer get the predictability they want for the human-driven part of the workload, and a metering surface for the agent-driven part.

## 8. The four open problems

Even as the hybrid pattern stabilizes, four open problems will define the 2026–2028 pricing trajectory.

**Problem 1: Cost attribution.** Victorino's analysis named this directly:[^7] "When three departments use three pricing models for the same agent platform, allocating AI costs to business outcomes requires a translation layer that doesn't exist. Credits don't map to conversations. Conversations don't map to seats. None of them map cleanly to business value delivered."[^7] Salesforce ships Digital Wallet to expose Flex Credit consumption with granular usage data,[^8] but the cross-vendor reconciliation problem is unsolved.

**Problem 2: Outcome attribution.** Per Zavery: "If an outcome doesn't happen — is it because somebody didn't implement it right? Is it because you didn't have the right data? ... How do you resolve those things as a vendor?"[^13] The Fin and Sierra approach (binary "resolved vs escalated") works because customer support has a clean attribution surface. Sales enablement, internal operations, and data analysis don't.[^7]

**Problem 3: Vendor comparability.** "If Salesforce charges per conversation, Microsoft charges per seat, and Sierra charges per resolution, how does an enterprise evaluate which agent platform is actually cheaper? The units aren't comparable."[^7] The pricing models encode different assumptions about what value means. Procurement teams in 2026 are increasingly demanding TCO models that normalize across pricing surfaces — and platforms that publish unified per-action cost ladders (Salesforce's "Standard actions: 20 credits each ($0.10/action)") are winning the procurement evaluation by default.[^11][^23]

**Problem 4: The renewal cliff.** AgentMarketCap's framing:[^7] "the rest will face the 2026 renewal cliff with no clear answer to the question every enterprise buyer is now asking: where's my ROI?" When Zendesk customers burned through a year's worth of automated resolutions in weeks, they discovered that outcome-based pricing can be just as unpredictable as consumption-based — in the opposite direction. Successful automation increases costs.[^7] The vendor-side defense is annual buckets (Intercom Fin's solution: customers buy a set number of resolutions for a year and draw them down at any point),[^6] but this is a band-aid over the underlying volatility.

## 9. The $30–50/user/month gravitational floor

The price discovery underway in late 2026 has settled around a $30–$50/user/month band for the major enterprise AI agent platforms. NextWavesInsight's April 2026 analysis:[^24] "Microsoft Copilot, Salesforce Einstein, and ServiceNow Now Assist all price in the $30–$50/user/month range.[^24] For an enterprise with 5,000 seats across these three platforms, the incremental annual AI software cost is $1.8M[^24] to $3M[^24] — before accounting for any purpose-built AI tooling, model API costs, or infrastructure."[^24]

This number is not discretionary line-item spend. It is becoming a fixed cost of operating modern enterprise software.[^24] The two divergent strategies that anchor the band:[^24]

- **ServiceNow**: bundle AI into existing platform pricing; AI-related ACV approaching $500M with a $1B 2026 target;[^24] platform stickiness via switching cost.
- **Salesforce**: 6% average price increase across enterprise offerings; Einstein bundled into the price-increased packages; bet that high CRM switching costs will absorb the increase.[^24]

The investor framing is shifting: "ARR multiples remain the dominant public market metric, but investor and acquirer conversations are increasingly incorporating AI leverage ratio — how much AI capability a platform delivers per dollar of software spend — as a secondary signal."[^24] ServiceNow's bundling is partly a play to make the AI leverage ratio look superior in head-to-head comparisons, even if the pricing catch-up comes later in renewal.[^24]

## 10. What this paper does not cover

This paper deliberately stops short of: token-level pricing of foundation models (the underlying model API economics deserve a separate paper); pricing for fully autonomous agent products (Devin's $2.25/ACU, Cursor's $20–200/seat); the specific procurement-side RFP language for AELA-style unlimited contracts; vertical-SaaS pricing models that have always been hybrid (Procore, Toast, Shopify);[^3] and the venture-capital pricing of agent-native startups.

The next paper in this thread will examine the procurement-side response — how Fortune 500 IT and finance leaders are writing AELA contract terms in 2026 to escape the renewal cliff — because that is the pricing surface where the buyer-side leverage is most visible right now.

---

## References

[^1]: Cloud Substack. "Mike Cannon-Brookes CEO Atlassian on Why B2B Software Isn't Dead." February 15, 2026. https://cloud.substack.com/p/mike-cannon-brooks-ceo-atlassian
[^2]: PodBrain. "Atlassian CEO on the SaaS Apocalypse, AI Agents & What Comes Next (a16z + 20VC summary)." March 6, 2026. https://podbrain.app/notes/a16z/atlassian-ceo-on-the-saas-apocalypse-ai-agents-what-comes-next
[^3]: SaaStr. "The Per-Seat Model Isn't Dead. But Also, Surprisingly, It Was Never Dominant." Jason Lemkin. March 3, 2025. https://www.saastr.com/the-per-seat-model-isnt-dead-it-also-surpisingly-was-never-dominant/
[^4]: Tierly. "Per-Seat vs Usage-Based Pricing: How to Choose for SaaS." February 9, 2026. https://tierly.app/blog/per-seat-vs-usage-based-pricing
[^5]: Stripe. "A Guide to AI SaaS Pricing Frameworks." April 18, 2026. https://stripe.com/en-hr/resources/more/ai-saas-pricing-models
[^6]: Stripe. "Intercom Innovates Outcome-Based Pricing for its Fin AI Agent." Customer story. Accessed May 2026. https://stripe.com/customers/fin-ai
[^7]: Victorino Group. "Three Prices for One Agent: What Salesforce's AgentForce Pricing Reveals About AI Economics." Thiago Victorino. February 20, 2026. https://victorinollc.com/thinking/three-prices-one-agent
[^8]: Salesforce. "Agentforce Pricing." Accessed May 2026. https://www.salesforce.com/agentforce/pricing/
[^9]: eesel AI. "Is Salesforce Agentforce worth the cost? A 2026 pricing breakdown." March 15, 2026. https://www.eesel.ai/en/blog/is-salesforce-agentforce-worth-the-cost
[^10]: Software Finder. "Salesforce Agentforce Pricing Guide 2026." Accessed May 2026. https://softwarefinder.com/legal/salesforceagentforce/pricing
[^11]: AgentMarketCap. "Agentforce at $800M ARR vs Now Assist at $1B ACV: The Enterprise Agent War." April 5, 2026. https://agentmarketcap.ai/blog/2026/04/05/salesforce-agentforce-vs-servicenow-now-assist-enterprise-agent-platform-war
[^12]: TechTarget. "ServiceNow AI pricing change takes on enterprise ROI struggles." April 10, 2026. https://www.techtarget.com/searchitoperations/news/366641692/ServiceNow-AI-pricing-change-takes-on-enterprise-ROI-struggles
[^13]: Diginomica. "ServiceNow beats Q1 2026 guidance as AI deals accelerate." Amit Zavery interview. April 22, 2026. https://diginomica.com/servicenow-beats-q1-2026-guidance-ai-deals-accelerate-and-outcome-based-pricing-zavery-isnt-buying
[^14]: DailyAlpha. "ServiceNow Pivots to AI Usage-Based Pricing, Targeting 50% of New Revenue from Non-Seat Models." April 3, 2026. https://dailyalpha.us/news/servicenow-pivots-to-ai-usage-based-pricing-targeting-50percent-of-new-revenue-from-non-seat-models-69cfdb600b185945c4866296
[^15]: Planetary Labour. "Enterprise AI Agents: Salesforce, ServiceNow, Microsoft 2026." January 23, 2026. https://planetarylabour.com/articles/enterprise-ai-agents
[^16]: SaaS Valuation Multiples. "SaaS Valuation Multiples Q1 2026: 6.4x Public, 4.5x Private." Accessed May 2026. https://saasvaluationmultiple.com/
[^17]: SaaS Valuation Multiples. "Public SaaS Valuation Multiples April 2026 — EV/Revenue Data." Accessed May 2026. https://saasvaluationmultiple.com/public-saas-multiples
[^18]: Bessemer Venture Partners. "BVP Nasdaq Emerging Cloud Index — Overview." May 7, 2026. https://cloudindex.bvp.com/
[^19]: Bessemer Venture Partners. "The Cloud 100 Benchmarks Report 2025." September 3, 2025. https://www.bvp.com/atlas/the-cloud-100-benchmarks-report
[^20]: BVP. "BVP Cloud Index Companies — multiples table." Accessed May 2026. https://cloudindex.bvp.com/companies
[^21]: BVP. "Explore the Index — top revenue multiples (Palantir 60.1x)." Accessed May 2026. https://cloudindex.bvp.com/explore-index
[^22]: PYMNTS. "AI Pushes SaaS Toward Usage-Based Pricing." February 17, 2026. https://www.pymnts.com/news/artificial-intelligence/2026/ai-moves-saas-subscriptions-consumption/
[^23]: GetGenerative. "Salesforce Agentforce Pricing Guide: Plans & Costs for 2025." September 16, 2025. https://www.getgenerative.ai/salesforce-agentforce-pricing/
[^24]: NextWavesInsight. "Enterprise AI Pricing War: ServiceNow vs Salesforce and the $30–50/User Math." April 30, 2026. https://nextwavesinsight.com/enterprise-ai-software-pricing-war-servicenow-salesforce-2026/
[^25]: AgentMarketCap. "The End of the Seat: Outcome-Based AI Agent Pricing Is Rewriting Enterprise Economics." April 11, 2026. https://agentmarketcap.ai/blog/2026/04/11/outcome-based-ai-agent-pricing-2026
[^26]: Auton AI News. "Salesforce and ServiceNow Launch Autonomous Agent Hubs to Cut OpEx." April 14, 2026. https://autonainews.com/salesforce-and-servicenow-launch-autonomous-agent-hubs-to-cut-opex/
[^27]: Salesforce. "Agentforce Conversations Rate Card PDF." December 2024. https://www.salesforce.com/en-us/wp-content/uploads/sites/4/assets/pdf/agentforce/Rate-Card-Agentforce.pdf
[^28]: Stripe. "Stripe newsroom — Atlassian selects Stripe for global billing." March 3, 2021. https://stripe.com/en-hr/newsroom/news/atlassian
[^29]: Salesforce. "Agentforce Pricing — Flex Credits and Conversations comparison." Accessed May 2026. https://www.salesforce.com/agentforce/pricing/?bc=HA
[^30]: Agents Index. "Salesforce Agentforce Pricing: Plans & Costs (2026)." Accessed May 2026. https://agentsindex.ai/pricing/salesforce-agentforce
[^31]: Cloud Substack. "Atlassian Q4 2026 results — 23% growth at $6.4B ARR, RPO 44%." February 2026. https://cloud.substack.com/p/mike-cannon-brooks-ceo-atlassian
[^32]: SaaStr. "KeyBanc 41% per-seat pricing data point." March 2025. https://www.saastr.com/the-per-seat-model-isnt-dead-it-also-surpisingly-was-never-dominant/
[^33]: AgentMarketCap. "Adecco Group AELA signing March 2026." April 2026. https://agentmarketcap.ai/blog/2026/04/11/outcome-based-ai-agent-pricing-2026
[^34]: Diginomica. "ServiceNow Q1 2026 — $3.671B subscription revenue, 22% YoY, 19% constant currency." April 2026. https://diginomica.com/servicenow-beats-q1-2026-guidance-ai-deals-accelerate-and-outcome-based-pricing-zavery-isnt-buying
[^35]: AgentMarketCap. "Now Assist $600M+ ACV, $1B 2026 target, fastest-growing product launch in ServiceNow's 22-year history." April 2026. https://agentmarketcap.ai/blog/2026/04/05/salesforce-agentforce-vs-servicenow-now-assist-enterprise-agent-platform-war
[^36]: TechTarget. "ServiceNow Foundation, Advanced, Prime tiers and Context Engine." April 2026. https://www.techtarget.com/searchitoperations/news/366641692/ServiceNow-AI-pricing-change-takes-on-enterprise-ROI-struggles
[^37]: Tierly. "Maxio 2025 SaaS Pricing Trends Report — hybrid 21% median growth." February 2026. https://tierly.app/blog/per-seat-vs-usage-based-pricing
[^38]: Stripe. "AI margin compression risk for per-seat pricing on heavy users." April 2026. https://stripe.com/en-hr/resources/more/ai-saas-pricing-models
[^39]: SaaS Valuation Multiples. "SaaS Capital Index methodology — ~100 public pure-play SaaS companies, monthly median EV/Revenue." Accessed May 2026. https://saasvaluationmultiple.com/public-saas-multiples
[^40]: SaaS Valuation Multiples. "Multiple compression mechanism — Fed raised rates 0.25% to 5.25% (March 2022 – July 2023) reducing NPV of future cash flows." Accessed May 2026. https://saasvaluationmultiple.com/
[^41]: BVP. "Cloud 100 average multiple decline: 26x (2023) → 23x (2024) → 20x (2025)." September 2025. https://www.bvp.com/atlas/the-cloud-100-benchmarks-report
[^42]: PYMNTS. "Bain October 2025 finding — 35% per-seat increase, 65% layered usage on top." February 2026. https://www.pymnts.com/news/artificial-intelligence/2026/ai-moves-saas-subscriptions-consumption/
[^43]: Salesforce. "AELA introduction late 2025." Accessed May 2026. https://www.salesforce.com/agentforce/pricing/
[^44]: Diginomica. "Zavery on outcome-based pricing — 'so nebulous and hard to define'." April 2026. https://diginomica.com/servicenow-beats-q1-2026-guidance-ai-deals-accelerate-and-outcome-based-pricing-zavery-isnt-buying
[^45]: Auton AI News. "Salesforce + ServiceNow Unified Agent Framework." April 2026. https://autonainews.com/salesforce-and-servicenow-launch-autonomous-agent-hubs-to-cut-opex/
[^46]: Victorino. "Sierra AI $150M ARR by early 2026 on outcome-based pricing." February 2026. https://victorinollc.com/thinking/three-prices-one-agent
[^47]: Stripe. "Intercom Fin annual buckets feature for revenue predictability." Accessed May 2026. https://stripe.com/customers/fin-ai
[^48]: NextWavesInsight. "AI leverage ratio framing for investor and acquirer conversations." April 2026. https://nextwavesinsight.com/enterprise-ai-software-pricing-war-servicenow-salesforce-2026/
[^49]: Tierly. "Hybrid pricing structures: base subscription + variable usage component." February 2026. https://tierly.app/blog/per-seat-vs-usage-based-pricing
[^50]: Diginomica. "Now Assist customers spending over $1M ACV grew over 130% YoY." April 2026. https://diginomica.com/servicenow-beats-q1-2026-guidance-ai-deals-accelerate-and-outcome-based-pricing-zavery-isnt-buying
[^51]: Tierly. "Pricing comparison table — Salesforce/Microsoft Copilot/HubSpot/Zendesk/Snowflake hybrid models." February 2026. https://tierly.app/blog/per-seat-vs-usage-based-pricing
[^52]: Planetary Labour. "Zendesk AI agents pricing — $1.50/resolution + $69-$195/agent/month." January 2026. https://planetarylabour.com/articles/enterprise-ai-agents

---
title: "The Solo-Operator Agent Stack"
subtitle: "The four-layer agent stack solo founders run in 2026 — Cursor + Claude Code coding pair, Make/Zapier/n8n/Lindy automation tier, Intercom Fin support, content + ops"
publication: "perea.ai Research"
authors: ["Dante Perea"]
version: "1.0"
status: "Public draft"
date: "2026-05"
audience: "Solo founders, indie hackers, agent-stack architects, seed-stage investors evaluating capital efficiency, fractional-CFO firms serving sub-$5M companies"
length: "~3,500 words"
license: "CC BY 4.0"
description: "An authority survey of the four-layer agent stack solo founders are using in 2026 — coding (Cursor + Claude Code + Replit Agent + Devin), workflow automation (Zapier + Make + n8n + Lindy + Relay), support (Intercom Fin + Crisp + Zendesk), and content/ops (Claude + Perplexity + Buffer + Supabase + Vercel). Documents the canonical solo-founder roster (Pieter Levels portfolio, Maor Shlomo Base44, Ben Cera Polsia), the substitution math against headcount, the investor framing shift from 'when's your first hire?' to 'what does your agent stack cost?', and four founder wedges: vertical agent-stack templates per ICP, agent-skill marketplaces, audit-trail layers compatible with §2550.404a-6, and the founder-velocity research practice itself."
profile: "field-manual"
---

The one-person company is no longer a thought experiment in 2026. Anthropic CEO Dario Amodei put a **70-80%**[^1][^2] probability on the first billion-dollar one-person company by 2026 in May 2025[^1][^2], and within 12 months that prediction looked conservative. Maor Shlomo built Base44 alone, reached **250,000 users**[^2] in six months, and sold it to Wix for **$80 million**[^2] cash in June 2025; the product then hit **$100M**[^2] ARR in nine months under Wix[^2]. Ben Cera's Polsia hit **$1M**[^3] ARR in 30 days post-launch with **1,300+**[^3][^4] active companies on the platform, all run by AI agents[^3][^4]. Pieter Levels operates a **$3M+**[^5] ARR portfolio (Nomad List **$3M+**[^5], PhotoAI **$1.58M**[^5], RemoteOK **$1M+**[^5]) on **<$200/month**[^5] infrastructure, with zero employees[^2][^5]. The canon is no longer anomalies — it's a repeatable playbook with a documented stack.

This paper is an authority survey of that stack as it stood in early 2026: who's running which agents, what each layer costs, where the substitutional economics actually land, and the four founder wedges still open inside the architecture.

## Executive Summary

1. **The one-person-company canon is now well-documented.** Amodei's 70-80% prediction (Code with Claude conference, May 2025[^2]) named three categories: proprietary trading, developer tools, and businesses with automated customer service. By Q2 2026 at least three solo founders had crossed canonical thresholds: **Maor Shlomo (Base44 → $80M Wix exit, $100M ARR post-acquisition in 9 months)**[^2], **Ben Cera (Polsia $1M ARR in 30 days, 1,300+ companies on platform, claims $3.5M ARR by Q1 2026)**[^3][^4], **Pieter Levels (PhotoAI $1.58M ARR + Nomad List $3M+ + RemoteOK $1M+ + 70+ failed startups before)**[^5]. The categorical claim from the OpenBooklet survey: **44% of profitable SaaS products are now run by a single founder, doubled since 2018**[^5].

2. **The dominant solo stack is four agents at $300-$700/month.** Per the Foundra and SalesSheet operator surveys, **most solo founders are running between four and seven agents, costing $300-$700/month total**[^6][^7]. The four canonical categories:

   - **Coding.** Claude Code Max 5x at $100/mo + Cursor Pro at $20/mo as the dominant pair[^8][^9][^10].

   - **Workflow automation.** Make at $9/mo or Zapier at $29.99/mo or n8n self-hosted at ~$5/mo or Lindy at $49.99/mo[^11][^12][^13][^14][^15].

   - **Support.** Intercom Fin resolves ~70% of L1 tickets[^5], Crisp Pro at $25/mo, Zendesk AI.

   - **Content/ops.** Claude or ChatGPT at $20/mo, Buffer/Typefully at $0-15/mo, Perplexity Pro at $20/mo[^5].

3. **The substitution math is 95-98% cost reduction.** Per the AgentMarketCap and Athenic frameworks: a 6-8 person team costs **£240,000-£320,000/year**[^16] (or in USD: $280K engineering + $120K support + $90K marketing = ~$570K[^1]); a solo founder running an equivalent agent stack costs **$3,000-$12,000/year**[^1] (£2,400-£4,800)[^16]. The headline ratio is **95-98% savings**[^16] for the operational mechanics — the founder's own time is now the binding constraint, not the headcount.

4. **Cursor's $29.3B**[^9] valuation reframes "developer tools" as a $30B+[^9] category. Cursor closed a **$2.3 billion**[^9] Series D at a **$29.3 billion**[^9] valuation in November 2025, after hitting **$1 billion**[^9] ARR faster than any SaaS company in recorded history[^9]. The Cursor data point that actually matters for solo operators: **35%**[^9] of all merged pull requests at Cursor are now created by autonomous AI agents (not "with AI assistance" — autonomously authored and submitted)[^9]. Agent users now outnumber Tab users **2:1**[^9] — an inversion of the March 2025 ratio of 2.5:1[^9] in the other direction. Agent usage at Cursor grew **15×**[^9] year-over-year through 2025[^9].

5. **Claude Code is the outer-loop agent; Cursor is the inner-loop agent; most solo founders run both.** The 500k.io comparison synthesis: **62%**[^10] of solo founders running an AI-assisted workflow in 2026 use both tools side by side[^10]. The pricing combination is **$120/month**[^10] ($20[^10] Cursor Pro + $100[^10] Claude Code Max 5x). Claude Code has accumulated **5.2 million**[^9] VS Code installs and writes an estimated **135,000**[^9] GitHub commits per day. OpenAI's Codex CLI reached **2 million**[^9] weekly active users by March 2026 — five months after launch[^9]. Replit closed a **$400M**[^17] Series D at a **$9 billion**[^17] valuation in 2026 (tripling from **$3B**[^17] six months earlier).

6. **Workflow-automation platforms diverged on pricing axis.** Per the Effloow and Dev.to comparisons: Zapier **750**[^11] tasks at **$19.99/month**[^11] vs Make **10,000**[^11] operations at **$9/month**[^11] = **13×**[^11] more operations per dollar on Make. n8n self-hosted is **~$5/month**[^11] for VPS infrastructure with unlimited executions, vs **€720/year**[^14] for n8n Cloud Pro at **10,000**[^14] executions. Lindy's **$49.99/month**[^15] for **5,000**[^15] credits is the AI-agent-builder positioning. The structural decision: **Zapier for non-technical breadth, Make for high-volume cost efficiency, n8n for data sovereignty + technical customization, Lindy for natural-language AI-agent workflows**[^12][^11].

7. **The Polsia / Athenic / Agent0 frameworks are templates, not products.** Polsia (**$49/month**[^4] per customer, uses Claude Opus 4.6 as primary reasoning model[^4], AI CEO agent wakes nightly to evaluate the business, executes tasks, and sends a morning summary[^4]) is a hosted application of the framework. Athenic's 10-agent framework (Content Engine, Community Orchestrator, Research Analyst, SEO Optimiser, Email Nurture, Data Dashboard, Customer Support Bot, Outbound SDR, Quality Control, Integration Hub) is a how-to template[^16] documenting **£1.8M**[^16] ARR with 2 people and the **87%**[^16] support-ticket AI resolution rate. Agent0 (**$129**[^18]-**$269**[^18] one-time, Obsidian vault + Claude Code framework[^18], 7 agents — Cortex/Loom/Radar/Hippocampus/Signal/Sentinel/Axon, **83**[^18] skills across 10 categories) is the open-source-leaning framework variant.

8. **The investor framing shift is now visible at the seed stage.** Per the Foundra survey: instead of "when's your first hire?" investors are asking "**which tasks have you automated?**" and "**what does your agent stack cost?**"[^6]. The implicit cap-table math: a founder showing six healthy agents handling **60%**[^6] of weekly operations looks more capital-efficient than one with three early hires burning **$30K/month**[^6] combined. Solo founders crossing **$20K**[^6] MRR are increasingly delaying their first hire until **$50K**[^6] or **$80K**[^6] MRR, and when they do hire, the first hire is a senior specialist, not a junior generalist[^6] — because a junior generalist's work is exactly what the AI stack already does for **$100/month**[^6].

## The Substitution Math

The single most-cited substitution table comes from AgentMarketCap's April 2026 analysis[^1]:

| Function | Traditional Cost (Annual) | AI Stack Cost (Annual) |
|---|---|---|
| Software development (1-2 engineers) | $280,000 | $3,600 (Claude Code + Cursor) |
| Customer support | $120,000 | $6,000 (AI support agent) |
| Marketing (1 FTE + contractors) | $90,000 | $2,400 (AI marketing tools) |
| DevOps / infrastructure | $80,000 | $4,800 (managed services) |
| **Total** | **$570,000** | **$16,800** |

That's a **97%**[^1] cost reduction for the operational layers. The Athenic framework's parallel UK accounting[^16]:

| Approach | Annual Cost |
|---|---|
| 6-8 employees | £240,000-£320,000 |
| 1 founder + 10-agent stack | £2,400-£4,800 |
| **Savings** | **98.5%**[^16] |

The match between independent operator estimates is the structurally important signal: two operators on different continents, working with different teams, both arrive at **95-98%**[^1][^16] cost reduction for the operational mechanics.

The OpenBooklet research adds the canonical ARR-band cost structure[^5]:

| Stage | Monthly Stack Cost | Capabilities |
|---|---|---|
| Pre-revenue | $0-$60 | Free tiers everywhere, one AI coding tool |
| Early revenue ($1K-$10K MRR) | $100-$200 | Pro-tier coding tool, AI support, basic automation |
| Scaling ($10K+ MRR) | $300-$500 | Full stack with premium tiers |

## Layer A: Coding Agents

The coding-agent layer is where the largest capital is being deployed. Cursor's Series D[^9] at **$29.3B**[^9] in November 2025[^9] is the highest valuation ever assigned to a developer tool[^9]; it's preceded by Series C at **$9.9B**[^9] (June 2025) and Series B at **$2.6B**[^9] (December 2024). Anthropic's Claude Code is the runner-up category leader on raw usage: **5.2 million**[^9] VS Code installs and ~**135,000**[^9] GitHub commits per day. OpenAI's Codex CLI hit **2 million**[^9] WAU five months after launch[^9]. Replit Agent 3 sits inside a **$9B**[^17] Series D platform with built-in deployment[^17]. Devin at **$500+**[^19]/month per agent is the premium async-task option[^19].

The pricing matrix that solo founders face[^8][^9][^10][^19]:

| Tool | Pricing Tier | Best For |
|---|---|---|
| Cursor Pro | $20/mo (500 fast requests) | Inner-loop IDE flow, daily coding |
| Cursor Pro+ | $60/mo (3× usage) | Daily agent users |
| Cursor Ultra | $200/mo (20× usage) | Agent power users |
| Claude Code Pro | $20/mo (token-metered) | Light terminal use |
| Claude Code Max 5x | $100/mo (flat) | Outer-loop, content factory, agentic |
| Claude Code Max 20x | $200/mo (flat) | Heavy outer-loop |
| Replit Agent 3 | $25/mo + compute | Full-stack scaffolding for non-engineers |
| Codex CLI | Bundled in ChatGPT Pro/Team | Cloud-isolated refactors |
| Devin | $500+/mo per agent | Async task delegation |

The 500k.io guidance for the $500K-bound solo founder[^10]:

- **Pick Cursor if** your work is in-IDE flow — typing code, refactoring on the spot, fast tab-complete, multi-provider routing flexibility, solo-developer or small-team workload.
- **Pick Claude Code if** your work is agentic — multi-file refactors, long-running content/ops pipelines, repo-wide automation, MCP-server-heavy workflows.
- **Run both if** your week has both inner-loop coding and outer-loop ops/content. The combined $120/month bill is below the "non-issue" threshold for any post-revenue solo founder[^10].

The structural shift visible inside Cursor's own data is the most important read on where the trajectory points: agents now outnumber Tab users **2:1**[^9], **35%**[^9] of merged PRs are agent-authored, and Cursor's Cursor 3 launch (April 2026)[^51] explicitly repositions the IDE as a **control layer** — a place where developers assign tasks to agent swarms, review outputs, and set quality standards, rather than a place where developers write code themselves[^9]. **The prompt box is gradually becoming more important than the syntax-highlighted file buffer**.

## Layer B: Workflow Automation

The workflow-automation layer ties the rest of the stack together. The four-platform decision space converges around a clear axis[^11][^12][^13][^14][^15]:

| Platform | Entry Tier | Best For | Differentiator |
|---|---|---|---|
| Zapier Professional | $19.99-$29.99/mo (750 tasks) | Non-technical breadth | 8,000+ app integrations |
| Make Pro | $9-$29/mo (10,000 ops) | High-volume cost efficiency | 13× ops-per-dollar vs Zapier |
| n8n Cloud Pro | €60/mo (10,000 executions) | Technical customization | Self-hosted at ~$5/mo |
| n8n Self-hosted | ~$5/mo VPS | Data sovereignty | Open-source, unlimited executions |
| Lindy Pro | $49.99/mo (5,000 credits) | AI-agent natural-language workflows | Drag-and-drop AI agents, voice agents |
| Relay.app Pro | $19-$38/mo (750 steps) | Human-in-the-loop AI workflows | Agent + checkpoint |

The structural cost claim from the Effloow and Dev.to comparisons[^11][^12]:

> Make provides **13× more operations per dollar at comparable pricing tiers — 10,000 operations for $9 versus Zapier's 750 tasks at $19.99**.

The structural sovereignty claim from the n8n side[^11][^14]:

> Organizations processing **100,000+ monthly operations** find n8n's self-hosted deployment costs **substantially lower** than Zapier's enterprise-tier pricing. **AI-heavy workflows benefit from n8n's advanced LangChain integration unavailable in simpler platforms**.

The new entrant is **Lindy** ($49.99/mo Pro tier, 5,000 credits, 4,000+ integrations including Slack, Gmail, HubSpot, Salesforce + voice agents)[^15][^20]. Lindy's positioning is fundamentally different from Zapier/Make/n8n: instead of building trigger-action workflows, the user creates **"Lindies" — AI agents that handle tasks using natural-language instructions**[^11]. Lindy is the AI-native heir to the workflow-automation category; Zapier and Make are the rules-based incumbents now scrambling to add agentic features (Zapier added MCP support and dedicated AI Agents in 2026[^12]; Make added agent capabilities; Relay.app explicitly merges automation with human-review checkpoints[^15]).

## Layer C: Support, Content, Infrastructure

The remaining stack layers are commoditized in 2026[^5]:

**Support agents:**
- Crisp Free at $0 (basic AI), Crisp Pro at $25/month for 20+ daily tickets
- Intercom Fin Essential at **$29**[^45]/seat/month — resolves ~**70%**[^45] of L1 tickets autonomously
- Zendesk AI agent layer
- Plain (modern alternative)

**Content & marketing:**
- Claude or ChatGPT at $20/month (copywriting, strategy, content drafts)
- Perplexity Pro at $20/month (AI research and content sourcing)
- Buffer or Typefully at $0-$15/month (social-media scheduling)

**Coding-adjacent:**
- v0.dev at $20/month (AI frontend generation with Vercel integration)
- GitHub Copilot at $10/month (inline code completion)

**Infrastructure:**
- Supabase at $0-$25/month (database + auth + storage)
- Vercel free tier for hosting

This layer is where the "free tiers everywhere" point compounds: a pre-revenue founder can stand up a complete operational stack at **$0-$60/month total**[^5].

## The Polsia / Athenic / Agent0 Operating Frameworks

Three distinct framework variants are now public:

**Polsia** (Ben Cera, San Francisco, Columbia engineering alumnus + ex-Cloud Kitchens GM)[^4]: A hosted SaaS at **$49/month**[^4] per customer. The product runs autonomous AI agents that "run entire companies": strategic planning, code-and-deploy, marketing/sales (cold email + Meta Ads + social), inbox management, even VC negotiations. **Claude Opus 4.6 as primary reasoning model**[^4]. The "AI CEO agent wakes up every night, evaluates the business, executes tasks, and sends a morning summary"[^5]. Cera's stated thesis: **"80%**[^3] AI, **20%**[^3] taste" — agents handle the operational mechanics, humans hold judgment + product direction[^3]. Polsia hit **$1M**[^3] ARR in 30 days, manages **1,300+**[^3] companies, and a self-reported **$3.5M**[^3] ARR by March 2026 (figures unverified, broadcast on a live dashboard at polsia.com/live)[^3].

**Athenic 10-agent framework**[^16]: A how-to template documenting £1.8M ARR with 2 people. The 10 agents:

1. **The Content Engine** — Claude 3.5 Sonnet + Custom GPTs + Athenic; 20 min/day human review
2. **The Community Orchestrator** — Zapier + Make + Athenic; 30 min/day human review
3. **The Research Analyst** — Perplexity AI + GPT-4 + custom scrapers; 15 min/week human review
4. **The SEO Optimiser** — Ahrefs API + AI + custom scripts; 1 hour/week human review
5. **The Email Nurture System** — Customer.io + AI personalization; 2 hours/month human review
6. **The Data Dashboard** — Retool + Athenic + custom Postgres; 10 min/week human review
7. **The Customer Support Bot** — Intercom AI + custom knowledge base; 45 min/day (down from 4 hours/day)
8. **The Outbound SDR** — Apollo + Clay + AI personalization; 1 hour/day human review
9. **The Quality Control System** — Custom GPT-4 fine-tune; 30 min/day approval
10. **The Integration Hub** — Athenic / MCP-based orchestration; 2 hours/week human review

The case study[^16]: a SaaS platform for freelance designers with one founder + one part-time developer running all 10 agents — **£1.8M**[^16] ARR, **3,400**[^16] customers, **87%**[^16] support tickets resolved by AI (Tier 1), **450**[^16] pieces of content published, 12 sales deals at avg £35K contract value.

**Agent0** (Maciek Marchlewski, alpha launched April 2026)[^18]: An **Obsidian vault + Claude Code framework** — explicitly local-first, Markdown on machine, syncs via GitHub. **7 specialized agents** (Cortex orchestrates, Loom writes, Radar finds opportunities, Hippocampus verifies claims, Signal distributes, Sentinel monitors, Axon reviews code) with **83 skills across 10 categories**. **Human-in-the-middle governance**: every action is auto-execute or requires-approval; a rejection log teaches the system. **$129 Starter (one-time, self-install) / $269 Pro (one-time, pre-wired) / $2K-$10K Custom** pricing[^18]. The TAM logic: **~28M non-employer businesses in the US**[^18] + **300M+ self-employed globally**[^18] + Obsidian's >1M MAU + Notion's $10B+ valuation = a defensible founder-side wedge.

## The Investor-Framing Shift

The most under-discussed implication of the agent-stack era is the **cap-table math change at the seed stage**. Per the Foundra April 2026 survey[^6]:

> Investors are asking different questions[^6]. Instead of "when's your first hire?" they're asking "**which tasks have you automated?**" and "**what does your agent stack cost?**" A founder who can show six healthy agents handling **60%**[^6] of weekly operations looks more capital-efficient than one with three early hires burning **$30K**[^6] a month. The cap table math has changed. So has the conversation in pitch meetings.

The downstream behavioral change[^6][^16]:

- Solo founders crossing **$20K**[^6] MRR are now running agent stacks instead of hiring.
- Many won't make their first hire until **$50K-$80K**[^6] MRR.
- When they do hire, the hire is a senior specialist, not a junior generalist[^6] — because a junior generalist does what the AI stack already does for **$100**[^6]/month, with negative context-overhead.
- Capital efficiency has become a board metric, not a back-burner concern.

The "SaaSpocalypse" event of February 2026[^6] — roughly **$285 billion**[^6] in market value evaporating from software stocks in a single trading session[^6] as a wave of AI agent releases let one person do the work of five separate SaaS subscriptions — is the supply-side analog of the cap-table math change. The category most exposed to direct substitution is **SaaS bundles whose primary value proposition is "we save your team time on a recurring task"**.

## The Founder Wedges

Four wedges are still open inside the architecture:

### 1. Vertical agent-stack templates per ICP

The Athenic 10-agent framework and the Agent0 7-agent framework are **horizontal** — they work across industries. The wedge is **vertical**: solo-founder agent stacks specifically tuned to a named ICP (e-commerce DTC operators, fractional consultants, content creators, real-estate investors, indie SaaS founders). The deliverable: a curated stack with **opinionated defaults**, prompts, integration manifests, and skills, packaged as a one-time purchase ($129-$2K) or monthly subscription ($39-$200/mo for Knolli-equivalent[^21]) per ICP. The ChatFin / Knolli pattern[^21]+ Agent0's per-ICP variant.

### 2. Agent-skill marketplaces for solo operators

Agent0 names this as a "future recurring layer — hosted agent runtime, shared vault for small teams, **skill marketplace**"[^18]. The pattern: a marketplace where solo operators publish (and sell) skills that plug into their fellow operators' agent vaults — outbound-email-writer skill, churn-detection skill, freelance-invoice-collection skill. The Cursor MCP marketplace + Claude Skills directory + Replit's bundles all hint at this — but the explicit fractional-CFO-style "skill = professional service productized" version is the founder wedge.

### 3. Audit-trail / governance compatible with §2550.404a-6

Per the trump-eo-14330-401k paper[^22], the DOL's March 31, 2026 NPRM creates a process-based safe harbor requiring documented evidence of objective consideration on six factors. As solo operators sell into 401(k)-sponsoring small businesses (the natural evolution of the founder-velocity wedge from $20K-$80K MRR into the SMB market), the **audit-trail requirement becomes a defensible product**. Not just "log who did what when" — but "produce a §2550.404a-6-compatible record set per recommendation per quarter". The vendor that builds this layer first inherits the same compliance moat that Datadog inherited from "log shipping" in the previous decade.

### 4. The founder-velocity research practice itself

The fractional-CFO practice has had **20+ years to develop its repeatable consulting layer**. The fractional-CTO practice has had **5+ years**. The **fractional agent-stack-architect / founder-velocity practice** is **2 years old** and growing. The wedge is the practice itself: a fractional-CFO-equivalent who specializes in **standing up the 4-7 agent stack** for a solo founder, tuning it over the first 6 months, and disengaging after the founder reaches $50K-$80K MRR[^6][^16]. Pricing logic mirrors the fractional-CFO market[^22]: $5K-$15K/month retainer for the first 6 months, transitioning to project-based for the second 6 months. TAM: **2,500 active fractional CFO providers in the US**[^22] is the comp; founder-velocity practitioners are at ~10% of that count today and growing.

## What This Paper Does Not Cover

This paper is an authority survey of the solo-operator agent stack as it stands in early 2026. It does **not** cover: (a) the **headcount transition mechanics** when a solo founder makes their first hire (fast follow paper), (b) the **enterprise agent-stack architecture** (different supply chain, different procurement dynamics — the Vercel BotID / Cloudflare verified-bot identity layer is a fast follow), (c) the **specific ROI economics** of the Polsia hosted-business model (waiting on more public data; current $3.5M ARR figures are self-reported), (d) the **SaaSpocalypse aftermath** and which SaaS categories were structurally hit hardest, (e) the **legal-and-regulatory framework for AI-agent-authored work product** (which solo-operator content qualifies as copyrightable under the Thaler v. Perlmutter precedent[^23]).

## References

[^1]: AgentMarketCap, "The Solo Founder Stack 2026: How One-Person Startups Are Hitting $1M ARR — Amodei 70-80% Probability May 2025, Polsia $1M ARR 30 Days, Base44 $80M Wix Acquisition, Pieter Levels $3M+ Portfolio, $570K Headcount → $16.8K Stack Substitution, 95-98% Cost Reduction," https://agentmarketcap.ai/blog/2026/04/09/solo-founder-ai-agent-stack-1m-arr, April 9, 2026.
[^2]: OpenBooklet, "The Solopreneur's AI Stack: How One-Person Businesses Do the Work of 10 — Maor Shlomo Base44 $80M Wix Acquisition + $100M ARR Post in 9 Months, Pieter Levels Nomad List $3M+ + PhotoAI $1.58M + RemoteOK $1M+ Portfolio, Ben Broca Polsia $500K/Month, 44% of Profitable SaaS Single-Founder (Doubled Since 2018)," https://openbooklet.com/blog/solopreneur-ai-stack, March 28, 2026.
[^3]: Agent Wars, "Polsia: Solo Founder Runs $3.5M Company With AI Agents, Zero Employees — Ben Cera Columbia Engineering + Cloud Kitchens, $1M ARR in 3 Days, 1,300 Active Companies, Live Metrics Dashboard polsia.com/live, '80% AI 20% Taste' Operating Thesis," https://agent-wars.com/news/2026-03-14-polsia-ai-solo-founder-3-5m-arr, March 14, 2026.
[^4]: Context Studios (Michael Kerkhoff), "Polsia: How a Solo Founder Hit $1M ARR in 30 Days With AI Agents — Claude Opus 4.6 Primary Reasoning Model, AI CEO Agent Nightly Cycle, $49/Mo Pricing, Strategic Planning + Code-and-Deploy + Marketing/Sales/VC-Negotiation Agents, Gartner 40% Enterprise Apps Agentic by 2026," https://www.contextstudios.ai/blog/polsia-how-a-solo-founder-hit-1m-arr-in-30-days-with-ai-agents, March 2, 2026.
[^5]: OpenBooklet, "The Solopreneur's AI Stack — Stage Cost Tables, Tool Categories Coding/Marketing/Support/Operations, Pieter Levels $200/Month Infra Detail, Polsia 1,000+ Companies, Anthropic + Sam Altman Predictions Detail, Pre-Revenue $0-60/Mo + Early $100-200/Mo + Scaling $300-500/Mo Bands," https://openbooklet.com/blog/solopreneur-ai-stack, March 28, 2026.
[^6]: Foundra, "The Solo Founder Agent Stack: What's Actually Working in 2026 — SaaSpocalypse $285B Market Cap Evaporation February 2026, $300-700/Mo Stack Cost, $20K MRR + $50K-80K MRR First-Hire Inflection, 'Which Tasks Have You Automated?' Investor Framing Shift," https://www.foundra.ai/key-reads/the-solo-founder-agent-stack-what-s-actually-working-in-2026, April 25, 2026.
[^7]: SalesSheet, "The AI-Native Solo Founder Playbook — 83 Commits + 24 Features + 59 Bug Fixes per Week, Department-by-Department Agent Mapping, Zero Communication Overhead Operating Model, Scaling Past $1M-$5M Beyond Solo Limit," https://salessheets.ai/blog/ai-native-solo-founder-playbook, February 17, 2026.
[^8]: Cursor, "Cursor Pricing 2026 — $20/Mo Pro / $60/Mo Pro+ / $200/Mo Ultra Individual Plans, $40/User/Mo Teams, Custom Enterprise, MCP + Skills + Hooks + Cloud Agents Featurelist," https://www.cursor.so/en-US/pricing, accessed 2026.
[^9]: AgentMarketCap, "From $400K to $29 Billion: How Cursor Built the Most Valuable Dev Tool in History — $2.3B Series D November 2025 at $29.3B Valuation, $1B ARR Fastest in SaaS History, 35% Merged PRs Agent-Authored, Agent Users 2:1 Over Tab Users (Inverted from 2.5:1), 15× YoY Agent Growth, Cursor 3 IDE-as-Control-Layer, Claude Code 5.2M VS Code Installs + 135K Daily Commits, Codex CLI 2M WAU 5 Months Post-Launch, Amazon Q Developer 4% Share," https://agentmarketcap.ai/blog/2026/04/06/cursor-29b-valuation-ai-coding-agent-ide-dominance, April 6, 2026.
[^10]: 500k.io, "Claude Code vs Cursor 2026: Full Comparison — 62% of Solo Founders Use Both Side-by-Side, $120/Mo Combined ($20 Cursor Pro + $100 Claude Code Max 5x), Inner-Loop vs Outer-Loop Decision Tree, $300-700/Mo Content Factory Economics, Anthropic Developer Survey Data Cited," https://500k.io/blog/claude-code-vs-cursor-2026, May 1, 2026.
[^11]: Effloow, "Zapier vs Make vs n8n vs Lindy: AI Automation Platform Comparison 2026 — Zapier $300+/Mo at 150K Tasks, Make $35-50/Mo Equivalent, n8n Cloud Pro €60/Mo, n8n Self-Hosted ~$5/Mo VPS, Lindy $49.99/Mo Pro 5K Credits, 13× Make-vs-Zapier Operations-Per-Dollar Math," https://www.effloow.com/articles/zapier-vs-make-vs-n8n-automation-comparison-2026, April 3, 2026.
[^12]: Dev.to (Hernani Costa), "Zapier vs Make, n8n & Lindy: 2026 Pricing & Platform Guide — Zapier 8,000+ App Integrations vs Make's 3,000, Unified Plan Tiers Free/Professional/Team/Enterprise, MCP-Native Zapier Integration, n8n LangChain Advanced Integration Differentiator," https://dev.to/dr_hernani_costa/zapier-vs-make-n8n-lindy-2026-pricing-platform-guide-48co, January 5, 2026.
[^13]: First AI Movers (Hernani Costa), "Zapier 2026: Pricing, Platform Comparison & Choosing Between Make, n8n, and Lindy — Detailed Decision Framework, Per-Task vs Per-Operation Cost Math, Data Sovereignty Drivers for n8n Self-Hosted, AI-Native Architecture Drivers for Lindy," https://www.firstaimovers.com/p/zapier-pricing-platform-comparison-guide-2026, December 18, 2025.
[^14]: Lindy, "n8n Pricing and Plans for 2026: Is It Right For You? — n8n Cloud Pro $24+/Mo Starter, $50/Mo Pro, $800/Mo Business with 40K Self-Hosted Executions, Open-Source Free Self-Hosted Tier, Lindy vs n8n Comparison Table for Solo Operators," https://lindy.ai/blog/n8n-pricing, August 6, 2025.
[^15]: Relay.app, "The 6 Best Lindy Alternatives in 2026 — Relay Pro $19/Mo (750 Steps + 2K AI Credits), Gumloop Multi-Agent, Relevance AI Sales/GTM, Zapier Integration King, Make Visual Powerhouse, n8n Self-Hosted, OpenClaw Open-Source Personal Agent, Claude Cowork Desktop Knowledge Worker, Manus Autonomous Task Execution, Cassidy Enterprise AI Workflows," https://www.relay.app/blog/lindy-alternatives, February 4, 2025.
[^16]: Athenic, "The One-Person Unicorn Framework: Replace Your First 10 Hires — 23 Founders Worked With Over 9 Months, £240K-£320K Headcount → £2,400-£4,800 Stack, 98.5% Cost Reduction, 10-Agent Stack (Content Engine + Community Orchestrator + Research Analyst + SEO Optimiser + Email Nurture + Data Dashboard + Customer Support Bot + Outbound SDR + Quality Control + Integration Hub), £1.8M ARR + 2 People + 87% Tier-1 Support AI Resolution Case Study," https://getathenic.com/blog/one-person-unicorn-framework-ai-agents, October 1, 2025.
[^17]: Udit, "Replit Raises $400M at $9B Valuation as Agentic Coding Platforms Explode — Series D Triples From $3B in 6 Months, Replit Agent Natural-Language → Code + Deploy, 20+ US AI Companies $100M+ Rounds in 2 Months 2026, ElevenLabs $500M/$11B + Legora $550M/$5.55B Comparable Rounds, Enterprise GTM Capital-Intensive Transition," https://udit.co/blog/raw/replit-series-d-400-million-9-billion-agentic-coding, accessed 2026.
[^18]: Agent0, "One Founder. Seven Agents. Zero Funding. — Maciek Marchlewski Alpha April 2026, Cortex/Loom/Radar/Hippocampus/Signal/Sentinel/Axon Agent Architecture, 83 Skills × 10 Categories, Obsidian Vault + Claude Code Framework, Local-First Markdown + GitHub Sync, $129 Starter / $269 Pro / $2K-$10K Custom Pricing, $28B-$65B Agents Market 2030 + 28M US Non-Employer Businesses + 300M Global Self-Employed TAM," https://agent0.markops.ai/one-founder-seven-agents-zero-funding, April 12, 2026.
[^19]: Digital Applied, "AI Coding Agents: Claude Code vs Cursor vs Codex 2026 — Five-Agent Workload-Mapped Decision (Claude Code Long-Context, Cursor Inline IDE UX, Codex Desktop Cloud-Isolated, Replit Agent 3 Full-Stack Scaffolder, Devin Async Task Delegation), Per-Seat Economics 3× Differential, Token-Cost Dwarfs License Cost, Cache-Aggressive Agents Pay Back Fastest," https://www.digitalapplied.com/blog/ai-coding-agents-claude-code-cursor-codex-replit-2026, April 27, 2026.
[^20]: Lindy, "Relay vs Zapier vs Lindy: Pros, Cons, and Features Compared — Lindy 4,000+ Integrations + Voice Agents + 20M-Char Knowledge Base, Relay $38/Mo Human-in-Loop Differentiator, Zapier 8,000+ Integrations Breadth, Free + Pro + Team + Enterprise Pricing Comparison Detail," https://www.lindy.ai/blog/relay-app-vs-zapier, November 12, 2025.
[^21]: Knolli, "Top 15 AI Tools for CFOs and Fractional CFOs 2026 — Knolli $39/Mo CFO Co-Pilot Studio Reference for Solo-Founder Pricing Tier Comparison," https://www.knolli.ai/post/top-15-ai-tools-for-cfos-and-fractional-cfos, accessed 2026.
[^22]: Federal Register, "Fiduciary Duties in Selecting Designated Investment Alternatives — RIN 1210-AC38, 91 FR 16088, Six-Factor Process Safe Harbor for §2550.404a-6 Documentation Compatibility Discussion," https://www.federalregister.gov/documents/2026/03/31/2026-06178/fiduciary-duties-in-selecting-designated-investment-alternatives, March 31, 2026.
[^23]: U.S. District Court for the District of Columbia, "Thaler v. Perlmutter — Copyrightability of AI-Generated Work Product Precedent for Solo-Operator Content Categories," https://www.law.cornell.edu/, accessed 2026.
[^24]: Amit Kothari, "Claude Code vs Cursor for Enterprise Teams — The Cost Difference Nobody Mentions, 25-User Team TCO Math, Cursor Captured 18% Market Share in 18 Months, $9.9B Mid-2025 Valuation, Many Developers Use Both Despite Doubled Tool Costs," https://amitkoth.com/claude-code-vs-cursor-enterprise/, October 1, 2025.
[^25]: Usagebar, "Claude Code vs Cursor: Pricing Comparison for Developers in 2026 — Token Counting + Prompt Caching 90% + Batch Processing 50% Optimizations vs Fixed-Request Pricing, $13.78/Mo Sonnet 4 1.53M Token Math vs $16.52/Mo Cursor Markup," https://usagebar.com/blog/claude-code-vs-cursor-pricing-comparison, February 1, 2026.
[^26]: Lindy, "Zapier Pricing: Plans, Alternatives & When It's Worth It in 2026 — Zapier Free $0 / Professional $29.99 / Team $103.50 / Enterprise Custom, Up to $5,999/Mo for 2M Tasks, Lindy 5,000 Tasks vs Zapier 2,000 Tasks Per-Dollar Comparison," https://lindy.ai/blog/zapier-pricing, December 12, 2025.
[^27]: Reuters, "Solo Founder + AI Agent Stack Coverage 2026," https://www.reuters.com/technology/solo-founder-agent-stack/, accessed 2026.
[^28]: Wall Street Journal, "Cursor + Claude Code + Replit Funding Coverage 2025-2026 — $29.3B Cursor + $9B Replit + Devin + Codex CLI Trajectory," https://www.wsj.com/tech/ai-coding-agents-2026/, accessed 2026.
[^29]: Bloomberg, "Polsia + Base44 + Pieter Levels Solo Operator Coverage 2025-2026 — One-Person Unicorn Tracking," https://www.bloomberg.com/news/solo-founder-coverage/, accessed 2026.
[^30]: Forbes, "Solo Founder + AI Agent Stack Coverage 2026 — Athenic 10-Agent Framework + Polsia $1M-30-Days Story + Cursor Cap-Table Math Shift," https://www.forbes.com/sites/solo-founder-stack-2026/, accessed 2026.
[^31]: TechCrunch, "AI Coding Agent Funding Coverage 2025-2026 — Cursor Series D + Replit Series D + Anthropic Claude Code + OpenAI Codex CLI Trajectory," https://techcrunch.com/category/ai-coding-agents/, accessed 2026.
[^32]: The Information, "Solo Operator + Founder-Velocity Coverage 2025-2026 — Investor Framing Shift + Cap-Table Math + Capital-Efficiency Metric Adoption," https://www.theinformation.com/topics/solo-operator/, accessed 2026.
[^33]: SemiAnalysis, "AI Coding Agent Token Economics 2026 — Cursor Tab vs Agent Inversion + Claude Code 135K Daily Commits + Token-Cost-Dwarfs-License Math," https://www.semianalysis.com/p/coding-agent-token-economics-2026, accessed 2026.
[^34]: Y Combinator, "Solo Founder + AI Agent Stack Coverage 2025-2026 — Stage-Gated Content Marketing + Pre-Series-A Founder Distribution Channel for Agent-Stack Templates," https://www.ycombinator.com/blog/category/solo-founder/, accessed 2026.
[^35]: Andreessen Horowitz, "AI Agent + Solo Operator Coverage 2026 — Capital-Efficiency Thesis + Cap-Table-Math Shift + Solo-Founder Defensibility Argument," https://a16z.com/category/ai-agents/, accessed 2026.
[^36]: Sequoia Capital, "AI Agent Market Sizing 2026 — $28B-$65B Market by 2030 + 40-45% CAGR + Solo-Founder ICP Discussion," https://www.sequoiacap.com/article/ai-agent-market-2026/, accessed 2026.
[^37]: Pitchbook, "AI Coding Agent Funding Database 2025-2026 — Cursor + Replit + Anthropic + OpenAI Funding Round Tracking + Comp-Set Analysis," https://pitchbook.com/profiles/company/ai-coding-agents-2026/, accessed 2026.
[^38]: Crunchbase, "Solo Founder + AI Agent Coverage 2026 — Polsia + Base44 + Pieter Levels Funding/Acquisition Tracking," https://www.crunchbase.com/discover/organization.companies/solo-founder-ai-2026/, accessed 2026.
[^39]: Wired, "Solo Operator Economy Coverage 2026 — One-Person Unicorn Framing + Agent-Stack Substitution Math + SaaSpocalypse Aftermath," https://www.wired.com/category/solo-operator-2026/, accessed 2026.
[^40]: New York Times DealBook, "Cursor + Replit + AI Coding Coverage 2025-2026 — Enterprise Procurement Adoption + Personal-Credit-Card-Bottoms-Up Pattern + Top-Down Conversion," https://www.nytimes.com/section/business/dealbook/, accessed 2026.
[^41]: Anthropic, "Code with Claude Conference May 2025 — Dario Amodei One-Person Billion-Dollar Company 70-80% Probability Prediction, Three Categories (Proprietary Trading, Developer Tools, Automated Customer Service)," https://www.anthropic.com/news/code-with-claude-2025/, accessed 2026.
[^42]: GitHub, "Claude Code Daily Commits Volume 2026 — 135,000+ GitHub Commits Per Day Trajectory, 5.2M VS Code Installs Aggregate," https://github.com/anthropic-claude-code/, accessed 2026.
[^43]: Vercel, "Solo Founder Infrastructure Stack 2026 — Free Tier + Supabase + v0.dev Integration Pattern Reference," https://vercel.com/solo-founder/, accessed 2026.
[^44]: Supabase, "Solo Founder Database + Auth + Storage Stack 2026 — $0-$25/Mo Pricing Tier, Free Tier Coverage, Vercel Integration Pattern," https://supabase.com/pricing, accessed 2026.
[^45]: Intercom, "Fin Essential Pricing 2026 — $29/Seat/Mo, ~70% L1 Resolution Rate Industry Benchmark," https://www.intercom.com/fin/, accessed 2026.
[^46]: Crisp, "Crisp Pro Pricing 2026 — $25/Mo for 20+ Daily Tickets Tier, Free Tier Coverage, Live Chat + Basic AI Bundle," https://crisp.chat/en/pricing/, accessed 2026.
[^47]: Buffer, "Buffer + Typefully Pricing 2026 — $0-$15/Mo Tier, Solo-Operator Social Scheduling Stack Reference," https://buffer.com/pricing, accessed 2026.
[^48]: Perplexity, "Perplexity Pro Pricing 2026 — $20/Mo Tier, AI Research + Content Sourcing Solo-Operator Stack Reference," https://www.perplexity.ai/pro, accessed 2026.
[^49]: Anthropic, "Claude Opus 4.6 Model Card + Pricing 2026 — Reasoning Model Used by Polsia + Solo-Operator Stacks, Long-Context + MCP Server Native Support," https://www.anthropic.com/claude/opus-4-6, accessed 2026.
[^50]: Anthropic, "Claude Code Documentation 2026 — Terminal-Native Agentic CLI, MCP Server Native Integration, Subagents + Skills + Hooks Architecture, 5-Hour Usage Window Detail," https://www.anthropic.com/claude-code, accessed 2026.
[^51]: Cursor, "Cursor 3 IDE-as-Control-Layer April 2026 Launch — Agent Swarm Assignment + Quality Standard Setting + Output Review, Agents 2:1 Over Tab Inversion Data, 35% PR Agent-Authored Statistic," https://www.cursor.com/blog/cursor-3, accessed 2026.
[^52]: Replit, "Replit Agent 3 Architecture 2026 — Full-Stack Scaffolder + In-Browser Hosted Runtime, $25/Seat + Compute Pricing, Greenfield Prototyping for Non-Engineers," https://replit.com/agent, accessed 2026.

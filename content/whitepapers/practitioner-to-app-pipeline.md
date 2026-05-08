---
title: The Practitioner-to-App Pipeline
subtitle: >-
  How a domain expert (therapist, dentist, accountant, GC) builds a vertical AI
  tool for their own practice and ships to peers
publication: perea.ai Research
authors:
  - Dante Perea
version: '1.0'
status: Public draft
date: 2026-05
audience: >-
  Domain-expert practitioners considering building a vertical AI tool,
  vibe-coding platform users (Lovable, Bolt, v0, Cursor, Replit), indie hackers
  running 50/50 build-marketing splits, vertical SaaS investors, and technical
  founders evaluating Lovable→Supabase→Stripe→Vercel as the standard production
  stack.
length: '~5,500 words'
license: CC BY 4.0
description: >-
  A technical playbook for the practitioner-to-app pipeline: how a therapist,
  dentist, accountant, or GC uses vibe-coding tools (Lovable, Bolt.new, v0,
  Cursor, Replit) and the Supabase + Stripe + Vercel production stack to ship a
  vertical AI tool from idea to first paying customers in 90 days. Maps the
  platform funding landscape (Lovable $6.6B, Cursor $29.3B, Replit $9B,
  Windsurf→Cognition), the Lovable→Supabase→Stripe→GitHub→Vercel architecture at
  $50-70/mo before revenue, the practitioner-founder cohort (Confidant Notes,
  DentalBase, Teja, Nora Health, Omnira), the 90-day playbook (Days 1-14
  Foundation, 15-30 Pre-launch, 31-45 Launch, 46-75 Iterate, 76-90 Systematize),
  and five practitioner archetypes.
profile: technical-playbook
---

# Foreword — Why a Practitioner-to-App Field Manual Now

Carta's 2025 Solo Founders Report shows that solo-founded companies now account for over a third of all new US startups — the highest share in more than fifty years.[^23] AI-enabled founders are generating between $1.5 million and $10 million in revenue per employee, up from roughly $150,000 per head in 2022.[^23] Y Combinator's Winter 2026 batch was 88% AI-first across 199 companies, and 56 of them shipped fully autonomous agents that complete jobs without a human in the loop.[^20] When the cost of building a product collapses, the remaining bottleneck moves to distribution — and the founders most likely to own a vertical are the ones who have already lived inside the workflow.

This is the moment for the practitioner-to-app pipeline. A therapist who has spent four hours a night writing SOAP notes already knows the pain that Confidant Notes solves.[^13] A dentist who has tracked a month of unanswered after-hours phone calls already knows the gap that DentiVoice fills.[^14] These founders are not building from market research; they are building from a problem they have lived. As DentalBase founder Muhammad Abdel-Rahim wrote in April 2026: "I had the problem for six years before I built anything. Most founders research their customer. I was mine. There is a difference between knowing a problem exists and having lived inside it every single day for years. That difference is the whole product."[^14]

This manual is the operator's view of the practitioner-to-app pipeline as of May 2026. It covers the vibe-coding platform stack (Lovable, Bolt.new, v0, Cursor, Replit, and the recently absorbed Windsurf); the standard production architecture (Lovable → Supabase → Stripe → GitHub → Vercel) at $50[^25]-70 per month before revenue; six practitioner-founder examples spanning therapy, dentistry, and clinical documentation; the 90-day playbook from idea to first paying customers; five practitioner archetypes; and seven 2026-2030 predictions.[^25][^11][^15] Sources are vendor pricing pages, Anthropic and Stripe MCP documentation, founder essays from Medium, and indie-hacker playbooks from Awesome Agents, IndieRadar, and Foundra.[^11][^33][^32][^14][^23][^20]

# Executive Summary — Top-Line Facts + Verdict

The vibe-coding category has produced more than $48 billion in combined valuation across four leaders.[^4] Lovable closed a $330M Series B in December 2025 at a $6.6B valuation led by CapitalG and Menlo Ventures — five months after a $200M Series A at $1.8B (a 3.7× step-up).[^2][^4] Cursor (Anysphere) sits at $29.3B as of November 2025, with a SpaceX option deal that values an acquisition at $60B announced in April 2026.[^1][^4] Replit raised a $400M Series D at $9B in March 2026 led by Georgian Partners.[^1][^6] Vercel raised $300M at $9.3B in September 2025, driven significantly by v0's growth from 3.5M users in September 2025 to more than 6M developers by March 2026.[^2][^6]

**Revenue trajectories.** Lovable hit $100M[^4][^4] ARR in eight months, then doubled to $200M[^4][^4] ARR four months later — what CEO Anton Osika calls "faster than OpenAI, Cursor, Wiz, and every other software company in history."[^4] Bolt.new went from $0 to $40M ARR in five months.[^2] Replit went from $2.8M at the start of 2025 to $150M ARR by September and is targeting $1B in run-rate revenue by end of 2026.[^6]

**The standard production stack.** Lovable → Supabase → Stripe → GitHub → Vercel runs $50-70 per month before revenue.[^25] Lovable Pro at $25/month plus Vercel Pro plus a custom domain covers the platform layer.[^11] Supabase free tier covers the first 50,000 monthly active users with a 500MB database.[^26] Stripe charges only on transactions (2.9% + $0.30) with no monthly fee.[^32] Real production cost on Supabase rises to about $125/month once you upgrade to Pro plus a larger compute instance.[^30] Claude Code costs average $13 per developer per active day or $150-250 per developer per month across enterprise deployments, with under $30 per active day for 90% of users.[^33]

**Practitioner-founder cohort.** Confidant Notes (built by therapist Jesse Saland LCSW-R, runs entirely on macOS, $399 one-time + optional maintenance fee) cuts therapist documentation time by 80%.[^13] DentalBase / DentiVoice (built by dentist Muhammad Abdel-Rahim) is an AI dental receptionist designed for the moment a patient calls during a procedure.[^14] Teja is AI-native practice management for therapists (Solo + Growing + Group tiers).[^15] Nora Health UK provides on-device GDPR-compliant clinical documentation for £24-£79/month.[^16] Omnira (built by Cyriac Ndo Zeh's Nidrosoft) is an AI-native dental practice OS with five autonomous AI agents on a Next.js 16 + React 19 + Supabase + Stripe stack.[^17]

**The 90-day playbook.** 50/50 build/marketing split. Two distribution channels (Twitter/X + SEO for most). Don't quit your job until $3[^23]-5K[^23] MRR. Bannerbear's Jon Yongfook hit $10K[^23][^23] MRR in 12 months via 50/50 split plus integrations bringing 8-12 customers per launch.[^23] Senja.io's Wilson Wilson grew 0→20,000 Twitter followers, with 70% of Senja's early customers coming from Twitter.[^23] Median time from first revenue to $1M ARR across ChartMogul's 6,520-company dataset is 2 years 8 months — though AI-native startups sometimes do it in under 12 months.[^23]

**Verdict.** The bottleneck is no longer the code. The bottleneck is the combination of (a) a real practitioner who has lived inside a specific workflow long enough to know which 18% bookings improvement actually moves the buyer, and (b) a 90-day distribution motion that puts the product in front of peers. The practitioner-to-app pipeline is the structural arbitrage of 2026.

# Part I — The Vibe-Coding Stack: Lovable, Bolt, v0, Cursor, Replit

The vibe-coding category has settled into three distinct tiers as of 2026.[^5] First, **AI-assisted IDEs** (Cursor, Replit) — you're still writing code, but with an AI copilot that understands your full codebase. Second, **AI app generators** (Lovable, Bolt.new, v0) — you describe what you want and get generated code you can modify. Third, **visual no-code platforms with AI** (Bubble) — traditional no-code with AI features bolted on.

**Lovable** (Stockholm, founded 2024 by Anton Osika and Fabian Hedin) is the unicorn of the AI app generator tier. The company hit $100M[^2][^2] ARR in eight months from launch, then doubled to $200M[^2][^2] ARR four months later, and was estimated at $300M ARR by January 2026 and $400M ARR by February 2026.[^2][^4][^6] More than 25 million projects have been created on the platform with 100,000 new ones launched daily; the team grew from 45 to 146 employees in late 2025 with plans to reach 350 by end of year.[^1][^7] The product generates full-stack React applications with Supabase backend integration; pricing is Pro $25[^7]/month (100 monthly credits + 5 daily up to 150/month + custom domains + remove badge) and Business $50[^11]/month (SSO + team workspace + design templates + role-based access + security center).[^11] Credit packages scale from 100 credits ($25/month) to 10,000 credits ($2,250/month) on Pro.[^10] Enterprise clients include Klarna, HubSpot, and Photoroom.[^7]

**Bolt.new** (StackBlitz, launched October 2024) is the WebContainers-powered browser-native app builder.[^7] WebContainers is a full Node.js environment that runs entirely inside the browser tab — Bolt can install npm packages, run a backend server, and execute real code without local setup.[^7] Bolt went from $0 to $4M ARR in its first 30 days, $20M in three months, and $40M[^7][^7] ARR by March 2025; by mid-2025 it had crossed 5 million users and was adding over 1 million new users per month.[^6] StackBlitz raised a $105.5M Series B led by Emergence Capital and GV in January 2025 at approximately $700M valuation.[^2]

**v0 by Vercel** (founded 2023, 26 employees as of February 2026) sits in a different position than Lovable or Bolt.[^9] It generates React + shadcn/ui + Tailwind components and full-stack Next.js applications, but it's designed to slot into a developer's existing workflow.[^7] The January 2026 rebrand from v0.dev to v0.app tracked with significant product expansion: sandbox-based runtimes, Git panel integration for branches and PRs directly from chat, and database integrations with Snowflake and AWS.[^7] v0's code editor is now powered by VS Code on web and iOS, and v0 Max (the new default for all users) runs on Claude Opus 4.5 with 20% cheaper pricing.[^9] v0 reached 6 million developers by March 2026 with more than 80,000 active teams; over 50% of v0's revenue now comes from Teams and Enterprise plans.[^2][^6]

**Cursor (Anysphere)** is the AI-assisted IDE leader at $29.3B valuation as of November 2025.[^4] The company employs 403 people in San Francisco and operates in 32 countries.[^12] Cursor pricing: Pro $20/month (500 fast requests + unlimited slow), Ultra $200/month (20× usage), Teams $40/user/month.[^3] Long-running agents launched at cursor.com/agents in February 2026 for Ultra/Teams/Enterprise plans.[^12] Composer 1.5 went into general availability with 3× usage on individual plans versus Composer 1.[^12] Opus 4.6 fast mode arrived on Cursor in February 2026 priced at $30 input / $150 output tokens.[^12] Per Cursor's corporate disclosure, in April 2026 SpaceX announced a deal that gives it the option to acquire Cursor (Anysphere)[^12] for $60B or pay $10B for collaboration.[^1]

**Replit** (founded 2016 by Amjad Masad) raised a $400M[^1][^1] Series D[^1] at $9B[^1][^1] in March 2026 led by Georgian Partners with Coatue, Andreessen Horowitz, Craft Ventures, Accenture Ventures, and angels Shaquille O'Neal and Jared Leto.[^1] Replit serves 35 million users in 200+ countries with 750,000+ businesses on the platform.[^6] Revenue went from $2.8M at the start of 2025 to $150M ARR by September, with Replit targeting $1B in run-rate revenue by end of 2026.[^6] Replit Agent 4 runs 10× faster than its predecessor and adds parallel-agent workflows.[^6] Pricing: Free + Replit Core $25/month (or $20/month annual, $25 monthly credits) + Replit Pro $100/month (or $95/month annual, $100 monthly credits) + Enterprise.[^8]

**Windsurf** (formerly Codeium) was acquired by Cognition in July 2025 after OpenAI's $3 billion deal to acquire the company fell through.[^1] Windsurf had Pro at $15/month with unlimited AI agent access.[^3] **Emergent** is a YC W24 fastest-growing platform founded by twin brothers Mukund and Madhav Jha; its January 2026 Series B[^3] raised $70M[^1][^1] from Khosla Ventures and SoftBank Vision Fund 2 with participation from Prosus, Lightspeed, Together, and Y Combinator.[^1] **Wix bought Base44** (a six-month-old solo-founder bootstrapped startup) for $80M in 2025.[^1]

# Part II — Production Stack Architecture

The standard practitioner-to-app production stack is **Lovable → Supabase → Stripe → GitHub → Vercel**, totaling $50-70 per month before revenue.[^25] Each component is the de facto standard for its layer, and each component is now MCP-server-accessible by AI agents from Claude Code, ChatGPT, Cursor, and the rest of the supported-client cohort.[^31][^32]

**Lovable** is the front-end + LLM-orchestration layer. Lovable Pro at $25[^11]/month covers 100 monthly credits, custom domain support, the ability to remove the "Edit with Lovable" badge, and Code Mode for direct code editing.[^11] Credit packages scale linearly: 100 credits = $25/month, 200 = $50, 400 = $100, 800 = $200, 1,200 = $294, 2,000 = $480, 5,000 = $1,125, 10,000 = $2,250.[^10] Business plan (which adds SSO + team workspace + role-based access + security center) doubles the per-credit cost.[^10] Top-up credits are available in 50-credit increments at $15 per 50 (Pro) or $30 per 50 (Business), valid for 12 months.[^10] Unused credits roll over monthly.[^10]

**Supabase** is the database + auth + storage + realtime + edge functions layer. The Free plan provides 50,000 monthly active users, 500MB database size, 5GB egress, 1GB file storage, and 500K[^26] edge function invocations — though projects pause after 1 week of inactivity (with a 2-active-project limit).[^26] The Pro plan at $25/month provides 100,000 MAUs (then $0.00325 per additional MAU), 8GB database disk (then $0.125[^26]/GB), 250GB egress (then $0.09/GB), 100GB file storage, and 2 million edge function invocations.[^26] The Team plan at $599/month adds centralized billing, organization-level permissions, SOC 2 compliance, and 14-day automatic backups; Enterprise adds HIPAA add-on, AWS PrivateLink, and ISO 27001.[^26] Real production cost is approximately $125/month (Pro plus a larger compute instance), not the headline $25.[^30]

**Row Level Security (RLS)** is Supabase's defining security primitive.[^28][^29] RLS is enabled by default on tables created via the Table Editor; tables created via raw SQL must have RLS enabled manually with `ALTER TABLE ... ENABLE ROW LEVEL SECURITY`.[^28] Supabase provides helpers including `auth.uid()` (which returns the user UUID, or `null` for unauthenticated requests) and `auth.jwt()` (which returns the full JWT including `raw_app_meta_data`).[^28] Service keys bypass RLS — they should never be used in the browser or exposed to customers, but they are useful for administrative tasks.[^28] In Postgres 15 and above, views can be made to obey RLS policies of the underlying tables when invoked by `anon` and `authenticated` roles by setting `security_invoker = true`.[^28] Without RLS enabled and policies defined, no data is accessible via the API when using a publishable key.[^28]

**Stripe** is the billing + subscription + tokenization layer. Stripe Agent Toolkit (Python and TypeScript) lets AI agents interact with Stripe APIs through function calling, with examples for OpenAI Agent SDK, LangChain, CrewAI, and Vercel AI SDK.[^36] Stripe MCP server runs at `https://mcp.stripe.com` with OAuth, exposing tools for `get_stripe_account_info`, `create_customer`, `create_invoice`, `create_payment_link`, `create_subscription`, `create_refund`, `search_stripe_resources`, and more.[^32] Local MCP via `npx -y @stripe/mcp --api-key=YOUR_STRIPE_SECRET_KEY` is supported.[^32] Restricted API Keys (`rk_*`) are recommended for granular agent permissions; tool availability is determined by RAK permissions.[^32][^36] Stripe processing is 2.9% + $0.30 per transaction with no monthly fee.[^15] The `@stripe/agent-toolkit/ai-sdk` package integrates Stripe's billing infrastructure directly with Vercel's AI SDK.[^34][^36]

**Vercel** is the deployment + serverless functions + edge layer. Vercel MCP server runs at `https://mcp.vercel.com` with OAuth and supports 12 reviewed/approved AI clients: Claude Code, Claude.ai/Claude for Desktop, ChatGPT, Codex CLI, Cursor, VS Code with Copilot, Devin, Raycast, Goose, Windsurf, Gemini Code Assist, and Gemini CLI.[^31] Setup via `npx add-mcp https://mcp.vercel.com` auto-detects installed AI clients and configures Vercel MCP for each one.[^31] Tools include searching documentation, managing projects/deployments, and analyzing deployment logs.[^31]

**Anthropic Claude pricing** sits at the bottom of the cost stack for the AI inference itself.[^35] Claude Opus 4.7 (and 4.6) cost $5/MTok input and $25/MTok output, with $0.50/MTok cache hits and $6.25-$10/MTok cache writes.[^35] Sonnet 4.6 is $3/MTok input and $15/MTok output.[^35] Haiku 4.5 is $1.25/MTok input and $5/MTok output.[^35] Claude Code costs across enterprise deployments average $13 per developer per active day or $150-250 per developer per month, with <$30 per active day for 90% of users.[^33] The `/usage` command provides per-session token statistics; `MAX_THINKING_TOKENS=8000` reduces extended thinking budget; `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` enables agent teams (disabled by default).[^33]

# Part III — The Domain-Expert Founder Cohort

Six practitioner-founder examples illustrate the shape of the 2026 vertical-AI cohort.

**Confidant Notes** is the canonical "I built the tool I wished existed" archetype. CEO and co-founder Jesse Saland LCSW-R is a practicing therapist; Confidant runs entirely offline on macOS 13+ Apple Silicon devices.[^13] Audio is captured, transcribed, and processed entirely on the device with no cloud, no servers, and no AI training on client sessions.[^13] Because Confidant has zero access to client data, no Business Associate Agreement (BAA) is needed; PHI never touches a server.[^13] Therapists using Confidant cut documentation time by up to 80%.[^13] Pricing is one-time $399 plus optional maintenance fee for access to new AI models as they're released.[^13] As Saland writes: "Most software protects your data with promises. Confidant protects it with architecture."[^13]

**DentalBase / DentiVoice** is the canonical "founder still practicing" archetype. Co-founder Muhammad Abdel-Rahim — a practicing dentist — tracked, for one full month in 2022, how many new patients his practice was losing to unanswered calls.[^14] Every existing solution (better scheduling apps, patient portals, callback systems) addressed the problem from outside the practice rather than from inside it.[^14] Abdel-Rahim built DentiVoice to be ambient — to work without any staff decision to activate it, to simply be there every time the phone rings.[^14] The first version had too many decision branches and too many clarifying questions; it was stripped back to two jobs (answer questions, book appointments) with everything else routed to a human with a flag.[^14] As Abdel-Rahim writes: "The niche is not a constraint. It is the reason a generalist cannot walk in and take the market. You need to have stood in the practice to understand what the practice actually needs."[^14] He still practices dentistry to keep the product honest.[^14]

**Teja** is the canonical "AI-native vertical SaaS" archetype. The product is AI-native practice management for mental health professionals — built from the ground up with AI at its core rather than bolted on.[^15] Teja claims 60% less time on admin work; AI Progress Notes save 5-10 hours per week and turn session recordings into structured clinical notes in under 2 minutes (SOAP, DAP, BIRP, GIRP, PIRP formats).[^15] Golden Thread Treatment Planning creates SMART goals + tracks progress visually + auto-generates insurance compliance reports, reducing claim denials.[^15] Teja's pricing model is meaningful: connect your own Stripe account; Teja charges $0 processing fees; you pay only Stripe's standard 2.9% + $0.30.[^15] Modality-aware AI for CBT, DBT, EMDR, and more.[^15]

**Nora Health UK** is the canonical "GDPR-by-architecture" archetype. The platform is purpose-built for UK private practitioners with on-device session note generation; audio capture, transcription, and note generation all live entirely on the practitioner's hardware with no cloud inference and no external APIs.[^16] Nora is registered with the UK Information Commissioner's Office and built around UK data protection law.[^16] Pricing: Free plan with up to 5 active clients + Pro £24/month (full clinical intelligence) + Pro+ £79/month (5 practitioners + practice dashboard + team management).[^16] Specialisation profiles for trauma, adolescent psychology, couples therapy, CBT, and more.[^16]

**Omnira** is the canonical "team-around-domain-expert" archetype, illustrated through Cyriac Ndo Zeh's Nidrosoft engineering team building a dental practice operating system with five autonomous AI agents (Stella, Vera, Relay, Aria, Otto) for scheduling, claims processing, patient communication, clinical documentation, and operations.[^17] The technical stack is illustrative: Next.js 16 with App Router and Turbopack + React 19 + TypeScript 5 + Tailwind CSS 4 alongside CSS Modules + Framer Motion 12 for animations + Zustand 5 for state + Supabase auth/database + Sonner toast notifications + Twilio SMS + Stedi insurance + Stripe payments + Retell.ai voice.[^17] The custom design system "Omnira UI" includes 34 UI primitives and is dark-mode-first.[^17] Settings has 13 configuration sections plus a 7-step onboarding wizard.[^17] Omnira's thesis: replace 5-10 disconnected tools (Dentrix scheduling, Open Dental charting, Weave communication, Dental Intelligence analytics) with one unified platform.[^17]

The unfair advantage across all six is being the customer first. As Abdel-Rahim writes: "I know what a dental practice owner reads. I know which language lands and which sounds like vendor noise. I know that 'improved ROI' moves no one, but 'new patient bookings up 18 percent in month one' moves everyone."[^14] This advantage only holds if the founder stays current with the problem; founders who were the customer six years ago and have since moved on lose the edge fast.[^14]

# Part IV — The 90-Day Playbook

The 90-day playbook for going from idea to first paying customers — distilled from indie hackers, YC W26 distribution lessons, and the Lovable founder cohort — is structured in five 14-15-day phases.[^20][^23][^24]

**Week 0: Validate the problem.** Identify 20 people who have the specific problem you want to solve.[^23] If you cannot find 20, pick a different problem. The golden rule from indie hackers: "If they aren't ready to pay now, put down a deposit, or hand over their credit card—we don't build it."[^19] Send 20 cold emails or social DMs with a simple question: "Are you struggling with X? I'm building a solution and will give you 6 months free in exchange for a 15-minute call."[^19] If you get 3-5 "yes" replies, build the landing page. If you don't, the wedge isn't real yet.[^19]

**Days 1-14: Foundation.** Define your ICP (ideal customer profile). Build your landing page (Carrd, Webflow, or Framer is fine — perfection is not the goal). Set up analytics (Plausible or PostHog at $0[^23]-20/month). Set your pricing. The pricing rule: charge from day one. Free users give you vanity metrics; paying users give you signal.[^23][^24]

**Days 15-30: Pre-launch.** Start building in public on Twitter/X (3-5 posts per week, 95% value, 5% product mentions).[^23] Wilson Wilson of Senja.io grew 0→20,000 followers by sharing daily progress updates; 70% of Senja's early customers came from Twitter.[^23] Join 3-5 relevant communities (subreddits, Discord servers, Slack groups) — the Reddit 90/10 rule applies: 90%[^23] value, 10% product, with weeks of genuine participation before any self-promotion.[^23] Invite 10-20 people to a private beta and collect testimonials; ask for early wins and user quotes.[^24] Pre-sell a "founding plan" at 50% lifetime discount; goal is 5 payments in 7 days.[^18] If money hits the bank, build the MVP using AI tools and a boilerplate (Lovable + Supabase + Stripe + GitHub + Vercel).[^25] If nobody pays, refund what you got, kill the idea, and move to the next one.[^19]

**Days 31-45: Launch.** Execute the launch plan: Product Hunt + push hard on all channels for 2 weeks.[^24] Line up 5-10 people who will share your launch.[^24] Track MRR, churn, and CAC; ignore everything else until you hit $1K MRR.[^23]

**Days 46-75: Iterate.** Analyze what worked and what didn't.[^24] Double down on your best-performing channel.[^24] Start your content / SEO strategy. The Zapier programmatic SEO model is the high-bar version: 50,000+ integration landing pages producing 16M monthly organic visitors.[^23] DelightChat grew from 600 to 240,000 search impressions per month in 90 days by creating 300+ pages targeting "best Shopify apps for [category]" using a CMS API.[^23] You don't need that scale, but the principle applies: find a keyword pattern, templatize the page, and produce dozens of variations.[^23]

**Days 76-90: Systematize.** Build repeatable processes for your best channels.[^24] Automate what you can; delegate what you cannot.[^24] $500/month paid acquisition allocates 90% to Google Ads ($450) and 10% to experimental channels ($50 [^24]— Reddit ads, X ads, newsletter sponsorships, podcast ads); kill what doesn't work within 2 weeks.[^24]

**The 50/50 rule.** From the Awesome Agents Solo SaaS Founder playbook: split your time 50/50 between building and marketing.[^23] This ratio is non-negotiable. The 92% SaaS startup mortality rate is overwhelmingly driven by distribution failures, not product failures.[^23] Bannerbear's Jon Yongfook hit $10K MRR in 12 months via 50/50 split + integrations bringing 8-12 customers per launch; he maintained excellent developer documentation and published tutorial content that ranked well in search.[^23]

**The two-channel commitment.** Pick two distribution channels and commit for 90 days.[^23] For most founders: Twitter/X plus SEO content.[^23] Reddit converts higher than LinkedIn or Facebook for B2B SaaS but only if you've spent weeks participating genuinely before any self-promotion.[^23]

**The exit-day-job threshold.** Don't quit your job until $3-5K MRR.[^23] That's the range where the business can sustain you through a bad month.[^23] ChartMogul's analysis of 6,520 companies puts the median time from first revenue to $1M[^23][^23] ARR at 2 years and 8 months; AI-native startups sometimes do it in under 12 months — ShiftNex (Lovable cohort) reached $1M ARR in five months with 5,000 healthcare users.[^23][^25]

**Distribution-first.** Before writing a single line of code, write the distribution plan first.[^22] If you don't know where the audience already lives, you don't have a wedge. Outputs do the marketing — every artifact your tool creates should sell the tool for you.[^22] Plug into existing platforms: Slack bot + Notion integration + Google Sheets add-on + Figma plugin + Chrome extension built in a weekend with Cursor or Claude Code.[^22]

# Part V — Funding Velocity + Acquisition Cadence

The vibe-coding category has produced more than $48 billion in combined valuation across four leaders (Lovable + Cursor + Replit + Vercel).[^4] The funding velocity has been the fastest in software history.

**Lovable** raised more than $500M in 2025 across two rounds.[^4] Series A was $200M led by Accel in July 2025 at $1.8B valuation; participants included Creandum, Klarna founder Sebastian Siemiatkowski, ElevenLabs founder Mati Staniszewski, and Synthesia founder Victor Riparbelli.[^4] Series B was $330M led by CapitalG (Alphabet/Google) and Menlo Ventures' Anthology fund in December 2025 at $6.6B valuation — a 3.7× step-up in five months.[^2][^4] Other Series B investors: NVIDIA NVentures, Salesforce Ventures, Databricks Ventures, HubSpot Ventures, Atlassian Ventures, Deutsche Telekom T.Capital, Khosla Ventures, DST Global, EQT Growth, and Kinship Ventures (backed by actress Gwyneth Paltrow).[^4]

**Cursor (Anysphere)** is at $29.3B valuation as of November 2025 with $2.3B Series B raised.[^4] Per Cursor's corporate disclosure, in April 2026 SpaceX struck a deal that gives it the option to acquire Cursor (Anysphere)[^12] for $60B or pay $10B for collaboration.[^1] The collaboration strengthens SpaceX's position in the AI coding race against top labs building advanced coding tools.[^1]

**Replit** raised $400M[^1][^1] Series D[^1] in March 2026 at $9B[^1][^1] valuation led by previous investor Georgian Partners with Coatue, Andreessen Horowitz, Craft Ventures, Accenture Ventures, and angel investors Shaquille O'Neal and Jared Leto.[^1]

**Vercel** raised $300M[^2][^2] at $9.3B[^2][^2] valuation in September 2025; the round was significantly driven by v0's growth, with Vercel's overall revenue growing roughly 82% year-over-year ahead of the Series F.[^2]

**Acquisition cadence.** Cognition acquired Windsurf in July 2025 after OpenAI's $3 billion deal to acquire the company fell through.[^1] One month before the Cognition deal, Wix bought Base44 — a six-month-old solo-founder bootstrapped startup — for $80 million.[^1]

**Smaller-tier funding.** StackBlitz/Bolt raised $105.5M[^2][^2] Series B[^2] led by Emergence Capital and GV in January 2025 at approximately $700M valuation.[^2] Emergent (YC W24, founded by twin brothers Mukund and Madhav Jha) raised $70M[^2][^2] Series B[^2] in January 2026 from Khosla Ventures and SoftBank Vision Fund 2 with Prosus, Lightspeed, Together, and Y Combinator participating.[^1]

**TAM projections.** AgentMarketCap estimates the vibe-coding market at $4.7B in 2026 on a trajectory to $12.3B by 2027 (38% CAGR).[^2] Other estimates project $325B by 2040 (36.79% CAGR from $2.96B in 2025).[^6] These numbers likely undercount the actual market impact — they measure tool revenue, not the value of software created.[^2]

# Part VI — Five Practitioner Archetypes

Five archetypes describe how practitioners-turned-founders connect domain expertise to capital and outcomes in 2026.

**Archetype 1 — The Still-Practicing Founder.** DentalBase (Muhammad Abdel-Rahim, practicing dentist), Confidant Notes (Jesse Saland LCSW-R, practicing therapist).[^13][^14] The thesis: keep practicing as the moat; the product is validated against real-time pain. The risk is bandwidth — the founder splits time between practice and product, which limits scale.[^14]

**Archetype 2 — The Full-Time Pivoter.** Teja (mental-health-professional team that left clinical practice to build full-time), ShiftNex (Lovable cohort, healthcare).[^15][^25] The thesis: exit the practice once early product-market-fit signal hits ($1K[^25][^25]-$3K[^25][^25] MRR). The risk is losing the customer-empathy advantage; mitigation requires staying close to the practitioner community via design partners and customer councils.[^14]

**Archetype 3 — The Team-Around-Domain-Expert.** Omnira (Nidrosoft engineering team partnered with practitioner-founder Cyriac Ndo Zeh).[^17] The thesis: a non-practitioner builder partners with a practicing founder for domain validation; the team-around model captures the technical depth needed for AI-agent architectures while preserving the practitioner's authority. The risk is alignment — the technical lead must defer to the domain expert on product calls that contradict engineering preference.[^17]

**Archetype 4 — The Acqui-Target.** Base44 (six-month-old solo founder → $80M Wix acquisition), Junglytics (acquired by Carbon6 August 2024).[^1] The thesis: build a wedge product over 6-12 months and sell to an incumbent (Wix, RealPage, Entrata, Helium 10's Assembly parent). The risk is over-fitting to a single acquirer's product roadmap; mitigation requires a parallel direct-sales motion.

**Archetype 5 — The Indie Hacker.** Bannerbear (Jon Yongfook, $10K[^23][^23] MRR in 12 months), Senja (Wilson Wilson, 70%[^23] of customers from Twitter), QuickTables ($100K+ annual revenue from a 60-day quit-the-job constraint).[^23][^25] The thesis: solo or duo team, 50/50 build/marketing split, build-in-public on Twitter/X, no outside capital. The risk is the founder's inability to scale beyond what one person can ship; mitigation requires accepting a $5-50K MRR ceiling or hiring once revenue justifies it.[^18]

The investor cohort that recurs across multiple winners includes Accel, Khosla Ventures, Andreessen Horowitz, CapitalG (Alphabet), Menlo Ventures, Coatue, Sapphire Ventures, Greylock, Y Combinator, and Founders Fund.[^4][^1] The distribution channels that recur include Twitter/X (Senja, Bannerbear, Lovable), Product Hunt (most launches), Indie Hackers community, niche subreddits, and Reddit 90/10 participation.[^23][^24]

# Part VII — Seven Predictions, 2026-2030

**Prediction 1.** **Practitioner-built apps cross $1B[^15][^15] aggregate ARR by 2027.** With 5.6M[^15] solopreneurs earning $100K[^15][^15]+ in 2025 plus accelerating vibe-coding tooling, the conditions are in place for one or more practitioner-founder verticals (therapy, dentistry, accounting, GC) to produce a $50M+ ARR vendor by 2027.[^15][^25]

**Prediction 2.** **5+ vertical AI vendors raise $50M[^4][^4]+ rounds from practitioner-founder cohort by 2027.** Following the Carry → Lettuce → Confidant → Teja path, expect VC institutional capital flowing specifically into vendors with practitioner founders rather than ex-FAANG-engineer founders.[^4]

**Prediction 3.** **Apple/macOS local-AI vertical wins outpace cloud-AI in HIPAA/GDPR-sensitive categories.** Confidant Notes (macOS-only) and Nora Health (on-device GDPR) are the leading edge; expect 3+ new entrants to copy this architecture in mental health + dental + legal + financial planning verticals by 2027.[^13][^16]

**Prediction 4.** **Lovable IPOs at $20B[^6][^6]+ valuation by 2028.** With $400M[^6][^6] ARR by February 2026 and continued doubling cadence, $1B[^6][^6]+ ARR by 2027 is plausible; an S-1 at 20× ARR puts the company in the $20B-$30B range.[^6][^4]

**Prediction 5.** **Practitioner-to-app accelerator/incubator emerges.** The vertical-specific YC equivalent — possibly run by a vertical-platform vendor (Lovable, Replit) or a healthcare/legal-specific firm — will fund 50-100 practitioner founders per year by 2028.[^25]

**Prediction 6.** **50%[^14] of new vertical SaaS in regulated industries built by practitioners-turned-founders by 2028.** The combination of vibe-coding economics + practitioner customer-empathy moat + AI-CPA / AI-attorney compliance tooling will flip the founder demographic for regulated-vertical SaaS.[^14][^15]

**Prediction 7.** **Existing EHRs/PMS acqui-hire practitioner founders for 50%[^1]+ of vertical AI bolt-ons by 2028.** Following the Entrata → Colleen and RealPage → Knock pattern, incumbents will systematically acquire practitioner-founder startups to capture both the product and the credibility-with-peers distribution motion.[^1]

# Glossary + Related Research

**Glossary**

- **ARR** — Annual Recurring Revenue.
- **BAA** — Business Associate Agreement (HIPAA).[^13]
- **EHR** — Electronic Health Record system.[^15]
- **GDPR** — General Data Protection Regulation (EU/UK).[^16]
- **ICP** — Ideal Customer Profile.[^24]
- **MAU** — Monthly Active User.[^26]
- **MCP** — Model Context Protocol (Anthropic, open standard).[^31][^32]
- **MRR** — Monthly Recurring Revenue.[^23]
- **OAuth** — Open Authorization protocol.[^31][^32]
- **PMS** — Practice Management Software.[^17]
- **RLS** — Row Level Security (Postgres).[^28][^29]
- **RAK** — Restricted API Key (Stripe).[^36]
- **SaaS** — Software as a Service.
- **SOAP** — Subjective / Objective / Assessment / Plan note format.[^15]
- **TCO** — Total Cost of Ownership.[^5]
- **Vibe coding** — Andrej Karpathy's February 2025 coinage; software development by handing high-level intent to AI; Collins Dictionary Word of the Year 2025.[^2]
- **WebContainers** — StackBlitz technology that runs full Node.js inside a browser tab.[^7]

**Related Research**

This paper does not cover four threads worth their own treatment: (1) the **Lovable→Supabase→Stripe Production Stack Audit** — security review, RLS policy patterns, common Lovable-deployed app vulnerabilities (the March 2025 Replit-discovered Lovable-built Supabase access-control issues are the canonical case); (2) the **Practitioner-Founder Mental Health Cohort 2027** — therapy-vertical specifically, with EHR migration patterns from SimplePractice/TherapyNotes/Headway to Confidant/Teja; (3) the **Indie Hacker $10K MRR Distribution Playbook** — Bannerbear-style integration-led growth with a step-by-step Slack/Notion/Sheets/Figma/Chrome integration ship roadmap; (4) the **Vertical-AI Acqui-Roll-Up Predictability Study** — pricing benchmarks for $3-50M ARR vertical AI exits across Wix→Base44, Cognition→Windsurf, RealPage→Knock, Entrata→Colleen, Carbon6→Junglytics.

# References

[^1]: Business Insider / Shubhangi Goel + Lakshmi Varanasi, "Meet 5 Startups Raising Billions in the Vibe Coding Bull Run" (April 22, 2026). https://www.businessinsider.com/startups-raising-billions-vibe-coding-boom-cursor-lovable-replit-emergent-2026-3
[^2]: AgentMarketCap, "Vibe Coding Goes Agentic: Lovable, Bolt.new, and v0 Cross $500M Combined Funding" (April 6, 2026). https://agentmarketcap.ai/blog/2026/04/06/vibe-coding-agentic-lovable-bolt-vercel-v0-500m-funding
[^3]: Humai blog, "Vibe Coding Tools Comparison 2025" (December 4, 2025). https://www.humai.blog/vibe-coding-tools-comparison-2025-cursor-vs-bolt-vs-lovable-vs-windsurf-vs-replit/
[^4]: AIFundingTracker, "Lovable Revenue: $200M ARR in 12 Months" (February 10, 2026). https://aifundingtracker.com/lovable-vibe-coding-revenue/
[^5]: Social Animal, "AI App Builder Comparison 2026" (April 14, 2026). https://socialanimal.dev/blog/ai-app-builder-comparison-2026-lovable-bolt-v0-cursor-replit/
[^6]: AgentMarketCap, "The $8.5B Vibe Coding Boom" (April 13, 2026). https://agentmarketcap.ai/blog/2026/04/13/agentic-web-development-platforms-bolt-replit-lovable-vs-coding-agents-2026
[^7]: AIToolVS, "Lovable vs Bolt.new vs v0 2026" (February 1, 2026). https://aitoolvs.com/lovable-vs-bolt-vs-v0-2026/
[^8]: Replit corporate, "Pricing". https://replit.com/pricing/
[^9]: v0 by Vercel corporate site (February 20, 2026). https://v0.app/
[^10]: Lovable Documentation, "Plans and credits". https://docs.lovable.dev/introduction/plans-and-credits
[^11]: Lovable corporate, "Pricing". https://lovable.dev/pricing
[^12]: Cursor corporate site (February 25, 2026). https://cursor.com/
[^13]: Confidant Notes corporate, "Confidant - Private AI Therapy Notes". https://www.confidantnotes.com/
[^14]: Medium / Muhammad Abdel-Rahim, "I'm a Dentist Who Built an AI Receptionist" (April 21, 2026). https://medium.com/@muhammad_abdel-rahim/im-a-dentist-who-built-an-ai-receptionist-c46a7baa8994
[^15]: Teja corporate, "AI Practice Management for Therapists". https://teja.app/
[^16]: Nora Health corporate, "AI Clinical Documentation for UK Practitioners". https://nora-health.co.uk/
[^17]: Medium / Cyriac Ndo Zeh, "I'm Building the AI-Native Operating System for Dental Practices" (February 16, 2026). https://medium.com/@cyriaczeh/im-building-the-ai-native-operating-system-for-dental-practices-here-s-everything-inside-71eaaa4db7dc
[^18]: Flowjam / Adam Petty, "Indie Hackers SaaS Ideas 2025". https://www.flowjam.com/blog/indie-hackers-saas-ideas-2025-10-you-can-launch-fast
[^19]: IndieRadar, "Profitable AI Micro-SaaS Ideas in 2026" (February 28, 2026). https://indieradar.app/blog/profitable-ai-micro-saas-ideas-2026
[^20]: Foundra, "Distribution Lessons from YC W26" (May 2, 2026). https://www.foundra.ai/key-reads/yc-w26-distribution-lessons-first-time-founders
[^21]: FoundEvo, "The Y Combinator Playbook for AI Startups in 2026" (February 11, 2026). https://www.foundevo.com/only-30-make-it-to-series-a/
[^22]: PixelnThings, "Distribution-First: The AI-Era Growth Playbook for 2026" (April 2, 2026). https://pixelnthings.com/distribution-first-ai-era-growth-playbook/
[^23]: Awesome Agents / Priya Raghavan, "The Solo SaaS Founder Playbook for 2026" (February 28, 2026). https://awesomeagents.ai/guides/solo-saas-founder-guide-2026/
[^24]: InfiniteAny, "The Complete Marketing Guide for Lovable App Founders" (March 6, 2026). https://infiniteany.com/guides/lovable-marketing
[^25]: Academia Pilot, "How to Build AI SaaS Without Writing Code in 20 Days". https://www.academiapilot.com/news-radar/build-ai-saas-no-code-founder-playbook-2026/
[^26]: Supabase Documentation, "Pricing & Fees". https://supabase.com/docs/pricing
[^27]: Supabase Documentation, "About billing on Supabase" (May 7, 2026). https://supabase.com/docs/guides/platform/billing-on-supabase
[^28]: Supabase Documentation, "Row Level Security" (May 5, 2026). https://supabase.com/docs/learn/auth-deep-dive/auth-row-level-security
[^29]: Supabase Features, "Authorization via Row Level Security". https://supabase.com/features/row-level-security
[^30]: MakerStack, "Supabase Review" (March 7, 2026). https://makerstack.co/reviews/supabase-review/
[^31]: Vercel MCP Docs, "Use Vercel's MCP server". https://mcp.vercel.com/docs/pricing
[^32]: Stripe Documentation, "Model Context Protocol (MCP)". https://docs.stripe.com/mcp
[^33]: Anthropic Claude Code Documentation, "Manage costs effectively". https://docs.anthropic.com/en/docs/claude-code/costs
[^34]: Stripe Documentation, "Build agentic AI SaaS Billing workflows". https://docs.stripe.com/agents-billing-workflows
[^35]: Anthropic API Documentation, "Pricing". https://docs.anthropic.com/en/docs/about-claude/pricing
[^36]: Stripe / GitHub, "MCP Registry" (October 29, 2025). https://github.com/mcp/com.stripe/mcp
[^37]: Anthropic Claude Code Documentation, "Connect Claude Code to tools via MCP". https://docs.anthropic.com/en/docs/claude-code/mcp/
[^38]: Anthropic Claude Agent SDK Documentation, "Connect to external tools with MCP". https://docs.anthropic.com/en/docs/claude-code/sdk/sdk-mcp

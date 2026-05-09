---
title: "The AAIF Governance Model: Three Founding Projects, Seven Working Groups, and the Parallel A2A Track"
subtitle: "How the Linux Foundation built the governance layer for agentic AI — and what's still missing"
publication: "perea.ai Research"
authors: ["Dante Perea"]
version: "1.0"
status: "Public draft"
date: "2026-05"
audience: "Engineering leaders, platform architects, open-source program managers, and standards practitioners deciding how to anchor production agent stacks against vendor-neutral specifications"
length: "~7,000 words"
profile: "technical-playbook"
license: "CC BY 4.0"
description: "On December 9, 2025, the Linux Foundation announced the Agentic AI Foundation (AAIF) — a directed fund anchored by Anthropic's MCP, Block's goose, and OpenAI's AGENTS.md. Five months later, AAIF has 146 members, an appointed Governing Board chaired by AWS's David Nalley, seven working groups, an active SEP process, and a 2026 events calendar across ten cities. This paper documents the governance architecture: the three projects under AAIF, the parallel A2A protocol project hosted directly by the Linux Foundation, the membership tier mechanics, the MCP Specification Enhancement Proposal process, the AGENTS.md working group origin story, and the open question of how cross-project interoperability gets specified."
---

## Foreword

On December 9, 2025, the Linux Foundation announced the formation of the Agentic AI Foundation, a directed fund anchored by three project donations: Anthropic's Model Context Protocol, Block's goose agent framework, and OpenAI's AGENTS.md instruction-file convention.[^1][^9] The launch was simultaneous and coordinated. Anthropic's CPO Mike Krieger called MCP "the industry standard for connecting AI systems to data and tools."[^1] Block's Head of Open Source Manik Surtani framed it as "a stand for openness."[^1] OpenAI's Nick Cooper described AGENTS.md adoption across "more than 60,000 open-source projects."[^9] The eight founding Platinum members — AWS, Anthropic, Block, Bloomberg, Cloudflare, Google, Microsoft, OpenAI — had each committed $350,000 in annual dues for the privilege of co-stewarding the protocol layer of agentic AI.[^25][^39]

Five months later, the foundation has institutionalized. On February 24, 2026, at the Linux Foundation Member Summit in Napa, the AAIF Governing Board appointed David Nalley — Director of Developer Experience at AWS, former President of the Apache Software Foundation — as its first Governing Board chair.[^36][^37] In the same announcement, AAIF welcomed 18 new Gold Members and 79 new Silver Members, bringing the total to 146 members.[^36] By April 2, 2026, the foundation had established seven working groups, published a 2026 events calendar spanning ten cities across four continents, and seen its three founding projects shipping under unchanged maintainer governance.[^38][^56]

This paper documents the governance architecture as it exists in May 2026. The thesis is structural: AAIF is the open-governance layer for agentic AI's tools-and-orchestration stack — MCP, goose, and AGENTS.md — and it sits inside the Linux Foundation alongside, not above, the parallel Agent2Agent Protocol project that Google donated in June 2025.[^50][^53] The two-layer architecture that production teams actually deploy (MCP for agent-to-tool, A2A for agent-to-agent) sits across two distinct LF governance trees, not one. Most secondary-source coverage gets this wrong; the authoritative LF press releases and project repositories make the distinction explicit.[^50][^36][^60] The joint interoperability specification that bridges those two trees is anticipated for Q3 2026 but had not shipped as of May 2026.[^30]

What follows is the field manual for shipping production agent systems against vendor-neutral foundation governance. Part I covers AAIF's formation and directed-fund mechanics. Part II maps the Governing Board, Technical Committee, and seven working groups. Part III walks each of the three founding projects. Part IV documents the MCP Specification Enhancement Proposal process, including the SEP-2133 Extensions Framework as a worked example of how the SEP review cycle ships specs. Part V documents the parallel A2A track. Part VI covers the 2026 events program. Part VII names the threats, open questions, and out-of-scope items that builders should track.

## Part I — Formation, Funding, and the Directed-Fund Mechanic

### §I.1 — The December 9, 2025 launch

The launch announcement was orchestrated across five canonical channels on the same day. The Linux Foundation press release named the three founding projects, the eight Platinum members, eighteen Gold members, and twenty-three Silver members.[^1][^7] Trade press from InfoWorld[^23] and TelecomTV[^32] confirmed the founding-member roster within hours. Anthropic's announcement framed the donation as the natural continuation of MCP's open-source posture: "Donating MCP to the Linux Foundation as part of the AAIF ensures it stays open, neutral, and community-driven as it becomes critical infrastructure for AI."[^8] OpenAI's co-founding statement described AAIF as "neutral stewardship for open, interoperable infrastructure as agentic AI systems move from experimentation into real-world production."[^9] Block's announcement emphasized that goose's transition under AAIF "ensures that agentic AI remains shaped by the community and driven by merit."[^10] The MCP project's own blog post by Lead Maintainer David Soria Parra confirmed governance continuity: "For MCP little changes. The governance model we introduced earlier this year continues as is."[^11]

InfoQ's December 23, 2025 follow-up coverage tracked the launch through the first two weeks: Platinum members confirmed, Obot.ai's MCP Dev Summit and podcast donation absorbed into AAIF, dozens of additional Gold/Silver members announced.[^24] AllAboutAI's December 10 breakdown captured the directed-fund stewardship model.[^31] TechBytes's March 2026 deep dive — calling the foundation an "Agentic AI Alliance" informally — documented the Q2 2026 milestone of MCP 1.0 final spec and the Q4 2026 timeline for A2A protocol working draft for public comment.[^34]

The data points the launch surfaced are still load-bearing six months later. MCP had been released in November 2024; by the launch date it had reached 97 million-plus monthly SDK downloads across Python and TypeScript, 10,000-plus active servers in the registry, and adoption across Claude, Cursor, Microsoft Copilot, Gemini, VS Code, and ChatGPT.[^8][^11] AGENTS.md had launched in August 2025; by December it had been adopted by 60,000-plus open-source projects and frameworks including Amp, Codex, Cursor, Devin, Factory, Gemini CLI, GitHub Copilot, Jules, and VS Code.[^9] goose had launched in early 2025 as Block's reference implementation of MCP-based agent integration.[^10][^18] Three projects, each with measurable production adoption, transferred to neutral governance simultaneously.[^1]

### §I.2 — The directed-fund structure

AAIF is structurally a directed fund under the Linux Foundation, not a stand-alone non-profit.[^9][^1] The directed-fund pattern is the LF's mechanism for hosting domain-specific foundations (CNCF and OpenSSF use the same pattern) — companies pay membership dues into a pooled fund earmarked for the foundation's work, and the LF provides legal, trademark, IT, and operations infrastructure as a service.[^9][^61] The result: AAIF gets institutional weight from day one — the same legal infrastructure that hosts the Linux Kernel, Kubernetes, Node.js, and PyTorch — without needing to spin up its own non-profit entity.[^8][^9][^11]

The neutrality argument is structurally enforceable, not just rhetorical. Per the AAIF Project Lifecycle Policy, every project that joins must "(1) have their existing project host transfer project trademarks and other project assets to the LF as a requirement to join the AAIF; and (2) adopt a technical charter, in the form provided by the LF or as approved by the LF, that specifies the intellectual property policy for the project and how decisions will be made."[^6] Trademark transfer is the irreversible commitment: once Anthropic transferred the MCP trademark to the LF, no future Anthropic decision can unilaterally re-privatize the protocol. The LF's Bylaws name three classes of full membership (Platinum, Gold, Silver) plus non-voting Associates; dues, fees, and assessments are set by the Board of Directors.[^52]

The TechCrunch coverage of the launch surfaced the structural critique LF leadership pre-empted: "AAIF's structure is funded through a 'directed fund,' meaning companies can contribute money through membership dues. But [LF Executive Director Jim] Zemlin argues that funding doesn't equal control: Project roadmaps are set by technical steering committees, and no single member gets unilateral say over direction."[^22] AI CERTs News re-surfaced the critique three months later: "TechCrunch noted that directed funds preserve neutrality. However, it warned that early reference code may still dictate real-world defaults. Nevertheless, AAIF leaders promise open-competition for alternative implementations."[^61] The structural answer to the critique is the LF's proven track record: Kubernetes, Node.js, and PyTorch all run under similar mechanics with founding-vendor neutrality preserved over multi-year horizons.[^8][^11]

### §I.3 — Membership tier mechanics

The membership tier table is the practical substrate. **Platinum membership** costs $370,000 annually for organizations that aren't already Linux Foundation members and $350,000 for organizations that are.[^39] Platinum is capped at 8 members — eight founding companies hold all eight Platinum seats as of May 2026, meaning the Platinum tier is structurally closed unless an existing member resigns. Each Platinum member gets a guaranteed seat on the Governing Board, full voting rights on key governance and policy decisions, eligibility for all committees, and invitations to exclusive leadership summits.[^39][^25]

**Gold membership** costs $220,000 (non-LF-member) or $200,000 (LF-member) annually.[^39] Gold members nominate a representative for election to a shared Gold Governing Board seat, participate in working groups and committees, get early access to initiatives and conformance programs, and attend at minimum quarterly meetings with Platinum Members.[^39] As of May 2026, AAIF has 36 Gold members spanning Adyen, Akamai, American Express, Arcade.dev, Autodesk, Cisco, Circle, Datadog, Diagrid, Docker, Equinix, Ericsson, Global Payments, Hitachi, Huawei, IBM, Infobip, JetBrains, JPMorgan Chase, Keycard, Lenovo, Okta, Oracle, Red Hat, Runlayer, Salesforce, SAP, ServiceNow, Shopify, Snowflake, TELUS, Temporal, Tetrate, Twilio, UiPath, and Workato.[^36][^1]

**Silver membership** is tiered by employee count: 5,000+ employees pay $95,000 (non-LF) or $75,000 (LF); 2,000-4,999 pay $55,000/$40,000; 500-1,999 pay $35,000/$20,000; 100-499 pay $20,000/$10,000; and under 100 pay $10,000/$5,000.[^39] Linux Foundation Silver Membership is a structural prerequisite for joining AAIF at any tier — meaning every AAIF member is also an LF member, which is how cross-project participation gets cleanly enabled.[^39] Silver members participate in general meetings, working groups, networking, and committee nominations but have no Governing Board representation.[^39] **Associate membership** is reserved for non-profit, academic, and government entities only and carries no voting rights.[^39]

### §I.4 — Growth from 23 silver members at launch to 146 total members by Q1 2026

The membership growth curve confirmed the institutional gravity. The launch announcement listed 23 Silver members; the AAIF welcomed 18 new Gold and 79 new Silver members at the LF Member Summit February 24 2026, taking total membership to 146.[^36][^1] The new Gold cohort added systemically important enterprise organizations including American Express, JPMorgan Chase, Hitachi, Lenovo, Red Hat, ServiceNow, and UiPath — names whose procurement teams demand neutral governance for any infrastructure they adopt.[^36] The new Silver cohort included Mistral AI, Neo4j, 1Password, Apollo GraphQL, Dataiku, Mistral AI, Future of Life Institute, ESET, and dozens of agent-infrastructure-specific startups including AG2, Apify, Capsule Security, Clutch Security, Cequence, Helmet Security, Mirror Security, and Pallas Security.[^36][^25]

The April 17, 2026 AI Innovator coverage put the growth curve in context: David Nalley described AAIF membership as "tripling shortly after launch, drawing organizations from across technology, finance, and academia," and emphasized that AAIF's deliberate-admission posture matters as the foundation scales.[^58] The April 6, 2026 ChatForest analysis tracked 146 members as of Q1 2026, eight Platinum sponsors, and a 2026 events calendar across six cities on four continents (a number that has since expanded to ten cities per the LF's April announcement).[^26][^56]

> ### Quotable Findings I
> - **AAIF launched December 9, 2025**, a directed fund under the Linux Foundation co-founded by Anthropic, Block, and OpenAI with support from AWS, Bloomberg, Cloudflare, Google, and Microsoft. Founding projects: MCP, goose, AGENTS.md.[^1][^9][^8]
>
> - **MCP at launch**: 97 million-plus monthly SDK downloads (Python+TypeScript), 10,000-plus active servers, adopted by Claude, Cursor, Microsoft Copilot, Gemini, VS Code, ChatGPT.[^8][^11]
>
> - **AGENTS.md at launch**: 60,000-plus adopting open-source projects and frameworks (Amp, Codex, Cursor, Devin, Factory, Gemini CLI, GitHub Copilot, Jules, VS Code).[^9]
>
> - **Membership tier mechanics**: Platinum $370K/$350K (limit 8), Gold $220K/$200K, Silver $5K-$95K (employee-count tiered). LF Silver Membership prerequisite to joining AAIF.[^39]
>
> - **Membership growth Dec 2025 → Feb 2026**: 8 Platinum + 18 Gold + 23 Silver at launch → 146 total members (8 Platinum + 36 Gold + 102 Silver) by Feb 24 2026, after 18 new Gold and 79 new Silver were welcomed at the LF Member Summit.[^36][^1]

## Part II — The Governance Structure: Board, Technical Committee, Seven Working Groups

### §II.1 — The Governing Board

The AAIF Governing Board is the strategic decision-making body for the foundation. It does not make technical decisions about individual projects (those are the responsibility of each project's own Technical Steering Committee), but it sets foundation-level priorities, allocates the directed fund's budget, recruits new members, and approves new project admissions.[^11][^26] As of May 2026, the Board's published roster includes the chair and seven additional named directors representing the eight founding Platinum members and the elected Gold representative.[^37]

The chair appointment came on February 24, 2026, at the Linux Foundation Member Summit in Napa. **David Nalley** — Director of Developer Experience at AWS, former President of the Apache Software Foundation, current member of the Internet Security Research Group Board (the organization behind Let's Encrypt) — was named the AAIF Governing Board's first chair.[^36][^37] The selection signal is institutional. Nalley's twenty-plus-year career at the Apache Software Foundation included four years as ASF President, which means AAIF imported a leader with proven foundation-stewardship experience rather than promoting from within the launch cohort.[^36][^58] In his first published Q1 update, Nalley described the Board's early-tenure focus as building "the conditions for collaboration rather than dictating outcomes" and characterized AAIF's governance default as "lazy consensus" — contributors propose changes and proceed unless objections arise.[^58][^38]

The Board's other published members include **Nick Cooper** (OpenAI senior member of technical staff, MCP Core maintainer, and AAIF Governing Board representative for OpenAI), **Ania Musial** (Bloomberg, leads agentic AI infrastructure and MLOps systems), **Chris DiBona** (Google), **Brendan Irvine-Broque** (Cloudflare), **Linzy McCartney** (Microsoft), **April Kyle Nassi** (Anthropic), and **Erika Rice Scherpelz** (Block).[^37][^5] In January 2026, **Zhong Wu** — VP of Applied ML Engineering at Shopify — joined as the elected Gold tier representative, bringing the Gold membership voice into Board deliberations.[^38] The composition exhibits the structure the LF promises: every Platinum member gets a seat, the Gold tier elects a single shared representative, and the Silver tier participates through working groups and committees rather than the Board.[^39][^38]

### §II.2 — The Technical Committee

The Technical Committee (TC) is the technical-decision-making body that sits beneath the Board. The TC's composition is fixed: one representative from each of the eight Platinum members, eight total members.[^38][^5] The TC is responsible for defining the requirements for new projects to join AAIF, reviewing project proposals, voting on project admissions, and conducting annual reviews of accepted projects.[^6] Per the AAIF Project Lifecycle Policy, project acceptance requires "an absolute majority vote (>50%) of all members of the Technical Committee," which then refers admitted projects to the Governing Board for final approval.[^6]

The TC meets biweekly. Meetings are recorded and available to anyone on the LFX collaboration platform.[^38] The published TC roster — visible at aaif.io/tc — includes David Soria Parra (Anthropic, MCP co-creator and Lead Maintainer), Nick Cooper (OpenAI MCP Core maintainer and Governing Board member), Alan Blount (Google Cloud Vertex AI Senior Product Manager working across ADK, A2A, MCP, A2UI, and UCP), and Sambhav Kothari (Bloomberg, leads foundational GenAI and agentic platform engineering, MCP maintainer).[^5] The overlap between TC membership and MCP maintainership is structural: AAIF's TC was bootstrapped from existing technical leadership in the founding projects, not appointed independently.[^5][^11]

### §II.3 — Project Lifecycle Policy: Growth, Impact, Emeritus

The AAIF Project Lifecycle Policy, published at github.com/aaif/project-proposals, defines three lifecycle stages a project can occupy: Growth, Impact, and Emeritus.[^6] **Growth-stage** projects are early or under active development; they're eligible for foundation resources (CI/CD infrastructure, marketing, conference visibility) approved by the Governing Board, with quarterly progress reviews against a documented growth plan.[^6] **Impact-stage** projects are mature and widely deployed; entry requires demonstrated production usage at wide scale and adoption metrics that the TC judges to match AAIF's mission scope.[^6] **Emeritus-stage** projects are legacy projects that the foundation continues to host but no longer actively develops.[^6]

Projects can enter AAIF at either Growth or Impact stage based on meeting each stage's requirements; AGENTS.md, with 60,000-plus adopting projects at launch, qualifies for Impact stage by adoption criteria, while goose's earlier-stage maturity at Block fit the Growth profile.[^6][^9][^10] Movement between stages requires a >50% TC vote and Governing Board approval.[^6] Annual reviews evaluate maintainership, community activity, release cadence, security posture, and progress against stated goals; based on the review, the TC may keep a project in its current stage, recommend corrective actions, or transition it to a different stage.[^6]

### §II.4 — Seven working groups

In Q1 2026, the AAIF Governing Board established seven working groups to surface and process domain-specific challenges into Governing Board and TC proposals. The seven WGs are: **identity and trust** (how agentic systems manage identities, establish trust for transactions, and enable autonomy while maintaining a human in the loop), **accuracy and reliability**, **workflows and process integration**, **agentic commerce**, **security and privacy**, **observability and traceability**, and **governance, risk, and regulatory alignment**.[^38] Each WG is chaired by a Platinum or Gold member and is open to all member levels — Silver members can fully participate, even though they don't hold Governing Board seats.[^38][^39]

The WG topics cover the architectural surface AAIF inherits from the broader agent ecosystem. Identity and trust addresses the same problem space documented in perea.ai's earlier coverage of agent wallet architectures and the Visa Trusted Agent Protocol; observability and traceability mirrors the OpenTelemetry GenAI Semantic Conventions work documented in the distributed-agent-observability field manual; agentic commerce is the AP2 + x402 + ACP + Trusted Agent Protocol territory; security and privacy is the threat-modeling territory that the MAESTRO and OWASP MCP frameworks address. Each WG's deliverables are proposals to the Governing Board and TC — not unilateral spec authority — meaning a WG's work product is the input to the formal SEP / project-spec process rather than its replacement.[^38]

### §II.5 — The role of "lazy consensus" and the working-group-proposals repo

Nalley's "lazy consensus" framing — borrowed from Apache governance patterns — is the operational mode for most day-to-day decisions.[^58] A contributor proposes a change in a working group, the proposal sits for a defined comment window, and if no objections surface within the window, the proposal proceeds. Formal votes (>50% TC majority for project admissions, >50% Core Maintainer votes for SEP acceptance) are reserved for decisions that fall outside the lazy-consensus path. The pattern compresses the decision cycle for non-controversial changes while preserving structured voting for genuinely contested decisions.

The `working-group-proposals` repository at github.com/aaif/working-group-proposals is the public-facing venue for proposing new working groups beyond the initial seven.[^40] Anyone can submit a working-group proposal; the TC reviews and the Governing Board approves. As the agentic AI ecosystem surfaces new structural problems — multi-region compliance, cross-protocol fraud detection, agent-to-human handoff patterns, regulatory disclosure — additional WGs are the foundation's surface for absorbing them without burdening any single project's core spec process.[^40][^38]

> ### Quotable Findings II
> - **David Nalley appointed Governing Board chair** Feb 24 2026 at LF Member Summit, Napa CA. AWS Director of Developer Experience, former Apache Software Foundation President (4 years), Internet Security Research Group Board member.[^36][^37]
>
> - **Governing Board roster**: David Nalley (chair, AWS), April Kyle Nassi (Anthropic), Nick Cooper (OpenAI), Chris DiBona (Google), Brendan Irvine-Broque (Cloudflare), Linzy McCartney (Microsoft), Ania Musial (Bloomberg), Erika Rice Scherpelz (Block); Zhong Wu (Shopify) joined Jan 2026 as Gold representative.[^37][^38]
>
> - **Technical Committee composition**: 1 representative per Platinum member (8 total). Biweekly meetings, recorded on LFX. Project admission requires **absolute majority vote (>50%)** of all TC members.[^38][^6]
>
> - **Project Lifecycle Policy** defines three stages (**Growth, Impact, Emeritus**); entry requires trademark transfer to LF + adoption of LF technical charter; annual review covers maintainership, community activity, release cadence, security posture.[^6]
>
> - **Seven working groups (Q1 2026)**: identity-and-trust, accuracy-and-reliability, workflows-and-process-integration, agentic-commerce, security-and-privacy, observability-and-traceability, governance-risk-regulatory-alignment. WGs chaired by Platinum/Gold members, open to all member levels.[^38]
>
> - **"Lazy consensus" governance default**: contributors propose changes and proceed unless objections arise. Formal votes (>50% TC, >50% Core Maintainers) reserved for genuinely contested decisions.[^58]

## Part III — The Three Founding Projects

### §III.1 — MCP: the connectivity layer

Anthropic released the Model Context Protocol on November 25, 2024. By the time of the AAIF launch one year later, MCP was the most widely adopted agent infrastructure protocol in production: 97 million-plus monthly SDK downloads across Python and TypeScript, 10,000-plus active servers in the official registry, and first-class client support across Claude, Cursor, Microsoft Copilot, Gemini, VS Code, and ChatGPT.[^8][^11] Production deployments documented in trade press include Uber, Pinterest, and Duolingo at the application layer, plus deep integrations from AWS, Google Cloud, and Azure at the infrastructure layer.[^26]

The November 25, 2025 spec release — one year after MCP's original launch and two weeks before the AAIF transfer — introduced asynchronous operations, statelessness, server identity, and an official extensions framework.[^8] On the same release cycle, Anthropic added Tool Search and Programmatic Tool Calling capabilities to the Claude API to optimize production-scale MCP deployments handling thousands of tools, plus the official community-driven Registry for discovering available MCP servers.[^8] Per Anthropic's donation announcement: "Since its inception, we've been committed to ensuring MCP remains open-source, community-driven and vendor-neutral. Today, we further that commitment by donating MCP to the Linux Foundation."[^8]

The April 14, 2026 MCP Maintainer Roundtable — convened at MCP Dev Summit NA in New York City and moderated by Stephen O'Grady of RedMonk — surfaced the operational view of MCP at six months post-AAIF. Clare Liguori (AWS) framed MCP's enterprise value as a control point: "MCP has been super valuable for a lot of customers because it provides that control point, that really clearly indicates this is an agent. That's where I see the value of MCP remaining — the ability to put policy and governance and registry and authentication in place, to be able to restrict what agents can do."[^19] David Soria Parra (Anthropic, Lead Maintainer) confirmed governance continuity: "For the project and its governance itself, little has actually changed. MCP has retained its very bottoms-up open-source character."[^19] Nick Cooper (OpenAI MCP Core maintainer) noted that "Security and authentication has been one of the most actively changing parts of the MCP specification of the past year."[^19] Caitie McCaffrey (Microsoft) added: "no one protocol is going to solve all security challenges."[^19] The roundtable's collective framing: MCP is one layer in a broader control architecture that includes gateways, policy systems, registries, and identity controls — not a self-contained security framework.[^19]

### §III.2 — goose: the local-first reference implementation

Block released codename goose on January 28, 2025, as Block's Open Source Program Office's open contribution to the agent framework category.[^18] CTO Dhanji Prasanna framed the release: "Making goose open source creates a framework for new heights of invention and growth. Block engineers are already using goose to free up time for more impactful work, and we're excited to see how our contribution to AI and agents can do the same for our customers and community."[^18] The architectural choice that bound goose to MCP from day one: "goose can connect to these systems using Anthropic's open source Model Context Protocol — a standardized set of APIs and endpoints that connect AI agents to the systems where data lives. Block has been collaborating closely with Anthropic to develop this protocol."[^18]

By the AAIF launch in December 2025, goose had become the canonical reference implementation for MCP-based agent integration. Block engineers had been active MCP contributors since the protocol's first release, and several continue to participate as members of the MCP steering committee.[^10][^26] The post-donation transition was documented in Block's Discussion #7709 on the goose repo: "as of December 2025, goose is a project of the Agentic AI Foundation (AAIF), under the Linux Foundation umbrella. This strengthens neutral governance and helps ensure goose can thrive beyond any single company's internal priorities."[^16] The goose GitHub repo at github.com/block/goose now displays a banner: "goose has moved! This project has moved from `block/goose` to the Agentic AI Foundation (AAIF) at the Linux Foundation."[^15]

The community concern that surfaced after Block's layoffs in early 2026 was about long-term stewardship — what happens to goose if Block deprioritizes the project? The AAIF transfer answered that concern structurally. Per the maintainer response in Discussion #7709: "The AAIF move is probably the most important signal in this post because it reduces the single-company risk the community has been worrying about."[^16] The project's GOVERNANCE.md remains the operational authority on day-to-day decisions, but the foundational governance now sits with AAIF rather than Block.[^16]

### §III.3 — AGENTS.md: the working-group origin story

OpenAI released AGENTS.md on August 19, 2025, as a Markdown file convention for giving AI coding agents project-specific context.[^13] The format specification is intentionally minimal: standard Markdown, no required structure, no required fields, UTF-8 encoding, placed at repository root with monorepo support via nested files in subdirectories.[^14] By the AAIF launch in December 2025, AGENTS.md had been adopted by 60,000-plus open-source projects and frameworks including Amp, Codex, Cursor, Devin, Factory, Gemini CLI, GitHub Copilot, Jules, and VS Code.[^9][^13]

The working-group origin matters more than the specification's brevity suggests. AGENTS.md emerged from "an industry working group convened by OpenAI to define AGENTS.md, a simple, open standard that gives coding agents a predictable way to understand and operate within software projects."[^46] Working-group members included OpenAI Codex, Sourcegraph/Amp, Google's Gemini and Jules teams, Cursor, and Factory.[^46][^48] Factory's August 2025 announcement of its working-group participation captured the design constraints: "the filename and location should be consistent, the content should be readable by both people and tools, and the structure should be flexible enough to work across languages, frameworks, and monorepos."[^46]

The naming compromise has its own substory. Sourcegraph's Geoffrey Huntley published an alternative proposal — AGENT.md (singular) — on July 9, 2025 at github.com/agentmd/agent.md, with Sourcegraph owning the agent.md domain.[^47] The proposal targeted the same problem space (replacing `.cursorrules`, `.windsurfrules`, `.clauderules` with one universal config file) but used the singular form. Per the AGENT.md spec author: "The Amp team is working with other agentic coding tool makers to clean up this mess of filenames. We like AGENT.md because we own the domain name for it and we are committed to keeping it vendor-neutral... but we're willing to compromise."[^47] By the AAIF launch, the working group had unified around AGENTS.md (plural), and Sourcegraph's contributions became part of the AGENTS.md working group rather than a competing standard.[^46][^48][^47]

The AGENTS.md adoption matrix as of late April 2026 shows native support across most major AI coding tools — OpenAI Codex, Google Jules, Gemini CLI, Cursor, Factory's Droids, GitHub Copilot, Windsurf, Aider, Zed, Warp, Kilo Code — with one notable exception: Claude Code does not natively support AGENTS.md and uses CLAUDE.md instead.[^63] The community workaround documented at scale is a symlink (`ln -s AGENTS.md CLAUDE.md`); GitHub issue #6235 on the Claude Code repository, requesting native AGENTS.md support, has accumulated thousands of upvotes from teams running mixed-tool fleets.[^63] As of May 2026, Anthropic had not provided a timeline.[^63]

The active governance discussion at github.com/agentsmd/agents.md (Issue #149, opened February 8, 2026) proposes extending AGENTS.md scope to cover sub-agents, skills, hooks, and rules — pulling in concepts from Cursor and Claude Code plugins toward an industry-aligned packaging model.[^49] The discussion is exactly the kind of cross-project surface AAIF is structurally positioned to host: AGENTS.md is one founding project, but its scope expansion involves the broader "configuration surface area" that working groups across the foundation can coordinate on.[^49][^38]

### §III.4 — Project graduation paths

Each of the three founding projects entered AAIF at the lifecycle stage best matching its maturity. AGENTS.md, with 60K+ adopting projects, qualifies for **Impact stage** by adoption criteria; goose, with thousands of weekly engineers using it but a younger production footprint, fit the **Growth stage** profile; MCP, with 97M+ monthly downloads and adoption across every major LLM platform, qualifies cleanly for **Impact**.[^6][^9][^11][^16] The AAIF Project Lifecycle Policy makes the entry choice explicit: "AAIF has Growth, Impact, and Emeritus lifecycle stages and new projects may enter the AAIF as either Growth or Impact based on meeting each stage's requirements."[^6] Movement between stages requires absolute majority vote of the TC subject to Governing Board approval.[^6]

> ### Quotable Findings III (MCP + goose)
> - **MCP at AAIF transfer**: 97M+ monthly SDK downloads, 10K+ active servers.[^8] First-class clients: Claude, ChatGPT, Cursor, Gemini, VS Code, Copilot.[^11]
>
> - **Production deployments**: Uber, Pinterest, Duolingo at the application layer.[^26]
>
> - **Nov 25 2025 MCP spec release**: asynchronous operations, statelessness, server identity, extensions framework.[^8]
>
> - **goose** released Jan 28 2025 by Block as MCP-based reference implementation.[^18] April 14 2026 Maintainer Roundtable confirmed governance continuity post-AAIF.[^19]

> ### Quotable Findings III (AGENTS.md + lifecycle)
> - **AGENTS.md working group**: OpenAI Codex, Sourcegraph/Amp, Google Jules/Gemini, Cursor, Factory.[^46] 60K+ adopting projects at transfer.[^9] AGENT.md (singular) proposal merged in.[^47]
>
> - **AGENTS.md adoption gap**: Claude Code does NOT natively support AGENTS.md; workaround is symlink CLAUDE.md → AGENTS.md.[^63]
>
> - **Project Lifecycle stages**: Growth or Impact entry; >50% TC vote + Governing Board approval for stage movement.[^6]

## Part IV — The MCP Specification Enhancement Proposal Process

### §IV.1 — SEP-001/932: the foundational governance spec

The Model Context Protocol's formal governance was codified as SEP-001 (later renumbered SEP-932) on July 8, 2025 — five months before the AAIF transfer.[^43] The author was David Soria Parra, MCP Lead Maintainer. The structural choice the SEP made was a four-level hierarchical governance model inspired by Python, PyTorch, and Rust: **Contributors** (anyone who files issues, submits PRs, or participates in discussions; no formal membership), **Maintainers** (responsible for specific components like SDKs or documentation; appointed by Core Maintainers; have write/admin access to their repos), **Core Maintainers** (deep MCP specification expertise; meet bi-weekly; can veto maintainer decisions by majority vote; responsible for protocol evolution), and **Lead Maintainers** (Justin Spahr-Summers and David Soria Parra; can veto any decision; appoint or remove Core Maintainers; admin access to all infrastructure).[^43]

The design choice that matters most for the post-AAIF era is the membership-tied-to-individuals rule. Per SEP-932: "Membership is explicitly tied to individuals rather than companies to ensure decisions prioritize protocol integrity over corporate interests, prevent capture by any single organization, and maintain continuity when individuals change employers."[^43] The pattern is identical to Apache Software Foundation membership: a Maintainer who leaves Anthropic for OpenAI takes their Maintainer status with them, not their employer. The rule structurally prevents the version of capture where a corporate parent could threaten to revoke an individual's project authority.[^43]

The MCP governance model the AAIF transfer preserves is exactly what SEP-932 codifies: the same Lead Maintainers, the same Core Maintainer cohort, the same SEP review cadence (every two weeks), the same individual-membership rule. Per David Soria Parra's announcement post the day of the AAIF transfer: "For MCP little changes. The governance model we introduced earlier this year continues as is. The people making decisions about the protocol are still the maintainers who have been stewarding it, guided by community input through our SEP process."[^11]

### §IV.2 — SEP-1850: PR-based SEP workflow

The SEP process initially used GitHub Issues for proposal authoring. SEP-1850 (Final, November 20 2025) migrated the workflow to pull requests against the `seps/` directory in the specification repository, inspired by Python's PEP process.[^45] The architectural reasons documented in the November 28 2025 announcement post by David Soria Parra: GitHub Issues split the proposal text from the implementation PR (creating two distinct numbers referencing the same SEP, harder to track changes), and Issues lacked the version-control history that files in a repo provide.[^45] The PR-based model addresses both: the PR number becomes the SEP number, all discussion lives in one place, and git tracks every revision.

The new workflow is explicit. (1) Draft a SEP as a markdown file named `0000-your-feature.md`. (2) Create a pull request adding it to `seps/`. (3) Once the PR exists, rename the file to use the PR number (e.g., PR #1850 → `1850-your-feature.md`). (4) Find a sponsor from the maintainer list. (5) Iterate on feedback in the PR until the sponsor moves status to `In-Review`, then formal review by Core Maintainers (every two weeks). (6) The Core Maintainers vote: Accepted, Rejected, or returned for revision. (7) Once Accepted, reference implementation must be completed before status changes to Final.[^45][^41]

Sponsors are Core Maintainers or Maintainers who champion a SEP through review. Sponsor responsibilities include providing constructive feedback, requesting changes based on community input, updating the SEP status as the proposal progresses, initiating formal review, and presenting at Core Maintainer meetings.[^41] The seven SEP status states are Draft → In-Review → Accepted → Final, with off-paths Rejected, Withdrawn, Superseded, and Dormant (no sponsor for 6 months).[^42]

### §IV.3 — The SEP catalog: 28 Final, 2 Accepted, 1 Approved

As of late April 2026, the MCP SEP catalog at modelcontextprotocol.io/community/seps shows 28 SEPs in Final state, 2 Accepted, and 1 Approved.[^42] The process-track SEPs that codify governance are particularly load-bearing: SEP-932 (MCP Governance, July 2025), SEP-1302 (Working Groups and Interest Groups, August 2025), SEP-1850 (PR-Based SEP Workflow, November 2025), SEP-2085 (Governance Succession and Amendment Procedures, December 2025), SEP-2148 (MCP Contributor Ladder, January 2026), SEP-2149 (MCP Group Governance and Charter Template, January 2026).[^42] The standards-track SEPs change the protocol surface itself: SEP-2133 (Extensions Framework, January 2026), SEP-2260 (Server requests associated with Client requests, February 2026), SEP-2322 (Multi Round-Trip Requests, February 2026).[^42]

### §IV.4 — Worked example: SEP-2133 Extensions Framework

SEP-2133 is the cleanest example of the SEP review cycle shipping a meaningful protocol change. Author: Peter Alexander (pja-ant). Created January 22, 2026, as a PR against the `seps/` directory. Closed and merged January 26, 2026 — a four-day review cycle from proposal to Final status.[^44] The unanimous vote tally: 7 yes, 2 yes-with-changes, 0 no.[^44] The SEP established the framework for extending MCP through optional, composable extensions while maintaining core protocol stability — a governance and presentation structure that lets the ecosystem evolve without forcing adoption across all implementations.[^44]

The technical surface the SEP defines is non-trivial. **Extension identifiers** use reverse-domain notation with extension name (e.g., `io.modelcontextprotocol/oauth-client-credentials`), echoing the Java package naming convention. **Official extensions** live under `github.com/modelcontextprotocol/ext-*` repositories. A new SEP type — Extensions Track — is introduced, following the same review process as Standards Track SEPs but clearly indicating extension-versus-core scope. **Capability negotiation** happens via the `extensions` field in `ClientCapabilities` and `ServerCapabilities`. The SEP includes legal-grade provisions: trademark, antitrust, licensing, and contributor-license-grant requirements.[^44]

The SEP's worth as a governance signal is the four-day cycle from creation to acceptance. Compare this to typical IETF working-group cycles (often years) or even fast-moving CNCF graduation reviews (months): the MCP SEP process is designed for rapid iteration on a protocol that's still actively expanding production usage. The unanimous vote is a sign of consensus around the extensions framing, but the broader signal is that MCP's governance can ship structural changes at the speed the ecosystem demands while preserving the structured-vote backstop for when consensus breaks down.[^44]

### §IV.5 — The anti-capture mechanism

The structural protection against single-vendor capture is the combination of three rules: (1) membership tied to individuals, not companies (SEP-932); (2) Core Maintainer veto requires majority vote, not single-actor authority (SEP-932); (3) Lead Maintainer veto exists but is paired with the requirement to "appoint and remove Core Maintainers" — meaning Lead Maintainer authority is bounded by the requirement to maintain a functioning Core Maintainer team.[^43] The Linux Foundation's neutrality stewardship adds the fourth rule: trademark transfer is irreversible, so even if Anthropic exerted maximum unfriendly pressure, the MCP trademark cannot be repatriated.[^6]

The remaining capture vector — the one The Rift's coverage flagged — is the "AAIF will set up a community-elected technical steering committee, with Anthropic holding one non-veto seat — emulating governance models like Kubernetes and PyTorch."[^29] The framing is consistent with Anthropic's other public commitments: the company has structurally subordinated its own protocol authority to the foundation's neutral governance, while preserving the practical contribution authority that comes from employing the project's Lead Maintainers.[^29][^11]

> ### Quotable Findings IV
> - **SEP-001/932 MCP Governance** (David Soria Parra, July 2025): four-level hierarchy Contributors → Maintainers → Core Maintainers → Lead Maintainers. Lead Maintainers (Justin Spahr-Summers + David Soria Parra) can veto any decision; Core Maintainers meet bi-weekly.[^43]
>
> - **Membership tied to individuals, not companies** — explicit anti-capture mechanism. A Maintainer who changes employers takes their authority with them.[^43]
>
> - **SEP-1850** (Nov 2025) migrated SEP workflow from GitHub Issues to PRs in `seps/` directory, inspired by Python's PEP process. PR number becomes SEP number; git tracks revisions.[^45]
>
> - **SEP catalog as of April 2026**: 28 Final, 2 Accepted, 1 Approved. Process SEPs codify governance (Working Groups, Contributor Ladder, Charter Template, Succession + Amendment); Standards SEPs change the protocol surface.[^42]
>
> - **SEP-2133 Extensions Framework**: 4-day acceptance cycle (Jan 22 → Jan 26 2026), unanimous 7y/2y-with-changes/0n vote. Reverse-domain identifier scheme (`io.modelcontextprotocol/oauth-client-credentials`); capability negotiation via `extensions` field.[^44]

## Part V — The Parallel A2A Track

### §V.1 — A2A is a separate Linux Foundation project, not under AAIF

The structural fact most secondary-source coverage gets wrong is the relationship between A2A and AAIF. Many trade-press analyses describe AAIF as hosting both MCP and A2A — a clean two-protocol foundation story.[^60][^33] The authoritative LF press releases tell a different structure: A2A is a separate Linux Foundation project that predates AAIF by six months and operates under its own governance.[^50][^53] The June 23, 2025 LF press release at the Open Source Summit North America in Denver was unambiguous: "The Linux Foundation, the nonprofit organization enabling mass innovation through open source, today announced the launch of the Agent2Agent (A2A) project, an open protocol created by Google for secure agent-to-agent communication and collaboration."[^50] A2A's founding governance members at LF launch were AWS, Cisco, Google, Microsoft, Salesforce, SAP, and ServiceNow — overlapping with AAIF's Platinum members but a structurally distinct cohort with its own Technical Steering Committee.[^50][^53]

The A2A Project repository at github.com/a2aproject/A2A confirms the licensing and governance independence: Apache License 2.0 (inherited from Google's donation; AAIF projects can use a range of OSI-approved permissive licenses), separate maintainer roster, separate release cadence.[^53] The Encyclopedia of Agentic Coding Patterns puts the distinction crisply: "A2A is hosted directly by the Linux Foundation, not under the separately formed Agentic AI Foundation that anchors MCP, goose, and AGENTS.md."[^60] Stellagent's April 9, 2026 A2A Year One analysis maintains the same distinction in its governance comparison matrix: A2A governance is "Linux Foundation (June 2025)"; MCP governance is "Linux Foundation / AAIF (Dec 2025)."[^62]

### §V.2 — A2A v1.0 milestones and adoption

Google announced the A2A protocol on April 9, 2025. Two months later, on June 23, 2025, Google donated A2A to the Linux Foundation at OSS NA Denver. Six months after that, on March 12, 2026, the project shipped A2A v1.0 — the first stable, fully production-ready version of the standard.[^54][^53] The April 9, 2026 LF press release marking the project's one-year anniversary documented the adoption metrics: 150-plus supporting organizations (up from 50 at launch), 22,000-plus stars on the core repository, and SDK ecosystem expansion from a single Python implementation to five production-ready languages — Python, JavaScript, Java, Go, and .NET.[^52] Native integration shipped across the three hyperscalers' agent platforms: Microsoft Azure AI Foundry, Amazon Bedrock AgentCore Runtime, and Google Vertex AI.[^52][^59]

The A2A v1.0 specification introduced four production-grade primitives that v0.3 lacked: (1) cryptographically signed Agent Cards, letting clients verify that a given Agent Card was actually issued by the domain it claims to represent; (2) multi-tenancy support so a single endpoint can host many agents — important for SaaS platforms that serve many customers from shared infrastructure; (3) gRPC alongside JSON-RPC as peer transport bindings; and (4) three task-delivery modes (polling, streaming over Server-Sent Events, webhooks) lets teams pick whatever fits the deployment they already have.[^60][^59] Per Microsoft Partner API Architect Darrel Miller: "For AI agents to be effective in enterprise environments, they need to operate seamlessly across organisational and platform boundaries. The momentum behind A2A underscores the importance of open, interoperable standards for enabling multi-agent collaboration."[^52]

### §V.3 — Why MCP and A2A live in different governance trees

The structural reason A2A is not under AAIF is sequencing: A2A's transition to LF (June 2025) preceded AAIF's formation (December 2025) by six months.[^50][^1] When AAIF was created, A2A already had its own established governance — TSC composition, release cadence, IETF-style transport-binding processes, partner program — so absorbing it would have required restructuring an actively-shipping protocol's governance with no clear benefit. The cleaner option was to create AAIF as a sibling LF project focused on the projects that did need vendor-neutral governance from day one: MCP, goose, and AGENTS.md.[^11][^53]

The architectural implication for production teams is that integrating both protocols means navigating two distinct LF governance trees. A team adopting MCP gets one Technical Steering Committee, one SEP process, and one release cadence; adding A2A introduces a second TSC, a separate spec-change process, and a different cadence.[^53][^11] The April 9, 2026 LF press release at A2A's anniversary explicitly noted the architecture: "At the standards level, A2A is complementary to the Model Context Protocol (MCP), another Linux Foundation project."[^52] The framing — "another Linux Foundation project," not "another AAIF project" — is the structural fact production teams need to plan around.[^52]

### §V.4 — The pending joint interoperability specification

The cross-project bridge nobody has shipped is the formal joint interoperability specification between MCP and A2A. Industry roadmaps anticipated the work on a Q3 2026 timeline: per the Meta-Intelligence December 2025 governance roadmap, "2026 Q1: A2A v1.0 stable release, MCP v2.0 adds Streamable HTTP transport and OAuth 2.1 authentication; 2026 Q2: Interoperability specification draft published, defining reference architecture and best practices for joint A2A-MCP usage; 2026 Q3: First Joint Interop Spec v1.0 officially released, with reference implementations and compliance test suites; 2026 Q4: Certification program launches, allowing vendors to submit products for interoperability compliance certification."[^30] Zylos Research's March 2026 analysis confirmed the trajectory: "MCP/A2A interoperability effort: According to industry commentary, a joint interoperability specification effort involving Google, Anthropic, and other AAIF members is anticipated. The goal would be defining how MCP tool invocations can trigger A2A agent delegations and vice versa — the formal bridge between the two layers that the ecosystem needs."[^27]

As of May 2026, no draft of the joint specification has been published. The structural mechanism most likely to host the work is a cross-project working group spanning AAIF (where MCP lives) and the A2A Project (where A2A lives), with shared TC participation from both governance trees. The seven AAIF working groups established in Q1 2026 include candidates that align with cross-protocol scope: identity-and-trust (agent-to-agent identity verification), workflows-and-process-integration (where MCP tool invocations and A2A agent delegations interact), and observability-and-traceability (where cross-protocol trace propagation lives).[^38]

### §V.5 — Architectural implication for production deployments

The architectural rule for teams shipping production agent systems against both protocols today is simple: implement MCP for tool integration (non-negotiable for production systems where the question is just "which servers"), add A2A for multi-agent coordination (the ecosystem expects it), build Agent Card endpoints for discovery, invest in observability at the protocol layer, and design authorization with delegation chains from day one. Per Zylos Research's March 2026 architectural recommendation: "Monitor the June 2026 MCP spec and Q3 joint interoperability specification as the next inflection points."[^27]

The trade-off the dual-tree governance forces on teams is that protocol-level changes ship at the speed of the slower governance path. MCP's SEP cycle ships standards-track changes in 4-7 days when the proposal has clear consensus (per SEP-2133's January 2026 cycle); A2A's release cycle is monthly-to-quarterly per its 1.0 release pattern. A change that requires both protocols to coordinate — say, a unified observability attribute schema for cross-protocol traces — has to navigate both processes with both timelines.[^44][^53]

> ### Quotable Findings V
> - **A2A is a separate Linux Foundation project, not under AAIF.** Donated by Google June 23 2025 at OSS NA Denver — six months before AAIF's December 2025 formation. Founding LF governance: AWS, Cisco, Google, Microsoft, Salesforce, SAP, ServiceNow.[^50][^53]
>
> - **A2A v1.0 (March 12 2026)**: signed Agent Cards, multi-tenancy, gRPC transport binding, three task-delivery modes (polling, streaming, webhooks). Apache 2.0 license inherited from Google donation.[^60][^53]
>
> - **A2A adoption Year One (April 9 2026)**: 150+ supporting organizations, 22K+ GitHub stars, SDKs in five production languages (Python, JavaScript, Java, Go, .NET). Native integration in Microsoft Azure AI Foundry, AWS Bedrock AgentCore, Google Vertex AI.[^52][^59]
>
> - **Two distinct governance trees**: MCP under AAIF, A2A as parallel LF project. Production teams integrating both navigate two TSCs, two SEP/spec processes, two release cadences.[^52][^11][^53]
>
> - **Joint interoperability specification anticipated Q3 2026**: bridges MCP tool invocations and A2A agent delegations. Certification program follows in Q4 2026 per industry roadmaps. As of May 2026, no draft has been published.[^30][^27]

## Part VI — The 2026 Events Program

### §VI.1 — The flagship: AGNTCon + MCPCon Europe and North America

On April 2, 2026, AAIF announced its expanded 2026 global events program — a calendar designed to convene the agentic AI ecosystem across ten cities on four continents.[^56] The lineup is anchored by two flagship events. **AGNTCon + MCPCon Europe** runs September 17-18, 2026, in Amsterdam at the RAI Amsterdam venue (Europaplein 24, 1078 GZ Amsterdam, Netherlands).[^55] **AGNTCon + MCPCon North America** runs October 22-23, 2026, in San Jose, California.[^56] Together these events are designed to be the foundation's flagship gatherings — bringing together the companies and developers building the infrastructure for interoperable, production-ready AI agents.[^56]

The naming convention matters. "AGNTCon + MCPCon" pairs the broader agentic AI conference with the MCP-specific developer summit, signaling that the foundation's events span both the cross-project agentic ecosystem and the MCP-specific contributor community. The Amsterdam event was confirmed for the RAI venue and dated for September 17-18; the San Jose event was scheduled for October 22-23 with location-specific details continuing to be finalized through May 2026.[^55][^56]

### §VI.2 — MCP Dev Summits across ten cities

Supporting the flagship events is a regional series of MCP Dev Summits designed to deepen hands-on engagement with the open technologies and standards powering agentic systems — MCP, goose, and AGENTS.md.[^56] The complete 2026 lineup: **New York City** (April 2-3, the inaugural event of the year, 95-plus sessions), **Bengaluru** (June 9-10, at one of the world's largest hubs for AI engineering talent), **Mumbai** (June 14-15, co-located with OpenSearchCon India, OSS India, and KubeCon + CloudNativeCon India), **Seoul** (August 13-14), **Shanghai** (September 6-7, co-located with KubeCon + CloudNativeCon China + OpenInfra Summit + PyTorch Conference China), **Tokyo** (September 10-11), **Toronto** (October 5-6), and **Nairobi** (November 19-20).[^56][^42]

The April 2-3 NYC event was the first in the series. The April 14, 2026 AAIF blog post following the event documented the 95-plus sessions, the maintainer roundtable (Liguori AWS / Soria Parra Anthropic / McCaffrey Microsoft / Cooper OpenAI; moderated by O'Grady RedMonk), and the Day 0 pre-conference workshop format.[^57][^19] Registration scholarships and a Linux Foundation Travel Fund were established to enable open-source developers and community members who otherwise wouldn't be able to attend due to funding limitations.[^57]

### §VI.3 — Why ten cities matter

The ten-city events footprint is structurally important to AAIF's governance model. Working groups conduct their substantive deliberations in part through public sessions at events; new contributors discover the foundation through regional summits before signing up for working-group participation; cross-vendor coordination happens face-to-face in ways that GitHub PR threads can't replicate.[^58][^38] The geographic distribution — North America (NYC, Toronto, San Jose), Europe (Amsterdam), Asia (Bengaluru, Mumbai, Seoul, Shanghai, Tokyo), and Africa (Nairobi) — expands the contributor pool beyond the US-coastal incumbents who dominated the founding membership cohort.[^56]

### §VI.4 — The Linux Foundation Member Summit and AAIF Q1 update

Beyond the AAIF-specific events, AAIF business gets transacted at the broader Linux Foundation calendar. The February 24-25, 2026 Linux Foundation Member Summit in Napa, California, was the venue for the David Nalley Governing Board chair appointment, the 97-new-member announcement, and Nalley's first published Q1 update.[^36][^38] The pattern matches the established LF cadence: foundations use the LF Member Summit for governance announcements and the in-domain conferences (KubeCon, PyTorch Conference, MCP Dev Summit) for technical work.[^58]

> ### Quotable Findings VI
> - **AAIF 2026 flagship events**: AGNTCon + MCPCon Europe (Amsterdam Sept 17-18, RAI Amsterdam venue) + AGNTCon + MCPCon North America (San Jose Oct 22-23).[^55][^56]
>
> - **MCP Dev Summit 2026 cities**: NYC (April 2-3), Bengaluru (June 9-10), Mumbai (June 14-15, co-located with KubeCon India), Seoul (Aug 13-14), Shanghai (Sept 6-7, co-located with KubeCon China + PyTorch China), Tokyo (Sept 10-11), Toronto (Oct 5-6), Nairobi (Nov 19-20).[^56]
>
> - **NYC inaugural summit (April 2-3 2026)**: 95+ sessions, MCP Maintainer Roundtable (Liguori/Soria Parra/McCaffrey/Cooper, moderated O'Grady-RedMonk), LF Travel Fund + scholarships available.[^57][^19]
>
> - **Governance announcements at LF Member Summit**: Feb 24-25 2026 Napa CA hosted the David Nalley chair appointment, 97-new-member announcement, and Nalley's published Q1 update on working-group establishment and TC operations.[^36][^38]

## Part VII — Threats, Open Questions, Out of Scope

### §VII.1 — Threats AAIF's structure does not eliminate

Three structural critiques deserve naming. First, the **directed-fund concentration risk**: even with trademark transfer to LF and structurally enforced neutrality, the early reference implementations and contributor base concentrate at the founding companies. AI CERTs News surfaced this critique cleanly: "TechCrunch noted that directed funds preserve neutrality. However, it warned that early reference code may still dictate real-world defaults. Nevertheless, AAIF leaders promise open-competition for alternative implementations."[^61] The structural answer is that the LF's track record (Kubernetes, PyTorch, Node.js) shows that founding-company dominance erodes over multi-year horizons as the contributor base expands.[^61][^58]

Second, the **lazy-consensus drift risk**: Nalley's stated default of "lazy consensus" is efficient for non-controversial decisions, but it carries a structural risk that decisions made without explicit votes can drift toward incumbent preferences when minority voices lack resources to formally object within the lazy-consensus comment window.[^58] The mitigation mechanism is the formal vote backstop (>50% TC for project decisions, >50% Core Maintainer for SEP decisions), but the backstop only fires when someone explicitly invokes it.[^6][^41]

Third, the **member-count vs active-contributor gap**: 146 members is impressive for a 5-month-old foundation, but the question is what fraction of that membership translates to active contribution versus badge collection. ChatForest's April 2026 governance analysis raised this exact concern: "Whether 146 members translates to 146 active contributors or mostly badge-collecting."[^26] Member dues fund foundation operations regardless of contribution depth — meaning a foundation can be financially healthy and contribution-anemic simultaneously.[^26][^58]

### §VII.2 — Open questions builders should track

Several questions remain genuinely open in May 2026. **A2A → AAIF migration path**: will A2A formally join AAIF, or stay parallel? The structural case for absorption is the simplification of cross-protocol governance; the structural case for staying parallel is that A2A's governance was working before AAIF existed and absorption would introduce restructuring overhead with unclear benefit.[^52][^53] **Cross-project AAIF specifications**: what does AAIF ship as foundation-level specifications beyond the project-level work in MCP, goose, and AGENTS.md? Working-group deliverables become Governing Board / TC proposals — but the path from a working-group proposal to a foundation-level specification has not yet been exercised.[^38] **goose post-Block GOVERNANCE.md**: the goose project's governance file was authored at Block; what is its post-AAIF authority structure?[^16] **AAIF Charter publication**: the Project Lifecycle Policy is public, but the foundation's full charter (including dispute-resolution procedures, IP policy specifics, member-removal procedures) had not surfaced as a public document as of May 2026.[^6][^39]

### §VII.3 — Out of scope and why

This paper does not cover the detailed protocol mechanics of MCP, A2A, AGENTS.md, or goose — each warrants its own field manual, and several already exist in the perea.ai canon. It does not document specific working-group deliverables because the WGs are too early to evaluate (most established Q1 2026, deliverables in flight). It does not compare AAIF to non-LF foundations (CNCF, OpenSSF, Apache Software Foundation) because the comparison would require its own governance-architecture paper. It does not predict which specific projects AAIF will admit next; the working-group-proposals repository pipeline is the public surface for tracking incoming candidates.[^40]

### §VII.4 — Where the field is going

Three trajectories are visible in the public artifacts of mid-2026. First, the **certification program** anticipated for Q4 2026: per industry roadmaps, AAIF intends to launch a conformance certification process letting vendors submit products for interoperability compliance against MCP+A2A integration test suites.[^30] Second, **cross-protocol budget tracking**: a single agent transaction can fan out across A2A, MCP, AP2, x402, and Visa TAP boundaries, each with its own observability semantics. The AAIF observability-and-traceability working group is the foundation's surface for surfacing a cross-protocol budget-tracking specification.[^38] Third, **AAIF acceptance of additional projects**: the working-group-proposals GitHub repository signals an incoming pipeline. Per Nalley's Q1 update: "Given the incredible interest and enthusiasm we have received from members excited to participate and bring their technologies to the AAIF, we expect to see more exciting announcements on the new AAIF blog going forward."[^38]

## Closing

The shift December 9, 2025 named is from "MCP-as-Anthropic-spec" to "MCP-under-AAIF." The shift June 23, 2025 named is from "A2A-as-Google-spec" to "A2A-as-LF-project." The shift the joint interoperability specification will name — when it ships — is from two parallel governance trees to one cross-protocol surface. Builders shipping production agent stacks today integrate against three governance surfaces (AAIF, A2A Project, the TBD interop spec) and one substrate (the Linux Foundation). The directed-fund mechanic, the seven working groups, the SEP process, the membership tier mechanics, the ten-city events calendar, and the structurally-individual-not-corporate maintainer rule together constitute the governance layer. The technical primitives — MCP for agent-to-tool, A2A for agent-to-agent, AGENTS.md for repository-to-coding-agent, goose as MCP reference implementation — together constitute the protocol layer.

The question for engineering leaders deciding what to anchor production agent stacks against is no longer "which proprietary stack do we bet on." That question is structurally answered: you anchor against vendor-neutral foundation governance, and you accept the trade-off that foundation-paced spec evolution is slower than single-vendor spec evolution but more durable. The remaining engineering decisions — which working groups to participate in, which specifications to track, which events to send contributors to — are the implementation details of operating inside the foundation governance model, not the substitutes for it.

## Glossary

**AAIF** · Agentic AI Foundation, directed fund under LF, formed Dec 9 2025. **MCP** · Model Context Protocol, agent-to-tool standard donated by Anthropic. **A2A** · Agent2Agent Protocol, separate LF project (not under AAIF). **AGENTS.md** · Markdown convention for AI coding agents, donated by OpenAI. **goose** · Local-first AI agent framework donated by Block. **SEP** · Specification Enhancement Proposal. **Lead Maintainer** · MCP's highest tier; can veto any decision. **Core Maintainer** · meets bi-weekly; vetoes by majority vote. **TC** · Technical Committee, 1 rep per Platinum member, >50% vote. **Governing Board** · chaired by David Nalley. **Directed Fund** · LF mechanism for domain-specific foundations. **Lazy Consensus** · default mode; proceed unless objections. **Project Lifecycle** · Growth / Impact / Emeritus. **AGNTCon / MCPCon** · AAIF flagship events. **AGENT.md (singular)** · Sourcegraph's proposal merged into AGENTS.md.

## References

[^1]: Linux Foundation. "Linux Foundation Announces the Formation of the Agentic AI Foundation." linuxfoundation.org. December 9, 2025. https://www.linuxfoundation.org/press/linux-foundation-announces-the-formation-of-the-agentic-ai-foundation

[^5]: Agentic AI Foundation. "Technical Committee." aaif.io/tc. https://aaif.io/tc/

[^6]: Agentic AI Foundation. "Project Lifecycle Policy." github.com/aaif/project-proposals. https://github.com/aaif/project-proposals/blob/main/governance/project-lifecycle-policy.md

[^7]: PR Newswire. "Linux Foundation Announces the Formation of the AAIF." prnewswire.com. December 9, 2025. https://www.prnewswire.com/news-releases/linux-foundation-announces-the-formation-of-the-agentic-ai-foundation-aaif-anchored-by-new-project-contributions-including-model-context-protocol-mcp-goose-and-agentsmd-302636897.html

[^8]: Anthropic. "Donating the Model Context Protocol and establishing the Agentic AI Foundation." anthropic.com. December 9, 2025. https://www.anthropic.com/news/donating-the-model-context-protocol-and-establishing-of-the-agentic-ai-foundation

[^9]: OpenAI. "OpenAI co-founds the Agentic AI Foundation under the Linux Foundation." openai.com. December 9, 2025. https://openai.com/index/agentic-ai-foundation/

[^10]: Block. "Block, Anthropic, and OpenAI Launch the Agentic AI Foundation." block.xyz. December 9, 2025. https://block.xyz/inside/block-anthropic-and-openai-launch-the-agentic-ai-foundation

[^11]: Model Context Protocol Blog (David Soria Parra). "MCP joins the Agentic AI Foundation." blog.modelcontextprotocol.io. December 9, 2025. https://blog.modelcontextprotocol.io/posts/2025-12-09-mcp-joins-agentic-ai-foundation/

[^13]: openai/agents.md. "GitHub repository." github.com. August 19, 2025. https://github.com/openai/agents.md/

[^14]: DeepWiki. "AGENTS.md Format Overview and Specification." deepwiki.com. https://deepwiki.com/openai/agents.md/5.1-format-overview-and-specification

[^15]: block/goose. "GitHub repository (now AAIF)." github.com. https://github.com/block/goose

[^16]: block/goose Discussion #7709. "Project Momentum, Grants, and Long-Term Stewardship." github.com. https://github.com/block/goose/discussions/7709

[^18]: Block. "Block Open Source Introduces 'codename goose'." block.xyz. January 28, 2025. https://block.xyz/inside/block-open-source-introduces-codename-goose

[^19]: Agentic AI Foundation Blog. "MCP Maintainer Roundtable: Control, Security, And Quality." aaif.io. April 14, 2026. https://aaif.io/blog/mcp-maintainer-roundtable-control-security-and-quality/

[^22]: TechCrunch (Bellan). "OpenAI, Anthropic, and Block join new Linux Foundation effort." techcrunch.com. December 9, 2025. https://techcrunch.com/2025/12/09/openai-anthropic-and-block-join-new-linux-foundation-effort-to-standardize-the-ai-agent-era/

[^25]: ItsFOSS. "Linux Foundation Launches Agentic AI Foundation." itsfoss.com. December 10, 2025. https://itsfoss.com/news/agentic-ai-foundation-launch/

[^26]: ChatForest. "The Agentic AI Foundation: What Happens When Competitors Co-Govern an Open Standard." chatforest.com. April 6, 2026. https://chatforest.com/guides/agentic-ai-foundation-mcp-governance/

[^27]: Zylos Research. "Agent Interoperability Protocols 2026: MCP, A2A, ACP and the Path to Convergence." zylos.ai. March 26, 2026. https://zylos.ai/research/2026-03-26-agent-interoperability-protocols-mcp-a2a-acp-convergence

[^29]: The Rift. "Anthropic Transfers Model Context Protocol to Linux Foundation's AAIF." therift.ai. https://www.therift.ai/news-feed/anthropic-transfers-model-context-protocol-to-linux-foundation-s-agentic-ai-foundation-for-open-standards

[^30]: Meta-Intelligence. "A2A and MCP Protocol Integration Guide." meta-intelligence.tech. December 1, 2025. https://www.meta-intelligence.tech/en/insight-a2a-mcp.html

[^33]: AI Agents Plus. "OpenAI, Google, Anthropic Launch Agentic AI Foundation." ai-agentsplus.com. March 5, 2026. https://www.ai-agentsplus.com/blog/agentic-ai-foundation-aaif-launch

[^36]: Linux Foundation. "Agentic AI Foundation Welcomes 97 New Members As Demand for Open, Collaborative Agent Standardization Increases." linuxfoundation.org. February 24, 2026. https://www.linuxfoundation.org/press/agentic-ai-foundation-welcomes-97-new-members

[^37]: Agentic AI Foundation. "Governing Board." aaif.io/board. https://aaif.io/board/

[^38]: AAIF Blog (David Nalley). "AAIF's First Quarter Success Story: New Members, Technical Wins, and Open Governance." February 24, 2026. https://go.aws/4rKcxs3

[^39]: Agentic AI Foundation. "Members + Pricing." aaif.io/members. https://aaif.io/members

[^40]: Agentic AI Foundation. "GitHub organization." github.com/aaif. https://github.com/aaif

[^41]: Model Context Protocol. "SEP Guidelines." modelcontextprotocol.io. https://modelcontextprotocol.io/community/sep-guidelines

[^42]: Model Context Protocol. "Specification Enhancement Proposals (SEP) Index." modelcontextprotocol.io. https://modelcontextprotocol.io/community/seps

[^43]: Model Context Protocol. "SEP-932: Model Context Protocol Governance." modelcontextprotocol.io. July 8, 2025. https://modelcontextprotocol.io/community/seps/932-model-context-protocol-governance.md

[^44]: modelcontextprotocol/modelcontextprotocol Issue #2133. "SEP-2133: Extensions framework for MCP." github.com. January 22, 2026. https://github.com/modelcontextprotocol/modelcontextprotocol/issues/2133

[^45]: Model Context Protocol Blog (David Soria Parra). "SEPs Are Moving to Pull Requests." github.com/modelcontextprotocol. November 28, 2025. https://github.com/modelcontextprotocol/modelcontextprotocol/blob/ff960c9e/blog/content/posts/2025-11-28-sep-process-update.md

[^46]: Factory.ai. "Factory joins AGENTS.md collaboration with OpenAI." factory.ai. https://www.factory.ai/agents-md

[^47]: agentmd/agent.md (Geoffrey Huntley, Sourcegraph). "AGENT.md spec." github.com. July 2025. https://github.com/agentmd/agent.md

[^48]: agents.md. "AGENTS.md homepage." https://agents.md/

[^49]: agentsmd/agents.md Issue #149. "Proposal: Expand AGENT.md scope to cover sub-agents." github.com. February 8, 2026. https://github.com/agentsmd/agents.md/issues/149

[^50]: Linux Foundation. "Linux Foundation Launches the Agent2Agent Protocol Project." linuxfoundation.org. June 23, 2025. https://www.linuxfoundation.org/press/linux-foundation-launches-the-agent2agent-protocol-project-to-enable-secure-intelligent-communication-between-ai-agents

[^52]: Linux Foundation. "A2A Protocol Surpasses 150 Organizations, Lands in Major Cloud Platforms." linuxfoundation.org. April 9, 2026. https://www.linuxfoundation.org/press/a2a-protocol-surpasses-150-organizations-lands-in-major-cloud-platforms-and-sees-enterprise-production-use-in-first-year

[^53]: a2aproject/A2A. "GitHub repository." github.com. https://github.com/a2aproject/A2A

[^54]: Google Open Source Blog (Patricia Cruz). "A year of open collaboration: Celebrating the anniversary of A2A." opensource.googleblog.com. April 1, 2026. http://opensource.googleblog.com/2026/04/a-year-of-open-collaboration-celebrating-the-anniversary-of-a2a.html

[^55]: Agentic AI Foundation. "Events." aaif.io/events. https://aaif.io/events/

[^56]: Linux Foundation. "Agentic AI Foundation Announces Global 2026 Events Program Anchored by AGNTCon + MCPCon North America and Europe." linuxfoundation.org. April 2, 2026. https://www.linuxfoundation.org/press/agentic-ai-foundation-announces-global-2026-events-program-anchored-by-agntcon-mcpcon-north-america-and-europe

[^57]: Linux Foundation. "Agentic AI Foundation Unveils MCP Dev Summit North America 2026 Schedule." linuxfoundation.org. February 23, 2026. https://www.linuxfoundation.org/press/agentic-ai-foundation-unveils-mcp-dev-summit-north-america-2026-schedule

[^23]: InfoWorld (Krill). "Linux Foundation launches Agentic AI Foundation." infoworld.com. December 10, 2025. https://www.infoworld.com/article/4103664/linux-foundation-launches-agentic-ai-foundation.html

[^24]: InfoQ. "OpenAI and Anthropic Donate AGENTS.md and Model Context Protocol." infoq.com. December 23, 2025. https://www.infoq.com/news/2025/12/agentic-ai-foundation/

[^31]: AllAboutAI (Hanif). "OpenAI, Block & Anthropic Form AAIF." allaboutai.com. December 10, 2025. https://www.allaboutai.com/ai-news/openai-anthropic-and-block-to-form-agentic-ai-foundation/

[^32]: TelecomTV. "Linux Foundation announces the formation of the Agentic AI Foundation." telecomtv.com. December 10, 2025. http://www.telecomtv.com/content/ai/linux-foundation-announces-the-formation-of-the-agentic-ai-foundation-aaif-54482/

[^34]: Tech Bytes (Chowdary). "Agentic AI Alliance: MCP, Agents.md & Open Standards." techbytes.app. March 28, 2026. https://techbytes.app/posts/agentic-ai-alliance-mcp-agents-md-open-standards/

[^58]: The AI Innovator (Yao). "Linux's New Agentic AI Standards Body Is Here and Growing Fast." theaiinnovator.com. April 17, 2026. https://theaiinnovator.com/linuxs-new-agentic-ai-standards-body-is-here-and-growing-fast/

[^59]: AgentMarketCap. "Google A2A Protocol at One Year: 150+ Orgs, Cloud Giant Buy-In." agentmarketcap.ai. April 12, 2026. https://agentmarketcap.ai/blog/2026/04/12/google-a2a-protocol-state-2026-adoption-enterprise

[^60]: Encyclopedia of Agentic Coding Patterns. "A2A (Agent-to-Agent Protocol)." aipatternbook.com. https://aipatternbook.com/a2a

[^61]: AI CERTs News. "Linux Foundation's Quiet Grants Strengthen FOSS Security." aicerts.ai. March 18, 2026. https://www.aicerts.ai/news/linux-foundations-quiet-grants-strengthen-foss-security/

[^62]: Stellagent. "A2A Protocol Explained: How Google's Agent-to-Agent Standard Grew to 150+ Organizations in One Year." stellagent.ai. April 9, 2026. https://stellagent.ai/insights/a2a-protocol-google-agent-to-agent

[^63]: HiveTrail. "AGENTS.md vs CLAUDE.md: The AI Developer's Guide to Context Standards." hivetrail.com. April 26, 2026. https://hivetrail.com/blog/agents-md-vs-claude-md-cross-tool-standard/


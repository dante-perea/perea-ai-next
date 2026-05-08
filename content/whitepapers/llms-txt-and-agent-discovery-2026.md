---
title: "llms.txt and the Agent Discovery Layer"
subtitle: "Jeremy Howard's Spec, the Mintlify Cascade, and the Three ADPs Fighting to Be the .well-known of Agent Commerce"
publication: "perea.ai Research"
authors: ["Dante Perea"]
version: "1.0"
status: "Public draft"
date: "2026-05"
audience: "Documentation engineers and SEO/GEO leaders deciding whether to ship llms.txt, founders evaluating agent-discovery protocols, and architects of B2A surfaces who need to know how their service gets found by an autonomous buyer."
length: "~3,000 words"
license: "CC BY 4.0"
description: "Field manual for the agent discovery layer of the 2026 web. Maps the llms.txt specification (Jeremy Howard, Sept 2024) and llms-full.txt companion (Mintlify+Anthropic), the directories tracking 1,496 to 844,000 published implementations, and the three competing Agent Discovery Protocols (metisos ADP v2, agentdiscovery.io ADP v2, walkosystems ADP v0.1) — and tells you what to publish today and what to wait on."
---

# llms.txt and the Agent Discovery Layer

## What this paper is, in one sentence

The 2026 web has acquired a third root-level file — `llms.txt` — to sit alongside `robots.txt` (1994) and `sitemap.xml` (2005), and it now exists as a real (if still-debated) infrastructure layer with 0.015%[^1] adoption in Jan 2025 climbing to 10.13%[^1] of top-million domains by early 2026[^1] (a nearly 700×[^1] jump in twelve months), supported by Anthropic, Vercel, Stripe, Cloudflare, Mintlify, and Perplexity, and now sitting at the foundation of an emerging Agent Discovery Protocol stack (three competing specs at the time of writing) that will define how autonomous agents find services on the web.

## Where llms.txt came from

Jeremy Howard, co-founder of Answer.AI and former president of fast.ai, published the proposal on September 3, 2024[^2][^3]. The premise was minimal: add a `/llms.txt` markdown file to your website that describes the site for an LLM, with a curated list of key resources (each linkable as a `.md` companion at the same URL).[^2][^4] The specification is tiny — one H1 heading required, a blockquote summary recommended, H2-delimited sections of file lists, and an optional `## Optional` block that AI systems can skip when context is tight.[^2][^4][^5] The format is markdown, not XML or JSON, on the explicit reasoning that "we expect many of these files to be read by language models and agents."[^2]

The companion file is `llms-full.txt`: rather than a curated index, it contains the entire content of the docs site bundled into a single markdown file.[^6][^7] Mintlify developed it in collaboration with Anthropic, who specifically asked Mintlify to build llms-full.txt support across its doc-hosting platform; it was then officially adopted into the llmstxt.org standard.[^6][^7]

The PyPI package `llms-txt` (Apache-2.0[^8]) provides the `llms_txt2ctx` CLI that turns an llms.txt file into a usable LLM context.[^8] The AnswerDotAI/llms-txt GitHub repository[^9] has 2,200+[^10] stars; the discussion happens on a community Discord and the spec is open for community input.[^2]

## The adoption curve, named precisely

The numbers diverge depending on the methodology, and the divergence itself is worth understanding before betting on the file.

**The high-end estimate.** As of October 2025[^11], BuiltWith reports 844,000+[^11] websites have implemented llms.txt; the directory llmstxt.work[^12] indexes 1,496+[^12] implementations of public llms.txt files (Vercel AI SDK, Vercel, Stripe, Mintlify and counting); llmtxt.app[^13] indexes 1,300+[^13]. By the roast.page survey of the top-million domains[^1], adoption climbed from 0.015%[^1] (Jan 2025) to 10.13%[^1] (early 2026) — a ~700×[^1] expansion. AI-related bot traffic increased over 300%[^11] between January 2025 and March 2026[^11] (seoscore.tools server-log analysis).

**The low-end estimate.** Semrush analysis[^5] reports only ~950[^5] domains had published llms.txt files in early 2026[^5]. The seoscore.tools[^11] global denominator puts adoption at 3.2%[^11] of all websites globally — small absolute share, large relative growth.

**The cascade.** Adoption was niche until November 2024[^7] when Mintlify rolled out automatic llms.txt generation across all docs sites it hosts, "practically overnight" pulling thousands of doc sites — including Anthropic and Cursor — onto the standard.[^7] By 2026, every Mintlify-hosted doc site auto-generates llms.txt and llms-full.txt at the root and at /.well-known/llms.txt[^14] for compatibility with the well-known convention. Mintlify also adds two HTTP headers — `Link: ; rel="llms-txt", ; rel="llms-full-txt"` and `X-Llms-Txt: /llms.txt` — so AI tools can discover the files without prior knowledge of their location.[^14]

**The validation by use.** Vercel reports 10%[^7] of their signups come from ChatGPT as a result of GEO (not SEO) effort.[^7] Profound[^7], a GEO-metrics firm, reports that models from Microsoft, OpenAI, and others are actively crawling and indexing both llms.txt and llms-full.txt files. ChatGPT accounts for the majority of llms.txt visits[^11]. Sites with llms.txt show 2.3×[^11] higher AI recall (lowtouch.ai) and up to 30%[^11] more AI-driven referral traffic in a 50-site Growth Terminal study.[^11] llms.txt and llms-full.txt together account for 35%[^11] (20+15) of the AI Visibility Score on aicrawlercheck.com.[^11][^15]

**The skeptic's reading.** No major AI provider has officially confirmed inference-time fetching of llms.txt[^5][^16][^17]. Google's John Mueller has stated that Google Search does not use llms.txt as a ranking signal[^18][^19]. The IETF launched an "AI Preferences Working Group" for related standards[^7] but llms.txt is not part of that effort yet. The strongest skeptical writeup — broworks.net[^17] — argues llms.txt has zero practical impact today and recommends focusing on robots.txt and sitemap.xml; the strongest defender — clickcentricseo.com[^20] — argues GPTBot, ClaudeBot, OAI-SearchBot, and Google-Extended all recognize or benefit from it. Both can be true simultaneously.

## The format, in one block

The minimum-viable llms.txt[^2][^3][^4][^5]:

```markdown
# Your Project Name

> One-sentence description of what you do.

Optional context paragraphs with key information an LLM would need.

## Section Name

- [Resource Title](https://example.com/page.md): Brief description
- [Another Resource](https://example.com/other.md): What this covers

## Optional

- [Changelog](https://example.com/changelog.md): Release history
- [Migration Guide](https://example.com/migration.md): Version upgrades
```

Required: only the `#` heading.[^2][^4][^5] Recommended: blockquote summary, 10–20 curated links per section, descriptions on each link.[^7][^21] Critical: the `## Optional` section gets a special meaning — AI systems with limited context windows can skip it.[^2][^4]

The companion `llms-full.txt`[^7][^14]: the entire docs site as one markdown file. Recommended when content is extensive and would not fit in a single context window. Anthropic, Cloudflare, Stripe, Mintlify, and Vercel all maintain both.[^21][^7]

## llms.txt vs robots.txt vs sitemap.xml

The clean separation that has emerged across the technical canon[^22][^23][^24][^25][^15]:

| File          | Purpose                                  | Audience            | Format          | Year |
| ------------- | ---------------------------------------- | ------------------- | --------------- | ---- |
| robots.txt    | Crawler access control                   | Search + AI bots    | Plain directives| 1994 |
| sitemap.xml   | URL discovery / canonical pages          | Search engines      | XML             | 2005 |
| llms.txt      | AI content curation / context            | LLMs and agents     | Markdown        | 2024 |
| llms-full.txt | Full documentation as single markdown    | LLMs (RAG ingestion)| Markdown        | 2024 |

The library analogy that has settled into the canon[^22]: sitemap.xml is the complete catalogue, robots.txt marks the restricted shelves, llms.txt is the librarian's curated reading list for a researcher who has fifteen minutes. Each addresses a different audience with a different failure mode; treating any one as a substitute for another is the single most common deployment mistake.[^23]

robots.txt adoption sits at 85%[^23] of sites with valid 200 responses (2025 Web Almanac SEO chapter); sitemap.xml is similarly near-universal; llms.txt at 10.13%[^1] (top-million) or 3.2%[^11] (global) is still optional. The audiences also diverge: robots.txt was always a request, not a security measure[^25]; llms.txt is a context contract, not an access directive.[^20][^25]

The robots.txt configuration error that costs the most AI visibility is a blanket `Disallow: /` under `User-agent: *` that accidentally blocks AI bots.[^26] The 2026 fix is explicit allowlisting:[^26]

```
User-agent: GPTBot
Allow: /
User-agent: ClaudeBot
Allow: /
User-agent: Google-Extended
Allow: /
User-agent: *
Allow: /
Disallow: /admin/
Sitemap: https://www.yourdomain.com/sitemap.xml
```

The relevant bot inventory has grown into roughly seven canonical user-agents by mid-2026:[^11][^26] GPTBot (OpenAI training and search), ChatGPT-User (real-time browsing), ClaudeBot (Anthropic), PerplexityBot (Perplexity), Google-Extended (Gemini training), CCBot (Common Crawl), OAI-SearchBot (OpenAI real-time search), and Claude-SearchBot (Anthropic real-time search).

## The three Agent Discovery Protocols

Below llms.txt — at the layer where agents not only read documentation but discover services and transact — three competing specifications use the name "Agent Discovery Protocol" simultaneously. The names collide; the specifications differ; founders building B2A surfaces should know all three.

**ADP v2 (metisos/adp-protocol[^27], MIT, Nov 7 2025[^27]):** Production-ready agent manifest spec at `/.well-known/agents/{name}-{version}.json` with Ed25519 signatures, multi-party attestations, three compliance tiers (Bronze: basic manifest; Silver: + signing key + health endpoint; Gold: + attestations + SLA + privacy policy), protocol-agnostic invocation across MCP, REST, gRPC, GraphQL, WebSocket, and the `aid://` URI scheme.[^27] Decentralized federated discovery with no single registry required.

**ADP v2 (agentdiscovery.io[^28], MIT[^28]):** A different, parallel ADP focused on the commerce lifecycle: a six-step protocol — Register → Handshake → Discover → Negotiate → Transact → Reputation — built explicitly for autonomous agent commerce rather than agent description.[^28] Built in the Netherlands; positioning is "every layer needs a protocol — HTTP for websites, SMTP for email, Stripe for payments, ADP for autonomous agent commerce."[^28]

**ADP v0.1 (walkojas-boop, langchain-ai PR #36688[^29]):** A third ADP, this one a lightweight `/.well-known/agent-discovery.json` manifest with a `risk_tier` field (0-4) mapping to LangChain tool categories, plus a hosted registry at agents.walkosystems.com.[^29] The spec proposes that calling agents make governance decisions before invocation rather than after failure.[^29]

**LLM-LD's ADP 1.0 (CAPXEL, Feb 2026[^30]):** A fourth, distinct "ADP" — AI Discovery *Page* — a standard HTML page at `/ai`, `/ai.html`, or `/ai-discovery` containing a JSON-LD block of type `llmld:DiscoveryPage` that enumerates AI-layer resources with priority weighting.[^30] CAPXEL frames it as a "companion standard to LLM-LD 1.0 for human- and machine-readable AI layer discovery."[^30]

**ANP (Agent Network Protocol) ADP[^31]:** A fifth specification — ANP-ADP, a JSON-LD-based agent description protocol from the Agent Network Protocol consortium with active and passive discovery modes via `.well-known` URIs, schema.org vocabulary, did:wba unified identity, and supports interop with OpenAPI and JSON-RPC.[^31] An IETF draft (`draft-song-anp-adp-00`[^32]) describes ADP as the Agent Description Protocol carried over AITP (Agent Invocation Transport Protocol) with three method names: `adp.describe`, `adp.advertise`, `adp.discover`.[^32]

The naming collision is itself the news. By mid-2026 the agent-discovery-protocol layer is fragmented across at least five competing specs, each with non-trivial backing. The convergence point will likely be `/.well-known/agent-discovery.json` (or similar) as the agreed URL, with a JSON-LD or JSON manifest format — but no single spec has won.

## What to publish today, what to wait on

The decision matrix that has emerged from the canon:[^4][^15][^21][^33]

**Publish today (low-cost, low-risk).**
- `/llms.txt` at the root of every public-facing docs site. Set 10–20 curated links with descriptions. Validate at llmstxtchecker.net.[^4]
- `/llms-full.txt` if your docs are >50,000 words. Mintlify auto-generates both for hosted docs.[^14]
- `.md` versions of every page (or a path-rewrite that returns markdown when `.md` is appended).[^2]
- Explicit `Allow: /` for GPTBot, ClaudeBot, Google-Extended in robots.txt[^26]; do not let a stray `Disallow: /` block AI visibility.

**Wait on (high-uncertainty layer).**
- The three or four ADPs currently fighting for `/.well-known/agent-discovery.json`. Pick the one that fits your primary integration target (LangChain → walkosystems-style; multi-vendor commerce → agentdiscovery.io; signed manifest with attestations → metisos). Treat the choice as reversible — by 2027 the dust will settle.[^27][^28][^29][^30][^31]
- LLM-LD's `/ai` page[^30] until JSON-LD discovery picks up beyond CAPXEL's reference.

**Worth experimenting with (defensible bets).**
- A `Crawler Log Evidence` review every 90 days[^23] to validate that AI bots are actually fetching your llms.txt — if no agent has retrieved it in three months, the curation is not being consumed.
- Per-link freshness stamps inside llms.txt[^23] so agents can reason about recency.

The pure-marketing-site case[^21]: under ~50,000 words of total content, llms.txt alone is enough — skip llms-full.txt. The deep-and-dynamic-site case[^23]: ship the dual-file stack (llms.txt + llms-full.txt) regardless of size, because agents that index your content for RAG will prefer the bundled markdown.

## Five anti-patterns

**1. Treating llms.txt as a substitute for robots.txt or sitemap.xml.** Different audiences, different failure modes, non-substitutable. Ship all three.[^15][^22][^25]

**2. Serving the file as `text/html`.** Must be `text/markdown` or `text/plain` with raw markdown content. Static hosts (Vercel, Netlify, Cloudflare Pages) handle this automatically; custom servers often get it wrong.[^21]

**3. URLs without per-link descriptions.** A list of bare URLs forces agents to fetch every link before they can prioritize. Each link should carry a one-line abstract.[^23][^7]

**4. Plugin stub deployment.** A boilerplate llms.txt generated by a CMS plugin and never curated is worse than nothing — it claims to be a curated map and isn't.[^23]

**5. No freshness stamp.** Agents treat undated content as potentially stale. Add a visible last-updated date and refresh on the cadence your docs change.[^23]

## The forward case

The infrastructure shape that emerges if llms.txt continues its 700×[^1] adoption curve through 2026 is roughly: by late 2026 or early 2027, llms.txt becomes default infrastructure on every developer-tools site, then SaaS, then mainstream content publishers, and not having one will look like not having a sitemap in 2014 — unusual, slightly negligent, and worth a one-hour fix.[^21] The cost of being early is near zero (no SEO penalty, no reputational risk). The benefit is six months of compounded discipline advantage over teams that wait.[^21]

Below llms.txt, the agent discovery layer is forming faster than the spec wars suggest. The convergence question is not *whether* there will be a `.well-known` agent manifest — there will. The question is whose JSON-LD vocabulary wins and whose registry layer absorbs the others. Founders building B2A surfaces should publish at least one ADP variant today; the cost is one small file, the option value is positioning ahead of whatever protocol wins.

## What this paper does not cover

This paper does not cover: the LLM-LD specification in detail (a deeper schema.org-extension topic worth its own treatment), the IETF AI Preferences Working Group's emerging access-policy spec (still in draft), the Cloudflare AI Audit feature for llms.txt analytics, the precise per-link weighting algorithms inside `[priority]` blocks of vendor-specific RAG systems (richardlemon.com[^33] documents one), legal and contractual implications of declaring AI use preferences on llms.txt (covered separately in the AI training data and copyright thread), or the planner-side agent architecture that consumes llms.txt as RAG context (planner papers cover that surface).

## References

[^1]: roast.page, llms.txt: The $0 File That Might Matter (And Might Not). https://roast.page/blog/llms-txt-landing-page-guide (Apr 16, 2026)
[^2]: Jeremy Howard / Answer.AI, /llms.txt — proposal to provide information to help LLMs use websites. https://www.answer.ai/posts/2024-09-03-llmstxt (Sep 3, 2024)
[^3]: llmstxt.org official specification site. https://www.llmstxt.org/
[^4]: ai.rs, How to Implement llms.txt — The Developer's Guide. https://ai.rs/ai-developer/how-to-implement-llms-txt (Mar 3, 2026)
[^5]: AI Herald, What Is llms.txt? The Complete Guide to the Proposed AI Web Standard. https://ai-herald.com/what-is-llms-txt-the-complete-guide-to-the-proposed-ai-web-standard/ (Feb 8, 2026)
[^6]: Mintlify, What is llms.txt? Breaking down the skepticism. https://mintlify.com/blog/what-is-llms-txt (Apr 2, 2025)
[^7]: Mintlify, The value of llms.txt: Hype or real? https://mintlify.com/blog/the-value-of-llms-txt-hype-or-real (May 9, 2025)
[^8]: PyPI llms-txt v0.0.6 (Apache-2.0). https://pypi.org/project/llms-txt/
[^9]: AnswerDotAI/llms-txt GitHub repository. https://github.com/answerdotai/llms-txt
[^10]: AnswerDotAI/llms-txt index.qmd source. https://github.com/AnswerDotAI/llms-txt/blob/main/nbs/index.qmd
[^11]: Miniloop AI, How to Build an llms.txt File for AI Crawlers. https://www.miniloop.ai/blog/how-to-build-llms-txt-file-ai-crawlers-2026 (Apr 12, 2026)
[^12]: llmstxt.work, 1496+ llms.txt Examples directory. http://llmstxt.work/
[^13]: llmtxt.app, LLMs.txt Directory — AI SEO & AI Search Optimization Guide. https://llmtxt.app/
[^14]: Mintlify, llms.txt platform documentation. https://mintlify.mintlify.app/ai/llmstxt
[^15]: AI Crawler Check, llms.txt Guide: The New Standard for AI Discoverability. https://aicrawlercheck.com/blog/llmstxt-guide-ai-discoverability (Mar 5, 2026)
[^16]: llmtxt.info, llms.txt — the reference site for the AI-readable web standard. https://llmtxt.info/
[^17]: Broworks, Sitemap vs Robot.txt vs Llms.txt: Which is More Important. https://www.broworks.net/blog/sitemap-vs-robot-txt-vs-llms-txt-which-is-more-important
[^18]: CrawlerOptic, llms.txt vs robots.txt: What's the Difference (John Mueller cited). https://www.crawleroptic.com/blog/llms-txt-vs-robots-txt (Mar 28, 2026)
[^19]: Search Engine Land, llms.txt status as non-standard (cited in Broworks). https://searchengineland.com/llms-txt-not-a-standard
[^20]: Clickcentric SEO, What Is llms.txt? The New Sitemap for AI Search Engines. https://clickcentricseo.com/learn/llms-txt-guide (Mar 7, 2026)
[^21]: roast.page, llms.txt template and audit of 40 public implementations. https://roast.page/blog/llms-txt-landing-page-guide
[^22]: Ritner Digital, How to Build an AI Sitemap for Agentic Crawlers. https://www.ritnerdigital.com/blog/how-to-build-an-ai-sitemap-for-agentic-crawlers-a-technical-guide-to-signaling-content-structure-beyond-google (Apr 25, 2026)
[^23]: Digital Strategy Force, Does Your Site Need LLMs.txt to Get Cited by AI Search in 2026? https://digitalstrategyforce.com/journal/does-your-site-need-llms-txt-to-get-cited-by-ai-search-in-2026/ (Apr 20, 2026)
[^24]: llmstxtgenerator.org, llms.txt vs robots.txt vs sitemap.xml. https://llmstxtgenerator.org/blog/llms-txt-vs-robots-txt-vs-sitemap (Jan 15, 2025)
[^25]: CrawlerOptic comparison table. https://www.crawleroptic.com/blog/llms-txt-vs-robots-txt
[^26]: CrawlerOptic robots.txt allowlist for AI bots. https://www.crawleroptic.com/blog/llms-txt-vs-robots-txt
[^27]: metisos/adp-protocol, Agent Discovery Protocol v2.0.0. https://github.com/metisos/adp-protocol (Nov 7, 2025)
[^28]: agentdiscovery.io, ADP v2 — Open Protocol for AI Agent Commerce. https://agentdiscovery.io/
[^29]: walkojas-boop / langchain-ai PR #36688, ADP v0.1 LangChain integration. https://github.com/langchain-ai/langchain/pull/36688 (Apr 12, 2026)
[^30]: LLM-LD ADP 1.0 (CAPXEL), AI Discovery Page Specification. https://llmld.org/spec/adp-v1 (Feb 2026)
[^31]: Agent Network Protocol, ANP Agent Discovery Service Protocol. https://github.com/agent-network-protocol/AgentNetworkProtocol/blob/main/08-ANP-Agent-Discovery-Protocol-Specification.md
[^32]: IETF draft-song-anp-adp-00, Agent Description Protocol (Mu Yuan). https://www.ietf.org/archive/id/draft-song-anp-adp-00.html
[^33]: Richard Lemon, How I Built an llms.txt For Clients (Better Than a Sitemap). https://richardlemon.com/how-i-built-llms-txt-for-clients/ (Apr 29, 2026)
[^34]: Agent Network Protocol, Agent Description Protocol Specification (ANP). https://agentnetworkprotocol.com/en/specs/07-anp-agent-description-protocol-specification (Dec 12, 2024)
[^35]: agentdiscovery.io documentation. https://agentdiscovery.io/docs
[^36]: BuiltWith, llms.txt adoption tracker. https://builtwith.com/technologies/llms-txt
[^37]: Semrush, llms.txt domain count analysis. https://www.semrush.com/blog/llms-txt-adoption/
[^38]: Profound, Generative Engine Optimization data. https://www.profound.so/research/llms-txt-2026
[^39]: lowtouch.ai, AI recall improvement study. https://lowtouch.ai/blog/llms-txt-ai-recall-2-3x
[^40]: Growth Terminal, 50-site referral study. https://growthterminal.io/research/llms-txt-50-site-study
[^41]: Schema.org, DigitalDocument type. https://schema.org/DigitalDocument
[^42]: 2025 Web Almanac, SEO chapter robots.txt adoption data. https://almanac.httparchive.org/en/2025/seo
[^43]: IETF AI Preferences Working Group charter. https://datatracker.ietf.org/wg/aipref/about/
[^44]: Mintlify, llms-full.txt collaboration with Anthropic. https://mintlify.com/blog/llms-full-txt-anthropic
[^45]: Anthropic, Claude documentation llms.txt. https://docs.anthropic.com/en/docs/llms.txt
[^46]: Cloudflare, AI Audit and llms.txt support. https://blog.cloudflare.com/ai-audit-llms-txt
[^47]: Stripe, llms.txt for Stripe documentation. https://stripe.com/llms.txt
[^48]: Vercel, llms.txt for Vercel docs. https://vercel.com/llms.txt
[^49]: Perplexity, llms.txt at perplexity.ai. https://perplexity.ai/llms.txt
[^50]: Windsurf, token-savings analysis on Mintlify-hosted llms.txt. https://windsurf.ai/blog/llms-txt-token-savings
[^51]: LangChain, mcpdoc MCP server exposing llms.txt to IDEs. https://blog.langchain.dev/mcpdoc-llms-txt
[^52]: AI Crawler Check AI Visibility Score methodology. https://aicrawlercheck.com/methodology
[^53]: BuiltWith October 2025 llms.txt domain report. https://trends.builtwith.com/website-list/llms-txt
[^54]: roast.page audit of 40 public llms.txt implementations including Anthropic, Vercel, Stripe. https://roast.page/blog/llms-txt-landing-page-guide
[^55]: Mintlify llms.txt platform deep documentation. https://mintlify.com/docs/llms-txt

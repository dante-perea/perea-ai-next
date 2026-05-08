---
title: "The Verifiable Bot Stack: Letting Agents In"
subtitle: "BotID, Web Bot Auth, signed agents — the supplier-side counterpart to B2A"
publication: "perea.ai Research"
authors: ["Dante Perea"]
version: "1.0"
status: "Public draft"
date: "2026-05"
audience: "Site operators, platform engineers, and security teams choosing how to handle agent traffic; founders and CTOs writing the AI bot policy that sits in front of their checkout, login, and content APIs; SaaS providers asking to be added to verified-bot directories"
length: "~3,300 words"
license: "CC BY 4.0"
description: "An authority survey of the supplier-side stack for letting verified agents through bot management as it stands in mid-2026: Vercel BotID GA on Kasada, Cloudflare verified bots and signed agents, the IETF Web Bot Auth working group's HTTP Message Signatures architecture (RFC 9421 + directory + architecture drafts), the three-tier crawler split (training / search-indexing / user-browsing) across OpenAI/Anthropic/Perplexity/Google, and the route-level decision tree (block / allow / allow-and-meter / allow-with-payment-required via x402)."
---

## 1. The category, in one sentence

The Verifiable Bot Stack is the set of mechanisms that lets a website tell the difference between a Claude assistant doing real work for a paying user and a competitor's price-scraper pretending to be one. As of mid-2026, that stack has crystallized around four primitives: Vercel BotID (powered by Kasada, GA June 2025);[^1] Cloudflare's verified-bots and signed-agents directory;[^2] the IETF Web Bot Auth working group's HTTP Message Signatures architecture, with a chartered standards-track milestone of April 2026;[^3] and the three-tier crawler split now standardized across OpenAI, Anthropic, Perplexity, and Google.[^4][^5]

This paper maps the stack — what each layer signs, what each layer trusts, and where the route-level decision tree lives.

## 2. The paradox

The supplier-side problem is not bot-blocking. It is *selective* bot-blocking. Most marketing teams' robots.txt and bot management blocks the agents their GEO strategy is trying to attract. The 2026 SEO and AEO literature is unanimous on this point:[^4][^5][^6] "Blocking GPTBot or ClaudeBot silently kills your AI search visibility. A single `Disallow: /` under these user-agents means ChatGPT and Claude cannot crawl your site — so they cannot cite it."[^4]

Foglift's March 2026 research framed the new shape: "as of 2026, major AI companies no longer use a single crawler. They've split into three tiers — and your robots.txt strategy needs to account for each:"[^5]

| Purpose | OpenAI | Anthropic | Perplexity |
|---|---|---|---|
| Training | `GPTBot` | `ClaudeBot` | `PerplexityBot` |
| Search indexing | `OAI-SearchBot` | `Claude-SearchBot` | — |
| User browsing | `ChatGPT-User` | `Claude-User` | `Perplexity-User` |

Anthropic's own privacy documentation confirms the architecture and explicitly distinguishes the three roles:[^7] ClaudeBot is for training data collection; Claude-User supports Claude AI users when they ask questions; Claude-SearchBot navigates the web to improve search result quality.[^7] All three honor robots.txt independently.[^5]

The core consequence: a publisher who wants to *appear* in ChatGPT's answers but *not* contribute to model training has to write per-user-agent rules. AEOprobe's recommended selective allow policy — "allow search-facing AI bots (these cite your content) ... block training-only crawlers"[^8] — is now the modal configuration for content publishers in 2026.

robots.txt alone is not enough. As AI Crawler Check's 2026 guide put it: "robots.txt rules are based on trust. The file asks bots to follow the rules, but it does not force them."[^9] For genuinely sensitive content, bot management has to operate above robots.txt — and the cryptographic layer is what's being built to do that.

## 3. Vercel BotID + bots.fyi

Vercel BotID went GA on June 25, 2025, in partnership with Kasada.[^1][^10] BotID is positioned as an "invisible CAPTCHA with no visible challenges or manual bot management required" for high-value routes — checkouts, signups, AI chat interfaces, LLM-powered endpoints, public APIs.[^1]

The architectural shape:[^11]

- **Client-side detection**: a `<BotIdClient />` component or `initBotId()` call in `instrumentation-client.ts` (Next.js 15.3+)[^12] sets headers on requests to a protected endpoint.
- **Server-side verification**: the `checkBotId()` helper in `botid/server` validates incoming requests before executing expensive logic.[^11]
- **Two analysis tiers**: BotID Basic (free; client + network signals; lightweight real-time bot detection) and Deep Analysis (paid; $1 per 1000 `checkBotId()` calls; ML model analyzing thousands of client-side signals).[^11]

Per Kasada's announcement, Vercel BotID puts "Kasada's battle-tested bot defense directly into the workflows of over eight million Vercel developers,"[^10] and the service "combines deep client-side interrogation with server-side ML trained on trillions of real-world bot interactions."[^10] Randomized real-time obfuscation of detection logic prevents adversarial replay attacks and bot retooling.[^10]

The supplier-side breakthrough came with `botid@1.5.0`: BotID Deep Analysis now leverages Vercel's verified bot directory at bots.fyi.[^13] The `checkBotId()` response surface adds three fields:[^13]

- `isVerifiedBot`: boolean indicating whether the bot is verified
- `verifiedBotName`: string identifying the specific verified bot
- `verifiedBotCategory`: string categorizing the type of verified bot

The reference example from Vercel's changelog directly addresses the agent-commerce paradox:[^13]

```javascript
const isOperator = isVerifiedBot && verifiedBotName === "chatgpt-operator";
if (isBot && !isOperator) {
  return Response.json({ error: "Access denied" }, { status: 403 });
}
```

Bots.fyi itself is the public directory of known bots. As of mid-2026 it lists Google-CloudVertexBot, Vercel build container, Vercel Favicon Bot, vercelflags, Vercel Screenshot Bot, and verceltracing among many others, each tagged Verified and categorized (AI Assistant, Crawler, Monitoring, Preview).[^14] Submitting a SaaS bot to the directory is via online application.[^15]

The bots.fyi directory is what unlocks the "allow ChatGPT Operator but block scrapers" pattern for Vercel customers. It is not a one-off integration; it is a continuously-updated directory that customers inherit by default.

## 4. Cloudflare verified bots + signed agents

Cloudflare's parallel architecture predates Vercel's and is more granular. The dashboard distinguishes verified bots (search engines, monitoring services, SEO tools) from signed agents (AI assistants and other agents that authenticate cryptographically).[^2]

For verification, Cloudflare's documentation lists two methods:[^16]

- **IP validation**: requests must originate from known IP ranges owned by legitimate bot operators, with reverse DNS that resolves back to the expected domain (e.g., a Googlebot IP must resolve to `*.googlebot.com` or `*.google.com`).[^16]
- **Web Bot Auth**: cryptographic verification of automated requests through HTTP Message Signatures.[^16]

A bot cannot be both a verified bot and a signed agent.[^17] Once verified, a bot appears on Cloudflare Radar's bots and agents directory.[^17]

Cloudflare's signed agents policy is unusually explicit about behavior: agents must serve a benign or helpful purpose; cannot perform bot tooling, scalpers, credential-stuffing, directory-traversal scanning, excessive data scraping, or DDoS botnets;[^18] and must have publicly documented purpose and expected behavior.[^18] User-agent string is optional (Web Bot Auth replaces it as the identity surface), but if present must be at least five characters and must not collide with another verified service.[^18]

The 2026 evolution that matters most: Cloudflare's AI Bots Managed Ruleset.[^19] Enabled by toggle, it blocks Amazonbot, Applebot, Bytespider, ClaudeBot, DuckAssistBot, Google-CloudVertexBot, GoogleOther, GPTBot, Meta-ExternalAgent, PetalBot, TikTokSpider, and CCBot, plus verified bots classified as AI crawlers.[^19] A separate AI Labyrinth feature feeds non-compliant AI crawlers into a maze of generated content; a Managed robots.txt feature prepends AI crawler disallow directives to the customer's robots.txt.[^20]

The rule evaluation order is the architectural decision that makes selective allow possible:[^19]

1. Custom rules (WAF custom rules you write) — evaluated first.
2. Block AI bots (the managed AI rule) — evaluated second.
3. Other Super Bot Fight Mode rules — evaluated last.

Because custom rules run first and short-circuit on terminating actions, a customer can write `cf.bot_management.verified_bot AND http.request.uri.path matches "/agent-allowed/*" → ALLOW` and have it run before the AI bot blocker fires. The `cf.bot_management.verified_bot` field requires a Cloudflare Enterprise plan with Bot Management.[^21]

## 5. Web Bot Auth (IETF webbotauth WG)

The cryptographic primitive underneath Vercel and Cloudflare's verified-bot pipelines is the IETF webbotauth working group's draft architecture.

The working group is chartered. As of mid-2026, the IETF Datatracker shows charter-ietf-webbotauth-01 Approved, in the Web and Internet Transport (wit) area, chaired by David Schinazi and Rifaat Shekh-Yusef.[^22] The deliverables: standards-track document(s) describing techniques for authenticating automated clients to websites intended for humans; standards-track document(s) describing how to convey additional information about a requesting bot using existing widely-used identifiers; and BCP/Informational document(s) on lifecycle management, key management, and deployment considerations.[^22]

The schedule the WG published:[^22]

- **April 2026**: standards-track specification(s) describing authentication technique(s) sent to the IESG.
- **April 2026**: standards-track specification(s) describing a means for conveying additional information about bots sent to the IESG.
- **August 2026**: Best Current Practice operational specification sent to the IESG.

The two active working drafts as of March 2026:

- `draft-meunier-http-message-signatures-directory-05` (Cloudflare's Thibault Meunier, March 2 2026; expires September 3 2026): defines a JWKS-based key directory format for publishing HTTP Message Signatures keys, a well-known URI location for discovery, and a Signature-Agent header field for in-band key directory location discovery.[^23]
- `draft-meunier-web-bot-auth-architecture-05` (March 2026): describes the architecture for identifying automated traffic using HTTP Message Signatures, with the goal of allowing automated HTTP clients to cryptographically sign outbound requests.[^24]

The protocol shape, per the architecture draft:[^24]

- Agents MUST include at least one of `@authority` or `@target-uri` derived components in the signature.
- Agents MUST include `created`, `expires`, `keyid`, and `tag` (`web-bot-auth`) in `@signature-params`.
- `keyid` MUST be a base64url JWK SHA-256 Thumbprint as defined in the JWK Thumbprint spec.
- It is RECOMMENDED that signature expiry be no more than 24 hours.

The protocol explicitly trades anonymity for verifiability. Section 5.8 of the architecture draft is unusually direct: "If an agent wishes not to identify itself, this is not the right choice of protocol for it."[^24]

The directory architecture is what makes the system work at scale.[^23] An agent provider hosts a key directory at `/.well-known/http-message-signatures-directory` (or another location announced via the `Signature-Agent` header), serving JWKS-formatted public keys with media type `application/http-message-signatures-directory+json`.[^23] When the bot signs an HTTP request, it includes a `Signature-Agent` header pointing to its directory; the verifier fetches the directory, validates the directory's own signature (each key signs its own entry, preventing directory-mirror attacks), and uses the directory's public key to verify the request signature.[^23]

Cloudflare's blog announcement of Web Bot Auth (May 15, 2025) framed the design intent: "Cloudflare will always try to block malicious bots, but we think our role here is to also provide an affirmative mechanism to authenticate desirable bot traffic."[^25] By June 2025 the company had a closed-beta implementation and an `npm` `web-bot-auth` helper package; production activation followed in March 2026.[^26][^27]

Google's experimental implementation is the second-largest deployment. Google publishes an authentication guide for site operators that explicitly addresses how to allowlist Google AI agents using Web Bot Auth: a subset of `Google-Agent` user-agent requests are signed and authenticated as `https://agent.bot.goog`, with the public key set fetched from `https://agent.bot.goog/.well-known/http-message-signatures-directory`.[^28] The status remains experimental: not all Google user-agents are using Web Bot Auth, and Google "is not yet signing every request of agents using the protocol."[^28] Google explicitly recommends continuing to use IP, reverse DNS, and User-Agent verification alongside Web Bot Auth during the rollout.[^28]

## 6. The interlock — Vercel + Cloudflare both consume Web Bot Auth

The architectural pattern of 2026 is that the verifying parties (Vercel, Cloudflare, AWS, Google Cloud) consume Web Bot Auth and surface the result as a single boolean in their developer surfaces. The bot provider does the cryptographic work; the platform provider does the verification; the customer writes a one-line rule.

Cloudflare's documentation makes the implementation explicit. The Web Bot Auth requirements:[^29]

- `tag` MUST equal `web-bot-auth`.
- `keyid` MUST be a JWK SHA-256 Thumbprint of a key in the agent's directory.
- `Signature-Agent` header points to the agent's key directory.
- The signature MUST be over the `@authority` derived component at minimum.

Cloudflare's implementation is RFC 9421-compatible but does not support `sf`, `bs`, `key`, `req`, or `name` component parameters; including them causes verification to fail.[^29] The `cf.bot_management.verified_bot` field surfaces the result as a boolean in the Ruleset Engine, and customers can write WAF rules that combine bot score with verified status:[^30]

```
cf.bot_management.score lt 30 
  AND NOT cf.bot_management.verified_bot 
  AND http.request.uri.path eq "/login"
```

Vercel's directory at bots.fyi serves the same purpose with a different surface. Cryptographic verification using Web Bot Auth is one of the methods used to prove that bots are legitimate and verify their claimed identity.[^31] Once verified, the customer-facing decision is a one-liner — `if (isBot && !isOperator)` — and the customer never directly handles signatures.[^13]

Stellagent's April 2026 analysis captures the operator's experience: "from the Cloudflare dashboard, select 'Allow verified bots only' and add Claude, GPT, Perplexity to the allow-list. That's it — no custom rules required."[^27]

## 7. The decision tree per route

The synthesized 2026 pattern for site operators is a per-route decision tree. The four leaves and what each one looks like in production:

**Block.** For routes that should never see automated traffic (admin panels, internal docs, legacy login pages with no agent-friendly fallback). Implementation: `User-agent: * Disallow: /admin/` in robots.txt, plus Cloudflare WAF rule blocking definitely-automated traffic, plus Vercel BotID `checkBotId()` returning 403 on `isBot=true`.

**Allow.** For public marketing content that benefits from being indexed by AI search crawlers. Implementation: explicit `Allow: /` for `OAI-SearchBot`, `ChatGPT-User`, `Claude-SearchBot`, `Claude-User`, `Perplexity-User`, `Google-Extended` in robots.txt;[^4][^8] Cloudflare verified bots toggle set to allow; Vercel verified-bot directory recognized but no special handling.

**Allow-and-meter.** For valuable content (pricing pages, product detail pages, API endpoints) where you want agents to access but want to track and rate-limit. Implementation: Cloudflare WAF custom rule that allows when `cf.bot_management.verified_bot AND signature_verified` but applies rate limits; Vercel BotID Deep Analysis ($1/1000 calls) on verified-bot paths to log usage by `verifiedBotName`. The training-vs-search distinction matters here: AEOprobe's 2026 guide and Foglift's three-tier framework let publishers selectively block training crawlers while allowing search and user-browsing crawlers.[^5][^8]

**Allow-with-payment-required (x402).** For high-value content or actions where the agent should pay before accessing. Implementation: Web Bot Auth signature verification establishes the agent's identity; HTTP 402 Payment Required response with x402 challenge headers; agent presents an x402 payment proof; service grants access. This integrates with the AP2 Mandate stack covered in `agent-payment-stack-2026.md` and `trust-layer-deep-dive.md`.

The crucial decision is *not* "block or allow" but *which leaf* of this tree maps to each route. The current state of the art is pre-built defaults at the platform layer (Cloudflare's "Allow verified bots only" toggle, Vercel BotID's `isVerifiedBot` field) with custom rules for routes where the default doesn't fit.

## 8. The standardization trajectory

The trajectory of the next 18 months, per the IETF schedule:[^22]

- **April 2026**: webbotauth working group sends authentication-technique standards-track drafts to the IESG.
- **August 2026**: BCP operational specification sent to IESG.
- **Late 2026**: Cloudflare, Akamai, Fastly all support Web Bot Auth in production, per Stellagent's projection.[^27] Practical default for ecommerce operators behind a CDN.
- **2027**: full migration of Googlebot to Web Bot Auth expected.[^27]

Currently supported agents include Anthropic Claude, OpenAI ChatGPT, Perplexity, Common Crawl, and several Google-related bots.[^27] Anthropic's privacy center explicitly documents the three-tier crawler split (ClaudeBot / Claude-User / Claude-SearchBot) as the canonical pattern and supports `Crawl-delay` for rate-limiting.[^7]

## 9. What this paper does not cover

This paper deliberately stops short of: the request-mTLS alternative Cloudflare introduced alongside Web Bot Auth in May 2025 (the TLS Flags concerns flagged in the IETF glossary draft remain open);[^25] AI Labyrinth and Cloudflare's content-poisoning strategies for non-compliant crawlers;[^20] the llms.txt complement to robots.txt (covered in the GEO/AEO literature);[^4] the Anthropic Bot IP ranges, Crawl-delay extensions, and other operational opt-out tooling;[^7] and the supplier-side x402 integration patterns (covered in `agent-payment-stack-2026.md`).

The next paper in this thread will examine the supplier-side metering layer specifically — how Cloudflare's AI Audit, Vercel BotID Deep Analysis logs, and the emerging x402 crawl-and-pay primitives compose into a usage-based pricing surface for agent traffic — because that is where the supplier-side commercial model is forming.

---

## References

[^1]: Vercel. "Vercel BotID is now generally available." Andrew Qu. June 25, 2025. https://vercel.com/changelog/vercel-botid-is-now-generally-available
[^2]: Cloudflare. "Bots concept overview." Accessed May 2026. https://developers.cloudflare.com/bots/concepts/bot
[^3]: IETF. "Web Bot Auth (webbotauth) working group." Accessed May 2026. https://dt.ietf.org/group/webbotauth/about/
[^4]: seo.yatna.ai. "robots.txt for AI Crawlers in 2026: GPTBot, ClaudeBot, PerplexityBot." January 14, 2026. https://seo.yatna.ai/seo-academy/robots-txt-guide-ai-crawlers-2026
[^5]: Foglift. "Robots.txt for AI Crawlers: How to Allow GPTBot, ClaudeBot, and PerplexityBot." March 15, 2026. https://foglift.io/blog/robots-txt-ai-crawlers
[^6]: SEOScanHQ. "robots.txt vs llms.txt: Understanding AI Crawler Access Control." March 24, 2026. https://seoscanhq.com/blog/robots-txt-vs-llms-txt
[^7]: Anthropic. "Does Anthropic crawl data from the web, and how can site owners block the crawler?" Accessed May 2026. https://privacy.anthropic.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler
[^8]: AEOprobe. "robots.txt for AI Bots: Should You Block or Allow GPTBot, ClaudeBot, and PerplexityBot?" March 15, 2026. https://aeoprobe.com/blog/robots-txt-ai-bots
[^9]: AI Crawler Check. "How to Block AI Crawlers with Robots.txt: 2026 Complete Guide." March 15, 2026. https://aicrawlercheck.com/blog/how-to-block-ai-crawlers-robots-txt
[^10]: Kasada. "Kasada and Vercel Launch BotID." June 25, 2025. https://www.kasada.io/kasada-and-vercel-launch-botid/
[^11]: Vercel. "BotID documentation." February 17, 2026. https://vercel.com/docs/botid
[^12]: Vercel. "Deploying and testing BotID." Accessed May 2026. https://vercel.com/guides/deploying-and-testing-botid
[^13]: Vercel. "Vercel BotID now leverages Vercel's verified bot directory." Accessed May 2026. https://vercel.com/changelog/vercel-botid-now-leverages-vercels-verified-bot-directory
[^14]: Bots.fyi. "A Directory of Web Crawlers and Bots." Accessed May 2026. https://bots.fyi/
[^15]: Vercel. "Bot Management documentation — Verified bots directory." February 17, 2026. https://vercel.com/docs/bot-management
[^16]: Cloudflare. "Verified bots." Accessed May 2026. https://developers.cloudflare.com/bots/concepts/bot/verified-bots/
[^17]: Cloudflare. "Bots concepts — verified bots vs signed agents." Accessed May 2026. https://developers.cloudflare.com/bots/concepts/bot
[^18]: Cloudflare. "Signed agents policy." August 27, 2025. https://developers.cloudflare.com/bots/concepts/bot/signed-agents/policy
[^19]: Cloudflare. "AI bots managed rule and rule evaluation order." Accessed May 2026. https://developers.cloudflare.com/bots/concepts/bot
[^20]: Cloudflare. "Custom rules — bot management features." Accessed May 2026. https://developer.cloudflare.com/bots/additional-configurations/custom-rules/
[^21]: Cloudflare. "cf.bot_management.verified_bot ruleset field." Accessed May 2026. https://developer.cloudflare.com/ruleset-engine/rules-language/fields/reference/cf.bot_management.verified_bot/
[^22]: IETF. "Web Bot Auth working group charter and milestones." Accessed May 2026. https://dt.ietf.org/group/webbotauth/about/
[^23]: IETF. "draft-meunier-http-message-signatures-directory-05." Thibault Meunier (Cloudflare). March 2, 2026. https://datatracker.ietf.org/doc/html/draft-meunier-http-message-signatures-directory
[^24]: IETF. "draft-meunier-web-bot-auth-architecture-05." March 2, 2026. https://datatracker.ietf.org/doc/draft-meunier-web-bot-auth-architecture/
[^25]: Cloudflare. "Forget IPs: using cryptography to verify bot and agent traffic." May 15, 2025. https://blog.cloudflare.com/web-bot-auth
[^26]: Cloudflare. "Web Bot Auth — Cloudflare implementation." May 5, 2026. https://developers.cloudflare.com/bots/reference/bot-verification/web-bot-auth/
[^27]: Stellagent. "Web Bot Auth Explained: Cloudflare and IETF's New Standard for Authenticating AI Agents (2026)." April 9, 2026. https://stellagent.ai/insights/web-bot-auth-cloudflare-ietf
[^28]: Google. "Google's Guide to Authenticating Requests with Web Bot Auth (Experimental)." Accessed May 2026. https://developers.google.com/crawling/docs/crawlers-fetchers/web-bot-auth
[^29]: Cloudflare. "Web Bot Auth — required component parameters and unsupported parameters." Accessed May 2026. https://developer.cloudflare.com/bots/reference/bot-verification/web-bot-auth/
[^30]: Cloudflare. "Custom rules — bot score and verified bot composite expressions." Accessed May 2026. https://developer.cloudflare.com/bots/additional-configurations/custom-rules/
[^31]: Vercel. "Verified bots verification methods (IP, reverse DNS, Web Bot Auth via RFC 9421)." February 17, 2026. https://vercel.com/docs/bot-management
[^32]: Vercel. "Handling Verified Bots — botid@1.5.0 and above." Accessed May 2026. https://vercel.com/docs/botid/verified-bots
[^33]: IETF. "Web Bot Auth working group documents." Accessed May 2026. https://datatracker.ietf.org/wg/webbotauth/documents/
[^34]: Cloudflare. "Bot verification methods overview." August 27, 2025. https://developers.cloudflare.com/bots/reference/bot-verification
[^35]: GrowthScope. "Block or Allow GPTBot? robots.txt Guide 2026." April 15, 2026. https://growthscope.io/en/blog/gptbot-block-allow-robots-txt-guide-2026
[^36]: Vercel. "BotID Deep Analysis pricing — $1 per 1000 checkBotId() calls." February 17, 2026. https://vercel.com/docs/botid
[^37]: Vercel. "BotID Deep Analysis powered by Kasada." February 17, 2026. https://vercel.com/docs/botid
[^38]: Cloudflare. "AI Bots managed ruleset blocked-bots list." Accessed May 2026. https://developers.cloudflare.com/bots/concepts/bot
[^39]: Cloudflare. "Block AI bots takes precedence over other Super Bot Fight Mode rules." Accessed May 2026. https://developers.cloudflare.com/bots/concepts/bot
[^40]: IETF. "Web Bot Auth WG — webbotauth-registry-01 draft." Accessed May 2026. https://datatracker.ietf.org/wg/webbotauth/documents/
[^41]: IETF. "draft-nottingham-webbotauth-use-cases-02." October 2025. https://datatracker.ietf.org/wg/webbotauth/documents/
[^42]: Cloudflare. "Web Bot Auth signature directory media type and required headers." Accessed May 2026. https://developer.cloudflare.com/bots/reference/bot-verification/web-bot-auth/
[^43]: Cloudflare. "Web Bot Auth — Signature-Agent header construction." Accessed May 2026. https://developer.cloudflare.com/bots/reference/bot-verification/web-bot-auth/
[^44]: Vercel. "Bot Management documentation — robots.txt and verified bots interaction." February 17, 2026. https://vercel.com/docs/bot-management
[^45]: Vercel. "BotID handling for ChatGPT Operator example." Accessed May 2026. https://vercel.com/changelog/vercel-botid-now-leverages-vercels-verified-bot-directory
[^46]: Anthropic. "ClaudeBot, Claude-User, Claude-SearchBot privacy documentation." Accessed May 2026. https://privacy.anthropic.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler
[^47]: Anthropic. "Crawl-delay non-standard extension support." Accessed May 2026. https://privacy.anthropic.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler
[^48]: Google. "agent.bot.goog Web Bot Auth experimental key directory." Accessed May 2026. https://developers.google.com/crawling/docs/crawlers-fetchers/web-bot-auth
[^49]: Cloudflare. "AI Labyrinth — generated content maze for non-compliant crawlers." Accessed May 2026. https://developer.cloudflare.com/bots/additional-configurations/custom-rules/
[^50]: Cloudflare. "Managed robots.txt feature." Accessed May 2026. https://developer.cloudflare.com/bots/additional-configurations/custom-rules/
[^51]: Cloudflare. "Web Bot Auth status announcement and closed beta." May 15, 2025. https://blog.cloudflare.com/web-bot-auth
[^52]: Cloudflare. "Web Bot Auth production activation March 2026." Accessed May 2026 (cited via Stellagent). https://stellagent.ai/insights/web-bot-auth-cloudflare-ietf
[^53]: SEOScanHQ. "Three-tier crawler framework analysis." March 24, 2026. https://seoscanhq.com/blog/robots-txt-vs-llms-txt
[^54]: Foglift. "Selective allow policy: search bots allowed, training bots blocked." March 15, 2026. https://foglift.io/blog/robots-txt-ai-crawlers
[^55]: AEOprobe. "Selective allow policy implementation." March 15, 2026. https://aeoprobe.com/blog/robots-txt-ai-bots
[^56]: AI Crawler Check. "Selective approach (allow search-facing, block training-only) recommendation." March 15, 2026. https://aicrawlercheck.com/blog/how-to-block-ai-crawlers-robots-txt
[^57]: GrowthScope. "GPTBot block-vs-allow decision matrix." April 15, 2026. https://growthscope.io/en/blog/gptbot-block-allow-robots-txt-guide-2026
[^58]: Cloudflare. "WAF custom rule example combining bot score with verified bot status." Accessed May 2026. https://developer.cloudflare.com/bots/additional-configurations/custom-rules/
[^59]: Bots.fyi. "Vercel verified bot directory entries (Google-CloudVertexBot, Vercel build container, etc.)." Accessed May 2026. https://bots.fyi/
[^60]: Stellagent. "Cloudflare 'Allow verified bots only' dashboard toggle UX." April 2026. https://stellagent.ai/insights/web-bot-auth-cloudflare-ietf
[^61]: IETF. "draft-meunier-http-message-signatures-directory JWKS format requirements." March 2026. https://datatracker.ietf.org/doc/html/draft-meunier-http-message-signatures-directory
[^62]: IETF. "Web Bot Auth architecture draft section 5.8 anonymity tradeoff." March 2026. https://datatracker.ietf.org/doc/draft-meunier-web-bot-auth-architecture/
[^63]: Google. "Web Bot Auth experimental status caveats." Accessed May 2026. https://developers.google.com/crawling/docs/crawlers-fetchers/web-bot-auth
[^64]: Stellagent. "Currently supported agents (Claude, GPT, Perplexity, Common Crawl, Google bots)." April 2026. https://stellagent.ai/insights/web-bot-auth-cloudflare-ietf
[^65]: SEOScanHQ. "robots.txt vs llms.txt complementary file system." March 24, 2026. https://seoscanhq.com/blog/robots-txt-vs-llms-txt
[^66]: Foglift. "GPTBot, OAI-SearchBot, ChatGPT-User three-tier OpenAI crawler split." March 15, 2026. https://foglift.io/blog/robots-txt-ai-crawlers
[^67]: AEOprobe. "ClaudeBot vs Claude-Web vs anthropic-ai user-agents." March 15, 2026. https://aeoprobe.com/blog/robots-txt-ai-bots
[^68]: GrowthScope. "Common robots.txt mistakes — wildcard blocks, no distinction between crawler types." April 15, 2026. https://growthscope.io/en/blog/gptbot-block-allow-robots-txt-guide-2026
[^69]: AI Crawler Check. "Trust-not-force nature of robots.txt voluntary protocol." March 15, 2026. https://aicrawlercheck.com/blog/how-to-block-ai-crawlers-robots-txt
[^70]: seo.yatna.ai. "Configuration 3 (allow browse, block training) middle-path recommendation." January 14, 2026. https://seo.yatna.ai/seo-academy/robots-txt-guide-ai-crawlers-2026

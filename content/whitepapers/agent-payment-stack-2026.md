---
title: "The Agent Payment Stack 2026"
subtitle: "x402, ACP, AP2, MPP, TAP, and the cryptographic settlement layer of the agent economy — how to choose, layer, and ship the payment infrastructure your category will run on for the next decade. Synthesized from 100+ primary sources, the x402 Foundation transition, the Tempo mainnet launch, and the first 12 months of production agentic transactions."
publication: "perea.ai Research"
authors: ["Dante Perea"]
version: "1.0"
status: "Public draft"
date: "2026-05-06T22:34"
audience: "SaaS founders, payments engineers, fintech architects, and infrastructure leads building or accepting agent-initiated payments in 2026"
length: "~9,500 words"
license: "CC BY 4.0"
description: "The canonical decision matrix for the agent payment stack: x402 (Coinbase), ACP (OpenAI/Stripe), AP2 (Google), MPP (Stripe/Tempo), TAP (Visa). Architecture, layering rules, vertical recommendations, code examples, regulatory horizon, references."
profile: "field-manual"
---

# Foreword

In May 2025, Coinbase shipped a small developer preview of a payment protocol that revived the dormant HTTP 402 status code. The reference implementation was a single middleware function. The whitepaper was twelve pages. The hype was muted. By April 2026, x402 was processing roughly 75 million transactions every thirty days across Base and Solana, with 94,000 active buyers, and Coinbase had transferred governance of the protocol to the Linux Foundation under a twelve-member coalition that included Stripe, Visa, Mastercard, American Express, Google, AWS, Microsoft, Cloudflare, Shopify, Circle, and Polygon Labs[^1][^2][^3].

A year before that, the question was whether autonomous AI agents would ever be allowed to spend money.

Twelve months later, every major payment company on earth has shipped a protocol, framework, or developer kit to make sure they can.

Stripe and OpenAI launched the Agentic Commerce Protocol on September 29, 2025, alongside Etsy and Shopify[^4][^5]; Google launched the Agent Payments Protocol with Mastercard, American Express, PayPal, Adyen, Worldpay, and 60+ partners shortly after[^6][^7];

Visa unveiled the Trusted Agent Protocol with Cloudflare and twelve infrastructure partners on October 14, 2025[^8][^9][^10]; and Stripe and Tempo launched the Machine Payments Protocol on March 18, 2026 alongside Tempo's mainnet, backed by a $500 million Series A at a $5 billion valuation[^11][^12][^13].

In the same window, OpenAI's ChatGPT Instant Checkout went live with Etsy, expanded to Shopify, then added Salesforce Commerce Cloud (L'Oréal, Pandora, Saks), PayPal's global merchant network, and Walmart[^14][^15][^16]. Klarna issued the first stablecoin on Tempo. Mastercard Agent Pay completed live transactions across nine APAC markets and a Latin America wave spanning thirteen issuers[^17]. Visa Intelligent Commerce Connect launched April 8, 2026 with AWS, Highnote, and Mesh; American Express published its Developers Kit on April 14, with the EVP for the program publicly committing that "we're standing behind the agents" on transaction errors[^17].

This is the field guide to that landscape. It is the second commerce-layer paper in the perea.ai Research series — after the B2A Imperative laid out the six-layer protocol stack and the MCP Server Playbook covered the protocol surface — and it closes the commerce thread with the same level of rigor: 100+ primary sources, a layered architecture model that names which protocol does what, a per-vertical decision matrix, working code examples for x402 and MPP, the regulatory horizon (MiCA dual-licensing, PSD2 transition, Travel Rule, GENIUS Act), and a 90-day implementation playbook for SaaS founders shipping agent-payable products.

The thesis is short. **Agent payments are not a single protocol decision. They are a four-layer stack — identity, authorization, commerce, settlement — and the stack composes.** A production system in 2026 typically uses TAP or AP2 for identity/authorization, ACP or UCP for commerce orchestration, and x402 or MPP for settlement. Picking one and ignoring the others is the mistake every team makes once. The teams that ship the full stack now build a defensible position; the teams that wait for "the winner" pay retail in 2027 for the position that should have been wholesale.

— *perea.ai Research*

---

# Executive Summary

**The thesis.** The agent payment stack is layered, not winner-take-all. Five protocols dominate the production landscape in mid-2026 — x402, ACP, AP2, MPP, TAP — and they operate at different layers. Brands that pick the wrong layer fight a category war they cannot win; brands that compose the layers correctly own a position that compounds with every new agentic surface.

**The four-layer reference architecture.**

| Layer | Question | Protocols | Status |
| --- | --- | --- | --- |
| **Identity** | Is this agent who it claims to be? | TAP (Visa), Web Bot Auth, agent DIDs (ACK-ID, AGIRAILS) | TAP open-sourced Oct 2025; Akamai integrated Dec 2025[^9][^10] |
| **Authorization** | What is this agent allowed to do? | AP2 (Google), Mastercard Verifiable Intent, ACK-ID delegation | AP2 60+ partners, Revolut Pay live UK/EEA Jan 2026[^7][^17] |
| **Commerce** | What is being purchased and on what terms? | ACP (OpenAI/Stripe), UCP (Google), x402 Bazaar | ChatGPT Instant Checkout live with Etsy/Shopify/Walmart/Salesforce/PayPal[^15][^16] |
| **Settlement** | How does the money actually move? | x402 (USDC/Base/Solana), MPP (Stripe + Tempo + cards + Lightning), card networks via Stripe SPT, Circle Nanopayments | x402 ~$600M annualized volume; MPP launched March 2026 with 100+ services[^3][^11][^12] |

**The evidence.**

- **x402 momentum.** Coinbase transferred x402 to the Linux Foundation on April 2, 2026 with 12 founding members from card networks, hyperscalers, and crypto[^2][^3]. Cumulative volume reached ~150M transactions across Base (119M) and Solana (35M); approximate annualized volume ~$600M[^1]. Cloudflare integrated x402 into its Agents SDK; Coinbase Payments MCP exposes x402 as a callable LLM tool[^18][^19].

- **ACP production.** ChatGPT Instant Checkout went live on Sept 29, 2025 with Etsy. By Oct 14, 2025 it had expanded to Salesforce Commerce Cloud (L'Oréal, Pandora, Saks); by holiday 2025 it covered Walmart and 1M+ Shopify merchants; by Feb 2026 PayPal joined[^14][^15][^16]. OpenAI shut down the original Instant Checkout in early March 2026 (~12 merchants live, conversion below target) but ACP itself continues with Shopify, Salesforce, PayPal, and Worldpay[^17].

- **AP2 ecosystem.** Google's AP2 ships with 100+ partners — Mastercard, American Express, PayPal, Adyen, Worldpay, Visa, Coinbase, Solana, Tether, Circle, Klarna, Shopify, Salesforce, Walmart, ServiceNow, Intuit, Revolut, and dozens more[^6]. Revolut Pay went live with AP2 across UK/EEA on January 19, 2026 — among the earliest live AP2 integrations from a European-licensed payment institution[^17].

- **MPP and Tempo.** Tempo mainnet launched March 18, 2026 — incubated by Stripe and Paradigm, $500M Series A at $5B valuation, EVM-compatible, 100,000+ TPS target, sub-second finality, stablecoin-native gas[^11][^12][^13]. MPP launched same day with Anthropic, OpenAI, Alchemy, Dune Analytics, fal.ai, Browserbase, DoorDash, Ramp, Revolut, Shopify, and Stripe Climate among the 100+ integrated services[^11][^20][^21].

- **TAP at the edge.** Visa's Trusted Agent Protocol uses RFC 9421 HTTP Message Signatures and aligns with WebAuthn — built with Cloudflare and ecosystem feedback from Adyen, Ant International, Checkout.com, Coinbase, CyberSource, Elavon, Fiserv, Microsoft, Nuvei, Shopify, Stripe, Worldpay[^8][^9][^10]. Akamai joined as the latest TAP integrator in December 2025; Visa explicitly committed to interoperability with x402[^17][^22].

- **Card network alignment.** All three major US card networks shipped agent infrastructure by April 2026. Visa Intelligent Commerce Connect (April 8, 2026), Mastercard Verifiable Intent (live across LATAM and ASEAN), American Express Developers Kit (April 14, 2026) with Amex covering AI agent errors. Morgan Stanley projects US agentic commerce reaches $385B by 2030[^17].

- **Conversion data.** Hashmeta's panel of 47 e-commerce businesses found ChatGPT Instant Checkout converting at 43.7% versus 2.3% on traditional e-commerce — a 19× lift[^23]. Pew clocked 8% click rate when AI Overview is present vs 15% otherwise (separate data point but corroborates the agent-mediated discovery shift)[^24]. ChatGPT reached 700M weekly active users by August 2025; ~2.8% of messages are product-related, implying ~126M weekly product conversations[^14][^25].

- **Sub-cent economics.** Circle Nanopayments launched on testnet March 3, 2026 enabling gas-free USDC transfers as small as $0.000001 via offchain aggregation and batched onchain settlement[^26][^27][^28]. Standard onchain x402 settles at near-zero fees for amounts above ~$0.05; below that, batching architectures (Cloudflare deferred settlement, Circle Gateway) become necessary.

- **The honest counter-evidence.** Bloomberg's March 7, 2026 exposé documented the gap between investment and adoption: ~$50M total agentic commerce volume against stablecoins' $46T annual transaction volume; ~40,000 agents transacting; x402 ~$24M over 30 days against $6.88T global e-commerce[^29]. The infrastructure is ahead of the demand; the demand is real but small.

**The five protocols, one-line each.**

1. **x402 (Coinbase, now Linux Foundation).** Settlement layer. HTTP 402 + EIP-3009 stablecoin payments. USDC on Base/Solana. Permissionless. Sub-second finality. Best for API monetization, machine-to-machine micropayments, and crypto-native flows.
2. **ACP (OpenAI/Stripe).** Commerce orchestration. Four RESTful endpoints (Create / Update / Complete / Cancel). Single-use SharedPaymentToken (SPT). Fiat via Stripe. Powers ChatGPT Instant Checkout. Best for consumer commerce inside AI surfaces.
3. **AP2 (Google).** Authorization framework. SD-JWT mandates with Key Binding signed via ECDSA P-256. Two mandate types (Checkout, Payment). Payment-method agnostic — composes with x402, MPP, ACP, and card rails. Best as the trust layer underneath any commerce protocol.
4. **MPP (Stripe + Tempo).** Settlement + sessions. HTTP 402 with session-based pre-authorization ("OAuth for money"). Fiat (cards via Stripe SPT) + stablecoins on Tempo + Bitcoin Lightning + Solana. Idempotency keys, request-body binding, streaming sessions. Best when you want one rail across fiat and crypto with Stripe-grade compliance.
5. **TAP (Visa).** Identity layer. RFC 9421 HTTP Message Signatures + WebAuthn alignment. Cryptographic agent recognition + consumer recognition + payment metadata. Open on GitHub. Built with Cloudflare. Best at the network edge to verify agents *before* a payment ever happens.

**The operator math.** A SaaS shipping its first agent-payable endpoint can have x402 live in roughly two hours via the Coinbase CDP facilitator (1,000 free transactions/month, then $0.001/tx). MPP via Stripe is roughly two days for a team already on Stripe. TAP verification at the edge runs through Cloudflare and Akamai for sites already on either CDN. AP2 mandate verification is roughly a sprint of work given an existing Stripe or card-network relationship. ACP is the heaviest lift — Etsy and Shopify merchants are auto-eligible, but custom integrations require checkout endpoint implementation, delegated payment work, and a production certification — typically 4–8 weeks of engineering[^17][^18][^30].

The protocol stack is converging fast. The brands that ship the full layered architecture in 2026 own positions in the agent commerce layer that will be defended for years. The brands that wait for "the winner" will be paying retail integration costs in 2027 to enter a market that's already routed around them.

---


## Quotable Findings

1. Stripe and Tempo launched the Machine Payments Protocol on March 18, 2026 alongside Tempo's mainnet, backed by a $500 million Series A at a $5 billion valuation[^11][^12][^13].

2. Hashmeta's panel of 47 e-commerce businesses found ChatGPT Instant Checkout converting at 43.7% versus 2.3% on traditional e-commerce — a 19× lift[^23].

3. Circle Nanopayments launched on testnet March 3, 2026 enabling gas-free USDC transfers as small as $0.000001 via offchain aggregation and batched onchain settlement[^26][^27][^28].

4. Bloomberg's March 7, 2026 exposé documented the gap between investment and adoption: ~$50M total agentic commerce volume against stablecoins' $46T annual transaction volume; ~40,000 agents transacting; x402 ~$24M over 30 days against $6.88T global e-commerce[^29].

5. Stablecoin circulation reached $312B by Q4 2025 (Circle USDC at $75.3B, +72% YoY). On-chain transaction volume reached $11.9T (+247%). 99% of AI agent payments at Circle's measurement layer use USDC[^71][^72].

6. By December 2025, only 17 EMT issuers had been authorized across the EU; 45% of stablecoin applications had been rejected[^78].

# Part I — Why a Stack, Not a Standard

## 1.1 The interoperability myth

Every announcement reads as if there is a winner emerging. There is not. In the six months between October 2025 and April 2026, more than ten payment protocols launched to let AI agents spend money on their own — shipped by Coinbase, Stripe, Lightning Labs, Google, Visa, Mastercard, American Express, OpenAI, Skyfire, and Alibaba — and none of them interoperate at the wire level[^31].

The protocols are not competing for the same job. They are layered. x402 is a settlement protocol; AP2 is an authorization protocol; ACP is a commerce orchestration protocol; TAP is an identity protocol; MPP is a session-based settlement protocol that bridges fiat and crypto. The card networks (Visa Intelligent Commerce, Mastercard Agent Pay, American Express Developers Kit) sit underneath whichever rail the merchant accepts. The merchant problem is not "which protocol wins." The merchant problem is "which combination of layers do I need to support for the agents that will buy from me."

The cross-membership of the partner lists is the cleanest evidence that the protocols are designed to compose:

- **Stripe** is a co-author of ACP (with OpenAI), a co-author of MPP (with Tempo/Paradigm), an x402 Foundation founding member, and an AP2 partner[^2][^4][^11][^6].

- **Mastercard** is an x402 Foundation founding member, runs Agent Pay on its own SD-JWT credential set, is an AP2 partner, and delegates agent identity to Cloudflare's Web Bot Auth — the same RFC 9421 primitive Visa TAP uses[^2][^6][^32][^17].

- **Adyen, American Express, and Shopify** appear in the x402 Foundation, the AP2 partner list, and the UCP roster simultaneously[^2][^6][^33].

- **Visa** runs TAP, partnered with Cloudflare, is collaborating with Coinbase on x402 interoperability, is an AP2 partner, and a UCP partner[^8][^17][^33].

- **Google** runs AP2 and UCP, ships A2A x402 extension via Coinbase, and is an x402 Foundation founding member[^2][^6][^33].

- **PayPal** is in AP2 and UCP, integrated with ChatGPT for Instant Checkout, and *absent* from the x402 Foundation — the most strategically interesting non-membership in the stack[^15][^31].

The question for a SaaS founder in 2026 is not which protocol to bet on. It is which layer of which protocol stack to ship first, and how to architect so the other three layers slot in cleanly when needed.

## 1.2 What the four layers actually do

The reference architecture in mid-2026 is four layers, each with a specific failure mode if you skip it.

**Layer 1 — Identity (Who is this agent?).** Without identity verification, your merchant edge cannot distinguish a Visa-vetted shopping agent from a malicious scraper. TAP, Web Bot Auth, and agent DID frameworks (ACK-ID, AGIRAILS, Catena Labs' work) live here. Visa's framing is direct: "merchants face an identity crisis before they face a payments problem"[^32]. Failure mode if skipped: bot abuse, ad fraud, scraping costs, and bot management false-positives that block legitimate buying agents.

**Layer 2 — Authorization (What is this agent allowed to do?).** Without authorization, you have agent identity but no proof of intent. AP2 mandates, Mastercard Verifiable Intent, and ACK-ID delegation chains live here. The classical example in the AP2 spec is the Cart Mandate: cryptographic proof that the human authorized the agent to spend $X on these specific line items at this specific merchant[^7][^34]. Failure mode if skipped: liability nightmare, dispute exposure, regulatory non-compliance under GENIUS Act / FATF Travel Rule / MiCA.

**Layer 3 — Commerce (What's being bought, on what terms?).** Without commerce orchestration, you have authorization but no structured way to discover product, build cart, calculate tax, handle fulfillment, and confirm order. ACP, UCP, and the x402 Bazaar (discovery) live here. The four ACP endpoints — Create / Update / Complete / Cancel — define the lifecycle[^4][^30][^35]. Failure mode if skipped: every agent-merchant integration becomes a one-off custom build.

**Layer 4 — Settlement (How does money actually move?).** Without settlement, the previous three layers are theater. x402 (stablecoin), MPP (multi-rail), card-network rails via Stripe SPT, and Circle Nanopayments (sub-cent batched) live here. The choice depends on transaction size, latency tolerance, regulatory posture, and counterparty preferences. Failure mode if skipped: you have legible agentic intent and no way to capture revenue from it.

The clean architectural insight is that an agent transaction in 2026 typically uses one protocol per layer:

```
Agent → TAP (identity edge) → AP2 (mandate verification) → ACP/UCP (cart) → x402/MPP (settlement)
```

This is not aspirational. It is what Stripe, Visa, Mastercard, Google, and Coinbase have all converged on in their public architecture diagrams between October 2025 and April 2026[^17][^32][^34][^36].

## 1.3 The "fast path" question

Most teams shipping in 2026 don't need all four layers on day one. The fast path depends on what you're selling.

- **API or data product:** Ship x402 alone. Coinbase CDP facilitator, two-hour integration. AP2 / TAP / ACP unnecessary at first because the buyer is a developer or an agent, not a consumer-facing checkout flow.
- **Agent-facing browser/automation product (Browserbase, Parallel, Apify-like):** Ship x402 + MPP. Multiple rails capture both crypto-native and Stripe-customer agents. Browserbase's mpp.browserbase.com offers $0.12/hour browser sessions on x402 USDC and MPP Tempo simultaneously — a model worth copying[^37][^38].
- **Consumer commerce in an AI surface (ChatGPT, Copilot, Perplexity, Gemini):** ACP is mandatory and AP2 is increasingly so. If you're on Shopify or Etsy, you're auto-enrolled. Otherwise plan 4–8 weeks of engineering and a production certification.
- **B2B SaaS with enterprise buyers:** AP2 + MPP via Stripe is the strongest combination. AP2 mandates satisfy procurement audit requirements; MPP via Stripe Dashboard satisfies financial-controls integration.
- **High-volume API where every call is sub-cent:** Circle Nanopayments + x402. Batched settlement makes sub-cent economics viable.

The point is that none of this is hypothetical. There are working production deployments at every layer, and the operator decision is composition — not selection.

---

# Part II — The Five Protocols in Depth

## 2.1 x402: HTTP-native settlement

x402 was introduced by Coinbase on May 6, 2025 as an open standard that uses the HTTP 402 "Payment Required" status code to enable instant stablecoin payments directly over HTTP[^39][^40]. The protocol was developed in partnership with Cloudflare and ecosystem contributors. On April 2, 2026, Coinbase transferred governance to the Linux Foundation under the new x402 Foundation, with twelve founding members spanning card networks, cloud providers, processors, and crypto-native companies[^2][^3].

**The flow.** Three roles: client, resource server, optional facilitator.

1. Client makes HTTP request to a paid endpoint.
2. Server returns 402 with a `PAYMENT-REQUIRED` header containing base64-encoded payment requirements (amount, asset, recipient, network, scheme, expiry, nonce).
3. Client signs an EIP-712 / EIP-3009 payload with their wallet and retries the request with a `PAYMENT-SIGNATURE` header.
4. Server verifies the signature locally or via a facilitator (Coinbase CDP, Cloudflare's facilitator, or self-hosted).
5. Facilitator broadcasts the transaction; on confirmation, server returns 200 with the resource and a `PAYMENT-RESPONSE` settlement header[^41][^42].

**Production posture as of April 2026.**

- ~150M transactions cumulative (119M Base, 35M Solana)[^1].
- Roughly $600M annualized volume.
- Coinbase Developer Platform facilitator: 1,000 free tx/month, then $0.001/tx[^41].
- Networks: Base, Polygon, Solana on mainnet; Base Sepolia and Solana Devnet for testing.
- SDKs: TypeScript/Node.js (Express, Next.js, Hono), Go, Python (FastAPI, Flask), Rust.
- v2 spec (Dec 9, 2025): CAIP-2 network identifiers, restructured PaymentPayload/Required, ResourceInfo separation, extensions support[^43].
- Cloudflare integration into Agents SDK puts x402-enabled endpoints on the same edge that handles ~20% of global web traffic[^18].

**Strengths.**
- Permissionless and chain-agnostic by design.
- One-line server integration (`x402.middleware()`).
- Extension system (Bazaar discovery, gasless Permit2 approvals, Sign-in-with-x).
- Compatible with MCP and A2A as transport layers, not just HTTP.

**Weaknesses.**
- Still primarily USDC-on-Base in practice; chain-agnostic in spec, USDC-dependent in production.
- Pay-first model creates latency ceiling for high-frequency micropayments — addressed by AEP2 (FluxA), Circle Nanopayments, and Cloudflare's deferred settlement scheme[^31][^44].
- Wallet/signing UX still rough for non-developer agents; embedded wallets (Coinbase CDP `useX402` hook, Privy) close the gap[^45].

**When to choose x402.** API monetization. Crypto-native flows. Pay-per-call data products. Agent-marketplace primitives. Anything where the buyer is a developer-controlled agent and the seller doesn't want a Stripe account.

**Reference architecture.**

```typescript
// Express middleware — one-line x402 integration
import express from 'express';
import { x402, requirePayment } from '@x402/express';

const app = express();
app.use(x402({
  facilitator: 'https://facilitator.coinbase.com',
  recipient: '0xABCDEF1234567890ABCDEF1234567890ABCDEF12',
  network: 'eip155:8453',  // Base mainnet
}));

app.get('/api/market-data',
  requirePayment({ amount: '0.10', asset: 'USDC' }),
  (req, res) => res.json({ price: 65000, timestamp: Date.now() })
);

app.listen(3000);
```

## 2.2 ACP: Agentic Commerce Protocol

ACP was launched on September 29, 2025 by OpenAI in partnership with Stripe[^4][^5][^14]. It is an open standard (Apache 2.0) that defines how AI agents complete purchases on behalf of buyers, with the first production deployment being ChatGPT Instant Checkout. By April 2026, the OpenAPI spec had reached version 2026-04-17 and the protocol had been adopted across consumer platforms (Shopify, Etsy, Walmart, Salesforce, PayPal) and was being implemented by Worldpay[^15][^16][^30].

**Building blocks.**

- **Agentic checkout:** Create / Update / Complete / Cancel checkout sessions with cart management, fulfillment options, and payment processing[^30][^46].
- **Cart and feed:** Browse product catalogs and manage shopping carts before checkout.
- **Delegate payment:** Securely pass payment tokens between buyers, agents, and businesses using payment handlers. Stripe's SharedPaymentToken (SPT) is the first production implementation — single-use, time-bound, amount-locked.
- **Delegate authentication:** OAuth 2.0 for agent acting-on-behalf-of-buyer authorization.
- **Orders and webhooks:** Order confirmation, shipping, delivery, refund lifecycle.

**ChatGPT Instant Checkout retrospective.**

The sequence is worth recording because it's the canonical case study for ACP:

1. **Sept 29, 2025:** Live with U.S. Etsy sellers; Etsy stock +16%, Shopify +6%[^47].
2. **Oct 14, 2025:** Salesforce Commerce Cloud merchants (L'Oréal, Pandora, Saks) joined; Walmart announced for fall 2025; Shopify gradual rollout[^15].
3. **Holiday 2025:** PayPal connected its global merchant network[^15].
4. **Early March 2026:** OpenAI shut down the original Instant Checkout product after only ~12 merchants went live and conversion rates fell short — *but ACP itself remained active*. Shopify, Salesforce, and PayPal continued to build on it[^17][^31].

The lesson is that ACP-the-protocol decoupled from ChatGPT-the-product. The protocol survived; the OpenAI-specific go-to-market did not. For SaaS founders this is critical: ACP integrations don't depend on the survival of any single AI surface.

**Conversion data.** Hashmeta's 47-business panel reported ChatGPT Instant Checkout converting at 43.7% versus 2.3% on traditional e-commerce — a 19× lift on a small sample over a 6-month window[^23]. Treat the magnitude with caution; treat the direction as confirmed.

**When to choose ACP.** Consumer commerce in an AI surface. If you're on Shopify or Etsy, you're auto-eligible. If you're on a custom commerce platform, plan 4–8 weeks of engineering + production certification + delegated payment integration with Stripe.

**Critical implementation details.**
- The SharedPaymentToken (SPT) is single-use and amount-locked. Token rotation logic and idempotency keys are non-negotiable.
- Order attribution flows back to your merchant-of-record system. For Shopify merchants, attribution is automatic; for custom platforms, you implement the `continue_url` pattern.
- ACP is REST-and-MCP compatible — you can publish your checkout via traditional API or expose it as MCP tools[^46][^48].

## 2.3 AP2: Agent Payments Protocol

AP2 is Google's authorization framework, announced in September 2025 and now backed by 100+ partners — Mastercard, American Express, PayPal, Visa, Adyen, Worldpay, Stripe, Coinbase, Solana, Tether, Circle, Klarna, Shopify, Salesforce, Walmart, Revolut, ServiceNow, Intuit, and dozens more[^6][^7][^49]. It is not a payment rail — it is the cryptographic trust layer that proves an agent was authorized to act, and it composes with whatever payment protocol the merchant accepts.

**The core construct: mandates.**

AP2 defines two mandate types, both implemented as SD-JWT Verifiable Credentials with Key Binding:

- **Checkout Mandate:** Cryptographic proof that the Shopping Agent is authorized to purchase the assembled checkout. The Merchant signs a JWT containing the Checkout payload; the Checkout Mandate binds to it via cryptographic hash.
- **Payment Mandate:** Cryptographic proof that the Shopping Agent is authorized to pay for the specific Checkout. Bound to the Checkout JWT via hash. Verified by the Credential Provider, Network, and Merchant Payment Processor[^7][^34].

**Two operational modes.**

- **Direct mode:** User approves the Mandate Content on a Trusted Surface (their device) and delegates the resulting Mandate to the Agent. Used for human-present or near-real-time flows.
- **Autonomous mode:** Open Mandate created with constraints (spend caps, category, expiry, allowed merchants). The agent uses its own key (bound to the Mandate's `cnf` claim) to bind it to specific transactions. Used for delegated, long-running agent authority[^7][^34].

**The ECDSA Asymmetric Pivot.** The AP2 spec mandates that Checkout JWTs use a digital signature scheme like ECDSA (and explicitly *not* a deterministic signature like Ed25519) to prevent rainbow-table attacks against the hash binding[^34]. This is a non-trivial implementation detail that has tripped up teams using HS256 symmetric signing — Sonnet & Prose's audit found three failure modes in production AP2 deployments: symmetric signing (verifiers can forge), orphan cart credentials (no chain to parent intent), and missing revocation registries (only short expirations as fallback)[^50].

**Chain of trust.**

```
User → signs → Open Mandate (constraints + agent's cnf.jwk)
Agent → signs → Closed Mandate (specific txn, bound to Open via Key Binding JWT)
Verifier → verifies → returns signed Mandate Receipt
```

Mandates form a cryptographically verifiable chain from the original user-approved Mandate through to the closed Mandate used to authorize the action[^51].

**When to choose AP2.** When you need non-repudiation. When procurement, legal, or financial compliance audit demands cryptographic proof of authorization. When you're integrating with multiple payment rails and want a unified authorization layer that composes with all of them. When the EU AI Act, GENIUS Act, FATF Travel Rule, or PSD2 dual-licensing requirements apply to your transaction flows[^52][^53][^54].

**The UCP composition.** Google's Universal Commerce Protocol (UCP), announced January 2026 at NRF, is the commerce-orchestration layer Google ships *alongside* AP2[^33][^55]. UCP defines capabilities (Checkout, Cart, Identity Linking, Order) and extensions (Fulfillment, Discount, AP2 Mandates). The AP2 Mandates extension activates when both platform and business advertise `dev.ucp.shopping.ap2_mandate` capability — at which point checkout responses must include `ap2.merchant_authorization` (JWS detached content), and complete_checkout requests must include `ap2.checkout_mandate` (SD-JWT+kb)[^55][^56].

UCP is endorsed by Visa, Mastercard, Stripe, Shopify, Etsy, Wayfair, Target, Walmart, Adyen, American Express, Best Buy, Macy's, and Zalando[^33]. It explicitly competes with ACP for the commerce layer, and ACP is endorsed by OpenAI/Stripe/Salesforce/PayPal. Most production systems will end up supporting both.

## 2.4 MPP: Machine Payments Protocol

MPP launched March 18, 2026 alongside Tempo's mainnet, co-authored by Stripe and Tempo Labs[^11][^12][^13]. It revives HTTP 402 like x402 but adds a session layer — Stripe describes it as "OAuth for money." Where x402 settles each request individually, MPP allows agents to pre-authorize a spending session, consume resources, and stream micropayments that batch-settle at session close.

**Key differences from x402.**

- **Session-based pre-authorization.** Agent locks a spending limit upfront. Spending happens within the limit without per-request blockchain settlement.
- **Multi-rail.** Supports stablecoins on Tempo (pathUSD, USDC), credit cards via Stripe SharedPaymentTokens, Bitcoin Lightning via Lightspark. Visa extended MPP for card-based payments. Solana SPL spec available[^57][^11].
- **Stripe Dashboard integration.** Transactions processed through Stripe surface in the Stripe Dashboard like any other transaction — same fraud protection, tax calculation, payouts[^58][^11].
- **Idempotency keys, request-body binding, streaming sessions.** Protocol-level features that enable micropayments as low as $0.0001[^57].

**Tempo as the settlement layer.**

Tempo is Stripe and Paradigm's Layer 1 blockchain, mainnet-launched March 18, 2026, with Mastercard, UBS, Klarna, Anthropic, Visa, OpenAI, Deutsche Bank, Standard Chartered, and Shopify as design partners[^59][^60][^61]. The technical bets:

- **100,000+ TPS target with sub-second deterministic finality** (Simplex Consensus)[^61].
- **Stablecoin-native gas.** Users pay fees in USD stablecoins via integrated AMM. No native token at launch[^60][^62].
- **EVM-compatible.** Built on Paradigm's Reth client. Existing Solidity contracts deploy with Hardhat / Foundry / Remix without modification[^61].
- **Dedicated payment lanes** for TIP-20 transactions — payments don't compete with general blockspace[^63].
- **Klarna issued the first stablecoin** (KlarnaUSD) on Tempo at testnet[^64].
- **Tempo Transactions** add native batching, fee sponsorship, parallel nonces, and scheduled execution windows — all primitives that enable subscriptions, batched payouts, and time-locked settlement at the protocol layer[^65].

**MPP production deployments at launch.**

The MPP launch list is the strongest single signal that this is not a research project:

- **Anthropic, OpenAI, Alchemy, Dune Analytics, fal.ai** — AI/data API monetization[^11].
- **Browserbase** — agents pay per browser session, $0.12/hour on x402 USDC + MPP Tempo[^37][^38].
- **Parallel Web Systems** — agents pay per API call for web search/extract/research[^21][^66].
- **DoorDash** — agents order food[^11].
- **PostalForm** — agents print and send physical mail[^11].
- **Prospect Butcher Co.** — agents order sandwiches in NYC[^11].
- **Ramp, Revolut, Shopify, Stripe Climate** — fintech and commerce[^11].

Parag Agrawal (Parallel Web Systems founder, ex-Twitter CEO): "We integrated machine payments with Stripe in just a few lines of code, and now agents can autonomously pay per API call for web access. This allows us to reach any agent developer in the world on the same Stripe stack we already run on"[^11].

**When to choose MPP.** When you need both fiat and crypto rails on the same endpoint. When you need session-based pre-authorization (subscriptions, streaming, metered consumption). When Stripe's existing fraud protection / tax calculation / merchant tooling matters. When you want enterprise-grade compliance from day one.

## 2.5 TAP: Trusted Agent Protocol

TAP launched October 14, 2025 from Visa, in collaboration with Cloudflare and ecosystem feedback from Adyen, Ant International, Checkout.com, Coinbase, CyberSource, Elavon, Fiserv, Microsoft, Nuvei, Shopify, Stripe, and Worldpay[^8][^9][^67]. Akamai joined as the latest TAP integrator in December 2025 with edge-based behavioral intelligence integration[^17][^22].

**What TAP does (and doesn't).**

TAP is *only* the identity layer. It does not move money. It does not orchestrate carts. It signs HTTP requests so merchants can verify, at the network edge, that the request is from a legitimate agent acting for a real customer rather than a bot scraping or probing.

The protocol defines three signed payload types:

- **Agent Recognition Signature.** Cryptographic proof that the request comes from a Visa-approved agent, bound to the merchant's host and the specific path[^8][^68].
- **Agentic Consumer Recognition Object.** Optional metadata (PARs for cards on file, loyalty numbers, emails, phone numbers) that lets merchants pre-fill or recognize returning customers.
- **Agentic Payment Container.** Optional payment data hash that lets merchants compare against credentials key-entered in checkout forms — mismatch indicates fraud[^9][^32].

**Technical foundation: RFC 9421 + WebAuthn.**

TAP signatures use RFC 9421 HTTP Message Signatures with Ed25519 or RSA-PSS-SHA256 algorithms. Signatures include:

- `@authority` (host)
- `@path` (request path)
- `created` and `expires` timestamps
- `keyid` (lookup against Visa's well-known JWKS at `https://mcp.visa.com/.well-known/jwks`)
- `nonce` (replay prevention)
- `tag` (`agent-browser-auth` or `agent-payer-auth` to scope intent)[^9][^68]

The JWKS publication lets any merchant or CDN verify Visa-issued agent keys without holding shared secrets. Verification happens at the CDN/gateway layer (Cloudflare, Akamai, custom edge), not in application code — minimizing UX changes on merchant sites.

**Sample architecture (open-source on GitHub at visa/trusted-agent-protocol).**

The Visa reference implementation ships five services[^69][^70]:

1. **TAP Agent** (Streamlit app) — generates RFC 9421 signatures.
2. **CDN Proxy** (Node.js Express) — RFC 9421 signature verification, Ed25519 + RSA-PSS-SHA256, public key retrieval from Agent Registry.
3. **Agent Registry** (FastAPI + Python) — Public key management for verification.
4. **Merchant Frontend** (React) — E-commerce sample with TAP integration.
5. **Merchant Backend** (FastAPI + SQLAlchemy) — RFC 9421 signature verification, business logic.

**TAP's positioning gap.** TAP verifies agents. It does *not* verify intent. Mastercard's Verifiable Intent (launched February 2026) addresses that gap — co-developed with Google, Worldpay, Fiserv, Checkout.com, and Adyen — providing cryptographic proof of what a consumer authorized[^17]. The honest take from Major Matters' March 2026 review: "For merchants adjudicating disputes over what an agent was authorized to purchase, TAP alone may not be sufficient"[^17].

**When to choose TAP.** When you accept agent traffic at the merchant edge and want to distinguish Visa-vetted agents from generic bots. When your existing CDN (Cloudflare, Akamai) supports edge signature verification. When agentic consumer recognition (returning-customer flows, loyalty integration) reduces checkout friction enough to justify the integration cost.

---

# Part III — The Decision Matrix

## 3.1 Per-vertical recommendations

The right combination of layers depends on what you're selling and to whom.

| Vertical | Identity | Authorization | Commerce | Settlement |
| --- | --- | --- | --- | --- |
| **API / data product (B2A)** | Optional | Optional | x402 Bazaar | x402 (USDC/Base) |
| **Agent infra (browsers, scrapers)** | Optional | Optional | Custom REST + x402 Bazaar | x402 + MPP (multi-rail) |
| **AI surface checkout (consumer)** | TAP at edge | AP2 mandates | ACP or UCP | Stripe SPT (fiat) or MPP |
| **B2B SaaS (enterprise)** | TAP or DID | AP2 mandates | UCP | MPP via Stripe |
| **Marketplaces** | TAP at edge | AP2 + Verifiable Intent | UCP | MPP (multi-rail) |
| **High-frequency micropayments** | Optional | Optional | x402 Bazaar | Circle Nanopayments + x402 |
| **Cross-border B2B** | DID-based | AP2 + Travel Rule | UCP or custom | MPP on Tempo (ISO 20022) |
| **Subscription / streaming** | TAP optional | AP2 with autonomous mandate | UCP or ACP | MPP session-based |

The pattern: settlement is rarely a single rail in production. The teams shipping fastest in 2026 are running x402 + MPP on the same endpoint to capture both crypto-native and Stripe-customer agents — the Browserbase pattern (`x402.browserbase.com` for USDC/Base; `npx mppx` for Tempo)[^37][^38].

## 3.2 The 11-dimension comparison

| Dimension | x402 | ACP | AP2 | MPP | TAP |
| --- | --- | --- | --- | --- | --- |
| **Layer** | Settlement | Commerce | Authorization | Settlement + Sessions | Identity |
| **Creator** | Coinbase (now Linux Foundation) | OpenAI + Stripe | Google + 100+ partners | Stripe + Tempo | Visa + Cloudflare |
| **Status** | x402 Foundation, GA | Open standard, GA | Public spec, partners growing | GA on mainnet (Mar 2026) | Developer preview, GA path |
| **Production volume** | ~150M tx, ~$600M annualized | $100M+ via ChatGPT IC | Revolut Pay UK/EEA live | 100+ services at launch | TAP traffic at edge |
| **Payment rails** | USDC on Base/Solana/Polygon | Cards via Stripe SPT | Agnostic (composes) | Stablecoins + cards + Lightning + Solana | None (identity only) |
| **Micropayments** | Excellent ($0.001+) | Poor (card minimums) | N/A | Excellent (streaming) | N/A |
| **Latency** | Sub-second on Base | Standard checkout | N/A | Sub-second on Tempo | Edge-fast |
| **Setup complexity** | Low (1 line) | Medium-High | High (cryptographic) | Medium (Stripe account) | Low (CDN integration) |
| **Decentralization** | High | Low (Stripe) | Medium | Low (Stripe + Tempo) | Low (Visa keys) |
| **Regulatory clarity** | Low (stablecoin evolving) | High (Stripe handles) | Medium (W3C VC) | High (Stripe handles fiat) | Very High (Visa rails) |
| **Best for** | API monetization, M2M | Consumer AI commerce | Trust layer for any rail | Multi-rail enterprise | Edge identity verification |

## 3.3 Honest market data

The protocol momentum is real but the production volumes are still small.

**x402 Foundation transition (April 2, 2026).** Coinbase transferred governance to the Linux Foundation. Twelve founding members: Stripe, Visa, Mastercard, American Express, Google, AWS, Microsoft, Cloudflare, Shopify, Circle, Polygon Labs, Coinbase. Notably absent: Ant International, PayPal, and Skyfire (each pursuing their own settlement layer)[^2][^3][^31].

**Bloomberg's March 7, 2026 reality check.** Total agentic commerce volume ~$50M against stablecoins' $46T annual transaction volume. ~40,000 agents transacting. x402 ~$24M over 30 days against $6.88T global e-commerce. The infrastructure is months ahead of the demand[^29].

**Card network forecasts.** Morgan Stanley projects US agentic commerce reaches $385B by 2030. McKinsey estimates agentic commerce could reach $5T globally by 2030. Treat these as directional, not predictive[^17][^28].

**Circle Nanopayments scale.** Stablecoin circulation reached $312B by Q4 2025 (Circle USDC at $75.3B, +72% YoY). On-chain transaction volume reached $11.9T (+247%). 99% of AI agent payments at Circle's measurement layer use USDC[^71][^72].

The honest summary: the agentic commerce demand curve is real but small and growing fast. The infrastructure is overbuilt relative to current demand. Brands that ship now buy a position cheap; brands that wait for the demand curve to be obvious pay retail.

---

# Part IV — Compliance, Identity, Disputes

## 4.1 The MiCA / PSD2 dual-licensing wall

The single most consequential regulatory event for agent payments in 2026 is the EBA's clarification that EMT-related transfer services and custody constitute PSD2 payment services — which means MiCA-licensed CASPs handling stablecoin payments need a *second* license[^54][^73][^74].

**Key dates:**
- **June 30, 2024:** MiCA Title III/IV (ARTs and EMTs) live[^75].
- **December 30, 2024:** Full MiCA framework live[^75].
- **March 2, 2026:** Original PSD2 transition deadline; CASPs without PSD2 license must stop EMT payment services[^54].
- **July 1, 2026:** Extended deadline (CASPs must have submitted by March 2 to qualify); no further extensions[^73].

**What this means operationally for an agent-payment SaaS shipping in Europe:**

1. If you handle EMT transfers (USDC/EURC) on behalf of users — you need a PSD2 license or a partnership with a licensed Payment Institution / E-Money Institution.
2. The "agent of a PI/EMI" model is the most common path: the PI/EMI holds the license, you operate as registered agent under their regulatory umbrella[^54].
3. Travel Rule (Regulation 2023/1113) applies with no de minimis threshold for VASP-to-VASP transfers — stricter than FATF's €1,000 floor[^76][^77].
4. By December 2025, only 17 EMT issuers had been authorized across the EU; 45% of stablecoin applications had been rejected[^78].

**The recommendation.** If your roadmap touches EU users or EU-based agents and you handle EMT settlement, model the dual-licensing path *now*. Partner with a PI/EMI rather than chase your own license unless you're a payments-native company. Reserve runway for 6–12 months of legal + compliance work before mainnet rollout.

## 4.2 The GENIUS Act and US trajectory

The US GENIUS Act (signed July 2025, effective January 2027) creates the federal stablecoin regulatory framework. Combined with the OCC's national trust bank charters granted to five crypto firms in 2025 and SEC-CFTC joint taxonomy, the US is on a regulatory track that enables agent payments at institutional scale by 2027[^61][^79]. Tempo's ISO 20022 compliance and protocol-level KYC hooks were built explicitly to satisfy GENIUS Act requirements at mainnet[^61].

## 4.3 Know Your Agent (KYA)

KYC fails for agents. An agent has no passport, face, or biometric. KYA is the framework that fills the gap — and the leading implementations all converge on the same primitives: W3C DIDs, Verifiable Credentials, and SD-JWTs[^80][^81][^82][^83].

The five KYA credential types from the zkMe framework are representative[^80]:

- **Agent Principal Credential (APC):** Agent is accountable to a specific KYC-verified human or legal entity.
- **Agent Certification Credential (ACC):** Agent passed safety/capability/compliance evaluations.
- **Agent Intent Credential (AIC):** Agent has declared planned actions before execution.
- **Agent Reputation Credential (ARC):** Agent has verifiable on-chain behavioral history.
- **Agent Payment Facilitation Credential (APF):** Agent is authorized to initiate, authorize, and settle compliant transactions within delegated spending limits.

Catena Labs' Agent Commerce Kit (ACK-ID + ACK-Pay) ships a working reference implementation — Decentralized Identifiers for agent identity, Verifiable Credentials for ownership/authorization, and SD-JWT receipts for settlement proof[^81][^82]. AGIRAILS uses `did:ethr` for portable identity backed by on-chain reputation scoring[^83]. StableKYA maps KYA credentials to specific GENIUS Act / FATF Recommendation 16 / FCA / NIST PQC obligations[^82].

**The operator implication.** If your transaction volume crosses the threshold where regulators care, your agent will need to present W3C VCs proving its principal is KYC'd, jurisdictionally approved, and operating within authorized spending limits. AP2 mandates are a subset of this picture; the full picture requires the agent identity layer to ship alongside the payment layer.

## 4.4 Disputes, errors, and chargebacks

Three production answers emerged in 2025-2026:

1. **American Express stands behind the agents.** As of April 14, 2026, Amex covers errors made by AI agents on Amex transactions. Amex EVP Luke Gebb: "We're standing behind the agents"[^17]. Closed-loop network advantage — they issue, network, and acquire.
2. **AP2 signed receipts.** The Mandate Receipt is a Verifier-signed JWT returned upon mandate verification. It includes the result, hash of the closed mandate, and timestamp — creating a non-repudiable audit trail[^7][^34].
3. **Credit-system buffers between settlement and tool calls.** AgentPMT's x402Direct architecture absorbs the gap between final on-chain settlement and per-call tool consumption: payments settle in batches; per-call credits are debited internally; tool failures auto-refund credits before the agent's next action[^44][^31].

The pattern: in mid-2026, dispute architecture is *not yet standardized*. Different rails offer different protections. AP2 + ACK-Pay receipts give you cryptographic non-repudiation; Stripe MPP gives you Stripe's existing dispute infrastructure; x402 gives you nothing at the protocol layer (settlement is final). Choose the rail whose dispute model matches your risk appetite.

---

# Part V — The 90-Day Implementation Playbook

## 5.1 Days 0–30: Audit, layer selection, and shipping the first endpoint

**Week 1 — Audit and layer selection.**

- Identify which layers you actually need. Most teams ship Settlement first (x402 alone) and add Identity / Authorization / Commerce only as customer demand requires.
- Map your buyer profile. Developer-controlled agents → x402. Consumer-facing AI surfaces → ACP + AP2. Enterprise procurement → AP2 + MPP. High-frequency machine-to-machine → x402 + Circle Nanopayments.
- Map your existing infrastructure. Already on Stripe? MPP is two days. Already on Cloudflare? TAP edge integration is a sprint. Already on Shopify or Etsy? ACP is automatic.

**Week 2 — Ship x402.**

For the first paid endpoint, x402 is almost universally the fastest path. Two-hour integration. Coinbase CDP facilitator with 1,000 free tx/month.

```typescript
// Express middleware example using @x402/express
import express from 'express';
import { x402, requirePayment } from '@x402/express';

const app = express();

app.use(x402({
  facilitator: 'https://facilitator.coinbase.com',
  recipient: process.env.RECIPIENT_ADDRESS,
  network: 'eip155:8453', // Base mainnet
}));

app.get('/api/expensive-research',
  requirePayment({ amount: '0.10', asset: 'USDC' }),
  async (req, res) => {
    const data = await runExpensiveResearch(req.query.q);
    res.json(data);
  }
);
```

Test against Base Sepolia with the free `https://x402.org/facilitator` first; promote to mainnet once verified.

**Week 3 — Wire MPP via Stripe (if you already have a Stripe account).**

If you're a Stripe merchant, MPP is a few lines on top of PaymentIntents. Browserbase's pattern is to expose the same endpoint via both x402 and MPP, letting agents choose their preferred rail[^37][^38]:

```
POST https://x402.browserbase.com/browser/session/create
  → Pay with USDC on Base via x402

POST https://x402.browserbase.com/browser/session/create
  → Pay with pathUSD on Tempo via MPP (npx mppx)
```

The dual-rail approach captures both crypto-native and Stripe-customer agents from day one.

**Week 4 — Crawler / agent identity at the edge.**

If you serve consumer-facing pages and accept agent traffic for purchase intent, ship TAP verification at your CDN. Cloudflare and Akamai both support TAP at the edge as of late 2025; Vercel BotID provides a Visa-directory-aware bot management layer that distinguishes verified agents from anonymous bots[^17][^32].

## 5.2 Days 31–60: Authorization, commerce, regulatory work

**Weeks 5–6 — AP2 mandate verification.**

If your customers are enterprises with procurement requirements, AP2 is the payment-stack layer that satisfies "prove the agent was authorized to spend." Implementation:

1. Implement Checkout Mandate verification on the merchant side. The mandate is an SD-JWT+kb credential; verification is an ECDSA P-256 signature check + hash binding to the merchant's signed Checkout JWT.
2. Implement Payment Mandate verification on the payment-processor side. The Payment Mandate is bound to the Checkout via cryptographic hash of the `checkout_jwt`.
3. Issue Mandate Receipts (Verifier-signed JWTs) for non-repudiation audit trails.
4. Use ECDSA P-256 (ES256) — *not* HS256 symmetric signing, *not* deterministic Ed25519 (the AP2 spec explicitly forbids this for Checkout JWTs to prevent rainbow-table attacks)[^7][^34][^50].

**Weeks 7–8 — Commerce orchestration (ACP or UCP).**

Skip if you're already on Shopify or Etsy (ACP is automatic). For everything else:

- Implement the four ACP endpoints (Create / Update / Complete / Cancel checkout sessions). Spec at agenticcommerce.dev[^4][^46].
- Wire delegated payment via Stripe SharedPaymentToken. Tokens are single-use, time-bound, amount-locked.
- Implement the `continue_url` pattern for `requires_escalation` flows (where an agent hands off to a human-trusted UI for review)[^48].
- Apply for ACP production certification.

For UCP-aligned teams (especially if AP2 is in your stack), implement `dev.ucp.shopping.checkout` + `dev.ucp.shopping.ap2_mandate` capabilities and publish your `/.well-known/ucp` profile[^55][^56].

## 5.3 Days 61–90: Compliance, observability, optimization

**Weeks 9–10 — Compliance posture.**

- If touching EU users: model the MiCA + PSD2 dual-license path. Either secure your own PI/EMI license (12+ months) or partner with a licensed entity (3–6 months)[^54][^74].
- If high-volume B2B: implement Travel Rule data collection and IVMS 101 data fields for VASP-to-VASP transfers > €1,000[^76][^77].
- If serving regulated industries (healthcare, financial services): adopt KYA primitives — agent DIDs, principal verification credentials, delegated spending limits — and align on the GENIUS Act timeline (effective January 2027)[^79][^82].

**Week 11 — Observability and dispute infrastructure.**

- Tag every agent payment with: `agent_did`, `mandate_id` (if AP2), `payment_intent_id` (if Stripe), `tx_hash` (if x402), `idempotency_key` (if MPP).
- Pipe the trace into your existing observability stack. Per the MCP Server Playbook, this is part of the broader agent-observability discipline.
- Implement a credit-buffer pattern between settlement and per-call consumption to enable per-call refunds without blockchain dispute resolution (AgentPMT pattern)[^44].

**Week 12 — Iteration and rail expansion.**

- Add Circle Nanopayments if your transaction sizes fall below ~$0.05 (where individual on-chain settlement becomes uneconomic).
- Add Lightning via Lightspark / MPP if Bitcoin-native agents are a meaningful customer segment.
- Add card-network rails (Visa Intelligent Commerce Connect, Mastercard Verifiable Intent, Amex Developers Kit) if your volume crosses the threshold where issuer-network relationships matter.
- Re-baseline: which rails are actually generating revenue? What's the average ticket size? What's the dispute rate? Iterate the rail mix.

## 5.4 What success looks like at day 90

A SaaS that executes the playbook above hits four numbers by day 90:

1. **At least one agent-payable endpoint live in production.** Most likely x402 + MPP dual-rail.
2. **Identity verification at the edge.** TAP, Web Bot Auth, or BotID verifying agent traffic before it reaches the application.
3. **Compliance posture defined.** Either jurisdiction-specific licensing path or PI/EMI partnership identified; KYA primitives mapped to applicable regulations.
4. **First production payments captured.** Even at small dollar volume, the existence of agent-attributed revenue in your CRM is the validation that the stack works.

The teams that compromise — defer identity, skip authorization, ship settlement only — discover six months later that enterprise customers can't buy from them because the procurement audit fails. The teams that build the full stack now have a defensible position when the demand curve catches up.

---

# Part VI — Where This Goes (2027–2028)

## 6.1 Convergence at the standards layer

The protocol stack is consolidating. By April 2026, the same companies appear in multiple layers — Stripe in ACP/MPP/x402 Foundation, Mastercard in AP2/Verifiable Intent/x402 Foundation, Visa in TAP/AP2/x402 collaboration, Google in AP2/UCP/x402 Foundation. The open question is whether the consolidation produces formal interoperability (cross-protocol settlement, shared identity primitives) or remains a partner-list overlap.

The likely 2027 outcome: Linux Foundation governance of x402, IETF standardization of HTTP 402-based settlement, OpenID Foundation alignment on agent identity primitives, EMVCo integration of agent tokens with existing card-network infrastructure[^8][^17][^33]. Visa has already committed to aligning with IETF, OpenID Foundation, and EMVCo[^9].

## 6.2 The settlement-rail consolidation

Five settlement rails operate in production by mid-2026: x402-on-Base, x402-on-Solana, MPP-on-Tempo, Stripe SPT (cards), and Lightning. By 2027 we expect:

- **Tempo overtaking Base for enterprise stablecoin settlement** because of ISO 20022 compliance and Stripe's distribution[^61].
- **Solana retaining a share of high-frequency micropayments** because of latency advantages despite weaker enterprise-compliance posture[^61].
- **Card networks routing agent transactions through whichever rail the merchant accepts**, with Verifiable Intent / Agent Pay / TAP providing the trust layer regardless of settlement[^17].
- **Circle Nanopayments becoming the default sub-cent rail** as more high-frequency use cases (pay-per-crawl, model inference, robot energy markets) graduate from prototype to production[^26][^28].

## 6.3 The "B2A-first" pricing model

The B2A Imperative paper argued that subscription pricing dies fastest in agent-mediated commerce. Twelve months of x402 / MPP / ACP production data confirm the direction:

- **Pay-per-call is the default for API and data products.** $0.01-$0.30 per call is the typical micro-pricing band; outcome bundles ($0.15 for "property verification" rather than three separate $0.05 calls) are emerging[^44].
- **Session-based pricing is the default for browser/automation/long-running tasks.** Browserbase's $0.12/hour browser session is the canonical reference; Parallel Web Systems' $0.30/research-task is the heavier-cost variant[^21][^37][^38].
- **Subscription survives only where session continuity matters more than per-call cost** (memory, ongoing relationship, account state). And even there, hybrid models (subscription + overage) dominate.
- **Outcome-based pricing reaches ~30% of enterprise SaaS by 2026 per Gartner**[^44].

The implication for SaaS founders is that the agent payment stack is the *enabler* of post-subscription pricing — and the pricing change is what determines who captures the agent economy's revenue. Brands that ship the stack and the pricing simultaneously will own categories; brands that only ship the stack will be outpriced by category natives.

## 6.4 Predictions for 2027

1. **x402 adoption crosses 1B cumulative transactions** by Q3 2027.
2. **At least one major card network integrates x402 directly** as an accepted settlement option, not just via Stripe SPT.
3. **EU MiCA + PSD2 enforcement triggers a wave of stablecoin partnerships** — every CASP either secures a PI license or pairs with one. Several EU stablecoins delisted; USDC and EURC dominate.
4. **AP2 becomes the de-facto authorization layer** at procurement-grade enterprise. Cryptographic mandates become a checkbox in B2B SaaS RFPs.
5. **TAP-style agent identity moves down to the application layer**, not just the CDN edge. Frameworks like Vercel AI SDK and Anthropic's Agent SDK ship with built-in TAP-compatible signing.
6. **The first agent-only marketplace** — services priced and delivered exclusively to other agents — crosses $100M annual revenue.
7. **Klarna-style first-stablecoin-on-Tempo events** repeat across every major fintech with international payment flows. By end of 2027, dozens of bank-issued stablecoins settle on Tempo.

The brands operating as if this convergence is already happening will compound through the transition. The brands waiting for the consolidation to be obvious will be paying retail for category positions that should have been wholesale.

---

# Closing

The B2A Imperative paper said 2026 is the year SaaS founders ship a Foundation Build for the agent economy. The MCP Server Playbook said the protocol layer is the most underweighted piece of that Foundation Build. The GEO/AEO 2026 paper said the discovery layer is what decides whether agents can find you.

This paper closes the third leg: the commerce layer is what decides whether agents can buy from you. And the commerce layer is not one protocol — it's a stack of four. Identity, authorization, commerce, settlement. The teams that ship all four layers in 2026 build a defensible position in the agent economy that compounds for the rest of the decade. The teams that ship one layer and wait for the others to be obvious will be paying retail in 2027 to enter a market that's already routed around them.

x402, ACP, AP2, MPP, TAP. The stack is composable. The integrations are open. The reference implementations are on GitHub. The economic infrastructure is live. The window in which shipping the full stack is asymmetric — when fewer than 5% of merchants accept any agent-initiated transactions — is the window worth racing through.

Ship the stack. Compose the layers. Compound the position.

— *perea.ai Research, May 2026*

---

# References

[^1]: Ethereal Labs (Apr 2026), *x402 Explained: HTTP 402 Payment Protocol for Crypto*, citing 119M Base + 35M Solana cumulative transaction count. https://www.ethereallabs.io/blog/x402-http-payment-protocol-explained
[^2]: Linux Foundation (Apr 2, 2026), *x402 Foundation announcement*, founding membership of Stripe, Visa, Mastercard, American Express, Google, AWS, Microsoft, Cloudflare, Shopify, Circle, Polygon Labs, Coinbase. Summarized in Major Matters *Agentic Commerce Protocol Map Q1 2026*. https://www.majormatters.co/p/agentic-commerce-protocol-map-q1-definitive
[^3]: Custena (Apr 20, 2026), *agent-payment-protocols*, x402 Foundation roster and protocol comparison. https://github.com/custena/agent-payment-protocols
[^4]: Stripe Documentation, *Agentic Commerce Protocol*. https://docs.stripe.com/agentic-commerce/acp
[^5]: agenticcommerce.dev, *Agentic Commerce Protocol*, OpenAPI spec 2026-04-17. https://agenticcommerce.dev/
[^6]: Google Agentic Commerce, *AP2 partners.md*, 100+ partner roster. https://github.com/google-agentic-commerce/AP2/blob/main/docs/partners.md
[^7]: ap2-protocol.org, *AP2 Specification*. https://ap2-protocol.org/ap2/specification/
[^8]: Visa (Oct 14, 2025), *Visa Unveils Trusted Agent Protocol for AI Commerce*. https://corporate.visa.com/en/sites/visa-perspectives/newsroom/visa-unveils-trusted-agent-protocol-for-ai-commerce.html
[^9]: Help Net Security (Oct 14, 2025), *Visa's Trusted Agent Protocol sets new standard for secure agentic transactions*. https://www.helpnetsecurity.com/2025/10/14/visa-trusted-agent-protocol/
[^10]: Visa Developer, *Trusted Agent Protocol*. https://developer.visa.com/use-cases/trusted-agent-protocol
[^11]: Stripe (Mar 18, 2026), *Introducing the Machine Payments Protocol*. https://stripe.com/blog/machine-payments-protocol
[^12]: BlockEden (Apr 2, 2026), *Tempo: How Stripe's Payment-First L1 Blockchain Is Replacing SWIFT*. https://blockeden.xyz/blog/2026/04/02/tempo-payment-first-l1-stripe-institutional-blockchain-settlement/
[^13]: Yahoo Finance (Mar 18, 2026), *Stripe Deploys Tempo L1 Blockchain to Mainnet*. https://finance.yahoo.com/news/stripe-deploys-tempo-blockchain-mainnet-174049394.html
[^14]: Reuters (Sep 29, 2025), *OpenAI partners with Etsy, Shopify on ChatGPT payment checkout*. https://www.reuters.com/world/americas/openai-partners-with-etsy-shopify-chatgpt-checkout-2025-09-29/
[^15]: Retail TouchPoints, *What ChatGPT's Instant Checkout Offering Means for Retailers*, Salesforce/PayPal/Walmart expansion timeline. https://www.retailtouchpoints.com/features/industry-insights/what-chatgpts-instant-checkout-offering-means-for-retailers
[^16]: CNBC (Sep 29, 2025), *Etsy pops 16% as OpenAI announces ChatGPT Instant Checkout*. https://www.cnbc.com/2025/09/29/chatgpt-instant-checkout-etsy-shopify.html
[^17]: Major Matters (Apr 4, 2026), *Agentic Commerce Protocol Map Q1 2026*. https://www.majormatters.co/p/agentic-commerce-protocol-map-q1-definitive
[^18]: Coinbase Developer Platform, *x402 Documentation*. https://docs.cdp.coinbase.com/x402/
[^19]: Coinbase, *x402 Specification v2*. https://github.com/coinbase/x402/blob/main/specs/x402-specification-v2.md
[^20]: Bitcoin Ethereum News (Mar 18, 2026), *Stripe and Paradigm's Tempo mainnet goes live for machine payments*. https://bitcoinethereumnews.com/tech/stripe-and-paradigms-tempo-mainnet-goes-live-for-machine-payments/
[^21]: Parallel, *Agentic Payments (MPP & x402)*. https://docs.parallel.ai/integrations/agentic-payments
[^22]: Visa (Dec 18, 2025), *Visa and Partners Complete Secure AI Transactions, Setting the Stage for Mainstream Adoption in 2026*, Akamai integration. https://investor.visa.com/news/news-details/2025/Visa-and-Partners-Complete-Secure-AI-Transactions-Setting-the-Stage-for-Mainstream-Adoption-in-2026/default.aspx
[^23]: Instant Checkout Integrators (Sep 30, 2025), *ChatGPT vs Traditional E-Commerce: What the Data Shows*. https://instantcheckoutintegrators.com/blog/chatgpt-vs-traditional-ecommerce
[^24]: Pew Research Center (Jul 2025), *Google users are less likely to click on links when an AI summary appears in the results*. https://www.pewresearch.org/short-reads/2025/07/22/google-users-are-less-likely-to-click-on-links-when-an-ai-summary-appears-in-the-results/
[^25]: OpenAI (Sep 15, 2025), *How People Use ChatGPT*, 700M weekly active users + 18B messages weekly statistics.
[^26]: Circle (Mar 10, 2026), *Powering the Agentic Economy with Circle Nanopayments*. http://circle.com/blog/circle-nanopayments-launches-on-testnet-as-the-core-primitive-for-agentic-economic-activity
[^27]: Circle Docs, *Nanopayments*. https://developers.circle.com/gateway/nanopayments
[^28]: Kaupr.io (May 6, 2026), *Circle makes micropayments possible for AI agents*. https://www.kaupr.io/en/news/circle-makes-micropayments-possible-for-ai-agents
[^29]: BlockEden (Mar 10, 2026), *Circle's USDC Nanopayments: The Gas-Free Rails Powering the AI Agent Economy* — citing Bloomberg March 7 2026 exposé on volume gap. https://blockeden.xyz/blog/2026/03/10/circle-usdc-nanopayments-ai-agent-micropayment-infrastructure/
[^30]: Acadia (Oct 15, 2025), *ChatGPT Shopping & Instant Checkout Guide for Brands*. https://acadia.io/chatgpt-shopping-instant-checkout-guide
[^31]: HyperTrends (Apr 2026), *Agentic Payments: The Complete Protocol Comparison*. https://www.hypertrends.com/2026/04/agentic-payments-x402-acp-ap2-tap-comparison/
[^32]: Major Matters (Mar 21, 2026), *Visa Trusted Agent Protocol Review 2026*. https://www.majormatters.co/p/visa-trusted-agent-protocol-agentic-commerce-review
[^33]: ucp.dev, *Universal Commerce Protocol*. https://www.ucp.dev/
[^34]: ap2-protocol.org, *AP2 Checkout Mandate*. https://ap2-protocol.org/ap2/checkout_mandate/
[^35]: Modern Retail (Oct 6, 2025), *How Etsy sellers feel about the new ChatGPT checkout integration*. https://www.modernretail.co/technology/how-etsy-sellers-feel-about-the-new-chatgpt-checkout-integration/
[^36]: Openfort (Mar 27, 2026), *The Agentic Payments Landscape: MPP, x402, and ACP/AP2*. https://www.openfort.io/blog/agentic-payments-landscape
[^37]: mpp.browserbase.com, *Browserbase Payment Gateway (x402 + MPP)*. https://mpp.browserbase.com/
[^38]: Browserbase Docs, *x402 protocol integration*. https://docs.browserbase.com/integrations/x402/introduction
[^39]: Coinbase (May 6, 2025), *Introducing x402: a new standard for internet-native payments*. https://www.coinbase.com/developer-platform/discover/launches/x402
[^40]: x402.org, *Whitepaper* (Aug 16, 2025), Erik Reppel, Ronnie Caspers, Kevin Leffew, Danny Organ. https://www.x402.org/x402-whitepaper.pdf
[^41]: Coinbase Developer Documentation, *x402 FAQ*. https://docs.cdp.coinbase.com/x402/support/faq
[^42]: Coinbase Developer Documentation, *How x402 Works*. https://docs.cdp.coinbase.com/x402/core-concepts/how-it-works
[^43]: Coinbase, *x402 HTTP transport spec*. https://github.com/coinbase/x402/blob/main/specs/transports-v2/http.md
[^44]: AgentPMT (Feb 2026), *Micropayment Pricing for Agent Tools*. https://www.agentpmt.com/articles/pricing-for-micropayments-why-the-unit-you-choose-matters-more-than-the-number
[^45]: Coinbase Developer Documentation, *x402 Payment Protocol — useX402 hook*. https://docs.cdp.coinbase.com/embedded-wallets/x402-payments
[^46]: Retail Dive (Sep 30, 2025), *ChatGPT lets shoppers buy products within the platform*. https://www.retaildive.com/news/openai-chatgpt-instant-checkout-agentic-commerce-etsy-shopify/761442/
[^47]: Digital Commerce 360 (Sep 30, 2025), *ChatGPT debuts checkout experience for Etsy, Shopify merchants*. https://www.digitalcommerce360.com/2025/09/30/chatgpt-debuts-checkout-experience-etsy-shopify-merchants/
[^48]: ucp.dev, *UCP Checkout Specification*. http://ucp.dev/2026-04-08/specification/checkout/
[^49]: Adam Silva Consulting, *AP2 — Agent Payments Protocol: Cryptographic Trust for Agentic Transactions*. https://www.adamsilvaconsulting.com/protocols/ap2
[^50]: Sonnet & Prose (Feb 13, 2026), *Solving AI Agent Payment Authentication: A Technical Guide to AP2 Mandates*. https://sonnetandprose.com/blog/solving-ai-agent-payment-authentication-a-technical-guide-to-ap2-mandates/
[^51]: ap2-protocol.org, *Agent Authorization Framework*. https://ap2-protocol.org/ap2/agent_authorization/
[^52]: Descope (Apr 2026), *The Developer's Guide to Agentic Commerce*. https://www.descope.com/blog/post/developer-guide-agentic-commerce
[^53]: ap2-protocol.org, *Implementation Considerations*. https://ap2-protocol.org/ap2/implementation_considerations/
[^54]: PnyxHill (Feb 2026), *MiCA Stablecoin Platforms: PSD2 Compliance Checklist*. https://www.pnyxhill.co/post/a-psd2-compliance-to-do-list-for-mica-stablecoin-platform
[^55]: ucp.dev, *AP2 Mandates Extension*. https://ucp.dev/specification/ap2-mandates/
[^56]: ucp.md, *UCP and AP2 Integration*. https://ucp.md/en/docs/ap2-integration/
[^57]: ParseBird (Apr 12, 2026), *How Agents Pay for Things with Machine Payments Protocol*. https://parsebird.com/essay/how-agents-pay-for-things-with-mpp
[^58]: FluxA (Apr 21, 2026), *x402, ACP, AP2 & MPP: The Agent Payment Stack*. https://fluxapay.xyz/learning/x402-acp-ap-2-and-mpp-the-agent-payment-stack
[^59]: CoinDesk (Sep 4, 2025), *Stripe, Paradigm Unveil Tempo as Blockchain Race for High-Speed Stablecoin Payments Heats Up*. http://www.coindesk.com/id/business/2025/09/04/stripe-paradigm-unveil-tempo-as-blockchain-race-for-high-speed-stablecoin-payments-heats-up
[^60]: CoinCentral (Sep 4, 2025), *Stripe and Paradigm Launch Tempo Blockchain for Stablecoin Payments*. https://coincentral.com/stripe-and-paradigm-launch-tempo-blockchain-for-stablecoin-payments/
[^61]: BlockEden (Apr 2, 2026), *Tempo institutional blockchain settlement analysis*.
[^62]: ETHNews (Sep 5, 2025), *The End of High Fees? Tempo's 100+ TPS Blockchain Is Here*. https://www.ethnews.com/the-end-of-high-fees-tempos-100-tps-blockchain-is-here/
[^63]: Quicknode (Mar 18, 2026), *Quicknode Now Supports Tempo Mainnet*. https://blog.quicknode.com/quicknode-launches-support-for-tempo-mainnet/
[^64]: HTX Insights, *Stripe's stablecoin blockchain Tempo launches public testnet*. https://www.htx.com/news/stripes-stablecoin-blockchain-tempo-launches-public-testnet-DGe7go2f
[^65]: Turnkey (Jan 29, 2026), *Stripe's Tempo blockchain transaction types*. https://www.turnkey.com/blog/stripes-tempo-blockchain-transaction-types
[^66]: parallelmpp.dev, *Parallel × Machine Payments*. https://parallelmpp.dev/
[^67]: Visa Developer, *Trusted Agent Protocol Specifications*. https://developer.visa.com/capabilities/trusted-agent-protocol/trusted-agent-protocol-specifications
[^68]: Visa Developer, *Trusted Agent Protocol Getting Started*. https://developer.visa.com/capabilities/trusted-agent-protocol/docs
[^69]: Visa, *trusted-agent-protocol README*. https://github.com/visa/trusted-agent-protocol/blob/main/README.md
[^70]: Visa, *trusted-agent-protocol cdn-proxy*. https://github.com/visa/trusted-agent-protocol/blob/main/cdn-proxy/README.md
[^71]: Stellagent (Feb 26, 2026), *Circle Positions USDC as the Payment Foundation for Agentic Commerce — Q4 Revenue Up 77%*. https://stellagent.ai/insights/circle-stablecoin-agentic-commerce
[^72]: Circle (Oct 10, 2025), *Enabling Machine-to-Machine Micropayments with Gateway and USDC*. https://www.circle.com/blog/enabling-machine-to-machine-micropayments-with-gateway-and-usdc
[^73]: Stablecoin Laws (Mar 20, 2026), *EU Stablecoin Payments Licensing: PSD2 and MiCA Requirements Post-March 2026 Deadline*. https://stablecoinlaws.org/2026/03/20/eu-stablecoin-payments-licensing-psd2-and-mica-requirements-post-march-2026-deadline/
[^74]: Agentic Payments UK, *PSD2, MiCA, and the Agent Economy: Simultaneous Compliance at Scale*. https://agenticpayments.co.uk/psd2-mica-compliance
[^75]: Plasma (Feb 13, 2026), *The EU's MiCA Regulation Explained*. https://www.plasma.to/learn/mica-regulation
[^76]: Crypto Trace Labs (Jan 27, 2026), *Crypto Compliance Roadmap 2026: Navigating MiCA, Travel Rule, AMLA & Stablecoin Rules*. https://cryptotracelabs.com/blog/crypto-compliance-roadmap-2026-navigating-mica-travel-rule-amla-stablecoin-rules/
[^77]: BlockchainAnalysis.io, *MiCA Compliance Guide*. https://blockchainanalysis.io/insights/mica-compliance-guide
[^78]: Stablecoin Laws (Feb 19, 2026), *2026 MiCA Stablecoin Authorization Deadline*. https://stablecoinlaws.org/2026/02/19/2026-mica-stablecoin-authorization-deadline-licensing-risks-for-eu-issuers-and-compliance-map/
[^79]: Stablecoin Insider (Dec 16, 2025), *Complete Guide to Stablecoin Compliance in 2026*. https://stablecoininsider.org/stablecoin-compliance-2026/
[^80]: zkMe Protocol Docs, *zkKYA - Know Your Agent*. https://docs.zk.me/hub/what/zkkya
[^81]: Agent Commerce Kit, *ACK-ID Use Case Verification*. https://www.agentcommercekit.com/ack-id/use-case-verification
[^82]: StableKYA, *The Compliance Layer for Agentic Commerce*. https://stablekya.com/
[^83]: AGIRAILS Documentation, *Agent Identity*. https://docs.agirails.io/concepts/agent-identity
[^84]: AsterPay (Mar 15, 2026), *AI Agent Payments in Europe: MiCA, SEPA Instant, and the Agentic Commerce Stack*. https://asterpay.io/blog/ai-agent-payments-europe
[^85]: AMLBot, *MiCA Rules for Stablecoins: ART & EMT Compliance Explained*. https://blog.amlbot.com/understanding-eu-mica-regulation-stablecoins-compliance-challenges-and-circle-case-study/
[^86]: Mastercard (Sep 2025), *Mastercard unveils new tools and collaborations to power smarter safer agentic commerce*. https://www.mastercard.com/global/en/news-and-trends/press/2025/september/mastercard-unveils-new-tools-and-collaborations-to-power-smarter,-safer-agentic-commerce.html
[^87]: Mastercard (Oct 2025), *Mastercard and PayPal join forces to accelerate secure global agentic commerce*. https://www.mastercard.com/global/en/news-and-trends/press/2025/october/Mastercard-and-PayPal-join-forces.html
[^88]: Mastercard (Apr 2025), *Mastercard unveils Agent Pay*. https://www.mastercard.com/us/en/news-and-trends/press/2025/april/mastercard-unveils-agent-pay-pioneering-agentic-payments-technology-to-power-commerce-in-the-age-of-ai.html
[^89]: Paz (Apr 15, 2026), *All Three US Card Networks Now Support Agentic Commerce*. https://www.paz.ai/blog/card-networks-agentic-commerce
[^90]: Awesome Agents (Feb 21, 2026), *Visa, Mastercard, Stripe, and Google Are Racing to Give AI Agents Your Credit Card*. https://awesomeagents.ai/news/payment-giants-agentic-commerce-race/
[^91]: Payments Dive (Mar 5, 2026), *Visa, Mastercard jockey to set agentic standards*. https://www.paymentsdive.com/news/visa-mastercard-jockey-to-set-agentic-standards/813910/
[^92]: Major Matters (Mar 27, 2026), *Adyen Agentic Commerce Review 2026*. https://www.majormatters.co/p/adyen-agentic-commerce-review
[^93]: AgentBets (Mar 3, 2026), *Agentic Payments Protocols 2026: x402, AP2, Stripe, and the New Machine Economy*. https://agentbets.ai/guides/agentic-payments-protocols/
[^94]: agentsdb.com (Oct 14, 2025), *Visa's TAP launches: the trust layer for AI shopping*. https://agentsdb.com/visas-tap-launches-the-trust-layer-for-ai-shopping
[^95]: agentsdb.com (Nov 6, 2025), *Visa's Trusted Agent Protocol Lights Up AI Checkout*. https://agentsdb.com/visas-trusted-agent-protocol-lights-up-ai-checkout
[^96]: ucphub.ai (Jan 29, 2026), *Agentic Commerce Protocol: Official 2026 UCP Technical Guide*. https://ucphub.ai/agentic-commerce-protocol-the-official-2026-ucp-specification-deep-dive/
[^97]: NVIDIA AI Blueprints, *UCP Spec*. https://github.com/NVIDIA-AI-Blueprints/Retail-Agentic-Commerce/blob/main/docs/specs/ucp-spec.md
[^98]: ucp.dev, *UCP A2A Binding*. http://ucp.dev/2026-04-08/specification/checkout-a2a/
[^99]: Verifiable Intent, *credential-format spec*. https://github.com/agent-intent/verifiable-intent/blob/main/spec/credential-format.md
[^100]: Coinbase, *agent-trust extension proposal*, x402 Issue #1777. https://github.com/coinbase/x402/issues/1777
[^101]: Agent Commerce Kit, *Identity Standards (DIDs and VCs)*. https://www.agentcommercekit.com/ack-id/standards
[^102]: Agent Commerce Kit, *ACK Receipt Verification & Presentation*. https://www.agentcommercekit.com/ack-pay/receipt-verification
[^103]: Agnic AI, *Agnic Manifesto*. https://agnic.ai/manifesto
[^104]: AP2 Protocol Documentation, *Payment Mandate*. https://ap2-protocol.org/ap2/payment_mandate/
[^105]: AgentPaymentsProtocol Info, *Core Concepts*. https://agentpaymentsprotocol.info/docs/concepts/
[^106]: AgentPaymentsProtocol Info, *Core Protocol Specification*. https://agentpaymentsprotocol.info/specification/core/
[^107]: Browserbase (Dec 2025), *Browserbase enables agentic payments with Coinbase and x402*. https://www.browserbase.com/blog/browserbase-and-coinbase-x402
[^108]: Stripe Customers, *Browserbase usage-based billing case study*. https://site-admin.stripe.com/customers/browserbase
[^109]: Crypshots, *Tempo: Payments-Focused Stablecoin Blockchain Explained*. https://crypshots.com/blog/tempo-payments-focused-stablecoin-blockchain-explained
[^110]: Coinbase, *x402 GitHub repository*. https://github.com/coinbase/x402/

---

*This paper is published by perea.ai Research under CC BY 4.0. Cite as: Perea, D. (2026). "The Agent Payment Stack 2026." perea.ai Research. https://perea.ai/research/agent-payment-stack-2026.*

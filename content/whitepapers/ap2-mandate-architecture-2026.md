---
title: "AP2 Mandate Architecture: How the Agent Payments Protocol Extends A2A for Production Commerce"
subtitle: "Mandate model, payments-specific Agent Card fields, the 100+ org coalition, and what the spec leaves to implementers"
publication: "perea.ai Research"
authors: ["Dante Perea"]
version: "1.0"
status: "Public draft"
date: "2026-05"
audience: "Engineering leaders, payments architects, and product teams shipping agent commerce on A2A + AP2"
length: "~7,500 words"
profile: "technical-playbook"
license: "CC BY 4.0"
description: "How AP2 (Agent Payments Protocol) extends Google's A2A for production commerce: the IntentMandate / CartMandate / PaymentMandate trio, the SD-JWT-VC layered credential format, the A2A AgentCard extension shape, the 100+ org coalition, the NRF 2026 UCP integration, and the parts of the spec implementers still own."
---

## Foreword

NRF 2026 was the inflection point. On January 11, 2026 Google announced the Universal Commerce Protocol (UCP) on the National Retail Federation main stage, with Etsy, Shopify, Target, Wayfair, and Walmart as co-development partners and 20+ endorsing partners spanning Adyen, American Express, Macy's, Mastercard, Stripe, The Home Depot, Visa, and Zalando.[^52] McKinsey projects the agentic-commerce market will reach between $3 trillion[^52] and $5 trillion[^52] by 2030; IAB research from the same period found only 46% of shoppers[^52] fully trust AI recommendations.[^52] The gap between projection and trust is the gap that protocol design has to close.

AP2 (Agent Payments Protocol) is the payment-authorization layer beneath UCP. Google announced AP2 on September 16, 2025 with 60+ launch partners; by October 27, 2025 the coalition had grown to 100+ partners with the Mastercard × PayPal joint Agent Pay × wallet integration announcement.[^8][^46][^47] On November 19, 2025 Mastercard Agent Pay processed its first transaction outside the U.S. — a UAE pilot with the Majid Al Futtaim group.[^50] On November 25, 2025 PayPal × Perplexity launched Instant Buy in the U.S.[^50] On March 2, 2026 Mastercard, Santander, and PayOS executed Europe's first live end-to-end payment by an AI agent on Santander's production payment infrastructure.[^50] The agentic commerce market has moved from experimentation to commercial infrastructure.[^49]

The thesis of this paper is that AP2's mandate trio — IntentMandate, CartMandate, PaymentMandate — is the smallest interoperable unit of agent purchase authority. It composes upward into UCP (commerce flow) and ACP (checkout) and downward into x402 / MPP (settlement) and Visa TAP (identity wrapper). It is layered on Google's Agent2Agent (A2A) protocol as a formal extension and integrates with the FIDO Alliance's new Agentic Authentication and Payments Technical Working Groups for long-term standardization.[^7][^24] No other public source synthesizes the mandate semantics, the A2A extension shape, the 100+ org coalition status, the NRF 2026 production rollouts, and the implementer-owned gaps into one playbook. This paper is the production architect's manual.

## Part I — Why AP2 Exists

### §I.1 — The agent-commerce trust gap

The core problem AP2 solves is the trust asymmetry between AI agents acting on behalf of users and the merchants and payment networks receiving those actions. Forrester's April 2026 landscape recap names the asymmetry directly: merchant payment providers (Adyen, PayPal, Stripe, Worldpay) are now building "model context protocols to make their services accessible via AI agents" plus "capabilities around and certifications for the many protocols and frameworks out there" — but until late 2025, no single primitive existed for an agent to cryptographically prove it had been authorized to make a particular purchase on a particular user's behalf.[^50] A merchant could see an HTTP request that looked agent-shaped, but it could not distinguish a legitimate authorized agent from a scraper or an unauthorized automation pretending to be one.

The market consequence is concrete. IAB research published around NRF 2026 found that only 46% of shoppers fully trust AI recommendations.[^52] Conversion rates on agent-mediated checkout were the unstated reason OpenAI shut down ChatGPT Instant Checkout in early March 2026 — only ~12 merchants ever went live, and users tended to complete purchases on familiar retail sites where they had saved accounts.[^17] The protocol itself remained active, with Shopify, Salesforce, and PayPal continuing to build on it, but the user-experience signal was unmistakable: agent commerce only works when the trust mechanics are visible to all parties.

### §I.2 — Where AP2 sits in the protocol cluster

The cluster of protocols emerging in 2025–2026 splits cleanly across functional layers, and AP2 occupies the authorization layer specifically. The HyperTrends April 2026 comparison frames the four-protocol picture as: x402 = settlement (stablecoin); ACP = commerce flow (Stripe + OpenAI); AP2 = authorization (Google); TAP = identity wrapper (Visa + Cloudflare).[^16] FluxA's analyst piece adds MPP (Stripe + Tempo, launched March 18 2026) as a fifth protocol at the settlement layer, parallel to x402 with sessions-based batched stablecoin + fiat support.[^17] The goodmeta agent-payments-landscape repository, last updated March 31 2026, lays the same separation out as a tabular feature comparison: AP2 V0.1 (spec + samples), ACP Beta (4 releases), x402 V2 (production SDKs Go v2.9.0), MPP IETF draft-00, UCP v2026-04-08.[^18]

The composability rule follows directly. The Crossmint March 19 2026 industry guide states it explicitly: "they're complementary; an agent system can use AP2 for authorization and x402 for settlement."[^21] Eco's six-protocol comparison frames the same point through the production-stack lens: the "OpenAI ACP stack" composes MCP (tool discovery) + ACP (checkout) + Visa TAP (identity) + payment rail; the "Google UCP stack" composes MCP + UCP (merchant journey) + AP2 (payment authorization) + A2A (cross-vendor delegation) + payment rail. The latter is the stack the NRF 2026 launch partners are integrating.[^20] The Alchemy March 18 2026 analysis reaches the same architectural conclusion: MPP's charge intent is backwards-compatible with x402, meaning a server can advertise both and let clients choose.[^22] 402audit makes the trust-boundary distinction the load-bearing point: TradFi rails (MPP, Visa TAP, Ramp Agent Cards) handle agents inside corporate trust boundaries; crypto rails (x402, onchain identity, stablecoin settlement) handle agents transacting across boundaries where no shared authority exists.[^23]

### §I.3 — The 100+ org coalition

AP2's coalition expanded by 67%[^15] in six weeks.[^19] The September 16, 2025 launch named 60+ organizations: Adyen, American Express, Ant International, Coinbase, Etsy, Forter, Intuit, JCB, Mastercard, Mysten Labs, PayPal, Revolut, Salesforce, ServiceNow, UnionPay International, Worldpay, plus the Southeast Asia ecosystem cluster (Airwallex, Fiuu, Garena, Lazada, Manus, Razer, Shopee, ZALORA).[^8][^14] By the October 27, 2025 PayPal × Mastercard joint announcement, the Google Cloud + PayPal merchant-solution blog post described AP2 as having "more than 100 industry partners."[^46][^47] The coalition is unusually broad even by standards-track precedent — it spans the three major card networks (Mastercard, Visa, American Express, plus JCB and UnionPay International), the largest PSPs (Adyen, Worldpay, PayPal), the largest agent platforms (Google, Microsoft, OpenAI via Stripe, Anthropic via MCP), the major crypto-native players (Coinbase, Ethereum Foundation, MetaMask, Mysten Labs), and merchant networks reaching from Etsy to Walmart.[^11][^12][^13]

### §I.4 — Production deployments, status as of May 2026

The transition from announcement to production is documented across primary press from late 2025 and Q1 2026. The Mastercard × PayPal joint announcement (October 27, 2025) committed to integrating Mastercard Agent Pay into PayPal's wallet, naming Sherri Haymond (Mastercard co-president of Global Partnerships) and Michelle Gill (PayPal EVP of Small Business & Financial Services) as the joint executives directing the work.[^46] On the same day, Google Cloud and PayPal jointly announced the agentic commerce solution for merchants — pairing Google Cloud's Conversational Commerce Agent with the PayPal Agent over A2A and AP2.[^47]

NRF 2026 (Jan 11) consolidated this into UCP's launch with 20+ endorsing partners.[^52] On January 12, 2026 Mastercard and Visa partnered with FIS to bring Know Your Agent + tokenization capabilities to issuing banks.[^50] On January 20, 2026 Mastercard published its NRF wrap-up confirming Mastercard Agent Pay × Microsoft Copilot Checkout integration plus continued OpenAI / Cloudflare / PayPal collaboration.[^49] On March 2, 2026 Mastercard, Santander, and PayOS executed "Europe's first live end-to-end payment executed by an AI agent" on the bank's live payment infrastructure — Mastercard noted explicitly that the test "does not constitute a commercial rollout at this stage," but the production-payment-infrastructure execution path is now demonstrated.[^50]

> ### Quotable Findings I
> - **NRF 2026 (Jan 11, 2026)**: Google announced **Universal Commerce Protocol (UCP)** with **20+ endorsing partners** including Etsy, Shopify, Target, Wayfair, Walmart, Adyen, American Express, Macy's, Mastercard, Stripe, The Home Depot, Visa, and Zalando — establishing AP2 as the production payment-authorization layer beneath UCP.[^52]
>
> - On **March 2, 2026**, **Mastercard, Santander, and PayOS** executed **Europe's first live end-to-end AI-agent payment** on Santander's production infrastructure using Mastercard Agent Pay.[^50]
>
> - The AP2 coalition expanded from **60+ launch partners (Sept 16, 2025) to 100+ by October 27, 2025**, spanning all three major card networks, the largest PSPs, all major agent platforms, and crypto-native players.[^8][^47]
>
> - **McKinsey projects $3 trillion to $5 trillion**[^52] in agentic-commerce volume by 2030;[^52] **IAB research from NRF 2026** found only **46%[^52] of shoppers fully trust AI recommendations** — making the trust-mechanics design the rate-limiting factor.[^52]
>
> - The four-protocol layer cluster: **x402/MPP = settlement**, **ACP/UCP = commerce flow**, **AP2 = authorization**, **TAP = identity wrapper**. The protocols compose; they do not compete.[^16][^20]

## Part II — The Three Mandates

### §II.1 — IntentMandate (human-not-present / autonomous)

The IntentMandate is the most semantically distinctive of the three. It captures the constraints under which an AI agent is authorized to act in scenarios where the user is not actively present at the moment of purchase — the canonical example in the AP2 specification is a user instructing the agent to "buy these tickets when they go on sale."[^4][^5] The mandate is a Pydantic-defined data class in the canonical AP2 SDK at `src/ap2/types/mandate.py` with a documented schema for the human-present mode and explicit acknowledgment in the source comments that "additional fields will be added to this mandate" for human-not-present flows.[^3]

The fields the protocol commits to in v0.1 are: a verifiable identity for both the payer and the payee, a list or category of authorized payment methods, the shopping intent (with parameters such as product categories or other purchase criteria), the agent's natural-language understanding of the user's prompt, and an expiration time-to-live.[^5] Every IntentMandate carries the agent's natural-language understanding so that downstream verifiers can reconstruct *what the agent thought it was being asked to do* — and reject mismatches between that understanding and the executed action.[^5]

### §II.2 — CartMandate (human-present)

The CartMandate is what fires when the user is interactively confirming a specific cart. It is generated by the merchant and signed by the user — typically via the user's device through a Trusted Surface — binding the user's identity and authorization to a specific transaction.[^4][^5] The canonical Pydantic model for `CartMandate` in `src/ap2/types/mandate.py` carries a `contents: CartContents` field plus a `merchant_authorization: Optional[str]` field defined as "a base64url-encoded JSON Web Token (JWT) that digitally signs the cart contents, guaranteeing its authenticity and integrity."[^3]

The JWT structure is carefully bounded. The header includes the signing algorithm; the payload includes `iss` (merchant), `sub` (subject), `aud` (intended recipient — typically the payment processor), `iat` (issued-at), `exp` (expiration time, typically 5–15 minutes for security), `jti` (unique identifier), and `cart_hash` (a secure hash of the CartMandate contents ensuring integrity).[^3] The 5–15-minute TTL is the design choice that makes CartMandate useful as a real-time authorization primitive — short enough that stolen mandates have minimal residual value, long enough to handle the human-confirmation step without timing out under realistic network conditions.[^3]

### §II.3 — PaymentMandate

PaymentMandate is the third primitive and the one most often misunderstood. The canonical comments in the AP2 SDK frame it directly: "While the Cart and Intent mandates are required by the merchant to fulfill the order, separately the protocol provides additional visibility into the agentic transaction to the payments ecosystem. For this purpose, the PaymentMandate (bound to Cart/Intent mandate but containing separate information) may be shared with the network/issuer along with the standard transaction authorization messages. The goal of the PaymentMandate is to help the network/issuer build trust into the agentic transaction."[^3]

The fields are: `payment_mandate_id`, `payment_details_id`, `payment_details_total: PaymentItem` (total payment amount), `payment_response: PaymentResponse` (containing payment-method details chosen by the user), `merchant_agent` (identifier for the merchant), and `timestamp` (ISO 8601, default to current UTC).[^3] The `user_authorization` field holds a base64-url-encoded verifiable presentation of a verifiable credential — typically an SD-JWT-VC — signing over both the cart_mandate hash and the payment_mandate hash, with a key-binding JWT containing `aud`, `nonce`, `sd_hash` (hash of the issuer-signed JWT), and a `transaction_data` array containing the secure hashes of CartMandate and PaymentMandateContents.[^3] The cryptographic binding is what lets the network/issuer be sure the same agent that authorized the cart authorized the payment.

The AP2 protocol-documentation site adds an important production note: the Payment Mandate is bound to a particular Checkout using the cryptographic hash of the Checkout JWT, and crucially "to prevent rainbow table attacks, the Checkout JWT MUST be signed using a digital signature scheme (e.g., ECDSA) and not a deterministic signature (e.g., Ed25519)."[^4] This is a non-trivial implementer-facing constraint: AP2's payment-side JWT signing is locked to non-deterministic schemes specifically because deterministic signatures over predictable cart structures would expose the signing key to precomputed attacks.[^4]

### §II.4 — Verifiable Digital Credentials and the SD-JWT layered model

The trust anchor underneath all three mandates is the Verifiable Digital Credential (VDC) — a tamper-evident, portable, cryptographically signed digital object serving as the transactional building block.[^4][^5] The VDC layer maps to W3C's Verifiable Credentials Data Model 2.0, which defines the three-party ecosystem (issuer / holder / verifier) plus the cryptographic-proof structure for tamper-evidence.[^25] The wire format AP2 specifies is SD-JWT VC (Selective Disclosure JWT for Verifiable Credentials), a draft IETF standard that expresses VCs with JSON payloads using the SD-JWT format and supports selective disclosure of individual claims to different verifiers.[^27]

The fully-elaborated layered model is documented at `verifiableintent.dev` — Mastercard's Verifiable Intent specification, co-developed with Google to work with AP2.[^28][^29] The credential format defines three layers. **Layer 1** is the issuer-signed SD-JWT (`typ: sd+jwt`), signed by the issuer with a roughly one-year lifetime, binding user identity and the user's public key via a `cnf.jwk` claim per RFC 7800.[^28] **Layer 2** is the user-signed KB-SD-JWT, signed by the user (or a system holding the user's private key) using the key bound in L1's `cnf.jwk`. L2 has two execution modes: Immediate (user-confirmed, ~15-minute lifetime, containing finalized transaction values) and Autonomous (agent-delegated, 24 hours to 30 days, containing constraints plus the agent's key binding via `cnf.jwk` with the agent's public key and `cnf.kid` with a key identifier).[^28] **Layer 3** is the agent-signed KB-SD-JWT for autonomous mode only — split into L3a (payment mandate, sent to payment network) and L3b (checkout mandate, sent to merchant). Each L3 has a ~5-minute lifetime, contains no `cnf` claim (terminal delegation), and is signed by the agent's key with key possession proven via the `kid` JWT header parameter that verifiers resolve against L2's `cnf.kid` and `cnf.jwk`.[^28]

### §II.5 — vct, cnf, and key binding semantics

The `vct` claim is the AP2 schema-version identifier. Each AP2 mandate type identifies its schema using `vct` with a numeric suffix that acts as a version number — for example `mandate.payment.1` or `mandate.checkout.open.1`.[^4] Implementations MUST match the exact `vct` string including the version suffix; future incompatible schema revisions introduce a new suffix (e.g., `.2`), allowing old and new versions to be distinguished unambiguously.[^4] This is the standards-track lever for mandate evolution — implementers can pin to a specific `vct` and refuse to accept future versions until they are explicitly tested.

The `cnf` claim is the cryptographic key-binding mechanism, defined in RFC 7800 and incorporated into SD-JWT VC at draft-15.[^27] It contains the confirmation method identifying the proof-of-possession key — typically a JWK (JSON Web Key) directly embedded. For SD-JWT VCs requiring cryptographic key binding, the KB-JWT in the presentation MUST be secured by the key identified in the `cnf` claim.[^27] In the AP2 + Verifiable Intent layered model, `cnf` appears at L1 (binding user key) and L2 Autonomous (binding agent key), and is explicitly absent at L3 (terminal delegation) — the agent's key possession at L3 is proven via the `kid` JWT header parameter rather than an L3-level `cnf`.[^28]

> ### Quotable Findings II
> - The **AP2 mandate trio** — IntentMandate, CartMandate, PaymentMandate — provides three structurally distinct primitives: constraints (Intent), specific-cart authorization (Cart), and payment-network visibility (Payment).[^4][^5]
>
> - **CartMandate JWTs** are bound to **5–15-minute TTLs** for security; the `cart_hash` field commits to the cart contents so that any tampering invalidates the signature.[^3]
>
> - **PaymentMandate-binding Checkout JWTs MUST be signed with a non-deterministic scheme (e.g., ECDSA), not Ed25519** — to prevent rainbow-table attacks against predictable cart structures.[^4]
>
> - The **Mastercard Verifiable Intent** layered SD-JWT model (developed to work with AP2) defines **three layers**: L1 issuer ~1 year, L2 user-signed (Immediate ~15 min OR Autonomous 24h–30d), L3 agent-signed (~5 min, split L3a payment + L3b checkout).[^28]
>
> - **`cnf` claim binding rules**: present at L1 (user key) and L2 Autonomous (agent key); **absent at L3** (terminal delegation, key possession proven via JWT header `kid`).[^28]
>
> - **`vct` claim with numeric suffix** is the schema-version identifier — implementations MUST match exact strings; future incompatible revisions introduce a new suffix (`.2`) for unambiguous version distinction.[^4]

## Part III — A2A as the Transport

### §III.1 — The A2A protocol stack

A2A (Agent2Agent Protocol) is the underlying transport that AP2 extends. Maintained by the Linux Foundation, the canonical specification is at v0.3.0 with v1.0.0 of the main repository released March 12, 2026.[^30][^31][^35] A2A's design principles are explicit: simple (reuse HTTP, JSON-RPC 2.0, Server-Sent Events), enterprise-ready (authentication, authorization, security, privacy, tracing, monitoring aligned with established practices), async-first (built for long-running tasks and human-in-the-loop), agnostic (support diverse modalities), and opaque execution (agents interact based on declared capabilities without needing internal access).[^31]

The stack is layered in three tiers. Layer 1 is the data model: Task, Message, AgentCard, Part, Artifact, Extension. Layer 2 is operations: SendMessage, SendStreamingMessage, GetTask, ListTasks, CancelTask, GetAgentCard. Layer 3 is protocol bindings: JSON-RPC methods, gRPC RPCs, HTTP/REST endpoints, and custom bindings.[^31] The official Linux Foundation JS SDK (v0.3.13, March 16 2026) implements all three transports — JSON-RPC, HTTP+JSON/REST, and gRPC.[^34]

### §III.2 — AgentCard structure

The AgentCard is the JSON metadata document an A2A server publishes to describe its identity, capabilities, skills, service endpoint, and authentication requirements.[^30] The formal v0.3.0 TypeScript interface includes `protocolVersion` (default "0.3.0"), `name`, `description`, `url` (preferred endpoint), `preferredTransport` (default `"JSONRPC"`, alternatives `"GRPC"` and `"HTTP+JSON"`), `additionalInterfaces` (for multi-transport agents), `version`, `documentationUrl`, `capabilities`, `securitySchemes` (following OpenAPI 3.0 Security Scheme Object), `security` (OR-of-ANDs requirement list — e.g., "callers must use OAuth OR an API Key AND mTLS"), `defaultInputModes`, `defaultOutputModes`, `skills`, and `supportsAuthenticatedExtendedCard`.[^30]

The gRPC version of AgentCard, defined in `specification/grpc/a2a.proto` at v0.3.0, mirrors the TypeScript interface with proto-numbered fields (e.g., `protocol_version = 16`, `additional_interfaces = 15`).[^36] The gRPC variant adds `signatures: repeated AgentCardSignature` (proto 17) for JWS-signed AgentCards — a primitive that becomes useful when agent registries need to verify card authenticity at a higher trust level than HTTPS alone.[^36]

### §III.3 — The Extensions framework

Extensions are A2A's mechanism for layering new capabilities onto the base protocol — and AP2 is the canonical example.[^32] Extensions are URI-identified: `https://github.com/google-agentic-commerce/ap2/tree/v0.1` is AP2's. Agents declare support by including `AgentExtension` objects within `AgentCapabilities.extensions`. Each `AgentExtension` has `uri` (unique identifier), `description` (human-readable usage), `required: boolean` (if true, the client must understand and comply), and `params: object` (extension-specific configuration).[^32]

Activation is HTTP-header-based. Clients request extension activation by including the `A2A-Extensions` header with a comma-separated list of extension URIs. Agents process the request, ignore unsupported extensions, and respond with the same header listing successfully-activated extensions.[^32] When an agent declares an extension as `required: true` and the client does not declare support for it, the agent returns `ExtensionSupportRequiredError`.[^31] The governance recommendation is to use permanent identifier services such as `w3id.org` to prevent broken links, and the official A2A organization uses the `a2aproject` GitHub organization with the `ext-` repository prefix for official extensions and `experimental-ext-` for experimental ones.[^32]

### §III.4 — AP2 as an A2A Extension

The AP2 A2A extension specification at `docs/a2a-extension.md` defines the integration shape precisely.[^7] Every agent supporting the AP2 extension MUST perform at least one role from the AP2 specification, declared in the AgentCard. The `AP2ExtensionParameters` JSON schema requires a `roles` array containing one or more values from the enum `["merchant", "shopper", "credentials-provider", "payment-processor"]`.[^7] Agents performing the `"merchant"` role SHOULD set the AP2 extension to `required: true` — indicating that clients must use the AP2 extension to pay for services offered by the agent.[^7]

The data containers extend A2A's native Message and Artifact profiles. To provide an `IntentMandate`, the agent constructs an A2A Message with a `DataPart` whose key is `ap2.mandates.IntentMandate` and whose value adheres to the `IntentMandate` schema.[^7] To initiate a request for payment, a Merchant Agent produces a `CartMandate` Artifact — an A2A Artifact profile with a `DataPart` keyed `ap2.mandates.CartMandate` and a corresponding object adhering to the `CartMandate` schema. A Merchant Agent MUST NOT produce a CartMandate until all required payment-impacting information has been collected.[^7] To provide a `PaymentMandate` to an agent, the client constructs a `PaymentMandate` Message with a `DataPart` keyed `ap2.mandates.PaymentMandate` and a value adhering to the `PaymentMandate` schema.[^7] Both Message and Artifact profiles MAY include an additional DataPart with key `risk_data` whose value contains implementation-defined risk signals.[^7]

### §III.5 — Streaming, push notifications, and resubscription

A2A's async-first design surfaces in two transport patterns above the core request/response. Streaming with Server-Sent Events (SSE) is for tasks producing incremental results — generating long documents, streaming media, or pushing intermediate status updates.[^33] The agent declares `capabilities.streaming: true` in its AgentCard; the client uses `SendStreamingMessage` to send the initial message and subscribe; the server responds with HTTP 200 plus `Content-Type: text/event-stream`. Each event's `data` field contains a JSON-RPC 2.0 Response object — typically a `SendStreamingMessageResponse` whose `result` carries Task, TaskStatusUpdateEvent, or TaskArtifactUpdateEvent.[^33]

Push notifications handle the asynchronous case for very-long-running tasks (minutes, hours, or days) or clients that cannot maintain persistent connections — mobile clients, serverless functions.[^33] The agent must declare `capabilities.pushNotifications: true` and `stateTransitionHistory: true`. The client provides a `PushNotificationConfig` (URL of an HTTPS webhook plus optional `token` for client-side validation and optional `authentication` details) either inline with the initial message or separately via `CreateTaskPushNotificationConfig`.[^34] If a streaming connection breaks, the client uses `SubscribeToTask` to resubscribe to the existing task — preserving incremental progress without restarting the work.[^33]

For AP2 specifically, the implication is operational: a long-running autonomous purchase (the IntentMandate "buy when on sale" pattern) typically uses the push-notification channel to report execution back to the user's primary surface, while a real-time human-present checkout typically uses streaming SSE to surface intermediate cart-update events.

> ### Quotable Findings III
> - **A2A v0.3.0** (Linux Foundation) supports **three transports** at the AgentCard level: JSON-RPC (default), HTTP+JSON/REST, and gRPC; the official JS SDK implements all three.[^30][^34]
>
> - **AgentCard security follows OpenAPI 3.0 Security Scheme Object** semantics with an OR-of-ANDs requirement structure: e.g., "callers must use OAuth OR (API Key AND mTLS)."[^30]
>
> - **A2A Extensions** are URI-identified, declared in AgentCard.capabilities.extensions, activated via `A2A-Extensions` HTTP header, and may be marked `required: true` to enforce client compliance.[^32]
>
> - **AP2 declares its A2A extension** with the URI `https://github.com/google-agentic-commerce/ap2/tree/v0.1` and a `roles` array drawn from `["merchant", "shopper", "credentials-provider", "payment-processor"]`. Merchant agents SHOULD set the extension to `required: true`.[^7]
>
> - **Mandate transport pattern** in A2A: IntentMandate → A2A Message with `DataPart` key `ap2.mandates.IntentMandate`; CartMandate → A2A Artifact with `DataPart` key `ap2.mandates.CartMandate`; PaymentMandate → A2A Message with `DataPart` key `ap2.mandates.PaymentMandate`.[^7]
>
> - **Async transport split**: SSE streaming for short-lived human-present checkout (cart updates); push notifications for long-running autonomous Intent execution (background purchase fulfillment); `SubscribeToTask` recovers state on connection break.[^33]

## Part IV — Composition With Adjacent Protocols

### §IV.1 — AP2 + x402: production-ready stablecoin settlement

The A2A x402 extension is the most production-mature composition path for AP2, launched as part of the original September 16, 2025 announcement.[^9] Coinbase's launch post frames it directly: "x402 within Google's new AP2 means agents can pay each other. Stablecoins make this possible at the speed of code, unlocking micropayments and new models of automation that legacy rails simply can't support."[^9] The proof-of-concept demo Coinbase and Google built for Lowe's Innovation Lab exercises the full path: an agent discovers a product, researches it, checks inventory, shops, and checks out — all from a single user prompt — using AP2 mandates for authorization and x402 + USDC on Base for settlement.[^9]

The composition is layered cleanly. AP2 governs *what the agent is allowed to spend* through the IntentMandate constraints; x402 governs *how the payment settles* through HTTP 402 Payment Required + EIP-3009 stablecoin permits.[^21] Crossmint's March 2026 industry analysis confirms the production status: "AP2's A2A x402 extension is production-ready for crypto, but broader card-based implementations are still maturing."[^21] The trade-off is that AP2's card-flow side is slower-maturing than its stablecoin side — implementers wanting cards-first deployments are leaning on PSPs (PayPal, Adyen) that have built in-house AP2-mandate plumbing rather than waiting for a fully card-native AP2 reference implementation.[^48]

### §IV.2 — AP2 + UCP: the NRF 2026 stack

The Google UCP stack as launched at NRF 2026 composes five layers: MCP for tool discovery, UCP for the merchant journey (catalog APIs, checkout calls, communication between roles), AP2 for the payment-authorization step inside UCP, A2A for cross-vendor agent delegation, and a payment rail (card networks via Visa or PayPal, or stablecoins via x402) for settlement.[^20][^52] Shopify's developer documentation surfaces this concretely on the merchant side: "Universal Commerce Protocol (UCP) is an open standard that establishes a common language and a set of primitives that allow agents, merchants, Payment Service Providers (PSPs), and Credential Providers (CPs) to communicate consistently and securely across the web."[^44] Shopify provides UCP-compliant MCP tools across discovery / cart / checkout, with profile-based trust-tier gating: trusted agents can complete checkouts directly; lower-trust agents require redirection to the merchant storefront.[^44]

The official ap2-protocol.org documentation makes the integration explicit: "AP2 is designed explicitly to be compatible with the Universal Commerce Protocol (UCP) and integrates seamlessly. AP2 operates as a security feature within a Commerce Protocol. The exact details of the Commerce Protocol (e.g., catalog APIs, checkout updates) are outside the scope of AP2."[^4] In other words, AP2 deliberately does not attempt to be a commerce protocol. It binds *in* to whatever commerce protocol the deployment uses (UCP, ACP, or a custom one) and provides the cryptographic-mandate layer those protocols don't define on their own.[^4]

### §IV.3 — AP2 + ACP: protocol overlap and the OpenAI pivot

AP2 and ACP partially overlap in scope, and the production lesson from late 2025 / early 2026 is concrete. ACP launched September 29, 2025 alongside OpenAI's Instant Checkout — its first production deployment, initially with Etsy and Shopify merchants.[^17] OpenAI shut down Instant Checkout in early March 2026 after conversion rates fell short; only ~12 merchants ever went live.[^17] The ACP protocol itself remains active, with Shopify, Salesforce, and PayPal continuing to build on it.[^17]

The key composition pattern is documented by Eco's six-protocol comparison: "ACP and UCP are alternatives at the commerce layer. AP2 is the authorization layer that plugs into UCP (and could theoretically plug into ACP)."[^20] In practice, AP2 + ACP composition has not received the same amount of public reference-implementation attention as AP2 + UCP — the OpenAI pivot redirected ACP work toward an app-based model that does not currently call AP2 mandates as its authorization primitive.[^21] Implementers building today face a clean architectural choice: AP2 + UCP if they want the Google-stack reference implementations and 100+ partner coalition; ACP standalone if they want OpenAI's distribution but accept ACP's narrower mandate-shape (delegate payment tokens with Allowance constraints rather than full IntentMandate semantics).[^18]

### §IV.4 — AP2 + Visa TAP: the identity wrapper

Visa's Trusted Agent Protocol (TAP) is the identity wrapper above AP2 — and explicitly does not move money. TAP was unveiled October 14, 2025 by Visa and Cloudflare with twelve launch partners (Adyen, Ant International, Checkout.com, Coinbase, CyberSource, Elavon, Fiserv, Microsoft, Nuvei, Shopify, Stripe, Worldpay).[^39][^43] The protocol is built on RFC 9421 HTTP Message Signatures aligned with the emerging Web Bot Auth standard.[^37][^42] Each request from a trusted agent carries a `Signature-Input` and `Signature` header set with `keyid`, `created`, `expires`, `tag` (`agent-browser-auth` for browsing or `agent-payer-auth` for payment), and `nonce` (replay protection).[^37][^42]

The validation flow is short and deterministic. A merchant (or, in the canonical Cloudflare deployment pattern, the CDN edge as validator-on-behalf): (1) confirms presence of `Signature-Input` and `Signature` headers; (2) pulls `keyid` from `Signature-Input`, fetches the public key from the Visa-operated directory at `https://mcp.visa.com/.well-known/jwks` if not cached; (3) reconstructs the canonical signature_base; (4) checks nonce uniqueness against a recent-use cache to reject replays; (5) checks the validity of the `tag` against the protocol-defined values.[^37][^42] The Agentic Consumer Recognition Object lives in the request body: a JSON object containing consumer recognition data and an inner signature signed with the same private key as the message signature, sharing the same nonce — letting merchants verify both message and content integrity from a single keypair.[^37]

The architectural complement to AP2 is clean. TAP answers "is this a real agent acting for a real user, or a scraper pretending to be one"; AP2 answers "and was the agent authorized to make this specific purchase, with what constraints, signed by what mandate."[^43] A typical production stack composes both: TAP-signed HTTP request → merchant edge validates agent identity → merchant accepts AP2 mandate as authorization payload → payment rail (cards / x402) completes settlement. The launch list overlaps heavily with the AP2 partner roster, signaling that TAP is positioned as identity-wrapper-around-AP2 rather than substitute-for-AP2.[^43]

### §IV.5 — AP2 + Mastercard Agent Pay + Verifiable Intent + FIDO

The FIDO Alliance's April 28, 2026 announcement consolidates the trust-layer landscape into formal standards-track motion.[^24][^45] The Agentic Authentication Technical Working Group is forming around three consolidation goals: Verifiable User Instructions (phishing-resistant authorization mechanisms), Agent Authentication (verifying that an AI agent is acting on behalf of an authenticated user within defined parameters), and Trusted Delegation for Commerce.[^24] In parallel, FIDO is developing specifications for agent-initiated commerce within its Payments Technical Working Group, chaired by members from Mastercard and Visa, with technical contributions from Google (AP2) and Mastercard (Verifiable Intent).[^24]

The Verifiable Intent specification at `verifiableintent.dev` is the Mastercard contribution — co-developed with Google to work with AP2.[^28] Mastercard's stated framing is direct: "By contributing Verifiable Intent to the FIDO Alliance's standards work, and our continued work with other standards bodies, we're supporting an approach that creates a shared record of user intent that the entire payments ecosystem can rely on."[^24] Mastercard Agent Pay is the production implementation: announced earlier in 2025, integrated with Microsoft Copilot Checkout (Jan 2026), integrated with PayPal's wallet (October 27, 2025 joint announcement), and used in the Mastercard + Santander + PayOS Europe-first live AI agent payment on March 2, 2026.[^46][^49][^50] PayPal's own statement at the FIDO announcement (Rakan Khalid, Head of Identity Product) frames the convergence: "extending phishing-resistant authentication and trust infrastructure into a model where user intent is cryptographically verifiable, delegation is bounded, and agents can transact only within authorized limits."[^24]

> ### Quotable Findings IV
> - **AP2 + x402** is the most production-mature composition path: A2A x402 extension launched at AP2 announcement (Sept 16, 2025) and was the basis for the Coinbase × Google Lowe's Innovation Lab demo.[^9]
>
> - The **Google UCP stack at NRF 2026** composes five layers: **MCP (tools) + UCP (merchant) + AP2 (authorization) + A2A (transport) + payment rail (cards via Visa/PayPal or stablecoins via x402)**.[^20][^52]
>
> - **AP2 deliberately does not attempt to be a commerce protocol** — it binds into whatever commerce protocol the deployment uses (UCP, ACP, or custom) and provides the cryptographic-mandate layer those protocols don't define.[^4]
>
> - **Visa TAP** is the **identity wrapper**, not a payment rail: RFC 9421 HTTP Message Signatures + Web Bot Auth + tag values `agent-browser-auth` / `agent-payer-auth` + Visa-operated directory at `mcp.visa.com/.well-known/jwks`.[^37][^42]
>
> - **OpenAI shut down Instant Checkout in early March 2026** after only ~12 ACP merchants ever went live; ACP itself remains active with Shopify, Salesforce, and PayPal — but the AP2 + ACP composition has not seen reference-implementation attention comparable to AP2 + UCP.[^17]
>
> - **FIDO Alliance Agentic Authentication TWG (April 28, 2026)** consolidates AP2 (Google) and Verifiable Intent (Mastercard) as initial contributions toward a formal standards-track agentic-commerce trust framework.[^24]

## Part V — Production Deployment Playbook

### §V.1 — PayPal Agent + Google Cloud Conversational Commerce Agent

The Google Cloud + PayPal joint solution announced October 27, 2025 is the cleanest end-to-end production reference for AP2 + A2A on cards.[^47] The architecture: merchants deploy Google Cloud's Conversational Commerce Agent (or build their own using Google's Agent Development Kit) on their digital surfaces; the merchant's commerce agent communicates with the PayPal Agent over A2A; the PayPal Agent provides AP2-mandate-based checkout when the user is ready to purchase.[^47] The PayPal Agent surfaces payment-method recommendations and checks "buy now, pay later" eligibility; merchant agents authenticate to the PayPal Agent and authorize transactions on a Trusted Surface.[^47]

The deployment value-prop is concrete: merchants get out-of-box agent commerce without building the framework from scratch, while owning the customer relationship and the brand presentation.[^47] The PayPal-side integration leverages PayPal's existing infrastructure across approximately 200 markets and dozens of currencies, with mandates flowing through existing authorization packets.[^48] PayPal's developer blog frames its three-dimensional integration: **Establishing Identity** (curated allow-lists and registries with device fingerprinting, velocity controls, tokenization → eventually open standards like DNS/DNSSEC and mutual TLS), **Scaling Adoption** (mandates flow through existing authorization packets, role separation reinforced by wallet/checkout/processing layers, accountability supported through Seller Protection enhanced with mandate evidence), and **Extending AP2 with commerce-side standards** (the broader effort PayPal is leading with participating companies).[^48]

### §V.2 — PSP integration patterns: Adyen, Stripe, Worldpay, Checkout.com

Each major PSP has taken a slightly different posture toward AP2 and the broader stack. Adyen is endorsed by or collaborating on UCP, AP2, and Visa's Trusted Agent Protocol — the broadest protocol coverage of any PSP outside Stripe.[^51] Adyen's CFO Ethan Tandowsky noted during Q3 2025 earnings that "implementation work isn't the biggest challenge" because the foundational infrastructure already exists.[^51] However, as of March 27, 2026, Adyen had published frameworks, endorsed protocols, and hinted at protocol betas in Q1 2026, but no publicly available agent toolkit, SDK, or agentic commerce endpoint that merchants can integrate today — "Adyen is positioning, not shipping" relative to Stripe's already-shipping Agent Toolkit.[^51]

Stripe's approach is bifurcated. ACP is its primary commerce-flow protocol (co-developed with OpenAI), with shipping integrations for OpenAI, LangChain, and CrewAI.[^51][^17] On the settlement side, Stripe and Tempo co-developed MPP (launched March 18, 2026), providing payment-method-agnostic Sessions-based billing with Stripe's full distribution behind it.[^17][^22] Stripe also integrated x402 for USDC payments on Base in February 2026, signaling parallel-rail support rather than picking one stablecoin protocol.[^21] PayPal's own strategy, documented in the PayPal Community blog, runs through AP2 specifically — leveraging PayPal's onboarding and credential-provider vetting to serve the trust-registry function that AP2 explicitly anticipates.[^48]

Worldpay and Checkout.com appear in the AP2 launch coalition and Visa TAP launch coalition but have published less public detail on AP2-specific reference implementations as of May 2026.[^8][^39] The pattern across all four major PSPs converges on Forrester's framing: "Merchant payment providers' strategies are to be 'connectors' — building MCP servers, building capabilities and certifications for the many protocols and frameworks out there. Initially most are focused on Google's UCP and OpenAI's ACP, but they are also building support for Know Your Agent protocols and AI agent-specific payment tokens."[^50]

### §V.3 — The implementer-owned checklist

The AP2 specification deliberately leaves several implementation details to implementers. This is the concrete checklist for production deployment, drawn from the canonical specs and reference implementations.

**AgentCard publication**: publish AgentCard at `/.well-known/agent-card` (or extended-card path for authenticated callers), declare AP2 extension URI in capabilities, populate `roles` array per the AP2ExtensionParameters schema, set `required: true` if performing the merchant role.[^7][^30]

**Mandate signing key management**: per-agent Ed25519 keys for non-payment signing; ECDSA keys for the Checkout-JWT signing path that PaymentMandate binds to (rainbow-table protection); per-key rotation schedule (quarterly recommended); key fingerprints registered in identity registry.[^4][^28]

**Cart-hash binding**: every CartMandate must include `cart_hash` as a secure hash of CartMandate contents; PaymentMandate binds to the Checkout JWT via cryptographic hash of the JWT itself — the binding hash MUST be computed over the canonical serialized JWT, not over a parsed object that risks non-deterministic ordering.[^3][^4]

**JWT TTL tuning**: CartMandate JWT 5–15 minute exp; L2 Immediate KB-SD-JWT ~15 min; L2 Autonomous KB-SD-JWT 24h–30d depending on user constraints; L3 KB-SD-JWT ~5 min; align all TTLs against the longest realistic latency in your checkout path while keeping replay-window minimal.[^28][^3]

**vct version pinning**: explicitly reject mandates whose `vct` does not match the version your verifier has tested; never silently accept a future-version mandate.[^4]

**Risk-data DataPart**: include risk_data with implementation-defined risk signals on every Message and Artifact carrying mandates — this is the protocol-supported channel for merchant fraud signals.[^7]

### §V.4 — Mastercard Agent Pay × PayPal wallet integration

The October 27, 2025 Mastercard × PayPal joint announcement specifies the production integration shape between two of the largest payment networks in the AP2 coalition.[^46] Mastercard Agent Pay integrates into PayPal's wallet to allow AI agents to complete transactions on behalf of PayPal users with Mastercard cards on file. PayPal pilots the Mastercard Agent Pay Acceptance Framework — co-developing and testing with agents and merchants in the market to ensure compatibility with common agentic protocols (AP2, plus AI agent verification and data exchange compatible with recently-announced agentic protocols).[^46]

The reach is concrete: hundreds of millions of consumers and tens of millions of merchants globally able to participate, including the millions of Mastercard cards on file across PayPal plus Mastercard/PayPal co-branded credit and debit cards.[^46] The agent-experience flow described in the press release: "Tom" sees an AI agent suggesting a checkout option, the agent recognizes that Tom uses PayPal and the merchant accepts PayPal, asks Tom to verify identity, completes via tokenization and authentication.[^46] The architectural implication is that AP2 mandates flow through Mastercard Agent Pay's tokenization layer and PayPal's wallet layer simultaneously — the user's payment instrument selection becomes part of the mandate evidence, not a separate decision divorced from the AP2 attestation.[^46]

### §V.5 — Audit-trail composition with PDR / AgDR Phoenix

The AP2 mandate trio composes upward into the audit-trail substrate documented in the prior paper in this canon (Policy Decision Record paper #10). Each AP2 mandate becomes evidence_pointers content in a generated PDR: the IntentMandate hash → policy_hash; the CartMandate JWT → evidence_pointer; the PaymentMandate hash → evidence_pointer; the agent-key signature → signer; the resulting attested-decision record is wrapped in AgDR's PPP envelope (Provenance / Place / Purpose) for jurisdiction-aware accountability.

For deployers operating under EU AI Act Article 12 + Article 26(6), Colorado SB 24-205, ISO 42001, NIST AI RMF, FRE 902(13)/(14), or Canada Evidence Act s.31.1–31.4, this composition is the path that takes AP2's payment-side cryptographic mandates and extends them to court-admissible audit-trail status without rebuilding the substrate. The architectural rule is the same as in paper #10: capture once at the decision boundary; verify-once with the same cryptographic primitives across both regulatory and legal forums.

> ### Quotable Findings V
> - **PayPal Agent + Google Cloud Conversational Commerce Agent** is the cleanest end-to-end production reference for AP2 + A2A on cards (announced Oct 27, 2025), spanning ~200 markets and dozens of currencies.[^47][^48]
>
> - **PSP coverage**: Adyen has the broadest protocol endorsement (UCP + AP2 + TAP) but is "positioning, not shipping" as of March 2026; Stripe is bifurcated (ACP + MPP + x402) and shipping; PayPal runs through AP2 specifically with credential-provider vetting infrastructure.[^51][^21][^48]
>
> - **PaymentMandate Checkout JWT MUST be ECDSA-signed** to prevent rainbow-table attacks against predictable cart structures — this is a hard implementer-owned constraint, not a recommendation.[^4]
>
> - **JWT TTL ladder**: CartMandate 5–15 min, L2 Immediate ~15 min, L2 Autonomous 24h–30d, L3 ~5 min — align all TTLs against the longest realistic latency in your checkout path while keeping replay-window minimal.[^28][^3]
>
> - **Mastercard Agent Pay × PayPal wallet** integration brings AP2 mandates into the tokenization layer for hundreds of millions of consumers and tens of millions of merchants — the integration tests AP2's coexistence with established card-network tokenization frameworks.[^46]
>
> - **AP2 mandates compose with Policy Decision Records (paper #10)**: IntentMandate hash → policy_hash, CartMandate JWT → evidence_pointer, agent-key signature → signer — turning payment authorization into court-admissible audit-trail substrate without rebuild.

## Part VI — Threat Model, Open Questions, Out-of-Scope

### §VI.1 — Threat model

The five attacks worth modelling for an AP2 deployment: (1) **Replay** — an attacker resubmits a previously-emitted CartMandate or PaymentMandate. Mitigated by nonce + timestamp window in the JWT plus IntentHub-side rejection at the merchant edge; Visa TAP layers a second nonce check at the CDN edge.[^4][^42] (2) **Mandate tampering** — an attacker modifies a cart after the user signs. Mitigated by `cart_hash` binding in the CartMandate JWT and by PaymentMandate's cryptographic hash of the Checkout JWT.[^3][^4] (3) **Key compromise** — an agent or policy-engine signing key leaks. Mitigated by quarterly key rotation, immediate rotation on compromise indicator, and `vct` version pinning to limit blast radius.[^28] (4) **Role spoofing** — an agent claims a role (e.g., "merchant") it is not authorized to perform. Mitigated by AgentCard signature verification (`AgentCardSignature` in the gRPC variant) plus identity-registry lookup against the declared role.[^36][^7] (5) **Cross-protocol confusion** — a TAP-signed request carrying an AP2 mandate is replayed across protocols. Mitigated by binding mandate scope to a specific protocol context — the `aud` claim in the SD-JWT-VC plus the `tag` in the TAP signature provide complementary scope-pinning.[^28][^37]

### §VI.2 — Open questions and gaps

The most-cited gap in the current AP2 surface is **cross-protocol budget tracking** — the goodmeta agent-payments-landscape repository names it explicitly: "an agent that shops via UCP, pays for APIs via MPP, and settles via x402 has no unified spending verification across all three. Each protocol tracks its own transactions in isolation."[^18] No protocol fills this gap as of May 2026; AP2 IntentMandate constraints provide a per-mandate budget, but reconciling spending across mandates that hit different settlement protocols remains implementer-owned.

**Push-payment support** (real-time bank transfers, e-wallets) is on AP2's V1.x roadmap but not in V0.1; current V0.1 supports only "pull" payment methods (credit/debit cards) with stablecoin settlement via the x402 extension.[^2][^21] **Recurring/subscription mandate semantics** are likewise V1.x roadmap material — the Verifiable Intent specification defines `mandate.payment.recurrence` and `mandate.payment.agent_recurrence` constraints, but the integration with AP2's V0.1 PaymentMandate is not yet stabilized.[^28] **Cross-merchant transaction topologies** — an agent splitting a single user intent across multiple merchants — are explicitly named as roadmap material in AP2's docs.[^18]

### §VI.3 — Out of scope

Three categories this paper deliberately does not cover. **Voice-first or telephony agent variants** — separate tooling category with separate acoustic-evidence considerations. **Specific framework comparisons** (LangChain vs CrewAI vs AutoGen vs ADK) — AP2 is framework-agnostic; the comparison is not load-bearing for the mandate-architecture thesis. **Deep dive into x402 settlement mechanics**, **MPP sessions semantics**, and **TAP signature internals** — covered in the parent paper #5 (Agent Payment Stack 2026), the prior paper #9 (AI Agent Wallet Architecture), and the Visa TAP canonical spec respectively.[^37]

### §VI.4 — Where the field is going

The AP2 V1.x roadmap, documented in `docs/specification.md`, names the expected expansions: full support for "push" payments and all payment methods, standardized flows for recurring payments and subscriptions, support for human-not-present scenarios in expanded forms, and detailed sequence diagrams for MCP-based implementations.[^2] The FIDO Alliance Payments Technical Working Group is the standards-track venue for the longer-term consolidation; expect formal Working-Group-Draft status for an AP2 + Verifiable Intent merged specification within 12–18 months of the April 28, 2026 announcement.[^24]

The biggest expected change is the formal merging of AP2 and Mastercard Verifiable Intent into a single FIDO-stewarded specification — both Google and Mastercard contributions have been positioned as "initial contributions to a working group" rather than competing standards.[^24] The AP2 GitHub repository is at v0.2.0 (released April 28, 2026) and continues active development with 20 contributors.[^1] The path implementers should bet on is the AP2 mandate trio plus the Verifiable Intent SD-JWT layered model as the converged production substrate, with the FIDO Alliance providing standards-track stewardship and the broader 100+ org coalition providing distribution.

## Closing

The shift the agent-commerce ecosystem is undergoing is from protocol-of-the-month to composable stack. AP2 is the authorization primitive. A2A is the transport. UCP is the commerce frame. x402 / MPP are the settlement rails. TAP is the identity wrapper. FIDO Alliance is the standards-track venue. Builders who treat the mandate as a first-class engineering surface — capturing IntentMandate at delegation time, CartMandate at user-confirmation time, PaymentMandate at network/issuer-visibility time, all bound by `cart_hash` and SD-JWT-VC `cnf` claims and verified through `vct` version pinning — integrate cleanly across all of those layers without rebuilding when any single component evolves.

The infrastructure is in place. The 100+ org coalition is real. The production deployments are real (Mastercard + Santander, PayPal + Mastercard, Microsoft Copilot + Mastercard Agent Pay, PayPal × Perplexity). The implementer-owned details — key management, TTL tuning, vct pinning, risk-data plumbing — are documented in this paper. What remains is the work of shipping it.

## Related Research

This paper composes the authorization layer that paper #5 ([The Agent Payment Stack 2026](/research/agent-payment-stack-2026)) framed across the broader x402 / ACP / AP2 / TAP cluster. Paper #9 ([AI Agent Wallet Architecture](/research/ai-agent-wallet-architecture-erc-8196)) builds the wallet substrate that emits AP2-shaped receipts via ERC-8196 hash chains. Paper #10 ([The Policy Decision Record](/research/policy-decision-record-implementation-2026)) provides the audit-trail substrate that AP2 mandates compose into for court-admissible status. Paper #1 ([The B2A Imperative](/research/b2a-2026)) frames the broader trust-stack architecture in which AP2 sits.

## Glossary

**AP2** · Agent Payments Protocol. Google-led open extension to A2A + MCP.
**A2A** · Agent2Agent Protocol. Linux Foundation transport.
**MCP** · Model Context Protocol. Anthropic.
**UCP** · Universal Commerce Protocol. Google + Shopify.
**ACP** · Agentic Commerce Protocol. OpenAI + Stripe.
**x402** · Coinbase HTTP 402 stablecoin protocol.
**MPP** · Machine Payments Protocol. Stripe + Tempo.
**TAP** · Trusted Agent Protocol. Visa + Cloudflare.
**IntentMandate / CartMandate / PaymentMandate** · AP2 VDC trio.
**VDC** · Verifiable Digital Credential.
**SD-JWT-VC** · Selective Disclosure JWT for VCs.
**KB-JWT** · Key-Binding JWT.
**cnf / vct claims** · RFC 7800 key binding; SD-JWT-VC schema version.
**RFC 9421 / 7800 / 9901** · HTTP Message Signatures; Proof of Possession; SD-JWT base.
**Web Bot Auth** · Cloudflare cryptographic bot/agent auth standard.
**AgentCard / AgentExtension** · A2A metadata + extension primitive.
**FIDO Alliance** · Standards body running Agentic Authentication + Payments TWGs.
**NRF** · National Retail Federation. UCP launched Jan 11, 2026.
**Mastercard Agent Pay / Verifiable Intent** · Mastercard production platform + SD-JWT layered framework.
**PayPal Agent / Conversational Commerce Agent** · PayPal AP2 + Google Cloud merchant agent.
**SharedPaymentToken (SPT)** · Stripe single-use payment token.

## References

[^1]: google-agentic-commerce / AP2 GitHub repository. https://github.com/google-agentic-commerce/AP2
[^2]: AP2 Specification (`docs/specification.md`). https://github.com/google-agentic-commerce/AP2/blob/main/docs/specification.md
[^3]: AP2 mandate types source code (`src/ap2/types/mandate.py`). https://github.com/google-agentic-commerce/AP2/blob/main/src/ap2/types/mandate.py
[^4]: AP2 Protocol Documentation. https://ap2-protocol.org/ap2/specification/
[^5]: AP2 Core Concepts. https://ap2-protocol.org/topics/core-concepts/
[^7]: AP2 A2A Extension specification (`docs/a2a-extension.md`). https://github.com/google-agentic-commerce/AP2/blob/61f5de49/docs/a2a-extension.md
[^8]: Google Cloud Blog (2025-09-16), *Announcing Agent Payments Protocol (AP2)*. https://cloud.google.com/blog/products/ai-machine-learning/announcing-agents-to-payments-ap2-protocol
[^9]: Coinbase Developer Platform (2025-09-16), *Google Agentic Payments Protocol + x402: Agents Can Now Actually Pay Each Other*. https://www.coinbase.com/developer-platform/discover/launches/google_x402
[^11]: Russell Brandom / TechCrunch (2025-09-16), *Google launches new protocol for agent-driven purchases*. https://techcrunch.com/2025/09/16/google-launches-new-protocol-for-agent-driven-purchases/
[^12]: The Paypers (2025-09-17), *Google rolls out Agent Payments Protocol*. https://thepaypers.com/payments/news/google-launches-agent-payments-protocol-ap2
[^13]: Editorial Team / Finextra (2025-09-16), *Google unveils Agent Payments Protocol to power AI commerce*. https://www.finextra.com/newsarticle/46600/google-unveils-agent-payments-protocol-to-power-ai-commerce
[^14]: TNGlobal (2025-09-17), *Google Cloud launches Agent Payments Protocol with over 60 organizations*. https://technode.global/2025/09/17/google-cloud-launches-agent-payments-protocol-with-over-60-organizations/
[^15]: Blessed Frank / Technext24 (2025-09-17), *Google launches AI Agent Payment Protocol with Coinbase, Mastercard, PayPal*. https://technext24.com/2025/09/17/google-launch-ai-agent-payment-protocol/
[^16]: Evelyn Herrera / HyperTrends (2026-04-02), *Agentic Payments: The Complete Protocol Comparison*. https://www.hypertrends.com/2026/04/agentic-payments-x402-acp-ap2-tap-comparison/
[^17]: FluxA (2026-04-21), *x402, ACP, AP2 & MPP: The Agent Payment Stack*. https://fluxapay.xyz/learning/x402-acp-ap-2-and-mpp-the-agent-payment-stack
[^18]: goodmeta / agent-payments-landscape (2026-03-31). https://github.com/goodmeta/agent-payments-landscape
[^19]: HireNinja Blog (2025-11-23), *Agentic Commerce in 2026: AP2 vs Visa TAP vs Stripe ACP vs x402 — A Merchant's Readiness Checklist*. https://blog.hireninja.com/2025/11/23/agentic-commerce-in-2026-ap2-vs-visa-tap-vs-stripe-acp-vs-x402-a-merchants-readiness-checklist/
[^20]: Eco (2026-04), *Agent Payment Protocols Compared*. https://eco.com/support/en/articles/14839407-agent-payment-protocols-compared
[^21]: Crossmint (2026-03-19), *Which is best for your AI agents? (MPP, ACP, AP2, x402)*. https://www.crossmint.com/learn/agentic-payments-protocols-compared
[^22]: Alchemy (2026-03-18), *x402 vs MPP: Comparing Agent Payment Protocols*. https://www.alchemy.com/blog/x402-vs-mpp-comparing-agent-payment-protocols
[^23]: 402audit, *x402 vs MPP — Machine Payment Protocol Comparison*. https://402audit.com/machine-payments
[^24]: FIDO Alliance (2026-04-28), *FIDO Alliance to Develop Standards for Trusted AI Agent Interactions*. https://fidoalliance.org/fido-alliance-to-develop-standards-for-trusted-ai-agent-interactions/
[^25]: World Wide Web Consortium (2025-05-15), *Verifiable Credentials Data Model v2.0*. https://www.w3.org/TR/vc-data-model-2.0/
[^27]: Oliver Terbu (MATTR) et al. (IETF), *draft-ietf-oauth-sd-jwt-vc-15*. https://datatracker.ietf.org/doc/html/draft-ietf-oauth-sd-jwt-vc
[^28]: Verifiable Intent — Credential Format spec. https://verifiableintent.dev/spec/credential-format/
[^29]: Verifiable Intent — Overview spec. https://verifiableintent.dev/spec/
[^30]: A2A Protocol v0.3.0 specification (Linux Foundation). https://a2a-protocol.org/v0.3.0/specification/
[^31]: A2A Protocol Overview. https://a2a-protocol.org/latest/specification
[^32]: A2A Protocol — Extensions. https://a2a-protocol.org/dev/topics/extensions
[^33]: A2A Protocol — Streaming & Asynchronous Operations. https://a2a-protocol.org/dev/topics/streaming-and-async
[^34]: a2aproject / a2a-js JavaScript SDK. https://github.com/google-a2a/a2a-js
[^35]: a2aproject / A2A main repository. https://github.com/a2aproject/A2A
[^36]: A2A v0.3.0 gRPC proto (`specification/grpc/a2a.proto`). https://github.com/a2aproject/A2A/blob/v0.3.0/specification/grpc/a2a.proto
[^37]: Visa Developer — Trusted Agent Protocol Specifications. https://developer.visa.com/capabilities/trusted-agent-protocol/trusted-agent-protocol-specifications
[^39]: Visa (2025-10-14), *Visa Unveils Trusted Agent Protocol for AI Commerce*. https://corporate.visa.com/en/sites/visa-perspectives/newsroom/visa-unveils-trusted-agent-protocol-for-ai-commerce.html
[^42]: Cloudflare Blog (2025-10-24), *Helping AI Agents transact with Visa and Mastercard*. https://blog.cloudflare.com/secure-agentic-commerce/
[^43]: Eco, *Visa Trusted Agent Protocol (TAP) Explained*. https://eco.com/support/en/articles/14845482-visa-trusted-agent-protocol-tap-explained
[^44]: Shopify Developer Documentation, *Agentic Commerce (UCP)*. https://shopify.dev/docs/agents
[^45]: PPC Land (2026-05-05), *FIDO Alliance forms working groups to lock down AI agent payments*. https://ppc.land/fido-alliance-forms-working-groups-to-lock-down-ai-agent-payments/
[^46]: PayPal Newsroom (2025-10-27), *Mastercard and PayPal Join Forces To Accelerate Secure Global Agentic Commerce*. https://newsroom.paypal-corp.com/2025-10-27-Mastercard-and-PayPal-Join-Forces-To-Accelerate-Secure-Global-Agentic-Commerce
[^47]: Google Cloud Blog (2025-10-27), *Introducing an agentic commerce solution for merchants from PayPal and Google Cloud*. https://cloud.google.com/blog/topics/financial-services/introducing-an-agentic-commerce-solution-for-merchants-from-paypal-and-google-cloud
[^48]: PayPal Community Blog, *Agent Payments Protocol: Building Verifiable Trust for Agentic Commerce*. https://developer.paypal.com/community/blog/PayPal-Agent-Payments-Protocol/
[^49]: Mastercard Global (2026-01-20), *Building trust in AI commerce: Mastercard's agentic protocols*. https://www.mastercard.com/global/en/news-and-trends/stories/2026/agentic-commerce-rules-of-the-road.html
[^50]: Lily Varon / Forrester (2026-04-09), *Agentic Payments In B2C Commerce: Where We Are Now*. https://www.forrester.com/blogs/agentic-payments-in-b2c-commerce-where-we-are-now/
[^51]: Major Matters (2026-03-27), *Adyen Agentic Commerce Review 2026*. https://www.majormatters.co/p/adyen-agentic-commerce-review
[^52]: Markus Kasanmascheff / WinBuzzer (2026-01-11), *AI Shopping: Google Launches Universal Commerce Protocol and Direct Offers*. https://winbuzzer.com/2026/01/11/ai-shopping-google-launches-universal-commerce-protocol-and-direct-offers-betting-on-open-standards-to-win-agentic-shopping-race-xcxwbn/

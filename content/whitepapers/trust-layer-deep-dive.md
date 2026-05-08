---
title: "The Trust Layer Deep Dive"
subtitle: "Mandates, Identity, and the Cryptographic Stack of B2A — the Asymmetric Pivot"
publication: "perea.ai Research"
authors: ["Dante Perea"]
version: "1.0"
status: "Public draft"
date: "2026-05"
audience: "Security and platform engineers building agent payment surfaces; identity architects designing mandate flows; compliance leads writing audit pipelines for autonomous commerce; founders mapping cryptographic assumptions in B2A protocols"
length: "~3,400 words"
license: "CC BY 4.0"
description: "An authority survey of the cryptographic and authorization stack underneath agent commerce as it stands in mid-2026: the Asymmetric Pivot from HS256 to ECDSA P-256, the SD-JWT+KB foundation in RFC 9901, AP2's Cart/Intent/Payment Mandate model with delegate_payload chains and cnf claims, the Validation Chasm between cryptographic proof and business authorization, and the PEP/PDP separation that keeps the LLM out of the policy decision."
profile: "field-manual"
---

## 1. The category, in one sentence

When an autonomous agent buys something, four parties — user, agent, merchant, payment processor — must each be able to prove what they authorized, against whom, and within what scope. The Trust Layer is the cryptographic stack that makes those proofs verifiable without any of them needing to trust the others. As of mid-2026, that stack has crystallized around three primitives: SD-JWT+KB as defined in IETF RFC 9901,[^1] AP2's Mandate model as published by Google's `google-agentic-commerce/AP2`,[^2] and the PEP/PDP authorization split popularized by Microsoft, Cordum, and the OPA community.[^3][^4]

This paper maps that stack: the cryptographic primitives, the protocol-level constructs, the architectural pattern, and the failure modes Sonnet & Prose have called out as decisive risks.

## 2. The Asymmetric Pivot

The single most consequential change in agent-payment cryptography in the past 18 months is what AP2 quietly mandates in §Security and Privacy Considerations: deterministic signature schemes such as Ed25519 are not allowed for the Checkout JWT.[^5] Instead, "the Checkout JWT MUST be signed using a digital signature scheme (e.g., ECDSA) and not a deterministic signature."[^6]

This is the Asymmetric Pivot. The reason is structural, not stylistic. The `checkout_hash` claim in a Checkout Mandate makes use of the entropy already included in the JWT signature to prevent guessing the Checkout contents.[^5] If a deterministic signature is used, that entropy is gone — and the protocol becomes susceptible to rainbow-table attacks against the hash. The fix in the AP2 spec is explicit: "If a signing algorithm (e.g. deterministic signature scheme such as `Ed25519`) is used that does not include this then a salt of sufficient entropy MUST be present in the Checkout."[^5]

The practical consequence shows up across every example payload in the spec. Each Checkout and Payment Mandate JWT in `ap2-protocol.org`'s reference uses `"alg": "ES256"` and `"typ": "kb+sd-jwt"`,[^7] and the embedded `cnf` claim binds a P-256 public key:

```json
"cnf": {
  "jwk": {
    "crv": "P-256",
    "kty": "EC",
    "x": "QpSyxPQHy38xckypDr54gZ3T42zj9iLtV4koyb5U27c",
    "y": "37HLd7JJinxjJIn8J7HijssoeclbfhdW-gUL7feI9lw"
  }
}
```

ES256 (ECDSA over P-256 with SHA-256) is required across the AP2 reference; the Universal Commerce Protocol's AP2 Mandates Extension makes this even more explicit: "Algorithms: ES256 (required), ES384, ES512."[^8] HS256 — the symmetric HMAC scheme that, according to one practitioner write-up, remains the default in a large share of legacy SaaS JWT pipelines — is *not* in the permitted set. The Asymmetric Pivot is the precondition for the rest of the stack.

## 3. SD-JWT+KB (RFC 9901): the IETF foundation

AP2 inherits its credential format from RFC 9901, "Selective Disclosure for JSON Web Tokens," published November 2025.[^1] The IETF Datatracker draft history shows the spec moving from draft-12 through draft-22 before standardization.[^9][^10][^11]

The data shape is deceptively simple. An SD-JWT is composed of an Issuer-signed JWT plus zero or more Disclosures. An SD-JWT+KB is an SD-JWT plus a Key Binding JWT (KB-JWT). Compact serialization concatenates them with `~` separators:[^1]

```
<Issuer-signed JWT>~<Disclosure 1>~<Disclosure 2>~...~<Disclosure N>~<KB-JWT>
```

Three properties make this format the right primitive for agent commerce. **First, selective disclosure**: Disclosures are base64url-encoded JSON arrays containing a salt, a claim name (when applicable), and a claim value, and only the digest appears in the issuer-signed JWT.[^1] A holder presents only the disclosures the verifier needs — a Credential Provider learns the payment instrument but not the line items.[^7]

**Second, key binding**: when Key Binding is enforced, "a Holder has to prove possession of a private key belonging to a public key contained in the SD-JWT itself."[^1] The KB-JWT carries `iat`, `aud`, `nonce`, and `sd_hash` — the last being the base64url-encoded hash over the issuer-signed JWT and selected disclosures.[^1] If a verifier replays an SD-JWT against a different audience, the KB-JWT signature fails.

**Third, cryptographic chain integrity**: the `sd_hash` value is computed over US-ASCII bytes of the encoded SD-JWT — issuer-signed JWT, tilde, each selected disclosure followed by tilde — and uses the same hash algorithm declared in `_sd_alg`.[^1] No daisy-chained hash; one stable bind value per presentation.

The IETF working group repository (`oauth-wg/oauth-selective-disclosure-jwt`) ships reference implementations in Python, Kotlin (two), Swift (two), Rust (two), TypeScript (six), Java, Go (two), and Haskell, with EU Digital Identity Wallet libraries in the Kotlin and Swift sets.[^12] The format is no longer aspirational; it's the credential primitive of the EU eIDAS 2.0 wallet rollout, and AP2 piggybacks on that ecosystem.

## 4. AP2 Mandates: Cart, Intent, Payment

AP2's Section 4 ("Trust Anchors: Verifiable Digital Credentials & Mandates")[^13] defines three Verifiable Digital Credentials (VDCs) — Cart Mandate, Intent Mandate, Payment Mandate — secured as SD-JWT+KB credentials. The newer specification documentation collapses two of these into the umbrella term "Checkout Mandate."[^14] Either way, the protocol distinguishes:

**Cart Mandate (Checkout Mandate).** Captures the user's authorization for a purchase when the human is present at the time of purchase.[^13] Generated by the Merchant based on the user's request and cryptographically signed by the user, "typically using a hardware-backed key on their device with in-session authentication."[^13]

**Intent Mandate.** Critical for human-not-present scenarios. The user pre-authorizes a Shopping Agent to act autonomously within stated constraints — a maximum dollar amount, an allowed merchant list, an allowed payment instrument set.[^13] "It serves as the final, non-repudiable authorization to execute a purchase in the user's absence."[^13]

**Payment Mandate.** Provides the Credential Provider, Network, and Merchant Payment Processor cryptographic proof that the Shopping Agent is authorized to pay for a particular Checkout.[^14] The Payment Mandate is bound to a particular Checkout via the cryptographic hash of the Checkout JWT.[^14]

The Checkout Mandate's normative claim list is short and load-bearing:[^14]

| Name | Required | Disclosable | Purpose |
|---|---|---|---|
| `vct` | Yes | No | `mandate.checkout.1` (closed) or `mandate.checkout.open.1` (open) |
| `checkout_jwt` | Yes | Yes | base64url-encoded merchant-signed JWT of the Checkout payload |
| `checkout_hash` | Yes | No | base64url-encoded hash of `checkout_jwt`, uniquely identifying this checkout |
| `iat` | No | No | Creation timestamp (Unix epoch) |
| `exp` | No | No | Expiration timestamp |
| `delegate_payload` | Yes (chain) | Disclosable | Adjacency-list digests linking open and closed Mandates |

The Payment Mandate adds `transaction_id`, `payee`, `pisp` (optional Payment Initiation Service Provider), `payment_amount`, and structured constraint blocks (`payment.amount_range`, `payment.allowed_payees`, `payment.reference`).[^15]

## 5. The Open / Closed binding chain

AP2's most important architectural choice is the Open/Closed Mandate split. An *open* Mandate (`mandate.checkout.open.1`, `mandate.payment.open.1`) carries constraints — currency, max amount, allowed payees, conditional transaction ID — but is not bound to any specific transaction.[^14][^15] A *closed* Mandate (`mandate.checkout.1`, `mandate.payment.1`) is a Mandate authorized for a particular transaction.[^14]

Closed Mandates **MUST** contain the `sd_hash` claim binding them to the open Mandate they were derived from.[^16] Open Mandates **MUST** contain the agent's key (via the `cnf` claim) so that only the agent that held the open Mandate could create a closed Mandate with a valid signature.[^16] Together, this produces a delegate-payload chain that's verifiable end-to-end:

```
User signs open Mandate (with constraints + agent_pk in cnf)
                ↓
Agent signs closed Mandate (with sd_hash binding to open Mandate)
                ↓
Merchant verifies signatures + checks closed conforms to open's constraints
```

The Flows specification's autonomous case is the canonical sequence:[^17]

1. The Shopping Agent assembles open Mandate Contents and requests user approval via a Trusted Surface.
2. The Trusted Surface uses `user_sk` to sign and create open Checkout and open Payment Mandates. The hash of the open Checkout is included in the open Payment Mandate to permanently link them.[^17] The agent's public key is included as a `cnf` claim to sender-constrain Mandate usage.[^17]
3. The user leaves the session.
4. Later, the Shopping Agent autonomously assembles a Cart with the Merchant. The Merchant creates a signed Checkout (the merchant-signed `checkout_jwt`).
5. The Shopping Agent constructs Payment and Checkout Mandate Contents and signs both closed Mandates using `agent_sk`.[^17] The `checkout_jwt` hash is used to permanently link them; the `sd_hash` property of the kb-sd-jwt is used to bind the closed Mandate to the open one.[^17]
6. The Shopping Agent passes the Payment Mandates (open + closed) to the Credential Provider, who verifies them and creates a payment token.[^17]

The recommendation: "set the `exp` claim for these Mandates to the smallest value that will allow the Shopping Agent to complete the assigned task."[^14] Time-bounded delegation is the second cryptographic discipline AP2 puts under contract.

## 6. The Validation Chasm

The chasm Sonnet & Prose called out — and AP2's verification rules implicitly encode — is between cryptographic proof and business authorization. A signature is verifiable. Authority is not. The cryptographic chain proves *what was signed*; it does not prove *that the signer was allowed to sign it*.

AP2's Merchant Verification rules make this explicit:[^7]

- The Checkout Mandate MUST be verified according to the Merchant Verification rules.
- The hash of the `checkout_jwt` MUST be independently computed from the included `checkout_jwt`.
- The Checkout Receipt `reference` MUST match the hash of the closed Checkout Mandate.
- The Payment Mandate MUST be verified according to the Merchant Payment Processor section using the `checkout_hash` from the Checkout Mandate.

These are cryptographic checks. None of them establish whether the Shopping Agent was authorized for *this user, this amount, this merchant, today*. That layer is policy, and policy lives outside the cryptographic chain.

The reference implementation makes the boundary explicit in its trust model: "Closed Mandates MUST contain the `sd_hash` claim to bind them to the presented open Mandate"[^16] is a cryptographic invariant. "Constraints in these Mandates allow the verifier to verify that the Checkout and Payment match the User's intent"[^7] is a *policy* check — and the verifier has to evaluate the constraints, not the protocol.

## 7. Mandate Policy Engines: PEP / PDP separation

> **Sources note.** PDP/OPA architectural patterns in this section draw heavily from two practitioner blogs (Tianpan Pan; Frank @ AppxLab). Treat the specific operational claims (sub-millisecond OPA latency, "80%+ HS256 default" estimates, OPA-as-sidecar topology) as illustrative architecture from individual practitioners rather than industry-validated consensus.

Outside the LLM, two architectural patterns have settled the policy-decision layer in 2026: in-process middleware and out-of-process policy services. The PEP/PDP split is older than agents — XACML, cloud IAM, Kubernetes admission controllers — but agents made the failure modes acute.

The shape, as articulated by Microsoft's Authorization Fabric team:[^3]

- **Policy Enforcement Point (PEP)**: Gatekeeper invoked before any tool/action.
- **Policy Decision Point (PDP)**: Evaluates RBAC + ABAC + approval policies.
- **Decision output**: ALLOW / DENY / REQUIRE_APPROVAL / MASK.

Microsoft's pattern requires the Authorization Fabric be a Microsoft Entra–protected endpoint on Azure Functions/App Service with built-in auth, "implemented as a Microsoft Entra-protected endpoint."[^3] Every agent (Copilot Studio or AI Foundry/Semantic Kernel) calls this fabric *before* tool execution; tools are invoked only after an ALLOW decision.[^3] Policies live in a central store (Cosmos DB or equivalent), not hardcoded in agents.[^3]

Cordum's analysis of in-process vs out-of-process governance frames the trust-boundary argument:[^4] "Compromise of the agent does not compromise the policy decision because the two live in separate trust boundaries."[^4] In-process governance — Microsoft AGT, Galileo Agent Control, APort's Open Agent Passport, NeMo Guardrails, Guardrails AI, most LangChain callbacks — runs the PEP and PDP in the same Python process as the agent.[^4] Cordum's Safety Kernel runs as a separate gRPC service behind mTLS; the agent calls it before dispatch and never sees the decision being made.[^4]

Open Policy Agent (OPA) is the CNCF-graduated general-purpose engine, with Rego as its policy language.[^18] Rego is declarative and supports rich data joins via OPAL; one practitioner write-up (Tianpan Pan) reports sub-millisecond decision latencies in colocated-sidecar deployments, though absolute numbers depend heavily on policy complexity and cache state.[^18] Zylos Research's recommended approach for Rust runtimes: compile OPA policies to WASM and execute them via `wasmtime`, eliminating network round-trips while preserving Rego's expressiveness.[^19]

The crucial discipline both Microsoft and Zylos call out is what they label the *LLM-as-advisor-not-judge* model:[^20] LLMs can enrich policy decisions with semantic classification (Category C — "must LLM" — for genuine ambiguity), but structured LLM output must always enter a deterministic decision function. The final ALLOW/DENY must always come from deterministic evaluation.[^20]

The settled architecture, per Tianpan Pan's April 2026 essay:[^18] "A user-initiated request enters the agent runtime carrying a session token. The runtime exchanges that token for a task-scoped capability token at the authorization server. The agent loop runs; before each tool call, the runtime calls the PDP (OPA, Cedar, or equivalent) with the principal, actor, tool, and arguments. The PDP returns allow/deny plus a reason... Decision logs from every PDP stream into the SIEM. The capability token expires when the task ends."[^18]

## 8. Three decisive failure modes

Sonnet & Prose's review of the AP2 reference implementation surfaced three failure modes that even a correctly-specified protocol can produce in practice. Each maps to a place where the cryptographic chain interacts with the policy chain.

**Failure mode 1: Symmetric signing.** A naive HS256 implementation of the Checkout JWT — which, as documented by a single OPA-Rego practitioner blog, remains the default in a large share of legacy SaaS JWT pipelines[^18] — collapses the entropy property the AP2 specification depends on for `checkout_hash`. Anyone who sees the symmetric secret can forge JWTs and rainbow-table the hash. AP2's normative MUST against deterministic signatures[^5] is the cryptographic equivalent of this failure mode; the operational equivalent is failing to migrate existing JWT signing infrastructure when bolting on agent payments. Detection: any production deployment whose Checkout JWT carries `"alg": "HS256"` is non-conformant.

**Failure mode 2: Orphan cart credentials.** AP2's binding chain depends on the `delegate_payload` array linking open and closed Mandates by digest. If an Agent Provider issues a closed Mandate whose `sd_hash` references an open Mandate the verifier cannot resolve — because the open Mandate was never registered with the verifier or has expired — the closed Mandate becomes an orphan credential: cryptographically valid, but unverifiable. AP2 §Security and Privacy explicitly requires verifiers to reject any closed Mandate whose chain cannot be resolved to a known open Mandate.[^16] Operationally, this means a credential lifecycle management layer is required — not optional.

**Failure mode 3: No revocation registry.** AP2's normative MUSTs cover signing, hashing, and binding, but the specification does not yet mandate a revocation registry for compromised user keys or revoked Agent Provider attestations. GitHub issue #180 (March 17, 2026) on the AP2 repository proposes restricting IntentMandate visibility to the User ↔ Shopping Agent boundary, partly to bound the blast radius if a Shopping Agent is later found to have been compromised.[^21] Without revocation, a compromised Agent Provider key can sign closed Mandates against open Mandates that pre-date the compromise, and the cryptographic chain still validates. The settled-architecture answer (per the policy-engine literature) is short-lived task-scoped capability tokens that expire when the task ends — but the AP2 spec does not yet require this on its own.

## 9. Compliance posture

The Trust Layer is not just an engineering pattern; it's an audit posture. Three regulatory frameworks now bear on the design.

**EU AI Act.** Frank's April 2026 IDP architecture survey identifies the eight requirements that affect platform architecture: documentation of AI system purpose, human oversight mechanisms, audit trail with timestamps, ability to shut down the system, deprovisioning evidence, access controls and least privilege, request-level events to immutable storage, and identity records for human accountability.[^22] Each maps to a specific PEP/PDP architectural decision: agent registration manifest, owner identity field, request-level events to immutable storage, kill switch + circuit breakers, expiry policy, GitOps commit trail.[^22]

**NIST AI RMF.** The reasoning-trace and decision-log requirements that fall out of the PEP/PDP architecture are the same artifacts NIST AI RMF expects for "manage-trace" controls: every PDP call emits a decision log capturing principal, tool, arguments (redacted appropriately), policy version, decision, and reason.[^18] Those logs stream into the SIEM as structured policy-refusal events distinct from model refusal events — a spike in the former is a prompt-probing signal worth investigating.[^18]

**SOC 2 Type II for AI Agents.** The forcing function for adoption of out-of-process governance is rarely the engineering team — "it is the audit conversation,"[^18] as Tianpan put it. A regulator or enterprise procurement security review asks: "Can you prove that your AI agent, when handling a Tier-2 customer's request on March 14th, did not access data outside that customer's tenant?"[^18] If the answer involves reading model logs and gesturing at the YAML manifest, it is not an answer. The answer that lands is "here is the policy decision log for every tool call in that session, signed and tamper-evident, showing the policy version evaluated, the inputs, and the deny-or-allow decision."[^18] That answer requires PDP-in-the-loop and structured decision logs streaming to the audit pipeline.

## 10. The settled architecture, summarized

Putting the four layers together — Asymmetric Pivot, SD-JWT+KB, Mandate chain, PEP/PDP — produces the architecture B2A is converging on by mid-2026:

1. **At enrollment**: User provisions a hardware-backed key (`user_sk`); Agent Provider provisions agent keys (`agent_sk`). All keys are P-256 / ES256 capable.
2. **At delegation (open)**: User signs open Checkout + open Payment Mandates with constraints, includes `agent_pk` in `cnf` claim, sets short `exp`.
3. **At task time (closed)**: Agent receives merchant-signed `checkout_jwt`, signs closed Mandates with `agent_sk`, includes `sd_hash` and `checkout_hash` to chain to open Mandate and merchant Checkout.
4. **At each tool call**: Agent runtime PEP calls out-of-process PDP (OPA / Cedar / Authorization Fabric) with principal + actor + tool + args; PDP returns ALLOW/DENY/REQUIRE_APPROVAL/MASK.
5. **At verification**: Merchant + Credential Provider + Payment Processor each independently verify cryptographic chain *and* evaluate constraints.
6. **At audit**: PDP decision logs stream to SIEM; closed Mandates are stored with their open Mandates and Receipts as a tuple.

The architecture is not new — it borrows from XACML, OAuth2, and decade-old IAM literature — but the agent-payment vertical is the first place where the cryptographic, protocol, and policy layers are all in production at the same time.

## 11. What this paper does not cover

This paper deliberately stops short of: the full details of the Universal Commerce Protocol (UCP) extension that places AP2 mandates inside checkout requests;[^8] the BBS+ anonymous-credential proposal in AP2 issue #120 for IntentMandate identity privacy;[^21] the OpenID4VP delegation flow for Agent-to-Agent mandate handoff (the AP2 spec marks Agent-to-Agent Delegation as outside the current spec scope);[^7] hardware-attestation strategies for `user_sk` key provisioning across iOS Secure Enclave, Android StrongBox, and TPM-backed Windows Hello; and the OWASP-mapped specifics of the 10 agentic AI risks Microsoft AGT addresses.[^22]

The next paper in this thread will dive into the revocation-registry gap — what a production-grade revocation surface would have to look like for AP2 to clear the SOC 2 Type II audit conversation cleanly — because that is the largest remaining cryptographic gap in the protocol as it stands.

---

## References

[^1]: IETF. "RFC 9901: Selective Disclosure for JSON Web Tokens." November 2025. https://www.rfc-editor.org/rfc/rfc9901
[^2]: Google. "AP2 protocol GitHub repository specification." Accessed May 2026. https://github.com/google-agentic-commerce/AP2/blob/main/docs/specification.md
[^3]: Microsoft. "Authorization and Governance for AI Agents: Runtime Authorization Beyond Identity at Scale." Microsoft Community Hub. Accessed May 2026. https://techcommunity.microsoft.com/blog/microsoft-security-blog/authorization-and-governance-for-ai-agents-runtime-authorization-beyond-identity/4509161
[^4]: Cordum. "In-Process vs Out-of-Process AI Agent Governance (2026)." May 1, 2026. https://cordum.io/blog/in-process-vs-out-of-process-ai-agent-governance
[^5]: Google. "AP2 Security and Privacy Considerations." Accessed May 2026. https://ap2-protocol.org/ap2/security_and_privacy_considerations/
[^6]: Google. "Agent Payments Protocol — AP2 Specification." Accessed May 2026. https://ap2-protocol.org/ap2/specification/
[^7]: Google. "AP2 Specification (Verification rules)." Accessed May 2026. https://ap2-protocol.org/ap2/specification/
[^8]: Universal Commerce Protocol. "AP2 Mandates Extension v2026-04-08." April 8, 2026. http://ucp.dev/2026-04-08/specification/ap2-mandates/
[^9]: IETF Datatracker. "Selective Disclosure for JWTs (SD-JWT) draft-22." Accessed May 2026. https://datatracker.ietf.org/doc/draft-ietf-oauth-selective-disclosure-jwt/22/
[^10]: IETF Datatracker. "draft-ietf-oauth-selective-disclosure-jwt-17." Accessed May 2026. https://datatracker.ietf.org/doc/draft-ietf-oauth-selective-disclosure-jwt/17/
[^11]: IETF Datatracker. "draft-ietf-oauth-selective-disclosure-jwt-12." Accessed May 2026. https://datatracker.ietf.org/doc/draft-ietf-oauth-selective-disclosure-jwt/12/
[^12]: IETF OAuth WG. "oauth-selective-disclosure-jwt repository implementations list." Accessed May 2026. https://github.com/oauth-wg/oauth-selective-disclosure-jwt
[^13]: Google. "AP2 Trust Anchors: Verifiable Digital Credentials & Mandates." GitHub specification.md. Accessed May 2026. https://github.com/google-agentic-commerce/AP2/blob/main/docs/specification.md
[^14]: Google. "Checkout Mandate." Accessed May 2026. https://ap2-protocol.org/ap2/checkout_mandate/
[^15]: Google. "Payment Mandate." Accessed May 2026. https://ap2-protocol.org/ap2/payment_mandate/
[^16]: Google. "AP2 Security and Privacy Considerations (open/closed mandate binding rules)." Accessed May 2026. https://ap2-protocol.org/ap2/security_and_privacy_considerations/
[^17]: Google. "AP2 Flows." Accessed May 2026. https://ap2-protocol.org/ap2/flows/
[^18]: Practitioner blog — Tianpan Pan. "Policy-as-Code for Agents: OPA, Rego, and the Decision Point Your Tool Loop Doesn't Have." April 25, 2026. https://tianpan.co/blog/2026-04-25-policy-as-code-agent-permissions-opa-rego
[^19]: Zylos Research. "Deterministic Governance in AI Agent Systems." March 11, 2026. https://zylos.ai/research/2026-03-11-deterministic-governance-ai-agent-systems
[^20]: Zylos Research. "Policy Engines for AI Agent Governance: Rule-Based and Hybrid Approaches." March 14, 2026. https://zylos.ai/research/2026-03-14-policy-engines-ai-agent-governance
[^21]: AP2 GitHub Issues. "Restrict IntentMandate Visibility to User ↔ Shopping Agent Boundary (Issue #180)." March 17, 2026. https://github.com/google-agentic-commerce/AP2/issues/180
[^22]: Practitioner blog — Frank (AppxLab). "AI Agents in IDP: A Platform Engineer's Blueprint." April 15, 2026. https://blog.appxlab.io/2026/04/15/ai-agents-idp-governance/

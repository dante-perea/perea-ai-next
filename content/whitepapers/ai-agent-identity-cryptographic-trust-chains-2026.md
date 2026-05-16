---
title: "AI Agent Identity and Cryptographic Trust Chains 2026"
subtitle: "How IETF, W3C, and NIST Are Racing to Solve the Hardest Problem in Agentic AI Security"
publication: "Perea Research"
authors:
  - "Perea Research Engine"
version: "1.0.0"
status: "canon"
date: "2026-05-28"
dateModified: "2026-05-28"
audience:
  primary: "Enterprise security architects, CISOs, IAM engineers deploying or evaluating agentic AI systems"
  secondary: "AI platform engineers, DevSecOps teams, identity standards practitioners"
  tertiary: "Policy analysts, venture investors tracking AI infrastructure"
profile: "authority-survey"
description: >
  A comprehensive authority survey of the 2025–2026 standards explosion in AI agent identity
  and cryptographic trust chains. Covers eight IETF Internet-Drafts, W3C VC 2.0 and DID 1.1,
  NIST NCCoE guidance, and peer-reviewed research. Maps the fundamental identity gap left by
  OAuth/OIDC/SAML, the delegation chain problem, hardware anchoring approaches, Zero Trust
  frameworks, and the governance coverage gap. Provides practitioners with a decision framework
  for selecting identity primitives in 2026.
keywords:
  - "AI agent identity"
  - "cryptographic trust chains"
  - "IETF agent identity"
  - "delegation chain"
  - "verifiable credentials"
  - "decentralized identifiers"
  - "non-human identity"
  - "zero trust agentic AI"
  - "SPIFFE SPIRE"
  - "agent PKI"
  - "human delegation provenance"
  - "multi-agent security"
  - "MCP authentication"
  - "A2A protocol security"
  - "agent session smuggling"
license: "© 2026 Perea Research. All rights reserved."
---

## Executive Summary

The year 2025 marked an inflection point in enterprise AI security: autonomous agents began executing multi-step workflows, calling external APIs, managing financial transactions, and spawning sub-agents — all without the identity infrastructure to prove who authorized them to do so. The response from the standards community has been extraordinary. Eight distinct IETF Internet-Drafts addressing AI agent identity appeared between February and April 2026 alone[^3][^4][^5][^6][^7][^8][^9][^10] — more concentrated standards activity than the prior decade of machine identity work combined.

The core problem is structural, not configurational. OAuth 2.0, OpenID Connect, and SAML were designed for human users authenticating to services and for static machines with stable identities. They have no native model for the multi-hop delegation chains that define agentic AI: a human authorizes an orchestrator, which delegates to a sub-agent, which calls a tool, which spawns another agent. At each hop, the question "was this genuinely authorized by the human principal?" becomes harder to answer — and the consequences of getting it wrong grow more severe.[^14][^15]

The emerging cryptographic consensus is clear: Ed25519 signatures, JSON Web Tokens, W3C Decentralized Identifiers, and Verifiable Credentials have become the near-universal building blocks across all proposed frameworks.[^1][^2][^3][^6][^7] What remains contested is the architecture layered on top — how delegation chains are structured, how revocation propagates, how hardware attestation is anchored, and how governance is enforced at scale.

The governance gap is the most alarming finding in the current research landscape. A 2026 study of enterprise AI deployments found that 82% of organizations report confidence in their AI agent governance — yet only 47.1% have actual monitoring coverage in place.[^15] That 34.9 percentage point gap, combined with a 144:1 ratio of non-human identities to human identities in enterprise environments[^15] and the fact that only 21.9% of organizations treat agents as independent identity principals[^15], represents the largest unaddressed risk in enterprise AI deployment today.

This paper surveys the full landscape: the identity gap left by legacy protocols, the cryptographic primitives achieving consensus, the eight IETF drafts and their competing visions, the delegation chain problem that remains unsolved at production scale, hardware anchoring and Zero Trust approaches, the documented attack surface, the governance coverage gap, a practitioner decision framework, and the outlook for convergence by 2027.

---

## The Identity Gap: Why OAuth, OIDC, and SAML Fail Autonomous Agents

### The Architecture of the Problem

To understand why existing identity protocols fail for autonomous agents, it helps to understand what they were designed for. OAuth 2.0 (RFC 6749) was designed to allow a user to grant a third-party application limited access to their resources without sharing credentials. OpenID Connect layered identity assertions on top of OAuth 2.0, enabling single sign-on for human users. SAML 2.0 provided XML-based assertions for enterprise federation, binding identity to synchronous browser-based sessions.

All three protocols share a foundational assumption: there is a human at the origin of every authentication event, and that human is present (or recently was) to authorize the flow. This assumption breaks down completely in agentic AI systems, where a single human authorization event may trigger hundreds of downstream agent actions over hours or days, across organizational boundaries, with no human in the loop.[^14]

A 2025 analysis by researchers from the Cloud Security Alliance and MIT identified six specific dimensions where the mismatch between OAuth/OIDC/SAML and multi-agent system requirements is structural rather than configurational[^14]:

1. **Coarse-grained permissions:** OAuth scopes are designed for broad resource categories (read:email, write:calendar). Agentic systems require fine-grained, context-aware permissions that can express "authorized to send emails only to addresses in the approved list, only during business hours, only for topics related to the original task."

2. **Single-entity focus:** OAuth's authorization model assumes one client acting on behalf of one user. Multi-agent systems involve chains of principals — orchestrators, sub-agents, tools, external services — each of which may need to prove its authorization independently.

3. **Lack of context-awareness:** OAuth tokens carry no information about the context in which they were issued — what task the agent is performing, what the human's original intent was, or what constraints should apply to downstream actions.

4. **Scalability:** OAuth's authorization server becomes a bottleneck when thousands of ephemeral agents need to authenticate simultaneously. The protocol was not designed for the enrollment and revocation patterns of agent fleets.

5. **Dynamic trust:** OAuth assumes relatively stable trust relationships. Agentic systems require dynamic trust that can adapt to changing risk signals — an agent that has been behaving normally for an hour may suddenly exhibit anomalous behavior requiring immediate privilege reduction.

6. **NHI proliferation:** The 144:1 ratio of non-human identities to human identities in enterprise environments[^15] means that traditional identity governance processes — designed for human-scale enrollment, review, and offboarding — cannot scale to agent fleets without fundamental architectural changes.

### The Shared Bearer Token Problem

The most acute manifestation of the identity gap is what Clawdentity's author calls the "shared bearer token problem."[^3] In current multi-agent deployments, the dominant pattern is for an orchestrator to receive an OAuth access token and pass it — or a copy of it — to sub-agents as they are spawned. This creates a single point of compromise: one stolen token grants full access to all downstream agents in the chain.

Bearer tokens are, by design, unforgeable but freely transferable. Any party in possession of a valid bearer token can use it. In a multi-agent system where tokens are passed between agents, the attack surface expands with every hop. A compromised sub-agent, a malicious tool, or a prompt injection attack that convinces an agent to exfiltrate its token can grant an attacker the full capabilities of the original authorization.

The solution — binding tokens to specific cryptographic keys so that possession of the token alone is insufficient — is the core insight behind DPoP (RFC 9449, Demonstrating Proof of Possession)[^6] and the various per-agent identity schemes proposed in the IETF drafts. But retrofitting proof-of-possession onto existing OAuth deployments requires significant infrastructure changes that most enterprises have not yet made.

### NIST NCCoE's Response

The US government's recognition of the identity gap came in February 2026, when NIST's National Cybersecurity Center of Excellence published a concept paper launching the Cybersecurity for AI Identity and Software Integrity (CAISI) initiative.[^16] The paper identified five focus areas for AI agent identity management: agent authentication, zero-trust authorization, non-repudiation, prompt injection controls, and governance. CAISI represents the first US government initiative specifically targeting AI agent identity and authorization standards — a signal that the problem has moved from academic concern to policy priority.

---

## Cryptographic Primitives: The Emerging Consensus

### Ed25519: The Universal Signing Algorithm

Across all eight IETF Internet-Drafts, one cryptographic choice appears with near-universal consistency: Ed25519, the Edwards-curve Digital Signature Algorithm over Curve25519. Clawdentity uses Ed25519 for per-agent key pairs[^3]; APS uses Ed25519 for agent passports[^4]; AIP v0.3 uses Ed25519 throughout its six-layer architecture[^6]; APKI uses Ed25519 as the default signing algorithm for agent certificates[^7]; HDP uses Ed25519 for delegation chain signatures[^10][^11]; AgentDID uses Ed25519 for DID-based authentication[^12].

The convergence on Ed25519 is not accidental. The algorithm offers a combination of properties that make it ideal for high-throughput multi-agent systems: fast key generation (microseconds), small key size (32 bytes public, 64 bytes private), fast signing and verification, resistance to side-channel attacks, and deterministic signatures that eliminate the randomness-related vulnerabilities of ECDSA. Critically, Ed25519 public keys are sufficient for offline verification — no registry lookups, no certificate chain validation, no network round-trips required.[^11] In a system where thousands of agents may be verifying each other's signatures simultaneously, this property is essential for performance.

### DPoP: Binding Tokens to Keys

RFC 9449 (DPoP — Demonstrating Proof of Possession) has emerged as the standard mechanism for binding OAuth access tokens to specific cryptographic keys, preventing token theft and replay attacks.[^6] DPoP works by requiring the client to generate a key pair and include a signed proof-of-possession JWT with each token request and API call. The authorization server binds the issued token to the client's public key; any party attempting to use the token without the corresponding private key will fail verification.

AIP v0.3 adopts DPoP for sensitive scopes, requiring proof-of-possession for any operation that modifies state, transfers value, or accesses regulated data.[^6] This creates a meaningful security boundary: even if an agent's access token is exfiltrated, it cannot be used without the private key that was bound to it at issuance.

### W3C Verifiable Credentials 2.0

W3C Verifiable Credentials 2.0 became a full W3C Recommendation on May 15, 2025[^1] — the first cryptographic credential standard explicitly designed for machine-verifiable, privacy-respecting attestations. VCs provide the credential layer for agent identity: a cryptographically signed, tamper-evident document that makes claims about a subject (an agent, a model, a capability) and can be verified by any party with access to the issuer's public key.

The key properties of VC 2.0 that make it suitable for agent identity are: selective disclosure (an agent can prove specific claims without revealing its full credential), verifiable presentations (multiple credentials can be combined into a single presentation), extensibility via JSON-LD (new claim types can be defined without breaking existing verifiers), and support for multiple proof formats including Ed25519Signature2020 and BBS+ for zero-knowledge proofs.

### W3C DIDs v1.1

W3C Decentralized Identifiers v1.1 (Working Draft, April 2025)[^2] provide the identifier layer: globally unique, persistent identifiers that are decoupled from centralized registries and resolvable to DID Documents containing cryptographic material and service endpoints. DIDs can identify any subject — including AI agents — and their resolution mechanism is pluggable, supporting blockchain-based, DNS-based, and peer-to-peer DID methods.

The combination of DIDs and VCs provides a complete identity layer for agents: the DID is the stable identifier, the DID Document contains the agent's current public keys and service endpoints, and VCs provide verifiable claims about the agent's capabilities, provenance, and authorization. This combination is adopted by AIP v0.3[^6], AgentDID[^12], and the TU Berlin framework[^13].

### Post-Quantum Readiness

APKI (Agent PKI) is the only current IETF draft to explicitly address post-quantum cryptography, proposing ML-DSA-65 (CRYSTALS-Dilithium, NIST PQC standard) as a migration path for long-lived agent identities.[^7] The draft's primary defense against key compromise, however, is not post-quantum algorithms but short-lived certificates: APKI's default certificate lifetime is one hour, meaning that even if a key is compromised, the window of exploitation is narrow. This "short-lived certificates as security primitive" approach is also adopted by Evertrust[^27] and aligns with the SPIFFE/SPIRE model of continuously rotated SVIDs.[^17]

AgentDID's blockchain-based implementation on Ethereum Sepolia testnet demonstrates the scalability of DID-based approaches: DID registration costs under $1 USD, and throughput scales linearly from 0.07 TPS at 1v1 agent scale to 3.25 TPS at 50v50 agent scale.[^12] While these numbers are modest compared to enterprise PKI throughput, they establish the feasibility of decentralized agent identity at small-to-medium scale.

---

## The IETF Standards Explosion: Eight Drafts, Eight Visions

The period from February to April 2026 saw an unprecedented concentration of IETF Internet-Draft activity on AI agent identity. Eight distinct drafts were published in roughly ten weeks, each proposing a different architectural vision. This section surveys each draft's core contribution and distinguishing design choices.

### Clawdentity (February 2026)

Clawdentity[^3], authored by Ravi Kiran Vemula of CAW (Hyderabad), is the earliest of the 2026 drafts and the most focused on solving the shared bearer token problem. Its core innovation is the "Claw" HTTP authentication scheme: a per-request proof-of-possession mechanism that requires each agent to sign every HTTP request with its private key, making token theft useless without the corresponding key.

The protocol assigns each agent a unique Ed25519 identity at registration, issues Agent Identity Tokens (AITs) from a registry, and establishes bilateral trust between agents via "pairing ceremonies" — a mutual authentication handshake that creates a shared trust context without shared secrets. Agents communicate over authenticated WebSocket connections with certificate revocation support.

Clawdentity's human-anchored trust model is explicit: agents cannot self-certify. All agent identities must be issued by a registry that is ultimately anchored to human authorization. The `did:cdi` DID method provides a stable identifier for each agent that persists across key rotations. Selective revocation — the ability to revoke one agent's credentials without rotating shared tokens — is a key operational advantage over bearer-token-based systems.

### Agent Passport System (March 2026)

APS[^4], authored by Tymofii Pidlisnyi of AEOESS, is the most mathematically rigorous of the IETF drafts. Its central contribution is modeling authority as a product lattice: delegation is a monotone function, meaning capabilities can only attenuate (narrow) as they pass down the delegation chain — they can never amplify. This is a mathematical guarantee against privilege escalation, not merely a policy assertion.

The lattice has seven constraint dimensions: scope (what actions are permitted), spend (financial limits), depth (how many further delegations are allowed), time (validity window), reputation (minimum trust score required), values (ethical constraints), and reversibility (whether actions can be undone). Each delegation must be a subset of the parent delegation across all seven dimensions simultaneously.

APS implements cascade revocation: revoking a parent delegation automatically invalidates all child delegations across the entire authority lattice. A three-signature policy chain (intent signature, evaluation signature, receipt signature) provides non-repudiation at each delegation step. Bayesian reputation scoring gates authority: agents with low reputation scores cannot receive high-authority delegations regardless of what the delegating agent authorizes.

The APS TypeScript and Python SDKs, published to npm on February 22, 2026, with 1,634 tests, represent the most production-ready implementation of any IETF agent identity draft.[^4] The draft explicitly addresses MCP and A2A authentication gaps, positioning APS as a drop-in authorization layer for existing agentic frameworks.

### Agent Identity Protocol v0.3 (April 2026)

AIP v0.3[^6], authored by Paras Singla, is the most architecturally comprehensive of the IETF drafts. Its six-layer architecture — identity layer (DIDs), principal chain layer (delegation), capabilities layer (authorization), credential token layer (JWT/DPoP), revocation layer, and reputation layer — attempts to provide a complete end-to-end solution for agent identity from issuance through audit.

AIP's most distinctive feature is Approval Envelopes: pre-authorized multi-step workflows where the human signs once, and the envelope cryptographically constrains all downstream agent actions. An Approval Envelope specifies the permitted action sequence, the allowed tools, the spend limits, the time window, and the revocation conditions. Agents executing within an Approval Envelope cannot deviate from its constraints without cryptographic evidence of the deviation — enabling after-the-fact audit even if the agent is compromised.

AIP v0.3 adopts SAGA compensation semantics for long-running workflows: if a multi-step agent workflow fails partway through, the SAGA pattern provides a structured mechanism for compensating (undoing) completed steps. This is a significant operational improvement over current systems where failed agent workflows may leave partial state changes with no rollback mechanism.

The draft satisfies NIST SP 800-207 (Zero Trust Architecture) and SP 800-63-4 (Digital Identity Guidelines, AAL2), making it suitable for regulated environments. MCP token exchange is handled via RFC 8693 (OAuth 2.0 Token Exchange), providing a standards-based integration path for existing MCP deployments.[^6]

### Agent PKI (April 2026)

APKI[^7], authored by Raza Sharif of CyberSecAI Ltd (London), takes a PKI-first approach: rather than designing a new identity system, it extends the existing X.509v3 certificate infrastructure with five agent-specific extensions. This design choice makes APKI the most compatible with existing enterprise PKI deployments — organizations with established certificate authorities can extend their infrastructure to issue agent certificates without replacing it.

The five extensions are: **AgentTrustScore** (a 0–100 graduated trust score with time-based decay, enabling trust to degrade if an agent has not been recently attested); **AgentCapabilities** (tool URIs, spend limits, rate limits — encoding what the agent is authorized to do directly in the certificate); **AgentDelegation** (the monotonic attenuation invariant and cascade revocation pointer); **AgentProvenance** (model family, version, and framework — enabling auditors to identify which AI model is behind a given agent identity); and **AgentBehaviouralAttestation** (ranging from self-declared to hardware-bound, providing a graduated attestation model).

APKI's Agent Transparency Logs, modeled on Certificate Transparency (RFC 9162)[^7], provide the audit infrastructure needed for regulatory compliance: every certificate issuance, renewal, and revocation is published to an append-only, publicly auditable log. The `agent://` URI scheme provides a human-readable identifier for agent certificates. APKI is explicitly compatible with SPIFFE and WIMSE, enabling integration with existing workload identity infrastructure.

### Warrant Certificate Authorities (March 2026)

WCA[^8], authored by Roman Bondar, addresses a problem that the other drafts largely ignore: semantic laundering. In multi-agent systems, data that crosses trusted tool-call boundaries can acquire unwarranted credibility — a piece of information retrieved from an untrusted external source may be treated as authoritative simply because it passed through a trusted agent's tool call. WCA addresses this by certifying data sources rather than data content.

The Warrant Attestation Level (WAL) system provides four levels of source certification: WAL-0 (unverified), WAL-1 (agent-attested), WAL-2 (operator-verified), and WAL-3 (hardware-anchored). Each tool call in an agent chain carries a WAL certificate indicating the trustworthiness of its data sources. Downstream agents can inspect WAL levels and refuse to act on data below a required threshold.

WCA's non-interference requirement is its most important security property: an agent cannot issue its own warrant attestations. This prevents the semantic laundering attack where a compromised agent certifies its own malicious outputs as trustworthy. The TLA+ formal verification of WCA's non-interference model explored 286 states with zero self-licensing violations[^8] — the first formally verified anti-semantic-laundering mechanism in the agent identity literature.

### Agent Delegation Receipts (April 2026)

DRP v02[^9], authored by Ryan Nelson of Authproof, takes the most radical approach to the delegation chain problem: it removes the operator as a trusted third party entirely. In DRP, the user's private key is the sole signing authority for delegation receipts. The operator cannot issue, modify, or revoke delegations on the user's behalf — only the user can.

DRP's Authorization Object binds scope, action boundaries, time window, operator instruction hash, and model state commitment into a single signed document. This document is published to an append-only log before the agent runtime receives control — creating an immutable record of what the user authorized before any agent action occurs. If the agent's actual behavior deviates from the Authorization Object, the deviation is cryptographically provable.

The Scope Discovery Protocol is DRP's most innovative feature: rather than requiring users to manually specify scopes (which most users cannot do accurately), DRP sandboxes the agent in a simulated environment and observes its behavior to derive the minimal scope required for the task. This "behavioral scope derivation" approach addresses the least-privilege problem without requiring users to understand OAuth scopes.

DRP supports TEE enforcement via Intel TDX and AMD SEV-SNP, enabling hardware-backed guarantees that the agent runtime cannot modify its own Authorization Object. eBPF LSM kernel-level enforcement provides an additional layer of protection for deployments without TEE hardware.[^9]

### Human Delegation Provenance Protocol (March 2026)

HDP[^10][^11], authored by Asiri Dalugoda et al. of Helixar Limited, focuses on a single, well-defined problem: cryptographically capturing the human authorization context in multi-agent systems and propagating it through the delegation chain. Unlike the more comprehensive frameworks (AIP, APS), HDP is deliberately lightweight — it is designed to be layered on top of any existing identity framework rather than replacing it.

An HDP token binds the human authorization event (who authorized, what they authorized, when, and under what conditions) to the session. As the delegation chain grows — orchestrator spawns sub-agent, sub-agent calls tool, tool spawns another agent — each hop adds a signed record to an append-only chain. The chain can be verified fully offline, with no registry lookups or third-party trust anchors required.[^11]

HDP's offline verification property is its key differentiator. In high-throughput multi-agent systems where thousands of agents may be verifying each other's delegation chains simultaneously, the ability to verify without network round-trips is essential for performance. The TypeScript SDK is publicly available, and the companion arXiv paper[^11] provides formal proofs of the protocol's security properties.

### Agent Identity Registry (April 2026)

The Agent Identity Registry draft[^5], authored by Christopher Drake of 1id.com, proposes a federated registry architecture modeled on DNS. A three-tier hierarchy — Agent Identity Authority (AIA) at the root, Registry Operators at the second tier, and Registrars at the third tier — mirrors the DNS delegation model, enabling decentralized governance while maintaining global uniqueness.

The registry's most distinctive feature is hardware anchoring: each registered agent identity must be backed by a hardware security device — TPM 2.0, PIV smart card, secure enclave, virtual TPM, or (at the lowest trust tier) a software key. The five trust tiers (sovereign, portable, enclave, virtual, declared) provide a graduated trust model that matches the deployment context. Anti-Sybil enforcement is hardware-based: one hardware device per identity, preventing one actor from registering multiple agent identities.

The registry issues standard OIDC/OAuth2 tokens, making it compatible with existing enterprise identity infrastructure. Agent identifiers use a URN format (`urn:aid:namespace:agent-id`) with self-sovereign namespaces via reverse-DNS. The beta implementation at 1id.com has 20+ enrolled identities — the only hardware-anchored agent identity system with live production deployment as of mid-2026.[^5]

### ACME Extension for Scalable Agent Enrollment (2026)

The eighth draft[^35], authored by Jerry Huang, extends the ACME protocol (RFC 8555 — the standard used by Let's Encrypt for automated certificate management) to support scalable AI agent certificate enrollment. The extension enables zero-touch PKI for agent fleets: agents can automatically enroll, renew, and revoke certificates without human intervention, using the same ACME infrastructure already deployed for web server certificates. This draft is the most conservative of the eight — it extends existing infrastructure rather than proposing new architecture — and may prove to be the most widely adopted as a result.

---

## The Delegation Chain Problem: The Hardest Unsolved Challenge

### Why Delegation Chains Are Hard

The delegation chain problem is the defining unsolved challenge of agentic AI security: how do you verify that a terminal action in a multi-agent chain — a financial transaction, a data deletion, an email sent to a customer — was genuinely authorized by the human principal who initiated the chain, without requiring synchronous human confirmation at each hop?

The difficulty is not cryptographic. Signing each delegation step with Ed25519 is straightforward. The difficulty is semantic: what does it mean for an action to be "authorized" when the human who initiated the chain could not have anticipated the specific action being taken? A user who authorizes an agent to "book travel for my conference trip" has not explicitly authorized the agent to book a non-refundable business-class ticket — but a sufficiently capable agent might conclude that this is within the spirit of the authorization.

This semantic gap between explicit authorization and implied authorization is what makes the delegation chain problem hard. Cryptographic signatures can prove that each hop in the chain was authorized by the previous hop. They cannot prove that the terminal action was within the scope of what the human actually intended.[^15]

### Competing Solutions

The four IETF drafts that most directly address the delegation chain problem — HDP, APS, AIP, and DRP — each take a different approach to this semantic gap.

**HDP** takes the minimalist approach: capture the human authorization event cryptographically and propagate it through the chain. HDP does not attempt to verify semantic alignment; it provides the audit trail that enables after-the-fact determination of whether the terminal action was within scope.[^10][^11]

**APS** takes the mathematical approach: model authority as a product lattice with monotonic narrowing. If the delegation chain is correctly implemented, the terminal action's authority is provably a subset of the human's original authorization across all seven constraint dimensions.[^4] The challenge is that translating human intent into a seven-dimensional authority lattice requires significant upfront specification work.

**AIP** takes the workflow approach: Approval Envelopes pre-specify the permitted action sequence, constraining the agent's behavior before it begins. This works well for predictable workflows but is less suitable for open-ended tasks where the action sequence cannot be specified in advance.[^6]

**DRP** takes the user-sovereignty approach: the user signs the Authorization Object directly, removing the operator as a trusted intermediary. DRP's Scope Discovery Protocol attempts to bridge the semantic gap by deriving scope from observed behavior rather than requiring explicit specification.[^9]

### The Cascade Revocation Gap

A critical safety property that most current systems lack is cascade revocation: the ability to revoke a delegation and automatically invalidate all downstream delegations derived from it. If an orchestrator agent is compromised, its credentials should be revocable in a way that immediately invalidates all sub-agent credentials derived from its authority.

APS implements cascade revocation via its authority lattice: revoking a node in the lattice automatically invalidates all child nodes.[^4] DRP implements cascade revocation via its append-only log: a revocation entry in the log invalidates all Authorization Objects derived from the revoked delegation.[^9] HDP and AIP do not currently specify cascade revocation mechanisms, leaving this as an implementation concern.

The TU Berlin research group's evaluation of LLM-based agent identity frameworks found a fundamental limitation: when the LLM is in sole charge of security procedures, the system is vulnerable to adversarial manipulation of the LLM itself.[^13] This finding reinforces the consensus that human-anchored trust — cryptographic proof that a human authorized the delegation chain — is a hard requirement, not an optional enhancement.

### Production Deployment Gap

As of mid-2026, no delegation chain protocol has achieved production deployment at scale. The Agent Identity Registry's 20+ enrolled identities[^5] and the APS npm package's 1,634 tests[^4] represent the most advanced implementations, but neither has been deployed in a production multi-agent system handling real-world workloads at enterprise scale. The gap between the richness of the standards proposals and the poverty of production deployments is the most significant finding of this survey.

---

## Hardware Anchoring and Zero Trust: From Principles to Production

### The Hardware Anchoring Imperative

Hardware anchoring — binding agent identity to a physical security device that cannot be cloned or extracted — provides the strongest available defense against Sybil attacks (one actor registering multiple agent identities) and key compromise. The Agent Identity Registry's five trust tiers[^5] provide a useful taxonomy:

- **Sovereign (TPM 2.0):** The highest trust tier. The agent's private key is generated and stored in a hardware TPM that cannot be extracted. Suitable for long-lived, high-authority agents in regulated environments.
- **Portable (PIV smart card):** High trust, portable. The agent's key is stored on a PIV-compliant smart card. Suitable for agents that need to operate across multiple physical systems.
- **Enclave (secure enclave):** High trust, software-accessible. The agent's key is stored in a hardware secure enclave (Intel SGX, ARM TrustZone). Suitable for cloud-deployed agents with hardware attestation requirements.
- **Virtual (vTPM):** Medium trust. The agent's key is stored in a virtual TPM provided by the hypervisor. Suitable for VM-based agent deployments in trusted cloud environments.
- **Declared (software key):** Lowest trust. The agent's key is stored in software. Suitable for development and low-risk deployments.

APKI's AgentBehaviouralAttestation extension[^7] maps to these tiers, enabling certificate verifiers to determine the hardware backing of an agent's identity from the certificate itself. This graduated trust model is essential for enterprise deployments where different agents have different risk profiles and different hardware capabilities.

### SPIFFE/SPIRE: The Workload Identity Foundation

SPIFFE (Secure Production Identity Framework for Everyone) and its reference implementation SPIRE provide cryptographic identity for workloads via SVIDs (SPIFFE Verifiable Identity Documents) — X.509 certificates or JWTs that encode a workload's identity as a URI.[^17] SPIRE implements workload attestation: before issuing an SVID, it verifies the workload's properties (process ID, container image hash, Kubernetes service account) against a policy.

SPIFFE/SPIRE is orthogonal to agent identity — it addresses workload identity (what process is running) rather than agent identity (what autonomous entity is acting) — but the two are composable. APKI explicitly supports SPIFFE integration[^7]; Keyfactor's PKI-based agent identity framework integrates SPIFFE for containerized agents[^20]; and Block has deployed the full SPIFFE + WIMSE + OAuth stack in production, demonstrating enterprise viability.[^17]

HashiCorp Vault 1.21 added native SPIFFE authentication, enabling agent fleets to obtain short-lived secrets without static credentials.[^17] This integration is significant: Vault is widely deployed in enterprise environments, and native SPIFFE support means that agent fleets can leverage existing secret management infrastructure without additional tooling.

### Enterprise Vendor Implementations

The enterprise vendor landscape has moved quickly to operationalize Zero Trust for agentic AI. Three implementations are particularly notable:

**Cisco's three-pillar framework**[^18] — Know every agent (NHI discovery and inventory), Authorize every action (least-privilege, intent-aware, time-bound authorization), Adapt to risk in real time (runtime guardrails and behavioral monitoring) — provides the most complete operational framework for enterprise AI agent security. Cisco AI Defense provides runtime protection against prompt injection, memory poisoning, and tool misuse.

**Microsoft Entra Agent ID**[^19], announced at Build 2025, assigns unique Entra identities to AI agents, enabling OAuth2-based authentication using existing enterprise identity infrastructure. The OIDC/JWT primitives enable cross-IdP federation: agents can authenticate across organizational boundaries using the same standards-based patterns as human users. The Azure AI Foundry implementation demonstrates practical integration with AutoGen multi-agent frameworks.

**Keyfactor's PKI-based approach**[^20] validates X.509 certificates for AI agent identity, with certificate-based OAuth flows anchoring tokens to client certificates and mutual TLS for agent-to-service and agent-to-agent communications. The HID Global PKI Survey (March 2026) found that 16% of enterprises are already issuing digital certificates to AI agents, and 34% cite AI agent certificates as their top PKI trend[^20] — evidence that PKI-based agent identity is moving from concept to production.

---

## The Attack Surface: Session Smuggling, Prompt Injection, and Identity Spoofing

### Agent Session Smuggling

In October 2025, Palo Alto Networks Unit 42 published a proof-of-concept demonstration of a new attack class: agent session smuggling.[^21] The attack exploits the A2A protocol's stateful session behavior to inject covert instructions into an established cross-agent communication session. Because the A2A protocol maintains session state across multiple turns, a malicious agent can inject instructions that appear to be continuations of a legitimate session rather than new, unauthorized commands.

The Unit 42 researchers demonstrated two proof-of-concept attacks: PoC 1 exfiltrated sensitive data (system prompts, chat history, tool schemas) from a target agent by injecting instructions into an established session; PoC 2 executed an unauthorized stock purchase by smuggling instructions through a trusted agent's session.[^21] Both attacks exploited a critical design flaw: agents are often designed to trust collaborating agents by default, without verifying the authenticity of messages within an established session.

The mitigations proposed by Unit 42 — human-in-the-loop confirmation for critical actions, cryptographically signed AgentCards, and context grounding — align with the identity frameworks surveyed in this paper. Cryptographically signed AgentCards (essentially agent identity certificates) would prevent the identity spoofing that enables session smuggling; DPoP-bound tokens would prevent token theft; and Approval Envelopes (AIP) would constrain the actions an agent can take regardless of what instructions it receives.

### Prompt Injection

OpenAI's March 2026 analysis of prompt injection attacks in agentic systems[^22] found that these attacks increasingly resemble social engineering: rather than exploiting technical vulnerabilities, they exploit the agent's tendency to follow instructions from authoritative-seeming sources. An agent that has been trained to be helpful and to follow user instructions can be manipulated by malicious content in its environment (a web page, a document, an email) that mimics the format of legitimate instructions.

OpenAI's "Safe Url" mechanism applies source-sink analysis to detect when information learned in conversation would be transmitted to a third party.[^22] When such transmission is detected, the mechanism either blocks it or requires explicit user confirmation. This approach — treating data exfiltration as the key harm to prevent rather than instruction injection per se — is a significant architectural insight. WCA's non-interference requirement[^8] provides a complementary defense: by preventing agents from self-certifying their data sources, WCA makes it harder for injected content to acquire the credibility needed to influence downstream agents.

### Identity Spoofing and Lateral Movement

Without cryptographic agent cards, identity spoofing in multi-agent systems is trivially easy: any agent can claim to be any other agent. The Unit 42 research found that agents are often designed to trust collaborating agents by default[^21] — a design choice that makes lateral movement attacks straightforward. A compromised agent can impersonate a trusted orchestrator, issue instructions to sub-agents, and exfiltrate data or execute unauthorized actions without triggering any authentication checks.

The combination of session smuggling, prompt injection, and identity spoofing creates a compound attack surface that no single mitigation addresses. Effective defense requires: cryptographic agent identity (to prevent spoofing), DPoP-bound tokens (to prevent token theft), Approval Envelopes or Authorization Objects (to constrain permitted actions), and behavioral monitoring (to detect anomalous behavior even when authentication succeeds). This defense-in-depth requirement is precisely what the IETF drafts are attempting to provide — but the gap between the standards proposals and current production deployments means that most enterprises are currently exposed.

---

## The Governance Gap: 82% Confidence, 47% Coverage

### The Numbers

The most alarming finding in the 2026 AI agent identity research landscape comes from a study by Otsuka, Toyoda, and Leung of the AI Frontier Technology (AIFT) group in Singapore.[^15] Their analysis of enterprise AI deployments found:

- **82%** of organizations report confidence in their AI agent governance frameworks
- **47.1%** have actual monitoring coverage in place
- **34.9 percentage points** — the gap between perceived and actual governance
- **144:1** — the ratio of non-human identities to human identities in enterprise environments
- **21.9%** — the fraction of organizations that treat agents as independent identity principals

These numbers tell a consistent story: enterprises believe they have AI agent governance under control, but the reality is that fewer than half have the monitoring infrastructure to know what their agents are actually doing. The 144:1 NHI-to-human ratio means that traditional identity governance processes — designed for human-scale enrollment, periodic review, and offboarding — cannot scale to agent fleets without fundamental architectural changes.

### The Five Critical Gaps

The AIFT Singapore study identified five critical gaps that remain unaddressed by any current standard[^15]:

1. **Semantic intent verification:** No current standard can verify that an agent's actions align with the human's original intent, as opposed to the literal scope of the authorization. An agent authorized to "manage my calendar" may take actions that are technically within scope but contrary to the user's intent.

2. **Recursive delegation accountability:** When delegation chains span multiple organizations (agent A at Company X delegates to agent B at Company Y, which delegates to agent C at Company Z), accountability for terminal actions is unclear. No current standard provides cross-organizational delegation accountability.

3. **Agent identity integrity:** The identity of an AI agent is not stable in the way that human identity is. An agent's behavior can change with model updates, fine-tuning, or prompt modifications. No current standard addresses the question of whether an agent with a given identity is still the "same" agent after a model update.

4. **Governance opacity:** Most current agent deployments provide no visibility into what agents are doing, what credentials they hold, or what delegations they have received. The 47.1% monitoring coverage figure reflects this opacity.

5. **Operational sustainability:** Managing the identity lifecycle of agent fleets — enrollment, rotation, revocation, audit — at the 144:1 NHI-to-human ratio requires automation that most enterprises have not yet built.

### Cross-Organizational Governance

For regulated industries — financial services, healthcare, government — the cross-organizational governance problem is particularly acute. Raidiam's work on OpenID Federation for agentic AI[^24] provides a practical path to federated trust establishment across organizational boundaries, using the same federation patterns already deployed in open banking (UK Open Banking, Brazil Open Finance). Okta's AI agent token exchange documentation[^25] provides an OAuth 2.0 integration path for enterprises with existing Okta deployments. INATBA's analysis of blockchain-based AI identity governance[^26] explores self-sovereign identity approaches for regulated industries.

The governance gap is ultimately a people and process problem as much as a technology problem. The technology to monitor agent behavior, audit delegation chains, and enforce least-privilege authorization exists — the IETF drafts surveyed in this paper provide the cryptographic foundations. What is missing is the organizational commitment to deploy and maintain this infrastructure at the scale required by modern agent fleets.

---

## Decision Framework: Choosing Identity Primitives in 2026

Given the proliferation of competing standards and the absence of a clear winner, practitioners face a genuine decision problem: which identity primitives should they adopt today? The following framework maps deployment context to recommended approaches.

### Path 1: Enterprises with Existing PKI Infrastructure

For enterprises with established certificate authorities and PKI tooling, **APKI + SPIFFE/SPIRE + short-lived X.509 certificates** is the lowest-friction path to agent identity. APKI's five X.509v3 extensions can be added to existing CA infrastructure without replacing it[^7]; SPIFFE/SPIRE provides workload attestation for containerized agents[^17]; and short-lived certificates (1-hour default) provide the primary defense against key compromise without requiring new revocation infrastructure.

Keyfactor's validated implementation[^20] demonstrates that this path is production-ready. The ACME extension draft[^35] provides automated certificate enrollment for ephemeral agent fleets, enabling zero-touch PKI at scale. Enterprises with Okta deployments can use Okta's AI agent token exchange[^25] as the OAuth integration layer.

### Path 2: Greenfield Multi-Agent Systems

For organizations building new multi-agent systems without legacy PKI constraints, **AIP v0.3 or APS** provide the most complete delegation chain semantics. AIP v0.3's six-layer architecture[^6] covers the full identity lifecycle from issuance through audit, with Approval Envelopes providing pre-authorized workflow constraints. APS's TypeScript/Python SDKs with 1,634 tests[^4] represent the most production-ready implementation, with explicit MCP and A2A integration.

The choice between AIP and APS depends on the workflow pattern: APS is better suited for structured workflows where the delegation lattice can be specified in advance; AIP is better suited for open-ended workflows where Approval Envelopes can constrain behavior without fully specifying the action sequence.

### Path 3: Regulated Environments Requiring Hardware Attestation

For regulated environments (financial services, healthcare, government) where hardware attestation is required, the **Agent Identity Registry (Drake) with TPM 2.0 anchoring**[^5] provides the strongest Sybil resistance. The registry's five trust tiers enable graduated trust based on hardware capability; the DNS-modeled hierarchy enables federated governance across organizational boundaries; and the OIDC/OAuth2 token issuance provides compatibility with existing enterprise identity infrastructure.

The beta implementation at 1id.com[^5] is the only hardware-anchored agent identity system with live production deployment as of mid-2026 — a significant advantage for regulated environments that require demonstrated production viability before adoption.

### Path 4: Cross-Organizational Agent Federation

For deployments spanning multiple organizations — supply chain agents, financial services ecosystems, healthcare networks — **OpenID Federation + W3C VC 2.0 + DID-based identifiers** provide the most interoperable foundation. Raidiam's OpenID Federation patterns[^24] are already deployed in open banking ecosystems; W3C VC 2.0[^1] provides the credential layer; and DIDs[^2] provide stable, organization-independent identifiers.

Microsoft Entra Agent ID's OIDC/JWT primitives[^19] enable cross-IdP federation using existing enterprise identity infrastructure, making this path accessible to organizations already in the Microsoft ecosystem.

### Universal Layer: Human Delegation Provenance

Regardless of which primary identity framework is chosen, **HDP or DRP should be layered on top** to provide human delegation provenance — the cryptographic proof that terminal actions were authorized by a human principal. This is the one property that no other standard addresses, and it is the property most likely to be required by regulators as AI agent governance frameworks mature.

HDP[^10][^11] is the lighter-weight option, designed to be layered on any existing framework with minimal integration effort. DRP[^9] provides stronger user sovereignty (the user's private key is the sole signing authority) but requires more significant infrastructure changes. For most enterprises, HDP is the practical starting point.

---

## Outlook: Convergence, Consolidation, and What Comes Next

### The Consolidation Trajectory

The 2025–2026 standards explosion will not persist indefinitely. Historical precedent from other identity standards (SAML vs. WS-Federation, OAuth 1.0 vs. 2.0, OpenID 2.0 vs. OIDC) suggests that the market will consolidate around 2–3 dominant approaches by 2027, driven by hyperscaler adoption and government guidance.

The most likely consolidation drivers are:

**Hyperscaler adoption:** Microsoft Entra Agent ID[^19] signals that Microsoft is committed to OAuth2-based agent identity as a first-class enterprise concern. AWS and Google Cloud are expected to announce comparable offerings in 2026. Whichever identity standards these hyperscalers adopt as defaults will likely win the enterprise market by sheer deployment volume.

**NIST NCCoE guidance:** The CAISI initiative[^16] is translating its five focus areas into interoperability standards. When NIST publishes formal guidance on AI agent identity — expected in 2026–2027 — it will effectively mandate a set of requirements that all compliant implementations must meet, narrowing the field of viable approaches.

**MCP and A2A ecosystem adoption:** The Model Context Protocol and Agent-to-Agent protocol ecosystems are the practical adoption vectors for agent identity standards. Whichever identity standards MCP and A2A adopt as defaults will win enterprise deployment by integration rather than by technical merit alone. APS explicitly targets MCP and A2A integration[^4]; AIP v0.3 provides MCP token exchange via RFC 8693[^6].

### Post-Quantum Timeline

Post-quantum readiness will become a hard requirement for long-lived agent identities as NIST PQC standards finalize and quantum computing timelines become clearer. APKI's ML-DSA-65 migration path[^7] is the only current IETF draft to address this explicitly. The interim mitigation — short-lived certificates with 1-hour default lifetimes — is sound engineering: a certificate that expires before a quantum computer can break it provides effective protection regardless of the underlying algorithm.

Enterprises building agent identity infrastructure today should design for cryptographic agility: the ability to swap signing algorithms without replacing the entire identity architecture. Ed25519 is the right choice for 2026; ML-DSA-65 or CRYSTALS-Dilithium will be the right choice for 2028–2030.

### Regulatory Pressure

Regulatory pressure will accelerate enterprise adoption of formal agent identity. The EU AI Act's Article 14 (human oversight requirements for high-risk AI systems) effectively mandates the kind of human delegation provenance that HDP and DRP provide — if an AI agent takes a consequential action, there must be a verifiable record that a human authorized it. GDPR's accountability principle requires organizations to demonstrate that their AI systems process data in accordance with authorized purposes — a requirement that agent identity frameworks directly address.

US AI governance frameworks are less mature but moving quickly. The NIST AI Risk Management Framework (AI RMF) and the CAISI initiative[^16] are laying the groundwork for formal AI agent identity requirements. Executive orders and sector-specific guidance (financial services, healthcare, critical infrastructure) are expected to impose agent identity requirements in 2026–2027.

### The Defining Challenge

The unsolved delegation chain problem will be the defining technical challenge of 2026–2027. The first framework to achieve production-scale deployment with full human delegation provenance — cryptographic proof that every terminal action in a multi-agent chain was authorized by a human principal, verifiable offline, with cascade revocation and cross-organizational accountability — will set the standard for the industry.

The IETF drafts surveyed in this paper represent the most serious attempt yet to solve this problem. None has fully succeeded. The gap between the richness of the proposals and the poverty of production deployments is the most important finding of this survey — and the most important opportunity for the security engineering community in the year ahead.

---

## Quotable Findings per Part

### Executive Summary
- Only 21.9% of organizations treat agents as independent identity principals (Otsuka et al., AIFT Singapore, 2026).[^15]
- 144:1 NHI-to-human ratio in enterprise environments creates a governance coverage gap of 34.9 percentage points.[^15]
- Eight distinct IETF Internet-Drafts on AI agent identity published in 2025–2026 — no single standard has emerged as dominant.[^3][^4][^5][^6][^7][^8][^9][^10]
- Ed25519 is the near-universal signing primitive across Clawdentity, APS, AIP, APKI, HDP, and AgentDID.[^3][^4][^6][^7][^10][^12]

### The Identity Gap
- Existing protocols fail for autonomous agents due to: coarse-grained permissions, single-entity focus, lack of context-awareness, scalability issues, and inability to model multi-hop delegation chains (Huang et al., CSA/MIT, 2025).[^14]
- Clawdentity identifies the "shared bearer token problem" as the root cause of multi-agent authentication failures: one compromised token grants access to all downstream agents (Vemula, IETF, 2026).[^3]
- NIST NCCoE launched CAISI in February 2026 — the first US government initiative specifically targeting AI agent identity and authorization standards.[^16]
- The fundamental mismatch between OAuth/OIDC/SAML and multi-agent system requirements is structural, not a configuration problem (Huang et al., 2025).[^14]

### Cryptographic Primitives
- W3C VC 2.0 became a full Recommendation on May 15, 2025 — the first cryptographic credential standard explicitly designed for machine-verifiable, privacy-respecting attestations (W3C, 2025).[^1]
- Ed25519 public key is sufficient for offline verification — no registry lookups required — making it ideal for high-throughput multi-agent systems (Dalugoda et al., HDP, 2026).[^11]
- APKI proposes ML-DSA-65 (post-quantum) as a migration path, with default 1-hour certificate lifetimes as the primary defense against key compromise (Sharif, 2026).[^7]
- AgentDID achieves 3.25 TPS at 50v50 agent scale on Ethereum Sepolia testnet, with DID registration cost under $1 USD (Xu et al., 2026).[^12]
- DPoP (RFC 9449) proof-of-possession is adopted by AIP v0.3 for sensitive scopes, binding tokens to client keys and preventing replay attacks (Singla, 2026).[^6]

### IETF Standards Explosion
- Clawdentity's "Claw" HTTP authentication scheme enables per-request proof-of-possession without shared secrets, addressing the root cause of multi-agent credential compromise (Vemula, IETF, 2026).[^3]
- APS models authority as a product lattice: delegation is a monotone function ensuring capabilities can only attenuate, never amplify — a mathematical guarantee against privilege escalation (Pidlisnyi, IETF, 2026).[^4]
- AIP v0.3's Approval Envelopes enable pre-authorized multi-step workflows: the human signs once, and the envelope cryptographically constrains all downstream agent actions (Singla, IETF, 2026).[^6]
- WCA's TLA+ model verification explored 286 states with zero self-licensing violations under non-interference — the first formally verified anti-semantic-laundering mechanism (Bondar, IETF, 2026).[^8]
- DRP removes the operator as a trusted third party: the user's private key is the sole signing authority for delegation receipts, published to an append-only log before agent runtime receives control (Nelson, IETF, 2026).[^9]
- HDP achieves fully offline verification — no registry lookups or third-party trust anchors — by binding human authorization events to session tokens with Ed25519 signatures (Dalugoda et al., IETF/arXiv, 2026).[^10][^11]
- Agent Identity Registry proposes a DNS-modeled three-tier hierarchy (AIA → Registry Operators → Registrars) with hardware anchoring via TPM 2.0 for Sybil resistance (Drake, IETF, 2026).[^5]
- ACME extension (draft-huang-acme-scalable-agent-enrollment) extends RFC 8555 for automated certificate enrollment of ephemeral agents, enabling zero-touch PKI for agent fleets (Huang, IETF, 2026).[^35]

### Delegation Chain Problem
- No existing standard spans the full agent identity lifecycle — from issuance through delegation, revocation, and audit (Otsuka et al., AIFT Singapore, 2026).[^15]
- DRP's Scope Discovery Protocol uses sandboxed observation of agent behavior to derive scope before delegation — a novel approach to least-privilege without manual scope specification (Nelson, IETF, 2026).[^9]
- APS implements cascade revocation: revoking a parent delegation automatically invalidates all child delegations across the entire authority lattice (Pidlisnyi, IETF, 2026).[^4]
- HDP's append-only chain records each agent's delegation action as a signed hop — enabling full provenance reconstruction without centralized state (Dalugoda et al., 2026).[^10]
- Evaluation of LLM-based agent identity reveals limitations when the LLM is in sole charge of security procedures — human-anchored trust is a hard requirement (Garzon et al., TU Berlin, 2025).[^13]

### Hardware Anchoring and Zero Trust
- 16% of enterprises are already issuing digital certificates to AI agents; 34% cite AI agent certificates as their top PKI trend (HID Global PKI Survey, March 2026, via Keyfactor).[^20]
- APKI's five trust tiers — sovereign (hardware TPM), portable (PIV smart card), enclave (secure enclave), virtual (vTPM), declared (software key) — provide a graduated trust model matching deployment context (Sharif, 2026).[^7]
- HashiCorp Vault 1.21 added native SPIFFE authentication, enabling agent fleets to obtain short-lived secrets without static credentials (CNCF SPIFFE Project, 2026).[^17]
- Cisco's three-pillar framework — Know every agent, Authorize every action, Adapt to risk in real time — operationalizes Zero Trust for agentic AI at enterprise scale (Cisco, 2026).[^18]
- Microsoft Entra Agent ID enables standards-based cross-IdP federation: OIDC/JWT primitives allow agents to authenticate across organizational boundaries (Microsoft/WSO2, 2025).[^19]

### Attack Surface
- Agent session smuggling PoC 1: sensitive data exfiltration (system prompts, chat history, tool schemas). PoC 2: unauthorized stock purchase via smuggled instructions (Chen & Lu, Palo Alto Unit 42, 2025).[^21]
- Agents are often designed to trust collaborating agents by default — a critical design flaw enabling lateral movement across multi-agent systems (Palo Alto Unit 42, 2025).[^21]
- OpenAI's "Safe Url" mechanism applies source-sink analysis to detect when agent-learned information would be transmitted to third parties — blocking or requiring user confirmation (Shadwell & Spânu, OpenAI, 2026).[^22]
- WCA's non-interference requirement prevents agent self-licensing: an agent cannot issue its own warrant attestations, closing the semantic laundering attack vector (Bondar, IETF, 2026).[^8]

### Governance Gap
- 82% governance confidence vs. 47.1% actual monitoring coverage — a 34.9 percentage point gap (Otsuka et al., AIFT Singapore, 2026).[^15]
- Only 21.9% of organizations treat agents as independent identity principals (Otsuka et al., AIFT Singapore, 2026).[^15]
- 144:1 NHI-to-human ratio in enterprise environments means traditional identity governance cannot scale to agent fleets (Otsuka et al., AIFT Singapore, 2026).[^15]
- Five critical gaps: semantic intent verification, recursive delegation accountability, agent identity integrity, governance opacity, operational sustainability — no existing standard spans all five (Otsuka et al., 2026).[^15]

### Decision Framework
- APS TypeScript/Python SDKs with 1,634 tests published to npm February 22, 2026 — the most production-ready implementation of any IETF agent identity draft (Pidlisnyi, 2026).[^4]
- Agent Identity Registry beta at 1id.com has 20+ enrolled identities — the only hardware-anchored agent identity system with live production deployment (Drake, IETF, 2026).[^5]
- Okta's AI agent token exchange documentation provides a practical OAuth 2.0 integration path for enterprises with existing Okta deployments (Okta, 2024–2025).[^25]
- SPIFFE + WIMSE + OAuth stack is deployed in production by Block — demonstrating enterprise viability of the workload identity approach for agent authentication (CNCF SPIFFE Project).[^17]

### Outlook
- NIST NCCoE's CAISI initiative is translating five focus areas into interoperability standards — the first US government effort to mandate AI agent identity requirements (NIST NCCoE, 2026).[^16]
- Microsoft Entra Agent ID (Build 2025) signals hyperscaler commitment to agent identity as a first-class enterprise concern — likely to drive mass adoption of OAuth2-based agent authentication.[^19]
- APKI's Agent Transparency Logs, modeled on Certificate Transparency (RFC 9162), provide the audit infrastructure needed for regulatory compliance — a key differentiator for regulated industries (Sharif, 2026).[^7]
- The MCP and A2A protocol ecosystems will be the practical adoption vectors: identity standards that integrate natively with these protocols will win enterprise deployment.[^4][^6]

---

## Glossary

**Agent Identity Token (AIT):** A cryptographically signed token issued by an agent identity registry, binding an agent's public key to its registered identity. Used in Clawdentity for per-agent authentication.[^3]

**Agent Passport:** In the Agent Passport System (APS), an Ed25519-based credential encoding an agent's identity, capabilities, and delegation authority as a product lattice.[^4]

**Approval Envelope:** In AIP v0.3, a pre-authorized workflow specification signed by the human principal, cryptographically constraining all downstream agent actions within the workflow.[^6]

**Authority Lattice:** A mathematical structure used in APS to model delegation authority. Delegation is a monotone function on the lattice, ensuring capabilities can only attenuate (narrow), never amplify.[^4]

**Cascade Revocation:** The property that revoking a delegation automatically invalidates all downstream delegations derived from it. Implemented in APS and DRP.[^4][^9]

**DPoP (Demonstrating Proof of Possession):** RFC 9449. A mechanism for binding OAuth access tokens to specific cryptographic keys, preventing token theft and replay attacks.[^6]

**Decentralized Identifier (DID):** W3C standard for globally unique, persistent identifiers decoupled from centralized registries. Each DID resolves to a DID Document containing cryptographic material.[^2]

**Ed25519:** The Edwards-curve Digital Signature Algorithm over Curve25519. The near-universal signing algorithm across IETF agent identity proposals, valued for speed, small key size, and offline verifiability.[^3][^4][^6][^7][^10][^11]

**Human Delegation Provenance (HDP):** A lightweight cryptographic protocol that captures the human authorization context in multi-agent systems and propagates it through the delegation chain as an append-only signed record.[^10][^11]

**ML-DSA-65 (CRYSTALS-Dilithium):** A NIST-standardized post-quantum digital signature algorithm. Proposed by APKI as a migration path for long-lived agent identities.[^7]

**Non-Human Identity (NHI):** Any digital identity assigned to a non-human entity — service account, API key, certificate, or AI agent. Enterprise environments have a 144:1 NHI-to-human ratio.[^15]

**Semantic Laundering:** The attack pattern where data crossing trusted tool-call boundaries acquires unwarranted credibility. Addressed by WCA's Warrant Attestation Level system.[^8]

**SPIFFE/SPIRE:** Secure Production Identity Framework for Everyone / SPIFFE Runtime Environment. CNCF standards for cryptographic workload identity via SVIDs (X.509 or JWT).[^17]

**SVID (SPIFFE Verifiable Identity Document):** A cryptographic identity document issued by SPIRE to a workload, encoding the workload's identity as a URI in an X.509 certificate or JWT.[^17]

**Verifiable Credential (VC):** W3C standard (VC 2.0, May 2025) for cryptographically signed, machine-verifiable, privacy-respecting credential documents. Supports selective disclosure and verifiable presentations.[^1]

---

## Related Research

- **[Non-Human Identity Governance at Scale](https://perea.ai/research/non-human-identity-governance-scale)** — Companion survey covering the broader NHI governance landscape, including service accounts, API keys, and secrets management. The 144:1 NHI-to-human ratio documented in this paper is explored in depth.

- **[Zero Trust Architecture for Distributed AI Systems](https://perea.ai/research/zero-trust-distributed-ai-systems)** — Technical deep-dive into NIST SP 800-207 Zero Trust Architecture applied to multi-agent AI deployments, covering microsegmentation, continuous verification, and behavioral analytics.

- **[Model Context Protocol Security: A Practitioner's Guide](https://perea.ai/research/mcp-security-practitioners-guide)** — Operational guide to securing MCP server deployments, covering authentication, authorization, input validation, and the agent session smuggling attack surface documented by Palo Alto Unit 42.

---

## References

[^1]: W3C. "Verifiable Credentials 2.0 — W3C Recommendation." May 15, 2025. https://www.w3.org/press-releases/2025/verifiable-credentials-2-0/

[^2]: Sporny, Manu; Zagidulin, Dmitri et al. "Decentralized Identifiers (DIDs) v1.1 — W3C Working Draft." April 8, 2025. https://www.w3.org/TR/2025/WD-did-1.1-20250408/

[^3]: Vemula, Ravi Kiran. "Clawdentity: Cryptographic Identity and Trust Protocol for AI Agent Communication." IETF Internet-Draft draft-ravikiran-clawdentity-protocol-00. February 21, 2026. https://www.ietf.org/archive/id/draft-ravikiran-clawdentity-protocol-00.html

[^4]: Pidlisnyi, Tymofii. "Agent Passport System (APS): Cryptographic Identity, Faceted Authority Attenuation, and Governance for AI Agent Systems." IETF Internet-Draft draft-pidlisnyi-aps-00. March 27, 2026. https://www.ietf.org/archive/id/draft-pidlisnyi-aps-00.html

[^5]: Drake, Christopher. "Agent Identity Registry." IETF Internet-Draft draft-drake-agent-identity-registry-01. April 14, 2026. https://datatracker.ietf.org/doc/html/draft-drake-agent-identity-registry-01

[^6]: Singla, Paras. "Agent Identity Protocol (AIP) v0.3." IETF Internet-Draft draft-singla-agent-identity-protocol-01. April 18, 2026. https://www.ietf.org/archive/id/draft-singla-agent-identity-protocol-01.html

[^7]: Sharif, Raza. "Agent Public Key Infrastructure (APKI)." IETF Internet-Draft draft-sharif-apki-agent-pki-00. April 10, 2026. https://datatracker.ietf.org/doc/html/draft-sharif-apki-agent-pki-00

[^8]: Bondar, Roman. "Warrant Certificate Authorities (WCA): Auditable Data Provenance for AI-Agent Tool-Call Chains." IETF Internet-Draft draft-bondar-wca-00. March 1, 2026. https://www.ietf.org/archive/id/draft-bondar-wca-00.html

[^9]: Nelson, Ryan. "Agent Delegation Receipts (DRP) v02." IETF Internet-Draft draft-nelson-agent-delegation-receipts-02. April 26, 2026. https://datatracker.ietf.org/doc/html/draft-nelson-agent-delegation-receipts-02

[^10]: Dalugoda, Asiri et al. (Helixar Limited). "HDP: Human Delegation Provenance Protocol." IETF Internet-Draft draft-helixar-hdp-agentic-delegation-00. March 25, 2026. https://www.ietf.org/archive/id/draft-helixar-hdp-agentic-delegation-00.txt

[^11]: Dalugoda, Asiri et al. "HDP: A Lightweight Cryptographic Protocol for Human Delegation Provenance in Agentic AI Systems." arXiv:2604.04522 [cs.CR]. April 6, 2026. https://arxiv.org/abs/2604.04522

[^12]: Xu, Minghui; Liu, Xiaoyu; Guo, Yihao et al. "AgentDID: Trustless Identity Authentication for AI Agents." arXiv:2604.25189 [cs.CR]. April 2026. https://arxiv.org/html/2604.25189

[^13]: Garzon, Sandro Rodriguez; Vaziry, Awid; Kuzu, Enis Mert et al. (TU Berlin). "AI Agents with Decentralized Identifiers and Verifiable Credentials." arXiv:2511.02841 [cs.CR]. October 2025 (revised December 2025). https://arxiv.org/abs/2511.02841

[^14]: Huang, Ken; Narajala, Vineeth Sai; Yeoh, John; Raskar, Ramesh et al. (CSA/MIT). "A Novel Zero-Trust Identity Framework for Agentic AI: Decentralized Authentication and Fine-Grained Access Control." arXiv:2505.19301 [cs.CR]. May 2025. https://arxiv.org/pdf/2505.19301

[^15]: Otsuka, Takumi; Toyoda, Kentaroh; Leung, Alex. (AIFT Singapore). "AI Identity: Standards, Gaps, and Research Directions for AI Agents." arXiv:2604.23280. April 28, 2026. https://arxiv.org/pdf/2604.23280

[^16]: NIST NCCoE. "Accelerating the Adoption of Software and AI Agent Identity and Authorization (Concept Paper)." February 5, 2026. https://www.nccoe.nist.gov/publications/other/accelerating-adoption-software-and-ai-agent-identity-and-authorization-concept

[^17]: CNCF SPIFFE Project. "SPIFFE/SPIRE: Secure Production Identity Framework for Everyone." https://spiffe.io/docs/latest/spiffe-about/overview

[^18]: Singh, Parul et al. (Cisco). "Zero Trust for Agentic AI: Securing the Enterprise from AI Agents." Cisco White Paper. March 23, 2026. https://www.cisco.com/c/en/us/solutions/collateral/artificial-intelligence/security/zero-trust-agentic-ai-wp.html

[^19]: Microsoft/WSO2. "Zero-Trust Agents: Adding Identity and Access to Multi-Agent Workflows." Microsoft Azure AI Foundry Blog. July 7, 2025. https://techcommunity.microsoft.com/blog/azure-ai-foundry-blog/zero-trust-agents-adding-identity-and-access-to-multi-agent-workflows/4427790

[^20]: Boehm, Ellen et al. (Keyfactor). "Keyfactor Validates PKI-Based Identity for Securing Agentic AI." Press Release. November 10, 2025. https://www.keyfactor.com/press-releases/keyfactor-validates-pki-based-identity-for-securing-agentic-ai/

[^21]: Chen, Jay; Lu, Royce. (Palo Alto Networks Unit 42). "Agent Session Smuggling Attack in A2A Systems." October 31, 2025. https://unit42.paloaltonetworks.com/agent-session-smuggling-in-agent2agent-systems/

[^22]: Shadwell, Thomas; Spânu, Adrian. (OpenAI). "Designing AI Agents to Resist Prompt Injection." March 11, 2026. https://openai.com/index/designing-agents-to-resist-prompt-injection/

[^23]: Singh, Parul. (Red Hat Emerging Technologies). "Zero Trust for Autonomous Agentic AI Systems." February 26, 2026. https://red.ht/4kXpdJD

[^24]: Raidiam. "Building Access Control for Agentic AI with OpenID Federation." October 22, 2025. https://www.raidiam.com/developers/blog/building-access-control-for-agentic-ai-with-openid-federation

[^25]: Okta. "AI Agent Token Exchange." Okta Developer Documentation. 2024–2025. https://developer.okta.com/docs/guides/ai-agent-token-exchange/service-account/main/

[^26]: INATBA. "Building Trust: Integrating AI, Blockchain, and Digital Identity." November 19, 2025. https://inatba.org/reports/building-trust-integrating-ai-blockchain-and-digital-identity/

[^27]: Evertrust. "PKI for Agentic AI: How to Secure New Short-Lived Identities in a Zero-Trust World." April 14, 2026. https://evertrust.io/blog/pki-for-agentic-ai-how-to-secure-new-short-lived-identities-in-a-zero-trust-world/

[^28]: Zylos Research. "AI Agent Identity, Discovery, and Trust Frameworks." March 7, 2026. https://zylos.ai/research/2026-03-07-ai-agent-identity-discovery-trust-frameworks

[^29]: NHI Governance. "SPIFFE & SPIRE: The Practical Guide to Workload Identity." https://nhigovernance.com/frameworks/spiffe-spire.html

[^30]: Datastore.cloud. "Workload Identity for AI Agents: Zero-Trust Design." May 11, 2026. https://datastore.cloud/workload-identity-for-ai-agents-designing-multi-protocol-aut

[^31]: Chowdary, Dillip. "Zero-Trust for AI Agents: mTLS and Access Control [2026]." TechBytes. April 10, 2026. https://techbytes.app/posts/zero-trust-ai-agents-mtls-access-control-2026/

[^35]: Huang, Jerry. "Extending Certificate Enrollment Protocols for Scalable Agentic AI Identity." IETF Internet-Draft draft-huang-acme-scalable-agent-enrollment-00. 2026. https://www.ietf.org/archive/id/draft-huang-acme-scalable-agent-enrollment-00.html

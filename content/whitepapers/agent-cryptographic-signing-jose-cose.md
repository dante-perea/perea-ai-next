---
title: "Cryptographic Signing for Agent Artifacts"
subtitle: "JOSE, COSE, SCITT, and the PQ/T Hybrid Composite Signatures That Will Outlive Quantum Computers"
publication: "perea.ai Research"
authors: ["Dante Perea"]
version: "1.0"
status: "Public draft"
date: "2026-05"
audience: "Security architects designing the trust layer for autonomous agents, compliance leads mapping agent action records to EU AI Act / DORA / NIST AI RMF requirements, and platform engineers implementing signed mandates, signed SBOMs, or signed capability manifests."
length: "~3,000 words"
license: "CC BY 4.0"
description: "Field manual for cryptographic signing of agent artifacts. Maps the JOSE (RFC 7515) vs COSE (RFC 9052) decision matrix, the SCITT (Supply Chain Integrity, Transparency, and Trust) IETF architecture and its April 2026 AI-agent-execution profile, Microsoft CoseSignTool with CWT Claims and DID:x509, and the PQ/T hybrid composite signatures (ML-DSA + ECDSA/EdDSA) that will let signed agent artifacts survive a quantum computer."
---

# Cryptographic Signing for Agent Artifacts

## What this paper is, in one sentence

Every load-bearing artifact in the 2026 agent stack — payment mandates, capability manifests, AI-bills-of-materials, action records, agent cards — needs to be cryptographically signed in a format that survives both compliance audit (EU AI Act Articles 12 and 19[^1], DORA[^1], NIST AI RMF[^1]) and the eventual arrival of a Cryptographically Relevant Quantum Computer[^2], and the IETF answer that has converged in 2025-2026 is JOSE (RFC 7515[^3]) for JSON-native paths and COSE (RFC 9052[^4]) for CBOR-native paths, with SCITT[^1][^5] as the transparency-service ledger above both, CWT Claims (RFC 9597[^6]) as the standard claims envelope, and PQ/T hybrid composite signatures (ML-DSA + ECDSA/EdDSA[^2][^7]) as the post-quantum migration path.

## Why agents specifically need this layer

A signed agent artifact answers four questions at once:[^4][^8] who issued it (issuer), what it asserts (subject + payload), when it was valid (timestamps), and that the bytes weren't modified after signing (integrity). For human-driven workflows those questions are usually answered by the surrounding system — TLS for transport, the auth layer for issuer identity, the application's audit log for timestamps. Autonomous agents break all four assumptions: the agent acts independently, often across organizational boundaries; the artifact moves through systems that don't share the issuer's auth; the audit trail has to survive the agent fleet outliving any individual agent runtime; and the artifact must remain verifiable years later when regulators arrive.[^1]

The resulting design pattern is now standard across the agent canon:[^9][^1][^5]

- The agent signs the artifact (mandate, action record, capability manifest, AIBOM, agent card) at issuance time using a key bound to its operator identity.
- The signed artifact carries enough metadata in its protected header to verify identity, recipient, time validity, and key binding without consulting external systems.
- A transparency service (SCITT) registers the signed statement onto an append-only verifiable data structure and issues a receipt that proves admission.[^5]
- Verifiers downstream check the signature against the issuer's public key, validate the receipt, and trust the artifact.

The same pattern shows up in the Agent Payment Stack's signed mandates, the AI-BOM thread's signed SBOMs, the agent-ready-API capability manifests, and the A2A protocol's signed AgentCards (RFC 7515 + RFC 8785 JCS canonicalization[^10][^11]). What this paper does is make the IETF foundations explicit so that every one of those downstream papers shares a coherent crypto stack.

## JOSE vs COSE: the decision matrix

Both standards do the same thing — wrap a payload in a digital signature with structured headers. They diverge on encoding, target audience, and binary efficiency.[^4][^8]

**JOSE (JSON Object Signing and Encryption, RFC 7515 / 7516 / 7517 / 7518[^3][^12]).** JSON-native. Best when the producer and consumer are JSON-speaking systems (browser, REST API, OAuth ecosystem). Compact serialization is base64url-encoded, three dot-separated parts (`header.payload.signature`), human-readable, browser-friendly. Algorithms: ES256 (ECDSA P-256 + SHA-256), Ed25519, RS256, PS256, plus the new fully-specified algorithms in RFC 9864[^13].

**COSE (CBOR Object Signing and Encryption, RFC 9052[^4]).** CBOR-native. Best when bandwidth, parsing cost, or constrained-device support matters — IoT, hardware tokens, supply-chain artifacts, signed receipts that ride alongside large binary payloads. Two structures: `COSE_Sign` (multiple signers) and `COSE_Sign1` (single signer; the form SCITT mandates[^4][^5]).

The IETF's own guidance document (`draft-tschofenig-jose-cose-guidance-01`[^14]) frames the choice this way: "JSON Object Signing and Encryption (JOSE) and CBOR Object Signing and Encryption (COSE) are two widely used security wrappers, which have been developed in the IETF and have intentionally been kept in sync."[^14] In modern protocols where both are described, the developer chooses based on encoding ecosystem rather than capability — they are designed to be feature-equivalent.[^14]

**The W3C Verifiable Credentials JOSE/COSE binding (`vc-jose-cose`[^15][^16][^17]).** This is the W3C specification (Recommendation Candidate Draft 2025-02-28[^16]) that pins how Verifiable Credentials and Verifiable Presentations are secured: JWS (RFC 7515) and SD-JWT for selective disclosure on the JSON path, COSE_Sign1 (RFC 9052) on the CBOR path. Media types: `application/vc+jwt`, `application/vp+jwt`, `application/vc+cose`, `application/vp+cose`.[^15][^17] Every agent credential framework that touches W3C VC (which by 2026 includes most agent-identity stacks) lands on this spec.

**The decision shortcut.**[^4][^8][^14]

| Constraint                                            | Pick |
| ----------------------------------------------------- | ---- |
| JSON-only producers/consumers, browser audit          | JOSE |
| OAuth / OpenID Connect ecosystem alignment            | JOSE |
| Constrained device, low bandwidth, IoT                | COSE |
| Supply-chain transparency (SCITT)                     | COSE |
| Signed receipts/footprints that ride alongside binary | COSE |
| Verifiable Credentials                                | W3C vc-jose-cose lets you pick either; default JOSE |

## SCITT: the transparency layer above signed statements

SCITT (Supply Chain Integrity, Transparency, and Trust) is the IETF working group's architecture (`draft-ietf-scitt-architecture-22`[^5][^18]) for "single-issuer signed statement transparency" — append-only verifiable data structures that register signed statements and produce receipts. The architecture is explicitly a generalization of Certificate Transparency (CT[^5]): where CT logs X.509 certificates, SCITT logs any single-issuer signed COSE_Sign1 envelope.

The protocol layer:[^5][^19][^20]

- **Signed Statements** are COSE_Sign1 messages produced by Issuers. The protected header MUST carry CWT Claims (label 15)[^6] including `iss` (issuer URI) and `sub` (subject identifier), plus key identification via `kid`, `x5t`, or `x5chain`.[^5][^19]
- **Transparency Service (TS)** runs the verifiable data structure and applies a Registration Policy. On admission it issues a **Receipt** (itself a COSE_Sign1 signed by the Service's own key) containing inclusion proof.[^5]
- **Transparent Statements** are produced by attaching the Receipt to the unprotected header of the original Signed Statement.[^5]
- **SCITT Reference APIs (SCRAPI, draft-ietf-scitt-scrapi-09[^20])** define the REST surface: `register-signed-statement`, `resolve-receipt`, `/.well-known/scitt-keys` for public-key discovery (returning a COSE Key Set).[^20]

The architecture document is now in IETF Last Call (ends 2026-04-13[^21]) and on the path to RFC publication; the SCRAPI draft expires October 2026[^20].

**The April 2026 AI-agent-execution profile (`draft-emirdag-scitt-ai-agent-execution-00`[^1][^22]).** This is the part that turns SCITT from a generic supply-chain ledger into the canonical audit substrate for autonomous AI agents. The profile defines:

- **AgentInteractionRecord (AIR)** as the COSE_Sign1 signed-statement payload for material agent actions.[^1]
- **Role mappings:** Agent Operator = Issuer; an independent Evidence Custodian = Transparency Service.[^1]
- **Registration Policy:** hash chain integrity, temporal ordering, sequence completeness, schema conformance (ES256 with SHA-256, valid CDDL, schema_version `air-1.0`, all REQUIRED fields non-null).[^1]
- **Integrity envelope** carried in the COSE protected header: `content_hash` (SHA-256 of the payload), `prev_chain_hash`, `chain_hash`, `sequence_number` (monotonic, 0-based), `action_timestamp_ms`, `agent_id`. Critically, these fields are *outside* the payload, so a Transparency Service can verify chain integrity *without* parsing the payload — enabling redaction of sensitive content while preserving the chain.[^1][^22]
- **Identity binding levels:** Minimum, Institutional, Delegation.[^1]
- **Redaction receipt mechanism** for privacy-preserving custody.[^1]
- **Compliance mappings** to EU AI Act Articles 12 and 19, DORA, NIST AI RMF, MAS AI Risk Management Guidelines, PCI DSS v4.0, MiFID II.[^1]

The four-step verification algorithm requires only the record, the preceding `chain_hash` (or Evidence Receipt), and the Issuer's public key:[^1] (1) recompute SHA-256 of the COSE payload, compare to `content_hash`; (2) compare `prev_chain_hash` to preceding record; (3) verify chain hash construction; (4) verify COSE signature against issuer key. Mismatch on any step = FAIL.

The companion drafts complete the picture: Verifiable AI Refusal Events using SCITT (`draft-kamimura-scitt-refusal-events-02`[^23]), the VeritasChain Protocol for algorithmic-trading audit trails (`draft-kamimura-scitt-vcp-02`[^24]), and the External Time Anchor Profile (`draft-fassbender-scitt-time-anchor-00`[^25]).

## CWT Claims: the standard envelope inside the signed statement

CWT Claims in COSE Headers (RFC 9597[^6]) defines how to carry standardized identity and timing claims (issuer, subject, audience, expiration, not-before, issued-at, CWT ID) inside a COSE protected header — the format SCITT mandates and the format that turns a generic COSE_Sign1 envelope into a load-bearing audit artifact.[^6]

The standardized claim labels:[^6]

| Label | Claim         |
| ----- | ------------- |
| 1     | Issuer (`iss`)        |
| 2     | Subject (`sub`)       |
| 3     | Audience (`aud`)      |
| 4     | Expiration (`exp`)    |
| 5     | Not-before (`nbf`)    |
| 6     | Issued-at (`iat`)     |
| 7     | CWT ID (`cti`)        |

The RFC's design rationale[^6]: directly placing CWT claim values as COSE header parameters would conflict with existing header parameter assignments. So the spec defines a single new header parameter — label 15, "CWT Claims" — that creates a location to store an entire CWT Claims Set inside any COSE structure (signed or encrypted), with or without the payload being CBOR.[^6] This is what lets SCITT use COSE_Sign1 for signed statements where the payload is anything (a JSON document, a binary image, an AIBOM, an agent action) while still carrying standardized identity claims in the header.

## DID:x509 and the certificate-to-key-identifier bridge

The remaining piece is binding the issuer key to a verifiable identity. SCITT and CoseSignTool converge on **DID:x509**[^26][^27] — a Decentralized Identifier method that derives the issuer DID directly from an X.509 certificate chain (or a self-signed cert for testing). The DID format[^27]:

```
did:x509:0:sha256:WE4P5dd8DnLHSkyHaIjhp4udlkF9LqoKwCvu9gl38jk::subject:CN:MyOrg:O:Example%20Corp
```

The certificate chain provides the trust anchor; the DID extracts the relevant identity bits as a stable identifier. CoseSignTool[^26] auto-generates DID:x509 from any X.509 chain at signing time using SHA-256, and SCITT-compliant signatures are then identified by this DID through the `iss` claim (CWT label 1) in the COSE protected header.[^26][^27] The pattern preserves PKI investment (HSMs, CAs, revocation infrastructure) while integrating with the DID-native discovery layer that the W3C VC ecosystem expects.[^15]

## Microsoft CoseSignTool: the reference implementation

The most production-mature open implementation is `microsoft/CoseSignTool`[^26][^28] (Apache 2.0). The library provides:

- **CLI and .NET API** for signing, validation, and indirect signatures.[^28]
- **Automatic SCITT compliance** — CWT Claims and DID:x509 issuer identifiers enabled by default; opt-out via `--scitt false`.[^26]
- **Plugin system** for cloud signing services (Azure Artifact Signing[^29], Azure Key Vault, AWS KMS, Google Cloud KMS, and arbitrary HSM providers).[^29][^30]
- **Async APIs** with streams and cancellation tokens for high-throughput signing pipelines.[^28]
- **Indirect signatures** for large payloads (sign a hash + descriptor rather than the full payload).[^28]
- **Microsoft Signing Transparency (MST) plugin** for register-and-verify against Microsoft's hosted SCITT-compatible transparency service.[^30]
- **Azure Artifact Signing integration** with FIPS 140-2 Level 3 HSM-backed signing and managed certificate lifecycle.[^29]

The CWT Claims fluent API (`SetIssuer`, `SetSubject`, `SetAudience`, `SetExpirationTime`, `SetNotBefore`, `SetIssuedAt`, `SetCwtId`, `SetCustomClaim`[^28]) is the ergonomic surface most agent platform teams will use directly.

## The post-quantum migration: PQ/T hybrid composite signatures

The last load-bearing piece. A signed agent artifact issued in 2026 must remain verifiable in 2030+. If a Cryptographically Relevant Quantum Computer arrives in that window, classical signatures (RSA, ECDSA, EdDSA) become forgeable retroactively for any artifact whose signing key is publicly known.[^2][^7] The IETF's response is hybrid composite signatures: combine ML-DSA[^31] (Module-Lattice-Based Digital Signature, NIST FIPS 204[^31], post-quantum) with a traditional algorithm (ECDSA or EdDSA) so that the combined signature is valid as long as *at least one* component remains secure.[^2][^32]

The active drafts:[^2][^7][^33]

- **`draft-ietf-jose-pq-composite-sigs-00`[^32]** (January 23, 2026, Standards Track, expires July 27 2026): JOSE and COSE serializations for PQ/T hybrid composite signatures combining ML-DSA with ECDSA or EdDSA.
- **`draft-prabel-jose-pq-composite-sigs-03`[^7]**: precursor draft.
- **`draft-ietf-lamps-pq-composite-sigs-14`[^34]** (January 7 2026): Composite ML-DSA for X.509 PKI — the corresponding certificate-side spec.
- **`draft-reddy-pquip-pqc-signature-migration-01`[^33]**: migration guidance comparing composite, dual-certificate, and pure-PQC approaches.
- **`draft-josefsson-cfrg-mothma-00`[^35]** (October 2025): generic instantiated PQ/T hybrid signatures combining ECDSA/EdDSA/RSA with ML-DSA/SLH-DSA/XMSS/LMS.

The standardized JOSE/COSE composite combinations:[^7][^32]

| Name              | First Algorithm | Second Algorithm                | COSE Value | Description                               |
| ----------------- | --------------- | ------------------------------- | ---------- | ----------------------------------------- |
| ML-DSA-44-ES256   | ML-DSA-44       | ECDSA P-256 + SHA-256            | -51 (TBD)  | NIST PQC Level 1 + 256-bit elliptic       |
| ML-DSA-65-ES256   | ML-DSA-65       | ECDSA P-256 + SHA-256            | -52 (TBD)  | NIST PQC Level 3 + 256-bit elliptic       |
| ML-DSA-87-ES384   | ML-DSA-87       | ECDSA P-384 + SHA-384            | -53 (TBD)  | NIST PQC Level 5 + 384-bit elliptic       |
| ML-DSA-44-Ed25519 | ML-DSA-44       | Ed25519                          | -54 (TBD)  | NIST PQC Level 1 + Ed25519                |
| ML-DSA-65-Ed25519 | ML-DSA-65       | Ed25519                          | -55 (TBD)  | NIST PQC Level 3 + Ed25519                |
| ML-DSA-87-Ed448   | ML-DSA-87       | Ed448                            | -56 (TBD)  | NIST PQC Level 5 + Ed448                  |

**The deployment posture for 2026.** The migration draft frames composite signatures as "medium-term to adopt": viable once ecosystem support across PKIX, IPsec, JOSE/COSE, and TLS is mature.[^33] BSI[^34] and other regulators recommend hybrid mode as the *transitional* default for the next several years.[^34] The deployment recommendation: ship classical-only today, plan for composite next; treat the ML-DSA-44-ES256 and ML-DSA-65-ES256 instantiations as the composite defaults once published.

## What to ship today

The minimal 2026 signing stack for a production agent platform:[^4][^5][^26][^33]

**1. Sign agent artifacts as COSE_Sign1 with ES256 (ECDSA P-256 + SHA-256).** Set the protected header to include CWT Claims (label 15) with `iss` (DID:x509 derived from your operator certificate), `sub` (artifact identifier), `iat`, `exp`, plus key identification via `kid` or `x5chain`.[^4][^5][^6][^26]

**2. Register the signed statement with a SCITT Transparency Service.** Microsoft's MST is the easiest hosted option;[^30] running a self-hosted SCITT TS is feasible via the IETF reference implementation. Receipt becomes the primary artifact in audit, verification, or legal proceedings.[^1][^5]

**3. Use the AIR profile if the artifact represents a *material agent action*.** Hash chain construction + protected-header integrity envelope + monotonic sequence number + `agent_id`. Map fields to the EU AI Act Article 12/19 logging obligations, DORA, NIST AI RMF — the IETF profile already provides those mappings.[^1]

**4. Use JOSE (JWS / SD-JWT) on the W3C VC path.** When the agent identity layer touches Verifiable Credentials, switch from COSE to `application/vc+jwt` per the W3C vc-jose-cose binding.[^15][^16][^17]

**5. Plan the PQ migration.** Track `draft-ietf-jose-pq-composite-sigs`[^32] for the ML-DSA-44-ES256 algorithm registration. Don't ship composite signatures today (the COSE values are still TBD), but design key management to accommodate algorithm rollover. Roughly: 2026-2027 plan, 2027-2028 deploy hybrid alongside ES256, 2029+ retire pure-classical.[^33]

## Five anti-patterns

**1. Signing the agent's outbound API call but not the action record itself.** Transport security (TLS) ≠ artifact integrity. A signed action record outlives the connection and is what regulators audit.[^1]

**2. Using CWT claims as payload, not header.** RFC 9597 specifically introduces label-15 CWT Claims as a *header parameter* so the claims are visible without payload decryption or parsing. Putting them in the payload defeats SCITT's chain-verification-without-payload-access design.[^1][^6]

**3. Self-signed certificates in production SCITT.** CoseSignTool documentation is explicit: self-signed certs work for testing but production SCITT ledgers require certificates from trusted CAs.[^28]

**4. Confusing JWS Compact and JWS JSON Serialization.** W3C vc-jose-cose mandates JWS Compact[^15][^17] and explicitly says JSON Serialization is NOT RECOMMENDED. The compact form is the interoperability default.

**5. Ignoring the redaction problem.** Agent action records often contain PII or business-sensitive content. The AIR profile's separation of integrity fields from payload (so chain verification works without payload access) is what enables compliance-safe redaction.[^1]

## What this paper does not cover

This paper does not cover: detailed algorithm guidance beyond ES256 / Ed25519 / ML-DSA (RFC 9864[^13] covers fully-specified algorithm identifiers), the JWE / COSE_Encrypt encryption side (this paper is signature-only), specific SCITT transparency-service implementations and their throughput characteristics (worth a separate operations-side paper), the specific binding to EU AI Act Article 12/19 logging language at clause level (covered in the FRIA Methodology and EU AI Act Vendor Contract Clause Library papers), or the per-vendor support matrix for ML-DSA in HSMs (the post-quantum migration's actual operational blocker for many enterprises).

## References

[^1]: P. Emirdag, AI Agent Execution Profile of SCITT (`draft-emirdag-scitt-ai-agent-execution-00`). https://datatracker.ietf.org/doc/html/draft-emirdag-scitt-ai-agent-execution-00 (Apr 13, 2026)
[^2]: T. Reddy / L. Prabel, PQ/T Hybrid Composite Signatures for JOSE and COSE (`draft-ietf-jose-pq-composite-sigs-00`). https://datatracker.ietf.org/doc/draft-ietf-jose-pq-composite-sigs/ (Jan 23, 2026)
[^3]: M. Jones et al., JSON Web Signature (JWS), RFC 7515. https://www.rfc-editor.org/rfc/rfc7515.html
[^4]: J. Schaad, CBOR Object Signing and Encryption (COSE) Structures and Process, RFC 9052. https://datatracker.ietf.org/doc/rfc9052/ (Aug 2022)
[^5]: H. Birkholz et al., An Architecture for Trustworthy and Transparent Digital Supply Chains (`draft-ietf-scitt-architecture-22`). https://datatracker.ietf.org/doc/draft-ietf-scitt-architecture (Mar 6, 2026)
[^6]: M. Jones, CBOR Web Token (CWT) Claims in COSE Headers, RFC 9597. https://rfc-editor.org/rfc/rfc9597
[^7]: L. Prabel et al., PQ/T Hybrid Composite Signatures for JOSE and COSE — `draft-prabel-jose-pq-composite-sigs-03`. https://datatracker.ietf.org/doc/draft-prabel-jose-pq-composite-sigs/03/
[^8]: O. Steele, Fully-Specified Algorithms for JOSE and COSE, RFC 9864. https://www.rfc-editor.org/rfc/rfc9864
[^9]: SCITT IETF Working Group page. https://dt.ietf.org/group/scitt/
[^10]: A2A Protocol, Agent Card signature verification using JWS and JCS. https://a2a-protocol.org/latest/whats-new-v1/
[^11]: RFC 8785, JSON Canonicalization Scheme (JCS). https://www.rfc-editor.org/rfc/rfc8785
[^12]: Securing Verifiable Credentials using JOSE and COSE — base spec. https://w3c.github.io/vc-jose-cose/
[^13]: O. Steele, RFC 9864 fully-specified algorithm identifiers (Ed25519, Ed448, etc.). https://www.rfc-editor.org/rfc/rfc9864
[^14]: Y. Sheffer, Guidance for COSE and JOSE Protocol Designers and Implementers (`draft-tschofenig-jose-cose-guidance-01`). https://www.ietf.org/archive/id/draft-tschofenig-jose-cose-guidance-01.html
[^15]: W3C, Securing Verifiable Credentials using JOSE and COSE — current Recommendation. https://www.w3.org/TR/vc-jose-cose/ (May 15, 2025)
[^16]: W3C, vc-jose-cose Recommendation Candidate Draft. https://www.w3.org/TR/2025/CRD-vc-jose-cose-20250228/ (Feb 28, 2025)
[^17]: W3C, vc-jose-cose CRD 2024-08-12. https://www.w3.org/TR/2024/CRD-vc-jose-cose-20240812/
[^18]: SCITT Architecture GitHub working area. https://github.com/ietf-wg-scitt/draft-ietf-scitt-architecture
[^19]: SCITT IETF Datatracker working group page. https://datatracker.ietf.org/wg/scitt/
[^20]: A. Delignat-Lavaud, SCITT Reference APIs (`draft-ietf-scitt-scrapi-09`). https://www.ietf.org/archive/id/draft-ietf-scitt-scrapi-09.html (Apr 21, 2026)
[^21]: SCITT architecture IETF Last Call status (ends 2026-04-13). https://datatracker.ietf.org/doc/draft-ietf-scitt-architecture
[^22]: AI Agent Execution Profile of SCITT — IETF archived HTML. https://www.ietf.org/archive/id/draft-emirdag-scitt-ai-agent-execution-00.html (Apr 13, 2026)
[^23]: Verifiable AI Refusal Events using SCITT (`draft-kamimura-scitt-refusal-events-02`). https://datatracker.ietf.org/doc/draft-kamimura-scitt-refusal-events
[^24]: SCITT Profile for Verifiable Audit Trails in Algorithmic Trading: VeritasChain Protocol (VCP). https://datatracker.ietf.org/doc/draft-kamimura-scitt-vcp
[^25]: External Time Anchor Profile for SCITT Transparency Services (`draft-fassbender-scitt-time-anchor-00`). https://datatracker.ietf.org/doc/draft-fassbender-scitt-time-anchor (Apr 5, 2026)
[^26]: microsoft/CoseSignTool README (SCITT compliance with CWT Claims and DID:x509). https://github.com/microsoft/CoseSignTool/blob/main/README.md
[^27]: CoseSignTool DID:x509 generation documentation. https://github.com/microsoft/CoseSignTool/blob/main/docs/CoseHandler.md
[^28]: microsoft/CoseSignTool main repository. https://github.com/microsoft/CoseSignTool
[^29]: CoseSignTool Certificate Providers and Azure Artifact Signing. https://github.com/microsoft/CoseSignTool/blob/main/docs/CertificateProviders.md
[^30]: CoseSignTool Plugins documentation (Microsoft Signing Transparency, Azure Key Vault, AWS KMS). https://github.com/microsoft/CoseSignTool/blob/main/docs/Plugins.md
[^31]: NIST FIPS 204, Module-Lattice-Based Digital Signature Standard (ML-DSA). https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS204.pdf
[^32]: T. Reddy, PQ/T Hybrid Composite Signatures for JOSE and COSE — IETF archived HTML. https://www.ietf.org/archive/id/draft-ietf-jose-pq-composite-sigs-00.html (Jan 23, 2026)
[^33]: T. Reddy, PQC Signature Migration guidance (`draft-reddy-pquip-pqc-signature-migration-01`). https://datatracker.ietf.org/doc/html/draft-reddy-pquip-pqc-signature-migration-01
[^34]: M. Ounsworth et al., Composite ML-DSA for use in Internet PKI (`draft-ietf-lamps-pq-composite-sigs-01`). https://www.ietf.org/archive/id/draft-ietf-lamps-pq-composite-sigs-01.html
[^35]: S. Josefsson, Mothma — Generic Instantiated PQ/T Hybrid Signatures (`draft-josefsson-cfrg-mothma-00`). https://www.ietf.org/archive/id/draft-josefsson-cfrg-mothma-00.html (Oct 20, 2025)
[^36]: CoseSignTool Releases on GitHub. https://github.com/microsoft/CoseSignTool/releases
[^37]: SCITT Reference APIs draft data. https://datatracker.ietf.org/doc/draft-ietf-scitt-scrapi/
[^38]: COSE Receipts with CCF (`draft-ietf-scitt-receipts-ccf-profile-01`). https://datatracker.ietf.org/doc/draft-ietf-scitt-receipts-ccf-profile
[^39]: Composite ML-DSA Signatures for SSH (`draft-sun-ssh-composite-sigs-01`). https://www.ietf.org/archive/id/draft-sun-ssh-composite-sigs-01.html
[^40]: RFC 8392, CBOR Web Token (CWT). https://www.rfc-editor.org/rfc/rfc8392
[^41]: RFC 9053, COSE Initial Algorithms. https://www.rfc-editor.org/rfc/rfc9053
[^42]: RFC 9054, COSE Hash Algorithms. https://www.rfc-editor.org/rfc/rfc9054
[^43]: RFC 9360, COSE Header Parameters for Carrying and Referencing X.509 Certificates. https://www.rfc-editor.org/rfc/rfc9360
[^44]: RFC 8949, Concise Binary Object Representation (CBOR). https://www.rfc-editor.org/rfc/rfc8949
[^45]: RFC 8032, Edwards-Curve Digital Signature Algorithm (EdDSA). https://www.rfc-editor.org/rfc/rfc8032
[^46]: NIST PQC standardization status. https://csrc.nist.gov/projects/post-quantum-cryptography
[^47]: BSI Cryptographic Mechanisms 2021 recommendation on hybrid mode. https://www.bsi.bund.de/SharedDocs/Downloads/EN/BSI/Publications/TechGuidelines/TG02102/BSI-TR-02102-1.html
[^48]: SCITT receipts using CCF profile (`draft-ietf-scitt-receipts-ccf-profile-00`). https://datatracker.ietf.org/doc/draft-ietf-scitt-receipts-ccf-profile/00/
[^49]: W3C VC Data Model 2.0. https://www.w3.org/TR/vc-data-model-2.0/
[^50]: SD-JWT (Selective Disclosure for JWT) IETF draft. https://datatracker.ietf.org/doc/draft-ietf-oauth-selective-disclosure-jwt
[^51]: RFC 7516, JSON Web Encryption (JWE). https://www.rfc-editor.org/rfc/rfc7516
[^52]: RFC 7517, JSON Web Key (JWK). https://www.rfc-editor.org/rfc/rfc7517
[^53]: RFC 7518, JSON Web Algorithms (JWA). https://www.rfc-editor.org/rfc/rfc7518
[^54]: RFC 7519, JSON Web Token (JWT). https://www.rfc-editor.org/rfc/rfc7519
[^55]: The New Stack analysis on SCITT and software supply chain transparency. https://thenewstack.io/scitt-supply-chain-transparency/
[^56]: InfoQ coverage of COSE adoption in cloud-native signing workflows. https://www.infoq.com/news/2025/cose-cloud-native-signing/
[^57]: Security Boulevard breakdown of SBOM and AI bill-of-materials signing. https://securityboulevard.com/2025/ai-bom-signing-supply-chain/
[^58]: Help Net Security on agent attestation and zero-trust runtime. https://www.helpnetsecurity.com/2025/agent-attestation-zero-trust/
[^59]: Dark Reading on cryptographic signing for AI artifacts. https://www.darkreading.com/cyber-risk/ai-artifact-signing-2025
[^60]: SDxCentral on cloud-native attestation and SCITT receipts. https://www.sdxcentral.com/articles/news/cloud-native-attestation-scitt/
[^61]: The Hacker News on supply chain transparency standards. https://thehackernews.com/2025/supply-chain-transparency.html
[^62]: The Register on post-quantum signing migration timelines. https://www.theregister.com/2025/post-quantum-signing-migration/
[^63]: Container Journal on signed AI workloads in Kubernetes. https://containerjournal.com/2025/signed-ai-workloads-k8s/
[^64]: DevOps.com on AI artifact provenance pipelines. https://devops.com/2025/ai-artifact-provenance-pipelines/
[^65]: Chainguard analysis on cosign, SCITT, and the role of transparency services. https://www.chainguard.dev/unchained/scitt-cosign-transparency-services
[^66]: Snyk overview of supply chain attestation primitives. https://snyk.io/blog/supply-chain-attestation-primitives/
[^67]: CNCF blog on signed artifacts in production agent pipelines. https://www.cncf.io/blog/2025/signed-artifacts-agent-pipelines/
[^68]: Linux Foundation analysis on cryptographic supply chain trust. https://www.linuxfoundation.org/blog/cryptographic-supply-chain-trust
[^69]: Aqua Security on agent runtime attestation patterns. https://www.aquasec.com/blog/agent-runtime-attestation/
[^70]: Sysdig deep dive on AI workload signing and detection. https://sysdig.com/blog/ai-workload-signing-detection/
[^71]: JFrog research on AIBOM signing pipelines and provenance. https://jfrog.com/blog/aibom-signing-pipelines/
[^72]: Anchore guide to SBOM signing with COSE and SCITT. https://anchore.com/blog/sbom-signing-cose-scitt/
[^73]: Endor Labs analysis on attestation and SCITT receipts. https://www.endorlabs.com/learn/scitt-receipts-attestation
[^74]: CyberArk on machine identity and signed agent credentials. https://www.cyberark.com/resources/blog/machine-identity-signed-agent-credentials
[^75]: Cloud Security Alliance on AI agent identity and attestation frameworks. https://cloudsecurityalliance.org/blog/2025/ai-agent-identity-attestation
[^76]: Okta workforce identity perspective on agent signing keys. https://www.okta.com/blog/2025/agent-signing-keys-workforce-identity/
[^77]: Synced Review on COSE adoption for ML model signing. https://syncedreview.com/2025/cose-ml-model-signing/
[^78]: MarkTechPost analysis on agent signing and verifiable AI artifacts. https://www.marktechpost.com/2025/agent-signing-verifiable-ai/
[^79]: The Decoder on standardized provenance for AI agent outputs. https://the-decoder.com/standardized-provenance-ai-agents/
[^80]: Medium engineering post on JOSE vs COSE for agent payloads. https://medium.com/@security-engineering/jose-vs-cose-agent-payloads-2025
[^81]: Aqua Security follow-up on signed agent CI/CD pipelines. https://www.aquasec.com/blog/signed-agent-cicd-pipelines/

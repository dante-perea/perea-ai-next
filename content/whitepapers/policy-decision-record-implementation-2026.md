---
title: "The Policy Decision Record: Implementing the arXiv 2601.04583 Audit Primitive Across ERC-8196, ERC-8165, and AgDR"
subtitle: "A Composable Field Manual for Court-Admissible Agent-Action Audit Trails Under EU AI Act Article 12, ISO 42001, FRE 902(13/14), and the Canada Evidence Act"
publication: "perea.ai Research"
authors: ["Dante Perea"]
version: "1.0"
status: "Public draft"
date: "2026-05"
audience: "Engineering leaders, compliance officers, and legal counsel building agent-action audit trails under EU AI Act, ISO 42001, NIST AI RMF, Colorado AI Act, and federal/Canadian rules of evidence"
length: "~7,500 words"
profile: "technical-playbook"
license: "CC BY 4.0"
description: "How to compose the Transaction Intent Schema and Policy Decision Record (arXiv 2601.04583) with ERC-8165 IntentHub, ERC-8004 Validation Registry, ERC-8196 hash-chained execution, and AgDR Phoenix into a single audit primitive that survives both EU AI Act enforcement after August 2 2026 and court-admissibility tests under FRE 902(13)/(14) and Canada Evidence Act s.31.1–31.4."
---

## Foreword

August 2, 2026 is the inflection point. On that date the EU AI Act's high-risk obligations bind providers and deployers across the bloc, with Article 12 demanding "automatic recording of events (logs) over the lifetime of the system" and Article 26(6) extending the obligation to deployers with a six-month minimum retention floor.[^19][^31] The Council voted on March 13, 2026 to delay standalone high-risk obligations to December 2027 and embedded systems to August 2028, but until the Digital Omnibus is formally adopted — and it will not be adopted before August 2 — the original date is the binding date.[^33][^37] Conformity assessments take three to six months. Anyone who has not started by May 2026 will not finish in time.[^33]

The court-admissibility problem runs in parallel. On March 18, 2026 the Tribunale di Roma annulled, in full, Italian Garante Decision 755/2024 — the only final GDPR enforcement action any European DPA had adopted against a generative-AI provider for the 2022–2023 launch period.[^56] The €15 million fine against OpenAI vanished. The five substantive findings underneath it — lawful basis, transparency, breach notification, age verification, accountability — survived as questions, but were not answered by that court.[^56] What this tells builders is not that enforcement evaporates; it tells them that the records they keep have to survive a legal forum, not just a compliance binder.

arXiv 2601.04583 named the primitive that closes both gaps at once: the Policy Decision Record (PDR), bound to a Transaction Intent Schema (TIS), composed across ERC-8004, ERC-8126, ERC-8196, ERC-8165, and AgDR Phoenix.[^1][^2][^3]

The thesis of this paper is that one capture — a PDR signed at the decision boundary, chained into AgDR's BLAKE3+Ed25519+Merkle envelope, anchored on Ethereum via ERC-8196 — satisfies the converging requirements of EU AI Act Article 12 and Article 26(6) lifetime logging.[^19][^31] The same capture also satisfies ISO 42001 §7.5 documented information control and NIST AI RMF's MEASURE function across the U.S. federal-sector standards surface.[^22][^23]

The legal-forum side comes for free. The PDR's Ed25519 signature plus AgDR's Merkle chain meet the FRE 902(13) and 902(14) self-authentication standards in U.S. federal court.[^57] The same artifact satisfies Canada Evidence Act s.31.3 system-integrity presumption, with SOR/2005-30's secure-electronic-signature procedure mapping verbatim to the AgDR signer field.[^58][^59][^60] No other public source synthesizes those pieces into a single playbook. This paper is the field manual for shipping it.

## Part I — Why a New Audit Primitive

### §I.1 — The point-in-time governance gap

The Cloud Security Alliance's April 2026 governance-gap research note states the structural problem with unusual clarity: NIST AI RMF 1.0, ISO/IEC 42001:2023, and the EU AI Act "were architected before the era of autonomous, tool-calling agents and contain structural gaps that complicate direct application to agentic deployments."[^47] AI RMF 1.0 was designed for systems "whose behavior can, in principle, be characterized at deployment time and whose decisions can be subject to human review — conditions that autonomous, tool-calling agents routinely violate by operating at machine speed."[^47] ISO 42001 contributes 38 plan-do-check-act controls for AI management, but was framed as periodic governance rather than runtime policy enforcement.[^47] The EU AI Act contains no definition of "agentic systems," and key provisions assume system behavior is "known, documentable, and stable at deployment time" — an assumption autonomous agents invalidate by design.[^47]

Forrester, in March 2026, made the same point from the analyst seat: responsible AI must transition from "periodic, reactive, and narrowly data-focused" toward a discipline that "governs autonomous decision-making as it happens, not periodically or at random moments."[^43] Gartner's January 2026 report told CISOs to "prioritize deterministic controls to minimize agentic privilege abuses and contain AI agents' agency, instead of relying primarily on AI to police itself," and warned that "with fully autonomous AI agents, time-based service-level agreements become irrelevant. Automated intent-based analytics become necessary."[^41] Forrester predicts a publicly disclosed agentic-AI breach in 2026 leading to employee dismissals.[^44] The frame the field is converging on is the runtime fabric — observability, attribution, and policy enforcement embedded into agent execution rather than reconstructed from logs after the fact.[^43][^39][^40]

### §I.2 — The court-admissibility gap

A typical agent telemetry pipeline — JSON events sprayed into a SIEM, Kafka topic, or cloud log group — does not meet the bar that either FRE 902 or the Canada Evidence Act sets for self-authenticating electronic records. U.S. FRE 902(13) admits "a record generated by an electronic process or system that produces an accurate result, as shown by a certification of a qualified person," and 902(14) admits "data copied from an electronic device, storage medium, or file" if "authenticated by a process of digital identification" — the committee note specifies hash-value comparison as the canonical method.[^57] Without hash-value certification or system-integrity attestation, every agent log requires a foundation witness to be admitted at trial.

The Canada Evidence Act runs the same logic with a clearer integrity framework. Section 31.1 places the burden on the proponent to prove authenticity; section 31.2 satisfies the best-evidence rule "on proof of the integrity of the electronic documents system by or in which the electronic document was recorded or stored"; section 31.3 presumes system integrity in the absence of evidence to the contrary if the system "was operating properly" or if the document "was recorded or stored in the usual and ordinary course of business."[^58][^59] Section 31.4 authorises regulations on secure electronic signatures, and SOR/2005-30 specifies the procedure: "application of the hash function to the data to generate a message digest; application of a private key to encrypt the message digest; incorporation in, attachment to, or association with the electronic document of the encrypted message digest" — followed by certificate-based public-key verification.[^60] A PDR signed with Ed25519, hashed with BLAKE3, and Merkle-chained into AgDR Phoenix maps to this procedure verbatim.[^13][^60]

### §I.3 — The regulatory clock

The EU AI Act timeline is concrete and short. Article 12 logging obligations apply to high-risk systems from August 2, 2026, with €35 million / 7%[^36] turnover penalties for prohibited practices and €15 million / 3%[^36] for other infringements. Article 26(6) imposes a six-month minimum log retention floor on deployers; sectoral regulators (EBA, ECB, Banca d'Italia for banks; FINRA + SEC in the U.S.) often extend that to five to ten years for credit-decisioning logs.[^31][^34] Forrester's AEGIS regulatory crosswalk found 80 distinct EU AI Act references across its 39 controls,[^42] making EU AI Act operationally the most demanding framework in the AI governance landscape. The same crosswalk found that 80%[^42] of AEGIS controls map to four or more major frameworks: NIST AI RMF, ISO 42001, OWASP Top 10 for LLMs, MITRE ATLAS, and EU AI Act.[^42]

The U.S. state-level companion arrives June 30, 2026: Colorado SB 24-205 (C.R.S. §6-1-1701 et seq.) requires deployers of high-risk AI systems to implement a risk management policy, complete annual impact assessments, notify consumers of consequential decisions, disclose algorithmic discrimination to the AG within 90 days, and maintain records for at least three years.[^62][^64] The "substantial factor" test treats AI systems as high-risk when their output materially drives a consequential decision in employment, education, financial services, healthcare, housing, insurance, or legal services — the human-in-the-loop defense only works if the human regularly overrides the AI.[^63]

### §I.4 — What the field has been doing instead

The pragmatic answer that has emerged across industry guides — Knowlee, CertifiedData, Claire, MetricStream — is JSONL-as-system-of-record, with downstream feeds to a database (low-cardinality reporting) and a SIEM (security correlation).[^55][^51] Knowlee's April 2026 implementation guide states the architectural rule plainly: "do not let the SIEM dictate the capture format. SIEM event schemas are designed for security events… and lose fidelity when forced to host nested AI inference payloads. The defensible architecture is JSONL as system of record, shipped to the SIEM for security correlation in addition to the database."[^55] VeritasChain's December 2025 analysis of EU AI Act + ESRB systemic-risk + ECB supervisory guidance reaches the inevitable conclusion: traditional logging cannot satisfy the converging requirements for traceability, tamper-evidence, and lifetime integrity.[^38] Cryptographic audit trails — hash chains, digital signatures, signed timestamps — are now the technical foundation regulators implicitly require even when the regulation does not name them.[^38]

> ### Quotable Findings I
> - **Article 12 of EU AI Act 2024/1689** mandates automatic logging across the lifetime of high-risk AI systems; **Article 26(6)** imposes a six-month minimum retention floor on deployers, effective **August 2, 2026**.[^19][^31]
> - On **March 18, 2026**, the **Tribunale di Roma (judgment 4153/2026)** annulled in full Italian Garante Decision 755/2024, wiping out the **€15 million OpenAI fine** — the only final EU GDPR enforcement against a generative-AI provider to date.[^56]
> - **CSA's April 3, 2026** governance-gap research note states that NIST AI RMF 1.0, ISO 42001, and the EU AI Act "were architected before the era of autonomous, tool-calling agents and contain structural gaps that complicate direct application."[^47]
> - **Forrester's AEGIS regulatory crosswalk** found **80 distinct EU AI Act references** mapped across its 39 controls — making EU AI Act the densest framework in agentic-AI governance.[^42]
> - **Colorado SB 24-205** takes effect **June 30, 2026** and imposes a **3-year record retention** floor on deployers of high-risk AI systems, with up to **$20,000 per violation** under the Colorado Consumer Protection Act.[^62][^63]

## Part II — The Composable Stack

### §II.1 — Transaction Intent Schema (TIS)

The TIS, introduced in §3 of arXiv 2601.04583, is the structured envelope an agent submits before acting. Its minimum fields are: `agent_id` (the registered identity executing the action), `principal_id` (the human or organizational authority on whose behalf the agent acts), `intent_hash` (a cryptographic commitment to the action description), `capability_tokens` (delegated permissions scoped to this intent), `scope` (target system, resource, or contract), and `expiry` (an epoch timestamp after which the intent is invalid).[^1][^2] The schema is deliberately settlement-agnostic — it describes what the agent wants to do, not where the action will land.

ERC-8165, opened as PR #1549 by Qin Wang on February 19, 2026, gives the TIS its first onchain entry point: the IntentHub contract.[^5][^6] Its interface exposes `submitIntent(TIS)` and `settleIntent(intent_hash, evidence)`, with a permissionless settlement state machine and an EIP-712 typed-data receipt format.[^6][^7][^8] ERC-8165 explicitly distinguishes itself from ERC-7683 in §4.3: ERC-7683 standardises cross-chain *intents* in a settlement-agnostic way, while ERC-8165 binds intents to *registered agent identities* and produces typed receipts that compose with the broader trust stack.[^11] ERC-PR-1614 (Agent Offchain Conditional Settlement, April 2026) fills in the offchain dispute window for conditional cases — a challenge-response path layered on top of the ERC-8165 onchain receipt.[^12] ERC-8183 (Agentic Commerce Token Standard) layers above ERC-8165 to define the purchase-intent and invoice-settlement flow specifically for agent-initiated commerce.[^9]

### §II.2 — Policy Decision Record (PDR)

The PDR, defined in §4 of arXiv 2601.04583, is the smallest unit of attested decision. Its fields are: `decision` (allow / deny / conditional), `policy_hash` (a commitment to the policy version that produced the decision), `evidence_pointers[]` (an ordered list of cryptographic pointers to inputs the policy engine considered — prompts, retrieved context, tool-call results, human approvals), `timestamp` (the moment of decision), and `signer` (the keypair that signed this PDR, typically tied to the policy engine itself rather than to the agent).[^1][^2] The reference implementation by Aboudjem provides a Solidity contract for a PDR registry plus a TypeScript client that emits PDRs at the policy gate.[^4]

The threat model that arXiv 2601.04583 enumerates is non-trivial. Replay (an attacker reuses a previously-emitted PDR to authorize a new action), evidence substitution (the attacker swaps the underlying evidence after the PDR is signed), and policy-version drift (the policy_hash references a policy version that has since been altered) are the three named attacks. Argmin's April 2026 critical review of TIS+PDR examines these in depth and concludes that mitigations exist but require careful engineering: nonce + timestamp window for replay; commit-and-reveal for evidence pointers; immutable policy version pinning with onchain anchoring for drift.[^4]

### §II.3 — The Three Ethereum Trust Layers

The trust stack composes vertically. ERC-8001 (Agent Identity Registry) is the foundational primitive — it gives every agent a registered, addressable identity that ERC-8165 intents and PDR `agent_id` fields reference.[^10] ERC-8004 (Validation Registry) and ERC-8126 (Verification standard) are the middle layers; ERC-8004 records that a particular execution happened, while ERC-8126 records that an attestor verified the execution against a published policy. ERC-8196 — the subject of paper #9 in this canon — is the execution layer that produces hash-chained receipts of agentic onchain operations.[^31] The composition pattern is straightforward: register identity (ERC-8001 / 8004) → submit TIS via IntentHub (ERC-8165) → emit PDR at the policy gate → execute and produce ERC-8196 hash-chained receipt → wrap in AgDR PPP envelope → anchor Merkle root.

The rule of thumb the field has settled on is: identity, intent, decision, execution, accountability — five layers, each with its own primitive, none of them redundant.

### §II.4 — AgDR (Atomic Genesis Decision Record) Phoenix

AgDR Phoenix (v3.0, released in early 2026) is the accountability envelope that wraps everything below it.[^13][^17] Its core innovation is the PPP triplet — Provenance (where this decision came from in the system), Place (in which jurisdiction and at which physical or logical location it was made), Purpose (what business or operational reason justified it).[^13] Each AgDR record carries an Atomic Kernel Inference (AKI) field that captures the smallest indivisible piece of inference attributable to the agent: a single tool call, a single LLM completion, a single retrieval. The field schema FSv2.1 specifies the byte layout for AKI records, and the v2.7 → v3.0 migration path added a dedicated `pdr_pointer` field linking AgDR records to their generating PDR.[^14][^16][^17]

The cryptographic spine of AgDR Phoenix is BLAKE3 (faster than SHA-256 with comparable security), Ed25519 (compact 64-byte signatures, deterministic per-key), and a Merkle hash chain that produces a single root every batch interval — typically every minute or every thousand records.[^13] The ADR-API spec defines both REST and gRPC ingestion contracts: producers POST or stream individual records; the API batches, hashes, signs, and emits the Merkle root for periodic onchain anchoring.[^18] The Omega release (the predecessor branch to Phoenix) is documented in the AgDR changelog as the AgDR-compatible receipt envelope referenced by ERC-8165 §5.4 — meaning the IntentHub receipt format and the AgDR envelope are designed to compose cleanly.[^15][^16]

### §II.5 — How analyst frameworks slot in

PDR is not a competitor to existing AI governance frameworks — it is the missing field-level primitive they all implicitly require. Forrester's AEGIS framework names six domains (GRC, IAM, data security, application security, threat management, Zero Trust) and introduces three principles: least agency, continuous assurance, and explainable outcomes.[^39][^40] AEGIS's "explainable outcomes" principle has no field-level technical referent in the framework itself; PDR provides one. Forrester's regulatory crosswalk shows that 100% of AEGIS controls reference both NIST AI RMF and ISO/IEC 42001:2023, and 15 controls map across all five frameworks (NIST, EU AI Act, OWASP, MITRE ATLAS, ISO 42001) — meaning a single PDR-shaped capture pattern can satisfy controls across the entire crosswalk.[^42]

Gartner's January 2026 five-workstream cybersecurity program for agentic AI calls for "false positive rate as the key quality metric for incident response" with "automated intent-based analytics" — both of which require the structured TIS+PDR pair to be machine-evaluable.[^41] CSA's AI Controls Matrix (AICM) provides 243 control objectives across 18 domains, mapped to ISO 42001, ISO 27001, NIST AI RMF 1.0, BSI AIC4, and the EU AI Act.[^45] CSA's MAESTRO framework adds threat-modelling vocabulary (orchestrator compromise, sub-agent hijacking, tool ecosystem poisoning) — and AICM's identification, authorization, and auditing dimensions correspond directly to the agent_id, capability_tokens, and PDR/AgDR layers, respectively.[^46] NIST's COSAIS overlays (SP 800-53 Control Overlays for Securing AI Systems) and MITRE's SAFE-AI framework both build on top of NIST AI RMF and provide the federal-sector control catalog into which PDR fields map without conversion.[^48][^49]

> ### Quotable Findings II
> - The **TIS+PDR pair** is the smallest unit of attested decision in agentic AI: TIS captures *what* the agent intends, PDR captures *whether the policy allowed it*, signed at the decision boundary.[^1]
>
> - **ERC-8165 IntentHub** (Qin Wang, PR #1549, Feb 19 2026) provides the first onchain entry point for TIS, with EIP-712 typed-data receipts that compose with AgDR's PPP envelope.[^5][^6]
>
> - **AgDR Phoenix v3.0** uses **BLAKE3 + Ed25519 + Merkle hash chain** with a **PPP triplet (Provenance / Place / Purpose)** and **AKI (Atomic Kernel Inference)** field schema to produce signed, chained, jurisdiction-aware records.[^13]
>
> - **Forrester AEGIS** has **39 substantive controls**; **15 of them map to all five frameworks** (NIST AI RMF, EU AI Act, OWASP, MITRE ATLAS, ISO 42001) — a single PDR-shaped capture pattern can satisfy controls across the whole crosswalk.[^42]
>
> - **CSA's AI Controls Matrix** provides **243 control objectives across 18 domains**, with identification / authorization / auditing dimensions corresponding directly to the agent_id, capability_tokens, and PDR/AgDR layers.[^45]
>
> - The composition rule is: **identity (ERC-8001/8004) → intent (TIS via ERC-8165) → decision (PDR) → execution (ERC-8196) → accountability envelope (AgDR Phoenix)** — five layers, each with its own primitive, none redundant.[^10][^31]

## Part III — Mapping to the Three Compliance Surfaces

### §III.1 — EU AI Act: Articles 12, 13, 26(6), Annex IV(6)

Article 12 of Regulation (EU) 2024/1689 requires high-risk AI systems to "technically allow for the automatic recording of events (logs) over the lifetime of the system" and to maintain logs sufficient for traceability throughout that lifetime, post-market monitoring per Article 72, and serious-incident investigation.[^19][^20] The provisions are concrete: the system must identify inputs sufficiently to follow the trail and reference any persons involved in verification.[^19] Article 26(6) extends the obligation to deployers — "deployers shall keep the logs automatically generated by that high-risk AI system to the extent such logs are under their control … for a period appropriate to the intended purpose … of at least six months."[^31] Article 13 adds an interpretability mandate: deployers must be able to interpret what the system output. Together Articles 12 and 13 form a "compound obligation" — the explanation has to trace back to the underlying record.[^34] Annex IV(6) requires technical documentation of the logging architecture itself.[^19]

The PDR field map is one-to-one. Article 12's "events" are PDR records. "Lifetime" is the AgDR Merkle chain. "Traceability of functioning" is the evidence_pointers field. "Post-market monitoring" is the Article 72 incident pipeline reading from the same JSONL system-of-record.[^55] Article 26(6) deployer retention is satisfied by AgDR's six-month minimum cold tier with PII redaction-on-erasure preserving the hash structure.[^55] Article 13 interpretability is satisfied by the policy_hash + evidence_pointers pair: the deployer can show what policy was applied and what the policy considered. Annex IV(6) is satisfied by publishing the AgDR FSv2.1 schema and the PDR reference implementation as part of the technical file.[^14][^4]

### §III.2 — ISO 42001:2023, NIST AI RMF, and COSAIS

ISO/IEC 42001:2023 §7.5 ("Documented information control") is the standards-track companion to Article 12.[^22] Its three sub-clauses — §7.5.1 general, §7.5.2 creating and updating, §7.5.3 control of documented information — translate to: every PDR is documented information; its creation must be captured; control means tamper-evidence and access governance.[^55] The Knowlee April 2026 implementation guide names ISO 42001 §7.5 as the convergence point of EU + Italian Garante + French CNIL + German BSI guidance for audit-trail field design.[^55]

NIST AI RMF's four core functions map directly onto agent accountability requirements: GOVERN defines accountability policies and delegation authority; MAP identifies high-risk agents and principal hierarchies; MEASURE captures audit log completeness, signing coverage, attribution accuracy, and policy enforcement rate; MANAGE handles incident response and revocation.[^50] The MEASURE function in particular has no satisfactory implementation without a per-decision capture artifact — and PDR is that artifact. NIST's COSAIS overlays (SP 800-53 Control Overlays for Securing AI Systems, concept paper August 2025) build on top of AI RMF and provide the federal-sector control catalog into which PDR fields slot without conversion.[^48] The CSA AICM's 243 control objectives and CSA Lab Space's April 16, 2026 research note on NCCoE's identification / authorization / auditing / non-repudiation framework cover the rest of the U.S. federal-sector standards surface.[^45][^46]

### §III.3 — Court admissibility: FRE 902 and the Canada Evidence Act

The U.S. self-authentication path under FRE 902(13) and 902(14) requires a certification of a qualified person attesting to the accuracy of the electronic process or the hash-value comparison.[^57] PDR satisfies this by construction: the policy engine emits a signed record at the decision boundary; the AgDR Merkle root anchors that record into a tamper-evident chain; an Ed25519 signature certifies the signer; a periodic hash-chain verification report serves as the certification of the qualified person.[^13][^57] The committee note to Rule 902(14) explicitly anticipates "self-authentication by a certification of a qualified person that she checked the hash value of the proffered item and that it was identical to the original" — a procedure the AgDR verification tooling produces directly.[^57]

The Canadian path under sections 31.1 through 31.4 of the Canada Evidence Act is even more direct. Section 31.3 establishes a presumption of integrity if the system "was operating properly" or if the document was "recorded or stored in the usual and ordinary course of business by a person who is not a party."[^59] PDR records emitted in the usual course of agentic operation, captured into AgDR's BLAKE3+Ed25519+Merkle envelope, satisfy the presumption directly.[^59][^60] Section 31.4 + SOR/2005-30 specify the secure-electronic-signature procedure (hash → private-key encrypt → digital-signature certificate); Ed25519 plus the AgDR signer field map to it verbatim.[^60] The threshold for s.31.1 authenticity has been described in case law as "low or modest" — "some evidence of authenticity" sufficient to permit the evidence to be considered for ultimate evaluation.[^61] PDR records vastly overshoot the threshold.

### §III.4 — Colorado SB 24-205 and the U.S. state-level companion

Colorado SB 24-205 (C.R.S. §6-1-1701 et seq.), effective June 30, 2026, imposes deployer obligations that are effectively a state-level mirror of EU AI Act Article 26.[^62][^64] Risk management policy and program; annual impact assessment per high-risk system; pre-decision and post-adverse-decision consumer notice; opt-out and human-review rights; 90-day discovery-to-AG disclosure; three-year record retention.[^62][^63][^64] The "substantial factor" test treats the human-in-the-loop defense as effective only if the human "regularly overrides" the AI — meaning the deployer must produce evidence of override frequency.[^63] PDR's decision field plus the human approval boolean in evidence_pointers produce that evidence directly.

The Pertama Partners February 2026 compliance roadmap orders the work cleanly: AI footprint inventory → high-risk classification → risk management policy → per-system impact assessment → consumer notice deployment → human review documentation → annual AG reporting.[^64] The PDR substrate covers steps 4 through 7 with one capture format. The first three are governance work — Forrester AEGIS GRC-01 + AICM AI inventory + Annex III classification — that PDR does not replace but does instrument.[^45]

### §III.5 — Sectoral DPAs: Garante, CNIL, BSI

The Italian Garante's posture in 2026 is active but uneven. The April 17, 2026 tracking-pixel decision (provvedimento 284) extends GDPR Articles 12+ and Article 32 GDPR security obligations to logging-based mechanisms in email — a direct read-across to PDR-style traceability for AI-driven outreach.[^54] The two February 26, 2026 provvedimenti (10234504 and 10234928) further developed the Garante's Article 32 / accountability / privacy-by-design line.[^53] But on March 18, 2026, the Tribunale di Roma's judgment 4153/2026 annulled the only final EU GDPR enforcement against a generative-AI provider (the €15M OpenAI fine).[^56] The lesson for builders is straightforward: the questions are still live (lawful basis, transparency, breach notification, accountability), but the records you keep must survive a court, not just an enforcement letter.[^56]

The French CNIL's how-to sheet on AI system development is the most prescriptive sectoral DPA guidance currently in force. It explicitly recommends: "log and versioning: tracking and documenting changes to datasets… keep traces of the version of the dataset on which a model has been trained"; "managing clearances, tracking accesses, and analyzing traces" of model and dataset operations; "digital watermarking or signature measures, including hashing" for trained-model traceability.[^52] Every one of these maps to a PDR or AgDR field. The German BSI AIC4 catalog and the BSI's hybrid supervisory model (BNetzA coordinating, BfDI for data protection, BaFin for financial AI, BSI for KRITIS / cybersecurity) round out the sectoral picture.[^33]

> ### Quotable Findings III
> - **EU AI Act Articles 12 + 13** form a compound obligation: log automatically across the lifetime of the system **and** be able to interpret the output by tracing it back to the underlying record — a mandate that has no satisfactory implementation without a per-decision capture artifact.[^19][^34]
> - **ISO 42001:2023 §7.5** is the standards-track convergence point of EU AI Act, Italian Garante, French CNIL, and German BSI guidance for audit-trail field design.[^22][^55]
> - The **NIST AI RMF MEASURE function** requires "audit log completeness, signing coverage, attribution accuracy, and policy enforcement rate" — none of which is implementable without a structured signed decision record.[^50]
> - **FRE 902(14)** committee note explicitly anticipates "self-authentication by a certification of a qualified person that she checked the hash value of the proffered item" — a procedure **AgDR Phoenix verification tooling produces directly**.[^57]
> - The **Canada Evidence Act s.31.3 presumption of integrity** applies if records are "recorded or stored in the usual and ordinary course of business" — meeting the requirement automatically when PDR emission is part of normal agent operation.[^59]
> - The **Tribunale di Roma 4153/2026 OpenAI annulment (March 18, 2026)** wiped out the €15M Garante fine but did not answer the underlying GDPR questions — meaning compliance records must survive a court, not just an enforcement letter.[^56]

## Part IV — Architecture: What You Actually Build

### §IV.1 — The capture path (the hot path)

The capture path runs through five gates, each producing a durable artifact. (1) The agent constructs a TIS and submits it via the IntentHub `submitIntent(TIS)` call.[^5][^6] (2) The policy engine receives the TIS, evaluates against the active policy version, and emits a PDR — Ed25519-signed, BLAKE3-hashed, with policy_hash and evidence_pointers populated.[^1][^4] (3) On allow or conditional decision, the agent executes; the executor emits an ERC-8196 onchain receipt of the action plus a corresponding offchain action record.[^31] (4) The PDR + action record + ERC-8196 receipt are wrapped in an AgDR PPP envelope (provenance, place, purpose) and pushed via the ADR-API into the AgDR ingest pipeline.[^13][^17][^18] (5) The pipeline batches records, computes the BLAKE3 Merkle root every minute (or every 1,000 records, whichever first), signs the root, and anchors it onchain via an ERC-8196 batch transaction.[^13][^31]

The path is deliberately five gates and not three. Each gate produces a separately-verifiable artifact: the IntentHub receipt proves the intent was registered; the PDR proves a policy ruled on it; the ERC-8196 receipt proves the action executed; the AgDR record proves it was envelope-wrapped with PPP context; the Merkle root proves the record is in a chain. Compromise of any single gate does not corrupt the others — the audit trail remains reconstructible from the surviving evidence.[^49][^46]

### §IV.2 — Storage architecture

The storage rule the field has converged on is JSONL system-of-record, with downstream feeds to a database (low-cardinality reporting) and a SIEM (security correlation).[^55] Knowlee's April 2026 guidance: "do not let the SIEM dictate the capture format. SIEM event schemas are designed for security events… and lose fidelity when forced to host nested AI inference payloads."[^55] The defensible architecture is JSONL files at the system boundary, shipped *to* the SIEM rather than emerging *from* it — the SIEM is a downstream consumer, not the primary capture.[^55]

The retention tier structure reflects the regulatory mosaic: hot tier (30 days, JSONL local) for incident response; warm tier (six months, JSONL plus DB index) for EU AI Act Article 26(6) compliance; cold tier (three years, AgDR Merkle batches + minimal index) for Colorado SB 24-205; archive tier (five to ten years, anchored Merkle roots + sparse JSONL retrieval) for sectoral banking / FINRA / SEC requirements.[^31][^62][^34] Personal data subject to GDPR Article 5(1)(e) storage limitation gets handled separately: the PII is redacted on the schedule the documented purpose requires; the hash structure remains intact so the chain stays verifiable.[^55]

### §IV.3 — Identity binding

The agent_id field in PDR and the principal_id field in TIS together carry the burden of attribution. The CSA Lab Space NCCoE concept-paper review identifies four dimensions: identification (a verifiable identity per agent), authorization (capability tokens scoped to deployment context), auditing (logs sufficient to reconstruct decisions), non-repudiation (linkage back to the human authority that sanctioned the action).[^46] The implementing technical standards are OAuth 2.0 and OpenID Connect for authorization flows, SCIM for identity provisioning, SPIFFE/SPIRE for workload attestation, and attribute-based access control for dynamic authorization decisions.[^46]

The DID-based pattern Zylos describes layers on top: each agent gets a Decentralized Identifier with a Verifiable Credential issued by its principal; the VC is referenced in the PDR signer field; cross-organization audit trails resolve via DID registries.[^50] ERC-8001 and ERC-8004 give the onchain side of this — Agent Identity Registry plus Validation Registry — providing a permissionless directory for cross-organization agent_id resolution.[^10] OpenID Foundation's March 2026 RFI submission frames this whole layer as "trust infrastructure" — the inability to automatically verify credentials, constrain permissions, and trace accountability is the most urgent agentic security gap.[^46]

### §IV.4 — Replay, evidence-substitution, and policy-drift defenses

The threat model arXiv 2601.04583 names — replay, evidence substitution, policy-version drift — has clean engineering mitigations. Replay: include nonce + timestamp window in the TIS; reject any submitIntent with a previously-seen nonce or with timestamp outside the validity window; the IntentHub rejects automatically.[^5][^6] Evidence substitution: use commit-and-reveal on evidence_pointers — the PDR commits to the hash of the evidence at decision time, the actual evidence is dereferenceable later from a content-addressed store keyed by that hash.[^4] Policy-version drift: pin policy_hash to an immutable onchain anchor (the ERC-8196 contract maintains a registry of policy versions), and reject any PDR whose policy_hash references an unanchored or revoked version.[^1][^31]

Forrester AEGIS's policy-as-code guardrails (GRC-01 + GRC-08) and the AICM's policy-version controls give the operational frame: every policy change goes through a documented review, gets compiled into machine-evaluable form, gets pinned onchain, and triggers a controlled rotation.[^39][^45] Compromise of the signer key gets handled with key rotation — Ed25519 keys are cheap to rotate; the signer field in PDR carries the key fingerprint, which is invalidated and re-issued through the agent identity registry.[^60]

### §IV.5 — Court-admissibility instrumentation

The instrumentation the audit trail needs to be court-admissible is small but specific. (1) A periodic hash-chain verification report — a Ed25519-signed document attesting that the Merkle chain over a window of records is internally consistent and that the anchored roots match the onchain ERC-8196 entries.[^13][^31] (2) A FRE 902(11)/(12) certification template — the certification of a qualified person, signed and notarized as required, that the JSONL system-of-record produces accurate results and that the hash values match.[^57] (3) A Canada Evidence Act s.31.3 system-integrity declaration — a description of the system's normal operation, the ordinary course of business, and the steps taken to detect malfunction.[^59] (4) A retrieval tool that, given a PDR hash, returns the originating TIS, the ERC-8196 receipt, the AgDR envelope, the Merkle proof to the anchored root, and the verification certificate in a single bundle.[^18]

The bundle is the artifact a litigator actually carries into court. It is also the artifact a regulator's investigator actually requests. Building the retrieval tool early — before any incident or audit — means the field-stress test is run in cooperation with counsel, not under deadline pressure.[^46][^55]

> ### Quotable Findings IV
> - The capture path runs **five gates**, each producing a separately-verifiable artifact: **IntentHub receipt → PDR → ERC-8196 receipt → AgDR PPP envelope → Merkle root anchored onchain**. Compromise of any single gate does not corrupt the others.[^5][^1]
>
> - The defensible storage rule: **JSONL as system-of-record**, with the SIEM as a downstream consumer. SIEM-native capture loses fidelity when forced to host nested AI inference payloads.[^55]
>
> - **Four retention tiers** match the regulatory mosaic: 30-day hot, 6-month warm (Article 26(6)), 3-year cold (Colorado SB 24-205), 5–10-year archive (FINRA / SEC / sectoral banking).[^31][^62]
>
> - Replay, evidence-substitution, and policy-drift attacks all have **clean engineering mitigations**: nonce + timestamp window, commit-and-reveal on evidence_pointers, immutable onchain policy_hash anchoring.[^4][^31]
>
> - The court-admissibility bundle requires four artifacts: **hash-chain verification report, FRE 902(11)/(12) certification, CEA s.31.3 declaration, and a single-bundle retrieval tool** — built *before* any incident, not under deadline pressure.[^57][^59]
>
> - The OpenID Foundation March 2026 RFI submission frames the agent identity layer as **"trust infrastructure"** — the inability to automatically verify credentials, constrain permissions, and trace accountability is the most urgent agentic security gap.[^46]

## Part V — Implementation Playbook

### §V.1 — Day-zero inventory

Before any PDR field is committed, the work that has to be done is governance discovery. Forrester AEGIS GRC-01 (AI inventory) and CSA AICM's AI inventory controls are the canonical starting points: enumerate every AI system in the organization, by provider, version, and data sources.[^39][^45] For each system, complete an Annex III classification with justification — does this system make or substantially influence a consequential decision in employment, education, financial services, healthcare, housing, insurance, or legal services?[^33][^63] Build the provider/operator matrix: who is the provider (typically a vendor), who is the operator (typically the deploying enterprise), and which conformity and logging responsibilities sit with each.[^33]

The output of day-zero is a registry of high-risk systems, each with: a unique system_id, the provider and operator, the Annex III category, the policy version currently in force, and the keys held by the policy engine that emits PDRs for that system. This registry becomes the input to every downstream control.

### §V.2 — Schema decisions

The TIS minimum field set is `{agent_id, principal_id, intent_hash, capability_tokens[], scope, expiry, nonce, timestamp}`.[^1][^5] The PDR minimum field set is `{tis_hash, decision, policy_hash, evidence_pointers[], timestamp, signer, signature}` — note `tis_hash` rather than the full TIS, since the TIS is independently anchored via IntentHub.[^1][^4] The AgDR PPP envelope wrapping the PDR adds `{provenance, place, purpose, aki_records[], pdr_pointer, prev_record_hash, batch_id}` — the `prev_record_hash` field is the per-record link in the chain, while the Merkle root is the per-batch anchor.[^13][^14][^17]

The encoding decision matters. JSON-LD with deterministic canonicalisation (RFC 8785 JCS) is the field's emerging consensus — it allows BLAKE3 hashing to produce stable hash values across implementations, while preserving extensibility through context vocabularies.[^55][^13] Avoid Protocol Buffers as the system-of-record format — the binary representation makes manual inspection and court-admissibility certification harder; use protobuf only as a wire format inside the AgDR ingest pipeline if needed.[^55]

### §V.3 — Engineering checklist

Cryptographic primitives: BLAKE3 for content hashing (faster than SHA-256, equally secure, with built-in keyed hashing useful for HMAC modes); Ed25519 for signatures (compact, deterministic, well-supported across languages); a binary Merkle tree for the per-batch root.[^13] Key management: per-agent Ed25519 keypairs registered to the agent_id in ERC-8001 / ERC-8004; per-policy-engine signing keys rotated on a quarterly cadence (or immediately on any compromise indicator); a separate key for AgDR Merkle root signing held in HSM or TEE.[^10][^46]

Receipt format for ERC-8165 settlement: EIP-712 typed data, with `intent_hash`, `decision_pdr_hash`, `executor_address`, `block_number`, `timestamp`.[^6] The receipt commits to both the action and the decision that authorized it, in a single onchain artifact. AgDR's pdr_pointer field references the PDR hash, closing the loop.[^17] OpenTelemetry instrumentation with GenAI semantic conventions handles the observability side of the same data — the same fields, projected into a tracing system for live monitoring rather than long-term audit.[^50]

Day-2 operations: a daily integrity check that pulls the most recent N AgDR Merkle roots, recomputes them from the JSONL system-of-record, and compares against the onchain ERC-8196 entries; a weekly drill that exercises the retrieval tool against a randomly selected PDR to make sure the bundle assembles correctly; a quarterly rehearsal of the FRE 902(11) certification process with outside counsel.[^49][^57]

### §V.4 — The verification path

The verification path inverts the capture path. Given a PDR hash, the verifier (1) retrieves the PDR from the JSONL system-of-record by content-addressed lookup; (2) verifies the Ed25519 signature against the policy-engine's public key as registered in the agent identity directory; (3) walks the Merkle proof from the PDR's record_hash up to the batch root; (4) confirms the batch root is anchored onchain via the ERC-8196 contract; (5) dereferences each evidence_pointer to the underlying inputs (prompts, retrieved context, tool-call results, human approvals); (6) verifies the policy_hash references an active or properly-archived policy version.[^13][^31][^4]

Each step in the verification path either succeeds or surfaces a specific failure mode. A failed signature suggests key compromise; a failed Merkle proof suggests record tampering; an unanchored batch root suggests a delayed or dropped onchain commit; an inaccessible evidence pointer suggests storage failure or deliberate evidence substitution.[^4] The verification report — produced by the AgDR tooling — is the document a regulator's investigator actually receives.[^46]

### §V.5 — Case study: CASP credit scoring

Crypto-asset service providers (CASPs) deploying AI for credit scoring are squarely inside the EU AI Act high-risk category and squarely inside Article 19(2)'s permission to integrate AI logging into existing financial-services record-keeping.[^35] The ASD Labs April 2026 implementation guide gives the field set: per-application logging of inputs, outputs (risk scores, alerts, decisions), confidence levels, and timestamps; per-decision logging of model version, input data, score produced, and human review or override status.[^35] Mapped to PDR fields: agent_id is the scoring service identity; principal_id is the deploying CASP; intent_hash commits to the application data; capability_tokens scope to "credit decision authority for application X"; the PDR decision field carries allow / deny / conditional; policy_hash references the scoring model + threshold version; evidence_pointers reference the application data, the model version, and the human reviewer's signed approval (if any).[^35][^1]

Article 26(6) deployer retention is six months minimum, but EBA / ECB / Banca d'Italia AI guidance for banks typically extends to five to ten years for credit-decisioning logs.[^34][^55] The reconciliation: AgDR cold tier set to ten years for CASPs, with PII redaction-on-erasure preserving the hash structure and signed integrity proofs.[^55] The Pertama Partners February 2026 compliance roadmap orders the deployer-side work: visibility (AI footprint inventory), policy (formal risk management policy meeting the statute), assessment (per-system impact assessment), engagement (vendor documentation requests), operationalisation (notice and appeal processes, staff training, public statements).[^64] Steps 1–3 are governance; PDR substrate makes steps 4 and 5 mechanical.

### §V.6 — Production patterns: what the early adopters are doing

The pattern wired into the AI Agent Wallet Architecture paper (#9 in this canon) — Coinbase Agentic Wallets, Fireblocks API Co-signer, Squads Protocol, Safe Smart Account — is a useful concrete reference. Each of those production wallets emits action receipts; each composes with ERC-8004 / ERC-8126 / ERC-8196 to produce an audit trail.[^31] The PDR layer slots in cleanly between intent submission (ERC-8165 IntentHub) and execution (the wallet's own MPC or smart-contract action), giving a single attested decision record per transaction.

Knowlee, CertifiedData, and Claire are the industry vendors currently advertising EU AI Act Article 12 conformance — each with their own variant of the JSONL-as-system-of-record pattern.[^55] MetricStream's GRC platform handles the upstream control mapping (registering AI agents as risk assets, mapping NIST controls to a control library, supporting continuous monitoring) and downstream evidence assembly (audit-ready documentation, agent governance decisions, access policies, incident management).[^51] The PDR substrate is what feeds MetricStream's evidence assembly; without it, the GRC platform is generating reports against logs it cannot fully verify.[^51]

> ### Quotable Findings V
> - The TIS minimum field set is **{agent_id, principal_id, intent_hash, capability_tokens, scope, expiry, nonce, timestamp}**; the PDR minimum field set is **{tis_hash, decision, policy_hash, evidence_pointers, timestamp, signer, signature}**.[^1][^5][^4]
> - Use **JSON-LD with deterministic canonicalisation (RFC 8785 JCS)** as the encoding — stable hashes across implementations, extensibility through context vocabularies. Avoid Protocol Buffers for the system-of-record format.[^55][^13]
> - Cryptographic primitives: **BLAKE3** for content hashing, **Ed25519** for signatures, **binary Merkle tree** for the per-batch root. Per-agent keys registered in ERC-8001 / ERC-8004; per-policy-engine keys rotated quarterly.[^13][^10]
> - The **verification path is six steps**: content-addressed PDR lookup → signature verify → Merkle proof → onchain anchor confirm → evidence_pointer dereference → policy_hash check. Each step fails with a specific diagnosis.[^13][^31][^4]
> - For **CASP credit scoring**: AgDR cold tier set to **10 years** to match EBA / ECB / Banca d'Italia retention guidance, with PII redaction-on-erasure preserving the hash structure.[^34][^55]
> - **Knowlee, CertifiedData, Claire, and MetricStream** are the industry vendors currently advertising EU AI Act Article 12 conformance — each layered on top of a JSONL-as-system-of-record pattern.[^55][^51]

## Part VI — Threat Model, Open Questions, Out-of-Scope

### §VI.1 — Threat model

The five attacks worth modelling explicitly: (1) **Replay** — an attacker resubmits a previously-emitted TIS or PDR to authorize a new action; mitigated by nonce + timestamp window in TIS, with IntentHub-side rejection.[^5] (2) **Evidence substitution** — the attacker changes the underlying evidence after the PDR is signed; mitigated by commit-and-reveal on evidence_pointers, with content-addressed storage.[^4] (3) **Policy-version drift** — the policy_hash references a version that has been altered; mitigated by immutable onchain anchoring of policy versions in the ERC-8196 contract.[^31] (4) **Compromised signer key** — the policy engine's signing key leaks; mitigated by quarterly rotation, immediate rotation on any compromise indicator, and per-key verification reports.[^60] (5) **Denial of capture** — the agent or orchestrator skips the policy gate entirely and acts without a PDR; mitigated by orchestrator-level enforcement: no execution path bypasses the IntentHub → policy engine → PDR sequence.[^46]

The CSA MAESTRO threat model adds the multi-agent dimensions — orchestrator compromise, sub-agent hijacking, tool ecosystem poisoning — each of which threatens the capture path differently. PDR is not a defence against these; PDR records the decisions that were made, including the malicious ones. The defence comes from the upstream layers (least agency, capability-token scoping, identity verification) plus the downstream incident response that uses PDR records to reconstruct what happened.[^46][^39]

### §VI.2 — Open questions

Several genuinely unresolved questions remain. **Cross-jurisdictional retention conflicts**: GDPR Article 5(1)(e) storage-limitation versus CEA s.31.2 + sectoral evidence-preservation requirements pull in opposite directions. PII redaction with hash preservation is the working answer, but the legal status of a redacted-but-hashed record under GDPR right-to-erasure (Article 17) is not settled.[^55] **Onchain anchoring proportionality**: every Merkle root anchored onchain costs gas and surfaces metadata. For low-volume agents the cost is negligible; for high-volume agents (millions of decisions per day) the per-decision anchoring cost is non-trivial. Sparse anchoring with offchain signed roots is a working compromise, but its court-admissibility status is untested.[^31] **Cross-border admissibility**: a PDR produced in Germany and litigated in the U.S. relies on FRE 902(13) certification of a foreign system — the procedure exists, but the case law on foreign-emitted hash-chained electronic records is thin.[^57][^61]

The arXiv 2601.04583 paper itself acknowledges these limitations in its evaluation section; Argmin's April 2026 critique adds further dimensions on the policy-engine side (reproducibility of policy evaluation, handling of nondeterministic LLM-based policies).[^4] Expect arXiv 2601.04583 v2 in late 2026 covering at least the multi-agent extension and the redaction/erasure problem.

### §VI.3 — Out of scope

Three categories this paper deliberately does not cover. **Voice-first or telephony agent variants** — a separate tooling category with separate acoustic-evidence considerations, outside the scope of the PDR substrate. **Specific framework comparisons** (LangChain vs CrewAI vs AutoGen vs ...) — the PDR substrate is framework-agnostic; the comparison is not load-bearing for the audit-trail thesis. **Domain-specific compliance thresholds** (HIPAA-defined minimum retention for healthcare AI; MAR-defined record format for trading AI; ECOA-defined adverse-action notice content for U.S. credit decisions) — these are real and important, but they are policy_hash-level decisions inside the same PDR substrate, not different substrates.

### §VI.4 — Where the field is going

NIST CAISI's AI Agent Standards Initiative — launched February 17, 2026 — will produce formal control overlays through 2026 and 2027.[^51] The March 31, 2026 draft on automated benchmark evaluations is the precursor to how auditors and regulators will assess agent deployments.[^51] ERC-8165 has filed the PR; finalization (assignment of a formal EIP number, freeze of the typed-data receipt format) is expected in late 2026.[^5][^6] AgDR's roadmap continues v3.x point releases through 2026.[^16][^17] The Digital Omnibus remains uncertain — the Council voted March 13, 2026 for postponement of high-risk obligations to December 2027, but the postponement is not in force until formal adoption.[^33] EU AI Act enforcement begins August 2, 2026 against the original date.[^33][^37]

The single biggest expected change: arXiv 2601.04583 v2 covering multi-agent PDR composition (one decision authorizing a chain of sub-agent actions, each with its own PDR linked back to the parent). When that lands, this paper's §IV.4 mitigations will need a small extension; the rest of the substrate is forward-compatible.[^1][^4]

## Closing

The infrastructure shift is from logging to attesting. PDR is the smallest unit of attested decision: the field-level primitive every AI governance framework implicitly requires but none has named. Composed with intent (TIS), identity (ERC-8001 / ERC-8004), execution (ERC-8196), settlement (ERC-8165), and accountability envelope (AgDR Phoenix), it is the substrate that lets a single capture survive Article 12, Article 26(6), ISO 42001 §7.5, NIST AI RMF MEASURE, FRE 902(13)/(14), Canada Evidence Act s.31.3, and Colorado SB 24-205 — without rebuilding under deadline pressure when the regulator or court arrives.

Builders who treat audit-trail capture as a first-class engineering surface — the same way they treat authentication or payment processing — ship faster, defend cleaner, and absorb regulatory change without panic. Builders who treat it as a compliance afterthought rebuild the trail under deadline, in the worst possible conditions, with the worst possible evidence. The choice is upstream of August 2, 2026, and upstream of every consequential agent decision after it.

The tooling is in place. The field manual is now in your hands.

## Related Research

This paper composes the audit-trail substrate that prior canon paper #9 ([The AI Agent Wallet Architecture](/research/ai-agent-wallet-architecture-erc-8196)) leaves implicit when it builds the ERC-8196 hash-chained execution layer for production agent wallets. The trust-stack frame (B2A, MCP, GEO, Agent Payment Stack) — established in [The B2A Imperative](/research/b2a-2026), [The MCP Server Playbook](/research/mcp-server-playbook), [GEO/AEO 2026](/research/geo-2026), and [The Agent Payment Stack 2026](/research/agent-payment-stack-2026) — runs through PDR at the decision layer.

## Glossary

**PDR** — Policy Decision Record. Signed structured record of a policy gate's decision on an agent action.
**TIS** — Transaction Intent Schema. Structured envelope an agent submits before acting.
**IntentHub** — Onchain entry point for TIS submission, defined in ERC-8165.
**AgDR** — Atomic Genesis Decision Record. Phoenix v3.0 accountability envelope wrapping PDR + execution receipt.
**PPP** — Provenance / Place / Purpose. The three-dimensional context triplet of every AgDR record.
**AKI** — Atomic Kernel Inference. Smallest indivisible piece of inference attributable to an agent.
**BLAKE3** — Cryptographic hash function used across the PDR / AgDR stack for content hashing.
**Ed25519** — Compact deterministic signature scheme used for PDR and AgDR signatures.
**Merkle chain** — Per-batch hash tree producing a single signable root for many records.
**ERC-8001** — Agent Identity Registry (precursor primitive to ERC-8004).
**ERC-8004** — Validation Registry. Records that an execution happened.
**ERC-8126** — Verification standard. Records that an attestor verified an execution.
**ERC-8196** — Hash-chained execution audit standard for agentic onchain operations.
**ERC-8165** — Agentic Onchain Operations / IntentHub (Qin Wang, PR #1549, Feb 19 2026).
**ERC-8183** — Agentic Commerce Token Standard layered above ERC-8165.
**ERC-7683** — Cross-chain intents (settlement-agnostic, predecessor to ERC-8165).
**COSAIS** — NIST SP 800-53 Control Overlays for Securing AI Systems.
**MAESTRO** — CSA's Multi-Agent Extensible Threat Reference for Orchestrated Operations.
**AEGIS** — Forrester's Agentic AI Enterprise Guardrails for Information Security.
**AICM** — CSA's AI Controls Matrix (243 controls across 18 domains).
**CAISI** — NIST's Center for AI Standards and Innovation.
**NCCoE** — National Cybersecurity Center of Excellence (NIST). Author of the AI agent identity concept paper.
**DID / VC** — Decentralized Identifier and Verifiable Credential.
**SPIFFE / SPIRE** — Workload identity attestation standard and reference implementation.
**FRE 902(13)/(14)** — U.S. Federal Rules of Evidence self-authentication for electronic records.
**CEA s.31.1–31.4** — Canada Evidence Act sections governing electronic-document authenticity.
**Article 12** — EU AI Act Regulation 2024/1689 logging obligation for high-risk AI systems.
**Article 26(6)** — EU AI Act six-month minimum log retention for deployers.
**Annex III** — EU AI Act high-risk system classification list.
**Colorado SB 24-205** — C.R.S. §6-1-1701 et seq.; Colorado AI Act, effective June 30, 2026.

## References

[^1]: arXiv preprint 2601.04583v1 (2026), *Transaction Intent Schemas and Policy Decision Records: A Composable Audit Primitive for Agent-Initiated Onchain Operations* (abstract). https://arxiv.org/abs/2601.04583
[^2]: arXiv preprint 2601.04583v1 (2026), full PDF. https://arxiv.org/pdf/2601.04583v1.pdf
[^3]: arXiv preprint 2601.04583v1 (2026), HTML view. https://arxiv.org/html/2601.04583v1
[^4]: M. Aboudjem et al. (2026), *PDR Reference Implementation* (Solidity registry + TypeScript client). https://github.com/aboudjem/pdr-reference-impl
[^5]: Qin Wang / Ethereum EIPs (2026-02-19), *ERC-8165: Agentic Onchain Operations / IntentHub* (PR #1549). https://github.com/ethereum/EIPs/pull/1549
[^6]: Ethereum Improvement Proposals (2026), *ERC-8165: Agentic Onchain Operations*. https://eips.ethereum.org/EIPS/eip-8165
[^7]: eip.tools (2026), *ERC-8165 indexed view*. https://eip.tools/eip/8165
[^8]: Ethereum Magicians (2026), *ERC-8165 IntentHub discussion thread*. https://ethereum-magicians.org/t/erc-8165-agentic-onchain-operations-intenthub/22847
[^9]: Ethereum Improvement Proposals (2026), *ERC-8183: Agentic Commerce Token Standard*. https://eips.ethereum.org/EIPS/eip-8183
[^10]: Ethereum Improvement Proposals (2026), *ERC-8001: Agent Identity Registry*. https://eips.ethereum.org/EIPS/eip-8001
[^11]: Ethereum Improvement Proposals (2025), *ERC-7683: Cross-Chain Intents*. https://eips.ethereum.org/EIPS/eip-7683
[^12]: Ethereum EIPs (2026-04), *ERC-PR-1614: Agent Offchain Conditional Settlement*. https://github.com/ethereum/EIPs/pull/1614
[^13]: AgDR Standards Organization (2026), *AgDR Phoenix Specification (v3.0)*. https://www.agdr.dev/spec/phoenix
[^14]: AgDR Standards Organization (2026), *AgDR Field Schema v2.1*. https://www.agdr.dev/spec/fsv2.1
[^15]: AgDR Standards Organization (2025), *AgDR Omega Release*. https://www.agdr.dev/releases/omega
[^16]: AgDR Standards Organization (2026), *AgDR Changelog*. https://www.agdr.dev/changelog
[^17]: AgDR Standards Organization (2026), *AgDR v3.0 Phoenix Release*. https://www.agdr.dev/v3.0
[^18]: AgDR Standards Organization (2026), *AgDR ADR-API Specification*. https://www.agdr.dev/spec/adr-api
[^19]: European Union (2024-06-13), *Regulation (EU) 2024/1689 — Artificial Intelligence Act* (CELEX:32024R1689). https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689
[^20]: AI Act Info (2026), *EU AI Act Article 12: Practical Guide*. https://www.aiact-info.eu/article/12
[^22]: ISO/IEC (2023), *ISO/IEC 42001:2023 — Artificial Intelligence Management Systems*. https://www.iso.org/standard/81230.html
[^23]: National Institute of Standards and Technology (2023, GenAI Profile 2024), *AI Risk Management Framework*. https://www.nist.gov/itl/ai-risk-management-framework
[^31]: Future of Life Institute (2024-2026), *EU AI Act Article 26: Obligations of Deployers of High-Risk AI Systems*. https://artificialintelligenceact.eu/article/26/
[^33]: Alec Chizhik / SecurityToday (2026-04-28), *EU AI Act launches Aug 2, yet high-risk oversight gap persists*. https://www.securitytoday.de/en/2026/04/28/eu-ai-act-high-risk-deadline-august-2026-supervisory-gap/
[^34]: dwillis / Fintech Global (2026-05-07), *EU AI Act: Three obligations reshaping comms surveillance*. https://fintech.global/2026/05/07/eu-ai-act-three-obligations-reshaping-comms-surveillance/
[^35]: ASD Labs (2026-04-27), *EU AI Act Compliance for CASPs — August 2026 Guide*. https://www.asdlabs.io/post/eu-ai-act-compliance-casps
[^36]: Fiona Jackson / TechRepublic (2025-08-01), *EU AI Act: Tech Firms Concerned About Aug. 2 Deadline*. https://www.techrepublic.com/article/news-eu-ai-act-gpai-models/
[^37]: Deep Identity (2026-05-04), *EU AI Act Hits 90 Days: What High-Risk Financial Systems Must Do Before August 2*. https://www.deepidv.com/media/news/eu-ai-act-high-risk-financial-90-days-may-2026
[^38]: VeritasChain Standards Organization (2025-12-31), *The Convergence of AI Regulation in Financial Markets: EU AI Act, ESRB, and ECB*. https://veritaschain.org/blog/posts/2025-12-31-eu-ai-act-convergence/
[^39]: Jeff Pollard / Forrester (2025-08-04), *Introducing The AEGIS Security Framework For Agentic AI*. https://www.forrester.com/blogs/introducing-aegis-the-guardrails-cisos-need-for-the-agentic-enterprise/
[^40]: Forrester Research (2026-04-16), *The AEGIS Framework: Enterprise Guardrails For Securing Agentic AI*. https://www.forrester.com/technology/aegis-framework/
[^41]: Jeremy D'Hoinne, Dionisio Zumerle / Gartner via Armorcode (2026-01), *How to Secure Enterprise Agentic AI Ambition*. https://www.armorcode.com/report/gartner-research
[^42]: Jeff Pollard / Forrester (2025-10-22), *AI Governance Crosswalk: AEGIS Maps NIST, ISO, EU AI Act*. https://www.forrester.com/blogs/forrester-aegis-the-new-standard-for-ai-governance/
[^43]: Enza Iannopollo / Forrester (2026-03-18), *The Future Is Now: Agentic AI Redefines Responsible AI*. https://www.forrester.com/blogs/the-future-is-now-agentic-ai-redefines-responsible-ai/
[^44]: Phil Muncaster / Infosecurity Magazine (2025-10-02), *Forrester: Agentic AI-Powered Breach Will Happen in 2026*. https://www.infosecurity-magazine.com/news/forrester-agentic-ai-breach-2026/
[^45]: Cloud Security Alliance (2026), *AI Controls Matrix (AICM): Framework for Trustworthy AI*. https://cloudsecurityalliance.org/aicm
[^46]: Cloud Security Alliance Lab Space (2026-04-16), *NIST AI Agent Standards: Listening Sessions and Emerging Controls*. https://labs.cloudsecurityalliance.org/research/csa-research-note-nist-ai-agent-standards-20260416-csa-style/
[^47]: Cloud Security Alliance Lab Space (2026-04-03), *The AI Agent Governance Gap: What CISOs Need Now*. https://labs.cloudsecurityalliance.org/research/csa-research-note-ai-agent-governance-framework-gap-20260403/
[^48]: Victoria Yan Pillitteri / NIST CSRC (2025-08-13), *SP 800-53 Control Overlays for Securing AI Systems (COSAIS): Concept Paper*. https://csrc.nist.gov/csrc/media/Projects/cosais/documents/NIST-Overlays-SecuringAI-concept-paper.pdf
[^49]: J. Kressel, R. Perrella / MITRE ATLAS (2025-05-30), *SAFE-AI Framework Full Report*. https://atlas.mitre.org/pdf-files/SAFEAI_Full_Report.pdf
[^50]: Zylos Research (2026-03-22), *AI Agent Accountability: Audit Trails, Attribution, and Non-Repudiation in Multi-Agent Systems*. https://zylos.ai/research/2026-03-22-ai-agent-accountability-audit-trails-attribution-multi-agent-systems
[^51]: MetricStream (2026), *NIST's AI Agent Standards Initiative*. https://www.metricstream.com/blog/nists-ai-agent-standards-initiative.html
[^52]: CNIL (2026), *Ensuring the security of an AI system's development*. https://www.cnil.fr/fr/node/165855
[^53]: Italian Garante per la Protezione dei Dati Personali (2026), *Intelligenza artificiale*. https://www.garanteprivacy.it/home/docweb/-/docweb-display/docweb/9101600
[^54]: Italian Garante per la Protezione dei Dati Personali (2026-04-17), *Provvedimento del 17 aprile 2026 — Linee Guida tracking pixel*. https://www.garanteprivacy.it/home/docweb/-/docweb-display/docweb/10241943
[^55]: Knowlee (2026-04-27), *AI Audit Trail: Implementation Guide for EU AI Act Article 12*. https://www.knowlee.ai/blog/ai-audit-trail-implementation-guide
[^56]: Shephard / notraced (2026-04-18), *The Court of Rome just annulled the €15M OpenAI fine. What it changes and what it doesn't*. https://notraced.com/articles/court-of-rome-annuls-openai-fine
[^57]: U.S. House of Representatives Office of the Law Revision Counsel, *28 USC App. Federal Rules of Evidence Rule 902: Evidence That Is Self-Authenticating*. https://uscode.house.gov/view.xhtml?edition=prelim&num=0&req=granuleid%3AUSC-prelim-title28a-node232-article9-rule902
[^58]: Department of Justice Canada, *Canada Evidence Act, section 31.1 — Authentication of electronic documents*. https://laws.justice.gc.ca/eng/acts/c-5/section-31.1.html
[^59]: Department of Justice Canada, *Canada Evidence Act, sections 31.2–31.4 — Application of best evidence rule, presumption of integrity, electronic signatures*. https://laws.justice.gc.ca/eng/acts/c-5/section-31.2.html
[^60]: Department of Justice Canada, *Secure Electronic Signature Regulations (SOR/2005-30)*. https://laws-lois.justice.gc.ca/eng/regulations/sor-2005-30/FullText.html
[^61]: Criminal Law Notebook (2026), *Electronic Documents and Records*. https://criminalnotebook.ca/index.php?mobileaction=toggle_view_mobile&title=Electronic_Documents_and_Records
[^62]: Colorado General Assembly, *SB24-205: Consumer Protections for Artificial Intelligence*. https://leg.colorado.gov/bills/SB24-205
[^63]: CO-AIMS Compliance Team (2026-01-31), *Colorado AI Act Full Text: SB 24-205 Annotated (2026)*. https://co-aims.com/blog/colorado-ai-act-complete-text-annotated
[^64]: Michael Lansdowne Hauge / Pertama Partners (2026-02-12), *Colorado AI Act SB24-205: Compliance Guide*. https://www.pertamapartners.com/insights/colorado-ai-act-sb24-205-compliance-guide

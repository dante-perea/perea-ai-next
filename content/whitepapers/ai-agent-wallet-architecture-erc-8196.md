---
title: "AI Agent Wallet Architecture: ERC-8196 and the 2-of-3 Threshold"
subtitle: "Cryptographically enforced policy compliance, MPC threshold signing, master/hot/agent key separation, and blast-radius limits for autonomous on-chain agents"
publication: "perea.ai Research"
authors: ["Dante Perea"]
version: "1.0"
status: "Scheduled"
date: "2026-05"
audience: "CISOs, blockchain protocol engineers, AI agent platform architects, custody compliance teams, AICPA auditors evaluating SOC 2 controls for agent-initiated on-chain transactions, and founders building agentic commerce infrastructure who need to make architectural choices in 2026 that will not implode under SEC and CFTC guidance arriving 2027-2028."
length: "~8,000 words"
license: "CC BY 4.0"
description: "A technical playbook synthesizing 80 sources on the architecture of AI agent wallets as of May 2026: the ERC-8004/8126/8196 three-layer trust stack, MPC threshold signing protocols, master/hot/agent key separation with 2-of-3 thresholds, on-chain policy enforcement primitives, and the production patterns from Coinbase Agentic Wallets, Fireblocks API Co-signers, Squads Protocol v4, and Safe Smart Account allowance modules — anchored against the February 2025 Bybit/Safe heist as the controlling negative case."
profile: "technical-playbook"
dateModified: "2026-05-09"
version_history:
  - { version: "1.0", date: "2026-05-09", note: "initial publication" }
topical_entities:
  - "AI agent wallets"
  - "ERC-8196"
  - "ERC-8004"
  - "ERC-8126"
  - "MPC threshold signing"
  - "DKLs23"
  - "Coinbase Agentic Wallets"
  - "Fireblocks MPC-CMP"
  - "Squads Protocol"
  - "Safe Smart Account"
  - "x402"
  - "Bybit hack"
keywords:
  - "AI agent wallet architecture 2026"
  - "ERC-8196 specification"
  - "MPC threshold signing for AI agents"
  - "2-of-3 threshold key separation"
  - "Coinbase Agentic Wallets architecture"
  - "Fireblocks MPC-CMP enterprise custody"
  - "Squads Protocol AI agent multisig"
  - "Safe Smart Account allowance module"
  - "Bybit Safe wallet UI compromise"
  - "agent transaction policy enforcement"
  - "agent blast radius limits"
  - "x402 ACP AP2 protocol stack"
---

## Foreword: The Architectural Question Hidden Inside the Bybit Heist

On February 21, 2025, at approximately 12:30 PM UTC, Bybit detected unauthorized activity inside one of its Ethereum cold wallets during a routine internal transfer.[^65] By the time the transfer completed, 401,347 ETH (a $1.46 billion sum[^80]) had moved to an unidentified address — a heist that, per Arkham Intelligence, is the single largest financial theft in history, exceeding the $1 billion Central Bank of Iraq theft of 2003.[^80] Within hours, on-chain forensic investigator ZachXBT had publicly attributed the attack to North Korea's Lazarus Group; within days, the FBI confirmed the attribution under the cluster name "TraderTraitor" and published 51 specific Ethereum addresses linked to the laundering operation.[^65][^61]

The attack was not a smart-contract exploit. The Safe multisig contract performed exactly as designed: it accepted three valid signatures from three authorized Bybit signers and executed the resulting transaction. The compromise lived one layer below cryptography and one layer above the smart contract — at the user interface that converts a human's intent into a transaction payload and shows that payload to signers for review. Forensic investigations by Sygnia, Verichains, and the Safe Ecosystem Foundation itself established that on February 19, attackers had injected malicious JavaScript into Safe's AWS S3 / CloudFront-served front-end via a compromised Safe developer machine, and that the injected code targeted only Bybit's specific contract address.[^62][^64] Bybit's signers reviewed a UI that showed a routine transfer; their hardware wallets received a different payload — one whose function selector encoded a `delegatecall` instead of a native ETH transfer, which redirected the cold wallet's proxy implementation to attacker-controlled code.[^63][^77]

The architectural lesson is the one NCC Group named in its post-mortem: a multi-signature wallet does not provide policy enforcement. It provides quorum verification of intent, where intent is whatever payload the front-end produces. If the front-end is dishonest and the signer cannot audit the payload outside the front-end, the multisig executes the dishonest intent. NCC Group's recommended fix — "an internal service that checks transactions against predefined policies" before broadcast[^63] — is the exact primitive that Ethereum's ERC-8196 Draft (March 14, 2026) and Coinbase's Agentic Wallets (February 11, 2026) now codify into a programmable, machine-enforced layer between agent intent and signature broadcast.[^1][^51]

This paper synthesizes 80 distinct sources — Ethereum Improvement Proposals, MPC research, production-wallet documentation, incident postmortems, analyst frameworks, and a peer-reviewed arXiv survey of 317 prior works — into one technical playbook on AI agent wallets in 2026, anchored against Bybit as the negative case. The thesis is a stack: ERC-8004 to register the agent, ERC-8126 to verify it, ERC-8196 to constrain execution, MPC threshold signing to enforce the constraint, a 2-of-3 master/hot/agent separation to bound blast radius, and a programmable policy engine running before signature broadcast.

## Quotable Findings — Foreword

1. Per the FBI's February 26, 2025 Public Service Announcement[^65], approximately $1.5 billion in virtual assets were stolen from Bybit on or about February 21, 2025 by a North Korean cluster the Bureau tracks as "TraderTraitor," with 51 specific Ethereum addresses listed as holding or having held the stolen funds.
2. Per NCC Group's technical post-mortem[^63], the Bybit attack pivoted on a single transaction parameter — the operation type set to `1` (delegatecall) instead of a native ETH transfer — which redirected the Bybit Safe's proxy implementation to attacker-controlled code, allowing extraction of the entire wallet balance.
3. Per the Safe Ecosystem Foundation's confirmation reported by BleepingComputer on February 26, 2025[^62], "this attack targeted to the Bybit Safe was achieved through a compromised Safe{Wallet} developer machine resulting in the proposal of a disguised malicious transaction."
4. Per the ERC-8196 Draft published to eips.ethereum.org on March 14, 2026[^1], implementations "execute transactions only when accompanied by verifiable cryptographic proof that the action complies with a specific policy defined by the asset owner."
5. Per WalletWitness's blockchain forensic walkthrough[^80], the Bybit attack drained 401,347 ETH plus 90,300 stETH, 15,000 cmETH, and 8,000 mETH — and per Arkham Intelligence cited in that walkthrough, this is the single largest financial heist in history, exceeding the $1 billion Central Bank of Iraq theft of 2003.
6. Per Decrypt's launch coverage of Coinbase Agentic Wallets on February 12, 2026[^51], Coinbase head of engineering Erik Reppel framed the new design as "several orders of magnitude safer than just having a private key on disk."

## Executive Summary: The Three-Layer Trust Stack and the 2-of-3 Threshold

The architectural answer that emerged in 2025-2026 to the question "how does an autonomous AI agent hold and spend money safely" is a three-layer Ethereum trust stack composed at runtime with a small set of cryptographic primitives and an opinionated operational pattern.

**Layer 1 — Register.** ERC-8004 (Trustless Agents Registry, August 2025) gives every agent a `uint256 agentId` minted into an on-chain Identity Registry, with sibling sub-registries for Validation and Reputation that other contracts can query.[^4] Sibling minimal registries (ERC-8122, December 2025) and ENS-trust-aware registries (ERC-8107, December 2025) layer on for ecosystems that want lighter-weight identity, while earlier ERC-7662 (March 2024) and ERC-7857 (January 2025) define agent-as-NFT primitives for ecosystems where the agent identity itself needs to be transferable.

**Layer 2 — Verify.** ERC-8126 (AI Agent Verification, January 15, 2026, in Review) defines the off-chain verification interface for ERC-8004-registered agents, covering seven verification types (ETV, MCV, SCV, WAV, WV, PDV, QCV) and producing a unified risk score on a 0-100 scale where 0 is the lowest risk.[^3] Verification providers MAY post final risk scores along with Proof IDs as attestations into ERC-8004's Validation Registry, making the verification result on-chain queryable.

**Layer 3 — Execute.** ERC-8196 (AI Agent Authenticated Wallet, March 14, 2026 Draft) defines the smart-contract execution layer. The `IAIAgentAuthenticatedWallet` interface requires three operations — `registerPolicy`, `executeAction` with an `entropyCommitment` (bytes32), and `getAuditTrail` — and binds every agent action to a Policy struct whose fields include `policyId`, `agentAddress`, `ownerAddress`, `allowedActions`, `allowedContracts` whitelist, `blockedContracts` blacklist, `maxValuePerTx` (uint256 wei), `maxValuePerDay`, `validAfter`, `validUntil`, and `minVerificationScore`.[^1] Implementations MUST verify ERC-8004 registration before policy delegation and MUST perform an ERC-8126 verification check before any action, rejecting the action if the agent's current risk score exceeds the policy's `minVerificationScore`.

Below the ERC stack sits the cryptographic primitive that makes the policy load-bearing: MPC threshold signing. The protocol landscape converged in 2024-2025 onto a small set of choices: the DKLs23 family (Doerner-Kondi-Lee-shelat 2023) for fast hot-path signing in three rounds with presignatures, FROST for the EdDSA equivalent on Curve25519, GG18 and GG20 still appearing in legacy systems, CGG21 / CMP variants where identifiable abort matters for forensic provability, and 2PC-MPC for the sub-second multi-party signing scenarios that thousand-agent topologies will require.[^14][^17][^29] Coinbase's open-source `cb-mpc` library implements EC-DKG and threshold ECDSA over secp256k1 plus Schnorr signing over Curve25519 in one library — covering EVM and Solana with the same cryptographic discipline — and Fireblocks' MPC-CMP, open-sourced under a limited license in August 2023, "signs transactions 8x faster than standard MPC and requires just 1 signing round versus 9 in the GG18 industry standard."[^29]

Above the cryptography sits the operational pattern: a 2-of-3 threshold across three distinct key roles. **Master** is held by the asset owner, never online, used only to authorize policy changes and recoveries. **Hot** is held by the operator (ops team or platform), always online, used to co-sign agent transactions and to rotate the agent's share. **Agent** is held inside the agent's TEE, used to co-sign within policy bounds, with no extraction path. Because no single share holder — including the agent — can act unilaterally, the wallet's blast radius is bounded by what 2-of-3 will authorize, and the agent's effective spending power is bounded by the Policy struct's `maxValuePerTx` and `maxValuePerDay` caps.

This is not a thought experiment. It ships in production today across four reference architectures: Coinbase's Agentic Wallets (February 11, 2026, with `cb-mpc` + AWS Nitro Enclave + native x402, on top of CDP Server Wallets v2 which has been GA since July 24, 2025 and which had processed 107 million agent transactions cumulatively by the Agentic Wallets launch);[^5][^11] Fireblocks' API Co-signer (MPC-CMP across Intel SGX, AWS Nitro, and GCP Confidential Spaces, securing more than $5 trillion in digital asset transfers annually with over 95 banks live);[^29][^71] Squads Protocol v4 (Solana, immutable since November 2024, formally verified by Certora, securing more than $10 billion across 350+ teams);[^28] and Safe Smart Account allowance modules on Ethereum (the multi-agent 2-of-4 setup pattern that emerged after the Bybit incident as the conservative production default).[^36] Above the wallet sits a four-layer agentic commerce stack — x402 (settlement), ACP (checkout), AP2 (authorization mandates), MPP (session billing) — that composes with the wallet's signing surface but does not yet have a single dominant standard.[^75][^76]

## Quotable Findings — Executive Summary

1. Per the ERC-8196 specification at eips.ethereum.org[^1], the Policy struct fields include `policyId` (bytes32), `agentAddress`, `ownerAddress`, `allowedActions`, `allowedContracts` whitelist, `blockedContracts` blacklist, `maxValuePerTx` (uint256 wei), `maxValuePerDay`, `validAfter`, `validUntil`, and `minVerificationScore` (uint8, 0-100 where 0 is lowest risk).
2. Per the Fireblocks "What is MPC" explainer[^29], the Fireblocks MPC-CMP protocol "signs transactions 8x faster than standard MPC and requires just 1 signing round versus 9 in the GG18 industry standard," and the protocol is open-sourced under a limited license for inspection by cryptographers and auditors.
3. Per the Squads Smart Account Program mainnet announcement[^28], Squads Protocol v4 is "fully audited by OtterSec and formally verified by Certora," securing more than $10 billion in value across 350+ teams with $3 billion+ in stablecoin transfers processed.
4. Per the Coinbase Agentic Wallets explainer[^5], Coinbase processed 107 million agent transactions between the May 2025 CDP Server Wallets v2 GA and the February 11, 2026 Agentic Wallets launch.
5. Per Vultisig's DKLs23 production transition documentation[^17], the protocol is "5-10x faster than GG20" and was rolled into production in early 2025.
6. Per the Fireblocks-Thales February 10, 2026 PR Newswire announcement[^71], Fireblocks secures more than $5 trillion in digital asset transfers annually with over 95 banks live in production environments.
7. Per ERC-8126's January 15, 2026 specification[^3], "detailed verification results are accessible only to the AI agent's wallet holder and include a unified risk score (0-100) to help users assess the agent's trustworthiness."

## Part I — The Anti-Pattern: How a Heist Happened in 35 Lines of JavaScript

The Bybit attack is worth dissecting in detail because it is the controlling negative case for every architectural choice in this paper. The Safe smart contract performed correctly. The MPC was not involved. The hardware wallets the signers used were not compromised. The attack succeeded by exploiting an assumption — that the front-end producing the transaction payload is honest, and that human signers can audit a `delegatecall` parameter from a hardware-wallet display.

**The setup.** Forensic analysis by Sygnia and Verichains, published two days after the attack and corroborated by NCC Group, BleepingComputer, DARKNAVY, WalletWitness, CoinCentral, and the Safe Ecosystem Foundation itself, established that on February 19, 2025 at 15:29:25 UTC, attackers replaced a benign JavaScript file at `app.safe.global` with malicious code.[^62][^64][^77][^80] The injection vector was a compromised Safe developer's machine, from which the attackers exfiltrated AWS session tokens that gave them write access to the S3 bucket and CloudFront distribution serving the Safe front-end. Sygnia's forensic conclusion, reported by BleepingComputer, was unambiguous: "AWS S3 or CloudFront account/API Key of Safe.Global was likely leaked or compromised."[^62]

The malicious code was conditional. It targeted only Bybit's specific contract address; for every other Safe user, the front-end behaved normally. This selectivity is what made the compromise survive for two days without detection — the attackers had a payload tailored to one high-value target and a front-end that looked clean to everyone else. Web archives captured both versions: the original JavaScript on February 19 morning, and the tampered version later that day.[^64]

**The execution.** On February 21 at 12:30 PM UTC, Bybit's operations team initiated a routine cold-to-hot wallet transfer. The Safe UI rendered a transaction summary that looked like a normal ERC-20 native transfer; the underlying payload sent to the three signers' hardware wallets encoded a `delegatecall` (operation type `1`) with the transfer amount set to zero and a malicious token contract whose registered name was empty.[^77] All three required signers approved the transaction without manually verifying the `delegatecall` payload on their hardware-wallet displays — a hard task because hardware wallets render the raw payload bytes in a format that requires forensic-grade attention to parse.

The Safe contract did exactly what its rules said. It received three valid signatures from three authorized signers and executed the corresponding transaction. The transaction was a `delegatecall` that repointed the Bybit cold wallet's proxy implementation to attacker-controlled code. The next line of attacker code drained the wallet: 401,347 ETH plus 90,300 stETH, 15,000 cmETH, and 8,000 mETH.[^80]

**The lesson.** A multi-signature wallet is not a policy engine. It is a quorum verifier, where the quorum verifies whatever payload the front-end produces. If the front-end is dishonest and the signers cannot audit the payload outside the front-end, the multisig executes the dishonest payload. NCC Group's recommendation in its post-mortem named the missing primitive: "It might have been useful to have an internal service that checks transactions against predefined policies, which may have prevented this attack."[^63] That "internal service" is, two years later, the policy engine inside Coinbase Agentic Wallets and the Policy struct inside ERC-8196 — the architectural answer this paper traces in full.

**The recovery economics matter too.** Per Bybit CEO Ben Zhou (April 2025)[^80], 68.57%[^80] of stolen funds remained traceable, 27.95% had gone dark, 3.84% were frozen.[^80] Mantle's mETH Protocol froze 15,000 cmETH (approximately $43 million[^80]) within 24 hours via a built-in 8-hour withdrawal delay.[^80] Tether froze 181,000 USDT.[^80] Coordinated industry action recovered $42.89 million[^80] in the first day. ZachXBT's public attribution to Lazarus arrived within hours via on-chain laundering-pattern matching against the prior Phemex hack — the "habits don't change" forensic signature that lets behavioral attribution run faster than press cycles. For agent wallets, the equivalent recovery primitives are time-bounded `validUntil` policy windows that auto-revoke without master-key intervention, and `pauseSigning` calls that the master key can issue without the agent's cooperation.

## Quotable Findings — Part I

1. Per Sygnia's forensic report cited by BleepingComputer's February 26, 2025 coverage[^62], "AWS S3 or CloudFront account/API Key of Safe.Global was likely leaked or compromised," and the malicious JavaScript was modified two days before the February 21 attack.
2. Per the WalletWitness blockchain forensic walkthrough[^80], the attack drained 401,347 ETH plus 90,300 stETH, 15,000 cmETH, and 8,000 mETH from Bybit on February 21, 2025.
3. Per NCC Group's in-depth technical analysis[^63], "a custom smart contract tailored to [Bybit's] needs would have allowed them to provide the required functionality (native transfers and ERC-20 transfers)... It might have been useful to have an internal service that checks transactions against predefined policies, which may have prevented this attack."
4. Per the DARKNAVY reconstruction[^77], the malicious transaction's "human description" rendered by the Safe client gateway "did not align with the actual transaction — the implementation address [was] modified, the transfer amount [was] set to zero, and the malicious token contract lacked a registered name."
5. Per CoinCentral's coverage[^64], the malicious code was "designed to activate only when transactions originated from specific contract addresses, including Bybit's contract" — selective targeting that let the compromise survive two days without detection.
6. Per WalletWitness reporting[^80], "Mantle's mETH Protocol froze 15,000 cmETH (~$43M) using their built-in 8-hour withdrawal delay; Tether froze 181K USDT; coordinated industry action recovered $42.89M total in the first day."

## Part II — The Three-Layer ERC Stack: Register, Verify, Execute

The Bybit forensic record told the wallet community what was missing: a programmable, machine-enforced layer that constrains what an authorized signer can authorize. Between August 2025 and March 2026, three Ethereum Improvement Proposals — ERC-8004, ERC-8126, and ERC-8196 — composed into a stack that, when fully implemented, makes that constraint cryptographically verifiable on-chain. This Part walks the stack layer by layer.

### Layer 1 — Register: ERC-8004 (Trustless Agents)

ERC-8004 (Trustless Agents Registry, August 2025, authors De Rossi, Crapis, Ellis, and Reppel) defines the on-chain identity layer. Every agent has a `uint256 agentId` minted into an Identity Registry contract; that ID is the canonical anchor every other layer references. Sibling registries handle other dimensions: the Validation Registry is where verification providers post attestations about an agent's risk score; the Reputation Registry is where peer agents post endorsements.[^4] Lighter-weight identity primitives layer on: ERC-8122 (Minimal Agent Registry, December 2025) for ecosystems that don't need the full three-registry pattern;[^9] ERC-8107 (ENS Trust Registry, December 2025) for ENS-named human-readable identities;[^10] earlier ERC-7662 (March 2024) and ERC-7857 (January 2025) define agent-as-NFT primitives for ecosystems where the agent identity itself is transferable.[^6][^7]

The architectural property that makes ERC-8004 load-bearing is referential: every higher-layer spec references the `agentId`. ERC-8126 verification requests must include it; ERC-8196 wallets must check ERC-8004 registration before delegating any policy. The registry becomes the single source of truth for agent identity across the stack.

### Layer 2 — Verify: ERC-8126 (AI Agent Verification)

ERC-8126 (AI Agent Verification, January 15, 2026, in Review status, authors Cronian and Johnson at Virtuals) defines the off-chain verification interface for ERC-8004-registered agents. Seven verification types cover different dimensions of trust: ETV (Ethereum Token), MCV (Media Content), SCV (Solidity Code), WAV (Web Application), WV (Wallet Verification), PDV (Private Data Verification with zero-knowledge proofs), and QCV (Quantum Cryptography Verification).[^3] The output is a unified risk score on a 0-100 scale where 0 is the lowest risk. Verification requests MUST reference the agent's `agentId` from the ERC-8004 Identity Registry, forcing every verification to be linked back to the registered identity.[^3]

The Wallet Verification (WV) sub-protocol is the architectural surface ERC-8196 hooks into. WV MUST verify the wallet has transaction history, MUST check threat-intelligence databases, and MUST produce a risk score. Verification providers MAY post final scores plus Proof IDs as attestations to ERC-8004's Validation Registry, making the risk assessment on-chain queryable by any contract that wants to gate behavior on it.

### Layer 3 — Execute: ERC-8196 (AI Agent Authenticated Wallet)

ERC-8196 (AI Agent Authenticated Wallet, March 14, 2026 Draft, author Cronian / Cybercentry) defines the smart-contract execution layer where policy enforcement happens. The `IAIAgentAuthenticatedWallet` interface requires three operations:[^1] `registerPolicy(Policy)` — the asset owner registers a Policy struct constraining a specific agent; `executeAction(...)` with an `entropyCommitment` (bytes32) — the agent attempts an action and the wallet only signs if every constraint passes; `getAuditTrail()` — the wallet exposes a hash-chained log of every executed action.

The Policy struct is the architectural payload of the spec. Every constraint a security team wants becomes a struct member an on-chain `require()` can evaluate before signature production: `policyId`, `agentAddress`, `ownerAddress`, `allowedActions`, `allowedContracts` whitelist, `blockedContracts` blacklist, `maxValuePerTx`, `maxValuePerDay`, `validAfter`, `validUntil`, and `minVerificationScore`.[^1] This is the structured form of NCC Group's "predefined policies" recommendation — the missing primitive from the Bybit incident.

Two specification choices encode lessons from incidents adjacent to Bybit. **Hash-chained audit trail:** every `executeAction` emits an `AuditEntryLogged` event whose `previousHash` field links the entry into a tamper-evident chain; implementations MAY store entries off-chain (IPFS) with periodic on-chain Merkle roots posted to ERC-8004's Validation Registry, keeping per-action gas low while preserving cryptographic auditability.[^1] An attacker who later compromises the agent and tries to retroactively edit the log breaks the hash chain. **Entropy commit-reveal:** the `entropyCommitment` parameter requires the agent to commit to a random `bytes32` value before observing transaction context, and reveal it after. A host that can replay queries or sample multiple LLM completions cannot influence the final output without breaking the commitment, since the commitment must be made before the host knows what context the model will see.[^1]

The spec also requires an enforcement check that ties Layer 3 back to Layer 2: implementations MUST perform an ERC-8126 verification check before any agent action and MUST reject the action if the agent's risk score exceeds the policy's `minVerificationScore`; wallets MUST reject delegations if WV flags "sanctioned funding, clustering with known bad actors, or strong automation indicators, even if the overall risk score appears acceptable."[^1] This prevents a clean-history agent from being weaponized post-deployment without the wallet noticing.

ERC-8196 implementations are expected to be ERC-4337 smart accounts or dedicated policy enforcement modules. EIP-8130 (Account Abstraction by Account Configuration, October 2025, Hunter at Coinbase) defines the configuration surface that lets ERC-4337 smart accounts express ERC-8196 policies in their signature-validation logic.[^8] ERC-8183 (Agentic Commerce, February 2026) sits adjacent and handles commerce-protocol composition.[^2]

## Quotable Findings — Part II

1. Per ERC-8196's March 14, 2026 Draft[^1], the Policy struct fields include `policyId` (bytes32), `agentAddress`, `ownerAddress`, `allowedActions`, `allowedContracts`, `blockedContracts`, `maxValuePerTx` (uint256 wei), `maxValuePerDay`, `validAfter`, `validUntil`, and `minVerificationScore`.
2. Per the ERC-8196 specification[^1], wallets MUST reject or revoke delegations if the ERC-8126 Wallet Verification flags "sanctioned funding, clustering with known bad actors, or strong automation indicators, even if the overall risk score appears acceptable."
3. Per ERC-8126's January 15, 2026 specification[^3], verification requests MUST reference an `agentId` from the ERC-8004 Identity Registry, and direct submission of individual parameters without an agentId is not permitted.
4. Per ERC-8004 (August 2025)[^4], the Trustless Agents Registry exposes three sub-registries — Identity, Validation, and Reputation — that ERC-8126 verification providers MAY post attestations into.
5. Per ERC-8196[^1], every `executeAction` emits an `AuditEntryLogged` event whose `previousHash` field links the entry into a tamper-evident chain; implementations MAY store entries off-chain (IPFS) with periodic on-chain Merkle roots posted to the ERC-8004 Validation Registry.
6. Per ERC-8196's threat model[^1], host manipulation of probabilistic agents — including "suppress outputs, delay requests, replay probabilistic queries, or influence agent behavior through repeated sampling" — is countered by the entropy commitment, which must be made before the host knows what context the model will see.

## Part III — The Cryptographic Primitive: DKLs23, GG18/GG20, CGG21, 2PC-MPC, FROST

A policy engine is only as strong as the cryptography that prevents bypassing it. If a single party can produce a signature unilaterally, every Policy struct field is advisory rather than load-bearing. MPC threshold signing solves this by replacing a single private key with N key shares distributed across N parties, where any T (threshold) of them can collectively produce a signature without ever reconstructing the key.

For an agent wallet using a 2-of-3 threshold, the master key holder owns one share, the hot operator owns one share, and the agent's TEE owns one share — and 2-of-3 must collaborate to sign. No single share holder, including the agent, can act unilaterally. A prompt-injected agent that "decides" to drain the wallet cannot. A hot operator whose laptop is compromised cannot. Only a coordinated compromise of two of three independent share holders can produce a signature, and the threshold can be raised (3-of-5, 4-of-7) when the asset value warrants it.

### The protocol landscape

**GG18 and GG20.** Gennaro and Goldfeder's 2018 and 2020 protocols were the first practical malicious-secure threshold ECDSA designs and remain the "industry standard" against which Fireblocks and others benchmark improvements. Both require five to nine online communication rounds and produce signatures whose malicious aborts cannot be traced to a specific cheating party. They remain in deployed systems but are no longer state-of-the-art.[^29]

**DKLs23.** Doerner, Kondi, Lee, and shelat's 2023 family is the 2024-2026 production hot-path standard, adopted by Coinbase, Utila, Blockdaemon, Vultisig, and Silence Laboratories. Vultisig's transition note: "5-10x faster than GG20," in production since early 2025.[^17] Utila's rationale: three rounds versus GG20's five, with presignatures moving expensive precomputation off the signing critical path.[^15] Blockdaemon's TSM runs seven-round ECDSA with presignatures for high-throughput institutional flows.[^16] Silence Laboratories' protocol comparison published the round-count breakdown that converted the design community.[^14]

**CGG21 / CMP.** Canetti, Gennaro, and Goldfeder's 2021 variant (also called CMP) addresses a gap GG20 left open: identifiable abort, where every malicious abort is provably attributable to a specific party. Lux's LP-5014 deployment chose CGG21 specifically for this — useful when "who broke the protocol" is itself an audit artifact in regulated multi-institutional settings.[^18]

**2PC-MPC.** The Ika Network paper published in December 2024 broke the latency ceiling for many-party signing: 1.23 seconds with 256 parties, 12.7 seconds with 1024 parties. This opens the design space for thousand-agent topologies where each agent contributes a share but the threshold remains small.[^20]

**FROST.** Komlo and Goldberg's 2020 EdDSA threshold equivalent for Curve25519 / Ed25519. Coinbase's `cb-mpc` handles FROST signing for Solana in the same library that handles secp256k1 ECDSA for EVM — one cryptographic discipline covers both major chains.[^11]

### The open-source posture matters for SOC 2

Coinbase open-sourced `cb-mpc` under a limited license; Fireblocks open-sourced MPC-CMP under a similar license in August 2023.[^29] Silence Laboratories publishes DKLs23 implementations along with detailed protocol comparisons. The posture matters for compliance: an examiner can read the cryptographic core; a regulator can audit the protocol; a customer can verify the security claim. "Trust me, it's MPC" is no longer acceptable when the spec is public and competitors run the same code in production. When a Big-4 examiner asks why a threshold-signing protocol meets the AICPA Trust Service Criteria for cryptographic operations, the answer points at the open-source repository, the formal-security paper, and the round-count benchmark — Fireblocks' MPC-CMP "signs transactions 8x faster than standard MPC and requires just 1 signing round versus 9 in GG18."[^29]

### The TEE is necessary but not sufficient

All five protocols run inside Trusted Execution Environments — Intel SGX, AWS Nitro Enclaves, GCP Confidential Spaces — to protect share material from host-OS compromise. Without a TEE, the MPC threshold reduces to "split the key, but trust the OS not to collude with itself." Per Openfort's January 2026 essay, "the TEE provides isolation from external attackers, not from the platform operator who controls what runs inside."[^72] A platform that hosts the agent's TEE could deploy modified enclave code that exfiltrates the share — the attestation chain proves what code is running, but the platform decides what code to deploy. This is why the cryptographic threshold, not the enclave, is the load-bearing primitive: as long as 2-of-3 must collaborate and the master share is held off-platform, no single platform can sign unilaterally even with full control of the agent's TEE.

## Quotable Findings — Part III

1. Per the Fireblocks "What is MPC" explainer (April 17, 2026)[^29], MPC-CMP "signs transactions 8x faster than standard MPC and requires just 1 signing round versus 9 in the GG18 industry standard."
2. Per Silence Laboratories' DKLs23 versus Lindell/GG18/GG20 comparison[^14], the DKLs family achieves three rounds versus five rounds for GG20, with presignatures that move expensive precomputation off the signing critical path.
3. Per the Vultisig DKLs23 transition documentation[^17], the protocol is "5-10x faster than GG20" and was rolled into production in early 2025.
4. Per the Ika Network 2PC-MPC paper[^20], the protocol achieves 1.23-second signing with 256 parties and 12.7-second signing with 1024 parties — opening the design space for thousand-agent threshold-signing topologies.
5. Per Openfort's "The Agentic Wallet Problem" essay[^72], "the TEE provides isolation from external attackers, not from the platform operator who controls what runs inside" — making the cryptographic threshold the load-bearing primitive rather than the enclave.
6. Per the Utila DKLs23 implementation rationale[^15], the protocol's three-round structure with presignatures moves expensive precomputation off the signing critical path, dropping user-perceived signing latency.

## Part IV — The 2-of-3 Threshold: Master, Hot, Agent

The cryptographic threshold is the load-bearing primitive; the operational pattern that makes it safe in production is the assignment of the three shares to three distinct roles with distinct threat profiles. Master, hot, and agent are not arbitrary labels — they bound the blast radius of every plausible single compromise.

**Master** — asset owner's share. Held offline, ideally on a hardware wallet never connected to the operating environment. Used only to authorize policy changes (`registerPolicy`), rotate the agent's share, and participate in recovery flows. Without master in the threshold, the platform signs unilaterally with hot + agent — custody by another name.

**Hot** — operator's share. Held by the platform or ops team running the agent fleet, always online to co-sign within the policy. Hot gives the system its operational tempo. Hot can rotate the agent's share (operational, not custodial) but cannot rotate master, change policy, or sign without master when policy demands a higher quorum.

**Agent** — autonomous program's share. Held inside the agent's TEE (Coinbase's AWS Nitro Enclave, Fireblocks' SGX/Nitro/Confidential Spaces, or whichever attestable enclave the deployment chose). The TEE binds the agent share to a specific code attestation, so a different program loaded into the enclave cannot use it. The agent program calls a signing API; the enclave cooperates only when the policy engine approves.

### The threat-response runbook

The 2-of-3 design produces a specific recovery story for every plausible single compromise, codified in the Kazopl 2-of-3 reference implementation:[^49] **Agent share compromised** — master + hot recover the wallet, rotate the agent's share, deploy a fresh agent. Blast radius is bounded by what the agent could spend within `maxValuePerTx`/`maxValuePerDay` between compromise and detection. **User device lost** — agent + recovery sign to restore; the master share is recoverable from backup or guardian. **Recovery guardian compromised** — agent + user perform a share refresh (proactive secret sharing rotates all three shares without changing the signing key). **Policy breach detected** — the wallet pauses signing via the master-only `pauseSigning` call; audit log is reviewed; policy is updated; signing resumes.

### Production instantiations

Coinbase Agentic Wallets bind the agent share to an AWS Nitro Enclave (no operator login, no persistent storage, attestation-gated KMS access) while the user holds the second share via OAuth-bound session keys.[^11] The architecture is documented in Coinbase's August 14, 2025 AWS Nitro Enclaves blog post — Secure Signer running inside the enclave with KMS attestation verified before every request.[^12] Fireblocks API Co-signer keeps two shares with Fireblocks-operated Cloud Co-signers and one share inside the customer's enclave.[^21] The customer can sign without Fireblocks; Fireblocks cannot sign without the customer. Per Fireblocks' MPC vs Multi-Sig analysis, MPC supports "ongoing modification of the signature scheme... without onchain transactions or wallet migrations" — the property an agent fleet needs as agents spin up and down.[^31] Squads Protocol v4 takes the on-chain alternative: every signer is a separate Solana account, threshold enforced by a smart contract program (Certora-verified, OtterSec-audited, immutable since November 2024), time locks + spending limits as the policy layer.[^28] Safe Smart Account splits the difference: the multisig is on-chain, but the allowance module adds a per-agent spending limit that bypasses the full quorum for amounts under the threshold.[^36] The post-Bybit multi-agent 2-of-4 pattern: master + hot approve any policy change or transaction over a threshold; below it, an individual agent spends within its daily allowance without quorum but master can revoke at any time. Squads v5 generalizes this with Hooks — programs that programmatically tighten or loosen smart-account consensus per transaction type.[^21]

## Quotable Findings — Part IV

1. Per the Kazopl 2-of-3 reference implementation[^49], "the 2-of-3 threshold ensures: agent compromise — attacker cannot sign without user OR recovery; user device loss — agent + recovery can recover funds; single point compromise — no single party can authorize transactions."
2. Per the Coinbase CDP Wallets v2 launch documentation[^11], "sensitive wallet interactions (like decrypting private keys) happen inside an AWS Nitro Enclave, a secure, isolated compute environment where private keys are generated, encrypted, and used for signing. The unencrypted key is never exposed — not even to Coinbase."
3. Per the Fireblocks "MPC vs Multi-Sig" analysis[^31], MPC supports "ongoing modification of the signature scheme (adding or removing authorized parties, adjusting thresholds, and refreshing key shares) without onchain transactions or wallet migrations" — the exact property an agent fleet needs as agents are spun up and down.
4. Per the AWS Nitro Enclaves architecture blog post on Coinbase's Wallet API (August 14, 2025)[^12], "the Secure Signer that runs inside the enclave is a Rust binary with Foreign Function Interface (FFI) bindings to a fork of AWS Nitro Enclaves SDK for C," and integration with AWS KMS attaches an attestation document to every request that KMS verifies before processing.
5. Per the Fireblocks API Co-signer Architecture Overview[^21], API Co-signers operate on Intel SGX, AWS Nitro, or Google Cloud Confidential Spaces enclaves and can be deployed across major cloud platforms or on-premises with Intel SGX-capable servers.

## Part V — Policy Enforcement Primitives: Caps, Time Bounds, Allowlists, Verification Gates

The Policy struct in ERC-8196 is the in-spec form of policy enforcement, but the production primitives predate the spec and now compose with it. Coinbase's session caps and per-transaction limits, Squads' spending limits and time locks and Hooks, Safe's allowance modules, Fireblocks' Policy Engine running inside the secure enclave — all are converging on the same shape: a structured per-agent rule set, enforced before signature broadcast, by code that the agent itself cannot modify.

This Part walks the five enforcement layers in the order they activate during a signing request.

### Layer 1 — Spend caps

The first check is the cheapest: does the requested transaction value exceed `maxValuePerTx`, and does it push cumulative daily spend over `maxValuePerDay`? If either bound is breached, the wallet refuses to sign. Coinbase Agentic Wallets surfaces both as "session caps" and "transaction limits";[^5] Squads v4 calls them "spending limits";[^25] Safe calls them "allowances."[^36] All three enforce the same invariant: a prompt-injected agent told to drain the wallet can only burn up to the cap. The architectural payoff is that the cap is the upper bound on damage — the compromise does not amplify with time the way an unconstrained credential would.

### Layer 2 — Time bounds

The second check is `validAfter ≤ now < validUntil`. Outside that window, the policy is not in force; signing is refused without further check. Time bounds are the architectural answer to the "we forgot to revoke the credential" problem in traditional IAM. With `validUntil`, the credential auto-expires; no master-key transaction is needed to revoke. Time bounds also enable session-scoped autonomy: an agent gets a 24-hour policy window for a specific job; the policy expires automatically when the job ends; the asset owner does not need to remember to revoke.

### Layer 3 — Allowlists and blocklists

The third check is destination-based: is the target contract in `allowedContracts`, and is it not in `blockedContracts`? This prevents the agent from interacting with arbitrary destinations even if the value caps would permit the transaction.

The production-deployed enrichment is KYT (Know Your Transaction) screening: Coinbase's Policy Engine checks every destination against Coinbase's KYT database before signing,[^54] and Fireblocks integrates compliance partners directly into its Policy Engine to automate transaction screening workflows that meet evolving digital-asset regulatory requirements.[^32] Sanctioned addresses, known scam contracts, and addresses linked to North Korean Lazarus operations (the FBI's 51 Bybit-linked addresses,[^65] for example) are blocked at the policy layer regardless of what the agent's logic says.

### Layer 4 — Verification gates

The fourth check is the ERC-8126 risk-score gate: `agent.currentScore ≤ policy.minVerificationScore`. If a verification provider has posted a new attestation showing the agent has accumulated suspicious behavior — clustering with known bad actors, mixer usage, rapid forwarding, or threat-intelligence hits — the wallet automatically rejects the next signing attempt. The agent does not need to be "turned off" by the asset owner; the wallet stops responding the moment the verification score crosses the policy threshold.

This is the part that closes a specific Bybit-style attack surface: an agent that looks clean at deployment but is weaponized post-deployment. The verification gate makes the wallet keep checking, not just check at registration.

### Layer 5 — Entropy commitments

The fifth check is ERC-8196's specific contribution: the entropy commit-reveal binding the agent's behavior to randomness. Before observing the transaction context, the agent commits to a `bytes32` random value. After signing, the agent reveals it. The wallet verifies that the reveal matches the commitment.

This countermeasure is aimed at host manipulation of probabilistic agents — a hostile platform that runs multiple LLM completions and selects the most adversarial one cannot bias the outcome without breaking the commitment. The agent's behavior is bound to a specific entropy value committed before any of the host's manipulation is possible.[^1]

### Squads v5 Hooks: generalizing the policy engine

Squads v5's Hooks generalize this five-layer pattern into an arbitrary stack: each hook is an on-chain program that participates in consensus per transaction type. Examples from the Squads v5 announcement: spending limits for stablecoin transfers (Layer 1 + Layer 3 composed); manager approval for program upgrades (Layer 1 raised to full multisig for high-risk operations); reject transactions outside business hours (Layer 2 narrowed to weekday windows); per-program whitelists that allow specific members to bypass smart-account consensus when interacting with designated Solana applications.[^21]

The wallet becomes a programmable policy engine where each transaction is evaluated by a stack of hooks before execution. The architectural endpoint is a per-organization, per-agent, per-transaction-type policy that is enforced in code, on-chain, with no out-of-band approval workflows required.

## Quotable Findings — Part V

1. Per the Coinbase Agentic Wallets explainer[^5], the wallet's policy engine "checks the request against session caps and transaction limits" before any payload reaches the AWS Nitro Enclave for MPC signing — converting NCC Group's post-Bybit recommendation into shipping code.
2. Per Squads Protocol v4 documentation[^25], spending limits "allow members to withdraw funds up to a preset amount without requiring full multisig approval, while still remaining under collective control" — the canonical agent-autonomy primitive in production since October 2023.
3. Per the Squads Protocol v5 announcement[^21], Hooks are "individual programs that programmatically tighten or loosen smart account consensus," enabling per-transaction-type policy stacking without modifying the core wallet contract.
4. Per the Fireblocks Banking & Financial Institutions expansion blog[^32], the Fireblocks Policy Engine governs "workflows within the Fireblocks console, giving owners full control to secure actions against internal collusion, human error, and external attacks," with compliance-partner integration that automates transaction screening.
5. Per the Coinbase Agentic Wallets explainer[^5], session caps bound the total spend across an agent run while transaction limits cap a single payment — both are configured by the operator at wallet-creation time and can be tightened on the fly.
6. Per the ERC-8196 specification[^1], entropy commit-reveal counters host manipulation by binding agent behavior to randomness committed before the host knows what context the model will see.

## Part VI — The Commerce Layer: x402, ACP, AP2, MPP and How They Compose with the Wallet

Above the wallet sits the agentic commerce protocol stack — four protocols that emerged in 2025-2026 to handle the "how does an agent pay for things" problem. They are not competing rails. They are layered, and all four touch the wallet's signing surface in specific ways that the policy engine can gate.[^75][^76]

**x402 (Coinbase, settlement layer, HTTP-native).** x402 reuses HTTP 402 "Payment Required" as a programmatic settlement primitive. An agent calls a paid API, the server returns a 402 response with payment terms, the agent settles the payment in USDC on-chain through its wallet, and the agent retries the call with a payment proof. Coinbase reports more than 50 million transactions on x402 by the February 11, 2026 Agentic Wallets launch.[^53] By April 2026, the x402 plus Solana integration totaled 162 million transactions and approximately $45 million in cumulative volume since the October 2025 launch.[^69] The protocol is supported by a coalition that includes Coinbase, Cloudflare, Google, Circle, CoinGecko, and Vercel.

**ACP (OpenAI + Stripe, agent-to-merchant checkout).** ACP defines four RESTful endpoints — Create, Update, Complete, Cancel — and a SharedPaymentToken (SPT) primitive that is single-use, time-bound, and amount-locked. ACP launched as an open standard on September 29, 2025, the same day as OpenAI's Instant Checkout, which deployed ACP first with Etsy and Shopify merchants.[^75] OpenAI shut down Instant Checkout in early March 2026 after only ~12 merchants went live and conversion rates fell short of expectations. The protocol itself remains active, with Shopify, Salesforce, and PayPal continuing to build on it.

**AP2 (Google + 60 partners, authorization mandates).** AP2's primitive is the Mandate — a cryptographically signed (ECDSA) W3C Verifiable Credential that captures what an agent can buy, for how much, and under what conditions. Three Mandate types cover the full range: Intent Mandate (authorizes the agent to act in human-not-present scenarios within pre-set rules), Cart Mandate (used in human-present scenarios, where a user approves a specific cart before checkout), and Payment Mandate (signals agent involvement to payment networks and issuers for risk and compliance assessment).[^75] AP2 extends both Google's A2A protocol and MCP. Backers include Mastercard, Visa, Adyen, Coinbase, PayPal, and more than 60 organizations in total.

The architectural coupling worth highlighting is that the AP2 Intent Mandate maps cleanly to the ERC-8196 Policy struct. Both are signed structured documents that constrain what the agent may do. The difference is layer: AP2 is rail-agnostic (cards, ACH, stablecoins); ERC-8196 is on-chain Ethereum-native. They compose vertically — the AP2 Intent Mandate authorizes the agent at the protocol layer, and the ERC-8196 Policy enforces the constraints at the signing layer when the rail is on-chain.

**MPP (Stripe + Tempo, session billing).** MPP launched in March 2026. It pre-authorizes a spending session upfront and then streams micropayments across stablecoin, fiat, and Lightning rails without per-request on-chain settlement.[^75] The use case is high-frequency low-value flows where x402's two-phase settlement latency of 500-1100 ms per request is intolerable.[^69] Pre-authorization via session, settlement via batch.

### How the four protocols compose with the wallet

A typical agentic commerce flow in 2026 walks the stack: the agent receives an AP2 Intent Mandate from the user authorizing a budget for a specific purpose; the agent discovers a service via ACP's merchant interface; the agent pays via x402 (for one-shot API calls) or MPP (for streamed micropayments); the wallet's policy engine enforces the ERC-8196 Policy struct on every signature, refusing transactions that exceed the AP2 budget or the local cap whichever is tighter.

### The market reality check

Per Bloomberg's March 7, 2026 reporting on Circle and Stripe's race to build agentic-payment rails, "Circle Internet Group Inc. and Stripe Inc. are racing to build payments systems for a world that doesn't exist yet — one where autonomous AI agents transact millions of times a day, settling in stablecoins instead of swiping credit cards."[^56] A Citrini Research scenario imagining AI agents routing around card-network fees pushed Visa, Mastercard, and American Express shares down as much as 5%[^56] in a single session in late February 2026 — the disruption thesis didn't fade even when the volume didn't materialize.[^56]

CoinDesk's March 11, 2026 reality check is the counterweight. x402 currently processes approximately $28,000[^57] in daily volume against a roughly $7 billion[^57] ecosystem valuation, and Artemis estimates that approximately 50%[^57] of observed x402 transactions reflect "gamified" rather than genuine commerce activity.[^57] The forward-looking forecasts remain large — Gartner predicts that by 2028, 90%[^70] of B2B purchasing will be intermediated by AI agents driving over $15 trillion[^70] in agent-exchange spend; McKinsey projects $3-5 trillion[^70] in annual AI-driven transaction volume by 2030;[^70] CoinDesk's Consensus 2026 coverage cites McKinsey's estimate that AI agents could mediate up to $5 trillion[^60] in global consumer commerce by 2030.[^60] The infrastructure is arriving years before the demand it is built for.

The architectural implication for wallet design is that policy enforcement primitives have to be cheap. If the wallet pays full L1 gas for every cap check, the unit economics of x402 micropayments collapse. Squads' on-chain enforcement on Solana (where transaction fees average $0.00025 per transaction) is the structural advantage that explains why 80% of x402 transactions settled on Solana.[^70] On Ethereum, the equivalent is enforcing policy in ERC-4337 paymaster logic plus L2 settlement, with Merkle audit roots posted to L1 only at intervals.

## Quotable Findings — Part VI

1. Per Bloomberg's March 7, 2026 reporting[^56], "Circle Internet Group Inc. and Stripe Inc. are racing to build payments systems for a world that doesn't exist yet — one where autonomous AI agents transact millions of times a day, settling in stablecoins instead of swiping credit cards."
2. Per CoinDesk's March 11, 2026 reality check[^57], x402 currently processes approximately $28,000 in daily volume against a roughly $7 billion ecosystem valuation, and Artemis estimates that approximately 50% of observed x402 transactions reflect "gamified" rather than genuine commerce activity.
3. Per the FluxA agent-payment-stack analysis[^75], "these protocols aren't competing — they're layered. AP2 handles authorization. x402 and MPP handle settlement. ACP handles merchant checkout."
4. Per the BlockEden March 9, 2026 market analysis[^70], 80% of x402 transactions settle on Solana, drawn by sub-second finality and fees averaging $0.00025 per transaction — a structural advantage for on-chain policy enforcement.
5. Per CoinDesk's Consensus 2026 agentic-commerce coverage[^60], McKinsey estimates that AI agents could mediate up to $5 trillion in global consumer commerce by 2030, and Mastercard completed Europe's first live AI-agent bank payment in early 2026.

## Part VII — Production Deployment Patterns: Coinbase, Fireblocks, Squads, Safe

The architectural patterns described in Parts II through VI ship in production today across four reference deployments. Each takes a different point on the trade-off curve between cryptographic threshold strength, on-chain enforceability, regulatory framing, and operational latency. Pick the one that matches your asset value, your jurisdictional constraints, and your latency budget.

### Coinbase Agentic Wallets — the AI-agent-native reference

Coinbase Agentic Wallets launched February 11, 2026. Each is a CDP Server Wallet v2 whose private key is split via the open-source `cb-mpc` library and held inside an AWS Nitro Enclave;[^5] `cb-mpc` covers both EVM (threshold ECDSA over secp256k1) and Solana (Schnorr over Curve25519) in one library.[^11] Agents authenticate via OAuth + email OTP; signing is gated by a policy engine running inside the enclave that checks session caps and per-transaction limits before producing the MPC signature; KYT screening blocks high-risk destinations.[^54] Compatible with ChatGPT, Claude, Codex, and Gemini via MCP; native x402 client; gasless trading on Base. Installable through `npx awal` or the MCP server.[^55] Production scale at launch: 50 million-plus x402 transactions; 107 million agent transactions cumulative since the May 28, 2025 CDP Server Wallets v2 GA.[^5][^11] The end-to-end architecture is documented in Coinbase's August 14, 2025 AWS Web3 Blog post — Rust Secure Signer running inside the Nitro Enclave with KMS attestation verification on every request and a tenfold improvement in KMS-through-enclave throughput.[^12]

### Fireblocks API Co-signer — the enterprise reference

Fireblocks' API Co-signer architecture has been documented since 2022; MPC-CMP was open-sourced under a limited license in August 2023.[^29] MPC-CMP runs across Intel SGX, AWS Nitro, and GCP Confidential Spaces. Cloud Co-signers operated by Fireblocks hold two shares; the customer's API Co-signer holds one inside their own enclave (Azure, AWS, GCP, IBM Cloud, Alibaba Cloud, or on-premises Intel SGX).[^21] The threshold is precise: the customer can sign without Fireblocks; Fireblocks cannot sign without the customer — "Fireblocks does not hold your assets, act as a custodian, or have the ability to move funds on your behalf. This is a fundamental architectural property, not a policy choice."[^29] Production scale: more than $5 trillion[^71] in digital asset transfers annually, $10 trillion[^29] cumulative across 150-plus blockchains, 95-plus banks live (BNY Mellon, BNP Paribas, ANZ, NAB, Worldpay, Revolut, Galaxy, SIX Digital Exchange).[^29][^71] The Fireblocks-Thales partnership announced February 10, 2026 extends the architecture to customer-owned Luna HSMs via KeyLink for institutions that require HSM-rooted keys.[^71]

### Squads Protocol v4 — the on-chain reference for SVM

Squads Protocol v4 is the on-chain alternative for Solana / SVM. The smart-account program is audited by OtterSec, formally verified by Certora, and immutable since November 2024. The Squads API abstracts on-chain operations as RESTful calls with gas abstraction.[^28] Production scale: $10 billion-plus across 350-plus teams (Jito, Jupiter, Pyth, Drift, Helium, Helius, Backpack, Tensor, Kamino, Raydium); $3 billion-plus in stablecoin transfers.[^28] Squads exposes a 2-of-2 multisig pattern for AI agents as a one-line API call in the Solana Agent Kit: `agent.createSquadsMultisig(creator)` — the agent and the creator each hold a key, neither can act alone.[^45] The trade-off is full on-chain auditability at Solana's negligible per-transaction fees. Squads v5 extends this with Hooks for per-transaction-type policy stacking, synchronous execution, and key-tier adaptive timelocks.[^21]

### Safe Smart Account — the EVM reference for multi-agent setups

Safe Smart Account on Ethereum and EVM L2s is the reference for multi-agent setups on EVM. The Safe Transaction Service handles signature aggregation; the allowance module enables per-agent spending limits below the quorum. The documented multi-agent 2-of-4 pattern: master plus hot must approve policy changes or transactions over a threshold; below the threshold, individual agents spend within their daily allowances without quorum; master can revoke any allowance at any time.[^36][^37] The Bybit incident's primary architectural lesson — that a multisig front-end is a single point of failure — drove Safe to fully rebuild infrastructure, rotate all credentials, and deploy enhanced malicious-transaction detection after the February 2025 attack.[^64] The post-incident Safe is the one this paper recommends as a production reference.

### Adjacent production patterns

Other production wallet platforms occupy different points on the trade-off curve: **Anchorage Digital** (federally chartered crypto bank, MPC custody for institutions); **BitGo** (multi-sig + MPC hybrid, 2014 founding makes it the longest-tenured production deployment); **Lit Protocol** (DKG-based threshold signing as a network service, used by Privy for agent-key isolation); **Privy** (enclave-based wallet infrastructure for consumer-app embedded wallets, with agent-friendly APIs as a 2026 expansion); **Crossmint** (first partner to leverage Squads' Smart Account Program via Squads API).[^28] The choice depends on asset value, regulatory framework, and latency budget; the cryptographic primitive, enclave choice, and policy enforcement layer follow from those answers.

## Quotable Findings — Part VII

1. Per the Coinbase Agentic Wallets explainer[^5], "each Agentic Wallet is a CDP Server Wallet v2 account whose private key is split using Coinbase's MPC library and held inside an AWS Nitro Enclave. The agent calls a signing API; the policy engine checks the request against session caps and transaction limits; the enclave produces an MPC signature; the wallet broadcasts. Keys never leave the enclave."
2. Per the Fireblocks-Thales February 10, 2026 PR Newswire announcement[^71], Fireblocks secures more than $5 trillion in digital asset transfers annually with over 95 banks already using the platform in live environments, and KeyLink ensures "private keys or key shares are generated, stored, and operated entirely within customer-owned Luna HSMs."
3. Per the Squads Smart Account Program mainnet announcement[^28], "the Smart Account Program is live on mainnet, fully audited by OtterSec and formally verified by Certora," securing more than $10 billion in value across 350-plus teams with $3 billion-plus in stablecoin transfers processed.
4. Per the Coinbase / AWS Nitro Enclaves architecture blog (August 14, 2025)[^12], the Coinbase team's targeted enhancements to the Nitro Enclaves C SDK boosted KMS-through-enclave throughput "more than tenfold," with wallet creation and signing latency typically below 200ms within the Secure Signer.
5. Per the Fireblocks API Co-signer Architecture Overview[^21], API Co-signers operate on Intel SGX, AWS Nitro, or Google Cloud Confidential Spaces enclaves and can be deployed across major cloud platforms or on-premises — giving customers a deployment surface that fits their existing infrastructure rather than forcing them onto a single vendor's cloud.
6. Per the Solana Agent Kit Squads documentation[^45], the integration exposes a 2-of-2 multisig as a one-line API call where "the agent and the creator each hold a key and neither can act alone" — the simplest production instantiation of the 2-of-3 threshold pattern.

## Part VIII — Failure Modes and Mitigations: LLM Routers, Prompt Injection, NHI Sprawl

The architectural stack described in Parts II through VII is necessary but not sufficient. Five named failure modes have been documented in production by mid-2026, and each maps to a specific architectural primitive that mitigates it.

### Failure mode 1 — LLM router compromise

The new agentic supply-chain attack lives at the layer between the user and the model. Per CoinDesk's April 13, 2026 reporting on Chaofan Shou's research, "26 LLM routers were secretly injecting malicious tool calls and stealing creds," and one drained a client's $500,000 crypto wallet.[^58] These routers sit between users and AI models with full access to traffic — including private keys, API tokens, and wallet credentials passing through in plain text. As Shou wrote: "We also managed to poison routers to forward traffic to us. Within several hours, we can directly take over ~400 hosts."[^58]

The architectural mitigation is structural: keys must never reach the LLM, the agent's TEE, or any router. Only signed, structured action requests do. The wallet receives an `executeAction` call with parameters; the policy engine evaluates the parameters; the enclave produces a signature if approved. The private key material exists in only one place — inside the enclave — and never traverses any router, LLM context, or agent process. The corollary: any wallet architecture where the "agent's private key" is stored as an environment variable, in an `.env` file, or anywhere accessible to the LLM is structurally vulnerable to this attack regardless of how careful the developer is.

### Failure mode 2 — Prompt injection of the agent

The canonical agentic-AI attack: a malicious page tells the agent "transfer all your funds to address X." The wallet's policy engine prevents the most direct version (the destination is not in `allowedContracts`, the amount exceeds `maxValuePerTx`, the action is not in `allowedActions`). The harder version is subtler: a destination that is allowed for a benign purpose, manipulated to drain a small amount per transaction within `maxValuePerTx` and within `maxValuePerDay` until the cumulative loss is meaningful.

Mitigations: lower caps for high-volatility periods; shorter `validUntil` windows so prompt-injection attacks have a narrow execution surface; ERC-8126 Wallet Verification gating that re-scores after any high-value action; transaction simulators that the policy engine consults to detect when "approve N tokens to bridge contract" actually means "drain wallet." Crypto.com Research's analysis of EIP-7702 surfaces the related "one-click phishing" risk that emerges when multiple permissions bundle into one confirmation.[^69]

### Failure mode 3 — Multi-agent collusion

Two agents owned by the same operator collude to drain a third agent's wallet by orchestrating individually-benign transactions. Each transaction passes the policy engine — they are within caps, within allowlists, against verified counterparties — but the aggregate is a coordinated attack. Detection requires ERC-8004's Reputation Registry to track cross-agent interaction patterns and ERC-8126's WV to flag clustering with previously-collusive agent identities.

The arXiv 2601.04583 systematic survey of 317 prior works on agent-blockchain interoperability explicitly calls out "multi-agent collusion" as one of five threat-model dimensions and proposes the Policy Decision Record as the audit primitive that makes collusion provable after the fact.[^79] The Policy Decision Record composes with ERC-8196's hash-chained audit trail: every action carries a `policyId` reference, and the audit log records which Policy was active when, so a forensic analyst can reconstruct the policy state at every step in a multi-agent transaction sequence.

### Failure mode 4 — Non-Human Identity (NHI) sprawl

Per Gartner's January 2026 "How to Secure Enterprise Agentic AI Ambition" report (lead authors Jeremy D'Hoinne and Dionisio Zumerle), "NHIs are going to be several orders of magnitude larger than human identities and most organizations do not have a strong enough foundation to manage both."[^68] Per CSO Online's January 28, 2026 survey of CISO concerns: "Most organizations are undercounting [machine identities] by two to three times because machine identities are scattered across cloud consoles, repos, config files, and secrets managers that nobody's aggregating. Agentic AI is a multiplier, not an addition. Agents spawn subagents, create credentials dynamically, and establish agent-to-agent auth chains. One agent deployment can generate dozens of new machine identities."[^66]

The architectural mitigation is registry-based: every agent gets a `uint256 agentId` in ERC-8004's Identity Registry, every wallet's `agentAddress` field links to it, and the registry becomes the canonical source of truth for NHI inventory that a SOC 2 examiner can audit. Without ERC-8004's registry, NHI sprawl is invisible by default. With it, the registry is the canonical artifact a Big-4 audit can reference.

### Failure mode 5 — Recovery latency

The Bybit case study's most replicable architectural lesson is the speed of cross-protocol coordination after a compromise. Per WalletWitness's reporting[^80], Mantle's mETH Protocol froze 15,000 cmETH (approximately $43 million[^80]) within 24 hours via a built-in 8-hour withdrawal delay; Tether froze 181,000 USDT; coordinated industry action recovered $42.89 million[^80] in the first 24 hours; ZachXBT publicly attributed the attack to Lazarus within hours via on-chain laundering-pattern matching against the prior Phemex hack.[^80]

For agent wallets, the equivalent recovery primitives are time-bounded `validUntil` policy windows that auto-revoke without master-key intervention, `pauseSigning` calls that the master key can issue without the agent's cooperation, and on-chain Merkle audit roots that allow forensic reconstruction without depending on the operator to preserve logs. Per Forrester's AEGIS framework (April 16, 2026), "AEGIS extends Zero Trust to enforce least agency — controlling not just what an agent can access but what decisions it is allowed to make."[^67] Mapped to ERC-8196: `allowedActions` is what decisions the agent can make; `allowedContracts` is what it can access; `minVerificationScore` is the trust threshold. The framework's six domains (governance, identity, data, application security, threat operations, Zero Trust) become a useful audit lens, particularly when paired with a SOC 2+ examination that maps controls to specific Policy struct fields.

Per Gartner's January 2026 report (D'Hoinne, Zumerle): "CISOs must prioritize deterministic controls to minimize agentic privilege abuses and contain AI agents' agency, instead of relying primarily on AI to police itself."[^68] The Policy struct is the deterministic control. The cryptographic threshold is the structural guarantee that the deterministic control cannot be bypassed.

## Quotable Findings — Part VIII

1. Per CoinDesk's April 13, 2026 coverage of Shou et al. LLM-router research[^58], "26 LLM routers are secretly injecting malicious tool calls and stealing creds. One drained our client's $500K wallet."
2. Per Gartner's January 2026 agentic AI security report (D'Hoinne, Zumerle)[^68], "CISOs must prioritize deterministic controls to minimize agentic privilege abuses and contain AI agents' agency, instead of relying primarily on AI to police itself."
3. Per Forrester's AEGIS framework (April 16, 2026)[^67], "AEGIS extends Zero Trust to enforce least agency — controlling not just what an agent can access but what decisions it is allowed to make."
4. Per CSO Online's January 28, 2026 reporting[^66], "most organizations are undercounting [machine identities] by two to three times because machine identities are scattered across cloud consoles, repos, config files, and secrets managers that nobody's aggregating. Agentic AI is a multiplier, not an addition."
5. Per the arXiv 2601.04583 systematic survey of 317 prior works[^79], the threat model identifies five risk dimensions including "key compromise, adversarial execution dynamics, and multi-agent collusion," with the Policy Decision Record proposed as the audit primitive that makes collusion provable after the fact.
6. Per Crypto.com Research's analysis of the autonomous wallet stack (March 9, 2026)[^69], EIP-7702 introduces a "one-click phishing" risk because "multiple permissions can be bundled into one confirmation."

## Part IX — Honest Limits: What the 2026 Stack Cannot Yet Do

Every architectural choice in this paper is a 2026 snapshot. Six specific gaps deserve to be named because they will determine whether the stack survives 2027 contact with regulators, scale, and the next attack class.

### ERC stack still not finalized

ERC-8196 is still a Draft as of May 2026, not Final. ERC-8126 is still in Review.[^1][^3] Implementations cited throughout this paper (Coinbase Agentic Wallets, Fireblocks API Co-signer, Squads Smart Account, Safe allowance module) substantially anticipate the spec but do not yet enforce ERC-8126 risk scores or post Merkle audit roots to ERC-8004's Validation Registry. Production conformance to the full three-layer spec is 2027 work. A paper a year from now that benchmarks "which production wallets actually implement ERC-8196's WV gating in their hot path" is the natural follow-up.

### Smart-account adoption gap

Per Delphi Digital's analysis of Squads' expansion (February 25, 2025), Ethereum has seen "just 22.5 million smart wallets and 105 million transactions over two years. For context, Solana processes that many transactions in two days."[^74] The architectural stack assumes smart-account-native; the user base mostly is not. EIP-7702 (delivered in Ethereum's Pectra upgrade) lets EOAs temporarily transform into smart contract wallets within a single transaction, smoothing the migration — but introduces the one-click phishing risk Part VIII flagged.[^69] The gap means that for many users, the policy-engine architecture this paper describes is not yet available where their assets live.

### Regulatory void

Per The Central Bulletin's April 6, 2026 reporting, no jurisdiction has formal regulatory framework addressing "who is legally responsible when an AI agent executes a transaction."[^78] The Crypto Clarity Act includes a placeholder section on "automated digital asset systems" directing the SEC and CFTC to issue guidance within 18 months of enactment — even an optimistic timeline puts framework arrival at late 2027. The CFTC's 2025 AI framework explicitly excluded blockchain-native systems. Architectural choices made in 2026 — the Policy struct's field set, the verification-score threshold semantics, the audit-trail's hash-chain shape — will be what regulators evaluate when guidance lands. Aligning to the conservative end of the design space (more fields, lower defaults, denser audit logs) is the prudent posture.

### TEE escape risk

Every TEE used in production (Intel SGX, AWS Nitro Enclaves, GCP Confidential Spaces) has had documented vulnerabilities. The MPC threshold reduces the impact of a single TEE compromise (one share, not the key), but a coordinated multi-TEE compromise — say, an AWS Nitro zero-day combined with a GCP Confidential Spaces zero-day in the same week — would be catastrophic for any deployment that concentrates two of three shares in a single cloud or single TEE family. The mitigation is multi-cloud share placement: master share in a hardware wallet, hot share in AWS Nitro, agent share in GCP Confidential Spaces or Intel SGX on-premises. The gap is that most production deployments still concentrate two of three shares in a single cloud's TEE family.

### x402 demand gap

Protocol shipped, demand not. $24 million[^70] per month against a $7 trillion[^70] global e-commerce market is 0.00035%[^70] — per BlockEden's reality check, "the current $24 million in monthly agentic payment volume needs to grow roughly 287,000x to reach McKinsey's $3 trillion projection."[^70] The architectural answer is correct; the merchant economy hasn't followed. The risk is that a different rail (ACP fiat-only via Stripe, AP2 with cards, Visa TAP) absorbs the agentic-commerce demand and x402 remains a niche. For wallet architects, the implication is that policy enforcement primitives must work across rails, not just on x402.

### What 2-of-3 doesn't solve: collusion

The 2-of-3 threshold across master / hot / agent does not protect against the collusion of any two parties. If the master and the hot operator collude (same employee at same company holding both shares, or a single legal entity with control of both), the agent has no recourse. The mitigation is genuine separation — independent custody of the master share by an asset owner who is not the operator, perhaps via a hardware wallet held off-platform. In practice, very few small-business deployments achieve this; most concentrate master + hot in the same operator's hands and rely on internal controls rather than cryptographic separation. For high-value deployments, the right pattern is a 3-of-5 or 4-of-7 threshold with the master share split across multiple independent guardians (social recovery, qualified custodian, hardware wallet held by counsel) — moving from a 2-of-3 to a 3-of-5 raises the collusion bar from "any two parties" to "any three of five," which is the structural defense.

## Quotable Findings — Part IX

1. Per The Central Bulletin's April 6, 2026 reporting[^78], "no regulatory framework in any jurisdiction currently addresses the question of who is legally responsible when an AI agent executes a transaction," and even an optimistic Crypto Clarity Act timeline puts framework arrival at "late 2027."
2. Per Delphi Digital's analysis (February 25, 2025)[^74], "even Ethereum, with its mature ecosystem and push for smart contract wallets, has seen relatively modest adoption — just 22.5 million smart wallets and 105 million transactions over two years. For context, Solana processes that many transactions in two days."
3. Per BlockEden's March 9, 2026 market analysis[^70], "the current $24 million in monthly agentic payment volume needs to grow roughly 287,000x to reach McKinsey's $3 trillion projection" — and that target is the 2030 endpoint, not the near-term forecast.
4. Per the ERC-8196 specification (March 2026 Draft)[^1] and ERC-8126 specification (January 2026 Review)[^3], both core specs in the three-layer trust stack remain in pre-final status as of May 2026 — production conformance to the full spec is 2027 work.

## Glossary

**Agent key.** Autonomous program's share in 2-of-3, held inside the agent's TEE with no extraction path.

**Agent Policy Structure.** ERC-8196 struct binding an agent to constraints (allowedActions, allowedContracts, maxValuePerTx, maxValuePerDay, validAfter, validUntil, minVerificationScore).

**Blast radius.** Maximum loss from a compromised key share or prompt injection — bounded by the policy caps.

**cb-mpc.** Coinbase's open-source MPC library: EC-DKG + threshold ECDSA secp256k1 + Schnorr Curve25519.

**CGG21 / CMP.** Canetti-Gennaro-Goldfeder 2021 threshold ECDSA with identifiable abort.

**DKLs23.** Doerner-Kondi-Lee-shelat 2023 threshold ECDSA; 3 rounds with presignatures; the 2024-2026 production standard.

**Entropy commitment.** ERC-8196 bytes32 commit-reveal countering host manipulation of probabilistic agents.

**ERC-4337.** Ethereum account abstraction.

**ERC-8004 / ERC-8126 / ERC-8196.** Three-layer trust stack: Register / Verify / Execute.

**FROST.** Komlo-Goldberg 2020 threshold EdDSA for Curve25519 / Ed25519.

**GG18 / GG20.** Gennaro-Goldfeder threshold ECDSA, prior industry standard.

**Hot key.** Operator's always-online share.

**Master key.** Asset owner's never-online share, used only for policy changes and recoveries.

**MPC-CMP.** Fireblocks threshold ECDSA, 1 round vs 9 in GG18.

**NHI.** Non-Human Identity — service accounts, OAuth tokens, agents.

**Policy engine.** In-enclave or in-contract check that gates signing.

**TEE.** Trusted Execution Environment (Intel SGX, AWS Nitro Enclaves, GCP Confidential Spaces).

**2-of-3 threshold.** Master / hot / agent key roles where any two are required to sign.

**x402 / ACP / AP2 / MPP.** Four-layer agentic commerce stack: settlement, checkout, authorization, session billing.

## Related Research

- [The Agent Payment Stack 2026](https://www.perea.ai/research/agent-payment-stack-2026) — commerce protocols this wallet sits beneath.
- [The B2A Imperative](https://www.perea.ai/research/b2a-2026) — operating-model framing.
- [SOC 2 Audit Framework for AI Agents](https://www.perea.ai/research/soc2-audit-framework-ai-agents-2026) — audit scaffolding for wallet-policy evidence.
- [A2A Protocol v0.3 Implementation](https://www.perea.ai/research/a2a-protocol-v0.3-implementation) — agent-to-agent transport.
- [The MCP Server Playbook for SaaS Founders](https://www.perea.ai/research/mcp-server-playbook) — the protocol surface this wallet exposes.

## References

[^1]: Ethereum Improvement Proposals (2026-03-14), *ERC-8196: AI Agent Authenticated Wallet*. https://eips.ethereum.org/EIPS/eip-8196
[^2]: Cybercentry / Leigh Cronian (2026-03-14), *Add ERC: AI Agent Authenticated Wallet (PR #1606)*. https://github.com/ethereum/ERCs/pull/1606
[^3]: Ethereum Improvement Proposals (2026-01-15), *ERC-8126: AI Agent Verification*. https://eips.ethereum.org/EIPS/eip-8126
[^4]: Ethereum Improvement Proposals (2025-08), *ERC-8004: Trustless Agents Registry*. https://eips.ethereum.org/EIPS/eip-8004
[^5]: Coinbase / eco.com (2026-02), *Coinbase Agentic Wallets Explained*. https://eco.com/support/en/articles/14845485-coinbase-agentic-wallets-explained
[^6]: Ethereum Improvement Proposals (2024-03), *ERC-7662: AI Agent NFTs*. https://eips.ethereum.org/EIPS/eip-7662
[^7]: Ethereum Improvement Proposals (2025-01), *ERC-7857: AI Agents NFT with Private Metadata*. https://eips.ethereum.org/EIPS/eip-7857
[^8]: Ethereum Improvement Proposals (2025-10), *EIP-8130: Account Abstraction by Account Configuration*. https://eips.ethereum.org/EIPS/eip-8130
[^9]: Ethereum Improvement Proposals (2025-12), *ERC-8122: Minimal Agent Registry*. https://eips.ethereum.org/EIPS/eip-8122
[^10]: Ethereum Improvement Proposals (2025-12), *ERC-8107: ENS Trust Registry for Agent Coordination*. https://eips.ethereum.org/EIPS/eip-8107
[^11]: Coinbase Developer Platform (2025-05-28), *Introducing CDP Wallets (now in Beta): Full Control, Zero Key Management*. https://www.coinbase.com/developer-platform/discover/launches/cdp-wallets-launch
[^12]: AWS Web3 Blog (2025-08-14), *Powering programmable crypto wallets at Coinbase with AWS Nitro Enclaves*. https://aws.amazon.com/blogs/web3/powering-programmable-crypto-wallets-at-coinbase-with-aws-nitro-enclaves
[^14]: Silence Laboratories (2024), *Paillier in ECDSA Revisited: DKLs23 vs Lindell/GG18/GG20*. https://www.silencelaboratories.com/blog/paillier-in-ecdsa-revisited
[^15]: Utila (2025), *Why we chose DKLs23 for MPC-ECDSA*. https://utila.io/blog/dkls23
[^16]: Blockdaemon (2025), *Cryptographic Operations: MPC Threshold Signing*. https://docs.blockdaemon.com/reference/cryptographic-operations
[^17]: Vultisig (2025), *Vultisig DKLs23 transition*. https://docs.vultisig.com/dkls23
[^18]: Lux Network (2025), *LP-5014: CGG21 Threshold ECDSA Deployment Proposal*. https://github.com/luxfi/lps/blob/main/lp-5014.md
[^20]: Ika / dWallet Labs (2024-12), *2PC-MPC: Threshold Signing for Many Parties (eprint 2024/253)*. https://eprint.iacr.org/2024/253
[^21]: Fireblocks Developer Documentation (2022, updated 2025), *API Co-signers Architecture Overview*. https://developers.fireblocks.com/docs/cosigner-architecture-overview
[^25]: Squads Labs (2024), *Squads v4 Spending Limits*. https://squads.so/blog/squads-v4-spending-limits
[^28]: Squads Labs (2025), *Squads Smart Account Program is Live on Mainnet*. https://squads.xyz/blog/squads-smart-account-program-live-on-mainnet
[^29]: Fireblocks (2026-04-17), *What is MPC (Multi-Party Computation)? MPC 101*. https://www.fireblocks.com/report/what-is-mpc
[^31]: Fireblocks (2024-11-01), *Which Is More Secure for Digital Asset Custody: MPC or Multi-Sig?*. https://www.fireblocks.com/blog/mpc-vs-multi-sig
[^32]: Financial IT (2024), *Fireblocks Expands Support for Banking & Financial Institutions with New HSM, Public & Private Cloud Capabilities*. https://financialit.net/news/blockchain/fireblocks-expands-support-banking-financial-institutions-new-hsm-public-private
[^36]: Safe (2026), *Safe Smart Account Allowance Module: AI agent with spending limit*. https://docs.safe.global/advanced/smart-account-modules/allowance-module
[^37]: Safe (2026), *Safe Modules: architecture overview*. https://docs.safe.global/advanced/smart-account-modules
[^45]: Solana Agent Kit / SendAI (2026), *Squads Protocol Multisig*. https://sendai-a2cf1bab.mintlify.app/docs/v1/features/squads/squads_operations
[^49]: Kazopl (2026), *mpc-agent-wallet: Production-grade 2-of-3 MPC SDK for AI agents*. https://github.com/kazopl/mpc-agent-wallet
[^51]: Decrypt / Jason Nelson (2026-02-12), *Coinbase Launches Wallet for AI Agents With Built-In Guardrails*. https://decrypt.co/357813/coinbase-launches-wallet-ai-agents-built-in-guardrails
[^53]: PYMNTS (2026-02-11), *Coinbase Debuts Crypto Wallet Infrastructure for AI Agents*. https://www.pymnts.com/cryptocurrency/2026/coinbase-debuts-crypto-wallet-infrastructure-for-ai-agents/
[^54]: Sinziana Albu / The Paypers (2026-02-13), *Coinbase launches Agentic Wallets for autonomous AI agents*. https://thepaypers.com/crypto-web3-and-cbdc/news/coinbase-launches-agentic-wallets-for-autonomous-ai-agents
[^55]: Estefano Gomez / Crypto Briefing (2026-02-11), *Coinbase Rolls Out Agentic Wallets to Expand AI Transaction Capabilities*. https://cryptobriefing.com/coinbase-agentic-wallets-launch/
[^56]: Emily Mason / Bloomberg (2026-03-07), *Stablecoin Firms Bet Big on AI Agent Payments That Barely Exist*. https://www.bloomberg.com/news/articles/2026-03-07/stablecoin-firms-bet-big-on-ai-agent-payments-that-barely-exist
[^57]: CoinDesk (2026-03-11), *Coinbase-backed AI payments protocol wants to fix micropayment but demand is just not there yet*. https://www.coindesk.com/markets/2026/03/11/coinbase-backed-ai-payments-protocol-wants-to-fix-micropayment-but-demand-is-just-not-there-yet
[^58]: CoinDesk (2026-04-13), *As AI agents scale in crypto, researchers warn of a critical security gap*. https://www.coindesk.com/tech/2026/04/13/ai-agents-are-set-to-power-crypto-payments-but-a-hidden-flaw-could-expose-wallets
[^60]: CoinDesk Consensus (2026-04-15), *Agentic Commerce in 2026 — Consensus Miami*. https://consensus.coindesk.com/blog-agentic-commerce/
[^61]: Sergiu Gatlan / BleepingComputer (2025-02-27), *FBI confirms Lazarus hackers were behind $1.5B Bybit crypto heist*. https://www.bleepingcomputer.com/news/security/fbi-confirms-lazarus-hackers-were-behind-15b-bybit-crypto-heist/
[^62]: Sergiu Gatlan / BleepingComputer (2025-02-26), *Lazarus hacked Bybit via breached Safe{Wallet} developer machine*. https://www.bleepingcomputer.com/news/security/lazarus-hacked-bybit-via-breached-safe-wallet-developer-machine/
[^63]: Mario Rivas, Ruben Santos, Jorge Sanz / NCC Group (2025-03), *Bybit Hack: In-Depth Technical Analysis*. https://www.nccgroup.com/research/in-depth-technical-analysis-of-the-bybit-hack/
[^64]: Oliver Dale / CoinCentral (2025-02-26), *The Bybit Breach: How Hackers Exploited a SafeWallet Vulnerability to Steal $1.4 Billion*. https://coincentral.com/the-bybit-breach-how-hackers-exploited-a-safewallet-vulnerability-to-steal-1-4-billion/
[^65]: U.S. Federal Bureau of Investigation (2025-02-26), *North Korea Responsible for $1.5 Billion Bybit Hack (PSA)*. https://www.fbi.gov/investigate/cyber/alerts/2025/north-korea-responsible-for-1-5-billion-bybit-hack
[^66]: Evan Schuman / CSO Online (2026-01-28), *Think agentic AI is hard to secure today? Just wait a few months*. https://www.csoonline.com/article/4123246/think-agentic-ai-is-hard-to-secure-today-just-wait-a-few-months.html
[^67]: Forrester Research (2026-04-16), *AEGIS Framework: Securing Agentic AI With Enterprise Guardrails*. https://www.forrester.com/technology/aegis-framework/
[^68]: Jeremy D'Hoinne, Dionisio Zumerle / Gartner (2026-01), *How to Secure Enterprise Agentic AI Ambition*. https://www.armorcode.com/report/gartner-research-draft
[^69]: Crypto.com Research (2026-03-09), *The Rise of the Autonomous Wallet*. https://crypto.com/ca/research/rise-of-autonomous-wallet-feb-2026
[^70]: BlockEden Research (2026-03-09), *Stablecoin Agentic Payments: A $24M Market Chasing a $7T Dream*. https://blockeden.xyz/blog/2026/03/09/stablecoin-agentic-payments-reality-check/
[^71]: Fireblocks via PR Newswire (2026-02-10), *Fireblocks and Thales Expand Collaboration to Deliver Bank-Grade Digital Asset Security*. https://www.prnewswire.com/news-releases/fireblocks-and-thales-expand-collaboration-to-deliver-bank-grade-digital-asset-security-302683476.html
[^72]: Openfort (2026-01-27), *The Agentic Wallet Problem*. https://openfort.io/blog/agentic-wallet-problem
[^74]: Delphi Digital (2025-02-25), *Squads' Expansion from Multisigs to Crypto-Native Fintech Infrastructure*. https://members.delphidigital.io/reports/squads-transition-from-multisigs-to-crypto-native-fintech-infrastructure
[^75]: FluxA (2026-04-21), *x402, ACP, AP2 & MPP: The Agent Payment Stack*. https://fluxapay.xyz/learning/x402-acp-ap-2-and-mpp-the-agent-payment-stack
[^76]: ATXP (2026-03-04), *Every Agent Payment Protocol Compared: X402, ACP, UCP, AP2*. https://atxp.ai/blog/agent-payment-protocols-compared
[^77]: DARKNAVY (2025-03-24), *Reconstructing the $1.5 Billion Bybit Hack by North Korean Actors*. https://www.darknavy.org/darknavy_insight/reconstructing_the_1.5_billion_bybit_hack_by_north_korean_actors/
[^78]: Satish Chand Gupta / The Central Bulletin (2026-04-06), *AI Agent Wallets Are Coming. Here Is What Autonomous On-Chain Finance Actually Looks Like*. https://thecentralbulletin.com/ai-agent-wallets-autonomous-on-chain-finance-2026/
[^79]: arXiv preprint 2601.04583 (2026), *Autonomous Agents on Blockchains: Standards, Execution Models, and Trust Boundaries*. https://arxiv.org/abs/2601.04583
[^80]: WalletWitness (2026-05-05), *Bybit Hack 2025: A Blockchain Forensic Walkthrough of the $1.46B Theft*. https://walletwitness.com/blog/bybit-hack-blockchain-forensic-walkthrough/

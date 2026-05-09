---
title: "The Agent-Fleet Incident Response Runbook"
subtitle: "Cross-protocol freeze coordination from Bybit to KelpDAO — what agent-wallet treasuries do when something breaks"
publication: "perea.ai Research"
authors: ["Dante Perea"]
version: "1.0"
status: "Public draft"
date: "2026-05"
audience: "Agent-platform engineers, treasury operators, and custody/compliance leads at organizations operating agent-wallet fleets in 2026"
length: "~7,500 words"
license: "CC BY 4.0"
profile: "field-manual"
description: "Five anchor incidents from 2025–26 — Bybit Safe{Wallet}, KelpDAO/Aave, Circle Drift, Tether $344M Iran, BlockSec freeze-gap — turned into operational primitives for agent-wallet fleets. ERC-4337 session keys, ERC-8196 policy-bound action, ERC-8199 sandboxed wallet, programmable compliance, multi-stablecoin auto-swap, and a six-step coordination runbook."
---

## Executive Summary

When an agent-wallet fleet breaks, the recovery decision is not a smart-contract upgrade or a multisig vote. It is a coordination problem that crosses protocols, exchanges, and stablecoin issuers within hours.[^1] The 2025–26 corpus of post-mortems has now produced enough of a pattern that practitioners can build for it directly.

The paper's argument is four claims.

**First, cross-protocol freeze coordination is the recovery primitive — not the contract upgrade.** Bybit's $1.46B[^1] Safe{Wallet} hack in February 2025 produced $42.89M[^2] in coordinated freezes across Mantle's 8-hour cmETH unstake delay, Tether ($181K), and the bounty network within 24 hours.[^1][^2] The smart-contract logic was never the vulnerability or the recovery surface — the coordinated industry response was.

**Second, stablecoin issuer freeze authority is asymmetric and policy-inconsistent — and that asymmetry has to be priced into the system, not assumed away.** Tether has frozen $4.4B across 7,200+ addresses in coordination with 340+ law enforcement agencies across 65 jurisdictions.[^3][^4][^5] Circle has frozen ~$117M across 601 wallets, almost exclusively under court order.[^6][^7] When Drift Protocol was drained for $285M on April 1, 2026, Circle declined to freeze the $232M[^7] USDC bridged from Solana to Ethereum via its own CCTP — citing legal-only freeze policy.[^7][^8] An attacker who can choose between two stablecoins of equivalent liquidity is choosing between two operational risk profiles.

**Third, agent-wallet primitives map onto these incidents directly.** ERC-4337 session keys with `validUntil` auto-revocation, ERC-8196 policy-bound action with hash-chained audit, ERC-8199 sandboxed-wallet detachment, programmable-compliance pre-transaction screening, and multi-stablecoin auto-swap on freeze detection are now production primitives.[^9][^10][^11][^12][^13] The job of the agent-wallet ops lead in 2026 is to choose which of the five and wire them together — not to invent new ones.

**Fourth, the freeze gap is a known and exploited vulnerability.** BlockSec's analysis of all 8,310 executed Tether `addBlackList` proposals from November 2017 through February 14, 2026 found that $215.5M[^14] of targeted USDT escaped freeze during the proposal-to-execution window — 5.4%[^14] by count, 7.4% by value.[^14] The fastest escape was three seconds; eighteen happened within sixty seconds; the median elapsed time was 77 minutes; the largest single escape moved $37.3M in under six minutes.[^14] Compliance teams that monitor freeze *executions* miss the threat. The actionable signal is the proposal.

The remainder of the paper is the runbook: four anchor incidents in detail, the freeze-gap math and stablecoin asymmetry, five agent-wallet recovery primitives, a six-step coordination procedure (Detect → Contain → Coordinate → Trace → Recover → Communicate), three deployment archetypes, and what 2027 looks like.

---

## Part I — Why this paper exists

The agent-wallet question in 2026 is no longer "can we deploy?" It is "what do we do when something breaks?"

The deployment question was settled in stages. ERC-4337 made smart accounts production-viable in 2023. EIP-7702 (live on Ethereum mainnet via Pectra in 2025) gave externally-owned accounts the same surface area without requiring migration.[^9] ERC-8196 (March 14, 2026) standardized the policy-bound action interface for AI-agent-authenticated wallets, cleanly slotting onto ERC-8004 (identity registration) and ERC-8126 (verification scoring) as the third layer of a unified trust stack.[^10][^15] ERC-8199 (March 19, 2026) standardized the sandboxed-wallet alternative for agents that need complete detachment from owner state.[^11] The infrastructure is shipped. Trillion-dollar enterprise treasuries are running agentic flows on top of it.

What is not shipped — what every white paper before this one has hand-waved — is the operational answer for what happens when a single signing ceremony goes wrong, when a partner protocol's bridge gets exploited, when a stablecoin issuer freezes a wallet your agent depends on, or when a regulator issues a seizure order against a counterparty mid-flow.

The 2025–26 incident corpus has the answers.

Four canonical events anchor the canon. **Bybit Safe{Wallet}** (February 21, 2025) is the largest financial exploit in Web3 history at $1.46B[^1][^17] drained, and it produced the most extensively-documented coordinated industry response.[^1][^16][^17][^18]

**KelpDAO/Aave** (April 18, 2026) showed how a bridge-layer compromise produces a utilization-driven liquidity freeze in a downstream lending protocol, and how a layer-2 Security Council can freeze ~25% of stolen funds in 48 hours.[^19][^20][^21]

**Circle USDC Drift** (April 1, 2026) showed what happens when an issuer declines to freeze — and the legal liability structure that produced that decision.[^7][^8][^22]

**Tether $344M Iran** (April 23, 2026) showed what unilateral freeze authority looks like when policy aligns with state action.[^4][^23][^24]

Why this is different for agent-wallet treasuries:

- **Per-wallet exposure is smaller, but operational frequency is higher.** A treasury team manages a handful of cold wallets; an agent fleet manages thousands of session keys and ephemeral signers. A signature ceremony involving Bybit's six-of-six multisig is not the agent-fleet failure mode. The failure modes are: a compromised session key signing five hundred adversarial transactions before circuit breakers fire; a partner DEX's contract address being blacklisted while your agent has a position in the pool; a counterparty wallet entering the OFAC SDN list mid-payment.
- **Signature ceremonies are replaced by policy engines.** Privy's three-primitive policy engine, Lit Protocol's PKP+DKG architecture, Newton Protocol's Magic Labs Risk Scoring Oracle on EigenLayer-restaking — these systems make recovery decisions programmable.[^25][^26][^27][^28] What used to be "halt withdrawals while we discuss" is now "the policy engine returns DENY with this rule_id and the agent is paused."
- **Recovery is distributed, not centralized.** The Bybit recovery did not happen in a war room. It happened across Arkham (forensic graphing), ZachXBT (public attribution), Mantle (structural delay), Tether T3 FCU (issuer freeze), Sygnia + Verichains (forensic confirmation), Binance + OKX + KuCoin + Bitget (exchange-side blacklist), and SEAL 911 (white-hat coalition).[^1][^2][^17][^29] Agent-wallet ops needs the same coordination muscle, not a centralized control room.

What this paper does *not* cover. Voice-first agents and telephony deployments are out of scope — the incident model is materially different. Off-chain centralized-exchange recovery is out of scope. Generic crypto-crime forensics methodology (transaction tracing, chain analysis) is out of scope; it is well-covered by Chainalysis, Elliptic, TRM Labs, and the dedicated forensics literature.

> ### Quotable Findings I — Why agent treasuries need a runbook
>
> 1. **Within 24 hours of Bybit's $1.46B[^1] drain, $42.89M[^2] was frozen across Mantle, Tether, and partner exchanges — without legal process.** Modern recovery is a network effect, not a courtroom outcome.[^1][^2]
>
> 2. **An attacker held stolen USDC for one to three hours to test Circle's response before bridging via CCTP.** Stablecoin issuer policy inconsistency is a measurable variable, and attackers measure it.[^7][^8]
>
> 3. **The recovery primitive is coordination, not consensus.** Bybit's response succeeded because the playbook was rehearsed monthly with P-1 procedure drills, not because a recovery DAO voted.[^29]

---

## Part II — The Four Anchor Incidents

### 1. Bybit Safe{Wallet} hack (February 21, 2025)

**Vector.** The attack chain was not a smart-contract exploit. The Bybit Safe wallet contract (0x1Db92e2EeBC8E0c075a02BeA49a2935BcD2dFCF4, version 1.1.1) was structurally sound, and a Safe Foundation review concluded "no issue with the implementation of the smart contract."[^16] The compromise was upstream of the contract: North Korean Lazarus Group operators compromised a Safe{Wallet} developer's machine and obtained AWS S3 / CloudFront API credentials for app.safe.global.[^17][^18][^30] They injected JavaScript into the Safe web UI that activated only when the connecting wallet matched Bybit's specific Safe address — selective execution that kept the backdoor undetected by regular Safe users while compromising the high-value target.[^18] On February 18, 2025, three days before the attack, the attackers deployed two malicious contracts: an upgrade vector at 0x96221423681A6d52E184D440a8eFCEbB105C7242 and the replacement implementation at 0xbDd077f651EBe7f7b3cE16fe5F2b025BE2969516, with `sweepETH` and `sweepERC20` backdoor functions that only answered to the attacker's address.[^31][^32]

The actual compromise occurred during a routine cold-to-warm transfer on February 21, 2025 at 14:13:35 UTC.[^32] Bybit CEO Ben Zhou was the last of three signers required out of six. The Safe UI displayed the legitimate transaction; the data sent to the Ledger device was different. None of the three signers verified the transaction details on the Ledger hardware screen before approving — the canonical "blind signing" failure mode.[^32][^33] The signed transaction set `operation=1` (delegatecall) and `to=0x96221423681A6d52E184D440a8eFCEbB105C7242`, which executed a `transfer(address,uint256)` call that overwrote the `masterCopy` storage slot of the proxy contract.[^16][^34] The Bybit Safe wallet was now controlled by the attacker. Thirteen blocks later, the attacker had drained $1.46B in ETH, stETH, and ERC-20 tokens.[^17][^18]

**Recovery primitive.** What followed in the next 24 hours is the canonical agent-fleet incident response in microcosm.

The forensic attribution moved at chat-app speed. Arkham Intelligence had a public bounty out for definitive Lazarus identification before the dust settled.[^35] At 19:09 UTC on February 21 — under five hours after the attack — independent investigator ZachXBT submitted definitive proof of Lazarus involvement based on test-transaction analysis, connected-wallet identification, forensic graphs, and timing analyses against the prior Phemex hack patterns.[^35][^36][^37] The U.S. FBI subsequently confirmed the same attribution in their own statement.[^2]

The structural-defense recovery came from Mantle. Mantle's mETH Protocol holds an 8-hour built-in withdrawal delay on cmETH unstaking. The attackers tried to unstake 15,000 cmETH (~$43M)[^38] inside that window, and Mantle's team froze the unstake before the funds became liquid.[^38][^2] Tether moved to freeze $181K of USDT linked to attacker addresses on the same day.[^2] The cumulative recovery within the first 24 hours was $42.89M — a number that is striking precisely because none of it required a court order, an extradition treaty, or a multilateral law enforcement coordination call.[^2]

The bounty network compounded the recovery. Bybit launched a 10% bounty program — a roughly $140M[^2][^39] pool — for any entity that successfully recovered or facilitated a freeze of stolen funds.[^2][^39] LazarusBounty.com let participants sign in as bounty hunters with a wallet, and featured a *live ranking* of good and bad actors with response times publicly recorded.[^39] Ben Zhou's framing was operational: "You don't want to end up on the bad actor list. It's a record of you helping to facilitate sanctioned transactions."[^39]

The forensic confirmation came from two independent teams. Sygnia and Verichains both confirmed the AWS S3 / CloudFront API key compromise vector.[^17][^18] Sygnia found that the malicious JavaScript on Safe{Wallet}'s S3 bucket had been modified two days before the February 21 attack and that updates removing the malicious code were uploaded *two minutes after* the attack transaction was published — clean operational signature.[^18]

**Lessons.** Three concrete mitigations emerged. Ledger's published thesis (March 27, 2025) calls for Clear Signing on every transaction request and governance change, with critical keys held in HSM Secure Elements (not by users), Operators acting as approvers via Trusted Display devices (Ledger Stax) connected through mutually-authenticated encrypted channels independent of web infrastructure.[^40] BlockSec's Phalcon team flagged hardware-wallet inability to parse Safe transactions as the structural blind-signing root cause and committed to automatic Safe-monitoring product roadmap.[^32] Ape.law's analysis of Bybit's response identifies the operational driver: a P-1 event procedure that triggers on any function impacting >10,000 clients or causing damage in excess of $1M[^29], with monthly preparation drills, methodical alert sequencing, and pre-delegated role assignments.[^29]

As of April 2025, per Ben Zhou's own published numbers: 68.57% of stolen funds remained traceable, 27.95% had gone dark through laundering, and 3.84% were frozen.[^2]

### 2. KelpDAO / Aave bank-run (April 18, 2026)

**Vector.** A forged LayerZero message drained 116,500 rsETH (approximately $292M) from the Kelp DAO Ethereum LayerZero adapter in a single block.[^19] The attacker did not stop at the bridge: they immediately deposited the stolen rsETH on Aave V3 as collateral and looped to borrow approximately $236M in WETH within 46 minutes.[^19][^20] LayerZero attributed the attack to North Korea's Lazarus Group with preliminary confidence — the same TraderTraitor unit responsible for the Bybit hack and the earlier Ronin Bridge $625M attack.[^21][^41]

The downstream effect on Aave was a textbook utilization-driven liquidity freeze. Aave V3 Ethereum Core total available liquidity contracted from $9.77B at 17:00 UTC to $5.75B by 22:00 UTC (-41.1%) over 29 hours.[^19] WETH liquidity collapsed from $689M[^19] at 17:00 UTC to $1.5M by 19:00 UTC — a 99.8%[^19] drop in two hours, driven by the attacker's borrow stack on top of a panic-withdrawal wave.[^19] USDT and USDC followed within twelve hours as stranded depositors panic-borrowed stablecoins to exit; CoinDesk's reporting cites approximately $300M in aggregate synthetic-exit borrows.[^19][^20] Aave's contracts, oracles, and liquidation engine functioned as specified throughout. The liquidity disappeared because depositors could not distinguish Kelp-specific impairment from the rest of the protocol's reserves in real time.

**Recovery primitive.** The Protocol Guardian executed two staged freezes: rsETH at 18:52 UTC on April 18 across twelve Aave deployments (Ethereum Core, Prime, Arbitrum, Base, Plasma, Linea, and others), and WETH at 02:28 UTC on April 19 across Core, Prime, Arbitrum, Base, Mantle, and Linea.[^19][^42] The freezes blocked new supplies and new borrows but did not restrict existing positions; LTVs on the affected reserves were set to zero.[^42][^43]

The most consequential recovery action came from layer 2. The Arbitrum Security Council, acting with input from law enforcement on the exploiter's identity, executed an emergency freeze of 30,766 ETH (approximately $71M)[^21] from the exploiter's Arbitrum address at 23:26 ET on April 20 — moving the funds to a governance-controlled intermediary wallet accessible only via further Arbitrum governance action.[^21] This represents approximately 25% of the original drain held in escrow pending allocation.[^21][^19]

LlamaRisk's scenario analysis put bad debt at $123.7M to $230.1M against the Aave protocol.[^19] Aave's Umbrella backstop — the protocol's built-in slashing-AAVE-stake bad-debt mechanism — was projected to cover $177M to $200M.[^20]

**Distinguishing characteristic.** The freeze was not what created the zero-liquidity condition. Pool utilization had reached 100%[^19] seven hours before the WETH freeze took effect. The freeze's practical effect was closing the *primary organic pathway for pool replenishment* through new deposits — preventing the situation from spiraling further but not undoing the underlying utilization compression.[^19] This is a critical pattern for agent-wallet ops to internalize: the act of freezing a market does not always *recover* assets, but it always *bounds the further damage* and creates the negotiation window for layer-2 Security Council action and Umbrella-style bad-debt socialization.

### 3. Circle USDC Drift hack non-freeze (April 1, 2026)

**Vector.** The Drift Protocol attack was a multi-week operation, not a flash exploit. Drift's attackers compromised the Drift Security Council and used a Solana mechanism known as a "Durable Nonce" on March 30 to quietly gain the multisig approvals they needed without triggering signer alerts.[^22][^44] On April 1, they shifted admin authority on Drift, initialized a fake asset called CVT, artificially inflated its value via oracle manipulation, and borrowed against the false collateral. Drift's JLP Delta Neutral, SOL Super Staking, and BTC Super Staking vaults were drained for a total of approximately $285M — making it the largest DeFi hack of 2026 to that point.[^22][^45]

The attacker held the stolen USDC across multiple wallets for one to three hours before bridging.[^7][^45] Then, over several hours of US business time on April 1, they bridged approximately $232M[^45] USDC from Solana to Ethereum via Circle's own Cross-Chain Transfer Protocol (CCTP) across more than 100 transactions.[^45] The attacker deliberately avoided converting to USDT during the bridging — a calculated bet that Circle would not deploy its smart-contract blacklist authority during the window.[^7][^46] The bet was correct.

**Recovery primitive (or its absence).** Circle declined to freeze. Circle CEO Jeremy Allaire's framing was explicit: "If there are others that believe that Circle should just step away from what the law says and do its own, make its own decisions, I think it's a very risky proposition."[^47] Circle's published policy: "We freeze assets when legally required, consistent with the rule of law and with strong protections for user rights and privacy."[^7]

The asymmetry that drew immediate scrutiny: nine days earlier, on March 23, Circle had aggressively frozen the USDC balances of 16 unrelated business hot wallets in a sealed civil case — disrupting exchanges, casinos, and payment processors that were conducting normal operations.[^45][^46][^48] Circle has cumulatively blacklisted approximately $117M across 601 wallets per Dune Analytics.[^45] The capability exists. The criteria for using it appear to depend more on who is asking than on what is happening on-chain.

A class action lawsuit was filed by law firm Gibbs Mura on behalf of Drift Protocol investors, alleging that Circle had both technical capability and contractual authority to freeze the stolen funds, but did not.[^47] Drift secured a recovery package that included $127.5M from Tether and $20M from partners.[^47]

**Importance for agent treasuries.** This is the canonical case for designing multi-stablecoin auto-swap and KYT-firewall pre-transaction screening into the agent-wallet stack. An issuer that requires court orders to freeze is not a worse partner — but it is a *predictable* partner whose response times are measured in days or weeks, not minutes. An agent treasury that depends on USDC for routing must assume zero issuer-level recovery during a flash-exploit window. An agent treasury that depends on USDT must assume the inverse: aggressive issuer freezes that may catch tainted-counterparty funds you legitimately received downstream of a sanctioned address (the Tether 2-phase blacklist cycle, which can lock funds for months pending civil/criminal forfeiture).[^49]

### 4. Tether $344M Iran (April 23, 2026)

**Vector.** This is not a hack. It is what unilateral freeze authority looks like when policy aligns with state action.

On April 23, 2026, Tether froze $344M[^3] USDT across two Tron blockchain addresses — $212.9M and $131.3M respectively.[^4][^23][^50] The freeze was coordinated with the U.S. Office of Foreign Assets Control and multiple federal law enforcement agencies. A U.S. official told CoinDesk and CNN that the sanctioned wallets showed material links to the Iranian regime, including confirmed transactions with Iranian exchanges and routing through intermediary addresses connected to Central Bank of Iran-associated wallets.[^23][^24] Chainalysis confirmed that the on-chain patterns were consistent with known IRGC wallet behavior.[^24] Treasury Secretary Scott Bessent framed the action publicly as part of a broader Iran-pressure campaign labeled "Economic Fury."[^23]

This was Tether's largest single enforcement action on record, roughly doubling the previous high of $182M frozen across five Tron wallets in January 2026.[^50][^51] Cumulative Tether frozen assets crossed $4.4B[^4] as a result of this single freeze, with $2.1B[^4] tied to U.S. authorities. Tether now works with 340+ law enforcement agencies in 65 countries and has supported 2,300+ global cases including 1,200+ tied to U.S. agencies.[^4][^50]

**Recovery primitive (and its window).** The Tether freeze process is two-phase: a `submitTransaction` proposal call to the Tether multisig, followed by an `executeTransaction` call that actually adds the address to the blacklist mapping.[^14][^52] This produces an observable on-chain window — *the freeze gap* — between proposal and execution.

The freeze gap is the operational primitive that agent-wallet treasuries must understand. BlockSec's analysis of all 8,310 executed `addBlackList` proposals from November 2017 through February 14, 2026 found that during the proposal-to-execution window, $215.5M[^14] of targeted USDT escaped freeze — 5.4%[^14] by count (449 of 8,310 proposals had at least one escape transfer), 7.4% by value, with 7,504 escape transfers in total.[^14] The fastest escape moved funds in three seconds; eighteen escapes happened within sixty seconds; the median elapsed time was 77 minutes; the largest single escape moved $37.3M in under six minutes.[^14] On Ethereum, the median Tether multisig delay between proposal and execution exceeds five hours; on Tron, the gap is shorter but still measurable.[^53][^54]

For agent treasuries, this means two operational conclusions. **For compliance teams:** monitor freeze *proposals*, not executions. By the time `addBlackList` has executed, the high-value targets have routed funds through DEXes and bridges. BlockSec's USDT Freeze Tracker is the public dashboard for this; Phalcon Compliance is the enterprise tool.[^14][^54][^55] **For agent fleets handling potentially sanctioned counterparties:** the same window that lets attackers escape lets your agent route funds *out* of a counterparty wallet that is about to be frozen. This is the cold side of the primitive — and the legal side of what your KYT firewall has to enforce.

> ### Quotable Findings II — Cross-incident coordination patterns
>
> 1. **Bybit's $42.89M[^2] frozen in 24 hours was not the product of any single legal mechanism.** It came from ZachXBT publishing addresses publicly, exchanges flagging those addresses against deposit screening, Tether acting on attribution from a non-government source, and Mantle deploying a structural defense that hadn't been designed for this exact scenario.[^1][^2]
>
> 2. **Aave's contracts were never exploited; the freeze was downstream of a bridge compromise.** A Layer-7-style cascade through Layer 4 (LayerZero), Layer 3 (Kelp adapter), and Layer 2 (Aave) produced the bank run.[^19][^42]
>
> 3. **Tether and Circle now operate inverse policies on the same primitive.** Tether: aggressive proactive freezing on coordinated law-enforcement signal. Circle: court-order-only with civil-liability framing. An agent-wallet stack must price both into routing.[^4][^7][^47]

---

## Part III — The Freeze Gap and Stablecoin Asymmetry

The freeze gap is the most important quantitative result in the 2025–26 incident corpus, and the least appreciated.[^14] The gap exists because both USDT and USDC implement freeze functions as multisig governance actions, not single-key calls. A `submitTransaction` proposal goes to the issuer's multisig; the multisig must reach quorum; an `executeTransaction` call posts the addBlackList write. The gap between submit and execute is what every monitoring system that watches *executions* misses, and what every actor with a bot watching the multisig sees.

The numbers from BlockSec's February 19, 2026 analysis bear restating because they reframe what compliance instrumentation has to do.

Across 8,310 executed `addBlackList` proposals from November 2017 through February 14, 2026:
- $215.5M total escaped (vs the widely cited $78M figure from earlier reports).[^14]
- 449 proposals (5.4%) saw at least one escape transfer during the freeze gap.[^14]
- 7,504 escape transfers in total. Ethereum: 296 transfers across 102 proposals; Tron: 7,208 transfers across 347 proposals.[^14]
- Escape rates: Ethereum 3.7%, Tron 6.2%, combined 5.4% by count and 7.4% by value.[^14]

The timing distribution is what makes this operational rather than statistical:
- Fastest escape: 3 seconds.[^14]
- Within 1 minute: 18 events.
- Within 5 minutes: 54 events.
- Within 15 minutes: 105 events.
- Within 1 hour: 204 events (45% of all escapes).
- Median: 77 minutes. 75th percentile: 5.6 hours.

2025 was the inflection point. $141.7M[^14] escaped — more than all prior years combined ($67.7M[^14] total from 2021 through 2024).[^14] The escape rate climbed from approximately 5% to over 6%. The largest single 2025 event moved $37.3M in under six minutes.[^14]

Tether and Circle ship the same primitive but with materially different intensity. Tether has frozen $4.4B across 7,200+ addresses in cooperation with 340+ agencies in 65 countries.[^4][^5] Circle has frozen approximately $117M across 601 wallets, with a court-order-required policy.[^45][^48] In 2025 alone, Tether blacklisted 4,163 unique USDT addresses for $1.26B[^48] in frozen value (about $3.4M[^48] per day), and *destroyed* $698M[^48] (55.6%) via the `destroyBlackFunds` function — burning the tokens permanently from supply.[^52] The same-year unfreeze rate was 3.6%; median time to unfreeze for the rare cases that recover was 18.2 days.[^52]

The chain-distribution skew matters for routing decisions. Over 50% of frozen USDT resides on the Tron (TRC-20) network.[^49] An agent treasury operating predominantly on TRC-20 due to low gas fees is operating in a higher-radiation zone for tainted counterparty exposure than an agent treasury on Ethereum mainnet — a structural risk that must be priced into the rail-selection layer.

Smart-contract address freezes amplify the impact beyond targeted wallets. When a Uniswap or Curve pool's contract address is added to a USDT or USDC blacklist, every LP in the pool is frozen.[^53] When a DAO treasury or Gnosis Safe multisig is targeted, all beneficiaries lock simultaneously.[^53] Aave, Compound, and similar lending protocols can be frozen at the contract address level, locking individual users.[^49][^53]

The legal landscape is closing the optionality. The GENIUS Act, signed July 2025 with effective date January 2027, requires "permitted payment stablecoin issuers" to retain freeze authority "regardless of whether the tokens are in a custodial or non-custodial wallet."[^4][^5][^56] The joint FinCEN/OFAC Notice of Proposed Rulemaking dated April 10, 2026 implements the GENIUS Act's directive: PPSIs must comply with "lawful order"s including seizure, freeze, burn, or transfer-prevention; civil penalties up to $100,000 per day for material violations plus an additional $100,000 per day for knowing violations.[^56][^57] OFAC's smart-contract-control doctrine is the structural shift: a PPSI is deemed to control stablecoins it issues that are transferred via its smart contract, which means secondary-market dealings with blocked persons via smart contract interactions are prohibited dealings.[^57] By 2027, the question is not whether issuer freezes happen — it is how fast.

> ### Quotable Findings III — Freeze-gap math is operational
>
> 1. **5.4%[^14] escape rate is the floor, not the ceiling.** 2025 saw $141.7M[^14] escape — more than all prior years combined. Bots watching the multisig win the race to a median of 77 minutes; the fastest escape was three seconds.[^14]
>
> 2. **TRC-20 is a higher-radiation zone than Ethereum.** Over 50% of frozen USDT lives on Tron. An agent treasury optimizing for gas cost is compounding tainted-counterparty exposure.[^49][^14]
>
> 3. **Smart-contract address freezes catch every LP in the pool.** Uniswap, Curve, Aave, Compound, DAO multisigs — agent treasuries holding stablecoins as collateral inherit the issuer's freeze risk at the contract level, not just the wallet level.[^53]

---

## Part IV — Agent-Wallet Recovery Primitives

Five primitives carry the load. Each maps onto a specific failure mode from Part II.

### A. Time-bounded session keys with auto-revoke

**Standard.** ERC-4337 with ERC-7579 modular validation; EIP-7702 for EOAs that need temporary smart-account semantics without migration.[^9][^58][^59]

**Shape.** A session key is a temporary signer with a constrained scope. The Openfort `SessionKeyParams` struct captures the canonical fields:[^60]

```
struct SessionKeyParams {
    address key;
    uint48 validAfter;
    uint48 validUntil;
    uint256 ethLimit;
    address[] whitelist;
    bytes4[] allowedSelectors;
    uint256 operationLimit;
}
```

**Operating defaults.** ZeroDev Kernel V3.1's TimestampPolicy now ships a default validity window of 3,600 seconds (one hour), reduced from a previous 24-hour default — and ZeroDev's reasoning is operational: a one-hour exposure window collapses an attacker's blast radius from 24 hours of session-key abuse to one hour, with no further developer action required.[^61] The default gas budget is 0.01 ETH, which on Layer 2 covers thousands of typical agent operations but caps malicious spend.[^61]

**Best-practice rules.** Across the production-maturity stack (Openfort, thirdweb, ZeroDev, Calibur):[^60][^59][^61][^62]
- Never use master keys for routine agent operations.
- Always set explicit `validUntil` — no eternal session keys.
- Whitelist target contracts; never issue `ANY_TARGET` session keys.
- Restrict callable functions via `allowedSelectors`.
- Revoke at session end; do not rely on expiry alone.
- Issue per-device, not per-user, for granular revocation.
- Prefer per-job session keys over per-lifetime session keys (Abba Baba ZeroDev pattern).[^61]

**Enforcement layer.** The bundler validates user operations against the permission plugin *before* they are submitted to any contract. A session key that exceeds its scope never produces an on-chain transaction — it fails at the bundler, which means agent compromise is bounded by the permission set at the protocol layer, not by post-hoc detection.[^61][^58]

**Failure mode this addresses.** Bybit-style key compromise. If the agent's signing environment is breached, the attacker obtains a session credential with a finite lifespan, a capped gas budget, a fixed contract whitelist, and a limited selector set. The exposure window for an SDK-default-configured agent is sixty minutes; the maximum gas spend is 0.01 ETH; the maximum reachable contract surface is the whitelist set by the developer. This is the structural answer to "what if our agent's signing key leaks?" — and it's an answer that does not require human intervention to kick in.

### B. Policy-bound action via ERC-8196

**Standard.** ERC-8196 (EIP-AI Agent Authenticated Wallet, March 14, 2026) — the third layer of a unified trust stack: ERC-8004 (Register/identity) + ERC-8126 (Verify/risk score) + ERC-8196 (Execute/policy enforcement).[^10][^15][^63]

**Shape.** The `IAIAgentAuthenticatedWallet` interface establishes the canonical pattern:[^10]

```
function registerPolicy(
    address agent,
    string[] calldata allowedActions,
    address[] calldata allowedContracts,
    address[] calldata blockedContracts,
    uint256 maxValuePerTx,
    uint256 maxValuePerDay,
    uint256 validAfter,
    uint256 validUntil,
    uint8 minVerificationScore
) external returns (bytes32 policyHash);

function executeAction(
    bytes32 policyHash,
    address target,
    uint256 value,
    bytes calldata data,
    uint256 nonce,
    bytes32 entropyCommitment,
    bytes calldata signature
) external returns (bool success, bytes32 auditEntryId);

function revokePolicy(bytes32 policyHash, string calldata reason) external;
```

**Audit primitive.** Each audit entry must include `previousHash` for hash-chain integrity. Implementations may store entries off-chain (e.g., on IPFS) with periodic on-chain Merkle roots posted to ERC-8004's Validation Registry.[^10][^15] This is the structural answer to "how do we prove what the agent did?" — a tamper-evident log that survives even owner compromise.

**Entropy commit-reveal.** ERC-8196 includes an EIP-712 entropy commit-reveal mechanism specifically to counter host influence on probabilistic agents. The owner commits to entropy before delegation; the agent reveals it during action execution. A host that tries to bias the agent's randomness fails the reveal check.[^10] This is the answer to a category of attacks that session keys alone cannot address: a compromised agent runtime that manipulates the LLM's outputs.

**Verification gate.** The `minVerificationScore` field enforces ERC-8126 risk-score threshold. Wallet Verification (WV) flags must show clean results: no signs of sanctions, mixer usage, bot-like patterns, rapid forwarding, or threat intelligence hits. Even if the overall risk score appears acceptable, wallets must reject or revoke delegations if WV flags malicious activity.[^10][^15]

**Failure mode this addresses.** Drift-style insider compromise of a multi-signer system. ERC-8196's policy hash is the pre-commitment that disambiguates legitimate from compromised actions. The Drift attackers compromised the Security Council via Durable Nonce — but a Drift-on-ERC-8196 implementation would have rejected the admin-shift action because it wasn't in the registered `allowedActions` list. The policy-hash-pre-commitment is the structural answer to insider compromise.

### C. ERC-8199 Sandboxed Smart Wallet

**Standard.** ERC-8199 (March 19, 2026) — the alternative to session keys for agents that need *complete* detachment from owner state.[^11][^64]

**Shape.** A sandboxed agent wallet is structurally separate from the owner wallet. The relationship is unidirectional: the owner has persistent withdrawal-and-remove access; the sandboxed wallet has zero claim against the owner. Interface:[^11]

```
function removeAgents(Agent[] calldata agents) external;
function invokeAgentExec(Execution[] calldata execs, bytes calldata signature) external;
function executeFromOwner(Execution[] calldata execs) external;
function owner() external view returns (address);
```

**Why sandboxing instead of session keys.** Session-key architectures share the owner's wallet, which inherently introduces permission-evasion concerns unless every action is gated by an enforced whitelist mechanism. Whitelist enforcement is operationally heavy and can constrain agent capabilities. Sandbox isolation removes this trade-off entirely: the agent runs in a wallet detached from the owner; even a complete agent compromise cannot reach the owner's other assets.[^11]

**Best-practice signaling.** ERC-8199 spec recommends signature replay attack protection on `invokeAgentExec()`, time-boxed signatures, whitelist-style enforcement (vs blacklist) on Checker `termData`, and keeping `executeFromOwner()` always open as the recovery path.[^11]

**Failure mode this addresses.** High-frequency-trading and algorithmic-execution agent fleets where the agent's autonomy budget is high and the worst-case spend matters more than fine-grained capability shaping. If an HFT agent is compromised — whether through a hallucination, a prompt injection, or a credential leak — the loss is bounded by the sandbox cap. The owner removes the agent in one transaction; the sandbox keeps running with a new agent or pauses; nothing else moves.

### D. Programmable compliance and pre-transaction risk scoring

**Stack.** Privy three-primitive policy engine + Lit Protocol PKP + DKG + Newton Protocol Magic Labs Risk Oracle (EigenLayer-secured).[^25][^26][^27][^28][^65]

**Privy's three primitives.** A *policy* is the complete set of constraints that govern a wallet, applied at the key level and versioned. A *rule* describes when an action should be allowed or denied; each rule is composed of one or more conditions; DENY takes precedence over ALLOW, and if no rule resolves, the policy defaults to DENY.[^25][^26] A *condition* is a Boolean expression evaluated against an incoming RPC request. Privy's policy engine runs in a TEE / secure enclave for tamper-resistant enforcement; some policies (transfer-size limits requiring transaction simulation) run at API level.[^25][^66]

**Lit Protocol PKPs.** Programmable Key Pairs are ECDSA keypairs represented as ERC-721 NFTs.[^27] Lit Actions are immutable JavaScript published to IPFS that execute agent intents. Distributed Key Generation (DKG) ensures the agent's private key is *never fully reconstructed* by any single party — neither the admin, nor the delegatee, nor the Lit nodes themselves can recreate it.[^27] Roles split: Admin defines and enforces policies and permits tools; Delegatee executes within bounds. This is the structural answer to "how do we trust an agent developer with an agent's wallet?" — the developer cannot tamper with the wallet because no single party holds the key.

**Newton Protocol's EigenLayer-secured oracle.** Newton's Magic Labs Risk Scoring Data Oracle ingests wallet and email risk intelligence derived from seven years of transaction data across 50M+ wallets, enriched with OFAC sanctions and public datasets.[^28] A wallet or email receives a risk score; developers integrate with Newton Protocol policies to determine whether an action proceeds. Use cases: AI trading agents block transactions with OFAC-sanctioned counterparties; stablecoin issuers block mints/redemptions tied to elevated-risk entities; DeFi lenders dynamically adjust borrowing limits or collateral ratios. The decentralized operator network is secured by EigenLayer restaking — meaning oracle output is not a centralized control point.[^28]

**Failure mode this addresses.** OFAC-style counterparty inclusion. An agent that's about to send funds to a wallet that just entered the SDN list — or just got proposed for a Tether `addBlackList` — is the failure mode. Pre-transaction risk-score gates prevent the agent's own action from creating downstream tainted-counterparty exposure. This is also the layer where the freeze-gap-monitoring loop runs: if Phalcon Compliance or the BlockSec USDT Freeze Tracker fires on a counterparty wallet, the policy engine flips its allow rule to deny before the agent's next planned transaction.

### E. Multi-stablecoin auto-swap on freeze detection

**Stack.** Eco Routes + CCTP V2 Hooks + SwitchStable + freeze monitoring (FreezeWatch / KYC-Chain / BlockSec).[^67][^68][^69][^53][^49][^14]

**Eco Routes.** 15 chains supported (Ethereum, Optimism, Base, Arbitrum, HyperEVM, Plasma, Polygon, Ronin, Unichain, Ink, Celo, Solana, Sonic, BSC, Worldchain). Stablecoin coverage: USDC, USDT, USDC.e, oUSDT, USDT0, USDbC, USDG.[^68] Bulk intents support batching dozens of payments into single submissions with shared deadline and fallback logic — the canonical pattern for agent-treasury operations like Friday vendor runs and month-end sweeps.[^68]

**CCTP V2 Hooks.** Circle's Cross-Chain Transfer Protocol v2 introduces post-mint callbacks that execute atomically with the destination-chain mint. An agent paying a Solana merchant in USDT from a Base USDC balance encodes a Hook that, after USDC mints on Solana, executes a USDC-to-USDT swap on a Solana DEX and forwards the USDT to the merchant. One signed intent, two execution legs, atomic finality.[^67]

**SwitchStable's agent spend controls.** The StableSwitchRouter contract embeds maxPerTx, dailyLimit, allowedTokens, requireHumanGate, humanGateThreshold, replay protection. Below threshold, agent pays autonomously; above threshold, the contract pauses and notifies operator before funds move.[^69]

**Freeze-detection wiring.** FreezeWatch indexes every USDC and USDT blacklist event on-chain in real time; BlockSec USDT Freeze Tracker provides Overview, Events, Addresses, Proposals dashboards covering Ethereum and Tron native data; KYC-Chain enrolls treasury addresses into "Continuous Monitoring" with immediate alerts when a counterparty is added to a blacklist.[^53][^55][^49] On detection, the agent triggers a swap-out: USDT positions auto-swap to USDC; or vice versa; or both swap to PYUSD or DAI depending on the freeze pattern.

**Failure mode this addresses.** Counterparty becomes tainted post-transaction — your agent received USDT from a wallet that was subsequently blacklisted, and Tether's freeze-then-burn cycle is about to lock and destroy the funds. Auto-swap on detection routes out of the affected stablecoin into a different rail before the burn executes. This is the structural answer to "what if Tether destroys USDT in a wallet we received it from?" — diversify before the destruction window closes, ideally during the proposal-to-execution gap.

> ### Quotable Findings IV — Primitives in production
>
> 1. **ZeroDev's default session-key validity is now one hour, down from twenty-four.** The structural compression of attacker exposure window — from a working day to a coffee break — is the most under-reported security improvement in 2026 agent infrastructure.[^61]
>
> 2. **ERC-8196's entropy commit-reveal is the answer to host-influenced LLM agents.** Session keys cannot prevent a compromised runtime from biasing the model's outputs; pre-committed entropy can.[^10]
>
> 3. **Lit Protocol's DKG means no single party — admin, delegatee, or Lit itself — can reconstruct the agent's private key.** The trust assumption that breaks every centralized custodian is the trust assumption Lit removes by construction.[^27]

---

## Part V — The Six-Step Runbook

When something breaks, the operational sequence is the same regardless of which incident archetype produced the breakage. Six steps, run in parallel where the dependencies allow.

### Step 1 — Detect (0–60 minutes)

The detection layer is three-source: behavior anomaly inside your own stack, on-chain monitoring of the protocols you depend on, and counterparty screening against the issuer freeze pipeline.

**Behavioral anomaly.** Privy's policy engine, Lit Protocol's PKP validators, and ERC-8196's policy hash all return DENY signals when an agent operation falls outside scope. The signal density rises before the breakage; treat policy-rejection rate as a leading indicator. Openfort's published heuristic — pause when spending velocity exceeds three times the rolling average, alert when policy-rejection rate exceeds K% in a window — is the canonical circuit-breaker pattern.[^60][^25][^27]

**On-chain monitoring.** BlockSec Phalcon (auto-monitors Safe wallets and registered protocol surfaces), Forta detection bots, and Hexagate alerting cover the protocol-side anomaly surface. The Bybit attackers were "testing in production" on Ethereum in the days leading up to the live attack via the wallet that funded gas for the original exploiter — a pattern that Phalcon's product roadmap explicitly addresses.[^32][^17]

**Counterparty screening.** Magic Labs Risk Score via Newton Protocol oracle, FreezeWatch real-time blacklist indexing on USDC and USDT, BlockSec USDT Freeze Tracker (Overview, Events, Addresses, Proposals dashboards), KYC-Chain Continuous Monitoring with treasury-address enrollment.[^28][^53][^14][^49] The actionable signal is the *proposal*, not the execution. By the time `addBlackList` has executed, the median escape window of 77 minutes has elapsed.

### Step 2 — Contain (60–120 minutes)

Containment is structural. The four mechanisms in order of escalation:

**Pause signing at the master-key level.** This is instant and does not require session-key cooperation. The master key issues a `pauseSigning` call (or equivalent at the policy-engine layer) that suspends all session-key-issued operations until further notice. Every operational session key is rendered inert without per-key revocation.

**Revoke policies via ERC-8196.** `revokePolicy(policyHash, reason)` invalidates the policy hash; downstream `executeAction` calls fail at the bundler.[^10] Revocation produces an `AuditEntryLogged` event with the reason string, which is the chain of custody for the post-hoc forensic narrative.

**Lit Protocol Admin removes Delegatee permission.** The Admin's role separation in LAW (Lit Agent Wallet) lets the asset owner (DAO, multisig, EOA) cut Delegatee execution rights instantly without touching the underlying Programmable Key Pair.[^27] The PKP remains active; the agent loses the ability to invoke Lit Actions via it.

**ERC-8199 owner removes the agent.** `removeAgents(Agent[] calldata agents)` is the structural answer for sandboxed wallets. The owner's withdrawal-and-remove access is preserved at all times; the sandbox empty after the call is the bound on the loss.[^11]

In all four cases, the structural property that matters is **time-to-containment in a single transaction** — without coordinated multisig signing, without governance vote, without out-of-band key recovery. Bybit's containment took thirteen blocks because the master key was already lost; the agent-fleet failure mode that this primitive prevents is the case where the master key is *not* yet lost but a session key is.

### Step 3 — Coordinate (24-hour window)

The Bybit playbook is the canonical reference. Five concurrent workstreams:

**Public attribution.** ZachXBT-style on-chain forensic narrative published within hours, identifying connected wallets, test transactions, and timing patterns.[^36][^37][^17] Arkham Intelligence-style bounty pool seeds the labor: 50,000 ARKM (~$31,500) was sufficient to motivate ZachXBT's submission within five hours of the Bybit attack.[^35][^36] Public attribution is what makes downstream coordination possible — exchanges, issuers, and partner protocols cannot freeze on their own initiative without a defensible story.

**Issuer engagement.** Tether's T3 Financial Crime Unit lane is pre-built coordination machinery; submission is a documented process via the T3 collaborator program.[^4][^71] Circle's path requires court order or formal OFAC sanction designation — slower, but available.[^7][^47] Trade-off: Tether responds in hours; Circle responds in days-to-weeks. Agent-fleet ops with both stablecoins in the rotation must maintain both lanes.

**Cross-exchange outreach.** Bybit's response engaged Binance, OKX, KuCoin, Bitget, and Coinbase within the first twelve hours.[^29][^36][^37] The pattern: provide the address list, request deposit-screening flags, request withdrawals to those addresses be paused, request communication channels to the receiving compliance teams. This is the "industry shared responsibility" framing KuCoin called out publicly during the Bybit window.[^36]

**Bounty-pool deployment.** Bybit's 10% bounty (~$140M pool) for any entity that successfully recovered or facilitated a freeze.[^2][^39] LazarusBounty.com hosted the live ranking of good and bad actors with response times publicly recorded — making participation reputationally costly to skip.[^39] The bounty is the labor-market mechanism; the public ranking is the enforcement mechanism.

**Structural-defense activation.** Mantle's 8-hour cmETH unstake delay, Arbitrum Security Council's emergency-freeze authority, Aave Protocol Guardian's market-freeze authority, Compound's market-pause authority. These are not always available, but when they are, they recover percentages an off-chain workflow cannot reach. Agent-fleet ops should *catalog* which structural defenses exist on the protocols they depend on, and which trigger conditions activate them, before an incident.

### Step 4 — Trace (24–72 hours)

Tracing is delegated to specialists by default. Arkham Intelligence (forensic graph platform), Chainalysis (45-day multi-wave laundering reference model from the Bybit response), Elliptic (DPRK-pattern analysis), TRM Labs (T3 FCU technical partner) are the canonical providers.[^2][^17][^21][^4]

ZachXBT's public trace is the model for how a non-government, non-corporate forensic narrative can drive coordination. The submission to Arkham included: detailed analysis of test transactions, identification of connected wallets used ahead of the exploit, multiple forensic graphs, and timing analyses against the prior Phemex hack patterns.[^35][^36] What made the trace coordination-ready, not just analytically correct, was the explicit similarity match against a prior known-DPRK incident — reducing the attribution to a pattern claim, not a novel investigation.

Walletwitness's one-year retrospective on the Bybit forensic playbook captures the pragmatic reality for smaller incidents: "rapid on-chain trace, identify destination exchanges, file with affected platforms (especially for USDT freezes via Tether), and pursue civil and criminal channels in parallel. Recovery odds are highest when the trace work begins within 24-48 hours."[^2]

### Step 5 — Recover (72 hours – 30 days)

Recovery resolves through three concurrent channels:

**Protocol-side.** Aave's Umbrella backstop covered an estimated $177M-$200M of the KelpDAO bad debt by drawing on staked AAVE.[^20][^19] Arbitrum Security Council emergency freeze recovered 30,766 ETH (~$71M, ~25% of the original drain).[^21] These are protocol-level recovery primitives that exist independent of the issuer's freeze decision and the courts.

**Issuer-side.** Tether's burn-and-reissue cycle: freeze → `destroyBlackFunds` (which permanently removes the tokens from supply) → re-mint to a designated "clean" wallet controlled by law enforcement.[^49] Tether destroyed $698M of frozen USDT in 2025 alone.[^52] Circle's freeze-after-court-order path: slower, but produces civil judgment-driven recovery for legitimate counterparty cases.

**Industry-side.** Bounty payouts (Bybit's pool paid multiple parties); partner recovery packages (Drift secured $127.5M from Tether and $20M from partners despite Circle's non-freeze).[^47][^2] Recovery here is contractual, not protocol-level — but it is real money, and it is the mechanism for cases that fall outside the freeze surface.

The Bybit retrospective number is the most useful frame for what realistic recovery looks like at scale: as of April 2025, 68.57%[^2] of the $1.46B[^1] remained traceable, 27.95%[^2] had gone dark through laundering, and 3.84%[^2] was frozen.[^2] The structural ceiling on freeze-based recovery is in the low single digits of stolen value at the largest scale; the action surface is *traceability* (which preserves civil-litigation and tax-recovery options) rather than freeze-as-restoration.

### Step 6 — Communicate (continuous)

The Bybit communications playbook is the canonical reference. Ben Zhou's choice to live-stream the response on X two hours after the exploit — face on camera, factual but reassuring tone, no Twitter Spaces — was preceded by a deliberate calculation that delegating the comms response would decimate trust.[^29] The P-1 procedure trigger condition (>10,000 clients impacted or >$1M damage) is the ops-side complement: it routes the incident into pre-rehearsed alert sequences, role delegations, and template-driven external communication.[^29]

Ape.law's analysis of the response identifies the operational principles: "Communications templates should be developed according to the critical event, immediately acknowledge the event, and provide clear, factual details without speculation. Users need to know whether their assets are at risk—if funds are secure or backed, state it unequivocally. A calm, reassuring tone is critical; panic spreads in uncertainty, and clarity quells fear."[^29] For agent-fleet ops, the equivalent is a *user-facing freeze-tracker page* (for any agent that touches user funds) and a *programmatic status endpoint* that operational dashboards can consume; both should auto-update from the policy-engine event stream.

> ### Quotable Findings V — The 24-hour playbook
>
> 1. **Bybit's P-1 procedure triggered on damage >$1M[^29] or impact >10,000 clients.** This is the operational threshold worth borrowing — the rest of the playbook follows from it.[^29]
>
> 2. **The bounty + public ranking combination is the labor market for recovery.** LazarusBounty.com made participation reputationally costly to skip; the bounty pool made participation financially worthwhile to take on.[^39]
>
> 3. **Recovery's structural ceiling is in the low single digits at the largest scale.** Bybit's published numbers: 3.84% frozen, 68.57% traceable, 27.95% gone dark. The action surface is traceability and civil-recovery preservation, not freeze-as-restoration.[^2]

---

## Part VI — Three Archetype Walkthroughs

The runbook is the same; the wiring is different.

### Archetype A — Multi-chain stablecoin treasury agent

**Stack.** Eco Routes for cross-chain rebalancing across 15 chains; Privy policy engine + Magic Labs Risk Oracle for pre-transaction screening; CCTP V2 Hooks for USDC native bridging with atomic post-mint swap-and-forward; SwitchStable for non-USDC stablecoin swap legs.[^68][^25][^28][^67][^69] Session keys derived from a master multisig, scoped per-corridor, expiring on a daily schedule.[^68]

**Failure mode this addresses.** Tainted stablecoin inbound. A counterparty sends USDT that, hours later, ends up on the Tether `addBlackList` proposal queue. FreezeWatch fires; the policy engine flips the corridor's allow rule to deny; the agent triggers an auto-swap of the affected balance into PYUSD or DAI before the `executeTransaction` call completes the freeze.[^53][^14] The master multisig issues a Step-2 `pauseSigning` if the volume exceeds the per-corridor circuit-breaker threshold; cross-exchange outreach (Step 3) is preempted because the agent never bridged the affected funds outward.

**The freeze-gap arbitrage in operation.** This archetype is where the freeze-gap math becomes operationally valuable rather than just defensively useful. The median 77-minute window between Tether proposal and execution is sufficient for an agent monitoring proposals to swap or distribute affected balances to fresh non-flagged wallets — the same window an attacker uses to escape, but used here for legitimate compliance protection.

### Archetype B — Agent-managed DeFi yield routing

**Stack.** ERC-8196 policy-bound action with explicit `allowedContracts` and `blockedContracts` arrays for the yield-venue universe; `minVerificationScore` set against ERC-8126 to filter low-trust counterparties; on-chain monitoring of Aave/Compound/Morpho/Euler markets through Phalcon and DeFi Saver alerts.[^10][^32][^70]

**Failure mode this addresses.** KelpDAO-style bridge or oracle exploit on a yield venue your agent has positions in. Phalcon detects the protocol-level anomaly within minutes; the policy engine's `revokePolicy` cuts off new deposits to the affected venue; the master multisig executes a withdraw-or-repay-and-exit if the position is reachable. The Protocol Guardian's freeze (Aave) or pause (Compound) is the structural defense — your agent's exposure is bounded by what positions remained outstanding when the freeze fired.

**The Umbrella backstop dynamic.** This archetype's recovery depends on the protocol-level backstop more than on issuer freezes. Aave V3 Umbrella is the canonical example; Compound has equivalent reserves. Agent-fleet ops should know the bad-debt-coverage capacity of every yield protocol the agent uses, because that number is the floor on what's recoverable when a venue's bridge or oracle fails. KelpDAO's $123.7M[^19]-$230.1M[^19] LlamaRisk bad-debt range against Aave's projected $177M[^20]-$200M[^20] Umbrella coverage is the empirical model for what "covered position" looks like in 2026 DeFi.[^19][^20]

### Archetype C — Sandboxed agent fleet for HFT and algorithmic trading

**Stack.** ERC-8199 sandboxed wallets with one-per-strategy isolation; owner master-key control persistent and unidirectional; per-sandbox spend caps and time-boxed signature replay protection; circuit breakers tied to spending velocity (Openfort 3x rolling-average heuristic).[^11][^60]

**Failure mode this addresses.** Agent compromise via prompt injection, hallucination, or credential leak. The sandbox cap enforces a hard upper bound on the loss; complete agent compromise drains the sandbox but does not reach the owner's other assets or other agents' sandboxes. The owner's `removeAgents()` call is a single transaction; the sandbox can be emptied to a recovery wallet via `executeFromOwner()` immediately after.[^11]

**The Bybit-style P-1 procedure analog.** This archetype maps onto Bybit's P-1 trigger condition cleanest. The threshold is the per-sandbox cap, not a damage estimate — but the procedural shape is the same: pre-rehearsed monthly drills, methodical alert sequencing through the runtime layer, role delegation between agent ops, treasury, and security. Ape.law's framing of Bybit's reserve war chest ($3B[^29] at the time of the hack) generalizes to "the sandbox cap is the war chest"; the loss must be bearable, not just survivable.[^29]

> ### Quotable Findings VI — Archetypes converge on six primitives
>
> 1. **All three archetypes converge on the same six-step runbook with different wiring.** Detect / Contain / Coordinate / Trace / Recover / Communicate is invariant; what differs is which primitive does the work at each step.[^29][^60][^11]
>
> 2. **The freeze-gap math is exploitable in both directions.** Attackers escape during the proposal-to-execution window; honest agents can route out of compromised counterparties during the same window. Compliance teams that monitor proposals win this race; teams that monitor executions lose it.[^14]
>
> 3. **Sandboxed wallets and session keys are not competitors.** Session keys (ERC-4337/EIP-7702) cap exposure for delegated operations on the owner's account; sandboxed wallets (ERC-8199) detach the agent's account entirely. HFT and high-velocity strategies belong in sandboxes; low-velocity treasury operations belong in session-keyed master accounts.[^11][^60]

---

## Part VII — What 2027 Looks Like

Three structural shifts will close the operational gaps that the 2025–26 corpus exposed.

**Agent SBOM becomes a regulatory requirement.** The "agent bill of materials" — model + prompt + tool set + memory snapshot at deployment time — has no canonical format yet, but it is the natural artifact for compliance under EU AI Act high-risk obligations (effective August 2026), the Colorado AI Act (effective June 2026), and the GENIUS Act / FinCEN-OFAC NPRM regime (effective January 2027 for stablecoin issuers).[^4][^56][^57] By 2027, deploying an agent without an SBOM that maps to each of those frameworks will be operationally untenable for any treasury that touches U.S. or EU regulated rails. The hash-chained audit log mandated by ERC-8196 is the on-chain analog; the SBOM is the off-chain provenance complement.

**Private enforcement networks expand.** Tether's T3 Financial Crime Unit launched in September 2024 with TRON and TRM Labs; T3+ added Binance as the first global collaborator in August 2025; the trajectory suggests Coinbase, Kraken, OKX, and major DeFi protocols will join by 2027.[^4][^5] Once the network density crosses a threshold, "moving funds between platforms" stops providing cover — the surveillance graph spans the full ecosystem. The MiCA framework, FATF March 2026 report, and OFAC's smart-contract-control doctrine combine to make this a regulatory expectation, not a commercial choice.[^5][^57]

**ERC-4337 and ERC-8196 reach standard adoption; session-key validity defaults converge below one hour.** ZeroDev's V3.1 default at 3,600 seconds is the canonical line; thirdweb, Openfort, and the Rhinestone Smart Sessions stack are converging on the same range. The GENIUS Act's smart-contract-control doctrine combined with ERC-8196's `minVerificationScore` gating against ERC-8126 wallet verification produces a stack where every agent action is policy-bound, score-gated, and time-bounded by default — without the developer having to reason about it. Programmable-compliance oracles (Newton + Magic Labs + EigenLayer-secured) become the de facto pre-transaction layer; BlockSec / Phalcon-style proposal-monitoring becomes table-stakes for compliance teams.[^61][^28][^14]

The pattern is consistent: the 2025–26 incident corpus has produced enough evidence for the protocol layer to bake in the answers. The job of the practitioner in 2027 is not to invent new primitives — it is to wire the existing ones together correctly and rehearse the response procedure monthly.

---

## Closing

The agent-wallet incident response runbook is not a document you write after an incident. It is the policy engine you ship with the wallet on day one, the freeze-tracker you wire into your treasury monitoring before you take the first counterparty payment, the bounty pool you have a process to deploy before you need to deploy it, and the cross-exchange phone tree you have rehearsed before you need to call it.

Five primitives plus a six-step procedure plus a 24-hour coordination playbook. ERC-4337 session keys with `validUntil` auto-revocation and per-job rotation. ERC-8196 policy-bound action with hash-chained audit and ERC-8126 verification-score gating. ERC-8199 sandboxed-wallet detachment for high-velocity strategies. Programmable compliance via Privy + Lit + Newton + Magic Labs Risk Oracle. Multi-stablecoin auto-swap on freeze detection via Eco Routes + CCTP V2 Hooks + SwitchStable + FreezeWatch. Detect → Contain → Coordinate → Trace → Recover → Communicate.

The 2025–26 corpus of post-mortems is the field manual. Bybit Safe{Wallet} taught the industry that the smart contract is rarely the vulnerability and the coordination playbook is the recovery primitive. KelpDAO/Aave taught the industry that bridge-layer failures produce utilization-driven liquidity freezes downstream, and that Layer-2 Security Councils can recover meaningful percentages within 48 hours when law enforcement attribution is available. Circle's Drift non-freeze taught the industry that issuer policy inconsistency is a measurable variable that attackers measure. Tether's $344M[^3] Iran freeze taught the industry what unilateral state-aligned freeze authority looks like at scale. BlockSec's freeze-gap analysis taught the industry that the action surface is the proposal, not the execution.

By 2027, the regulatory environment will have closed most of the optionality. The GENIUS Act's smart-contract-control doctrine, EU AI Act high-risk obligations, and Colorado AI Act each independently mandate the artifacts and capabilities the runbook depends on. The agent treasury that ships those artifacts as defaults will be operating on the right side of the regulatory line; the treasury that does not will be operating against the BlockSec freeze-gap clock without the matching infrastructure to win the race.

Build it in. The runbook is the architecture, not the postmortem.

---

## Glossary

**T3 FCU.** Tether's T3 Financial Crime Unit, launched September 2024 in partnership with TRON and TRM Labs; expanded to T3+ in August 2025 with Binance as first member; 340+ law enforcement agencies in 65 countries; $4.4B cumulative frozen.[^4][^5]

**Freeze gap.** The window between Tether's `addBlackList` proposal submission and `executeTransaction` execution. Median 77 minutes Ethereum; faster Tron. $215.5M total escaped across 8,310 proposals (Nov 2017 – Feb 14 2026).[^14]

**addBlackList / destroyBlackFunds.** Tether's two-stage freeze-then-burn mechanism. Once `addBlackList` executes, transfers from the address revert. `destroyBlackFunds` permanently removes tokens from supply. Tether destroyed $698M of frozen USDT in 2025 alone.[^49][^52]

**validUntil.** Time-bounded session-key expiry timestamp. ZeroDev V3.1 default 3,600 seconds; previous default 86,400 seconds (24h).[^61]

**Session key.** A temporary ERC-4337/EIP-7702 signer scoped to specific contracts, selectors, and time windows. Never used for master operations.[^9][^60]

**ERC-7579.** Modular smart account standard for plug-in validation, execution, and hook modules.[^58][^60]

**ERC-8004.** AI agent identity registration standard. Layer 1 (Register) of the unified agent trust stack.[^10][^15]

**ERC-8126.** AI agent verification / risk scoring standard. Layer 2 (Verify) of the trust stack; Wallet Verification (WV) flags sanctions, mixers, bot-like patterns, rapid forwarding.[^10][^15]

**ERC-8196.** AI Agent Authenticated Wallet (March 14, 2026). Layer 3 (Execute) — policy-bound action with hash-chained audit, EIP-712 entropy commit-reveal, `minVerificationScore` gating.[^10][^15]

**ERC-8199.** Sandboxed Smart Wallet (March 19, 2026). Agent wallet structurally detached from owner wallet; owner has unidirectional withdraw-and-remove access.[^11]

**IAIAgentAuthenticatedWallet.** The ERC-8196 interface: `registerPolicy` / `executeAction` / `revokePolicy` / `getPolicy` plus `PolicyRegistered` / `ActionExecuted` / `PolicyRevoked` / `AuditEntryLogged` events.[^10]

**PPSI.** Permitted Payment Stablecoin Issuer (GENIUS Act). Treated as financial institutions under the Bank Secrecy Act; required to maintain freeze/seize/burn capabilities including for non-custodial wallets.[^4][^57]

**Clear Signing.** Ledger's mitigation thesis post-Bybit: every transaction request and governance change displayed in human-readable form on a Trusted Display device, parsed within the HSM Secure Element, independent of web infrastructure.[^40]

**Privy policy engine.** Three primitives: policies (key-level), rules (per RPC method, ALLOW or DENY with DENY precedence), conditions (Boolean over RPC request). Default DENY if no rule resolves. Enforced in TEE.[^25][^26]

**PKP.** Lit Protocol Programmable Key Pair: ECDSA keypair represented as ERC-721 NFT. Distributed Key Generation ensures private key never reconstructed by any single party.[^27]

**CCTP V2 Hooks.** Circle's Cross-Chain Transfer Protocol v2 post-mint callback. Executes destination-chain logic atomically with mint — used here for USDC-to-other-stable swap-and-forward in one signed intent.[^67]

---

## References

[^1]: WalletWitness. "Bybit Hack 2025: A Blockchain Forensic Walkthrough of the $1.46B Theft." May 5, 2026. <https://walletwitness.com/blog/bybit-hack-blockchain-forensic-walkthrough/>

[^2]: BTCC / cryptonewsT. "Bybit takes the offensive against Lazarus in $1.4b saga." February 25, 2025. <https://www.btcc.com/en-CA/square/cryptonewsT/113996>

[^3]: Tether.io. "Tether Supports Freeze of More Than $344 Million in USD₮ in Coordination with OFAC and U.S. Law Enforcement." April 23, 2026. <https://tether.io/news/tether-supports-freeze-of-more-than-344-million-in-usdt-in-coordination-with-ofac-and-u-s-law-enforcement/>

[^4]: Coingo. "Tether Executes Largest Enforcement Action in Company History." April 23, 2026. <https://coingo.net/news/tether-executes-largest-enforcement-action-in-company-history/>

[^5]: BlockEden. "Tether's $4.2B Global Freeze Network: How USDT Became Crypto's Shadow Law Enforcement Arm." March 14, 2026. <https://blockeden.xyz/blog/2026/03/14/tether-3-4b-global-freeze-network-usdt-law-enforcement-1800-investigations/>

[^6]: KYC-Chain. "The Stablecoin Freeze Alert: Protect Your Treasury from Tainted USDT." February 18, 2026. <https://kyc-chain.com/stablecoin-freeze-tainted-usdt-treasury-protection/>

[^7]: CoinDesk. "CRCL news: Circle faces backlash after $285 million Drift hack." April 3, 2026. <https://www.coindesk.com/business/2026/04/03/circle-under-fire-after-usd285-million-drift-hack-over-inaction-to-freeze-stolen-usdc>

[^8]: Bitlet.ai. "Stablecoins Under Scrutiny: What Circle and Tether Mean for Trust and Liquidity." April 4, 2026. <https://bitlet.ai/en/blog/9010-stablecoins-under-scrutiny-what-circle>

[^9]: ERC-4337 Documentation. "Session Keys & Delegation." <https://docs.erc4337.io/smart-accounts/session-keys-and-delegation>

[^10]: Ethereum Improvement Proposals. "ERC-8196: AI Agent Authenticated Wallet." March 14, 2026. <https://eips.ethereum.org/EIPS/eip-8196>

[^11]: GitHub ethereum/ERCs. "Add ERC: Sandboxed Smart Wallet (ERC-8199)." April 7, 2026. <https://github.com/ethereum/ERCs/commit/79b6b3191a4f165733563b8b368c2ff7e2a16e47>

[^12]: Privy. "Overview - Policies." <https://docs.privy.io/controls/policies/overview>

[^13]: Eco. "Multi-Stablecoin Routing for AI Agents." <https://eco.com/support/en/articles/14846273-multi-stablecoin-routing-for-ai-agents>

[^14]: BlockSec. "$215M USDT Escaped Tether Freeze: 8,310 Blacklist Proposals Exposed the Gap." February 19, 2026. <https://blocksec.ai/en/blog/usdt-freeze-escape-215m-tether-blacklist-8310-proposals/>

[^15]: GitHub ethereum/ERCs PR #1606. "Add ERC: AI Agent Authenticated Wallet." March 14, 2026. <https://github.com/ethereum/ERCs/pull/1606/changes>

[^16]: GitHub safe-global/safe-smart-account Issue #914. "Bybit Hack Onchain Analysis." February 22, 2025. <https://github.com/safe-global/safe-smart-account/issues/914>

[^17]: Curvegrid. "The ByBit Safe{Wallet} Hack." March 18, 2025. <https://www.curvegrid.com/blog/2025-03-18-the-bybit-safe-wallet-hack>

[^18]: BleepingComputer. "Lazarus hacked Bybit via breached Safe{Wallet} developer machine." February 26, 2025. <https://www.bleepingcomputer.com/news/security/lazarus-hacked-bybit-via-breached-safe-wallet-developer-machine/>

[^19]: Glassnode Insights. "Anatomy of a Liquidity Freeze." April 27, 2026. <https://insights.glassnode.com/anatomy-of-a-liquidity-freeze/>

[^20]: Bitcoin Ethereum News. "DeFi Lender Aave Battles Withdrawal Crisis After KelpDAO rsETH Exploit." April 19, 2026. <https://bitcoinethereumnews.com/tech/defi-lender-aave-battles-withdrawal-crisis-after-kelpdao-rseth-exploit/>

[^21]: CoinDesk. "Arbitrum freezes $71 million in ether tied to Kelp DAO exploit." April 21, 2026. <https://www.coindesk.com/markets/2026/04/21/arbitrum-freezes-usd71-million-in-ether-tied-to-kelp-dao-exploit>

[^22]: Gate.ac. "Circle Criticized for Not Freezing $285M Stolen USDC During Drift Protocol Hack." April 2, 2026. <http://gate.ac/news/detail/circle-under-fire-for-letting-285m-stolen-usdc-move-freely-during-drift-19986255>

[^23]: CoinDesk. "Tether's $344 million USDT freeze linked to U.S. 'Economic Fury' against Iran regime." April 24, 2026. <https://www.coindesk.com/policy/2026/04/24/tether-s-usd344-million-usdt-freeze-linked-to-u-s-economic-fury-against-iran-regime>

[^24]: CNN. "US freezes $344 million in cryptocurrency said to be linked to Iran." April 24, 2026. <https://www.cnn.com/2026/04/24/politics/us-freezes-cryptocurrency-iran>

[^25]: Privy Docs. "Policies Overview." <https://docs.privy.io/controls/policies/overview>

[^26]: Privy. "Turning wallets programmable with Privy's policy engine." May 1, 2024. <https://www.privy.io/blog/turning-wallets-programmable-with-privy-policy-engine>

[^27]: LIT-Protocol/agent-wallet README. <https://github.com/LIT-Protocol/agent-wallet/blob/main/README.md>

[^28]: Newton Protocol. "Newton Protocol Integrates Magic Labs Wallet Risk Data to Enforce Pre-Transaction Compliance." November 11, 2025. <https://blog.newton.xyz/newton-protocol-integrates-magic-labs-wallet-risk-data-to-enforce-pre-transaction-compliance/>

[^29]: Ape.law. "Bybit Hack: Crisis Response, Lessons for Founders and Industry Takeaways." 2025. <https://ape.law/blog/bybit-hack>

[^30]: Cryptowinrate. "Bybit Hack: $1.4B Crypto Heist Raises Security Concerns." February 21, 2025. <https://www.cryptowinrate.com/bybit-hack>

[^31]: Gate.io. "Analyzing the Bybit Hack Using the Radiant Multi-Signature Attack as an Example." February 22, 2025. <https://www.gate.io/learn/articles/analyzing-the-bybit-hack-using-the-radiant-multi-signature-attack-as-an-example/6711>

[^32]: BlockSec Medium. "Bybit $1.5B Hack: In-Depth Analysis of the Malicious Safe Wallet Upgrade Attack." February 25, 2025. <https://blocksecteam.medium.com/bybit-1-5b-hack-in-depth-analysis-of-the-malicious-safe-wallet-upgrade-attack-2b82e37d4d28>

[^33]: CertiK. "Bybit Incident Technical Analysis." February 23, 2025. <https://www.certik.com/blog/bybit-incident-technical-analysis>

[^34]: Bankless. "Bybit Hack Post-Mortem Identifies Safe Infrastructure as Exploit Point." February 26, 2025. <https://www.bankless.com/read/bybit-hack-post-mortem-identifies-safe-infrastructure-as-exploit-point>

[^35]: Arkham Intelligence. "Bybit $1 Billion Hack Bounty Solved by ZachXBT." March 2, 2025. <https://www.arkhamintelligence.com/announcements/bybit-1-billion-hack-bounty-solved-by-zachxbt>

[^36]: Cointelegraph. "ZachXBT identifies Lazarus Group as behind Bybit $1.4B hack, wins Arkham bounty." February 21, 2025. <https://cointelegraph.com/news/zach-xbt-identifies-lazarus-group-bybit-hack-arkham-bounty>

[^37]: Cryptoninjas. "ZachXBT Identifies Lazarus Group as Bybit $1.4B Hackers, Wins Arkham Bounty." February 22, 2025. <https://www.cryptoninjas.net/news/zachxbt-identifies-lazarus-group-as-bybit-1-4b-hackers-wins-arkham-bounty/>

[^38]: WalletWitness Bybit retrospective. Re-cited here for the Mantle 8-hour mETH withdrawal-delay specifics. <https://walletwitness.com/blog/bybit-hack-blockchain-forensic-walkthrough/>

[^39]: BTCC / cryptonewsT. Re-cited for the lazarusbounty.com 5% bounty and live ranking specifics. <https://www.btcc.com/en-CA/square/cryptonewsT/113996>

[^40]: Ledger. "Learning From The Bybit/Safe Attack." March 27, 2025. <https://www.ledger.com/blog-learning-from-the-bybit-safe-attack>

[^41]: Bankless Times. "Aave Freezes WETH Markets After KelpDAO Exploit." April 21, 2026. <https://www.banklesstimes.com/articles/2026/04/21/aave-keeps-weth-frozen-on-prime-and-key-l2-networks-after-kelpdao-exploit/>

[^42]: Aave Governance Forum. "rsETH Incident Report (April 20, 2026)." April 21, 2026. <https://governance.aave.com/t/rseth-incident-report-april-20-2026/24580?page=3>

[^43]: DeFi Saver Knowledge Base. "KelpDAO rsETH incident April 2026." <https://help.defisaver.com/general/kelpdao-rseth-incident-april-2026>

[^44]: CoinLive. "Did Circle Let $280M in Stolen USDC Slip Away? Drift Investors Sue." 2026. <https://www.coinlive.com/news/did-circle-let-280m-in-stolen-usdc-slip-away-drift>

[^45]: XT.com. "Circle under fire as $230M in stolen USDC flows unblocked." April 4, 2026. <https://www.xt.com/en/blog/post/circle-under-fire-as-230m-in-stolen-usdc-flows-unblocked-days-after-freezing-legitimate-accounts>

[^46]: AInvest. "USDC's $285M Flow Failure: A Liquidity Control Breakdown." April 4, 2026. <https://www.ainvest.com/news/usdc-285m-flow-failure-liquidity-control-breakdown-2604/>

[^47]: CoinLive. Re-cited here for the Allaire defense quote and Drift recovery package specifics. <https://www.coinlive.com/news/did-circle-let-280m-in-stolen-usdc-slip-away-drift>

[^48]: BlockSec. "USDT Blacklisting in 2025: $1.26B Frozen on Ethereum & Tron." January 30, 2026. <https://blocksec.com/blog/1-26-billion-frozen-usdt-blacklisting-on-ethereum-and-tron-in-2025>

[^49]: KYC-Chain. Re-cited here for TRC-20 high-radiation specifics and Tether 7,000+ wallets / $3.3B figure. <https://kyc-chain.com/stablecoin-freeze-tainted-usdt-treasury-protection/>

[^50]: The Defiant. "Tether Freezes $344M USDT in Coordination with U.S. Law Enforcement." April 23, 2026. <https://thedefiant.io/news/defi/tether-freezes-usd344m-usdt-in-coordination-with-u-s-law-enforcement>

[^51]: BlockEden. "Tether's $182 Million Freeze: How Stablecoins Became the New Frontline in Global Sanctions Enforcement." January 25, 2026. <https://blockeden.xyz/blog/2026/01/25/tether-182-million-usdt-freeze-venezuela-stablecoin-enforcement/>

[^52]: BlockSec. Re-cited here for $1.26B 2025 frozen and $698M destroyed specifics. <https://blocksec.com/blog/1-26-billion-frozen-usdt-blacklisting-on-ethereum-and-tron-in-2025>

[^53]: Freeze.Watch. "How Stablecoin Blacklists Work." <https://freeze.watch/how-stablecoin-blacklists-work>

[^54]: BlockSec. "The USDT Freeze Gap: How Multisig Delays Create a Window for Front-Running." February 18, 2026. <https://blocksec.ai/en/blog/>

[^55]: BlockSec. "BlockSec USDT Freeze Tracker Is Live." February 3, 2026. <https://blocksec.com/blog/block-sec-usdt-freeze-tracker-is-live>

[^56]: Orrick. "FinCEN and OFAC Propose Rule for Payment Stablecoin Issuers to Implement GENIUS Act." April 1, 2026. <https://www.orrick.com/en/Insights/2026/04/FinCEN-and-OFAC-Propose-Rule-for-Payment-Stablecoin-Issuers-to-Implement-GENIUS-Act>

[^57]: Federal Register. "Permitted Payment Stablecoin Issuer Anti-Money Laundering / Countering the Financing of Terrorism." April 10, 2026. <https://www.federalregister.gov/documents/2026/04/10/2026-06963/permitted-payment-stablecoin-issuer-anti-money-launderingcountering-the-financing-of-terrorism>

[^58]: Abba Baba Docs. "Session Key Security." February 19, 2026. <https://docs.abbababa.com/blog/product/2026-02-19-session-key-security>

[^59]: thirdweb portal. "Session keys." <https://portal.thirdweb.com/wallets/session-keys>

[^60]: Openfort. "Smart Wallet Security Best Practices for 2026." April 3, 2026. <https://www.openfort.io/blog/smart-wallet-security-best-practices>

[^61]: Abba Baba Docs. Re-cited here for ZeroDev V3.1 default 3,600s validity / 0.01 ETH gas budget specifics. <https://docs.abbababa.com/blog/product/2026-02-19-session-key-security>

[^62]: Openfort. "How to Build Wallet Permissions with Session Keys." February 20, 2026. <https://www.openfort.io/blog/how-to-build-wallet-permissions>

[^63]: EIPs.exposed. "ERC-8196 - AI Agent Authenticated Wallet." <https://eips.exposed/ercs/erc-8196.html>

[^64]: GitHub ethereum/ERCs PR #1609. "Add ERC: Sandboxed Smart Wallet." March 19, 2026. <https://github.com/ethereum/ERCs/pull/1609/changes>

[^65]: Privy. "Securely equipping OpenClaw agents with Privy wallets." August 7, 2024. <https://blog.privy.io/blog/securely-equipping-openclaw-agents-with-privy-wallets>

[^66]: Privy Docs. "Agentic wallets." <https://docs.privy.io/recipes/agent-integrations/agentic-wallets>

[^67]: Eco. Re-cited here for CCTP V2 Hooks specifics. <https://eco.com/support/en/articles/14846273-multi-stablecoin-routing-for-ai-agents>

[^68]: Eco. "AI Agents for Stablecoin Treasury." <https://eco.com/support/en/articles/14730442-ai-agents-for-stablecoin-treasury>

[^69]: SwitchStable. "Stablecoin DEX + Bridge + AI Agent Payments for DAOs." <https://switchstable.xyz/>

[^70]: Bitlet.ai. "Beyond USDT: PYUSD, QVAC Fabric and the Practical Playbook for Multi‑Stablecoin Payments." March 18, 2026. <https://bitlet.ai/en/blog/8608-beyond-usdt-pyusd-qvac-fabric>

[^71]: ICIJ. "Cryptocurrency giant Tether is wildly profitable. Can it do more to stop financial crime?" December 1, 2025. <https://www.icij.org/investigations/fincen-files/cryptocurrency-giant-tether-is-wildly-profitable-can-it-do-more-to-stop-financial-crime/>

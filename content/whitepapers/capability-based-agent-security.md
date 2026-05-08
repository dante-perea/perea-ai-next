---
title: "Capability-Based Security for Agent Runtimes"
subtitle: "Object-capability model, lattice authority, uninhabitable-state gates — the formal underpinning of CaMeL and FIDES"
publication: "perea.ai Research"
authors: ["Dante Perea"]
version: "1.0"
status: "Public draft"
date: "2026-05"
audience: "Agent platform engineers, AI security architects, founders building production agent runtimes, security teams reviewing MCP deployments"
length: "~5,500 words"
license: "CC BY 4.0"
description: "Why every modern AI agent is a confused-deputy attack waiting to happen, and how 40 years of object-capability research — KeyKOS, EROS, seL4, Capsicum, WASI — quietly resurfaced as CaMeL, FIDES, and Nucleus. The formal lineage, the current state of the art, and the practical adoption stack for agent platforms in 2026."
profile: "technical-playbook"
---

## Foreword

Forty years before "prompt injection" had a name, KeyKOS was running production workloads on an IBM 4341 in January 1983 with a security model that already structurally prevented the attack class.[^32] That model — object-capability, or OCap — was generalized in 1966 by Dennis and Van Horn,[^28] refined into the E programming language by Mark Miller in the 1990s,[^1][^3] proven sound by Shapiro in EROS (1991-1999),[^51] and machine-checked end-to-end by Klein et al. in seL4 (2009).[^30] By the time large language models started making tool calls in 2023, the secure-OS community had spent four decades building exactly the architectural defenses agent runtimes now scramble to retrofit.

The thesis of this paper is that 2025-2026 architectural defenses for AI agents — CaMeL,[^8] FIDES,[^40] Erik Meijer's Guardians of the Agents,[^14] Nucleus 297-Verus-proof lattice,[^19] AILANG IFC labels[^22] — are not new. They are object-capability security wearing a new t-shirt. Every agent runtime that holds private data, reads untrusted content, AND can call irreversible tools is a confused-deputy attack waiting to happen,[^21] and the architectural fix has been sitting on the shelf since 1985.

This paper traces the lineage, explains how OCap maps onto agent runtimes, surveys the four production systems shipping today, and lays out the practical adoption stack for builders.

## 1. The Confused Deputy and Why ACLs Lose

The dominant security model in commodity systems is the access control list (ACL): "given an authenticated identity, what is this principal allowed to do?" Linux, Windows, AWS IAM, OAuth 2.0 — all ACL.[^46] The model fails open under prompt injection because the agent's identity is unchanged when it gets compromised. The attacker doesn't steal the agent's credentials; the attacker convinces the agent to use them.

The OWASP LLM Top 10 spec for LLM06 Excessive Agency identifies three root causes: excessive functionality, excessive permissions, excessive autonomy.[^36][^37] The 2026 OWASP annotated edition adds the operational pattern: "prompt injection is the trigger; excessive agency is the blast radius."[^43] Red-team data backs this up — LLM01 (prompt injection) + LLM06 (sensitive disclosure) + LLM08 (excessive agency) account for roughly 80% of findings, with LLM08 producing the highest-paying bounties (RCE-path findings $10K-$50K+).[^44]

The capability model asks a different question. Not "who is the agent and what's it allowed to do" but "does the agent possess an unforgeable token granting exactly this action?"[^7] The distinction sounds philosophical but has concrete engineering consequences: it eliminates ambient authority, prevents the confused deputy attack, enables fine-grained delegation and attenuation, and supports revocation without requiring a global policy update.[^7] For multi-agent runtimes — where a Governor hands work to Executors, Executors call tools, and tool calls may trigger sub-agents — the OCap model maps almost directly onto the control flow graph.

Every recent AI security incident retraces a path the OS community walked decades ago. Samsung engineers pasting proprietary code into ChatGPT (LLM06).[^44] Microsoft Copilot manipulated to exfiltrate Slack messages through a prompt-injected document (LLM01 → LLM08).[^44] An agent given `DynamoDB:PutItem` when it only needs read.[^45] The fix is not better guardrails or stricter system prompts. The fix is to remove ambient authority altogether.

## 2. Object-Capability Fundamentals

Mark Miller's "From Objects to Capabilities" derives the OCap model from three rules.[^1] First: all authority an object has to affect or be affected by the world outside itself is exactly represented by the references it holds. Second: references are obtained only by introduction (passed in a message) or by primitive object construction. Third: anything globally accessible must be transitively immutable — otherwise it constitutes an unconditional source of authority outside the reference-passing rules.

The Granovetter Diagram visualizes the resulting structure: objects are nodes, references are arcs, and computation changes the topology of the graph but only in ways enabled by the current topology.[^2] To learn to think in capability terms is to see the dynamic reference graph as primary and objects as secondary. The key invariant: only connectivity begets connectivity.

Most modern capability systems provide one primitive that is not derivable from pure object computation: rights amplification.[^1] When two capabilities are brought together, the combined authority can exceed the sum of the parts. The classic example is the can and the can-opener — neither alone gets the food. E's primitive is the sealer/unsealer pair: a sealer wraps a value into an opaque envelope; only the matching unsealer can open it. Sibling communication patterns like Norm Hardy's mint-and-purse currency design fall out of this primitive.[^1][^4]

The capability lattice satisfies standard algebraic properties: idempotent (a ∧ a = a), commutative (a ∧ b = b ∧ a), associative ((a ∧ b) ∧ c = a ∧ (b ∧ c)), absorption (a ∧ (a ∨ b) = a), and monotonic delegation (delegate(parent, request) ≤ parent).[^21] The meet operation takes the most-restrictive of two capability levels. These laws aren't decorative — they enable algebraic reasoning about whether a configuration is safe, and they are the foundation of every formal verification effort for capability runtimes.[^19][^21]

The historical chain matters because each link added a verified property. KeyKOS [Hardy 1985] proved that pure capability operating systems were buildable and could carry production workloads.[^32] EROS [Shapiro 1991-1999] formally verified the confinement mechanism — the ability to enforce a "this code cannot leak data" property — and established that no comparable verification existed for any other primitive protection mechanism.[^51] seL4 [Klein 2009] machine-checked the entire kernel.[^30][^31]

## 3. Mapping OCap onto Agent Runtimes

The translation from secure-OS OCap to agent runtime is mechanical. When a Governor spawns an Executor to handle a task, it does not give the Executor a process with inherited permissions. It gives the Executor a set of capability objects — each one a typed unforgeable handle that encapsulates exactly one permission.[^7] A `FileWriteCapability { path: "/tmp/output.txt" }` permits writing to that specific path and nothing else. A `HttpGetCapability { base_url: "https://api.example.com" }` permits GET requests to that origin and nothing else. The Executor can only use these capabilities; it cannot construct new ones.

When the Executor needs to call a tool, the tool invocation carries the appropriate capability as a parameter.[^7] The tool handler verifies capability possession — not agent identity — before executing. If the capability wasn't passed, the call fails, regardless of which agent made it. Identity-based authorization disappears from the tool handler entirely.

Two OCap properties carry directly into the agent runtime. First: attenuation. A capability holder can wrap an existing capability in one that grants strictly less authority and pass the attenuated version downstream. An Executor that received a `FileWriteCapability` for `/tmp/` can attenuate it to `/tmp/task-42/` before handing it to a sub-agent. The sub-agent can never recover the original wider authority.[^7]

Second: revocable forwarders.[^7] Rather than granting a capability directly, the grantor wraps it in a forwarder object. The grantee receives a reference to the forwarder, which proxies all calls to the underlying capability. When the grantor wants to revoke access, it destroys the forwarder. All subsequent invocations through that forwarder fail immediately, without affecting other holders of the underlying capability. For agent runtimes, this enables task-scoped capabilities: an Executor receives a set of capabilities for the duration of a specific task, wrapped in a revocable forwarder tied to the task's lifetime. When the task completes — or is cancelled, or times out — the Governor revokes the forwarders. The Executor's tools are immediately neutered, regardless of what state the Executor is in.

Zylos Research's March 2026 minimal viable OCap implementation prescription is short:[^7] (1) define capability types at the API boundary, (2) issue capabilities from the Governor at task spawn time, (3) make tool handlers accept capabilities as parameters rather than checking agent identity, and (4) tie capability lifetimes to task lifetimes via RAII or explicit revocation. The full theoretical OCap model is not required to get most of the security benefits. The gap from "no OCap" to "minimal OCap" is enormous; the gap from "minimal OCap" to "full E semantics" is incremental.

## 4. CaMeL: Capabilities for Machine Learning

The most thoroughly evaluated architectural defense for agent runtimes is CaMeL — "Defeating Prompt Injections by Design," arXiv:2503.18813, March 24 2025, by Debenedetti, Shumailov, Fan, Hayes, Carlini, Fabian, Kern, Shi, and Tramèr (Google + Google DeepMind + ETH Zurich).[^8] CaMeL refines the Dual-LLM pattern with explicit capability tracking and information-flow control.[^42]

The architecture is a pipeline with three components.[^9] The Privileged LLM (P-LLM) sees the user query and tool catalogue but never sees tool outputs or content derived from them. Its job is to emit a plan — a short Python program — that composes tool calls. A restricted Python interpreter executes the plan. The Quarantined LLM (Q-LLM) accepts untrusted text plus a typed extraction schema and has no tools at all — it can only produce a value matching the schema. Untrusted data flows through the Q-LLM into wrapped values; it never reaches the P-LLM.

The interpreter maintains capability metadata on every value, propagating it through arithmetic, string operations, and control flow.[^12] Each value carries a `sources_set` recording its provenance and a `readers` set defining who is permitted to read it. Before each tool call, a policy engine inspects the capabilities of the arguments. The reference implementation's `base_security_policy` is default-deny: if any argument has a non-public reader and the tool is not in `NO_SIDE_EFFECT_TOOLS`, the call is denied.[^10] The `SecurityPolicyEngine.check_policy` method denies state-changing calls that depend on non-public values, then iterates pattern-matched policies in order; unmatched tools default to denial.[^10]

The provable property is unusual for AI security: 77% of AgentDojo tasks solved with provable security, against 84% utility for the undefended baseline.[^8][^11] Seven utility points are traded for an architectural guarantee.[^40] Replyant's April 2026 analysis frames the trade-off bluntly:[^40] 95% is a failing grade in application security because the remaining 5% is a repeatable exploit, and CaMeL changes the shape of the problem rather than pushing that number higher.[^40]

CaMeL ships a STRICT mode for tighter dependency tracking through control flow statements: operations within loops or conditionals become dependent on the condition variable itself.[^42] This offers stronger protection but potentially requires more user confirmations for sensitive-data operations. The trade-off is calibrated, not absolute. In Google DeepMind's evaluation, CaMeL successfully defended 67% of AgentDojo prompt injection attacks across various models, often reducing successful attacks to zero for models like GPT-4o, even without highly specific security policies.[^42]

The reference implementation is github.com/google-research/camel-prompt-injection.[^9] The codebase is explicitly marked as a research artifact, not a Google product, with no support commitment. Production deployments need to harden the interpreter, but the architectural pattern is now well-defined.

## 5. FIDES and Information-Flow Control

FIDES (arXiv:2505.23643, Microsoft Research, May 2025) implements bidirectional information-flow control with both confidentiality and integrity labels.[^41] Where CaMeL's capability metadata tracks "who can read this," FIDES adds "how trustworthy is this." The policy engine enforces two invariants deterministically: tool calls must be based on trusted-integrity data, and data may flow only to recipients permitted to read it.[^41]

In Microsoft's internal evaluation, FIDES stopped all prompt injection attacks during testing. Paired with reasoning models, FIDES-guarded agents completed 16% more tasks than baseline — suggesting the additional structure helps task completion as well as security.[^41] Both CaMeL and FIDES operate outside the LLM's probabilistic behavior. Their security guarantees are architectural, not behavioral.[^41]

The data-flow extension paper at arXiv:2601.09923v1 formalizes the relationship between CaMeL and FIDES.[^12] CaMeL compiles a task into a typed Python-like plan with capability metadata and an interpreter that enforces control flow and allows data-flow policies on tools. FIDES retains the dual-LLM separation but forgoes a static plan in favor of writing only a single line of the plan in each turn, saving tool-call outputs (or Q-LLM outputs) to redacted variables. Under the condition that the Q-LLM is not given control over parts of the control flow, both systems guarantee that environment information cannot derail task execution. The trade-off: data-dependent tasks where the required action sequence is itself specified in untrusted data violate the isolation guarantee — neither system can solve them without sacrificing the architectural property.

Adapting Dual-LLM to Computer-Using Agents (CUAs) is harder.[^12] In a CUA, the P-LLM cannot see the screen to adjust its plan dynamically. CaMeL and FIDES bridge this with conditional execution toolsets, but the OSWorld+CaMeL and OSWorld+FIDES baselines (pass@1 around 33%) reveal a real utility gap that production systems will need to close.

## 6. Guardians of the Agents: Three-Check Verification

Erik Meijer's "Guardians of the Agents" was published in Communications of the ACM, Vol. 69 No. 1, January 2026, pp. 46-52,[^14] extending the original ACM Queue article (vol 23 issue 4, July/August 2025, p 30).[^15][^16] The thesis: the root cause of prompt injection in agentic systems is the same as SQL injection — code and data aren't separated. The fix is the same too.[^18]

Meijer's design pattern: the AI agent is required to generate formal proofs demonstrating the safety of planned actions before being authorized to execute them. This parallels Java/.NET bytecode verification, where complexity lies in production but verification remains simple and efficient.[^14] Generate-then-execute becomes generate-verify-then-execute. Static verification ensures violations are impossible before execution begins, rather than detecting them after.

The reference implementation, github.com/metareflection/guardians, runs three independent checks before any tool fires:[^18] (1) taint analysis — does data flow from a source to a forbidden sink? (2) security automata — does the tool-call sequence reach an error state? (3) Z3 theorem proving — do preconditions, postconditions, and frame conditions hold? Eight verification categories cover allowlist (tool in allowlist), missing_spec (tool has registered spec), well_formedness (all symbolic refs in scope), taint, precondition, postcondition, frame, and automaton.[^18] The default `verify_first=True` ensures frame conditions and taint (which are static-only checks) run before any tool executes.

The runtime executor handles allowlist, preconditions, postconditions, automata, and budgets. The code path is roughly 1,900 LOC of Python.[^22] The high-level `GuardedAgent` API wraps a planner (the LiteLLM adapter is the reference) with a tool registry, policy automata, and Z3-encoded conditions. Workflows are abstract syntax trees with symbolic references — placeholders, not real data — so the planner can emit a structured plan that the static verifier reasons about before any concrete value flows.[^18]

Meijer's prior Queue article (January 2025) introduced the symbolic-execution precursor — the observation that you can structure agent execution so the LLM cannot confuse data and instructions.[^17] The 2026 CACM extension closes the loophole: even with that separation, a workflow can still be unsafe. Three-check verification ensures the workflow itself is provably safe before any tool runs.

## 7. Formal Verification: Nucleus, AILANG, Verus

What does it actually look like to ship a verified agent runtime in 2026? Three production systems give the answer.

**Nucleus** (github.com/coproduct-opensource/nucleus, v1.0.9 March 7 2026)[^20] is the most ambitious. The permission lattice has 297 SMT verification conditions checked by Z3 (Verus, SOSP 2025 Best Paper) plus 32 bounded model checking proofs via Kani/CaDiCaL.[^19] Both proof counts are ratcheted in CI — they can only go up, never down. Merging to main requires 16 status checks including security audit, cargo deny, clippy, fmt, fuzz, mutation testing, and per-crate test suites.[^20]

The core abstractions:[^19][^21]

- **Capability lattice** — 12-dimensional product lattice with 3-level capability states (Never/LowRisk/Always). Compare, combine, restrict permissions algebraically.
- **Exposure lattice** — 3-bool semilattice tracking `private_data`, `untrusted_content`, and `exfil_vector`. Exposure is monotone: it never decreases. When all three co-occur, the operation enters the **uninhabitable state** and requires explicit approval.
- **Nucleus operator ν** — the projection from the full permission lattice L onto the safe quotient L'. Idempotent (ν(ν(x)) = ν(x)), deflationary (ν(x) ≤ x), and meet-preserving (ν(x ∧ y) = ν(x) ∧ ν(y)). Frame-theoretic.[^21]
- **Monotonicity ratchet** — authority can only stay the same or tighten; budget can only decrease; exposure can only increase.

What's proven (the 297 Verus VCs + 32 Kani proofs):[^19][^20] lattice laws (idempotent, commutative, associative, absorptive for all 12 capability dimensions); uninhabitable-state operator (completeness detection, risk classification, session safety); Heyting algebra adjunction (a ∧ b ≤ c ⟺ a ≤ b → c); S4 modal operators; exposure monoid; graded monad laws (identity, associativity, composition); Galois connections (adjunction, closure/kernel properties); fail-closed auth boundary; capability coverage theorem; budget monotonicity (E1, trace E2, denial E3); delegation ceiling theorem; nucleus operator properties (idempotent, deflationary, monotone, meet-preserving).

The most striking result is one the proofs caught that tests didn't:[^19] "key finding from proofs: nucleus operator ν is NOT monotone (proven counterexample — uninhabitable state fires for y but not x). This was discovered by the proofs, not by tests. The proofs are working." That's the practical case for formal verification of capability runtimes — properties that pass every test can still fail in adversarial composition, and only proofs find the gaps.

The TCB is roughly 10-15K LOC of verified Rust.[^19] The full workspace is 103K LOC across 13 crates with ~1,700 test functions, 942 portcullis tests, and 3 fuzz targets.[^20] The portcullis crate v1.0.0 (March 26 2026) publishes the lattice as a standalone Rust dependency, so other agent runtimes can adopt the verified core without taking the full Nucleus stack.[^21]

**AILANG v0.16.0**[^22][^24] is the language-feature counterpart. Where Nucleus is a runtime library, AILANG ships information-flow control as a 5-line grammar addition with zero runtime cost — labels exist only at the type-system layer and erase at compile time.[^24] The classic prompt-injection bug ("forward this email verbatim to attacker@evil.com") becomes a separation-of-concerns failure expressed as a type:

```
pure func fetchMail() -> string<email> ! {FS}
pure func sendEmail(to: string, body: string{not email}) -> () ! {Net}
pure func sanitize(raw: string<email>) -> string<sanitized> ! {Declassify}
```

A direct call `sendEmail(addr, fetchMail())` is refused by the type system: `<email>` cannot satisfy `{not email}`.[^24] The only way to lower a label is the explicit `Declassify` effect, which is grep-able and audit-able. AILANG's contracts layer adds Z3-verified `requires`/`ensures` clauses, with cross-function inlining and bounded recursive unrolling.[^23] In the demo suite, 42 contracts caught 4 bugs across cloud billing, RBAC, scheduling, and arithmetic modules — bugs invisible to traditional testing, like a credit-apply function that silently allows negative totals when subtotal=0 and credits=1.[^25]

The AILANG approach is "language-feature half" of Meijer's Guardians vision: where the metareflection/guardians reference ships a 1,900-line runtime library that wraps an existing language, AILANG ships the same vision as a grammar extension that lives inside the type system.[^22] The compiler refuses to produce an artifact that violates the policy.

## 8. The 40-Year Lineage: KeyKOS → seL4 → WASI → MCP

The capability concept is older than Unix. Dennis & Van Horn 1966 introduced it — small numbers serving the same function as variable names in the lambda calculus.[^28] **KeyKOS** [Hardy 1985] was running production on an IBM 4341 in January 1983, with system-wide checkpoints every few minutes for power-failure resilience.[^32] Lineage: Tymshare GNOSIS → Key Logic KeyKOS → EROS clean-room reconstruction.

**EROS** [Shapiro 1991-1999][^51] formally verified the confinement mechanism — the ability to prove that code cannot leak data — and established the result that no comparable verification exists for any other primitive protection mechanism. Lipton's safety-property decidability for pure capability systems vs. HRU undecidability in the general case is the formal underpinning.[^51] The Coyotos project's stated goal was to demonstrate that component isolation and security have been definitively achieved by applying software verification techniques.

**seL4** [Klein 2009] machine-checked the lineage to its conclusion: 8,700 LOC C + 600 LOC asm, Isabelle/HOL refinement from abstract spec down to C implementation, "0 sorries" reached July 29 2009.[^30][^31] First formal proof of functional correctness of a complete general-purpose OS kernel. Subsequent breakthroughs proved integrity, confidentiality, authority confinement, and equivalence of the binary code to the C implementation.[^31] All authority in seL4 is mediated by capabilities — tokens identifying objects and conveying access rights.[^26] Influenced by EROS, with capability derivation tree implemented as a doubly-linked list.[^26][^27]

L4's broader history is in the SOSP 2013 retrospective by Heiser and Elphinstone:[^29] capabilities adopted from Dennis & Van Horn 1966; OKL4 2.1 (2008) first to ship; Fiasco renamed Fiasco.OC around object capabilities. seL4 evolved furthest from the original L4 design because formal verification required radical resource-management decisions: all spatial allocation explicit and directed by user-level code, including kernel memory.[^28] First protected-mode OS kernel in the literature with complete worst-case execution time analysis.[^28]

**Capsicum** (FreeBSD) is the practical arm of the lineage. Sub-fd capabilities, `cap_enter`, "the most advanced practical capability system" per the WASI design discussion.[^34] **WASI** ports Capsicum's ideas into WebAssembly: capability-oriented filesystem with `path_open` requiring a base directory handle, no global namespace, sandboxing modeled after CloudABI + Capsicum, mapping to `RESOLVE_BENEATH` on Linux and `O_RESOLVE_BENEATH` on FreeBSD.[^33] WASI's design principles document is explicit: "WASI is built using capability-based security principles. Access to external resources is always represented by handles, which are special values that are unforgeable. WASI is also aiming to have no ambient authorities."[^40_deno]

**Deno** ports the model to JavaScript runtime with command-line flags: `--allow-net`, `--allow-read`, `--allow-write`, `--allow-run`, `--allow-ffi`. Default-deny network. The `--allow-run` and `--allow-ffi` paths are documented privilege-escalation caveats — a reminder that capabilities only work when there's no escape hatch.[^47]

**Spritely Goblins** (May 2025)[^5][^6] is the most recent practical OCap system: distributed transactional ocap programming combining Scheme W7 + E with novel transactional design. CapTP / OCapN protocol abstracts over Tor onion services, IBC, I2P, libp2p. Object-capability security upheld by construction; remote misbehaving peer is equivalent to a misbehaving object with the surface area of the entire peer.[^6] Same ideas. Forty years of refinement.

## 9. MCP Authorization and the Practical Agent Stack

The Model Context Protocol's authorization spec[^35] is OAuth 2.1 with three RFCs of additional requirements: RFC 9728 Protected Resource Metadata (MUST), RFC 8707 Resource Indicators (MUST), and `WWW-Authenticate` scope hints with `insufficient_scope` step-up authorization flow. Clients SHOULD follow the principle of least privilege by requesting only scopes necessary for intended operations.[^35]

The three-layer permission gate that production hosts implement:[^49] server advertises tools/resources → host filters per policy → user (or policy on user's behalf) approves invocation. The Safeguard.sh post documents a real-world anti-pattern: a Jira MCP server where reading a resource URI with a specific query parameter caused the server to run a synchronous search across every project the user had access to.[^49] Read access is not the same as free access — resource permissions need the same care as tool permissions. The recommendation: split servers along scope boundaries, even when it means running more processes. An MCP server for Google Workspace asking for `drive.readonly`, `gmail.modify`, and `calendar` all at once has a much bigger blast radius than three separate servers with one scope each.[^49]

**Microsoft Agent Governance Toolkit (AGT)** entered Public Preview April 22 2026 as an open-source runtime governance layer between MCP client and tool servers.[^39] Per-call policy enforcement using declarative rules in YAML, OPA/Rego, or Cedar; evaluation in sub-millisecond per call for typical rule sets. Tool-definition scanning catches hidden instructions, typosquatting, and adversarial patterns before the agent sees them. Response inspection validates tool-server outputs against content policies before they reach the agent. A four-tier privilege ring model enforces least-privilege; kill switches provide immediate termination for non-compliant agents. AGT covers 8 of the 10 OWASP MCP risks fully (MCP02 Privilege Escalation, MCP03 Tool Poisoning, MCP04 Supply Chain, MCP05 Command Injection, MCP07 Insufficient AuthZ, MCP08 Audit, MCP10 Context Injection) and 3 partially (MCP01 Token Mismanagement, MCP06 Intent Flow, MCP09 Shadow MCP).[^39]

The capability-token pattern in Appropri8's January 2026 post operationalizes the OCap principle for MCP:[^48] every tool call goes through a policy gate that checks for a valid capability token (signed credential, bound to run/user/tool/resource, with explicit `exp`). Decisions are allow / deny / require_approval / downgrade — the downgrade path swaps `repo.write` for `repo.read` automatically when a medium-risk run can satisfy the user's intent without write authority. Tool registry includes scope (read/write), `resource_constraint` (path_prefix, project_id), allowed prefixes, and `requires_approval` flag.[^48]

**Zero Standing Permissions** is the principle stitching it together.[^50] No long-lived API keys, no permanent OAuth tokens, no ambient authority. Access is derived just-in-time, scoped per-request, expires automatically when context changes. Permit.io's reference architecture pairs OAuth 2.1 for authentication and delegation, agent.security as the agent-native control plane, and a fine-grained authorization layer enforcing RBAC, ABAC, or ReBAC on every tool call.[^50] Raw credentials never reach the agent. The agent requests; the broker mints a time-bounded token scoped to the requested resource and action; enforcement happens at a policy decision point outside the model.

## 10. Governing Dynamic Capabilities and Open Problems

The most rigorous formalization of agent governance to date is "Governing Dynamic Capabilities," arXiv:2603.14332v2 (March 15 2026).[^13] The paper defines three Agent Governance Requirements: G1 capability integrity, G2 behavioral verifiability, G3 interaction auditability — what a governed agent ecosystem must enforce, independent of how.

Two structural results carry the framework. The **Chain Verifiability Theorem**: one unverifiable interior agent breaks end-to-end verification for all downstream nodes. Verification is a chain — every link must hold. The **Bounded Divergence Theorem**: replay-based verification yields a probabilistic safety certificate ε ≤ 1 − α^(1/n), where α is per-agent reliability and n is chain length. The theorem says replay can only get you so far when models are non-deterministic.[^13]

The paper validates with two crypto-agnostic instantiations. Basic: Ed25519 + SHA-256, 97 microseconds verify. Enhanced: BBS+ selective disclosure + Groth16 designated-verifier SNARK, 13.8 milliseconds.[^13] Both satisfy nine security properties. A 9-model 7-provider reproducibility study reveals 5.8× variance in inference determinism — connecting model characteristics to governance architecture choice.[^13] End-to-end evaluation over 5-20 agent pipelines: <0.02% overhead, all attack scenarios detected, zero false positives.

Three open problems remain unsolved as of mid-2026. **Workflow-level policy** — sequences of individually-allowed calls forming malicious chains — is on the AGT roadmap but not yet shipping.[^39] **Intent declaration** — the agent declares its plan before doing anything, the policy engine validates the plan up front — is the natural CaMeL-style extension.[^39] **Distributed capability confinement** under network unreliability requires E's Dead-Man Switch pattern[^2] and remains hard in production. Spritely's approach is to treat unreliability as fail-stop rather than fail-safe, with explicit revocation primitives, but the protocol surface is still in flux.

## 11. Six Predictions for 2026-2028

**Prediction 1.** MCP servers ship default-deny manifests by Q4 2026. OAuth 2.1 + RFC 9728 Protected Resource Metadata + RFC 8707 Resource Indicators become mandatory for enterprise MCP deployments; servers without compliant metadata get rejected by host policy gates. Microsoft AGT and equivalent governance tools become table stakes for any MCP deployment touching production data.

**Prediction 2.** Capability tokens replace ambient API keys in production agent runtimes by mid-2027. Anthropic, OpenAI, and Google enterprise tiers ship per-tool-per-resource scoped tokens with TTL. Permit.io and agent.security become the policy-layer reference implementations. The "static API key in environment variable" pattern moves from acceptable to audit-failing within 18 months.

**Prediction 3.** At least one major LLM provider ships a CaMeL-style dual-LLM mode by mid-2026 as a safety tier. Pricing premium of 1.5-3× for "provable mode" trading 5-10 utility points for architectural guarantees. Regulated verticals — healthcare, finance, defense — adopt it as compliance baseline before competitive consumer markets.

**Prediction 4.** Verified agent runtimes (Nucleus-style, AILANG-style) become the high-assurance default in regulated verticals by 2027. NIST AI RMF and EU AI Act high-risk classifications start requiring formal evidence of capability-confinement properties. Verus, Lean 4, Kani, and hax adoption curves spike. The portcullis crate or its successor becomes a standard Rust dependency for agent platforms targeting regulated workloads.

**Prediction 5.** Uninhabitable-state detection becomes a compliance checkbox in SOC 2 / ISO 42001 audits by 2027. Static-scan tools — portcullis-audit-style — get shipped by Big 4 auditors. The (private_data ∧ untrusted_content ∧ exfil_vector) triple becomes a regulated configuration that platforms must prove they prevent without explicit human approval.

**Prediction 6.** The 40-year curriculum gap closes. Every AI safety conference 2026-2028 includes an OCap track. Mark Miller's "From Objects to Capabilities," Hardy's KeyKOS paper, Shapiro's EROS confinement work, and Klein's seL4 verification become required reading for agent-runtime engineers. KeyKOS / EROS / seL4 papers cited in agent-security RFCs and OWASP Top 10 successor documents. The "we invented this in 1985" t-shirt becomes a trade-show staple.

## Glossary

**Object-Capability (OCap).** Security model where authority to act on resources is conveyed exclusively by unforgeable references; identity-based authorization is rejected.[^1]

**Capability.** A typed, unforgeable handle that encapsulates exactly one permission on exactly one resource.[^7]

**Ambient Authority.** Permission that comes from "who you are" rather than from possession of a specific capability — global state, environment variables, shared registries.[^1]

**Confused Deputy.** Attack pattern where an authorized principal is tricked by an unauthorized one into using its authority to perform an action the deputy didn't intend. Prompt injection is the LLM-era confused deputy.[^7]

**Attenuation.** Wrapping a capability in another that grants strictly less authority (narrower scope, time-bounded, action-restricted), then handing the attenuated version downstream.[^7]

**Revocable Forwarder.** Proxy object that mediates calls to an underlying capability; destroying the forwarder severs all downstream access without affecting other holders.[^7]

**Information Flow Control (IFC).** Tracking confidentiality and integrity labels through every operation; tool calls gated on label predicates.[^41]

**Capability Lattice.** Algebraic structure (idempotent + commutative + associative + absorptive + monotonic) used to compose, restrict, and reason about agent permissions.[^19]

**Uninhabitable State.** The (private_data ∧ untrusted_content ∧ exfil_vector) triple. When all three are present at autonomous level, prompt injection enables exfiltration without human oversight.[^19]

**Nucleus Operator (ν).** Frame-theoretic projection from full permission lattice L onto safe quotient L'; idempotent + deflationary + meet-preserving.[^21]

**Three-Check Pipeline.** Meijer's (taint analysis ∧ security automata ∧ Z3 theorem proving) verification before any tool fires.[^14][^18]

**Governor / Executor.** Multi-agent runtime pattern: Governor mints capabilities and spawns Executors; Executors carry capability proofs; tool handlers verify possession.[^7]

**Zero Standing Permissions.** Architectural principle: no long-lived API keys, no permanent OAuth, no ambient authority — every access derived just-in-time, expiring with context.[^50]

**Step-Up Authorization.** OAuth 2.1 + RFC 6750 flow where a 403 insufficient_scope challenge specifies the required scopes; client re-authorizes with the union of previously-granted and newly-required scopes.[^35]

## Related Research

This paper closes the "how do I get the architectural defense without using a research artifact" thread from `prompt-injection-defense-2026`. Threads it opens for follow-on research:

- **5-agent-trust-boundary-protocols** — agent-to-agent capability handoff over CapTP / OCapN; how the Spritely Goblins distributed transactional model carries into multi-vendor agent meshes.
- **formal-verification-tooling-for-saas** — Verus / Lean 4 / Kani / hax adoption curve in production startups; the gap between research artifacts and shippable proof gates.
- **regulated-vertical-agent-compliance-2027** — NIST AI RMF + EU AI Act high-risk evidence requirements and how capability-confinement proofs satisfy them.
- **spritely-goblins-production-deployments** — distributed ocap in the open social web; CapTP over Tor onion services as a mesh-agent transport.

---

## References

[^1]: Mark Miller. "From Objects to Capabilities." erights.org/elib/capability/ode/ode-capabilities.html. Canonical OCap derivation; KeyKOS [Hardy85] and EROS [Shapiro99] cited as pure capability OS; rights amplification (sealer/unsealer pairs), sibling communication, all-authority-via-references rule. https://erights.org/elib/capability/ode/ode-capabilities.html

[^2]: Mark Miller. "Overview: Capability Computation." erights.org/elib/capability/overview.html. Granovetter Diagram; "only connectivity begets connectivity"; rights amplification primitive; distributed capabilities + Pluribus protocol; Dead-Man Switch for distributed revocation. https://erights.org/elib/capability/overview.html

[^3]: Mark Miller. "ELib: Inter-Object Semantics." erights.org/elib/. E semantics: VatTP, CapTP, event-loop concurrency, taming, fail-stop references. https://www.erights.org/elib/

[^4]: Mark Miller. Agoric author page. papers.agoric.com/authors/mark-s-miller/. Chief Scientist Agoric; designer of E and Dr. SES; WebAssembly group representative; senior fellow Foresight Institute. https://papers.agoric.com/authors/mark-s-miller/

[^5]: Christine Lemmer-Webber, Randy Farmer, Juliana Sims. "The Heart of Spritely: Distributed Objects and Capability Security." files.spritely.institute/papers/spritely-core.pdf, May 21 2025. Goblins distributed transactional ocap programming environment; W7 Scheme + E lineage; transactional design contribution. https://files.spritely.institute/papers/spritely-core.pdf

[^6]: Spritely Goblins documentation. "CapTP: The Capability Transport Protocol." files.spritely.institute/docs/guile-goblins/0.17.0/CapTP-The-Capability-Transport-Protocol.html. OCapN abstract netlayer (Tor / IBC / I2P / libp2p); distributed garbage collection; "remote misbehaving peer ≡ misbehaving object.". https://files.spritely.institute/docs/guile-goblins/0.17.0/CapTP-The-Capability-Transport-Protocol.html

[^7]: Zylos Research. "Capability-Based Security for AI Agent Tool Invocation." zylos.ai/research/2026-03-12-capability-based-security-ai-agent-tool-invocation, March 12 2026. Governor → Executor capability handoff; revocable forwarder pattern; FileWriteCapability/HttpGetCapability examples; OWASP LLM08 mapping; minimal viable OCap implementation prescription. https://zylos.ai/research/2026-03-12-capability-based-security-ai-agent-tool-invocation

[^8]: Edoardo Debenedetti, Ilia Shumailov, Tianqi Fan, Jamie Hayes, Nicholas Carlini, Daniel Fabian, Christoph Kern, Chongyang Shi, Florian Tramèr. "Defeating Prompt Injections by Design." arXiv:2503.18813, March 24 2025. Google + Google DeepMind + ETH Zurich. CaMeL: 77% AgentDojo with provable security vs 84% undefended; capabilities as IFC/CFI metadata. https://arxiv.org/abs/2503.18813

[^9]: Google Research. "google-research/camel-prompt-injection." github.com/google-research/camel-prompt-injection. CaMeL reference implementation; P-LLM / interpreter / Q-LLM architecture; AgentDojo evaluation harness. https://github.com/google-research/camel-prompt-injection

[^10]: Google Research. "src/camel/security_policy.py." github.com/google-research/camel-prompt-injection/blob/main/src/camel/security_policy.py. Default-deny base policy; SecurityPolicyEngine.check_policy default-denies state-changing tools depending on non-public values; NO_SIDE_EFFECT_TOOLS allowlist for query_ai_assistant. https://github.com/google-research/camel-prompt-injection/blob/main/src/camel/security_policy.py

[^11]: Edoardo Debenedetti et al. "Defeating Prompt Injections by Design (ADS record)." ui.adsabs.harvard.edu/abs/arXiv:2503.18813. Canonical academic indexing for the CaMeL paper. https://ui.adsabs.harvard.edu/abs/arXiv:2503.18813

[^12]: Anonymous. "Data-Flow Prompt Injection in CUAs (preprint)." arxiv.org/pdf/2601.09923v1. Taxonomy paper formalizing CaMeL and FIDES; data-dependent task limits; Observe-Verify-Act methodology for OSWorld+CaMeL / OSWorld+FIDES adaptation. https://arxiv.org/pdf/2601.09923v1

[^13]: Anonymous. "Governing Dynamic Capabilities: Cryptographic Binding and Reproducibility Verification for AI Agent Tool Use." arXiv:2603.14332v2, March 15 2026. Three Agent Governance Requirements G1/G2/G3; Chain Verifiability Theorem; Bounded Divergence Theorem; Ed25519+SHA-256 (97μs) and BBS+/Groth16 DV-SNARK (13.8ms) instantiations; <0.02% overhead 5-20 agent pipelines. https://arxiv.org/abs/2603.14332v2

[^14]: Erik Meijer. "Guardians of the Agents." Communications of the ACM, Vol. 69 No. 1, January 2026, pp. 46-52. cacm.acm.org/practice/guardians-of-the-agents/. Generate-then-execute → generate-verify-then-execute; analogy to Java/.NET bytecode verification. https://cacm.acm.org/practice/guardians-of-the-agents/

[^15]: Erik Meijer. "Guardians of the Agents: Formal Verification of AI Workflows." ACM Queue, vol 23 issue 4, July/August 2025, p 30. queue.acm.org/detail.cfm?id=3762990. Original Queue version preceding the CACM extension. https://queue.acm.org/detail.cfm?id=3762990

[^16]: researchr.org/alias/erik-meijer-0001. Bibliography record confirming CACM 69(1):46-52 January 2026 + queue 23(4):30 July/August 2025. https://researchr.org/alias/erik-meijer-0001

[^17]: Erik Meijer. "From Function Frustrations to Framework Flexibility." ACM Queue, January 2025. queue.acm.org/detail.cfm?id=3722544. Symbolic-execution precursor to the Guardians work; mathematical-proof-based safety paradigm introduction. https://queue.acm.org/detail.cfm?id=3722544

[^18]: metareflection. "metareflection/guardians: Static verification for AI agent workflows." github.com/metareflection/guardians, April 9 2026. ~1,900 LOC Python reference implementation of the CACM January 2026 paper; three-check pipeline (taint + automata + Z3); verify_first=True default. https://github.com/metareflection/guardians

[^19]: coproduct-opensource. "docs/north-star.md (Nucleus)." github.com/coproduct-opensource/nucleus/blob/main/docs/north-star.md. 297 Verus proofs in CI as of March 2026; 12-dimensional capability lattice × 3-level Never/LowRisk/Always; exposure 3-bool semilattice; uninhabitable state operator; 40-year-lineage attribution to E / KeyKOS / seL4 / Capsicum. https://github.com/coproduct-opensource/nucleus/blob/main/docs/north-star.md

[^20]: coproduct-opensource. "Nucleus: Enforced permissions for AI agents." github.com/coproduct-opensource/nucleus, v1.0.9 March 7 2026. Portcullis 58K LOC + 942 tests + 297 Verus VCs + 32 Kani BMC proofs; 1,700 test functions across 103K LOC Rust workspace; Firecracker microVM enforcement; iptables default-deny egress. https://github.com/coproduct-opensource/nucleus

[^21]: brandon-coproduct. "portcullis v1.0.0." crates.io/crates/portcullis, March 26 2026. Quotient lattice for AI agent permissions; nucleus operator ν as frame-theoretic construct (idempotent + deflationary + meet-preserving); CapabilityLattice meet=min restrictive; UninhabitableQuotient::new() compile-time projection. https://crates.io/crates/portcullis

[^22]: AILANG Documentation. "Information-Flow Control (IFC) Labels." ailang.sunholo.com/docs/guides/ifc-labels. AILANG v0.16.0 IFC labels; design follows Erik Meijer's Guardians; 5-line grammar addition vs 1,900 LOC library; T<email> / T<sanitized> / T{not LABEL} sink refinements. https://ailang.sunholo.com/docs/guides/ifc-labels

[^23]: AILANG Documentation. "Contracts & Verification." ailang.sunholo.com/docs/guides/contracts. Z3-verified requires/ensures; SMT-encodable fragment; cross-function inlining via define-fun; bounded recursive unrolling Dafny-style depth 1-10. https://ailang.sunholo.com/docs/guides/contracts

[^24]: AILANG Documentation. "Why AILANG." ailang.sunholo.com/docs/why-ailang. IFC as language feature with zero runtime cost; Hindley-Milner inference + algebraic effects + capability budgets; declassify effect grep-able and audit-able. https://ailang.sunholo.com/docs/why-ailang

[^25]: sunholo-data. "ailang-demos." github.com/sunholo-data/ailang-demos, January 27 2026. Six working demos covering AI integration, data pipelines, capability budgets, BigQuery analytics, design-by-contract verification, REST API; 42 contracts caught 4 bugs across 4 modules. https://github.com/sunholo-data/ailang-demos

[^26]: Gerwin Klein, Kevin Elphinstone, Gernot Heiser, et al. "seL4: Formal Verification of an Operating-System Kernel." Communications of the ACM, August 31 2023. cacm.acm.org/research/sel4-formal-verification-of-an-operating-system-kernel/. 8,700 LOC C + 600 LOC asm; Isabelle/HOL refinement; capability-mediated authority; capability derivation tree as doubly-linked list. https://cacm.acm.org/research/sel4-formal-verification-of-an-operating-system-kernel/

[^27]: Trustworthy Systems. "seL4 Technical Project Description." trustworthy.systems/projects/seL4/tech. Capability model inspired by KeyKOS, EROS, Cambridge CAP; literate Haskell exec spec → C; ARM simulator validation; explicit-authority API. https://trustworthy.systems/projects/seL4/tech

[^28]: Gernot Heiser, Kevin Elphinstone. "L4 Microkernels: The Lessons from 20 Years of Research and Deployment." trustworthy.systems/publications/nicta_full_text/8988.pdf, April 8 2016. Capabilities adopted from Dennis & Van Horn 1966; OKL4 2.1 (2008) first L4 to ship capabilities; Fiasco→Fiasco.OC rename around object capabilities; first OS kernel with full functional correctness proof + complete proof chain to executable binary. https://www.trustworthy.systems/publications/nicta_full_text/8988.pdf

[^29]: Kevin Elphinstone, Gernot Heiser. "From L3 to seL4: What Have We Learnt in 20 Years of L4 Microkernels?" SOSP 2013. sigops.org/s/conferences/sosp/2013/papers/p133-elphinstone.pdf. KeyKOS [Hardy85] + EROS [Shapiro99] influence; "evolved furthest from the original design"; non-preemptible kernel for verification tractability. https://sigops.org/s/conferences/sosp/2013/papers/p133-elphinstone.pdf

[^30]: Gerwin Klein, Kevin Elphinstone, Gernot Heiser, June Andronick, David Cock, Philip Derrin, Dhammika Elkaduwe, Kai Engelhardt, Rafal Kolanski, Michael Norrish, Thomas Sewell, Harvey Tuch, Simon Winwood. "seL4: Formal Verification of an OS Kernel." SOSP 2009. cseweb.ucsd.edu/~dstefan/cse227-spring20/papers/sel4.pdf. First formal proof of functional correctness of a complete general-purpose OS kernel; 8,700 LOC C + 600 LOC asm; descended from PSOS / KSOS / SAT / LOCK / EROS / MASK / FLASK lineage. https://cseweb.ucsd.edu/~dstefan/cse227-spring20/papers/sel4.pdf

[^31]: seL4 Foundation. "History." sel4.systems/About/history.html. Liedtke L4 1993 (10-20× IPC speedup); L4.verified launched 2004 Heiser/Elphinstone/Klein; "0 sorries" July 29 2009; subsequent proofs of integrity, confidentiality, authority confinement, binary-vs-C-spec equivalence. https://sel4.systems/About/history.html

[^32]: Jonathan Shapiro. "KeyKOS Architectural Description." pdos.csail.mit.edu/6.828/2008/readings/keykos-osr.pdf, October 29 2008. KeyKOS capability-based microkernel; Tymshare GNOSIS lineage; running production on IBM 4341 since January 1983; system-wide checkpoints every few minutes; primitive objects defined in microkernel. https://pdos.csail.mit.edu/6.828/2008/readings/keykos-osr.pdf

[^33]: WebAssembly. "wasi-filesystem." github.com/WebAssembly/wasi-filesystem; "path-resolution.md." github.com/WebAssembly/wasi-filesystem/blob/main/path-resolution.md. Capability-oriented filesystem; path_open requires base directory handle; sandboxing modeled after CloudABI + Capsicum; preview1 per-fd "rights" flags removed for portability; RESOLVE_BENEATH (Linux openat2) / O_RESOLVE_BENEATH (FreeBSD open). https://github.com/WebAssembly/wasi-filesystem

[^34]: WebAssembly. "Sharp edges of the current capability system (Issue #16)." github.com/WebAssembly/WASI/issues/16. Capsicum reference: "the most advanced practical capability system"; sub-fd capabilities; Anderson/Godfrey/Watson 2017 paper; WASI capability copy/duplication design discussion. https://github.com/WebAssembly/WASI/issues/16

[^35]: Model Context Protocol. "Authorization Specification." modelcontextprotocol.io/specification/draft/basic/authorization.md. OAuth 2.1 resource server; RFC 9728 Protected Resource Metadata MUST; RFC 8707 Resource Indicators MUST; WWW-Authenticate scope hints; insufficient_scope step-up flow; least-privilege scope selection. https://modelcontextprotocol.io/specification/draft/basic/authorization.md

[^36]: OWASP. "LLM06_ExcessiveAgency.md." github.com/OWASP/www-project-top-10-for-large-language-model-applications/blob/main/2_0_vulns/LLM06_ExcessiveAgency.md. LLM06:2025 Excessive Agency formal spec; root causes (excessive functionality + permissions + autonomy); 10-item mitigation list. https://github.com/OWASP/www-project-top-10-for-large-language-model-applications/blob/main/2_0_vulns/LLM06_ExcessiveAgency.md

[^37]: OWASP. "Top 10 for Large Language Model Applications." owasp.org/www-project-top-10-for-large-language-model-applications/. LLM06 + LLM08 canonical entries; "granting LLMs unchecked autonomy can lead to unintended consequences.". https://owasp.org/www-project-top-10-for-large-language-model-applications/

[^38]: AWS. "Mapping to OWASP top 10 for LLM applications." docs.aws.amazon.com/prescriptive-guidance/latest/agentic-ai-security/owasp-top-ten.html. LLM06 mapping to AWS controls (deterministic execution unless AI needed, agent scoping, Zero Trust, JIT auth, observability, emergency shutdown). https://docs.aws.amazon.com/prescriptive-guidance/latest/agentic-ai-security/owasp-top-ten.html

[^39]: Jack Batzner. "Securing MCP: A Control Plane for Agent Tool Execution." Microsoft for Developers, April 22 2026. developer.microsoft.com/blog/securing-mcp-a-control-plane-for-agent-tool-execution. Microsoft Agent Governance Toolkit (AGT) Public Preview; YAML/OPA-Rego/Cedar policies; sub-millisecond per-call evaluation; four-tier privilege ring; OWASP MCP01-10 coverage matrix. https://developer.microsoft.com/blog/securing-mcp-a-control-plane-for-agent-tool-execution

[^40]: Replyant. "CaMeL: The Dual-LLM Pattern That Makes Prompt Injection Provable." replyant.com/lab/camel-dual-llm-defense, April 23 2026. "95% is a failing grade"; CaMeL trades 7 utility points for provable security (84%→77% AgentDojo); StruQ/SecAlign vs spotlighting vs static-tool-filters comparison; FIDES = Microsoft Research arXiv:2505.23643 bidirectional IFC. https://replyant.com/lab/camel-dual-llm-defense/

[^41]: Zylos Research. "Indirect Prompt Injection: Attacks, Defenses, and the 2026 State of the Art." zylos.ai/research/2026-04-12-indirect-prompt-injection-defenses-agents-untrusted-content, April 12 2026. Defense-in-depth posture; FIDES stopped all PI attacks during testing + 16% more tasks than baseline; CaMeL/FIDES/MELON architectural defenses; "qualitative improvement over try-harder defenses.". https://zylos.ai/research/2026-04-12-indirect-prompt-injection-defenses-agents-untrusted-content

[^42]: Markus Kasanmascheff. "How Google DeepMind's CaMeL Architecture Aims to Block LLM Prompt Injections." WinBuzzer, April 27 2025. winbuzzer.com/2025/04/27/how-google-deepminds-camel-architecture-aims-to-block-llm-prompt-injections-xcxwbn/. Privileged + Quarantined LLM split; capabilities as fine-grained unforgeable tags; STRICT mode trade-off; 67% of AgentDojo PI attacks defended; reduced to zero on GPT-4o. https://winbuzzer.com/2025/04/27/how-google-deepminds-camel-architecture-aims-to-block-llm-prompt-injections-xcxwbn/

[^43]: Harbinger Security Consulting. "The OWASP Top 10 for LLM Applications, Annotated (2026 Edition)." Wraith, April 19 2026. wraith.sh/learn/owasp-top-10-llm-annotated. LLM02 split from LLM06; LLM06 Excessive Agency = "blast radius" pattern; "every tool should have the narrowest possible scope... identity and authorisation outside the model.". https://wraith.sh/learn/owasp-top-10-llm-annotated

[^44]: SecurityElites. "OWASP Top 10 LLM Vulnerabilities 2026 — Red Team." securityelites.com/owasp-top-10-llm-vulnerabilities-2026/, April 30 2026. Samsung ChatGPT case (LLM06); Microsoft Copilot Slack exfil (LLM01); LLM01+LLM06+LLM08 ~80% of findings; LLM08 RCE-path bounty $10K-$50K+. https://securityelites.com/owasp-top-10-llm-vulnerabilities-2026/

[^45]: Alex Ewerlöf. "OWASP Top 10 Agents & AI Vulnerabilities (2026 Cheat Sheet)." blog.alexewerlof.com/p/owasp-top-10-ai-llm-agents, March 10 2026. LLM06 + ASI02 + ASI03 mapping; JIT ephemeral tokens; HITL for state-mutating ops; "DynamoDB:PutItem when only need read" anti-pattern. https://blog.alexewerlof.com/p/owasp-top-10-ai-llm-agents

[^46]: Yuki Nakata. "WASI's Capability-based Security Model." chikuwa.it/blog/2023/capability/. Capability vs Linux Capabilities (privilege division ≠ capability); WASI achieves cap-based on ACL OS via libpreopen + transparent file-descriptor association; libpreopen bottom-half layer. http://www.chikuwa.it/blog/2023/capability/

[^47]: Reflect.run. "Deno's Networking and File Permissions Model." reflect.run/articles/deno-networking-and-file-permissions-model/, August 2 2022. --allow-net / --allow-read / --allow-write / --allow-run / --allow-ffi; default-deny network; FFI privilege-escalation caveat; allow-run subprocess escapes sandbox. https://reflect.run/articles/deno-networking-and-file-permissions-model/

[^48]: Ali Elborey. "Least-Privilege MCP Agents: Capability Tokens, Tool Scopes, and a Policy Gate That Stops Bad Tool Calls." appropri8.com/blog/2026/01/21/least-privilege-mcp-agents/, January 21 2026. Tool registry with scope (read|write) + resource_constraint (path_prefix|project_id); capability tokens (signed credential, per-run/user/tool/resource, with exp); policy-gate decisions allow|deny|require_approval|downgrade. https://appropri8.com/blog/2026/01/21/least-privilege-mcp-agents/

[^49]: Safeguard.sh. "MCP Permissions Model Explained." safeguard.sh/resources/blog/model-context-protocol-permissions-model, April 12 2026. Three-layer permission gate (server advertises → host selects → user approves); Jira MCP server resource-URI side-effect anti-pattern; "split servers along scope boundaries" recommendation. https://safeguard.sh/resources/blog/model-context-protocol-permissions-model

[^50]: Permit.io. "Authorization Strategies for Model Context Protocol (MCP)." permit.io/blog/authorization-strategies-for-model-context-protocol-mcp, December 29 2025. RBAC/ABAC/ReBAC for MCP; Zero Standing Permissions principle ("no long-lived API keys, no permanent OAuth, no ambient authority"); agent.security as agent-native control plane. https://www.permit.io/blog/authorization-strategies-for-model-context-protocol-mcp

[^51]: EROS (microkernel) Wikipedia entry. en.wikipedia.org/wiki/EROS_(microkernel). Pure capability architectures supported by formal mathematical security models; Lipton safety-property decidability; HRU undecidability for general systems; KeyKOS → EROS 1991 → CapROS lineage; Coyotos confinement-mechanism formal verification; Shapiro/Weber 1999 IEEE S&P paper. https://en.wikipedia.org/wiki/EROS_(microkernel)

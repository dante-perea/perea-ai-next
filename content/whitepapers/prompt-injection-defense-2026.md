---
title: "Indirect Prompt Injection Defense for Production Agents"
subtitle: "Beyond OWASP LLM01 — Rule of Two, CaMeL, FIDES, and the Architectural Pivot of 2025"
publication: "perea.ai Research"
authors: ["Dante Perea"]
version: "1.0"
status: "Public draft"
date: "2026-05-07T10:00"
audience: "Heads of security, CISOs, platform-engineering leads, and applied-AI engineers shipping production agents with tool, memory, or filesystem access"
length: "~9,000 words"
license: "CC BY 4.0"
description: "The 2025 prompt-injection landscape forced a quiet architectural pivot in production AI. Detection-only defenses bypass at >90% under adaptive attack; the new defenses — Meta's Rule of Two, Google DeepMind's CaMeL, Microsoft Research's FIDES — work because they constrain the agent rather than detect the attack. This paper documents the EchoLeak chain, the MCPTox 72.8% benchmark, and the GitHub MCP exploit, then maps them onto the seven-layer defense stack production teams are deploying in 2026."
---

## Foreword

In 2024, prompt injection was a research curiosity — interesting at workshops, mostly absent from CVE feeds, and almost entirely absent from board-level security conversations. By the end of 2025 it had become a CVE class with named, peer-reviewed exploits, attack-success benchmarks against frontier models, and a production-grade defender market with eight-figure ARR. The discipline reorganized itself in twelve months.

This paper exists because every other paper in the perea.ai canon assumes that you can ship a production agent with tools, memory, and network access. The B2A Imperative argues that the buyer of the next decade is autonomous; the MCP Server Playbook explains how to expose your product to that buyer; the Agent Payment Stack closes the loop on commerce; the Agent Observability Stack tells you what your agent is doing in production. None of those papers can be acted on safely if the model can be hijacked by a hidden instruction in a vendor's tool description, a misformatted email, or a public GitHub issue. This paper is the security floor underneath the rest of the canon.

The argument here is straightforward and somewhat boring. Detection-only defenses lost in 2025 — adaptive attacks now bypass every published detector at over 90% under sufficient compute. Architectural defenses won — Meta's Rule of Two, Google DeepMind's CaMeL, and Microsoft Research's FIDES all constrain the agent in ways the model cannot override. Production teams are converging on a seven-layer stack and a CI red-team gate. The work for the next twelve months is not breakthrough research; it is rolling out 2025's research findings to every agent already in production. That is what the rest of this paper is for.

## Executive Summary

1. **The 2025 attack disclosures are real and reproducible.** EchoLeak (CVE-2025-32711) is the first peer-reviewed zero-click prompt-injection exploit in a production LLM system, documented in the AAAI Symposium and the Aim Labs disclosure of June 2025. MCPTox (arXiv 2508.14925, AAAI 2026) measured a 72.8 percent attack success rate against o1-mini across 45 live MCP servers and 353 authentic tools. Invariant Labs's GitHub MCP exploit, disclosed May 26 2025, exfiltrated private-repository data with no tool compromise — the architecture itself was the vulnerability. These are not toy demonstrations. They are CVEs and peer-reviewed publications with reproductions in the wild.

2. **Detection-only defenses cannot keep up with adaptive attackers.** OWASP's own prevention cheat sheet acknowledges power-law scaling in best-of-N attacks: 89 percent attack success on GPT-4o and 78 percent on Claude 3.5 Sonnet given enough attempts. ICLR 2025's Agent Security Bench evaluated 11 defenses across 13 LLM backbones and reported 84.30 percent attack success for the Mixed Attack class with refusal at just 3.22 percent. The 2026 update from the security research community is harsher still: a paper colloquially titled "The Attacker Moves Second" demonstrates that adaptive attacks bypass every one of 12 published defenses at over 90 percent attack success.

3. **The architectural pivot is the headline of 2025.** Three defenses changed the conversation. Meta's Rule of Two (October 2025) restricts an agent to no more than two of {processes-untrusted-inputs, accesses-sensitive-systems, changes-external-state} in a single session. Google DeepMind's CaMeL (March 2025) split the agent into a privileged LLM that emits a restricted Python program from the trusted query and a quarantined LLM with no tool access — solving 67 percent of AgentDojo tasks with provable security. Microsoft Research's FIDES (May 2025) labels every datum with integrity and confidentiality tags and enforces information-flow invariants outside the model. All three operate at a layer the LLM cannot override.

4. **Production stacks are converging on seven layers.** Input handling (separating trusted from untrusted), output filtering (validating structure before action), capability sandboxing (the agent runs in a jail), privilege separation (least-authority tools), canary tokens (tripwires for exfiltration), policy engines (deterministic checks before high-impact actions), and continuous red teaming. Every team that has shipped a hardened agent in 2026 has at least five of these layers; the highest-stakes deployments have all seven.

5. **Best-in-class production numbers exist but are not solved.** OpenAI's Operator monitor achieves 99 percent recall and 90 percent precision on a 77-attempt red-team eval; Operator's susceptibility to prompt injection dropped from 62 percent baseline to 23 percent under full mitigation. StackOne Defender, an Apache-2.0 tool-response scanner, achieves 88.7 percent detection accuracy on CPU with a 22 MB MiniLM model, 81 times smaller than DistilBERT. Anthropic reports approximately 1 percent attack success rate for Claude Opus 4.5 with adversarial reinforcement learning against best-of-N attackers. These numbers are useful. None of them are solved.

6. **The continuous red-team gate is now table stakes.** Promptfoo, garak, AgentDojo, and InjecAgent integrate into pull-request pipelines with quantitative thresholds. Releases without an injection regression suite are uninsurable in 2026 and will not pass procurement reviews under EU AI Act, ISO/IEC 42001, or NIST AI RMF in 2027.

7. **What this paper does not cover.** Direct jailbreaking against frontier LLMs (covered separately in OpenAI and Anthropic system cards), the science of adversarial training (a model-research problem belonging to the labs themselves), and pure ML-classifier defenses absent architectural guardrails — the bypass research has settled this last question, and a classifier alone is no longer a defensible posture.

The remainder of the paper is the operational walkthrough. Read Parts I and II if you need the threat case for budget. Read Parts III, IV, and V if you are building. Read Part VI if you have ninety days and one production agent to harden by quarter-end.

## Part I: Three Attacks That Defined 2025

### 1.1 EchoLeak (CVE-2025-32711)

EchoLeak is the textbook case for indirect prompt injection in 2025 because it is fully chained, fully disclosed, and fully peer-reviewed. Aim Labs disclosed CVE-2025-32711 to Microsoft's Security Response Center in January 2025; Microsoft acknowledged and shipped a fix; Aim Labs published the chain on June 11 2025; and Reddy and Gujral peer-reviewed the case study in the AAAI Symposium Series later in 2025. The exploit chained four bypasses to achieve zero-click data exfiltration from Microsoft 365 Copilot via a single crafted email.

The first bypass defeats Microsoft's XPIA (Cross-Prompt Injection Attempt) classifier. Microsoft trained classifiers to detect prompts targeting Copilot. Aim Labs phrased the malicious email as if the instructions were directed at the recipient — not at an AI — so the classifier never fired. The second bypass defeated Copilot's Markdown link redaction. Copilot redacted external links in inline `[text](url)` syntax, but the team had forgotten to redact the reference-style format `[text][ref]\n\n[ref]: https://evil.example`. The third bypass exploited reference-style image markdown to trigger automatic data fetching from the attacker's server — no user click required. The fourth bypass defeated the Content Security Policy. Microsoft's CSP allowed `*.teams.microsoft.com`, and the team identified an open redirect URL on a Teams subdomain (`https://eu-prod.asyncgw.teams.microsoft.com/urlp/v1/url/content?url=<attacker>`) that lets exfiltrated bytes leave the trust boundary while passing CSP.

Aim Labs added two pieces of vocabulary that have stuck. **RAG Spraying** is the practice of padding a malicious email with multiple chunks targeting different likely user queries — onboarding documentation, leave-of-absence policies, expense procedures — so that whichever question the user asks the LLM, the RAG layer is likely to retrieve the malicious chunk. **LLM Scope Violation** describes the moment when untrusted input causes the AI to access privileged context it would not have surfaced on its own. The principle of least privilege — sacred in operating-system design for forty years — does not survive the transition to an LLM that concatenates tokens regardless of provenance.

The lesson EchoLeak teaches is not that Microsoft was uniquely careless. The lesson is that every component in the chain was a small, individually-defensible engineering compromise: a useful Markdown variant, a permissive CSP for a sister product, an open redirect kept around for backward compatibility. The vulnerability emerged from their composition. Defending against EchoLeak-class attacks at the *detection* layer requires anticipating every composition. Defending at the *architectural* layer — preventing untrusted input from reaching privileged context in the first place — requires anticipating only the trust boundaries.

### 1.2 MCPTox: 72.8 percent attack success against frontier MCP

If EchoLeak is the textbook chain, MCPTox is the textbook benchmark. Wang and colleagues constructed the first systematic large-scale evaluation of tool-poisoning attacks against the Model Context Protocol, building on 45 live, real-world MCP servers across eight application domains and 353 authentic tools. They generated 1,348 malicious test cases via three attack templates and few-shot expansion, covering ten risk categories. They evaluated twenty prominent LLM agents.

The headline result: o1-mini, OpenAI's reasoning-distilled model, achieved an attack success rate of **72.8 percent**. Phi-4 hit 70.2 percent. The average attack success rate across all twenty models was 36.5 percent. The most refusal-prone agent — Claude-3.7-Sonnet — refused fewer than 3 percent of attacks. This is not the result of a content-safety failure in the traditional sense. The agent was not asked to produce harmful text. It was asked to perform a malicious tool action, and it did so willingly because the malicious instructions were embedded in the tool's metadata (its description, parameter specifications, or prompts) rather than in user input.

Tool poisoning is a specialized form of indirect prompt injection. Earlier IPI research focused on attacks injected through tool *outputs* — the data the tool returns at runtime. Tool poisoning attacks the *tool description* — the metadata the agent reads at registration time, before any execution occurs. The malicious instructions are visible to the LLM but typically invisible to the human installing the MCP server, because most MCP clients render only a summary of tool descriptions in the user interface. The MCPTox authors confirm that adapting prior IPI benchmarks to tool poisoning collapses attack-success rates to nearly zero — the attack vector is genuinely distinct.

The capability-vs-safety inversion buried in MCPTox is the most interesting finding for safety researchers. **More capable models are more vulnerable**, because the attack exploits the model's superior instruction-following. A weaker model is more likely to ignore an awkwardly-phrased malicious instruction in a tool description; a stronger model parses it carefully and complies. Content-based safety alignment, which has carried frontier models through the chat-only era, does not protect against malicious actions executed through legitimate tools.

PolicyLayer, an independent reproducibility log, has confirmed tool poisoning against Cursor, Claude Desktop, WhatsApp's community MCP server, and the same 45 servers used in MCPTox. The attack class survived ten months of disclosure, fixes, and ecosystem updates without losing potency.

### 1.3 The Invariant Labs GitHub MCP exploit

The third defining attack of 2025 is the simplest and the most architecturally important. On May 26 2025 Invariant Labs published a critical vulnerability in the official GitHub MCP server — at the time, fourteen thousand stars on GitHub and one of the most widely-installed MCP integrations. The attack required no compromised tool. It required no malicious server. It required only a public GitHub issue containing a prompt injection.

The setup: a developer is using an MCP client (the original demonstration used Claude Desktop) connected to the official GitHub MCP server. The developer has access to both a public repository and a private repository. An attacker — anyone — opens an issue on the public repository containing a prompt injection. The issue can be benign-looking; it does not need to mention AI or Copilot or any obvious trigger. The developer at some point asks their agent a perfectly reasonable question: "Have a look at the open issues in `<public-repo>` and let me know what's there." The agent fetches the issues, encounters the injection, follows the malicious instructions, pulls private-repository data into context, and exfiltrates it via an auto-created pull request in the public repository — accessible to anyone, including the original attacker.

Invariant demonstrated successful exfiltration of private repository names, the developer's relocation plans (extracted from an unrelated private project's README), and salary information from a private compensation document. The demonstration has been independently reproduced — see GitHub issue #844 in `github/github-mcp-server`, where a researcher reproduced the exploit with both OAuth and personal access tokens and observed that broad-scope tokens enable both reading and writing of private data.

The architectural verdict is the lesson. **The GitHub MCP server itself was not flawed. The tools were not poisoned. The model was not jailbroken in any traditional sense.** The vulnerability emerged from the composition: an agent system that grants tool access spanning a trust boundary (public + private), processes untrusted external content (issues from anyone on the internet), and can write to a public destination. Simon Willison crystallized this configuration as the **lethal trifecta**: an agent simultaneously possesses (a) access to private data, (b) exposure to untrusted instructions, and (c) the ability to externalize information. Any agent with all three is, in the absence of architectural separation, indefensible against indirect prompt injection.

Invariant followed the disclosure with Toxic Flow Analysis (TFA) on July 29 2025 — a defense-side framework that builds the agent's flow graph, models the trust level and exfiltration potential of each tool, and enumerates dangerous compositions. TFA is now part of the open-source MCP-scan tooling. Snyk acquired Invariant and productized the same analysis as `snyk-agent-scan` with MDM and CrowdStrike background-mode integrations for company-wide agent supply-chain monitoring. The defender market caught up to the architecture lesson within ninety days of the original disclosure.

## Part II: Why Detection-Only Defenses Are Losing

The honest answer, acknowledged by OpenAI, Anthropic, and Google DeepMind in 2025 publications, is that prompt injection cannot be fully solved within current LLM architectures. The model-level attack surface is unbounded. Any defense expressed as an instruction inside the prompt can itself be overridden by a sufficiently clever attacker. Any classifier trained on adversarial examples can be defeated by inputs outside the training distribution. Any rate limit or circuit breaker can be amortized over enough attempts.

The OWASP LLM Prompt Injection Prevention Cheat Sheet now states this directly. Citing Hughes and colleagues, the cheat sheet documents 89 percent attack success on GPT-4o and 78 percent on Claude 3.5 Sonnet under best-of-N attacks with sufficient attempts. The accompanying analysis is unsparing: rate limiting only increases the computational cost for attackers; content filters can be systematically defeated through variation; safety training is bypassable across enough prompt formulations; circuit breakers have been demonstrated defeatable even in state-of-the-art implementations; temperature reduction provides minimal protection even at temperature zero. The conclusion: "robust defense against persistent attacks may require fundamental architectural innovations rather than incremental improvements to existing post-training safety approaches."

ICLR 2025's Agent Security Bench (ASB) provides the structured experimental record behind this conclusion. Zhang and colleagues evaluated 27 attack and defense methods across 13 LLM backbones, ten task scenarios, ten agents, and 400 tools. The aggregate attack-success rates by class: Direct Prompt Injection, 72.68 percent; Indirect Prompt Injection, 27.55 percent; Memory Poisoning, 7.92 percent; Plan-of-Thought Backdoor, 42.12 percent; Mixed Attack, **84.30 percent**. Refusal rates on the most-effective attack hovered at 3.22 percent. The eleven evaluated defenses, the authors conclude, demonstrate "limited effectiveness."

The 2026 update is harsher. Practitioners cite a forthcoming paper — referenced colloquially as "The Attacker Moves Second" in the 2026 Zylos Research review — that demonstrates adaptive attacks bypassing every one of twelve published prompt-injection defenses at over 90 percent attack success. The methodology is straightforward: instead of evaluating a defense against a static attack corpus, the paper trains an adaptive attacker that observes the defense's behavior and iterates. This mirrors how real adversaries operate. Every static benchmark eventually becomes a training set for an attacker that has more compute than the defender.

OWASP's response is to map prompt injection (LLM01:2025) onto the broader software-security taxonomy. MITRE ATLAS now lists three relevant techniques: AML.T0051.000 (LLM Prompt Injection: Direct), AML.T0051.001 (LLM Prompt Injection: Indirect), and AML.T0054 (LLM Jailbreak Injection: Direct). AWS's Prescriptive Guidance for agentic AI maps seventeen distinct controls to LLM01 alone, spanning agent scoping, threat modeling, prompt-as-code review, multi-layered input sanitization, edge protection, and continuous security posture management. The implicit message is that no single defense works; defense-in-depth is the only viable posture.

This is the pivot point for the rest of the paper. The detection-only era ended in 2025. The architectural era began with three publications.

## Part III: The Architectural Pivot — Rule of Two, CaMeL, FIDES

### 3.1 Meta's Rule of Two

Meta published the Agents Rule of Two on October 31 2025. The framework is short enough to state in one sentence: **until robustness research can reliably detect and refuse prompt injection, agents must satisfy no more than two of three properties within a session.** The three properties are (A) the agent processes untrusted inputs, (B) the agent has access to sensitive systems or sensitive data, and (C) the agent can change external state or impact the user beyond the conversation.

The configurations that satisfy the Rule of Two each foreclose one stage of the prompt-injection attack chain. **[BC]** — sensitive access plus state-change, no untrusted input — works for an agent that processes only emails from trustworthy senders, blocking the injection payload from ever reaching the context window. **[AC]** — untrusted input plus state-change, no sensitive access — works for an agent operating in a sandbox or test environment where any successful injection cannot reach data of consequence. **[AB]** — untrusted input plus sensitive access, no state-change — works for an agent that can read private email and external content but cannot send messages or take actions without human validation. If all three properties are required, Meta's guidance is to start a fresh session (with a clean context window) or require human-in-the-loop approval before the consequential action. Where neither is acceptable, the agent is, in present practice, indefensible.

Meta is explicit that the Rule of Two is not a finish line. Designs that satisfy it can still fail (a user can blindly confirm a warning interstitial, undoing the human-in-the-loop gate). Defense-in-depth is required, not optional. The Rule of Two supplements least-privilege; it does not replace it. Meta also flagged a forward-looking integration: tools that declare a Rule-of-Two configuration in their MCP descriptors can give developers deterministic answers about whether an action will succeed, fail, or escalate to approval. Their open-source LlamaFirewall platform is the alignment-controls layer they intend to use to satisfy the supervisory checks where human-in-the-loop is impractical, like long-running background processes.

### 3.2 CaMeL (Google DeepMind, March 2025)

CaMeL — Capability-based Mitigation Layer — was published on arXiv 2503.18813 on March 24 2025 by Debenedetti, Shumailov, Fan, Hayes, Carlini, Fabian, Kern, Shi, Terzis, and Tramèr at Google, Google DeepMind, and ETH Zürich. The paper, accepted at OpenReview under the title "Defeating Prompt Injections by Design," is the most thoroughly evaluated architectural defense in the literature.

CaMeL's architecture has four components. A **privileged LLM** receives the user's trusted query and emits a restricted Python program describing the intended workflow. A **quarantined LLM** processes untrusted content (tool outputs, RAG retrievals, external documents) but has no tool-calling capability of its own. A **custom interpreter** executes the privileged LLM's program, calling out to the quarantined LLM as needed for parsing and summarization, and tracks data provenance through the entire execution graph. A **capability policy engine** gates each tool call against capabilities derived from the trusted query — sending an email is permitted only if the recipient address came from a trusted source.

The headline result, reported on AgentDojo: CaMeL solves **67 percent of tasks with provable security**. The remaining 33 percent is utility loss, not safety loss — there is a class of tasks the framework cannot complete because the trusted query does not constrain the workflow tightly enough. Critically, "provable security" is not a vague claim. The interpreter can mathematically demonstrate that, given the policy, the executing program cannot violate the security invariants regardless of what the quarantined LLM is told to do. This is qualitatively different from "we tested it against our attack corpus and it held up." The 33 percent that fails fails by refusing to act; it does not fail by doing the wrong thing.

The reference implementation is published at `google-research/camel-prompt-injection` under Apache-2.0 (302 stars, 43 forks at time of writing). The disclaimer on the repository — "this is a research artifact, not a Google product" — is real; this is not a production framework today. But the design pattern has already shipped in adjacent forms. The "Design Patterns for Securing LLM Agents against Prompt Injections" paper (arXiv 2506.08837) generalizes CaMeL's ideas into a taxonomy: plan-then-execute (control-flow integrity), map-reduce isolation (each chunk processed by an injection-vulnerable agent that cannot reach external tools), and dual-LLM separation. Application-specific agents can be secured today using these patterns; the open research problem is the general-purpose autonomous agent.

### 3.3 FIDES (Microsoft Research, May 2025)

FIDES — the Flow Integrity Deterministic Enforcement System — was published by Costa, Köpf, Kolluri, Paverd, Russinovich, Salem, Tople, Wutschitz, and Zanella-Béguelin in arXiv 2505.23643 on May 29 2025, with the companion Microsoft Research publication on May 28. The paper takes a different architectural starting point from CaMeL. CaMeL came from compiler research (data-flow tracking, capability-based access control). FIDES comes from forty years of operating-system research on information-flow control.

Every datum in a FIDES-protected agent system carries two labels: an **IntegrityLabel** describing how trustworthy the source is (trusted, untrusted), and a **ConfidentialityLabel** describing who is authorized to see it (public, private, user-identity). When data flows through an operation, labels combine via a most-restrictive-wins lattice. A policy engine, operating outside the LLM, enforces two invariants deterministically: tool calls must be based on trusted-integrity data, and data may only flow to recipients permitted to read it.

In Microsoft's internal evaluation, the headline number is dramatic: **FIDES stopped all prompt-injection attacks during testing**. Equally surprising, FIDES-guarded agents paired with reasoning models completed **16 percent more tasks than baseline**. The structure of the constraint makes the agent better, not just safer. The mechanism is intuitive in retrospect: the labels force the planner to think about provenance up front, and the resulting plans are tighter.

FIDES landed in production via PR #5024 in `microsoft/agent-framework` on April 1 2026 — a remarkably short eleven-month path from research publication to mainstream framework. The pull request introduces concrete primitives. `IntegrityLabel` and `ConfidentialityLabel` are first-class types; `combine_labels()` implements the lattice. `ContentVariableStore` replaces untrusted content with opaque `VariableReferenceContent` placeholders, so the LLM never sees raw untrusted data — it sees a reference and operates on it via tool calls that respect the labels. `LabelTrackingFunctionMiddleware` provides three-tier automatic label propagation. `PolicyEnforcementFunctionMiddleware` blocks or escalates approval when context confidentiality exceeds a tool's `max_allowed_confidentiality`. `SecureAgentConfig` wires all of this into a one-line setup. `quarantined_llm` is an isolated LLM call (no tools) for safe summarization of untrusted content; `inspect_variable` provides controlled access to hidden variables with label awareness. The same PR adds two reference samples: `email_security_example.py` for integrity-based prompt-injection defense and `repo_confidentiality_example.py` for confidentiality-based exfiltration prevention against the GitHub MCP server.

The shared property of Rule of Two, CaMeL, and FIDES is the quiet point that makes them important. **They all enforce policy at a layer the model cannot override.** This is the same architectural lesson computer security learned in the 1970s when type-safe languages and operating-system access controls replaced "the program promises to be careful." The agent is no longer asked to follow the policy. It is structurally incapable of violating the policy regardless of what it has been instructed to do. That is the property the detection layer can never deliver, and that is why architectural defense is not a fashion — it is a phase change.

## Part IV: The 2026 Production Defense Stack

The architectural defenses in Part III are ground truth for what the next decade will look like. The seven-layer production stack in this section is what teams actually deploy today, in May 2026, while waiting for `microsoft/agent-framework`-style primitives to land in every framework. The layers compose; no single layer is sufficient on its own; most production deployments run five of seven, with the highest-stakes deployments running all seven.

### 4.1 Edge and gateway: the perimeter for LLM apps

Cloudflare's AI Security for Apps (formerly Firewall for AI) added prompt-injection scoring at the WAF layer. The field `cf.llm.prompt.injection_score` ranges from 1 to 99, where lower scores are more dangerous (1-19 high likelihood of injection, 20-49 moderate, 50-99 likely benign). Threshold tuning runs in three steps: log mode at threshold 40, review the surfaced traffic, lower threshold to 25 if false positives dominate, raise to 50 if attacks are getting through. The scoring composes with other signals: a rule like `injection_score < 30 AND bot_management.score < 20` targets prompts that look like injections coming from automation, which is a strong signal of an actual attack; `injection_score < 40 AND pii_detected` flags injection attempts that are simultaneously trying to extract personal data.

Lasso Security operates at the same layer but with an agent-specific telemetry model. Lasso's AI Detection & Response monitors every interaction across the agent stack — RAG retrievals, memory reads, tool invocations, sub-agent calls — and maps them into an execution graph that gives security teams visibility into the full sequence of events. The headline performance claims are aggressive: their LLM-as-judge runs at 570 times the speed of standard LLM inference, and their behavioral baselining flags zero-day attacks at 98.6 percent accuracy through intent modeling rather than signatures. Findings map to OWASP Top 10 and MITRE ATLAS. Deployment is API, firewall, or AI gateway integration — and a zero-deployment SaaS option that requires no agents, no code changes, and no source-code access.

### 4.2 Tool-response scanning: blocking the indirect attack surface

The lethal-trifecta attacks (EchoLeak, GitHub MCP, MCPTox) all share a structural feature: malicious content arrives through a tool call result. Tool-response scanning intercepts that result before it reaches the LLM. StackOne Defender, open-sourced under Apache-2.0 in February 2026, sets the bar. Its two-tier pipeline runs Tier 1 pattern matching at roughly 1 millisecond per response and Tier 2 ML classification (a fine-tuned MiniLM-L6-v2 ONNX model, int8-quantized to 22 megabytes, sentence-level scoring) only on responses where Tier 1 flagged suspicious fields. On a 25,000-sample benchmark Defender achieved 88.7 percent detection accuracy on CPU — better than DistilBERT (86 percent) at 81 times smaller and 8.6 times fewer false positives, and 48 times smaller than Meta Prompt Guard v1. Tool-aware rules ship out of the box: `gmail_*` tools auto-treated as higher risk; per-tool overrides for `crm_*`, GitHub, Notion, Jira. The library integrates with Vercel AI SDK, LangChain, LlamaIndex, the Anthropic SDK, and the OpenAI SDK in three lines.

Microsoft Prompt Shields is the productized counterpart. Two intervention points: user input (direct attack detection, formerly "Jailbreak risk detection") and tool response (document attack detection). Each request returns annotation results with `detected` and `filtered` flags. The optional Spotlighting feature, off by default, transforms document content using base-64 encoding so the model treats it as less trustworthy than direct user and system prompts. Spotlighting is the kind of low-friction, structurally-honest defense that production teams have been adopting quickly: it costs nothing in latency, it is invisible to legitimate users, and it tells the model "this region of text is not authoritative." General availability arrived in 2025 with reference customer AXA confirming production use.

### 4.3 Permission systems: shrinking the blast radius of every tool

The most underrated defense layer in 2025-2026 is also the simplest: change the default permission policy of your agent's tools. Anthropic's Managed Agents API (beta header `managed-agents-2026-04-01`) defines two policies — `always_allow` and `always_ask` — and applies them per-tool. **MCP toolsets default to `always_ask`.** This single default change collapses the attack surface for the most dangerous attack class: a newly-added MCP tool, possibly poisoned, cannot execute in your agent without explicit confirmation. Per-tool `configs[]` overrides allow developers to allow the agent toolset by default while requiring confirmation for bash. The confirmation flow is event-driven: `agent.tool_use` event → `session.status_idle` with `requires_action` → `user.tool_confirmation` event with `result: "allow"` or `"deny"` plus optional `deny_message`.

Claude Code itself ships with an even tighter default. Read-only by default; explicit permission for state changes; isolated context windows for web fetch (which directly addresses the EchoLeak class — the web result cannot influence the main reasoning context); a command blocklist on `curl` and `wget`; command-injection detection that requires manual approval for previously-allowlisted bash commands when the form is suspicious; fail-closed unmatched-command handling; and `/sandbox` mode for autonomous execution within filesystem and network boundaries. The combination is the production-grade implementation of the Rule of Two.

OpenAI's Operator and ChatGPT Agent products implement an analogous stack. Operator's confirmation prompts before consequential actions; Watch Mode that pauses execution when the user becomes inactive in sensitive contexts (logged into email or banking); memory disabled at launch to prevent injection-driven memory exfiltration; terminal network restrictions limited to specific datasets at launch. Each of these is a permission-system intervention that shrinks the blast radius of any successful injection.

### 4.4 Static and runtime supply-chain scanning

Tool poisoning and rug-pull attacks (where a previously-benign MCP server is replaced or modified to ship malicious tool descriptions) are a supply-chain concern. The same disciplines that protect npm and PyPI are being adapted for agent tools.

Invariant Labs's MCP-Scan is the open-source benchmark. Two modes: passive `mcp-scan scan` performs a static check of configured MCP servers for malicious tool descriptions, runs on demand; live `mcp-scan proxy` monitors, logs, and safeguards all MCP traffic at runtime, blocking attacks from untrusted sources. Detection coverage spans prompt injection in tool descriptions, tool poisoning, cross-origin escalation (tool shadowing — where one MCP server poisons descriptions to override another's tools), and **tool pinning** via cryptographic hashing to detect MCP rug-pull attacks. JSON output mode enables CI integration. The same engine — extended with company-wide visibility — ships as `snyk-agent-scan` after Snyk's acquisition of Invariant. Background mode integrates with MDM and CrowdStrike, scanning corporate machines on a schedule and reporting to a Snyk Evo instance — the agent supply-chain analog to traditional endpoint protection.

The guardrail rule language in MCP-Scan is worth understanding because it generalizes to any production agent. Rules are declarative and decoupled from agent code, allowing security teams to write and ship policy independently. The flow operator `(inbox: ToolOutput) -> (call: ToolCall)` matches a data-flow pattern; combined with the built-in `prompt_injection(inbox.content)` detector, a rule can express "must not send an email when agent has looked at suspicious email" in three lines. The direct-succession variant `~>` provides tighter ordering for stricter invariants. The pattern is the same as Invariant's published research on Toxic Flow Analysis: enumerate the agent's tool-flow graph, identify flows that satisfy the lethal trifecta, and write rules that block them.

### 4.5 Adversarial training as a complement, not a substitute

The labs continue to invest in model-level robustness, and the gains are real. Anthropic reports approximately 1 percent attack success rate for Claude Opus 4.5 against best-of-N adaptive attackers under adversarial reinforcement learning — an order-of-magnitude improvement over baseline. Anthropic's own framing is honest: "1 percent still represents meaningful risk" and "no browser agent is immune to prompt injection."

OpenAI's Atlas hardening update, published December 22 2025, documents the most rigorously-described automated red-team-to-checkpoint pipeline in the public record. An LLM-based automated attacker, trained end-to-end with reinforcement learning, hunts for prompt-injection attacks against the production browser agent. The innovation is "try before it ships": during the attacker's chain-of-thought reasoning, it can propose a candidate injection and query an external simulator that runs a counterfactual rollout of how the defender would behave if it encountered the injection. The simulator returns a full reasoning and action trace; the attacker uses that trace as feedback, iterates, and reruns the simulation multiple times before committing to a final attack. The inner attacker has privileged access to the defender's reasoning trace (which is not exposed to external users) — an asymmetric advantage that helps internal red-teaming outpace external adversaries. Each new attack discovery feeds directly into a new model checkpoint via continuous adversarial training; the attacks also feed monitoring rules, in-context safety instructions, and system-level safeguards.

The discipline this pipeline embodies — discover, train, ship, monitor — is the right discipline for the model layer. But the takeaway from the lab's own publication is the same as Anthropic's: this is a complement to architectural defenses, not a substitute. The best model in the best lab in late 2025, with state-of-the-art adversarial training, still concedes a 1 percent residual attack success rate. For a high-stakes agent processing thousands of injection-bearing inputs per day, 1 percent is several successful attacks every day. The architectural layer is the floor that catches them.

## Part V: Continuous Red Teaming as a Release Gate

The defenses in Parts III and IV are deployed once. The red-team gate runs every time you ship. By 2026, releases without an injection regression suite are not deployable in regulated industries and will not pass procurement reviews under EU AI Act, ISO/IEC 42001, or NIST AI RMF documentation requirements. This section is the operational walkthrough for the gate.

### 5.1 The eval canon

Four benchmarks define the public state of agent security evaluation in 2026.

**AgentDojo** is the canonical agent-security benchmark. Built by Debenedetti, Zhang, Balunovic, Beurer-Kellner, Fischer, and Tramèr at ETH Zürich and Invariant Labs, AgentDojo won SafeBench's first prize alongside Cybench and BackdoorLLM, and is the benchmark the US AI Safety Institute and UK AI Safety Institute used to demonstrate Claude 3.5 Sonnet's vulnerability to prompt injections. The corpus comprises 97 realistic tasks (managing email clients, navigating e-banking, making travel bookings) and 629 security test cases. AgentDojo is explicitly extensible — defenses, attacks, and tasks can be added — so the benchmark evolves with the threat landscape rather than aging out. The public results table is illuminating: a "repeat the user prompt" defense, intuitive on paper, raises GPT-4o's targeted attack success rate from 5.72 percent (no defense) to 27.82 percent. Some defenses make things worse. The benchmark catches that.

**InjecAgent** (Zhan, Liang, Ying, Kang at Findings of ACL 2024) is the focused indirect-prompt-injection benchmark. 1,054 test cases spanning 17 user tools and 62 attacker tools. Two attack-intent categories: direct harm to users and exfiltration of private data. The headline finding is the data point most often cited in vendor decks: ReAct-prompted GPT-4 was vulnerable 24 percent of the time at baseline; reinforcement with a hacking prompt nearly doubled the attack success rate. InjecAgent's strength is granularity — vendors can run it as a per-tool regression suite to confirm a specific tool's hardening.

**MCPTox** (covered in Part I) is the tool-poisoning benchmark. The 45 servers and 1,348 cases give vendors a credible production-fidelity test for any MCP server they ship.

**Agent Security Bench (ASB)**, the ICLR 2025 benchmark, is the broadest. 27 attack and defense methods, 13 LLM backbones, 10 task scenarios, 400+ tools. ASB's correlation matrix between attack class and defense effectiveness is the closest thing to a public adversarial-robustness leaderboard the field has.

### 5.2 The tooling

**garak**, NVIDIA's productized LLM vulnerability scanner, is the "nmap for LLMs." Probes include `promptinject` (the Agency Enterprise framework that won best-paper at NeurIPS ML Safety Workshop 2022), `encoding` (prompt injection through text encoding tricks), `gcg` (adversarial-suffix attacks), `xss` (data-exfiltration via cross-site vectors), `atkgen` (automated red-team attack generation by an LLM probing the target), and `goodside` (Riley Goodside's catalog of clever attacks). Generators include LiteLLM, which gives garak access to 1,046 model connectors with a single integration. Specifying `--probes promptinject` runs only that family; specifying a single plugin (e.g., `lmrc.SlurUsage`) runs a precise targeted test. The discipline garak imposes — structured probing with reproducible results — is the foundation of any red-team CI.

**Promptfoo** is the open-source eval and red-team framework that has become the de facto CI integration. Promptfoo ships 157 plugins across six categories (brand, compliance and legal, dataset, security and access control, trust and safety, custom). The plugin set spans `prompt-injection`, `jailbreak`, `hijacking`, `excessive-agency`, `pii`, `harmful`, `cyberseceval`, `harmbench`, `indirect-prompt-injection`, and the entire OWASP LLM Top 10 mapping. The **coding-agent suite** is the operational standout for 2026: `coding-agent:repo-prompt-injection` (untrusted repository content steers the agent), `coding-agent:terminal-output-injection` (compiler/test/install/hook output as instruction channel), `coding-agent:secret-env-read`, `coding-agent:sandbox-read-escape`, `coding-agent:verifier-sabotage`, `coding-agent:secret-file-read`, `coding-agent:sandbox-write-escape`, `coding-agent:network-egress-bypass`, `coding-agent:procfs-credential-read`, `coding-agent:delayed-ci-exfil` (the agent plants automation that exfiltrates after the immediate run completes), `coding-agent:generated-vulnerability`, `coding-agent:automation-poisoning`, `coding-agent:steganographic-exfil`. The bundle `coding-agent:all` runs every plugin against a coding agent; teams shipping agents with shell access run this suite on every release.

### 5.3 The CI pattern

The reference implementation, refined by RapidClaw, redteams.ai, and Promptfoo's own documentation, runs in GitHub Actions on every pull request that touches the agent's prompts, configuration, or source code, plus a nightly schedule to catch regressions from upstream model updates. The pipeline performs four steps: install promptfoo and Python dependencies; generate attack payloads; run `promptfoo eval` or `promptfoo redteam run`; parse `results.json` and fail the build if the pass rate falls below threshold. A typical threshold for the baseline known-payload corpus is 90 percent or higher; for novel adaptive-attack corpora, the threshold may be lower (60-70 percent) with pass-rate trend monitoring as the actual gate. Results are uploaded as build artifacts; regression-detection scripts compare current results against baseline to catch silent drifts.

The three-suite minimum that practitioners converge on: a **baseline regression suite** of a few hundred known payloads from PromptBench, garak, and OWASP's LLM testing kit, with a 100 percent block target for known-malicious inputs; an **indirect-injection scenario suite** consisting of synthetic webpages, PDFs, and tool results containing instructions specifically crafted against your tool names, with zero unintended tool calls as the gate; and an **LLM-driven adversary suite** where a separate model in attacker mode is given your tool list and asked to find sequences that produce policy violations, with novel successful attacks tracked and converted into regression tests. The third suite is what catches future-state attacks; the first two ensure today's attacks don't recur.

### 5.4 The operational rule that catches eval evidence-corruption

A subtle point from Promptfoo's coding-agent documentation generalizes to any agent with persistent memory or filesystem access. Coding agents mutate the checkout as they work. If multiple test rows reuse the same writable repository, a canary, weakened test, or debug artifact from an earlier row can leak into a later row and corrupt the result. The rule: **fresh clone, disposable worktree, container snapshot, or reset hook for every row** when you want training-quality evidence. The same rule applies to any agent with shared state: every red-team test should start from a deterministic clean baseline. Otherwise, your eval results are confounded by earlier tests, and you cannot tell whether a fix actually worked.

## Part VI: A 90-Day Implementation Playbook

Most teams reading this paper have at least one production agent already shipped — and at least one agent that satisfies the lethal trifecta (untrusted input, sensitive access, external state-change) without architectural separation. This section is the ninety-day roadmap to fix the highest-blast-radius agent first.

### Days 1-30: Triage and scope

Inventory every agent in your organization — homegrown agents, embedded coding assistants, customer-support chatbots, internal copilots, third-party agents wired into your tools. For each, document: which tools it can call, which data it can read, which actions it can take that change external state. Map each agent onto the Rule of Two. **Flag every agent that satisfies all three properties.** Those agents are, in present practice, indefensible against indirect prompt injection without an architectural change.

Rank the trifecta-satisfying agents by blast radius. Which agents have read access to private code repositories? Which have access to customer PII or financial data? Which can authorize payments? Which can send email or post to public channels on behalf of users? The blast-radius ordering is a function of your business, not a generic ranking — but the principle is universal: pick the agent where a successful injection could most damage you, your customers, or your regulators.

Pick exactly one agent for the first hardening pass. Resist the temptation to do them all. The defense stack you build for the first agent will become the template for the next twenty.

Stand up an injection regression CI job in parallel. Start small: garak with the `promptinject` probe family against your model, a handful of known indirect-injection payloads, and a custom 20-prompt suite that targets your specific tool names. Run on every pull request that touches the agent's prompts, model version, tool definitions, or system prompt. Set the bar low at first (you do not yet have data for tighter thresholds) and tighten over the next sixty days as the suite grows.

### Days 31-60: Harden one agent end-to-end

The seven-layer stack from Part IV maps onto a sequenced rollout. You can do this in any order, but the order below front-loads the highest-leverage interventions.

**Layer 1: edge.** Wrap the agent's HTTP entry behind Cloudflare AI Security for Apps or Lasso's gateway. Set the threshold to 30 with action `Log` first; review what gets surfaced for two weeks; then move to `Block` for high-confidence detections.

**Layer 2: input handling.** Separate trusted query from untrusted RAG and tool content with explicit delimiters. Adopt Microsoft Prompt Shields' Spotlighting pattern — base-64 encoding for untrusted regions — or your equivalent. The model still sees the content but is structurally informed that the region is not authoritative.

**Layer 3: tool-response scanning.** Wrap every external tool result with StackOne Defender or an equivalent. Block high-risk responses; observe medium-risk; allow low-risk. The two-tier pattern (fast pattern matching + ML classification only on suspicious fields) keeps latency under 50 milliseconds for typical responses.

**Layer 4: permission system.** Switch every MCP toolset to `always_ask` for sensitive tools — file writes, network egress to unfamiliar destinations, email send, payment authorization, GitHub PR creation, calendar modifications. Allow-list only the tool calls you have explicitly verified safe under your trust model. Where Anthropic's Managed Agents API or an equivalent is available, use it; where not, implement the same default in your application code.

**Layer 5: capability sandbox.** Run filesystem and shell tools inside a container or network-restricted environment. Treat the agent's execution context the way you treat any untrusted code: assume it will misbehave, and constrain what misbehavior can do. Egress filter all network access from shell contexts. Provide explicit network allow-lists rather than implicit deny-lists.

**Layer 6: policy engine.** Write five to ten deterministic invariants in the Invariant guardrail syntax (or your equivalent). Examples that have generalized across teams: "must not send email after reading inbox containing prompt injection," "must not write outside checkout," "must not read protected paths," "must not invoke `transfer_funds` after reading external content within the same session," "must not modify CI workflows or git hooks during an unrelated task." Five rules in a deterministic engine block more attacks than five hundred rules in an LLM-as-judge prompt, because the deterministic engine cannot be persuaded.

**Layer 7: red-team CI.** Expand the regression suite from day-one minimum to 300+ tests across plugin families. Add the three-suite minimum (baseline, indirect, LLM-driven adversary). Wire the build to fail on a 10 percent attack-success-rate regression against the prior baseline. Add nightly runs to catch model-side drift from upstream updates.

### Days 61-90: Operationalize and monitor

Onboard observability. Trace every tool call (the perea.ai Agent Observability Stack paper has the full playbook). At minimum, log every tool invocation with full provenance — what instruction chain led to this execution — to support post-incident analysis. Add canary tokens to high-value data and monitor for egress; a canary is a string that no legitimate query should ever return, so its appearance in any output channel is a high-confidence exfiltration signal.

Tabletop a prompt-injection incident. Who detects it? Who responds? Who notifies regulators, customers, executives? What is your communication plan? Most teams discover, in the tabletop, that they have not assigned ownership for prompt-injection incidents specifically — they fall between application security (which thinks of them as a model problem) and ML/AI teams (which think of them as a security problem). Pick one team. Write the runbook.

Run an external red-team exercise. Give the team your tool list, your system prompt, and access to a test user account. Ask them to break out — extract data they should not have, take an action the user did not authorize, exfiltrate via an unexpected channel. Convert any new attack into a regression test. Pay them well; the teams who do this work professionally find faster and more interesting attacks than internal teams operating in their spare cycles.

Pick the next agent. Repeat. The ninety-day playbook for the second agent runs faster — typically forty-five days — because the layered defense infrastructure is already built. The third agent is faster still. By the time you reach the fifth or sixth agent, the discipline becomes mechanical: pick agent, score against Rule of Two, identify gaps, apply seven-layer stack, ship.

## Part VII: Where This Goes (2027 and beyond)

The architectural defenses introduced in 2025 will land in mainstream agent frameworks over the next eighteen months. The path is already visible: `microsoft/agent-framework` PR #5024 productizes FIDES; `google-research/camel-prompt-injection` will be reimplemented in production-grade frameworks; LlamaFirewall and similar will productize Rule of Two policies. By 2027, `quarantined_llm`, integrity-confidentiality labels, and capability-based tool gating will be primitives in every framework, not research artifacts.

Detection-only vendors who built their value proposition on prompt-injection classification will either pivot to runtime-policy engines or be acquired by integrated platforms. The market's verdict is already visible — Snyk acquired Invariant; the gateways and observability platforms are building agent-trace capabilities natively; standalone classifiers are increasingly bundled rather than sold.

Adaptive-attack tooling will improve faster than defenses. Productized red-team automation — the descendants of OpenAI's internal Atlas attacker — will be available to blue teams within eighteen months. The arms race shifts from "do we have a defense" to "is our defense surviving the latest automated attacker." This is the same evolution that traditional security went through with fuzzers and dynamic application-security-testing tools in the 2010s. The discipline will mature.

The compliance layer is forming. EU AI Act, ISO/IEC 42001, NIST AI RMF, and emerging procurement standards will require documented prompt-injection defenses by the 2027 procurement cycle. By 2028, an enterprise buyer will demand a SOC-2-style report covering Rule-of-Two configurations, eval-suite results, red-team CI thresholds, and incident-response runbooks. The teams who built the seven-layer stack in 2026 will pass these reviews; the teams who relied on a single classifier will not.

An open question remains: what does "patch" mean for an LLM-native vulnerability? When a bypass lives in the model checkpoint itself, every release of the model is, in effect, a re-test of every defense the application built on top. Versioning, rollback, and compatibility for AI-defended agents are unsolved at the industry level. The teams shipping agents through 2026-2027 will write the rules by precedent.

The honest framing for the 2027 horizon is the same as the framing in this paper's executive summary. Prompt injection is not solved at the model layer and may never be. The architectural layer is winning at containing the blast radius. That is the whole game. The teams who internalize that — who design their agents to be safe even when the model misbehaves — are the teams whose agents will still be shipping in 2030.

## Closing

This paper is the security floor underneath the rest of the perea.ai canon. The B2A Imperative argues that the buyer of the next decade is autonomous; the MCP Server Playbook explains how to expose your product to that buyer; the Agent Payment Stack closes the commerce loop; the Agent Observability Stack tells you what your agent is doing in production. None of those papers can be acted on safely without the architectural defenses, the seven-layer stack, and the continuous red-team gate documented here.

The single ask of the reader is straightforward. Pick one agent in your organization that satisfies the lethal trifecta — untrusted input, sensitive access, external state-change. Spend the next ninety days hardening it under the playbook in Part VI. Then pick the next.

The work is not glamorous. Most of it is boring permission-policy plumbing, regression-suite maintenance, and label propagation. Boring permission-policy plumbing is the architectural floor that makes the rest of the agent economy viable. Build it now. The compounding payoff begins on day ninety-one, when every agent you ship after the first one rides on infrastructure you only had to build once.


## References

1. CVE-2025-32711 — Microsoft Security Response Center — https://msrc.microsoft.com/update-guide/vulnerability/CVE-2025-32711
2. EchoLeak: The First Real-World Zero-Click Prompt Injection Exploit in a Production LLM System — https://ojs.aaai.org/index.php/AAAI-SS/article/view/36899
3. Breaking down 'EchoLeak' — Simon Willison, June 11 2025 — https://blog.simonwillison.net/2025/Jun/11/echoleak/
4. CVE-2025-32711 — Tenable — https://www.tenable.com/cve/CVE-2025-32711
5. EchoLeak Exploit Enables Silent Data Theft from Microsoft 365 Copilot — CyberInsider — https://cyberinsider.com/echoleak-exploit-enables-silent-data-theft-from-microsoft-365-copilot/
6. MCPTox: A Benchmark for Tool Poisoning Attack on Real-World MCP Servers — arXiv 2508.14925 — https://arxiv.org/abs/2508.14925
7. MCPTox — AAAI 2026 publication record — https://ojs.aaai.org/index.php/AAAI/article/view/40895
8. MCP Tool Poisoning: Prompt Injection via Tool Metadata — PolicyLayer (Apr 19 2026) — https://policylayer.com/attacks/tool-poisoning
9. GitHub MCP Exploited: Accessing private repositories via MCP — Invariant Labs (May 26 2025) — https://invariantlabs.ai/blog/mcp-github-vulnerability
10. Invariant Labs Exposes Toxic Flows in Agentic Systems & MCP Servers — July 29 2025 — https://invariantlabs.ai/blog/toxic-flow-analysis
11. MCP Security Notification: Tool Poisoning Attacks — Invariant Labs (Apr 1 2025) — https://invariantlabs.ai/blog/mcp-security-notification-tool-poisoning-attacks
12. Exfiltrate information from private repositories — github/github-mcp-server Issue #844 — https://github.com/github/github-mcp-server/issues/844
13. DEVCLASS coverage — Researchers warn of prompt injection vulnerability in GitHub MCP with no obvious fix — https://blog.rankiteo.com/gitinv1766037664-vulnerability-may-2025/
14. Agent Security Bench (ASB) — ICLR 2025 conference paper — https://proceedings.iclr.cc/paper_files/paper/2025/file/5750f91d8fb9d5c02bd8ad2c3b44456b-Paper-Conference.pdf
15. ASB project page — luckfort.github.io — https://luckfort.github.io/ASBench/
16. ICLR 2025 Poster — Agent Security Bench — https://iclr.cc/virtual/2025/poster/29432
17. arXiv 2410.02644 — Agent Security Bench preprint — https://arxiv.org/abs/2410.02644
18. OWASP Top 10 for LLM Applications 2025 — https://genai.owasp.org/resource/owasp-top-10-for-llm-applications-2025
19. LLM01:2025 Prompt Injection — OWASP — https://genai.owasp.org/llmrisk/llm01/
20. LLM Prompt Injection Prevention Cheat Sheet — OWASP — https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html
21. AWS Prescriptive Guidance — Mapping to OWASP Top 10 for LLM — https://docs.aws.amazon.com/prescriptive-guidance/latest/agentic-ai-security/owasp-top-ten.html
22. OWASP Top 10 for Large Language Model Applications — project home — https://owasp.org/www-project-top-10-for-large-language-model-applications/
23. Agents Rule of Two: A Practical Approach to AI Agent Security — Meta AI (Oct 31 2025) — https://ai.meta.com/blog/practical-ai-agent-security/
24. Design Patterns for Securing LLM Agents against Prompt Injections — arXiv 2506.08837 — https://arxiv.org/html/2506.08837v2
25. Indirect Prompt Injection: Attacks, Defenses, and the 2026 State of the Art — Zylos Research (Apr 12 2026) — https://zylos.ai/research/2026-04-12-indirect-prompt-injection-defenses-agents-untrusted-content
26. Defeating Prompt Injections by Design — arXiv 2503.18813 (CaMeL preprint) — https://arxiv.org/abs/2503.18813
27. Defeating Prompt Injections by Design — OpenReview record — https://openreview.net/forum?id=tbzYnlHXPy
28. CaMeL implementation — google-research/camel-prompt-injection on GitHub — https://github.com/google-research/camel-prompt-injection
29. Securing AI Agents with Information-Flow Control — Microsoft Research (May 28 2025) — https://www.microsoft.com/en-us/research/publication/securing-ai-agents-with-information-flow-control/
30. FIDES preprint — arXiv 2505.23643 — https://arxiv.org/abs/2505.23643
31. FIDES tutorial — microsoft/fides on GitHub — https://github.com/microsoft/fides
32. FIDES rolling into Microsoft Agent Framework — PR #5024 (April 1 2026) — https://github.com/microsoft/agent-framework/pull/5024
33. Prompt Shields in Microsoft Foundry — concept docs — https://learn.microsoft.com/en-us/azure/ai-services/openai/concepts/content-filter-prompt-shields
34. Quickstart: Detect prompt attacks with Prompt Shields — Azure AI Content Safety — https://learn.microsoft.com/en-us/azure/ai-services/content-safety/quickstart-jailbreak
35. Document Embedding in Prompts — Microsoft Foundry docs — https://learn.microsoft.com/en-us/azure/ai-foundry/openai/concepts/content-filter-document-embedding
36. General availability of Prompt Shields — Microsoft Tech Community — https://techcommunity.microsoft.com/blog/azure-ai-foundry-blog/general-availability-of-prompt-shields-in-azure-ai-content-safety-and-azure-open/4235560
37. StackOne Defender — official documentation — https://docs.stackone.com/guides/defender
38. StackOne Defender — open-source release announcement (Feb 2026) — https://www.stackone.com/changelog/announcing-stackone-defender-against-prompt-injection
39. StackOne Defender — GitHub source (Feb 13 2026) — https://github.com/StackOneHQ/defender
40. Prompt injection detection — Cloudflare AI Security for Apps (formerly Firewall for AI) — https://developer.cloudflare.com/waf/detections/ai-security-for-apps/prompt-injection/
41. Claude Code — Security model — https://docs.anthropic.com/en/docs/claude-code/security
42. Permission policies — Claude API (Managed Agents beta) — https://platform.claude.com/docs/en/managed-agents/permission-policies
43. Mitigate jailbreaks and prompt injections — Claude API docs — https://docs.anthropic.com/en/docs/mitigating-jailbreaks-prompt-injections
44. Operator System Card — OpenAI — https://openai.com/index/operator-system-card
45. Operator System Card PDF — OpenAI archived (Jan 23 2025) — https://cdn.openai.com/operator_system_card.pdf
46. ChatGPT Agent System Card — OpenAI Deployment Safety Hub — https://deploymentsafety.openai.com/chatgpt-agent
47. Continuously hardening ChatGPT Atlas against prompt injection — OpenAI (Dec 22 2025) — https://openai.com/index/hardening-atlas-against-prompt-injection/
48. Lasso Gateway for Large Language Models — Lasso Security — https://www.lasso.security/products/lasso-secured-gateway-for-lmm
49. AI Security Platform — Lasso Security — https://www.lasso.security/platform/ai-security
50. AI Detection & Response — Lasso Security — https://www.lasso.security/platform/ai-detection-response
51. MCP-Scan Advanced Guardrails — Invariant Labs documentation — https://invariantlabs-ai.github.io/docs/mcp-scan/guardrails-reference/
52. MCP-Scan — securing MCP with Invariant — https://invariantlabs-ai.github.io/docs/mcp-scan
53. Snyk Studio agentic integrations — Snyk User Docs — https://docs.snyk.io/integrations/snyk-studio-agentic-integrations
54. snyk/agent-scan — GitHub source — https://github.com/snyk/agent-scan/blob/main/docs/scanning.md
55. AgentDojo — A dynamic environment to evaluate prompt injection attacks and defenses — https://agentdojo.spylab.ai/
56. AgentDojo — public results table — https://agentdojo.spylab.ai/results/
57. AgentDojo — NeurIPS 2024 poster — https://nips.cc/virtual/2024/poster/97522
58. AgentDojo — NeurIPS proceedings record — https://proceedings.neurips.cc//paper_files/paper/2024/hash/97091a5177d8dc64b1da8bf3e1f6fb54-Abstract-Datasets_and_Benchmarks_Track.html
59. garak: A Framework for Security Probing Large Language Models — arXiv 2406.11036 — https://arxiv.org/abs/2406.11036
60. NVIDIA/garak — GitHub — https://github.com/NVIDIA/garak
61. garak — DOI / DataCite record — https://dx.doi.org/10.48550/arXiv.2406.11036
62. CI/CD Integration for LLM Eval and Security — Promptfoo — https://www.promptfoo.dev/docs/integrations/ci-cd/
63. Red Team Quickstart — Promptfoo — https://promptfoo.dev/docs/red-team/quickstart
64. How to red team LLM applications — Promptfoo guide — https://promptfoo.dev/docs/guides/llm-redteaming
65. Red Team Plugins — Promptfoo (157 plugins, 6 categories) — https://www.promptfoo.dev/docs/red-team/plugins/
66. InjecAgent: Benchmarking Indirect Prompt Injections — ACL Findings 2024 — https://aclanthology.org/2024.findings-acl.624/
67. InjecAgent — arXiv 2403.02691 — https://arxiv.org/abs/2403.02691
68. Prompt Injection Defense for AI Agents — Rapid Claw (Apr 20 2026) — https://rapidclaw.dev/blog/prompt-injection-defense-production-agents-2026
69. Lab: Automated Red Team Pipeline — redteams.ai (Mar 15 2026) — https://redteams.ai/topics/labs/intermediate/lab-automated-red-team
70. Red Team Coding Agents — Promptfoo (Apr 24 2026) — https://www.promptfoo.dev/docs/red-team/coding-agents/
71. Promptfoo CI/CD Pipeline Integration — redteams.ai walkthrough — https://redteams.ai/topics/walkthroughs/tools/promptfoo-cicd-integration
72. LLM Prompt Injection Prevention Cheat Sheet — OWASP (re-cited from SQ1, Best-of-N reference) — https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html
73. Hardening Atlas — automated red team feedback into model training (re-citation of [47]) — https://openai.com/index/hardening-atlas-against-prompt-injection/


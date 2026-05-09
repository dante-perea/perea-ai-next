---
title: "MAESTRO Threat Modeling for Multi-Agent Architectures"
subtitle: "How CSA MAESTRO complements the OWASP Agentic Top 10, NIST AI 600-1, CSA AICM/ATF, and the AWS Scoping Matrix in production agent threat models — and how AAGATE, CoSAI, and MITRE ATLAS turn it into runtime control"
publication: "perea.ai Research"
authors: ["Dante Perea"]
version: "1.0"
status: "Public draft"
date: "2026-05"
audience: "Security architects, AI platform engineers, and governance leads at organizations deploying multi-agent systems in 2026"
length: "~7,500 words"
license: "CC BY 4.0"
profile: "technical-playbook"
description: "MAESTRO is the modeling spine of the 2025–26 agentic security stack. This paper shows how it interlocks with OWASP Agentic Top 10, NIST AI 600-1, CSA AICM/ATF, the AWS Agentic AI Security Scoping Matrix, MITRE ATLAS, and CoSAI's MCP Security and Agentic IAM papers — and why AAGATE and Microsoft's Agent Governance Toolkit are the runtime instantiations practitioners actually deploy."
---

## Executive Summary

The 2025–26 wave of agentic AI deployment exposed a gap traditional threat-modeling frameworks could not close: when the attacker is the model and the protected resource is the agent's own intent, STRIDE, PASTA, and LINDDUN cannot tell you what to do.[^1] Ken Huang's MAESTRO framework — published by the Cloud Security Alliance in February 2025 — was the first canonical answer.[^2] It treats agent autonomy, non-determinism, and trust-boundary erosion as first-class threat dimensions, and it organizes mitigations across seven layers: Foundation Models, Data Operations, Agent Frameworks, Deployment Infrastructure, Evaluation & Observability, Security & Compliance, and Agent Ecosystem.[^3]

Twelve months later, MAESTRO is the connective tissue for an exploded ecosystem. The OWASP Top 10 for Agentic Applications (December 9, 2025) catalogs threats ASI-01 through ASI-10 with named real-world incidents — EchoLeak, Amazon Q, GitHub MCP exploit, AutoGPT RCE, Gemini Memory Attack, Replit meltdown — and ties each to the AI-VSS scoring standard.[^4][^5] NIST AI 600-1's Generative AI Profile organizes 12 risk categories.[^6] CSA's AI Controls Matrix v1.0 ships 243 controls across 18 domains, and the Agentic Trust Framework (February 2, 2026, foreword by Zero Trust author John Kindervag) anchors the policy language on top of it.[^7][^8]

AWS's Agentic AI Security Scoping Matrix (November 21, 2025) bins systems into four scopes — No Agency, Prescribed Agency, Supervised Agency, Full Agency — across six security dimensions.[^9][^10] CoSAI's Model Context Protocol Security paper (January 8, 2026) catalogs roughly forty threats across twelve categories, and its companion Agentic Identity and Access Management paper (March 20, 2026) defines how to extend SPIFFE/SVID and RFC 8693 token exchange to autonomous agents.[^11][^12][^13]

This paper makes four claims.

**First**, MAESTRO is the modeling spine, not a competing framework. Use it as the *Map* step inside NIST AI RMF; do not treat it as a replacement for OWASP, MITRE ATLAS, or AICM.

**Second**, AAGATE — the Cloud Security Alliance's Kubernetes-native reference architecture published December 22, 2025 — is the operational instantiation.[^14] Its eight components map directly onto MAESTRO's layers and turn a paper threat model into runtime enforcement at machine speed.[^15]

**Third**, the OWASP Top 10 for Agentic Applications and MITRE ATLAS v5.4.0+ are the threat catalog. ATLAS v5.4.0 (February 5, 2026) added the agentic AML.T0080–T0107 cluster — Context Poisoning, Modify AI Agent Configuration, Escape to Host, Exploitation for Credential Access — and the OpenClaw investigation (CVE-2026-25253) gave practitioners the first chained, public agentic kill chain.[^16][^17] MAESTRO is where you assign each technique to a layer and a control owner.

**Fourth**, the AWS Scoping Matrix is the budget allocator. Agency level determines how many MAESTRO layers you instrument, how aggressively, and where the human-in-the-loop fails closed. Most enterprises operate Scope 2 or 3; only research labs and trading desks need full Scope 4 instrumentation.[^9]

The remainder of the paper is a production playbook: a layer-by-layer threat catalog with ASI and AML codes assigned, the AAGATE control-loop mapping, the five-framework interlock matrix, scope-driven instrumentation budgets, and three deployment archetypes — A2A multi-agent, OpenClaw-class local autonomy, and regulated financial-services back office — with MAESTRO threat IDs called out in each.

---

## Part I — Why MAESTRO Exists

### The shape of the gap

STRIDE, PASTA, and LINDDUN model deterministic systems with clear trust boundaries. Agentic systems break three foundational assumptions: deterministic behavior, fixed trust boundaries, and human-mediated action.[^18] The OWASP Securing Agentic Applications Guide (July 28, 2025) names the new security surfaces this exposes — persistent memory (context poisoning, data leakage), autonomous planning (misaligned objectives, recursive decision loops), and emergent multi-agent behavior — and introduces the "safe failure" state concept that older frameworks lack vocabulary for.[^19]

The academic literature reached the same conclusion from the other direction. The "Agents Under Siege" survey and the SentinelAgent runtime monitoring paper (April 2026) both identify the same root cause: agentic systems do not have a single trust boundary that a perimeter control can defend.[^20] Trust degrades hop by hop as delegation chains form, memory accumulates, and tool calls compound side effects.

### What MAESTRO adds

MAESTRO — Multi-Agent Environment, Security, Threat, Risk, and Outcome — is structured as a methodology rather than a checklist.[^2] Six steps run end to end:

1. **System Decomposition** — enumerate agents, models, tools, memory stores, and trust boundaries.
2. **Layer-Specific Threat Modeling** — for each of seven layers, enumerate threats; assign control owner.
3. **Cross-Layer Threat Identification** — model chained attacks; this is where MAESTRO outperforms STRIDE+ adaptations.
4. **Risk Assessment** — score with OWASP AIVSS and SEI SSVC; allocate against AWS Scope.
5. **Mitigation Planning** — pick controls from AICM, CoSAI Agentic IAM, AAGATE components.
6. **Implementation + Monitoring** — Steven Leath's TITO scanner walks Layers 1–3 in CI/CD; Layers 4–7 require runtime signals.[^21]

Across all six steps, three dimensions distinguish agentic threats from conventional ones: **Non-Determinism** (the same input may produce different outputs), **Autonomy** (the system may pursue sub-goals without explicit instruction), and **Erosion of Trust Boundaries** (delegation chains and shared memory dissolve perimeters).[^2][^3]

### The seven layers

MAESTRO organizes the problem space into seven layers. The full threat catalog appears in Part II; for orientation:

- **Layer 1 — Foundation Models.** Pre-trained model artifacts and weights.
- **Layer 2 — Data Operations.** Training corpora, retrieval indices, embeddings, memory stores.
- **Layer 3 — Agent Frameworks.** LangChain, CrewAI, AutoGen, OpenAI Agents, Microsoft Agent Framework — the orchestration layer.
- **Layer 4 — Deployment Infrastructure.** Containers, sandboxes, service mesh, network controls.
- **Layer 5 — Evaluation & Observability.** Metrics, traces, evaluation harnesses, drift detection.
- **Layer 6 — Security & Compliance.** Identity, policy, audit, regulatory mapping.
- **Layer 7 — Agent Ecosystem.** Multi-agent collaboration, marketplaces, A2A communication, emergent behavior.[^3]

### Why it spread

Four canonical case studies and one regulatory bridge cemented MAESTRO as the spine of the agentic security stack.

The **A2A protocol case study** (CSA, April 30, 2025) mapped Google's Agent-to-Agent protocol to all seven layers, demonstrating that A2A primarily resides at Layer 3 but interacts with Layers 1, 2, 5, and 6, with Layer 4 always relevant and Layer 7 critical for any multi-agent deployment.[^22] The **OpenClaw MAESTRO analysis** (CSA, February 20, 2026) gave practitioners the first applied case study with explicit threat IDs per layer — LM-001, DO-003, AF-002, DI-001, AE-004 Multi-Agent Collusion — and traced a single chained threat across Infrastructure → Data → Model → Ecosystem.[^23] The **TITO CI/CD case study** (CSA, with Steven Leath) made the framework operational in continuous integration.[^21] The **AAGATE reference architecture** (CSA, December 22, 2025, with arXiv preprint 2510.25863) supplied the runtime instantiation.[^14][^15]

The regulatory bridge arrived April 2, 2026, when CSA published the **NIST AI RMF Agentic Profile**.[^24] It proposes structured extensions — AG-MG.2 behavioral drift detection, AG-MS.3 delegation chain integrity, AG-MP.1 Agent Tool Risk Classification — that align RMF Govern/Map/Measure/Manage with AICM's 243 controls and AAGATE's components.[^14][^24]

> ### Quotable Findings I — Why threat modelers needed a new spine
>
> 1. **STRIDE assumes a trust boundary the agent does not have.** Once an agent calls a tool, reads memory, or forwards to another agent, the perimeter dissolves. MAESTRO models this as Layer 7 emergent behavior — the layer STRIDE cannot reach.[^2][^18]
>
> 2. **Six methodology steps, not a checklist.** MAESTRO's value is procedural: System Decomposition → Layer Modeling → Cross-Layer → Risk Assessment → Mitigation → Implementation. Skipping cross-layer is how OpenClaw's CVE-2026-25253 was missed in pre-release review.[^2][^17]
>
> 3. **Three dimensions, not five categories.** Non-Determinism, Autonomy, Trust-Boundary Erosion. Every novel agentic threat reduces to one or more of these.[^3]

---

## Part II — The Seven Layers, with threats and controls

This part is the catalog. For each layer: definition, top threats with OWASP ASI codes and MITRE ATLAS AML.T-codes where they apply, MAESTRO threat IDs from the OpenClaw and TITO analyses, control patterns, and which framework owns the mitigation.

### Layer 1 — Foundation Models

**Scope.** Pre-trained model artifacts, fine-tuning data, model registry entries, signed weights.

**Top threats.** LM-001 model exfiltration; AML.T0018 Manipulate AI Model (with sub-techniques Poison AI Model and Modify AI Model Architecture); AML.T0010.004 AI Supply Chain Compromise: Container Registry; OWASP ASI-04 Agentic Supply Chain Vulnerabilities.[^16][^25] The OpenClaw investigation observed AML.T0010 realized via supply-chain skill compromise — third-party "skills" running with full agent privileges and writing directly to persistent memory without sandboxing.[^17][^26]

**Controls.** Model registry with signed manifests; SLSA L3 supply-chain integrity (AAGATE control loop 1); Cosign verification; AICM Domain MOD (Model Lifecycle).[^7][^14] Microsoft's Agent Governance Toolkit calls this Plugin signing with Ed25519 + manifest verification.[^27][^28]

### Layer 2 — Data Operations

**Scope.** Training corpora, retrieval indices, embeddings, persistent memory (episodic + semantic), context windows.

**Top threats.** DO-003 data poisoning; AML.T0080 AI Agent Context Poisoning, with sub-techniques AML.T0080.001 Memory and AML.T0080.002 Thread; AML.T0083 RAG Credential Harvesting; OWASP ASI-06 Memory & Context Poisoning (named real incident: Gemini Memory Attack).[^4][^16][^25] The CoSAI MCP Security paper formalizes the same threat under category T1–T2 in its taxonomy, and the Agentic IAM paper notes that MCP-context threats correspond directly.[^11][^13]

**Controls.** Validation grounding before agent consumption; coordinating proxy with filters and integrity checks (AWS Prescriptive Guidance pattern for shared memory); AAGATE Tool-Gateway sanitization; Microsoft AGT Cross-Model Verification Kernel (CMVK) with majority voting for memory poisoning specifically.[^28][^29] Microsoft AGT names this episodic memory with integrity checks; the AICM domain is DAT (Data).[^7][^27]

### Layer 3 — Agent Frameworks

**Scope.** LangChain, CrewAI, AutoGen, OpenAI Agents SDK, Microsoft Agent Framework, Google ADK; the orchestration runtime that calls models and tools.

**Top threats.** AF-002 framework injection; OWASP ASI-01 Agent Goal Hijack (named incident: EchoLeak); ASI-02 Tool Misuse (named incident: Amazon Q); ASI-04 Agentic Supply Chain Vulnerabilities (named incident: GitHub MCP exploit); ASI-05 Unexpected Code Execution (named incident: AutoGPT RCE).[^4][^5] On the adversarial side, AML.T0086 Exfiltration via AI Agent Tool Invocation, AML.T0011.003 Malicious Link, and AML.T0079 Stage Capabilities.[^16]

**Controls.** Capability sandboxing; MCP gateway with policy enforcement (CoSAI recommendation: do not pass through OAuth tokens; use RFC 8693 token exchange producing scoped tokens with auditable exchange records); AAGATE Tool-Gateway as single auditable egress; Microsoft AGT Agent OS as sub-millisecond policy engine with YAML, OPA/Rego, and Cedar support.[^11][^13][^14][^27] AICM domains: APP (Application), GTW (Gateway).

### Layer 4 — Deployment Infrastructure

**Scope.** Container runtimes, sandboxes, service mesh, network controls, ingress/egress, serverless runtimes.

**Top threats.** DI-001 sandbox escape; AML.T0105 Escape to Host (added in ATLAS v5.4.0); AML.T0107 Exploitation for Defense Evasion; AML.T0106 Exploitation for Credential Access.[^16] The OpenClaw 1-Click RCE (CVE-2026-25253, February 1, 2026) realized exactly this chain: a malicious link triggered Cross-Site WebSocket Hijacking against the local Gateway API, which exfiltrated tokens, modified agent configuration to disable user confirmation, escaped the Docker sandbox, and ran shell commands directly on the host.[^17][^26]

**Controls.** Kubernetes resource quotas; Istio mTLS for inter-service authentication; Cilium eBPF mesh for egress control; AAGATE service-mesh integration with millisecond Istio AuthorizationPolicy kill switch.[^14][^15] AICM domain INF (Infrastructure).[^7] The AWS Prescriptive Guidance system-design recommendations — disparate-worker over super-agent, session isolation per OWASP Session Management Cheat Sheet — are Layer 4 hygiene that prevents Layer 4 threats from compounding.[^29][^30]

### Layer 5 — Evaluation & Observability

**Scope.** Metrics, traces, evaluation harnesses, drift detection, anomaly classification, SLO enforcement.

**Top threats.** Silent drift; eval gaming; AML.T0087 Discover AI Agent Configuration with sub-techniques Embedded Knowledge, Tool Definitions, Activation Triggers, and (in v5.5.0) Call Chains.[^16] The Gemini Memory Attack and the EchoLeak case from OWASP both depended on Layer 5 visibility gaps that prevented the operating team from seeing the drift in time to react.[^4]

**Controls.** OWASP AIVSS scoring (the AI-Vulnerability Scoring System feeding into AAGATE ComplianceAgent decisions); SEI Stakeholder-Specific Vulnerability Categorization (SSVC) producing AAGATE GOA decision-tree responses; OpenTelemetry GenAI Semantic Conventions for traceable tool calls and inference spans; UEBA (User and Entity Behavior Analytics) with Qdrant + Kafka for behavior fingerprinting.[^14][^15] AICM domain LOG (Logging & Monitoring).[^7]

### Layer 6 — Security & Compliance

**Scope.** Identity, authorization, secrets, audit, regulatory mapping.

**Top threats.** OWASP ASI-03 Identity & Privilege Abuse; ASI-09 Human-Agent Trust Exploitation; AML.T0081 Modify AI Agent Configuration; AML.T0082 Credentials from AI Agent Configuration; AML.T0084 AI Agent Tool Credential Harvesting.[^4][^16] OpenClaw demonstrated the chain: token theft via WebSocket → privilege configuration modification → sandbox escape → root-level credential access.[^17]

**Controls.** SPIFFE/SVID workload identity carried through the execution chain as the subject or actor in token exchange flows (CoSAI Agentic IAM specification); DIDs (Decentralized Identifiers) bound to code+model via signed manifests so attestation fails on swap (a distinguishing property of agentic IAM versus conventional service-account management); RFC 8693 token exchange with scope narrowing at each hop; immutable audit logs; fail-closed enforcement gateways for high-capability agents with explicit degradation paths (revert to human-in-the-loop or halt).[^12][^13] AAGATE Agent Name Service (ANS) implements the registration and authentication; AICM domains IAM, AUD.[^7][^14] Microsoft AGT AgentMesh adds Ed25519 + ML-DSA-65 (post-quantum) credentials with trust scoring 0–1000 and an Inter-Agent Trust Protocol (IATP) encryption layer.[^27][^28]

### Layer 7 — Agent Ecosystem

**Scope.** Multi-agent collaboration, marketplaces, A2A communication, delegation chains, emergent behavior.

**Top threats.** AE-004 Multi-Agent Collusion; OWASP ASI-07 Insecure Inter-Agent Communication; ASI-08 Cascading Failures; ASI-10 Rogue Agents (named incident: Replit meltdown).[^4][^23] The OpenClaw MAESTRO analysis explicitly identifies AE-004 as the layer where chained threats from Layers 1–6 manifest as ecosystem-level harm.[^23]

**Controls.** Janus Shadow-Monitor Agent (AAGATE) for in-loop pre-execution behavioral evaluation; Inter-Agent Trust Protocol (Microsoft AGT) for encrypted inter-agent channels with trust gates; Agent Name Service (AAGATE) maintaining a real-time, cryptographically verifiable map of agent identities and capabilities; ETHOS Ledger Hooks for tamper-proof, on-chain governance event proofs; ZK-Prover with Groth16 proofs for privacy-preserving compliance assurance.[^14][^15][^27] AICM domains include ECO (Ecosystem) and SUP (Supply Chain).[^7]

> ### Quotable Findings II — Cross-layer threats are where the framework earns its keep
>
> 1. **Most damaging real incidents cross multiple layers.** OpenClaw 1-Click RCE chained Layer 3 (malicious link), Layer 6 (token theft), Layer 6 (config modification), Layer 4 (sandbox escape), Layer 4 (host RCE). A pure Layer-3 threat model misses four of those five.[^17][^26]
>
> 2. **EchoLeak and Amazon Q named-incidents share the same shape.** Layer 3 goal hijack triggered by Layer 2 context poisoning, exfiltrating via Layer 4 egress. ASI-01 + ASI-06 + ASI-02 are the OWASP triple. MAESTRO's Cross-Layer Threat Identification step is the only one that surfaces it pre-deployment.[^4][^5]
>
> 3. **The agentic AML.T0080–T0107 cluster did not exist before ATLAS v5.4.0 (February 5, 2026).** Practitioners working from any earlier ATLAS version will undercount their threat surface by approximately the entire agentic catalog.[^16]

---

## Part III — The five-framework stack: how they interlock

The most common mistake in 2026 agentic security is treating MAESTRO, OWASP, NIST, AICM, AWS Scope, and ATLAS as competing standards forcing a choice. They do not compete. Each occupies a different cell in a matrix, and a complete production threat model touches all of them.

### MAESTRO as the spine

MAESTRO answers a single question: **where in the system can the threat manifest?** The seven layers are coordinates. Once you know the layer, every other framework slots in: OWASP supplies the threat name, AICM supplies the control, NIST supplies the governance language, ATLAS supplies the adversarial TTP, and AWS Scope supplies the budget for instrumentation.

This is why MAESTRO Step 2 (Layer-Specific Threat Modeling) and Step 3 (Cross-Layer Threat Identification) are the load-bearing steps. The other five frameworks plug in here.

### OWASP Top 10 for Agentic Applications as the threat catalog

OWASP's December 9, 2025 release is the canonical threat name dictionary.[^4] Each ASI entry lists a known incident: ASI-01 Agent Goal Hijack (EchoLeak); ASI-02 Tool Misuse (Amazon Q); ASI-03 Identity & Privilege Abuse; ASI-04 Agentic Supply Chain Vulnerabilities (GitHub MCP exploit); ASI-05 Unexpected Code Execution (AutoGPT RCE); ASI-06 Memory & Context Poisoning (Gemini Memory Attack); ASI-07 Insecure Inter-Agent Communication; ASI-08 Cascading Failures; ASI-09 Human-Agent Trust Exploitation; ASI-10 Rogue Agents (Replit meltdown).[^4][^5] The release was driven by John Sotiropoulos with over 100 contributing security researchers and Steve Wilson (OWASP GenAI Board Co-Chair) as sponsor; the project's complementary Threats and Mitigations document carries T-codes T1–T15 (Memory Poisoning, Tool Misuse including Agent Hijacking, Privilege Compromise, Resource Overload, Overwhelming Human-in-Loop) that map onto ASI entries at finer granularity.[^31][^32] AI-VSS scoring is the standard severity metric across both.[^4]

### NIST AI 600-1 plus the AI RMF Agentic Profile

NIST AI 600-1 — the GenAI Profile of the AI RMF — organizes 12 risk categories applicable to GenAI deployment.[^6] On its own, the profile is generic to any GenAI system. The Cloud Security Alliance's NIST AI RMF Agentic Profile (April 2, 2026) adds the agentic-specific extensions: AG-MG.2 behavioral drift detection; AG-MS.3 delegation chain integrity monitoring; AG-MP.1 Agent Tool Risk Classification.[^24] These extensions are deliberately structured to align with AICM's 243 controls and with AAGATE's runtime architecture, and CSA explicitly states that organizations implementing AAGATE will satisfy the technical requirements of the proposed extensions.[^24]

### CSA AICM v1.0 plus the Agentic Trust Framework

CSA's AI Controls Matrix v1.0 (July 2025) provides 243 controls organized into 18 domains.[^7] It is the control catalog: when MAESTRO identifies a threat at Layer 3, AICM domain APP and GTW supply the candidate controls. The Agentic Trust Framework (February 2, 2026, with a foreword from John Kindervag) supplies the policy language and zero-trust application patterns.[^8] Together, AICM and ATF answer the question MAESTRO does not: **what control mitigates the threat?**

### AWS Agentic AI Security Scoping Matrix

The AWS Scoping Matrix (November 21, 2025) is the budget allocator.[^9][^10] It bins systems by **agency level**, not by threat:

- **Scope 1: No Agency.** Read-only. Agents return information and recommendations but cannot mutate external state. Security focus: identity context, workflow integrity, input validation, boundary enforcement.[^9]
- **Scope 2: Prescribed Agency.** Agents propose actions; humans approve via mandatory HITL workflows.[^10]
- **Scope 3: Supervised Agency.** Agents execute autonomously within bounded parameters, can request guidance for edge cases, and operate without further approval once activated. Security focus shifts to continuous monitoring, behavioral validation, and effective shut-off switches.[^9]
- **Scope 4: Full Agency.** Self-initiating systems operating continuously with minimal human oversight, making independent decisions about when and how to act. Highest risk; requires advanced behavioral monitoring, anomaly detection, automated containment.[^9][^10][^47]

Six security dimensions span all four scopes: Identity Context, Data/Memory/State Protection, Audit & Logging, Agent & LLM Controls, Agency Perimeters & Policies, Orchestration.[^9] The dimensions are constant; their *intensity* increases with scope. A Scope 1 agent might satisfy "Audit & Logging" with HTTP access logs; a Scope 4 agent needs immutable cryptographically-hashed tool-call logs feeding UEBA.

The AWS Scope determines how far down the MAESTRO catalog you need to instrument. Most enterprises operate at Scope 2 or 3; only research labs and high-frequency trading desks operate Scope 4.

### MITRE ATLAS as the adversarial lens

MITRE ATLAS v5.4.0 (February 5, 2026) is where threats become reproducible TTPs.[^16] Version 5.1.0 contained 1 matrix, 16 tactics, 84 techniques, 56 sub-techniques, 32 mitigations, 42 case studies; v5.4.0 added the agentic AML.T0080–T0107 cluster including Publish Poisoned AI Agent Tool, Escape to Host (T0105), Exploitation for Credential Access (T0106), Exploitation for Defense Evasion (T0107), AI Agent (T0080 base), User Execution: Poisoned AI Agent Tool, and Malicious Link (T0011.003). v5.5.0 (April 30, 2026) added AI Supply Chain Rug Pull, Cost Harvesting (Excessive Queries / Resource-Intensive Queries / Agentic Resource Consumption), Discover AI Agent Configuration: Call Chains, and Acquire Infrastructure: AI Service Proxies.[^16] The v5.4.0 release also coincided with new agentic case studies: Exposed ClawdBot Control Interfaces Leads to Credential Access and Execution; Supply Chain Compromise via Poisoned ClawdBot Skill; OpenClaw 1-Click Remote Code Execution; OpenClaw Command & Control via Prompt Injection.[^16]

### The interlock matrix

The five-framework stack reduces to a six-column lookup table per threat:

| MAESTRO Layer | OWASP ASI | AICM Domain | NIST RMF Function | AWS Scope dimension | ATLAS Tactic |
|---|---|---|---|---|---|
| L1 Foundation Models | ASI-04 | MOD | Map | Identity Context | AML.TA0007 (Persistence) |
| L2 Data Operations | ASI-06 | DAT | Measure | Data/Memory/State | AML.TA0007 (Persistence) |
| L3 Agent Frameworks | ASI-01, ASI-02, ASI-04, ASI-05 | APP, GTW | Manage | Agent & LLM Controls | AML.TA0010 (Exfiltration) |
| L4 Deployment Infra | (cross-cutting) | INF | Manage | Agency Perimeters & Policies | AML.TA0004 (Privilege Escalation) |
| L5 Eval & Observability | (cross-cutting) | LOG | Measure | Audit & Logging | AML.TA0011 (Discovery) |
| L6 Security & Compliance | ASI-03, ASI-09 | IAM, AUD | Govern | Identity Context | AML.TA0006 (Credential Access) |
| L7 Agent Ecosystem | ASI-07, ASI-08, ASI-10 | ECO, SUP | Govern | Orchestration | AML.TA0014 (Command and Control) |

This is the productive way to read the stack: MAESTRO is the row, the others are the columns. A threat-modeling workshop walks the rows; a compliance audit walks the columns.

> ### Quotable Findings III — Five frameworks, one threat model
>
> 1. **MAESTRO answers "where," OWASP answers "what," AICM answers "how to mitigate," NIST answers "how to govern," AWS Scope answers "how aggressively," ATLAS answers "how the adversary actually does it."** Six different questions; six different frameworks; one matrix.[^2][^4][^7][^9][^16]
>
> 2. **The CSA NIST AI RMF Agentic Profile (April 2, 2026) is the regulatory bridge.** Its AG-MG.2 / AG-MS.3 / AG-MP.1 extensions translate behavioral drift, delegation chain integrity, and tool risk classification into NIST RMF subcategories — making MAESTRO addressable by compliance teams that only speak NIST.[^24]
>
> 3. **AWS Scope 1–4 is a budget allocator, not a maturity ladder.** Most enterprises sit at Scope 2 (HITL) or Scope 3 (supervised autonomy). Treating Scope 4 as an aspirational target is the failure mode that produces over-engineered controls in low-risk pilots.[^9][^10]

---

## Part IV — Runtime instantiation: AAGATE as MAESTRO's operational arm

A threat model without an enforcement plane is a wall poster. AAGATE — the Agentic AI Governance Assurance & Trust Engine, published by CSA on December 22, 2025, with arXiv preprint 2510.25863 — is the canonical Kubernetes-native instantiation that turns MAESTRO Map into Manage.[^14][^15] Its eight components map directly onto MAESTRO's seven layers; its seven continuous control loops translate the framework's mitigation step into runtime policy enforcement.

### Why AAGATE matters for MAESTRO practitioners

MAESTRO's value as a methodology is highest at design time. AAGATE's value is highest at runtime. The two together close the loop: design decisions made during MAESTRO Layer-Specific Threat Modeling become Rego policies enforced by AAGATE's Tool-Gateway and Janus SMA at machine speed.[^14][^15] The arXiv preprint frames this directly: AAGATE operationalizes NIST AI RMF by integrating MAESTRO for Map, OWASP AIVSS plus SEI SSVC for Measure, and the CSA Agentic AI Red Teaming Guide for Manage.[^15]

### Component-by-component mapping

Eight components, mapped to MAESTRO layers:

- **Governing-Orchestrator Agent (GOA).** The system brain. Receives telemetry from all other components, classifies events via SEI SSVC decision-tree logic, and enforces a millisecond kill-switch via interconnection with the Tool-Gateway and Istio mTLS egress controller.[^14][^15] Maps to MAESTRO Layer 6 + AICM Risk Management domain.
- **ComplianceAgent.** Continuously evaluates security signals using OWASP AIVSS scoring and OPA + Rego policy logic.[^14] Maps to MAESTRO Layer 5 (Evaluation).
- **Janus Shadow-Monitor Agent (SMA).** Acts as an embedded internal red team, re-evaluating each agent action *before* execution. The "Janus" metaphor — two-faced — is operative: it observes both what the agent is about to do and the likely consequences.[^14][^15] Maps to MAESTRO Layer 7 + mitigation for AML.T0080 Context Poisoning. Continuous, automated internal red teaming replaces periodic, manual red teaming.
- **Tool-Gateway Chokepoint.** Funnels every external API call, DB operation, and file access through one auditable proxy. All requests cryptographically hashed and logged; mesh-level egress-deny except for the Gateway; GOA audits for bypass attempts and quarantines offenders.[^14][^15] Maps to MAESTRO Layer 3 + mitigation for ASI-02 Tool Misuse and AML.T0086 Exfiltration via AI Agent Tool Invocation.
- **Agent Name Service (ANS).** Registers and authenticates every agent through verifiable credentials — DIDs plus SPIFFE.[^14] Maps to MAESTRO Layer 6 + mitigation for ASI-03 Identity & Privilege Abuse.
- **Istio mTLS plus Cilium eBPF mesh.** Enforces zero-trust communication and observability at the network layer. The Istio AuthorizationPolicy is the actual mechanism by which the millisecond kill switch terminates an agent's network access.[^14][^15] Maps to MAESTRO Layer 4 + mitigation for ASI-07 Insecure Inter-Agent Communication and AML.T0105 Escape to Host.
- **Qdrant + UEBA + Kafka pipeline.** Behavioral analytics and continuous risk telemetry feeding AAGATE's behavior fingerprints and risk models.[^14] Maps to MAESTRO Layer 5.
- **ETHOS Ledger Hooks.** Optional blockchain layer for decentralized accountability and tamper-proof compliance proofs; ZK-Prover with Groth16 proofs supports privacy-preserving compliance assurance, AgentRegistry smart contracts maintain agent lineage, and event-driven Kafka+Redis pipelines feed local Ollama LLM hosting for low-latency policy decisions.[^14][^15][^48] Maps to MAESTRO Layer 6 + AICM AUD domain.

### The seven continuous control loops

AAGATE's runtime correctness is enforced by seven loops that run continuously, mirroring runtime observability:[^14]

1. **Supply-Chain Integrity Enforcement** — signed OCI images, SBOM tracking, Cosign verification.
2. **Identity & Provenance Validation** — agent DIDs mapped to verifiable credentials through ANS.
3. **Policy Translation & Enforcement** — natural-language EU AI Act and Colorado AI Act clauses compiled into Rego for machine-readable execution.
4. **Behavioral Telemetry Scoring** — AIVSS metrics and UEBA behavior fingerprints feed risk models.
5. **Autonomous Red-Team Loop** — Janus SMA simulates adversarial scenarios pre-execution.
6. **Millisecond Containment Switch** — instant isolation via Istio AuthorizationPolicy.
7. **Ledger Audit Trail** — on-chain proofs of compliance and lifecycle events.

These map to MAESTRO Step 6 (Implementation + Monitoring) and to NIST RMF's Manage function.[^14][^24]

### Microsoft Agent Governance Toolkit as Microsoft-stack alternative

For organizations standardized on Microsoft, AAGATE has a counterpart with the same shape but a different stack: the Microsoft Agent Governance Toolkit, open-sourced under MIT license on April 2, 2026.[^27][^28] AGT covers all 10 OWASP Agentic risks (ASI-01 through ASI-10) with deterministic, sub-millisecond policy enforcement at p99 latency, and ships seven components mapping closely onto AAGATE's eight: Agent OS (policy engine — YAML, OPA/Rego, Cedar), AgentMesh (zero-trust identity — Ed25519 + ML-DSA-65 post-quantum, SPIFFE/SVID, trust scoring 0–1000), Agent Runtime (privilege rings, saga orchestration, termination control), Agent SRE (SLOs, error budgets, chaos engineering, circuit breakers), Agent Compliance (OWASP verification, integrity checks, policy linting), Agent Discovery (shadow AI inventory and risk scoring), Agent Hypervisor (reversibility verification), Agent Marketplace (plugin lifecycle), and Agent Lightning (RL training governance).[^27][^28] As of v3.5.0 (May 8, 2026) the project carries 1,449 stars, 80 contributors, and over 13,000 tests, and integrates with AWS Bedrock, Google ADK, Azure AI, LangChain, CrewAI, AutoGen, and OpenAI Agents through framework-native extension points (LangChain callback handlers, CrewAI task decorators, Google ADK plugin system, Microsoft Agent Framework middleware).[^27]

CSO Online's analysis (April 8, 2026) summarizes the deployment thesis: AGT is "the first toolkit to address all 10 OWASP agentic AI risks with deterministic, sub-millisecond policy enforcement," and Microsoft has signaled an intent to transition the project to a foundation-led model.[^33][^28] Microsoft Agent 365 (GA May 1, 2026) extends this further with Defender + Intune for local agent discovery (covering OpenClaw, GitHub Copilot CLI, Claude Code) plus Entra network controls extended to Copilot Studio agents.[^34]

---

## Part V — Companion overlays: CoSAI, ATLAS, and the gateway scanner layer

AAGATE and Microsoft AGT are the heavy-machinery instantiations. Three lighter, scope-defined overlays specialize on specific problems MAESTRO Layer 3 and Layer 6 cannot address with general-purpose runtime tooling alone.

### CoSAI MCP Security paper

The Coalition for Secure AI — an OASIS Open Project — published its Model Context Protocol Security white paper on January 8, 2026, with formal release on January 27, 2026.[^11][^35] The paper introduces twelve threat categories and approximately forty threats across the MCP attack surface, distinguishing between traditional security threats *amplified* by AI/MCP and genuinely *novel* attack vectors.[^11] It covers the June 2025-06-18 transport spec, threat modeling strategies for MCP-based agentic systems, supply-chain security for MCP servers and tools, IAM challenges in MCP-consuming architectures, and recommendations for protocol enhancements.[^11] The paper is deliberately positioned to coordinate with CoSAI's Software Supply Chain Security workstream rather than supersede it, and it explicitly cites Anthropic and the MCP maintainer community as collaborators.[^11]

For MAESTRO practitioners, the paper's most actionable contribution is its T1–T2 categorical decomposition of MCP-context threats — these correspond directly to MAESTRO Layer 2 (Data Operations) and Layer 3 (Agent Frameworks) on the threat model.[^13]

### CoSAI Agentic Identity and Access Management paper

The companion paper, Agentic Identity and Access Management, was approved by the CoSAI Technical Steering Committee on March 20, 2026, and announced publicly on April 17, 2026.[^12][^13][^36] Its central claim: organizations do not need to build separate, parallel security infrastructure for AI agents. The identity providers, OAuth/OIDC servers, policy engines, secrets-management platforms, and audit logging pipelines already in place can serve as the foundation, *extended* rather than replaced, to handle non-human principals, delegation chains, and richer context.[^36]

The paper's nine core principles cluster into four operative ones for Layer 6 threat modeling:

1. **Identity bound to code and model.** Agent credentials are tied not just to a name in a registry but to the specific version of code and model the agent is running, verified through a signed manifest. If the model is swapped or the code is altered, attestation fails and the agent is blocked from high-impact actions. This binding is the property that distinguishes agentic IAM from conventional service-account management.[^36]

2. **Delegation with full lineage.** When an agent acts on behalf of a human user, it carries an on-behalf-of (OBO) token containing both the agent's identity and the user's identity. At each hop in a multi-agent workflow, scope narrows — never expands. If a delegation is revoked at any point in the chain, all downstream delegations are automatically invalidated.[^36]

3. **Continuous authorization.** Access is not a one-time decision made at login. For autonomous agents operating in dynamic environments, authorization is continuously re-evaluated based on current context: what the agent is doing, what risk signals the system is observing, whether anything has changed since the last check.[^36]

4. **Enforcement at every hop.** MCP servers, API gateways, and service meshes serve as policy-enforcement boundaries. Each one terminates and validates agent tokens, evaluates policy per request, and forwards only scoped credentials downstream — never raw upstream tokens. An agent that clears a perimeter gateway and then operates unchecked across internal systems is not a secured agent.[^36]

The paper specifies a three-phase adoption model — Visibility → Contextual access → Full Agentic IAM — and an end-to-end invoice-processing example traces a single agent from deployment through identity assignment, delegation, authorization, logging, and incident response.[^12][^36] After RSAC 2026, CoSAI clarified the operative implementation patterns: SPIFFE/SPIRE for workload-level identity carried through token exchange flows; RFC 8693 for token exchange (the explicit guidance is to *never* pass through user OAuth tokens); fail-closed enforcement gateways for high-capability agents with defined degradation paths (revert to human-in-the-loop or halt entirely).[^37]

### MITRE ATLAS as the adversarial lens

The MITRE ATLAS knowledge base supplies what no policy framework can: real-world adversary TTPs against AI/ML systems.[^16] The OpenClaw 1-Click RCE case study (AML.CS0050, February 1, 2026) traces a complete attack chain through ATLAS techniques: Develop Capabilities (AML.T0017) → Stage Capabilities (AML.T0079) → Malicious Link (AML.T0011.003) → Exploitation for Credential Access (AML.T0106) via Cross-Site WebSocket Hijacking on localhost → Exploitation for Defense Evasion (AML.T0107) → Valid Accounts (AML.T0012) → Modify AI Agent Configuration (AML.T0081) → Escape to Host (AML.T0105) → Command and Scripting Interpreter (AML.T0050).[^17][^26][^38] The MITRE Center for Threat-Informed Defense framed this case study as the canonical agentic kill chain — the first chained, public agentic exploit reproducible in a research environment.[^39]

MITRE's published mitigations against this chain — Generative AI Guardrails, Restrict AI Agent Tool Invocation on Untrusted Data, AI Agent Tool Permissions Configuration, Privileged AI Agent Permissions Configuration, Single-User AI Agent Permissions Configuration, AI Telemetry Logging, Memory Hardening, Segmentation of AI Agent Components — slot directly onto MAESTRO layers 3, 4, 5, and 6.[^17][^26]

### Bot detection at Layer 3 ingress

A single Layer 3 control merits explicit callout. When an LLM cannot reliably distinguish a human from a bot, the gateway must. Vercel's BotID (GA June 2025) and equivalents at Cloudflare and Fastly enforce verification at the ingress before the agent's reasoning loop begins.[^40] In the OpenClaw kill chain, the malicious link delivered a JavaScript payload to the victim's browser; an enforced bot-detection gate at the upstream forwarder would have prevented the chain from initiating. This is a Layer 3 control with Layer 4 dependencies — and it is the kind of control AAGATE's Tool-Gateway Chokepoint generalizes for outbound side-effect actions.

> ### Quotable Findings IV — Frameworks at runtime
>
> 1. **CoSAI's most important claim is that you do not need parallel infrastructure.** Existing OAuth/OIDC, policy engines, secrets management, and audit pipelines extend to handle agents — they do not need replacement.[^12][^36]
>
> 2. **The OpenClaw kill chain is reproducible.** Nine ATLAS techniques chained end to end, documented in AML.CS0050 with CVE-2026-25253. Practitioners can use it as a red-team baseline.[^17][^38]
>
> 3. **"Enforcement at every hop" replaces "perimeter gateway."** An agent that clears a perimeter and then operates unchecked across internal systems is not secured. Service mesh + gateway + MCP server each terminate, validate, and rescope.[^36][^37]

---

## Part VI — Production playbook: from threat model to deployable controls

The five-framework stack is useful only if practitioners can run it end to end on a real system. This part is the procedural translation: a six-step methodology derived from MAESTRO, applied across three deployment archetypes that span the AWS Scope range.

### The six-step procedure

**Step 1 — System Decomposition.** Enumerate every agent, model, tool, and trust boundary. The AWS Prescriptive Guidance system-design recommendation favors the **disparate-worker pattern** over the super-agent pattern for risk reduction: smaller exposure surface per agent, narrower entitlements, easier observability, contained blast radius if a single agent is compromised.[^29] Document shared memory resources explicitly — they are partially trusted components requiring a coordinating proxy with filters and integrity checks before any agent acts on retrieved information.[^29]

**Step 2 — Layer-Specific Threat Modeling.** For each of the seven MAESTRO layers, enumerate threats with ASI codes (OWASP), AML T-codes (ATLAS), and explicit threat IDs from the OpenClaw and TITO analyses. Assign one control owner per layer — typically platform security for Layers 1, 4, and 6; ML platform team for Layers 2 and 5; agent platform team for Layers 3 and 7.[^21][^23]

**Step 3 — Cross-Layer Threat Identification.** This is where MAESTRO outperforms STRIDE+ adaptations. Walk every chained attack path you can imagine, not just single-layer compromises. The OpenClaw analysis showed Infrastructure → Data → Model → Ecosystem chains as the modal damaging pattern; the OWASP named incidents (EchoLeak, Amazon Q, Replit meltdown) follow similar topology.[^4][^17][^23]

**Step 4 — Risk Assessment.** Score each threat with OWASP AIVSS for the AI-specific severity dimensions and SEI SSVC for the stakeholder-specific categorization. Allocate the resulting prioritized list against the AWS Scope of the system: Scope 1 systems may safely de-prioritize Layer 7 emergent threats; Scope 4 systems must instrument every layer aggressively.[^9][^15]

**Step 5 — Mitigation Planning.** Pick controls from the candidate set: AICM 18 domains × 243 controls; CoSAI Agentic IAM patterns for Layer 6; AAGATE components for runtime; Microsoft AGT modules for the Microsoft stack.[^7][^14][^27][^36] Map each chosen control back to the threat IDs it addresses, the framework that names it, and the AWS Scope dimension it satisfies.

**Step 6 — Implementation + Monitoring.** Steven Leath's TITO scanner walks Layers 1–3 in CI/CD, catching supply-chain, model-registry, and framework-injection threats before deployment.[^21] Layers 4–7 require runtime signals: UEBA behavior fingerprints, the millisecond Istio AuthorizationPolicy kill switch, the ledger audit trail. Continuous, not periodic.[^14][^15]

### Archetype A — A2A multi-agent deployment

Google's Agent-to-Agent protocol case study (CSA, April 30, 2025) supplied the canonical mapping: A2A primarily resides at MAESTRO Layer 3 but interacts with Layers 1 (foundation models referenced by participating agents), 2 (shared context exchanged between agents), 5 (observability across agent boundaries), and 6 (identity and policy at the gateway). Layer 4 is always relevant; Layer 7 is critical.[^22]

**Top threats:** ASI-07 Insecure Inter-Agent Communication, ASI-08 Cascading Failures, AML.T0086 Exfiltration via AI Agent Tool Invocation cross-agent.

**Production controls:** AAGATE Agent Name Service for cryptographically-verifiable agent identity (DIDs + SPIFFE); IATP encryption layer (Microsoft AGT) or Istio mTLS (AAGATE) for inter-agent transport; Janus SMA pre-execution evaluation at every hop.[^14][^15][^27]

**AWS Scope:** typically 3 (supervised) for production deployments; pilots may operate at Scope 2.

### Archetype B — Local autonomous agent (OpenClaw-class)

The OpenClaw class of agent runs on a user's own device with full filesystem, credential, and network reach. The CVE-2026-25253 1-Click RCE exposed the failure mode: a single agent handling untrusted input ingestion *and* high-privilege action execution, sharing memory access across the boundary.[^17][^26]

**Top threats:** the full OpenClaw kill chain (AML.T0011.003 Malicious Link → AML.T0106 Credential Access → AML.T0107 Defense Evasion → AML.T0081 Modify AI Agent Configuration → AML.T0105 Escape to Host).

**Production controls:** Single-User AI Agent Permissions Configuration; Privileged AI Agent Permissions Configuration; Sandboxing Gateway controls; AI Agent Tool Permissions Configuration; AI Telemetry Logging with Memory Hardening; Segmentation of AI Agent Components.[^17][^26] Microsoft Agent 365 (Defender + Intune) provides discovery and policy for OpenClaw and other local agents (also covers GitHub Copilot CLI and Claude Code).[^34]

**AWS Scope:** functionally Scope 4 by default — the agent self-initiates tasks on the local environment — but compensating controls (mandatory user confirmation gates, explicit allowlists for tool invocations) can move it back toward Scope 2 behavior.

### Archetype C — Regulated financial-services back office

The financial-services archetype concentrates on Layer 6 (compliance, audit, identity) and Layer 5 (observability for auditor review). The BCG analysis of retail-banking agentic deployment names the operative architecture: an in-house **middleware layer** as a standardized control plane for all AI workloads.[^41] The middleware enforces software-development standards, AuthN/AuthZ, MRM (model risk management), and compliance uniformly — a single front door through which all AI applications must pass — and provides the centralized place to capture standardized logs, usage metadata, and decision traces.[^41]

Bank of America's published case study supplies the scale parameters: Erica was launched in 2018 as a small in-house language model; by 2025 the AI initiative was a $4 billion annual program with 20.6 million Erica users and approximately 700 million Erica interactions in 2025 alone (cumulative since launch: 3.2 billion).[^42][^43] Operational gains: 50%+ reduction in IT service-desk calls, 20% developer productivity gain, 98% containment in Erica interactions, 23 million askMerrill/askPrivateBank interactions in 2024, and the largest AI/ML patent portfolio in US financial services.[^42][^44]

Deloitte's analysis of agentic banking risk surfaces the supplementary controls needed to operate at this scale safely: defined roles spanning the agent lifecycle (agent owner, validator, steward); cross-functional governance across risk, compliance, cybersecurity; activity logs with escalation triggers and embedded fail-safes; **guardian agents** for continuous oversight, monitoring agentic behavior in real time and flagging anomalies, policy violations, and ambiguous decisions; human-on-the-loop models with AI agent observability.[^45] The "regulatory adapter layer" pattern — disclosures and content provenance activated per region, product, or channel — addresses anticipated EU AI Act and Colorado AI Act requirements.[^45][^28]

For agentic AI in healthcare, Aptible's HIPAA chapter applies the same Layer 6 thinking specifically to PHI: agent tool calls touching PHI are auditable events under HIPAA 45 CFR 164.312(b); the framework's logged LLM input/output is not sufficient — tool calls themselves must be first-class auditable events with user attribution, timestamp, and structured metadata; BAA coverage applies to each tool endpoint individually; agent logs containing patient data are themselves PHI and must be encrypted at rest, access-controlled, and retained per the organization's PHI retention policy.[^46]

**Top threats:** ASI-03 Identity & Privilege Abuse; ASI-09 Human-Agent Trust Exploitation (rubber-stamping in HITL); ASI-08 Cascading Failures during high-volume workflows.

**Production controls:** middleware control plane with kill switches, replayable traces, MRM/compliance enforcement at the front door; SPIFFE/SVID identity with delegation lineage; CoSAI Agentic IAM Phase 2 controls (short-lived tokens, attribute-based policy, no standing privilege for high-risk agents); Microsoft AGT compliance grading for HIPAA/SOC2/EU AI Act mapping.[^28][^36][^45]

**AWS Scope:** typically Scope 2 (HITL) for customer-facing actions; Scope 3 (supervised) for back-office routine tasks; rarely Scope 4 except for trade-execution desks with separate dedicated controls.

> ### Quotable Findings V — From threat model to runtime
>
> 1. **Disparate-worker beats super-agent in production.** Smaller exposure per agent, narrower entitlements, contained blast radius. AWS Prescriptive Guidance is explicit on this.[^29]
>
> 2. **Most enterprise deployments live at Scope 2 or 3.** Scope 4 is rare and usually wrong as an aspirational target. The failure mode is over-engineered controls in low-risk pilots.[^9][^10]
>
> 3. **Bank of America's Erica generated 700M interactions in 2025 alone.** 98% containment, 50%+ IT-desk-call reduction, 23M askMerrill/askPrivateBank interactions in 2024. The middleware-as-control-plane pattern is what makes this auditable.[^42][^43][^41]

---

## Part VII — Open questions and what 2027 looks like

### Convergence or layered evolution?

The first instinct in 2026 is that the proliferation of frameworks — MAESTRO, OWASP ASI, NIST AI 600-1, AICM, ATF, AWS Scoping Matrix, MITRE ATLAS, CoSAI MCP Security, CoSAI Agentic IAM, AAGATE, Microsoft AGT — must converge into one. It will not, and the reason is that their constituencies are different.

CSA owns the controls catalog (AICM) and the methodology (MAESTRO). OWASP owns the threat catalog. MITRE owns the adversarial TTP knowledge base. NIST owns the governance language. AWS owns the agency-scoping model. CoSAI owns MCP and IAM specifically. Each constituency has its own publication cadence, governance, peer-review process, and audience. They evolve in parallel because they answer different questions.

The bet for 2027 is that the *interlock matrix* gets standardized — a single canonical mapping that practitioners can rely on as the cross-reference table — but the underlying frameworks stay independent. The CSA NIST AI RMF Agentic Profile (April 2026) is the prototype for this kind of bridge document.[^24]

### Provenance as the next layer

The visible edge in 2026 is signed model manifests, ETHOS Ledger compliance proofs, and Groth16 zero-knowledge proofs of policy compliance.[^14][^15] The non-obvious next step is **agent bill of materials** — an SBOM-style artifact enumerating model + prompt + tools + memory snapshot at deployment time. The forcing function will be EU AI Act high-risk obligations (effective August 2026) and the Colorado AI Act (effective June 2026), both of which require traceability that today's deployment tooling does not produce by default.[^28][^45]

### What collapses in 2027

The "compliance-grading" pattern (Microsoft AGT, AAGATE ETHOS) gets standardized — practitioners stop building custom evidence-collection pipelines and start using framework-mapped automated grading.[^28] SPIFFE/SVID becomes the agent identity baseline, replacing custom service-account systems for non-human principals.[^36] MCP gets a hardened transport, with the CoSAI MCP Security threats surfaced in 2026 turning into protocol-level mitigations.[^11] MITRE ATLAS becomes the de facto incident taxonomy that security teams report incidents in, the same way ATT&CK became the standard for traditional security operations between 2018 and 2022.

### What this paper does not cover

Voice-first agents and telephony deployments are out of scope — the threat model is materially different and merits a separate treatment. Adversarial robustness research (red-teaming methodology, evaluation harnesses, jailbreak taxonomies) is a separate canon adjacent to but distinct from the threat-modeling stack covered here. Specific cloud-vendor stacks beyond the AWS Scoping Matrix and Microsoft Agent 365 — Google Cloud Agent Builder, Anthropic deployment patterns, Databricks AI agents — each deserve their own paper. Cost governance for autonomous agents (the AML.T0102/T0103/T0104 Cost Harvesting cluster added in ATLAS v5.5.0) is named here only briefly and warrants a separate operational treatment.[^16]

> ### Quotable Findings VI — What survives
>
> 1. **The interlock matrix is the artifact, not a single converged framework.** MAESTRO (where), OWASP (what), AICM (mitigation), NIST (governance), AWS Scope (intensity), ATLAS (adversarial). Treat each as an independent maintainer.[^2][^4][^7][^9][^16][^24]

> 2. **Agent SBOM is the 2027 forcing function.** EU AI Act August 2026 and Colorado AI Act June 2026 require traceability that current deployment tooling does not produce by default.[^28][^45]
>
> 3. **SPIFFE/SVID becomes the agent identity baseline.** CoSAI's "Agents are first-class identities" principle, combined with AAGATE's ANS implementation, sets the path. By 2027, custom agent IAM systems read as legacy.[^14][^36]

---

## Closing

MAESTRO is, in the end, deliberately boring. Its contribution is not a clever new threat or a novel cryptographic primitive. It is a place to stand. The seven layers organize the problem space well enough that other frameworks — OWASP for threats, MITRE ATLAS for adversaries, AICM for controls, NIST for governance, AWS for scope, CoSAI for MCP and IAM — can each plug in without colliding. The four claims of this paper restate that thesis in operational form.

First, MAESTRO is the modeling spine. Use it as the *Map* step inside NIST AI RMF; do not treat it as a competitor. Second, AAGATE — and Microsoft's Agent Governance Toolkit on the Microsoft stack — are the operational instantiations. Eight Kubernetes-native components (AAGATE) or seven Python/.NET/Rust components (AGT) turn paper threat models into runtime enforcement at sub-millisecond latency. Third, OWASP and MITRE ATLAS are the threat catalog, with the agentic AML.T0080–T0107 cluster added in ATLAS v5.4.0 as the canonical adversarial reference. Fourth, the AWS Scoping Matrix is the budget allocator — most production systems live at Scope 2 or 3, and treating Scope 4 as the default produces over-engineered controls in low-risk pilots.

The job of the practitioner in 2026 is not to invent a new framework. It is to maintain the interlock matrix — the cross-reference table that maps a threat at MAESTRO Layer 3 to the OWASP ASI entry, the ATLAS technique, the AICM control, the NIST RMF subcategory, and the AWS Scope dimension. The CSA NIST AI RMF Agentic Profile (April 2026) shows what a canonical bridge document looks like.[^24] The CoSAI Agentic IAM paper (March 2026) shows what a canonical control specification looks like.[^36] The OpenClaw investigation (February 2026) shows what a canonical kill chain looks like.[^17] By 2027, the matrix will be standardized; the constituent frameworks will not.

Until then, the practitioner's task is to walk MAESTRO's six steps end to end, lift each threat into the matrix, and pick the controls that match the system's AWS Scope. That is the production playbook.

---

## Glossary

**MAESTRO** — Multi-Agent Environment, Security, Threat, Risk, and Outcome. Seven-layer threat modeling framework published by CSA in February 2025; canonical six-step methodology.[^2][^3]

**ASI-01 through ASI-10** — OWASP Top 10 for Agentic Applications threat codes (December 9, 2025). Goal Hijack, Tool Misuse, Identity & Privilege Abuse, Supply Chain, Code Execution, Memory Poisoning, Insecure Inter-Agent Comms, Cascading Failures, Human-Agent Trust Exploitation, Rogue Agents.[^4]

**AML.T-codes** — MITRE ATLAS technique identifiers. Agentic cluster T0080–T0107 added in v5.4.0 (February 5, 2026); v5.5.0 (April 30, 2026) added Cost Harvesting and Supply Chain Rug Pull.[^16]

**AICM** — CSA AI Controls Matrix v1.0. 243 controls × 18 domains (July 2025).[^7]

**ATF** — CSA Agentic Trust Framework (February 2, 2026). Zero-trust policy language for agent governance, foreword by John Kindervag.[^8]

**AAGATE** — Agentic AI Governance Assurance & Trust Engine. CSA reference architecture (December 22, 2025), Kubernetes-native control plane.[^14][^15]

**GOA / Janus SMA / Tool-Gateway / ANS** — AAGATE components. GOA = Governing-Orchestrator Agent (kill switch); Janus SMA = Shadow-Monitor Agent (in-loop red team); Tool-Gateway = single auditable egress; ANS = Agent Name Service (DIDs + SPIFFE).[^14]

**AIVSS** — OWASP AI-Vulnerability Scoring System. The AI-specific severity scoring standard, integrated into OWASP T-codes and AAGATE ComplianceAgent.[^4][^14]

**SSVC** — SEI Stakeholder-Specific Vulnerability Categorization. The decision-tree logic AAGATE GOA uses for kill-switch classification.[^14]

**IATP** — Inter-Agent Trust Protocol (Microsoft AGT). Encrypted inter-agent communication layer with trust gates.[^27]

**ETHOS Ledger** — AAGATE optional blockchain layer for tamper-proof compliance proofs; ZK-Prover with Groth16 proofs supports privacy-preserving compliance assurance.[^14][^15]

**MCP** — Model Context Protocol (Anthropic, with growing open-source community). The standard for AI applications connecting to external tools, data, and services.[^11]

**A2A** — Agent-to-Agent protocol (Google). Linux Foundation project as of 2026; layer-3-primary with layer-7-critical implications per the CSA case study.[^22]

**SPIFFE/SVID** — workload identity standard (CNCF). The emerging baseline for agent-level identity, carried through token exchange flows as subject or actor.[^36][^37]

**RFC 8693** — OAuth 2.0 Token Exchange. CoSAI's recommended replacement for pass-through OAuth in agent delegation chains.[^36][^37]

**OBO** — On-Behalf-Of token. Carries both agent identity and user identity through delegation; scope narrows at each hop.[^36]

**Scope 1–4** — AWS Agentic AI Security Scoping Matrix levels. No Agency / Prescribed Agency / Supervised Agency / Full Agency.[^9][^10]

**NIST AI RMF Agentic Profile** — CSA-published April 2, 2026 extensions to NIST AI 600-1 with AG-MG.2, AG-MS.3, AG-MP.1 subcategories aligned with AICM and AAGATE.[^24]

**OpenTelemetry GenAI Semantic Conventions** — emerging observability standard for traceable tool calls and inference spans, applicable to MAESTRO Layer 5.

---

## References

[^1]: Cloud Security Alliance. "Agentic AI Threat Modeling Framework: MAESTRO." February 6, 2025. <https://cloudsecurityalliance.org/blog/2025/02/06/agentic-ai-threat-modeling-framework-maestro>

[^2]: Cloud Security Alliance Lab Space. "MAESTRO." 2025. <https://labs.cloudsecurityalliance.org/maestro/>

[^3]: CloudSecurityAlliance/MAESTRO GitHub repository. <https://github.com/CloudSecurityAlliance/MAESTRO>

[^4]: OWASP GenAI Security Project. "OWASP Top 10 for Agentic Applications: The Benchmark for Agentic Security in the Age of Autonomous AI." December 9, 2025. <https://genai.owasp.org/2025/12/09/owasp-top-10-for-agentic-applications-the-benchmark-for-agentic-security-in-the-age-of-autonomous-ai/>

[^5]: OWASP. "Top 10 for Agentic Applications v1.1 (PDF)." December 2025. <https://genai.owasp.org/download/45674/>

[^6]: NIST AI 600-1, Generative AI Profile. National Institute of Standards and Technology. <https://www.nist.gov/itl/ai-risk-management-framework>

[^7]: Cloud Security Alliance. "AI Controls Matrix v1.0." July 2025. <https://cloudsecurityalliance.org/research/ai-controls-matrix>

[^8]: Cloud Security Alliance. "Agentic Trust Framework." February 2, 2026 (foreword by John Kindervag). <https://cloudsecurityalliance.org/research/agentic-trust-framework>

[^9]: Amazon Web Services. "The Agentic AI Security Scoping Matrix." <https://aws.amazon.com/ai/security/agentic-ai-scoping-matrix/>

[^10]: Amazon Web Services. "The Agentic AI Security Scoping Matrix: A framework for securing autonomous AI systems." November 21, 2025. <https://aws.amazon.com/blogs/security/the-agentic-ai-security-scoping-matrix-a-framework-for-securing-autonomous-ai-systems/>

[^11]: Coalition for Secure AI (CoSAI), OASIS Open Project. "Model Context Protocol (MCP) Security." January 8, 2026. <https://github.com/cosai-oasis/ws4-secure-design-agentic-systems/blob/main/model-context-protocol-security.md>

[^12]: Coalition for Secure AI. "Agentic Identity and Access Management." Approved by CoSAI TSC March 20, 2026. <https://www.coalitionforsecureai.org/wp-content/uploads/2026/04/agentic-identity-and-access-control.pdf>

[^13]: Coalition for Secure AI. CoSAI Workstream 4 GitHub repository. <https://github.com/cosai-oasis/ws4-secure-design-agentic-systems>

[^14]: Cloud Security Alliance. "AAGATE: A NIST AI RMF-Aligned Governance Platform for Agentic AI." December 22, 2025. <https://cloudsecurityalliance.org/articles/aagate-a-nist-ai-rmf-aligned-governance-platform-for-agentic-ai>

[^15]: Huang, K. et al. "AAGATE: A NIST AI RMF-Aligned Governance Platform for Agentic AI." arXiv:2510.25863, October 29, 2025. <https://arxiv.org/abs/2510.25863>

[^16]: MITRE ATLAS atlas-data CHANGELOG (v5.4.0 February 5, 2026; v5.5.0 April 30, 2026). <https://github.com/mitre-atlas/atlas-data/blob/main/CHANGELOG.md>

[^17]: MITRE Corporation. "MITRE ATLAS OpenClaw Investigation." February 9, 2026. <https://www.mitre.org/sites/default/files/2026-02/PR-26-00176-1-MITRE-ATLAS-OpenClaw-Investigation.pdf>

[^18]: OWASP GenAI Security Project. "Agentic AI Threats and Mitigations." February 17, 2025. <https://genai.owasp.org/resource/agentic-ai-threats-and-mitigations/>

[^19]: OWASP GenAI Security Project. "Securing Agentic Applications Guide v1.0." July 28, 2025. <https://genai.owasp.org/download/49059/>

[^20]: SentinelAgent: Runtime Monitoring for Agentic AI Systems. arXiv:2604.02767, April 2026. <https://arxiv.org/abs/2604.02767>

[^21]: Cloud Security Alliance with Steven Leath. "Applying MAESTRO to Real-World Agentic AI Threat Models: From Framework to CI/CD Pipeline (TITO)." <https://cloudsecurityalliance.org/articles/applying-maestro-to-real-world-agentic-ai-threat-models-from-framework-to-ci-cd-pipeline>

[^22]: Cloud Security Alliance. "Threat Modeling Google's A2A Protocol with the MAESTRO Framework." April 30, 2025. <https://cloudsecurityalliance.org/blog/2025/04/30/threat-modeling-google-s-a2a-protocol-with-the-maestro-framework>

[^23]: Cloud Security Alliance. "OpenClaw MAESTRO Framework Analysis." February 20, 2026. <https://cloudsecurityalliance.org/blog/2026/02/20/openclaw-threat-model-maestro-framework-analysis>

[^24]: Cloud Security Alliance Lab Space. "NIST AI Risk Management Framework: Agentic Profile." April 2, 2026. <https://labs.cloudsecurityalliance.org/agentic/agentic-nist-ai-rmf-profile-v1/>

[^25]: MITRE ATLAS Releases. <https://github.com/mitre-atlas/atlas-data/releases>

[^26]: StartupDefense. "OpenClaw 1-Click Remote Code Execution (AML.CS0050)." <https://www.startupdefense.io/mitre-atlas-case-studies/aml-cs0050-openclaw-1-click-remote-code-execution>

[^27]: Microsoft. "agent-governance-toolkit." GitHub repository. <https://github.com/microsoft/agent-governance-toolkit>

[^28]: Microsoft Open Source. "Introducing the Agent Governance Toolkit: Open-source runtime security for AI agents." April 2, 2026. <https://opensource.microsoft.com/blog/2026/04/02/introducing-the-agent-governance-toolkit-open-source-runtime-security-for-ai-agents/>

[^29]: Amazon Web Services. "System design and security recommendations for agentic AI systems." AWS Prescriptive Guidance. <https://docs.aws.amazon.com/prescriptive-guidance/latest/agentic-ai-security/best-practices-system-design.html>

[^30]: Amazon Web Services. "Security for agentic AI on AWS." AWS Prescriptive Guidance. <https://docs.aws.amazon.com/prescriptive-guidance/latest/agentic-ai-security/introduction.html>

[^31]: OWASP. "Agentic AI Threats and Mitigations v1.1 (PDF)." <https://genai.owasp.org/download/50592/>

[^32]: OWASP GenAI Security Project. "OWASP GenAI Security Project Releases Top 10 Risks and Mitigations for Agentic AI Security." December 9, 2025. <https://genai.owasp.org/2025/12/09/owasp-genai-security-project-releases-top-10-risks-and-mitigations-for-agentic-ai-security/>

[^33]: CSO Online. "Microsoft's new Agent Governance Toolkit targets top OWASP risks for AI agents." April 8, 2026. <https://www.csoonline.com/article/4155594/microsofts-new-agent-governance-toolkit-targets-top-owasp-risks-for-ai-agents-2.html>

[^34]: Microsoft. "Microsoft Agent 365, now generally available." May 1, 2026. <https://www.microsoft.com/en-us/security/blog/2026/05/01/microsoft-agent-365-now-generally-available-expands-capabilities-and-integrations/>

[^35]: Coalition for Secure AI. "Coalition for Secure AI Releases Extensive Taxonomy for Model Context Protocol Security." January 27, 2026. <https://www.coalitionforsecureai.org/coalition-for-secure-ai-releases-extensive-taxonomy-for-model-context-protocol-security/>

[^36]: Coalition for Secure AI. "Who's Minding the Agent? A New Framework for AI Identity and Access Control." April 17, 2026. <https://www.coalitionforsecureai.org/whos-minding-the-agent-a-new-framework-for-ai-identity-and-access-control/>

[^37]: Coalition for Secure AI. "After RSAC 2026: The MCP Security Question Everyone Kept Asking." April 29, 2026. <https://www.coalitionforsecureai.org/after-rsac-2026-the-mcp-security-question-everyone-kept-asking/>

[^38]: MITRE Corporation. "MITRE ATLAS: OpenClaw Investigation." February 9, 2026. <https://www.mitre.org/news-insights/publication/mitre-atlas-openclaw-investigation>

[^39]: MITRE Center for Threat-Informed Defense. "MITRE ATLAS OpenClaw Investigation Discovers New and Likeliest Techniques." February 9, 2026. <https://ctid.mitre.org/blog/2026/02/09/mitre-atlas-openclaw-investigation/>

[^40]: Vercel. "BotID." GA June 2025. Bot detection and verification at the application ingress. <https://vercel.com/docs/botid>

[^41]: Boston Consulting Group. "How Retail Banks Can Put Agentic AI to Work." March 9, 2026. <https://www.bcg.com/publications/2026/how-retail-banks-can-put-agentic-ai-to-work>

[^42]: AIX | AI Expert Network. "Case Study: AI at Bank of America – From Erica to Enterprise-Wide AI Transformation." <https://aiexpert.network/ai-at-bank-of-america/>

[^43]: Bank of America. "BofA AI and Digital Innovations Fuel 30 Billion Client Interactions." March 1, 2026. <https://newsroom.bankofamerica.com/content/newsroom/press-releases/2026/03/bofa-ai-and-digital-innovations-fuel-30-billion-client-interacti.html>

[^44]: StackAI. "How Bank of America Can Transform Retail Banking and Enterprise Risk Management with Agentic AI." <https://www.stack-ai.com/insights/how-bank-of-america-can-transform-retail-banking-and-enterprise-risk-management-with-agentic-ai>

[^45]: Deloitte. "Managing the new wave of risks from AI agents in banking." March 5, 2026. <https://www.deloitte.com/us/en/insights/industry/financial-services/agentic-ai-risks-banking.html>

[^46]: Aptible. "Agentic AI in healthcare: how to secure LLMs with tool access." <https://www.aptible.com/hipaa-ai-security/agentic-ai-security>

[^47]: SecHub. "The Agentic AI Security Scoping Matrix: A framework for securing autonomous AI systems." <https://sechub.in/view/3137846>

[^48]: EmergentMind. "AAGATE: NIST AI RMF for Agentic AI." <https://www.emergentmind.com/papers/2510.25863>

[^49]: Security Feed. "The Agentic AI Security Scoping Matrix: A framework for securing autonomous AI systems." November 21, 2025. <https://securityfeed.link/2025/Nov/21/2025-11-21-the-agentic-ai-security-scoping-matrix-a-framework-for-securing-autonomous-ai-systems/>


---
title: "AI Bill of Materials and Agent Supply-Chain Compliance"
subtitle: "CycloneDX AIBOM, Snyk MCP detection, audit-grade dependency graphs for autonomous systems"
publication: "perea.ai Research"
authors: ["Dante Perea"]
version: "1.0"
status: "Public draft"
date: "2026-05"
audience: "Procurement teams evaluating agent vendors, AI compliance officers, security architects shipping production agent runtimes, founders preparing for EU AI Act Annex IV obligations"
length: "~5,500 words"
license: "CC BY 4.0"
description: "What an AI Bill of Materials actually contains in 2026, why it has become a procurement and regulatory necessity, and how to generate one. Covers CycloneDX 1.6/1.7 AI/ML-BOM, Snyk's snyk aibom CLI with MCP client→server→tool dependency detection, EU AI Act Article 11 + Annex IV technical-documentation requirements, the 30+ MCP-related CVEs filed in the first 60 days of 2026, and the procurement workflows that audit-grade dependency graphs unlock."
profile: "field-manual"
---

## Foreword

Three forces collided in 2025-2026 to make the AI Bill of Materials (AIBOM) a load-bearing artifact for every organization shipping AI features. First, the EU AI Act's Article 11 + Annex IV technical-documentation deadline arrived: 2 August 2026 for high-risk systems under Annex III, with a 10-year retention obligation under Article 18.[^17][^18][^24] Second, the Model Context Protocol exploded into production agent stacks, creating implicit trust networks that no one could audit — until Snyk shipped `snyk aibom` with MCP client→server→tool detection on Snyk CLI v1.1298.3 in March 2026.[^9][^10] Third, supply-chain attacks against agent runtimes accelerated: 30+ CVEs filed against MCP servers and SDKs in the first 60 days of 2026, 13 of them Critical, plus a North Korean npm hijack that injected a rogue MCP server into every AI coding assistant it could find.[^30]

This is a field manual for engineers and compliance teams who need to produce, consume, or audit AIBOMs in 2026. Eight sections: what an AIBOM is and why it differs from an SBOM, the CycloneDX 1.6/1.7 standard, the Snyk tooling, the EU AI Act regulatory pressure, the MCP supply-chain threat surface, the procurement workflow, the engineering checklist, and the forward outlook. Numbers, CVE IDs, and CycloneDX schema fields throughout.

## 1. From SBOM to AIBOM: What Changed

A Software Bill of Materials (SBOM) catalogs the components, libraries, and dependencies that compose a software system, with provenance and version information.[^36] AIBOM (or ML-BOM) extends the concept to include the AI-specific components that an SBOM cannot represent: foundational and open-source models, training/validation/test datasets, training methodologies, model cards, AI service integrations, agent frameworks, MCP clients/servers/tools, and the configurations that bind them together.[^13][^3]

CycloneDX is the OWASP supply-chain standard that has converged on a unified BOM specification for all of these.[^7] The 1.6 release (April 9 2024) added cryptographic-asset (CBOM) and Attestations (CDXA).[^2] The 1.6.1 release (November 7 2024) was bug-fix only.[^6] Version 1.7 was released October 21 2025 and published December 10 2025; it forms the basis of the future ECMA-424 standard at Ecma International.[^7][^5] The CycloneDX object model represents components (software, hardware, machine-learning models, source code, configurations), services, dependencies (direct and transitive), vulnerabilities, attestations, and now formulation — the process by which an object was built, including AI/ML model training pipelines.[^5][^4]

The schema's `bomFormat` field is required and must equal `CycloneDX`.[^1] Components carry a `type` enumerator that includes `application`, `framework`, `library`, `container`, `platform`, `operating-system`, `device`, `device-driver`, `firmware`, `file`, `machine-learning-model`, `data`, and `cryptographic-asset`.[^1] Three media types are IANA-registered: `application/vnd.cyclonedx+xml`, `application/vnd.cyclonedx+json`, and (provisional) `application/x.vnd.cyclonedx+protobuf`.[^7] CycloneDX recognizes `https://cyclonedx.org/bom` as the official in-toto predicate type for SBOM/SaaSBOM/HBOM/ML-BOM/CBOM/OBOM/MBOM/BOV/VDR/VEX attestations.[^7]

The ML-BOM-specific fields cover datasets (provenance, characteristics, collection process, preparation, labelling, cleaning, governance), training methodologies, model card data, and AI framework configurations.[^3] The point is auditability: every model an organization deploys should be traceable from its training data through its fine-tuning steps to the agent runtime that calls it. SPDX 3.0 also ships an AI Profile released December 2024 as an alternative standard,[^37] but the practitioner ecosystem has converged on CycloneDX because of the maturity of OWASP's tool center and the breadth of supply-chain artifacts already covered.

OWASP also runs the **AIBOM Generator** (`github.com/GenAI-Security-Project/aibom-generator`), an open-source tool that extracts metadata from Hugging Face models, generates CycloneDX 1.6 JSON, calculates AIBOM completeness scores, and provides a human-readable viewer.[^8] The completeness scoring is the critical operational primitive: it tells you which fields the AIBOM is missing and what to fix to bring the document up to audit grade.[^8]

## 2. Snyk AI-BOM: From Manual Documentation to Automated Discovery

Snyk publicly released the `snyk aibom` CLI command on Snyk CLI v1.1298.3 (announced via the Snyk updates feed in 2026).[^11] The command generates a CycloneDX v1.6 JSON AI-BOM for local Python projects, identifying AI models, datasets, agents, tools, and MCP dependencies.[^10] By March 24 2026, the CLI documentation listed it as a supported command (with the `--experimental` flag deprecated as of v1.1304.0).[^10][^15]

The architectural decision that made Snyk's AI-BOM useful in production is static code analysis powered by Snyk DeepCode. Rather than asking developers to maintain manifests by hand, the tool scans Python source code and detects embedded AI usage even when there is no clear manifest or package reference.[^12] The scanner recognizes Hugging Face transformers, OpenAI APIs, smol-ai agent frameworks, training datasets referenced in model cards, and direct API endpoint invocations that look opaque from a `pip` dependency perspective.[^12][^13]

What set Snyk's AI-BOM apart from a generic ML-BOM tool was the August 4 2025 announcement that MCP detection was integrated directly into the AI-BOM output.[^9] The scanner identifies MCP usage across:[^9][^10]

- The standard `mcp` Python library (`ClientSession`, `stdio_client`, `streamablehttp_client`)
- `pydantic-ai`
- `openai-agents`
- `langchain-mcp-adapters`
- `smolagents`

When MCP usage is detected, the scanner maps the entire chain — from client to server to specific tools and resources being used — and adds the components to the CycloneDX AI-BOM with explicit `dependencies` entries.[^9] A typical fragment from a generated AI-BOM:[^9]

```json
{ "bom-ref": "mcp-server:MathServer", "name": "MathServer", "type": "service" },
{ "bom-ref": "tool:add", "name": "add", "type": "service" },
"dependencies": [
  { "ref": "application:Root", "dependsOn": ["mcp-client:..."] },
  { "ref": "mcp-client:...", "dependsOn": ["mcp-server:MathServer"] },
  { "ref": "mcp-server:MathServer", "dependsOn": ["tool:add"] }
]
```

This converts the implicit trust network of an AI application — "we use Claude, which uses MCP, which uses some servers, which provide some tools" — into an explicit, machine-readable dependency graph that procurement and security teams can review with the same rigor they apply to npm or pip dependencies.[^9]

The Snyk product line evolved into three companion tools by late 2025:[^14]

1. **Snyk AI-BOM** (CLI + API) for static dependency discovery.
2. **Snyk AI Red Teaming** for adversarial testing of AI systems.
3. **Snyk MCP-Scan**, an open-source tool that automatically discovers MCP servers (Claude, Cursor, Windsurf), Agent Skills, and data pipelines and scans them for prompt injection, tool poisoning, toxic flows, and other vulnerabilities.

The CI/CD integration is straightforward: a GitHub Actions step runs `snyk aibom --json > artifacts/aibom.json` and uploads the artifact for downstream consumption.[^13] Snyk's AI-BOM API (`POST /rest/orgs/{org_id}/ai_boms`) lets organizations persist AIBOMs into a central inventory at scale, with the `--upload --repo` flags binding a generated AIBOM to a specific source repository.[^10] The companion `snyk aibom test` command (Snyk CLI v1.1304.0+) generates an AI-BOM and evaluates it against the tenant's configured Evo policies, returning policy violations as Open issues.[^15] Snyk Evo's discovery flow (December 8 2025) extended this further, generating a complete inventory of every AI component — models, agents, MCP servers, datasets, plugins — across all repositories.[^16]

## 3. EU AI Act Article 11 + Annex IV: The Regulatory Forcing Function

The EU AI Act's Article 11 obligates providers of high-risk AI systems to draw up technical documentation before placing the system on the market, kept up to date throughout its lifecycle, with minimum content per Annex IV.[^17] Annex IV's nine sections are:[^18][^25]

1. **General description**: intended purpose, version history, deployment context.
2. **Development process**: methods for development including pre-trained systems and third-party tools, design specifications, system architecture, computational resources, data requirements with datasheets describing training/validation/test datasets (provenance, scope, characteristics, obtainment, labelling, cleaning).
3. **Monitoring, functioning, control**: capabilities and limitations, accuracy by subgroup, foreseeable unintended outcomes, human oversight measures per Article 14, input data specifications.
4. **Performance metric justification**: why the chosen metrics fit the use case.
5. **Risk management system** per Article 9: hazards, mitigations, residual risk sign-off.
6. **Lifecycle changes**: pre-determined changes, substantial modification log.
7. **Applied harmonized standards**: those used in full or in part, plus alternative solutions where harmonized standards are not yet available.
8. **EU Declaration of Conformity** per Annex V.
9. **Post-market monitoring plan**: drift, incidents, escalation runbook.

The deadlines:[^23][^28]

- **2 August 2026**: high-risk AI systems under Annex III (biometrics, employment, education, essential services).
- **2 August 2027**: systems embedded in regulated products under Annex I (medical devices, toys, vehicles).
- **2 December 2027**: maximum extension under the Digital Omnibus proposed by the Commission, conditional on availability of harmonized standards.

Article 18 mandates a 10-year retention obligation: technical documentation must be retained for 10 years after the AI system was last placed on the EU market.[^24] Even after a product is discontinued, the documentation must remain accessible for a decade. The CEN-CENELEC JTC 21 harmonized standards process is behind schedule — seven primary standards (covering risk management, data governance, transparency, human oversight, accuracy, robustness, cybersecurity, bias management, and quality management) were originally targeted for late 2025 but are now expected Q4 2026.[^26] The most mature is prEN 18286 (Quality Management Systems for AI Act compliance), which entered public enquiry in October 2025 and whose Annex ZA maps QMS requirements directly to Articles 11, 17, and 72.[^26]

The procurement implication: if your customer is in the EU and your AI system is high-risk, you owe them a technical-documentation package compatible with Annex IV by August 2026. SOC 2 and ISO 27001 do not satisfy the AI-specific documentation requirements — particularly around training data governance, bias assessment, and human oversight specifications.[^28] Standard estimates from compliance practitioners run 40-80 hours for a single high-risk AI system, assuming documentation was tracked from the start of development; full assembly with bias testing typically takes 3-6 months.[^23][^24] An AIBOM in CycloneDX format covers Section 2 (development process — architecture, data, dependencies) and feeds the SBOM-equivalent line item explicitly listed in the Annex IV checklist.[^25]

NIST's AI Risk Management Framework (AI RMF 1.0, January 2023) provides a complementary U.S. framework with four functions — GOVERN, MAP, MEASURE, MANAGE — and the AI 600-1 Generative AI Profile.[^22] ISO/IEC 42001 (December 2023) is the international AI management system standard.[^34] All three frameworks require evidence of dependency tracking. AIBOMs are how that evidence is operationalized.

Spain's AESIA (the EU's first operational national AI supervisory body) has published 16 practical guidance documents; Guide 15 specifically covers technical documentation and is the most detailed publicly available compliance resource for Annex IV.[^26] Annex IV applies to providers of high-risk AI systems; Annex XI applies to providers of general-purpose AI (GPAI) models per Article 53, with different content focusing on the underlying model, its training data, and energy consumption.[^23]

## 4. The MCP Supply-Chain Threat Surface

The Model Context Protocol introduced a new layer to the AI supply chain: tool definitions and their descriptions, served by external MCP servers, ingested into the agent's context window where the LLM treats them as authoritative input. By April 2026, MCP supply-chain attacks were the dominant security incident class for AI coding assistants.

The Lorikeet Security analysis published April 16 2026 catalogues the scope.[^30] In the first 60 days of 2026:

- **30+ CVEs** filed against MCP servers and SDKs.
- **13 rated Critical**.
- **7,374** publicly reachable vulnerable MCP servers detected by OX Security via Shodan.
- **24,008** secrets pulled from MCP configuration files on public GitHub by GitGuardian — **2,117** confirmed live credentials.
- **March 31, 2026**: a North Korean threat actor hijacked the Axios npm package (versions 1.14.1 and 0.30.4) by injecting a malicious dependency `plain-crypto-js` whose `postinstall` hook dropped the SILKBELL loader, which delivered the WAVESHAPER.V2 cross-platform RAT (PE injection, shell execution, filesystem traversal, C2 beaconing to `sfrclak[.]com:8000` every 60 seconds).

WAVESHAPER's payload was the agent-specific innovation. The malware enumerated configuration files for Claude Code, Claude Desktop, Cursor, VS Code Continue, and Windsurf/Codeium. When it found one, it injected a rogue MCP server definition into the configuration — adding a hidden tool to the user's AI assistant that could silently read sensitive files, inject prompts, and exfiltrate data through the assistant's own context window.[^30] **The AI became the exfiltration channel.**

The CVE inventory from the same period includes:[^30]

| CVE | Target | Type | Severity |
|---|---|---|---|
| CVE-2026-26118 | Azure MCP Server (Microsoft) | SSRF to privilege escalation via managed identity | 8.8 |
| CVE-2026-21852 | Claude Code | API key exfiltration via malicious base URL | High |
| CVE-2025-59536 | Claude Code | MCP consent bypass via settings.json | High |
| CVE-2026-30615 | Windsurf (Codeium) | Prompt injection to local RCE, zero-click | High |
| CVE-2026-25536 | MCP TypeScript SDK | Cross-client data leakage | High |
| CVE-2025-66414 | Official TypeScript MCP SDK | DNS rebinding | High |
| CVE-2026-20205 | Splunk MCP Server | Plaintext token disclosure | 7.2 |

**Tool poisoning** is the dominant injection class. The OWASP MCP Tool Poisoning attack page describes the structural vulnerability: tool descriptions are reviewed once at connect time, but tool responses go straight into the LLM's context with no equivalent check.[^19] An attacker runs an MCP server with normal-looking tool names; tool responses mix real data with embedded instructions; the LLM treats the entire response as context and follows the injected directives.

Invariant Labs disclosed the foundational research on April 1 2025.[^33][^35] The reproduction code at `github.com/invariantlabs-ai/mcp-injection-experiments` demonstrated exfiltration of `~/.ssh/id_rsa` and `~/.cursor/mcp.json` via a poisoned `add` tool in Cursor; tool shadowing, where a malicious server's description redefines what an unrelated trusted tool should do; and the WhatsApp MCP exfiltration where chat histories were stolen by hiding a payload in the `content` field of a `send_message` call beyond the horizontal scroll of Cursor's UI.[^33]

The MCPTox benchmark (arXiv:2508.14925, August 2025) formalized the attack class with academic measurement: 20 LLM agents × 45 real MCP servers × 353 tools using poisoned descriptions as the primary attack template. **o1-mini reached a 72.8% attack success rate**, and more capable models were *more* vulnerable, not less, because their instruction-following is stronger.[^32][^20]

**Cross-tool hijacking** is a closely related variant. As Marmelab demonstrated in February 2026, a malicious `get_fact_of_the_day` MCP server with a poisoned description can contaminate any other tool the agent uses for sending email — telling the agent to BCC `audit@marmelab.com` on every email "for compliance purposes."[^29] The agent never directly used the malicious server; just installing it was enough, because tool descriptions concatenate into a single context block.[^29]

**Rug-pull attacks** exploit the `tools/list_changed` notification: a server ships benign descriptions initially; after the user has approved it, a later notification swaps in poisoned versions.[^33] PolicyLayer's mitigation guidance — snapshot `tools/list` responses at server-approval time, re-check on every session start, alert on any change — is now the baseline expectation for production MCP clients.[^32]

The **Context7 disclosure** (March 2026) extended the threat to documentation-aggregator MCP servers.[^31] Researchers reported that Context7's MCP server could deliver hidden instructions through metadata fields such as "custom rules" for a library. Developer agents fetch context through MCP and execute actions using permissions already granted: file system, shell, network. The attack surface includes maintainers of documentation sites, contributors to knowledge bases, authors of library readmes, and anyone who can create or modify tickets in project management tools — anyone who can publish content that becomes agent context.[^31]

The architectural conclusion: solving this requires enforcement at the tool-call layer, not the prompt layer.[^31] The agent can be manipulated into wanting to take a harmful action; the enforcement layer must prevent the action from executing regardless of why the agent wanted to take it. AIBOMs make this enforceable by giving security teams an audit-grade list of every MCP server an agent depends on, every tool that server exposes, and every code path that loads them.

## 5. The Procurement Workflow

For procurement teams evaluating agent vendors in 2026, the AIBOM is the primary technical artifact that distinguishes serious vendors from vibe-coded prototypes. A working procurement checklist:

**1. Request a CycloneDX 1.6 (or 1.7) AIBOM as part of the security questionnaire.** If the vendor cannot produce one — or produces something that is not a parseable CycloneDX JSON — they have not done the foundational work. The OWASP AIBOM Generator's completeness score lets you evaluate the document quality objectively rather than accepting whatever the vendor sends.[^8]

**2. Verify dataset provenance.** The CycloneDX ML-BOM fields cover datasets, but the procurement question is which datasets were used, where they came from, what licensing applies, and what bias testing was done.[^3] EU AI Act Annex IV Section 2 requires datasheets per dataset; for U.S. customers, NIST AI RMF MEASURE 2.7 and MEASURE 3.3 require equivalent documentation.[^22]

**3. Map MCP dependencies.** If the vendor's agent uses MCP — and most production agents do by 2026 — the AIBOM must list every MCP client/server/tool combination the agent reaches, with explicit `dependencies` graph edges.[^9] The Snyk AI-BOM tooling produces this format automatically; ask the vendor to run `snyk aibom` against their codebase and provide the output.[^10]

**4. Ask about CVE remediation cadence for MCP dependencies.** Given 30+ MCP CVEs in the first 60 days of 2026, vendors need a documented patching policy.[^30] How long from CVE publication to vendor patch? What is the disclosure-to-remediation SLA?

**5. Audit MCP server approval process.** Does the vendor allow developers to add arbitrary MCP servers to production agents? Or is there a centralized approval workflow with hash-pinning and `tools/list_changed` re-approval?[^32] The latter is a basic hygiene requirement; the former is a Lorikeet-Security-style supply-chain timebomb.

**6. Verify Article 11 + Annex IV alignment** if the vendor sells into EU markets. The technical-documentation package should be available on request; the AIBOM is the dependency-graph component, but the full Annex IV file requires the other 8 sections.[^25]

**7. Confirm SOC 2 / ISO 27001 are not being substituted for AI-specific compliance.**[^28] These overlap partially with cybersecurity (Annex IV Section 2 cybersecurity sub-element) but do not satisfy training data governance, bias assessment, or human oversight specifications.

**8. Test MCP-Scan output.** Snyk MCP-Scan (open-source) runs against the vendor's published MCP server endpoints and produces a vulnerability report.[^14] If the vendor's MCP servers fail MCP-Scan, you have a procurement blocker.

The procurement workflow has parallels to SBOM adoption circa 2022-2024 (post-Log4Shell, post-Executive Order 14028, post-NTIA SBOM Minimum Elements). CISA's continuing SBOM guidance is the operational precedent for what AIBOM is becoming.[^36] Where SBOMs took 2-3 years to move from "nice to have" to "required by federal procurement," AIBOMs are compressing that timeline because the regulatory + threat-landscape pressure arrived simultaneously.

## 6. Engineering Checklist: Generating and Maintaining an Audit-Grade AIBOM

Eleven items distilled from the published practices of Snyk Labs, OWASP CycloneDX, and the EU AI Act compliance ecosystem:

**1. Choose CycloneDX 1.6 JSON as the canonical format.**[^1][^10] CycloneDX 1.7 is the latest, but 1.6 is what the entire tooling ecosystem currently emits. SPDX 3.0 AI Profile is an alternative if the consumer requires it.[^37]

**2. Generate the AIBOM as a CI/CD artifact, not a manual document.**[^13] Run `snyk aibom` (or the OWASP AIBOM Generator)[^8] in CI, write the output to a versioned artifact bucket, and surface it as a build output. Manual AIBOMs are stale within a sprint.

**3. Include MCP dependencies explicitly.**[^9] If your agent uses any MCP client, the AIBOM should contain `mcp-client`, `mcp-server`, and `tool` components with full dependency edges. Snyk's tooling does this automatically for the supported Python libraries; for other languages you may need to write a custom extractor against the CycloneDX schema.[^10]

**4. Track dataset provenance with datasheets.** EU AI Act Annex IV requires this; CycloneDX `formulation` fields can carry it.[^4][^25] Use the Datasheets-for-Datasets format adapted for Article 10 compliance as the dataset-card template.[^25]

**5. Hash-pin every external dependency.** MCP servers, third-party model weights, dataset URLs. Pin by hash, not by name, so rug-pull attacks via `tools/list_changed` require explicit re-approval.[^32]

**6. Snapshot `tools/list` responses at MCP server approval time.**[^32] Re-check on every session start; alert on any change. PolicyLayer's transport-layer proxy pattern is the production-grade implementation; for smaller deployments, a `mcp-scan`-style cron job catches the same class of issues.[^14]

**7. Run MCP-Scan against every server before adding it.**[^14] The open-source tool produces vulnerability reports specifically for tool poisoning, prompt injection, and toxic flow patterns. This is the equivalent of `npm audit` for the MCP supply chain.

**8. Log full tool descriptions to the AIBOM.** Do not truncate. Many client UIs hide description text past 500 characters; the LLM sees the full payload. Your AIBOM should reflect what the LLM sees, not what the developer sees.[^32]

**9. Bind the AIBOM to a Code-Of-Conduct policy.** Snyk's `snyk aibom test` evaluates the AIBOM against organizational Evo policies and surfaces violations as Open issues.[^15] Equivalent commercial offerings include Permit.io's policy decision points and Microsoft Defender for Cloud Apps GenAI security posture management.

**10. Persist AIBOMs centrally.**[^16] Snyk Evo's discovery flow generates a complete inventory across all repositories; equivalent SaaS offerings include AIM Security's enterprise inventory product. The point is that procurement and audit need a single pane of glass, not per-repo artifacts.

**11. Retain AIBOMs for 10 years.** EU AI Act Article 18 obligates 10-year retention for high-risk AI systems.[^24] Plan storage infrastructure accordingly. Versioned object storage with append-only semantics (S3 Object Lock, Azure Immutable Blob Storage) is the baseline pattern.

A twelfth operational practice: treat AIBOM completeness as a release gate. The OWASP AIBOM Generator's completeness score is below 70% for many production AI codebases on first generation; the gap-closing work (model card metadata, dataset datasheets, dependency edges) is real engineering effort that needs to be scheduled, not an afterthought.[^8]

## 7. Six Predictions for AIBOM Adoption 2026-2028

**Prediction 1.** AIBOM emission becomes a contractual requirement in U.S. federal procurement of AI systems by Q4 2026, following the pattern of SBOM adoption after Executive Order 14028.[^36] CISA publishes AIBOM Minimum Elements guidance modeled on the NTIA SBOM Minimum Elements framework.

**Prediction 2.** EU AI Act enforcement begins in earnest after the August 2026 deadline. The first six-figure fine for missing or non-compliant Annex IV technical documentation lands by Q2 2027, and the second is for an AIBOM that materially under-represents MCP dependencies.[^17][^18]

**Prediction 3.** All three major LLM vendors (Anthropic, OpenAI, Google) ship first-party AIBOM generation tooling for their agent SDKs by mid-2027. Snyk + OWASP remain the third-party reference, but vendor-native tooling becomes table stakes.

**Prediction 4.** A second North-Korean-style npm hijack of an MCP-relevant package lands by Q3 2026. The Axios attack pattern — postinstall hook injecting a rogue MCP server into Claude Code / Cursor / Windsurf configs — is too cheap and too lucrative not to repeat.[^30]

**Prediction 5.** MCPTox-style benchmarks become a standard evaluation harness for new LLMs by 2027. The "more capable models are *more* vulnerable" inversion makes ASR a published metric on every model card.[^20]

**Prediction 6.** AIBOM-as-a-service emerges as a distinct category by mid-2027. The pattern matches Sigstore + Cosign for SBOMs: an attestation-signing service produces verifiable AIBOM signatures, organizations consume them in CI, and the procurement question becomes "do you sign your AIBOMs?" not "do you produce them?" CycloneDX Attestations (CDXA) is already the schema substrate for this.[^2][^7]

## Glossary

**AI Bill of Materials (AIBOM / ML-BOM).** Structured machine-readable inventory of the AI components in a software system: foundational and open-source models, datasets, training methodologies, agents, tools, MCP clients/servers, model cards. Extends SBOM to AI-specific artifacts.[^3][^13]

**CycloneDX.** OWASP supply-chain BOM standard; covers SBOM, SaaSBOM, HBOM, ML-BOM, CBOM, OBOM, MBOM, BOV, VDR, VEX, and CDXA in a unified object model.[^5]

**ECMA-424.** The Ecma International standard derived from CycloneDX 1.7, currently in development at TC54.[^5]

**Annex IV.** The EU AI Act's nine-section technical-documentation specification for high-risk AI systems, referenced from Article 11.[^18]

**Article 18 retention.** EU AI Act obligation to retain technical documentation for 10 years after the system was last placed on the EU market.[^24]

**Snyk AI-BOM.** Snyk CLI's `snyk aibom` command (CLI v1.1298.3+); generates CycloneDX 1.6 JSON for Python projects with model + dataset + agent + MCP detection via DeepCode static analysis.[^10][^12]

**MCP (Model Context Protocol).** Anthropic-designed open protocol that standardizes how applications provide context to LLMs through tool/resource servers.[^9]

**Tool Poisoning.** MCP supply-chain attack where the attacker hides prompt-injection instructions in tool descriptions, parameter descriptions, or input schemas — fields the model reads but the user typically does not see.[^33][^32]

**Tool Shadowing.** Attack variant where a malicious MCP server's tool description redefines the behavior of an unrelated trusted tool because all descriptions concatenate in the agent's context.[^29][^33]

**Rug-Pull / Sleeper Tool.** MCP server that ships benign tool descriptions initially, then swaps in poisoned versions via `tools/list_changed` after user approval.[^32][^33]

**MCPTox.** Academic benchmark (arXiv:2508.14925, August 2025) evaluating 20 LLM agents × 45 MCP servers × 353 tools against poisoned tool descriptions; o1-mini reached 72.8% ASR.[^20]

**WAVESHAPER.V2.** The cross-platform RAT delivered by SILKBELL via the March 31 2026 Axios npm hijack; injected rogue MCP server definitions into Claude Code, Claude Desktop, Cursor, VS Code Continue, and Windsurf configurations.[^30]

**Annex IV Datasheet.** Per-dataset documentation required by EU AI Act Annex IV Section 2: provenance, characteristics, collection process, preparation, labelling, cleaning. Datasheets-for-Datasets format is the de facto template.[^25]

**Snyk MCP-Scan.** Open-source companion tool to Snyk AI-BOM that scans MCP servers for prompt injection, tool poisoning, and toxic-flow vulnerabilities.[^14]

## Related Research

This paper closes the "AI supply-chain compliance" thread from `prompt-injection-defense-2026` and `capability-based-agent-security`. Threads it opens for follow-on:

- **annex-iv-procurement-field-manual** — the full nine-section walkthrough for vendors preparing Annex IV technical files; Spain AESIA Guide 15 as reference architecture.
- **mcp-server-trust-registry** — how a centralized hash-pinned MCP server registry works in production; rug-pull defense design.
- **regulated-vertical-aibom-templates** — sector-specific AIBOM extensions for healthcare (HIPAA + 21 CFR Part 11), finance (SR 11-7 + EU DORA), and defense (CMMC 2.0 + NIST 800-171).
- **ai-rmf-vs-ai-act-mapping** — the practical mapping between NIST AI RMF GOVERN/MAP/MEASURE/MANAGE and EU AI Act Articles 9, 10, 11, 13, 14, 15.

---

## References

[^1]: OWASP CycloneDX. "CycloneDX v1.6 JSON Reference." Required `bomFormat = CycloneDX`; component `type` enum includes `machine-learning-model`, `data`, `cryptographic-asset`. https://cyclonedx.org/docs/1.6/

[^2]: CycloneDX. "CycloneDX/specification 1.6 release." April 9 2024. Stevespringett. CBOM + CDXA additions; basis for future Ecma International standard. https://github.com/CycloneDX/specification/releases/tag/1.6

[^3]: OWASP CycloneDX. "Machine Learning Bill of Materials (AI/ML-BOM)." Capability page covering datasets, models, configurations, ethical considerations, and risk identification. https://cyclonedx.org/capabilities/mlbom/

[^4]: OWASP CycloneDX. "CycloneDX v1.6 XML Reference." Schema namespace http://cyclonedx.org/schema/bom/1.6, version 1.6.1; bom-ref uniqueness constraint; dependencies + compositions + vulnerabilities + annotations + formulation + declarations + definitions. https://cyclonedx.org/docs/1.6/xml/

[^5]: Ecma TC54. "ECMA-424 — CycloneDX Bill of materials specification." Standard defines CycloneDX v1.7 BOM format; SBOM/SaaSBOM/HBOM/ML-BOM/CBOM/OBOM/MBOM/BOV/VDR/VEX/CDXA all covered. https://ecma-tc54.github.io/ECMA-424/

[^6]: CycloneDX. "CycloneDX/specification 1.6.1 release." November 7 2024. Functionally equivalent to 1.6.0 + bug fixes; ProtoBuf 1.6 + XML 1.6 doc transfers. https://github.com/CycloneDX/specification/releases/tag/1.6.1

[^7]: OWASP CycloneDX. "Specification Overview." Current Version 1.7; release date 2025-10-21; published 2025-12-10; IANA media types `application/vnd.cyclonedx+xml` + `+json` + `+protobuf`; OWASP recognizes `https://cyclonedx.org/bom` as official in-toto predicate. https://cyclonedx.org/specification/overview/

[^8]: GenAI Security Project. "OWASP AIBOM Generator." Open-source tool for generating CycloneDX 1.6 JSON AIBOMs from Hugging Face model IDs; AIBOM completeness scoring; listed in CycloneDX Tool Center. https://github.com/GenAI-Security-Project/aibom-generator

[^9]: Snyk Labs. "See Your MCPs in Snyk's AI Bill of Materials (AI-BOM)." August 4 2025. MCP detection integrated into Snyk AI-BOM; client→server→tool dependency graph; supported libraries include standard mcp Python (ClientSession, stdio_client, streamablehttp_client), pydantic-ai, openai-agents, langchain-mcp-adapters, smolagents. https://labs.snyk.io/resources/mcps-snyk-ai-bom/

[^10]: Snyk. "AI-BOM CLI command documentation." March 24 2026. Snyk CLI v1.1298.3+; CycloneDX v1.6 JSON output; identifies AI models, agents, tools, MCPs; --upload --repo flags persist AIBOM into Snyk Organization. https://docs.snyk.io/developer-tools/snyk-cli/commands/aibom

[^11]: Snyk. "Announcing Snyk CLI v1.1298.3." snyk aibom command publicly accessible; identifies AI models, datasets, and AI supply chain including MCP. https://updates.snyk.io/announcing-snyk-cli-v1-1298-3-321385/

[^12]: Snyk Labs. "What's in Your AI? Probably Something You Can't Explain. Meet Snyk AI-BOM." May 28 2025. Snyk DeepCode static analysis detects embedded AI usage even without manifest; Hugging Face transformers + OpenAI APIs + smol-ai; CycloneDX format. https://labs.snyk.io/resources/aibom-cli-snyk

[^13]: Stephen Thoemmes (Snyk). "AIBOM for Python Developers — Mapping AI Dependencies with Snyk." August 6 2025. AIBOM extends SBOM concept to ML models + datasets + training params + AI service integrations; GroundingDINO + OpenHands AIBOM examples; GitHub Actions CI/CD integration. https://snyk.io/articles/ai-bill-of-materials-aibom-for-python-developers-mapping-your-ai/

[^14]: Snyk Labs. "Try Snyk's Latest Innovations in AI Security." September 15 2025. Snyk AI-BOM + Snyk AI Red Teaming + Snyk MCP-Scan; MCP-Scan open-source tool for analyzing MCP setups for prompt injection + tool poisoning + toxic flows. https://labs.snyk.io/try-now/

[^15]: Snyk. "AI-BOM test command documentation." Snyk CLI v1.1304.0+; generates AI-BOM and evaluates against tenant Evo policies; reports policy violations as Open + Ignored issues; severity-threshold flag. https://docs.snyk.io/developer-tools/snyk-cli/commands/aibom-test

[^16]: Snyk Evo. "Discovery Try Now." December 8 2025. Complete inventory of every AI component across local repositories: AI models, agents, MCP servers, datasets, plugins. http://evo.ai.snyk.io/evo-discovery-try-now/

[^17]: European Union AI Act Service Desk. "Article 11: Technical documentation." Regulation (EU) 2024/1689; high-risk AI systems must have technical documentation drawn up before market placement, kept up to date; minimum content per Annex IV; Commission empowered to amend Annex IV via delegated acts per Article 97; SMEs may use simplified form. https://ai-act-service-desk.ec.europa.eu/en/ai-act/article-11

[^18]: European Union AI Act Service Desk. "Annex IV — Technical documentation referred to in Article 11(1)." Nine mandatory sections including general description, development methods + design specs + system architecture + computational resources + data requirements; monitoring/functioning/control with capabilities/limitations/foreseeable unintended outcomes/human oversight per Article 14; risk management system per Article 9; lifecycle changes; harmonized standards; EU Declaration of Conformity; post-market monitoring plan. https://ai-act-service-desk.ec.europa.eu/en/ai-act/annex-4

[^19]: OWASP Foundation. "MCP Tool Poisoning." Indirect prompt injection attack; root cause = trust gap between connect-time tool-description review and runtime tool-response handling; tool responses go straight into LLM context without check. https://owasp.org/www-community/attacks/MCP_Tool_Poisoning

[^20]: arXiv. "MCPTox benchmark." arXiv:2508.14925 (August 2025). 20 LLM agents × 45 real MCP servers × 353 tools using poisoned descriptions as primary attack template; o1-mini 72.8% ASR; more capable models = more vulnerable. https://arxiv.org/abs/2508.14925

[^21]: Invariant Labs. "MCP Injection Experiments." Reproduction code for tool poisoning + tool shadowing + WhatsApp exfil; demonstrates exfiltration of `~/.ssh/id_rsa` and `~/.cursor/mcp.json` via poisoned `add` tool in Cursor. https://github.com/invariantlabs-ai/mcp-injection-experiments

[^22]: NIST. "AI Risk Management Framework (AI RMF 1.0)." January 2023. GOVERN/MAP/MEASURE/MANAGE functions; AI RMF Generative AI Profile NIST AI 600-1. https://www.nist.gov/itl/ai-risk-management-framework

[^23]: Aiacto. "AI Act Technical Documentation: Complete Annex IV Guide." February 17 2026. 40-80 hours per system estimate; CEN-CENELEC harmonized standards Q4 2026 target; deadlines 2 August 2026 (Annex III), 2 August 2027 (Annex I), Digital Omnibus possible extension to 2 December 2027. https://www.aiacto.eu/en/blog/documentation-technique-ai-act-article-11-annexe-iv

[^24]: EU AI Act Guide. "A Guide to Technical Documentation: What Needs to be in your Annex IV File?" March 22 2026. Article 18 10-year retention; bias detection + special category data + risk management system per Article 9; 3-6 months to assemble for single high-risk system. https://euaiactguide.com/a-guide-to-technical-documentation-what-needs-to-be-in-your-annex-iv-file/

[^25]: AIActGap. "EU AI Act Annex IV Technical File: Full Requirements & Checklist (2026)." August 1 2025. Nine-section breakdown; datasheet per dataset (Datasheets-for-Datasets format adapted for Article 10); SBOM generation explicitly listed. https://www.aiactgap.com/guides/annex-iv

[^26]: Annexa. "EU AI Act Annex IV: What Technical Documentation You Actually Need." February 24 2026. CEN-CENELEC JTC 21 7 primary harmonized standards in development; prEN 18286 most mature (QMS for AI Act compliance, public enquiry October 2025); Spain AESIA 16 practical guidance documents (Guide 15 = technical documentation). https://annexa.eu/blog/eu-ai-act-annex-iv-documentation/

[^27]: AI Resources / Nicola Fabiano. "Annex IV — Technical documentation." Mirror with full text of Article 11(1) referenced documentation requirements. https://ai-resources.eu/en/ai-act/allegati/allegato-04/

[^28]: Constantin Razvan Gospodin (Lexara Advisory). "Annex IV Technical Documentation." April 15 2026. SOC 2 / ISO 27001 not equivalent to Annex IV; AI-specific documentation required for training data governance, bias assessment, human oversight specifications. https://aiactregistration.com/annex-iv-technical-documentation.html

[^29]: Thibault Barrat (Marmelab). "MCP Security: Understanding Vulnerabilities in Model Context Protocol." February 16 2026. Tool Prompt Injection via .env file context manipulation; Cross Tool Hijacking via get_fact_of_the_day → email BCC contamination; "do not trust what the agent is doing"; never YOLO mode. https://marmelab.com/blog/2026/02/16/mcp-security-vulnerabilities.html

[^30]: Lorikeet Security. "MCP Is the New Supply Chain: 30 CVEs, a North Korean npm Hijack, and 7,000 Exposed Servers." April 16 2026. First 60 days 2026: 30+ CVEs, 13 Critical; 7,374 vulnerable MCP servers via Shodan; 24,008 secrets in MCP configs (2,117 confirmed live); March 31 North Korean Axios npm hijack via plain-crypto-js / SILKBELL / WAVESHAPER.V2 RAT; CVE inventory CVE-2026-26118 / CVE-2026-21852 / CVE-2025-59536 / CVE-2026-30615 / CVE-2026-25536 / CVE-2025-66414 / CVE-2026-20205. https://lorikeetsecurity.com/blog/mcp-supply-chain-attacks-ai-agent-security

[^31]: Aguardic. "MCP Prompt Injection Is a Supply Chain Problem, Not a Prompt Problem." March 18 2026. Context7 MCP server vuln; tool-mediated prompt injection worse than standard PI because trusted source; enforcement at tool-call layer not prompt layer; pre-execution policy checks on tool calls. https://www.aguardic.com/blog/mcp-prompt-injection-supply-chain

[^32]: PolicyLayer. "Hidden Instructions in MCP Tool Descriptions." April 19 2026. description / parameters / inputSchema fields; MCPTox formalization; mitigations: snapshot tools/list at approval + re-check on session start + scan IMPORTANT tags + zero-width Unicode + transport-layer proxy with size + content + destination constraints. https://policylayer.com/attacks/hidden-instructions-in-tool-descriptions

[^33]: PolicyLayer. "MCP Tool Poisoning: Prompt Injection via Tool Metadata." April 19 2026. Invariant Labs disclosure 1 April 2025; reproduction code github.com/invariantlabs-ai/mcp-injection-experiments; tool shadowing; WhatsApp MCP exfiltration April 2025; rug-pull / sleeper tools via tools/list_changed. https://policylayer.com/attacks/tool-poisoning

[^34]: ISO. "ISO/IEC 42001:2023 Information technology — Artificial intelligence — Management system." International AI management system standard published December 2023. https://www.iso.org/standard/81230.html

[^35]: Invariant Labs. "MCP Security Notification: Tool Poisoning Attacks." April 1 2025. Foundational tool-poisoning disclosure; Cursor exfiltration of ~/.ssh/id_rsa via poisoned add tool; tool shadowing send_email BCC hijack. https://invariantlabs.ai/blog/mcp-security-notification-tool-poisoning-attacks

[^36]: CISA. "Software Bill of Materials (SBOM) guidance." NTIA-aligned minimum elements; precedent for AIBOM regulatory adoption; foundational reference for U.S. federal procurement. https://www.cisa.gov/sbom

[^37]: SPDX. "SPDX 3.0 AI Profile." Released December 2024; alternative AIBOM standard to CycloneDX. https://spdx.org/specifications/

[^38]: Aim Security. "Aim Labs research blog." Ongoing research on Microsoft 365 Copilot vulnerabilities + LLM scope violation patterns; original EchoLeak (CVE-2025-32711) disclosure context. https://blog.aim.security

[^39]: Endor Labs. "AIBOM analyst commentary." Endor Labs analyst commentary on AIBOM as the next SBOM-style supply chain artifact; SCA tooling adaptation for AI components.[^39] https://www.endorlabs.com/learn

[^40]: Anchore. "AI Supply Chain Posture Management." Anchore SCA practitioner perspective on extending SBOM workflows to AIBOM; CycloneDX 1.6 compatibility and policy-as-code integration. https://anchore.com/blog/

[^41]: Chainguard. "Chainguard Images for AI." Chainguard's hardened-image perspective on the AI supply chain; SBOM-attestation parallels for AIBOM signing pipelines. https://www.chainguard.dev/

[^42]: Socket. "Supply chain attack research and AI dependency monitoring." Socket's npm + pip threat-feed coverage of the March 31 2026 Axios npm hijack and adjacent MCP supply-chain incidents. https://socket.dev/blog

[^43]: Dependabot research blog. "AIBOM and dependency-graph extension to AI components." GitHub Dependabot perspective on extending automated dependency monitoring to MCP servers + model versions + dataset references. https://www.dependabot.com/blog/

---
title: "The MCP Buyer's Field Manual"
subtitle: "What enterprises actually evaluate — RFP language, vendor scorecard, deployment audit"
publication: "perea.ai Research"
authors: ["Dante Perea"]
version: "1.0"
status: "Public draft"
date: "2026-05"
audience: "CISOs and security leads writing MCP server vendor questionnaires; platform engineering leaders building the build-vs-buy decision; procurement teams sourcing MCP gateways and registries; founders selling MCP servers into the Fortune 500"
length: "~3,400 words"
license: "CC BY 4.0"
description: "The buyer-side companion to mcp-server-playbook.md. Maps the four-component MCP platform (registry / gateway / identity / observability) every Fortune 500 evaluation now requires, the OWASP MCP Top 10 questionnaire baseline, the six-dimension vendor scorecard with weighted scoring, the Anthropic signed registry trust model, Cloudflare's published reference architecture for non-engineering teams, and the SSOJet 10-question CISO intake. Built for procurement teams writing RFPs in mid-2026."
profile: "field-manual"
---

## 1. The category, in one sentence

Twelve months after the MCP Server Playbook was the canonical guide for the *vendor* side, the buyer side has caught up. Every Fortune 500 enterprise security review now asks specific MCP-shaped questions; OWASP has shipped a Top 10 specifically for MCP; Anthropic has launched a signed registry; Cloudflare has published its own internal reference architecture. The procurement question is no longer "should we deploy MCP servers?" but "which 30 of the 8,000+ public MCP servers do we let our agents touch, under what governance, and how do we evidence it during the next audit?"

This paper is the field manual for that buyer-side procurement workstream.

## 2. The four-component MCP platform

The Stacklok MCP Platform Buyers Guide — itself the most widely-cited buyer-side framework as of mid-2026 — names the four components every credible enterprise MCP platform must offer:[^1]

- **Registry** — central catalog of approved MCP servers with approval workflows. "Without a registry, you have no visibility into what MCP servers are running across the organization."[^1]
- **Gateway** — the runtime intermediary between agents and MCP servers, with policy enforcement at tool-call time.
- **Identity** — authentication and authorization integration with the enterprise identity provider, supporting OAuth 2.1 + PKCE, SSO, and agent-vs-human identity separation.
- **Observability** — structured audit logs, SIEM integration, and forensic-grade traceability per tool invocation.

Stacklok's framing of the build-vs-buy decision identifies four criteria:[^2]

| Criterion | Lean toward build | Lean toward buy |
|---|---|---|
| Time-to-value | 6+ months acceptable | Need control in weeks |
| Engineering competency | Short queue + platform sensibilities | Engineering team skews to apps |
| Ongoing capacity | Ample bandwidth | Competing internal priorities |
| Operational complexity | Smaller deployment, defined depts | MCP-native ambition (100+ servers) |

The honest result of those four criteria for most enterprises in 2026 is *buy* — and the rest of this paper is about how to evaluate what you're buying.

## 3. The OWASP MCP Top 10 — the questionnaire baseline

OWASP published the MCP Top 10 in late 2025, modeled on the classic OWASP Web Top 10 but tailored to MCP's threat model: an AI agent consuming tool descriptions, calling tools autonomously, and trusting tool output.[^3][^4] As of v0.1, the ten risks:[^3]

1. **MCP01:2025** — Token Mismanagement & Secret Exposure
2. **MCP02:2025** — Privilege Escalation via Scope Creep
3. **MCP03:2025** — Tool Poisoning
4. **MCP04:2025** — Software Supply Chain Attacks & Dependency Tampering
5. **MCP05:2025** — Command Injection & Execution
6. **MCP06:2025** — Intent Flow Subversion
7. **MCP07:2025** — Insufficient Authentication & Authorization
8. **MCP08:2025** — Lack of Audit and Telemetry
9. **MCP09:2025** — Shadow MCP Servers
10. **MCP10:2025** — Context Injection & Over-Sharing

Two empirical numbers anchor the urgency. Pynt's 2025 analysis of 281 MCP implementations found that ten interconnected servers push exploitation probability to 92%.[^5] Over 8,000 MCP servers are publicly accessible without authentication, and 66% of community servers have at least one critical code smell.[^4]

Microsoft published an Azure-specific OWASP MCP Top 10 implementation guide that maps each risk to a coverage tier — FULL (production-ready Azure services), PARTIAL (core services + custom work), or NEW (emerging patterns):[^6]

- **FULL coverage**: MCP01 (Secrets), MCP05 (Commands), MCP06 (Prompts), MCP07 (Auth), MCP08 (Logging)
- **PARTIAL**: MCP02 (Scope creep), MCP10 (Context sharing)
- **NEW**: MCP03 (Tool poisoning), MCP04 (Supply chain), MCP09 (Shadow servers)

The five risks at FULL coverage are the table-stakes baseline; the two at PARTIAL and three at NEW are where vendor differentiation lives.

## 4. The six-dimension vendor scorecard

Truto's April 2026 buyer's guide and AgentRank's quality-signal framework converge on a six-dimension scorecard with explicit weight tiers:[^7][^8]

| Dimension | Weight | What "5" looks like | What "1" looks like |
|---|---|---|---|
| Rate limit transparency[^7] | 15-20%[^7] | Pass-through with standardized headers[^7] | Silent retry[^7] |
| OAuth lifecycle[^7] | 15%[^7] | Proactive refresh, clear re-auth detection[^7] | Manual token management[^7] |
| TTL server lifecycle[^7] | 10%[^7] | Built-in expiration with auto cleanup[^7] | No expiration[^7] |
| Method-level access control[^7] | 20%[^7] | Category + method + tag filters[^7] | All-or-nothing access[^7] |
| Audit logging[^7] | 20%[^7] | Structured logs with request IDs, per-tool[^7] | No logging[^7] |
| Unified data model[^7] | 10%[^7] | Consistent schema across providers[^7] | Provider-native only[^7] |

The AgentRank quality framework adds five quantified signals for evaluating individual MCP servers — not platforms — with weights:[^8]

- **Freshness** (25%[^8]) — last commit within 60 days
- **Issue health** (25%[^8]) — close rate above 50%[^8]
- **Inbound dependents** (25%[^8]) — at least one other repo depending on it
- **Stars** (15%[^8]) — popularity signal but not quality
- **Contributors** (10%[^8]) — five or more for production trust

The cutoff line: only 26%[^8] of the AgentRank index scores above 65 (production-ready 80–100 or active-and-viable 65–79); 74% is the long tail of abandoned experiments.[^8] mongodb-js/mongodb-mcp-server (88.44) and redis/mcp-redis (86.59) are the canonical production-ready references.[^8]

The five-factor ChatForest framework runs in roughly the same direction — maintenance, security posture, feature completeness, performance/transport, integration fit — with the practical decision cutoff: "if you can answer yes to all five, you've found your server. If not, the framework above helps you identify exactly where the gaps are — and whether they're deal-breakers or acceptable trade-offs."[^9]

## 5. The signed registry — Anthropic + the namespace authority model

The single most important supply-chain change of 2026 was the Anthropic-led MCP Signed Registry. The infrastructure:[^10][^11]

- **Production registry**: `registry.modelcontextprotocol.io`, in API freeze v0.1 since October 24, 2025.[^10]
- **Maintainers**: Adam Jones (Anthropic), Tadas Antanavicius (PulseMCP), Toby Padilla (GitHub), Radoslav Dimitrov (Stacklok).[^10]
- **Backers**: Anthropic, GitHub, PulseMCP, Microsoft as named trusted contributors.[^11]
- **Spec status**: April 2026 published a draft registry + signing spec with sigstore-style attestation and a curated trusted publisher list.[^12]

The trust mechanism is namespace authentication via reverse-DNS:[^11] `io.github.username/server` (verify GitHub identity), `me.adamjones/my-cool-mcp` (prove ownership of `adamjones.me` via DNS or HTTP challenge). Publishing supports four authentication methods:[^10]

- **GitHub OAuth** — for publishing by logging into GitHub
- **GitHub OIDC** — for publishing from GitHub Actions
- **DNS verification** — for proving ownership of a domain
- **HTTP verification** — for proving ownership of a domain

The procurement-side use of the signed registry is straightforward: "Treat third-party MCP servers like third-party packages: source from signed registries, pin versions, scope permissions tightly, and audit calls in production. The Anthropic signed registry is the right default. Anything outside it gets a manual security review."[^13]

The policy implication for an enterprise-side allowlist is concrete:[^14]

1. Approve only servers in the Anthropic registry, OR
2. Approve servers under namespaces your organization explicitly trusts (e.g., `com.yourcompany/*`), OR
3. Run a fork-and-pin process where any community server enters your private registry mirror only after a security review.

CallSphere's analysis frames the signed registry as analogous to NPM, PyPI, and Docker Hub: "the signed MCP registry creates the foundation for a real marketplace economy around agent tools: vendors can publish, organizations can curate private mirrors, and security teams can enforce signing policies."[^14]

## 6. The CISO's ten questions

SSOJet's April 2026 vendor evaluation framework — distilled from Pynt's 281-implementation analysis — gives the ten questions every enterprise security intake should ask before enabling any MCP server in production.[^5] The scorecard: 2 points for a clear, specific answer; 1 point for a partial answer; 0 for "we're working on it" or no answer. 16–20 = strong posture; 10–15 = meaningful gaps requiring remediation; below 10 = do not enable.[^5]

The ten questions:[^5]

1. **Authorization model** — what does your MCP server use? OAuth 2.1 + PKCE is the floor; the March 2025 MCP spec mandated OAuth 2.1 for remote HTTP servers.[^15]
2. **IdP integration** — how does it integrate with our identity provider (Entra ID, Okta, etc.)?
3. **Agent identity management** — how are agent identities managed separately from human identities?
4. **OAuth scopes** — what scopes does your MCP server request, and can they be restricted?
5. **Prompt injection prevention** — how does your platform prevent prompt injection through MCP tool results?
6. **Token lifetime + rotation** — what is the policy for MCP sessions and how is rotation handled?
7. **Audit trail coverage** — what does it cover for agent-initiated actions?
8. **Cross-app access + audience validation** — how does your server handle token audience claims?
9. **Human-in-the-loop confirmation** — do high-risk actions require it?
10. **Incident response path** — what happens when an MCP session is compromised?

Per SSOJet's analysis, questions 3, 7, and 9 surface gaps most often, because they require MCP-specific engineering work that many vendors haven't done yet.[^5] Questions 1 and 8 (OAuth 2.1 and audience validation) are gaps in older implementations built before the March and June 2025 MCP spec updates, when the spec made Resource Indicators (RFC 8707) mandatory and explicitly prohibited token passthrough.[^15]

The June 2025 spec update is the dividing line: any MCP server that didn't implement Resource Indicators to bind tokens to specific resources is now a documented vulnerability category.[^15]

## 7. Cloudflare's enterprise reference architecture

On April 14, 2026, Cloudflare published the first public reference architecture describing a Model Context Protocol deployment past the engineering silo.[^16] The four-plane model the post named — and the controls Cloudflare deployed in production:[^17]

| Plane | Primitive | What it controls |
|---|---|---|
| Identity | Cloudflare Access (OAuth, SSO, MFA, device + location attributes) | Who can reach which MCP server |
| Discovery and policy | MCP server portals | Which servers appear in an agent's catalog per role |
| Model mediation | AI Gateway | Routing, per-employee token limits, logging, provider switching |
| Content | DLP + Gateway HTTP policies | PII redaction, pattern-based egress blocking |
| Shadow traffic | Gateway + DLP scanning | Detection of unsanctioned MCP traffic |

The Cloudflare team built a centralized MCP platform inside their monorepo: "When an employee wants to expose an internal resource via MCP, they first get approval from our AI governance team, and then they copy a template, write their tool definitions, and deploy, all the while inheriting default-deny write controls, audit logging, auto-generated CI/CD pipelines, and secrets management for free."[^16]

The shadow-MCP detection is particularly instructive. Cloudflare uses Gateway API to perform multi-layer scans for remote MCP servers not accessed via the portal:[^16]

- **Gateway `httpHost` selector**: scans for known MCP server hostnames.
- **DLP-based body inspection**: detects MCP traffic by recognizing JSON-RPC-over-HTTP method calls (`tools/call`, `prompts/get`, `initialize`).

Victorino's April 20, 2026 critique of the Cloudflare reference is the most useful caveat for buyers:[^17] the post describes "default-deny write controls at the MCP server template layer ... that default-deny write model does not appear in the canonical `cloudflare-one/access-controls/ai-controls/mcp-portals/` documentation. It lives in the blog post and the template. Treat it as a strong reference implementation, not a platform guarantee."[^17]

The procurement implication: ask vendors to document default-deny write controls *in the product*, not in marketing material. Same for audit granularity ("Do logs capture tool arguments and outputs, not just the capability name and duration? Can you reconstruct a multi-tool chain of custody?"[^17]) and shadow-MCP blocking posture ("Is detection wired to a policy that blocks, or does it stop at a dashboard? If the answer is dashboard, you have logs, not controls."[^17]).

The Cloudflare One documentation now ships first-class MCP integrations:[^18][^19]

- **Self-hosted MCP applications**: Cloudflare Access handles full OAuth, MCP server validates `Cf-Access-Jwt-Assertion` header.[^18]
- **Access for SaaS (OIDC)**: MCP server implements OAuth client against Access, gets `access_token` for downstream calls.[^18]
- **MCP server portals**: centralize multiple MCP servers onto a single HTTP endpoint with Logpush export to SIEM.[^19]
- **Fine-grained RBAC**: resource-scoped roles for Apps, Identity Providers, and Targets in public beta.[^19]

## 8. Gateway products and the per-tool RBAC pattern

Beyond Cloudflare, the gateway category has three live patterns. Lasso Security's open-source `mcp-gateway` ships plugin-based PII masking, prompt injection detection, and a security scanner with reputation analysis (threshold blocking at score 30):[^20] "Reputation Analysis evaluates server reputation using marketplace (Smithery, NPM) and GitHub data. Tool Description Scanning detects hidden instructions, sensitive file patterns, and malicious actions."[^20]

Rapid Claw's managed MCP gateway documents the canonical layered defense:[^21] OAuth 2.1 + per-agent JWT + mTLS to MCP servers; per-tool RBAC with default-deny and argument constraints; four-dimension rate limits (per-agent, per-tool, per-tenant, per-environment); output validation with schema enforcement and untrusted-content wrapping; managed KMS with per-tenant envelopes; three-zone network topology with egress allowlisting; immutable audit log (1-year retention, 6-year on HIPAA plans).

Per Rapid Claw's framing of the per-tool model:[^21] "The common mistake is to treat MCP permissions at the server level: 'this agent can talk to the Jira MCP server.' That is far too broad. The Jira MCP server has thirty tools, some read-only, some that create public pages, some that delete projects. Your permission model needs to live at the tool level, not the server level."[^21]

Truto's six-dimension scorecard, applied across Composio, StackOne, Arcade.dev, and Truto, captures the architectural divergence:[^7]

| Capability | Composio | StackOne | Arcade.dev | Truto |
|---|---|---|---|---|
| Tool generation | Pre-built actions | Pre-built + catalog | Auto-generated | Pass-through with IETF headers |
| Auth model | Centralized | Tenant-scoped | User-delegated | Method + tag filters + TTL |
| Best for | Consumer-facing agents | B2B agents in production | Interactive agents | Autonomous against enterprise SaaS |

StackOne specifically advertises 200+ connectors, 10,000+ actions, and the audit-log primitive: "List Audit Logs - List audit log events for the account showing who made changes and when."[^22] StackOne's architectural choice is to surface IETF-standard rate-limit headers transparently rather than absorb them silently.[^7]

## 9. Production-readiness checklist

The MCP Enterprise Deployment Guide for 2026 gives the most concrete production-grade checklist:[^23]

| Area | Requirement | Tool |
|---|---|---|
| Containers | Non-root user, read-only rootfs | Docker, Kubernetes PodSecurityStandards |
| Encryption | TLS in transit, mTLS internal | cert-manager, Istio |
| Identity | OAuth 2.1 + PKCE, Entra ID SSO | Kong, Auth0, Entra ID |
| Rate limiting | Per-user sliding window, Redis-backed | Kong, nginx-ingress |
| Observability | Metrics, logs, traces | Prometheus, Datadog, Jaeger |
| Availability | 3+ replicas, PDB, health probes | Kubernetes Deployment |
| CI/CD | Automated tests + manual prod approval | CircleCI, GitHub Actions |

The deployment specifics:[^23] terminate public TLS at the ingress controller (nginx or AWS ALB), mTLS between AI gateway and MCP pods (cert-manager + Let's Encrypt or internal CA), OAuth 2.1 + PKCE for SSO, sliding-window rate limiting keyed on user ID rather than IP, structured audit log retention of 90 days minimum (SOC 2 / ISO 27001 floor), Kubernetes namespace per tenant with dedicated secrets and RBAC.

Prefect's nine-platform comparison adds the SOC 2 Type II + DLP angle:[^24] "If compliance certification is the gate blocking your AI rollout, start with MintMCP. Its SOC 2 Type II and pre-formatted audit logs are designed to clear that hurdle faster than anything else here. If data loss prevention is the specific concern, Lunar MCPX is the only platform with DLP built into the gateway to protect data in transit."[^24]

## 10. The RFP language

The compiled-from-the-research RFP language for any vendor exposing an MCP server:

> Vendor MUST implement OAuth 2.1 with PKCE for all remote HTTP MCP connections per the March 2025 MCP spec.[^15] Vendor MUST implement Resource Indicators (RFC 8707) per the June 2025 spec update.[^15] Vendor MUST publish to a signed registry (Anthropic registry as default, or document an alternate signed registry); third-party servers without signing require manual security review.[^14] Vendor MUST provide tool-level (not server-level) RBAC.[^21] Vendor MUST emit structured audit logs covering identity, tool name, parameters, timestamp, and outcome per tool invocation, with SIEM-exportable format.[^25] Vendor MUST document token lifetime (default 15–60 minutes), rotation policy, and revocation path.[^21] Vendor MUST document the human-in-the-loop confirmation policy for high-risk actions.[^5] Vendor MUST publish coverage of all 10 OWASP MCP Top 10 risks with remediation evidence per risk.[^3] Vendor SHOULD support DLP scanning at the gateway layer for PII and sensitive data egress.[^16] Vendor SHOULD provide multi-tenant namespace isolation enforced at the storage layer (Kubernetes namespaces or equivalent).[^23]

The "MUST" items are the table-stakes baseline; failing any one is grounds for rejection. The "SHOULD" items are differentiators that separate enterprise-grade platforms from lighter alternatives.

## 11. What this paper does not cover

This paper deliberately stops short of: the build-side guidance covered in `mcp-server-playbook.md`; the cryptographic mandate stack covered in `trust-layer-deep-dive.md`; the supplier-side bot identity layer covered in `verifiable-bot-stack.md`; the agent-payment integration covered in `agent-payment-stack-2026.md`; the observability deep-dive covered in `agent-observability-stack`; and the agent-UX inbox primitive covered in `agent-inbox-ux`. Each of those is a distinct authority survey in the perea.ai canon.

The next paper in this thread will examine the private-registry curation pattern specifically — how Fortune 500 platform teams are running internal MCP registries that mirror the Anthropic public registry while enforcing organization-specific allowlists — because that is the procurement primitive that decides whether the MCP supply chain is governed or shadow.

---

## References

[^1]: Stacklok. "The MCP Platform Buyers Guide for Platform Teams." Accessed May 2026. https://stacklok.com/resources/the-mcp-platform-buyers-guide-for-platform-teams/
[^2]: Stacklok. "Model Context Protocol Maturity Model." Accessed May 2026. https://stacklok.com/resources/model-context-protocol-maturity-model/
[^3]: OWASP. "OWASP MCP Top 10." Accessed May 2026. https://owasp.org/www-project-mcp-top-10/
[^4]: LangSight. "OWASP MCP Top 10 (2026): Practical Security Guide for Every Risk." April 2, 2026. https://langsight.dev/blog/owasp-mcp-top-10-guide/
[^5]: SSOJet. "10 Questions Every CISO Should Ask Before Enabling MCP Servers." April 28, 2026. https://ssojet.com/blog/ciso-mcp-server-security-questions
[^6]: Microsoft. "OWASP MCP Top 10 Security Guidance for Azure." David Barkol. Accessed May 2026. https://microsoft.github.io/mcp-azure-security-guide/
[^7]: Truto. "Buyer's Guide: Best MCP Server Platforms for Enterprise AI Agents (2026)." Nachi Raman. April 21, 2026. https://truto.one/blog/buyers-guide-best-mcp-server-platforms-for-enterprise-2026/
[^8]: AgentRank. "How to Choose an MCP Server in 2026." March 17, 2026. https://agentrank-ai.com/blog/how-to-choose-an-mcp-server/
[^9]: ChatForest. "How to Choose the Right MCP Server: A Practical Evaluation Framework." March 27, 2026. https://chatforest.com/guides/how-to-choose-mcp-servers/
[^10]: ModelContextProtocol. "MCP Registry GitHub repository." Accessed May 2026. https://github.com/modelcontextprotocol/registry/
[^11]: ModelContextProtocol. "The MCP Registry — About." Accessed May 2026. https://modelcontextprotocol.org/registry/about
[^12]: CallSphere. "MCP server signing and a trusted registry — what April 2026 set in." April 18, 2026. https://callsphere.ai/blog/td30-rp-mcp-server-signing-and-registry-2026
[^13]: CallSphere. "Anthropic's MCP Signed Registry: A New Trust Model for Tools." Accessed May 2026. https://callsphere.ai/blog/td30-fw-mcp-signed-registry-anthropic-trust-model-2026.md
[^14]: CallSphere. "Signed MCP Registry: How Anthropic Is Securing the Tool Supply Chain." April 21, 2026. https://callsphere.ai/blog/td30-anth-mcp-signed-registry
[^15]: SSOJet. "7 MCP Authentication Vulnerabilities B2B SaaS Vendors Must Prevent." April 28, 2026. https://ssojet.com/blog/mcp-authentication-vulnerabilities
[^16]: Cloudflare. "Scaling MCP adoption: Our reference architecture." April 14, 2026. http://blog.cloudflare.com/enterprise-mcp/
[^17]: Victorino Group. "Enterprise MCP Just Crossed the Engineering Line." April 20, 2026. https://victorinollc.com/thinking/enterprise-mcp-crosses-silo
[^18]: Cloudflare. "Secure MCP servers — Cloudflare One docs." Accessed May 2026. https://developers.cloudflare.com/cloudflare-one/access-controls/ai-controls/saas-mcp/
[^19]: Cloudflare. "Access Changelog — MCP server portals, Logpush, fine-grained RBAC." Accessed May 2026. http://developers.cloudflare.com/cloudflare-one/changelog/access/
[^20]: Lasso Security. "MCP Gateway." GitHub. Accessed May 2026. https://github.com/lasso-security/mcp-gateway/
[^21]: Rapid Claw. "Hardening the MCP Spec — OAuth 2.1, Per-Tool RBAC & Prompt Injection Defenses (2026)." April 20, 2026. https://rapidclaw.dev/blog/mcp-gateway-security-guide-2026
[^22]: StackOne. "Cloudflare MCP Server & Integration for AI Agents." Accessed May 2026. https://stackone.com/connectors/cloudflare
[^23]: MCP Guide. "MCP Enterprise Deployment: Production Guide for 2026." Accessed May 2026. https://mcpguide.dev/blog/mcp-enterprise-deployment
[^24]: Prefect. "9 Best MCP Servers and MCP Deployment Platforms for Enterprise Teams in 2026." April 6, 2026. https://www.prefect.io/resources/best-mcp-deployment-platforms-enterprise-2026
[^25]: Truto. "Best MCP Server Platforms for AI Agents Connecting to Enterprise SaaS in 2026." April 6, 2026. https://truto.one/blog/best-mcp-server-platform-for-ai-agents-connecting-to-enterprise-saas
[^26]: YUPL. "MCP Server Security Checklist 2026." April 19, 2026. https://yupl.com/blog/mcp-server-security-checklist-2026
[^27]: MCP Manager. "Security Screening MCP Servers — Checklists." Accessed May 2026. https://github.com/MCP-Manager/MCP-Checklists/blob/main/infrastructure/docs/security-screening-mcp-servers.md
[^28]: Anthropic. "Anthropic MCP Directory Policy." Accessed May 2026. https://support.anthropic.com/en/articles/11697096-anthropic-mcp-directory-policy
[^29]: Agentic Community. "Anthropic Registry Import — mcp-gateway-registry." Accessed May 2026. https://github.com/agentic-community/mcp-gateway-registry/blob/main/docs/anthropic-registry-import.md
[^30]: Cloudflare. "Code Mode for MCP server portals — token cost reduction." April 2026. http://blog.cloudflare.com/enterprise-mcp/
[^31]: Stacklok. "Track record + completeness criteria for MCP platform vendors." Accessed May 2026. https://stacklok.com/resources/model-context-protocol-maturity-model/
[^32]: Stacklok. "Federated token exchange + cryptographic server provenance checks." Accessed May 2026. https://stacklok.com/resources/model-context-protocol-maturity-model/
[^33]: AgentRank. "AgentRank score thresholds: 80-100 production, 65-79 active, 40-64 experimental." March 2026. https://agentrank-ai.com/blog/how-to-choose-an-mcp-server/
[^34]: AgentRank. "Production-ready references: mongodb-js/mongodb-mcp-server (88.44), redis/mcp-redis (86.59)." March 2026. https://agentrank-ai.com/blog/how-to-choose-an-mcp-server/
[^35]: ModelContextProtocol. "Registry namespace authentication — io.github.username/server, com.example/server formats." Accessed May 2026. https://modelcontextprotocol.org/registry/about
[^36]: SSOJet. "Token passthrough explicitly prohibited in June 2025 MCP spec update." April 2026. https://ssojet.com/blog/mcp-authentication-vulnerabilities
[^37]: Microsoft. "Network isolation as defense-in-depth foundation for MCP deployments." Accessed May 2026. https://microsoft.github.io/mcp-azure-security-guide/
[^38]: LangSight. "MCP-01 (Tool Description Injection) detection: scan for imperative instructions, base64-encoded strings, zero-width Unicode." April 2026. https://langsight.dev/blog/owasp-mcp-top-10-guide/
[^39]: LangSight. "CVE-2025-6514 RCE in mcp-remote — automated CVE scanning required." April 2026. https://langsight.dev/blog/owasp-mcp-top-10-guide/
[^40]: SSOJet. "Resource Indicators (RFC 8707) mandate from June 2025 MCP spec update." April 2026. https://ssojet.com/blog/mcp-authentication-vulnerabilities
[^41]: Stacklok. "Tool filtering and virtual MCP server composition — meaningful differentiator." Accessed May 2026. https://stacklok.com/resources/the-mcp-platform-buyers-guide-for-platform-teams/
[^42]: Truto. "Rate limit transparency — pass-through with normalized headers as scoring criterion." April 2026. https://truto.one/blog/best-mcp-server-platform-for-ai-agents-connecting-to-enterprise-saas
[^43]: Cloudflare. "MCP server portal Gateway routing for HTTP request logging + DLP scanning." Accessed May 2026. http://developers.cloudflare.com/cloudflare-one/changelog/access/
[^44]: Cloudflare. "Fine-grained RBAC for Apps, Identity Providers, and Targets in public beta." Accessed May 2026. http://developers.cloudflare.com/cloudflare-one/changelog/access/
[^45]: Victorino. "Six procurement questions: adoption depth, default-deny writes, audit granularity, budget governance, DLP intent, shadow-MCP blocking posture." April 2026. https://victorinollc.com/thinking/enterprise-mcp-crosses-silo
[^46]: YUPL. "MCP-focused security questionnaire mapping to ISO 27001, SOC 2 CC6/CC7, EU CRA." April 2026. https://yupl.com/blog/mcp-server-security-checklist-2026
[^47]: MCP Manager. "Tool poisoning, rug pull, RADE, cross-server shadowing, server spoofing risk taxonomy." Accessed May 2026. https://github.com/MCP-Manager/MCP-Checklists/blob/main/infrastructure/docs/security-screening-mcp-servers.md
[^48]: ChatForest. "Five-factor framework: maintenance + community health, security posture, feature completeness, performance + transport, integration fit." March 2026. https://chatforest.com/guides/how-to-choose-mcp-servers/
[^49]: Stacklok. "MCP server lifecycle — Kubernetes operator with CRD-based management." Accessed May 2026. https://stacklok.com/resources/the-mcp-platform-buyers-guide-for-platform-teams/
[^50]: Truto. "OAuth refresh mechanics: proactive vs reactive, re-auth detection." April 2026. https://truto.one/blog/best-mcp-server-platform-for-ai-agents-connecting-to-enterprise-saas
[^51]: Rapid Claw. "Default-deny per-tool RBAC with argument-shape constraints." April 2026. https://rapidclaw.dev/blog/mcp-gateway-security-guide-2026
[^52]: MCP Guide. "Audit log retention 90 days minimum for SOC 2 / ISO 27001." Accessed May 2026. https://mcpguide.dev/blog/mcp-enterprise-deployment
[^53]: Cloudflare. "Shadow-MCP detection via Gateway httpHost selector + DLP body inspection on JSON-RPC method field." April 2026. http://blog.cloudflare.com/enterprise-mcp/
[^54]: Lasso Security. "MCP Gateway plugin guardrails: PII masking, prompt injection detection, harmful content filtering." Accessed May 2026. https://github.com/lasso-security/mcp-gateway/
[^55]: Rapid Claw. "Four-dimension rate limits: per-agent, per-tool, per-tenant, per-environment." April 2026. https://rapidclaw.dev/blog/mcp-gateway-security-guide-2026
[^56]: Prefect. "MintMCP SOC 2 Type II + Lunar MCPX DLP-built-into-gateway differentiation." April 2026. https://www.prefect.io/resources/best-mcp-deployment-platforms-enterprise-2026
[^57]: SSOJet. "Vulnerability 7 (Absent Audit Trails) flagged as quick-detect, frequent-exploit gap." April 2026. https://ssojet.com/blog/mcp-authentication-vulnerabilities
[^58]: Cloudflare. "AI Gateway between MCP client and LLM for vendor-lock-in prevention + per-employee token cost limits." April 2026. http://blog.cloudflare.com/enterprise-mcp/
[^59]: ModelContextProtocol. "Anthropic, GitHub, PulseMCP, Microsoft as named registry trusted contributors." Accessed May 2026. https://modelcontextprotocol.org/registry/about
[^60]: StackOne. "200+ connectors, 10,000+ actions, audit log primitives." Accessed May 2026. https://stackone.com/connectors/cloudflare
[^61]: Anthropic. "Anthropic Software Directory Policy and trust model — second author Adam Jones." Accessed May 2026. https://support.anthropic.com/en/articles/11697096-anthropic-mcp-directory-policy

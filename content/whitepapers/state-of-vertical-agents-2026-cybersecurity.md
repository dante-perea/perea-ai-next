---
title: "State of Vertical Agents 2026: Cybersecurity Operations"
subtitle: "Wiz $32B Google acquisition, $3.6B in agentic-AI-defense startup funding, Charlotte AI + Purple AI Athena + Cortex AgentiX + Security Copilot — and the 51-second breach reality that killed manual SOC response"
publication: "perea.ai Research"
authors: ["Dante Perea"]
version: "1.0"
status: "Public draft"
date: "2026-05"
audience: "Founders, GTM leads, and product teams selling AI agents into cybersecurity operations — SOC platforms, MDR/MSSP, DSPM, compliance automation, identity, threat detection, supply-chain security."
length: "~5,400 words"
license: "CC BY 4.0"
description: "The ninth entry in the State of Vertical Agents series, mapping the cybersecurity-operations AI agent market as it exists in May 2026. Covers the Wiz $32B Google acquisition (closed March 2026, largest pure-play cybersecurity acquisition on record); $3.6B raised cumulatively by agentic-AI-defense startups; $4.1B AI-native security VC; $96B total cybersecurity M&A 2025-2026. Documents the four agentic-SOC platform plays announced at RSAC 2026: CrowdStrike Charlotte AI + AgentWorks no-code security-agent builder; SentinelOne Purple AI Athena (opened to third-party SIEMs); Microsoft Security Copilot bundled into M365 E5 with 12 purpose-built agents; Palo Alto Cortex AgentiX trained on 1.2B real-world playbook executions; plus Cisco agentic security push, Arctic Wolf Aurora Superintelligence, Cynomi vCISO-as-a-service. The two architectural camps (Autonomous SOC vs Assisted Intelligence). The 51-second breach reality (manual SOC response time obsolete). 70% of orgs dedicating >10% security budget to AI. Five subvertical buying paths (SOC/SIEM/SOAR; DSPM; compliance automation; identity; supply-chain). The three failure modes (the agentic-blind-spot gap that survived all three RSAC announcements; the alert fatigue + accuracy floor; the third-party-MCP-server attack surface). Closes the cybersecurity vertical thread for the perea.ai canon."
---

## Foreword

This paper is the ninth entry in the State of Vertical Agents series. Previous entries mapped legal, insurance, healthcare, accounting, commercial real estate, construction, government, and pharma. Cybersecurity has long been a vertical the perea.ai canon discussed obliquely — the canon has multiple papers on prompt-injection defense, capability-based agent security, and agent observability — but those papers all describe **how to build secure AI agents**. This paper describes the inverse: **how to sell AI agents to the security organization**, which is its own vertical with its own buyers, its own communities, and its own buying motion.

The two are different markets. The first is a horizontal infrastructure problem; the second is a vertical with a $200B+ TAM, a CISO buyer with a defined budget allocation, and an established procurement motion through CISO peer networks, RSA Conference, Black Hat, MSSP partnerships, and the named SOC platform incumbents (CrowdStrike, SentinelOne, Microsoft, Palo Alto, Cisco). It has its own minimum-lovable-product communities, its own sales cycle, and its own compliance regime — and as of May 2026 it is the single most actively acquiring vertical-AI market measured in M&A dollars, with the **Wiz $32B Google acquisition closing March 2026** standing as the largest pure-play cybersecurity acquisition on record.

This paper is for founders deciding whether to enter the security vertical, what subvertical to pick, and how to map the buying surface they will encounter.

## Executive Summary

1. **The cybersecurity vertical just executed the largest pure-play AI security acquisition in history.** **Google's $32B acquisition of Wiz closed March 11, 2026** — Wiz had grown from $0 to $100M ARR in 18 months and crossed $500M ARR by 2025. This is the canonical exit signal for the AI-native security category.

2. **All four major SOC incumbents shipped agentic SOC platforms in 2026, and the gap between them is now strategic, not technical.** **CrowdStrike Charlotte AI + Charlotte Agentic SOAR + AgentWorks** (no-code security-agent builder; ecosystem partners Accenture, AWS, Anthropic, Deloitte, Kroll, NVIDIA, OpenAI, Salesforce, Telefónica Tech). **SentinelOne Purple AI Athena** (opened to third-party SIEMs and data lakes — breaking the ecosystem-lock-in pattern). **Microsoft Security Copilot bundled into M365 E5 with 12 purpose-built agents** across Defender, Entra, Intune, Purview. **Palo Alto Cortex AgentiX trained on 1.2B real-world playbook executions** with **$1B+ cumulative XSIAM bookings**. The choice between them is now an architectural choice (autonomous-decisioning vs assisted-analyst), not a feature comparison.

3. **AI-native security startups raised $4.1B in 2025 at 47% YoY growth, with $3.6B going specifically to agentic-defense companies.** Total cybersecurity M&A across 2025-2026 reached **~$96B**. Named scaled players include **ChainGuard** ($600M+ raised, $3.5B valuation, $40M → $100M ARR FY2025-FY2026), **Drata** ($100M ARR, 60% YoY, 7,000+ customers, AI agents + MCP server), **Vectra AI** (#3 AI-native security startup ranking 2026), **Cyera, Horizon3.ai, Sublime Security**.

4. **The 51-second breach reality killed manual SOC response.** The mean time from initial intrusion to lateral movement is now under one minute in commodity ransomware operations, and the human SOC analyst is structurally too slow. This is the **economic forcing function** behind every agentic-SOC purchase in 2026 — autonomous triage and response is no longer a differentiator, it is a survival requirement.

5. **70% of organizations now dedicate >10% of their security budget to AI investments.** Budget allocation breaks down as Discovery and Visibility 30-35%, Governance and Policy 25-30%, Data Protection 25-30%. CISOs are open-minded but lean toward existing vendors in the short term, which gives legacy incumbents (CrowdStrike, Palo Alto, Microsoft) a structural distribution advantage that startups must engineer around — not against.

6. **Three failure modes shape every cybersecurity AI agent deployment.** (a) **The agentic-blind-spot gap** — every agentic SOC platform shipped at RSAC 2026 still cannot baseline AI-agent behavior itself; an AI agent attacking another AI agent is invisible to the current generation of monitoring stacks. (b) **The alert-fatigue + accuracy floor** — autonomous-decisioning agents that misfire above a 1-2% false-positive rate burn SOC trust permanently and never recover; the accuracy floor is brutally narrow. (c) **The third-party-MCP-server attack surface** — Drata's MCP server pattern is being copied across the security stack, and every MCP server an enterprise adopts is a new authenticated-attacker entry point that did not exist in 2024.

7. **Founders selling AI agents into cybersecurity must pick one of five subvertical paths.** (1) **SOC platform (SIEM/SOAR/MDR)** — the largest, most contested category; competing with CrowdStrike, SentinelOne, Microsoft, Palo Alto, Splunk, IBM. (2) **DSPM (Data Security Posture Management)** — Wiz validated the category; Cyera, Concentric, Sentra, Symmetry are contenders. (3) **Compliance automation** — Drata, Vanta, Secureframe; AI-agent-augmented compliance is the new motion. (4) **Identity (workforce + non-human + agentic)** — Cisco's agentic-identity push, Astrix, Aembit. (5) **Software supply chain / open-source security** — ChainGuard, Snyk, Endor Labs, Socket. Each has a different CISO buyer, sales cycle, and price point.

---

## Part I: The Market

### Topline TAM

Global cybersecurity spending is projected at **~$240B in 2026**, growing at ~12% annually. The AI-augmented share is rising fast: by mid-2026, **AI-related security investment represents >10% of total security budgets at 70% of organizations**, putting the AI-security TAM at roughly **$24-30B/year** as a near-term floor and trending toward **$50-60B/year by 2028**.

The agentic-SOC sub-TAM is a subset, dominated by the four named platform incumbents (CrowdStrike, SentinelOne, Microsoft, Palo Alto) plus the disruptor tier (Wiz pre-acquisition, ChainGuard, Drata, Cyera, Vectra, Arctic Wolf, Cynomi). The MSSP/MDR sub-TAM is independently large at **$30B+/year** and growing as agentic AI lets MSSPs scale CISO-equivalent expertise across hundreds of customers per analyst.

### Capital flows

Three categories of capital flow shaped the 2025-2026 landscape:

1. **Mega-acquisitions.** **Google + Wiz $32B (closed March 11, 2026)** — the largest pure-play cybersecurity acquisition on record. **Cisco + Splunk $28B (2024)**. **Palo Alto Networks acquisitions** (multiple). **Total cybersecurity M&A 2025-2026: ~$96B.**
2. **AI-native security venture capital.** $4.1B raised in 2025, 47% YoY growth; **$3.6B specifically to agentic-AI-defense startups**.
3. **Public-market vendor capitalization.** CrowdStrike, Palo Alto Networks, Microsoft Security, SentinelOne, Cloudflare, Zscaler — combined market cap exceeds $1T as of mid-2026.

### Why now

Four 2025-2026 inflections compounded into the current market:

1. **The 51-second breach reality.** Mean intrusion-to-lateral-movement time dropped below 1 minute in commodity ransomware operations, structurally invalidating the human-SOC-analyst response motion.
2. **Agentic SOC platforms across all four incumbents** — Charlotte AI, Purple AI Athena, Security Copilot, Cortex AgentiX — shipped within a 6-month window in late 2025 / early 2026, normalizing agentic-decisioning as a category and enabling enterprise buyers to choose between architectural philosophies rather than feature lists.
3. **The Wiz acquisition** validated the category at strategic-asset scale; every CISO and every infrastructure-vendor M&A team now sees AI security as a top-3 acquisition target.
4. **MCP server proliferation** — Drata's launch of an MCP server (and similar moves by other compliance + security vendors) created both a new agentic capability and a new attack surface; the security community is responding with new monitoring categories within the same calendar quarter.

---

## Part II: The Buying Map

The CISO is the final decision authority for every meaningful security purchase, but the buying surface beneath them is structured. Founders selling AI security agents must understand the layers.

### Enterprise CISO direct

- **Discovery surface:** RSA Conference (April-May, San Francisco — 40,000+ attendees), Black Hat USA (August, Las Vegas), Gartner Security & Risk Management Summit (June), CISO peer networks (Evanta, IANS, Security Roundtable), CSO Online, Dark Reading, SC Magazine.
- **Procurement vehicle:** Direct enterprise sales; multi-year platform agreements; rarely PLG self-serve at this tier.
- **Reference deal sizes:** $500K-$25M+ annual.
- **Decision authority:** CISO, with input from VP Security Architecture, VP SOC, VP GRC, VP Identity.

### MSSP / MDR partner channel

- **Discovery surface:** MSSP Alert, Channel Insider, MSSP-specific events (e.g. ChannelCon, MSP Tools).
- **Procurement vehicle:** Channel partner programs; revenue-share or markup-based; co-sell agreements.
- **Reference deal sizes:** Vendor-to-MSSP $50K-$5M; MSSP-to-customer $25K-$500K per customer.
- **Decision authority:** MSSP/MDR Head of Engineering or Head of Service Delivery.
- **Relevant scaled players:** Arctic Wolf, eSentire, Trustwave, Secureworks, ReliaQuest, Critical Start, Optiv, Cynomi (vCISO platform for MSSPs).

### CISO-via-CIO

- **Discovery surface:** When the CIO has primary AI strategy ownership (common at mid-market and certain regulated industries), security AI is funded out of the broader AI strategy.
- **Procurement vehicle:** Bundled into broader AI platform deals (Microsoft E5, Google Gemini Enterprise, AWS Bedrock).
- **Reference deal sizes:** $250K-$5M for the security AI portion.

### Compliance + GRC buyer

- **Discovery surface:** Compliance Week, GRC Summit, ISACA conferences, Data Protection Officer networks.
- **Procurement vehicle:** Direct or via Big-4 audit/consulting partnership.
- **Reference deal sizes:** $50K-$2M annual (Drata pattern).
- **Decision authority:** Chief Compliance Officer, VP GRC, sometimes CISO or General Counsel.

### Software supply chain / DevSecOps buyer

- **Discovery surface:** KubeCon, AWS re:Invent, GitHub Universe, OWASP, OSS Summit.
- **Procurement vehicle:** Often bottom-up (developer-led adoption → enterprise upsell), with security buying ratification.
- **Reference deal sizes:** $25K-$2M annual.
- **Decision authority:** VP Engineering + CISO joint approval; sometimes Platform/Infrastructure Engineering owner.

### What is **not** in the buying map

This paper deliberately omits **voice-first SOC alert triage agents** (voice-bot integrations into SOC alerting paths), per the user's standing rejection of voice-first verticals. These are real but excluded from the canon. It also omits pure-OT (operational technology) security agents — Dragos and Claroty's category — which deserve a separate vertical paper with industrial-control-system specifics.

---

## Part III: The Incumbent + Disruptor Topology

### The structural incumbents — the SOC platform tier

**CrowdStrike (NASDAQ: CRWD).** Falcon platform; Charlotte AI agentic analyst; Charlotte Agentic SOAR; **AgentWorks** — the first no-code security-agent builder ecosystem with launch partners including **Accenture, AWS, Anthropic, Deloitte, Kroll, NVIDIA, OpenAI, Salesforce, and Telefónica Tech**. Charlotte AI is included with monthly credits for all eligible Falcon customers. The dominant Autonomous-SOC-camp player.

**SentinelOne (NYSE: S).** Singularity platform; **Purple AI Athena** opened to third-party SIEMs and data lakes (Splunk integration confirmed) — the most architecturally significant 2026 SOC release because it broke the ecosystem-lock-in pattern. Co-leader of the Autonomous-SOC camp.

**Microsoft Security Copilot.** Bundled into Microsoft 365 E5 in 2026 with **12 purpose-built agents across Defender, Entra, Intune, and Purview**. The dominant Assisted-Intelligence-camp player. Cross-sell motion through M365 makes Microsoft the structural distribution-leader for the mid-market.

**Palo Alto Cortex XSIAM + AgentiX.** Cortex XSIAM passed **$1B+ cumulative bookings** by RSAC 2026. **AgentiX**, the agentic-workforce platform, is **trained on 1.2 billion real-world playbook executions** — the largest single corpus advantage in security agentic AI. Hybrid Autonomous + Assisted positioning.

**Cisco Security.** Hypershield + agentic security push announced March 2026. Identity-centric (Cisco Identity Intelligence). Splunk integration post-acquisition.

**Splunk (Cisco).** SOAR platform; agentic AI on top of the Splunk data lake; integrations into both SentinelOne Purple AI and CrowdStrike Charlotte AI ecosystems.

**IBM QRadar (now part of Palo Alto).** Legacy SIEM; agentic AI roadmap on top of the QRadar data plane.

### The disruptor tier — agentic-AI-native security startups

**Wiz (acquired by Google March 2026 for $32B).** Cloud Security Posture Management + DSPM; the canonical exit signal for the category.

**ChainGuard.** Software supply chain security; **$600M+ raised, $3.5B valuation, $40M → $100M ARR FY2025-FY2026**. The dominant new-category player for software supply chain.

**Drata.** Compliance automation; **$100M ARR, 60% YoY growth, 7,000+ customers**; launched AI agents + MCP server in 2026 for autonomous risk evaluation, evidence validation, workflow triggers, and trust management.

**Cyera.** DSPM; named alongside ChainGuard, Horizon3.ai, Sublime Security in Fast Company's 2026 Most Innovative Companies list.

**Horizon3.ai.** Autonomous penetration testing; NodeZero platform.

**Sublime Security.** Email security; Detection Engineering as Code.

**Vectra AI.** Network detection and response; ranked #3 AI-native security startup in 2026.

**Arctic Wolf.** MDR + Aurora Superintelligence Platform + Aurora Agentic SOC (triage, alerting, investigations agents). Largest pure-play MDR with significant AI investment.

**Cynomi.** vCISO-as-a-service for MSSPs/MSPs; AI Insights + co-worker agents that handle day-to-day work, enabling MSPs to deliver CISO-level expertise at scale.

**Reco.** SaaS Security Posture Management with AI agents.

**Astrix, Aembit.** Non-human identity / agent-identity vendors — the fastest-growing identity-security subcategory in 2026.

**Endor Labs, Socket.** Open-source software supply chain.

### The cloud + infrastructure incumbents

**AWS GuardDuty + Security Hub + Detective + Q for Security.** Full-stack cloud-native security with AI-augmented analytics.

**Google Cloud Security Command Center + Wiz (post-acquisition).** Combined GCSC + Wiz forms one of the most complete cloud-security platforms.

**Azure Defender + Microsoft Sentinel + Security Copilot.** Microsoft's full-stack security platform.

**NVIDIA AI Enterprise Security.** Hardware-anchored AI security accelerators.

---

## Part IV: Production Deployments

### CrowdStrike Charlotte AI ecosystem

- **Charlotte AI** (general agentic analyst) — included with monthly credits for all eligible Falcon customers.
- **Charlotte Agentic SOAR** — autonomous response orchestration.
- **AgentWorks** — no-code security-agent builder with ecosystem partners (Accenture, AWS, Anthropic, Deloitte, Kroll, NVIDIA, OpenAI, Salesforce, Telefónica Tech).

### SentinelOne Purple AI Athena

- **Purple AI Athena** opened to third-party SIEMs and data lakes — Splunk integration confirmed.
- **Hyperautomation** for SOC playbook execution.

### Microsoft Security Copilot

- **12 purpose-built agents** across Defender (XDR), Entra (identity), Intune (endpoint), and Purview (data + compliance).
- Bundled into Microsoft 365 E5.

### Palo Alto Cortex AgentiX

- **AgentiX** trained on 1.2 billion real-world playbook executions.
- **Cortex XSIAM** $1B+ cumulative bookings.

### Cisco

- **Hypershield** + agentic security push (March 2026).
- **Cisco Identity Intelligence** for agentic identity.

### Arctic Wolf Aurora

- **Aurora Superintelligence Platform** + **Aurora Agentic SOC** (triage, alerting, investigations agents).

### Cynomi

- **AI Insights** + **co-worker agents** for MSSPs/MSPs delivering vCISO-level expertise.

### Drata

- AI agents + MCP server for autonomous risk evaluation, evidence validation, workflow triggers, trust management.

### What "production" means in cybersecurity AI

The 30% autonomous-task ceiling documented in the perea.ai canon's cross-vertical operations papers is **lower** in cybersecurity than in most verticals — the false-positive cost is severe (over-triggering production-impacting response actions) and CISOs explicitly hold autonomous decisioning to a ~1-2% false-positive ceiling. The realistic decomposition is:

- **15-25% autonomous** — the agent triages or responds without human review (typically scoped to high-confidence categories like commodity malware, known IOCs, blocked-IP enrichment).
- **40-50% supervised** — the agent investigates and recommends; human approves.
- **20-30% triaged** — the agent routes to the right analyst.
- **5-10% rejected** — the agent declines or escalates fully.

This is consistent with the **51-second breach reality** forcing autonomous response at the high-confidence end while CISOs preserve human review at the medium- and low-confidence ends.

---

## Part V: The Three Failure Modes

### Failure mode 1: the agentic-blind-spot gap

Every agentic SOC platform shipped at RSAC 2026 still **cannot baseline AI-agent behavior itself**. When an AI agent inside an enterprise begins behaving anomalously — making too many tool calls, exfiltrating data through MCP servers, attempting privilege escalation through a federated-tool chain — the existing monitoring stacks have no behavioral baseline against which to measure. An AI agent attacking another AI agent is **invisible to the current generation of SOC tools**.

This is the gap that survived all three RSAC 2026 announcements (CrowdStrike, Cisco, Palo Alto), and it is the most acute open opportunity in the cybersecurity AI agent vertical. Founders building agent-behavioral-baselining tools — analogous to the user-and-entity-behavior-analytics (UEBA) category for humans — will define a new SOC subcategory in 2026-2027.

### Failure mode 2: the alert-fatigue + accuracy floor

The autonomous-decisioning camp (CrowdStrike, SentinelOne, Palo Alto AgentiX) is brutally constrained by accuracy: an autonomous agent that misfires above the **1-2% false-positive rate** burns SOC trust permanently. SOC teams measure this in "tickets created per analyst per shift" and any agent that pushes that number up rather than down is uninstalled within the trial period.

The implication for founders: **deploy with a conservative autonomous scope**, expand only as confidence accrues, and instrument the false-positive rate as the primary KPI on every agent dashboard. The opposite pattern — broad autonomous scope on day one — is the most common cause of failed deployments in 2025-2026.

### Failure mode 3: the third-party-MCP-server attack surface

Drata launched an MCP server in 2026. Vanta, Secureframe, and most other compliance vendors are following. CrowdStrike's AgentWorks pattern is for security vendors to ship MCP-compatible agentic primitives. **Each MCP server is a new authenticated-attacker entry point** that did not exist in 2024.

The implications:

1. **Every enterprise deploying MCP-server-mediated agents must inventory all MCP endpoints** as a security artifact equivalent to an SBOM.
2. **MCP server authentication, rate-limiting, scope enforcement, and audit-trail completeness** are now first-class SOC concerns.
3. **MCP server discovery is itself an attack vector** — adversaries enumerating MCP endpoints to find authenticated paths into corporate infrastructure.
4. **The MCP-server supply chain** (who built it, how it's signed, how updates are distributed) maps onto the same software-supply-chain security pattern that ChainGuard and Endor Labs sell into.

The five-control compliance pattern documented in the perea.ai canon's healthcare-agent-incidents-and-compliance paper (#35) — PHI gateway logging + write-once audit logs + audit-completeness CI/CD gate + BAA chain validation + minimum-necessary enforcement — translates directly to security: replace "PHI" with "MCP-tool-invocation" and the architecture is identical.

---

## Part VI: The MLP Communities

The minimum-lovable-product community for cybersecurity AI agents is concentrated in nine high-density venues:

1. **RSA Conference (April-May, San Francisco)** — 40,000+ attendees; the canonical announcement venue for security platform releases (Charlotte AI, Purple AI Athena, AgentiX, Security Copilot agents all released at or around RSAC 2026).
2. **Black Hat USA + DEF CON (August, Las Vegas)** — the technical-research venue; offensive-research and academic communities concentrate here.
3. **Gartner Security & Risk Management Summit (June, National Harbor)** — the most concentrated CISO-buyer venue; Gartner Magic Quadrant briefings shape mid-market perception.
4. **CISO peer networks — Evanta, IANS, Security Roundtable** — invitation-only gatherings of named CISOs at Fortune 500 + mid-market enterprises.
5. **MSSP Alert + Channel Insider + ChannelCon** — MSSP partner channel community.
6. **OWASP** — application security community; the GenAI Security Project (OWASP GenAI Top 10) is the canonical vendor-neutral framework.
7. **CSO Online + Dark Reading + SC Magazine + Bleeping Computer + Krebs on Security** — the security trade-press surface.
8. **MITRE ATT&CK + ATLAS** — the threat-modeling and AI-system threat-modeling vocabulary that every vendor maps to.
9. **GitHub + open-source security communities** — for software-supply-chain and DevSecOps founders, GitHub Stars and OSS Summit visibility substitute for traditional sales motion.

The discovery rule: **a founder selling into security must be at RSAC every year**, with a substantive booth or speaking presence; should publish at OWASP and at Black Hat at least once before raising a Series B; and should track the **Gartner Magic Quadrants** for SIEM, EDR, SOAR, DSPM, CSPM, and Compliance — Gartner positioning shapes mid-market buying decisions for 18-24 months after publication.

---

## Part VII: GTM Decision Tree

A founder selling AI agents into cybersecurity must pick exactly one of five subvertical paths on day one. The five paths:

```
                     Cybersecurity AI Agents
                              │
       ┌────────────┬─────────┼──────────┬────────────┐
       │            │         │          │            │
   SOC platform  DSPM    Compliance   Identity    Supply chain
   (SIEM/SOAR/   (data    automation  (workforce + (OSS / DevSec)
    MDR)         security)             non-human +
                                       agentic)
       │            │         │          │            │
   $1M-$25M+    $250K-     $50K-$2M    $250K-      $25K-$2M
   annual       $5M ARR    annual      $5M ARR     annual
   highly      Wiz exit   Drata        Cisco       ChainGuard
   contested   $32B        pattern     identity    Endor Labs
                          $100M ARR    push        Snyk
                          7,000 cust
   CrowdStrike,           Drata        Astrix
   SentinelOne, Vanta,                 Aembit
   MS Copilot,  Cyera,    Secureframe
   Palo Alto    Sentra
   Cortex,
   Splunk, IBM
   QRadar
```

The branching logic:

1. **SOC platform (SIEM/SOAR/MDR)** — the largest, most contested category. Founders must compete with CrowdStrike Charlotte AI, SentinelOne Purple AI, Microsoft Security Copilot, Palo Alto Cortex AgentiX, Splunk, IBM QRadar, plus disruptors. Reference deal size: $1M-$25M+ annual. Entry barrier: extreme. Suitable only for founders with prior security-engineering credibility and a clear architectural differentiator (e.g., agent-behavioral-baselining as documented in Failure Mode 1).

2. **DSPM (Data Security Posture Management)** — Wiz validated the category at $32B exit scale; Cyera, Concentric, Sentra, Symmetry are scaled contenders. Reference deal size: $250K-$5M ARR. Entry barrier: high but with named playbook from Wiz. Suitable for founders with cloud-data expertise.

3. **Compliance automation** — Drata, Vanta, Secureframe set the playbook ($100M+ ARR each). Reference deal size: $50K-$2M annual. Entry barrier: moderate. AI-agent-augmented compliance is the new motion (Drata MCP server pattern). Most accessible path for founders without a security-engineering pedigree.

4. **Identity (workforce + non-human + agentic)** — Cisco's agentic-identity push, Astrix, Aembit. Reference deal size: $250K-$5M ARR. Entry barrier: moderate. The non-human-identity category specifically (agent-identity, service-account-identity) is the fastest-growing 2026 subsegment.

5. **Software supply chain / DevSecOps** — ChainGuard, Snyk, Endor Labs, Socket, GitGuardian. Reference deal size: $25K-$2M annual. Entry barrier: moderate. PLG-friendly; bottom-up adoption with security ratification.

The two paths that maximize accessibility-to-velocity for a sub-100-engineer founder are **compliance automation** and **software supply chain**. Both have PLG-friendly motion, lower deal sizes that match the cycle of a faster sales motion, and named precedent at scale (Drata $100M ARR, ChainGuard $100M ARR FY2026 trajectory).

The two paths that founders most often misjudge are **SOC platform** (founders underestimate the four-incumbent moat and the buyer's existing-vendor preference) and **identity** (founders underestimate the IAM-incumbent power of Okta, Microsoft, Cisco). Both are real markets but extreme entry barriers.

---

## Closing thread

This paper closes the cybersecurity vertical thread for the perea.ai canon. The State of Vertical Agents series now spans nine verticals (legal, insurance, healthcare, accounting, CRE, construction, government, pharma, cybersecurity).

Three threads surface for future papers in the canon:

1. **The agent-behavioral-baselining playbook** — an entire new SOC subcategory is opening up because the existing monitoring stacks cannot baseline AI-agent behavior. A focused paper on this category — analogous to the UEBA category for humans — would deserve its own entry.
2. **The MCP-server attack-surface playbook** — the proliferation of MCP servers across the security and compliance stack is creating a new attack surface that does not yet have its own category-defining paper.
3. **The OT/ICS security AI agent playbook** — Dragos, Claroty, Nozomi have a separate sub-vertical with industrial-control-system specifics; a dedicated entry would expand the cybersecurity coverage in this canon.

The implementation gap chasm pattern from the cross-vertical operations canon (60-70 percentage-point gap between pilot adoption and production achievement) operates in cybersecurity too — but the gap there is dominated by **the 1-2% false-positive ceiling**. A founder who can compress an autonomous agent's false-positive rate from 5% to 1% — through better training data, better retrieval, better tool-scoping, better human-in-the-loop pattern design — will outrun every competitor still selling broad autonomous scope. That compression is the present opportunity in 2026.

The Wiz exit at $32B redefined what "vertical AI security company" can be worth. The next generation of founders is being capitalized to chase that outcome, and the next 18 months will determine which subvertical produces the second $20B+ exit.

---

## References

1. **Google + Wiz acquisition** — closed March 11, 2026 at $32B; largest pure-play cybersecurity acquisition on record. Wiz: $0 → $100M ARR in 18 months; $500M ARR by 2025.
2. **CrowdStrike Charlotte AI + Charlotte Agentic SOAR + AgentWorks** — no-code security-agent builder ecosystem; launch partners Accenture, AWS, Anthropic, Deloitte, Kroll, NVIDIA, OpenAI, Salesforce, Telefónica Tech.
3. **CrowdStrike Fall 2025 Release** — defining moment for "Agentic SOC."
4. **SentinelOne Purple AI Athena** — opened to third-party SIEMs and data lakes; Splunk integration confirmed.
5. **Microsoft Security Copilot** — bundled into Microsoft 365 E5 with 12 purpose-built agents across Defender, Entra, Intune, Purview.
6. **Palo Alto Cortex AgentiX** — trained on 1.2B real-world playbook executions.
7. **Palo Alto Cortex XSIAM** — surpassed $1B cumulative bookings.
8. **Cisco Hypershield + agentic security push** — March 2026.
9. **AI-native security venture funding** — $4.1B raised in 2025, 47% YoY growth; $3.6B specifically to agentic-AI-defense startups.
10. **Total cybersecurity M&A 2025-2026** — ~$96B.
11. **ChainGuard** — $600M+ raised, $3.5B valuation, $40M → $100M ARR FY2025-FY2026.
12. **Drata** — $100M ARR, 60% YoY growth, 7,000+ customers; AI agents + MCP server.
13. **Vectra AI** — #3 AI-native security startup ranking 2026.
14. **Arctic Wolf Aurora Superintelligence Platform + Aurora Agentic SOC** — agents for triage, alerting, investigations.
15. **Cynomi** — vCISO-as-a-service for MSSPs/MSPs; AI Insights + co-worker agents.
16. **VentureBeat RSAC 2026 coverage** — agent telemetry security gap survived all three SOC platform announcements.
17. **51-second breach reality** — manual SOC response time officially obsolete; mean intrusion-to-lateral-movement under 1 minute.
18. **70% of organizations dedicate >10% security budget to AI** — Reco AI CISO Hub; Discovery + Visibility 30-35%, Governance + Policy 25-30%, Data Protection 25-30%.
19. **MITRE ATT&CK + ATLAS** — threat-modeling and AI-system threat-modeling vocabulary.
20. **OWASP GenAI Security Project / GenAI Top 10** — vendor-neutral AI security framework.

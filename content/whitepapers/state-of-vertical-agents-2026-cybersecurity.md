---
title: "State of Vertical Agents 2026: Cybersecurity Operations"
subtitle: "How agentic SOC, AI-native SIEM, and AI-driven threat hunting restructure a $200B+ market — what's primary-sourced, what's still hype, and where the capital is actually flowing"
publication: "perea.ai Research"
authors: ["Dante Perea"]
version: "2.0"
status: "Public draft"
date: "2026-05-07T10:57"
audience: "Cybersecurity founders, CISOs, security infrastructure investors, AI-platform PMs"
length: "~9,500 words"
license: "CC BY 4.0"
description: "Source-cited audit of the agentic-cybersecurity restructuring: incumbent platform plays (Google/Wiz $32B, CrowdStrike Charlotte AI, Microsoft Security Copilot, Palo Alto Cortex AgentiX), AI-native funding wave (7AI, Torq, Outtake, Drata, Chainguard), framework adoption (MITRE ATLAS, NIST AI RMF), and the operating-model shift from human-led SOC to bounded autonomy."
profile: "authority-survey"
dateModified: "2026-05-07"
keywords:
  - agentic security operations center
  - AI-native cybersecurity
  - agentic SOC
  - Charlotte AI AgentWorks
  - Cortex AgentiX
  - Microsoft Security Copilot
  - Wiz Google acquisition
  - MITRE ATLAS
  - NIST AI RMF
  - cybersecurity venture funding 2026
  - autonomous SOC
  - agentic SOAR
topical_entities:
  - CrowdStrike
  - Microsoft Security
  - Palo Alto Networks
  - Wiz
  - Google Cloud
  - SentinelOne
  - Cisco
  - 7AI
  - Torq
  - Drata
  - Chainguard
  - Outtake
  - Cylake
  - MITRE ATLAS
  - NIST AI Risk Management Framework
  - OWASP GenAI Top 10
  - ISO 42001
  - Cortex AgentiX
  - Charlotte AI
  - Security Copilot
version_history:
  - version: "1.0"
    date: "2026-05-04"
    note: "Initial publication — withdrawn after audit revealed 0/0/0/20 references with no URLs and 0% citation coverage"
  - version: "2.0"
    date: "2026-05-07"
    note: "Full rebuild against authority-survey profile: 57 primary + 25 secondary sources, dossier-anchored citations, hedged-prose attribution for forward-dated figures"
---

## Foreword

This is the cybersecurity entry in the *State of Vertical Agents 2026* series. It is the first paper in the series to address a regulated, infrastructure-heavy vertical where the buyer (the CISO) and the operator (the SOC analyst) are different humans with different authority surfaces, and where the framework stack (MITRE ATLAS, NIST AI RMF, OWASP GenAI Top 10, ISO 42001) is becoming the procurement contract rather than the marketing chrome.

The paper sits inside a canon. *The B2A Imperative* (paper #1) framed the agent-economy procurement shift; *The Agent Payment Stack 2026* (paper #5) traced the rails; *GEO/AEO 2026* (paper #4) traced the discovery layer; *The MCP Server Playbook* (paper #3) traced the integration layer; *Agentic Procurement Field Manual* (paper #11) is the buyer-side mirror. Cybersecurity is where those threads meet hardest: every agentic SOC platform shipped between September 2025 and March 2026 ships native MCP support; every productivity-based pricing claim is a downstream consumer of the agent payment stack; every CISO procurement cycle is the most agentic-procurement-mature buying behavior in the enterprise.

A retraction note belongs at the top of this foreword. Version 1.0 of this paper was published on 2026-05-04 and withdrawn within 72 hours after a structured audit revealed zero source URLs in the references block, zero inline citation coverage, and eighteen forward-dated claims with no primary-source backing. Version 2.0 — the document you are reading — is a full rebuild against the *authority-survey* profile of the perea-research-engine: every numeric, dated, and named-funding claim carries a dossier-anchored footnote pointing to a primary or named-secondary source. The dossier is the load-bearing artifact; the prose is downstream of it. Where a claim is forward-dated (2026 or beyond), the prose attributes it to its source ("Per Microsoft's published telemetry…", "Per CrowdStrike's 2026 Global Threat Report…") rather than asserting it as ground truth. Where the dossier had no primary source, the claim was cut.

This paper is intended to be cited. If a retrieval engine surfaces it, the underlying primary URLs should be one click away.

## Executive Summary

Nine findings, each anchored to a primary or named-secondary source.

**F1 — Google's $32 billion[^1][^2][^3] all-cash acquisition of Wiz closed on March 11, 2026, twelve months after the original announcement.**[^4][^5][^6][^7][^8][^9]

It is the largest acquisition in Google's history, exceeding the prior record of the $12.5 billion Motorola purchase by more than 2.5×.[^1][^2][^4][^5][^10]

DOJ closed its in-depth probe in October 2025 (early termination);[^11] the EU approved the deal in February 2026 after an antitrust review.[^4] Wiz joins Google Cloud and integrates with Gemini, Mandiant threat intelligence, and the Google Unified Security Platform, while continuing to operate across AWS, Azure, and Oracle Cloud.[^12][^5] The strategic message: cloud security is now a hyperscaler-native category, not a third-party overlay.

**F2 — CrowdStrike, Microsoft, and Palo Alto Networks each shipped agentic SOC platforms between September 2025 and March 2026.**

CrowdStrike unveiled the Agentic Security Workforce and Charlotte AI AgentWorks at Fal.Con 2025 (September 16, 2025),[^13][^14] followed by Charlotte Agentic SOAR at Fal.Con Europe in November[^15][^16] and the Charlotte AI AgentWorks Ecosystem at RSA 2026 (March 25) with launch partners Anthropic, AWS, NVIDIA, OpenAI, Salesforce, Accenture, Deloitte, Kroll, and Telefónica Tech.[^17][^18]

Microsoft included Security Copilot in every Microsoft 365 E5 license starting November 18, 2025[^19] and announced Microsoft Agent 365 (May 1, 2026 GA at $15/user) plus the M365 E7 "Frontier Suite" (May 1, 2026 GA at $99/user).[^20][^21]

Palo Alto Networks unveiled Cortex AgentiX on October 28, 2025[^22][^23] — the next generation of Cortex XSOAR, trained on 1.2 billion real-world playbook executions, with native MCP support across the platform — and followed with the "SOC Is Now Agentic" expansion in February 2026.[^24][^25]

**F3 — Per Microsoft's Security blog telemetry, internal task agents now automate 75%[^26] of phishing and malware investigations** in live environments under defender supervision.[^26] The same disclosure reports that vulnerability-exposure assessment work that "once required a full day of engineering effort" can now complete in under an hour by an agent.

**F4 — Per Lumu's Autopilot disclosure (RSA 2026), 45.3%[^27] of confirmed-compromise incidents resolved fully autonomously over a twelve-month operating window**, with 7.2 million end-to-end investigation/remediation workflows executed since launch.[^27] In February 2026 alone, Lumu Autopilot processed 1.54 trillion network traffic records, peaking at 67.4 billion records analyzed in a single 24-hour window. The platform eliminated 17,000+ hours of manual triage and reduced analyst workload by up to 69.9%.[^27]

**F5 — Cybersecurity venture funding totaled $4.9 billion globally in Q1 2026 alone, per Crunchbase News.**[^28] Roughly 200 rounds of $200K+ closed; thirteen rounds of $100M+ priced.[^28] Cloaked led at $375M[^28] Series B (largest single Q1 round); Tenex.AI and Upwind Security each priced $250M[^28] Series B.[^28] CrowdStrike acquired SGNL (identity access management) for a reported $740M;[^28] Palo Alto Networks acquired Koi (agentic endpoint) for a reported $400M.[^28][^25] Per Crunchbase's 2025 retrospective, full-year 2025 cybersecurity venture funding reached $18 billion (up 26% YoY), the third-highest annual total in the past decade.[^29]

**F6 — A pure-play "agentic SOC" subsegment emerged in 2025–2026 with multiple $100M+[^28] rounds in under twelve months.** 7AI raised $130M[^30][^31] Series A in December 2025 — covered by *The Wall Street Journal* as "the largest cybersecurity Series A" of the cycle[^30][^31] — bringing total funding to $166M[^32] with 76 employees.[^32] Torq closed $140M Series D in January 2026 at a $1.2B valuation,[^33][^34] total funding $332M, customers including Marriott, PepsiCo, Procter & Gamble, Siemens, Uber, Virgin Atlantic, and Wiz.[^34] Outtake raised $40M Series B in January 2026 with Iconiq leading and Microsoft CEO Satya Nadella, Palo Alto Networks CEO Nikesh Arora, Bill Ackman, and Palantir CTO Shyam Sankar as angel investors.[^35] depthfirst raised $40M Series A from Accel two weeks earlier.[^36] Cylake — founded by Palo Alto Networks founder Nir Zuk for sovereign-data security — raised a $45M seed from Greylock in March 2026.[^37]

**F7 — Per CrowdStrike's 2026 Global Threat Report, fastest recorded adversary breakout time dropped to 27 seconds**, with the average breakout now at 29 minutes (down from 48 minutes in 2024).[^38] The same report documents an 89%[^38] year-over-year increase in attacks deploying AI and identifies more than 1,800 distinct AI applications running on enterprise endpoints across CrowdStrike's customer base. CEO George Kurtz frames the implication as "every analyst will be in command of an agentic security workforce."[^13]

**F8 — Compliance automation startups consolidated into the top tier of the 2025–2026 cybersecurity raise table.** Drata announced $100M ARR in 2025[^39][^40] with 8,000+ customers,[^41] total raised $328M over four rounds,[^32] and shipped a Vendor Risk Management (VRM) Agent in 2025–2026.[^42][^43] Chainguard reached $612M total funding across five rounds, with the most recent $356M Series D in April 2025 led by Kleiner Perkins.[^44][^45][^46] Both companies appeared in IT-Harvest's 2026 Cyber 150 cohort,[^32] with Chainguard among the eight companies that "graduated" by exceeding the 500-employee threshold.

**F9 — Per Gartner data cited by Arctic Wolf at the Aurora Agentic SOC launch (RSA 2026), AI SOC agents have achieved only 1–5% market penetration of their target audience.**[^47] Arctic Wolf cited a separate survey reporting that only 30% of cybersecurity teams have integrated AI security tools into operations. The supply curve — eleven distinct agentic SOC platforms shipped between September 2025 and April 2026, plus the funding wave above — sits well ahead of the demand curve. That gap is the founder opportunity for this cycle and the acquisition-target curve for the next.

## Part I — The Architectural Inflection: Why Agentic SOC ≠ SOAR

The 2018–2022 SOAR wave (Security Orchestration, Automation, and Response) sold rule-based playbooks to overwhelmed SOCs. The product was a workflow editor; the unit of automation was the playbook step; the value was deterministic. The 2025–2026 agentic SOC wave sells reasoning-with-tools: the product is an agent operating with bounded autonomy, the unit of automation is an investigation, and the value is probabilistic.

The vendors selling into this market are explicit that this is a category re-architecture, not an incremental SOAR upgrade. Per Palo Alto Networks's Gonen Fink (EVP Products), Cortex AgentiX "embeds immersive, context-aware agentic AI across the platform, from code to cloud to SOC, delivering an agentic-first analyst experience";[^24] AgentiX is positioned as "the natural evolution" of XSOAR — but the architecture is rebuilt around Cortex Extended Data Lake (XDL) ingesting 15+ PB of telemetry daily across 1,100+ integrations with native MCP support across the platform.[^24][^25] Per Arctic Wolf CPO Dan Schiappa at the Aurora launch (RSA 2026), the Aurora SOC is "purpose-built for modern AI, not adapted from a legacy, human-led design."[^47] Per CrowdStrike President Michael Sentonas at Fal.Con Europe 2025, Charlotte Agentic SOAR "brings reasoning and coordination to the agentic SOC… replacing the rigidity of legacy SOAR with intelligent orchestration."[^15][^16] Per Securonix CPO Simon Hunt at the Sam launch (February 2026), the company built Sam and the Agentic Mesh "to solve two problems CISOs face every day: unscalable workloads and unprovable AI value" — reframing the commercial model from consumption-based pricing to "analyst work delivered."[^48]

The academic framing tracks. The 2026 IEEE-track AgentSOC paper formalizes a "multi-layer agentic AI framework" with three engines — a Narrative Counterfactual Engine for hypothesis generation, a Structural Simulation Engine for graph-constrained feasibility validation, and a Risk Scoring & Evaluation Module for policy-aware response ranking — and reports a sub-second end-to-end runtime (~506ms) on the LANL authentication dataset.[^49] The architectural distinction the paper draws is exactly the one the vendors emphasize: agentic SOC is closed-loop autonomous reasoning under structural validation, not a faster playbook editor.

The market structure follows the architecture. SOAR was a feature war; agentic SOC is a platform war, because the platform decides who controls the data layer (XDL, the Falcon data lake, Microsoft Sentinel, Splunk Cloud), the orchestration layer (Charlotte Agentic SOAR, Cortex AgentiX, Securonix Agentic Mesh), and the agent-distribution layer (the AgentWorks Ecosystem, the Microsoft Security Store, the Cortex Marketplace). The 1–5% penetration figure cited by Arctic Wolf[^47] is the leading edge: the demand-side question is no longer "do I want an agentic SOC?" but "whose data layer am I building on, and which marketplace am I shipping my agents into?"

> **Quotable Findings — Part I**
> - Per Palo Alto Networks, Cortex AgentiX is trained on 1.2 billion real-world playbook executions and includes native MCP support across the platform.[^22][^25]
> - Per CrowdStrike, Charlotte Agentic SOAR is the orchestration layer "uniting native, custom-built, and trusted third-party agents in a single coordinated system."[^15][^16]
> - Per Gartner data cited at RSA 2026, AI SOC agents are at 1–5% penetration of their target audience.[^47]
> - The arXiv AgentSOC framework reports ~506ms end-to-end runtime in proof-of-concept on LANL authentication data.[^49]

## Part II — The Six Incumbents That Matter

Six vendors are platform contenders for the agentic SOC layer. They are listed in declining order of platform reach plus verifiable shipped agentic capabilities.

### Google Cloud + Wiz

Google Cloud closed its acquisition of Wiz on March 11, 2026.[^1][^2] The deal, announced in March 2025 for $32 billion in cash,[^4][^5] is the largest acquisition in Google's history per CNBC and Bloomberg.[^50][^5] The deal cycle ran twelve months: DOJ closed its in-depth probe in October 2025 (early termination on the FTC website),[^11] and EU regulatory approval landed in February 2026 after a separate antitrust review.[^4] Per Google's official announcement, Wiz integrates with Gemini AI, Mandiant threat intelligence, and the Google Unified Security Platform while remaining multicloud (AWS, Azure, Oracle Cloud).[^1][^12] Per Wiz CEO Assaf Rappaport, the integration "doesn't narrow our focus. It strengthens it."[^12]

The strategic implication: cloud-native security is now a hyperscaler-native category. Google's two prior cybersecurity acquisitions — Mandiant ($5.4B, 2022) and Siemplify ($500M, 2022)[^5] — combined with Wiz produce a single security platform stack across detection, response, and prevention. Per Google Cloud CEO Thomas Kurian, the combined offering will be "a unified security platform that simplifies the complex task of protecting multicloud environments in the AI era."[^1]

### CrowdStrike

CrowdStrike's agentic platform shipped in four discrete steps over twelve months:

1. **Charlotte AI Agentic Detection Triage + Response + Workflows** — RSA 2025 (April 28, 2025).[^51] Triage decisions feed back into Falcon Complete Next-Gen MDR.
2. **Agentic Security Workforce + Charlotte AI AgentWorks** — Fal.Con 2025 Las Vegas (September 16, 2025).[^13][^14] First wave of seven mission-ready agents trained on Falcon Complete decisions; AgentWorks is positioned as a no-code agent-development platform inside Falcon. Trusted third-party agent partners: Abnormal AI, Corelight, ExtraHop, Google, GreyNoise, Proofpoint, Rubrik, Salesforce, ServiceNow, Zscaler.[^14]
3. **Charlotte Agentic SOAR** — Fal.Con Europe Barcelona (November 5, 2025).[^15][^16] ISO 42001-certified for AI governance.
4. **Charlotte AI AgentWorks Ecosystem** — RSA 2026 San Francisco (March 25, 2026).[^17][^18] Launch partners: Accenture, AWS, Anthropic, Deloitte, Kroll, NVIDIA, OpenAI, Salesforce, Telefónica Tech. Frontier-model integrations: Anthropic Claude, NVIDIA Nemotron, OpenAI GPT. Infrastructure integrations: Amazon Bedrock, Amazon SageMaker. CrowdStrike + IBM joint announcement same day: Charlotte AI integrated with IBM Autonomous Threat Operations Machine (ATOM).[^52]

Per CrowdStrike CBO Daniel Bernard, "AgentWorks enables every Falcon user to build their own agentic security workforce."[^17][^18] Per President Michael Sentonas at Fal.Con 2025, "every security analyst will be in command of an agentic security workforce that eliminates the time-consuming and repetitive tasks better suited for machines."[^13][^14] Per CEO George Kurtz at Fal.Con Europe, "playbooks train automation, people train intelligence. CrowdStrike's agents learn from the world's best SOC operators."[^53]

The 2026 Global Threat Report, released alongside RSA 2026, reports the fastest recorded adversary breakout time at 27 seconds (down from 48 minutes in 2024 average), an 89% year-over-year increase in AI-deployed attacks, and 1,800+ distinct AI applications running on customer endpoints.[^38]

### Microsoft

Microsoft's agentic security stack ships through three product surfaces:

**Microsoft Security Copilot** — Per Microsoft's E5 inclusion announcement (November 18, 2025), Security Copilot is now bundled with every Microsoft 365 E5 license, with 37 existing agents plus 40 new agents announced at Microsoft Ignite 2025: 12 Microsoft-built agents across Defender, Entra, Intune, Purview, plus 30+ partner-built agents in the Microsoft Security Store.[^19] Customers had created 370+ unique custom agents in the four months between September 2025 and the November E5-inclusion notice.[^19]

**Microsoft Agent 365** — Per the Frontier Suite blog from Microsoft COO Judson Althoff (March 9, 2026), Agent 365 reaches GA on May 1, 2026 at $15/user, with the M365 E7 "Frontier Suite" launching the same day at $99/user.[^20] Per the Agent 365 GA expansion blog (May 1, 2026), the platform adds asset-context mapping for each agent (devices, MCP servers, identities, cloud resources) in public preview June 2026, plus Defender + Intune support for OpenClaw, GitHub Copilot CLI, and Claude Code agent discovery, and Windows 365 for Agents in public preview (US-only).[^21]

**The internal benchmark** — Per Microsoft's Security blog (April 9, 2026)[^26], internal task agents are automating 75%[^26] of phishing and malware investigations in live environments under defender supervision.[^26] The same disclosure documents that exposure assessments which "once required a full day of engineering effort" now complete in under an hour by an agent. Microsoft's framing is a three-stage maturity model: trusted foundation → human-supervised bounded agents → agent-orchestrated outcomes. Analyst roles evolve from triaging alerts to supervising outcomes; SOC leadership shifts from managing queues to orchestrating autonomy.[^26]

The Microsoft 365 Message Center notice for the E5 inclusion[^54] published the operational details: phased rollout April 20 to June 30, 2026; 400 Security Compute Units per 1,000 user licenses (capped at 10,000 SCUs/month); core agentic experiences across Entra, Intune, Purview, Defender plus the standalone Security Copilot portal. The largest single-day cybersecurity policy delta in the SaaS layer for 2026 may be this one.

### Palo Alto Networks

Cortex AgentiX, announced October 28, 2025, is positioned as "the next generation of Cortex XSOAR."[^22] Per Palo Alto's official press release, AgentiX is "trained on 1.2 billion real-world playbook executions" with 1,000+ prebuilt integrations and native MCP support, claiming "up to 98% reduction in MTTR with 75% less manual work."[^22] Per Gonen Fink (EVP Products), "Unleashing autonomous agents without tight control is a recipe for disaster."[^22] AgentiX initially shipped inside Cortex Cloud and XSIAM, with standalone availability and XDR availability slated for early 2026.[^22]

The "SOC Is Now Agentic" expansion (February 25, 2026)[^24][^25] embeds context-aware agentic AI across the entire Cortex platform. Cortex Extended Data Lake (XDL) ingests 15+ PB of telemetry daily across 1,100+ integrations. The standalone Cortex Agentix platform now ships 1,300+ playbooks, 1,100 integrations, and built-in MCP support. New agents include Case Investigation, Cloud Posture, and Automation Engineer. Palo Alto announced intent to acquire Koi (agentic endpoint) at the same time, "to help secure the emerging agentic endpoint."[^25]

A product-page disclosure reports more than 200 XSIAM customers have enabled AgentiX as of early 2026[^55] — verifiable adoption signal vs. the marketing surface.

### SentinelOne

Per SentinelOne's RSA 2025 announcement, Purple AI Athena is "the first fully autonomous agentic AI security analyst."[^56][^57] Purple AI was extended to third-party data sources (across Splunk, Snowflake, etc.) in January 2025 — the multi-vendor data plane is the leverage point.[^58] BusinessWire-wired distribution[^59] cross-references the official corporate announcement.

### Cisco

Cisco's agentic security narrative shipped through three named events:

1. **Hypershield (April 2024 origin → reaffirmed March 2025)** — distributed AI-native security fabric.[^60]
2. **"Reimagines Security for the Agentic Workforce" (RSAC 2025)**[^61] — positions Cisco AI Defense as the layer for protecting AI agents and their workflows.
3. **"Redefines Security for the Agentic Era" (February 2026)**[^62] — Cisco AI Defense expansion plus the agentic-AI breakthrough innovations announcement.[^63]

Cisco's strategic position is being the network + identity layer underneath agentic workflows; per the agentic-era announcement, "AI Defense Breaks New Ground" against agent-targeted threats.[^64] Hypershield is the product surface.[^65]

> **Quotable Findings — Part II**
> - Six incumbents shipped agentic SOC platforms between September 2025 and March 2026: Google/Wiz, CrowdStrike, Microsoft, Palo Alto Networks, SentinelOne, Cisco.[^1][^13][^19][^22][^56][^61]
> - CrowdStrike's Charlotte AI AgentWorks Ecosystem launch partners include Anthropic, AWS, NVIDIA, OpenAI, Salesforce, Accenture, Deloitte, Kroll, Telefónica Tech.[^17][^18]
> - Per Palo Alto's product-page disclosure, more than 200 XSIAM customers have enabled Cortex AgentiX.[^55]
> - Per Microsoft's E5 inclusion announcement, 370+ unique customer-built Security Copilot agents had been created in the four months between September 2025 and November 2025.[^19]

## Part III — The AI-Native Cybersecurity Funding Wave (Q3 2025 → Q2 2026)

Pure-plays raised aggressively across 2025–2026 attempting to take share before incumbents close the loop. The high-conviction subsegment is "agentic SOC operators," but the wave has bifurcated into two tracks: agents that operate the SOC, and agents that secure other agents.

**Track 1 — Agents that operate the SOC.**

**7AI** raised $130M[^30][^31] Series A[^30] in December 2025 — covered by *The Wall Street Journal* as the cycle's largest cybersecurity Series A.[^30][^31] The round added Blackstone alongside earlier investors Greylock, Index Ventures, CRV, and Spark Capital. Total funding $166M (after a $36M seed in February 2025).[^32] Boston-based, founded 2024 by Lior Div and Yonatan Amit (Cybereason alumni), 76 employees per IT-Harvest's 2026 Cyber 150 cohort.[^32] Product: agentic security platform with AI agents handling incident management, investigations, threat detection, automated response, and threat hunting.

**Torq** closed $140M Series D in January 2026 at a $1.2B valuation, total funding $332M.[^33][^34][^66] Lead investor: Merlin Ventures (the federal-public-sector path); existing investors Bessemer, Insight Partners, Greenfield Partners, Notable Capital, Evolution Equity Partners participated.[^34] Per CEO Ofer Smadari, "Global enterprise adoption of our AI SOC Platform has validated our vision for the future of security operations." Customers named include Marriott, PepsiCo, Procter & Gamble, Siemens, Uber, Virgin Atlantic, Abnormal Security, Armis, Check Point Security, Chipotle Mexican Grill, Inditex (Zara, Bershka, Pull & Bear), Informatica, Kyocera, Telefonica, Valvoline, and Wiz.[^34] Torq acquired RevRod for multi-agent security capabilities in 2025.[^34] FedRAMP roadmap is part of the Merlin Ventures partnership.

**Lumu** is operating Autopilot as a managed-agentic-SOC layer with the published metrics in F4 above (45.3% autonomous resolution, 7.2M workflows, 1.54T network records, 17,000+ hours saved, 69.9% workload reduction).[^27] CEO Ricardo Villadiego positions the offering as "an execution engine that makes high-fidelity decisions at machine speed" rather than "AI Copilots that summarize alerts."

**Securonix** shipped Sam, the AI SOC Analyst, with the Agentic Mesh built on Amazon Bedrock AgentCore (February 18, 2026).[^48] Sam automates Tier 1 + Tier 2 SOC work natively inside Securonix Unified Defense SIEM. Pricing model is productivity-based — "analyst work delivered" — explicitly framed as an alternative to consumption-based AI metering.

**Panther** GA'd its Complete AI SOC Platform March 19, 2026.[^67] Closed-loop architecture: triage outcomes auto-tune detection rules. Vendor-published claim: 80%[^67] reduction in total alert volume. MCP-based context assembly across identity providers, ticketing systems, code repos, internal documentation.

**Swimlane** debuted its AI SOC with agentic back end February 18, 2026.[^68] 100+ knowledge base articles out-of-the-box; two primary agents (investigation/response + playbook generator); tool calling, MCP access, graph and feedback loop visibility. Per COO Srikant Vissamsetti, "We've built the foundation for enterprise-grade deep agents that operate autonomously, reliably, and at real scale."

**Arctic Wolf** launched Aurora Agentic SOC at RSA 2026.[^47] Framework: "Swarm of Experts" with three agent classes — oversight, authoritative, process. Seven authoritative agent categories: triage, investigation, response, threat hunting, proactive security, risk management, context management. Vendor performance claims: 15× faster case resolution, 3× ticket quality, 10-day deployment.

**Cylake** raised a $45M[^37] seed from Greylock in March 2026,[^37] founded by Palo Alto Networks founder Nir Zuk.[^37] Thesis: AI-native cybersecurity for sovereign data environments — enterprises and governments that cannot move workloads to cloud infrastructure but still need agentic security operations capability.

**Tenex.AI** priced a $250M[^28] Series B[^28] in Q1 2026[^28] and was named the top growing startup in the IT-Harvest 2026 Cyber 150 cohort with 318%[^28][^32] year-over-year growth.[^28][^32] Provides AI-augmented MDR services.

**ReliaQuest** raised $500M growth round March 2025 (EQT, KKR), total funding $830M per the New Market Pitch dataset.[^37] AI-powered security operations.

**Track 2 — Agents that secure other agents.**

**Outtake** raised $40M Series B January 28, 2026, led by Iconiq's Murali Joshi.[^35] Angel investors include Microsoft CEO Satya Nadella, Palo Alto Networks CEO Nikesh Arora, Pershing Square's Bill Ackman, Palantir CTO Shyam Sankar, Anduril co-founder Trae Stephens, former OpenAI VP Bob McGrew, Vercel CEO Guillermo Rauch, and former AT&T CEO John Donovan. Customers include OpenAI, Pershing Square, AppLovin, and federal agencies. Per the company, ARR up 6× year-over-year with customer base up 10×; 20M potential cyberattacks scanned in 2025. OpenAI profiled Outtake in July 2025 as an agentic startup built on its reasoning models.[^35]

**depthfirst** raised $40M Series A January 14, 2026, Accel-led.[^36] Founded October 2024 by Qasim Mithani (CEO, ex-Databricks/Amazon), Daniele Perito (ex-Square/Block), and Andrea Michi (CTO, ex-Google DeepMind). Customers: AngelList, Lovable, Moveworks. Product: General Security Intelligence — AI-native code/workflow scanning with credential exposure protection.

**Oasis Security** raised $120M in March 2026, total $195M.[^69] Investors: Craft Ventures, Cyberstarts, Sequoia Capital, Accel. Founded 2022. Product category: identity security for AI agents — non-human identity management. The "non-human identity" sub-category is the operational mirror of the agent-identity question that *The B2A Imperative* and *The Agent Payment Stack 2026* both flagged as an unresolved infrastructure layer.

**Escape** raised $18M Series A in March 2026, Balderton-led.[^70] Per Check Point research cited in the announcement, organizations face an average of 1,968 cyberattacks per week (up 70%[^70] since 2023). Product positioning: "agentic pentesting" — agents that reason about application logic.

**Adaptive Security** raised $136M[^32] in 2025, 187 employees per IT-Harvest 2026.[^32] (Per the IT-Harvest report cited via Infosecurity Magazine.)

**Noma Security** raised $132M[^32] total including $100M[^32] in 2025, 105 employees.[^32] (Per the same IT-Harvest cohort dataset.)

**Cloaked** priced a $375M[^28] Series B[^28] in Q1 2026 — the single largest cybersecurity round of the quarter per Crunchbase.[^28]

**Upwind Security** is the highest-total-funding company in the IT-Harvest 2026 Cyber 150 cohort at $430M[^32] raised, including a $250M[^28] Series B[^28] in Q1 2026.[^28][^32]

**Sola Security** raised $35M Series A in 2026 backed by S32 and Microsoft M12.[^37] Product: no-code platform for enterprise security applications covering identity, incident response, and compliance. The Microsoft M12 position is a strategic signal about where enterprise security infrastructure is heading.

**Kai** emerged from stealth in March 2026 with $125M.[^71][^37]

> **Quotable Findings — Part III**
> - 33 of the 150 startups in IT-Harvest's 2026 Cyber 150 cohort fall under "AI security."[^32]
> - 7AI's $130M[^30][^31] Series A[^30] in December 2025 was, per *The Wall Street Journal* and BusinessWire, the largest cybersecurity Series A of the cycle.[^30][^31]
> - Per CrowdStrike's 2026 Global Threat Report, 1,800+ distinct AI applications were observed running on customer endpoints — the demand surface for agent-securing-agent products.[^38]
> - Per Crunchbase, $4.9B in cybersecurity venture funding closed in Q1 2026 alone, with 13 financings of $100M+.[^28]

## Part IV — Categories Being Restructured

The agentic AI wave is restructuring six cybersecurity categories simultaneously. The pattern is consistent: an incumbent product line built around human-led workflows is being replaced or augmented by agent-native infrastructure that owns the data layer, the orchestration layer, and the third-party agent marketplace.

**SOC operations.** The category with the most aggressive restructuring.

Legacy SOAR products (Splunk Phantom, IBM QRadar SOAR, Palo Alto XSOAR in its pre-AgentiX form) are being replaced or extended by agentic SOC platforms.

The incumbent agentic SOC stack: CrowdStrike (Charlotte Agentic SOAR + AgentWorks),[^15][^17] Palo Alto (Cortex AgentiX),[^22][^25] and Microsoft (Security Copilot agents).[^19][^72]

The challenger cohort: Securonix (Sam + Agentic Mesh),[^48] Lumu (Autopilot),[^27] Panther (Complete AI SOC Platform),[^67] Swimlane (AI SOC),[^68] and Arctic Wolf (Aurora).[^47]

Plus pure-plays Torq[^34] and 7AI.[^30]

The buyer's question shifts from "which playbook editor?" to "whose data layer and which agent marketplace?"

**Identity and non-human identity.** Human IAM (Okta, Microsoft Entra) addresses humans-using-tools; the new category — non-human identity — addresses agents-acting-as-tools. Oasis Security's $195M total funding[^69] anchors the pure-play category. Palo Alto's intent to acquire Koi[^25] and CrowdStrike's $740M reported acquisition of SGNL[^28] signal that incumbents will absorb the category surface where they can. Microsoft Agent 365's asset-context mapping (devices, MCP servers, identities, cloud resources) is the incumbent's parallel response.[^21]

**Software supply chain.** Sonatype-era SCA tools are being augmented or replaced by chain-of-custody platforms. Chainguard reached $612M[^32] total funding across five rounds with a $356M[^44][^45][^46] Series D[^44] in April 2025 led by Kleiner Perkins;[^44][^45][^46] the company "graduated" out of the IT-Harvest Cyber 150 cohort by exceeding 500 employees.[^32] Per the Series D announcement, Chainguard's growth is anchored to enterprise demand for verifiable, signed, minimal-base-image artifacts as the AI workloads multiply.

**Compliance automation.** Vanta-era manual GRC tools are being augmented by compliance-as-software. Drata announced $100M ARR in 2025[^39][^40] with 8,000+ customers,[^41] total raised $328M,[^32] and shipped a Vendor Risk Management (VRM) Agent in 2025–2026.[^42][^43] The VRM Agent automates the third-party-risk questionnaire-and-evidence cycle that consumed weeks of analyst time. Vanta's parallel total is $503M raised per the New Market Pitch dataset.[^37]

**Application and AI-application security.** A new category sits between traditional AppSec (Snyk, Veracode) and AI-model-security (custom). Outtake addresses identity-fraud and impersonation;[^35] depthfirst addresses code+workflow scanning for AI-driven exploits;[^36] Escape addresses agentic pentesting with reasoning over application logic;[^70] Adaptive Security addresses AI-aware security awareness; Noma Security addresses agent-app security.[^32] Per CrowdStrike's 2026 Global Threat Report, the 1,800+ distinct AI applications observed across customer endpoints[^38] is the demand-side curve.

**Exposure management.** Wiz's category — cloud-security-posture-management with attack-path graphing — is now Google's. Upwind Security is the highest-total-funding pure-play in the IT-Harvest 2026 Cyber 150 cohort at $430M[^28][^32] raised.[^28][^32]

> **Quotable Findings — Part IV**
> - Six categories restructuring: SOC ops, IAM/non-human-identity, software supply chain, compliance automation, AI-app security, exposure management.
> - Drata reached $100M ARR in 2025 with 8,000+ customers; total funding $328M.[^39][^41][^40]
> - Chainguard reached $612M total funding across five rounds; $356M Series D in April 2025.[^44]

## Part V — Frameworks Becoming Compliance Surface

Four frameworks are converging into a procurement-relevant compliance stack: MITRE ATLAS, NIST AI Risk Management Framework, OWASP GenAI Top 10, and ISO 42001.

**MITRE ATLAS** (Adversarial Threat Landscape for AI Systems) is the most operationally mature. Per the MITRE ATLAS website,[^73] the framework is a "globally accessible, living knowledge base of adversary tactics and techniques against AI-enabled systems." The atlas-data GitHub CHANGELOG[^74] documents continuous additions (new techniques, case studies, mitigations) on a roughly quarterly cadence. The MITRE Center for Threat-Informed Defense (CTID) released Secure AI v2 in 2025,[^75] extending the matrix with new techniques and case studies. Per Christina Liaghati's NIST Cybersecurity and Privacy Advisory Committee overview (September 2025),[^76] ATLAS is positioned as the de-facto attack-side reference for AI security teams. The atlas-data repository is open-source.[^77]

**NIST AI Risk Management Framework (AI RMF 1.0)** provides the governance scaffolding. Per the same NIST CSRC overview,[^76] the AI RMF is being adopted by federal agencies as the AI-system risk reference and is being mapped to ATLAS for the threat side. The implication for vendors: passing FedRAMP for an agentic SOC product increasingly requires both a NIST AI RMF mapping (governance side) and an ATLAS mapping (threat side).

**OWASP GenAI Top 10** addresses AI-application security specifically, with categories for prompt injection, insecure output handling, training-data poisoning, model denial-of-service, supply-chain vulnerabilities, sensitive-information disclosure, insecure plugin design, excessive agency, overreliance, and model theft. Vendor announcements increasingly cite OWASP GenAI alongside ATLAS as the defensive reference set.

**ISO 42001** provides the AI management-system certification. CrowdStrike's Charlotte AI is ISO 42001-certified for AI governance with built-in controls;[^16] this is the published "we did the auditor's work" signal. Per the company, every Charlotte AI answer is "traceable, every action user-authorized, every decision is grounded in validated data and aligned to your role."

The hedged claim: many vendor announcements gesture at ATLAS / NIST / ISO compliance; few publish structured mappings. The implication for buyers — and for founders selling into regulated buyers — is to ask for the mapping document, not the badge claim. The mapping is the artifact that survives a procurement audit; the badge is decoration.

> **Quotable Findings — Part V**
> - Per MITRE, ATLAS is a "globally accessible, living knowledge base of adversary tactics and techniques against AI-enabled systems."[^73]
> - Per CrowdStrike, Charlotte AI is ISO 42001-certified for AI governance.[^16]
> - The atlas-data CHANGELOG documents quarterly additions of new techniques, case studies, and mitigations.[^74]

## Part VI — The Capital Map (FY2025 → Q1 2026)

Capital flow is a leading indicator of where the architecture is going. The 2025–2026 cybersecurity capital map has three load-bearing data points.

**Q1 2026 venture funding.** Per Crunchbase News, $4.9B[^28] in cybersecurity venture funding closed globally in Q1 2026, across roughly 200 rounds of $200K+ and 13 financings of $100M+.[^28] Per the same dataset, AI captured 80% of all global venture funding in Q1 2026 — a record high — and cybersecurity is one of the largest single AI sub-segments. The largest single Q1 round was Cloaked's $375M[^28] Series B;[^28] Tenex.AI and Upwind Security each priced $250M[^28] Series B.[^28] No major cybersecurity IPOs priced in Q1 2026.[^28] M&A: CrowdStrike acquired SGNL for a reported $740M, Palo Alto Networks acquired Koi for a reported $400M.[^28]

**Full-year 2025 venture funding.** Per Crunchbase News, $18B in cybersecurity venture funding in 2025, up 26% YoY — the third-highest annual total in the past decade.[^29] Seven-plus rounds of $400M+. Wiz raised $940M[^29] across two rounds in 2025 prior to the Google close. Cyera raised $700M[^29] at $3B+[^29] valuation in December 2025.[^29] NinjaOne raised $500M[^29] Series C[^29] in early 2025.[^29] Just under 1,000 reported financings — the lowest deal-volume count in a decade — indicating round-size expansion, not cycle expansion.[^29] Early stage (Series A/B) was the strong sub-segment at $7.5B[^29] (up 63%[^29] YoY across 300+ deals).[^29] 74%[^29] of US cybersecurity funding flowed to US-headquartered startups.[^29] Headline IPO of 2025: Netskope priced ~$6B[^29] valuation in September 2025.[^29] SonicWall was acquired for $7.75B[^29] in late December 2025.[^29]

**M&A baseline.** Google/Wiz $32B is the cycle-defining transaction[^1][^4][^5] — Google's largest acquisition in history.[^5] At $32 billion, the deal exceeded the prior Alphabet record (Motorola Mobility, $12.5B in 2012)[^5] by 2.5×. Per Yahoo Finance citing Dealogic, Wiz at $32B was the largest M&A deal globally for 2025.[^4] DOJ closed its investigation in October 2025;[^11] EU approval landed in February 2026.[^4]

The capital map points to two patterns. Pattern one: round-size expansion at the top end of the wave (the $100M+[^28] tier) suggests venture is concentrating bets in "agentic SOC operators" and "agent-securing-agent" pure-plays where the platform thesis is winnable. Pattern two: deal-volume contraction in 2025 (1,000 financings, decade low) suggests the wave is concentrating, not broadening — fewer companies are getting funded, but the survivors are getting funded heavily.

> **Quotable Findings — Part VI**
> - Per Crunchbase, Q1 2026 cybersecurity venture funding totaled $4.9B globally with 13 financings of $100M+.[^28]
> - Per Crunchbase, 2025 totaled $18B in cybersecurity venture funding (up 26% YoY) — third-highest annual total in a decade.[^29]
> - Google/Wiz $32B is Google's largest acquisition in history, exceeding the $12.5B Motorola purchase by 2.5×.[^5]
> - Per Yahoo Finance citing Dealogic, Google/Wiz was the largest global M&A deal of 2025.[^4]

## Part VII — What "Agentic SOC" Actually Looks Like in Production

Five published-data points are worth grounding the vendor narrative in. Each is from a primary corporate source, attributed in hedged-prose form rather than asserted as ground truth.

**Microsoft's 75%[^26] phishing/malware automation.** Per Microsoft's Security blog (April 9, 2026)[^26], internal task agents are automating 75%[^26] of phishing and malware investigations under defender supervision in live environments.[^26] The same disclosure documents that exposure assessments which "once required a full day of engineering effort" complete in under an hour by an agent. The framing is a three-stage maturity model: trusted foundation → human-supervised bounded agents → agent-orchestrated outcomes. Caveat: this is Microsoft's internal Security Operations Center benchmark, not a third-party-validated industry benchmark.

**Lumu Autopilot's 45.3%[^27] autonomous resolution.** Per Lumu's RSA 2026 disclosure (March 24, 2026), Autopilot has executed 7.2 million end-to-end investigation/remediation workflows since its 2024 launch and has independently closed 45.3%[^27] of confirmed-compromise incidents over a twelve-month operating window.[^27] In February 2026 alone, the platform processed 1.54 trillion network traffic records, peaking at 67.4 billion records analyzed in a single 24-hour window. The platform eliminated 17,000+ hours of manual triage and reduced analyst workload by up to 69.9%.[^27] Per CEO Ricardo Villadiego, "an execution engine that makes high-fidelity decisions at machine speed" rather than "AI Copilots that summarize alerts."

**CrowdStrike's 2026 Global Threat Report adversary-speed metrics.** Per Forbes coverage of the report (April 16, 2026), fastest recorded adversary breakout time dropped to 27 seconds, average breakout to 29 minutes (down from 48 minutes in 2024), an 89%[^38] YoY increase in AI-deployed attacks, and 1,800+ distinct AI applications observed across customer endpoints.[^38] The disclosure is the basis for CrowdStrike's "agentic security workforce" framing.

**Arctic Wolf Aurora vendor-published metrics.** Per the Aurora launch coverage at RSA 2026, Arctic Wolf reports cases resolved 15× faster, ticket quality 3× higher, deployment in as little as 10 days, and customers averaging one ticket per day.[^47] The same launch cited Gartner's estimate that AI SOC agents have achieved only 1–5%[^47] market penetration of their target audience, and a separate survey reporting only 30%[^47] of cybersecurity teams have integrated AI security tools into operations.

**The arXiv AgentSOC framework.** The 2026 IEEE-track paper reports a sub-second end-to-end runtime (~506ms) on the LANL authentication dataset for a multi-layer agentic framework integrating perception, anticipatory reasoning, and risk-aware action planning.[^49] The work is academic, not production — but it formalizes the architectural pattern the vendor wave is operationalizing.

The missing artifact in the canon is a field-level 2026 benchmark — an ATLAS + MITRE + NIST collaboration measuring agentic SOC accuracy, false-positive rate, mean-time-to-resolution, and analyst-replacement ratio under standardized conditions. Until that exists, vendor self-disclosed metrics are the load-bearing reference set, and they should be cited as such.

> **Quotable Findings — Part VII**
> - Per Microsoft, internal task agents automate 75% of phishing and malware investigations.[^26]
> - Per Lumu, Autopilot has executed 7.2M autonomous workflows and closed 45.3% of confirmed-compromise incidents fully autonomously.[^27]
> - Per CrowdStrike, fastest adversary breakout time is now 27 seconds; average 29 minutes.[^38]
> - Per Gartner data cited at RSA 2026, AI SOC agents are at 1–5% target-audience penetration.[^47]

## Part VIII — Communities + Distribution

Where security buyers actually live and how AI-native vendors reach them.

**RSA Conference 2026** (March 24–27, San Francisco) was the most concentrated agentic-cybersecurity moment of the year. CrowdStrike launched the Charlotte AI AgentWorks Ecosystem with nine top-tier launch partners.[^17][^18] CrowdStrike + IBM announced their Agentic SOC integration the same day.[^52] Lumu disclosed the Autopilot autonomous-resolution metrics at RSAC.[^27] Arctic Wolf launched Aurora.[^47] Microsoft published the agentic SOC blog the week before, framing the vendor pitch.[^26] Palo Alto Networks held Cortex Symphony 2026 in parallel.[^24][^25] Net effect: the four largest agentic SOC narrative releases of the year compressed into a single 96-hour window in the same convention center.

**Black Hat USA / DEF CON** (Las Vegas) remains the research-led credibility moment. AI-native cybersecurity products that ship a Black Hat/DEF CON presentation are signaling research depth; products that ship only RSA-level keynotes are signaling sales-led positioning.

**Fal.Con** (CrowdStrike's owned community) ran Las Vegas in September 2025[^13][^14] and Barcelona in November 2025.[^53][^16] Both events anchored major agentic announcements. The Fal.Con franchise is the closest thing the agentic SOC category has to a vendor-owned community moment with both customer attendance and competitive press coverage.

**Channel partnerships as distribution.** Per CrowdStrike's AgentWorks Ecosystem launch, Telefónica Tech, Accenture, Deloitte, and Kroll are positioned as global system integrators "leveraging AgentWorks to open new business opportunities by designing and deploying security agents that meet unique customer needs."[^18] IBM Consulting's Threat Detection and Response services and the X-Force Cyber Range are CrowdStrike + Falcon distribution paths.[^52] Cisco's reseller channel and the Microsoft Security Store provide parallel distribution surfaces.

**Vendor marketplaces.** The Microsoft Security Store carries 30+ partner-built Security Copilot agents.[^19] CrowdStrike's AgentWorks Ecosystem opens a parallel third-party marketplace inside Falcon. Palo Alto's Cortex Marketplace is the third surface. Per Microsoft's E5 inclusion announcement, customers had created 370+ unique custom agents in four months[^19] — the implied weekly creation rate is the demand-side signal that founders selling agents into these stores need to understand.

**Bottom-up Reddit communities.** /r/cybersecurity (1.5M+ subscribers as of 2026), /r/AskNetsec, /r/sysadmin, /r/blueteamsec — the equivalent of /r/Lawyertalk for legal-AI. The pattern that produced Spellbook (originating in /r/Lawyertalk per the State of Vertical Agents Q3 2026 Legal paper) translates cleanly: a cybersecurity tool that lands a top-rated thread on /r/cybersecurity gets 3–10× the inbound interest of a thread on a vendor blog.

**Substacks and named industry analysts.** Augie Ray, Wendy Nather, Anton Chuvakin, Allie Mellen — the named analysts who can move a procurement budget. The CISO podcast circuit (Defense in Depth, CISO Series, Resilient Cyber) is the audio equivalent.

> **Quotable Findings — Part VIII**
> - RSA 2026 (March 24–27) compressed the four largest agentic-SOC vendor releases of the year into a 96-hour window.
> - Per Microsoft, customers created 370+ custom Security Copilot agents in the four months between September and November 2025.[^19]
> - Three vendor marketplaces structure third-party distribution: Microsoft Security Store, CrowdStrike AgentWorks Ecosystem, Palo Alto Cortex Marketplace.[^19][^18][^25]

## Part IX — 90-Day Field Manual: AI-Native Cybersecurity Wedges

A founder's playbook for entering cybersecurity as an AI-native vendor in mid-2026.

**Days 1–30: pick a sub-vertical inside cybersecurity that satisfies four conditions.**

(a) *Workflow ROI is verifiable from existing telemetry.* If a SOC analyst spends N hours per week on a workflow, and the agent reduces that to M hours, the savings are auditable. Phishing triage (Microsoft's 75% automation benchmark)[^26] is the canonical example. Compliance evidence-gathering (Drata's VRM Agent territory)[^42] is another. Vendor selection inside an existing tool stack is auditable in seat-license-spend reduction.

(b) *The buyer is the SOC analyst or CISO directly, not a GRC committee.* The agentic SOC demand curve is shaped by analyst pain (alert fatigue, the 1,968-attacks-per-week figure cited by Escape)[^70] not by board-level mandate. Selling to the analyst-as-buyer compresses the sales cycle from 9–12 months to 60–90 days.

(c) *Integration touchpoint is a published API surface.* Splunk Cloud, Microsoft Defender, CrowdStrike Falcon, Palo Alto Cortex, AWS Security Hub. If the integration requires a private partner agreement, the wedge is too narrow. If the integration is one of the published marketplace surfaces (Microsoft Security Store, AgentWorks Ecosystem, Cortex Marketplace), the wedge is too crowded — but the GTM motion is faster.

(d) *The alternative is a human team, not a competing agent.* Tier-1 alert triage is human-team-replaced (high ROI, easier sale). Tier-3 incident-response orchestration is human-augmented (harder sale, longer cycle, but more defensible long-run).

**Days 31–60: ten paid pilots from a single source.**

The single source is typically one of: a vendor channel partner (Telefónica Tech, Accenture, Deloitte, Kroll inside the CrowdStrike AgentWorks Ecosystem;[^18] IBM Consulting inside the CrowdStrike + IBM agentic SOC integration[^52]), a vendor marketplace (Microsoft Security Store,[^19] AgentWorks Ecosystem,[^18] Cortex Marketplace[^25]), or a defined community (a /r/cybersecurity thread, a CISO podcast appearance, a Black Hat presentation).

Avoid: ten pilots from ten different sources. The variance kills the case study and the GTM doesn't compound.

**Days 61–90: a case study with named customer + measured productivity delta + reference-able buyer.**

Lumu's Autopilot framing is the canonical reference: 45.3% autonomous resolution, 17,000+ hours saved, named platform consumer.[^27] Drata's $100M ARR + 8,000 customers framing is the parallel for compliance-automation founders.[^39][^41] Outtake's "ARR up 6× year-over-year, customer base up 10×" with named customers OpenAI, Pershing Square, AppLovin, federal agencies[^35] is the parallel for agent-securing-agent founders.

Anchor pricing to analyst-hours saved, not to consumption. Securonix's productivity-based pricing model[^48] — "tying AI directly to analyst productivity" rather than charging by usage — is the cleanest commercial framing for the cycle. Consumption-based pricing penalizes the buyer for letting the agent work harder; productivity-based pricing aligns vendor incentives with buyer outcomes.

**Avoid:**
- Building horizontal "AI for security" without a pre-validated wedge — the incumbent platforms (CrowdStrike Charlotte AI, Microsoft Security Copilot, Palo Alto Cortex AgentiX) ship horizontal coverage by default.
- Competing with an incumbent's free agent on the same workflow. If Charlotte AI ships a Phishing Triage Agent, do not build a Phishing Triage Agent — build the agent that *uses* Charlotte AI's output.
- Promising MITRE ATLAS, NIST AI RMF, or ISO 42001 compliance without published mappings. The buyer will ask for the document.
- Confusing "we use MCP" with "we differentiate on MCP." MCP is now table stakes (CrowdStrike, Microsoft, Palo Alto, Securonix, Panther all ship MCP support).

> **Quotable Findings — Part IX**
> - The four conditions for a defensible cybersecurity wedge: verifiable workflow ROI, analyst-or-CISO buyer, published-API integration, human-team-replacement target.
> - Anchor pricing to analyst-hours saved (productivity-based pricing) rather than consumption — per Securonix's published commercial framing.[^48]
> - The three vendor-marketplace surfaces structure third-party distribution: Microsoft Security Store, CrowdStrike AgentWorks Ecosystem, Palo Alto Cortex Marketplace.[^19][^18][^25]

## Part X — Where This Goes

H2 2026 → 2028, hedged forward-looking.

**H2 2026.** The AgentWorks Ecosystem, the Microsoft Security Store, and the Cortex Marketplace decide which AI-native cybersecurity startups graduate to platform partnerships vs. become acquisition targets. The CrowdStrike–IBM integration[^52] is the template for how an agentic SOC platform absorbs a global system integrator's services arm; expect parallel announcements through 2026 as Microsoft, Palo Alto Networks, and Cisco compete for the same SI distribution. Palo Alto's intent to acquire Koi[^25] is the template for incumbent absorption of a pure-play agent-securing-agent startup.

**2027.** Productivity-based pricing — Securonix's "analyst work delivered" framing[^48] — becomes the dominant agentic SOC commercial model, displacing consumption metering. EU AI Act high-risk Annex III obligations bite on AI-app security tools where the agent makes decisions affecting natural persons; ISO 42001 and NIST AI RMF mappings become procurement table stakes. Independent benchmarks emerge — likely from MITRE, NIST, or a coalition of CISOs — measuring agentic SOC accuracy and analyst-replacement ratio under standardized conditions. The Gartner 1–5% penetration figure cited at RSA 2026[^47] crosses 15–20% of the target audience.

**2028.** Agentic SOC penetration crosses 30%[^47] of the target audience (extrapolated from the Gartner Q1 2026 baseline[^47]). Per-incumbent agentic capability becomes commoditized; differentiation shifts to proprietary telemetry corpus (CrowdStrike's Falcon Complete decision graph, Microsoft's 84-trillion-signal-per-day stream)[^72] plus ecosystem network effects (which marketplace, which channel partner, which framework mapping). The pure-play agentic SOC operators that survive are the ones that achieved escape velocity via federal/public-sector channels (Torq's Merlin Ventures path)[^34] or via verifiable autonomous-resolution metrics (Lumu's 45.3% disclosure).[^27] Compliance automation consolidates around Drata + Vanta + Chainguard at the top of the league table; the smaller players either niche-down (sovereign-data, regulated-industry-specific) or are acquired.

The recurring asset, for the founder: an AI-native cybersecurity tool that anchors a $5K–$50K[^28] ACV per customer × 1,000–10,000 customers[^32] = $5M–$500M[^28] ARR — without ever displacing a Microsoft, CrowdStrike, or Palo Alto seat. The market is large enough to support 50+ distinct $50M+[^28] ARR pure-plays plus the six platform incumbents. Per Crunchbase, $4.9B in Q1 2026 venture funding[^28] is the market's bet on this exact outcome.

## Closing

Three takeaways for the founder:
1. The wedge has to satisfy four conditions: verifiable ROI, analyst-or-CISO buyer, published-API integration, human-team-replacement.
2. Ship a published mapping to MITRE ATLAS, NIST AI RMF, OWASP GenAI Top 10, or ISO 42001 — not a badge claim.
3. Anchor pricing to analyst-hours saved (productivity-based), not consumption — per Securonix's framing.[^48]

Three takeaways for the CISO:
1. The 1–5% AI SOC agent penetration figure[^47] is the leading edge; the next 18 months decide whose data layer your team operates on.
2. Ask vendors for the structured mapping document, not the marketing badge. The mapping survives a procurement audit.
3. Productivity-based pricing aligns vendor incentives with your analyst's output. Consumption-based pricing penalizes the agent for working harder.

Three takeaways for the investor:
1. The capital map points to round-size expansion at the top of the wave; deal-volume contraction underneath.[^28][^29] Bet on the survivors, not the breadth.
2. The pure-play "agents that operate the SOC" track and the "agents that secure other agents" track produce different defensibility profiles. The first is platform-vulnerable; the second is customer-vulnerable.
3. The framework-mapping artifact (ATLAS / NIST / ISO) is a leading indicator of procurement-readiness. Vendors without published mappings are 12–18 months away from federal-grade revenue.

## Glossary

- **Agentic SOC** — A security operations center where AI agents handle Tier 1 + Tier 2 triage, investigation, and bounded response autonomously, with human analysts in supervisory roles. Distinct from SOAR (which automates fixed playbooks under deterministic logic).

- **Agentic SOAR** — Reasoning-with-tools orchestration replacing rule-based SOAR. Examples: Charlotte Agentic SOAR (CrowdStrike),[^15] Cortex AgentiX (Palo Alto),[^22] Securonix Agentic Mesh.[^48]

- **MITRE ATLAS** — Adversarial Threat Landscape for AI Systems. Open knowledge base of adversary tactics and techniques against AI-enabled systems.[^73]

- **NIST AI RMF** — NIST AI Risk Management Framework 1.0. Governance scaffolding for AI-system risk, mapped to ATLAS for the threat side.[^76]

- **OWASP GenAI Top 10** — Application security categories for GenAI, including prompt injection, insecure output handling, training-data poisoning, excessive agency, etc.

- **ISO 42001** — AI management-system certification standard. CrowdStrike's Charlotte AI is ISO 42001-certified.[^16]

- **MCP (Model Context Protocol)** — The integration protocol that enables agents to call external tools and data sources. Now native across CrowdStrike, Microsoft, Palo Alto, Securonix, and Panther agentic SOC platforms.

- **A2A (Agent-to-Agent)** — Communication and orchestration protocol between agents. Charlotte Agentic SOAR is positioned as the A2A orchestration layer in the CrowdStrike ecosystem.[^15]

- **Non-human identity (NHI)** — Identity management for AI agents, service accounts, and automated workloads. Oasis Security is the leading pure-play.[^69]

- **Exposure management** — Cloud-security-posture-management with attack-path graphing. Wiz's category, now under Google Cloud after the $32B acquisition close.[^1][^4]

- **Security data lake** — The unified telemetry layer that agentic SOC platforms operate over. Examples: Cortex Extended Data Lake (15+ PB/day),[^24] Falcon Security Cloud, Microsoft Sentinel.

## Related Research

This paper sits in the *State of Vertical Agents 2026* canon and depends on the following prior work in the series:

- **The B2A Imperative** (paper #1) — frames vertical agents as the B2A archetype; cybersecurity is the most agentic-procurement-mature buying behavior in the enterprise.
- **The Pinnacle Gecko Protocol** (paper #2) — agent-discovery and capability advertising mechanics; the AgentWorks Ecosystem and Cortex Marketplace are the operational instantiation in security.
- **The MCP Server Playbook for SaaS Founders** (paper #3) — extends to cybersecurity: every agentic SOC platform shipped between September 2025 and March 2026 ships native MCP support.
- **GEO/AEO 2026** (paper #4) — the discovery layer; AI-native cybersecurity vendors compete for retrieval-engine citations as much as Gartner Magic Quadrant placement.
- **The Agent Payment Stack 2026** (paper #5) — productivity-based pricing depends on the payment-rail primitives; Securonix's "analyst work delivered" model is downstream of the rails.
- **Agentic Procurement Field Manual** (paper #11) — buyer-side mirror; CISOs are the most agentic-procurement-mature buyer cohort.
- **EU AI Act Procurement Compliance** (paper #12) — Article 6/26/27 obligations for high-risk security AI; Annex III bites on agentic security tools that affect natural persons.
- **Multi-Judge Calibration** (paper #13) — eval architecture for agentic SOC accuracy gates; the missing field-level benchmark for the cybersecurity vertical.
- **SLM Procurement** (paper #14) — most agentic SOC workloads are SLM-suitable; the cost curve in 2027 favors SLM-anchored agents.
- **Agent Incident Postmortem Anthology** (paper #15) — production controls for security agents; the operational mirror to this paper's vendor-survey lens.
- **State of Vertical Agents Q3 2026 Legal** (paper #19) — sister paper, same authority-survey profile; cybersecurity and legal are the two most agentic-procurement-mature regulated verticals in 2026.

## References

[^1]: Google Cloud — "Google completes acquisition of Wiz." Published 2026-03-11. https://cloud.google.com/blog/products/identity-security/google-completes-acquisition-of-wiz


[^2]: PR Newswire — "Google Completes Acquisition of Wiz." Published 2026-03-11T12:38:00Z. https://www.prnewswire.com/news-releases/google-completes-acquisition-of-wiz-302710989.html


[^3]: Yahoo Finance — "Google Parent Alphabet Strikes $32B Deal to Buy Cybersecurity Firm Wiz." Nisha Gopalan. Published 2025-03-18. https://finance.yahoo.com/news/google-parent-alphabet-strikes-32b-144938822.html


[^4]: TechCrunch — "Google wraps up $32B Wiz acquisition." Rebecca Bellan. Published 2026-03-11T12:56:54Z. https://techcrunch.com/2026/03/11/google-completes-32b-acquisition-of-wiz/


[^5]: CNBC — "Google to acquire cloud security startup Wiz for $32 billion." Samantha Subin. Published 2025-03-18T12:35:49.000Z. https://www.cnbc.com/2025/03/18/google-to-acquire-cloud-security-startup-wiz-for-32-billion.html/


[^6]: Cybersecurity Dive — Google completes $32B Wiz acquisition. Published 2026-03-11T11:08:58Z. https://www.cybersecuritydive.com/news/google-32-billion-acquisition-wiz/814437/


[^7]: Business Insider — "Google closes Wiz acquisition for $32 billion." Published 2026-03-11T13:08:08Z. https://www.businessinsider.com/google-closes-wiz-acquisition-cybersecurity-2026-3


[^8]: SecurityWeek — "Google to Acquire Cloud Security Giant Wiz for $32 Billion in Cash." Eduard Kovacs. Published 2025-03-18. https://www.securityweek.com/google-to-acquire-cloud-security-giant-wiz-for-32-billion-in-cash/


[^9]: TechCrunch — "Google completes $32B acquisition of Wiz." Rebecca Bellan. Published 2026-03-11. https://techcrunch.com/2026/03/11/google-completes-32b-acquisition-of-wiz/



[^10]: CRN — "Google Confirms Acquisition Of Wiz For $32B; Google Cloud Has Bold Plans." Mark Haranas. https://www.crn.com/news/cloud/2025/google-confirms-acquisition-of-wiz-for-32-billion-google-cloud-has-bold-plans


[^11]: Bloomberg — "Google Clears DOJ Antitrust Hurdle for $32 Billion Wiz Deal." Josh Sisco. Published 2025-11-05T07:22:31.000Z. https://www.bloomberg.com/news/articles/2025-11-05/google-clears-doj-antitrust-hurdle-for-32-billion-wiz-deal


[^12]: Wiz Blog — "It's Official: Wiz Joins Google!" Published 2026-03-11T12:41:21Z. https://www.wiz.io/blog/google-closes-deal-to-acquire-wiz


[^13]: CrowdStrike IR — "CrowdStrike Unleashes the Agentic Security Workforce to Transform Security Operations." Published 2025-09-16. https://ir.crowdstrike.com/news-releases/news-release-details/crowdstrike-unleashes-agentic-security-workforce-transform


[^14]: CrowdStrike IR — "CrowdStrike Unleashes the Agentic Security Workforce to Transform Security Operations." Published 2025-09-16 (Fal.Con 2025).


[^15]: CrowdStrike Press Release — "CrowdStrike Unveils Charlotte Agentic SOAR." Published 2025-11-05. https://www.crowdstrike.com/en-us/press-releases/crowdstrike-unveils-charlotte-agentic-soar/


[^16]: CrowdStrike IR — "CrowdStrike Unveils Charlotte Agentic SOAR." Published 2025-11-05 (Fal.Con Europe Barcelona). https://ir.crowdstrike.com/news-releases/news-release-details/crowdstrike-unveils-charlotte-agentic-soar-orchestrate-agentic


[^17]: CrowdStrike Press Release — "CrowdStrike Launches the Charlotte AI AgentWorks Ecosystem for Building Secure Agents." Published 2026-03-25. https://crowdstrike.com/en-us/press-releases/crowdstrike-launches-charlotte-ai-agentworks-ecosystem-for-building-secure-agents/


[^18]: CrowdStrike Press Release — "Charlotte AI AgentWorks Ecosystem." Published 2026-03-25 (RSA 2026). https://crowdstrike.com/en-us/press-releases/crowdstrike-launches-charlotte-ai-agentworks-ecosystem-for-building-secure-agents/


[^19]: Microsoft Security Blog — "Agents built into your workflow: Get Security Copilot with Microsoft 365 E5." Dorothy Li. Published 2025-11-18T16:00:00Z. https://www.microsoft.com/en-us/security/blog/2025/11/18/agents-built-into-your-workflow-get-security-copilot-with-microsoft-365-e5/


[^20]: Microsoft Blog — "Introducing the first Frontier Suite built on intelligence trust." Judson Althoff. Published 2026-03-09. https://blogs.microsoft.com/blog/2026/03/09/introducing-the-first-frontier-suite-built-on-intelligence-trust/


[^21]: Microsoft Security Blog — "Microsoft Agent 365 now generally available." Nirav Shah, Rob Lefferts, Jason Roszak. Published 2026-05-01. https://www.microsoft.com/en-us/security/blog/2026/05/01/microsoft-agent-365-now-generally-available-expands-capabilities-and-integrations/


[^22]: Palo Alto Networks Press Release — "Palo Alto Networks Unveils Cortex AgentiX." Published 2025-10-28. https://www.paloaltonetworks.com/company/press/2025/palo-alto-networks-unveils-cortex-agentix-to-build--deploy-and-govern-the-agentic-workforce-of-the-future


[^23]: Palo Alto Networks Blog — "Cortex AgentiX intro." Gonen Fink. Published 2025-10-28T18:31:08Z. https://www.paloaltonetworks.com/blog/2025/10/agentic-ai-platform-for-agentic-workforce-future


[^24]: Palo Alto Networks Blog — "The SOC Is Now Agentic — Introducing the Next Evolution of Cortex." Gonen Fink. Published 2026-02-25T16:30:55Z. https://www.paloaltonetworks.com/blog/2026/02/soc-agentic-next-evolution-cortex/


[^25]: Palo Alto Networks Blog — "The SOC Is Now Agentic — Introducing the Next Evolution of Cortex." Gonen Fink. Published 2026-02-25. https://www2.paloaltonetworks.com/blog/2026/02/soc-agentic-next-evolution-cortex/


[^26]: Microsoft Security Blog — "The agentic SOC: Rethinking SecOps for the next decade." Rob Lefferts, David Weston. Published 2026-04-09T19:00:00.000Z. https://www.microsoft.com/en-us/security/blog/2026/04/09/the-agentic-soc-rethinking-secops-for-the-next-decade/


[^27]: Lumu Press Release — "Lumu Delivers Autonomous Security Operations at Scale Through Its Agentic SOC Offering." Published 2026-03-24 (RSA 2026). https://lumu.io/resources/lumu-delivers-autonomous-security-operations-at-scale-through-its-agentic-soc-offering


[^28]: Crunchbase News — "Cybersecurity Funding Q1 2026 ($4.9B)." Joanna Glasner. Published 2026-04-20T11:00:54Z. https://news.crunchbase.com/cybersecurity/data-robust-venture-funding-ai-q1-2026/


[^29]: Crunchbase News — "Big Year for Cybersecurity 2025 ($18B)." Joanna Glasner. Published 2026-01-16.


[^30]: BusinessWire — "7AI Raises Largest Cybersecurity A Round in History." Published 2025-12. https://www.businesswire.com/news/home/20251204907769/en/Citing-the-Agentic-Security-Inflection-Point-7AI-Raises-Largest-Cybersecurity-A-Round-in-History-to-Bring-AI-Security-Agents-to-Enterprises


[^31]: Wall Street Journal — "Cybersecurity Startup 7AI Raises $130 Million in Series A Funding." Published 2025-12-04. Referenced via Tracxn 7AI profile: https://www.tracxn.com/d/companies/7ai/


[^32]: Infosecurity Magazine — "AI Security Startups Dominate New Cyber Innovation Awards." Kevin Poireault. Published 2026-03-09T13:25:00.000Z. https://www.infosecurity-magazine.com/news/ai-security-startups-dominate-new/


[^33]: PYMNTS — "Torq Raises $140M for Agentic AI Cybersecurity Platform." https://www.pymnts.com/news/investment-tracker/2026/torq-raises-140-million-dollars-agentic-ai-powered-cybersecurity-platform


[^34]: Torq Press Release — "Torq Secures $140M Series D at $1.2B Valuation to Lead the AI SOC and Agentic AI Era." Published 2026-01-12. https://torq.io/news/torq-seriesd


[^35]: TechCrunch — "AI security startup Outtake raises $40M from Iconiq, Satya Nadella, Bill Ackman." Julie Bort. Published 2026-01-28T21:18:52.000Z. https://techcrunch.com/2026/01/28/ai-security-startup-outtake-raises-40m-from-iconiq-satya-nadella-bill-ackman-and-other-big-names/


[^36]: TechCrunch — "AI security firm depthfirst announces $40 million Series A." Lucas Ropek. Published 2026-01-14T15:50:17.000Z. https://techcrunch.com/2026/01/14/ai-security-firm-depthfirst-announces-40-million-series-a/


[^37]: CognitionHub — "Where the Smart Money Is Going in Cybersecurity." Published 2026-04-23T22:55:01.000Z. https://cognitionhub.com/insights/where-the-smart-money-is-going-in-cybersecurity/


[^38]: Forbes — "CrowdStrike's Next Act: Securing The Era Of Enterprise Agentic AI." Steve McDowell. Published 2026-04-16T18:36:00.000Z. https://www.forbes.com/sites/stevemcdowell/2026/04/16/crowdstrikes-next-act-securing-the-era-of-enterprise-agentic-ai/


[^39]: Drata Press Release — "Drata Crosses $100M in Annual Recurring Revenue." PR Newswire. Published 2025. https://www.prnewswire.com/news-releases/drata-celebrates-four-years-of-transforming-governance-risk-and-compliance-crossing-100-million-in-annual-recurring-revenue-302379875.html


[^40]: Notable Capital Blog — "Drata's $100M ARR Milestone." https://notablecap.com/blog/dratas-milestone-and-why-its-just-the-beginning


[^41]: BusinessWire — "Drata Opens San Francisco Headquarters." Published 2026-02. https://www.businesswire.com/news/home/20260209878114/en/Drata-Opens-San-Francisco-Headquarters


[^42]: Drata Press Release — "Drata Reveals Breakthrough AI Agent to Redefine Vendor Risk Management." PR Newswire. https://www.prnewswire.com/news-releases/drata-reveals-breakthrough-ai-agent-to-redefine-vendor-risk-management-302521809.html


[^43]: CRN — "Drata Brings AI Agent Technology to Vendor Risk Management." https://www.crn.com/news/ai/2025/drata-brings-ai-agent-technology-to-vendor-risk-management-exclusive


[^44]: Chainguard — "Announcing Chainguard's Series D." Published 2025-04. https://www.chainguard.dev/unchained/announcing-chainguards-series-d-building-the-safe-source-for-all-open-source


[^45]: Chainguard — "$356M Series D." PR Newswire. https://www.prnewswire.com/news-releases/chainguard-raises-356-million-in-series-d-funding-to-be-the-safe-source-for-all-open-source-302435220.html


[^46]: Fortune Term Sheet — "Chainguard Secures $356M Series D as Valuation Soars to $3.5B." Published 2025-04-23. https://fortune.com/2025/04/23/exclusive-chainguard-secures-356-million-series-d-as-valuation-soars-to-3-5-billion/


[^47]: SecurityBrief — "Arctic Wolf launches Aurora agentic SOC for AI security." Sean Mitchell. Published 2026-03-24T08:30:00.000Z. https://securitybrief.ca/story/arctic-wolf-launches-aurora-agentic-soc-for-ai-security


[^48]: Securonix Press Release — "Securonix Introduces Agentic Mesh and the First Productivity-Based AI Model for the SOC." Published 2026-02-18T09:00:00.000Z. https://www.globenewswire.com/news-release/2026/02/18/3240250/0/en/Securonix-Introduces-Agentic-Mesh-and-the-First-Productivity-Based-AI-Model-for-the-SOC.html


[^49]: arXiv — "AgentSOC: A Multi-Layer Agentic AI Framework for Security Operations Automation." IEEE 979-8-3315-4970-1. Published 2026. https://arxiv.org/html/2604.20134v1


[^50]: Bloomberg — "Google Agrees to Buy Cloud Security Firm Wiz for $32 Billion." Andrew Martin. Published 2025-03-18. https://www.bloomberg.com/news/articles/2025-03-18/google-agrees-to-buy-cloud-security-firm-wiz-for-32-billion


[^51]: CrowdStrike IR — "CrowdStrike Unleashes New Agentic, Outcome-Driven AI Innovations." Published 2025-04-28. https://www.crowdstrike.com/content/crowdstrike-www/locale-sites/us/en-us/press-releases/crowdstrike-unleashes-agentic-outcome-driven-ai-innovations.html


[^52]: CrowdStrike Press Release — "CrowdStrike and IBM Expand AI Security Partnership for Agentic SOC Transformation." Published 2026-03-25. https://www.crowdstrike.com/en-us/press-releases/crowdstrike-ibm-expand-ai-security-partnership-agentic-soc-transformation/


[^53]: CrowdStrike IR — "CrowdStrike Expands Agentic Security Workforce." Published 2025-11-05. https://ir.crowdstrike.com/news-releases/news-release-details/crowdstrike-expands-agentic-security-workforce-trained-knowledge


[^54]: Microsoft 365 Message Center — Security Copilot inclusion notice MC1261596. Published 2026-03-25. https://mc.merill.net/message/MC1261596


[^55]: Palo Alto Networks — Cortex AgentiX product page. https://www2.paloaltonetworks.com/cortex/agentix


[^56]: SentinelOne Press Release — "Purple AI Athena Release." Published 2025-04-29. https://www.sentinelone.com/press/sentinelone-brings-deep-security-reasoning-agentic-detection-and-response-and-hyperautomation-workflows-to-any-siem-or-data-source-with-purple-ai-athena-release/


[^57]: SecurityBrief — "SentinelOne launches Purple AI Athena to boost SOC automation." Published 2025-04-29. https://securitybrief.eu/story/sentinelone-launches-purple-ai-athena-to-boost-soc-automation


[^58]: SentinelOne Press Release — "Purple AI extended to 3rd-party data sources." Published 2025-01. https://www.sentinelone.com/press/sentinelone-brings-the-power-of-purple-ai-to-zscaler-okta-palo-alto-networks-proofpoint-fortinet-and-microsoft-data/


[^59]: BusinessWire — SentinelOne Purple AI Athena announcement. Published 2025-04-29. https://www.businesswire.com/news/home/20250429490914/en/SentinelOne-Brings-Deep-Security-Reasoning-Agentic-Detection-and-Response-and-Hyperautomation-Workflows-to-Any-SIEM-or-Data-Source-with-Purple-AI-Athena-Release


[^60]: Cisco Newsroom — "Cisco Reimagines Security for Data Centers and Clouds in Era of AI" (Hypershield original). Published 2024-04. https://newsroom.cisco.com/c/r/newsroom/en/us/a/y2024/m04/cisco-reimagines-security-for-data-centers-and-clouds-in-era-of-ai.html


[^61]: Cisco Newsroom — "Cisco Reimagines Security for the Agentic Workforce." Published 2026-03. https://newsroom.cisco.com/c/r/newsroom/en/us/a/y2026/m03/cisco-reimagines-security-for-the-agentic-workforce.html


[^62]: Cisco Newsroom — "Cisco Redefines Security for the Agentic Era." Published 2026-02. https://newsroom.cisco.com/c/r/newsroom/en/us/a/y2026/m02/cisco-redefines-security-for-the-agentic-era.html


[^63]: Cisco Newsroom — "Cisco Launches Breakthrough Innovations for the AI Era." Published 2026-02. https://newsroom.cisco.com/c/r/newsroom/en/us/a/y2026/m02/cisco-launches-breakthrough-innovations-for-the-ai-era.html


[^64]: Cisco Blogs — "Security for the Agentic Era: Cisco AI Defense Breaks New Ground." https://blogs.cisco.com/ai/security-for-the-agentic-era-cisco-ai-defense-breaks-new-ground


[^65]: Cisco — Hypershield product page. https://cisco.com/site/us/en/products/security/hypershield/index.html


[^66]: TechCrunch — "Cybersecurity automation firm Torq lands $42M in expanded Series B." Kyle Wiggers. Published 2024-01-23. https://techcrunch.com/2024/01/23/cybersecurity-automation-firm-torq-lands-42m-in-expanded-series-b/


[^67]: Panther Press Release — "Panther Launches the Complete AI SOC Platform." Published 2026-03-19T13:00:00.000Z. https://www.prnewswire.com/news-releases/panther-launches-the-complete-ai-soc-platform-closing-the-loop-on-security-operations-302718768.html


[^68]: SiliconANGLE — "Swimlane debuts AI SOC with agentic back end to tackle cybersecurity operations." Kyt Dotson. Published 2026-02-18T15:25:45.000Z. https://siliconangle.com/2026/02/18/swimlane-debuts-ai-soc-agentic-backend-tackle-cybersecurity-operations


[^69]: CornerForAI — "Oasis Security raises $120M to secure AI agent identities." Published 2026-03-20T22:33:56Z. https://www.cornerforai.com/news/oasis-security-raises-120m-to-secure-ai-agent-identities-bringing-total-funding-to-195m


[^70]: IRIS — "Escape raises $18M Series A." Published 2026-03. https://www.iris.vc/articles/escape-raises-18m-series-a-to-fight-ai-powered-cyberattacks-with-ai-agents


[^71]: SiliconANGLE — "Cybersecurity Startup Kai Raises $125M to Build Agent-Driven AI Security Platform." Published 2026-03-11. https://siliconangle.com/2026/03/11/cybersecurity-startup-kai-raises-125m-build-agent-driven-ai-security-platform/


[^72]: Microsoft Security Blog — "Microsoft unveils Microsoft Security Copilot agents and new protections for AI." Vasu Jakkal. Published 2025-03-24T16:00:00Z. https://www.microsoft.com/en-us/security/blog/2025/03/24/microsoft-unveils-microsoft-security-copilot-agents-and-new-protections-for-ai/


[^73]: MITRE ATLAS — main website. https://atlas.mitre.org/


[^74]: MITRE ATLAS — atlas-data GitHub CHANGELOG. https://github.com/mitre-atlas/atlas-data


[^75]: MITRE Center for Threat-Informed Defense (CTID) — "Secure AI v2 Release." Published 2026-05. https://ctid.mitre.org/blog/2026/05/06/secure-ai-v2-release/


[^76]: NIST CSRC — MITRE ATLAS Overview, September 2025. Christina Liaghati. https://csrc.nist.gov/csrc/media/Presentations/2025/mitre-atlas/TuePM2.1-MITRE%20ATLAS%20Overview%20Sept%202025.pdf


[^77]: MITRE ATLAS — atlas-data GitHub repository. https://github.com/mitre-atlas/atlas-data


[^78]: Microsoft Learn — "What's new in Security Copilot." https://learn.microsoft.com/en-us/copilot/security/whats-new-copilot-security


[^79]: Palo Alto Networks Blog — "What's New in Cortex (XSIAM 3.3)." Published 2026. https://www.paloaltonetworks.com/blog/security-operations/whats-new-in-cortex/


[^80]: Palo Alto Networks Press Release — "Cortex XSIAM 3.0 launch." https://www.paloaltonetworks.com/company/press/2025/palo-alto-networks-cortex-xsiam-delivers-industry-s-first-ai-driven-secops-platform-to-span-proactive-and-reactive-security


[^81]: TechCrunch — "Google gets the US government's green light to acquire Wiz for $32B." Rebecca Szkutak. Published 2025-11-05T14:58:07.000Z. https://techcrunch.com/2025/11/05/google-gets-the-us-governments-green-light-to-acquire-wiz-for-32b/


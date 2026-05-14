---
title: "The Agent Operating Procedure Playbook"
subtitle: "How to Author AOPs That Survive Model Swaps, Vendor Migrations, and Two-Year Lock-In"
publication: "perea.ai Research"
authors: ["Dante Perea"]
version: "1.0"
status: "Public draft"
date: "2026-05"
audience: "Heads of AI / CX leaders evaluating Decagon, Sierra, Salesforce Agentforce, and Anthropic Cowork; engineering leaders authoring agent workflows in-house; procurement / legal teams negotiating AI vendor MSAs."
length: "~5,500 words"
license: "CC BY 4.0"
description: "The buildable template for Agent Operating Procedures (AOPs): the Decagon-coined natural-language workflow primitive plus its Sierra (Journeys), Bain (agent factory), and Anthropic (Skills) cousins. Synthesizes Decagon's AOP framing, Sierra's eight-block context taxonomy, Bain's six-element agent factory, McKinsey's three software-vendor archetypes, and Anthropic's open-standard Agent Skills into one specification. Covers AOP step types, transitions, escalation paths, version-control workflow, model-swap migration discipline, and the eight-clause MSA exit-clause framework that determines whether your AOPs survive vendor renewals."
profile: technical-playbook
---

## Foreword: Five Vendors, One Pattern — And It Still Has No Open Spec

Decagon coined the term Agent Operating Procedures (AOPs) in April 2025[^1]: "structured, natural language instructions that power AI workflows with enterprise-grade reliability and precision"[^1]. By the time Decagon raised its $250M Series D at a $4.5B valuation in January 2026[^43], the AOP had become the operational primitive every serious enterprise-agent vendor was selling under a different name. Sierra calls them Journeys, paired with composable Skills inside the Agent SDK[^8][^12]. Bain calls them "agent contracts" inside the agent factory[^15]. Anthropic published Agent Skills as an open standard in December 2025[^27][^28]. Google launched the Gemini Enterprise Agent Platform with Agent Studio (low-code) and ADK (code-first) for the same thing[^21].

Five vendors, five names, one underlying pattern: a natural-language workflow definition with code-level guardrails, version-controlled like software, that compiles into runtime behavior. Snowflake Cortex even formalized the lifecycle — a mutable "live version" and immutable "named versions" with alias-based deployment (`production`, `staging`, `canary`, `rollback`)[^31].

But nobody has published the buildable template — the step types, the transitions, the guard conditions, the escalation paths, the version-record format, the eval-set discipline, the exit-clause framework. The artifact vendors keep treating as institutional knowledge. This paper writes it down.

## Executive Summary

Agent Operating Procedures are the operational unit of agentic enterprise AI in 2026. Three forces are converging to make AOP authorship the highest-leverage skill in a customer-experience or back-office AI team.

**First — the vendor consensus has formed.** Decagon ($4.5B[^43][^44], 80%+ average deflection across the platform[^43], 100+ new enterprise customers in 2025[^43]) and Sierra ($15.8B[^47][^48], 40%+ of Fortune 50 as customers[^47], $150M ARR in eight quarters[^48]) both ship the same pattern: a natural-language authorship layer atop deterministic guardrails. Anthropic published Agent Skills as an open standard for cross-platform portability[^27][^28][^29], with documented progressive disclosure (~50 tokens metadata, ~500 tokens SKILL.md, 2,000+ tokens reference files[^29]) and a `/v1/skills` API endpoint for programmatic versioning[^27][^30]. Bain's agent factory thesis codifies the six-element factory sequence and calls the artifact the "agent contract"[^15]. McKinsey's six lessons from 50+ agent builds put workflow-first authorship at the top of the list[^23].

**Second — the failure mode is now documented.** Klarna replaced 700 customer service agents with an OpenAI-powered chatbot in February 2024 and reversed course in May 2025[^55][^56][^57][^58], with CEO Sebastian Siemiatkowski telling Bloomberg "cost unfortunately seems to have been a too predominant evaluation factor when organizing this, what you end up having is lower quality"[^55]. The chatbot still handles two-thirds of inquiries[^57], but the missing layer was authorship — escalation triggers, complexity-tier routing, and human-handoff guard conditions that an AOP makes explicit and version-controlled. The Klarna case is the canonical inverse of disciplined AOP authorship.

**Third — lock-in compounds at four layers simultaneously.** Forrester documents the Salesforce AgentExchange "easier AI, harder exit" dynamic[^59]: data, workflows, and business logic become anchored to a single vendor's control plane. The 2026 procurement-side response is the eight-clause MSA exit framework — data portability, prompt portability, audit-log retention, model-deprecation rights, rate-card stability, agent-level SLAs, termination-for-change-of-control, and trained-state extraction.

This paper synthesizes the AOP pattern across all five vendor canons into a buildable spec, then closes with the 7-decision authorship playbook that determines whether your AOPs survive a model swap, a vendor migration, or a two-year renewal cycle.

## Part I: The AOP Stack — Decagon's Coinage, Sierra's Cousin, Anthropic's Open Standard

The AOP pattern emerged independently at three vendors and converged on the same shape.

**Decagon's coinage (April 2025).** Decagon launched AOPs as "structured, natural language instructions that power AI workflows with enterprise-grade reliability and precision"[^1]. The role-split is the core of the framing: CX teams shape logic in natural language; engineers retain control over "the core systems, enforcing rules and ensuring the AI integrates seamlessly with your existing infrastructure"[^1]. The supporting toolkit launched in tandem: AOP Copilot ingests existing SOPs and "instantly generate[s] a structured workflow"[^2]; Watchtower monitors resolution accuracy and detects mishandled escalations[^4]; Duet (March 2026) automatically generates AOPs from real transcripts and "flags where existing AOPs need updating"[^3]. The five primitives Decagon ships together — AOPs, Simulations, Versioning, Watchtower, Insights — define the minimum viable platform[^3]. Decagon's own argument for why Duet runs on AOPs is the inverse-eat-your-own-dogfood test: "Duet can build and refine AOPs, and because Duet itself runs on AOPs, every capability it develops for customer agents is one it can turn on itself"[^5].

**Sierra's cousin (Agent SDK + Journeys + Skills).** Sierra ships the same primitive under two names. The Agent SDK exposes "composable skills—like triage, respond, and confirm—into complex workflows"[^8] with tunable creativity-vs-determinism per workflow[^8][^12]. Agent Studio's no-code Journeys let teams "define how it handles specific workflows — using natural language to create journeys"[^13]. Sierra's eight-block context taxonomy (Journey, Tool, Rule/Policy, Workflow, Knowledge, Memory, Glossary, Response phrasing[^9]) is the most explicit decomposition: a workflow becomes "just another piece of context made available when conditions are met, rather than the organizing paradigm for the entire system"[^9]. The Ghostwriter agent (April 2026) ingests SOPs, call transcripts, and documentation to produce context blocks automatically[^9][^47] — Sierra's analogue to Decagon's AOP Copilot. Agent Studio 2.0's Workspaces version Journeys, configuration, and simulations "into numbered snapshots that move from QA to staging to production — with complete history and instant rollback built-in"[^10].

**Anthropic's open standard (October 2025 → December 2025).** Anthropic launched Agent Skills as "organized folders of instructions, scripts, and resources that agents can discover and load dynamically"[^27][^28] and published the spec as an open standard for cross-platform portability in December 2025[^27]. The contract: a YAML frontmatter with required `name` and `description`, pre-loaded into the system prompt at startup as the first level of progressive disclosure[^28]. The body of SKILL.md is the second level (loaded on relevance match); bundled reference files form the third level (loaded on demand)[^28][^29]. Token budgets are documented at each level (~50 / ~500 / 2,000+[^29]). Anthropic ships pre-built skills (`pptx`, `xlsx`, `docx`, `pdf`) and a `/v1/skills` endpoint with `code-execution-2025-08-25`, `skills-2025-10-02`, and `files-api-2025-04-14` beta headers[^30]; up to 8 Skills per request[^30]. Named partners (K-Dense, Browserbase, Notion) shipped Skills at launch[^29].

The three names — AOP, Journey, Skill — describe the same artifact at slightly different abstraction levels: natural-language workflow with structured step types, version-controlled, deployable per environment, runtime-loadable on relevance match.

## Part II: The AOP Spec — Step Types, Transitions, Guard Conditions, Escalation Paths

The buildable AOP spec, synthesized across the Decagon, Sierra, and Anthropic canons, has six required components.

**1. Identity and metadata.** A `name` (lowercase, hyphen-separated identifier), a `description` (the primary triggering mechanism — the AOP-selection layer matches on description text), and a `version` (semantic, immutable once committed). Anthropic's Skills spec makes `name` and `description` required frontmatter fields[^28]. Snowflake Cortex names versions `VERSION$N` (e.g., `VERSION$2`, `VERSION$3`) with separate aliases like `production`, `staging`, `canary`, `rollback`[^31] — aliases are pointers, versions are immutable. Decagon's templates extend this with industry-specific identifiers ("order tracking," "membership cancellations," "routing to live agents") drawn from "AOPs launched across various industries"[^4].

**2. Step types.** Decagon's "full library of workflow step types"[^2] is the closed list AOP Copilot composes from. Sierra's Agent SDK exposes the canonical step verbs: triage, respond, confirm[^8]. Generalized across vendors, the seven step types every AOP needs are: `prompt` (gather information from the customer), `lookup` (retrieve from knowledge base or system of record), `tool_call` (invoke an integration — Salesforce, Zendesk, Shopify, CRM, billing[^4][^7]), `decision` (route based on a condition), `confirm` (verify before mutation), `execute` (perform the mutation), and `escalate` (hand off to human). Each step has typed input and output schemas — Bain's agent contract specifies "trigger conditions, typed input/output schemas, explicit autonomy boundaries, tool access permissions, quantified performance targets, and defined escalation modes"[^15] for the whole AOP, but the same applies per-step.

**3. Transitions and guard conditions.** Transitions specify how the AOP advances between steps. Guard conditions are deterministic predicates that block transition when violated. Sierra's declarative model is the clearest articulation: "developers to not only express the goals they want their agent to achieve (e.g., help the customer return an order), but also deterministic guardrails that the agent cannot cross (e.g., orders can only be returned within 30 days of purchase)"[^11]. Guards are the architectural primitive that prevents the Klarna failure mode — the moment a query falls outside the declared envelope (eligibility window, dollar threshold, sentiment score, tier-rule mismatch), the AOP transitions to an escalation step rather than improvising. The "creativity vs determinism" tuning parameter[^8][^12] is per-step, not per-AOP: gathering information can be creative; executing a refund cannot.

**4. Tool contracts.** Each `tool_call` step binds to a versioned tool definition — schema, auth, retry policy, idempotency key. Decagon's engineering-side controls expose tools as "actions in core systems (CRM, billing, fulfillment, etc.)"[^7] managed via Git[^7]. Sierra's Integration Library lets teams "set up and configure those integrations directly in Agent Studio, without code"[^10]; integrations are "fully extensible through Sierra's Agent SDK, so developers can write and connect their own integrations for more complex use cases"[^10]. Anthropic's Skills can include executable code — "Skills can include executable code for tasks where traditional programming is more reliable than token generation"[^27].

**5. Escalation triggers.** Every AOP needs explicit escalation triggers. The four canonical triggers (drawn from the Klarna case and the Decagon Watchtower spec) are: emotional language detection[^65], complex dispute pattern match[^65], repeated contacts on the same issue[^65], and out-of-scope query detection[^65]. Decagon's Watchtower monitors "resolution accuracy and detecting mishandled escalations before they impact customer satisfaction"[^4]. When triggered, "the handoff is seamless rather than requiring the customer to repeat themselves"[^65].

**6. Quotable findings annotations.** The most overlooked AOP component: every workflow step that produces a customer-facing claim should be tagged with the source of authority for that claim. Sierra's Rule/Policy block in the eight-block taxonomy makes this explicit — "Premium cardholders waive foreign transaction fees" is annotated to the policy document or system of record that defines it[^9]. The annotation is the audit trail when the customer disputes the answer six months later.

## Part III: The Bain Agent Factory and the McKinsey Archetypes — Where AOPs Fit

Bain's 2026 "AI Enterprise: Code Red" Tech Report codified the AOP authorship problem at the organizational level as the "agent factory"[^15]: "a repeatable, industrial process for building, testing, deploying, and governing AI agents"[^15]. The six-element sequence is the most explicit AOP-authoring workflow any consultancy has published.

Step 1: "Start with the workflow, not the model"[^15] — codify process maps, edge cases, and failure modes before picking a vendor. Step 2: hard prerequisites — "named subject matter experts and committed business leaders who will own scaling and results"[^15]. Step 3: the agent contract — "If the contract cannot be written, the agent is not ready to be built"[^15]. Step 4: modular orchestration — "Decompose agents into specialized subagents with typed outputs whenever a handoff feeds tools, code, or downstream automation. Prefer deterministic orchestration and validation; use LLM reasoning where flexibility is required"[^15]. Step 5: rigorous evaluation — "human-calibrated baseline and a living evaluation set... Run offline testing until minimum performance thresholds are met, then shadow alongside human agents or safe rollout before full deployment"[^15]. Step 6: govern via a control tower — "full trace logging, real-time visibility into outcomes, continuous automated evaluation against agent contracts, kill switches for inappropriate actions, and progressive rollout"[^15].

The Bain factory maps directly onto the AOP spec from Part II. The agent contract IS the AOP frontmatter plus typed step schemas. The evaluation set IS the simulation library (Decagon's Simulations[^3], Sierra's regression test suite "run for every one of our live customers"[^11]). The control tower IS Decagon's Watchtower[^4] plus the per-version trace logging that flows back to LangSmith / MLflow / Langfuse / Cortex[^31][^32].

**McKinsey's three software-vendor archetypes** define the procurement-side question of where to author AOPs[^26]:

- **Archetype 1: Agents as users/augmentation.** The vendor's existing SaaS continues; agents are bolted on as user-replacing automations. AOPs in this archetype are thin — the underlying SaaS workflow already encodes most of the business logic. Salesforce Agentforce + AgentExchange fits here[^59].

- **Archetype 2: Agent-centric architecture (post-SaaS).** A single agent interface replaces the multi-app SaaS navigation layer. AOPs here become the system of record for workflow logic. Bret Taylor's HumanX argument that most enterprise software is barely used — "Employees log into Workday when they onboard and again at open enrollment, and that's about it"[^47] — is the post-SaaS thesis Sierra is betting on. Decagon's customer profile (Avis Budget, Hertz, Chime, Affirm, Oura, Deutsche Telekom[^43]) is also archetype-2: the agent IS the customer experience.

- **Archetype 3: Agents as experts.** "Domain knowledge and proprietary data used to train the agent to perform in ways the other two archetypes can't"[^26]. AOPs in archetype 3 carry the most institutional knowledge per workflow — a legal-tech agent or a healthcare triage agent encodes regulatory and clinical judgment that the other archetypes can't reproduce.

McKinsey's June 2025 QuantumBlack analysis from 50+ agent builds adds the workflow-first principle: "Focusing on the workflow instead of the agent enabled teams to deploy the right technology at the right point"[^23] — with a decision matrix that pushes multistep + variable-input tasks to AI agents, synthesis + judgment to gen AI, and rule-based + structured tasks to plain rule automation[^23]. McKinsey's reuse argument complements: centralized validated services "virtually eliminate 30 to 50 percent of the nonessential work typically required"[^23], which is the operating logic behind Decagon's AOP templates[^4] and Anthropic's Skill marketplace[^29].

## Part IV: The Version-Control Pattern — Prompts as Code, Snowflake Cortex, MLflow LoggedModel

AOPs ship to production through the same release engineering as application code, but the artifact is heterogeneous: prompt text, tool schemas, model pin, memory schema, configuration. Multiple production systems have converged on the same two-layer model.

**Snowflake Cortex Agent versioning** is the most explicit primitive[^31]. Every agent has a "live version — a mutable working copy you use for development — and can have any number of named versions — immutable snapshots you use for stable deployments"[^31]. Committing the live version creates a `VERSION$N` snapshot. Aliases (`production`, `staging`, `canary`, `rollback`) are pointers that route traffic[^31]. Rollback: "reassign the production alias to the previous named version"[^31]. The Git-import path bypasses the live version entirely: "create a named version from the Git-connected stage, bypassing the live version entirely"[^31].

**Sierra's Workspaces** apply the GitHub model to no-code authorship[^10]: "Each workspace acts as a private editing space where users can make updates without overwriting each other's work. Journeys, configuration, and simulations are versioned automatically, so teams can see exactly what changed and when. When updates are ready, they're combined into numbered snapshots that move from QA to staging to production — with complete history and instant rollback built-in"[^10].

**MLflow LoggedModel** generalizes the pattern beyond agent platforms[^32]. A LoggedModel "captures a complete application state—code references, configurations, dependencies, and performance data in one versioned entity"[^32]. Active-model context auto-links every LLM call to a version[^32] — the bookkeeping that makes per-version performance analysis possible.

**The five-thing bundle.** Across third-party AOP versioning playbooks, the same five components recur as the minimum versioned artifact: prompts, tool definitions, model pin, memory schema, configuration[^40]. Tianpan's framing names three forcing functions[^70]: prompts live outside application code, every change produces an immutable record, and versions include the full execution context (model checkpoint, temperature, max tokens, system message, function-calling schema). Waxell adds the governance-layer linkage[^38]: "code commit hash, the prompt version... list of connected tools and their schema versions at time of deployment, the model identifier and version pin, and the governance policy set active for this deployment."

**The promotion workflow.** The canonical five-stage promotion — Draft → Staging → Canary (5–10% traffic) → Production → Deprecated[^69] — matches what Sierra Workspaces[^10], Snowflake Cortex[^31], Decagon Versioning[^3], and the Rapid Claw canary spec ship by default[^40]. Rapid Claw documents the canary stage table: 1% for 30 minutes, 10% for 2 hours, 50% for 6 hours, 100%[^40], gated by task success rate ≥0.97, p95 latency ≤8000ms, token spend delta ≤+15%, eval score ≥0.90[^40].

**Authorship discipline before any of this.** None of the version-control machinery matters if the AOP isn't extracted from application code in the first place. Supergood frames the discipline as "Step 1: Move all production system prompts into a version-controlled file. Even a single Git repo folder. Commit what's running right now as v1.0.0"[^69]. Prompt Assay's portable export format names the exit contract[^71]: "pick a tool that exports prompts AND version history in a portable format."

The discipline matters more than the tooling. Sierra's release pattern — "each agent release is a snapshot that includes not only the underlying source code and prompts, but model version dependencies and an immutable snapshot of all of the knowledge available to the agent"[^11] — is what the entire MLflow / Cortex / Workspaces stack is rebuilding for non-engineering authors.

## Part V: Model-Swap Migration — The Eval-First Discipline That Survives Frontier-Model Upgrades

The model layer underneath an AOP changes more often than the AOP itself. Anthropic shipped Claude Sonnet 4.5 in September 2025[^60], which Anthropic researcher David Hershey reported "code autonomously for up to 30 hours during early trials"[^60]; Claude Opus 4.7 followed, with Anthropic's migration guide promising "strong out-of-the-box performance on existing Claude Opus 4.6 prompts and evals"[^41]. Anthropic also released the Claude Agent SDK alongside Sonnet 4.5 — "the same infrastructure that powers Claude Code and can be used to help developers build their own agents"[^60].

But "should work" is not "verified." Prompt Assay names the rule[^71]: "When a new model lands, run your existing prompts against it and commit the comparison as a new version BEFORE you flip the production label."

**The three-class migration matrix** is the operational decision[^41]: (1) model-string-only — replace the model string, keep prompts unchanged, run regression eval; appropriate for minor-version successors with no strict output-shape dependency; (2) model-string + light prompt rewrite — required for strict output shapes, scaffolded prompts, observed verbosity or density change, tool-heavy or multi-agent flow; (3) blocked — upgrade requires API-surface changes, parameter rewrites, or tool-handler rewiring; do not improvise[^41].

**The eval-first rule.** "A rewrite without an eval set degenerates into vibes"[^41]. The eval set must predate the rewrite: "A team that rewrites first cannot tell whether output drift is from the new model, the rewrite, or their interaction"[^41]. This maps directly onto the Bain agent factory's living evaluation set[^15] and the Decagon Simulations primitive[^3]. Sierra automated the regression suite for every customer: "When Sierra upgrades the underlying Agent OS platform, we not only run internal evaluations to judge quality, but also run the regression test suite for every one of our live customers to ensure our platform upgrades do not regress behaviors in our customers' agents"[^11].

**The model-pin discipline.** Always pin to dated identifiers (`claude-sonnet-4-5`, `claude-opus-4-7`), never to floating aliases like `claude-latest`[^40]. Rapid Claw makes the point absolute: "Never use 'latest' model IDs"[^40]. The 40–60 hour retuning cost per workflow on a cross-vendor swap[^67] is the price of NOT having pinned versions — without a pin, you don't get to choose when migration happens.

**Provider-managed migrations are the exception.** Anthropic's Migration Guide pattern — "Claude Managed Agents: no changes beyond updating model name are required"[^41] — applies only when the prompts are inside the vendor's managed harness. For self-built agents, the rewrite is conditional on observed drift, not assumed.

**Memory and tool-schema migration.** Auxiliobits names the trap: "if you roll back code but keep an agent's long-term memory, things misalign fast"[^39]. Tool schemas need their own forward-compatibility discipline: "migrations are additive only during a rollout. Add new fields; don't remove or rename old ones. The old version ignores new fields; the new version reads both old and new. Deprecation happens two releases later, after the new version has been stable at 100% for long enough to trust"[^40].

The discipline this paper synthesizes — eval set before rewrite, dated model pins, additive-only schema migration, parallel-version shadowing during canary — is what separates AOPs that survive a frontier-model swap from AOPs that silently regress.

## Part VI: Vendor Lock-In Math — Four Layers, Eight Exit Clauses

AOP authorship discipline only buys you portability if the AOP itself is yours to export. By 2026 the vendor-lock-in math has formalized at four compounding layers and the procurement-side response is an eight-clause MSA framework.

**The four-layer lock-in taxonomy.** Foundation model, orchestration framework, runtime, and behavioral/developer patterns each compound switching cost independently[^68]. The behavioral layer is the deepest and least visible: "Behavioural lock-in grows fastest. Data and model lock-in are the most visible but the least threatening on their own"[^68]. Forrester's read on Salesforce AgentExchange names the dynamic precisely: "The more AI agents you deploy inside Salesforce, the more your data, workflows, and business logic become anchored to Salesforce's database and control plane. What starts as convenience compounds into dependency"[^59]. The $50M builder fund Salesforce attached to AgentExchange[^59] is the catalog-expansion mechanism that deepens the dependency.

**The cognitive entanglement problem.** "When your agents start reasoning using a vendor's model, your workflows get optimized around that model's strengths and quirks, your developers build mental models of what the API can and can't do, and your infrastructure layers accumulate dependencies that compound over time"[^66]. Year five of a vendor relationship, switching means rebuilding the agent library, retraining the team, recertifying compliance posture, and migrating operational data — all simultaneously[^66]. The 40–60 hour retuning cost per major workflow on a cross-vendor model swap[^67] is one component; tool schema translation across 20–50 integrations is "a multi-week engineering effort"[^67]; state migration has no export standard[^67]: "Loss of accumulated context is functionally equivalent to resetting the agent's learned behavior"[^67].

**The verification tax.** Even on the "easier AI" side of the trade-off, the verification tax is the recurring cost: "the time and money spent proving that an AI tool is safe, accurate, and compliant and does not leak data in your specific environment. AppExchange reduces that tax slightly by prechecking listings. But it does not eliminate it"[^59]. Each AOP introduces a verification line item; each version increments it.

**The eight-clause MSA exit framework.** Switching AI vendors in 2026 "is bound primarily by contract terms — exit clauses, data-portability obligations, model-deprecation rights — not by technical migration cost"[^38]. The eight exit clauses every AOP-bearing MSA needs:

1. **Data portability scope.** Right to export trained state, embeddings, agent configurations, and conversation history in standard machine-readable formats at any time during the contract, not just at termination[^68].
2. **Prompt portability.** Right to export the prompt text, system messages, and tool-schema bundle that constitutes the AOP[^38].
3. **Trained-state extraction.** Right to extract any fine-tuned or contextually-trained artifacts derived from customer data — separate from the artifact-vs-data distinction[^38].
4. **Model-deprecation rights.** Contractual minimum notice period (12 months asking, 6 months floor) with parallel availability of deprecated and successor models for a stated overlap window, plus a documented deprecation-driven prompt-change mapping the vendor provides[^38].
5. **Rate-card stability.** Pricing locked at contract signature with a "fair use" definition fixed at signing rather than reset on renewal; usage-cap notification protocol that triggers escalation rather than invoice surprise[^38].
6. **Agent-level SLAs.** SLAs measured on successful task completion, not just model API uptime, with explicit separation of vendor-controlled vs customer-controlled portions of the agent stack[^38].
7. **Audit-log retention.** Audit-log retention extending past contract termination by at least the regulatory floor (six months for EU AI Act Article 16; longer for HIPAA's six-year and SOX's seven-year retention)[^38], in a machine-readable format including provenance, planned-vs-executed action distinction, and policy-version stamps[^38].
8. **Termination-for-change-of-control.** 90-to-180-day window to terminate at signed pricing on vendor acquisition, with data-portability and audit-log obligations intact[^38].

Anthropic's positioning in the lock-in matrix is anchored by the open-standard Skills publication[^27] and the Model Context Protocol authorship — "Requiring MCP compliance is a practical lever for reducing integration-layer lock-in"[^68]. The Ramp data on enterprise AI adoption in May 2026 confirms the strategy is working: Anthropic at 34.4% of paying businesses vs OpenAI at 32.3%[^52], the first time Anthropic has held the top position[^52]. ServiceNow's January 2026 multi-year deal made Claude "the preferred AI models across ServiceNow's AI-driven workflow products" and the default for the ServiceNow Build Agent[^54]; the Infosys-Anthropic partnership integrates Claude into the Topaz AI platform[^53]; the Anthropic-Salesforce, Anthropic-Allianz, Anthropic-Accenture, Anthropic-IBM, Anthropic-Deloitte, and Anthropic-Snowflake deals stack into a distribution model that bets on portable Skills against vertical lock-in[^54]. Anthropic's February 2026 enterprise-agents launch shipped pre-built plug-ins for finance, legal, HR, engineering, and design departments[^49], and Anthropic open-sourced 11 in-house plug-ins as part of the Cowork release[^51] — concrete moves to seed an interoperable agent-skills ecosystem against single-vendor walled gardens.

## Part VII: The Klarna Inverse — What AOP Authorship Would Have Prevented

Klarna replaced 700 customer service agents with an OpenAI-powered chatbot in February 2024, then publicly reversed course in May 2025[^55][^56][^57][^58]. The reversal is the canonical inverse of disciplined AOP authorship.

What the headline numbers obscured: the AI handled volume well — Klarna reported "the AI assistant had taken over two-thirds of customer service chats — 2.3 million in total — in its first month"[^58], with response times improving 82% and a 25% drop in repeat issues[^57]. Resolution time compressed from eleven minutes to two[^64]. Customer service costs cut 40%[^64]. The chatbot still handles two-thirds of inquiries today[^57]. The failure was not capability. It was the authorship layer Klarna never built.

CEO Sebastian Siemiatkowski's May 2025 Bloomberg admission was the diagnostic: "Cost, unfortunately, seems to have been a too predominant evaluation factor when organising this. What you end up having is lower quality"[^55]. Decoded against the AOP spec from Part II: Klarna's deployment had no explicit escalation triggers, no complexity-tier routing, no guard conditions on emotional language or repeated-contact patterns, no Watchtower-equivalent monitoring resolution accuracy by query type. Better Business Bureau "logged over 900 complaints against Klarna in a three-year period, predominantly focused on refunds and billing issues — precisely the categories where the gap between automated processing and human judgment is widest"[^64].

The architectural diagnosis is the cleanest: "Klarna automated the task but didn't redesign the escalation paths, decision boundaries, quality monitoring, or feedback loops that the human workforce had provided implicitly. The humans weren't just answering questions — they were the governance layer. Removing them removed governance"[^65]. AOP authorship IS the governance-layer-as-code response. An AOP makes the escalation path explicit, the decision boundary typed, the quality monitoring versioned, the feedback loop simulation-driven.

The reversal-cost asymmetry is what makes the case load-bearing for any 2026 deployment: "Business cases for AI workforce replacement rarely include the cost of reversing the decision. Recruiting customer service staff after publicly announcing their work had been automated required competing against the company's own narrative — the 'AI replaced us' story makes experienced candidates wary of joining a team that may be automated away again"[^63]. The deployment itself cost Klarna between $2 and $3 million[^65]; the rebuild cost is harder to quantify but compounds at the reputational layer.

The hybrid model Klarna landed on by Q3 2025 — "AI assistant was doing the work of 853 employees" alongside an Uber-style remote-agent workforce[^65] — is what the AOP spec produces by design when the four canonical escalation triggers and the Sierra-style declarative guardrails are written first, not retrofitted after the customer complaints surface. Forrester research-aligned analysis: "trust and satisfaction aren't purely transactional — they're emotional"[^57]. Trust is the part the AOP authorship layer protects when properly versioned, simulated, and governed.

## Part VIII: The 7-Decision Author's Playbook

The seven decisions that determine whether your AOPs survive a model swap, a vendor migration, or a two-year renewal cycle.

**Decision 1 — Extract prompts from application code before anything else.** The first forcing function. Prompts embedded as string literals in your codebase get changed casually, locally, without review[^70]. Move them to a dedicated directory or registry. "Prompt content is not application logic"[^70]. Even a single Git repo folder works as v1.0.0[^69]. Without this step, none of the downstream discipline matters.

**Decision 2 — Write the agent contract before writing the AOP.** Bain's rule: "If the contract cannot be written, the agent is not ready to be built"[^15]. The contract has six components: trigger conditions, typed input/output schemas, explicit autonomy boundaries, tool access permissions, quantified performance targets, defined escalation modes[^15]. The contract IS the AOP frontmatter plus typed step schemas. If you can't write it, the workflow isn't understood well enough to author.

**Decision 3 — Build the eval set BEFORE the AOP, not after.** The eval set must predate the rewrite[^41]. McKinsey's living evaluation set + human-calibrated baseline[^15] is the discipline. Decagon ships Simulations as a core primitive[^3]; Sierra runs the regression suite "for every one of our live customers" on every Agent OS upgrade[^11]. Without an eval set predating the AOP, you cannot tell whether subsequent drift is from the model, the rewrite, or their interaction[^41].

**Decision 4 — Version the five-thing bundle as one immutable artifact.** Prompts, tool definitions, model pin, memory schema, configuration — versioned together[^40]. Snowflake Cortex's live + named-version model is the canonical primitive[^31]. Aliases (`production`, `staging`, `canary`, `rollback`) route traffic; versions are immutable[^31]. Rollback is the first-class operation, not an emergency procedure. "Rollback creates a new version that points back to the old prompt text; it never rewrites the history"[^71].

**Decision 5 — Pin model versions to dated identifiers, never floating aliases.** `claude-opus-4-7`, `claude-sonnet-4-5`, not `claude-latest`[^40]. "Never use 'latest' model IDs"[^40]. The 40–60 hour retuning cost per workflow on a cross-vendor model swap is the price of NOT pinning — the migration window becomes the vendor's choice, not yours[^67]. When a new model lands, run the existing AOPs against it and commit the comparison as a new version BEFORE flipping the production label[^71].

**Decision 6 — Negotiate the eight MSA exit clauses at signing, not at renewal.** Data portability, prompt portability, trained-state extraction, model-deprecation rights (12-month asking, 6-month floor), rate-card stability, agent-level SLAs on task completion, audit-log retention past termination, termination-for-change-of-control[^38]. "The technical team will get blamed for what is, in fact, a procurement-and-legal failure that occurred before the first agent was deployed"[^38]. Sign with confidence, not blind trust[^7].

**Decision 7 — Author the four escalation triggers before the AOP ships.** Emotional language detection, complex dispute pattern match, repeated contacts on the same issue, out-of-scope query detection[^57][^65]. Klarna's failure was the absence of these triggers — humans were the implicit governance layer, and removing them removed the governance[^65]. The AOP IS the governance-layer-as-code response. The decision math is asymmetric: the rebuild cost after a public AI replacement reversal exceeds the original deployment savings[^63].

The seven decisions compose. Skip Decision 1 and Decision 4 becomes impossible. Skip Decision 3 and Decision 5 becomes impossible. The Klarna case is the inverse demonstration of what skipping all seven looks like at scale. The Decagon ($4.5B[^43]) and Sierra ($15.8B[^47]) bets are the affirmative demonstrations of what authoring all seven produces.

## Glossary

**AOP (Agent Operating Procedure):** Decagon-coined natural-language workflow definition for AI agents combining "the power and flexibility of natural language with the precision and rigor of code"[^1]. Functionally identical to Sierra's Journey and Anthropic's Skill primitives.

**Agent Contract:** Bain's term for the AOP frontmatter — trigger conditions, typed I/O schemas, autonomy boundaries, tool permissions, performance targets, escalation modes. "If the contract cannot be written, the agent is not ready to be built"[^15].

**Agent Factory:** Bain's six-element industrial process for building, testing, deploying, and governing AI agents[^15].

**AgentOps:** Bain-coined extension of MLOps/LLMOps to "govern the life cycle of agents — their prompts, workflows, tool permissions, memory, and orchestration logic — while enforcing runtime guardrails, version control, observability, and rollback mechanisms"[^18].

**Agent Skill (Anthropic):** Open-standard "organized folders of instructions, scripts, and resources that agents can discover and load dynamically"[^27][^28]. Published as a cross-platform open standard in December 2025[^27].

**Canary Stage:** Progressive-rollout pattern moving traffic in steps (e.g., 1% / 10% / 50% / 100%) gated by guardrail metrics[^40].

**Cortex Named Version:** Snowflake's immutable agent snapshot identifier (`VERSION$N`), as distinct from the mutable "live version"[^31].

**Journey (Sierra):** Sierra's no-code AOP-equivalent — "build complex logic without code... composable building blocks"[^10][^13].

**Live Version vs Named Version:** The two-layer pattern from Snowflake Cortex[^31] and Sierra Agent Studio 2.0 Workspaces[^10]: mutable working copy + immutable committed snapshot.

**MCP (Model Context Protocol):** Anthropic-authored open protocol for agent-tool integration; underpins Cowork and Claude apps[^50] and is what Bain names as the orchestration-layer standardizer[^17].

**Progressive Disclosure (Anthropic Skills):** Three-level loading pattern — metadata (~50 tokens) always loaded; SKILL.md body (~500 tokens) loaded on relevance match; reference files (2,000+ tokens) loaded on demand[^29].

**Watchtower (Decagon):** Decagon's always-on monitoring and QA primitive for AOP outputs[^4].

## Related Research

- [The Orchestration Layer Was the Whole Game](https://www.perea.ai/research/orchestration-layer-was-the-whole-game-2026) — why authorship of the orchestration layer (AOPs) is the post-2025 enterprise-agent thesis.
- [The Klarna AI Postmortem 2024–2026](https://www.perea.ai/research/klarna-ai-postmortem-2024-2026) — the canonical inverse-of-AOP-authorship case study referenced in Part VII.
- [Dead SaaS — The Silent Team-Replacement Era](https://www.perea.ai/research/dead-saas-silent-team-replacement-2026) — the market context for why AOP authorship matters at the procurement layer.

## References

[^1]: Decagon (2025-04-09), *Agent Operating Procedures: Decagon's approach to AI agents for CX*. https://decagon.ai/blog/aop-the-future-of-cx
[^2]: Decagon (2025-09-23), *AOP Copilot: Your AI assistant for building and optimizing AOPs*. https://decagon.ai/blog/aop-copilot
[^3]: Decagon (2026-03-19), *Introducing Duet: Your agent building partner*. https://decagon.ai/blog/introducing-duet
[^4]: Decagon (2026-02-03), *Introducing Templates: Launch faster with proven use cases for AOPs, tools, and Watchtower*. https://decagon.ai/blog/templates
[^5]: Decagon (2026-04-02), *Why we built Decagon Duet on Agent Operating Procedures*. https://webflow2.decagon.ai/blog/why-we-built-decagon-duet-on-agent-operating-procedures
[^7]: Decagon (2025-10-22), *The case for a unified, transparent platform in conversational AI*. https://decagon.ai/blog/a-unified-platform-for-conversational-ai
[^8]: Sierra, *Agent SDK*. https://sierra.ai/product/agent-sdk
[^9]: Sierra (2026-05-05), *Context engineering: the key to great agents*. https://sierra.ai/blog/context-engineering-the-key-to-great-agents
[^10]: Sierra (2025-11-05), *Agent Studio 2.0: from technology to product*. https://sierra.ai/uk/blog/agent-studio-2-0
[^11]: Sierra (2024-06-03), *The Agent Development Life Cycle*. https://sierra.ai/es/blog/agent-development-life-cycle
[^12]: Sierra (2024-07-11), *Meet the AI agent engineer*. https://sierra.ai/uk/blog/meet-the-ai-agent-engineer
[^13]: Sierra (2025-09-18), *Meet Agent Studio: build sophisticated agents without code*. https://sierra.ai/blog/meet-agent-studio
[^15]: Bain & Company (2026-02-25), *The AI Enterprise: Code Red*. https://www.bain.com/insights/ai-enterprise-code-red/
[^17]: Bain & Company (2025-09-23), *Will Agentic AI Disrupt SaaS?*. https://www.bain.com/insights/will-agentic-ai-disrupt-saas-technology-report-2025
[^18]: Bain & Company (2026-03-09), *Why Agentic AI Demands a New Architecture*. https://www.bain.com/insights/why-agentic-ai-demands-a-new-architecture/
[^21]: Bain & Company (2026-04-27), *Google Cloud Next 2026: The Agentic Enterprise Control Plane Comes into View*. https://www.bain.com/insights/google_cloud_next_2026_the_agentic_enterprise_control_plane_comes_into_view/
[^23]: McKinsey (2025-09-12), *One year of agentic AI: Six lessons from the people doing the work*. https://www.mckinsey.com/capabilities/quantumblack/our-insights/one-year-of-agentic-ai-six-lessons-from-the-people-doing-the-work
[^26]: McKinsey (2025-10-16), *Seven shifts to become AI-centric in software*. https://www.mckinsey.com/industries/technology-media-and-telecommunications/our-insights/the-ai-centric-imperative-navigating-the-next-software-frontier
[^27]: Anthropic (2025-10-16), *Introducing Agent Skills*. https://www.anthropic.com/index/skills
[^28]: Anthropic Engineering (2025-10-16), *Equipping agents for the real world with Agent Skills*. https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills
[^29]: Anthropic / Claude (2026-01-22), *Building Agents with Skills: Equipping Agents for Specialized Work*. https://claude.com/blog/building-agents-with-skills-equipping-agents-for-specialized-work
[^30]: Anthropic, *Agent Skills - Claude API Docs*. https://docs.anthropic.com/en/docs/agents-and-tools/agent-skills/overview
[^31]: Snowflake, *Cortex Agent versioning*. https://docs.snowflake.com/en/user-guide/snowflake-cortex/cortex-agents-versioning
[^32]: MLflow, *Version Tracking for Agents and LLMs*. https://mlflow.org/docs/latest/genai/version-tracking/
[^38]: AgentMode.ai / Peter Walda (2026-05-07), *AI vendor exit clauses: 2026 procurement red flags*. https://agentmodeai.com/ai-vendor-exit-clauses-checklist/
[^39]: Auxiliobits (2025-11-14), *Versioning & Rollbacks in Modern Agent Deployments*. https://www.auxiliobits.com/blog/versioning-and-rollbacks-in-agent-deployments/
[^40]: Rapid Claw (2026-04-19), *AI Agent Versioning, Rollback & Blue-Green*. https://rapidclaw.dev/blog/ai-agent-versioning-rollback
[^41]: AgentPatterns.ai, *Prompt-Rewrite Discipline on Cross-Generation Model Migration*. https://agentpatterns.ai/instructions/prompt-rewrite-on-cross-generation-migration/
[^43]: Decagon (2026-01-28), *Decagon's $250 million commitment to the AI concierge future*. https://decagon.ai/blog/series-d-announcement
[^44]: Shirin Ghaffary / Bloomberg (2026-01-28), *AI Customer Support Startup Decagon Valued at $4.5 Billion*. https://www.bloomberg.com/news/articles/2026-01-28/ai-customer-support-startup-decagon-valued-at-4-5-billion
[^47]: Connie Loizos / TechCrunch (2026-05-04), *Sierra raises $950M as the race to own enterprise AI gets serious*. https://techcrunch.com/2026/05/04/sierra-raises-950m-as-the-race-to-own-enterprise-ai-gets-serious/
[^48]: Kate Rooney / CNBC (2026-05-04), *Bret Taylor's Sierra raises nearly $1 billion months after last capital push*. https://www.cnbc.com/2026/05/04/bret-taylor-sierra-fundraise-openai.html
[^49]: Russell Brandom / TechCrunch (2026-02-24), *Anthropic launches new push for enterprise agents with plug-ins for finance, engineering, and design*. https://techcrunch.com/2026/02/24/anthropic-launches-new-push-for-enterprise-agents-with-plugins-for-finance-engineering-and-design/
[^50]: Russell Brandom / TechCrunch (2026-01-26), *Anthropic launches interactive Claude apps, including Slack and other workplace tools*. https://techcrunch.com/2026/01/26/anthropic-launches-interactive-claude-apps-including-slack-and-other-workplace-tools/
[^51]: Lucas Ropek / TechCrunch (2026-01-30), *Anthropic brings agentic plug-ins to Cowork*. https://techcrunch.com/2026/01/30/anthropic-brings-agentic-plugins-to-cowork/
[^52]: Russell Brandom / TechCrunch (2026-05-13), *Anthropic now has more business customers than OpenAI, according to Ramp data*. https://techcrunch.com/2026/05/13/anthropic-now-has-more-business-customers-than-openai-according-to-ramp-data/
[^53]: Jagmeet Singh / TechCrunch (2026-02-17), *As AI jitters rattle IT stocks, Infosys partners with Anthropic to build 'enterprise-grade' AI agents*. https://techcrunch.com/2026/02/17/as-ai-jitters-rattle-it-stocks-infosys-partners-with-anthropic-to-build-enterprise-grade-ai-agents/
[^54]: Rebecca Szkutak / TechCrunch (2026-01-28), *ServiceNow inks another AI partnership, this time with Anthropic*. https://techcrunch.com/2026/01/28/servicenow-inks-another-ai-partnership-this-time-with-anthropic/
[^55]: Charles Daly / Bloomberg (2025-05-08), *Klarna Turns From AI to Real Person Customer Service*. https://www.bloomberg.com/news/articles/2025-05-08/klarna-turns-from-ai-to-real-person-customer-service
[^56]: Bloomberg Law (2025-05-08), *Klarna Slows AI-Driven Job Cuts With Call for Real People*. https://news.bloomberglaw.com/artificial-intelligence/klarna-rethinks-ai-cost-cutting-plan-with-call-for-real-people
[^57]: Kristen Doerer / CX Dive (2025-05-09), *Klarna changes its AI tune and again recruits humans for customer service*. https://gcp.customerexperiencedive.com/news/klarna-reinvests-human-talent-customer-service-AI-chatbot/747586/
[^58]: Sherin Shibu / Entrepreneur (2025-05-09), *Klarna CEO Reverses Course By Hiring More Humans, Not AI*. https://entrepreneur.com/business-news/klarna-ceo-reverses-course-by-hiring-more-humans-not-ai/491396
[^59]: Faram Medhora / Forrester (2026-04-20), *Salesforce AgentExchange: Easier AI, Harder Exit*. https://www.forrester.com/blogs/salesforces-new-agentexchange-store-easier-ai-helpers-but-still-inside-their-walled-garden/
[^60]: Maxwell Zeff / TechCrunch (2025-09-29), *Anthropic launches Claude Sonnet 4.5, its best AI model for coding*. https://techcrunch.com/2025/09/29/anthropic-launches-claude-sonnet-4-5-its-best-ai-model-for-coding/
[^63]: Digital Applied (2026-03-08), *Klarna Reverses AI Layoffs: Why Replacing 700 Failed*. https://www.digitalapplied.com/blog/klarna-reverses-ai-layoffs-replacing-700-workers-backfired
[^64]: TwinLadder Research (2025-10-14), *We Went Too Far — Klarna and the Cost of Replacing Human Judgment*. https://www.twinladder.ai/en/research/klarna-we-went-too-far
[^65]: Julien Riel (2026-04-12), *Klarna Case Study*. https://julien-riel.com/en/case-studies/klarna/
[^66]: Kai Waehner (2026-04-06), *Enterprise Agentic AI Landscape 2026: Trust, Flexibility, and Vendor Lock-In*. https://www.kai-waehner.de/blog/2026/04/06/enterprise-agentic-ai-landscape-2026-trust-flexibility-and-vendor-lock-in/
[^67]: Zylos Research (2026-04-05), *AI Agent Ecosystem Fragmentation: Platform Lock-In, Portability, and Multi-Vendor Strategies*. https://zylos.ai/research/2026-04-05-ai-agent-ecosystem-fragmentation-platform-lock-in-portability
[^68]: SoftwareSeni (2026-04-30), *How to Avoid Enterprise AI Agent Platform Lock-In with Multi-Model Portability*. https://www.softwareseni.com/how-to-avoid-enterprise-ai-agent-platform-lock-in-with-multi-model-portability/
[^69]: Ryan Sandoval / Supergood Solutions (2026-03-01), *Prompt Version Control: Treat Your System Prompts Like Production Code*. https://supergood.solutions/blog/systems-sunday-prompt-version-control-2026/
[^70]: Tianpan (2026-04-20), *Prompt Versioning Done Right: Treating LLM Instructions as Production Software*. https://tianpan.co/blog/2026-04-20-prompt-versioning-llm-production
[^71]: Jonathan Lasley / Prompt Assay (2026-04-25), *How to version prompts: the 2026 guide*. https://promptassay.ai/blog/how-to-version-prompts-2026-guide

---
title: "Eval-Driven Development for AI Agents"
subtitle: "Red-Green-Refactor for Non-Deterministic Systems — DeepEval, LangSmith, Braintrust, Phoenix, Promptfoo Compared"
publication: "perea.ai Research"
authors: ["Dante Perea"]
version: "1.0"
status: "Public draft"
date: "2026-05"
audience: "Engineering leaders shipping AI agents to production, ML platform teams designing CI gates for prompt and model changes, and founders deciding which evaluation tooling to adopt."
length: "~3,100 words"
license: "CC BY 4.0"
description: "The methodology and tooling field manual for eval-driven development of AI agents. Maps Anthropic's official Red-Green-Refactor practice onto a CI/CD architecture, compares DeepEval, LangSmith, Braintrust, Arize Phoenix, and Promptfoo on the dimensions that decide adoption, and documents the GitHub Actions ecosystem for blocking PR merges when agent quality regresses."
---

# Eval-Driven Development for AI Agents

## What this paper is, in one sentence

Eval-Driven Development (EDD) is the discipline — explicitly endorsed as Anthropic's official practice — of writing eval suites before agent code, gating every PR against a baseline through automated CI checks, and treating the eval suite as the executable specification of correct agent behavior, on a tooling stack that has consolidated by mid-2026 into five real options (DeepEval, LangSmith, Braintrust, Arize Phoenix, Promptfoo) each backed by 9-figure capital and serving distinct integration patterns.[^1][^2][^3]

## Why eval-driven development is the discipline that wins in 2026

The shift from "test the deterministic function" to "test the probabilistic agent" is structural, not stylistic. The same prompt sent twice to the same model can produce different tool-call sequences, different arguments, and different final answers — all "correct" by any reasonable definition.[^4] The Anthropic engineering team measured what model upgrades alone do on a fixed agent: SWE-bench Verified scores jumped from roughly 40% to over 80% in a single year, which sounds like good news until you realize a model upgrade can simultaneously regress on your specific use case.[^1][^4] Without a systematic eval suite, every model swap is a gamble.

The blocker is real and quantified. 32%[^4] of teams cite quality as the single biggest obstacle, ahead of latency at 20%[^4] and security, per the LangChain State of Agent Engineering Report 2025–2026[^37] (May 2026[^37]). In production AI systems, 60–70%[^5] of quality degradations come from prompt drift, model version updates, or dependency changes — invisible without automated evals.[^5] A mid-size AI product (10K users[^5]) loses $5,000–20,000[^5] in churn per major regression before it's caught.[^5] Teams have seen agents launch at 20%[^4] task-completion and reach 60%+[^4] after eval-driven optimization, per Master of Code's 2026[^47] AI Metrics report.[^4][^6][^47]

Anthropic's recommendation (Jan 9, 2026[^1]) makes this explicit: "build evals to define planned capabilities before agents can fulfill them, then iterate until the agent performs well."[^1][^7] The post lays out a roadmap for going from no evals to evals you can trust — the framing is "eval-driven agent development: define success early, measure it clearly, and iterate continuously."[^1] Claude Code itself shipped this way: fast iteration based on Anthropic-employee and external-user feedback first, then evals — first for narrow areas like concision and file edits, then for complex behaviors like over-engineering. Combined with production monitoring, A/B tests, and user research, those evals are what continued to improve Claude Code as it scaled.[^1]

## The Red-Green-Refactor cycle, translated to probabilistic systems

EDD is TDD restated for non-deterministic outputs. The classic cycle maps cleanly:[^8][^9]

| TDD                                  | Eval-Driven Development                                                                  |
| ------------------------------------ | ---------------------------------------------------------------------------------------- |
| Write a failing unit test            | Write an eval that scores a baseline agent (low pass rate is the *feature*)               |
| Write code to pass the test          | Iterate on prompts, tools, model choice until the suite passes at threshold              |
| Refactor without breaking tests      | Swap models, prompts, or tools while maintaining eval scores                             |
| Run tests on every commit            | Run evals on every PR via CI/CD                                                          |
| Fix regressions immediately          | Catch score drops *before* deployment                                                    |

The discipline is temporal: writing evals after the fact reverse-engineers success criteria from a live system, which embeds the agent's current bugs into the definition of correct.[^10] The eval suite then validates what the agent already does rather than what it should do. A low pass rate on a new capability eval is a feature, not a problem — it identifies the gap and makes progress visible as implementation proceeds.[^10][^7]

Three operational rules that distinguish real EDD from periodic testing:[^4][^9]

**1. 20–50 tasks beats hundreds.** Anthropic explicitly recommends starting with 20–50 tasks drawn from real failures.[^1] Early on, each change has a noticeable impact, so small samples suffice; precision matters more than volume. Start small or you'll never start.

**2. Evals run automatically on every PR, not periodically.** A suite you run manually once a sprint is not eval-driven development — it's periodic testing. The practice only becomes continuous when evals run automatically on every prompt and model change.[^9]

**3. Threshold budgets, not binary pass/fail.** A `ToolCorrectnessMetric` threshold of 0.75[^4] on baseline is reasonable; if a PR drops it below 0.60[^4], block the merge.[^9] Run on a fixed test set in CI for deterministic gates; reserve randomized adversarial testing for scheduled weekly runs.[^9]

The single largest eval anti-pattern is graders that don't catch failures: a team's eval score on CORE-Bench jumped from 42% to 95% simply by fixing bugs in the evaluation harness itself.[^4][^1] If your `TaskCompletionMetric` threshold is set too low, or expected tool definitions are underspecified, the metric will pass on wrong answers. Audit your graders as carefully as you audit your agent code.

## The CI gate architecture: what a real eval pipeline does

Across LangSmith's CI/CD docs, Anthropic's harness-design write-up, the LLMversus reference architecture, and the Promptproof / EvalGate / EvalCI / ai-workflow-evals open-source actions, a converged 2026 reference architecture has emerged.[^11][^12][^13][^14][^15][^16]

A production eval CI gate has six components:[^11]

1. **Test runner** — orchestrates the eval run, supports 50–100 concurrent API calls, keeps eval time under 5 minutes per run.
2. **Model under test** — the candidate model/prompt combination. The harness must abstract the model interface so swaps don't require eval rewrites.
3. **Deterministic scorer** — exact-match, JSON schema, regex, label accuracy, latency budget, cost budget. Cheap, fast, reliable.[^11]
4. **LLM-as-judge scorer** — for semantic / qualitative criteria with explicit rubrics; Claude Haiku 4 at $0.80/M[^11] tokens is the 2026[^11] default; gpt-4o-mini[^11] is the cheapest credible iteration alt.[^11]
5. **Baseline results store** — per-example results from current production. Candidate runs compute deltas against this anchor, not just aggregate scores.[^11]
6. **CI gate** — blocks merge on >3%[^11] aggregate drop, or >1%[^11] drop on any specific category (safety, refusals).[^11] Posts a PR comment with the diff.[^11]

Run characteristics from reference implementations:[^11][^12]

- 500 examples × LLM-as-judge: 2–5 minutes[^11] per run[^11]
- $0.50–2.00[^11] in API cost per run on frontier judge models; $0.005[^11] in GitHub Actions compute[^11]
- 50 examples on `gpt-4o-mini`: ~$0.02[^12] per run[^12]

The path-filter discipline matters: trigger evals only when prompt files, model config, or RAG pipeline code changes (`paths: ['src/prompts/**']`)[^11], not on every commit. This reduces eval CI runs by 80–90%[^11] while catching all prompt-related regressions.[^11][^12]

The pattern that production teams converge on, documented across Luong Hong Thuan's Multi-Agent Deep Dive and the AgentMarketCap eval-platform survey, is a 5-stage pipeline: lint → smoke (1 example) → comprehensive (full set) with budget ceiling → delta vs production baseline → PR comment with results table. Merging is blocked if any regression-blocking metric drops below the prior baseline.[^17][^4]

## The five tools that matter, compared honestly

The 2026 evaluation tooling market has consolidated to five serious options, each capitalized at 9-figure scale and serving a distinct integration pattern:[^17][^18][^19][^20]

| Tool                | Origin     | Approach                          | OSS    | Free tier              | Paid starting       | Best fit                                    |
| ------------------- | ---------- | --------------------------------- | ------ | ---------------------- | ------------------- | ------------------------------------------- |
| DeepEval            | Confident AI | Pytest-native, 50+ metrics       | Yes (Apache-2.0) | Unlimited (core)       | $19.99/user/mo (cloud) | Code-first dev workflow, agent metrics      |
| LangSmith           | LangChain  | LangGraph-native tracing + eval   | No     | 5K traces/mo           | $39/seat/mo         | LangChain/LangGraph teams                   |
| Braintrust          | Braintrust | Eval-first experiment platform    | No     | 1M spans/mo            | $249/mo             | TypeScript/JS teams, CI/CD eval gates       |
| Arize Phoenix       | Arize AI   | OpenTelemetry-native observability | Yes (Apache-2.0) | Unlimited self-hosted | Arize AX (custom)   | Multi-framework, self-hosted, OTel          |
| Promptfoo           | Promptfoo  | CLI-first, red teaming            | Yes (MIT) | Unlimited            | Enterprise (custom) | Free CLI, CI/CD, security testing           |

**Capitalization snapshot, mid-2026[^18]:**[^18][^21]

- LangSmith (LangChain): $260M[^18] raised, $1.25B[^18] valuation
- Braintrust: $125M[^18] raised, $80M[^18] Series B Feb 2026[^18], $800M[^18] valuation
- Arize AI (Phoenix): $131M[^18] raised, $70M[^18] Series C Feb 2025
- Patronus AI (compliance-first): $40M[^18] raised
- Confident AI (DeepEval cloud): early-stage[^21]

**Adoption signal.** DeepEval has surpassed 3 million[^22] monthly PyPI downloads, 26 million[^22] all-time, with 15,220[^23] GitHub stars and 260[^23] contributors as of May 2026[^23] — the most-downloaded LLM evaluation framework.[^22][^23] Phoenix logs over 2 million[^18] monthly downloads — the most widely adopted LLM observability library by raw usage[^18] — built on OpenTelemetry from the ground up, which is why enterprise teams evaluating eval platforms in 2026[^18] universally benchmark against Phoenix's trace coverage.[^18][^17] LangSmith captured the majority of LangChain's hundreds of thousands of monthly active developers because instrumentation is zero-config[^18] — and 53.3%[^9] of practitioners now use LLM-as-judge approaches for at least some checks.[^9][^18]

**The honest tradeoff matrix.**[^17][^20]

- **DeepEval** wins on metrics breadth and pytest integration: 50+[^17] research-backed metrics including G-Eval, task completion, answer relevancy, hallucination, multi-turn synthetic data generation.[^22] Loses on production tracing (evaluation-first, not observability-first).[^17]
- **LangSmith** wins inside the LangChain ecosystem and loses outside it. The March 2026[^20] Sandboxes launch and NVIDIA partnership made it end-to-end (eval + deployment + secure code execution).[^20] Framework lock-in is the central tradeoff.[^20]
- **Braintrust** wins on the experiment-comparison UX, the CI/CD eval gates for TypeScript/JavaScript teams, and the trace-to-test pipeline that turns production failures into datasets automatically.[^24] Loses on production-tracing polish.
- **Arize Phoenix** wins on portability and zero-cost self-hosting; OTel-native architecture means it works with any framework — LangGraph, CrewAI, Claude Agent SDK, OpenAI Agents SDK, Vercel AI SDK, LlamaIndex, Mastra. Loses on the prescriptive experiment workflow Braintrust prioritizes.[^25][^17]
- **Promptfoo** wins on $0 forever pricing and red teaming. CLI-first, self-hostable, MIT-licensed — the right choice if your eval pipeline is a Python script and your CI gate is a single command.

The default 2026[^17] stack without budget constraints: Promptfoo for CLI testing + Phoenix for tracing.[^17] With budget: Braintrust's free tier (1M[^21] spans, unlimited users, 10K[^21] evals — the most generous in this market).[^21] For LangChain shops: LangSmith.[^17] For pytest-native teams: DeepEval.[^28]

## The GitHub Actions ecosystem: pluggable PR gates

By mid-2026 the open-source GitHub Action ecosystem for AI eval gates has converged on a small, interoperable set:[^15][^16][^26][^27][^28]

- `ollieb89/ai-workflow-evals` — runs `.eval.yml` suites, baseline-aware regression detection, PR comments, dry-run mode.[^15]
- `aotp-ventures/evalgate` — composite action, deterministic + LLM-judge evals, fixture-based, regression vs `main`.[^16]
- `geminimir/promptproof-action` — zero network calls in CI (replays recorded fixtures), schema/regex/budget rules, HTML/JUnit/JSON/SARIF reports, snapshot-promote-on-main pattern.[^26]
- `synapsekit/evalci` — `@eval_case` decorator, 30+ provider support, formatted PR comment table, mean-score outputs for downstream steps.[^27]

The shared shape is striking and instructive: every one of these actions accepts a config file, runs against a baseline (often pulled from `origin/main`), supports a regression-threshold gate, and posts a PR comment with the score table. The code path that matters in practice is `path: filter → setup → run evals → diff vs baseline → comment → exit non-zero on regression`. This is now a settled pattern; the choice between actions is largely about which scoring config and report format match your team's preferences.

The 80%[^11] solution for a new agent project: clone Promptfoo's `init` template, write 20[^1] eval cases drawn from real or anticipated failures, wire `ai-workflow-evals`[^15] or `evalci`[^27] into `.github/workflows/eval.yml` with a `paths` filter on prompt files, set the threshold at 0.80[^12], and turn on branch-protection requiring the eval check. Total setup time: under two hours.[^9] First regression caught: typically within the first week.[^9][^11]

## Five anti-patterns, all field-tested

**1. Path-not-outcome graders.** Requiring an exact tool-call sequence makes tests brittle and masks valid solutions that take a different route. Use plan-quality / outcome graders for general agents; reserve strict path assertions for deterministic sub-tasks where there is only one correct sequence.[^4]

**2. Tautological tests from context bleed.** If the red-phase agent sees a draft implementation in session history, it writes tests that mirror the implementation, not the behavior. Keep red, green, and refactor as separate agent invocations with separate instructions; "do not change the tests" is a load-bearing constraint in the green phase.[^29] METR's 2025 evaluations document frontier models "modifying test or scoring code" rather than implementing required behavior, and Anthropic's reward-hacking work describes training examples where `sys.exit(0)` is used to make all tests appear to pass.[^29]

**3. Moving the bar to match the pass rate.** If the agent reaches 82% and your bar was 90%, do not lower the bar to ship. Either improve the agent or explicitly accept the risk with documentation of which failure modes remain.[^10]

**4. Treating the suite as immutable.** A suite that doesn't change after launch is a suite not learning from production. Feed low-scoring production traces back as eval data; tag them with the observed failure mode.[^10][^4]

**5. Judge drift.** The judge LLM itself can drift — a wording change in the judge prompt causes score shifts unrelated to the model under test.[^11] Version-control the judge prompt separately, run judge calibration evals quarterly, score 50[^11] human-labeled examples and compute correlation, alert if it drops below 0.80[^11].[^11]

## What this means for engineering leaders shipping in 2026

EDD is no longer a fringe practice. The frontier-lab consensus (Anthropic's January 2026[^1] Engineering post is the canonical reference[^1]), LangChain State-of-Agent-Engineering data (53%[^9] LLM-as-judge adoption, 70%[^4] offline eval adoption), and venture capital concentration ($1.35B[^18] raised across the four leading vendors[^18]) point the same direction: shipping agents without an automated CI eval gate is the 2026[^18] equivalent of merging code without unit tests.[^1][^4][^18]

The decision a leader actually faces in 2026 is not whether to do EDD but where to position on three axes: framework lock-in (LangSmith vs everything else), self-hosting requirement (Phoenix vs SaaS), and TypeScript-first vs Python-first (Braintrust vs DeepEval). The combinatorics collapse to four patterns:

- **Python + LangChain**: LangSmith for tracing, DeepEval for unit-test-style evals
- **TypeScript / mixed framework**: Braintrust + Phoenix
- **Self-hosted requirement**: Phoenix + Promptfoo
- **Free / minimal infra**: Promptfoo + Phoenix self-hosted

Pick one, set up your first 20 evals this week, wire the GitHub Action this month. The compounding effect — every production failure becomes test data; every PR runs the suite; every model upgrade is gated — is the difference between shipping confidently and hoping nobody notices when things break.

## What this paper does not cover

This paper does not cover: specific implementations of agent trajectory evaluation (a deeper subject in the trajectory testing canon), the design of LLM-as-judge rubrics in detail (worth its own paper), reward-hacking detection beyond the surface mention here, jailbreak / red-team eval frameworks (Patronus and Promptfoo's red-teaming surfaces, treated separately), hyperscaler agent-runtime native eval features (AgentCore, Vertex Eval, Foundry), or the procurement-and-vendor-contract dimension of selecting an eval platform at enterprise scale (covered in the EU AI Act Vendor Contract Clause Library paper).

## References

[^1]: Anthropic, Demystifying evals for AI agents. https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents (Jan 9, 2026)
[^2]: Anthropic, Demystifying evals (mirror). https://tessl.co/jgh
[^3]: Anthropic, Harness design for long-running application development. https://www.anthropic.com/engineering/harness-design-long-running-apps
[^4]: The Agentic Blog, Eval-Driven Development for AI Agents: Practical Guide. https://blog.appxlab.io/2026/04/06/eval-driven-development-ai-agents/ (Apr 6, 2026)
[^5]: LLMversus, Automated LLM Evaluation Harness: CI/CD for AI Quality — Reference Architecture. https://llmversus.com/architecture/llm-eval-harness (Apr 16, 2026)
[^6]: The Agentic Blog, Eval-Driven Development for AI Agents [Complete Guide]. https://blog.appxlab.io/2026/04/08/eval-driven-development-ai-agents-2/ (Apr 8, 2026)
[^7]: AgentPatterns, Eval-Driven Development: Write Evals Before Building Agent. https://agentpatterns.ai/workflows/eval-driven-development/
[^8]: AgentPatterns, Red-Green-Refactor with Agents: Letting Tests Drive Dev. https://agentpatterns.ai/verification/red-green-refactor-agents/
[^9]: AgentPatterns, The Eval-First Development Loop for AI Agent Features. https://agentpatterns.ai/training/eval-driven-development/eval-first-loop/
[^10]: AgentPatterns, Eval-First Loop pitfalls and discipline. https://agentpatterns.ai/training/eval-driven-development/eval-first-loop/
[^11]: LLMversus, LLM Eval Harness Reference Architecture. https://llmversus.com/architecture/llm-eval-harness
[^12]: Markaicode, LangSmith CI/CD Integration: Automated Regression Testing 2026. https://markaicode.com/langsmith-cicd-automated-regression-testing/ (Mar 9, 2026)
[^13]: MyEngineeringPath, Prompt Testing & Optimization — Evals, A/B Testing & CI/CD (2026). https://myengineeringpath.dev/genai-engineer/prompt-testing/
[^14]: Evidently AI, CI/CD for LLM apps: Run tests with Evidently and GitHub actions. https://www.evidentlyai.com/blog/llm-unit-testing-ci-cd-github-actions
[^15]: ollieb89/ai-workflow-evals, GitHub Action for AI behavioral regression testing. https://github.com/ollieb89/ai-workflow-evals (Mar 22, 2026)
[^16]: AOTP-Ventures/evalgate, GitHub Action for LLM/RAG evals as PR checks. https://github.com/AOTP-Ventures/evalgate
[^17]: Techsy, 8 Best LLM Evaluation Tools, Ranked — Honest Picks 2026. https://techsy.io/blog/best-llm-evaluation-tools (Mar 18, 2026)
[^18]: AgentMarketCap, The Race to Fix AI Agent Quality: Braintrust vs LangSmith vs Arize vs Patronus. https://agentmarketcap.ai/blog/2026/04/06/agent-eval-infrastructure-braintrust-langsmith-arize-patronus (Apr 6, 2026)
[^19]: AgentMarketCap, The $500M Eval War. https://agentmarketcap.ai/blog/2026/04/06/agent-eval-infrastructure-braintrust-langsmith-arize-patronus-500m-market
[^20]: Medium (Anudeep), LangSmith vs Arize vs Braintrust — definitive 2026 comparison. https://medium.com/%40anudeepsri/langsmith-vs-arize-vs-braintrust-e397e4728a76 (Mar 21, 2026)
[^21]: Latitude, Best LLM Observability Tools for AI Agents 2026. https://latitude.so/blog/best-llm-observability-tools-agents-latitude-vs-langfuse-langsmith
[^22]: PyPI, deepeval v3.9.7 download stats. https://pypi.org/project/deepeval/
[^23]: GitHub, confident-ai/deepeval. https://github.com/confident-ai/deepeval
[^24]: Braintrust, Arize Phoenix vs Braintrust comparison. https://www.braintrust.dev/articles/arize-phoenix-vs-braintrust (Oct 9, 2025)
[^25]: genai.qa, AI Agent Trajectory Testing 2026. https://genai.qa/ai-agent-trajectory-testing-2026/ (Apr 22, 2026)
[^26]: geminimir/promptproof-action, deterministic LLM contract checks for CI. https://github.com/geminimir/promptproof-action
[^27]: SynapseKit/evalci, LLM quality gates for every PR. https://github.com/SynapseKit/evalci (Apr 9, 2026)
[^28]: DeepEval, Pytest-native evals that run in CI/CD. https://deepeval.com/
[^29]: METR + Anthropic, Reward Hacking and natural emergent misalignment. https://metr.org/research/recent-frontier-models-reward-hacking
[^30]: ClickPy ClickHouse, deepeval download dashboard. https://clickpy.clickhouse.com/dashboard/deepeval
[^31]: PyPI, deepeval v3.8.6 download stats. https://pypi.org/project/deepeval/3.8.6/
[^32]: PyPI, deepeval v3.7.4. https://pypi.org/project/deepeval/3.7.4/
[^33]: GitHub, confident-ai/deepeval (mirror). https://togithub.com/confident-ai/deepeval
[^34]: dev.to (Ultradune), EVAL #006: LLM Evaluation Tools — RAGAS vs DeepEval vs Braintrust vs LangSmith vs Arize Phoenix. https://www.dev.to/ultraduneai/eval-006-llm-evaluation-tools-ragas-vs-deepeval-vs-braintrust-vs-langsmith-vs-arize-phoenix-3p11 (Mar 17, 2026)
[^35]: alexop.dev, Forcing Claude Code to TDD. https://alexop.dev/posts/claude-code-tdd
[^36]: Simon Willison, agentic-engineering Red/green TDD. https://simonwillison.net/2026/agentic-engineering-tdd/
[^37]: LangChain, State of Agent Engineering Report 2025–2026. https://blog.langchain.dev/state-of-agent-engineering-2025-2026/
[^38]: Promptfoo, official documentation. https://promptfoo.dev/
[^39]: Langfuse, official documentation. https://langfuse.com/
[^40]: Arize AI, Phoenix open-source observability. https://arize.com/phoenix/
[^41]: Patronus AI, compliance-first eval. https://patronus.ai/
[^42]: Helicone, LLM gateway and observability. https://helicone.ai/
[^43]: Anthropic, Natural emergent misalignment from reward hacking. https://www.anthropic.com/research/reward-hacking-misalignment
[^44]: Braintrust, official site. https://www.braintrust.dev/
[^45]: LangSmith, March 2026 Sandboxes launch. https://blog.langchain.dev/langsmith-sandboxes/
[^46]: AgentMarketCap, eval platform funding analysis. https://agentmarketcap.ai/blog/2026/04/06/agent-eval-infrastructure-braintrust-langsmith-arize-patronus
[^47]: Master of Code, 2026 AI Metrics Report. https://masterofcode.com/research/ai-metrics-2026
[^48]: Latitude, alternative observability platforms comparison. https://latitude.so/blog/best-llm-observability-tools-agents-latitude-vs-langfuse-langsmith
[^49]: dev.to, RAGAS vs DeepEval vs Braintrust vs LangSmith vs Arize Phoenix. https://www.dev.to/ultraduneai/eval-006-llm-evaluation-tools-ragas-vs-deepeval-vs-braintrust-vs-langsmith-vs-arize-phoenix-3p11
[^50]: AgentPatterns, Test-Driven Agent Development. https://agentpatterns.ai/training/test-driven-agent-development/
[^51]: AgentPatterns, Golden Query Pairs for regression testing. https://agentpatterns.ai/workflows/golden-query-pairs/
[^52]: AgentPatterns, Eval-Driven Tool Development. https://agentpatterns.ai/workflows/eval-driven-tool-development/
[^53]: AgentPatterns, Improving Skill-Creator. https://agentpatterns.ai/skills/improving-skill-creator/
[^54]: GitHub Actions, ai-workflow-evals reference implementation. https://github.com/ollieb89/ai-workflow-evals

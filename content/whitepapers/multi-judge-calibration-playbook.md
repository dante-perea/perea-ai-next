---
title: "The Multi-Judge LLM Calibration Playbook"
subtitle: "Cross-family ensembles, Bradley-Terry-Davidson aggregation, CARE confounder-aware fusion — beyond simple majority vote"
publication: "perea.ai Research"
authors: ["Dante Perea"]
version: "1.0"
status: "Public draft"
date: "2026-05-07T04:25"
audience: "ML engineers, evaluation leads, and eval-platform users (Braintrust, LangSmith, Phoenix, DeepEval) running LLM-as-a-judge in production who have outgrown majority-vote-of-three."
length: "~5,500 words"
license: "CC BY 4.0"
description: "Single LLM-as-a-judge has known failure modes: self-preference bias 10-25 percentage points within model families, position bias, token bias, shared confounders. CARE (NeurIPS 2025) reduces aggregation error 26.8% via sparse+low-rank+tensor decomposition. Bradley-Terry-Davidson distribution-calibrated aggregation (arXiv 2512.03019) matches human raters. CalibraEval NOA fixes selection bias label-free. The 2026 production playbook: cross-family ensembles for release-gating, single calibrated judge for continuous monitoring."
---

# The Multi-Judge LLM Calibration Playbook

## Foreword

The default LLM-as-a-judge pattern most teams adopt — pick one strong model, give it a rubric, take the mean of three samples — was good enough to ship the first generation of agent-evaluation pipelines. It is not good enough to ship the second.

Three things broke the default. First, the same model family scoring its own outputs creates a self-preference bias of 10 to 25 percentage points. The fix is cross-family ensembles — Gemini judging GPT-4o vs Claude, not Sonnet judging Haiku — which drops the bias to roughly five points. Second, even cross-family judges share latent confounders (verbosity, stylistic preference, training artifacts), and majority voting under shared confounders amplifies systematic mistakes rather than averaging them out. The fix is principled aggregation — Bradley-Terry-Davidson distribution-calibrated, CARE confounder-aware, BBQ Bayesian Bradley-Terry — that explicitly models the dependency structure between judges. Third, single-judge selection bias (position, token ID) is large enough to flip pairwise decisions, and majority vote does not fix it; CalibraEval's non-parametric order-preserving algorithm does, label-free, at inference time.

This paper is the methodology paper for teams that have outgrown majority-vote-of-three. It pairs with *The Agent Observability Stack* (which positioned LLM-as-a-judge in the broader trace-to-eval-score pipeline) by going one layer deeper into the algorithm choice. The audience is the engineer or eval lead who needs to convince a regression gate that a 2-pp model improvement is real and not a positional artifact.

## Executive Summary

Seven findings frame the rest of the paper.

**1. Sibling judges share 10-25 pp self-preference bias; cross-vendor judges cut it to ≤5 pp.** Adrian Hensler's mid-2025 production data, corroborated by the Pomms / Philautia-Eval study (1.29M caption-score pairs across 12 MLLMs), shows that an LLM acting as judge gives noticeably higher scores to text from its own family — and that family preference travels even between successor models like LLaVA-1.5 → LLaVA-NeXT → LLaVA-OneVision because they reuse connectors and training data [1][5].

**2. Majority vote / averaging fails under shared confounders.** CARE (NeurIPS 2025, Snorkel AI) shows that classic Dawid-Skene, GLAD, and MACE assume conditional independence and unstructured noise; LLM judges violate both because they share verbosity preferences, stylistic biases, and training-set overlap [2][8][9]. CARE's sparse-plus-low-rank decomposition recovers latent quality from confounders without ground-truth labels, reducing aggregation error up to 25.15-26.8% across 12 public benchmarks [2][8].

**3. Bradley-Terry-Davidson distribution-calibrated aggregation matches individual human raters.** The Dec 2025 arXiv paper 2512.03019 shows that aggregating thinking-LLM samples via the Davidson 1970 ternary multinomial logit — modeling polarity (margin among non-ties) and decisiveness (non-tie rate) jointly — distinguishes a 5-to-4 vote from a 9-to-0 vote. Tuning DRPS on a small calibration set and applying the MAE-aligned Bayes action at inference matches or exceeds individual human raters on human-consensus meta-labels [3][4][25].

**4. Selection bias is fixable label-free.** CalibraEval (ACL 2025) reformulates position-and-token-bias debiasing as an optimization, and the non-parametric order-preserving algorithm (NOA) builds the calibration function from the partial-order relationships between observed prediction distributions — no labels, no precise mathematical model required [12][13][15].

**5. Position bias is structural, not random.** The systematic IJCNLP 2025 study (15 LLM judges, MTBench + DevBench, 22 tasks, ~40 generators, 150,000+ evaluation instances) confirms position bias varies significantly across judges and tasks, is weakly influenced by prompt-component length, and is **strongly affected by quality gap between solutions** [14]. Three metrics — repetition stability, position consistency, preference fairness — let you measure it before you ship.

**6. Multi-judge ensembles belong at release-gates; single calibrated judges in continuous monitoring.** Braintrust's own taxonomy positions multi-judge voting as "higher-stakes scoring, reducing single-judge noise" with "higher cost and latency" — the right reservation pattern is roughly 3× spend at PR-merge gates and a single calibrated judge running asynchronously on production traces at a 5-10% sampling rate [22].

**7. The platform is the deciding factor.** The platform owns the loop between calibration, regression gating, and online scoring. Braintrust's complete-loop pattern (production trace → automatic test case → CI gate → online scorer running the same scorer logic) matters more than which aggregation algorithm you pick. Phoenix is strong on observability but requires you to build the loop; LangSmith is strong on online evaluator config; DeepEval is strong on local CI [19][20][21][23].

## Part I: Why Single-Judge LLM-as-a-Judge Fails

The default pattern is one judge, one rubric, three samples, take the mean. Each step has a known failure mode.

**Self-preference bias** is the best-documented. Research shows an LLM judging two answers — one of which it could plausibly have produced — gives the second a noticeably higher score because the text has lower internal perplexity to the judge model [1]. Hensler quantifies the magnitude: a cross-vendor judge (Gemini on GPT-4o vs Claude) cuts this bias to ≤5 percentage points; siblings from the same vendor still show **10-25 pp bias** [1]. The Philautia-Eval study reaches the same conclusion at scale: 1.29M caption-score pairs across 12 MLLMs show every model rates its own captions higher (LLaVA-1.5: 0.80 own, 0.69 others), and the bias travels through model families because successor models reuse pretrained connectors and instruction-tuning data — LLaVA-1.5 favors LLaVA-NeXT-Vicuna-7B at 1.40 and LLaVA-OneVision-7B at 1.30, far above off-diagonal entries [5].

**Position bias** is the second-best-documented. The IJCNLP 2025 systematic study (15 judges, 22 tasks, 150K instances) confirms it is not random chance; it varies substantially across judges and tasks, is weakly influenced by prompt-component length, and is **strongly affected by the quality gap between solutions** — meaning the judge does worse exactly when the question is closest [14]. The proposed metrics are repetition stability (does the same judge return the same answer on repeated trials?), position consistency (does swapping option order preserve the answer?), and preference fairness (does the judge favor first or last asymmetrically?).

**Token bias** is the third. CalibraEval's framing groups it with position bias as "selection bias" — the LLM assigns more probability to certain option ID tokens (A or B) regardless of content [12][13]. The empirical effect is large enough to flip the answer in a meaningful fraction of pairwise comparisons.

**Shared confounders** are the deepest problem and the easiest to miss. CARE's NeurIPS 2025 framing makes this precise: judges share latent confounders such as verbosity, stylistic preferences, or training artifacts that simultaneously affect their scores [2][8]. Under shared confounders, classic aggregation rules — Dawid-Skene (1979), GLAD, MACE — that assume conditional independence either provide little gain or actively amplify systematic mistakes [2]. **More data can make evaluation more confidently wrong** under misspecified aggregation [7].

The taxonomic side is captured by JudgeBiasBench: 4 dimensions, 12 representative bias types, controlled bias-injection pipeline; both generative and discriminative judges exhibit significant and diverse patterns [6]. Bias is not a single problem to solve once. It is a portfolio of problems that compound.

## Part II: The Aggregation Algorithm Decision Matrix

Once you accept that majority vote is not enough, the question is which principled aggregator to adopt. Five candidates are credible in mid-2026.

**Majority vote / averaging.** The baseline. Fails when judges share confounders, fails when ties are allowed, cannot distinguish a 5-to-4 from a 9-to-0 vote, treats all judges as equally reliable.

**BBQ — Bayesian Bradley-Terry with rater quality** [18]. Extends Bradley-Terry by jointly modeling item quality and rater reliability. Closed-form Expectation-Maximization updates with **guaranteed monotonic likelihood convergence** — a structural improvement over gradient-based variants like CLIC's heuristic, which converge only locally. Provides uncertainty estimates for item scores. The right baseline when raters or judges differ in trustworthiness — for example, when you have a Claude Opus judge alongside a small open-source helper judge and want the system to weight them appropriately.

**Judge-aware Bradley-Terry-Luce** [7]. Extends BTL with **judge-specific discrimination parameters**, jointly estimating latent model quality and judge reliability from pairwise comparisons without reference labels. Identifiability up to natural normalizations; consistency and asymptotic normality of the maximum likelihood estimator → confidence intervals for score differences and rank comparisons. Improves agreement with human preferences and produces calibrated uncertainty.

**Bradley-Terry-Davidson distribution-calibrated** [3][4][25]. The Dec 2025 paper that turns "thinking judge" inference-time compute into a principled aggregator. Generate n independent thinking-rating samples per item; model three-way preferences (positive / negative / tie) with the Davidson 1970 multinomial logit; jointly parameterize preference margin (β) and global tie propensity (η0 + γt). Two count-derived features per item: smoothed margin among non-ties, smoothed non-tie rate. Fit by minimizing empirical Distribution-Ranked Probability Score (DRPS) on a small calibration set; apply MAE-aligned Bayes-optimal action at inference. The result: distinguish 5-to-4 from 9-to-0, avoid loss-metric mismatch, **match or exceed individual human raters** on human-consensus meta-labels. The right pick when you can afford ITC (inference-time compute) on a strong "thinking" judge and have a small calibration set.

**CARE — confounder-aware aggregation** [2][8][9][10][11][24]. The strongest aggregator when judges share latent confounders. Two estimators inside one framework: **CARE-SVD** uses sparse+low-rank covariance recovery + a symmetry-breaking rule to extract the dominant latent quality direction; **CARE-Tensor** uses sparse dependency structure to form approximately-independent judge "views" and applies tensor decomposition for identifiable recovery in discrete/mixture regimes. Theoretical guarantees for identifiability and finite-sample recovery under shared confounders. Empirically reduces aggregation error **up to 26.8% across 12 public benchmarks** spanning continuous scoring, binary classification, and pairwise preference [2]. Robust integration of programmatic judges (cheaply constructed and added as confounder dimensions) [8][9]. Reference implementation at github.com/SprocketLab/CARE [11]. The right pick when you have ≥3 judges and reason to suspect shared confounders — almost always.

The decision matrix:

| Setting | Best aggregator |
|---|---|
| 2 judges, no calibration set | BBQ or judge-aware BTL |
| ≥3 judges, suspect shared confounders | CARE-SVD (then CARE-Tensor if mixture regime) |
| 1 thinking judge, n samples, calibration set | BTD distribution-calibrated |
| Pairwise preference with rating indeterminacy | Multi-label response set + MSE F̂ [17] |
| Continuous monitoring on production | Single calibrated judge with NOA + position swap |

A practical note: CARE and BTD are not mutually exclusive. CARE governs cross-judge aggregation; BTD governs intra-judge (cross-sample) aggregation. The ambitious 2026 stack runs BTD on each judge's n samples, then aggregates judge means via CARE.

## Part III: Calibrating Single Judges Cheaply

Production scoring runs at a sampling rate against live traffic; you cannot afford a 7-judge ensemble there. Single-judge calibration is the discipline that makes the cheap-monitoring half of the two-tier strategy reliable.

**CalibraEval — Non-parametric Order-Preserving Algorithm** [12][13][15] is the canonical label-free calibration for selection bias. The mechanism: query the judge with three prompt variants that swap option positions and ID tokens; compute the prediction distributions; use the partial-order relationships between distributions to derive a calibration function that maps observed distributions to unbiased ones, without explicit labels and without a parametric model of the bias. The reference implementation is a four-step Python pipeline (process_data.py → model_output.py → normalize.py → CalibraEval.py) that produces a func.json mapping and a model.pkl optimizer. Drop the calibration function in front of any pairwise judge and the position+token bias collapses.

**Multi-label response set elicitation** [17] is the right move when human raters resolve rating indeterminacy differently from the judge — for instance, on subjective rubric tasks where one human gives a 4 and another a 5 for the same response. The Guerdan / Barocas / Wallach / Wu paper proves that forced-choice metrics yield sub-optimal judge selections when indeterminacy is present. Their recommendations: design fully-specified rating tasks where possible; otherwise elicit multi-label "response set" ratings (rater selects all ratings that correspond); apply continuous response-set MSE F or its label-efficient variant MSE F̂. Where only forced-choice data exists, distributional metrics — specifically KL-D(h,j), not the asymmetric reverse — perform best among forced-choice metrics.

**Distributional alignment training** [16] is the training-time variant. Align the judge's generated judgment distribution with empirical human evaluation distributions via KL divergence, with cross-entropy regularization for stability and adversarial training for robustness against noise in the empirical estimate. The NeurIPS 2025 poster shows this framework outperforms closed-source single-point alignment methods.

**Bias-aware training** [6] takes the opposite approach: explicitly inject bias-related attributes during training and force the judge to disentangle task-relevant quality from bias-correlated cues. RL for generative judges; contrastive learning for discriminative judges. JudgeBiasBench provides the evaluation suite.

**Position-swap aggregation** is the cheap floor. Even without NOA, running each pairwise comparison twice (A then B, B then A) and only counting verdicts that survive both calls eliminates the most egregious position bias at 2× cost. Most production systems should do this whether or not they adopt NOA on top.

The pragmatic order: position-swap baseline first, NOA second, multi-label response set if indeterminacy is high, distributional alignment training only if you train your own judges. The first two are inference-time fixes; the last two are training-time.

## Part IV: The Cross-Family Ensemble Pattern

Cross-family ensembles are the strongest defense against self-preference bias and the foundation for the release-gating tier of the two-tier strategy.

The empirical case is settled. Hensler's mid-2025 production data: cross-vendor cuts the gap to ≤5 pp; siblings stay at 10-25 pp [1]. Pomms scaled the same finding to 1.29M caption-score pairs across 12 MLLMs and showed the bias travels through model families because successor models reuse connectors and instruction-tuning data [5]. The implication is concrete: **a panel of three Anthropic judges is approximately one judge for self-preference purposes**.

The five operational patterns Hensler distills [1] are battle-tested. **Blind and shuffle** — always randomize answer order and strip model identifiers — is $0 and removes position + style bias as a baseline. **Rotating judge pool** — alternate the judge model day-to-day or call-to-call — costs +1 call per run and limits any single judge's quirks from dominating the leaderboard. **Tiered review** — let a cheap small language model pass schema and toxicity, escalate to a big judge only for nuanced tasks — saves 20-40% of judge spend without quality loss. **Periodic audit** — sample 5% of nightly traffic to a held-out judge or human — costs +5% overall and surfaces drift early. **Self-consistency** — when the judge disagrees with itself across two seeds, escalate to a stronger judge — saves money on easy calls.

**Semantic XOR** is the orthogonal tool for surfacing disagreements between candidate answers. The pattern: prompt a large model with "return only the ideas present in answer A or answer B, but not both, preserving factual context." The result is a delta the synthesis agent or judge can use as a checklist — disagreements, omissions, and unique insights become explicit rather than blended away [1].

**Programmatic judges** are the cheap-to-construct entries you can add to a CARE-style aggregation as confounder dimensions [8][9]. A regex that fires on certain forbidden phrases, a deterministic scorer that counts citations, a length penalty — none of these are good judges alone, but they bias differently from LLM judges and CARE's sparse+low-rank decomposition can recover quality more reliably with them in the panel than without.

Cost framing matters. Multi-judge voting carries higher cost and latency [22]. The right pattern is to reserve cross-family ensembles for release-gating evaluations — the moments where a wrong call ships to production — and to use single calibrated judges (NOA + position swap) for continuous monitoring. Three judges from three vendors at 1× sampling on every production trace is operationally and financially indefensible. Three judges at PR-merge time on a 200-prompt regression set, plus one calibrated judge at 5-10% on production, is.

## Part V: Production Deployment — Release-Gating vs Continuous Monitoring

The deployment shape that pays off in 2026 is the **two-tier strategy**: cross-family ensemble at release-gates, single calibrated judge in continuous monitoring. The platform you pick determines how cheap that two-tier setup is to operate.

**Braintrust** [19][20][22][23] is built around the complete-loop pattern. Five stages: iterate in playgrounds → promote to immutable experiment → automate in CI/CD → score in production via online scoring rules (asynchronous, no latency impact) → feed production traces back into datasets. The native GitHub Action runs the full eval suite on every pull request and posts results as PR comments with score deltas. **Regression gates block deployments when scores fall below thresholds** — the canonical example is a factuality scorer with an 85% pass threshold blocking a prompt change that drops to 78% [22]. Setting accurate thresholds requires baseline data from a calibration set plus a few weeks of historical experimental runs.

The key Braintrust feature for the two-tier strategy is that **the same scorer logic runs in CI and in online production scoring** [22][23]. A cross-family ensemble built as a Braintrust scorer in CI can be downgraded to a single-judge variant in online scoring without re-implementing the metric — same output schema, same calibration, lower cost.

**LangSmith** [21] specializes in online evaluator configuration. Filters let you trigger evaluators only on runs where users left negative feedback, runs invoking specific tool calls, or runs matching metadata (e.g. `plan_type == "enterprise"`). Sampling rate (0.0 to 1.0) controls cost. Backfill from a date applies the rule to past runs at rule creation. Run-level vs multi-turn online evaluators handle single-call vs conversation-thread scoring. The LangSmith pattern is strongest when your eval program is built around production observation rather than offline regression.

**Phoenix** [23] is the strongest pure-observability platform but requires the team to build the loop themselves — manual export of traces, custom eval infrastructure, own pipeline. For teams with deep ML platform engineering and strict self-host requirements, Phoenix wins; for teams that want the loop in a box, Braintrust does.

**DeepEval** is the lightweight CI-first pick (3M monthly PyPI downloads, 10K stars), free and code-first, good for teams that value local development velocity over platform consolidation.

The four scoring patterns in production [22]:

- **Rubric scoring.** Numeric scores against criteria. Best for trend tracking and benchmarking. Limitation: scores can vary across runs without calibration.
- **Pairwise ranking.** Compare two outputs, pick a winner. Best for A/B testing prompts, models, fine-tuning runs. Limitation: sensitive to position bias — apply NOA or position-swap.
- **Pass/fail.** Binary. Best for safety, compliance, format validation. Limitation: too coarse for nuanced quality dimensions.
- **Multi-judge voting.** Aggregates multiple judges. Best for higher-stakes scoring, reducing single-judge noise. Limitation: higher cost and latency. **This is the release-gating pattern in the two-tier strategy.**

The non-obvious composition: rubric scoring + pairwise ranking + pass/fail + multi-judge voting are not alternatives but complements. A 2026 production stack often runs all four — pass/fail safety scorers for hard limits, rubric scoring for trend tracking, pairwise ranking with NOA for A/B testing, and multi-judge voting at PR-merge time for high-stakes deployment gating.

## Part VI: 90-Day Calibration Playbook

Three phases convert the methodology into a running program.

**Days 1-30 — instrument and baseline.** Add the Hensler logging schema to every judge call: `judge_family`, `answer_order`, `self_pref_flag`, `prompt_hash`, `domain_tag`, `model_meta`, plus per-axis judge scores [1]. Stand up an Elo or TrueSkill leaderboard against a frozen 200-prompt regression set. Pick a cheap baseline single judge (Claude 3.5 Sonnet or GPT-4.1 mini at temperature 0). Always blind-and-shuffle answer order. Always run pairwise comparisons twice with positions swapped and only count verdicts that survive both calls. By the end of week 4 you should have 4 weeks of historical data for setting initial regression-gate thresholds.

**Days 31-60 — single-judge calibration.** Build a small calibration set of 300-500 human-rated pairs spanning your domain. Apply CalibraEval NOA to your single judge: query each pair with three prompt variants (swap positions, swap ID tokens), compute prediction distributions, derive the NOA calibration function [12][13][15]. Validate: position consistency before and after NOA on the IJCNLP-2025-style metrics — repetition stability, position consistency, preference fairness [14]. Add programmatic judges (regex on forbidden phrases, citation counter, length penalty) to your judge panel; they are confounder dimensions for the next phase. Where rating indeterminacy is high, switch the human-rater elicitation to multi-label response set and use MSE F̂ as the agreement metric [17].

**Days 61-90 — aggregation and gates.** Bring up two aggregators: BTD distribution-calibrated for any thinking-LLM judge that produces n samples per item [3][4][25], and CARE-SVD across the panel of judges (LLM panel + programmatic judges) [2][8][9][11]. Wire the cross-family ensemble (one Anthropic + one OpenAI + one Google judge, plus programmatic judges) into the CI gate; reserve it for release-gating evaluations only. Keep the single NOA-calibrated judge running in online scoring at 5-10% sampling. Set regression gates at the 85% factuality / 90% safety / domain-specific pass-fail thresholds derived from the baseline data [22]. Stand up a 5%-sample nightly audit cron against a held-out human-rated set or stronger judge — when nightly Elo drops or cost-per-accepted-token rises, the audit catches drift early [1].

The key discipline: **the same scorer runs in CI and in online scoring**. If you cannot run the cross-family ensemble in production for cost, run a strict subset (single calibrated judge with NOA) in production and document the relationship between the production scorer and the CI scorer in your evaluation README. Drift between CI and production scorers is the silent failure mode that breaks regression gates over six months.

## Part VII: Where This Goes

Mid-2026: BTD distribution-calibrated and CARE-style confounder-aware aggregation are landing in eval-platform defaults. Braintrust, LangSmith, Phoenix, and DeepEval each ship some flavor of multi-judge voting today, but none ship CARE-SVD or BTD as first-class options out of the box. By Q4 2026 expect at least one to.

2027: judge-quality discrimination becomes table stakes. Treating all judges as equally reliable is already malpractice; the BBQ + judge-aware BTL framing — explicit rater-quality parameters with closed-form EM convergence — is the right floor for any leaderboard. Frontier model providers will start training their flagship models to be calibrated judges, with bias-aware training [6] and distributional alignment [16] baked into the post-training stage. Judge-as-a-service offerings will emerge — separate model families optimized for judging rather than answering, marketed with calibration-curve guarantees.

The deeper convergence is with the agent-observability stack canon. *The Agent Observability Stack* (paper #3 in the canon) positioned LLM-as-a-judge inside the trace → eval → score pipeline. This paper goes one layer deeper into the algorithm choice. The next layer — eval-driven development as a workflow discipline (Red-Green-Refactor for non-deterministic systems) — is already on the roadmap as a separate paper. Together, these three papers describe the full evaluation discipline for production agents.

The teams that adopt the two-tier strategy with NOA + BTD or CARE in 2026 enter 2027 with calibrated leaderboards, defensible regression gates, and the capacity to ship 2-pp improvements with confidence. The teams that stay on majority vote enter 2027 still arguing about whether a 2-pp delta is real.

## Closing

Single-judge LLM-as-a-judge has known failure modes. The fixes exist, work, and have peer-reviewed evidence. Cross-family ensembles, NOA selection-bias calibration, BTD distribution-calibrated aggregation, and CARE confounder-aware aggregation each carry their own benchmarks and reference implementations. The platform you pick — Braintrust, LangSmith, Phoenix, DeepEval — determines the operational shape of the two-tier strategy, not whether it works.

The 90-day playbook is not glamorous. Instrument, baseline, calibrate, aggregate, gate. The leverage is that once it runs, every model swap, prompt change, and tool addition rides on top of a reliable evaluation surface — and the conversation about whether a change is good moves from anecdote to score delta.

## References

1. Building Semantic XOR Ensembles — Adrian Hensler — https://adrianhensler.com/building-semantic-xor-ensembles-logging-bias-proof-judging-and-iterative-model-ratings-for-multi-llm-systems
2. CARE: Confounder-Aware Aggregation for Reliable LLM Evaluation — arXiv 2603.00039 — https://arxiv.org/abs/2603.00039
3. Distribution-Calibrated Inference Time Compute for Thinking LLM-as-a-Judge — arXiv 2512.03019 — https://arxiv.org/abs/2512.03019
4. Distribution-Calibrated ITC — OpenReview NeurIPS 2025 — https://openreview.net/pdf?id=zcniV3DRZJ
5. MLLM-as-a-Judge Exhibits Model Preference Bias (Pomms / Philautia-Eval) — arXiv 2604.11589 — https://arxiv.org/abs/2604.11589
6. Toward Robust LLM-Based Judges: JudgeBiasBench + Bias-Aware Training — arXiv 2603.08091 — https://arxiv.org/abs/2603.08091v1
7. A Judge-Aware Ranking Framework for Evaluating LLMs without Ground Truth — arXiv 2601.21817 — https://arxiv.org/abs/2601.21817v1
8. From Many Voices to One: Statistically Principled Aggregation of LLM Judges (CARE / Reliable ML Workshop) — OpenReview NeurIPS 2025 — https://openreview.net/forum?id=Ou53DNvjx7
9. From Many Voices to One — Snorkel AI research-paper — https://snorkel.ai/research-paper/from-many-voices-to-one-statistically-principled-aggregation-of-llm-judges/
10. From Many Voices to One (LLM Evaluation Workshop) — OpenReview NeurIPS 2025 — https://openreview.net/forum?id=XdcofpTCyq
11. SprocketLab/CARE — GitHub — https://github.com/SprocketLab/CARE
12. CalibraEval: Calibrating Prediction Distribution to Mitigate Selection Bias in LLMs-as-Judges — ACL 2025 — http://aclanthology.org/2025.acl-long.808/
13. CalibraEval — arXiv 2410.15393 — https://arxiv.org/abs/2410.15393
14. Judging the Judges: A Systematic Study of Position Bias in LLM-as-a-Judge — IJCNLP/AACL 2025 — http://aclanthology.org/2025.ijcnlp-long.18/
15. CalibraEval — GitHub — https://github.com/CSHaitao/CalibraEval
16. Distributional LLM-as-a-Judge — NeurIPS 2025 Poster — https://neurips.cc/virtual/2025/poster/120319
17. Multi-label Response Set Elicitation for Rating Indeterminacy (Guerdan et al.) — arXiv 2503.05965 — https://arxiv.org/pdf/2503.05965
18. Efficient Bayesian Inference from Noisy Pairwise Comparisons (BBQ) — arXiv 2510.09333 — https://arxiv.org/html/2510.09333v1
19. Evaluate systematically — Braintrust docs — https://braintrust.dev/docs/evaluate
20. LLM-as-a-judge scorers — Braintrust docs — https://www.braintrust.dev/docs/evaluate/llm-as-a-judge
21. Set up LLM-as-a-judge online evaluators — LangSmith — https://docs.langchain.com/langsmith/online-evaluations-llm-as-judge
22. What is an LLM-as-a-judge? — Braintrust Articles — https://www.braintrust.dev/articles/what-is-llm-as-a-judge
23. Arize Phoenix vs. Braintrust — Braintrust Articles — https://www.braintrust.dev/articles/arize-phoenix-vs-braintrust
24. CARE arXiv — algorithm details — https://arxiv.org/abs/2603.00039
25. Distribution-Calibrated ITC — arXiv PDF — https://arxiv.org/pdf/2512.03019

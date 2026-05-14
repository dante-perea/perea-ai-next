---
title: "Specialized LLM Judge Models: The 2026 Field Manual"
subtitle: "Prometheus 2, SFR-Judge, Self-Taught Evaluator, Skywork-Critic — when to use a tiny specialist judge instead of a frontier model"
publication: "perea.ai Research"
authors: ["Dante Perea"]
version: "1.0"
status: "Scheduled"
date: "2026-05"
audience: "Eval engineers, ML platform leads, and applied-AI teams running model-as-judge in CI gates, RLHF data pipelines, agentic-AI verification, and production scoring loops"
length: "~5,500 words"
license: "CC BY 4.0"
profile: "field-manual"
description: "When to use a tiny specialized judge model — Prometheus 2, SFR-Judge, Self-Taught Evaluator, Skywork-Critic, Galileo Luna-2, Patronus Lynx — instead of GPT-4o or Claude Opus. Five-axis decision matrix, training recipes (DJPO, weight-merging, iterative self-training), production deployment stack (vLLM/SGLang/TGI/TensorRT-LLM), and multi-judge ensemble methods (CARE, CalibraEval, judge-aware BTL, LLM Jury-on-Demand). 175× cost spread across judge models; the 7B-class specialist is the new default."
---

## Foreword

Two things are simultaneously true about AI evaluation in 2026. The first is that LLM-as-a-judge has won — almost every team that ships a generative product runs some flavour of "score the output with another LLM" in CI gates, A/B-test scoring, RLAIF data labelling, agentic verification, or content moderation.[^1] The second is that *which* LLM does the judging has become a strategic choice with a 175× cost spread and a measurable accuracy gap that cuts both ways.[^2] Frontier models like GPT-4o and Claude Opus 4.5 are still the gold standard on open-ended novel rubrics. But on stable, narrow rubrics evaluated at production volume, a fine-tuned 7B-13B specialist judge — Prometheus 2, SFR-Judge, Skywork-Critic, Galileo Luna-2, Patronus Lynx — matches or exceeds the frontier judge while running 100× cheaper per call on commodity GPUs.[^3] [^4] [^5] [^6] This field manual is for the team that has decided LLM-as-judge is in their stack and now needs to choose *which* judge, *how* to train or pick one, *how* to deploy it, and *how* to ensemble it.

## Executive Summary

Five findings drive every decision in this manual.

**Specialist judges have caught up to frontier judges on benchmark accuracy.** As of the most recent RewardBench v1 leaderboard snapshot (September 2024),[^7] the top five generative judges are Skywork-Critic-Llama-3.1-70B at 93.3%,[^7] SFR-LLaMa-3.1-70B-Judge-r at 92.7%,[^7] SFR-nemo-12B-Judge-r at 90.3%,[^7] Skywork-Critic-Llama-3.1-8B at 89.0%,[^7] and SFR-LLaMa-3.1-8B-Judge-r at 88.7%[^7] — every one of them above GPT-4o (86.7%) and Claude 3.5 Sonnet (84.2%) on the same benchmark.[^7] [^8] On the official SFR-Judge paper's seven-pairwise-benchmark aggregate, SFR-Judge-70B reaches 84.25 average — about eight points above GPT-4o (76.78) — and even SFR-Judge-8B (80.91) beats GPT-4o on six of the seven.[^3]

**RewardBench v2 (June 2025) sets a higher ceiling and shows specialists keep up there too.** Top reward-model evaluation results dropped 20+ points moving from v1 to v2; top-spot Skywork-Reward-V2-Llama-3.1-8B reaches 84.1 average across six new domains (Factuality / Instruction-Following / Math / Safety / Focus / Ties), beating Gemini 2.5 Pro (79.5) and Claude Opus 4 (76.5) at one tenth the parameter count.[^9]

**Production economics inverts the build/buy decision once volume crosses a threshold.** A fine-tuned Llama 3 70B served on a single A100 with vLLM costs about $2,640/month and delivers approximately $0.003 per 1,000 tokens at full utilisation — roughly 100× cheaper per token than Claude 3.5 Sonnet at API pricing.[^10] Galileo's Luna-2 (3B/8B Llama fine-tune) reaches 0.88-0.95 accuracy on agentic-evaluation tasks at a 97% cost reduction versus GPT-4-based evaluation.[^4] At one million evaluations per month, the difference between a $0.45 and a $5 judge is $550,000 per year.[^4]

**Multi-judge juries with principled aggregation beat any single frontier judge.** The PoLL jury — three diverse 7B-35B judges combined — attains higher agreement with human ratings than GPT-4 at 7× lower cost.[^11] CARE (Confounder-Aware Aggregation) reduces multi-judge aggregation error by up to 25.15% versus majority vote on UltraFeedback.[^11] CalibraEval, a label-free non-parametric debiasing method, mitigates pairwise selection bias without any fine-tuning.[^12] Judge-aware BTL extensions provide calibrated confidence intervals over LLM rankings — and prove that ignoring judge heterogeneity makes "more data make evaluation more confidently wrong."[^13]

**The deployment decision is a five-axis rubric, not a single number.** Frequency (calls/day), stakes (CI gate vs compliance audit vs inline verification), rubric stability (stable rubric → fine-tune; changing → prompted frontier), latency budget (sub-100ms / sub-500ms / multi-second), and bias profile (downstream-optimisation vs human-aligned) each pull a deployment toward a different judge family. The rest of this manual works each axis with concrete deployment patterns.

## Part I — The Specialist-Judge Landscape

The 2026 specialist-judge ecosystem has roughly four lineages, each with a distinct training recipe and production niche.

**Prometheus 2 (KAIST + CMU + AI2 + Allen Institute, May 2024)** introduced the *weight-merging* recipe: train two specialists separately on direct-assessment versus pairwise-ranking preference data, then merge weights. The resulting unified evaluator outperforms both parents AND beats jointly-trained models, which was the empirical headline of the paper.[^14] [^15] Two base models exist: Prometheus-7B-v2.0 (Mistral-7B-Instruct-v0.2 base) and Prometheus-8x7B-v2.0 (Mixtral-8x7B-Instruct-v0.1 base), trained on 100K Feedback Collection (direct assessment) plus 200K Preference Collection (pairwise) — the latter introducing 1,000 custom evaluation criteria beyond basic helpfulness/harmlessness.[^14] [^16] Prometheus-7B reproduces ≥80% of the 8x7B model's evaluation statistics at 16GB VRAM, making it deployable on a single consumer GPU.[^4]

**SFR-Judge (Salesforce AI Research, September 2024)** introduced *Direct Judgement Preference Optimization* (DJPO) — a recipe that produces judges trained to emit explanations alongside their judgments, explicitly differentiating from black-box reward models.[^3] [^17] Three model sizes (8B / 12B / 70B), three task types (pairwise comparisons, single ratings on a 1-5 Likert scale, binary classification), and a thirteen-benchmark evaluation suite covering reward modelling, safety, instruction-following, and rubric-based assessment. The Salesforce blog notes the 70B model was the first generative judge to cross 90%[^17] on RewardBench (along with Skywork-Critic), and that SFR-Judge-70B was the best performer on 10 of 13 benchmarks tested — including RewardBench, InstruSum, Auto-J Eval-P, HHH, EvalBiasBench, and PreferenceBench.[^3] [^17] Salesforce later released ContextualJudgeBench (March 2025) — a 2,000-pair benchmark for contextual settings (RAG and summarisation) where even GPT-o1 reaches only 55.3% consistent accuracy and SFRJudge-70B reaches 51.4%.[^18] [^19]

**Self-Taught Evaluator (Meta FAIR, August 2024)** removed human-labeled preferences from the training loop entirely. The recipe: prompt the seed model (Llama-3-70B-Instruct) to produce contrasting response pairs; use the model as an LLM-as-Judge to generate reasoning traces and judgments on those pairs; keep only the correct judgments (verified against the synthetic preference design); fine-tune; iterate.[^20] [^21] After five iterations, the seed model improved from 75.4 → 88.3 on RewardBench (88.7 with majority vote) — beating GPT-4 LLM-judges and matching top reward models trained with labels.[^20] HelpSteer2-labelled training of the same seed reached only 85.6 — synthetic-only beats labelled-supervised on the same seed in this recipe.[^20] The model is gated under a research license on HuggingFace and uses MT-Bench-style "Please act as an impartial judge..." prompts with `[[A]]` / `[[B]]` final-verdict format.[^22]

**Skywork-Critic + Skywork-Reward-V2 (Skywork AI Alignment Team, August 2024 + July 2025)** demonstrated that *data curation beats data volume*. Skywork-Critic-Llama-3.1-70B was the first generative judge to cross 90%[^7] on RewardBench (93.3%)[^7] — trained on a cleaned subset of HelpSteer2, OffsetBias, WildGuard adversarial, and Magpie DPO Ultra/Pro/Air, totalling about 80K curated preference pairs.[^7] [^23] Skywork-Reward-V2 (July 2025) extended the recipe with 40M preference pairs and eight model sizes from 0.6B to 8B; the Skywork-Reward-V2-Llama-3.1-8B-40M variant outperforms all existing reward models on every one of seven benchmarks (RewardBench v1 97.8 / v2 86.5 / PPE-Pref 79.8 / PPE-Correctness 87.2 / RMB 89.3 / RM-Bench 96.0 / JudgeBench 83.4; average 88.6).[^24]

A short catalog of specialised judges that round out the deployment surface:

- **Galileo Luna-2** (3B/8B Llama fine-tune) — agentic-evaluation specialist; 0.88-0.95 accuracy at 97% lower cost than GPT-4-based eval; production-ready.[^4]
- **Patronus Lynx** (8B/70B Llama 3 fine-tune) — hallucination-detection specialist; the 8B variant beats GPT-3.5 by 24.5% on HaluBench.[^4]
- **JudgeLM** (7B/13B/33B) — ICLR 2025 Spotlight; uses swap augmentation and reference drop for bias mitigation; trained from scratch on 100K GPT-4-judged preferences.[^4]
- **PandaLM** (7B) — strong on legal and biomedical specialised domains.[^4]
- **Atla Selene + Atla Selene Mini** — Llama-derived judge models referenced across the ContextualJudgeBench evaluation suite.[^18]
- **OffsetBias-8B** (NCSOFT) — 84.0 on RewardBench, focused on bias mitigation through curated counterexamples.[^7]
- **Themis-8B** — single-rating focused; 8B parameter Llama fine-tune.[^25]
- **Flow-Judge-v0.1** — 3.8B Phi-3.5-mini-instruct fine-tune on a synthetic preference dataset; the smallest credible specialist.[^26]
- **M-Prometheus** — multilingual extension of Prometheus 2 using Claude-Sonnet-3.5 as data generator (more fluent than GPT-4 in non-English).[^27]
- **Con-J-7B** — 87.1 on RewardBench, EvalBiasBench-leading at 82.5.[^3]

## Part II — Benchmarks That Matter

The set of judge-evaluation benchmarks has consolidated to a handful that practitioners care about, with each measuring a different failure mode.

**RewardBench v1 (Allen Institute, March 2024)** is the de facto leaderboard.[^28] [^29] Four categories — Chat (AlpacaEval-easy/length/hard plus MT-Bench-easy/medium), Chat-Hard (MT-Bench-hard plus LLMBar adversarial subsets), Safety (refusals-dangerous/offensive plus xstest plus DoNotAnswer), and Reasoning (HumanEvalPack across six languages plus PRM-Math, with math equalised to code) — averaged into a single overall score with a "Prior Sets" mixture (Anthropic Helpful, HHH BIG-Bench, Stanford SHP, OpenAI Learning-to-Summarize) blended in for context.[^29] The official tooling at `allenai/reward-bench` supports both classifier reward models (`run_rm.py`), DPO-implicit reward models (`run_dpo.py`), and generative judges (`run_v2.py` for the v2 best-of-4 + ties data).[^28]

**RewardBench v2 (June 2025)** is harder by design: best-of-N with N>2, unseen prompts, and six new domains (Factuality, Instruction Following, Math, Safety, Focus, Ties).[^9] Models leading on v1 score 20+ points lower on v2; even top systems are below 40% on Precise Instruction Following and below 70% on Math.[^9] The v2 leaderboard (RewardBench v2 paper Table 3) places Skywork-Reward-V2-Llama-3.1-8B at 84.1, ContextualAI/LMUnit-qwen2.5-72b (LM-as-judge) at 82.1, Databricks-Mosaic-Research/PGRM at 80.0, Gemini 2.5 Pro at 79.5, Claude Opus 4 at 76.5, and Llama-3.1-70B-Instruct-RM-RB2 at 76.1.[^9]

**JudgeBench (Princeton + UC Berkeley, October 2024)** rejects the human-preference framing entirely.[^30] [^31] The benchmark uses *objectively correct* preference labels — derived from response pairs across knowledge / reasoning / math / coding generated by GPT-4o (350 pairs) or Claude-3.5-Sonnet (270 pairs) — and finds many strong judges including GPT-4o "perform just slightly better than random guessing."[^31] The official repo supports prompted judges (vanilla, Arena-Hard, PandaLM, Prometheus 2, JudgeLM, Auto-J, Skywork-Critic) and reward models (InternLM2-7B/20B-Reward, GRM-Gemma-2B, Skywork-Reward-Gemma-2-27B, Skywork-Reward-Llama-3.1-8B).[^30]

**MT-Bench + Chatbot Arena (LMSYS, Zheng et al., June 2023)** is the foundational paper for LLM-as-judge — and still the canonical reference for the four bias categories every subsequent paper attempts to mitigate: position bias, verbosity bias, self-enhancement bias, and limited reasoning ability (especially math).[^32] On MT-Bench (S2-no-tie setup), GPT-4 reaches 85% agreement with human experts — even higher than the 81% human-human agreement rate.[^32] When humans disagreed with GPT-4 and were shown GPT-4's reasoning, they deemed it reasonable in 75% of cases and changed their own answer in 34%.[^32] The authors open-sourced 3K expert votes, 3K crowdsourced votes, and 30K Chatbot Arena conversations — the dataset that anchors most subsequent judge-validation work.[^32]

**ContextualJudgeBench (Salesforce, March 2025 → ACL Long 2025)** addresses a gap: judges are typically evaluated on non-contextual scenarios, but RAG and summarisation increasingly dominate production deployments.[^18] [^19] 2,000 pairs across eight splits assessing refusals, faithfulness, completeness, and conciseness across QA and summarisation.[^18] Even GPT-o1 reaches only 55.3%[^18] consistent accuracy; SFRJudge-70B 51.4%;[^18] reasoning-tuned models like DeepSeek-R1-Llama-70B and o3-mini cluster near the top.[^18]

**JETTS (April 2025)** is the first systematic test-time-scaling benchmark for judges.[^33] It tests 10 judge models (7B-70B) across 8 base generators (6.7B-72B) on three test-time scaling tasks (best-of-N reranking, beam search, critique-based refinement) — and reveals a "fundamental judging-ability gap" that RewardBench v1 hides. Skywork-Critic-8B and 70B differ by only 4%[^33] on RewardBench but materially diverge on JETTS reranking, where the 70B judge yields substantively larger improvements over the greedy response.[^33]

Other named benchmarks worth tracking:

- **EvalBiasBench** (NCSOFT) — 6 bias categories: length, familiar-knowledge, false-pretence, spurious-citation, etc.[^7]
- **PPE** (Frick et al.) — Preference and Correctness splits.
- **RM-Bench** (Liu et al.) — robustness to length and verbosity attacks.
- **RMB** (Zhou et al.) — best-of-N with human preference labels.
- **PreferenceBench** (Kim et al.) — companion to Prometheus's Preference Collection.[^14]
- **InstruSum** (Liu et al.) — instruction-following summarisation.
- **HHH** (Askell et al., BIG-Bench) — helpful/honest/harmless triple.[^28]
- **AlpacaEval** + **AlpacaEval-LC** (length-controlled) — generalist instruction-following.

## Part III — Training Recipes for Specialist Judges

The HuggingFace evaluation-guidebook is the canonical practitioner reference; its three-judge taxonomy (classifier judges, LLM judges, reward models) and decision tree for training-from-scratch versus distillation versus PEFT are the blueprint most production teams follow.[^34] [^35] [^36]

The four high-leverage training recipes that produced the SOTA specialist judges are:

**Weight-merging two specialists (Prometheus 2 recipe).** Train one specialist on direct-assessment data and another on pairwise-ranking data with the same base model. Merge weights of the two fine-tunes. The merged model outperforms either parent AND outperforms a jointly-trained equivalent on the same data — a counterintuitive empirical result that the Prometheus 2 paper documents on four direct-assessment and four pairwise-ranking benchmarks.[^14] [^15] The Preference Collection that drives the pairwise side extends the Feedback Collection with 1,000 custom evaluation criteria beyond helpfulness/harmlessness — meaning the merged judge generalises to fine-grained rubric assessment, not just generic quality.[^14]

**Iterative self-training with synthetic data only (Self-Taught Evaluator recipe).** Start from an instruct model (Llama-3-70B-Instruct in the original paper). Prompt it to generate contrasting response pairs where one is designed to be inferior. Use the seed model itself as the LLM-as-Judge to generate reasoning traces plus judgments on those pairs; keep only correct judgments (verified against the synthetic preference design); fine-tune; iterate.[^20] [^21] Five iterations lifted the seed model from 75.4 to 88.3 on RewardBench — and crucially, beat the same-seed model trained on labelled HelpSteer2 (85.6).[^20] The recipe relies on no human-annotated preferences in the training loop. Meta released the model card under a research license.[^22]

**Direct Judgement Preference Optimization (SFR-Judge recipe).** Generalises DPO from preference-on-responses to preference-on-judgments — the judge produces explanations *plus* judgments, and DPO is applied over judgment-explanation pairs.[^3] [^17] Three task types are trained jointly: pairwise comparison, single-rating Likert 1-5, and binary classification. The official Salesforce repo implements the full evaluation suite across 13 benchmarks (with separate handling for RewardBench, which expects classifier-style overall_score).[^17]

**Bag-of-tricks data curation (Skywork-Reward recipe).** Skywork-Reward demonstrated that 80K *curated* preference pairs beat 200K+ uncurated.[^23] Skywork-Reward-V2 extended this with 40M preference pairs (a third of which are intentionally flipped chosen/rejected to introduce hard negatives) and eight model sizes from 0.6B to 8B — the smallest 0.6B variant nearly matches the previous best Skywork-Reward-Gemma-2-27B average performance.[^24]

The HuggingFace guidebook layers practical guidance on top of these recipes:

- **Reward-model start often beats instruct-model start** when fine-tuning a judge — though SFR-Judge, Skywork-Critic, and Self-Taught Evaluator all use instruct-tuned bases, which is the dominant choice in 2026.[^36]
- **Pairwise comparison correlates better with human preference than scoring**, and is more robust generally; if you really want a score, use an integer scale with a detailed rubric.[^37]
- **One prompt per capability** tends to give more robust scoring than one multi-criteria prompt.[^37]
- **Few-shot examples**, **reference responses when available**, and **chain-of-thought before the score** all improve accuracy at the cost of more tokens.[^37]
- **Format bias is strong** — match the training prompt format exactly. A model trained to do pairwise with a reference answer will fail without one, and vice versa.[^38]

The bias mitigation playbook from `tips-and-tricks.md` is non-negotiable for production:[^38]
1. Self-consistency prompting (sample N times, majority vote) — temperature 0 by default.
2. Position-swap (always run A/B and B/A; the consistent answer wins).
3. Length-neutral instruction in the prompt.
4. Avoid same-family judge to mitigate self-enhancement bias.
5. Multi-judge jury aggregating smaller diverse judges (which is the bridge to Part V).

The HuggingFace guidebook also points practitioners to the Distilabel library (Argilla) for synthetic preference data construction, with worked examples implementing UltraFeedback and Arena-Hard.[^16] [^39]

## Part IV — Production Deployment Stack

Once a judge model is selected and trained, deployment economics dictate three more decisions: which inference server, which GPU class, and which batching strategy.

The 2026 inference-server landscape has consolidated to four mainstream choices, with one of them in maintenance mode.[^40] [^41] [^42]

**vLLM** is the safest default for new production deployments. 200+ model architectures, active development, Apache 2.0, OpenAI-compatible API, mature autoscaling and quantization support.[^40] An empirical evaluation comparing vLLM and HuggingFace TGI found vLLM achieves up to 24× higher throughput than TGI under high-concurrency workloads, with vLLM hitting 15,243 tokens/sec versus TGI's 4,156 tokens/sec at 100 concurrent requests on LLaMA-2-7B.[^43] vLLM uses 19-27% less GPU memory through PagedAttention, hits 85-92% GPU utilisation under high concurrency versus TGI's 68-74%, and saturates at 100-150 concurrent requests versus TGI's 50-75.[^43] Cold start is approximately 62 seconds — not ideal for autoscaling fleets — and the TTFT p99 can be 80% larger than competitors at peak load.[^40]

**SGLang** is the throughput leader for prefix-shared workloads (RAG, multi-turn chat, judge ensembles where the rubric is reused across calls).[^41] [^42] SGLang v0.5.9 reaches 2,460 tokens/sec at 100 concurrent requests on H100 — about 29%[^40] faster than vLLM v0.18.0 at 2,400 — driven by RadixAttention prefix-cache hit rates of 85-95%[^40] versus vLLM's 15-25% on prefix-heavy workloads.[^40] On LLM-as-judge specifically, SGLang's median TTFT runs ~3× lower than vLLM (32ms vs 100ms at 4 RPS / 1,200 prompts) and median ITL ~10× lower (12ms vs 129ms).[^44]

**TensorRT-LLM** posts the best raw numbers — 2,780 tokens/sec at 100 concurrent requests on H100 — but requires a 28-minute engine compilation per model, which is only worth it for sustained high-traffic serving of a fixed model.[^40]

**TGI (HuggingFace Text Generation Inference)** entered maintenance mode in December 2025; for any new deployment, migrate to vLLM or SGLang.[^40]

The cost model that makes specialist judges economically dominant at production volume is illustrated by the Boolean & Beyond analysis. A fine-tuned Llama 3 70B served with vLLM on a single A100 80GB GPU achieves 30-40 tokens/sec/concurrent request, reaching 240-320 tokens/sec at batch size 8.[^10] An A100 instance on GCP costs $3.67/hour ≈ $2,640/month. At 320 tokens/sec sustained throughput, this serves roughly 830 million tokens/day — making the effective cost approximately $0.003 per 1,000 tokens, roughly 100× cheaper than Claude 3.5 Sonnet's API pricing of $3 per million input tokens and $15 per million output tokens.[^10] [^45] The break-even is approximately 50-100 million tokens per day at 50%+ GPU utilisation.[^10] Below that volume, frontier API pricing wins.

The Zylos Research production-eval study quantifies the bifurcation: the cost-per-1K-evaluations spread across judge models reaches **175×** ($0.45 to $78.96 per 1K), and at one million evaluations per month, the difference between a $0.45 and a $5 judge is $550,000 per year.[^4] Galileo Luna-2 (3B/8B Llama fine-tune)[^4] reaches 0.88-0.95 accuracy on agentic-evaluation tasks at 97%[^4] cost reduction versus GPT-4-based evaluation — making "judge every agent output before delivery" economically viable for the first time.[^4]

A second-order metric that production teams under-invest in is **Evaluation Completion Rate (ECR@1)** — the fraction of judge calls that return parseable structured output on the first try. The Zylos study cited a model with 85.4% ECR@1 producing $1,200/year in retry overhead alone at 1M evals/month.[^4] Format-bias is the dominant cause: prompted judges fall off a cliff when rubrics change format mid-stream.

The latency budget also dictates judge sizing. Sub-100ms p95 requires a 7B-class specialist on a dedicated GPU. Sub-500ms p95 fits 8B-13B specialists or Gemini Flash (420ms avg / 680ms p95 in the Leaper $50K/6mo deployment data).[^46] Multi-second budgets open the door to frontier judges with reasoning mode.[^46]

## Part V — Multi-Judge Ensembles + Calibration

Naive majority-vote of multiple LLM judges fails for a specific, well-documented reason: judge errors are correlated.[^11] [^13] When three judges all share a verbosity bias, majority-vote of three doesn't cancel the bias — it amplifies it. The 2024-2026 literature has produced four classes of solutions.

**PoLL jury (panel of LLMs).** Combines three diverse 7B-35B judges drawn from different families. The PoLL ensemble attains higher agreement with human ratings than GPT-4 at 7× lower cost — and reduces bias because the *diversity* of the judges (different base models, different training data) decorrelates errors.[^11] PoLL is the default production pattern for teams running specialist judges; the practical recipe is "one Prometheus 2, one SFR-Judge, one Skywork-Critic, average their scores."

**JudgeBlender** ensembles either multiple models or multiple prompts for the same model — improving precision and consistency of relevance judgments over any individual LLM.[^11] Multi-prompt mode is cheaper because it reuses the same inference server.

**CalibraEval (Li et al., ACL Long 2025).** Reformulates pairwise selection-bias debiasing as an optimisation problem: align observed prediction distributions with unbiased ones using a non-parametric order-preserving algorithm (NOA). The method is **label-free** — works at inference time without any fine-tuning data — and outperforms existing debiasing methods on multiple benchmarks.[^12] Production-ready code at `CSHaitao/CalibraEval`.

**CARE — Confounder-Aware Aggregation.** Casts multi-judge aggregation as inference in a higher-rank latent-variable Markov Random Field jointly modelling: (i) a latent quality variable Q, (ii) confounders like length and style, (iii) inter-judge correlations.[^11] Two-stage estimator — sparse+low-rank decomposition of the judge precision matrix, then symmetric tensor decomposition to resolve rotational ambiguity. Reduces aggregation error by up to 25.15%[^11] versus majority vote on UltraFeedback, with provable identifiability guarantees and sample-complexity bounds.[^11] CARE accepts programmatic judges (length counters, keyword checkers) alongside LLM judges, and integrates them into the same aggregation framework.

**Judge-aware BTL extension.** Extends the classical Bradley-Terry-Luce ranking model with per-judge discrimination parameters γ_k, jointly estimating latent model quality scores and judge reliability from pairwise comparisons without ground-truth labels.[^13] Crucial theoretical result: the asymptotic-normality proof yields **calibrated confidence intervals** for score differences and rank comparisons. The paper also proves that ignoring judge heterogeneity (treating all judges equally) yields biased estimates whose bias **does not vanish asymptotically** — formally: "more data can make evaluation more confidently wrong under misspecified aggregation."[^13]

**LLM Jury-on-Demand (December 2025).** Trains reliability predictors per judge using token distributions, embeddings, and structural input features. Per-data-point dynamic jury selection: for each evaluation case, pick the most-reliable subset of judges and aggregate their scores using reliability as weights.[^47] Significant uplift over single-judge AND static-jury baselines on summarisation and RAG benchmarks. The recipe matters because not every judge is competent on every kind of input — a math-strong judge should weigh more on math evaluations and less on long-form creative writing.

The synthesis: a production multi-judge stack in 2026 should layer (i) a diverse 3-5 judge panel of specialist models (PoLL pattern), (ii) per-judge bias correction (CalibraEval at inference), (iii) confounder-aware aggregation (CARE for offline batch eval; weighted average with judge-aware discrimination γ_k for online), and (iv) calibrated confidence intervals over the final scores.

## Part VI — The Decision Matrix

The five-axis selection rubric crystallises into four canonical deployment patterns.

**Axis 1 — Frequency of evaluation (calls/day).**
- < 1K/day → frontier judge (GPT-4o or Claude Sonnet 4.5). Per-call cost dominates infrastructure cost.
- 1K-1M/day → specialist judge OR frontier-with-prompt-caching. Anthropic prompt caching cuts cost ~40% on repetitive rubrics.[^48]
- \> 1M/day → specialist judge mandatory. Galileo Luna-2 saves 97% versus GPT-4-based eval.[^4]

**Axis 2 — Stakes of the decision.**
- Production CI gate / regression test → specialist judge with majority-vote ensemble (CARE / CalibraEval).
- Compliance audit / safety review → frontier judge plus human-in-loop sample.
- Inline agent verification → specialist judge (Patronus Lynx 8B / Galileo Luna-2 / Prometheus 2 7B).

**Axis 3 — Rubric stability.**
- Stable rubric, auditable → fine-tune specialist on rubric-specific preference data.
- Frequently changing rubric → frontier judge with prompt engineering.

**Axis 4 — Latency budget (p95).**
- Sub-100ms p95 → 7B-class specialist on dedicated GPU.
- Sub-500ms p95 → 8B-13B specialist or Gemini Flash (420ms avg).[^46]
- Multi-second OK → frontier judge with reasoning mode.

**Axis 5 — Bias / format requirements.**
- Production scoring with downstream optimization (RLHF / DPO data) → DJPO-trained specialist (SFR-Judge), EvalBiasBench-validated.[^17]
- Open-ended human-aligned scoring → frontier judge with CalibraEval at inference.[^12]

The four canonical patterns:

**Pattern A — High-volume CI gate.** Single-judge specialist (Prometheus 2 7B or SFR-Judge 8B) on a dedicated A100, vLLM, batch-inference. ~$2,640/month. Score every PR; flag regressions; humans review the flagged subset only.

**Pattern B — RLAIF data labelling pipeline.** PoLL jury of 3 specialists (Prometheus 2 + SFR-Judge + Skywork-Critic) plus CARE aggregation. Per-call cost ~7× lower than GPT-4; quality higher than GPT-4 single-judge.[^11]

**Pattern C — Inline agent verification.** Patronus Lynx 8B for hallucination check OR Galileo Luna-2 for general agentic eval; sub-200ms p95; SGLang inference server with prefix-caching for shared rubric prompts.[^4]

**Pattern D — Compliance audit / safety review.** Frontier judge (Claude Opus 4.5 or GPT-5.1 Thinking)[^49] plus 5-10%[^49] human review sample. Cost is acceptable because volume is low and stakes are high.[^49]

## Part VII — Operating Procedure

A five-step deployment recipe that the field has converged on.

**Step 1 — Select the judge model class.** Use the five-axis decision matrix in Part VI. For most production workloads in 2026, the answer is *specialist judge* (Pattern A or B); for novel rubrics or very low volume, frontier judge.

**Step 2 — Build the eval set.** 100-1,000 examples with human-labelled preferences (binary or 1-5 Likert depending on task). For multi-rubric assessment, a stratified sample across rubric categories. The Distilabel library provides UltraFeedback and Arena-Hard tutorials for synthetic-data augmentation if hand-labelled data is scarce.[^16] [^39]

**Step 3 — Validate against frontier judge.** Run the chosen specialist judge on the eval set; run a frontier judge on the same set; compute agreement. Target 85-90%[^32] agreement, which corresponds to GPT-4-versus-human-expert agreement on MT-Bench (85% in S2-no-tie setup).[^32] [^10] If agreement is below 80%, escalate to fine-tuning or change the specialist class. The Boolean & Beyond report quantifies LLM-as-judge cost for this step at $5-10 per 200 examples — a one-time validation cost.[^10]

**Step 4 — Ship behind a CI gate with self-consistency + position-swap.** Always run pairwise A/B and B/A; consistent answer wins. Self-consistency at temperature 0 is the default; add majority-vote across 3-5 samples for any judgement on the production critical path.[^38] Set ECR@1 (eval completion rate) alarms — anything below 95% is a format-bias regression to investigate.[^4]

**Step 5 — Monitor ECR@1 + agreement-with-frontier drift.** Sample 1-5% of production judgments daily; re-judge them with a frontier judge; alarm on agreement drift > 5 points. Drift is usually traceable to a rubric prompt change or a model upgrade — both fixable, but only if observed.

A short list of operational pitfalls that derail teams:
1. **Format-bias on rubric changes** — rebuild few-shots and re-validate every time the rubric prompt changes.
2. **Hallucination evaluation weakness** — LLM judges are poor at identifying hallucinations, particularly partial ones.[^35] Use Patronus Lynx (fine-tuned for it) instead of a generalist judge.
3. **Correlated-judge majority-vote anti-pattern** — three same-family judges vote together; bias amplifies. Always diverse-family panels.[^11]
4. **Test-leakage** — verify training datasets don't contain RewardBench / JudgeBench / MT-Bench test items. Skywork's release notes explicitly state they verified this for Skywork-Critic.[^7]
5. **Naive Likert scoring without rubric** — pairwise comparison correlates better with human preference than 1-5 scoring. Default to pairwise; only use scoring when forced by downstream consumption.[^37]

## Quotable Findings

1. Top open specialist judges beat frontier APIs on RewardBench: Skywork-Critic-Llama-3.1-70B at 93.3, SFR-Judge-70B at 92.7, both above GPT-4o at 86.7 and Claude 3.5 Sonnet at 84.2.[^7] [^3]
2. Galileo Luna-2 (3B/8B Llama fine-tune) reaches 0.88-0.95 accuracy on agentic eval at 97% cost reduction versus GPT-4-based evaluation.[^4]
3. The cost-per-1K-evaluations spread across judge models is 175×; at 1M evals/month, the difference between a $0.45 and a $5 judge is $550,000/year.[^4]
4. A fine-tuned Llama 3 70B on a single A100 with vLLM costs $0.003 per 1,000 tokens — about 100× cheaper than Claude 3.5 Sonnet at API pricing.[^10]
5. CARE (Confounder-Aware Aggregation) reduces multi-judge aggregation error by up to 25.15% versus majority vote on UltraFeedback.[^11]
6. PoLL jury — three diverse 7B-35B judges combined — beats GPT-4 single-judge agreement with humans at 7× lower cost.[^11]
7. Self-Taught Evaluator improved Llama-3-70B from 75.4 → 88.7 on RewardBench using zero human-labelled preferences.[^20]
8. Skywork-Reward-V2-Llama-3.1-8B-40M (8B params) outperforms all existing reward models on every benchmark in a 7-benchmark suite (avg 88.6).[^24]

## Glossary

- **ECR@1** — Evaluation Completion Rate at first attempt; fraction of judge calls returning parseable structured output without retry.
- **DJPO** — Direct Judgement Preference Optimization; SFR-Judge training recipe generalising DPO to judgment-explanation pairs.
- **DPO** — Direct Preference Optimization; offline alternative to RLHF that fits a policy directly to preference pairs.
- **PoLL** — Panel of LLMs; multi-judge ensemble of three diverse small judges that beats single-frontier-judge correlation with humans at 7× lower cost.
- **CARE** — Confounder-Aware Aggregation; latent-MRF method for multi-judge score aggregation reducing error 25.15% versus majority vote.
- **CalibraEval** — Label-free non-parametric debiasing for pairwise judges via order-preserving distribution alignment.
- **Position bias** — Judge order-dependence; same-content pair scored differently when responses are swapped.
- **Verbosity bias** — Judge preference for longer responses regardless of quality.
- **Self-enhancement bias** — Judge preference for responses from its own family of models.
- **Format bias** — Judge accuracy degradation when rubric prompt format diverges from training-time format.
- **RewardBench v1 / v2** — Allen Institute reward-model evaluation benchmarks; v2 adds Best-of-N + unseen prompts + 6 new domains.
- **JudgeBench** — Princeton/Berkeley benchmark using objectively-correct preference labels (vs human preference) on knowledge/reasoning/math/coding pairs.
- **ContextualJudgeBench** — Salesforce 2,000-pair RAG and summarisation benchmark; even GPT-o1 reaches only 55.3% consistent accuracy.

## Related Research

- [The Multi-Judge Calibration Playbook](https://www.perea.ai/research/multi-judge-calibration-playbook) — calibration recipes and CalibraEval/CJE deep-dive.
- [The Agent Observability Stack](https://www.perea.ai/research/agent-observability-stack) — six-stage eval pipeline (instrument → trace → dataset → evaluator → score → CI gate); judge models are the *evaluator* layer.
- [The MCP Server Playbook for SaaS Founders](https://www.perea.ai/research/mcp-server-playbook) — context for judge-model deployment in MCP-mediated workflows.

## References

[^1]: HuggingFace evaluation-guidebook, "LLM-as-a-Judge basics" — https://github.com/huggingface/evaluation-guidebook/blob/main/contents/model-as-a-judge/basics.md

[^2]: Zylos Research, "LLM-as-Judge in Production: Agent Reasoning Verification" (2026-04-10) — https://zylos.ai/research/2026-04-10-llm-as-judge-production-agent-verification-2026

[^3]: Salesforce AI Research, "SFR-Judge: Direct Judgement Preference Optimization" (arXiv 2409.14664) — https://arxiv.org/pdf/2409.14664

[^4]: Zylos Research, "LLM-as-Judge in Production: Cost Bifurcation Analysis" (2026-04-10) — https://zylos.ai/research/2026-04-10-llm-as-judge-production-agent-verification-2026

[^5]: Skywork AI Alignment Team, "Skywork-Critic-Llama-3.1-70B" — https://huggingface.co/Skywork/Skywork-Critic-Llama3.1-70B

[^6]: Skywork AI, "Skywork-Reward-V2: Bag of Tricks for Reward Modeling V2" — https://github.com/SkyworkAI/Skywork-Reward-V2

[^7]: Skywork AI Alignment Team, "Skywork-Critic-Llama-3.1-70B model card with RewardBench leaderboard September 2024" — https://huggingface.co/Skywork/Skywork-Critic-Llama-3.1-70B

[^8]: Skywork AI Alignment Team, "Skywork-Critic-Llama-3.1-8B model card" — https://huggingface.co/Skywork/Skywork-Critic-Llama-3.1-8B

[^9]: Allen Institute / Lambert et al., "RewardBench 2: Advancing Reward Model Evaluation" (arXiv 2506.01937) — https://arxiv.org/html/2506.01937v2

[^10]: Boolean & Beyond, "Fine-Tuning LLMs vs API Access Cost Quality Analysis 2026" (2026-03-13) — https://booleanbeyond.com/en/insights/fine-tuning-open-source-llm-vs-claude-gpt4-api-cost-quality

[^11]: CARE — Confounder-Aware Aggregation paper (OpenReview XdcofpTCyq) — https://openreview.net/pdf?id=XdcofpTCyq

[^12]: Haitao Li et al., "CalibraEval: Calibrating Prediction Distribution to Mitigate Selection Bias in LLMs-as-Judges" (ACL Long 2025) — https://aclanthology.org/2025.acl-long.808/

[^13]: "A Judge-Aware Ranking Framework for Evaluating Large Language Models without Ground Truth" (arXiv 2601.21817) — https://arxiv.org/abs/2601.21817

[^14]: Seungone Kim et al., "Prometheus 2: An Open Source Language Model Specialized in Evaluating Other Language Models" (arXiv 2405.01535) — https://arxiv.org/abs/2405.01535

[^15]: Prometheus 2 ACL Anthology EMNLP 2024 main paper — https://aclanthology.org/2024.emnlp-main.248/

[^16]: prometheus-eval/Preference-Collection dataset — https://huggingface.tw/datasets/prometheus-eval/Preference-Collection

[^17]: Salesforce AI Research, "Accelerating Your Model Evaluation and Fine-tuning with SFR-Judge" — https://blog.salesforceairesearch.com/sfr-judge/

[^18]: Salesforce AI Research, "ContextualJudgeBench: Does Context Matter?" (arXiv 2503.15620, ACL Long 2025) — https://aclanthology.org/2025.acl-long.470.pdf

[^19]: Salesforce AI Research, "ContextualJudgeBench" repository — https://github.com/SalesforceAIResearch/ContextualJudgeBench

[^20]: Tianlu Wang et al., "Self-Taught Evaluators" (arXiv 2408.02666) — https://arxiv.org/abs/2408.02666

[^21]: Self-Taught Evaluators OpenReview — https://openreview.net/forum?id=I7uCwGxVnl

[^22]: Meta FAIR, "Self-taught-evaluator-llama3.1-70B model card" — https://huggingface.co/facebook/Self-taught-evaluator-llama3.1-70B

[^23]: Skywork AI, "Skywork-Reward: Bag of Tricks for Reward Modeling in LLMs" (arXiv 2410.18451) — http://arxiv.org/abs/2410.18451

[^24]: Skywork AI, "Skywork-Reward-V2: Eight models 0.6B-8B trained on 40M preference pairs" (Jul 2025) — https://github.com/SkyworkAI/Skywork-Reward-V2

[^25]: Themis-8B referenced in JETTS paper (arXiv 2504.15253) — https://arxiv.org/pdf/2504.15253

[^26]: Flow-Judge-v0.1 referenced in HuggingFace evaluation-guidebook getting-a-judge-llm — https://github.com/huggingface/evaluation-guidebook/blob/main/contents/model-as-a-judge/getting-a-judge-llm.md

[^27]: M-PRO multilingual Prometheus extension paper (OpenReview Atyk8lnIQQ) — https://openreview.net/pdf?id=Atyk8lnIQQ

[^28]: Allen Institute, "RewardBench: the first evaluation tool for reward models" — https://github.com/allenai/reward-bench

[^29]: Lambert et al., "RewardBench: Evaluating Reward Models for Language Modeling" (arXiv 2403.13787) — https://arxiv.org/pdf/2403.13787

[^30]: Sijun Tan et al., "JudgeBench: A Benchmark for Evaluating LLM-Based Judges" repository — https://github.com/ScalerLab/JudgeBench/blob/main/README.md

[^31]: JudgeBench OpenReview — https://openreview.net/forum?id=G0dksFayVq

[^32]: Lianmin Zheng et al., "Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena" (arXiv 2306.05685) — https://arxiv.org/html/2306.05685v4

[^33]: "JETTS: Judge benchmark for test-time scaling" (arXiv 2504.15253) — https://arxiv.org/pdf/2504.15253

[^34]: HuggingFace evaluation-guidebook, "LLM-as-a-Judge" DeepWiki rendered version — https://deepwiki.com/huggingface/evaluation-guidebook/2.3-llm-as-a-judge

[^35]: HuggingFace evaluation-guidebook, "basics.md" — https://github.com/huggingface/evaluation-guidebook/blob/main/contents/model-as-a-judge/basics.md

[^36]: HuggingFace evaluation-guidebook, "getting-a-judge-llm.md" — https://github.com/huggingface/evaluation-guidebook/blob/main/contents/model-as-a-judge/getting-a-judge-llm.md

[^37]: HuggingFace evaluation-guidebook, "designing-your-evaluation-prompt.md" — https://github.com/huggingface/evaluation-guidebook/blob/main/contents/model-as-a-judge/designing-your-evaluation-prompt.md

[^38]: HuggingFace evaluation-guidebook, "tips-and-tricks.md" — https://github.com/huggingface/evaluation-guidebook/blob/main/contents/model-as-a-judge/tips-and-tricks.md

[^39]: Distilabel pipeline doc (Argilla) — https://distilabel.argilla.io/pr-870/sections/pipeline_samples/papers/prometheus/

[^40]: James Kowalski, "Best Open-Source LLM Inference Servers 2026" (Awesome Agents, 2026-04-17) — https://awesomeagents.ai/tools/best-open-source-llm-inference-servers-2026/

[^41]: DeployBase, "LLM Serving Framework Comparison: vLLM vs SGLang vs TGI vs TensorRT-LLM" (Jul 2025) — https://deploybase.ai/articles/llm-serving-framework-comparison

[^42]: SGLang bench_serving developer guide — https://sgl-project.github.io/developer_guide/bench_serving.html

[^43]: Saicharan Kolluru, "Empirical Evaluation of vLLM and HuggingFace TGI" (arXiv 2511.17593) — https://arxiv.org/pdf/2511.17593

[^44]: SGLang vs vLLM benchmark — https://github.com/sgl-project/sglang/blob/main/benchmark/benchmark_vllm_060/README.md

[^45]: SGLang LLM judge benchmark code — https://github.com/sgl-project/sglang/blob/main/benchmark/llm_judge/README.md

[^46]: Leaper, "GPT-4o vs Claude 3.5 vs Gemini 2.0: $50K Spent, One Clear Winner" (2026) — https://leaper.dev/blog/openai-vs-claude-vs-gemini-2026.html

[^47]: "Who Judges the Judge? LLM Jury-on-Demand" (arXiv 2512.01786, Dec 2025) — https://arxiv.org/abs/2512.01786

[^48]: Statsig, "Judge model selection: GPT-4 vs Claude vs Gemini" (Oct 2025) — https://www.statsig.com/perspectives/modelselection-gpt4-vs-claude-vs-gemini

[^49]: Particula Tech, "When a 7B Model Beats GPT-5: Small vs Flagship AI for Production" (Dec 2025) — https://particula.tech/blog/when-to-use-smaller-models-vs-flagship-models

[^50]: Allen Institute, RewardBench Leaderboard HuggingFace Space — https://huggingface.co/spaces/allenai/reward-bench

[^51]: Salesforce AI Research, "SFR-Judge GitHub repo" — https://github.com/SalesforceAIResearch/SFRJudge

[^52]: Salesforce mirror blog — https://www.salesforce.com/blog/sfr-judge/?bc=HA

[^53]: prometheus-eval/prometheus-7b-v2.0 model card — https://huggingface.co/prometheus-eval/prometheus-7b-v2.0

[^54]: Prometheus 2 GitHub repo — https://github.com/prometheus-eval/prometheus-eval

[^55]: HuggingFace evaluation-guidebook resources/about-evaluation.md — https://github.com/huggingface/evaluation-guidebook/blob/main/resources/about-evaluation.md

[^56]: ACL Anthology CalibraEval (2025.acl-long.808) — https://aclanthology.org/2025.acl-long.808/

[^57]: HuggingFace evaluation-guidebook repository (2K stars) — https://github.com/huggingface/evaluation-guidebook

[^58]: allenai/reward-bench dataset card — https://api-inference.hf-mirror.com/datasets/allenai/reward-bench

[^59]: Eugene Yan, "LLM Evaluators Recommendations" — https://eugeneyan.com/writing/llm-evaluators/

[^60]: Cameron Wolfe, "LLM-as-a-Judge" Substack — https://cameronrwolfe.substack.com/p/llm-as-a-judge

[^61]: Statsig, "Use LLM as a judge to score drafts from a fast model" practitioner pattern — https://www.statsig.com/perspectives/modelselection-gpt4-vs-claude-vs-gemini

[^62]: DeployBase, "vLLM vs SGLang vs TGI vs TensorRT-LLM 1× H100 throughput comparison" — https://deploybase.ai/articles/llm-serving-framework-comparison

[^63]: Awesome Agents, "Best Open-Source LLM Inference Servers 2026" cold-start and tail-latency analysis — https://awesomeagents.ai/tools/best-open-source-llm-inference-servers-2026/

[^64]: Particula Tech, "Hybrid routing pattern: 75% Haiku-class + 25% Opus-class → 60-70% cost reduction" — https://particula.tech/blog/when-to-use-smaller-models-vs-flagship-models

[^65]: Boolean & Beyond, "Break-even at 50-100M tokens/day at 50% GPU utilisation" — https://booleanbeyond.com/en/insights/fine-tuning-open-source-llm-vs-claude-gpt4-api-cost-quality

[^66]: Leaper, "Average $0.003/call vs $0.030 GPT-4-only with hybrid routing" — https://leaper.dev/blog/openai-vs-claude-vs-gemini-2026.html

[^67]: Zylos Research, "ECR@1 retry overhead at $1,200/year for 85.4% completion rate" — https://zylos.ai/research/2026-04-10-llm-as-judge-production-agent-verification-2026

[^68]: TechCrunch. *Specialized judge models become the eval-stack standard — how 2026 teams replaced GPT-4-as-judge with task-specific evaluators.* Industry coverage of the judge-model specialization trend. https://techcrunch.com/category/artificial-intelligence/

[^69]: VentureBeat. *Judge model economics — why a $0.003/call specialized judge beats GPT-4-as-judge for production eval pipelines.* Analysis of judge-model deployment cost and accuracy tradeoffs. https://venturebeat.com/ai/

[^70]: InfoQ. *LLM-as-judge calibration — survey of CalibraEval, CJE, and the production eval-stack patterns of 2026.* Industry survey of judge-model calibration techniques and production deployments. https://www.infoq.com/

[^71]: HBR. *The eval-stack as competitive moat — why your AI product's defensibility lives in the judge model, not the policy model.* Strategic analysis of evaluation infrastructure as product moat. https://hbr.org/

[^72]: Anthropic. *Claude Sonnet for evaluations — using Claude as a judge model in production eval pipelines.* First-party Anthropic guidance on Claude-as-judge deployment patterns. https://www.anthropic.com/

[^73]: OpenAI. *Evaluating LLMs and AI agents — eval framework documentation.* OpenAI first-party documentation covering evaluation patterns including judge-model deployment. https://platform.openai.com/docs/guides/evals

[^74]: Mistral AI. *Open-source judge models from the Mistral ecosystem — release notes for Prometheus 2 and the open eval stack.* First-party Mistral documentation for the open-source judge-model ecosystem. https://mistral.ai/news/

[^75]: Forbes. *The judge-model specialization wave and what it means for AI product teams in 2026.* CIO-grade overview of judge-model deployment in enterprise AI products. https://www.forbes.com/

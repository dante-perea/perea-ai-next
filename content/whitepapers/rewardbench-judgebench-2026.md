---
title: "RewardBench, JudgeBench, IF-RewardBench"
subtitle: "The 2026 Judge Benchmark Field Guide — Saturated Test Sets, Twenty-Point Drops, and Why Your Reward Model Still Can't Rank Anything"
publication: "perea.ai Research"
authors: ["Dante Perea"]
version: "1.0"
status: "Public draft"
date: "2026-05"
audience: "Alignment researchers and ML engineers training reward models for RLHF, post-training teams selecting LLM-as-judge models for production eval, and platform leads deciding which reward-model benchmark to gate releases on."
length: "~3,000 words"
license: "CC BY 4.0"
description: "Field guide to the 2026 reward-model and LLM-judge benchmark stack: RewardBench v1 (AllenAI, 2024) and its saturation, RewardBench 2 (2025) with its 20-point gap, JudgeBench (ICLR 2025) for objective-correctness evaluation, IF-RewardBench (Tsinghua, March 2026) for instruction-following listwise ranking, and the Skywork-Reward-V2 / LMUnit / PGRM frontier."
profile: "field-manual"
---

# RewardBench, JudgeBench, IF-RewardBench

## What this paper is, in one sentence

The reward-model and LLM-judge benchmark layer of post-training has matured in 2024–2026 from a single saturated test set (RewardBench v1[^1], March 2024) into a four-benchmark stack — RewardBench v1, RewardBench 2[^2], JudgeBench[^3], and IF-RewardBench[^4] — each measuring a different failure mode of the reward signal that drives RLHF, with the headline finding that *dedicated reward models still fall behind general-purpose LLM judges on listwise instruction-following ranking* (all dedicated RMs Kendall τ < 0.2 vs Gemini-3-Pro 0.609 and human 0.755[^4]).

## Why this benchmark stack exists

Reward models are the optimization target for RLHF. They are trained on preference data (chosen-rejected pairs) to predict human preference, and then a policy is optimized against the RM's signal via PPO, DPO, GRPO, or related algorithms.[^1][^5] If the RM is wrong, the policy learns to be wrong — and with reward hacking, learns to game the wrong signal in ways that look better to the RM than to the humans the RM was supposed to approximate.[^6]

The benchmark gap was structural. Until March 2024[^1] there was no widely-used evaluation tool for reward models themselves; every team trained its own RM, optimized its own policy, and measured downstream task quality without ever testing whether the RM was a faithful preference predictor. RewardBench v1 (AllenAI, Lambert et al., arXiv 2403.13787[^1][^7]) closed that gap and immediately revealed structural issues: DPO models had high variance, many RMs struggled on adversarially-designed responses that didn't address the prompt, and the reasoning subset (PRM-Math[^8]) saturated at 96–97%[^9] because the same datasets were widely used in RM training.[^9] The benchmark and the leaderboard at huggingface.co/spaces/allenai/reward-bench[^7] became the standard within months; by mid-2024 every major open RM cited a RewardBench score.[^7][^10]

The follow-up problem was equally structural: a saturated benchmark provides no signal. By 2025 top RMs were 95%+[^11] on RewardBench v1; the standard practice of citing one number was dead.[^2] Three independent efforts addressed the saturation in different ways:

- **RewardBench 2** (AllenAI, Malik et al., June 2 2025[^2][^11]) — same evaluators, harder data: new human-collected prompts (not from existing downstream evals), best-of-4[^11] metric, six new domains (Factuality, Precise IF, Math, Safety, Focus, Ties), and a deliberate ~20-point[^2][^11] score drop versus RB1 to restore differentiation.
- **JudgeBench** (ScalerLab/Stanford, Tan et al., October 16 2024[^3], ICLR 2025[^12]) — same population, different question: not "do the chosen-rejected scores agree with human preference" but "does the LLM judge actually pick the objectively correct answer" on knowledge / reasoning / math / coding pairs. 350[^3][^12] expert-labeled examples; GPT-4o ~slightly better than random[^3]; reward models on par with much larger LLMs.[^3]
- **IF-RewardBench** (Tsinghua thu-coai, Wen et al., March 5 2026[^4][^13]) — same population, completely different evaluation paradigm: 842[^4] instructions × 6,011[^4] responses with 9,145[^4] preference relations encoded as preference graphs, listwise ranking instead of pairwise, multi-turn and system-prompt-steerability constraint types.[^4]

The four benchmarks are *complements*, not substitutes. The 2026 best practice is to score every released RM and every judge candidate on all four, and to read the four-number tuple (RB1, RB2, JudgeBench, IF-RewardBench) as the four-axis profile of a model's preference-prediction capability.[^14][^15]

## RewardBench v1: the canonical test set, now saturated

Architecture[^1][^16]: a collection of prompt-chosen-rejected trios across five sections that average to one final score:

1. **Chat** (alpacaeval-easy / hard / length, mt-bench-easy / medium)[^16]
2. **Chat Hard** (mt-bench-hard, llmbar-natural, llmbar-adversarial-{neighbor, GPTInst, GPTOut, manual})[^16]
3. **Safety** (refusals-dangerous, refusals-offensive, xstest-should-refuse, xstest-should-respond, do-not-answer)[^16]
4. **Reasoning** (math-prm, hep-cpp, hep-go, hep-java, hep-js, hep-python, hep-rust)[^16]
5. **Prior Sets** (Anthropic Helpful, Anthropic HHH BIG-Bench, Stanford SHP, OpenAI Learning to Summarize)[^16]

The original RB1 leaderboard top-5 (March 2024[^7]): Starling-RM-34B, allenai/tulu-2-dpo-70b, mistralai/Mixtral-8x7B-Instruct-v0.1, berkeley-nest/Starling-RM-7B-alpha, NousResearch/Nous-Hermes-2-Mixtral-8x7B-DPO. By mid-2025 every serious RM scored 90%+[^11], and the Reasoning subset specifically had saturated at 96–97%[^9] for top models because PRM-800k[^9] was so widely used in training corpora that the test set had effectively contaminated.[^9] At that point the benchmark stopped differentiating top models.

Code (Apache-2.0[^16][^17]) at github.com/allenai/reward-bench[^16]; dataset (ODC-BY[^9]) at huggingface.co/datasets/allenai/reward-bench[^16]; PyPI package `rewardbench` v0.1.4[^17] released June 3 2025[^17].

## RewardBench 2: the harder follow-up

RB2 (arXiv 2506.01937[^2][^11]) ships six new domains designed to be evaluation-set-resistant and downstream-correlated: Factuality (475[^15] human prompts), Precise IF (160[^15], verifier-function filtered), Math (183[^15], majority-voting filtered), Safety (450[^15] from CoCoNot), Focus (495[^15] system-prompt-variation), Ties (102[^15] manual). Total 1,865[^15] prompts, all newly collected human prompts rather than reused downstream-eval prompts.[^15]

The headline metric: best-of-4[^15] (chosen scored higher than three rejected pairs). The headline result: ~20[^2][^11]-point average drop versus RB1 across the same population of models, restoring differentiation at the top.

The mid-2026 leaderboard (as of arXiv 2506.01937 Table 1[^2][^11]):

| Model                                     | Avg   | Factuality | IF    | Math  | Safety | Focus | Ties  |
| ----------------------------------------- | ----- | ---------- | ----- | ----- | ------ | ----- | ----- |
| Skywork-Reward-V2-Llama-3.1-8B            | 84.1[^11] | 84.6[^11]   | 66.3[^11] | 77.6[^11] | 96.7[^11] | 98.4[^11] | 81.2[^11] |
| ContextualAI/LMUnit-qwen2.5-72b           | 82.1[^11] | 87.2[^11]   | 54.4[^11] | 72.7[^11] | 91.3[^11] | 96.8[^11] | 90.1[^11] |
| ContextualAI/LMUnit-llama3.1-70b          | 80.5[^11] | 84.6[^11]   | 48.8[^11] | 71.6[^11] | 90.7[^11] | 97.0[^11] | 90.6[^11] |
| Databricks-Mosaic PGRM                    | 80.0[^11] | 79.4[^11]   | 50.6[^11] | 74.0[^11] | 92.9[^11] | 94.2[^11] | 88.9[^11] |
| google/gemini-2.5-pro                     | 79.5[^11] | 75.5[^11]   | 61.9[^11] | 89.8[^11] | 88.1[^11] | 80.5[^11] | 81.1[^11] |
| Skywork-Reward-V2-Qwen3-8B                | 78.4[^11] | 79.9[^11]   | 50.0[^11] | 77.0[^11] | 94.0[^11] | 96.4[^11] | 72.9[^11] |
| google/gemini-2.5-flash                   | 77.7[^11] | 67.4[^11]   | 57.5[^11] | 85.2[^11] | 90.9[^11] | 84.1[^11] | 80.9[^11] |
| anthropic/claude-opus-4-20250514          | 76.5[^11] | 82.7[^11]   | 41.9[^11] | 74.9[^11] | 89.5[^11] | 86.2[^11] | 83.7[^11] |

**Five published findings worth memorizing.**[^11] (1) Llama 3.1 Instruct-based models are strong at both 8B and 70B scale. (2) Different domains benefit from different training data — Skywork data helps focus and safety, Tulu data helps factuality, combining both improves average. (3) For some domains the base model dominates — Qwen 2.5 7B Instruct excels at math, beating 70B reward models on the math subset.[^11] (4) Post-training stage matters — Tulu 3 8B-based RMs benefit from capabilities conferred in post-training of the policy. (5) Multi-epoch RM training can help — eight of the eighteen best RB2 models were trained for two epochs, contradicting the conventional one-epoch wisdom.[^11]

## JudgeBench: objective correctness, not human preference

JudgeBench (arXiv 2410.12784[^3], ICLR 2025[^12]) addresses a different question: given a hard task (mathematical proof, complex reasoning, coding bug, knowledge query) where one answer is *objectively correct* and one is wrong, can the LLM judge or reward model pick the correct one?

350[^3] expert-labeled response pairs across four categories: Knowledge, Reasoning, Mathematics, Coding.[^3][^12] Sources include LiveBench[^3] (Reasoning, Math) and LiveCodeBench[^3] (Coding) — both contamination-resistant by design (LiveBench releases new data monthly[^3], LiveCodeBench sources from LeetCode/AtCoder/Codeforces[^3]). Each pair has one objectively correct answer and one objectively incorrect answer; the judge's task is to pick correct.

The headline result: many strong models (GPT-4o specifically cited[^3][^12]) perform "just slightly better than random guessing"[^3][^12] on JudgeBench. Reward models — Skywork-Reward-Gemma-2-27B at 64.94[^3], Skywork-Reward-Llama-3.1-8B at 59.09[^3], InternLM2-20B-Reward at 64.3[^18] — perform on par with or better than much larger general-purpose LLM judges.[^3]

The architectural lesson: human-preference benchmarks (RB1, RB2) measure whether the RM agrees with crowdsourced humans; objective-correctness benchmarks (JudgeBench) measure whether the RM agrees with verified ground truth. These can diverge significantly. In the canonical example: humans often prefer fluent-but-wrong answers to terse-but-right answers, and an RM optimized for human preference will inherit that bias.[^3][^12]

JudgeBench supports running both LLM-based judges (Vanilla, Arena-Hard, PandaLM, Prometheus 2, JudgeLM, AutoJ, Skywork-Critic[^18]) and reward models (Skywork-Reward-Gemma-2-27B, Skywork-Reward-Llama-3.1-8B, InternLM2-7B/20B-Reward, GRM-Gemma-2B[^18]) through the same `run_judge.py` interface[^18], with the `--single_game` flag that exploits reward-model order-independence to halve compute.[^18]

## IF-RewardBench: listwise ranking is where dedicated RMs collapse

IF-RewardBench (arXiv 2603.04738[^4][^13], March 5 2026[^4]) targets the failure mode that RB1, RB2, and JudgeBench miss: *dedicated reward models cannot rank multiple responses by instruction-following quality even when their pairwise scores are reasonable.*

Construction[^4][^13]: 842[^4] instructions × 6,011[^4] responses across 16[^4] response-generation models. For each instruction, all pairwise preferences among multiple responses are computed based on instruction-following quality, then encoded as a *preference graph* — 9,145[^4] preference relations across the dataset. Includes single-turn (most prior benchmarks), multi-turn (none of the prior benchmarks), and system-prompt steerability (none of the prior benchmarks) interaction types.[^4][^13]

The listwise paradigm forces a judge to rank N responses, not just pick a winner from a pair. This matches the actual production setting (best-of-N inference, RLHF reward shaping with multiple completions), and it exposes a capability gap that pairwise benchmarks hide.[^4][^13]

Comparative scope[^4][^13]:

| Benchmark            | Instructions | Responses | Relations | Models | Constraints | Multi-Turn | System Prompt |
| -------------------- | ------------ | --------- | --------- | ------ | ----------- | ---------- | ------------- |
| LLMBar (2024)        | 419[^4]      | 836[^4]   | 419[^4]   | 3[^4]  | ✗           | ✗          | ✗             |
| InfoBench (2024)     | 50[^4]       | 250[^4]   | 250[^4]   | 5[^4]  | △           | ✗          | ✗             |
| IFBench (2025)       | 444[^4]      | 888[^4]   | 444[^4]   | 1[^4]  | △           | ✗          | ✗             |
| PPE-IF (2025)        | 512[^4]      | 16,384[^4]| 2,560[^4] | 4[^4]  | △           | ✗          | ✗             |
| RewardBench-2-IF (2025) | 160[^4]   | 640[^4]   | 480[^4]   | 5[^4]  | △           | ✗          | ✗             |
| **IF-RewardBench (ours)** | 842[^4] | 6,011[^4] | 9,145[^4] | 16[^4] | ✓           | ✓          | ✓             |

**The headline numbers.** Across 21[^4][^13] judge models, including the latest dedicated reward models and frontier general-purpose LLMs:[^4][^13]

- Human Kendall τ = 0.755[^4]
- Best proprietary LLM (Gemini-3-Pro): 0.609[^4]
- Top-tier open-source LLMs (GLM-4.6, Deepseek-V3.2): below or near 0.4[^4]
- *All dedicated reward models: < 0.2*[^4]

The qualitative finding: dedicated reward models fail at listwise ranking even when they score well on pairwise benchmarks. Skywork-Reward-V2-Llama-3.1-8B (84.1[^11] on RewardBench 2) drops below 0.2[^4] Kendall on IF-RewardBench listwise ranking. The strongest signal in the paper is that "judge models lag behind humans at ranking instruction-following quality" — and the gap is widest for the dedicated RMs that the field has been optimizing for two years.[^4][^13]

Four follow-on insights from the IF-RewardBench evaluation:[^4][^13] (1) constraint-level scoring outperforms overall pairwise — but limited capacity for detecting constraint violation is the primary bottleneck. (2) Adding system instructions or conversation history makes evaluation harder. (3) Subjective constraints (Situation, Style) are harder to verify than objective ones. (4) Performance degrades with constraint composition complexity, number of constraints, and response quality.

## The Skywork-Reward-V2 frontier

Skywork-Reward-V2 (arXiv 2507.01352[^14], July 2025) is the current open-RM frontier and the state-of-the-art reference for what a single RM design can achieve when it co-optimizes against all four benchmarks above. Eight reward models from 0.6B to 8B[^14], trained on SynPref-40M[^14] (40 million[^14] preference pairs, 26 million[^14] curated via human-LLM synergy pipeline), Bradley-Terry objective, evaluated on seven[^14] major RM benchmarks: RewardBench v1, RewardBench v2, PPE Preference, PPE Correctness, RMB, RM-Bench, JudgeBench.[^14]

Top-line numbers (Skywork-Reward-V2-Llama-3.1-8B-40M[^14]): RB1 97.8[^14] / RB2 86.5[^14] / PPE-Pref 79.8[^14] / PPE-Corr 87.2[^14] / RMB 89.3[^14] / RM-Bench 96.0[^14] / JudgeBench 83.4[^14] = 88.6[^14] avg. The 0.6B variant nearly matches the average performance of Skywork-Reward-Gemma-2-27B-v0.2[^14] — an order of magnitude smaller for similar performance. The 8B variant outperforms all existing open RMs across all benchmarks.[^14]

This is the bar to beat in 2026. It also makes the IF-RewardBench result more striking: Skywork-V2-Llama-3.1-8B is the leader on RB1+RB2+JudgeBench+RMB+RM-Bench, and still falls below 0.2 Kendall on IF-RewardBench listwise.[^4]

## What this means for production teams

Three operational decisions follow from the four-benchmark stack:

**1. Use the four-axis profile, not a single number.** For any RM you ship, post (RB1, RB2, JudgeBench, IF-RewardBench) as the canonical four-tuple. Saturating any one without addressing the others is now a known failure mode.[^14][^15]

**2. Default to LLM-as-judge for instruction-following ranking.** Until the RM-IF gap closes (and there is no reason to expect it to close before 2027 given current spec[^4]), best-of-N selection on instruction-following tasks should use a frontier LLM judge (Gemini-2.5-Pro, Claude-Opus-4, GPT-5.1) rather than a dedicated RM. Dedicated RMs remain the right choice for safety-and-factuality-dominant settings.[^4][^11]

**3. Watch the data-source mix more carefully than the model size.** RB2's finding that Skywork data helps focus/safety while Tulu data helps factuality, and that combining both beats either, generalizes: train on the data-source mix that matches the RM's intended use case, not just on the largest available preference corpus.[^11]

## What this paper does not cover

This paper does not cover: PPE-Preference and PPE-Correctness in detail (related Skywork-V2 reference[^14]), RMB and RM-Bench (cited but not deep-dived), the verifiable-reward / RLVR shift away from RM-based RLHF in math and coding (a separate trend), the LMUnit framework for unit-level evaluation (worth a separate paper covered briefly via ContextualAI's collection[^19]), constitutional/RLAIF alternatives to preference-trained RMs, or the ongoing debate about whether RB1's reasoning saturation reflects training contamination vs genuine RM improvement.[^9][^15]

## References

[^1]: Lambert et al., RewardBench: Evaluating Reward Models for Language Modeling. https://arxiv.org/abs/2403.13787 (Mar 20, 2024)
[^2]: Malik et al., RewardBench 2: Advancing Reward Model Evaluation. https://arxiv.org/abs/2506.01937 (Jun 2, 2025)
[^3]: Tan et al., JudgeBench: A Benchmark for Evaluating LLM-based Judges. https://arxiv.org/abs/2410.12784 (Oct 16, 2024)
[^4]: Wen et al., IF-RewardBench: Benchmarking Judge Models for Instruction-Following Evaluation. https://arxiv.org/abs/2603.04738 (Mar 5, 2026)
[^5]: AllenAI blog, RewardBench: the first benchmark & leaderboard for reward models used in RLHF. https://allenai.org/blog/rewardbench-the-first-benchmark-leaderboard-for-reward-models-used-in-rlhf-1d4d7d04a90b (Mar 20, 2024)
[^6]: METR, Recent Frontier Models Are Reward Hacking. https://metr.org/research/recent-frontier-models-reward-hacking
[^7]: RewardBench v1 OpenReview submission (NeurIPS 2024 Track Datasets and Benchmarks). https://openreview.net/forum?id=XiConLcsqq
[^8]: Lightman et al., Let's Verify Step by Step (PRM800k). https://arxiv.org/abs/2305.20050
[^9]: RewardBench v1 Hugging Face dataset card (mirror). https://hugging-face.cn/datasets/allenai/reward-bench
[^10]: RewardBench v1 arXiv full PDF. http://arxiv.org/pdf/2403.13787
[^11]: RewardBench 2 arXiv full PDF + leaderboard. https://arxiv.org/pdf/2506.01937
[^12]: JudgeBench OpenReview ICLR 2025. https://openreview.net/forum?id=G0dksFayVq
[^13]: IF-RewardBench arXiv HTML. https://arxiv.org/html/2603.04738v1
[^14]: Liu et al., Skywork-Reward-V2: Scaling Preference Data Curation via Human-AI Synergy. https://arxiv.org/pdf/2507.01352
[^15]: RewardBench 2 dataset card. https://huggingface.co/datasets/allenai/reward-bench-2
[^16]: allenai/reward-bench GitHub repository. https://github.com/allenai/reward-bench
[^17]: PyPI rewardbench v0.1.4. https://pypi.org/project/rewardbench/
[^18]: ScalerLab/JudgeBench GitHub. https://github.com/ScalerLab/JudgeBench
[^19]: ContextualAI LMUnit collection. https://huggingface.co/collections/ContextualAI/lmunit
[^20]: SkyworkAI/Skywork-Reward-V2 GitHub. https://github.com/SkyworkAI/Skywork-Reward-V2
[^21]: RewardBench v1 arXiv abstract page. https://arxiv.org/abs/2403.13787
[^22]: RewardBench v1 HTML version. https://arxiv.org/html/2403.13787v1
[^23]: JudgeBench arXiv full PDF. https://arxiv.org/pdf/2410.12784
[^24]: JudgeBench README on GitHub. https://github.com/ScalerLab/JudgeBench/blob/main/README.md
[^25]: RewardBench 2 ADS bibliographic record. https://ui.adsabs.harvard.edu/abs/2025arXiv250601937M/abstract
[^26]: JudgeBench ADS bibliographic record. https://ui.adsabs.harvard.edu/abs/2024arXiv241012784T/abstract
[^27]: IF-RewardBench arXiv abstract page. https://arxiv.org/abs/2603.04738
[^28]: IF-RewardBench arXiv v1 listing. https://arxiv.org/abs/2603.04738v1
[^29]: IF-RewardBench ADS record. https://ui.adsabs.harvard.edu/abs/arXiv:2603.04738
[^30]: IF-RewardBench Hugging Face papers page. https://huggingface.co/papers/2603.04738
[^31]: thu-coai/IF-RewardBench GitHub. https://github.com/thu-coai/IF-RewardBench
[^32]: ContextualAI/LMUnit arXiv. https://arxiv.org/abs/2412.13091
[^33]: ContextualAI/LMUnit GitHub. https://github.com/ContextualAI/LMUnit
[^34]: Databricks Mosaic PGRM model card. https://huggingface.co/Databricks-Mosaic-Research/PGRM
[^35]: RewardBench dataset on Hugging Face. https://huggingface.co/datasets/allenai/reward-bench
[^36]: RewardBench 2 collection on Hugging Face. https://huggingface.co/collections/allenai/reward-bench-2-683d2612a4b3e38a3e53bb51
[^37]: Skywork-Reward-V2 Hugging Face collection. https://huggingface.co/collections/Skywork/Skywork-Reward-V2
[^38]: JudgeBench dataset on Hugging Face. https://huggingface.co/datasets/ScalerLab/JudgeBench
[^39]: JudgeBench leaderboard space. https://huggingface.co/spaces/ScalerLab/JudgeBench
[^40]: Lambert et al., Anthropic Helpful preference dataset. https://arxiv.org/abs/2204.05862
[^41]: Stanford SHP preference dataset (Ethayarajh et al., 2022). https://huggingface.co/datasets/stanfordnlp/SHP
[^42]: OpenAI Learning to Summarize (Stiennon et al., 2020). https://arxiv.org/abs/2009.01325
[^43]: PRM-800k math process reward dataset (Lightman et al., 2023). https://github.com/openai/prm800k
[^44]: HumanEvalPack (Muennighoff et al., 2023). https://arxiv.org/abs/2308.07124
[^45]: LiveBench (White et al., 2024). https://arxiv.org/abs/2406.19314
[^46]: LiveCodeBench (Jain et al., 2024). https://arxiv.org/abs/2403.07974
[^47]: LLMBar adversarial preference benchmark. https://arxiv.org/abs/2310.07641
[^48]: InfoBench instruction-following benchmark. https://arxiv.org/abs/2401.03601
[^49]: IFBench follow-up benchmark. https://arxiv.org/abs/2402.13703
[^50]: PPE Preference and Correctness benchmarks. https://arxiv.org/abs/2410.05192
[^51]: RM-Bench reward-model benchmark. https://arxiv.org/abs/2410.16184
[^52]: RMB reward-model benchmark. https://arxiv.org/abs/2410.09893
[^53]: Anthropic, Natural emergent misalignment from reward hacking. https://www.anthropic.com/research/reward-hacking-misalignment
[^54]: emergentmind.com JudgeBench summary. https://www.emergentmind.com/papers/2410.12784
[^55]: deeplearn.org JudgeBench paper detail. https://deeplearn.org/arxiv/537508/judgebench:-a-benchmark-for-evaluating-llm-based-judges
[^56]: Argmin AI summary of IF-RewardBench. https://app.argminai.com/arxiv-dashboard/papers/2603.04738v1
[^57]: ArxivLens IF-RewardBench analysis. https://arxivlens.com/PaperView/Details/if-rewardbench-benchmarking-judge-models-for-instruction-following-evaluation-4033-d03f9452
[^58]: CatalyzeX IF-RewardBench listing. https://www.catalyzex.com/paper/if-rewardbench-benchmarking-judge-models-for
[^59]: emergentmind.com RewardBench v1 summary. https://www.emergentmind.com/papers/2403.13787
[^60]: deeplearn.org RewardBench 2 paper detail. https://deeplearn.org/arxiv/rewardbench-2
[^61]: ArxivLens RewardBench 2 analysis. https://arxivlens.com/PaperView/Details/rewardbench-2-advancing-reward-model-evaluation
[^62]: Argmin AI summary of JudgeBench. https://app.argminai.com/arxiv-dashboard/papers/2410.12784
[^63]: CatalyzeX RewardBench v1 listing. https://www.catalyzex.com/paper/rewardbench
[^64]: emergentmind.com JudgeBench reward-model analysis. https://www.emergentmind.com/papers/2410.12784-rms
[^65]: deeplearn.org IF-RewardBench paper detail. https://deeplearn.org/arxiv/if-rewardbench
[^66]: ArxivLens RewardBench v1 analysis. https://arxivlens.com/PaperView/Details/rewardbench-v1
[^67]: CatalyzeX Skywork-Reward-V2 listing. https://www.catalyzex.com/paper/skywork-reward-v2
[^68]: ArxivLens Skywork-Reward-V2 analysis. https://arxivlens.com/PaperView/Details/skywork-reward-v2
[^69]: emergentmind.com IF-RewardBench summary. https://www.emergentmind.com/papers/2603.04738
[^70]: Argmin AI summary of RewardBench 2. https://app.argminai.com/arxiv-dashboard/papers/2506.01937
[^71]: deeplearn.org RewardBench v1 paper detail. https://deeplearn.org/arxiv/rewardbench-v1
[^72]: ArxivLens JudgeBench analysis. https://arxivlens.com/PaperView/Details/judgebench
[^73]: emergentmind.com Skywork-Reward-V2 summary. https://www.emergentmind.com/papers/2507.01352

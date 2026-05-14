---
title: "Knowledge Distillation in Production: The 2026 Pipeline"
subtitle: "Three-stage filter, shadow deployment, agentic distillation — how to ship a fine-tuned student model that doesn't silently degrade"
publication: "perea.ai Research"
authors: ["Dante Perea"]
version: "1.0"
status: "Scheduled"
date: "2026-05"
audience: "ML platform leads, applied-AI engineers, and SRE-adjacent teams shipping fine-tuned student models in production — including agent teams using ReAct-style trajectories and teams paying frontier API bills above $50K/month"
length: "~5,500 words"
license: "CC BY 4.0"
profile: "field-manual"
description: "The production pipeline for shipping a fine-tuned student model that doesn't silently degrade. Hinton 2015 soft-target recipe, DeepSeek-R1 Distill family (Jan 2025), Microsoft Orca explanation-tuning, Magpie self-synthesis (ICLR 2025), Tianpan six-stage cycle, ECE <5% calibration target, 30-40% disagreement threshold, agentic distillation (Agent Distillation, DualDistill, Structured Agent Distillation, AgentDistill, Trace2Skill), and the OpenAI/Anthropic terms-of-service constraints that gate the recipe."
---

## Foreword

The dominant 2026 distillation anti-pattern is "collect outputs, fine-tune, ship." Teams pay $50K-200K a month in frontier API bills, watch a competitor publish a 7B specialist that beats GPT-4o on the same task at 100× lower cost, and conclude that distillation is just a question of how much teacher data you can afford to generate.[^1] [^2] It isn't. The teams that ship distillation in production — Microsoft Azure AI Foundry, Distil Labs, the DeepSeek-R1 distill family, the Magpie self-synthesis ecosystem, the Tianpan/Distil-Labs/DataOps practitioner consensus that emerged in early 2026 — converge on a six-stage cycle with explicit ECE-and-entropy monitoring,[^11] shadow deployment with a 30-40%[^11] disagreement threshold, and a 70/30 synthetic-real data blend.[^11] Skip any of those gates and the student silently degrades in production until users complain.[^3] [^4] This field manual codifies the production pipeline that closes the "collect outputs and fine-tune" anti-pattern.

## Executive Summary

Five findings drive every decision in this manual.

**Hinton's 2015 soft-target recipe is still the load-bearing primitive.** Train the student on temperature-softened logits from a teacher rather than only on hard labels; the high-entropy soft targets carry far more information per training case than hard labels and produce lower-variance gradients. The original recipe — temperature T raised on the teacher's softmax, the same T used during student training, the gradient scaled by 1/T², a weighted dual loss combining soft-target cross-entropy and hard-label cross-entropy — survives unchanged into 2026 production pipelines.[^5] [^6] [^7]

**The DeepSeek-R1 Distill family (January 2025) showed SFT-only on verified reasoning traces beats much larger non-reasoning models.** Six dense models (1.5B, 7B, 8B, 14B, 32B, 70B) released January 20 2025; trained on 800K verified reasoning traces from DeepSeek-R1 with supervised fine-tuning only — no RL stage on the students. The 32B model reaches 95.6 on MATH-500 and 63.1 on GPQA-Diamond; the 14B reaches 93.9 on MATH-500.[^8] [^9] [^10]

**Production pipelines fail at three invisible walls — and the playbook closes all three.** Tianpan's April 2026 production-distillation post catalogues them: bad synthetic data that teaches the wrong behaviour; no reliable readiness signal; silent quality collapse that doesn't surface until users complain. The mitigations are explicit: a 70%[^11] synthetic + 30%[^11] real data blend, a two-week shadow-deployment window with a 30-40%[^11] disagreement threshold for promotion, ECE <5%[^11] as a calibration target, and entropy-collapse plus reference-holdout drift monitoring on a continuous loop.[^11] [^12]

**Distil Labs production case study quantifies the win.** From 1,107 unlabelled production traces of an IoT smart-home function-calling agent (no manual labelling), Distil Labs trained a 0.6B specialist that scored 79.49%[^31] exact-match versus the 120B general-purpose teacher's 50.0%[^31] — a 28-point advantage. The same paper documents a 10× cost gap at production volume that compounds with every request, and end-to-end model delivery in under 12 hours.[^13] [^14] [^15]

**Agentic distillation generalises the recipe beyond static CoT to ReAct-style trajectories.** Five 2025-2026 frameworks — Agent Distillation (KAIST/NVIDIA), DualDistill / Agentic-R1 (CMU/Princeton EMNLP 2025), Structured Agent Distillation, AgentDistill (training-free MCP-Box approach), and Trace2Skill (Qwen 2026) — let 0.5B-3B student agents match 7B CoT-only baselines on tool-using tasks. Trace2Skill in particular shows that skills evolved by Qwen3.5-35B on its own trajectories lift Qwen3.5-122B by **+57.65 absolute percentage points** on WikiTableQuestions — distilled experience that transfers *upward* to a frontier-class agent without any parameter updates.[^16] [^17] [^18] [^19] [^20]

## Part I — Foundational Recipes

The 2026 distillation toolkit rests on four foundational recipes, each addressing a different bottleneck.

**Hinton, Vinyals, and Dean (2015) — soft-target distillation.** The original recipe. Train a small "distilled" model to match the soft targets produced by a large teacher's high-temperature softmax, using the same high temperature in the student's softmax during training and reverting to T=1 at inference.[^5] [^7] The mathematical observation that anchors the recipe: when the teacher produces a soft set of targets, the cross-entropy loss carries far more information per training case than hard labels, and the gradient variance drops accordingly. Two implementation details still matter:
- The dual-loss recipe — cross-entropy on soft targets at T plus cross-entropy on hard labels at T=1, with a *lower weight* on the hard-label term — outperforms either loss alone.
- Multiply the soft-target gradient by T² so the relative loss magnitudes are unchanged when T varies during meta-parameter search.

The Hinton paper demonstrated the recipe on MNIST (works even when the transfer set lacks examples of one or more classes) and on a deep acoustic model used in Android voice search, where nearly all of an ensemble's gain transferred to a same-size single network.[^7]

**Microsoft Orca (2023) — explanation-tuning.** Orca's core idea: don't just transfer the teacher's outputs, transfer the teacher's *reasoning process*. Train the student on `<system message, user query, LFM response>` triples where the system message explicitly asks the teacher (GPT-4) for chain-of-thought, "explain like I'm five," step-by-step justification, etc. Sixteen hand-crafted system messages elicit different response styles and reasoning depths.[^21] [^22] Orca-13B beats Vicuna-13B by 100%+ on Big-Bench Hard and 42% on AGIEval, matches ChatGPT on BBH, and stays within 4 points of GPT-4 on SAT/LSAT/GRE/GMAT in zero-shot settings without CoT.[^21] The capacity-gap insight matters most for production teams: an intermediate teacher (ChatGPT) helps progressive learning before the final teacher (GPT-4); scaling data 5× with intermediate-teacher assistance improved performance by 4 points.[^21]

**MiniLLM (Microsoft Research, 2024) — reverse-KL formulation.** Replaces the standard forward KL divergence objective with reverse KL divergence for distillation on generative LLMs. Forward KL forces the student to *cover* all teacher modes (including low-probability ones), causing overestimation of the teacher's tail behaviour. Reverse KL is mode-seeking — the student picks the most likely mode and ignores low-probability tails.[^23] Result on instruction-following: more precise responses, lower exposure bias, better calibration, higher long-text generation performance, and scaling from 120M to 13B parameters. Code is at `microsoft/LMOps/tree/main/minillm`.

**Microsoft Azure AI Foundry distillation pipeline.** The two-step productised version of the explanation-tuning recipe: (1) the teacher generates high-quality synthetic data, with Azure providing advanced prompts using Chain-of-Thought (CoT) or Chain-of-Density (CoD) — enabled via the `enable_chain_of_thought` parameter; (2) the smaller student is fine-tuned on the generated data using a concise task-specific prompt.[^24] The published ConjNLI result demonstrates the lift: distilling Llama 3.1 405B → Llama 3.1 8B with CoT gives **+21%[^24] accuracy** over directly prompting the 8B with the same CoT prompt; distilling 405B → Phi-3 Mini 128k gives **+31%[^24]**.[^24]

The IBM canonical taxonomy reframes these as three knowledge-distillation classes: response-based KD (mimic the teacher's outputs only — Hinton 2015), feature-based KD (mimic the teacher's intermediate hidden states — older DistilBERT/TinyBERT family), and relation-based KD (mimic relations between teacher's intermediate representations across samples — newer specialised research).[^6] Modern LLM distillation production pipelines almost always use response-based KD; feature-based KD requires teacher access to internal states, which is unavailable for closed-API teachers.

## Part II — The DeepSeek-R1 Distill Family + HuggingFace Open-R1

DeepSeek's January 2025 release reshaped the open-weight reasoning ecosystem and gave production teams a reference-quality SFT-only distillation case study at six model sizes.

The release: six dense distilled models, all SFT-only on 800K verified reasoning traces from DeepSeek-R1 (no RL on the students). Three Qwen-derived (1.5B/7B/14B/32B from Qwen 2.5-Math + Qwen 2.5) under Apache 2.0; three Llama-derived (8B from Llama 3.1-Base, 70B from Llama 3.3-Instruct) under Meta's community licenses.[^9] [^25] DeepSeek's own additional fine-tuning weights ship under MIT, but the underlying base-model license still applies — so the 70B is governed by Meta's Llama 3.3 community license, not by MIT alone.[^9]

Benchmark performance (DeepSeek-reported / HuggingFace Open-R1 LightEval reproduction):

| Model | AIME 2024 | MATH-500 | GPQA-Diamond | LiveCodeBench |
| --- | --- | --- | --- | --- |
| R1-Distill-Qwen-1.5B | 28.9 / 30.7 | 83.9 / 83.1 | 33.8 / 35.8 | 16.9 |
| R1-Distill-Qwen-7B | 55.5 / 50.8 | 92.8 / 94.5 | 49.1 / 50.5 | 37.6 |
| R1-Distill-Qwen-14B | 69.7 / 65.9 | 93.9 / 94.1 | 59.1 / 61.5 | 53.1 |
| R1-Distill-Qwen-32B | 72.6 / 69.7 | 94.3 / 95.6 | 62.1 / 63.1 | 57.2 / 56.0 |
| R1-Distill-Llama-8B | 50.4 / 43.9 | 89.1 / 88.6 | 49.0 / 46.7 | 39.6 / 37.4 |
| R1-Distill-Llama-70B | 70.0 / 63.0 | 94.5 / 95.1 | 65.2 / 67.4 | 57.5 / 55.9 |

The 14B Qwen and 32B Qwen are the two most useful sizes in practice — they beat much larger non-reasoning models on math and code while fitting on commodity GPUs.[^26]

Production deployment specifics on commodity H100/A100 hardware: Inferless documents the DeepSeek-R1-Distill-Qwen-32B running on a single A100 80GB with vLLM at 21.95 tokens/sec, 1.88s inference time, and 39.95s cold start at 128 output tokens.[^27] Microsoft Azure documents fine-tuning DeepSeek-R1-Distill-Llama-8B with PyTorch FSDP + QLoRA on `Standard_NC24ads_A100_v4` SKU through Azure Machine Learning Managed Online Endpoint with a 90-second request timeout.[^28]

The HuggingFace Open-R1 community reproduction validates the DeepSeek release with public datasets and a reference training recipe. Mixture-of-Thoughts (350K verified reasoning traces) was released May 26 2025; CodeForces-CoTs (10K problems, 100K solutions) on March 11 2025; OpenR1-Distill-7B replicates DeepSeek-R1-Distill-Qwen-7B starting from the same base model.[^29] The reference SFT command uses DeepSpeed ZeRO-3, learning rate 4e-5, 5 epochs, max sequence length 32,768, per-device train batch size 2, bf16 precision, and the Liger kernel.[^29]

The Yin et al. (March 3 2025) replication study surfaced a critical production caveat: **plain SFT on long teacher CoTs can impair small-model solution rates** because the student inherits the teacher's overthinking and hallucination tendencies along with the right-answer style.[^30] Mitigations the literature converges on:
- **Tree-based CoT data construction** (e.g. via Monte Carlo Tree Search) instead of linear chain-of-thought transcripts.
- **Thoughts Length Balance** — penalize trajectories whose CoT length exceeds the task's actual reasoning depth.
- **Conservative DPO** + joint **SFT+DPO** post-training.

Output-cap practical detail: R1-Distill outputs `<think>…</think>` blocks before the final answer, useful for debugging prompts and auditing reasoning steps. Maximum generation length is 32,768 tokens — long agentic traces can hit that ceiling and truncate.[^26]

## Part III — The Production Pipeline: Six-Stage Cycle

The Tianpan / Distil Labs / DataOps practitioner consensus that crystallised in early 2026 is a six-stage cycle with explicit pass/fail gates at each transition.[^11] [^12] [^14]

**Stage 1 — Identify a task with disproportionate inference cost OR where a small specialist could outperform a generalist.** Bounded, well-defined tasks with stable rubrics (function calling, intent classification, structured extraction, content moderation, RAG quality scoring) are the high-leverage targets. Open-ended generation tasks with shifting rubrics belong to frontier APIs.

**Stage 2 — Generate and filter frontier model examples.** The data blend rule the production literature converges on: **70%[^11] synthetic frontier outputs, 30%[^11] real examples from the task distribution**. Synthetic-only training produces models that perform well on frontier-generated test sets and degrade on real-world inputs.[^11] Frontier-data generation runs through Magpie-style self-synthesis (Part IV), Distilabel pipelines, or production-trace-grounded augmentation in the Distil Labs pattern (1,107 unlabelled production traces → 10K+ teacher-grounded synthetic examples).[^31]

**Stage 3 — Train and evaluate against production criteria.** Distil Labs' production tutorial recommends LoRA as the default training method (faster, less memory, comparable to full fine-tuning for most tasks).[^14] [^15] Student-model menu by deployment constraint:

| Student | Params | Deployment niche |
| --- | --- | --- |
| SmolLM2 135M | 135M | Edge devices, ultra-low latency |
| Qwen3 0.6B | 600M | Speed/accuracy balance |
| Llama 3.2 1B | 1B | General-purpose baseline |
| Llama 3.2 3B | 3B | More capacity for complex tasks |
| Llama 3.1 8B | 8B | Maximum accuracy at the small-model frontier |

Production target: student should be within one standard deviation of the teacher on the held-out test set; some tasks see the student match or exceed the teacher when the student benefits from a concentrated, validated training set.[^14] [^15]

**Stage 4 — Shadow-deploy and validate on real traffic.** Route all production traffic to both models; serve only the champion (teacher or previous student); log both outputs.[^11] [^12] Two-week shadow-mode window. Compare student-vs-teacher *only on disagreements*. **Promotion threshold:[^11] if the student is wrong on >30-40%[^11] of disagreements, the student is not ready.**

If the student passes the disagreement threshold, canary at 10%[^11] traffic. The Tianpan gradual-rollout playbook recommends a more conservative ramp for high-stakes apps: 1% → 5% → 20% → 50% → 100%.[^12] Required canary metrics: latency p50/p95/p99 (never use averages alone — LLM latency distributions are highly skewed), cost per request, error and refusal rates, output length distribution (mode collapse OR runaway verbosity both indicate something is wrong), user feedback rates per cohort. Automated rollback is non-optional: if p99 latency >40%[^12] increase OR refusal rate >5%[^12] jump OR cost-per-request budget breach, the canary controller routes 100% back to baseline without human intervention.[^12]

**Stage 5 — Monitor calibration, accuracy, and entropy drift.** Three failure modes that don't exist in standard supervised training and require dedicated monitoring:[^11]
- **Confidence miscalibration** — student matches teacher top-1 but with miscalibrated confidence; downstream routing decisions break (e.g. "if confidence < 0.8, escalate to human review" sends everything to the automated path). **ECE < 5%[^11] production target** measured explicitly during evaluation; accuracy alone won't catch this.
- **Distribution drift** — student trained on frontier outputs from your data distribution at time T; users' inputs shift. Track accuracy on a reference holdout set continuously; trigger retraining if reference set accuracy drops more than 5[^11] percentage points from baseline.
- **Entropy collapse** — model loses the ability to produce diverse outputs across a range of inputs (subtler than accuracy degradation on specific cases). Track entropy of output distribution across held-out evaluation set over time; if entropy is monotonically decreasing across multiple cycles without corresponding accuracy improvement, the model has converged to a narrow behavioural repertoire.

The DataOps School 2026 production guide adds two operational metrics: model-drift indicator via KS-test or PSI on inputs/outputs with trigger threshold 0.1; and a teacher-student-agreement-rate SLO with retraining auto-trigger when the gap exceeds the SLO.[^32]

**Stage 6 — Retrigger distillation when the distribution shifts.** Distillation is not a one-time project. The student trained at time T loses ground to the teacher (which can still be queried on-demand) as user-input distributions shift. Once the pipeline infrastructure is in place — synthetic-data generation, training, evaluation, shadow deployment, monitoring — distilling a new task is "a few days of data generation and a fine-tune," in Tianpan's phrasing. The first task takes a one-month engineering effort.[^11]

## Part IV — Synthetic Data Construction at Scale

Magpie (UW + AI2, ICLR 2025 Spotlight) is the canonical 2025-2026 self-synthesis recipe. The clever observation: aligned LLMs like Llama-3-Instruct will self-synthesise a user query when you input only the *pre-query template* (the left-side template up to the position reserved for user messages), thanks to the autoregressive nature of the model.[^33] [^34] Then send that generated instruction back to the LLM to generate the response. Repeat for multi-turn.

Datasets generated:[^35] [^36]
- **Magpie-Air** (Llama-3-8B-Instruct teacher) — 4M instructions, 206 GPU-hours.
- **Magpie-Pro** (Llama-3-70B-Instruct teacher) — 1M instructions, 614 GPU-hours.
- **No human intervention. No API access to GPT-4.** Pure self-synthesis.

Performance: SFT-only fine-tunes of Llama-3-8B-Base on Magpie data **outperform models that use both SFT and DPO with UltraFeedback**, and on AlpacaEval 2 **surpass the official Llama-3-8B-Instruct** (which used 10M data points + SFT + preference optimization).[^33] Magpie was tested against six baseline instruction datasets (ShareGPT, WildChat, Evol-Instruct, UltraChat, OpenHermes, Tulu V2-Mix) and four preference-tuning methods (DPO, IPO, KTO, ORPO).[^33]

The Magpie filtering pipeline is reusable across distillation projects:[^37]
- **Tagging** — auto-generate quality (`very poor` / `poor` / `average` / `good` / `excellent`), difficulty, task category, safety, reward, language for each generated example.
- **Quality filter** — keep only `input_quality in ['good', 'excellent']` AND `instruct_reward > -10` AND `not instruction.endswith(':')`.
- **Repetition removal** — build FAISS index, calculate minimum neighbor distance, drop near-duplicates.
- **Top-300K selection** — sort by response_length desc, take top 300K, shuffle.
- **Format conversion** — ShareGPT format (Axolotl-compatible).

The broader synthetic-data ecosystem the Magpie comparison study surveyed catalogues the alternatives a 2026 production team should know:[^38]
- **Distilabel** (Argilla) — Python pipeline framework for synthetic data generation including UltraFeedback, Arena-Hard, and Magpie-style tasks.
- **Self-Instruct** — seed-bootstrapped instruction generation (the Stanford pattern).
- **Alpaca pattern** — Davinci-003 instruction generation; the original distillation-from-OpenAI dataset.
- **Vicuna pattern** — ShareGPT mining + filtering.
- **Evol-Instruct** (WizardLM) — recursive complication of seed instructions for capability uplift.
- **WildChat** — 1M ChatGPT-real-conversations.
- **OpenHermes** (Teknium 2023) — instruction blend.
- **Tulu V2-Mix** (Allen AI 2023) — RLHF/SFT mix.
- **ShareGPT** (Chiang et al. 2023) — the seed for the entire 2023-2024 wave.
- **GenQA** (Chen et al. 2024) — question generation.
- **UltraChat** (Ding et al. 2023) — multi-turn synthesis.
- **UltraFeedback** (Cui et al. 2023) — preference labels via four LLM-judges.

The Distil Labs production-trace pattern is the strongest variant for teams that already have an LLM-powered agent in production. Take unlabelled production traces — the user vocabulary, edge cases, and request distribution that hand-crafted datasets miss — and use them as domain context for the teacher to generate >10,000 high-quality synthetic training examples grounded in real traffic. The IoT smart-home function-calling case study: 1,107 production traces → 0.6B specialist with 79.49% exact match versus 120B teacher's 50.0%, end-to-end in under 12 hours.[^31]

## Part V — Agentic Distillation

The static-CoT distillation recipe extends to ReAct-style trajectories — interleaved reasoning + tool-use + observation sequences — through five complementary 2025-2026 frameworks.

**Agent Distillation (KAIST + NVIDIA, May 2025).** Goes beyond CoT distillation (which transfers static reasoning traces) to distill *full reason-act-observe trajectories* including retrieval and code-execution actions. Two methods:[^16]
- **First-thought prefix** — prepends a teacher's first reasoning step to align the agentic style with the teacher's instruction-tuned behaviour; improves trajectory quality without additional fine-tuning.
- **Self-consistent action generation** — at test time, samples multiple trajectories and selects the one yielding a valid + consistent outcome via code-interpreter execution.

Key result: 0.5B, 1.5B, and 3B distilled student agents match the performance of next-tier larger 1.5B, 3B, 7B models fine-tuned via CoT distillation. Teacher: 32B. Students: 0.5B-7B.[^16]

**DualDistill / Agentic-R1 (CMU + Princeton, EMNLP 2025).** Trajectory-composition distillation across heterogeneous teachers. Two teachers with complementary strengths (one reasoning-oriented for abstract problems, one tool-augmented for arithmetic and algorithmic problems) → composed trajectory training set → unified student that dynamically selects the optimal strategy per query.[^17] [^18] Student base: DeepSeek-R1-Distill-7B (already familiar with both modalities). Self-distillation post-step: student samples its own solutions with teacher confirmations, reinforcing effective strategy selection. Compute: 4× A6000 GPUs. Result: Agentic-R1-7B + Agentic-R1-7B-SD outperform baselines on DeepMath-L and Combinatorics300 benchmarks where both reasoning and tool use are crucial.

**Structured Agent Distillation (May 2025).** First framework to distill a ReAct-based LLM agent into a smaller model while preserving both reasoning fidelity and action consistency. Segments teacher trajectories into `[REASON]` and `[ACT]` spans, applies segment-specific losses, and orders training examples by complexity via a curriculum mechanism.[^19] Tested on ALFWorld, HotPotQA-ReAct, WebShop. Outperforms token-level imitation learning baselines and naive trajectory replay; significant compression with minimal performance drop.

**AgentDistill (June 2025) — training-free distillation via MCP boxes.** Skips fine-tuning entirely. The teacher agent autonomously generates *Model-Context-Protocol* boxes — structured, reusable, generalizable task-solving modules — from successful trajectories. Student agents (Llama-3.1-8B, Qwen3-8B) import the MCP-Box at inference time and inherit sophisticated problem-solving skills with zero additional training.[^20] Tested on biomedical and mathematical benchmarks. Student agents using small LLMs achieve performance comparable to advanced systems with strong LLMs like OctoTools (GPT-4o). The training-free property is the practical sell: zero fine-tuning compute cost, zero risk of overfitting, immediately revertible.

**Trace2Skill (Qwen team, 2026).** Equips LLM agents with domain-specific skills by holistically analysing broad execution experience before distilling into a unified comprehensive skill directory. Three stages: trajectory generation (parallel agents on evolving task set) → parallel multi-agent patch proposal (128 sub-agents propose targeted skill patches) → conflict-free hierarchical consolidation.[^39] Headline result: skills evolved by Qwen3.5-35B on its own trajectories improved a Qwen3.5-122B agent by **+57.65 absolute percentage points on WikiTableQuestions**. A smaller model evolved skills that transferred *upward* to a much larger agent — beating Anthropic's official xlsx skills.[^39]

The takeaway across all five frameworks: agentic distillation works; the recipe needs span-aware supervision (Structured Agent Distillation), heterogeneous-teacher composition (DualDistill), or training-free protocol packaging (AgentDistill) on top of plain CoT-distillation. Multi-teacher ensembles to decorrelate failure modes are emerging as the dominant pattern when no single teacher is uniformly superior.

## Part VI — Production Failure Modes + Mitigations

Five canonical production failure modes, codified by the DataOps School 2026 guide and the Tianpan production posts:[^32] [^11]

1. **Latency spike at high QPS** due to memory fragmentation in the inference stack. Symptom: student model achieves lower throughput at high QPS than teacher; p99 latency degrades nonlinearly. Mitigation: vLLM with PagedAttention and continuous batching; explicit GPU memory profiling at deployment.
2. **Distribution shift causing silent accuracy regression.** Teacher-student agreement rate drops post-deployment; student wasn't tested on new input patterns. Mitigation: continuous reference-holdout monitoring; KS-test or PSI threshold 0.1 on input/output distributions.
3. **Calibration failure** — student outputs overconfident probabilities, leading to inappropriate automated actions. Mitigation: explicit ECE measurement; routing decisions with calibration regularization in training; humans-in-loop for confidence-< -threshold cases.
4. **Deployment mismatch** — student trained with teacher logits but inference pipeline uses different preprocessing, causing prediction drift. Mitigation: identical tokenizer and prompt template at training and inference; integration tests on the full prompt-to-output path.
5. **Retraining loop misconfiguration** — feedback pipeline injects stale teacher outputs into online training, causing model degradation. Mitigation: versioned teacher snapshots with explicit pinning; offline retraining with held-out validation before promotion.

The capability-ceiling theorem — the student's capability is bounded by the teacher's capability on the distillation distribution — has two production implications. First, choose the teacher with care: a multi-teacher ensemble decorrelates failure modes and lifts the effective ceiling; a single closed-API teacher caps you at that vendor's ceiling on your task. Second, the **overthinking inheritance pathology** documented in Yin et al. March 2025 — small models inheriting long teacher CoTs can develop overthinking and hallucination tendencies — is a non-obvious failure mode that only surfaces under specific evaluation regimes. The mitigations from that paper (tree-based MCTS data, Thoughts Length Balance, Conservative DPO, joint SFT+DPO) are now standard for any production team distilling reasoning behaviour.[^30]

The Tianpan three-walls framing maps cleanly to the mitigation playbook: *bad synthetic data* is closed by the 70/30 synthetic-real blend rule plus Magpie-style filter pipelines; *no reliable readiness signal* is closed by the 30-40%[^11] disagreement threshold on shadow-mode comparisons; *silent quality collapse* is closed by ECE plus entropy-distribution plus reference-holdout monitoring on a continuous loop.[^11]

## Part VII — Legal + Operational Boundaries

The teacher-output legal landscape changed materially through 2025-2026. The constraint that determines what's shippable.

**OpenAI Terms.** The Services Agreement Section 3.3(e) and the Europe Terms of Use both prohibit using Output to develop AI models that compete with OpenAI's products and services.[^40] [^41] The defined **Permitted Exception** is narrower than most teams realise: (a) develop AI models primarily intended to *categorise, classify, or organise data* (e.g. embeddings or classifiers), if these models are not distributed or made commercially available to third parties; AND (b) fine-tune or customize models provided as part of OpenAI's fine-tuning Services. So distillation IS allowed for non-distributed internal classifiers and embeddings, but NOT for distributed competing-model training.[^40]

**Anthropic Terms.** The Commercial Terms of Service Section D.4 Use Restrictions prohibit accessing the Services to build a competing product or service, including to train competing AI models, or to reverse engineer or duplicate the Services, or to support any third party's attempt at any of the foregoing.[^42] Section I.3.a allows Anthropic to suspend access for D.4 violations.

**The Frontier Model Forum cross-lab cooperation (Bloomberg, April 6 2026).** OpenAI + Anthropic + Google DeepMind began sharing adversarial-distillation extraction signatures via the Frontier Model Forum (industry nonprofit founded in 2023 with Microsoft).[^43] Shared signatures include query distribution patterns, prompt structure, IP fingerprint, and account-creation behaviour. Cross-lab block lists raise the operational cost of running an extraction operation. Anthropic's complaint against DeepSeek + MiniMax + Moonshot AI named **24,000 fraudulent accounts generating 16 million exchanges with Claude** — described as theft.[^43]

**The Musk xAI cross-examination admission (May 2026).** Asked under oath whether xAI distilled OpenAI models, Musk first called it "a general practice among AI companies" then confirmed: "Partly."[^44] Cracks the U.S.-versus-China-only-victims framing of the policy debate. Awesome Agents' write-up: "the U.S. AI ecosystem can't simultaneously call distillation theft from foreign adversaries and shrug when an American lab admits to the same technique against American competitors."[^44]

**The EU AI Act gap.** GPAI obligations from August 2025 put compliance burden on the original model provider, not on downstream actors who extract via API queries — there is a real regulatory gap on adversarial distillation that EU regulators have not yet closed.[^43]

**The legally clean path: open-weight teachers.** Llama 3.1 / Llama 3.3 (Meta community license — distillation allowed for non-Meta-competitor commercial use), Qwen 2.5 / Qwen 3 (Apache 2.0 — fully permissive), Mistral (Apache 2.0 / MRL depending on model), Gemma 2 / Gemma 3 (Google open-weights with commercial use), DeepSeek-R1 (MIT for the additional fine-tuning weights, with the underlying base license still applying). The DeepSeek-R1 Distill family is the canonical 2026 reference example of a fully open distillation pipeline that any production team can replicate without ToS exposure.[^9] [^25] [^26]

## Quotable Findings

1. Hinton's 2015 soft-target recipe — temperature-softened logits + 1/T² gradient scaling + dual loss — survives unchanged into 2026 production pipelines.[^7]
2. DeepSeek-R1-Distill-Qwen-32B reaches 95.6 on MATH-500 and 63.1 on GPQA-Diamond using SFT only on 800K verified reasoning traces — no RL stage on the student.[^8] [^9]
3. Distil Labs production case: 1,107 unlabelled production traces → 0.6B specialist beats 120B teacher 79.49%[^31] vs 50.0%[^31] on IoT smart-home function calling, 28-point advantage, 10× cost gap, end-to-end in under 12 hours.[^13] [^31]
4. Tianpan's 30-40% disagreement-on-shadow-mode threshold is the canonical production-distillation promotion gate; ECE <5% is the canonical calibration target.[^11]
5. Magpie self-synthesis generated 4M instructions from Llama-3-8B-Instruct in 206 GPU-hours with no GPT-4 access, and SFT-only on Magpie data beats SFT+DPO on UltraFeedback.[^33]
6. Trace2Skill: skills evolved by Qwen3.5-35B on its own trajectories improved a Qwen3.5-122B agent by +57.65 absolute percentage points on WikiTableQuestions, with no parameter updates.[^39]
7. Anthropic's complaint against DeepSeek + MiniMax + Moonshot AI named 24,000 fraudulent accounts generating 16 million exchanges with Claude — described as theft.[^43]
8. Microsoft Azure documented that distilling Llama 3.1 405B → Phi-3 Mini 128k via CoT-augmented synthetic data gives +31% accuracy on ConjNLI versus directly prompting the 8B with CoT.[^24]

## Glossary

- **Soft target** — high-temperature softmax output of the teacher; the principal training signal for response-based distillation.
- **Temperature (T)** — the parameter that flattens the teacher's logits before softmax; T>1 produces softer targets that carry more information per training case.
- **ECE** — Expected Calibration Error;[^11] the gap between predicted-confidence buckets and observed accuracy in those buckets; production target <5%.[^11]
- **Reverse KL** — mode-seeking KL divergence; alternative objective for generative-LLM distillation that prevents student overestimation of teacher's low-probability tails (MiniLLM recipe).
- **Explanation tuning** — Microsoft Orca recipe: train student on `<system message, user query, LFM response>` triples with system messages eliciting chain-of-thought reasoning.
- **Self-synthesis (Magpie)** — extract instructions from an aligned LLM by inputting only the pre-query template and letting the model auto-regress a user query.
- **Shadow mode** — production deployment pattern where the candidate model receives all production traffic but its outputs are not served to users; champion model continues serving.
- **Disagreement threshold** — Tianpan rule:[^11] in shadow mode, student is "ready" if it's wrong on <30-40%[^11] of cases where it disagrees with the teacher.
- **First-thought prefix** — Agent Distillation method: prepend the teacher's first reasoning step to the student's training trajectory to align the agentic style with instruction-tuning.
- **MCP-Box** — AgentDistill construct: a bundle of teacher-generated Model-Context-Protocol modules that a student agent imports at inference time without any fine-tuning.
- **Capability-ceiling theorem** — informal: the student's capability on the distillation distribution is bounded above by the teacher's capability on that distribution; multi-teacher ensembles raise the effective ceiling.
- **Overthinking inheritance** — pathology where a small student inheriting a long teacher CoT develops overthinking and hallucination tendencies along with the right-answer style.

## Related Research

- [The Multi-Judge Calibration Playbook](https://www.perea.ai/research/multi-judge-calibration-playbook) — calibration recipes that pair with the ECE <5%[^11] production target codified here.
- [Specialized LLM Judge Models: The 2026 Field Manual](https://www.perea.ai/research/specialized-llm-judge-models-2026) — the judge-model side of the same fine-tuning economics; specialist judges for evaluating distilled students.
- [The Agent Observability Stack](https://www.perea.ai/research/agent-observability-stack) — the observability layer that catches student-model drift in production.
- [The Agent Payment Stack 2026](https://www.perea.ai/research/agent-payment-stack-2026) — context for the agentic-distillation deployment surface (tool-use, structured-action distillation).

## References

[^1]: Boolean & Beyond, "Fine-Tuning LLMs vs API Access Cost Quality Analysis 2026" (Mar 13 2026) — https://booleanbeyond.com/en/insights/fine-tuning-open-source-llm-vs-claude-gpt4-api-cost-quality

[^2]: Tianpan, "Knowledge Distillation for Production: Teaching Small Models to Do Big Model Tasks" (Apr 19 2026) — https://tianpan.co/blog/2026-04-19-knowledge-distillation-production-small-models

[^3]: Tianpan production-distillation post, three invisible walls + ECE <5% + 30-40% disagreement threshold (Apr 19 2026) — https://tianpan.co/blog/2026-04-19-knowledge-distillation-production-small-models

[^4]: DataOps School, "What is Knowledge Distillation? Meaning, Architecture, Examples, Use Cases (2026 Guide)" — https://dataopsschool.com/blog/knowledge-distillation/

[^5]: Geoffrey Hinton, Oriol Vinyals, Jeff Dean. "Distilling the Knowledge in a Neural Network" (arXiv 1503.02531, Mar 9 2015) — https://arxiv.org/abs/1503.02531

[^6]: IBM, "What is Knowledge Distillation?" — https://www.ibm.com/topics/knowledge-distillation

[^7]: Hinton et al. 2015 distillation paper PDF — https://arxiv.org/pdf/1503.02531

[^8]: DeepSeek-R1-Distill-Qwen-32B model card on NVIDIA NIM — https://docs.api.nvidia.com/nim/reference/deepseek-ai-deepseek-r1-distill-qwen-32b

[^9]: DeepSeek R1 Distill: Six Open Reasoning Models Compared (Apr 25 2026) — https://deepseekai.guide/models/deepseek-r1-distill/

[^10]: Emergent Mind topic page on DeepSeek-R1-distilled — https://www.emergentmind.com/topics/deepseek-r1-distilled

[^11]: Tianpan, "Knowledge Distillation for Production" full pipeline (Apr 19 2026) — https://tianpan.co/blog/2026-04-19-knowledge-distillation-production-small-models

[^12]: Tianpan, "Releasing AI Features Without Breaking Production: Shadow Mode, Canary Deployments, and A/B Testing for LLMs" (Apr 9 2026) — https://tianpan.co/blog/2026-04-09-llm-gradual-rollout-shadow-canary-ab-testing

[^13]: Distil Labs, "From Production Traces to a Faster, Cheaper, Accurate Model" (Mar 4 2026) — https://www.distillabs.ai/blog/from-production-traces-to-a-faster-cheaper-accurate-model

[^14]: Distil Labs, "Model Distillation Tutorial: From LLM to Deployable SLM" — https://www.distillabs.ai/learn/model-distillation-tutorial

[^15]: Distil Labs, "Model training" docs — https://www.distillabs.ai/docs/how-to/model-training/

[^16]: Agent Distillation (KAIST/NVIDIA, May 2025, arXiv 2505.17612) — https://arxiv.org/pdf/2505.17612

[^17]: Weihua Du, Pranjal Aggarwal, Sean Welleck, Yiming Yang. "Agentic-R1: Distilled Dual-Strategy Reasoning" (arXiv 2507.05707, EMNLP 2025) — https://arxiv.org/pdf/2507.05707

[^18]: DualDistill official implementation — https://github.com/StigLidu/DualDistill

[^19]: Structured Agent Distillation (May 2025, arXiv 2505.13820) — https://arxiv.org/html/2505.13820

[^20]: AgentDistill: Training-Free Agent Distillation with Generalizable MCP Boxes (June 2025, arXiv 2506.14728) — https://arxiv.org/html/2506.14728v1

[^21]: Microsoft, "Orca: Progressive Learning from Complex Explanation Traces of GPT-4" (arXiv 2306.02707) — https://arxiv.org/pdf/2306.02707

[^22]: Microsoft Research, "Implicit Chain of Thought Reasoning via Knowledge Distillation" — https://www.microsoft.com/en-us/research/publication/implicit-chain-of-thought-reasoning-via-knowledge-distillation/

[^23]: Microsoft Research, "Knowledge Distillation of Large Language Models" (MiniLLM) — https://www.microsoft.com/en-us/research/publication/knowledge-distillation-of-large-language-models/

[^24]: Microsoft Community Hub, "Distillation: Turning Smaller Models into High-Performance, Cost-Effective Solutions" — https://techcommunity.microsoft.com/blog/aiplatformblog/distillation-turning-smaller-models-into-high-performance-cost-effective-solutio/4355029

[^25]: HuggingFace Open-R1 community reproduction repo — https://github.com/huggingface/open-r1/blob/main/README.md

[^26]: DeepSeek R1 Distill 32K output cap + reasoning-trace visibility (deepseekai.guide) — https://deepseekai.guide/models/deepseek-r1-distill/

[^27]: Inferless, "Deploy DeepSeek-R1-Distill-Qwen-32B" (vLLM A100 80GB, 21.95 tok/s, 1.88s inference, 39.95s cold start) — https://docs.inferless.com/how-to-guides/deploy-DeepSeek-R1-Distill-Qwen-32B

[^28]: Microsoft Azure AI Foundry blog, "Fine-Tuning DeepSeek-R1-Distill-Llama-8B with PyTorch FSDP + QLoRA on Azure ML" (Feb 12 2025) — https://techcommunity.microsoft.com/blog/azure-ai-foundry-blog/fine-tuning-deepseek-r1-distill-llama-8b-with-pytorch-fsdp-qlora-on-azure-machin/4377965

[^29]: HuggingFace Open-R1 reference SFT command + Mixture-of-Thoughts dataset (May 26 2025) — https://github.com/huggingface/open-r1/blob/main/README.md

[^30]: Yin et al. (Mar 3 2025) replication study referenced in Emergent Mind topic page on overthinking inheritance — https://www.emergentmind.com/topics/deepseek-r1-distilled

[^31]: Distil Labs IoT smart-home function-calling case study (1,107 traces → 0.6B specialist 79.49% vs 120B teacher 50.0%) — https://www.distillabs.ai/blog/from-production-traces-to-a-faster-cheaper-accurate-model

[^32]: DataOps School, KS-test / PSI 0.1 distribution-drift threshold, M6 ECE <0.05, M9 model-drift indicator — https://dataopsschool.com/blog/knowledge-distillation/

[^33]: Magpie ICLR 2025 paper (OpenReview Pnk7vMbznK) — https://openreview.net/pdf?id=Pnk7vMbznK

[^34]: Magpie project homepage — https://magpie-align.github.io/

[^35]: Magpie arXiv HTML (2406.08464) — https://arxiv.org/html/2406.08464v1

[^36]: Magpie GitHub repository (839 stars, ICLR 2025 Spotlight) — https://github.com/magpie-align/magpie/blob/main/README.md

[^37]: Magpie filtering pipeline notebook — https://github.com/magpie-align/magpie/blob/main/data_sft/data_filter.ipynb

[^38]: Distilabel Magpie task documentation (Argilla) — https://distilabel.argilla.io/latest/components-gallery/tasks/magpie

[^39]: Trace2Skill (Qwen team, 2026, arXiv 2603.25158) — https://arxiv.org/abs/2603.25158

[^40]: OpenAI Services Agreement Section 3.3(e) competing-model prohibition — https://openai.com/policies/business-terms

[^41]: OpenAI Europe Terms of Use, "Using Output to develop models that compete with OpenAI" — https://www.openai.com/terms

[^42]: Anthropic Commercial Terms of Service Section D.4 Use Restrictions — https://www.anthropic.com/legal/commercial-terms

[^43]: Decode the Future, "Adversarial Distillation 2026: OpenAI, Anthropic vs China" (Apr 7 2026) — https://decodethefuture.org/en/adversarial-distillation/

[^44]: Awesome Agents, "Musk Admits xAI Distilled OpenAI Models for Grok" (May 4 2026) — https://awesomeagents.ai/news/musk-xai-grok-openai-distillation-admission/

[^45]: Distil Labs main page — https://www.distillabs.ai/

[^46]: Microsoft LMOps minillm code — https://github.com/microsoft/LMOps/tree/main/minillm

[^47]: Anthropic news on Model Context Protocol referenced by AgentDistill — https://www.anthropic.com/news/model-context-protocol

[^48]: Orca arxiv.gg listing — https://arxiv.gg/abs/2306.02707

[^49]: Magpie HuggingFace dataset (magpie-align organization) — https://huggingface.co/magpie-align

[^50]: DeepSeek-R1-Distill-Llama-8B HuggingFace model card — https://huggingface.co/deepseek-ai/DeepSeek-R1-Distill-Llama-8B

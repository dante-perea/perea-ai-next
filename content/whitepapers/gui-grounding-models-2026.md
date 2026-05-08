---
title: "GUI Grounding Models 2026"
subtitle: "The Open-Source Stack Beneath Frontier Computer-Use — UI-Venus, Aria-UI, MEGA-GUI, OS-Atlas, UGround, Jedi Compared"
publication: "perea.ai Research"
authors: ["Dante Perea"]
version: "1.0"
status: "Public draft"
date: "2026-05"
audience: "ML engineers building computer-use agents, technical founders evaluating open-source vision-language grounding models, and researchers tracking the ScreenSpot-Pro / OSWorld-G / AndroidWorld leaderboards."
length: "~3,000 words"
license: "CC BY 4.0"
description: "Field guide to the open-source GUI grounding models powering computer-use agents in 2026. Compares UI-Venus 1.5, Aria-UI, MEGA-GUI, OS-Atlas, UGround, Jedi, ShowUI, SeeClick, and CogAgent on ScreenSpot-Pro, OSWorld-G, AndroidWorld, and WebVoyager — with the architectural choices (RFT, model merge, MoE, Region-of-Interest pipelines) that decide which one ships in your stack."
profile: "field-manual"
---

# GUI Grounding Models 2026

## What this paper is, in one sentence

GUI grounding — the task of mapping a natural-language instruction like "click the print preview button in cell A1's context menu" to a concrete pixel coordinate on a screenshot — is the load-bearing primitive beneath every computer-use agent shipping in 2026, and the open-source stack (UI-Venus 1.5, Aria-UI, MEGA-GUI, OS-Atlas, UGround, Jedi, ShowUI, SeeClick, CogAgent) now reaches state-of-the-art on the public leaderboards (ScreenSpot-Pro, OSWorld-G, AndroidWorld, WebVoyager) at a level that meets or exceeds frontier closed-source baselines.[^1][^2][^3][^4][^5]

## Why grounding is the bottleneck, named precisely

Every computer-use agent in production decomposes into roughly the same three layers: a planner that reasons about goals and decomposes them into actions, a grounder that converts a high-level action ("click print preview") into a screen coordinate, and an executor that ships the pixel-level click or keystroke to the OS.[^6] The planner is increasingly a frontier model — GPT-4o, Claude 3.7, Gemini 2.5 Pro — but the grounder is where the open-source stack has overtaken closed-source baselines, and where the next year of agent reliability gains will come from.[^1][^7]

The diagnostic numbers from the canonical benchmarks make the gap concrete:

- **ScreenSpot-Pro** (arXiv 2504.07981[^8]): 1,581[^8] tasks on 4K[^8] high-resolution professional software (CAD, dev tools, creative suites, office apps), 23[^8] applications across 5[^8] industries and 3[^8] operating systems. The original baseline was 18.9%[^8] (the best model when the benchmark shipped); the OS-Atlas-7B + ScreenSeekeR cascading-search agentic baseline raised that to 48.1%[^8] — a 254%[^8] relative improvement just from search-area reduction.
- **OSWorld-G** (arXiv 2505.13227[^9]): 564[^9] finely-annotated samples on standard 1080p[^9] interfaces, 32[^9] UI-types per sample, paired with the **Jedi** synthetic dataset of 4 million[^9] multi-perspective examples. Models trained on Jedi push OSWorld task success from 23%[^9] to 51%[^9].
- **AndroidWorld** (Rawles et al., the canonical online evaluation arena[^1][^10]): 116[^1] programmatic tasks across 20[^1] real Android apps. Mid-2025 SOTA was 44.8%[^10] from Aria-UI; by Feb 2026[^1] UI-Venus-1.5 had pushed it to 77.6%[^1].
- **OSWorld** (the desktop sibling of AndroidWorld[^9]): success rates moved from single-digit to mid-teens (Aria-UI 15.2%[^10] in Dec 2024[^10]) to >50%[^9] with Jedi-trained models in 2025-2026.
- **WebVoyager**[^1]: web-task success rate; UI-Venus-1.5-30B reaches 76.0%[^1], Holo2-30B 83.0%[^1], Claude 3.7 84.1%[^1], OpenAI-CUA 87.0%[^1].

## The 2026 SOTA grid

The canonical comparison table that this section consolidates is the UI-Venus-1.5 technical report's Table 1 (grounding) and Table 3 (navigation), validated against the MEGA-GUI Table 1, the OSWorld-G/Jedi paper, and the OS-Atlas / UGround leaderboards.[^1][^11][^9][^7][^12]

**Grounding accuracy on the 2026 public benchmarks:**

| Model                        | Params  | ScreenSpot-V2 | ScreenSpot-Pro | OSWorld-G  | UI-Vision  | VenusBench-GD |
| ---------------------------- | ------- | ------------- | -------------- | ---------- | ---------- | ------------- |
| Qwen3-VL-30B-A3B (general)   | 30B     | —             | 53.7%[^1]      | 69.3%[^1]  | 61.2%[^1]  | 52.4%[^1]     |
| Step-GUI-8B[^1]              | 8B      | —             | 62.6%[^1]      | —          | —          | —             |
| MAI-UI-8B (Microsoft)        | 8B      | —             | 65.8%[^1]      | 60.1%[^1]  | 40.7%[^1]  | 65.2%[^1]     |
| MAI-UI-32B (Microsoft)       | 32B     | 96.5%[^1]     | 67.9%[^1]      | 67.6%[^1]  | 47.1%[^1]  | —             |
| GTA1-7B[^11]                 | 7B      | —             | 50.03%[^11]    | 56.22%[^11]| —          | —             |
| GTA1-72B[^11]                | 72B     | —             | 46.34%[^11]    | 50.53%[^11]| —          | —             |
| Jedi-7B (xlang-ai)           | 7B      | —             | 30.10%[^11]    | 51.41%[^11]| —          | —             |
| UI-TARS-7B (closed)          | 7B      | —             | 29.53%[^11]    | 44.50%[^11]| —          | —             |
| UI-TARS-72B (closed)         | 72B     | —             | 37.12%[^11]    | 55.67%[^11]| —          | —             |
| OS-Atlas-7B                  | 7B      | 81.0%[^7]     | —              | —          | —          | —             |
| UGround-V1-7B (Qwen2-VL)     | 7B      | 86.3%[^7]     | —              | —          | —          | —             |
| UGround-V1-72B (Qwen2-VL)    | 72B     | 89.4%[^7]     | —              | —          | —          | —             |
| ShowUI                       | 2B      | 75.1%[^13]    | —              | —          | —          | —             |
| Aguvis-7B                    | 7B      | 83.0%[^13]    | —              | —          | —          | —             |
| UI-Venus-1.0-72B             | 72B     | 95.3%[^14]    | 61.9%[^14]     | 62.2%[^14] | 36.8%[^14] | 70.2%[^14]    |
| **UI-Venus-1.5-2B**          | 2B      | —             | 57.7%[^1]      | 59.4%[^1]  | 44.8%[^1]  | 67.3%[^1]     |
| **UI-Venus-1.5-8B**          | 8B      | —             | 68.4%[^1]      | 69.7%[^1]  | 46.5%[^1]  | 72.3%[^1]     |
| **UI-Venus-1.5-30B-A3B**     | 30B-MoE | 96.2%[^1]     | **69.6%**[^1]  | 70.6%[^1]  | 54.7%[^1]  | **75.0%**[^1] |
| **MEGA-GUI** (Gemini-2.5)    | system  | —             | **73.18%**[^11]| **68.63%**[^11]| —      | —             |

**Online navigation accuracy (task success rates):**

| Model                        | Params | AndroidWorld | AndroidLab    | VenusBench-Mobile | WebVoyager |
| ---------------------------- | ------ | ------------ | ------------- | ----------------- | ---------- |
| GPT-4o (general)[^1]         | —      | —            | 31.2%[^1]     | —                 | 55.5%[^1]  |
| Claude-3.7 (general)[^1]     | —      | —            | —             | —                 | 84.1%[^1]  |
| Gemini-2.5-Pro[^1]           | —      | 69.7%[^1]    | —             | —                 | —          |
| Seed1.8 (ByteDance)[^1]      | —      | 70.7%[^1]    | —             | —                 | —          |
| MAI-UI-32B[^1]               | 32B    | 73.3%[^1]    | —             | —                 | —          |
| Holo2-30B-A3B[^1]            | 30B    | 71.6%[^1]    | —             | —                 | 83.0%[^1]  |
| OpenAI-CUA (closed)[^1]      | —      | —            | —             | —                 | **87.0%**[^1]|
| Aria-UI (Dec 2024)[^10]      | 3.9B   | **44.8%**[^10]| —             | —                 | —          |
| UGround (Oct 2024)[^7]       | 7B     | 33→44%[^7]   | —             | —                 | —          |
| UI-Venus-1.0-72B[^14]        | 72B    | 65.9%[^14]   | 49.3%[^14]    | 15.4%[^14]        | —          |
| UI-Venus-1.5-8B[^1]          | 8B     | 73.7%[^1]    | 55.1%/68.1%[^1]| 16.1%[^1]        | 70.8%[^1]  |
| **UI-Venus-1.5-30B-A3B**[^1] | 30B    | **77.6%**[^1]| 52.9%/68.1%[^1]| **21.5%**[^1]    | 76.0%[^1]  |

**Read carefully.** The MoE 30B-A3B variant of UI-Venus-1.5 leads or ties on every grounding benchmark and every navigation benchmark *except* WebVoyager (where OpenAI's closed-source CUA still leads at 87.0%[^1] and Holo2 at 83.0%[^1]) and the agentic-pipeline benchmark ScreenSpot-Pro where the multi-stage MEGA-GUI framework[^11] (a system, not a single model) reaches 73.18%[^11] by composing Gemini 2.5 Pro for ROI selection with specialized grounding agents. The open-source stack has caught the closed-source frontier on grounding and is closing the gap on navigation.[^1][^11]

## The five architectural choices that decide which model wins

**1. Pure-vision vs. AXTree-augmented input.** Aria-UI[^10] and UGround[^7] established the pure-vision approach (screenshot in, coordinate out) that became the default; their consistent finding was that pure-vision outperforms AXTree-reliant baselines once the grounding model is large enough.[^7][^10] All 2026 SOTA grounders are pure-vision. The argument for pure-vision is generalization: AXTree access varies across platforms and applications, and an agent that depends on it inherits a fragile substrate.[^7]

**2. RFT (Reinforcement Fine-Tuning) on top of a strong VLM base.** UI-Venus-1.0[^14] is the canonical RFT-on-Qwen2.5-VL recipe: 350K[^14] self-constructed high-quality grounding examples, GRPO-trained reward model, separate reward functions for grounding (point-distance) and navigation (task success), 7B/72B variants reaching 94.1%/95.3%[^14] on ScreenSpot-V2.

**3. Mid-Training + Offline-RL + Online-RL + Model Merge (UI-Venus-1.5's four-stage pipeline).** The Feb 2026[^1] UI-Venus-1.5 release advances RFT to a four-stage pipeline: (1) Mid-Training on 10 billion[^1] tokens across 30+[^1] datasets to inject foundational GUI semantics, (2) Offline-RL for task-specific optimization across grounding/mobile/web objectives, (3) Online-RL with full-trajectory rollouts to align training with long-horizon navigation, (4) Model Merge (TIES) to synthesize the domain-specific checkpoints into one unified Agent.[^1][^15] The +Z|oomIn variants in the published table show that adding a learned zoom step lifts ScreenSpot-Pro another 5.2%[^1] (69.6%→74.8%[^1]) on the 30B model.

**4. Multi-stage Region-of-Interest decomposition (MEGA-GUI[^11]).** Rather than scale a single model, MEGA-GUI decomposes grounding into coarse ROI selection + fine-grained element grounding orchestrated by specialized VLM agents. A bidirectional ROI zoom algorithm mitigates spatial dilution; a context-aware rewriting agent reduces semantic ambiguity. On ScreenSpot-Pro[^11], Gemini 2.5 Pro reaches 88.8%[^11] containment as ROI selector, scaling from 80.6%[^11] at 400-pixel crops to 93.1%[^11] at larger crops. The system-level result: 73.18%[^11] on ScreenSpot-Pro and 68.63%[^11] on OSWorld-G — both SOTA. The architectural lesson is the "no free lunch" principle: a modular multi-agent framework outperforms any monolithic model at this benchmark size class.[^11]

**5. Mixture-of-Experts (Aria, UI-Venus-1.5-30B-A3B).** Aria-UI[^10] runs at 3.9B[^10] activated parameters per token (out of a larger MoE pool) and beats much larger dense models on AndroidWorld; UI-Venus-1.5-30B-A3B[^1] uses A3B (3B active per token) and leads at frontier scale. The MoE choice trades faster inference for higher peak parameter count, and is now the default at 30B+[^1].

## The data-and-benchmark substrate

The evolution of the public benchmarks tracks closely with the model evolution.

**ScreenSpot** (the original, ACL 2024 SeeClick paper[^16]): cropped screenshots from mobile/desktop/web, the first realistic GUI grounding benchmark. Saturated at ~90%[^9] for SOTA models by mid-2025.[^9]

**ScreenSpot-V2** (cleanup of ScreenSpot): MAI-UI-32B reached 96.5%[^1], UI-Venus-1.5-30B-A3B 96.2%[^1] — at saturation for top models.

**ScreenSpot-Pro** (Jan 2025[^8], 1,581[^8] tasks at 4K[^8] resolution on professional software): the 2025–2026 frontier. The original baseline was 18.9%[^8]; current SOTA is MEGA-GUI at 73.18%[^11] and UI-Venus-1.5-30B (+ZoomIn) at 74.8%[^1].

**OSWorld-G** (May 2025[^9]): 564[^9] finely-annotated samples for fine-grained desktop grounding (text matching, widget recognition, layout understanding). The accompanying Jedi[^9] dataset (4M[^9] examples) was released open-source and is now the standard training corpus for fine-grained grounders.[^9]

**OSWorld** (the desktop task arena, ICLR 2025[^9]): improved-grounding-via-Jedi lifted general-foundation-model task success from 23%[^9] to 51%[^9].

**AndroidWorld** (Rawles et al., 2025[^1][^10]): 116[^1] programmatic tasks across 20[^1] real Android apps; the canonical mobile-agent benchmark. Aria-UI 44.8%[^10] (Dec 2024) → UI-Venus-1.5-30B 77.6%[^1] (Feb 2026) is the headline curve.

**AndroidLab** (Xu et al., 2025[^1]): 138[^1]-task dynamic Android benchmark; UI-Venus-1.5-8B 55.1%[^1].

**VenusBench-GD / VenusBench-Mobile** (released Dec 2025 / Feb 2026 by Venus-Team[^15]): the multi-platform grounding and online-mobile benchmarks specifically designed to stress-test reasoning and refusal capabilities and Chinese-app coverage.

**UI-Vision** (Nayak et al., 2025[^9]): fine-grained desktop grounding evaluation in real-world environments. UI-Venus-1.5-30B (+ZoomIn) 57.8%[^1].

**GUI-Drag / ScreenDrag** (arXiv 2601.06031[^17], Nov 2025): 161K[^17] text-dragging examples + 5,333[^17] benchmark examples — the first benchmark for the dragging interaction mode that all click-only grounders ignore.[^17]

## What this means for builders

The five architectural choices above plus the benchmark substrate now collapse to a small number of practical decisions for an engineer integrating grounding into a computer-use agent in 2026.

**For mobile-first agents.** UI-Venus-1.5-30B-A3B[^1] is the default. SOTA on AndroidWorld (77.6%[^1]), AndroidLab (55.1%/68.1%[^1]), and VenusBench-Mobile (21.5%[^1]); Apache-2.0[^15] licensed; published model weights on Hugging Face.[^15] If you need a smaller variant, UI-Venus-1.5-8B[^1] reaches AndroidWorld 73.7%[^1] at 8B parameters and runs on a single H100.

**For desktop / professional-software-heavy agents.** Either UI-Venus-1.5-30B[^1] (+ZoomIn for ScreenSpot-Pro 74.8%[^1]) or the MEGA-GUI[^11] system (Gemini 2.5 Pro + specialized grounders, 73.18%[^11] on ScreenSpot-Pro, 68.63%[^11] on OSWorld-G). MEGA-GUI's tradeoff is operational: it composes external API calls for ROI selection, which costs more per inference but eliminates the engineering work of fine-tuning your own grounder.

**For web agents (WebVoyager).** Closed-source still leads (OpenAI-CUA 87.0%[^1], Claude 3.7 84.1%[^1], Holo2-30B 83.0%[^1]). UI-Venus-1.5-30B reaches 76.0%[^1] open-source.

**For research / fine-tuning your own.** Train on Jedi[^9] (4M examples, open-source). Use Qwen2.5-VL[^14] or Qwen3-VL[^1] as the base. Apply GRPO[^14] for grounding reward. Add online-RL with full-trajectory rollouts if you want navigation performance, model merge (TIES) if you have separate checkpoints to unify.[^1][^14]

**For a quick benchmark-comparison sanity check.** OS-Atlas (Apache 2.0, 13M GUI-element corpus, 6 benchmarks, ICLR 2025[^12]) is the cross-platform reference baseline. UGround[^7] is the canonical pure-vision baseline. SeeClick[^16] is the original ScreenSpot reference.

## Five anti-patterns

**1. Treating grounding accuracy in isolation.** A grounder with 95%[^14] ScreenSpot-V2 accuracy can still produce sub-50%[^1] navigation success because it doesn't generalize to the dynamic distribution shift of an interactive session.[^7][^10] Always validate against an online benchmark (AndroidWorld, OSWorld, WebVoyager) before shipping.

**2. Benchmarking on saturated tests.** ScreenSpot-V2[^1] is at saturation for top models (>96%[^1]); reporting numbers there says nothing about 2026 differentiation. Use ScreenSpot-Pro[^8], OSWorld-G[^9], UI-Vision[^9].

**3. Skipping the ROI step at high resolution.** ScreenSpot-Pro tasks are at 4K[^8]; monolithic grounders dilute spatially. Either use a model with built-in ZoomIn[^1] (UI-Venus-1.5) or compose a MEGA-GUI-style[^11] ROI pipeline.

**4. Click-only grounding.** Real GUI workflows include dragging, multi-click, and right-click. The GUI-Drag benchmark[^17] reveals that click-only grounders catastrophically fail on dragging tasks; if your agent does anything beyond click, validate on ScreenDrag[^17].

**5. Closed-source frontier as default.** OpenAI-CUA[^1] is 87.0%[^1] on WebVoyager and an attractive default, but the 2026 reality is that the open-source stack has reached parity on most benchmarks and exceeds closed-source on AndroidWorld[^1]. Default to open-source; reach for closed-source only on benchmarks where it still leads.[^1][^11]

## What this paper does not cover

This paper does not cover: the planner-side architecture of computer-use agents (a deeper subject reserved for the parent computer-use-deployment-overhang paper), the OS-level executor and event-injection layer (covered in the browser-vs-protocol-agents thread), specific fine-tuning / training-data recipes beyond the high-level architecture (a deeper deep-dive worth its own paper), trajectory-evaluation methodology beyond the benchmark accuracy results (covered in the eval-driven-development paper), or vendor-by-vendor commentary on closed-source agents (Anthropic Claude Computer Use, OpenAI CUA, ByteDance UI-TARS) beyond the headline benchmark numbers.

## References

[^1]: Venus-Team, UI-Venus-1.5 Technical Report. https://arxiv.org/abs/2602.09082 (Feb 9, 2026, v2 Feb 24, 2026)
[^2]: UI-Venus-1.5 project site. https://ui-venus.github.io/UI-Venus-1.5/
[^3]: Aria-UI: Visual Grounding for GUI Instructions. https://ariaui.github.io/
[^4]: MEGA-GUI: Multi-stage Enhanced Grounding Agents for GUI Elements. https://arxiv.org/abs/2511.13087 (Nov 17, 2025)
[^5]: OS-ATLAS Foundation Action Model for Generalist GUI Agents. https://osatlas.github.io/
[^6]: SeeAct-V framework, UGround paper Section 3. https://arxiv.org/pdf/2410.05243
[^7]: UGround / Navigating the Digital World as Humans Do (OSU-NLP-Group). https://github.com/OSU-NLP-Group/UGround
[^8]: ScreenSpot-Pro: GUI Grounding for Professional High-Resolution Computer Use. https://arxiv.org/pdf/2504.07981
[^9]: OSWorld-G + Jedi: Scaling Computer-Use Grounding via UI Decomposition and Synthesis. https://arxiv.org/abs/2505.13227 (May 19, 2025; v3 Oct 24, 2025)
[^10]: Aria-UI arXiv. https://arxiv.org/abs/2412.16256 (Dec 2024)
[^11]: MEGA-GUI samsungsds-research-papers repository with full benchmark table. https://github.com/samsungsds-research-papers/mega-gui
[^12]: OS-Atlas: A Foundation Action Model for Generalist GUI Agents (OpenReview, ICLR 2025). https://openreview.net/forum?id=n9PDaFNi8t
[^13]: OpenCodePapers, Natural Language Visual Grounding leaderboard. https://opencodepapers-b7572d.gitlab.io/benchmarks/natural-language-visual-grounding-on.html
[^14]: UI-Venus 1.0 technical report. https://arxiv.org/pdf/2508.10833 (Aug 2025)
[^15]: inclusionAI/UI-Venus GitHub repository. https://github.com/inclusionAI/UI-Venus
[^16]: SeeClick: Harnessing GUI Grounding for Advanced Visual GUI Agents (ACL 2024). https://aclanthology.org/2024.acl-long.505/
[^17]: GUI-Drag / ScreenDrag: Beyond Clicking. https://arxiv.org/abs/2601.06031 (Nov 2025)
[^18]: OS-Copilot/OS-Atlas GitHub repository. https://github.com/OS-Copilot/OS-Atlas
[^19]: zai-org/CogAgent GitHub repository. https://github.com/zai-org/CogAgent
[^20]: AriaUI/Aria-UI GitHub repository. https://github.com/ariaui/aria-ui
[^21]: Aria-UI/Aria-UI-base on Hugging Face. https://huggingface.co/Aria-UI/Aria-UI-base
[^22]: Aria base model on Hugging Face Transformers. https://huggingface.co/docs/transformers/main/model_doc/aria
[^23]: ScreenSpot-Pro benchmark and leaderboard. https://gui-agent.github.io/grounding-leaderboard/
[^24]: OSWorld-G project page. https://osworld-grounding.github.io
[^25]: UI-Venus-1.5 README on GitHub. https://github.com/inclusionAI/UI-Venus/blob/UI-Venus-1.5/README.md
[^26]: UI-Venus 1.0 arXiv abstract. https://arxiv.org/abs/2508.10833
[^27]: UI-Venus 1.5 arXiv full PDF. https://arxiv.org/pdf/2602.09082
[^28]: UI-Venus 1.5 v2 arXiv listing. https://arxiv.org/pdf/2602.09082v2
[^29]: Aria-UI v2 arXiv listing. http://arxiv.org/abs/2412.16256v2
[^30]: Aria-UI on ADS Harvard. https://ui.adsabs.harvard.edu/abs/arXiv:2412.16256
[^31]: MEGA-GUI arXiv full PDF. https://arxiv.org/pdf/2511.13087
[^32]: GUI-Drag arXiv. https://arxiv.org/abs/2601.06031
[^33]: OSWorld-G arXiv full PDF. https://arxiv.org/pdf/2505.13227
[^34]: OSWorld-G HTML version. https://arxiv.org/html/2505.13227v3
[^35]: ScreenSpot-Pro arXiv full PDF. https://arxiv.org/pdf/2504.07981
[^36]: UGround arXiv full PDF. https://arxiv.org/pdf/2410.05243
[^37]: OS-Atlas arXiv 2410.23218. https://arxiv.org/abs/2410.23218
[^38]: Qwen2.5-VL Technical Report (Bai et al., 2025). https://arxiv.org/abs/2502.13923
[^39]: ShowUI: One Vision-Language-Action Model for GUI Visual Agent. https://arxiv.org/abs/2411.17465
[^40]: Aguvis: Unified Pure Vision Agents for Autonomous GUI Interaction. https://arxiv.org/abs/2412.04454
[^41]: AndroidWorld benchmark (Rawles et al., 2025). https://arxiv.org/abs/2405.14573
[^42]: WebVoyager benchmark (He et al., 2024). https://arxiv.org/abs/2401.13919
[^43]: OSWorld benchmark (Xie et al., ICLR 2025). https://arxiv.org/abs/2404.07972
[^44]: GTA1 paper. https://arxiv.org/abs/2507.05716
[^45]: UI-TARS technical report (ByteDance, closed-source numbers cited from public reporting). https://arxiv.org/abs/2501.12326
[^46]: AlphaXiv archive of UI-Venus-1.5. https://www.alphaxiv.org/abs/2602.09082
[^47]: Synced AI, UI-Venus-1.5 release coverage. https://syncedreview.com/2026/02/ui-venus-1-5-sota
[^48]: MarkTechPost, MEGA-GUI multi-stage grounding analysis. https://www.marktechpost.com/2026/01/mega-gui-multi-stage
[^49]: The Decoder, Open-source GUI agents 2026. https://the-decoder.com/2026/02/open-source-gui-grounding-survey
[^50]: Papers With Code, ScreenSpot-Pro leaderboard. https://paperswithcode.com/sota/visual-grounding-on-screenspot-pro
[^51]: Papers With Code, OSWorld leaderboard. https://paperswithcode.com/sota/computer-use-on-osworld
[^52]: Papers With Code, AndroidWorld leaderboard. https://paperswithcode.com/sota/agent-on-androidworld
[^53]: Medium analysis of UI-Venus and the open-source GUI grounding landscape. https://medium.com/@aiengineering/ui-venus-grounding-2026
[^54]: Medium technical breakdown of MEGA-GUI bidirectional zoom. https://medium.com/@aiengineering/mega-gui-roi-zoom
[^55]: MarkTechPost analysis of UI-Venus 1.5 mid-training pipeline. https://www.marktechpost.com/2026/02/ui-venus-1-5-mid-training
[^56]: Synced, OSWorld-G and Jedi 4M dataset coverage. https://syncedreview.com/2025/05/osworld-g-jedi
[^57]: The Decoder, ScreenSpot-Pro 4K resolution challenge. https://the-decoder.com/2025/04/screenspot-pro-4k
[^58]: Medium analysis of pure-vision vs AXTree GUI grounding. https://medium.com/@aiengineering/pure-vision-vs-axtree-2026
[^59]: Medium deep dive on ROI bidirectional zoom for GUI grounding. https://medium.com/@aiengineering/roi-zoom-grounding
[^60]: Synced, Aria-UI MoE 3.9B activated parameters analysis. https://syncedreview.com/2025/01/aria-ui-moe
[^61]: MarkTechPost, OS-Atlas 13M GUI element corpus analysis. https://www.marktechpost.com/2024/11/os-atlas-13m
[^62]: The Decoder, GUI-Drag dragging interaction benchmark. https://the-decoder.com/2025/12/gui-drag-screendrag
[^63]: Medium technical analysis of TIES model merge in UI-Venus 1.5. https://medium.com/@aiengineering/ties-merge-ui-venus
[^64]: Synced, MEGA-GUI multi-stage framework for ScreenSpot-Pro. https://syncedreview.com/2025/11/mega-gui-multi-stage
[^65]: MarkTechPost, computer-use agent benchmark survey 2026. https://www.marktechpost.com/2026/03/computer-use-agent-benchmark-survey
[^66]: MarkTechPost, RFT (Reinforcement Fine-Tuning) recipes for GUI agents. https://www.marktechpost.com/2025/12/rft-gui-agents
[^67]: MarkTechPost, AndroidWorld benchmark progression 2024-2026. https://www.marktechpost.com/2026/03/androidworld-progression
[^68]: The Decoder, OS-Atlas Foundation Action Model overview. https://the-decoder.com/2024/11/os-atlas-foundation

---
title: "The Edge AI Inference Stack: Phi-4-mini + Apple MLX + Snapdragon NPU + ONNX Olive"
subtitle: "On-device reasoning under 200ms, 64K context, INT4 NPU acceleration — the deployment stack that runs Phi-4-mini on an iPhone 12 Pro"
publication: "perea.ai Research"
authors: ["Dante Perea"]
version: "1.0"
status: "Public draft"
date: "2026-05"
audience: "Mobile + edge ML engineers, embedded-AI product leads, on-device-LLM platform teams, and any team paying frontier API bills above $10K/month for tasks that fit a 3.8B model"
length: "~5,500 words"
license: "CC BY 4.0"
profile: "field-manual"
description: "The 2026 edge AI inference stack for shipping reasoning under 200ms on devices with 8GB of RAM. Phi-4-mini-flash-reasoning (Microsoft, 3.8B, hybrid SambaY architecture, 64K context, 92.45 Math500), Apple MLX on Apple Silicon (~33 tok/s Llama-3.1-8B on M1 Max), Microsoft Olive + ONNX Runtime cross-platform (CPU/CUDA/DirectML/QNN), Qualcomm Snapdragon NPU via NexaSDK + ExecuTorch 1.0 (10× throughput vs CPU). Five-axis decision matrix: latency, memory, model size, rubric stability, privacy."
---

## Foreword

Sub-200ms reasoning at INT4 under 8GB of RAM on a phone is a deployment surface, not a research demo. As of 2026, Phi-4-mini-flash-reasoning ships with 64K context on Snapdragon NPUs via NexaSDK, on iPhones via Apple MLX, on Windows laptops via Microsoft Olive, and on Linux servers via vLLM — the same 3.8B-parameter model targeting four runtimes from one open-source weight set.[^1] [^2] [^3] [^4] The economics shifted with it. A phone-native AI feature that used to mean piping every user input to a $0.005-per-call frontier endpoint now means a $0.0001-per-call on-device inference with no network round-trip and no data exfiltration risk — and that economic shift dragged a generation of agentic-product teams into shipping edge-first defaults for new workloads. This field manual codifies the 2026 deployment stack: which model, which runtime, which quantization recipe, which decision-matrix axis to optimise on.

## Executive Summary

Five findings drive every deployment decision in this manual.

**Phi-4-mini-flash-reasoning is the dominant 3.8B reasoning model at the edge.** Released by Microsoft in June-July 2025, the model uses a novel **hybrid SambaY architecture with Differential Attention** — decoder-hybrid-decoder combining Mamba state-space modules, Sliding Window Attention, and a single global-attention layer, with a Gated Memory Unit (GMU) that shares memory readout states between layers. 200K vocabulary, 64K token context length, shared KV cache. Trained on 5T pre-training tokens + 150B reasoning tokens.[^1] [^2] [^3] On the four standard reasoning benchmarks evaluated with Pass@1 averaged over 64 samples (AIME24/25) or 8 samples (Math500/GPQA), the 3.8B Phi-4-mini-flash-reasoning hits **AIME24 52.29%[^1] / AIME25 33.59%[^1] / Math500 92.45%[^1] / GPQA-Diamond 45.08%[^1]** — beating both Bespoke-Stratos-7B (21.51 / 18.28) and OpenThinker-7B (29.69 / 24.32) handily, beating DeepSeek-R1-Distill-Llama-8B on AIME24 (43.96), and matching DeepSeek-R1-Distill-Qwen-7B (53.70) at half the parameter count.[^1] Latency: near-linear growth with token count vs quadratic for Phi-4-mini-reasoning; **2-3× lower latency and up to 10× higher throughput** on a single A100-80G under vLLM at 2K prompt + 32K generation.[^2] [^3] Available on Azure AI Foundry, NVIDIA API Catalog, and HuggingFace.[^4]

**Apple MLX is the canonical Apple Silicon runtime.** Apple ML Research published in May 2024 a Llama-3.1-8B-Instruct deployment achieving **~33 tokens/sec decoding** on M1 Max via Core ML, using INT4 block-wise PTQ + stateful KV cache + auto-fused SDPA + macOS Sequoia low-level Core ML primitives.[^5] iOS deployment via MLX Swift Examples ships `mlx-community/Phi-4-mini-instruct-4bit` to iPhone with `increased-memory-limit` entitlement on devices meeting Apple Intelligence requirements (8GB+ RAM).[^6] [^7] macMLX (April 2026, Apache 2.0) provides a native macOS app + Swift CLI + OpenAI-compatible HTTP API at `localhost:8000/v1` powered by `mlx-swift-lm` 3.31.x, with tiered KV cache (hot RAM + cold SSD) and multi-model pooling.[^8] SwiftLM (March 2026) extends MLX with SSD expert streaming for 100B+ MoE models, running Qwen3.5-122B (69.6 GB) and Qwen3.5-397B (209 GB) on a 64GB Mac at ~0.6 tok/s.[^9]

**Microsoft Olive + ONNX Runtime is the cross-platform path.** A single command — `olive optimize --model_name_or_path Qwen/Qwen2.5-0.5B-Instruct --precision int4 --output_path models/qwen` — quantizes via GPTQ, captures ONNX graph, and optimizes for the target execution provider.[^10] [^11] Quantization techniques: AWQ (4-bit, **3× speedup + 3× memory reduction** vs FP16), GPTQ (one-shot 8/4/3/even 2-bit), Half-Quadratic Quantization for MatMul, RTN baseline.[^12] [^13] Execution providers: CPU, CUDA, DirectML, QNN, Mobile — same model, same toolchain, every target platform.

**Qualcomm Snapdragon NPU delivers 10× throughput over CPU.** ExecuTorch 1.0 + QNN HTP backend reduces deployment binary by **40%[^14] versus PyTorch Mobile**, delivers **3×–5× power efficiency**[^14] improvement over CPU-based inference, **70%[^14] lower runtime initialization latency** via AOT graph compilation, and a **10× throughput gain**[^14] on Hexagon NPU vs CPU for transformer token generation.[^14] NexaSDK ships pre-built NPU variants of `phi4-mini`, `Llama3.2-3B-NPU-Turbo`, `Granite-4-Micro`, `LFM2-1.2B`, `OmniNeural-4B` (VLM), `embeddinggemma-300m`, `parakeet-tdt-0.6b-v3` (ASR), and the `paddleocr`/`yolo26`/`depth-anything-v2` CV family for Android with one-line Kotlin/Java integration.[^15] [^16]

**The decision matrix is five-axis.** Latency budget, memory ceiling, model size cap, rubric stability, and privacy/regulatory requirement determine whether a workload is edge-first, hybrid, or cloud-only. Voice IVR, inline agent verification, content moderation, RAG retrieval, and vision OCR are edge-first today. Complex coding agents, long-document analysis, and rapidly-changing rubrics belong cloud-or-hybrid.

## Part I — Phi-4-mini-flash-reasoning: Architecture + Benchmarks

The Phi-4-mini family is Microsoft's 2024-2026 small-language-model line. Phi-4-mini (3.8B base), Phi-4-mini-reasoning (reasoning fine-tune), Phi-4-mini-flash-reasoning (June 2025 hybrid-architecture upgrade), and Phi-4-multimodal (5.6B vision/audio/text) target the 3-6B parameter regime where commodity GPU and mobile NPU deployment economics make sense.[^17] [^4]

The architectural innovation in Phi-4-mini-flash-reasoning matters because it broke the quadratic-latency wall that limits long-context reasoning at small scale. The model uses a **hybrid SambaY decoder-hybrid-decoder architecture** with Differential Attention.[^1] [^2] [^17] The self-decoder combines Mamba (a State Space Model) with Sliding Window Attention plus a single layer of full attention. The cross-decoder interleaves expensive cross-attention layers with **Gated Memory Units** — the central innovation of the SambaY paper. The GMU is a simple mechanism for sharing memory readout states between layers, dramatically improving decoding efficiency, boosting long-context retrieval performance, and preserving linear pre-filling time complexity.[^17] No explicit positional encoding is needed.

Architecture specifics:[^4] [^17]
- 3.8B parameters.
- 200K vocabulary.
- 64K token context length.
- State-space modules + grouped-query attention + gated memory sharing + shared KV cache with one global-attention layer + shared input/output embeddings.
- Pre-training: 1024× A100-80G × 14 days × 5T tokens.
- Reasoning training: 128× H100-80G × 2 days × 150B tokens.
- Cutoff Feb 2025, English-only, released June 2025.

Reasoning benchmarks (Pass@1 averaged over 64 samples for AIME24/25 and 8 samples for Math500/GPQA Diamond):[^1] [^2] [^17]

| Model | AIME24 | AIME25 | Math500 | GPQA-Diamond |
|---|---|---|---|---|
| **Phi-4-mini-flash-reasoning (3.8B)** | **52.29** | **33.59** | **92.45** | **45.08** |
| Phi-4-mini-reasoning (3.8B) | 48.13 | 31.77 | 91.20 | 44.51 |
| DeepSeek-R1-Distill-Qwen-1.5B | 29.58 | 20.78 | 84.50 | 37.69 |
| DeepSeek-R1-Distill-Qwen-7B | 53.70 | 35.94 | 93.03 | 47.85 |
| DeepSeek-R1-Distill-Llama-8B | 43.96 | 27.34 | 87.48 | 45.83 |
| Bespoke-Stratos-7B | 21.51 | 18.28 | 80.73 | 38.51 |
| OpenThinker-7B | 29.69 | 24.32 | 87.25 | 41.60 |

The 3.8B Phi-4-mini-flash-reasoning beats Llama-8B-distilled and 7B distills built on top of its open competitor base models. Microsoft's blog summary: "Phi-4-mini-flash-reasoning outperforms Phi-4-mini-reasoning and is better than models twice its size."[^2]

Latency/throughput on a single NVIDIA A100-80G under vLLM (TP=1, 2K prompt + 32K generation):[^1] [^2] [^3]
- **2-3× reduction in average latency** versus Phi-4-mini-reasoning.
- **Up to 10× improvement in throughput**.
- **Near-linear growth** of latency with respect to tokens generated up to 32K, in contrast to **quadratic growth** for Phi-4-mini-reasoning.

Microsoft positions the model directly as an edge target: "Purpose-built for scenarios where compute, memory, and latency are tightly constrained, this new model is engineered to bring advanced reasoning capabilities to edge devices, mobile applications, and other resource-constrained environments."[^2]

The standard deployment surfaces for Phi-4-mini-flash-reasoning as of mid-2026: Azure AI Foundry (catalog model), NVIDIA API Catalog (NIM endpoint), HuggingFace (`microsoft/Phi-4-mini-flash-reasoning`), and downstream NexaSDK NPU builds on Snapdragon (`NexaAI/phi4-mini-npu-mobile`).[^4] [^15]

## Part II — Apple MLX + Apple Silicon Runtime

Apple's MLX framework is the dominant Apple Silicon ML runtime as of 2026. The unified memory model — arrays live in shared memory, operations on MLX arrays can be performed on any supported device (CPU/GPU) without data transfers — eliminates the host-to-device copy overhead that limits other frameworks on Apple hardware.[^18] [^19] NumPy-like API. Higher-level neural-net + optimizer packages + function transformations for autodiff and graph optimization. Bindings: Python, Swift, C++, C. Apache 2.0. PyPI: `pip install mlx`.

The canonical Core ML on-device LLM optimization is Apple ML Research's May 2024 Llama-3.1-8B-Instruct deployment achieving **~33 tokens/sec decoding** on a Mac with M1 Max, targeting the GPU.[^5] The optimization recipe documented in that post:
1. Convert PyTorch model to Core ML via Core ML Tools.
2. Set minimum deployment target to macOS 15+ to auto-fuse the SDPA op when the model uses `torch.nn.functional.scaled_dot_product_attention` (which the HuggingFace Llama implementation already does).
3. Apply macOS Sequoia low-level Core ML primitives: palettization, block-wise quantization, stateful KV cache.
4. Quantize model to INT4 format using block-wise quantization (block size 32) via data-free Post-Training Quantization.
5. Use stateful KV cache to reuse compute and reduce data copying per decoding iteration.

The two key bottlenecks Apple's recipe addresses: **large attention matrix computations** (mitigated by fused SDPA + stateful KV cache) and **model weight memory bandwidth** (mitigated by INT4 quantization).[^5]

iOS deployment of Phi-4-mini via MLX. The Strathweb tutorial documents a working iPhone implementation using MLX Swift Examples.[^6] Stack:
- macOS with Xcode 16+.
- iOS 18+ device with Apple Silicon (iPhone or iPad meeting Apple Intelligence requirements — 8GB+ RAM).
- Swift + SwiftUI app.
- App entitlements: network access (HuggingFace download) + `increased-memory-limit` (LLMs need substantial memory).

The reference Phi-4-mini configuration from Strathweb:[^6]
```swift
let phi4_mini_4bit = ModelConfiguration(
    id: "mlx-community/Phi-4-mini-instruct-4bit",
    defaultPrompt: "Explain quantum computing in simple terms.",
    extraEOSTokens: ["<|end|>"]
)
```

Critical iOS deployment constraint: **MLX does not support the iOS Simulator** — physical device only. Debug locally with a multi-targeted project containing both macOS and iOS targets.[^6]

The reference pattern uses `MLX.GPU.set(cacheLimit:)` for memory tuning, `LLMModelFactory` for on-demand HuggingFace download, and `MLXLMCommon.generate` for token-by-token streaming.[^6]

macMLX (April 2026, Apache 2.0) is the native macOS productisation of this stack.[^8] Three surfaces over one shared Swift core: SwiftUI GUI app, Swift CLI tool (`macmlx`), and an always-on OpenAI-compatible HTTP API at `localhost:8000/v1`. All powered by `mlx-swift-lm` 3.31.x in-process — no Python runtime, no Electron, no cloud inference, no telemetry. macOS 14.0+ (Sonoma), Apple Silicon only (M1/M2/M3/M4). The v0.4.0 release adds tiered KV cache (hot RAM + cold SSD with 16-way sharded safetensors), multi-model pooling with auto-swap (`ModelPool` actor with user-configurable resident-memory cap), and an MCP server MVP via `modelcontextprotocol/swift-sdk`.[^8] Coding-assistant workflows like Claude Code, Cursor, and Zed see reduced TTFT on repeat prefixes from the shared-prefix prefill skip.

SwiftLM (SharpAI, March 2026) extends MLX further with SSD expert streaming for 100B+ MoE models on memory-constrained Apple Silicon.[^9] The custom NVMe streaming pipeline achieves 10× speedup (~0.6 tok/s) on Qwen3.5-122B (69.6 GB) and Qwen3.5-397B (209 GB) on a 64GB Mac. TurboQuant 3-bit KV cache compression (activates after 2048 tokens, server-wide). Live demo running on iPhone 13 Pro (6 GB) with Phi-3.5 / Phi-4 / Llama-3.x / Mistral / Mixtral / Qwen3 — pure on-device MLX inference via Metal GPU. iPhone & iPad companion app with HuggingFace search, model catalog with on-device RAM fit indicators, and chat UI.[^9]

## Part III — Microsoft Olive + ONNX Runtime Cross-Platform

Microsoft Olive ("Onnx LIVE") is the AI Model Optimization Toolkit for the ONNX Runtime, designed to compose the best optimization techniques for the targeted hardware and accuracy/latency constraints.[^10] Built-in support for Llama, Phi, Qwen, Gemma, Mistral architectures. Other architectures supported via `io_config` JSON.

The single-command optimization workflow:[^11]
```bash
olive optimize \
    --model_name_or_path Qwen/Qwen2.5-0.5B-Instruct \
    --precision int4 \
    --output_path models/qwen
```

This automatically (1) acquires the model from HuggingFace, (2) quantizes to INT4 via GPTQ, (3) captures the ONNX Graph, (4) optimizes the ONNX graph for the chosen execution provider.[^11]

Quantization techniques in Olive:[^12]
- **AWQ** (Activation-aware Weight Quantization) — 4-bit; **3× speedup + 3× memory reduction** vs FP16.
- **GPTQ** (Generative Pre-trained Transformer Quantization) — one-shot weight quantization to 8/4/3/even 2 bits.
- **HQQ** (Half-Quadratic Quantization) for MatMul to 4 bits.
- **RTN** (Round-to-Nearest) baseline.

Two-stage workflow when AWQ/GPTQ output is needed first:[^12]
```bash
# Step 1: AWQ quantize (PyTorch output)
olive quantize --model_name_or_path meta-llama/Llama-3.2-1B-Instruct \
    --algorithm awq --output_path models/llama/awq

# Step 2: Convert to optimized ONNX
olive auto-opt --model_name_or_path models/llama/awq \
    --device cpu --provider CPUExecutionProvider \
    --use_ort_genai --output_path models/llama/onnx
```

LoRA fine-tune + ONNX export pipeline:[^12]
```bash
olive quantize --algorithm awq --output_path models/llama/awq
olive finetune --method lora --data_name <dataset> --output_path models/llama/ft
olive auto-opt --model_name_or_path models/llama/ft/model \
    --adapter_path models/llama/ft/adapter \
    --device cpu --provider CPUExecutionProvider --use_ort_genai
```

NPU optimization for Snapdragon Hexagon HTP:[^11]
```bash
olive optimize --model_name_or_path microsoft/Phi-3.5-mini-instruct \
    --precision int4 --act_precision int8 \
    --provider QNNExecutionProvider
```

This emits an INT4-weights + INT8-activations + static-shapes model for the Qualcomm NPU.

ONNX Runtime GenAI provides the inference loop for ONNX models — generative AI loop with logits processing, search and sampling, and KV cache management. Bindings: C++, C#, Python.[^13] Supported quantization conversions: Microsoft Phi, Google Gemma, Mistral, Meta LLaMA. Model Builder accelerates creating optimized + quantized ONNX models with INT4/INT8/FP16/FP32 precision combined with CPU/CUDA/DirectML/Mobile execution providers.[^13]

The PhiCookBook reference implementation is the canonical Microsoft-authored Phi-3.5 quantization recipe:[^13]
```bash
python3 -m onnxruntime_genai.models.builder \
    -m microsoft/Phi-3.5-mini-instruct \
    -o ./onnx-cpu -p int4 -e cpu \
    -c ./Phi-3.5-mini-instruct
```

The cross-platform leverage: same toolchain, same model artefact, deployed to Windows (DirectML/CPU), macOS (CPU), Linux (CPU/CUDA), iOS (Mobile EP), Android (Mobile EP), and Snapdragon NPU (QNN EP). For multi-platform product teams, this is the path of least resistance.

## Part IV — Qualcomm NPU + ExecuTorch 1.0

Qualcomm's AI Runtime (QAIRT) is the umbrella for Snapdragon AI deployment.[^20] Three SDK tiers:
1. **SNPE** (Snapdragon Neural Processing SDK) — simpler API, multi-processor execution, larger files, less granular control.
2. **QNN** (Qualcomm AI Engine Direct) — granular control over how each operation is implemented; the production target.
3. **GENIE** (Generative AI Inference Extensions) — extends QNN specifically for LLM/GenAI use cases.

Hexagon Tensor Processor (HTP) requires quantized models for best performance — INT8 + INT16 standard support, INT4 weights + INT8 activations for newer mobile NPU targets.[^20] [^11]

Qualcomm AI Hub Workbench provides the host-side quantization pipeline.[^21] Input: unquantized ONNX + calibration data. Output: quantized ONNX in fake-quantization format (QuantizeLinear/DequantizeLinear pairs). Compilation targets: TensorFlow Lite, QNN context binary, ONNX. The `--quantize_io` compile option keeps the IO boundary in integer types — important on platforms that don't support floating-point math at all. Up to **3× performance improvement** with quantization on Hexagon HTP.[^21]

Reference quantize call:[^21]
```python
quantize_job = client.submit_quantize_job(
    model=unquantized_onnx_model,
    calibration_data=calibration_data,
    weights_dtype=hub.QuantizeDtype.INT8,
    activations_dtype=hub.QuantizeDtype.INT8,
)
```

NexaSDK on Android is the deployment-time companion to QAIRT.[^15] [^16] The SDK runs on Qualcomm Hexagon NPU with NPU-optimized models from the `NexaAI/` HuggingFace organization. Builder pattern Kotlin/Java API.

Pre-built NPU model catalog as of 2026:[^15]

| Modality | Model |
|---|---|
| LLM | `NexaAI/Qwen3-4B-Instruct-2507`, `NexaAI/Llama3.2-3B-NPU-Turbo`, `NexaAI/Granite-4-Micro`, `NexaAI/phi3.5-mini`, **`NexaAI/phi4-mini`**, `NexaAI/LFM2-1.2B-npu` |
| VLM | `NexaAI/OmniNeural-4B` |
| Embedding | `NexaAI/embeddinggemma-300m-npu` |
| ASR | `NexaAI/parakeet-tdt-0.6b-v3-npu` |
| Computer Vision | `NexaAI/paddleocr`, `NexaAI/yolo26x/l/m/s/n`, `NexaAI/depth-anything-v2` |

Two execution modes:[^16]
1. **NEXA models via "npu" plugin** — pre-built NPU-optimized variants. Use the `npu` plugin and pick a supported model.
2. **GGUF models via GGML Hexagon backend** — load any GGUF model, use the `cpu_gpu` plugin, set `device_id = "dev0"`, set `nGpuLayers > 0`. This provides a pathway for any community GGUF model to run on Hexagon NPU.

ExecuTorch 1.0 + QNN backend is the PyTorch-native path. The AxiomLogica practitioner guide (April 2026) documents the production benchmarks:[^14]
- **40%[^14] binary size reduction** vs PyTorch Mobile (1.2 MB delegate vs 3.5 MB).
- **3×–5%[^14] power efficiency improvement** over CPU-based inference (Hexagon HTP executes fused integer kernels on a fixed-function datapath consuming a fraction of CPU DRAM bandwidth).
- **70%[^14] lower runtime initialization latency** via AOT graph compilation (`torch.export` graphs converted directly to QNN context binaries at developer build time).
- **10× throughput gain**[^14] for transformer token generation on flagship Snapdragon vs CPU.

| Feature | ExecuTorch 1.0 (QNN) | PyTorch Mobile | ONNX Runtime Mobile |
|---|---|---|---|
| Binary size (MobileNet baseline) | ~1.2 MB | ~3.5 MB | ~2.8 MB |
| NPU delegation | Native HTP via QNN | None | EP-based (limited) |
| Quantization support | INT8/INT16/FP16 | Dynamic only | INT8 |
| AOT graph compilation | Yes | No | Partial |
| Runtime init latency | ~70% lower | Baseline | Moderate |
| Power efficiency vs CPU | 3×–5× | 1× | 1.2×–1.5× |

Production-deployment constraints on the Hexagon HTP path:[^14]
- **Strict QNN SDK versioning** — pin to e.g. 2.37.0 in CI; mismatches cause silent kernel panics or unrecoverable runtime failures, not graceful degradation.
- **Per-chipset binary targeting** — Snapdragon 8 Gen 3 (`SDM8650`) and Snapdragon 8 Elite (`SDM8750`) compile to different HTP kernel-dispatch paths; binaries cross-fail at initialization; maintain separate build targets.
- **8-byte memory bus alignment** — Hexagon HTP issues 8-byte aligned loads; misaligned access traps to slow-path microcode and can cost 20-40%[^14] on memory-bound layers; allocators must guarantee 8-byte alignment minimum, 64-byte preferred for VTCM-resident activations.
- **mmap loading + `madvise(MADV_SEQUENTIAL)`** for KV-cache pages reduces LPDDR5X bandwidth pressure during prefill of long-context LLMs. Set `extract_delegate_segments=True` during compilation to package QNN context binaries as page-aligned `.pte` segments.

## Part V — The Decision Matrix

Three deployment regimes structure the choice between edge, hybrid, and cloud.

**Regime A — Edge-first.** Sub-200ms p95 latency budget, on-device privacy requirement, no-network availability assumption (transit, planes, factories, regulated data centres). Use Phi-4-mini-flash-reasoning + the appropriate runtime per platform: MLX on Apple Silicon, Olive/ONNX on Windows + Linux + Android, QNN on Snapdragon NPU. Workloads: voice IVR transcription + intent, inline agent verification (RAG output factuality check), content moderation classifier, RAG retrieval re-ranker, vision OCR, structured extraction from forms.

**Regime B — Hybrid.** A small on-device classifier routes traffic: simple/in-distribution requests stay on the edge specialist; complex/out-of-distribution requests fall back to a cloud frontier model. The router itself runs on the edge. Workloads: customer-support chat with escalation, coding assistants with frontier fallback for complex multi-file refactors, document Q&A with frontier fallback for cross-document synthesis. The Tianpan canary playbook applies — start the router conservative (90%[^39] to frontier, 10%[^39] to edge) and gradually shift traffic edge-ward as agreement-with-frontier holds.

**Regime C — Cloud-only.** Model > 13B parameters required (frontier reasoning, novel rubric, multilingual long-context), memory > 16GB devices unavailable in the deployment surface, or rubric changes too frequently to justify the distillation/fine-tune cycle. This is the default for most agentic-coding products today.

The five-axis selection rubric:
1. **Latency budget (p95)**: <100ms = small NPU model + INT4; <500ms = 3-8B with INT4 + KV cache; <2s = 13B-class via cloud; multi-second = frontier reasoning.
2. **Memory ceiling**: <4GB device = 1.5B-class quantized; 8GB = 3.8B (Phi-4-mini); 16GB = 8B (Llama 3.1); 64GB Mac = 70B-class via SSD streaming.
3. **Model size cap**: stable rubric = small specialist; novel rubric = frontier API.
4. **Rubric stability**: stable + auditable = fine-tune small specialist; frequently changing = prompt-engineered frontier with caching.
5. **Privacy/regulatory requirement**: on-device only (HIPAA, GDPR Article 6, financial-sector data residency) = edge-first; off-device acceptable = hybrid.

Use cases by regime (concrete):
- **Edge-first**: voice IVR (Parakeet ASR + Phi-4-mini intent), inline agent verification (Phi-4-mini-reasoning judge), content moderation (Granite-4-Micro classifier), RAG retrieval re-ranker (embeddinggemma-300m), vision OCR (paddleocr), depth + segmentation (depth-anything-v2 + yolo26).
- **Hybrid**: support chat with escalation, customer-knowledge-base Q&A with frontier fallback, structured-extraction with frontier verification on confidence-< -threshold cases.
- **Cloud-only**: GPT-5.1 / Claude Opus 4.7 / Gemini 3 Pro reasoning agents, complex coding with multi-file context, novel-domain analysis where the rubric has no precedent.

## Part VI — Production Operating Procedure

A six-step deployment recipe.

**Step 1 — Pick the model.** Phi-4-mini-flash-reasoning for reasoning-heavy edge workloads (math, code, structured planning); Phi-4-mini for general instruction following; Phi-4-multimodal for vision/audio/text mixed input; Qwen3-4B-Instruct for multilingual and Apache-2.0 license requirements; Llama-3.2-3B-NPU-Turbo for Android-specific latency optimization; LFM2-1.2B for the smallest NPU-resident specialist.[^15]

**Step 2 — Pick the runtime.** Apple Silicon (macOS or iOS) → MLX via `mlx-swift-examples` for native Swift, or `mlx` Python via `mlx-lm` for desktop scripting. Cross-platform (Windows + Linux + Android) → Olive + ONNX Runtime with the appropriate execution provider. Snapdragon NPU on Android → NexaSDK's "npu" plugin for pre-built variants, or ExecuTorch 1.0 + QNN backend for PyTorch-native AOT compilation.

**Step 3 — Quantize.** For NPU: `olive optimize --precision int4 --act_precision int8 --provider QNNExecutionProvider`. For GPU on Apple Silicon: Core ML INT4 block-wise PTQ (block size 32) + stateful KV cache. For CPU desktop: GPTQ to INT4 via `olive quantize --algorithm awq` then `olive auto-opt`. For maximum quality: AWQ — 3× speedup + 3× memory reduction vs FP16 with minimal accuracy loss.[^12]

**Step 4 — Validate against frontier.** Build a 100-1,000-example evaluation set with human-labelled ground truth or frontier-judge consensus. Run the on-device specialist on the eval set; run a frontier model on the same set; compute agreement. Target 85-90%[^39] agreement, the GPT-4-versus-human-expert baseline from the MT-Bench foundational paper. Sample 1-5%[^39] of production traffic daily for drift monitoring.

**Step 5 — Ship behind shadow + canary.** Route all production traffic to both on-device and frontier; serve only the champion (frontier on first deploy); log both outputs. Two-week shadow window. Compare on disagreements only; promotion threshold 30-40%.[^39] After promotion, canary 1%[^39] → 10%[^39] → 100%[^39] with automated rollback on p99 latency +40%,[^39] refusal rate +5%,[^39] or cost-budget breach. Required canary metrics: p50/p95/p99 latency, cost per request, error rates, output length distribution, user feedback rates per cohort.

**Step 6 — Monitor production.** ECE <5%[^39] calibration target. Reference-holdout accuracy with retraining trigger if drop > 5[^39] percentage points. Entropy-distribution monitoring across held-out examples. KS-test or PSI 0.1 input-distribution-drift threshold. ECR@1 (eval completion rate) alarms below 95%.[^39] For NPU deployments: `qnn_runtime_version` health check on every app start; if mismatch with build-time SDK version, fall back to CPU path (don't trust the kernel-panic path).[^14]

Operational pitfalls that derail teams:
- **iOS Simulator does not run MLX** — physical device only.[^6]
- **macOS Sequoia minimum deployment target** required for fused SDPA in Core ML — older targets get the slow attention path.[^5]
- **`increased-memory-limit` entitlement** required on iOS for any LLM load > ~3GB at runtime.[^6]
- **QNN SDK version mismatch** between AOT compile and runtime causes silent kernel panics, not graceful degradation.[^14]
- **Hexagon HTP 8-byte alignment violation** can cost 20-40% on memory-bound layers — verify allocator alignment in CI.[^14]
- **Per-chipset NPU binary targeting** required (Gen 3 vs Elite emit different HTP kernel-dispatch paths).[^14]
- **Phi-4-mini-flash-reasoning factual-knowledge ceiling** — at 3.8B parameters the model lacks capacity for broad factual recall; pair with RAG for any task requiring world knowledge beyond reasoning.[^17]

## Glossary

- **SambaY** — Decoder-hybrid-decoder architecture from the Phi-4-mini-flash-reasoning paper combining Mamba state-space modules, Sliding Window Attention, and a Gated Memory Unit.
- **GMU** — Gated Memory Unit; the central architectural innovation in SambaY for sharing memory readout states between layers without explicit positional encoding.
- **HTP** — Hexagon Tensor Processor; Qualcomm's NPU on Snapdragon SoCs that executes fused integer kernels on a fixed-function datapath.
- **QNN** — Qualcomm AI Engine Direct; the SDK tier for granular control over how each operation runs on the Hexagon NPU.
- **GENIE** — Generative AI Inference Extensions; QNN extension for LLMs.
- **VTCM** — Vector Tightly-Coupled Memory; the HTP's on-die scratchpad memory for resident activations.
- **AOT** — Ahead-of-Time graph compilation; relocates kernel selection from device first-call to developer build.
- **AWQ** — Activation-aware Weight Quantization; 4-bit method delivering 3× speedup + 3× memory reduction vs FP16.
- **GPTQ** — Generative Pre-trained Transformer Quantization; one-shot weight quantization to 8/4/3/2 bits.
- **HQQ** — Half-Quadratic Quantization for MatMul; alternative 4-bit method.
- **Stateful KV cache** — Core ML / ONNX Runtime feature for reusing computed attention keys and values across decoding iterations.
- **Palettization** — Apple Core ML quantization technique that maps weights to a small palette of values per block.
- **Block-wise quantization** — Quantization at higher granularity than per-tensor (block size 32 in Apple's recipe) to minimise accuracy loss.

## Quotable Findings

1. Phi-4-mini-flash-reasoning (3.8B) reaches **AIME24 52.29 / AIME25 33.59 / Math500 92.45 / GPQA-Diamond 45.08** — beating both Bespoke-Stratos-7B and OpenThinker-7B and matching DeepSeek-R1-Distill-Qwen-7B at half the parameter count.[^1]
2. The hybrid SambaY architecture delivers **2-3× lower latency and up to 10× higher throughput** vs Phi-4-mini-reasoning at 2K prompt + 32K generation on a single A100-80G.[^2]
3. Llama-3.1-8B-Instruct hits **~33 tokens/sec decoding** on M1 Max via Core ML INT4 + stateful KV cache + auto-fused SDPA.[^5]
4. ExecuTorch 1.0 + QNN HTP backend delivers **40% binary size reduction**, **3-5× power efficiency** improvement, **70% lower runtime init latency**, and **10× throughput gain** vs CPU on Hexagon NPU.[^14]
5. AWQ quantization to 4-bit gives **3× speedup + 3× memory reduction** vs FP16 on Olive's auto-optimization toolkit.[^12]
6. SwiftLM's SSD expert streaming achieves **10× speedup** running Qwen3.5-122B (69.6 GB) on a 64GB Mac via NVMe streaming.[^9]

## Related Research

- [Specialized LLM Judge Models: The 2026 Field Manual](https://www.perea.ai/research/specialized-llm-judge-models-2026) — the judge-model side of the same fine-tuning economics; specialists for evaluating edge-deployed students.
- [Knowledge Distillation in Production: The 2026 Pipeline](https://www.perea.ai/research/knowledge-distillation-production-pipeline) — the production pipeline that produces the small specialists this manual deploys.
- [Computer-Use Agents and the Deployment Overhang](https://www.perea.ai/research/computer-use-deployment-overhang) — the gap between capability and trust that limits edge agent deployment.
- [The Agent Observability Stack](https://www.perea.ai/research/agent-observability-stack) — observability layer for catching edge-model drift in production.

## References

[^1]: NVIDIA NIM model card, "phi-4-mini-flash-reasoning" — https://build.nvidia.com/microsoft/phi-4-mini-flash-reasoning/modelcard

[^2]: Microsoft Azure Blog, "Reasoning reimagined: Introducing Phi-4-mini-flash-reasoning" (Jul 9 2025) — https://azure.microsoft.com/en-us/blog/reasoning-reimagined-introducing-phi-4-mini-flash-reasoning/

[^3]: NVIDIA NIM API reference, "microsoft/phi-4-mini-flash-reasoning" — https://docs.api.nvidia.com/nim/reference/microsoft-phi-4-mini-flash-reasoning

[^4]: Microsoft Foundry catalog page, "Phi-4-mini-flash-reasoning" — https://ai.azure.com/catalog/models/Phi-4-mini-flash-reasoning

[^5]: Apple Machine Learning Research, "On Device Llama 3.1 with Core ML" (May 14 2024) — https://machinelearning.apple.com/research/core-ml-on-device-llama

[^6]: Strathweb, "Running Phi models on iOS with Apple MLX Framework" (Mar 1 2025) — https://strathweb.com/2025/03/running-phi-models-on-ios-with-apple-mlx-framework/

[^7]: HuggingFace mlx-community Phi-4-mini-instruct-4bit (referenced in MLX Swift Examples) — https://hf.co/microsoft/Phi-4-mini-flash-reasoning

[^8]: macMLX, "Native macOS LLM inference for Apple Silicon" (Apr 18 2026) — https://macmlx.app/

[^9]: SharpAI/SwiftLM GitHub repository — https://github.com/SharpAI/mlx-server

[^10]: Microsoft Olive documentation — https://microsoft.github.io/Olive/

[^11]: Olive `optimize` CLI documentation — https://microsoft.github.io/Olive/how-to/cli/cli-optimize.html

[^12]: Olive `quantize` CLI documentation (AWQ + GPTQ + HQQ + RTN techniques) — https://microsoft.github.io/Olive/how-to/cli/cli-quantize.html

[^13]: Microsoft PhiCookBook, "Quantizing Phi Family using Generative AI extensions for onnxruntime" — https://github.com/microsoft/PhiCookBook/blob/main/md/01.Introduction/04/UsingORTGenAIQuantifyingPhi.md

[^14]: AxiomLogica, "Optimizing Large-Language Model Inference with ExecuTorch 1.0 on Qualcomm Hexagon NPUs" (Apr 12 2026) — https://axiomlogica.com/ai-ml/optimizing-executorch-1-0-qualcomm-hexagon-npu-inference

[^15]: Nexa Documentation, "Nexa SDK Android Overview" — https://docs.nexa.ai/en/nexa-sdk-android/overview

[^16]: Nexa Documentation, "NPU API Reference" — https://docs.nexa.ai/en/nexa-sdk-android/APIReference_NPU

[^17]: HuggingFace, "microsoft/Phi-4-mini-flash-reasoning" model card — https://hf.co/microsoft/Phi-4-mini-flash-reasoning

[^18]: ml-explore/mlx GitHub repository — https://github.com/ml-explore/mlx/

[^19]: Apple Open Source MLX project page — https://opensource.apple.com/projects/mlx

[^20]: Qualcomm Developer Network, "Qualcomm AI Runtime (QAIRT) Overview" — https://docs.qualcomm.com/bundle/publicresource/topics/80-63442-50/htp_guidelines_int4_weights.html

[^21]: Qualcomm AI Hub Workbench, "Quantization examples" — https://workbench.aihub.qualcomm.com/docs/hub/quantize_examples.html

[^22]: Microsoft Olive GitHub repository — https://github.com/microsoft/Olive

[^23]: Microsoft, "Knowledge Distillation of Large Language Models (MiniLLM)" — https://www.microsoft.com/en-us/research/publication/knowledge-distillation-of-large-language-models/

[^24]: ONNX Runtime documentation referenced via Olive auto-opt — https://microsoft.github.io/Olive/

[^25]: HuggingFace mlx-community organization page — https://huggingface.co/mlx-community

[^26]: NexaAI HuggingFace organization — https://huggingface.co/NexaAI

[^27]: ExecuTorch 1.0 PyTorch upstream project — https://github.com/pytorch/executorch

[^28]: Anthropic Model Context Protocol referenced in macMLX — https://www.anthropic.com/news/model-context-protocol

[^29]: HuggingFace Phi-4-mini-instruct base model — https://huggingface.co/microsoft/Phi-4-mini-instruct

[^30]: Microsoft Phi-4-multimodal-instruct model card — https://huggingface.co/microsoft/Phi-4-multimodal-instruct

[^31]: Apple Core ML Tools documentation — https://apple.github.io/coremltools/

[^32]: HuggingFace Qwen2.5-0.5B-Instruct (Olive optimize example) — https://huggingface.co/Qwen/Qwen2.5-0.5B-Instruct

[^33]: Microsoft Phi-3.5-mini-instruct model card — https://huggingface.co/microsoft/Phi-3.5-mini-instruct

[^34]: NexaAI/phi4-mini-npu-mobile model card — https://huggingface.co/NexaAI/phi4-mini-npu-mobile

[^35]: NexaAI/Llama3.2-3B-NPU-Turbo model card — https://huggingface.co/NexaAI/Llama3.2-3B-NPU-Turbo

[^36]: ml-explore/mlx-swift-examples repository — https://github.com/ml-explore/mlx-swift-examples

[^37]: NexaAI/Granite-4-Micro model card — https://huggingface.co/NexaAI/Granite-4-Micro

[^38]: NexaAI/OmniNeural-4B vision-language model — https://huggingface.co/NexaAI/OmniNeural-4B

[^39]: Tianpan production-distillation pattern (Apr 2026) — referenced via the `knowledge-distillation-production-pipeline` paper canon — https://tianpan.co/blog/2026-04-19-knowledge-distillation-production-small-models

[^40]: AxiomLogica practitioner Hexagon NPU performance benchmarks (Apr 2026) — https://axiomlogica.com/ai-ml/optimizing-executorch-1-0-qualcomm-hexagon-npu-inference

[^41]: Strathweb iOS reference implementation Phi-4-mini-instruct-4bit (Mar 2025) — https://strathweb.com/2025/03/running-phi-models-on-ios-with-apple-mlx-framework/

[^42]: macMLX OpenAI-compatible HTTP API + tiered KV cache + multi-model pool (Apr 2026) — https://macmlx.app/

[^43]: Inferless DeepSeek-R1-Distill-Qwen-32B vLLM A100 deployment guide (referenced for cold-start + inference-time benchmarks) — https://docs.inferless.com/how-to-guides/deploy-DeepSeek-R1-Distill-Qwen-32B

[^44]: DataOps School 2026 KD production guide (referenced for production failure modes) — https://dataopsschool.com/blog/knowledge-distillation/

[^45]: Particula Tech 7B-vs-flagship cost analysis (Dec 2025) — https://particula.tech/blog/when-to-use-smaller-models-vs-flagship-models

[^46]: DeployBase LLM serving framework comparison vLLM vs SGLang vs TensorRT-LLM vs TGI (Jul 2025) — https://deploybase.ai/articles/llm-serving-framework-comparison

[^47]: AwesomeAgents 2026 best open-source LLM inference servers roundup — https://awesomeagents.ai/tools/best-open-source-llm-inference-servers-2026/

[^48]: DeepSeekAI guide R1 Distill family overview (Apr 2026) — https://deepseekai.guide/models/deepseek-r1-distill/

[^49]: Tianpan shadow/canary/A-B testing for LLMs (Apr 2026) — https://tianpan.co/blog/2026-04-09-llm-gradual-rollout-shadow-canary-ab-testing

[^50]: Decode the Future adversarial-distillation enforcement landscape (Apr 2026) — https://decodethefuture.org/en/adversarial-distillation/

[^51]: NexaAI HuggingFace organization page — https://huggingface.co/NexaAI

[^52]: Boolean & Beyond fine-tuning vs API cost analysis (Mar 2026) — https://booleanbeyond.com/en/insights/fine-tuning-open-source-llm-vs-claude-gpt4-api-cost-quality

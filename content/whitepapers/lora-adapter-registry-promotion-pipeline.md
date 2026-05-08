---
title: "The LoRA Adapter Registry"
subtitle: "Versioning, promotion, and rollback discipline for production multi-adapter inference at 50+ adapters"
publication: "perea.ai Research"
authors: ["Dante Perea"]
version: "1.0"
status: "Public draft"
date: "2026-05"
audience: "ML platform engineers, inference-serving teams, SRE/MLOps practitioners running multi-tenant LoRA deployments at 30+ adapter scale"
length: "~2,800 words"
license: "CC BY 4.0"
description: "Production playbook for LoRA adapter registry discipline. Manifest-bound base-model coupling (commit hash + quantization config + tokenizer revision), shadow validation, namespace conventions, and the rollback contract. Catalogs the silent-failure modes (rope_scaling drift, target_modules mismatch with no error, layer-prefix conversion bugs in vLLM, BnB compute_dtype mismatches that produce NaN, hotswap rank constraints) and prescribes the manifest schema, registry storage architecture (JSON → DuckDB transition at 30 adapters), LRU caching contract, and pin/promote/rollback ops surface."
profile: "technical-playbook"
---

## Executive summary

LoRA adapters are not standalone models — they are deltas tightly coupled to a specific base model commit, quantization configuration, tokenizer revision, and rope scaling parameters. The compatibility cliff is real and silent: an adapter trained against `meta-llama/Llama-2-7b-hf` commit `abc123` with `target_modules=['q_proj', 'v_proj']` and 4-bit NF4 quantization will load against the same model identifier at commit `def456` without raising any error, but inference will produce garbage outputs because layer names changed, the quantization config drifted, or rope scaling shifted between commits.[^1][^2] This paper specifies the registry-and-promotion pipeline that production teams running 50+ adapters need to ship without the silent-regression class of failures.

The core primitives:

- **Manifest binding** — every adapter is published with a JSON manifest committing it to a specific base model ID + commit hash, quantization configuration (`load_in_4bit`, `bnb_4bit_quant_type`, `bnb_4bit_compute_dtype`, `bnb_4bit_use_double_quant`), LoRA hyperparameters (rank, alpha, dropout, target_modules), training script git commit, and an SHA-256 weight hash.[^1][^3]
- **Shadow validation** — before any adapter promotes from staging to production, it must pass a forward-pass test on a fixed golden dataset using the locked base-model commit hash; the validation report (pass rate, NaN count, parameter sum check) attaches to the manifest.[^1][^4]
- **Storage architecture** — JSON file per adapter plus a content-addressable artifact store (S3 or HuggingFace Hub) works at <30 adapters; transition to a DuckDB or Postgres metadata index plus content-addressable artifact storage at 30+ adapters.[^3]
- **Inference contract** — vLLM's LRUCacheLoRAModelManager enforces `lora_slots` capacity with LRU eviction; latency-sensitive adapters can be pinned via the LoRA model manager's `pin_adapter` call; dynamic loading from a shared cache directory landed in vLLM PR #14634 in March 2025.[^5][^6][^7]
- **Promotion gate** — adapters move backlog → staging → canary → production with one config change per stage; staging requires manifest + validation report present, canary requires <1% traffic for 24 hours with golden-eval drift below epsilon, and production requires explicit signature verification.[^1]

The paper is a field manual for the platform team that has 5+ adapters live and is hitting the wall where ad-hoc deployment patterns fail. It catalogs the silent-failure modes drawn from peer-reviewed and open-source incident reports, specifies the manifest schema, walks through the storage architecture transition at the 30-adapter mark, and ends with the four-step promotion gate.

## The compatibility cliff: silent failure modes

### Mode 1: rope_scaling drift

The most insidious mistake. The Neural Base advanced course documents the canonical scenario: an adapter is registered with `base_model_id='meta-llama/Llama-2-7b-hf'` but the underlying model on disk was loaded with `rope_scaling={'type': 'linear', 'factor': 2}`. The adapter loads without error but produces garbage outputs because the LoRA weights were trained on a differently-scaled position embedding.[^3] The registry must capture the full quantization config and rope settings, not just the base model ID. The contract is `model.config.to_dict()` hashed in entirety, not the ID.

### Mode 2: target_modules mismatch with no error

The Hugging Face PEFT library's `target_modules` parameter selects which base-model layers receive LoRA injections. Specifying wrong target_modules — for example `["q_proj", "v_proj"]` for a Mistral model that uses different attention-layer naming — silently applies LoRA to nothing.[^8][^9] The validation contract is `sum(p.numel() for p in model.parameters() if 'lora' in str(p))` — if zero, no adapter is actually present despite a successful load call.[^4][^9] PEFT's `LoraConfig` parameter `init_lora_weights=True` (default) sets the LoRA B matrix to 0, so an unmerged adapter behaves as a no-op until trained — meaning a "successful load" of an adapter that targets no real modules produces base-model output indistinguishable from no-LoRA at all.[^10]

### Mode 3: BnB compute_dtype mismatch produces NaN or silent regression

bitsandbytes' `bnb_4bit_compute_dtype` must match what was used during training. The QLoRA Cheat Sheet documents the production gotcha: setting `bnb_4bit_compute_dtype=torch.float16` when the model was trained on `torch.bfloat16` produces NaN logits or silent quality regression, not a load error.[^11] Llama 2 is bfloat16-native; older models are float16-native. The manifest must lock both `bnb_4bit_quant_type` ('nf4') and `bnb_4bit_compute_dtype`, with double-quantization as a third dimension that affects scaling-factor compression.[^11][^12]

### Mode 4: layer-prefix conversion bugs in serving frameworks

vLLM issue #34591 documents a real production failure: loading a LoRA adapter against `mistralai/Ministral-3-8B-Instruct-2512` succeeds without error, but generations match the base model exactly because vLLM implemented the model under `PixtralForConditionalGeneration` while the LoRA was trained against `Mistral3ForConditionalGeneration`. Only the latter implemented the `hf_to_vllm_mapper` that converts HuggingFace prefix names to vLLM's internal naming. The fix landed in PR #36963 in March 2026; the workaround was patching `PixtralForConditionalGeneration.hf_to_vllm_mapper` with the correct prefix mapping.[^7] The class of failure is broader than this one bug: any time the serving framework's internal layer naming diverges from the training framework's, adapters can load silently with zero effect.

### Mode 5: hotswap rank/alpha constraints

HuggingFace Transformers v5.4 added `enable_peft_hotswap(target_rank=max_rank)` for in-place adapter swap without recompiling under torch.compile.[^13] The constraint: hotswapped adapters must have rank/alpha compatible with the maximum rank declared at hotswap-enable time. If a registry serves adapters with mixed ranks (e.g., r=8 alongside r=64), the hotswap path will either reject the load or silently clip the higher-rank adapter to the configured target_rank.[^13] The manifest must record `lora_rank` and `lora_alpha` so the inference layer can route by-rank or pre-allocate `target_rank=max(rank_across_registry)`.

### Mode 6: provider silent updates

The Tianpan April 2026 analysis documents the broader class: in February 2026, all fine-tuned `gpt-4o` and `gpt-4o-mini` models experienced complete chat-completion failures while base models continued working. In a separate incident, a developer's fine-tuned model output started matching base-model output exactly — fine-tune behavior simply disappeared after a provider-side change. First-line monitoring did not detect either incident.[^2] The lesson: provider-hosted fine-tunes (OpenAI fine-tunes, Anthropic Claude fine-tunes when those become available) carry the same silent-update risk as self-hosted base-model upgrades, and the monitoring contract must include golden-eval drift detection, not just liveness checks.

## The manifest schema

The manifest is the single source of truth. The Neural Base advanced course's reference implementation captures the production-ready shape:[^1]

```python
manifest = {
    'adapter_version': f'{datetime.now().strftime("%Y%m%d_%H%M%S")}_{weights_hash}',
    'base_model_id': base_model_id,
    'base_model_commit': base_model_commit,
    'adapter_checkpoint': str(adapter_weights_path),
    'weights_sha256': weights_hash,
    'lora_rank': lora_config.r,
    'lora_alpha': lora_config.lora_alpha,
    'lora_dropout': lora_config.lora_dropout,
    'target_modules': lora_config.target_modules,
    'quantization_config': {
        'load_in_4bit': True,
        'bnb_4bit_compute_dtype': 'bfloat16',
        'bnb_4bit_quant_type': 'nf4',
        'bnb_4bit_use_double_quant': True
    },
    'training_metadata': training_metadata,
    'deployment_timestamp': datetime.utcnow().isoformat(),
    'validation_status': 'pending'
}
```

For production hardening, append:

- `tokenizer_revision` — the exact tokenizer commit hash; chat-template drift between tokenizer revisions corrupts training signal.[^11]
- `rope_scaling` — the exact `model.config.rope_scaling` dict; pin or null.[^3]
- `training_git_commit` — the git SHA of the training script that produced the adapter; couples the adapter to the script that made it.[^3]
- `validation_report` — the full forward-pass result on the golden dataset (pass rate, NaN/Inf check, parameter-sum check, golden-output hash).[^4]
- `previous_version` — the immediately-prior adapter version for fast rollback.[^3]
- `tested_on_models` — list of base-model commits this adapter has been validated against (for transfer-learning comparisons).[^3]
- `signing_key_id` — for environments with adapter-signing requirements (see `agent-cryptographic-signing-jose-cose`).

The full manifest hashes deterministically; that hash plus the weights SHA-256 form a content-addressable identifier.

## Storage architecture transitions

### Stage 1: <10 adapters, JSON-on-disk

A single JSON file per adapter directory plus a `registry.json` index works. The Neural Base reference implementation uses Python `json.dump` for the manifest with adapter weights at `adapter_model.safetensors`. Validation by `registry.validate_compatibility(adapter_version, model_id, dtype)` returns True for matches, raises ValueError with 'mismatch' for failures.[^3]

### Stage 2: 10-30 adapters, S3 + DynamoDB index

S3 holds content-addressable adapter bundles at `s3://<bucket>/adapters/<base_model_id>/<adapter_version>/`. DynamoDB indexes the manifest fields for query: `(base_model_id, adapter_version)` partition + sort key, with secondary indexes on `validation_status` and `deployment_timestamp`. The Neural Base course's adapter deployment automation specifies the canonical pattern: `YYYYMMDD_HHMMSS_<weights_hash>` version naming, manifest.json next to weights, deployment-timestamp ordering for audit trail.[^1]

### Stage 3: 30+ adapters, DuckDB index + content-addressable storage

The Neural Base advanced course documents the threshold: at 30+ adapters, JSON file I/O becomes a bottleneck because every operation reads the full file.[^3] DuckDB or Postgres holds the metadata index; S3 or HuggingFace Hub holds the artifact bundles. Indexed lookups on (`base_model_id`, `adapter_version`, `validation_status`, `signing_key_id`, `tested_on_models`) become O(log n).[^3]

### Stage 4: MLflow PEFT-flavor integration for organizations standardized on MLflow

MLflow's `mlflow.transformers.log_model()` with PEFT models stores only adapter weights and records the base model HuggingFace ID + commit hash via `_resolve_base_model_revision()`.[^14][^15] The flavor config stores `peft_adaptor`, `pipeline_model_type`, `source_model_name`, `source_model_revision`, `task`, `torch_dtype`, `tokenizer_type`, plus prompt-template metadata.[^14] MLflow PR #22052 (March 2026) added `base_model_path` parameter for local-base-model references, important for air-gapped/offline environments where HF Hub is unreachable at serve time.[^15] The April 2026 mlflow.diffusers flavor (commit b65ea7a) extends the same pattern for diffusion-model LoRA adapters with base model referenced by ID and downloaded at inference time.[^16] MLflow Model Registry's `@champion` and `@challenger` aliases map directly to a promotion-gate workflow.[^16]

## The inference contract

vLLM's LoRA serving model is the de facto multi-tenant inference contract for self-hosted deployments.

### LRU cache with bounded slots

`LRUCacheWorkerLoRAManager` (vllm/lora/worker_manager.py) uses an LRU Cache: every request loads the requested LoRA if not cached, and least-recently-used adapters are evicted when the cache is above capacity.[^5][^6] The capacity is configured by the `lora_slots` LoRAConfig parameter. When the number of requested LoRAs exceeds `lora_slots`, vLLM raises a RuntimeError rather than silently degrading.[^6] The eviction order: when a new adapter loads and the cache will exceed capacity, the manager removes the oldest adapter via `_adapter_manager.remove_oldest_adapter()`.[^6]

### Pinning latency-sensitive adapters

vLLM PR #5603 (June 2024) added support for pinning adapters in the LRU cache. The `pin_adapter(lora_int_id)` call on the manager prevents eviction of latency-sensitive adapters that would otherwise be evicted under load.[^17][^5] The contract: pinned adapters count against `lora_slots` capacity but cannot be removed until explicitly unpinned. This is the production primitive for "always-warm" adapters.

### Dynamic loading from a shared cache directory

vLLM PR #14634 (March 2025) added a `--lora-adapter-cache` CLI flag plus the `VLLM_ALLOW_RUNTIME_LORA_UPDATING=1` environment variable. With these set, vLLM checks a configured directory for adapter weights when receiving a request for an unrecognized adapter, with the path convention `VLLM_ADAPTER_CACHE/<model_name>`.[^18] The intended deployment is a Kubernetes persistent volume mounted into the vLLM pod; vLLM does not write to the cache, only reads.[^18] The corresponding RFC #12174 documents the broader problem: the only "non-development" way to serve LoRA adapters in vLLM today is to pre-declare them via `--lora-modules`, which forces a redeploy for new adapters.[^19] The development-mode `/v1/load_lora_adapter` and `/v1/unload_lora_adapter` endpoints exist behind `VLLM_ALLOW_RUNTIME_LORA_UPDATING=True` but neither propagate to all replicas nor survive a replica restart.[^19]

### The hotswap path under torch.compile

For serving stacks that compile the model with torch.compile, HuggingFace Transformers' `enable_peft_hotswap(target_rank=max_rank)` is the only safe path to swap adapters without recompiling.[^13] The order of operations: enable hotswap before loading any adapter, with `target_rank` set to the maximum rank across all adapters that will ever load. The benefit is no torch.compile cache invalidation when switching adapters; the constraint is that all adapters loaded after enable_peft_hotswap must have rank ≤ target_rank.[^13]

## The promotion gate

A four-step gate that the registry enforces before any adapter reaches production traffic:

### Step 1: backlog → staging

Triggered by adapter training completion. Requires:

- manifest.json populated with all required fields (base_model_commit, weights_sha256, lora_rank/alpha, target_modules, quantization_config, training_git_commit).
- adapter_model.safetensors present at the manifest's `adapter_checkpoint` path.
- adapter_config.json (PEFT's auto-generated config) consistent with manifest fields.

The registry's `register_adapter()` call is idempotent; re-running with the same `weights_sha256` is a no-op. After registration, the adapter is `validation_status: pending`.

### Step 2: staging → canary

Triggered by validation pipeline. Runs:

- forward-pass on a fixed 50-100 prompt golden dataset using the locked `base_model_commit`.
- LoRA-parameter-count check (`sum(p.numel() if 'lora' in name) > 0`).[^4]
- NaN/Inf check on output logits.[^4][^11]
- output-hash comparison against the previous adapter version's golden output (drift threshold configurable; typical value is 5-15% token-overlap delta).
- validation report attaches to the manifest with `validation_status: passed` or `failed` plus pass_rate.

If `pass_rate >= 0.8` (the Neural Base reference threshold), the adapter promotes to canary.[^1] Else it rolls back to backlog with a diagnostic field on the manifest. CPU-only validation catches weight corruption early.[^3]

### Step 3: canary → production

Triggered by manual approval or by an automated traffic-shift policy. Routes <1% of production traffic to the canary adapter for a configurable window (typically 24 hours). Monitors:

- error rate vs production baseline.
- output-distribution drift via golden-eval samples taken from production traffic.
- latency (canary should not increase per-token latency by >10% — a higher delta indicates the LRU cache is thrashing).

If all monitors stay within band, the adapter promotes to production via a single config change: the canary tag becomes the production tag.

### Step 4: production rollback

Single-config-change rollback: the `previous_version` field on the new adapter manifest names the prior production adapter. Setting `production_version: <previous_version>` restores prior behavior in one config update without redeployment, assuming the prior adapter is still in the registry and its manifest's `is_retired` flag is not set.[^3]

## Namespace conventions and access control

For 50+ adapters, namespace adapters by team or use case. The Neural Base course recommends `<team-prefix>/<base-model>/<task>` as the path convention (e.g., `support-tier1/llama-2-7b/triage-v3`).[^3] UUID-suffix conventions work for multi-tenant SaaS where adapters belong to opaque tenant IDs. Avoid free-form names — collisions cause silent overwrites in S3.

For production access control, the registry enforces:

- training role can write to `staging/` paths but not `production/`.
- signing role can move manifests from `staging/` to `canary/` only after `validation_status: passed`.
- activation role can move manifests from `canary/` to `production/` after canary monitor window completes.

Three-role separation is the enterprise-grade primitive (see `agent-cryptographic-signing-jose-cose` for the cryptographic-signing-of-adapters layer).

## Pitfalls to design out

The Neural Base course and the field-incident corpus catalog the recurring failure modes:[^1][^2][^3][^4][^11]

- **Auto-pulling the latest base model commit.** The manifest must lock `base_model_commit` and the inference framework must load that exact commit, not the floating tag. HuggingFace's `from_pretrained(model_id, revision=base_model_commit)` is the correct primitive.
- **Adapter weights and metadata in different storage locations.** Causes version skew. Always co-locate adapter_model.safetensors, adapter_config.json, and manifest.json in the same content-addressable directory.[^1]
- **Storing only `bnb_4bit_quant_type='nf4'` without `bnb_4bit_compute_dtype`.** The compute dtype matters as much as the storage dtype.[^11][^12]
- **Using `model.merge_and_unload()` in a serving stack.** Merging dequantizes the 4-bit base to full precision, increasing model size 4x and breaking the multi-adapter LRU cache assumption.[^11][^12]
- **NFS file locking failures with multi-worker inference.** The recommended primitive is content-addressable S3 storage, not shared NFS — NFS file locking does not work reliably with concurrent vLLM workers reading from the same path.

## What this paper does not cover

It does not analyze cross-base-model adapter portability — the MUSCLE paper's finding is sobering: there is no migration path for adapter weights from base model version N to N+1.[^2] It does not cover IA3, AdaLoRA, DoRA, OLoRA, or PiSSA, which require different manifest fields.[^10] It does not analyze diffusion-model adapter promotion (covered partially by mlflow.diffusers).[^16] It does not analyze the cryptographic-signing layer for production adapters — that is covered in the companion `agent-cryptographic-signing-jose-cose` paper.

It also does not benchmark inference-time overhead of dynamic LoRA loading, evict-and-reload latency under load, or the wall-clock cost of forward-pass validation for a 7B-parameter base model. Those are deployment-specific measurements.

## Implications for platform teams

The registry is not an MLOps nice-to-have. It is the load-bearing primitive that prevents the silent-failure class of incidents that have been documented in vLLM, MLflow, OpenAI fine-tuning, and HuggingFace PEFT issue trackers throughout 2025-2026.[^2][^7][^15] At <10 adapters, JSON-on-disk + content-addressable artifact bundles is sufficient. At 30+ adapters, the JSON full-file-read overhead breaks; transition to DuckDB-or-Postgres metadata index. At 50+ adapters, namespace conventions and three-role access control prevent accidental cross-team overwrites.

The promotion gate is the second load-bearing primitive. Forward-pass validation on a fixed golden dataset against the locked base model commit catches the rope_scaling, target_modules, and BnB compute_dtype classes of silent failure before they reach traffic. Canary monitoring with golden-eval drift detection catches the model-versioning class of silent failure. Single-config-change rollback via the `previous_version` manifest field bounds blast radius to one promotion.

The inference contract is the third primitive. vLLM's LRU cache with `pin_adapter` and dynamic loading from a shared cache directory is the de facto self-hosted multi-tenant pattern.[^5][^6][^17][^18] HuggingFace's `enable_peft_hotswap(target_rank=max_rank)` is the corresponding primitive for torch.compile-served stacks.[^13] Either path requires the manifest's `lora_rank` and `quantization_config` fields to route requests correctly.

Teams that have shipped 50+ adapters without these three primitives have shipped silent-failure footguns. Teams that have shipped them have a registry, a promotion gate, and a rollback contract. The work here is taxonomy and discipline, not novel research.

## References

[^1]: Neural Base "Adapter Deployment Automation" advanced course module with full deployment-manifest pattern. https://theneuralbase.com/lora-qlora/learn/advanced/adapter-deployment-automation/
[^2]: Tianpan blog "The Adapter Compatibility Cliff: When Your Fine-Tune Meets the New Base Model," 2026-04-14. https://tianpan.co/blog/2026-04-14-adapter-compatibility-cliff
[^3]: Neural Base "Model registry for adapter versions" advanced course module with rope_scaling and DuckDB-transition guidance. https://theneuralbase.com/lora-qlora/learn/advanced/model-registry-for-adapter-versions/
[^4]: Neural Base "Adapter not loading correctly" beginner course module with parameter-count and forward-pass validation patterns. https://theneuralbase.com/lora-qlora/learn/beginner/adapter-not-loading-correctly/
[^5]: vLLM project source `vllm/lora/worker_manager.py` with WorkerLoRAManager and LRUCacheWorkerLoRAManager implementations. https://github.com/vllm-project/vllm/blob/main/vllm/lora/worker_manager.py
[^6]: vLLM v0.9.0 docs for `vllm.lora.worker_manager` API reference. https://docs.vllm.ai/en/v0.9.0/api/vllm/lora/worker_manager.html
[^7]: vLLM Issue #34591 "Ministral-3 LoRA adapter fails silently" 2026-02-15, with hf_to_vllm_mapper bug and PR #36963 fix. https://github.com/vllm-project/vllm/issues/34591
[^8]: HuggingFace PEFT GitHub repository README with LoraConfig + get_peft_model patterns. https://github.com/huggingface/PEFT
[^9]: HuggingFace docs "PEFT configurations and models" with LoraConfig schema and target_modules. https://huggingface.co/docs/peft/tutorial/peft_model_config
[^10]: HuggingFace docs "LoRA — peft" package reference with init_lora_weights options including LoftQ, EVA, OLoRA, PiSSA, CorDA, orthogonal. https://huggingface.co/docs/peft/en/package_reference/lora
[^11]: Neural Base "QLoRA Cheat Sheet" with bitsandbytes BnbConfig pitfalls and dtype constraints. https://theneuralbase.com/cheatsheet/qlora/
[^12]: HuggingFace forum entry "What quantization for fine-tuning" with NF4 + bf16 compute_dtype guidance. https://huggingface.co/datasets/John6666/forum1/blob/main/what_quant_for_ft.md
[^13]: HuggingFace Transformers docs "PEFT" main classes with PeftAdapterMixin.load_adapter and enable_peft_hotswap. https://huggingface.co/docs/transformers/main_classes/peft
[^14]: MLflow docs "Fine-Tuning Open-Source LLM using QLoRA with MLflow and PEFT" with adapter-only logging pattern. https://mlflow.org/docs/3.1.3/ml/deep-learning/transformers/tutorials/fine-tuning/transformers-peft/
[^15]: MLflow Issue #22020 "Support adapter-only saving for PEFT models with local base model paths" 2026-03-25, with PRs #22052 and #22101 fix. https://github.com/mlflow/mlflow/issues/22020
[^16]: MLflow commit b65ea7a "Add `mlflow.diffusers` flavor for diffusion model LoRA adapters" 2026-04-20. https://github.com/mlflow/mlflow/commit/b65ea7a97e98db2c676f508c1120e7eebed04287
[^17]: vLLM PR #5603 "Add support for pinning lora adapters in the LRU cache" 2024-06-17. https://github.com/vllm-project/vllm/pull/5603
[^18]: vLLM PR #14634 "Allow dynamic loading of LoRA adapters in a cache dir" 2025-03-11. https://github.com/vllm-project/vllm/pull/14634
[^19]: vLLM RFC Issue #12174 "Distribute LoRA adapters across deployment" 2025-01-17. https://github.com/vllm-project/vllm/issues/12174
[^20]: HuggingFace PEFT docs "Load adapters with PEFT" v4.36.0 with hotswap and multi-adapter patterns. https://huggingface.co/docs/transformers/v4.36.0/peft
[^21]: HuggingFace `safetensors` library documentation. https://huggingface.co/docs/safetensors/index
[^22]: HuggingFace `bitsandbytes` integration documentation with BitsAndBytesConfig schema. https://huggingface.co/docs/transformers/quantization/bitsandbytes
[^23]: NVIDIA NeMo framework documentation on LoRA adapter management. https://docs.nvidia.com/nemo-framework/user-guide/latest/peft/
[^24]: AWS SageMaker documentation on LoRA fine-tuning model registry patterns. https://docs.aws.amazon.com/sagemaker/latest/dg/jumpstart-foundation-models-fine-tuning.html
[^25]: Microsoft Azure ML documentation on LoRA adapter registration. https://learn.microsoft.com/en-us/azure/machine-learning/concept-foundation-models
[^26]: Google Vertex AI documentation on tuned-model deployment for LoRA. https://cloud.google.com/vertex-ai/docs/generative-ai/models/tune-models
[^27]: Anthropic documentation on Claude fine-tuning availability. https://docs.anthropic.com/claude/docs/fine-tuning
[^28]: OpenAI fine-tuning documentation. https://platform.openai.com/docs/guides/fine-tuning
[^29]: HuggingFace Hub documentation on commit hashes and revisions. https://huggingface.co/docs/hub/repositories-getting-started
[^30]: HuggingFace `transformers` documentation on `from_pretrained` revision parameter. https://huggingface.co/docs/transformers/main_classes/model
[^31]: bitsandbytes GitHub repository with NF4 implementation. https://github.com/TimDettmers/bitsandbytes
[^32]: PyTorch torch.compile documentation. https://pytorch.org/docs/stable/torch.compiler.html
[^33]: DuckDB documentation on indexes and concurrent access. https://duckdb.org/docs/sql/indexes
[^34]: PostgreSQL documentation on partition tables for time-series data. https://www.postgresql.org/docs/current/ddl-partitioning.html
[^35]: AWS S3 documentation on object versioning and content addressing. https://docs.aws.amazon.com/AmazonS3/latest/userguide/Versioning.html
[^36]: vLLM PR #14634 follow-up plugin discussion in Issue #10546. https://github.com/vllm-project/vllm/issues/10546
[^37]: vLLM Issue #34186 referenced by #34591 for similar silent-failure pattern. https://github.com/vllm-project/vllm/issues/34186
[^38]: PEFT TUTORIALS with LoRA-GA and base-weight-modification guidance. https://huggingface.co/docs/peft/conceptual_guides/adapter
[^39]: TheNewStack analysis on multi-tenant LoRA serving architecture. https://thenewstack.io/multi-tenant-lora-serving-2025/
[^40]: InfoQ feature on adapter registry patterns at scale. https://www.infoq.com/news/2025/adapter-registry-patterns/
[^41]: Security Boulevard analysis of model-supply-chain attestation. https://securityboulevard.com/2025/model-supply-chain-attestation/
[^42]: Help Net Security on AI model versioning and SBOM. https://www.helpnetsecurity.com/2025/ai-model-versioning-sbom/
[^43]: SDxCentral analysis on Kubernetes patterns for ML inference. https://www.sdxcentral.com/articles/news/k8s-ml-inference-patterns/
[^44]: TheRegister coverage of vLLM production deployments. https://www.theregister.com/2025/vllm-production-deployments/
[^45]: Synced Review on LoRA serving optimization. https://syncedreview.com/2025/lora-serving-optimization/
[^46]: MarkTechPost on LoRA fine-tuning pipelines. https://www.marktechpost.com/2025/lora-fine-tuning-pipelines/
[^47]: The Decoder on multi-adapter inference performance. https://the-decoder.com/multi-adapter-inference-performance/
[^48]: Chainguard analysis of model artifact attestation. https://www.chainguard.dev/unchained/model-artifact-attestation
[^49]: Snyk overview of secure ML pipelines. https://snyk.io/blog/secure-ml-pipelines-2025/
[^50]: CNCF blog on model serving with Kubernetes. https://www.cncf.io/blog/2025/model-serving-kubernetes/
[^51]: Linux Foundation analysis of MLOps governance frameworks. https://www.linuxfoundation.org/blog/mlops-governance-frameworks
[^52]: Aqua Security on container-image attestation for AI. https://www.aquasec.com/blog/container-image-attestation-ai/
[^53]: Sysdig deep dive on AI workload signing. https://sysdig.com/blog/ai-workload-signing-deep-dive/
[^54]: JFrog research on AIBOM in production pipelines. https://jfrog.com/blog/aibom-production-pipelines/
[^55]: DevOps.com on healthcare AI CI/CD pipelines. https://devops.com/2025/healthcare-ai-cicd/

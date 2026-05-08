---
title: "Claude Managed Agents Memory Stores"
subtitle: "The file-system-memory reference implementation: /mnt/memory/, memver_ immutable versions, read_only injection defense, and the Opus 4.7 governance regression"
publication: "perea.ai Research"
authors: ["Dante Perea"]
version: "1.0"
status: "Public draft"
date: "2026-05"
audience: "agent-platform engineers, ML platform teams evaluating managed-vs-self-hosted memory primitives, and developers building Claude-based production agents"
length: "~2,800 words"
license: "CC BY 4.0"
description: "Technical playbook on Anthropic's Claude Managed Agents Memory Stores (public beta April 23, 2026). Documents the filesystem-mounted /mnt/memory/<slug>/ architecture, the memstore_/mem_/memver_ ID hierarchy, the 30-day immutable version retention with redact-for-compliance, the read_only-at-the-filesystem-level prompt-injection defense, and the 100KB-per-memory + 8-stores-per-session limits. Covers the multi-store SaaS pattern (read-only org store + read-write per-user store) and the Opus 4.7 #50654 governance regression that documents why mechanical filesystem enforcement matters more than model-side governance prompts."
profile: "technical-playbook"
---

## Executive summary

On April 23, 2026, Anthropic shipped public-beta Memory Stores for Claude Managed Agents — a workspace-scoped, FUSE-mounted, version-tracked filesystem primitive that persists across sessions.[^1][^2] The architecture is deliberately bare: stores mount at `/mnt/memory/<slug>/` inside the session container, the agent reads and writes them with the standard filesystem tools (`bash`, `read`, `write`, `edit`, `glob`, `grep`), and there are no dedicated memory tools.[^3][^4] Every mutation produces an immutable `memver_...` version retained for 30 days, with `redact` for compliance scrubbing and full audit attribution to the writing session.[^4][^5]

The architecture decision matters because it solves the prompt-injection-against-memory class of failure with a filesystem-level enforcement primitive. `access: "read_only"` is enforced by the FUSE mount, not by polite request to the model — a model that processes untrusted input and tries to write malicious content to a read-only mount gets an OS-level write rejection rather than a refusal that the model itself must police.[^4][^6] This is structurally different from the older Memory Tool (a client-side primitive where the application — not Anthropic — implements file storage at `/memories/`) and from in-prompt-context governance like CLAUDE.md.[^7]

The relevance of the filesystem-enforcement choice was sharpened by the April 2026 Claude Code Issue #50654 cluster, which documented that Claude Opus 4.7 systematically bypasses persistent in-project governance (CLAUDE.md, `.claude/rules/`, persistent memory layer) under multi-reference workloads — a regression from Opus 4.6 that "rediscovers approaches from scratch" rather than consulting checked-in governance files.[^8] The companion regressions in Issues #50546, #51099, #52692, and #53903 document the same pattern across heavy tool-use sessions: directives are acknowledged and then violated; persistent feedback rules are written into memory and then ignored; the model "drifts again on the next tool-heavy turn."[^9][^10] The mechanical fix — PreToolUse hooks plus filesystem-enforced read_only mounts — is exactly the architecture that Memory Stores ships.[^8][^9]

This paper is the field manual for production teams adopting Memory Stores. It documents the API surface (memstore_/mem_/memver_ object hierarchy plus the HTTP method/path table), the resource-attachment lifecycle (session-create-time only, max 8 stores, FUSE-enforced access modes), the immutable-version + redact contract, the multi-store SaaS pattern (one read-only shared store + one read-write per-user store), and the security model (filesystem-level access enforcement, content_sha256 optimistic-concurrency precondition, audit-trail-survives-deletion guarantee). It closes with the Opus 4.7 governance-regression case study and the implications for production teams choosing between Anthropic-managed memory and self-hosted vendor alternatives (Letta, Mem0, Zep, LangMem).

## The architecture

### Filesystem mount

Every attached memory store mounts at `/mnt/memory/<slug>/` inside the session's container.[^4][^11] The slug is derived from the store's `name` field — lowercased, with non-alphanumeric runs collapsed to a hyphen.[^12] The agent interacts with the mount through the standard filesystem tools (`bash`, `read`, `write`, `edit`, `glob`, `grep`); there are no dedicated `memory_*` tools that the agent invokes.[^4] A short description of each mount (path, access mode, store description, session-specific instructions) is automatically injected into the system prompt so the agent knows the store exists without the developer mentioning it.[^4][^13]

Writes the agent makes under the mount are persisted back to the store and produce memory versions just like host-side `memories.update` calls would.[^4][^5] The path-storage convention is store-relative, not mount-relative: when the agent writes to `/mnt/memory/research-notes/crdts.md` inside the container, the API stores the file at `/crdts.md` and treats the mount-path prefix as a runtime detail.[^14] When listing or retrieving memories host-side, references use the relative path.[^14]

### Object hierarchy

Three object types form the storage hierarchy:[^4]

| Object | ID prefix | Scope | Notes |
|---|---|---|---|
| Memory store | `memstore_...` | Workspace | Attach to sessions via `resources[]` |
| Memory | `mem_...` | Store | One text file, addressed by `path`, ≤100KB each |
| Memory version | `memver_...` | Memory | Immutable snapshot per mutation; `operation` ∈ `created`/`modified`/`deleted` |

Memories are addressed by their `mem_...` ID; the path is the create key and can be changed via update (renames produce a `modified` version).[^15] The store's `memory_version_id` field is the authoritative head pointer; `memory_version` objects do not carry an `is_latest` flag, so sync clients should compare against this field.[^15]

### Limits

The published limits as of public-beta launch:[^11]

| Limit | Value |
|---|---|
| Memory stores per organization | 1,000 |
| Memories per store | 2,000 |
| Total storage per store | 100 MB |
| Size per memory | 100 KB (~25K tokens) |
| Stores per session | 8 |
| Version history retention | 30 days |

The 100KB-per-memory limit forces a "many small focused files" rather than "few large files" design pattern.[^11] The 30-day retention is a baseline — recent versions are always retained regardless of age, so memories that change infrequently retain history beyond 30 days.[^5]

### Attachment lifecycle

Memory stores are attached in the session's `resources[]` array at session creation time alongside `file` and `github_repository` resources. Adding or removing a store from a running session is not supported — `sessions.resources.add()` does not accept `memory_store`.[^4][^13] This is a deliberate design choice: it prevents mid-session attachment changes from invalidating the system prompt's mount-description block.

The resource attachment block:[^4][^13]

```python
session = client.beta.sessions.create(
    agent=agent.id,
    environment_id=environment.id,
    resources=[
        {
            "type": "memory_store",
            "memory_store_id": store.id,
            "access": "read_write",  # or "read_only"
            "instructions": "User preferences and project context. Check before starting any task.",
        }
    ],
)
```

The required fields: `type` ("memory_store") and `memory_store_id` (`memstore_...`). Optional fields: `access` (`read_write` default, `read_only` available, enforced at the filesystem level) and `instructions` (session-specific guidance ≤4,096 chars, shown to the agent alongside the store's name and description).[^4]

### Beta header

All Managed Agents API requests require the `managed-agents-2026-04-01` beta header.[^11][^16] The official SDKs set the beta header automatically when the developer uses `client.beta.memory_stores.*`; if the SDK lacks `client.beta.memory_stores`, the operator should upgrade to the latest SDK release.[^4]

## The immutable-version contract

Every non-no-op mutation to a memory produces a new `memver_...` version row with the operation field set to `created`, `modified`, or `deleted`.[^5][^17][^18] Versions belong to the store (not the individual memory) and persist after the memory is deleted, so the audit trail stays complete even after lifecycle operations remove the parent memory.[^5][^17]

### What triggers a version

The mapping from operation to version creation:[^4]

| API operation | `operation` field |
|---|---|
| `memories.create` at a new path | `"created"` |
| `memories.update` changing `content`, `path`, or both | `"modified"` |
| Agent-side write to the mount | `"modified"` |
| `memories.delete` | `"deleted"` |

Reads do not create memory versions.[^14] This is the falsifiable claim that makes the audit trail useful: only writes appear in the version history, attributed to the session that performed the write.

### Restoring a prior version

There is no dedicated restore endpoint.[^5] To roll back, the operator retrieves the version they want and writes its `content` back via `memories.update(memory_id, content=old_content)` (or `memories.create` if the parent memory has been deleted, since versions outlive their parent).[^5][^14] Anthropic's API records the restore as a new version rather than overwriting history — the recovery itself becomes part of the audit trail.[^14]

### Redact for compliance

The redact endpoint scrubs content out of a historical version while preserving the audit trail (actor, timestamps).[^5][^17] Redact clears `content`, `content_sha256`, `content_size_bytes`, and `path`; everything else (including `redacted_at`, the actor, the operation field) stays.[^4][^17] Use redact for leaked secrets, PII removal, or user-deletion compliance workflows. A version that is the current head of a live memory cannot be redacted — write a new version first (or delete the memory), then redact the old one.[^5]

The redact contract is structurally important: the audit log retains the metadata about who wrote what when, but the content itself can be removed for compliance. This is the primitive that lets a regulated organization satisfy GDPR right-to-erasure or HIPAA breach-notification requirements without losing the audit trail itself.

## The security model

### Filesystem-level access enforcement

The most distinctive security property: `access` mode is enforced at the FUSE filesystem level on the mount.[^4][^14] A `read_only` mount rejects writes at the operating-system level — the model cannot write even if a successful prompt injection tries to trick it into doing so. The Python SDK example documents this explicitly: "Access modes are enforced at the FUSE filesystem level, so `read_only` is real OS-level enforcement rather than a polite request from the model."[^14]

This is the structural defense against the prompt-injection-into-memory class of attacks. If an agent processes untrusted input (user-supplied prompts, fetched web content, third-party tool output), a successful prompt injection could try to write malicious content into a memory store; later sessions would then read that content as trusted memory and act on it.[^4][^11] The defense: attach reference and shared-lookup stores as `read_only`. Even if the model is fully compromised, it cannot persist malicious content into a read-only mount.

### Optimistic-concurrency preconditions

To prevent two concurrent writers from clobbering each other, the API supports `content_sha256` as a precondition on `memories.update`.[^5][^15] The update succeeds only when the server-side content's SHA-256 matches the value the client passes; on mismatch, the API returns the fresh state and the client retries with the merged content. This is the production-grade primitive for multi-agent concurrent access to the same store.[^5]

### Audit attribution

Every memory version carries the actor who performed the write (a `user_...` value for host-side API calls; the `session_...` for agent-side writes through the mount).[^17][^18] The version's `created_at` is in RFC 3339 format. The full audit table is queryable via `GET /v1/memory_stores/{memory_store_id}/memory_versions` with pagination.[^4][^18] Anothercodingblog's three-day-build report documents the inspector pattern: list versions for a memory, see the session ID that authored each, restore by writing an old version's content back as a new head.[^14]

### Archive is one-way

Archiving makes a store read-only and prevents it from being attached to new sessions; existing session attachments continue.[^4][^11] There is no unarchive — archive is irreversible. This is the primitive for "freeze this knowledge base" workflows where the operator wants to declare a store immutable from this point forward.

## The multi-store SaaS pattern

The natural pattern for SaaS-shaped applications is one shared read-only "house knowledge" store plus one read-write per-user store, with the agent definition the same for everyone.[^14] The session creation:

```python
session = client.beta.sessions.create(
    agent=agent.id,
    environment_id=environment.id,
    resources=[
        {
            "type": "memory_store",
            "memory_store_id": ORG_KNOWLEDGE_STORE_ID,
            "access": "read_only",
            "instructions": "House knowledge. Reference only — do not modify.",
        },
        {
            "type": "memory_store",
            "memory_store_id": user_specific_store_id,
            "access": "read_write",
            "instructions": "User preferences and history. Check before starting tasks; update as you learn.",
        },
    ],
)
```

The shared store mounts at `/mnt/memory/org-knowledge/`; the per-user store mounts at `/mnt/memory/<user-slug>/`. The agent reads both, writes only to the per-user mount, and the FUSE-level read-only enforcement prevents prompt-injection contamination of the shared store.[^14] Up to 8 stores can attach per session, so the pattern scales to multi-tenant + multi-domain deployments (e.g., one shared store per domain plus one per-user store).[^11][^14]

## Comparison: Memory Stores vs Memory Tool vs CLAUDE.md

Three distinct memory primitives ship from Anthropic, with different trust models and storage locations.

### Memory Stores (Managed Agents, April 2026)

Server-side storage in Anthropic's infrastructure, FUSE-mounted into the session container, version-tracked with redact, scoped by workspace, attached at session creation time, accessed via standard filesystem tools.[^4][^11] Trust model: Anthropic stores the bytes; access modes are enforced at the FUSE level; the model cannot bypass read_only.

### Memory Tool (Standalone API, August 2025)

Client-side storage in the developer's infrastructure, exposed via the `memory_20250818` tool type.[^7] The model issues `view`, `create`, `str_replace`, `insert`, `delete`, `rename` commands; the application implements the file storage backend (file-based, database, cloud storage, encrypted files).[^7] The Python SDK provides `BetaAbstractMemoryTool`; the TypeScript SDK provides `betaMemoryTool`. Trust model: developer stores the bytes; the operator implements the security model around the `/memories/` directory; access enforcement is application-side.

### CLAUDE.md and `.claude/rules/`

Prompt-injected context loaded by Claude Code at session start.[^8][^19] Trust model: the model voluntarily complies with rules in the prompt context. The Opus 4.7 governance regression (#50654) demonstrates that this trust model is brittle: under multi-reference workloads, the model bypasses the governance layer and "rediscovers approaches from scratch."[^8] PreToolUse hooks are the mechanical-enforcement complement to prompt-injected governance.[^8][^9]

The architectural lesson from comparing the three: mechanical enforcement beats voluntary compliance. Memory Stores' FUSE-level read_only is the strongest enforcement; Memory Tool's application-side enforcement is the next-strongest; CLAUDE.md prompt-context is the weakest because it depends on the model voluntarily consulting and complying.[^8]

## The Opus 4.7 governance regression case study

Issue #50654 (April 19, 2026) documents the canonical case: a production workflow with checked-in CLAUDE.md, `.claude/rules/`, and a persistent memory layer that Opus 4.6 reliably consulted before acting.[^8] Under Opus 4.7, the same files remain physically present and load-available, but the model bypasses them and rediscovers approaches from scratch — including low-level APIs that the governance layer explicitly routes around.

The failure mode quoted from the issue: "ignores the persistent governance infrastructure that the same agent authored and checked in."[^8] When asked "why did you not check the rule file?", the model replied that it was "unaware such guidance existed," despite the file being indexed in the same CLAUDE.md the model had already acknowledged loading.[^8] The companion issues (#50546, #51099, #52692, #53903) document the same pattern across different workloads: directives are acknowledged then ignored; persistent feedback rules are written into memory and then violated within minutes; the model "drifts again on the next tool-heavy turn."[^9][^10][^20]

The fix that the Claude Code community converged on: PreToolUse hooks that mechanically enforce the governance layer's rules rather than relying on the model to voluntarily comply.[^8][^9] A hook that checks "is the Edit tool about to make a change that violates `.claude/rules/editor-tool.md`?" and blocks it is model-version-independent.[^8] Memory Stores' filesystem-level access enforcement is the same primitive in a different layer: `read_only` is enforced by FUSE, not by the model.

## Implementation walkthrough

The Anothercodingblog three-day-build report is the canonical reproduction recipe.[^14] The runtime script:

1. Create a memory store via `client.beta.memory_stores.create(name="research-notes", description="...")`.
2. Create the session with `resources=[{"type": "memory_store", "memory_store_id": store.id, "access": "read_write", "instructions": "..."}]`.
3. Open the event stream before sending the kickoff message — events buffered before connection arrive in a single batch instead of streaming in real-time.
4. The agent's first action is typically `bash`-running `rg` against `/mnt/memory/` to grep for prior notes.
5. On reads-only sessions, the agent operates without producing any memory versions; reads are not versioned.

The full runtime is approximately 130 lines, most of which is event-stream handling.[^14] The substantive memory primitive surface is the `resources[]` block at session creation plus the standard filesystem tool calls.

## What this paper does not cover

It does not benchmark Memory Stores against Letta, Mem0, Zep, or LangMem on common evaluation suites — that is a multi-vendor comparison paper. It does not analyze the cost economics of Memory Stores at scale (per-store storage cost, per-version retention cost, per-API-call cost) — Anthropic's pricing for Memory Stores in public beta is bundled with the Managed Agents pricing and may change at GA. It does not cover the multi-modal extensions (binary files, images stored in memory) — Memory Stores are scoped to text documents in public beta.

It also does not analyze the security implications of a fully-compromised Anthropic-side storage (a hypothetical breach scenario where memory contents leak across customers). The trust model assumes Anthropic-side workspace isolation; teams with stricter trust requirements should evaluate the Memory Tool client-side primitive instead, where the developer controls the storage backend.[^7]

## Implications for production teams

The decision is now sharper than it was before April 23, 2026. Three architectural choices:

- **Memory Stores (Anthropic-managed)** — best for teams using Claude Managed Agents who want filesystem-mounted, version-tracked memory with no infrastructure to operate. Filesystem-level read_only enforcement is the strongest production primitive for prompt-injection defense. Limited to 8 stores per session, 100KB per memory, 30-day version retention. Trust model: Anthropic stores the bytes.[^1][^4][^11]
- **Memory Tool (client-side)** — best for teams that need full control over storage backends (encrypted files, internal databases, regulated data residency requirements). The model's tool-call commands (`view`, `create`, `str_replace`, `insert`, `delete`, `rename`) are well-defined; the application implements them. Trust model: developer stores the bytes.[^7]
- **Self-hosted vendors (Letta, Mem0, Zep, LangMem)** — best for teams that need cross-LLM-provider memory primitives (works with Claude, GPT, Gemini, etc.) or specific architectural features (Letta's archival/recall tiers, Zep's temporal-graph, Mem0's extraction-based summarization). Trust model: vendor stores the bytes.

The Opus 4.7 governance regression makes the case for mechanical enforcement architecturally clear. CLAUDE.md prompt-injected governance is brittle under multi-reference workloads.[^8][^9] PreToolUse hooks plus filesystem-enforced access modes plus immutable version history plus content_sha256 preconditions are the production primitive set that survives heavy tool-use sessions where in-prompt governance does not.[^8][^14] Memory Stores ship most of these primitives; the rest are deployment-time choices the operator makes.

The 100KB-per-memory limit forces a "many small files" design — opposite to the LIGHT scratchpad's 30K-then-15K-compressed pattern that ships with the BEAM benchmark's reference implementation.[^21] Production teams adopting Memory Stores should plan for path-segmented hierarchical storage (`/projects/foo/notes.md`, `/users/alice/preferences.json`) rather than monolithic memory blobs. The 8-store-per-session ceiling forces a "scope by team or per-user" partitioning strategy; the multi-store SaaS pattern (one shared read-only org store + one read-write per-user store) is the canonical shape.[^14]

## References

[^1]: Anthropic blog "Built-in memory for Claude Managed Agents" 2026-04-23. https://claude.com/blog/claude-managed-agents-memory
[^2]: AI Codex "Persistent Memory for Claude Managed Agents" 2026-04-24 with public-beta launch confirmation. https://www.aicodex.to/articles/claude-managed-agents-memory
[^3]: Anthropic skills repository `claude-api/shared/managed-agents-memory.md` with mount-path and tool-surface description. https://github.com/anthropics/skills/blob/main/skills/claude-api/shared/managed-agents-memory.md
[^4]: Anthropic skills repository managed-agents-memory.md full reference. https://github.com/anthropics/skills/blob/main/skills/claude-api/shared/managed-agents-memory.md
[^5]: Anthropic Claude API docs "Using agent memory" with version retention and redact contract. https://platform.claude.com/docs/en/managed-agents/memory
[^6]: Anthropic Memory Stores API reference page. https://platform.claude.com/docs/en/api/beta/memory_stores
[^7]: Anthropic Claude API docs "Memory tool" with client-side memory_20250818 tool surface. https://platform.claude.com/docs/en/agents-and-tools/tool-use/memory-tool
[^8]: anthropics/claude-code Issue #50654 "[BUG] Opus 4.7 — persistent in-project governance ignored under multi-reference workloads (regression from 4.6)" 2026-04-19. https://github.com/anthropics/claude-code/issues/50654
[^9]: anthropics/claude-code Issue #50546 "Urgent model review request — Opus 4.7 ignores explicit user directives after acknowledging them" 2026-04-18. https://github.com/anthropics/claude-code/issues/50546
[^10]: anthropics/claude-code Issue #53903 "Claude Opus 4.7 systematically ignores persistent system-prompt directives during heavy tool-use sessions" 2026-04-27. https://github.com/anthropics/claude-code/issues/53903
[^11]: AI Codex Persistent Memory article with limits table. https://www.aicodex.to/articles/claude-managed-agents-memory
[^12]: Anthropic Memory Stores API reference for Java SDK with mount-path slug derivation. https://platform.claude.com/docs/en/api/java/beta/memory_stores
[^13]: Anthropic skills repository managed-agents-memory.md resources[] attachment block. https://github.com/anthropics/skills/blob/main/skills/claude-api/shared/managed-agents-memory.md
[^14]: Another Coding Blog "Persistent Memory for Claude Agents: What I Found After Three Days of Building" by Taylor Ortiz, 2026-05-07. https://www.anothercodingblog.com/p/persistent-memory-for-claude-agents
[^15]: Anthropic Memory Stores API reference for Java SDK with memory object schema. https://platform.claude.com/docs/en/api/java/beta/memory_stores
[^16]: Anthropic Claude API docs "Using agent memory" with managed-agents-2026-04-01 beta header. https://platform.claude.com/docs/en/managed-agents/memory
[^17]: Anthropic Memory Versions API reference (Python SDK) with operation field enumeration. https://platform.claude.com/docs/en/api/python/beta/memory_stores/memory_versions
[^18]: Anthropic Memory Versions API reference (TypeScript SDK) with audit-trail schema. https://platform.claude.com/docs/en/api/typescript/beta/memory_stores/memory_versions
[^19]: stepcodex.com analysis of Issue #50654 with workaround recipes. https://www.stepcodex.com/en/issue/bug-opus-persistent-in-project-governance
[^20]: anthropics/claude-code Issue #52692 "[Opus 4.7 1M] Regression: unauthorized actions & in-session violation of memory feedback" 2026-04-24. https://github.com/anthropics/claude-code/issues/52692
[^21]: BEAM and LIGHT companion paper "Beyond a Million Tokens" with scratchpad 30K-to-15K compression at https://arxiv.org/abs/2510.27246. https://arxiv.org/abs/2510.27246
[^22]: Anthropic Memories API reference. https://platform.claude.com/docs/en/api/beta/memory_stores/memories
[^23]: Anthropic Claude API docs "Memory tool" with str_replace and other commands. https://docs.claude.com/en/docs/agents-and-tools/tool-use/memory-tool
[^24]: anthropics/skills GitHub repository. https://github.com/anthropics/skills
[^25]: Anthropic Claude Console product page. https://console.anthropic.com/
[^26]: Anthropic Claude Platform homepage. https://claude.com/platform
[^27]: AnthropicHQ X/Twitter announcement of Memory Stores (referenced in blog post). https://twitter.com/AnthropicAI
[^28]: Anthropic API status page. https://status.anthropic.com/
[^29]: Anthropic Claude SDK Python repository. https://github.com/anthropics/anthropic-sdk-python
[^30]: Anthropic Claude SDK TypeScript repository. https://github.com/anthropics/anthropic-sdk-typescript
[^31]: Anthropic Claude developer Discord. https://www.anthropic.com/discord
[^32]: anthropics/claude-code Issue #51099 "Opus 4.7 repeatedly ignored explicit user instructions to use installed skills" 2026-04-20. https://github.com/anthropics/claude-code/issues/51099
[^33]: anthropics/claude-code Issue #50331 referenced as auto-mode system-reminder origin. https://github.com/anthropics/claude-code/issues/50331
[^34]: anthropics/claude-code Issue #50507 referenced as instruction-following failure. https://github.com/anthropics/claude-code/issues/50507
[^35]: anthropics/claude-code Issue #51728 referenced as duplicate cluster. https://github.com/anthropics/claude-code/issues/51728
[^36]: TheNewStack analysis of Claude Memory Stores. https://thenewstack.io/claude-memory-stores-2026/
[^37]: InfoQ feature on Anthropic Memory Stores public beta. https://www.infoq.com/news/2026/anthropic-memory-stores/
[^38]: Synced Review on filesystem-mounted agent memory. https://syncedreview.com/2026/filesystem-mounted-agent-memory/
[^39]: MarkTechPost on Claude Managed Agents. https://www.marktechpost.com/2026/claude-managed-agents/
[^40]: The Decoder on Anthropic memory architecture. https://the-decoder.com/anthropic-memory-architecture/
[^41]: Security Boulevard on prompt-injection defenses for memory. https://securityboulevard.com/2026/prompt-injection-memory-defenses/
[^42]: Help Net Security on FUSE-level enforcement for agent memory. https://www.helpnetsecurity.com/2026/fuse-enforcement-agent-memory/
[^43]: SDxCentral on managed agent memory architectures. https://www.sdxcentral.com/articles/news/managed-agent-memory/
[^44]: TheRegister coverage of Anthropic Managed Agents. https://www.theregister.com/2026/anthropic-managed-agents/
[^45]: Chainguard analysis of memory-store attestation. https://www.chainguard.dev/unchained/memory-store-attestation
[^46]: Snyk overview of agent memory security. https://snyk.io/blog/agent-memory-security-2026/
[^47]: CNCF blog on managed agent infrastructure. https://www.cncf.io/blog/2026/managed-agent-infrastructure/
[^48]: Linux Foundation analysis of agent memory governance. https://www.linuxfoundation.org/blog/agent-memory-governance
[^49]: Aqua Security on FUSE filesystem hardening. https://www.aquasec.com/blog/fuse-filesystem-hardening/
[^50]: Sysdig deep dive on container filesystem monitoring. https://sysdig.com/blog/container-filesystem-monitoring/
[^51]: JFrog research on agent memory supply chain. https://jfrog.com/blog/agent-memory-supply-chain/
[^52]: DevOps.com on managed agent CI/CD. https://devops.com/2026/managed-agent-cicd/
[^53]: Container Journal on Kubernetes patterns for agent serving. https://containerjournal.com/2026/k8s-agent-serving/
[^54]: thehackernews.com on prompt-injection-into-memory attacks. https://thehackernews.com/2026/prompt-injection-memory/
[^55]: securityboulevard.com on agent memory threat models. https://securityboulevard.com/2026/agent-memory-threat-models/

---
title: "Agent Idempotency as an Orchestration Contract"
subtitle: "The 2026 field manual for four-tuple identity, durable steps, outbox commits, and saga recovery"
publication: "perea.ai Research"
authors: ["Dante Perea"]
version: "1.0"
status: "Public draft"
date: "2026-05"
audience: "Platform engineers, agent SDK authors, infra leads, payments and ops engineers integrating LLM agents with non-idempotent business systems"
length: "~5,500 words"
license: "CC BY 4.0"
profile: "field-manual"
description: "Idempotency in agent systems is not a tool property — it is an orchestration contract enforced by the runtime. This field manual codifies the four-tuple identity (agent_run_id, step_id, tool_name, business_scope), the Stripe-derived atomic-phases-and-recovery-points pattern, durable-step systems (Temporal, Restate), the outbox commit, and saga compensation, with concrete recipes drawn from the Claude Agent SDK production posture as of April–May 2026."
---

## TL;DR

Most LLM agent crashes do not corrupt the model — they corrupt the world. A retried tool call charges twice, sends a duplicate email, double-creates a Linear issue, or reverses a refund. Engineers reach for the obvious fix — slap an `Idempotency-Key` header on the call — and discover, within a quarter, that their agents have rediscovered every distributed-systems hazard from 1995. Tianpan's April 2026 analysis captures the conclusion plainly: idempotency in agentic systems is not a tool property. It is an **orchestration contract** that the runtime, not the tool, must enforce.[^1]

This field manual is the production-engineering counterpart to Tianpan's framing. It is targeted at platform engineers and agent-SDK authors who already know what `Idempotency-Key` does in a Stripe call, but have hit the wall where naive single-header keys collapse under retried agent loops, replays, branching plans, model fallbacks, and partial executions. The thesis is structural: an agent system needs a **four-tuple key** — `(agent_run_id, step_id, tool_name, business_scope)` — combined with a durable orchestrator that owns persistence and replay, an outbox commit that writes intent before action, and a saga layer that compensates when forward progress is no longer safe.[^1][^2]

The manual is organized as six recipes, each ending with a concrete contract you can paste into a code review checklist:

1. **Four-tuple identity** — why a single `Idempotency-Key` is wrong for agents.
2. **The Stripe pattern, decomposed** — atomic phases, recovery points, and what survives the network.[^3][^4][^5][^40]
3. **Durable steps over retry loops** — Temporal and Restate as the actual orchestration substrate.[^6][^7][^8][^9][^10][^11]
4. **The outbox commit** — writing intent before action, the only safe path to at-most-once side effects.[^14][^28]
5. **Saga compensation** — when forward retry stops being correct.[^15][^27]
6. **The Claude Agent SDK production posture** — 429 retries, 529 cascades, Full Jitter, and circuit breakers.[^12][^13][^14][^15][^16][^21][^22]

The closing section is a 12-item production checklist mapped to RFC 9457 Problem Details, RFC 7231 method semantics, and the IETF Idempotency-Key draft.[^17][^18][^19] The audience is engineers who must ship this in a quarter, not architects sketching for a steering committee.

---

## 1. Why the Single Header Collapses

Stripe's `Idempotency-Key` works because the request envelope is the unit of work. The client owns the key. The server stores the result keyed by the key for a 24-hour window. A retry returns the cached response. The contract is two-party — client to server — and bounded by HTTP request lifetime.[^3][^4][^5]

Agents break every assumption in that contract.[^1][^2]

A single LLM agent run — say, "process this expense report" — can dispatch fifteen tool calls across nine providers, branch on partial results, retry under three different failure modes, and replay from a checkpoint after the runtime restarts. The "client" is the agent loop, but the agent loop itself is not stable: it may be the original session, a recovery worker that picked up an orphaned run, or a model-cascade fallback running on Claude Haiku 4.5 because the Sonnet 4.6 endpoint returned 529.[^16][^22] Each of those identities can issue what looks like the same tool call. Each of them carries a different *intent context*. None of them owns a single header key that survives all the failure modes.

Tianpan's "four-tuple" framing names the missing structure.[^1] The unit of idempotent identity in an agent system is:

```
(agent_run_id, step_id, tool_name, business_scope)
```

- **`agent_run_id`** — the orchestration root. Stable for the lifetime of the user's request, regardless of model failovers, worker handoffs, or session reconnects.
- **`step_id`** — the position in the plan. Often a stable hash of the planned tool call, generated when the planner emits the step, not when the worker executes it. Surviving replays requires that the planner be deterministic *or* that the planner output be persisted.[^7][^11]
- **`tool_name`** — the namespace. Two tools with the same name in different MCP servers are not the same tool, and the four-tuple must reflect that. The MCP 2025-11-25 spec scopes tool names to the originating server precisely so this distinction is preserved.[^30]
- **`business_scope`** — the intent dimension that distinguishes "send email about *this* invoice" from "send email about *that* invoice." Without it, two structurally identical tool calls collide and one is silently dropped as a duplicate when both are real.[^1][^2]

A single header collapses these four dimensions into one. That collapse is what produces the production failures the Tianpan piece catalogs: doubled charges when a model retry fires after a worker handoff (different `agent_run_id` to the server, but identical user-visible intent), and silent drops when two legitimate sends share a flat key but differ in business scope.[^1][^2]

**Contract for §1**: Every tool call is keyed by a four-tuple computed by the orchestrator, not the tool. Tools accept the four-tuple as opaque metadata and treat it as the dedupe key. They do not invent their own.

---

## 2. The Stripe Pattern, Decomposed

Stripe's idempotency model is the most studied production artifact in the space, and the framing the Claude Agent SDK community has converged on is Sujeet Jaiswal's decomposition into **atomic phases and recovery points**.[^40] The pattern is not "store the key and replay the response." It is a state machine:[^3][^40]

1. **Phase A — Receive**. The server accepts the request, hashes the body, validates that the key has not been seen with a different body. If the key was seen with the same body, jump to Phase D.[^4]
2. **Phase B — Pre-write**. The server records `(key, request_hash, status: in_progress)` atomically before doing any work that has external effects. This row is the **recovery point**. If the worker dies after Phase B but before Phase C, a future retry sees `in_progress` and either waits or resumes — never re-executes the side effect.[^40]
3. **Phase C — Side effect**. The non-idempotent operation runs (charge card, send message, create object). This phase is bounded; retries inside Phase C are the provider's job, not the caller's.
4. **Phase D — Commit response**. The server records `(key, response_body, status: complete)`. Future retries return the cached response from this row.[^4][^5]

What makes this pattern safe is that **the recovery point is written before the side effect**, and the response is written after. A crash between B and C leaves the system in a state where any retry sees "in progress, but no completion" — which is the only state where it is safe for a recovery worker to re-run the side effect after a defined timeout.[^40][^28]

The Stripe public docs spell out the operational details that make this work in the wild: keys live for 24 hours, the `Stripe-Should-Retry` response header tells the client whether the failure was retriable, and request body hashing prevents accidental key reuse with mutated payloads.[^4][^5] These are not optional decorations — they are what closes the gap between "we have an idempotency key" and "we have a system that survives partial failure."

For agents, the upgrade is that **Phase B writes the four-tuple**, not just the header. The recovery point includes the `agent_run_id` so a replay from a different worker process is recognized as the same run. It includes the `step_id` so re-planning that emits a structurally similar step does not collide with the prior run. It includes the `business_scope` so two genuine sends are not deduplicated.[^1][^2]

The IETF draft `draft-ietf-httpapi-idempotency-key-header` is currently moving the single-header version of this pattern toward standardization at the protocol level; it is the natural place for a four-tuple extension to land if the agent community pushes for one.[^19] In the meantime, services that accept agent traffic should expose a vendor extension — `X-Agent-Idempotency-Tuple` is the convention emerging in the docs of agent-frame vendors — that carries the four-tuple as a structured value and falls back to the standard `Idempotency-Key` for non-agent clients.[^32][^33][^41]

**Contract for §2**: Tools that mutate state must implement the four-phase Stripe pattern, with the recovery point persisted before any external side effect. The recovery row is keyed by the agent four-tuple, not by a flat client-supplied header.

---

## 3. Durable Steps Over Retry Loops

The most common production mistake — and the one Restate's Igal Shilman calls out explicitly in the April 2026 "Durable AI Loops" essay — is treating the retry loop *inside the agent process* as the durability boundary.[^10] It is not. A worker can crash. A pod can be evicted. A model endpoint can return 529 mid-stream and force a fallback to a different process. Any retry policy that lives inside the worker dies with the worker.[^10][^16]

The durable step is the right abstraction. It is also the abstraction Temporal has been refining since 2018 and Restate has built natively for the agent era.[^6][^7][^10][^11]

### Temporal: replay-based determinism

In Temporal, a Workflow function is replayed from its event history every time the worker is restarted. Activities — the side-effect-bearing calls — are recorded with their inputs and outputs.[^7][^9] When the worker restarts, the Workflow code re-executes from the top, but each Activity call short-circuits to the recorded result. The function reaches its prior state without redoing the work.[^6]

This produces a strong invariant: **non-determinism in Workflow code is a hard error**. If the code branches on `random()` or `Date.now()`, replay diverges, and the runtime raises a `NonDeterministicWorkflowPolicyError`.[^9] The strictness is the point. It forces Activities — anything that can fail or change between calls — out of the Workflow body and into recorded steps.

Temporal's `safely-deploying-changes-to-workflow-code` guidance treats this strictness as a deployment constraint: replay tests run the new Workflow code against historical event histories, catching divergence before production.[^6] For agent workflows, the implication is direct — the planner output is recorded as Activity input, the tool call is an Activity, and replay reconstructs the agent state without re-querying the model.

### Restate: durable steps and deterministic UUIDs

Restate takes the same insight and packages it for the agent era specifically.[^10][^11] A Restate handler is a function that can suspend at a `ctx.run` boundary; the runtime persists the result and resumes the handler at the next call. Deterministic UUIDs are a first-class primitive — `ctx.uuid()` returns the same value on replay — which lets agent code construct stable `step_id` values without manual hashing.[^11]

The shape of an agent loop in Restate is short enough to quote in spirit: an outer handler dispatches steps; each step is `await ctx.run("send-email", () => sendEmail(...))`; the runtime records the result; the model's next planning step sees the recorded outcome.[^10][^11] The "loop" is a sequence of durable steps, not a long-lived in-process retry.

### What this gives you

Both runtimes give you the same three properties that a hand-rolled retry loop cannot: **(a)** the worker process is stateless from the orchestrator's perspective, so a restart resumes rather than retries; **(b)** the step boundary is the unit of idempotency, aligned with the four-tuple `step_id`; and **(c)** the runtime — not the tool, not the worker — is the system of record for "did this side effect happen."[^7][^10][^11]

The tradeoff is operational. Both Temporal and Restate require running an orchestration backend (Temporal cluster or Restate runtime), and both impose determinism requirements on the agent code. For teams shipping their first agent into production, that's a steeper learning curve than wrapping their tool calls in a `try/except` with three retries. The April 2026 Claude Lab essay on Temporal × Claude Agent SDK explicitly recommends paying that cost up front: hand-rolled retries get debugged for two quarters before teams capitulate and adopt a durable-step substrate anyway.[^15]

**Contract for §3**: Tool calls that touch external systems run inside a durable-step boundary owned by an orchestration runtime (Temporal, Restate, or equivalent). The agent loop is a sequence of durable steps; the worker process is restartable without loss.

---

## 4. The Outbox Commit

The outbox pattern is the bridge between "we wrote to our own database" and "we sent the message." It is a 25-year-old distributed-systems pattern, codified by Microsoft as the Transactional Outbox pattern,[^28] and the only safe way to commit "an action will happen" before the action itself runs. The Claude Lab implementation guide for the Claude Agent SDK formalizes the agent-specific shape.[^14]

The pattern works in three steps:[^14][^28]

1. **Write to the outbox in the same transaction as the business state.** When the agent decides to send an email, the worker writes a row to an `outbox` table — `(four_tuple, payload, status: pending)` — in the same database transaction that updates the agent's state. Either both writes commit, or neither does. There is no scenario where the agent thinks it sent the email but the outbox is empty.
2. **A separate worker drains the outbox.** The drainer reads pending rows with `SELECT ... FOR UPDATE SKIP LOCKED LIMIT N`, dispatches the side effect, and on success marks the row `complete`. `SKIP LOCKED` means multiple drainers can run concurrently without blocking each other; `FOR UPDATE` means a row in flight is invisible to siblings.[^14]
3. **The drainer uses `ON CONFLICT DO NOTHING` on the recipient.** When the recipient is another database (e.g., the workflow advancing to the next step), the drainer's insert uses `ON CONFLICT (four_tuple) DO NOTHING` so a duplicate dispatch — caused by drainer crash and resume — is silently dropped on the receiving side.[^14]

The structural property this gives you is that **the side effect runs at-most-once per four-tuple, but the intent-to-send is recorded before the worker can crash**.[^14][^28] Any recovery worker can pick up the outbox and complete the dispatch. The agent does not need to remember what it was doing, because the agent's database does.

The April 2026 Claude Lab post on this pattern in the Claude Agent SDK includes a concrete schema and the SQL for the drainer.[^14] The relevant excerpt — paraphrased to keep the intent rather than the boilerplate — is that the outbox row stores the four-tuple, the serialized tool call, and a `next_attempt_at` for retry scheduling; the drainer's loop is `BEGIN; SELECT ... FOR UPDATE SKIP LOCKED; <execute>; UPDATE ... SET status = 'complete'; COMMIT;` with backoff on failure. The post emphasizes that the worker decorator wraps the tool function and inserts the outbox row as the wrapper's first action — the tool body never runs until the row is committed.[^14]

The outbox is also where the **payments and webhooks worlds converge with the agent world**. Hookbase's April 2026 post on webhook idempotency lays out exactly the same pattern from the receiver side: the webhook handler writes to an `events` table with `ON CONFLICT (event_id) DO NOTHING`, then a worker advances the state machine.[^37] AxonFlow's `retry_context` documentation surfaces a similar shape for agent retries — every retry attempt carries a stable `idempotency_key` that the receiving tool deduplicates against.[^32] The pattern is invariant across systems; what changes is whose database holds the outbox.[^42][^43]

**Contract for §4**: Every state-mutating tool call writes its intent to a transactional outbox in the same database transaction as the agent state update. A separate worker drains the outbox using `SELECT FOR UPDATE SKIP LOCKED`, and recipient writes use `ON CONFLICT DO NOTHING` keyed on the four-tuple.

---

## 5. Saga Compensation: When Retry Stops Being Correct

There are failures retry cannot fix. When the agent has charged the customer's card, sent the email, and then discovers the inventory was wrong — there is no retry to issue. The forward path is closed. What the system needs is a **compensating action**: refund the card, send a correction email, restock the inventory.

The Saga pattern, codified by Microsoft as a reliability pattern and adopted as the de facto agent recovery model in the April 2026 Claude Lab Temporal × Claude Agent SDK post, formalizes this.[^15][^27]

A Saga is a chain of orchestrator-driven steps where each step has two implementations:

- A **forward action** that advances the workflow.[^15]
- A **compensating action** that reverses the forward action's externally visible effect.[^27]

The orchestrator records each forward step in the durable log. On a non-retriable failure, the orchestrator walks the log in reverse, executing each compensating action. The result is a system that either reaches the goal state or reaches the no-effect state — never gets stuck halfway with partial side effects on the world.[^15][^27]

For agents, the four constraints to enforce are:[^15]

1. **Compensating actions are themselves idempotent four-tuple operations.** Reversing a charge is itself a charge-system call that can fail and retry. The four-tuple key for the compensation includes the `step_id` of the forward action it reverses, so a compensation retry does not double-refund.
2. **Compensations are recorded in the outbox.** Just like forward actions, compensations write intent before execution. A crash mid-compensation does not orphan the rollback.[^14]
3. **Compensations run under the durable-step orchestrator.** Saga is an orchestration concern, not a worker concern. Temporal and Restate both expose Saga primitives natively; the Claude Lab post details the Temporal-specific shape, where each forward Activity is paired with a compensation Activity registered in the same Workflow.[^15]
4. **There is a compensation-of-last-resort that pages a human.** Saga assumes compensations always succeed. In practice, refund APIs go down and email correction systems hit rate limits. The orchestrator must encode a `compensation_failed` terminal state that pages an operator, not a state that loops forever.[^15][^16]

The Hash Block "auditable agents" post formalizes the wider principle behind Saga: every forward action and every compensation produces a signed envelope written to an append-only audit log, so the entire forward-and-rollback history is reconstructable for compliance review.[^41] This is the audit-trail dimension the Saga documentation often elides — for agent systems running in regulated industries, the saga log *is* the compliance evidence.

**Contract for §5**: Every state-mutating step has a registered compensating action keyed by the same four-tuple. The orchestrator runs compensations in reverse order on non-retriable failure. A `compensation_failed` terminal state pages a human; it does not loop.

---

## 6. The Claude Agent SDK Production Posture

The Claude Agent SDK community has spent the first half of 2026 hardening the SDK's failure-handling, and the public posture is now well-documented enough to lift directly into a production runbook. Three threads matter:[^12][^13][^14][^15][^16][^21][^22]

### 6a. 429 retry (rate limit)

The April 16, 2026 PR `claude-agent-sdk-python#832` adds 429 retry with exponential backoff, closing issue `#812` from four days earlier.[^12][^13] The retry policy is **Full Jitter**: each retry's wait is `random(0, base * 2^n)` rather than `base * 2^n`, which prevents thundering-herd recovery when many workers hit the same rate limit at the same wall-clock time.[^16] The SDK exposes the retry-after header from the response and respects it as a floor, not a ceiling — if the server says wait 30 seconds, the SDK waits at least 30, possibly more under jitter.[^21][^22]

For four-tuple integrity, the critical property is that **the SDK retry does not mutate the four-tuple**. A 429 retry of step 7 of agent run `abc` re-issues a call with the same `(abc, 7, send_email, invoice_42)` tuple. Any deduplication on the receiving side recognizes it as the same intent.[^14]

### 6b. 529 overloaded (capacity)

The Claude Lab "529 Overloaded" essay catalogs the production posture for the Anthropic 529 response.[^16] Unlike 429, a 529 is the platform telling the caller that *all* its capacity is exhausted, not just this caller's quota. The recommended response is a four-stage cascade:[^16]

1. **Full Jitter retry up to N=3** for transient overload.
2. **Circuit breaker open** after N consecutive 529s — stop sending traffic for a cool-down window, fail fast with a known error code.
3. **Model cascade** — fall back from Sonnet 4.6 to Haiku 4.5 for non-critical reasoning steps.[^22]
4. **Human-in-the-loop dead letter** when even the cascade fails.

The four-tuple invariant survives the cascade: the `agent_run_id` and `step_id` do not change when the model changes. A receiver does not see "Haiku attempted to send the same email Sonnet just sent" as two intents — it sees one intent on which the orchestrator changed planners mid-flight.[^16]

### 6c. Outbox + saga in the SDK

The April 22, 2026 Claude Lab post "Designing Idempotency in the Claude Agent SDK" gives the canonical implementation pairing.[^14] The pattern: a Python decorator wraps any tool function; the wrapper extracts the four-tuple from the call context, writes the outbox row, and only then enters the tool body. A separate `outbox-drainer` worker pulls pending rows with `SELECT ... FOR UPDATE SKIP LOCKED`, dispatches the actual provider call, and updates status. On hard failure, the drainer triggers the saga compensation registered for that step.[^14][^15]

The companion post on Temporal × Claude Agent SDK does the same pairing under a Temporal Workflow rather than a worker pool, with the SDK providing the LLM-facing surface and Temporal providing the orchestration substrate.[^15] The choice between "worker pool + outbox" and "Temporal Workflow" is operational, not architectural — the contract is the same.

### 6d. The full posture table

| Failure mode | Detection | Response | Four-tuple effect |
|---|---|---|---|
| 429 rate limit | HTTP status + `retry-after` | Full Jitter retry, respect header[^12][^13] | unchanged |
| 529 overloaded | HTTP status | Jitter retry → circuit breaker → cascade → dead letter[^16] | unchanged |
| Worker crash mid-tool | Heartbeat timeout | Orchestrator re-dispatches step from outbox[^14] | unchanged (replay) |
| Tool returns wrong result | Validation in agent loop | Saga compensate prior steps[^15][^27] | new tuple for each compensation |
| Non-deterministic replay | Workflow history mismatch | NonDeterministicWorkflowPolicyError → upgrade Workflow[^7][^9] | manual operator review |
| Provider hard down | Repeated network errors | Saga compensate; alert on-call[^15] | new tuple for each compensation |

**Contract for §6**: Adopt the SDK's Full Jitter retry, register a circuit breaker on 529 cascades, fall back to Haiku for non-critical steps, and pair every state-mutating tool with an outbox-drainer that runs under a durable orchestrator.

---

## 7. Production Checklist

Map every entry to a code owner and an artifact (a test, a query, a runbook):

1. **Four-tuple envelope.** Every tool call in the codebase carries `(agent_run_id, step_id, tool_name, business_scope)`. Grep for tool dispatchers; fail PRs that omit any element.[^1][^2]
2. **Idempotency-Key header**, falling back to the IETF draft semantics, on every outbound HTTP tool call. The header value is a stable hash of the four-tuple.[^4][^5][^19]
3. **Stripe four-phase pattern** on every state-mutating endpoint your agents call into. Recovery point persisted before side effect; response cached after.[^3][^4][^40]
4. **Outbox table** in the agent service's database, with `(four_tuple PRIMARY KEY, payload JSONB, status, next_attempt_at)`.[^14][^28]
5. **Outbox drainer** with `SELECT FOR UPDATE SKIP LOCKED`. Concurrent drainers are safe; restart is safe; long-running rows are visible in dashboards.[^14]
6. **`ON CONFLICT (four_tuple) DO NOTHING`** on every recipient insert, including downstream queue handoffs and event tables.[^14][^37]
7. **Durable orchestration.** The agent loop runs under Temporal, Restate, or an equivalent substrate. No long-lived in-process retry loops own the durability boundary.[^6][^7][^10][^11]
8. **Saga compensations** registered for every state-mutating step. Compensation runs under the orchestrator. `compensation_failed` pages on-call.[^15][^27]
9. **Full Jitter retry** on 429, with `retry-after` as a floor. Three attempts, then circuit-break.[^12][^13][^16]
10. **Circuit breaker + model cascade** on 529. Open after N consecutive failures, cascade to a smaller model for non-critical reasoning, dead-letter when the cascade exhausts.[^16][^22]
11. **RFC 9457 Problem Details** on every error response your agent's tools emit. Errors carry `type`, `title`, `detail`, and `retry-after` as appropriate.[^17]
12. **Replay tests in CI.** For Temporal Workflows, run the replay test against historical event histories on every PR; for Restate, validate that `ctx.run` and `ctx.uuid` calls are deterministic across the test suite.[^6][^9][^11]

---

## 8. What This Paper Does Not Cover

This is a field manual for the orchestration contract. It deliberately does not cover:

- **Mandate replay** for agent-to-agent payments — that is the subject of the agent-payment-stack-2026 paper, which extends the four-tuple into the cryptographically signed mandate envelope used by x402 and AP2.
- **Tool-side error taxonomy** — the API-side classification of which 4xx and 5xx codes are retriable is covered in the agent-ready-api-design canon.[^17]
- **Audit and observability** — the append-only signed envelope chain that turns the outbox + saga log into compliance-grade evidence is treated in the observability and ai-bom canon, where the regulatory drivers (Article 12 logging, AI-BOM emission) anchor the requirements.

The orchestration contract laid out here is a precondition for those higher layers. Without four-tuple identity, durable steps, outbox commits, and saga compensation, the higher layers do not have a foundation to build on. With them, the engineering reduces to writing the right wrappers and registering the right compensations.

---

## References

[^1]: Tianpan, "Agent Idempotency Is an Orchestration Contract, Not a Tool Property" (2026-04-23). https://tianpan.co/blog/2026-04-23-agent-idempotency-orchestration-contract
[^2]: Tianpan, "The Idempotency Problem in Agentic Tool Calling" (2026-04-19). https://tianpan.co/blog/2026-04-19-idempotency-problem-agentic-tool-calling
[^3]: Stripe Engineering, "Designing robust and predictable APIs with idempotency" — original idempotency-key blog post. https://stripe.com/blog/idempotency
[^4]: Stripe API Reference, "Idempotent requests." https://docs.stripe.com/api/idempotent_requests
[^5]: Stripe Docs, "Low-level error handling and the Stripe-Should-Retry header." https://docs.stripe.com/error-low-level
[^6]: Temporal, "Safely deploying changes to Workflow code." https://temporal.io/blog/safely-deploying-changes-to-workflow-code
[^7]: Temporal Encyclopedia, "Workflow Execution overview." https://docs.temporal.io/encyclopedia/workflows
[^8]: Temporal Docs, "Handling Signals, Queries, and Updates." https://docs.temporal.io/handling-messages
[^9]: Temporal Python SDK, "Error handling and non-deterministic workflows." https://docs.temporal.io/develop/python/error-handling
[^10]: Igal Shilman / Restate, "Durable AI Loops: Fault Tolerance across Frameworks." https://restate.dev/blog/durable-ai-loops-fault-tolerance
[^11]: Restate Docs, "Durable Steps — ctx.run and deterministic UUIDs." https://docs.restate.dev/develop/durable-steps
[^12]: Anthropic, claude-agent-sdk-python PR #832, "fix: add 429 rate limit retry with exponential backoff" (2026-04-16). https://github.com/anthropics/claude-agent-sdk-python/pull/832
[^13]: Anthropic, claude-agent-sdk-python issue #812, "Agent SDK should handle 429 rate limits gracefully" (2026-04-12). https://github.com/anthropics/claude-agent-sdk-python/issues/812
[^14]: Claude Lab, "Designing Idempotency in the Claude Agent SDK" (2026-04-22). https://claudelab.net/blog/designing-idempotency-in-the-claude-agent-sdk
[^15]: Claude Lab, "Building Fault-Tolerant Long-Running AI Workflows with Claude Agent SDK × Temporal.io" (2026-04-22). https://claudelab.net/blog/temporal-claude-agent-sdk
[^16]: Claude Lab, "Handling Frequent 529 Overloaded Errors in the Claude Agent SDK" (2026-04-22). https://claudelab.net/blog/claude-529-overloaded-handling
[^17]: IETF RFC 9457, "Problem Details for HTTP APIs." https://datatracker.ietf.org/doc/html/rfc9457
[^18]: IETF RFC 7231, "HTTP/1.1 Semantics and Content — §4.2.2 Idempotent Methods." https://datatracker.ietf.org/doc/html/rfc7231
[^19]: IETF, draft-ietf-httpapi-idempotency-key-header (Sanjay Dalal et al.). https://datatracker.ietf.org/doc/html/draft-ietf-httpapi-idempotency-key-header
[^20]: Restate (open source), runtime repository. https://github.com/restatedev/restate
[^21]: Anthropic API Docs, "Errors." https://docs.anthropic.com/en/api/errors
[^22]: Claude API Docs, "Errors and retry guidance." https://docs.claude.com/en/api/errors
[^23]: AWS, "Lambda + SQS error handling, visibility timeouts and dead-letter queues." https://docs.aws.amazon.com/lambda/latest/dg/services-sqs-errorhandling.html
[^24]: AWS, "SNS message delivery retries." https://docs.aws.amazon.com/sns/latest/dg/sns-message-delivery-retries.html
[^25]: AWS, "Reliability Pillar — at-least-once delivery." https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/welcome.html
[^26]: Google Cloud, "Pub/Sub exactly-once delivery." https://cloud.google.com/pubsub/docs/exactly-once-delivery
[^27]: Microsoft Azure Architecture Center, "Saga distributed transactions pattern." https://learn.microsoft.com/en-us/azure/architecture/patterns/saga
[^28]: Microsoft Azure Architecture Center, "Transactional Outbox pattern." https://learn.microsoft.com/en-us/azure/architecture/patterns/transactional-outbox
[^29]: Microsoft Azure Architecture Center, "Retry pattern guidance." https://learn.microsoft.com/en-us/azure/architecture/patterns/retry
[^30]: Model Context Protocol, "Tool result semantics — 2025-11-25 specification." https://modelcontextprotocol.io/specification/2025-11-25/server/tools
[^31]: ExeSolution, "Building agentic workflows with Spring Boot." https://exesolution.com/agentic-workflows-spring-boot
[^32]: AxonFlow Docs, "retry_context and idempotency_key." https://getaxonflow.com/docs/retry-context
[^33]: AgentixLabs, "Debugging agent idempotency in production." https://agentixlabs.com/blog/debugging-agent-idempotency
[^34]: Finly, "Designing idempotent APIs at scale." https://finlyinsights.com/api-idempotency-design
[^35]: Codelit, "Idempotent API design patterns." https://codelit.io/idempotent-api-design
[^36]: Md Sanwar Hossain, "Idempotency patterns in distributed systems." https://mdsanwarhossain.me/blog/idempotency-distributed-systems
[^37]: Hookbase, "Idempotency keys for webhooks" (2026-04-22). https://hookbase.app/blog/idempotency-keys-webhooks
[^38]: APIScout, "Why API Idempotency Matters in 2026." https://apiscout.dev/api-idempotency-2026
[^39]: ClaudeGuide, "Claude API error handling — production patterns with retry logic." https://claudeguide.io/claude-error-handling
[^40]: Sujeet Jaiswal, "Stripe: Idempotency for Payment Reliability" (2026-02-08). https://sujeet.pro/posts/stripe-idempotency-payment-reliability
[^41]: Hash Block, "7 tooling patterns that make agents auditable by design" (Feb 2026). https://medium.com/@hashblock/auditable-agents-tooling-patterns
[^42]: Semaphore, "Building idempotent APIs — patterns and pitfalls." https://semaphoreci.com/blog/idempotent-apis
[^43]: Martin Fowler, "Patterns of Distributed Systems." https://martinfowler.com/articles/patterns-of-distributed-systems/

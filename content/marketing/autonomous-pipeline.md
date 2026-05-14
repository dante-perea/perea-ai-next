---
title: "The Autonomous Pipeline Shape"
subtitle: "The /loop + fat-tick + state-machine + lock-file + kill-switch shape that lets a Claude Code skill run a production content pipeline unattended — and the sibling-independence rule that prevents engines from corrupting each other."
publication: "perea.ai Marketing Playbooks"
authors: ["Dante Perea"]
version: "1.0"
status: "Public draft"
date: "2026-05-14"
audience: "Engineers building autonomous Claude Code pipelines that need to run for weeks unattended."
length: "~2,500 words"
license: "CC BY 4.0"
description: "perea's pattern for autonomous Claude Code skills that run on /loop and ship work unattended. Fat-tick chaining inside a per-tick budget, a per-paper state machine, a tick.lock file for concurrency, a kill-switch to drop stuck papers, and a sibling-independence rule so engines don't try to coordinate."
paper_type: "marketing-playbook"
source_engine: "perea-research-engine"
keywords:
  - autonomous pipeline
  - Claude Code /loop
  - fat-tick
  - state machine
  - tick.lock
  - kill-switch
  - sibling engines
topical_entities:
  - "Claude Code"
  - "perea-research-engine"
  - "tick-X-post-from-research"
  - "kinetic-podcast-engine"
---

## What this Playbook gives you

A shape for a production content pipeline that runs autonomously inside Claude Code — invoked by `/loop` at a fixed cadence, idempotent per tick, durable across restarts. perea runs three such pipelines today: `perea-research-engine` (paper production), `tick-X-post-from-research` (X distribution), and `kinetic-podcast-engine` (kinetic-typography reels). They share the shape; they are independent in operation.

The shape decomposes into five rules:

1. **`/loop` is the runtime.** Every pipeline is invoked as a Claude Code slash command, fired by the user's `/loop` command at a fixed cadence (5 to 10 minutes).
2. **Fat-tick chaining.** Each tick chains as many phase advances as fit inside a per-tick budget. The cadence is a floor, not a cadence.
3. **State machine per work unit.** A per-paper (or per-post, or per-reel) state machine drives the work. Each tick advances the active work unit through phases.
4. **Lock file + kill-switch.** A `tick.lock` file prevents concurrent ticks. A `ticks_in_phase` counter drops stuck work to a `blocked` state after a threshold.
5. **Sibling-independent engines.** Engines run independently; they do not coordinate. Cross-engine memory or hand-off is explicitly out of scope.

Together, the five rules produce a pipeline that is durable, observable, and recoverable without ad-hoc intervention.

## `/loop` is the runtime

perea's pipelines never run as standalone daemons. They are Claude Code skills invoked by the user typing:

```
/loop 5m /tick-X-post-from-research
```

The Claude Code `/loop` skill fires the specified slash command every 5 minutes. The skill is what perea writes; the cadence and process management is delegated to Claude Code.

This has two consequences:

- **The runtime is the user's session.** When the user closes the terminal, the loop stops. The pipelines are not background services; they are "things the user is running."
- **The skill must be idempotent.** A tick that crashes halfway can be re-run safely. The state machine + lock file are what make this possible.

The trade-off accepted: the pipelines stop when the user steps away for a week. That is fine for perea's volume. If you need 24/7 unattended operation, write a daemon, not a Claude Code skill.

## Fat-tick chaining

A naive design would put one phase advance per tick. perea's design — fat-tick — chains as many phase advances as fit inside a per-tick wall-clock budget.

For example, `perea-research-engine` has a tick budget of 8 minutes (under the `/loop 10m` cadence's 10-minute window). Inside one fat tick, it might run:

```
verifying → staging → shipping → shipped → derive
```

— five phase advances in one tick, ending with a derivation pass that grows the roadmap from the just-shipped paper.[^prod-1]

The budget is the safety mechanism. Before entering each phase, the dispatch loop checks how much budget remains; if a phase's minimum-cost floor exceeds the remaining budget, the dispatcher breaks early. The next tick picks up where the previous left off.

Why fat-tick:

- **Phase advances often share work.** A `verifying` phase that already loaded the paper into memory can run `staging` immediately without re-loading. Splitting these into separate ticks adds I/O.
- **End-to-end flows take time.** "Ship a paper" is a logically connected operation; running it across 5 separate ticks introduces 25 minutes of latency for no benefit.
- **The cadence is a floor.** `/loop 10m` says "fire at least every 10 minutes if idle." It doesn't say "do at most 10 minutes of work per fire." Fat-tick fills the budget when work is available.

## State machine per work unit

Each pipeline has a per-work-unit state machine. perea-research-engine's is:

```
backlog → researching → outlined → drafting → verifying → staging → shipping → shipped
```

At any time, exactly one work unit is in a `{researching, outlined, drafting, verifying, staging, shipping}` state. Other units are in `backlog` or have already `shipped`. The single-active invariant is what makes the pipeline tractable to reason about: you can always answer "what is the engine working on right now?"

State lives in JSON sidecars under the skill's `state/` directory. Each tick reads the active unit's state, advances it, writes back. The skill's main loop is:

```
1. Acquire tick.lock (or no-op if held).
2. Load state.
3. Dispatch on the active unit's phase.
4. Run that phase's work block.
5. Write back state with the new phase or with diagnostic.
6. Release tick.lock.
```

The state file is the contract between ticks. A crash mid-tick leaves the state file in its pre-tick form (assuming you write atomically); the next tick picks up cleanly.

## Lock file + kill-switch

`tick.lock` is a file holding the timestamp of the currently-running tick. A tick that finds a fresh lock (younger than `LOCK_STALE_SECONDS`) exits as a no-op. This handles the case where `/loop` fires while a previous tick is still running.

The lock is released on tick completion. If a tick crashes without releasing, the lock becomes stale after the timeout window and the next tick proceeds. perea uses 1800 seconds (30 min) for the stale window — long enough that a slow legitimate tick won't be killed, short enough that recovery from a crash is bounded.

The kill-switch is the second safety. Each phase tracks `ticks_in_phase` — a counter incremented every time a tick advances the same unit in the same phase without progressing. When `ticks_in_phase` exceeds a threshold (perea uses 20 for `verifying`), the unit is moved to `blocked` and a diagnostic is written to the log. Subsequent ticks skip the blocked unit and pick a different one from `backlog`.

The kill-switch prevents a single stuck unit from burning every tick indefinitely. Operator review is then required to resolve the block — usually the unit needs a content fix or an engine update.[^prod-2]

## Sibling-independent engines

The hardest discipline. perea has three engines (`perea-research-engine`, `tick-X-post-from-research`, `kinetic-podcast-engine`). They read the same papers. They do not coordinate.

Two specific rules:

1. **No cross-engine memory.** Each engine's `state/` directory is its own. Engines do not read each other's logs, queues, or roadmaps.
2. **No hand-off events.** A paper "being shipped" by perea-research-engine does not trigger the X-post engine. Both engines run on their own cadences; the X-post engine notices the new paper when its next pick step finds it.

The temptation to coordinate is real — "shouldn't the X-post engine post immediately when a paper ships?" — and explicitly rejected. The reasoning:

- **Coordination introduces ordering bugs.** A hand-off event from engine A to engine B requires A to know about B and vice versa. As engine count grows, the coupling becomes quadratic.
- **Independence is auditable.** Each engine's tick log tells a complete story. Cross-engine logs don't.
- **Engines fail at different times.** A research-engine bug shouldn't block the X-post engine; a Sonnet outage shouldn't block reel rendering. Independence localizes failure.

The exception, accepted reluctantly: engines may read **shared static artifacts**. The papers themselves (in `content/whitepapers/`) are shared input. The Quotables inside those papers are shared. But neither engine reads the other's state.[^prod-3]

## Production results

The shape has been running across three perea engines since spring 2026. Observations from operating it:

- **Fat-tick is essential.** When perea-research-engine was originally one-phase-per-tick, the end-to-end "ship a paper" time was ~3 hours (10 min × 18 phases). After fat-tick, it dropped to ~30 minutes worst-case, most often a single fat tick.[^prod-1]
- **The kill-switch fired rarely but indispensably.** A handful of stuck-paper events occurred over the first quarter, each resolving to a content fix or engine update. Without the kill-switch, these would have burned ticks for days.[^prod-2]
- **Sibling independence held up under stress.** When the X-post engine had a temporary omnisocials API issue, the research engine kept shipping papers and the reel engine kept producing reels. Each engine's failure was local.[^prod-3]

## Failure modes

- **The lock outlives its purpose.** If you set `LOCK_STALE_SECONDS` too low, slow legitimate ticks get cancelled. Too high, and crash recovery is slow. 30 minutes is the perea default for 5-minute and 10-minute cadences.
- **Budget exhaustion mid-phase.** A phase that has started but not finished when the budget runs out leaves the state machine mid-phase. The next tick's first job is to detect this and either resume or roll back. perea's state-file convention writes phase as `<phase>:partial` when entering, `<phase>:done` when leaving.
- **State directory pollution.** Over months, the `state/` directory accumulates archived units, log files, surfaced ideas. perea archives shipped units to `state/papers/_archived/<slug>/` and rotates the log monthly. Without rotation, the directory grows unboundedly.
- **The /loop session ends silently.** When the user closes the terminal, the loop stops without an event. perea's heartbeat is the operator manually running `/status` daily. For higher reliability, write a daemon.

## How to apply in your stack

Five concrete pieces:

1. **A slash command per pipeline.** The Claude Code skill is the unit.
2. **A `state/` directory with per-unit JSON sidecars + an append-only `log.md`.**
3. **A dispatch function** that reads state, picks the active unit, picks the phase, runs the phase's work block, writes state back.
4. **A `tick.lock` file** acquired at the top of dispatch, released at the bottom (or on stale-window expiry).
5. **A per-phase `ticks_in_phase` counter** with a configurable kill-switch threshold.

The fat-tick wrapper is optional but high-leverage. It's a loop around the dispatch function that re-checks budget and re-dispatches if the previous phase advanced the unit.

The hardest part is restraint. The temptation to add hand-offs between engines, shared state caches, cross-engine telemetry — these all reduce sibling independence and erode the audit story. perea's standing rule: engines are siblings, not collaborators.

## Quotable Findings

> The shape decomposes into five rules: /loop is the runtime, fat-tick chaining, state machine per work unit, lock file plus kill-switch, sibling-independent engines.[^prod-1]

> The cadence is a floor, not a cadence — /loop 10m says "fire at least every 10 minutes if idle," not "do at most 10 minutes of work per fire"; fat-tick fills the budget when work is available.[^prod-1]

> When perea-research-engine was originally one-phase-per-tick, end-to-end "ship a paper" time was ~3 hours; after fat-tick it dropped to ~30 minutes worst-case.[^prod-1]

> The kill-switch prevents a single stuck unit from burning every tick indefinitely — when ticks_in_phase exceeds 20 in the verifying phase, the unit is moved to blocked and operator review is required.[^prod-2]

> Engines are siblings, not collaborators — each engine's state directory is its own; engines do not read each other's logs, queues, or roadmaps.[^prod-3]

## References

[^prod-1]: Fat-tick design in `perea-research-engine` SKILL.md "State machine" + "Fat-tick mode" sections. Evidence: [fat-tick design](/marketing/autonomous-pipeline/evidence/fat-tick-design).

[^prod-2]: Kill-switch behavior documented in `perea-research-engine` SKILL.md "Safety gates" section, specifically the per-paper kill switch. Evidence: [kill-switch design](/marketing/autonomous-pipeline/evidence/kill-switch-design).

[^prod-3]: Sibling-independence rule documented across all three perea engines and reinforced in the operator's auto-memory. Evidence: [sibling independence](/marketing/autonomous-pipeline/evidence/sibling-independence).

# Autonomous Pipeline — fat-tick design

Source: `~/.claude/skills/perea-research-engine/SKILL.md`, "State machine (per paper)" and the fat-tick mode description.

## State machine

```
backlog → researching → outlined → drafting → verifying → staging → shipping → shipped
```

Per-paper state transitions; the engine maintains the invariant that exactly one paper is in `{researching, outlined, drafting, verifying, staging, shipping}` at a time.

## Fat-tick mode (default)

> A single tick chains as many phase advances as fit inside the 8-minute budget. The 10-minute cron interval is a floor, not a cadence — when the work fits, one tick can run `researching → outlined → drafting (3 sections)` or `verifying → staging → shipping → shipped → derive` end-to-end. See `tick.md` Step 3 for the dispatch loop, hard yield points, and per-phase budget floors.

## Tick budget

> ≤ 8 minutes total wall-clock per tick (provides margin under the 10-min loop window). The dispatch loop checks budget headroom before entering each phase and breaks early if insufficient.

## Concurrency invariant

> Exactly one paper in `researching|outlined|drafting|verifying|staging|shipping` at a time.

## Why this works

Each phase advance is small and idempotent — write a section, run a verifier, commit, push. Chaining them inside one tick means the engine can complete a full ship cycle (`verifying → staging → shipping → shipped → derive`) in a single tick when the budget allows. The next tick's job is to pick the next paper from the backlog.

Without fat-tick, the same ship cycle would span 5 ticks × 10 minutes = 50 minutes minimum. With fat-tick, it's seconds-to-minutes, bounded by the actual work.

## Per-phase budget floors

The dispatch loop checks before entering each phase: "does the remaining budget exceed this phase's minimum-cost floor?" If yes, enter the phase. If no, break and let the next tick pick up.

This guarantees that no phase starts and runs out of budget mid-execution. The state machine never lands in a half-finished phase due to budget exhaustion (only due to actual failure, which is handled separately by the kill-switch).

## Operational evidence

Originally perea-research-engine ran one phase per tick. End-to-end "ship a paper" took ~3 hours (10 min × 18 phases for a typical paper's full lifecycle through `researching` and `drafting` sub-iterations). After fat-tick, the same operation drops to a single tick or a small handful, depending on dossier size.

The fat-tick reframe also exposed an unrelated bug class: state files written between phase advances were sometimes inconsistent. Once fat-tick made multi-phase chaining the default, the engine surfaced cases where state writes weren't atomic. Each was fixed individually; the fat-tick framing made the bugs visible.

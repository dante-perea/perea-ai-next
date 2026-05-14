# Autonomous Pipeline — kill-switch design

Source: `~/.claude/skills/perea-research-engine/SKILL.md`, "Safety gates" section.

## The rule

> **Per-paper kill switch:** if `ticks_in_phase` exceeds 20 in `verifying`, set state to `blocked` and surface a one-line note in `log.md`. Prevents stuck papers from burning ticks.

## How it works

Each phase tracks a per-paper counter `ticks_in_phase`. It increments when:
- A tick is invoked for that paper
- In the current phase
- Without advancing to the next phase

It resets when:
- The paper successfully advances to the next phase
- The paper is moved to `blocked` by the kill-switch

When `ticks_in_phase` reaches the threshold (20 for `verifying`), the engine writes `state.phase = "blocked"` and writes a one-line note to `log.md`:

```
2026-MM-DD HH:MM | tick #N | kill-switch | <slug> blocked after 20 ticks in verifying
```

Subsequent ticks skip the blocked paper when scanning for the active paper. The backlog scan picks a different paper to promote to active.

## Why this matters

Without a kill-switch, a paper that fails to verify (e.g., because its source mix can't satisfy the tier quota for its profile) would block the entire engine. Every tick would attempt to advance the same paper, hit the same failure, and burn the tick budget without progress.

With the kill-switch, the engine drops the stuck paper after a bounded number of tries and picks something else from the backlog. Operator review is then required to resolve the block — usually a content fix (the paper needs more primary sources) or an engine update (the profile quota was too aggressive).

## Threshold tuning

The threshold of 20 was chosen empirically. Lower thresholds (5–10) caused false blocks during long verify-fail-fix cycles where the author was iterating. Higher thresholds (50+) let the engine burn too much budget before noticing.

The threshold is per-phase. `verifying` uses 20 because it's the phase where iteration is normal. Other phases use lower thresholds because they should rarely loop (e.g., `staging` is essentially a commit — looping there indicates a real issue).

## Recovery

When a paper is `blocked`, operator review proceeds via:

1. Read the last few entries in `log.md` for the blocked slug.
2. Inspect the paper's `state.json` for the diagnostic.
3. Either fix the content (re-run the failing phase manually) or update the engine's quota / verifier prompt.
4. Move the paper back to `verifying` by editing `state.json`.

The next tick picks it up and resumes from where it left off. There is no "unblock" command in the SKILL — operator inspection is required because the block is signal of a real problem.

## What the kill-switch is NOT

- It is not a retry mechanism. It is a giving-up mechanism.
- It is not a circuit breaker that resets after time. The block persists until operator intervention.
- It is not specific to verifying. It applies to any phase, but `verifying` is where it fires most often.

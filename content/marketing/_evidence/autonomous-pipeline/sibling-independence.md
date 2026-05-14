# Autonomous Pipeline — sibling-independence rule

Source: operator standing instruction; captured in `tick-X-post-from-research` SKILL.md and reaffirmed in auto-memory.

## The rule

> **Perea engines are independent siblings** — don't propose cross-engine coordination on perea papers unless explicitly asked.

(From the operator's auto-memory: `feedback_perea_engines_isolation.md`.)

## What "independent siblings" means

Three engines share input substrate (the `content/whitepapers/` directory in `perea-ai-next`):

1. `perea-research-engine` — produces papers, commits them to `content/whitepapers/`.
2. `tick-X-post-from-research` — reads papers, schedules X posts.
3. `kinetic-podcast-engine` — reads papers, renders kinetic-typography reels.

Each engine:
- Has its own `state/` directory under `~/.claude/skills/<skill>/state/`.
- Has its own tick log (`state/log.md`).
- Has its own lock file (`state/tick.lock`).
- Does not read any other engine's state.

There is no event bus. No engine notifies another. No engine waits on another. The shared substrate (the papers) is the only point of contact.

## How an engine discovers new work

Each engine has its own "pick" step at the top of its tick. The pick step scans the shared substrate for eligible work and chooses based on the engine's own selection criteria:

- `perea-research-engine` picks from `state/roadmap.json` (its own state).
- `tick-X-post-from-research` picks from `content/whitepapers/` filtered by Quotables presence, not-already-scheduled, etc.
- `kinetic-podcast-engine` picks from `content/whitepapers/` filtered by Quotables presence, no existing reel in KB.

When `perea-research-engine` ships a new paper, the other engines notice it on their next pick step. There is no hand-off.

## Why this matters

**Localized failure.** When `tick-X-post-from-research` has an omnisocials outage, it logs and retries; `perea-research-engine` and `kinetic-podcast-engine` continue shipping. None of the engines knows or cares about the others' state.

**Audit clarity.** Each engine's `log.md` tells a complete story of that engine's ticks. There are no cross-references to other engines' logs. Cross-engine audit is done manually by the operator, not built into the engines.

**Reduced coupling.** Adding a new engine (e.g., a hypothetical `tick-linkedin-post-from-research`) does not require modifying the existing engines. The new engine reads the shared substrate and writes to its own state directory.

**Resistance to ordering bugs.** Hand-off events between engines would require careful ordering (e.g., "X-post engine should not post until research-engine has finalized the paper"). The independence rule sidesteps this: the X-post engine reads from a `git push origin main` commit-stable state, not from in-flight research-engine state. The act of committing the paper to `main` is the implicit barrier.

## When coordination IS appropriate

Operator standing instruction permits coordination only when explicitly requested. The shape of legitimate coordination is:

- The operator explicitly says "I want engine X to wait for engine Y on condition Z."
- The coordination is documented (typically as an ADR).
- The coordination is implemented as a shared **artifact** (a file in the repo), not as a runtime hand-off (an event, a queue, a callback).

Examples of *not* legitimate coordination (rejected in past sessions):
- "tick-X-post-from-research should post immediately when research-engine ships." — rejected, breaks independence.
- "kinetic-podcast-engine should skip papers being processed by tick-X-post-from-research." — rejected, requires reading X-post engine's state.

The default is independence. Coordination is the exception, justified per-case, captured in an ADR.

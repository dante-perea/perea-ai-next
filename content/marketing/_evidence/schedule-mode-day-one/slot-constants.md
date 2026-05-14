# Schedule Mode — slot constants

Source: `~/.claude/skills/tick-X-post-from-research/SKILL.md`, "Hard constants" section.

```
SLOTS_UTC              = [14:00, 22:00]           (v1 placeholder; operator updates from analytics)
QUEUE_AHEAD_DAYS       = 14                       (28 slots total)
X_CHANNEL_ID           = 358764_x                 (verified 2026-05-13)
X_ACCOUNT_HANDLE       = @perea_ai
OMNISOCIALS_CLI        = ~/.agents/skills/omnisocials/scripts/omnisocials.js
```

## How slots are filled

On each tick, the engine:

1. Lists the next 14 days × 2 slots = 28 slot-times via the schedule template.
2. Queries omnisocials for `posts:list --status scheduled --channel 358764_x`.
3. Diffs to find the next open slot.
4. If the queue is full (no open slot within 14 days), the tick no-ops.
5. If an open slot exists, the engine picks the highest-priority eligible paper (via `SELECTION_ORDER = frontmatter-date-desc`), drafts a post under the Hybrid Contract, and schedules it to the open slot via `omnisocials posts:create --schedule-at <slot-time>`.

## Slot integrity

Slots are absolute UTC times. The engine never schedules to a "next available time" — it schedules to a specific UTC slot. This is what makes the queue deterministic and reviewable.

If a slot is missed (e.g., the engine is down for an extended period and a slot passes without a post scheduled), the missed slot is **not** backfilled. The next tick targets the next open future slot, not the missed past one. Backfilling would compress posts in time and violate the cadence.

## Channel and account binding

The hard constants pin the channel to `358764_x` (verified 2026-05-13) and the handle to `@perea_ai`. These constants are checked at tick startup; if omnisocials returns a different channel for the handle, the tick aborts and logs. This prevents accidental posting to a wrong account if the channel ID is mutated upstream.

## Why the slots aren't dynamic

The slot times are constants because:

1. **Reviewability.** A scheduled post at a fixed UTC slot is trivially auditable. A scheduled post at "the next available optimal time" is not.
2. **Cache and signal.** Audience habit forms around predictable cadence. Variable slot times pollute the signal you'd use to optimize them.
3. **Operator-editable.** The constants live in the SKILL.md and are operator-editable. The change cadence is "after analytics review," not "per tick."

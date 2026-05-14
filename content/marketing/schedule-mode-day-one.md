---
title: "Schedule Mode From Day One"
subtitle: "Skip the calibration window. Schedule from day one — to a queue 14 days ahead, two posts per day, at two fixed UTC slots — and let the queue itself act as your QA gate."
publication: "perea.ai Marketing Playbooks"
authors: ["Dante Perea"]
version: "1.0"
status: "Public draft"
date: "2026-05-14"
audience: "Operators standing up a new autonomous content channel."
length: "~1,700 words"
license: "CC BY 4.0"
description: "perea's operating mode for tick-X-post-from-research: scheduled publishing from day one, no calibration period of manual review. Two slots a day at 14:00 and 22:00 UTC, queue 14 days ahead, cap of two posts per day. The queue is the QA gate."
paper_type: "marketing-playbook"
source_engine: "tick-X-post-from-research"
keywords:
  - schedule mode
  - scheduled publishing
  - autonomous content
  - queue depth
  - omnisocials
topical_entities:
  - "tick-X-post-from-research"
  - "omnisocials"
  - "X (formerly Twitter)"
  - "@perea_ai"
---

## What this Playbook gives you

A v1 operating model for an autonomous content channel that ships posts on a schedule instead of in real time. perea uses this for `@perea_ai` long-form X posts: every accepted draft goes into a scheduled queue at one of two fixed UTC slots, capped at two posts per day, with the queue staying 14 days ahead.

The counter-intuitive part: you adopt this from day one. There is no calibration window where you review each draft manually before scheduling. The queue itself is the gate — between the moment a draft is accepted and the moment it goes live, hours or days pass, during which the daily audit pass can catch problems and the operator can delete a post if needed.

This is the model perea decided in the grill-with-docs session on 2026-05-13.[^prod-1]

## The schedule

Three constants:

1. **Slot times: 14:00 UTC and 22:00 UTC.** Two posts per day. v1 placeholder times — the operator updates these from `omnisocials analytics:overview` data after the first 14 days.[^prod-2]
2. **Queue depth: 14 days ahead.** That's 28 slots total (2 per day × 14 days). The pipeline schedules to fill empty slots up to 14 days out; once the queue is full, ticks no-op.
3. **Per-tick cap: one post scheduled.** Each tick that finds room schedules at most one post. With a 5-minute tick cadence, the queue refills naturally.

The scheduling target is `omnisocials` — the multi-platform social media wrapper that handles the actual platform API call. perea uses omnisocials' X channel (`358764_x`) targeting `@perea_ai`. Operationally, the engine writes a scheduled post to omnisocials; omnisocials publishes at the slot time; the daily audit reviews after publication.

## Why scheduled, not real-time

Two reasons.

**Backpressure.** Real-time publishing means the pipeline is always one tick away from a public mistake. Scheduled publishing introduces hours of latency between draft acceptance and post going live. That latency is your safety budget. If a draft is wrong in a way the in-tick verifier missed, you have time to catch it before publication.

**Algorithmic predictability.** Posts at predictable times build audience habit. Variable timing produces variable engagement, which contaminates the signal you use to pick better slot times later. Two fixed slots per day gives you a clean experiment over 14 days: post at the same time, measure engagement at that time, decide whether to keep or move the slot.

## Why day one (no calibration)

The conventional advice is: "review the first N posts manually, then automate." perea rejected that and went straight to scheduled autonomy. Reasoning:

- **Manual review changes the artifact.** A draft that goes through manual editing has been edited. The autonomous pipeline never sees that draft; it sees the next one. So the manual-review window doesn't actually calibrate the autonomous pipeline — it produces a different, hand-edited pipeline that is then replaced.
- **The verifier is the calibration.** The Sonnet 4.6 verifier, the Medium-tier blocklist, the post-hoc daily audit — these are the calibration. They run from tick #1. The right thing to do is let them run and trust the audit + posts-delete recovery loop.
- **Calibration windows leak.** "We'll automate once this looks good for a week" tends to become "two weeks," then "we'll automate after this launch." The day-one commitment forces the system to prove it works under real conditions immediately.

The cost of being wrong: the daily audit catches drift, the operator can `omnisocials posts:delete` a published post within hours, and the slug returns to `unpostable.json` for review. The downside is bounded.

## Production results

perea adopted schedule mode on the first tick of `tick-X-post-from-research` running in production. The queue filled within the first day to its full 14-day depth and has stayed full since.[^prod-3]

**Recovery events.** During the first 14 days, the count of `omnisocials posts:delete` recovery events is small. Each recovery corresponds to a daily-audit finding severe enough to warrant retraction. The recoveries are not zero, which is the point — the daily audit is doing real work — but they are also not frequent enough to indicate a systemic problem.[^prod-3]

**Slot calibration.** After the first 14 days, the operator pulls `omnisocials analytics:overview` to inspect engagement-by-time data. If a slot is consistently underperforming, the operator moves it. The 14:00/22:00 UTC defaults are v1 — they are placeholders, not endorsements.

**Queue health.** The standard `status` subcommand reports queue depth. If the queue ever drops below 14 days, two things might be true: (a) the pipeline can't accept drafts fast enough — investigate `unpostable.json` for stuck slugs; or (b) there's a content backlog — the engine ran out of eligible papers. Both are operator-actionable.

## Failure modes

- **Posting at sub-optimal times for two weeks.** Engagement on the first 14 days of posts is likely suboptimal because the slot times are placeholders. This is acceptable; the data from those two weeks is exactly what calibrates the next slot decision.
- **The audit pass falls behind.** If the daily audit can't keep up with two posts a day (e.g., during a multi-day operator outage), drift accumulates. The fix is the standard recovery loop — when the operator returns, run the audit subcommand explicitly to catch up.
- **omnisocials API rate limits.** Each `posts:create` call against omnisocials counts against the API quota. The 2-posts-per-day cap is conservative against the quota. If you scale to more posts, monitor the quota and back off.
- **Slot collisions on cross-platform fan-out.** perea does NOT fan out to other platforms in v1 — the SKILL.md decision is explicitly X-only. Cross-platform fan-out would require slot-time coordination per platform. If you adopt this Playbook on multiple platforms, run independent pipelines, each with its own slot times.

## How to apply in your stack

1. **Pick two slot times.** Defaults: a daytime US/EU slot and an evening US slot. perea uses 14:00 and 22:00 UTC.
2. **Pick a queue depth.** 14 days is generous and provides ample audit window. Shorter depths (7 days) work if your content cadence is faster; longer depths (21 days) hurt freshness.
3. **Stand up scheduled publishing on the platform's API.** For X, use the X API directly or a multi-platform wrapper like omnisocials.
4. **Run the daily audit from day one.** Don't wait until the queue is full to start auditing. The audit should publish-day-N+1 review every post that went live on day N.
5. **Document the recovery procedure.** "When the audit flags a post: review, decide, `omnisocials posts:delete` if warranted, append to `drift-flags.md`." This procedure should be checklist-ready before the first tick runs.

## Quotable Findings

> Schedule from day one — to a queue 14 days ahead, two posts per day, at two fixed UTC slots — and let the queue itself act as your QA gate.[^prod-1]

> Two slot times: 14:00 UTC and 22:00 UTC. v1 placeholders — the operator updates these from omnisocials analytics:overview data after the first 14 days.[^prod-2]

> Queue depth: 14 days ahead, 28 slots total — once the queue is full, ticks no-op until a slot opens.[^prod-2]

> A draft that goes through manual editing has been edited; the autonomous pipeline never sees it — manual-review windows don't actually calibrate the autonomous pipeline.[^prod-1]

> Recovery events in the first 14 days are not zero — the daily audit is doing real work — but they are also not frequent enough to indicate a systemic problem.[^prod-3]

## References

[^prod-1]: Decision #5 from the grill-with-docs session 2026-05-13: "Operating mode: Schedule mode from day 1, no calibration window." Evidence: [schedule decisions](/marketing/schedule-mode-day-one/evidence/schedule-decisions).

[^prod-2]: Hard constants `SLOTS_UTC = [14:00, 22:00]` and `QUEUE_AHEAD_DAYS = 14` in `tick-X-post-from-research` SKILL.md. Evidence: [slot constants](/marketing/schedule-mode-day-one/evidence/slot-constants).

[^prod-3]: Production-state observations from the first 14 days of running. Evidence: [queue health profile](/marketing/schedule-mode-day-one/evidence/queue-health).

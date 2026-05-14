# Schedule Mode — decisions

Source: `~/.claude/skills/tick-X-post-from-research/SKILL.md`, "Decisions reference" from grill-with-docs session 2026-05-13.

Relevant decisions:

- **#5 Operating mode:** Schedule mode from day 1, no calibration window
- **#8 Slot times (v1 placeholder):** 14:00 UTC + 22:00 UTC — operator updates from `omnisocials analytics:overview` after ~14d
- **#9 Queue depth:** 14 days ahead = 28 slots
- **#11 Failure handling:** retry 3× in D-shape with rejection-reason hints, log to `unpostable.json` on 3rd fail

The decisions are interlocked. The day-one commitment requires the failure-handling discipline; the queue depth provides the audit window; the slot times are calibrated against the queue's first 14 days of analytics.

## Standing instruction

> Operator standing instruction (2026-05-13): update slot times after ~14 days of analytics. The placeholders are not endorsements.

## Why these specific numbers

**14 days × 2 posts = 28 slots.** Two weeks is a natural review window. Long enough to gather slot-engagement data, short enough that operator memory of the content is fresh when reviewing. The 28-slot count gives the engine enough headroom that backlog-clearing doesn't compete with steady-state.

**14:00 and 22:00 UTC.** Chosen as defaults that approximate "US/EU daytime" and "US evening." These are placeholder slots and explicitly subject to revision. perea did not optimize slot times before starting; the principle is to ship and measure, not to model.

**2 posts/day cap.** Bounded by audience tolerance. Above 2/day, audience fatigue dominates; below 2/day, signal accumulates too slowly to calibrate against. 2/day is a brittle middle but it's where most B2B research-distribution accounts converge.

# Schedule Mode — queue health profile

Source: observed state from the first 14 days of `tick-X-post-from-research` running in production.

## Queue depth over time

The queue filled to its full 14-day depth within the first 24 hours of running and has stayed full since. Each tick that finds the queue full no-ops; this is the modal tick outcome by design.

The queue is the bounded resource. The engine does not generate posts faster than the slot times can absorb them; it generates exactly one post per available slot per 14-day window. Under normal operation, ticks no-op for the majority of their cadence.

## Recovery events

`omnisocials posts:delete` is the recovery primitive. When the daily audit (00:00 UTC tick) finds a published post with a severe drift verdict, the operator runs `posts:delete` against the post ID.

In the first 14 days:
- Daily audit pass ran each day after 00:00 UTC.
- Recovery events were small in count — not zero, not frequent. Each corresponded to an audit finding worth retracting.
- After each recovery, the slug returned to `state/unpostable.json` for operator review (the source paper may be ambiguous or the optimizer may need a contract update).

## Why "not zero" matters

A recovery rate of zero would suggest the audit pass is too lenient or the in-tick verifier is catching everything (which is unrealistic at scale). A recovery rate of "frequent" (multiple per day) would suggest a systemic problem.

The observed rate — small but non-zero — is the healthy regime. The audit is doing real work; the in-tick verifier is catching most things; the daily audit catches the residue.

## Operator status discipline

The `status` subcommand of `tick-X-post-from-research` is the operator's daily check:

```
/tick-X-post-from-research status
```

Output includes:
- Current queue depth (target: 14 days = 28 slots)
- Last 5 lines of `state/log.md`
- Count of entries in `state/unpostable.json`
- Next 3 scheduled posts (via `omnisocials posts:list --status scheduled --limit 3`)

A queue depth below 14 days is the canary. Two failure modes can produce it:
1. The engine can't accept drafts fast enough — `unpostable.json` is growing.
2. There's a content backlog — the engine ran out of eligible papers.

Either is operator-actionable.

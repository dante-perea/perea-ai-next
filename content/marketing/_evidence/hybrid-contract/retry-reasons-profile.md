# Hybrid Contract — retry-reason profile

Source: rejection-reason categories surfaced by the post-hoc Sonnet 4.6 reviewer during the D-shape retry loop. Aggregated from the first 14 days of `tick-X-post-from-research` production runs.

Each retry surfaces a `rejection_reasons[]` array attached to the draft attempt; on the 3rd retry, the slug + attempts are appended to `state/unpostable.json` for operator review. The categories below are the modal reasons across drafts that were either accepted on a retry or escalated to unpostable.

## Category 1 — invented numerics (modal)

The optimizer rounds, approximates, or substitutes a number that the Hybrid Contract holds verbatim.

Examples (paraphrased from anonymized rejection reasons):
- Source paper says `40.2%`; draft says `~40%`. Rejected.
- Source paper says `28 slots`; draft says `roughly four weeks of queue`. Rejected (rephrasing a quantified queue depth as duration).
- Source paper says `2026-05-13`; draft says `mid-May 2026`. Rejected.

Mitigation: surface the specific drift to the optimizer on retry; the optimizer routes around the specific phrasing without losing the framing.

## Category 2 — named-entity substitution

The optimizer uses a shorter, more familiar, or paraphrased form of a named entity.

Examples:
- Source says `Claude Sonnet 4.6`; draft says `Sonnet 4` or `the latest Sonnet`. Rejected.
- Source says `tick-X-post-from-research`; draft says `the X-post engine`. Rejected.
- Source says `AP2 (Agent Payments Protocol)`; draft says `Anthropic's payment protocol`. Rejected.

Mitigation: the blocklist (`medium-tier-blocklist` Playbook) has a sub-tier for known-substituted entities; once a substitution recurs, the operator adds the substitution pair to the blocklist.

## Category 3 — forward-looking promotion

The optimizer turns a hedged claim into a confident one.

Examples:
- Source says `is expected to`; draft says `will`. Rejected.
- Source says `may`; draft drops the modal entirely. Rejected.

Mitigation: same as Category 1 — specific drift carried forward into retry.

## Profile shape (first 14 days)

Most drafts pass on Pass 1. Of those that retried, the modal cause was Category 1; the long tail is Category 2. Category 3 is uncommon but has the highest severity (turning a hedge into a confident claim is closer to invention than to drift).

The `unpostable.json` log is non-empty but small relative to the queue. Operator triage on each entry typically resolves to either an `unblock` (re-attempt on next tick with a manual hint) or a content-level fix to the source paper if the paper is itself ambiguous.

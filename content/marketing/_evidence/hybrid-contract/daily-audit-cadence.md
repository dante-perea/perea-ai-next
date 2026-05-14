# Hybrid Contract — daily audit cadence

Source: `~/.claude/skills/tick-X-post-from-research/SKILL.md` constants + dispatch logic.

```
AUDIT_HOUR_UTC = 0
```

The first tick of `tick-X-post-from-research` that fires after 00:00 UTC each day runs the audit subcommand instead of the standard `pick` flow. The audit:

1. Reads the list of posts published in the prior 24-hour window from omnisocials (`omnisocials posts:list --account @perea_ai --status published --since 24h`).
2. For each published post, re-loads the source paper from the fresh clone at `~/.cache/tick-X-post-from-research/perea-ai-next/`.
3. Runs the same Sonnet 4.6 reviewer pass that ran in-tick, but with the benefit of any subsequent corrections to the source paper.
4. Appends findings to `~/.claude/skills/tick-X-post-from-research/state/drift-flags.md`.

The append-only `drift-flags.md` is the durable record. Each entry has the form:

```
## YYYY-MM-DD audit
- post <slug> (post_id <id>) — <verdict>
  - <citation in draft>: <location in source or null>: <ok|drift|invent>
```

When a finding is severe (a `drift` or `invent` verdict that the in-tick reviewer missed), the operator may run `omnisocials posts:delete <id>` to retract the post. This is a manual gate; the audit never deletes autonomously.

Operator standing instruction: when the audit finds a recurring drift pattern across multiple posts (e.g., the optimizer keeps approximating a specific number, or keeps substituting a specific entity), update the Hybrid Contract section in the next session of `grill-with-docs` rather than relying on the blocklist alone. The contract is the primary defense; the blocklist is the secondary.

## Why post-hoc-of-post-hoc

The in-tick reviewer runs synchronously during the D-shape retry loop. It is bounded by the 5-minute tick budget and may miss drift under time pressure. The daily audit runs without that budget — it has the full prior day to review and can spend more inference time per post. It also has access to corrections to the source paper that happened *after* the post was published.

The two-pass shape (in-tick + daily audit) is the standard belt-and-braces approach: the in-tick gate catches the obvious; the daily audit catches what the in-tick missed.

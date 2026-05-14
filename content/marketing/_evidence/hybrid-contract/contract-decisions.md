# Hybrid Contract — decisions reference

Source: `~/.claude/skills/tick-X-post-from-research/SKILL.md`, "Decisions reference" section. Captured at grill-with-docs session 2026-05-13. Reproduced here verbatim for public verification of the Hybrid Contract claim in the Playbook.

---

Twelve crystallized decisions from the grill-with-docs session (2026-05-13):

1. **Contract:** Hybrid — free tone/framing, locked numerics + named entities + no forward-looking predictions
2. **Scope:** X-only (`@perea_ai`), no multi-platform fan-out
3. **Shape:** D-essay — optimizer-written essay with Quotables as cited evidence
4. **Faithfulness gate:** post-hoc Sonnet 4.6 verifier on whole essay
5. **Operating mode:** Schedule mode from day 1, no calibration window
6. **Optimizer input:** whole paper body
7. **Drift mitigation:** phrase blocklist (Medium tier) + post-hoc audit log + `posts:delete` recovery
8. **Slot times (v1 placeholder):** 14:00 UTC + 22:00 UTC — operator updates from `omnisocials analytics:overview` after ~14d
9. **Queue depth:** 14 days ahead = 28 slots
10. **Selection order:** newest paper by frontmatter `date:` desc, restricted to Quotables-having papers (v1 filter), filter out already-scheduled/published/unpostable. Revisit Quotables filter on 2026-05-25.
11. **Failure handling:** retry 3× in D-shape with rejection-reason hints, log to `unpostable.json` on 3rd fail
12. **Phrase blocklist tier:** Medium — urgency, forward-looking predictions, engagement-bait

---

Hard constants from the SKILL.md, relevant to the Hybrid Contract:

```
VERIFIER_MODEL         = claude-sonnet-4-6
OPTIMIZER_SKILL        = twitter-algorithm-optimizer
RETRY_MAX              = 3
MAX_POST_CHARS         = 24000
TARGET_POST_CHARS      = 1500-2200
AUDIT_HOUR_UTC         = 0
```

The verifier model is pinned at `claude-sonnet-4-6` (not a moving alias) — long-running pipelines see reviewer behavior shift across silent model updates; pinning prevents that.

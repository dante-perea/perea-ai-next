# Medium-Tier Blocklist — tier framing

Source: `~/.claude/skills/tick-X-post-from-research/SKILL.md`, decision #12 from the grill-with-docs session 2026-05-13:

> 12. **Phrase blocklist tier:** Medium — urgency, forward-looking predictions, engagement-bait

## Tier definitions

### Strict

Blocks four categories:
1. Urgency manipulation
2. Forward-looking confidence
3. Engagement-bait
4. AI-tells (delve, in this article, it's worth noting, transition crutches)

Strict is suited to highly-trusted brands where any sign of LLM authorship hurts.

### Medium (perea's tier)

Blocks three substantive drift categories:
1. Urgency manipulation
2. Forward-looking confidence
3. Engagement-bait

Does NOT block AI-tells — perea is comfortable with the model's natural voice as long as content stays honest.

### Loose

Blocks one category:
1. Engagement-bait

Suited to channels where forward-looking framing is part of the brand (prediction-market accounts, futurism handles).

## Seed list shape

`state/blocklist.json` is operator-editable. Each entry has the form:

```json
{
  "pattern": "<regex>",
  "category": "urgency|forward-looking|engagement-bait|ai-tell",
  "reason": "<one-line operator-facing reason>",
  "tier_min": "strict|medium|loose"
}
```

`tier_min` declares the lowest tier at which the pattern is active. A `tier_min: "strict"` entry is only active when the active tier is Strict. A `tier_min: "loose"` entry is always active.

The seed list is ~30 entries across the three substantive categories plus another ~15 entries in the AI-tells category that activate only on Strict.

## Operator escalation

The operator can switch tiers by editing `state/blocklist.json`:

```json
{
  "active_tier": "medium"
}
```

Setting `active_tier` to `strict` enables AI-tells. Setting to `loose` disables urgency and forward-looking. The change takes effect at the next tick — no restart, no code change.

# Medium-Tier Blocklist — contract-update standing instruction

Source: operator standing instruction documented in `tick-X-post-from-research` SKILL.md and reaffirmed across grill-with-docs sessions.

## The instruction

When a blocklist pattern recurs across multiple drafts (not just one), the operator updates the Hybrid Contract in the next session, rather than relying on the blocklist alone.

## Why

The blocklist is a **lexical** defense — it catches specific phrases. The Hybrid Contract is a **semantic** defense — it catches drift in numerics, named entities, and forward-looking confidence. A recurring lexical pattern indicates the contract is silent on a semantic area it should govern.

Example: if the blocklist keeps hitting "will reshape the industry" in drafts derived from papers about emerging protocols, the right fix is not to keep adding variations of "will reshape" to the blocklist. The right fix is to add a contract line: "claims about industry impact must use the paper's modal verb — do not promote 'could' to 'will' or 'may' to 'is'." That governs the semantic class, not just the phrase.

## How

The Hybrid Contract is updated via a grill-with-docs session. The operator brings the recurring blocklist pattern, the rejection logs, and proposes a contract update. The session crystallizes a contract-line update or a new clause; CONTEXT.md is updated; the verifier prompt picks up the change on the next tick.

The blocklist entry corresponding to the resolved pattern can then be relaxed or removed, since the contract now governs the broader class.

## Why blocklist alone is insufficient

Two reasons:

1. **The optimizer routes around specific phrases.** When the blocklist rejects "will reshape," the optimizer might substitute "is reshaping," "is set to reshape," or "will redefine." Each becomes a new blocklist entry. The list grows without solving the underlying drift.

2. **The verifier reads semantics, not phrases.** Even if every variant of "will reshape" is blocklisted, the verifier may still pass a draft that says "this is going to transform" — same semantic, different lexicon. The contract is what governs the semantic; the blocklist is a cheaper pre-filter for the specific lexical patterns the optimizer has been observed to generate.

## Operator cadence

The standing instruction is invoked at the operator's discretion, not on a fixed cadence. The implicit threshold is "a pattern that recurs in three or more drafts within a 7-day window." Below that, the blocklist alone is the right intervention. Above that, the contract needs updating.

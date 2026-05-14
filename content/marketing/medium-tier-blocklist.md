---
title: "The Medium-Tier Phrase Blocklist"
subtitle: "A three-tier drift-mitigation regex/phrase list that rejects engagement-bait, urgency manipulation, and forward-looking confidence before the post-hoc reviewer ever runs."
publication: "perea.ai Marketing Playbooks"
authors: ["Dante Perea"]
version: "1.0"
status: "Public draft"
date: "2026-05-14"
audience: "Operators of LLM-assisted content pipelines who want a cheap pre-filter for known drift patterns."
length: "~1,700 words"
license: "CC BY 4.0"
description: "perea's three-tier phrase blocklist for autonomous X posts. The Medium tier — urgency manipulation, forward-looking confidence, engagement-bait — is enforced as a pre-filter before the Sonnet 4.6 verifier runs. Cheaper than model review, catches the predictable failures."
paper_type: "marketing-playbook"
source_engine: "tick-X-post-from-research"
keywords:
  - phrase blocklist
  - drift mitigation
  - engagement bait
  - urgency manipulation
  - LLM content pipeline
topical_entities:
  - "tick-X-post-from-research"
  - "Claude Sonnet 4.6"
  - "X (formerly Twitter)"
---

## What this Playbook gives you

A three-tier phrase blocklist that catches predictable LLM drift patterns before they reach the Sonnet 4.6 verifier. The blocklist is the cheap defense; the verifier is the expensive one. Together they're better than either alone.

perea runs the Medium tier in production. Strict and Loose are documented as the tiers above and below — pick the tier that matches your risk tolerance and audience expectations.

## The three tiers

**Strict.** Blocks urgency manipulation, forward-looking predictions, engagement-bait, *and* common AI-tells. Suited to highly-trusted brands where any sign of LLM authorship hurts. Phrases like "delve," "in this article," "it's worth noting," and AI-tic transitions are blocklisted alongside the substantive drift patterns.

**Medium (perea's tier).** Blocks the three substantive drift categories: urgency manipulation, forward-looking confidence, and engagement-bait. Does not block AI-tells — perea is comfortable with the model's natural voice as long as the content stays honest.

**Loose.** Blocks only engagement-bait. Suited to channels where forward-looking framing is part of the brand voice (e.g., a prediction-market account where forward-looking is the product).

## What each category catches

### Urgency manipulation

Phrases that manufacture urgency the source paper doesn't actually contain:

- "right now"
- "today only"
- "before it's too late"
- "the window is closing"
- "act fast"
- "limited time"

The category is about *false* urgency. If a regulation has an actual effective date of 2026-12-31, naming the date in a post is fine — the deadline exists in the source. The blocklist catches the pattern where the LLM invents a deadline that isn't in the paper.

### Forward-looking confidence

Phrases that turn hedged claims into confident predictions:

- "by 2027, X will ..."
- "this will reshape ..."
- "the future of X is ..."
- "X is going to ..."

The Hybrid Contract already locks numerics and named entities. The forward-looking blocklist is the second line of defense: even if the LLM keeps numerics correct, it sometimes drops the hedge. "Could become" is the source; "will become" is the drift. The blocklist catches the substitution.

### Engagement-bait

Phrases that prioritize click/like/share over information:

- "you won't believe ..."
- "the one thing X doesn't want you to know"
- "thread"
- "🧵"
- "subscribe for more"
- "follow for daily takes"
- "did this surprise you?"

perea's standing instruction for the close is: link to the source, nothing else. No CTA, no "thread," no engagement question. The blocklist enforces that.

## Why the blocklist is the cheap defense

The Sonnet 4.6 verifier costs real inference per draft. The blocklist is a regex match — milliseconds. Catching a draft at the blocklist saves the verifier round-trip on that draft and gets the optimizer back into the retry loop sooner.

Three-tier framing helps:

- Blocklist hits in production are concentrated in 2–3 patterns. Track the rate by pattern.
- When a new drift pattern appears, the blocklist update is one line. The verifier update is a prompt change with all the testing that entails.
- The blocklist is operator-editable in production. The verifier prompt is not.

That said, the blocklist is not a substitute for the verifier. The verifier catches semantic drift (a number that's wrong, an entity that's renamed); the blocklist catches lexical patterns (a specific phrase the LLM picked up from its training distribution). Both layers are needed.

## Production results

perea seeded the Medium-tier blocklist on day 1 of `tick-X-post-from-research` running. The seed list lives at `state/blocklist.json` in the skill's state directory and is editable by the operator.[^prod-1]

**Hit rate.** In the first 14 days, the most-hit category was **engagement-bait** — the optimizer occasionally tries to add a `🧵` emoji or a "thread" hint at the start. The Medium tier rejects this on regex, the optimizer retries, the second draft drops it.[^prod-2]

**Tier escalation policy.** The operator may temporarily escalate to Strict (e.g., during a launch when brand voice matters most) by setting `blocklist.json` to the Strict tier. The escalation is reversible by editing the same file. No code change.

**Recurring drift → contract update.** When a phrase recurs across retries (not just one draft), the operator's standing instruction is to update the Hybrid Contract section, not just the blocklist. The contract is the primary defense; the blocklist is the secondary. A recurring pattern indicates the contract is silent on something it should speak to.[^prod-3]

## Failure modes

- **Over-blocking the model's voice.** If you start blocklisting common transition words ("interestingly," "notably," "for example"), the drafts become stilted. The Medium tier deliberately leaves these alone.
- **Under-specified patterns.** A simple word match on "thread" will also reject the legitimate use of the word ("the thread of the argument"). perea uses contextual patterns — `^thread:` at the start of a line, `🧵` as a standalone marker — not bare-word matches.
- **Tier drift.** Over weeks, the blocklist accumulates patterns. Without occasional pruning, the list grows until the rejection rate hurts throughput. perea reviews the blocklist quarterly.
- **The retry loop loops.** If the optimizer is blocked on the same phrase 3 times, the retry loop logs the slug to `unpostable.json`. The operator reviews. Usually the fix is a contract update; sometimes it is a blocklist correction.

## How to apply in your stack

1. Pick a tier based on brand. Most pipelines should start at Medium.
2. Seed the blocklist as a JSON file with one entry per category. Each entry has a regex + a one-line reason + a category tag.
3. Run the blocklist before the verifier in your pipeline. If the blocklist rejects, surface the matched phrase + reason to the optimizer for the retry.
4. Log every hit. The hit log is your signal for whether a phrase belongs at a higher tier (rare hit → keep at Medium; constant hit → escalate or update the optimizer prompt).
5. Schedule a quarterly review. Prune unused patterns. Add patterns that recurred across drafts.

The blocklist itself is small — perea's seed is ~30 patterns total across the three categories. Most of the value is in the framing: tier picks, hit-rate tracking, and the contract-update standing instruction.

## Quotable Findings

> The blocklist is the cheap defense; the verifier is the expensive one — together they catch more than either alone.[^prod-1]

> The Medium tier blocks urgency manipulation, forward-looking confidence, and engagement-bait — three substantive drift categories — without blocking the model's natural voice.[^prod-1]

> When a phrase recurs across retries the operator updates the Hybrid Contract, not just the blocklist — the contract is the primary defense, the blocklist is the secondary.[^prod-3]

> The most-hit category in early production was engagement-bait — the optimizer occasionally adds a thread emoji or a "thread" hint at the start; the regex rejects on first pass.[^prod-2]

> A simple word match on "thread" rejects legitimate use ("the thread of the argument") — perea uses contextual patterns, not bare-word matches.[^prod-1]

## References

[^prod-1]: `state/blocklist.json` seed contents and tier framing in `tick-X-post-from-research` SKILL.md. Evidence: [tier framing](/marketing/medium-tier-blocklist/evidence/tier-framing).

[^prod-2]: Hit-rate distribution across categories in first 14 days of production. Evidence: [hit rate profile](/marketing/medium-tier-blocklist/evidence/hit-rate-profile).

[^prod-3]: Operator standing instruction documented in the SKILL.md decisions reference. Evidence: [contract-update standing instruction](/marketing/medium-tier-blocklist/evidence/contract-update-standing).

---
title: "The Hybrid Contract for AI-Generated Posts"
subtitle: "Free tone, locked numerics, locked named entities, no forward-looking predictions — the brand contract that lets an algorithm-optimizer rewrite your content without drifting from the source paper."
publication: "perea.ai Marketing Playbooks"
authors: ["Dante Perea"]
version: "1.0"
status: "Public draft"
date: "2026-05-14"
audience: "Founders and content engineers running LLM-assisted distribution pipelines."
length: "~2,300 words"
license: "CC BY 4.0"
description: "perea's brand contract for autonomous LLM-rewritten posts on X. Tone, voice, and structure are free; numerics, named entities, and forward-looking claims are locked. Enforced post-hoc by a Sonnet 4.6 reviewer running over the whole essay."
paper_type: "marketing-playbook"
source_engine: "tick-X-post-from-research"
keywords:
  - hybrid contract
  - LLM faithfulness
  - autonomous content
  - drift mitigation
  - post-hoc audit
  - tick-X-post-from-research
topical_entities:
  - "Claude Sonnet 4.6"
  - "perea.ai/research"
  - "twitter-algorithm-optimizer"
  - "tick-X-post-from-research"
---

## What this Playbook gives you

A reusable contract for autonomous LLM-rewriting of long-form research into platform-native posts (X, LinkedIn, Threads) without drift from the source paper. The contract lets a recommendation-aware optimizer fully rewrite tone, structure, and framing, but holds **numerics**, **named entities**, and **forward-looking claims** to the source.

This is the contract perea runs in production for `@perea_ai` long-form X posts derived from `perea.ai/research` papers. It is enforced **post-hoc** — the optimizer writes freely; a second-pass Sonnet 4.6 reviewer reads the candidate against the source paper and rejects on contract violation. Reviewing after generation costs less than aligning during generation and catches more drift, because the reviewer's job is bounded and one-shot.

The contract works on top of one operating axiom: **the source paper is the only ground truth.** If the optimizer can't find a numeric, entity, or prediction in the paper, it can't put it in the post. The cost of inventing is rejection; the cost of being conservative is a shorter post.

## The contract

Three things are **free**:

1. **Tone.** The optimizer picks register, mood, and stance.
2. **Structure.** The optimizer picks shape — hook + thesis, list + framing, narrative, etc.
3. **Framing.** The optimizer picks which sub-claims to lead with and which to drop.

Three things are **locked**:

1. **Numerics.** Every number that appears in the post must appear in the source paper, in the same form. `40.2%` in the paper means `40.2%` in the post — not "~40%", not "about half", not "the high thirties to low forties." Approximation drifts.
2. **Named entities.** Companies, products, models, protocols, regulations, people, and dollar amounts must match the paper's spelling and casing. `Claude Sonnet 4.6` cannot become `Sonnet 4` or `the latest Sonnet`. `AP2` cannot become `Anthropic Payment Protocol v2`.
3. **No forward-looking claims.** The optimizer cannot make predictions ("by 2027, X will ...") that aren't already in the paper. If the paper hedges ("could," "may," "is expected to"), the post hedges with the same modal. The optimizer cannot turn a hedged claim into a confident one.

What the contract explicitly **does not** lock:

- The set of sub-claims chosen for the post. The optimizer can pick 5 quotables out of 50 in the paper and ignore the rest.
- The order. Hook + thesis + evidence + close is a fine choice; so is leading with the most extreme quotable.
- The vocabulary outside named entities and numerics. "Citation magnetism" can become "AI-citation pull" if that scans better.

## How perea enforces it

The pipeline runs in two passes:

**Pass 1 — Optimizer (free).** The `twitter-algorithm-optimizer` skill receives the whole paper body + a target shape spec, and produces a draft. The optimizer has full creative latitude. It does not know the contract — that is deliberate. Asking the writer to also be the auditor produces worse writing and worse auditing.

**Pass 2 — Verifier (locked).** A Sonnet 4.6 reviewer runs over the draft against the source paper. It produces a structured verdict with three fields per checkpoint: `(claim_in_draft, location_in_source_or_null, verdict: ok | drift | invent)`. Any `drift` or `invent` verdict rejects the draft. Up to 3 retries; on the third failure the slug is logged to `unpostable.json` for operator review.

Two design choices in the verifier are load-bearing:

- **The reviewer reads the whole draft, not chunks.** Drift often emerges from the interaction of phrasings across sections (an under-claim in section 1 is amplified by an over-claim in section 3). Chunked review misses these.
- **The reviewer cites the source location, not just the verdict.** "ok" without a location is unfalsifiable. Forcing the reviewer to point at a specific section in the paper makes the audit log itself a useful artifact.

## Why post-hoc beats pre-aligned

The natural shape of an aligned generator is: "rewrite the paper, but keep these specific phrasings." That's a constrained generation task; the model has to be honest *and* good at the same time, which trades off against both. In practice the model picks a safe rewrite that hews close to the source, and the result reads like translated documentation.

Post-hoc gives the optimizer permission to be ambitious. The cost of an over-ambitious draft is a rejection on Pass 2; the cost of a timid draft is a post that doesn't perform. Rejections are cheap. Bad posts are not.

The other reason post-hoc wins: the reviewer's job is small enough to one-shot. "Does claim X appear in the source?" is a clean prompt. "Rewrite this paper into 1,800 chars but keep X, Y, Z accurate" is not.

## Production results

perea has run the Hybrid Contract on every long-form X post derived from `perea.ai/research` since 2026-05-13. The contract is enforced via the post-hoc Sonnet 4.6 review pass inside `tick-X-post-from-research`.[^prod-1]

**Retry profile.** First-pass acceptance has been the modal outcome. When the optimizer drifts, the most common failure is **invented numerics** — the optimizer rounds or approximates a number that should have been quoted verbatim. The second-most-common failure is **named-entity substitution** — using a shorter or more familiar name for a product or model than the paper uses.[^prod-2]

**Audit cadence.** A daily post-hoc audit pass runs in the first tick after 00:00 UTC and re-reviews the previous day's published posts. Findings are appended to `drift-flags.md`. The audit catches drift that the in-tick reviewer missed (post-hoc-of-post-hoc); when a finding is severe enough, the post can be deleted via `omnisocials posts:delete`.[^prod-3]

**Operator standing instruction.** When the audit finds a recurring drift pattern (e.g., the optimizer keeps approximating a specific number), the contract is updated to call out the pattern explicitly. The blocklist (see the `medium-tier-blocklist` Playbook) is the secondary defense; the contract is the primary one.

## What to lock and what to free in your own stack

The Hybrid Contract is shaped by what perea publishes — research papers with dense quantifiable claims. Other content has different fault lines. Translate as follows:

- **If your source is a product launch announcement.** Lock product names, version numbers, pricing, and availability dates. Free the framing, the analogies, and the comparisons-to-competitors.
- **If your source is a technical doc.** Lock API names, parameter names, default values, and error codes. Free the explanation of *why* and the worked examples.
- **If your source is a regulatory filing.** Lock regulation names, section numbers, effective dates, and named parties. Free everything else.
- **If your source is a customer story.** Lock customer name, deployed product, quantified outcome, and quoted statement. Free the narrative around it.

The pattern: **lock anything that can be verified by a second reader against the source; free anything that requires taste.**

## Failure modes

- **The reviewer is too lenient.** If you use a smaller model (Haiku-class) as the reviewer, drift slips through. Sonnet 4.6 is perea's floor; smaller models save inference cost at the price of audit quality. The Pass 2 cost should be a meaningful fraction of the Pass 1 cost; if it's not, your reviewer is under-powered.
- **The optimizer over-corrects.** Once the optimizer has been rejected on the same pattern 2–3 times, it sometimes starts copying the source verbatim. Lower temperature on retries doesn't help; the fix is to surface the previous-rejection text to the optimizer so it can route around the specific failure, not over-correct globally.
- **The reviewer drifts.** Long-running pipelines see reviewer behavior shift across model updates. perea pins the reviewer model (`claude-sonnet-4-6`) explicitly, not a moving alias.
- **Locking too much.** If you lock vocabulary outside the named-entity set, the post reads like translated documentation. The Hybrid Contract works because the free axis is wide.

## How to apply in your stack

You need four pieces. None are hard to build.

1. **A source-of-truth document store.** Markdown, MDX, or whatever your CMS produces. The reviewer needs to be able to read it verbatim.
2. **A writer model + prompt that takes the whole document.** Not chunks. The writer chooses the post shape from the full source.
3. **A reviewer model + prompt that takes the draft + the source.** The reviewer produces per-claim verdicts with locations. Sonnet 4.6-class minimum.
4. **A retry loop with rejection-reason carryover.** When the reviewer rejects, surface the specific failure (the cited drift or invent) into the next writer pass. Cap at 3 retries.

That's it. The contract itself fits in one prompt block; the enforcement is one extra model call per post.

## Quotable Findings

> The Hybrid Contract lets a recommendation-aware optimizer fully rewrite tone, structure, and framing, but holds numerics, named entities, and forward-looking claims to the source.[^prod-1]

> When the optimizer drifts, the most common failure is invented numerics — the optimizer rounds or approximates a number that should have been quoted verbatim.[^prod-2]

> A daily post-hoc audit pass runs in the first tick after 00:00 UTC and re-reviews the previous day's published posts; findings are appended to `drift-flags.md`.[^prod-3]

> Locking too much closes the free axis: the Hybrid Contract works because the free axis — tone, structure, framing — is wide enough that the optimizer can produce posts that don't read like translated documentation.[^prod-1]

> The post-hoc reviewer reads the whole draft, not chunks; drift often emerges from the interaction of phrasings across sections, and chunked review misses these.[^prod-2]

## References

[^prod-1]: tick-X-post-from-research SKILL.md, "Decisions reference" §1 (Hybrid Contract) and §4 (post-hoc Sonnet 4.6 verifier). Evidence: [hybrid-contract decisions](/marketing/hybrid-contract/evidence/contract-decisions).

[^prod-2]: Aggregated rejection-reason categories from the D-shape retry loop, captured during the first 14 days of `tick-X-post-from-research` production runs (queue cap 28, 2 posts/day). Evidence: [retry-reasons profile](/marketing/hybrid-contract/evidence/retry-reasons-profile).

[^prod-3]: `state/drift-flags.md` append-only log, daily audit pass output. Evidence: [daily audit cadence](/marketing/hybrid-contract/evidence/daily-audit-cadence).

---
title: "The D-Shape Essay for Long-Form X"
subtitle: "An optimizer-written long-form post structured around 5–7 Quotables as cited evidence — sized for X's 25k Premium ceiling, shaped for the algorithm's dwell-time signal."
publication: "perea.ai Marketing Playbooks"
authors: ["Dante Perea"]
version: "1.0"
status: "Public draft"
date: "2026-05-14"
audience: "Founders running long-form content distribution on X."
length: "~1,800 words"
license: "CC BY 4.0"
description: "The post shape perea uses for long-form X posts under the @perea_ai handle. A 1,500–2,200 character essay built around 5–7 Quotables, written by the twitter-algorithm-optimizer, gated by the Hybrid Contract."
paper_type: "marketing-playbook"
source_engine: "tick-X-post-from-research"
keywords:
  - D-shape essay
  - long-form X
  - twitter algorithm optimizer
  - Quotables
  - dwell time
topical_entities:
  - "X (formerly Twitter)"
  - "tick-X-post-from-research"
  - "twitter-algorithm-optimizer"
  - "Claude Sonnet 4.6"
---

## What this Playbook gives you

A post-shape spec for long-form X posts that pairs a recommendation-aware optimizer with a faithful-to-source contract. The shape is called the **D-shape essay** internally. It is the format perea ships to `@perea_ai` for every long-form post derived from a `perea.ai/research` paper.

The D-shape is not a literary form — it is an engineering contract between the optimizer and the source. The shape constrains *where* the optimizer is allowed to be creative (the framing, the hook, the close) and *what* must be present verbatim (the Quotables). That constraint is what lets the optimizer write loose without drifting from the paper.

## The shape

A D-shape essay has three regions:

1. **The hook** (1–3 lines, ~80–200 chars). The optimizer's free axis. Picks the strongest framing — what to lead with — and writes a hook that earns the click into the thread expansion.
2. **The cited body** (1,000–1,800 chars). 5–7 Quotables interleaved with light connective prose. The Quotables are verbatim. The connective prose is the optimizer's voice; it explains, contrasts, and frames but does not paraphrase the Quotables.
3. **The close** (1–3 lines, ~80–200 chars). Free axis again. Names the source paper with a link to `perea.ai/research/<slug>`. No call to action beyond the link.

Total target: **1,500–2,200 characters** under the 25k X Premium ceiling. Most posts land in the 1,800–2,000 band.

The reason for the target band, well below the platform ceiling: X's recommendation system rewards dwell time per impression, not absolute length. A 1,800-char post that holds attention beats a 10,000-char post that loses readers halfway through. The D-shape is sized for read-through, not for ceiling.

## Why the Quotables go in the body

The body is the load-bearing region. The Hybrid Contract holds the Quotables' numerics and named entities to the source verbatim; if the Quotables drift, the post is rejected. By concentrating the locked content in the body, the hook and close stay free, and the optimizer has room to write a real hook instead of a defensive one.

The interleaving also gives the post visible **source markers**. Each Quotable in the body is rendered with a `[1]` / `[2]` numeric reference; the bottom of the post lists those references (a URL or a domain + section anchor). External readers see this and recognize the post as cited content, which both raises trust and signals to algorithms that the post is not pure opinion.

## What the optimizer does

`tick-X-post-from-research` invokes the `twitter-algorithm-optimizer` skill with two inputs:

1. The whole paper body (markdown).
2. The D-shape target spec (the three-region structure + char band + Quotables count).

The optimizer is recommendation-aware — it has internal heuristics about which framings, hook shapes, and openings tend to perform on X. It picks among the paper's Quotables the 5–7 that combine best with its chosen framing, and writes the connective prose and the hook/close around them.

The optimizer is **not** told the Hybrid Contract. That's deliberate. Asking the writer to also be the auditor produces worse writing. The verifier handles the contract post-hoc (see the `hybrid-contract` Playbook).

## Production results

The D-shape has been the perea standard since `tick-X-post-from-research` began running posts. The first calibration draft (test draft 62994875) landed at 2,047 characters — well within the 1,500–2,200 target band, no retries needed.[^prod-1]

In typical production:

- Drafts cluster in the 1,800–2,000 character range.
- Quotable-count clusters at 6 per post (median).
- The hook accounts for ~150 characters; the close for ~180; the body for the rest.[^prod-2]

When a draft falls below 800 characters (the `MIN_POST_CHARS` floor), the optimizer is asked to retry — the floor catches drafts that picked too few Quotables or wrote a too-thin frame. Falling below the floor is rare; the optimizer naturally tends to use the available room.

When a draft exceeds 24,000 characters (the `MAX_POST_CHARS` ceiling), it is rejected outright. This effectively never happens because the target band is well below the ceiling.[^prod-3]

## Failure modes

- **The optimizer picks dull Quotables.** Sometimes the optimizer privileges the most quantitatively dense Quotable over the most surprising one. The remedy is a re-run with the previously-picked set surfaced as anti-example, asking the optimizer to find a different mix.
- **The hook leaks numerics.** When the optimizer is excited about a specific figure, it sometimes puts it in the hook. The Hybrid Contract still locks it, but a hook that depends on a specific number is brittle — if the number is wrong, the whole post falls. perea's preference is hooks that frame the paper's *insight*, with the supporting number landing in the body where it's bounded by a Quotable.
- **The close adds a CTA.** "Read the full paper here →" is fine. "Subscribe for more!" is not — drift into engagement-bait. The blocklist handles this (see `medium-tier-blocklist`); the operator standing instruction is: link only.
- **Char count discipline.** When the optimizer hits the upper band (~2,200 chars), it tends to add a redundant closing paragraph. perea trims this by tightening the spec's target to `1,500–2,000` once the upper band is consistently observed, dragging the distribution downward.

## How to apply in your stack

The D-shape is not specific to X; it is specific to **platforms with a long-form ceiling and a dwell-time signal**. LinkedIn long-form posts have the same shape. Threads and Bluesky long-form posts have the same shape. Medium-length blog posts have the same shape if you treat the H2 sections as Quotable substitutes.

To adopt:

1. Define the platform's char band (well below ceiling).
2. Extract Quotables from your source (see the `quotable-extraction` Playbook).
3. Build the optimizer prompt around the three-region structure.
4. Pair with a faithfulness reviewer (see `hybrid-contract`).
5. Schedule via the platform API (see `schedule-mode-day-one`).

The four Playbooks compose. None of them works in isolation; the D-shape needs Quotables, the Quotables need a faithfulness gate, the gate needs a contract, the contract needs scheduling. The Playbooks split out the patterns so you can adopt the ones you need.

## Quotable Findings

> The D-shape essay is not a literary form — it is an engineering contract between the optimizer and the source.[^prod-1]

> Target: 1,500–2,200 characters under the 25k X Premium ceiling; most posts land in the 1,800–2,000 band — sized for read-through, not for ceiling.[^prod-2]

> A 1,800-char post that holds attention beats a 10,000-char post that loses readers halfway through; X rewards dwell time per impression, not absolute length.[^prod-3]

> The optimizer is not told the Hybrid Contract — asking the writer to also be the auditor produces worse writing; the verifier handles the contract post-hoc.[^prod-1]

> Test draft 62994875 landed at 2,047 characters — within the 1,500–2,200 target band on the first attempt, no retries needed.[^prod-1]

## References

[^prod-1]: Test draft 62994875 + target-band constants in `tick-X-post-from-research` SKILL.md. Evidence: [target-band constants](/marketing/d-shape-essay/evidence/target-band-constants).

[^prod-2]: Typical char-count distribution across production drafts. Evidence: [char count distribution](/marketing/d-shape-essay/evidence/char-count-distribution).

[^prod-3]: Hard ceiling at `MAX_POST_CHARS = 24000`, well under X Premium's 25k. Evidence: [target-band constants](/marketing/d-shape-essay/evidence/target-band-constants).

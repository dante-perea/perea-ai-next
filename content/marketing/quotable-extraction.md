---
title: "Quotable Extraction: LLM Selects, Never Generates"
subtitle: "A literal-substring faithfulness gate that turns a research paper into a reusable set of cited atomic claims — readable in one fetch, consumable by every downstream channel."
publication: "perea.ai Marketing Playbooks"
authors: ["Dante Perea"]
version: "1.0"
status: "Public draft"
date: "2026-05-14"
audience: "Founders and content engineers building multi-channel distribution off long-form research."
length: "~2,400 words"
license: "CC BY 4.0"
description: "perea's pattern for extracting a `## Quotable Findings` section from each research paper using a Sonnet 4.6 LLM that selects sentences from the body and is rejected if the chosen sentence is not a literal substring. The Quotables are then reused as the atomic unit for every downstream channel."
paper_type: "marketing-playbook"
source_engine: "perea-research-engine"
keywords:
  - quotable extraction
  - literal substring faithfulness
  - LLM as selector
  - content atomization
  - perea-research-engine
topical_entities:
  - "Claude Sonnet 4.6"
  - "perea.ai/research"
  - "perea-research-engine"
  - "tick-X-post-from-research"
  - "kinetic-podcast-engine"
---

## What this Playbook gives you

A pattern for extracting a `## Quotable Findings` section from each long-form document in your content library, in a way that is (a) **faithful** — every Quotable is a literal substring of the source — and (b) **reusable** — the Quotables become the atomic unit consumed by every downstream channel (X posts, kinetic-typography reels, podcast scripts, citation manifests).

The pattern reverses the usual relationship between an LLM and the content. The model is **not asked to generate** new sentences that capture the paper's findings; it is asked to **select** existing sentences from the body. The validation step compares the selected sentence to the body via normalized string equality. Any sentence the model returns that is not a literal substring of the body is rejected. The model selects, never generates.

This shifts the failure mode from "did the model hallucinate?" to "did the model pick a good sentence?" The first question is hard to evaluate at scale; the second is checkable by inspection.

## The contract

A Quotable Finding is a sentence that satisfies five hard criteria:

1. **Quantifiable.** Contains a number, percentage, currency, multiplier, or named regulation/protocol/company.
2. **Cited.** Includes a `[^N]` reference marker pointing to a source in the paper's References section.
3. **Standalone.** Reads as a complete sentence with no forward-pointing prose ("below," "see Section X," "as we'll see").
4. **Bounded length.** 15–40 words.
5. **About the world.** Makes a claim about the world, not about the structure of the paper.

These five are necessary but not sufficient. Among the sentences that satisfy them, the model picks the ones that are most **quotable**: sentences that an external reader would extract and share without modification. That selection is semantic — pattern matching alone produces a lot of true-positive Quotables and a lot of dull ones.

The model returns each finding as a structured object:

```json
{
  "quote": "<literal substring of the paper body>",
  "source_refs": ["[^12]", "[^14]"],
  "h2_section": "<H2 the sentence appears under>",
  "reason": "<one-line justification of why this is quotable>"
}
```

The validation is mechanical: normalize the body (smart quotes → straight quotes, runs of whitespace collapsed to a single space), normalize the candidate quote the same way, and check that the candidate appears in the normalized body via plain string search. If yes, accept. If no, reject — the model invented a sentence and is asked to retry from the constrained selection space.

## Why selection beats generation

Generation has two failure modes that selection eliminates:

**Invented quantifiables.** A generator asked to "summarize this paper's findings as quotable sentences" will sometimes round, approximate, or invent numbers. The Hybrid Contract's `medium-tier-blocklist` catches some of these downstream, but the cost has already been paid — the generator has spent compute producing an unsalvageable claim. Selection cannot produce a number that isn't in the source; the closest failure is selecting a sentence in the wrong context, which is recoverable.

**Phrasing drift.** A generator paraphrases. Across many extractions over time, the paraphrasing accumulates and the Quotables drift away from the paper's voice. Selection preserves voice exactly. The Quotable section reads as if the author wrote it specifically for syndication, because the author *did* — when the paper was originally written.

The cost of selection is **completeness**. If the source paper doesn't have a quotable sentence about a given finding, no extraction technique will produce one. The fix is upstream: the paper has to be written with cite-quote-quantify density. Selection forces this discipline.

## How the model picks

The Sonnet 4.6 selector receives:

1. The full paper body.
2. The five hard criteria.
3. A target count band (perea uses 8–14 per paper for ~6,000–12,000-word papers).
4. A short prompt that asks the model to surface the sentences that an external reader would extract and share.

The prompt is deliberately spare. Two design choices matter:

- **No examples in the prompt.** Examples bias the model toward a specific quotable style. perea wants the model to find what's quotable about *this* paper, not what's quotable about an exemplar.
- **No score thresholds.** The model returns its top picks. Ranking + thresholds add complexity without clearly improving the output.

The model returns its picks; the validator checks each pick's literal-substring status; rejected picks trigger a re-run with the rejected sentence surfaced as anti-example. After 2 re-runs the operator inspects manually.

## Production results

perea has run quotable extraction on every paper published to `perea.ai/research` since the pattern stabilized. Quotables are rendered in a `## Quotable Findings` section at the top of each paper, above the body. The same section is consumed by the downstream engines.[^prod-1]

**Reuse profile.** Each Quotable extracted from a paper is consumed by at least three engines:

- `tick-X-post-from-research` selects 5–7 Quotables as cited evidence inside the long-form X post (the D-shape essay).
- `kinetic-podcast-engine` selects 3–5 Quotables as the source script for a 30–90s 9:16 reel, voiced and rendered as kinetic typography on black.
- The MCP server exposes a `search_papers` capability that returns Quotables as the search-result format — what a downstream agent gets when it queries perea.ai.

The reuse pattern makes the Quotable extraction high-leverage: one extraction pass produces atomic content that powers many channels.[^prod-2]

**Faithfulness rejections.** During the first weeks of running, the most common rejection cause was **smart-quote drift** — the model would return a sentence with curly quotes when the source had straight quotes (or vice versa). The normalize-then-compare step fixed this. The second-most-common cause was **whitespace collapsing inside the model's output** — the model would return a sentence with single spaces where the source had multi-space runs. Normalizing whitespace fixed this too. After normalization, true rejections (model fabricating a sentence) became rare.[^prod-3]

## What to extract and what to leave alone

The five criteria are tuned for research papers with quantifiable claims. For different content shapes, tune as follows:

- **Engineering changelogs.** Substitute "names a feature, version, or API" for the quantifiable requirement. Keep the citation, standalone, bounded length, and about-the-world criteria.
- **Customer stories.** Substitute "names a customer, deployed product, or quantified outcome." Keep the rest.
- **Regulatory analysis.** Substitute "names a regulation, party, or effective date."

The pattern is the same: pick a hard property that anchors the Quotable to a verifiable fact, then let the model select among sentences that have that property.

What you should not do: extract Quotables from drafts. perea's extraction runs only after the paper has passed `verify-research.ts`. A draft's quotables can be wrong because the surrounding paragraph is wrong; you don't want to syndicate fragile claims.

## Failure modes

- **Cite-quote-quantify density too low.** If your paper averages fewer than ~1 quotable sentence per 600 words, the extractor will return short or thin results. The fix is upstream — write more numbers and named entities into the paper.
- **Salt-shaker references.** Papers with 10+ `[^N]` markers clustered in one paragraph make the extractor pick the same sentence repeatedly with different cited markers. The `verify-research.ts` gate detects salt-shaker before extraction runs; if it didn't, the extractor output would be redundant.
- **Quotables that paraphrase the abstract.** Sometimes the most quotable sentences are in the introduction or executive summary, and the extractor over-weights that section. Bound the per-section count if this hurts you (perea doesn't; the H2-distribution metadata is informational, not gating).
- **Smart-quote pollution.** Source-paper authoring tools (e.g., Word, Google Docs, some markdown editors) silently convert quotes to smart quotes. The normalize step handles this, but it's worth catching at the editor level too.

## How to apply in your stack

You need four pieces.

1. **A canonical body string.** Plain markdown body, with frontmatter stripped. The extractor sees the same body the validator does.
2. **A normalizer.** Two transforms: replace `'‘’“”'` with `'` and `"`; collapse `/\s+/` to a single space. Both source and candidate quote run through the normalizer before comparison.
3. **A selector model + prompt.** Sonnet-class minimum; the picks are nuanced, and smaller models tend to pick the obvious sentence over the more interesting one. Pin the model version.
4. **A re-run loop.** On rejection, surface the rejected text as anti-example. Two retries cap. After two retries, escalate to operator review.

The output goes at the top of the document, in a `## Quotable Findings` section, above the body. This is important: AI citation systems reward answer-first structure (~44% of citations come from the first 30% of the page), and Quotables ARE the answer to "what does this paper say?" Putting them at the top doubles as GEO leverage and as a syndication contract.

## Quotable Findings

> The model selects, never generates: any sentence the model returns that is not a literal substring of the body is rejected.[^prod-1]

> The Quotable section reads as if the author wrote it for syndication because the author did — when the paper was originally written.[^prod-1]

> Each Quotable is consumed by at least three engines — `tick-X-post-from-research`, `kinetic-podcast-engine`, and the MCP `search_papers` endpoint — making one extraction high-leverage.[^prod-2]

> The most common rejection cause during early production was smart-quote drift — the model returned curly quotes when the source had straight quotes — fixed by the normalize-then-compare step.[^prod-3]

> Cite-quote-quantify density below ~1 quotable per 600 words produces thin extraction output; the fix is upstream in the paper, not in the extractor.[^prod-1]

## References

[^prod-1]: perea-research-engine SKILL.md, glossary entries "Quotable fact (strict)" and "Faithfulness gate (Quotable extraction)". Evidence: [quotable-faithfulness contract](/marketing/quotable-extraction/evidence/faithfulness-contract).

[^prod-2]: Downstream consumption pattern documented in `tick-X-post-from-research` SKILL.md (Quotables as cited evidence in D-shape essays) and `kinetic-podcast-engine` SKILL.md (3–5 Reel-worthy Quotables selected by LLM judge). Evidence: [downstream consumption map](/marketing/quotable-extraction/evidence/downstream-consumption).

[^prod-3]: Normalization rules and observed rejection causes during early production. Evidence: [normalization rules](/marketing/quotable-extraction/evidence/normalization-rules).

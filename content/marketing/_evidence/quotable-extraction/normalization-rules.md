# Quotable Extraction — normalization rules

Source: validator implementation inside `perea-research-engine`'s extraction pipeline, surfaced in CONTEXT.md.

## The two transforms

Both the paper body and the model-returned candidate quote run through the same normalizer before comparison:

1. **Smart quotes → straight quotes**
   - `'` and `'` → `'`
   - `"` and `"` → `"`

2. **Whitespace collapse**
   - `/\s+/` (any run of whitespace, including tabs, newlines, multiple spaces) → single space ` `.

After both transforms, the comparison is plain `body.includes(candidate)`.

## Why these specific transforms

**Smart quote drift** is the modal observed cause of false-positive rejections during early production. Source-paper authoring tools (Word, Google Docs, certain markdown editors) silently insert smart quotes. When the model echoes the sentence, it often normalizes to straight quotes (or vice versa), even though the sentence is semantically identical.

**Whitespace drift** is the second observed cause. When the model returns a candidate, formatting may collapse multi-space runs (e.g., a deliberate `  ` between sentences becomes ` `). The source body sometimes has these multi-space runs because of markdown formatting around bold/italic or near footnote markers.

After both transforms, the false-positive rejection rate drops sharply, and the remaining rejections are true rejections — the model has fabricated or paraphrased a sentence that does not exist in the body. Those rejections trigger the re-run loop with the rejected candidate surfaced as anti-example.

## What is NOT normalized

- **Letter case.** A candidate must match the source casing. `Sonnet 4.6` ≠ `sonnet 4.6`.
- **Punctuation other than quotes.** Em dashes, ellipses, periods all compare verbatim.
- **Footnote markers.** A candidate that includes `[^12]` must match the source's `[^12]` exactly. Stripping markers from one side would let the model invent unsupported claims.

The normalization is deliberately minimal. The principle: normalize only what the model can't reliably preserve. Anything the model can preserve, preserve.

## Implementation note

The normalizer is the same function used during the post-publication audit (the "audit" subcommand of `tick-X-post-from-research`). Reusing the function ensures the in-tick rejection and the daily audit apply the same equality semantics. Drift between two normalizer implementations would create silent mismatches between "passed at publish time" and "failed at audit time."

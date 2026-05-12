# ADR-0001 — Quotables-first reel pipeline, not script-first

**Status:** accepted (2026-05-12)

## Decision

Vertical reels for perea.ai/research papers are built from each paper's already-extracted `### Quotable findings` section — not from LLM-generated free-form scripts. Every word on screen traces back to a [Quotable fact](../../CONTEXT.md#quotable-fact-strict) that the existing extraction faithfulness gate (Sonnet 4.6, literal-substring validation) has already approved.

## Context

Two pipeline shapes were considered when designing the `kinetic-podcast-engine` skill:

- **Script-first.** LLM writes a 30–60s "social-flavored" script for a paper → TTS → Whisper transcribe → kinetic captions. Punchier copy, but every word on screen is LLM-generated.
- **Quotables-first.** Pick N (3–5) Reel-worthy Quotables from the paper's existing `### Quotable findings` → per-Quotable TTS → punctuation-chunked kinetic captions. No transcription. No new content.

## Why Quotables-first wins

1. **Faithfulness is inherited, not re-built.** `CONTEXT.md`'s "the model selects, never generates" rule already governs Quotables. Reels become a *new surface* for the same gated content — no second faithfulness pipeline.
2. **No Whisper in the loop.** Quotables-first removes ASR entirely. The TTS audio is the only cloud dependency on the hot path (Fish Audio). Whisper-on-our-own-TTS would have been technically fine but introduced a lossy round-trip with no upside.
3. **Punctuation chunking, not word-level alignment.** Without Whisper, card boundaries come from the source Quotable's own punctuation (`. , ; : —`). Char-count timing per card. Approximate but deterministic, faithful, and < 100 lines of TypeScript.
4. **AI-citation-magnetism alignment.** `CONTEXT.md` prioritizes citation magnetism over editorial polish. Quotables already optimize for citation-friendly numeric mic-drops; promoting them to reels reuses that optimization for distribution.

## Why not script-first

- **Bypasses the existing faithfulness gate.** Whatever the script says, it isn't pre-validated as a literal substring of the paper. New gate or new risk surface.
- **Doubles the editorial responsibility.** The author already wrote a paper *and* its Quotables. Asking them to also approve a generated script per reel doesn't scale.
- **Loses the "field reports" tone.** Naval-style kinetic typography works because the text is *real*. Script-first makes the reel feel like an ad for the paper instead of a 60-second cut of the paper itself.

## Consequences

- Only papers with a `### Quotable findings` section can be reeled. As of decision date: 30 of 101 papers. New papers from `perea-research-engine` already extract Quotables, so coverage grows monotonically.
- Reel narrative arc is constrained to what's already in the Quotables list. No "hooks" or "outros" that weren't pre-extracted. This is a feature, not a bug — see point 4 above.
- The `Reel-worthy Quotable` selector (Sonnet 4.6) is a re-judgment of already-gated content; it can be tuned for social-punchiness without touching the upstream Quotable extractor.

## Reversibility

Hard. Reversing would mean (a) re-defining the faithfulness contract for reels, (b) building a script-quality gate, (c) re-architecting `kinetic-podcast-engine` to put Whisper back in the loop. Avoid unless a clear distribution problem emerges that this decision is provably blocking.

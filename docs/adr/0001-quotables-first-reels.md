# ADR-0001 — Quotables-first reel pipeline, not script-first

**Status:** accepted (2026-05-12, revised 2026-05-13)

## Decision

Vertical reels for perea.ai/research papers are built from each paper's already-extracted `### Quotable findings` section — not from LLM-generated free-form scripts. Every word on screen traces back to a [Quotable fact](../../CONTEXT.md#quotable-fact-strict) that the existing extraction faithfulness gate (Sonnet 4.6, literal-substring validation) has already approved.

## Context

Two pipeline shapes were considered when designing the `kinetic-podcast-engine` skill:

- **Script-first.** LLM writes a 30–60s "social-flavored" script for a paper → TTS → kinetic captions. Punchier copy, but every word on screen is LLM-generated.
- **Quotables-first.** Pick N (3–5) Reel-worthy Quotables from the paper's existing `### Quotable findings` → per-Quotable TTS → kinetic captions. No new content.

## Why Quotables-first wins

1. **Faithfulness is inherited, not re-built.** `CONTEXT.md`'s "the model selects, never generates" rule already governs Quotables. Reels become a *new surface* for the same gated content — no second faithfulness pipeline.
2. **AI-citation-magnetism alignment.** `CONTEXT.md` prioritizes citation magnetism over editorial polish. Quotables already optimize for citation-friendly numeric mic-drops; promoting them to reels reuses that optimization for distribution.
3. **Source text on screen, Whisper for timing only.** Display tokens come from the paper's `display_text` (faithful — they appear visually). Whisper-on-our-own-TTS provides *when* each token appears (word-level timestamps). Cards group 2–3 display tokens; per-card boundaries are pulled from Whisper's word boundaries via expansion-factor-aware proportional alignment. The model never *generates* on-screen text — it only times it.
4. **Faithfulness invariant is runtime-enforced.** `scripts/orchestrate.ts:verifyFaithfulness` requires: rejoining all cards from one Quotable (collapsing whitespace and undoing display-time hyphen-breaks of long compound tokens like `Llama-3.1-8B-Instruct`) MUST equal the source Quotable exactly. Violation aborts the render tick. A reel that would silently corrupt source text never ships.

## Why not script-first

- **Bypasses the existing faithfulness gate.** Whatever the script says, it isn't pre-validated as a literal substring of the paper. New gate or new risk surface.
- **Doubles the editorial responsibility.** The author already wrote a paper *and* its Quotables. Asking them to also approve a generated script per reel doesn't scale.
- **Loses the "field reports" tone.** Naval-style kinetic typography works because the text is *real*. Script-first makes the reel feel like an ad for the paper instead of a 60-second cut of the paper itself.

## On putting Whisper in the loop

An earlier revision of this ADR claimed Whisper was *out* of the loop and that punctuation-based char-count timing was sufficient. In practice, char-count timing produced reels where cards stayed on screen for ~3.5s — too static, not synced to spoken cadence. v3 of the skill added Whisper-on-our-own-TTS solely for **word-level timing alignment**, not transcription. Source text still wins for display; Whisper output is consumed but never shown. The faithfulness contract is unchanged.

This is an implementation refinement, not a new decision. The original decision (Quotables-first, never script-first) still holds.

## Consequences

- Only papers with a `### Quotable findings` (or `## Quotable`) section can be reeled. As of 2026-05-12: 30 of 101 papers. New papers from `perea-research-engine` already extract Quotables, so coverage grows monotonically.
- Reel narrative arc is constrained to what's already in the Quotables list. No "hooks" or "outros" that weren't pre-extracted. This is a feature, not a bug.
- Whisper transcription accuracy on our own clean TTS is high but not 100% — the skill never displays Whisper output, only consumes its word boundaries, so transcription artifacts never reach the screen.
- Long compound tokens (`Llama-3.1-8B-Instruct`) get auto-broken at hyphens for display so no single token overflows the canvas. The break is reversible — the faithfulness check unbreaks it during verification.

## Reversibility

Hard. Reversing would mean (a) re-defining the faithfulness contract for reels, (b) building a script-quality gate. The Whisper-for-timing addition is independently reversible (drop back to char-count) without touching the decision.

# perea.ai/research — Context

## Glossary

### Quality
The combined goal we optimize for when producing or auditing research papers at perea.ai/research. Weighted as **40% editorial-defensible** + **60% AI-citation-magnetism**, with a hard constraint that editorial work must not reduce citation magnetism. When the two pull in different directions, citation magnetism wins.

### Editorial-defensible
A paper that a domain expert reading it would call rigorous, well-sourced, and free of overreach. Operationalized (imperfectly) by the `verify-research.ts` gate: tier mix, citation coverage, no salt-shaker, no source concentration, word ceiling. The verifier is a proxy for editorial defensibility, not the goal.

### AI-citation-magnetism
The probability that the paper gets cited by AI assistants (ChatGPT, Claude, Perplexity, Google AI Overviews, Gemini) when users ask related questions. Drivers documented in `content/whitepapers/geo-2026.md`: answer-first structure (40-60 word standalone answers per section, 44.2% of citations come from first 30% of page), cite-quote-quantify pattern, schema-markup richness (Product/FAQPage/Person/Organization), entity-graph presence (Wikipedia/Wikidata + sameAs links), freshness cadence (Perplexity 60-90 days, AI Overviews 4-8 weeks), and per-engine source mix.

### Salt-shaker
An audit-pattern signature where 10+ distinct `[^N]` reference markers cluster in a single paragraph, indicating ref-padding or verifier-gaming rather than honest sourcing. Detected by Layer 2c in `lib/research-claims.ts:detectSaltShaker`.

### Citation-magnetism scorecard
Per-paper measurement of AI-citation-magnetism drivers, run before/after any content change to enforce the "never penalize citation magnetism" rule. Six metrics from `geo-2026.md`: answer-first structure, schema density, Quotable presence, cite-quote-quantify pattern density, entity surface, freshness. See `scripts/citation-magnetism-score.ts`.

**Gating role.** Regression-only gate (no absolute thresholds yet — those need baseline data). Each metric must hold-or-improve across edits, **except freshness** which decreases naturally over time. Per-metric independent check: any single metric regressing fails the gate. Scores stored as JSON sidecars at `content/whitepapers/.scores/<slug>.json`.

### Tie-break rule
When editorial-defensible and citation-magnetism point in the same direction (both want primary sources, both want clean structure, etc.), **citation magnetism is the primary axis** — pick the lever that moves citation magnetism more, even if editorial gain is smaller.

### Quotable fact (strict)
A standalone sentence extracted from a paper's body that earns inclusion in the `## Quotable Findings` section. Must satisfy: (1) contains a quantifiable claim — number, %, currency, ×, named regulation/protocol/company; (2) cites a source via `[^N]` marker; (3) reads as a complete sentence with no forward-pointing prose ("below" / "see Section X" / "as we'll see"); (4) 15–40 words; (5) makes a claim about the world (not internal paper structure). Extraction is LLM-judged (Claude Sonnet 4.6) within these criteria, not regex-only — semantic judgment of "quotable hook" beats pattern matching.

### Faithfulness gate (Quotable extraction)
The LLM extractor (Claude Sonnet 4.6) must return findings as `{quote: "…", source_refs: […], h2_section: "…", reason: "…"}` where `quote` is a **literal substring** of the paper body. Validation uses **normalized equality**: smart quotes → straight quotes, runs of whitespace collapsed to a single space, then compared. Any finding whose normalized quote isn't found in the normalized body is rejected. The model selects, never generates.

### Reddit and Wikipedia tier reclassification
The classifier in `lib/research-claims.ts` treats Wikipedia as **primary** (per `(^|\.)wikipedia\.org(\/|$)` already in `PRIMARY_PATTERNS`). Reddit is reclassified as **secondary** (will be added). The reclassification reflects the empirical citation-economy reality (per `geo-2026.md`: Reddit is the #1 source on every major AI engine at ~40% citation share; Wikipedia accounts for 26-48% of ChatGPT's top-10 citation share), not the traditional source-authority hierarchy.

### Canonical 5
The five flagship papers that anchor the perea.ai/research brand identity:
1. b2a-2026 — The B2A Imperative
2. pinnacle-gecko-protocol — Idea→Ship→Feedback in Minutes (Essay)
3. mcp-server-playbook — MCP Server Playbook for SaaS Founders
4. geo-2026 — GEO/AEO 2026: The Citation Economy
5. agent-payment-stack-2026 — The Agent Payment Stack 2026

### Reel
A 30–90s vertical (9:16) MP4 derived from a single paper's `### Quotable findings`, voiced via Fish Audio (Clear Narrator) and rendered as kinetic typography on black via mcp-video. One Reel per paper. Uploaded to the perea KB tagged `reel,<paper-slug>`. Produced by the `kinetic-podcast-engine` skill. See [ADR-0001](./docs/adr/0001-quotables-first-reels.md).

### Reel-worthy Quotable
A [Quotable fact](#quotable-fact-strict) additionally judged (Sonnet 4.6) to punch on social. Priority criteria, in order: (1) numeric mic-drop — number, %, $, ×, time; (2) names a regulation / protocol / company / person; (3) reads as a standalone punchline, not a date or setup sentence; (4) ≤30 words preferred (shorter = louder). Selection is **judgment, never generation** — same posture as the Quotable extraction faithfulness gate. The model selects 3–5 from the existing Quotables; it never writes new ones.

### Reel card
One on-screen text unit in a Reel. Produced by splitting a Reel-worthy Quotable on punctuation (`. , ; :` and `—`) with min 3 / max 9 words per card. Mounted in temporal order; per-card duration is proportional to character count, summing to the parent Quotable's TTS audio duration. **Faithfulness invariant:** rejoining all cards from one Quotable (with original punctuation) MUST equal the source Quotable's display text exactly. Violation aborts the render tick.

### Reel beat
A 400ms silent gap between Quotables in a Reel's audio track. Intentional kinetic pacing, not a TTS limitation. Reel audio duration = Σ(Quotable TTS durations) + (N − 1) × 400ms.

### Reel readiness
A paper is reel-ready when (1) it has a `### Quotable findings` (or `## Quotable`) section AND (2) no file tagged `reel,<slug>` exists in the perea KB. The `kinetic-podcast-engine pick` tick selects the first reel-ready paper per run (alphabetical), producing one reel and marking idempotency via the KB tag.

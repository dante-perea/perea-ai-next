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

### Reddit and Wikipedia tier reclassification
The classifier in `lib/research-claims.ts` treats Wikipedia as **primary** (per `(^|\.)wikipedia\.org(\/|$)` already in `PRIMARY_PATTERNS`). Reddit is reclassified as **secondary** (will be added). The reclassification reflects the empirical citation-economy reality (per `geo-2026.md`: Reddit is the #1 source on every major AI engine at ~40% citation share; Wikipedia accounts for 26-48% of ChatGPT's top-10 citation share), not the traditional source-authority hierarchy.

### Canonical 5
The five flagship papers that anchor the perea.ai/research brand identity:
1. b2a-2026 — The B2A Imperative
2. pinnacle-gecko-protocol — Idea→Ship→Feedback in Minutes (Essay)
3. mcp-server-playbook — MCP Server Playbook for SaaS Founders
4. geo-2026 — GEO/AEO 2026: The Citation Economy
5. agent-payment-stack-2026 — The Agent Payment Stack 2026

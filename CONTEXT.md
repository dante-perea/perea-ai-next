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

## /marketing — Glossary

### Marketing Playbook
A document published at `/marketing/<slug>` that teaches **one internal pattern perea has run in production** for distributing research to AI-cited surfaces (X, video, search). Sourced from perea's own operating history — not external survey. Always names the perea engine (e.g. `tick-X-post-from-research`, `kinetic-podcast-engine`, `perea-research-engine`) from which the pattern was extracted, plus the production evidence (tick count, drift findings, post-hoc audits) that validates it. Audience: external founders/agents building a similar AI-content pipeline. Format: same MDX shape as Research Playbooks but stored in a separate `content/marketing/` directory. _Avoid_: Marketing essay, operating note, pipeline doc.

### Research Playbook
A paper published at `/research/<slug>` that uses the `technical-playbook` profile in the perea-research-engine. Teaches a class of systems from **external evidence** — protocol specs, vendor announcements, benchmarks, third-party audits — surveyed via Exa. Distinguishes from a Marketing Playbook by source-of-truth (external evidence vs. perea's own operating history). _Avoid_: Marketing Playbook (different vertical, different evidence base).

### Distinction rule (vertical assignment)
When a pattern is teachable, decide its vertical by **evidence base**, not topic:
- Sourced from external survey + benchmarks → Research Playbook under `/research`
- Sourced from perea's own production runs + tick logs → Marketing Playbook under `/marketing`

Topics may overlap (a Research Playbook on GEO and a Marketing Playbook on the Hybrid Contract both touch citation magnetism); the evidence base is the canonical disambiguator.

### `source_engine`
Required frontmatter field on every Marketing Playbook. Names the SKILL.md under `~/.claude/skills/` from which the pattern was extracted (`perea-research-engine`, `tick-X-post-from-research`, `kinetic-podcast-engine`). The provenance claim that makes the Playbook falsifiable — without it, "perea ran this in production" cannot be checked. _Avoid_: source, engine, origin.

### `[^prod-N]` (production-evidence marker)
Citation marker namespace used exclusively inside Marketing Playbooks for production-sourced evidence: tick-log line entries, audit-pass findings (e.g. `drift-flags.md`), blocklist hit counts, omnisocials analytics, post-hoc Sonnet 4.6 critiques. Distinct from `[^N]` external-source markers. The `verify-research.ts` `marketing-playbook` dispatch requires at least one `[^prod-N]` citation; without it, the Playbook is not validated by perea's own operating history. See ADR-0001. _Avoid_: footnote, source-ref (those are the external-marker terms).

### Evidence bundle
Redacted log excerpts and audit snippets committed alongside a Marketing Playbook at `content/marketing/_evidence/<slug>/<filename>.md`. Each `[^prod-N]` citation in a Playbook body resolves to a file in that directory. The author manually curates the excerpts (redacting in-progress slugs, omnisocials post-IDs, account secrets, lock-file paths) before commit; redaction is the friction that keeps private operator state out of public content. The bundle is publicly served at `perea.ai/marketing/_evidence/<slug>/<filename>` so external agents can verify the provenance claims. Minimum one evidence file per Playbook. _Avoid_: sources directory, evidence dump.

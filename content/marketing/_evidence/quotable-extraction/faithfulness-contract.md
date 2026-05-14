# Quotable Extraction — faithfulness contract

Source: `perea-ai-next/CONTEXT.md`, glossary entries.

## Quotable fact (strict)

A standalone sentence extracted from a paper's body that earns inclusion in the `## Quotable Findings` section. Must satisfy:

1. contains a quantifiable claim — number, %, currency, ×, named regulation/protocol/company
2. cites a source via `[^N]` marker
3. reads as a complete sentence with no forward-pointing prose ("below" / "see Section X" / "as we'll see")
4. 15–40 words
5. makes a claim about the world (not internal paper structure)

Extraction is LLM-judged (Claude Sonnet 4.6) within these criteria, not regex-only — semantic judgment of "quotable hook" beats pattern matching.

## Faithfulness gate (Quotable extraction)

The LLM extractor (Claude Sonnet 4.6) must return findings as:

```json
{
  "quote": "…",
  "source_refs": [...],
  "h2_section": "…",
  "reason": "…"
}
```

where `quote` is a **literal substring** of the paper body.

Validation uses **normalized equality**:
- smart quotes → straight quotes
- runs of whitespace collapsed to a single space
- then compared

Any finding whose normalized quote isn't found in the normalized body is rejected. The model selects, never generates.

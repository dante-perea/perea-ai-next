---
status: accepted
date: 2026-05-14
---

# Forking `verify-research.ts` for Marketing Playbooks

## Context

We are adding a second content vertical at `/marketing` whose documents (Marketing Playbooks) teach internal patterns perea has run in production — sourced from perea's own engines (`perea-research-engine`, `tick-X-post-from-research`, `kinetic-podcast-engine`) and their tick logs / audit findings, not from external survey. The existing `scripts/verify-research.ts` pipeline assumes an external-evidence base: it gates papers on tier-mix (primary/secondary/tertiary), citation coverage against external URLs, and source-domain concentration. Marketing Playbooks fail those gates by construction. We still want the brand-critical quality bar (citation magnetism, no salt-shaker, Quotables, word ceiling) to apply to `/marketing`.

## Decision

Fork the verify pipeline by dispatching on a new frontmatter field `paper_type: "research" | "marketing-playbook"` (defaulting to `"research"` when absent for backwards compatibility).

For `paper_type: "marketing-playbook"`:

1. **Skip** the tier-mix and source-concentration gates. They assume external evidence.
2. **Keep** salt-shaker detection, Quotable faithfulness gate, word ceiling, and the citation-magnetism scorecard (regression-only).
3. **Require** a non-empty `source_engine: <skill-name>` frontmatter field that names an existing SKILL.md under `~/.claude/skills/`.
4. **Require** at least one `[^prod-N]` citation marker in the body — a new namespace, distinct from external `[^N]` markers, used exclusively for production-evidence citations (tick-log entries, audit findings, blocklist hit counts, drift flags, omnisocials analytics).
5. **Keep** Quotables. Sources for Quotables in a Marketing Playbook use the `[^prod-N]` namespace. This makes Marketing Playbooks consumable by `tick-X-post-from-research` — the engines can market themselves through the same machinery they market `/research` through.

For `paper_type: "research"` (default): pipeline behavior is unchanged.

## Considered options

- **Hard pass-through of `verify-research.ts`.** Rejected: every Marketing Playbook would fail the tier-mix gate by construction. Forcing authors to invent external sources to satisfy the quota would manufacture false provenance — the opposite of editorial defensibility.
- **Full exemption — no verify gate for `/marketing`.** Rejected: loses brand parity with `/research`. Citation magnetism is the central editorial goal of the site; exempting `/marketing` from the scorecard would silently produce lower-AEO-quality content under the same domain.
- **Separate verify script `verify-marketing.ts`.** Rejected: duplicates salt-shaker, Quotable, and citation-magnetism logic. The dispatch-on-`paper_type` shape keeps shared logic in one place and isolates only the evidence-base-specific gates.
- **Reuse the existing `[^N]` namespace for production evidence.** Rejected: muddles two different evidence bases under one citation namespace. A future verifier extension that auto-validates external-source URLs would be ambiguous about which markers to follow. The separate `[^prod-N]` namespace is cheap and self-documenting.
- **Make `source_engine` optional.** Rejected: provenance is the load-bearing claim of a Marketing Playbook ("perea ran this in production"). Without `source_engine` the claim is unfalsifiable.

## Consequences

- `scripts/verify-research.ts` gains a `paper_type` switch and a small `marketing-playbook` code path. New helpers: `validateSourceEngine` (frontmatter check), `extractProdCitations` (regex on `[^prod-N]`). Existing `research` path is unchanged.
- `content/marketing/<slug>.md` becomes a valid input alongside `content/whitepapers/<slug>.md`. The verify script must walk both directories.
- `lib/research-claims.ts` is not modified — tier classification is bypassed for marketing playbooks rather than extended with a new tier. If we later add a `perea-operating-evidence` tier, that is a separate ADR.
- The citation-magnetism scorecard applies unchanged. Scores are stored at `content/marketing/.scores/<slug>.json` mirroring the research convention.
- `tick-X-post-from-research`'s Quotable extractor must learn to read from `content/marketing/` as well as `content/whitepapers/`. The faithfulness gate (literal-substring check) is namespace-agnostic and continues to work.
- Reversibility: removing `/marketing` later means deleting the `marketing-playbook` branch from the dispatcher, the `content/marketing/` directory, and any published Playbook URLs. The `paper_type` field can remain on research papers as a no-op default.

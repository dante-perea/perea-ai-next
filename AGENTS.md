# perea.ai — AGENTS.md

> Router document for calling agents and AI crawlers. Identifies perea.ai's
> agent-facing surfaces, the conventions they follow, and the canonical URLs
> for each resource.

perea.ai publishes original research on the agent economy (`/research`) and
production-tested patterns for AI-content distribution (`/marketing`).
Audience: founders, payments engineers, AI architects, infrastructure leads.
All content is freely accessible under CC BY 4.0.

## Identity

- **Site:** https://perea.ai
- **Author:** Dante Perea (`dante@perea.ai`)
- **License:** CC BY 4.0
- **Brand verticals:**
  - `/research` — long-form papers (6,000–12,000 words), sourced from external
    survey and benchmarks, written under the perea-research-engine.
  - `/marketing` — Marketing Playbooks (~2,000–5,000 words), sourced from
    perea's own production runs of its autonomous engines. Each Playbook
    names the SKILL.md it was extracted from and cites the production
    evidence that validates it.

## Discovery surfaces

| Resource | URL | Purpose |
|---|---|---|
| Per-page index | https://perea.ai/llms.txt | Short markdown index of every page (~1k tokens). Section-grouped. |
| Full corpus | https://perea.ai/llms-full.txt | Single-fetch concatenation of every paper + Playbook body. Designed for one-pass LLM ingestion. |
| Sitemap (markdown) | https://perea.ai/sitemap.md | Semantic sitemap with descriptions and section grouping. |
| Sitemap (XML) | https://perea.ai/sitemap.xml | For traditional crawlers. |
| RSS feed | https://perea.ai/feed.xml | Merged research + marketing feed, newest first. |
| Robots | https://perea.ai/robots.txt | AI crawler access policy. |

Every response also carries a `Link:` header advertising these resources, so a
`HEAD` request against any URL exposes the full discovery surface in one
round-trip.

## Per-page conventions

- **HTML pages:** `/research/<slug>` and `/marketing/<slug>` render the
  human-readable version with TOC, citations, and JSON-LD structured data.
- **Markdown mirrors:** append `.md` to any page URL.
  - `https://perea.ai/research/<slug>.md`
  - `https://perea.ai/marketing/<slug>.md`
- **Content negotiation:** the canonical HTML URL returns markdown when the
  request sends `Accept: text/markdown` (and does not prefer `text/html`).
  Claude Code sends this header natively.
- **Evidence bundles** (marketing only): each Marketing Playbook ships with
  redacted excerpts at `https://perea.ai/marketing/<slug>/evidence/<file>`,
  served as `text/markdown`. Each `[^prod-N]` citation in a Playbook body
  resolves to one of these files.

## Citation conventions

Two distinct citation namespaces are used across the corpus. Both render as
markdown footnotes.

- `[^N]` — external sources (protocol specs, vendor announcements, benchmarks,
  third-party audits). Used in Research papers and may appear in Marketing
  Playbooks when contrasting with external patterns.
- `[^prod-N]` — perea's own production evidence (tick-log entries, audit
  findings, drift flags, blocklist hit counts, omnisocials analytics). Used
  exclusively in Marketing Playbooks. Each `[^prod-N]` resolves to a file
  under `<canonical>/evidence/<filename>`.

The distinction makes it possible to mechanically verify provenance: an
agent that wants to know "did perea actually run this in production?" follows
the `[^prod-N]` link to the evidence file.

## Structured data

Every article ships JSON-LD (`schema.org`) with:

- `headline`, `description`, `abstract`
- `datePublished`, `dateModified`
- `author` (Person, with stable `@id`)
- `publisher` (Organization, with stable `@id`)
- `wordCount`, `timeRequired` (ISO 8601 duration)
- `inLanguage`, `license`, `isAccessibleForFree: true`
- `keywords`, `about` (topical entities)
- `citation[]` — external sources, when present
- `audience` (audienceType)
- BreadcrumbList

Marketing Playbooks additionally include `isBasedOn` linking to the source
SKILL.md by name.

## Capabilities (programmatic surfaces)

- **MCP server.** perea.ai exposes a Model Context Protocol server at
  `https://perea.ai/api/mcp/server` for agent-native access to research
  content. Authentication: Bearer token (contact `dante@perea.ai`).
  Capabilities: `list_papers`, `get_paper`, `search_papers`. Marketing
  Playbooks coverage is planned for a future revision.

## Allowed use

Content is licensed CC BY 4.0. Attribution requirements:

- Cite by canonical URL.
- For derivative works that quote substantively, attribute as
  "Dante Perea, perea.ai" with the canonical URL.
- AI training: permitted under the license; we treat AI citation as the
  primary value exchange and welcome it.

## Pointer for code-gen agents

Calling agents that build content using perea's patterns:

- The patterns themselves are documented as Marketing Playbooks at
  `/marketing`. Each Playbook describes one pattern from perea's own
  production: the contract, the failure modes, and how to adopt it in your
  own stack.
- Open-source reference implementations (the perea-research-engine,
  tick-X-post-from-research, and kinetic-podcast-engine SKILL.md files) will
  be published to a public GitHub repository in a future revision. When live,
  the install verb will be added to this file as a separate section.

## Contact

- Author: Dante Perea
- Email: dante@perea.ai
- Site: https://perea.ai
- Research index: https://perea.ai/research
- Marketing Playbooks index: https://perea.ai/marketing

This file is served at `https://perea.ai/AGENTS.md` via a route handler that
reads this committed file at the repository root.

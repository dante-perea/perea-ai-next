# Quotable Extraction — downstream consumption map

Source: cross-referenced SKILL.md descriptions for the three engines that consume `## Quotable Findings`.

## Consumer 1 — `tick-X-post-from-research`

From the SKILL.md description:

> Each tick selects the newest unposted paper, drafts a D-shape essay (optimizer-written, Quotables as cited evidence) via the twitter-algorithm-optimizer skill...

The D-shape essay structure embeds 5–7 Quotables as the cited-evidence core. The optimizer chooses which Quotables to feature; the Hybrid Contract holds the chosen Quotables' numerics and named entities verbatim. Quotables effectively become the syndication unit — the X post is a frame around them.

A v1 filter excludes papers that don't have Quotables. Selection order: newest paper by frontmatter `date:` desc, restricted to Quotables-having papers; filter out already-scheduled/published/unpostable.

## Consumer 2 — `kinetic-podcast-engine`

From the SKILL.md description:

> Each tick (a) picks one reel-ready paper (has Quotables, no existing reel in KB) and (b) builds a 30-90s 9:16 reel from 3-5 LLM-judged Reel-worthy Quotables, voiced by Fish Audio (Clear Narrator) and rendered as kinetic typography on black via mcp-video.

Reel-worthy Quotables are a subset of Quotables — the LLM judge picks 3–5 of the paper's full Quotable set as having short, percussive, voiceable sentences. The reels are voiced and rendered as kinetic typography on a black background; the on-screen text is the Quotable verbatim.

A paper without Quotables produces no reel. The same paper-eligibility filter as the X-post engine applies.

## Consumer 3 — MCP `search_papers`

The perea.ai MCP server (advertised in `/llms.txt`) exposes three capabilities to authenticated agents:

- `list_papers`
- `get_paper`
- `search_papers`

`search_papers` returns paper hits with their Quotables as the per-paper snippet. This makes the Quotables the canonical "what does this paper say?" answer surface for agents querying perea.ai via MCP.

## Why the consumption pattern matters

One Quotable extraction is amortized across at least three channels. A typical perea paper has 8–14 Quotables; across one paper, the engines collectively produce:

- 1 long-form X post (5–7 Quotables featured)
- 1 kinetic-typography reel (3–5 Reel-worthy Quotables, on-screen text)
- N MCP search hits over time (Quotables as the snippet body)

The Quotable section is the load-bearing contract between the research production line and every distribution channel. Without it, each channel would need its own extraction pipeline; with it, channels are simple consumers of a shared atomic format.

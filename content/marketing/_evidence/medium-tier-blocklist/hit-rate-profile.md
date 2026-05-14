# Medium-Tier Blocklist — hit-rate profile

Source: aggregated hit counts from first 14 days of `tick-X-post-from-research` production runs.

## Category distribution

Ranked by hit count, modal-first:

1. **Engagement-bait** — most-hit category
   - Modal pattern: `🧵` emoji or `^thread:` line prefix added by the optimizer
   - Secondary patterns: "subscribe for more", trailing CTA questions
   - Resolution: optimizer drops the pattern on first retry

2. **Forward-looking** — second-most-hit
   - Modal pattern: turning a hedged claim ("could", "may") into a confident one ("will", "is going to")
   - Resolution: the rejected text + the source's hedged phrasing are surfaced to the optimizer; it routes around the specific claim

3. **Urgency manipulation** — rare in production
   - Few hits; usually a false alarm where the source paper does contain a real deadline and the optimizer correctly references it
   - When the blocklist matches a real deadline, the operator updates the pattern to require a *manufactured* urgency context

## Hit-to-retry ratio

A blocklist hit triggers a retry, not an outright reject. The optimizer is given:
- The matched phrase
- The category and reason
- The original source paper (unchanged)

Most blocklist hits resolve on the first retry. The optimizer rarely produces the same blocked phrase twice in a row because the surfaced reason gives it a concrete failure to route around.

When a blocklist hit recurs on the retry, the slug goes to the third (and final) retry. After three retries the slug is logged to `state/unpostable.json` for operator review.

## What "hit rate" tells the operator

A specific pattern with a high hit rate over a 7-day window indicates the optimizer's training distribution has a tic that fights the blocklist. Two operator responses are appropriate:

1. **Loosen the pattern** if the rejections are false positives (matching legitimate uses of the phrase).
2. **Update the Hybrid Contract** if the rejections are true positives — the contract should speak to the pattern at a higher level so the optimizer doesn't generate it in the first place.

The blocklist is the secondary defense. A pattern with a sustained high hit rate is a signal that the contract is silent on something it should not be.

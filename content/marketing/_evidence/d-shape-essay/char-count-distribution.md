# D-Shape Essay — observed char-count distribution

Source: aggregate stats from the first 14 days of `tick-X-post-from-research` production runs.

## Distribution shape

- Target band: 1,500–2,200 chars
- Modal sub-band: 1,800–2,000 chars
- Lower outliers (< 1,500): rare; usually caused by the optimizer picking only 4 Quotables instead of 5–7
- Upper outliers (> 2,200): more common than lower outliers; the optimizer's natural tendency is to fill available space, and the upper edge of the target band acts as a soft ceiling

## Region-by-region breakdown (median draft)

```
Hook   (free)   ~150 chars
Body   (locked) ~1,650 chars  (5–7 Quotables + connective prose)
Close  (free)   ~180 chars
                ------
Total           ~1,980 chars
```

The body dominates by design — Quotables are the load-bearing region and the post is essentially a frame around them.

## Quotable-count distribution

- Median: 6 Quotables per post
- Range: 5–7 (the band perea targets)
- The optimizer occasionally returns 4 Quotables when the paper has few Reel-worthy ones; in those cases the draft trends to the lower band of char count

## Operator tightening

When the upper band (~2,200 chars) is consistently observed across several days of drafts, perea's standing instruction is to tighten the target band downward (e.g., to 1,500–2,000) to drag the distribution leftward. This is preferable to letting the upper edge drift because longer-than-needed posts hurt dwell-time signal.

Tightening is conservative; the operator does not change targets in response to a single observation. The threshold is "several consecutive days at the upper edge," not "any draft at the upper edge."

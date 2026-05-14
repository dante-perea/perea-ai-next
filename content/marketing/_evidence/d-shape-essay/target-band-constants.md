# D-Shape Essay — target-band constants

Source: `~/.claude/skills/tick-X-post-from-research/SKILL.md`, "Hard constants" section.

```
MAX_POST_CHARS         = 24000                    (well under X Premium 25k ceiling)
MIN_POST_CHARS         = 800                      (below this = thin draft, retry)
TARGET_POST_CHARS      = 1500-2200                (test draft 62994875 hit this range cleanly)
```

## Why a target band well below the ceiling

X's Premium tier allows posts up to 25,000 characters. The target band sits at 6–9% of that — deliberately conservative.

The reasoning: X's recommendation system optimizes for dwell-time per impression, not for absolute length. A 25,000-char post that loses readers halfway through has a worse signal than an 1,800-char post that holds attention to the close. The target band is sized for read-through.

Empirically, perea's test draft (id 62994875) hit 2,047 characters on the first attempt without retries — landing cleanly in the 1,500–2,200 target band. Production drafts cluster in the 1,800–2,000 sub-band.

## Floor and ceiling enforcement

Drafts below `MIN_POST_CHARS = 800` are rejected as "thin" — the optimizer is asked to retry, with the floor cited as the rejection reason. Drafts above `MAX_POST_CHARS = 24000` are rejected outright. In practice the upper ceiling is never reached; the floor is hit occasionally when the optimizer picks too few Quotables.

The band is not a hard rule for the optimizer — the optimizer is told the target band as guidance, and the system measures the output. The verifier (Sonnet 4.6 reviewer) does not enforce the band; it enforces the Hybrid Contract. The band is enforced by the dispatcher around the verifier.

---
title: "The Validated Learning Taxonomy: A Falsifiability-Forcing Schema for Pinnacle Gecko Experiments"
subtitle: "Why 62 logged experiments can produce zero validated learning — and the multi-axis taxonomy that fixes it."
publication: "perea.ai Research"
authors: ["Dante Perea"]
version: "1.0"
status: "Essay"
date: "2026-05-09T06:30"
audience: "Founders running experiment trackers who are accumulating logs without compounding learnings"
length: "~3,200 words"
license: "CC BY 4.0"
description: "Synthesized from Eric Ries (Lean Startup), David Bland & Alex Osterwalder (Testing Business Ideas), Marty Cagan (SVPG), Teresa Torres (Continuous Discovery), Steve Blank (Customer Development), Tony Ulwick (JTBD/ODI), and Dave McClure (AARRR). A practical, forced-structure schema that distinguishes operational fixes from hypothesis tests and produces transferable knowledge from each closed experiment."
profile: "field-manual"
---

# The Validated Learning Taxonomy

A falsifiability-forcing schema for the Pinnacle Gecko experiment loop. Built from the convergent recommendations of every major hypothesis-testing framework, normalized into one operational taxonomy.

---

## Part 0 — The Failure Mode

A founder logs 62 experiments. Reviewing the corpus, every entry reads like:

> *"If `@vercel/blob` is reinstalled and `handleUpload` is called with a properly generated client token, then the upload-token route will return valid JSON instead of throwing on `.json()`."*

> *"If the background dispatcher is manually triggered, then EngineSignal timestamps will update and the '8 days' KPI warning will clear."*

These are **bug-fix verifications**. They belong in a commit log, not a learning corpus. Eric Ries (Lean Startup) is precise: *"the unit of progress is validated learning, not output."* An infrastructure repair produces output. It produces no validated learning about user behavior, market demand, willingness to pay, growth mechanics, or any other belief about the world.

The Pinnacle Gecko Protocol (Perea, 2026) identifies two distinct loops:
- **Loop A** — Hypothesis → demand test → MVP → 48-hour decision (validated learning)
- **Loop B** — Code commit → production in 5–15 minutes (delivery)

When every entry in the experiment tracker is a Loop B operational fix mislabeled as Loop A, the tracker stops compounding insight. The fix is **structural enforcement at the schema level**, not better discipline.

This document specifies that schema.

---

## Part 1 — The Eight-Axis Taxonomy

Every experiment is classified along eight orthogonal axes. Some axes are mandatory at creation (gating the "Run" button). Others are mandatory at close (gating the "Win/Kill" verdict). The schema rejects experiments that fail the falsifiability gate.

### Axis 1 — Loop Class (mandatory at create)

The single most important field. Without it, Loop A and Loop B contaminate each other.

| Code | Name | Definition | Belongs in learning corpus? |
|---|---|---|---|
| **L0** | Operational | Bug fix, infrastructure repair, refactor, deps upgrade | ❌ No — log as a commit, not a hypothesis |
| **L1** | Discovery | Tests a belief about the world (user behavior, market, willingness to pay) | ✅ Yes |
| **L2** | Optimization | A/B test on existing live product flow | ✅ Yes (lower weight) |

**Rule:** L0 entries should never use the words *"hypothesis"* or *"learning."* The system should auto-suggest L0 for entries whose stated outcome is a system state ("returns valid JSON," "timestamp updates," "warning clears") rather than a user behavior.

### Axis 2 — Risk Dimension (mandatory for L1/L2) — Cagan SVPG

The **Four Big Risks** from Marty Cagan's *Inspired*. Every L1/L2 experiment must declare the dominant risk it tests:

| Code | Risk | Question |
|---|---|---|
| **VAL** | Value | Will customers buy/use it? |
| **USA** | Usability | Can users figure out how to use it? |
| **FEA** | Feasibility | Can we build/operate it sustainably? |
| **VIA** | Viability | Does it work for the business (margins, brand, channels, legal)? |

This forces specificity. "We're testing the new onboarding" is rejected. "We're testing the **value** of the new onboarding (will users complete it?)" is accepted.

### Axis 3 — Hypothesis Class (mandatory for L1) — Ries

The Lean Startup's two foundational classes:

| Code | Class | Tests |
|---|---|---|
| **VAL-H** | Value Hypothesis | Does the product deliver value to the user once they're using it? |
| **GRO-H** | Growth Hypothesis | How will new users discover and adopt the product? |

A founder who has only logged Value-hypothesis experiments has not tested how the business grows. A tracker that surfaces this distribution daily forces balance.

### Axis 4 — AARRR Stage (mandatory for L1/L2) — McClure

Already in your schema. The taxonomy keeps it as-is:

| Code | Stage |
|---|---|
| ACQ | Acquisition |
| ACT | Activation |
| RET | Retention |
| REF | Referral |
| REV | Revenue |

### Axis 5 — Evidence Method (mandatory for L1) — Kromatic / Bland

How you'll gather signal. Maps directly to the *Testing Business Ideas* experiment library (44 cataloged methods). The taxonomy collapses these into 7 buckets ordered by evidence strength:

| Code | Method | Evidence Strength | Cycle Time |
|---|---|---|---|
| **INT** | Customer interview (1:1) | Low (anecdotal) | 30 min |
| **OBS** | Observation / session replay | Low–Medium | hours |
| **FAK** | Fake-door / smoke test landing page | Medium (intent only) | 1–4 hours |
| **CON** | Concierge MVP (user knows you're human) | High (real workflow) | hours–days |
| **WOZ** | Wizard of Oz (user thinks it's automated) | High (real workflow) | hours–days |
| **AB** | A/B test on live traffic | Statistical | days |
| **PAY** | Real payment / pre-order / Stripe link | Strongest (cash) | minutes–hours |

**Rule:** the system should warn if a high-stakes (mission-critical) hypothesis is being tested only with INT-class evidence.

### Axis 6 — Hypothesis Statement (mandatory, falsifiability gate)

The system **rejects** any L1/L2 experiment whose hypothesis does not contain all six slots. This is the single highest-leverage change.

```
We believe that  [SPECIFIC CHANGE]
for             [SPECIFIC USER SEGMENT]
will result in  [SPECIFIC USER BEHAVIOR]
measured by     [SPECIFIC METRIC]
hitting         [SPECIFIC THRESHOLD]
within          [SPECIFIC TIMEFRAME].

We will kill this if [METRIC] is below [KILL THRESHOLD] by [DEADLINE].
```

**Accepted example** (Loop A discovery):
> *"We believe that adding a Stripe payment link to the founder-dashboard onboarding for unifounder.ai users in the AI-startup ICP will result in pre-launch payment commitments measured by paid checkout completions hitting ≥3 within 48 hours of the tweet. We will kill this if completions are below 1 by hour 24."*

**Rejected example** (current corpus):
> *"If `@vercel/blob` is reinstalled, then the upload-token route returns JSON."*
> Reason: no user segment, no behavior, no measurable threshold, no timeframe. Auto-classified as L0 (operational), routed out of the learning corpus.

This template is canonical across Lean Startup (Ries), Lean UX (Gothelf), Strategyzer (Bland/Osterwalder), and Continuous Discovery (Torres). Every framework converges on these six slots; only the field names differ.

### Axis 7 — Validated Learning Extraction (mandatory at close, for L1)

When verdict is `win`, `kill`, or `inconclusive`, the system forces a structured learning record. Without this field populated, the experiment cannot be closed.

```
We believed   [BELIEF]
We learned    [OBSERVATION]
Confidence    [HIGH | MEDIUM | LOW]   ← based on sample size + evidence method
Generalizes to [THIS-EXPERIMENT-ONLY | THIS-SEGMENT | THIS-MARKET | UNIVERSAL]
Implication   [PERSEVERE | PIVOT | KILL | DOUBLE-DOWN]
Pivot type    [if pivot — Customer-Segment / Customer-Need / Channel / Pricing /
               Value-Prop / Zoom-In / Zoom-Out / Tech / Platform / Business-Model]
Next bet      [link to chained experiment ID]
```

**Pivot taxonomy** is verbatim from Eric Ries's *Lean Startup* Chapter 8. Forcing the founder to name the pivot type prevents the silent drift where "we adjusted the product" hides what was actually a customer-segment pivot.

**Confidence calibration:**
- HIGH: ≥10 paying users OR statistical significance OR triangulated across ≥3 evidence methods
- MEDIUM: 3–9 users with consistent signal OR one strong evidence method
- LOW: 1–2 users OR single weak method (interview only, observation only)

### Axis 8 — Signal Quality Tags (recorded per logged signal)

Each signal under an experiment carries metadata. Already partially in your schema (`source`); extend with:

| Field | Values |
|---|---|
| Source | `dm`, `usage`, `observation`, `call`, `review`, `analytics`, `payment` |
| Signal type | `behavior`, `stated-preference`, `payment`, `referral`, `friction`, `abandonment` |
| Evidence weight | `anecdotal-1` (one user), `triangulated-3` (3–5 users agree), `quantitative` (statistical) |
| Polarity | `confirmatory`, `disconfirming`, `neutral` |

**Why polarity matters:** confirmation bias is the silent killer of validated learning. A tracker that only collects confirmatory signals while ignoring disconfirming ones is a vanity tracker. Forcing polarity tagging surfaces this.

---

## Part 2 — The Anti-Pattern Detector

The taxonomy is not just classification; it is a **detection layer** that flags drift from the Pinnacle Gecko Protocol. The system runs these checks daily and surfaces violations in the dashboard:

| Check | Trigger | Diagnosis |
|---|---|---|
| **Loop B contamination** | >70% of last 14 days are L0 | "You're maintaining, not validating. Run a Loop A." |
| **Hypothesis class imbalance** | Zero GRO-H in last 30 days | "You're optimizing value but not testing growth." |
| **Risk-dimension blind spot** | Zero VIA experiments ever | "You've never tested business viability — pricing, margins, channels." |
| **AARRR funnel hole** | Zero RET experiments | "You're acquiring but not testing whether anyone stays." |
| **Falsifiability decay** | Average kill-threshold specificity < 0.5 | "Your hypotheses aren't precise enough to fail." |
| **Confirmation bias** | Disconfirming signal ratio < 15% | "You're only logging signals that support your hypothesis." |
| **Cycle time bloat** | Average L1 cycle > 7 days | "Compress. The protocol target is 48-hour decision." |
| **Free-first violation** | L1 experiment with no PAY-class evidence | "No price test = no real demand test (Marc Lou rule)." |
| **Dangling success** | Win without Next-bet field | "A win that doesn't chain into the next experiment is a wasted win." |
| **Stale flag** | Win + 30 days passed + feature flag still alive | "Anti-pattern #10 from the protocol — clean up the flag." |

These checks turn the experiment tracker from a passive log into an active coach.

---

## Part 3 — How This Maps to Your Existing Schema

Your current `experiments` table already has most fields. The taxonomy requires:

### Add to `experiments` table

```sql
ALTER TABLE experiments ADD COLUMN loop_class      VARCHAR(2);        -- L0|L1|L2
ALTER TABLE experiments ADD COLUMN risk_dimension  VARCHAR(3);        -- VAL|USA|FEA|VIA
ALTER TABLE experiments ADD COLUMN hypothesis_class VARCHAR(5);       -- VAL-H|GRO-H
ALTER TABLE experiments ADD COLUMN evidence_method VARCHAR(3);        -- INT|OBS|FAK|CON|WOZ|AB|PAY
ALTER TABLE experiments ADD COLUMN segment         TEXT;              -- forced segment slot
ALTER TABLE experiments ADD COLUMN behavior        TEXT;              -- forced behavior slot
ALTER TABLE experiments ADD COLUMN metric          TEXT;              -- forced metric slot
ALTER TABLE experiments ADD COLUMN threshold       TEXT;              -- forced threshold slot
ALTER TABLE experiments ADD COLUMN timeframe       TEXT;              -- forced timeframe slot
ALTER TABLE experiments ADD COLUMN kill_threshold  TEXT;              -- forced kill criterion
ALTER TABLE experiments ADD COLUMN confidence      VARCHAR(6);        -- HIGH|MEDIUM|LOW
ALTER TABLE experiments ADD COLUMN generalizes_to  VARCHAR(20);       -- THIS-ONLY|SEGMENT|MARKET|UNIVERSAL
ALTER TABLE experiments ADD COLUMN pivot_type      VARCHAR(20);       -- nullable, only if pivot
ALTER TABLE experiments ADD COLUMN next_bet_id     VARCHAR(64);       -- chains to next experiment
```

Your existing `experiment_type` enum (`product`, `pricing`, `messaging`, ...) becomes redundant once `risk_dimension` + `hypothesis_class` are populated. Migrate or drop.

### Add to `signals` table

```sql
ALTER TABLE signals ADD COLUMN signal_type     VARCHAR(20);   -- behavior|stated-preference|payment|...
ALTER TABLE signals ADD COLUMN evidence_weight VARCHAR(20);   -- anecdotal-1|triangulated-3|quantitative
ALTER TABLE signals ADD COLUMN polarity        VARCHAR(15);   -- confirmatory|disconfirming|neutral
```

### Backfill the 62 existing experiments

Run a one-time LLM pass (Grok 4.3 or Claude) over the 62 entries. The model:
1. Reads each `hypothesis` field
2. Classifies as L0 / L1 / L2 (most will be L0)
3. Routes L0 entries out of the active learning corpus (move to `operations` table or tag `archived-as-ops`)
4. For L1/L2 entries: extracts segment/behavior/metric/threshold from free text, fills the new columns, flags any that fail the falsifiability check

Expected outcome: 50–55 of 62 entries reclassified as L0. The remaining 7–12 become the foundation of a real validated-learning corpus.

---

## Part 4 — The Forced-Structure Form (UI implication)

The dashboard's "New experiment" form must change. Instead of two free-text fields (`hypothesis`, `success_criteria`), it becomes a structured wizard:

```
Step 1: Loop class                        [L0 / L1 / L2]
        ↓ if L0, route to Operations log (different form)
        ↓ if L1/L2, continue

Step 2: Risk dimension                    [VAL / USA / FEA / VIA]
Step 3: Hypothesis class (L1 only)        [Value / Growth]
Step 4: AARRR stage                       [ACQ / ACT / RET / REF / REV]
Step 5: Evidence method                   [INT / OBS / FAK / CON / WOZ / AB / PAY]

Step 6: Hypothesis statement (six slots)
        ┌────────────────────────────────────────────────┐
        │ We believe that [_________________________]    │
        │ for             [_________________________]    │
        │ will result in  [_________________________]    │
        │ measured by     [_________________________]    │
        │ hitting         [_________________________]    │
        │ within          [_________________________]    │
        │                                                │
        │ Kill if         [_________________________]    │
        │ by              [_________________________]    │
        └────────────────────────────────────────────────┘

  → "Run experiment" button DISABLED until all slots filled
  → Auto-validation: threshold and kill threshold must be numeric
  → Auto-validation: timeframe must be ≤7 days (Pinnacle Gecko target)
```

The form's job is to make malformed hypotheses **uncreatable**, not to teach discipline after the fact.

---

## Part 5 — Validated Learning Extraction at Close

Closing an experiment requires the structured learning block. The dashboard prompts:

```
You set out to test:
  [original hypothesis statement, rendered]

You logged N signals:
  [signal summary]

What did you actually learn?
  We learned that [_________________________________]
  Confidence:    [HIGH / MEDIUM / LOW] (based on sample of N)
  Generalizes:   [THIS-ONLY / SEGMENT / MARKET / UNIVERSAL]

Implication:
  ( ) Persevere — same hypothesis, more data
  ( ) Pivot     — choose pivot type:
                  ( ) Customer-Segment   ( ) Customer-Need
                  ( ) Channel            ( ) Pricing
                  ( ) Value-Prop         ( ) Zoom-In  ( ) Zoom-Out
                  ( ) Tech               ( ) Platform
                  ( ) Business-Model
  ( ) Kill      — this branch of exploration is closed
  ( ) Double-down — increase investment, run scaled version

Next bet (chained experiment):
  [auto-creates a draft experiment, pre-fills "We believe that..." with this learning as input]
```

The closed experiment becomes a *node in a learning graph*. The `next_bet_id` field creates explicit edges. Over time, the graph reveals which lines of inquiry compounded into product-market fit and which dead-ended.

---

## Part 6 — What This Buys You

### Immediate (week 1 after schema migration)

- 62 existing entries get triaged. The ~10 that are real Loop A learnings become your true corpus. The ~52 that are L0 ops fixes get archived where they belong.
- The "Validation rate" metric becomes meaningful (currently it's measured against a corpus that is 80% bug fixes, so the number is meaningless).
- Daily-report AI synthesis stops hallucinating insights from commit-log entries.

### 30-day horizon

- The anti-pattern detector starts flagging your blind spots. ("Zero GRO-H experiments in 30 days — you're not testing growth.")
- Signal polarity tagging surfaces your confirmation bias quantitatively.
- The learning graph (chained `next_bet_id`) reveals which hypotheses compound. Dead-end branches become visible.

### 90-day horizon

- The corpus accumulates ~30–60 well-formed L1 experiments instead of ~250 mixed-quality entries.
- Cycle time analytics become reliable. "Average L1 cycle: 38 hours" is a real number you can compress.
- The validated-learning records become a **personal RAG corpus** for your Claude/Cursor sessions. Every new hypothesis is grounded in what you've already tested. The KB becomes a compounding asset rather than an archive.

---

## Part 7 — Authoritative Sources

The taxonomy synthesizes the convergent prescriptions of:

- **Eric Ries** — *The Lean Startup* (2011): Value/Growth hypotheses, pivot taxonomy, validated learning, innovation accounting, build-measure-learn loop.
- **David Bland & Alex Osterwalder** — *Testing Business Ideas* (2019): 44-experiment library, Desirability/Viability/Feasibility/Adaptability axes, evidence-strength grading, "We believe that…" statement format.
- **Marty Cagan** — *Inspired* (2017) & SVPG "Four Big Risks" article: Value/Usability/Feasibility/Business-Viability risk taxonomy.
- **Teresa Torres** — *Continuous Discovery Habits* (2021): opportunity solution tree, assumption testing, weekly customer interview cadence.
- **Steve Blank** — *The Four Steps to the Epiphany* (2005): Customer Discovery → Validation → Creation → Building, hypothesis testing as scientific method.
- **Tony Ulwick** — *What Customers Want* / Outcome-Driven Innovation (2005): desired-outcome statements (devoid of solutions, measurable, controllable, stable).
- **Dave McClure** — *Startup Metrics for Pirates* (2007): AARRR funnel taxonomy.
- **Sean Ellis** — Product-market fit "very disappointed" >40% threshold (referenced in the Pinnacle Gecko Protocol's 48-hour decision rule).
- **Marc Lou** — "Sell first" rule: no demand validation without payment friction tested.
- **Jeff Gothelf** — *Lean UX*: hypothesis statement template ("We believe… for… will result in… measured by…").
- **Kromatic** — Generative vs. Evaluative experiments framing, Concierge/Wizard-of-Oz canonical definitions.
- **Barry O'Reilly** — *Hypothesis-Driven Development*: falsifiability as the entry gate to running any test.

The Pinnacle Gecko Protocol (Perea, 2026) is the operational target this taxonomy serves: minutes-to-hours cycle times, payment-validated demand, 48-hour decisions, anti-pattern refusal.

---

## Closing

A learning corpus is not the same as a log. A log accumulates entries. A corpus compounds knowledge. The difference is structural: forced classes, forced slots, forced extraction at close.

Your 62 experiments are a log. The schema in this document turns the next 62 into a corpus.

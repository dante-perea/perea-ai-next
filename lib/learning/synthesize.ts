// Synthesizes accumulated Need-More-Data notes into a structured re-decide
// recommendation. Called by the experiment-resurface cron the moment an
// experiment passes its 48h snooze window.
//
// Output is the same shape as a structured close (Axis 7), so the UI can
// pre-fill the close wizard with one click.

import { generateText } from "ai";
import { gateway } from "../ai";
import type { Experiment, Signal, SynthesisRecommendation } from "./ghost-db";

const PROMPT = `You are a startup founder's research partner. An experiment they ran 48+ hours ago has been waiting for a decision. They logged observation notes during that time. Your job: read the notes and recommend a decision.

THE EXPERIMENT:
{{ EXPERIMENT_JSON }}

THE NOTES THEY LOGGED (most recent first):
{{ NOTES }}

YOUR TASK: produce TWO things.

1. summary — One paragraph (≤ 4 sentences) describing what reality has actually said. Quote specific notes when relevant. Be honest if the notes are weak/contradictory/insufficient.

2. recommendation — A structured close decision (Axis 7) the founder can apply with one click. The implication options are:
- PERSEVERE: notes mostly validate the hypothesis. Close as WIN, run a similar follow-up to gather more evidence.
- DOUBLE-DOWN: notes strongly validate. Close as WIN, scale the bet.
- PIVOT: notes show the hypothesis was wrong on one axis (segment / need / channel / pricing / value-prop / etc). Close as KILL, spawn a refined child.
- KILL: notes refute the hypothesis. Close as KILL, no follow-up.

If notes are too weak to recommend a close (e.g., only 1 note, all contradictory, no real signal), pick the SAFEST recommendation that respects falsifiability — usually PIVOT (Customer-Need or Zoom-In) framed as "the kill threshold was not hit but the original hypothesis is unprovable as written, refine it." Never recommend "wait longer" — that's a separate UI button the founder will choose if they disagree with you.

RULES:
- learning is one sentence stating what was learned. Concrete. Past tense. "We learned that …"
- confidence reflects how strong the notes are. HIGH only if the notes clearly speak. LOW if you're guessing.
- generalizes_to: THIS-ONLY (just this user/test) | SEGMENT (the ICP) | MARKET (broader) | UNIVERSAL (a principle).
- pivot_type is REQUIRED when implication = PIVOT. Pick from: Customer-Segment | Customer-Need | Channel | Pricing | Value-Prop | Zoom-In | Zoom-Out | Tech | Platform | Business-Model.

Return ONLY valid JSON, no prose:

{
  "summary": "...",
  "recommendation": {
    "implication": "PERSEVERE|DOUBLE-DOWN|PIVOT|KILL",
    "learning": "We learned that ...",
    "confidence": "HIGH|MEDIUM|LOW",
    "generalizes_to": "THIS-ONLY|SEGMENT|MARKET|UNIVERSAL",
    "pivot_type": "Customer-Segment|...|Business-Model"
  }
}
`;

interface SynthesisOutput {
  summary: string;
  recommendation: SynthesisRecommendation;
}

export async function synthesizeExperiment(
  exp: Experiment,
  signals: Signal[]
): Promise<SynthesisOutput | null> {
  const expSummary = {
    id: exp.id,
    hypothesis: exp.hypothesis,
    risk_dimension: exp.risk_dimension,
    hypothesis_class: exp.hypothesis_class,
    aarrr_stage: exp.aarrr_stage,
    evidence_method: exp.evidence_method,
    segment: exp.segment,
    behavior: exp.behavior,
    metric: exp.metric,
    threshold: exp.threshold,
    timeframe: exp.timeframe,
    kill_threshold: exp.kill_threshold,
    started_at: exp.started_at,
  };

  const notesText = signals.length === 0
    ? "(no notes logged — only the elapsed snooze window)"
    : signals
        .map((s, i) => `${i + 1}. [${s.source}] (${new Date(s.created_at).toISOString()}) ${s.content}`)
        .join("\n");

  const prompt = PROMPT
    .replace("{{ EXPERIMENT_JSON }}", JSON.stringify(expSummary, null, 2))
    .replace("{{ NOTES }}", notesText);

  let text: string;
  try {
    const result = await generateText({
      model: gateway("xai/grok-4.3"),
      messages: [{ role: "user", content: prompt }],
      maxOutputTokens: 700,
    });
    text = result.text;
  } catch (err) {
    console.warn("[synthesize] AI gateway error:", err);
    return null;
  }

  const cleaned = text.replace(/```json\n?|\n?```/g, "").trim();
  try {
    const parsed = JSON.parse(cleaned);
    if (typeof parsed.summary !== "string" || !parsed.recommendation) return null;
    const rec = parsed.recommendation;
    if (!rec.implication || !rec.learning || !rec.confidence || !rec.generalizes_to) return null;
    if (rec.implication === "PIVOT" && !rec.pivot_type) {
      // Fall back to a sensible default rather than discarding the whole synthesis
      rec.pivot_type = "Customer-Need";
    }
    return {
      summary: parsed.summary.trim(),
      recommendation: {
        implication: rec.implication,
        learning: rec.learning.trim(),
        confidence: rec.confidence,
        generalizes_to: rec.generalizes_to,
        pivot_type: rec.implication === "PIVOT" ? rec.pivot_type : undefined,
      },
    };
  } catch {
    return null;
  }
}

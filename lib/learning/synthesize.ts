// Synthesizes accumulated Need-More-Data notes into a structured re-decide
// recommendation. Called by the experiment-resurface cron the moment an
// experiment passes its 48h snooze window.
//
// Output is the same shape as a structured close (Axis 7), so the UI can
// pre-fill the close wizard with one click.

import { generateText } from "ai";
import { gateway } from "../ai";
import type {
  Experiment, Signal, SynthesisRecommendation,
  Implication, Confidence, GeneralizesTo, PivotType,
} from "./ghost-db";

const IMPLICATIONS: readonly Implication[] = ["PERSEVERE", "PIVOT", "KILL", "DOUBLE-DOWN"];
const CONFIDENCES: readonly Confidence[] = ["HIGH", "MEDIUM", "LOW"];
const GENERALIZES: readonly GeneralizesTo[] = ["THIS-ONLY", "SEGMENT", "MARKET", "UNIVERSAL"];
const PIVOT_TYPES: readonly PivotType[] = [
  "Customer-Segment", "Customer-Need", "Channel", "Pricing", "Value-Prop",
  "Zoom-In", "Zoom-Out", "Tech", "Platform", "Business-Model",
];

function inEnum<T extends string>(allowed: readonly T[], value: unknown): T | null {
  return typeof value === "string" && (allowed as readonly string[]).includes(value) ? (value as T) : null;
}

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
  let parsed: unknown;
  try { parsed = JSON.parse(cleaned); } catch { return null; }
  if (!parsed || typeof parsed !== "object") return null;

  const root = parsed as Record<string, unknown>;
  const summary = typeof root.summary === "string" ? root.summary.trim() : null;
  const rec = root.recommendation as Record<string, unknown> | undefined;
  if (!summary || !rec || typeof rec !== "object") return null;

  // Strict enum validation — Grok occasionally hallucinates synonyms (e.g.
  // "VALIDATE" for "PERSEVERE") which would silently break the wizard
  // pre-fill. Reject the synthesis rather than store invalid values.
  const implication = inEnum(IMPLICATIONS, rec.implication);
  const confidence = inEnum(CONFIDENCES, rec.confidence);
  const generalizes_to = inEnum(GENERALIZES, rec.generalizes_to);
  const learning = typeof rec.learning === "string" ? rec.learning.trim() : "";
  if (!implication || !confidence || !generalizes_to || !learning) {
    console.warn("[synthesize] rejected — invalid enum or missing learning:", { rec });
    return null;
  }

  let pivot_type: PivotType | undefined;
  if (implication === "PIVOT") {
    pivot_type = inEnum(PIVOT_TYPES, rec.pivot_type) ?? "Customer-Need";
  }

  return {
    summary,
    recommendation: { implication, learning, confidence, generalizes_to, pivot_type },
  };
}

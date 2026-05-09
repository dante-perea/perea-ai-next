// Generates a draft "next bet" experiment from a closed experiment's
// structured learning, per the Validated Learning Taxonomy.
// Used by the close-experiment flow when implication != KILL.

import { generateText } from "ai";
import { gateway } from "../ai";
import type {
  Experiment, NewExperimentInput, Implication, PivotType,
  RiskDimension, HypothesisClass, AarrrStage, EvidenceMethod,
} from "./ghost-db";

interface NextBetGenerationInput {
  closed: Experiment;
  implication: Implication;
  learning: string;
  pivot_type?: PivotType;
}

const NEXT_BET_PROMPT = `You are generating the NEXT falsifiable hypothesis for a startup founder, based on what just happened in a closed experiment.

INPUT — the closed experiment that just produced a verdict:
{{ CLOSED_EXPERIMENT_JSON }}

INPUT — what the founder learned (one sentence):
{{ LEARNING }}

INPUT — implication chosen by the founder:
{{ IMPLICATION }}

{{ PIVOT_GUIDE }}

YOUR JOB: produce ONE next-step hypothesis in falsifiable form. Use the same Validated Learning Taxonomy schema. Pre-fill every slot — the founder will edit before running.

GUIDELINES BY IMPLICATION:
- PERSEVERE: Same hypothesis, more data. Same segment + behavior + metric. Adjust threshold (often raise the bar) and timeframe.
- DOUBLE-DOWN: Same hypothesis at scale. Raise threshold by 5-10x, keep segment, perhaps shorten timeframe to test if the win was real.
- PIVOT: One axis changes based on pivot_type. Keep everything else.

RULES:
- Hypothesis must use the canonical "We believe that [behavior] for [segment] measured by [metric] hitting [threshold] within [timeframe]. Kill if below [kill_threshold]." format.
- Threshold and kill_threshold MUST be concrete numbers.
- Timeframe ≤ 7 days.
- segment must remain a real user type, not "users" or "everyone".
- Mark loop_class as L1 (this is a discovery experiment derived from the closed one).

Return ONLY valid JSON:

{
  "hypothesis": "We believe that ...",
  "loop_class": "L1",
  "risk_dimension": "VAL|USA|FEA|VIA",
  "hypothesis_class": "VAL-H|GRO-H",
  "aarrr_stage": "ACQ|ACT|RET|REF|REV",
  "evidence_method": "INT|OBS|FAK|CON|WOZ|AB|PAY",
  "segment": "...",
  "behavior": "...",
  "metric": "...",
  "threshold": "...",
  "timeframe": "...",
  "kill_threshold": "..."
}`;

const PIVOT_GUIDES: Record<PivotType, string> = {
  "Customer-Segment": "PIVOT TYPE = Customer-Segment. Test the SAME value-prop / behavior / metric for a DIFFERENT user segment.",
  "Customer-Need":   "PIVOT TYPE = Customer-Need. SAME segment, but test a DIFFERENT need. Behavior and metric likely change.",
  "Channel":         "PIVOT TYPE = Channel. SAME everything except change the acquisition channel. evidence_method may shift to FAK or AB.",
  "Pricing":         "PIVOT TYPE = Pricing. Test a different price point or packaging. evidence_method should be PAY.",
  "Value-Prop":      "PIVOT TYPE = Value-Prop. Same segment, same job, different positioning. Behavior likely shifts.",
  "Zoom-In":         "PIVOT TYPE = Zoom-In. The closed experiment's product becomes a single feature. Test that feature in isolation with stricter metrics.",
  "Zoom-Out":        "PIVOT TYPE = Zoom-Out. The closed experiment's feature becomes a smaller part of a bigger product. Test the bigger product.",
  "Tech":            "PIVOT TYPE = Tech. Same value-prop, different technical approach. Re-test viability with the new tech.",
  "Platform":        "PIVOT TYPE = Platform. Move from product to platform (or vice versa). Re-test with the new architecture.",
  "Business-Model":  "PIVOT TYPE = Business-Model. Same product, different revenue model. evidence_method should be PAY.",
};

export async function generateNextBetDraft(
  input: NextBetGenerationInput
): Promise<Omit<NewExperimentInput, "id"> | null> {
  const closedSummary = {
    id: input.closed.id,
    hypothesis: input.closed.hypothesis,
    risk_dimension: input.closed.risk_dimension,
    hypothesis_class: input.closed.hypothesis_class,
    aarrr_stage: input.closed.aarrr_stage,
    evidence_method: input.closed.evidence_method,
    segment: input.closed.segment,
    behavior: input.closed.behavior,
    metric: input.closed.metric,
    threshold: input.closed.threshold,
    timeframe: input.closed.timeframe,
    kill_threshold: input.closed.kill_threshold,
    verdict: input.closed.verdict,
  };
  const pivotGuide = input.implication === "PIVOT" && input.pivot_type
    ? PIVOT_GUIDES[input.pivot_type] ?? ""
    : "";
  const prompt = NEXT_BET_PROMPT
    .replace("{{ CLOSED_EXPERIMENT_JSON }}", JSON.stringify(closedSummary, null, 2))
    .replace("{{ LEARNING }}", input.learning)
    .replace("{{ IMPLICATION }}", input.implication)
    .replace("{{ PIVOT_GUIDE }}", pivotGuide);

  let text: string;
  try {
    const result = await generateText({
      model: gateway("xai/grok-4.3"),
      messages: [{ role: "user", content: prompt }],
      maxOutputTokens: 600,
    });
    text = result.text;
  } catch (err) {
    console.warn("[next-bet] AI gateway error:", err);
    return null;
  }

  const cleaned = text.replace(/```json\n?|\n?```/g, "").trim();
  try {
    const parsed = JSON.parse(cleaned);
    if (!parsed.hypothesis || typeof parsed.hypothesis !== "string") return null;
    return {
      hypothesis: parsed.hypothesis.trim(),
      loop_class: "L1",
      project_tag: input.closed.project_tag,
      risk_dimension: parsed.risk_dimension as RiskDimension,
      hypothesis_class: parsed.hypothesis_class as HypothesisClass,
      aarrr_stage: parsed.aarrr_stage as AarrrStage,
      evidence_method: parsed.evidence_method as EvidenceMethod,
      segment: parsed.segment ?? undefined,
      behavior: parsed.behavior ?? undefined,
      metric: parsed.metric ?? undefined,
      threshold: parsed.threshold ?? undefined,
      timeframe: parsed.timeframe ?? undefined,
      kill_threshold: parsed.kill_threshold ?? undefined,
      is_implied: true,
    };
  } catch {
    return null;
  }
}

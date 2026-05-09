import { NextResponse } from "next/server";
import {
  createExperiment,
  generateExperimentId,
  getActiveExperiments,
  getDraftExperiments,
  TaxonomyValidationError,
  type NewExperimentInput,
} from "@/lib/learning/ghost-db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const wantDrafts = searchParams.get("drafts") === "1";
  const experiments = wantDrafts ? await getDraftExperiments() : await getActiveExperiments();
  return NextResponse.json(experiments);
}

export async function POST(req: Request) {
  let body: Partial<NewExperimentInput> & { hypothesis?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.hypothesis?.trim()) {
    return NextResponse.json({ error: "hypothesis is required" }, { status: 400 });
  }

  const input: NewExperimentInput = {
    id: generateExperimentId(),
    hypothesis: body.hypothesis.trim(),
    loop_class: body.loop_class as NewExperimentInput["loop_class"],
    project_tag: body.project_tag ?? null,
    risk_dimension: body.risk_dimension,
    hypothesis_class: body.hypothesis_class,
    aarrr_stage: body.aarrr_stage,
    evidence_method: body.evidence_method,
    segment: body.segment?.trim(),
    behavior: body.behavior?.trim(),
    metric: body.metric?.trim(),
    threshold: body.threshold?.trim(),
    timeframe: body.timeframe?.trim(),
    kill_threshold: body.kill_threshold?.trim(),
  };

  try {
    const experiment = await createExperiment(input);
    return NextResponse.json(experiment, { status: 201 });
  } catch (err) {
    if (err instanceof TaxonomyValidationError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    throw err;
  }
}

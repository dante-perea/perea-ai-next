import { NextResponse } from "next/server";
import { createExperiment, generateExperimentId, getActiveExperiments } from "@/lib/learning/ghost-db";

export async function GET() {
  const experiments = await getActiveExperiments();
  return NextResponse.json(experiments);
}

export async function POST(req: Request) {
  let body: {
    hypothesis?: string;
    success_criteria?: string;
    experiment_type?: string;
    aarrr_stage?: string;
    parent_experiment_id?: string;
    project_tag?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { hypothesis, success_criteria, experiment_type, aarrr_stage, parent_experiment_id, project_tag } = body;

  if (!hypothesis?.trim()) {
    return NextResponse.json({ error: "hypothesis is required" }, { status: 400 });
  }
  if (!success_criteria?.trim()) {
    return NextResponse.json({ error: "success_criteria is required" }, { status: 400 });
  }

  const id = generateExperimentId();
  const experiment = await createExperiment(id, hypothesis.trim(), project_tag, undefined, {
    success_criteria: success_criteria.trim(),
    experiment_type,
    aarrr_stage,
    parent_experiment_id,
  });

  return NextResponse.json(experiment, { status: 201 });
}

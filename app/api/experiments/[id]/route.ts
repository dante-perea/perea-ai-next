import { NextResponse } from "next/server";
import { markShipped, closeWithVerdict, deleteExperiment, updateExperimentTags } from "@/lib/learning/ghost-db";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let body: { action?: string; learning?: string; project_tag?: string; experiment_type?: string; feature_tag?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { action, learning } = body;

  if (action === "ship") {
    const exp = await markShipped(id);
    if (!exp) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(exp);
  }

  if (action === "win" || action === "kill") {
    if (!learning?.trim()) {
      return NextResponse.json({ error: "learning is required for win/kill" }, { status: 400 });
    }
    const exp = await closeWithVerdict(id, action, learning.trim());
    if (!exp) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(exp);
  }

  if (action === "more") {
    const exp = await closeWithVerdict(id, "need_more_data", "");
    if (!exp) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(exp);
  }

  if (action === "delete") {
    await deleteExperiment(id);
    return NextResponse.json({ deleted: true });
  }

  if (action === "retag") {
    const { project_tag, experiment_type, feature_tag } = body;
    await updateExperimentTags(id, { project_tag, experiment_type, feature_tag });
    return NextResponse.json({ retagged: true });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}

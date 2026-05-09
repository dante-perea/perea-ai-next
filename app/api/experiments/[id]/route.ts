import { NextResponse } from "next/server";
import {
  markShipped,
  closeWithStructure,
  setNextBetId,
  createDraftExperiment,
  generateExperimentId,
  insertSignal,
  promoteDraft,
  deleteExperiment,
  updateExperimentTags,
  snoozeExperiment,
  demoteExperimentToL0,
  promoteL0ToL1,
  ghostDb,
  type Experiment,
  type Implication,
  type Confidence,
  type GeneralizesTo,
  type PivotType,
} from "@/lib/learning/ghost-db";
import { generateNextBetDraft } from "@/lib/learning/next-bet";

interface CloseBody {
  action: "close";
  verdict: "win" | "kill";
  implication: Implication;
  learning: string;
  confidence: Confidence;
  generalizes_to: GeneralizesTo;
  pivot_type?: PivotType;
  generate_next_bet?: boolean; // default true unless implication = KILL
}

async function getById(id: string): Promise<Experiment | null> {
  const db = ghostDb();
  try {
    const rows = await db<Experiment[]>`SELECT * FROM experiments WHERE id = ${id} LIMIT 1`;
    return rows[0] ?? null;
  } finally {
    await db.end();
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let body: {
    action?: string;
    verdict?: "win" | "kill";
    implication?: Implication;
    learning?: string;
    confidence?: Confidence;
    generalizes_to?: GeneralizesTo;
    pivot_type?: PivotType;
    generate_next_bet?: boolean;
    project_tag?: string;
    experiment_type?: string;
    feature_tag?: string;
    signal_content?: string;
    revisit_days?: number;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { action } = body;

  if (action === "ship") {
    const exp = await markShipped(id);
    if (!exp) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(exp);
  }

  // Structured close (Axis 7) — replaces the old free-text win/kill action
  if (action === "close") {
    if (!body.verdict)         return NextResponse.json({ error: "verdict is required" }, { status: 400 });
    if (!body.implication)     return NextResponse.json({ error: "implication is required" }, { status: 400 });
    if (!body.learning?.trim()) return NextResponse.json({ error: "learning is required" }, { status: 400 });
    if (!body.confidence)      return NextResponse.json({ error: "confidence is required" }, { status: 400 });
    if (!body.generalizes_to)  return NextResponse.json({ error: "generalizes_to is required" }, { status: 400 });
    if (body.implication === "PIVOT" && !body.pivot_type) {
      return NextResponse.json({ error: "pivot_type is required when implication is PIVOT" }, { status: 400 });
    }

    const closed = await closeWithStructure({
      id,
      verdict: body.verdict,
      implication: body.implication,
      learning: body.learning.trim(),
      confidence: body.confidence,
      generalizes_to: body.generalizes_to,
      pivot_type: body.pivot_type,
    });
    if (!closed) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // Auto-spawn next-bet draft when implication != KILL (per Q3=B)
    const wantDraft = (body.generate_next_bet ?? true) && body.implication !== "KILL";
    if (wantDraft) {
      try {
        const seed = await generateNextBetDraft({
          closed,
          implication: body.implication,
          learning: body.learning.trim(),
          pivot_type: body.pivot_type,
        });
        if (seed) {
          const draftId = generateExperimentId();
          await createDraftExperiment({
            id: draftId,
            ...seed,
            parent_experiment_id: closed.id,
          });
          await setNextBetId(closed.id, draftId);
          return NextResponse.json({ closed, draft_id: draftId });
        }
      } catch (err) {
        console.warn("[experiments/close] draft generation failed:", err);
      }
    }
    return NextResponse.json({ closed, draft_id: null });
  }

  // Need More Data: log a signal AND snooze for revisit_days (default 2).
  // Snooze hides the experiment from the Decide Now ranking until reality
  // has had time to speak; the cron will then synthesize the notes for re-decide.
  if (action === "more") {
    const content = body.signal_content?.trim() || "Need more data — still observing.";
    const days = body.revisit_days && body.revisit_days > 0 ? body.revisit_days : 2;
    const tagged = `[need-more-data] ${content}${content.includes("[revisit-in:") ? "" : ` [revisit-in:${days}d]`}`;
    try {
      await insertSignal(id, "observation", tagged);
      await snoozeExperiment(id, days);
      const exp = await getById(id);
      return NextResponse.json({ ok: true, experiment: exp });
    } catch (err) {
      return NextResponse.json({ error: String(err) }, { status: 500 });
    }
  }

  // Re-snooze without adding a new note (used by "Wait longer" button on the synthesis banner).
  if (action === "snooze") {
    const days = body.revisit_days && body.revisit_days > 0 ? body.revisit_days : 2;
    const exp = await snoozeExperiment(id, days);
    if (!exp) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(exp);
  }

  // Reclassify as L0: when an L1/L2 turned out not to be a real falsifiable
  // hypothesis (force-generated extractor false-positive). Reversible via
  // action=promote_l1; field data is preserved so promote restores cleanly.
  if (action === "demote") {
    const exp = await demoteExperimentToL0(id);
    if (!exp) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(exp);
  }

  // Reverse of demote — flips L0 back to L1. Original L1/L2 fields were
  // preserved on demotion so they re-render automatically.
  if (action === "promote_l1") {
    const exp = await promoteL0ToL1(id);
    if (!exp) return NextResponse.json({ error: "Not found or not an L0" }, { status: 404 });
    return NextResponse.json(exp);
  }

  // Promote a draft → active experiment
  if (action === "promote") {
    const exp = await promoteDraft(id);
    if (!exp) return NextResponse.json({ error: "Draft not found" }, { status: 404 });
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

  // Legacy actions retained for backward compat with old clients
  if (action === "win" || action === "kill") {
    return NextResponse.json({
      error: "Legacy free-text close is no longer supported. Use action='close' with the structured Axis 7 fields (verdict, implication, learning, confidence, generalizes_to, pivot_type).",
    }, { status: 400 });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}

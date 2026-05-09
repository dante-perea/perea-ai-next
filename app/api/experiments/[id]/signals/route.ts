import { NextResponse } from "next/server";
import { getSignalsForExperiment } from "@/lib/learning/ghost-db";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const signals = await getSignalsForExperiment(id);
  return NextResponse.json(signals);
}

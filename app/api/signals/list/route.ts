import { NextResponse } from "next/server";
import { getRecentSignals } from "@/lib/learning/market-signals-db";

export async function GET() {
  const signals = await getRecentSignals(150);
  return NextResponse.json(
    signals.map((s) => ({ ...s, fetched_at: s.fetched_at.toISOString() }))
  );
}

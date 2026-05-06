import { NextResponse } from "next/server";
import { getOpportunities } from "@/lib/learning/market-signals-db";

export async function GET() {
  const opps = await getOpportunities();
  return NextResponse.json(
    opps.map((o) => ({ ...o, clustered_at: o.clustered_at.toISOString() }))
  );
}

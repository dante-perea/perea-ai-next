import { NextResponse } from "next/server";
import { listAllFiles } from "@/lib/knowledge-base/meta";

export async function GET(): Promise<NextResponse> {
  try {
    const files = await listAllFiles();
    return NextResponse.json(files);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to list files";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

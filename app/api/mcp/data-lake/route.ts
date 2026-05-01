import { NextResponse } from "next/server";
import { listAllFiles } from "@/lib/data-lake/meta";
import type { MpcFileRecord } from "@/lib/data-lake/types";

export async function GET(request: Request): Promise<NextResponse> {
  const secret = process.env.MCP_SECRET;
  if (secret) {
    const auth = request.headers.get("authorization") ?? "";
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  try {
    const files = await listAllFiles();
    const base = new URL(request.url).origin;
    const records: MpcFileRecord[] = files.map((f) => ({
      id: f.id,
      filename: f.filename,
      url: `${base}/api/data-lake/files/${f.id}/download`,
      uploadedAt: f.uploadedAt,
      size: f.size,
    }));

    return NextResponse.json({ files: records });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Query failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

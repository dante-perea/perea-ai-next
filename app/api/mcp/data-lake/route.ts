import { NextResponse } from "next/server";
import { listAllFilesAdmin } from "@/lib/knowledge-base/meta";
import type { KbFileRecord } from "@/lib/knowledge-base/types";

export async function GET(request: Request): Promise<NextResponse> {
  const secret = process.env.MCP_SECRET;
  if (secret) {
    const auth = request.headers.get("authorization") ?? "";
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  try {
    const { searchParams } = new URL(request.url);
    const tag = searchParams.get("tag");

    let files = await listAllFilesAdmin();
    if (tag) files = files.filter((f) => f.tags.includes(tag));

    const base = new URL(request.url).origin;
    const records: KbFileRecord[] = files.map((f) => ({
      id: f.id,
      filename: f.filename,
      url: `${base}/api/knowledge-base/files/${f.id}/download`,
      tags: f.tags,
      uploadedBy: f.uploadedBy,
      uploadedAt: f.uploadedAt,
      size: f.size,
    }));

    return NextResponse.json({ files: records });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Query failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

import { auth } from "@clerk/nextjs/server";
import { get } from "@vercel/blob";
import { NextResponse } from "next/server";
import { findFileById } from "@/lib/knowledge-base/meta";
import { getUserTeamIds } from "@/lib/knowledge-base/teams";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const teamIds = await getUserTeamIds(userId);
  const file = await findFileById(id, { userId, teamIds });
  if (!file) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const result = await get(file.blobUrl, { access: "private" });
  if (!result || result.statusCode !== 200) {
    return NextResponse.json({ error: "File unavailable" }, { status: 404 });
  }

  return new Response(result.stream, {
    headers: {
      "Content-Type": file.contentType || "application/octet-stream",
      "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(file.filename)}`,
      "Content-Length": String(file.size),
    },
  });
}

import { NextResponse } from "next/server";
import { updateTags } from "@/lib/knowledge-base/meta";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { id } = await params;
    const { tags } = (await request.json()) as { tags: string[] };

    if (!Array.isArray(tags)) {
      return NextResponse.json({ error: "tags must be an array" }, { status: 400 });
    }

    const updated = await updateTags(id, tags.map((t) => t.trim()).filter(Boolean));
    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json(updated);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Tag update failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

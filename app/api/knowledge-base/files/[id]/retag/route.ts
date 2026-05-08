import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { get } from "@vercel/blob";
import { generateText } from "ai";
import { gateway } from "@/lib/ai";
import { findFileById, updateTags } from "@/lib/knowledge-base/meta";
import { getUserTeamIds, checkTeamAccess } from "@/lib/knowledge-base/teams";

const SYSTEM_PROMPT = `Generate 3–8 descriptive tags for a knowledge-base document.
Rules:
- Lowercase only
- Hyphenated when multi-word (e.g. "ai-agents", "prompt-engineering")
- No generic tags like "document", "file", "text", "content"
- Focus on topic, domain, key concepts, and purpose
Return ONLY a JSON array of strings. Example: ["machine-learning","rag","vector-search"]`;

function extractTags(raw: string): string[] {
  const match = raw.match(/\[[\s\S]*?\]/);
  if (!match) return [];
  try {
    const arr = JSON.parse(match[0]);
    return Array.isArray(arr)
      ? arr.filter((t): t is string => typeof t === "string" && t.length > 0)
           .map((t) => t.toLowerCase().trim())
      : [];
  } catch { return []; }
}

function looksLikeText(buf: ArrayBuffer): boolean {
  const view = new Uint8Array(buf.slice(0, 2048));
  const printable = [...view].filter(
    (b) => (b >= 32 && b <= 126) || b === 9 || b === 10 || b === 13,
  ).length;
  return view.length === 0 || printable / view.length > 0.7;
}

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const teamIds = await getUserTeamIds(userId);
  const ctx = { userId, teamIds };

  const file = await findFileById(id, ctx);
  if (!file) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (file.teamId) {
    const access = await checkTeamAccess(file.teamId, userId, "editor");
    if (!access.ok) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const blob = await get(file.blobUrl, { access: "private" });
  if (!blob || blob.statusCode !== 200) {
    return NextResponse.json({ error: "File unavailable" }, { status: 404 });
  }

  let aiText: string;

  try {
    const bytes = await new Response(blob.stream).arrayBuffer();

    if (file.contentType.startsWith("image/")) {
      const { text } = await generateText({
        model: gateway("openai/gpt-4o"),
        messages: [{
          role: "user",
          content: [
            { type: "text", text: SYSTEM_PROMPT },
            {
              type: "image",
              image: new Uint8Array(bytes),
            },
          ],
        }],
        maxOutputTokens: 128,
      });
      aiText = text;
    } else {
      const contentStr = looksLikeText(bytes)
        ? `Content:\n${new TextDecoder("utf-8", { fatal: false }).decode(bytes).slice(0, 10_000)}`
        : "(Binary file — use filename and type as context)";

      const { text } = await generateText({
        model: gateway("openai/gpt-4o-mini"),
        prompt: `${SYSTEM_PROMPT}\n\nFilename: ${file.filename}\nType: ${file.contentType}\n${contentStr}`,
        maxOutputTokens: 128,
      });
      aiText = text;
    }
  } catch (err) {
    console.error("[retag]", err);
    return NextResponse.json({ error: "Tag generation failed" }, { status: 500 });
  }

  const tags = extractTags(aiText);
  if (tags.length === 0) {
    return NextResponse.json({ error: "No tags generated" }, { status: 500 });
  }

  const updated = await updateTags(id, tags, ctx);
  if (!updated) return NextResponse.json({ error: "Update failed" }, { status: 500 });

  return NextResponse.json(updated);
}

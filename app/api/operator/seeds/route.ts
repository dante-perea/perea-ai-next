import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { insertSeed } from "@/lib/operator-state";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  let body: { idea?: unknown; sourceUrl?: unknown };
  try {
    body = await req.json();
  } catch {
    return new NextResponse("Invalid JSON", { status: 400 });
  }

  const idea = typeof body.idea === "string" ? body.idea.trim() : "";
  if (idea.length < 4 || idea.length > 4000) {
    return new NextResponse("Seed must be 4–4000 characters.", { status: 400 });
  }

  const sourceUrlRaw =
    typeof body.sourceUrl === "string" ? body.sourceUrl.trim() : "";
  let sourceUrl: string | null = null;
  if (sourceUrlRaw) {
    try {
      const u = new URL(sourceUrlRaw);
      if (u.protocol !== "http:" && u.protocol !== "https:") {
        return new NextResponse("Source URL must be http(s).", { status: 400 });
      }
      sourceUrl = u.toString();
    } catch {
      return new NextResponse("Source URL is not a valid URL.", { status: 400 });
    }
  }

  try {
    const seed = await insertSeed({
      idea,
      sourceUrl,
      submittedBy: userId,
    });
    return NextResponse.json(seed);
  } catch (err) {
    console.error("seed insert failed:", err);
    return new NextResponse("Database error", { status: 500 });
  }
}

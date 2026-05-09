import { NextRequest, NextResponse } from "next/server";
import { listResearchSlugs } from "@/lib/research";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://perea.ai";
const INDEXNOW_KEY = "e95e634d4fa842bed3fff56682ad75d5";
const WEBHOOK_SECRET = process.env.INDEXNOW_WEBHOOK_SECRET;

export async function POST(req: NextRequest) {
  // Verify secret so only Vercel deploy hooks can trigger this
  const secret = req.headers.get("x-webhook-secret") ?? req.nextUrl.searchParams.get("secret");
  if (!WEBHOOK_SECRET || secret !== WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const host = new URL(SITE_URL).hostname;
  const slugs = listResearchSlugs("en");
  const urls = [
    SITE_URL,
    `${SITE_URL}/research`,
    ...slugs.map((s) => `${SITE_URL}/research/${s}`),
  ];

  const body = {
    host,
    key: INDEXNOW_KEY,
    keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
    urlList: urls,
  };

  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(body),
  });

  return NextResponse.json(
    { submitted: urls.length, indexnow_status: res.status },
    { status: res.ok ? 200 : 502 }
  );
}

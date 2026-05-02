import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { fetchAndConvert, UrlConvertError } from "@/lib/knowledge-base/url-to-md";
import { insertFile } from "@/lib/knowledge-base/meta";
import type { FileMetadata } from "@/lib/knowledge-base/types";

export const maxDuration = 30;

type ConvertErrorCode = "INVALID_URL" | "FETCH_FAILED" | "TIMEOUT" | "NO_CONTENT" | "SAVE_FAILED";

function codeToStatus(code: ConvertErrorCode): number {
  if (code === "INVALID_URL") return 400;
  if (code === "NO_CONTENT") return 422;
  if (code === "TIMEOUT") return 504;
  if (code === "SAVE_FAILED") return 500;
  return 502; // FETCH_FAILED
}

export async function POST(request: Request): Promise<NextResponse> {
  const { userId, sessionClaims } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized", code: "INVALID_URL" }, { status: 401 });
  }

  const body = (await request.json()) as { url?: unknown; saveToKb?: unknown };
  const url = typeof body.url === "string" ? body.url.trim() : "";
  const saveToKb = body.saveToKb === true;

  if (!url) {
    return NextResponse.json({ error: "Missing url", code: "INVALID_URL" }, { status: 400 });
  }

  let result: Awaited<ReturnType<typeof fetchAndConvert>>;
  try {
    result = await fetchAndConvert(url);
  } catch (err) {
    if (err instanceof UrlConvertError) {
      return NextResponse.json(
        { error: err.message, code: err.code },
        { status: codeToStatus(err.code) }
      );
    }
    return NextResponse.json(
      { error: "Unexpected error", code: "FETCH_FAILED" },
      { status: 500 }
    );
  }

  if (!saveToKb) {
    return NextResponse.json(result);
  }

  try {
    const id = crypto.randomUUID();
    const safeName = result.filename.replace(/[^a-zA-Z0-9._-]/g, "_");
    const blobPath = `users/${userId}/files/${id}-${safeName}`;

    const blob = await put(blobPath, result.markdown, {
      access: "private",
      contentType: "text/markdown",
      addRandomSuffix: false,
    });

    const meta: FileMetadata = {
      id,
      filename: result.filename,
      blobKey: blob.pathname,
      blobUrl: blob.url,
      size: result.byteSize,
      contentType: "text/markdown",
      uploadedBy: (sessionClaims?.email as string | undefined) ?? "",
      uploadedAt: new Date().toISOString(),
      tags: [],
      userId,
      teamId: null,
    };

    await insertFile(meta);

    return NextResponse.json({ ...result, savedToKb: { id, blobUrl: blob.url } });
  } catch {
    // Conversion succeeded but save failed — return markdown so the client can still offer download
    return NextResponse.json({ ...result, saveError: "Failed to save to Knowledge Base" });
  }
}

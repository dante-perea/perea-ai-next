import Exa from "exa-js";

let _exa: Exa | undefined;
const getExa = () => (_exa ??= new Exa(process.env.EXA_API_KEY!));

export class UrlConvertError extends Error {
  constructor(
    message: string,
    public readonly code: "INVALID_URL" | "FETCH_FAILED" | "TIMEOUT" | "NO_CONTENT"
  ) {
    super(message);
    this.name = "UrlConvertError";
  }
}

export function slugifyTitle(title: string): string {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return slug || `page-${Date.now()}`;
}

export async function fetchAndConvert(rawUrl: string): Promise<{
  markdown: string;
  title: string;
  filename: string;
  byteSize: number;
}> {
  let url: URL;
  try {
    const normalized = rawUrl.startsWith("http") ? rawUrl : `https://${rawUrl}`;
    url = new URL(normalized);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      throw new Error("bad protocol");
    }
  } catch {
    throw new UrlConvertError("Invalid or unsupported URL", "INVALID_URL");
  }

  let page: { title: string | null; url: string; text?: string } | undefined;
  try {
    const response = await getExa().getContents([url.href], {
      text: { maxCharacters: 20000 },
    });
    page = response.results[0] as typeof page;
  } catch (err) {
    throw new UrlConvertError(`Failed to fetch URL: ${String(err)}`, "FETCH_FAILED");
  }

  if (!page?.text?.trim()) {
    throw new UrlConvertError(
      "No readable content found. The page may be paywalled or inaccessible.",
      "NO_CONTENT"
    );
  }

  const title = page.title ?? "Untitled";
  const markdown = `# ${title}\n\n> Source: ${url.href}\n\n${page.text.trim()}`;
  const filename = `${slugifyTitle(title)}.md`;
  const byteSize = Buffer.byteLength(markdown, "utf-8");

  return { markdown, title, filename, byteSize };
}

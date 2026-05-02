import { Readability } from "@mozilla/readability";
import { JSDOM } from "jsdom";
import TurndownService from "turndown";

export class UrlConvertError extends Error {
  constructor(
    message: string,
    public readonly code: "INVALID_URL" | "FETCH_FAILED" | "TIMEOUT" | "NO_CONTENT"
  ) {
    super(message);
    this.name = "UrlConvertError";
  }
}

const MAX_BODY_BYTES = 5 * 1024 * 1024;

// Blocks localhost, loopback, and RFC-1918 private ranges (SSRF hardening)
const PRIVATE_HOST_RE =
  /^(localhost$|127\.|0\.0\.0\.0$|10\.|172\.(1[6-9]|2\d|3[01])\.|192\.168\.|169\.254\.|\[::1\]$|::1$)/i;

export function isAllowedUrl(url: URL): boolean {
  if (url.protocol !== "http:" && url.protocol !== "https:") return false;
  return !PRIVATE_HOST_RE.test(url.hostname);
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
    url = new URL(rawUrl);
  } catch {
    throw new UrlConvertError("Invalid URL", "INVALID_URL");
  }

  if (!isAllowedUrl(url)) {
    throw new UrlConvertError("URL not allowed", "INVALID_URL");
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15_000);

  let response: Response;
  try {
    response = await fetch(url.toString(), {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; PereaAI/1.0; +https://perea.ai)",
        Accept: "text/html,application/xhtml+xml",
      },
    });
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      throw new UrlConvertError("Request timed out after 15 seconds", "TIMEOUT");
    }
    throw new UrlConvertError("Failed to reach URL", "FETCH_FAILED");
  } finally {
    clearTimeout(timer);
  }

  if (!response.ok) {
    throw new UrlConvertError(`Server returned ${response.status}`, "FETCH_FAILED");
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("text/html") && !contentType.includes("application/xhtml+xml")) {
    throw new UrlConvertError("URL does not point to an HTML page", "NO_CONTENT");
  }

  const contentLength = Number(response.headers.get("content-length") ?? "0");
  if (contentLength > MAX_BODY_BYTES) {
    throw new UrlConvertError("Page is too large (over 5 MB)", "FETCH_FAILED");
  }

  if (!response.body) {
    throw new UrlConvertError("Empty response body", "FETCH_FAILED");
  }

  // Stream body with a hard size cap regardless of Content-Length header
  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let totalBytes = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    totalBytes += value.length;
    if (totalBytes > MAX_BODY_BYTES) {
      await reader.cancel();
      throw new UrlConvertError("Page is too large (over 5 MB)", "FETCH_FAILED");
    }
    chunks.push(value);
  }

  const html = Buffer.concat(chunks.map((c) => Buffer.from(c))).toString("utf-8");

  const dom = new JSDOM(html, { url: url.toString() });
  const article = new Readability(dom.window.document).parse();

  if (!article?.textContent?.trim()) {
    throw new UrlConvertError(
      "Page returned no readable content. It may be paywalled, login-protected, or JS-rendered.",
      "NO_CONTENT"
    );
  }

  const td = new TurndownService({ headingStyle: "atx", codeBlockStyle: "fenced" });
  const markdown = td.turndown(article.content ?? "");

  if (!markdown.trim()) {
    throw new UrlConvertError("Page returned no readable content", "NO_CONTENT");
  }

  const title = article.title ?? "";
  const filename = `${slugifyTitle(title)}.md`;
  const byteSize = Buffer.byteLength(markdown, "utf-8");

  return { markdown, title, filename, byteSize };
}

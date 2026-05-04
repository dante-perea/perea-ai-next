"use client";

import { useState } from "react";

interface UrlImportProps {
  onSavedToKb: () => void;
}

type Status = "idle" | "loading" | "done" | "error";

interface ConvertResult {
  markdown: string;
  title: string;
  filename: string;
  byteSize: number;
  savedToKb?: { id: string; blobUrl: string };
  saveError?: string;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function downloadMarkdown(content: string, filename: string) {
  const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function UrlImport({ onSavedToKb }: UrlImportProps) {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [result, setResult] = useState<ConvertResult | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  async function handleConvert() {
    const trimmed = url.trim();
    if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
      setErrorMsg("Please enter a valid URL starting with https://");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setResult(null);
    setErrorMsg("");

    try {
      const res = await fetch("/api/knowledge-base/url-to-md", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: trimmed, saveToKb: true }),
      });

      const data = (await res.json()) as ConvertResult & { error?: string; code?: string };

      if (!res.ok) {
        setErrorMsg(data.error ?? "Something went wrong");
        setStatus("error");
        return;
      }

      setResult(data);
      setStatus("done");

      if (data.savedToKb) onSavedToKb();
    } catch {
      setErrorMsg("Network error — please try again");
      setStatus("error");
    }
  }

  return (
    <div className="mb-4">
      {/* Input row */}
      <div className="flex gap-2">
        <input
          type="url"
          value={url}
          onChange={(e) => { setUrl(e.target.value); if (status === "error") setStatus("idle"); }}
          onKeyDown={(e) => { if (e.key === "Enter" && status !== "loading") handleConvert(); }}
          placeholder="Paste a URL to convert to Markdown…"
          disabled={status === "loading"}
          className="min-w-0 flex-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-white)] px-3 py-2 text-sm text-[var(--color-ink)] placeholder:text-[var(--color-ink-faint)] focus:border-[var(--color-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)] disabled:opacity-50"
        />
        <button
          onClick={handleConvert}
          disabled={status === "loading" || !url.trim()}
          className="flex shrink-0 items-center gap-1.5 rounded-lg bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--color-accent-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {status === "loading" ? (
            <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <ArrowDownIcon />
          )}
          Convert
        </button>
      </div>

      {/* Error state */}
      {status === "error" && (
        <p className="mt-2 text-xs text-red-500">{errorMsg}</p>
      )}

      {/* Result card */}
      {status === "done" && result && (
        <div className="mt-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-white)] px-4 py-3">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-[var(--color-ink)]">
                {result.title || result.filename}
              </p>
              <p className="mt-0.5 text-xs text-[var(--color-ink-faint)]">
                {result.filename} · {formatBytes(result.byteSize)}
              </p>
              {result.savedToKb && (
                <p className="mt-1 text-xs font-medium text-emerald-600">
                  ✓ Saved to Knowledge Base
                </p>
              )}
              {result.saveError && (
                <p className="mt-1 text-xs text-amber-600">{result.saveError}</p>
              )}
            </div>
            <button
              onClick={() => downloadMarkdown(result.markdown, result.filename)}
              className="shrink-0 rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-1.5 text-xs font-medium text-[var(--color-ink-soft)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] focus:outline-none"
            >
              Download .md
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ArrowDownIcon() {
  return (
    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  );
}

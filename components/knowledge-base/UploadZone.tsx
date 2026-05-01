"use client";

import { useState, useRef } from "react";
import { upload } from "@vercel/blob/client";

interface UploadZoneProps {
  onUploadComplete: () => void;
}

interface FileProgress {
  name: string;
  status: "uploading" | "done" | "error";
  pct: number;
  error?: string;
}

export function UploadZone({ onUploadComplete }: UploadZoneProps) {
  const [dragging, setDragging] = useState(false);
  const [files, setFiles] = useState<FileProgress[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  async function uploadFiles(fileList: File[]) {
    if (fileList.length === 0) return;

    setFiles(fileList.map((f) => ({ name: f.name, status: "uploading", pct: 0 })));

    await Promise.allSettled(
      fileList.map(async (file, i) => {
        try {
          const id = crypto.randomUUID();

          const result = await upload(file.name, file, {
            access: "private",
            handleUploadUrl: "/api/knowledge-base/upload",
            clientPayload: JSON.stringify({ size: file.size, id }),
            onUploadProgress: ({ percentage }) => {
              setFiles((prev) =>
                prev.map((p, idx) => (idx === i ? { ...p, pct: Math.round(percentage) } : p))
              );
            },
          });

          const reg = await fetch("/api/knowledge-base/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id,
              blobUrl: result.url,
              blobPathname: result.pathname,
              contentType: result.contentType,
              size: file.size,
              filename: file.name,
            }),
          });

          if (!reg.ok) {
            const body = await reg.json() as { error?: string };
            throw new Error(body.error ?? "Registration failed");
          }

          setFiles((prev) =>
            prev.map((p, idx) => (idx === i ? { ...p, status: "done", pct: 100 } : p))
          );
        } catch (err) {
          const message = err instanceof Error ? err.message : "Failed";
          setFiles((prev) =>
            prev.map((p, idx) => (idx === i ? { ...p, status: "error", error: message } : p))
          );
        }
      })
    );

    await new Promise((r) => setTimeout(r, 600));
    setFiles([]);
    onUploadComplete();
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    uploadFiles(Array.from(e.dataTransfer.files));
  }

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    uploadFiles(Array.from(e.target.files ?? []));
    e.target.value = "";
  }

  return (
    <div className="mb-6">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={[
          "cursor-pointer rounded-xl border-2 border-dashed px-8 py-10 text-center transition-colors",
          dragging
            ? "border-[var(--color-accent)] bg-[var(--color-accent-bg)]"
            : "border-[var(--color-border-strong)] hover:border-[var(--color-accent)] hover:bg-[var(--color-accent-bg)]",
        ].join(" ")}
      >
        <input ref={inputRef} type="file" multiple className="hidden" onChange={onInputChange} />
        <p className="text-2xl">☁️</p>
        <p className="mt-2 text-sm font-medium text-[var(--color-ink-soft)]">
          Drag & drop files here, or click to browse
        </p>
        <p className="mt-1 text-xs text-[var(--color-ink-faint)]">Any file type · No size limit</p>
      </div>

      {files.length > 0 && (
        <div className="mt-3 space-y-2">
          {files.map((f) => (
            <div
              key={f.name}
              className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-white)] px-4 py-3 text-sm"
            >
              <div className="flex items-center gap-3">
                <span className="shrink-0">
                  {f.status === "done" && <span className="text-green-500">✓</span>}
                  {f.status === "error" && <span className="text-red-500">✗</span>}
                  {f.status === "uploading" && (
                    <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-[var(--color-accent)] border-t-transparent" />
                  )}
                </span>
                <span className="min-w-0 flex-1 truncate text-[var(--color-ink-soft)]">{f.name}</span>
                <span className="shrink-0 text-xs text-[var(--color-ink-faint)]">
                  {f.status === "uploading" ? `${f.pct}%` : f.status === "done" ? "Done" : (f.error ?? "Failed")}
                </span>
              </div>
              {f.status === "uploading" && (
                <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-[var(--color-bg-card)]">
                  <div
                    className="h-full rounded-full bg-[var(--color-accent)] transition-all duration-200"
                    style={{ width: `${f.pct}%` }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

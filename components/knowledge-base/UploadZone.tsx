"use client";

import { useState, useRef, useImperativeHandle, forwardRef } from "react";
import { upload } from "@vercel/blob/client";

export interface UploadZoneHandle {
  open: () => void;
}

interface UploadZoneProps {
  onUploadComplete: () => void;
  userId: string;
  teamId?: string | null;
}

interface FileProgress {
  name: string;
  status: "uploading" | "done" | "error";
  pct: number;
  error?: string;
}

export const UploadZone = forwardRef<UploadZoneHandle, UploadZoneProps>(
  function UploadZone({ onUploadComplete, userId, teamId }, ref) {
  const [dragging, setDragging] = useState(false);
  const [queue, setQueue] = useState<FileProgress[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => ({
    open: () => inputRef.current?.click(),
  }));

  async function uploadFiles(fileList: File[]) {
    if (!fileList.length) return;

    setQueue(fileList.map((f) => ({ name: f.name, status: "uploading", pct: 0 })));

    await Promise.allSettled(
      fileList.map(async (file, i) => {
        try {
          const id = crypto.randomUUID();
          const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
          const blobName = `users/${userId}/files/${id}-${safeName}`;

          const result = await upload(blobName, file, {
            access: "private",
            handleUploadUrl: "/api/knowledge-base/upload",
            clientPayload: JSON.stringify({ size: file.size, id }),
            onUploadProgress: ({ percentage }) => {
              setQueue((prev) =>
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
              teamId: teamId ?? null,
            }),
          });

          if (!reg.ok) {
            const body = await reg.json() as { error?: string };
            throw new Error(body.error ?? "Registration failed");
          }

          setQueue((prev) => prev.map((p, idx) => (idx === i ? { ...p, status: "done", pct: 100 } : p)));
        } catch (err) {
          setQueue((prev) =>
            prev.map((p, idx) =>
              idx === i ? { ...p, status: "error", error: err instanceof Error ? err.message : "Failed" } : p
            )
          );
        }
      })
    );

    await new Promise((r) => setTimeout(r, 800));
    setQueue([]);
    onUploadComplete();
  }

  return (
    <div className="mb-4">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) setDragging(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          uploadFiles(Array.from(e.dataTransfer.files));
        }}
        onClick={() => inputRef.current?.click()}
        className={[
          "cursor-pointer rounded-lg border border-dashed px-4 text-center transition-all duration-200",
          dragging
            ? "border-[var(--color-accent)] bg-[var(--color-accent-bg)] py-8"
            : "border-[var(--color-border-strong)] py-3 hover:border-[var(--color-accent)] hover:bg-[var(--color-accent-bg)]",
        ].join(" ")}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => {
            uploadFiles(Array.from(e.target.files ?? []));
            e.target.value = "";
          }}
        />
        <p className={["text-sm transition-colors", dragging ? "font-medium text-[var(--color-accent)]" : "text-[var(--color-ink-faint)]"].join(" ")}>
          {dragging
            ? "Drop to upload"
            : "Drop files here or click to browse · Any type · No size limit"}
        </p>
      </div>

      {queue.length > 0 && (
        <div className="mt-2 space-y-1.5">
          {queue.map((f) => (
            <div key={f.name} className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-white)] px-3 py-2">
              <div className="flex items-center gap-2 text-sm">
                <StatusIcon status={f.status} />
                <span className="min-w-0 flex-1 truncate text-[var(--color-ink-soft)]">{f.name}</span>
                <span className="shrink-0 text-xs text-[var(--color-ink-faint)]">
                  {f.status === "uploading" ? `${f.pct}%` : f.status === "done" ? "Done" : (f.error ?? "Failed")}
                </span>
              </div>
              {f.status === "uploading" && (
                <div className="mt-1.5 h-0.5 w-full overflow-hidden rounded-full bg-[var(--color-bg-card)]">
                  <div
                    className="h-full rounded-full bg-[var(--color-accent)] transition-all duration-150"
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
});

function StatusIcon({ status }: { status: FileProgress["status"] }) {
  if (status === "done") return <span className="text-sm text-emerald-500">✓</span>;
  if (status === "error") return <span className="text-sm text-red-500">✗</span>;
  return (
    <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-[var(--color-accent)] border-t-transparent" />
  );
}

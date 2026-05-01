"use client";

import { useState, useRef } from "react";
import { upload } from "@vercel/blob/client";

interface UploadZoneProps {
  onUploadComplete: () => void;
}

interface FileProgress {
  name: string;
  progress: "uploading" | "done" | "error";
}

export function UploadZone({ onUploadComplete }: UploadZoneProps) {
  const [dragging, setDragging] = useState(false);
  const [files, setFiles] = useState<FileProgress[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  async function uploadFiles(fileList: File[]) {
    if (fileList.length === 0) return;

    setFiles(fileList.map((f) => ({ name: f.name, progress: "uploading" })));

    await Promise.allSettled(
      fileList.map(async (file, i) => {
        try {
          await upload(file.name, file, {
            access: "public",
            handleUploadUrl: "/api/data-lake/upload",
            clientPayload: JSON.stringify({ size: file.size }),
          });
          setFiles((prev) =>
            prev.map((p, idx) => (idx === i ? { ...p, progress: "done" } : p))
          );
        } catch {
          setFiles((prev) =>
            prev.map((p, idx) => (idx === i ? { ...p, progress: "error" } : p))
          );
        }
      })
    );

    // Give onUploadCompleted callback time to write the .meta.json
    await new Promise((r) => setTimeout(r, 1500));
    setFiles([]);
    onUploadComplete();
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const dropped = Array.from(e.dataTransfer.files);
    uploadFiles(dropped);
  }

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files ?? []);
    uploadFiles(selected);
    e.target.value = "";
  }

  const isUploading = files.some((f) => f.progress === "uploading");

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
        <input
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          onChange={onInputChange}
        />
        <p className="text-2xl">☁️</p>
        <p className="mt-2 text-sm font-medium text-[var(--color-ink-soft)]">
          Drag & drop files here, or click to browse
        </p>
        <p className="mt-1 text-xs text-[var(--color-ink-faint)]">
          Any file type · No size limit
        </p>
      </div>

      {files.length > 0 && (
        <div className="mt-3 space-y-1.5">
          {files.map((f) => (
            <div
              key={f.name}
              className="flex items-center gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-white)] px-4 py-2 text-sm"
            >
              <span className="shrink-0">
                {f.progress === "uploading" && (
                  <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-[var(--color-accent)] border-t-transparent" />
                )}
                {f.progress === "done" && <span className="text-green-500">✓</span>}
                {f.progress === "error" && <span className="text-red-500">✗</span>}
              </span>
              <span className="truncate text-[var(--color-ink-soft)]">{f.name}</span>
              <span className="ml-auto shrink-0 text-xs text-[var(--color-ink-faint)]">
                {f.progress === "uploading" ? "Uploading…" : f.progress === "done" ? "Done" : "Failed"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

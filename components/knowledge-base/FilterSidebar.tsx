"use client";

import type { FileMetadata } from "@/lib/knowledge-base/types";

type TypeGroup = "PDF" | "Image" | "Video" | "Audio" | "Data" | "Text" | "Other";

const TYPE_GROUPS: TypeGroup[] = ["PDF", "Image", "Video", "Audio", "Data", "Text", "Other"];

function getTypeGroup(contentType: string): TypeGroup {
  if (contentType.includes("pdf")) return "PDF";
  if (contentType.startsWith("image/")) return "Image";
  if (contentType.startsWith("video/")) return "Video";
  if (contentType.startsWith("audio/")) return "Audio";
  if (contentType.includes("json") || contentType.includes("yaml") || contentType.includes("xml")) return "Data";
  if (contentType.startsWith("text/")) return "Text";
  return "Other";
}

interface FilterSidebarProps {
  files: FileMetadata[];
  allTags: string[];
  selectedTags: string[];
  typeFilter: string;
  onTagsChange: (tags: string[]) => void;
  onTypeChange: (type: string) => void;
  onShareTag?: (tag: string) => void;
}

export function FilterSidebar({ files, allTags, selectedTags, typeFilter, onTagsChange, onTypeChange, onShareTag }: FilterSidebarProps) {
  const typeCounts = TYPE_GROUPS.reduce<Record<TypeGroup, number>>((acc, t) => {
    acc[t] = files.filter((f) => getTypeGroup(f.contentType) === t).length;
    return acc;
  }, {} as Record<TypeGroup, number>);

  const activeTypes = TYPE_GROUPS.filter((t) => typeCounts[t] > 0);
  const isAllActive = typeFilter === "all" && selectedTags.length === 0;

  function toggleTag(tag: string) {
    onTagsChange(
      selectedTags.includes(tag) ? selectedTags.filter((t) => t !== tag) : [...selectedTags, tag]
    );
  }

  function toggleType(type: string) {
    onTypeChange(typeFilter === type ? "all" : type);
  }

  return (
    <aside className="w-44 shrink-0">
      <div className="sticky top-8 space-y-4">
        {/* All */}
        <div>
          <button onClick={() => { onTagsChange([]); onTypeChange("all"); }} className={btn(isAllActive)}>
            <span>All files</span>
            <span className="text-xs text-[var(--color-ink-faint)]">{files.length}</span>
          </button>
        </div>

        {/* File type */}
        {activeTypes.length > 0 && (
          <div className="space-y-0.5">
            <p className="px-3 pb-1 text-xs font-semibold uppercase tracking-wider text-[var(--color-ink-faint)]">Type</p>
            {activeTypes.map((type) => (
              <button key={type} onClick={() => toggleType(type)} className={btn(typeFilter === type)}>
                <span className="flex items-center gap-2">
                  <TypeDot type={type} />
                  {type}
                </span>
                <span className="text-xs text-[var(--color-ink-faint)]">{typeCounts[type]}</span>
              </button>
            ))}
          </div>
        )}

        {/* Tags */}
        {allTags.length > 0 && (
          <div>
            <p className="px-1 pb-2 text-xs font-semibold uppercase tracking-wider text-[var(--color-ink-faint)]">Tags</p>
            <div className="flex flex-wrap gap-1.5">
              {allTags.map((tag) => {
                const count = files.filter((f) => f.tags.includes(tag)).length;
                const isActive = selectedTags.includes(tag);
                return (
                  <div key={tag} className="group relative">
                    <button
                      onClick={() => toggleTag(tag)}
                      className={[
                        "flex items-center gap-1 rounded-full px-2.5 py-1 text-xs transition-colors",
                        isActive
                          ? "bg-[var(--color-accent-bg)] font-semibold text-[var(--color-accent)]"
                          : "bg-[var(--color-bg-card)] text-[var(--color-ink-soft)] hover:bg-[var(--color-border)]",
                      ].join(" ")}
                    >
                      <span className="max-w-[72px] truncate">{tag}</span>
                      <span className="text-[10px] opacity-50">{count}</span>
                    </button>
                    {onShareTag && (
                      <button
                        onClick={(e) => { e.stopPropagation(); onShareTag(tag); }}
                        className="absolute -right-1 -top-1 hidden h-4 w-4 items-center justify-center rounded-full bg-[var(--color-accent)] text-white group-hover:flex"
                        title={`Share "${tag}" files with a team`}
                      >
                        <ShareIcon />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}

function btn(active: boolean): string {
  return [
    "w-full flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors",
    active
      ? "bg-[var(--color-accent-bg)] font-semibold text-[var(--color-accent)]"
      : "text-[var(--color-ink-soft)] hover:bg-[var(--color-bg-card)]",
  ].join(" ");
}

function ShareIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" />
    </svg>
  );
}

function TypeDot({ type }: { type: TypeGroup }) {
  const colors: Record<TypeGroup, string> = {
    PDF: "bg-red-400",
    Image: "bg-blue-400",
    Video: "bg-orange-400",
    Audio: "bg-pink-400",
    Data: "bg-green-400",
    Text: "bg-slate-400",
    Other: "bg-gray-400",
  };
  return <span className={`inline-block h-1.5 w-1.5 rounded-full ${colors[type]}`} />;
}

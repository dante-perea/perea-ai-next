"use client";

import { TagChip } from "./TagChip";
import type { FileMetadata } from "@/lib/data-lake/types";

interface TagSidebarProps {
  allTags: string[];
  selectedTags: string[];
  files: FileMetadata[];
  onChange: (tags: string[]) => void;
}

export function TagSidebar({ allTags, selectedTags, files, onChange }: TagSidebarProps) {
  const totalCount = files.length;

  function toggle(tag: string) {
    if (selectedTags.includes(tag)) {
      onChange(selectedTags.filter((t) => t !== tag));
    } else {
      onChange([...selectedTags, tag]);
    }
  }

  function countForTag(tag: string) {
    return files.filter((f) => f.tags.includes(tag)).length;
  }

  return (
    <aside className="w-48 shrink-0">
      <div className="sticky top-8 space-y-1">
        <button
          onClick={() => onChange([])}
          className={[
            "w-full flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors",
            selectedTags.length === 0
              ? "bg-[var(--color-accent-bg)] font-semibold text-[var(--color-accent)]"
              : "text-[var(--color-ink-soft)] hover:bg-[var(--color-bg-card)]",
          ].join(" ")}
        >
          <span>All files</span>
          <span className="text-xs text-[var(--color-ink-faint)]">{totalCount}</span>
        </button>

        {allTags.length > 0 && (
          <div className="pt-2">
            <p className="px-3 pb-1 text-xs font-medium uppercase tracking-wider text-[var(--color-ink-faint)]">
              Tags
            </p>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => toggle(tag)}
                className={[
                  "w-full flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors",
                  selectedTags.includes(tag)
                    ? "bg-[var(--color-accent-bg)] font-semibold text-[var(--color-accent)]"
                    : "text-[var(--color-ink-soft)] hover:bg-[var(--color-bg-card)]",
                ].join(" ")}
              >
                <span className="truncate">{tag}</span>
                <span className="ml-1 shrink-0 text-xs text-[var(--color-ink-faint)]">
                  {countForTag(tag)}
                </span>
              </button>
            ))}
          </div>
        )}

        {selectedTags.length > 0 && (
          <button
            onClick={() => onChange([])}
            className="mt-2 w-full rounded-lg px-3 py-1.5 text-xs text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] transition-colors"
          >
            Clear filters
          </button>
        )}
      </div>
    </aside>
  );
}

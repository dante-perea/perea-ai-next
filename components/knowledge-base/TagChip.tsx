"use client";

interface TagChipProps {
  label: string;
  onRemove?: () => void;
  onClick?: () => void;
  active?: boolean;
}

export function TagChip({ label, onRemove, onClick, active }: TagChipProps) {
  return (
    <span
      onClick={onClick}
      className={[
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium transition-colors",
        onClick ? "cursor-pointer" : "",
        active
          ? "bg-[var(--color-accent)] text-white"
          : "bg-[var(--color-accent-bg)] text-[var(--color-accent)]",
      ].join(" ")}
    >
      {label}
      {onRemove && (
        <button
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          className="ml-0.5 leading-none opacity-50 transition-opacity hover:opacity-100"
          aria-label={`Remove tag ${label}`}
        >
          ×
        </button>
      )}
    </span>
  );
}

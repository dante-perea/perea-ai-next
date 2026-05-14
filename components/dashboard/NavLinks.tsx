"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/dashboard", label: "Knowledge Base" },
  { href: "/dashboard/research", label: "Research" },
  { href: "/dashboard/mcp", label: "MCP" },
  { href: "/dashboard/experiments", label: "Loop" },
];

export function NavLinks() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-1">
      {links.map(({ href, label }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={[
              "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              active
                ? "bg-[var(--color-accent-bg)] text-[var(--color-accent)]"
                : "text-[var(--color-ink-muted)] hover:bg-[var(--color-bg-card)] hover:text-[var(--color-ink)]",
            ].join(" ")}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

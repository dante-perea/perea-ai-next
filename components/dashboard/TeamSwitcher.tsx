"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { TeamRole } from "@/lib/knowledge-base/teams";

interface TeamEntry {
  id: string;
  name: string;
  role: TeamRole;
}

interface TeamSwitcherProps {
  teams: TeamEntry[];
}

export function TeamSwitcher({ teams }: TeamSwitcherProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTeamId = searchParams.get("team");

  const [open, setOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [saving, setSaving] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const currentTeam = teams.find((t) => t.id === currentTeamId);
  const label = currentTeam ? currentTeam.name : "Personal";

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setCreating(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function select(teamId: string | null) {
    setOpen(false);
    setCreating(false);
    if (teamId) {
      router.push(`/dashboard?team=${teamId}`);
    } else {
      router.push("/dashboard");
    }
  }

  async function createTeam(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim()) return;
    setSaving(true);
    try {
      const res = await fetch("/api/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName.trim() }),
      });
      const team = await res.json() as { id: string };
      setNewName("");
      setCreating(false);
      setOpen(false);
      router.push(`/dashboard?team=${team.id}`);
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => { setOpen((o) => !o); setCreating(false); }}
        className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-medium text-[var(--color-ink-muted)] transition-colors hover:bg-[var(--color-bg-card)] hover:text-[var(--color-ink)]"
      >
        {currentTeam && (
          <span className="h-2 w-2 rounded-full bg-[var(--color-accent)]" />
        )}
        {label}
        <ChevronIcon />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 w-56 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-white)] py-1 shadow-lg">
          <button
            onClick={() => select(null)}
            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-[var(--color-ink)] hover:bg-[var(--color-bg-card)]"
          >
            <span className={`h-2 w-2 rounded-full ${!currentTeamId ? "bg-[var(--color-accent)]" : "bg-transparent border border-[var(--color-border-strong)]"}`} />
            Personal
          </button>

          {teams.length > 0 && (
            <div className="my-1 border-t border-[var(--color-border)]" />
          )}

          {teams.map((team) => (
            <div key={team.id} className="flex items-center">
              <button
                onClick={() => select(team.id)}
                className="flex flex-1 items-center gap-2 px-3 py-2 text-sm text-[var(--color-ink)] hover:bg-[var(--color-bg-card)]"
              >
                <span className={`h-2 w-2 rounded-full ${currentTeamId === team.id ? "bg-[var(--color-accent)]" : "bg-transparent border border-[var(--color-border-strong)]"}`} />
                <span className="flex-1 truncate text-left">{team.name}</span>
                <span className="text-[10px] font-medium uppercase text-[var(--color-ink-faint)]">{team.role}</span>
              </button>
              <a
                href={`/dashboard/teams/${team.id}`}
                onClick={() => setOpen(false)}
                className="px-2 py-2 text-xs text-[var(--color-ink-faint)] hover:text-[var(--color-accent)]"
                title="Manage team"
              >
                ⚙
              </a>
            </div>
          ))}

          <div className="my-1 border-t border-[var(--color-border)]" />

          {creating ? (
            <form onSubmit={createTeam} className="px-3 py-2">
              <input
                autoFocus
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Team name"
                className="w-full rounded border border-[var(--color-border)] bg-[var(--color-bg-card)] px-2 py-1 text-sm text-[var(--color-ink)] focus:border-[var(--color-accent)] focus:outline-none"
              />
              <div className="mt-2 flex gap-1.5">
                <button
                  type="submit"
                  disabled={saving || !newName.trim()}
                  className="flex-1 rounded bg-[var(--color-accent)] px-2 py-1 text-xs font-medium text-white disabled:opacity-50"
                >
                  {saving ? "Creating…" : "Create"}
                </button>
                <button
                  type="button"
                  onClick={() => setCreating(false)}
                  className="rounded px-2 py-1 text-xs text-[var(--color-ink-muted)] hover:bg-[var(--color-bg-card)]"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => setCreating(true)}
              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-[var(--color-ink-muted)] hover:bg-[var(--color-bg-card)]"
            >
              <span className="text-base leading-none">+</span>
              Create team
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function ChevronIcon() {
  return (
    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

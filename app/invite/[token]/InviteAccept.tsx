"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  token: string;
  teamId: string;
  teamName: string;
}

export function InviteAccept({ token, teamId }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function accept() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/teams/invite/${token}`, { method: "POST" });
      if (!res.ok) {
        const body = await res.json() as { error?: string };
        throw new Error(body.error ?? "Failed to accept invite");
      }
      router.push(`/dashboard?team=${teamId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
      )}
      <button
        onClick={accept}
        disabled={loading}
        className="w-full rounded-lg bg-[var(--color-accent)] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[var(--color-accent-hover)] disabled:opacity-60"
      >
        {loading ? "Joining…" : "Accept Invite"}
      </button>
      <a
        href="/dashboard"
        className="block text-center text-sm text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
      >
        Maybe later
      </a>
    </div>
  );
}

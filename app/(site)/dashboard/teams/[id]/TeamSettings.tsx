"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Team, TeamMember, TeamRole, TeamInvite } from "@/lib/knowledge-base/teams";

interface MemberWithEmail extends TeamMember {
  email: string;
}

interface Props {
  team: Team;
  members: MemberWithEmail[];
  pendingInvites: TeamInvite[];
  currentUserId: string;
  currentRole: TeamRole;
}

export function TeamSettings({
  team,
  members: initialMembers,
  pendingInvites: initialInvites,
  currentUserId,
  currentRole,
}: Props) {
  const router = useRouter();
  const [members, setMembers] = useState(initialMembers);
  const [invites, setInvites] = useState(initialInvites);
  const [inviteRole, setInviteRole] = useState<"editor" | "viewer">("viewer");
  const [inviteUrl, setInviteUrl] = useState<string | null>(null);
  const [generatingInvite, setGeneratingInvite] = useState(false);
  const [copied, setCopied] = useState(false);
  const [deletingTeam, setDeletingTeam] = useState(false);

  const isOwner = currentRole === "owner";

  async function generateInvite() {
    setGeneratingInvite(true);
    setInviteUrl(null);
    try {
      const res = await fetch(`/api/teams/${team.id}/invite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: inviteRole }),
      });
      const data = await res.json() as { url?: string; token?: string; role?: TeamRole; expiresAt?: string; createdAt?: string; invitedBy?: string; teamId?: string; acceptedBy?: null; acceptedAt?: null };
      if (data.url) {
        setInviteUrl(data.url);
        // Optimistically add to pending list
        if (data.token) {
          setInvites((prev) => [data as unknown as TeamInvite, ...prev]);
        }
      }
    } finally {
      setGeneratingInvite(false);
    }
  }

  function copyInvite() {
    if (!inviteUrl) return;
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function changeRole(userId: string, role: "editor" | "viewer") {
    await fetch(`/api/teams/${team.id}/members/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    setMembers((prev) => prev.map((m) => m.userId === userId ? { ...m, role } : m));
  }

  async function removeMember(userId: string) {
    const isSelf = userId === currentUserId;
    const confirmed = confirm(isSelf ? "Leave this team?" : "Remove this member?");
    if (!confirmed) return;
    await fetch(`/api/teams/${team.id}/members/${userId}`, { method: "DELETE" });
    if (isSelf) {
      router.push("/dashboard");
    } else {
      setMembers((prev) => prev.filter((m) => m.userId !== userId));
    }
  }

  async function revokeInvite(token: string) {
    if (!confirm("Revoke this invite link?")) return;
    await fetch(`/api/teams/${team.id}/invite/${token}`, { method: "DELETE" });
    setInvites((prev) => prev.filter((i) => i.token !== token));
    if (inviteUrl?.includes(token)) setInviteUrl(null);
  }

  async function deleteTeam() {
    if (!confirm(`Delete "${team.name}"? All files will be permanently deleted.`)) return;
    setDeletingTeam(true);
    await fetch(`/api/teams/${team.id}`, { method: "DELETE" });
    router.push("/dashboard");
  }

  return (
    <div className="space-y-6">
      {/* Members */}
      <section className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-white)]">
        <div className="border-b border-[var(--color-border)] px-5 py-4">
          <h2 className="text-sm font-semibold text-[var(--color-ink)]">Members</h2>
        </div>
        <div className="divide-y divide-[var(--color-border)]">
          {members.map((member) => (
            <div key={member.userId} className="flex items-center justify-between px-5 py-3">
              <div>
                <p className="text-sm text-[var(--color-ink)]">{member.email}</p>
                {member.userId === currentUserId && (
                  <p className="text-xs text-[var(--color-ink-faint)]">You</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                {isOwner && member.role !== "owner" ? (
                  <select
                    value={member.role}
                    onChange={(e) => changeRole(member.userId, e.target.value as "editor" | "viewer")}
                    className="rounded border border-[var(--color-border)] bg-[var(--color-bg-card)] px-2 py-1 text-xs text-[var(--color-ink)]"
                  >
                    <option value="editor">Editor</option>
                    <option value="viewer">Viewer</option>
                  </select>
                ) : (
                  <span className="rounded bg-[var(--color-bg-card)] px-2 py-1 text-xs font-medium capitalize text-[var(--color-ink-muted)]">
                    {member.role}
                  </span>
                )}
                {((isOwner && member.role !== "owner") || member.userId === currentUserId) && (
                  <button
                    onClick={() => removeMember(member.userId)}
                    className="text-xs text-[var(--color-ink-faint)] hover:text-red-500 transition-colors"
                  >
                    {member.userId === currentUserId ? "Leave" : "Remove"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Invite */}
      {isOwner && (
        <section className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-white)] px-5 py-4">
          <h2 className="mb-3 text-sm font-semibold text-[var(--color-ink)]">Invite a member</h2>
          <div className="flex items-center gap-2">
            <select
              value={inviteRole}
              onChange={(e) => { setInviteRole(e.target.value as "editor" | "viewer"); setInviteUrl(null); }}
              className="rounded border border-[var(--color-border)] bg-[var(--color-bg-card)] px-2 py-1.5 text-sm text-[var(--color-ink)]"
            >
              <option value="viewer">Viewer</option>
              <option value="editor">Editor</option>
            </select>
            <button
              onClick={generateInvite}
              disabled={generatingInvite}
              className="rounded-lg bg-[var(--color-accent)] px-3 py-1.5 text-sm font-medium text-white hover:bg-[var(--color-accent-hover)] disabled:opacity-60"
            >
              {generatingInvite ? "Generating…" : "Generate invite link"}
            </button>
          </div>
          {inviteUrl && (
            <div className="mt-3 flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-card)] px-3 py-2">
              <span className="flex-1 truncate font-mono text-xs text-[var(--color-ink-soft)]">{inviteUrl}</span>
              <button onClick={copyInvite} className="shrink-0 text-xs text-[var(--color-accent)] hover:underline">
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          )}
          <p className="mt-2 text-xs text-[var(--color-ink-faint)]">Links expire in 7 days and are single-use.</p>

          {/* Pending invites */}
          {invites.length > 0 && (
            <div className="mt-4">
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-[var(--color-ink-faint)]">
                Pending ({invites.length})
              </p>
              <div className="space-y-1.5">
                {invites.map((inv) => (
                  <div
                    key={inv.token}
                    className="flex items-center justify-between rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-card)] px-3 py-2"
                  >
                    <div>
                      <span className="text-xs font-medium capitalize text-[var(--color-ink-soft)]">{inv.role}</span>
                      <span className="ml-2 text-xs text-[var(--color-ink-faint)]">
                        expires {new Date(inv.expiresAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </span>
                    </div>
                    <button
                      onClick={() => revokeInvite(inv.token)}
                      className="text-xs text-[var(--color-ink-faint)] hover:text-red-500 transition-colors"
                    >
                      Revoke
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* Danger zone */}
      {isOwner && (
        <section className="rounded-xl border border-red-200 bg-red-50 px-5 py-4">
          <h2 className="mb-1 text-sm font-semibold text-red-700">Danger zone</h2>
          <p className="mb-3 text-xs text-red-600">
            Deleting the team permanently removes it and all files uploaded to it.
          </p>
          <button
            onClick={deleteTeam}
            disabled={deletingTeam}
            className="rounded-lg border border-red-300 bg-white px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-60"
          >
            {deletingTeam ? "Deleting…" : "Delete team"}
          </button>
        </section>
      )}
    </div>
  );
}

import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getTeam, getTeamRole, listTeamMembers, listPendingInvites } from "@/lib/knowledge-base/teams";
import { TeamSettings } from "./TeamSettings";

export const dynamic = "force-dynamic";

export default async function TeamPage({ params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) redirect("/login");

  const { id } = await params;
  const [team, role, members, pendingInvites] = await Promise.all([
    getTeam(id).catch(() => null),
    getTeamRole(id, userId).catch(() => null),
    listTeamMembers(id).catch(() => []),
    listPendingInvites(id).catch(() => []),
  ]);

  if (!team || !role) redirect("/dashboard");

  // Resolve Clerk user identities for all members
  const client = await clerkClient();
  const clerkUsers = members.length > 0
    ? await client.users.getUserList({ userId: members.map((m) => m.userId), limit: 100 }).catch(() => ({ data: [] }))
    : { data: [] };

  const userMap = new Map(clerkUsers.data.map((u) => [
    u.id,
    u.emailAddresses[0]?.emailAddress ?? u.id,
  ]));

  const membersWithEmail = members.map((m) => ({
    ...m,
    email: userMap.get(m.userId) ?? m.userId,
  }));

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--color-ink)]">{team.name}</h1>
        <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
          {members.length} {members.length === 1 ? "member" : "members"} · Your role:{" "}
          <span className="font-medium capitalize">{role}</span>
        </p>
      </div>
      <TeamSettings
        team={team}
        members={membersWithEmail}
        pendingInvites={pendingInvites}
        currentUserId={userId}
        currentRole={role}
      />
    </div>
  );
}

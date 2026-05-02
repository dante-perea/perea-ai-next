import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { listPersonalFiles, listTeamFiles } from "@/lib/knowledge-base/meta";
import { getTeamRole, getTeam } from "@/lib/knowledge-base/teams";
import { KnowledgeBaseClient } from "@/components/knowledge-base/KnowledgeBaseClient";
import type { TeamRole } from "@/lib/knowledge-base/teams";

export const dynamic = "force-dynamic";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ team?: string }>;
}) {
  const { userId, sessionClaims } = await auth();
  const email = (sessionClaims?.email as string | undefined) ?? "";
  const { team: teamId } = await searchParams;

  if (teamId) {
    if (!userId) redirect("/login");

    const role = await getTeamRole(teamId, userId).catch(() => null);
    if (!role) redirect("/dashboard"); // not a member

    const team = await getTeam(teamId).catch(() => null);
    if (!team) redirect("/dashboard");

    const files = await listTeamFiles(teamId).catch(() => []);

    return (
      <KnowledgeBaseClient
        files={files}
        currentUser={email}
        userId={userId}
        teamId={teamId}
        teamName={team.name}
        userRole={role as TeamRole}
      />
    );
  }

  const files = userId ? await listPersonalFiles({ userId }).catch(() => []) : [];
  return (
    <KnowledgeBaseClient
      files={files}
      currentUser={email}
      userId={userId ?? ""}
      teamId={null}
      teamName={null}
      userRole={null}
    />
  );
}

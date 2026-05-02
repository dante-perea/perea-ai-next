import { auth } from "@clerk/nextjs/server";
import { getInvite, getTeam } from "@/lib/knowledge-base/teams";
import { InviteAccept } from "./InviteAccept";

export default async function InvitePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const invite = await getInvite(token).catch(() => null);

  if (!invite) {
    return <InviteError message="This invite link is invalid." />;
  }
  if (invite.acceptedAt) {
    return <InviteError message="This invite has already been used." />;
  }
  if (new Date(invite.expiresAt) < new Date()) {
    return <InviteError message="This invite has expired." />;
  }

  const team = await getTeam(invite.teamId).catch(() => null);
  if (!team) return <InviteError message="Team not found." />;

  const { userId, redirectToSignIn } = await auth();

  if (!userId) {
    return redirectToSignIn({ returnBackUrl: `/invite/${token}` });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg)] px-4">
      <div className="w-full max-w-md rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-white)] p-8 shadow-sm">
        <div className="mb-6 text-center">
          <span className="font-mono text-xs font-medium uppercase tracking-widest text-[var(--color-ink-muted)]">
            perea.ai
          </span>
          <h1 className="mt-4 text-xl font-semibold text-[var(--color-ink)]">
            You&apos;re invited to join
          </h1>
          <p className="mt-1 text-2xl font-bold text-[var(--color-ink)]">{team.name}</p>
          <p className="mt-2 text-sm text-[var(--color-ink-muted)]">
            You&apos;ll join as a <span className="font-medium capitalize">{invite.role}</span>
          </p>
        </div>
        <InviteAccept token={token} teamId={team.id} teamName={team.name} />
      </div>
    </div>
  );
}

function InviteError({ message }: { message: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg)] px-4">
      <div className="w-full max-w-md rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-white)] p-8 text-center shadow-sm">
        <p className="text-sm text-[var(--color-ink-muted)]">{message}</p>
        <a href="/dashboard" className="mt-4 inline-block text-sm text-[var(--color-accent)] hover:underline">
          Go to dashboard
        </a>
      </div>
    </div>
  );
}

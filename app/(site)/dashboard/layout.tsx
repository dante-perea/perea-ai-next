import { auth } from "@clerk/nextjs/server";
import { Show, UserButton } from "@clerk/nextjs";
import { NavLinks } from "@/components/dashboard/NavLinks";
import { TeamSwitcher } from "@/components/dashboard/TeamSwitcher";
import { listTeamsForUser } from "@/lib/knowledge-base/teams";
import { Suspense } from "react";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth();
  const teams = userId ? await listTeamsForUser(userId).catch(() => []) : [];

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <header className="flex items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-bg-white)] px-6 py-3">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-medium text-[var(--color-ink-muted)] uppercase tracking-widest">
            perea.ai
          </span>
          <span className="text-[var(--color-border-strong)]">/</span>
          <NavLinks />
          <span className="text-[var(--color-border-strong)]">/</span>
          <Suspense fallback={null}>
            <TeamSwitcher teams={teams} />
          </Suspense>
        </div>
        <Show when="signed-in">
          <UserButton />
        </Show>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-8">
        {children}
      </main>
    </div>
  );
}

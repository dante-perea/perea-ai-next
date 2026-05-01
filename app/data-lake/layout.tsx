import { Show, UserButton } from "@clerk/nextjs";

export default function DataLakeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <header className="flex items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-bg-white)] px-6 py-3">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs font-medium text-[var(--color-ink-muted)] uppercase tracking-widest">
            perea.ai
          </span>
          <span className="text-[var(--color-border-strong)]">/</span>
          <span className="text-sm font-semibold text-[var(--color-ink)]">Data Lake</span>
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

import type { Metadata } from "next";
import { getPublicProjects, type PublicProject } from "@/lib/dante/gbrain";
import { getDailyActivity, type DayActivity } from "@/lib/dante/activity";

export const metadata: Metadata = {
  title: "Dante Perea — Working notebook",
  description:
    "Current projects and the cadence of the work, from the gbrain knowledge base.",
};

// Snapshot rebuild every hour. The brain changes when Dante writes; the timeline
// changes when experiments fire. Hourly is plenty for a public page.
export const revalidate = 3600;

function formatDayHeading(iso: string): string {
  // iso = YYYY-MM-DD; build a Date at noon UTC to dodge timezone day flips.
  const d = new Date(`${iso}T12:00:00Z`);
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function activityLine(d: DayActivity): string {
  const parts: string[] = [];
  if (d.experiments_started > 0) parts.push(`${d.experiments_started} started`);
  if (d.experiments_closed > 0) parts.push(`${d.experiments_closed} closed`);
  if (d.signals > 0) parts.push(`${d.signals} ${d.signals === 1 ? "signal" : "signals"}`);
  return parts.join(" · ");
}

function ProjectBlock({ p }: { p: PublicProject }) {
  return (
    <article className="border-t border-[var(--color-border)] pt-8 mt-8 first:mt-0 first:border-t-0 first:pt-0">
      <h3 className="font-serif text-2xl text-[var(--color-ink)] leading-tight">
        {p.name}
      </h3>
      {p.tagline && (
        <p className="font-serif text-base italic text-[var(--color-ink-soft)] mt-1">
          {p.tagline}
        </p>
      )}
      <div className="mt-4">
        {p.public_status === "public" && p.body ? (
          <div className="font-serif text-[15px] leading-[1.75] text-[var(--color-ink)] whitespace-pre-wrap">
            {p.body}
          </div>
        ) : (
          <p className="font-mono text-xs uppercase tracking-widest text-[var(--color-ink-muted)]">
            [protected]
          </p>
        )}
      </div>
    </article>
  );
}

function TimelineDay({ d }: { d: DayActivity }) {
  return (
    <li className="relative pl-10 pb-12 last:pb-0">
      {/* Dot */}
      <span
        aria-hidden
        className="absolute left-[7px] top-2 h-3 w-3 rounded-full bg-[var(--color-ink)]"
      />
      <h3 className="font-serif text-xl text-[var(--color-ink)]">
        {formatDayHeading(d.date)}
      </h3>
      <p className="font-serif text-sm text-[var(--color-ink-muted)] mt-1">
        {activityLine(d)}
      </p>
    </li>
  );
}

export default async function DantePage() {
  const [projects, days] = await Promise.all([
    getPublicProjects().catch((err) => {
      console.error("[/dante] gbrain query failed", err);
      return [] as PublicProject[];
    }),
    getDailyActivity(30).catch((err) => {
      console.error("[/dante] activity query failed", err);
      return [] as DayActivity[];
    }),
  ]);

  return (
    <main className="min-h-screen bg-[var(--color-bg)]">
      <div className="mx-auto max-w-2xl px-6 py-20">
        {/* Header */}
        <header className="mb-16">
          <p className="font-mono text-xs uppercase tracking-widest text-[var(--color-ink-muted)]">
            perea.ai · working notebook
          </p>
          <h1 className="font-serif text-4xl mt-3 text-[var(--color-ink)]">
            Dante Perea
          </h1>
          <p className="font-serif text-lg italic text-[var(--color-ink-soft)] mt-2">
            What I'm working on, and the cadence of the work.
          </p>
        </header>

        {/* Projects */}
        <section className="mb-20">
          <h2 className="font-mono text-xs uppercase tracking-widest text-[var(--color-ink-muted)] mb-6">
            Current projects
          </h2>
          {projects.length === 0 ? (
            <p className="font-serif text-base italic text-[var(--color-ink-muted)]">
              No public projects right now.
            </p>
          ) : (
            <div>
              {projects.map((p) => (
                <ProjectBlock key={p.slug} p={p} />
              ))}
            </div>
          )}
        </section>

        {/* Updates timeline */}
        <section>
          <h2 className="font-mono text-xs uppercase tracking-widest text-[var(--color-ink-muted)] mb-8">
            Updates
          </h2>
          {days.length === 0 ? (
            <p className="font-serif text-base italic text-[var(--color-ink-muted)]">
              No activity in the last 30 days.
            </p>
          ) : (
            <ol className="relative border-l border-[var(--color-border-strong)] ml-[6px]">
              {days.map((d) => (
                <TimelineDay key={d.date} d={d} />
              ))}
            </ol>
          )}
        </section>

        <footer className="mt-24 pt-8 border-t border-[var(--color-border)]">
          <p className="font-mono text-[11px] uppercase tracking-widest text-[var(--color-ink-faint)]">
            Snapshot · refreshes hourly · sensitive content shown as [protected]
          </p>
        </footer>
      </div>
    </main>
  );
}

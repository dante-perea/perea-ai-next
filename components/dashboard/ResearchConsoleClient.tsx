"use client";

import { useState, useTransition, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type {
  RoadmapEntry,
  XQueueEntry,
  Seed,
  RemovalReasonCategory,
} from "@/lib/operator-state";

interface PublishedPaper {
  slug: string;
  title: string;
  date: string;
  subtitle: string;
}

interface Props {
  activeTab: "backlog" | "published";
  roadmap: RoadmapEntry[];
  shipped: RoadmapEntry[];
  xQueue: XQueueEntry[];
  seeds: Seed[];
  published: PublishedPaper[];
  isOperator: boolean;
  operatorEmailConfigured: boolean;
  currentEmail: string;
}

export function ResearchConsoleClient(props: Props) {
  const {
    activeTab,
    roadmap,
    shipped,
    xQueue,
    seeds,
    published,
    isOperator,
    operatorEmailConfigured,
    currentEmail,
  } = props;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--color-ink)]">
          Research engine console
        </h1>
        <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
          Operator view onto the perea-research-engine roadmap, the X-post
          engine queue, and the published-paper corpus. Reads from Neon
          (engine-populated mirror). Seeds enter the engine&apos;s derive pass
          on its next tick.
        </p>
      </div>

      <div className="flex gap-1 border-b border-[var(--color-border)]">
        <TabLink href="/dashboard/research" active={activeTab === "backlog"}>
          Backlog
        </TabLink>
        <TabLink
          href="/dashboard/research?tab=published"
          active={activeTab === "published"}
        >
          Published ({published.length})
        </TabLink>
      </div>

      {activeTab === "backlog" ? (
        <BacklogTab
          roadmap={roadmap}
          shipped={shipped}
          xQueue={xQueue}
          seeds={seeds}
        />
      ) : (
        <PublishedTab
          published={published}
          xQueue={xQueue}
          isOperator={isOperator}
          operatorEmailConfigured={operatorEmailConfigured}
          currentEmail={currentEmail}
        />
      )}
    </div>
  );
}

function TabLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={[
        "rounded-t-md px-4 py-2 text-sm font-medium transition-colors",
        active
          ? "border-b-2 border-[var(--color-accent)] text-[var(--color-accent)]"
          : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]",
      ].join(" ")}
    >
      {children}
    </Link>
  );
}

// ─── Backlog tab ────────────────────────────────────────────────────────────

function BacklogTab({
  roadmap,
  shipped,
  xQueue,
  seeds,
}: {
  roadmap: RoadmapEntry[];
  shipped: RoadmapEntry[];
  xQueue: XQueueEntry[];
  seeds: Seed[];
}) {
  return (
    <div className="space-y-8">
      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--color-ink-muted)]">
          Seed an idea
        </h2>
        <SeedForm />
        {seeds.length > 0 && (
          <div className="mt-4">
            <h3 className="mb-2 text-xs font-medium uppercase tracking-wide text-[var(--color-ink-muted)]">
              Recent seeds
            </h3>
            <ul className="space-y-2">
              {seeds.map((s) => (
                <li
                  key={s.id}
                  className="rounded-md border border-[var(--color-border)] bg-[var(--color-bg-white)] p-3 text-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className="text-[var(--color-ink)]">{s.idea}</p>
                      {s.sourceUrl && (
                        <a
                          href={s.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1 inline-block text-xs text-[var(--color-accent)] underline"
                        >
                          {s.sourceUrl}
                        </a>
                      )}
                    </div>
                    <SeedStatusBadge seed={s} />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--color-ink-muted)]">
          Research roadmap{" "}
          <span className="font-normal text-[var(--color-ink-muted)]">
            ({roadmap.length} active)
          </span>
        </h2>
        {roadmap.length === 0 ? (
          <EmptyState
            title="No roadmap entries in Neon yet"
            body="The perea-research-engine populates this when its sync code lands. Until then the engine continues to ship from local roadmap.json — this view will fill in once it writes back to Neon."
          />
        ) : (
          <ul className="space-y-2">
            {roadmap.map((r) => (
              <li
                key={r.slug}
                className="rounded-md border border-[var(--color-border)] bg-[var(--color-bg-white)] p-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-xs">
                      <TierBadge tier={r.tier} />
                      {r.priority !== null && (
                        <span className="text-[var(--color-ink-muted)]">
                          P{r.priority}
                        </span>
                      )}
                      <StatusBadge status={r.status} />
                      {r.category && (
                        <span className="text-[var(--color-ink-muted)]">
                          {r.category}
                        </span>
                      )}
                    </div>
                    <h3 className="mt-1 text-sm font-medium text-[var(--color-ink)]">
                      {r.title}
                    </h3>
                    {r.subtitleSeed && (
                      <p className="mt-0.5 text-xs text-[var(--color-ink-muted)]">
                        {r.subtitleSeed}
                      </p>
                    )}
                  </div>
                  <code className="text-xs text-[var(--color-ink-muted)]">
                    {r.slug}
                  </code>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--color-ink-muted)]">
          X queue{" "}
          <span className="font-normal text-[var(--color-ink-muted)]">
            ({xQueue.length} scheduled)
          </span>
        </h2>
        {xQueue.length === 0 ? (
          <EmptyState
            title="No scheduled X posts in Neon yet"
            body="The tick-X-post-from-research engine populates this when its sync code lands. Until then the engine continues to schedule against omnisocials directly — this view will fill in once it writes back."
          />
        ) : (
          <ul className="space-y-2">
            {xQueue.map((q) => (
              <li
                key={q.omnisocialsPostId}
                className="rounded-md border border-[var(--color-border)] bg-[var(--color-bg-white)] p-3 text-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <code className="text-xs text-[var(--color-ink)]">{q.slug}</code>
                    <div className="mt-1 text-xs text-[var(--color-ink-muted)]">
                      slot: {formatUtc(q.slotUtc)}
                      {q.draftChars !== null && ` · ${q.draftChars} chars`}
                      {" · post "}#{q.omnisocialsPostId}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {shipped.length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--color-ink-muted)]">
            Recently shipped
          </h2>
          <ul className="space-y-1.5">
            {shipped.map((s) => (
              <li key={s.slug} className="text-sm">
                <a
                  href={`/research/${s.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--color-accent)] hover:underline"
                >
                  {s.title}
                </a>
                {s.shippedAt && (
                  <span className="ml-2 text-xs text-[var(--color-ink-muted)]">
                    {s.shippedAt.slice(0, 10)}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function SeedForm() {
  const router = useRouter();
  const [idea, setIdea] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [submitting, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const trimmed = idea.trim();
    if (trimmed.length < 4) {
      setError("Seeds need at least 4 characters.");
      return;
    }
    startTransition(async () => {
      const res = await fetch("/api/operator/seeds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idea: trimmed,
          sourceUrl: sourceUrl.trim() || null,
        }),
      });
      if (!res.ok) {
        const txt = await res.text();
        setError(`Failed to submit: ${txt}`);
        return;
      }
      setIdea("");
      setSourceUrl("");
      router.refresh();
    });
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-md border border-[var(--color-border)] bg-[var(--color-bg-white)] p-4"
    >
      <textarea
        value={idea}
        onChange={(e) => setIdea(e.target.value)}
        placeholder="Drop an idea — a topic, a thread, a paper title. The engine's next derive pass will enrich it into a roadmap entry."
        rows={3}
        className="w-full resize-y rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] p-2 text-sm focus:border-[var(--color-accent)] focus:outline-none"
      />
      <input
        type="url"
        value={sourceUrl}
        onChange={(e) => setSourceUrl(e.target.value)}
        placeholder="Optional source URL (article, tweet, paper)"
        className="mt-2 w-full rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] px-2 py-1.5 text-sm focus:border-[var(--color-accent)] focus:outline-none"
      />
      {error && (
        <p className="mt-2 text-xs text-red-600">{error}</p>
      )}
      <div className="mt-3 flex items-center justify-between">
        <p className="text-xs text-[var(--color-ink-muted)]">
          Seeds are picked up by the engine&apos;s next derive pass.
        </p>
        <button
          type="submit"
          disabled={submitting || idea.trim().length < 4}
          className="rounded-md bg-[var(--color-accent)] px-3 py-1.5 text-sm font-medium text-white disabled:opacity-50"
        >
          {submitting ? "Submitting…" : "Submit seed"}
        </button>
      </div>
    </form>
  );
}

function SeedStatusBadge({ seed }: { seed: Seed }) {
  if (seed.rejected) {
    return (
      <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
        rejected
      </span>
    );
  }
  if (seed.processedSlug) {
    return (
      <a
        href={`/research/${seed.processedSlug}`}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 hover:underline"
      >
        → {seed.processedSlug}
      </a>
    );
  }
  return (
    <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800">
      pending
    </span>
  );
}

function TierBadge({ tier }: { tier: string | null }) {
  if (!tier) return null;
  const colors: Record<string, string> = {
    S: "bg-purple-100 text-purple-800",
    A: "bg-blue-100 text-blue-800",
    B: "bg-gray-100 text-gray-700",
    C: "bg-gray-50 text-gray-500",
  };
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
        colors[tier] ?? "bg-gray-100 text-gray-600"
      }`}
    >
      {tier}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    backlog: "bg-gray-100 text-gray-700",
    in_flight: "bg-blue-100 text-blue-800",
    shipped: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-700",
    superseded: "bg-orange-100 text-orange-700",
    removed_by_operator: "bg-red-200 text-red-900",
  };
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
        colors[status] ?? "bg-gray-100 text-gray-600"
      }`}
    >
      {status}
    </span>
  );
}

function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-md border border-dashed border-[var(--color-border)] bg-[var(--color-bg)] p-4 text-sm">
      <p className="font-medium text-[var(--color-ink)]">{title}</p>
      <p className="mt-1 text-xs text-[var(--color-ink-muted)]">{body}</p>
    </div>
  );
}

function formatUtc(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return `${d.toISOString().slice(0, 16).replace("T", " ")} UTC`;
}

// ─── Published tab ──────────────────────────────────────────────────────────

function PublishedTab({
  published,
  xQueue,
  isOperator,
  operatorEmailConfigured,
  currentEmail,
}: {
  published: PublishedPaper[];
  xQueue: XQueueEntry[];
  isOperator: boolean;
  operatorEmailConfigured: boolean;
  currentEmail: string;
}) {
  const [removing, setRemoving] = useState<PublishedPaper | null>(null);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return published;
    return published.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        (p.subtitle && p.subtitle.toLowerCase().includes(q)),
    );
  }, [published, query]);

  const xPostsBySlug = useMemo(() => {
    const m = new Map<string, XQueueEntry>();
    for (const q of xQueue) m.set(q.slug, q);
    return m;
  }, [xQueue]);

  const sorted = useMemo(
    () =>
      [...filtered].sort((a, b) => (b.date || "").localeCompare(a.date || "")),
    [filtered],
  );

  return (
    <div className="space-y-4">
      {!operatorEmailConfigured ? (
        <div className="rounded-md border border-yellow-300 bg-yellow-50 p-3 text-sm">
          <p className="font-medium text-yellow-900">
            OPERATOR_EMAIL not configured
          </p>
          <p className="mt-1 text-xs text-yellow-800">
            The remove action is gated by a Clerk-email match against the{" "}
            <code>OPERATOR_EMAIL</code> environment variable. Set it in Vercel
            project settings to enable removals.
          </p>
        </div>
      ) : !isOperator ? (
        <div className="rounded-md border border-[var(--color-border)] bg-[var(--color-bg-white)] p-3 text-sm">
          <p className="text-[var(--color-ink)]">
            Read-only view. The remove action is restricted to{" "}
            <code className="text-xs">OPERATOR_EMAIL</code>; you&apos;re signed
            in as <code className="text-xs">{currentEmail || "unknown"}</code>.
          </p>
        </div>
      ) : null}

      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Filter by title, slug, subtitle…"
        className="w-full rounded-md border border-[var(--color-border)] bg-[var(--color-bg-white)] px-3 py-2 text-sm focus:border-[var(--color-accent)] focus:outline-none"
      />

      <ul className="divide-y divide-[var(--color-border)] rounded-md border border-[var(--color-border)] bg-[var(--color-bg-white)]">
        {sorted.map((p) => {
          const xPost = xPostsBySlug.get(p.slug);
          return (
            <li key={p.slug} className="flex items-start gap-3 p-3">
              <div className="flex-1 min-w-0">
                <a
                  href={`/research/${p.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-[var(--color-ink)] hover:underline"
                >
                  {p.title}
                </a>
                <div className="mt-0.5 text-xs text-[var(--color-ink-muted)]">
                  <code>{p.slug}</code>
                  {p.date && <span className="ml-2">{p.date}</span>}
                  {xPost && (
                    <span className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-blue-800">
                      X scheduled {formatUtc(xPost.slotUtc)}
                    </span>
                  )}
                </div>
                {p.subtitle && (
                  <p className="mt-0.5 text-xs text-[var(--color-ink-muted)]">
                    {p.subtitle}
                  </p>
                )}
              </div>
              <button
                type="button"
                disabled={!isOperator}
                onClick={() => setRemoving(p)}
                className="rounded-md border border-red-200 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Remove…
              </button>
            </li>
          );
        })}
      </ul>

      {sorted.length === 0 && (
        <p className="text-sm text-[var(--color-ink-muted)]">
          No papers match your filter.
        </p>
      )}

      {removing && (
        <RemoveModal
          paper={removing}
          xPost={xPostsBySlug.get(removing.slug) ?? null}
          onClose={() => setRemoving(null)}
        />
      )}
    </div>
  );
}

function RemoveModal({
  paper,
  xPost,
  onClose,
}: {
  paper: PublishedPaper;
  xPost: XQueueEntry | null;
  onClose: () => void;
}) {
  const router = useRouter();
  const [category, setCategory] = useState<RemovalReasonCategory>("quality");
  const [notes, setNotes] = useState("");
  const [submitting, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function submit() {
    setError(null);
    startTransition(async () => {
      const res = await fetch("/api/operator/remove-paper", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: paper.slug,
          reasonCategory: category,
          notes: notes.trim() || null,
        }),
      });
      if (!res.ok) {
        const txt = await res.text();
        setError(`Failed: ${txt}`);
        return;
      }
      onClose();
      router.refresh();
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-lg bg-[var(--color-bg-white)] p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold text-[var(--color-ink)]">
          Remove paper
        </h3>
        <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
          {paper.title}
        </p>
        <code className="mt-0.5 block text-xs text-[var(--color-ink-muted)]">
          /research/{paper.slug}
        </code>

        <div className="mt-4">
          <label className="block text-xs font-medium uppercase tracking-wide text-[var(--color-ink-muted)]">
            Reason
          </label>
          <select
            value={category}
            onChange={(e) =>
              setCategory(e.target.value as RemovalReasonCategory)
            }
            className="mt-1 w-full rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] px-2 py-1.5 text-sm"
          >
            <option value="quality">Quality — fails our editorial bar</option>
            <option value="topic">Topic — not a perea topic / off-brand</option>
            <option value="stale">Stale — superseded by newer paper</option>
            <option value="duplicate">Duplicate — covered elsewhere</option>
            <option value="other">Other (note below)</option>
          </select>
        </div>

        <div className="mt-3">
          <label className="block text-xs font-medium uppercase tracking-wide text-[var(--color-ink-muted)]">
            Notes (optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="mt-1 w-full resize-y rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] p-2 text-sm"
          />
        </div>

        <div className="mt-4 rounded-md border border-orange-200 bg-orange-50 p-3 text-xs">
          <p className="font-medium text-orange-900">This will:</p>
          <ul className="mt-1 list-inside list-disc space-y-0.5 text-orange-900">
            <li>
              Delete <code>content/whitepapers/{paper.slug}.md</code> from
              perea-ai-next on <code>main</code> via the GitHub API
            </li>
            <li>
              Mark the roadmap entry as <code>removed_by_operator</code> in Neon
            </li>
            {xPost ? (
              <li>
                <strong>
                  Delete the scheduled X post #{xPost.omnisocialsPostId}
                </strong>{" "}
                (slot {formatUtc(xPost.slotUtc)}) via omnisocials
              </li>
            ) : (
              <li>No scheduled X posts reference this slug</li>
            )}
            <li>Vercel will rebuild; the page will 404 within a few minutes</li>
          </ul>
          <p className="mt-2 text-orange-900">
            Recovery: git history preserves the file; revert the deletion
            commit via <code>gh api PUT</code> with the prior SHA.
          </p>
        </div>

        {error && <p className="mt-3 text-sm text-red-700">{error}</p>}

        <div className="mt-5 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="rounded-md px-3 py-1.5 text-sm text-[var(--color-ink-muted)] hover:bg-[var(--color-bg)]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={submit}
            disabled={submitting}
            className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
          >
            {submitting ? "Removing…" : "Remove permanently"}
          </button>
        </div>
      </div>
    </div>
  );
}

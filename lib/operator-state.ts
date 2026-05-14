/**
 * lib/operator-state.ts
 *
 * Read + write helpers for the operator console at /dashboard/research.
 *
 * Tables live in Neon and are populated by the autonomous engines on their
 * own machine at the end of each tick. The dashboard reads from these tables
 * and writes seeds + removal requests; engines pick those up on next tick.
 *
 * See lib/operator-state-schema.sql for the DDL.
 */
import { neon } from "@neondatabase/serverless";

function sql() {
  return neon(
    (process.env.POSTGRES_URL ??
      process.env.DATABASE_URL ??
      process.env.DATABASE_URL_UNPOOLED)!,
  );
}

// ─── Types ──────────────────────────────────────────────────────────────────

export type RoadmapStatus =
  | "backlog"
  | "in_flight"
  | "shipped"
  | "superseded"
  | "rejected"
  | "removed_by_operator";

export interface RoadmapEntry {
  slug: string;
  title: string;
  subtitleSeed: string | null;
  tier: string | null;
  priority: number | null;
  status: RoadmapStatus;
  category: string | null;
  description: string | null;
  startedAt: string | null;
  shippedAt: string | null;
  liveUrl: string | null;
  engineSyncedAt: string | null;
  updatedAt: string;
}

export interface XQueueEntry {
  omnisocialsPostId: string;
  slug: string;
  slotUtc: string;
  scheduledAt: string | null;
  draftChars: number | null;
  engineSyncedAt: string | null;
  updatedAt: string;
}

export interface Seed {
  id: string;
  idea: string;
  sourceUrl: string | null;
  submittedBy: string;
  submittedAt: string;
  processedAt: string | null;
  processedSlug: string | null;
  rejected: boolean;
  rejectedReason: string | null;
}

export type RemovalReasonCategory =
  | "quality"
  | "topic"
  | "stale"
  | "duplicate"
  | "other";

export interface RemovalRequest {
  id: string;
  slug: string;
  requestedBy: string;
  requestedAt: string;
  reasonCategory: RemovalReasonCategory;
  notes: string | null;
  ghDeleteStatus: string | null;
  ghDeleteCommitSha: string | null;
  xPostIdDeleted: string | null;
  xPostDeleteStatus: string | null;
  completedAt: string | null;
}

// ─── Row mappers ────────────────────────────────────────────────────────────

type RoadmapRow = {
  slug: string;
  title: string;
  subtitle_seed: string | null;
  tier: string | null;
  priority: number | null;
  status: RoadmapStatus;
  category: string | null;
  description: string | null;
  started_at: Date | null;
  shipped_at: Date | null;
  live_url: string | null;
  engine_synced_at: Date | null;
  updated_at: Date;
};

function toIso(d: Date | null): string | null {
  return d ? new Date(d).toISOString() : null;
}

function rowToRoadmap(r: RoadmapRow): RoadmapEntry {
  return {
    slug: r.slug,
    title: r.title,
    subtitleSeed: r.subtitle_seed,
    tier: r.tier,
    priority: r.priority,
    status: r.status,
    category: r.category,
    description: r.description,
    startedAt: toIso(r.started_at),
    shippedAt: toIso(r.shipped_at),
    liveUrl: r.live_url,
    engineSyncedAt: toIso(r.engine_synced_at),
    updatedAt: new Date(r.updated_at).toISOString(),
  };
}

type XQueueRow = {
  omnisocials_post_id: string;
  slug: string;
  slot_utc: Date;
  scheduled_at: Date | null;
  draft_chars: number | null;
  engine_synced_at: Date | null;
  updated_at: Date;
};

function rowToXQueue(r: XQueueRow): XQueueEntry {
  return {
    omnisocialsPostId: r.omnisocials_post_id,
    slug: r.slug,
    slotUtc: new Date(r.slot_utc).toISOString(),
    scheduledAt: toIso(r.scheduled_at),
    draftChars: r.draft_chars,
    engineSyncedAt: toIso(r.engine_synced_at),
    updatedAt: new Date(r.updated_at).toISOString(),
  };
}

type SeedRow = {
  id: string;
  idea: string;
  source_url: string | null;
  submitted_by: string;
  submitted_at: Date;
  processed_at: Date | null;
  processed_slug: string | null;
  rejected: boolean;
  rejected_reason: string | null;
};

function rowToSeed(r: SeedRow): Seed {
  return {
    id: r.id,
    idea: r.idea,
    sourceUrl: r.source_url,
    submittedBy: r.submitted_by,
    submittedAt: new Date(r.submitted_at).toISOString(),
    processedAt: toIso(r.processed_at),
    processedSlug: r.processed_slug,
    rejected: r.rejected,
    rejectedReason: r.rejected_reason,
  };
}

// ─── Roadmap reads ──────────────────────────────────────────────────────────

export async function listRoadmap(opts: {
  statuses?: RoadmapStatus[];
  limit?: number;
} = {}): Promise<RoadmapEntry[]> {
  const db = sql();
  const statuses = opts.statuses ?? ["backlog", "in_flight"];
  const limit = opts.limit ?? 200;
  const rows = (await db`
    SELECT * FROM roadmap_entries
    WHERE status = ANY(${statuses})
    ORDER BY
      CASE tier
        WHEN 'S' THEN 1
        WHEN 'A' THEN 2
        WHEN 'B' THEN 3
        WHEN 'C' THEN 4
        ELSE 5
      END,
      priority NULLS LAST,
      updated_at DESC
    LIMIT ${limit}
  `) as RoadmapRow[];
  return rows.map(rowToRoadmap);
}

export async function listRecentShipped(limit = 10): Promise<RoadmapEntry[]> {
  const db = sql();
  const rows = (await db`
    SELECT * FROM roadmap_entries
    WHERE status = 'shipped'
    ORDER BY shipped_at DESC NULLS LAST
    LIMIT ${limit}
  `) as RoadmapRow[];
  return rows.map(rowToRoadmap);
}

// ─── X queue reads ──────────────────────────────────────────────────────────

export async function listXQueue(limit = 50): Promise<XQueueEntry[]> {
  const db = sql();
  const rows = (await db`
    SELECT * FROM x_queue_entries
    WHERE slot_utc >= NOW() - INTERVAL '1 day'
    ORDER BY slot_utc ASC
    LIMIT ${limit}
  `) as XQueueRow[];
  return rows.map(rowToXQueue);
}

export async function findScheduledXPostForSlug(
  slug: string,
): Promise<XQueueEntry | null> {
  const db = sql();
  const rows = (await db`
    SELECT * FROM x_queue_entries
    WHERE slug = ${slug} AND slot_utc >= NOW()
    ORDER BY slot_utc ASC
    LIMIT 1
  `) as XQueueRow[];
  return rows[0] ? rowToXQueue(rows[0]) : null;
}

// ─── Seeds ──────────────────────────────────────────────────────────────────

export async function listSeeds(limit = 50): Promise<Seed[]> {
  const db = sql();
  const rows = (await db`
    SELECT * FROM seeds
    ORDER BY submitted_at DESC
    LIMIT ${limit}
  `) as SeedRow[];
  return rows.map(rowToSeed);
}

export async function insertSeed(opts: {
  idea: string;
  sourceUrl: string | null;
  submittedBy: string;
}): Promise<Seed> {
  const db = sql();
  const id = `seed_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const rows = (await db`
    INSERT INTO seeds (id, idea, source_url, submitted_by)
    VALUES (${id}, ${opts.idea}, ${opts.sourceUrl}, ${opts.submittedBy})
    RETURNING *
  `) as SeedRow[];
  return rowToSeed(rows[0]);
}

// ─── Removal audit ──────────────────────────────────────────────────────────

export async function insertRemovalRequest(opts: {
  slug: string;
  requestedBy: string;
  reasonCategory: RemovalReasonCategory;
  notes: string | null;
}): Promise<string> {
  const db = sql();
  const id = `rm_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  await db`
    INSERT INTO removal_requests
      (id, slug, requested_by, reason_category, notes)
    VALUES
      (${id}, ${opts.slug}, ${opts.requestedBy}, ${opts.reasonCategory}, ${opts.notes})
  `;
  return id;
}

export async function updateRemovalProgress(
  id: string,
  updates: Partial<{
    ghDeleteStatus: string;
    ghDeleteCommitSha: string;
    xPostIdDeleted: string;
    xPostDeleteStatus: string;
    completedAt: string;
  }>,
): Promise<void> {
  const db = sql();
  // Neon-serverless tagged template doesn't support SET clauses built from
  // dynamic keys well; do the updates as a single query with COALESCE.
  await db`
    UPDATE removal_requests SET
      gh_delete_status     = COALESCE(${updates.ghDeleteStatus ?? null}, gh_delete_status),
      gh_delete_commit_sha = COALESCE(${updates.ghDeleteCommitSha ?? null}, gh_delete_commit_sha),
      x_post_id_deleted    = COALESCE(${updates.xPostIdDeleted ?? null}, x_post_id_deleted),
      x_post_delete_status = COALESCE(${updates.xPostDeleteStatus ?? null}, x_post_delete_status),
      completed_at         = COALESCE(${updates.completedAt ?? null}::timestamptz, completed_at)
    WHERE id = ${id}
  `;
}

export async function markPaperRemovedInRoadmap(slug: string): Promise<void> {
  const db = sql();
  // Only flip status if the slug is in the roadmap. If it's not (paper was
  // published but never roadmapped, edge case), the dashboard remove still
  // succeeds; the engine won't try to re-ship a non-roadmapped slug anyway.
  await db`
    UPDATE roadmap_entries
       SET status = 'removed_by_operator',
           updated_at = NOW()
     WHERE slug = ${slug}
  `;
}

export async function removeFromXQueue(omnisocialsPostId: string): Promise<void> {
  const db = sql();
  await db`
    DELETE FROM x_queue_entries
    WHERE omnisocials_post_id = ${omnisocialsPostId}
  `;
}

export async function listRecentRemovals(limit = 20): Promise<RemovalRequest[]> {
  const db = sql();
  const rows = (await db`
    SELECT * FROM removal_requests
    ORDER BY requested_at DESC
    LIMIT ${limit}
  `) as Array<{
    id: string;
    slug: string;
    requested_by: string;
    requested_at: Date;
    reason_category: RemovalReasonCategory;
    notes: string | null;
    gh_delete_status: string | null;
    gh_delete_commit_sha: string | null;
    x_post_id_deleted: string | null;
    x_post_delete_status: string | null;
    completed_at: Date | null;
  }>;
  return rows.map((r) => ({
    id: r.id,
    slug: r.slug,
    requestedBy: r.requested_by,
    requestedAt: new Date(r.requested_at).toISOString(),
    reasonCategory: r.reason_category,
    notes: r.notes,
    ghDeleteStatus: r.gh_delete_status,
    ghDeleteCommitSha: r.gh_delete_commit_sha,
    xPostIdDeleted: r.x_post_id_deleted,
    xPostDeleteStatus: r.x_post_delete_status,
    completedAt: toIso(r.completed_at),
  }));
}

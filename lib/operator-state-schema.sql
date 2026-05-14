-- Operator state tables.
--
-- These tables mirror the autonomous engines' local state so the dashboard
-- can read (and selectively write to) the roadmap, X queue, and seeds without
-- requiring direct access to the operator's machine.
--
-- Engines run on the operator's machine and own the canonical state. They
-- write to these tables at the end of each tick (sync direction: engine →
-- Neon). The dashboard writes seeds and removal requests; engines read these
-- on their next tick (sync direction: Neon → engine).
--
-- See AGENTS.md for the operator console design + ADR-0002 for the
-- read-only-mirror invariant.

-- ─── roadmap_entries ─────────────────────────────────────────────────────────
-- Mirror from perea-research-engine state/roadmap.json. Each row corresponds
-- to one paper in the engine's roadmap. `status` is the source of truth for
-- engine workflow (backlog → in_flight → shipped, plus rejected/superseded).
-- Dashboard adds one extra status: 'removed_by_operator' — set when the
-- operator removes a published paper via the dashboard remove flow.

CREATE TABLE IF NOT EXISTS roadmap_entries (
  slug              TEXT         PRIMARY KEY,
  title             TEXT         NOT NULL,
  subtitle_seed     TEXT,
  tier              TEXT,
  priority          INTEGER,
  status            TEXT         NOT NULL,
  category          TEXT,
  description       TEXT,
  started_at        TIMESTAMPTZ,
  shipped_at        TIMESTAMPTZ,
  live_url          TEXT,
  engine_synced_at  TIMESTAMPTZ,
  updated_at        TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS roadmap_status_idx ON roadmap_entries (status);
CREATE INDEX IF NOT EXISTS roadmap_tier_priority_idx ON roadmap_entries (tier, priority);

-- ─── x_queue_entries ─────────────────────────────────────────────────────────
-- Mirror from tick-X-post-from-research state/queue.json. Each row is one
-- scheduled X post. omnisocials_post_id is the primary key because the same
-- paper slug could (in theory) be posted multiple times across the queue.

CREATE TABLE IF NOT EXISTS x_queue_entries (
  omnisocials_post_id  TEXT         PRIMARY KEY,
  slug                 TEXT         NOT NULL,
  slot_utc             TIMESTAMPTZ  NOT NULL,
  scheduled_at         TIMESTAMPTZ,
  draft_chars          INTEGER,
  engine_synced_at     TIMESTAMPTZ,
  updated_at           TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS x_queue_slug_idx ON x_queue_entries (slug);
CREATE INDEX IF NOT EXISTS x_queue_slot_idx ON x_queue_entries (slot_utc);

-- ─── seeds ───────────────────────────────────────────────────────────────────
-- Natural-language ideas entered from the dashboard. Engines (perea-research-
-- engine derive pass specifically) pick up unprocessed seeds, enrich them via
-- LLM into roadmap entries, and write back the resulting slug.

CREATE TABLE IF NOT EXISTS seeds (
  id              TEXT         PRIMARY KEY,
  idea            TEXT         NOT NULL,
  source_url      TEXT,
  submitted_by    TEXT         NOT NULL,
  submitted_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  processed_at    TIMESTAMPTZ,
  processed_slug  TEXT,
  rejected        BOOLEAN      NOT NULL DEFAULT FALSE,
  rejected_reason TEXT
);
CREATE INDEX IF NOT EXISTS seeds_unprocessed_idx ON seeds (submitted_at)
  WHERE processed_at IS NULL AND rejected = FALSE;

-- ─── removal_requests ────────────────────────────────────────────────────────
-- Audit log for paper-removal actions. Inserted at the start of the remove
-- flow; updated as each downstream step (gh delete, omnisocials delete,
-- roadmap mark) completes. Useful both for compliance ("show me everything
-- we've removed") and recovery ("what was the SHA before deletion?").

CREATE TABLE IF NOT EXISTS removal_requests (
  id                    TEXT         PRIMARY KEY,
  slug                  TEXT         NOT NULL,
  requested_by          TEXT         NOT NULL,
  requested_at          TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  reason_category       TEXT         NOT NULL,
  notes                 TEXT,
  gh_delete_status      TEXT,
  gh_delete_commit_sha  TEXT,
  x_post_id_deleted     TEXT,
  x_post_delete_status  TEXT,
  completed_at          TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS removal_requests_slug_idx ON removal_requests (slug);
CREATE INDEX IF NOT EXISTS removal_requests_requested_at_idx ON removal_requests (requested_at DESC);

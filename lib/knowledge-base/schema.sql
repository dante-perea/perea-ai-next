CREATE TABLE IF NOT EXISTS kb_files (
  id           TEXT         PRIMARY KEY,
  filename     TEXT         NOT NULL,
  blob_key     TEXT         NOT NULL UNIQUE,
  blob_url     TEXT         NOT NULL,
  size         BIGINT       NOT NULL,
  content_type TEXT         NOT NULL,
  uploaded_by  TEXT         NOT NULL DEFAULT '',
  uploaded_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  tags         TEXT[]       NOT NULL DEFAULT '{}',
  user_id      TEXT         NOT NULL DEFAULT '',
  team_id      TEXT
);
CREATE INDEX IF NOT EXISTS kb_files_user_id_idx ON kb_files (user_id);
CREATE INDEX IF NOT EXISTS kb_files_team_id_idx ON kb_files (team_id);
ALTER TABLE kb_files ADD COLUMN IF NOT EXISTS knowledge_type TEXT NOT NULL DEFAULT 'document';

CREATE TABLE IF NOT EXISTS teams (
  id          TEXT         PRIMARY KEY,
  name        TEXT         NOT NULL,
  owner_id    TEXT         NOT NULL,
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS team_members (
  team_id     TEXT         NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  user_id     TEXT         NOT NULL,
  role        TEXT         NOT NULL CHECK (role IN ('owner', 'editor', 'viewer')),
  joined_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  PRIMARY KEY (team_id, user_id)
);
CREATE INDEX IF NOT EXISTS team_members_user_id_idx ON team_members (user_id);

CREATE TABLE IF NOT EXISTS team_invites (
  token       TEXT         PRIMARY KEY,
  team_id     TEXT         NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  role        TEXT         NOT NULL CHECK (role IN ('editor', 'viewer')),
  invited_by  TEXT         NOT NULL,
  expires_at  TIMESTAMPTZ  NOT NULL,
  accepted_by TEXT,
  accepted_at TIMESTAMPTZ,
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS team_invites_team_id_idx ON team_invites (team_id);

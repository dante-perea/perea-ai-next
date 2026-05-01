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

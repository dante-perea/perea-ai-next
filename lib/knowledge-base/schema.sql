CREATE TABLE IF NOT EXISTS kb_files (
  id           TEXT         PRIMARY KEY,
  filename     TEXT         NOT NULL,
  blob_key     TEXT         NOT NULL UNIQUE,
  blob_url     TEXT         NOT NULL,
  size         BIGINT       NOT NULL,
  content_type TEXT         NOT NULL,
  uploaded_by  TEXT         NOT NULL DEFAULT '',
  uploaded_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  tags         TEXT[]       NOT NULL DEFAULT '{}'
);

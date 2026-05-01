CREATE TABLE IF NOT EXISTS oauth_clients (
  client_id     TEXT        PRIMARY KEY,
  redirect_uris TEXT[]      NOT NULL,
  client_name   TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS oauth_codes (
  code           TEXT        PRIMARY KEY,
  client_id      TEXT        NOT NULL REFERENCES oauth_clients(client_id) ON DELETE CASCADE,
  redirect_uri   TEXT        NOT NULL,
  user_id        TEXT        NOT NULL,
  user_email     TEXT        NOT NULL,
  code_challenge TEXT        NOT NULL,
  expires_at     TIMESTAMPTZ NOT NULL,
  used           BOOLEAN     NOT NULL DEFAULT FALSE
);

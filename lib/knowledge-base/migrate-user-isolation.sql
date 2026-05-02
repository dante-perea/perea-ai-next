-- Migration: add per-user isolation columns to kb_files
-- Run once against your Neon database.
-- Existing rows get user_id = '' and team_id = NULL (invisible to all users after migration).
-- Those files must be re-uploaded to be claimed by their owner.

ALTER TABLE kb_files ADD COLUMN IF NOT EXISTS user_id TEXT NOT NULL DEFAULT '';
ALTER TABLE kb_files ADD COLUMN IF NOT EXISTS team_id TEXT;
CREATE INDEX IF NOT EXISTS kb_files_user_id_idx ON kb_files (user_id);
CREATE INDEX IF NOT EXISTS kb_files_team_id_idx ON kb_files (team_id);

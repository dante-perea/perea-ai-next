import { sql } from "@/lib/knowledge-base/db";

export interface OAuthClient {
  client_id: string;
  redirect_uris: string[];
  client_name: string | null;
  created_at: Date;
}

export interface OAuthCode {
  code: string;
  client_id: string;
  redirect_uri: string;
  user_id: string;
  user_email: string;
  code_challenge: string;
  expires_at: Date;
  used: boolean;
}

export async function insertClient(client: {
  client_id: string;
  redirect_uris: string[];
  client_name?: string;
}): Promise<OAuthClient> {
  const rows = await sql`
    INSERT INTO oauth_clients (client_id, redirect_uris, client_name)
    VALUES (${client.client_id}, ${client.redirect_uris}, ${client.client_name ?? null})
    RETURNING *
  ` as OAuthClient[];
  return rows[0];
}

export async function findClient(client_id: string): Promise<OAuthClient | null> {
  const rows = await sql`
    SELECT * FROM oauth_clients WHERE client_id = ${client_id} LIMIT 1
  ` as OAuthClient[];
  return rows[0] ?? null;
}

export async function insertCode(code: {
  code: string;
  client_id: string;
  redirect_uri: string;
  user_id: string;
  user_email: string;
  code_challenge: string;
  expires_at: Date;
}): Promise<void> {
  await sql`
    INSERT INTO oauth_codes (code, client_id, redirect_uri, user_id, user_email, code_challenge, expires_at)
    VALUES (${code.code}, ${code.client_id}, ${code.redirect_uri}, ${code.user_id},
            ${code.user_email}, ${code.code_challenge}, ${code.expires_at.toISOString()})
  `;
}

export async function findAndConsumeCode(code: string): Promise<OAuthCode | null> {
  const rows = await sql`
    UPDATE oauth_codes
    SET used = TRUE
    WHERE code = ${code}
      AND used = FALSE
      AND expires_at > NOW()
    RETURNING *
  ` as OAuthCode[];
  return rows[0] ?? null;
}

export async function deleteExpiredCodes(): Promise<void> {
  await sql`DELETE FROM oauth_codes WHERE expires_at < NOW()`;
}

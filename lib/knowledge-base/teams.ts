import { sql } from "./db";
import { deleteTeamFiles } from "./meta";

export type TeamRole = "owner" | "editor" | "viewer";

export interface Team {
  id: string;
  name: string;
  ownerId: string;
  createdAt: string;
}

export interface TeamMember {
  teamId: string;
  userId: string;
  role: TeamRole;
  joinedAt: string;
}

export interface TeamInvite {
  token: string;
  teamId: string;
  role: TeamRole;
  invitedBy: string;
  expiresAt: string;
  acceptedBy: string | null;
  acceptedAt: string | null;
  createdAt: string;
}

type TeamRow = { id: string; name: string; owner_id: string; created_at: Date };
type MemberRow = { team_id: string; user_id: string; role: TeamRole; joined_at: Date };
type InviteRow = {
  token: string; team_id: string; role: TeamRole; invited_by: string;
  expires_at: Date; accepted_by: string | null; accepted_at: Date | null; created_at: Date;
};

function rowToTeam(r: TeamRow): Team {
  return { id: r.id, name: r.name, ownerId: r.owner_id, createdAt: new Date(r.created_at).toISOString() };
}
function rowToMember(r: MemberRow): TeamMember {
  return { teamId: r.team_id, userId: r.user_id, role: r.role, joinedAt: new Date(r.joined_at).toISOString() };
}
function rowToInvite(r: InviteRow): TeamInvite {
  return {
    token: r.token, teamId: r.team_id, role: r.role, invitedBy: r.invited_by,
    expiresAt: new Date(r.expires_at).toISOString(),
    acceptedBy: r.accepted_by ?? null,
    acceptedAt: r.accepted_at ? new Date(r.accepted_at).toISOString() : null,
    createdAt: new Date(r.created_at).toISOString(),
  };
}

export async function createTeam(id: string, name: string, ownerId: string): Promise<Team> {
  const rows = await sql`
    INSERT INTO teams (id, name, owner_id) VALUES (${id}, ${name}, ${ownerId}) RETURNING *
  ` as TeamRow[];
  await sql`
    INSERT INTO team_members (team_id, user_id, role)
    VALUES (${id}, ${ownerId}, 'owner') ON CONFLICT DO NOTHING
  `;
  return rowToTeam(rows[0]);
}

export async function listTeamsForUser(userId: string): Promise<(Team & { role: TeamRole })[]> {
  const rows = await sql`
    SELECT t.*, tm.role FROM teams t
    JOIN team_members tm ON t.id = tm.team_id
    WHERE tm.user_id = ${userId}
    ORDER BY t.created_at ASC
  ` as (TeamRow & { role: TeamRole })[];
  return rows.map((r) => ({ ...rowToTeam(r), role: r.role }));
}

export async function getTeam(id: string): Promise<Team | null> {
  const rows = await sql`SELECT * FROM teams WHERE id = ${id}` as TeamRow[];
  return rows[0] ? rowToTeam(rows[0]) : null;
}

export async function deleteTeam(id: string, ownerId: string): Promise<boolean> {
  // Verify ownership before doing anything destructive
  const check = await sql`
    SELECT id FROM teams WHERE id = ${id} AND owner_id = ${ownerId}
  ` as { id: string }[];
  if (check.length === 0) return false;

  // Clean up files and blobs first, then delete the team (cascades members + invites)
  await deleteTeamFiles(id);
  await sql`DELETE FROM teams WHERE id = ${id}`;
  return true;
}

export async function getTeamRole(teamId: string, userId: string): Promise<TeamRole | null> {
  const rows = await sql`
    SELECT role FROM team_members WHERE team_id = ${teamId} AND user_id = ${userId}
  ` as { role: TeamRole }[];
  return rows[0]?.role ?? null;
}

export async function getUserTeamIds(userId: string): Promise<string[]> {
  const rows = await sql`
    SELECT team_id FROM team_members WHERE user_id = ${userId}
  ` as { team_id: string }[];
  return rows.map((r) => r.team_id);
}

export async function listTeamMembers(teamId: string): Promise<TeamMember[]> {
  const rows = await sql`
    SELECT * FROM team_members WHERE team_id = ${teamId} ORDER BY joined_at ASC
  ` as MemberRow[];
  return rows.map(rowToMember);
}

export async function updateMemberRole(teamId: string, userId: string, role: Exclude<TeamRole, "owner">): Promise<boolean> {
  const rows = await sql`
    UPDATE team_members SET role = ${role}
    WHERE team_id = ${teamId} AND user_id = ${userId} AND role != 'owner'
    RETURNING team_id
  ` as { team_id: string }[];
  return rows.length > 0;
}

export async function removeMember(teamId: string, userId: string): Promise<boolean> {
  const rows = await sql`
    DELETE FROM team_members
    WHERE team_id = ${teamId} AND user_id = ${userId} AND role != 'owner'
    RETURNING team_id
  ` as { team_id: string }[];
  return rows.length > 0;
}

export async function createInvite(
  token: string, teamId: string, role: Exclude<TeamRole, "owner">, invitedBy: string, expiresAt: Date
): Promise<TeamInvite> {
  const rows = await sql`
    INSERT INTO team_invites (token, team_id, role, invited_by, expires_at)
    VALUES (${token}, ${teamId}, ${role}, ${invitedBy}, ${expiresAt.toISOString()})
    RETURNING *
  ` as InviteRow[];
  return rowToInvite(rows[0]);
}

export async function getInvite(token: string): Promise<TeamInvite | null> {
  const rows = await sql`SELECT * FROM team_invites WHERE token = ${token}` as InviteRow[];
  return rows[0] ? rowToInvite(rows[0]) : null;
}

export async function listPendingInvites(teamId: string): Promise<TeamInvite[]> {
  const rows = await sql`
    SELECT * FROM team_invites
    WHERE team_id = ${teamId} AND accepted_at IS NULL AND expires_at > NOW()
    ORDER BY created_at DESC
  ` as InviteRow[];
  return rows.map(rowToInvite);
}

export async function revokeInvite(token: string, teamId: string): Promise<boolean> {
  const rows = await sql`
    DELETE FROM team_invites
    WHERE token = ${token} AND team_id = ${teamId} AND accepted_at IS NULL
    RETURNING token
  ` as { token: string }[];
  return rows.length > 0;
}

export async function acceptInvite(token: string, userId: string): Promise<{ teamId: string; role: TeamRole } | null> {
  const rows = await sql`
    UPDATE team_invites
    SET accepted_by = ${userId}, accepted_at = NOW()
    WHERE token = ${token} AND accepted_at IS NULL AND expires_at > NOW()
    RETURNING team_id, role
  ` as { team_id: string; role: TeamRole }[];
  if (!rows[0]) return null;

  const { team_id, role } = rows[0];
  await sql`
    INSERT INTO team_members (team_id, user_id, role)
    VALUES (${team_id}, ${userId}, ${role})
    ON CONFLICT (team_id, user_id) DO NOTHING
  `;
  return { teamId: team_id, role };
}

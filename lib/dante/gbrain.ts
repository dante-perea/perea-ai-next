import postgres from "postgres";

// Server-only client for the gbrain Supabase Postgres. Used to read public
// project pages on the /dante route. NEVER import from a client component.
//
// Vercel functions are IPv4-only on standard regions. The direct Supabase URL
// (db.<ref>.supabase.co:5432) is IPv6-only on the free tier — set
// GBRAIN_DATABASE_URL to the SESSION POOLER URL instead:
//   postgresql://postgres.<project-ref>:<password>@aws-0-<region>.pooler.supabase.com:6543/postgres
// Grab it from Supabase dashboard → Settings → Database → Session pooler.

export type PublicStatus = "public" | "protected_summary";

export interface PublicProject {
  slug: string;
  title: string;
  name: string;
  description: string;
  tagline: string | null;
  public_status: PublicStatus;
  body: string | null; // null when protected_summary — render "[protected]"
  updated_at: Date;
}

function gbrainDb() {
  const url = process.env.GBRAIN_DATABASE_URL;
  if (!url) throw new Error("GBRAIN_DATABASE_URL not set");
  return postgres(url, { ssl: "require", max: 3, prepare: false });
}

interface PageRow {
  slug: string;
  title: string;
  compiled_truth: string;
  frontmatter: {
    name?: string;
    description?: string;
    tagline?: string;
    public_status?: string;
  } | null;
  updated_at: Date;
}

export async function getPublicProjects(): Promise<PublicProject[]> {
  const db = gbrainDb();
  try {
    const rows = await db<PageRow[]>`
      SELECT slug, title, compiled_truth, frontmatter, updated_at
      FROM pages
      WHERE type = 'project'
        AND deleted_at IS NULL
        AND frontmatter->>'public_status' IN ('public', 'protected_summary')
      ORDER BY updated_at DESC
    `;
    return rows.map((r: PageRow) => {
      const status = (r.frontmatter?.public_status ?? "public") as PublicStatus;
      return {
        slug: r.slug,
        title: r.title,
        name: r.frontmatter?.name ?? r.title,
        description: r.frontmatter?.description ?? "",
        tagline: r.frontmatter?.tagline ?? null,
        public_status: status,
        body: status === "public" ? r.compiled_truth : null,
        updated_at: r.updated_at,
      };
    });
  } finally {
    await db.end();
  }
}

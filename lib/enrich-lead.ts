/**
 * Lead enrichment via Apollo.io
 * Converts an email address into a rich company + person profile.
 *
 * Apollo free tier: 50 enrichments/month
 * Paid: $49/mo for 1,000
 *
 * If APOLLO_API_KEY is not set, returns null gracefully
 * (the rest of the pipeline still works with transcript-only data).
 */

export interface LeadEnrichment {
  // Person
  name?: string;
  firstName?: string;
  lastName?: string;
  title?: string;
  linkedinUrl?: string;
  city?: string;
  country?: string;

  // Company
  companyName?: string;
  companyDomain?: string;
  companyWebsite?: string;
  companySize?: string;           // e.g. "11-50"
  companyIndustry?: string;
  companyFunding?: string;        // e.g. "Series A"
  companyFounded?: number;
  companyLinkedIn?: string;
  companyDescription?: string;

  // Tech stack (if available)
  technologies?: string[];
}

export async function enrichLead(email: string): Promise<LeadEnrichment | null> {
  const apiKey = process.env.APOLLO_API_KEY;
  if (!apiKey) {
    console.log("[enrich-lead] APOLLO_API_KEY not set — skipping enrichment");
    return null;
  }

  try {
    const res = await fetch("https://api.apollo.io/api/v1/people/match", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
        "X-Api-Key": apiKey,
      },
      body: JSON.stringify({
        email,
        reveal_personal_emails: false,
        reveal_phone_number: false,
      }),
    });

    if (!res.ok) {
      console.warn("[enrich-lead] Apollo error:", res.status, await res.text());
      return null;
    }

    const data = await res.json();
    const person  = data?.person;
    const org     = person?.organization;

    if (!person) return null;

    // Map funding stage from Apollo's format
    const fundingMap: Record<string, string> = {
      seed:      "Seed",
      series_a:  "Series A",
      series_b:  "Series B",
      series_c:  "Series C",
      ipo:       "Public",
      bootstrapped: "Bootstrapped",
    };

    return {
      name:               person.name,
      firstName:          person.first_name,
      lastName:           person.last_name,
      title:              person.title,
      linkedinUrl:        person.linkedin_url,
      city:               person.city,
      country:            person.country,

      companyName:        org?.name,
      companyDomain:      org?.primary_domain,
      companyWebsite:     org?.website_url ?? (org?.primary_domain ? `https://${org.primary_domain}` : undefined),
      companySize:        org?.employee_count ? formatEmployeeCount(org.employee_count) : undefined,
      companyIndustry:    org?.industry,
      companyFunding:     org?.latest_funding_stage ? (fundingMap[org.latest_funding_stage] ?? org.latest_funding_stage) : undefined,
      companyFounded:     org?.founded_year,
      companyLinkedIn:    org?.linkedin_url,
      companyDescription: org?.short_description,
      technologies:       (org?.technology_names ?? []).slice(0, 8), // top 8
    };
  } catch (err) {
    console.error("[enrich-lead] Unexpected error:", err);
    return null;
  }
}

function formatEmployeeCount(count: number): string {
  if (count <= 10)   return "1\u201310";
  if (count <= 50)   return "11\u201350";
  if (count <= 200)  return "51\u2013200";
  if (count <= 500)  return "201\u2013500";
  if (count <= 1000) return "501\u20131,000";
  return "1,000+";
}

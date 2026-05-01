/**
 * Lead enrichment via EnrichLayer (enrichlayer.com)
 *
 * EnrichLayer provides LinkedIn-based company + person data.
 *
 * Company lookup strategy:
 *   email: dante@perea.ai
 *   → domain: perea.ai
 *   → slug:   perea
 *   → try:    https://www.linkedin.com/company/perea
 *   → EnrichLayer returns: name, industry, size, website, description, HQ, specialties
 *
 * Person lookup:
 *   Requires a LinkedIn profile URL — skipped for now.
 *
 * Cost: ~1 credit per company lookup.
 * Docs: https://enrichlayer.com/docs
 */

const ENRICHLAYER_BASE = "https://enrichlayer.com/api/v2";

export interface LeadEnrichment {
  // Company
  companyName?:        string;
  companyDomain?:      string;
  companyWebsite?:     string;
  companySize?:        string;
  companyIndustry?:    string;
  companyFounded?:     number;
  companyLinkedIn?:    string;
  companyDescription?: string;
  companyCity?:        string;
  companyCountry?:     string;
  technologies?:       string[];

  // Person (populated if LinkedIn URL is available)
  name?:       string;
  title?:      string;
  headline?:   string;
  city?:       string;
  country?:    string;
  linkedinUrl?: string;
}

export async function enrichCompany(
  domain: string,
  apiKey: string,
): Promise<Partial<LeadEnrichment> | null> {
  const slug = domain.split(".")[0].toLowerCase();
  const linkedinUrl = `https://www.linkedin.com/company/${slug}`;

  try {
    const res = await fetch(
      `${ENRICHLAYER_BASE}/company?url=${encodeURIComponent(linkedinUrl)}`,
      {
        headers: { Authorization: `Bearer ${apiKey}` },
        signal: AbortSignal.timeout(8000),
      }
    );

    if (!res.ok) return null;
    const c = await res.json();
    if (c.error || c.errors || !c.name) return null;

    let companySize: string | undefined;
    if (c.company_size_on_linkedin) {
      companySize = `${c.company_size_on_linkedin.toLocaleString()} employees`;
    } else if (Array.isArray(c.company_size) && c.company_size.length === 2) {
      companySize = `${c.company_size[0]}\u2013${c.company_size[1]} employees`;
    }

    const hq = c.hq;
    const technologies = Array.isArray(c.specialities) ? c.specialities.slice(0, 8) : undefined;

    console.log("[enrich-lead] Company found:", c.name, "|", companySize);

    return {
      companyName:        c.name,
      companyDomain:      domain,
      companyWebsite:     c.website,
      companySize,
      companyIndustry:    c.industry,
      companyFounded:     c.founded_year ?? undefined,
      companyLinkedIn:    linkedinUrl,
      companyDescription: c.description,
      companyCity:        hq?.city ?? undefined,
      companyCountry:     hq?.country ?? undefined,
      technologies,
    };
  } catch (err) {
    console.error("[enrich-lead] Company exception:", err);
    return null;
  }
}

export async function enrichPerson(
  linkedinProfileUrl: string,
  apiKey: string,
): Promise<Partial<LeadEnrichment> | null> {
  try {
    const res = await fetch(
      `${ENRICHLAYER_BASE}/profile?profile_url=${encodeURIComponent(linkedinProfileUrl)}`,
      { headers: { Authorization: `Bearer ${apiKey}` }, signal: AbortSignal.timeout(8000) }
    );
    if (!res.ok) return null;
    const p = await res.json();
    if (p.error || !p.full_name) return null;
    const currentRole = p.experiences?.[0];
    return {
      name:        p.full_name,
      title:       currentRole?.title ?? p.occupation,
      headline:    p.headline,
      city:        p.city,
      country:     p.country_full_name,
      linkedinUrl: linkedinProfileUrl,
    };
  } catch (err) {
    console.error("[enrich-lead] Person exception:", err);
    return null;
  }
}

export async function enrichLead(
  email: string,
  linkedinUrl?: string,
): Promise<LeadEnrichment | null> {
  const apiKey = process.env.ENRICHLAYER_API_KEY;
  if (!apiKey) {
    console.log("[enrich-lead] ENRICHLAYER_API_KEY not set \u2014 skipping");
    return null;
  }

  const domain = email.split("@")[1];
  if (!domain) return null;

  const [company, person] = await Promise.allSettled([
    enrichCompany(domain, apiKey),
    linkedinUrl ? enrichPerson(linkedinUrl, apiKey) : Promise.resolve(null),
  ]);

  const companyData = company.status === "fulfilled" ? company.value : null;
  const personData  = person.status  === "fulfilled" ? person.value  : null;

  const merged: LeadEnrichment = {
    ...(companyData ?? {}),
    ...(personData  ?? {}),
    companyDomain: domain,
  };

  if (!merged.companyName && !merged.name) return null;
  return merged;
}

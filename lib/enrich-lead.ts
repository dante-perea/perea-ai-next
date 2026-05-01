/**
 * Lead enrichment via EnrichLayer (enrichlayer.com)
 *
 * Company lookup strategy:
 *   email: dante@perea.ai
 *   → domain: perea.ai
 *   → slug:   perea
 *   → try:    https://www.linkedin.com/company/perea
 *   → EnrichLayer returns: name, industry, size, website, description, HQ, specialties
 *
 * Person lookup: Requires a LinkedIn profile URL (skipped unless provided).
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
  companyFunding?:     string;
  companyLinkedIn?:    string;
  companyDescription?: string;
  companyCity?:        string;
  companyCountry?:     string;
  technologies?:       string[];

  // Person
  name?:        string;
  title?:       string;
  headline?:    string;
  city?:        string;
  country?:     string;
  linkedinUrl?: string;
}

async function fetchWithTimeout(url: string, options: RequestInit, timeoutMs = 8000): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

export async function enrichCompany(
  domain: string,
  apiKey: string,
): Promise<Partial<LeadEnrichment> | null> {
  const slug = domain.split(".")[0].toLowerCase();
  const linkedinUrl = `https://www.linkedin.com/company/${slug}`;

  try {
    const res = await fetchWithTimeout(
      `${ENRICHLAYER_BASE}/company?url=${encodeURIComponent(linkedinUrl)}`,
      { headers: { Authorization: `Bearer ${apiKey}` } },
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

    const hq = c.hq as { city?: string; country?: string } | undefined;
    const technologies = Array.isArray(c.specialities)
      ? (c.specialities as string[]).slice(0, 8)
      : undefined;

    console.log("[enrich-lead] Company found:", c.name, "|", companySize);

    return {
      companyName:        c.name as string,
      companyDomain:      domain,
      companyWebsite:     c.website as string | undefined,
      companySize,
      companyIndustry:    c.industry as string | undefined,
      companyFounded:     c.founded_year ? Number(c.founded_year) : undefined,
      companyLinkedIn:    linkedinUrl,
      companyDescription: c.description as string | undefined,
      companyCity:        hq?.city,
      companyCountry:     hq?.country,
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
    const res = await fetchWithTimeout(
      `${ENRICHLAYER_BASE}/profile?profile_url=${encodeURIComponent(linkedinProfileUrl)}`,
      { headers: { Authorization: `Bearer ${apiKey}` } },
    );
    if (!res.ok) return null;
    const p = await res.json();
    if (p.error || !p.full_name) return null;
    const currentRole = Array.isArray(p.experiences) ? p.experiences[0] : undefined;
    return {
      name:        p.full_name as string,
      title:       (currentRole as { title?: string } | undefined)?.title ?? p.occupation as string | undefined,
      headline:    p.headline as string | undefined,
      city:        p.city as string | undefined,
      country:     p.country_full_name as string | undefined,
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

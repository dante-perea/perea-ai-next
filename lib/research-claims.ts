/**
 * research-claims.ts
 *
 * Shared logic for claim verification + reference classification used by:
 *   - scripts/verify-research.ts (the verify gate, runs at ship time)
 *   - scripts/audit-published-claims.ts (the retrofit audit, runs once over canon)
 *
 * Layer 1: parse references (numbered list OR `[^N]: ...` footnote defs),
 *          classify each by domain → primary | secondary | tertiary | unknown.
 * Layer 2: extract numeric/dated/dollar/funding/count claims from body,
 *          check inline `[^N]` / `[N]` citation coverage.
 */

export type Tier = "primary" | "secondary" | "tertiary" | "unknown";

const PRIMARY_PATTERNS: RegExp[] = [
  // Government + regulatory
  /(^|\.)sec\.gov(\/|$)/i,
  /(^|\.)edgar\.sec\.gov(\/|$)/i,
  /(^|\.)gov(\/|$)/i,
  /(^|\.)gov\.uk(\/|$)/i,
  /(^|\.)gov\.eu(\/|$)/i,
  /(^|\.)europa\.eu(\/|$)/i,
  /(^|\.)gc\.ca(\/|$)/i,
  /(^|\.)nist\.gov(\/|$)/i,
  /(^|\.)fda\.gov(\/|$)/i,
  /(^|\.)cms\.gov(\/|$)/i,
  /(^|\.)cdc\.gov(\/|$)/i,
  /(^|\.)uspto\.gov(\/|$)/i,
  /(^|\.)usda\.gov(\/|$)/i,
  /(^|\.)federalreserve\.gov(\/|$)/i,
  /(^|\.)nih\.gov(\/|$)/i,
  /(^|\.)dol\.gov(\/|$)/i,
  /(^|\.)ftc\.gov(\/|$)/i,
  /(^|\.)irs\.gov(\/|$)/i,
  // Academic + peer-reviewed
  /(^|\.)edu(\/|$)/i,
  /(^|\.)arxiv\.org(\/|$)/i,
  /(^|\.)ssrn\.com(\/|$)/i,
  /(^|\.)pubmed\.ncbi\.nlm\.nih\.gov(\/|$)/i,
  /(^|\.)nature\.com(\/|$)/i,
  /(^|\.)science\.org(\/|$)/i,
  /(^|\.)acm\.org(\/|$)/i,
  /(^|\.)ieee\.org(\/|$)/i,
  /(^|\.)cell\.com(\/|$)/i,
  /(^|\.)nejm\.org(\/|$)/i,
  /(^|\.)thelancet\.com(\/|$)/i,
  // Press release wires
  /(^|\.)prnewswire\.com(\/|$)/i,
  /(^|\.)businesswire\.com(\/|$)/i,
  /(^|\.)globenewswire\.com(\/|$)/i,
  /(^|\.)accesswire\.com(\/|$)/i,
  // Standards bodies
  /(^|\.)ietf\.org(\/|$)/i,
  /(^|\.)iso\.org(\/|$)/i,
  /(^|\.)w3\.org(\/|$)/i,
  /(^|\.)oasis-open\.org(\/|$)/i,
  /(^|\.)wikipedia\.org(\/|$)/i, // Wikipedia citations point to refs; treat as primary entry
  // AI lab research divisions (the labs themselves are primary on their own work)
  /(^|\.)openai\.com(\/|$)/i,
  /(^|\.)anthropic\.com(\/|$)/i,
  /(^|\.)deepmind\.google(\/|$)/i,
  /(^|\.)deepmind\.com(\/|$)/i,
  /(^|\.)research\.google(\/|$)/i,
  /(^|\.)ai\.meta\.com(\/|$)/i,
  /(^|\.)microsoft\.com\/en-us\/research(\/|$)/i,
  /(^|\.)cohere\.com(\/|$)/i,
  /(^|\.)mistral\.ai(\/|$)/i,
  // Cybersecurity corporate publishers (primary on their own announcements + blog)
  /(^|\.)crowdstrike\.com(\/|$)/i,
  /(^|\.)paloaltonetworks\.com(\/|$)/i,
  /(^|\.)wiz\.io(\/|$)/i,
  /(^|\.)lumu\.io(\/|$)/i,
  /(^|\.)securonix\.com(\/|$)/i,
  /(^|\.)torq\.io(\/|$)/i,
  /(^|\.)cisco\.com(\/|$)/i,
  /(^|\.)sentinelone\.com(\/|$)/i,
  /(^|\.)drata\.com(\/|$)/i,
  /(^|\.)chainguard\.dev(\/|$)/i,
  // MITRE / threat intel standards orgs
  /(^|\.)atlas\.mitre\.org(\/|$)/i,
  /(^|\.)mitre\.org(\/|$)/i,
  /(^|\.)mitre-engenuity\.org(\/|$)/i,
  /(^|\.)mitre-atlas(\/|$)/i,
  /(^|\.)owasp\.org(\/|$)/i,
  /(^|\.)cisa\.gov(\/|$)/i,
  // Google + Microsoft + corporate blog/security surfaces (specific paths gated below by PRIMARY_PATH_FRAGMENTS)
  /(^|\.)blog\.google(\/|$)/i,
  /(^|\.)cloud\.google\.com(\/|$)/i,
  /(^|\.)googlecloudpresscorner\.com(\/|$)/i,
  /(^|\.)blogs\.microsoft\.com(\/|$)/i,
];

const PRIMARY_PATH_FRAGMENTS = [
  "/press/",
  "/press-release",
  "/press-releases",
  "/news/",
  "/news-release",
  "/news-releases",
  "/newsroom",
  "/investor-relations",
  "/investors/",
  "/research-insights/",
  "/research/",
  "/corporate/",
  "/about/news",
  // Microsoft Security blog (Microsoft's official corporate publication on security)
  "/en-us/security/blog/",
  "/security/blog/",
  // Microsoft Learn product documentation (official platform docs)
  "/copilot/security/",
  // M365 Message Center (official admin notifications)
  "/message/mc",
  // Resources / case-study pages on corporate domains
  "/resources/",
  // Conference / spec / protocol artifacts hosted on official corporate domains
  "/spec/",
  "/specs/",
  "/specifications/",
  "/standard/",
  "/standards/",
  "/protocol/",
  "/governance/",
  "/blog/research/",
  "/blog/announcement",
  "/blog/announcements",
  // GitHub spec repos (when the repo IS the spec — protocol authors publish here)
  "/blob/main/SPECIFICATION",
  "/blob/main/spec",
  "/blob/master/SPECIFICATION",
  "/blob/master/spec",
];

const SECONDARY_PATTERNS: RegExp[] = [
  // Tier-1 general business + tech press
  /(^|\.)bloomberg\.com(\/|$)/i,
  /(^|\.)reuters\.com(\/|$)/i,
  /(^|\.)wsj\.com(\/|$)/i,
  /(^|\.)ft\.com(\/|$)/i,
  /(^|\.)nytimes\.com(\/|$)/i,
  /(^|\.)washingtonpost\.com(\/|$)/i,
  /(^|\.)economist\.com(\/|$)/i,
  /(^|\.)theatlantic\.com(\/|$)/i,
  /(^|\.)newyorker\.com(\/|$)/i,
  /(^|\.)techcrunch\.com(\/|$)/i,
  /(^|\.)theverge\.com(\/|$)/i,
  /(^|\.)wired\.com(\/|$)/i,
  /(^|\.)theinformation\.com(\/|$)/i,
  /(^|\.)fortune\.com(\/|$)/i,
  /(^|\.)forbes\.com(\/|$)/i,
  /(^|\.)businessinsider\.com(\/|$)/i,
  /(^|\.)cnbc\.com(\/|$)/i,
  /(^|\.)siliconangle\.com(\/|$)/i,
  /(^|\.)axios\.com(\/|$)/i,
  /(^|\.)protocol\.com(\/|$)/i,
  /(^|\.)stratechery\.com(\/|$)/i,
  /(^|\.)platformer\.news(\/|$)/i,
  // Funding + market data
  /(^|\.)crunchbase\.com(\/|$)/i,
  /(^|\.)pitchbook\.com(\/|$)/i,
  /(^|\.)tracxn\.com(\/|$)/i,
  /(^|\.)dealroom\.co(\/|$)/i,
  // Top-tier VC research / publications (treat as secondary — equity holders, not journalists)
  /(^|\.)a16z\.com(\/|$)/i,
  /(^|\.)sequoiacap\.com(\/|$)/i,
  /(^|\.)bessemer\.com(\/|$)/i,
  /(^|\.)bvp\.com(\/|$)/i,
  /(^|\.)greylock\.com(\/|$)/i,
  /(^|\.)kleinerperkins\.com(\/|$)/i,
  /(^|\.)benchmark\.com(\/|$)/i,
  /(^|\.)foundersfund\.com(\/|$)/i,
  /(^|\.)gv\.com(\/|$)/i,
  /(^|\.)indexventures\.com(\/|$)/i,
  /(^|\.)thrivecap\.com(\/|$)/i,
  /(^|\.)redpoint\.com(\/|$)/i,
  /(^|\.)ycombinator\.com(\/|$)/i,
  /(^|\.)blog\.ycombinator\.com(\/|$)/i,
  // Academic centers / labs (when not on .edu)
  /(^|\.)crfm\.stanford\.edu(\/|$)/i,
  /(^|\.)hai\.stanford\.edu(\/|$)/i,
  /(^|\.)csail\.mit\.edu(\/|$)/i,
  // Vertical trade press
  /(^|\.)agfundernews\.com(\/|$)/i,
  /(^|\.)agtechnavigator\.com(\/|$)/i,
  /(^|\.)hospitalitynet\.org(\/|$)/i,
  /(^|\.)phocuswire\.com(\/|$)/i,
  /(^|\.)skift\.com(\/|$)/i,
  /(^|\.)kitces\.com(\/|$)/i,
  /(^|\.)investmentnews\.com(\/|$)/i,
  /(^|\.)financial-planning\.com(\/|$)/i,
  /(^|\.)wealthmanagement\.com(\/|$)/i,
  /(^|\.)pymnts\.com(\/|$)/i,
  /(^|\.)hospitalitytech\.com(\/|$)/i,
  /(^|\.)achrnews\.com(\/|$)/i,
  /(^|\.)pmmag\.com(\/|$)/i,
  /(^|\.)ecmweb\.com(\/|$)/i,
  // Strategy + research firms
  /(^|\.)hbr\.org(\/|$)/i,
  /(^|\.)mckinsey\.com(\/|$)/i,
  /(^|\.)bcg\.com(\/|$)/i,
  /(^|\.)bain\.com(\/|$)/i,
  /(^|\.)deloitte\.com(\/|$)/i,
  /(^|\.)pwc\.com(\/|$)/i,
  /(^|\.)kpmg\.com(\/|$)/i,
  /(^|\.)ey\.com(\/|$)/i,
  /(^|\.)accenture\.com(\/|$)/i,
  /(^|\.)oliverwyman\.com(\/|$)/i,
  /(^|\.)rolandberger\.com(\/|$)/i,
  /(^|\.)gartner\.com(\/|$)/i,
  /(^|\.)forrester\.com(\/|$)/i,
  /(^|\.)idc\.com(\/|$)/i,
  /(^|\.)cbinsights\.com(\/|$)/i,
  // Cybersecurity + IT trade press
  /(^|\.)crn\.com(\/|$)/i,
  /(^|\.)darkreading\.com(\/|$)/i,
  /(^|\.)bleepingcomputer\.com(\/|$)/i,
  /(^|\.)scmagazine\.com(\/|$)/i,
  /(^|\.)securityweek\.com(\/|$)/i,
  /(^|\.)threatpost\.com(\/|$)/i,
  /(^|\.)thehackernews\.com(\/|$)/i,
  /(^|\.)cyberscoop\.com(\/|$)/i,
  /(^|\.)cybersecuritydive\.com(\/|$)/i,
  /(^|\.)securitybrief\.ca(\/|$)/i,
  /(^|\.)securitybrief\.com\.au(\/|$)/i,
  /(^|\.)securitybrief\.co\.nz(\/|$)/i,
  /(^|\.)securitybrief\.eu(\/|$)/i,
  /(^|\.)yahoo\.com(\/|$)/i,
  /(^|\.)finance\.yahoo\.com(\/|$)/i,
  /(^|\.)cnet\.com(\/|$)/i,
  /(^|\.)infosecurity-magazine\.com(\/|$)/i,
  /(^|\.)siliconrepublic\.com(\/|$)/i,
  /(^|\.)theregister\.com(\/|$)/i,
  /(^|\.)zdnet\.com(\/|$)/i,
  /(^|\.)computerworld\.com(\/|$)/i,
  /(^|\.)infoworld\.com(\/|$)/i,
  // CB-Insights / VC analyst publications
  /(^|\.)notablecap\.com(\/|$)/i,
  /(^|\.)cognitionhub\.com(\/|$)/i,
  /(^|\.)iris\.vc(\/|$)/i,
];

export interface Reference {
  index: number;
  rawLine: string;
  url: string | null;
  domain: string | null;
  tier: Tier;
  classifyReason: string;
}

export interface ClaimSpan {
  type: "dollar" | "percent" | "named-funding" | "named-count";
  matchedText: string;
  surroundingContext: string;
  forwardDated: boolean;
  hasInlineCitation: boolean;
  citationIds: number[];
}

export function extractDomain(url: string): string | null {
  try {
    return new URL(url).hostname.toLowerCase();
  } catch {
    return null;
  }
}

export function classifyTier(
  url: string | null,
  domain: string | null,
): { tier: Tier; reason: string } {
  if (!url || !domain) return { tier: "unknown", reason: "no parseable URL" };
  for (const re of PRIMARY_PATTERNS) {
    if (re.test(domain)) return { tier: "primary", reason: `primary domain: ${domain}` };
  }
  for (const fragment of PRIMARY_PATH_FRAGMENTS) {
    if (url.toLowerCase().includes(fragment)) {
      return { tier: "primary", reason: `primary path fragment: ${fragment}` };
    }
  }
  for (const re of SECONDARY_PATTERNS) {
    if (re.test(domain)) return { tier: "secondary", reason: `secondary domain: ${domain}` };
  }
  return { tier: "tertiary", reason: `unrecognized domain: ${domain}` };
}

function findReferencesSection(lines: string[]): number {
  for (let i = lines.length - 1; i >= 0; i--) {
    const m = lines[i].match(/^#{1,3}\s+(References|Sources|Citations|Footnotes|Notes)\s*$/i);
    if (m) return i;
  }
  return -1;
}

export function extractReferences(body: string): {
  refs: Reference[];
  sectionStart: number;
} {
  const lines = body.split("\n");
  const refs: Reference[] = [];

  // Pass 1: footnote-definition syntax `[^N]: text URL`.
  const footnoteRe = /^\[\^([\w-]+)\]:\s+(.*)$/;
  let earliestFootnoteLine = -1;
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(footnoteRe);
    if (!m) continue;
    if (earliestFootnoteLine < 0) earliestFootnoteLine = i;
    const idStr = m[1];
    const idNum = /^\d+$/.test(idStr) ? parseInt(idStr, 10) : refs.length + 1;
    let rawLine = m[2];
    let j = i + 1;
    while (j < lines.length && /^\s{2,}\S/.test(lines[j])) {
      rawLine += " " + lines[j].trim();
      j++;
    }
    const urlMatch = rawLine.match(/https?:\/\/[^\s)]+/);
    const url = urlMatch ? urlMatch[0].replace(/[.,;:]+$/, "") : null;
    const domain = url ? extractDomain(url) : null;
    const { tier, reason } = classifyTier(url, domain);
    refs.push({ index: idNum, rawLine, url, domain, tier, classifyReason: reason });
  }
  if (refs.length > 0) return { refs, sectionStart: earliestFootnoteLine };

  // Pass 2: heading-delimited references list. Read all remaining lines (sub-
  // headings within are category labels, not section terminators).
  const sectionStart = findReferencesSection(lines);
  if (sectionStart < 0) return { refs: [], sectionStart: -1 };

  const refLines: string[] = [];
  for (let i = sectionStart + 1; i < lines.length; i++) {
    const line = lines[i];
    if (/^#{1,3}\s+/.test(line)) continue;
    if (line.trim().length > 0) refLines.push(line);
  }

  let currentRef: string[] = [];
  let currentIndex = 0;
  const flush = () => {
    if (currentRef.length === 0) return;
    const rawLine = currentRef.join(" ").trim();
    const urlMatch = rawLine.match(/https?:\/\/[^\s)]+/);
    const url = urlMatch ? urlMatch[0].replace(/[.,;:]+$/, "") : null;
    const domain = url ? extractDomain(url) : null;
    const { tier, reason } = classifyTier(url, domain);
    refs.push({ index: currentIndex, rawLine, url, domain, tier, classifyReason: reason });
    currentRef = [];
  };
  for (const line of refLines) {
    const numberedStart = line.match(/^\s*(\d+)\.\s+/);
    if (numberedStart) {
      flush();
      currentIndex = parseInt(numberedStart[1], 10);
      currentRef.push(line.replace(/^\s*\d+\.\s+/, ""));
    } else if (/^\s*[-*]\s+/.test(line)) {
      flush();
      currentIndex += 1;
      currentRef.push(line.replace(/^\s*[-*]\s+/, ""));
    } else {
      currentRef.push(line);
    }
  }
  flush();
  return { refs, sectionStart };
}

const CLAIM_PATTERNS: { type: ClaimSpan["type"]; pattern: RegExp }[] = [
  { type: "dollar", pattern: /\$[\d.,]+\s?(?:M|B|T|million|billion|trillion)\b/gi },
  { type: "percent", pattern: /\b\d+(?:\.\d+)?%/g },
  { type: "named-funding", pattern: /\bSeries\s[A-G]\b/g },
  {
    type: "named-count",
    pattern: /\b\d{1,3}(?:,\d{3})+\s+(?:customers|users|professionals|members|employees|contractors|advisors|hospitals|firms|institutions|locations|attendees|farms|stores|properties)\b/gi,
  },
];

function scanInlineCitation(ctx: string): {
  hasInlineCitation: boolean;
  citationIds: number[];
} {
  const ids = new Set<number>();
  for (const m of ctx.matchAll(/\[\^(\d+)\]/g)) ids.add(parseInt(m[1], 10));
  for (const m of ctx.matchAll(/\[(\d+)\](?!\()/g)) ids.add(parseInt(m[1], 10));
  return { hasInlineCitation: ids.size > 0, citationIds: [...ids] };
}

export function extractClaims(body: string, refsSectionStart: number): ClaimSpan[] {
  const lines = body.split("\n");
  const bodyOnly =
    refsSectionStart >= 0 ? lines.slice(0, refsSectionStart).join("\n") : body;
  const claims: ClaimSpan[] = [];
  const seen = new Set<string>();
  for (const { type, pattern } of CLAIM_PATTERNS) {
    const re = new RegExp(pattern.source, pattern.flags);
    let m: RegExpExecArray | null;
    while ((m = re.exec(bodyOnly)) !== null) {
      const matchedText = m[0];
      const idx = m.index;
      const bucket = `${type}:${matchedText}:${Math.floor(idx / 200)}`;
      if (seen.has(bucket)) continue;
      seen.add(bucket);
      const ctx = bodyOnly.slice(Math.max(0, idx - 80), idx + matchedText.length + 80);
      const forwardDated = /\b20(?:2[6-9]|3\d)\b/.test(ctx);
      const { hasInlineCitation, citationIds } = scanInlineCitation(ctx);
      claims.push({
        type,
        matchedText,
        surroundingContext: ctx.replace(/\n+/g, " "),
        forwardDated,
        hasInlineCitation,
        citationIds,
      });
    }
  }
  return claims;
}

export interface ClaimAuditMetrics {
  refsTotal: number;
  refsByTier: Record<Tier, number>;
  refsWithUrl: number;
  primarySecondaryShare: number;
  tertiaryShare: number;
  claimsDetected: number;
  claimsCited: number;
  citationCoverage: number;
  forwardDatedClaims: number;
  forwardDatedUncited: number;
  orphanCitations: number[];
}

export function computeMetrics(refs: Reference[], claims: ClaimSpan[]): ClaimAuditMetrics {
  const refsByTier: Record<Tier, number> = {
    primary: 0,
    secondary: 0,
    tertiary: 0,
    unknown: 0,
  };
  for (const r of refs) refsByTier[r.tier]++;
  const refsWithUrl = refs.filter((r) => r.url).length;
  const refsTotal = refs.length;
  const primarySecondaryShare =
    refsTotal > 0 ? (refsByTier.primary + refsByTier.secondary) / refsTotal : 0;
  const tertiaryShare =
    refsTotal > 0 ? (refsByTier.tertiary + refsByTier.unknown) / refsTotal : 0;

  const claimsDetected = claims.length;
  const claimsCited = claims.filter((c) => c.hasInlineCitation).length;
  const citationCoverage = claimsDetected > 0 ? claimsCited / claimsDetected : 1;

  let forwardDatedUncited = 0;
  const refIndex = new Set(refs.map((r) => r.index));
  const orphanSet = new Set<number>();
  for (const c of claims) {
    if (!c.forwardDated) continue;
    if (c.citationIds.length === 0) {
      forwardDatedUncited++;
      continue;
    }
    const cited = c.citationIds.map((id) => refs.find((r) => r.index === id)).filter(Boolean);
    if (
      cited.length === 0 ||
      cited.every((r) => r!.tier === "tertiary" || r!.tier === "unknown")
    ) {
      forwardDatedUncited++;
    }
    for (const id of c.citationIds) {
      if (!refIndex.has(id)) orphanSet.add(id);
    }
  }
  const forwardDatedClaims = claims.filter((c) => c.forwardDated).length;

  return {
    refsTotal,
    refsByTier,
    refsWithUrl,
    primarySecondaryShare,
    tertiaryShare,
    claimsDetected,
    claimsCited,
    citationCoverage,
    forwardDatedClaims,
    forwardDatedUncited,
    orphanCitations: [...orphanSet],
  };
}

export interface VerifyGateResult {
  pass: boolean;
  failures: string[];
  metrics: ClaimAuditMetrics;
  profile: PaperProfile;
}

/**
 * Source-count quotas + word-count ceilings keyed off paper profile. The profile
 * is declared in frontmatter (`profile: authority-survey | field-manual |
 * technical-playbook | failure-mode | hedged`) and selects the verify-gate
 * thresholds.
 */
export type PaperProfile =
  | "authority-survey"
  | "field-manual"
  | "technical-playbook"
  | "failure-mode"
  | "hedged";

export interface ProfileQuotas {
  primaryMin: number;
  secondaryMin: number;
  tertiaryShareMax: number;          // tertiary+unknown / total
  primarySecondaryShareMin: number;  // primary+secondary / total
  citationCoverageMin: number;       // claimsCited / claimsDetected
  wordCeilingMultiplier: number;     // 1.0 = strict, >1 = lenient
  hedgedProseRequired: boolean;      // every numeric claim must be in attributed form
}

export const PROFILE_QUOTAS: Record<PaperProfile, ProfileQuotas> = {
  "authority-survey": {
    primaryMin: 30,
    secondaryMin: 20,
    tertiaryShareMax: 0.25,
    primarySecondaryShareMin: 0.65,
    citationCoverageMin: 0.85,
    wordCeilingMultiplier: 1.0,
    hedgedProseRequired: false,
  },
  "field-manual": {
    primaryMin: 25,
    secondaryMin: 15,
    tertiaryShareMax: 0.20,
    primarySecondaryShareMin: 0.60,
    citationCoverageMin: 0.80,
    wordCeilingMultiplier: 1.0,
    hedgedProseRequired: false,
  },
  "technical-playbook": {
    primaryMin: 20,
    secondaryMin: 15,
    tertiaryShareMax: 0.15,
    primarySecondaryShareMin: 0.65,
    citationCoverageMin: 0.80,
    wordCeilingMultiplier: 1.0,
    hedgedProseRequired: false,
  },
  "failure-mode": {
    primaryMin: 15,
    secondaryMin: 12,
    tertiaryShareMax: 0.20,
    primarySecondaryShareMin: 0.60,
    citationCoverageMin: 0.80,
    wordCeilingMultiplier: 1.0,
    hedgedProseRequired: false,
  },
  hedged: {
    primaryMin: 5,
    secondaryMin: 5,
    tertiaryShareMax: 0.50,
    primarySecondaryShareMin: 0.30,
    citationCoverageMin: 0.95,         // tightest — every claim must be cited
    wordCeilingMultiplier: 0.7,         // shorter papers
    hedgedProseRequired: true,           // every numeric claim must be in attributed prose form
  },
};

export function wordCeiling(metrics: ClaimAuditMetrics, profile: PaperProfile): number {
  const base =
    200 * metrics.refsByTier.primary +
    100 * metrics.refsByTier.secondary +
    50 * (metrics.refsByTier.tertiary + metrics.refsByTier.unknown);
  return Math.round(base * PROFILE_QUOTAS[profile].wordCeilingMultiplier);
}

/**
 * Detect whether the body uses hedged-prose pattern: "Per X, Y" / "Per X's
 * announcement," / "According to X" — i.e., the source is in the prose, not
 * orphaned in the footnote. Returns the share of forward-dated claims whose
 * surrounding context contains an attribution phrase.
 */
function hedgedProseShare(claims: ClaimSpan[]): number {
  const fwd = claims.filter((c) => c.forwardDated);
  if (fwd.length === 0) return 1;
  const attributionRe =
    /\b(per|according to|as reported by|reported by|announced by|filed by|cited by|via)\b/i;
  const attributed = fwd.filter((c) => attributionRe.test(c.surroundingContext)).length;
  return attributed / fwd.length;
}

/**
 * Layer 1+2 hard gate. Returns pass=false with failure list on any blocking issue.
 * Quotas vary by `profile` (declared in frontmatter); defaults to `authority-survey`.
 */
export function runVerifyGate(
  refs: Reference[],
  claims: ClaimSpan[],
  profile: PaperProfile = "authority-survey",
  bodyWordCount?: number,
): VerifyGateResult {
  const metrics = computeMetrics(refs, claims);
  const quotas = PROFILE_QUOTAS[profile];
  const failures: string[] = [];

  // Layer 1 — references
  if (refs.length === 0) {
    failures.push(
      "Layer 1: no references section detected (need `[^N]:` footnotes or `## References` numbered list)",
    );
  } else if (metrics.refsWithUrl === 0) {
    failures.push(
      `Layer 1: ${refs.length} references found but ZERO have URLs — references are not sources`,
    );
  } else {
    if (metrics.refsByTier.primary < quotas.primaryMin) {
      failures.push(
        `Layer 1: only ${metrics.refsByTier.primary} primary refs (need ≥${quotas.primaryMin} for profile=${profile})`,
      );
    }
    if (metrics.refsByTier.secondary < quotas.secondaryMin) {
      failures.push(
        `Layer 1: only ${metrics.refsByTier.secondary} secondary refs (need ≥${quotas.secondaryMin} for profile=${profile})`,
      );
    }
    if (metrics.primarySecondaryShare < quotas.primarySecondaryShareMin) {
      failures.push(
        `Layer 1: primary+secondary share ${(metrics.primarySecondaryShare * 100).toFixed(0)}% < ${(quotas.primarySecondaryShareMin * 100).toFixed(0)}% required for profile=${profile}`,
      );
    }
    if (metrics.tertiaryShare > quotas.tertiaryShareMax) {
      failures.push(
        `Layer 1: tertiary+unknown share ${(metrics.tertiaryShare * 100).toFixed(0)}% > ${(quotas.tertiaryShareMax * 100).toFixed(0)}% cap for profile=${profile}`,
      );
    }
  }

  // Layer 2 — coverage
  if (metrics.claimsDetected >= 10 && metrics.citationCoverage < quotas.citationCoverageMin) {
    failures.push(
      `Layer 2: inline citation coverage ${(metrics.citationCoverage * 100).toFixed(1)}% < ${(quotas.citationCoverageMin * 100).toFixed(0)}% required (${metrics.claimsCited}/${metrics.claimsDetected})`,
    );
  }
  if (metrics.forwardDatedUncited > 0) {
    failures.push(
      `Layer 2: ${metrics.forwardDatedUncited} forward-dated claims uncited or backed only by tertiary sources`,
    );
  }
  if (metrics.orphanCitations.length > 0) {
    failures.push(
      `Layer 2: orphan citations [${metrics.orphanCitations.slice(0, 10).join(", ")}] reference IDs that don't exist in References section`,
    );
  }

  // Layer 2b — hedged-prose (only enforced when profile demands it)
  if (quotas.hedgedProseRequired) {
    const share = hedgedProseShare(claims);
    if (share < 0.9) {
      failures.push(
        `Layer 2b: hedged profile requires attributed-prose pattern ("Per X, Y") on ≥90% of forward-dated claims; only ${(share * 100).toFixed(0)}% qualify`,
      );
    }
  }

  // Layer 3 — word ceiling
  if (typeof bodyWordCount === "number") {
    const ceiling = wordCeiling(metrics, profile);
    if (bodyWordCount > ceiling && ceiling > 0) {
      failures.push(
        `Layer 3: word count ${bodyWordCount} exceeds source-supported ceiling ${ceiling} (formula: 200×primary + 100×secondary + 50×tertiary, profile multiplier ${quotas.wordCeilingMultiplier})`,
      );
    }
  }

  return { pass: failures.length === 0, failures, metrics, profile };
}

// ----------------------------------------------------------------------------
// Layer 4 — URL liveness check (env-gated, optional)
// ----------------------------------------------------------------------------

export interface FidelityResult {
  url: string;
  refIndex: number;
  status: number | null;
  ok: boolean;
  error?: string;
}

/**
 * HEAD-request each cited URL with the given timeout. Returns per-URL liveness.
 * Off by default; gate this behind `VERIFY_CLAIM_FIDELITY=1` in the caller.
 *
 * Note: HEAD-only is intentional V1. Some sites block HEAD (will need GET fallback);
 * some sites are SPA-rendered (text-content match would require headless browser).
 * Both are V2 work.
 */
export async function checkUrlLiveness(
  refs: Reference[],
  options: { timeoutMs?: number; concurrency?: number } = {},
): Promise<FidelityResult[]> {
  const timeoutMs = options.timeoutMs ?? 8000;
  const concurrency = options.concurrency ?? 4;
  const queue = refs.filter((r) => r.url);
  const results: FidelityResult[] = [];

  async function fetchOne(ref: Reference): Promise<FidelityResult> {
    const url = ref.url!;
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), timeoutMs);
    try {
      const res = await fetch(url, {
        method: "HEAD",
        redirect: "follow",
        signal: ctl.signal,
        headers: {
          "User-Agent": "perea-research-engine/1.0 (+https://perea.ai)",
        },
      });
      clearTimeout(timer);
      // Some servers return 403/405 to HEAD but serve GET; treat 4xx (not 404)
      // as soft-pass when liveness is the only question.
      const ok = res.ok || res.status === 403 || res.status === 405 || res.status === 401;
      return { url, refIndex: ref.index, status: res.status, ok };
    } catch (err) {
      clearTimeout(timer);
      return {
        url,
        refIndex: ref.index,
        status: null,
        ok: false,
        error: (err as Error).message,
      };
    }
  }

  // Simple chunked concurrency
  for (let i = 0; i < queue.length; i += concurrency) {
    const batch = queue.slice(i, i + concurrency);
    const batchResults = await Promise.all(batch.map(fetchOne));
    results.push(...batchResults);
  }
  return results;
}

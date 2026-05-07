/**
 * audit-published-claims.ts
 *
 * One-shot retrofit audit for the existing whitepaper canon. Reads each paper,
 * extracts references + body claims, classifies references by domain, computes
 * inline-citation coverage, and flags forward-dated claims backed by tertiary
 * sources.
 *
 * Usage:
 *   npx tsx scripts/audit-published-claims.ts                  # all papers
 *   npx tsx scripts/audit-published-claims.ts <slug>           # one paper
 *
 * Writes per-paper reports to ../../.claude/skills/perea-research-engine/state/audit/<slug>.md
 * and a summary index at .../audit/INDEX.md.
 */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const CONTENT_DIR = path.join(process.cwd(), "content", "whitepapers");
const AUDIT_OUT_DIR = path.join(
  process.env.HOME || "",
  ".claude",
  "skills",
  "perea-research-engine",
  "state",
  "audit",
);

type Tier = "primary" | "secondary" | "tertiary" | "unknown";

const PRIMARY_PATTERNS: RegExp[] = [
  /(^|\.)sec\.gov(\/|$)/i,
  /(^|\.)edgar\.sec\.gov(\/|$)/i,
  /(^|\.)gov(\/|$)/i,
  /(^|\.)gov\.uk(\/|$)/i,
  /(^|\.)gov\.eu(\/|$)/i,
  /(^|\.)europa\.eu(\/|$)/i,
  /(^|\.)gc\.ca(\/|$)/i,
  /(^|\.)edu(\/|$)/i,
  /(^|\.)arxiv\.org(\/|$)/i,
  /(^|\.)ssrn\.com(\/|$)/i,
  /(^|\.)pubmed\.ncbi\.nlm\.nih\.gov(\/|$)/i,
  /(^|\.)nature\.com(\/|$)/i,
  /(^|\.)science\.org(\/|$)/i,
  /(^|\.)prnewswire\.com(\/|$)/i,
  /(^|\.)businesswire\.com(\/|$)/i,
  /(^|\.)globenewswire\.com(\/|$)/i,
  /(^|\.)ietf\.org(\/|$)/i,
  /(^|\.)iso\.org(\/|$)/i,
  /(^|\.)w3\.org(\/|$)/i,
  /(^|\.)oasis-open\.org(\/|$)/i,
  /(^|\.)nist\.gov(\/|$)/i,
  /(^|\.)fda\.gov(\/|$)/i,
  /(^|\.)cms\.gov(\/|$)/i,
  /(^|\.)cdc\.gov(\/|$)/i,
  /(^|\.)uspto\.gov(\/|$)/i,
  /(^|\.)usda\.gov(\/|$)/i,
  /(^|\.)federalreserve\.gov(\/|$)/i,
];

// URL path fragments that indicate primary-source even on a vendor domain
const PRIMARY_PATH_FRAGMENTS = [
  "/press/",
  "/press-release",
  "/press-releases",
  "/news/",
  "/newsroom",
  "/investor-relations",
  "/investors/",
  "/research-insights/",
  "/research/",
  "/corporate/",
  "/about/news",
];

const SECONDARY_PATTERNS: RegExp[] = [
  /(^|\.)bloomberg\.com(\/|$)/i,
  /(^|\.)reuters\.com(\/|$)/i,
  /(^|\.)wsj\.com(\/|$)/i,
  /(^|\.)ft\.com(\/|$)/i,
  /(^|\.)nytimes\.com(\/|$)/i,
  /(^|\.)washingtonpost\.com(\/|$)/i,
  /(^|\.)economist\.com(\/|$)/i,
  /(^|\.)techcrunch\.com(\/|$)/i,
  /(^|\.)theverge\.com(\/|$)/i,
  /(^|\.)wired\.com(\/|$)/i,
  /(^|\.)theinformation\.com(\/|$)/i,
  /(^|\.)fortune\.com(\/|$)/i,
  /(^|\.)forbes\.com(\/|$)/i,
  /(^|\.)businessinsider\.com(\/|$)/i,
  /(^|\.)crunchbase\.com(\/|$)/i,
  /(^|\.)pitchbook\.com(\/|$)/i,
  /(^|\.)tracxn\.com(\/|$)/i,
  /(^|\.)siliconangle\.com(\/|$)/i,
  /(^|\.)axios\.com(\/|$)/i,
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
  /(^|\.)hbr\.org(\/|$)/i,
  /(^|\.)mckinsey\.com(\/|$)/i,
  /(^|\.)bcg\.com(\/|$)/i,
  /(^|\.)bain\.com(\/|$)/i,
  /(^|\.)deloitte\.com(\/|$)/i,
  /(^|\.)pwc\.com(\/|$)/i,
  /(^|\.)kpmg\.com(\/|$)/i,
  /(^|\.)ey\.com(\/|$)/i,
  /(^|\.)gartner\.com(\/|$)/i,
  /(^|\.)forrester\.com(\/|$)/i,
  /(^|\.)idc\.com(\/|$)/i,
  /(^|\.)hospitalitytech\.com(\/|$)/i,
];

interface Reference {
  index: number;
  rawLine: string;
  url: string | null;
  domain: string | null;
  tier: Tier;
  classifyReason: string;
}

interface Paper {
  slug: string;
  filePath: string;
  frontmatter: Record<string, unknown>;
  body: string;
  references: Reference[];
  refsSectionStart: number; // index in lines where the references section begins
}

interface ClaimSpan {
  type: "dollar" | "percent" | "named-funding" | "named-count";
  matchedText: string;
  surroundingContext: string;
  forwardDated: boolean;
  hasInlineCitation: boolean;
  citationIds: number[];
}

interface AuditReport {
  slug: string;
  title: string;
  wordCount: number;
  refsTotal: number;
  refsByTier: Record<Tier, number>;
  refsTertiaryDetail: Reference[];
  claimsDetected: number;
  claimsCited: number;
  citationCoverage: number; // 0..1
  forwardDatedClaims: number;
  forwardDatedClaimsBackedByTertiary: number;
  riskFlags: string[];
  verdict: "PASS" | "WARN" | "FAIL";
}

// ----------------------------------------------------------------------------
// Reference parsing
// ----------------------------------------------------------------------------

function findReferencesSection(lines: string[]): number {
  // Look for `# References`, `## References`, `## Sources`, `## Footnotes`, etc.
  for (let i = lines.length - 1; i >= 0; i--) {
    const m = lines[i].match(/^#{1,3}\s+(References|Sources|Citations|Footnotes|Notes)\s*$/i);
    if (m) return i;
  }
  return -1;
}

function findFirstFootnoteDefinition(body: string): number {
  // Footnote-definition syntax: a line starting `[^N]: ...`
  const lines = body.split("\n");
  for (let i = 0; i < lines.length; i++) {
    if (/^\[\^[\w-]+\]:\s/.test(lines[i])) return i;
  }
  return -1;
}

function extractReferences(body: string): { refs: Reference[]; sectionStart: number } {
  const lines = body.split("\n");
  const refs: Reference[] = [];

  // Pass 1: footnote-definition syntax `[^N]: text URL` (highest precedence,
  // since it's the load-bearing pattern used by the well-cited papers).
  const footnoteRe = /^\[\^([\w-]+)\]:\s+(.*)$/;
  let earliestFootnoteLine = -1;
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(footnoteRe);
    if (!m) continue;
    if (earliestFootnoteLine < 0) earliestFootnoteLine = i;
    const idStr = m[1];
    const idNum = /^\d+$/.test(idStr) ? parseInt(idStr, 10) : refs.length + 1;
    let rawLine = m[2];
    // continuation lines (indented) belong to this footnote
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
  if (refs.length > 0) {
    return { refs, sectionStart: earliestFootnoteLine };
  }

  // Pass 2: heading-delimited references list `## References` / `## Sources`.
  // The references section is conventionally the LAST section in a paper, so
  // we read all remaining lines and only treat sub-headings as category labels
  // (not section terminators).
  const sectionStart = findReferencesSection(lines);
  if (sectionStart < 0) return { refs: [], sectionStart: -1 };

  const refLines: string[] = [];
  for (let i = sectionStart + 1; i < lines.length; i++) {
    const line = lines[i];
    if (/^#{1,3}\s+/.test(line)) continue; // skip sub-category headings, do not break
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

function extractDomain(url: string): string | null {
  try {
    return new URL(url).hostname.toLowerCase();
  } catch {
    return null;
  }
}

function classifyTier(
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

// ----------------------------------------------------------------------------
// Claim extraction
// ----------------------------------------------------------------------------

const CLAIM_PATTERNS: { type: ClaimSpan["type"]; pattern: RegExp }[] = [
  // Dollar figures with M/B/T suffix (only "real money" — skip $X without unit)
  {
    type: "dollar",
    pattern: /\$[\d.,]+\s?(?:M|B|T|million|billion|trillion)\b/gi,
  },
  // Percentages
  {
    type: "percent",
    pattern: /\b\d+(?:\.\d+)?%/g,
  },
  // Named funding rounds
  {
    type: "named-funding",
    pattern: /\bSeries\s[A-G]\b/g,
  },
  // Named counts with comma thousands (e.g., "9,500 customers", "200,000 users")
  {
    type: "named-count",
    pattern: /\b\d{1,3}(?:,\d{3})+\s+(?:customers|users|professionals|members|employees|contractors|advisors|hospitals|firms|institutions|locations|attendees|farms|stores|properties)\b/gi,
  },
];

function extractClaims(body: string, refsSectionStart: number): ClaimSpan[] {
  const lines = body.split("\n");
  const bodyOnly =
    refsSectionStart >= 0 ? lines.slice(0, refsSectionStart).join("\n") : body;

  const claims: ClaimSpan[] = [];
  const seen = new Set<string>(); // dedupe by matched text + position bucket

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

function scanInlineCitation(ctx: string): {
  hasInlineCitation: boolean;
  citationIds: number[];
} {
  const ids = new Set<number>();
  // Footnote markers `[^N]`
  for (const m of ctx.matchAll(/\[\^(\d+)\]/g)) {
    ids.add(parseInt(m[1], 10));
  }
  // Bracketed numbers `[N]` (avoid markdown link syntax `[text](url)`)
  for (const m of ctx.matchAll(/\[(\d+)\](?!\()/g)) {
    ids.add(parseInt(m[1], 10));
  }
  // Parenthetical references like `(Reuters, 2026)` count as soft-citation only,
  // not enough to satisfy the gate; skip.
  return { hasInlineCitation: ids.size > 0, citationIds: [...ids] };
}

// ----------------------------------------------------------------------------
// Audit pass
// ----------------------------------------------------------------------------

function auditPaper(slug: string): AuditReport {
  const filePath = path.join(CONTENT_DIR, `${slug}.md`);
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  const fm = data as Record<string, unknown>;

  const { refs, sectionStart } = extractReferences(content);
  const claims = extractClaims(content, sectionStart);

  const refsByTier: Record<Tier, number> = {
    primary: 0,
    secondary: 0,
    tertiary: 0,
    unknown: 0,
  };
  for (const r of refs) refsByTier[r.tier]++;
  const refsTertiaryDetail = refs.filter((r) => r.tier === "tertiary" || r.tier === "unknown");

  const claimsDetected = claims.length;
  const claimsCited = claims.filter((c) => c.hasInlineCitation).length;
  const citationCoverage = claimsDetected > 0 ? claimsCited / claimsDetected : 1;
  const forwardDatedClaims = claims.filter((c) => c.forwardDated).length;

  // For each forward-dated claim, check whether its inline citations
  // (if any) point to primary refs. If no inline citation OR all cited refs
  // are tertiary/unknown, flag.
  let forwardDatedBackedByTertiary = 0;
  for (const c of claims) {
    if (!c.forwardDated) continue;
    if (c.citationIds.length === 0) {
      forwardDatedBackedByTertiary++;
      continue;
    }
    const cited = c.citationIds.map((id) => refs.find((r) => r.index === id)).filter(Boolean);
    if (cited.length === 0 || cited.every((r) => r!.tier === "tertiary" || r!.tier === "unknown")) {
      forwardDatedBackedByTertiary++;
    }
  }

  const refsWithUrl = refs.filter((r) => r.url).length;
  const urlCoverage = refs.length > 0 ? refsWithUrl / refs.length : 0;
  const primarySecondaryShare =
    refs.length > 0 ? (refsByTier.primary + refsByTier.secondary) / refs.length : 0;

  const riskFlags: string[] = [];
  if (refs.length === 0) {
    riskFlags.push("no references section detected");
  } else if (refsWithUrl === 0) {
    riskFlags.push(`${refs.length} references have no URL (unsourced text-only)`);
  } else {
    if (urlCoverage < 0.5) riskFlags.push(`only ${(urlCoverage * 100).toFixed(0)}% of refs have a URL`);
    if (primarySecondaryShare < 0.3)
      riskFlags.push(`primary+secondary share only ${(primarySecondaryShare * 100).toFixed(0)}%`);
  }
  if (citationCoverage < 0.3 && claimsDetected >= 10)
    riskFlags.push(`inline citation coverage ${(citationCoverage * 100).toFixed(0)}% over ${claimsDetected} claims`);
  if (forwardDatedBackedByTertiary >= 10)
    riskFlags.push(`${forwardDatedBackedByTertiary} forward-dated claims uncited or w/ tertiary-only citation`);

  let verdict: AuditReport["verdict"] = "PASS";
  // Hard FAIL: no refs at all, all refs unsourced, or all-tertiary with high forward-dated burden
  if (
    refs.length === 0 ||
    refsWithUrl === 0 ||
    (primarySecondaryShare === 0 && forwardDatedBackedByTertiary >= 10)
  ) {
    verdict = "FAIL";
  } else if (
    forwardDatedBackedByTertiary >= 10 ||
    citationCoverage < 0.3 ||
    primarySecondaryShare < 0.3
  ) {
    verdict = "WARN";
  }

  const wordCount = content.split(/\s+/).filter(Boolean).length;
  return {
    slug,
    title: (fm.title as string) || slug,
    wordCount,
    refsTotal: refs.length,
    refsByTier,
    refsTertiaryDetail,
    claimsDetected,
    claimsCited,
    citationCoverage,
    forwardDatedClaims,
    forwardDatedClaimsBackedByTertiary: forwardDatedBackedByTertiary,
    riskFlags,
    verdict,
  };
}

// ----------------------------------------------------------------------------
// Output
// ----------------------------------------------------------------------------

function writeReport(report: AuditReport, refs: Reference[], claims: ClaimSpan[]) {
  if (!fs.existsSync(AUDIT_OUT_DIR)) fs.mkdirSync(AUDIT_OUT_DIR, { recursive: true });
  const out = path.join(AUDIT_OUT_DIR, `${report.slug}.md`);
  const flaggedClaims = claims.filter((c) => c.forwardDated).slice(0, 25);

  const lines = [
    `# Audit: ${report.slug}`,
    "",
    `**Title:** ${report.title}`,
    `**Word count:** ${report.wordCount}`,
    `**Verdict:** ${report.verdict}`,
    "",
    "## Risk Flags",
    report.riskFlags.length === 0 ? "_none_" : report.riskFlags.map((f) => `- ${f}`).join("\n"),
    "",
    "## Reference Tiers",
    `| Tier | Count |`,
    `|---|---|`,
    `| primary | ${report.refsByTier.primary} |`,
    `| secondary | ${report.refsByTier.secondary} |`,
    `| tertiary | ${report.refsByTier.tertiary} |`,
    `| unknown | ${report.refsByTier.unknown} |`,
    `| **total** | ${report.refsTotal} |`,
    "",
    "## Citation Coverage",
    `- Numeric/dated/dollar/funding/count claims detected: **${report.claimsDetected}**`,
    `- Claims with inline citation marker (\`[^N]\` or \`[N]\`): **${report.claimsCited}**`,
    `- Coverage: **${(report.citationCoverage * 100).toFixed(1)}%**`,
    `- Forward-dated claims (year ≥ 2026): **${report.forwardDatedClaims}**`,
    `- Forward-dated claims with no primary citation: **${report.forwardDatedClaimsBackedByTertiary}**`,
    "",
  ];

  if (report.refsTertiaryDetail.length > 0) {
    lines.push("## Tertiary / Unknown References");
    lines.push("");
    for (const r of report.refsTertiaryDetail) {
      lines.push(`- [${r.tier}] ${r.url || "(no URL)"} — ${r.classifyReason}`);
      lines.push(`  > ${r.rawLine.slice(0, 200)}${r.rawLine.length > 200 ? "…" : ""}`);
    }
    lines.push("");
  }

  if (flaggedClaims.length > 0) {
    lines.push("## Forward-Dated Claims (sample, first 25)");
    lines.push("");
    for (const c of flaggedClaims) {
      const cited = c.citationIds.length > 0 ? `cited [${c.citationIds.join(",")}]` : "**uncited**";
      lines.push(`- [${c.type}] ${cited}: \`${c.matchedText}\``);
      lines.push(`  > …${c.surroundingContext.slice(0, 200)}${c.surroundingContext.length > 200 ? "…" : ""}…`);
    }
    lines.push("");
  }

  fs.writeFileSync(out, lines.join("\n"), "utf8");
  return out;
}

function writeIndex(reports: AuditReport[]) {
  const out = path.join(AUDIT_OUT_DIR, "INDEX.md");
  const sorted = [...reports].sort((a, b) => {
    const order = { FAIL: 0, WARN: 1, PASS: 2 } as const;
    return order[a.verdict] - order[b.verdict];
  });
  const lines = [
    `# Audit Index — ${reports.length} papers`,
    "",
    `**Generated:** ${new Date().toISOString()}`,
    "",
    "| Slug | Verdict | Refs (P/S/T/U) | Coverage | FwdDated/UncitedFwd |",
    "|---|---|---|---|---|",
  ];
  for (const r of sorted) {
    lines.push(
      `| [${r.slug}](./${r.slug}.md) | **${r.verdict}** | ${r.refsByTier.primary}/${r.refsByTier.secondary}/${r.refsByTier.tertiary}/${r.refsByTier.unknown} | ${(r.citationCoverage * 100).toFixed(0)}% | ${r.forwardDatedClaims}/${r.forwardDatedClaimsBackedByTertiary} |`,
    );
  }
  lines.push("");
  lines.push("## Verdict Summary");
  const counts = { FAIL: 0, WARN: 0, PASS: 0 };
  for (const r of reports) counts[r.verdict]++;
  lines.push(`- FAIL: ${counts.FAIL}`);
  lines.push(`- WARN: ${counts.WARN}`);
  lines.push(`- PASS: ${counts.PASS}`);
  fs.writeFileSync(out, lines.join("\n"), "utf8");
  return out;
}

// ----------------------------------------------------------------------------
// Main
// ----------------------------------------------------------------------------

async function main() {
  const arg = process.argv[2];
  let slugs: string[];
  if (arg) {
    slugs = [arg];
  } else {
    slugs = fs
      .readdirSync(CONTENT_DIR)
      .filter((f) => f.endsWith(".md"))
      .map((f) => f.replace(/\.md$/, ""));
  }

  console.log(`Auditing ${slugs.length} papers…`);
  const reports: AuditReport[] = [];
  for (const slug of slugs) {
    try {
      const filePath = path.join(CONTENT_DIR, `${slug}.md`);
      const raw = fs.readFileSync(filePath, "utf8");
      const { content } = matter(raw);
      const { refs, sectionStart } = extractReferences(content);
      const claims = extractClaims(content, sectionStart);
      const report = auditPaper(slug);
      reports.push(report);
      const out = writeReport(report, refs, claims);
      console.log(`  ${report.verdict.padEnd(4)} ${slug}  → ${out}`);
    } catch (err) {
      console.error(`  ERR  ${slug}: ${(err as Error).message}`);
    }
  }
  const indexOut = writeIndex(reports);
  console.log(`\nIndex: ${indexOut}`);
  console.log("\nSummary:");
  const counts = { FAIL: 0, WARN: 0, PASS: 0 };
  for (const r of reports) counts[r.verdict]++;
  console.log(`  FAIL: ${counts.FAIL}`);
  console.log(`  WARN: ${counts.WARN}`);
  console.log(`  PASS: ${counts.PASS}`);
}

main();

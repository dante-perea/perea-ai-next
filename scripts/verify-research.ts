/**
 * verify-research.ts
 *
 * Two-layer verify gate, run during the perea-research-engine `verifying` phase
 * (and manually before any whitepaper push):
 *
 *   Layer 0: shape — markdown parses, frontmatter contract, TOC, HTML structure.
 *   Layer 1: references — every cited [^N] resolves; tier mix passes.
 *   Layer 2: coverage — numeric/dated claims have inline citations.
 *
 * Exits 0 on pass, 1 on fail. Prints a diagnostic summary.
 *
 * Usage:
 *   npx tsx scripts/verify-research.ts                  # verify b2a-2026 (legacy default)
 *   npx tsx scripts/verify-research.ts <slug>           # verify one paper
 *   npx tsx scripts/verify-research.ts --all            # verify entire canon
 */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { getResearch, listResearch } from "../lib/research";
import {
  extractReferences,
  extractClaims,
  runVerifyGate,
  checkUrlLiveness,
  PROFILE_QUOTAS,
  type PaperProfile,
} from "../lib/research-claims";

const CONTENT_DIR = path.join(process.cwd(), "content", "whitepapers");

interface Outcome {
  slug: string;
  pass: boolean;
  failures: string[];
  shapeOK: boolean;
  metricsLine: string;
}

async function verifyOne(slug: string): Promise<Outcome> {
  // Layer 0: shape (existing checks)
  const paper = await getResearch(slug);
  if (!paper) {
    return {
      slug,
      pass: false,
      failures: [`Layer 0: getResearch failed to load paper ${slug}`],
      shapeOK: false,
      metricsLine: "",
    };
  }
  const shapeFailures: string[] = [];
  if (!paper.frontmatter.title) shapeFailures.push("Layer 0: missing frontmatter.title");
  if (!paper.toc || paper.toc.length === 0) shapeFailures.push("Layer 0: empty TOC");
  if (!paper.html.includes('class="r-h')) shapeFailures.push("Layer 0: no r-h heading classes in rendered HTML");
  const shapeOK = shapeFailures.length === 0;

  // Layer 1+2: references + coverage
  const filePath = path.join(CONTENT_DIR, `${slug}.md`);
  const raw = fs.readFileSync(filePath, "utf8");
  const { content, data: fm } = matter(raw);
  const { refs, sectionStart } = extractReferences(content);
  const claims = extractClaims(content, sectionStart);

  // Resolve profile from frontmatter; default authority-survey.
  const declaredProfile = (fm.profile as string | undefined) || "authority-survey";
  const profile: PaperProfile =
    declaredProfile in PROFILE_QUOTAS ? (declaredProfile as PaperProfile) : "authority-survey";

  // Body word count (excluding refs section)
  const bodyText =
    sectionStart >= 0
      ? content.split("\n").slice(0, sectionStart).join("\n")
      : content;
  const bodyWordCount = bodyText.split(/\s+/).filter(Boolean).length;

  const gate = runVerifyGate(refs, claims, profile, bodyWordCount);

  // Layer 4: URL liveness (env-gated)
  let fidelityFailures: string[] = [];
  if (process.env.VERIFY_CLAIM_FIDELITY === "1" && refs.length > 0) {
    const results = await checkUrlLiveness(refs);
    const dead = results.filter((r) => !r.ok);
    if (dead.length > 0) {
      fidelityFailures.push(
        `Layer 4: ${dead.length}/${results.length} cited URLs unreachable: ${dead.slice(0, 5).map((d) => `[${d.refIndex}] ${d.url} (${d.status ?? d.error})`).join("; ")}`,
      );
    }
  }

  const failures = [...shapeFailures, ...gate.failures, ...fidelityFailures];
  const m = gate.metrics;
  const metricsLine = `[${profile}] refs ${m.refsTotal} (P${m.refsByTier.primary}/S${m.refsByTier.secondary}/T${m.refsByTier.tertiary}/U${m.refsByTier.unknown}), claims ${m.claimsDetected}, cited ${m.claimsCited} (${(m.citationCoverage * 100).toFixed(0)}%), fwd-uncited ${m.forwardDatedUncited}, words ${bodyWordCount}`;

  return {
    slug,
    pass: failures.length === 0,
    failures,
    shapeOK,
    metricsLine,
  };
}

async function main() {
  const arg = process.argv[2];
  let slugs: string[];
  if (arg === "--all") {
    slugs = listResearch().map((p) => p.slug);
  } else if (arg && !arg.startsWith("--")) {
    slugs = [arg];
  } else {
    slugs = ["b2a-2026"]; // legacy default for backward compat with the loop's existing call
  }

  let anyFail = false;
  for (const slug of slugs) {
    const outcome = await verifyOne(slug);
    if (outcome.pass) {
      console.log(`PASS ${slug}  — ${outcome.metricsLine}`);
    } else {
      anyFail = true;
      console.log(`FAIL ${slug}  — ${outcome.metricsLine}`);
      for (const f of outcome.failures) console.log(`     ${f}`);
    }
  }

  process.exit(anyFail ? 1 : 0);
}

main().catch((err) => {
  console.error("verify-research crashed:", err);
  process.exit(2);
});

import type { Metadata } from "next";
import Link from "next/link";
import { listResearch } from "@/lib/research";
import { ResearchCardLink } from "@/components/research/ResearchCardLink";
import styles from "@/components/research/research.module.css";

export const metadata: Metadata = {
  title: "Research — perea.ai",
  description:
    "Field reports on the agent economy: B2A infrastructure, protocol adoption, vertical playbooks, and benchmarks from real audits.",
  alternates: { canonical: "/research" },
  openGraph: {
    title: "perea.ai Research",
    description:
      "Field reports on the agent economy. One deep paper a month. Three weekly signals.",
    url: "/research",
    type: "website",
  },
};

function formatDate(iso?: string): string {
  if (!iso) return "";
  const parts = iso.split("-");
  const date = new Date(
    Number(parts[0] || "0"),
    Math.max(0, Number(parts[1] || "1") - 1),
    Number(parts[2] || "1")
  );
  if (Number.isNaN(date.valueOf())) return iso;
  const opts: Intl.DateTimeFormatOptions = parts.length >= 3
    ? { year: "numeric", month: "short", day: "numeric" }
    : { year: "numeric", month: "short" };
  return new Intl.DateTimeFormat("en-US", opts).format(date);
}

export default function ResearchIndexPage() {
  const papers = listResearch();

  return (
    <div className={styles.shell}>
      {/* Logo (header removed) */}
      <div className={styles.brandStrip}>
        <Link href="/research" className={styles.navBrand}>
          <span className={styles.navBrandMark}>P</span>
          <span className={styles.navBrandLabel}>
            <span className={styles.navBrandSmall}>perea.ai</span>
            <span>Research</span>
          </span>
        </Link>
      </div>

      {/* Hero */}
      <header className={styles.indexHero}>
        <div className={styles.indexHeroInner}>
          <div className={styles.indexEyebrow}>perea.ai Research</div>
          <h1 className={styles.indexTitle}>
            Field reports on the agent economy.
          </h1>
          <p className={styles.indexSubtitle}>
            B2A infrastructure, protocol adoption, vertical playbooks, and benchmarks from real audits. One deep paper a month. Three weekly signals.
          </p>
        </div>
      </header>

      {/* List */}
      {papers.length === 0 ? (
        <div className={styles.empty}>
          No papers published yet. Add a markdown file to{" "}
          <code>content/whitepapers/</code> to get started.
        </div>
      ) : (
        <section className={styles.indexList}>
          {papers.map(({ slug, frontmatter }) => (
            <ResearchCardLink
              key={slug}
              slug={slug}
              title={frontmatter.title}
              date={formatDate(frontmatter.date)}
              subtitle={frontmatter.subtitle}
              length={frontmatter.length}
              status={frontmatter.status}
              version={frontmatter.version}
            />
          ))}
        </section>
      )}
    </div>
  );
}

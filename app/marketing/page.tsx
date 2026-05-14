import type { Metadata } from "next";
import Link from "next/link";
import { listPlaybooks } from "@/lib/marketing";
import styles from "@/components/research/research.module.css";

export const metadata: Metadata = {
  title: "Marketing Playbooks — perea.ai",
  description:
    "Production-tested patterns perea runs to distribute research to AI-cited surfaces. Each Playbook teaches one pattern, names the engine it came from, and cites the production evidence that validates it.",
  alternates: { canonical: "/marketing" },
  openGraph: {
    title: "perea.ai Marketing Playbooks",
    description:
      "Production-tested patterns for distributing research to AI-cited surfaces. One pattern per Playbook, with named source engine and production evidence.",
    url: "/marketing",
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

export default function MarketingIndexPage() {
  const playbooks = listPlaybooks();

  return (
    <div className={styles.shell}>
      <div className={styles.brandStrip}>
        <Link href="/marketing" className={styles.navBrand}>
          <span className={styles.navBrandMark}>P</span>
          <span className={styles.navBrandLabel}>
            <span className={styles.navBrandSmall}>perea.ai</span>
            <span>Marketing Playbooks</span>
          </span>
        </Link>
      </div>

      <header className={styles.indexHero}>
        <div className={styles.indexHeroInner}>
          <div className={styles.indexEyebrow}>perea.ai Marketing</div>
          <h1 className={styles.indexTitle}>
            Production patterns for AI-content distribution.
          </h1>
          <p className={styles.indexSubtitle}>
            Each Playbook teaches one pattern perea has run in production — names the engine it came from, cites the production evidence that validates it, and is sized for an agent to read in a single fetch. Audience: founders and agents building a similar AI-content pipeline.
          </p>
        </div>
      </header>

      {playbooks.length === 0 ? (
        <div className={styles.empty}>
          No Playbooks published yet. Add a markdown file to{" "}
          <code>content/marketing/</code> with{" "}
          <code>paper_type: marketing-playbook</code> in the frontmatter.
        </div>
      ) : (
        <section className={styles.indexList}>
          {playbooks.map(({ slug, frontmatter }) => (
            <Link
              key={slug}
              href={`/marketing/${slug}`}
              className={styles.indexCard}
            >
              <div className={styles.indexCardDate}>
                {formatDate(frontmatter.date)}
              </div>
              <div className={styles.indexCardBody}>
                <h2 className={styles.indexCardTitle}>{frontmatter.title}</h2>
                {frontmatter.subtitle && (
                  <p className={styles.indexCardSubtitle}>{frontmatter.subtitle}</p>
                )}
                <div className={styles.indexCardMeta}>
                  <span>
                    <code>{frontmatter.source_engine}</code>
                  </span>
                  {frontmatter.length && <span>· {frontmatter.length}</span>}
                  {frontmatter.status && <span>· {frontmatter.status}</span>}
                  {frontmatter.version && <span>· v{frontmatter.version}</span>}
                </div>
              </div>
              <div className={styles.indexCardArrow} aria-hidden>→</div>
            </Link>
          ))}
        </section>
      )}
    </div>
  );
}

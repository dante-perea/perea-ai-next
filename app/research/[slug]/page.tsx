import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getResearch, listResearch } from "@/lib/research";
import { ReadingProgress } from "@/components/research/ReadingProgress";
import { StickyTOC } from "@/components/research/StickyTOC";
import { ShareRow } from "@/components/research/ShareRow";
import { SubscribeBlock } from "@/components/research/SubscribeBlock";
import styles from "@/components/research/research.module.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://perea.ai";

export async function generateStaticParams() {
  return listResearch().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const paper = await getResearch(slug);
  if (!paper) return { title: "Research not found" };

  const { frontmatter } = paper;
  const description = frontmatter.subtitle || frontmatter.description || "";
  const url = `${SITE_URL}/research/${slug}`;

  return {
    title: frontmatter.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: frontmatter.title,
      description,
      url,
      type: "article",
      siteName: "perea.ai Research",
      publishedTime: frontmatter.date,
      authors: frontmatter.authors,
    },
    twitter: {
      card: "summary_large_image",
      title: frontmatter.title,
      description,
    },
  };
}

function formatDate(iso?: string): string {
  if (!iso) return "";
  // Accept "2026-05" or "2026-05-15"
  const parts = iso.split("-");
  const date = new Date(
    Number(parts[0] || "0"),
    Math.max(0, Number(parts[1] || "1") - 1),
    Number(parts[2] || "1")
  );
  if (Number.isNaN(date.valueOf())) return iso;
  const opts: Intl.DateTimeFormatOptions = parts.length >= 3
    ? { year: "numeric", month: "long", day: "numeric" }
    : { year: "numeric", month: "long" };
  return new Intl.DateTimeFormat("en-US", opts).format(date);
}

export default async function ResearchArticlePage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const paper = await getResearch(slug);
  if (!paper) notFound();

  const { frontmatter, html, toc, readingTimeMinutes, wordCount } = paper;
  const url = `${SITE_URL}/research/${slug}`;
  const dateStr = formatDate(frontmatter.date);

  // Schema.org JSON-LD — eat your own dog food on agent-readability
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ScholarlyArticle",
    headline: frontmatter.title,
    description: frontmatter.subtitle || frontmatter.description,
    abstract: frontmatter.subtitle,
    datePublished: frontmatter.date,
    dateModified: frontmatter.date,
    author: (frontmatter.authors || []).map((name) => ({
      "@type": "Person",
      name,
    })),
    publisher: {
      "@type": "Organization",
      name: frontmatter.publication || "perea.ai Research",
      url: SITE_URL,
    },
    inLanguage: "en",
    license: frontmatter.license,
    isAccessibleForFree: true,
    wordCount,
    timeRequired: `PT${readingTimeMinutes}M`,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
  };

  return (
    <div className={styles.shell}>
      <ReadingProgress />

      {/* Nav */}
      <nav className={styles.nav}>
        <div className={styles.navInner}>
          <Link href="/research" className={styles.navBrand}>
            <span className={styles.navBrandMark}>P</span>
            <span className={styles.navBrandLabel}>
              <span className={styles.navBrandSmall}>perea.ai</span>
              <span>Research</span>
            </span>
          </Link>
          <div className={styles.navLinks}>
            <Link href="/research" className={styles.navLink}>
              All papers
            </Link>
            <Link href="/" className={styles.navLink}>
              perea.ai
            </Link>
            <Link href="/audit" className={styles.navLink}>
              Free B2A audit
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <header className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroEyebrow}>
            {frontmatter.publication || "perea.ai Research"}
            {frontmatter.version ? ` · ${frontmatter.version}` : ""}
            {frontmatter.status ? ` · ${frontmatter.status}` : ""}
          </div>
          <h1 className={styles.heroTitle}>{frontmatter.title}</h1>
          {frontmatter.subtitle && (
            <p className={styles.heroSubtitle}>{frontmatter.subtitle}</p>
          )}
          <div className={styles.heroMeta}>
            {frontmatter.authors && frontmatter.authors.length > 0 && (
              <div className={styles.heroMetaItem}>
                <span className={styles.heroMetaLabel}>Author</span>
                <span className={styles.heroMetaValue}>
                  {frontmatter.authors.join(", ")}
                </span>
              </div>
            )}
            {dateStr && (
              <div className={styles.heroMetaItem}>
                <span className={styles.heroMetaLabel}>Published</span>
                <span className={styles.heroMetaValue}>{dateStr}</span>
              </div>
            )}
            <div className={styles.heroMetaItem}>
              <span className={styles.heroMetaLabel}>Length</span>
              <span className={styles.heroMetaValue}>
                {wordCount.toLocaleString()} words · {readingTimeMinutes} min read
              </span>
            </div>
            {frontmatter.audience && (
              <div className={styles.heroMetaItem}>
                <span className={styles.heroMetaLabel}>Audience</span>
                <span className={styles.heroMetaValue}>
                  {frontmatter.audience}
                </span>
              </div>
            )}
            {frontmatter.license && (
              <div className={styles.heroMetaItem}>
                <span className={styles.heroMetaLabel}>License</span>
                <span className={styles.heroMetaValue}>{frontmatter.license}</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Article */}
      <main className={styles.layout}>
        <StickyTOC items={toc} />

        <div>
          <article
            className={styles.article}
            dangerouslySetInnerHTML={{ __html: html }}
          />

          <footer className={styles.afterArticle}>
            <ShareRow url={url} title={frontmatter.title} />
            <SubscribeBlock />
          </footer>
        </div>
      </main>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}

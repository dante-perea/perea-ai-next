import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getResearch, listResearch } from "@/lib/research";
import { getTranslation } from "@/lib/research-translations";
import { ReadingProgress } from "@/components/research/ReadingProgress";
import { StickyTOC } from "@/components/research/StickyTOC";
import { ShareRow } from "@/components/research/ShareRow";
import { SubscribeBlock } from "@/components/research/SubscribeBlock";
import { LangToggle } from "@/components/research/LangToggle";
import styles from "@/components/research/research.module.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://perea.ai";

export async function generateStaticParams() {
  return listResearch("en").map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const [paper, esTranslation] = await Promise.all([
    getResearch(slug, "en"),
    getTranslation(slug, "es"),
  ]);
  if (!paper) return { title: "Research not found" };

  const { frontmatter } = paper;
  const description = frontmatter.subtitle || frontmatter.description || "";
  const url = `${SITE_URL}/research/${slug}`;
  const esUrl = `${SITE_URL}/es/research/${slug}`;

  const alternateLanguages: Record<string, string> = { en: url };
  if (esTranslation) alternateLanguages.es = esUrl;

  return {
    title: frontmatter.title,
    description,
    alternates: {
      canonical: url,
      languages: alternateLanguages,
    },
    openGraph: {
      title: frontmatter.title,
      description,
      url,
      type: "article",
      siteName: "perea.ai Research",
      publishedTime: frontmatter.date,
      authors: frontmatter.authors,
      locale: "en_US",
      ...(esTranslation ? { alternateLocale: ["es_ES"] } : {}),
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
  const [paper, esTranslation] = await Promise.all([
    getResearch(slug, "en"),
    getTranslation(slug, "es"),
  ]);
  if (!paper) notFound();

  const { frontmatter, html, toc, readingTimeMinutes, wordCount } = paper;
  const url = `${SITE_URL}/research/${slug}`;
  const esUrl = `${SITE_URL}/es/research/${slug}`;
  const dateStr = formatDate(frontmatter.date);
  const spanishExists = esTranslation !== null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ScholarlyArticle",
    headline: frontmatter.title,
    description: frontmatter.subtitle || frontmatter.description,
    abstract: frontmatter.subtitle,
    datePublished: frontmatter.date,
    dateModified: frontmatter.date,
    author: (frontmatter.authors || []).map((name) => ({ "@type": "Person", name })),
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
    ...(spanishExists ? { workTranslation: { "@id": esUrl } } : {}),
  };

  return (
    <div className={styles.shell}>
      <ReadingProgress />

      {/* Hero — logo + toggle row at hero level, content inside heroInner */}
      <header className={styles.hero}>
        <div className={styles.heroBrand}>
          <Link href="/research" className={styles.navBrand}>
            <span className={styles.navBrandMark}>P</span>
            <span className={styles.navBrandLabel}>
              <span className={styles.navBrandSmall}>perea.ai</span>
              <span>Research</span>
            </span>
          </Link>
          <LangToggle slug={slug} locale="en" hasTranslation={spanishExists} />
        </div>

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
                <span className={styles.heroMetaValue}>{frontmatter.authors.join(", ")}</span>
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
                <span className={styles.heroMetaValue}>{frontmatter.audience}</span>
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

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}

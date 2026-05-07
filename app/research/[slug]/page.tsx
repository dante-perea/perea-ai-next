import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { getResearch, listResearch } from "@/lib/research";
import { getTranslation } from "@/lib/research-translations";
import { extractReferences } from "@/lib/research-claims";
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
  const hasTime = iso.includes("T");
  const datePart = iso.split("T")[0];
  const segments = datePart.split("-");
  const hasDay = segments.length >= 3;

  // Parse without UTC shift by using local date constructor
  const [y, m, d] = segments.map(Number);
  const [hh, mm] = hasTime ? (iso.split("T")[1] || "").split(":").map(Number) : [0, 0];
  const date = new Date(y, Math.max(0, (m || 1) - 1), d || 1, hh || 0, mm || 0);
  if (Number.isNaN(date.valueOf())) return iso;

  if (!hasDay) return date.toLocaleString("en-US", { month: "long", year: "numeric" });
  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "short" });
  const time = hasTime
    ? ` ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`
    : "";
  return `${day} ${month}${time}`;
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

  // Parse references from the raw markdown for the schema.org `citation` array.
  // We re-read the file (small) rather than threading refs through getResearch's
  // public surface — keeps the lib API stable.
  let citationLd: Array<Record<string, unknown>> = [];
  try {
    const filePath = path.join(process.cwd(), "content", "whitepapers", `${slug}.md`);
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf8");
      const { content } = matter(raw);
      const { refs } = extractReferences(content);
      citationLd = refs
        .filter((r) => r.url)
        .map((r) => ({
          "@type": "CreativeWork",
          "@id": `${url}#ref-${r.index}`,
          url: r.url,
          name: r.rawLine.replace(/^\s*[\d.]+\s*/, "").slice(0, 240),
        }));
    }
  } catch {
    // Non-fatal — schema.org is enrichment, not blocking.
    citationLd = [];
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ScholarlyArticle",
        "@id": `${url}#article`,
        headline: frontmatter.title,
        description: frontmatter.subtitle || frontmatter.description,
        abstract: frontmatter.subtitle,
        datePublished: frontmatter.date,
        dateModified: frontmatter.dateModified || frontmatter.date,
        author: (frontmatter.authors || []).map((name) => ({
          "@type": "Person",
          "@id": `${SITE_URL}/#dante-perea`,
          name,
        })),
        publisher: {
          "@type": "Organization",
          "@id": `${SITE_URL}/#organization`,
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
        ...(frontmatter.version ? { version: frontmatter.version } : {}),
        ...(frontmatter.keywords && frontmatter.keywords.length > 0
          ? { keywords: frontmatter.keywords.join(", ") }
          : {}),
        ...(frontmatter.topical_entities && frontmatter.topical_entities.length > 0
          ? {
              about: frontmatter.topical_entities.map((t) => ({
                "@type": "Thing",
                name: t,
              })),
            }
          : {}),
        ...(citationLd.length > 0 ? { citation: citationLd } : {}),
        ...(frontmatter.audience ? { audience: { "@type": "Audience", audienceType: frontmatter.audience } } : {}),
        ...(spanishExists ? { workTranslation: { "@id": esUrl } } : {}),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Research", item: `${SITE_URL}/research` },
          { "@type": "ListItem", position: 2, name: frontmatter.title, item: url },
        ],
      },
    ],
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
            <div className={styles.heroMetaItem}>
              <span className={styles.heroMetaLabel}>Email</span>
              <a href="mailto:dante@perea.ai" className={styles.heroMetaValue}>dante@perea.ai</a>
            </div>
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

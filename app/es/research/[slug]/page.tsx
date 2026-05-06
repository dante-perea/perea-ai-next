import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getResearch, listTranslatedResearchSlugs } from "@/lib/research";
import { ReadingProgress } from "@/components/research/ReadingProgress";
import { StickyTOC } from "@/components/research/StickyTOC";
import { ShareRow } from "@/components/research/ShareRow";
import { SubscribeBlock } from "@/components/research/SubscribeBlock";
import { LangToggle } from "@/components/research/LangToggle";
import styles from "@/components/research/research.module.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://perea.ai";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const slugs = await listTranslatedResearchSlugs("es");
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const paper = await getResearch(slug, "es");
  if (!paper) return { title: "Investigación no encontrada" };

  const { frontmatter } = paper;
  const description = frontmatter.subtitle || frontmatter.description || "";
  const url = `${SITE_URL}/es/research/${slug}`;
  const enUrl = `${SITE_URL}/research/${slug}`;

  return {
    title: frontmatter.title,
    description,
    alternates: {
      canonical: url,
      languages: { en: enUrl, es: url },
    },
    openGraph: {
      title: frontmatter.title,
      description,
      url,
      type: "article",
      siteName: "perea.ai Research",
      publishedTime: frontmatter.date,
      authors: frontmatter.authors,
      locale: "es_ES",
      alternateLocale: ["en_US"],
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

  const [y, m, d] = segments.map(Number);
  const [hh, mm] = hasTime ? (iso.split("T")[1] || "").split(":").map(Number) : [0, 0];
  const date = new Date(y, Math.max(0, (m || 1) - 1), d || 1, hh || 0, mm || 0);
  if (Number.isNaN(date.valueOf())) return iso;

  if (!hasDay) return date.toLocaleString("es-419", { month: "long", year: "numeric" });
  const day = date.getDate();
  const month = date.toLocaleString("es-419", { month: "short" }).replace(".", "");
  const time = hasTime
    ? ` ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`
    : "";
  return `${day} ${month}${time}`;
}

export default async function ResearchArticleEsPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const paper = await getResearch(slug, "es");
  if (!paper) notFound();

  const { frontmatter, html, toc, readingTimeMinutes, wordCount } = paper;
  const url = `${SITE_URL}/es/research/${slug}`;
  const enUrl = `${SITE_URL}/research/${slug}`;
  const dateStr = formatDate(frontmatter.date);

  const jsonLdGraph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ScholarlyArticle",
        "@id": `${url}#article`,
        headline: frontmatter.title,
        description: frontmatter.subtitle || frontmatter.description,
        abstract: frontmatter.subtitle,
        datePublished: frontmatter.date,
        dateModified: frontmatter.date,
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
        inLanguage: "es",
        license: frontmatter.license,
        isAccessibleForFree: true,
        wordCount,
        timeRequired: `PT${readingTimeMinutes}M`,
        url,
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
        translationOfWork: { "@id": enUrl },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Investigación", item: `${SITE_URL}/es/research` },
          { "@type": "ListItem", position: 2, name: frontmatter.title, item: url },
        ],
      },
    ],
  };

  return (
    <div className={styles.shell}>
      <ReadingProgress />

      <header className={styles.hero}>
        <div className={styles.heroBrand}>
          <Link href="/research" className={styles.navBrand}>
            <span className={styles.navBrandMark}>P</span>
            <span className={styles.navBrandLabel}>
              <span className={styles.navBrandSmall}>perea.ai</span>
              <span>Research</span>
            </span>
          </Link>
          <LangToggle slug={slug} locale="es" />
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
                <span className={styles.heroMetaLabel}>Autor</span>
                <span className={styles.heroMetaValue}>{frontmatter.authors.join(", ")}</span>
              </div>
            )}
            {dateStr && (
              <div className={styles.heroMetaItem}>
                <span className={styles.heroMetaLabel}>Publicado</span>
                <span className={styles.heroMetaValue}>{dateStr}</span>
              </div>
            )}
            <div className={styles.heroMetaItem}>
              <span className={styles.heroMetaLabel}>Extensión</span>
              <span className={styles.heroMetaValue}>
                {wordCount.toLocaleString("es")} palabras · {readingTimeMinutes} min
              </span>
            </div>
            {frontmatter.audience && (
              <div className={styles.heroMetaItem}>
                <span className={styles.heroMetaLabel}>Audiencia</span>
                <span className={styles.heroMetaValue}>{frontmatter.audience}</span>
              </div>
            )}
            {frontmatter.license && (
              <div className={styles.heroMetaItem}>
                <span className={styles.heroMetaLabel}>Licencia</span>
                <span className={styles.heroMetaValue}>{frontmatter.license}</span>
              </div>
            )}
          </div>
        </div>
      </header>

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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdGraph) }}
      />
    </div>
  );
}

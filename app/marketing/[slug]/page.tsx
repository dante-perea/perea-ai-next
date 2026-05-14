import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { headers } from "next/headers";
import { getPlaybook, listPlaybooks } from "@/lib/marketing";
import { ReadingProgress } from "@/components/research/ReadingProgress";
import { StickyTOC } from "@/components/research/StickyTOC";
import { ShareRow } from "@/components/research/ShareRow";
import { ArticleAnalytics } from "@/components/research/ArticleAnalytics";
import { ArticleBody } from "@/components/research/ArticleBody";
import { captureServerEvent, detectAICrawler } from "@/lib/posthog-server";
import styles from "@/components/research/research.module.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://perea.ai";

export async function generateStaticParams() {
  return listPlaybooks().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const playbook = await getPlaybook(slug);
  if (!playbook) return { title: "Playbook not found" };

  const { frontmatter } = playbook;
  const description = frontmatter.subtitle || frontmatter.description || "";
  const url = `${SITE_URL}/marketing/${slug}`;

  return {
    title: frontmatter.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: frontmatter.title,
      description,
      url,
      type: "article",
      siteName: "perea.ai Marketing Playbooks",
      publishedTime: frontmatter.date,
      authors: frontmatter.authors,
      locale: "en_US",
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
  const datePart = iso.split("T")[0];
  const segments = datePart.split("-");
  const hasDay = segments.length >= 3;
  const [y, m, d] = segments.map(Number);
  const date = new Date(y, Math.max(0, (m || 1) - 1), d || 1);
  if (Number.isNaN(date.valueOf())) return iso;
  if (!hasDay) return date.toLocaleString("en-US", { month: "long", year: "numeric" });
  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "short" });
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}

export default async function MarketingPlaybookPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const playbook = await getPlaybook(slug);
  if (!playbook) notFound();

  const { frontmatter, html, toc, readingTimeMinutes, wordCount } = playbook;
  const url = `${SITE_URL}/marketing/${slug}`;
  const dateStr = formatDate(frontmatter.date);

  const headersList = await headers();
  const ua = headersList.get("user-agent") || "";
  const crawler = detectAICrawler(ua);
  if (crawler) {
    captureServerEvent(`bot:${crawler}`, "marketing_crawler_fetch", {
      slug,
      title: frontmatter.title,
      crawler,
      locale: "en",
    });
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TechArticle",
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
          name: frontmatter.publication || "perea.ai Marketing Playbooks",
          url: SITE_URL,
        },
        inLanguage: "en",
        license: frontmatter.license,
        isAccessibleForFree: true,
        wordCount,
        timeRequired: `PT${readingTimeMinutes}M`,
        url,
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
        proficiencyLevel: "Expert",
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
        ...(frontmatter.audience
          ? { audience: { "@type": "Audience", audienceType: frontmatter.audience } }
          : {}),
        ...(frontmatter.source_engine
          ? {
              isBasedOn: {
                "@type": "SoftwareSourceCode",
                name: frontmatter.source_engine,
                description: `perea Claude Code skill: ${frontmatter.source_engine}`,
              },
            }
          : {}),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Marketing", item: `${SITE_URL}/marketing` },
          { "@type": "ListItem", position: 2, name: frontmatter.title, item: url },
        ],
      },
    ],
  };

  return (
    <div className={styles.shell}>
      <ReadingProgress />
      <ArticleAnalytics slug={slug} title={frontmatter.title} />

      <header className={styles.hero}>
        <div className={styles.heroBrand}>
          <Link href="/marketing" className={styles.navBrand}>
            <span className={styles.navBrandMark}>P</span>
            <span className={styles.navBrandLabel}>
              <span className={styles.navBrandSmall}>perea.ai</span>
              <span>Marketing</span>
            </span>
          </Link>
        </div>

        <div className={styles.heroInner}>
          <div className={styles.heroEyebrow}>
            {frontmatter.publication || "perea.ai Marketing Playbooks"}
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
              <span className={styles.heroMetaLabel}>Source engine</span>
              <span className={styles.heroMetaValue}>
                <code>{frontmatter.source_engine}</code>
              </span>
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

      <main className={styles.layout}>
        <StickyTOC items={toc} slug={slug} title={frontmatter.title} />
        <div>
          <ArticleBody html={html} slug={slug} title={frontmatter.title} />
          <footer className={styles.afterArticle}>
            <ShareRow url={url} title={frontmatter.title} slug={slug} />
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

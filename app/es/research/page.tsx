import type { Metadata } from "next";
import Link from "next/link";
import { listTranslationsWithFrontmatter } from "@/lib/research-translations";
import styles from "@/components/research/research.module.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://perea.ai";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Investigación — perea.ai",
  description:
    "Informes de campo sobre la economía agente: infraestructura B2A, adopción de protocolos, guías verticales y benchmarks de auditorías reales.",
  alternates: {
    canonical: `${SITE_URL}/es/research`,
    languages: {
      en: `${SITE_URL}/research`,
      es: `${SITE_URL}/es/research`,
    },
  },
  openGraph: {
    title: "perea.ai Investigación",
    description:
      "Informes de campo sobre la economía agente. Un paper profundo al mes. Tres señales semanales.",
    url: `${SITE_URL}/es/research`,
    type: "website",
    locale: "es_ES",
    alternateLocale: ["en_US"],
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
  const opts: Intl.DateTimeFormatOptions =
    parts.length >= 3
      ? { year: "numeric", month: "short", day: "numeric" }
      : { year: "numeric", month: "short" };
  return new Intl.DateTimeFormat("es-419", opts).format(date);
}

export default async function ResearchIndexEsPage() {
  const papers = await listTranslationsWithFrontmatter("es");

  return (
    <div className={styles.shell}>
      <div className={styles.brandStrip}>
        <Link href="/es/research" className={styles.navBrand}>
          <span className={styles.navBrandMark}>P</span>
          <span className={styles.navBrandLabel}>
            <span className={styles.navBrandSmall}>perea.ai</span>
            <span>Investigación</span>
          </span>
        </Link>
        <Link href="/research" className={styles.langOption} style={{ marginLeft: "auto" }}>
          EN
        </Link>
      </div>

      <header className={styles.indexHero}>
        <div className={styles.indexHeroInner}>
          <div className={styles.indexEyebrow}>perea.ai Investigación</div>
          <h1 className={styles.indexTitle}>
            Informes de campo sobre la economía agente.
          </h1>
          <p className={styles.indexSubtitle}>
            Infraestructura B2A, adopción de protocolos, guías verticales y benchmarks de auditorías reales. Un paper profundo al mes. Tres señales semanales.
          </p>
        </div>
      </header>

      {papers.length === 0 ? (
        <div className={styles.empty}>
          No hay papers publicados aún.
        </div>
      ) : (
        <section className={styles.indexList}>
          {papers.map(({ slug, frontmatter }) => (
            <Link
              key={slug}
              href={`/es/research/${slug}`}
              className={styles.indexCard}
            >
              <div className={styles.indexCardDate}>
                {formatDate(frontmatter.date as string)}
              </div>
              <div className={styles.indexCardBody}>
                <h2 className={styles.indexCardTitle}>
                  {(frontmatter.title as string) || slug}
                </h2>
                {frontmatter.subtitle && (
                  <p className={styles.indexCardSubtitle}>
                    {frontmatter.subtitle as string}
                  </p>
                )}
                <div className={styles.indexCardMeta}>
                  {frontmatter.length && <span>{frontmatter.length as string}</span>}
                  {frontmatter.status && <span>· {frontmatter.status as string}</span>}
                  {frontmatter.version && <span>· {frontmatter.version as string}</span>}
                </div>
              </div>
              <div className={styles.indexCardArrow} aria-hidden>
                →
              </div>
            </Link>
          ))}
        </section>
      )}
    </div>
  );
}

"use client";

import Link from "next/link";
import { usePostHog } from "posthog-js/react";
import styles from "./research.module.css";

interface Props {
  slug: string;
  locale: "en" | "es";
  hasTranslation?: boolean;
}

export function LangToggle({ slug, locale, hasTranslation = true }: Props) {
  const posthog = usePostHog();

  if (locale === "en" && !hasTranslation) return null;

  const track = (to: "en" | "es") => {
    if (to !== locale) {
      posthog?.capture("research_language_switch", { slug, from: locale, to });
    }
  };

  return (
    <div className={styles.langToggle}>
      <Link
        href={`/research/${slug}`}
        className={`${styles.langOption} ${locale === "en" ? styles.langOptionActive : ""}`}
        onClick={() => track("en")}
      >
        EN
      </Link>
      <span className={styles.langDivider}>·</span>
      <Link
        href={`/es/research/${slug}`}
        className={`${styles.langOption} ${locale === "es" ? styles.langOptionActive : ""}`}
        onClick={() => track("es")}
      >
        ES
      </Link>
    </div>
  );
}

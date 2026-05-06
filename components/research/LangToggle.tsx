import Link from "next/link";
import styles from "./research.module.css";

interface Props {
  slug: string;
  locale: "en" | "es";
  hasTranslation?: boolean;
}

export function LangToggle({ slug, locale, hasTranslation = true }: Props) {
  if (locale === "en" && !hasTranslation) return null;

  return (
    <div className={styles.langToggle}>
      <Link
        href={`/research/${slug}`}
        className={`${styles.langOption} ${locale === "en" ? styles.langOptionActive : ""}`}
      >
        EN
      </Link>
      <span className={styles.langDivider}>·</span>
      <Link
        href={`/es/research/${slug}`}
        className={`${styles.langOption} ${locale === "es" ? styles.langOptionActive : ""}`}
      >
        ES
      </Link>
    </div>
  );
}

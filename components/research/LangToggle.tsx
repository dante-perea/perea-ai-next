import Link from "next/link";
import styles from "./research.module.css";

interface Props {
  slug: string;
  locale: "en" | "es";
  hasTranslation: boolean;
}

export function LangToggle({ slug, locale, hasTranslation }: Props) {
  if (!hasTranslation) return null;

  const enHref = `/research/${slug}`;
  const esHref = `/es/research/${slug}`;

  return (
    <div className={styles.langToggle}>
      <Link
        href={enHref}
        className={`${styles.langOption} ${locale === "en" ? styles.langOptionActive : ""}`}
      >
        EN
      </Link>
      <span className={styles.langDivider}>·</span>
      <Link
        href={esHref}
        className={`${styles.langOption} ${locale === "es" ? styles.langOptionActive : ""}`}
      >
        ES
      </Link>
    </div>
  );
}

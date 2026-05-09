"use client";

import Link from "next/link";
import { usePostHog } from "posthog-js/react";
import styles from "./research.module.css";

interface Props {
  slug: string;
  title: string;
  date: string;
  subtitle?: string;
  length?: string;
  status?: string;
  version?: string;
}

export function ResearchCardLink({ slug, title, date, subtitle, length, status, version }: Props) {
  const posthog = usePostHog();

  return (
    <Link
      href={`/research/${slug}`}
      className={styles.indexCard}
      onClick={() => posthog?.capture("research_paper_click", { slug, title })}
    >
      <div className={styles.indexCardDate}>{date}</div>
      <div className={styles.indexCardBody}>
        <h2 className={styles.indexCardTitle}>{title}</h2>
        {subtitle && <p className={styles.indexCardSubtitle}>{subtitle}</p>}
        <div className={styles.indexCardMeta}>
          {length && <span>{length}</span>}
          {status && <span>· {status}</span>}
          {version && <span>· {version}</span>}
        </div>
      </div>
      <div className={styles.indexCardArrow} aria-hidden>→</div>
    </Link>
  );
}

"use client";

import { usePostHog } from "posthog-js/react";
import styles from "./research.module.css";

interface Props {
  html: string;
  slug: string;
  title: string;
}

export function ArticleBody({ html, slug, title }: Props) {
  const posthog = usePostHog();

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    const anchor = (e.target as HTMLElement).closest("a");
    if (!anchor) return;
    const href = anchor.getAttribute("href") || "";
    if (!href.startsWith("http")) return;
    posthog?.capture("research_outbound_click", {
      slug,
      title,
      href,
      link_text: anchor.textContent?.trim().slice(0, 120) ?? "",
    });
  };

  return (
    <article
      className={styles.article}
      dangerouslySetInnerHTML={{ __html: html }}
      onClick={handleClick}
    />
  );
}

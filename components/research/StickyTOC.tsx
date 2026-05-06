"use client";

import { useEffect, useState } from "react";
import styles from "./research.module.css";
import type { ResearchTocItem } from "@/lib/research";

interface Props {
  items: ResearchTocItem[];
}

export function StickyTOC({ items }: Props) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const headings = items
      .map((it) => document.getElementById(it.id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .map((e) => e.target.id);
        if (visible.length > 0) {
          setActiveId(visible[0]);
          return;
        }
        // Find the last heading we scrolled past
        const top = window.scrollY;
        let current = "";
        for (const h of headings) {
          if (h.offsetTop <= top + 120) current = h.id;
        }
        if (current) setActiveId(current);
      },
      { rootMargin: "-80px 0px -70% 0px", threshold: 0 }
    );

    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, [items]);

  // Group L3s under their parent L2
  const grouped: { item: ResearchTocItem; children: ResearchTocItem[] }[] = [];
  items.forEach((it) => {
    if (it.level <= 2) {
      grouped.push({ item: it, children: [] });
    } else if (grouped.length > 0) {
      grouped[grouped.length - 1].children.push(it);
    }
  });

  return (
    <aside className={styles.tocAside}>
      <div className={styles.tocLabel}>Contents</div>
      <ul className={styles.tocList}>
        {grouped.map(({ item, children }) => {
          const isActive = activeId === item.id;
          const hasActiveChild = children.some((c) => c.id === activeId);
          return (
            <li
              key={item.id}
              className={[
                styles.tocItem,
                isActive ? styles.tocActive : "",
                hasActiveChild ? styles.tocActiveParent : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <a href={`#${item.id}`}>{item.text}</a>
              {children.map((child) => (
                <ul
                  key={child.id}
                  className={`${styles.tocItemL3} ${
                    activeId === child.id ? styles.tocActive : ""
                  }`}
                >
                  <li>
                    <a href={`#${child.id}`}>{child.text}</a>
                  </li>
                </ul>
              ))}
            </li>
          );
        })}
      </ul>
    </aside>
  );
}

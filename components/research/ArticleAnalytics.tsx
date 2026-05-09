"use client";

import { useEffect, useRef } from "react";
import { usePostHog } from "posthog-js/react";

interface Props {
  slug: string;
  title: string;
}

const MILESTONES = [25, 50, 75, 90, 100];

const AI_REFERRER_ENGINES: [RegExp, string][] = [
  [/perplexity\.ai/i, "perplexity"],
  [/chatgpt\.com/i, "openai"],
  [/chat\.openai\.com/i, "openai"],
  [/claude\.ai/i, "anthropic"],
  [/gemini\.google\.com/i, "google"],
  [/you\.com/i, "you"],
  [/phind\.com/i, "phind"],
  [/kagi\.com/i, "kagi"],
  [/bing\.com/i, "bing_copilot"],
  [/brave\.com/i, "brave"],
  [/poe\.com/i, "poe"],
  [/cohere\.com/i, "cohere"],
];

export function ArticleAnalytics({ slug, title }: Props) {
  const posthog = usePostHog();
  const firedDepths = useRef(new Set<number>());
  const maxDepth = useRef(0);
  const startTime = useRef(Date.now());

  useEffect(() => {
    // AI engine referral detection — fires once on first render
    const referrer = document.referrer;
    if (referrer) {
      for (const [pattern, engine] of AI_REFERRER_ENGINES) {
        if (pattern.test(referrer)) {
          posthog?.capture("research_ai_referral", { slug, title, engine, referrer_url: referrer });
          break;
        }
      }
    }
  }, [posthog, slug, title]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const articleEl = document.querySelector("article");
    if (!articleEl) return;

    const onScroll = () => {
      const articleTop = (articleEl as HTMLElement).offsetTop;
      const articleHeight = (articleEl as HTMLElement).offsetHeight;
      if (!articleHeight) return;

      const scrolled = Math.max(0, window.scrollY + window.innerHeight - articleTop);
      const pct = Math.min(100, Math.round((scrolled / articleHeight) * 100));

      if (pct > maxDepth.current) maxDepth.current = pct;

      for (const milestone of MILESTONES) {
        if (pct >= milestone && !firedDepths.current.has(milestone)) {
          firedDepths.current.add(milestone);
          posthog?.capture("research_scroll_depth", { slug, title, depth: milestone });
        }
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      const seconds = Math.round((Date.now() - startTime.current) / 1000);
      posthog?.capture("research_time_on_page", { slug, title, seconds, max_depth: maxDepth.current });
    };
  }, [posthog, slug, title]);

  return null;
}

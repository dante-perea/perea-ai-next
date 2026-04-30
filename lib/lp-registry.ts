/**
 * LP Registry — single source of truth for all /lp/[slug] landing pages.
 */

export type LPVariant = "a" | "b";

export type LPSection =
  | "hero"
  | "logos"
  | "capabilities"
  | "dark"
  | "services"
  | "tiers"
  | "trust"
  | "articles"
  | "cta";

export interface LPCtaConfig {
  primary: string;
  secondary?: string;
  href: string;
}

export interface LPHeroConfig {
  eyebrow: string;
  headline: string;
  typewriterWords?: string[];
  subhead: string;
}

export interface LPVariantConfig {
  hero: LPHeroConfig;
  cta: LPCtaConfig;
  ctaBand: {
    headline: string;
    subhead: string;
    buttonLabel: string;
  };
}

export interface LPConfig {
  slug: string;
  title: string;
  description: string;
  ogImage?: string;
  sections: LPSection[];
  default: LPVariantConfig;
  variantB?: Partial<LPVariantConfig>;
  theme?: "light" | "dark";
}

export const LP_REGISTRY: Record<string, LPConfig> = {

  consultancy: {
    slug: "consultancy",
    title: "AI Consultancy Done Right — Perea.AI",
    description:
      "We help startups and growing businesses cut through the AI hype with clear strategy, hands-on implementation, and measurable results.",
    sections: ["hero","logos","capabilities","dark","services","tiers","trust","articles","cta"],
    default: {
      hero: {
        eyebrow: "AI Consultancy",
        headline: "The foundation for your AI {typewriter}",
        typewriterWords: ["transformation","growth strategy","sales pipeline","operations","competitive edge"],
        subhead:
          "We help startups and growing businesses cut through the hype and deploy practical AI that delivers. Every engagement is fixed-price and built around your business — not a generic platform.",
      },
      cta: { primary: "Book a free discovery call →", href: "#cta" },
      ctaBand: {
        headline: "Start building your AI foundation",
        subhead: "Book a free 60-minute discovery call. We'll map your highest-leverage AI opportunities — no commitment, no pitch deck.",
        buttonLabel: "Book your free call →",
      },
    },
    variantB: {
      hero: {
        eyebrow: "AI Strategy & Implementation",
        headline: "Stop exploring AI. Start {typewriter}",
        typewriterWords: ["using it","scaling it","shipping it","measuring it"],
        subhead:
          "Perea.AI turns AI ambition into production systems in weeks — with senior consultants, fixed prices, and results you can measure from day one.",
      },
      cta: { primary: "Schedule a strategy call →", href: "#cta" },
      ctaBand: {
        headline: "Ready to ship your first AI system?",
        subhead: "Most clients have a working AI in production within 3 weeks. Book a free call and we'll show you exactly how.",
        buttonLabel: "Get started →",
      },
    },
  },

  sales: {
    slug: "sales",
    title: "AI Sales Automation — Perea.AI",
    description:
      "Perea.AI builds AI systems that research leads, score them against your ICP, and draft personalised outreach. Your SDRs close, we handle the rest.",
    sections: ["hero","logos","capabilities","dark","services","tiers","cta"],
    default: {
      hero: {
        eyebrow: "Sales AI",
        headline: "3× more qualified meetings. {typewriter}",
        typewriterWords: ["Automatically.","Every week.","Without extra headcount."],
        subhead:
          "We build AI SDRs that research inbound leads, score them against your ICP, and draft personalised outreach — handing warm prospects to your team with full context. No code. No headcount.",
      },
      cta: { primary: "See how it works →", href: "#cta" },
      ctaBand: {
        headline: "Ship your AI SDR this week",
        subhead: "Most sales AI engagements go live in under 3 weeks. Book a free call — we'll scope it on the spot.",
        buttonLabel: "Book a free call →",
      },
    },
  },

  support: {
    slug: "support",
    title: "AI Support Automation — Perea.AI",
    description:
      "Perea.AI builds intelligent support systems that resolve 70–80% of tickets without human intervention. Not a chatbot — a real AI trained on your knowledge base.",
    sections: ["hero","logos","capabilities","dark","services","tiers","cta"],
    default: {
      hero: {
        eyebrow: "Support AI",
        headline: "Resolve 80% of tickets. {typewriter}",
        typewriterWords: ["Automatically.","Without extra headcount.","In under 3 weeks."],
        subhead:
          "We build AI support systems trained on your knowledge base, integrated with your helpdesk, and designed to resolve — not deflect. Complex issues get escalated with full context so your team never starts cold.",
      },
      cta: { primary: "See a live demo →", href: "#cta" },
      ctaBand: {
        headline: "Cut your support volume in half",
        subhead: "Book a free 60-minute call — we'll show you exactly what your support AI would look like, including a scope and price estimate.",
        buttonLabel: "Book your free call →",
      },
    },
  },

};

export function getLPConfig(slug: string): LPConfig | null {
  return LP_REGISTRY[slug] ?? null;
}

export function getVariantContent(
  config: LPConfig,
  variant: LPVariant
): LPVariantConfig {
  if (variant === "b" && config.variantB) {
    return {
      hero: { ...config.default.hero, ...config.variantB.hero },
      cta: { ...config.default.cta, ...config.variantB.cta },
      ctaBand: { ...config.default.ctaBand, ...config.variantB.ctaBand },
    };
  }
  return config.default;
}

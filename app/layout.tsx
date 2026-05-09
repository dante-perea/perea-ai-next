import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import { PostHogPageview } from "@/components/posthog-pageview";
import { PostHogProvider } from "./providers";

const SITE_URL = "https://perea.ai";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  title: {
    default: "perea.ai Research",
    template: "%s | Perea.AI",
  },
  description:
    "Original research on the agent economy: B2A infrastructure, protocol adoption, vertical playbooks, and benchmarks from real audits. Published by Dante Perea.",
  openGraph: {
    type: "website",
    siteName: "perea.ai Research",
    url: SITE_URL,
    images: [{ url: "/og-default.svg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@perea_ai",
  },
};

const siteJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "perea.ai",
      alternateName: "perea.ai Research",
      url: SITE_URL,
      description:
        "Original research on the agent economy: B2A infrastructure, agent payments, MCP adoption, GEO/AEO discovery layer, vertical playbooks, and audit-grade benchmarks. Source-cited synthesis intended as a citation-grade reference for AI retrieval engines.",
      logo: { "@type": "ImageObject", url: `${SITE_URL}/favicon.svg` },
      foundingDate: "2025",
      knowsAbout: [
        "Business-to-Agent (B2A) commerce",
        "Model Context Protocol (MCP)",
        "Agent payments (x402, AP2, ACP)",
        "Generative Engine Optimization (GEO)",
        "Answer Engine Optimization (AEO)",
        "Vertical AI agents",
        "Agent observability",
        "AI procurement",
      ],
      sameAs: [
        "https://twitter.com/perea_ai",
        "https://x.com/perea_ai",
      ],
      founder: { "@id": `${SITE_URL}/#dante-perea` },
    },
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#dante-perea`,
      name: "Dante Perea",
      givenName: "Dante",
      familyName: "Perea",
      url: SITE_URL,
      jobTitle: "Founder",
      worksFor: { "@id": `${SITE_URL}/#organization` },
      knowsAbout: [
        "Business-to-Agent (B2A) commerce",
        "Vertical AI agents",
        "Agent infrastructure",
        "AI go-to-market",
      ],
      sameAs: [
        "https://twitter.com/perea_ai",
        "https://x.com/perea_ai",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "perea.ai Research",
      description:
        "Original research on the agent economy: B2A infrastructure, protocol adoption, vertical playbooks.",
      publisher: { "@id": `${SITE_URL}/#organization` },
      inLanguage: ["en", "es"],
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PostHogProvider>
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;600;700&family=Google+Sans+Display:wght@400;500;600;700&family=Roboto+Mono:wght@400;500&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;1,6..72,400;1,6..72,500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Suspense>
          <PostHogPageview />
        </Suspense>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }}
        />
      </body>
    </html>
    </PostHogProvider>
  );
}

import type { Metadata } from "next";
import "./globals.css";

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
      url: SITE_URL,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/favicon.svg` },
      sameAs: ["https://twitter.com/perea_ai"],
    },
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#dante-perea`,
      name: "Dante Perea",
      url: SITE_URL,
      worksFor: { "@id": `${SITE_URL}/#organization` },
      sameAs: ["https://twitter.com/perea_ai"],
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
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }}
        />
      </body>
    </html>
  );
}

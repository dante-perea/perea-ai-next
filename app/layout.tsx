import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  title: {
    default: "Perea.AI — AI Consultancy Done Right",
    template: "%s | Perea.AI",
  },
  description:
    "We help startups and growing businesses deploy practical AI that delivers real results. Fixed-price engagements, senior consultants, measurable outcomes.",
  openGraph: {
    type: "website",
    siteName: "Perea.AI",
    url: "https://perea-ai.vercel.app",
    images: [{ url: "/og-default.svg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@perea_ai",
  },
  metadataBase: new URL("https://perea-ai.vercel.app"),
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
      <body>{children}</body>
    </html>
  );
}

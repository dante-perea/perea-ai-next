import type { Metadata } from "next";
import { headers } from "next/headers";
import { getGeoFromHeaders, getRegion, getLocalCTA } from "@/lib/geo";

export const metadata: Metadata = {
  title: "Perea.AI — AI Consultancy Done Right",
  description: "We help startups and growing businesses deploy practical AI that delivers. Fixed-price engagements, senior consultants, measurable outcomes.",
};

export default async function HomePage() {
  // Geo-aware server render
  const headerStore = await headers();
  const headerMap = new Map<string, string>();
  headerStore.forEach((val, key) => headerMap.set(key, val));
  const geo = getGeoFromHeaders(headerMap);
  const region = getRegion(geo.country);
  const localCTA = getLocalCTA(region);

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Google Sans, Inter, sans-serif",
        background: "#f9f9f9",
        color: "#262626",
        gap: "1.5rem",
        padding: "2rem",
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          background: "#5B1A7C",
          borderRadius: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg viewBox="0 0 16 16" fill="white" width="22" height="22">
          <path d="M8 1.5A6.5 6.5 0 1 0 14.5 8 6.507 6.507 0 0 0 8 1.5ZM8 12a4 4 0 1 1 4-4 4 4 0 0 1-4 4Z" opacity=".35"/>
          <circle cx="8" cy="8" r="2.5"/>
        </svg>
      </div>
      <h1 style={{ fontSize: "2.5rem", fontWeight: 500, letterSpacing: "-0.03em" }}>
        Perea.AI
      </h1>
      <p style={{ color: "#79716b", maxWidth: 480, lineHeight: 1.7 }}>
        AI consultancy done right. Strategy, implementation, and measurable results for startups and growing businesses.
      </p>
      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", justifyContent: "center" }}>
        <a
          href="/lp/consultancy"
          style={{
            background: "#5B1A7C",
            color: "white",
            padding: "0.72rem 1.4rem",
            borderRadius: 8,
            textDecoration: "none",
            fontSize: "0.95rem",
            fontWeight: 600,
          }}
        >
          {localCTA}
        </a>
        <a
          href="/lp/sales"
          style={{
            border: "1.5px solid rgba(0,0,0,0.12)",
            color: "#262626",
            padding: "0.72rem 1.4rem",
            borderRadius: 8,
            textDecoration: "none",
            fontSize: "0.95rem",
            fontWeight: 500,
          }}
        >
          Sales AI →
        </a>
      </div>
      <p style={{ fontSize: "0.78rem", color: "#a8a29e", marginTop: "0.5rem" }}>
        Geo-detected:{" "}
        <strong style={{ color: "#79716b" }}>
          {geo.country || "—"} · {region}
        </strong>
        {" "}(CTA localised server-side)
      </p>
    </main>
  );
}

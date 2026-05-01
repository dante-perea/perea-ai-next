import styles from "@/components/lp/lp.module.css";
import type { CSSProperties } from "react";

const IconLogo = () => (
  <svg viewBox="0 0 16 16" fill="white" width="16" height="16">
    <path d="M8 1.5A6.5 6.5 0 1 0 14.5 8 6.507 6.507 0 0 0 8 1.5ZM8 12a4 4 0 1 1 4-4 4 4 0 0 1-4 4Z" opacity=".35"/>
    <circle cx="8" cy="8" r="2.5"/>
  </svg>
);

const traceRows = [
  { label: "REQUEST", text: "GET /unknown-page", time: "0ms",   variant: "trigger" as const },
  { label: "ROUTE",   text: "No matching route found",          time: "0.1s",  variant: "normal" as const },
  { label: "LOOKUP",  text: "Checked 24 registered paths",      time: "0.3s",  variant: "normal" as const },
  { label: "ERROR",   text: "404 · Page does not exist",        time: "0.4s",  variant: "error" as const },
];

const trStyle: Record<string, CSSProperties> = {
  trigger: { background: "var(--lp-accent-bg)", borderLeft: "2px solid var(--lp-accent)" },
  normal:  { border: "1px solid var(--lp-border)" },
  error:   { background: "#fff1f2", borderLeft: "2px solid #e11d48" },
};
const labelColor: Record<string, string> = {
  trigger: "var(--lp-accent)",
  normal:  "var(--lp-ink-muted)",
  error:   "#e11d48",
};

export default function NotFound() {
  return (
    <div className={styles.lp}>

      {/* ── NAV ── */}
      <nav className={styles.nav}>
        <div className={styles.container}>
          <div className={styles.navInner}>
            <a href="/" className={styles.navLogo}>
              <div className={styles.navLogoMark}><IconLogo /></div>
              <span className={styles.navLogoText}>Perea.AI</span>
            </a>
            <ul className={styles.navLinks}>
              <li><a href="/#services">Services</a></li>
              <li><a href="/#pricing">Pricing</a></li>
              <li><a href="/#articles">Insights</a></li>
              <li><a href="#">Company</a></li>
            </ul>
            <a href="/#cta" className={styles.navCta}>Book a free discovery call →</a>
          </div>
        </div>
      </nav>

      {/* ── 404 HERO ── */}
      <section style={{ minHeight: "calc(100vh - 60px - 200px)", display: "flex", alignItems: "center" }}>
        <div className={styles.container}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center" }}>

            {/* Left — text */}
            <div>
              <div className={styles.heroEyebrow} style={{ marginBottom: "1rem" }}>Error 404</div>
              <h1
                style={{
                  fontFamily: "Google Sans Display, Google Sans, sans-serif",
                  fontSize: "clamp(3rem, 6vw, 5rem)",
                  fontWeight: 700,
                  letterSpacing: "-0.03em",
                  lineHeight: 1.1,
                  color: "var(--lp-ink)",
                  marginBottom: "1.25rem",
                }}
              >
                This page<br />
                <span style={{ color: "var(--lp-accent)" }}>doesn&apos;t exist</span>
                <span className={styles.cursor} aria-hidden="true" />
              </h1>
              <p style={{ fontSize: "1.05rem", color: "var(--lp-ink-muted)", lineHeight: 1.7, maxWidth: "36ch", marginBottom: "2rem" }}>
                The route you requested couldn&apos;t be found. It may have moved, been deleted, or never existed.
              </p>
              <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                <a href="/" className={styles.navCta} style={{ textDecoration: "none" }}>
                  ← Back to home
                </a>
                <a href="/#cta" style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "0 1.25rem",
                  height: "38px",
                  borderRadius: "8px",
                  border: "1px solid var(--lp-border-strong)",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  color: "var(--lp-ink-muted)",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}>
                  Talk to us
                </a>
              </div>
            </div>

            {/* Right — trace mockup */}
            <div className={styles.heroPanel}>
              <div className={styles.panelBar}>
                <div className={styles.trafficDots}>
                  <div className={`${styles.td} ${styles.tdR}`} />
                  <div className={`${styles.td} ${styles.tdY}`} />
                  <div className={`${styles.td} ${styles.tdG}`} />
                </div>
                <span style={{ fontSize: "0.72rem", color: "var(--lp-ink-faint)", fontFamily: "Roboto Mono, monospace" }}>
                  router · request trace
                </span>
              </div>
              <div style={{ padding: "1rem", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                <div style={{ marginBottom: "0.25rem", fontSize: "0.72rem", color: "var(--lp-ink-muted)", fontFamily: "Roboto Mono, monospace" }}>
                  run #1 · page-router-agent
                </div>
                {traceRows.map((r, i) => (
                  <div key={i} className={styles.traceRow} style={trStyle[r.variant]}>
                    <span className={styles.trLabel} style={{ color: labelColor[r.variant] }}>{r.label}</span>
                    <span className={styles.trText}>{r.text}</span>
                    <span className={styles.trTime}>{r.time}</span>
                  </div>
                ))}
                <div style={{
                  marginTop: "0.5rem", padding: "0.45rem 0.7rem",
                  background: "var(--lp-bg-card)", borderRadius: "5px",
                  display: "flex", justifyContent: "space-between",
                  fontSize: "0.72rem", color: "var(--lp-ink-faint)",
                  fontFamily: "Roboto Mono, monospace",
                }}>
                  <span>total: 0.4s · status: 404</span>
                  <span style={{ color: "#e11d48", fontWeight: 600 }}>✗ not found</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.footerInner}>
            <div>
              <a href="/" className={styles.navLogo} style={{ marginBottom: "0.5rem", display: "inline-flex" }}>
                <div className={styles.navLogoMark}><IconLogo /></div>
                <span className={styles.navLogoText}>Perea.AI</span>
              </a>
              <p className={styles.footerTagline}>AI consultancy for startups and growing businesses. Strategy, build, and results.</p>
            </div>
            <div className={styles.footerCols}>
              {[
                { title: "Services",     links: [["Sales AI","#"],["Support AI","#"],["Operations AI","#"],["Intelligence","#"]] },
                { title: "Engagements",  links: [["Discovery Call","#"],["Project","#"],["Retainer","#"],["Enterprise","#"]] },
                { title: "Insights",     links: [["Blog","#"],["Case Studies","#"],["AI Glossary","#"]] },
                { title: "Company",      links: [["About","#"],["Team","#"],["Privacy","#"],["Terms","#"]] },
              ].map((col) => (
                <div key={col.title} className={styles.footerCol}>
                  <p className={styles.footerColTitle}>{col.title}</p>
                  <ul>{col.links.map(([label, href]) => <li key={label}><a href={href}>{label}</a></li>)}</ul>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.footerBottom}>
            <p className={styles.footerBottomText}>© 2026 Perea.AI · All rights reserved.</p>
            <p className={styles.footerBottomText}>AI consultancy done right.</p>
          </div>
        </div>
      </footer>

    </div>
  );
}

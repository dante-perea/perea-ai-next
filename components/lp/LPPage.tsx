"use client";

/**
 * LPPage — the full landing page shell.
 * Uses CSS Modules (lp.module.css) for pixel-perfect axelered-inspired design.
 * All animation logic lives here (client component).
 */

import type { CSSProperties, ReactNode } from "react";
import { useEffect, useRef, useState, useCallback } from "react";
import type { LPVariantConfig } from "@/lib/lp-registry";
import styles from "./lp.module.css";
import { BookingSection } from "@/components/booking/BookingSection";

// ─── Icons (inline SVG to avoid dependencies) ────────────────────────────────
const IconDoc = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="1" width="12" height="14" rx="2"/>
    <path d="M5 5h6M5 8h6M5 11h4"/>
  </svg>
);
const IconChart = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12L5.5 7.5 8.5 10.5 11 7 14 4"/>
    <circle cx="5.5" cy="7.5" r="1" fill="currentColor" stroke="none"/>
    <circle cx="8.5" cy="10.5" r="1" fill="currentColor" stroke="none"/>
    <circle cx="11" cy="7" r="1" fill="currentColor" stroke="none"/>
  </svg>
);
const IconClock = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="8" cy="8" r="6.5"/>
    <path d="M8 4.5v3.5l2 1.5"/>
  </svg>
);
const IconCheck = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M2.5 8.5L5.5 11.5L12.5 4.5"/>
  </svg>
);
const IconCheckSmall = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M2 7l3 3 6-6"/>
  </svg>
);
const IconLogo = () => (
  <svg viewBox="0 0 16 16" fill="white" width="16" height="16">
    <path d="M8 1.5A6.5 6.5 0 1 0 14.5 8 6.507 6.507 0 0 0 8 1.5ZM8 12a4 4 0 1 1 4-4 4 4 0 0 1-4 4Z" opacity=".35"/>
    <circle cx="8" cy="8" r="2.5"/>
  </svg>
);

// ─── Reveal hook ──────────────────────────────────────────────────────────────
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(`.${styles.reveal}`);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add(styles.revealVisible);
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

// ─── Typewriter hook ──────────────────────────────────────────────────────────
function useTypewriter(words: string[], enabled: boolean) {
  const [display, setDisplay] = useState(words[0] ?? "");
  const idx = useRef(0);
  const charIdx = useRef((words[0] ?? "").length);
  const deleting = useRef(false);

  useEffect(() => {
    if (!enabled || words.length === 0) return;
    let timer: ReturnType<typeof setTimeout>;

    const tick = () => {
      const word = words[idx.current];
      if (!deleting.current) {
        if (charIdx.current < word.length) {
          charIdx.current++;
          setDisplay(word.slice(0, charIdx.current));
          timer = setTimeout(tick, 80);
        } else {
          deleting.current = true;
          timer = setTimeout(tick, 1800);
        }
      } else {
        if (charIdx.current > 0) {
          charIdx.current--;
          setDisplay(word.slice(0, charIdx.current));
          timer = setTimeout(tick, 55);
        } else {
          deleting.current = false;
          idx.current = (idx.current + 1) % words.length;
          timer = setTimeout(tick, 350);
        }
      }
    };

    timer = setTimeout(tick, 2200);
    return () => clearTimeout(timer);
  }, [words, enabled]);

  return display;
}

// ─── Types ────────────────────────────────────────────────────────────────────
interface LPPageProps {
  content: LPVariantConfig;
  localCTA: string;
  trustLine: string;
}

type PanelKey = "roadmap" | "metrics" | "trace";
const SVC_KEYS = ["sales", "support", "ops", "intel"] as const;
type SvcKey = typeof SVC_KEYS[number];

// ─── Main Component ───────────────────────────────────────────────────────────
export function LPPage({ content, localCTA, trustLine }: LPPageProps) {
  useReveal();

  // Hero panel tabs
  const [activePanel, setActivePanel] = useState<PanelKey>("roadmap");
  const [activeFeature, setActiveFeature] = useState<PanelKey>("roadmap");

  const setPanel = useCallback((key: PanelKey) => {
    setActivePanel(key);
    setActiveFeature(key);
  }, []);

  // Services tabs + auto-rotate
  const [activeSvc, setActiveSvc] = useState<SvcKey>("sales");
  const svcTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const startSvcAuto = useCallback(() => {
    svcTimer.current = setInterval(() => {
      setActiveSvc((prev) => {
        const i = SVC_KEYS.indexOf(prev);
        return SVC_KEYS[(i + 1) % SVC_KEYS.length];
      });
    }, 4500);
  }, []);

  useEffect(() => {
    startSvcAuto();
    return () => { if (svcTimer.current) clearInterval(svcTimer.current); };
  }, [startSvcAuto]);

  const handleSvcClick = (key: SvcKey) => {
    if (svcTimer.current) clearInterval(svcTimer.current);
    setActiveSvc(key);
    startSvcAuto();
  };

  // Typewriter
  const twWords = content.hero.typewriterWords ?? [];
  const twDisplay = useTypewriter(twWords, twWords.length > 0);

  // Parse headline: replace {typewriter} placeholder
  const rawHeadline = content.hero.headline;
  const hasTw = rawHeadline.includes("{typewriter}");
  const headlineParts = hasTw ? rawHeadline.split("{typewriter}") : [rawHeadline];

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
              <li><a href="#services">Services</a></li>
              <li><a href="#pricing">Pricing</a></li>
              <li><a href="#articles">Insights</a></li>
              <li><a href="#">Company</a></li>
            </ul>
            <a href="#cta" className={styles.navCta}>
              {localCTA}
            </a>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.heroContent}>
            {/* Left */}
            <div>
              <div className={styles.heroEyebrow}>{content.hero.eyebrow}</div>
              <h1 className={styles.heroH1}>
                {headlineParts[0]}
                {hasTw && (
                  <><span className={styles.twWord}>{twDisplay}</span>{headlineParts[1]}</>
                )}
                <span className={styles.cursor} aria-hidden="true" />
              </h1>
              <p className={styles.heroSub}>{content.hero.subhead}</p>
              <div className={styles.heroFeatures}>
                {(["roadmap","metrics","trace"] as PanelKey[]).map((key, i) => {
                  const labels: Record<PanelKey, { title: string; desc: string }> = {
                    roadmap: { title: "Strategy & Roadmap", desc: "Structured AI assessment with a clear, prioritised roadmap in week one." },
                    metrics: { title: "End-to-End Build", desc: "Full implementation — from architecture to production deployment." },
                    trace:   { title: "Observe & Optimise", desc: "30-day post-launch review against KPIs. We fix what isn't working." },
                  };
                  const icons = [<IconDoc key="doc"/>, <IconChart key="chart"/>, <IconClock key="clock"/>];
                  return (
                    <div
                      key={key}
                      className={`${styles.heroFeature} ${activeFeature === key ? styles.heroFeatureActive : ""}`}
                      onClick={() => setPanel(key)}
                    >
                      <div className={styles.hfIcon}>{icons[i]}</div>
                      <div>
                        <div className={styles.hfTitle}>{labels[key].title}</div>
                        <div className={styles.hfDesc}>{labels[key].desc}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right panel */}
            <div className={styles.heroRight}>
              <div className={styles.heroPanel}>
                <div className={styles.panelBar}>
                  <div className={styles.trafficDots}>
                    <div className={`${styles.td} ${styles.tdR}`}/>
                    <div className={`${styles.td} ${styles.tdY}`}/>
                    <div className={`${styles.td} ${styles.tdG}`}/>
                  </div>
                  <div className={styles.panelTabRow}>
                    {(["roadmap","metrics","trace"] as PanelKey[]).map((key) => {
                      const label: Record<PanelKey,string> = { roadmap:"Project Roadmap", metrics:"Results", trace:"Live Trace" };
                      return (
                        <button
                          key={key}
                          className={`${styles.panelTab} ${activePanel === key ? styles.panelTabActive : ""}`}
                          onClick={() => setPanel(key)}
                        >
                          {label[key]}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Roadmap */}
                <div className={`${styles.panelContent} ${activePanel === "roadmap" ? styles.panelContentActive : ""}`}>
                  {[
                    { week:"Wk 1", title:"Discovery & AI audit", desc:"Mapped 9 manual workflows, ranked by ROI", status:"done" },
                    { week:"Wk 2", title:"Lead qualification agent", desc:"Built, integrated with Salesforce, deployed", status:"done" },
                    { week:"Wk 3", title:"Outreach personalisation", desc:"Training on 200 past emails — live review today", status:"active" },
                    { week:"Wk 4–5", title:"Support triage AI", desc:"Zendesk integration + auto-classification model", status:"next" },
                    { week:"Wk 6", title:"30-day performance review", desc:"KPI report, refinements, team handover", status:"next" },
                  ].map((row, i) => (
                    <div key={i} className={styles.ptRow}>
                      <span className={styles.ptWeek}>{row.week}</span>
                      <div>
                        <div className={styles.ptTitle}>{row.title}</div>
                        <div className={styles.ptDesc}>{row.desc}</div>
                      </div>
                      <span className={`${styles.ptStatus} ${row.status === "done" ? styles.sDone : row.status === "active" ? styles.sActive : styles.sNext}`}>
                        {row.status === "done" ? "Done" : row.status === "active" ? "Active" : "Next"}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Metrics */}
                <div className={`${styles.panelContent} ${activePanel === "metrics" ? styles.panelContentActive : ""}`}>
                  <div className={styles.metricsGrid}>
                    {[
                      { label:"Time Saved", value:<><em>18</em> hrs</>, sub:"per week · ops team" },
                      { label:"Tickets Resolved", value:<><em>79</em>%</>, sub:"without human touch" },
                      { label:"Meetings Booked", value:<><em>3×</em></>, sub:"vs. pre-AI baseline" },
                      { label:"Deploy Time", value:<><em>3</em> wks</>, sub:"avg. project duration" },
                    ].map((m, i) => (
                      <div key={i} className={styles.metricCard}>
                        <div className={styles.metricLabel}>{m.label}</div>
                        <div className={styles.metricValue}>{m.value}</div>
                        <div className={styles.metricSub}>{m.sub}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Trace */}
                <div className={`${styles.panelContent} ${activePanel === "trace" ? styles.panelContentActive : ""}`}>
                  <div style={{marginBottom:"0.5rem",fontSize:"0.72rem",color:"var(--lp-ink-muted)",fontFamily:"Roboto Mono, monospace"}}>
                    run #4,291 · sales-qualification-agent
                  </div>
                  {[
                    { label:"TRIGGER", text:"New Salesforce lead: Acme Corp", time:"0ms", style:{background:"var(--lp-accent-bg)",borderLeft:"2px solid var(--lp-accent)"} as CSSProperties, labelColor:"var(--lp-accent)" },
                    { label:"ENRICH",  text:"LinkedIn + Apollo enrichment",    time:"1.1s", style:{border:"1px solid var(--lp-border)"} as CSSProperties, labelColor:"var(--lp-ink-muted)" },
                    { label:"SCORE",   text:"ICP match: 91/100 → Priority",    time:"0.3s", style:{border:"1px solid var(--lp-border)"} as CSSProperties, labelColor:"var(--lp-ink-muted)" },
                    { label:"DRAFT",   text:"Personalised outreach written",    time:"2.2s", style:{border:"1px solid var(--lp-border)"} as CSSProperties, labelColor:"var(--lp-ink-muted)" },
                    { label:"DONE",    text:"AE notified via Slack",            time:"3.8s", style:{background:"#f0fdf4",borderLeft:"2px solid #16a34a"} as CSSProperties, labelColor:"#16a34a" },
                  ].map((r, i) => (
                    <div key={i} className={styles.traceRow} style={r.style}>
                      <span className={styles.trLabel} style={{color:r.labelColor}}>{r.label}</span>
                      <span className={styles.trText}>{r.text}</span>
                      <span className={styles.trTime}>{r.time}</span>
                    </div>
                  ))}
                  <div style={{marginTop:"0.5rem",padding:"0.45rem 0.7rem",background:"var(--lp-bg-card)",borderRadius:"5px",display:"flex",justifyContent:"space-between",fontSize:"0.72rem",color:"var(--lp-ink-faint)",fontFamily:"Roboto Mono, monospace"}}>
                    <span>total: 3.8s · cost: $0.0012</span>
                    <span style={{color:"#16a34a",fontWeight:600}}>✓ success</span>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── LOGO STRIP ── */}
      <div className={styles.logoStrip}>
        <div className={styles.container}>
          <div className={styles.logoStripInner}>
            <span className={styles.logoStripLabel}>Trusted by</span>
            <div className={styles.logos}>
              {["Meridian","Haulcraft","Orbis","Novaline","Fieldset","Crestwork"].map(n => (
                <span key={n} className={styles.logoItem}>{n}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── CAPABILITIES ── */}
      <section className={styles.capabilities} id="how">
        <div className={styles.container}>
          <div className={`${styles.capabilitiesHeader} ${styles.reveal}`}>
            <div className={styles.sectionEyebrow}>What We Deliver</div>
            <h2 className={styles.sectionH2}>
              The full stack of AI consultancy<span className={styles.cursor} aria-hidden="true"/>
            </h2>
            <p className={styles.sectionBody}>
              Every engagement goes end-to-end — from strategy through deployment to continuous optimisation. No hand-offs to junior teams. No generic playbooks.
            </p>
          </div>
          <div className={styles.capGrid}>
            {[
              { title:"Strategy & Discovery", desc:"A structured AI audit maps your highest-ROI opportunities. You leave week one with a prioritised roadmap, not a sales deck.", delay:0 },
              { title:"End-to-End Build", desc:"From model selection to production deployment. We handle the full stack — no external vendors, no subcontractors, no surprises.", delay:1 },
              { title:"Observability", desc:"Step-level execution traces, cost tracking, and performance dashboards included. Every agent ships with full visibility.", delay:2 },
              { title:"Workflow Automation", desc:"Automate the manual tasks your team dreads — scheduling, reporting, data entry, triage — connected to your real tools.", delay:1 },
              { title:"Integrations", desc:"We wire AI into your existing stack — Salesforce, HubSpot, Zendesk, Slack, and 50+ other tools. No rip-and-replace.", delay:2 },
              { title:"Continuous Optimisation", desc:"30-day post-launch review included. We measure against the KPIs we scoped together — and fix whatever isn't hitting the mark.", delay:3 },
            ].map((c, i) => (
              <div key={i} className={`${styles.capCard} ${styles.reveal} ${[styles.revealDelay1, styles.revealDelay2, styles.revealDelay3, styles.revealDelay4][c.delay] ?? ""}`}>
                <div className={styles.capIcon}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="6" height="6" rx="1.5"/><rect x="11" y="3" width="6" height="6" rx="1.5"/><rect x="3" y="11" width="6" height="6" rx="1.5"/><rect x="11" y="11" width="6" height="6" rx="1.5"/>
                  </svg>
                </div>
                <div className={styles.capTitle}>{c.title}</div>
                <p className={styles.capDesc}>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DARK SECTION ── */}
      <section className={styles.darkSection}>
        <div className={styles.container}>
          <div className={styles.reveal}>
            <div className={`${styles.sectionEyebrow} ${styles.darkEyebrow}`}>Our Principles</div>
            <h2 className={`${styles.sectionH2} ${styles.darkH2}`}>
              AI consultancy without compromises
              <span className={styles.cursor} style={{background:"#EEE5F7"}} aria-hidden="true"/>
            </h2>
            <p className={`${styles.sectionBody} ${styles.darkBody}`}>
              We believe businesses deserve AI that actually works — not demos, not pilots that never ship, not opaque black boxes. Every engagement is structured around delivering real, measurable outcomes.
            </p>
            <div className={styles.darkPills}>
              {["Fixed-Scope Contracts","IP Owned By You","Dedicated Senior Consultants"].map(p => (
                <span key={p} className={styles.darkPill}><IconCheckSmall/>{p}</span>
              ))}
            </div>
          </div>
          <div className={styles.darkGrid}>
            {[
              { num:"01", title:"No engineering bottleneck", desc:"If you can describe the task in plain English, we can build the agent. Your team leads the direction. We handle the execution.", delay:0 },
              { num:"02", title:"Fixed scope, fixed price", desc:"No hourly billing surprises. Every engagement is priced and scoped before you sign. If anything changes, we tell you before it hits the invoice.", delay:1 },
              { num:"03", title:"SMB-first, always", desc:"We don't take enterprise retainers that dwarf our smaller clients. Startups and SMBs are the focus — not an afterthought between bigger deals.", delay:2 },
            ].map((c, i) => (
              <div key={i} className={`${styles.darkCard} ${styles.reveal} ${[styles.revealDelay1, styles.revealDelay2][i] ?? ""}`}>
                <div className={styles.darkCardNum}>{c.num}</div>
                <div className={styles.darkCardTitle}>{c.title}</div>
                <p className={styles.darkCardDesc}>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES TABS ── */}
      <section className={styles.servicesSection} id="services">
        <div className={styles.container}>
          <div className={`${styles.servicesHeader} ${styles.reveal}`}>
            <div className={styles.sectionEyebrow}>Services</div>
            <h2 className={styles.sectionH2}>Real systems, real results</h2>
            <p className={styles.sectionBody}>We build AI that fits your business, not the other way around.</p>
          </div>
          <div className={styles.servicesTabs}>
            {(SVC_KEYS as readonly SvcKey[]).map((key) => {
              const label: Record<SvcKey,string> = { sales:"Sales AI", support:"Support AI", ops:"Operations", intel:"Intelligence" };
              return (
                <button
                  key={key}
                  className={`${styles.svcTab} ${activeSvc === key ? styles.svcTabActive : ""}`}
                  onClick={() => handleSvcClick(key)}
                >
                  {label[key]}
                </button>
              );
            })}
          </div>
          <div>
            <ServicePanel svcKey="sales" active={activeSvc === "sales"} styles={styles}/>
            <ServicePanel svcKey="support" active={activeSvc === "support"} styles={styles}/>
            <ServicePanel svcKey="ops" active={activeSvc === "ops"} styles={styles}/>
            <ServicePanel svcKey="intel" active={activeSvc === "intel"} styles={styles}/>
          </div>
        </div>
      </section>

      {/* ── TIERS ── */}
      <section className={styles.tiersSection} id="pricing">
        <div className={styles.container}>
          <div className={`${styles.tiersHeader} ${styles.reveal}`}>
            <div className={styles.sectionEyebrow}>Engagements</div>
            <h2 className={styles.sectionH2}>Straight-forward engagements</h2>
            <p className={styles.sectionBody}>No retainer traps. No ambiguous hourly billing. Pick the engagement that fits where you are.</p>
          </div>
          <div className={styles.tiersGrid}>
            <TierCard
              styles={styles}
              name="Discovery"
              price="Free"
              period="60-min strategy call · No commitment"
              features={["AI opportunity assessment","Priority use case identification","Rough effort & ROI estimates","No sales pressure"]}
              btnLabel="Book discovery call"
              btnHref="#cta"
              delay={0}
            />
            <TierCard
              styles={styles}
              featured
              name="Project"
              price={<>from <span style={{fontFamily:"Google Sans Display, sans-serif",fontSize:"1.6rem",color:"#262626"}}>$4,900</span></>}
              period="Fixed scope · Delivered in 3–6 weeks"
              features={["Full discovery & scoping","End-to-end AI system build","Integration with your stack","30-day performance review","All IP owned by you"]}
              btnLabel="Start a project"
              btnHref="#cta"
              delay={1}
            />
            <TierCard
              styles={styles}
              name="Retainer"
              price={<>from <span style={{fontFamily:"Google Sans Display, sans-serif",fontSize:"1.6rem",color:"#262626"}}>$2,500</span><span className={styles.tierPriceSuffix}>/mo</span></>}
              period="Ongoing · Cancel with 30 days notice"
              features={["Dedicated AI consultant","Monthly build priorities","Continuous optimisation","Priority response SLA","Quarterly strategy reviews"]}
              btnLabel="Talk to us"
              btnHref="#cta"
              delay={2}
            />
          </div>
        </div>
      </section>

      {/* ── TRUST ── */}
      <section className={styles.trustSection}>
        <div className={styles.container}>
          <div className={`${styles.trustHeader} ${styles.reveal}`}>
            <div className={styles.sectionEyebrow}>Trust & Transparency</div>
            <h2 className={styles.sectionH2}>Accountable from day one</h2>
          </div>
          <div className={styles.trustGrid}>
            {[
              { title:"Fixed-Scope Contracts", desc:"Every engagement is priced and scoped before you sign. No hourly surprises. No scope creep billed to you without prior agreement.", delay:0 },
              { title:"Full IP Transfer", desc:"All code, models, prompts, and systems we build are 100% owned by you. No vendor lock-in, no licensing, no strings attached.", delay:1 },
              { title:"Senior-Only Delivery", desc:"Every consultant on our team has shipped production AI systems. We don't hand off to junior staff or third-party subcontractors.", delay:2 },
            ].map((c, i) => (
              <div key={i} className={`${styles.trustCard} ${styles.reveal} ${[styles.revealDelay1, styles.revealDelay2][i] ?? ""}`}>
                <div className={styles.trustIcon}><IconCheck /></div>
                <div className={styles.trustTitle}>{c.title}</div>
                <p className={styles.trustDesc}>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ARTICLES ── */}
      <section className={styles.articlesSection} id="articles">
        <div className={styles.container}>
          <div className={styles.articlesHeader}>
            <div>
              <div className={styles.sectionEyebrow}>Insights</div>
              <h2 className={styles.sectionH2} style={{marginBottom:0}}>Latest thinking</h2>
            </div>
            <a href="#" className={styles.articlesViewAll}>View all →</a>
          </div>
          <div className={styles.articlesGrid}>
            {[
              { tag:"Strategy",      title:"Why most AI consultancy projects fail before they start", date:"Apr 28, 2026", delay:0 },
              { tag:"Implementation",title:"The 3-week AI project: a realistic timeline for SMBs",     date:"Apr 15, 2026", delay:1 },
              { tag:"ROI",           title:"How to measure AI ROI before you've built anything",       date:"Mar 31, 2026", delay:2 },
            ].map((a, i) => (
              <a key={i} href="#" className={`${styles.articleCard} ${styles.reveal} ${[styles.revealDelay1, styles.revealDelay2][i] ?? ""}`}>
                <div className={styles.articleThumb}>
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="rgba(91,26,124,0.4)" strokeWidth="1.5">
                    <rect x="4" y="4" width="24" height="24" rx="4"/><path d="M10 16h12M10 11h12M10 21h8"/>
                  </svg>
                </div>
                <div className={styles.articleBody}>
                  <div className={styles.articleTag}>{a.tag}</div>
                  <div className={styles.articleTitle}>{a.title}</div>
                  <div className={styles.articleDate}>{a.date}</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA — AI-powered booking flow ── */}
      <BookingSection
        ctaLabel={content.ctaBand.buttonLabel}
        trustLine={trustLine}
      />

      {/* ── FOOTER ── */}
      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.footerInner}>
            <div>
              <a href="/" className={styles.navLogo} style={{marginBottom:"0.5rem",display:"inline-flex"}}>
                <div className={styles.navLogoMark}><IconLogo/></div>
                <span className={styles.navLogoText}>Perea.AI</span>
              </a>
              <p className={styles.footerTagline}>AI consultancy for startups and growing businesses. Strategy, build, and results.</p>
            </div>
            <div className={styles.footerCols}>
              {[
                { title:"Services", links:[["Sales AI","#"],["Support AI","#"],["Operations AI","#"],["Intelligence","#"]] },
                { title:"Engagements", links:[["Discovery Call","#"],["Project","#"],["Retainer","#"],["Enterprise","#"]] },
                { title:"Insights", links:[["Blog","#"],["Case Studies","#"],["AI Glossary","#"]] },
                { title:"Company", links:[["About","#"],["Team","#"],["Privacy","#"],["Terms","#"]] },
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

// ─── Service Panel subcomponent ───────────────────────────────────────────────
function ServicePanel({ svcKey, active, styles }: { svcKey: SvcKey; active: boolean; styles: { readonly [key: string]: string } }) {
  const data: Record<SvcKey, { tag:string; title:string; desc:string; result:string; traceRows: { label:string; text:string; time:string; variant:"trigger"|"normal"|"done" }[] }> = {
    sales: {
      tag:"Sales", title:"Your AI SDR that never sleeps",
      desc:"We build AI systems that research inbound leads, score them against your ICP, and draft personalised outreach — handing warm prospects to your team with full context. Your SDRs stop doing research and start closing.",
      result:"Typical result: 3× more qualified meetings per week",
      traceRows:[
        { label:"TRIGGER", text:"New lead: Acme Corp (HubSpot)", time:"0ms", variant:"trigger" },
        { label:"RESEARCH", text:"LinkedIn + company intel enrichment", time:"1.4s", variant:"normal" },
        { label:"SCORE", text:"ICP match: 88/100 → Hot", time:"0.2s", variant:"normal" },
        { label:"DRAFT", text:"Personalised 3-line email written", time:"1.9s", variant:"normal" },
        { label:"DONE", text:"AE notified · awaiting approval", time:"3.6s", variant:"done" },
      ],
    },
    support: {
      tag:"Support", title:"Resolve 80% of tickets automatically",
      desc:"Not a chatbot. A real AI support system trained on your knowledge base, integrated with your helpdesk, and designed to resolve — not deflect. Complex issues get escalated with a full transcript so your team never starts cold.",
      result:"Typical result: 70–80% tickets resolved without human touch",
      traceRows:[
        { label:"TICKET", text:"#8,821 · Billing question", time:"0ms", variant:"trigger" },
        { label:"CLASSIFY", text:"Category: Billing · Confidence: 97%", time:"0.1s", variant:"normal" },
        { label:"LOOKUP", text:"KB: found 2 matching articles", time:"0.4s", variant:"normal" },
        { label:"RESOLVE", text:"Step-by-step reply sent to customer", time:"1.1s", variant:"done" },
      ],
    },
    ops: {
      tag:"Operations", title:"Put your ops workflows on autopilot",
      desc:"We identify the manual work eating your team's time — scheduling, data entry, reporting, compliance checks — and automate it properly. Connected to your real tools, tested in your real environment, with documentation your team can actually use.",
      result:"Typical result: 10–20 hours/week recovered per team",
      traceRows:[
        { label:"SCHEDULE", text:"Weekly report triggered (Mon 07:00)", time:"0ms", variant:"trigger" },
        { label:"FETCH", text:"CRM + analytics data pulled", time:"0.8s", variant:"normal" },
        { label:"COMPILE", text:"Report compiled: 14 pages", time:"2.1s", variant:"normal" },
        { label:"SEND", text:"Distributed to 6 stakeholders", time:"2.4s", variant:"done" },
      ],
    },
    intel: {
      tag:"Intelligence", title:"Market briefings, written by an AI analyst",
      desc:"Daily AI-generated briefings on competitors, market moves, and industry signals — delivered to your inbox or Slack before your team starts their day. We configure the sources, build the pipeline, and tune it until it's actually useful.",
      result:"Typical result: 3 hrs/week saved on manual research",
      traceRows:[
        { label:"SCAN", text:"47 sources crawled overnight", time:"0ms", variant:"trigger" },
        { label:"FILTER", text:"12 signals above relevance threshold", time:"1.2s", variant:"normal" },
        { label:"DRAFT", text:"Brief written: competitor raised $12M", time:"3.1s", variant:"normal" },
        { label:"DELIVER", text:"Slack DM sent · 07:45am", time:"3.4s", variant:"done" },
      ],
    },
  };

  const d = data[svcKey];
  const trStyle = {
    trigger: { background:"var(--lp-accent-bg)", borderLeft:"2px solid var(--lp-accent)" } as CSSProperties,
    normal:  { border:"1px solid var(--lp-border)" } as CSSProperties,
    done:    { background:"#f0fdf4", borderLeft:"2px solid #16a34a" } as CSSProperties,
  };
  const labelColor = { trigger:"var(--lp-accent)", normal:"var(--lp-ink-muted)", done:"#16a34a" };

  return (
    <div className={`${styles.svcPanel} ${active ? styles.svcPanelActive : ""}`}>
      <div>
        <span className={styles.svcTag}>{d.tag}</span>
        <div className={styles.svcTitle}>{d.title}</div>
        <p className={styles.svcDesc}>{d.desc}</p>
        <div className={styles.svcResult}><IconCheck />{d.result}</div>
      </div>
      <div className={styles.svcMockup}>
        <div className={styles.mockupBar}>
          <div className={styles.trafficDots}><div className={`${styles.td} ${styles.tdR}`}/><div className={`${styles.td} ${styles.tdY}`}/><div className={`${styles.td} ${styles.tdG}`}/></div>
          <span className={styles.mockupBarLabel}>{d.tag} Agent · Active</span>
        </div>
        <div className={styles.mockupBody}>
          {d.traceRows.map((r, i) => (
            <div key={i} className={styles.traceRow} style={trStyle[r.variant]}>
              <span className={styles.trLabel} style={{color:labelColor[r.variant]}}>{r.label}</span>
              <span className={styles.trText}>{r.text}</span>
              <span className={styles.trTime}>{r.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Tier Card subcomponent ───────────────────────────────────────────────────
function TierCard({ styles, name, price, period, features, btnLabel, btnHref, featured, delay }: {
  styles: { readonly [key: string]: string };
  name: string;
  price: ReactNode;
  period: string;
  features: string[];
  btnLabel: string;
  btnHref: string;
  featured?: boolean;
  delay?: number;
}) {
  const delayClass = delay === 1 ? styles.revealDelay1 : delay === 2 ? styles.revealDelay2 : "";
  return (
    <div className={`${styles.tierCard} ${featured ? styles.tierCardFeatured : ""} ${styles.reveal} ${delayClass}`}>
      {featured && <div className={styles.tierFeaturedBadge}>Most common</div>}
      <div className={styles.tierName}>{name}</div>
      <div className={styles.tierPrice}>{price}</div>
      <div className={styles.tierPeriod}>{period}</div>
      <hr className={styles.tierDivider}/>
      <ul className={styles.tierList}>
        {features.map((f) => (
          <li key={f}><span className={styles.tierCheck}>✓</span>{f}</li>
        ))}
      </ul>
      <a href={btnHref} className={featured ? styles.btnTierAccent : styles.btnTierOutline}>
        {btnLabel}
      </a>
    </div>
  );
}

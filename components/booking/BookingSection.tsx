"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./booking.module.css";

// Calendly scheduling URL (pre-populated with lead info via query params)
const CALENDLY_BASE_URL = "https://calendly.com/dante-perea/30min";

type State = "idle" | "submitting" | "calling" | "booked" | "error";

interface FormData {
  name: string;
  email: string;
  phone: string;
}

// ─── Icons ───────────────────────────────────────────────────────────────────
const IconPhone = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V13a1 1 0 01-1 1h-2C7.82 14 2 8.18 2 5V3z"/>
  </svg>
);

const IconCheck = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l4 4 8-8"/>
  </svg>
);

const IconCalendar = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1.5" y="2.5" width="12" height="11" rx="2"/>
    <path d="M5 1v3M10 1v3M1.5 6h12"/>
  </svg>
);

const IconMeet = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="3" width="10" height="9" rx="2"/>
    <path d="M11 6l3-2v7l-3-2"/>
  </svg>
);

const IconTime = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="7.5" cy="7.5" r="6"/>
    <path d="M7.5 4.5v3l2 1.5"/>
  </svg>
);

// ─── Main Component ───────────────────────────────────────────────────────────
interface BookingSectionProps {
  ctaLabel?: string;
  trustLine?: string;
}

export function BookingSection({
  ctaLabel = "Get my free discovery call",
  trustLine = "50+ businesses transformed · No commitment",
}: BookingSectionProps) {
  const [state, setState] = useState<State>("idle");
  const [form, setForm] = useState<FormData>({ name: "", email: "", phone: "" });
  const [errorMsg, setErrorMsg] = useState("");
  const [isBooked, setIsBooked] = useState(false);
  const calendlyRef = useRef<HTMLDivElement>(null);

  // ── Listen for Calendly booking events ──────────────────────────────────
  useEffect(() => {
    function handleCalendlyEvent(e: MessageEvent) {
      if (e.data?.event === "calendly.event_scheduled") {
        setIsBooked(true);
        setState("booked");
      }
    }
    window.addEventListener("message", handleCalendlyEvent);
    return () => window.removeEventListener("message", handleCalendlyEvent);
  }, []);

  // ── Load Calendly widget script when needed ──────────────────────────────
  useEffect(() => {
    if (state !== "calling") return;
    if (document.getElementById("calendly-widget-script")) return;

    const script = document.createElement("script");
    script.id = "calendly-widget-script";
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    document.body.appendChild(script);
  }, [state]);

  // ── Form submission ──────────────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone) return;

    setState("submitting");
    setErrorMsg("");

    try {
      const res = await fetch("/api/trigger-call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));

        // For international / plan-limitation errors: skip to calendar instead of erroring
        if (
          err.code === "international_not_supported" ||
          err.code === "missing_api_key"
        ) {
          // Show calling UI with a note, and reveal the calendar immediately
          setErrorMsg(err.error || "Phone call unavailable. Please book a slot directly below.");
          setState("calling"); // still shows Calendly embed
          setTimeout(() => {
            calendlyRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
          }, 300);
          return;
        }

        throw new Error(err.error || "Something went wrong. Please try again or book directly below.");
      }

      setState("calling");

      // Scroll to the Calendly embed after a brief pause
      setTimeout(() => {
        calendlyRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 600);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to initiate call. Please try again.");
      setState("error");
    }
  }

  // ── Build Calendly URL with prefill ─────────────────────────────────────
  const calendlyUrl = `${CALENDLY_BASE_URL}?name=${encodeURIComponent(form.name)}&email=${encodeURIComponent(form.email)}&hide_gdpr_banner=1`;

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <section className={styles.section} id="cta">
      <div className={styles.container}>

        {/* Header */}
        <div className={styles.eyebrow}>Get Started</div>
        <h2 className={styles.headline}>
          {state === "booked"
            ? "You're all set"
            : "Stop exploring AI. Start using it."}
        </h2>
        <p className={styles.subhead}>
          {state === "calling"
            ? "Aria from Perea.AI is calling you now. She'll introduce herself and ask a few quick questions. Or skip ahead and book directly below."
            : state === "booked"
            ? "Your discovery call is booked. Check your email for a Google Meet link and the details."
            : "Book a free 60-minute discovery call. An AI assistant will call you in 30 seconds to understand your needs — then connect you with the right consultant."}
        </p>

        {/* Social proof */}
        {(state === "idle" || state === "error") && (
          <div className={styles.proofRow}>
            <div className={styles.proofItem}><span>✓</span> <strong>50+</strong> businesses transformed</div>
            <div className={styles.proofItem}><span>⏱</span> 60-min call · No commitment</div>
            <div className={styles.proofItem}><span>🔒</span> Fixed price · IP stays yours</div>
          </div>
        )}

        {/* ── IDLE / ERROR: Form ── */}
        {(state === "idle" || state === "submitting" || state === "error") && (
          <div className={styles.formWrap}>
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.row}>
                <input
                  className={styles.input}
                  type="text"
                  placeholder="Your name"
                  required
                  value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  disabled={state === "submitting"}
                />
                <input
                  className={styles.input}
                  type="email"
                  placeholder="Work email"
                  required
                  value={form.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  disabled={state === "submitting"}
                />
              </div>
              <div className={styles.phoneWrap}>
                <span className={styles.phoneFlag}>🌍</span>
                <input
                  className={styles.input}
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  required
                  value={form.phone}
                  onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                  disabled={state === "submitting"}
                />
              </div>
              <button
                type="submit"
                className={styles.btn}
                disabled={state === "submitting"}
              >
                {state === "submitting" ? (
                  <><span className={styles.btnSpinner} /> Connecting...</>
                ) : (
                  <><IconPhone /> {ctaLabel}</>
                )}
              </button>
              <div className={styles.trustLine}>
                <span className={styles.aiBadge}>
                  <svg width="9" height="9" viewBox="0 0 9 9" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M1.5 4.5l2 2L7.5 2"/></svg>
                  AI calls you in &lt;30s
                </span>
                No credit card · No pitch deck
              </div>
            </form>

            {/* Error message */}
            {state === "error" && (
              <div className={styles.errorWrap} style={{ marginTop: "1rem" }}>
                <div className={styles.errorTitle}>Call couldn't be initiated</div>
                <div className={styles.errorDesc}>
                  {errorMsg || "Something went wrong. Please try again or book directly on Calendly."}
                </div>
                <button className={styles.retryBtn} onClick={() => setState("idle")}>
                  Try again
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── CALLING STATE ── */}
        {state === "calling" && !isBooked && (
          <div className={styles.callingWrap} ref={calendlyRef}>

            {/* Calling banner — adapts if call couldn't go through */}
            <div className={styles.callingBanner} style={errorMsg ? { background: "#fff7ed", borderColor: "#fdba74" } : {}}>
              <div className={styles.callingPulse} style={errorMsg ? { background: "#f97316" } : {}} />
              <div>
                {errorMsg ? (
                  <>
                    <div className={styles.callingTitle} style={{ color: "#9a3412" }}>
                      📅 Pick a time directly
                    </div>
                    <div className={styles.callingDesc} style={{ color: "#9a3412" }}>
                      {errorMsg} Select any available slot in the calendar below.
                    </div>
                  </>
                ) : (
                  <>
                    <div className={styles.callingTitle}>📞 Aria is calling {form.name.split(" ")[0]}...</div>
                    <div className={styles.callingDesc}>
                      She'll introduce herself from Perea.AI and ask 5 quick questions. The call takes about 4 minutes.
                      Can't take the call right now? Book a time slot directly below.
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Divider */}
            <div className={styles.orDivider}>Or pick a time directly</div>

            {/* Calendly inline embed */}
            <div className={styles.calendlyWrap}>
              <div
                className="calendly-inline-widget"
                data-url={calendlyUrl}
                style={{ width: "100%", height: "680px" }}
              />
            </div>
          </div>
        )}

        {/* ── BOOKED STATE ── */}
        {state === "booked" && (
          <div className={styles.bookedWrap}>
            <div className={styles.bookedIcon}>
              <IconCheck />
            </div>
            <div className={styles.bookedTitle}>Discovery call booked!</div>
            <div className={styles.bookedDesc}>
              Check your email at <strong>{form.email}</strong> for a confirmation with your Google Meet link and call agenda.
            </div>
            <div className={styles.bookedDetails}>
              <div className={styles.bookedDetail}>
                <IconCalendar />
                60-minute discovery call
              </div>
              <div className={styles.bookedDetail}>
                <IconMeet />
                Google Meet · link in your email
              </div>
              <div className={styles.bookedDetail}>
                <IconTime />
                No prep needed · we come briefed
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}

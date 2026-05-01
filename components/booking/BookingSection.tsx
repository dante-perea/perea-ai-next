"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import styles from "./booking.module.css";

const CALENDLY_BASE_URL    = "https://calendly.com/dante-perea/30min";
const MAX_CALL_MS          = 6 * 60 * 1000; // 6-min hard client cap (server cap is 5 min)
const CALL_WARNING_MS      = 5 * 60 * 1000; // warn user at 5 min

type State = "idle" | "submitting" | "connecting" | "in-call" | "call-ended" | "booked" | "error";

interface FormData { name: string; email: string; }

// ─── Icons ────────────────────────────────────────────────────────────────────
const IconMic = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="1" width="6" height="9" rx="3"/><path d="M2 8a6 6 0 0 0 12 0"/>
    <line x1="8" y1="14" x2="8" y2="16"/><line x1="5" y1="16" x2="11" y2="16"/>
  </svg>
);
const IconCheck = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l4 4 8-8"/>
  </svg>
);
const IconCalendar = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1.5" y="2.5" width="12" height="11" rx="2"/><path d="M5 1v3M10 1v3M1.5 6h12"/>
  </svg>
);
const IconMeet = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="3" width="10" height="9" rx="2"/><path d="M11 6l3-2v7l-3-2"/>
  </svg>
);
const IconTime = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="7.5" cy="7.5" r="6"/><path d="M7.5 4.5v3l2 1.5"/>
  </svg>
);
const IconEnd = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
    <path d="M1 13L13 1M13 13L1 1"/>
  </svg>
);

// ─── Main Component ───────────────────────────────────────────────────────────
interface BookingSectionProps {
  ctaLabel?: string;
  trustLine?: string;
}

export function BookingSection({
  ctaLabel = "Talk to Aria — our AI consultant",
  trustLine = "50+ businesses transformed · No commitment",
}: BookingSectionProps) {
  const [state, setState]       = useState<State>("idle");
  const [form, setForm]         = useState<FormData>({ name: "", email: "" });
  const [errorMsg, setErrorMsg] = useState("");
  const [callDuration, setCallDuration] = useState(0);
  const [showWarning, setShowWarning]   = useState(false);

  // Refs that survive re-renders without triggering them
  const retellClientRef  = useRef<{ startCall: (o: { accessToken: string }) => Promise<void>; stopCall: () => void; on: (event: string, cb: (...args: unknown[]) => void) => void } | null>(null);
  const hardTimeoutRef   = useRef<ReturnType<typeof setTimeout> | null>(null);
  const warningTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const durationTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const calendlyRef      = useRef<HTMLDivElement>(null);

  // ── Cleanup helper ───────────────────────────────────────────────────────
  const cleanup = useCallback(() => {
    if (hardTimeoutRef.current)    clearTimeout(hardTimeoutRef.current);
    if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);
    if (durationTimerRef.current)  clearInterval(durationTimerRef.current);
    hardTimeoutRef.current    = null;
    warningTimeoutRef.current = null;
    durationTimerRef.current  = null;
    setShowWarning(false);
  }, []);

  // ── Auto-end + move to Calendly ──────────────────────────────────────────
  const endCall = useCallback((reason?: string) => {
    console.log("[BookingSection] Call ending:", reason || "requested");
    cleanup();
    try { retellClientRef.current?.stopCall(); } catch { /* ignore */ }
    setState("call-ended");
    setTimeout(() => {
      calendlyRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 400);
  }, [cleanup]);

  // ── Calendly booking event ───────────────────────────────────────────────
  useEffect(() => {
    function onCalendly(e: MessageEvent) {
      if (e.data?.event === "calendly.event_scheduled") {
        cleanup();
        setState("booked");
      }
    }
    window.addEventListener("message", onCalendly);
    return () => window.removeEventListener("message", onCalendly);
  }, [cleanup]);

  // ── Calendly is now embedded via direct iframe — no script loading needed ──

  // ── Page-close / tab-switch safety ──────────────────────────────────────
  useEffect(() => {
    if (state !== "in-call") return;

    function onBeforeUnload(e: BeforeUnloadEvent) {
      endCall("page-close");
      e.preventDefault();
      e.returnValue = "";
    }

    function onVisibilityChange() {
      // If tab becomes hidden for more than 2 minutes, auto-end (cost protection)
      if (document.hidden) {
        hardTimeoutRef.current = setTimeout(() => {
          if (document.hidden) endCall("tab-hidden-timeout");
        }, 2 * 60 * 1000);
      } else {
        if (hardTimeoutRef.current) {
          clearTimeout(hardTimeoutRef.current);
          hardTimeoutRef.current = null;
        }
      }
    }

    window.addEventListener("beforeunload", onBeforeUnload);
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      window.removeEventListener("beforeunload", onBeforeUnload);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [state, endCall]);

  // ── Form submit ──────────────────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email) return;

    setState("submitting");
    setErrorMsg("");
    setCallDuration(0);

    try {
      // Request mic permission early for better UX
      await navigator.mediaDevices.getUserMedia({ audio: true });

      const res = await fetch("/api/web-call-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        // Rate limited — show message and auto-reveal Calendly
        if (res.status === 429 || err.code === "rate_limited") {
          setErrorMsg(err.error || "Too many calls. Please book a slot directly below.");
          setState("call-ended"); // shows Calendly immediately
          setTimeout(() => calendlyRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 300);
          return;
        }
        throw new Error(err.error || "Couldn't connect. Please book a slot below.");
      }

      const { accessToken } = await res.json();
      setState("connecting");

      // ── Load Retell SDK and wire ALL events BEFORE startCall ─────────────
      const { RetellWebClient } = await import("retell-client-js-sdk");
      const client = new RetellWebClient();
      retellClientRef.current = client;

      // ★ THE KEY FIX: Listen for server-side call end
      client.on("call_ended", () => {
        console.log("[Retell] call_ended event fired — auto-ending");
        endCall("retell-call_ended-event");
      });

      client.on("error", (err: unknown) => {
        console.error("[Retell] error event:", err);
        endCall("retell-error");
      });

      // ── Hard client-side timeout (6 min) — ultimate cost protection ──────
      hardTimeoutRef.current = setTimeout(() => {
        console.warn("[Retell] Hard timeout reached — force ending call");
        endCall("hard-timeout");
      }, MAX_CALL_MS);

      // Warning at 5 min
      warningTimeoutRef.current = setTimeout(() => {
        setShowWarning(true);
      }, CALL_WARNING_MS);

      // Duration counter (for display)
      durationTimerRef.current = setInterval(() => {
        setCallDuration(d => d + 1);
      }, 1000);

      // Start the call
      await client.startCall({ accessToken });
      setState("in-call");

      // Scroll so Calendly is visible below the active call banner
      setTimeout(() => {
        calendlyRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 2500);

    } catch (err) {
      cleanup();
      const msg = err instanceof Error ? err.message : "Something went wrong.";
      const isMicDenied = msg.toLowerCase().includes("permission") ||
                          msg.toLowerCase().includes("denied") ||
                          msg.toLowerCase().includes("notallowed");
      setErrorMsg(isMicDenied
        ? "Microphone access denied. Please allow it in your browser settings and try again."
        : msg);
      setState("error");
    }
  }

  // ── Calendly iframe URL — direct embed, no script dependency ────────────
  // Uses Calendly's embed_type=Inline which is reliable across all browsers.
  const calendlyUrl = `${CALENDLY_BASE_URL}?embed_type=Inline&embed_domain=www.perea.ai&name=${encodeURIComponent(form.name)}&email=${encodeURIComponent(form.email)}&hide_gdpr_banner=1&hide_event_type_details=0`;

  // ── Format seconds → mm:ss ───────────────────────────────────────────────
  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <section className={styles.section} id="cta">
      <div className={styles.container}>

        <div className={styles.eyebrow}>Get Started</div>
        <h2 className={styles.headline}>
          {state === "booked"    ? "You're all set"
          : state === "in-call"  ? "You're speaking with Aria"
          : "Stop exploring AI. Start using it."}
        </h2>
        <p className={styles.subhead}>
          {state === "in-call"
            ? "Aria is listening. Speak naturally — she'll ask a few quick questions about your business."
            : state === "call-ended"
            ? "Thanks for speaking with Aria. Pick a time for your full discovery call below."
            : state === "booked"
            ? "Your discovery call is booked. Check your email for a Google Meet link and the details."
            : "Have a quick 4-minute conversation with Aria, our AI consultant, right in your browser. Then book your discovery call with a human consultant."}
        </p>

        {/* Social proof */}
        {(state === "idle" || state === "error") && (
          <div className={styles.proofRow}>
            <div className={styles.proofItem}><span>✓</span> <strong>50+</strong> businesses transformed</div>
            <div className={styles.proofItem}><span>🌍</span> Works from any country</div>
            <div className={styles.proofItem}><span>🔒</span> Fixed price · IP stays yours</div>
          </div>
        )}

        {/* ── FORM ── */}
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
              <button type="submit" className={styles.btn} disabled={state === "submitting"}>
                {state === "submitting"
                  ? <><span className={styles.btnSpinner}/> Connecting...</>
                  : <><IconMic/> {ctaLabel}</>
                }
              </button>
              <div className={styles.trustLine}>
                <span className={styles.aiBadge}>
                  <svg width="9" height="9" viewBox="0 0 9 9" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M1.5 4.5l2 2L7.5 2"/></svg>
                  Browser mic · No phone needed
                </span>
                Works from any country · No credit card
              </div>
            </form>
            {state === "error" && (
              <div className={styles.errorWrap} style={{ marginTop: "1rem" }}>
                <div className={styles.errorTitle}>Couldn't connect</div>
                <div className={styles.errorDesc}>{errorMsg || "Something went wrong. Book a slot below."}</div>
                <button className={styles.retryBtn} onClick={() => setState("idle")}>Try again</button>
              </div>
            )}
          </div>
        )}

        {/* ── CONNECTING ── */}
        {state === "connecting" && (
          <div className={styles.callingWrap}>
            <div className={styles.callingBanner}>
              <div className={styles.callingPulse}/>
              <div>
                <div className={styles.callingTitle}>🎙️ Connecting to Aria...</div>
                <div className={styles.callingDesc}>
                  Allow microphone access if prompted. Aria will start speaking in a moment.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── IN CALL ── */}
        {state === "in-call" && (
          <div className={styles.callingWrap} ref={calendlyRef}>

            {/* Warning banner */}
            {showWarning && (
              <div style={{
                padding: "0.75rem 1.2rem",
                background: "#fff7ed",
                border: "1px solid #fdba74",
                borderRadius: "8px",
                marginBottom: "1rem",
                maxWidth: "480px",
                fontSize: "0.85rem",
                color: "#9a3412",
                fontWeight: 500,
              }}>
                ⏱ Call approaching limit — wrapping up in ~1 minute.
              </div>
            )}

            <div className={styles.callingBanner}>
              <div className={styles.callingPulse}/>
              <div style={{ flex: 1 }}>
                <div className={styles.callingTitle}>
                  🎙️ Live — speaking with Aria
                  <span style={{
                    marginLeft: "0.6rem",
                    fontSize: "0.75rem",
                    fontWeight: 400,
                    color: "#166534",
                    fontFamily: "monospace",
                  }}>
                    {fmt(callDuration)}
                  </span>
                </div>
                <div className={styles.callingDesc}>
                  Aria will end the call automatically when she's done. Or end it yourself anytime.
                </div>
              </div>
              <button
                onClick={() => endCall("user-ended")}
                style={{
                  flexShrink: 0, background: "#dc2626", color: "white",
                  border: "none", borderRadius: "6px", padding: "0.4rem 0.75rem",
                  fontSize: "0.78rem", fontWeight: 600, cursor: "pointer",
                  display: "flex", alignItems: "center", gap: "0.35rem",
                  fontFamily: "inherit",
                }}
              >
                <IconEnd/> End call
              </button>
            </div>

            <div className={styles.orDivider}>Or book directly while you talk</div>
            <div className={styles.calendlyWrap}>
              <iframe
                src={calendlyUrl}
                width="100%"
                height="680"
                frameBorder="0"
                title="Book a discovery call"
                style={{ display: "block", border: "none" }}
              />
            </div>
          </div>
        )}

        {/* ── CALL ENDED ── */}
        {state === "call-ended" && (
          <div className={styles.callingWrap} ref={calendlyRef}>
            <div className={styles.callingBanner} style={{ background: "#f0fdf4", borderColor: "#c6eac6" }}>
              <div className={styles.callingPulse} style={{ background: "#22c55e" }}/>
              <div>
                <div className={styles.callingTitle} style={{ color: "#166534" }}>
                  ✓ Great chat! Now pick a time for your discovery call.
                </div>
                <div className={styles.callingDesc} style={{ color: "#166534" }}>
                  Our consultant will review Aria's notes and come prepared. Grab any slot below.
                </div>
              </div>
            </div>
            <div className={styles.orDivider}>Select your slot</div>
            <div className={styles.calendlyWrap}>
              <iframe
                src={calendlyUrl}
                width="100%"
                height="680"
                frameBorder="0"
                title="Book a discovery call"
                style={{ display: "block", border: "none" }}
              />
            </div>
          </div>
        )}

        {/* ── BOOKED ── */}
        {state === "booked" && (
          <div className={styles.bookedWrap}>
            <div className={styles.bookedIcon}><IconCheck/></div>
            <div className={styles.bookedTitle}>Discovery call booked!</div>
            <div className={styles.bookedDesc}>
              Check your email at <strong>{form.email}</strong> for your Google Meet link and agenda.
            </div>
            <div className={styles.bookedDetails}>
              <div className={styles.bookedDetail}><IconCalendar/> 60-minute discovery call</div>
              <div className={styles.bookedDetail}><IconMeet/> Google Meet · link in your email</div>
              <div className={styles.bookedDetail}><IconTime/> No prep needed · we come briefed</div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}

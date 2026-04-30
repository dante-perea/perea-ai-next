"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import styles from "./booking.module.css";

const CALENDLY_BASE_URL = "https://calendly.com/dante-perea/30min";

type State = "idle" | "submitting" | "connecting" | "in-call" | "call-ended" | "booked" | "error";

interface FormData {
  name: string;
  email: string;
}

// ─── Icons ───────────────────────────────────────────────────────────────────
const IconMic = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="1" width="6" height="9" rx="3"/>
    <path d="M2 8a6 6 0 0 0 12 0"/>
    <line x1="8" y1="14" x2="8" y2="16"/>
    <line x1="5" y1="16" x2="11" y2="16"/>
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

const IconEnd = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M2 14L14 2M14 14L2 2"/>
  </svg>
);

// ─── Web Call Hook ────────────────────────────────────────────────────────────
function useRetellWebCall() {
  const clientRef = useRef<{ startCall: (opts: { accessToken: string }) => Promise<void>; stopCall: () => void } | null>(null);
  const [sdkLoaded, setSdkLoaded] = useState(false);

  useEffect(() => {
    // Dynamically import Retell Web SDK
    import("retell-client-js-sdk")
      .then(({ RetellWebClient }) => {
        clientRef.current = new RetellWebClient();
        setSdkLoaded(true);
      })
      .catch(() => {
        // SDK not available — will use fallback
        setSdkLoaded(true);
      });
  }, []);

  const startCall = useCallback(async (accessToken: string) => {
    if (!clientRef.current) throw new Error("SDK not loaded");
    await clientRef.current.startCall({ accessToken });
  }, []);

  const stopCall = useCallback(() => {
    clientRef.current?.stopCall();
  }, []);

  return { startCall, stopCall, sdkLoaded, hasClient: !!clientRef.current };
}

// ─── Main Component ───────────────────────────────────────────────────────────
interface BookingSectionProps {
  ctaLabel?: string;
  trustLine?: string;
}

export function BookingSection({
  ctaLabel = "Talk to Aria — our AI consultant",
  trustLine = "50+ businesses transformed · No commitment",
}: BookingSectionProps) {
  const [state, setState] = useState<State>("idle");
  const [form, setForm] = useState<FormData>({ name: "", email: "" });
  const [errorMsg, setErrorMsg] = useState("");
  const calendlyRef = useRef<HTMLDivElement>(null);
  const { startCall, stopCall, sdkLoaded } = useRetellWebCall();

  // ── Calendly booking detection ───────────────────────────────────────────
  useEffect(() => {
    function onCalendly(e: MessageEvent) {
      if (e.data?.event === "calendly.event_scheduled") {
        stopCall();
        setState("booked");
      }
    }
    window.addEventListener("message", onCalendly);
    return () => window.removeEventListener("message", onCalendly);
  }, [stopCall]);

  // ── Load Calendly widget script ──────────────────────────────────────────
  useEffect(() => {
    if (state !== "call-ended" && state !== "in-call") return;
    if (document.getElementById("calendly-script")) return;
    const script = document.createElement("script");
    script.id = "calendly-script";
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    document.body.appendChild(script);
  }, [state]);

  // ── Form submit — get token + start web call ─────────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email) return;

    setState("submitting");
    setErrorMsg("");

    try {
      // Request mic permission first for better UX
      await navigator.mediaDevices.getUserMedia({ audio: true });

      const res = await fetch("/api/web-call-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Couldn't start the call. Please book a slot below.");
      }

      const { accessToken } = await res.json();

      setState("connecting");

      // Start the Retell web call
      await startCall(accessToken);
      setState("in-call");

      // Scroll to Calendly after call starts — available if they want to book
      setTimeout(() => {
        calendlyRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 2000);
    } catch (err) {
      // Mic permission denied or other error
      const msg = err instanceof Error ? err.message : "Something went wrong.";
      if (msg.toLowerCase().includes("permission") || msg.toLowerCase().includes("denied") || msg.toLowerCase().includes("notallowed")) {
        setErrorMsg("Microphone access was denied. Please allow mic access in your browser and try again, or book a slot below.");
      } else {
        setErrorMsg(msg);
      }
      setState("error");
    }
  }

  // ── End call manually ────────────────────────────────────────────────────
  function handleEndCall() {
    stopCall();
    setState("call-ended");
    setTimeout(() => {
      calendlyRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 300);
  }

  // ── Calendly URL ─────────────────────────────────────────────────────────
  const calendlyUrl = `${CALENDLY_BASE_URL}?name=${encodeURIComponent(form.name)}&email=${encodeURIComponent(form.email)}&hide_gdpr_banner=1`;

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <section className={styles.section} id="cta">
      <div className={styles.container}>

        {/* Header */}
        <div className={styles.eyebrow}>Get Started</div>
        <h2 className={styles.headline}>
          {state === "booked"
            ? "You're all set 🎉"
            : state === "in-call"
            ? "You're speaking with Aria"
            : "Stop exploring AI. Start using it."}
        </h2>
        <p className={styles.subhead}>
          {state === "in-call"
            ? "Aria from Perea.AI is listening. She'll ask a few quick questions about your business — this takes about 4 minutes."
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
              <button
                type="submit"
                className={styles.btn}
                disabled={state === "submitting" || !sdkLoaded}
              >
                {state === "submitting" ? (
                  <><span className={styles.btnSpinner} /> Connecting...</>
                ) : (
                  <><IconMic /> {ctaLabel}</>
                )}
              </button>
              <div className={styles.trustLine}>
                <span className={styles.aiBadge}>
                  <svg width="9" height="9" viewBox="0 0 9 9" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M1.5 4.5l2 2L7.5 2"/></svg>
                  Browser mic · No phone needed
                </span>
                Works from any country · No credit card
              </div>
            </form>

            {/* Error + Calendly fallback */}
            {state === "error" && (
              <div className={styles.errorWrap} style={{ marginTop: "1rem" }}>
                <div className={styles.errorTitle}>Couldn&apos;t connect</div>
                <div className={styles.errorDesc}>
                  {errorMsg || "Something went wrong. Book a slot directly below."}
                </div>
                <button className={styles.retryBtn} onClick={() => setState("idle")}>
                  Try again
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── CONNECTING ── */}
        {state === "connecting" && (
          <div className={styles.callingWrap}>
            <div className={styles.callingBanner}>
              <div className={styles.callingPulse} />
              <div>
                <div className={styles.callingTitle}>🎙️ Connecting to Aria...</div>
                <div className={styles.callingDesc}>
                  Allow microphone access if prompted. Aria will introduce herself in a moment.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── IN CALL ── */}
        {state === "in-call" && (
          <div className={styles.callingWrap} ref={calendlyRef}>
            <div className={styles.callingBanner}>
              <div className={styles.callingPulse} />
              <div style={{ flex: 1 }}>
                <div className={styles.callingTitle}>🎙️ Live — speaking with Aria</div>
                <div className={styles.callingDesc}>
                  She&apos;ll ask about your business and what you&apos;re hoping AI can help with.
                  Speak naturally — she&apos;ll understand you.
                </div>
              </div>
              <button
                onClick={handleEndCall}
                style={{
                  flexShrink: 0,
                  background: "#dc2626",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  padding: "0.4rem 0.75rem",
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.3rem",
                  fontFamily: "inherit",
                }}
              >
                <IconEnd /> End call
              </button>
            </div>

            <div className={styles.orDivider}>Or book a time directly</div>

            <div className={styles.calendlyWrap}>
              <div
                className="calendly-inline-widget"
                data-url={calendlyUrl}
                style={{ width: "100%", height: "680px" }}
              />
            </div>
          </div>
        )}

        {/* ── CALL ENDED ── */}
        {state === "call-ended" && (
          <div className={styles.callingWrap} ref={calendlyRef}>
            <div className={styles.callingBanner} style={{ background: "#f0fdf4", borderColor: "#c6eac6" }}>
              <div className={styles.callingPulse} style={{ background: "#22c55e" }} />
              <div>
                <div className={styles.callingTitle} style={{ color: "#166534" }}>
                  ✓ Great chat! Now pick a time for your discovery call.
                </div>
                <div className={styles.callingDesc} style={{ color: "#166534" }}>
                  Our consultant will review Aria&apos;s notes and come prepared. Just grab any slot below.
                </div>
              </div>
            </div>

            <div className={styles.orDivider}>Select your slot</div>

            <div className={styles.calendlyWrap}>
              <div
                className="calendly-inline-widget"
                data-url={calendlyUrl}
                style={{ width: "100%", height: "680px" }}
              />
            </div>
          </div>
        )}

        {/* ── BOOKED ── */}
        {state === "booked" && (
          <div className={styles.bookedWrap}>
            <div className={styles.bookedIcon}><IconCheck /></div>
            <div className={styles.bookedTitle}>Discovery call booked!</div>
            <div className={styles.bookedDesc}>
              Check your email at <strong>{form.email}</strong> for your Google Meet link and agenda.
            </div>
            <div className={styles.bookedDetails}>
              <div className={styles.bookedDetail}><IconCalendar /> 60-minute discovery call</div>
              <div className={styles.bookedDetail}><IconMeet /> Google Meet · link in your email</div>
              <div className={styles.bookedDetail}><IconTime /> No prep needed · we come briefed</div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}

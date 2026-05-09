"use client";

import { useState } from "react";
import { usePostHog } from "posthog-js/react";
import styles from "./research.module.css";

interface Props {
  slug: string;
  title: string;
}

export function SubscribeBlock({ slug, title }: Props) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "ok" | "error">("idle");
  const posthog = usePostHog();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    posthog?.capture("research_subscribe_attempt", { slug, title, email });
    try {
      const res = await fetch("/api/research/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus("ok");
        setEmail("");
        posthog?.capture("research_subscribe_success", { slug, title });
      } else {
        setStatus("error");
        posthog?.capture("research_subscribe_error", { slug, title, status: res.status });
      }
    } catch {
      setStatus("error");
      posthog?.capture("research_subscribe_error", { slug, title, status: "network_error" });
    }
  }

  return (
    <div className={styles.subscribe}>
      <div className={styles.subscribeEyebrow}>perea.ai Research</div>
      <h3 className={styles.subscribeTitle}>One deep piece a month. Three weekly signals.</h3>
      <p className={styles.subscribeBody}>
        Get every B2A field report, protocol update, and benchmark from real audits — published before the rest of the market sees it. No filler. Unsubscribe in one click.
      </p>
      <form className={styles.subscribeForm} onSubmit={onSubmit}>
        <input
          className={styles.subscribeInput}
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          aria-label="Email address"
        />
        <button className={styles.subscribeSubmit} type="submit">
          {status === "ok" ? "Subscribed →" : "Subscribe"}
        </button>
      </form>
      {status === "error" && (
        <p style={{ marginTop: "0.75rem", fontSize: "0.82rem", color: "#a04545" }}>
          Subscription endpoint not yet live. Email research@perea.ai for now.
        </p>
      )}
    </div>
  );
}

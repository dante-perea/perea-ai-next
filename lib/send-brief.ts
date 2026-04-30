/**
 * Pre-Call Intelligence Brief sender.
 * Sends via Telegram (instant mobile alert) + Email (permanent record).
 *
 * Telegram: uses Bot API with HTML formatting
 * Email:    uses Resend API with branded HTML template
 */

import type { LeadEnrichment } from "./enrich-lead";
import type { LeadAnalysis }   from "./analyze-lead";

interface BriefPayload {
  // Lead basics
  name:       string;
  email:      string;
  callId?:    string;

  // Aria data
  transcript?:   string;
  retellSummary?: string;

  // Enrichment + analysis
  enrichment?: LeadEnrichment | null;
  analysis?:   LeadAnalysis   | null;
}

// ─── ICP badge ────────────────────────────────────────────────────────────────
function icpBadge(label?: string): string {
  if (label === "HOT")  return "🔥 HOT";
  if (label === "WARM") return "🌤 WARM";
  return "🧊 COLD";
}

// ─── TELEGRAM ─────────────────────────────────────────────────────────────────
export async function sendTelegramBrief(payload: BriefPayload): Promise<void> {
  const token  = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    console.warn("[send-brief] TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not set");
    return;
  }

  const { name, email, enrichment, analysis } = payload;
  const a = analysis;
  const e = enrichment;

  const score = a ? `${a.icpScore}/100 — ${icpBadge(a.icpLabel)}` : "—";
  const companyLine = [
    e?.companyName,
    e?.companySize ? `${e.companySize} employees` : null,
    e?.companyIndustry,
    e?.companyFunding,
  ].filter(Boolean).join(" · ") || "Company unknown";

  const personLine = [
    e?.title,
    e?.city && e?.country ? `${e.city}, ${e.country}` : e?.country,
  ].filter(Boolean).join(" · ") || "Role unknown";

  const talkingPoints = a?.talkingPoints?.length
    ? a.talkingPoints.map((p, i) => `${i + 1}. ${p}`).join("\n")
    : "No talking points generated.";

  const techStack = e?.technologies?.length
    ? e.technologies.join(", ")
    : "Unknown";

  const text = `🧠 <b>Pre-Call Intel Brief</b>
<b>${name}</b> · ${email}

<b>${companyLine}</b>
${personLine}${e?.linkedinUrl ? `\n🔗 <a href="${e.linkedinUrl}">LinkedIn</a>` : ""}${e?.companyWebsite ? ` · <a href="${e.companyWebsite}">Website</a>` : ""}

📊 <b>ICP Score: ${score}</b>
${a?.icpReason ?? "—"}

📞 <b>Aria's Summary</b>
${a?.summary ?? payload.retellSummary ?? "No summary available."}

🎯 <b>Suggested Talking Points</b>
${talkingPoints}

🏢 <b>Company Intel</b>
Tech stack: ${techStack}
${e?.companyDescription ? `"${e.companyDescription.slice(0, 150)}${e.companyDescription.length > 150 ? "…" : ""}"` : ""}

💡 Recommended tier: <b>${a?.recommendedTier ?? "Discovery"}</b>`;

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: "HTML",
      disable_web_page_preview: true,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("[send-brief] Telegram error:", res.status, err);
  } else {
    console.log("[send-brief] Telegram brief sent for:", name);
  }
}

// ─── EMAIL (via Resend) ───────────────────────────────────────────────────────
export async function sendEmailBrief(payload: BriefPayload): Promise<void> {
  const resendKey = process.env.RESEND_API_KEY;
  const toEmail   = process.env.BRIEF_TO_EMAIL ?? "dante@perea.ai";
  if (!resendKey) {
    console.warn("[send-brief] RESEND_API_KEY not set");
    return;
  }

  const { name, email, enrichment: e, analysis: a, transcript } = payload;
  const score      = a ? `${a.icpScore}/100` : "—";
  const icpColor   = a?.icpLabel === "HOT" ? "#dc2626" : a?.icpLabel === "WARM" ? "#d97706" : "#6b7280";
  const companyLine = [e?.companyName, e?.companySize ? `${e.companySize} employees` : null, e?.companyIndustry].filter(Boolean).join(" · ") || "Unknown company";
  const techStack  = e?.technologies?.length ? e.technologies.join(", ") : "Unknown";

  const tpList = a?.talkingPoints?.length
    ? a.talkingPoints.map(p => `<li style="margin-bottom:6px;">${p}</li>`).join("")
    : "<li>No talking points generated</li>";

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f9f9f9;font-family:'Inter',sans-serif;">
<div style="max-width:640px;margin:32px auto;background:#ffffff;border-radius:12px;border:1px solid #e4e3dc;overflow:hidden;">

  <!-- Header -->
  <div style="background:#5B1A7C;padding:24px 32px;">
    <p style="margin:0;color:rgba(255,255,255,0.65);font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;">Perea.AI · Pre-Call Intel Brief</p>
    <h1 style="margin:8px 0 4px;color:#fff;font-size:22px;font-weight:600;letter-spacing:-0.02em;">${name}</h1>
    <p style="margin:0;color:rgba(255,255,255,0.75);font-size:14px;">${email}</p>
  </div>

  <!-- Body -->
  <div style="padding:32px;">

    <!-- Company -->
    <p style="margin:0 0 4px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#9a9990;">Company</p>
    <p style="margin:0 0 24px;font-size:15px;color:#262626;">${companyLine}${e?.title ? ` · <em>${e.title}</em>` : ""}</p>

    <!-- ICP Score -->
    <div style="background:#f9f9f9;border:1px solid #e4e3dc;border-radius:8px;padding:16px 20px;margin-bottom:24px;display:flex;align-items:center;gap:16px;">
      <div>
        <p style="margin:0 0 2px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#9a9990;">ICP Score</p>
        <p style="margin:0;font-size:28px;font-weight:700;color:${icpColor};letter-spacing:-0.04em;">${score} <span style="font-size:14px;font-weight:600;">${icpBadge(a?.icpLabel ?? "COLD")}</span></p>
      </div>
      <div style="flex:1;border-left:1px solid #e4e3dc;padding-left:16px;">
        <p style="margin:0;font-size:13px;color:#57574f;line-height:1.5;">${a?.icpReason ?? "—"}</p>
      </div>
    </div>

    <!-- Summary -->
    <p style="margin:0 0 8px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#9a9990;">📞 Aria's Summary</p>
    <p style="margin:0 0 24px;font-size:14px;color:#262626;line-height:1.65;background:#f4f4ef;border-radius:6px;padding:14px 16px;">${a?.summary ?? payload.retellSummary ?? "No summary available."}</p>

    <!-- Talking Points -->
    <p style="margin:0 0 8px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#9a9990;">🎯 Suggested Talking Points</p>
    <ul style="margin:0 0 24px;padding-left:20px;font-size:14px;color:#262626;line-height:1.65;">${tpList}</ul>

    <!-- Company Intel -->
    <p style="margin:0 0 8px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#9a9990;">🏢 Company Intel</p>
    <table style="width:100%;border-collapse:collapse;font-size:13px;margin-bottom:24px;">
      ${e?.companyWebsite ? `<tr><td style="padding:6px 0;color:#9a9990;width:120px;">Website</td><td><a href="${e.companyWebsite}" style="color:#5B1A7C;">${e.companyWebsite}</a></td></tr>` : ""}
      ${e?.companyFunding ? `<tr><td style="padding:6px 0;color:#9a9990;">Funding</td><td style="color:#262626;">${e.companyFunding}</td></tr>` : ""}
      ${e?.companyFounded ? `<tr><td style="padding:6px 0;color:#9a9990;">Founded</td><td style="color:#262626;">${e.companyFounded}</td></tr>` : ""}
      <tr><td style="padding:6px 0;color:#9a9990;">Tech stack</td><td style="color:#262626;">${techStack}</td></tr>
      ${e?.linkedinUrl ? `<tr><td style="padding:6px 0;color:#9a9990;">LinkedIn</td><td><a href="${e.linkedinUrl}" style="color:#5B1A7C;">View profile</a></td></tr>` : ""}
    </table>

    <!-- Recommended tier -->
    <div style="background:#EEE5F7;border-radius:8px;padding:14px 20px;display:flex;align-items:center;justify-content:space-between;">
      <div>
        <p style="margin:0 0 2px;font-size:11px;font-weight:700;color:#5B1A7C;text-transform:uppercase;letter-spacing:0.08em;">Recommended Engagement</p>
        <p style="margin:0;font-size:16px;font-weight:600;color:#5B1A7C;">${a?.recommendedTier ?? "Discovery"}</p>
      </div>
    </div>

    ${transcript ? `
    <!-- Transcript -->
    <details style="margin-top:24px;">
      <summary style="cursor:pointer;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#9a9990;">📄 Full Transcript (expand)</summary>
      <pre style="margin-top:12px;font-size:12px;color:#57574f;background:#f9f9f9;border-radius:6px;padding:14px;white-space:pre-wrap;overflow-x:auto;">${transcript.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</pre>
    </details>
    ` : ""}

  </div>

  <!-- Footer -->
  <div style="border-top:1px solid #e4e3dc;padding:16px 32px;background:#f9f9f9;">
    <p style="margin:0;font-size:11px;color:#9a9990;">Perea.AI · Automated Lead Intelligence · <a href="https://www.perea.ai" style="color:#5B1A7C;">www.perea.ai</a></p>
  </div>

</div>
</body>
</html>`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Perea.AI Leads <leads@perea.ai>",
      to:   [toEmail],
      subject: `🧠 Pre-Call Brief: ${name} — ${icpBadge(a?.icpLabel ?? "COLD")} (${score})`,
      html,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    console.error("[send-brief] Resend error:", res.status, err);
  } else {
    console.log("[send-brief] Email brief sent for:", name, "→", toEmail);
  }
}

// ─── Main entry point ─────────────────────────────────────────────────────────
export async function sendPreCallBrief(payload: BriefPayload): Promise<void> {
  // Fire both in parallel — don't let one block the other
  await Promise.allSettled([
    sendTelegramBrief(payload),
    sendEmailBrief(payload),
  ]);
}

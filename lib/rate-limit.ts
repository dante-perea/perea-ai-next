/**
 * In-memory rate limiter for web call tokens.
 *
 * Works across requests within the same serverless function instance.
 * Vercel warm instances persist state between requests, but cold starts reset it.
 * For production hardening, swap the Map for Vercel KV (Redis).
 *
 * Current limits:
 *   - Max 2 calls per IP per hour
 *   - Min 3 minutes between calls from the same IP
 *   - Max 1 call per email per 24 hours
 *   - Blocks known headless / bot user-agents
 */

interface RateLimitEntry {
  calls: number;
  firstCallAt: number;
  lastCallAt: number;
}

// In-memory stores (resets on cold start — acceptable for basic protection)
const ipStore    = new Map<string, RateLimitEntry>();
const emailStore = new Map<string, number>(); // email → last call timestamp

// ── Config ────────────────────────────────────────────────────────────────────
const IP_WINDOW_MS          = 60 * 60 * 1000;  // 1 hour
const IP_MAX_CALLS          = 2;                // max 2 calls per IP per hour
const IP_MIN_GAP_MS         = 3 * 60 * 1000;   // min 3 min between calls from same IP
const EMAIL_WINDOW_MS       = 24 * 60 * 60 * 1000; // 24 hours per email
const CLEANUP_INTERVAL_MS   = 10 * 60 * 1000;  // prune stale entries every 10 min

// Periodic cleanup to prevent memory leak on long-lived instances
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of ipStore.entries()) {
    if (now - entry.firstCallAt > IP_WINDOW_MS) ipStore.delete(ip);
  }
  for (const [email, ts] of emailStore.entries()) {
    if (now - ts > EMAIL_WINDOW_MS) emailStore.delete(email);
  }
}, CLEANUP_INTERVAL_MS);

// ── Bot UA patterns ────────────────────────────────────────────────────────
const BOT_UA_PATTERNS = [
  /headless/i, /phantomjs/i, /selenium/i, /puppeteer/i, /playwright/i,
  /cypress/i,  /webdriver/i, /bot/i, /crawl/i, /spider/i,
];

export interface RateLimitResult {
  allowed: boolean;
  reason?: string;
  retryAfterMs?: number;
}

export function checkRateLimit(
  ip: string,
  email: string,
  userAgent: string,
): RateLimitResult {
  const now = Date.now();

  // 1. Bot UA check
  if (BOT_UA_PATTERNS.some(p => p.test(userAgent))) {
    return { allowed: false, reason: "Automated requests are not allowed." };
  }

  // 2. IP-based checks
  const ipEntry = ipStore.get(ip);
  if (ipEntry) {
    const windowAge = now - ipEntry.firstCallAt;

    // Reset window if expired
    if (windowAge > IP_WINDOW_MS) {
      ipStore.delete(ip);
    } else {
      // Too many calls in window
      if (ipEntry.calls >= IP_MAX_CALLS) {
        const retryAfterMs = IP_WINDOW_MS - windowAge;
        return {
          allowed: false,
          reason: `Too many calls. Please try again in ${Math.ceil(retryAfterMs / 60000)} minutes.`,
          retryAfterMs,
        };
      }

      // Too soon since last call
      const gapMs = now - ipEntry.lastCallAt;
      if (gapMs < IP_MIN_GAP_MS) {
        const retryAfterMs = IP_MIN_GAP_MS - gapMs;
        return {
          allowed: false,
          reason: `Please wait ${Math.ceil(retryAfterMs / 1000)} seconds before starting another call.`,
          retryAfterMs,
        };
      }
    }
  }

  // 3. Email-based check (1 per 24 h)
  const emailLastCall = emailStore.get(email.toLowerCase());
  if (emailLastCall) {
    const emailAge = now - emailLastCall;
    if (emailAge < EMAIL_WINDOW_MS) {
      const retryAfterMs = EMAIL_WINDOW_MS - emailAge;
      const hoursLeft = Math.ceil(retryAfterMs / 3600000);
      return {
        allowed: false,
        reason: `You've already had a call today. Book a slot directly below, or try again in ${hoursLeft} hour${hoursLeft === 1 ? "" : "s"}.`,
        retryAfterMs,
      };
    }
  }

  // ── Record the call ──────────────────────────────────────────────────────
  const existing = ipStore.get(ip);
  if (existing && Date.now() - existing.firstCallAt <= IP_WINDOW_MS) {
    existing.calls++;
    existing.lastCallAt = now;
  } else {
    ipStore.set(ip, { calls: 1, firstCallAt: now, lastCallAt: now });
  }
  emailStore.set(email.toLowerCase(), now);

  return { allowed: true };
}
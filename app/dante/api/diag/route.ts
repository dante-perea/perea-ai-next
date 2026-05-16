import { NextResponse } from "next/server";
import { promises as dns } from "dns";
import net from "net";
import postgres from "postgres";

// GATED by the same Basic Auth that protects the rest of /dante (middleware
// catches /dante/* paths). One-shot debug endpoint to diagnose why the gbrain
// connection fails from Vercel Node serverless. Returns structured JSON so a
// single curl gives us the failure mode without poking through Vercel logs.
//
// Remove this file once the gbrain connection issue is resolved.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface AttemptResult {
  label: string;
  url_redacted: string;
  duration_ms: number;
  success: boolean;
  rows?: number;
  error?: string;
  error_code?: string | number;
  hostname?: string;
}

function redactUrl(url: string): string {
  return url.replace(/:[^:@/]+@/, ":***@");
}

async function tryConnect(url: string, label: string): Promise<AttemptResult> {
  const t0 = Date.now();
  let db: ReturnType<typeof postgres> | null = null;
  try {
    db = postgres(url, {
      ssl: "require",
      max: 1,
      connect_timeout: 8,
      prepare: false,
    });
    const rows = await db<{ ok: number }[]>`SELECT 1 AS ok`;
    return {
      label,
      url_redacted: redactUrl(url),
      duration_ms: Date.now() - t0,
      success: true,
      rows: rows.length,
    };
  } catch (err: unknown) {
    const e = err as { message?: string; code?: string | number; address?: string };
    return {
      label,
      url_redacted: redactUrl(url),
      duration_ms: Date.now() - t0,
      success: false,
      error: e?.message ?? String(err),
      error_code: e?.code,
    };
  } finally {
    if (db) {
      try { await db.end({ timeout: 1 }); } catch { /* ignore */ }
    }
  }
}

async function resolveHost(host: string): Promise<{ a: string[]; aaaa: string[]; error?: string }> {
  const result: { a: string[]; aaaa: string[]; error?: string } = { a: [], aaaa: [] };
  try {
    result.a = await dns.resolve4(host).catch(() => []);
    result.aaaa = await dns.resolve6(host).catch(() => []);
  } catch (e) {
    result.error = (e as Error).message;
  }
  return result;
}

async function probeTcp(host: string, port: number, family: 4 | 6, timeoutMs = 4000): Promise<{ ok: boolean; ms: number; error?: string }> {
  const t0 = Date.now();
  return new Promise((resolve) => {
    const sock = new net.Socket();
    let done = false;
    const finish = (ok: boolean, error?: string) => {
      if (done) return;
      done = true;
      try { sock.destroy(); } catch { /* ignore */ }
      resolve({ ok, ms: Date.now() - t0, error });
    };
    sock.setTimeout(timeoutMs);
    sock.on("connect", () => finish(true));
    sock.on("timeout", () => finish(false, "timeout"));
    sock.on("error", (e) => finish(false, (e as Error).message));
    try {
      sock.connect({ host, port, family });
    } catch (e) {
      finish(false, (e as Error).message);
    }
  });
}

export async function GET() {
  const envUrl = process.env.GBRAIN_DATABASE_URL ?? "";
  const directHost = "db.oggrvlkupnljwyfvbnft.supabase.co";

  // 1. DNS resolution
  const dnsResult = await resolveHost(directHost);

  // 2. TCP reachability per family
  const tcp4 = dnsResult.a.length > 0
    ? await probeTcp(directHost, 5432, 4)
    : { ok: false, ms: 0, error: "no A record" };
  const tcp6 = dnsResult.aaaa.length > 0
    ? await probeTcp(directHost, 5432, 6)
    : { ok: false, ms: 0, error: "no AAAA record" };

  // 3. Postgres connection attempts
  const attempts: AttemptResult[] = [];
  if (envUrl) {
    attempts.push(await tryConnect(envUrl, "env GBRAIN_DATABASE_URL"));
  }

  return NextResponse.json({
    runtime: "nodejs",
    region: process.env.VERCEL_REGION ?? "unknown",
    env_has_url: Boolean(envUrl),
    env_url_host_redacted: envUrl ? redactUrl(envUrl).replace(/.*@([^/?]+).*/, "$1") : null,
    dns: {
      host: directHost,
      a_records: dnsResult.a,
      aaaa_records: dnsResult.aaaa,
      error: dnsResult.error,
    },
    tcp: {
      ipv4: tcp4,
      ipv6: tcp6,
    },
    postgres_attempts: attempts,
    node_version: process.version,
  });
}

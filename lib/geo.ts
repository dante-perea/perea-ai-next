/**
 * Geo utilities — reads Vercel's edge-injected geo headers server-side.
 */

export interface GeoData {
  country: string;
  city: string;
  region: string;
}

function decodeSafe(val: string | null): string {
  if (!val) return "";
  try {
    return decodeURIComponent(val);
  } catch {
    return val;
  }
}

export function getGeoFromHeaders(
  headerMap: Map<string, string>
): GeoData {
  return {
    country: headerMap.get("x-vercel-ip-country") ?? "",
    city:    decodeSafe(headerMap.get("x-vercel-ip-city") ?? ""),
    region:  headerMap.get("x-vercel-ip-country-region") ?? "",
  };
}

const LATAM_COUNTRIES = new Set([
  "MX","CO","AR","CL","PE","VE","EC","BO","PY","UY","CR","PA","DO","SV","GT","HN","NI","CU"
]);

const EU_COUNTRIES = new Set([
  "DE","FR","ES","IT","NL","BE","PL","PT","SE","NO","DK","FI","AT","CH","IE","GR","CZ","HU","RO","BG"
]);

export type GeoRegion = "us" | "uk" | "eu" | "latam" | "apac" | "other";

export function getRegion(country: string): GeoRegion {
  if (country === "US") return "us";
  if (country === "GB") return "uk";
  if (EU_COUNTRIES.has(country)) return "eu";
  if (LATAM_COUNTRIES.has(country)) return "latam";
  if (["JP","KR","SG","AU","NZ","IN","TH","ID","MY","PH"].includes(country)) return "apac";
  return "other";
}

export function getLocalCTA(region: GeoRegion): string {
  switch (region) {
    case "us":    return "Schedule a strategy call →";
    case "uk":    return "Book a discovery call →";
    case "eu":    return "Book a free consultation →";
    case "latam": return "Agenda una llamada gratuita →";
    default:      return "Book a free discovery call →";
  }
}

export function getLocalTrustLine(region: GeoRegion): string {
  switch (region) {
    case "eu":    return "GDPR-compliant engagements · EU-based delivery available";
    case "latam": return "Consultores en tu zona horaria · Entregamos en español o inglés";
    default:      return "50+ businesses transformed · No long-term lock-in";
  }
}

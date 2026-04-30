# Perea.AI — Next.js 15

Production landing page system built with Next.js 15 App Router.

## Features

- **`/`** — Homepage (SSR, geo-aware CTA)
- **`/lp/[slug]`** — Dynamic landing pages (SSR, per-LP SEO, A/B tested)
  - `/lp/consultancy` — Main consultancy LP
  - `/lp/sales` — Sales AI LP
  - `/lp/support` — Support AI LP

## Architecture

| Concern | Implementation |
|---|---|
| Routing | Next.js 15 App Router |
| SSR + SEO | `generateMetadata()` per slug |
| Geo targeting | `x-vercel-ip-country` header → localised CTA |
| A/B testing | Edge Middleware → sticky cookie per slug |
| Main site CSS | Tailwind CSS v4 |
| LP CSS | CSS Modules + design tokens (axelered-inspired) |
| Deployment | Vercel (GitHub auto-deploy) |

## Adding a new LP

Edit `lib/lp-registry.ts` and add an entry:

```ts
my-new-lp: {
  slug: "my-new-lp",
  title: "...",
  description: "...",
  sections: ["hero","logos","capabilities","tiers","cta"],
  default: { hero: { ... }, cta: { ... }, ctaBand: { ... } },
  variantB: { ... }, // optional A/B variant
}
```

No new files needed. The route `/lp/my-new-lp` is live immediately after deploy.

## A/B Testing

Middleware assigns a sticky `perea_ab_{slug}` cookie (50/50 split) on first visit.
Variants are resolved server-side — zero client-side flicker.

To add analytics: replace the stub in `lib/ab.ts → trackImpression()` with your PostHog/Segment server SDK call.

## Development

```bash
npm install
npm run dev
```

## Deploy

Push to `main` → Vercel auto-deploys.

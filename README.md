# VANE Science — Website

Marketing site for **VANE Science** and the **MQS** (Movement Quality Score) — a
standardized assessment layer for human movement quality. Bilingual (EN/DE),
content-driven, with an integrated Sanity CMS.

## Start here: partner handoff

This repository contains the complete website source, tests, fonts, images,
videos and technical handoff documents. It is a clean snapshot of the current
working project, without the previous repository history, credentials,
`node_modules` or generated build output.

Use **Node.js >=22.12.0 <23** and **npm 11.9.0**. From the repository root:

```bash
npm ci
```

Copy `.env.example` to `.env.local`, then configure the intended Sanity project
and dataset. Keep write tokens and delivery secrets server-only. Do not commit
environment files or use placeholder credentials for production.

```bash
npm run dev
# Release checks:
npm run check
npm test
npm run build
npm run launch:check
```

Read [the latest acceptance report](docs/RELEASE-ACCEPTANCE-2026-09-28.md)
and [the technical handoff](docs/TECHNICAL-HANDOFF.md) before deployment.
The current source passed 313 tests and a production build under Node 22.23.2.
Live Sanity storage, email delivery, hosting, legal approval and real-device
acceptance are **not** certified by those local checks. `launch:check` is
expected to block until the required real configuration is supplied.

All existing media, including source videos and optimized web derivatives, is
included. No Git LFS setup is required for this snapshot. Source media can be
archived later only after verifying all active references and agreeing ownership.

## Stack

- **Next.js 16** (App Router) · **React 19**
- **Tailwind CSS v4**
- **Sanity** (embedded Studio at `/studio`, `next-sanity`)
- **Framer Motion** for animation, **Radix UI** primitives, **lucide-react** icons

## Scripts

```bash
npm run dev        # local dev server (http://localhost:3000)
npm run build      # production build
npm run start      # serve the production build
npm run check      # lint + typecheck (run before committing)
```

## Content

- **CMS content** is edited in the embedded Studio at **`/studio`** (Sanity).
  Pages fall back to built-in copy when Sanity is empty or unreachable.
- **Founder identity** (name, LinkedIn, CTO placeholder, team-page fallback) is
  consolidated in **`lib/founders.ts`** — edit there to announce the CTO or
  update a founder; the homepage, investors page and team fallback all read
  from it.

## Environment

Copy `.env.example` and fill in the Sanity project ID, dataset, and the
server-only `SANITY_API_WRITE_TOKEN` (needed for waitlist signups). Google
Analytics (`NEXT_PUBLIC_GA_MEASUREMENT_ID`) is optional and loads only after
cookie consent. Start with the [technical handoff](docs/TECHNICAL-HANDOFF.md),
use the [current contact and launch contract](docs/MQS-VAULT-LAUNCH-AND-CONTACT.md)
and [Sanity migration evidence](docs/SANITY-MIGRATION-2026-09-24.md). The
[September 11 technical review](docs/TECHNICAL-REVIEW-2026-09-11.md) is historical,
not the current dependency audit. Follow the
[launch checklist](docs/LAUNCH-CHECKLIST.md) for partner-owned go-live steps.

## Brand & copy rules

- Brand interactions use Ink or white. Cyan is reserved for MQS values and direct measurement graphics. Display font: **Bebas Neue**.
- Language ban-list (MDR-critical — never use in copy): *diagnostics*,
  *diagnose*, *clinical/clinically validated*, *patient*, and any claim that
  VANE "detects" or "predicts" disease or injury. The product is a movement
  **assessment**, not a medical device.

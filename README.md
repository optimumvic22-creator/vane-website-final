# VANE Science — Website

Marketing site for **VANE Science** and the **MQS** (Movement Quality Score) — a
standardized assessment layer for human movement quality. Bilingual (EN/DE),
with built-in content and direct Brevo waitlist integration. Sanity is optional.

## Start here: partner handoff

This repository contains the complete website source, tests, fonts, images,
videos and technical handoff documents. It is a clean snapshot of the current
working project, without the previous repository history, credentials,
`node_modules` or generated build output.

Use **Node.js >=22.12.0 <23** and **npm 11.9.0**. From the repository root:

```bash
npm ci
```

Copy `.env.example` to `.env.local`. The current launch uses built-in content
and direct Brevo list integration. Configure `BREVO_API_KEY`, the four
`BREVO_LIST_*` IDs, and `BREVO_DOI_TEMPLATE_ID`. Sanity is optional: leave its
variables unset to use built-in content and disable `/studio`. Keep credentials
server-only; do not commit environment files. See [Brevo setup](docs/BREVO-LAUNCH.md).

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
The October 2, 2026 handoff refresh passed lint, TypeScript, 314 tests and a
production build locally.
Live provider storage, email delivery, hosting, legal approval and real-device
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

- **Launch content** is edited directly in the source. The optional Sanity
  Studio at **`/studio`** is disabled until a CMS project is configured.
- **Founder identity** (name, LinkedIn, CTO placeholder, team-page fallback) is
  consolidated in **`lib/founders.ts`** — edit there to announce the CTO or
  update a founder; the homepage, investors page and team fallback all read
  from it.

## Environment

Copy `.env.example` and configure the server-only Brevo key, four list IDs
and confirmation template ID described above. Google
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

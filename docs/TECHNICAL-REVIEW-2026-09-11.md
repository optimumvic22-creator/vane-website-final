# VANE technical review and handoff readiness

Review date: 2026-09-11. Repository: `dario7s/VANE-Science-Website`.
Local branch: `codex/technical-stabilization`.

## Decision

The current structure can be retained. The App Router, shared audience renderer,
typed content, server-side form guards and pure MQS calculation functions are a
sound base for handoff. A broad rewrite would add regression risk without a
demonstrated benefit. The changes in this pass address observed failures and
release reliability.

This is a handoff candidate, not a production approval. The remaining Sanity
dependency findings and externally configured services below are explicit gates.
No push, merge, deployment, live lead submission or data migration was performed.
Pre-existing website changes were preserved.

## Implemented and verified in source

| Area | Change | Why it matters |
| --- | --- | --- |
| Video transfer | 14 active MOV references now use H.264 MP4 derivatives, at most 1280 pixels per axis, 30 fps, without audio, with fast-start metadata | Source total falls from 183,399,469 to 16,239,355 bytes, a 91% reduction |
| Video lifecycle | Shared viewport, document visibility, reduced motion and data-saver eligibility for entry, MQS, playlist and ambient video | Hidden/offscreen decorative videos release their source and stop playback |
| Initial MQS clip | A random domain is selected before source attachment | Avoids loading POWER immediately before replacing it with a random clip |
| Media failures | Source-specific errors and bounded playlist skipping | Failed media does not create an endless request loop |
| Entry interaction | Pending hover/focus starts once eligibility is known; resources are cleared on unmount | Prevents a first-hover race and background transfers after navigation |
| Image sizing | Athlete and Coach benefits `sizes` now reflect their responsive containers | Avoids choosing the wrong image derivative for tablet widths |
| Inquiry form | 16px inputs, audience-appropriate autocomplete, busy state and focused success status | More predictable mobile input and keyboard/screen-reader feedback |
| Inquiry timeout | A 15-second abort, cleanup and explicit uncertain-receipt message | A stalled request no longer leaves the interface indefinitely submitting |
| Language and consent | Storage failures are caught; in-memory choices remain usable | Restricted storage cannot break language switching or block analytics withdrawal |
| Lead privacy | New records use dotted `vane.inquiry.*` and `vane.waitlist.*` IDs | Sanity denies anonymous access to dotted IDs even in a public dataset |
| Waitlist concurrency | Normalized-email digest plus atomic `createIfNotExists`; authenticated legacy lookup retained | Concurrent submissions cannot create multiple new records for one normalized email |
| Dependencies | Next.js 16.3.4 and compatible lockfile fixes; AVIF output disabled | Addresses current critical framework/package findings without a forced Sanity major migration |
| Release checks | Nine exact sitemap URLs, nine H1/header checks, invalid-audience 404 and safe API checks | Smoke tests now test actual route coverage rather than substring matches |
| CI | Production smoke against a built server plus a separate high/critical dependency gate | A successful compile alone cannot approve a release |

The media conversion is reproducible through `scripts/optimize-media.mjs` with
FFmpeg and FFprobe. It preserves duration within 0.15 seconds and checks codec,
pixel format and audio absence. Original recordings remain untouched. Generated
files are validated before an interrupted output can be reused.

Sanity's [document visibility rules](https://www.sanity.io/docs/content-lake/keeping-your-data-safe)
support the dotted-ID choice. This protects new writes; it does not migrate or
prove the privacy of existing root-ID records. No real lead data was queried.

The framework update follows the [August security release](https://nextjs.org/blog/august-2026-security-release).
The installed, locked version is 16.3.4. Major Sanity upgrades were not forced.

## Verification record

| Gate | Result |
| --- | --- |
| Runtime | Verified portable Node 22.23.2; the user's default Node remains 24.14.0 |
| TypeScript | Passed after regenerating obsolete Next route types |
| ESLint | Full source and scoped checks passed |
| Tests | Full Vitest run passed: 78 tests across 9 files, including 11 media tests |
| Production build | Passed on Node 22 with Next.js 16.3.4; this build predates the final narrow-text wrapping adjustments |
| Production smoke | Passed against that build: 11 routes, 9 H1/header/canonical-sitemap checks, unknown-audience 404, and 6 non-writing API checks |
| Browser viewports | Production Chromium coverage: EN Athlete 320 px, DE Athlete 390 px, DE Coach 320 px, EN Coach 1440 px, EN Partner 1440 px, and DE Partner 320 px. No page-level horizontal overflow observed |
| Browser interactions | Menus and language switching verified; MQS POWER adjustment to 99 and corresponding video mapping verified; randomized initial MQS video confirmed live |
| Narrow-text follow-up | Verified in the current development preview at 320 px: German Coach heading fits with a controlled soft hyphen and a clean accessible name; all three homepage role descriptions and the intro subtext wrap without clipping. Focused ESLint and diff checks passed. No post-adjustment production build or smoke pass is claimed |
| Media | All 14 outputs passed codec, audio and duration validation; no active MOV references remain in the three source maps |
| Dependency consistency | Package manifest and lockfile are consistent |
| Tracked environment files | Only `.env.example` is tracked |
| Diff whitespace | Passed |
| Dependency audit | 0 critical, 4 high, 5 moderate, 0 low; 9 total after compatible remediation |

The initial audit had 35 findings: 2 critical, 19 high, 13 moderate and 1 low.
These are dependency-graph counts, not 35 independently exploitable website
endpoints. The remaining high chain is Sanity tooling through `adm-zip`; the
moderate chain includes `uuid` through Sanity preview packages. The security CI
job intentionally stays failing until these are remedied or a narrowly documented
exception is approved by the deployment owner.

## Remaining release gates and ownership

1. **Sanity dependency migration.** Resolve the remaining 4 high and 5 moderate
   findings on a dedicated compatibility-tested upgrade. The registry proposes
   breaking Sanity/next-sanity upgrades. Validate Studio, queries, images and form
   writes after that migration. Do not suppress the audit to make CI green.
2. **Existing lead privacy.** The partner must inspect dataset visibility and
   existing root-ID lead records, migrate them if present, and verify anonymous
   read denial in Preview. Existing records were deliberately not modified.
3. **Working forms.** Configure the missing server-only write token with the
   intended Preview dataset and minimum permissions. Verify receipt in Sanity.
   Current missing-token 503 behavior is intentional safe failure.
4. **Abuse protection.** Connect the existing distributed rate-limit hook or an
   equivalent verified hosting rule. Provider-specific identity headers and
   limits cannot be safely invented before the hosting platform is selected.
5. **Lead operations.** Assign an owner and connect/test notifications or CRM
   delivery. A record stored in Sanity does not currently send an email.
6. **Production configuration.** Final domain, Sanity CORS/roles, legal company
   details, monitoring and rollback ownership remain partner configuration.
7. **Real devices and metrics.** Chromium viewport checks are not Safari/iOS or
   Android device tests. Measure LCP, INP and CLS on the deployed preview and
   subsequently in field traffic. No Core Web Vitals score is claimed here.
8. **GitHub authentication.** `gh auth status` reports no logged-in host. The
   working tree has not been committed or pushed by this review.

## Architecture decisions for the receiving developer

The current development preview is available on port 3001. The production smoke
used port 3000. The final responsive adjustments are limited to line wrapping and
one soft hyphen; rebuild the reviewed commit in CI before deployment.

- Keep one shared audience renderer and typed role content. Avoid three divergent
  page implementations for the same structure.
- Keep MQS calculations independent of rendering. Existing model behavior was
  not altered in this pass and remains covered by the existing calculation tests.
- Use the shared media eligibility hook when adding decorative video. Source
  selection and domain relationships belong to the calling component.
- The large `AudienceEntry` component is a maintenance candidate. Extract its
  static constellation data/styles only as a separately measured change; do not
  combine that refactor with release remediation.
- German is currently selected in the client over English server HTML. Separately
  indexable German routes and `hreflang` need an explicit multilingual SEO change.
- Keep existing privacy/consent gates for analytics. Do not introduce a second
  tracking script outside them. Record only the minimal approved event fields.
- Do not store raw recordings in the deployment pipeline indefinitely. The new
  web derivatives are the active sources; archive originals outside the web repo
  after the owner confirms a durable source-media backup.
- Stable media URLs retain conservative caching. Future immutable caching needs
  versioned or hashed asset names and verified byte-range support in hosting.

## Review coverage

Files changed in this pass, apart from generated media:

- Media: `lib/use-media-playback.ts`, its test, `components/layout/AudienceEntry.tsx`,
  `components/ui/mqs-dashboard.tsx`, `components/ui/ambient-video.tsx`,
  `components/ui/audience-video-playlist.tsx`, `scripts/optimize-media.mjs`,
  `app/for/[audience]/audience-landing.tsx`, `lib/audience-content.ts`.
- Forms and preferences: `components/ui/audience-inquiry-form.tsx`,
  `lib/inquiry-request.ts`, its test, `lib/locale.tsx`, `lib/analytics.ts`,
  `lib/analytics.test.ts`, both inquiry and waitlist API routes and their tests.
- Release: `package.json`, `package-lock.json`, `next.config.ts`,
  `scripts/smoke.mjs`, `.github/workflows/ci.yml`, `README.md`,
  `docs/TECHNICAL-HANDOFF.md`, and this review.
- Next.js generated local `AGENTS.md` and `CLAUDE.md` framework guidance during
  development startup. These contain no project secrets or deployment settings.

Browser checks also confirmed that videos outside the viewport are paused with
their source detached. The production preview reported no browser console errors
in the checked navigation sequence. Native iOS and Android are still unverified.

Media, responsive layout, touch/hover semantics, MQS interaction, forms, loading
and failure states, accessibility, color/contrast, navigation, conversion
continuity, product-claim boundaries, DE/EN behavior, SEO, consent/analytics,
security, bundle boundaries, test automation and deployment operations were
reviewed through their relevant code and the validation record above. No copy or
page-structure redesign was performed. Scientific/medical claims, legal approval,
real-user conversion tests and provider configuration are not certified by a
technical source review.

## Handoff sequence

1. Review this working-tree diff including the existing user changes and the new
   web media. Use `docs/TECHNICAL-HANDOFF.md` for exact setup and environment names.
2. Authenticate GitHub, create a reviewed commit on `codex/technical-stabilization`
   and push that branch. Open a pull request against the intended base branch.
3. Resolve the dependency gate and obtain green CI including production smoke.
4. Deploy a private Preview with separate data and credentials; verify the
   partner-owned gates above and both languages on real target devices.
5. Merge and promote only the approved commit. Keep the previous deployment and
   content backup available for rollback.

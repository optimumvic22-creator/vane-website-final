# VANE Science Website — Technical Handoff

Updated: 2026-09-28. The latest [release acceptance](RELEASE-ACCEPTANCE-2026-09-28.md)
records the current checkout passing full lint, TypeScript, 313 tests, build and
production smoke under Node 22.23.2. It also records the responsive browser and
form failure checks, missing external configuration, unavailable real-device
acceptance, and unsuccessful public HTTPS checks. No deployment or live delivery
has been verified. A clean release checkout and remote CI remain outstanding.
The earlier [agency implementation and verification](AGENCY-IMPLEMENTATION-2026-09-24.md)
records 252 passing tests, the current production build and smoke results,
language-aware server rendering, motion controls, responsive refinements,
public MQS naming and the versioned consent update. Use that document for
the September 24 implementation status; the later acceptance above supersedes its test counts.
The earlier [prelaunch review and release gates](PRELAUNCH-REVIEW-2026-09-24.md)
record the fixes at that stage, 161 passing tests, responsive checks and explicit NO GO
conditions. `npm run launch:check` performs the new offline configuration gate;
it does not replace live acceptance or grant automatic release approval.
Use [Sanity dependency migration — 2026-09-24](SANITY-MIGRATION-2026-09-24.md)
for current versions, security overrides, audit results, and compatibility
evidence. The current audience, consent, and delivery model is documented in
[MQS Vault launch and contact paths](MQS-VAULT-LAUNCH-AND-CONTACT.md).
The [technical review — 2026-09-11](TECHNICAL-REVIEW-2026-09-11.md) preserves
the earlier stabilization and media evidence; its dependency baseline is
historical, not the status of the September 24 lockfile.

## 1. Purpose and current status

This document is the operational handoff for the VANE Science website.
It distinguishes between:

- **Implemented in the repository:** behavior that exists in source code.
- **Partner action:** configuration, credentials, external services, legal
  approval, or operational work that is not present in the repository.

No production deployment, hosting account connection, production credentials,
rate-limit provider, monitoring provider, notification service, or CRM
integration is implied by this document.

The September 11 stabilization pass added lead-storage hardening, safer media
playback, web-video derivatives, form recovery, storage-failure handling, and
stronger CI gates. The September 24 pass completes dependency remediation and
adds audience-specific contact paths and a durable provider-neutral delivery
worker. A worker implementation is not a connected delivery service.

Recorded local verification on September 24:

- Production build passed on Node.js 22.23.2 with Next.js 16.3.4.
- All 161 tests across 14 files, ESLint, and TypeScript passed in the final prelaunch review.
- Production smoke passed: 11 routes, nine single-H1 HTML pages, security
  headers, canonical sitemap checks, unknown-audience 404, six non-writing API
  checks, and denial of unauthenticated delivery-worker requests.
- Production-only and full dependency audits both reported zero findings.

These checks do not establish real Sanity credentials or permissions,
anonymous lead-privacy verification, authenticated Studio acceptance, provider
delivery, or scheduler operation. None of those live gates has been completed.
Git-hosting authentication and an actual remote CI run also remain outstanding;
a successful push or approved release commit must not be inferred.

## 2. Runtime and clean setup

### Implemented in the repository

- The lockfile resolves Next.js 16.3.4 with the App Router; React and ReactDOM
  are both pinned to 19.2.8. The declared Next.js and `eslint-config-next`
  ranges remain `^16.3.3`; use the lockfile for the installed versions.
- Sanity and `@sanity/vision` resolve to 6.16.0; `next-sanity` resolves to 13.3.4.
- Node.js `>=22.12.0 <23` is required by `package.json` for the Sanity 6 graph.
- npm `11.9.0` is declared through the `packageManager` field.
- `.nvmrc` selects Node 22.
- `package-lock.json` is the dependency source of truth.
- CI runs on Node 22 and defines install, checks, tests, build, production
  smoke, and a separate dependency-security gate.

Local final verification used portable Node.js 22.23.2 and npm 11.9.0. This does
not establish the runtime of historical checks or replace a fresh-clone
installation and remote CI verification.

The development command uses Webpack. The production build uses the Next.js 16
production build path, currently Turbopack. A successful development preview is
therefore not a replacement for the production build gate.

### Dependency security status

The **pre-remediation production audit baseline on 2026-09-11** contained
35 findings: two critical, 19 high, 13 moderate, and one low. These are baseline
counts, not a claim about the final lockfile.

The September 24 pass started with nine remaining production findings (four
high and five moderate). After reviewed Sanity/next-sanity upgrades and scoped
transitive overrides, both `npm audit --omit=dev --audit-level=high` and the
complete `npm audit` returned exit 0 with zero findings in every severity
category. See the [migration evidence](SANITY-MIGRATION-2026-09-24.md) for exact
versions, override rationale, importer tests, and successful schema validation.
This is a dated audit result, not a guarantee against future advisories.

Before Production, recheck the release lockfile on a supported Node 22 runtime:

```bash
npm audit --omit=dev --audit-level=high
npm outdated
```

If further upgrades are needed, review them on a dedicated branch against
their migration guides, then rerun all release gates and Studio, form, image,
and media smoke tests. Do not remove the scoped overrides until their parent
packages resolve safe versions and the compatibility/audit checks still pass.
Do not use `npm audit fix --force` on the release branch.
The separate CI security job intentionally fails while high or critical
production dependency findings remain unresolved.

### Partner action

Use a fresh clone outside a cloud-synchronized directory for release checks.
Confirm the runtime before installing:

```bash
node --version
npm --version
```

Expected runtime versions:

```text
Node.js >=22.12.0 <23 (locally verified: 22.23.2)
npm 11.9.0
```

Install only from the lockfile:

```bash
npm ci
```

Do not use `npm install` for a release checkout. If exact npm parity is required
in CI, explicitly verify or install npm 11.9.0 in the runner; `setup-node`
currently pins Node 22 but does not separately pin the bundled npm executable.

## 3. Local development and release gates

Create `.env.local` from `.env.example` and use non-production values for local
work.

```bash
npm run dev
```

Required release commands:

```bash
npm ci
npm run check
npm test
npm run build
npm audit --omit=dev --audit-level=high
```

`npm run check` runs ESLint and TypeScript. All commands must succeed from a
clean checkout, followed by production smoke and Preview acceptance, before a
release candidate is approved. Do not infer their status from this guide.

For an optional local production smoke test after a successful build:

```bash
npm run start
```

In a second terminal, run the same deployment smoke test used for Preview:

```bash
npm run smoke -- http://127.0.0.1:3000
```

The script checks 11 routes, including all nine public HTML pages. It requires
exactly one H1 and the configured security headers on each HTML page, checks
all nine exact canonical sitemap URLs, and requires an unknown audience route
to return 404. Both APIs are checked for invalid media type, malformed JSON,
and invalid schema responses, including their non-cacheable error contracts.
These six default API checks do not submit valid leads.

`SMOKE_CHECK_HONEYPOT=1` adds two honeypot checks and is rejected for non-loopback
hosts. Use it only with an isolated local/CI server that has placeholder Sanity
identifiers and no write token, as configured in CI. Do not enable it against a
server connected to real lead storage: a regression in the honeypot guard must
not create a real record during verification.

### CI behavior

The GitHub Actions workflow runs for pull requests and pushes to `main`. It has
read-only repository permissions and cancels superseded runs. The check job
has a 15-minute timeout. After building, it starts the production server with
placeholder Sanity identifiers and an empty write token, waits for readiness
for at most 30 bounded attempts, runs smoke with the two additional honeypot
checks, and cleans up the server on exit. This smoke step has a three-minute
timeout.

A separate ten-minute security job installs the lockfile dependencies without
running package lifecycle scripts, then runs
`npm audit --omit=dev --audit-level=high`. An unresolved high/critical finding
fails that job independently of the build and test job.

CI supplies placeholder Sanity identifiers during the build. This verifies that
the site can build with its local fallback content; it does **not** verify the
real Sanity project, dataset, content, CORS policy, or write token. Workflow
configuration is not evidence that GitHub has executed a successful run.

## 4. Environment variables

Never commit `.env.local` or any token. `NEXT_PUBLIC_*` variables are included
in client bundles and must never contain secrets.

| Variable | Scope | Requirement | Purpose |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Build and runtime | Required | Public Sanity project identifier. |
| `NEXT_PUBLIC_SANITY_DATASET` | Build and runtime | Required | Dataset used by the website and embedded Studio. Use separate Preview and Production datasets. |
| `NEXT_PUBLIC_SANITY_API_VERSION` | Build and runtime | Recommended | Pins the Sanity API date. Source code falls back to `2024-01-01` if omitted. |
| `SANITY_API_WRITE_TOKEN` | Server runtime only | Required for working forms | Used by `/api/waitlist` and `/api/inquiry`. Without it, the endpoints return HTTP 503. Grant only the document permissions they require. |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Client runtime | Optional | Enables GA4 only after analytics consent. No analytics script is loaded when unset. |
| `SANITY_SEED_TOKEN` | Local seed run only | Required only for seeding | Write token for the destructive homepage seed. Do not configure it in the hosting platform. |
| `SANITY_SEED_CONFIRM` | Local seed run only | Required only for seeding | Must exactly equal `<project-id>/<dataset>` for the intended target. Do not configure it in the hosting platform. |

### Partner action

Configure Preview and Production independently in the chosen hosting platform.
Use different Sanity datasets and least-privilege write tokens so preview form
submissions cannot enter the production lead dataset.

Confirm that all server-only variables are unavailable to browser bundles and
deployment logs.

## 5. Active routes

### Public pages

| Route | Purpose |
| --- | --- |
| `/` | Main VANE entry page. |
| `/for/athlete` | Athlete audience page. |
| `/for/coach` | Coach, physio, and performance-team page. |
| `/for/partner` | Organization and integration-partner page. |
| `/team` | Team page. |
| `/investors` | Investor page. |
| `/impressum` | Legal disclosure. Currently contains unresolved company placeholders. |
| `/privacy` | Privacy information. |
| `/terms` | Terms of service. |
| `/studio` and `/studio/*` | Embedded Sanity Studio. The route is reachable publicly; Sanity authentication and project roles control access. |
| `/sitemap.xml` | Generated sitemap. |
| `/robots.txt` | Generated robots policy. |
| `/opengraph-image` | Generated Open Graph image. |
| `/twitter-image` | Generated social image. |
| `/icon.svg` | Site icon. |

Only `athlete`, `coach`, and `partner` are valid values under `/for/*`;
unknown audience values return the not-found response.

### API endpoints

| Method and route | Current behavior |
| --- | --- |
| `POST /api/waitlist` | Validates and stores a `waitlistSignup` document with a private dotted ID. Normalized-email keys use atomic creation; authenticated legacy lookup is preserved. |
| `POST /api/inquiry` | Validates and stores an `audienceInquiry` document with a private dotted UUID-based ID. |

Both endpoints require `Content-Type: application/json`.

The audience inquiry form uses 16 px input text on mobile, recovers from failed
requests, and aborts its client wait after 15 seconds. Timeout copy explicitly
warns that the server may already have received the inquiry; it does not
silently retry or promise that nothing was saved. Failed requests preserve the
entered fields, and successful submission moves focus to the confirmation.

## 6. API request protection

### Implemented in the repository

Both form routes use the common request guard in `lib/request-guard.ts`.
It currently provides:

- browser same-origin checks using `Origin` and `Sec-Fetch-Site`;
- an 8 KiB JSON body limit, checked against both declared and actual size;
- strict `application/json` enforcement;
- UTF-8 and JSON parsing validation;
- input schemas and honeypot fields;
- generic public error messages that do not disclose token names;
- `Cache-Control: no-store` and `Pragma: no-cache` on API responses;
- an adapter interface for a distributed rate-limit provider;
- HTTP 429 plus optional `Retry-After` when a hook denies a request;
- fail-closed HTTP 503 behavior when a configured hook is unavailable.

There is intentionally no process-local counter because separate serverless
instances do not share memory.

### Not implemented

No distributed rate-limit provider is connected. The two routes currently call
`guardJsonRequest(request)` without passing a `rateLimit` hook.

### Partner action: connect a distributed rate limiter

1. Select a platform-backed or external distributed rate-limit service.
2. Implement a server-only adapter matching `PlatformRateLimitHook`.
3. Derive requester identity only from headers the chosen hosting platform
   documents as trusted. Do not trust an arbitrary client-supplied forwarding
   header.
4. Use separate limits and keys for `/api/waitlist` and `/api/inquiry`.
5. Pass the adapter into both routes:

   ```ts
   guardJsonRequest(request, { rateLimit: platformRateLimit })
   ```

6. Preserve the existing fail-closed 503 behavior when the provider cannot
   make a decision.
7. Add route-level tests for allow, deny, provider failure, and `Retry-After`.
8. Verify real distributed behavior across multiple Preview instances before
   Production.

The existing test covers the hook contract only; it is not evidence of a live
provider integration.

## 7. Sanity CMS and lead storage

### Implemented in the repository

- Sanity Studio is embedded at `/studio`.
- Registered schemas include `homepage`, `teamMember`, `waitlistSignup`, and
  `audienceInquiry`.
- Team-page CMS requests can fall back to built-in content if Sanity is
  unavailable. The home entry experience is implemented locally.
- Audience content under `/for/*` currently comes from
  `lib/audience-content.ts`, not from the homepage seed.
- Waitlist and audience inquiries are written to Sanity with the server-only
  write token.
- New inquiry IDs use `vane.inquiry.<UUID>`. New waitlist IDs use
  `vane.waitlist.<SHA-256 of normalized email>` and `createIfNotExists`, so
  simultaneous submissions cannot create multiple new records for that key.
- The waitlist still performs an authenticated lookup for existing email
  records, preserving legacy deduplication without rewriting old documents.

Sanity's default anonymous access excludes dotted document IDs, including in a
public dataset; see [Sanity data security](https://www.sanity.io/docs/content-lake/keeping-your-data-safe).
The digest is a deterministic key, not encryption or anonymization. Staff and
token access must still be restricted through Sanity permissions.

**Existing records were not queried, migrated, or deleted in this pass.** Old
root-ID lead documents can remain anonymously readable if their dataset is
public. The new-ID policy does not remediate those records or prove the current
dataset visibility. Review this before connecting production forms.

### Partner action

- Create or identify separate Preview and Production datasets.
- Configure Sanity CORS origins for the exact Preview and Production domains.
- Configure Studio roles and least-privilege access.
- Create a write token restricted as closely as Sanity permits to the required
  document operations.
- Test read access, Studio login, waitlist deduplication, and inquiry creation in
  Preview.
- Verify anonymous read denial for controlled Preview lead fixtures and verify
  authorized Studio access to the new dotted-ID records.
- Review existing root-ID lead records and dataset visibility through an
  authorized process. Back up data and agree any privacy remediation or
  migration before changing existing records; do not treat the new-ID policy
  as a completed historical-data migration.
- Define retention and deletion operations for both lead document types.
- Export or back up Production content before migrations or seed operations.

### Safe seed procedure

`scripts/seed-homepage.mjs` calls `createOrReplace` for the legacy CMS homepage.
It overwrites the target `homepage` document and does not seed current `/for/*`
content.

Run it only when an overwrite is intentional:

1. Export or back up the target dataset.
2. Confirm `NEXT_PUBLIC_SANITY_PROJECT_ID` and
   `NEXT_PUBLIC_SANITY_DATASET`.
3. Set `SANITY_SEED_TOKEN` locally.
4. Set `SANITY_SEED_CONFIRM` to the exact
   `<project-id>/<dataset>` value.
5. Run:

   ```bash
   node scripts/seed-homepage.mjs
   ```

The script refuses to run without the exact confirmation and returns a failing
exit code if the write fails. Never place seed credentials or confirmation in
the hosting environment.

## 8. Cookie consent and analytics

### Implemented in the repository

- Consent is stored under `vane-cookie-consent` in local storage.
- A legacy consent key is migrated once.
- Visitors can choose essential-only or all cookies.
- GA4 is injected only when `NEXT_PUBLIC_GA_MEASUREMENT_ID` exists and analytics
  consent is `all`.
- Tracking calls are no-ops without consent.
- Withdrawing consent disables later calls and attempts to remove first-party
  GA cookies.
- Cookie settings can be reopened from the site footer.
- Unavailable or read-only browser storage no longer prevents language
  selection or consent changes. If persistence fails, the current page retains
  the choice in memory, and analytics withdrawal still executes. Persistence
  across a reload is not guaranteed when the browser denies storage access.

The server-rendered content language is resolved from a valid explicit `lang`
query, then the saved language cookie, with English as the fallback. The root
HTML language and initial client state use that result. The language toggle
updates the URL and saved preference, so reloads retain the selection; browser
history synchronizes valid explicit language values. Separate `/de` routes are
not implemented. Do not infer translated page metadata merely from the content
language selection.

### Partner action

- Supply a real GA4 measurement ID only after legal approval.
- Verify accept, reject, returning-visitor, reopen, and withdrawal paths in both
  languages.
- Confirm GA4 retention, data-transfer, consent wording, and privacy-policy
  statements with the responsible legal owner.
- Confirm no tag manager or other analytics script is added outside the same
  consent gate.

## 9. Security headers

### Implemented in the repository

For routes outside `/studio`, `next.config.ts` configures:

- `Strict-Transport-Security`;
- `X-Content-Type-Options: nosniff`;
- `X-Frame-Options: DENY`;
- `Referrer-Policy: origin-when-cross-origin`;
- a restrictive camera, microphone, and geolocation `Permissions-Policy`;
- DNS prefetch control.

The Studio route uses `X-Frame-Options: SAMEORIGIN`. API JSON responses are
explicitly non-cacheable.

### Partner action

- Verify every header on the actual HTTPS Preview and Production responses.
- Confirm that HSTS `includeSubDomains` and `preload` are intentional before
  Production DNS changes. The configuration does not mean the domain is
  registered on the browser preload list.
- Design and test a Content Security Policy compatible with Next.js, Sanity
  Studio, Sanity images, consent-gated GA4, fonts, and media. No CSP is currently
  configured.
- Recheck Studio framing and authentication behavior after deployment.

## 10. Media and caching

### Current repository state

The September 11 media pass covers 14 active MOV sources across the audience
entry, MQS domains, and audience motion clips. `scripts/optimize-media.mjs`
creates adjacent `*-web.mp4` derivatives. Original MOV files are deliberately
retained; no source deletion or external archival is implied.

Conversion and active-source switching were completed in the September 11
stabilization pass. See the dated technical review for completed file counts, verified
formats/durations, source-reference checks, and before/after transfer totals.
The old total-public-file counts are no longer a reliable release inventory.
Keeping originals means repository size and visitor media transfer size are
different measures.

Next Image is configured to accept Sanity CDN images and prefer AVIF/WebP for
optimized image responses. This does not transcode videos in `public/`.

### Implemented in the repository

- The shared playback hook used by the entry experience, MQS dashboard, and
  audience playlists waits for viewport eligibility, a visible document, and
  compatible reduced-motion/data-saver preferences before attaching media.
- Ambient Results videos and existing audience motion panels retain their
  viewport, visibility, reduced-motion, and data-saver handling. Audience motion
  panels also provide posters.
- MQS selects its initial clip before assigning a media source, avoiding a
  temporary POWER clip request before the randomized selection.
- Failed entry/MQS sources are excluded from repeated loads. Playlists skip
  failed sources and stop retrying when every source has failed.
- The conversion script targets H.264 MP4 with 4:2:0 pixels, 30 fps, a maximum
  width/height of 1280 px, fast-start metadata, and no audio track. It checks
  codec, audio removal, and duration preservation within 0.15 seconds; HDR
  sources require a separately reviewed tone-mapping pass rather than silent
  conversion. FFmpeg and ffprobe are external prerequisites, not new npm
  dependencies.
- `/media/*` and `/audiences/*` receive a conservative one-day browser cache
  plus seven-day stale revalidation. The stable filenames are deliberately not
  marked immutable.

### Partner action

- Confirm publication rights and signed consent for every identifiable person.
- Test video codec and container support on current Safari, Chrome, Firefox,
  iOS, and Android.
- Review the 14 web derivatives and verify that active page references use
  approved MP4 outputs. Consider WebM only where useful and separately tested.
- Agree an archival location and retention policy for original MOV files before
  moving or deleting them. Originals remain in this working tree.
- Supply posters and preserve reduced-motion behavior.
- Measure mobile transfer size and loading behavior on a throttled connection.
- Decide whether media stays in Git, uses Git LFS, or moves to an approved CDN
  or object store.
- If long-lived immutable caching is enabled, use content-hashed or versioned
  filenames. Do not mark mutable stable URLs as immutable.
- Verify byte-range support and CDN cache behavior in Preview before Production.

## 11. Logging, monitoring, and lead notification

### Implemented in the repository

Public API errors use stable status codes and generic messages. The site logs a
limited CMS fallback warning. No external logging or monitoring provider is
configured.

### Partner action

Configure privacy-preserving operational telemetry for:

- deployment and build failure;
- application exceptions and unhandled promise rejections;
- `/api/waitlist` and `/api/inquiry` latency and 4xx/5xx rates;
- rate-limit 429 and provider-unavailable 503 responses;
- Sanity read/write failures;
- form success counts without storing submitted content in logs;
- uptime and critical public-route availability;
- Core Web Vitals and large-media regressions.

Logs should contain endpoint, status/error code, duration, environment,
deployment identifier, and a correlation ID. Do not log tokens, full email
addresses, inquiry messages, medical information, or complete request bodies.
Define alert owners and escalation channels before launch.

Leads and durable delivery events remain in Sanity. The protected
provider-neutral worker is implemented, but no live delivery provider, CRM
bridge, or scheduler is connected or verified. Follow the
[contact and delivery runbook](MQS-VAULT-LAUNCH-AND-CONTACT.md) to configure and
test the owned delivery path, including retries, duplicate handling, consent
confirmation, suppression, and failure monitoring.

## 12. Preview-to-production procedure

### Preview

1. Start from a reviewed, immutable commit.
2. Confirm CI is green.
3. Connect the repository and correct project root in the selected hosting
   platform.
4. Configure Preview-only Sanity values and secrets.
5. Deploy Preview.
6. Run the automated smoke test:

   ```bash
   npm run smoke -- https://preview.example.com
   ```

7. Verify every route listed in this document.
8. Submit test waitlist and audience inquiries and verify the Sanity documents.
9. Test both languages, keyboard navigation, forms, Studio, consent withdrawal,
   media, metadata, sitemap, robots, and security headers.
10. Verify rate limiting, logging, monitoring, and lead notification.
11. Obtain technical, content, legal, and media-rights approval.

### Production

1. Promote the exact approved commit; do not rebuild from an unreviewed working
   tree.
2. Configure Production variables independently.
3. Confirm the Production Sanity dataset, token scope, and CORS origins.
4. Configure the production domain, TLS, DNS, and intended `www` redirect.
5. Deploy through the selected platform.
6. Repeat critical route, form, Studio, consent, media, header, and monitoring
   checks against the real domain.

Neither of these deployments has been performed or verified by this handoff.

## 13. Rollback

Before Production, document the exact hosting-provider rollback procedure and
who is authorized to execute it.

Minimum rollback plan:

1. Deploy from immutable Git commits.
2. Retain the previously approved deployment.
3. If a release fails, restore the prior deployment or redeploy its commit.
4. Restore the matching environment-variable snapshot without exposing
   secrets.
5. Do not run the seed script as an application rollback.
6. Restore Sanity content only from a verified export or backup.
7. Preserve lead documents unless deletion is explicitly approved.
8. After rollback, verify public routes, forms, Studio access, consent, and
   monitoring.
9. Record the incident and block re-release until the cause is understood.

The repository does not configure or prove a provider-level one-click rollback.

## 14. Remaining launch blockers

The following partner-owned items remain unresolved and must not be inferred as
complete:

- [ ] Real Preview and Production Sanity project, dataset, CORS, roles, and
      least-privilege credentials.
- [ ] Verified anonymous denial for new lead records, plus an authorized review
      and remediation decision for any existing root-ID lead documents.
- [ ] Final legal company data: address, management, company-register details,
      VAT ID, content responsibility, and legal approval of privacy/terms.
- [ ] Production domain, DNS, TLS, `www` redirect, and HSTS-preload decision.
- [ ] Verified `hello@vanescience.com` mailbox and ownership of all public
      contact channels.
- [ ] Lead notification and/or CRM integration with failure monitoring.
- [ ] A production distributed rate-limit provider connected to both POST
      routes.
- [ ] Production logging, error monitoring, uptime checks, dashboards, alerts,
      and named responders.
- [ ] Media rights, participant consent, final web formats, transfer-size
      approval, and cache/CDN strategy.
- [ ] Reconfirm the locally clean dependency audit and passing integration
      checks on the exact release lockfile in a clean checkout and remote CI.
- [ ] Verified social links and any other external profiles shown publicly.
- [ ] A clean release commit with all CI gates passing.
- [ ] Authenticated Git-hosting access and an actual reviewed remote CI run;
      local source changes are not a remotely verified release.
- [ ] Preview acceptance and explicit technical, content, privacy, legal, and
      business sign-off.
- [ ] Documented and tested rollback procedure for the selected host.

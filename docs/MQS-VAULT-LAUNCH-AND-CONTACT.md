# MQS Vault launch and contact paths

Updated: 2026-09-24. This document supersedes the September 11 contact and
notification assumptions. It does not claim that external services are connected.

## Conversion concept

| Audience | Available now | Primary action | What happens next |
| --- | --- | --- | --- |
| Athlete | Guided assessment at the VANE Training Lab in Vienna | Request assessment / Assessment anfragen | Team reviews the request and agrees the details personally. No booking is automatically confirmed. |
| Coach | MQS Vault is in development | Join the waitlist / Auf die Warteliste | Store interest for access, with optional development updates. No trial or product account is created. |
| Partner | MQS Vault is in development | Join the waitlist / Auf die Warteliste | Store partner interest separately, with optional development updates. No pilot or integration is automatically promised. |

The existing H1 and hero introductions stay unchanged. Availability is stated
beside the primary action and at the final form. Coach and Partner need only an
email address. Athlete needs sport and email; a message is optional. Neither an
assessment request nor waitlist membership automatically subscribes someone to
ongoing marketing. Existing layout, role routes and anchor destinations remain.

This applies CRO, copywriting and email principles: a single meaningful next
step, minimum typing, honest product availability, and relevant role segments.
There is no invented launch date, guaranteed early access or response deadline.

## Consent and contact lifecycle

1. The public API validates and saves a private lead record in Sanity.
2. Waitlist role is derived from its page. Coach and Partner can coexist for the
   same address; repeated role registrations are atomically deduplicated.
3. The optional updates checkbox starts unchecked. An opt-in records exact
   wording, version, locale, source and timestamp, not a confirmed subscription.
4. The same write queues a durable delivery event. A protected worker sends it
   to an operator-configured HTTPS bridge. It never runs unawaited after a request.
5. The bridge owns double opt-in, suppression, unsubscribe links and confirmed
   consent evidence. Until confirmation, ongoing updates must not be sent.
6. Athlete requests go to the responsible team inbox or CRM. Team response and
   appointment agreement remain human actions. No update subscription is added.

An unchecked checkbox on a later form submission is not an unsubscribe action.
Withdrawal happens through the provider unsubscribe mechanism or the published
contact address. Repeated signup must not erase a provider's suppression state.
A later explicit opt-in creates a new delivery event but still requires address
confirmation. Old records are not automatically contacted or migrated.

These safeguards follow the EDPB principles of freely chosen, specific and
withdrawable consent: [EDPB guidance](https://www.edpb.europa.eu/sme/be-compliant/process-personal-data-lawfully_en).
The company owner must approve the full privacy notice, retention policy and
provider agreement before launch. The website does not certify legal compliance.

## Provider-neutral delivery contract

Configure server-only values from `.env.example`:

- `SANITY_API_WRITE_TOKEN`: least-privilege access to private lead documents.
- `LEAD_DELIVERY_JOB_SECRET`: random secret of at least 32 characters for the
  scheduler calling `POST /api/internal/lead-delivery` with a Bearer header.
- `LEAD_DELIVERY_WEBHOOK_URL`: the chosen bridge's HTTPS endpoint.
- `LEAD_DELIVERY_WEBHOOK_SECRET`: a separate random Bearer secret, at least 32
  characters, for the bridge. Never place secrets in URLs or public variables.

The bridge receives JSON version 1 with `eventId`, `leadId`, `kind`, `occurredAt`,
`contact`, source and role-specific fields. Supported kinds:

- `waitlist.joined`: role coach/partner. `updates.state` is either
  `double_opt_in_requested` or `not_requested`; `emailUpdatesAllowed` is always
  false at this boundary. The provider decides permission only after confirmation.
- `assessment.requested`: athlete sport/context and optional message, no updates.
- `inquiry.received`: compatibility for old non-athlete inquiry clients, no updates.

Requirements for the receiving bridge:

- Verify its Bearer secret before parsing/storing personal data.
- Deduplicate `Idempotency-Key` durably. It equals `eventId`, stable across retries.
- Return 2xx only after durable acceptance. Acceptance does not mean inbox delivery.
- Treat a waitlist signup as interest, not a created account or paid booking.
- Segment by role and language; keep provider suppression authoritative across roles.
- Send one confirmation request only for an explicit update opt-in. Do not import
  all waitlist addresses directly into a subscribed marketing list.
- Notify the VANE team of athlete requests and expose failures for follow-up.
- Never log tokens, full form payloads or sensitive free-text messages.

The scheduler should call the protected endpoint every minute after configuration.
Each run claims at most five due records with revision locks and a five-minute
lease. HTTPS dispatch times out after ten seconds and refuses redirects. Failed
dispatches retry with increasing delay, up to five attempts; exhausted jobs remain
visible as failed in Studio. A new consent event cannot be acknowledged by an old
worker. Monitor returned `failed` and `stateWriteFailed`, not HTTP status alone.
The bridge must support idempotency even when its acceptance succeeds but the
website's subsequent acknowledgement write fails.

No scheduler, bridge, mailing list or external account was created in this pass.
Without configuration the worker returns 503 and sends nothing. Public success
means the request is stored, not that an email was sent. The team must monitor
pending records until provider delivery is activated.

## Email plan for the selected provider

Keep one job per email. Send only relevant, substantive updates, not an invented
high-frequency campaign. Separate Coach and Partner segments and EN/DE templates.

1. **Confirm updates**, triggered by explicit opt-in.
   EN subject: `Confirm your MQS Vault updates`.
   DE subject: `Bestätige deine MQS Vault Updates`.
   Body: explain that MQS Vault is in development and confirmation permits
   development/access updates. One button: `Confirm email updates` /
   `E Mail Updates bestätigen`. Use the provider's expiring confirmation link.
   No launch date, trial activation or marketing before this confirmation.
2. **Welcome**, only after confirmation.
   EN subject: `You're on the MQS Vault updates list`.
   DE subject: `Du erhältst künftig MQS Vault Updates`.
   Coach focus: how assessment results and interpretation will support their
   practical decisions. Partner focus: where the assessment standard could fit
   their existing offering. State the current development status. Invite a reply
   about their use case, without making it a prerequisite for waitlist membership.
3. **Development update**, only on an actual approved milestone.
   Explain what changed and why it matters to that role. Distinguish working
   capabilities from planned ones. One relevant link or reply request.
4. **Access available**, only when the release owner has approved actual access.
   Invite the correct role to the real onboarding path. Do not promise priority,
   pricing or availability that has not been agreed. Honor suppression throughout.

For an athlete, an operational acknowledgement may state only that the inquiry
was received and the team will contact them about the Vienna assessment. It must
not confirm an appointment, subscribe them to updates or invent a response SLA.

## Pre-existing technical gates

- Dependency migration: see [September 24 migration evidence](SANITY-MIGRATION-2026-09-24.md)
  for resolved versions and exact audit results. Do not treat an older audit as current.
- Existing lead privacy: `node --env-file=.env.local scripts/check-lead-privacy.mjs`
  checks aggregate lead counts with and without authentication. No names, emails
  or messages are read by this script. It fails for anonymous visibility or legacy
  root IDs. Use only the intended dataset. Back up and review any needed migration
  separately; no live data was changed here.
- Hosting abuse protection: select the hosting platform and wire the existing
  distributed rate-limit hook or an equivalent edge rule before accepting public
  traffic. Do not substitute a per-process counter or trust arbitrary client IP
  headers. Verify 429 and retry behavior in that environment.
- Connect Preview credentials, sender domain, team recipient, provider suppression
  and unsubscribe behavior. Disclose the actual provider in the privacy notice.
- GitHub still needs authentication. Review the whole dirty diff, including prior
  user changes, before committing and opening a pull request. Do not merge until
  CI and the end-to-end preview checks are green.

## Acceptance checks before live traffic

- Coach and Partner: both languages, header/hero/final CTA agree; email-only form;
  unchecked optional consent; no account or trial claim; repeat signup safe.
- Athlete: sport and email required, message optional; notification reaches the
  actual team; response ownership assigned; no booking or subscription created.
- With/without opt-in: check separate stored permission and bridge payloads.
- Confirm, unsubscribe and resubscribe through the actual provider; ensure an old
  form event cannot silently reactivate a suppressed address.
- Simulate bridge timeout, duplicate job, worker interruption and provider failure.
- Check mobile keyboard, focus, preserved input on error, busy and success states.
- Run the build, test suite, smoke test, privacy probe and fresh dependency audit.
- Confirm dataset visibility, configured abuse protection, retention and deletion
  responsibilities, legal company details and real-device behavior.

## Local verification recorded on 2026-09-24

| Check | Recorded result |
| --- | --- |
| Production build | Passed with Node 22.23.2 and Next 16.3.4, including TypeScript |
| ESLint | Full check passed; final analytics fix also passed scoped lint |
| Unit and route tests | 140 tests across 13 files passed |
| Sanity schema | CLI validation passed with placeholder project configuration; not authenticated Studio acceptance |
| Dependency audits | Full and production audits both reported zero findings |
| Production smoke | 11 routes, nine H1/header/sitemap checks, unknown audience 404, six non-writing API checks, and unauthenticated worker denial passed |
| Browser review | Coach EN at desktop and 390 px, Coach DE at 1440 px, Partner EN at 1440 px, Partner DE at 390 px, Athlete EN and DE at 320 px |
| Responsive checks | Exactly one H1 and no horizontal overflow in the reviewed views; 16 px email input, optional unchecked updates consent, required sport/email and optional athlete message |
| Interaction checks | Mobile navigation and language selection, visible form focus, and waitlist failure recovery reviewed; entered address remained visible and the submit button became available again |

The local server had no Sanity write token or delivery secrets. The browser's
synthetic waitlist submission therefore exercised the safe unavailable-service
path, not live persistence or an email send. Successful storage, deduplication,
consent transitions and dispatch failures were checked with isolated tests.
No real lead was created, no email was sent, and no remote dataset was migrated.

Still required before release: actual dataset/privacy probe, authenticated Studio,
provider confirmation/unsubscribe and delivery acceptance, scheduled worker,
hosting-level abuse controls, real-device keyboard/media checks, clean-clone
installation and remote CI. GitHub authentication was unavailable; nothing was
pushed or merged by this pass.

## Implementation map for handoff

- Copy and placement: `lib/audience-content.ts`, `components/layout/SiteHeader.tsx`,
  `app/for/[audience]/audience-landing.tsx`.
- Forms and request recovery: `components/ui/audience-waitlist-form.tsx`,
  `components/ui/audience-inquiry-form.tsx`, `lib/waitlist-request.ts`, and the
  existing inquiry request helper.
- Validation and consent: `lib/waitlist-schema.ts`, `lib/inquiry-schema.ts`,
  `lib/waitlist-consent.ts`, `lib/waitlist.ts`.
- Persistence: `app/api/waitlist/route.ts`, `app/api/inquiry/route.ts`, and
  the waitlist, inquiry and shared delivery fields in `sanity/schemaTypes/`.
- Delivery: `lib/lead-delivery.ts`, `app/api/internal/lead-delivery/route.ts`,
  and server-only configuration documented in `.env.example`.
- Safety and QA: `lib/analytics.ts`, adjacent regression tests,
  `scripts/check-lead-privacy.mjs`, and `scripts/smoke.mjs`.
- Privacy and release notes: `app/privacy/privacy-content.tsx`, this document,
  `docs/TECHNICAL-HANDOFF.md`, `docs/SANITY-MIGRATION-2026-09-24.md`, and `README.md`.
- Dependency graph: `package.json` and `package-lock.json`; no new direct dependency.

Earlier unrelated working-tree changes remain intact. Review the complete diff
before preparing the release commit.

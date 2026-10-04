# VANE waitlists with Brevo

The athlete, coach and partner pages share an email form. `/api/waitlist`
validates requests, applies origin, body and honeypot guards, and adds each
contact to the global list and the relevant audience list. Existing audience
memberships and email suppression are preserved.

## Server configuration

Set these server-only variables locally and in the deployment environment:

- `BREVO_API_KEY`
- `BREVO_LIST_ATHLETE`
- `BREVO_LIST_COACH`
- `BREVO_LIST_PARTNER`
- `BREVO_LIST_GLOBAL`
- `BREVO_DOI_TEMPLATE_ID`

Keep credentials out of Git. List and template IDs must be positive integers.
Create text attributes `VANE_LANGUAGE`, `VANE_SOURCE`, `VANE_CONSENT_AT`,
`VANE_CONSENT_VERSION`, `VANE_CONSENT_TEXT`, and boolean attributes
`VANE_ATHLETE`, `VANE_COACH`, `VANE_PARTNER`, `VANE_UPDATES_CONFIRMED` in Brevo.

The active bilingual double-opt-in template must use Brevo's
`{{ doubleoptin }}` confirmation link. Confirmations return to
`https://vanescience.com/waitlist-confirmed` with a language parameter.

## Consent and notifications

Joining the waiting list does not opt into development campaigns. Optional
updates require email confirmation. Campaign recipients must have
`VANE_UPDATES_CONFIRMED = true` and must not be blocklisted. Never reset a
contact's suppression as part of signup.

New audience memberships trigger an internal notification to
`mqs@vanescience.com`. A stable per-contact/audience idempotency key prevents
ordinary duplicate notifications. Notification failures are logged without
rejecting an already-persisted signup; there is no durable retry queue.

## Content and deployment

Sanity is optional. Without CMS configuration, team content comes from code
and Studio renders the not-found view. The legacy inquiry endpoint and
Sanity worker remain dormant without their configuration.

Deployment currently uses the Vercel CLI. The original GitHub repository is
not connected for automatic deployments. Deployments need the production
Brevo variables and the project's custom domains. Do not alter Google
Workspace mail records when changing website DNS.

## Verification

Before a release, run lint, TypeScript checks, tests and a production build.
Verify a real browser signup, audience/global memberships, preservation of
existing memberships and suppression, confirmation delivery and redirect,
and internal notification delivery. Remove test contacts from the live lists
and suppress them afterward without deleting real contacts.

On 4 October 2026, the production release passed lint, TypeScript, 326 tests
and local/remote builds. Live checks verified routing for all three audiences,
repeat-signup preservation and actual confirmation/notification delivery.
The custom domain and www redirect have valid, automatically renewing TLS
certificates.

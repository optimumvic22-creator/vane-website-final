import type { WaitlistInput } from './waitlist-schema'
import { createHash } from 'node:crypto'
import { WAITLIST_UPDATES_CONSENT_VERSION, waitlistUpdatesConsent } from './waitlist-consent'

const API = 'https://api.brevo.com/v3'
type Audience = 'athlete' | 'coach' | 'partner'

export function waitlistAudience(segment: WaitlistInput['segment']): Audience | undefined {
  if (segment === 'athlete' || segment === 'individual') return 'athlete'
  if (segment === 'coach') return 'coach'
  if (segment === 'partner' || segment === 'gym-clinic' || segment === 'federation') return 'partner'
}

function positiveId(value: string | undefined): number | undefined {
  if (!value || !/^[1-9]\d*$/.test(value)) return undefined
  const id = Number(value)
  return Number.isSafeInteger(id) ? id : undefined
}

export class BrevoConfigurationError extends Error {}

function notificationKey(audience: string, email: string) {
  const digest = createHash('sha256').update(`vane-waitlist:${audience}:${email}`).digest('hex')
  // Brevo limits key length; use a stable 36-character UUID-shaped identifier.
  return `${digest.slice(0, 8)}-${digest.slice(8, 12)}-8${digest.slice(13, 16)}-a${digest.slice(17, 20)}-${digest.slice(20, 32)}`
}

/** Server only. Membership does not grant marketing consent or undo a suppression. */
export async function saveBrevoWaitlist(input: WaitlistInput) {
  const key = process.env.BREVO_API_KEY
  const audience = waitlistAudience(input.segment)
  const globalId = positiveId(process.env.BREVO_LIST_GLOBAL)
  const audienceId = audience ? positiveId(process.env[`BREVO_LIST_${audience.toUpperCase()}`]) : undefined
  const templateId = positiveId(process.env.BREVO_DOI_TEMPLATE_ID)
  if (!key || !globalId || (audience && !audienceId) || (input.updatesConsent && !templateId)) {
    throw new BrevoConfigurationError('brevo_configuration_missing')
  }
  const listIds = [...new Set([globalId, ...(audienceId ? [audienceId] : [])])]
  const locale = input.locale ?? 'en'
  const email = input.email.trim().toLowerCase()
  const attributes: Record<string, string | boolean> = {
    VANE_LANGUAGE: locale,
    VANE_SOURCE: input.source ?? 'website',
    ...(audience ? { [`VANE_${audience.toUpperCase()}`]: true } : {}),
  }
  // One deadline covers both writes and stays inside the browser's 15s timeout.
  const signal = AbortSignal.timeout(12000)

  const currentResponse = await fetch(`${API}/contacts/${encodeURIComponent(email)}`, {
    headers: { 'api-key': key }, signal, cache: 'no-store', redirect: 'error',
  })
  if (!currentResponse.ok && currentResponse.status !== 404) throw new Error('brevo_request_failed')
  const current = currentResponse.ok ? await currentResponse.json() as {
    emailBlacklisted?: boolean; listIds?: number[]; attributes?: Record<string, unknown>
  } : undefined
  const alreadyJoined = current?.listIds?.includes(audienceId ?? globalId) ?? false

  async function post(path: string, body: unknown) {
    const response = await fetch(`${API}${path}`, {
      method: 'POST',
      headers: { 'api-key': key!, 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(body),
      signal,
      cache: 'no-store',
      redirect: 'error',
    })
    if (!response.ok) throw new Error('brevo_request_failed')
  }

  // Upsert adds memberships without unlinking earlier audiences. Never send
  // emailBlacklisted=false: an existing unsubscribe must remain effective.
  await post('/contacts', { email, attributes, listIds, updateEnabled: true })

  if (input.updatesConsent && !current?.emailBlacklisted && current?.attributes?.VANE_UPDATES_CONFIRMED !== true) {
    // Brevo applies DOI attributes only through its confirmation flow. Campaigns
    // must filter VANE_UPDATES_CONFIRMED=true and respect Brevo suppression.
    await post('/contacts/doubleOptinConfirmation', {
      email,
      includeListIds: listIds,
      templateId,
      redirectionUrl: `https://vanescience.com/waitlist-confirmed?lang=${locale}`,
      attributes: {
        ...attributes,
        VANE_UPDATES_CONFIRMED: true,
        VANE_CONSENT_AT: new Date().toISOString(),
        VANE_CONSENT_VERSION: WAITLIST_UPDATES_CONSENT_VERSION,
        VANE_CONSENT_TEXT: waitlistUpdatesConsent[locale],
      },
    })
  }

  if (!alreadyJoined) {
    // Notification failure must not turn a persisted signup into a failed form.
    try {
      await post('/smtp/email', {
        sender: { name: 'VANE Science', email: 'mqs@vanescience.com' },
        to: [{ email: 'mqs@vanescience.com' }],
        subject: `VANE Warteliste: ${audience ?? 'global'}`,
        textContent: `Neue Wartelisten-Anmeldung\n\nE-Mail: ${email}\nListe: ${audience ?? 'global'} + globale Warteliste\nSprache: ${locale}\nQuelle: ${input.source ?? 'website'}\n\nDer aktuelle Einwilligungs- und Abmeldestatus ist in Brevo zu prüfen.`,
        headers: { idempotencyKey: notificationKey(audience ?? 'global', email) },
      })
    } catch {
      console.error('brevo_admin_notification_failed')
    }
  }
}

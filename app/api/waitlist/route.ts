import { createHash, randomUUID } from 'node:crypto'
import { createClient } from 'next-sanity'
import { parseWaitlistInput } from '@/lib/waitlist-schema'
import { apiError, guardJsonRequest, noStoreJson } from '@/lib/request-guard'
import { WAITLIST_UPDATES_CONSENT_VERSION, waitlistUpdatesConsent } from '@/lib/waitlist-consent'
import { BrevoConfigurationError, saveBrevoWaitlist } from '@/lib/brevo-waitlist'

export async function POST(request: Request) {
  const guarded = await guardJsonRequest(request)
  if (!guarded.ok) return guarded.response

  const parsed = parseWaitlistInput(guarded.payload)
  if (!parsed.success) {
    return apiError(
      400,
      'invalid_request',
      'Please provide a valid email address.',
    )
  }

  const { email, segment, locale, source, company, updatesConsent } = parsed.data

  // Honeypot tripped. Pretend success and store nothing.
  if (company) {
    return noStoreJson({ ok: true })
  }

  if (process.env.BREVO_API_KEY) {
    try {
      await saveBrevoWaitlist(parsed.data)
      return noStoreJson({ ok: true })
    } catch (error) {
      return apiError(error instanceof BrevoConfigurationError ? 503 : 502,
        'service_unavailable', 'Could not confirm your signup. Please try again.')
    }
  }

  const token = process.env.SANITY_API_WRITE_TOKEN
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
  const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01'
  if (!token || !projectId || !dataset) {
    return apiError(
      503,
      'service_unavailable',
      'Service temporarily unavailable.',
    )
  }

  const writeClient = createClient({ projectId, dataset, apiVersion, useCdn: false, token })

  try {
    const normalizedEmail = email.trim().toLowerCase()

    if (segment === 'coach' || segment === 'partner') {
      // A person may join both audiences. A repeated signup must not enqueue
      // duplicate messages or disclose whether this address is already listed.
      const digest = createHash('sha256').update(`${segment}:${normalizedEmail}`).digest('hex')
      const now = new Date().toISOString()
      const consent: {
        updatesConsent: boolean
        updatesConsentAt?: string
        updatesConsentVersion?: string
        updatesConsentText?: string
      } = updatesConsent ? {
        updatesConsent: true,
        updatesConsentAt: now,
        updatesConsentVersion: WAITLIST_UPDATES_CONSENT_VERSION,
        updatesConsentText: waitlistUpdatesConsent[locale ?? 'en'],
      } : { updatesConsent: false }
      const saved = await writeClient.createIfNotExists({
        _id: `vane.waitlist.${digest}`,
        _type: 'waitlistSignup',
        email: normalizedEmail,
        segment,
        locale: locale ?? 'en',
        source,
        product: 'mqs-vault',
        status: 'waiting',
        createdAt: now,
        ...consent,
        deliveryStatus: 'pending',
        deliveryAttempts: 0,
        deliveryEventId: randomUUID(),
      })

      // A later explicit opt-in is recorded without treating an unchecked box
      // as withdrawal. The mail provider owns confirmed consent and suppression.
      if (updatesConsent && saved.updatesConsent !== true) {
        await writeClient.patch(saved._id).ifRevisionId(saved._rev).set({
          ...consent,
          locale: locale ?? 'en',
          source,
          deliveryStatus: 'pending',
          deliveryAttempts: 0,
          deliveryEventId: randomUUID(),
        }).unset(['deliveryLeaseUntil', 'deliveryNextAttemptAt', 'deliveryAcceptedAt']).commit()
      }
      return noStoreJson({ ok: true })
    }

    // Preserve authenticated deduplication for legacy documents with random IDs.
    // This lookup does not migrate existing records or change their visibility.
    const existingId = await writeClient.fetch<string | null>(
      '*[_type == "waitlistSignup" && email == $email][0]._id',
      { email: normalizedEmail },
    )
    if (!existingId) {
      // Sanity restricts dotted document IDs to authenticated readers, including
      // in public datasets. Atomic creation also covers concurrent submissions.
      const emailDigest = createHash('sha256').update(normalizedEmail).digest('hex')
      await writeClient.createIfNotExists({
        _id: `vane.waitlist.${emailDigest}`,
        _type: 'waitlistSignup',
        email: normalizedEmail,
        segment,
        locale,
        source,
        createdAt: new Date().toISOString(),
      })
    }
    return noStoreJson({ ok: true })
  } catch {
    return apiError(
      500,
      'request_failed',
      'Could not save your signup. Please try again.',
    )
  }
}

import { createHash, timingSafeEqual } from 'node:crypto'
import type { SanityClient } from 'next-sanity'
import { z } from 'zod'
import { WAITLIST_UPDATES_CONSENT_VERSION } from './waitlist-consent'

export const LEAD_DELIVERY_BATCH_SIZE = 5
export const LEAD_DELIVERY_MAX_ATTEMPTS = 5
export const LEAD_DELIVERY_LEASE_MS = 5 * 60 * 1000
export const LEAD_DELIVERY_TIMEOUT_MS = 10_000

// Only explicitly queued, private lead records are eligible. Historical records
// without deliveryStatus are deliberately not migrated or sent by this worker.
export const DUE_LEADS_QUERY = `*[
  ((_type == "waitlistSignup" && _id in path("vane.waitlist.**")) ||
   (_type == "audienceInquiry" && _id in path("vane.inquiry.**"))) &&
  ((deliveryStatus == "pending" &&
    (!defined(deliveryNextAttemptAt) || dateTime(deliveryNextAttemptAt) <= dateTime($now))) ||
   (deliveryStatus == "processing" && dateTime(deliveryLeaseUntil) <= dateTime($now)))
] | order(_createdAt asc)[0...5]{
  _id, _rev, _type, email, audience, segment, context, message, locale, source,
  createdAt, updatesConsent, updatesConsentAt, updatesConsentVersion,
  updatesConsentText, deliveryEventId, deliveryStatus, deliveryAttempts,
  deliveryNextAttemptAt, deliveryLeaseUntil
}`

type DeliveryClient = Pick<SanityClient, 'fetch' | 'patch'>
export type LeadDeliveryConfiguration = {
  webhookUrl: string
  webhookSecret: string
}

export function readLeadDeliveryConfiguration(
  env: Record<string, string | undefined>,
): LeadDeliveryConfiguration | null {
  const webhookSecret = env.LEAD_DELIVERY_WEBHOOK_SECRET
  if (!webhookSecret || webhookSecret.trim().length < 32) return null
  try {
    const url = new URL(env.LEAD_DELIVERY_WEBHOOK_URL || '')
    // The target is operator-configured, never supplied by a public request.
    // Disallow URL credentials/fragments and refuse redirects at dispatch.
    if (url.protocol !== 'https:' || url.username || url.password || url.hash) return null
    return { webhookUrl: url.toString(), webhookSecret }
  } catch {
    return null
  }
}

export function isLeadDeliveryAuthorized(header: string | null, secret: string): boolean {
  if (!header?.startsWith('Bearer ') || secret.trim().length < 32) return false
  // Hashing both values gives timingSafeEqual equal-length buffers, including
  // when the submitted bearer value has a different length.
  const digest = (value: string) => createHash('sha256').update(value).digest()
  return timingSafeEqual(digest(header.slice(7)), digest(secret))
}

const queueRecordSchema = z.object({
  _id: z.string().regex(/^vane\.(waitlist|inquiry)\.[A-Za-z0-9_-]+$/),
  _rev: z.string().min(1),
  deliveryAttempts: z.number().int().nonnegative(),
  deliveryStatus: z.enum(['pending', 'processing']),
  deliveryNextAttemptAt: z.iso.datetime().optional(),
  deliveryLeaseUntil: z.iso.datetime().optional(),
})

const contactFields = {
  email: z.email().max(320),
  locale: z.enum(['en', 'de']).optional(),
  source: z.string().max(120).optional(),
  createdAt: z.iso.datetime(),
  deliveryEventId: z.string().regex(/^[A-Za-z0-9._-]{1,160}$/).optional(),
}

const leadPayloadSchema = z.discriminatedUnion('_type', [
  z.object({
    _type: z.literal('waitlistSignup'),
    ...contactFields,
    segment: z.enum(['coach', 'partner']),
    updatesConsent: z.boolean().optional(),
    updatesConsentAt: z.iso.datetime().optional(),
    updatesConsentVersion: z.enum(['mqsvault-updates-v1', WAITLIST_UPDATES_CONSENT_VERSION]).optional(),
    updatesConsentText: z.string().max(2000).optional(),
  }).refine(
    (lead) => !lead.updatesConsent || !!(lead.updatesConsentAt && lead.updatesConsentVersion && lead.updatesConsentText),
    'Requested updates must have a versioned consent record.',
  ),
  z.object({
    _type: z.literal('audienceInquiry'),
    ...contactFields,
    audience: z.enum(['athlete', 'coach', 'partner']),
    context: z.string().min(2).max(160),
    message: z.string().max(600).optional(),
  }),
])

function omitProjectedNulls(document: unknown): unknown {
  // Explicit GROQ projections return null for missing properties. Normalize
  // these to absence before validation; required fields still fail closed.
  if (!document || typeof document !== 'object' || Array.isArray(document)) return document
  return Object.fromEntries(Object.entries(document).filter(([, value]) => value !== null))
}

/** The bridge must deduplicate eventId durably before performing side effects. */
export function buildLeadDeliveryEvent(document: unknown, leadId: string) {
  const lead = leadPayloadSchema.parse(omitProjectedNulls(document))
  const envelope = {
    version: 1,
    eventId: lead.deliveryEventId || leadId,
    leadId,
    occurredAt: lead.createdAt,
    contact: { email: lead.email, locale: lead.locale },
    source: lead.source,
  }

  if (lead._type === 'waitlistSignup') {
    return {
      ...envelope,
      kind: 'waitlist.joined' as const,
      segment: lead.segment,
      updates: {
        // A form checkbox is only a request to begin DOI, not permission to
        // send updates. The provider owns verification and suppression state.
        state: lead.updatesConsent === true ? 'double_opt_in_requested' : 'not_requested',
        emailUpdatesAllowed: false,
        consentAt: lead.updatesConsent === true ? lead.updatesConsentAt : undefined,
        consentVersion: lead.updatesConsent === true ? lead.updatesConsentVersion : undefined,
        consentText: lead.updatesConsent === true ? lead.updatesConsentText : undefined,
      },
    }
  }

  return {
    ...envelope,
    kind: lead.audience === 'athlete' ? 'assessment.requested' as const : 'inquiry.received' as const,
    audience: lead.audience,
    context: lead.context,
    message: lead.message,
    updates: { state: 'not_requested', emailUpdatesAllowed: false },
  }
}

export function leadDeliveryRetryAt(attempt: number, now: Date): string {
  return new Date(now.getTime() + Math.min(60 * 60 * 1000, 60_000 * 2 ** (attempt - 1))).toISOString()
}

export type LeadDeliverySummary = {
  processed: number
  transportAccepted: number
  retryScheduled: number
  failed: number
  skipped: number
  stateWriteFailed: number
}

type DeliveryOptions = {
  client: DeliveryClient
  configuration: LeadDeliveryConfiguration
  fetcher?: typeof fetch
  now?: () => Date
}

/** All work is awaited. A terminated invocation leaves a durable expiring lease. */
export async function deliverPendingLeads({
  client,
  configuration,
  fetcher = fetch,
  now = () => new Date(),
}: DeliveryOptions): Promise<LeadDeliverySummary> {
  // Also fail closed when called directly, outside the authenticated route.
  if (!readLeadDeliveryConfiguration({
    LEAD_DELIVERY_WEBHOOK_URL: configuration.webhookUrl,
    LEAD_DELIVERY_WEBHOOK_SECRET: configuration.webhookSecret,
  })) throw new Error('Lead delivery configuration unavailable')

  const summary: LeadDeliverySummary = {
    processed: 0, transportAccepted: 0, retryScheduled: 0,
    failed: 0, skipped: 0, stateWriteFailed: 0,
  }
  const documents = await client.fetch<unknown[]>(DUE_LEADS_QUERY, { now: now().toISOString() })

  await Promise.all(documents.slice(0, LEAD_DELIVERY_BATCH_SIZE).map(async (document) => {
    const parsed = queueRecordSchema.safeParse(omitProjectedNulls(document))
    if (!parsed.success) {
      summary.skipped++
      return
    }
    const queued = parsed.data
    const startedAt = now()
    // Recheck the snapshot as a defense in depth against unexpected query data.
    const dueAt = queued.deliveryStatus === 'processing'
      ? queued.deliveryLeaseUntil : queued.deliveryNextAttemptAt
    if ((queued.deliveryStatus === 'processing' && !dueAt) ||
        (dueAt && new Date(dueAt).getTime() > startedAt.getTime())) {
      summary.skipped++
      return
    }

    if (queued.deliveryAttempts >= LEAD_DELIVERY_MAX_ATTEMPTS) {
      try {
        await client.patch(queued._id).ifRevisionId(queued._rev)
          .set({ deliveryStatus: 'failed', deliveryLastError: 'attempts_exhausted' })
          .unset(['deliveryLeaseUntil', 'deliveryNextAttemptAt']).commit()
        summary.failed++
      } catch {
        summary.stateWriteFailed++
      }
      return
    }

    let claimed: { _rev: string }
    const attempt = queued.deliveryAttempts + 1
    try {
      claimed = await client.patch(queued._id).ifRevisionId(queued._rev)
        .set({
          deliveryStatus: 'processing',
          deliveryAttempts: attempt,
          deliveryLeaseUntil: new Date(startedAt.getTime() + LEAD_DELIVERY_LEASE_MS).toISOString(),
        })
        .unset(['deliveryNextAttemptAt'])
        .commit()
    } catch (error) {
      // Revision conflicts are expected when workers overlap. An ambiguous
      // commit/network failure must never result in an unclaimed outbound send.
      if (typeof error === 'object' && error !== null && 'statusCode' in error && error.statusCode === 409) {
        summary.skipped++
      } else {
        summary.stateWriteFailed++
      }
      return
    }
    summary.processed++

    let accepted = false
    let invalidPayload = false
    let failureCode = 'transport_error'
    try {
      let event: ReturnType<typeof buildLeadDeliveryEvent>
      try {
        event = buildLeadDeliveryEvent(document, queued._id)
      } catch {
        invalidPayload = true
        throw new Error('invalid_lead_payload')
      }
      const response = await fetcher(configuration.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${configuration.webhookSecret}`,
          'Idempotency-Key': event.eventId,
        },
        body: JSON.stringify(event),
        cache: 'no-store',
        redirect: 'error',
        signal: AbortSignal.timeout(LEAD_DELIVERY_TIMEOUT_MS),
      })
      accepted = response.ok
      failureCode = `http_${response.status}`
      // Never retain a provider response body, which could contain lead data.
      if (response.body) await response.body.cancel().catch(() => undefined)
    } catch {
      // Deliberately retain only a safe machine code, not exception text.
    }

    const exhausted = attempt >= LEAD_DELIVERY_MAX_ATTEMPTS || invalidPayload
    try {
      // A newer opt-in event or another owner must not be acknowledged by this
      // invocation. Every completion is conditional on the claimed revision.
      const patch = client.patch(queued._id).ifRevisionId(claimed._rev)
      if (accepted) {
        await patch.set({
          deliveryStatus: 'delivered',
          deliveryAcceptedAt: now().toISOString(),
        }).unset(['deliveryLeaseUntil', 'deliveryNextAttemptAt', 'deliveryLastError']).commit()
        // "delivered" means accepted by the bridge, NOT delivered to an inbox.
        summary.transportAccepted++
      } else {
        await patch.set({
          deliveryStatus: exhausted ? 'failed' : 'pending',
          deliveryLastError: invalidPayload ? 'invalid_lead_payload' : failureCode,
          ...(!exhausted ? { deliveryNextAttemptAt: leadDeliveryRetryAt(attempt, now()) } : {}),
        }).unset(exhausted ? ['deliveryLeaseUntil', 'deliveryNextAttemptAt'] : ['deliveryLeaseUntil']).commit()
        if (exhausted) summary.failed++
        else summary.retryScheduled++
      }
    } catch {
      // The unchanged processing lease makes retry possible even if the bridge
      // accepted but Sanity acknowledgement failed. Idempotency is mandatory.
      summary.stateWriteFailed++
    }
  }))

  return summary
}

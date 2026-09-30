import { describe, expect, it, vi } from 'vitest'
import { WAITLIST_UPDATES_CONSENT_VERSION, waitlistUpdatesConsent } from './waitlist-consent'
import {
  buildLeadDeliveryEvent,
  deliverPendingLeads,
  DUE_LEADS_QUERY,
  isLeadDeliveryAuthorized,
  LEAD_DELIVERY_LEASE_MS,
  LEAD_DELIVERY_TIMEOUT_MS,
  leadDeliveryRetryAt,
  readLeadDeliveryConfiguration,
} from './lead-delivery'

const now = new Date('2026-09-24T12:00:00.000Z')
const configuration = {
  webhookUrl: 'https://delivery.example.test/leads',
  webhookSecret: 'webhook-secret-for-tests-only-32-characters',
}

function lead(overrides: Record<string, unknown> = {}) {
  return {
    _id: 'vane.waitlist.abc123', _rev: 'rev-0', _type: 'waitlistSignup',
    email: 'coach@example.test', segment: 'coach', locale: 'en', source: 'audience:coach:hero',
    createdAt: '2026-09-24T10:00:00.000Z',
    deliveryStatus: 'pending', deliveryAttempts: 0, deliveryEventId: 'event-1',
    updatesConsent: false,
    ...overrides,
  }
}

function harness(input: Record<string, unknown>[] = [lead()]) {
  const records = new Map(input.map((document) => [String(document._id), { ...document }]))
  const commitCalls: { id: string; revision: string; fields: Record<string, unknown>; unset: string[] }[] = []
  const fetcher = vi.fn<typeof globalThis.fetch>(async () => new Response(null, { status: 202 }))
  const failCommit = vi.fn<(call: number) => void>()
  const fetch = vi.fn(async () => input.map((document) => ({ ...document })))
  const patch = vi.fn((id: string) => {
    let revision = ''
    let fields: Record<string, unknown> = {}
    let unset: string[] = []
    const mutation = {
      ifRevisionId: (value: string) => { revision = value; return mutation },
      set: (value: Record<string, unknown>) => { fields = value; return mutation },
      unset: (value: string[]) => { unset = value; return mutation },
      commit: async () => {
        commitCalls.push({ id, revision, fields, unset })
        failCommit(commitCalls.length)
        const current = records.get(id)
        if (!current || current._rev !== revision) throw Object.assign(new Error('Revision conflict'), { statusCode: 409 })
        const updated: Record<string, unknown> = { ...current, ...fields, _rev: `rev-${commitCalls.length}` }
        for (const key of unset) delete updated[key]
        records.set(id, updated)
        return { ...updated }
      },
    }
    return mutation
  })
  const client = { fetch, patch } as unknown as Parameters<typeof deliverPendingLeads>[0]['client']
  return {
    records, commitCalls, fetcher, failCommit, fetch, patch, client,
    run: () => deliverPendingLeads({ client, configuration, fetcher, now: () => now }),
  }
}

describe('lead delivery authorization and configuration', () => {
  const secret = 'job-secret-for-tests-only-32-characters'

  it('requires the exact bearer secret and rejects empty/weak configuration', () => {
    expect(isLeadDeliveryAuthorized(`Bearer ${secret}`, secret)).toBe(true)
    for (const header of [null, secret, `Basic ${secret}`, 'Bearer x', `Bearer ${secret}x`]) {
      expect(isLeadDeliveryAuthorized(header, secret)).toBe(false)
    }
    expect(isLeadDeliveryAuthorized('Bearer short', 'short')).toBe(false)
  })

  it('requires an HTTPS receiver and a separate nonempty secret', () => {
    expect(readLeadDeliveryConfiguration({
      LEAD_DELIVERY_WEBHOOK_URL: configuration.webhookUrl,
      LEAD_DELIVERY_WEBHOOK_SECRET: configuration.webhookSecret,
    })).toEqual(configuration)
    for (const url of ['', 'not a url', 'http://delivery.example.test', 'https://user:pass@example.test', 'https://example.test/#fragment']) {
      expect(readLeadDeliveryConfiguration({
        LEAD_DELIVERY_WEBHOOK_URL: url,
        LEAD_DELIVERY_WEBHOOK_SECRET: configuration.webhookSecret,
      })).toBeNull()
    }
    expect(readLeadDeliveryConfiguration({ LEAD_DELIVERY_WEBHOOK_URL: configuration.webhookUrl })).toBeNull()
  })
})

describe('provider-neutral lead event', () => {
  it('requests DOI only from a complete explicit opt-in record and never permits updates itself', () => {
    const event = buildLeadDeliveryEvent(lead({
      updatesConsent: true,
      updatesConsentAt: now.toISOString(),
      updatesConsentVersion: 'mqsvault-updates-v1',
      updatesConsentText: 'I would like email updates.',
      ipAddress: '192.0.2.1', unknownPrivateField: 'not forwarded',
    }), 'vane.waitlist.abc123')
    expect(event).toMatchObject({
      kind: 'waitlist.joined', eventId: 'event-1', segment: 'coach',
      updates: {
        state: 'double_opt_in_requested', emailUpdatesAllowed: false,
        consentAt: now.toISOString(), consentVersion: 'mqsvault-updates-v1',
        consentText: 'I would like email updates.',
      },
    })
    expect(JSON.stringify(event)).not.toContain('192.0.2.1')
    expect(JSON.stringify(event)).not.toContain('not forwarded')
  })

  it('never infers consent from absent/false consent or stale consent metadata', () => {
    for (const consent of [false, undefined]) {
      const event = buildLeadDeliveryEvent(lead({ updatesConsent: consent, updatesConsentText: 'old text' }), 'vane.waitlist.abc123')
      expect(event.updates).toMatchObject({ state: 'not_requested', emailUpdatesAllowed: false })
      expect(JSON.stringify(event)).not.toContain('old text')
    }
    expect(() => buildLeadDeliveryEvent(lead({ updatesConsent: true }), 'vane.waitlist.abc123')).toThrow()
  })

  it('routes athlete assessment and legacy inquiries without marketing permission', () => {
    for (const audience of ['athlete', 'coach', 'partner']) {
      const event = buildLeadDeliveryEvent(lead({
        _type: 'audienceInquiry', audience, context: 'Local club', message: 'Please contact me.',
      }), 'vane.inquiry.abc123')
      expect(event.kind).toBe(audience === 'athlete' ? 'assessment.requested' : 'inquiry.received')
      expect(event.updates).toEqual({ state: 'not_requested', emailUpdatesAllowed: false })
    }
  })

  it('falls back to the document ID only for already queued records without an event ID', () => {
    expect(buildLeadDeliveryEvent(lead({ deliveryEventId: undefined }), 'vane.waitlist.abc123').eventId).toBe('vane.waitlist.abc123')
  })
})

describe('durable lead delivery worker', () => {
  it.each(['coach', 'partner'] as const)('dispatches current %s opt-ins with the exact stored consent record', async (segment) => {
    const test = harness([lead({
      segment,
      locale: 'de',
      product: 'mqs-vault',
      status: 'waiting',
      updatesConsent: true,
      updatesConsentAt: now.toISOString(),
      updatesConsentVersion: WAITLIST_UPDATES_CONSENT_VERSION,
      updatesConsentText: waitlistUpdatesConsent.de,
    })])

    expect(await test.run()).toMatchObject({ transportAccepted: 1, failed: 0 })
    expect(test.fetcher).toHaveBeenCalledOnce()
    const event = JSON.parse(String(test.fetcher.mock.calls[0][1]?.body))
    expect(event).toMatchObject({
      kind: 'waitlist.joined', segment,
      contact: { email: 'coach@example.test', locale: 'de' },
      updates: {
        state: 'double_opt_in_requested', emailUpdatesAllowed: false,
        consentAt: now.toISOString(),
        consentVersion: WAITLIST_UPDATES_CONSENT_VERSION,
        consentText: waitlistUpdatesConsent.de,
      },
    })
  })

  it('claims before sending and persists transport acceptance, not an email-delivery claim', async () => {
    const test = harness()
    const result = await test.run()
    expect(test.fetch).toHaveBeenCalledWith(DUE_LEADS_QUERY, { now: now.toISOString() })
    expect(test.commitCalls[0]).toMatchObject({
      revision: 'rev-0', fields: {
        deliveryStatus: 'processing', deliveryAttempts: 1,
        deliveryLeaseUntil: new Date(now.getTime() + LEAD_DELIVERY_LEASE_MS).toISOString(),
      },
    })
    expect(test.fetcher).toHaveBeenCalledOnce()
    const [url, options] = test.fetcher.mock.calls[0]
    expect(url).toBe(configuration.webhookUrl)
    expect(options).toMatchObject({
      method: 'POST', redirect: 'error', cache: 'no-store',
      headers: { Authorization: `Bearer ${configuration.webhookSecret}`, 'Idempotency-Key': 'event-1' },
    })
    expect(options?.signal).toBeInstanceOf(AbortSignal)
    expect(LEAD_DELIVERY_TIMEOUT_MS).toBe(10_000)
    expect(test.commitCalls[1].revision).toBe('rev-1')
    expect(test.records.get('vane.waitlist.abc123')).toMatchObject({
      deliveryStatus: 'delivered', deliveryAcceptedAt: now.toISOString(), deliveryAttempts: 1,
    })
    expect(test.records.get('vane.waitlist.abc123')).not.toHaveProperty('deliveryLeaseUntil')
    expect(result).toEqual({ processed: 1, transportAccepted: 1, retryScheduled: 0, failed: 0, skipped: 0, stateWriteFailed: 0 })
  })

  it('allows only one overlapping worker to claim and send the same event', async () => {
    const test = harness()
    const results = await Promise.all([test.run(), test.run()])
    expect(test.fetcher).toHaveBeenCalledOnce()
    expect(results.reduce((sum, result) => sum + result.transportAccepted, 0)).toBe(1)
    expect(results.reduce((sum, result) => sum + result.skipped, 0)).toBe(1)
  })

  it('accepts real GROQ projections with null absent optional fields', async () => {
    const test = harness([lead({
      deliveryLeaseUntil: null, deliveryNextAttemptAt: null, deliveryEventId: null,
      updatesConsentAt: null, updatesConsentVersion: null, updatesConsentText: null,
      locale: null, source: null, context: null, message: null, audience: null,
    })])
    expect(await test.run()).toMatchObject({ transportAccepted: 1, skipped: 0, failed: 0 })
    expect(test.fetcher.mock.calls[0][1]?.headers).toMatchObject({ 'Idempotency-Key': 'vane.waitlist.abc123' })
    const body = JSON.parse(String(test.fetcher.mock.calls[0][1]?.body))
    expect(body.updates).toEqual({ state: 'not_requested', emailUpdatesAllowed: false })
  })

  it('never sends after an ambiguous claim failure', async () => {
    const test = harness()
    test.failCommit.mockImplementationOnce(() => { throw new Error('Sensitive database error') })
    expect(await test.run()).toMatchObject({ stateWriteFailed: 1, processed: 0 })
    expect(test.fetcher).not.toHaveBeenCalled()
  })

  it.each([302, 400, 429, 500])('durably retries HTTP %i without retaining provider body', async (status) => {
    const test = harness()
    test.fetcher.mockResolvedValueOnce(new Response('private provider details', { status }))
    expect(await test.run()).toMatchObject({ retryScheduled: 1, transportAccepted: 0 })
    expect(test.records.get('vane.waitlist.abc123')).toMatchObject({
      deliveryStatus: 'pending', deliveryLastError: `http_${status}`,
      deliveryNextAttemptAt: '2026-09-24T12:01:00.000Z',
    })
    expect(JSON.stringify(test.records.get('vane.waitlist.abc123'))).not.toContain('private provider details')
  })

  it('retries a network/timeout failure without leaking the error', async () => {
    const test = harness()
    test.fetcher.mockRejectedValueOnce(new Error('private network credentials'))
    expect(await test.run()).toMatchObject({ retryScheduled: 1 })
    expect(test.records.get('vane.waitlist.abc123')).toMatchObject({ deliveryLastError: 'transport_error' })
    expect(JSON.stringify(test.commitCalls)).not.toContain('private network credentials')
  })

  it('uses exponential backoff and stops after five attempted sends', async () => {
    expect(leadDeliveryRetryAt(1, now)).toBe('2026-09-24T12:01:00.000Z')
    expect(leadDeliveryRetryAt(2, now)).toBe('2026-09-24T12:02:00.000Z')
    expect(leadDeliveryRetryAt(4, now)).toBe('2026-09-24T12:08:00.000Z')
    const test = harness([lead({ deliveryAttempts: 4 })])
    test.fetcher.mockResolvedValueOnce(new Response(null, { status: 503 }))
    expect(await test.run()).toMatchObject({ failed: 1, retryScheduled: 0 })
    expect(test.records.get('vane.waitlist.abc123')).toMatchObject({ deliveryStatus: 'failed', deliveryAttempts: 5 })
    expect(test.records.get('vane.waitlist.abc123')).not.toHaveProperty('deliveryNextAttemptAt')
  })

  it('dead-letters an expired final-attempt lease without making a sixth send', async () => {
    const test = harness([lead({
      deliveryAttempts: 5, deliveryStatus: 'processing', deliveryLeaseUntil: '2026-09-24T11:59:00.000Z',
    })])
    expect(await test.run()).toMatchObject({ failed: 1 })
    expect(test.fetcher).not.toHaveBeenCalled()
  })

  it('recovers an expired processing lease with the same idempotency key', async () => {
    const test = harness([lead({
      deliveryAttempts: 1, deliveryStatus: 'processing', deliveryLeaseUntil: '2026-09-24T11:59:00.000Z',
    })])
    expect(await test.run()).toMatchObject({ transportAccepted: 1 })
    expect(test.fetcher.mock.calls[0][1]?.headers).toMatchObject({ 'Idempotency-Key': 'event-1' })
    expect(test.records.get('vane.waitlist.abc123')).toMatchObject({ deliveryAttempts: 2 })
  })

  it('does not claim a future retry, live lease, missing lease, or historical unqueued record', async () => {
    for (const document of [
      lead({ deliveryNextAttemptAt: '2026-09-24T12:05:00.000Z' }),
      lead({ deliveryStatus: 'processing', deliveryLeaseUntil: '2026-09-24T12:05:00.000Z' }),
      lead({ deliveryStatus: 'processing' }),
      lead({ deliveryStatus: undefined }),
      lead({ _id: 'public-lead' }),
    ]) {
      const test = harness([document])
      expect(await test.run()).toMatchObject({ skipped: 1 })
      expect(test.patch).not.toHaveBeenCalled()
      expect(test.fetcher).not.toHaveBeenCalled()
    }
  })

  it('leaves a recoverable lease when acceptance cannot be acknowledged', async () => {
    const test = harness()
    test.failCommit.mockImplementation((call) => { if (call === 2) throw new Error('Storage unavailable') })
    expect(await test.run()).toMatchObject({ stateWriteFailed: 1, transportAccepted: 0 })
    expect(test.records.get('vane.waitlist.abc123')).toMatchObject({ deliveryStatus: 'processing' })
  })

  it('cannot acknowledge or overwrite a newer opt-in event queued during delivery', async () => {
    const test = harness()
    test.fetcher.mockImplementationOnce(async () => {
      test.records.set('vane.waitlist.abc123', lead({ _rev: 'newer-event-revision', deliveryEventId: 'event-2' }))
      return new Response(null, { status: 202 })
    })
    expect(await test.run()).toMatchObject({ stateWriteFailed: 1 })
    expect(test.records.get('vane.waitlist.abc123')).toMatchObject({ deliveryStatus: 'pending', deliveryEventId: 'event-2' })
  })

  it('quarantines invalid consent payloads without dispatching them', async () => {
    const test = harness([lead({ updatesConsent: true })])
    expect(await test.run()).toMatchObject({ failed: 1 })
    expect(test.fetcher).not.toHaveBeenCalled()
    expect(test.records.get('vane.waitlist.abc123')).toMatchObject({ deliveryStatus: 'failed', deliveryLastError: 'invalid_lead_payload' })
  })

  it('rejects unknown consent versions without dispatching them', async () => {
    const test = harness([lead({
      updatesConsent: true,
      updatesConsentAt: now.toISOString(),
      updatesConsentVersion: 'unknown-consent-version',
      updatesConsentText: waitlistUpdatesConsent.en,
    })])

    expect(await test.run()).toMatchObject({ failed: 1, transportAccepted: 0 })
    expect(test.fetcher).not.toHaveBeenCalled()
    expect(test.records.get('vane.waitlist.abc123')).toMatchObject({
      deliveryStatus: 'failed', deliveryLastError: 'invalid_lead_payload',
    })
  })

  it('bounds the batch to five even if a store unexpectedly returns more', async () => {
    const test = harness(Array.from({ length: 7 }, (_, index) => lead({ _id: `vane.waitlist.lead${index}`, deliveryEventId: `event-${index}` })))
    expect(await test.run()).toMatchObject({ processed: 5, transportAccepted: 5 })
    expect(test.fetcher).toHaveBeenCalledTimes(5)
  })

  it('fails closed before querying when direct-call configuration is invalid', async () => {
    const test = harness()
    await expect(deliverPendingLeads({
      client: test.client, configuration: { ...configuration, webhookUrl: 'http://unsafe.example.test' }, fetcher: test.fetcher,
    })).rejects.toThrow('configuration unavailable')
    expect(test.fetch).not.toHaveBeenCalled()
    expect(test.fetcher).not.toHaveBeenCalled()
  })
})

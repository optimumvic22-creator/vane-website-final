import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  guardJsonRequest,
  MAX_API_JSON_BODY_BYTES,
} from '@/lib/request-guard'

process.env.NEXT_PUBLIC_SANITY_DATASET = 'test'
process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = 'test-project'

const createMock = vi.fn(async (doc: Record<string, unknown>) => ({ _id: 'inquiry-id', ...doc }))
const createIfNotExistsMock = vi.fn(async (doc: Record<string, unknown>) => doc)

vi.mock('next-sanity', () => ({
  createClient: vi.fn(() => ({ create: createMock, createIfNotExists: createIfNotExistsMock })),
}))

const validBody = {
  email: 'coach@example.com',
  audience: 'coach',
  context: 'Performance coach',
  message: 'We use force plates and want a shared team workflow.',
  locale: 'en',
  source: 'audience:coach:final',
}

function makeRequest(
  body: unknown,
  options: {
    contentType?: string
    headers?: Record<string, string>
    rawBody?: string
  } = {},
): Request {
  return new Request('http://localhost/api/inquiry', {
    method: 'POST',
    headers: {
      'content-type': options.contentType ?? 'application/json',
      ...options.headers,
    },
    body: options.rawBody ?? JSON.stringify(body),
  })
}

async function callPost(
  body: unknown,
  options?: Parameters<typeof makeRequest>[1],
) {
  const { POST } = await import('./route')
  return POST(makeRequest(body, options))
}

describe('POST /api/inquiry', () => {
  const originalToken = process.env.SANITY_API_WRITE_TOKEN

  beforeEach(() => {
    createMock.mockReset()
    createIfNotExistsMock.mockReset()
    process.env.SANITY_API_WRITE_TOKEN = 'test-token'
  })

  afterEach(() => {
    if (originalToken === undefined) delete process.env.SANITY_API_WRITE_TOKEN
    else process.env.SANITY_API_WRITE_TOKEN = originalToken
  })

  it('stores a valid inquiry', async () => {
    const response = await callPost(validBody)
    expect(response.status).toBe(200)
    expect(await response.json()).toEqual({ ok: true })
    expect(response.headers.get('cache-control')).toContain('no-store')
    expect(createMock).toHaveBeenCalledTimes(1)
    expect(createMock.mock.calls[0][0]).toMatchObject({
      _id: expect.stringMatching(/^vane\.inquiry\.[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/),
      _type: 'audienceInquiry',
      email: 'coach@example.com',
      audience: 'coach',
      context: 'Performance coach',
      status: 'new',
    })
  })

  it('gives separate inquiries distinct private IDs without exposing them publicly', async () => {
    const responses = await Promise.all([callPost(validBody), callPost(validBody)])
    expect(createMock).toHaveBeenCalledTimes(2)
    const [first, second] = createMock.mock.calls.map(([doc]) => doc)
    expect(first._id).not.toBe(second._id)
    for (const response of responses) {
      expect(response.status).toBe(200)
      expect(await response.json()).toEqual({ ok: true })
    }
  })

  it('atomically reuses one private record and event after a lost response and retry', async () => {
    const records = new Map<string, Record<string, unknown>>()
    createIfNotExistsMock.mockImplementation(async (doc) => {
      const id = String(doc._id)
      if (!records.has(id)) records.set(id, { ...doc })
      return records.get(id)!
    })
    const body = { ...validBody, idempotencyKey: 'a87a66d0-c331-45e7-bafb-9e2cb8155550' }
    const first = await callPost(body)
    expect(first.status).toBe(200)
    // Simulate the request being saved while the response never reaches the form.
    const stored = records.values().next().value!
    stored.deliveryStatus = 'processing'
    stored.deliveryAttempts = 1
    const second = await callPost(body)

    expect(second.status).toBe(200)
    expect(await second.json()).toEqual({ ok: true })
    expect(records.size).toBe(1)
    expect(createMock).not.toHaveBeenCalled()
    expect(createIfNotExistsMock).toHaveBeenCalledTimes(2)
    const [firstDoc, retryDoc] = createIfNotExistsMock.mock.calls.map(([doc]) => doc)
    expect(firstDoc._id).toBe(retryDoc._id)
    expect(firstDoc.deliveryEventId).toBe(retryDoc.deliveryEventId)
    expect(firstDoc._id).toMatch(/^vane\.inquiry\.[a-f0-9]{64}$/)
    expect(String(firstDoc._id)).not.toContain(body.email)
    expect(stored).toMatchObject({ deliveryStatus: 'processing', deliveryAttempts: 1 })
  })

  it('rejects a changed payload under the same key without overwriting the original', async () => {
    let stored: Record<string, unknown> | undefined
    createIfNotExistsMock.mockImplementation(async (doc) => {
      stored ??= { ...doc }
      return stored
    })
    const body = { ...validBody, idempotencyKey: 'ca11ab1e-7539-4501-80be-4c79b560765c' }
    expect((await callPost(body)).status).toBe(200)
    const response = await callPost({ ...body, message: 'A different request.' })

    expect(response.status).toBe(409)
    expect(await response.json()).toMatchObject({ ok: false, code: 'idempotency_conflict' })
    expect(stored?.message).toBe(body.message)
    expect(createMock).not.toHaveBeenCalled()
  })

  it('rejects malformed idempotency keys before any storage call', async () => {
    for (const idempotencyKey of ['reused', '00000000-0000-0000-0000-000000000000', 42]) {
      const response = await callPost({ ...validBody, idempotencyKey })
      expect(response.status).toBe(400)
    }
    expect(createMock).not.toHaveBeenCalled()
    expect(createIfNotExistsMock).not.toHaveBeenCalled()
  })

  it('queues an athlete request without subscribing the athlete to marketing', async () => {
    const response = await callPost({ ...validBody, audience: 'athlete', context: 'Football', message: '' })
    expect(response.status).toBe(200)
    const [doc] = createMock.mock.calls[0]
    expect(doc).toMatchObject({ deliveryStatus: 'pending', deliveryAttempts: 0, deliveryEventId: expect.any(String) })
    expect(doc.message).toBeUndefined()
    expect(doc.updatesConsent).toBeUndefined()
    expect(doc.emailSent).toBeUndefined()
  })

  it('returns a generic error when inquiry storage fails', async () => {
    createMock.mockRejectedValueOnce(new Error('Private provider detail'))
    const response = await callPost(validBody)
    expect(response.status).toBe(500)
    expect(await response.json()).toEqual({
      ok: false,
      code: 'request_failed',
      error: 'Could not send your request. Please try again.',
    })
  })

  it('rejects incomplete or invalid inquiries', async () => {
    const response = await callPost({ ...validBody, email: 'not-an-email' })
    expect(response.status).toBe(400)
    expect(createMock).not.toHaveBeenCalled()
  })

  it('accepts a tripped honeypot without storing the inquiry', async () => {
    const response = await callPost({ ...validBody, company: 'Bot Company' })
    expect(response.status).toBe(200)
    expect(await response.json()).toEqual({ ok: true })
    expect(createMock).not.toHaveBeenCalled()
  })

  it('returns 503 when the write token is missing', async () => {
    delete process.env.SANITY_API_WRITE_TOKEN
    const response = await callPost(validBody)
    expect(response.status).toBe(503)
    expect(JSON.stringify(await response.json())).not.toContain(
      'SANITY_API_WRITE_TOKEN',
    )
    expect(response.headers.get('cache-control')).toContain('no-store')
    expect(createMock).not.toHaveBeenCalled()
  })

  it('requires an application/json content type', async () => {
    const response = await callPost(validBody, { contentType: 'text/plain' })
    expect(response.status).toBe(415)
    expect(response.headers.get('cache-control')).toContain('no-store')
    expect(createMock).not.toHaveBeenCalled()
  })

  it('rejects cross-origin browser requests', async () => {
    const response = await callPost(validBody, {
      headers: {
        origin: 'https://attacker.example',
        'sec-fetch-site': 'cross-site',
      },
    })
    expect(response.status).toBe(403)
    expect(createMock).not.toHaveBeenCalled()
  })

  it('accepts a same-origin request behind a trusted hosting proxy', async () => {
    const result = await guardJsonRequest(
      makeRequest(validBody, {
        headers: {
          host: 'internal-host:3000',
          origin: 'https://preview.vanescience.com',
          'sec-fetch-site': 'same-origin',
          'x-forwarded-host': 'preview.vanescience.com',
          'x-forwarded-proto': 'https',
        },
      }),
    )

    expect(result.ok).toBe(true)
  })

  it('rejects an oversized declared content length before parsing', async () => {
    const response = await callPost(validBody, {
      headers: {
        'content-length': String(MAX_API_JSON_BODY_BYTES + 1),
      },
    })
    expect(response.status).toBe(413)
    expect(createMock).not.toHaveBeenCalled()
  })

  it('rejects an oversized actual body when content length is absent', async () => {
    const response = await callPost(validBody, {
      rawBody: JSON.stringify({ padding: 'x'.repeat(MAX_API_JSON_BODY_BYTES) }),
    })
    expect(response.status).toBe(413)
    expect(createMock).not.toHaveBeenCalled()
  })

  it('rejects malformed JSON', async () => {
    const response = await callPost(validBody, { rawBody: '{"email":' })
    expect(response.status).toBe(400)
    expect(createMock).not.toHaveBeenCalled()
  })

  it('supports a platform rate-limit hook without a process-local fallback', async () => {
    const rateLimit = vi.fn(async () => ({
      allowed: false as const,
      retryAfterSeconds: 60,
    }))
    const result = await guardJsonRequest(makeRequest(validBody), { rateLimit })

    expect(rateLimit).toHaveBeenCalledTimes(1)
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.response.status).toBe(429)
      expect(result.response.headers.get('retry-after')).toBe('60')
      expect(result.response.headers.get('cache-control')).toContain('no-store')
    }
  })
})

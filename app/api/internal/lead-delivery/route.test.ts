import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const { createClientMock, fetchMock, deliverMock } = vi.hoisted(() => ({
  createClientMock: vi.fn(), fetchMock: vi.fn(), deliverMock: vi.fn(),
}))

vi.mock('next-sanity', () => ({ createClient: createClientMock }))
vi.mock('@/lib/lead-delivery', async (importOriginal) => ({
  ...await importOriginal<typeof import('@/lib/lead-delivery')>(),
  deliverPendingLeads: deliverMock,
}))

const jobSecret = 'job-secret-for-route-tests-at-least-32-characters'
const webhookSecret = 'webhook-secret-for-route-tests-at-least-32-characters'
const result = { processed: 2, transportAccepted: 1, retryScheduled: 1, failed: 0, skipped: 0, stateWriteFailed: 0 }

async function callPost(authorization: string | null = `Bearer ${jobSecret}`) {
  const { POST } = await import('./route')
  return POST(new Request('https://website.example.test/api/internal/lead-delivery', {
    method: 'POST',
    headers: authorization ? { Authorization: authorization } : {},
  }))
}

describe('POST /api/internal/lead-delivery', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubEnv('LEAD_DELIVERY_JOB_SECRET', jobSecret)
    vi.stubEnv('LEAD_DELIVERY_WEBHOOK_URL', 'https://bridge.example.test/leads')
    vi.stubEnv('LEAD_DELIVERY_WEBHOOK_SECRET', webhookSecret)
    vi.stubEnv('SANITY_API_WRITE_TOKEN', 'private-test-token')
    vi.stubEnv('NEXT_PUBLIC_SANITY_PROJECT_ID', 'test-project')
    vi.stubEnv('NEXT_PUBLIC_SANITY_DATASET', 'test')
    createClientMock.mockReturnValue({ fetch: fetchMock })
    deliverMock.mockResolvedValue({ ...result })
    // No test may reach an actual network receiver, including regression paths.
    vi.stubGlobal('fetch', vi.fn(() => { throw new Error('Unexpected real network attempt') }))
  })

  afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals() })

  it.each([null, 'Bearer wrong', jobSecret, `Basic ${jobSecret}`])('rejects bad authentication before creating a client (%s)', async (header) => {
    const response = await callPost(header)
    expect(response.status).toBe(401)
    expect(response.headers.get('cache-control')).toContain('no-store')
    expect(createClientMock).not.toHaveBeenCalled()
    expect(deliverMock).not.toHaveBeenCalled()
  })

  it('returns 503 without querying when job authentication is unconfigured', async () => {
    vi.stubEnv('LEAD_DELIVERY_JOB_SECRET', '')
    const response = await callPost()
    expect(response.status).toBe(503)
    expect(createClientMock).not.toHaveBeenCalled()
    expect(deliverMock).not.toHaveBeenCalled()
  })

  it.each(['LEAD_DELIVERY_WEBHOOK_URL', 'LEAD_DELIVERY_WEBHOOK_SECRET', 'SANITY_API_WRITE_TOKEN', 'NEXT_PUBLIC_SANITY_PROJECT_ID', 'NEXT_PUBLIC_SANITY_DATASET'])('fails closed when %s is missing', async (key) => {
    vi.stubEnv(key, '')
    const response = await callPost()
    expect(response.status).toBe(503)
    expect(createClientMock).not.toHaveBeenCalled()
    expect(deliverMock).not.toHaveBeenCalled()
  })

  it('rejects non-HTTPS receiver configuration before reading leads', async () => {
    vi.stubEnv('LEAD_DELIVERY_WEBHOOK_URL', 'http://bridge.example.test/leads')
    expect((await callPost()).status).toBe(503)
    expect(createClientMock).not.toHaveBeenCalled()
  })

  it('uses an authenticated uncached client and exposes counts only', async () => {
    const response = await callPost()
    expect(response.status).toBe(200)
    expect(await response.json()).toEqual({ ok: true, ...result })
    expect(createClientMock).toHaveBeenCalledWith(expect.objectContaining({
      token: 'private-test-token', useCdn: false, perspective: 'raw', timeout: 10_000, maxRetries: 0,
    }))
    expect(deliverMock).toHaveBeenCalledWith({
      client: expect.any(Object), configuration: { webhookUrl: 'https://bridge.example.test/leads', webhookSecret },
    })
  })

  it('returns a generic 503 when Sanity or worker execution fails', async () => {
    deliverMock.mockRejectedValueOnce(new Error('lead@example.test private provider credentials'))
    const response = await callPost()
    expect(response.status).toBe(503)
    const body = JSON.stringify(await response.json())
    expect(body).not.toContain('lead@example.test')
    expect(body).not.toContain('credentials')
    expect(response.headers.get('cache-control')).toContain('no-store')
  })

  it('surfaces state-write failures for scheduler alerts without leaking lead data', async () => {
    deliverMock.mockResolvedValueOnce({ ...result, stateWriteFailed: 1 })
    const response = await callPost()
    expect(response.status).toBe(503)
    expect(await response.json()).toEqual({ ok: false, ...result, stateWriteFailed: 1 })
  })
})

import { createHash } from 'node:crypto'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// The route imports `@/sanity/env`, which throws unless these are present.
process.env.NEXT_PUBLIC_SANITY_DATASET = 'test'
process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = 'test-project'

// Mock the Sanity write client so no network is ever hit. `fetch` returns null
// (no existing signup → the route creates one atomically).
const fetchMock = vi.fn(async (): Promise<string | null> => null)
const createIfNotExistsMock = vi.fn(async (doc: Record<string, unknown>) => doc)
const commitMock = vi.fn(async () => ({}))
const setMock = vi.fn()
const patchChain = {
  ifRevisionId: vi.fn(), set: setMock, unset: vi.fn(), commit: commitMock,
}
const patchMock = vi.fn(() => patchChain)

vi.mock('next-sanity', () => ({
  createClient: vi.fn(() => ({ fetch: fetchMock, createIfNotExists: createIfNotExistsMock, patch: patchMock })),
}))

function makeRequest(body: unknown): Request {
  return new Request('http://localhost/api/waitlist', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })
}

async function callPost(body: unknown) {
  const { POST } = await import('./route')
  return POST(makeRequest(body))
}

describe('POST /api/waitlist', () => {
  const originalToken = process.env.SANITY_API_WRITE_TOKEN

  beforeEach(() => {
    fetchMock.mockReset()
    createIfNotExistsMock.mockReset()
    createIfNotExistsMock.mockImplementation(async (doc) => ({ ...doc, _rev: 'new-rev' }))
    patchMock.mockClear()
    patchChain.ifRevisionId.mockReset().mockReturnValue(patchChain)
    setMock.mockReset().mockReturnValue(patchChain)
    patchChain.unset.mockReset().mockReturnValue(patchChain)
    commitMock.mockReset().mockResolvedValue({})
    process.env.SANITY_API_WRITE_TOKEN = 'test-token'
  })

  afterEach(() => {
    if (originalToken === undefined) delete process.env.SANITY_API_WRITE_TOKEN
    else process.env.SANITY_API_WRITE_TOKEN = originalToken
  })

  it('stores a valid signup and returns ok', async () => {
    const res = await callPost({ email: 'athlete@example.com', segment: 'individual' })
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ ok: true })
    expect(createIfNotExistsMock).toHaveBeenCalledTimes(1)
    expect(createIfNotExistsMock.mock.calls[0][0]).toMatchObject({
      _id: `vane.waitlist.${createHash('sha256').update('athlete@example.com').digest('hex')}`,
      _type: 'waitlistSignup',
      email: 'athlete@example.com',
      segment: 'individual',
    })
  })

  it('rejects an invalid email with 400 and stores nothing', async () => {
    const res = await callPost({ email: 'not-an-email' })
    expect(res.status).toBe(400)
    expect((await res.json()).ok).toBe(false)
    expect(createIfNotExistsMock).not.toHaveBeenCalled()
  })

  it('rejects an invalid segment with 400', async () => {
    const res = await callPost({ email: 'a@b.com', segment: 'enterprise' })
    expect(res.status).toBe(400)
    expect(createIfNotExistsMock).not.toHaveBeenCalled()
  })

  it('treats a tripped honeypot as success but stores nothing', async () => {
    const res = await callPost({ email: 'a@b.com', company: 'AcmeBot' })
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ ok: true })
    expect(createIfNotExistsMock).not.toHaveBeenCalled()
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('returns 503 when SANITY_API_WRITE_TOKEN is unset', async () => {
    delete process.env.SANITY_API_WRITE_TOKEN
    const res = await callPost({ email: 'a@b.com' })
    expect(res.status).toBe(503)
    expect((await res.json()).ok).toBe(false)
    expect(createIfNotExistsMock).not.toHaveBeenCalled()
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('preserves legacy deduplication without rewriting existing documents', async () => {
    fetchMock.mockResolvedValueOnce('existing-id')
    const res = await callPost({ email: 'dupe@example.com' })
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ ok: true })
    expect(createIfNotExistsMock).not.toHaveBeenCalled()
    expect(fetchMock).toHaveBeenCalledWith(
      '*[_type == "waitlistSignup" && email == $email][0]._id',
      { email: 'dupe@example.com' },
    )
  })

  it('atomically deduplicates concurrent normalized emails using one private ID', async () => {
    const documents = new Map<string, Record<string, unknown>>()
    createIfNotExistsMock.mockImplementation(async (doc) => {
      if (typeof doc._id !== 'string') throw new Error('Document ID is required')
      if (!documents.has(doc._id)) documents.set(doc._id, doc)
      return documents.get(doc._id)!
    })

    // Both lookups miss, simulating concurrent requests or stale query results.
    const responses = await Promise.all([
      callPost({ email: 'Athlete@Example.com' }),
      callPost({ email: 'athlete@example.com' }),
    ])

    expect(responses.map((response) => response.status)).toEqual([200, 200])
    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(createIfNotExistsMock).toHaveBeenCalledTimes(2)
    expect(documents.size).toBe(1)
    const [first, second] = createIfNotExistsMock.mock.calls.map(([doc]) => doc)
    expect(first._id).toMatch(/^vane\.waitlist\.[a-f0-9]{64}$/)
    expect(first._id).toBe(second._id)
    expect(first.email).toBe('athlete@example.com')
    expect(first._id).not.toContain('athlete@example.com')
  })

  it('uses different private IDs for different email addresses', async () => {
    await callPost({ email: 'first@example.com' })
    await callPost({ email: 'second@example.com' })
    const [first, second] = createIfNotExistsMock.mock.calls.map(([doc]) => doc)
    expect(first._id).not.toBe(second._id)
  })

  it('returns a generic error when the atomic write fails', async () => {
    createIfNotExistsMock.mockRejectedValueOnce(new Error('Private provider detail'))
    const response = await callPost({ email: 'athlete@example.com' })
    expect(response.status).toBe(500)
    expect(await response.json()).toEqual({
      ok: false,
      code: 'request_failed',
      error: 'Could not save your signup. Please try again.',
    })
  })

  it('stores Vault roles separately with no implicit mailing permission', async () => {
    await callPost({ email: 'Person@example.com', segment: 'coach', locale: 'de' })
    await callPost({ email: 'person@example.com', segment: 'partner' })
    const [coach, partner] = createIfNotExistsMock.mock.calls.map(([doc]) => doc)
    expect(coach._id).not.toBe(partner._id)
    expect(coach).toMatchObject({ product: 'mqs-vault', status: 'waiting', updatesConsent: false, deliveryStatus: 'pending', deliveryAttempts: 0 })
    expect(coach.updatesConsentAt).toBeUndefined()
    expect(coach.deliveryEventId).toEqual(expect.any(String))
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('records exact versioned consent but never marks it confirmed', async () => {
    await callPost({ email: 'coach@example.com', segment: 'coach', locale: 'de', updatesConsent: true })
    const [doc] = createIfNotExistsMock.mock.calls[0]
    expect(doc).toMatchObject({ updatesConsent: true, updatesConsentVersion: 'mqs-updates-v2', updatesConsentText: 'Ich möchte auch per E Mail über die Entwicklung und den Zugang zu MQS informiert werden. Ich kann mich jederzeit abmelden.', updatesConsentAt: expect.any(String) })
    expect(doc.updatesConfirmedAt).toBeUndefined()
  })

  it('records a later opt-in with a revision lock and a new delivery event', async () => {
    createIfNotExistsMock.mockResolvedValueOnce({ _id: 'vane.waitlist.existing', _rev: 'old-rev', updatesConsent: false })
    await callPost({ email: 'coach@example.com', segment: 'coach', updatesConsent: true })
    expect(patchChain.ifRevisionId).toHaveBeenCalledWith('old-rev')
    expect(setMock).toHaveBeenCalledWith(expect.objectContaining({ updatesConsent: true, deliveryStatus: 'pending', deliveryEventId: expect.any(String) }))
    expect(commitMock).toHaveBeenCalledOnce()
  })

  it('does not resend or revoke an existing opt-in on repeat submissions', async () => {
    createIfNotExistsMock.mockResolvedValue({ _id: 'vane.waitlist.existing', _rev: 'old-rev', updatesConsent: true })
    await callPost({ email: 'coach@example.com', segment: 'coach', updatesConsent: true })
    await callPost({ email: 'coach@example.com', segment: 'coach', updatesConsent: false })
    expect(patchMock).not.toHaveBeenCalled()
  })

  it('does not claim success after a conflicting consent update', async () => {
    createIfNotExistsMock.mockResolvedValueOnce({ _id: 'vane.waitlist.existing', _rev: 'old-rev', updatesConsent: false })
    commitMock.mockRejectedValueOnce(new Error('revision conflict'))
    expect((await callPost({ email: 'coach@example.com', segment: 'coach', updatesConsent: true })).status).toBe(500)
  })
})

import { afterEach, describe, expect, it, vi } from 'vitest'
import { WAITLIST_TIMEOUT_MS, WaitlistTimeoutError, submitWaitlist } from './waitlist-request'

const signup = {
  email: 'coach@example.com',
  segment: 'coach' as const,
  locale: 'en' as const,
  source: 'audience:coach:final',
  updatesConsent: false,
  company: '',
}

afterEach(() => {
  vi.unstubAllGlobals()
  vi.useRealTimers()
})

describe('submitWaitlist', () => {
  it.each([false, true])('preserves the exact waitlist payload with updatesConsent=%s', async (updatesConsent) => {
    vi.useFakeTimers()
    const fetchMock = vi.fn().mockResolvedValue(Response.json({ ok: true }))
    vi.stubGlobal('fetch', fetchMock)
    const payload = { ...signup, updatesConsent }

    await expect(submitWaitlist(payload)).resolves.toBeUndefined()

    expect(fetchMock).toHaveBeenCalledExactlyOnceWith('/api/waitlist', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
      signal: expect.any(AbortSignal),
    })
    expect(vi.getTimerCount()).toBe(0)
  })

  it('supports the partner segment without organization or message fields', async () => {
    const fetchMock = vi.fn().mockResolvedValue(Response.json({ ok: true }))
    vi.stubGlobal('fetch', fetchMock)
    const payload = { ...signup, segment: 'partner' as const, source: 'audience:partner:final' }
    await expect(submitWaitlist(payload)).resolves.toBeUndefined()
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual(payload)
  })

  it.each([400, 500, 503])('rejects HTTP %i and clears the timer', async (status) => {
    vi.useFakeTimers()
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(null, { status })))
    await expect(submitWaitlist(signup)).rejects.toThrow('request_failed')
    expect(vi.getTimerCount()).toBe(0)
  })

  it.each([{ ok: false }, {}, null])('does not claim success without an explicit acknowledgement: %s', async (body) => {
    vi.useFakeTimers()
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json(body)))
    await expect(submitWaitlist(signup)).rejects.toThrow('confirmation_unavailable')
    expect(vi.getTimerCount()).toBe(0)
  })

  it('preserves network failures without leaving a timer', async () => {
    vi.useFakeTimers()
    const failure = new TypeError('Failed to fetch')
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(failure))
    await expect(submitWaitlist(signup)).rejects.toBe(failure)
    expect(vi.getTimerCount()).toBe(0)
  })

  it('aborts a stalled request after 15 seconds and uses a fresh signal on retry', async () => {
    vi.useFakeTimers()
    let firstSignal: AbortSignal | undefined
    const fetchMock = vi.fn()
      .mockImplementationOnce((_url: string, options: RequestInit) => {
        firstSignal = options.signal as AbortSignal
        return new Promise<Response>((_resolve, reject) => {
          firstSignal?.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')))
        })
      })
      .mockResolvedValueOnce(Response.json({ ok: true }))
    vi.stubGlobal('fetch', fetchMock)

    const rejection = expect(submitWaitlist(signup)).rejects.toBeInstanceOf(WaitlistTimeoutError)
    await vi.advanceTimersByTimeAsync(WAITLIST_TIMEOUT_MS - 1)
    expect(firstSignal?.aborted).toBe(false)
    await vi.advanceTimersByTimeAsync(1)
    await rejection
    expect(firstSignal?.aborted).toBe(true)
    expect(vi.getTimerCount()).toBe(0)

    await expect(submitWaitlist(signup)).resolves.toBeUndefined()
    const nextSignal = fetchMock.mock.calls[1][1].signal as AbortSignal
    expect(nextSignal).not.toBe(firstSignal)
    expect(nextSignal.aborted).toBe(false)
    expect(vi.getTimerCount()).toBe(0)
  })
})

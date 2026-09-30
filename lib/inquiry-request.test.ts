import { afterEach, describe, expect, it, vi } from 'vitest'
import { INQUIRY_TIMEOUT_MS, InquiryTimeoutError, submitInquiry } from './inquiry-request'

const inquiry = {
  audience: 'athlete' as const,
  locale: 'en' as const,
  source: 'audience:athlete:final',
  email: 'athlete@example.com',
  context: 'Football',
  message: 'I would like an assessment.',
  company: '',
}

afterEach(() => {
  vi.unstubAllGlobals()
  vi.useRealTimers()
})

describe('submitInquiry', () => {
  it('preserves the inquiry endpoint and JSON payload and clears its timer on success', async () => {
    vi.useFakeTimers()
    const fetchMock = vi.fn().mockResolvedValue(Response.json({ ok: true }))
    vi.stubGlobal('fetch', fetchMock)

    await expect(submitInquiry(inquiry)).resolves.toBeUndefined()

    expect(fetchMock).toHaveBeenCalledWith('/api/inquiry', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(inquiry),
      signal: expect.any(AbortSignal),
    })
    expect(vi.getTimerCount()).toBe(0)
  })

  it.each([400, 500, 503])('rejects HTTP %i without leaving a pending timer', async (status) => {
    vi.useFakeTimers()
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(null, { status })))

    await expect(submitInquiry(inquiry)).rejects.toThrow('request_failed')
    expect(vi.getTimerCount()).toBe(0)
  })

  it('preserves network errors and clears the timeout', async () => {
    vi.useFakeTimers()
    const failure = new TypeError('Failed to fetch')
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(failure))

    await expect(submitInquiry(inquiry)).rejects.toBe(failure)
    expect(vi.getTimerCount()).toBe(0)
  })

  it.each([{ ok: false }, {}, null, { ok: 'true' }, { ok: 1 }, []])(
    'requires an explicit storage acknowledgement: %j', async (body) => {
      vi.useFakeTimers()
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json(body)))

      await expect(submitInquiry(inquiry)).rejects.toThrow('confirmation_unavailable')
      expect(vi.getTimerCount()).toBe(0)
    },
  )

  it.each(['', '<html>Service unavailable</html>', '{"ok":'])(
    'rejects an invalid confirmation body despite HTTP 200: %s', async (body) => {
      vi.useFakeTimers()
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(body, { status: 200 })))

      await expect(submitInquiry(inquiry)).rejects.toThrow()
      expect(vi.getTimerCount()).toBe(0)
    },
  )

  it('keeps the timeout active until the confirmation body is read', async () => {
    vi.useFakeTimers()
    vi.stubGlobal('fetch', vi.fn((_url: string, options: RequestInit) => Promise.resolve({
      ok: true,
      json: () => new Promise((_resolve, reject) => {
        options.signal?.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')))
      }),
    })))

    const rejection = expect(submitInquiry(inquiry)).rejects.toBeInstanceOf(InquiryTimeoutError)
    await vi.advanceTimersByTimeAsync(INQUIRY_TIMEOUT_MS)
    await rejection
    expect(vi.getTimerCount()).toBe(0)
  })

  it('aborts a stalled request and allows a later submission with a fresh signal', async () => {
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

    const rejection = expect(submitInquiry(inquiry)).rejects.toBeInstanceOf(InquiryTimeoutError)
    await vi.advanceTimersByTimeAsync(INQUIRY_TIMEOUT_MS - 1)
    expect(firstSignal?.aborted).toBe(false)
    await vi.advanceTimersByTimeAsync(1)
    await rejection
    expect(firstSignal?.aborted).toBe(true)
    expect(vi.getTimerCount()).toBe(0)

    await expect(submitInquiry(inquiry)).resolves.toBeUndefined()
    const nextSignal = fetchMock.mock.calls[1][1].signal as AbortSignal
    expect(nextSignal).not.toBe(firstSignal)
    expect(nextSignal.aborted).toBe(false)
    expect(vi.getTimerCount()).toBe(0)
  })
})

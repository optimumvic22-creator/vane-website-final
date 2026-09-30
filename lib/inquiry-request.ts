import type { InquiryInput } from './inquiry-schema'

export const INQUIRY_TIMEOUT_MS = 15_000

export class InquiryTimeoutError extends Error {
  constructor() {
    super('inquiry_timeout')
    this.name = 'InquiryTimeoutError'
  }
}

/** A timeout stops waiting; it cannot confirm whether the server stored the inquiry. */
export async function submitInquiry(payload: InquiryInput): Promise<void> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), INQUIRY_TIMEOUT_MS)

  try {
    const response = await fetch('/api/inquiry', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    })

    if (!response.ok) throw new Error('request_failed')

    // HTTP success alone is not confirmation that the inquiry was stored.
    // A proxy or misconfigured endpoint may return HTML or an empty 200 body.
    const result: unknown = await response.json()
    if (!result || typeof result !== 'object' || !('ok' in result) || result.ok !== true) {
      throw new Error('confirmation_unavailable')
    }
  } catch (error) {
    if (controller.signal.aborted) throw new InquiryTimeoutError()
    throw error
  } finally {
    clearTimeout(timeout)
  }
}

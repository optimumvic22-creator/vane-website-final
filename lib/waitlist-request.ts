import type { WaitlistInput } from './waitlist-schema'

export const WAITLIST_TIMEOUT_MS = 15_000

export class WaitlistTimeoutError extends Error {
  constructor() {
    super('waitlist_timeout')
    this.name = 'WaitlistTimeoutError'
  }
}

/** Aborting the wait cannot prove whether the server already saved the signup. */
export async function submitWaitlist(payload: WaitlistInput): Promise<void> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), WAITLIST_TIMEOUT_MS)

  try {
    const response = await fetch('/api/waitlist', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    })
    if (!response.ok) throw new Error('request_failed')

    const result: unknown = await response.json()
    if (!result || typeof result !== 'object' || !('ok' in result) || result.ok !== true) {
      throw new Error('confirmation_unavailable')
    }
  } catch (error) {
    if (controller.signal.aborted) throw new WaitlistTimeoutError()
    throw error
  } finally {
    clearTimeout(timeout)
  }
}

import { describe, it, expect } from 'vitest'
import { parseWaitlistInput } from './waitlist-schema'

describe('parseWaitlistInput', () => {
  it('accepts a valid minimal payload (email only)', () => {
    const result = parseWaitlistInput({ email: 'athlete@example.com' })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.email).toBe('athlete@example.com')
      // Optional fields stay undefined rather than being invented.
      expect(result.data.segment).toBeUndefined()
    }
  })

  it('accepts a full valid payload with every optional field', () => {
    const result = parseWaitlistInput({
      email: 'coach@example.com',
      segment: 'gym-clinic',
      locale: 'de',
      source: 'hero',
      company: '',
    })
    expect(result.success).toBe(true)
  })

  it('rejects an invalid email address', () => {
    const result = parseWaitlistInput({ email: 'not-an-email' })
    expect(result.success).toBe(false)
  })

  it('rejects a missing email', () => {
    const result = parseWaitlistInput({ segment: 'individual' })
    expect(result.success).toBe(false)
  })

  it('rejects an unknown segment value', () => {
    const result = parseWaitlistInput({ email: 'a@b.com', segment: 'enterprise' })
    expect(result.success).toBe(false)
  })

  it('accepts legacy and MQS Vault audience segments', () => {
    for (const segment of ['individual', 'gym-clinic', 'federation', 'coach', 'partner'] as const) {
      expect(parseWaitlistInput({ email: 'a@b.com', segment }).success).toBe(true)
    }
  })

  it('never invents update consent and rejects coerced consent', () => {
    const result = parseWaitlistInput({ email: 'a@b.com', segment: 'coach' })
    expect(result.success && result.data.updatesConsent).toBe(false)
    expect(parseWaitlistInput({ email: 'a@b.com', updatesConsent: 'true' }).success).toBe(false)
  })

  it('preserves the honeypot field so the route can detect bots', () => {
    const result = parseWaitlistInput({ email: 'a@b.com', company: 'AcmeBot' })
    expect(result.success).toBe(true)
    if (result.success) expect(result.data.company).toBe('AcmeBot')
  })
})

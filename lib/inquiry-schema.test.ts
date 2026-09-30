import { describe, expect, it } from 'vitest'
import { parseInquiryInput } from './inquiry-schema'

const validInquiry = {
  email: 'athlete@example.com',
  audience: 'athlete',
  context: 'Football',
  message: 'I want to understand my movement profile.',
}

describe('parseInquiryInput', () => {
  it('accepts a complete audience inquiry', () => {
    const result = parseInquiryInput({
      ...validInquiry,
      locale: 'en',
      source: 'audience:athlete:final',
      company: '',
    })
    expect(result.success).toBe(true)
  })

  it('trims the context and message', () => {
    const result = parseInquiryInput({
      ...validInquiry,
      context: '  Football  ',
      message: '  Baseline assessment  ',
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.context).toBe('Football')
      expect(result.data.message).toBe('Baseline assessment')
    }
  })

  it('requires a sport but permits an optional athlete message', () => {
    expect(parseInquiryInput({ ...validInquiry, context: '' }).success).toBe(false)
    expect(parseInquiryInput({ ...validInquiry, message: '' }).success).toBe(true)
    expect(parseInquiryInput({ ...validInquiry, message: undefined }).success).toBe(true)
    expect(parseInquiryInput({ ...validInquiry, audience: 'coach', message: '' }).success).toBe(false)
  })

  it('rejects unknown audiences and overlong messages', () => {
    expect(parseInquiryInput({ ...validInquiry, audience: 'investor' }).success).toBe(false)
    expect(parseInquiryInput({ ...validInquiry, message: 'x'.repeat(601) }).success).toBe(false)
  })
})

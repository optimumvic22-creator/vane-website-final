import { describe, expect, it } from 'vitest'
import { validateInquiryFields } from './inquiry-field-validation'

describe('inquiry field guidance', () => {
  it.each(['', '  ', ' a ', '\t\n'])('rejects blank or short normalized context: %j', (context) => {
    expect(validateInquiryFields(context, '', 'athlete', 'en')?.field).toBe('context')
  })
  it('gives specific German sport guidance', () => {
    expect(validateInquiryFields('  ', '', 'athlete', 'de')?.message).toBe('Bitte gib deine Sportart an.')
  })
  it('accepts padded sport and optional athlete message', () => {
    expect(validateInquiryFields('  Football  ', ' ', 'athlete', 'en')).toBeNull()
  })
  it('keeps required messages for other inquiry audiences', () => {
    expect(validateInquiryFields('Club', '  ', 'coach', 'en')?.field).toBe('message')
    expect(validateInquiryFields('Club', 'Team testing', 'partner', 'de')).toBeNull()
  })
})

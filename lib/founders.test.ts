import { describe, it, expect } from 'vitest'
import { FOUNDERS, type Founder } from './founders'

/** Every FounderText field must exist in both languages (EN/DE parity). */
function assertBilingual(text: { en: string; de: string } | undefined) {
  if (!text) return
  expect(text.en.length).toBeGreaterThan(0)
  expect(text.de.length).toBeGreaterThan(0)
}

describe('FOUNDERS', () => {
  it('exposes Dario as the founder with the canonical name', () => {
    expect(FOUNDERS.dario.name).toBe('Dario Saisan')
    expect(FOUNDERS.dario.role.en).toBe('Founder')
    expect(FOUNDERS.dario.role.de).toBe('Gründer')
    expect(FOUNDERS.dario.isPlaceholder).toBe(false)
    expect(FOUNDERS.dario.linkedinUrl).toMatch(/^https:\/\/www\.linkedin\.com\//)
  })

  it('exposes Marko as CEO with a bilingual profile', () => {
    expect(FOUNDERS.marko.name).toBe('Marko Rados')
    expect(FOUNDERS.marko.role.en).toBe('CEO')
    expect(FOUNDERS.marko.role.de).toBe('CEO')
    expect(FOUNDERS.marko.isPlaceholder).toBe(false)
    assertBilingual(FOUNDERS.marko.bio)
  })

  it('keeps the CTO as an unannounced placeholder', () => {
    expect(FOUNDERS.cto.isPlaceholder).toBe(true)
    // A placeholder must not leak a real name or LinkedIn URL.
    expect(FOUNDERS.cto.linkedinUrl).toBeUndefined()
    expect(FOUNDERS.cto.role.en).toBe('Announcement follows')
    expect(FOUNDERS.cto.role.de).toBe('Ankündigung folgt')
  })

  it('provides EN/DE parity for every founder text field', () => {
    for (const founder of Object.values(FOUNDERS) as Founder[]) {
      assertBilingual(founder.role)
      assertBilingual(founder.bio)
      assertBilingual(founder.contribution)
      founder.credentials?.forEach(assertBilingual)
    }
  })
})

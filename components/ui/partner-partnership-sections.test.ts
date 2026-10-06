import { readFileSync, existsSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { partnerPartnershipSections } from './partner-partnership-sections'

describe('partner briefing sections', () => {
  it.each(['en', 'de'] as const)('provides three compact, anchored %s sections with real local media', (locale) => {
    const sections = partnerPartnershipSections[locale]
    expect(sections.map(({ id }) => id)).toEqual(['mqs-setup', 'partner-support', 'data-partnership'])
    for (const section of sections) {
      expect(section.eyebrow).toBeTruthy()
      expect(section.title).toBeTruthy()
      expect(section.body.length).toBeLessThan(400)
      expect(section.body).not.toMatch(/[\u2013\u2014]|MQS Vault|Pilotieren/)
      if (section.image) {
        expect(section.image.alt).toBeTruthy()
        expect(existsSync(new URL(`../../public${section.image.src}`, import.meta.url))).toBe(true)
      }
    }
    expect(sections[2].body).toContain('NormVault')
    expect(sections[2].image).toBeNull()
  })

  it('does not introduce new forms, CTAs, animation or artificial score claims', () => {
    const source = readFileSync(new URL('./partner-partnership-sections.tsx', import.meta.url), 'utf8')
    expect(source).not.toMatch(/<button|<form|<a\s|<h1|setInterval|requestAnimationFrame/)
    expect(source).toContain('aria-hidden="true" viewBox="0 0 600 400"')
    expect(source).toContain('object-contain')
  })

  it('only inserts the new sections on the partner page, before existing benefits', () => {
    const renderer = readFileSync(new URL('../../app/for/[audience]/audience-landing.tsx', import.meta.url), 'utf8')
    const insert = "{audience === 'partner' && <PartnerPartnershipSections locale={locale} />}"
    expect(renderer).toContain(insert)
    expect(renderer.indexOf(insert)).toBeLessThan(renderer.indexOf('id="benefits"'))
  })
})

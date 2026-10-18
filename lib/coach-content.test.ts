import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { coachContent } from './coach-content'
import { coachCompactCopy } from './coach-compact'
import { MQS_DOMAIN_ORDER } from './mqs-interaction'
import { CoachScore } from '../components/coach/coach-score'
import { CoachHero } from '../components/coach/coach-hero'
import { coachIntroduction } from './coach-introduction'

function shape(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(shape)
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([k,v]) => [k,shape(v)]))
  return typeof value
}

describe('approved coach landing copy', () => {
  it('has complete German copy for every English field and all 12 FAQ answers', () => {
    expect(shape(coachContent.de)).toEqual(shape(coachContent.en))
    expect(coachContent.en.sections.faq.cards).toHaveLength(12)
    for (const copy of Object.values(coachContent)) {
      expect(Object.keys(copy.sections)).toHaveLength(6) // detailed copy stays in compact sections and disclosures
      for (const section of Object.values(copy.sections)) {
        expect(section.title.trim()).not.toBe('')
        expect(section.eyebrow.trim()).not.toBe('')
        for (const card of section.cards) {
          expect(card.title.trim()).not.toBe('')
          expect(card.description.trim()).not.toBe('')
        }
      }
    }
  })
  it('replaces development promises with approved product copy and one prototype caption', () => {
    expect(JSON.stringify(coachContent)).not.toMatch(/still in development|coming soon|plan to build|noch in Entwicklung|bald verfügbar/i)
    expect(coachContent.en.ui.prototype).toBe('Preliminary prototype shown. Not the finished software.')
    expect(coachContent.de.ui.prototype).toBe('Vorläufiger Prototyp. Nicht die fertige Software.')
    expect(coachCompactCopy.en.headline).toBe('Your phone is all you need to start understanding movement.')
    expect(coachCompactCopy.en.finalText).toContain('Join the waitlist')
  })
  it.each(['en', 'de'] as const)('renders domains in the binding web-contract order in %s', locale => {
    expect(MQS_DOMAIN_ORDER).toEqual(['GAIT','POST','FORCE','POWER','MOTOR','NEURO','DTC'])
    const copy = coachContent[locale]
    const html = renderToStaticMarkup(createElement(CoachScore, { locale }))
    const domains = [...html.matchAll(/data-domain="([^"]+)"/g)].map(m => m[1])
    expect(domains).toEqual(MQS_DOMAIN_ORDER)
    expect(copy.ui.domainNames).toHaveLength(MQS_DOMAIN_ORDER.length)
  })
  it.each(['en', 'de'] as const)('links the hero to equipment and keeps MQS in its own section in %s', locale => {
    const hero = renderToStaticMarkup(createElement(CoachHero, { copy: coachContent[locale], locale }))
    expect(hero).toContain('href="#benefits"')
    expect(hero).toContain(coachIntroduction[locale].setupCta)
    expect(hero).toContain('NormVault')
    expect(hero).not.toContain('type="range"')
    const score = renderToStaticMarkup(createElement(CoachScore, { locale }))
    expect([...score.matchAll(/type="range"/g)]).toHaveLength(8)
    expect([...score.matchAll(/class="mqs-domain-info"/g)]).toHaveLength(7)
    const profile = score.match(/<polygon[^>]*fill="url\(#mqs-profile-fill\)"[^>]*>/)?.[0]
    expect(profile).toMatch(/\bpoints="[^\"]+"/)
  })
})

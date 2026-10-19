'use client'

import Image from 'next/image'
import { ArrowDown, ArrowUpRight } from 'lucide-react'
import { Container } from '@/components/ui/container'
import { coachIntroduction } from '@/lib/coach-introduction'
import { coachCompactCopy } from '@/lib/coach-compact'
import { trackEvent } from '@/lib/analytics'
import type { Locale } from '@/lib/locale'
import type { CoachProps } from './coach-primitives'
import { CoachMotionToggle } from './coach-details'

export function CoachHero({ copy, locale }: CoachProps & { locale: Locale }) {
  const ui = coachIntroduction[locale]
  const audience = coachCompactCopy[locale]
  const [beforeNormvault, afterNormvault] = ui.intro.split('NormVault')
  const trackCta = (location: string) =>
    trackEvent('audience_cta_click', { audience: 'coach', location })
  return (
    <section id="for-whom" className="coach-hero" aria-labelledby="coach-hero-heading">
      <Container className="coach-intro-container">
        <div className="coach-hero-grid">
          <div className="coach-hero-copy">
            <p className="coach-hero-eyebrow"><span aria-hidden="true" />{audience.eyebrow}</p>
            <h1 id="coach-hero-heading">
              {ui.headline.map((line, index) => (
                <span key={line}>{index > 0 && <br />}{line}</span>
              ))}
            </h1>
            <p className="coach-hero-intro">{beforeNormvault}<strong>NormVault</strong>{afterNormvault}</p>
            <div className="coach-hero-actions">
              <a className="coach-hero-cta coach-hero-cta-primary" href="#waitlist" onClick={() => trackCta('hero_primary')}>
                {audience.primaryCta}<ArrowUpRight size={18} aria-hidden="true" />
              </a>
              <a className="coach-hero-cta coach-hero-cta-secondary" href="#benefits" onClick={() => trackCta('hero_secondary')}>
                {ui.setupCta}<ArrowDown size={16} aria-hidden="true" />
              </a>
            </div>
          </div>
          <figure className="coach-hero-photo">
            <Image src="/audiences/athlete-training-lab-jump.webp" alt={ui.researchAlt} fill sizes="(max-width: 760px) calc(100vw - 40px), (max-width: 1100px) 44vw, 600px" preload />
            <div className="coach-hero-motion"><CoachMotionToggle copy={copy} /></div>
            <figcaption className="coach-research-caption">
              <span className="coach-research-year">2020</span>
              <p>{ui.researchTitle}</p>
              <span className="coach-research-description">{ui.researchDescription}</span>
            </figcaption>
          </figure>
        </div>
      </Container>
    </section>
  )
}

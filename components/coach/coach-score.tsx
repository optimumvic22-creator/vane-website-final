'use client'

import { useState } from 'react'
import { DOMAIN_COLORS } from '@/lib/domain-colors'
import { coachIntroduction } from '@/lib/coach-introduction'
import type { MqsDomainCode } from '@/lib/mqs-interaction'
import type { Locale } from '@/lib/locale'
import { Container } from '@/components/ui/container'
import { MqsDashboard } from '@/components/ui/mqs-dashboard'

export function CoachScore({ locale }: { locale: Locale }) {
  const ui = coachIntroduction[locale]
  const [activeDomain, setActiveDomain] = useState<MqsDomainCode>('GAIT')
  const explanation = ui.domains[activeDomain]
  return (
    <section id="score" aria-labelledby="score-heading" className="coach-score-section">
      <Container className="coach-intro-container">
        <div className="coach-score-grid">
          <div className="coach-score-copy">
            <h2 id="score-heading">
              {ui.scoreTitle.map((line, index) => (
                <span key={line}>{index > 0 && <br />}{line}</span>
              ))}
            </h2>
            <p className="coach-score-subtitle">{ui.scoreSubtitle}</p>
            <aside
              className="coach-domain-explanation"
              aria-label={locale === 'de' ? 'Erklärung der ausgewählten Domäne' : 'Selected domain explanation'}
              style={{ borderColor: DOMAIN_COLORS[activeDomain] }}
            >
              <h3 style={{ color: DOMAIN_COLORS[activeDomain] }}>{explanation.name}</h3>
              <p>{explanation.description}</p>
            </aside>
          </div>
          <div className="coach-score-panel">
            <MqsDashboard
              variant="audience"
              audience="coach"
              locale={locale}
              initialMediaDomain="GAIT"
              domainExplanations={ui.domains}
              onDomainSelect={setActiveDomain}
            />
          </div>
        </div>
      </Container>
    </section>
  )
}

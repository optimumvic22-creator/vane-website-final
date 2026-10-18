'use client'
import { useLocale } from '@/lib/locale'
import { coachContent } from '@/lib/coach-content'
import { coachCompactCopy } from '@/lib/coach-compact'
import { CoachTour } from '@/components/coach/coach-tour'
import { CoachScore } from '@/components/coach/coach-score'
import { CoachSetup } from '@/components/coach/coach-setup'
import { CoachHero } from '@/components/coach/coach-hero'
import { CoachNormvault } from '@/components/coach/coach-normvault'
import { CoachReport } from '@/components/coach/coach-report'
import {
  CoachFaq,
  CoachInterpretation,
} from '@/components/coach/coach-details'
import { useCoachReducedMotion } from '@/components/coach/coach-primitives'
import { AudienceLanding } from './audience-landing'
import './coach-landing.css'
export function CoachLanding() {
  const { locale } = useLocale(),
    copy = coachContent[locale],
    reduced = useCoachReducedMotion()
  return (
    <div className="coach-landing" data-reduced-motion={reduced} lang={locale}>
      <AudienceLanding
        audience="coach"
        customization={{
          copy: coachCompactCopy[locale],
          hero: <CoachHero copy={copy} locale={locale} />,
          afterHero: <CoachScore locale={locale} />,
          benefits: <CoachSetup locale={locale} />,
          process: <CoachNormvault locale={locale} />,
          afterProcess: <CoachTour copy={copy} locale={locale} />,
          resultsVisual: <CoachReport locale={locale} />,
          hideResultsDecision: true,
          science: <CoachInterpretation copy={copy} locale={locale} />,
          afterFinal: <CoachFaq copy={copy} locale={locale} />,
        }}
      />
    </div>
  )
}

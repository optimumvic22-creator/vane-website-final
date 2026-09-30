'use client'

import { motion } from 'framer-motion'
import { sectionReveal, staggerReveal, staggerItem } from '@/lib/motion'
import { useLocale } from '@/lib/locale'
import { trackEvent } from '@/lib/analytics'
import { goToWaitlist, type WaitlistSegment } from '@/lib/waitlist'
import { Section } from '@/components/ui/section'
import { Container } from '@/components/ui/container'
import { SectionHeader } from '@/components/ui/section-header'
import { cn } from '@/lib/utils'

interface Pkg {
  id: string
  name: string
  price: string
  priceNote?: string
  subline: string
  features: string[]
  cta: string
  segment: WaitlistSegment
  recommended?: boolean
  recommendedLabel?: string
}

interface Copy {
  overline: string
  headline: string
  description: string
  cohortTag: string
  packages: Pkg[]
  teamsLine: string
  teamsCta: string
  footnote: string
}

const en: Copy = {
  overline: 'Packages',
  headline: 'Clear offers. Launch pricing.',
  description: 'Simple packages for the first cohort, built around the baseline and retest logic at the core of the MQS.',
  cohortTag: 'Launch pricing · First cohort',
  packages: [
    {
      id: 'baseline',
      name: 'MQS Baseline',
      price: '€590',
      subline: 'Your starting point',
      features: [
        'Standardized assessment lasting about 30 minutes',
        'MQS profile across seven domains',
        'Report with 3 to 5 prioritized findings',
      ],
      cta: 'Join the waitlist',
      segment: 'individual',
    },
    {
      id: 'retest',
      name: 'MQS Baseline + Retest',
      price: '€890',
      priceNote: 'Saves €290 vs. two single assessments',
      subline: 'Proof of progress',
      features: [
        'Baseline assessment now',
        'Retest after 6 to 8 weeks',
        'Delta report: what actually changed',
      ],
      cta: 'Join the waitlist',
      segment: 'individual',
      recommended: true,
      recommendedLabel: 'Recommended',
    },
    {
      id: 'partner',
      name: 'Partner Pilot',
      price: 'from €1,900',
      subline: 'Physio practices, performance facilities, clubs',
      features: [
        'Onboarding and standardized protocols',
        'Report layer for your clients',
        'Retest workflow at your site',
      ],
      cta: 'Request a discovery call',
      segment: 'gym-clinic',
    },
  ],
  teamsLine: 'Team testing days and federation programs on request.',
  teamsCta: 'team@vanescience.com',
  footnote: 'Launch pricing for the first cohort. Prices excl. VAT.',
}

const de: Copy = {
  overline: 'Pakete',
  headline: 'Klare Angebote. Launchpreise.',
  description: 'Einfache Pakete für die erste Kohorte, aufgebaut auf der Logik aus Baseline und Retest im Kern des MQS.',
  cohortTag: 'Launchpreise · Erste Kohorte',
  packages: [
    {
      id: 'baseline',
      name: 'MQS Baseline',
      price: '590 €',
      subline: 'Dein Ausgangspunkt',
      features: [
        'Standardisiertes Assessment von etwa 30 Minuten',
        'Profil des MQS über sieben Domänen',
        'Report mit 3 bis 5 priorisierten Befunden',
      ],
      cta: 'Warteliste beitreten',
      segment: 'individual',
    },
    {
      id: 'retest',
      name: 'MQS Baseline + Retest',
      price: '890 €',
      priceNote: 'Spart 290 € gegenüber zwei einzelnen Assessments',
      subline: 'Der Beleg für Fortschritt',
      features: [
        'Baseline Assessment jetzt',
        'Retest nach 6 bis 8 Wochen',
        'Deltareport: was sich wirklich verändert hat',
      ],
      cta: 'Warteliste beitreten',
      segment: 'individual',
      recommended: true,
      recommendedLabel: 'Empfohlen',
    },
    {
      id: 'partner',
      name: 'Partner Pilot',
      price: 'ab 1.900 €',
      subline: 'Physiopraxen, Performanceeinrichtungen, Vereine',
      features: [
        'Onboarding und standardisierte Protokolle',
        'Reportansicht für deine Klienten',
        'Ablauf für Retests an deinem Standort',
      ],
      cta: 'Erstgespräch anfragen',
      segment: 'gym-clinic',
    },
  ],
  teamsLine: 'Testtage für Teams und Verbandsprogramme auf Anfrage.',
  teamsCta: 'team@vanescience.com',
  footnote: 'Launchpreise für die erste Kohorte. Preise zzgl. USt.',
}

export function PackagesSection() {
  const { locale } = useLocale()
  const t = locale === 'de' ? de : en

  return (
    <Section id="packages" spacing="xl" divided>
      <Container>
        <motion.div {...sectionReveal()}>
          <div className="mb-6 flex justify-center">
            <span className="rounded-full border border-primary/25 bg-primary/10 px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
              {t.cohortTag}
            </span>
          </div>
          <SectionHeader
            overline={t.overline}
            title={t.headline}
            description={t.description}
            align="center"
          />
        </motion.div>

        <motion.div {...staggerReveal()} className="mx-auto mt-12 grid max-w-5xl gap-5 md:grid-cols-3">
          {t.packages.map((pkg) => (
            <motion.article
              key={pkg.id}
              {...staggerItem()}
              className={cn(
                'relative flex flex-col border p-7 transition-colors duration-300',
                pkg.recommended
                  ? 'border-white/35 bg-card/45 hover:border-white/60 md:-my-3 md:py-10'
                  : 'border-border/15 bg-card/30 hover:border-border/35',
              )}
            >
              {pkg.recommended && (
                <span className="absolute -top-3 left-7 bg-primary px-2.5 py-1 font-mono text-[9px] font-medium uppercase tracking-[0.22em] text-primary-foreground">
                  {pkg.recommendedLabel}
                </span>
              )}
              <p
                className={cn(
                  'font-mono text-[10px] uppercase tracking-[0.2em]',
                  pkg.recommended ? 'text-primary' : 'text-muted-foreground/60',
                )}
              >
                {pkg.subline}
              </p>
              <h3 className="mt-2.5 text-lg font-normal text-foreground">{pkg.name}</h3>
              <p className="mt-4 font-mono text-3xl font-light tracking-tight text-foreground">
                {pkg.price}
              </p>
              {pkg.priceNote && (
                <p className="mt-1.5 text-xs text-muted-foreground/70">{pkg.priceNote}</p>
              )}
              <ul className="mt-6 flex-1 space-y-2.5 border-t border-border/10 pt-5">
                {pkg.features.map((feat) => (
                  <li key={feat} className="flex items-baseline gap-2.5 text-sm leading-relaxed text-muted-foreground">
                    <span
                      className={cn(
                        'h-1 w-1 shrink-0 rounded-full',
                        pkg.recommended ? 'bg-primary' : 'bg-primary/50',
                      )}
                      aria-hidden="true"
                    />
                    {feat}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => {
                  trackEvent('cta_click', { location: 'packages', package: pkg.id })
                  trackEvent('package_select', { package: pkg.id, segment: pkg.segment })
                  goToWaitlist(pkg.segment, `packages:${pkg.id}`)
                }}
                className={cn(
                  'group mt-7 inline-flex items-center justify-center gap-3 rounded-sm border px-6 py-3.5 font-mono text-xs font-medium uppercase tracking-[0.16em] transition-colors duration-[260ms] [transition-timing-function:cubic-bezier(.16,1,.3,1)] active:translate-y-px',
                  pkg.recommended
                    ? 'border-primary bg-primary text-primary-foreground hover:bg-primary/85'
                    : 'border-foreground/70 text-foreground hover:bg-foreground hover:text-background',
                )}
              >
                {pkg.cta}
                <span
                  aria-hidden="true"
                  className="inline-block transition-transform duration-[260ms] [transition-timing-function:cubic-bezier(.16,1,.3,1)] group-hover:translate-x-1"
                >
                  &rarr;
                </span>
              </button>
            </motion.article>
          ))}
        </motion.div>

        {/* Teams / federations */}
        <motion.div {...sectionReveal(0.1)} className="mx-auto mt-10 max-w-5xl text-center">
          <p className="text-sm text-muted-foreground">
            {t.teamsLine}{' '}
            <a
              href="mailto:team@vanescience.com"
              className="text-foreground/80 underline decoration-primary/40 underline-offset-4 transition-colors hover:text-primary"
            >
              {t.teamsCta}
            </a>
          </p>
          <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/50">
            {t.footnote}
          </p>
        </motion.div>
      </Container>
    </Section>
  )
}

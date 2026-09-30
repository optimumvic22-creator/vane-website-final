'use client'

import { useState, type ReactNode } from 'react'
import { motion, type Variants } from 'framer-motion'
import { sectionReveal } from '@/lib/motion'
import { useLocale } from '@/lib/locale'
import { trackEvent } from '@/lib/analytics'
import { goToWaitlist, type WaitlistSegment } from '@/lib/waitlist'
import { Section } from '@/components/ui/section'
import { Container } from '@/components/ui/container'
import { cn } from '@/lib/utils'
import { renderText } from '@/lib/render-text'

const EMPH =
  'not-italic font-normal bg-gradient-to-b from-foreground from-[40%] to-foreground/50 bg-clip-text text-transparent'

/** Which waitlist segment each tab's CTA should preselect. */
const TAB_SEGMENTS: Record<string, WaitlistSegment> = {
  you: 'individual',
  club: 'federation',
  practice: 'gym-clinic',
}

interface Tab {
  id: string
  label: string
  subline: string
  bodyHTML: string
  features: string[]
  cta: string
}

interface LocaleContent {
  overline: string
  headline: ReactNode
  tabs: Tab[]
}

const content: Record<'en' | 'de', LocaleContent> = {
  en: {
    overline: "Who it's for",
    headline: (
      <>
        Tested in the lab.
        <br />
        Used in elite sport.
        <br />
        Built for <em className={EMPH}>every body.</em>
      </>
    ),
    tabs: [
      {
        id: 'you',
        label: 'For you',
        subline: 'Athletes, health-conscious individuals, the curious',
        bodyHTML:
          'You see which movement quality currently limits you and whether your training is working. **One score with seven domains** is compared to people your age and retested over time.',
        features: [
          'Personal MQS report: 3 to 5 key findings and prioritized next steps',
          'Your profile across seven domains: strengths and limiters',
          'Baseline + retest: proof of whether your training works',
          'Body + mind under load: the dual task quality no wearable measures',
        ],
        cta: 'Discover my score',
      },
      {
        id: 'club',
        label: 'For your club',
        subline: 'Sports clubs, federations, performance teams',
        bodyHTML:
          'You measure endurance, strength, and speed. The MQS adds the missing layer: **more systematic baselines, progress tracking, and return to performance communication.**',
        features: [
          'Team baselines with an individual MQS profile per athlete',
          'Retest deltas that show whether the training block worked',
          'Dual-task testing can make asymmetries and risk indicators visible',
          'Return to performance: standardized progress data for clear decisions',
        ],
        cta: 'Request a performance partnership',
      },
      {
        id: 'practice',
        label: 'For your practice',
        subline: 'Clinics, physios, coaches, performance facilities',
        bodyHTML:
          'A standardized premium assessment for your clients: **report, retest, and clear priorities.** Progress becomes visible, comparable, and easier to communicate at your site on your existing equipment.',
        features: [
          'Standardized test battery and report logic, run by your trained staff',
          'Baseline + retest workflow: progress your clients can see',
          'From measurement data to concrete priorities: strength, control, mobility, symmetry, load tolerance',
          'Partner standards and white label options: your brand, our methodology',
        ],
        cta: 'Request a discovery call',
      },
    ],
  },
  de: {
    overline: 'Für wen?',
    headline: (
      <>
        Im Labor getestet.
        <br />
        Im Spitzensport im Einsatz.
        <br />
        Gebaut für <em className={EMPH}>jeden Körper.</em>
      </>
    ),
    tabs: [
      {
        id: 'you',
        label: 'Für dich',
        subline: 'Athleten, Gesundheitsbewusste, Neugierige',
        bodyHTML:
          'Du siehst, welche Bewegungsqualität dich aktuell limitiert und ob dein Training Wirkung zeigt. **Ein Score mit sieben Domänen** wird mit Menschen deines Alters verglichen und im Retest über die Zeit verfolgt.',
        features: [
          'Persönlicher MQS Report: 3 bis 5 zentrale Befunde und priorisierte nächste Schritte',
          'Dein Profil über sieben Domänen: Stärken und Limitierungen',
          'Baseline + Retest: der Beleg, ob dein Training wirkt',
          'Körper + Kopf unter Belastung: Qualität unter Doppelaufgabe, die kein Wearable misst',
        ],
        cta: 'Warteliste beitreten',
      },
      {
        id: 'club',
        label: 'Für deinen Verein',
        subline: 'Sportvereine, Verbände, Performance Teams',
        bodyHTML:
          'Du misst Ausdauer, Kraft und Schnelligkeit. Der MQS ergänzt die fehlende Ebene: **mehr Systematik in Baselines, Verlauf und Kommunikation zur Rückkehr in den Sport.**',
        features: [
          'Baselines für Teams mit individuellem MQS Profil pro Athlet',
          'Veränderungen im Retest, die zeigen, ob der Trainingsblock gewirkt hat',
          'Testung unter Doppelaufgabe kann Asymmetrien und Risikoindikatoren sichtbar machen',
          'Return to Performance: standardisierte Verlaufsdaten für klare Entscheidungen',
        ],
        cta: 'Performance Partnerschaft anfragen',
      },
      {
        id: 'practice',
        label: 'Für deine Praxis',
        subline: 'Kliniken, Physios, Coaches, Performance Einrichtungen',
        bodyHTML:
          'Ein standardisiertes Premium Assessment für deine Klienten: **Report, Retest und klare Prioritäten.** Fortschritt wird bei dir vor Ort auf deinem bestehenden Equipment sichtbar, vergleichbar und besser kommunizierbar.',
        features: [
          'Standardisierte Testbatterie und Reportlogik, durchgeführt von deinem geschulten Team',
          'Ablauf für Baseline und Retest: Fortschritt, den deine Klienten sehen',
          'Aus Messdaten werden konkrete Prioritäten: Kraft, Kontrolle, Mobilität, Symmetrie, Belastbarkeit',
          'Partnerstandards und Optionen für White Label: deine Marke, unsere Methodik',
        ],
        cta: 'Erstgespräch anfragen',
      },
    ],
  },
}

interface UseCasesSectionProps {
  data?: {
    useCasesOverline?: string
    useCasesOverlineDe?: string
    useCasesHeadline?: string
    useCasesHeadlineEm?: string
    useCasesHeadlineDe?: string
    useCasesTabs?: Array<{
      tabId: string
      label: string
      labelDe?: string
      subline: string
      sublineDe?: string
      body: string
      bodyDe?: string
      features: string[]
      featuresDe?: string[]
      cta: string
      ctaDe?: string
    }>
  } | null
}

const EASE_OUT = [0.16, 1, 0.3, 1] as const

const ladderVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.22 } },
}

const ladderItemVariants: Variants = {
  hidden: { opacity: 0, x: 12 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.42, ease: EASE_OUT },
  },
}

export function UseCasesSection({ data }: UseCasesSectionProps) {
  const { locale } = useLocale()
  const t = locale === 'de' ? content.de : content.en

  const isDE = locale === 'de'
  const overline = (isDE ? data?.useCasesOverlineDe : data?.useCasesOverline) || t.overline

  const headline = (() => {
    if (isDE && data?.useCasesHeadlineDe) return <>{renderText(data.useCasesHeadlineDe)}</>
    if (!isDE && data?.useCasesHeadline) {
      const em = data.useCasesHeadlineEm
      if (em && data.useCasesHeadline.includes(em)) {
        const idx = data.useCasesHeadline.lastIndexOf(em)
        const before = data.useCasesHeadline.slice(0, idx)
        const after = data.useCasesHeadline.slice(idx + em.length)
        return <>{renderText(before)}<em className={EMPH}>{em}</em>{after}</>
      }
      return <>{renderText(data.useCasesHeadline)}</>
    }
    return t.headline
  })()

  const tabs = data?.useCasesTabs?.map(tab => ({
    id: tab.tabId,
    label: isDE ? (tab.labelDe || tab.label) : tab.label,
    subline: isDE ? (tab.sublineDe || tab.subline) : tab.subline,
    bodyHTML: isDE ? (tab.bodyDe || tab.body) : tab.body,
    features: isDE ? (tab.featuresDe || tab.features) : tab.features,
    cta: isDE ? (tab.ctaDe || tab.cta) : tab.cta,
  })) || t.tabs

  const resolvedTabs = tabs
  const [activeTab, setActiveTab] = useState(resolvedTabs[0].id)
  const active = resolvedTabs.find((tab) => tab.id === activeTab) ?? resolvedTabs[0]

  return (
    <Section id="for-whom" spacing="xl" divided>
      <Container>
        {/* header */}
        <motion.header {...sectionReveal()} className="mb-16 md:mb-24">
          <div className="mb-7 flex items-center gap-3 font-mono text-[11px] font-normal uppercase tracking-[0.24em] text-primary">
            <span className="h-px w-8 bg-primary" aria-hidden="true" />
            {overline}
          </div>
          <h2 className="font-display text-5xl font-normal uppercase leading-[0.95] tracking-[0.02em] text-foreground sm:text-6xl lg:text-8xl">
            {headline}
          </h2>
        </motion.header>

        {/* tab bar */}
        <div
          role="tablist"
          aria-label={locale === 'de' ? 'Zielgruppe' : 'Audience'}
          className="flex flex-wrap"
        >
          {resolvedTabs.map((tab, i) => {
            const selected = activeTab === tab.id
            const index = String(i + 1).padStart(2, '0')
            return (
              <button
                key={tab.id}
                role="tab"
                id={`tab-${tab.id}`}
                aria-selected={selected}
                aria-controls="panel-audience"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'relative cursor-pointer border-b border-white/10 py-3.5 pl-11 pr-5 text-left font-sans text-sm font-normal tracking-[-0.01em] transition-colors duration-200',
                  'after:absolute after:inset-x-0 after:-bottom-px after:h-px after:origin-left after:bg-primary after:transition-transform after:duration-[400ms] after:[transition-timing-function:cubic-bezier(.16,1,.3,1)]',
                  selected
                    ? 'text-foreground after:scale-x-100'
                    : 'text-white/55 hover:text-white/70 after:scale-x-0 hover:after:scale-x-100',
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    'pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 font-mono text-[10px] tracking-[0.18em] transition-opacity duration-200',
                    selected ? 'text-white/40 opacity-100' : 'text-white/20 opacity-0',
                  )}
                >
                  {index}
                </span>
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* panel */}
        <div
          id="panel-audience"
          role="tabpanel"
          aria-labelledby={`tab-${activeTab}`}
          className="relative border-b border-t border-white/15 py-14 md:py-18"
        >
          <div className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-12 md:items-start">
            {/* left column */}
            <motion.div
              key={`left-${active.id}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.42, ease: EASE_OUT }}
              className="flex flex-col md:col-span-5 md:min-h-80 md:pt-7"
            >
              <p className="mb-6 max-w-[32ch] font-mono text-[13px] uppercase tracking-[0.18em] text-white/55">
                {active.subline}
              </p>
              <p className="mb-10 max-w-[32ch] text-[22px] font-normal leading-[1.55] text-white/60 md:mb-12 [&_strong]:font-medium [&_strong]:text-foreground">
                {renderText(active.bodyHTML)}
              </p>
              <button
                type="button"
                onClick={() => {
                  trackEvent('cta_click', { location: 'use_cases', tab: active.id })
                  goToWaitlist(TAB_SEGMENTS[active.id], `use-cases:${active.id}`)
                }}
                className="group mt-auto inline-flex items-center gap-3.5 self-start rounded-sm border border-foreground px-7 py-4 font-mono text-xs font-medium uppercase tracking-[0.18em] text-foreground transition-colors duration-[260ms] [transition-timing-function:cubic-bezier(.16,1,.3,1)] hover:bg-foreground hover:text-background active:translate-y-px"
              >
                {active.cta}
                <span
                  aria-hidden="true"
                  className="inline-block transition-transform duration-[260ms] [transition-timing-function:cubic-bezier(.16,1,.3,1)] group-hover:translate-x-1"
                >
                  &rarr;
                </span>
              </button>
            </motion.div>

            {/* gutter hairline (md+) */}
            <div
              aria-hidden="true"
              className="relative hidden md:col-span-1 md:block md:min-h-80 md:justify-self-center"
            >
              <motion.span
                animate={{ opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2"
                style={{
                  background:
                    'linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.14) 15%, rgba(255,255,255,0.14) 85%, transparent 100%)',
                }}
              />
            </div>

            {/* right column: feature ladder */}
            <div className="md:col-span-6">
              <motion.ol
                key={`ladder-${active.id}`}
                initial="hidden"
                animate="visible"
                variants={ladderVariants}
                className="m-0 list-none p-0"
              >
                {active.features.map((feat, i) => (
                  <motion.li
                    key={i}
                    variants={ladderItemVariants}
                    className="group relative grid grid-cols-[32px_1fr_20px] gap-x-3.5 border-t border-white/10 py-5 last:border-b md:grid-cols-[40px_1fr_24px] md:gap-x-5 md:py-7"
                  >
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 origin-left scale-x-0 bg-gradient-to-r from-transparent to-primary/[0.03] transition-transform duration-[340ms] [transition-timing-function:cubic-bezier(.16,1,.3,1)] group-hover:scale-x-100"
                    />
                    <span
                      className={cn(
                        'relative z-[1] pt-0.5 font-mono text-[11px] font-normal tracking-[0.22em] transition-colors duration-[340ms] [transition-timing-function:cubic-bezier(.16,1,.3,1)] group-hover:text-primary',
                        i === 0 ? 'text-primary' : 'text-white/55',
                      )}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="relative z-[1] max-w-[46ch] text-base font-normal leading-[1.45] text-foreground md:text-lg">
                      {feat}
                    </span>
                    <span
                      aria-hidden="true"
                      className="relative z-[1] flex -translate-x-2 items-center justify-end opacity-0 transition-[opacity,transform] duration-[340ms] [transition-timing-function:cubic-bezier(.16,1,.3,1)] group-hover:translate-x-0 group-hover:opacity-100"
                    >
                      <svg viewBox="0 0 10 12" width="10" height="12">
                        <path
                          d="M 1 1 L 8 6 L 1 11"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-primary"
                        />
                      </svg>
                    </span>
                  </motion.li>
                ))}
              </motion.ol>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  )
}

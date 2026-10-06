'use client'

import { motion } from 'framer-motion'
import { sectionReveal } from '@/lib/motion'
import { useLocale } from '@/lib/locale'
import { renderText } from '@/lib/render-text'
import { MqsDashboard } from '@/components/ui/mqs-dashboard'
import './legacy-sections.css'

type Voice = {
  idx: string
  role: string
  quote: string
  gaps: string[]
}

type Content = {
  overline: string
  headlineLead: string
  headlineEm: string
  headSub: React.ReactNode
  leftStub: string
  leftTitle: string
  leftTag: string
  rightTitle: React.ReactNode
  rightTag: string
  voices: [Voice, Voice, Voice]
  captionTag: string
  captionLead: string
  captionEm: string
  costPrelude: string
  costAsideLead: string
  costAsideEm: string
  costFix: string
  costSportTag: string
  costSportLead: string
  costSportEm: string
  costAgingTag: string
  costAgingLead: string
  costAgingEm: string
}

interface ProblemSectionProps {
  data?: {
    problemOverline?: string
    problemOverlineDe?: string
    problemHeadlineLead?: string
    problemHeadlineLeadDe?: string
    problemHeadlineEm?: string
    problemHeadlineEmDe?: string
    problemHeadSub?: string
    problemHeadSubDe?: string
    problemLeftTitle?: string
    problemLeftTitleDe?: string
    problemLeftTag?: string
    problemLeftTagDe?: string
    problemRightTag?: string
    problemRightTagDe?: string
    problemVoices?: Array<{
      idx: string
      role: string
      roleDe?: string
      quote: string
      quoteDe?: string
      gaps: string[]
      gapsDe?: string[]
    }>
    problemMqsOverallScore?: number
    problemMqsDomains?: Array<{
      code: string
      label?: string
      labelDe?: string
      score: number
    }>
    problemCaptionTag?: string
    problemCaptionTagDe?: string
    problemCaptionText?: string
    problemCaptionTextDe?: string
    problemCostPrelude?: string
    problemCostPreludeDe?: string
    problemCostAside?: string
    problemCostAsideDe?: string
    problemCostFix?: string
    problemCostFixDe?: string
    problemCostSportTag?: string
    problemCostSportTagDe?: string
    problemCostSportLine?: string
    problemCostSportLineDe?: string
    problemCostAgingTag?: string
    problemCostAgingTagDe?: string
    problemCostAgingLine?: string
    problemCostAgingLineDe?: string
  } | null
}

const en: Content = {
  overline: 'The problem',
  headlineLead: 'The world',
  headlineEm: 'moves blind.',
  headSub: (
    <>
      The data exists. <b>Decision quality doesn&apos;t.</b> The Movement Quality Score changes that.
    </>
  ),
  leftTitle: 'What everyone says',
  leftStub: '',
  leftTag: 'Opinions · observations · counts',
  rightTitle: (
    <>
      What <em>we</em> measure
    </>
  ),
  rightTag: 'Data · seven domains · objective',
  voices: [
    {
      idx: '01',
      role: 'Trainer says',
      quote: 'Looks good.',
      gaps: ['no number', 'no range', 'no proof'],
    },
    {
      idx: '02',
      role: 'Doctor says',
      quote: 'Move more.',
      gaps: ['how much?', 'how well?', 'vs whom?'],
    },
    {
      idx: '03',
      role: 'Tracker says',
      quote: '10,000 steps. Resting HR 54.',
      gaps: ['counted', 'not qualified', 'no peer comparison'],
    },
  ],
  captionTag: 'The shift',
  captionLead: 'Data only becomes valuable when it enables a better decision.',
  captionEm: 'findings and prioritized next steps',
  costPrelude: 'The cost',
  costAsideLead: 'Two trainers. Same movement.',
  costAsideEm: 'Different assessment.',
  costFix: 'The MQS changes that',
  costSportTag: 'In sport',
  costSportLead: 'It costs',
  costSportEm: 'careers.',
  costAgingTag: 'In aging',
  costAgingLead: 'It costs',
  costAgingEm: 'independence.',
}

const de: Content = {
  overline: 'Das Problem',
  headlineLead: 'Die Welt bewegt',
  headlineEm: 'sich blind.',
  headSub: (
    <>
      Daten gibt es. <b>Entscheidungsqualität fehlt.</b> Der Movement Quality Score ändert das.
    </>
  ),
  leftTitle: 'Was alle sagen',
  leftStub: '',
  leftTag: 'Meinungen · Beobachtungen · Zahlen',
  rightTitle: (
    <>
      Was <em>wir</em> messen
    </>
  ),
  rightTag: 'Daten · sieben Domänen · objektiv',
  voices: [
    {
      idx: '01',
      role: 'Trainer sagt',
      quote: 'Sieht gut aus.',
      gaps: ['keine Zahl', 'keine Norm', 'kein Nachweis'],
    },
    {
      idx: '02',
      role: 'Arzt sagt',
      quote: 'Beweg dich mehr.',
      gaps: ['wie viel?', 'wie gut?', 'vs. wem?'],
    },
    {
      idx: '03',
      role: 'Tracker sagt',
      quote: '10.000 Schritte. Ruhepuls 54.',
      gaps: ['gezählt', 'nicht bewertet', 'kein Vergleich'],
    },
  ],
  captionTag: 'Der Wandel',
  captionLead: 'Daten werden erst wertvoll, wenn sie eine bessere Entscheidung ermöglichen.',
  captionEm: 'Befunde und priorisierte nächste Schritte',
  costPrelude: 'Die Kosten',
  costAsideLead: 'Zwei Trainer. Dieselbe Bewegung.',
  costAsideEm: 'Unterschiedliche Bewertung.',
  costFix: 'Der MQS ändert das',
  costSportTag: 'Im Sport',
  costSportLead: 'Es kostet',
  costSportEm: 'Karrieren.',
  costAgingTag: 'Im Alter',
  costAgingLead: 'Es kostet',
  costAgingEm: 'Unabhängigkeit.',
}

export function ProblemSection({ data }: ProblemSectionProps) {
  const { locale } = useLocale()
  const t = locale === 'de' ? de : en

  const isDE = locale === 'de'
  const pick = <T,>(en: T | undefined, de: T | undefined, fallback: T): T =>
    (isDE ? de ?? fallback : en ?? fallback)

  const c = {
    overline: pick(data?.problemOverline, data?.problemOverlineDe, t.overline),
    headlineLead: pick(data?.problemHeadlineLead, data?.problemHeadlineLeadDe, t.headlineLead),
    headlineEm: pick(data?.problemHeadlineEm, data?.problemHeadlineEmDe, t.headlineEm),
    leftTitle: pick(data?.problemLeftTitle, data?.problemLeftTitleDe, t.leftTitle),
    leftTag: pick(data?.problemLeftTag, data?.problemLeftTagDe, t.leftTag),
    rightTag: pick(data?.problemRightTag, data?.problemRightTagDe, t.rightTag),
    captionTag: pick(data?.problemCaptionTag, data?.problemCaptionTagDe, t.captionTag),
    costPrelude: pick(data?.problemCostPrelude, data?.problemCostPreludeDe, t.costPrelude),
    costFix: pick(data?.problemCostFix, data?.problemCostFixDe, t.costFix),
    costSportTag: pick(data?.problemCostSportTag, data?.problemCostSportTagDe, t.costSportTag),
    costAgingTag: pick(data?.problemCostAgingTag, data?.problemCostAgingTagDe, t.costAgingTag),
  }

  const voices = data?.problemVoices?.map(v => ({
    idx: v.idx,
    role: isDE ? (v.roleDe || v.role) : v.role,
    quote: isDE ? (v.quoteDe || v.quote) : v.quote,
    gaps: isDE ? (v.gapsDe || v.gaps) : v.gaps,
  })) || t.voices

  const headSub = (() => {
    const raw = pick(data?.problemHeadSub, data?.problemHeadSubDe, null)
    if (raw) return renderText(raw)
    return t.headSub
  })()

  const captionText = (() => {
    const raw = pick(data?.problemCaptionText, data?.problemCaptionTextDe, null)
    if (raw) return renderText(raw)
    return (
      <>
        {t.captionLead}<br />
        {isDE ? <>Der MQS macht daraus <b>{t.captionEm}</b>.</> : <>The MQS turns it into <b>{t.captionEm}</b>.</>}
      </>
    )
  })()

  const costAside = (() => {
    const raw = pick(data?.problemCostAside, data?.problemCostAsideDe, null)
    if (raw) return renderText(raw)
    return <>{t.costAsideLead} <b>{t.costAsideEm}</b></>
  })()

  const costSportLine = (() => {
    const raw = pick(data?.problemCostSportLine, data?.problemCostSportLineDe, null)
    if (raw) return renderText(raw)
    return <>{t.costSportLead} <b>{t.costSportEm}</b></>
  })()

  const costAgingLine = (() => {
    const raw = pick(data?.problemCostAgingLine, data?.problemCostAgingLineDe, null)
    if (raw) return renderText(raw)
    return <>{t.costAgingLead} <b>{t.costAgingEm}</b></>
  })()

  return (
    <section id="problem" className="ps-v2 relative overflow-hidden py-20 md:py-28">
      <div className="ps-atmosphere" aria-hidden="true" />

      <div className="ps-shell">
        {/* Header */}
        <motion.header {...sectionReveal()} className="ps-head">
          <div className="ps-overline">{c.overline}</div>
          <h2 className="ps-display">
            {c.headlineLead}
            <br />
            <em>{c.headlineEm}</em>
          </h2>
          <p className="ps-head-sub">{headSub}</p>
        </motion.header>

        {/* The split */}
        <motion.div {...sectionReveal(0.1)} className="ps-split">
          {/* Header row */}
          <div className="ps-col-head ps-col-head-left">
            <div className="ps-col-stub" />
            <h3 className="ps-col-title">{c.leftTitle}</h3>
            <p className="ps-col-tag">{c.leftTag}</p>
          </div>
          <div className="ps-v-divider ps-v-divider-head" aria-hidden="true" />
          <div className="ps-col-head ps-col-head-right">
            <div className="ps-col-stub" />
            <h3 className="ps-col-title">{t.rightTitle}</h3>
            <p className="ps-col-tag">{c.rightTag}</p>
          </div>

          {/* Body row */}
          <div className="ps-side ps-side-left">
            <div className="ps-voices">
              {voices.map((voice) => (
                <article key={voice.idx} className="ps-voice">
                  <div className="ps-voice-role">
                    <span className="ps-voice-idx">{voice.idx}</span>
                    <span className="ps-voice-role-name">{voice.role}</span>
                  </div>
                  <p className="ps-voice-quote">{voice.quote}</p>
                  <div className="ps-voice-gap">
                    {voice.gaps.map((gap) => (
                      <span key={gap} className="ps-gap-chip">
                        {gap}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="ps-v-divider ps-v-divider-body" aria-hidden="true">
            <div className="ps-vs-pill">VS</div>
          </div>

          <div className="ps-side ps-side-right">
            <MqsDashboard
              variant="compact"
              domains={data?.problemMqsDomains?.map(d => ({
                code: d.code,
                label: isDE ? (d.labelDe || d.label) : d.label,
                score: d.score,
              }))}
              overallScore={data?.problemMqsOverallScore}
            />
            <div className="ps-panel-caption">
              <span className="ps-panel-caption-tag">{c.captionTag}</span>
              <p>{captionText}</p>
            </div>
          </div>
        </motion.div>

        {/* Bottom: the cost */}
        <motion.div {...sectionReveal(0.2)} className="ps-bottom">
          <p className="ps-bottom-prelude">{c.costPrelude}</p>
          <p className="ps-bottom-aside">
            {costAside}
            <span className="ps-fix">{c.costFix}</span>
          </p>

          <div className="ps-cost-twin">
            <div className="ps-cost-cell">
              <p className="ps-cost-tag">{c.costSportTag}</p>
              <p className="ps-cost-line">
                {costSportLine}
              </p>
            </div>
            <div className="ps-cost-divider" aria-hidden="true" />
            <div className="ps-cost-cell">
              <p className="ps-cost-tag">{c.costAgingTag}</p>
              <p className="ps-cost-line">
                {costAgingLine}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

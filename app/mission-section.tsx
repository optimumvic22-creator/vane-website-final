'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { sectionReveal } from '@/lib/motion'
import { useLocale } from '@/lib/locale'
import { renderText } from '@/lib/render-text'
import { FOUNDERS } from '@/lib/founders'
import './legacy-sections.css'

type UseCase = {
  tag: string
  title: string
  titleEm: string
  meta: string
}

type Content = {
  missionOverline: string
  scienceOverline: string
  headlineLead: string
  headlineEm: string
  missionTag: string
  missionTitle: string
  missionTitleEm: string
  missionBody: React.ReactNode
  missionDownLead: string
  missionDownTail: string
  portraitLive: string
  portraitRec: string
  portraitWhoLabel: string
  portraitWhoName: string
  portraitWhereLabel: string
  portraitWhereSub: string
  markerChipTop: string
  markerChipBottom: string
  scienceTag: string
  scienceTitle: string
  scienceTitleEm: string
  scienceBody: React.ReactNode
  scienceDownLead: string
  scienceDownTail: string
  ucLabelLead: string
  ucLabelTail: string
  ucSport: UseCase
  ucAging: UseCase
  ucRobotics: UseCase
  methodTag: string
  methodTitle: string
  methodTitleEm: string
  instruments: [
    { num: string; title: string; sub: string },
    { num: string; title: string; sub: string },
    { num: string; title: string; sub: string },
  ]
  outputLabel: string
  outputSub: string
  outputScoreSuffix: string
  synthesisLabel: string
  synthesisLead: string
  synthesisEm: string
  synthesisTail: string
}

const en: Content = {
  missionOverline: 'Our mission',
  scienceOverline: 'The science',
  headlineLead: 'We gave human movement',
  headlineEm: 'a language.',

  missionTag: 'The belief',
  missionTitle: 'Understand how humans move,',
  missionTitleEm: 'help them move better.',
  missionBody: (
    <>
      VANE was built on a simple belief: if we understand how humans move, we can help them move better. Whether that means guiding an athlete back to performance, preserving independence as you age, or teaching machines how humans move in the long term, it starts with the same data. <strong>The Movement Quality Score.</strong>
    </>
  ),
  missionDownLead: 'Three lives',
  missionDownTail: 'one metric',

  portraitLive: 'LIVE · capture',
  portraitRec: 'REC · 120 fps',
  portraitWhoLabel: 'The founder',
  portraitWhoName: FOUNDERS.dario.name,
  portraitWhereLabel: 'Vienna',
  portraitWhereSub: 'VANE Lab · AT',
  markerChipTop: '21 MARKERS',
  markerChipBottom: 'FORCE · 0.1 N',

  scienceTag: 'The method',
  scienceTitle: 'No guessing. No opinions.',
  scienceTitleEm: 'Just data.',
  scienceBody: (
    <>
      VANE applies the same test methodology behind the world&apos;s best psychological assessments to movement. Our reference lab in Vienna uses motion capture, force plates, and standardized protocols to <strong>develop and standardize the MQS</strong>. The test battery works independently of hardware and runs on the standard equipment already used by gyms, clinics, and performance facilities. In the long term, the same data quality can support research in movement science and robotics.
    </>
  ),
  scienceDownLead: 'Three instruments',
  scienceDownTail: 'one score',

  ucLabelLead: 'Three lives ·',
  ucLabelTail: 'one metric',
  ucSport: {
    tag: 'Sport',
    title: "An athlete's comeback,",
    titleEm: 'proven.',
    meta: 'Baseline and retest instead of gut feeling',
  },
  ucAging: {
    tag: 'Aging',
    title: 'Independence,',
    titleEm: 'preserved.',
    meta: 'Movement quality made visible over the years',
  },
  ucRobotics: {
    tag: 'Robotics',
    title: 'Machines that work',
    titleEm: 'beside us.',
    meta: 'Taught how humans actually move',
  },

  methodTag: 'Inside the reference lab',
  methodTitle: 'Three instruments.',
  methodTitleEm: 'One number.',
  instruments: [
    { num: '01 · Capture', title: 'Motion capture', sub: 'Submillimetre precision · 120 fps' },
    { num: '02 · Force', title: 'Force plates', sub: 'Elite sport grade · ±0.1 N' },
    { num: '03 · Strength', title: 'Strength testing', sub: 'Max voluntary output' },
  ],
  outputLabel: 'Movement Quality Score',
  outputSub: 'One number · your age, your sex',
  outputScoreSuffix: 'T score',

  synthesisLabel: 'the synthesis',
  synthesisLead: 'We didn\u2019t set out to believe that human movement could be understood this clearly. We set out to ',
  synthesisEm: 'prove it',
  synthesisTail: '. The Movement Quality Score is what happened when we did.',
}

const de: Content = {
  missionOverline: 'Unsere Mission',
  scienceOverline: 'Die Wissenschaft',
  headlineLead: 'Wir haben menschlicher Bewegung',
  headlineEm: 'eine Sprache gegeben.',

  missionTag: 'Die Überzeugung',
  missionTitle: 'Verstehen, wie sich Menschen bewegen.',
  missionTitleEm: 'damit sie sich besser bewegen.',
  missionBody: (
    <>
      VANE basiert auf einer einfachen Überzeugung: Wenn wir verstehen, wie sich Menschen bewegen, können wir ihnen helfen, sich besser zu bewegen. Ob das heißt, einen Athleten zurück zur Leistung zu führen, Eigenständigkeit mit dem Alter zu bewahren oder langfristig Maschinen beizubringen, wie Menschen sich wirklich bewegen, es beginnt mit denselben Daten. <strong>Dem Movement Quality Score.</strong>
    </>
  ),
  missionDownLead: 'Drei Leben',
  missionDownTail: 'eine Metrik',

  portraitLive: 'LIVE · Aufnahme',
  portraitRec: 'REC · 120 fps',
  portraitWhoLabel: 'Der Gründer',
  portraitWhoName: FOUNDERS.dario.name,
  portraitWhereLabel: 'Wien',
  portraitWhereSub: 'VANE Lab · AT',
  markerChipTop: '21 MARKER',
  markerChipBottom: 'KRAFT · 0.1 N',

  scienceTag: 'Die Methode',
  scienceTitle: 'Keine Schätzung. Keine Meinung.',
  scienceTitleEm: 'Nur Daten.',
  scienceBody: (
    <>
      VANE wendet dieselbe Testtheorie, mit der die besten psychologischen Testverfahren der Welt gebaut werden, auf Bewegung an. Unser Referenzlabor in Wien nutzt Motion Capture, Kraftmessplatten und standardisierte Protokolle, um <strong>den MQS zu entwickeln und zu normieren</strong>. Die Testbatterie funktioniert hardwareunabhängig und läuft auf der vorhandenen Standardausstattung von Gyms, Praxen und Performanceeinrichtungen. Langfristig kann dieselbe Datenqualität Forschung in Bewegungswissenschaft und Robotik unterstützen.
    </>
  ),
  scienceDownLead: 'Drei Instrumente',
  scienceDownTail: 'ein Score',

  ucLabelLead: 'Drei Leben ·',
  ucLabelTail: 'eine Metrik',
  ucSport: {
    tag: 'Sport',
    title: 'Das Comeback eines Athleten,',
    titleEm: 'belegt.',
    meta: 'Baseline und Retest statt Bauchgefühl',
  },
  ucAging: {
    tag: 'Altern',
    title: 'Eigenständigkeit,',
    titleEm: 'bewahrt.',
    meta: 'Bewegungsqualität über Jahre sichtbar gemacht',
  },
  ucRobotics: {
    tag: 'Robotik',
    title: 'Maschinen, die',
    titleEm: 'neben uns arbeiten.',
    meta: 'Sie lernen, wie Menschen sich bewegen',
  },

  methodTag: 'Im Referenzlabor',
  methodTitle: 'Drei Instrumente.',
  methodTitleEm: 'Eine Zahl.',
  instruments: [
    { num: '01 · Aufnahme', title: 'Motion Capture', sub: 'Submillimeter · 120 fps' },
    { num: '02 · Kraft', title: 'Kraftmessplatten', sub: 'Niveau des Spitzensports · ±0.1 N' },
    { num: '03 · Stärke', title: 'Krafttest', sub: 'Maximale willkürliche Kraft' },
  ],
  outputLabel: 'Movement Quality Score',
  outputSub: 'Eine Zahl · dein Alter, dein Geschlecht',
  outputScoreSuffix: 'T Wert',

  synthesisLabel: 'die Synthese',
  synthesisLead: 'Wir wollten nicht nur glauben, dass menschliche Bewegung so klar verstanden werden kann. Wir wollten es ',
  synthesisEm: 'beweisen',
  synthesisTail: '. Der Movement Quality Score ist das Ergebnis.',
}

interface MissionSectionProps {
  data?: {
    missionOverline?: string
    missionOverlineDe?: string
    scienceOverline?: string
    scienceOverlineDe?: string
    missionHeadlineLead?: string
    missionHeadlineLeadDe?: string
    missionHeadlineEm?: string
    missionHeadlineEmDe?: string
    missionTag?: string
    missionTagDe?: string
    missionTitle?: string
    missionTitleDe?: string
    missionTitleEm?: string
    missionTitleEmDe?: string
    missionBody?: string
    missionBodyDe?: string
    missionDownLead?: string
    missionDownLeadDe?: string
    missionDownTail?: string
    missionDownTailDe?: string
    missionPortraitImage?: { asset?: { url?: string } }
    missionPortraitLive?: string
    missionPortraitLiveDe?: string
    missionPortraitRec?: string
    missionPortraitRecDe?: string
    missionPortraitWhoLabel?: string
    missionPortraitWhoLabelDe?: string
    missionPortraitWhoName?: string
    missionPortraitWhereLabel?: string
    missionPortraitWhereLabelDe?: string
    missionPortraitWhereSub?: string
    missionPortraitWhereSubDe?: string
    missionMarkerChipTop?: string
    missionMarkerChipTopDe?: string
    missionMarkerChipBottom?: string
    missionMarkerChipBottomDe?: string
    scienceTag?: string
    scienceTagDe?: string
    scienceTitle?: string
    scienceTitleDe?: string
    scienceTitleEm?: string
    scienceTitleEmDe?: string
    scienceBody?: string
    scienceBodyDe?: string
    scienceDownLead?: string
    scienceDownLeadDe?: string
    scienceDownTail?: string
    scienceDownTailDe?: string
    missionUcLabelLead?: string
    missionUcLabelLeadDe?: string
    missionUcLabelTail?: string
    missionUcLabelTailDe?: string
    missionUseCases?: Array<{
      tag: string
      tagDe?: string
      title: string
      titleDe?: string
      titleEm: string
      titleEmDe?: string
      meta: string
      metaDe?: string
    }>
    missionMethodTag?: string
    missionMethodTagDe?: string
    missionMethodTitle?: string
    missionMethodTitleDe?: string
    missionMethodTitleEm?: string
    missionMethodTitleEmDe?: string
    missionInstruments?: Array<{
      num: string
      numDe?: string
      title: string
      titleDe?: string
      sub: string
      subDe?: string
    }>
    missionOutputLabel?: string
    missionOutputLabelDe?: string
    missionOutputSub?: string
    missionOutputSubDe?: string
    missionOutputScoreSuffix?: string
    missionOutputScoreSuffixDe?: string
    missionSynthesisLabel?: string
    missionSynthesisLabelDe?: string
    missionSynthesisText?: string
    missionSynthesisTextDe?: string
  } | null
}

export function MissionSection({ data }: MissionSectionProps) {
  const { locale } = useLocale()
  const t = locale === 'de' ? de : en

  const isDE = locale === 'de'
  const p = <T,>(en: T | undefined, de: T | undefined, fb: T): T => (isDE ? de ?? fb : en ?? fb)

  const c = {
    missionOverline: p(data?.missionOverline, data?.missionOverlineDe, t.missionOverline),
    scienceOverline: p(data?.scienceOverline, data?.scienceOverlineDe, t.scienceOverline),
    headlineLead: p(data?.missionHeadlineLead, data?.missionHeadlineLeadDe, t.headlineLead),
    headlineEm: p(data?.missionHeadlineEm, data?.missionHeadlineEmDe, t.headlineEm),
    missionTag: p(data?.missionTag, data?.missionTagDe, t.missionTag),
    missionTitle: p(data?.missionTitle, data?.missionTitleDe, t.missionTitle),
    missionTitleEm: p(data?.missionTitleEm, data?.missionTitleEmDe, t.missionTitleEm),
    missionDownLead: p(data?.missionDownLead, data?.missionDownLeadDe, t.missionDownLead),
    missionDownTail: p(data?.missionDownTail, data?.missionDownTailDe, t.missionDownTail),
    portraitLive: p(data?.missionPortraitLive, data?.missionPortraitLiveDe, t.portraitLive),
    portraitRec: p(data?.missionPortraitRec, data?.missionPortraitRecDe, t.portraitRec),
    portraitWhoLabel: p(data?.missionPortraitWhoLabel, data?.missionPortraitWhoLabelDe, t.portraitWhoLabel),
    portraitWhoName: data?.missionPortraitWhoName || t.portraitWhoName,
    portraitWhereLabel: p(data?.missionPortraitWhereLabel, data?.missionPortraitWhereLabelDe, t.portraitWhereLabel),
    portraitWhereSub: p(data?.missionPortraitWhereSub, data?.missionPortraitWhereSubDe, t.portraitWhereSub),
    markerChipTop: p(data?.missionMarkerChipTop, data?.missionMarkerChipTopDe, t.markerChipTop),
    markerChipBottom: p(data?.missionMarkerChipBottom, data?.missionMarkerChipBottomDe, t.markerChipBottom),
    scienceTag: p(data?.scienceTag, data?.scienceTagDe, t.scienceTag),
    scienceTitle: p(data?.scienceTitle, data?.scienceTitleDe, t.scienceTitle),
    scienceTitleEm: p(data?.scienceTitleEm, data?.scienceTitleEmDe, t.scienceTitleEm),
    scienceDownLead: p(data?.scienceDownLead, data?.scienceDownLeadDe, t.scienceDownLead),
    scienceDownTail: p(data?.scienceDownTail, data?.scienceDownTailDe, t.scienceDownTail),
    ucLabelLead: p(data?.missionUcLabelLead, data?.missionUcLabelLeadDe, t.ucLabelLead),
    ucLabelTail: p(data?.missionUcLabelTail, data?.missionUcLabelTailDe, t.ucLabelTail),
    methodTag: p(data?.missionMethodTag, data?.missionMethodTagDe, t.methodTag),
    methodTitle: p(data?.missionMethodTitle, data?.missionMethodTitleDe, t.methodTitle),
    methodTitleEm: p(data?.missionMethodTitleEm, data?.missionMethodTitleEmDe, t.methodTitleEm),
    outputLabel: p(data?.missionOutputLabel, data?.missionOutputLabelDe, t.outputLabel),
    outputSub: p(data?.missionOutputSub, data?.missionOutputSubDe, t.outputSub),
    outputScoreSuffix: p(data?.missionOutputScoreSuffix, data?.missionOutputScoreSuffixDe, t.outputScoreSuffix),
    synthesisLabel: p(data?.missionSynthesisLabel, data?.missionSynthesisLabelDe, t.synthesisLabel),
  }

  const missionBody = (() => {
    const raw = p(data?.missionBody, data?.missionBodyDe, null)
    if (raw) return renderText(raw)
    return t.missionBody
  })()

  const scienceBody = (() => {
    const raw = p(data?.scienceBody, data?.scienceBodyDe, null)
    if (raw) return renderText(raw)
    return t.scienceBody
  })()

  const synthesisText = (() => {
    const raw = p(data?.missionSynthesisText, data?.missionSynthesisTextDe, null)
    if (raw) return renderText(raw)
    return <>{t.synthesisLead}<em>{t.synthesisEm}</em>{t.synthesisTail}</>
  })()

  const useCases = data?.missionUseCases?.map(uc => ({
    tag: isDE ? (uc.tagDe || uc.tag) : uc.tag,
    title: isDE ? (uc.titleDe || uc.title) : uc.title,
    titleEm: isDE ? (uc.titleEmDe || uc.titleEm) : uc.titleEm,
    meta: isDE ? (uc.metaDe || uc.meta) : uc.meta,
  }))
  const ucSport = useCases?.[0] || t.ucSport
  const ucAging = useCases?.[1] || t.ucAging
  const ucRobotics = useCases?.[2] || t.ucRobotics

  const instruments = data?.missionInstruments?.map(inst => ({
    num: isDE ? (inst.numDe || inst.num) : inst.num,
    title: isDE ? (inst.titleDe || inst.title) : inst.title,
    sub: isDE ? (inst.subDe || inst.sub) : inst.sub,
  })) || t.instruments

  const portraitImageUrl = data?.missionPortraitImage?.asset?.url

  return (
    <section id="science" className="ms-v2 relative overflow-hidden py-20 md:py-28">
      <div className="ms-atmosphere" aria-hidden="true" />

      <div className="ms-shell">
        {/* ── header ── */}
        <motion.header {...sectionReveal()} className="ms-head">
          <div className="ms-overline-pair">
            <span>{c.missionOverline}</span>
            <span className="ms-sep" aria-hidden="true" />
            <span>{c.scienceOverline}</span>
          </div>
          <h2 className="ms-display">
            {c.headlineLead} <em>{c.headlineEm}</em>
          </h2>
        </motion.header>

        {/* ── triptych: mission | portrait | science ── */}
        <motion.div {...sectionReveal(0.1)} className="ms-triptych">
          {/* LEFT · Mission */}
          <div className="ms-panel ms-panel-mission">
            <div className="ms-panel-num">01</div>
            <div className="ms-panel-tag">{c.missionTag}</div>
            <h3>
              {c.missionTitle} <em>{c.missionTitleEm}</em>
            </h3>
            <p className="ms-body">{missionBody}</p>
            <div className="ms-panel-down">
              {c.missionDownLead} <b>{c.missionDownTail}</b>
            </div>
          </div>

          {/* CENTRE · Portrait */}
          <div className="ms-panel ms-panel-portrait">
            <div className="ms-portrait-frame">
              {portraitImageUrl ? (
                <Image
                  src={portraitImageUrl}
                  alt={locale === 'de' ? 'Bewegungsanalyse im VANE Labor in Wien' : 'Movement analysis in the VANE lab in Vienna'}
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                />
              ) : (
                // Local blueprint-style fallback until a real lab photo is set in Sanity.
                <div className="ms-portrait-fallback" aria-hidden="true" />
              )}
              <div className="ms-portrait-overlay" aria-hidden="true">
                <svg viewBox="0 0 400 620" preserveAspectRatio="none">
                  <circle className="ms-marker-dot d1" cx="212" cy="120" r="3.8" />
                  <circle className="ms-marker-dot d2" cx="196" cy="220" r="3.8" />
                  <circle className="ms-marker-dot d3" cx="232" cy="330" r="3.8" />
                  <circle className="ms-marker-dot d4" cx="188" cy="440" r="3.8" />

                  <path className="ms-marker-line" d="M 215 120 L 305 82 L 378 82" />
                  <text className="ms-marker-chip" x="308" y="78">{c.markerChipTop}</text>

                  <path className="ms-marker-line" d="M 188 440 L 108 484 L 22 484" />
                  <text className="ms-marker-chip" x="22" y="480">{c.markerChipBottom}</text>
                </svg>
              </div>
              <div className="ms-portrait-top">
                <span className="ms-live">{c.portraitLive}</span>
                <span>{c.portraitRec}</span>
              </div>
              <figcaption className="ms-portrait-caption">
                <div>
                  {c.portraitWhoLabel}
                  <b>{c.portraitWhoName}</b>
                </div>
                <div className="ms-where">
                  {c.portraitWhereLabel}
                  <b>{c.portraitWhereSub}</b>
                </div>
              </figcaption>
            </div>
          </div>

          {/* RIGHT · Science */}
          <div className="ms-panel ms-panel-science">
            <div className="ms-panel-num">02</div>
            <div className="ms-panel-tag">{c.scienceTag}</div>
            <h3>
              {c.scienceTitle} <em>{c.scienceTitleEm}</em>
            </h3>
            <p className="ms-body">{scienceBody}</p>
            <div className="ms-panel-down">
              {c.scienceDownLead} <b>{c.scienceDownTail}</b>
            </div>
          </div>
        </motion.div>

        {/* ── use cases ── */}
        <motion.div {...sectionReveal(0.15)} className="ms-use-cases">
          <div className="ms-uc-label-row">
            <span className="ms-uc-section-label">
              {c.ucLabelLead} <b>{c.ucLabelTail}</b>
            </span>
          </div>

          <div className="ms-uc-grid">
            {/* SPORT · red */}
            <article className="ms-uc-card ms-uc-sport">
              <div className="ms-uc-icon" aria-hidden="true">
                <svg viewBox="0 0 120 120">
                  <line x1="10" y1="98" x2="110" y2="98" stroke="currentColor" strokeWidth="1" opacity="0.25" strokeDasharray="3 4" />
                  <path d="M 18 98 Q 60 22, 102 98" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.18" />
                  <path d="M 18 98 Q 60 30, 102 98" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.12" />
                  <path d="M 18 98 Q 60 10, 102 98" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="60" cy="10" r="4" fill="currentColor" />
                  <circle cx="60" cy="10" r="9" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5" />
                  <circle cx="18" cy="98" r="3" fill="none" stroke="currentColor" strokeWidth="1.5" />
                  <circle cx="102" cy="98" r="3" fill="none" stroke="currentColor" strokeWidth="1.5" />
                  <line x1="34" y1="104" x2="40" y2="104" stroke="currentColor" strokeWidth="1" opacity="0.4" />
                  <line x1="52" y1="104" x2="58" y2="104" stroke="currentColor" strokeWidth="1" opacity="0.4" />
                  <line x1="70" y1="104" x2="76" y2="104" stroke="currentColor" strokeWidth="1" opacity="0.4" />
                </svg>
              </div>
              <div className="ms-uc-tag">{ucSport.tag}</div>
              <h4>
                {ucSport.title} <em>{ucSport.titleEm}</em>
              </h4>
              <div className="ms-uc-meta">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M5 12 L 10 17 L 19 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {ucSport.meta}
              </div>
            </article>

            {/* AGING · green */}
            <article className="ms-uc-card ms-uc-aging">
              <div className="ms-uc-icon" aria-hidden="true">
                <svg viewBox="0 0 120 120">
                  <line x1="10" y1="32" x2="110" y2="32" stroke="currentColor" strokeWidth="1" opacity="0.14" strokeDasharray="2 3" />
                  <line x1="10" y1="60" x2="110" y2="60" stroke="currentColor" strokeWidth="1" opacity="0.14" strokeDasharray="2 3" />
                  <line x1="10" y1="88" x2="110" y2="88" stroke="currentColor" strokeWidth="1" opacity="0.14" strokeDasharray="2 3" />
                  <path d="M 10 24 Q 40 32, 60 52 T 110 96" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.28" strokeDasharray="3 3" />
                  <path d="M 10 74 Q 36 44, 60 28 T 110 22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="110" cy="22" r="4" fill="currentColor" />
                  <circle cx="110" cy="22" r="9" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5" />
                  <circle cx="10" cy="74" r="3" fill="none" stroke="currentColor" strokeWidth="1.5" />
                  <text x="8" y="114" fontFamily="var(--font-mono)" fontSize="7" fill="currentColor" opacity="0.5" letterSpacing="1">25</text>
                  <text x="54" y="114" fontFamily="var(--font-mono)" fontSize="7" fill="currentColor" opacity="0.5" letterSpacing="1">50</text>
                  <text x="100" y="114" fontFamily="var(--font-mono)" fontSize="7" fill="currentColor" opacity="0.5" letterSpacing="1">75</text>
                </svg>
              </div>
              <div className="ms-uc-tag">{ucAging.tag}</div>
              <h4>
                {ucAging.title} <em>{ucAging.titleEm}</em>
              </h4>
              <div className="ms-uc-meta">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M4 18 L 10 12 L 14 16 L 20 8 M 20 8 L 15 8 M 20 8 L 20 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {ucAging.meta}
              </div>
            </article>

            {/* ROBOTICS · accent */}
            <article className="ms-uc-card ms-uc-robotics">
              <div className="ms-uc-icon" aria-hidden="true">
                <svg viewBox="0 0 120 120">
                  <line x1="10" y1="100" x2="110" y2="100" stroke="currentColor" strokeWidth="1" opacity="0.25" strokeDasharray="3 4" />
                  <line x1="54" y1="50" x2="72" y2="50" stroke="currentColor" strokeWidth="1" opacity="0.45" strokeDasharray="2 2.5" />
                  <g stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none">
                    <circle cx="38" cy="28" r="6.5" fill="currentColor" />
                    <line x1="38" y1="35" x2="38" y2="66" />
                    <line x1="38" y1="44" x2="26" y2="58" />
                    <line x1="38" y1="44" x2="50" y2="56" />
                    <line x1="38" y1="66" x2="30" y2="98" />
                    <line x1="38" y1="66" x2="46" y2="98" />
                  </g>
                  <g stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round">
                    <rect x="74" y="20" width="18" height="18" />
                    <line x1="83" y1="20" x2="83" y2="14" />
                    <circle cx="83" cy="12" r="1.6" fill="currentColor" />
                    <circle cx="79" cy="28" r="1.1" fill="currentColor" />
                    <circle cx="87" cy="28" r="1.1" fill="currentColor" />
                    <line x1="80" y1="33" x2="86" y2="33" />
                    <rect x="76" y="40" width="14" height="26" />
                    <line x1="82" y1="46" x2="82" y2="58" />
                    <line x1="76" y1="46" x2="66" y2="58" />
                    <line x1="90" y1="46" x2="100" y2="58" />
                    <line x1="80" y1="66" x2="78" y2="98" />
                    <line x1="86" y1="66" x2="88" y2="98" />
                  </g>
                  <circle cx="38" cy="14" r="1.6" fill="currentColor" />
                  <circle cx="83" cy="6" r="1.6" fill="currentColor" />
                </svg>
              </div>
              <div className="ms-uc-tag">{ucRobotics.tag}</div>
              <h4>
                {ucRobotics.title} <em>{ucRobotics.titleEm}</em>
              </h4>
              <div className="ms-uc-meta">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M4 12 L 20 12 M 14 6 L 20 12 L 14 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {ucRobotics.meta}
              </div>
            </article>
          </div>
        </motion.div>

        {/* ── science method · convergence pipeline ── */}
        <motion.div {...sectionReveal(0.15)} className="ms-science-method">
          <div className="ms-method-header">
            <div className="ms-method-tag">{c.methodTag}</div>
            <h3 className="ms-method-title">
              {c.methodTitle} <em>{c.methodTitleEm}</em>
            </h3>
          </div>

          <div className="ms-convergence">
            {/* LEFT · three instruments */}
            <div className="ms-instruments">
              {/* 01 · Motion Capture */}
              <article className="ms-instrument">
                <div className="ms-inst-viz">
                  <svg viewBox="0 0 120 90">
                    <g stroke="var(--ms-ink-muted)" strokeWidth="1" fill="none">
                      <g transform="translate(4 6)">
                        <rect x="0" y="0" width="14" height="10" rx="1" />
                        <circle cx="7" cy="5" r="2.6" />
                        <path d="M 14 3 L 17 1 M 14 7 L 17 9" />
                      </g>
                      <g transform="translate(102 6)">
                        <rect x="0" y="0" width="14" height="10" rx="1" />
                        <circle cx="7" cy="5" r="2.6" />
                        <path d="M 0 3 L -3 1 M 0 7 L -3 9" />
                      </g>
                      <g transform="translate(4 74)">
                        <rect x="0" y="0" width="14" height="10" rx="1" />
                        <circle cx="7" cy="5" r="2.6" />
                        <path d="M 14 3 L 17 1 M 14 7 L 17 9" />
                      </g>
                      <g transform="translate(102 74)">
                        <rect x="0" y="0" width="14" height="10" rx="1" />
                        <circle cx="7" cy="5" r="2.6" />
                        <path d="M 0 3 L -3 1 M 0 7 L -3 9" />
                      </g>
                    </g>
                    <g stroke="var(--ms-ink-ghost)" strokeWidth="0.7" strokeDasharray="1.5 2.5" fill="none">
                      <line x1="18" y1="16" x2="54" y2="34" />
                      <line x1="102" y1="16" x2="66" y2="34" />
                      <line x1="18" y1="74" x2="56" y2="58" />
                      <line x1="102" y1="74" x2="64" y2="58" />
                    </g>
                    <g stroke="var(--ms-ink)" strokeWidth="1" strokeLinecap="round" fill="none">
                      <circle cx="60" cy="30" r="3.5" />
                      <line x1="60" y1="33.5" x2="60" y2="54" />
                      <line x1="54" y1="38" x2="66" y2="38" />
                      <line x1="54" y1="38" x2="48" y2="50" />
                      <line x1="66" y1="38" x2="72" y2="50" />
                      <line x1="60" y1="54" x2="54" y2="68" />
                      <line x1="60" y1="54" x2="66" y2="68" />
                    </g>
                    <g fill="var(--mqs-accent)">
                      <circle cx="60" cy="30" r="1.4" />
                      <circle cx="54" cy="38" r="1.4" />
                      <circle cx="66" cy="38" r="1.4" />
                      <circle cx="60" cy="44" r="1.4" />
                      <circle cx="48" cy="50" r="1.4" />
                      <circle cx="72" cy="50" r="1.4" />
                      <circle cx="60" cy="54" r="1.4" />
                      <circle cx="54" cy="68" r="1.4" />
                      <circle cx="66" cy="68" r="1.4" />
                    </g>
                  </svg>
                </div>
                <div className="ms-inst-meta">
                  <span className="ms-inst-num">{instruments[0].num}</span>
                  <h4 className="ms-inst-title">{instruments[0].title}</h4>
                  <span className="ms-inst-sub">{instruments[0].sub}</span>
                </div>
              </article>

              {/* 02 · Force Plates */}
              <article className="ms-instrument">
                <div className="ms-inst-viz">
                  <svg viewBox="0 0 120 90">
                    <line x1="6" y1="78" x2="114" y2="78" stroke="var(--ms-ink-ghost)" strokeWidth="0.7" strokeDasharray="2 3" />
                    <g stroke="var(--ms-ink)" strokeWidth="1.2" fill="none">
                      <path d="M 24 60 L 86 60 L 98 52 L 36 52 Z" fill="var(--ms-bg-soft)" />
                      <path d="M 24 60 L 24 66 L 86 66 L 86 60" />
                      <path d="M 86 66 L 86 60 L 98 52 L 98 58 Z" />
                    </g>
                    <g stroke="var(--ms-ink-ghost)" strokeWidth="0.5" fill="none">
                      <line x1="42" y1="58" x2="54" y2="52" />
                      <line x1="58" y1="58" x2="70" y2="52" />
                      <line x1="74" y1="58" x2="86" y2="52" />
                    </g>
                    <ellipse cx="61" cy="56" rx="12" ry="3" fill="none" stroke="var(--mqs-accent)" strokeWidth="1" opacity="0.7" />
                    <g stroke="var(--mqs-accent)" strokeWidth="1.5" strokeLinecap="round" fill="none">
                      <line x1="48" y1="54" x2="48" y2="26" />
                      <path d="M 44.5 30 L 48 26 L 51.5 30" />
                      <line x1="61" y1="52" x2="61" y2="14" />
                      <path d="M 57.5 18 L 61 14 L 64.5 18" />
                      <line x1="74" y1="54" x2="74" y2="28" />
                      <path d="M 70.5 32 L 74 28 L 77.5 32" />
                    </g>
                    <g fontFamily="var(--font-mono)" fontSize="6" fill="var(--ms-ink-muted)" letterSpacing="0.5">
                      <text x="38" y="24">1.2k</text>
                      <text x="50" y="12">2.8k</text>
                      <text x="76" y="26">1.4k</text>
                    </g>
                    <text x="6" y="88" fontFamily="var(--font-mono)" fontSize="6" fill="var(--ms-ink-faint)" letterSpacing="1">N · GROUND REACTION</text>
                  </svg>
                </div>
                <div className="ms-inst-meta">
                  <span className="ms-inst-num">{instruments[1].num}</span>
                  <h4 className="ms-inst-title">{instruments[1].title}</h4>
                  <span className="ms-inst-sub">{instruments[1].sub}</span>
                </div>
              </article>

              {/* 03 · Strength Testing */}
              <article className="ms-instrument">
                <div className="ms-inst-viz">
                  <svg viewBox="0 0 120 90">
                    <path d="M 20 68 A 40 40 0 0 1 100 68" fill="none" stroke="var(--ms-ink-muted)" strokeWidth="1.2" />
                    <g stroke="var(--ms-ink-muted)" strokeWidth="1" strokeLinecap="round">
                      <line x1="20" y1="68" x2="17" y2="74" />
                      <line x1="26" y1="48" x2="22" y2="44" />
                      <line x1="40" y1="34" x2="37" y2="29" />
                      <line x1="60" y1="28" x2="60" y2="22" />
                      <line x1="80" y1="34" x2="83" y2="29" />
                      <line x1="94" y1="48" x2="98" y2="44" />
                      <line x1="100" y1="68" x2="103" y2="74" />
                    </g>
                    <path d="M 72 32 A 40 40 0 0 1 100 68" fill="none" stroke="var(--mqs-accent)" strokeWidth="2" strokeLinecap="round" />
                    <line x1="60" y1="68" x2="84" y2="38" stroke="var(--ms-ink)" strokeWidth="1.6" strokeLinecap="round" />
                    <circle cx="60" cy="68" r="3" fill="var(--ms-bg)" stroke="var(--ms-ink)" strokeWidth="1.2" />
                    <g fontFamily="var(--font-mono)" fontSize="5.5" fill="var(--ms-ink-faint)" letterSpacing="0.4">
                      <text x="12" y="82">0</text>
                      <text x="56" y="18">MAX</text>
                      <text x="100" y="82">kN</text>
                    </g>
                    <text x="60" y="86" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="7" fill="var(--mqs-value-inv)" letterSpacing="1">1.82 kN</text>
                  </svg>
                </div>
                <div className="ms-inst-meta">
                  <span className="ms-inst-num">{instruments[2].num}</span>
                  <h4 className="ms-inst-title">{instruments[2].title}</h4>
                  <span className="ms-inst-sub">{instruments[2].sub}</span>
                </div>
              </article>
            </div>

            {/* CENTER · convergence connector */}
            <div className="ms-connectors" aria-hidden="true">
              <svg viewBox="0 0 160 440" preserveAspectRatio="none">
                <path className="ms-line l1" d="M 0 72 C 70 72, 70 220, 160 220" />
                <path className="ms-line l2" d="M 0 220 L 160 220" />
                <path className="ms-line l3" d="M 0 368 C 70 368, 70 220, 160 220" />
                <circle className="ms-joint" cx="160" cy="220" r="3.5" />
                <circle className="ms-pulse p1" cx="80" cy="146" r="2.2" />
                <circle className="ms-pulse p2" cx="80" cy="220" r="2.2" />
                <circle className="ms-pulse p3" cx="80" cy="294" r="2.2" />
              </svg>
            </div>

            {/* RIGHT · MQS output */}
            <div className="ms-output">
              <div className="ms-output-frame">
                <div className="ms-mqs-ring">
                  <svg className="ms-ring" viewBox="0 0 200 200">
                    <circle className="ms-ring-base" cx="100" cy="100" r="80" />
                    <circle className="ms-ring-fg" cx="100" cy="100" r="80" />
                  </svg>
                  <div className="ms-score-value">
                    <span className="ms-score-num">58</span>
                    <span className="ms-score-suf">{c.outputScoreSuffix}</span>
                  </div>
                </div>
                <div className="ms-output-meta">
                  <span className="ms-out-label">{c.outputLabel}</span>
                  <span className="ms-out-sub">{c.outputSub}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── synthesis closing ── */}
        <motion.div {...sectionReveal()} className="ms-signature">
          <div className="ms-mark">{c.synthesisLabel}</div>
          <p>
            {synthesisText}
          </p>
        </motion.div>
      </div>
    </section>
  )
}

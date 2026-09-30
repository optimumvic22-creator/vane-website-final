'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { sectionReveal, staggerReveal, staggerItem } from '@/lib/motion'
import { useLocale } from '@/lib/locale'
import { trackEvent } from '@/lib/analytics'
import { Section } from '@/components/ui/section'
import { Container } from '@/components/ui/container'
import { Button } from '@/components/ui/button'
import { FOUNDERS } from '@/lib/founders'

type Category = { name: string; note: string }
type Point = { title: string; desc: string }
type Layer = { num: string; name: string; items: string[] }
type Phase = { phase: string; items: string[] }

type Content = {
  heroOverline: string
  heroHeadline: string
  heroSubline: string
  heroLead: string

  problemOverline: string
  problemTitle: string
  problemBody: string
  categories: Category[]

  productOverline: string
  productTitle: string
  productLead: string
  points: Point[]

  moatOverline: string
  moatTitle: string
  moatBody: string
  moatNote: string

  modelOverline: string
  modelTitle: string
  layers: Layer[]

  valueStatement: string
  valueNote: string

  roadmapOverline: string
  roadmapTitle: string
  phases: Phase[]

  longTermTag: string
  longTermBody: string

  foundationOverline: string
  foundationTitle: string
  foundationBody: string
  founderLine: string
  founderMeta: string
  ctoLine: string
  ctoMeta: string

  ctaTitle: string
  ctaBody: string
  ctaButton: string
  ctaSubject: string
  bottomNote: string
}

const stripSoftHyphens = (value: string) => value.replace(/\u00AD/g, '')

const en: Content = {
  heroOverline: 'For investors',
  heroHeadline: 'VANE Science is building the standardized assessment infrastructure for human movement quality.',
  heroSubline: 'A standardized decision layer for human movement quality.',
  heroLead: 'The product starts with premium testing and reporting logic, then scales through partner sites, NormVault, and population level benchmarks.',

  problemOverline: '01 · The problem',
  problemTitle: 'The data exists. Decision quality doesn’t.',
  problemBody: 'Movement data is everywhere, yet fragmented. There is no shared standard for what good movement means, no common scale, and no comparable progress logic. The gap sits between expensive research and lab solutions on one side and simple tracking apps on the other.',
  categories: [
    { name: 'Force plates', note: 'Strong data, but isolated point measurements.' },
    { name: 'Motion capture', note: 'Precise, but hard to scale beyond the lab.' },
    { name: 'Video analysis', note: 'Visible, but subjective.' },
    { name: 'Wearables', note: 'They scale, but measure volume rather than movement quality. A complement, not a competitor.' },
  ],

  productOverline: '02 · The product',
  productTitle: 'MQS: one standard for assessment, scoring, and reporting.',
  productLead: 'The MQS makes movement quality measurable, comparable, and manageable over time.',
  points: [
    { title: 'One score, seven domains', desc: 'Gait, postural control, force, power, motor control, neuro response, and dual task cost form a profile, never a single number in isolation.' },
    { title: 'Reports that support decisions', desc: 'VANE interprets the assessment findings and highlights priorities. Professionals use that context to decide what to do next.' },
    { title: 'Retest at the core', desc: 'A baseline and retest make change over time visible. The results support a review of training or rehabilitation alongside professional judgment.' },
    { title: 'Hardware neutral', desc: 'Runs on the standard force plate and camera setups facilities already own. No proprietary hardware, no capex barrier.' },
  ],

  moatOverline: '03 · The moat',
  moatTitle: 'NormVault: the benchmark data asset.',
  moatBody: 'NormVault is VANE’s proprietary benchmark data asset. Suitable assessment data can strengthen the reference base after quality review and the required permissions. The value depends on consistent protocols, relevant comparison groups, and responsible interpretation, not simply on collecting more data.',
  moatNote: 'The Vienna lab is the proof node, not the end product.',

  modelOverline: '04 · Business model',
  modelTitle: 'Three revenue layers.',
  layers: [
    { num: 'Layer 01', name: 'Local', items: ['Assessments', 'Retests', 'Team testing days', 'Progress reporting'] },
    { num: 'Layer 02', name: 'Partner', items: ['Onboarding', 'Protocol access', 'Reporting tools', 'Site licensing', 'Education'] },
    { num: 'Layer 03', name: 'Platform', items: ['NormVault benchmarking', 'Data products', 'APIs', 'Research datasets'] },
  ],

  valueStatement: 'Recurring revenue + proprietary data + protocols + API + B2B = enterprise value.',
  valueNote: 'Hardware neutrality widens the market surface. Every facility with standard equipment is a potential site without additional hardware capital expenditure.',

  roadmapOverline: '05 · Roadmap',
  roadmapTitle: '24 months, three stages.',
  phases: [
    { phase: '0 to 6 months', items: ['MQS v1', 'First reports', 'SOPs', 'Data model', 'First paying customers'] },
    { phase: '6 to 12 months', items: ['250 to 500 assessments', 'Retests', 'First B2B customers', 'Cloud prototype', 'Cohort logic'] },
    { phase: '12 to 24 months', items: ['1,000+ assessments', '300+ retests', 'NormVault beta', 'Partner customers', 'Recurring revenue'] },
  ],

  longTermTag: 'Long term',
  longTermBody: 'Beyond 24 months, the same standardized data layer can serve research and robotics as a movement data platform. This is a long term option, not the immediate plan.',

  foundationOverline: '06 · Foundation',
  foundationTitle: 'Built from a real performance practice.',
  foundationBody: 'VANE is not a whiteboard concept. It grows out of a Vienna reference lab with motion capture, force plates, and standardized protocols, plus work with elite athletes since 2019. Clients include Bundesliga football, top European basketball, and national team athletes. An evidence led content strategy acts as the demand and trust engine.',
  founderLine: FOUNDERS.dario.name,
  founderMeta: 'Founder · BSc Sport Science, University of Vienna',
  ctoLine: FOUNDERS.cto.name,
  ctoMeta: FOUNDERS.cto.role.en,

  ctaTitle: 'The full picture, in person.',
  ctaBody: 'We deliberately keep funding terms, valuation, and pricing off this page. They are discussed directly.',
  ctaButton: 'Request the full briefing →',
  ctaSubject: 'VANE Science: Investor Briefing Request',
  bottomNote: 'Investor materials are available on request. No regional rights or commitments arise from this page.',
}

const de: Content = {
  heroOverline: 'Für Investoren',
  heroHeadline: 'VANE Science baut mit MQS eine standardisierte Bewertungs\u00ADinfrastruktur für Human Movement Quality.',
  heroSubline: 'Eine standardisierte Entscheidungsebene für Human Movement Quality.',
  heroLead: 'Das Produkt startet als premiumfähige Test- und Reportlogik und skaliert über Partnerstandorte, NormVault und populationsbezogene Benchmarks.',

  problemOverline: '01 · Das Problem',
  problemTitle: 'Daten gibt es. Entscheidungsqualität fehlt.',
  problemBody: 'Bewegungsdaten sind überall und dennoch fragmentiert. Es gibt keinen gemeinsamen Standard dafür, was gute Bewegung bedeutet, keine gemeinsame Skala und keine vergleichbare Verlaufslogik. Die Lücke liegt zwischen teuren Lösungen aus Forschung und Labor auf der einen und einfachen Tracking Apps auf der anderen Seite.',
  categories: [
    { name: 'Kraftmessplatten', note: 'Starke Daten, aber isolierte Punktmessungen.' },
    { name: 'Motion Capture', note: 'Präzise, aber schwer über das Labor hinaus skalierbar.' },
    { name: 'Videoanalyse', note: 'Sichtbar, aber subjektiv.' },
    { name: 'Wearables', note: 'Sie skalieren, messen aber Volumen statt Bewegungsqualität. Ein Komplement, kein Gegner.' },
  ],

  productOverline: '02 · Das Produkt',
  productTitle: 'MQS: ein Standard für Assessment, Scoring und Reports.',
  productLead: 'MQS macht Bewegungsqualität messbar, vergleichbar und über Zeit steuerbar.',
  points: [
    { title: 'Ein Score, sieben Domänen', desc: 'Gangbild, posturale Kontrolle, Kraftfähigkeit, Power, motorische Kontrolle, Neuro Response und Dual Task Cost bilden ein Profil, nie eine isolierte Einzelzahl.' },
    { title: 'Reports als Entscheidungsgrundlage', desc: 'VANE interpretiert die Ergebnisse und zeigt Prioritäten auf. Fachpersonen nutzen diese Einordnung für ihre nächsten Entscheidungen.' },
    { title: 'Retest als Kern', desc: 'Ausgangsmessung und Retest machen Veränderungen im Verlauf sichtbar. Gemeinsam mit der fachlichen Einschätzung helfen sie, Training oder Rehabilitation zu beurteilen.' },
    { title: 'Hardware neutral', desc: 'Läuft auf den vorhandenen Setups mit Kraftmessplatten und Kameras. Keine proprietäre Hardware, keine Hürde durch zusätzliche Investitionskosten.' },
  ],

  moatOverline: '03 · Der Moat',
  moatTitle: 'NormVault: der Bestand an Benchmarkdaten.',
  moatBody: 'NormVault ist VANEs proprietärer Bestand an Benchmarkdaten. Geeignete Assessmentdaten können die Referenzbasis nach einer Qualitätsprüfung und mit den erforderlichen Freigaben stärken. Entscheidend sind einheitliche Protokolle, relevante Vergleichsgruppen und eine verantwortungsvolle Einordnung, nicht allein die Datenmenge.',
  moatNote: 'Das Wiener Labor ist der Proof Node, nicht das Endprodukt.',

  modelOverline: '04 · Geschäftsmodell',
  modelTitle: 'Drei Umsatzebenen.',
  layers: [
    { num: 'Ebene 01', name: 'Local', items: ['Assessments', 'Retests', 'Testtage für Teams', 'Verlaufsreports'] },
    { num: 'Ebene 02', name: 'Partner', items: ['Onboarding', 'Protokollzugang', 'Tools für Reports', 'Standortlizenzen', 'Education'] },
    { num: 'Ebene 03', name: 'Platform', items: ['Benchmarking mit NormVault', 'Datenprodukte', 'APIs', 'Forschungsdatensätze'] },
  ],

  valueStatement: 'Recurring Revenue + proprietäre Daten + Protokolle + API + B2B = Enterprise Value.',
  valueNote: 'Hardwareunabhängigkeit vergrößert die Marktoberfläche. Jede Einrichtung mit vorhandener Standardausstattung ist ohne zusätzliche Hardwareinvestitionen ein potenzieller Standort.',

  roadmapOverline: '05 · Roadmap',
  roadmapTitle: '24 Monate, drei Stufen.',
  phases: [
    { phase: '0 bis 6 Monate', items: ['MQS v1', 'Erste Reports', 'SOPs', 'Datenmodell', 'Erste zahlende Kunden'] },
    { phase: '6 bis 12 Monate', items: ['250 bis 500 Assessments', 'Retests', 'Erste B2B Kunden', 'Cloudprototyp', 'Kohortenlogik'] },
    { phase: '12 bis 24 Monate', items: ['1.000+ Assessments', '300+ Retests', 'NormVault Beta', 'Partnerkunden', 'Wiederkehrende Umsätze'] },
  ],

  longTermTag: 'Langfristig',
  longTermBody: 'Nach 24 Monaten kann dieselbe standardisierte Datenebene Forschung und Robotik als Plattform für Bewegungsdaten dienen. Das ist eine langfristige Option, nicht der kurzfristige Plan.',

  foundationOverline: '06 · Fundament',
  foundationTitle: 'Gebaut aus echter Performancepraxis.',
  foundationBody: 'VANE ist kein Whiteboardkonzept. Es wächst aus einem Wiener Referenzlabor mit Motion Capture, Kraftmessplatten und standardisierten Protokollen sowie aus der Arbeit mit Spitzensportlern seit 2019. Dazu zählen Kunden aus der Fußball Bundesliga, dem europäischen Spitzenbasketball und Nationalteams. Eine belegorientierte Contentstrategie wirkt als Nachfrage und Vertrauensmotor.',
  founderLine: FOUNDERS.dario.name,
  founderMeta: 'Founder · BSc Sportwissenschaft, Universität Wien',
  ctoLine: FOUNDERS.cto.name,
  ctoMeta: FOUNDERS.cto.role.de,

  ctaTitle: 'Das vollständige Bild besprechen wir persönlich.',
  ctaBody: 'Fundingbedingungen, Bewertung und Preise halten wir bewusst von dieser Seite fern. Sie werden im direkten Gespräch besprochen.',
  ctaButton: 'Vollständiges Briefing anfragen →',
  ctaSubject: 'VANE Science: Anfrage für ein Investor Briefing',
  bottomNote: 'Investorenunterlagen auf Anfrage. Aus dieser Seite entstehen keine Gebietsrechte oder verbindlichen Zusagen.',
}

function OverlineRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-5 flex items-center gap-3 font-sans text-[13px] font-semibold uppercase tracking-[0.1em] text-[var(--mqs-value-inv)] md:text-sm">
      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--mqs-value-inv)]" aria-hidden="true" />
      {children}
    </div>
  )
}

export function InvestorsContent() {
  const { locale } = useLocale()
  const t = locale === 'de' ? de : en

  const mailtoHref = `mailto:team@vanescience.com?subject=${encodeURIComponent(t.ctaSubject)}`
  const availability = locale === 'de'
    ? [
        { title: 'Heute verfügbar', desc: 'Assessments im VANE Training Lab in Wien' },
        { title: 'In Entwicklung', desc: 'MQS für Coaches und Partner mit Warteliste' },
        { title: 'Langfristige Perspektive', desc: 'Plattform, Datenprodukte und Forschung' },
      ]
    : [
        { title: 'Available today', desc: 'Assessments at the VANE Training Lab in Vienna' },
        { title: 'In development', desc: 'MQS for coaches and partners with a waitlist' },
        { title: 'Long term direction', desc: 'Platform, data products, and research' },
      ]

  // Consent-gated: trackEvent is a no-op until analytics consent is granted.
  useEffect(() => {
    trackEvent('investor_page_view', { page: 'investors' })
  }, [])

  return (
    <>
      {/* ── Hero ── */}
      <Section spacing="xl">
        <Container size="md">
          <motion.div {...sectionReveal()} initial={false}>
            <OverlineRow>{t.heroOverline}</OverlineRow>
            <h1
              aria-label={stripSoftHyphens(t.heroHeadline)}
              className="max-w-4xl break-normal font-display text-4xl font-bold uppercase leading-[1.08] tracking-[0.02em] text-foreground [-webkit-text-stroke:0.2px_currentColor] [hyphens:manual] [paint-order:stroke_fill] md:text-6xl"
            >
              {t.heroHeadline}
            </h1>
            <p className="mt-5 max-w-2xl font-sans text-sm font-medium leading-relaxed text-foreground/80">
              {t.heroSubline}
            </p>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              {t.heroLead}
            </p>
            <div className="mt-8">
              <Button asChild className="h-auto min-h-12 max-w-full whitespace-normal px-6 py-3 text-center">
                <a href={mailtoHref} onClick={() => trackEvent('investor_cta_click', { location: 'investors_hero', action: 'briefing_request' })}>{t.ctaButton}</a>
              </Button>
            </div>
            <dl className="mt-10 grid gap-5 border-t border-border/20 pt-6 sm:grid-cols-3">
              {availability.map((item) => (
                <div key={item.title}>
                  <dt className="text-sm font-semibold text-foreground">{item.title}</dt>
                  <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.desc}</dd>
                </div>
              ))}
            </dl>
          </motion.div>
        </Container>
      </Section>

      {/* ── Problem ── */}
      <Section spacing="lg" divided>
        <Container size="md">
          <motion.div {...sectionReveal()}>
            <OverlineRow>{t.problemOverline}</OverlineRow>
            <h2 className="font-display text-[32px] font-bold uppercase leading-[1.08] tracking-[0.02em] text-foreground [-webkit-text-stroke:0.2px_currentColor] [paint-order:stroke_fill] md:text-[44px]">
              {t.problemTitle}
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
              {t.problemBody}
            </p>
          </motion.div>
          <motion.div {...staggerReveal()} className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {t.categories.map((cat) => (
              <motion.div
                key={cat.name}
                {...staggerItem()}
                className="rounded-xl border border-border/15 bg-card/30 p-5"
              >
                <p className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-foreground">{cat.name}</p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{cat.note}</p>
              </motion.div>
            ))}
          </motion.div>
        </Container>
      </Section>

      {/* ── Product ── */}
      <Section spacing="lg" divided>
        <Container size="md">
          <motion.div {...sectionReveal()}>
            <OverlineRow>{t.productOverline}</OverlineRow>
            <h2 className="font-display text-[32px] font-bold uppercase leading-[1.08] tracking-[0.02em] text-foreground [-webkit-text-stroke:0.2px_currentColor] [paint-order:stroke_fill] md:text-[44px]">
              {t.productTitle}
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              {t.productLead}
            </p>
          </motion.div>
          <motion.div {...staggerReveal()} className="mt-10 grid gap-x-10 gap-y-8 md:grid-cols-2">
            {t.points.map((point, i) => (
              <motion.div key={point.title} {...staggerItem()} className="border-t border-border/15 pt-5">
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-[11px] tracking-[0.22em] text-primary">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="font-display text-[22px] font-bold uppercase leading-[1.1] tracking-[0.02em] text-foreground [-webkit-text-stroke:0.15px_currentColor] [paint-order:stroke_fill]">{point.title}</h3>
                </div>
                <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{point.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </Container>
      </Section>

      {/* ── Moat: NormVault ── */}
      <Section spacing="lg" divided background="surface">
        <Container size="md">
          <motion.div {...sectionReveal()}>
            <OverlineRow>{t.moatOverline}</OverlineRow>
            <h2 className="font-display text-[32px] font-bold uppercase leading-[1.08] tracking-[0.02em] text-foreground [-webkit-text-stroke:0.2px_currentColor] [paint-order:stroke_fill] md:text-[44px]">
              {t.moatTitle}
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
              {t.moatBody}
            </p>
            <p className="mt-8 max-w-[60ch] border-l-2 border-primary/40 pl-5 font-sans text-sm leading-[1.58] text-foreground/80 md:text-base">
              {t.moatNote}
            </p>
          </motion.div>
        </Container>
      </Section>

      {/* ── Business model ── */}
      <Section spacing="lg" divided>
        <Container size="md">
          <motion.div {...sectionReveal()}>
            <OverlineRow>{t.modelOverline}</OverlineRow>
            <h2 className="font-display text-[32px] font-bold uppercase leading-[1.08] tracking-[0.02em] text-foreground [-webkit-text-stroke:0.2px_currentColor] [paint-order:stroke_fill] md:text-[44px]">
              {t.modelTitle}
            </h2>
          </motion.div>
          <motion.div {...staggerReveal()} className="mt-10 grid gap-4 md:grid-cols-3">
            {t.layers.map((layer) => (
              <motion.div
                key={layer.name}
                {...staggerItem()}
                className="rounded-xl border border-border/15 bg-card/30 p-6"
              >
                <p className="font-sans text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground">{layer.num}</p>
                <p className="mt-2 text-lg font-normal text-foreground">{layer.name}</p>
                <ul className="mt-4 space-y-2">
                  {layer.items.map((item) => (
                    <li key={item} className="flex items-baseline gap-2.5 text-sm text-muted-foreground">
                      <span className="h-1 w-1 shrink-0 rounded-full bg-primary/60" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>

          {/* Value logic */}
          <motion.div {...sectionReveal(0.1)} className="mt-14 border-t border-border/15 pt-10 text-center">
            <p className="mx-auto max-w-[60ch] font-sans text-base font-medium leading-[1.58] text-foreground md:text-[17px]">
              {t.valueStatement}
            </p>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              {t.valueNote}
            </p>
          </motion.div>
        </Container>
      </Section>

      {/* ── Roadmap ── */}
      <Section spacing="lg" divided>
        <Container size="md">
          <motion.div {...sectionReveal()}>
            <OverlineRow>{t.roadmapOverline}</OverlineRow>
            <h2 className="font-display text-[32px] font-bold uppercase leading-[1.08] tracking-[0.02em] text-foreground [-webkit-text-stroke:0.2px_currentColor] [paint-order:stroke_fill] md:text-[44px]">
              {t.roadmapTitle}
            </h2>
            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              {locale === 'de'
                ? 'Diese Stufen und Mengen sind Planungsziele, keine bereits erreichten Ergebnisse. Den aktuellen Stand und die zeitliche Einordnung besprechen wir im Briefing.'
                : 'These stages and volumes are planning targets, not achieved results. Current progress and timing are covered in the briefing.'}
            </p>
          </motion.div>
          <motion.div {...staggerReveal()} className="mt-10 grid gap-8 md:grid-cols-3">
            {t.phases.map((col) => (
              <motion.div key={col.phase} {...staggerItem()}>
                <p className="border-b border-primary/30 pb-3 font-mono text-xs uppercase tracking-[0.2em] text-primary">
                  {col.phase}
                </p>
                <ul className="mt-4 space-y-2.5">
                  {col.items.map((item) => (
                    <li key={item} className="border-b border-border/10 pb-2.5 text-sm text-muted-foreground last:border-b-0">
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>

          {/* Long term upside, deliberately brief */}
          <motion.div {...sectionReveal(0.1)} className="mt-14 rounded-xl border border-border/15 bg-card/30 p-6">
            <p className="font-sans text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground">
              {t.longTermTag}
            </p>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
              {t.longTermBody}
            </p>
          </motion.div>
        </Container>
      </Section>

      {/* ── Foundation / team ── */}
      <Section spacing="lg" divided>
        <Container size="md">
          <motion.div {...sectionReveal()}>
            <OverlineRow>{t.foundationOverline}</OverlineRow>
            <h2 className="font-display text-[32px] font-bold uppercase leading-[1.08] tracking-[0.02em] text-foreground [-webkit-text-stroke:0.2px_currentColor] [paint-order:stroke_fill] md:text-[44px]">
              {t.foundationTitle}
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
              {t.foundationBody}
            </p>
          </motion.div>
          <motion.div {...staggerReveal()} className="mt-10 grid gap-4 sm:grid-cols-2">
            <motion.div {...staggerItem()} className="rounded-xl border border-border/15 bg-card/30 p-6">
              <p className="text-lg font-normal text-foreground">{t.founderLine}</p>
              <p className="mt-1.5 text-sm text-muted-foreground">{t.founderMeta}</p>
            </motion.div>
            {!FOUNDERS.cto.isPlaceholder && <motion.div {...staggerItem()} className="rounded-xl border border-border/15 bg-card/30 p-6">
              <p className="text-lg font-normal text-foreground">{t.ctoLine}</p>
              <p className="mt-1.5 text-sm text-muted-foreground">{t.ctoMeta}</p>
            </motion.div>}
          </motion.div>
        </Container>
      </Section>

      {/* ── CTA ── */}
      <Section id="investor-contact" spacing="xl" divided>
        <Container size="sm" className="text-center">
          <motion.div {...sectionReveal()}>
            <h2 className="font-display text-[32px] font-bold uppercase leading-[1.08] tracking-[0.02em] text-foreground [-webkit-text-stroke:0.2px_currentColor] [paint-order:stroke_fill] md:text-[44px]">
              {t.ctaTitle}
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
              {t.ctaBody}
            </p>
            <div className="mt-9">
              <Button
                size="lg"
                asChild
                className="h-auto min-h-12 max-w-full whitespace-normal px-5 py-3 text-center leading-snug sm:px-8"
              >
                <a
                  href={mailtoHref}
                  onClick={() => trackEvent('investor_cta_click', { location: 'investors', action: 'briefing_request' })}
                >
                  {t.ctaButton}
                </a>
              </Button>
            </div>
            <p className="mx-auto mt-12 max-w-md text-xs leading-relaxed text-muted-foreground">
              {t.bottomNote}
            </p>
          </motion.div>
        </Container>
      </Section>
    </>
  )
}

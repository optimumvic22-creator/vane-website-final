'use client'

import { motion } from 'framer-motion'
import { ClipboardCheck, Cpu, BarChart3, TrendingUp } from 'lucide-react'
import { sectionReveal, staggerReveal, staggerItem } from '@/lib/motion'
import { useLocale } from '@/lib/locale'
import { renderText } from '@/lib/render-text'
import { Section } from '@/components/ui/section'
import { Container } from '@/components/ui/container'
import { SectionHeader } from '@/components/ui/section-header'
import { MqsSampleReport } from '@/components/mqs-sample-report'

const content = {
  en: {
    overline: 'How it works',
    headline: 'From measurement to decision. Under 30 minutes.',
    description: 'The MQS makes movement quality measurable, comparable, and manageable over time.',
    steps: [
      { num: '01', title: 'Measure', desc: 'A standardized test battery lasting 30 minutes. It works independently of hardware and runs on the force plate and camera setups already used by gyms, clinics, and performance facilities. There is no proprietary hardware and no dependency on one vendor.' },
      { num: '02', title: 'Analyse', desc: 'Our software scores your results in seconds. It uses the same test theory behind the world\'s best psychological assessments. No room for interpretation.' },
      { num: '03', title: 'Understand', desc: 'Your report doesn\'t stop at a score. It delivers 3 to 5 key findings and prioritized next steps, showing exactly where training makes the biggest difference.' },
      { num: '04', title: 'Improve', desc: 'Baseline + retest: the same test after your training or therapy block shows what actually changed. The result reveals whether it works, in numbers rather than opinions.' },
    ],
    sampleTag: 'Sample report',
    sampleLabel: 'Illustrative example',
    sampleNote: 'Illustrative example. Not real client data.',
  },
  de: {
    overline: 'So funktioniert\'s',
    headline: 'Von der Messung zur Entscheidung in unter 30 Minuten.',
    description: 'MQS macht Bewegungsqualität messbar, vergleichbar und über Zeit steuerbar.',
    steps: [
      { num: '01', title: 'Messen', desc: 'Eine standardisierte Testbatterie von 30 Minuten. Sie funktioniert hardwareunabhängig und läuft auf vorhandenen Setups mit Kraftmessplatten und Kameras in Gyms, Praxen und Performanceeinrichtungen. Es braucht weder proprietäre Hardware noch die Bindung an einen Anbieter.' },
      { num: '02', title: 'Analysieren', desc: 'Unsere Software wertet deine Ergebnisse in Sekunden aus. Sie nutzt dieselbe Testtheorie, mit der die besten psychologischen Testverfahren der Welt gebaut werden. Kein Interpretationsspielraum.' },
      { num: '03', title: 'Verstehen', desc: 'Dein Report bleibt nicht beim Score stehen. Er liefert 3 bis 5 zentrale Befunde und priorisierte nächste Schritte. So weißt du genau, wo Training den größten Unterschied macht.' },
      { num: '04', title: 'Verbessern', desc: 'Baseline + Retest: Derselbe Test nach deinem Trainings- oder Therapieblock zeigt, was sich wirklich verändert hat. Das Ergebnis belegt in Zahlen, ob es wirkt.' },
    ],
    sampleTag: 'Beispielreport',
    sampleLabel: 'Beispielhafte Darstellung',
    sampleNote: 'Beispielhafte Darstellung. Keine echten Klientendaten.',
  },
}

const icons = [ClipboardCheck, Cpu, BarChart3, TrendingUp]

interface TechnologySectionProps {
  data?: {
    techOverline?: string
    techOverlineDe?: string
    techHeadline?: string
    techHeadlineDe?: string
    techSteps?: Array<{
      num: string
      title: string
      titleDe?: string
      desc: string
      descDe?: string
    }>
  } | null
}

export function TechnologySection({ data }: TechnologySectionProps) {
  const { locale } = useLocale()
  const t = locale === 'de' ? content.de : content.en

  const isDE = locale === 'de'
  const overline = (isDE ? data?.techOverlineDe : data?.techOverline) || t.overline
  const headline = (isDE ? data?.techHeadlineDe : data?.techHeadline) || t.headline
  const steps = data?.techSteps?.map(s => ({
    num: s.num,
    title: isDE ? (s.titleDe || s.title) : s.title,
    desc: isDE ? (s.descDe || s.desc) : s.desc,
  })) || t.steps

  return (
    <Section id="how-it-works" spacing="xl" background="surface">
      <Container>
        <motion.div {...sectionReveal()}>
          <SectionHeader overline={overline} title={headline} description={t.description} align="center" />
        </motion.div>
        <motion.div {...staggerReveal()} className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => {
            const Icon = icons[i]
            return (
              <motion.div key={step.num} {...staggerItem()} className="text-center">
                <span className={`font-mono text-4xl font-bold ${i === steps.length - 1 ? 'text-primary/40' : 'text-foreground/10'}`}>{step.num}</span>
                <Icon className={`mx-auto mt-4 h-8 w-8 ${i === steps.length - 1 ? 'text-primary' : 'text-muted-foreground'}`} />
                <h3 className="mt-4 text-lg font-medium text-foreground">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{renderText(step.desc)}</p>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Step 03 artefact: sample report card, clearly labelled illustrative */}
        <motion.div {...sectionReveal(0.15)} className="mx-auto mt-16 w-full max-w-xl">
          <div className="mb-3 flex items-baseline justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60">
            <span>03 · {t.sampleTag}</span>
            <span>{t.sampleLabel}</span>
          </div>
          <MqsSampleReport />
        </motion.div>
      </Container>
    </Section>
  )
}

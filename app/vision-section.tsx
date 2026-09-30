'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { User } from 'lucide-react'
import { sectionReveal, staggerReveal, staggerItem } from '@/lib/motion'
import { useLocale } from '@/lib/locale'
import { renderText } from '@/lib/render-text'
import { Section } from '@/components/ui/section'
import { Container } from '@/components/ui/container'
import { SectionHeader } from '@/components/ui/section-header'
import { FOUNDERS } from '@/lib/founders'

const en = {
  overline: 'The team',
  headline: 'Built on years in the field.',
  founder1Name: FOUNDERS.dario.name,
  founder1Title: 'Cofounder, VANE Science',
  founder1Quote: "VANE is the product of six years building performance systems for elite athletes. The same force plate testing used in our Vienna training camps with clients from Bundesliga football and top European basketball leagues is the scientific foundation of the MQS.",
  founder2Name: FOUNDERS.cto.name,
  founder2Title: 'VANE Science',
  founder2Quote: "Today everything is being measured, understood, and optimized. Yet the most fundamental layer of human life, how we move, remains largely invisible.\n\nHaving worked with data and performance for years, it became clear that this gap is not just technical, it is structural. Movement shapes health, longevity, and how we exist in the world, but we lack a shared way to understand it.\n\n**MQS is making human movement visible.** A foundation that allows people to understand themselves better, make better decisions, and stay capable for longer.\n\nWe're building this because it's overdue.",
}

const de = {
  overline: 'Das Team',
  headline: 'Gebaut auf Jahren in der Praxis.',
  founder1Name: FOUNDERS.dario.name,
  founder1Title: 'Mitgründer, VANE Science',
  founder1Quote: 'VANE ist das Ergebnis von sechs Jahren Arbeit mit Leistungssportlern. Dieselbe Force-Plate-Testung, die in unseren Wiener Trainingscamps mit Klienten aus der Deutschen Bundesliga bis zu europäischen Top-Basketball-Ligen eingesetzt wird, ist die wissenschaftliche Grundlage des MQS.',
  founder2Name: FOUNDERS.cto.name,
  founder2Title: 'VANE Science',
  founder2Quote: 'Heute wird alles gemessen, verstanden und optimiert. Doch die grundlegendste Ebene menschlichen Lebens, nämlich wie wir uns bewegen, bleibt weitgehend unsichtbar.\n\nNach Jahren der Arbeit mit Daten und Leistung wurde klar, dass diese Lücke nicht nur technisch, sondern strukturell ist. Bewegung formt Gesundheit, Langlebigkeit und wie wir in der Welt existieren, aber es fehlt uns eine gemeinsame Sprache, sie zu verstehen.\n\n**MQS macht menschliche Bewegung sichtbar.** Ein Fundament, das Menschen hilft, sich selbst besser zu verstehen, bessere Entscheidungen zu treffen und länger leistungsfähig zu bleiben.\n\nWir bauen das, weil es längst überfällig ist.',
}

interface VisionSectionProps {
  data?: {
    foundersOverline?: string
    foundersOverlineDe?: string
    foundersHeadline?: string
    foundersHeadlineDe?: string
    founder1Name?: string
    founder1Title?: string
    founder1TitleDe?: string
    founder1Image?: { asset?: { url?: string } }
    founder1Quote?: string
    founder1QuoteDe?: string
    founder2Name?: string
    founder2Title?: string
    founder2TitleDe?: string
    founder2Image?: { asset?: { url?: string } }
    founder2Quote?: string
    founder2QuoteDe?: string
  } | null
}

export function VisionSection({ data }: VisionSectionProps) {
  const { locale } = useLocale()
  const t = locale === 'de' ? de : en
  const isDE = locale === 'de'

  const overline = (isDE ? data?.foundersOverlineDe : data?.foundersOverline) || t.overline
  const headline = (isDE ? data?.foundersHeadlineDe : data?.foundersHeadline) || t.headline

  const f1Name = data?.founder1Name || t.founder1Name
  const f1Title = (isDE ? data?.founder1TitleDe : data?.founder1Title) || t.founder1Title
  const f1Quote = (isDE ? data?.founder1QuoteDe : data?.founder1Quote) || t.founder1Quote
  const f1Image = data?.founder1Image?.asset?.url

  const f2Name = data?.founder2Name || t.founder2Name
  const f2Title = (isDE ? data?.founder2TitleDe : data?.founder2Title) || t.founder2Title
  const f2Quote = (isDE ? data?.founder2QuoteDe : data?.founder2Quote) || t.founder2Quote
  const f2Image = data?.founder2Image?.asset?.url

  return (
    <Section id="founders" spacing="xl" divided>
      <Container size="lg">
        <motion.div {...sectionReveal()}>
          <SectionHeader overline={overline} title={headline} />
        </motion.div>

        <motion.div {...staggerReveal(0.15)} className="mt-12 space-y-5">
          {/* ── Founder 1 ── */}
          <FounderEntry
            index="01"
            name={f1Name}
            title={f1Title}
            quote={f1Quote}
            imageUrl={f1Image}
          />

          {/* Founder 2, reversed layout */}
          <FounderEntry
            index="02"
            name={f2Name}
            title={f2Title}
            quote={f2Quote}
            imageUrl={f2Image}
            reversed
          />
        </motion.div>

      </Container>
    </Section>
  )
}

/* ── Founder Entry ─────────────────────────────────── */

function FounderEntry({
  index,
  name,
  title,
  quote,
  imageUrl,
  reversed = false,
}: {
  index: string
  name: string
  title: string
  quote: string
  imageUrl?: string
  reversed?: boolean
}) {
  return (
    <motion.article
      {...staggerItem()}
      className={`group grid overflow-hidden rounded-xl border border-border/15 bg-card/30 transition-colors duration-500 hover:border-border/30 ${
        reversed
          ? 'grid-cols-1 md:grid-cols-[1fr_280px]'
          : 'grid-cols-1 md:grid-cols-[280px_1fr]'
      }`}
    >
      {/* Photo */}
      <div
        className={`relative overflow-hidden bg-gradient-to-br from-[#0a0a0c] to-[#111114] ${
          reversed ? 'order-first md:order-last' : ''
        }`}
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            width={560}
            height={746}
            sizes="(max-width: 768px) 100vw, 280px"
            className="h-full w-full object-cover opacity-85 transition-all duration-500 group-hover:scale-[1.015] group-hover:opacity-100"
          />
        ) : (
          <div className="flex aspect-[3/4] items-center justify-center md:aspect-auto md:h-full">
            <User className="h-16 w-16 text-muted-foreground/15" />
          </div>
        )}

        {/* Index chip */}
        <span className="absolute left-3 top-3 rounded border border-primary/15 bg-black/70 px-2 py-1 font-mono text-[0.625rem] font-medium uppercase tracking-wider text-primary backdrop-blur-sm">
          {index} / 02
        </span>

        {/* Status chip */}
        <span className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded border border-border/20 bg-black/60 px-2 py-1 font-mono text-[0.5625rem] uppercase tracking-wider text-muted-foreground/60 backdrop-blur-sm">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
          Cofounder
        </span>

        {/* Scan-line overlay */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.03) 3px, rgba(0,0,0,0.03) 4px)',
          }}
        />
      </div>

      {/* Content */}
      <div className={`flex flex-col justify-start p-6 md:p-8 ${reversed ? 'order-last md:order-first' : ''}`}>
        {/* Name + title with accent line */}
        <div className="flex items-center gap-3">
          <span className="h-px w-6 shrink-0 bg-primary" />
          <div>
            <h3 className="text-xl font-medium tracking-tight md:text-2xl">{name}</h3>
            <p className="mt-0.5 text-[0.8125rem] font-normal text-primary">{title}</p>
          </div>
        </div>

        {/* Quote */}
        <blockquote className="mt-5 border-l-2 border-primary/15 pl-5">
          <p className="text-sm italic leading-[1.75] text-muted-foreground">
            &ldquo;{renderText(quote)}&rdquo;
          </p>
        </blockquote>
      </div>
    </motion.article>
  )
}

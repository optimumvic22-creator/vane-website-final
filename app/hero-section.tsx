'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ArrowDown } from 'lucide-react'
import { staggerContainer, fadeUp } from '@/lib/motion'
import { useLocale } from '@/lib/locale'
import { renderText } from '@/lib/render-text'
import { trackEvent } from '@/lib/analytics'
import { Button } from '@/components/ui/button'

type HeroCopy = {
  overline: string
  headline: string
  headlineParts: [string, string] | undefined
  sub: string
  cta1: string
  cta2: string
  trust: string[]
}

const en: HeroCopy = {
  overline: 'Movement quality. Measured.',
  headline: 'We gave Human Movement a language.',
  headlineParts: ['We gave Human Movement', 'a language.'],
  sub: 'Trainers guess. Doctors observe. Trackers count steps. VANE measures how well you move. One score across seven domains, compared with people your age.',
  cta1: 'Discover my score →',
  cta2: 'How it works',
  trust: ['Developed in Vienna', 'Built on psychometric test methodology', 'Used with elite athletes'],
}

const de: HeroCopy = {
  overline: 'Bewegungsqualität. Gemessen.',
  headline: 'Wir haben menschlicher Bewegung eine Sprache gegeben.',
  headlineParts: ['Wir haben menschlicher Bewegung', 'eine Sprache gegeben.'],
  sub: 'Trainer schätzen. Ärzte beobachten. Tracker zählen Schritte. VANE misst, wie gut du dich bewegst. Ein Score über sieben Domänen, verglichen mit Menschen deines Alters.',
  cta1: 'Warteliste beitreten →',
  cta2: "So funktioniert's",
  trust: ['Entwickelt in Wien', 'Psychometrische Testmethodik', 'Im Einsatz mit Spitzensportlern'],
}

interface HeroSectionProps {
  data?: {
    heroOverline?: string
    heroOverlineDe?: string
    heroHeadlinePart1?: string
    heroHeadlinePart2?: string
    heroHeadlineDe?: string
    heroSub?: string
    heroSubDe?: string
    heroCta1?: string
    heroCta1De?: string
    heroCta2?: string
    heroCta2De?: string
    heroTrustItems?: string[]
    heroTrustItemsDe?: string[]
    heroVideoUrl?: string
    heroVideoPoster?: {
      asset?: {
        url?: string
      }
    }
  } | null
}

export function HeroSection({ data }: HeroSectionProps) {
  const { locale } = useLocale()
  const t = locale === 'de' ? de : en

  const overline = (locale === 'de' ? data?.heroOverlineDe : data?.heroOverline) || t.overline
  const headlineParts: [string, string] | undefined = locale === 'de'
    ? (data?.heroHeadlineDe ? undefined : t.headlineParts)
    : (data?.heroHeadlinePart1 && data?.heroHeadlinePart2 ? [data.heroHeadlinePart1, data.heroHeadlinePart2] : t.headlineParts)
  const headline = locale === 'de'
    ? (data?.heroHeadlineDe || t.headline)
    : (data?.heroHeadlinePart1 ? `${data.heroHeadlinePart1} ${data.heroHeadlinePart2}` : t.headline)
  const sub = (locale === 'de' ? data?.heroSubDe : data?.heroSub) || t.sub
  const cta1 = (locale === 'de' ? data?.heroCta1De : data?.heroCta1) || t.cta1
  const cta2 = (locale === 'de' ? data?.heroCta2De : data?.heroCta2) || t.cta2
  const trust = (locale === 'de' ? data?.heroTrustItemsDe : data?.heroTrustItems) || t.trust

  const videoUrl = data?.heroVideoUrl
  const posterUrl = data?.heroVideoPoster?.asset?.url

  return (
    <section className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden">
      {/* Background video layer */}
      {videoUrl && (
        <video
          autoPlay
          muted
          loop
          playsInline
          poster={posterUrl}
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
      )}

      {/* Poster fallback if no video */}
      {!videoUrl && posterUrl && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${posterUrl})` }}
        />
      )}

      {/* Dark overlay scrim */}
      <div className="absolute inset-0 bg-black/60" aria-hidden="true" />

      {/* Ambient glow + hairline grid (visible when no media is set) */}
      <div
        className="absolute inset-0"
        aria-hidden="true"
        style={{
          background: 'transparent',
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.16] [mask-image:radial-gradient(ellipse_at_center,black_10%,transparent_72%)]"
        aria-hidden="true"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)',
          backgroundSize: '96px 96px',
        }}
      />

      {/* Bottom gradient fade */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black to-transparent" aria-hidden="true" />

      {/* Centered content */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="relative z-10 mx-auto max-w-5xl px-6 text-center"
      >
        {/* Overline */}
        <motion.p
          variants={fadeUp}
          className="inline-flex items-center gap-4 font-mono text-[11px] font-normal uppercase tracking-[0.26em] text-primary"
        >
          <span className="h-px w-8 bg-primary/60" aria-hidden="true" />
          {overline}
          <span className="h-px w-8 bg-primary/60" aria-hidden="true" />
        </motion.p>

        {/* Headline */}
        {headlineParts ? (
          <motion.h1
            variants={fadeUp}
            className="mt-6 font-display text-5xl font-normal uppercase leading-[0.95] tracking-[0.02em] text-foreground sm:text-6xl md:text-7xl lg:text-8xl"
          >
            {headlineParts[0]}
            <br />
            <span className="bg-gradient-to-b from-foreground via-foreground/80 to-foreground/40 bg-clip-text text-transparent">
              {headlineParts[1]}
            </span>
          </motion.h1>
        ) : (
          <motion.h1
            variants={fadeUp}
            className="mt-6 font-display text-5xl font-normal uppercase leading-[0.95] tracking-[0.02em] text-foreground sm:text-6xl md:text-7xl lg:text-8xl"
          >
            {headline}
          </motion.h1>
        )}

        {/* Subtitle */}
        <motion.p variants={fadeUp} className="mx-auto mt-7 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
          {renderText(sub)}
        </motion.p>

        {/* CTA buttons */}
        <motion.div variants={fadeUp} className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Button
            size="lg"
            className="shadow-glow-primary"
            onClick={() => {
              trackEvent('cta_click', { location: 'hero' })
              document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' })
            }}
          >
            {cta1}
          </Button>
          <Button variant="outline" size="lg" onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}>
            <ArrowDown className="h-4 w-4" />
            {cta2}
          </Button>
        </motion.div>

        {/* Trust bar */}
        <motion.div
          variants={fadeUp}
          className="mx-auto mt-14 flex max-w-3xl flex-wrap items-center justify-center gap-x-5 gap-y-2 border-t border-white/10 pt-6"
        >
          {trust.map((item, i) => (
            <React.Fragment key={item}>
              {i > 0 && <span className="hidden text-muted-foreground/30 sm:inline">·</span>}
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{item}</span>
            </React.Fragment>
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}

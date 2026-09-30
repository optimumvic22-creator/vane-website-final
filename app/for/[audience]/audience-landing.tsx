'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Check } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { AmbientVideo } from '@/components/ui/ambient-video'
import { Container } from '@/components/ui/container'
import {
  AudienceMotionPanel,
  type AudienceMotionClip,
  type AudienceMotionMode,
} from '@/components/ui/audience-motion-panel'
import { AudienceVideoPlaylist } from '@/components/ui/audience-video-playlist'
import { MqsDashboard } from '@/components/ui/mqs-dashboard'
import { AudienceInquiryForm } from '@/components/ui/audience-inquiry-form'
import { AudienceWaitlistForm } from '@/components/ui/audience-waitlist-form'
import { trackEvent } from '@/lib/analytics'
import { audienceContent, type AudienceSlug } from '@/lib/audience-content'
import { useLocale } from '@/lib/locale'
import { cn } from '@/lib/utils'

const scienceMedia: Partial<
  Record<
    AudienceSlug,
    {
      src: string
      alt: { en: string; de: string }
      objectPosition: string
    }
  >
> = {
  coach: {
    src: '/audiences/coach-training-decisions.jpg',
    alt: {
      en: 'Presentation showing how movement metrics become training decisions',
      de: 'Vortrag darüber, wie Bewegungsdaten zu Trainingsentscheidungen werden',
    },
    objectPosition: 'object-[center_20%]',
  },
  partner: {
    src: '/audiences/partner-signal-vs-noise.jpg',
    alt: {
      en: 'Presentation about separating meaningful movement signals from measurement noise',
      de: 'Vortrag über die Unterscheidung relevanter Bewegungssignale von Messrauschen',
    },
    objectPosition: 'object-center',
  },
}

const athleteBenefitsImage = {
  src: '/audiences/athlete-training-lab-jump.webp',
  alt: {
    en: 'Athlete completing a jump assessment at the VANE Training Lab in Vienna',
    de: 'Athlet bei einem Sprungassessment im VANE Training Lab in Wien',
  },
}

const coachBenefitsImage = {
  src: '/audiences/coach-saisan-presentation.jpeg',
  alt: {
    en: 'Coach presenting how assessment results inform professional decisions',
    de: 'Coach bei der Einordnung von Assessmentergebnissen für professionelle Entscheidungen',
  },
}

const audienceMotion: Record<
  AudienceSlug,
  {
    placement: 'benefits' | 'process'
    mode: AudienceMotionMode
    caption: { en: string; de: string }
    clips: readonly AudienceMotionClip[]
  }
> = {
  athlete: {
    placement: 'benefits',
    mode: 'athlete-sequence',
    caption: {
      en: 'Field and gym movement. Observed in context.',
      de: 'Bewegung auf dem Feld und im Gym. Im Kontext beobachtet.',
    },
    clips: [
      {
        src: '/media/audience-motion/colin-neural-speed-web.mp4',
        poster: '/media/audience-motion/colin-neural-speed-poster.jpg',
        objectPosition: 'object-[center_60%]',
        domainFocus: ['neuro_response', 'motor_control'],
      },
      {
        src: '/media/audience-motion/julius-medicine-ball-throws-web.mp4',
        poster: '/media/audience-motion/julius-medicine-ball-throws-poster.jpg',
        objectPosition: 'object-[center_52%]',
        domainFocus: ['power', 'motor_control'],
      },
    ],
  },
  coach: {
    placement: 'process',
    mode: 'coach-sequence',
    caption: {
      en: 'Assessment in motion. Observation comes before interpretation.',
      de: 'Assessment in Bewegung. Beobachten kommt vor dem Interpretieren.',
    },
    clips: [
      {
        src: '/media/audience-motion/slide-intro-web.mp4',
        poster: '/media/audience-motion/slide-intro-poster.jpg',
        objectPosition: 'object-center',
        playbackRate: 1,
        startOffset: 0,
        domainFocus: ['power', 'force_capacity'],
      },
      {
        src: '/media/audience-motion/konate-depth-jump-web.mp4',
        poster: '/media/audience-motion/konate-depth-jump-poster.jpg',
        objectPosition: 'object-[center_58%]',
        playbackRate: 1,
        startOffset: 0.45,
        domainFocus: ['power', 'motor_control'],
      },
    ],
  },
  partner: {
    placement: 'benefits',
    mode: 'partner-compare',
    caption: {
      en: 'Countermovement jump. Two athletes, one shared reference.',
      de: 'Countermovement Jump. Zwei Athleten, eine gemeinsame Referenz.',
    },
    clips: [
      {
        src: '/media/audience-motion/niklas-cmj-web.mp4',
        poster: '/media/audience-motion/niklas-cmj-poster.jpg',
        objectPosition: 'object-[center_62%]',
        playbackRate: 1,
        startOffset: 0,
        domainFocus: ['power', 'force_capacity'],
      },
      {
        src: '/media/audience-motion/ines-cmj-web.mp4',
        poster: '/media/audience-motion/ines-cmj-poster.jpg',
        objectPosition: 'object-[center_60%]',
        playbackRate: 1,
        startOffset: 0,
        domainFocus: ['power', 'force_capacity'],
      },
      {
        src: '/media/audience-motion/partner-niklas-cmj-2-web.mp4',
        poster: '/media/audience-motion/niklas-cmj-poster.jpg',
        objectPosition: 'object-[center_60%]',
        playbackRate: 1,
        startOffset: 0,
        domainFocus: ['power', 'force_capacity'],
      },
      {
        src: '/media/audience-motion/partner-niklas-vertec-jump-web.mp4',
        poster: '/media/audience-motion/niklas-cmj-poster.jpg',
        objectPosition: 'object-[center_56%]',
        playbackRate: 1,
        startOffset: 0,
        domainFocus: ['power', 'force_capacity'],
      },
      {
        src: '/media/audience-motion/partner-konate-depth-jump-outlier-web.mp4',
        poster: '/media/audience-motion/konate-depth-jump-poster.jpg',
        objectPosition: 'object-[center_58%]',
        playbackRate: 1,
        startOffset: 0,
        domainFocus: ['power', 'motor_control'],
      },
    ],
  },
}

const stripSoftHyphens = (value: string) => value.replace(/\u00AD/g, '')

function AudienceEyebrow({
  children,
  className,
}: {
  children: string
  className?: string
}) {
  return (
    <p
      className={cn(
        'inline-flex items-center gap-2.5 font-sans text-[12.6px] font-semibold uppercase leading-[1.25] tracking-[0.08em] text-white/70 md:text-[13.65px]',
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="h-1 w-1 shrink-0 bg-[var(--mqs-value-inv)]"
      />
      <span>{children}</span>
    </p>
  )
}

function ProcessStepCard({
  step,
  index,
  className,
  joined = false,
}: {
  step: { title: string; description: string }
  index: number
  className?: string
  joined?: boolean
}) {
  return (
    <article
      className={cn(
        'relative bg-[#0B0C0E] p-4 sm:p-5 md:p-6',
        !joined && 'rounded-xl border border-white/10',
        className,
      )}
    >
      <span className="font-mono text-xs tracking-[0.12em] text-primary">
        0{index + 1}
      </span>
      <h3 className="mt-4 font-display text-[1.75rem] font-bold uppercase leading-[1.1] tracking-[0.02em] text-foreground [-webkit-text-stroke:0.15px_currentColor] [paint-order:stroke_fill] md:mt-6 md:text-[2rem]">
        {step.title}
      </h3>
      <p className="mt-2 text-[15px] leading-[1.55] text-muted-foreground md:mt-3">
        {step.description}
      </p>
    </article>
  )
}

export function AudienceLanding({ audience }: { audience: AudienceSlug }) {
  const { locale } = useLocale()
  const copy = audienceContent[audience][locale]
  const scienceImage = scienceMedia[audience]
  const motionSet = audienceMotion[audience]
  const motionLabels =
    locale === 'de'
      ? { play: 'Abspielen', pause: 'Pause', replay: 'Wiederholen' }
      : { play: 'Play', pause: 'Pause', replay: 'Replay' }
  const secondaryHref = audience === 'athlete' ? '#results' : '#how-it-works'

  const trackCta = (location: string) => {
    trackEvent('audience_cta_click', { audience, location })
  }

  return (
    <>
      <section id="for-whom" className="audience-hero relative scroll-mt-[88px] overflow-hidden border-b border-white/10 bg-background py-[4.5rem] md:scroll-mt-[104px] md:py-28 lg:py-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />
        <Container className="relative">
          <div className="grid items-start lg:grid-cols-[1.05fr_0.95fr] lg:gap-x-20">
            <motion.div
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              className="min-w-0 lg:col-start-1 lg:row-start-1"
            >
              <AudienceEyebrow>{copy.eyebrow}</AudienceEyebrow>
              <h1
                aria-label={stripSoftHyphens(copy.headline)}
                className={cn(
                  'audience-hero-title mt-3.5 max-w-4xl break-normal font-display text-[clamp(2.75rem,12vw,3rem)] font-bold uppercase leading-[0.94] tracking-[0.02em] text-foreground [-webkit-text-stroke:0.2px_currentColor] [hyphens:manual] [paint-order:stroke_fill] sm:text-6xl md:mt-4 md:text-7xl lg:text-7xl xl:text-[5rem] 2xl:text-8xl',
                  locale === 'de' &&
                    audience === 'partner' &&
                    'tracking-[0.01em] sm:tracking-[0.02em] max-[359px]:text-[2.15rem] max-[359px]:tracking-0',
                )}
              >
                {locale === 'de' && audience === 'partner'
                  ? stripSoftHyphens(copy.headline)
                  : copy.headline}
              </h1>
              <p className="mt-7 max-w-[60ch] text-[17px] leading-[1.55] text-muted-foreground md:text-lg">
                {copy.intro}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-start">
                <div className="flex flex-col gap-2 sm:max-w-[21rem]">
                  <Button asChild size="lg" className="rounded-full" onClick={() => trackCta('hero_primary')}>
                    <a href="#waitlist" aria-describedby={copy.availabilityNote ? `availability-${audience}` : undefined}>
                      {copy.primaryCta}
                      <ArrowRight aria-hidden="true" />
                    </a>
                  </Button>
                  {copy.availabilityNote && (
                    <p id={`availability-${audience}`} className="max-w-[42ch] text-xs leading-relaxed text-muted-foreground">
                      {copy.availabilityNote}
                    </p>
                  )}
                </div>
                <Button asChild size="lg" variant="outline" className="rounded-full">
                  <a href={secondaryHref}>{copy.secondaryCta}</a>
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={false}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.12 }}
              className="relative mx-auto mt-12 min-w-0 w-full max-w-[34rem] lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:mt-8 lg:self-start"
            >
              <MqsDashboard
                variant="audience"
                locale={locale}
                audience={audience}
              />
            </motion.div>

            <ul
              className="mt-8 hidden grid-cols-1 divide-y divide-white/10 border-y border-white/10 md:grid md:grid-cols-3 md:divide-x md:divide-y-0 lg:col-start-1 lg:row-start-2 lg:grid-cols-1 lg:divide-x-0 lg:divide-y xl:grid-cols-3 xl:divide-x xl:divide-y-0"
            >
              {copy.heroValueRail.map((point) => (
                <li
                  key={point.title}
                  className="min-w-0 py-3.5 md:px-6 md:py-4 md:first:pl-0 md:last:pr-0 lg:px-0 lg:py-3 xl:px-5 xl:py-4"
                >
                  <p className="font-sans text-base font-semibold leading-[1.35] tracking-[-0.01em] text-foreground [text-wrap:balance]">
                    {point.title}
                  </p>
                  <p className="mt-1 font-sans text-sm font-normal leading-[1.5] tracking-normal text-muted-foreground [text-wrap:balance]">
                    {point.detail}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      <section
        id="benefits"
        className={cn(
          'scroll-mt-[88px] bg-[#08090A] py-[4.5rem] md:scroll-mt-[104px] md:py-24',
          (audience === 'athlete' || audience === 'coach') && 'lg:py-24',
        )}
      >
        <Container>
          <div
            className={cn(
              'grid gap-10 lg:gap-20',
              audience === 'partner'
                ? 'lg:max-w-[1120px] lg:grid-cols-[minmax(300px,360px)_minmax(0,1fr)] lg:gap-x-12 lg:gap-y-10'
                : audience === 'coach'
                ? 'lg:grid-cols-2 lg:gap-x-16 lg:gap-y-10'
                : audience === 'athlete'
                ? 'lg:grid-cols-[0.95fr_1.05fr] lg:gap-x-16 lg:gap-y-10'
                : motionSet.placement === 'benefits'
                ? 'lg:grid-cols-[0.95fr_1.05fr] lg:gap-16'
                : 'lg:grid-cols-[0.8fr_1.2fr]',
            )}
          >
            <div
              className={cn(
                'min-w-0',
                (audience === 'athlete' || audience === 'coach' || audience === 'partner') &&
                  'lg:contents',
              )}
            >
              <div
                className={cn(
                  'min-w-0',
                  (audience === 'athlete' || audience === 'coach') &&
                    'lg:col-span-2 lg:max-w-[900px]',
                  audience === 'partner' && 'lg:col-span-2 lg:max-w-[780px]',
                )}
              >
                <AudienceEyebrow>{copy.benefitsEyebrow}</AudienceEyebrow>
                <h2
                  aria-label={stripSoftHyphens(copy.benefitsTitle)}
                  className="mt-3.5 break-normal font-display text-5xl font-bold uppercase leading-[0.96] tracking-[0.02em] text-foreground [-webkit-text-stroke:0.2px_currentColor] [hyphens:manual] [paint-order:stroke_fill] [text-wrap:balance] md:mt-4 md:text-6xl"
                >
                  {copy.benefitsTitle}
                </h2>
                <p className="mt-6 max-w-[60ch] text-base leading-[1.58] text-muted-foreground md:text-[17px]">
                  {audience === 'athlete' && locale === 'en' ? (
                    <>
                      Your result should help you ask better questions, choose clearer priorities,
                      <br className="md:hidden" />{' '}
                      and understand change over time.
                    </>
                  ) : (
                    copy.benefitsIntro
                  )}
                </p>
              </div>
              {audience === 'athlete' ? (
                <figure className="relative mx-auto mt-8 aspect-square w-full max-w-[420px] overflow-hidden rounded-xl border border-white/10 bg-[#0B0C0E] sm:mx-0 sm:aspect-[4/3] sm:max-w-[620px] md:mt-10 md:max-w-[640px] lg:mt-0 lg:max-w-none">
                  <Image
                    src={athleteBenefitsImage.src}
                    alt={athleteBenefitsImage.alt[locale]}
                    fill
                    sizes="(max-width: 459px) calc(100vw - 40px), (max-width: 639px) 420px, (max-width: 767px) 620px, (max-width: 1023px) 640px, 40vw"
                    className="object-cover object-center brightness-[0.82] contrast-[1.06] saturate-[0.9]"
                  />
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/5"
                  />
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[var(--mqs-value-inv)]/55"
                  />
                </figure>
              ) : audience === 'coach' ? (
                <figure className="relative mx-auto mt-8 aspect-[3/2] w-full max-w-[520px] overflow-hidden rounded-xl border border-white/10 bg-[#0B0C0E] shadow-[0_18px_55px_rgba(0,0,0,0.22)] sm:mx-0 md:mt-10 lg:mt-0 lg:h-full lg:max-w-none lg:aspect-auto">
                  <Image
                    src={coachBenefitsImage.src}
                    alt={coachBenefitsImage.alt[locale]}
                    fill
                    sizes="(max-width: 559px) calc(100vw - 40px), (max-width: 1023px) 520px, 36vw"
                    className="object-cover object-center brightness-[0.82] contrast-[1.06] saturate-[0.9]"
                  />
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/5"
                  />
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[var(--mqs-value-inv)]/55"
                  />
                </figure>
              ) : motionSet.placement === 'benefits' ? (
                  <AudienceVideoPlaylist
                    clips={motionSet.clips}
                    ariaLabel={
                      locale === 'de'
                        ? 'Bewegungssequenz aus fünf Assessments'
                        : 'Movement sequence from five assessments'
                    }
                    className={cn(
                      'mt-8 md:mt-10',
                      audience === 'partner' && 'sm:mx-0 lg:mt-0 lg:max-w-none lg:self-center',
                    )}
                    mediaClassName={audience === 'partner' ? 'sm:aspect-[4/5]' : undefined}
                  />
              ) : null}
            </div>
            <div
              className={cn(
                'min-w-0 grid gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10',
                (audience === 'athlete' || audience === 'coach') &&
                  'lg:h-full lg:grid-rows-3',
                audience === 'coach' && 'shadow-[0_18px_55px_rgba(0,0,0,0.22)]',
                audience === 'partner' && 'lg:self-center',
              )}
            >
              {copy.benefits.map((benefit, index) => (
                <article
                  key={benefit.title}
                  className={cn(
                    'grid gap-4 bg-[#0B0C0E] p-6 sm:grid-cols-[52px_1fr] md:p-8',
                    (audience === 'athlete' || audience === 'coach') &&
                      'md:p-6 lg:grid-cols-[44px_minmax(0,1fr)] lg:content-center lg:gap-x-5 lg:gap-y-2 lg:px-7 lg:py-5',
                    audience === 'partner' &&
                      'grid-cols-[34px_minmax(0,1fr)] gap-x-5 gap-y-2 py-6 sm:grid-cols-[36px_minmax(0,1fr)] md:px-7 md:py-7 lg:content-center lg:px-8',
                  )}
                >
                  <span className="font-mono text-xs tracking-[0.18em] text-primary">
                    0{index + 1}
                  </span>
                  <div>
                    <h3
                      className={cn(
                        'font-sans text-2xl font-medium leading-[1.2] tracking-[-0.02em] text-foreground md:text-[1.75rem]',
                        (audience === 'athlete' || audience === 'coach') && 'md:text-[1.6rem]',
                        audience === 'partner' && 'md:text-[1.65rem]',
                      )}
                    >
                      {benefit.title}
                    </h3>
                    <p
                      className={cn(
                        'mt-3 max-w-[60ch] text-[15px] leading-[1.58] text-muted-foreground md:text-base',
                        (audience === 'athlete' || audience === 'coach') &&
                          'mt-2 max-w-[52ch] leading-[1.5]',
                        audience === 'partner' && 'max-w-[50ch]',
                      )}
                    >
                      {benefit.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section id="how-it-works" className="scroll-mt-[88px] bg-background py-[4.5rem] md:scroll-mt-[104px] md:py-24">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <AudienceEyebrow>{copy.processEyebrow}</AudienceEyebrow>
            <h2 className="mt-3.5 font-display text-5xl font-bold uppercase leading-[0.96] tracking-[0.02em] text-foreground [-webkit-text-stroke:0.2px_currentColor] [paint-order:stroke_fill] md:mt-4 md:text-[4rem]">
              {copy.processTitle}
            </h2>
          </div>
          {motionSet.placement === 'process' && audience !== 'coach' ? (
            <div className="mt-14 grid gap-4 lg:grid-cols-[minmax(300px,0.86fr)_minmax(0,1.14fr)] lg:grid-rows-3 lg:gap-x-10">
              <ProcessStepCard
                step={copy.steps[0]}
                index={0}
                className="lg:col-start-2 lg:row-start-1"
              />
              <AudienceMotionPanel
                clips={motionSet.clips}
                mode={motionSet.mode}
                caption={motionSet.caption[locale]}
                labels={motionLabels}
                locale={locale}
                className="my-3 lg:col-start-1 lg:row-span-3 lg:row-start-1 lg:my-0 lg:self-center"
              />
              {copy.steps.slice(1).map((step, index) => (
                <ProcessStepCard
                  key={step.title}
                  step={step}
                  index={index + 1}
                  className={cn(
                    'lg:col-start-2',
                    index === 0 ? 'lg:row-start-2' : 'lg:row-start-3',
                  )}
                />
              ))}
            </div>
          ) : (
            <div className="mt-12 grid gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10 md:grid-cols-3">
              {copy.steps.map((step, index) => (
                <ProcessStepCard
                  key={step.title}
                  step={step}
                  index={index}
                  joined
                />
              ))}
            </div>
          )}
        </Container>
      </section>

      <section id="results" className="relative isolate scroll-mt-[88px] overflow-hidden bg-[#08090A] py-[4.5rem] md:scroll-mt-[104px] md:py-28">
        {audience === 'athlete' || audience === 'coach' || audience === 'partner' ? (
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
            <AmbientVideo
              src={
                audience === 'athlete'
                  ? '/media/audience-motion/dario-max-v-sprint-web.mp4'
                  : '/media/audience-motion/dario-accel-usc-web.mp4'
              }
              className="h-full w-full object-cover object-center opacity-65 brightness-[0.9] contrast-[1.05] saturate-[0.8]"
            />
            <div className="absolute inset-0 bg-black/50" />
            <div
              className="absolute inset-0"
              style={{
                background:
                  'radial-gradient(circle at 52% 44%, rgba(8,9,10,0.04) 0%, rgba(8,9,10,0.38) 64%, rgba(8,9,10,0.82) 100%), linear-gradient(90deg, rgba(8,9,10,0.72) 0%, rgba(8,9,10,0.26) 50%, rgba(8,9,10,0.72) 100%)',
              }}
            />
          </div>
        ) : null}
        <Container className="relative z-10">
          <div className="grid items-start gap-y-12 lg:grid-cols-2 lg:gap-x-24 lg:gap-y-12">
            <div>
              <AudienceEyebrow className="text-white/88">
                {copy.outputEyebrow}
              </AudienceEyebrow>
              <h2 className="mt-3.5 font-display text-5xl font-bold uppercase leading-[0.96] tracking-[0.02em] text-white [-webkit-text-stroke:0.2px_currentColor] [paint-order:stroke_fill] drop-shadow-[0_2px_12px_rgba(0,0,0,0.42)] md:mt-4 md:text-[4rem]">
                {copy.outputTitle}
              </h2>
              <p className="mt-6 max-w-[60ch] text-base leading-[1.58] text-white/82 md:text-[17px]">
                {copy.outputIntro}
              </p>
            </div>
            <div>
              <ul className="divide-y divide-white/12 border-y border-white/12">
                {copy.deliverables.map((item) => (
                  <li key={item} className="flex items-start gap-4 py-3.5 text-[15px] leading-[1.58] text-white/92 md:py-4 md:text-base">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-primary/60 text-[var(--mqs-value-inv)]">
                      <Check className="h-3 w-3" aria-hidden="true" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="w-full lg:col-span-2 lg:mx-auto lg:max-w-[720px]">
              <div className="rounded-xl border border-primary/28 bg-[rgba(13,17,20,0.9)] p-6 shadow-[0_20px_70px_rgba(0,0,0,0.32),inset_0_1px_0_rgba(255,255,255,0.055)] backdrop-blur-xl md:p-8 lg:px-12 lg:py-9 lg:text-center">
                <p className="font-sans text-xs font-semibold uppercase tracking-[0.1em] text-[var(--mqs-value-inv)]">
                  {copy.decisionLabel}
                </p>
                <p className="mt-4 text-lg leading-relaxed text-white/95 drop-shadow-[0_1px_8px_rgba(0,0,0,0.38)] md:text-xl">
                  {copy.decisionText}
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section id="science" className="scroll-mt-[88px] bg-background py-[4.5rem] md:scroll-mt-[104px] md:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1fr_0.9fr] lg:gap-24">
            <div>
              <AudienceEyebrow>{copy.scienceEyebrow}</AudienceEyebrow>
              <h2 className="mt-3.5 font-display text-5xl font-bold uppercase leading-[0.96] tracking-[0.02em] text-foreground [-webkit-text-stroke:0.2px_currentColor] [paint-order:stroke_fill] md:mt-4 md:text-[4rem]">
                {copy.scienceTitle}
              </h2>
              <p className="mt-6 max-w-[60ch] text-base leading-[1.58] text-muted-foreground md:text-[17px]">
                {copy.scienceText}
              </p>
            </div>
            <div
              className={`${scienceImage ? 'self-start' : 'self-center'} overflow-hidden rounded-xl border border-white/10 bg-white/[0.025]`}
            >
              {scienceImage ? (
                <div className="relative aspect-[16/10] overflow-hidden border-b border-white/10 bg-[#050607]">
                  <Image
                    src={scienceImage.src}
                    alt={scienceImage.alt[locale]}
                    fill
                    sizes="(min-width: 1024px) 42vw, 100vw"
                    className={`object-cover saturate-[0.88] contrast-[1.04] ${scienceImage.objectPosition}`}
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-[#08090A]/35 via-transparent to-black/10"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-[var(--mqs-line)]/75 via-[var(--mqs-line)]/25 to-transparent"
                  />
                </div>
              ) : null}
              <div className="p-6 md:p-8">
                {copy.sciencePoints.map((point, index) => (
                  <div key={point} className="flex items-center gap-4 border-b border-white/10 py-4 first:pt-0 last:border-b-0 last:pb-0">
                    <span className="w-5 shrink-0 font-mono text-[10px] tracking-[0.14em] text-primary" aria-hidden="true">
                      0{index + 1}
                    </span>
                    <p className="text-[15px] leading-[1.55] text-foreground">{point}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section id="waitlist" className="relative scroll-mt-[88px] overflow-hidden bg-[#08090A] py-[4.5rem] md:scroll-mt-[104px] md:py-28">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
        />
        <Container className="relative text-center">
          <AudienceEyebrow>{copy.finalEyebrow}</AudienceEyebrow>
          <h2
            aria-label={stripSoftHyphens(copy.finalTitle)}
            className="mx-auto mt-3.5 max-w-4xl break-normal font-display text-5xl font-bold uppercase leading-[0.96] tracking-[0.02em] text-foreground [-webkit-text-stroke:0.2px_currentColor] [hyphens:manual] [paint-order:stroke_fill] md:mt-4 md:text-7xl"
          >
            {copy.finalTitle}
          </h2>
          <p className="mx-auto mt-6 max-w-[60ch] text-base leading-[1.58] text-muted-foreground md:text-[17px]">
            {copy.finalText}
          </p>
          {audience === 'athlete' ? (
            <AudienceInquiryForm
              audience={audience}
              locale={locale}
              cta={copy.finalCta}
              note={copy.finalNote}
            />
          ) : (
            <AudienceWaitlistForm
              key={audience}
              audience={audience}
              locale={locale}
              cta={copy.finalCta}
              note={copy.finalNote}
            />
          )}
          <Link href="/" className="mt-10 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
            {locale === 'de' ? 'Andere Zielgruppe wählen' : 'Choose another audience'}
          </Link>
        </Container>
      </section>
    </>
  )
}

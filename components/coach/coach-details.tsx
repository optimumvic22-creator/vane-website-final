'use client'
import { ChevronDown, Pause, Play } from 'lucide-react'
import type { ReactNode } from 'react'
import Image from 'next/image'
import { coachCompactCopy, compactUi } from '@/lib/coach-compact'
import type { Locale } from '@/lib/locale'
import { setMotionPaused, useMotionPaused } from '@/lib/motion-preference'
import { Container } from '@/components/ui/container'
import { AudienceEyebrow } from '@/components/ui/audience-primitives'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import type { CoachProps } from './coach-primitives'

type Props = CoachProps & { locale: Locale }
function Detail({ label, children }: { label: string; children: ReactNode }) {
  return (
    <details className="group mt-4">
      <summary className="flex min-h-10 cursor-pointer list-none items-center gap-2 text-xs font-medium text-white/70 outline-none hover:text-white focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-details-marker]:hidden">
        {label}
        <ChevronDown
          aria-hidden
          size={13}
          className="transition-transform group-open:rotate-180"
        />
      </summary>
      <div className="mt-3 space-y-4 text-sm leading-relaxed text-muted-foreground">
        {children}
      </div>
    </details>
  )
}
export function CoachSetupDetail({
  copy,
  locale,
  index,
}: Props & { index: number }) {
  return (
    <Detail label={compactUi[locale].setupDetails}>
      {index === 0 ? (
        <>
          <p>{copy.sections.video.body[0]}</p>
          <ul className="space-y-3">
            {copy.ui.videoOutputs.map((p) => (
              <li key={p.title}>
                <strong className="font-medium text-white/80">
                  {p.title}:{' '}
                </strong>
                {p.description}
              </li>
            ))}
          </ul>
          <p>{copy.sections.video.body[1]}</p>
          <p className="font-medium text-white/80">
            {copy.sections.online.title}
          </p>
          <p>{copy.sections.online.body[0]}</p>
        </>
      ) : index === 1 ? (
        <>
          {copy.sections.force.cards.map((p) => (
            <p key={p.title}>
              <strong className="font-medium text-white/80">{p.title} </strong>
              {p.description}
            </p>
          ))}
          <ol className="space-y-3">
            {copy.ui.videoSteps.map((p, i) => (
              <li key={p.title}>
                <strong className="font-medium text-white/80">
                  {i + 1}. {p.title}{' '}
                </strong>
                {p.description}
              </li>
            ))}
          </ol>
        </>
      ) : (
        <>
          <p>{copy.sections.video.cards[1].description}</p>
          <p>{copy.ui.setupsNote}</p>
        </>
      )}
    </Detail>
  )
}
export function CoachInterpretation({ copy, locale }: Props) {
  const compact = coachCompactCopy[locale]
  return (
    <section id="science" className="coach-interpretation" aria-labelledby="coach-interpretation-heading">
      <Container>
        <div className="coach-interpretation-grid">
          <div className="coach-interpretation-copy">
            <h2 id="coach-interpretation-heading">{compactUi[locale].reportDetail}</h2>
            <div className="coach-interpretation-body">
              {copy.sections.report.body.map((text) => (
                <p key={text}>{text}</p>
              ))}
            </div>
          </div>
          <div className="coach-interpretation-perspective">
            <figure className="coach-interpretation-photo">
              <Image
                src="/audiences/coach-training-decisions.jpg"
                alt={locale === 'de'
                  ? 'Vortrag darüber, wie Bewegungsdaten zu Trainingsentscheidungen werden'
                  : 'Presentation showing how movement metrics become training decisions'}
                fill
                sizes="(min-width: 1024px) 42vw, 100vw"
                className="object-cover object-[center_20%] saturate-[0.88] contrast-[1.04]"
              />
              <div aria-hidden className="coach-interpretation-photo-shade" />
            </figure>
            <aside className="coach-interpretation-decision" aria-labelledby="coach-decision-heading">
              <h3 id="coach-decision-heading">{compact.decisionLabel}</h3>
              <p>{compact.decisionText}</p>
            </aside>
          </div>
        </div>
        <p className="coach-interpretation-note">{copy.ui.medicalNote}</p>
      </Container>
    </section>
  )
}
export function CoachFaq({ copy, locale }: Props) {
  const faq = copy.sections.faq
  return (
    <section id="faq" className="coach-faq" aria-labelledby="coach-faq-heading">
      <Container>
        <div className="coach-faq-grid">
          <header className="coach-faq-heading">
            <AudienceEyebrow>{faq.eyebrow}</AudienceEyebrow>
            <h2 id="coach-faq-heading">{faq.title}</h2>
            <p>{compactUi[locale].questions}</p>
          </header>
          <Accordion type="single" collapsible className="coach-faq-list">
            {faq.cards.map((p, i) => (
              <AccordionItem value={String(i)} key={p.title}>
                <AccordionTrigger className="coach-faq-trigger">
                  {p.title}
                </AccordionTrigger>
                <AccordionContent className="coach-faq-answer">
                  {p.description}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </Container>
    </section>
  )
}
export function CoachMotionToggle({ copy }: CoachProps) {
  const paused = useMotionPaused()
  return (
    <button
      type="button"
      onClick={() => setMotionPaused(!paused)}
      aria-pressed={paused}
      className="mt-6 inline-flex min-h-11 items-center gap-2 text-xs text-white/50 hover:text-white focus-visible:ring-2 focus-visible:ring-ring"
    >
      {paused ? <Play size={13} /> : <Pause size={13} />}{' '}
      {paused ? copy.ui.resumeMotion : copy.ui.pauseMotion}
    </button>
  )
}

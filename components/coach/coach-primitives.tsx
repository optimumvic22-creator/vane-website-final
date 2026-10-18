'use client'

import { motion, useReducedMotion, type MotionProps } from 'framer-motion'
import { useSyncExternalStore, type ReactNode } from 'react'
import { Container } from '@/components/ui/container'
import { AudienceEyebrow } from '@/components/ui/audience-primitives'
import { useMotionPaused } from '@/lib/motion-preference'
import { sectionReveal, TRANSITION_MQS } from '@/lib/motion'
import type { CoachCopy, CoachSectionCopy } from '@/lib/coach-content'
import { cn } from '@/lib/utils'

export type CoachProps = { copy: CoachCopy }
export const headlineClass =
  'font-display text-5xl font-bold uppercase leading-[0.96] tracking-[0.02em] [-webkit-text-stroke:0.2px_currentColor] [paint-order:stroke_fill] [overflow-wrap:anywhere] md:text-6xl'
export const bodyClass =
  'max-w-[60ch] text-[16px] leading-[1.55] text-muted-foreground md:text-[17px]'
export const gridBackground = {
  backgroundImage:
    'linear-gradient(rgba(255,255,255,.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.02) 1px,transparent 1px)',
  backgroundSize: '80px 80px',
}
const subscribeHydration = () => () => {}
export function useCoachReducedMotion() {
  const reduced = useReducedMotion()
  const paused = useMotionPaused()
  const hydrated = useSyncExternalStore(
    subscribeHydration,
    () => true,
    () => false,
  )
  return hydrated && Boolean(reduced || paused)
}
export const STATIC_COACH_MOTION: MotionProps = {
  initial: false,
  animate: { opacity: 1, x: 0, y: 0, scale: 1 },
  transition: { duration: 0 },
}
export function useCoachReveal(): MotionProps {
  const reduced = useCoachReducedMotion()
  return reduced
    ? STATIC_COACH_MOTION
    : { ...sectionReveal(), transition: TRANSITION_MQS }
}
export function CoachSection({
  id,
  band = false,
  children,
  className,
}: {
  id: string
  band?: boolean
  children: ReactNode
  className?: string
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className={cn(
        'relative scroll-mt-[88px] overflow-hidden py-[4.5rem] md:scroll-mt-[104px] md:py-24',
        band ? 'bg-[#08090A]' : 'bg-background',
        className,
      )}
    >
      <Container className="relative">{children}</Container>
    </section>
  )
}
export function SectionHeading({
  id,
  section,
  centered = false,
}: {
  id: string
  section: CoachSectionCopy
  centered?: boolean
}) {
  const reveal = useCoachReveal()
  return (
    <motion.div
      {...reveal}
      className={cn(centered && 'mx-auto max-w-5xl text-center')}
    >
      <AudienceEyebrow>{section.eyebrow}</AudienceEyebrow>
      <h2 id={`${id}-heading`} className={cn(headlineClass, 'mt-4')}>
        {section.title}
      </h2>
      {section.intro && (
        <p className={cn(bodyClass, 'mt-6', centered && 'mx-auto')}>
          {section.intro}
        </p>
      )}
    </motion.div>
  )
}

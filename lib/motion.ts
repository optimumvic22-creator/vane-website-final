'use client'

import { useReducedMotion } from 'framer-motion'
import type { MotionProps, Transition, Variants } from 'framer-motion'

/* ── Spring Presets ──────────────────────────────────────────────── */

export const SPRING: Transition = { type: 'spring', stiffness: 400, damping: 30 }
export const SPRING_SLOW: Transition = { type: 'spring', stiffness: 200, damping: 40 }
export const SPRING_BOUNCE: Transition = { type: 'spring', stiffness: 500, damping: 20 }
export const SPRING_HEAVY: Transition = { type: 'spring', stiffness: 300, damping: 50 }
export const SPRING_GENTLE: Transition = { type: 'spring', stiffness: 100, damping: 30 }
export const SPRING_SNAP: Transition = { type: 'spring', stiffness: 600, damping: 35 }
export const PREMIUM_SPRING: Transition = { type: 'spring', stiffness: 100, damping: 20 }
export const FADE: Transition = { duration: 0.3 }

/* ── Variant Presets ─────────────────────────────────────────────── */

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: SPRING_SLOW },
}

export const fadeDown: Variants = {
  hidden: { opacity: 0, y: -24 },
  visible: { opacity: 1, y: 0, transition: SPRING_SLOW },
}

export const fadeLeft: Variants = {
  hidden: { opacity: 0, x: -24 },
  visible: { opacity: 1, x: 0, transition: SPRING_SLOW },
}

export const fadeRight: Variants = {
  hidden: { opacity: 0, x: 24 },
  visible: { opacity: 1, x: 0, transition: SPRING_SLOW },
}

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: SPRING },
}

export const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
}

export const staggerContainerSlow: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15, delayChildren: 0.15 } },
}

/* ── Viewport Triggers ───────────────────────────────────────────── */

export const VIEWPORT_ONCE = { once: true, margin: '-10%' as const }
export const VIEWPORT_REPEAT = { once: false, margin: '-10%' as const }

/* ── Interaction Presets ─────────────────────────────────────────── */

export const hoverPress = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.98 },
  transition: SPRING,
}

export const hoverLift = {
  whileHover: { y: -2, scale: 1.01 },
  whileTap: { scale: 0.99 },
  transition: SPRING,
}

export const hoverLiftLarge = {
  whileHover: { y: -6, scale: 1.02 },
  whileTap: { scale: 0.98 },
  transition: SPRING,
}

export const hoverScale = {
  whileHover: { scale: 1.05 },
  whileTap: { scale: 0.95 },
  transition: SPRING,
}

/* ── Section Reveal Helpers ──────────────────────────────────────── */

export function sectionReveal(delay = 0): MotionProps {
  return {
    initial: { opacity: 0, y: 32 },
    whileInView: { opacity: 1, y: 0 },
    viewport: VIEWPORT_ONCE,
    transition: { ...SPRING_SLOW, delay },
  }
}

export function staggerReveal(staggerDelay = 0.08): MotionProps {
  return {
    initial: 'hidden',
    whileInView: 'visible',
    viewport: VIEWPORT_ONCE,
    variants: {
      hidden: {},
      visible: { transition: { staggerChildren: staggerDelay, delayChildren: 0.1 } },
    },
  }
}

export function staggerItem(delay = 0): MotionProps {
  return {
    variants: {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0, transition: { ...SPRING_SLOW, delay } },
    },
  }
}

/* ── VANE-specific Animations ──────────────────────────────────────── */

export const radarGrow: Variants = {
  hidden: { scale: 0, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { ...SPRING_SLOW, delay: 0.6 } },
}

export const domainBarFill = (delay: number): MotionProps => ({
  initial: { width: 0 },
  whileInView: { width: '100%' },
  viewport: VIEWPORT_ONCE,
  transition: { ...SPRING_SLOW, delay: 0.2 + delay * 0.08 },
})

/* ── Accessibility ───────────────────────────────────────────────── */

export function useAccessibleMotion(motionProps: MotionProps): MotionProps {
  const shouldReduce = useReducedMotion()
  if (shouldReduce) {
    return {
      ...motionProps,
      initial: undefined,
      animate: undefined,
      whileInView: undefined,
      whileHover: undefined,
      whileTap: undefined,
      transition: { duration: 0 },
    }
  }
  return motionProps
}

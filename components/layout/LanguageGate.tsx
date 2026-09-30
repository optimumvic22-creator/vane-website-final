'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { SPRING, SPRING_SLOW, FADE } from '@/lib/motion'
import { useLocale } from '@/lib/locale'
import { FlagUK, FlagDE } from './flag-icons'

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
}

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: SPRING_SLOW },
  exit: { opacity: 0, scale: 0.95, y: -10, transition: FADE },
}

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
}

const staggerChild = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: SPRING },
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

export function LanguageGate() {
  const { setLocale, dismissGate } = useLocale()
  const containerRef = useRef<HTMLDivElement>(null)

  const handleSelect = (lang: 'en' | 'de') => {
    setLocale(lang)
    dismissGate()
  }

  // Focus trap: keep Tab / Shift+Tab cycling between the modal's focusable
  // elements so keyboard users cannot reach the (inert) page behind the gate.
  // NOTE: Escape-to-close is intentionally NOT implemented. A language choice
  // is required to proceed, so dismissing the gate without a choice would be
  // semantically wrong. No focus-restore on close either: making a selection
  // replaces the entire gate (it unmounts and the page becomes interactive),
  // and the gate is opened programmatically on first visit rather than from a
  // trigger element, so there is nothing to restore focus to.
  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return

      const focusable = Array.from(
        container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      ).filter((el) => el.offsetParent !== null || el === document.activeElement)

      if (focusable.length === 0) {
        event.preventDefault()
        return
      }

      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      const active = document.activeElement

      if (event.shiftKey) {
        // Wrap from the first element back to the last.
        if (active === first || !container.contains(active)) {
          event.preventDefault()
          last.focus()
        }
      } else {
        // Wrap from the last element back to the first.
        if (active === last || !container.contains(active)) {
          event.preventDefault()
          first.focus()
        }
      }
    }

    container.addEventListener('keydown', handleKeyDown)
    return () => {
      container.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [])

  return (
    <motion.div
      ref={containerRef}
      variants={overlayVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={FADE}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lang-gate-heading"
    >
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="mx-4 w-full max-w-md rounded-2xl border border-border/20 bg-card/90 p-8 text-center backdrop-blur-sm md:p-12"
      >
        <motion.div variants={staggerContainer} initial="hidden" animate="visible">
          <motion.p variants={staggerChild} className="text-xs font-normal uppercase tracking-[0.15em] text-muted-foreground">
            VANE
          </motion.p>
          <motion.h2 variants={staggerChild} id="lang-gate-heading" className="mt-3 text-2xl font-normal tracking-[-0.02em] text-foreground md:text-3xl">
            Choose your language
          </motion.h2>
          <motion.p variants={staggerChild} className="mt-2 text-sm text-muted-foreground">
            Wähle deine Sprache
          </motion.p>
          <motion.div variants={staggerChild} className="mt-8 flex items-center justify-center gap-6">
            <motion.button
              whileHover={{ y: -4, scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={SPRING}
              onClick={() => handleSelect('en')}
              autoFocus
              aria-label="English"
              className="group flex flex-col items-center gap-3 rounded-xl border border-border/20 bg-background/50 px-8 py-6 transition-colors hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <FlagUK className="h-10 w-16" />
              <span className="text-sm font-medium tracking-wide text-foreground">EN</span>
            </motion.button>
            <motion.button
              whileHover={{ y: -4, scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={SPRING}
              onClick={() => handleSelect('de')}
              aria-label="Deutsch (German)"
              className="group flex flex-col items-center gap-3 rounded-xl border border-border/20 bg-background/50 px-8 py-6 transition-colors hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <FlagDE className="h-10 w-16" />
              <span className="text-sm font-medium tracking-wide text-foreground">DE</span>
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

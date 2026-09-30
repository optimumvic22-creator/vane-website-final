'use client'

import { Pause, Play } from 'lucide-react'
import { useLocale } from '@/lib/locale'
import { setMotionPaused, useMotionPaused } from '@/lib/motion-preference'
import { cn } from '@/lib/utils'

export function MotionToggle({ className }: { className?: string }) {
  const { locale } = useLocale()
  const paused = useMotionPaused()
  const label = locale === 'de'
    ? paused ? 'Bewegung fortsetzen' : 'Bewegung pausieren'
    : paused ? 'Resume motion' : 'Pause motion'

  return (
    <button
      type="button"
      onClick={() => setMotionPaused(!paused)}
      aria-label={label}
      title={label}
      className={cn('inline-flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full border border-white/12 bg-black/20 text-white/70 transition-colors hover:border-white/30 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mqs-value-inv)] focus-visible:ring-offset-2 focus-visible:ring-offset-black', className)}
    >
      {paused ? <Play size={15} aria-hidden="true" /> : <Pause size={15} aria-hidden="true" />}
    </button>
  )
}

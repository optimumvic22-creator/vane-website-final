'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { sectionReveal } from '@/lib/motion'
import { useLocale } from '@/lib/locale'
import { DOMAIN_COLORS } from '@/lib/domain-colors'

/* ── Types ──────────────────────────────────────────────────────── */

interface DomainDef {
  code: string
  label: string
  labelDe?: string
  baselineScore: number
  videoUrl?: string
  /** One-sentence plain-language definition, resolved per locale. */
  description?: string
}

export interface MqsInteractiveProps {
  domains?: DomainDef[]
}

/* ── Defaults ───────────────────────────────────────────────────── */

export const DEFAULT_DOMAINS: DomainDef[] = [
  { code: 'GAIT', label: 'Gait', labelDe: 'Gangbild', baselineScore: 58 },
  { code: 'POST', label: 'Postural Control', labelDe: 'Posturale Kontrolle', baselineScore: 52 },
  { code: 'FORCE', label: 'Force', labelDe: 'Kraftfähigkeit', baselineScore: 61 },
  { code: 'POWER', label: 'Power', labelDe: 'Power', baselineScore: 55 },
  { code: 'MOTOR', label: 'Motor Control', labelDe: 'Motorische Kontrolle', baselineScore: 49 },
  { code: 'NEURO', label: 'Neuro Response', labelDe: 'Neuro Response', baselineScore: 54 },
  { code: 'DTC', label: 'Dual Task Cost', labelDe: 'Dual Task Cost', baselineScore: 47 },
]

/** One plain-language sentence per domain (official definitions). */
export const DOMAIN_DESCRIPTIONS: Record<string, { en: string; de: string }> = {
  GAIT: {
    en: 'Walking and locomotion quality: rhythm, symmetry, pace control, and basic movement consistency.',
    de: 'Geh- und Fortbewegungsqualität: Rhythmus, Symmetrie, Tempokontrolle und grundlegende Bewegungskonstanz.',
  },
  POST: {
    en: 'Balance and body control in static and dynamic tasks.',
    de: 'Balance und Körperkontrolle in statischen und dynamischen Aufgaben.',
  },
  FORCE: {
    en: 'Strength level, strength balance, and differences between sides.',
    de: 'Kraftniveau, Kraftbalance und Seitenunterschiede.',
  },
  POWER: {
    en: 'Jump output, reactive qualities, and how quickly force can be produced.',
    de: 'Sprungoutput, reaktive Qualitäten und wie schnell Kraft erzeugt werden kann.',
  },
  MOTOR: {
    en: 'Coordination, landing quality, joint alignment, timing, and visible movement organisation under load.',
    de: 'Koordination, Landequalität, Gelenkausrichtung, Timing und sichtbare Bewegungsorganisation unter Belastung.',
  },
  NEURO: {
    en: 'Reaction speed, processing speed, and the link between perception, decision, and movement execution.',
    de: 'Reaktionsgeschwindigkeit, Verarbeitungsgeschwindigkeit und Verbindung von Wahrnehmung, Entscheidung und Bewegungsausführung.',
  },
  DTC: {
    en: 'How much movement quality drops when a cognitive task is added.',
    de: 'Wie stark Bewegungsqualität abfällt, wenn eine kognitive Aufgabe dazukommt.',
  },
}

/* ── Algorithm ──────────────────────────────────────────────────── */

function computeTotal(scores: number[]): number {
  const n = scores.length
  const safeScores = scores.map(s => Math.max(s, 1))
  const am = safeScores.reduce((a, b) => a + b, 0) / n
  const hm = n / safeScores.reduce((s, x) => s + 1 / x, 0)
  const total = 0.7 * am + 0.3 * hm + 1.4
  return Math.min(100, Math.max(0, Math.round(total)))
}

/* ── Constants ──────────────────────────────────────────────────── */

const DIAL_SIZE = 340
const DIAL_VIEWBOX = 340
const DIAL_RADIUS = 158
const DIAL_CIRC = 2 * Math.PI * DIAL_RADIUS
const INNER_TRACK_R = 168

/* ── Component ──────────────────────────────────────────────────── */

export function MqsInteractive({ domains }: MqsInteractiveProps) {
  const { locale } = useLocale()
  const isDE = locale === 'de'
  const resolvedDomains = useMemo(() => {
    const source = domains ?? DEFAULT_DOMAINS
    return source.map(d => ({
      ...d,
      label: isDE ? (d.labelDe || d.label) : d.label,
      description: isDE
        ? DOMAIN_DESCRIPTIONS[d.code]?.de
        : DOMAIN_DESCRIPTIONS[d.code]?.en,
    }))
  }, [domains, isDE])
  const reduceMotion = useReducedMotion()

  const [scores, setScores] = useState<number[]>(() =>
    resolvedDomains.map(d => d.baselineScore),
  )

  const total = useMemo(() => computeTotal(scores), [scores])

  /* ── Orbit positioning state ──────────────────────────────────── */
  const orbitRef = useRef<HTMLDivElement>(null)
  const dialRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLElement | null)[]>([])
  const [cardPositions, setCardPositions] = useState<{ x: number; y: number }[]>([])
  const [connectionPaths, setConnectionPaths] = useState<string[]>([])
  const [orbitSize, setOrbitSize] = useState({ w: 0, h: 0 })

  /* ── Tooltip state ────────────────────────────────────────────── */
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number; side: 'left' | 'right' }>({
    x: 0,
    y: 0,
    side: 'right',
  })

  /* ── Positioning logic ────────────────────────────────────────── */
  const positionOrbit = useCallback(() => {
    const wrap = orbitRef.current
    const dialEl = dialRef.current
    if (!wrap || !dialEl) return

    const wrapRect = wrap.getBoundingClientRect()
    const cx = wrapRect.width / 2
    const cy = wrapRect.height / 2
    const orbitRadius = Math.min(wrapRect.width, wrapRect.height) * 0.40

    const positions = resolvedDomains.map((_, i) => {
      const angle = (-90 + i * (360 / resolvedDomains.length)) * (Math.PI / 180)
      return {
        x: cx + orbitRadius * Math.cos(angle),
        y: cy + orbitRadius * Math.sin(angle),
      }
    })
    setCardPositions(positions)
    setOrbitSize({ w: wrapRect.width, h: wrapRect.height })

    // Connection lines
    const dialRect = dialEl.getBoundingClientRect()
    const dialCx = dialRect.left - wrapRect.left + dialRect.width / 2
    const dialCy = dialRect.top - wrapRect.top + dialRect.height / 2
    const dialPixelRadius = dialRect.width / 2

    const paths = positions.map(pos => {
      const dx = dialCx - pos.x
      const dy = dialCy - pos.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < 1) return ''

      const ex = dialCx - (dx / dist) * dialPixelRadius
      const ey = dialCy - (dy / dist) * dialPixelRadius

      const angle = Math.atan2(dy, dx)
      const midX = (pos.x + ex) / 2 + Math.cos(angle + Math.PI / 2) * 14
      const midY = (pos.y + ey) / 2 + Math.sin(angle + Math.PI / 2) * 14

      return `M ${pos.x} ${pos.y} Q ${midX} ${midY} ${ex} ${ey}`
    })
    setConnectionPaths(paths)
  }, [resolvedDomains])

  useEffect(() => {
    positionOrbit()

    const wrap = orbitRef.current
    if (!wrap) return

    const ro = new ResizeObserver(() => positionOrbit())
    ro.observe(wrap)
    return () => ro.disconnect()
  }, [positionOrbit])

  /* ── Interaction handlers ─────────────────────────────────────── */
  const handleDomainChange = useCallback((idx: number, value: number) => {
    setScores(prev => {
      const next = [...prev]
      next[idx] = Math.max(0, Math.min(100, value))
      return next
    })
  }, [])

  const handleMasterChange = useCallback(
    (target: number) => {
      setScores(prev => {
        const next = [...prev]
        for (let iter = 0; iter < 3; iter++) {
          const current = computeTotal(next)
          const delta = target - current
          if (delta === 0) break
          for (let i = 0; i < next.length; i++) {
            next[i] = Math.max(0, Math.min(100, next[i] + delta))
          }
        }
        return next
      })
    },
    [],
  )

  /* ── Tooltip positioning on hover ─────────────────────────────── */
  const handleCardEnter = useCallback(
    (idx: number, el: HTMLElement) => {
      const rect = el.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const vpW = window.innerWidth
      const side = centerX < vpW / 2 ? 'right' : 'left'
      // x position will be recalculated once video dimensions are known
      const tooltipW = 180
      const tooltipH = 350
      const x = side === 'right' ? rect.right + 12 : rect.left - tooltipW - 12
      const y = rect.top + rect.height / 2 - tooltipH / 2
      setTooltipPos({ x, y, side })
      setHoveredIdx(idx)
    },
    [],
  )

  /* Tap on touch devices toggles the same detail state hover sets. */
  const handleCardToggle = useCallback(
    (idx: number, el: HTMLElement) => {
      if (hoveredIdx === idx) {
        setHoveredIdx(null)
        return
      }
      handleCardEnter(idx, el)
    },
    [hoveredIdx, handleCardEnter],
  )

  /* ── Derived ──────────────────────────────────────────────────── */
  const dialOffset = DIAL_CIRC * (1 - total / 100)

  return (
    <motion.div {...sectionReveal(0.1)} className="relative mt-12">
      {/* ── Desktop: orbit layout ──────────────────────────────── */}
      <div
        ref={orbitRef}
        className="relative mx-auto hidden w-full max-w-[1100px] md:block"
        style={{ aspectRatio: '1 / 1' }}
      >
        {/* Connection lines SVG overlay */}
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
          viewBox={`0 0 ${orbitSize.w || 1100} ${orbitSize.h || 1100}`}
          preserveAspectRatio="none"
          aria-hidden="true"
          style={{ zIndex: 1 }}
        >
          {connectionPaths.map((d, i) => {
            const domainColor = DOMAIN_COLORS[resolvedDomains[i]?.code] || 'var(--mqs-accent)'
            return d ? (
              <path
                key={i}
                d={d}
                fill="none"
                stroke={`${domainColor}66`}
                strokeWidth={1}
                className={reduceMotion ? 'opacity-50' : 'animate-[connPulse_5s_ease-in-out_infinite]'}
                style={{
                  filter: `drop-shadow(0 0 4px ${domainColor}38)`,
                  opacity: reduceMotion ? 0.5 : undefined,
                  animationDelay: `${2.2 + i * 0.2}s`,
                }}
              />
            ) : null
          })}
        </svg>

        {/* Center dial */}
        <div
          className="absolute left-1/2 top-1/2 z-[3] flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
          style={{ width: DIAL_SIZE }}
        >
          <div ref={dialRef} className="relative" style={{ width: DIAL_SIZE, height: DIAL_SIZE }}>
            <svg viewBox={`0 0 ${DIAL_VIEWBOX} ${DIAL_VIEWBOX}`} className="block h-full w-full overflow-visible">
              <circle
                cx={DIAL_VIEWBOX / 2}
                cy={DIAL_VIEWBOX / 2}
                r={INNER_TRACK_R}
                fill="none"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth={1}
              />
              <circle
                cx={DIAL_VIEWBOX / 2}
                cy={DIAL_VIEWBOX / 2}
                r={DIAL_RADIUS}
                fill="none"
                stroke="rgba(255,255,255,0.14)"
                strokeWidth={1}
              />
              <circle
                cx={DIAL_VIEWBOX / 2}
                cy={DIAL_VIEWBOX / 2}
                r={DIAL_RADIUS}
                fill="none"
                stroke="var(--mqs-accent)"
                strokeWidth={2}
                strokeLinecap="round"
                strokeDasharray={DIAL_CIRC}
                strokeDashoffset={dialOffset}
                className="-rotate-90 origin-center transition-[stroke-dashoffset] duration-[450ms]"
                style={{
                  transitionTimingFunction: 'cubic-bezier(.16,1,.3,1)',
                }}
              />
            </svg>
            {/* Inner glow */}
            {/* Number + label */}
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span
                className="font-mono text-[140px] font-light leading-[0.9] tracking-[-0.045em] text-[var(--mqs-value-inv)] tabular-nums transition-colors duration-[400ms]"
                style={{ transitionTimingFunction: 'cubic-bezier(.16,1,.3,1)' }}
              >
                {total}
              </span>
              <span className="mt-3 font-mono text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
                MQS
              </span>
            </div>
          </div>

          {/* Master slider */}
          <div className="mt-8 w-full max-w-[380px] border-t border-border/10 pt-5">
            <div className="mb-3.5 flex items-baseline justify-between">
              <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                Overall MQS
              </span>
              <span
                className="font-mono text-[22px] font-light tracking-[-0.02em] text-[var(--mqs-value-inv)] tabular-nums transition-colors duration-[400ms]"
              >
                {total}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={total}
              step={1}
              onChange={e => handleMasterChange(parseInt(e.target.value, 10))}
              aria-label={isDE ? 'Gesamt-MQS' : 'Overall MQS'}
              className="h-[22px] w-full cursor-pointer appearance-none bg-transparent
                [&::-webkit-slider-runnable-track]:h-px [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-border/30
                [&::-webkit-slider-thumb]:mt-[-6.5px] [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-[1.5px] [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:bg-background
                [&::-moz-range-track]:h-px [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-border/30
                [&::-moz-range-thumb]:h-3.5 [&::-moz-range-thumb]:w-3.5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-[1.5px] [&::-moz-range-thumb]:border-primary [&::-moz-range-thumb]:bg-background"
            />
            <p className="mt-3 text-center font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
              Drag to shift all seven
            </p>
          </div>
        </div>

        {/* Domain cards in an absolute positioned orbit */}
        {resolvedDomains.map((domain, i) => {
          const pos = cardPositions[i]
          if (!pos) return null
          const score = scores[i]
          const weak = score < 50
          return (
            <DomainCard
              key={domain.code}
              domain={domain}
              score={score}
              index={i}
              style={{
                position: 'absolute',
                left: pos.x,
                top: pos.y,
                transform: 'translate(-50%, -50%)',
                zIndex: 2,
              }}
              weak={weak}
              onScoreChange={handleDomainChange}
              onMouseEnter={handleCardEnter}
              onMouseLeave={() => setHoveredIdx(null)}
              onToggle={handleCardToggle}
              ref={(el: HTMLElement | null) => { cardRefs.current[i] = el }}
            />
          )
        })}
      </div>

      {/* ── Mobile: stacked layout ─────────────────────────────── */}
      <div className="block md:hidden">
        {/* Centered dial */}
        <div className="mx-auto flex flex-col items-center">
          <div className="relative" style={{ width: 240, height: 240 }}>
            <svg viewBox={`0 0 ${DIAL_VIEWBOX} ${DIAL_VIEWBOX}`} className="block h-full w-full overflow-visible">
              <circle
                cx={DIAL_VIEWBOX / 2}
                cy={DIAL_VIEWBOX / 2}
                r={INNER_TRACK_R}
                fill="none"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth={1}
              />
              <circle
                cx={DIAL_VIEWBOX / 2}
                cy={DIAL_VIEWBOX / 2}
                r={DIAL_RADIUS}
                fill="none"
                stroke="rgba(255,255,255,0.14)"
                strokeWidth={1}
              />
              <circle
                cx={DIAL_VIEWBOX / 2}
                cy={DIAL_VIEWBOX / 2}
                r={DIAL_RADIUS}
                fill="none"
                stroke="var(--mqs-accent)"
                strokeWidth={2}
                strokeLinecap="round"
                strokeDasharray={DIAL_CIRC}
                strokeDashoffset={dialOffset}
                className="-rotate-90 origin-center transition-[stroke-dashoffset] duration-[450ms]"
                style={{
                  transitionTimingFunction: 'cubic-bezier(.16,1,.3,1)',
                }}
              />
            </svg>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span
                className="font-mono text-7xl font-light leading-[0.9] tracking-[-0.045em] text-[var(--mqs-value-inv)] tabular-nums transition-colors duration-[400ms]"
              >
                {total}
              </span>
              <span className="mt-2 font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
                MQS
              </span>
            </div>
          </div>

          {/* Master slider for mobile */}
          <div className="mt-6 w-full max-w-[320px] border-t border-border/10 pt-4">
            <div className="mb-3 flex items-baseline justify-between">
              <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                Overall MQS
              </span>
              <span
                className="font-mono text-lg font-light text-[var(--mqs-value-inv)] tabular-nums transition-colors"
              >
                {total}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={total}
              step={1}
              onChange={e => handleMasterChange(parseInt(e.target.value, 10))}
              aria-label={isDE ? 'Gesamt-MQS' : 'Overall MQS'}
              className="h-[22px] w-full cursor-pointer appearance-none bg-transparent
                [&::-webkit-slider-runnable-track]:h-px [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-border/30
                [&::-webkit-slider-thumb]:mt-[-6.5px] [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-[1.5px] [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:bg-background
                [&::-moz-range-track]:h-px [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-border/30
                [&::-moz-range-thumb]:h-3.5 [&::-moz-range-thumb]:w-3.5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-[1.5px] [&::-moz-range-thumb]:border-primary [&::-moz-range-thumb]:bg-background"
            />
            <p className="mt-2 text-center font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
              Drag to shift all seven
            </p>
          </div>
        </div>

        {/* 2-column grid of cards */}
        <div className="mt-10 grid grid-cols-2 gap-3">
          {resolvedDomains.map((domain, i) => {
            const score = scores[i]
            const weak = score < 50
            return (
              <DomainCard
                key={domain.code}
                domain={domain}
                score={score}
                index={i}
                weak={weak}
                onScoreChange={handleDomainChange}
                onMouseEnter={handleCardEnter}
                onMouseLeave={() => setHoveredIdx(null)}
                onToggle={handleCardToggle}
              />
            )
          })}
        </div>
      </div>

      {/* ── Hover tooltip (only when a demo video exists) ──────── */}
      {hoveredIdx !== null && resolvedDomains[hoveredIdx]?.videoUrl && (
        <div
          className="pointer-events-none fixed z-[100] hidden flex-col overflow-hidden rounded-[10px] border border-border/30 shadow-[0_12px_40px_-10px_rgba(0,0,0,0.7)] backdrop-blur-xl md:flex"
          style={{
            left: tooltipPos.x,
            top: tooltipPos.y,
            width: 180,
            height: 350,
            background: 'rgba(10,11,13,0.95)',
          }}
        >
          <div className="relative flex flex-1 items-center justify-center bg-white/[0.04]">
            <video
              autoPlay
              muted
              loop
              playsInline
              className="block h-full w-full object-cover"
              src={resolvedDomains[hoveredIdx]?.videoUrl}
            />
          </div>
          <div className="border-t border-border/10 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.22em] text-muted-foreground">
            {resolvedDomains[hoveredIdx]?.label}
          </div>
        </div>
      )}
    </motion.div>
  )
}

/* ── Domain Card ────────────────────────────────────────────────── */

import { forwardRef } from 'react'

interface DomainCardProps {
  domain: DomainDef
  score: number
  index: number
  weak: boolean
  style?: React.CSSProperties
  onScoreChange: (idx: number, value: number) => void
  onMouseEnter: (idx: number, el: HTMLElement) => void
  onMouseLeave: () => void
  onToggle: (idx: number, el: HTMLElement) => void
}

const DomainCard = forwardRef<HTMLElement, DomainCardProps>(function DomainCard(
  { domain, score, index, weak, style, onScoreChange, onMouseEnter, onMouseLeave, onToggle },
  ref,
) {
  const cardRef = useRef<HTMLElement>(null)
  const lastPointerType = useRef<string>('')
  const domainColor = DOMAIN_COLORS[domain.code] || 'var(--mqs-accent)'

  // Merge forwarded ref and local ref
  const setRef = useCallback(
    (el: HTMLElement | null) => {
      (cardRef as React.MutableRefObject<HTMLElement | null>).current = el
      if (typeof ref === 'function') ref(el)
      else if (ref) (ref as React.MutableRefObject<HTMLElement | null>).current = el
    },
    [ref],
  )

  const handleEnter = useCallback(() => {
    if (cardRef.current) onMouseEnter(index, cardRef.current)
  }, [index, onMouseEnter])

  /* Hover is mouse-only; touch devices get tap-to-toggle instead
     (emulated mouseenter on tap would otherwise fight the toggle). */
  const handlePointerEnter = useCallback(
    (e: React.PointerEvent) => {
      if (e.pointerType === 'touch') return
      handleEnter()
    },
    [handleEnter],
  )

  const handlePointerLeave = useCallback(
    (e: React.PointerEvent) => {
      if (e.pointerType === 'touch') return
      onMouseLeave()
    },
    [onMouseLeave],
  )

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      // Slider interactions must never toggle the detail view.
      if ((e.target as HTMLElement).closest('input')) return
      if (lastPointerType.current !== 'touch') return
      if (cardRef.current) onToggle(index, cardRef.current)
    },
    [index, onToggle],
  )

  return (
    <article
      ref={setRef}
      className={`w-[146px] cursor-pointer rounded-none border backdrop-blur-lg transition-[border-color,background,box-shadow] duration-[600ms] ${
        weak
          ? 'border-amber-400/20 bg-[rgba(10,11,13,0.72)] hover:border-amber-400/30 hover:bg-[rgba(14,16,20,0.88)]'
          : 'border-border/10 bg-[rgba(10,11,13,0.72)] hover:border-border/30 hover:bg-[rgba(14,16,20,0.88)]'
      }`}
      style={{
        '--domain-color': domainColor,
        padding: '14px 14px 16px',
        boxShadow: '0 20px 40px -20px rgba(0,0,0,0.6)',
        transitionTimingFunction: 'cubic-bezier(.16,1,.3,1)',
        borderTopColor: domainColor,
        borderTopWidth: '2px',
        ...style,
      } as React.CSSProperties}
      onPointerDown={e => { lastPointerType.current = e.pointerType }}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onClick={handleClick}
      // Keyboard parity: focusing the domain slider shows the same detail hover does.
      onFocus={handleEnter}
      onBlur={onMouseLeave}
    >
      {/* Video hint badge shown only when a demo video exists */}
      {domain.videoUrl && (
        <div
          className="mb-2.5 flex w-fit items-center gap-[5px] rounded border px-2 py-1 transition-[background,border-color] duration-300"
          style={{
            borderColor: `${domainColor}33`,
            background: `${domainColor}1F`,
          }}
        >
          <svg width={12} height={12} viewBox="0 0 12 12">
            <path d="M3 2l7 4-7 4V2z" fill={domainColor} />
          </svg>
          <span
            className="font-mono text-[8px] uppercase leading-none tracking-[0.18em]"
            style={{ color: domainColor }}
          >
            Watch
          </span>
        </div>
      )}

      {/* Domain code */}
      <div
        className="mb-0.5 font-mono text-[10px] uppercase tracking-[0.24em]"
        style={{ color: domainColor }}
      >
        {domain.code}
      </div>

      {/* Domain label */}
      <div className="mb-1.5 text-[11px] tracking-[-0.005em] text-muted-foreground">
        {domain.label}
      </div>

      {/* One-sentence plain-language definition */}
      {domain.description && (
        <p className="mb-2.5 text-[10px] leading-[1.5] text-muted-foreground">
          {domain.description}
        </p>
      )}

      {/* Score number */}
      <div
        className="mb-2.5 font-mono text-[32px] font-light leading-[0.95] tracking-[-0.03em] tabular-nums transition-colors duration-[400ms]"
        style={{
          transitionTimingFunction: 'cubic-bezier(.16,1,.3,1)',
          color: weak ? domainColor : undefined,
        }}
      >
        {score}
        {weak && (
          <span className="ml-1 inline-block h-1.5 w-1.5 rounded-full bg-amber-400/60" />
        )}
      </div>

      {/* Domain slider */}
      <input
        type="range"
        min={0}
        max={100}
        value={score}
        step={1}
        onChange={e => onScoreChange(index, parseInt(e.target.value, 10))}
        aria-label={domain.label}
        className="h-[18px] w-full cursor-pointer appearance-none bg-transparent
          [&::-webkit-slider-runnable-track]:h-px [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-border/30
          [&::-webkit-slider-thumb]:mt-[-4.5px] [&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-[1.5px] [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:bg-background
          [&::-moz-range-track]:h-px [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-border/30
          [&::-moz-range-thumb]:h-2.5 [&::-moz-range-thumb]:w-2.5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-[1.5px] [&::-moz-range-thumb]:border-primary [&::-moz-range-thumb]:bg-background"
      />
    </article>
  )
})

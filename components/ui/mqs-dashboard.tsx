'use client'

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { SPRING_SLOW } from '@/lib/motion'
import { DOMAIN_COLORS } from '@/lib/domain-colors'
import { useMediaPlayback } from '@/lib/use-media-playback'
import { useMotionPaused } from '@/lib/motion-preference'
import {
  MQS_SCORE_MAX,
  MQS_SCORE_MIN,
  calculateMqsScore,
  setDomainScore,
  shiftProfileToMqs,
  type MqsDomainCode,
  type MqsDomainValue,
} from '@/lib/mqs-interaction'

type DomainData = MqsDomainValue

const DEFAULT_DOMAINS: DomainData[] = [
  { code: 'GAIT', score: 59 },
  { code: 'POST', score: 54 },
  { code: 'FORCE', score: 62 },
  { code: 'POWER', score: 57 },
  { code: 'MOTOR', score: 49 },
  { code: 'NEURO', score: 54 },
  { code: 'DTC', score: 47 },
]

const DEFAULT_OVERALL = 55
const DEFAULT_BASELINE = 49
const DEFAULT_RETEST_DELTA = DEFAULT_OVERALL - DEFAULT_BASELINE

type DashboardLocale = 'en' | 'de'
type DashboardAudience = 'athlete' | 'coach' | 'partner'

const DASHBOARD_COPY = {
  en: {
    sampleValues: 'Illustrative values',
    scoreContext: 'T score · illustrative profile',
    retestChange: '+6 at retest',
    reference: '7 domains · reference values ages 18 to 75',
    profileId: 'PT-VAR-03',
    mqs: 'MQS',
  },
  de: {
    sampleValues: 'Beispielwerte',
    scoreContext: 'T Score · Beispielprofil',
    retestChange: '+6 im Retest',
    reference: '7 Domänen · Referenzwerte 18 bis 75 Jahre',
    profileId: 'PT-VAR-03',
    mqs: 'MQS',
  },
} as const

const DOMAIN_LABELS: Record<
  DashboardLocale,
  Record<MqsDomainCode, string>
> = {
  en: {
    GAIT: 'Gait',
    POST: 'Posture',
    FORCE: 'Force',
    POWER: 'Power',
    MOTOR: 'Motor',
    NEURO: 'Neuro',
    DTC: 'Dual task',
  },
  de: {
    GAIT: 'Gang',
    POST: 'Haltung',
    FORCE: 'Kraft',
    POWER: 'Power',
    MOTOR: 'Motorik',
    NEURO: 'Neuro',
    DTC: 'Dual Task Cost',
  },
}

const DOMAIN_INITIALS: Record<MqsDomainCode, string> = {
  GAIT: 'GAT',
  POST: 'PST',
  FORCE: 'FRC',
  POWER: 'PWR',
  MOTOR: 'MTR',
  NEURO: 'NRO',
  DTC: 'DTC',
}

const DOMAIN_MEDIA: Partial<
  Record<
    MqsDomainCode,
    {
      src: string
      label: string
      objectPosition: string
    }
  >
> = {
  GAIT: {
    src: '/media/mqs-domains/gait-colin-side-view-web.mp4',
    label: 'Gait',
    objectPosition: '50% 50%',
  },
  POST: {
    src: '/media/mqs-domains/posture-img-7757-web.mp4',
    label: 'Posture',
    objectPosition: '50% 50%',
  },
  FORCE: {
    src: '/media/mqs-domains/force-dario-tb-deadlift-web.mp4',
    label: 'Force',
    objectPosition: '50% 50%',
  },
  POWER: {
    src: '/media/mqs-domains/power-dario-keiser-push-pull-web.mp4',
    label: 'Power',
    objectPosition: '50% 50%',
  },
  MOTOR: {
    src: '/media/mqs-domains/motor-img-6130-web.mp4',
    label: 'Motor',
    objectPosition: '50% 50%',
  },
  NEURO: {
    src: '/media/mqs-domains/neuro-julius-single-leg-line-hop-web.mp4',
    label: 'Neuro',
    objectPosition: '50% 50%',
  },
  DTC: {
    src: '/media/mqs-domains/dtc-colin-crossover-step-web.mp4',
    label: 'Dual Task Cost',
    objectPosition: '50% 50%',
  },
}

const DOMAIN_MEDIA_CODES = [
  'GAIT',
  'POST',
  'FORCE',
  'POWER',
  'MOTOR',
  'NEURO',
  'DTC',
] as const satisfies readonly MqsDomainCode[]

function randomDomainMediaCode(): MqsDomainCode {
  const randomValue = new Uint32Array(1)
  crypto.getRandomValues(randomValue)
  return DOMAIN_MEDIA_CODES[randomValue[0] % DOMAIN_MEDIA_CODES.length]
}

function barWidth(score: number): number {
  return Math.min(
    100,
    Math.max(
      0,
      ((score - MQS_SCORE_MIN) / (MQS_SCORE_MAX - MQS_SCORE_MIN)) * 100,
    ),
  )
}

type RangeStyle = CSSProperties & {
  '--mqs-range-color': string
  '--mqs-range-progress': string
}

function rangeStyle(score: number, color: string): RangeStyle {
  return {
    '--mqs-range-color': color,
    '--mqs-range-progress': `${barWidth(score)}%`,
  }
}

const RADAR_CENTER_X = 80
const RADAR_CENTER_Y = 70
const RADAR_RADIUS = 52

function radarPoint(
  index: number,
  count: number,
  radius: number,
): { x: number; y: number } {
  const angle = -Math.PI / 2 + (index * Math.PI * 2) / count
  return {
    x: RADAR_CENTER_X + Math.cos(angle) * radius,
    y: RADAR_CENTER_Y + Math.sin(angle) * radius,
  }
}

function radarRingPoints(count: number, ratio: number): string {
  return Array.from({ length: count }, (_, index) => {
    const point = radarPoint(index, count, RADAR_RADIUS * ratio)
    return `${point.x},${point.y}`
  }).join(' ')
}

export type MqsDashboardProps = {
  variant: 'standalone' | 'compact' | 'audience'
  domains?: DomainData[]
  overallScore?: number
  locale?: DashboardLocale
  audience?: DashboardAudience
}

export function MqsDashboard({
  variant,
  domains,
  overallScore,
  locale = 'en',
  audience = 'athlete',
}: MqsDashboardProps) {
  const isCompact = variant === 'compact'
  const activeDomains = domains ?? DEFAULT_DOMAINS
  const activeScore = overallScore ?? DEFAULT_OVERALL
  const labels = DASHBOARD_COPY[locale]
  const systemReducedMotion = useReducedMotion()
  const motionPaused = useMotionPaused()
  const reduceMotion = systemReducedMotion || motionPaused
  const interactiveSeed = useMemo(() => {
    const source = (domains ?? DEFAULT_DOMAINS).map((domain) => ({
      ...domain,
    }))

    return overallScore === undefined
      ? source
      : shiftProfileToMqs(source, overallScore)
  }, [domains, overallScore])
  const [interactiveDomains, setInteractiveDomains] =
    useState<DomainData[]>(interactiveSeed)
  const [activeDomainCode, setActiveDomainCode] =
    useState<MqsDomainCode | null>(null)
  const [activeMediaDomainCode, setActiveMediaDomainCode] =
    useState<MqsDomainCode | null>(null)
  const [readyDomainSrc, setReadyDomainSrc] = useState<string | null>(null)
  const [failedDomainSources, setFailedDomainSources] = useState<ReadonlySet<string>>(
    () => new Set(),
  )
  const { mediaContainerRef, mediaAllowed, mediaSourceAllowed } = useMediaPlayback<HTMLDivElement>()
  const domainVideoRef = useRef<HTMLVideoElement | null>(null)
  const overallAnchorRef = useRef<DomainData[]>(interactiveSeed)
  const activeDomainMedia = DOMAIN_MEDIA[activeMediaDomainCode ?? 'POWER']
  // Keep the fallback poster, but load only the selected initial video.
  const domainVideoSrc =
    activeMediaDomainCode && mediaSourceAllowed && activeDomainMedia && !failedDomainSources.has(activeDomainMedia.src)
      ? activeDomainMedia.src
      : undefined
  const interactiveScore = calculateMqsScore(interactiveDomains)
  const roundedInteractiveScore = Math.round(interactiveScore)
  const radarPoints = useMemo(
    () =>
      interactiveDomains.map((domain, index) => {
        const normalized =
          (domain.score - MQS_SCORE_MIN) /
          (MQS_SCORE_MAX - MQS_SCORE_MIN)
        return radarPoint(
          index,
          interactiveDomains.length,
          RADAR_RADIUS * normalized,
        )
      }),
    [interactiveDomains],
  )
  const radarPolygon = radarPoints
    .map((point) => `${point.x},${point.y}`)
    .join(' ')
  const hasIllustrativeRetest =
    overallScore === undefined && activeScore === DEFAULT_OVERALL
  useEffect(() => {
    if (!mediaAllowed || activeMediaDomainCode) return

    const randomizeMedia = window.setTimeout(() => {
      setActiveMediaDomainCode((current) => current ?? randomDomainMediaCode())
    }, 0)

    return () => window.clearTimeout(randomizeMedia)
  }, [activeMediaDomainCode, mediaAllowed])

  useEffect(() => {
    const video = domainVideoRef.current

    if (!video) return

    if (!domainVideoSrc) {
      video.pause()
      video.load()
      return
    }
    if (!mediaAllowed) {
      video.pause()
      return
    }

    void video.play().catch(() => {
      // Muted playback is retried by the native media element once ready.
    })
    return () => {
      video.pause()
    }
  }, [domainVideoSrc, mediaAllowed])

  const scoreAriaLabel =
    locale === 'de'
      ? hasIllustrativeRetest
        ? `Beispielprofil, Movement Quality T Score ${activeScore}, Baseline ${DEFAULT_BASELINE}, Retest ${DEFAULT_OVERALL}, Veränderung plus ${DEFAULT_RETEST_DELTA}`
        : `Beispielprofil, Movement Quality T Score ${activeScore}`
      : hasIllustrativeRetest
        ? `Illustrative profile, Movement Quality T score ${activeScore}, baseline ${DEFAULT_BASELINE}, retest ${DEFAULT_OVERALL}, change plus ${DEFAULT_RETEST_DELTA}`
        : `Illustrative profile, Movement Quality T score ${activeScore}`

  if (variant === 'audience') {
    const setOverallScore = (score: number) => {
      setInteractiveDomains(
        shiftProfileToMqs(overallAnchorRef.current, score),
      )
    }

    const setInteractiveDomainScore = (
      code: MqsDomainCode,
      score: number,
    ) => {
      setInteractiveDomains((currentDomains) => {
        const nextDomains = setDomainScore(currentDomains, code, score)
        overallAnchorRef.current = nextDomains
        return nextDomains
      })
    }

    const interactiveScoreAriaLabel =
      locale === 'de'
        ? `Movement Quality Score ${roundedInteractiveScore}, sieben Domänen`
        : `Movement Quality Score ${roundedInteractiveScore}, seven domains`

    return (
      <div
        className="mqs-dashboard relative isolate overflow-hidden rounded-[6px] border border-white/[0.13] bg-[linear-gradient(145deg,#07090A_0%,#030506_100%)] p-5 shadow-[0_24px_70px_-48px_rgba(129,216,207,0.34)] md:p-6"
        data-audience={audience}
        data-testid="mqs-interactive-window"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--mqs-value-inv)]/80 to-transparent"
        />

        <div className="relative flex items-center justify-between border-b border-white/10 pb-3">
          <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-white/72 min-[390px]:text-[11px]">
            Movement Quality Score
          </p>
          <p className="text-center font-mono text-[10px] font-semibold uppercase tracking-[0.15em] text-[var(--mqs-value-inv)]/88 min-[390px]:text-[11px]">
            {locale === 'de' ? '7 Domänen' : '7 domains'}
          </p>
        </div>

        <div className="relative mx-auto mt-4 grid w-full grid-cols-3 items-center gap-[var(--mqs-core-gap)] px-[var(--mqs-core-gap)] [--mqs-core-gap:clamp(6px,2.2vw,14px)]">
          <div className="order-2 flex aspect-square min-w-0 items-center justify-center">
            <div
              ref={mediaContainerRef}
              className="relative aspect-square w-full overflow-hidden rounded-[4px] border border-white/[0.11] bg-[#030506]"
              aria-label={
                locale === 'de'
                  ? 'Bewegungsvideo der aktiven Domäne'
                  : 'Movement video for the active domain'
              }
              style={{
                backgroundImage: activeDomainMedia ? `linear-gradient(rgba(0,0,0,0.18),rgba(0,0,0,0.18)),url(${activeDomainMedia.src.replace('-web.mp4', '-poster.jpg')})` : undefined,
                backgroundSize: 'cover',
                backgroundPosition: activeDomainMedia?.objectPosition,
              }}
            >
              <div
                aria-hidden="true"
                className="absolute inset-0 opacity-45"
                style={{
                  backgroundImage:
                    'linear-gradient(rgba(129,216,207,0.055) 1px, transparent 1px), linear-gradient(90deg, rgba(129,216,207,0.055) 1px, transparent 1px), radial-gradient(circle at 52% 46%, rgba(129,216,207,0.13), transparent 48%)',
                  backgroundSize: '14px 14px, 14px 14px, 100% 100%',
                }}
              />
              {activeDomainMedia && !failedDomainSources.has(activeDomainMedia.src) && (
                <video
                  key={activeDomainMedia.src}
                  ref={domainVideoRef}
                  src={domainVideoSrc}
                  poster={activeDomainMedia.src.replace('-web.mp4', '-poster.jpg')}
                  muted
                  loop
                  playsInline
                  preload="none"
                  disablePictureInPicture
                  onLoadStart={() => setReadyDomainSrc(null)}
                  onEmptied={() => setReadyDomainSrc(null)}
                  onLoadedData={(event) => {
                    if (domainVideoSrc && event.currentTarget.getAttribute('src') === domainVideoSrc) {
                      setReadyDomainSrc(domainVideoSrc)
                    }
                  }}
                  onCanPlay={(event) => {
                    if (domainVideoSrc && event.currentTarget.getAttribute('src') === domainVideoSrc) {
                      setReadyDomainSrc(domainVideoSrc)
                      if (mediaAllowed) void event.currentTarget.play().catch(() => undefined)
                    }
                  }}
                  onError={(event) => {
                    if (domainVideoSrc && event.currentTarget.getAttribute('src') === domainVideoSrc) {
                      setFailedDomainSources((current) => new Set(current).add(domainVideoSrc))
                    }
                  }}
                  className={`absolute inset-0 h-full w-full object-cover brightness-[0.82] contrast-[1.08] saturate-[0.82] transition-opacity duration-200 motion-reduce:transition-none ${
                    domainVideoSrc && readyDomainSrc === domainVideoSrc
                      ? 'opacity-100'
                      : 'opacity-0'
                  }`}
                  style={{ objectPosition: activeDomainMedia.objectPosition }}
                  aria-hidden="true"
                />
              )}
              <div
                aria-hidden="true"
                className={`absolute inset-0 bg-[linear-gradient(180deg,transparent_45%,rgba(0,0,0,0.62)_100%)] transition-opacity duration-200 ${
                  activeDomainMedia ? 'opacity-100' : 'opacity-0'
                }`}
              />
              <div
                className={`absolute inset-x-1.5 bottom-1.5 flex items-center gap-1 font-sans text-[10px] font-semibold uppercase leading-[1.2] tracking-[0.04em] text-white/90 transition-opacity duration-200 ${
                  activeDomainMedia ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 shrink-0"
                  style={{
                    backgroundColor: activeMediaDomainCode
                      ? DOMAIN_COLORS[activeMediaDomainCode]
                      : 'var(--mqs-value-inv)',
                    clipPath:
                      'polygon(30% 0, 70% 0, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0 70%, 0 30%)',
                  }}
                />
                {DOMAIN_LABELS[locale][activeMediaDomainCode ?? 'POWER']}
              </div>
            </div>
          </div>

          <div className="order-1 flex aspect-square min-w-0 items-center justify-center">
            <div
              aria-label={interactiveScoreAriaLabel}
              role="status"
              className="relative h-full w-full"
            >
              <output
                htmlFor="mqs-overall"
                aria-live="polite"
                className="absolute left-1/2 top-1/2 block w-[2ch] -translate-x-1/2 -translate-y-1/2 text-center font-display text-[3.75rem] font-bold leading-[0.82] tracking-[0.01em] text-[var(--mqs-value-inv)] tabular-nums min-[390px]:text-[5rem] md:text-[6rem]"
              >
                {roundedInteractiveScore}
              </output>
              <p className="absolute left-1/2 top-[calc(50%+29px)] -translate-x-1/2 whitespace-nowrap text-center font-mono text-[9px] font-semibold uppercase tracking-[0.2em] text-white/68 min-[390px]:top-[calc(50%+37px)] min-[390px]:text-[11px] md:top-[calc(50%+43px)] md:text-xs">
                {labels.mqs}
              </p>
            </div>
          </div>

          <div className="order-3 flex aspect-square min-w-0 items-center justify-center">
            <div
              className="relative aspect-square w-full"
              aria-hidden="true"
            >
              <svg
                viewBox="0 0 160 140"
                className="absolute inset-[6%] h-[88%] w-[88%] overflow-visible"
              >
              <defs>
                <linearGradient
                  id="mqs-profile-fill"
                  x1="0"
                  y1="0"
                  x2="1"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#81D8CF" stopOpacity="0.24" />
                  <stop offset="100%" stopColor="#81D8CF" stopOpacity="0.035" />
                </linearGradient>
              </defs>
              <polygon
                points={radarRingPoints(interactiveDomains.length, 1)}
                fill="none"
                stroke="rgba(255,255,255,0.16)"
                strokeWidth="0.8"
                vectorEffect="non-scaling-stroke"
              />
              {interactiveDomains.map((domain, index) => {
                const end = radarPoint(
                  index,
                  interactiveDomains.length,
                  RADAR_RADIUS,
                )
                const domainCode = domain.code as MqsDomainCode
                const domainColor =
                  DOMAIN_COLORS[domainCode] || 'var(--mqs-value-inv)'
                const isActive = activeDomainCode === domainCode
                return (
                  <line
                    key={`axis-${domain.code}`}
                    x1={RADAR_CENTER_X}
                    y1={RADAR_CENTER_Y}
                    x2={end.x}
                    y2={end.y}
                    stroke={isActive ? domainColor : 'rgba(255,255,255,0.1)'}
                    strokeOpacity={isActive ? 0.64 : 1}
                    strokeWidth={isActive ? 1 : 0.55}
                    vectorEffect="non-scaling-stroke"
                  />
                )
              })}
              <motion.polygon
                animate={{ points: radarPolygon }}
                transition={{
                  duration: reduceMotion ? 0 : 0.28,
                  ease: [0.16, 1, 0.3, 1],
                }}
                fill="url(#mqs-profile-fill)"
                stroke="rgba(129,216,207,0.92)"
                strokeWidth="1.2"
                vectorEffect="non-scaling-stroke"
              />
              {interactiveDomains.map((domain, index) => {
                const point = radarPoints[index]
                const domainCode = domain.code as MqsDomainCode
                const domainColor =
                  DOMAIN_COLORS[domainCode] || 'var(--mqs-value-inv)'
                const isActive = activeDomainCode === domainCode
                return (
                  <motion.circle
                    key={`point-${domain.code}`}
                    animate={{
                      cx: point.x,
                      cy: point.y,
                      r: isActive ? 3.1 : 2.15,
                    }}
                    transition={{
                      duration: reduceMotion ? 0 : 0.28,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    fill={domainColor}
                    stroke="#050607"
                    strokeWidth="0.8"
                  />
                )
              })}
              <circle
                cx={RADAR_CENTER_X}
                cy={RADAR_CENTER_Y}
                r="2"
                fill="#81D8CF"
                opacity="0.82"
              />
              </svg>
              {interactiveDomains.map((domain, index) => {
                const domainCode = domain.code as MqsDomainCode
                const angle = -Math.PI / 2 + (index * Math.PI * 2) / interactiveDomains.length
                const isActive = activeDomainCode === domainCode

                return (
                  <span
                    key={`label-${domain.code}`}
                    className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 font-mono text-[9px] font-semibold leading-none min-[390px]:text-[10px]"
                    style={{
                      left: `clamp(10px, ${50 + Math.cos(angle) * 40}%, calc(100% - 10px))`,
                      top: `${50 + Math.sin(angle) * 40}%`,
                      color: isActive
                        ? DOMAIN_COLORS[domainCode] || 'var(--mqs-value-inv)'
                        : 'rgba(255,255,255,0.72)',
                    }}
                  >
                    {DOMAIN_INITIALS[domainCode]}
                  </span>
                )
              })}
            </div>
          </div>
        </div>

        <div className="relative mt-5 border-y border-white/10 py-3">
          <div className="flex items-center justify-between px-0.5 text-xs text-white/70">
            <span>{String(MQS_SCORE_MIN).padStart(2, '0')}</span>
            <label htmlFor="mqs-overall" className="font-sans font-medium tracking-[0.02em] text-white/80">
              {locale === 'de' ? 'MQS anpassen' : 'Adjust MQS'}
            </label>
            <span>{MQS_SCORE_MAX}</span>
          </div>
          <input
            id="mqs-overall"
            type="range"
            min={MQS_SCORE_MIN}
            max={MQS_SCORE_MAX}
            step="1"
            value={roundedInteractiveScore}
            onPointerDown={() => {
              overallAnchorRef.current = interactiveDomains
              setActiveDomainCode(null)
            }}
            onPointerUp={() => {
              overallAnchorRef.current = interactiveDomains
            }}
            onFocus={() => {
              overallAnchorRef.current = interactiveDomains
              setActiveDomainCode(null)
            }}
            onBlur={() => {
              overallAnchorRef.current = interactiveDomains
            }}
            onChange={(event) => setOverallScore(Number(event.target.value))}
            className="mqs-range"
            style={rangeStyle(
              roundedInteractiveScore,
              'var(--mqs-value-inv)',
            )}
            aria-label={
              locale === 'de'
                ? 'Movement Quality Score anpassen'
                : 'Adjust the Movement Quality Score'
            }
            aria-valuetext={`${roundedInteractiveScore} MQS`}
            data-testid="mqs-overall-slider"
          />
        </div>

        <div
          className="mqs-domain-controls relative mt-4 grid grid-cols-1 gap-x-6"
          role="group"
          aria-label={
            locale === 'de'
              ? 'Sieben MQS Domänen anpassen'
              : 'Adjust the seven MQS domains'
          }
        >
          {interactiveDomains.map((domain) => {
            const domainCode = domain.code as MqsDomainCode
            const domainLabel =
              DOMAIN_LABELS[locale][domainCode] ||
              domain.label ||
              domain.code
            const domainColor =
              DOMAIN_COLORS[domainCode] || 'var(--mqs-value-inv)'
            const sliderId = `mqs-domain-${domain.code.toLowerCase()}`

            return (
              <label
                key={domain.code}
                htmlFor={sliderId}
                className={`grid min-h-11 min-w-0 grid-cols-[minmax(80px,0.8fr)_minmax(72px,1fr)_auto] items-center gap-2 border-b border-white/[0.065] px-1 transition-colors focus-within:bg-white/[0.035] ${
                  activeDomainCode === domainCode ? 'bg-white/[0.035]' : ''
                }`}
                onPointerEnter={() => setActiveDomainCode(domainCode)}
                onPointerLeave={() => setActiveDomainCode(null)}
              >
                <span className="flex min-w-0 items-center gap-2">
                  <span
                    aria-hidden="true"
                    className="h-1.5 w-1.5 shrink-0"
                    style={{
                      backgroundColor: domainColor,
                      clipPath:
                        'polygon(30% 0, 70% 0, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0 70%, 0 30%)',
                    }}
                  />
                  <span
                    className={`break-normal font-sans text-[11px] font-semibold uppercase leading-[1.2] tracking-[0.035em] transition-colors min-[390px]:text-xs ${
                      activeDomainCode === domainCode
                        ? 'text-white/92'
                        : 'text-white/78'
                    }`}
                  >
                    {domainLabel}
                  </span>
                </span>
                <input
                  id={sliderId}
                  type="range"
                  min={MQS_SCORE_MIN}
                  max={MQS_SCORE_MAX}
                  step="1"
                  value={domain.score}
                  onPointerDown={() => {
                    setActiveDomainCode(domainCode)
                    setActiveMediaDomainCode(domainCode)
                  }}
                  onFocus={() => setActiveDomainCode(domainCode)}
                  onBlur={() => setActiveDomainCode(null)}
                  onChange={(event) => {
                    setActiveMediaDomainCode(domainCode)
                    setInteractiveDomainScore(
                      domainCode,
                      Number(event.target.value),
                    )
                  }}
                  className="mqs-range"
                  style={rangeStyle(domain.score, domainColor)}
                  aria-label={
                    locale === 'de'
                      ? `${domainLabel} Domänenwert anpassen`
                      : `Adjust ${domainLabel} domain score`
                  }
                  aria-valuetext={`${domain.score}`}
                  data-testid={`mqs-domain-slider-${domain.code.toLowerCase()}`}
                />
                <output
                  htmlFor={sliderId}
                  className="text-right font-mono text-xs font-medium text-white/88 tabular-nums"
                >
                  {domain.score}
                </output>
              </label>
            )
          })}
        </div>
      </div>
    )
  }

  const ringSize = isCompact ? 140 : 200
  const radius = 85
  const circumference = 2 * Math.PI * radius
  const targetOffset = circumference * (1 - activeScore / 100)

  const scoreFontClass = isCompact
    ? 'text-4xl md:text-5xl'
    : 'text-6xl md:text-7xl'
  const barHeightClass = isCompact ? 'h-[2.5px]' : 'h-1'
  const panelPadding = isCompact ? 'p-5 md:p-6' : 'p-8 md:p-10'
  const barGap = isCompact ? 'gap-2.5' : 'gap-4'

  return (
    <div
      className={`relative overflow-hidden rounded-[12px] border border-border/20 bg-card/60 backdrop-blur-sm ${panelPadding}`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background: 'transparent',
        }}
      />

      {/* Header */}
      <div className="relative mb-6 flex items-baseline justify-between border-b border-border/10 pb-4">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--mqs-value-inv)]">
          Movement Quality Score
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
          {labels.sampleValues}
        </span>
      </div>

      {/* Ring + badge */}
      <div className="relative flex flex-col items-center gap-4">
        <div
          className="relative flex-shrink-0"
          style={{ width: ringSize, height: ringSize }}
        >
          <svg
            viewBox="0 0 180 180"
            className="h-full w-full -rotate-90"
            aria-label={scoreAriaLabel}
            role="img"
          >
            <circle
              cx="90"
              cy="90"
              r={radius}
              fill="none"
              stroke="rgba(244, 246, 248, 0.08)"
              strokeWidth="2"
            />
            <motion.circle
              cx="90"
              cy="90"
              r={radius}
              fill="none"
              stroke="var(--mqs-accent)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              whileInView={{ strokeDashoffset: targetOffset }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: reduceMotion ? 0 : 1.4, ease: [0.16, 1, 0.3, 1], delay: reduceMotion ? 0 : 0.2 }}
            />
          </svg>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-1">
            <span className={`font-mono font-medium leading-none tracking-tight text-[var(--mqs-value-inv)] tabular-nums ${scoreFontClass}`}>
              {activeScore}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground/60">
              {labels.scoreContext}
            </span>
          </div>
        </div>

        {hasIllustrativeRetest ? (
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={reduceMotion ? { duration: 0 } : { ...SPRING_SLOW, delay: 0.6 }}
            className="inline-flex items-center gap-1.5 rounded-full border border-[var(--mqs-accent)]/25 bg-[var(--mqs-accent)]/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--mqs-value-inv)]"
          >
            <span aria-hidden="true">↑</span> {labels.retestChange}
          </motion.span>
        ) : null}
      </div>

      {/* Domain bars */}
      <div className={`relative mt-8 flex flex-col ${barGap}`}>
        {activeDomains.map((domain, i) => {
          const color = DOMAIN_COLORS[domain.code] || 'var(--mqs-accent)'
          return (
            <div
              key={domain.code}
              className="grid items-center gap-4"
              style={{ gridTemplateColumns: '58px 1fr 32px' }}
            >
              <span
                className="font-mono text-[10px] uppercase tracking-[0.14em]"
                style={{ color }}
              >
                {domain.label || domain.code}
              </span>
              <div
                className={`relative overflow-hidden rounded-full bg-border/20 ${barHeightClass}`}
              >
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${barWidth(domain.score)}%` }}
                  viewport={{ once: true, margin: '-10%' }}
                  transition={{
                    duration: reduceMotion ? 0 : 0.4,
                    ease: [0.16, 1, 0.3, 1],
                    delay: reduceMotion ? 0 : 0.06 + i * 0.025,
                  }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: color }}
                />
              </div>
              <span className="text-right font-mono text-[11px] text-foreground tabular-nums">
                {domain.score}
              </span>
            </div>
          )
        })}
      </div>

      {/* Footer strip */}
      <div className="relative mt-7 flex justify-between border-t border-border/10 pt-4 font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground/60">
        <span>{labels.reference}</span>
        <span>{labels.profileId}</span>
      </div>
    </div>
  )
}

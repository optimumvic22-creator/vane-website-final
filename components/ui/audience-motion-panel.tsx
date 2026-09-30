'use client'

import Image from 'next/image'
import { Pause, Play, RotateCcw } from 'lucide-react'
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'

export type MqsDomainId =
  | 'gait'
  | 'postural_control'
  | 'force_capacity'
  | 'power'
  | 'motor_control'
  | 'neuro_response'
  | 'dual_task_cost'

const MQS_DOMAIN_META: Record<
  MqsDomainId,
  { code: string; en: string; de: string }
> = {
  gait: { code: 'GAIT', en: 'Gait', de: 'Gang' },
  postural_control: {
    code: 'POST',
    en: 'Postural control',
    de: 'Haltungskontrolle',
  },
  force_capacity: {
    code: 'FORCE',
    en: 'Force capacity',
    de: 'Kraftkapazität',
  },
  power: { code: 'POWER', en: 'Power', de: 'Power' },
  motor_control: {
    code: 'MOTOR',
    en: 'Motor control',
    de: 'Bewegungskontrolle',
  },
  neuro_response: {
    code: 'NEURO',
    en: 'Neuro response',
    de: 'Neuroreaktion',
  },
  dual_task_cost: {
    code: 'DTC',
    en: 'Dual task cost',
    de: 'Dual Task Cost',
  },
}

export type AudienceMotionClip = {
  src: string
  poster: string
  objectPosition?: string
  playbackRate?: number
  startOffset?: number
  domainFocus: readonly [MqsDomainId, ...MqsDomainId[]]
}

export type AudienceMotionMode =
  | 'athlete-sequence'
  | 'coach-sequence'
  | 'partner-compare'

type MotionControlLabels = {
  play: string
  pause: string
  replay: string
}

type AudienceMotionPanelProps = {
  clips: readonly AudienceMotionClip[]
  mode: AudienceMotionMode
  caption: string
  labels: MotionControlLabels
  locale: 'en' | 'de'
  className?: string
}

type SaveDataConnection = EventTarget & {
  saveData?: boolean
}

export function AudienceMotionPanel({
  clips,
  mode,
  caption,
  labels,
  locale,
  className,
}: AudienceMotionPanelProps) {
  const panelRef = useRef<HTMLElement>(null)
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([])
  const startedIndexesRef = useRef(new Set<number>())
  const endedIndexesRef = useRef(new Set<number>())
  const syncFrameRef = useRef<number | null>(null)
  const lastSyncCheckRef = useRef(0)
  const runIdRef = useRef(0)
  const panelId = `audience-motion-${mode}`
  const reduceMotion = useReducedMotion()
  const isComparison = mode === 'partner-compare'

  const [shouldLoad, setShouldLoad] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const [isDocumentVisible, setIsDocumentVisible] = useState(true)
  const [saveData, setSaveData] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [readyIndexes, setReadyIndexes] = useState<Set<number>>(
    () => new Set(),
  )
  const [hasStarted, setHasStarted] = useState(false)
  const [userPaused, setUserPaused] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [playbackBlocked, setPlaybackBlocked] = useState(false)
  const [mediaError, setMediaError] = useState(false)
  const [playRequest, setPlayRequest] = useState(0)

  const cancelSyncMonitor = useCallback(() => {
    if (syncFrameRef.current !== null) {
      window.cancelAnimationFrame(syncFrameRef.current)
      syncFrameRef.current = null
    }
  }, [])

  const pauseAll = useCallback(() => {
    cancelSyncMonitor()
    videoRefs.current.forEach((video) => video?.pause())
  }, [cancelSyncMonitor])

  const startSyncMonitor = useCallback(() => {
    cancelSyncMonitor()

    const checkSync = (time: number) => {
      if (time - lastSyncCheckRef.current >= 240) {
        const playingVideos = videoRefs.current
          .map((video, index) => ({ video, index }))
          .filter(
            (
              item,
            ): item is { video: HTMLVideoElement; index: number } =>
              item.video !== null && !endedIndexesRef.current.has(item.index),
          )

        if (playingVideos.length > 1) {
          const master = playingVideos[0].video

          playingVideos.slice(1).forEach(({ video }) => {
            const drift = video.currentTime - master.currentTime

            if (Math.abs(drift) > 0.08 && video.readyState >= 3) {
              const latestFrame = Math.max(0, video.duration - 0.06)
              video.currentTime = Math.min(master.currentTime, latestFrame)
            }
          })
        }

        lastSyncCheckRef.current = time
      }

      syncFrameRef.current = window.requestAnimationFrame(checkSync)
    }

    syncFrameRef.current = window.requestAnimationFrame(checkSync)
  }, [cancelSyncMonitor])

  useEffect(() => {
    const panel = panelRef.current

    if (!panel) return

    if (typeof IntersectionObserver === 'undefined') {
      const timeout = globalThis.setTimeout(() => {
        setShouldLoad(true)
        setIsInView(true)
      }, 0)

      return () => globalThis.clearTimeout(timeout)
    }

    const preloadObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true)
          preloadObserver.disconnect()
        }
      },
      { rootMargin: '400px 0px', threshold: 0.01 },
    )

    const playbackObserver = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting && entry.intersectionRatio >= 0.4)
      },
      { threshold: [0, 0.4] },
    )

    preloadObserver.observe(panel)
    playbackObserver.observe(panel)

    return () => {
      preloadObserver.disconnect()
      playbackObserver.disconnect()
    }
  }, [])

  useEffect(() => {
    const handleVisibility = () => {
      setIsDocumentVisible(document.visibilityState === 'visible')
    }

    handleVisibility()
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [])

  useEffect(() => {
    const connection = (
      navigator as Navigator & { connection?: SaveDataConnection }
    ).connection
    const handleConnectionChange = () => {
      setSaveData(Boolean(connection?.saveData))
    }

    handleConnectionChange()
    connection?.addEventListener('change', handleConnectionChange)

    return () => {
      connection?.removeEventListener('change', handleConnectionChange)
    }
  }, [])

  const motionDisabled = reduceMotion === true || saveData
  const canLoadVideo = shouldLoad && !motionDisabled && !mediaError

  useEffect(() => {
    if (!canLoadVideo) return
    videoRefs.current.forEach((video) => video?.load())
  }, [canLoadVideo])

  useEffect(() => {
    const shouldPlay =
      canLoadVideo &&
      isInView &&
      isDocumentVisible &&
      !userPaused &&
      !completed

    if (!shouldPlay) {
      pauseAll()
      return
    }

    const runId = runIdRef.current
    const videos = videoRefs.current.filter(
      (video): video is HTMLVideoElement => video !== null,
    )
    const targets = isComparison
      ? videos
      : [videoRefs.current[activeIndex]].filter(
          (video): video is HTMLVideoElement => video !== null,
        )

    if (targets.length === 0) return

    targets.forEach((video) => {
      const index = videoRefs.current.indexOf(video)
      const clip = clips[index]

      video.playbackRate = clip?.playbackRate ?? 1

      if (!startedIndexesRef.current.has(index) && video.readyState >= 1) {
        const startOffset = clip?.startOffset ?? 0
        const latestStart = Math.max(0, video.duration - 0.15)
        video.currentTime = Math.min(startOffset, latestStart)
        startedIndexesRef.current.add(index)
      }
    })

    let cancelled = false

    void Promise.allSettled(targets.map((video) => video.play())).then(
      (results) => {
        if (cancelled || runId !== runIdRef.current) return

        const allStarted = results.every(
          (result) => result.status === 'fulfilled',
        )

        if (!allStarted) {
          pauseAll()
          setPlaybackBlocked(true)
          return
        }

        setPlaybackBlocked(false)
        setHasStarted(true)

        if (isComparison) startSyncMonitor()
      },
    )

    return () => {
      cancelled = true
      pauseAll()
    }
  }, [
    activeIndex,
    canLoadVideo,
    clips,
    completed,
    isComparison,
    isDocumentVisible,
    isInView,
    pauseAll,
    playRequest,
    startSyncMonitor,
    userPaused,
  ])

  useEffect(() => {
    return () => {
      runIdRef.current += 1
      pauseAll()
    }
  }, [pauseAll])

  const markReady = (index: number) => {
    setReadyIndexes((current) => {
      if (current.has(index)) return current
      const next = new Set(current)
      next.add(index)
      return next
    })
  }

  const holdOnLastFrame = (video: HTMLVideoElement) => {
    if (Number.isFinite(video.duration) && video.duration > 0.06) {
      video.currentTime = video.duration - 0.06
    }
    video.pause()
  }

  const handleEnded = (index: number) => {
    const video = videoRefs.current[index]
    if (!video) return

    holdOnLastFrame(video)

    if (isComparison) {
      endedIndexesRef.current.add(index)

      if (endedIndexesRef.current.size === clips.length) {
        cancelSyncMonitor()
        setCompleted(true)
      }

      return
    }

    if (index !== activeIndex) return

    if (index < clips.length - 1) {
      setActiveIndex(index + 1)
      return
    }

    setCompleted(true)
  }

  const resetPlayback = () => {
    runIdRef.current += 1
    pauseAll()
    startedIndexesRef.current.clear()
    endedIndexesRef.current.clear()
    setActiveIndex(0)
    setCompleted(false)
    setPlaybackBlocked(false)
    setUserPaused(false)
    setHasStarted(false)

    videoRefs.current.forEach((video, index) => {
      if (!video || video.readyState < 1) return
      const latestStart = Math.max(0, video.duration - 0.15)
      video.currentTime = Math.min(clips[index]?.startOffset ?? 0, latestStart)
    })

    setPlayRequest((request) => request + 1)
  }

  const handleControl = () => {
    if (completed) {
      resetPlayback()
      return
    }

    if (userPaused || playbackBlocked || !hasStarted) {
      setPlaybackBlocked(false)
      setUserPaused(false)
      setPlayRequest((request) => request + 1)
      return
    }

    setUserPaused(true)
  }

  const controlState = completed
    ? 'replay'
    : userPaused || playbackBlocked || !hasStarted
      ? 'play'
      : 'pause'
  const ControlIcon =
    controlState === 'replay'
      ? RotateCcw
      : controlState === 'pause'
        ? Pause
        : Play
  const controlLabel = labels[controlState]
  const domainFocusLabel =
    locale === 'de' ? 'MQS Domänenfokus' : 'MQS domain focus'
  const compactDomainFocusLabel =
    locale === 'de' ? 'Domänenfokus' : 'Domain focus'
  const protocolNote =
    locale === 'de'
      ? 'Illustrativer Domänenfokus. Der MQS erfordert das standardisierte Assessmentprotokoll.'
      : 'Illustrative domain focus. MQS requires the standardized assessment protocol.'
  const activeDomainIds = (
    isComparison
      ? clips.flatMap((clip) => clip.domainFocus ?? [])
      : clips[activeIndex]?.domainFocus ?? []
  ).filter((domain, index, domains) => domains.indexOf(domain) === index)
  const activeDomainCodes = activeDomainIds.map(
    (domain) => MQS_DOMAIN_META[domain].code,
  )
  const domainSummary = clips
    .map((clip, index) => {
      const clipLabel = isComparison
        ? `${locale === 'de' ? 'Ansicht' : 'View'} ${index === 0 ? 'A' : 'B'}`
        : `${locale === 'de' ? 'Sequenz' : 'Sequence'} ${index + 1}`
      const names = (clip.domainFocus ?? []).map(
        (domain) => MQS_DOMAIN_META[domain][locale],
      )

      return `${clipLabel}: ${domainFocusLabel}, ${names.join(', ')}.`
    })
    .join(' ')

  return (
    <figure
      ref={panelRef}
      className={cn(
        'min-w-0 overflow-hidden rounded-[12px] border border-white/10 bg-[#050607]',
        !isComparison && 'mx-auto w-full max-w-[360px]',
        className,
      )}
    >
      <div className="flex min-h-10 items-center justify-between gap-3 border-b border-white/10 px-3 py-2 sm:px-4">
        <span className="shrink-0 font-mono text-[9px] font-medium uppercase tracking-[0.15em] text-white/70">
          Movement sample
        </span>
        <p className="min-w-0 text-right font-mono text-[9px] uppercase tracking-[0.1em] text-white/45">
          <span className="hidden min-[360px]:inline">
            {compactDomainFocusLabel}{' '}
          </span>
          <span className="whitespace-nowrap font-medium text-white/80">
            {activeDomainCodes.join(' · ')}
          </span>
        </p>
      </div>

      <div
        id={panelId}
        className={cn(
          isComparison
            ? 'grid grid-cols-2 gap-px bg-white/10'
            : 'relative aspect-[9/16] overflow-hidden bg-[#050607]',
        )}
      >
        {clips.map((clip, index) => {
          const isActive = isComparison || index === activeIndex
          const isReady = readyIndexes.has(index)

          return (
            <div
              key={clip.src}
              aria-hidden={!isActive}
              className={cn(
                'relative overflow-hidden bg-[#050607]',
                isComparison
                  ? 'aspect-[9/16]'
                  : 'absolute inset-0',
                !isComparison &&
                  'transition-opacity duration-150 motion-reduce:transition-none',
                !isComparison && (isActive ? 'opacity-100' : 'opacity-0'),
              )}
            >
              <Image
                src={clip.poster}
                alt=""
                fill
                sizes={
                  isComparison
                    ? '(min-width: 1024px) 24vw, 46vw'
                    : '(min-width: 1024px) 360px, 92vw'
                }
                aria-hidden="true"
                className={cn(
                  'object-cover',
                  clip.objectPosition ?? 'object-center',
                )}
              />
              <video
                ref={(element) => {
                  videoRefs.current[index] = element
                }}
                src={canLoadVideo ? clip.src : undefined}
                muted
                playsInline
                preload={canLoadVideo ? 'metadata' : 'none'}
                tabIndex={-1}
                disablePictureInPicture
                aria-hidden="true"
                onLoadedMetadata={() => {
                  const video = videoRefs.current[index]
                  if (!video) return
                  video.playbackRate = clip.playbackRate ?? 1
                }}
                onCanPlay={() => markReady(index)}
                onEnded={() => handleEnded(index)}
                onError={() => {
                  setMediaError(true)
                  pauseAll()
                }}
                className={cn(
                  'absolute inset-0 h-full w-full object-cover transition-opacity duration-150 motion-reduce:transition-none',
                  clip.objectPosition ?? 'object-center',
                  isReady && !motionDisabled ? 'opacity-100' : 'opacity-0',
                )}
              />
            </div>
          )
        })}
      </div>

      <figcaption className="border-t border-white/10">
        <span className="sr-only">{domainSummary}</span>
        <div className="flex min-h-[52px] items-center justify-between gap-3 px-3 py-2 sm:px-4">
          <p className="min-w-0 max-w-xl font-sans text-[13px] font-normal leading-[1.5] text-white/70">
            {caption}
          </p>
          {!motionDisabled && !mediaError ? (
            <button
              type="button"
              aria-controls={panelId}
              aria-label={controlLabel}
              onClick={handleControl}
              className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center gap-2 rounded-[6px] px-3 font-mono text-[10px] uppercase tracking-[0.1em] text-white/65 outline-none transition-colors hover:bg-white/[0.04] hover:text-white focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-inset"
            >
              <ControlIcon className="h-4 w-4" aria-hidden="true" />
              <span className="hidden min-[360px]:inline">{controlLabel}</span>
            </button>
          ) : null}
        </div>
        <p className="border-t border-white/[0.07] px-3 py-2 font-mono text-[9px] leading-[1.45] tracking-[0.04em] text-white/45 sm:px-4">
          {protocolNote}
        </p>
      </figcaption>
    </figure>
  )
}

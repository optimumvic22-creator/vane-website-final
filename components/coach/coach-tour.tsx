'use client'
import Image from 'next/image'
import { AnimatePresence, motion, useInView } from 'framer-motion'
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Pause,
  Play,
} from 'lucide-react'
import { Dialog } from 'radix-ui'
import {
  useEffect,
  useReducer,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react'
import { coachTour, readyTourSteps } from '@/lib/coach-tour'
import {
  initialTourState,
  tourReducer,
  tourKeyIndex,
  TOUR_INTERVAL,
} from '@/lib/coach-tour-state'
import { TRANSITION_MQS } from '@/lib/motion'
import type { Locale } from '@/lib/locale'
import { AppWindow } from './app-window'
import { PhoneFrame } from './phone-frame'
import { ScreenshotDialogContent } from './screenshot-dialog'
import {
  CoachSection,
  SectionHeading,
  gridBackground,
  useCoachReducedMotion,
  type CoachProps,
} from './coach-primitives'

const steps = readyTourSteps(coachTour)
const query = '(min-width: 1024px)'
const subscribeDesktop = (notify: () => void) => {
  const media = window.matchMedia(query)
  media.addEventListener('change', notify)
  return () => media.removeEventListener('change', notify)
}
export function CoachTour({ copy, locale }: CoachProps & { locale: Locale }) {
  const [state, dispatch] = useReducer(tourReducer, initialTourState)
  const [expanded, setExpanded] = useState(false)
  const [hovered, setHovered] = useState(false),
    [focused, setFocused] = useState(false),
    [paused, setPaused] = useState(false),
    [hidden, setHidden] = useState(false)
  const touchStart = useRef<number | null>(null)
  const swiped = useRef(false)
  const root = useRef<HTMLDivElement>(null),
    tabs = useRef<(HTMLButtonElement | null)[]>([])
  const inView = useInView(root, { amount: 0.5 })
  const reduced = useCoachReducedMotion()
  const desktop = useSyncExternalStore(
    subscribeDesktop,
    () => window.matchMedia(query).matches,
    () => false,
  )
  const running =
    inView &&
    !reduced &&
    !paused &&
    !hovered &&
    !focused &&
    !hidden &&
    !expanded &&
    !state.manual &&
    state.cycles < 2
  const step = steps[state.index]
  useEffect(() => {
    const changed = () => setHidden(document.hidden)
    document.addEventListener('visibilitychange', changed)
    changed()
    return () => document.removeEventListener('visibilitychange', changed)
  }, [])
  useEffect(() => {
    if (!running) return
    const timer = window.setTimeout(
      () => dispatch({ type: 'tick', count: steps.length }),
      TOUR_INTERVAL,
    )
    return () => window.clearTimeout(timer)
  }, [running, state.index, state.cycles])
  const choose = (index: number) =>
    dispatch({ type: 'manual', index, count: steps.length })
  if (!step) return null
  const expandLabel =
    locale === 'de' ? 'Screenshot vergrößern' : 'Enlarge screenshot'
  const image = (
    <Image
      draggable={false}
      src={step.image.src}
      width={step.image.width}
      height={step.image.height}
      alt={step.alt[locale]}
      sizes="(min-width: 1024px) 58vw, 100vw"
      className="h-full w-full object-contain"
      onLoad={() => {
        const next = steps[(state.index + 1) % steps.length]
        if (next) {
          const preload = new window.Image()
          preload.src = next.image.src
        }
      }}
    />
  )
  const tabsMarkup = (
    <div
      role="tablist"
      aria-label={copy.ui.tourLabel}
      aria-orientation={desktop ? 'vertical' : 'horizontal'}
      className={
        desktop ? 'space-y-1' : 'flex items-center justify-center gap-1'
      }
      onKeyDown={(event) => {
        const next = tourKeyIndex(event.key, state.index, steps.length)
        if (next === null) return
        event.preventDefault()
        choose(next)
        tabs.current[next]?.focus()
      }}
    >
      {steps.map((item, i) => (
        <button
          key={item.id}
          ref={(el) => {
            tabs.current[i] = el
          }}
          role="tab"
          id={`tour-tab-${item.id}`}
          aria-selected={i === state.index}
          aria-controls={`tour-panel-${step.id}`}
          tabIndex={i === state.index ? 0 : -1}
          onClick={() => choose(i)}
          className={
            desktop
              ? 'relative block w-full overflow-hidden border-l-2 border-white/10 px-5 py-3 text-left outline-none focus-visible:ring-2 focus-visible:ring-ring'
              : 'flex min-h-10 min-w-10 items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring'
          }
          aria-label={`${String(i + 1).padStart(2, '0')} ${item.title[locale]}`}
        >
          {desktop ? (
            <>
              <span
                className={`mr-3 font-mono text-xs ${i === state.index ? 'text-[var(--mqs-value-inv)]' : 'text-white/40'}`}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <span
                className={`text-lg font-semibold ${i === state.index ? 'text-white' : 'text-white/55 hover:text-white/80'}`}
              >
                {item.title[locale]}
              </span>
              <AnimatePresence initial={false}>
                {i === state.index && (
                  <motion.span
                    className="mt-3 block max-w-[48ch] overflow-hidden text-sm leading-relaxed text-muted-foreground"
                    initial={reduced ? false : { height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={reduced ? {} : { height: 0, opacity: 0 }}
                    transition={reduced ? { duration: 0 } : TRANSITION_MQS}
                  >
                    {item.text[locale]}
                  </motion.span>
                )}
              </AnimatePresence>
              {i === state.index && (
                <span
                  aria-hidden
                  className="absolute inset-y-0 left-0 w-0.5 bg-white/20"
                >
                  <span
                    key={`${state.index}-${state.cycles}`}
                    className="coach-tour-progress absolute inset-0 origin-top bg-[var(--mqs-value-inv)]"
                    style={{
                      animationName:
                        !state.manual && state.cycles < 2 && !reduced
                          ? 'coach-tour-progress'
                          : 'none',
                      animationDuration: `${TOUR_INTERVAL}ms`,
                      animationTimingFunction: 'linear',
                      animationFillMode: 'forwards',
                      animationPlayState: running ? 'running' : 'paused',
                    }}
                  />
                </span>
              )}
            </>
          ) : (
            <span
              aria-hidden
              className={`h-1.5 rounded-full transition-[width] ${i === state.index ? 'w-5 bg-[var(--mqs-value-inv)]' : 'w-1.5 bg-white/30'}`}
            />
          )}
        </button>
      ))}
    </div>
  )
  return (
    <Dialog.Root open={expanded} onOpenChange={setExpanded}>
      <CoachSection id="tour" band>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={gridBackground}
        />
        <div
          className="relative"
          ref={root}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onFocusCapture={() => setFocused(true)}
          onBlurCapture={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget)) setFocused(false)
          }}
        >
          <SectionHeading
            id="tour"
            centered
            section={{
              eyebrow: copy.ui.tourEyebrow,
              title: copy.ui.tourTitle,
              intro: copy.ui.tourIntro,
              body: [],
              cards: [],
            }}
          />
          <div className="mt-12 grid items-center gap-8 lg:grid-cols-12 lg:gap-10">
            {desktop && <div className="lg:col-span-5">{tabsMarkup}</div>}
            <div className="min-w-0 lg:col-span-7">
              <div
                role="tabpanel"
                id={`tour-panel-${step.id}`}
                aria-labelledby={`tour-tab-${step.id}`}
                className="outline-none"
                tabIndex={0}
              >
                <div
                  className="relative aspect-[16/10] touch-pan-y"
                  onTouchStart={(e) => {
                    swiped.current = false
                    if (reduced) touchStart.current = e.touches[0].clientX
                  }}
                  onTouchEnd={(e) => {
                    if (reduced && touchStart.current !== null) {
                      const delta =
                        e.changedTouches[0].clientX - touchStart.current
                      if (Math.abs(delta) > 60) {
                        swiped.current = true
                        choose(state.index + (delta < 0 ? 1 : -1))
                      }
                      touchStart.current = null
                    }
                  }}
                >
                  <AnimatePresence
                    initial={false}
                    mode="popLayout"
                    custom={state.direction}
                  >
                    <motion.div
                      key={step.id}
                      custom={state.direction}
                      variants={{
                        enter: (d: number) => ({
                          x: d * 24,
                          opacity: 0,
                          scale: 0.985,
                        }),
                        visible: { x: 0, opacity: 1, scale: 1 },
                        exit: (d: number) => ({ x: d * -24, opacity: 0 }),
                      }}
                      initial={reduced ? false : 'enter'}
                      animate="visible"
                      exit={reduced ? undefined : 'exit'}
                      transition={reduced ? { duration: 0 } : TRANSITION_MQS}
                      drag={desktop || reduced ? false : 'x'}
                      dragConstraints={{ left: 0, right: 0 }}
                      dragElastic={0.12}
                      onDragStart={() => {
                        swiped.current = true
                      }}
                      onDragEnd={(_, info) => {
                        if (
                          Math.abs(info.offset.x) > 60 ||
                          Math.abs(info.velocity.x) > 400
                        )
                          choose(
                            state.index +
                              (info.offset.x < 0 || info.velocity.x < -400
                                ? 1
                                : -1),
                          )
                      }}
                      className="absolute inset-0"
                    >
                      <Dialog.Trigger asChild>
                        <button
                          type="button"
                          aria-label={`${expandLabel}: ${step.title[locale]}`}
                          onPointerDownCapture={() => {
                            swiped.current = false
                          }}
                          onClick={(event) => {
                            if (swiped.current && event.detail > 0)
                              event.preventDefault()
                          }}
                          className="group relative block h-full w-full cursor-zoom-in rounded-[14px] text-left outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          {step.frame === 'phone' ? (
                            <div className="mx-auto h-full w-[27.7%]">
                              <PhoneFrame>{image}</PhoneFrame>
                            </div>
                          ) : (
                            <AppWindow>{image}</AppWindow>
                          )}
                          <span
                            aria-hidden="true"
                            className="pointer-events-none absolute bottom-3 right-3 flex size-10 items-center justify-center rounded-full border border-white/15 bg-black/70 text-white transition-colors group-hover:bg-black/90"
                          >
                            <Maximize2 size={18} />
                          </span>
                        </button>
                      </Dialog.Trigger>
                      {step.hotspot && (
                        <motion.div
                          aria-hidden
                          className="pointer-events-none absolute rounded-lg border-[1.5px] border-[var(--mqs-value-inv)] shadow-[0_0_20px_rgba(129,216,207,.16)]"
                          style={{
                            left: `${step.hotspot.x}%`,
                            top: `${step.hotspot.y}%`,
                            width: `${step.hotspot.w}%`,
                            height: `${step.hotspot.h}%`,
                          }}
                          initial={reduced ? false : { opacity: 0 }}
                          animate={{
                            opacity: reduced || paused ? 1 : [0.55, 1, 0.55],
                          }}
                          transition={
                            reduced || paused
                              ? { duration: 0 }
                              : { delay: 0.8, duration: 2.4, repeat: Infinity }
                          }
                        />
                      )}
                    </motion.div>
                  </AnimatePresence>
                  {!reduced && !state.manual && state.cycles < 2 && (
                    <button
                      type="button"
                      onClick={() => setPaused((p) => !p)}
                      aria-label={paused ? copy.ui.playTour : copy.ui.pauseTour}
                      className="absolute right-2 top-1 z-10 flex size-10 items-center justify-center rounded-full bg-black/70 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {paused ? <Play size={14} /> : <Pause size={14} />}
                    </button>
                  )}
                </div>
                {!desktop && (
                  <motion.div
                    key={`caption-${step.id}`}
                    initial={reduced ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={
                      reduced
                        ? { duration: 0 }
                        : { ...TRANSITION_MQS, duration: 0.3, delay: 0.05 }
                    }
                    className="mt-4 min-h-[148px] rounded-xl border border-white/10 bg-[#0B0C0E] p-5"
                  >
                    <span className="font-mono text-xs text-[var(--mqs-value-inv)]">
                      {String(state.index + 1).padStart(2, '0')}
                    </span>
                    <h3 className="mt-2 text-lg font-semibold">
                      {step.title[locale]}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {step.text[locale]}
                    </p>
                  </motion.div>
                )}
              </div>
              <div className="mt-4 flex items-center justify-between gap-1">
                <button
                  type="button"
                  aria-label={copy.ui.previous}
                  onClick={() => choose(state.index - 1)}
                  className="flex size-10 shrink-0 items-center justify-center rounded-full border border-white/10 focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <ChevronLeft size={18} />
                </button>
                {
                  <span className="font-mono text-xs text-white/40">
                    {String(state.index + 1).padStart(2, '0')} /{' '}
                    {String(steps.length).padStart(2, '0')}
                  </span>
                }
                <button
                  type="button"
                  aria-label={copy.ui.next}
                  onClick={() => choose(state.index + 1)}
                  className="flex size-10 shrink-0 items-center justify-center rounded-full border border-white/10 focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
              {!desktop && <div className="mt-2">{tabsMarkup}</div>}
              <p className="mt-4 text-center text-xs text-white/45">
                {copy.ui.prototype}
              </p>
            </div>
          </div>
          <p className="sr-only" aria-live="polite" aria-atomic="true">
            {state.announcement !== null
              ? `${copy.ui.step} ${state.announcement + 1} ${copy.ui.of} ${steps.length}: ${steps[state.announcement].title[locale]}`
              : ''}
          </p>
        </div>
      </CoachSection>
      <ScreenshotDialogContent image={step.image} title={step.title[locale]} alt={step.alt[locale]} locale={locale} />
    </Dialog.Root>
  )
}

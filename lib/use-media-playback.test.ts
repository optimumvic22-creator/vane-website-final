import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const hook = vi.hoisted(() => ({
  effect: undefined as (() => void | (() => void)) | undefined,
  container: { getBoundingClientRect: vi.fn() },
  setState: vi.fn(),
  setSourceState: vi.fn(),
  stateCalls: 0,
}))

// These tests execute the real eligibility effect without a DOM renderer.
// Native video loading and React scheduling still need a browser smoke check.
vi.mock('react', () => ({
  useEffect: (effect: () => void | (() => void)) => { hook.effect = effect },
  useRef: () => ({ current: hook.container }),
  useState: (initial: boolean) => [initial, hook.stateCalls++ === 0 ? hook.setState : hook.setSourceState],
}))

import { useMediaPlayback } from './use-media-playback'
import { setMotionPaused } from './motion-preference'

type Intersection = { isIntersecting: boolean; intersectionRatio: number }
let notifyIntersection: (entries: Intersection[]) => void
let cleanup: (() => void) | undefined
let documentTarget: EventTarget & { visibilityState: string }
let motion: EventTarget & { matches: boolean }
let connection: EventTarget & { saveData: boolean }
let windowTarget: EventTarget & { innerWidth: number; innerHeight: number }
let pendingFrame: FrameRequestCallback | undefined
const observe = vi.fn()
const disconnect = vi.fn()
const cancelAnimationFrame = vi.fn()
const observerConstructor = vi.fn(function (
  callback: (entries: Intersection[]) => void,
) {
  notifyIntersection = callback
  return { observe, disconnect }
})

function start(options: { minVisibleRatio?: number } = {}) {
  // eslint-disable-next-line react-hooks/rules-of-hooks -- React is mocked to exercise the effect directly.
  const result = useMediaPlayback(options)
  const effectCleanup = hook.effect?.()
  cleanup = typeof effectCleanup === 'function' ? effectCleanup : undefined
  return result
}

function intersect(ratio: number, isIntersecting = true) {
  notifyIntersection([{ isIntersecting, intersectionRatio: ratio }])
}

beforeEach(() => {
  setMotionPaused(false)
  vi.clearAllMocks()
  hook.stateCalls = 0
  cleanup = undefined
  pendingFrame = undefined
  documentTarget = Object.assign(new EventTarget(), { visibilityState: 'visible' })
  motion = Object.assign(new EventTarget(), { matches: false })
  connection = Object.assign(new EventTarget(), { saveData: false })
  windowTarget = Object.assign(new EventTarget(), {
    innerWidth: 1000,
    innerHeight: 800,
    matchMedia: vi.fn(() => motion),
    requestAnimationFrame: vi.fn((callback: FrameRequestCallback) => {
      pendingFrame = callback
      return 7
    }),
    cancelAnimationFrame,
  })
  hook.container.getBoundingClientRect.mockReturnValue({
    top: 10, bottom: 110, left: 10, right: 110, width: 100, height: 100,
  })
  vi.stubGlobal('document', documentTarget)
  vi.stubGlobal('window', windowTarget)
  vi.stubGlobal('navigator', { connection })
  vi.stubGlobal('IntersectionObserver', observerConstructor)
})

afterEach(() => {
  cleanup?.()
  vi.unstubAllGlobals()
})

describe('useMediaPlayback eligibility', () => {
  it('retains a loaded frame on manual pause and releases it when offscreen', () => {
    start()
    intersect(1)
    expect(hook.setSourceState).toHaveBeenLastCalledWith(true)
    setMotionPaused(true)
    expect(hook.setState).toHaveBeenLastCalledWith(false)
    expect(hook.setSourceState).toHaveBeenLastCalledWith(true)
    intersect(0, false)
    expect(hook.setSourceState).toHaveBeenLastCalledWith(false)
    intersect(1)
    expect(hook.setSourceState).toHaveBeenLastCalledWith(false)
  })

  it('does not load video for initially reduced motion or data saver', () => {
    motion.matches = true
    start()
    intersect(1)
    expect(hook.setSourceState).toHaveBeenLastCalledWith(false)
    motion.matches = false
    connection.saveData = true
    motion.dispatchEvent(new Event('change'))
    expect(hook.setSourceState).toHaveBeenLastCalledWith(false)
  })
  it('keeps an explicit pause across viewport changes until manually resumed', () => {
    start()
    intersect(1)
    setMotionPaused(true)
    expect(hook.setState).toHaveBeenLastCalledWith(false)
    intersect(0, false)
    intersect(1)
    expect(hook.setState).toHaveBeenLastCalledWith(false)
    setMotionPaused(false)
    expect(hook.setState).toHaveBeenLastCalledWith(true)
  })

  it('starts denied and does not allow media before the first viewport result', () => {
    expect(start().mediaAllowed).toBe(false)
    expect(hook.setState).not.toHaveBeenCalled()
    expect(observe).toHaveBeenCalledWith(hook.container)
    expect(observerConstructor).toHaveBeenCalledWith(expect.any(Function), {
      threshold: [0, 0.2],
    })
  })

  it('requires the actual default visibility threshold, including its boundary', () => {
    start()
    intersect(0.199)
    expect(hook.setState).toHaveBeenLastCalledWith(false)
    intersect(0.2)
    expect(hook.setState).toHaveBeenLastCalledWith(true)
    intersect(0, false)
    expect(hook.setState).toHaveBeenLastCalledWith(false)
  })

  it('honors a custom threshold for a large entry section', () => {
    start({ minVisibleRatio: 0.01 })
    intersect(0.009)
    expect(hook.setState).toHaveBeenLastCalledWith(false)
    intersect(0.01)
    expect(hook.setState).toHaveBeenLastCalledWith(true)
    expect(observerConstructor).toHaveBeenCalledWith(expect.any(Function), {
      threshold: [0, 0.01],
    })
  })

  it.each(['hidden', 'reduce-motion', 'save-data'])(
    'does not briefly allow media when %s is already active',
    (preference) => {
      if (preference === 'hidden') documentTarget.visibilityState = 'hidden'
      if (preference === 'reduce-motion') motion.matches = true
      if (preference === 'save-data') connection.saveData = true
      start()
      intersect(1)
      expect(hook.setState).toHaveBeenLastCalledWith(false)
    },
  )

  it('reacts to visibility, reduced-motion, and data-saver changes', () => {
    start()
    intersect(1)
    expect(hook.setState).toHaveBeenLastCalledWith(true)
    documentTarget.visibilityState = 'hidden'
    documentTarget.dispatchEvent(new Event('visibilitychange'))
    expect(hook.setState).toHaveBeenLastCalledWith(false)
    documentTarget.visibilityState = 'visible'
    documentTarget.dispatchEvent(new Event('visibilitychange'))
    expect(hook.setState).toHaveBeenLastCalledWith(true)
    motion.matches = true
    motion.dispatchEvent(new Event('change'))
    expect(hook.setState).toHaveBeenLastCalledWith(false)
    motion.matches = false
    connection.saveData = true
    connection.dispatchEvent(new Event('change'))
    expect(hook.setState).toHaveBeenLastCalledWith(false)
    connection.saveData = false
    connection.dispatchEvent(new Event('change'))
    expect(hook.setState).toHaveBeenLastCalledWith(true)
  })

  it('works without the optional Network Information API', () => {
    vi.stubGlobal('navigator', {})
    start()
    intersect(1)
    expect(hook.setState).toHaveBeenLastCalledWith(true)
  })

  it('disconnects the observer and all preference listeners on cleanup', () => {
    start()
    intersect(1)
    cleanup?.()
    cleanup = undefined
    hook.setState.mockClear()
    documentTarget.dispatchEvent(new Event('visibilitychange'))
    motion.dispatchEvent(new Event('change'))
    connection.dispatchEvent(new Event('change'))
    expect(hook.setState).not.toHaveBeenCalled()
    expect(disconnect).toHaveBeenCalledOnce()
  })

  it('checks visible area on scroll/resize when IntersectionObserver is absent', () => {
    vi.stubGlobal('IntersectionObserver', undefined)
    start()
    expect(hook.setState).not.toHaveBeenCalled()
    pendingFrame?.(0)
    expect(hook.setState).toHaveBeenLastCalledWith(true)
    hook.container.getBoundingClientRect.mockReturnValue({
      top: 781, bottom: 881, left: 10, right: 110, width: 100, height: 100,
    })
    windowTarget.dispatchEvent(new Event('scroll'))
    expect(hook.setState).toHaveBeenLastCalledWith(false)
    hook.container.getBoundingClientRect.mockReturnValue({
      top: 780, bottom: 880, left: 10, right: 110, width: 100, height: 100,
    })
    windowTarget.dispatchEvent(new Event('resize'))
    expect(hook.setState).toHaveBeenLastCalledWith(true)
    hook.container.getBoundingClientRect.mockReturnValue({
      top: 10, bottom: 110, left: 1000, right: 1100, width: 100, height: 100,
    })
    windowTarget.dispatchEvent(new Event('scroll'))
    expect(hook.setState).toHaveBeenLastCalledWith(false)
  })

  it('cancels fallback work and removes scroll/resize listeners on cleanup', () => {
    vi.stubGlobal('IntersectionObserver', undefined)
    start()
    cleanup?.()
    cleanup = undefined
    windowTarget.dispatchEvent(new Event('scroll'))
    windowTarget.dispatchEvent(new Event('resize'))
    expect(hook.setState).not.toHaveBeenCalled()
    expect(cancelAnimationFrame).toHaveBeenCalledWith(7)
  })
})

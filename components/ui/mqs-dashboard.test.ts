import type { ReactElement } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const state = vi.hoisted(() => ({
  mediaCode: null as string | null,
  mediaAllowed: true,
  sourceAllowed: true,
  motionPaused: false,
  systemReducedMotion: false,
  hookIndex: 0,
  effects: [] as Array<() => void | (() => void)>,
  failedSources: new Set<string>(),
}))

// Component contract tests; native media playback is checked separately in-browser.
vi.mock('react', () => ({
  useEffect: (effect: () => void | (() => void)) => { state.effects.push(effect) },
  useMemo: (factory: () => unknown) => factory(),
  useRef: (initial: unknown) => ({ current: initial }),
  useState: (initial: unknown) => {
    const index = state.hookIndex++
    return [index === 2 ? state.mediaCode : index === 4 ? state.failedSources : initial, vi.fn()]
  },
}))
vi.mock('framer-motion', () => ({
  useReducedMotion: () => state.systemReducedMotion,
  motion: { polygon: 'motion.polygon', circle: 'motion.circle', span: 'motion.span', div: 'motion.div' },
}))
vi.mock('@/lib/motion-preference', () => ({ useMotionPaused: () => state.motionPaused }))
vi.mock('@/lib/use-media-playback', () => ({
  useMediaPlayback: () => ({
    mediaContainerRef: { current: null },
    mediaAllowed: state.mediaAllowed,
    mediaSourceAllowed: state.sourceAllowed,
  }),
}))

import { MqsDashboard } from './mqs-dashboard'

type Element = ReactElement<Record<string, unknown>>

function descendants(node: unknown): Element[] {
  if (Array.isArray(node)) return node.flatMap(descendants)
  if (!node || typeof node !== 'object' || !('props' in node)) return []
  const element = node as Element
  return [element, ...descendants(element.props.children)]
}

function render(variant: 'audience' | 'standalone' = 'audience') {
  state.hookIndex = 0
  state.effects = []
  return descendants(MqsDashboard({ variant }))
}

function video() {
  return render().find((element) => element.type === 'video')!
}

beforeEach(() => {
  state.mediaCode = null
  state.mediaAllowed = true
  state.sourceAllowed = true
  state.motionPaused = false
  state.systemReducedMotion = false
  state.failedSources = new Set()
})

describe('MQS media initialization and motion', () => {
  it('shows the fallback poster without loading Power before random selection', () => {
    const element = video()
    expect(element.props.poster).toContain('power-dario-keiser-push-pull-poster.jpg')
    expect(element.props.src).toBeUndefined()
    const nativeVideo = { pause: vi.fn(), load: vi.fn(), play: vi.fn() }
    ;(element.props.ref as { current: unknown }).current = nativeVideo
    state.effects[1]()
    expect(nativeVideo.play).not.toHaveBeenCalled()
  })

  it('loads only the selected initial domain', () => {
    state.mediaCode = 'NEURO'
    expect(video().props.src).toBe('/media/mqs-domains/neuro-julius-single-leg-line-hop-web.mp4')
  })

  it('retains the current source but pauses playback when manually paused', () => {
    state.mediaCode = 'GAIT'
    state.mediaAllowed = false
    state.motionPaused = true
    const element = video()
    expect(element.props.src).toContain('gait-colin-side-view-web.mp4')
    const nativeVideo = { pause: vi.fn(), load: vi.fn(), play: vi.fn() }
    ;(element.props.ref as { current: unknown }).current = nativeVideo
    state.effects[1]()
    expect(nativeVideo.pause).toHaveBeenCalledOnce()
    expect(nativeVideo.load).not.toHaveBeenCalled()
    expect(nativeVideo.play).not.toHaveBeenCalled()
  })

  it('releases offscreen sources and does not retry failed sources', () => {
    state.mediaCode = 'GAIT'
    state.sourceAllowed = false
    expect(video().props.src).toBeUndefined()
    state.sourceAllowed = true
    state.failedSources.add('/media/mqs-domains/gait-colin-side-view-web.mp4')
    expect(render().some((element) => element.type === 'video')).toBe(false)
  })

  it.each(['motionPaused', 'systemReducedMotion'] as const)('disables radar transitions for %s', (preference) => {
    state[preference] = true
    const shapes = render().filter((element) => String(element.type).startsWith('motion.'))
    expect(shapes).toHaveLength(8)
    expect(shapes.every((element) => (element.props.transition as { duration: number }).duration === 0)).toBe(true)
  })

  it('keeps radar transitions when motion is allowed', () => {
    const shapes = render().filter((element) => String(element.type).startsWith('motion.'))
    expect(shapes.every((element) => (element.props.transition as { duration: number }).duration === 0.28)).toBe(true)
  })

  it('also removes animation delays from standalone MQS when paused', () => {
    state.motionPaused = true
    const shapes = render('standalone').filter((element) => String(element.type).startsWith('motion.'))
    expect(shapes.length).toBeGreaterThan(0)
    expect(shapes.every((element) => (element.props.transition as { duration: number; delay?: number }).duration === 0)).toBe(true)
    expect(shapes.every((element) => !(element.props.transition as { delay?: number }).delay)).toBe(true)
  })
})

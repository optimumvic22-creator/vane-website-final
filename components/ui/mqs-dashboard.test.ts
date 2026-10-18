import type { ReactElement } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const state = vi.hoisted(() => ({
  mediaCode: null as string | null,
  mediaAllowed: true,
  sourceAllowed: true,
  motionPaused: false,
  systemReducedMotion: false,
  adjusting: false,
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
    return [index === 2 ? state.mediaCode : index === 4 ? state.failedSources : index === 5 ? state.adjusting : initial, vi.fn()]
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

import { MqsDashboard, type MqsDashboardProps } from './mqs-dashboard'

type Element = ReactElement<Record<string, unknown>>

function descendants(node: unknown): Element[] {
  if (Array.isArray(node)) return node.flatMap(descendants)
  if (!node || typeof node !== 'object' || !('props' in node)) return []
  const element = node as Element
  return [element, ...descendants(element.props.children)]
}

function render(
  variant: 'audience' | 'standalone' = 'audience',
  locale: 'en' | 'de' = 'en',
  audience: 'athlete' | 'coach' | 'partner' = 'athlete',
  extra: Pick<MqsDashboardProps, 'domainExplanations' | 'onDomainSelect'> = {},
) {
  state.hookIndex = 0
  state.effects = []
  return descendants(MqsDashboard({ variant, locale, audience, ...extra }))
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
  state.adjusting = false
  state.failedSources = new Set()
})

describe.each(['athlete', 'coach', 'partner'] as const)('MQS introduction for %s', (audience) => {
  it.each(['en', 'de'] as const)('keeps the introduction outside the coach hero in %s', (locale) => {
    const elements = render('audience', locale, audience)
    const headers = elements.filter((element) =>
      element.type === 'p' && element.props.children === 'Introducing The Movement Quality Score',
    )
    expect(headers).toHaveLength(audience === 'coach' ? 0 : 1)
    if (audience === 'coach') return
    expect(headers[0].props.className).toContain('w-full')
    expect(headers[0].props.className).toContain('text-center')
    expect(headers[0].props.className).toContain('break-normal')
    expect(headers[0].props.className).not.toContain('whitespace-nowrap')
    expect(elements.some((element) =>
      element.type === 'p' && ['Movement Quality Score', '7 domains', '7 Domänen'].includes(String(element.props.children)),
    )).toBe(false)
  })
})

describe('MQS media initialization and motion', () => {
  it('shows the fallback poster without loading Power before random selection', () => {
    const element = video()
    expect(element.props.poster).toContain('power-2026-10-14-poster.jpg')
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

  it('updates radar immediately during pointer or keyboard adjustment', () => {
    state.adjusting = true
    const shapes = render().filter((element) => String(element.type).startsWith('motion.'))
    expect(shapes).toHaveLength(8)
    expect(shapes.every((element) => (element.props.transition as { duration: number }).duration === 0)).toBe(true)
    const ranges = render().filter((element) => element.props.type === 'range')
    expect(ranges).toHaveLength(8)
    for (const range of ranges) {
      expect(range.props.onPointerCancel).toBeTypeOf('function')
      expect(range.props.onLostPointerCapture).toBeTypeOf('function')
      expect(range.props.onKeyUp).toBeTypeOf('function')
    }
  })

  it('also removes animation delays from standalone MQS when paused', () => {
    state.motionPaused = true
    const shapes = render('standalone').filter((element) => String(element.type).startsWith('motion.'))
    expect(shapes.length).toBeGreaterThan(0)
    expect(shapes.every((element) => (element.props.transition as { duration: number; delay?: number }).duration === 0)).toBe(true)
    expect(shapes.every((element) => !(element.props.transition as { delay?: number }).delay)).toBe(true)
  })
})

describe('optional coach domain explanations', () => {
  it('associates the explanation with the range and supports keyboard focus and tapping', () => {
    const onDomainSelect = vi.fn()
    const elements = render('audience', 'en', 'coach', {
      domainExplanations: { POST: { name: 'Postural control', description: 'Control your trunk and spine in movement.' } },
      onDomainSelect,
    })
    const button = elements.find(e => e.props['aria-label'] === 'Explain Postural control')!
    const range = elements.find(e => e.props.id === 'mqs-domain-post')!
    const description = elements.find(e => e.props.id === button.props['aria-controls'])!
    expect(range.props['aria-describedby']).toBe(description.props.id)
    expect(description.props.children).toContain('trunk and spine')
    ;(button.props.onFocus as () => void)()
    ;(button.props.onClick as () => void)()
    expect(onDomainSelect).toHaveBeenCalledWith('POST')
  })
  it.each(['athlete', 'partner'] as const)('keeps the original controls for %s', audience => {
    const elements = render('audience', 'en', audience)
    expect(elements.some(e => e.props.className === 'mqs-domain-info')).toBe(false)
    expect(elements.filter(e => e.props.type === 'range')).toHaveLength(8)
  })
})

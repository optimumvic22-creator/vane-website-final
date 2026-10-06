import type { ReactElement } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { AudienceMotionClip } from './audience-motion-panel'

const hooks = vi.hoisted(() => ({
  values: [] as unknown[],
  refs: [] as Array<{ current: unknown }>,
  callbacks: [] as Array<{ value: unknown; deps: unknown[] }>,
  effects: [] as Array<{ run: () => void | (() => void); deps: unknown[]; cleanup?: () => void; pending: boolean }>,
  stateIndex: 0,
  refIndex: 0,
  callbackIndex: 0,
  effectIndex: 0,
  mediaAllowed: true,
  sourceAllowed: true,
}))

vi.mock('react', () => ({
  useState: (initial: unknown) => {
    const index = hooks.stateIndex++
    if (!(index in hooks.values)) hooks.values[index] = typeof initial === 'function' ? initial() : initial
    return [hooks.values[index], (value: unknown) => {
      hooks.values[index] = typeof value === 'function' ? value(hooks.values[index]) : value
    }]
  },
  useRef: (initial: unknown) => {
    const index = hooks.refIndex++
    return hooks.refs[index] ??= { current: initial }
  },
  useCallback: (value: unknown, deps: unknown[]) => {
    const index = hooks.callbackIndex++
    const previous = hooks.callbacks[index]
    if (!previous || deps.some((dep, i) => !Object.is(dep, previous.deps[i]))) hooks.callbacks[index] = { value, deps }
    return hooks.callbacks[index].value
  },
  useEffect: (run: () => void | (() => void), deps: unknown[]) => {
    const index = hooks.effectIndex++
    const previous = hooks.effects[index]
    const pending = !previous || deps.some((dep, i) => !Object.is(dep, previous.deps[i]))
    hooks.effects[index] = { run, deps, pending, cleanup: previous?.cleanup }
  },
}))
vi.mock('@/lib/use-media-playback', () => ({
  useMediaPlayback: () => ({
    mediaContainerRef: { current: null },
    mediaAllowed: hooks.mediaAllowed,
    mediaSourceAllowed: hooks.sourceAllowed,
  }),
}))

import { AudienceVideoPlaylist } from './audience-video-playlist'
import { AmbientVideo } from './ambient-video'

type Element = ReactElement<Record<string, unknown>>
type Video = ReturnType<typeof makeVideo>
let videos: Video[]
let elements: Element[]
let clips: AudienceMotionClip[]
let paintCallback: FrameRequestCallback | undefined

function makeVideo() {
  const video = {
    src: undefined as string | undefined,
    currentTime: 0,
    duration: 10,
    readyState: 0,
    seeking: false,
    playbackRate: 1,
    frame: undefined as (() => void) | undefined,
    pause: vi.fn(),
    load: vi.fn(),
    play: vi.fn(() => Promise.resolve()),
    getAttribute: vi.fn((name: string) => name === 'src' ? video.src : null),
    removeAttribute: vi.fn((name: string) => { if (name === 'src') video.src = undefined }),
    requestVideoFrameCallback: vi.fn((callback: () => void) => { video.frame = callback; return 7 }),
    cancelVideoFrameCallback: vi.fn(() => { video.frame = undefined }),
  }
  return video
}

function descendants(node: unknown): Element[] {
  if (Array.isArray(node)) return node.flatMap(descendants)
  if (!node || typeof node !== 'object' || !('props' in node)) return []
  const element = node as Element
  return [element, ...descendants(element.props.children)]
}

function render() {
  hooks.stateIndex = hooks.refIndex = hooks.callbackIndex = hooks.effectIndex = 0
  return commitRender(AudienceVideoPlaylist({ clips, ariaLabel: 'Assessment sequence' }))
}

function renderAmbient() {
  hooks.stateIndex = hooks.refIndex = hooks.callbackIndex = hooks.effectIndex = 0
  return commitRender(AmbientVideo({ src: '/ambient.mp4', poster: '/ambient.jpg' }))
}

function commitRender(component: unknown) {
  elements = descendants(component)
    .filter((element) => element.type === 'video')
  elements.forEach((element, index) => {
    const src = element.props.src as string | undefined
    if (videos[index].src !== src) {
      videos[index].src = src
      videos[index].readyState = 0
      videos[index].currentTime = 0
    }
    const ref = element.props.ref
    if (typeof ref === 'function') ref(videos[index])
    else (ref as { current: unknown }).current = videos[index]
  })
  hooks.effects.filter((effect) => effect.pending).forEach((effect) => effect.cleanup?.())
  hooks.effects.filter((effect) => effect.pending).forEach((effect) => {
    const cleanup = effect.run()
    effect.cleanup = typeof cleanup === 'function' ? cleanup : undefined
    effect.pending = false
  })
  return elements
}

function fire(slot: number, event: string) {
  ;(elements[slot].props[event] as (event: { currentTarget: Video }) => void)({ currentTarget: videos[slot] })
}

function prepareTransition() {
  render()
  fire(0, 'onPlaying')
  render()
  videos[1].readyState = 2
  fire(1, 'onLoadedData')
  render()
  fire(0, 'onEnded')
  render()
}

beforeEach(() => {
  hooks.values = []
  hooks.refs = []
  hooks.callbacks = []
  hooks.effects = []
  hooks.mediaAllowed = hooks.sourceAllowed = true
  videos = [makeVideo(), makeVideo()]
  clips = ['one', 'two', 'three', 'four', 'five'].map((name) => ({
    src: '/' + name + '.mp4', poster: '/' + name + '.jpg', domainFocus: ['power'],
  }))
  paintCallback = undefined
  vi.stubGlobal('window', {
    requestAnimationFrame: vi.fn((callback: FrameRequestCallback) => { paintCallback = callback; return 8 }),
    cancelAnimationFrame: vi.fn(),
  })
})

afterEach(() => {
  hooks.effects.forEach((effect) => effect.cleanup?.())
  vi.unstubAllGlobals()
})

describe('AudienceVideoPlaylist two-buffer lifecycle', () => {
  it('attaches only the active source initially and warms just its successor after playing', () => {
    render()
    expect(elements).toHaveLength(2)
    expect(elements.map((element) => element.props.src)).toEqual(['/one.mp4', undefined])
    fire(0, 'onPlaying')
    render()
    expect(elements.map((element) => element.props.src)).toEqual(['/one.mp4', '/two.mp4'])
    expect(elements[1].props.preload).toBe('auto')
    expect(videos[1].play).not.toHaveBeenCalled()
  })

  it('keeps the outgoing frame visible until the next decoded frame, then recycles only that slot', () => {
    prepareTransition()
    expect(elements[0].props.className).toContain('opacity-100')
    expect(elements[1].props.className).toContain('opacity-0')
    expect(videos[1].requestVideoFrameCallback).toHaveBeenCalledOnce()
    videos[1].frame?.()
    render()
    expect(elements[1].props.className).toContain('opacity-100')
    expect(elements.map((element) => element.props.src)).toEqual(['/three.mp4', '/two.mp4'])
    expect(elements[1].props.poster).toBe('/two.jpg')
  })

  it('holds the outgoing frame while the successor is still loading', () => {
    render()
    fire(0, 'onPlaying')
    render()
    fire(0, 'onEnded')
    render()
    expect(videos[1].play).not.toHaveBeenCalled()
    expect(elements[0].props.className).toContain('opacity-100')
    videos[1].readyState = 2
    fire(1, 'onLoadedData')
    render()
    expect(videos[1].play).toHaveBeenCalledOnce()
  })

  it('pauses a pending transition and cancels its frame callback without dropping the active source', () => {
    prepareTransition()
    const staleFrame = videos[1].frame
    videos[0].currentTime = 4
    hooks.mediaAllowed = false
    render()
    staleFrame?.()
    render()
    expect(videos[1].cancelVideoFrameCallback).toHaveBeenCalled()
    expect(elements[0].props.className).toContain('opacity-100')
    expect(videos[0].currentTime).toBe(4)
    expect(videos[0].src).toBe('/one.mp4')
    hooks.sourceAllowed = false
    render()
    expect(elements.every((element) => element.props.src === undefined)).toBe(true)
  })

  it('does not attach or play sources when preferences prohibit media', () => {
    hooks.mediaAllowed = hooks.sourceAllowed = false
    render()
    expect(elements[0].props.poster).toBe('/one.jpg')
    expect(elements.every((element) => element.props.src === undefined)).toBe(true)
    expect(videos.every((video) => video.play.mock.calls.length === 0)).toBe(true)
  })

  it('skips failed successors and stops after all sources fail', () => {
    render()
    fire(0, 'onError')
    render()
    expect(elements[1].props.src).toBe('/two.mp4')
    for (let index = 1; index < clips.length; index += 1) {
      fire(1, 'onError')
      render()
    }
    expect(elements.every((element) => element.props.src === undefined)).toBe(true)
    expect(elements[0].props.poster).toBe('/one.jpg')
  })

  it('keeps a poster and releases both buffers if autoplay is blocked', async () => {
    videos[0].play.mockRejectedValueOnce(new DOMException('Denied', 'NotAllowedError'))
    render()
    await Promise.resolve()
    render()
    expect(elements.every((element) => element.props.src === undefined)).toBe(true)
    expect(elements[0].props.poster).toBe('/one.jpg')
  })

  it('ignores cancellation AbortError and has a no-frame-callback fallback', async () => {
    videos[0].play.mockRejectedValueOnce(new DOMException('Interrupted', 'AbortError'))
    render()
    await Promise.resolve()
    render()
    expect(elements[0].props.src).toBe('/one.mp4')
    Object.assign(videos[1], { requestVideoFrameCallback: undefined })
    prepareTransition()
    await Promise.resolve()
    paintCallback?.(0)
    render()
    expect(elements[1].props.className).toContain('opacity-100')
  })

  it('restarts the only playable clip without a second source', () => {
    clips = clips.slice(0, 1)
    render()
    videos[0].currentTime = 10
    fire(0, 'onEnded')
    expect(videos[0].currentTime).toBe(0)
    expect(elements[1].props.src).toBeUndefined()
  })

  it('replays the surviving active clip if the pending successor also fails', () => {
    clips = clips.slice(0, 2)
    render()
    fire(0, 'onPlaying')
    render()
    fire(0, 'onEnded')
    render()
    videos[0].currentTime = 10
    fire(1, 'onError')
    render()
    expect(videos[0].currentTime).toBe(0)
    expect(elements[0].props.src).toBe('/one.mp4')
    expect(elements[1].props.src).toBeUndefined()
  })

  it('releases native resources and cancels a pending handoff on unmount', () => {
    prepareTransition()
    const staleFrame = videos[1].frame
    hooks.effects.forEach((effect) => effect.cleanup?.())
    hooks.effects = []
    staleFrame?.()
    expect(videos.every((video) => video.removeAttribute.mock.calls.length === 1)).toBe(true)
    expect(videos.every((video) => video.src === undefined)).toBe(true)
  })
})

describe('AmbientVideo poster and cleanup', () => {
  it('shows its same-footage poster without attaching a denied video', () => {
    hooks.mediaAllowed = hooks.sourceAllowed = false
    renderAmbient()
    expect(elements[0].props.poster).toBe('/ambient.jpg')
    expect(elements[0].props.src).toBeUndefined()
    expect(videos[0].play).not.toHaveBeenCalled()
  })

  it('keeps the poster mounted after an error and does not retry the source', () => {
    renderAmbient()
    fire(0, 'onError')
    renderAmbient()
    expect(elements).toHaveLength(1)
    expect(elements[0].props.poster).toBe('/ambient.jpg')
    expect(elements[0].props.src).toBeUndefined()
    expect(videos[0].play).toHaveBeenCalledOnce()
  })

  it('falls back on autoplay denial but ignores a cancelled load', async () => {
    videos[0].play.mockRejectedValueOnce(new DOMException('Interrupted', 'AbortError'))
    renderAmbient()
    await Promise.resolve()
    renderAmbient()
    expect(elements[0].props.src).toBe('/ambient.mp4')
    hooks.mediaAllowed = false
    renderAmbient()
    hooks.mediaAllowed = true
    videos[0].play.mockRejectedValueOnce(new DOMException('Denied', 'NotAllowedError'))
    renderAmbient()
    await Promise.resolve()
    renderAmbient()
    expect(elements[0].props.src).toBeUndefined()
    expect(elements[0].props.poster).toBe('/ambient.jpg')
  })

  it('pauses without loading during source retention, and releases on unmount', () => {
    renderAmbient()
    videos[0].currentTime = 3
    hooks.mediaAllowed = false
    renderAmbient()
    expect(videos[0].currentTime).toBe(3)
    expect(videos[0].load).not.toHaveBeenCalled()
    hooks.effects.forEach((effect) => effect.cleanup?.())
    hooks.effects = []
    expect(videos[0].removeAttribute).toHaveBeenCalledWith('src')
    expect(videos[0].load).toHaveBeenCalledOnce()
  })
})

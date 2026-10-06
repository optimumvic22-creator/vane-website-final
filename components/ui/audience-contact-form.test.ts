import { PassThrough } from 'node:stream'
import { createElement, type ComponentType } from 'react'
import { renderToPipeableStream } from 'react-dom/server'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const state = vi.hoisted(() => ({
  active: false,
  activate: vi.fn(),
  effects: [] as Array<() => void | (() => void)>,
  loadBoundary: vi.fn(),
  container: {},
}))

vi.mock('react', async () => ({
  ...await vi.importActual<typeof import('react')>('react'),
  useState: () => [state.active, state.activate],
  useRef: () => ({ current: state.container }),
  useEffect: (effect: () => void | (() => void)) => { state.effects.push(effect) },
}))
vi.mock('next/dynamic', async () => {
  const { lazy } = await import('react')
  return {
    default: (load: () => Promise<ComponentType>) => lazy(async () => {
      state.loadBoundary()
      return { default: await load() }
    }),
  }
})
vi.mock('@/lib/locale', () => ({ useLocale: () => ({ locale: 'en' }) }))
vi.mock('./audience-inquiry-form', () => ({
  AudienceInquiryForm: ({ audience, locale }: { audience: string; locale: string }) =>
    createElement('form', { 'data-form': 'inquiry', 'data-audience': audience }, locale),
}))
vi.mock('./audience-waitlist-form', () => ({
  AudienceWaitlistForm: ({ audience, locale }: { audience: string; locale: string }) =>
    createElement('form', { 'data-form': 'waitlist', 'data-audience': audience }, locale),
}))

import { AudienceContactForm } from './audience-contact-form'

const props = { audience: 'athlete' as const, locale: 'en' as const, cta: 'Request', note: 'Note' }

function render(overrides: Partial<Parameters<typeof AudienceContactForm>[0]> = {}): Promise<string> {
  return new Promise((resolve, reject) => {
    let html = ''
    const output = new PassThrough()
    output.on('data', (chunk: Buffer) => { html += chunk.toString() })
    output.on('end', () => resolve(html))
    output.on('error', reject)
    const { pipe } = renderToPipeableStream(createElement(AudienceContactForm, { ...props, ...overrides }), {
      onAllReady() { pipe(output) },
      onError: reject,
    })
  })
}

function browser({ hash = '', observer = true } = {}) {
  const documentListeners = new Map<string, (event: Event) => void>()
  const windowListeners = new Map<string, () => void>()
  const disconnect = vi.fn()
  const observe = vi.fn()
  let intersect: (entries: Array<{ isIntersecting: boolean }>) => void = () => undefined
  let observerOptions: IntersectionObserverInit | undefined
  vi.stubGlobal('window', {
    location: { hash, href: `https://vanescience.com/for/athlete${hash}`, origin: 'https://vanescience.com', pathname: '/for/athlete' },
    addEventListener: (name: string, callback: () => void) => { windowListeners.set(name, callback) },
    removeEventListener: (name: string) => { windowListeners.delete(name) },
    setTimeout,
    clearTimeout,
  })
  vi.stubGlobal('document', {
    addEventListener: (name: string, callback: (event: Event) => void) => { documentListeners.set(name, callback) },
    removeEventListener: (name: string) => { documentListeners.delete(name) },
  })
  vi.stubGlobal('IntersectionObserver', observer ? class {
    constructor(callback: typeof intersect, options: IntersectionObserverInit) {
      intersect = callback
      observerOptions = options
    }
    observe = observe
    disconnect = disconnect
  } : undefined)
  AudienceContactForm(props)
  const cleanup = state.effects[0]()
  return { documentListeners, windowListeners, disconnect, observe, intersect, observerOptions, cleanup }
}

beforeEach(() => {
  state.active = false
  state.effects = []
  vi.clearAllMocks()
})
afterEach(() => {
  vi.unstubAllGlobals()
  vi.useRealTimers()
})

describe('demand-loaded audience forms', () => {
  it('does not import either form during the initial render', async () => {
    const html = await render()
    expect(state.loadBoundary).not.toHaveBeenCalled()
    expect(html).not.toContain('<form')
    expect(html).toContain('Loading form')
    expect(html).toContain('mailto:office@vanescience.com')
  })

  it('loads only the inquiry form after athlete intent', async () => {
    state.active = true
    const html = await render()
    expect(html).toContain('data-form="inquiry"')
    expect(html).not.toContain('data-form="waitlist"')
    expect(state.loadBoundary).toHaveBeenCalledOnce()
  })

  it.each(['coach', 'partner'] as const)('renders the waitlist with current %s and locale props', async (audience) => {
    state.active = true
    const html = await render({ audience, locale: 'de' })
    expect(html).toContain(`data-form="waitlist" data-audience="${audience}"`)
    expect(html).toContain('>de</form>')
    expect(html).not.toContain('data-form="inquiry"')
  })

  it('starts near the viewport and removes all listeners after activation/unmount', () => {
    const ui = browser()
    expect(ui.observe).toHaveBeenCalledWith(state.container)
    expect(ui.observerOptions).toEqual({ rootMargin: '1000px 0px' })
    ui.intersect([{ isIntersecting: false }])
    expect(state.activate).not.toHaveBeenCalled()
    ui.intersect([{ isIntersecting: true }])
    expect(state.activate).toHaveBeenCalledWith(true)
    ui.cleanup?.()
    expect(ui.disconnect).toHaveBeenCalledOnce()
    expect(ui.documentListeners.size).toBe(0)
    expect(ui.windowListeners.size).toBe(0)
  })

  it.each([{ hash: '#waitlist' }, { observer: false }])('loads direct anchors or unsupported observers: %j', (options) => {
    vi.useFakeTimers()
    const ui = browser(options)
    expect(state.activate).not.toHaveBeenCalled()
    vi.runAllTimers()
    expect(state.activate).toHaveBeenCalledWith(true)
    ui.cleanup?.()
  })

  it('warms only same-page contact links before anchor scrolling', () => {
    class AnchorTarget {
      constructor(private href: string) {}
      closest() { return { href: this.href } }
    }
    vi.stubGlobal('Element', AnchorTarget)
    const ui = browser()
    ui.documentListeners.get('click')?.({ target: new AnchorTarget('/for/coach#waitlist') } as unknown as MouseEvent)
    expect(state.activate).not.toHaveBeenCalled()
    ui.documentListeners.get('click')?.({ target: new AnchorTarget('/for/athlete#waitlist') } as unknown as MouseEvent)
    expect(state.activate).toHaveBeenCalledWith(true)
    ui.cleanup?.()
  })

  it('does not recreate loading observers once the form has mounted', () => {
    state.active = true
    const ui = browser()
    expect(ui.observe).not.toHaveBeenCalled()
    expect(ui.documentListeners.size).toBe(0)
  })

  it('prepares native fields when keyboard traversal starts, but not for unrelated keys', () => {
    const ui = browser()
    ui.documentListeners.get('keydown')?.({ key: 'Escape' } as KeyboardEvent)
    expect(state.activate).not.toHaveBeenCalled()
    ui.documentListeners.get('keydown')?.({ key: 'Tab' } as KeyboardEvent)
    expect(state.activate).toHaveBeenCalledWith(true)
    ui.cleanup?.()
  })
})

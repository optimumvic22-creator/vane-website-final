import type { ReactElement } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const hooks = vi.hoisted(() => ({
  values: [] as unknown[],
  index: 0,
  effects: [] as Array<() => void | (() => void)>,
}))

vi.mock('react', async (original) => ({
  ...await original<typeof import('react')>(),
  useState: (initial: unknown) => {
    const index = hooks.index++
    if (!(index in hooks.values)) hooks.values[index] = initial
    return [hooks.values[index], (value: unknown) => { hooks.values[index] = value }]
  },
  useCallback: (callback: unknown) => callback,
  useEffect: (effect: () => void | (() => void)) => { hooks.effects.push(effect) },
}))

import { LocaleProvider, type Locale } from './locale'

let location: { href: string; protocol: string }
let history: { state: object; replaceState: ReturnType<typeof vi.fn> }
let events: EventTarget
let storage: { getItem: ReturnType<typeof vi.fn>; setItem: ReturnType<typeof vi.fn> }

function render() {
  hooks.index = 0
  const element = LocaleProvider({ children: null, initialLocale: 'en', hasLocalePreference: true }) as ReactElement<{
    value: { locale: Locale; setLocale: (locale: Locale) => void; gateState: string }
  }>
  return element.props.value
}

beforeEach(() => {
  hooks.values = []
  hooks.effects = []
  location = { href: 'https://vanescience.com/for/coach?lang=en&utm_source=network#waitlist', protocol: 'https:' }
  history = { state: { __NA: true }, replaceState: vi.fn() }
  events = new EventTarget()
  storage = { getItem: vi.fn(() => null), setItem: vi.fn() }
  vi.stubGlobal('localStorage', storage)
  vi.stubGlobal('document', { documentElement: { lang: 'en' }, cookie: '' })
  vi.stubGlobal('window', {
    location, history,
    addEventListener: events.addEventListener.bind(events),
    removeEventListener: events.removeEventListener.bind(events),
  })
})

afterEach(() => vi.unstubAllGlobals())

describe('language selection and browser history', () => {
  it('updates the language through public history integration while preserving campaign parameters and anchor', () => {
    render().setLocale('de')
    expect(render().locale).toBe('de')
    expect(storage.setItem).toHaveBeenCalledWith('vane-lang', 'de')
    expect(history.replaceState).toHaveBeenCalledExactlyOnceWith(
      null, '', '/for/coach?lang=de&utm_source=network#waitlist',
    )
    expect(document.cookie).toContain('vane-lang=de;')
  })

  it('records the choice in URLs that did not previously specify a language', () => {
    location.href = 'https://vanescience.com/for/athlete#results'
    render().setLocale('de')
    expect(history.replaceState).toHaveBeenCalledWith(null, '', '/for/athlete?lang=de#results')
  })

  it('keeps selection usable when preference storage and history are restricted', () => {
    storage.setItem.mockImplementation(() => { throw new Error('blocked') })
    history.replaceState.mockImplementation(() => { throw new Error('blocked') })
    expect(() => render().setLocale('de')).not.toThrow()
    expect(render().locale).toBe('de')
  })

  it('follows an explicit language during back/forward navigation and removes the listener on unmount', () => {
    render()
    const cleanups = hooks.effects.map((effect) => effect())
    location.href = 'https://vanescience.com/for/coach?lang=de#results'
    events.dispatchEvent(new Event('popstate'))
    expect(render().locale).toBe('de')
    expect(render().gateState).toBe('dismissed')
    expect(history.replaceState).not.toHaveBeenCalled()
    cleanups.forEach((cleanup) => cleanup?.())
    location.href = 'https://vanescience.com/for/coach?lang=en'
    events.dispatchEvent(new Event('popstate'))
    expect(render().locale).toBe('de')
  })

  it.each(['fr', '', 'DE'])('ignores invalid historical language %s', (lang) => {
    render()
    const cleanups = hooks.effects.map((effect) => effect())
    location.href = `https://vanescience.com/for/coach?lang=${lang}`
    events.dispatchEvent(new Event('popstate'))
    expect(render().locale).toBe('en')
    cleanups.forEach((cleanup) => cleanup?.())
  })
})

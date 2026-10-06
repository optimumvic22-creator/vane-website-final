import type { ReactElement } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const state = vi.hoisted(() => ({
  view: 'header' as 'header' | 'loading' | 'inquiry' | 'waitlist',
  locale: 'en' as 'en' | 'de' | null,
  pathname: '/for/coach',
  scrolled: false,
  hookIndex: 0,
  effects: [] as Array<() => unknown>,
  setMobileOpen: vi.fn(),
}))

vi.mock('react', async () => {
  const actual = await vi.importActual<typeof import('react')>('react')
  return {
    ...actual,
    useEffect: (effect: () => unknown) => { state.effects.push(effect) },
    useRef: (value: unknown) => ({ current: value }),
    useId: () => 'test-waitlist',
    useState: (initial: unknown) => {
      const index = state.hookIndex++
      if (state.view === 'header' && index === 0) return [state.scrolled, vi.fn()]
      if (state.view === 'header' && index === 1) return [true, state.setMobileOpen]
      if ((state.view === 'inquiry' || state.view === 'waitlist') && index === 0) return ['success', vi.fn()]
      if (state.view === 'waitlist' && index === 2) return [true, vi.fn()]
      return [initial, vi.fn()]
    },
  }
})
vi.mock('@/lib/locale', () => ({
  useLocale: () => ({ locale: state.locale ?? 'en' }),
  useOptionalLocale: () => state.locale ? { locale: state.locale } : null,
}))
vi.mock('next/navigation', () => ({ usePathname: () => state.pathname }))
vi.mock('next/link', () => ({ default: 'a' }))
vi.mock('next/image', () => ({ default: 'img' }))
vi.mock('framer-motion', () => ({ motion: { nav: 'nav' } }))

import Loading from '@/app/loading'
import { AudienceInquiryForm } from '@/components/ui/audience-inquiry-form'
import { AudienceWaitlistForm } from '@/components/ui/audience-waitlist-form'
import { SiteHeader } from './SiteHeader'

type Element = ReactElement<Record<string, unknown>>

function descendants(node: unknown): Element[] {
  if (!node || typeof node !== 'object' || !('props' in node)) return []
  const element = node as Element
  const children = element.props.children
  return [element, ...(Array.isArray(children) ? children : [children]).flatMap(descendants)]
}

function content(node: unknown): string {
  if (typeof node === 'string') return node
  if (Array.isArray(node)) return node.map(content).join(' ')
  if (!node || typeof node !== 'object' || !('props' in node)) return ''
  return content((node as Element).props.children)
}

beforeEach(() => {
  vi.clearAllMocks()
  state.view = 'header'
  state.locale = 'en'
  state.pathname = '/for/coach'
  state.scrolled = false
  state.hookIndex = 0
  state.effects = []
})
afterEach(() => { vi.unstubAllGlobals() })

function headerHarness({ href = '#results', insideMenu = true, onToggle = false, matchingVisible = true, logoVisible = true } = {}) {
  const elements = descendants(SiteHeader())
  const active = { closest: () => href ? { getAttribute: () => href } : null }
  const toggle = onToggle ? Object.assign(active, { focus: vi.fn() }) : { focus: vi.fn() }
  const link = { getAttribute: () => href, getClientRects: () => matchingVisible ? [{}] : [], focus: vi.fn() }
  const logo = { getClientRects: () => logoVisible ? [{}] : [], focus: vi.fn() }
  const refs = [
    [elements.find((element) => element.props['aria-label'] === 'VANE Science'), logo],
    [elements.find((element) => element.props['aria-label'] === 'Main navigation'), { querySelectorAll: () => [link] }],
    [elements.find((element) => element.props.id === 'mobile-nav'), { contains: (node: unknown) => insideMenu && node === active }],
    [elements.find((element) => element.props['aria-controls'] === 'mobile-nav'), toggle],
  ] as const
  for (const [element, value] of refs) {
    const ref = element?.props.ref as { current: unknown }
    ref.current = value
  }
  let breakpoint: (event: { matches: boolean }) => void = () => undefined
  let keydown: (event: { key: string }) => void = () => undefined
  let mediaQuery = ''
  vi.stubGlobal('window', {
    matchMedia: (query: string) => {
      mediaQuery = query
      return { matches: false,
      addEventListener: (_type: string, handler: typeof breakpoint) => { breakpoint = handler },
      removeEventListener: vi.fn(),
      }
    },
  })
  vi.stubGlobal('document', {
    activeElement: active,
    addEventListener: (_type: string, handler: typeof keydown) => { keydown = handler },
    removeEventListener: vi.fn(),
  })
  state.effects[0]()
  return { breakpoint: (matches = true) => breakpoint({ matches }), keydown, link, logo, toggle, mediaQuery }
}

describe('mobile menu breakpoint focus', () => {
  it('keeps the scrolled header and mobile panel opaque above page content', () => {
    state.scrolled = true
    const header = SiteHeader()
    const panel = descendants(header).find((element) => element.props.id === 'mobile-nav')

    expect(header.props.className).toContain('bg-background')
    expect(header.props.className).not.toContain('bg-background/88')
    expect(header.props.className).not.toContain('backdrop-blur')
    expect(panel?.props.className).toContain('bg-background')
    expect(panel?.props.className).not.toContain('bg-background/95')
  })

  it('moves focus to the matching visible desktop link', () => {
    const ui = headerHarness()
    ui.breakpoint()
    expect(ui.link.focus).toHaveBeenCalledWith({ preventScroll: true })
    expect(ui.logo.focus).not.toHaveBeenCalled()
    expect(state.setMobileOpen).toHaveBeenCalledWith(false)
  })

  it('uses the visible wordmark when focus was on the toggle', () => {
    const ui = headerHarness({ href: '', insideMenu: false, onToggle: true })
    ui.breakpoint()
    expect(ui.logo.focus).toHaveBeenCalledWith({ preventScroll: true })
    expect(ui.toggle.focus).not.toHaveBeenCalled()
  })

  it('does not send focus to a hidden matching link', () => {
    const ui = headerHarness({ matchingVisible: false })
    ui.breakpoint()
    expect(ui.link.focus).not.toHaveBeenCalled()
    expect(ui.logo.focus).toHaveBeenCalledWith({ preventScroll: true })
  })

  it('does not move focus from content outside the mobile controls', () => {
    const ui = headerHarness({ insideMenu: false })
    ui.breakpoint()
    expect(ui.link.focus).not.toHaveBeenCalled()
    expect(ui.logo.focus).not.toHaveBeenCalled()
    expect(state.setMobileOpen).toHaveBeenCalledWith(false)
  })

  it('does not focus an unavailable fallback or react to the mobile breakpoint', () => {
    const ui = headerHarness({ matchingVisible: false, logoVisible: false })
    ui.breakpoint(false)
    expect(state.setMobileOpen).not.toHaveBeenCalled()
    ui.breakpoint()
    expect(ui.logo.focus).not.toHaveBeenCalled()
  })

  it('preserves Escape closing and focus restoration to the mobile toggle', () => {
    const ui = headerHarness()
    ui.keydown({ key: 'Escape' })
    expect(state.setMobileOpen).toHaveBeenCalledWith(false)
    expect(ui.toggle.focus).toHaveBeenCalledOnce()
  })

  it('keeps the longer Partner navigation behind the mobile menu until 1280px', () => {
    state.pathname = '/for/partner'
    const header = SiteHeader()
    const elements = descendants(header)
    const desktopNav = elements.find((element) => element.props['aria-label'] === 'Main navigation')
    const mobileButtonWrap = elements.find((element) =>
      String(element.props.className).includes('xl:hidden') && element.props['aria-label'] === undefined &&
      descendants(element).some((child) => child.props['aria-controls'] === 'mobile-nav'))
    const links = (desktopNav?.props.children as Element[][])[0]

    expect(links.map((element) => element.props.href)).toEqual([
      '#mqs-setup', '#partner-support', '#data-partnership', '#results',
    ])
    expect(content(desktopNav)).toContain('How we work together')
    expect(desktopNav?.props.className).toContain('xl:flex')
    expect(mobileButtonWrap?.props.className).toContain('xl:hidden')
    state.locale = 'de'
    state.hookIndex = 0
    state.effects = []
    const germanNav = descendants(SiteHeader()).find((element) => element.props['aria-label'] === 'Hauptnavigation')
    expect(content(germanNav)).toContain('Was wir mitbringen')
    expect(content(germanNav)).toContain('Unsere Zusammenarbeit')
    expect(content(germanNav)).toContain('Datenpartnerschaft')
    expect(content(germanNav)).toContain('Ergebnisse')
    state.locale = 'en'
    state.hookIndex = 0
    state.effects = []
    expect(headerHarness().mediaQuery).toBe('(min-width: 1280px)')
  })

  it('observes the Partner sections named by the navigation links', () => {
    state.pathname = '/for/partner'
    const ids: string[] = []
    vi.stubGlobal('document', {
      getElementById: (id: string) => { ids.push(id); return { id } },
    })
    vi.stubGlobal('IntersectionObserver', class {
      observe() { /* only the queried IDs matter here */ }
      disconnect() { /* no browser observer is started */ }
    })
    SiteHeader()
    state.effects[2]()
    expect(ids).toEqual(['mqs-setup', 'partner-support', 'data-partnership', 'results'])
  })

  it('preserves the existing Coach desktop breakpoint', () => {
    expect(headerHarness().mediaQuery).toBe('(min-width: 1024px)')
  })
})

describe('readable loading feedback', () => {
  it.each([
    ['en', 'Loading content'],
    ['de', 'Inhalt wird geladen'],
    [null, 'Loading content'],
  ] as const)('renders an accessible status with locale %s', (locale, label) => {
    state.view = 'loading'
    state.locale = locale
    const node = Loading()
    const ring = descendants(node).find((element) => element.props['aria-hidden'] === 'true')
    expect(node.props.role).toBe('status')
    expect(content(node)).toContain(label)
    expect(ring?.props.className).toContain('motion-reduce:animate-none')
  })
})

describe('concise success feedback', () => {
  it.each(['en', 'de'] as const)('states waitlist membership once in %s and retains the update confirmation caveat', (locale) => {
    state.view = 'waitlist'
    const text = content(AudienceWaitlistForm({ audience: 'coach', locale, cta: '', note: '' }))
    expect(text.match(locale === 'de' ? /Warteliste/g : /waitlist/g)).toHaveLength(1)
    expect(text).toContain(locale === 'de' ? 'sobald der Zugang verfügbar ist' : 'when access is available')
    expect(text).toContain(locale === 'de' ? 'nachdem du deine E Mail Adresse bestätigt hast' : 'after you confirm your email address')
  })

  it('uses natural English inquiry confirmation and retains the booking caveat', () => {
    state.view = 'inquiry'
    const text = content(AudienceInquiryForm({ audience: 'athlete', locale: 'en', cta: '', note: '' }))
    expect(text).toContain('Request received')
    expect(text).not.toContain('Your request is received')
    expect(text).toContain('not a confirmed booking')
  })
})

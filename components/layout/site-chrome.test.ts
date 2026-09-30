import { createElement, type ReactNode } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const state = vi.hoisted(() => ({
  pathname: '/for/coach',
  locale: 'en' as 'en' | 'de',
  gateState: 'open' as 'pending' | 'open' | 'dismissed',
  setLocale: vi.fn(),
  provider: vi.fn(),
}))

vi.mock('next/navigation', () => ({ usePathname: () => state.pathname }))
vi.mock('framer-motion', () => ({
  MotionConfig: ({ children }: { children: ReactNode }) => children,
}))
vi.mock('@/lib/locale', () => ({
  LocaleProvider: ({ children, initialLocale, hasLocalePreference }: {
    children: ReactNode
    initialLocale: string
    hasLocalePreference: boolean
  }) => {
    state.provider(initialLocale, hasLocalePreference)
    return children
  },
  useLocale: () => ({
    locale: state.locale,
    setLocale: state.setLocale,
    gateState: state.gateState,
  }),
}))
vi.mock('./SiteHeader', () => ({
  SiteHeader: () => createElement('header', { 'data-testid': 'site-header' }, 'Header'),
}))
vi.mock('./SiteFooter', () => ({
  SiteFooter: () => createElement('footer', { 'data-testid': 'site-footer' }, 'Footer'),
}))
vi.mock('./LanguageGate', () => ({
  LanguageGate: () => createElement('aside', { 'data-testid': 'language-gate' }, 'Language choice'),
}))
vi.mock('./CookieBanner', () => ({
  CookieBanner: () => createElement('aside', { 'data-testid': 'cookie-banner' }, 'Cookie choice'),
}))

import { SiteChrome } from './SiteChrome'
import { LanguageToggle } from './LanguageToggle'

beforeEach(() => {
  state.pathname = '/for/coach'
  state.locale = 'en'
  state.gateState = 'open'
  vi.clearAllMocks()
})

function renderChrome(initialLocale: 'en' | 'de' = 'en', hasLocalePreference = false) {
  const props = {
    initialLocale,
    hasLocalePreference,
    children: createElement('section', { 'data-testid': 'page-content' }, 'Page content'),
  }
  return renderToStaticMarkup(createElement(SiteChrome, props))
}

describe('public page chrome and dialog sequencing', () => {
  it.each([
    ['en', false],
    ['en', true],
    ['de', true],
  ] as const)('passes server locale %s and preference %s into the locale provider', (locale, hasPreference) => {
    renderChrome(locale, hasPreference)

    expect(state.provider).toHaveBeenCalledWith(locale, hasPreference)
  })

  it('shows only the language gate and makes the actual page background inert', () => {
    const html = renderChrome()

    expect(html).toContain('<div inert="">')
    expect(html).toMatch(/<div inert="">[\s\S]*data-testid="site-header"[\s\S]*id="main-content"[\s\S]*data-testid="page-content"[\s\S]*data-testid="site-footer"/)
    expect(html).toMatch(/<\/footer><\/div><aside data-testid="language-gate"/)
    expect(html).not.toContain('data-testid="cookie-banner"')
  })

  it('shows consent after the language gate is dismissed and releases the background', () => {
    state.gateState = 'dismissed'
    const html = renderChrome()

    expect(html).toContain('data-testid="cookie-banner"')
    expect(html).not.toContain('data-testid="language-gate"')
    expect(html).not.toMatch(/\sinert(?:=|\s|>)/)
    expect(html).toContain('id="main-content" tabindex="-1"')
  })

  it('does not show either dialog while the saved language is being resolved', () => {
    state.gateState = 'pending'
    const html = renderChrome()

    expect(html).not.toContain('data-testid="language-gate"')
    expect(html).not.toContain('data-testid="cookie-banner"')
    expect(html).toContain('data-testid="page-content"')
  })

  it.each(['pending', 'open', 'dismissed'] as const)(
    'keeps the root role selection free of the language gate in the %s state',
    (gateState) => {
      state.pathname = '/'
      state.gateState = gateState
      const html = renderChrome()

      expect(html).toContain('id="main-content"')
      expect(html).toContain('data-testid="page-content"')
      expect(html).toContain('data-testid="cookie-banner"')
      expect(html).not.toContain('data-testid="language-gate"')
      expect(html).not.toContain('data-testid="site-header"')
      expect(html).not.toContain('data-testid="site-footer"')
      expect(html).not.toMatch(/\sinert(?:=|\s|>)/)
    },
  )

  it.each(['/studio', '/studio/structure'])('bypasses public chrome for %s', (pathname) => {
    state.pathname = pathname
    const html = renderChrome()

    expect(html).toBe('<section data-testid="page-content">Page content</section>')
    expect(state.provider).not.toHaveBeenCalled()
  })
})

describe('language toggle semantics', () => {
  it.each([
    ['en', 'Language', 'true', 'false'],
    ['de', 'Sprache', 'false', 'true'],
  ] as const)('uses native toggle buttons with the correct %s pressed state', (locale, label, enPressed, dePressed) => {
    state.locale = locale
    const html = renderToStaticMarkup(createElement(LanguageToggle))
    const buttons = html.match(/<button\b[\s\S]*?<\/button>/g)

    expect(html).toContain(`role="group" aria-label="${label}"`)
    expect(html).not.toMatch(/role="(?:radio|radiogroup)"/)
    expect(html).not.toContain('aria-checked')
    expect(buttons).toHaveLength(2)
    expect(buttons?.[0]).toContain(`aria-pressed="${enPressed}"`)
    expect(buttons?.[0]).toMatch(/>EN<\/span>/)
    expect(buttons?.[1]).toContain(`aria-pressed="${dePressed}"`)
    expect(buttons?.[1]).toMatch(/>DE<\/span>/)
    expect(html).not.toContain('>GER<')
    expect(buttons?.every((button) => button.includes('type="button"'))).toBe(true)
  })

  it('selects the language associated with each native button', () => {
    const toggle = LanguageToggle({})
    const buttons = toggle.props.children

    buttons[0].props.onClick()
    buttons[1].props.onClick()

    expect(state.setLocale).toHaveBeenNthCalledWith(1, 'en')
    expect(state.setLocale).toHaveBeenNthCalledWith(2, 'de')
  })
})

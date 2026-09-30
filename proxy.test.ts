import { createElement, type ReactNode } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { NextRequest } from 'next/server'
// Next 16.3.4 still exports the matcher test helper under its legacy name.
import { unstable_doesMiddlewareMatch as doesProxyMatch } from 'next/experimental/testing/server'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { proxy, config } from './proxy'

const runtime = vi.hoisted(() => ({ requestHeaders: new Headers() }))
vi.mock('next/headers', () => ({ headers: async () => runtime.requestHeaders }))
vi.mock('next/font/local', () => ({ default: () => ({ variable: 'test-font' }) }))
vi.mock('@/components/layout/SiteChrome', async () => {
  const { createElement } = await import('react')
  const { LocaleProvider } = await import('@/lib/locale')
  return {
    SiteChrome: (props: {
      children: ReactNode
      initialLocale: 'en' | 'de'
      hasLocalePreference: boolean
    }) => createElement(LocaleProvider, props),
  }
})

import RootLayout from './app/layout'
import { useLocale, useOptionalLocale } from './lib/locale'

beforeEach(() => {
  runtime.requestHeaders = new Headers()
})

function resolve(url: string, headers?: HeadersInit) {
  const response = proxy(new NextRequest(`https://vanescience.com${url}`, { headers }))
  runtime.requestHeaders = new Headers({
    'x-vane-locale': response.headers.get('x-middleware-request-x-vane-locale') ?? '',
    'x-vane-locale-chosen': response.headers.get('x-middleware-request-x-vane-locale-chosen') ?? '',
  })
  return response
}

function LocaleProbe() {
  const { locale, gateState } = useLocale()
  return createElement('p', { 'data-gate': gateState }, locale === 'de' ? 'Deutscher Inhalt' : 'English content')
}

describe('server-selected functional language preference', () => {
  it.each(['/for/not-a-role', '/for/COACH', '/for/%zz'])('returns a real 404 before streaming for %s', (url) => {
    const response = resolve(url)
    expect(response.status).toBe(404)
    expect(new URL(response.headers.get('x-middleware-rewrite')!).pathname).toBe('/_not-found')
    expect(response.headers.get('x-robots-tag')).toBe('noindex')
  })

  it.each(['/for/athlete', '/for/coach', '/for/partner', '/for/coach/'])('does not rewrite a valid audience %s', (url) => {
    expect(resolve(url).headers.get('x-middleware-rewrite')).toBeNull()
  })

  it.each([
    ['/for/coach?lang=de', 'vane-lang=en', 'de'],
    ['/for/coach?lang=en', 'vane-lang=de', 'en'],
    ['/team?lang=fr', 'vane-lang=de', 'de'],
    ['/team?lang=DE', 'vane-lang=en', 'en'],
    ['/team', 'vane-lang=de', 'de'],
  ])('resolves validated query before cookie for %s / %s', (url, cookie, expected) => {
    resolve(url, { cookie })
    expect(runtime.requestHeaders.get('x-vane-locale')).toBe(expected)
    expect(runtime.requestHeaders.get('x-vane-locale-chosen')).toBe('1')
  })

  it.each(['', 'fr', 'DE', 'undefined', '%3Cscript%3E'])('rejects invalid cookie %s and preserves first-visit choice', (cookie) => {
    resolve('/team?lang=invalid', { cookie: `vane-lang=${cookie}` })
    expect(runtime.requestHeaders.get('x-vane-locale')).toBe('en')
    expect(runtime.requestHeaders.get('x-vane-locale-chosen')).toBe('0')
  })

  it('overwrites injected render headers instead of trusting them', () => {
    resolve('/team', { 'x-vane-locale': 'de', 'x-vane-locale-chosen': '1' })
    expect(runtime.requestHeaders.get('x-vane-locale')).toBe('en')
    expect(runtime.requestHeaders.get('x-vane-locale-chosen')).toBe('0')
    resolve('/team?lang=de', { 'x-vane-locale': 'en', 'x-vane-locale-chosen': '0' })
    expect(runtime.requestHeaders.get('x-vane-locale')).toBe('de')
    expect(runtime.requestHeaders.get('x-vane-locale-chosen')).toBe('1')
  })

  it('stores only an explicit valid query as a functional first-party cookie', () => {
    const response = resolve('/team?lang=de')
    expect(response.cookies.get('vane-lang')).toMatchObject({
      value: 'de', path: '/', maxAge: 31536000, sameSite: 'lax', secure: true,
    })
    expect(resolve('/team?lang=fr').headers.get('set-cookie')).toBeNull()
  })

  it.each([
    ['/for/coach?lang=de', undefined],
    ['/for/partner', 'vane-lang=de'],
  ])('renders German HTML and provider content before hydration for %s', async (url, cookie) => {
    resolve(url, cookie ? { cookie } : undefined)
    const html = renderToStaticMarkup(await RootLayout({ children: createElement(LocaleProbe) }))
    expect(html).toContain('<html lang="de"')
    expect(html).toContain('Deutscher Inhalt')
    expect(html).toContain('data-gate="dismissed"')
    expect(html).not.toContain('English content')
  })

  it('renders English initially without suppressing the new-visitor language gate', async () => {
    resolve('/team')
    const html = renderToStaticMarkup(await RootLayout({ children: createElement(LocaleProbe) }))
    expect(html).toContain('<html lang="en"')
    expect(html).toContain('English content')
    expect(html).toContain('data-gate="pending"')
  })

  it('exposes an optional context for error pages outside the site provider', () => {
    function OutsideProvider() {
      return createElement('p', null, useOptionalLocale()?.locale ?? 'safe fallback')
    }
    expect(renderToStaticMarkup(createElement(OutsideProvider))).toContain('safe fallback')
  })

  it.each(['/', '/team', '/for/coach', '/for/partner?lang=de', '/not-a-page'])('includes public HTML route %s', (url) => {
    expect(doesProxyMatch({ config, nextConfig: {}, url })).toBe(true)
  })

  it.each([
    '/api/waitlist', '/api/internal/lead-delivery', '/_next/static/app.js',
    '/_next/image?url=poster.jpg', '/media/clip.mp4', '/audiences/photo.webp',
    '/studio', '/studio/structure', '/sitemap.xml', '/robots.txt',
    '/opengraph-image', '/twitter-image', '/icon.svg',
  ])('excludes service or asset route %s', (url) => {
    expect(doesProxyMatch({ config, nextConfig: {}, url })).toBe(false)
  })
})

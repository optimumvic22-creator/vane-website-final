import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { ErrorBoundaryHandler } from 'next/dist/client/components/error-boundary'
import { afterEach, describe, expect, it, vi } from 'vitest'

const language = vi.hoisted(() => ({ value: { locale: 'en' } as { locale: string } | null }))
vi.mock('@/lib/locale', () => ({ useOptionalLocale: () => language.value }))

import ErrorPage from './error'

afterEach(() => {
  language.value = { locale: 'en' }
  vi.restoreAllMocks()
})

describe('route error recovery', () => {
  it.each([
    ['en', 'Something Went Wrong', 'Try Again'],
    ['de', 'Etwas ist schiefgelaufen', 'Erneut versuchen'],
  ])('renders the %s fallback without exposing error details', (locale, heading, action) => {
    language.value = { locale }
    const html = renderToStaticMarkup(createElement(ErrorPage, {
      error: new Error('sensitive failure details'),
      retry: vi.fn(),
    }))
    expect(html).toContain(heading)
    expect(html).toContain(action)
    expect(html).not.toContain('sensitive failure details')
    expect(html.match(/<h1\b/g)).toHaveLength(1)
  })

  it('keeps the Studio error fallback usable outside LocaleProvider', () => {
    language.value = null
    const html = renderToStaticMarkup(createElement(ErrorPage, {
      error: new Error('Studio failure'),
      retry: vi.fn(),
    }))
    expect(html).toContain('Something Went Wrong')
    expect(html).toContain('Try Again')
  })

  it('wires the action to the installed Next retry, which refreshes server content', () => {
    const refresh = vi.fn()
    const boundary = new ErrorBoundaryHandler({
      pathname: '/team',
      errorComponent: ErrorPage,
      children: null,
    })
    boundary.context = {
      back: vi.fn(),
      forward: vi.fn(),
      refresh,
      push: vi.fn(),
      replace: vi.fn(),
      prefetch: vi.fn(),
      bfcacheId: 'team-recovery-test',
    }
    const clearError = vi.spyOn(boundary, 'setState').mockImplementation(() => undefined)
    const view = ErrorPage({ error: new Error('temporary failure'), retry: boundary.retry })
    const action = view.props.children.props.children[2]

    expect(action.props.onClick).toBe(boundary.retry)
    action.props.onClick()
    expect(refresh).toHaveBeenCalledOnce()
    expect(clearError).toHaveBeenCalledWith({ error: null })
  })
})

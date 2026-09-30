import { NextResponse, type NextRequest } from 'next/server'
import { isAudienceSlug } from '@/lib/audience-content'

export function proxy(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('lang')
  const cookie = request.cookies.get('vane-lang')?.value
  const requested = query === 'en' || query === 'de' ? query : null
  const saved = cookie === 'en' || cookie === 'de' ? cookie : null
  const locale = requested ?? saved ?? 'en'
  const requestHeaders = new Headers(request.headers)

  // Never accept client-supplied values for our internal render contract.
  requestHeaders.set('x-vane-locale', locale)
  requestHeaders.set('x-vane-locale-chosen', requested || saved ? '1' : '0')
  const audiencePath = request.nextUrl.pathname.match(/^\/for\/([^/]+)\/?$/)
  let invalidAudience = false
  if (audiencePath) {
    try {
      invalidAudience = !isAudienceSlug(decodeURIComponent(audiencePath[1]))
    } catch {
      invalidAudience = true
    }
  }
  // Decide the status before the language-aware layout starts streaming.
  const notFoundUrl = request.nextUrl.clone()
  notFoundUrl.pathname = '/_not-found'
  const response = invalidAudience
    ? NextResponse.rewrite(notFoundUrl, { status: 404, request: { headers: requestHeaders } })
    : NextResponse.next({ request: { headers: requestHeaders } })
  if (invalidAudience) response.headers.set('x-robots-tag', 'noindex')

  if (requested) {
    response.cookies.set('vane-lang', requested, {
      path: '/',
      maxAge: 31536000,
      sameSite: 'lax',
      secure: request.nextUrl.protocol === 'https:',
    })
  }
  return response
}

export const config = {
  matcher: [
    '/((?!api(?:/|$)|_next(?:/|$)|media(?:/|$)|audiences(?:/|$)|studio(?:/|$)|opengraph-image(?:/|$)|twitter-image(?:/|$)|.*\\.[^/]+$).*)',
  ],
}

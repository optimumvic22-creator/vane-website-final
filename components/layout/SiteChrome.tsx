'use client'

import { usePathname } from 'next/navigation'
import dynamic from 'next/dynamic'
import { useEffect, useRef } from 'react'
import { MotionConfig } from 'framer-motion'
import { LocaleProvider, useLocale, type Locale } from '@/lib/locale'
import { setMotionPaused, useMotionPaused } from '@/lib/motion-preference'
import { CookieBanner } from './CookieBanner'
import { LanguageGate } from './LanguageGate'

// Entry and Studio do not need the public-page header/footer. Retain SSR while
// loading these modules only on routes that render them. The first-visit language
// dialog stays eager so an inert page never has to wait for its controls to load.
const SiteHeader = dynamic(() => import('./SiteHeader').then((module) => module.SiteHeader))
const SiteFooter = dynamic(() => import('./SiteFooter').then((module) => module.SiteFooter))

function SiteChromeInner({
  children,
  isAudienceEntry,
  isPartnerPage,
}: {
  children: React.ReactNode
  isAudienceEntry: boolean
  isPartnerPage: boolean
}) {
  const { gateState, dismissGate } = useLocale()
  const mainRef = useRef<HTMLElement>(null)
  const previousGateState = useRef(gateState)
  const languageDialogOpen = !isAudienceEntry && !isPartnerPage && gateState === 'open'

  useEffect(() => {
    if (isPartnerPage && gateState === 'open') {
      dismissGate()
    }
  }, [dismissGate, gateState, isPartnerPage])

  useEffect(() => {
    if (!isPartnerPage && previousGateState.current === 'open' && gateState === 'dismissed') {
      mainRef.current?.focus({ preventScroll: true })
    }
    previousGateState.current = gateState
  }, [gateState, isPartnerPage])

  if (isAudienceEntry) {
    return (
      <>
        <main id="main-content">{children}</main>
        <CookieBanner />
      </>
    )
  }

  return (
    <>
      <div inert={languageDialogOpen || undefined}>
        <SiteHeader />
        <main ref={mainRef} id="main-content" tabIndex={-1} className="pt-16 outline-none">
          {children}
        </main>
        <SiteFooter />
      </div>
      {languageDialogOpen && <LanguageGate />}
      {gateState === 'dismissed' && <CookieBanner />}
    </>
  )
}

export function SiteChrome({
  children,
  initialLocale,
  hasLocalePreference,
}: {
  children: React.ReactNode
  initialLocale: Locale
  hasLocalePreference: boolean
}) {
  const pathname = usePathname()
  const motionPaused = useMotionPaused()

  useEffect(() => {
    // The global pause control has been removed; clear older session choices.
    setMotionPaused(false)
  }, [])

  if (pathname.startsWith('/studio')) {
    return <>{children}</>
  }

  return (
    <MotionConfig reducedMotion={motionPaused ? 'always' : 'user'}>
      <LocaleProvider initialLocale={initialLocale} hasLocalePreference={hasLocalePreference}>
        <SiteChromeInner isAudienceEntry={pathname === '/'} isPartnerPage={pathname === '/for/partner'}>
          {children}
        </SiteChromeInner>
      </LocaleProvider>
    </MotionConfig>
  )
}

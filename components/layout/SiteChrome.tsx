'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { MotionConfig } from 'framer-motion'
import { LocaleProvider, useLocale, type Locale } from '@/lib/locale'
import { setMotionPaused, useMotionPaused } from '@/lib/motion-preference'
import { SiteHeader } from './SiteHeader'
import { SiteFooter } from './SiteFooter'
import { CookieBanner } from './CookieBanner'
import { LanguageGate } from './LanguageGate'

function SiteChromeInner({
  children,
  isAudienceEntry,
}: {
  children: React.ReactNode
  isAudienceEntry: boolean
}) {
  const { gateState } = useLocale()
  const mainRef = useRef<HTMLElement>(null)
  const previousGateState = useRef(gateState)
  const languageDialogOpen = !isAudienceEntry && gateState === 'open'

  useEffect(() => {
    if (previousGateState.current === 'open' && gateState === 'dismissed') {
      mainRef.current?.focus({ preventScroll: true })
    }
    previousGateState.current = gateState
  }, [gateState])

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
        <SiteChromeInner isAudienceEntry={pathname === '/'}>{children}</SiteChromeInner>
      </LocaleProvider>
    </MotionConfig>
  )
}

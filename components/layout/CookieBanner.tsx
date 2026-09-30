'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { SPRING_SLOW } from '@/lib/motion'
import { useLocale } from '@/lib/locale'
import {
  CONSENT_SETTINGS_EVENT,
  getConsent,
  setConsent,
  loadAnalytics,
  syncConsentFromStorage,
  type ConsentValue,
} from '@/lib/analytics'
import { Button } from '@/components/ui/button'

export function CookieBanner() {
  const [visible, setVisible] = useState(false)
  const { locale } = useLocale()

  useEffect(() => {
    // Consent lives in localStorage, so it can only be read after mount.
    const consent = getConsent()
    if (!consent) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVisible(true)
    } else {
      // Returning visitor who already accepted analytics.
      loadAnalytics()
    }

    const openSettings = () => setVisible(true)
    const synchronizeConsent = (event: StorageEvent) => {
      if (syncConsentFromStorage(event)) setVisible(getConsent() === null)
    }
    window.addEventListener(CONSENT_SETTINGS_EVENT, openSettings)
    window.addEventListener('storage', synchronizeConsent)
    return () => {
      window.removeEventListener(CONSENT_SETTINGS_EVENT, openSettings)
      window.removeEventListener('storage', synchronizeConsent)
    }
  }, [])

  const handleConsent = (value: ConsentValue) => {
    setConsent(value)
    setVisible(false)
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={SPRING_SLOW}
          role="dialog"
          aria-modal="false"
          aria-label={locale === 'de' ? 'Cookie-Einwilligung' : 'Cookie consent'}
          className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/20 bg-card/95 p-4 backdrop-blur-md md:p-6"
        >
          <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 md:flex-row md:justify-between">
            <p className="text-sm text-muted-foreground">
              {locale === 'de'
                ? 'Wir verwenden technisch notwendige Cookies. Mit deiner Zustimmung nutzen wir zusätzlich anonymisierte Analytics, um die Seite zu verbessern. Keine Werbung, kein Datenverkauf.'
                : 'We use technically necessary cookies. With your consent, we also use anonymized analytics to improve the site. No ads, no selling data.'}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link href="/privacy" className="text-sm text-muted-foreground underline hover:text-foreground">
                {locale === 'de' ? 'Datenschutz' : 'Privacy policy'}
              </Link>
              <Button size="sm" variant="outline" onClick={() => handleConsent('essential')}>
                {locale === 'de' ? 'Nur essenziell' : 'Essential only'}
              </Button>
              <Button size="sm" onClick={() => handleConsent('all')}>
                {locale === 'de' ? 'Alle akzeptieren' : 'Accept all'}
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

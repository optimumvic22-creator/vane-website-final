'use client'

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'

export type Locale = 'en' | 'de'

interface LocaleContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  gateState: 'pending' | 'open' | 'dismissed'
  dismissGate: () => void
  openGate: () => void
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

const LANG_KEY = 'vane-lang'
const LEGACY_LANG_KEY = 'vide-lang'

/** Read the saved language, migrating the legacy key one time. */
function getSavedLang(): string | null {
  try {
    let saved = localStorage.getItem(LANG_KEY)
    if (!saved) {
      const legacy = localStorage.getItem(LEGACY_LANG_KEY)
      if (legacy) {
        saved = legacy
        try {
          localStorage.setItem(LANG_KEY, legacy)
          localStorage.removeItem(LEGACY_LANG_KEY)
        } catch {
          // A read-only store must not discard an existing language choice.
        }
      }
    }
    return saved
  } catch {
    return null
  }
}

function saveLang(locale: Locale) {
  try {
    localStorage.setItem(LANG_KEY, locale)
  } catch {
    // The provider state keeps language selection usable without persistence.
  }
  try {
    // Functional preference only; readable on the next server-rendered request.
    const secure = window.location.protocol === 'https:' ? '; Secure' : ''
    document.cookie = `${LANG_KEY}=${locale}; Path=/; Max-Age=31536000; SameSite=Lax${secure}`
  } catch {
    // Cookie restrictions must not prevent an in-memory language change.
  }
}

export function LocaleProvider({
  children,
  initialLocale = 'en',
  hasLocalePreference = false,
}: {
  children: ReactNode
  initialLocale?: Locale
  hasLocalePreference?: boolean
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale)
  const [gateState, setGateState] = useState<'pending' | 'open' | 'dismissed'>(
    hasLocalePreference ? 'dismissed' : 'pending',
  )

  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  useEffect(() => {
    if (hasLocalePreference) {
      saveLang(initialLocale)
      return
    }

    // One-time migration for visitors predating the functional language cookie.
    // New choices and explicit ?lang= links already render in the correct locale.
    const saved = getSavedLang()
    if (saved === 'en' || saved === 'de') {
      saveLang(saved)
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLocaleState(saved)
      setGateState('dismissed')
    } else {
      setGateState('open')
    }
  }, [hasLocalePreference, initialLocale])

  useEffect(() => {
    const syncHistoryLocale = () => {
      const requested = new URL(window.location.href).searchParams.get('lang')
      if (requested !== 'en' && requested !== 'de') return
      setLocaleState(requested)
      saveLang(requested)
      setGateState('dismissed')
    }
    window.addEventListener('popstate', syncHistoryLocale)
    return () => window.removeEventListener('popstate', syncHistoryLocale)
  }, [])

  const setLocale = useCallback((lang: Locale) => {
    setLocaleState(lang)
    saveLang(lang)
    try {
      // Explicit ?lang= links take precedence over the saved preference on the
      // server. Keep that link in sync so reload/share cannot undo the choice.
      const url = new URL(window.location.href)
      url.searchParams.set('lang', lang)
      // Next preserves its router state through the public history integration.
      window.history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`)
    } catch {
      // Restricted history APIs must not prevent the in-memory language change.
    }
  }, [])

  const dismissGate = useCallback(() => setGateState('dismissed'), [])
  const openGate = useCallback(() => setGateState('open'), [])

  return (
    <LocaleContext.Provider value={{ locale, setLocale, gateState, dismissGate, openGate }}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useOptionalLocale() {
  return useContext(LocaleContext)
}

export function useLocale() {
  const ctx = useOptionalLocale()
  if (!ctx) throw new Error('useLocale must be used within LocaleProvider')
  return ctx
}

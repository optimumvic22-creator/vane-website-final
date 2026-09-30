'use client'

/**
 * Consent-gated GA4 helper.
 *
 * The gtag script is only injected after the visitor accepts analytics in the
 * cookie banner ("accept all"). If NEXT_PUBLIC_GA_MEASUREMENT_ID is unset,
 * nothing is ever loaded and all calls are no-ops.
 */

export const CONSENT_KEY = 'vane-cookie-consent'
export const CONSENT_SETTINGS_EVENT = 'vane:open-cookie-settings'
const LEGACY_CONSENT_KEY = 'vide-cookie-consent'

export type ConsentValue = 'essential' | 'all'

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
// undefined reads persistence; null explicitly means consent was removed.
// Failed writes and cross-tab denials must override older persisted choices.
let sessionConsent: ConsentValue | null | undefined

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

/** Read stored consent, migrating the legacy key one time. */
export function getConsent(): ConsentValue | null {
  if (typeof window === 'undefined') return null
  if (sessionConsent !== undefined) return sessionConsent
  try {
    if (typeof localStorage === 'undefined') return null
    let value = localStorage.getItem(CONSENT_KEY)
    if (!value) {
      const legacy = localStorage.getItem(LEGACY_CONSENT_KEY)
      if (legacy) {
        value = legacy
        try {
          localStorage.setItem(CONSENT_KEY, legacy)
          localStorage.removeItem(LEGACY_CONSENT_KEY)
        } catch {
          // The saved choice is still readable even when migration is denied.
        }
      }
    }
    return value === 'essential' || value === 'all' ? value : null
  } catch {
    return null
  }
}

export function setConsent(value: ConsentValue) {
  if (typeof window === 'undefined') return
  sessionConsent = value
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(CONSENT_KEY, value)
      // Keep observing stored changes from other tabs when persistence works.
      sessionConsent = undefined
    }
  } catch {
    // Apply the choice for this page even if it cannot survive a reload.
  }
  if (value === 'all') {
    loadAnalytics()
  } else {
    revokeAnalytics()
  }
}

export function hasAnalyticsConsent(): boolean {
  return getConsent() === 'all'
}

/** Apply cross-tab denial/removal only. A grant never starts or resumes tracking. */
export function syncConsentFromStorage(
  event: Pick<StorageEvent, 'key' | 'newValue' | 'storageArea'> & { oldValue?: string | null },
): boolean {
  if (typeof window === 'undefined' ||
      (event.key !== null && event.key !== CONSENT_KEY && event.key !== LEGACY_CONSENT_KEY)) {
    return false
  }

  try {
    if (event.storageArea && event.storageArea !== localStorage) return false
    // Migration removes the legacy key after writing the current one. That
    // cleanup must not revoke a still-valid choice under the current key.
    if (event.key === LEGACY_CONSENT_KEY) {
      const current = localStorage.getItem(CONSENT_KEY)
      if (current === 'all' || current === 'essential') return false
    }
  } catch {
    // A denied storage getter/read must not prevent honoring withdrawal.
  }

  if (event.key !== null && event.newValue === 'all') {
    // Preserve this page's previous effective choice even if the banner later
    // remounts during navigation. Only setConsent('all') can raise permission.
    if (sessionConsent === undefined) {
      sessionConsent = event.oldValue === 'all' || event.oldValue === 'essential'
        ? event.oldValue : null
    }
    return false
  }
  sessionConsent = event.key !== null && event.newValue === 'essential' ? 'essential' : null
  revokeAnalytics()
  return true
}

let loaded = false

function setAnalyticsDisabled(disabled: boolean) {
  if (!GA_ID || typeof window === 'undefined') return
  const analyticsWindow = window as unknown as Record<string, unknown>
  analyticsWindow[`ga-disable-${GA_ID}`] = disabled
}

function removeAnalyticsCookies() {
  if (typeof document === 'undefined') return

  const names = document.cookie
    .split(';')
    .map((cookie) => cookie.split('=')[0]?.trim())
    .filter((name): name is string => Boolean(name && /^_ga(?:_|$)/.test(name)))

  const hostname = typeof window === 'undefined' ? '' : window.location.hostname
  const domainParts = hostname.split('.').filter(Boolean)
  const domains = domainParts.length > 1
    ? [hostname, `.${hostname}`, `.${domainParts.slice(-2).join('.')}`]
    : []

  for (const name of names) {
    document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax`
    for (const domain of domains) {
      document.cookie = `${name}=; Max-Age=0; path=/; domain=${domain}; SameSite=Lax`
    }
  }
}

/** Disable future analytics calls and remove first-party GA cookies where possible. */
export function revokeAnalytics() {
  if (typeof window === 'undefined') return
  setAnalyticsDisabled(true)
  try {
    removeAnalyticsCookies()
  } catch {
    // Restricted cookie access must not prevent disabling analytics.
  }
}

/** Inject the GA4 script only with consent and a configured measurement ID. */
export function loadAnalytics() {
  if (typeof window === 'undefined') return
  if (!GA_ID || !hasAnalyticsConsent()) return
  setAnalyticsDisabled(false)
  if (loaded) return
  loaded = true

  window.dataLayer = window.dataLayer || []
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer?.push(args)
  }
  window.gtag('js', new Date())
  window.gtag('config', GA_ID, { anonymize_ip: true })

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
  document.head.appendChild(script)
}

/** Fire a GA4 event. No-op without consent or measurement ID. */
export function trackEvent(name: string, params?: Record<string, string | number | boolean>) {
  try {
    if (!GA_ID || typeof window === 'undefined' || !hasAnalyticsConsent() || !window.gtag) return
    window.gtag('event', name, params)
  } catch {
    // Optional analytics must never turn a saved request into a visible failure
    // or encourage a duplicate submission. Do not log contact-event payloads.
  }
}

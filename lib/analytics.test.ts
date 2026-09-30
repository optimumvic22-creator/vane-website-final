import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const CONSENT_KEY = 'vane-cookie-consent'
const GA_ID = 'G-TEST123'

function stubBrowser(consent: string | null = null) {
  const values = new Map<string, string>()
  if (consent !== null) values.set(CONSENT_KEY, consent)
  const storage = {
    getItem: vi.fn((key: string) => values.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => { values.set(key, value) }),
    removeItem: vi.fn((key: string) => { values.delete(key) }),
  }
  const browser: Record<string, unknown> = {
    gtag: vi.fn(),
    location: { hostname: 'www.vanescience.com' },
  }
  const document = {
    cookie: '',
    createElement: vi.fn(() => ({})),
    head: { appendChild: vi.fn() },
  }
  vi.stubGlobal('localStorage', storage)
  vi.stubGlobal('window', browser)
  vi.stubGlobal('document', document)
  return { storage, browser, document, values }
}

function denyStorageGetter() {
  // stubGlobal records the original descriptor for afterEach restoration.
  vi.stubGlobal('localStorage', undefined)
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    get: () => { throw new DOMException('Storage denied', 'SecurityError') },
  })
}

beforeEach(() => {
  vi.resetModules()
  vi.stubEnv('NEXT_PUBLIC_GA_MEASUREMENT_ID', GA_ID)
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.unstubAllEnvs()
  vi.clearAllMocks()
})

describe('analytics consent guard', () => {
  it('is safe during SSR without retaining a server-side consent choice', async () => {
    const { getConsent, setConsent, trackEvent } = await import('./analytics')
    expect(() => setConsent('all')).not.toThrow()
    expect(() => trackEvent('waitlist_submit')).not.toThrow()
    expect(getConsent()).toBeNull()
    stubBrowser()
    expect(getConsent()).toBeNull()
  })

  it.each([null, 'invalid', 'essential'])('does not track with consent %s', async (consent) => {
    const { browser, document } = stubBrowser(consent)
    const { loadAnalytics, trackEvent } = await import('./analytics')
    loadAnalytics()
    trackEvent('waitlist_submit', { segment: 'individual' })
    expect(browser.gtag).not.toHaveBeenCalled()
    expect(document.head.appendChild).not.toHaveBeenCalled()
  })

  it('fires an event when stored consent permits analytics', async () => {
    const { browser } = stubBrowser('all')
    const { trackEvent } = await import('./analytics')
    trackEvent('waitlist_submit', { segment: 'federation' })
    expect(browser.gtag).toHaveBeenCalledExactlyOnceWith('event', 'waitlist_submit', { segment: 'federation' })
  })

  it('does not load or track without a measurement ID', async () => {
    vi.stubEnv('NEXT_PUBLIC_GA_MEASUREMENT_ID', '')
    const { browser, document } = stubBrowser('all')
    const { loadAnalytics, trackEvent } = await import('./analytics')
    loadAnalytics()
    trackEvent('waitlist_submit')
    expect(browser.gtag).not.toHaveBeenCalled()
    expect(document.head.appendChild).not.toHaveBeenCalled()
  })

  it('does not interrupt a completed submission when the analytics provider throws', async () => {
    const { browser } = stubBrowser('all')
    browser.gtag = vi.fn(() => { throw new Error('Provider unavailable') })
    const { trackEvent } = await import('./analytics')
    expect(() => trackEvent('audience_inquiry_submit', { audience: 'athlete' })).not.toThrow()
  })

  it('fails closed when accessing the storage property throws', async () => {
    const { browser, document } = stubBrowser()
    denyStorageGetter()
    const { getConsent, loadAnalytics, trackEvent } = await import('./analytics')
    expect(getConsent()).toBeNull()
    expect(() => loadAnalytics()).not.toThrow()
    expect(() => trackEvent('waitlist_submit')).not.toThrow()
    expect(browser.gtag).not.toHaveBeenCalled()
    expect(document.head.appendChild).not.toHaveBeenCalled()
  })

  it('fails closed when reading a storage item throws', async () => {
    const { storage, browser } = stubBrowser('all')
    storage.getItem.mockImplementation(() => { throw new Error('Read denied') })
    const { getConsent, trackEvent } = await import('./analytics')
    expect(getConsent()).toBeNull()
    expect(() => trackEvent('waitlist_submit')).not.toThrow()
    expect(browser.gtag).not.toHaveBeenCalled()
  })

  it('applies withdrawal even when the old stored acceptance cannot be overwritten', async () => {
    const { storage, browser, document, values } = stubBrowser('all')
    storage.setItem.mockImplementation(() => { throw new Error('Write denied') })
    const { getConsent, setConsent, loadAnalytics, trackEvent } = await import('./analytics')

    expect(() => setConsent('essential')).not.toThrow()
    loadAnalytics()
    trackEvent('waitlist_submit')

    expect(values.get(CONSENT_KEY)).toBe('all')
    expect(getConsent()).toBe('essential')
    expect(browser[`ga-disable-${GA_ID}`]).toBe(true)
    expect(browser.gtag).not.toHaveBeenCalled()
    expect(document.head.appendChild).not.toHaveBeenCalled()
  })

  it('keeps new consent and withdrawal usable when the storage getter is denied', async () => {
    const { browser, document } = stubBrowser()
    denyStorageGetter()
    const { getConsent, setConsent, loadAnalytics, trackEvent } = await import('./analytics')

    expect(() => setConsent('all')).not.toThrow()
    loadAnalytics()
    trackEvent('waitlist_submit')
    expect(getConsent()).toBe('all')
    expect(browser[`ga-disable-${GA_ID}`]).toBe(false)
    expect(document.head.appendChild).toHaveBeenCalledTimes(1)
    expect(browser.dataLayer).toContainEqual(['event', 'waitlist_submit', undefined])

    expect(() => setConsent('essential')).not.toThrow()
    const previousEvents = [...browser.dataLayer as unknown[]]
    trackEvent('waitlist_submit')
    expect(getConsent()).toBe('essential')
    expect(browser[`ga-disable-${GA_ID}`]).toBe(true)
    expect(browser.dataLayer).toEqual(previousEvents)

    setConsent('all')
    expect(browser[`ga-disable-${GA_ID}`]).toBe(false)
    expect(document.head.appendChild).toHaveBeenCalledTimes(1)
  })

  it.each(['get', 'set'])('still disables analytics when cookie %s access is denied', async (access) => {
    const { browser, document } = stubBrowser('all')
    Object.defineProperty(document, 'cookie', {
      configurable: true,
      get: () => {
        if (access === 'get') throw new Error('Cookies denied')
        return '_ga=123'
      },
      set: () => { throw new Error('Cookies denied') },
    })
    const { getConsent, setConsent, trackEvent } = await import('./analytics')
    expect(() => setConsent('essential')).not.toThrow()
    trackEvent('waitlist_submit')
    expect(getConsent()).toBe('essential')
    expect(browser[`ga-disable-${GA_ID}`]).toBe(true)
    expect(browser.gtag).not.toHaveBeenCalled()
  })

  it.each(['all', 'essential'])('retains readable legacy consent %s when migration writes fail', async (consent) => {
    const { storage, values } = stubBrowser()
    values.set('vide-cookie-consent', consent)
    storage.setItem.mockImplementation(() => { throw new Error('Write denied') })
    const { getConsent } = await import('./analytics')
    expect(getConsent()).toBe(consent)
  })

  it('persists the chosen value when storage is available', async () => {
    const { storage } = stubBrowser('all')
    const { getConsent, setConsent } = await import('./analytics')
    setConsent('essential')
    expect(storage.setItem).toHaveBeenCalledWith(CONSENT_KEY, 'essential')
    expect(getConsent()).toBe('essential')
  })

  it('still observes a stored withdrawal from another tab after a successful write', async () => {
    const { browser, values } = stubBrowser()
    const { getConsent, setConsent, trackEvent } = await import('./analytics')
    setConsent('all')
    const previousEvents = [...browser.dataLayer as unknown[]]
    values.set(CONSENT_KEY, 'essential')
    trackEvent('waitlist_submit')
    expect(getConsent()).toBe('essential')
    expect(browser.dataLayer).toEqual(previousEvents)
  })

  it('immediately disables an already loaded tracker on cross-tab withdrawal', async () => {
    const { browser, document, values, storage } = stubBrowser('all')
    const { getConsent, loadAnalytics, syncConsentFromStorage, trackEvent } = await import('./analytics')
    loadAnalytics()
    const previousEvents = [...browser.dataLayer as unknown[]]
    expect(browser[`ga-disable-${GA_ID}`]).toBe(false)
    document.cookie = '_ga=123'
    values.set(CONSENT_KEY, 'essential')

    expect(syncConsentFromStorage({
      key: CONSENT_KEY, newValue: 'essential', storageArea: storage as unknown as Storage,
    })).toBe(true)

    expect(getConsent()).toBe('essential')
    expect(browser[`ga-disable-${GA_ID}`]).toBe(true)
    expect(document.cookie).toContain('Max-Age=0')
    trackEvent('waitlist_submit')
    expect(browser.dataLayer).toEqual(previousEvents)
    expect(document.head.appendChild).toHaveBeenCalledTimes(1)
  })

  it.each([CONSENT_KEY, null])('treats cross-tab removal/clear (%s) as unknown without reviving legacy acceptance', async (key) => {
    const { browser, values } = stubBrowser('all')
    const { getConsent, loadAnalytics, syncConsentFromStorage } = await import('./analytics')
    loadAnalytics()
    values.delete(CONSENT_KEY)
    // A leftover legacy value must not undo an explicit current-key removal.
    values.set('vide-cookie-consent', 'all')

    expect(syncConsentFromStorage({ key, newValue: null, storageArea: null })).toBe(true)
    expect(getConsent()).toBeNull() // CookieBanner reopens when this is null.
    expect(browser[`ga-disable-${GA_ID}`]).toBe(true)
    loadAnalytics()
    expect(browser[`ga-disable-${GA_ID}`]).toBe(true)
    expect(getConsent()).toBeNull()
  })

  it('does not re-enable tracking on a cross-tab grant but allows an explicit choice here', async () => {
    const { browser, document, values } = stubBrowser('all')
    const { getConsent, loadAnalytics, setConsent, syncConsentFromStorage, trackEvent } = await import('./analytics')
    loadAnalytics()
    values.set(CONSENT_KEY, 'essential')
    syncConsentFromStorage({ key: CONSENT_KEY, newValue: 'essential', storageArea: null })
    const previousEvents = [...browser.dataLayer as unknown[]]
    values.set(CONSENT_KEY, 'all')

    expect(syncConsentFromStorage({ key: CONSENT_KEY, newValue: 'all', storageArea: null })).toBe(false)
    expect(getConsent()).toBe('essential')
    loadAnalytics()
    trackEvent('waitlist_submit')
    expect(browser[`ga-disable-${GA_ID}`]).toBe(true)
    expect(browser.dataLayer).toEqual(previousEvents)

    setConsent('all')
    expect(getConsent()).toBe('all')
    expect(browser[`ga-disable-${GA_ID}`]).toBe(false)
    expect(document.head.appendChild).toHaveBeenCalledTimes(1)
  })

  it('overrides in-memory acceptance even if storage access becomes denied', async () => {
    const { browser } = stubBrowser()
    denyStorageGetter()
    const { getConsent, setConsent, syncConsentFromStorage } = await import('./analytics')
    setConsent('all')
    expect(getConsent()).toBe('all')

    expect(syncConsentFromStorage({
      key: CONSENT_KEY, newValue: 'essential', storageArea: {} as Storage,
    })).toBe(true)
    expect(getConsent()).toBe('essential')
    expect(browser[`ga-disable-${GA_ID}`]).toBe(true)
  })

  it.each([null, 'essential'])('does not adopt a foreign grant on a tab whose prior consent was %s', async (previousConsent) => {
    const { browser, document, values } = stubBrowser(previousConsent)
    const { getConsent, loadAnalytics, syncConsentFromStorage, trackEvent } = await import('./analytics')
    expect(getConsent()).toBe(previousConsent)
    values.set(CONSENT_KEY, 'all')
    expect(syncConsentFromStorage({
      key: CONSENT_KEY, newValue: 'all', oldValue: previousConsent, storageArea: null,
    })).toBe(false)

    // Mirrors the initialization performed when CookieBanner mounts again.
    expect(getConsent()).toBe(previousConsent)
    loadAnalytics()
    trackEvent('waitlist_submit')
    expect(document.head.appendChild).not.toHaveBeenCalled()
    expect(browser.gtag).not.toHaveBeenCalled()
  })

  it('ignores unrelated keys, session-storage events and legacy migration cleanup', async () => {
    const { browser, storage } = stubBrowser('all')
    const { getConsent, loadAnalytics, syncConsentFromStorage } = await import('./analytics')
    loadAnalytics()
    for (const event of [
      { key: 'vane-lang', newValue: 'de', storageArea: null },
      { key: CONSENT_KEY, newValue: 'essential', storageArea: {} as Storage },
      { key: 'vide-cookie-consent', newValue: null, storageArea: storage as unknown as Storage },
    ]) {
      expect(syncConsentFromStorage(event)).toBe(false)
    }
    expect(getConsent()).toBe('all')
    expect(browser[`ga-disable-${GA_ID}`]).toBe(false)
  })

  it('honors legacy-key withdrawal when no current-key choice exists', async () => {
    const { browser } = stubBrowser()
    const { getConsent, syncConsentFromStorage } = await import('./analytics')
    expect(syncConsentFromStorage({ key: 'vide-cookie-consent', newValue: 'essential', storageArea: null })).toBe(true)
    expect(getConsent()).toBe('essential')
    expect(browser[`ga-disable-${GA_ID}`]).toBe(true)
  })
})

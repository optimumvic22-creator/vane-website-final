'use client'

import Link from 'next/link'
import { useLocale } from '@/lib/locale'
import { CONSENT_SETTINGS_EVENT } from '@/lib/analytics'

const linkClass = 'inline-flex min-h-11 items-center rounded-sm text-xs text-white/60 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-black'

export function EntryFooter() {
  const { locale } = useLocale()
  const isGerman = locale === 'de'

  return (
    <footer className="dark shrink-0 bg-black px-5 pb-[calc(1rem+env(safe-area-inset-bottom))] md:px-8">
      <div className="mx-auto flex max-w-[1536px] flex-col items-center gap-2 border-t border-white/10 pt-4 md:flex-row md:justify-between md:gap-6">
        <p className="text-xs text-white/50">
          &copy; {new Date().getFullYear()} VANE Science GmbH
        </p>
        <nav aria-label={isGerman ? 'Unternehmen und Rechtliches' : 'Company and legal'} className="flex flex-wrap justify-center gap-x-5 gap-y-0 md:gap-x-6">
          <Link href="/team" className={linkClass}>{isGerman ? 'Über VANE' : 'About VANE'}</Link>
          <Link href="/impressum" className={linkClass}>Impressum</Link>
          <Link href="/privacy" className={linkClass}>{isGerman ? 'Datenschutz' : 'Privacy Policy'}</Link>
          <Link href="/terms" className={linkClass}>{isGerman ? 'Nutzungsbedingungen' : 'Terms'}</Link>
          <button type="button" onClick={() => window.dispatchEvent(new Event(CONSENT_SETTINGS_EVENT))} className={linkClass}>
            {isGerman ? 'Cookie Einstellungen' : 'Cookie settings'}
          </button>
        </nav>
      </div>
    </footer>
  )
}

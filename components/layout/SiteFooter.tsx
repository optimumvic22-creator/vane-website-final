'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Linkedin, Instagram } from 'lucide-react'
import { useLocale } from '@/lib/locale'
import { CONSENT_SETTINGS_EVENT } from '@/lib/analytics'
import { Container } from '@/components/ui/container'

const footerLinkClass = 'inline-flex min-h-10 w-fit items-center rounded-sm text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background md:min-h-0'
const socialLinkClass = 'inline-flex h-11 w-11 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'

export function SiteFooter() {
  const { locale } = useLocale()

  return (
    <footer className="border-t border-border/20 bg-card/30 py-14 md:py-16">
      <Container>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link
              href="/"
              aria-label="VANE Science"
              className="inline-flex min-h-11 items-center rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background"
            >
              <Image
                src="/vane-science-wordmark.png"
                alt=""
                width={770}
                height={100}
                sizes="139px"
                className="h-[18px] w-auto"
              />
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {locale === 'de' ? 'Wir haben menschlicher Bewegung eine Sprache gegeben. Bewegungsanalyse aus Wien.' : 'We gave human movement a language. Movement quality assessment from Vienna.'}
            </p>
            <a href="mailto:office@vanescience.com" className={`mt-3 ${footerLinkClass}`}>
              office@vanescience.com
            </a>
            <div className="mt-4 -ml-3 flex gap-1">
              <a href="https://linkedin.com/company/vanescience" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className={socialLinkClass}>
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="https://www.instagram.com/vane.sciences/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className={socialLinkClass}>
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <p className="text-sm font-medium text-foreground">
              {locale === 'de' ? 'Produkt' : 'Product'}
            </p>
            <nav aria-label={locale === 'de' ? 'Produkt' : 'Product'} className="mt-3 flex flex-col md:gap-2">
              <Link href="/for/athlete" className={footerLinkClass}>{locale === 'de' ? 'Für Athleten' : 'For athletes'}</Link>
              <Link href="/for/coach" className={footerLinkClass}>{locale === 'de' ? 'Für Coaches' : 'For coaches'}</Link>
              <Link href="/for/partner" className={footerLinkClass}>{locale === 'de' ? 'Für Partner' : 'For partners'}</Link>
            </nav>
          </div>

          {/* Company */}
          <div>
            <p className="text-sm font-medium text-foreground">
              {locale === 'de' ? 'Unternehmen' : 'Company'}
            </p>
            <nav aria-label={locale === 'de' ? 'Unternehmen' : 'Company'} className="mt-3 flex flex-col md:gap-2">
              <Link href="/team" className={footerLinkClass}>{locale === 'de' ? 'Über VANE' : 'About VANE'}</Link>
              <Link href="/investors" className={footerLinkClass}>{locale === 'de' ? 'Für Investoren' : 'For investors'}</Link>
              <Link href="/for/athlete#science" className={footerLinkClass}>{locale === 'de' ? 'Einordnung und Grenzen' : 'Interpretation and limits'}</Link>
              <Link href="/for/partner#waitlist" className={footerLinkClass}>{locale === 'de' ? 'Partner Warteliste' : 'Partner waitlist'}</Link>
              <a href="mailto:team@vanescience.com" className={footerLinkClass}>{locale === 'de' ? 'Karriere' : 'Join us'}</a>
            </nav>
          </div>

          {/* Legal */}
          <div>
            <p className="text-sm font-medium text-foreground">
              {locale === 'de' ? 'Rechtliches' : 'Legal'}
            </p>
            <nav aria-label={locale === 'de' ? 'Rechtliches' : 'Legal'} className="mt-3 flex flex-col md:gap-2">
              <Link href="/impressum" className={footerLinkClass}>Impressum</Link>
              <Link href="/privacy" className={footerLinkClass}>{locale === 'de' ? 'Datenschutz' : 'Privacy Policy'}</Link>
              <Link href="/terms" className={footerLinkClass}>{locale === 'de' ? 'Nutzungsbedingungen' : 'Terms'}</Link>
              <button
                type="button"
                onClick={() => window.dispatchEvent(new Event(CONSENT_SETTINGS_EVENT))}
                className={`${footerLinkClass} text-left`}
              >
                {locale === 'de' ? 'Cookie Einstellungen' : 'Cookie settings'}
              </button>
            </nav>
          </div>
        </div>

        <div className="mt-12 border-t border-border/10 pt-6 text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} VANE Science GmbH. All rights reserved.
        </div>
      </Container>
    </footer>
  )
}

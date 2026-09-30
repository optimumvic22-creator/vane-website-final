'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { FADE } from '@/lib/motion'
import { useLocale } from '@/lib/locale'
import { trackEvent } from '@/lib/analytics'
import { isAudienceSlug, type AudienceSlug } from '@/lib/audience-content'
import { LanguageToggle } from './LanguageToggle'
import { MotionToggle } from '@/components/ui/motion-toggle'

type NavLink = {
  href: string
  labelEn: string
  labelDe: string
}

const audienceNav: Record<AudienceSlug, NavLink[]> = {
  athlete: [
    { href: '#benefits', labelEn: 'Why MQS', labelDe: 'Warum MQS' },
    { href: '#how-it-works', labelEn: 'Your assessment', labelDe: 'Dein Assessment' },
    { href: '#results', labelEn: 'Your report', labelDe: 'Dein Bericht' },
  ],
  coach: [
    { href: '#benefits', labelEn: 'Why it helps', labelDe: 'Warum es hilft' },
    { href: '#how-it-works', labelEn: 'Team assessment', labelDe: 'Team Assessment' },
    { href: '#results', labelEn: 'Staff report', labelDe: 'Teamreport' },
  ],
  partner: [
    { href: '#benefits', labelEn: 'Partner value', labelDe: 'Partnernutzen' },
    { href: '#how-it-works', labelEn: 'Pilot model', labelDe: 'Pilotmodell' },
    { href: '#results', labelEn: 'Deliverables', labelDe: 'Ergebnisse' },
  ],
}

const generalNav: NavLink[] = [
  { href: '/for/athlete', labelEn: 'Athletes', labelDe: 'Athleten' },
  { href: '/for/coach', labelEn: 'Coaches', labelDe: 'Coaches' },
  { href: '/for/partner', labelEn: 'Partners', labelDe: 'Partner' },
]

const audienceCta: Record<AudienceSlug, { en: string; de: string }> = {
  athlete: { en: 'Request assessment', de: 'Assessment anfragen' },
  coach: { en: 'Join the waitlist', de: 'Auf die Warteliste' },
  partner: { en: 'Join the waitlist', de: 'Auf die Warteliste' },
}

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const brandLinkRef = useRef<HTMLAnchorElement>(null)
  const desktopNavRef = useRef<HTMLElement>(null)
  const mobileNavRef = useRef<HTMLElement>(null)
  const { locale } = useLocale()
  const pathname = usePathname()

  const audienceValue = pathname.startsWith('/for/') ? pathname.split('/')[2] : ''
  const activeAudience = isAudienceSlug(audienceValue) ? audienceValue : null
  const navLinks = activeAudience ? audienceNav[activeAudience] : generalNav
  const investorPage = pathname === '/investors'
  const ctaHref = activeAudience ? '#waitlist' : investorPage ? '#investor-contact' : '/'
  const ctaLabel = activeAudience
    ? audienceCta[activeAudience][locale]
    : investorPage
      ? locale === 'de' ? 'Briefing anfragen' : 'Request briefing'
    : locale === 'de'
      ? 'Zielgruppe wählen'
      : 'Choose your path'

  useEffect(() => {
    if (!mobileOpen) return
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setMobileOpen(false)
      menuButtonRef.current?.focus()
    }
    const desktop = window.matchMedia('(min-width: 1024px)')
    const closeOnDesktop = (event: MediaQueryListEvent) => {
      if (!event.matches) return

      const activeElement = document.activeElement
      const focusWasMobile = activeElement === menuButtonRef.current ||
        (activeElement !== null && mobileNavRef.current?.contains(activeElement))

      if (focusWasMobile) {
        const href = activeElement?.closest('a[href]')?.getAttribute('href')
        const matchingLink = href
          ? Array.from(desktopNavRef.current?.querySelectorAll<HTMLAnchorElement>('a[href]') ?? [])
            .find((link) => link.getAttribute('href') === href && link.getClientRects().length > 0)
          : undefined
        const target = matchingLink ?? brandLinkRef.current
        if (target?.getClientRects().length) target.focus({ preventScroll: true })
      }

      setMobileOpen(false)
    }
    document.addEventListener('keydown', closeOnEscape)
    desktop.addEventListener('change', closeOnDesktop)
    return () => {
      document.removeEventListener('keydown', closeOnEscape)
      desktop.removeEventListener('change', closeOnDesktop)
    }
  }, [mobileOpen])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
      if (window.scrollY < window.innerHeight * 0.55) setActiveSection('')
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (!activeAudience) return

    const sections = ['benefits', 'how-it-works', 'results']
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section))

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((first, second) => second.intersectionRatio - first.intersectionRatio)[0]
        if (visible?.target.id) setActiveSection(visible.target.id)
      },
      { rootMargin: '-24% 0px -58% 0px', threshold: [0.1, 0.35, 0.6] },
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [activeAudience])

  return (
    <header
      className={cn(
        'fixed left-1/2 z-50 -translate-x-1/2 transition-all duration-200',
        scrolled
          ? 'top-3 w-[calc(100%-2rem)] max-w-[1240px] rounded-xl border border-border/10 bg-background/88 shadow-elevation-2 backdrop-blur-md'
          : 'top-0 w-full max-w-none bg-transparent',
      )}
    >
      <div
        className={cn(
          'mx-auto flex items-center justify-between transition-all duration-200',
          scrolled
            ? 'h-12 w-full px-1 md:px-4'
            : 'h-16 max-w-[1600px] px-5 md:px-8',
        )}
      >
        <Link
          ref={brandLinkRef}
          href="/"
          className="inline-flex min-h-11 shrink-0 items-center whitespace-nowrap rounded-sm text-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background"
          aria-label="VANE Science"
        >
          <Image
            src="/vane-science-wordmark.png"
            alt=""
            width={770}
            height={100}
            sizes="(min-width: 768px) 146px, 139px"
            className="h-[18px] w-auto md:h-[19px]"
          />
        </Link>

        <nav
          ref={desktopNavRef}
          aria-label={locale === 'de' ? 'Hauptnavigation' : 'Main navigation'}
          className="hidden items-center gap-5 lg:flex xl:gap-8"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={activeAudience && activeSection === link.href.slice(1) ? 'location' : undefined}
              className={cn(
                'relative flex min-h-11 items-center text-sm font-medium text-muted-foreground transition-colors after:absolute after:inset-x-0 after:bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-primary after:transition-transform after:duration-200 hover:text-foreground hover:after:scale-x-100 focus-visible:outline-none focus-visible:text-foreground focus-visible:after:scale-x-100',
                activeAudience && activeSection === link.href.slice(1) &&
                  'text-foreground after:scale-x-100',
              )}
            >
              {locale === 'de' ? link.labelDe : link.labelEn}
            </Link>
          ))}
          <LanguageToggle />
          <MotionToggle />
          <Link
            href={ctaHref}
            onClick={() => trackEvent('cta_click', { location: 'header', audience: activeAudience ?? 'general' })}
            className="inline-flex min-h-11 items-center rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            {ctaLabel}
          </Link>
        </nav>

        <div className="flex items-center gap-1 lg:hidden">
          <MotionToggle />
          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label={locale === 'de' ? 'Menü umschalten' : 'Toggle menu'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <motion.nav
          ref={mobileNavRef}
          id="mobile-nav"
          aria-label={locale === 'de' ? 'Mobile Navigation' : 'Mobile navigation'}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={FADE}
          className="max-h-[calc(100dvh-76px-env(safe-area-inset-bottom))] overflow-y-auto overscroll-contain border-b border-border/10 bg-background/95 backdrop-blur-md lg:hidden"
        >
          <div className="flex flex-col px-5 py-5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                aria-current={activeAudience && activeSection === link.href.slice(1) ? 'location' : undefined}
                className={cn(
                  'flex min-h-11 items-center border-b border-border/10 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:text-foreground',
                  activeAudience && activeSection === link.href.slice(1) && 'text-primary',
                )}
              >
                {locale === 'de' ? link.labelDe : link.labelEn}
              </Link>
            ))}
            <div className="flex min-h-14 items-center justify-between border-b border-border/10">
              <span className="text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground">
                {locale === 'de' ? 'Sprache' : 'Language'}
              </span>
              <LanguageToggle />
            </div>
            <Link
              href={ctaHref}
              onClick={() => {
                trackEvent('cta_click', { location: 'header_mobile', audience: activeAudience ?? 'general' })
                setMobileOpen(false)
              }}
              className="mt-5 inline-flex min-h-11 items-center justify-center rounded-full bg-primary px-5 py-2 text-center text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              {ctaLabel}
            </Link>
          </div>
        </motion.nav>
      )}
    </header>
  )
}

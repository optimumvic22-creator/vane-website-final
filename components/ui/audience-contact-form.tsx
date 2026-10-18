'use client'

import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'
import type { AudienceSlug } from '@/lib/audience-content'
import { useLocale, type Locale } from '@/lib/locale'

function FormLoading() {
  const { locale } = useLocale()
  return (
    <div role="status" className="mx-auto mt-8 flex min-h-64 max-w-2xl items-center justify-center text-sm text-muted-foreground">
      {locale === 'de' ? 'Formular wird geladen …' : 'Loading form …'}
    </div>
  )
}

const InquiryForm = dynamic(
  () => import('./audience-inquiry-form').then((module) => module.AudienceInquiryForm),
  { loading: FormLoading },
)
const WaitlistForm = dynamic(
  () => import('./audience-waitlist-form').then((module) => module.AudienceWaitlistForm),
  { loading: FormLoading },
)

export function AudienceContactForm({
  audience,
  locale,
  cta,
  note,
}: {
  audience: AudienceSlug
  locale: Locale
  cta: string
  note: string
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(false)

  useEffect(() => {
    if (active) return
    const container = containerRef.current
    if (!container) return

    const activate = () => setActive(true)
    const handleHash = () => {
      if (window.location.hash === '#waitlist') activate()
    }
    const handleKeyboardIntent = (event: KeyboardEvent) => {
      // Make fields available before keyboard traversal reaches the final section.
      if (event.key === 'Tab') activate()
    }
    const handleContactIntent = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return
      const anchor = event.target.closest<HTMLAnchorElement>('a[href]')
      if (!anchor) return
      const url = new URL(anchor.href, window.location.href)
      if (url.origin === window.location.origin &&
        url.pathname === window.location.pathname && url.hash === '#waitlist') {
        activate()
      }
    }

    // Start before smooth anchor scrolling or before the form enters the viewport.
    document.addEventListener('click', handleContactIntent)
    document.addEventListener('keydown', handleKeyboardIntent)
    window.addEventListener('hashchange', handleHash)
    const observer = typeof IntersectionObserver === 'undefined'
      ? null
      : new IntersectionObserver((entries) => {
          if (entries.some((entry) => entry.isIntersecting)) activate()
        }, { rootMargin: '1000px 0px' })
    observer?.observe(container)
    const initialActivation = !observer || window.location.hash === '#waitlist'
      ? window.setTimeout(activate, 0)
      : undefined

    return () => {
      observer?.disconnect()
      window.clearTimeout(initialActivation)
      document.removeEventListener('click', handleContactIntent)
      document.removeEventListener('keydown', handleKeyboardIntent)
      window.removeEventListener('hashchange', handleHash)
    }
  }, [active])

  return (
    <div ref={containerRef} onFocusCapture={() => setActive(true)}>
      {active ? (
        audience === 'athlete'
          ? <>
              <InquiryForm audience={audience} locale={locale} cta={cta} note={note} />
              <section aria-labelledby="athlete-waitlist-heading" className="mx-auto mt-12 max-w-2xl border-t border-white/12 pt-10">
                <h3 id="athlete-waitlist-heading" className="text-2xl font-medium text-foreground">
                  {locale === 'de' ? 'Auf die Athleten-Warteliste' : 'Join the athlete waitlist'}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
                  {locale === 'de'
                    ? 'Du möchtest über MQS informiert bleiben? Melde dich unabhängig von einer Assessment-Anfrage an. Du erhältst direkt eine Willkommens-E-Mail von Marko und Dario.'
                    : 'Want to stay connected with MQS? Join separately from an assessment request and receive a welcome email from Marko and Dario right away.'}
                </p>
                <WaitlistForm audience="athlete" locale={locale}
                  cta={locale === 'de' ? 'Auf die Athleten-Warteliste' : 'Join the athlete waitlist'}
                  note={locale === 'de' ? 'Diese Anmeldung ist keine Assessment-Buchung.' : 'Joining this waitlist does not book an assessment.'} />
              </section>
            </>
          : <WaitlistForm audience={audience} locale={locale} cta={cta} note={note} />
      ) : (
        <FormLoading />
      )}
      <noscript>
        <p className="mt-4 text-sm text-muted-foreground">
          {locale === 'de' ? 'Bitte kontaktiere uns per E-Mail: ' : 'Please contact us by email: '}
          <a className="underline" href="mailto:mqs@vanescience.com">mqs@vanescience.com</a>
        </p>
      </noscript>
    </div>
  )
}

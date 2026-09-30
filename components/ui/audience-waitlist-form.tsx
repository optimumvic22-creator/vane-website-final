'use client'

import { useEffect, useId, useRef, useState, type FormEvent } from 'react'
import Link from 'next/link'
import { ArrowRight, Check } from 'lucide-react'
import { trackEvent } from '@/lib/analytics'
import type { Locale } from '@/lib/locale'
import { waitlistUpdatesConsent } from '@/lib/waitlist-consent'
import { submitWaitlist, WaitlistTimeoutError } from '@/lib/waitlist-request'

export function AudienceWaitlistForm({
  audience,
  locale,
  cta,
  note,
}: {
  audience: 'coach' | 'partner'
  locale: Locale
  cta: string
  note: string
}) {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')
  const [updatesRequested, setUpdatesRequested] = useState(false)
  const requestPending = useRef(false)
  const successRef = useRef<HTMLDivElement>(null)
  const id = useId()

  useEffect(() => {
    if (status === 'success') successRef.current?.focus()
  }, [status])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (requestPending.current) return

    const form = new FormData(event.currentTarget)
    const updatesConsent = form.get('updatesConsent') === 'on'
    requestPending.current = true
    setStatus('submitting')
    setError('')

    try {
      await submitWaitlist({
        email: String(form.get('email') ?? '').trim(),
        segment: audience,
        locale,
        source: `audience:${audience}:final`,
        updatesConsent,
        company: String(form.get('company') ?? ''),
      })
    } catch (cause) {
      setStatus('error')
      setError(
        cause instanceof WaitlistTimeoutError
          ? locale === 'de'
            ? 'Die Bestätigung ist gerade nicht verfügbar. Deine E Mail Adresse könnte bereits auf der Warteliste stehen. Bitte versuche es später erneut.'
            : 'Confirmation is currently unavailable. Your email may already be on the waitlist. Please try again later.'
          : locale === 'de'
            ? 'Deine Anmeldung konnte nicht bestätigt werden. Deine Eingaben bleiben erhalten. Bitte versuche es erneut.'
            : 'Your signup could not be confirmed. Your entries are still here. Please try again.',
      )
      return
    } finally {
      requestPending.current = false
    }

    setUpdatesRequested(updatesConsent)
    setStatus('success')
    try {
      trackEvent('waitlist_submit', { segment: audience, locale })
    } catch {
      // Analytics must not turn a confirmed signup into a retryable error.
    }
  }

  if (status === 'success') {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        role="status"
        className="mx-auto mt-8 flex max-w-xl items-start gap-4 rounded-xl border border-primary/25 bg-primary/[0.06] p-5 text-left focus:outline-none focus:ring-2 focus:ring-primary/70"
      >
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Check className="h-4 w-4" aria-hidden="true" />
        </span>
        <div className="space-y-3 text-sm leading-relaxed text-foreground md:text-base">
          <p className="font-semibold">{locale === 'de' ? 'Du bist auf der Warteliste' : 'You’re on the waitlist'}</p>
          <p>
            {locale === 'de'
              ? 'Wir melden uns, sobald der Zugang verfügbar ist.'
              : 'We’ll contact you when access is available.'}
          </p>
          {updatesRequested && (
            <p>
              {locale === 'de'
                ? 'Dein Wunsch nach E Mail Updates ist erfasst. Updates starten erst, nachdem du deine E Mail Adresse bestätigt hast.'
                : 'Your request for email updates is recorded. Updates start only after you confirm your email address.'}
            </p>
          )}
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} aria-busy={status === 'submitting'} className="mx-auto mt-8 max-w-xl text-left">
      <label className="grid gap-2 text-[13px] font-medium text-foreground">
        <span>{locale === 'de' ? 'E Mail Adresse' : 'Email address'}</span>
        <input
          type="email"
          name="email"
          required
          maxLength={320}
          autoComplete="email"
          autoCapitalize="none"
          spellCheck={false}
          readOnly={status === 'submitting'}
          placeholder="name@example.com"
          className="min-h-12 w-full rounded-xl border border-white/[0.18] bg-black/35 px-4 text-base text-foreground outline-none transition-colors placeholder:text-muted-foreground/65 hover:border-white/28 focus:border-primary/70 focus:ring-2 focus:ring-primary/15"
        />
      </label>

      <label className="mt-4 flex min-h-11 cursor-pointer items-start gap-3 py-2 text-sm leading-relaxed text-muted-foreground">
        <input
          type="checkbox"
          name="updatesConsent"
          defaultChecked={false}
          disabled={status === 'submitting'}
          aria-describedby={`${id}-updates-note`}
          className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-wait"
        />
        <span>{waitlistUpdatesConsent[locale]}</span>
      </label>
      <p id={`${id}-updates-note`} className="pl-8 text-xs leading-relaxed text-muted-foreground">
        {locale === 'de'
          ? 'Optional. Du kannst dich auch ohne E Mail Updates auf die Warteliste setzen lassen.'
          : 'Optional. You can join the waitlist without email updates.'}
      </p>

      <div className="absolute left-[-10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor={`${id}-company`}>Company</label>
        <input id={`${id}-company`} name="company" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="mt-5 flex flex-col items-center gap-3">
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="inline-flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-wait disabled:opacity-65 sm:w-auto sm:min-w-56"
        >
          {status === 'submitting' ? (locale === 'de' ? 'Wird gesendet...' : 'Sending...') : cta}
          {status !== 'submitting' && <ArrowRight className="h-4 w-4" aria-hidden="true" />}
        </button>
        {error && (
          <div role="alert" className="w-full rounded-lg border border-red-300/25 bg-red-950/20 p-4 text-sm leading-relaxed text-red-200">
            <p>{error}</p>
            <a href="mailto:hello@vanescience.com" className="mt-2 inline-flex min-h-10 items-center underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">hello@vanescience.com</a>
          </div>
        )}
        <p className="text-center text-xs leading-relaxed text-muted-foreground">{note}</p>
        <p className="text-center text-xs leading-relaxed text-muted-foreground">
          {locale === 'de' ? 'Informationen zum Datenschutz: ' : 'How we handle your data: '}
          <Link href="/privacy" className="underline decoration-white/25 underline-offset-2 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70">
            {locale === 'de' ? 'Datenschutzerklärung' : 'Privacy policy'}
          </Link>
          .
        </p>
      </div>
    </form>
  )
}

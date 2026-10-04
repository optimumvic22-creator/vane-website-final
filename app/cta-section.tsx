'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Loader2, Mail } from 'lucide-react'
import { sectionReveal } from '@/lib/motion'
import { useLocale } from '@/lib/locale'
import { renderText } from '@/lib/render-text'
import { trackEvent } from '@/lib/analytics'
import { WAITLIST_SEGMENT_EVENT, type WaitlistSegment, type WaitlistSegmentDetail } from '@/lib/waitlist'
import { Section } from '@/components/ui/section'
import { Container } from '@/components/ui/container'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

/** Order matches the `segments` label arrays below (and any Sanity override). */
const SEGMENT_IDS: WaitlistSegment[] = ['individual', 'gym-clinic', 'federation']
const B2B_SEGMENTS: WaitlistSegment[] = ['gym-clinic', 'federation']

const en = {
  overline: 'Join us',
  headline: 'Know where you stand. Know where you\'re going.',
  sub: 'VANE launches soon. The first spots go to those who show up first.',
  placeholder: 'your@email.com',
  button: 'Discover my score \u2192',
  submitting: 'Submitting…',
  trust: 'No spam. Processed in line with GDPR. Unsubscribe anytime.',
  segmentLabel: 'Which best describes you?',
  segments: ["I'm an individual", 'I represent a gym or clinic', 'I represent a federation'],
  success: "You're on the list. We'll be in touch.",
  successB2b: 'Prefer to talk directly?',
  successB2bCta: 'Email mqs@vanescience.com',
  error: "Something went wrong and your signup wasn't saved. Please try again in a moment.",
}

const de = {
  overline: 'Jetzt mitmachen',
  headline: 'Sehen. Verstehen. Besser bewegen.',
  sub: 'VANE startet bald. Sichere dir deinen Platz und geh\u00f6re zu den Ersten, die ihren Bewegungsscore kennen.',
  placeholder: 'deine@email.com',
  button: 'Zugang sichern \u2192',
  submitting: 'Wird gesendet…',
  trust: 'Kein Spam. DSGVO konform. Jederzeit abmeldbar.',
  segmentLabel: 'Was beschreibt dich am besten?',
  segments: ['Ich bin Einzelperson', 'Ich vertrete ein Gym oder eine Klinik', 'Ich vertrete einen Verband'],
  success: 'Du bist auf der Liste. Wir melden uns.',
  successB2b: 'Du willst direkt sprechen?',
  successB2bCta: 'Schreib uns: mqs@vanescience.com',
  error: 'Etwas ist schiefgelaufen. Deine Anmeldung wurde nicht gespeichert. Bitte versuche es gleich noch einmal.',
}

interface CtaSectionProps {
  data?: {
    ctaOverline?: string
    ctaOverlineDe?: string
    ctaHeadline?: string
    ctaHeadlineDe?: string
    ctaSub?: string
    ctaSubDe?: string
    ctaPlaceholder?: string
    ctaPlaceholderDe?: string
    ctaButton?: string
    ctaButtonDe?: string
    ctaTrust?: string
    ctaTrustDe?: string
    ctaSegmentLabel?: string
    ctaSegmentLabelDe?: string
    ctaSegments?: string[]
    ctaSegmentsDe?: string[]
    ctaSuccessMessage?: string
    ctaSuccessMessageDe?: string
  } | null
}

export function CtaSection({ data }: CtaSectionProps) {
  const { locale } = useLocale()
  const t = locale === 'de' ? de : en

  const isDE = locale === 'de'
  const overline = (isDE ? data?.ctaOverlineDe : data?.ctaOverline) || t.overline
  const headline = (isDE ? data?.ctaHeadlineDe : data?.ctaHeadline) || t.headline
  const sub = (isDE ? data?.ctaSubDe : data?.ctaSub) || t.sub
  const placeholder = (isDE ? data?.ctaPlaceholderDe : data?.ctaPlaceholder) || t.placeholder
  const buttonText = (isDE ? data?.ctaButtonDe : data?.ctaButton) || t.button
  const trust = (isDE ? data?.ctaTrustDe : data?.ctaTrust) || t.trust
  const segmentLabel = (isDE ? data?.ctaSegmentLabelDe : data?.ctaSegmentLabel) || t.segmentLabel
  const segments = (isDE ? data?.ctaSegmentsDe : data?.ctaSegments) || t.segments
  const successMessage = (isDE ? data?.ctaSuccessMessageDe : data?.ctaSuccessMessage) || t.success
  const [email, setEmail] = useState('')
  const [segment, setSegment] = useState<WaitlistSegment | ''>('')
  const [source, setSource] = useState('waitlist-section')
  const [honeypot, setHoneypot] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  // Segment-aware CTAs elsewhere on the page (e.g. use-case tabs) preselect a chip here.
  useEffect(() => {
    const handlePreselect = (event: Event) => {
      const { detail } = event as CustomEvent<WaitlistSegmentDetail>
      if (detail?.segment && SEGMENT_IDS.includes(detail.segment)) {
        setSegment(detail.segment)
        setSource(detail.source || 'waitlist-section')
      }
    }
    window.addEventListener(WAITLIST_SEGMENT_EVENT, handlePreselect)
    return () => window.removeEventListener(WAITLIST_SEGMENT_EVENT, handlePreselect)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || status === 'submitting') return
    setStatus('submitting')
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          segment: segment || undefined,
          locale,
          source,
          company: honeypot || undefined,
        }),
      })
      if (!res.ok) throw new Error(`Waitlist request failed (${res.status})`)
      trackEvent('waitlist_submit', { segment: segment || 'none', locale })
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  const isB2b = segment !== '' && B2B_SEGMENTS.includes(segment)

  return (
    <Section id="waitlist" spacing="xl" background="elevated">
      <Container size="md">
        <motion.div {...sectionReveal()} className="text-center">
          <p className="font-mono text-[11px] font-normal uppercase tracking-[0.26em] text-primary">{overline}</p>
          <h2 className="mt-5 font-display text-5xl font-normal uppercase leading-[0.98] tracking-[0.02em] text-foreground md:text-6xl lg:text-7xl">
            {headline}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-muted-foreground">
            {renderText(sub)}
          </p>

          {status === 'success' ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mx-auto mt-10 flex max-w-md flex-col items-center gap-3"
              role="status"
              aria-live="polite"
            >
              <CheckCircle className="h-10 w-10 text-primary" />
              <p className="text-lg font-medium text-foreground">{successMessage}</p>
              {isB2b && (
                <div className="mt-2 flex flex-col items-center gap-2">
                  <p className="text-sm text-muted-foreground">{t.successB2b}</p>
                  <a
                    href="mailto:mqs@vanescience.com"
                    className="inline-flex items-center gap-2 rounded-full border border-border/30 px-5 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
                  >
                    <Mail className="h-4 w-4" />
                    {t.successB2bCta}
                  </a>
                </div>
              )}
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="relative mx-auto mt-10 max-w-lg">
              {/* Stacks on small screens so the nowrap submit button can't overflow the viewport. */}
              <div className="flex flex-col gap-2 sm:flex-row">
                <label htmlFor="waitlist-email" className="sr-only">
                  {locale === 'de' ? 'E Mail Adresse' : 'Email address'}
                </label>
                <input
                  id="waitlist-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={placeholder}
                  className="flex-1 rounded-full border border-border/30 bg-background px-5 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
                />
                <Button type="submit" size="lg" className="rounded-full" disabled={status === 'submitting'}>
                  {status === 'submitting' ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {t.submitting}
                    </>
                  ) : (
                    buttonText
                  )}
                </Button>
              </div>

              {/* Honeypot hidden from real users, catches naive bots. */}
              <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
                <label htmlFor="waitlist-company">Company</label>
                <input
                  id="waitlist-company"
                  type="text"
                  name="company"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />
              </div>

              {status === 'error' && (
                <p role="alert" className="mt-3 text-sm text-destructive">{t.error}</p>
              )}

              <div className="mt-6">
                <p className="text-xs uppercase tracking-wider text-muted-foreground/70">{segmentLabel}</p>
                <div className="mt-2 flex flex-wrap justify-center gap-2">
                  {segments.map((seg, i) => {
                    const segmentId = SEGMENT_IDS[i]
                    if (!segmentId) return null
                    return (
                      <button
                        key={segmentId}
                        type="button"
                        aria-pressed={segment === segmentId}
                        onClick={() => setSegment(segmentId)}
                        className={cn(
                          'cursor-pointer rounded-full border px-3 py-1 text-xs font-medium transition-all',
                          segment === segmentId
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-border/30 text-muted-foreground hover:border-border'
                        )}
                      >
                        {seg}
                      </button>
                    )
                  })}
                </div>
              </div>

              <p className="mt-6 text-xs text-muted-foreground">{trust}</p>
            </form>
          )}
        </motion.div>
      </Container>
    </Section>
  )
}

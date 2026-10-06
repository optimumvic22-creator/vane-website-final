'use client'

import { useEffect, useRef, useState, type FormEvent } from 'react'
import Link from 'next/link'
import { ArrowRight, Check } from 'lucide-react'
import { trackEvent } from '@/lib/analytics'
import { InquiryTimeoutError, submitInquiry } from '@/lib/inquiry-request'
import { validateInquiryFields } from '@/lib/inquiry-field-validation'
import type { AudienceSlug } from '@/lib/audience-content'
import type { Locale } from '@/lib/locale'

const fieldCopy = {
  athlete: {
    context: { en: 'Your sport', de: 'Deine Sportart' },
    contextPlaceholder: { en: 'Football, basketball, volleyball...', de: 'Fußball, Basketball, Volleyball...' },
    message: { en: 'What do you want to understand better?', de: 'Was möchtest du besser verstehen?' },
    messagePlaceholder: {
      en: 'Tell us briefly what you want to learn from your assessment.',
      de: 'Erzähl uns kurz, was du durch dein Assessment verstehen möchtest.',
    },
    success: {
      en: 'Thank you. The VANE team will contact you personally about your assessment at the VANE Training Lab in Vienna. Your request is not a confirmed booking.',
      de: 'Danke. Das VANE Team meldet sich persönlich zu deinem Assessment im VANE Training Lab in Wien. Deine Anfrage ist noch keine bestätigte Buchung.',
    },
  },
  coach: {
    context: { en: 'Role or organization', de: 'Rolle oder Organisation' },
    contextPlaceholder: { en: 'Coach, physio, club, facility...', de: 'Coach, Physio, Verein, Einrichtung...' },
    message: { en: 'How do you assess movement quality today?', de: 'Wie erfasst du Bewegungsqualität heute?' },
    messagePlaceholder: {
      en: 'Tell us who you work with, what you already measure, and how your current testing is organized.',
      de: 'Beschreibe kurz, mit wem du arbeitest, was du bereits misst und wie deine Tests organisiert sind.',
    },
    success: {
      en: 'Thank you. We will review your setup and reply with the next steps for team testing.',
      de: 'Danke. Wir prüfen deinen aktuellen Aufbau und melden uns mit den nächsten Schritten für einen Teamtest.',
    },
  },
  partner: {
    context: { en: 'Organization', de: 'Organisation' },
    contextPlaceholder: { en: 'Company, club, clinic, research team...', de: 'Unternehmen, Verein, Praxis, Forschungsteam...' },
    message: { en: 'What use case do you want to explore?', de: 'Welchen Anwendungsfall möchtest du prüfen?' },
    messagePlaceholder: {
      en: 'Tell us where a movement quality standard could add value.',
      de: 'Beschreibe kurz, wo ein Standard für Bewegungsqualität Wert schaffen könnte.',
    },
    success: {
      en: 'Thank you. We will reply with focused questions and a possible next step.',
      de: 'Danke. Wir antworten mit fokussierten Fragen und einem möglichen nächsten Schritt.',
    },
  },
} as const

function newInquiryKey() {
  const webCrypto = globalThis.crypto
  if (typeof webCrypto?.randomUUID === 'function') return webCrypto.randomUUID()
  // getRandomValues remains available in browsers that do not expose
  // randomUUID in an insecure local-device preview. Never use Math.random.
  const bytes = webCrypto.getRandomValues(new Uint8Array(16))
  bytes[6] = (bytes[6] & 0x0f) | 0x40
  bytes[8] = (bytes[8] & 0x3f) | 0x80
  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
}

export function AudienceInquiryForm({
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
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')
  const [fieldError, setFieldError] = useState<ReturnType<typeof validateInquiryFields>>(null)
  const contextRef = useRef<HTMLInputElement>(null)
  const messageRef = useRef<HTMLTextAreaElement>(null)
  const successRef = useRef<HTMLDivElement>(null)
  const requestPending = useRef(false)
  const submissionKeysRef = useRef(new Map<string, string>())
  const copy = fieldCopy[audience]

  useEffect(() => {
    if (status === 'success') successRef.current?.focus()
  }, [status])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (requestPending.current) return

    setError('')
    const form = new FormData(event.currentTarget)
    const context = String(form.get('context') ?? '').trim()
    const message = String(form.get('message') ?? '').trim()
    const invalidField = validateInquiryFields(context, message, audience, locale)
    setFieldError(invalidField)
    if (invalidField) {
      setStatus('idle')
      const invalidInput = invalidField.field === 'context' ? contextRef : messageRef
      invalidInput.current?.focus()
      return
    }
    requestPending.current = true
    setStatus('submitting')

    try {
      const submission = {
        audience,
        locale,
        source: `audience:${audience}:final`,
        email: String(form.get('email') ?? '').trim().toLowerCase(),
        context,
        message,
        company: String(form.get('company') ?? ''),
      }
      const fingerprint = JSON.stringify(submission)
      let idempotencyKey = submissionKeysRef.current.get(fingerprint)
      if (!idempotencyKey) {
        idempotencyKey = newInquiryKey()
        submissionKeysRef.current.set(fingerprint, idempotencyKey)
      }
      await submitInquiry({ ...submission, idempotencyKey })

    } catch (cause) {
      setStatus('error')
      setError(
        cause instanceof InquiryTimeoutError
          ? locale === 'de'
            ? 'Die Bestätigung ist gerade nicht verfügbar. Deine Anfrage könnte bereits angekommen sein. Bitte versuche es später erneut.'
            : 'Confirmation is currently unavailable. Your request may already have arrived. Please try again later.'
          : locale === 'de'
            ? 'Deine Anfrage konnte nicht bestätigt werden. Deine Eingaben bleiben erhalten. Bitte versuche es später erneut oder schreibe an hello@vanescience.com.'
            : 'Your request could not be confirmed. Your entries are still here. Please try again later or email hello@vanescience.com.',
      )
      return
    } finally {
      requestPending.current = false
    }
    setStatus('success')
    try {
      trackEvent('audience_inquiry_submit', { audience, locale })
    } catch {
      // Analytics cannot turn a confirmed inquiry into a retryable error.
    }
  }

  if (status === 'success') {
    return (
      <div ref={successRef} tabIndex={-1} className="mx-auto mt-8 flex max-w-2xl items-start gap-4 rounded-xl border border-primary/25 bg-primary/[0.06] p-5 text-left focus:outline-none focus:ring-2 focus:ring-primary/70" role="status">
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Check className="h-4 w-4" aria-hidden="true" />
        </span>
        <div>
          <p className="font-semibold text-foreground">{locale === 'de' ? 'Deine Anfrage ist angekommen' : 'Request received'}</p>
          <p className="mt-2 text-sm leading-relaxed text-foreground md:text-base">{copy.success[locale]}</p>
        </div>
      </div>
    )
  }

  const inputClass =
    'min-h-12 w-full rounded-xl border border-white/[0.18] bg-black/35 px-4 text-base text-foreground outline-none transition-colors placeholder:text-muted-foreground/65 hover:border-white/28 focus:border-primary/70 focus:ring-2 focus:ring-primary/15'

  return (
    <form onSubmit={handleSubmit} aria-busy={status === 'submitting'} className="mx-auto mt-8 max-w-2xl text-left">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-[13px] font-medium text-foreground">
          <span>{copy.context[locale]}</span>
          <input
            ref={contextRef}
            name="context"
            readOnly={status === 'submitting'}
            aria-invalid={fieldError?.field === 'context' || undefined}
            aria-describedby={fieldError?.field === 'context' ? `context-error-${audience}` : undefined}
            onChange={() => { if (fieldError?.field === 'context') setFieldError(null) }}
            required
            minLength={2}
            maxLength={160}
            autoComplete={audience === 'athlete' ? 'off' : 'organization'}
            placeholder={copy.contextPlaceholder[locale]}
            className={inputClass}
          />
          {fieldError?.field === 'context' && (
            <span id={`context-error-${audience}`} role="alert" className="text-sm text-red-300">{fieldError.message}</span>
          )}
        </label>
        <label className="grid gap-2 text-[13px] font-medium text-foreground">
          <span>{locale === 'de' ? 'E Mail Adresse' : 'Email address'}</span>
          <input
            type="email"
            name="email"
            readOnly={status === 'submitting'}
            required
            maxLength={320}
            autoComplete="email"
            autoCapitalize="none"
            spellCheck={false}
            placeholder="name@example.com"
            className={inputClass}
          />
        </label>
      </div>
      <label className="mt-4 grid gap-2 text-[13px] font-medium text-foreground">
        <span>{copy.message[locale]}{audience === 'athlete' && ' (optional)'}</span>
        <textarea
          ref={messageRef}
          name="message"
          readOnly={status === 'submitting'}
          aria-invalid={fieldError?.field === 'message' || undefined}
          aria-describedby={fieldError?.field === 'message' ? `message-error-${audience}` : undefined}
          onChange={() => { if (fieldError?.field === 'message') setFieldError(null) }}
          required={audience !== 'athlete'}
          minLength={audience === 'athlete' ? undefined : 2}
          maxLength={600}
          rows={3}
          placeholder={copy.messagePlaceholder[locale]}
          className={`${inputClass} resize-y py-3`}
        />
        {fieldError?.field === 'message' && (
          <span id={`message-error-${audience}`} role="alert" className="text-sm text-red-300">{fieldError.message}</span>
        )}
      </label>
      <div className="absolute left-[-10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor={`company-${audience}`}>Company</label>
        <input id={`company-${audience}`} name="company" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="mt-5 flex flex-col items-center gap-3">
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="inline-flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-wait disabled:opacity-65 sm:w-auto sm:min-w-56"
        >
          {status === 'submitting'
            ? locale === 'de'
              ? 'Wird gesendet...'
              : 'Sending...'
            : cta}
          {status !== 'submitting' && <ArrowRight className="h-4 w-4" aria-hidden="true" />}
        </button>
        {error && (
          <div role="alert" className="w-full rounded-lg border border-red-300/25 bg-red-950/20 p-4 text-sm leading-relaxed text-red-200">
            <p>{error}</p>
            <a href="mailto:hello@vanescience.com" className="mt-2 inline-flex min-h-10 items-center underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">hello@vanescience.com</a>
          </div>
        )}
        <p className="text-center text-xs text-muted-foreground">{note}</p>
        <p className="max-w-xl text-center text-xs leading-relaxed text-muted-foreground">
          {locale === 'de'
            ? 'Bitte teile hier keine medizinischen oder besonders sensiblen Gesundheitsdaten. Details findest du in der '
            : 'Please do not include medical or sensitive health information. Details are available in our '}
          <Link href="/privacy" className="underline decoration-white/25 underline-offset-2 hover:text-foreground">
            {locale === 'de' ? 'Datenschutzerklärung' : 'privacy policy'}
          </Link>
          .
        </p>
      </div>
    </form>
  )
}

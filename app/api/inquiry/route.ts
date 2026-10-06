import { createHash, randomUUID } from 'node:crypto'
import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from '@/sanity/env'
import { parseInquiryInput } from '@/lib/inquiry-schema'
import { apiError, guardJsonRequest, noStoreJson } from '@/lib/request-guard'

export async function POST(request: Request) {
  const guarded = await guardJsonRequest(request)
  if (!guarded.ok) return guarded.response

  const parsed = parseInquiryInput(guarded.payload)
  if (!parsed.success) {
    return apiError(
      400,
      'invalid_request',
      'Please complete the required fields.',
    )
  }

  const { email, audience, context, message, locale, source, company, idempotencyKey } = parsed.data

  if (company) {
    return noStoreJson({ ok: true })
  }

  const token = process.env.SANITY_API_WRITE_TOKEN
  if (!token) {
    return apiError(
      503,
      'service_unavailable',
      'Service temporarily unavailable.',
    )
  }

  const writeClient = createClient({ projectId, dataset, apiVersion, useCdn: false, token })

  try {
    // Domain-separated hashes keep identifiers private and stable without
    // encoding contact details or exposing the client token in a document ID.
    const key = idempotencyKey?.toLowerCase()
    const digest = (purpose: string) => createHash('sha256').update(`${purpose}:${key}`).digest('hex')
    const document = {
      // Dotted IDs keep lead details inaccessible to unauthenticated Sanity reads.
      _id: `vane.inquiry.${key ? digest('inquiry-record-v1') : randomUUID()}`,
      _type: 'audienceInquiry' as const,
      email: email.trim().toLowerCase(),
      audience,
      context,
      message: message || undefined,
      locale,
      source,
      status: 'new',
      createdAt: new Date().toISOString(),
      // Store the notification job atomically with the request. A separate
      // authenticated worker delivers it; success here only means saved.
      deliveryStatus: 'pending',
      deliveryAttempts: 0,
      deliveryEventId: key ? digest('inquiry-event-v1') : randomUUID(),
    }
    if (key) {
      // Sanity performs this atomically. A retry must not reset delivery state
      // or silently acknowledge a changed payload under the same key.
      const stored = await writeClient.createIfNotExists(document)
      if (stored.email !== document.email || stored.audience !== document.audience ||
          stored.context !== document.context || (stored.message ?? undefined) !== document.message ||
          (stored.locale ?? undefined) !== document.locale || (stored.source ?? undefined) !== document.source) {
        return apiError(409, 'idempotency_conflict', 'This request has changed. Please submit it again.')
      }
    } else {
      await writeClient.create(document)
    }
    return noStoreJson({ ok: true })
  } catch {
    return apiError(
      500,
      'request_failed',
      'Could not send your request. Please try again.',
    )
  }
}

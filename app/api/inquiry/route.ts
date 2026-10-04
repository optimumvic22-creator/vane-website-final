import { randomUUID } from 'node:crypto'
import { createClient } from 'next-sanity'
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

  const { email, audience, context, message, locale, source, company } = parsed.data

  if (company) {
    return noStoreJson({ ok: true })
  }

  const token = process.env.SANITY_API_WRITE_TOKEN
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
  const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01'
  if (!token || !projectId || !dataset) {
    return apiError(
      503,
      'service_unavailable',
      'Service temporarily unavailable.',
    )
  }

  const writeClient = createClient({ projectId, dataset, apiVersion, useCdn: false, token })

  try {
    await writeClient.create({
      // Dotted IDs keep lead details inaccessible to unauthenticated Sanity reads.
      _id: `vane.inquiry.${randomUUID()}`,
      _type: 'audienceInquiry',
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
      deliveryEventId: randomUUID(),
    })
    return noStoreJson({ ok: true })
  } catch {
    return apiError(
      500,
      'request_failed',
      'Could not send your request. Please try again.',
    )
  }
}

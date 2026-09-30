import { createClient } from 'next-sanity'
import {
  deliverPendingLeads,
  isLeadDeliveryAuthorized,
  readLeadDeliveryConfiguration,
} from '@/lib/lead-delivery'
import { apiError, noStoreJson } from '@/lib/request-guard'

export const runtime = 'nodejs'
export const maxDuration = 60

/** Called by a trusted scheduler, never by the public signup/inquiry request. */
export async function POST(request: Request) {
  const jobSecret = process.env.LEAD_DELIVERY_JOB_SECRET
  if (!jobSecret || jobSecret.trim().length < 32) {
    return apiError(503, 'service_unavailable', 'Service temporarily unavailable.')
  }
  if (!isLeadDeliveryAuthorized(request.headers.get('authorization'), jobSecret)) {
    return apiError(401, 'unauthorized', 'Unauthorized.')
  }

  const configuration = readLeadDeliveryConfiguration(process.env)
  const token = process.env.SANITY_API_WRITE_TOKEN
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
  if (!configuration || !token || !projectId || !dataset) {
    return apiError(503, 'service_unavailable', 'Service temporarily unavailable.')
  }

  try {
    const client = createClient({
      projectId,
      dataset,
      token,
      apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01',
      useCdn: false,
      perspective: 'raw',
      timeout: 10_000,
      maxRetries: 0,
    })
    const result = await deliverPendingLeads({ client, configuration })
    // Counts only: no email, message, document ID, credentials or provider body.
    return noStoreJson({ ok: result.stateWriteFailed === 0, ...result }, result.stateWriteFailed ? 503 : 200)
  } catch {
    return apiError(503, 'delivery_unavailable', 'Lead delivery temporarily unavailable.')
  }
}

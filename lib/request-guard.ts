import { NextResponse } from 'next/server'

export const MAX_API_JSON_BODY_BYTES = 8 * 1024

type JsonRecord = Record<string, unknown>

export type PlatformRateLimitResult =
  | { allowed: true }
  | { allowed: false; retryAfterSeconds?: number }

/**
 * Adapter point for a distributed, platform-backed rate limiter.
 *
 * Intentionally no in-process fallback is provided: serverless instances do
 * not share memory, so a local counter would create a misleading guarantee.
 */
export type PlatformRateLimitHook = (
  request: Request,
) => Promise<PlatformRateLimitResult>

export type RequestGuardOptions = {
  maxBodyBytes?: number
  rateLimit?: PlatformRateLimitHook
}

export type GuardedJsonResult =
  | { ok: true; payload: unknown }
  | { ok: false; response: NextResponse }

export function noStoreJson(
  body: JsonRecord,
  status = 200,
  headers?: HeadersInit,
) {
  const responseHeaders = new Headers(headers)
  responseHeaders.set('Cache-Control', 'no-store, max-age=0')
  responseHeaders.set('Pragma', 'no-cache')

  return NextResponse.json(body, {
    status,
    headers: responseHeaders,
  })
}

export function apiError(
  status: number,
  code: string,
  error: string,
  headers?: HeadersInit,
) {
  return noStoreJson({ ok: false, code, error }, status, headers)
}

function resolvePublicRequestOrigin(request: Request): string {
  const requestUrl = new URL(request.url)
  const forwardedHost = request.headers
    .get('x-forwarded-host')
    ?.split(',', 1)[0]
    ?.trim()
  const host = forwardedHost || request.headers.get('host')
  if (!host) return requestUrl.origin

  const forwardedProtocol = request.headers
    .get('x-forwarded-proto')
    ?.split(',', 1)[0]
    ?.trim()
    .toLowerCase()
  const protocol =
    forwardedProtocol === 'http' || forwardedProtocol === 'https'
      ? `${forwardedProtocol}:`
      : requestUrl.protocol

  try {
    return new URL(`${protocol}//${host}`).origin
  } catch {
    return requestUrl.origin
  }
}

function rejectCrossOriginBrowserRequest(request: Request): NextResponse | null {
  const requestOrigin = resolvePublicRequestOrigin(request)
  const origin = request.headers.get('origin')

  if (origin) {
    try {
      if (new URL(origin).origin !== requestOrigin) {
        return apiError(403, 'origin_not_allowed', 'Request origin is not allowed.')
      }
    } catch {
      return apiError(403, 'origin_not_allowed', 'Request origin is not allowed.')
    }
  }

  // Sec-Fetch-Site is controlled by browsers. Reject browser requests that are
  // not same-origin even if an Origin header is absent. Non-browser clients do
  // not normally send this header and remain supported.
  const fetchSite = request.headers.get('sec-fetch-site')
  if (fetchSite && fetchSite !== 'same-origin' && fetchSite !== 'none') {
    return apiError(403, 'origin_not_allowed', 'Request origin is not allowed.')
  }

  return null
}

function validateContentLength(
  request: Request,
  maxBodyBytes: number,
): NextResponse | null {
  const value = request.headers.get('content-length')
  if (value === null) return null

  if (!/^\d+$/.test(value)) {
    return apiError(400, 'invalid_content_length', 'Invalid request.')
  }

  const length = Number(value)
  if (!Number.isSafeInteger(length)) {
    return apiError(400, 'invalid_content_length', 'Invalid request.')
  }

  if (length > maxBodyBytes) {
    return apiError(413, 'payload_too_large', 'Request body is too large.')
  }

  return null
}

type BodyReadResult =
  | { ok: true; bytes: Uint8Array }
  | { ok: false; tooLarge: boolean }

async function readBodyWithinLimit(
  request: Request,
  maxBodyBytes: number,
): Promise<BodyReadResult> {
  if (!request.body) return { ok: true, bytes: new Uint8Array() }

  const reader = request.body.getReader()
  const chunks: Uint8Array[] = []
  let totalBytes = 0

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      totalBytes += value.byteLength
      if (totalBytes > maxBodyBytes) {
        try {
          await reader.cancel()
        } catch {
          // The size decision is already final; cancellation is best effort.
        }
        return { ok: false, tooLarge: true }
      }
      chunks.push(value)
    }
  } catch {
    return { ok: false, tooLarge: false }
  } finally {
    reader.releaseLock()
  }

  const bytes = new Uint8Array(totalBytes)
  let offset = 0
  for (const chunk of chunks) {
    bytes.set(chunk, offset)
    offset += chunk.byteLength
  }

  return { ok: true, bytes }
}

export async function guardJsonRequest(
  request: Request,
  options: RequestGuardOptions = {},
): Promise<GuardedJsonResult> {
  const maxBodyBytes = options.maxBodyBytes ?? MAX_API_JSON_BODY_BYTES

  const originError = rejectCrossOriginBrowserRequest(request)
  if (originError) return { ok: false, response: originError }

  const mediaType = request.headers
    .get('content-type')
    ?.split(';', 1)[0]
    .trim()
    .toLowerCase()
  if (mediaType !== 'application/json') {
    return {
      ok: false,
      response: apiError(
        415,
        'unsupported_media_type',
        'Content-Type must be application/json.',
      ),
    }
  }

  const contentLengthError = validateContentLength(request, maxBodyBytes)
  if (contentLengthError) {
    return { ok: false, response: contentLengthError }
  }

  if (options.rateLimit) {
    try {
      const decision = await options.rateLimit(request)
      if (!decision.allowed) {
        const retryAfter =
          decision.retryAfterSeconds &&
          Number.isSafeInteger(decision.retryAfterSeconds) &&
          decision.retryAfterSeconds > 0
            ? String(decision.retryAfterSeconds)
            : undefined

        return {
          ok: false,
          response: apiError(
            429,
            'rate_limited',
            'Too many requests. Please try again later.',
            retryAfter ? { 'Retry-After': retryAfter } : undefined,
          ),
        }
      }
    } catch {
      return {
        ok: false,
        response: apiError(
          503,
          'rate_limit_unavailable',
          'Service temporarily unavailable.',
        ),
      }
    }
  }

  const body = await readBodyWithinLimit(request, maxBodyBytes)
  if (!body.ok && body.tooLarge) {
    return {
      ok: false,
      response: apiError(
        413,
        'payload_too_large',
        'Request body is too large.',
      ),
    }
  }

  if (!body.ok) {
    return {
      ok: false,
      response: apiError(400, 'invalid_json', 'Invalid JSON body.'),
    }
  }

  try {
    const text = new TextDecoder('utf-8', { fatal: true }).decode(body.bytes)
    return { ok: true, payload: JSON.parse(text) }
  } catch {
    return {
      ok: false,
      response: apiError(400, 'invalid_json', 'Invalid JSON body.'),
    }
  }
}

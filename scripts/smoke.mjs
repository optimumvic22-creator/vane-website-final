const DEFAULT_TIMEOUT_MS = 10_000
const CANONICAL_ORIGIN = 'https://vanescience.com'

const publicRoutes = [
  '/',
  '/for/athlete',
  '/for/coach',
  '/for/partner',
  '/team',
  '/investors',
  '/impressum',
  '/privacy',
  '/terms',
]

const pageRoutes = [...publicRoutes, '/robots.txt', '/sitemap.xml']

const requiredHeaders = {
  'x-content-type-options': 'nosniff',
  'x-frame-options': 'DENY',
  'referrer-policy': 'origin-when-cross-origin',
}

function resolveBaseUrl() {
  const rawValue = process.argv[2] || process.env.SMOKE_BASE_URL
  if (!rawValue) {
    throw new Error(
      'Provide a base URL as an argument or through SMOKE_BASE_URL.',
    )
  }

  const url = new URL(rawValue)
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    throw new Error('Smoke test base URL must use HTTP or HTTPS.')
  }

  url.pathname = '/'
  url.search = ''
  url.hash = ''
  return url
}

async function request(url, init = {}) {
  return fetch(url, {
    redirect: 'follow',
    signal: AbortSignal.timeout(DEFAULT_TIMEOUT_MS),
    ...init,
  })
}

function countH1(html) {
  return html.match(/<h1(?:\s|>)/gi)?.length ?? 0
}

async function checkPage(baseUrl, route) {
  const url = new URL(route, baseUrl)
  const response = await request(url)
  if (!response.ok) {
    throw new Error(`${route}: expected 2xx, received ${response.status}`)
  }

  const body = await response.text()
  if (!body.trim()) {
    throw new Error(`${route}: empty response body`)
  }

  if (publicRoutes.includes(route)) {
    const h1Count = countH1(body)
    if (h1Count !== 1) {
      throw new Error(`${route}: expected one H1, received ${h1Count}`)
    }
    checkSecurityHeaders(response, route)
  }

  return { route, response, body }
}

function checkSecurityHeaders(response, route) {
  for (const [header, expectedValue] of Object.entries(requiredHeaders)) {
    const actualValue = response.headers.get(header)
    if (actualValue !== expectedValue) {
      throw new Error(
        `${route}: ${header} expected "${expectedValue}", received "${actualValue}"`,
      )
    }
  }

  const permissionsPolicy = response.headers.get('permissions-policy')
  if (
    !permissionsPolicy?.includes('camera=()') ||
    !permissionsPolicy.includes('microphone=()') ||
    !permissionsPolicy.includes('geolocation=()')
  ) {
    throw new Error(`${route}: required Permissions Policy directives are missing`)
  }
}

function checkSitemap(body) {
  const locations = new Set(
    [...body.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/g)].map(([, value]) => {
      const url = new URL(value.trim())
      if (url.origin !== CANONICAL_ORIGIN || url.search || url.hash) {
        throw new Error('/sitemap.xml: unexpected canonical URL')
      }
      return url.href
    }),
  )

  for (const route of publicRoutes) {
    if (!locations.has(new URL(route, CANONICAL_ORIGIN).href)) {
      throw new Error(`/sitemap.xml: missing canonical URL for ${route}`)
    }
  }
}

async function checkUnknownAudience(baseUrl) {
  const route = '/for/not-a-role'
  const response = await request(new URL(route, baseUrl), { redirect: 'manual' })
  if (response.status !== 404) {
    throw new Error(`${route}: expected 404, received ${response.status}`)
  }
}

async function checkApiGuards(baseUrl, route, checkHoneypot) {
  const cases = [
    {
      name: 'invalid media type',
      contentType: 'text/plain',
      body: '{}',
      status: 415,
      code: 'unsupported_media_type',
    },
    {
      name: 'invalid JSON',
      contentType: 'application/json',
      body: '{"email":',
      status: 400,
      code: 'invalid_json',
    },
    {
      name: 'invalid schema',
      contentType: 'application/json',
      body: '{}',
      status: 400,
      code: 'invalid_request',
    },
  ]

  // Valid lead-shaped payloads are opt-in and used only against the isolated
  // loopback CI server, which has placeholder Sanity IDs and no write token.
  if (checkHoneypot) {
    cases.push({
      name: 'honeypot',
      contentType: 'application/json',
      body: JSON.stringify({
        email: 'smoke@example.invalid',
        audience: 'athlete',
        context: 'CI smoke check',
        message: 'Automated honeypot guard check.',
        company: 'Automated honeypot guard check.',
      }),
      status: 200,
    })
  }

  for (const testCase of cases) {
    const response = await request(new URL(route, baseUrl), {
      method: 'POST',
      headers: {
        'Content-Type': testCase.contentType,
        Origin: baseUrl.origin,
      },
      body: testCase.body,
    })

    if (response.status !== testCase.status) {
      throw new Error(
        `${route}: ${testCase.name} expected ${testCase.status}, received ${response.status}`,
      )
    }

    if (!response.headers.get('cache-control')?.includes('no-store')) {
      throw new Error(`${route}: no-store response header is missing`)
    }

    const payload = await response.json()
    if (
      payload.ok !== (testCase.status === 200) ||
      (testCase.code && payload.code !== testCase.code)
    ) {
      throw new Error(`${route}: unexpected ${testCase.name} response body`)
    }
  }

  return cases.length
}

async function run() {
  const baseUrl = resolveBaseUrl()
  const checkHoneypot = process.env.SMOKE_CHECK_HONEYPOT === '1'
  if (checkHoneypot && !['127.0.0.1', '[::1]', 'localhost'].includes(baseUrl.hostname)) {
    throw new Error('Honeypot smoke checks require an isolated loopback server.')
  }
  const pages = await Promise.all(
    pageRoutes.map((route) => checkPage(baseUrl, route)),
  )

  const sitemap = pages.find(({ route }) => route === '/sitemap.xml')
  if (!sitemap) throw new Error('/sitemap.xml: response is missing')
  checkSitemap(sitemap.body)
  await checkUnknownAudience(baseUrl)

  const apiChecks = await Promise.all([
    checkApiGuards(baseUrl, '/api/inquiry', checkHoneypot),
    checkApiGuards(baseUrl, '/api/waitlist', checkHoneypot),
  ])

  // Never provide a job secret in smoke tests. This must not dispatch contacts.
  const worker = await request(new URL('/api/internal/lead-delivery', baseUrl), { method: 'POST' })
  if (![401, 503].includes(worker.status) || (await worker.json()).ok !== false ||
      !worker.headers.get('cache-control')?.includes('no-store')) {
    throw new Error('Internal lead delivery is not safely denied without authentication.')
  }

  console.log(
    `Smoke test passed: ${pageRoutes.length} routes, ${publicRoutes.length} H1/header/sitemap checks, unknown-audience 404, ${apiChecks.reduce((sum, count) => sum + count, 0)} non-writing API checks, unauthenticated delivery denied.`,
  )
}

run().catch((error) => {
  console.error(
    `Smoke test failed: ${error instanceof Error ? error.message : String(error)}`,
  )
  process.exitCode = 1
})

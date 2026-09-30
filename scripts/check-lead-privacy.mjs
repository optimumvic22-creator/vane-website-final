import { pathToFileURL } from 'node:url'

/**
 * Read-only aggregate audit. Never reads names, email addresses or messages.
 * @param {Record<string, string | undefined>} env
 * @param {typeof fetch} fetcher
 */
export async function checkLeadPrivacy(env = process.env, fetcher = fetch) {
  const project = env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const dataset = env.NEXT_PUBLIC_SANITY_DATASET
  const token = env.SANITY_API_WRITE_TOKEN
  if (!project || !/^[a-z0-9-]+$/.test(project) || !dataset || !/^[a-zA-Z0-9_-]+$/.test(dataset) || !token) {
    throw new Error('Configure the intended Sanity project, dataset and server token before this read-only audit.')
  }
  const url = new URL(`https://${project}.api.sanity.io/v2024-01-01/data/query/${dataset}`)
  url.searchParams.set('query', '{ "total": count(*[_type in $types]), "legacyRootIds": count(*[_type in $types && _id in path("*")]) }')
  url.searchParams.set('$types', JSON.stringify(['waitlistSignup', 'audienceInquiry']))
  const read = async (authenticated) => {
    const response = await fetcher(url, {
      headers: authenticated ? { Authorization: `Bearer ${token}` } : {},
      cache: 'no-store', redirect: 'error', signal: AbortSignal.timeout(10000),
    })
    if (!authenticated && [401, 403].includes(response.status)) return { total: 0, legacyRootIds: 0 }
    if (!response.ok) throw new Error(`Privacy audit request failed (${response.status}); no release approval.`)
    const { result } = await response.json()
    if (!result || !Number.isInteger(result.total) || result.total < 0 || !Number.isInteger(result.legacyRootIds) || result.legacyRootIds < 0) {
      throw new Error('Unexpected aggregate response; no release approval.')
    }
    return result
  }
  const authenticated = await read(true)
  const anonymous = await read(false)
  return {
    totalLeadRecords: authenticated.total,
    legacyRootIdRecords: authenticated.legacyRootIds,
    anonymouslyVisibleLeadRecords: anonymous.total,
    passed: anonymous.total === 0 && authenticated.legacyRootIds === 0,
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const result = await checkLeadPrivacy()
    console.log(JSON.stringify(result, null, 2))
    if (!result.passed) process.exitCode = 1
  } catch (error) {
    console.error(error instanceof Error ? error.message : 'Privacy audit failed.')
    process.exitCode = 1
  }
}

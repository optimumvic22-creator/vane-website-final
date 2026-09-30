import { client } from '@/sanity/lib/client'
import { TEAM_MEMBERS } from '@/lib/queries'
import type { SanityTeamMember } from './team-content'

export const TEAM_READ_TIMEOUT_MS = 5000
export const TEAM_REVALIDATE_SECONDS = 3600

// Only this public read is bounded; lead-write clients retain their own policy.
// Next owns freshness here, without a second CDN or live-invalidation strategy.
const teamClient = client.withConfig({
  useCdn: false,
  perspective: 'published',
  timeout: TEAM_READ_TIMEOUT_MS,
  maxRetries: 0,
})

export async function getTeamMembers(): Promise<SanityTeamMember[] | null> {
  const controller = new AbortController()
  let timer: ReturnType<typeof setTimeout> | undefined
  const deadline = new Promise<never>((_resolve, reject) => {
    timer = setTimeout(() => {
      reject(new Error('team_read_timeout'))
      controller.abort()
    }, TEAM_READ_TIMEOUT_MS)
  })

  try {
    const members = await Promise.race([
      teamClient.fetch<SanityTeamMember[] | null>(TEAM_MEMBERS, {}, {
        signal: controller.signal,
        cache: 'force-cache',
        next: { revalidate: TEAM_REVALIDATE_SECONDS },
      }),
      deadline,
    ])
    return Array.isArray(members) && members.length > 0 ? members : null
  } catch {
    const category = controller.signal.aborted ? 'timeout' : 'request'
    console.warn(`Sanity team read failed (${category}); using built-in fallback.`)
    return null
  } finally {
    clearTimeout(timer)
  }
}

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const cms = vi.hoisted(() => {
  const fetch = vi.fn()
  return { fetch, withConfig: vi.fn(() => ({ fetch })) }
})

vi.mock('@/sanity/lib/client', () => ({ client: { withConfig: cms.withConfig } }))

import { getTeamMembers, TEAM_READ_TIMEOUT_MS, TEAM_REVALIDATE_SECONDS } from './team-data'

beforeEach(() => {
  cms.fetch.mockReset()
  vi.useFakeTimers()
  vi.spyOn(console, 'warn').mockImplementation(() => undefined)
})

afterEach(() => {
  vi.restoreAllMocks()
  vi.useRealTimers()
})

describe('public team read', () => {
  it('uses an isolated published read with no retries and one explicit hourly cache', async () => {
    const members = [{ name: 'Public team fixture' }]
    cms.fetch.mockResolvedValue(members)

    await expect(getTeamMembers()).resolves.toEqual(members)
    expect(cms.withConfig).toHaveBeenCalledWith({
      useCdn: false,
      perspective: 'published',
      timeout: 5000,
      maxRetries: 0,
    })
    expect(cms.fetch).toHaveBeenCalledOnce()
    expect(cms.fetch).toHaveBeenCalledWith(expect.stringContaining('teamMember'), {}, {
      signal: expect.any(AbortSignal),
      cache: 'force-cache',
      next: { revalidate: 3600 },
    })
    expect(TEAM_REVALIDATE_SECONDS).toBe(3600)
    expect(console.warn).not.toHaveBeenCalled()
    expect(vi.getTimerCount()).toBe(0)
  })

  it.each([null, [], {}])('preserves local fallback for empty or invalid response %j', async (response) => {
    cms.fetch.mockResolvedValue(response)
    await expect(getTeamMembers()).resolves.toBeNull()
    expect(vi.getTimerCount()).toBe(0)
  })

  it('returns the fallback and logs only a category on request failure', async () => {
    cms.fetch.mockRejectedValue(new Error('private transport details must not be logged'))
    await expect(getTeamMembers()).resolves.toBeNull()
    expect(console.warn).toHaveBeenCalledExactlyOnceWith(
      'Sanity team read failed (request); using built-in fallback.',
    )
    expect(cms.fetch).toHaveBeenCalledOnce()
    expect(vi.getTimerCount()).toBe(0)
  })

  it('bounds even a stalled transport to five seconds and allows a fresh later read', async () => {
    cms.fetch.mockImplementationOnce(() => new Promise(() => undefined))
    let completed = false
    const read = getTeamMembers().then((result) => {
      completed = true
      return result
    })
    const firstSignal = cms.fetch.mock.calls[0][2].signal as AbortSignal

    await vi.advanceTimersByTimeAsync(TEAM_READ_TIMEOUT_MS - 1)
    expect(completed).toBe(false)
    expect(firstSignal.aborted).toBe(false)
    await vi.advanceTimersByTimeAsync(1)
    await expect(read).resolves.toBeNull()
    expect(firstSignal.aborted).toBe(true)
    expect(console.warn).toHaveBeenCalledExactlyOnceWith(
      'Sanity team read failed (timeout); using built-in fallback.',
    )
    expect(vi.getTimerCount()).toBe(0)

    const recovered = [{ name: 'Recovered team fixture' }]
    cms.fetch.mockResolvedValueOnce(recovered)
    await expect(getTeamMembers()).resolves.toEqual(recovered)
    expect(cms.fetch.mock.calls[1][2].signal).not.toBe(firstSignal)
    expect(cms.fetch.mock.calls[1][2].signal.aborted).toBe(false)
    expect(vi.getTimerCount()).toBe(0)
  })

  it('does not retain a second process-local copy after the framework refreshes data', async () => {
    cms.fetch.mockResolvedValueOnce([{ name: 'Before refresh' }])
      .mockResolvedValueOnce([{ name: 'After refresh' }])
    await expect(getTeamMembers()).resolves.toEqual([{ name: 'Before refresh' }])
    await expect(getTeamMembers()).resolves.toEqual([{ name: 'After refresh' }])
    expect(cms.fetch).toHaveBeenCalledTimes(2)
  })
})

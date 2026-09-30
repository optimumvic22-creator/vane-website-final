import { describe, expect, it, vi } from 'vitest'
import { checkLeadPrivacy } from '../scripts/check-lead-privacy.mjs'

const env = { NEXT_PUBLIC_SANITY_PROJECT_ID: 'testproject', NEXT_PUBLIC_SANITY_DATASET: 'test', SANITY_API_WRITE_TOKEN: 'not-real' }
const response = (total: number, legacyRootIds = 0) => Response.json({ result: { total, legacyRootIds } })

describe('read-only lead privacy release gate', () => {
  it('requires configuration before querying any data', async () => {
    const fetcher = vi.fn()
    await expect(checkLeadPrivacy({}, fetcher)).rejects.toThrow('Configure')
    expect(fetcher).not.toHaveBeenCalled()
  })
  it('checks private IDs and anonymous denial without requesting contact details', async () => {
    const fetcher = vi.fn().mockResolvedValueOnce(response(12)).mockResolvedValueOnce(new Response(null, { status: 401 }))
    expect(await checkLeadPrivacy(env, fetcher)).toEqual({ totalLeadRecords: 12, legacyRootIdRecords: 0, anonymouslyVisibleLeadRecords: 0, passed: true })
    const [url, firstOptions] = fetcher.mock.calls[0]
    expect(url.searchParams.get('query')).not.toMatch(/email|message|context/)
    expect(firstOptions.headers.Authorization).toBe('Bearer not-real')
    expect(fetcher.mock.calls[1][1].headers).toEqual({})
  })
  it('fails the gate for legacy IDs even if the current dataset is private', async () => {
    const fetcher = vi.fn().mockResolvedValueOnce(response(8, 2)).mockResolvedValueOnce(response(0))
    expect((await checkLeadPrivacy(env, fetcher)).passed).toBe(false)
  })
  it('fails the gate when anonymous readers can see leads', async () => {
    const fetcher = vi.fn().mockResolvedValueOnce(response(8)).mockResolvedValueOnce(response(2))
    expect((await checkLeadPrivacy(env, fetcher)).passed).toBe(false)
  })
  it('never interprets server errors as a passed audit', async () => {
    const fetcher = vi.fn().mockResolvedValue(new Response(null, { status: 500 }))
    await expect(checkLeadPrivacy(env, fetcher)).rejects.toThrow('no release approval')
  })
})

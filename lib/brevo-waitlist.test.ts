import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { BrevoConfigurationError, saveBrevoWaitlist } from './brevo-waitlist'

const fetchMock = vi.fn()
beforeEach(() => {
  vi.stubGlobal('fetch', fetchMock)
  fetchMock.mockReset().mockImplementation((_url, options) => Promise.resolve(new Response(null, { status: options.method ? 204 : 404 })))
  for (const [key, value] of Object.entries({
    BREVO_API_KEY: 'private-fixture', BREVO_LIST_GLOBAL: '10', BREVO_LIST_ATHLETE: '11',
    BREVO_LIST_COACH: '12', BREVO_LIST_PARTNER: '13', BREVO_DOI_TEMPLATE_ID: '20',
  })) vi.stubEnv(key, value)
})
afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals() })

describe('Brevo waitlist routing', () => {
  it.each([['athlete', 11], ['coach', 12], ['partner', 13], ['individual', 11], ['gym-clinic', 13]] as const)(
    'adds %s to its audience and global list without changing suppression', async (segment, id) => {
      await saveBrevoWaitlist({ email: 'Person@Example.com', segment, updatesConsent: false })
      expect(fetchMock).toHaveBeenCalledTimes(3)
      const [url, options] = fetchMock.mock.calls[1]
      expect(url).toBe('https://api.brevo.com/v3/contacts')
      expect(JSON.parse(options.body)).toMatchObject({ email: 'person@example.com', listIds: [10, id], updateEnabled: true })
      expect(options.body).not.toMatch(/emailBlacklisted|unlinkListIds|VANE_UPDATES_CONFIRMED/)
    },
  )
  it('requests optional updates through DOI, never through the initial upsert', async () => {
    await saveBrevoWaitlist({ email: 'a@example.com', segment: 'coach', locale: 'de', updatesConsent: true })
    expect(fetchMock).toHaveBeenCalledTimes(4)
    expect(fetchMock.mock.calls[1][1].body).not.toContain('VANE_UPDATES_CONFIRMED')
    const [url, options] = fetchMock.mock.calls[2]
    expect(url).toContain('/contacts/doubleOptinConfirmation')
    expect(JSON.parse(options.body)).toMatchObject({ includeListIds: [10, 12], templateId: 20,
      redirectionUrl: 'https://vanescience.com/waitlist-confirmed?lang=de', attributes: { VANE_UPDATES_CONFIRMED: true } })
  })

  it('does not request DOI for suppressed or already confirmed contacts', async () => {
    for (const existing of [{emailBlacklisted:true}, {attributes:{VANE_UPDATES_CONFIRMED:true}}]) {
      fetchMock.mockClear()
      fetchMock.mockResolvedValueOnce(Response.json({...existing,listIds:[10,12]}))
      await saveBrevoWaitlist({email:'a@example.com',segment:'coach',updatesConsent:true})
      expect(fetchMock).toHaveBeenCalledTimes(2)
      expect(fetchMock.mock.calls.some(([url])=>url.includes('doubleOptin'))).toBe(false)
    }
  })
  it('notifies the admin about a new audience membership', async () => {
    await saveBrevoWaitlist({email:'a@example.com',segment:'athlete',updatesConsent:false})
    const [url,options]=fetchMock.mock.calls[2]
    expect(url).toBe('https://api.brevo.com/v3/smtp/email')
    expect(JSON.parse(options.body)).toMatchObject({to:[{email:'mqs@vanescience.com'}],subject:'VANE Warteliste: athlete'})
    expect(JSON.parse(options.body).headers.idempotencyKey).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-8[0-9a-f]{3}-a[0-9a-f]{3}-[0-9a-f]{12}$/)
  })
  it('fails before writing when the optional confirmation flow is not configured', async () => {
    vi.stubEnv('BREVO_DOI_TEMPLATE_ID', '')
    await expect(saveBrevoWaitlist({ email: 'a@example.com', updatesConsent: true })).rejects.toBeInstanceOf(BrevoConfigurationError)
    expect(fetchMock).not.toHaveBeenCalled()
  })
  it('does not claim success or reveal provider details after a provider error', async () => {
    fetchMock.mockResolvedValue(new Response('private provider details', { status: 401 }))
    await expect(saveBrevoWaitlist({ email: 'a@example.com', updatesConsent: false })).rejects.toThrow('brevo_request_failed')
  })
})

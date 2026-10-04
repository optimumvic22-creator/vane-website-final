import { describe, expect, it } from 'vitest'
import { evaluateLaunchReadiness } from '../scripts/check-launch-readiness.mjs'

const env = {
  NEXT_PUBLIC_SANITY_PROJECT_ID: 'a1b2c3d4', NEXT_PUBLIC_SANITY_DATASET: 'production',
  SANITY_API_WRITE_TOKEN: 'private-storage-fixture',
  LEAD_DELIVERY_JOB_SECRET: 'scheduler-fixture-0000000000000000000000',
  LEAD_DELIVERY_WEBHOOK_SECRET: 'bridge-fixture-0000000000000000000000000',
  LEAD_DELIVERY_WEBHOOK_URL: 'https://bridge.vanescience.com/events',
}
const options = { nodeVersion: '22.23.2', impressumSource: 'Approved company information' }
const failed = (result: ReturnType<typeof evaluateLaunchReadiness>) => result.checks.filter(c => !c.passed).map(c => c.id)

describe('offline launch readiness gate', () => {
  it('accepts Brevo without requiring a Sanity project or delivery bridge', () => {
    const brevo = { BREVO_API_KEY: 'private-fixture', BREVO_LIST_GLOBAL: '6', BREVO_LIST_ATHLETE: '3',
      BREVO_LIST_COACH: '4', BREVO_LIST_PARTNER: '5', BREVO_DOI_TEMPLATE_ID: '1' }
    expect(evaluateLaunchReadiness(brevo, options).blockerCount).toBe(0)
    expect(failed(evaluateLaunchReadiness({ ...brevo, BREVO_LIST_COACH: '3' }, options))).toContain('brevo-lists')
  })
  it('fails closed when the required configuration and legal source are absent', () => {
    expect(evaluateLaunchReadiness({}, { nodeVersion: '22.23.2' }).status).toBe('BLOCKED')
  })
  it('never calls valid configuration a launch approval', () => {
    const report = evaluateLaunchReadiness(env, options)
    expect(report.blockerCount).toBe(0)
    expect(report.status).toBe('MANUAL_ACCEPTANCE_REQUIRED')
    expect(report.manualGates.length).toBeGreaterThan(0)
  })
  it('rejects CI placeholders and unsupported runtimes', () => {
    expect(failed(evaluateLaunchReadiness({ ...env, NEXT_PUBLIC_SANITY_PROJECT_ID: 'ci000000' }, { ...options, nodeVersion: '24.14.0' }))).toEqual(['runtime', 'sanity-project'])
    expect(failed(evaluateLaunchReadiness(env, { ...options, nodeVersion: '22.11.0' }))).toContain('runtime')
  })
  it('rejects short and shared delivery secrets', () => {
    expect(failed(evaluateLaunchReadiness({ ...env, LEAD_DELIVERY_JOB_SECRET: 'short' }, options))).toContain('delivery-job-secret')
    expect(failed(evaluateLaunchReadiness({ ...env, LEAD_DELIVERY_JOB_SECRET: env.LEAD_DELIVERY_WEBHOOK_SECRET }, options))).toContain('separate-delivery-secrets')
  })
  it.each(['http://bridge.vanescience.com', 'https://user:secret@bridge.vanescience.com', 'https://bridge.vanescience.com/#secret', 'https://example.com/events', 'https://localhost/events'])('rejects unusable bridge URL %s', url => {
    expect(failed(evaluateLaunchReadiness({ ...env, LEAD_DELIVERY_WEBHOOK_URL: url }, options))).toContain('delivery-bridge-url')
  })
  it('finds public credentials and deployment seed credentials without echoing them', () => {
    const report = evaluateLaunchReadiness({ ...env, NEXT_PUBLIC_WRITE_TOKEN: 'sensitive-fixture', SANITY_SEED_TOKEN: 'seed-fixture' }, options)
    expect(failed(report)).toContain('no-public-secrets')
    expect(failed(report)).toContain('no-deployment-seed-credentials')
    expect(JSON.stringify(report)).not.toContain('sensitive-fixture')
    expect(JSON.stringify(report)).not.toContain('seed-fixture')
  })
  it('detects the actual pending legal content and jurisdiction review flags', () => {
    expect(failed(evaluateLaunchReadiness(env, { ...options, impressumSource: "const PENDING = 'Wird ergänzt.'; § 5 TMG; RStV" }))).toEqual(['legal-details', 'legal-jurisdiction-review'])
  })
  it('does not include configured credential values or receiver URLs in reports', () => {
    const report = JSON.stringify(evaluateLaunchReadiness(env, options))
    for (const value of [env.SANITY_API_WRITE_TOKEN, env.LEAD_DELIVERY_JOB_SECRET, env.LEAD_DELIVERY_WEBHOOK_SECRET, env.LEAD_DELIVERY_WEBHOOK_URL]) expect(report).not.toContain(value)
  })
})

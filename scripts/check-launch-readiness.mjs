import { readFileSync } from 'node:fs'
import { pathToFileURL } from 'node:url'

const placeholder = /^(?:ci0+|test(?:project)?|dummy|placeholder|example|your[-_ ].*|change[-_ ]?me|not[-_ ]real)$/i
const configured = (value) => typeof value === 'string' && value.trim().length > 0 && !placeholder.test(value.trim())

/**
 * Offline configuration review only. Never contacts services, sends a lead,
 * prints configuration values, or certifies the application ready for release.
 * @param {Record<string, string | undefined>} env
 * @param {{ nodeVersion?: string, impressumSource?: string }} options
 */
export function evaluateLaunchReadiness(env = process.env, options = {}) {
  const checks = []
  const add = (id, passed, message) => checks.push({ id, passed: Boolean(passed), message })
  const [major, minor] = (options.nodeVersion ?? process.versions.node).split('.').map(Number)
  add('runtime', major === 22 && minor >= 12, 'Use Node >=22.12.0 <23 for the release checkout.')

  const project = env.NEXT_PUBLIC_SANITY_PROJECT_ID
  add('sanity-project', configured(project) && /^[a-z0-9-]+$/.test(project ?? ''), 'Configure the real Sanity project, not the CI placeholder.')
  add('sanity-dataset', configured(env.NEXT_PUBLIC_SANITY_DATASET) && /^[a-zA-Z0-9_-]+$/.test(env.NEXT_PUBLIC_SANITY_DATASET ?? ''), 'Select the intended Preview or Production dataset.')
  add('lead-storage', configured(env.SANITY_API_WRITE_TOKEN), 'Configure a server-only lead storage token; its permissions need a separate live check.')

  const jobSecret = env.LEAD_DELIVERY_JOB_SECRET
  const bridgeSecret = env.LEAD_DELIVERY_WEBHOOK_SECRET
  add('delivery-job-secret', configured(jobSecret) && jobSecret.trim().length >= 32, 'Configure a random scheduler secret of at least 32 characters.')
  add('delivery-bridge-secret', configured(bridgeSecret) && bridgeSecret.trim().length >= 32, 'Configure a separate random bridge secret of at least 32 characters.')
  add('separate-delivery-secrets', configured(jobSecret) && configured(bridgeSecret) && jobSecret !== bridgeSecret, 'Scheduler and bridge credentials must be different.')
  let bridgeUrlValid = false
  try {
    const url = new URL(env.LEAD_DELIVERY_WEBHOOK_URL ?? '')
    bridgeUrlValid = url.protocol === 'https:' && !url.username && !url.password && !url.hash &&
      !/^(?:localhost|127\.0\.0\.1|\[::1\])$/.test(url.hostname) &&
      !/(?:^|\.)(?:example\.(?:com|org|net)|invalid|test)$/.test(url.hostname)
  } catch { /* Missing or invalid URL fails the gate without exposing it. */ }
  add('delivery-bridge-url', bridgeUrlValid, 'Configure an actual HTTPS bridge without URL credentials or a fragment; test delivery separately.')

  add('no-public-secrets', !Object.entries(env).some(([key, value]) =>
    key.startsWith('NEXT_PUBLIC_') && /(?:TOKEN|SECRET|PASSWORD|PRIVATE_KEY|WRITE_KEY)/i.test(key) && Boolean(value?.trim())),
  'Do not put credentials in NEXT_PUBLIC variables.')
  add('no-deployment-seed-credentials', !env.SANITY_SEED_TOKEN?.trim() && !env.SANITY_SEED_CONFIRM?.trim(), 'Do not supply local destructive-seed credentials in a deployment environment.')

  const legal = options.impressumSource ?? ''
  add('legal-details', Boolean(legal.trim()) && !/Wird ergänzt|Wird erg[aä]nzt|TODO[^\n]*Firmendaten|\bPENDING\b/i.test(legal), 'Replace legal placeholders with approved real company details.')
  add('legal-jurisdiction-review', Boolean(legal.trim()) && !/\bTMG\b|\bRStV\b/.test(legal), 'Review the current German legal references against the Austrian company context with the legal owner.')

  const blockers = checks.filter((check) => !check.passed).length
  return {
    scope: 'offline-configuration-only',
    status: blockers ? 'BLOCKED' : 'MANUAL_ACCEPTANCE_REQUIRED',
    blockerCount: blockers,
    checks,
    manualGates: [
      'Real Sanity permission and anonymous lead privacy checks',
      'Preview form persistence, team notification, double opt-in and unsubscribe',
      'Hosting-level abuse controls, TLS, redirects and production headers',
      'Legal approval, media rights and working public contact addresses',
      'Real-device accessibility, media and slow-connection acceptance',
      'Reviewed release commit, clean-clone CI, monitoring owner and rollback rehearsal',
    ],
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  let impressumSource = ''
  try {
    impressumSource = readFileSync(new URL('../app/impressum/page.tsx', import.meta.url), 'utf8')
  } catch { /* An unreadable legal page must not pass. */ }
  const report = evaluateLaunchReadiness(process.env, { impressumSource })
  console.log(JSON.stringify(report, null, 2))
  if (report.blockerCount) process.exitCode = 1
}

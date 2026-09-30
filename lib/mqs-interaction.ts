/**
 * Public website explorer range. This presentation scale does not redefine
 * the MQS Engine's separate 0 to 100 scoring contract.
 */
export const MQS_SCORE_MIN = 1
export const MQS_SCORE_MAX = 99

export const MQS_WEB_CONTRACT_ID = 'mqs-website-interaction-contract'
export const MQS_WEB_CONTRACT_VERSION = '1.0.0'

export const MQS_ENGINE_REFERENCE = Object.freeze({
  engineVersion: '0.2.0-provisional',
  scoreModelBundleId: 'mqs-score-model-default',
  scoreModelBundleVersion: '0.1.0',
} as const)

export type MqsDomainCode =
  | 'GAIT'
  | 'POST'
  | 'FORCE'
  | 'POWER'
  | 'MOTOR'
  | 'NEURO'
  | 'DTC'

export type MqsDomainValue = {
  code: string
  label?: string
  score: number
}

export const MQS_DOMAIN_ORDER = Object.freeze([
  'GAIT',
  'POST',
  'FORCE',
  'POWER',
  'MOTOR',
  'NEURO',
  'DTC',
] as const satisfies readonly MqsDomainCode[])

export const MQS_ENGINE_DOMAIN_IDS: Readonly<
  Record<MqsDomainCode, string>
> = Object.freeze({
  GAIT: 'gait',
  POST: 'postural_control',
  FORCE: 'force_capacity',
  POWER: 'power',
  MOTOR: 'motor_control',
  NEURO: 'neuro_response',
  DTC: 'dual_task_cost',
})

/**
 * Mirrors DEFAULT_DOMAIN_WEIGHTS from MQS Engine 0.2.0-provisional.
 * These weights are intentionally presentation data only. The website does
 * not replace the assessment engine or infer cross-domain causality.
 */
export const MQS_DOMAIN_WEIGHTS: Readonly<Record<MqsDomainCode, number>> =
  Object.freeze({
    GAIT: 0.16,
    POST: 0.15,
    FORCE: 0.16,
    POWER: 0.14,
    MOTOR: 0.16,
    NEURO: 0.13,
    DTC: 0.1,
  })

export const MQS_PROFILE_COUPLING_ID =
  'uniform-offset-with-rounding-and-per-domain-clamp-v1'

export const MQS_WEB_CONTRACT = Object.freeze({
  id: MQS_WEB_CONTRACT_ID,
  version: MQS_WEB_CONTRACT_VERSION,
  engine: MQS_ENGINE_REFERENCE,
  presentationScoreBounds: Object.freeze({
    min: MQS_SCORE_MIN,
    max: MQS_SCORE_MAX,
  }),
  domainOrder: MQS_DOMAIN_ORDER,
  engineDomainIds: MQS_ENGINE_DOMAIN_IDS,
  domainWeights: MQS_DOMAIN_WEIGHTS,
  profileCoupling: MQS_PROFILE_COUPLING_ID,
})

export function clampMqsScore(value: number): number {
  if (!Number.isFinite(value)) return MQS_SCORE_MIN
  return Math.min(MQS_SCORE_MAX, Math.max(MQS_SCORE_MIN, value))
}

export function calculateMqsScore(domains: readonly MqsDomainValue[]): number {
  const weightedDomains = domains.filter(
    (domain) =>
      Number.isFinite(domain.score) &&
      Object.hasOwn(MQS_DOMAIN_WEIGHTS, domain.code),
  )

  const totalWeight = weightedDomains.reduce(
    (sum, domain) =>
      sum + MQS_DOMAIN_WEIGHTS[domain.code as MqsDomainCode],
    0,
  )

  if (totalWeight === 0) return MQS_SCORE_MIN

  return (
    weightedDomains.reduce(
      (sum, domain) =>
        sum +
        clampMqsScore(domain.score) *
          MQS_DOMAIN_WEIGHTS[domain.code as MqsDomainCode],
      0,
    ) / totalWeight
  )
}

export function setDomainScore(
  domains: readonly MqsDomainValue[],
  code: string,
  score: number,
): MqsDomainValue[] {
  return domains.map((domain) =>
    domain.code === code
      ? { ...domain, score: Math.round(clampMqsScore(score)) }
      : { ...domain },
  )
}

/**
 * Moves the whole profile toward a requested overall score while retaining
 * the distances between domains wherever the 1 to 99 display bounds allow.
 * At a boundary, only the affected domain is clamped.
 */
export function shiftProfileToMqs(
  domains: readonly MqsDomainValue[],
  requestedScore: number,
): MqsDomainValue[] {
  const target = Math.round(clampMqsScore(requestedScore))
  if (domains.length === 0) return []

  let lowerOffset = MQS_SCORE_MIN - MQS_SCORE_MAX
  let upperOffset = MQS_SCORE_MAX - MQS_SCORE_MIN

  for (let iteration = 0; iteration < 48; iteration += 1) {
    const offset = (lowerOffset + upperOffset) / 2
    const shifted = shiftByOffset(domains, offset)
    const score = calculateMqsScore(shifted)

    if (score < target) {
      lowerOffset = offset
    } else {
      upperOffset = offset
    }
  }

  const candidateOffsets = [
    Math.floor(lowerOffset),
    Math.round((lowerOffset + upperOffset) / 2),
    Math.ceil(upperOffset),
  ]

  return candidateOffsets
    .map((offset) => shiftByOffset(domains, offset))
    .reduce((best, candidate) => {
      const bestDistance = Math.abs(calculateMqsScore(best) - target)
      const candidateDistance = Math.abs(calculateMqsScore(candidate) - target)
      return candidateDistance < bestDistance ? candidate : best
    })
}

function shiftByOffset(
  domains: readonly MqsDomainValue[],
  offset: number,
): MqsDomainValue[] {
  return domains.map((domain) => ({
    ...domain,
    score: Math.round(clampMqsScore(domain.score + offset)),
  }))
}

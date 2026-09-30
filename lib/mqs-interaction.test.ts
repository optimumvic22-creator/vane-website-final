import { describe, expect, it } from 'vitest'
import {
  MQS_DOMAIN_ORDER,
  MQS_DOMAIN_WEIGHTS,
  MQS_ENGINE_DOMAIN_IDS,
  MQS_SCORE_MAX,
  MQS_SCORE_MIN,
  MQS_WEB_CONTRACT,
  calculateMqsScore,
  clampMqsScore,
  setDomainScore,
  shiftProfileToMqs,
  type MqsDomainValue,
} from './mqs-interaction'

const PROFILE: MqsDomainValue[] = [
  { code: 'GAIT', score: 59 },
  { code: 'POST', score: 54 },
  { code: 'FORCE', score: 62 },
  { code: 'POWER', score: 57 },
  { code: 'MOTOR', score: 49 },
  { code: 'NEURO', score: 54 },
  { code: 'DTC', score: 47 },
]

const GOLDEN_WEB_CONTRACT = {
  id: 'mqs-website-interaction-contract',
  version: '1.0.0',
  engine: {
    engineVersion: '0.2.0-provisional',
    scoreModelBundleId: 'mqs-score-model-default',
    scoreModelBundleVersion: '0.1.0',
  },
  presentationScoreBounds: {
    min: 1,
    max: 99,
  },
  domainOrder: ['GAIT', 'POST', 'FORCE', 'POWER', 'MOTOR', 'NEURO', 'DTC'],
  engineDomainIds: {
    GAIT: 'gait',
    POST: 'postural_control',
    FORCE: 'force_capacity',
    POWER: 'power',
    MOTOR: 'motor_control',
    NEURO: 'neuro_response',
    DTC: 'dual_task_cost',
  },
  domainWeights: {
    GAIT: 0.16,
    POST: 0.15,
    FORCE: 0.16,
    POWER: 0.14,
    MOTOR: 0.16,
    NEURO: 0.13,
    DTC: 0.1,
  },
  profileCoupling: 'uniform-offset-with-rounding-and-per-domain-clamp-v1',
} as const

describe('MQS website golden contract', () => {
  it('pins the website mirror to an explicit engine and bundle reference', () => {
    expect(
      MQS_WEB_CONTRACT,
      'Intentional contract changes require an engine review, a version bump, and an updated golden fixture.',
    ).toEqual(GOLDEN_WEB_CONTRACT)
  })

  it('pins domain codes, engine IDs, order, and weights', () => {
    expect(
      MQS_DOMAIN_ORDER,
      'Domain order drift changes the public explorer contract.',
    ).toEqual(GOLDEN_WEB_CONTRACT.domainOrder)
    expect(
      MQS_ENGINE_DOMAIN_IDS,
      'Website domain codes must remain mapped to the pinned engine domain IDs.',
    ).toEqual(GOLDEN_WEB_CONTRACT.engineDomainIds)
    expect(
      MQS_DOMAIN_WEIGHTS,
      'Website weights must mirror the pinned engine bundle exactly.',
    ).toEqual(GOLDEN_WEB_CONTRACT.domainWeights)
  })

  it('pins the separate 01 to 99 presentation bounds', () => {
    expect([MQS_SCORE_MIN, MQS_SCORE_MAX]).toEqual([1, 99])
    expect(
      [
        clampMqsScore(Number.NaN),
        clampMqsScore(Number.NEGATIVE_INFINITY),
        clampMqsScore(0),
        clampMqsScore(100),
        clampMqsScore(Number.POSITIVE_INFINITY),
      ],
      'The explorer must fail low for non-finite input and clamp finite input to 01–99.',
    ).toEqual([1, 1, 1, 99, 1])
  })

  it('pins uniform profile coupling before and after boundary clipping', () => {
    expect(
      shiftProfileToMqs(PROFILE, 60),
      'Away from bounds, the total control must preserve every domain distance.',
    ).toEqual([
      { code: 'GAIT', score: 64 },
      { code: 'POST', score: 59 },
      { code: 'FORCE', score: 67 },
      { code: 'POWER', score: 62 },
      { code: 'MOTOR', score: 54 },
      { code: 'NEURO', score: 59 },
      { code: 'DTC', score: 52 },
    ])
    expect(
      shiftProfileToMqs(PROFILE, 95),
      'Near a bound, only affected domains may clip while the shared offset remains intact.',
    ).toEqual([
      { code: 'GAIT', score: 99 },
      { code: 'POST', score: 95 },
      { code: 'FORCE', score: 99 },
      { code: 'POWER', score: 98 },
      { code: 'MOTOR', score: 90 },
      { code: 'NEURO', score: 95 },
      { code: 'DTC', score: 88 },
    ])
  })
})

describe('MQS interaction model', () => {
  it('uses a complete domain-weight model', () => {
    const totalWeight = Object.values(MQS_DOMAIN_WEIGHTS).reduce(
      (sum, weight) => sum + weight,
      0,
    )

    expect(totalWeight).toBeCloseTo(1, 10)
    expect(Object.keys(MQS_DOMAIN_WEIGHTS)).toHaveLength(7)
  })

  it('calculates the illustrative profile as MQS 55', () => {
    expect(calculateMqsScore(PROFILE)).toBeCloseTo(55, 10)
  })

  it('recalculates the MQS according to the changed domain weight', () => {
    const changed = setDomainScore(PROFILE, 'POWER', 67)

    expect(calculateMqsScore(changed)).toBeCloseTo(56.4, 10)
    expect(changed.find((domain) => domain.code === 'POWER')?.score).toBe(67)
    expect(changed.find((domain) => domain.code === 'GAIT')?.score).toBe(59)
  })

  it('moves the complete profile while preserving its shape away from bounds', () => {
    const shifted = shiftProfileToMqs(PROFILE, 60)

    expect(Math.round(calculateMqsScore(shifted))).toBe(60)
    expect(
      (shifted.find((domain) => domain.code === 'GAIT')?.score ?? 0) -
        (shifted.find((domain) => domain.code === 'POST')?.score ?? 0),
    ).toBe(5)
  })

  it('respects the 01 to 99 explorer bounds at extreme positions', () => {
    const minimum = shiftProfileToMqs(PROFILE, 1)
    const maximum = shiftProfileToMqs(PROFILE, 99)

    expect(minimum.every((domain) => domain.score === 1)).toBe(true)
    expect(maximum.every((domain) => domain.score === 99)).toBe(true)
    expect(calculateMqsScore(minimum)).toBeCloseTo(1, 10)
    expect(calculateMqsScore(maximum)).toBeCloseTo(99, 10)
  })
})

import { describe, expect, it } from 'vitest'
import { median, peers, percentile, position, team } from './coach-normvault'

describe('NormVault comparison demo', () => {
  it('changes the reference, not the athlete measurement', () => {
    const noah = team[0]
    expect(noah).toEqual({ name: 'Noah Berger', sj: 36, dj: 32 })
    expect(percentile(team, 'dj', noah.dj)).toBe(75)
    expect(percentile([...team, ...peers], 'dj', noah.dj)).toBe(19)
    expect(median([...team, ...peers], 'dj')).toBeGreaterThan(median(team, 'dj'))
    expect(peers).toHaveLength(240)
    expect(peers.every(peer => !('name' in peer))).toBe(true)
    for (const result of [...team, ...peers]) {
      expect(position(result.sj, 65)).toBeGreaterThanOrEqual(0)
      expect(position(result.sj, 65)).toBeLessThanOrEqual(100)
      expect(position(result.dj, 65)).toBeGreaterThanOrEqual(0)
      expect(position(result.dj, 65)).toBeLessThanOrEqual(100)
    }
  })
  it('uses midrank percentiles for tied values', () => {
    const sample = [{ sj: 1, dj: 10 }, { sj: 2, dj: 20 }, { sj: 3, dj: 20 }, { sj: 4, dj: 30 }]
    expect(percentile(sample, 'dj', 20)).toBe(50)
    expect(median(sample, 'sj')).toBe(2.5)
    expect(median(sample.slice(0, 3), 'sj')).toBe(2)
  })
})

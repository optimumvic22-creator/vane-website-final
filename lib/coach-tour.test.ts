import { statSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { coachTour, readyTourSteps } from './coach-tour'
import { initialTourState, tourKeyIndex, tourReducer } from './coach-tour-state'

describe('coach product tour', () => {
  it('only renders ready steps, with a minimum of three real images', () => {
    const unavailable = { ...coachTour[0], ready: false }
    expect(readyTourSteps([coachTour[0], coachTour[1], unavailable])).toEqual([])
    expect(readyTourSteps([...coachTour.slice(0, 3), unavailable])).toEqual(coachTour.slice(0, 3))
  })
  it('uses all seven supplied captures in creation-time order, with compressed real assets', () => {
    expect(coachTour).toHaveLength(7)
    expect(coachTour.map(s => s.capturedAt)).toEqual(coachTour.map(s => s.capturedAt).toSorted())
    for (const step of coachTour) {
      expect(step.ready).toBe(true)
      expect(step.image.width).toBe(2400)
      expect(statSync(`public${step.image.src}`).size).toBeLessThanOrEqual(250000)
      for (const locale of ['en', 'de'] as const) {
        expect(step.title[locale].length).toBeGreaterThan(5)
        expect(step.text[locale].length).toBeGreaterThan(40)
        expect(step.alt[locale].length).toBeGreaterThan(40)
      }
    }
  })
  it('supports roving keyboard navigation, wraparound and activation', () => {
    expect(tourKeyIndex('ArrowRight', 6, 7)).toBe(0)
    expect(tourKeyIndex('ArrowDown', 0, 7)).toBe(1)
    expect(tourKeyIndex('ArrowLeft', 0, 7)).toBe(6)
    expect(tourKeyIndex('ArrowUp', 1, 7)).toBe(0)
    expect(tourKeyIndex('Home', 4, 7)).toBe(0)
    expect(tourKeyIndex('End', 1, 7)).toBe(6)
    expect(tourKeyIndex('Enter', 3, 7)).toBe(3)
    expect(tourKeyIndex(' ', 3, 7)).toBe(3)
    expect(tourKeyIndex('Tab', 3, 7)).toBeNull()
    expect(tourKeyIndex('End', 0, 0)).toBeNull()
  })
  it('announces manual navigation and permanently stops automatic changes', () => {
    const auto = tourReducer(initialTourState, { type: 'tick', count: 7 })
    expect(auto.announcement).toBeNull()
    const manual = tourReducer(auto, { type: 'manual', index: 0, count: 7 })
    expect(manual).toMatchObject({ index: 0, manual: true, direction: -1, announcement: 0 })
    expect(tourReducer(manual, { type: 'tick', count: 7 })).toBe(manual)
    expect(tourReducer(initialTourState, { type: 'manual', index: -1, count: 7 }).index).toBe(6)
  })
  it('stops on the first image after two complete cycles without live announcements', () => {
    let state = initialTourState
    for (let i = 0; i < 14; i++) state = tourReducer(state, { type: 'tick', count: 7 })
    expect(state).toMatchObject({ index: 0, cycles: 2, announcement: null })
    expect(tourReducer(state, { type: 'tick', count: 7 })).toBe(state)
  })
})

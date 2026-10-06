import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { observeAudienceNetwork } from './audience-network-observer'

const instances: Array<{ observe: ReturnType<typeof vi.fn>; unobserve: ReturnType<typeof vi.fn>; disconnect: ReturnType<typeof vi.fn> }> = []
beforeEach(() => {
  vi.useFakeTimers()
  instances.length = 0
  vi.stubGlobal('ResizeObserver', class {
    observe = vi.fn()
    unobserve = vi.fn()
    disconnect = vi.fn()
    constructor() { instances.push(this) }
  })
  vi.stubGlobal('window', {
    setTimeout, clearTimeout,
    addEventListener: vi.fn(), removeEventListener: vi.fn(),
    visualViewport: { addEventListener: vi.fn(), removeEventListener: vi.fn() },
  })
  vi.stubGlobal('document', { fonts: { ready: Promise.resolve() } })
  vi.stubGlobal('requestAnimationFrame', (callback: () => void) => setTimeout(callback, 0))
  vi.stubGlobal('cancelAnimationFrame', clearTimeout)
})
afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals() })

describe('shared audience layout observation', () => {
  it('measures a common fan once for all panels and cleans up the last subscriber', async () => {
    const rect = { width: 1440, height: 700 } as DOMRect
    const getBoundingClientRect = vi.fn(() => rect)
    const fan = { getBoundingClientRect } as unknown as Element
    const measures = [vi.fn(), vi.fn(), vi.fn()]
    const stop = measures.map((measure) => observeAudienceNetwork(fan, [{} as Element], measure))
    await vi.advanceTimersByTimeAsync(0)
    expect(instances).toHaveLength(1)
    expect(getBoundingClientRect).toHaveBeenCalledOnce()
    measures.forEach((measure) => expect(measure).toHaveBeenCalledWith(rect))
    stop[0]()
    expect(instances[0].disconnect).not.toHaveBeenCalled()
    stop[1](); stop[2]()
    expect(instances[0].disconnect).toHaveBeenCalledOnce()
    await vi.advanceTimersByTimeAsync(200)
    expect(getBoundingClientRect).toHaveBeenCalledOnce()
    const stopAgain = observeAudienceNetwork(fan, [], vi.fn())
    expect(instances).toHaveLength(2)
    stopAgain()
  })
})

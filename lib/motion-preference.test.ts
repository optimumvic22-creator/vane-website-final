import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

beforeEach(() => vi.resetModules())
afterEach(() => vi.unstubAllGlobals())

describe('session motion preference', () => {
  it('has a safe server default', async () => {
    const store = await import('./motion-preference')
    expect(store.getMotionPaused()).toBe(false)
  })

  it('restores a session pause and notifies all controls on change', async () => {
    const storage = { getItem: vi.fn(() => '1'), setItem: vi.fn() }
    vi.stubGlobal('window', { sessionStorage: storage })
    const store = await import('./motion-preference')
    expect(store.getMotionPaused()).toBe(true)
    const listener = vi.fn()
    const stop = store.subscribeMotionPreference(listener)
    store.setMotionPaused(false)
    expect(store.getMotionPaused()).toBe(false)
    expect(storage.setItem).toHaveBeenLastCalledWith('vane-motion-paused', '0')
    expect(listener).toHaveBeenCalledOnce()
    stop()
    store.setMotionPaused(true)
    expect(listener).toHaveBeenCalledOnce()
  })

  it('preserves the choice when session storage is unavailable', async () => {
    vi.stubGlobal('window', { get sessionStorage() { throw new Error('blocked') } })
    const store = await import('./motion-preference')
    expect(store.getMotionPaused()).toBe(false)
    store.setMotionPaused(true)
    expect(store.getMotionPaused()).toBe(true)
    store.setMotionPaused(false)
    expect(store.getMotionPaused()).toBe(false)
  })
})

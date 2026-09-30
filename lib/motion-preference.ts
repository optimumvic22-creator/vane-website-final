'use client'

import { useSyncExternalStore } from 'react'

const STORAGE_KEY = 'vane-motion-paused'
const listeners = new Set<() => void>()
let preference: boolean | undefined

export function getMotionPaused() {
  if (typeof window === 'undefined') return false
  if (preference === undefined) {
    try {
      preference = window.sessionStorage.getItem(STORAGE_KEY) === '1'
    } catch {
      preference = false
    }
  }
  return preference
}

export function subscribeMotionPreference(listener: () => void) {
  listeners.add(listener)
  return () => { listeners.delete(listener) }
}

export function setMotionPaused(paused: boolean) {
  preference = paused
  try {
    window.sessionStorage.setItem(STORAGE_KEY, paused ? '1' : '0')
  } catch {
    // The in-memory choice remains authoritative if browser storage is blocked.
  }
  listeners.forEach((listener) => listener())
}

export function useMotionPaused() {
  return useSyncExternalStore(subscribeMotionPreference, getMotionPaused, () => false)
}

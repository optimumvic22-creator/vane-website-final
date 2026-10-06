'use client'

import { useEffect, useRef, useState } from 'react'
import { getMotionPaused, subscribeMotionPreference } from './motion-preference'

type MediaPlaybackOptions = {
  minVisibleRatio?: number
  sourceRetentionMs?: number
}

/** No media request is eligible until viewport and browser preferences are known. */
export function useMediaPlayback<T extends HTMLElement = HTMLElement>({
  minVisibleRatio = 0.2,
  sourceRetentionMs = 1500,
}: MediaPlaybackOptions = {}) {
  const mediaContainerRef = useRef<T>(null)
  const [mediaAllowed, setMediaAllowed] = useState(false)
  const [mediaSourceAllowed, setMediaSourceAllowed] = useState(false)

  useEffect(() => {
    const container = mediaContainerRef.current
    if (!container) return

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const connection = (
      navigator as Navigator & {
        connection?: EventTarget & { saveData?: boolean }
      }
    ).connection
    let isInView = false
    let sourceWasAllowed = false
    let evictionTimer: ReturnType<typeof setTimeout> | undefined
    const cancelEviction = () => {
      if (evictionTimer !== undefined) globalThis.clearTimeout(evictionTimer)
      evictionTimer = undefined
    }
    const releaseSource = () => {
      cancelEviction()
      sourceWasAllowed = false
      setMediaSourceAllowed(false)
    }
    const updateEligibility = () => {
      const visible = isInView && document.visibilityState === 'visible'
      const motionDisabled = motionQuery.matches || Boolean(connection?.saveData)
      const canPlay = visible && !motionDisabled && !getMotionPaused()
      // Playback stops immediately. Keeping an already attached source briefly
      // avoids rewinding/rebuffering at a viewport boundary or a quick tab switch.
      setMediaAllowed(canPlay)
      if (motionDisabled) {
        releaseSource()
      } else if (visible) {
        cancelEviction()
        // A manual pause keeps the frame, but never initiates a new media load.
        sourceWasAllowed = sourceWasAllowed || canPlay
        setMediaSourceAllowed(sourceWasAllowed)
      } else if (sourceWasAllowed && evictionTimer === undefined) {
        if (sourceRetentionMs <= 0) releaseSource()
        else evictionTimer = globalThis.setTimeout(releaseSource, sourceRetentionMs)
      } else if (!sourceWasAllowed) {
        setMediaSourceAllowed(false)
      }
    }

    document.addEventListener('visibilitychange', updateEligibility)
    motionQuery.addEventListener('change', updateEligibility)
    connection?.addEventListener('change', updateEligibility)
    const stopPreferenceListener = subscribeMotionPreference(updateEligibility)

    let stopObserving: () => void
    if (typeof IntersectionObserver === 'undefined') {
      const updateBounds = () => {
        const bounds = container.getBoundingClientRect()
        const visibleWidth = Math.max(
          0,
          Math.min(bounds.right, window.innerWidth) - Math.max(bounds.left, 0),
        )
        const visibleHeight = Math.max(
          0,
          Math.min(bounds.bottom, window.innerHeight) - Math.max(bounds.top, 0),
        )
        const area = bounds.width * bounds.height
        isInView =
          area > 0 &&
          visibleWidth > 0 &&
          visibleHeight > 0 &&
          (visibleWidth * visibleHeight) / area >= minVisibleRatio
        updateEligibility()
      }
      const frame = window.requestAnimationFrame(updateBounds)
      window.addEventListener('scroll', updateBounds, { passive: true })
      window.addEventListener('resize', updateBounds)
      stopObserving = () => {
        window.cancelAnimationFrame(frame)
        window.removeEventListener('scroll', updateBounds)
        window.removeEventListener('resize', updateBounds)
      }
    } else {
      const observer = new IntersectionObserver(
        ([entry]) => {
          isInView = entry.isIntersecting && entry.intersectionRatio >= minVisibleRatio
          updateEligibility()
        },
        { threshold: [0, minVisibleRatio] },
      )
      observer.observe(container)
      stopObserving = () => observer.disconnect()
    }

    return () => {
      cancelEviction()
      stopObserving()
      document.removeEventListener('visibilitychange', updateEligibility)
      motionQuery.removeEventListener('change', updateEligibility)
      connection?.removeEventListener('change', updateEligibility)
      stopPreferenceListener()
    }
  }, [minVisibleRatio, sourceRetentionMs])

  return { mediaContainerRef, mediaAllowed, mediaSourceAllowed }
}

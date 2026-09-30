'use client'

import { useEffect, useRef, useState } from 'react'
import { getMotionPaused, subscribeMotionPreference } from './motion-preference'

type MediaPlaybackOptions = {
  minVisibleRatio?: number
}

/** No media request is eligible until viewport and browser preferences are known. */
export function useMediaPlayback<T extends HTMLElement = HTMLElement>({
  minVisibleRatio = 0.2,
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
    const updateEligibility = () => {
      const visibleAndOnline = isInView && document.visibilityState === 'visible' && !connection?.saveData
      const canPlay = visibleAndOnline && !motionQuery.matches && !getMotionPaused()
      // Preserve the current frame on pause, but release offscreen/background media.
      sourceWasAllowed = visibleAndOnline && (sourceWasAllowed || canPlay)
      setMediaSourceAllowed(sourceWasAllowed)
      setMediaAllowed(canPlay)
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
      stopObserving()
      document.removeEventListener('visibilitychange', updateEligibility)
      motionQuery.removeEventListener('change', updateEligibility)
      connection?.removeEventListener('change', updateEligibility)
      stopPreferenceListener()
    }
  }, [minVisibleRatio])

  return { mediaContainerRef, mediaAllowed, mediaSourceAllowed }
}

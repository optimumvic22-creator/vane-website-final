'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { AudienceMotionClip } from '@/components/ui/audience-motion-panel'
import { useMediaPlayback } from '@/lib/use-media-playback'
import { cn } from '@/lib/utils'

type AudienceVideoPlaylistProps = {
  clips: readonly AudienceMotionClip[]
  ariaLabel: string
  className?: string
  mediaClassName?: string
}

export function AudienceVideoPlaylist({
  clips,
  ariaLabel,
  className,
  mediaClassName,
}: AudienceVideoPlaylistProps) {
  const { mediaContainerRef, mediaAllowed, mediaSourceAllowed } = useMediaPlayback()
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([null, null])
  const [activeIndex, setActiveIndex] = useState(0)
  const [activeSlot, setActiveSlot] = useState(0)
  const [startedSource, setStartedSource] = useState<string | null>(null)
  const [advanceRequested, setAdvanceRequested] = useState(false)
  const [readinessVersion, setReadinessVersion] = useState(0)
  const [playbackBlocked, setPlaybackBlocked] = useState(false)
  const [failedSources, setFailedSources] = useState<ReadonlySet<string>>(() => new Set())
  const activeClip = clips[activeIndex]
  const standbySlot = 1 - activeSlot
  const nextIndex = clips.length > 1
    ? Array.from({ length: clips.length - 1 }, (_, offset) => (activeIndex + offset + 1) % clips.length)
      .find((index) => !failedSources.has(clips[index].src))
    : undefined
  const nextClip = nextIndex === undefined ? undefined : clips[nextIndex]
  const canKeepSource = mediaSourceAllowed && !playbackBlocked
  const activeSrc = canKeepSource && activeClip && !failedSources.has(activeClip.src)
    ? activeClip.src
    : undefined
  // Only the successor is warmed, and only after playback actually starts (or
  // a failed active source requires recovery). Never preload the whole playlist.
  const standbySrc = canKeepSource && nextClip && (startedSource === activeClip?.src || advanceRequested)
    ? nextClip.src
    : undefined

  const failSource = useCallback((src: string) => {
    const excluded = new Set(failedSources).add(src)
    setFailedSources(excluded)
    if (src === activeClip?.src) {
      setAdvanceRequested(true)
    } else if (advanceRequested && activeClip && !excluded.has(activeClip.src) &&
      !clips.some((clip) => clip.src !== activeClip.src && !excluded.has(clip.src))) {
      // If every successor failed, replay the surviving clip instead of waiting
      // forever for a buffer that no longer exists.
      const video = videoRefs.current[activeSlot]
      if (video) video.currentTime = activeClip.startOffset ?? 0
      setAdvanceRequested(false)
    }
  }, [activeClip, activeSlot, advanceRequested, clips, failedSources])

  const handlePlayError = useCallback((error: unknown, src: string) => {
    const name = error && typeof error === 'object' && 'name' in error ? error.name : ''
    if (name === 'AbortError') return
    if (name === 'NotAllowedError') setPlaybackBlocked(true)
    else failSource(src)
  }, [failSource])

  useEffect(() => {
    const video = videoRefs.current[activeSlot]
    if (!video) return
    if (!activeSrc) {
      video.pause()
      video.load()
      return
    }
    if (!mediaAllowed || advanceRequested) {
      video.pause()
      return
    }
    let cancelled = false
    void video.play().catch((error: unknown) => {
      if (!cancelled) handlePlayError(error, activeSrc)
    })
    return () => {
      cancelled = true
      video.pause()
    }
  }, [activeSlot, activeSrc, advanceRequested, handlePlayError, mediaAllowed])

  useEffect(() => {
    const video = videoRefs.current[standbySlot]
    if (!video) return
    video.pause()
    if (!standbySrc) video.load()
  }, [standbySlot, standbySrc])

  useEffect(() => {
    if (!advanceRequested || !mediaAllowed || !standbySrc || nextIndex === undefined) return
    const video = videoRefs.current[standbySlot]
    if (!video || video.readyState < 2 || video.seeking) return
    let cancelled = false
    let committed = false
    let videoFrame: number | undefined
    let paintFrame: number | undefined
    const commit = () => {
      if (cancelled || video.getAttribute('src') !== standbySrc) return
      committed = true
      setActiveIndex(nextIndex)
      setActiveSlot(standbySlot)
      setStartedSource(standbySrc)
      setAdvanceRequested(false)
    }

    // The outgoing video remains mounted and visible until the successor has a
    // decoded frame. A fulfilled play promise is the fallback for older engines.
    if (typeof video.requestVideoFrameCallback === 'function') {
      videoFrame = video.requestVideoFrameCallback(commit)
    }
    void video.play().then(() => {
      if (!cancelled && videoFrame === undefined) paintFrame = window.requestAnimationFrame(commit)
    }).catch((error: unknown) => {
      if (!cancelled) handlePlayError(error, standbySrc)
    })

    return () => {
      cancelled = true
      if (videoFrame !== undefined) video.cancelVideoFrameCallback(videoFrame)
      if (paintFrame !== undefined) window.cancelAnimationFrame(paintFrame)
      if (!committed) video.pause()
    }
  }, [advanceRequested, handlePlayError, mediaAllowed, nextIndex, readinessVersion, standbySlot, standbySrc])

  useEffect(() => {
    const videos = videoRefs.current
    return () => {
      videos.forEach((video) => {
        if (!video) return
        video.pause()
        video.removeAttribute('src')
        video.load()
      })
    }
  }, [])

  if (!activeClip) return null

  return (
    <figure
      ref={mediaContainerRef}
      aria-label={ariaLabel}
      className={cn(
        'mx-auto w-full max-w-[420px] overflow-hidden rounded-[12px] border border-white/10 bg-[#050607]',
        className,
      )}
    >
      <div
        className={cn(
          'relative h-[clamp(360px,60svh,440px)] overflow-hidden bg-[#050607] sm:aspect-[9/16] sm:h-auto',
          mediaClassName,
        )}
      >
        {[0, 1].map((slot) => {
          const isActive = slot === activeSlot
          const clip = isActive ? activeClip : nextClip
          const src = isActive ? activeSrc : standbySrc
          return (
            <video
              key={slot}
              ref={(video) => { if (video) videoRefs.current[slot] = video }}
              src={src}
              poster={isActive ? clip?.poster : undefined}
              muted
              playsInline
              preload={src && !isActive ? 'auto' : 'none'}
              tabIndex={-1}
              disablePictureInPicture
              aria-hidden="true"
              onLoadedMetadata={(event) => {
                const video = event.currentTarget
                if (!src || !clip || video.getAttribute('src') !== src) return
                video.playbackRate = clip.playbackRate ?? 1
                if (clip.startOffset) video.currentTime = Math.min(clip.startOffset, Math.max(0, video.duration - 0.15))
              }}
              onLoadedData={() => setReadinessVersion((version) => version + 1)}
              onSeeked={() => setReadinessVersion((version) => version + 1)}
              onPlaying={() => {
                if (isActive && mediaAllowed && src) setStartedSource(src)
              }}
              onEnded={(event) => {
                if (!isActive || !mediaAllowed || !src) return
                if (nextIndex !== undefined) setAdvanceRequested(true)
                else {
                  event.currentTarget.currentTime = clip?.startOffset ?? 0
                  void event.currentTarget.play().catch((error: unknown) => handlePlayError(error, src))
                }
              }}
              onError={(event) => {
                if (src && event.currentTarget.getAttribute('src') === src) failSource(src)
              }}
              className={cn(
                'absolute inset-0 h-full w-full object-contain sm:object-cover',
                clip?.objectPosition ?? 'object-center',
                isActive ? 'opacity-100' : 'opacity-0',
              )}
            />
          )
        })}
      </div>
    </figure>
  )
}

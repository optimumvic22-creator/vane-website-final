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
  const videoRef = useRef<HTMLVideoElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [failedSources, setFailedSources] = useState<ReadonlySet<string>>(
    () => new Set(),
  )
  const activeClip = clips[activeIndex]
  const videoSrc =
    mediaSourceAllowed && activeClip && !failedSources.has(activeClip.src)
      ? activeClip.src
      : undefined

  const playNext = useCallback((failedSource?: string) => {
    const excluded = new Set(failedSources)
    if (failedSource) {
      excluded.add(failedSource)
      setFailedSources(excluded)
    }

    for (let offset = 1; offset <= clips.length; offset += 1) {
      const nextIndex = (activeIndex + offset) % clips.length
      if (!excluded.has(clips[nextIndex].src)) {
        if (nextIndex === activeIndex && videoRef.current) {
          videoRef.current.currentTime = clips[nextIndex].startOffset ?? 0
          void videoRef.current.play().catch(() => undefined)
          return
        }
        setActiveIndex(nextIndex)
        return
      }
    }
    // Every source failed: leave the last poster visible without retrying.
  }, [activeIndex, clips, failedSources])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    if (!videoSrc) {
      video.pause()
      video.load()
      return
    }
    if (!mediaAllowed) {
      video.pause()
      return
    }

    void video.play().catch(() => undefined)
    return () => {
      video.pause()
    }
  }, [videoSrc, mediaAllowed])

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
        <video
          key={activeClip.src}
          ref={videoRef}
          src={videoSrc}
          poster={activeClip.poster}
          muted
          playsInline
          preload="none"
          tabIndex={-1}
          disablePictureInPicture
          aria-hidden="true"
          onLoadedMetadata={(event) => {
            const video = event.currentTarget
            if (!videoSrc || video.getAttribute('src') !== videoSrc) return
            video.playbackRate = activeClip.playbackRate ?? 1

            if (activeClip.startOffset) {
              const latestStart = Math.max(0, video.duration - 0.15)
              video.currentTime = Math.min(activeClip.startOffset, latestStart)
            }

            if (mediaAllowed) void video.play().catch(() => undefined)
          }}
          onEnded={() => {
            if (mediaAllowed && videoSrc) playNext()
          }}
          onError={(event) => {
            if (videoSrc && event.currentTarget.getAttribute('src') === videoSrc) {
              playNext(videoSrc)
            }
          }}
          className={cn(
            'absolute inset-0 h-full w-full object-contain sm:object-cover',
            activeClip.objectPosition ?? 'object-center',
          )}
        />
      </div>
    </figure>
  )
}

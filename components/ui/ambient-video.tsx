'use client'

import { useEffect, useRef, useState } from 'react'
import { useMediaPlayback } from '@/lib/use-media-playback'
import { cn } from '@/lib/utils'

type AmbientVideoProps = {
  src: string
  className?: string
}

/**
 * Decorative background video that loads and plays only in the viewport.
 * Reduced motion, data saver, hidden tabs, and playback
 * errors fall back to the section background without transferring more media.
 */
export function AmbientVideo({ src, className }: AmbientVideoProps) {
  const { mediaContainerRef, mediaAllowed, mediaSourceAllowed } = useMediaPlayback<HTMLDivElement>()
  const videoRef = useRef<HTMLVideoElement>(null)
  const [failedSrc, setFailedSrc] = useState<string | null>(null)
  const videoSrc = mediaSourceAllowed && failedSrc !== src ? src : undefined

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

    void video.play().catch(() => {
      // Browser autoplay policy or an unsupported codec leaves the dark fallback.
    })
    return () => {
      video.pause()
    }
  }, [videoSrc, mediaAllowed])

  return (
    <div ref={mediaContainerRef} aria-hidden="true" className="absolute inset-0">
      {failedSrc !== src ? (
        <video
          key={src}
          ref={videoRef}
          src={videoSrc}
          muted
          loop
          playsInline
          preload="none"
          tabIndex={-1}
          disablePictureInPicture
          onCanPlay={(event) => {
            if (mediaAllowed && videoSrc && event.currentTarget.getAttribute('src') === videoSrc) {
              void event.currentTarget.play().catch(() => undefined)
            }
          }}
          onError={(event) => {
            if (videoSrc && event.currentTarget.getAttribute('src') === videoSrc) {
              setFailedSrc(videoSrc)
            }
          }}
          className={cn('h-full w-full object-cover', className)}
        />
      ) : null}
    </div>
  )
}

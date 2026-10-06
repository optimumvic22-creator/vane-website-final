'use client'

import { useEffect, useRef, useState } from 'react'
import { useMediaPlayback } from '@/lib/use-media-playback'
import { cn } from '@/lib/utils'

type AmbientVideoProps = {
  src: string
  poster?: string
  className?: string
}

/**
 * Decorative background video that loads and plays only in the viewport.
 * Reduced motion, data saver, hidden tabs, and playback
 * errors fall back to the poster without transferring more video.
 */
export function AmbientVideo({ src, poster, className }: AmbientVideoProps) {
  const { mediaContainerRef, mediaAllowed, mediaSourceAllowed } = useMediaPlayback<HTMLDivElement>()
  const videoRef = useRef<HTMLVideoElement>(null)
  const [failedSrc, setFailedSrc] = useState<string | null>(null)
  const videoSrc = mediaSourceAllowed && failedSrc !== src ? src : undefined

  useEffect(() => {
    const video = videoRef.current
    return () => {
      if (!video) return
      video.pause()
      video.removeAttribute('src')
      video.load()
    }
  }, [src])

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

    let cancelled = false
    void video.play().catch((error: unknown) => {
      const name = error && typeof error === 'object' && 'name' in error ? error.name : ''
      if (!cancelled && name !== 'AbortError') {
        setFailedSrc(videoSrc)
      }
    })
    return () => {
      cancelled = true
      video.pause()
    }
  }, [videoSrc, mediaAllowed])

  return (
    <div ref={mediaContainerRef} aria-hidden="true" className="absolute inset-0">
      <video
        key={src}
        ref={videoRef}
        src={videoSrc}
        poster={poster}
        muted
        loop
        playsInline
        preload="none"
        tabIndex={-1}
        disablePictureInPicture
        onError={(event) => {
          if (videoSrc && event.currentTarget.getAttribute('src') === videoSrc) {
            setFailedSrc(videoSrc)
          }
        }}
        className={cn('h-full w-full object-cover', className)}
      />
    </div>
  )
}

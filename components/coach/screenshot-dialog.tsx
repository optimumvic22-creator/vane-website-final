'use client'

import Image from 'next/image'
import { X } from 'lucide-react'
import { Dialog } from 'radix-ui'
import { useId } from 'react'
import type { Locale } from '@/lib/locale'

export function ScreenshotDialogContent({
  image,
  title,
  alt,
  locale,
  description,
}: {
  image: { src: string; width: number; height: number }
  title: string
  alt: string
  locale: Locale
  description?: string
}) {
  const descriptionId = useId()
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-sm" />
      <Dialog.Content
        aria-describedby={description ? descriptionId : undefined}
        className="fixed left-1/2 top-1/2 z-[101] w-[calc(100vw-2rem)] -translate-x-1/2 -translate-y-1/2 outline-none"
        style={{
          maxWidth: `min(1400px, calc((100dvh - 7rem) * ${image.width / image.height}))`,
        }}
      >
        <Dialog.Title className="sr-only">{title}</Dialog.Title>
        <Image
          src={image.src}
          width={image.width}
          height={image.height}
          alt={alt}
          unoptimized
          draggable={false}
          className="block h-auto w-full rounded-lg border border-white/15 bg-[#0B0C0E] shadow-2xl"
        />
        {description ? (
          <Dialog.Description id={descriptionId} className="absolute inset-x-0 top-full mt-3 text-center text-xs leading-relaxed text-white/70">
            {description}
          </Dialog.Description>
        ) : null}
        <Dialog.Close asChild>
          <button
            type="button"
            aria-label={locale === 'de' ? 'Screenshot schließen' : 'Close screenshot'}
            className="absolute -top-12 right-0 flex size-11 items-center justify-center rounded-full border border-white/20 bg-black/70 text-white outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <X size={20} />
          </button>
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  )
}

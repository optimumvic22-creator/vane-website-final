'use client'

import Image from 'next/image'
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react'
import { Dialog } from 'radix-ui'
import { useRef, useState } from 'react'
import { coachReportImages, coachReportUi } from '@/lib/coach-report'
import { tourKeyIndex } from '@/lib/coach-tour-state'
import type { Locale } from '@/lib/locale'
import { ScreenshotDialogContent } from './screenshot-dialog'

export function CoachReport({ locale }: { locale: Locale }) {
  const [index, setIndex] = useState(0)
  const tabs = useRef<(HTMLButtonElement | null)[]>([])
  const capture = coachReportImages[index]
  const ui = coachReportUi[locale]
  const choose = (next: number) => setIndex((next + coachReportImages.length) % coachReportImages.length)

  return (
    <Dialog.Root>
      <figure className="coach-report" aria-label={ui.gallery}>
        <p className="coach-report-label">{ui.label}</p>
        <div
          role="tabpanel"
          id="coach-report-panel"
          aria-labelledby={`coach-report-tab-${capture.id}`}
        >
          <Dialog.Trigger asChild>
            <button
              type="button"
              className="coach-report-preview"
              aria-label={`${ui.expand}: ${capture.title[locale]}`}
            >
              <Image
                src={capture.image.src}
                width={capture.image.width}
                height={capture.image.height}
                alt={capture.alt[locale]}
                sizes="(min-width: 1024px) 42vw, calc(100vw - 40px)"
                unoptimized
                draggable={false}
                className="coach-report-image"
              />
              <span aria-hidden className="coach-report-expand"><Maximize2 size={18} /></span>
            </button>
          </Dialog.Trigger>
        </div>
        <div className="coach-report-controls">
          <button type="button" aria-label={ui.previous} onClick={() => choose(index - 1)}>
            <ChevronLeft size={18} aria-hidden />
          </button>
          <p className="coach-report-position" role="status" aria-atomic="true">
            {String(index + 1).padStart(2, '0')} / 03 · {capture.title[locale]}
          </p>
          <button type="button" aria-label={ui.next} onClick={() => choose(index + 1)}>
            <ChevronRight size={18} aria-hidden />
          </button>
        </div>
        <div
          role="tablist"
          aria-label={ui.gallery}
          className="coach-report-tabs"
          onKeyDown={(event) => {
            const next = tourKeyIndex(event.key, index, coachReportImages.length)
            if (next === null) return
            event.preventDefault()
            choose(next)
            tabs.current[next]?.focus()
          }}
        >
          {coachReportImages.map((item, i) => (
            <button
              key={item.id}
              ref={(element) => { tabs.current[i] = element }}
              type="button"
              role="tab"
              id={`coach-report-tab-${item.id}`}
              aria-controls="coach-report-panel"
              aria-selected={index === i}
              tabIndex={index === i ? 0 : -1}
              onClick={() => choose(i)}
            >
              <span aria-hidden>{String(i + 1).padStart(2, '0')}</span>
              {item.title[locale]}
            </button>
          ))}
        </div>
        <figcaption className="coach-report-disclaimer">{ui.disclaimer}</figcaption>
      </figure>
      <ScreenshotDialogContent image={capture.image} title={capture.title[locale]} alt={capture.alt[locale]} locale={locale} description={ui.disclaimer} />
    </Dialog.Root>
  )
}

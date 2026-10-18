'use client'

import { usePathname } from 'next/navigation'
import { useOptionalLocale } from '@/lib/locale'

export default function Loading() {
  const locale = useOptionalLocale()?.locale ?? 'en'
  const isCoachPage = usePathname() === '/for/coach'

  return (
    <div role="status" className={`flex ${isCoachPage ? 'min-h-[calc(100svh-4rem)]' : 'min-h-[60vh]'} flex-col items-center justify-center gap-4`}>
      <div aria-hidden="true" className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent motion-reduce:animate-none" />
      <p className="text-sm text-muted-foreground">
        {locale === 'de' ? 'Inhalt wird geladen' : 'Loading content'}
      </p>
    </div>
  )
}

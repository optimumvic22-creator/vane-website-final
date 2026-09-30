'use client'

import { useOptionalLocale } from '@/lib/locale'

export default function Loading() {
  const locale = useOptionalLocale()?.locale ?? 'en'

  return (
    <div role="status" className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <div aria-hidden="true" className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent motion-reduce:animate-none" />
      <p className="text-sm text-muted-foreground">
        {locale === 'de' ? 'Inhalt wird geladen' : 'Loading content'}
      </p>
    </div>
  )
}

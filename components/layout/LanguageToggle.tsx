'use client'

import { cn } from '@/lib/utils'
import { useLocale } from '@/lib/locale'

export function LanguageToggle({ className }: { className?: string }) {
  const { locale, setLocale } = useLocale()

  return (
    <div
      role="group"
      aria-label={locale === 'de' ? 'Sprache' : 'Language'}
      className={cn(
        'inline-flex h-11 overflow-hidden rounded-full border border-border/25 bg-card/80',
        className,
      )}
    >
      <button
        type="button"
        aria-pressed={locale === 'en'}
        onClick={() => setLocale('en')}
        className="relative flex min-w-11 cursor-pointer items-center justify-center px-3 focus-visible:z-20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
      >
        {locale === 'en' && (
          <span className="absolute inset-0 rounded-full bg-primary" />
        )}
        <span className={cn(
          'relative z-10 text-[0.6875rem] font-medium uppercase tracking-[0.08em]',
          locale === 'en' ? 'text-primary-foreground' : 'text-muted-foreground',
        )}>
          EN
        </span>
      </button>
      <button
        type="button"
        aria-pressed={locale === 'de'}
        onClick={() => setLocale('de')}
        className="relative flex min-w-11 cursor-pointer items-center justify-center px-3 focus-visible:z-20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
      >
        {locale === 'de' && (
          <span className="absolute inset-0 rounded-full bg-primary" />
        )}
        <span className={cn(
          'relative z-10 text-[0.6875rem] font-medium uppercase tracking-[0.08em]',
          locale === 'de' ? 'text-primary-foreground' : 'text-muted-foreground',
        )}>
          DE
        </span>
      </button>
    </div>
  )
}

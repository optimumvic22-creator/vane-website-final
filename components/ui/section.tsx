import { cn } from '@/lib/utils'
import type { HTMLAttributes } from 'react'

const spacingMap = {
  sm: 'py-8 md:py-12',
  md: 'py-12 md:py-16',
  lg: 'py-16 md:py-24',
  xl: 'py-20 md:py-28',
}

const bgMap = {
  default: '',
  surface: 'bg-card/50',
  elevated: 'bg-card',
}

interface SectionProps extends HTMLAttributes<HTMLElement> {
  spacing?: keyof typeof spacingMap
  background?: keyof typeof bgMap
  divided?: boolean
}

export function Section({
  spacing = 'lg',
  background = 'default',
  divided = false,
  className,
  children,
  ...props
}: SectionProps) {
  return (
    <section
      data-slot="section"
      className={cn(
        spacingMap[spacing],
        bgMap[background],
        divided && 'border-t border-border/20',
        className,
      )}
      {...props}
    >
      {children}
    </section>
  )
}

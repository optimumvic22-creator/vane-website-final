import { cn } from '@/lib/utils'
import { type ElementType, type HTMLAttributes } from 'react'

interface TypographyProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType
}

export function H1({ as: Tag = 'h1', className, children, ...props }: TypographyProps) {
  return (
    <Tag
      data-slot="h1"
      className={cn(
        'font-display text-5xl font-bold uppercase leading-[0.95] tracking-[0.02em] text-foreground [-webkit-text-stroke:0.2px_currentColor] [paint-order:stroke_fill] md:text-6xl lg:text-7xl',
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  )
}

export function H2({ as: Tag = 'h2', className, children, ...props }: TypographyProps) {
  return (
    <Tag
      data-slot="h2"
      className={cn(
        'font-display text-4xl font-bold uppercase leading-[0.98] tracking-[0.02em] text-foreground [-webkit-text-stroke:0.2px_currentColor] [paint-order:stroke_fill] md:text-5xl lg:text-6xl',
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  )
}

export function H3({ as: Tag = 'h3', className, children, ...props }: TypographyProps) {
  return (
    <Tag
      data-slot="h3"
      className={cn(
        'font-display text-xl font-bold uppercase leading-none tracking-[0.02em] text-foreground [-webkit-text-stroke:0.15px_currentColor] [paint-order:stroke_fill] md:text-2xl',
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  )
}

export function H4({ as: Tag = 'h4', className, children, ...props }: TypographyProps) {
  return (
    <Tag
      data-slot="h4"
      className={cn('font-sans text-lg font-medium leading-[1.3] tracking-[-0.01em] text-foreground md:text-xl', className)}
      {...props}
    >
      {children}
    </Tag>
  )
}

export function Lead({ as: Tag = 'p', className, children, ...props }: TypographyProps) {
  return (
    <Tag
      data-slot="lead"
      className={cn('font-sans text-[17px] leading-[1.55] text-muted-foreground md:text-lg', className)}
      {...props}
    >
      {children}
    </Tag>
  )
}

export function Body({ as: Tag = 'p', className, children, ...props }: TypographyProps) {
  return (
    <Tag
      data-slot="body"
      className={cn('font-sans text-base leading-[1.58] text-muted-foreground md:text-[17px]', className)}
      {...props}
    >
      {children}
    </Tag>
  )
}

export function Caption({ as: Tag = 'p', className, children, ...props }: TypographyProps) {
  return (
    <Tag
      data-slot="caption"
      className={cn('font-sans text-sm leading-[1.55] text-muted-foreground', className)}
      {...props}
    >
      {children}
    </Tag>
  )
}

export function Overline({ as: Tag = 'p', className, children, ...props }: TypographyProps) {
  return (
    <Tag
      data-slot="overline"
      className={cn(
        'font-sans text-[13px] font-medium uppercase tracking-[0.1em] text-[var(--mqs-value-inv)] md:text-sm',
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  )
}

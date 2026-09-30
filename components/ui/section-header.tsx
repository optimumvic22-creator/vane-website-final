import { type ElementType } from 'react'
import { cn } from '@/lib/utils'
import { H2, Lead, Overline } from './typography'

interface SectionHeaderProps {
  overline?: string
  title: string
  description?: string
  align?: 'left' | 'center'
  className?: string
  /** Element the title renders as. Defaults to `h2`; pass `h1` for the main page heading. */
  titleAs?: ElementType
}

export function SectionHeader({
  overline,
  title,
  description,
  align = 'left',
  className,
  titleAs,
}: SectionHeaderProps) {
  return (
    <div
      data-slot="section-header"
      className={cn(
        'mb-12 max-w-3xl space-y-4',
        align === 'center' && 'mx-auto text-center',
        className,
      )}
    >
      {overline && <Overline>{overline}</Overline>}
      <H2 as={titleAs}>{title}</H2>
      {description && <Lead>{description}</Lead>}
    </div>
  )
}

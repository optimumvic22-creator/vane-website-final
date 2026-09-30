import { cn } from '@/lib/utils'
import type { HTMLAttributes } from 'react'

const sizeMap = {
  sm: 'max-w-3xl',
  md: 'max-w-5xl',
  lg: 'max-w-7xl',
  xl: 'max-w-[96rem]',
}

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  size?: keyof typeof sizeMap
}

export function Container({
  size = 'lg',
  className,
  children,
  ...props
}: ContainerProps) {
  return (
    <div
      data-slot="container"
      className={cn('mx-auto px-5 md:px-8', sizeMap[size], className)}
      {...props}
    >
      {children}
    </div>
  )
}

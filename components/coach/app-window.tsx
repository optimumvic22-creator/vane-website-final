import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
export function AppWindow({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={cn('relative isolate w-full', className)}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-5 left-[20%] -z-10 h-24 w-[60%] rounded-full bg-[radial-gradient(ellipse,rgba(129,216,207,.07),transparent)] blur-2xl"
      />
      <div className="flex aspect-[16/10] flex-col overflow-hidden rounded-[14px] border border-white/10 bg-[#0B0C0E] shadow-[0_30px_80px_rgba(0,0,0,.45)]">
        <div
          aria-hidden="true"
          className="flex h-[30px] shrink-0 items-center gap-1.5 border-b border-white/5 px-3"
        >
          <span className="size-2 rounded-full bg-[#3a3c3f]" />
          <span className="size-2 rounded-full bg-[#3a3c3f]" />
          <span className="size-2 rounded-full bg-[#3a3c3f]" />
        </div>
        <div className="relative min-h-0 flex-1 overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  )
}

import type { ReactNode } from 'react'
export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="relative mx-auto aspect-[9/19.5] w-full max-w-[270px] overflow-hidden rounded-[44px] border-[10px] border-[#111] bg-black shadow-[0_30px_80px_rgba(0,0,0,.45)]">
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-2 z-10 h-6 w-24 -translate-x-1/2 rounded-full bg-black"
      />
      {children}
    </div>
  )
}

import { cn } from '@/lib/utils'

export function AudienceEyebrow({
  children,
  className,
}: {
  children: string
  className?: string
}) {
  return (
    <p
      className={cn(
        'inline-flex items-center gap-2.5 font-sans text-[12.6px] font-semibold uppercase leading-[1.25] tracking-[0.08em] text-white/70 md:text-[13.65px]',
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="h-1 w-1 shrink-0 bg-[var(--mqs-value-inv)]"
      />
      <span>{children}</span>
    </p>
  )
}

export function ProcessStepCard({
  step,
  index,
  className,
  joined = false,
}: {
  step: { title: string; description: string }
  index: number
  className?: string
  joined?: boolean
}) {
  return (
    <article
      className={cn(
        'relative bg-[#0B0C0E] p-4 sm:p-5 md:p-6',
        !joined && 'rounded-xl border border-white/10',
        className,
      )}
    >
      <span className="font-mono text-xs tracking-[0.12em] text-primary">
        0{index + 1}
      </span>
      <h3 className="mt-4 font-display text-[1.75rem] font-bold uppercase leading-[1.1] tracking-[0.02em] text-foreground [-webkit-text-stroke:0.15px_currentColor] [paint-order:stroke_fill] md:mt-6 md:text-[2rem]">
        {step.title}
      </h3>
      <p className="mt-2 text-[15px] leading-[1.55] text-muted-foreground md:mt-3">
        {step.description}
      </p>
    </article>
  )
}

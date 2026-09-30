'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { sectionReveal } from '@/lib/motion'
import { useLocale } from '@/lib/locale'
import { Container } from '@/components/ui/container'

const en = {
  line: "We're building the standard for human movement quality.",
  link: 'For investors',
}

const de = {
  line: 'Wir bauen den Standard für Human Movement Quality.',
  link: 'Für Investoren',
}

/** Understated one-line strip pointing to the investor page. */
export function InvestorTeaserSection() {
  const { locale } = useLocale()
  const t = locale === 'de' ? de : en

  return (
    <section className="border-t border-border/20">
      <Container>
        <motion.div
          {...sectionReveal()}
          className="flex flex-col items-start justify-between gap-4 py-10 sm:flex-row sm:items-center"
        >
          <p className="text-base font-normal text-muted-foreground md:text-lg">
            {t.line}
          </p>
          <Link
            href="/investors"
            className="group inline-flex shrink-0 items-center gap-2.5 font-mono text-xs uppercase tracking-[0.18em] text-foreground/70 transition-colors hover:text-primary"
          >
            {t.link}
            <span
              aria-hidden="true"
              className="inline-block transition-transform duration-[260ms] [transition-timing-function:cubic-bezier(.16,1,.3,1)] group-hover:translate-x-1"
            >
              &rarr;
            </span>
          </Link>
        </motion.div>
      </Container>
    </section>
  )
}

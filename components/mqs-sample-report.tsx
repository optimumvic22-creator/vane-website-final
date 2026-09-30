'use client'

import { motion } from 'framer-motion'
import { sectionReveal } from '@/lib/motion'
import { useLocale } from '@/lib/locale'
import { DOMAIN_COLORS } from '@/lib/domain-colors'
import { DEFAULT_DOMAINS, DOMAIN_DESCRIPTIONS } from '@/components/ui/mqs-interactive'

/* ── Illustrative sample data ─────────────────────────────────────────
   Not real client data. Scores are varied around the age-group norm
   (50 = average) to show plausible above/below-average results. The three
   lowest domains drive the "priorities" block below. */

const OVERALL_SCORE = 58

const SAMPLE_SCORES: Record<string, number> = {
  GAIT: 64,
  POST: 47,
  FORCE: 62,
  POWER: 55,
  MOTOR: 44,
  NEURO: 59,
  DTC: 43,
}

/** Decision oriented next steps derived from the three lowest domains.
    Training oriented and probabilistic. No clinical claims. */
const PRIORITIES: Array<{ code: string; en: string; de: string }> = [
  {
    code: 'DTC',
    en: 'Stabilise movement quality under cognitive load',
    de: 'Bewegungsqualität unter kognitiver Last stabilisieren',
  },
  {
    code: 'MOTOR',
    en: 'Focus: landing quality & joint alignment under load',
    de: 'Fokus: Landequalität & Gelenkausrichtung unter Belastung',
  },
  {
    code: 'POST',
    en: 'Build balance & body control in dynamic tasks',
    de: 'Balance & Körperkontrolle in dynamischen Aufgaben aufbauen',
  },
]

const COPY = {
  en: {
    title: 'Movement Quality Score',
    illustrative: 'Illustrative',
    norm: 'compared to your age group',
    average: '50 = average',
    priorities: 'Your priorities',
    prioritiesNote: 'Where training makes the biggest difference.',
    retest: 'Retest in 12 weeks to see change',
    note: 'Illustrative example. Not real client data.',
    aboveAvg: 'above average',
    belowAvg: 'below average',
  },
  de: {
    title: 'Movement Quality Score',
    illustrative: 'Beispiel',
    norm: 'verglichen mit deiner Altersgruppe',
    average: '50 = Durchschnitt',
    priorities: 'Deine Prioritäten',
    prioritiesNote: 'Wo Training den größten Unterschied macht.',
    retest: 'Retest nach 12 Wochen zeigt die Veränderung',
    note: 'Beispielhafte Darstellung. Keine echten Kundendaten.',
    aboveAvg: 'über dem Durchschnitt',
    belowAvg: 'unter dem Durchschnitt',
  },
}

export function MqsSampleReport() {
  const { locale } = useLocale()
  const isDE = locale === 'de'
  const t = isDE ? COPY.de : COPY.en

  const domains = DEFAULT_DOMAINS.map(d => ({
    code: d.code,
    label: isDE ? (d.labelDe || d.label) : d.label,
    description: isDE ? DOMAIN_DESCRIPTIONS[d.code]?.de : DOMAIN_DESCRIPTIONS[d.code]?.en,
    score: SAMPLE_SCORES[d.code] ?? 50,
  }))

  return (
    <motion.div
      {...sectionReveal(0.1)}
      className="relative overflow-hidden rounded-2xl border border-border/20 bg-card/30 p-6 backdrop-blur-xl md:p-8"
      style={{
        boxShadow:
          'inset 0 1px 0 rgba(255, 255, 255, 0.04), 0 40px 80px -40px rgba(0, 0, 0, 0.6)',
      }}
    >
      {/* subtle brand wash */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background: 'transparent',
        }}
      />

      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="relative">
        <div className="mb-5 flex items-center justify-between gap-3 border-b border-border/10 pb-4">
          <h4 className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/80">
            {t.title}
          </h4>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border/25 bg-white/[0.03] px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
            <span aria-hidden="true" className="h-1 w-1 rounded-full bg-foreground/50" />
            {t.illustrative}
          </span>
        </div>

        {/* Overall score + norm framing */}
        <div className="flex items-end gap-3">
          <span className="font-mono text-5xl font-light leading-none tracking-tight text-[var(--mqs-value-inv)] tabular-nums md:text-6xl">
            {OVERALL_SCORE}
          </span>
          <span className="mb-1 text-sm leading-snug text-foreground/70">
            · {t.norm}
          </span>
        </div>

        {/* Overall scale with 50 = average marker */}
        <div className="mt-4">
          <div
            className="relative h-1.5 overflow-hidden rounded-full bg-border/20"
            role="progressbar"
            aria-valuenow={OVERALL_SCORE}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${t.title}: ${OVERALL_SCORE}, ${t.norm}`}
          >
            <div
              className="h-full rounded-full bg-[var(--mqs-accent)]"
              style={{ width: `${OVERALL_SCORE}%` }}
            />
            {/* average tick at 50 */}
            <span
              aria-hidden="true"
              className="absolute top-[-3px] h-[calc(100%+6px)] w-px bg-foreground/40"
              style={{ left: '50%' }}
            />
          </div>
          <div className="mt-1.5 flex justify-between font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground/60">
            <span>0</span>
            <span>{t.average}</span>
            <span>100</span>
          </div>
        </div>
      </div>

      {/* ── 7 domains ──────────────────────────────────────────────── */}
      <ul className="relative mt-7 flex flex-col gap-4">
        {domains.map(domain => {
          const color = DOMAIN_COLORS[domain.code] || 'var(--mqs-accent)'
          const above = domain.score >= 50
          return (
            <li key={domain.code}>
              <div className="flex items-baseline justify-between gap-3">
                <div className="flex items-baseline gap-2">
                  <span
                    aria-hidden="true"
                    className="inline-block h-1.5 w-1.5 flex-shrink-0 translate-y-[-1px] rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  <span
                    className="font-mono text-[10px] uppercase tracking-[0.16em]"
                    style={{ color }}
                  >
                    {domain.code}
                  </span>
                  <span className="text-[13px] text-foreground/85">{domain.label}</span>
                </div>
                <span className="flex-shrink-0 font-mono text-[15px] tabular-nums text-foreground">
                  {domain.score}
                </span>
              </div>

              {/* one-line definition (verbatim) */}
              {domain.description && (
                <p className="mt-1 pl-[14px] text-[11px] leading-[1.5] text-muted-foreground">
                  {domain.description}
                </p>
              )}

              {/* score bar with 50 = average midline */}
              <div className="mt-2 pl-[14px]">
                <div
                  className="relative h-[3px] overflow-hidden rounded-full bg-border/20"
                  role="progressbar"
                  aria-valuenow={domain.score}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${domain.label}: ${domain.score}, ${above ? t.aboveAvg : t.belowAvg}`}
                >
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${domain.score}%`, backgroundColor: color }}
                  />
                  <span
                    aria-hidden="true"
                    className="absolute top-0 h-full w-px bg-foreground/25"
                    style={{ left: '50%' }}
                  />
                </div>
              </div>
            </li>
          )
        })}
      </ul>

      {/* ── Priorities ─────────────────────────────────────────────── */}
      <div className="relative mt-8 rounded-xl border border-border/15 bg-white/[0.02] p-4 md:p-5">
        <div className="mb-3 flex items-baseline justify-between gap-3">
          <h4 className="font-mono text-[11px] uppercase tracking-[0.18em] text-foreground">
            {t.priorities}
          </h4>
          <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground/60">
            3 / 7
          </span>
        </div>
        <p className="mb-3 text-[11px] leading-relaxed text-muted-foreground">
          {t.prioritiesNote}
        </p>
        <ol className="flex flex-col gap-2.5">
          {PRIORITIES.map((p, i) => {
            const color = DOMAIN_COLORS[p.code] || 'var(--mqs-accent)'
            return (
              <li key={p.code} className="flex items-start gap-2.5">
                <span
                  aria-hidden="true"
                  className="mt-[3px] font-mono text-[10px] tabular-nums text-muted-foreground/60"
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span
                  aria-hidden="true"
                  className="mt-[6px] inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full"
                  style={{ backgroundColor: color }}
                />
                <span className="text-[13px] leading-snug text-foreground/90">
                  {isDE ? p.de : p.en}
                  <span
                    className="ml-2 font-mono text-[9px] uppercase tracking-[0.14em]"
                    style={{ color }}
                  >
                    {p.code}
                  </span>
                </span>
              </li>
            )
          })}
        </ol>
      </div>

      {/* ── Retest hook + illustrative note ────────────────────────── */}
      <div className="relative mt-6 flex flex-col gap-2 border-t border-border/10 pt-4">
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-primary/90">
          <span aria-hidden="true">↻</span>
          {t.retest}
        </div>
        <p className="text-[11px] leading-relaxed text-muted-foreground/70">{t.note}</p>
      </div>
    </motion.div>
  )
}

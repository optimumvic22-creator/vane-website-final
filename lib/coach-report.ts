import type { Locale } from './locale'

export const coachReportImages = [
  {
    id: 'overview',
    capturedAt: '2026-10-14T18:09:10+02:00',
    image: { src: '/media/coach/report/report-01-overview.webp', width: 2218, height: 1080 },
    title: { en: 'Overview', de: 'Übersicht' },
    alt: {
      en: 'Synthetic MQS report overview with a partial score, domain results, confidence and example training priorities.',
      de: 'Synthetische MQS-Berichtsübersicht mit Teilscore, Domänenergebnissen, Konfidenz und beispielhaften Trainingsprioritäten.',
    },
  },
  {
    id: 'findings',
    capturedAt: '2026-10-14T18:09:17+02:00',
    image: { src: '/media/coach/report/report-02-findings.webp', width: 1464, height: 1068 },
    title: { en: 'Findings', de: 'Ergebnisse' },
    alt: {
      en: 'Synthetic report findings showing observations from force-time data, kinetics and kinematics, with confidence for each observation.',
      de: 'Synthetische Berichtsergebnisse mit Beobachtungen aus Kraft-Zeit-Daten, Kinetik und Kinematik sowie Konfidenz für jede Beobachtung.',
    },
  },
  {
    id: 'interpretation',
    capturedAt: '2026-10-14T18:10:15+02:00',
    image: { src: '/media/coach/report/report-03-interpretation.webp', width: 1464, height: 1914 },
    title: { en: 'Interpretation', de: 'Interpretation' },
    alt: {
      en: 'Synthetic report interpretation with supporting, conflicting and missing evidence, candidate mechanisms and an example training need.',
      de: 'Synthetische Berichtsinterpretation mit unterstützenden, widersprüchlichen und fehlenden Belegen, möglichen Mechanismen und beispielhaftem Trainingsbedarf.',
    },
  },
] satisfies Array<{
  id: string
  capturedAt: string
  image: { src: string; width: number; height: number }
  title: Record<Locale, string>
  alt: Record<Locale, string>
}>

export const coachReportUi = {
  en: {
    label: 'SAMPLE AI REPORT',
    gallery: 'Synthetic report preview',
    previous: 'Previous report screenshot',
    next: 'Next report screenshot',
    expand: 'Enlarge screenshot',
    disclaimer: 'Fully synthetic example report. Not the finished product.',
  },
  de: {
    label: 'KI-BEISPIELBERICHT',
    gallery: 'Vorschau eines synthetischen Berichts',
    previous: 'Vorheriger Berichtsscreenshot',
    next: 'Nächster Berichtsscreenshot',
    expand: 'Screenshot vergrößern',
    disclaimer: 'Vollständig synthetischer Beispielbericht. Nicht das fertige Produkt.',
  },
} satisfies Record<Locale, Record<string, string>>

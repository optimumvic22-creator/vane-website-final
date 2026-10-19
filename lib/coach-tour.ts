import type { Locale } from './locale'
export type TourStep = {
  id: string
  capturedAt: string
  title: Record<Locale, string>
  text: Record<Locale, string>
  frame: 'window' | 'phone'
  image: { src: string; width: number; height: number }
  alt: Record<Locale, string>
  hotspot?: { x: number; y: number; w: number; h: number }
  ready: boolean
}
export const coachTour: TourStep[] = [
  {
    id: 'score',
    capturedAt: '2026-10-13T16:48:01.308Z',
    frame: 'window',
    image: {
      src: '/media/coach/tour-01-score.webp',
      width: 2400,
      height: 1562,
    },
    title: {
      en: 'The athlete profile',
      de: 'Das Athletenprofil',
    },
    text: {
      en: 'See your athlete’s Movement Quality Score, seven domains and testing history in one profile.',
      de: 'Movement Quality Score, sieben Domänen und Testhistorie deines Athleten in einem Profil.',
    },
    alt: {
      en: 'MQS athlete overview with an overall score of 81, seven domain results, a radar profile and testing-day history.',
      de: 'MQS Athletenübersicht mit Gesamtwert 81, sieben Domänenergebnissen, Radarprofil und Testhistorie.',
    },
    ready: true,
  },
  {
    id: 'trial',
    capturedAt: '2026-10-13T16:48:25.428Z',
    frame: 'window',
    image: {
      src: '/media/coach/tour-02-trial-scrubber.webp',
      width: 2400,
      height: 1562,
    },
    title: {
      en: 'Movement and force on one timeline',
      de: 'Bewegung und Kraft auf einer Zeitachse',
    },
    text: {
      en: 'Review movement from two angles alongside force curves on one shared timeline.',
      de: 'Betrachte Bewegung aus zwei Perspektiven und Kraftkurven auf einer gemeinsamen Zeitachse.',
    },
    alt: {
      en: 'Countermovement-jump trial with side and front skeleton views, left and right force curves, movement phases and a shared timeline.',
      de: 'Countermovement-Jump-Versuch mit Skelettansichten von der Seite und vorne, Kraftkurven, Bewegungsphasen und gemeinsamer Zeitachse.',
    },
    ready: true,
  },
  {
    id: 'metrics',
    capturedAt: '2026-10-13T16:50:10.443Z',
    frame: 'window',
    image: {
      src: '/media/coach/tour-03-metrics.webp',
      width: 2400,
      height: 1573,
    },
    title: {
      en: 'Understand what changed',
      de: 'Verstehe, was sich verändert hat',
    },
    text: {
      en: 'Compare force-plate and movement metrics with an earlier testing day, phase by phase.',
      de: 'Vergleiche Kraftplatten- und Bewegungsdaten mit einem früheren Testtag, Phase für Phase.',
    },
    alt: {
      en: 'Metrics grouped into strategy and braking, with kinetic and kinematic values compared against a previous testing day.',
      de: 'Messgrößen für Strategie und Bremsphase, mit kinetischen und kinematischen Werten im Vergleich zum vorherigen Testtag.',
    },
    ready: true,
  },
  {
    id: 'reference',
    capturedAt: '2026-10-13T16:52:22.840Z',
    frame: 'window',
    image: {
      src: '/media/coach/tour-04-reference.webp',
      width: 2400,
      height: 1562,
    },
    title: {
      en: 'Compare the complete profile',
      de: 'Vergleiche das vollständige Profil',
    },
    text: {
      en: 'See how each movement quality ranks against your selected reference group.',
      de: 'Sieh, wo jede Bewegungsqualität im Vergleich zu deiner gewählten Referenzgruppe steht.',
    },
    alt: {
      en: 'Single-leg landing spider plot with percentile axes, group median and interquartile range, database overlay and a comparison table.',
      de: 'Radarprofil einer einbeinigen Landung mit Perzentilachsen, Gruppenmedian, Interquartilsbereich, Datenbankvergleich und Wertetabelle.',
    },
    ready: true,
  },
  {
    id: 'trends',
    capturedAt: '2026-10-13T16:52:59.661Z',
    frame: 'window',
    image: {
      src: '/media/coach/tour-05-trends.webp',
      width: 2400,
      height: 1562,
    },
    title: {
      en: 'Follow progress across the squad',
      de: 'Verfolge die Entwicklung des Teams',
    },
    text: {
      en: 'Track your team’s progress over time and highlight individual athletes.',
      de: 'Verfolge die Entwicklung deines Teams und hebe einzelne Athleten hervor.',
    },
    alt: {
      en: 'Squad ballistic-power trends across months, showing individual athlete lines, the squad median and the middle 50 percent of results.',
      de: 'Zeitverlauf der ballistischen Power im Team mit individuellen Linien, Teammedian und den mittleren 50 Prozent der Ergebnisse.',
    },
    ready: true,
  },
  {
    id: 'quadrants',
    capturedAt: '2026-10-13T16:53:25.315Z',
    frame: 'window',
    image: {
      src: '/media/coach/tour-06-quadrants.webp',
      width: 2400,
      height: 1562,
    },
    title: {
      en: 'Access the NormVault database',
      de: 'Zugriff auf die NormVault-Datenbank',
    },
    text: {
      en: 'Access NormVault’s global reference database to compare your athletes with peers of the same sex, age and level.',
      de: 'Nutze die globale NormVault-Referenzdatenbank und vergleiche deine Athleten mit anderen gleichen Geschlechts, Alters und Leistungsniveaus.',
    },
    alt: {
      en: 'Strength-speed scatter plot comparing IMTP peak force per kilogram with CMJ peak power per kilogram, with squad and anonymised database points.',
      de: 'Kraft-Geschwindigkeits-Streudiagramm mit IMTP-Spitzenkraft pro Kilogramm und CMJ-Spitzenleistung pro Kilogramm, Team- und anonymisierten Datenbankpunkten.',
    },
    ready: true,
  },
  {
    id: 'capture',
    capturedAt: '2026-10-13T16:54:15.822Z',
    frame: 'window',
    image: {
      src: '/media/coach/tour-07-capture.webp',
      width: 2400,
      height: 1562,
    },
    title: {
      en: 'Connect your equipment',
      de: 'Verbinde dein Equipment',
    },
    text: {
      en: 'Connect and control your force plates, cameras and iPhones from one place.',
      de: 'Verbinde und steuere deine Kraftplatten, Kameras und iPhones an einem Ort.',
    },
    alt: {
      en: 'Capture setup listing Bertec plates, OptiTrack and high-speed cameras, iPhones, athlete selection, test instructions and a live view that is not yet armed.',
      de: 'Aufnahmevorbereitung mit Bertec-Platten, OptiTrack, Highspeed-Kameras, iPhones, Athletenauswahl, Testanleitung und noch nicht aktivierter Live-Ansicht.',
    },
    ready: true,
  },
]
export function readyTourSteps(steps: readonly TourStep[]) {
  const ready = steps.filter((step) => step.ready)
  return ready.length >= 3 ? ready : []
}

import type { Locale } from './locale'
import type { MqsDomainCode } from './mqs-interaction'

type DomainExplanation = { name: string; description: string }
type CoachIntroduction = {
  headline: string[]
  intro: string
  setupCta: string
  researchTitle: string
  researchDescription: string
  researchAlt: string
  scoreTitle: string[]
  scoreSubtitle: string
  domains: Record<MqsDomainCode, DomainExplanation>
}

export const coachIntroduction: Record<Locale, CoachIntroduction> = {
  en: {
    headline: ['SEE THE MOVEMENT.', 'UNDERSTAND THE WHY.'],
    intro: 'Start with the equipment and experience you have. MQS brings motion capture and force plate data into one standardized movement assessment, then turns the results into an AI-powered needs analysis backed by NormVault, our growing reference database. Clear training priorities. Less time interpreting results. More time with your athletes.',
    setupCta: 'Check your setup',
    researchTitle: 'MOVEMENT RESEARCH.',
    researchDescription: 'Motion capture and 3D force plate assessments using early machine-learning algorithms.',
    researchAlt: 'Athlete undergoing a motion capture and force plate assessment',
    scoreTitle: ['INTRODUCING THE', 'MOVEMENT QUALITY SCORE.'],
    scoreSubtitle: 'One standardized assessment. Seven movement qualities. One shared language.',
    domains: {
      GAIT: { name: 'Gait', description: 'How you walk and run, including the rhythm, symmetry and control of each step.' },
      POST: { name: 'Postural control', description: 'How you balance and control your trunk and spine as you move, so force can be absorbed and produced effectively.' },
      FORCE: { name: 'Force capacity', description: 'How much force you can produce.' },
      POWER: { name: 'Power', description: 'How fast you produce force.' },
      MOTOR: { name: 'Motor control', description: 'How smoothly and precisely you control movement - from coordinating your upper and lower body to landing with a stabilized leg axis.' },
      NEURO: { name: 'Neural response', description: 'The speed and precision of your response - from noticing a cue to initiating movement.' },
      DTC: { name: 'Dual-task cost', description: 'How movement holds up when your brain is busy. This measures the robustness of your movement quality.' },
    },
  },
  de: {
    headline: ['BEWEGUNG SEHEN.', 'DAS WARUM VERSTEHEN.'],
    intro: 'Starte mit der Ausstattung und Erfahrung, die du mitbringst. MQS verbindet Motion-Capture- und Kraftplattendaten in einem standardisierten Bewegungsassessment und erstellt daraus eine KI-gestützte Bedarfsanalyse. Die Grundlage liefert NormVault, eine wachsende Referenzdatenbank. Klare Trainingsprioritäten. Weniger Zeit mit der Interpretation von Ergebnissen. Mehr Zeit mit deinen Athleten.',
    setupCta: 'Dein Setup prüfen',
    researchTitle: 'BEWEGUNGSFORSCHUNG.',
    researchDescription: 'Motion Capture und 3D-Kraftplatten-Assessments mit frühen Machine-Learning-Algorithmen.',
    researchAlt: 'Athlet bei einem Motion-Capture- und Kraftplatten-Assessment',
    scoreTitle: ['DER', 'MOVEMENT QUALITY SCORE.'],
    scoreSubtitle: 'Ein standardisiertes Assessment. Sieben Bewegungsqualitäten. Ein klarer Ausgangspunkt fürs Coaching.',
    domains: {
      GAIT: { name: 'Gang', description: 'Wie du gehst und läufst, einschließlich Rhythmus, Symmetrie und Kontrolle jedes Schritts.' },
      POST: { name: 'Posturale Kontrolle', description: 'Wie du dein Gleichgewicht hältst und Rumpf und Wirbelsäule in Bewegung kontrollierst, um Kräfte effektiv aufzunehmen und zu erzeugen.' },
      FORCE: { name: 'Kraftkapazität', description: 'Wie viel Kraft du erzeugen kannst.' },
      POWER: { name: 'Power', description: 'Wie schnell du Kraft erzeugst.' },
      MOTOR: { name: 'Motorische Kontrolle', description: 'Wie flüssig und präzise du Bewegung kontrollierst - von der Koordination deines Ober- und Unterkörpers bis zur Landung mit stabilisierter Beinachse.' },
      NEURO: { name: 'Neuronale Reaktion', description: 'Die Geschwindigkeit und Präzision deiner Reaktion - vom Wahrnehmen eines Reizes bis zum Einleiten der Bewegung.' },
      DTC: { name: 'Dual Task Cost', description: 'Wie gut deine Bewegung funktioniert, wenn dein Kopf gleichzeitig beschäftigt ist. Das zeigt die Robustheit deiner Bewegungsqualität.' },
    },
  },
}

import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { audienceContent, audienceSlugs } from './audience-content'
import { WAITLIST_UPDATES_CONSENT_VERSION, waitlistUpdatesConsent } from './waitlist-consent'

// Captured from the current source before the approved September 24 copy edits.
// Approved review exceptions: athlete DE benefits, partner benefits titles,
// and the athlete/partner science headings from the September 25 CEO review.
const lockedCopyBefore = {
  "athlete": {
    "en": {
      "headline": "UNDERSTAND HOW YOU MOVE. TRAIN WHAT MATTERS.",
      "intro": "VANE turns a standardized assessment into one Movement Quality Score, a profile across seven domains, and clear areas to discuss with your coach or therapist.",
      "benefitsTitle": "Less guessing. More direction.",
      "outputTitle": "More than one number.",
      "scienceTitle": "Results you can understand.",
      "processTitle": "Measure. Understand. Act."
    },
    "de": {
      "headline": "Verstehe deine Bewegung. Trainiere, was zählt.",
      "intro": "VANE übersetzt ein standardisiertes Assessment in einen Movement Quality Score, ein Profil über sieben Domänen und klare Bereiche für das Gespräch mit Coach oder Therapeut.",
      "benefitsTitle": "Mehr Überblick. Klarere Prioritäten.",
      "outputTitle": "Mehr als eine Zahl.",
      "scienceTitle": "Ergebnisse, die du verstehst.",
      "processTitle": "Messen. Verstehen. Handeln."
    }
  },
  "coach": {
    "en": {
      "headline": "WE MAKE MOVEMENT MEASURABLE. YOU DECIDE WHAT MATTERS.",
      "intro": "VANE makes movement quality measurable through one standardized assessment. You connect the results with the athlete, the sport, and your training plan.",
      "benefitsTitle": "All results in one movement profile",
      "outputTitle": "The overall score never stands alone",
      "scienceTitle": "Your expertise stays essential",
      "processTitle": "Assess. Interpret. Apply."
    },
    "de": {
      "headline": "WIR MACHEN BEWEGUNG MESSBAR. DU ENTSCHEIDEST, WAS ZÄHLT.",
      "intro": "VANE macht Bewegungsqualität mit einem standardisierten Assessment messbar. Du verbindest die Ergebnisse mit dem Athleten, seiner Sportart und deinem Trainingsplan.",
      "benefitsTitle": "Alle Ergebnisse in einem Bewegungs­profil",
      "outputTitle": "Der Gesamtscore steht nie allein",
      "scienceTitle": "Deine Expertise bleibt entscheidend",
      "processTitle": "Erfassen. Einordnen. Anwenden."
    }
  },
  "partner": {
    "en": {
      "headline": "ADD A MOVEMENT QUALITY STANDARD TO WHAT YOU ALREADY DO WELL.",
      "intro": "VANE adds a standardized movement quality assessment and reporting layer to the services, programs, or products you already provide. We start with your existing setup and define a focused pilot around one clear use case.",
      "benefitsTitle": "How MQS fits your existing offer",
      "outputTitle": "A model built around your context.",
      "scienceTitle": "Evidence before expansion.",
      "processTitle": "Discover. Pilot. Learn."
    },
    "de": {
      "headline": "ERGÄNZE DEIN ANGEBOT UM EINEN STANDARD FÜR BEWEGUNGS­QUALITÄT.",
      "intro": "VANE ergänzt deine bestehenden Angebote, Programme oder Produkte um ein standardisiertes Assessment und Reporting für Bewegungsqualität. Wir beginnen mit deinem bestehenden Ablauf und definieren einen fokussierten Pilot für einen klaren Anwendungsfall.",
      "benefitsTitle": "So ergänzt MQS dein bestehendes Angebot",
      "outputTitle": "Ein Modell rund um deinen Kontext.",
      "scienceTitle": "Erst prüfen. Dann erweitern."
    }
  }
} as const

const locales = ['en', 'de'] as const

describe('approved audience copy contract', () => {
  it.each(audienceSlugs.flatMap((audience) => locales.map((locale) => ({ audience, locale }))))(
    'preserves the locked $audience $locale hero and section headings',
    ({ audience, locale }) => {
      expect(audienceContent[audience][locale]).toMatchObject(lockedCopyBefore[audience][locale])
    },
  )

  it('uses MQS publicly without the retired name or long dashes', () => {
    const publicCopy = JSON.stringify({ audienceContent, waitlistUpdatesConsent })
    expect(publicCopy).not.toMatch(/MQS Vault|Pilotieren|[\u2013\u2014]/)
  })

  it.each(['coach', 'partner'] as const)('keeps %s access distinct from the available athlete assessment', (audience) => {
    const { en, de } = audienceContent[audience]
    const expectedAudience = audience === 'coach' ? 'coaches and teams' : 'partners'
    const expectedGermanAudience = audience === 'coach' ? 'Coaches und Teams' : 'Partner'

    expect(en.availabilityNote).toBe(`MQS access for ${expectedAudience} is still in development.`)
    expect(de.availabilityNote).toBe(`Der MQS Zugang für ${expectedGermanAudience} ist noch in Entwicklung.`)
    expect(en.finalText).toContain(en.availabilityNote)
    expect(de.finalText).toContain(de.availabilityNote)
    expect(en.primaryCta).toBe('Join the waitlist')
    expect(en.finalCta).toBe('Join the waitlist')
    expect(de.primaryCta).toBe('Auf die Warteliste')
    expect(de.finalCta).toBe('Auf die Warteliste')
    expect(en.finalTitle).toBe('Join the MQS waitlist.')
    expect(de.finalTitle).toBe('Auf die MQS Warteliste.')
    expect(en.finalNote).toBe('Joining the waitlist does not give you access or start a trial.')
    expect(de.finalNote).toBe('Der Wartelisteneintrag schaltet keinen Zugang frei und startet keine Testphase.')
    expect(en.processEyebrow).toMatch(/planned|plan to/i)
    expect(de.processEyebrow).toMatch(/geplant/i)
  })

  it('offers the requested athlete waitlist without implying an assessment booking', () => {
    const { en, de } = audienceContent.athlete
    expect(en.finalText).toContain('Vienna')
    expect(de.finalText).toContain('Wien')
    expect(en.finalCta).toBe('Join the waitlist')
    expect(de.finalCta).toBe('Auf die Warteliste')
    expect(en.finalNote).toBe('Joining the waitlist does not book an assessment.')
    expect(de.finalNote).toBe('Der Wartelisteneintrag ist keine Assessment Buchung.')
  })

  it('assigns interpretation to VANE and application decisions to the coach in both languages', () => {
    const { en, de } = audienceContent.coach
    expect(en.steps[1].description).toContain("VANE's interpretation")
    expect(de.steps[1].description).toContain('VANEs Interpretation')
    expect(en.steps[2].description).toContain('Decide what to change in training')
    expect(de.steps[2].description).toContain('Entscheide')
    expect(en.scienceText).toContain('VANE interprets your assessment results')
    expect(en.scienceText).toContain('decides what to do next, and puts it into practice')
    expect(de.scienceText).toContain('VANE interpretiert die Ergebnisse')
    expect(de.scienceText).toContain('entscheidet über die nächsten Schritte und setzt sie im Training um')
    expect(en.scienceText).toContain('does not provide a medical diagnosis')
    expect(de.scienceText).toContain('keine medizinische Diagnose')
    expect(JSON.stringify({ en, de })).not.toMatch(/interpretation stays with your team|Einordnung bleibt bei deinem Team|Einordnung durch dein Team/i)
  })

  it('uses the approved natural German partner process', () => {
    const copy = audienceContent.partner.de
    expect(copy.processTitle).toBe('Verstehen. Testen. Auswerten.')
    expect(copy.steps.map((step) => step.title)).toEqual([
      'Bedarf klären',
      'In der Praxis testen',
      'Gemeinsam auswerten',
    ])
    expect(copy.steps[1].description).toContain('begrenzten Praxistest')
  })

  it('versions the new consent wording without reusing the historical version', () => {
    expect(WAITLIST_UPDATES_CONSENT_VERSION).toBe('mqs-updates-v2')
    expect(waitlistUpdatesConsent).toEqual({
      en: 'Also send me email updates about MQS development and access. I can unsubscribe at any time.',
      de: 'Ich möchte auch per E Mail über die Entwicklung und den Zugang zu MQS informiert werden. Ich kann mich jederzeit abmelden.',
    })
  })

  it('keeps MQS success wording honest and optional updates separate in the form', () => {
    const form = readFileSync(new URL('../components/ui/audience-waitlist-form.tsx', import.meta.url), 'utf8')
    expect(form).not.toContain('MQS Vault')
    expect(form).toContain('Du bist auf der Warteliste')
    expect(form).toContain('Wir melden uns, sobald der Zugang verfügbar ist.')
    expect(form).toContain('You’re on the waitlist')
    expect(form).toContain('We’ll contact you when access is available.')
    expect(form).toContain('defaultChecked={false}')
    expect(form).toContain('{waitlistUpdatesConsent[locale]}')
    expect(form).toContain('Updates start only after you confirm your email address.')
    expect(form).toContain('Updates starten erst, nachdem du deine E Mail Adresse bestätigt hast.')
  })
})

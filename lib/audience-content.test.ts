import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { audienceContent, audienceSlugs } from './audience-content'
import { WAITLIST_UPDATES_CONSENT_VERSION, waitlistUpdatesConsent } from './waitlist-consent'

// Captured from the current source before the approved September 24 copy edits.
// Approved review exceptions: athlete DE benefits, partner benefits titles,
// and the athlete/partner science headings from the September 25 CEO review.
// Partner hero wording follows the approved October 5 partner landing-page brief.
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
      "headline": "Add a movement quality standard to what you already do well.",
      "intro": "We bring MQS into your facility and work closely with your team until it's part of how you work, at the highest level. Your data helps shape the global standard for movement quality.",
      "benefitsTitle": "How MQS fits your existing offer",
      "outputTitle": "A model built around your context.",
      "scienceTitle": "Evidence before expansion.",
      "processTitle": "Discover. Pilot. Learn."
    },
    "de": {
      "headline": "ERGÄNZE DEIN ANGEBOT UM EINEN STANDARD FÜR BEWEGUNGS­QUALITÄT.",
      "intro": "Wir bringen MQS in deine Einrichtung und arbeiten eng mit deinem Team zusammen, bis es auf höchstem Niveau zu eurem Arbeitsalltag gehört. Eure Daten helfen, den globalen Standard für Bewegungsqualität mitzugestalten.",
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

  it('keeps coach access in development and distinct from the available athlete assessment', () => {
    const { en, de } = audienceContent.coach
    expect(en.availabilityNote).toBe('MQS access for coaches and teams is still in development.')
    expect(de.availabilityNote).toBe('Der MQS Zugang für Coaches und Teams ist noch in Entwicklung.')
    expect(en.finalText).toContain(en.availabilityNote)
    expect(de.finalText).toContain(de.availabilityNote)
    expect(en.processEyebrow).toMatch(/planned|plan to/i)
    expect(de.processEyebrow).toMatch(/geplant/i)
  })

  it.each(['coach', 'partner'] as const)('preserves %s waitlist CTAs and access boundaries', (audience) => {
    const { en, de } = audienceContent[audience]
    expect(en.primaryCta).toBe('Join the waitlist')
    expect(en.finalCta).toBe('Join the waitlist')
    expect(de.primaryCta).toBe('Auf die Warteliste')
    expect(de.finalCta).toBe('Auf die Warteliste')
    expect(en.finalTitle).toBe('Join the MQS waitlist.')
    expect(de.finalTitle).toBe('Auf die MQS Warteliste.')
    expect(en.finalNote).toBe('Joining the waitlist does not give you access or start a trial.')
    expect(de.finalNote).toBe('Der Wartelisteneintrag schaltet keinen Zugang frei und startet keine Testphase.')
  })

  it('uses the approved partner facility and team support wording without development qualifiers', () => {
    const { en, de } = audienceContent.partner
    expect(en.availabilityNote).toBeUndefined()
    expect(de.availabilityNote).toBeUndefined()
    expect(JSON.stringify({ en, de })).not.toMatch(/still in development|noch in Entwicklung/)
    expect(en.secondaryCta).toBe('Explore the partner model')
    expect(de.secondaryCta).toBe('Partnermodell ansehen')
    expect(en.heroValueRail).toEqual([
      { title: 'Build on what you already do.', detail: 'MQS fits around your services and equipment.' },
      { title: 'Get your team to expert level.', detail: 'We work alongside you from day one.' },
      { title: 'Shape the standard.', detail: 'Partners help build the global movement-quality reference.' },
    ])
    expect(de.heroValueRail).toEqual([
      { title: 'Baue auf dem auf, was du bereits tust.', detail: 'MQS ergänzt deine Angebote und deine Ausstattung.' },
      { title: 'Bring dein Team auf Expertenniveau.', detail: 'Wir begleiten euch vom ersten Tag an.' },
      { title: 'Gestalte den Standard mit.', detail: 'Partner bauen die globale Referenz für Bewegungsqualität mit auf.' },
    ])
    expect(en.benefits[0].description).toBe('A training facility uses the same movement assessment at the start of a program and at retest.')
    expect(de.benefits[0].description).toBe('Ein Trainingszentrum nutzt zu Beginn eines Programms und beim Retest dasselbe Bewegungsassessment.')
    expect(en.benefits[1].description).toContain('the MQS report')
    expect(de.benefits[1].description).toContain('der MQS Bericht')
    expect(en.processEyebrow).toBe('How we work together')
    expect(de.processEyebrow).toBe('So arbeiten wir zusammen')
    expect(en.steps[1].description).toContain('and we set MQS up with your team.')
    expect(de.steps[1].description).toContain('richten MQS gemeinsam mit deinem Team ein.')
  })

  it('retains the four partner deliverables and adds participation in the standard', () => {
    const { en, de } = audienceContent.partner
    expect(en.outputEyebrow).toBe('What the partnership delivers')
    expect(de.outputEyebrow).toBe('Was die Partnerschaft bietet')
    expect(en.deliverables).toEqual([
      'Defined use case and pilot scope',
      'Assessment protocol and onboarding',
      'Reports designed for your users',
      'Review of results, limitations, and next steps',
      'A seat at the table in building the movement-quality standard',
    ])
    expect(de.deliverables).toEqual([
      'Ein konkreter Einsatz und ein vereinbarter Testumfang',
      'Assessmentprotokoll und Einführung',
      'Berichte für deine Nutzer',
      'Prüfung von Ergebnissen, Grenzen und nächsten Schritten',
      'Die Möglichkeit, den Standard für Bewegungsqualität mitzugestalten',
    ])
    expect(en.scienceText).toBe('We agree up front what success looks like and review the results together before scaling up.')
    expect(de.scienceText).toBe('Wir legen vorab fest, woran wir Erfolg erkennen, und prüfen die Ergebnisse gemeinsam, bevor wir den Einsatz ausweiten.')
    expect(en.finalText).toBe("Interested in bringing MQS into your facility? Join the waitlist and we'll be in touch.")
    expect(de.finalText).toBe('Du möchtest MQS in deine Einrichtung bringen? Trag dich auf die Warteliste ein. Wir melden uns bei dir.')
  })

  it('preserves the athlete request as an available Vienna service, not a booking or update signup', () => {
    const { en, de } = audienceContent.athlete
    expect(en.finalText).toContain('Vienna')
    expect(de.finalText).toContain('Wien')
    expect(en.finalCta).toBe('Request assessment')
    expect(de.finalCta).toBe('Assessment anfragen')
    expect(en.finalNote).toBe('This is an inquiry, not a confirmed booking. You are not subscribed to email updates.')
    expect(de.finalNote).toBe('Das ist eine Anfrage, keine bestätigte Buchung. Du wirst nicht für E Mail Updates angemeldet.')
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

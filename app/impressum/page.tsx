import type { Metadata } from 'next'
import Link from 'next/link'
import { Section } from '@/components/ui/section'
import { Container } from '@/components/ui/container'
import { Body } from '@/components/ui/typography'

const sectionHeadingClass = 'font-sans text-xl font-semibold leading-[1.3] tracking-[0.01em] text-foreground md:text-[1.375rem]'

export const metadata: Metadata = {
  title: 'Impressum',
  description: 'Legal disclosure (Impressum) for VANE Science GmbH, Vienna, Austria.',
  alternates: {
    canonical: '/impressum',
    languages: { 'x-default': '/impressum' },
  },
}

export default function ImpressumPage() {
  return (
    <Section spacing="xl">
      <Container size="sm">
        <h1 className="mb-12 font-sans text-[clamp(2.5rem,5vw,3.5rem)] font-semibold leading-[1.08] tracking-[0.015em] text-foreground">Impressum</h1>

        <div className="space-y-8">
          <div>
            <h2 className={sectionHeadingClass}>Angaben gemäß § 5 ECG</h2>
            <Body className="mt-2">
              VANE Science GmbH<br />
              Linke Wienzeile 64/GL II<br />
              1060 Wien<br />
              Österreich
            </Body>
          </div>

          <div>
            <h2 className={sectionHeadingClass}>Vertretungsbefugte Organe</h2>
            <Body className="mt-2">
              Geschäftsführer: Dario Saisan und Marko Rados<br />
              Beide sind jeweils alleinvertretungsberechtigt.
            </Body>
          </div>

          <div>
            <h2 className={sectionHeadingClass}>Kontakt</h2>
            <Body className="mt-2">
              E-Mail: <a href="mailto:mqs@vanescience.com" className="underline underline-offset-4">mqs@vanescience.com</a><br />
              Athleten-Warteliste: <Link href="/for/athlete#waitlist" className="underline underline-offset-4">Zur Warteliste</Link>
            </Body>
          </div>

          <div>
            <h2 className={sectionHeadingClass}>Registereintrag</h2>
            <Body className="mt-2">
              Firmenbuchgericht: Handelsgericht Wien<br />
              Firmenbuchnummer: FN 685936f
            </Body>
          </div>

          <div>
            <h2 className={sectionHeadingClass}>Umsatzsteuer</h2>
            <Body className="mt-2">
              Umsatzsteuer-Identifikationsnummer (UID): wird nachgereicht.
            </Body>
          </div>

          <div>
            <h2 className={sectionHeadingClass}>Medieninhaber und Offenlegung gemäß § 25 MedienG</h2>
            <Body className="mt-2">
              Medieninhaber: VANE Science GmbH<br />
              Sitz: Wien, Österreich<br />
              Unternehmensgegenstand: Sportwissenschaftliche Diagnostik und Trainingsbetrieb;
              Durchführung leistungsdiagnostischer Testverfahren und betreuten Trainings;
              Verkauf digitaler Güter wie Software, Trainingsprogramme und Lehrmaterial;
              sportwissenschaftliche Beratung; Vertrieb von Datensätzen und Durchführung
              sportwissenschaftlicher Workshops.<br />
              Gesellschafter: Dario Saisan<br />
              Grundlegende Richtung (Blattlinie): Information über VANE Science, den Movement Quality Score und Angebote zur standardisierten Erfassung und Auswertung von Bewegungsqualität.
            </Body>
          </div>
        </div>
      </Container>
    </Section>
  )
}

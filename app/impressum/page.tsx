import type { Metadata } from 'next'
import { Section } from '@/components/ui/section'
import { Container } from '@/components/ui/container'
import { H1, H3, Body } from '@/components/ui/typography'

export const metadata: Metadata = {
  title: 'Impressum',
  description: 'Legal disclosure (Impressum) for VANE Science GmbH, Vienna, Austria.',
  alternates: {
    canonical: '/impressum',
    languages: { 'x-default': '/impressum' },
  },
}

// TODO: reale Firmendaten eintragen (Adresse, Geschäftsführung, Firmenbuchnummer, UID)
const PENDING = 'Wird ergänzt.'

export default function ImpressumPage() {
  return (
    <Section spacing="xl">
      <Container size="sm">
        <H1 className="mb-12">Impressum</H1>

        <div className="space-y-8">
          <div>
            <H3 as="h2">Angaben gemäß § 5 TMG</H3>
            <Body className="mt-2">
              VANE Science GmbH<br />
              Wien, Österreich<br />
              Anschrift: {PENDING}
            </Body>
          </div>

          <div>
            <H3 as="h2">Vertreten durch</H3>
            <Body className="mt-2">
              Geschäftsführung: {PENDING}
            </Body>
          </div>

          <div>
            <H3 as="h2">Kontakt</H3>
            <Body className="mt-2">
              E Mail: hello@vanescience.com
            </Body>
          </div>

          <div>
            <H3 as="h2">Registereintrag</H3>
            <Body className="mt-2">
              Registergericht: {PENDING}<br />
              Registernummer: {PENDING}
            </Body>
          </div>

          <div>
            <H3 as="h2">Umsatzsteuer ID</H3>
            <Body className="mt-2">
              Umsatzsteuer Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz: {PENDING}
            </Body>
          </div>

          <div>
            <H3 as="h2">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</H3>
            <Body className="mt-2">
              {PENDING}<br />
              Wien, Österreich
            </Body>
          </div>
        </div>
      </Container>
    </Section>
  )
}

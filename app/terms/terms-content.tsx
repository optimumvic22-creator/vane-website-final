'use client'

import { useLocale } from '@/lib/locale'
import { Section } from '@/components/ui/section'
import { Container } from '@/components/ui/container'
import { H1, H3, Body } from '@/components/ui/typography'

const en = {
  title: 'Terms of Service',
  lastUpdated: 'Last updated: March 2026',
  sections: [
    { heading: '1. Acceptance of Terms', content: 'By accessing and using the VANE website (vanescience.com), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the website.' },
    { heading: '2. Use of Website', content: 'This website is provided for informational purposes about VANE and its Movement Quality Score (MQS) technology. You may browse the site, but you may not use it for any unlawful purpose or in a way that could damage, disable, or impair the site.' },
    { heading: '3. Intellectual Property', content: 'All content on this website, including text, graphics, logos, and software, is the property of VANE Science GmbH and is protected by intellectual property laws. The VANE name, logo, and MQS are trademarks of VANE Science GmbH.' },
    { heading: '4. Limitation of Liability', content: 'VANE Science GmbH provides this website on an "as is" basis. We make no warranties about the completeness, accuracy, or reliability of the information. In no event shall VANE Science GmbH be liable for any indirect, incidental, or consequential damages arising from the use of this website.' },
    { heading: '5. External Links', content: 'This website may contain links to external sites. VANE Science GmbH is not responsible for the content or privacy practices of these external sites.' },
    { heading: '6. Modifications', content: 'VANE Science GmbH reserves the right to modify these terms at any time. Changes will be posted on this page with an updated "Last updated" date.' },
    { heading: '7. Governing Law', content: 'These terms are governed by and construed in accordance with the laws of Austria. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts in Vienna, Austria.' },
    { heading: '8. Contact', content: 'For questions about these Terms of Service, contact us at: hello@vanescience.com' },
  ],
}

const de = {
  title: 'Nutzungs\u00ADbedingungen',
  lastUpdated: 'Zuletzt aktualisiert: März 2026',
  sections: [
    { heading: '1. Annahme der Bedingungen', content: 'Durch den Zugriff auf und die Nutzung der Website von VANE (vanescience.com) erklären Sie sich mit diesen Nutzungsbedingungen einverstanden. Wenn Sie diesen Bedingungen nicht zustimmen, nutzen Sie die Website bitte nicht.' },
    { heading: '2. Nutzung der Website', content: 'Diese Website dient Informationszwecken über VANE und seine Movement Quality Score (MQS) Technologie. Sie dürfen die Seite durchsuchen, jedoch nicht für rechtswidrige Zwecke oder auf eine Weise nutzen, die die Seite beschädigen, deaktivieren oder beeinträchtigen könnte.' },
    { heading: '3. Geistiges Eigentum', content: 'Alle Inhalte dieser Website, einschließlich Texte, Grafiken, Logos und Software, sind Eigentum der VANE Science GmbH und durch Gesetze zum Schutz geistigen Eigentums geschützt. Der Name VANE, das Logo und MQS sind Marken der VANE Science GmbH.' },
    { heading: '4. Haftungsbeschränkung', content: 'Die VANE Science GmbH stellt diese Website „wie besehen" zur Verfügung. Wir übernehmen keine Garantie für die Vollständigkeit, Richtigkeit oder Zuverlässigkeit der Informationen. In keinem Fall haftet die VANE Science GmbH für indirekte, zufällige oder Folgeschäden.' },
    { heading: '5. Externe Links', content: 'Diese Website kann Links zu externen Seiten enthalten. Die VANE Science GmbH ist nicht verantwortlich für den Inhalt oder die Datenschutzpraktiken dieser externen Seiten.' },
    { heading: '6. Änderungen', content: 'Die VANE Science GmbH behält sich das Recht vor, diese Bedingungen jederzeit zu ändern. Änderungen werden auf dieser Seite mit einem aktualisierten Datum veröffentlicht.' },
    { heading: '7. Anwendbares Recht', content: 'Diese Bedingungen unterliegen dem Recht der Republik Österreich. Für alle Streitigkeiten sind ausschließlich die Gerichte in Wien, Österreich zuständig.' },
    { heading: '8. Kontakt', content: 'Für Fragen zu diesen Nutzungsbedingungen kontaktieren Sie uns unter: hello@vanescience.com' },
  ],
}

export function TermsContent() {
  const { locale } = useLocale()
  const t = locale === 'de' ? de : en

  return (
    <Section spacing="xl">
      <Container size="sm">
        <H1
          aria-label={t.title.replace(/\u00AD/g, '')}
          className="mb-2 break-normal [hyphens:manual]"
        >
          {t.title}
        </H1>
        <Body className="mb-12 text-sm md:text-sm">{t.lastUpdated}</Body>
        <div className="space-y-8">
          {t.sections.map((s, i) => (
            <div key={i}>
              <H3 as="h2" className="leading-[1.15]">{s.heading}</H3>
              <Body className="mt-3">{s.content}</Body>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  )
}

'use client'

import { useLocale } from '@/lib/locale'
import { Section } from '@/components/ui/section'
import { Container } from '@/components/ui/container'
import { H1, H3, Body } from '@/components/ui/typography'

const en = {
  title: 'Privacy Policy',
  lastUpdated: 'Last updated: September 2026',
  sections: [
    { heading: '1. Data Controller', content: 'VANE Science GmbH, Vienna, Austria is the data controller responsible for processing your personal data. Contact: hello@vanescience.com' },
    { heading: '2. Data We Collect', content: 'Analytics: only if you accept analytics in the cookie banner, we collect usage data via Google Analytics (anonymized IP addresses, browser type, device information, pages visited, session duration). Waitlist: if you join our waitlist, we store the email address you submit together with the segment you select, your language, and the place on the site where you signed up. Audience inquiries: when you submit a contact form for your role, we store your email address, audience, brief context and message, language, and form source. Please do not submit medical or other sensitive health information through these forms. We do not collect any of this without your action.' },
    { heading: '3. Legal Basis', content: 'We process your data based on: (a) Your consent (Art. 6(1)(a) GDPR) for analytics cookies; (b) Steps taken at your request prior to entering into a contract (Art. 6(1)(b) GDPR) for waitlist signups and audience inquiries; (c) Our legitimate interest (Art. 6(1)(f) GDPR) for essential site functionality and security.' },
    { heading: '4. Cookies', content: 'Essential cookies and local storage entries (e.g. your language and cookie preferences) are required for site functionality. Analytics (Google Analytics) is only activated with your explicit consent via the cookie banner. If you choose "Essential only", no analytics script is loaded. You can modify your preferences at any time.' },
    { heading: '5. Third Party Services', content: 'We use Sanity as our content management system. Waitlist signups and audience inquiries are stored there. We use Google Analytics for website analytics, only after your consent. Analytics data may be transferred to servers in the United States; Google is certified under the Data Privacy Framework between the European Union and the United States.' },
    { heading: '6. Your Rights', content: 'Under GDPR, you have the right to: access your personal data, rectify inaccurate data, request erasure of your data, restrict processing, data portability, and object to processing. To exercise these rights, contact hello@vanescience.com.' },
    { heading: '7. Data Retention', content: 'Analytics data is retained for 26 months. Waitlist signups are retained until the waitlist programme ends or until you ask us to delete your data, whichever comes first. Audience inquiries are retained only while needed to answer your request and manage the requested steps before a contract. They are then deleted unless a legal retention obligation applies or the data is needed to establish, exercise, or defend legal claims.' },
    { heading: '8. MQS Email Updates', content: 'Joining the MQS waitlist and requesting ongoing email updates are separate choices. Updates are optional. If you select them, we record your choice, the wording and version shown, the time, language and form source. We ask you to confirm your email address before sending ongoing updates about development and access. These updates use your consent under Art. 6(1)(a) GDPR. You can withdraw it at any time through the unsubscribe option in each update or by contacting hello@vanescience.com. An assessment inquiry does not subscribe you to updates. Delivery records are used to process requests reliably and do not themselves prove email receipt or confirmed subscription.' },
    { heading: '9. Contact', content: 'For data protection inquiries, contact: hello@vanescience.com. You also have the right to lodge a complaint with the Austrian Data Protection Authority (Datenschutzbehörde).' },
  ],
}

const de = {
  title: 'Datenschutz\u00ADerklärung',
  lastUpdated: 'Zuletzt aktualisiert: September 2026',
  sections: [
    { heading: '1. Verantwortlicher', content: 'VANE Science GmbH, Wien, Österreich ist der Verantwortliche für die Verarbeitung Ihrer personenbezogenen Daten. Kontakt: hello@vanescience.com' },
    { heading: '2. Erhobene Daten', content: 'Analyse: Nur wenn Sie im Cookie Banner Analytics akzeptieren, erheben wir Nutzungsdaten über Google Analytics (anonymisierte IP Adressen, Browsertyp, Geräteinformationen, besuchte Seiten, Sitzungsdauer). Warteliste: Wenn Sie sich auf unsere Warteliste eintragen, speichern wir Ihre E Mail Adresse, das gewählte Segment, Ihre Sprache und die Stelle der Anmeldung. Zielgruppenanfragen: Wenn Sie ein rollenspezifisches Kontaktformular absenden, speichern wir Ihre E Mail Adresse, Zielgruppe, den kurzen Kontext und Ihre Nachricht, Sprache und Formularquelle. Bitte übermitteln Sie über diese Formulare keine medizinischen oder anderen sensiblen Gesundheitsdaten. Diese Daten erheben wir nur durch Ihre aktive Eingabe.' },
    { heading: '3. Rechtsgrundlage', content: 'Wir verarbeiten Ihre Daten auf Grundlage von: (a) Ihrer Einwilligung (Art. 6 Abs. 1 lit. a DSGVO) für Cookies zur Analyse; (b) vorvertraglichen Maßnahmen auf Ihre Anfrage (Art. 6 Abs. 1 lit. b DSGVO) für Anmeldungen zur Warteliste und Zielgruppenanfragen; (c) unserem berechtigten Interesse (Art. 6 Abs. 1 lit. f DSGVO) für wesentliche Sitefunktionalität und Sicherheit.' },
    { heading: '4. Cookies', content: 'Essenzielle Cookies und Einträge im Local Storage, etwa Ihre Einstellungen für Sprache und Cookies, sind für die Funktion der Website erforderlich. Analytics (Google Analytics) wird nur mit Ihrer ausdrücklichen Einwilligung über das Cookie Banner aktiviert. Bei „Nur essenziell" wird kein Analytics Skript geladen. Sie können Ihre Einstellungen jederzeit ändern.' },
    { heading: '5. Drittanbieterdienste', content: 'Wir verwenden Sanity als Content Management System. Dort werden Anmeldungen zur Warteliste und Zielgruppenanfragen gespeichert. Für die Analyse der Website verwenden wir Google Analytics ausschließlich nach Ihrer Einwilligung. Analysedaten können an Server in den Vereinigten Staaten übertragen werden; Google ist unter dem Datenschutzrahmen zwischen der Europäischen Union und den Vereinigten Staaten zertifiziert.' },
    { heading: '6. Ihre Rechte', content: 'Gemäß DSGVO haben Sie das Recht auf: Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerspruch. Kontaktieren Sie hello@vanescience.com zur Ausübung dieser Rechte.' },
    { heading: '7. Datenspeicherung', content: 'Analysedaten werden 26 Monate aufbewahrt. Anmeldungen zur Warteliste werden gespeichert, bis das Wartelistenprogramm endet oder Sie die Löschung Ihrer Daten verlangen, je nachdem, was zuerst eintritt. Zielgruppenanfragen speichern wir nur so lange, wie es für die Beantwortung und die von Ihnen angefragten vorvertraglichen Schritte erforderlich ist. Danach löschen wir sie, sofern keine gesetzliche Aufbewahrungspflicht besteht oder die Daten zur Geltendmachung, Ausübung oder Verteidigung von Rechtsansprüchen benötigt werden.' },
    { heading: '8. E Mail Updates zum MQS', content: 'Die Anmeldung zur MQS Warteliste und der Wunsch nach laufenden E Mail Updates sind getrennte Entscheidungen. Updates sind freiwillig. Bei Auswahl speichern wir Ihre Entscheidung, den angezeigten Einwilligungstext mit Version, Zeitpunkt, Sprache und Formularquelle. Vor laufenden Updates zur Entwicklung und zum Zugang bitten wir um Bestätigung Ihrer E Mail Adresse. Grundlage ist Ihre Einwilligung nach Art. 6 Abs. 1 lit. a DSGVO. Sie können diese jederzeit über die Abmeldemöglichkeit in jedem Update oder über hello@vanescience.com widerrufen. Eine Assessment Anfrage meldet Sie nicht für Updates an. Zustellungsdaten dienen der zuverlässigen Bearbeitung von Anfragen und sind allein kein Nachweis für einen E Mail Empfang oder ein bestätigtes Abonnement.' },
    { heading: '9. Kontakt', content: 'Für Datenschutzanfragen: hello@vanescience.com. Sie haben auch das Recht, eine Beschwerde bei der österreichischen Datenschutzbehörde einzureichen.' },
  ],
}

export function PrivacyContent() {
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
              <div className="mt-3 space-y-4">
                {s.content.split(/(?<=\.) (?=Analyse:|Warteliste:|Zielgruppenanfragen:|Analytics:|Waitlist:|Audience inquiries:)/).map((paragraph) => (
                  <Body key={paragraph}>{paragraph}</Body>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  )
}

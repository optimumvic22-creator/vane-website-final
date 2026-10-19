'use client'

import { useLocale } from '@/lib/locale'
import { Section } from '@/components/ui/section'
import { Container } from '@/components/ui/container'
import { H1, H3, Body } from '@/components/ui/typography'

const en = {
  title: 'Privacy Policy',
  lastUpdated: 'Last updated: 14 October 2026',
  sections: [
    { heading: '1. Data Controller', content: 'VANE Science GmbH, Vienna, Austria is the data controller responsible for processing your personal data. Contact: mqs@vanescience.com' },
    { heading: '2. Data We Collect', content: 'Analytics: only if you accept analytics in the cookie banner, we collect usage data via Google Analytics 4 (pseudonymous cookie identifiers, browser and device information, approximate location, referral and campaign information, pages visited, session duration, and interactions such as button clicks and successful form submissions). Google uses IP addresses to derive approximate location but does not log or store IP addresses in GA4. We do not send form contents, names or email addresses to Analytics. Waitlist: if you join our waitlist, we store the email address you submit together with the segment you select, your language, and the place on the site where you signed up. Audience inquiries: when you submit a contact form for your role, we store your email address, audience, brief context and message, language, and form source. Please do not submit medical or other sensitive health information through these forms. We do not collect any of this without your action.' },
    { heading: '3. Legal Basis', content: 'We process your data based on: (a) Your consent (Art. 6(1)(a) GDPR) for analytics cookies; (b) Steps taken at your request prior to entering into a contract (Art. 6(1)(b) GDPR) for waitlist signups and audience inquiries; (c) Our legitimate interest (Art. 6(1)(f) GDPR) for essential site functionality and security.' },
    { heading: '4. Cookies', content: 'Essential cookies and local storage entries (e.g. your language and cookie preferences) are required for site functionality. Analytics (Google Analytics) is only activated with your explicit consent via the cookie banner. If you choose "Essential only", no analytics script is loaded. The _ga and _ga_* cookies identify a browser and its session and expire after at most 180 days without extending that period on each visit. Your cookie choice is saved in local storage. You can reject Analytics as easily as allow it, and withdraw consent at any time using "Cookie settings" in the footer. Withdrawal stops further measurement and removes accessible Analytics cookies; it does not affect the lawfulness of earlier processing.' },
    { heading: '5. Third Party Services', content: 'We use Brevo (Sendinblue SAS, France) to manage waitlist contacts and optional email confirmation and updates. Joining the waitlist does not itself grant permission for ongoing email updates. Sanity is our optional content management system and may store audience inquiries when that integration is configured. We use Google Analytics 4, provided by Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Ireland, as a processor for website measurement only after your consent. Google signals, advertising personalization and user-provided data collection are not enabled. No Google tag or measurement request is sent before consent. Analytics data may be transferred to servers in the United States; Google is certified under the Data Privacy Framework between the European Union and the United States.' },
    { heading: '6. Your Rights', content: 'Under GDPR, you have the right to: access your personal data, rectify inaccurate data, request erasure of your data, restrict processing, data portability, and object to processing. To exercise these rights, contact mqs@vanescience.com.' },
    { heading: '7. Data Retention', content: 'User-level and event-level Analytics data is retained for 14 months, without resetting user-data retention on new activity. Aggregated reports may remain available for longer. Waitlist signups are retained until the waitlist programme ends or until you ask us to delete your data, whichever comes first. Audience inquiries are retained only while needed to answer your request and manage the requested steps before a contract. They are then deleted unless a legal retention obligation applies or the data is needed to establish, exercise, or defend legal claims.' },
    { heading: '8. MQS Email Updates', content: 'Joining the MQS waitlist and requesting ongoing email updates are separate choices. Updates are optional. If you select them, we record your choice, the wording and version shown, the time, language and form source. We ask you to confirm your email address before sending ongoing updates about development and access. These updates use your consent under Art. 6(1)(a) GDPR. You can withdraw it at any time through the unsubscribe option in each update or by contacting mqs@vanescience.com. An assessment inquiry does not subscribe you to updates. Delivery records are used to process requests reliably and do not themselves prove email receipt or confirmed subscription.' },
    { heading: '9. Contact', content: 'For data protection inquiries, contact: mqs@vanescience.com. You also have the right to lodge a complaint with the Austrian Data Protection Authority (Datenschutzbehörde).' },
  ],
}

const de = {
  title: 'Datenschutz\u00ADerklärung',
  lastUpdated: 'Zuletzt aktualisiert: 14. Oktober 2026',
  sections: [
    { heading: '1. Verantwortlicher', content: 'VANE Science GmbH, Wien, Österreich ist der Verantwortliche für die Verarbeitung Ihrer personenbezogenen Daten. Kontakt: mqs@vanescience.com' },
    { heading: '2. Erhobene Daten', content: 'Analyse: Nur wenn Sie im Cookie Banner Analytics akzeptieren, erheben wir Nutzungsdaten über Google Analytics 4 (pseudonyme Cookie Kennungen, Browser- und Geräteinformationen, ungefährer Standort, Verweis- und Kampagneninformationen, besuchte Seiten, Sitzungsdauer und Interaktionen wie Klicks und erfolgreiche Formularübermittlungen). Google leitet aus IP Adressen den ungefähren Standort ab, protokolliert oder speichert IP Adressen jedoch nicht in GA4. Formularinhalte, Namen und E Mail Adressen übermitteln wir nicht an Analytics. Warteliste: Wenn Sie sich auf unsere Warteliste eintragen, speichern wir Ihre E Mail Adresse, das gewählte Segment, Ihre Sprache und die Stelle der Anmeldung. Zielgruppenanfragen: Wenn Sie ein rollenspezifisches Kontaktformular absenden, speichern wir Ihre E Mail Adresse, Zielgruppe, den kurzen Kontext und Ihre Nachricht, Sprache und Formularquelle. Bitte übermitteln Sie über diese Formulare keine medizinischen oder anderen sensiblen Gesundheitsdaten. Diese Daten erheben wir nur durch Ihre aktive Eingabe.' },
    { heading: '3. Rechtsgrundlage', content: 'Wir verarbeiten Ihre Daten auf Grundlage von: (a) Ihrer Einwilligung (Art. 6 Abs. 1 lit. a DSGVO) für Cookies zur Analyse; (b) vorvertraglichen Maßnahmen auf Ihre Anfrage (Art. 6 Abs. 1 lit. b DSGVO) für Anmeldungen zur Warteliste und Zielgruppenanfragen; (c) unserem berechtigten Interesse (Art. 6 Abs. 1 lit. f DSGVO) für wesentliche Sitefunktionalität und Sicherheit.' },
    { heading: '4. Cookies', content: 'Essenzielle Cookies und Einträge im Local Storage, etwa Ihre Einstellungen für Sprache und Cookies, sind für die Funktion der Website erforderlich. Analytics (Google Analytics) wird nur mit Ihrer ausdrücklichen Einwilligung über das Cookie Banner aktiviert. Bei „Nur essenziell" wird kein Analytics Skript geladen. Die Cookies _ga und _ga_* erkennen einen Browser und seine Sitzung und laufen nach höchstens 180 Tagen ab, ohne diese Frist bei jedem Besuch zu verlängern. Ihre Auswahl wird im Local Storage gespeichert. Ablehnen ist ebenso einfach wie Zustimmen. Sie können Ihre Einwilligung jederzeit über „Cookie Einstellungen“ im Seitenfuß widerrufen. Der Widerruf beendet weitere Messungen und entfernt zugängliche Analytics Cookies; die Rechtmäßigkeit der vorherigen Verarbeitung bleibt unberührt.' },
    { heading: '5. Drittanbieterdienste', content: 'Wir verwenden Brevo (Sendinblue SAS, Frankreich) zur Verwaltung von Wartelistenkontakten sowie für die optionale E Mail Bestätigung und Updates. Die Anmeldung zur Warteliste allein ist keine Einwilligung in laufende E Mail Updates. Sanity ist unser optionales Content Management System und kann bei aktivierter Anbindung Zielgruppenanfragen speichern. Für die Website Analyse verwenden wir Google Analytics 4 von Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland, als Auftragsverarbeiter ausschließlich nach Ihrer Einwilligung. Google Signale, personalisierte Werbung und die Erhebung von Nutzern bereitgestellter Daten sind nicht aktiviert. Vor der Einwilligung wird kein Google Tag geladen und keine Messanfrage gesendet. Analysedaten können an Server in den Vereinigten Staaten übertragen werden; Google ist unter dem Datenschutzrahmen zwischen der Europäischen Union und den Vereinigten Staaten zertifiziert.' },
    { heading: '6. Ihre Rechte', content: 'Gemäß DSGVO haben Sie das Recht auf: Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerspruch. Kontaktieren Sie mqs@vanescience.com zur Ausübung dieser Rechte.' },
    { heading: '7. Datenspeicherung', content: 'Nutzer- und ereignisbezogene Analysedaten werden 14 Monate gespeichert; neue Aktivitäten setzen die Aufbewahrungsfrist für Nutzerdaten nicht zurück. Aggregierte Berichte können länger verfügbar bleiben. Anmeldungen zur Warteliste werden gespeichert, bis das Wartelistenprogramm endet oder Sie die Löschung Ihrer Daten verlangen, je nachdem, was zuerst eintritt. Zielgruppenanfragen speichern wir nur so lange, wie es für die Beantwortung und die von Ihnen angefragten vorvertraglichen Schritte erforderlich ist. Danach löschen wir sie, sofern keine gesetzliche Aufbewahrungspflicht besteht oder die Daten zur Geltendmachung, Ausübung oder Verteidigung von Rechtsansprüchen benötigt werden.' },
    { heading: '8. E Mail Updates zum MQS', content: 'Die Anmeldung zur MQS Warteliste und der Wunsch nach laufenden E Mail Updates sind getrennte Entscheidungen. Updates sind freiwillig. Bei Auswahl speichern wir Ihre Entscheidung, den angezeigten Einwilligungstext mit Version, Zeitpunkt, Sprache und Formularquelle. Vor laufenden Updates zur Entwicklung und zum Zugang bitten wir um Bestätigung Ihrer E Mail Adresse. Grundlage ist Ihre Einwilligung nach Art. 6 Abs. 1 lit. a DSGVO. Sie können diese jederzeit über die Abmeldemöglichkeit in jedem Update oder über mqs@vanescience.com widerrufen. Eine Assessment Anfrage meldet Sie nicht für Updates an. Zustellungsdaten dienen der zuverlässigen Bearbeitung von Anfragen und sind allein kein Nachweis für einen E Mail Empfang oder ein bestätigtes Abonnement.' },
    { heading: '9. Kontakt', content: 'Für Datenschutzanfragen: mqs@vanescience.com. Sie haben auch das Recht, eine Beschwerde bei der österreichischen Datenschutzbehörde einzureichen.' },
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
                {s.heading.startsWith('5.') && (
                  <p className="text-sm text-muted-foreground">
                    <a className="underline hover:text-foreground" href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
                      {locale === 'de' ? 'Google Datenschutzhinweise' : 'Google privacy policy'}
                    </a>
                    {' · '}
                    <a className="underline hover:text-foreground" href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer">
                      {locale === 'de' ? 'So verwendet Google Daten von Websites' : 'How Google uses data from websites'}
                    </a>
                    {' · '}
                    <a className="underline hover:text-foreground" href="https://business.safety.google/adsprocessorterms/" target="_blank" rel="noopener noreferrer">
                      {locale === 'de' ? 'Auftragsverarbeitungsbedingungen' : 'Data processing terms'}
                    </a>
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  )
}

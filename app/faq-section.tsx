'use client'

import { motion } from 'framer-motion'
import { sectionReveal } from '@/lib/motion'
import { useLocale } from '@/lib/locale'
import { renderText } from '@/lib/render-text'
import { Section } from '@/components/ui/section'
import { Container } from '@/components/ui/container'
import { SectionHeader } from '@/components/ui/section-header'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'

const en = {
  overline: 'FAQ',
  headline: 'Frequently asked questions',
  items: [
    { q: 'What exactly is the MQS?', a: 'Like an IQ test, but for your body. The Movement Quality Score captures your movement quality across seven domains, from gait and postural control to strength, power, and movement under cognitive load. Your result is compared to people your age and sex: 50 means average, above 60 is above average. It is never just one number. Behind the score sits a profile of seven domain results.' },
    { q: 'Do I need special equipment?', a: 'No. VANE works independently of hardware. The standardized test battery runs on the force plate and camera setups that gyms, clinics, and performance facilities already use. There is no proprietary hardware and no dependency on one vendor. Our lab in Vienna, where the methodology is developed and standardized, serves as the reference environment.' },
    { q: 'How long does an assessment take?', a: 'Under 30 minutes for the full test battery. Analysis is automatic and delivered in real time.' },
    { q: 'What does it cost?', a: 'Launch pricing for the first cohort: MQS Baseline €590, Baseline + Retest €890 (our recommendation because the retest makes progress provable), and Partner Pilot from €1,900 for practices, facilities, and clubs. Team testing days and federation programs on request. Prices excl. VAT.' },
    { q: 'A good coach or physio sees this anyway. Why measure it?', a: 'A trained eye stays essential. The MQS makes those observations measurable, documented, comparable, and suitable for retesting. It creates a shared reference instead of gut feeling and evidence of progress you can actually show.' },
    { q: 'Why would I come back for a second assessment?', a: 'Because the retest is the core of the product. The baseline shows where you stand; the retest proves whether training or therapy actually works. The change between two measurements is what turns data into better decisions.' },
    { q: 'How solid is your reference data this early on?', a: 'We are transparent about it: the MQS is built on established psychometric test methodology, published movement research, and our own structured pilot data. Every standardized assessment grows the reference base. Every score is shown with its context, never as a black box.' },
    { q: 'How is VANE different from a fitness tracker?', a: 'They complement each other. Wearables are strong at measuring volume around the clock, including steps, heart rate, and sleep. The MQS measures movement quality in a standardized test situation: how well you move, not how much. Together, they give the full picture.' },
    { q: 'Is VANE a medical device?', a: 'No. VANE is a movement quality information tool, not a medical device. The MQS is a measurement and decision support profile: it can make asymmetries and risk indicators visible, but it does not replace medical advice and makes no guarantees about injuries or performance.' },
    { q: 'What does "compared to your age group" mean?', a: 'Your score is compared to a reference group matched by age and sex. An MQS of 55 means you move better than the average of your comparison group.' },
    { q: 'Can I use VANE as a gym owner or clinic?', a: 'Yes. VANE offers a partner model for gyms, clinics, and federations: standardized test battery, automated reports, retest workflows, and long term client monitoring. Request a discovery call to get started.' },
    { q: 'How do you protect my data?', a: 'VANE is GDPR-compliant: all data is processed in line with EU data protection law. We don\'t sell data, we only use analytics with your consent, and you can request deletion at any time. Details in our privacy policy.' },
  ],
}

const de = {
  overline: 'FAQ',
  headline: 'Häufig gestellte Fragen',
  items: [
    { q: 'Was genau ist der MQS?', a: 'Wie ein IQ Test, aber für deinen Körper. Der Movement Quality Score erfasst deine Bewegungsqualität in sieben Domänen, vom Gangbild und der posturalen Kontrolle über Kraft und Power bis zur Bewegung unter kognitiver Belastung. Dein Ergebnis wird mit Menschen deines Alters und Geschlechts verglichen: 50 bedeutet durchschnittlich, über 60 überdurchschnittlich. Es ist nie nur eine Zahl. Hinter dem Score steht ein Profil aus sieben Domänenwerten.' },
    { q: 'Brauche ich spezielle Geräte für den Test?', a: 'Nein. VANE funktioniert hardwareunabhängig. Die standardisierte Testbatterie läuft auf vorhandenen Setups mit Kraftmessplatten und Kameras in Gyms, Praxen und Performanceeinrichtungen. Es braucht weder proprietäre Hardware noch die Bindung an einen Anbieter. Unser Labor in Wien, wo die Methodik entwickelt und normiert wird, dient als Referenzumgebung.' },
    { q: 'Wie lange dauert ein Assessment?', a: 'Unter 30 Minuten für die vollständige Testbatterie. Die Auswertung erfolgt automatisch und in Echtzeit.' },
    { q: 'Was kostet es?', a: 'Die Launchpreise für die erste Kohorte: MQS Baseline 590 €, Baseline + Retest 890 € (unsere Empfehlung, denn im Retest wird Fortschritt belegbar) und Partner Pilot ab 1.900 € für Praxen, Einrichtungen und Vereine. Testtage für Teams und Verbandsprogramme gibt es auf Anfrage. Preise zzgl. USt.' },
    { q: 'Ein guter Coach oder Physio sieht das doch auch so. Warum messen?', a: 'Ein geschultes Auge bleibt essenziell. Der MQS macht diese Beobachtungen messbar, dokumentiert, vergleichbar und für Retests geeignet. So entsteht eine gemeinsame Referenz statt Bauchgefühl und ein Beleg für Fortschritt, den du zeigen kannst.' },
    { q: 'Warum sollte ich zu einem zweiten Assessment kommen?', a: 'Weil der Retest der Kern des Produkts ist. Die Baseline zeigt, wo du stehst; der Retest belegt, ob Training oder Therapie wirklich wirkt. Die Veränderung zwischen zwei Messungen macht aus Daten bessere Entscheidungen.' },
    { q: 'Wie belastbar sind eure Referenzdaten so früh?', a: 'Wir gehen transparent damit um: Der MQS basiert auf etablierter psychometrischer Testmethodik, publizierter Bewegungsforschung und unseren eigenen strukturierten Pilotdaten. Jedes standardisierte Assessment vergrößert die Referenzbasis. Jeder Score wird mit seinem Kontext gezeigt, nie als Black Box.' },
    { q: 'Wie unterscheidet sich VANE von einem Fitnesstracker?', a: 'Sie ergänzen sich. Wearables messen Volumen rund um die Uhr, darunter Schritte, Herzfrequenz und Schlaf. Der MQS misst Bewegungsqualität in einer standardisierten Testsituation: wie gut du dich bewegst, nicht wie viel. Zusammen ergeben sie das vollständige Bild.' },
    { q: 'Ist VANE ein Medizinprodukt?', a: 'Nein. VANE ist ein Informationswerkzeug für Bewegungsqualität, kein Medizinprodukt. Der MQS erstellt ein Profil zur Messung und Entscheidungsunterstützung. Er kann Asymmetrien und Risikoindikatoren sichtbar machen, ersetzt aber keine medizinische Beratung und gibt keine Garantien in Bezug auf Verletzungen oder Leistung.' },
    { q: 'Was bedeutet "verglichen mit meiner Altersgruppe"?', a: 'Dein Score wird mit einer Referenzgruppe verglichen, die deinem Alter und Geschlecht entspricht. Ein MQS von 55 bedeutet: Du bewegst dich besser als der Durchschnitt deiner Vergleichsgruppe.' },
    { q: 'Kann ich VANE als Betreiber eines Gyms oder einer Klinik nutzen?', a: 'Ja. VANE bietet ein Partnermodell für Gyms, Kliniken und Verbände: standardisierte Testbatterie, automatisierte Reports, Abläufe für Retests und langfristige Betreuung eurer Klienten. Frag ein Erstgespräch an.' },
    { q: 'Wie schützt ihr meine Daten?', a: 'VANE ist DSGVO konform: Alle Daten werden nach europäischem Datenschutzrecht verarbeitet. Wir verkaufen keine Daten, nutzen Analytics nur mit deiner Zustimmung, und du kannst jederzeit die Löschung deiner Daten verlangen. Details in unserer Datenschutzerklärung.' },
  ],
}

interface FaqSectionProps {
  data?: {
    faqOverline?: string
    faqOverlineDe?: string
    faqHeadline?: string
    faqHeadlineDe?: string
    faqItems?: Array<{
      question: string
      questionDe?: string
      answer: string
      answerDe?: string
    }>
  } | null
}

export function FaqSection({ data }: FaqSectionProps) {
  const { locale } = useLocale()
  const t = locale === 'de' ? de : en

  const isDE = locale === 'de'
  const overline = (isDE ? data?.faqOverlineDe : data?.faqOverline) || t.overline
  const headline = (isDE ? data?.faqHeadlineDe : data?.faqHeadline) || t.headline
  const items = data?.faqItems?.map(item => ({
    q: isDE ? (item.questionDe || item.question) : item.question,
    a: isDE ? (item.answerDe || item.answer) : item.answer,
  })) || t.items

  return (
    <Section id="faq" spacing="xl" divided>
      <Container size="md">
        <motion.div {...sectionReveal()}>
          <SectionHeader overline={overline} title={headline} align="center" />
        </motion.div>
        <motion.div {...sectionReveal(0.15)} className="mt-12">
          <Accordion type="single" collapsible>
            {items.map((item, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger>{item.q}</AccordionTrigger>
                <AccordionContent>{renderText(item.a)}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </Container>
    </Section>
  )
}

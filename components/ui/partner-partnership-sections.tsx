import Image from 'next/image'
import { Container } from '@/components/ui/container'
import type { Locale } from '@/lib/locale'

type PartnershipSection = {
  id: string
  eyebrow: string
  title: string
  body: string
  image: { src: string; alt: string; contain?: boolean } | null
}

export const partnerPartnershipSections: Record<Locale, PartnershipSection[]> = {
  en: [
    {
      id: 'mqs-setup',
      eyebrow: 'The MQS setup',
      title: 'The full MQS system, installed in your facility.',
      body: 'We set MQS up around the equipment you already have and make it part of your daily work, from the first assessment to the report your clients receive.',
      image: {
        src: '/audiences/athlete-training-lab-jump.webp',
        alt: 'An athlete completing a jump assessment with force plates and screens in the training lab',
      },
    },
    {
      id: 'partner-support',
      eyebrow: 'How we work with partners',
      title: "We don’t hand you software. We make your team excellent at it.",
      body: 'Partners work directly with our team in Vienna. We set things up with you, train your staff and stay close until your team runs MQS at the highest level and works scientifically with its data.',
      image: {
        src: '/media/audience-entry/coach-poster.webp',
        alt: 'Dario guiding an athlete through a jump assessment on a force plate',
        contain: true,
      },
    },
    {
      id: 'data-partnership',
      eyebrow: 'Data partnership',
      title: 'Help build the world’s movement quality reference.',
      body: 'NormVault is the database behind every MQS comparison. Partner facilities contribute at the highest level, which makes them strategic data partners, not just users. Contributions are anonymised numbers only, and your clients and raw data stay yours.',
      image: null,
    },
  ],
  de: [
    {
      id: 'mqs-setup',
      eyebrow: 'MQS bei dir vor Ort',
      title: 'Das gesamte MQS System. In deiner Einrichtung.',
      body: 'Wir richten MQS passend zu deiner vorhandenen Ausstattung ein und machen es zum Teil deiner täglichen Arbeit. Vom ersten Assessment bis zum Bericht für deine Kunden.',
      image: {
        src: '/audiences/athlete-training-lab-jump.webp',
        alt: 'Ein Athlet beim Sprungassessment mit Kraftmessplatten und Bildschirmen im Trainingslabor',
      },
    },
    {
      id: 'partner-support',
      eyebrow: 'So arbeiten wir mit Partnern',
      title: 'Mehr als Software. Wir machen dein Team fit für MQS.',
      body: 'Als Partner arbeitest du direkt mit unserem Team in Wien. Wir richten MQS gemeinsam mit dir ein, schulen dein Team und begleiten euch, bis ihr MQS auf höchstem Niveau einsetzt und wissenschaftlich mit den Daten arbeitet.',
      image: {
        src: '/media/audience-entry/coach-poster.webp',
        alt: 'Dario begleitet einen Athleten beim Sprungassessment auf einer Kraftmessplatte',
        contain: true,
      },
    },
    {
      id: 'data-partnership',
      eyebrow: 'Datenpartnerschaft',
      title: 'Gestalte die weltweite Referenz für Bewegungsqualität mit.',
      body: 'NormVault ist die Datenbank hinter jedem MQS Vergleich. Mit ihren Beiträgen werden Partnereinrichtungen zu strategischen Datenpartnern, nicht nur zu Anwendern. Geteilt werden ausschließlich anonymisierte Zahlenwerte, während deine Kunden und Rohdaten bei dir bleiben.',
      image: null,
    },
  ],
}

// Static and deliberately without measurements: an editorial reference visual,
// not a chart of real clients or a claim about the database's size.
const referenceNodes = Array.from({ length: 54 }, (_, index) => {
  const column = index % 9
  const row = Math.floor(index / 9)
  return {
    x: 58 + column * 59 + Math.sin(index * 1.8) * 17,
    y: 48 + row * 59 + Math.cos(index * 2.1) * 16,
  }
})

function ReferenceVisual() {
  return (
    <svg aria-hidden="true" viewBox="0 0 600 400" className="h-full w-full text-[var(--mqs-value-inv)]">
      <rect width="600" height="400" fill="#080f12" />
      <g fill="none" stroke="currentColor" strokeWidth="0.8">
        {referenceNodes.flatMap((point, index) =>
          referenceNodes.slice(index + 1).flatMap((next, offset) => {
            const distance = Math.hypot(point.x - next.x, point.y - next.y)
            return distance < 102 ? (
              <path key={`${index}-${offset}`} d={`M${point.x},${point.y}L${next.x},${next.y}`} opacity={0.12 + (1 - distance / 102) * 0.2} />
            ) : []
          }),
        )}
        <path d="M72 196C148 110 225 290 300 202S445 105 542 182M92 310C205 342 223 159 300 202S423 285 512 310M128 78C231 64 215 188 300 202S379 73 484 82" strokeWidth="1.5" opacity="0.48" />
        <circle cx="300" cy="202" r="49" opacity="0.16" />
        <circle cx="300" cy="202" r="26" opacity="0.4" />
      </g>
      <g fill="currentColor">
        {referenceNodes.map((point, index) => (
          <circle key={index} cx={point.x} cy={point.y} r={index % 7 === 0 ? 3.4 : 1.8} opacity={index % 7 === 0 ? 0.8 : 0.35} />
        ))}
        <circle cx="300" cy="202" r="8" opacity="0.9" />
      </g>
    </svg>
  )
}

export function PartnerPartnershipSections({ locale }: { locale: Locale }) {
  return (
    <div className="border-b border-white/10 bg-background py-12 md:py-16">
      <Container>
        <div className="grid gap-6 lg:grid-cols-3">
          {partnerPartnershipSections[locale].map((section) => (
            <section
              key={section.id}
              id={section.id}
              aria-labelledby={`${section.id}-title`}
              className="min-w-0 scroll-mt-24 overflow-hidden rounded-xl border border-white/10 bg-[#0B0C0E] sm:grid sm:grid-cols-[0.85fr_1.15fr] md:scroll-mt-28 lg:block"
            >
              <div className="relative aspect-[4/3] overflow-hidden border-b border-white/10 bg-[#050607] sm:aspect-auto sm:min-h-64 sm:border-b-0 sm:border-r lg:aspect-[4/3] lg:min-h-0 lg:border-b lg:border-r-0">
                {section.image ? (
                  <Image
                    src={section.image.src}
                    alt={section.image.alt}
                    fill
                    sizes="(min-width: 1024px) 32vw, (min-width: 768px) 90vw, 100vw"
                    className={`${section.image.contain ? 'object-contain' : 'object-cover object-[center_35%]'} brightness-[0.85] saturate-[0.8]`}
                  />
                ) : <ReferenceVisual />}
              </div>
              <div className="p-5 md:p-6">
                <p className="flex items-center gap-2.5 font-sans text-xs font-semibold uppercase leading-snug tracking-[0.08em] text-white/70">
                  <span aria-hidden="true" className="h-1 w-1 shrink-0 bg-[var(--mqs-value-inv)]" />
                  {section.eyebrow}
                </p>
                <h2 id={`${section.id}-title`} className="mt-4 font-display text-[1.875rem] font-bold uppercase leading-[1.05] tracking-[0.035em] text-foreground [text-wrap:balance] sm:text-[2.125rem]">
                  {section.title}
                </h2>
                <p className="mt-4 text-[15px] leading-[1.6] text-muted-foreground">
                  {section.body}
                </p>
              </div>
            </section>
          ))}
        </div>
      </Container>
    </div>
  )
}

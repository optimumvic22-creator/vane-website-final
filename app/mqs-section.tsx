'use client'

import { motion } from 'framer-motion'
import { sectionReveal } from '@/lib/motion'
import { useLocale } from '@/lib/locale'
import { Section } from '@/components/ui/section'
import { Container } from '@/components/ui/container'
import { SectionHeader } from '@/components/ui/section-header'
import { MqsInteractive } from '@/components/ui/mqs-interactive'

interface MqsSectionProps {
  data?: {
    mqsOverline?: string
    mqsOverlineDe?: string
    mqsHeadline?: string
    mqsHeadlineDe?: string
    mqsDescription?: string
    mqsDescriptionDe?: string
    mqsDomains?: Array<{
      code: string
      label: string
      labelDe?: string
      baselineScore: number
      videoUrl?: string
    }>
  } | null
}

export function MqsSection({ data }: MqsSectionProps) {
  const { locale } = useLocale()

  const overline = (locale === 'de' ? data?.mqsOverlineDe : data?.mqsOverline) || (locale === 'de' ? 'Der Score' : 'The Score')
  const headline = (locale === 'de' ? data?.mqsHeadlineDe : data?.mqsHeadline) || 'Movement Quality Score'
  const description = (locale === 'de' ? data?.mqsDescriptionDe : data?.mqsDescription) ||
    (locale === 'de'
      ? 'Deine gesamte Bewegungsqualität in einer Zahl, verglichen mit Menschen deines Alters und aufgeschlüsselt in sieben Bereiche.'
      : 'Your overall movement quality in one number, compared to people your age and broken down across seven areas.')

  return (
    <Section spacing="xl">
      <Container>
        <motion.div {...sectionReveal()}>
          <SectionHeader
            overline={overline}
            title={headline}
            description={description}
            align="center"
          />
        </motion.div>
        <MqsInteractive domains={data?.mqsDomains} />
      </Container>
    </Section>
  )
}

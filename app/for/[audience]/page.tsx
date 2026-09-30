import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { StructuredData } from '@/app/structured-data'
import {
  audienceContent,
  audienceSlugs,
  isAudienceSlug,
} from '@/lib/audience-content'
import { AudienceLanding } from './audience-landing'

type AudiencePageProps = {
  params: Promise<{ audience: string }>
}

export const dynamicParams = false

export function generateStaticParams() {
  return audienceSlugs.map((audience) => ({ audience }))
}

export async function generateMetadata({ params }: AudiencePageProps): Promise<Metadata> {
  const { audience } = await params
  if (!isAudienceSlug(audience)) return {}

  const copy = audienceContent[audience].en
  const audienceTitles = {
    athlete: 'Athletes',
    coach: 'Coaches',
    partner: 'Partners',
  } as const

  return {
    title: `VANE for ${audienceTitles[audience]}`,
    description: copy.intro,
    alternates: {
      canonical: `/for/${audience}`,
      languages: { 'x-default': `/for/${audience}` },
    },
  }
}

export default async function AudiencePage({ params }: AudiencePageProps) {
  const { audience } = await params
  if (!isAudienceSlug(audience)) notFound()

  return (
    <>
      <StructuredData audience={audience} />
      <AudienceLanding audience={audience} />
    </>
  )
}

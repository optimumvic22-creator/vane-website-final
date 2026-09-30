import {
  audienceContent,
  type AudienceSlug,
} from '@/lib/audience-content'

const siteUrl = 'https://vanescience.com'

const audienceSchemaDetails = {
  athlete: {
    pageName: 'VANE for Athletes',
    serviceName: 'VANE Movement Quality Assessment for Athletes',
    serviceType: 'Guided movement quality assessment',
    audienceType: 'Athletes',
  },
  coach: {
    pageName: 'VANE for Coaches',
    serviceName: 'VANE Team Movement Quality Assessment',
    serviceType: 'Team movement quality assessment',
    audienceType: 'Coaches, physiotherapists, and performance teams',
  },
  partner: {
    pageName: 'VANE for Partners',
    serviceName: 'VANE Movement Quality Partner Pilot',
    serviceType: 'Movement quality assessment partnership',
    audienceType: 'Organizations and integration partners',
  },
} satisfies Record<
  AudienceSlug,
  {
    pageName: string
    serviceName: string
    serviceType: string
    audienceType: string
  }
>

type StructuredDataProps = {
  audience: AudienceSlug
}

/** Server-rendered JSON-LD based only on content visible on each audience page. */
export function StructuredData({ audience }: StructuredDataProps) {
  const copy = audienceContent[audience].en
  const details = audienceSchemaDetails[audience]
  const pageUrl = `${siteUrl}/for/${audience}`
  const pageId = `${pageUrl}#webpage`
  const serviceId = `${pageUrl}#service`

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': pageId,
        url: pageUrl,
        name: details.pageName,
        description: copy.intro,
        inLanguage: 'en',
        isPartOf: {
          '@id': `${siteUrl}/#website`,
        },
        mainEntity: {
          '@id': serviceId,
        },
      },
      {
        '@type': 'Service',
        '@id': serviceId,
        url: pageUrl,
        name: details.serviceName,
        serviceType: details.serviceType,
        description: copy.intro,
        provider: {
          '@id': `${siteUrl}/#organization`,
        },
        audience: {
          '@type': 'Audience',
          audienceType: details.audienceType,
        },
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema).replace(/</g, '\\u003c'),
      }}
    />
  )
}

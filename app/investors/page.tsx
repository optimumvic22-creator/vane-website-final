import type { Metadata } from 'next'
import { InvestorsContent } from './investors-content'

export const metadata: Metadata = {
  title: { absolute: 'For Investors | VANE Science' },
  description:
    'VANE Science is building standardized movement quality infrastructure: the MQS assessment and reporting standard, the NormVault benchmark data asset, and a business model driven by partners.',
  alternates: {
    canonical: '/investors',
    languages: { 'x-default': '/investors' },
  },
}

export default function InvestorsPage() {
  return <InvestorsContent />
}

import type { Metadata } from 'next'
import { PrivacyContent } from './privacy-content'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'How VANE Science GmbH handles analytics, waitlist signups, audience inquiries, your GDPR rights, and contact requests.',
  alternates: {
    canonical: '/privacy',
    languages: { 'x-default': '/privacy' },
  },
}

export default function PrivacyPage() {
  return <PrivacyContent />
}

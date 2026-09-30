import type { Metadata } from 'next'
import { TermsContent } from './terms-content'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description:
    'The terms governing use of the VANE Science website: intellectual property, liability, and governing law in Vienna, Austria.',
  alternates: {
    canonical: '/terms',
    languages: { 'x-default': '/terms' },
  },
}

export default function TermsPage() {
  return <TermsContent />
}

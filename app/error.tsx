'use client'

import { Section } from '@/components/ui/section'
import { Container } from '@/components/ui/container'
import { H1, Body } from '@/components/ui/typography'
import { Button } from '@/components/ui/button'
import { useOptionalLocale } from '@/lib/locale'

export default function Error({ retry }: { error: unknown; retry: () => void }) {
  const locale = useOptionalLocale()?.locale ?? 'en'
  const isGerman = locale === 'de'

  return (
    <Section spacing="xl">
      <Container size="sm" className="text-center">
        <H1>{isGerman ? 'Etwas ist schiefgelaufen' : 'Something Went Wrong'}</H1>
        <Body className="mt-4">
          {isGerman
            ? 'Ein unerwarteter Fehler ist aufgetreten. Bitte versuche es erneut.'
            : 'An unexpected error occurred. Please try again.'}
        </Body>
        <Button onClick={retry} className="mt-8">
          {isGerman ? 'Erneut versuchen' : 'Try Again'}
        </Button>
      </Container>
    </Section>
  )
}

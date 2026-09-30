import Link from 'next/link'
import { Section } from '@/components/ui/section'
import { Container } from '@/components/ui/container'
import { H1, Body } from '@/components/ui/typography'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <Section spacing="xl">
      <Container size="sm" className="text-center">
        <H1>This page doesn&apos;t move.</H1>
        <Body className="mt-4">The page you&apos;re looking for doesn&apos;t exist. But your MQS is waiting.</Body>
        <Button asChild className="mt-8">
          <Link href="/">Back to home &rarr;</Link>
        </Button>
      </Container>
    </Section>
  )
}

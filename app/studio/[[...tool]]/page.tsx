import { notFound } from 'next/navigation'

export default async function StudioPage() {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || !process.env.NEXT_PUBLIC_SANITY_DATASET) notFound()
  const { Studio } = await import('./studio')
  return <Studio />
}

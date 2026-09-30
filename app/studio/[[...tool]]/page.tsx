'use client'

import { NextStudio } from 'next-sanity/studio'
import config from '@/sanity.config'

const origError = console.error
console.error = (...args: Parameters<typeof console.error>) => {
  if (typeof args[0] === 'string' && args[0].includes('createGlobalStyle')) return
  origError(...args)
}

export default function StudioPage() {
  return <NextStudio config={config} />
}

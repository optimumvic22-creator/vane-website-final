import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import { headers } from 'next/headers'
import { SiteChrome } from '@/components/layout/SiteChrome'
import './globals.css'

const instrumentSans = localFont({
  src: [
    {
      path: './fonts/InstrumentSans-Variable.woff2',
      weight: '400 700',
      style: 'normal',
    },
    {
      path: './fonts/InstrumentSans-Italic-Variable.woff2',
      weight: '400 700',
      style: 'italic',
    },
  ],
  variable: '--font-body-runtime',
  display: 'swap',
})

const jetbrainsMono = localFont({
  src: [
    {
      path: './fonts/JetBrainsMono-Variable.woff2',
      weight: '100 800',
      style: 'normal',
    },
    {
      path: './fonts/JetBrainsMono-Italic-Variable.woff2',
      weight: '100 800',
      style: 'italic',
    },
  ],
  variable: '--font-data-runtime',
  display: 'swap',
  preload: false,
})

const bebasNeue = localFont({
  src: './fonts/BebasNeue-Regular.woff2',
  weight: '400',
  style: 'normal',
  variable: '--font-display-runtime',
  display: 'swap',
})

export const viewport: Viewport = {
  viewportFit: 'cover',
  themeColor: '#000000',
}

const siteUrl = 'https://vanescience.com'

const siteSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${siteUrl}/#organization`,
      name: 'VANE Science',
      url: siteUrl,
    },
    {
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      name: 'VANE Science',
      url: siteUrl,
      inLanguage: ['en', 'de'],
      publisher: {
        '@id': `${siteUrl}/#organization`,
      },
    },
  ],
}

export const metadata: Metadata = {
  metadataBase: new URL('https://vanescience.com'),
  title: {
    default: 'VANE Science | We gave Human Movement a language.',
    template: '%s | VANE',
  },
  description:
    'One score. Seven domains. One shared language for movement quality.',
  openGraph: {
    type: 'website',
    // The site serves EN and DE at the same URL with a functional preference.
    // en_US is the default; de_AT is signalled as an available alternate.
    locale: 'en_US',
    alternateLocale: ['de_AT'],
    siteName: 'VANE Science',
    title: 'VANE Science | We gave Human Movement a language.',
    description:
      'One score. Seven domains. One shared language for movement quality.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VANE Science | We gave Human Movement a language.',
    description:
      'One score. Seven domains. One shared language for movement quality.',
  },
  robots: { index: true, follow: true },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Public-page proxy overwrites these headers from validated query/cookie values.
  // Reading request headers intentionally makes the HTML locale request-specific;
  // the team's explicit Next data-cache policy remains independent.
  const requestHeaders = await headers()
  const initialLocale = requestHeaders.get('x-vane-locale') === 'de' ? 'de' : 'en'
  const hasLocalePreference = requestHeaders.get('x-vane-locale-chosen') === '1'

  return (
    <html lang={initialLocale} className={`dark ${instrumentSans.variable} ${jetbrainsMono.variable} ${bebasNeue.variable}`}>
      <body className="min-h-dvh bg-background font-sans text-foreground antialiased">
        <script
          type="application/ld+json"
          // JSON.stringify + escaping "<" keeps the inline JSON-LD XSS-safe.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(siteSchema).replace(/</g, '\\u003c'),
          }}
        />
        <a href="#main-content" className="sr-only !m-0 focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground">
          {initialLocale === 'de' ? 'Zum Inhalt springen' : 'Skip to content'}
        </a>
        <SiteChrome initialLocale={initialLocale} hasLocalePreference={hasLocalePreference}>
          {children}
        </SiteChrome>
      </body>
    </html>
  )
}

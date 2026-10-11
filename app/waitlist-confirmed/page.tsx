import Link from 'next/link'

export const metadata = { title: 'Email confirmation | VANE', robots: { index: false, follow: false } }

export default function WaitlistConfirmedPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-36 text-center">
      <h1 className="font-display text-5xl">Thank you / Danke</h1>
      <p className="mt-6">Your email confirmation has been processed by Brevo.</p>
      <p className="mt-3">Deine E Mail Bestätigung wurde von Brevo verarbeitet.</p>
      <Link className="mt-8 inline-block underline" href="/">Back to VANE / Zurück zu VANE</Link>
    </main>
  )
}

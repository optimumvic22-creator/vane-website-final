import { z } from 'zod'

/**
 * Pure validation for the waitlist signup endpoint.
 *
 * Kept free of any Next.js / Sanity imports so it can be unit-tested in
 * isolation and shared with `app/api/waitlist/route.ts` (the single source of
 * truth for what a valid signup payload looks like).
 */
export const signupSchema = z.object({
  email: z.email().max(320),
  segment: z.enum(['individual', 'gym-clinic', 'federation', 'athlete', 'coach', 'partner']).optional(),
  updatesConsent: z.boolean().optional().default(false),
  locale: z.enum(['en', 'de']).optional(),
  source: z.string().max(120).optional(),
  // Honeypot. Real users never fill this field.
  company: z.string().optional(),
})

export type WaitlistInput = z.infer<typeof signupSchema>

/** Validate an unknown request body against the signup schema. */
export function parseWaitlistInput(payload: unknown) {
  return signupSchema.safeParse(payload)
}

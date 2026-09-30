import { z } from 'zod'

export const inquirySchema = z.object({
  email: z.email().max(320),
  audience: z.enum(['athlete', 'coach', 'partner']),
  context: z.string().trim().min(2).max(160),
  message: z.string().trim().max(600).optional(),
  locale: z.enum(['en', 'de']).optional(),
  source: z.string().max(120).optional(),
  // Honeypot. This field is visually hidden and must stay empty.
  company: z.string().optional(),
}).refine((input) => input.audience === 'athlete' || (input.message?.length ?? 0) >= 2, {
  path: ['message'],
  message: 'Please add a brief message.',
})

export type InquiryInput = z.infer<typeof inquirySchema>

export function parseInquiryInput(payload: unknown) {
  return inquirySchema.safeParse(payload)
}

import type { AudienceSlug } from './audience-content'
import type { Locale } from './locale'

export function validateInquiryFields(context: string, message: string, audience: AudienceSlug, locale: Locale) {
  if (context.trim().length < 2) {
    return {
      field: 'context' as const,
      message: audience === 'athlete'
        ? locale === 'de' ? 'Bitte gib deine Sportart an.' : 'Please enter your sport.'
        : locale === 'de' ? 'Bitte gib deine Rolle oder Organisation an.' : 'Please enter your role or organization.',
    }
  }
  if (audience !== 'athlete' && message.trim().length < 2) {
    return {
      field: 'message' as const,
      message: locale === 'de' ? 'Bitte ergänze eine kurze Nachricht.' : 'Please add a brief message.',
    }
  }
  return null
}

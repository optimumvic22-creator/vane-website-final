import { defineType, defineField } from 'sanity'
import { leadDeliveryFields } from './leadDeliveryFields'

export const waitlistSignup = defineType({
  name: 'waitlistSignup',
  title: 'Waitlist Signup',
  type: 'document',
  readOnly: true,
  fields: [
    defineField({ name: 'email', title: 'Email', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'segment',
      title: 'Segment',
      type: 'string',
      options: {
        list: [
          { title: 'Individual', value: 'individual' },
          { title: 'Gym / Clinic', value: 'gym-clinic' },
          { title: 'Federation', value: 'federation' },
          { title: 'Coach', value: 'coach' },
          { title: 'Partner', value: 'partner' },
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'locale',
      title: 'Locale',
      type: 'string',
      options: { list: [{ title: 'English', value: 'en' }, { title: 'German', value: 'de' }] },
    }),
    defineField({ name: 'createdAt', title: 'Created At', type: 'datetime', validation: (r) => r.required() }),
    defineField({ name: 'source', title: 'Source', type: 'string', description: 'Where the signup came from, e.g. "waitlist-section" or "use-cases:club".' }),
    defineField({ name: 'product', title: 'Product', type: 'string' }),
    defineField({ name: 'status', title: 'Waitlist status', type: 'string' }),
    defineField({ name: 'updatesConsent', title: 'Email updates requested', type: 'boolean', description: 'A request only, not confirmed subscription. The mail provider must confirm the address and honor suppression.' }),
    defineField({ name: 'updatesConsentAt', title: 'Updates requested at', type: 'datetime' }),
    defineField({ name: 'updatesConsentVersion', title: 'Consent wording version', type: 'string' }),
    defineField({ name: 'updatesConsentText', title: 'Consent wording shown', type: 'text', rows: 3 }),
    ...leadDeliveryFields,
  ],
  orderings: [{ title: 'Newest First', name: 'createdAtDesc', by: [{ field: 'createdAt', direction: 'desc' }] }],
  preview: { select: { title: 'email', subtitle: 'segment' } },
})

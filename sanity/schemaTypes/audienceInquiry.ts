import { defineField, defineType } from 'sanity'
import { leadDeliveryFields } from './leadDeliveryFields'

export const audienceInquiry = defineType({
  name: 'audienceInquiry',
  title: 'Audience Inquiry',
  type: 'document',
  fields: [
    defineField({ name: 'email', title: 'Email', type: 'string', validation: (rule) => rule.required() }),
    defineField({
      name: 'audience',
      title: 'Audience',
      type: 'string',
      options: {
        list: [
          { title: 'Athlete', value: 'athlete' },
          { title: 'Coach', value: 'coach' },
          { title: 'Partner', value: 'partner' },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({ name: 'context', title: 'Primary Context', type: 'string' }),
    defineField({ name: 'message', title: 'Request Details', type: 'text', rows: 4 }),
    defineField({
      name: 'locale',
      title: 'Locale',
      type: 'string',
      options: { list: [{ title: 'English', value: 'en' }, { title: 'German', value: 'de' }] },
    }),
    defineField({ name: 'source', title: 'Source', type: 'string' }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      initialValue: 'new',
      options: {
        list: [
          { title: 'New', value: 'new' },
          { title: 'In progress', value: 'in-progress' },
          { title: 'Handled', value: 'handled' },
        ],
      },
    }),
    defineField({ name: 'createdAt', title: 'Created At', type: 'datetime', validation: (rule) => rule.required() }),
    ...leadDeliveryFields,
  ],
  orderings: [
    { title: 'Newest First', name: 'createdAtDesc', by: [{ field: 'createdAt', direction: 'desc' }] },
  ],
  preview: {
    select: { title: 'email', audience: 'audience', status: 'status' },
    prepare({ title, audience, status }) {
      return { title, subtitle: [audience, status].filter(Boolean).join(' · ') }
    },
  },
})

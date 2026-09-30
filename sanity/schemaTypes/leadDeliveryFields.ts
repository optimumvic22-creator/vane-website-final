import { defineField } from 'sanity'

/** Transport acceptance is not proof that a person received an email. */
export const leadDeliveryFields = [
  defineField({ name: 'deliveryStatus', title: 'Contact delivery', type: 'string', readOnly: true,
    options: { list: ['pending', 'processing', 'delivered', 'failed'] },
    description: 'Provider acceptance only. Review failed jobs; no automatic mailing permission.' }),
  defineField({ name: 'deliveryEventId', title: 'Delivery event ID', type: 'string', readOnly: true }),
  defineField({ name: 'deliveryAttempts', title: 'Delivery attempts', type: 'number', readOnly: true }),
  defineField({ name: 'deliveryLeaseUntil', title: 'Worker lease until', type: 'datetime', readOnly: true }),
  defineField({ name: 'deliveryNextAttemptAt', title: 'Next delivery attempt', type: 'datetime', readOnly: true }),
  defineField({ name: 'deliveryAcceptedAt', title: 'Provider accepted at', type: 'datetime', readOnly: true }),
  defineField({ name: 'deliveryLastError', title: 'Last delivery error code', type: 'string', readOnly: true }),
]

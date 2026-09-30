import type { StructureResolver } from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Homepage')
        .id('homepage')
        .child(
          S.document().schemaType('homepage').documentId('homepage').title('Homepage'),
        ),
      S.divider(),
      S.documentTypeListItem('teamMember').title('Team Members'),
      S.divider(),
      S.documentTypeListItem('waitlistSignup').title('Waitlist Signups'),
    ])

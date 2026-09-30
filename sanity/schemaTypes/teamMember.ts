import { defineType, defineField } from 'sanity'

export const teamMember = defineType({
  name: 'teamMember',
  title: 'Team Member',
  type: 'document',
  groups: [
    { name: 'basics', title: 'Basis', default: true },
    { name: 'photo', title: 'Foto' },
    { name: 'bio', title: 'Bio & Beitrag' },
    { name: 'links', title: 'Links' },
  ],
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', group: 'basics', description: 'Vollständiger Name (wird auf der Teamseite angezeigt).', validation: (r) => r.required() }),
    defineField({ name: 'role', title: 'Rolle (EN)', type: 'string', group: 'basics', description: 'Funktion/Titel auf Englisch, z. B. „Co-Founder".', validation: (r) => r.required() }),
    defineField({ name: 'roleDe', title: 'Rolle (DE)', type: 'string', group: 'basics', description: 'Funktion/Titel auf Deutsch, z. B. „Co-Founder".' }),
    defineField({ name: 'displayOrder', title: 'Reihenfolge', type: 'number', group: 'basics', description: 'Sortierung auf der Teamseite (kleinste Zahl zuerst).' }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', group: 'basics', options: { source: 'name', maxLength: 96 }, description: 'Technischer Bezeichner (aus dem Namen generieren). Für interne Verlinkung.' }),

    defineField({ name: 'headshot', title: 'Foto', type: 'image', group: 'photo', options: { hotspot: true }, description: 'Porträtfoto. Quadratisch oder Hochformat, min. 800×800 px, JPG. Bildausschnitt über den Fokuspunkt (Hotspot) festlegen.' }),

    defineField({ name: 'bio', title: 'Bio (EN)', type: 'text', rows: 5, group: 'bio', description: 'Kurzbiografie auf Englisch (2 bis 4 Sätze).' }),
    defineField({ name: 'bioDe', title: 'Bio (DE)', type: 'text', rows: 5, group: 'bio', description: 'Kurzbiografie auf Deutsch (2 bis 4 Sätze).' }),
    defineField({ name: 'credentials', title: 'Qualifikationen (EN)', type: 'array', of: [{ type: 'string' }], group: 'bio', description: 'Abschlüsse/Referenzen als kurze Chips, z. B. „BSc Sport Science, University of Vienna".' }),
    defineField({ name: 'credentialsDe', title: 'Qualifikationen (DE)', type: 'array', of: [{ type: 'string' }], group: 'bio', description: 'Abschlüsse/Referenzen als kurze Chips (deutsch).' }),
    defineField({ name: 'contribution', title: 'Beitrag (EN)', type: 'string', group: 'bio', description: 'Einzeiler, was diese Person zu VANE beiträgt (englisch).' }),
    defineField({ name: 'contributionDe', title: 'Beitrag (DE)', type: 'string', group: 'bio', description: 'Einzeiler, was diese Person zu VANE beiträgt (deutsch).' }),
    defineField({ name: 'quote', title: 'Zitat (EN)', type: 'text', group: 'bio', description: 'Optionales persönliches Zitat (englisch).' }),
    defineField({ name: 'quoteDe', title: 'Zitat (DE)', type: 'text', group: 'bio', description: 'Optionales persönliches Zitat (deutsch).' }),

    defineField({ name: 'linkedinUrl', title: 'LinkedIn URL', type: 'url', group: 'links', description: 'Vollständige URL, z. B. https://www.linkedin.com/in/…' }),
    defineField({ name: 'twitterUrl', title: 'Twitter/X URL', type: 'url', group: 'links' }),
    defineField({ name: 'websiteUrl', title: 'Website URL', type: 'url', group: 'links' }),
  ],
  orderings: [{ title: 'Reihenfolge', name: 'displayOrder', by: [{ field: 'displayOrder', direction: 'asc' }] }],
  preview: { select: { title: 'name', subtitle: 'role', media: 'headshot' } },
})

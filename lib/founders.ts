/**
 * Single source of truth for founder identity.
 *
 * To announce the CTO or update a founder, edit HERE. The homepage
 * (`app/vision-section.tsx`), the investors page
 * (`app/investors/investors-content.tsx`) and the team page fallback
 * (`app/team/team-content.tsx`) all read the shared identity facts (display
 * name, LinkedIn URL, placeholder state, and the team-fallback role/bio/
 * credentials) from this file, so they can never drift apart.
 *
 * Note: the team page's PRIMARY source is the Sanity CMS (`teamMember`
 * documents edited at `/studio`). The values below are the fallback used only
 * when Sanity is empty or unreachable. Page-specific prose that is genuinely
 * unique to one page (the homepage founder quotes, the investors "Foundation"
 * paragraph, and the investors `founderMeta` line) intentionally stays in its
 * own component. Only the shared identity facts are consolidated here.
 */

/** A string that exists in both site languages. */
export interface FounderText {
  en: string
  de: string
}

export interface Founder {
  /** Display name. The one place every page reads the founder's name from. */
  name: string
  /**
   * Role/title as shown on the TEAM page fallback (EN/DE). For an unannounced
   * founder this doubles as the announcement label (e.g. "Announcement follows").
   */
  role: FounderText
  /** Short bio for the TEAM page fallback (EN/DE). */
  bio?: FounderText
  /** Credential chips for the TEAM page fallback, as aligned EN/DE pairs. */
  credentials?: FounderText[]
  /** One-line contribution summary for the TEAM page fallback (EN/DE). */
  contribution?: FounderText
  /** Public LinkedIn URL, when available. */
  linkedinUrl?: string
  /** True until the person is publicly announced (CTO placeholder). */
  isPlaceholder?: boolean
}

export const FOUNDERS: { dario: Founder; cto: Founder } = {
  dario: {
    name: 'Dario Saisan',
    role: { en: 'Cofounder', de: 'Mitgründer' },
    bio: {
      en: "Performance coach, sport scientist, and founder of Saisan Training (since 2019). Dario has spent years building performance systems for elite athletes in Bundesliga football and top European basketball leagues. He also completed a Strength & Conditioning internship with USC Division 1 Men's Basketball in Los Angeles. He brings sport science methodology, performance testing expertise, and a proven athlete clientele to VANE.",
      de: 'Performance Coach, Sportwissenschaftler und Gründer von Saisan Training (seit 2019). Dario baut seit Jahren Performancesysteme für Spitzensportler im Fußball der Deutschen Bundesliga und in europäischen Spitzenligen im Basketball. Zudem absolvierte er ein Praktikum in Strength and Conditioning beim Basketballteam der Division 1 der USC in Los Angeles. Er bringt sportwissenschaftliche Methodik, Erfahrung in Leistungstests und einen gewachsenen Athletenstamm in VANE ein.',
    },
    credentials: [
      { en: 'BSc Sport Science, University of Vienna (2025)', de: 'BSc Sportwissenschaft, Universität Wien (2025)' },
      { en: 'Founder, Saisan Training (since 2019)', de: 'Gründer, Saisan Training (seit 2019)' },
      { en: "S&C Internship, USC Division 1 Men's Basketball (Los Angeles)", de: "Praktikum in Strength and Conditioning, USC Division 1 Men's Basketball (Los Angeles)" },
    ],
    contribution: {
      en: 'Product vision, sport science methodology, performance testing, athlete network',
      de: 'Produktvision, sportwissenschaftliche Methodik, Leistungstests, Athletennetzwerk',
    },
    linkedinUrl: 'https://www.linkedin.com/in/dario-saisan-8a4504200',
    isPlaceholder: false,
  },
  cto: {
    name: 'Cofounder & CTO',
    role: { en: 'Announcement follows', de: 'Ankündigung folgt' },
    bio: {
      en: 'Leads the technical development of VANE, including the MQS algorithm, data infrastructure, and software architecture. The full introduction follows soon.',
      de: 'Leitet die technische Entwicklung von VANE. Dazu gehören der Algorithmus des MQS, die Dateninfrastruktur und die Softwarearchitektur. Die vollständige Vorstellung folgt in Kürze.',
    },
    credentials: [],
    contribution: {
      en: 'Tech & software, MQS algorithm, data architecture',
      de: 'Technik & Software, Algorithmus des MQS, Datenarchitektur',
    },
    isPlaceholder: true,
  },
}

'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { User, Linkedin } from 'lucide-react'
import { sectionReveal, staggerReveal, staggerItem } from '@/lib/motion'
import { useLocale } from '@/lib/locale'
import { Section } from '@/components/ui/section'
import { Container } from '@/components/ui/container'
import { SectionHeader } from '@/components/ui/section-header'
import { FOUNDERS } from '@/lib/founders'

interface Founder {
  name: string
  role: string
  bio: string
  credentials: string[]
  contribution: string
  linkedin?: string
  imageUrl?: string
}

/**
 * Shape of a `teamMember` document as returned by the TEAM_MEMBERS query
 * (see lib/queries.ts). All fields are optional so an incompletely filled-in
 * Studio document never crashes the page.
 */
export interface SanityTeamMember {
  name?: string | null
  role?: string | null
  roleDe?: string | null
  bio?: string | null
  bioDe?: string | null
  credentials?: string[] | null
  credentialsDe?: string[] | null
  contribution?: string | null
  contributionDe?: string | null
  linkedinUrl?: string | null
  headshot?: { asset?: { url?: string | null } | null } | null
}

/**
 * Public leadership profiles derived from the shared identity source.
 * CMS content may enrich Dario's profile, but cannot hide either leader.
 */
function fromFounders(locale: 'en' | 'de'): Founder[] {
  return [FOUNDERS.dario, FOUNDERS.marko]
    .filter((founder) => !founder.isPlaceholder)
    .map((founder) => ({
      name: founder.name,
      role: founder.role[locale],
      bio: founder.bio?.[locale] ?? '',
      credentials: (founder.credentials ?? []).map((credential) =>
        credential[locale],
      ),
      contribution: founder.contribution?.[locale] ?? '',
      linkedin: founder.linkedinUrl,
      imageUrl: founder.name === FOUNDERS.dario.name
        ? '/audiences/coach-saisan-presentation.jpeg'
        : '/marko-rados-portrait-black.png',
    }))
}

const normalizeIdentity = (value?: string | null) =>
  value?.trim().toLocaleLowerCase('en-US') ?? ''

const placeholderFounderName = normalizeIdentity(FOUNDERS.cto.name)
const placeholderFounderRoles = new Set([
  normalizeIdentity(FOUNDERS.cto.role.en),
  normalizeIdentity(FOUNDERS.cto.role.de),
])

function isPublicTeamMember(member: SanityTeamMember): boolean {
  const name = normalizeIdentity(member.name)
  const roles = [member.role, member.roleDe].map(normalizeIdentity)

  if (!name) return false

  return (
    name !== placeholderFounderName &&
    !roles.some((role) => placeholderFounderRoles.has(role))
  )
}

/**
 * Map Sanity team members to the local Founder shape for the current locale,
 * falling back to English strings when a German field is empty.
 */
function fromSanity(members: SanityTeamMember[], locale: 'en' | 'de'): Founder[] {
  const isDE = locale === 'de'
  return members
    .filter(isPublicTeamMember)
    .map((m) => ({
      name: m.name ?? '',
      role: (isDE ? m.roleDe : m.role) || m.role || '',
      bio: (isDE ? m.bioDe : m.bio) || m.bio || '',
      credentials:
        (isDE ? m.credentialsDe : m.credentials) || m.credentials || [],
      contribution:
        (isDE ? m.contributionDe : m.contribution) || m.contribution || '',
      linkedin: m.linkedinUrl || undefined,
      imageUrl: m.headshot?.asset?.url || undefined,
    }))
}

export function TeamContent({ members }: { members?: SanityTeamMember[] | null }) {
  const { locale } = useLocale()
  const sanityTeam = members ? fromSanity(members, locale) : []
  const leadership = fromFounders(locale)
  const team = [
    ...leadership.map((founder) => {
      if (founder.name === FOUNDERS.marko.name) return founder
      const cms = sanityTeam.find((member) => normalizeIdentity(member.name) === normalizeIdentity(founder.name))
      return cms ? {
        ...founder,
        ...cms,
        role: founder.role,
        bio: cms.bio || founder.bio,
        credentials: cms.credentials.length > 0 ? cms.credentials : founder.credentials,
        contribution: cms.contribution || founder.contribution,
        imageUrl: cms.imageUrl || founder.imageUrl,
      } : founder
    }),
    ...sanityTeam.filter((member) => !leadership.some((founder) => normalizeIdentity(founder.name) === normalizeIdentity(member.name))),
  ]

  return (
    <>
      <Section spacing="xl">
        <Container size="md">
          <motion.div {...sectionReveal()} initial={false}>
            <SectionHeader
              titleAs="h1"
              overline="VANE Science"
              title={locale === 'de' ? 'Das Team' : 'The Team'}
              description={locale === 'de'
                ? 'VANE verbindet Sportwissenschaft, Performancepraxis und Technologie mit einer gemeinsamen Vision: einen universellen, objektiven Standard zur Messung menschlicher Bewegungsqualität zu schaffen.'
                : 'VANE brings together sport science, performance practice, and technology around one vision: to create a universal, objective standard for measuring human movement quality.'}
              align="center"
            />
          </motion.div>

          <motion.div
            {...staggerReveal(0.15)}
            initial={false}
            className={`mt-16 grid gap-8 ${
              team.length > 1 ? 'md:grid-cols-2' : 'mx-auto max-w-5xl'
            }`}
          >
            {team.map((founder) => (
              <motion.div
                key={founder.name}
                {...staggerItem()}
                className="flow-root rounded-xl border border-border/20 bg-[#0B0C0E] p-5 sm:p-6 md:p-7"
              >
                <div className="relative float-left mb-3 mr-4 flex aspect-[3/4] w-[80px] items-center justify-center overflow-hidden rounded-md border border-white/10 bg-black sm:mr-5 sm:w-[108px]">
                  {founder.imageUrl ? (
                    <Image
                      src={founder.imageUrl}
                      alt={founder.name}
                      fill
                      sizes="(max-width: 639px) 80px, 108px"
                      className={founder.name === FOUNDERS.marko.name ? 'scale-[1.16] object-cover object-[center_38%]' : 'object-cover'}
                    />
                  ) : (
                    <User className="h-10 w-10 text-muted-foreground/30" />
                  )}
                </div>
                <div>
                  <h2 className="font-display text-2xl font-bold uppercase leading-tight tracking-[0.085em] text-foreground [-webkit-text-stroke:0.15px_currentColor] [paint-order:stroke_fill]">
                    {founder.name}
                  </h2>
                  <p className="mt-1 text-[1.04rem] font-medium text-primary">{founder.role}</p>
                  <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground">
                    {founder.bio.split(/(?=He also completed|Zudem absolvierte er|In late 2014|Ende 2014)/).filter(Boolean).map((paragraph) => (
                      <p key={paragraph}>{paragraph.trim()}</p>
                    ))}
                  </div>
                  {founder.credentials.length > 0 && (
                    <ul className="mt-5 space-y-2.5 font-sans text-[13px] leading-relaxed text-foreground/85">
                      {founder.credentials.map((cred, j) => (
                        <li
                          key={j}
                          className="border-l-2 border-primary/35 pl-3"
                        >
                          {cred}
                        </li>
                      ))}
                    </ul>
                  )}
                  <p className="mt-5 border-t border-white/10 pt-4 text-sm leading-relaxed text-muted-foreground/80">{founder.contribution}</p>
                  {founder.linkedin && founder.name !== FOUNDERS.dario.name && (
                    <div className="mt-4">
                      <a
                        href={founder.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="LinkedIn"
                        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-muted-foreground transition-colors hover:border-primary/30 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <Linkedin className="h-5 w-5" />
                      </a>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </Container>
      </Section>
    </>
  )
}

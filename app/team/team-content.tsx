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
  imagePosition?: string
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
 * Fallback founder copy, derived from the shared identity source
 * (`lib/founders.ts`) so names, credentials and the CTO placeholder can never
 * drift from the homepage and investors page. Used only when Sanity has no
 * team members; otherwise the CMS is the source of truth.
 */
function fromFounders(locale: 'en' | 'de'): Founder[] {
  return [FOUNDERS.dario, FOUNDERS.cto]
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
        ? '/audiences/coach-training-decisions.jpg'
        : undefined,
      imagePosition: founder.name === FOUNDERS.dario.name ? 'center 38%' : undefined,
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
  // Prefer CMS content when available; otherwise fall back to the built-in copy
  // so the page always renders even when Sanity is empty or unreachable.
  const team = sanityTeam.length > 0 ? sanityTeam : fromFounders(locale)

  return (
    <>
      <Section spacing="xl">
        <Container size="md">
          <motion.div {...sectionReveal()} initial={false}>
            <SectionHeader
              titleAs="h1"
              overline={locale === 'de' ? 'Das Team' : 'The Team'}
              title={locale === 'de' ? 'Die Gründer' : 'Meet the Founders'}
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
            {team.map((founder, i) => (
              <motion.div
                key={i}
                {...staggerItem()}
                className={`group overflow-hidden rounded-xl border border-border/20 bg-[#0B0C0E] ${
                  team.length === 1
                    ? 'lg:grid lg:grid-cols-[0.92fr_1.08fr]'
                    : ''
                }`}
              >
                <div
                  className={`relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-muted/30 ${
                    team.length === 1 ? 'md:aspect-[16/9] lg:aspect-auto lg:min-h-[460px]' : ''
                  }`}
                >
                  {founder.imageUrl ? (
                    <Image
                      src={founder.imageUrl}
                      alt={founder.name}
                      fill
                      sizes={
                        team.length === 1
                          ? '(max-width: 1023px) 100vw, 46vw'
                          : '(max-width: 768px) 100vw, 400px'
                      }
                      className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.025] motion-reduce:transition-none"
                      style={{ objectPosition: founder.imagePosition }}
                    />
                  ) : (
                    <User className="h-20 w-20 text-muted-foreground/30" />
                  )}
                </div>
                <div
                  className={`p-6 md:p-8 ${
                    team.length === 1
                      ? 'lg:flex lg:flex-col lg:justify-center lg:p-12'
                      : ''
                  }`}
                >
                  <h2
                    className={`font-display font-bold uppercase tracking-[0.02em] text-foreground [-webkit-text-stroke:0.15px_currentColor] [paint-order:stroke_fill] ${
                      team.length === 1
                        ? 'text-3xl md:text-4xl'
                        : 'text-xl'
                    }`}
                  >
                    {founder.name}
                  </h2>
                  <p className="mt-1 text-sm font-medium text-primary">{founder.role}</p>
                  <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground">
                    {founder.bio.split(/(?=He also completed|Zudem absolvierte er)/).filter(Boolean).map((paragraph) => (
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
                  {founder.linkedin && (
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

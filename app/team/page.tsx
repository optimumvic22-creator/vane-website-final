import type { Metadata } from 'next'
import { TeamContent } from './team-content'
import { getTeamMembers } from './team-data'

export const metadata: Metadata = {
  title: { absolute: 'Team | VANE Science' },
  description:
    'Meet the founders behind VANE Science, the team in Vienna building the Movement Quality Score as a standardized measure of human movement quality.',
  alternates: {
    canonical: '/team',
    languages: { 'x-default': '/team' },
  },
}

export default async function TeamPage() {
  const members = await getTeamMembers()
  return <TeamContent members={members} />
}

'use client'

/** Canonical waitlist segments. Mirror the options in sanity/schemaTypes/waitlistSignup.ts. */
export type WaitlistSegment = 'individual' | 'gym-clinic' | 'federation' | 'coach' | 'partner'

export const WAITLIST_SEGMENT_EVENT = 'vane:waitlist-segment'

export interface WaitlistSegmentDetail {
  segment: WaitlistSegment
  source?: string
}

/** Preselect a segment chip in the waitlist form and scroll to it. */
export function goToWaitlist(segment?: WaitlistSegment, source?: string) {
  if (segment) {
    window.dispatchEvent(
      new CustomEvent<WaitlistSegmentDetail>(WAITLIST_SEGMENT_EVENT, { detail: { segment, source } }),
    )
  }
  document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' })
}

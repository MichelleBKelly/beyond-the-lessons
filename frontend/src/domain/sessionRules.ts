import type { SessionStatus } from '../types/domain'

const transitions: Record<SessionStatus, SessionStatus[]> = {
  DRAFT: ['OPEN', 'CANCELLED'],
  OPEN: ['CLAIMED', 'CANCELLED', 'NO_VOLUNTEER'],
  CLAIMED: ['CONFIRMED', 'OPEN', 'CANCELLED', 'NO_SHOW'],
  CONFIRMED: ['COMPLETED', 'CANCELLED', 'NO_SHOW', 'DISPUTED'],
  COMPLETED: [],
  CANCELLED: [],
  NO_VOLUNTEER: ['OPEN', 'CANCELLED'],
  NO_SHOW: ['DISPUTED', 'OPEN'],
  DISPUTED: ['COMPLETED', 'CANCELLED'],
}

export function canTransition(from: SessionStatus, to: SessionStatus): boolean {
  return transitions[from].includes(to)
}

export function hoursForDuration(durationMinutes: 30 | 60): number {
  return durationMinutes / 60
}

export function isEligibleForSession(
  session: Pick<SessionEligibility, 'status' | 'date' | 'startTime' | 'endTime' | 'timezone'>,
  volunteer: Pick<VolunteerEligibility, 'approvalStatus' | 'availability' | 'timezone'>,
): boolean {
  if (session.status !== 'OPEN' || volunteer.approvalStatus !== 'approved') return false

  const day = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    timeZone: session.timezone,
  }).format(new Date(`${session.date}T${session.startTime}:00`))

  return volunteer.availability.some(
    (window) => window.day.toLowerCase() === day.toLowerCase()
      && window.startTime <= session.startTime
      && window.endTime >= session.endTime,
  )
}

interface SessionEligibility {
  status: SessionStatus
  date: string
  startTime: string
  endTime: string
  timezone: string
}

interface VolunteerEligibility {
  approvalStatus: 'pending' | 'approved' | 'rejected'
  availability: { day: string; startTime: string; endTime: string }[]
  timezone: string
}

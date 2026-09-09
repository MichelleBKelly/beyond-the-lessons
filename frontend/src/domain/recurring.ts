import type { SessionStatus } from '../types/domain'

export interface RecurringInput {
  startDate: string
  endDate: string
  daysOfWeek: number[]
}

export interface OccurrenceSeed {
  date: string
  status: SessionStatus
}

export function createOccurrences(input: RecurringInput): OccurrenceSeed[] {
  const start = new Date(`${input.startDate}T12:00:00Z`)
  const end = new Date(`${input.endDate}T12:00:00Z`)
  const wantedDays = new Set(input.daysOfWeek)
  const occurrences: OccurrenceSeed[] = []

  for (const date = new Date(start); date <= end; date.setUTCDate(date.getUTCDate() + 1)) {
    if (wantedDays.has(date.getUTCDay())) {
      occurrences.push({ date: date.toISOString().slice(0, 10), status: 'OPEN' })
    }
  }
  return occurrences
}

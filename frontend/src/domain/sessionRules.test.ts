import { describe, expect, it } from 'vitest'
import { createOccurrences } from './recurring'
import { canTransition, hoursForDuration, isEligibleForSession } from './sessionRules'

describe('session rules', () => {
  it('allows only valid state transitions', () => {
    expect(canTransition('OPEN', 'CLAIMED')).toBe(true)
    expect(canTransition('COMPLETED', 'OPEN')).toBe(false)
    expect(canTransition('CLAIMED', 'OPEN')).toBe(true)
  })

  it('converts durations to volunteer hours', () => {
    expect(hoursForDuration(30)).toBe(0.5)
    expect(hoursForDuration(60)).toBe(1)
  })

  it('matches approved volunteers to an availability window', () => {
    const session = { status: 'OPEN' as const, date: '2026-09-09', startTime: '09:00', endTime: '09:30', timezone: 'Asia/Bangkok' }
    expect(isEligibleForSession(session, { approvalStatus: 'approved', timezone: 'America/Toronto', availability: [{ day: 'Wednesday', startTime: '08:00', endTime: '10:00' }] })).toBe(true)
    expect(isEligibleForSession(session, { approvalStatus: 'pending', timezone: 'America/Toronto', availability: [{ day: 'Wednesday', startTime: '08:00', endTime: '10:00' }] })).toBe(false)
  })
})

describe('recurring sessions', () => {
  it('creates independent open occurrences for selected weekdays', () => {
    expect(createOccurrences({ startDate: '2026-09-07', endDate: '2026-09-13', daysOfWeek: [1, 3] })).toEqual([
      { date: '2026-09-07', status: 'OPEN' },
      { date: '2026-09-09', status: 'OPEN' },
    ])
  })
})

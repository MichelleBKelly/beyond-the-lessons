export type Role = 'volunteer' | 'school' | 'admin'

export type ApprovalStatus = 'pending' | 'approved' | 'rejected'

export type SessionStatus =
  | 'DRAFT'
  | 'OPEN'
  | 'CLAIMED'
  | 'CONFIRMED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'NO_VOLUNTEER'
  | 'NO_SHOW'
  | 'DISPUTED'

export interface UserProfile {
  id: string
  email: string
  displayName: string
  role: Role
  approvalStatus: ApprovalStatus
  timezone: string
  createdAt?: string
}

export interface VolunteerProfile {
  firstName: string
  lastName: string
  age: number
  location: string
  timezone: string
  languages: string[]
  englishProficiency: string
  experience: string
  motivation: string
  availability: AvailabilityWindow[]
  agreedToRules: boolean
}

export interface AvailabilityWindow {
  day: string
  startTime: string
  endTime: string
}

export interface Session {
  id: string
  schoolId: string
  schoolName?: string
  seriesId?: string
  classroomName: string
  date: string
  startTime: string
  endTime: string
  timezone: string
  durationMinutes: 30 | 60
  studentCount: number
  topics: string[]
  teacherNotes: string
  meetingUrl?: string
  volunteerId?: string
  volunteerName?: string
  status: SessionStatus
  grade?: string
  englishLevel?: string
  createdAt?: string
  updatedAt?: string
}

export interface Feedback {
  id?: string
  sessionId: string
  authorId: string
  authorRole: 'volunteer' | 'school'
  rating: number
  wentWell: string
  couldImprove: string
  technicalIssues: string
  createdAt?: string
}

export const sessionStatusLabel: Record<SessionStatus, string> = {
  DRAFT: 'Draft',
  OPEN: 'Open for volunteers',
  CLAIMED: 'Claimed',
  CONFIRMED: 'Confirmed',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
  NO_VOLUNTEER: 'No volunteer',
  NO_SHOW: 'No show',
  DISPUTED: 'Needs review',
}

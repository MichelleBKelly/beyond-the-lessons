import { initializeApp } from 'firebase-admin/app'
import { FieldValue, getFirestore } from 'firebase-admin/firestore'
import { onCall, HttpsError } from 'firebase-functions/v2/https'
import { onDocumentCreated, onDocumentUpdated } from 'firebase-functions/v2/firestore'
import { defineSecret } from 'firebase-functions/params'
import { Resend } from 'resend'

initializeApp()
const db = getFirestore()
const resendApiKey = defineSecret('RESEND_API_KEY')

interface SessionData {
  schoolId: string
  classroomName: string
  date: string
  startTime: string
  endTime: string
  timezone: string
  status: string
  volunteerId?: string
  volunteerName?: string
}

interface UserData {
  email?: string
  displayName?: string
  role?: string
  approvalStatus?: string
  availability?: { day: string; startTime: string; endTime: string }[]
}

function eligibleVolunteer(session: SessionData, volunteer: UserData) {
  if (volunteer.role !== 'volunteer' || volunteer.approvalStatus !== 'approved') return false
  if (!volunteer.availability?.length) return true
  const day = new Intl.DateTimeFormat('en-US', { weekday: 'long', timeZone: session.timezone }).format(new Date(`${session.date}T${session.startTime}:00`))
  return volunteer.availability?.some((window) => window.day.toLowerCase() === day.toLowerCase() && window.startTime <= session.startTime && window.endTime >= session.endTime) ?? false
}

async function sendEmail(to: string, subject: string, html: string) {
  const apiKey = resendApiKey.value()
  if (!apiKey) {
    console.warn('RESEND_API_KEY is not configured; skipping notification email.')
    return
  }
  const resend = new Resend(apiKey)
  await resend.emails.send({ from: process.env.NOTIFICATION_FROM_EMAIL ?? 'Beyond the Lessons <notifications@example.org>', to, subject, html })
}

function appUrl(path: string) {
  return `${process.env.FRONTEND_URL ?? 'http://localhost:5173'}${path}`
}

export const notifyEligibleVolunteers = onDocumentCreated({ document: 'sessions/{sessionId}', secrets: [resendApiKey] }, async (event) => {
  const session = event.data?.data() as SessionData | undefined
  if (!session || session.status !== 'OPEN') return
  const volunteers = await db.collection('users').where('role', '==', 'volunteer').where('approvalStatus', '==', 'approved').get()
  await Promise.all(volunteers.docs.map(async (volunteer) => {
    const data = volunteer.data() as UserData
    if (data.email && eligibleVolunteer(session, data)) await sendEmail(data.email, 'A new classroom conversation is available', `<p>Hello ${data.displayName ?? 'volunteer'},</p><p>A new session for ${session.classroomName} is open on ${session.date} from ${session.startTime} to ${session.endTime} (${session.timezone}).</p><p><a href="${appUrl(`/sessions/${event.params.sessionId}`)}">Sign in to view the details and claim it</a> while it is available.</p>`)
  }))
})

export const notifySessionChange = onDocumentUpdated({ document: 'sessions/{sessionId}', secrets: [resendApiKey] }, async (event) => {
  const before = event.data?.before.data() as SessionData | undefined
  const after = event.data?.after.data() as SessionData | undefined
  if (!before || !after || before.status === after.status && before.volunteerId === after.volunteerId) return
  const recipients = new Set<string>()
  const school = await db.doc(`users/${after.schoolId}`).get()
  const schoolData = school.data() as UserData | undefined
  if (schoolData?.email) recipients.add(schoolData.email)
  if (after.volunteerId) {
    const volunteer = await db.doc(`users/${after.volunteerId}`).get()
    const volunteerData = volunteer.data() as UserData | undefined
    if (volunteerData?.email) recipients.add(volunteerData.email)
  }
  await Promise.all([...recipients].map((email) => sendEmail(email, `Session update: ${after.classroomName}`, `<p>The session status is now <strong>${after.status}</strong>.</p>`)))
})

export const claimSession = onCall(async (request) => {
  if (!request.auth?.uid) throw new HttpsError('unauthenticated', 'You must be signed in.')
  const volunteer = await db.doc(`users/${request.auth.uid}`).get()
  const volunteerData = volunteer.data() as UserData | undefined
  if (volunteerData?.role !== 'volunteer' || volunteerData.approvalStatus !== 'approved') throw new HttpsError('permission-denied', 'Only approved volunteers can claim sessions.')
  const sessionId = String(request.data?.sessionId ?? '')
  if (!sessionId) throw new HttpsError('invalid-argument', 'sessionId is required.')
  const reference = db.doc(`sessions/${sessionId}`)
  await db.runTransaction(async (transaction) => {
    const session = await transaction.get(reference)
    if (!session.exists || session.data()?.status !== 'OPEN') throw new HttpsError('failed-precondition', 'This session is no longer open.')
    transaction.update(reference, { volunteerId: request.auth?.uid, volunteerName: volunteerData.displayName ?? '', status: 'CLAIMED', updatedAt: FieldValue.serverTimestamp() })
  })
  return { sessionId, status: 'CLAIMED' }
})

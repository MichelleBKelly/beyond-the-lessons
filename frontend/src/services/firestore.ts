import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
} from 'firebase/firestore'
import { httpsCallable } from 'firebase/functions'
import { db, functions } from '../lib/firebase'
import type { ApprovalStatus, Feedback, Session, UserProfile } from '../types/domain'

function toSession(id: string, data: Record<string, unknown>): Session {
  return { id, ...data } as Session
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const snapshot = await getDoc(doc(db, 'users', userId))
  return snapshot.exists() ? ({ id: snapshot.id, ...snapshot.data() } as UserProfile) : null
}

export async function getUserProfiles(): Promise<UserProfile[]> {
  const snapshot = await getDocs(collection(db, 'users'))
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() } as UserProfile))
}

export async function updateApprovalStatus(userId: string, approvalStatus: ApprovalStatus) {
  await setDoc(doc(db, 'users', userId), { approvalStatus }, { merge: true })
}

export async function updateOwnProfile(userId: string, profile: { displayName: string; timezone: string; availability?: { day: string; startTime: string; endTime: string }[]; schoolName?: string; schoolSize?: string; studentAgeRange?: string; schoolLocation?: string }) {
  await setDoc(doc(db, 'users', userId), profile, { merge: true })
}

export async function getOpenSessions(): Promise<Session[]> {
  const snapshot = await getDocs(query(
    collection(db, 'sessions'),
    where('status', '==', 'OPEN'),
    orderBy('date', 'asc'),
    limit(50),
  ))
  return snapshot.docs.map((item) => toSession(item.id, item.data()))
}

export async function getSession(sessionId: string): Promise<Session | null> {
  const snapshot = await getDoc(doc(db, 'sessions', sessionId))
  return snapshot.exists() ? toSession(snapshot.id, snapshot.data()) : null
}

export async function getSessionsForUser(userId: string, role: 'volunteer' | 'school') {
  const field = role === 'volunteer' ? 'volunteerId' : 'schoolId'
  const snapshot = await getDocs(query(collection(db, 'sessions'), where(field, '==', userId), orderBy('date', 'asc')))
  return snapshot.docs.map((item) => toSession(item.id, item.data()))
}

export async function getAllSessions(): Promise<Session[]> {
  const snapshot = await getDocs(query(collection(db, 'sessions'), orderBy('date', 'asc'), limit(200)))
  return snapshot.docs.map((item) => toSession(item.id, item.data()))
}

export async function createSession(session: Omit<Session, 'id' | 'createdAt' | 'updatedAt'>) {
  const reference = doc(collection(db, 'sessions'))
  await setDoc(reference, { ...session, createdAt: serverTimestamp(), updatedAt: serverTimestamp() })
  return reference.id
}

export async function claimSession(sessionId: string, volunteerId: string, volunteerName: string) {
  void volunteerId
  void volunteerName
  await httpsCallable(functions, 'claimSession')({ sessionId })
}

export async function saveFeedback(feedback: Feedback) {
  const reference = doc(collection(db, 'feedback'))
  await setDoc(reference, { ...feedback, id: reference.id, createdAt: serverTimestamp() })
}

export async function updateSessionStatus(sessionId: string, status: Session['status']) {
  await setDoc(doc(db, 'sessions', sessionId), { status, updatedAt: serverTimestamp() }, { merge: true })
}

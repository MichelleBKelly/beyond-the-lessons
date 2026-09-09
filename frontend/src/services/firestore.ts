import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  setDoc,
  where,
} from 'firebase/firestore'
import { db } from '../lib/firebase'
import type { Feedback, Session, UserProfile } from '../types/domain'

function toSession(id: string, data: Record<string, unknown>): Session {
  return { id, ...data } as Session
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const snapshot = await getDoc(doc(db, 'users', userId))
  return snapshot.exists() ? ({ id: snapshot.id, ...snapshot.data() } as UserProfile) : null
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

export async function createSession(session: Omit<Session, 'id' | 'createdAt' | 'updatedAt'>) {
  const reference = doc(collection(db, 'sessions'))
  await setDoc(reference, { ...session, createdAt: serverTimestamp(), updatedAt: serverTimestamp() })
  return reference.id
}

export async function claimSession(sessionId: string, volunteerId: string, volunteerName: string) {
  await runTransaction(db, async (transaction) => {
    const reference = doc(db, 'sessions', sessionId)
    const snapshot = await transaction.get(reference)
    if (!snapshot.exists() || snapshot.data().status !== 'OPEN') {
      throw new Error('This session has already been claimed or is no longer available.')
    }
    transaction.update(reference, {
      volunteerId,
      volunteerName,
      status: 'CLAIMED',
      updatedAt: serverTimestamp(),
    })
  })
}

export async function saveFeedback(feedback: Feedback) {
  const reference = doc(collection(db, 'feedback'))
  await setDoc(reference, { ...feedback, id: reference.id, createdAt: serverTimestamp() })
}

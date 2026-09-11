import {
  createUserWithEmailAndPassword,
  deleteUser,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth'
import { doc, serverTimestamp, setDoc } from 'firebase/firestore'
import { auth, db } from '../lib/firebase'
import { authErrorMessage } from '../domain/authErrors'
import type { Role } from '../types/domain'

export function getAuthErrorMessage(error: unknown) {
  const code = error instanceof Error && 'code' in error ? String(error.code) : ''
  return authErrorMessage(code)
}

export async function signUp(email: string, password: string, displayName: string, role: Role, profileDetails?: { schoolName?: string; schoolSize?: string; studentAgeRange?: string; schoolLocation?: string }) {
  const credential = await createUserWithEmailAndPassword(auth, email, password)
  await updateProfile(credential.user, { displayName })
  try {
    await setDoc(doc(db, 'users', credential.user.uid), {
      email,
      displayName,
      role,
      approvalStatus: role === 'admin' ? 'approved' : 'pending',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      ...profileDetails,
      createdAt: serverTimestamp(),
    })
  } catch (error) {
    const code = error instanceof Error && 'code' in error ? String(error.code) : 'unknown'
    console.error('Firestore profile creation failed', {
      code,
      message: error instanceof Error ? error.message : error,
      projectId: db.app.options.projectId,
      userId: credential.user.uid,
    })
    await deleteUser(credential.user).catch(() => undefined)
    throw new Error(`Account created, but the Firestore profile could not be saved (${code}). Check the browser console and Firebase rules.`)
  }
  return credential.user
}

export function signIn(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password)
}

export function resetPassword(email: string) {
  return sendPasswordResetEmail(auth, email)
}

export function logOut() {
  return signOut(auth)
}

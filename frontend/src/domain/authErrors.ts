export function authErrorMessage(code: string) {
  const messages: Record<string, string> = {
    'auth/wrong-password': 'The email or password is incorrect.',
    'auth/invalid-credential': 'The email or password is incorrect.',
    'auth/user-not-found': 'The email or password is incorrect.',
    'auth/email-already-in-use': 'An account already exists with this email address.',
    'auth/weak-password': 'Choose a stronger password with at least 6 characters.',
    'auth/invalid-email': 'Enter a valid email address.',
    'auth/too-many-requests': 'Too many attempts. Please wait a moment and try again.',
    'auth/network-request-failed': 'We could not connect. Check that the Firebase services are running.',
  }
  return messages[code] ?? 'We could not complete that request. Please try again.'
}

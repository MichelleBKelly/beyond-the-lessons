import { describe, expect, it } from 'vitest'
import { authErrorMessage } from './authErrors'

describe('auth error messages', () => {
  it('translates common credential errors', () => {
    expect(authErrorMessage('auth/wrong-password')).toBe('The email or password is incorrect.')
    expect(authErrorMessage('auth/email-already-in-use')).toBe('An account already exists with this email address.')
  })

  it('does not expose unknown Firebase errors', () => {
    expect(authErrorMessage('auth/internal-error')).toBe('We could not complete that request. Please try again.')
  })
})

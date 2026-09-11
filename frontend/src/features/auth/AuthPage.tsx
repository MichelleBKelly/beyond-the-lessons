import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { isFirebaseConfigured } from '../../lib/firebase'
import { getAuthErrorMessage, resetPassword, signIn, signUp } from '../../services/auth'
import type { Role } from '../../types/domain'

export function AuthPage() {
  const navigate = useNavigate()
  const params = new URLSearchParams(location.search)
  const [mode, setMode] = useState<'login' | 'signup' | 'reset'>(params.get('mode') === 'signup' ? 'signup' : 'login')
  const [role, setRole] = useState<Role>('volunteer')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [schoolName, setSchoolName] = useState('')
  const [schoolSize, setSchoolSize] = useState('')
  const [studentAgeRange, setStudentAgeRange] = useState('')
  const [schoolLocation, setSchoolLocation] = useState('')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(event: FormEvent) {
    event.preventDefault()
    setBusy(true)
    setMessage('')
    try {
      if (!isFirebaseConfigured) throw new Error('Add your Firebase environment variables to connect this workspace.')
      if (mode === 'reset') {
        await resetPassword(email)
        setMessage('Check your inbox for a password reset link.')
      } else if (mode === 'signup') {
        const profileDetails = role === 'school' ? { schoolName, schoolSize, studentAgeRange, schoolLocation } : undefined
        await signUp(email, password, name, role, profileDetails)
        setMessage('Application received. An admin will review your account.')
      } else {
        await signIn(email, password)
        navigate('/dashboard')
      }
    } catch (error) {
      setMessage(error instanceof Error && !('code' in error) ? error.message : getAuthErrorMessage(error))
    } finally {
      setBusy(false)
    }
  }

  return <main className="auth-page"><Link className="brand" to="/"><span className="brand-mark">B</span><span>Beyond the Lessons</span></Link><div className="auth-card"><p className="eyebrow">{mode === 'signup' ? 'Join the circle' : mode === 'reset' ? 'A fresh start' : 'Welcome back'}</p><h1>{mode === 'signup' ? 'Bring your voice.' : mode === 'reset' ? 'Reset your password.' : 'Good to see you.'}</h1><p className="muted">{mode === 'signup' ? 'Choose how you would like to take part.' : 'Sign in to continue your work.'}</p>{message && <div className="notice">{message}</div>}<form onSubmit={submit}>{mode === 'signup' && <><label>Your name<input required value={name} onChange={(event) => setName(event.target.value)} /></label><label>I am joining as<select value={role} onChange={(event) => setRole(event.target.value as Role)}><option value="volunteer">A volunteer</option><option value="school">A school coordinator</option></select></label>{role === 'school' && <fieldset><legend>About your school</legend><label>School name<input required value={schoolName} onChange={(event) => setSchoolName(event.target.value)} placeholder="School or learning centre" /></label><label>School location<input required value={schoolLocation} onChange={(event) => setSchoolLocation(event.target.value)} placeholder="Province, Thailand" /></label><label>School size<select required value={schoolSize} onChange={(event) => setSchoolSize(event.target.value)}><option value="">Select a range</option><option>1-50 students</option><option>51-150 students</option><option>151-500 students</option><option>500+ students</option></select></label><label>Student age or grade range<input required value={studentAgeRange} onChange={(event) => setStudentAgeRange(event.target.value)} placeholder="e.g. ages 10-12 or Grades 4-6" /></label></fieldset>}</>}<label>Email<input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} /></label>{mode !== 'reset' && <label>Password<input type="password" minLength={6} required value={password} onChange={(event) => setPassword(event.target.value)} /></label>}<button className="button full" disabled={busy}>{busy ? 'Please wait...' : mode === 'signup' ? 'Submit application' : mode === 'reset' ? 'Send reset link' : 'Sign in'} <span>↗</span></button></form><div className="auth-switch">{mode === 'login' && <button onClick={() => setMode('reset')}>Forgot password?</button>}{mode === 'reset' && <button onClick={() => setMode('login')}>Back to sign in</button>}{mode !== 'reset' && <button onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}>{mode === 'login' ? 'Need an account? Join us' : 'Already have an account? Sign in'}</button>}</div></div></main>
}

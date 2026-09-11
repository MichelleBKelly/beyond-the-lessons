import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { updateOwnProfile } from '../../services/firestore'

export function ProfileSettings() {
  const { user, profile } = useAuth()
  const availability = profile?.availability?.[0] ?? { day: 'Wednesday', startTime: '08:00', endTime: '10:00' }
  const [displayName, setDisplayName] = useState(profile?.displayName ?? '')
  const [day, setDay] = useState(availability.day)
  const [startTime, setStartTime] = useState(availability.startTime)
  const [endTime, setEndTime] = useState(availability.endTime)
  const [schoolName, setSchoolName] = useState(profile?.schoolName ?? '')
  const [schoolSize, setSchoolSize] = useState(profile?.schoolSize ?? '')
  const [studentAgeRange, setStudentAgeRange] = useState(profile?.studentAgeRange ?? '')
  const [schoolLocation, setSchoolLocation] = useState(profile?.schoolLocation ?? '')
  const [message, setMessage] = useState('')
  const [saving, setSaving] = useState(false)

  async function save() {
    if (!user || !profile) return
    setSaving(true)
    setMessage('')
    try {
      await updateOwnProfile(user.uid, {
        displayName,
        timezone: profile.timezone,
        ...(profile.role === 'volunteer' ? { availability: [{ day, startTime, endTime }] } : { schoolName, schoolSize, studentAgeRange, schoolLocation }),
      })
      setMessage('Profile updated.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to update your profile.')
    } finally {
      setSaving(false)
    }
  }

  return <section className="dashboard-section profile-settings"><div className="section-heading"><div><p className="eyebrow">Your details</p><h2>Keep your profile current.</h2></div></div>{message && <div className="notice">{message}</div>}<div className="detail-panel"><label>Your name<input value={displayName} onChange={(event) => setDisplayName(event.target.value)} /></label>{profile?.role === 'volunteer' ? <fieldset><legend>Availability</legend><label>Day<select value={day} onChange={(event) => setDay(event.target.value)}><option>Monday</option><option>Tuesday</option><option>Wednesday</option><option>Thursday</option><option>Friday</option></select></label><div className="form-grid"><label>Start time<input type="time" value={startTime} onChange={(event) => setStartTime(event.target.value)} /></label><label>End time<input type="time" value={endTime} onChange={(event) => setEndTime(event.target.value)} /></label></div></fieldset> : profile?.role === 'school' ? <fieldset><legend>School details</legend><label>School name<input value={schoolName} onChange={(event) => setSchoolName(event.target.value)} /></label><label>School location<input value={schoolLocation} onChange={(event) => setSchoolLocation(event.target.value)} /></label><label>School size<select value={schoolSize} onChange={(event) => setSchoolSize(event.target.value)}><option value="">Select a range</option><option>1-50 students</option><option>51-150 students</option><option>151-500 students</option><option>500+ students</option></select></label><label>Student age or grade range<input value={studentAgeRange} onChange={(event) => setStudentAgeRange(event.target.value)} /></label></fieldset> : null}<button className="button" disabled={saving} onClick={() => void save()}>{saving ? 'Saving...' : 'Save profile'}</button></div></section>
}

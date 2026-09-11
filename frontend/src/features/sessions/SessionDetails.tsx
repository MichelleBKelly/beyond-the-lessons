import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getSession, updateSessionStatus } from '../../services/firestore'
import type { Session } from '../../types/domain'
import { sessionStatusLabel } from '../../types/domain'
import { EmptyState } from '../../components/EmptyState'

export function SessionDetails() {
  const { sessionId } = useParams(); const { user, profile } = useAuth(); const [session, setSession] = useState<Session | null>(null); const [loading, setLoading] = useState(true); const [message, setMessage] = useState('')
  useEffect(() => { if (!sessionId) return; void getSession(sessionId).then((result) => { setSession(result); setLoading(false) }).catch(() => setLoading(false)) }, [sessionId])
  if (loading) return <div className="loading-screen">Loading session details...</div>
  if (!session) return <section className="detail-page"><Link className="back-link" to="/dashboard">← Back to overview</Link><EmptyState title="Session not found" text="This session may have been cancelled or is no longer available." /></section>
  const currentSession = session; const canManage = Boolean(user && profile && (profile.role === 'admin' || (profile.role === 'school' && currentSession.schoolId === user.uid)))
  async function changeStatus(status: Session['status']) { try { await updateSessionStatus(currentSession.id, status); setSession((current) => current ? { ...current, status } : current) } catch (error) { setMessage(error instanceof Error ? error.message : 'Unable to update this session.') } }
  return <section className="detail-page"><Link className="back-link" to="/dashboard">← Back to overview</Link><p className="eyebrow">{sessionStatusLabel[currentSession.status]}</p><h1>{currentSession.classroomName}</h1>{message && <div className="notice error">{message}</div>}<div className="detail-panel"><p><strong>{currentSession.date}</strong> at <strong>{currentSession.startTime}</strong> ({currentSession.timezone})</p><p>{currentSession.durationMinutes} minutes · approximately {currentSession.studentCount} students</p><h3>Conversation topics</h3><div className="topic-row">{currentSession.topics.map((topic) => <span key={topic}>{topic}</span>)}</div>{currentSession.teacherNotes && <><h3>Teacher notes</h3><p>{currentSession.teacherNotes}</p></>}{currentSession.meetingUrl && <a className="button" href={currentSession.meetingUrl} target="_blank" rel="noreferrer">Open meeting room ↗</a>}{canManage && (currentSession.status === 'CONFIRMED' || (profile?.role === 'admin' && currentSession.status === 'CLAIMED')) && <button className="button" onClick={() => void changeStatus('COMPLETED')}>Mark completed</button>}{canManage && currentSession.status === 'OPEN' && <button className="button ghost" onClick={() => void changeStatus('CANCELLED')}>Cancel session</button>}{currentSession.status === 'COMPLETED' && <Link className="button" to={`/feedback/${currentSession.id}`}>Leave feedback</Link>}</div></section>
}

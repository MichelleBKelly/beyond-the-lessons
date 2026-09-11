import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'
import type { Session } from '../types/domain'
import { sessionStatusLabel } from '../types/domain'

export function SessionCard({ session, action }: { session: Session; action?: ReactNode }) {
  return <article className="session-card"><div className="session-date"><strong>{new Date(`${session.date}T12:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</strong><span>{session.startTime}</span></div><div className="session-info"><span className={`status status-${session.status.toLowerCase()}`}>{sessionStatusLabel[session.status]}</span><h3>{session.classroomName}</h3><p>{session.schoolName ?? 'Classroom session'} · {session.durationMinutes} minutes</p><div className="topic-row">{session.topics.slice(0, 3).map((topic) => <span key={topic}>{topic}</span>)}</div></div><div className="session-action">{action ?? <Link className="text-link" to={`/sessions/${session.id}`}>View details →</Link>}</div></article>
}

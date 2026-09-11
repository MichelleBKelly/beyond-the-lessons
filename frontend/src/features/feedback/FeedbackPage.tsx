import { useState, type FormEvent } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { saveFeedback } from '../../services/firestore'
import { EmptyState } from '../../components/EmptyState'

export function FeedbackPage() {
  const { sessionId } = useParams(); const { user, profile } = useAuth(); const [sent, setSent] = useState(false); const [message, setMessage] = useState('')
  async function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); if (!user || !profile) return; const form = new FormData(event.currentTarget); try { await saveFeedback({ sessionId: sessionId ?? '', authorId: user.uid, authorRole: profile.role === 'school' ? 'school' : 'volunteer', rating: Number(form.get('rating')), wentWell: String(form.get('wentWell')), couldImprove: String(form.get('couldImprove')), technicalIssues: String(form.get('technicalIssues')) }); setSent(true) } catch (error) { setMessage(error instanceof Error ? error.message : 'Unable to send your feedback.') } }
  return <section className="form-page"><p className="eyebrow">A two-minute reflection</p><h1>How did it feel?</h1>{message && <div className="notice error">{message}</div>}{sent ? <EmptyState title="Thank you for sharing" text="Your reflection helps us make the next conversation better." /> : <form className="long-form narrow-form" onSubmit={(event) => void submit(event)}><label>Overall rating<select name="rating" defaultValue="5"><option value="5">5 · Wonderful</option><option value="4">4 · Good</option><option value="3">3 · Okay</option><option value="2">2 · Difficult</option><option value="1">1 · Not a fit</option></select></label><label>What went well?<textarea name="wentWell" required rows={4} /></label><label>What could improve?<textarea name="couldImprove" required rows={4} /></label><label>Technical issues <span className="optional">optional</span><textarea name="technicalIssues" rows={3} /></label><button className="button">Send reflection <span>↗</span></button></form>}</section>
}

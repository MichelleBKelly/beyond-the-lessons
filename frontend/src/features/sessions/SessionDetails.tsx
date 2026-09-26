import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext";
import { getSession, updateSessionStatus } from "../../services/firestore";
import type { Session } from "../../types/domain";
import { EmptyState } from "../../components/EmptyState";

export function SessionDetails() {
  const { t } = useTranslation();
  const { sessionId } = useParams();
  const { user, profile } = useAuth();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  useEffect(() => {
    if (!sessionId) return;
    void getSession(sessionId)
      .then((result) => {
        setSession(result);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [sessionId]);
  if (loading)
    return <div className="loading-screen">{t("sessions.loading")}</div>;
  if (!session)
    return (
      <section className="detail-page">
        <Link className="back-link" to="/dashboard">
          ← {t("nav.backToOverview")}
        </Link>
        <EmptyState
          title={t("sessions.sessionNotFound")}
          text={t("sessions.noSessionFoundText")}
        />
      </section>
    );
  const currentSession = session;
  const canManage = Boolean(
    user &&
    profile &&
    (profile.role === "admin" ||
      (profile.role === "school" && currentSession.schoolId === user.uid)),
  );
  async function changeStatus(status: Session["status"]) {
    try {
      await updateSessionStatus(currentSession.id, status);
      setSession((current) => (current ? { ...current, status } : current));
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : t("sessions.unableToUpdate"),
      );
    }
  }
  return (
    <section className="detail-page">
      <Link className="back-link" to="/dashboard">
        ← {t("nav.backToOverview")}
      </Link>
      <p className="eyebrow">{t(`sessions.statusTag.${currentSession.status}`)}</p>
      <h1>{currentSession.classroomName}</h1>
      {message && <div className="notice error">{message}</div>}
      <div className="detail-panel">
        <p>
          <strong>{currentSession.date}</strong> {t("sessions.at")} {" "}
          <strong>{currentSession.startTime}</strong> ({currentSession.timezone})
        </p>
        <p>
          {currentSession.durationMinutes} {t("sessions.minutes")} · {t("sessions.approximately")} {" "}
          {currentSession.studentCount} {t("sessions.students")}
        </p>
        <h3>{t("sessions.conversationTopicsLabel")}</h3>
        <div className="topic-row">
          {currentSession.topics.map((topic) => (
            <span key={topic}>{topic}</span>
          ))}
        </div>
        {currentSession.teacherNotes && (
          <>
            <h3>{t("sessions.teacherNotes")}</h3>
            <p>{currentSession.teacherNotes}</p>
          </>
        )}
        {currentSession.meetingUrl && (
          <a
            className="button"
            href={currentSession.meetingUrl}
            target="_blank"
            rel="noreferrer"
          >
            {t("sessions.openMeetingRoom")} ↗
          </a>
        )}
        {canManage &&
          (currentSession.status === "CONFIRMED" ||
            (profile?.role === "admin" &&
              currentSession.status === "CLAIMED")) && (
            <button
              className="button"
              onClick={() => void changeStatus("COMPLETED")}
            >
              {t("sessions.markCompleted")}
            </button>
          )}
        {canManage && currentSession.status === "OPEN" && (
          <button
            className="button ghost"
            onClick={() => void changeStatus("CANCELLED")}
          >
            {t("sessions.cancelSession")}
          </button>
        )}
        {currentSession.status === "COMPLETED" && (
          <Link className="button" to={`/feedback/${currentSession.id}`}>
            {t("sessions.leaveFeedback")}
          </Link>
        )}
      </div>
    </section>
  );
}

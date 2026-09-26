import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { ReactNode } from "react";
import type { Session } from "../types/domain";

export function SessionCard({
  session,
  action,
}: {
  session: Session;
  action?: ReactNode;
}) {
  const { t, i18n } = useTranslation();
  const statusLabel =
    t(`sessions.statusTag.${session.status}`) || session.status;

  return (
    <article className="session-card">
      <div className="session-date">
        <strong>
          {new Date(`${session.date}T12:00:00`).toLocaleDateString(
            i18n.language === "th" ? "th-TH" : "en-US",
            {
              month: "short",
              day: "numeric",
            },
          )}
        </strong>
        <span>{session.startTime}</span>
      </div>
      <div className="session-info">
        <span className={`status status-${session.status.toLowerCase()}`}>
          {statusLabel}
        </span>
        <h3>{session.classroomName}</h3>
        <p>
          {session.schoolName ?? t("sessions.classroomSession")} · {session.durationMinutes}{" "}
          {t("sessions.durationMinutes")}
        </p>
        <div className="topic-row">
          {session.topics.slice(0, 3).map((topic) => (
            <span key={topic}>{topic}</span>
          ))}
        </div>
      </div>
      <div className="session-action">
        {action ?? (
          <Link className="text-link" to={`/sessions/${session.id}`}>
            {t("common.viewDetails")} →
          </Link>
        )}
      </div>
    </article>
  );
}

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext";
import {
  claimSession,
  getAllSessions,
  getOpenSessions,
  getSessionsForUser,
} from "../../services/firestore";
import type { Session } from "../../types/domain";
import { EmptyState } from "../../components/EmptyState";
import { SessionCard } from "../../components/SessionCard";

export function Dashboard() {
  const { user, profile } = useAuth();
  const { t } = useTranslation();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [openSessions, setOpenSessions] = useState<Session[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!user || !profile) return;
    void Promise.all([
      profile.role === "volunteer"
        ? getSessionsForUser(user.uid, "volunteer")
        : profile.role === "school"
          ? getSessionsForUser(user.uid, "school")
          : getAllSessions(),
      profile.role === "volunteer" ? getOpenSessions() : Promise.resolve([]),
    ])
      .then(([mine, open]) => {
        setSessions(mine);
        setOpenSessions(open);
        setLoading(false);
      })
      .catch(() => {
        setMessage(t("dashboard.unableToLoad"));
        setLoading(false);
      });
  }, [user, profile, t]);
  const approved = profile?.approvalStatus === "approved";
  const greeting =
    profile?.role === "school"
      ? t("dashboard.greetingSchool")
      : profile?.role === "admin"
        ? t("dashboard.greetingAdmin")
        : t("dashboard.greetingVolunteer");
  async function claim(id: string) {
    if (!user) return;
    try {
      await claimSession(
        id,
        user.uid,
        profile?.displayName ?? user.email ?? "Volunteer",
      );
      setOpenSessions((current) =>
        current.filter((session) => session.id !== id),
      );
      setMessage(t("dashboard.sessionClaimed"));
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : t("dashboard.unavailable"),
      );
    }
  }
  if (loading)
    return <div className="loading-screen">{t("common.loadingWorkspace")}</div>;
  return (
    <>
      <div className="workspace-heading">
        <div>
          <p className="eyebrow">
            {profile?.role === "school"
              ? t("dashboard.schoolWorkspace")
              : profile?.role === "admin"
                ? t("dashboard.adminWorkspace")
                : t("dashboard.volunteerWorkspace")}
          </p>
          <h1>{greeting}</h1>
          <p className="muted">
            {approved ? t("dashboard.thankYou") : t("dashboard.beingReviewed")}
          </p>
        </div>
        {profile?.role === "school" && approved && (
          <Link className="button" to="/sessions/new">
            {t("common.createSession")} <span>↗</span>
          </Link>
        )}
      </div>
      {message && <div className="notice">{message}</div>}
      {profile?.role === "volunteer" && approved && (
        <section className="dashboard-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">{t("common.openInvitations")}</p>
              <h2>{t("common.findYourNextClassroom")}</h2>
            </div>
            <span className="count">
              {openSessions.length} {t("common.available")}
            </span>
          </div>
          {openSessions.length ? (
            <div className="session-grid">
              {openSessions.map((session) => (
                <SessionCard
                  key={session.id}
                  session={session}
                  action={
                    <button
                      className="button small"
                      onClick={() => void claim(session.id)}
                    >
                      {t("common.claimSession")}
                    </button>
                  }
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title={t("common.noOpenSessionsYet")}
              text={t("common.newOpportunitiesWillAppear")}
            />
          )}
        </section>
      )}
      <section id="sessions" className="dashboard-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">
              {profile?.role === "admin"
                ? t("dashboard.operations")
                : t("dashboard.yourCalendar")}
            </p>
            <h2>
              {profile?.role === "school"
                ? t("dashboard.classroomSessions")
                : profile?.role === "admin"
                  ? t("dashboard.allSessions")
                  : t("dashboard.yourSessions")}
            </h2>
          </div>
        </div>
        {sessions.length ? (
          <div className="session-list">
            {sessions.map((session) => (
              <SessionCard key={session.id} session={session} />
            ))}
          </div>
        ) : (
          <EmptyState
            title={
              profile?.role === "admin"
                ? t("common.noSessionsYet")
                : t("common.yourFirstSessionIsWaiting")
            }
            text={
              approved
                ? t("common.yourSessionMatch")
                : t("common.applicationReview")
            }
          />
        )}
      </section>
      <section id="hours" className="stats-row">
        <div>
          <span className="stat-value">
            {sessions
              .filter((session) => session.status === "COMPLETED")
              .reduce(
                (total, session) =>
                  total + (session.durationMinutes === 60 ? 1 : 0.5),
                0,
              )
              .toFixed(1)}
          </span>
          <span className="stat-label">{t("dashboard.volunteerHours")}</span>
        </div>
        <div>
          <span className="stat-value">
            {
              sessions.filter((session) => session.status === "COMPLETED")
                .length
            }
          </span>
          <span className="stat-label">{t("dashboard.conversationsCompleted")}</span>
        </div>
        <div>
          <span className="stat-value">
            {
              sessions.filter(
                (session) =>
                  session.status === "CONFIRMED" ||
                  session.status === "CLAIMED",
              ).length
            }
          </span>
          <span className="stat-label">{t("dashboard.comingUp")}</span>
        </div>
      </section>
    </>
  );
}

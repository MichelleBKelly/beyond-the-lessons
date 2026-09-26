import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext";
import {
  getUserProfiles,
  updateApprovalStatus,
} from "../../services/firestore";
import { EmptyState } from "../../components/EmptyState";

export function AdminUsers() {
  const { t } = useTranslation();
  const { profile } = useAuth();
  const [users, setUsers] = useState<
    Awaited<ReturnType<typeof getUserProfiles>>
  >([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<
    "pending" | "approved" | "rejected"
  >("pending");

  useEffect(() => {
    if (profile?.role !== "admin") return;
    void getUserProfiles()
      .then((result) => {
        setUsers(
          result.sort(
            (left, right) =>
              Number(right.approvalStatus === "pending") -
              Number(left.approvalStatus === "pending"),
          ),
        );
        setLoading(false);
      })
      .catch(() => {
        setMessage(t("admin.unableToLoad"));
        setLoading(false);
      });
  }, [profile, t]);

  if (profile?.role !== "admin") return <Navigate to="/dashboard" replace />;
  if (loading)
    return <div className="loading-screen">{t("common.loadingApplications")}</div>;

  async function setStatus(
    userId: string,
    approvalStatus: "approved" | "rejected",
  ) {
    setUpdating(userId);
    setMessage("");
    try {
      await updateApprovalStatus(userId, approvalStatus);
      setUsers((current) =>
        current.map((user) =>
          user.id === userId ? { ...user, approvalStatus } : user,
        ),
      );
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : t("admin.unableToUpdate"),
      );
    } finally {
      setUpdating(null);
    }
  }

  const filteredUsers = users.filter(
    (user) => user.approvalStatus === statusFilter,
  );
  const schools = filteredUsers.filter((user) => user.role === "school");
  const volunteers = filteredUsers.filter((user) => user.role === "volunteer");

  function userSection(title: string, sectionUsers: typeof users) {
    return (
      <section className="approval-group">
        <div className="section-heading">
          <div>
            <p className="eyebrow">{t("admin.applications")}</p>
            <h2>{title}</h2>
          </div>
          <span className="count">{sectionUsers.length}</span>
        </div>
        {sectionUsers.length ? (
          <div className="session-list">
            {sectionUsers.map((user) => (
              <article className="session-card" key={user.id}>
                <div className="session-info">
                  <span className={`status status-${user.approvalStatus}`}>
                    {t(`admin.filter.${user.approvalStatus}`)}
                  </span>
                  <h3>{user.displayName || t("admin.unnamedApplicant")}</h3>
                  <p>{user.email}</p>
                </div>
                <div className="session-action">
                  {statusFilter === "pending" ? (
                    <>
                      <button
                        className="button small"
                        disabled={updating === user.id}
                        onClick={() => void setStatus(user.id, "approved")}
                      >
                        {t("common.approve")}
                      </button>
                      <button
                        className="button small ghost"
                        disabled={updating === user.id}
                        onClick={() => void setStatus(user.id, "rejected")}
                      >
                        {t("common.reject")}
                      </button>
                    </>
                  ) : (
                    <button
                      className="button small ghost"
                      disabled={updating === user.id}
                      onClick={() =>
                        void setStatus(
                          user.id,
                          statusFilter === "approved" ? "rejected" : "approved",
                        )
                      }
                    >
                      {statusFilter === "approved"
                        ? t("admin.moveToDenied")
                        : t("admin.approveAgain")}
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="muted">
            {t("admin.noPending").replace("pending", statusFilter)}
          </p>
        )}
      </section>
    );
  }

  return (
    <section className="form-page">
      <p className="eyebrow">{t("dashboard.adminWorkspace")}</p>
      <h1>{t("admin.reviewApplications")}</h1>
      <p className="form-intro">{t("admin.reviewIntro")}</p>
      {message && <div className="notice error">{message}</div>}
      <div
        className="approval-filters"
        role="group"
        aria-label={t("admin.applicationStatus")}
      >
        <button
          className={`filter-button ${statusFilter === "pending" ? "active" : ""}`}
          onClick={() => setStatusFilter("pending")}
        >
          {t("admin.filter.pending")}
        </button>
        <button
          className={`filter-button ${statusFilter === "approved" ? "active" : ""}`}
          onClick={() => setStatusFilter("approved")}
        >
          {t("admin.filter.approved")}
        </button>
        <button
          className={`filter-button ${statusFilter === "rejected" ? "active" : ""}`}
          onClick={() => setStatusFilter("rejected")}
        >
          {t("admin.filter.rejected")}
        </button>
      </div>
      {userSection(t("admin.schoolCoordinators"), schools)}
      {userSection(t("admin.volunteers"), volunteers)}
      {filteredUsers.length === 0 && (
        <EmptyState
          title={t("admin.noApplicationsMatch")}
          text={t("admin.noApplicationsMatch")}
        />
      )}
    </section>
  );
}

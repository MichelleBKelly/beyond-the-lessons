import { Link, Navigate, Route, Routes } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import { logOut } from "../services/auth";
import { AdminUsers } from "../features/admin/AdminUsers";
import { Dashboard } from "../features/dashboard/Dashboard";
import { SessionDetails } from "../features/sessions/SessionDetails";
import { SessionForm } from "../features/sessions/SessionForm";
import { FeedbackPage } from "../features/feedback/FeedbackPage";
import { LanguageToggle } from "../i18n/LanguageToggle";

export function ProtectedLayout() {
  const { t } = useTranslation();
  const { user, profile, loading } = useAuth();
  if (loading)
    return <div className="loading-screen">{t("common.loadingWorkspace")}</div>;
  if (!user) return <Navigate to="/auth?mode=login" replace />;
  return (
    <div className="app-shell">
      <header className="app-header">
        <Link className="brand" to="/dashboard">
          <span className="brand-sun" aria-hidden="true" />
          <span>{t("app.brand")}</span>
        </Link>
        <div className="header-user">
          <LanguageToggle />
          <span>{profile?.displayName ?? user.email}</span>
          <button className="button ghost" onClick={() => void logOut()}>
            {t("nav.logOut")}
          </button>
        </div>
      </header>
      <div className="app-content">
        <aside>
          <Link to="/dashboard">{t("nav.overview")}</Link>
          {profile?.role === "admin" && (
            <Link to="/admin/users">{t("nav.reviewApplications")}</Link>
          )}
          {profile?.role === "school" && (
            <Link to="/sessions/new">{t("nav.createSession")}</Link>
          )}
          <Link to="/dashboard#sessions">{t("nav.mySessions")}</Link>
          <Link to="/dashboard#hours">{t("nav.hoursAndFeedback")}</Link>
        </aside>
        <main className="workspace">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/sessions/new" element={<SessionForm />} />
            <Route path="/sessions/:sessionId" element={<SessionDetails />} />
            <Route path="/feedback/:sessionId" element={<FeedbackPage />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

import { Link, Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { logOut } from "../services/auth";
import { AdminUsers } from "../features/admin/AdminUsers";
import { Dashboard } from "../features/dashboard/Dashboard";
import { SessionDetails } from "../features/sessions/SessionDetails";
import { SessionForm } from "../features/sessions/SessionForm";
import { FeedbackPage } from "../features/feedback/FeedbackPage";

export function ProtectedLayout() {
  const { user, profile, loading } = useAuth();
  if (loading)
    return <div className="loading-screen">Loading your workspace...</div>;
  if (!user) return <Navigate to="/auth?mode=login" replace />;
  return (
    <div className="app-shell">
      <header className="app-header">
        <Link className="brand" to="/dashboard">
          <span className="brand-mark">B</span>
          <span>Beyond the Lessons</span>
        </Link>
        <div className="header-user">
          <span>{profile?.displayName ?? user.email}</span>
          <button className="button ghost" onClick={() => void logOut()}>
            Log out
          </button>
        </div>
      </header>
      <div className="app-content">
        <aside>
          <Link to="/dashboard">Overview</Link>
          {profile?.role === "admin" && (
            <Link to="/admin/users">Review applications</Link>
          )}
          {profile?.role === "school" && (
            <Link to="/sessions/new">Create session</Link>
          )}
          <Link to="/dashboard#sessions">My sessions</Link>
          <Link to="/dashboard#hours">Hours & feedback</Link>
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

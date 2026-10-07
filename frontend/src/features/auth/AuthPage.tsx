import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { isFirebaseConfigured } from "../../lib/firebase";
import {
  getAuthErrorMessage,
  resetPassword,
  signIn,
  signUp,
} from "../../services/auth";
import type { Role } from "../../types/domain";

export function AuthPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const [mode, setMode] = useState<"login" | "signup" | "reset">(
    params.get("mode") === "signup" ? "signup" : "login",
  );
  const [role, setRole] = useState<Role>("volunteer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      if (!isFirebaseConfigured)
        throw new Error(t("auth.messageMissingFirebase"));
      if (mode === "reset") {
        await resetPassword(email);
        setMessage(t("auth.messageResetSent"));
      } else if (mode === "signup") {
        await signUp(email, password, name, role);
        setMessage(t("auth.messageApplicationReceived"));
      } else {
        await signIn(email, password);
        navigate("/dashboard");
      }
    } catch (error) {
      setMessage(
        error instanceof Error && !("code" in error)
          ? error.message
          : getAuthErrorMessage(error),
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="auth-page">
      <Link className="brand" to="/">
        <span>{t("app.brand")}</span>
      </Link>
      <div className="auth-card">
        <h1>
          {mode === "signup"
            ? t("auth.bringYourVoice")
            : mode === "reset"
              ? t("auth.resetPasswordTitle")
              : t("auth.goodToSeeYou")}
        </h1>
        <p className="muted">
          {mode === "signup"
            ? t("auth.signupPrompt")
            : t("auth.signinPrompt")}
        </p>
        {message && <div className="notice">{message}</div>}
        <form onSubmit={submit}>
          {mode === "signup" && (
            <>
              <label>
                {t("auth.yourName")}
                <input
                  required
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              </label>
              <label>
                {t("auth.joiningAs")}
                <select
                  value={role}
                  onChange={(event) => setRole(event.target.value as Role)}
                >
                  <option value="volunteer">{t("auth.volunteer")}</option>
                  <option value="school">{t("auth.school")}</option>
                </select>
              </label>
            </>
          )}
          <label>
            {t("auth.email")}
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>
          {mode !== "reset" && (
            <label>
              {t("auth.password")}
              <input
                type="password"
                minLength={6}
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </label>
          )}
          <button className="button full" disabled={busy}>
            {busy
              ? t("auth.waiting")
              : mode === "signup"
                ? t("auth.submitApplication")
                : mode === "reset"
                  ? t("auth.sendResetLink")
                  : t("auth.signIn")}{" "}
            <span>↗</span>
          </button>
        </form>
        <div className="auth-switch">
          {mode === "login" && (
            <button onClick={() => setMode("reset")}>{t("auth.forgotPassword")}</button>
          )}
          {mode === "reset" && (
            <button onClick={() => setMode("login")}>{t("auth.backToSignIn")}</button>
          )}
          {mode !== "reset" && (
            <button
              onClick={() => setMode(mode === "login" ? "signup" : "login")}
            >
              {mode === "login"
                ? t("auth.needAccount")
                : t("auth.alreadyHaveAccount")}
            </button>
          )}
        </div>
      </div>
    </main>
  );
}

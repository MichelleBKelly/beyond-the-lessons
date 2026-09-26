import { useState, type FormEvent } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext";
import { saveFeedback } from "../../services/firestore";
import { EmptyState } from "../../components/EmptyState";

export function FeedbackPage() {
  const { t } = useTranslation();
  const { sessionId } = useParams();
  const { user, profile } = useAuth();
  const [sent, setSent] = useState(false);
  const [message, setMessage] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user || !profile) return;
    const form = new FormData(event.currentTarget);
    try {
      await saveFeedback({
        sessionId: sessionId ?? "",
        authorId: user.uid,
        authorRole: profile.role === "school" ? "school" : "volunteer",
        rating: Number(form.get("rating")),
        wentWell: String(form.get("wentWell")),
        couldImprove: String(form.get("couldImprove")),
        technicalIssues: String(form.get("technicalIssues")),
      });
      setSent(true);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : t("feedback.unableToSend"),
      );
    }
  }
  return (
    <section className="form-page">
      <p className="eyebrow">{t("feedback.title")}</p>
      <h1>{t("feedback.heading")}</h1>
      {message && <div className="notice error">{message}</div>}
      {sent ? (
        <EmptyState
          title={t("feedback.thankYou")}
          text={t("feedback.reflectionSent")}
        />
      ) : (
        <form
          className="long-form narrow-form"
          onSubmit={(event) => void submit(event)}
        >
          <label>
            {t("feedback.overallRating")}
            <select name="rating" defaultValue="5">
              <option value="5">{t("feedback.rating.5")}</option>
              <option value="4">{t("feedback.rating.4")}</option>
              <option value="3">{t("feedback.rating.3")}</option>
              <option value="2">{t("feedback.rating.2")}</option>
              <option value="1">{t("feedback.rating.1")}</option>
            </select>
          </label>
          <label>
            {t("feedback.whatWentWell")}
            <textarea name="wentWell" required rows={4} />
          </label>
          <label>
            {t("feedback.whatCouldImprove")}
            <textarea name="couldImprove" required rows={4} />
          </label>
          <label>
            {t("feedback.technicalIssues")} <span className="optional">{t("common.optional")}</span>
            <textarea name="technicalIssues" rows={3} />
          </label>
          <button className="button">
            {t("feedback.sendReflection")} <span>↗</span>
          </button>
        </form>
      )}
    </section>
  );
}

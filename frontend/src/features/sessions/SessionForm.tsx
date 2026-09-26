import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext";
import { createSession } from "../../services/firestore";

export function SessionForm() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user) return;
    const form = new FormData(event.currentTarget);
    const topics = String(form.get("topics") ?? "")
      .split(",")
      .map((topic) => topic.trim())
      .filter(Boolean);
    const duration = Number(form.get("duration")) as 30 | 60;
    setBusy(true);
    try {
      await createSession({
        schoolId: user.uid,
        classroomName: String(form.get("classroomName")),
        date: String(form.get("date")),
        startTime: String(form.get("startTime")),
        endTime: String(form.get("endTime")),
        timezone: String(form.get("timezone")),
        durationMinutes: duration,
        studentCount: Number(form.get("studentCount")),
        topics,
        teacherNotes: String(form.get("teacherNotes")),
        meetingUrl: String(form.get("meetingUrl") || ""),
        status: "OPEN",
      });
      navigate("/dashboard");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : t("sessions.unableToUpdate"),
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="form-page">
      <Link className="back-link" to="/dashboard">
        ← {t("nav.backToOverview")}
      </Link>
      <p className="eyebrow">{t("sessions.createTitle")}</p>
      <h1>{t("sessions.createHeading")}</h1>
      <p className="form-intro">{t("sessions.createIntro")}</p>
      {message && <div className="notice error">{message}</div>}
      <form className="long-form" onSubmit={submit}>
        <div className="form-grid">
          <label>
            {t("sessions.classroomOrGroupName")}
            <input
              name="classroomName"
              required
              placeholder={t("placeholders.sessionName")}
            />
          </label>
          <label>
            {t("sessions.studentCount")}
            <input
              name="studentCount"
              type="number"
              min="1"
              required
              placeholder={t("placeholders.studentCount")}
            />
          </label>
          <label>
            {t("sessions.date")}
            <input name="date" type="date" required />
          </label>
          <label>
            {t("sessions.thailandStartTime")}
            <input name="startTime" type="time" required />
          </label>
          <label>
            {t("sessions.thailandEndTime")}
            <input name="endTime" type="time" required />
          </label>
          <label>
            {t("sessions.timezone")}
            <select name="timezone" defaultValue="Asia/Bangkok">
              <option>Asia/Bangkok</option>
              <option>Asia/Manila</option>
              <option>Asia/Singapore</option>
            </select>
          </label>
          <label>
            {t("sessions.duration")}
            <select name="duration" defaultValue="30">
              <option value="30">30 {t("sessions.durationMinutes")}</option>
              <option value="60">60 {t("sessions.durationMinutes")}</option>
            </select>
          </label>
          <label>
            {t("sessions.gradeOrAge")} <span className="optional">{t("common.optional")}</span>
            <input name="grade" placeholder={t("placeholders.gradeAge")} />
          </label>
        </div>
        <label>
          {t("sessions.conversationTopics")} {" "}
          <span className="optional">{t("sessions.separateWithCommas")}</span>
          <input
            name="topics"
            required
            placeholder={t("placeholders.topics")}
          />
        </label>
        <label>
          {t("sessions.teacherNotes")} <span className="optional">{t("common.optional")}</span>
          <textarea
            name="teacherNotes"
            rows={4}
            placeholder={t("placeholders.teacherNotes")}
          />
        </label>
        <label>
          {t("sessions.meetingUrl")} <span className="optional">{t("sessions.googleMeetOrZoom")}</span>
          <input
            name="meetingUrl"
            type="url"
            placeholder={t("placeholders.meetingLink")}
          />
        </label>
        <button className="button" disabled={busy}>
          {busy ? t("common.pleaseWait") : t("common.publish")} <span>↗</span>
        </button>
      </form>
    </section>
  );
}

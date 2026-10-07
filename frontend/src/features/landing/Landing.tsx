import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Step } from "../../components/Step";
import { LanguageToggle } from "../../i18n/LanguageToggle";

export function Landing() {
  const { t } = useTranslation();

  return (
    <main className="landing">
      <header className="site-header">
        <Link className="brand" to="/">
          <span>{t("app.brand")}</span>
        </Link>
        <nav>
          <LanguageToggle />
          <Link to="/auth?mode=login">{t("nav.signIn")}</Link>
          <Link className="button small" to="/auth?mode=signup">
            {t("nav.joinUs")}
            <span>↗</span>
          </Link>
        </nav>
      </header>

      <section className="hero-section">
        <div className="hero-copy">
          <h1>{t("landing.heroTitle")}</h1>
          <p className="hero-lede">{t("landing.heroDescription")}</p>
          <div className="hero-actions">
            <Link className="button" to="/auth?mode=signup">
              {t("nav.joinUs")} <span>↗</span>
            </Link>
            <a className="text-link" href="#how-it-works">
              {t("landing.howItWorks")} <span>↓</span>
            </a>
          </div>
        </div>

        <div className="hero-art">
          <div className="sun"></div>
          <div className="art-card art-card-back">
            {t("landing.differentPlaces")}
            <br />
            <strong>{t("landing.oneConversation")}</strong>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="steps">
        <div>
          <p className="eyebrow">{t("landing.learningBeyondLesson")}</p>
          <h2>{t("landing.goodThingsHappen")}</h2>
        </div>
        <div className="step-grid">
          <Step
            number="01"
            title={t("landing.schoolClassroom")}
            text={t("landing.schoolDescription")}
          />
          <Step
            number="02"
            title={t("landing.volunteersVoice")}
            text={t("landing.volunteerDescription")}
          />
          <Step
            number="03"
            title={t("landing.thenTheyTalk")}
            text={t("landing.talkDescription")}
          />
        </div>
      </section>

      <footer>
        <span>{t("landing.allRights")}</span>
        <a
          href="https://careconnectionthailand.org/"
          target="_blank"
          rel="noreferrer"
        >
          {t("landing.collaboration")} ↗
        </a>
      </footer>
    </main>
  );
}

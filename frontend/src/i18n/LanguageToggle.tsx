import { useTranslation } from "react-i18next";
import { setLanguage, type Language } from "./index";

const languageOptions: Array<{ code: Language; label: string }> = [
  { code: "en", label: "EN" },
  { code: "th", label: "ไทย" },
];

export function LanguageToggle() {
  const { i18n, t } = useTranslation();
  const currentLanguage = i18n.language === "th" ? "th" : "en";

  return (
    <div className="language-toggle" aria-label="Language selection">
      {languageOptions.map((option) => (
        <button
          key={option.code}
          type="button"
          className={`language-option ${currentLanguage === option.code ? "active" : ""}`}
          onClick={() => setLanguage(option.code)}
          aria-pressed={currentLanguage === option.code}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./en";
import th from "./th";

export type Language = "en" | "th";

const STORAGE_KEY = "preferred-language";
const storage =
  typeof window === "undefined" ? null : window.localStorage;

export function getStoredLanguage(): Language {
  const stored = storage?.getItem(STORAGE_KEY);
  if (stored === "en" || stored === "th") {
    return stored;
  }

  return "en";
}

export function setLanguage(language: Language) {
  i18next.changeLanguage(language);
  storage?.setItem(STORAGE_KEY, language);
}

const initialLanguage = getStoredLanguage();

i18next.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    th: { translation: th },
  },
  lng: initialLanguage,
  fallbackLng: "en",
  supportedLngs: ["en", "th"],
  interpolation: {
    escapeValue: false,
  },
});

export default i18next;

import i18next from "../i18n";

export function authErrorMessage(code: string) {
  const messages: Record<string, string> = {
    "auth/wrong-password": i18next.t("errors.wrongPassword"),
    "auth/invalid-credential": i18next.t("errors.wrongPassword"),
    "auth/user-not-found": i18next.t("errors.wrongPassword"),
    "auth/email-already-in-use": i18next.t("errors.emailInUse"),
    "auth/weak-password": i18next.t("errors.weakPassword"),
    "auth/invalid-email": i18next.t("errors.invalidEmail"),
    "auth/too-many-requests": i18next.t("errors.tooManyRequests"),
    "auth/network-request-failed": i18next.t("errors.networkError"),
  };

  return messages[code] ?? i18next.t("errors.generic");
}

import { en } from "./en";
import { pt } from "./pt";

export type Locale = "en" | "pt";

export const locales: Record<Locale, typeof en> = { en, pt };

export function getTranslations(locale: Locale = "en") {
  return locales[locale] ?? en;
}

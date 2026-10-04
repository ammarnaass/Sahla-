import ar from "../../messages/ar.json";
import fr from "../../messages/fr.json";
import en from "../../messages/en.json";

export type SupportedLocale = "ar" | "fr" | "en";

export const LOCALES: { code: SupportedLocale; name: string; nativeName: string; dir: "rtl" | "ltr" }[] = [
  { code: "ar", name: "Arabic", nativeName: "العربية", dir: "rtl" },
  { code: "fr", name: "French", nativeName: "Français", dir: "ltr" },
  { code: "en", name: "English", nativeName: "English", dir: "ltr" },
];

export const translations = {
  ar,
  fr,
  en,
} as const;

export type TranslationKeys = typeof ar;

/**
 * Access nested dictionary with fallback
 */
export function getTranslation(locale: SupportedLocale, section: keyof TranslationKeys, key: string): string {
  const dict = translations[locale] || translations.ar;
  const sec = dict[section] as Record<string, string> | undefined;
  if (sec && sec[key]) {
    return sec[key];
  }
  // Fallback to Arabic
  const fallbackSec = translations.ar[section] as Record<string, string> | undefined;
  if (fallbackSec && fallbackSec[key]) {
    return fallbackSec[key];
  }
  return key;
}

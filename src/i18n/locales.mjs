// The 16 interface languages — the same set as openbiblestories.org.
//
// Plain .mjs (not .ts) so astro.config.mjs and the Node check scripts can
// import it directly. src/i18n/index.ts re-exports it with types.
//
//   code   — URL prefix (/es/…) and the key for src/i18n/ui/{code}.json and
//            src/content/*/{code}/
//   name   — the language's name in that language, shown in the switcher
//   tag    — BCP-47 tag for <html lang> and hreflang
//   dir    — text direction
//   script — which self-hosted font pack the locale needs beyond the Latin
//            faces (see scripts/build-font-css.mjs); 'latin' needs none

/** @typedef {{ code: string, name: string, english: string, tag: string, dir: 'ltr'|'rtl', script: 'latin'|'cyrillic'|'arabic'|'nastaliq'|'devanagari'|'bengali'|'myanmar'|'han' }} LocaleDef */

/** @type {LocaleDef[]} */
export const locales = [
  { code: 'en', name: 'English', english: 'English', tag: 'en', dir: 'ltr', script: 'latin' },
  { code: 'es', name: 'Español', english: 'Spanish', tag: 'es-419', dir: 'ltr', script: 'latin' },
  { code: 'fr', name: 'Français', english: 'French', tag: 'fr', dir: 'ltr', script: 'latin' },
  { code: 'hi', name: 'हिन्दी', english: 'Hindi', tag: 'hi', dir: 'ltr', script: 'devanagari' },
  { code: 'ru', name: 'Русский', english: 'Russian', tag: 'ru', dir: 'ltr', script: 'cyrillic' },
  { code: 'ar', name: 'العربية', english: 'Arabic', tag: 'ar', dir: 'rtl', script: 'arabic' },
  { code: 'zh', name: '简体中文', english: 'Chinese (Simplified)', tag: 'zh-Hans', dir: 'ltr', script: 'han' },
  { code: 'sw', name: 'Kiswahili', english: 'Swahili', tag: 'sw', dir: 'ltr', script: 'latin' },
  { code: 'pt', name: 'Português', english: 'Portuguese', tag: 'pt-BR', dir: 'ltr', script: 'latin' },
  { code: 'id', name: 'Bahasa Indonesia', english: 'Indonesian', tag: 'id', dir: 'ltr', script: 'latin' },
  { code: 'vi', name: 'Tiếng Việt', english: 'Vietnamese', tag: 'vi', dir: 'ltr', script: 'latin' },
  { code: 'bn', name: 'বাংলা', english: 'Bengali', tag: 'bn', dir: 'ltr', script: 'bengali' },
  { code: 'ur', name: 'اردو', english: 'Urdu', tag: 'ur', dir: 'rtl', script: 'nastaliq' },
  { code: 'fa', name: 'فارسی', english: 'Persian', tag: 'fa', dir: 'rtl', script: 'arabic' },
  { code: 'my', name: 'မြန်မာ', english: 'Burmese', tag: 'my', dir: 'ltr', script: 'myanmar' },
  { code: 'nl', name: 'Nederlands', english: 'Dutch', tag: 'nl', dir: 'ltr', script: 'latin' },
];

export const defaultLocale = 'en';
export const localeCodes = locales.map((l) => l.code);

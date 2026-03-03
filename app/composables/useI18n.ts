const STORAGE_KEY = 'mathe-arxaia-lang'

type Locale = 'el' | 'en'

const messages: Record<Locale, Record<string, string>> = {
  el: {},
  en: {},
}

const currentLocale = useState<Locale>('i18n-locale', () => 'el')

export function useI18n() {
  async function loadLocale(locale: Locale) {
    if (Object.keys(messages[locale]).length > 0) return
    try {
      const data = await $fetch<Record<string, string>>(`/locales/${locale}.json`)
      messages[locale] = data ?? {}
    } catch {
      messages[locale] = {}
    }
  }

  function t(key: string): string {
    const msg = messages[currentLocale.value][key]
    return msg ?? key
  }

  function setLocale(locale: Locale) {
    currentLocale.value = locale
    if (import.meta.client && typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, locale)
    }
  }

  function init() {
    if (import.meta.client && typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY) as Locale | null
      if (stored === 'el' || stored === 'en') currentLocale.value = stored
    }
    loadLocale(currentLocale.value)
  }

  return { t, locale: readonly(currentLocale), setLocale, init, loadLocale }
}

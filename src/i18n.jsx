import { createContext, useContext, useEffect } from 'react'
import { SITE_COPY } from './data/siteCopy'

const LanguageContext = createContext(null)

function languageFromPath() {
  return window.location.pathname === '/en' || window.location.pathname.startsWith('/en/') ? 'en' : 'zh'
}

export function LanguageProvider({ children }) {
  const lang = languageFromPath()
  const alternateHref = lang === 'en'
    ? `/${window.location.hash}`
    : `/en/${window.location.hash}`

  useEffect(() => {
    document.documentElement.lang = lang === 'en' ? 'en' : 'zh-Hant-TW'
  }, [lang])

  return (
    <LanguageContext.Provider value={{ lang, isEnglish: lang === 'en', copy: SITE_COPY[lang], alternateHref }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function rememberLanguage(lang) {
  try {
    window.localStorage.setItem('gtourlk.locale', lang)
  } catch {
    // The URL remains the source of truth when storage is unavailable.
  }
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) throw new Error('useLanguage must be used inside LanguageProvider')
  return context
}

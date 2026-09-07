import { createContext, useContext, useEffect, useState } from 'react'
import { SITE_COPY } from './data/siteCopy'

const LanguageContext = createContext(null)

function languageFromPath() {
  return window.location.pathname === '/en' ||
    window.location.pathname.startsWith('/en/')
    ? 'en'
    : 'zh'
}

export function LanguageProvider({
  children,
  initialLang = 'zh',
  renderedAt = Date.now(),
}) {
  const lang = typeof window === 'undefined' ? initialLang : languageFromPath()
  const [hash, setHash] = useState('')
  const [clock, setClock] = useState(renderedAt)
  useEffect(() => {
    const updateHash = () => setHash(window.location.hash)
    updateHash()
    setClock(Date.now())
    window.addEventListener('hashchange', updateHash)
    return () => window.removeEventListener('hashchange', updateHash)
  }, [])
  const alternateHref = lang === 'en' ? `/${hash}` : `/en/${hash}`

  useEffect(() => {
    document.documentElement.lang = lang === 'en' ? 'en' : 'zh-Hant-TW'
  }, [lang])

  return (
    <LanguageContext.Provider
      value={{
        lang,
        isEnglish: lang === 'en',
        copy: SITE_COPY[lang],
        alternateHref,
        clock,
      }}
    >
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
  if (!context)
    throw new Error('useLanguage must be used inside LanguageProvider')
  return context
}

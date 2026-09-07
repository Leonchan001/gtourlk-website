import React from 'react'
import { renderToString } from 'react-dom/server'
import App from './App'
import { LanguageProvider } from './i18n'

export function renderPage(lang, renderedAt) {
  return renderToString(
    <LanguageProvider initialLang={lang} renderedAt={renderedAt}>
      <App />
    </LanguageProvider>,
  )
}

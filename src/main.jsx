import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import './editorial.css'
import { LanguageProvider } from './i18n.jsx'
import { initAnalytics } from './analytics.js'

const root = document.getElementById('root')
const app = (
  <React.StrictMode>
    <LanguageProvider
      renderedAt={Number(root.dataset.renderedAt) || Date.now()}
    >
      <App />
    </LanguageProvider>
  </React.StrictMode>
)

if (root.hasChildNodes()) ReactDOM.hydrateRoot(root, app)
else ReactDOM.createRoot(root).render(app)

// Static HTML first; GA loads after hydration and only with a real ID.
initAnalytics(document.documentElement.lang.startsWith('en') ? 'en' : 'zh')

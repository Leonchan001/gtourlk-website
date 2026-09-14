import { useCallback, useEffect, useState } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import BrandStatement from './components/BrandStatement'
import RouteExplorer from './components/RouteExplorer'
import ExperienceStory from './components/ExperienceStory'
import SocialProof from './components/SocialProof'
import Pricing from './components/Pricing'
import About from './components/About'
import Contact from './components/Contact'
import FAQ from './components/FAQ'
import Footer from './components/Footer'
import FloatingCTA from './components/FloatingCTA'
import CampaignSpotlight from './components/CampaignSpotlight'
import { INITIAL_TRIP, getSights } from './data/booking'
import { useLanguage } from './i18n'
import { cleanPriorities } from './data/preferences'

function readSavedTrip() {
  try {
    const saved = JSON.parse(sessionStorage.getItem('gtourlk.trip') || 'null')
    if (!saved || typeof saved !== 'object') return INITIAL_TRIP
    const known = getSights('zh').map((sight) => sight.id)
    const text = (value, max) =>
      typeof value === 'string' ? value.slice(0, max) : ''
    return {
      ...INITIAL_TRIP,
      date: /^\d{4}-\d{2}-\d{2}$/.test(saved.date) ? saved.date : '',
      departure: /^\d{2}:\d{2}$/.test(saved.departure) ? saved.departure : '',
      people:
        Number.isInteger(saved.people) &&
        saved.people >= 1 &&
        saved.people <= 50
          ? saved.people
          : 2,
      minutes: [60, 90, 150].includes(saved.minutes) ? saved.minutes : 90,
      stops: Array.isArray(saved.stops)
        ? saved.stops.filter((id) => known.includes(id))
        : [],
      guideChoice: saved.guideChoice !== false,
      priorities:
        saved.guideChoice === false
          ? cleanPriorities(
              Array.isArray(saved.stops) ? saved.stops : [],
              saved.priorities,
            )
          : [],
      pickup: text(saved.pickup, 200),
      notes: text(saved.notes, 1000),
    }
  } catch {
    return INITIAL_TRIP
  }
}

export default function App() {
  const { lang } = useLanguage()
  // Match the static HTML first; restore this tab's draft after hydration.
  const [trip, setTrip] = useState(INITIAL_TRIP)
  const [draftReady, setDraftReady] = useState(false)
  useEffect(() => {
    setTrip(readSavedTrip())
    setDraftReady(true)
  }, [])
  useEffect(() => {
    if (!draftReady) return
    try {
      sessionStorage.setItem('gtourlk.trip', JSON.stringify(trip))
    } catch {
      /* The form still works without browser storage. */
    }
  }, [trip, draftReady])
  const updateTrip = useCallback(
    (update) =>
      setTrip((previous) => {
        const next = { ...previous, ...update }
        return {
          ...next,
          priorities: next.guideChoice
            ? []
            : cleanPriorities(next.stops, next.priorities),
        }
      }),
    [],
  )
  const onPlan = () => {
    document.getElementById('contact')?.scrollIntoView({ block: 'start' })
    document.getElementById('booking-title')?.focus({ preventScroll: true })
  }
  useEffect(() => {
    const scrollToHash = () => {
      let id
      try {
        id = decodeURIComponent(window.location.hash.slice(1))
      } catch {
        return
      }
      if (id)
        requestAnimationFrame(() =>
          document.getElementById(id)?.scrollIntoView({ block: 'start' }),
        )
    }
    scrollToHash()
    window.addEventListener('hashchange', scrollToHash)
    return () => window.removeEventListener('hashchange', scrollToHash)
  }, [])
  return (
    <>
      <a className="skip-link" href="#main-content">
        {lang === 'zh' ? '跳到主要內容' : 'Skip to content'}
      </a>
      <Header />
      <main id="main-content" tabIndex="-1">
        <Hero />
        <CampaignSpotlight />
        <BrandStatement />
        <RouteExplorer trip={trip} updateTrip={updateTrip} onPlan={onPlan} />
        <ExperienceStory />
        <SocialProof />
        <Pricing onBook={onPlan} />
        <About />
        <Contact trip={trip} updateTrip={updateTrip} />
        <FAQ />
      </main>
      <Footer />
      <FloatingCTA />
    </>
  )
}

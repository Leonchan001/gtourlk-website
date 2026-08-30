import { useEffect, useState } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import Services from './components/Services'
import SocialProof from './components/SocialProof'
import About from './components/About'
import FAQ from './components/FAQ'
import Contact from './components/Contact'
import Footer from './components/Footer'
import FloatingCTA from './components/FloatingCTA'
import CampaignSpotlight, { CampaignNotice } from './components/CampaignSpotlight'

export default function App() {
  const [selectedPlan, setSelectedPlan] = useState(null)

  useEffect(() => {
    function scrollToHash() {
      const id = decodeURIComponent(window.location.hash.slice(1))
      if (!id) return

      window.requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ block: 'start' })
      })
    }

    scrollToHash()
    const retry = window.setTimeout(scrollToHash, 800)
    window.addEventListener('load', scrollToHash)
    window.addEventListener('hashchange', scrollToHash)
    return () => {
      window.clearTimeout(retry)
      window.removeEventListener('load', scrollToHash)
      window.removeEventListener('hashchange', scrollToHash)
    }
  }, [])

  return (
    <div className="min-h-screen bg-paper-50 text-ink-700">
      <Header />
      <main>
        <Hero />
        <CampaignNotice />
        <Services setSelectedPlan={setSelectedPlan} />
        <CampaignSpotlight />
        <SocialProof />
        <About />
        <FAQ />
        <Contact selectedPlan={selectedPlan} clearPlan={() => setSelectedPlan(null)} />
      </main>
      <Footer />
      <FloatingCTA />
    </div>
  )
}

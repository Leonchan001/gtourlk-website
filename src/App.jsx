import { useState } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import Services from './components/Services'
import SocialProof from './components/SocialProof'
import About from './components/About'
import FAQ from './components/FAQ'
import Contact from './components/Contact'
import Footer from './components/Footer'
import FloatingCTA from './components/FloatingCTA'

export default function App() {
  const [selectedPlan, setSelectedPlan] = useState(null)

  return (
    <div className="min-h-screen bg-paper-50 text-ink-700">
      <Header />
      <main>
        <Hero />
        <Services setSelectedPlan={setSelectedPlan} />
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

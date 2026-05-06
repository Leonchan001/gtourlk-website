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
  return (
    <div className="min-h-screen bg-paper-50 text-ink-700">
      <Header />
      <main>
        <Hero />
        <Services />
        <SocialProof />
        <About />
        <FAQ />
        <Contact />
      </main>
      <Footer />
      <FloatingCTA />
    </div>
  )
}

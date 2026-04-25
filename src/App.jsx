import Header from './components/Header'
import Hero from './components/Hero'
import SocialProof from './components/SocialProof'
import Services from './components/Services'
import About from './components/About'
import Contact from './components/Contact'
import Footer from './components/Footer'
import FloatingCTA from './components/FloatingCTA'

export default function App() {
  return (
    <div className="min-h-screen bg-cream-50">
      <Header />
      <main>
        <Hero />
        <SocialProof />
        <Services />
        <About />
        <Contact />
      </main>
      <Footer />
      <FloatingCTA />
    </div>
  )
}

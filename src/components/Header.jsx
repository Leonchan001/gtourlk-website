import { useState, useEffect } from 'react'
import logoImg from '/gtourlk-logo.png'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const nav = [
    { href: '#services', label: '導覽方案' },
    { href: '#reviews', label: '五星評價' },
    { href: '#about', label: '關於導鹿' },
    { href: '#contact', label: '聯絡預約' },
  ]

  return (
    <header className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${
      scrolled ? 'bg-cream-50/95 backdrop-blur shadow-md py-3' : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-5 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-3">
          <img src={logoImg} alt="導鹿 GtourLK Logo" className="h-12 w-auto" />
          <div className={`leading-tight ${scrolled ? 'text-forest-800' : 'text-cream-50'}`}>
            <div className="font-serif font-bold text-lg">導鹿 GtourLK</div>
            <div className="text-xs opacity-80">鹿港三輪車觀光導覽</div>
          </div>
        </a>

        <nav className="hidden md:flex items-center gap-8">
          {nav.map(item => (
            <a
              key={item.href}
              href={item.href}
              className={`text-sm font-medium hover:text-amber-500 transition-colors ${
                scrolled ? 'text-forest-700' : 'text-cream-50'
              }`}
            >
              {item.label}
            </a>
          ))}
          <a href="#contact" className="btn-primary !py-2 !px-5 text-sm">
            立即預約
          </a>
        </nav>

        <button
          className={`md:hidden p-2 ${scrolled ? 'text-forest-800' : 'text-cream-50'}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="選單"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path aria-hidden="true" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-cream-50 shadow-lg border-t border-amber-100">
          <div className="flex flex-col px-5 py-4 gap-3">
            {nav.map(item => (
              <a key={item.href} href={item.href}
                onClick={() => setMenuOpen(false)}
                className="text-forest-700 py-2 border-b border-forest-100">
                {item.label}
              </a>
            ))}
            <a href="#contact" onClick={() => setMenuOpen(false)}
              className="btn-primary justify-center mt-2">立即預約</a>
          </div>
        </div>
      )}
    </header>
  )
}

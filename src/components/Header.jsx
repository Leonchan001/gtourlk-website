import { useState, useEffect } from 'react'
import logoImg from '/gtourlk-logo.png'

const PHONES = [
  { label: '王姐', tel: '+886927013167', display: '0927-013-167' },
  { label: '小郭', tel: '+886927291828', display: '0927-291-828' },
  { label: '店面', tel: '+88647740142',  display: '(04) 7740-142' },
]

const NAV = [
  { href: '#experience', label: '導覽行程', en: 'Experiences' },
  { href: '#reviews',    label: '旅人評價', en: 'Reviews' },
  { href: '#about',      label: '關於我們', en: 'About' },
  { href: '#contact',    label: '預約聯絡', en: 'Contact' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className="fixed top-0 inset-x-0 z-40">
      {/* 上方細線資訊條 — 三隻電話 */}
      <div className={`hidden md:block border-b transition-colors duration-300 ${
        scrolled ? 'bg-paper-50 border-ink-100' : 'bg-ink-800/40 backdrop-blur-sm border-white/10'
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between py-2 text-[12px]">
          <div className={`flex items-center gap-5 ${scrolled ? 'text-ink-400' : 'text-paper-100/80'}`}>
            <span className="font-mono tracking-widest uppercase">Lukang · Changhua · Taiwan</span>
            <span className={`h-3 w-px ${scrolled ? 'bg-ink-200' : 'bg-paper-100/30'}`} />
            <span>每日 08:00 — 19:00</span>
          </div>
          <div className={`flex items-center gap-4 ${scrolled ? 'text-ink-500' : 'text-paper-100/90'}`}>
            {PHONES.map((p, i) => (
              <a
                key={p.tel}
                href={`tel:${p.tel}`}
                className={`group flex items-center gap-1.5 hover:text-brick-400 transition-colors ${
                  i > 0 ? 'pl-4 border-l border-current/20' : ''
                }`}
              >
                <span className="font-mono tracking-wider">{p.display}</span>
                <span className="text-[10px] opacity-60">{p.label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* 主導航列 */}
      <div className={`transition-colors duration-300 ${
        scrolled ? 'bg-paper-50 border-b border-ink-100' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between py-4">
          {/* Logo 區 */}
          <a href="#top" className="flex items-center gap-3">
            <img src={logoImg} alt="導鹿 GtourLK" className="h-10 w-auto" />
            <div className={`leading-tight ${scrolled ? 'text-ink-800' : 'text-paper-50'}`}>
              <div className="font-display text-lg tracking-wide">GtourLK</div>
              <div className="font-serif text-[11px] tracking-[0.2em] opacity-70">導 · 鹿</div>
            </div>
          </a>

          {/* 桌機導航 */}
          <nav className="hidden md:flex items-center gap-9">
            {NAV.map(item => (
              <a
                key={item.href}
                href={item.href}
                className={`group text-sm transition-colors ${
                  scrolled ? 'text-ink-600 hover:text-brick-500' : 'text-paper-50 hover:text-paper-200'
                }`}
              >
                <span>{item.label}</span>
              </a>
            ))}
            <a
              href="#contact"
              className={`text-sm font-medium tracking-wider px-5 py-2.5 transition-colors ${
                scrolled
                  ? 'bg-brick-500 text-paper-50 hover:bg-brick-600'
                  : 'border border-paper-50 text-paper-50 hover:bg-paper-50 hover:text-ink-800'
              }`}
            >
              立即預約
            </a>
          </nav>

          {/* 手機選單按鈕 */}
          <button
            className={`md:hidden p-2 -mr-2 ${scrolled ? 'text-ink-800' : 'text-paper-50'}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="選單"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path aria-hidden="true" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 7h16M4 12h16M4 17h16"} />
            </svg>
          </button>
        </div>
      </div>

      {/* 手機選單 */}
      {menuOpen && (
        <div className="md:hidden bg-paper-50 border-b border-ink-100">
          <div className="px-6 py-6 flex flex-col">
            {NAV.map((item, i) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="flex items-baseline justify-between py-4 border-b border-ink-100 group"
              >
                <span className="text-ink-800 text-base">{item.label}</span>
                <span className="font-mono text-[10px] tracking-widest uppercase text-ink-300">
                  0{i + 1} · {item.en}
                </span>
              </a>
            ))}

            <div className="mt-6 space-y-2">
              {PHONES.map(p => (
                <a key={p.tel} href={`tel:${p.tel}`}
                  className="flex items-center justify-between py-2 text-ink-600">
                  <span className="text-[11px] uppercase tracking-widest text-ink-400">{p.label}</span>
                  <span className="font-mono">{p.display}</span>
                </a>
              ))}
            </div>

            <a
              href="#contact"
              onClick={() => setMenuOpen(false)}
              className="btn-primary mt-6 w-full"
            >
              立即預約導覽
            </a>
          </div>
        </div>
      )}
    </header>
  )
}

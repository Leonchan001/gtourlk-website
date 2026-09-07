import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '../i18n'
import LanguageSwitcher from './LanguageSwitcher'
export default function Header() {
  const { copy, lang } = useLanguage()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const toggle = useRef(null)
  const header = useRef(null)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  useEffect(() => {
    if (!open) return
    const onKey = (event) => {
      if (event.key === 'Escape') {
        setOpen(false)
        toggle.current?.focus()
      }
    }
    const onPointer = (event) => {
      if (!header.current?.contains(event.target)) setOpen(false)
    }
    const onResize = () => {
      if (window.innerWidth >= 1024) setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('pointerdown', onPointer)
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('pointerdown', onPointer)
      window.removeEventListener('resize', onResize)
    }
  }, [open])
  return (
    <header
      ref={header}
      className={`site-header ${scrolled || open ? 'is-solid' : ''}`}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false)
      }}
    >
      <div className="header-inner">
        <a
          href="#top"
          className="brand-lockup"
          aria-label={
            lang === 'zh' ? 'GtourLK 導 鹿 首頁' : 'GtourLK 導 鹿 home'
          }
        >
          <img src="/media/logo-header.webp" width="34" height="40" alt="" />
          <span>
            GtourLK<small lang="zh-Hant">導 鹿</small>
          </span>
        </a>
        <nav
          className="desktop-nav"
          aria-label={lang === 'zh' ? '主要導覽' : 'Main navigation'}
        >
          {copy.header.nav.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
        <div className="header-tools">
          <LanguageSwitcher />
          <a className="header-book" href="#contact">
            {lang === 'zh' ? '預約導覽' : 'Plan a visit'}{' '}
            <span aria-hidden="true">↗</span>
          </a>
          <button
            ref={toggle}
            className="menu-toggle"
            type="button"
            aria-expanded={open}
            aria-controls="mobile-navigation"
            aria-label={open ? copy.header.closeMenu : copy.header.menu}
            onClick={() => setOpen(!open)}
          >
            {open ? '×' : <span className="menu-lines" aria-hidden="true" />}
          </button>
        </div>
      </div>
      {open && (
        <nav
          className="mobile-nav"
          id="mobile-navigation"
          aria-label={lang === 'zh' ? '手機導覽' : 'Mobile navigation'}
        >
          {copy.header.nav.map((item, i) => (
            <a key={item.href} href={item.href} onClick={() => setOpen(false)}>
              <small>0{i + 1}</small>
              {item.label}
              <span aria-hidden="true">↗</span>
            </a>
          ))}
        </nav>
      )}
    </header>
  )
}

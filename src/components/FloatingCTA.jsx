import { useState, useEffect } from 'react'
import { BUSINESS } from '../data/business'

export default function FloatingCTA() {
  const [show, setShow] = useState(false)
  const [nearContact, setNearContact] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setShow(window.scrollY > 600)
      const contact = document.getElementById('contact')
      setNearContact(Boolean(contact) && window.scrollY + window.innerHeight * 0.75 >= contact.offsetTop)
    }
    window.addEventListener('scroll', onScroll)
    window.addEventListener('resize', onScroll)
    onScroll()
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  if (!show || nearContact) return null

  return (
    <>
      <a
        href={BUSINESS.lineUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="md:hidden fixed bottom-4 right-4 z-50 inline-flex min-h-12 items-center gap-3 rounded-full bg-brick-500 px-5 py-3 text-paper-50 shadow-xl"
      >
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-paper-50 text-xs font-bold text-brick-600">L</span>
        <span className="text-sm font-medium tracking-wider">LINE 預約</span>
        <span aria-hidden="true">→</span>
      </a>

      <div className="hidden md:flex fixed bottom-6 right-6 z-50 items-center gap-2">
        <a
          href={`tel:${BUSINESS.phones[0].tel}`}
          aria-label={`撥打 ${BUSINESS.phones[0].display}`}
          className="w-12 h-12 bg-paper-50 border border-ink-200 hover:border-brick-500 text-ink-700 hover:text-brick-500 shadow-lg transition-colors flex items-center justify-center"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
          </svg>
        </a>
        <a
          href={BUSINESS.lineUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 bg-ink-800 hover:bg-ink-900 text-paper-50 pl-5 pr-4 py-3 shadow-lg transition-colors"
        >
          <span className="text-sm tracking-wider">LINE 預約</span>
          <span className="font-mono text-[10px] tracking-widest text-paper-200/70 uppercase">{BUSINESS.lineId}</span>
        </a>
      </div>
    </>
  )
}

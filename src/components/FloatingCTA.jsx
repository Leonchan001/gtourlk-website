import { useState, useEffect } from 'react'

export default function FloatingCTA() {
  const [open, setOpen] = useState(false)
  const [show, setShow] = useState(false)

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 300)
    window.addEventListener('scroll', onScroll)
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!show) return null

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="flex flex-col gap-3 animate-fade-in-up">
          <a
            href="https://line.me/R/ti/p/@137ebkaq"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 bg-[#06C755] hover:bg-[#04a444] text-white px-5 py-3 rounded-full shadow-xl transition-all"
          >
            <span className="font-bold text-sm">LINE 預約</span>
            <div className="w-9 h-9 bg-white text-[#06C755] rounded-full flex items-center justify-center font-black text-xs">
              LINE
            </div>
          </a>

          <a
            href="tel:+886927013167"
            className="group flex items-center gap-3 bg-amber-500 hover:bg-amber-600 text-white px-5 py-3 rounded-full shadow-xl transition-all"
          >
            <span className="font-bold text-sm">0927-013-167</span>
            <div className="w-9 h-9 bg-white text-amber-600 rounded-full flex items-center justify-center text-lg">
              📞
            </div>
          </a>

          <a
            href="https://www.google.com/maps/search/?api=1&query=505彰化縣鹿港鎮永寧街236號"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 bg-forest-700 hover:bg-forest-800 text-white px-5 py-3 rounded-full shadow-xl transition-all"
          >
            <span className="font-bold text-sm">Google 導航</span>
            <div className="w-9 h-9 bg-white text-forest-700 rounded-full flex items-center justify-center text-lg">
              📍
            </div>
          </a>
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        aria-label="立即預約"
        className={`relative w-16 h-16 rounded-full shadow-2xl transition-all hover:scale-110 ${
          open
            ? 'bg-forest-800 text-cream-50'
            : 'bg-amber-500 text-forest-900 animate-float'
        }`}
      >
        {!open && (
          <span className="absolute inset-0 rounded-full bg-amber-500 animate-ping opacity-40" />
        )}

        <div className="relative flex items-center justify-center w-full h-full">
          {open ? (
            <svg className="w-7 h-7" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <div className="text-center leading-tight">
              <div className="text-xs font-bold">立即</div>
              <div className="text-xs font-bold">預約</div>
            </div>
          )}
        </div>
      </button>
    </div>
  )
}
